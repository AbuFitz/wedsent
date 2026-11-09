import { api, mine } from "@/server/api";
import { listDeliveries } from "@/server/deliveries";

export const GET = api(async () => {
  const { user, weddingId } = await mine();
  return { deliveries: await listDeliveries(user.id, weddingId) };
});
