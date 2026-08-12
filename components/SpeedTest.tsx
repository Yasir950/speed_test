"use client";

import { useCallback, useRef, useState } from "react";
import { Activity, Waves, Download, Upload, RotateCw } from "lucide-react";
import SignalGauge, { type GaugePhase } from "./SignalGauge";
import ResultCard from "./ResultCard";
import ResultsExplainer from "./ResultsExplainer";
import { measureDownload, measureUpload, measurePing } from "@/lib/speedtest";

interface Results {
  pingMs: number | null;
  jitterMs: number | null;
  downloadMbps: number | null;
  uploadMbps: number | null;
}

const PHASE_LABEL: Record<GaugePhase, string> = {
  idle: "Ready when you are",
  ping: "Measuring latency",
  download: "Testing download",
  upload: "Testing upload",
  done: "Test complete",
};

export default function SpeedTest() {
  const [phase, setPhase] = useState<GaugePhase>("idle");
  const [liveValue, setLiveValue] = useState(0);
  const [fraction, setFraction] = useState(0);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Results>({
    pingMs: null,
    jitterMs: null,
    downloadMbps: null,
    uploadMbps: null,
  });
  const runToken = useRef(0);

  const runTest = useCallback(async () => {
    const token = ++runToken.current;
    setRunning(true);
    setResults({
      pingMs: null,
      jitterMs: null,
      downloadMbps: null,
      uploadMbps: null,
    });

    try {
      // 1. Ping + jitter
      setPhase("ping");
      setFraction(0);
      setLiveValue(0);
      const pingResult = await measurePing(8);
      if (runToken.current !== token) return;
      setLiveValue(pingResult.pingMs);
      setFraction(1);
      setResults((r) => ({
        ...r,
        pingMs: pingResult.pingMs,
        jitterMs: pingResult.jitterMs,
      }));
      await new Promise((res) => setTimeout(res, 350));

      // 2. Download throughput
      if (runToken.current !== token) return;
      setPhase("download");
      setFraction(0);
      setLiveValue(0);
      const downloadResult = await measureDownload((mbps, frac) => {
        if (runToken.current !== token) return;
        setLiveValue(mbps);
        setFraction(frac);
      });
      if (runToken.current !== token) return;
      setResults((r) => ({ ...r, downloadMbps: downloadResult.mbps }));
      await new Promise((res) => setTimeout(res, 350));

      // 3. Upload throughput
      if (runToken.current !== token) return;
      setPhase("upload");
      setFraction(0);
      setLiveValue(0);
      const uploadResult = await measureUpload((mbps, frac) => {
        if (runToken.current !== token) return;
        setLiveValue(mbps);
        setFraction(frac);
      });
      if (runToken.current !== token) return;
      setResults((r) => ({ ...r, uploadMbps: uploadResult.mbps }));

      setPhase("done");
      setFraction(1);
    } catch {
      if (runToken.current === token) {
        setPhase("idle");
      }
    } finally {
      if (runToken.current === token) setRunning(false);
    }
  }, []);

  const gaugeUnit = phase === "ping" ? "ms" : phase === "idle" ? "" : "Mbps";
  const gaugeValue =
    phase === "idle"
      ? 0
      : phase === "done"
        ? (results.downloadMbps ?? 0)
        : liveValue;

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
    </div>
  );
}
