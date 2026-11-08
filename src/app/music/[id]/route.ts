import { readMusic } from "@/server/music";
import { AppError } from "@/server/errors";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const data = await readMusic((await context.params).id);
    const range = req.headers.get("range");
    const base = { "content-type": "audio/mpeg", "accept-ranges": "bytes", "x-content-type-options": "nosniff", "cache-control": "public, max-age=3600" };
    if (range) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(range);
      if (!match) return new Response(null, { status: 416, headers: { ...base, "content-range": `bytes */${data.length}` } });
      const start = Number(match[1]);
      const end = match[2] ? Math.min(Number(match[2]), data.length - 1) : data.length - 1;
      if (start >= data.length || end < start) return new Response(null, { status: 416, headers: { ...base, "content-range": `bytes */${data.length}` } });
      return new Response(new Uint8Array(data.subarray(start, end + 1)), { status: 206, headers: { ...base, "content-length": String(end - start + 1), "content-range": `bytes ${start}-${end}/${data.length}` } });
    }
    return new Response(new Uint8Array(data), { headers: { ...base, "content-length": String(data.length) } });
  } catch (e) {
    return new Response("Audio not found", { status: e instanceof AppError ? e.status : 500 });
  }
}
