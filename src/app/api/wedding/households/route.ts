import { api, json, mine, origin } from "@/server/api";
import { createHousehold, listHouseholds } from "@/server/guests";
export const GET = api(async (req) => { const { user, weddingId } = await mine(); return { households: await listHouseholds(user.id, weddingId, origin(req)) }; });
export const POST = api(async (req) => { const { user, weddingId } = await mine(); return { id: await createHousehold(user.id, weddingId, await json(req)) }; });
