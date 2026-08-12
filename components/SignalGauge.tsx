"use client";

import { useMemo } from "react";
import { Zap, Gauge as GaugeIcon } from "lucide-react";

export type GaugePhase = "idle" | "ping" | "download" | "upload" | "done";

interface SignalGaugeProps {
  phase: GaugePhase;
  value: number; // current headline number (ms during ping, Mbps during transfer)
  fraction: number; // 0..1 progress through current phase
  unit: string;
  label: string;
}

const PHASE_COLOR: Record<GaugePhase, string> = {
  idle: "#9AA2B4",
  ping: "#F59E0B",
  download: "#4F46E5",
  upload: "#8B5CF6",
  done: "#0F1424",
};

const PHASE_GRADIENT: Record<GaugePhase, [string, string]> = {
  idle: ["#CBD2E0", "#9AA2B4"],
  ping: ["#FBBF24", "#F59E0B"],
  download: ["#818CF8", "#4F46E5"],
  upload: ["#A78BFA", "#8B5CF6"],
  done: ["#4F46E5", "#06B6D4"],
};

const SIZE = 280;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2 - 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function SignalGauge({
  phase,
  value,
  fraction,
  unit,
  label,
}: SignalGaugeProps) {
  const color = PHASE_COLOR[phase];
  const [gradFrom, gradTo] = PHASE_GRADIENT[phase];
  const clamped = Math.max(0, Math.min(1, fraction));
  const dashOffset = CIRCUMFERENCE * (1 - clamped);
  const isActive = phase === "ping" || phase === "download" || phase === "upload";

  const display = useMemo(() => {
    if (!Number.isFinite(value)) return "0.0";
    return value >= 100 ? value.toFixed(0) : value.toFixed(1);
  }, [value]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: SIZE, height: SIZE }}
    >
      {/* Emanating pulse rings while actively measuring */}
      {isActive && (
        <>
          <span
            className="absolute rounded-full border-2 animate-pulseRing"
            style={{ width: SIZE * 0.72, height: SIZE * 0.72, borderColor: color }}
            aria-hidden
          />
          <span
            className="absolute rounded-full border-2 animate-pulseRing"
            style={{
              width: SIZE * 0.72,
              height: SIZE * 0.72,
              borderColor: color,
              animationDelay: "0.9s",
            }}
            aria-hidden
          />
        </>
      )}

      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className={isActive ? "animate-sweep" : ""}
        style={{ transformOrigin: "50% 50%" }}
        aria-hidden
      >
        <defs>
          <linearGradient id="sweepFade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="100%" stopColor={color} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {isActive && (
          <line
            x1={SIZE / 2}
            y1={SIZE / 2}
            x2={SIZE / 2}
            y2={STROKE}
            stroke="url(#sweepFade)"
            strokeWidth={RADIUS}
            strokeLinecap="round"
            opacity={0.5}
          />
        )}
      </svg>

      {/* Static ring + progress ring, layered separately so the sweep
          rotation above doesn't spin the numbers/track with it */}
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="absolute inset-0 -rotate-90"
      >
        <defs>
          <linearGradient id={`ringGrad-${phase}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradFrom} />
            <stop offset="100%" stopColor={gradTo} />
          </linearGradient>
        </defs>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#E2E5EE"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={`url(#ringGrad-${phase})`}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.25s linear" }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        {phase === "idle" ? (
          <Zap size={40} className="text-inkFaint mb-2" strokeWidth={1.5} />
        ) : (
          <GaugeIcon size={22} style={{ color }} strokeWidth={2} className="mb-1" />
        )}
        <span
          className="font-mono font-semibold tabular-nums leading-none"
          style={{ fontSize: 54, color: phase === "idle" ? "#0F1424" : color }}
        >
          {display}
        </span>
        <span className="font-mono text-sm text-inkSoft mt-1 tracking-wide">
          {unit}
        </span>
        <span className="font-body text-xs uppercase tracking-[0.2em] text-inkFaint mt-4">
          {label}
        </span>
      </div>
    </div>
  );
}
