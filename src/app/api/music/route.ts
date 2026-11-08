import { api, mine } from "@/server/api";
import { listMusic, saveMusic } from "@/server/music";

export const GET = api(async () => {
  const { user, weddingId } = await mine();
  return listMusic(user.id, weddingId);
});

export const POST = api(async (req) => {
  const { user, weddingId } = await mine();
  return saveMusic(user.id, weddingId, new Uint8Array(await req.arrayBuffer()), req.headers.get("x-music-rights") === "confirmed", req.headers.get("x-music-title") || "Uploaded recording");
});
