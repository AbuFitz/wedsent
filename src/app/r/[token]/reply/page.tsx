import type { Metadata } from "next";
import { ReplyFlow } from "./reply-flow";
export const metadata: Metadata = { title: "Reply", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  return <ReplyFlow token={(await params).token} />;
}
