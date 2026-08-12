"use client";

import { Info } from "lucide-react";

export default function ResultsExplainer() {
  return (
    <div className="w-full max-w-2xl rounded-xl border border-signal/20 bg-signal/5 px-5 py-4 flex gap-3 animate-rise">
      <Info size={18} className="text-signal shrink-0 mt-0.5" strokeWidth={2.25} />
      <div className="text-sm text-inkSoft leading-relaxed">
        <p className="text-ink font-medium mb-1">
          Why might this differ from Speedtest.net, fast.com, or your ISP&apos;s
          own tool?
        </p>
        <p>
          This test measures against Cloudflare&apos;s public network — the
          same infrastructure behind speed.cloudflare.com — auto-selecting
          the nearest of its 300+ global edge locations, similar to how
          Speedtest.net picks a nearby Ookla server and fast.com uses
          Netflix&apos;s CDN. Different providers still land on different
          servers, network paths, and peering arrangements, so a few Mbps of
          variation between tools is normal and expected, not a sign either
          one is wrong. Time-of-day congestion and Wi-Fi conditions shift
          results too — running any speed test twice, five minutes apart,
          can itself show a meaningfully different number.
        </p>
      </div>
    </div>
  );
}
