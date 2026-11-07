import { api, json, mine } from "@/server/api";
import { getDraft, saveDraft } from "@/server/weddings";
export const GET = api(async () => {
  const { user, weddingId } = await mine();
  return { id: weddingId, ...(await getDraft(user.id, weddingId)) };
});
export const PUT = api(async (req) => {
  const { user, weddingId } = await mine();
  const b = await json(req);
  return saveDraft(user.id, weddingId, b.content, Number(b.rev));
});
