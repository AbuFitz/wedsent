import { api, json, mine } from "@/server/api";
import { createEvent, listEvents } from "@/server/guests";
export const GET = api(async () => { const { user, weddingId } = await mine(); return { events: await listEvents(user.id, weddingId) }; });
export const POST = api(async (req) => { const { user, weddingId } = await mine(); return { id: await createEvent(user.id, weddingId, await json(req)) }; });
