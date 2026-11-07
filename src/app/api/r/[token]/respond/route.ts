import { api, json } from "@/server/api";
import { respond } from "@/server/rsvp";
import { getDb } from "@/server/db";
import { rateLimit } from "@/server/auth";
import { ip } from "@/server/api";
export const POST = api<{ token: string }>(async (req, { params }) => {
  await rateLimit(await getDb(), `respond:${ip(req)}`, 60, 600);
  return respond(params.token, await json(req));
});
