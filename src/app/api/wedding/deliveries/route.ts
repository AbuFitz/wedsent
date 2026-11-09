import { api, mine } from "@/server/api";
import { listDeliveries } from "@/server/deliveries";

export const GET = api(async () => {
  const { user, weddingId } = await mine();
  return { deliveries: await listDeliveries(user.id, weddingId), emailConfigured: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) };
});
