"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { readFeedbackLink, type FeedbackShare } from "@/lib/feedback-share";
import "@/components/guest/guest.css";

/** Shared visual proof. Real replies happen on private, per-household links. */
export default function SharedInvitation() {
  const [shared, setShared] = useState<FeedbackShare | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setShared(readFeedbackLink(window.location.hash.slice(1)));
    setReady(true);
  }, []);
  if (!ready) return <main className="guest" />;
  if (!shared) return <main className="guest guest--msg"><div className="guest-msg"><h1>This invitation link has expired.</h1><p>Ask the couple to share a fresh link.</p><Link href="/" className="btn btn-dark">Wedsent home</Link></div></main>;
  return <main className="guest guest--shared"><div className="guest-wrap">
    <Phone label="Wedding invitation"><Invitation data={shared.data} events={shared.events} syncChrome open={open} onOpenChange={setOpen} /></Phone>
  </div></main>;
}
