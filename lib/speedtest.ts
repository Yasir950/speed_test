// Core measurement logic, kept framework-agnostic so it's easy to unit test
// or reuse outside the React component tree.

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
