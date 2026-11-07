import { api, json, mine } from "@/server/api";
import { deleteEvent, updateEvent } from "@/server/guests";
export const PUT = api<{ id: string }>(async (req, { params }) => { const { user, weddingId } = await mine(); await updateEvent(user.id, weddingId, params.id, await json(req)); });
export const DELETE = api<{ id: string }>(async (_req, { params }) => { const { user, weddingId } = await mine(); await deleteEvent(user.id, weddingId, params.id); });
