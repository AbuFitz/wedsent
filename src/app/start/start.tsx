"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Plus, X } from "@phosphor-icons/react";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { DesignCard } from "@/components/gallery/design-card";
import { call } from "@/lib/api-client";
import { defaults, loadDraft, saveDraft, PENDING_EVENTS_KEY, type InviteData, type InviteEvent } from "@/lib/designs";
import { DESIGNS, FEATURED_DESIGNS, FONT_PACKS, INTRO_PRESETS, OPENINGS, paletteOf, specById, type DesignId, type OpeningKind } from "@/engine/registry";
import "./start.css";

const ease = [0.2, 0.8, 0.2, 1] as const;

const PRESETS: { id: string; label: string; events: string[]; tags: string[]; note: string }[] = [
  { id: "wedding", label: "A wedding", events: ["Ceremony", "Reception"], tags: ["Any wedding", "Church", "Civil"], note: "Ceremony and reception" },
  { id: "nikah", label: "Nikah & Walima", events: ["Nikah", "Walima"], tags: ["Nikah", "Walima", "Arabic"], note: "Two events, different guests" },
  { id: "mehndi", label: "Mehndi weekend", events: ["Mehndi", "Wedding", "Reception"], tags: ["Mehndi", "Shaadi", "Sangeet"], note: "Three events over a few days" },
  { id: "sangeet", label: "Haldi, Sangeet & wedding", events: ["Haldi", "Sangeet", "Wedding", "Reception"], tags: ["Haldi", "Sangeet", "Mehndi"], note: "A full celebration" },
  { id: "civil", label: "Civil ceremony & party", events: ["Civil ceremony", "Celebration"], tags: ["Civil", "Any wedding"], note: "Small ceremony, big party" },
  { id: "one", label: "Just one event", events: ["Celebration"], tags: ["Any wedding"], note: "A single occasion" },
  { id: "later", label: "I’ll add them later", events: [], tags: [], note: "Skip for now" },
];
const STEPS = ["names", "date", "celebrate", "design", "style", "details", "preview"] as const;
type Step = (typeof STEPS)[number];

