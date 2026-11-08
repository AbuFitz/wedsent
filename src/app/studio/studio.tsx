"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, ChevronUp, Palette, Printer, RotateCcw, Sparkles, Type, CalendarDays, CalendarRange, AlertCircle, Loader2, Plus, Trash2, Pencil, Image as ImageIcon, Upload, MapPin } from "lucide-react";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { designs, daysUntil, onColor, type DesignId, type InviteData, type InviteEvent } from "@/lib/designs";
import { FONT_PACKS, INTRO_PRESETS, paletteOf, specById } from "@/engine/registry";
import { call, ApiError } from "@/lib/api-client";
import { newLocalEvent, readLocalEvents, writeLocalEvents, type RawEvent } from "@/lib/local-events";
import { storePhoto } from "@/lib/photo-upload";
import { useStudioDraft } from "@/lib/use-draft";
import "./studio.css";

type Tab = "design" | "words" | "photo" | "details" | "events" | "style";
const tabs: { id: Tab; label: string; icon: typeof Palette }[] = [
  { id: "design", label: "Design", icon: Sparkles },
  { id: "words", label: "Words", icon: Type },
  { id: "photo", label: "Photo", icon: ImageIcon },
  { id: "details", label: "Details", icon: CalendarDays },
  { id: "events", label: "Events", icon: CalendarRange },
  { id: "style", label: "Style", icon: Palette },
];
const occasions = ["Wedding", "Nikah", "Walima", "Mehndi", "Reception", "Civil ceremony"];
const tones = [
  { label: "Warm", text: "We’re so happy to share this day with the people we love most. Please join us." },
  { label: "Short", text: "Come celebrate with us." },
  { label: "Playful", text: "A little love, a lot of joy, and a dance floor with your name on it." },
];

export function Studio() {
  const { draft, patch, state, ready, account, reload } = useStudioDraft();
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>("design");
  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState(true);
  const [rawEvents, setRawEvents] = useState<RawEvent[]>([]);
  const loadEvents = useCallback(async () => {
    if (!account) { setRawEvents(readLocalEvents()); return; }
    try { setRawEvents((await call("GET", "/api/wedding/events")).events); } catch { /* keep what we have */ }
  }, [account]);
  useEffect(() => { if (ready) loadEvents(); }, [loadEvents, ready]);
  const events: InviteEvent[] = rawEvents.map((e) => ({ id: e.id, title: e.title, startsOn: e.starts_on, startsAt: e.starts_at_local, venue: e.venue, address: e.address, city: e.city }));

  useEffect(() => {
    const d = params.get("design");
    if (ready && d && designs.some((x) => x.id === d)) patch({ design: d as DesignId, accent: "" });
  }, [ready, params, patch]);

  const go = (t: Tab) => {
    setTab(t);
    setSheet(true);
    if (t === "details" || t === "events") setOpen(true);
    if (t === "photo") setOpen(false);
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
          <SaveBadge state={state} account={!!account} reload={reload} />
          <Link href="/invite" target="_blank" className="btn btn-light st-guest"><span>Guest preview</span> <ArrowUpRight size={16} /></Link>
          {account
            ? <Link href="/dashboard" className="btn btn-dark st-guest"><span>Guests &amp; publish</span></Link>
            : <Link href="/signin?next=/studio" className="btn btn-dark st-guest"><span>Save &amp; publish</span></Link>}
        </div>
      </header>

      <main className="st-canvas">
        <div className="st-phone" style={{ ["--bgtone" as string]: specById(draft.design).site.bg }}>
          <Phone label="Live invitation preview">
            <Invitation data={draft} open={open} onOpenChange={setOpen} events={events} />
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
              {tab === "photo" && <PhotoTab draft={draft} patch={patch} signedIn={!!account} />}
              {tab === "events" && <EventsTab account={!!account} events={rawEvents} reload={loadEvents} />}
              {tab === "style" && <StyleTab draft={draft} patch={patch} />}
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="st-note">{account ? "Edits save to your account. Publish from Guests & publish when you’re ready." : "Not signed in: this draft only lives in this browser."}</p>
      </aside>
    </div>
  );
}

