import type { Metadata } from "next";
import { PersonalInvite } from "./personal";
// Never put guest names or tokens in metadata: link previews (WhatsApp, iMessage) are public.
export const metadata: Metadata = { title: "You’re invited", description: "Open your invitation.", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  return <PersonalInvite token={(await params).token} />;
}
