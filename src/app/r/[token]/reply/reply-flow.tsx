"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { call, ApiError } from "@/lib/api-client";
import { accentFor, friendlyDate, onColor } from "@/lib/designs";
import "../../../invite/rsvp/rsvp.css";
import "./reply.css";

type Status = "attending" | "declined";
const ease = [0.2, 0.8, 0.2, 1] as const;

export function ReplyFlow({ token }: { token: string }) {
  const [view, setView] = useState<any>(null);
  const [err, setErr] = useState<ApiError | null>(null);
  const [pick, setPick] = useState<Record<string, Status>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const key = useRef(crypto.randomUUID());

  const load = () => call("GET", `/api/r/${token}`).then((v) => {
    setView(v);
    const p: Record<string, Status> = {}, n: Record<string, string> = {};
    v.answers.forEach((a: any) => { p[`${a.guestId}:${a.eventId}`] = a.status; if (a.note) n[a.guestId] = a.note; });
    setPick(p); setNotes(n);
  }, setErr);
  useEffect(() => { load(); }, [token]); // eslint-disable-line

  const pairs = useMemo(() => (view ? view.invited.map((i: any) => `${i.guestId}:${i.eventId}`) : []) as string[], [view]);
  const missing = pairs.filter((p) => !pick[p]);
  const anyAttending = Object.values(pick).some((s) => s === "attending");

  if (err) return <main className="rs rs--zest"><div className="rs-shell"><div className="rs-card"><h1 className="rs-h">{err.status === 404 ? "This link isn’t active" : "Something went wrong"}</h1><p className="rs-sub">{err.status === 404 ? "Ask the couple for a fresh link." : err.message}</p></div></div></main>;
  if (!view) return <main className="rs" />;

  const c = view.content;
  const a = accentFor(c);
  const style = { "--a": a, "--on-a": onColor(a) } as CSSProperties;
  const title = (id: string) => view.events.find((e: any) => e.id === id)?.title;

  const send = async () => {
    setBusy(true); setProblem(null);
    const answers = pairs.map((p) => {
      const [guestId, eventId] = p.split(":");
      const prev = view.answers.find((x: any) => x.guestId === guestId && x.eventId === eventId);
      return { guestId, eventId, status: pick[p], note: pick[p] === "attending" ? notes[guestId]?.trim() || null : null, version: prev?.version ?? 0 };
    });
    try {
      await call("POST", `/api/r/${token}/respond`, { answers, idempotencyKey: key.current });
      await load(); setStep(3);
    } catch (e) {
      if (e instanceof ApiError && e.code === "stale_answer") { await load(); setProblem(e.message); setStep(1); }
      else setProblem(e instanceof ApiError ? e.message : "Couldn’t send your reply.");
      key.current = e instanceof ApiError && e.code === "offline" ? key.current : crypto.randomUUID();
    } finally { setBusy(false); }
  };

  return (
    <main className={`rs rs--${c.design}`} style={style}>
      <div className="rs-shell">
        <header className="rs-top">
          <Link href={`/r/${token}`} className="rs-back"><ArrowLeft size={18} /> Invitation</Link>
          <span className="rs-step" aria-live="polite">{step < 3 ? `Step ${step} of 2` : "Sent"}</span>
        </header>

        {view.locked && <p className="rs-demo" role="note">Replies closed on {friendlyDate(view.deadline.slice(0, 10))}. Contact the couple to change your answer.</p>}
        {!view.locked && view.deadline && <p className="rs-demo" role="note">Please reply by {friendlyDate(view.deadline.slice(0, 10))}.</p>}

        <AnimatePresence mode="wait" initial={false}>
          {step === 1 && (
            <motion.div key="1" className="rs-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease }}>
              <h1 className="rs-h">Who’s coming, {view.household.name}?</h1>
              {problem && <p className="rs-err" role="alert">{problem}</p>}
              {view.events.map((ev: any) => (
                <fieldset key={ev.id} className="rp-event" disabled={view.locked}>
                  <legend>{ev.title}</legend>
                  <p className="rs-sub">{[ev.startsOn && friendlyDate(String(ev.startsOn).slice(0, 10)), ev.startsAt?.slice(0, 5), ev.venue, ev.city].filter(Boolean).join(" · ")}</p>
                  {view.guests.filter((g: any) => pairs.includes(`${g.id}:${ev.id}`)).map((g: any) => {
                    const k = `${g.id}:${ev.id}`;
                    return (
                      <div className="rp-person" key={k}>
                        <span>{g.name}</span>
                        <div className="rp-yn" role="group" aria-label={`${g.name}, ${ev.title}`}>
                          <button type="button" aria-pressed={pick[k] === "attending"} onClick={() => setPick({ ...pick, [k]: "attending" })}>Yes</button>
                          <button type="button" aria-pressed={pick[k] === "declined"} data-no onClick={() => setPick({ ...pick, [k]: "declined" })}>No</button>
                        </div>
                      </div>);
                  })}
                </fieldset>
              ))}
              {missing.length > 0 && <small className="rs-sub">{missing.length} answer{missing.length === 1 ? "" : "s"} still to choose.</small>}
              <button className="rs-go" disabled={missing.length > 0 || view.locked || busy} onClick={() => (anyAttending ? setStep(2) : send())}>{anyAttending ? "Continue" : busy ? "Sending…" : "Send reply"} <ArrowRight size={18} /></button>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="2" className="rs-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease }}>
              <h1 className="rs-h">Anything we should know?</h1>
              <p className="rs-sub">Dietary needs, access, anything that helps. Optional.</p>
              {view.guests.filter((g: any) => pairs.some((p) => p.startsWith(g.id) && pick[p] === "attending")).map((g: any) => (
                <label className="rs-field" key={g.id}><span>{g.name}</span>
                  <textarea rows={2} maxLength={240} value={notes[g.id] ?? ""} onChange={(e) => setNotes({ ...notes, [g.id]: e.target.value })} /></label>
              ))}
              {problem && <p className="rs-err" role="alert">{problem}</p>}
              <div className="rs-pair"><button className="rs-ghost" onClick={() => setStep(1)}>Back</button><button className="rs-go" disabled={busy} onClick={send}>{busy ? "Sending…" : "Send reply"} <ArrowRight size={18} /></button></div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="3" className="rs-card rs-done" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
              <span className="rs-check"><Check size={34} strokeWidth={3} /></span>
              <h1 className="rs-h">Thank you. Your reply is saved.</h1>
              <ul className="rp-receipt">
                {view.events.map((ev: any) => (
                  <li key={ev.id}><strong>{ev.title}</strong>
                    {view.guests.filter((g: any) => pairs.includes(`${g.id}:${ev.id}`)).map((g: any) => <span key={g.id}>{g.name}: {pick[`${g.id}:${ev.id}`] === "attending" ? "coming" : "can’t come"}</span>)}</li>
                ))}
              </ul>
              {!view.locked && <p className="rs-sub">You can change your answers from this same link{view.deadline ? " until the reply-by date" : ""}.</p>}
              <div className="rs-pair"><button className="rs-ghost" onClick={() => setStep(1)} disabled={view.locked}>Change reply</button></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
