"use client";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Minus, Plus } from "lucide-react";
import { accentFor, buildIcs, friendlyDate, onColor, designById } from "@/lib/designs";
import { useDraft } from "@/lib/use-draft";
import "./rsvp.css";

type Answer = "yes" | "no" | null;
const ease = [0.2, 0.8, 0.2, 1] as const;

export default function Rsvp() {
  const { draft, ready } = useDraft();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [answer, setAnswer] = useState<Answer>(null);
  const [count, setCount] = useState(1);
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);

  if (!ready) return <main className="rs" />;
  const a = accentFor(draft);
  const style = { "--a": a, "--on-a": onColor(a) } as CSSProperties;
  const nameBad = touched && !name.trim();

  const send = () => {
    try {
      localStorage.setItem("wedsent-demo-reply-v8", JSON.stringify({ name, answer, count: answer === "yes" ? count : 0, note, at: new Date().toISOString() }));
    } catch {}
    setStep(3);
  };
  const next = () => {
    setTouched(true);
    if (!name.trim() || !answer) return;
    answer === "yes" ? setStep(2) : send();
  };
  const ics = () => {
    const url = URL.createObjectURL(new Blob([buildIcs(draft)], { type: "text/calendar" }));
    Object.assign(document.createElement("a"), { href: url, download: "invitation.ics" }).click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <main className={`rs rs--${designById(draft.design).id}`} style={style}>
      <div className="rs-shell">
        <header className="rs-top">
          <Link href="/invite" className="rs-back"><ArrowLeft size={18} /> Invitation</Link>
          <span className="rs-step" aria-live="polite">{step < 3 ? `Step ${step} of ${answer === "no" ? 1 : 2}` : "Done"}</span>
        </header>
        <p className="rs-demo" role="note">Preview only. Your reply is saved on this device and isn’t sent to anyone.</p>

        <AnimatePresence mode="wait" initial={false}>
          {step === 1 && (
            <motion.form key="1" className="rs-card" onSubmit={(e) => { e.preventDefault(); next(); }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease }} noValidate>
              <h1 className="rs-h">Will you be there?</h1>
              <p className="rs-sub">{draft.names.trim() || "The hosts"} · {friendlyDate(draft.date)}</p>
              <label className="rs-field">
                <span>Your name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="name" aria-invalid={nameBad} aria-describedby={nameBad ? "rs-name-err" : undefined} placeholder="First and last name" />
                {nameBad && <small id="rs-name-err" className="rs-err">Enter your name so the hosts know who replied.</small>}
              </label>
              <fieldset className="rs-choices">
                <legend className="sr-only">Can you come?</legend>
                {([["yes", "Yes, I’ll be there"], ["no", "Sorry, I can’t"]] as const).map(([v, label]) => (
                  <button type="button" key={v} className="rs-choice" aria-pressed={answer === v} onClick={() => setAnswer(v)}>
                    <span>{label}</span>{answer === v && <Check size={20} strokeWidth={3} />}
                  </button>
                ))}
              </fieldset>
              {touched && !answer && <small className="rs-err">Choose yes or no.</small>}
              <button type="submit" className="rs-go">{answer === "no" ? "Send reply" : "Continue"} <ArrowRight size={18} /></button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form key="2" className="rs-card" onSubmit={(e) => { e.preventDefault(); send(); }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease }}>
              <h1 className="rs-h">Lovely. Who’s coming?</h1>
              <div className="rs-count">
                <button type="button" onClick={() => setCount((c) => Math.max(1, c - 1))} aria-label="One fewer guest" disabled={count <= 1}><Minus size={20} /></button>
                <output aria-live="polite"><strong>{count}</strong><span>{count === 1 ? "guest" : "guests"}</span></output>
                <button type="button" onClick={() => setCount((c) => Math.min(6, c + 1))} aria-label="One more guest" disabled={count >= 6}><Plus size={20} /></button>
              </div>
              <label className="rs-field">
                <span>Anything we should know? <i>optional</i></span>
                <textarea rows={3} maxLength={240} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Dietary needs, access, a song request" />
              </label>
              <div className="rs-pair">
                <button type="button" className="rs-ghost" onClick={() => setStep(1)}>Back</button>
                <button type="submit" className="rs-go">Send reply <ArrowRight size={18} /></button>
              </div>
            </motion.form>
          )}

          {step === 3 && (
            <motion.div key="3" className="rs-card rs-done" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
              <motion.span className="rs-check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.15 }}><Check size={34} strokeWidth={3} /></motion.span>
              <h1 className="rs-h">{answer === "yes" ? `See you there, ${name.trim().split(" ")[0]}.` : `Thanks for letting us know, ${name.trim().split(" ")[0]}.`}</h1>
              <p className="rs-sub">{answer === "yes" ? `${count} ${count === 1 ? "guest" : "guests"} · ${friendlyDate(draft.date)}` : "We’ll miss you."}</p>
              <div className="rs-pair">
                <button type="button" className="rs-ghost" onClick={() => setStep(1)}>Change reply</button>
                {answer === "yes" && <button type="button" className="rs-go" onClick={ics}>Add to calendar</button>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
