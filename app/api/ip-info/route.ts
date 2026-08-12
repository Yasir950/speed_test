import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface IpInfoResult {
  ip: string;
  city: string | null;
  region: string | null;
  country: string | null;
  isp: string | null;
  org: string | null;
  latitude: number | null;
  longitude: number | null;
  source: "geo-api" | "local" | "unavailable";
}

function extractClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "0.0.0.0";
}

function isPrivateOrLocal(ip: string): boolean {
  return (
    ip === "0.0.0.0" ||
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.")
  );
}

export async function GET(req: NextRequest) {
  const ip = extractClientIp(req);

  if (isPrivateOrLocal(ip)) {
    const result: IpInfoResult = {
      ip,
      city: null,
      region: null,
      country: null,
      isp: null,
      org: null,
      latitude: null,
      longitude: null,
      source: "local",
    };
    return NextResponse.json(result);
  }

  try {
    // ipapi.co free tier: ~1000 req/day, no key required, HTTPS supported.
    // Swap for a paid provider (ipinfo.io, MaxMind, IP2Location) or a
    // self-hosted GeoLite2 database before scaling this beyond low traffic.
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { "User-Agent": "pulsecheck-speedtest/1.0" },
      next: { revalidate: 0 },
    });

    if (!res.ok) throw new Error(`geo lookup failed: ${res.status}`);
    const data = await res.json();

    const result: IpInfoResult = {
      ip,
      city: data.city ?? null,
      region: data.region ?? null,
      country: data.country_name ?? null,
      isp: data.org ?? null,
      org: data.org ?? null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      source: "geo-api",
    };
    return NextResponse.json(result);
  } catch {
    const result: IpInfoResult = {
      ip,
      city: null,
      region: null,
      country: null,
      isp: null,
      org: null,
      latitude: null,
      longitude: null,
      source: "unavailable",
    };
    return NextResponse.json(result, { status: 200 });
  }
}
