"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { call, ApiError } from "@/lib/api-client";
import "./public-reply.css";

type Event = { id: string; title: string };
export function PublicReplyForm({ slug, names, design, events, hasEvents }: { slug: string; names: string; design: string; events: Event[]; hasEvents: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [eventId, setEventId] = useState(events[0]?.id ?? "");
  const [status, setStatus] = useState<"attending" | "declined">("attending");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setError("");
    try {
      await call("POST", `/api/w/${slug}/reply`, { name, email, status, note, eventId: eventId || null, website: "" });
      setSent(true);
    } catch (err) { setError(err instanceof ApiError ? err.message : "Your reply could not be sent. Try again."); }
    finally { setBusy(false); }
  };
  return <main className={`public-reply public-reply--${/^[a-z-]+$/.test(design) ? design : "pearl"}`}>
    <section className="public-reply-card">
      <div className="public-reply-flourish" aria-hidden="true"><span />✦<span /></div>
      <Link className="public-reply-back" href={`/w/${slug}`}>← Return to invitation</Link>
      <p className="public-reply-eyebrow">A celebration with {names}</p>
      {sent ? <><h1>Thank you for replying.</h1><p>Your response has been recorded for the couple to review. As this is a public link, your identity has not been verified.</p><Link className="public-reply-button" href={`/w/${slug}`}>Back to invitation</Link></> :
        <><h1>Your reply</h1>
        <p>Let the couple know if you can make it. This public form does not reserve a place or issue an admission pass.</p>
        {hasEvents && events.length === 0 ? <p role="alert">This invitation has guest-only events. Please ask the couple for your personal invitation link to reply.</p> :
          <form onSubmit={submit}>
            <label>Your name<input required autoComplete="name" maxLength={120} minLength={2} value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label>Email address<input required type="email" autoComplete="email" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            {events.length > 0 && <label>Which event?<select required value={eventId} onChange={(e) => setEventId(e.target.value)}>{events.map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}</select></label>}
            <fieldset><legend>Will you attend?</legend><div className="public-reply-picks">
              <button type="button" aria-pressed={status === "attending"} onClick={() => setStatus("attending")}>Joyfully accept</button>
              <button type="button" aria-pressed={status === "declined"} onClick={() => setStatus("declined")}>Regretfully decline</button>
            </div></fieldset>
            <label>Note for the couple (optional)<textarea maxLength={240} rows={3} value={note} onChange={(e) => setNote(e.target.value)} /></label>
            <input aria-hidden="true" tabIndex={-1} name="website" autoComplete="off" className="public-reply-honey" />
            {error && <p role="alert" className="public-reply-error">{error}</p>}
            <button className="public-reply-button" type="submit" disabled={busy}>{busy ? "Sending…" : "Send reply"}</button>
          </form>}
        </>}
    </section>
  </main>;
}
