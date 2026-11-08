import { api, mine } from "@/server/api";
import { saveMusic } from "@/server/music";

export const POST = api(async (req) => {
  const { user, weddingId } = await mine();
  return saveMusic(user.id, weddingId, new Uint8Array(await req.arrayBuffer()), req.headers.get("x-music-rights") === "confirmed");
});