function SaveBadge({ state, account, reload }: { state: string; account: boolean; reload: () => void }) {
  if (state === "conflict")
    return <span className="st-save st-save--bad"><AlertCircle size={15} /> <b>Changed elsewhere.</b> <button className="st-reload" onClick={reload}>Reload</button></span>;
  if (state === "offline") return <span className="st-save st-save--bad"><AlertCircle size={15} /> <b>Offline. Changes not saved yet.</b></span>;
  if (state === "failed") return <span className="st-save st-save--bad"><AlertCircle size={15} /> <b>Couldn’t save.</b></span>;
  if (state === "saving" || state === "loading") return <span className="st-save"><Loader2 size={15} className="spin" /> <b>Saving</b></span>;
  return <span className="st-save"><Check size={15} /> <b>{account ? "Saved to your account" : "Saved on this device"}</b></span>;
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
      <p className="st-help st-help--flat">This is the headline date and venue. Use the Events tab for each ceremony or celebration; guests see the events they’re invited to.</p>
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
        <span>Street address <i>optional</i></span>
        <input value={draft.address} maxLength={160} onChange={(e) => patch({ address: e.target.value })} placeholder="1 High Street, N1 1AA" autoComplete="off" />
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
  const spec = specById(draft.design);
  const pal = paletteOf(spec, draft.palette);
  const stationery = spec.layout === "stationery";
  const custom = draft.accent || pal.accent;
  return (
    <div className="st-stack">
      <h2 className="st-h">Colours</h2>
      <p className="st-help">Each design has its own palettes. Text colour adjusts so it stays readable.</p>
      <div className="st-pals">
        {spec.palettes.map((p) => (
          <button key={p.id} type="button" aria-pressed={pal.id === p.id && !draft.accent} onClick={() => patch({ palette: p.id, accent: "" })}>
            <i style={{ background: p.accent, boxShadow: p.bg ? `inset 0 0 0 6px ${p.bg}` : undefined }} />{p.name}
          </button>
        ))}
        <label className="st-swatch st-swatch--custom" aria-label="Custom accent colour" title="Custom accent colour">
          <input type="color" value={custom} onChange={(e) => patch({ accent: e.target.value })} />
        </label>
      </div>
      {stationery && (
        <>
          <h2 className="st-h">Lettering</h2>
          <div className="st-types">
            <button type="button" aria-pressed={draft.type === ""} onClick={() => patch({ type: "" })}><span>Designer’s choice</span></button>
            {FONT_PACKS.filter((f) => f.script || ["classic", "didone", "deco", "italiana", "garamond"].includes(f.id)).map((f) => (
              <button key={f.id} type="button" aria-pressed={draft.type === f.id} onClick={() => patch({ type: f.id })} title={f.note}>
                <span style={{ fontFamily: f.script ?? f.head, fontSize: f.script ? 24 : 18 }}>{(draft.names || "Amina").split(/[ &]/)[0]}</span><small>{f.name}</small>
              </button>
            ))}
          </div>
          <h2 className="st-h">Opening line <i className="st-opt">optional</i></h2>
          <select className="st-select" value={INTRO_PRESETS.some((i) => i.text === draft.intro) || draft.intro === "" || draft.intro === "none" ? draft.intro : "__custom"} onChange={(e) => patch({ intro: e.target.value === "__custom" ? "" : e.target.value })} aria-label="Opening line">
            <option value="">Designer’s choice</option>
            {Array.from(new Set(INTRO_PRESETS.map((i) => i.group))).map((g) => (
              <optgroup key={g} label={g}>{INTRO_PRESETS.filter((i) => i.group === g).map((i) => <option key={i.id} value={i.id === "none" ? "none" : i.text}>{i.label}</option>)}</optgroup>
            ))}
            <option value="__custom">Write my own…</option>
          </select>
          {!INTRO_PRESETS.some((i) => i.text === draft.intro) && draft.intro !== "" && draft.intro !== "none" && (
            <input className="st-select" value={draft.intro} maxLength={120} onChange={(e) => patch({ intro: e.target.value })} placeholder="Your own opening line" aria-label="Custom opening line" />
          )}
        </>
      )}
      <div className="st-soon" aria-disabled="true"><strong>Music</strong><span>Not built yet</span></div>
      <Link href="/invite/print" target="_blank" className="st-link"><Printer size={16} /> A5 print layout <ArrowUpRight size={14} /></Link>
    </div>
  );
}

