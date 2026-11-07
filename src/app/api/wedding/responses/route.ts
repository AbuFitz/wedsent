import { api, json, mine } from "@/server/api";
import { hostRecord } from "@/server/rsvp";
export const POST = api(async (req) => { const { user, weddingId } = await mine(); return hostRecord(user.id, weddingId, (await json(req)).answers); });
