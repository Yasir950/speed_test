import type { LucideIcon } from "lucide-react";

interface ResultCardProps {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  accent?: "signal" | "violet" | "amber" | "good" | "ink";
  icon: LucideIcon;
}

const ACCENT_TEXT: Record<string, string> = {
  signal: "text-signal",
  violet: "text-violet",
  amber: "text-amber",
  good: "text-good",
  ink: "text-ink",
};

const ACCENT_BADGE: Record<string, string> = {
  signal: "bg-signal/10 text-signal",
  violet: "bg-violet/10 text-violet",
  amber: "bg-amber/10 text-amber",
  good: "bg-good/10 text-good",
  ink: "bg-ink/10 text-ink",
};

export default function ResultCard({
  label,
  value,
  unit,
  hint,
  accent = "ink",
  icon: Icon,
}: ResultCardProps) {
  return (
    <div className="rounded-xl border border-line bg-surface shadow-card px-5 py-4 flex flex-col gap-3 animate-rise">
      <div className="flex items-center justify-between">
        <span className="font-body text-[11px] font-medium uppercase tracking-[0.14em] text-inkSoft">
          {label}
        </span>
        <span
          className={`flex items-center justify-center w-8 h-8 rounded-full ${ACCENT_BADGE[accent]}`}
        >
          <Icon size={16} strokeWidth={2.25} />
        </span>
      </div>
      <span className="font-mono font-semibold tabular-nums text-2xl leading-tight">
        <span className={ACCENT_TEXT[accent]}>{value}</span>
        {unit && (
          <span className="text-sm font-normal text-inkFaint ml-1">{unit}</span>
        )}
      </span>
      {hint && <span className="text-xs text-inkFaint">{hint}</span>}
    </div>
  );
}
