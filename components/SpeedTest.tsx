"use client";

import { useCallback, useRef, useState } from "react";
import {
  Activity,
  Waves,
  Download,
  Upload,
  RotateCw,
  Globe,
} from "lucide-react";
import SignalGauge, { type GaugePhase } from "./SignalGauge";
import ResultCard from "./ResultCard";
import ResultsExplainer from "./ResultsExplainer";
import { runSpeedTest, type FullSpeedTestResult } from "@/lib/speedtest";

const EMPTY_RESULT: FullSpeedTestResult = {
  pingMs: null,
  jitterMs: null,
  downloadMbps: null,
  uploadMbps: null,
  engine: "cloudflare",
};

const PHASE_LABEL: Record<GaugePhase, string> = {
  idle: "Ready when you are",
  ping: "Measuring latency",
  download: "Testing download",
  upload: "Testing upload",
  done: "Test complete",
};

export default function SpeedTest() {
  const [phase, setPhase] = useState<GaugePhase>("idle");
  const [fraction, setFraction] = useState(0);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<FullSpeedTestResult>(EMPTY_RESULT);
  const runToken = useRef(0);

  const runTest = useCallback(async () => {
    const token = ++runToken.current;
    setRunning(true);
    setResults(EMPTY_RESULT);
    setPhase("ping");
    setFraction(0);

    try {
      const final = await runSpeedTest((update) => {
        if (runToken.current !== token) return;
        setResults(update.result);
        setFraction(update.fraction);
        setPhase(update.phase === "latency" ? "ping" : update.phase);
      });
      if (runToken.current !== token) return;
      setResults(final);
      setPhase("done");
      setFraction(1);
    } catch {
      if (runToken.current === token) setPhase("idle");
    } finally {
      if (runToken.current === token) setRunning(false);
    }
  }, []);

  const gaugeUnit = phase === "ping" ? "ms" : phase === "idle" ? "" : "Mbps";
  const gaugeValue =
    phase === "idle"
      ? 0
      : phase === "ping"
        ? (results.pingMs ?? 0)
        : phase === "download" || phase === "done"
          ? (results.downloadMbps ?? 0)
          : (results.uploadMbps ?? 0);

  return (
    <div className="flex flex-col items-center gap-8">
      <SignalGauge
        phase={phase}
        value={gaugeValue}
        fraction={phase === "idle" ? 0 : fraction}
        unit={gaugeUnit}
        label={PHASE_LABEL[phase]}
      />

      <button
        onClick={runTest}
        disabled={running}
        className="font-display font-semibold text-base px-8 py-3.5 rounded-full bg-grad-signal text-white shadow-raised hover:brightness-110 active:brightness-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {running && <RotateCw size={16} className="animate-spin" />}
        {running
          ? "Testing…"
          : phase === "done"
            ? "Run again"
            : "Start speed test"}
      </button>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
        <ResultCard
          label="Ping"
          value={results.pingMs !== null ? results.pingMs.toFixed(0) : "—"}
          unit="ms"
          accent="amber"
          icon={Activity}
        />
        <ResultCard
          label="Jitter"
          value={results.jitterMs !== null ? results.jitterMs.toFixed(1) : "—"}
          unit="ms"
          accent="amber"
          icon={Waves}
        />
        <ResultCard
          label="Download"
          value={
            results.downloadMbps !== null
              ? results.downloadMbps.toFixed(1)
              : "—"
          }
          unit="Mbps"
          accent="signal"
          icon={Download}
        />
        <ResultCard
          label="Upload"
          value={
            results.uploadMbps !== null ? results.uploadMbps.toFixed(1) : "—"
          }
          unit="Mbps"
          accent="violet"
          icon={Upload}
        />
      </div>

      {phase === "done" && (
        <div className="w-full max-w-2xl flex items-center gap-2 text-xs text-inkFaint -mt-2">
          <Globe size={13} />
          {results.engine === "cloudflare"
            ? "Measured against Cloudflare's global network (nearest edge auto-selected)."
            : "Cloudflare's network was unreachable — measured against this site's own server instead."}
        </div>
      )}

      {phase === "done" && <ResultsExplainer />}
    </div>
  );
}
