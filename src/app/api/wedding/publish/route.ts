import { api, json, mine, origin } from "@/server/api";
import { publish } from "@/server/weddings";
export const POST = api(async (req) => {
  const { user, weddingId } = await mine();
  const b = await json(req).catch(() => ({}));
  const r = await publish(user.id, weddingId, b.slug);
  return { ...r, url: `${origin(req)}/w/${r.slug}` };
});
