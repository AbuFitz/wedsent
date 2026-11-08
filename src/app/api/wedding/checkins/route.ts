import { api, json, mine } from "@/server/api";
import { checkinGuests, listCheckins } from "@/server/admissions";

export const GET = api(async (req) => { const { user, weddingId } = await mine(); return { checkins: await listCheckins(user.id, weddingId, new URL(req.url).searchParams.get("eventId") ?? undefined) }; });
export const POST = api(async (req) => { const { user, weddingId } = await mine(); return checkinGuests(user.id, weddingId, await json(req)); });
