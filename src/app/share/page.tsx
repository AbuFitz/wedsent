"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, CreditCard, MapPin, RotateCcw } from "lucide-react";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { readFeedbackLink, type FeedbackShare } from "@/lib/feedback-share";
import "@/components/guest/guest.css";
import "./feedback.css";

export default function FeedbackInvite() {
  const [shared, setShared] = useState<FeedbackShare | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState<Record<string, "attending" | "declined">>({});
  const [submitted, setSubmitted] = useState(false);
  const [passOpen, setPassOpen] = useState(false);
  useEffect(() => { setShared(readFeedbackLink(window.location.hash.slice(1))); if (new URLSearchParams(window.location.search).has("reply")) setReplyOpen(true); setReady(true); }, []);
  if (!ready) return <main className="guest" />;
  if (!shared) return <main className="guest guest--msg"><div className="guest-msg"><h1>This preview link isn’t valid.</h1><p>Ask the couple to share a fresh invitation preview.</p><Link href="/" className="btn btn-dark">Wedsent home</Link></div></main>;
  return <main className="guest" style={{ ["--g-bg" as string]: "#101014" }}>
    <div className="guest-wrap"><Phone label="Shared wedding invitation"><Invitation data={shared.data} events={shared.events} syncChrome open={open} onOpenChange={setOpen} rsvpHref={`/share?reply=1${window.location.hash}`} /></Phone>
      <div className="feedback-lab">
        <div className="feedback-lab-heading"><strong>Try the guest experience</strong><span>Interactive test mode</span></div>
        <p>Open the invitation, check the details and try a reply or pass. Nothing here is sent to the couple.</p>
        <div className="feedback-lab-actions"><button type="button" onClick={() => { setReplyOpen((v) => !v); setPassOpen(false); }}>Test RSVP</button><button type="button" onClick={() => { setPassOpen((v) => !v); setReplyOpen(false); }}><CreditCard size={15}/> Preview pass</button></div>
        <div id="feedback-rsvp">
          {replyOpen && (submitted ? <div className="feedback-state"><Check size={19}/><strong>Test reply recorded on this screen</strong><p>This demonstrates the confirmation state. Real replies require a published invitation.</p><button type="button" onClick={() => setSubmitted(false)}><RotateCcw size={14}/> Change test reply</button></div> : <form className="feedback-reply" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><h2>Will you be joining us?</h2><label>Your name<input required maxLength={80} placeholder="Your name" value={guestName} onChange={(event) => setGuestName(event.target.value)}/></label>{(shared.events.length ? shared.events : [{ id: "main", title: shared.data.occasion || "The wedding" }]).map((ev) => <fieldset key={ev.id}><legend>{ev.title}</legend><label><input required type="radio" name={`attendance-${ev.id}`} checked={attendance[ev.id] === "attending"} onChange={() => setAttendance((current) => ({ ...current, [ev.id]: "attending" }))}/> I’ll be there</label><label><input required type="radio" name={`attendance-${ev.id}`} checked={attendance[ev.id] === "declined"} onChange={() => setAttendance((current) => ({ ...current, [ev.id]: "declined" }))}/> Can’t make it</label></fieldset>)}<button type="submit" disabled={Object.keys(attendance).length < (shared.events.length || 1)}>See confirmation</button></form>)}
          {passOpen && <div className="feedback-pass"><span>WEDSENT · PASS PREVIEW</span><h2>{shared.data.names}</h2><p>{shared.data.occasion || "Wedding celebration"}</p><div className="feedback-pass-fields"><span>GUEST<strong>{guestName || "Your guest name"}</strong></span><span>DATE<strong>{shared.data.date || "To be confirmed"}</strong></span></div><div className="feedback-pass-code" aria-label="Placeholder for admission barcode">Pass design preview</div><small>This is a visual sample, not a valid admission credential or an Apple/Google Wallet pass.</small></div>}
        </div>
        <a className="feedback-directions" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([shared.data.venue, shared.data.city].filter(Boolean).join(", "))}`} target="_blank" rel="noreferrer"><MapPin size={15}/> Check venue directions</a>
      </div>
    </div>
  </main>;
}
