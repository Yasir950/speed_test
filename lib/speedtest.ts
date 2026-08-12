// Core measurement logic, kept framework-agnostic so it's easy to unit test
// or reuse outside the React component tree.
//
// PRIMARY ENGINE: Cloudflare's public speed test infrastructure
// (@cloudflare/speedtest, published by Cloudflare, MIT licensed). This is
// the same engine that powers speed.cloudflare.com. Using it instead of our
// own single server is the fix for "results don't match other sites":
// Cloudflare's network has 300+ edge locations globally and the library
// automatically measures against the nearest one, which is exactly the kind
// of smart server selection that makes Speedtest.net/Ookla accurate. A
// single self-hosted server can never match that unless it's deployed on
// similarly distributed infrastructure.
//
// FALLBACK: if the Cloudflare engine errors out (corporate firewall,
// network blocking third-party domains, offline dev environment, etc.),
// we automatically fall back to testing against this app's own /api routes
// further down in this file, so the tool still works either way.

import SpeedTestEngine, { type MeasurementType } from "@cloudflare/speedtest";

export interface FullSpeedTestResult {
  pingMs: number | null;
  jitterMs: number | null;
  downloadMbps: number | null;
  uploadMbps: number | null;
  engine: "cloudflare" | "fallback";
}

export type SpeedTestPhase = "latency" | "download" | "upload" | "done";

export interface SpeedTestUpdate {
  phase: SpeedTestPhase;
  result: FullSpeedTestResult;
  fraction: number; // 0..1 rough progress through the whole test
}

const CF_PHASE_ORDER: MeasurementType[] = ["latency", "download", "upload"];

function summaryToResult(
  summary: { latency?: number; jitter?: number; download?: number; upload?: number },
  engine: "cloudflare" | "fallback"
): FullSpeedTestResult {
  return {
    pingMs: summary.latency ?? null,
    jitterMs: summary.jitter ?? null,
    downloadMbps: summary.download != null ? summary.download / 1_000_000 : null,
    uploadMbps: summary.upload != null ? summary.upload / 1_000_000 : null,
    engine,
  };
}

/**
 * Runs a full test (latency, download, upload) against Cloudflare's public
 * network. Resolves with the final result; calls onUpdate as partial
 * results stream in so the UI can animate live.
 */
export function runCloudflareSpeedTest(
  onUpdate: (update: SpeedTestUpdate) => void
): Promise<FullSpeedTestResult> {
  return new Promise((resolve, reject) => {
    const engine = new SpeedTestEngine({ autoStart: false });
    let currentPhase: SpeedTestPhase = "latency";
    let currentStepIndex = 0;

    engine.onPhaseChange = ({ measurementId, measurement }) => {
      currentStepIndex = measurementId;
      if (measurement.type === "download") currentPhase = "download";
      else if (measurement.type === "upload") currentPhase = "upload";
      else currentPhase = "latency";
    };

    engine.onResultsChange = () => {
      const summary = engine.results.getSummary();
      const totalSteps = CF_PHASE_ORDER.length * 4; // rough estimate for a progress bar
      onUpdate({
        phase: currentPhase,
        result: summaryToResult(summary, "cloudflare"),
        fraction: Math.min(1, currentStepIndex / totalSteps),
      });
    };

    engine.onError = (message: string) => {
      reject(new Error(`Cloudflare speed test failed: ${message}`));
    };

    engine.onFinish = (results) => {
      resolve(summaryToResult(results.getSummary(), "cloudflare"));
    };

    engine.play();
  });
}

// ---------------------------------------------------------------------------
// FALLBACK ENGINE — tests against this app's own /api routes.
// Kept as a safety net for networks that block third-party speed-test
// domains outright. Not the primary path anymore; see runCloudflareSpeedTest
// above for why.
// ---------------------------------------------------------------------------

export interface PingResult {
  pingMs: number;
  jitterMs: number;
  samples: number[];
}

export interface ThroughputResult {
  mbps: number;
  bytes: number;
  seconds: number;
}

export type ProgressCallback = (mbpsSoFar: number, fractionDone: number) => void;

/**
 * Measures latency by timing several small round-trips to /api/ping.
 * Jitter is the mean absolute deviation between consecutive samples,
 * which is a more honest "connection stability" number than stddev
 * for small sample counts.
 */
