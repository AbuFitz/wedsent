import { notFound } from "next/navigation";
import { getPublishedBySlug } from "@/server/weddings";
import { PublicReplyForm } from "./public-reply-form";

export const metadata = { title: "Reply to invitation", robots: { index: false, follow: false } };
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const wedding = await getPublishedBySlug(slug).catch(() => null);
  if (!wedding) notFound();
  const events = wedding.events.map((event: any) => ({ id: event.id as string, title: event.title as string }));
  return <PublicReplyForm slug={slug} names={wedding.content.names} design={wedding.content.design ?? "pearl"} events={events} hasEvents={wedding.hasEvents} />;
}
