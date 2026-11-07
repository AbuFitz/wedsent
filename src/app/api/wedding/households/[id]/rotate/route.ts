import { api, mine } from "@/server/api";
import { rotateInvitation } from "@/server/guests";
export const POST = api<{ id: string }>(async (_r, { params }) => { const { user, weddingId } = await mine(); await rotateInvitation(user.id, weddingId, params.id); });
