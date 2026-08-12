"use client";

import { Info } from "lucide-react";

export default function ResultsExplainer() {
  return (
    <div className="w-full max-w-2xl rounded-xl border border-signal/20 bg-signal/5 px-5 py-4 flex gap-3 animate-rise">
      <Info size={18} className="text-signal shrink-0 mt-0.5" strokeWidth={2.25} />
      <div className="text-sm text-inkSoft leading-relaxed">
        <p className="text-ink font-medium mb-1">
          Why might this differ from Speedtest.net, fast.com, or your ISP's
          own tool?
        </p>
        <p>
          A few honest reasons, not a flaw in either tool: those services
          often run a server hosted directly inside your ISP's own network
          (sometimes in your own city), which shaves off distance and
          latency ours can't match unless it's deployed on similar
          infrastructure. Test servers, number of parallel connections, and
          time-of-day network congestion all shift the number too — running
          any speed test twice, five minutes apart, can itself show a
          meaningfully different result.
        </p>
      </div>
    </div>
  );
}
