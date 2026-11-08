import { api, mine } from "@/server/api";
import { eventCounts, exportCsv } from "@/server/rsvp";
import { publicReplySummary } from "@/server/public-rsvp";
export const GET = api(async (req) => {
  const { user, weddingId } = await mine();
  if (new URL(req.url).searchParams.get("format") === "csv") {
    return new Response(await exportCsv(user.id, weddingId), { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="wedsent-replies.csv"' } });
  }
  const [counts, publicReplies] = await Promise.all([eventCounts(user.id, weddingId), publicReplySummary(user.id, weddingId)]);
  return { counts, publicReplies };
});
