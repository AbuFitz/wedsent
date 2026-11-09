import { api, json, mine, origin } from "@/server/api";
import { sendInvitationEmails } from "@/server/send-invitations";

export const POST = api(async (req) => {
  const { user, weddingId } = await mine();
  const { householdIds } = await json(req);
  return sendInvitationEmails(user.id, weddingId, householdIds, origin(req));
});
