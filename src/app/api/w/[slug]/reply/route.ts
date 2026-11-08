import { api, ip, json } from "@/server/api";
import { rateLimit } from "@/server/auth";
import { getDb } from "@/server/db";
import { publicReply } from "@/server/public-rsvp";

export const POST = api<{ slug: string }>(async (req, { params }) => {
  await rateLimit(await getDb(), `public-reply:${ip(req)}`, 8, 60);
  return publicReply(params.slug, await json(req));
});