export async function measurePing(samples = 8): Promise<PingResult> {
  const times: number[] = [];

  for (let i = 0; i < samples; i++) {
    const start = performance.now();
    await fetch(`/api/ping?_=${Date.now()}-${i}`, { cache: "no-store" });
    times.push(performance.now() - start);
  }

  const sorted = [...times].sort((a, b) => a - b);
  // Drop the single slowest sample -- almost always a cold-start/TCP-handshake
  // outlier on the first request, not representative latency.
  const trimmed = sorted.slice(0, Math.max(1, sorted.length - 1));

  const pingMs = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;

  let jitterSum = 0;
  for (let i = 1; i < trimmed.length; i++) {
    jitterSum += Math.abs(trimmed[i] - trimmed[i - 1]);
  }
  const jitterMs = trimmed.length > 1 ? jitterSum / (trimmed.length - 1) : 0;

  return { pingMs, jitterMs, samples: times };
}

/**
 * Downloads using several PARALLEL connections at once, the same approach
 * Ookla/Speedtest-style tools use. A single TCP connection can't saturate
 * high-bandwidth, higher-latency links (the bandwidth-delay product limits
 * one stream well below the link's real capacity), so multi-connection
 * testing is what real-world usage (browsers opening many connections at
 * once) and industry tools both do -- it's the fairer, more comparable
 * measurement, not a trick to inflate the number.
 */
export async function measureDownload(
  onProgress?: ProgressCallback,
  totalTargetBytes = 48 * 1024 * 1024,
  concurrency = 4
): Promise<ThroughputResult> {
  const perStream = Math.floor(totalTargetBytes / concurrency);
  const overallStart = performance.now();
  const loadedPerStream = new Array(concurrency).fill(0);

  function reportProgress() {
    const bytesLoaded = loadedPerStream.reduce((a, b) => a + b, 0);
    const elapsed = (performance.now() - overallStart) / 1000;
    const mbps = elapsed > 0 ? (bytesLoaded * 8) / elapsed / 1_000_000 : 0;
    onProgress?.(mbps, Math.min(1, bytesLoaded / totalTargetBytes));
    return bytesLoaded;
  }

  async function runStream(index: number) {
    const res = await fetch(
      `/api/download?bytes=${perStream}&_=${Date.now()}-${index}`,
      { cache: "no-store" }
    );
    const reader = res.body?.getReader();
    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        loadedPerStream[index] += value.byteLength;
        reportProgress();
      }
    }
  }

  await Promise.all(
    Array.from({ length: concurrency }, (_, i) => runStream(i))
  );

  const bytesLoaded = reportProgress();
  const seconds = (performance.now() - overallStart) / 1000;
  const mbps = seconds > 0 ? (bytesLoaded * 8) / seconds / 1_000_000 : 0;
  return { mbps, bytes: bytesLoaded, seconds };
}

/**
 * Uploads using several parallel XHR connections (XHR specifically because
 * it exposes upload progress events, which fetch() does not). Each stream
 * sends freshly-generated random bytes -- never a repeated block -- so the
 * payload can't be compressed away by a proxy the way the download bug was.
 */
