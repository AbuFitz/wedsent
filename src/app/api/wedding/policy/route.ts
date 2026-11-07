import { api, json, mine } from "@/server/api";
import { setDeadlinePolicy } from "@/server/weddings";
import { bad } from "@/server/errors";
export const PUT = api(async (req) => {
  const { user, weddingId } = await mine();
  const b = await json(req);
  const d = b.deadline ? new Date(b.deadline) : null;
  if (d && Number.isNaN(d.getTime())) throw bad("Choose a valid reply-by date.");
  await setDeadlinePolicy(user.id, weddingId, d ? d.toISOString() : null, !!b.allowAfter);
});
