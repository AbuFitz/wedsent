import { api, mine } from "@/server/api";
import { saveMedia } from "@/server/media";
export const POST = api(async (req) => {
  const { user, weddingId } = await mine();
  return saveMedia(user.id, weddingId, new Uint8Array(await req.arrayBuffer()));
});