export function measureUpload(
  onProgress?: ProgressCallback,
  totalTargetBytes = 24 * 1024 * 1024,
  concurrency = 3
): Promise<ThroughputResult> {
  const perStream = Math.floor(totalTargetBytes / concurrency);
  const overallStart = performance.now();
  const sentPerStream = new Array(concurrency).fill(0);

  function makeRandomPayload(size: number): Uint8Array {
    const payload = new Uint8Array(size);
    // crypto.getRandomValues caps out around 64KB per call in browsers,
    // so fill in windows -- each window is freshly randomized, no reuse.
    const MAX_WINDOW = 65536;
    for (let offset = 0; offset < size; offset += MAX_WINDOW) {
      const end = Math.min(offset + MAX_WINDOW, size);
      crypto.getRandomValues(payload.subarray(offset, end));
    }
    return payload;
  }

  function reportProgress() {
    const bytesSent = sentPerStream.reduce((a, b) => a + b, 0);
    const elapsed = (performance.now() - overallStart) / 1000;
    const mbps = elapsed > 0 ? (bytesSent * 8) / elapsed / 1_000_000 : 0;
    onProgress?.(mbps, Math.min(1, bytesSent / totalTargetBytes));
  }

  function runStream(index: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const payload = makeRandomPayload(perStream);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `/api/upload?_=${Date.now()}-${index}`, true);
      let lastLoaded = 0;
      xhr.upload.onprogress = (e) => {
        if (!e.lengthComputable) return;
        sentPerStream[index] = e.loaded;
        lastLoaded = e.loaded;
        reportProgress();
      };
      xhr.onload = () => {
        sentPerStream[index] = Math.max(lastLoaded, perStream);
        resolve();
      };
      xhr.onerror = () => reject(new Error("Upload test failed"));
      xhr.send(payload.buffer as ArrayBuffer);
    });
  }

  return Promise.all(
    Array.from({ length: concurrency }, (_, i) => runStream(i))
  ).then(() => {
    const bytesSent = sentPerStream.reduce((a, b) => a + b, 0);
    const seconds = (performance.now() - overallStart) / 1000;
    const mbps = seconds > 0 ? (bytesSent * 8) / seconds / 1_000_000 : 0;
    return { mbps, bytes: bytesSent, seconds };
  });
}

export interface NetworkInfoSnapshot {
  effectiveType: string | null;
  downlinkMbps: number | null;
  rttMs: number | null;
  saveData: boolean | null;
  connectionTypeHint: string | null;
}

/**
 * Reads whatever the Network Information API exposes. Support is
 * Chromium-only and values are coarse estimates supplied by the browser,
 * never a real device count on the LAN -- that data simply is not
 * reachable from a web page for privacy/security reasons.
 */
export function readNetworkInfo(): NetworkInfoSnapshot {
  const nav = navigator as Navigator & {
    connection?: {
      effectiveType?: string;
      downlink?: number;
      rtt?: number;
      saveData?: boolean;
      type?: string;
    };
  };
  const conn = nav.connection;

  if (!conn) {
    return {
      effectiveType: null,
      downlinkMbps: null,
      rttMs: null,
      saveData: null,
      connectionTypeHint: null,
    };
  }

  return {
    effectiveType: conn.effectiveType ?? null,
    downlinkMbps: conn.downlink ?? null,
    rttMs: conn.rtt ?? null,
    saveData: conn.saveData ?? null,
    connectionTypeHint: conn.type ?? null,
  };
}

/**
 * Runs the fallback (own-server) test end to end, translated into the same
 * SpeedTestUpdate shape the Cloudflare path emits, so the UI layer never
 * needs to know which engine actually ran.
 */
export async function runFallbackSpeedTest(
  onUpdate: (update: SpeedTestUpdate) => void
): Promise<FullSpeedTestResult> {
  const result: FullSpeedTestResult = {
    pingMs: null,
    jitterMs: null,
    downloadMbps: null,
    uploadMbps: null,
    engine: "fallback",
  };

  const ping = await measurePing(8);
  result.pingMs = ping.pingMs;
  result.jitterMs = ping.jitterMs;
  onUpdate({ phase: "latency", result: { ...result }, fraction: 0.2 });

  const download = await measureDownload((mbps, frac) => {
    onUpdate({
      phase: "download",
      result: { ...result, downloadMbps: mbps },
      fraction: 0.2 + frac * 0.4,
    });
  });
  result.downloadMbps = download.mbps;

  const upload = await measureUpload((mbps, frac) => {
    onUpdate({
      phase: "upload",
      result: { ...result, uploadMbps: mbps },
      fraction: 0.6 + frac * 0.4,
    });
  });
  result.uploadMbps = upload.mbps;

  onUpdate({ phase: "done", result: { ...result }, fraction: 1 });
  return result;
}

/**
 * The function components should actually call: tries Cloudflare's public
 * network first, and only drops to the own-server fallback if that engine
 * reports an error (e.g. its domains are blocked on this network).
 */
export async function runSpeedTest(
  onUpdate: (update: SpeedTestUpdate) => void
): Promise<FullSpeedTestResult> {
  try {
    return await runCloudflareSpeedTest(onUpdate);
  } catch {
    return runFallbackSpeedTest(onUpdate);
  }
}
