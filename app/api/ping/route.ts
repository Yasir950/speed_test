import { NextResponse } from "next/server";

// Deliberately tiny payload + no body parsing work, so round-trip time is
// dominated by network latency rather than server processing time.
export async function GET() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

export async function HEAD() {
  return new NextResponse(null, { status: 204 });
}
