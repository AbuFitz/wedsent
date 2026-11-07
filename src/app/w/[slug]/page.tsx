import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedBySlug } from "@/server/weddings";
import { PublicInvite } from "@/components/guest/public-invite";
import { friendlyDate } from "@/lib/designs";

type P = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const w = await getPublishedBySlug((await params).slug).catch(() => null);
  if (!w) return { title: "Invitation", robots: { index: false } };
  // Generic, non-private copy only (names and date are the host's public content). No guest data.
  return { title: `${w.content.names} — you’re invited`, description: [w.content.occasion, w.content.date && friendlyDate(w.content.date)].filter(Boolean).join(" · "), robots: { index: false, follow: false } };
}

export default async function Page({ params }: P) {
  const w = await getPublishedBySlug((await params).slug).catch(() => null);
  if (!w) notFound();
  return <PublicInvite content={w.content} events={w.events as any} />;
}
