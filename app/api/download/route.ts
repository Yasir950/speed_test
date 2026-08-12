import { NextRequest } from "next/server";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 100 * 1024 * 1024; // 100MB hard cap per request
const DEFAULT_BYTES = 10 * 1024 * 1024; // 10MB
const CHUNK_SIZE = 64 * 1024; // 64KB per pushed chunk

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const requested = parseInt(searchParams.get("bytes") || "", 10);
  const totalBytes =
    Number.isFinite(requested) && requested > 0
      ? Math.min(requested, MAX_BYTES)
      : DEFAULT_BYTES;

  let sent = 0;

  const stream = new ReadableStream({
    pull(controller) {
      if (sent >= totalBytes) {
        controller.close();
        return;
      }
      const remaining = totalBytes - sent;
      const size = Math.min(CHUNK_SIZE, remaining);

      // IMPORTANT: fresh random bytes on every single chunk, never reused.
      // A repeated buffer compresses to almost nothing under gzip/brotli,
      // which most hosts apply automatically -- that would make the
      // measured "download speed" reflect the tiny compressed transfer
      // size, not real throughput, and wildly overstate the result.
      const chunk = randomBytes(size);
      controller.enqueue(chunk);
      sent += size;
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(totalBytes),
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Content-Encoding": "identity",
      "X-Content-Bytes": String(totalBytes),
    },
  });
}