const blank = { title: "", startsOn: "", startsAt: "", venue: "", address: "", city: "", visibility: "invited" as "invited" | "everyone" };
function EventsTab({ account, events, reload }: { account: boolean; events: RawEvent[]; reload: () => Promise<void> }) {
  const [f, setF] = useState(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr(null);
    const body = { ...f, startsOn: f.startsOn || null, startsAt: f.startsAt || null };
    if (!account) {
      const raw = { title: f.title.trim(), starts_on: body.startsOn, starts_at_local: body.startsAt, venue: f.venue, address: f.address, city: f.city, visibility: f.visibility };
      const list = readLocalEvents();
      writeLocalEvents(editing ? list.map((x) => (x.id === editing ? { ...x, ...raw } : x)) : [...list, newLocalEvent(raw)]);
      setF(blank); setEditing(null); await reload(); setBusy(false);
      return;
    }
    try {
      if (editing) await call("PUT", `/api/wedding/events/${editing}`, body); else await call("POST", "/api/wedding/events", body);
      setF(blank); setEditing(null); await reload();
    } catch (x) { setErr(x instanceof ApiError ? x.message : "Couldn’t save the event."); }
    setBusy(false);
  };
  const del = async (id: string, title: string) => {
    if (!confirm(`Delete “${title}”?${account ? " Replies to it will be removed." : ""}`)) return;
    if (!account) { writeLocalEvents(readLocalEvents().filter((x) => x.id !== id)); if (editing === id) { setEditing(null); setF(blank); } await reload(); return; }
    try { await call("DELETE", `/api/wedding/events/${id}`); if (editing === id) { setEditing(null); setF(blank); } await reload(); } catch (x) { setErr(x instanceof ApiError ? x.message : "Couldn’t delete."); }
  };
  return (
    <div className="st-stack">
      <h2 className="st-h">Events</h2>
      {events.length === 0 && <p className="st-help st-help--flat">No events yet. Add the first below and it appears in the preview.</p>}
      <ul className="st-events">
        {events.map((e) => (
          <li key={e.id} data-editing={editing === e.id}>
            <div><strong>{e.title}</strong><span>{[e.starts_on, e.starts_at_local, e.venue].filter(Boolean).join(" · ") || "No details yet"}</span></div>
            <button type="button" className="st-ico" aria-label={`Edit ${e.title}`} onClick={() => { setEditing(e.id); setF({ title: e.title, startsOn: e.starts_on ?? "", startsAt: e.starts_at_local ?? "", venue: e.venue, address: e.address ?? "", city: e.city, visibility: e.visibility }); }}><Pencil size={15} /></button>
            <button type="button" className="st-ico" aria-label={`Delete ${e.title}`} onClick={() => del(e.id, e.title)}><Trash2 size={15} /></button>
          </li>
        ))}
      </ul>
      <form className="st-stack" onSubmit={save}>
        <h3 className="st-h2">{editing ? "Edit event" : "Add an event"}</h3>
        <label className="st-field"><span>Name</span><input required maxLength={80} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Nikah" /></label>
        <div className="st-row">
          <label className="st-field"><span>Date</span><input type="date" value={f.startsOn} onChange={(e) => setF({ ...f, startsOn: e.target.value })} /></label>
          <label className="st-field"><span>Time</span><input type="time" value={f.startsAt} onChange={(e) => setF({ ...f, startsAt: e.target.value })} /></label>
        </div>
        <label className="st-field"><span>Venue</span><input maxLength={80} value={f.venue} onChange={(e) => setF({ ...f, venue: e.target.value })} /></label>
        <label className="st-field"><span>Street address</span><input maxLength={160} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} placeholder="1 High Street, N1 1AA" autoComplete="off" /></label>
        <label className="st-field"><span>City</span><input maxLength={80} value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></label>
        <label className="st-field"><span>Who can see it?</span>
          <select value={f.visibility} onChange={(e) => setF({ ...f, visibility: e.target.value as "invited" | "everyone" })}>
            <option value="invited">Only guests invited to it</option><option value="everyone">Anyone with the public link</option>
          </select></label>
        {err && <small className="st-err" role="alert">{err}</small>}
        <div className="st-btns">
          <button className="btn btn-dark" disabled={busy || !f.title.trim()}>{editing ? "Save event" : <><Plus size={16} /> Add event</>}</button>
          {editing && <button type="button" className="btn btn-light" onClick={() => { setEditing(null); setF(blank); }}>Cancel</button>}
        </div>
        <p className="st-help st-help--flat">{account ? <>Choose who’s invited to each event in <Link href="/dashboard" className="st-inl">Guests</Link>.</> : "Saved on this device. They move to your account when you create one."}</p>
      </form>
    </div>
  );
}

