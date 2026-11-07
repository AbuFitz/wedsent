"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, ChevronUp, Palette, Printer, RotateCcw, Sparkles, Type, CalendarDays, AlertCircle, Loader2 } from "lucide-react";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { designById, designs, daysUntil, onColor, type DesignId, type InviteData } from "@/lib/designs";
import { useDraft } from "@/lib/use-draft";
import "./studio.css";

type Tab = "design" | "words" | "details" | "style";
const tabs: { id: Tab; label: string; icon: typeof Palette }[] = [
  { id: "design", label: "Design", icon: Sparkles },
  { id: "words", label: "Words", icon: Type },
  { id: "details", label: "Details", icon: CalendarDays },
  { id: "style", label: "Style", icon: Palette },
];
const occasions = ["Wedding", "Nikah", "Walima", "Mehndi", "Reception", "Civil ceremony"];
const tones = [
  { label: "Warm", text: "We’re so happy to share this day with the people we love most. Please join us." },
  { label: "Short", text: "Come celebrate with us." },
  { label: "Playful", text: "A little love, a lot of joy, and a dance floor with your name on it." },
];

export function Studio() {
  const { draft, patch, state, ready } = useDraft();
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>("design");
  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState(true);

  useEffect(() => {
    const d = params.get("design");
    if (ready && d && designs.some((x) => x.id === d)) patch({ design: d as DesignId, accent: "" });
  }, [ready, params, patch]);

  const go = (t: Tab) => {
    setTab(t);
    setSheet(true);
    if (t === "details") setOpen(true);
    if (t === "design" || t === "style") setOpen(false);
  };

  return (
    <div className="st" data-sheet={sheet}>
      <header className="st-top">
        <Link href="/" className="st-logo">wedsent</Link>
        <div className="st-seg" role="group" aria-label="Preview">
          <button type="button" aria-pressed={!open} onClick={() => setOpen(false)}>Opening</button>
          <button type="button" aria-pressed={open} onClick={() => setOpen(true)}>Inside</button>
        </div>
        <div className="st-right">
          <SaveBadge state={state} />
          <Link href="/invite" target="_blank" className="btn btn-dark st-guest"><span>Guest preview</span> <ArrowUpRight size={16} /></Link>
        </div>
      </header>

      <main className="st-canvas">
        <div className="st-phone" style={{ ["--bgtone" as string]: designById(draft.design).bg }}>
          <Phone label="Live invitation preview">
            <Invitation data={draft} open={open} onOpenChange={setOpen} />
          </Phone>
          <button type="button" className="st-replay" onClick={() => setOpen(false)} disabled={!open}>
            <RotateCcw size={14} /> Replay opening
          </button>
        </div>
      </main>

      <aside className="st-panel" aria-label="Edit invitation">
        <button type="button" className="st-grab" onClick={() => setSheet((s) => !s)} aria-expanded={sheet} aria-label="Toggle editor">
          <ChevronUp size={20} />
        </button>
        <div className="st-tabs" role="tablist">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className="st-tab" onClick={() => go(t.id)}>
              <t.icon size={17} /> <span>{t.label}</span>
            </button>
          ))}
        </div>
        <div className="st-body">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              {tab === "design" && <DesignTab draft={draft} patch={patch} />}
              {tab === "words" && <WordsTab draft={draft} patch={patch} />}
              {tab === "details" && <DetailsTab draft={draft} patch={patch} />}
              {tab === "style" && <StyleTab draft={draft} patch={patch} />}
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="st-note">Saved in this browser only. Publishing and real replies aren’t built yet.</p>
      </aside>
    </div>
  );
}

function SaveBadge({ state }: { state: string }) {
  if (state === "failed")
    return <span className="st-save st-save--bad"><AlertCircle size={15} /> Couldn’t save. Storage is blocked.</span>;
  if (state === "saving" || state === "loading")
    return <span className="st-save"><Loader2 size={15} className="spin" /> <b>Saving</b></span>;
  return <span className="st-save"><Check size={15} /> <b>Saved</b></span>;
}

type TabProps = { draft: InviteData; patch: (p: Partial<InviteData>) => void };

function DesignTab({ draft, patch }: TabProps) {
  return (
    <div className="st-stack">
      <h2 className="st-h">Pick a design</h2>
      <p className="st-help">Your details carry over when you switch.</p>
      <div className="st-designs">
        {designs.map((d) => (
          <div key={d.id} className="st-design" data-on={draft.design === d.id}>
            <span className="st-thumb"><Invitation data={{ ...draft, design: d.id, accent: "" }} still /></span>
            <span className="st-design-text">
              <strong>{d.name}</strong>
              <span>{d.mood}</span>
              <em>{d.opening}</em>
            </span>
            {draft.design === d.id && <Check className="st-tick" size={18} />}
            <button type="button" className="st-design-hit" aria-pressed={draft.design === d.id} aria-label={`Use ${d.name}`} onClick={() => patch({ design: d.id, accent: "" })} />
          </div>
        ))}
      </div>
    </div>
  );
}

