"use client";

import { useEffect, useState } from "react";
import { Globe2, Wifi, AlertTriangle, Router } from "lucide-react";
import { readNetworkInfo, type NetworkInfoSnapshot } from "@/lib/speedtest";

interface IpInfo {
  ip: string;
  city: string | null;
  region: string | null;
  country: string | null;
  isp: string | null;
  source: "geo-api" | "local" | "unavailable";
}

export default function NetworkInfo() {
  const [net, setNet] = useState<NetworkInfoSnapshot | null>(null);
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [ipLoading, setIpLoading] = useState(true);

  useEffect(() => {
    setNet(readNetworkInfo());
    fetch("/api/ip-info")
      .then((r) => r.json())
      .then((data) => setIpInfo(data))
      .catch(() => setIpInfo(null))
      .finally(() => setIpLoading(false));
  }, []);

  const isLocalTest = ipInfo?.source === "local";
  const hasLocation = Boolean(ipInfo?.city && ipInfo?.country);
  const hasIsp = Boolean(ipInfo?.isp);

  return (
    <div className="rounded-xl border border-line bg-surface shadow-card p-5 flex flex-col gap-4">
      <h3 className="font-display text-sm font-semibold text-ink flex items-center gap-2">
        <Globe2 size={16} className="text-signal" />
        Network info
      </h3>

      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-inkSoft flex items-center gap-2">
            <Router size={14} className="text-inkFaint" />
            IP address
          </dt>
          <dd className="font-mono text-ink">
            {ipLoading ? "…" : ipInfo?.ip ?? "—"}
          </dd>
        </div>

        {!ipLoading && hasIsp && (
          <div className="flex items-center justify-between">
            <dt className="text-inkSoft">ISP</dt>
            <dd className="font-mono text-ink">{ipInfo?.isp}</dd>
          </div>
        )}

        {!ipLoading && hasLocation && (
          <div className="flex items-center justify-between">
            <dt className="text-inkSoft">Location</dt>
            <dd className="font-mono text-ink">
              {ipInfo?.city}, {ipInfo?.country}
            </dd>
          </div>
        )}

        <div className="flex items-center justify-between">
          <dt className="text-inkSoft flex items-center gap-2">
            <Wifi size={14} className="text-inkFaint" />
            Connection type
          </dt>
          <dd className="font-mono text-ink">
            {net?.effectiveType ? net.effectiveType.toUpperCase() : "Not reported"}
          </dd>
        </div>
      </dl>

      {isLocalTest && (
        <div className="flex gap-2 rounded-lg bg-amber/10 border border-amber/30 px-3 py-2.5 text-xs text-ink leading-relaxed">
          <AlertTriangle size={15} className="text-amber shrink-0 mt-0.5" />
          <p>
            <strong>Testing on localhost.</strong> Your IP resolved to a
            loopback address, meaning this test never reached the real
            internet — it only measured your own machine, so speeds will
            look far higher than reality. Deploy this site and test from a
            live URL for accurate numbers.
          </p>
        </div>
      )}
    </div>
  );
}
