import { api } from "@/server/api";
import { getPublishedBySlug } from "@/server/weddings";
import { notFound } from "@/server/errors";
export const GET = api<{ slug: string }>(async (_r, { params }) => {
  const w = await getPublishedBySlug(params.slug);
  if (!w) throw notFound("This invitation isn't published.");
  return w;
});
