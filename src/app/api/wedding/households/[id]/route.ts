import { api, json, mine } from "@/server/api";
import { deleteHousehold, setHouseholdEvents } from "@/server/guests";
export const DELETE = api<{ id: string }>(async (_r, { params }) => { const { user, weddingId } = await mine(); await deleteHousehold(user.id, weddingId, params.id); });
export const PATCH = api<{ id: string }>(async (req, { params }) => {
  const { user, weddingId } = await mine();
  const b = await json(req);
  await setHouseholdEvents(user.id, weddingId, params.id, Array.isArray(b.eventIds) ? b.eventIds.map(String) : []);
});
