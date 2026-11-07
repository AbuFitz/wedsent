import { api, mine } from "@/server/api";
import { deleteEvent } from "@/server/guests";
export const DELETE = api<{ id: string }>(async (_req, { params }) => { const { user, weddingId } = await mine(); await deleteEvent(user.id, weddingId, params.id); });
