import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// We only need the byte count, not the content, so the body is drained
// without ever being buffered in full — keeps memory flat regardless of
// how large the client's test payload is.
export async function POST(req: NextRequest) {
  const start = Date.now();
  let bytesReceived = 0;

  const reader = req.body?.getReader();
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) bytesReceived += value.byteLength;
    }
  }

  const elapsedMs = Date.now() - start;

  return NextResponse.json(
    { bytesReceived, elapsedMs },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
  );
}
