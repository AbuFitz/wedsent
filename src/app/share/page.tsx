"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { readFeedbackLink, type FeedbackShare } from "@/lib/feedback-share";
import "@/components/guest/guest.css";

export default function FeedbackInvite() {
  const [shared, setShared] = useState<FeedbackShare | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { setShared(readFeedbackLink(window.location.hash.slice(1))); setReady(true); }, []);
  if (!ready) return <main className="guest" />;
  if (!shared) return <main className="guest guest--msg"><div className="guest-msg"><h1>This preview link isn’t valid.</h1><p>Ask the couple to share a fresh invitation preview.</p><Link href="/" className="btn btn-dark">Wedsent home</Link></div></main>;
  return <main className="guest" style={{ ["--g-bg" as string]: "#101014" }}>
    <div className="guest-wrap"><Phone label="Shared wedding invitation"><Invitation data={shared.data} events={shared.events} syncChrome open={open} onOpenChange={setOpen} /></Phone>
      <p className="guest-note">Shared design preview · Feedback mode · No RSVP is collected</p>
    </div>
  </main>;
}