function WordsTab({ draft, patch }: TabProps) {
  const custom = !occasions.includes(draft.occasion);
  return (
    <div className="st-stack">
      <label className="st-field">
        <span>Names</span>
        <input value={draft.names} maxLength={60} onChange={(e) => patch({ names: e.target.value })} placeholder="Amina & Yusuf" autoComplete="off" aria-invalid={!draft.names.trim()} />
        {!draft.names.trim() ? <small className="st-err">Add your names. Guests see “Your names” until you do.</small> : <small>Use “&” or “and” between two names to split them across lines.</small>}
      </label>
      <fieldset className="st-field">
        <legend>Occasion</legend>
        <div className="st-chips">
          {occasions.map((o) => (
            <button key={o} type="button" className="st-chip" aria-pressed={draft.occasion === o} onClick={() => patch({ occasion: o })}>{o}</button>
          ))}
          <button type="button" className="st-chip" aria-pressed={custom} onClick={() => patch({ occasion: custom ? "Wedding" : "" })}>Other</button>
        </div>
        {custom && <input value={draft.occasion} maxLength={30} onChange={(e) => patch({ occasion: e.target.value })} placeholder="Name your occasion" aria-label="Custom occasion" />}
      </fieldset>
      <label className="st-field">
        <span>Message</span>
        <textarea rows={4} maxLength={300} value={draft.message} onChange={(e) => patch({ message: e.target.value })} />
        <small>{draft.message.length}/300</small>
      </label>
      <div className="st-chips" aria-label="Starting points">
        {tones.map((t) => <button key={t.label} type="button" className="st-chip st-chip--ghost" onClick={() => patch({ message: t.text })}>{t.label}</button>)}
      </div>
    </div>
  );
}

function DetailsTab({ draft, patch }: TabProps) {
  const left = daysUntil(draft.date);
  return (
    <div className="st-stack">
      <div className="st-row">
        <label className="st-field">
          <span>Date</span>
          <input type="date" value={draft.date} onChange={(e) => patch({ date: e.target.value })} aria-invalid={left === null} />
        </label>
        <label className="st-field">
          <span>Time <i>optional</i></span>
          <input type="time" value={draft.time} onChange={(e) => patch({ time: e.target.value })} />
        </label>
      </div>
      {left === null && <small className="st-err">Pick a date so guests know when to come.</small>}
      {left !== null && left < 0 && <small className="st-err">That date has passed.</small>}
      <label className="st-field">
        <span>Venue</span>
        <input value={draft.venue} maxLength={80} onChange={(e) => patch({ venue: e.target.value })} placeholder="The Glasshouse" />
      </label>
      <label className="st-field">
        <span>City</span>
        <input value={draft.city} maxLength={80} onChange={(e) => patch({ city: e.target.value })} placeholder="London" />
        <small>Guests get an “Open in Maps” link built from venue and city.</small>
      </label>
      <label className="st-field">
        <span>Dress <i>optional</i></span>
        <input value={draft.dress} maxLength={80} onChange={(e) => patch({ dress: e.target.value })} placeholder="Formal. Bring a wrap, it gets cool." />
      </label>
      <label className="st-field">
        <span>Reply by <i>optional</i></span>
        <input type="date" value={draft.rsvpBy} onChange={(e) => patch({ rsvpBy: e.target.value })} />
      </label>
    </div>
  );
}

function StyleTab({ draft, patch }: TabProps) {
  const d = designById(draft.design);
  const current = draft.accent || d.accents[0];
  return (
    <div className="st-stack">
      <h2 className="st-h">Accent colour</h2>
      <p className="st-help">Text colour adjusts itself so it stays readable.</p>
      <div className="st-swatches">
        {d.accents.map((c, i) => (
          <button key={c} type="button" className="st-swatch" style={{ background: c, color: onColor(c) }} aria-pressed={current.toLowerCase() === c.toLowerCase()} aria-label={i === 0 ? `Default ${c}` : c} onClick={() => patch({ accent: i === 0 ? "" : c })}>
            {current.toLowerCase() === c.toLowerCase() && <Check size={18} strokeWidth={3} />}
          </button>
        ))}
        <label className="st-swatch st-swatch--custom" aria-label="Custom colour">
          <input type="color" value={current} onChange={(e) => patch({ accent: e.target.value })} />
        </label>
      </div>
      <div className="st-soon" aria-disabled="true"><strong>Music</strong><span>Not built yet</span></div>
      <Link href="/invite/print" target="_blank" className="st-link"><Printer size={16} /> A5 print layout <ArrowUpRight size={14} /></Link>
    </div>
  );
}
