import {
  Activity,
  Download,
  Upload,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

interface Field {
  icon: LucideIcon;
  accent: string;
  title: string;
  body: string;
}

const FIELDS: Field[] = [
  {
    icon: Activity,
    accent: "text-amber bg-amber/10",
    title: "Latency",
    body: "We send small round-trips to the server and time each one. The average is your ping; how much each sample deviates from the last is your jitter — a rougher connection has higher jitter even at the same average speed.",
  },
  {
    icon: Download,
    accent: "text-signal bg-signal/10",
    title: "Download",
    body: "Several parallel connections stream randomized, incompressible data from the server at once — the same multi-connection approach industry tools use, since a single stream can't saturate most real-world links.",
  },
  {
    icon: Upload,
    accent: "text-violet bg-violet/10",
    title: "Upload",
    body: "Your browser sends randomized payloads back to the server, which counts bytes and discards them. This measures how fast you can push data out — the number that matters most for video calls and cloud backups.",
  },
];

export default function HowItWorks() {
  return (
    <section
      aria-labelledby="how-heading"
      className="max-w-4xl mx-auto px-6 py-16"
    >
      <h2
        id="how-heading"
        className="font-display text-2xl sm:text-3xl font-semibold text-ink mb-8"
      >
        How this speed test works
      </h2>
      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        {FIELDS.map((f) => (
          <div key={f.title} className="flex flex-col gap-3">
            <span
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${f.accent}`}
            >
              <f.icon size={17} strokeWidth={2.25} />
            </span>
            <h3 className="font-display font-semibold text-ink">{f.title}</h3>
            <p className="text-sm text-inkSoft leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