export function Start() {
  const router = useRouter();
  const q = useSearchParams();
  const [step, setStep] = useState<Step>("names");
  const [d, setD] = useState<InviteData>({ ...defaults, names: "", message: "" });
  const [preset, setPreset] = useState("wedding");
  const [events, setEvents] = useState<string[]>(PRESETS[0].events);
  const [undecided, setUndecided] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = loadDraft();
    const fromGallery = q.get("design");
    const base: InviteData = { ...saved, names: saved.names === defaults.names ? "" : saved.names, message: saved.message === defaults.message ? "" : saved.message };
    if (fromGallery && DESIGNS.some((x) => x.id === fromGallery)) {
      base.design = fromGallery as DesignId;
      base.palette = q.get("palette") ?? "";
      base.type = q.get("type") ?? "";
      base.intro = q.get("intro") ?? "";
    }
    setD(base);
    setReady(true);
  }, [q]);

  const patch = (p: Partial<InviteData>) => setD((x) => ({ ...x, ...p }));
  const idx = STEPS.indexOf(step);
  const spec = specById(d.design);
  const names = d.names.trim();

  const can = step === "names" ? names.length > 0 : true;
  const go = (n: number) => { setErr(null); setStep(STEPS[Math.max(0, Math.min(STEPS.length - 1, n))]); setOpen(false); };
  const next = () => { if (can) go(idx + 1); };

  const shown: InviteData = { ...d, names: names || "Your names", message: d.message || "We would be honoured to celebrate with you.", date: undecided ? "" : d.date };
  const evs: InviteEvent[] = events.filter((e) => e.trim()).map((title, i) => ({ id: `p${i}`, title, startsOn: undecided ? null : d.date || null, startsAt: null, venue: d.venue, city: d.city }));
  const inside = step !== "design" && step !== "preview";

  const OCC: Record<string, string> = { nikah: "Nikah", mehndi: "Mehndi", sangeet: "Wedding", civil: "Civil ceremony" };
  const choosePreset = (id: string) => { setPreset(id); setEvents([...(PRESETS.find((p) => p.id === id)?.events ?? [])]); patch({ occasion: OCC[id] ?? "Wedding" }); };
  const suggested = useMemo(() => {
    const tags = PRESETS.find((p) => p.id === preset)?.tags ?? [];
    return new Set(FEATURED_DESIGNS.filter((x) => x.cultures.some((c) => tags.includes(c))).map((x) => x.id));
  }, [preset]);
  const ordered = useMemo(() => [...FEATURED_DESIGNS].sort((a, b) => Number(suggested.has(b.id)) - Number(suggested.has(a.id))), [suggested]);

  const finish = async () => {
    setBusy(true); setErr(null);
    const content = { ...d, names: names || "Our wedding", date: undecided ? "" : d.date };
    saveDraft(content);
    let user: unknown = null;
    try { user = (await call("GET", "/api/me")).user; } catch { /* backend not connected */ }
    const titles = events.filter((e) => e.trim());
    if (!user) {
      try { localStorage.setItem(PENDING_EVENTS_KEY, JSON.stringify(titles.map((title) => ({ title, startsOn: undecided ? null : d.date || null, venue: d.venue, city: d.city })))); } catch {}
      router.push("/studio");
      return;
    }
    try {
      const w = await call("GET", "/api/wedding");
      await call("PUT", "/api/wedding", { content, rev: w.rev });
      const existing = (await call("GET", "/api/wedding/events")).events;
      if (!existing.length) for (const title of titles) await call("POST", "/api/wedding/events", { title, startsOn: undecided ? null : d.date || null, venue: d.venue, city: d.city, visibility: "invited" });
      router.push("/studio");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Couldn’t save. Try again.");
      setBusy(false);
    }
  };

  if (!ready) return <main className="st8" />;

  const body: Record<Step, React.ReactNode> = {
    names: (
      <>
        <h1>Who’s getting married?</h1>
        <p className="s8-sub">Write the names the way you’d like guests to see them. Use “&amp;” between two names.</p>
        <input className="s8-big" autoFocus value={d.names} maxLength={60} onChange={(e) => patch({ names: e.target.value })} placeholder="Amina & Yusuf" aria-label="Names" autoComplete="off" onKeyDown={(e) => e.key === "Enter" && next()} />
      </>
    ),
    date: (
      <>
        <h1>When’s the day?</h1>
        <p className="s8-sub">Not sure yet? That’s fine. You can add it later.</p>
        <input className="s8-big" type="date" value={d.date} disabled={undecided} onChange={(e) => patch({ date: e.target.value })} aria-label="Date" />
        <label className="s8-check"><input type="checkbox" checked={undecided} onChange={(e) => setUndecided(e.target.checked)} /> We haven’t decided yet</label>
      </>
    ),
    celebrate: (
      <>
        <h1>What are you celebrating?</h1>
        <p className="s8-sub">Pick a starting point. You can rename, add or remove events any time.</p>
        <div className="s8-presets">
          {PRESETS.map((p) => (
            <button key={p.id} type="button" aria-pressed={preset === p.id} onClick={() => choosePreset(p.id)}>
              <strong>{p.label}</strong><span>{p.note}</span>{preset === p.id && <Check size={18} weight="bold" className="s8-tick" />}
            </button>
          ))}
        </div>
        {events.length > 0 && (
          <div className="s8-events" aria-label="Your events">
            {events.map((e, i) => (
              <div key={i}><input value={e} maxLength={80} aria-label={`Event ${i + 1}`} onChange={(x) => setEvents(events.map((v, j) => (j === i ? x.target.value : v)))} /><button type="button" aria-label={`Remove ${e}`} onClick={() => setEvents(events.filter((_, j) => j !== i))}><X size={16} /></button></div>
            ))}
            {events.length < 8 && <button type="button" className="s8-add" onClick={() => setEvents([...events, ""])}><Plus size={14} weight="bold" /> Add an event</button>}
          </div>
        )}
      </>
    ),
    design: (
      <>
        <h1>Choose a design.</h1>
        <p className="s8-sub">{suggested.size ? "Suggested for what you’re celebrating come first. " : ""}Each one opens differently. Your details are already in.</p>
        <div className="s8-designs">
          {ordered.map((x) => (
            <div key={x.id} className="s8-design" data-on={d.design === x.id}>
              {suggested.has(x.id) && <em>Suggested</em>}
              <DesignCard spec={x} href="#" names={names || undefined} />
              <button type="button" className="s8-pick" aria-pressed={d.design === x.id} onClick={() => patch({ design: x.id, palette: "", type: "", intro: "" })}>{d.design === x.id ? <><Check size={16} weight="bold" /> Chosen</> : `Choose ${x.name}`}</button>
            </div>
          ))}
        </div>
      </>
    ),
    style: (
      <>
        <h1>Make it yours.</h1>
        <p className="s8-sub">Choose the colour, opening gesture and lettering. Each choice updates your invitation.</p>
        <h2 className="s8-h2">Colours</h2>
        <div className="s8-pals">{spec.palettes.map((p) => (
          <button key={p.id} type="button" aria-pressed={paletteOf(spec, d.palette).id === p.id} onClick={() => patch({ palette: p.id, accent: "" })}><i style={{ background: p.accent, boxShadow: p.bg ? `inset 0 0 0 6px ${p.bg}` : undefined }} />{p.name}</button>
        ))}</div>
        <h2 className="s8-h2">How it opens</h2>
        <p className="s8-help">Guests tap or swipe to reveal your invitation. You can change this again in Studio.</p>
        <div className="s8-openings" role="group" aria-label="Invitation opening">
          <button type="button" aria-pressed={!d.opening} onClick={() => { patch({ opening: "" }); setOpen(false); }}><strong>Designer’s choice</strong><span>{OPENINGS[spec.opening.kind].hint}</span></button>
          {(["lift", "bloom", "veil", "focus"] as OpeningKind[]).map((kind) => (
            <button key={kind} type="button" aria-pressed={d.opening === kind} onClick={() => { patch({ opening: kind }); setOpen(false); }}>
              <strong>{kind === "lift" ? "Paper lift" : kind === "bloom" ? "Touch reveal" : kind === "veil" ? "Soft veil" : kind === "focus" ? "Focus reveal" : kind === "doors" ? "Opening doors" : "Drawing curtains"}</strong>
              <span>{OPENINGS[kind].hint}</span>
            </button>
          ))}
        </div>
        <button type="button" className="s8-replay" onClick={() => setOpen(false)}>Replay opening in the phone</button>
        {spec.layout === "stationery" && (
          <>
            <h2 className="s8-h2">Lettering</h2>
            <div className="s8-types">
              <button type="button" aria-pressed={d.type === ""} onClick={() => patch({ type: "" })}><span>Designer’s choice</span></button>
              {FONT_PACKS.filter((f) => f.script || ["classic", "didone", "deco", "italiana", "garamond"].includes(f.id)).map((f) => (
                <button key={f.id} type="button" aria-pressed={d.type === f.id} onClick={() => patch({ type: f.id })}><span style={{ fontFamily: f.script ?? f.head, fontSize: f.script ? 24 : 18 }}>{(names || "Amina").split(/[ &]/)[0]}</span><small>{f.name}</small></button>
              ))}
            </div>
            <h2 className="s8-h2">Opening line <small>optional</small></h2>
            <select className="s8-select" value={d.intro} onChange={(e) => patch({ intro: e.target.value })} aria-label="Opening line">
              <option value="">Designer’s choice</option>
              {Array.from(new Set(INTRO_PRESETS.map((i) => i.group))).map((g) => <optgroup key={g} label={g}>{INTRO_PRESETS.filter((i) => i.group === g).map((i) => <option key={i.id} value={i.id === "none" ? "none" : i.text}>{i.label}</option>)}</optgroup>)}
            </select>
          </>
        )}
      </>
    ),
    details: (
      <>
        <h1>Where, and a few words.</h1>
        <p className="s8-sub">All optional. You can fill these in later in the Studio.</p>
        <label className="s8-f"><span>Venue</span><input value={d.venue} maxLength={80} onChange={(e) => patch({ venue: e.target.value })} placeholder="The Glasshouse" /></label>
        <label className="s8-f"><span>City</span><input value={d.city} maxLength={80} onChange={(e) => patch({ city: e.target.value })} placeholder="London" /></label>
        <label className="s8-f"><span>A message for your guests</span><textarea rows={3} value={d.message} maxLength={300} onChange={(e) => patch({ message: e.target.value })} placeholder="We would be honoured to celebrate with you." /></label>
      </>
    ),
    preview: (
      <>
        <h1>Here’s your invitation.</h1>
        <p className="s8-sub">Open it the way a guest would. Everything here can be changed later.</p>
        <ul className="s8-sum">
          <li><span>Names</span>{names || "Not added yet"}</li>
          <li><span>Date</span>{undecided || !d.date ? "To be decided" : d.date}</li>
          <li><span>Events</span>{events.filter(Boolean).join(", ") || "Add later"}</li>
          <li><span>Design</span>{spec.name} · {paletteOf(spec, d.palette).name}</li>
        </ul>
        {err && <p className="s8-err" role="alert">{err}</p>}
        <button className="btn btn-dark s8-save" onClick={finish} disabled={busy}>{busy ? "Saving…" : "Save and continue"} <ArrowRight size={18} /></button>
        <p className="s8-fine">For now, your draft and event choices save on this device. No account needed to explore Studio. Nothing is sent to guests.</p>
      </>
    ),
  };

  return (
    <main className="st8">
      <header className="s8-top">
        <Link href="/" className="s8-logo">wedsent</Link>
        <span className="s8-count" aria-live="polite">Step {idx + 1} of {STEPS.length}</span>
        <Link href="/designs" className="s8-skip">Browse designs</Link>
      </header>
      <div className="s8-bar" aria-hidden="true"><motion.span animate={{ width: `${((idx + 1) / STEPS.length) * 100}%` }} transition={{ duration: 0.5, ease }} /></div>

      <div className="s8-grid">
        <section className="s8-pane">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={step} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.4, ease }}>
              {body[step]}
            </motion.div>
          </AnimatePresence>
          {step !== "preview" && (
            <div className="s8-nav">
              <button type="button" className="s8-back" onClick={() => go(idx - 1)} disabled={idx === 0}><ArrowLeft size={18} /> Back</button>
              <button type="button" className="btn btn-dark" onClick={next} disabled={!can}>{step === "details" ? "See it" : "Continue"} <ArrowRight size={18} /></button>
            </div>
          )}
          {step === "preview" && <button type="button" className="s8-back s8-edit" onClick={() => go(idx - 1)}><ArrowLeft size={18} /> Keep editing</button>}
        </section>

        <aside className="s8-stage" aria-label="Live preview">
          <div className="s8-phone">
            <Phone label="Your invitation">
              <Invitation key={`${spec.id}-${d.palette}-${d.type}-${d.opening}-${step === "design" ? "c" : "i"}`} data={shown} events={evs} open={inside && step !== "style" ? true : open} onOpenChange={setOpen} />
            </Phone>
          </div>
        </aside>
      </div>
    </main>
  );
}
