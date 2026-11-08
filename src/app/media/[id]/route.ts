import { readMedia } from "@/server/media";
import { AppError } from "@/server/errors";
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const m = await readMedia((await ctx.params).id);
    return new Response(new Uint8Array(m.data), { headers: { "content-type": m.mime, "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
  } catch (e) {
    return new Response("Not found", { status: e instanceof AppError ? e.status : 500 });
  }
}