function PhotoTab({ draft, patch, signedIn }: TabProps & { signedIn: boolean }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const photo = draft.photo;
  const take = async (f: File | undefined) => {
    if (!f) return;
    setBusy(true); setErr(null);
    try { patch({ photo: await storePhoto(f, signedIn) }); } catch (e) { setErr(e instanceof Error ? e.message : "Couldn’t add that photo."); }
    setBusy(false);
  };
  const focus = (e: React.MouseEvent<HTMLDivElement> | React.PointerEvent<HTMLDivElement>) => {
    if (!photo) return;
    const r = e.currentTarget.getBoundingClientRect();
    patch({ photo: { ...photo, fx: Math.round(((e.clientX - r.left) / r.width) * 100), fy: Math.round(((e.clientY - r.top) / r.height) * 100) } });
  };
  const nudge = (dx: number, dy: number) => photo && patch({ photo: { ...photo, fx: Math.max(0, Math.min(100, photo.fx + dx)), fy: Math.max(0, Math.min(100, photo.fy + dy)) } });
  return (
    <div className="st-stack">
      <h2 className="st-h">Your photograph</h2>
      <p className="st-help">Shown full-bleed on Gallery, inside the window on Arch, and at the top of your invitation on every design.</p>
      {!photo ? (
        <label className="st-drop" data-drag={drag} onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); take(e.dataTransfer.files?.[0]); }}>
          <Upload size={22} />
          <strong>{busy ? "Adding…" : "Add a photo"}</strong>
          <span>Drop one here, or choose from your device. JPEG, PNG or WebP.</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { take(e.target.files?.[0]); e.target.value = ""; }} />
        </label>
      ) : (
        <>
          <div className="st-focus" role="group" aria-label="Choose the focal point">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} alt="Your photograph" draggable={false} />
            <div className="st-focus-hit" onPointerDown={focus} onPointerMove={(e) => e.buttons === 1 && focus(e)} />
            <i className="st-dot" style={{ left: `${photo.fx}%`, top: `${photo.fy}%` }} />
          </div>
          <p className="st-help st-help--flat">Tap the part of the photo that matters most. It stays in frame when the picture is cropped.</p>
          <div className="st-nudge" role="group" aria-label="Fine-tune focal point">
            <button type="button" onClick={() => nudge(0, -6)} aria-label="Move focus up">↑</button><button type="button" onClick={() => nudge(-6, 0)} aria-label="Move focus left">←</button><button type="button" onClick={() => nudge(6, 0)} aria-label="Move focus right">→</button><button type="button" onClick={() => nudge(0, 6)} aria-label="Move focus down">↓</button>
          </div>
          <div className="st-btns">
            <label className="btn btn-light">Replace<input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { take(e.target.files?.[0]); e.target.value = ""; }} /></label>
            <button type="button" className="btn btn-light" onClick={() => patch({ photo: null })}>Remove</button>
          </div>
        </>
      )}
      {err && <small className="st-err" role="alert">{err}</small>}
      {!signedIn && <p className="st-help st-help--flat">Photos stay on this device until you create an account.</p>}
    </div>
  );
}
