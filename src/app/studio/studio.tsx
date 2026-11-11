"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Eye, Film, ImagePlus, Layers3, ListMusic, LoaderCircle, MapPin, Maximize2, Minus, Palette, Pencil, Plus, RotateCcw, RotateCw, Settings2, Sparkles, Trash2, Type, UploadCloud, Volume2, X } from "lucide-react";
import { Confetti, MusicNotes, TextT, CalendarBlank, ImageSquare, PaintBrush } from "@phosphor-icons/react";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { call, ApiError } from "@/lib/api-client";
import { designs, daysUntil, PENDING_EVENTS_KEY, type DesignId, type InviteData, type InviteEvent } from "@/lib/designs";
import { FONT_PACKS, INTRO_PRESETS, OPENINGS, OPENING_CHOICES, paletteOf, specById, type OpeningKind } from "@/engine/registry";
import { useStudioDraft } from "@/lib/use-draft";
import { saveLocalMusic, readLocalMusic } from "@/lib/local-music";
import { CURATED_TRACKS } from "@/lib/music-library";
import { SoundWaveform } from "@/components/studio/sound-waveform";
import "./studio.css";
import "./guided-studio.css";

type Panel = "story" | "events" | "look" | "photo" | "sound" | "extras";
type View = "cover" | "inside";
type CanvasScene = "paper" | "gallery" | "ink";
type CanvasFrame = "device" | "soft" | "edge";
type RawEvent = { id: string; title: string; starts_on: string | null; starts_at_local: string | null; venue: string; city: string; visibility: "invited" | "everyone" };
type Patch = (changes: Partial<InviteData>) => void;
const tools: { id: Panel; name: string; detail: string; icon: typeof Pencil }[] = [
  { id: "story", name: "Words", detail: "Names and invitation message", icon: Type },
  { id: "events", name: "Celebrations", detail: "Dates, venues and schedule", icon: CalendarDays },
  { id: "look", name: "Design", detail: "Layout, colours, lettering and opening", icon: Palette },
  { id: "photo", name: "Images", detail: "Photographs and cropping", icon: ImagePlus },
  { id: "sound", name: "Music", detail: "Choose a track and set playback", icon: ListMusic },
  { id: "extras", name: "Details", detail: "Countdown and guest-facing labels", icon: Sparkles },
];
const dockIcons = { story: TextT, events: CalendarBlank, look: PaintBrush, photo: ImageSquare, sound: MusicNotes, extras: Confetti };
const occasions = ["Wedding", "Nikah", "Walima", "Mehndi", "Reception", "Civil ceremony"];
const sampleNotes = [
  { label: "Heartfelt", text: "We’re so happy to share this day with the people we love most. Please join us." },
  { label: "Classic", text: "Together with our families, we request the pleasure of your company as we celebrate our wedding." },
  { label: "Simple", text: "Come celebrate with us." },
];

export function Studio() {
  const { draft, patch, undo, redo, canUndo, canRedo, state, account, ready, reload } = useStudioDraft();
  const params = useSearchParams();
  const [panel, setPanel] = useState<Panel>("story");
  const [sending, setSending] = useState(false);
  const [mobileMode, setMobileMode] = useState<"edit" | "preview">("edit");
  const [view, setView] = useState<View>("cover");
  const [mobileFull, setMobileFull] = useState(false);
  const [canvasScene, setCanvasScene] = useState<CanvasScene>("paper");
  const [canvasFrame, setCanvasFrame] = useState<CanvasFrame>("device");
  const [notice, setNotice] = useState("");
  const [rawEvents, setRawEvents] = useState<RawEvent[]>([]);

  const loadEvents = useCallback(async () => {
    if (account) {
      try { setRawEvents((await call("GET", "/api/wedding/events")).events); }
      catch { setNotice("Events couldn't load. Check your connection and try again."); }
      return;
    }
    try {
      const pending = JSON.parse(localStorage.getItem(PENDING_EVENTS_KEY) || "[]") as { id?: string; title: string; startsOn?: string; startsAt?: string; venue?: string; city?: string; visibility?: "invited" | "everyone" }[];
      setRawEvents(pending.map((e, i) => ({ id: e.id ?? `local-${i}`, title: e.title, starts_on: e.startsOn || null, starts_at_local: e.startsAt || null, venue: e.venue ?? "", city: e.city ?? "", visibility: e.visibility ?? "invited" })));
    } catch { setRawEvents([]); }
  }, [account]);
  useEffect(() => { void loadEvents(); }, [loadEvents]);
  useEffect(() => {
    const chosen = params.get("design");
    if (ready && chosen && designs.some((d) => d.id === chosen) && draft.design !== chosen) patch({ design: chosen as DesignId, accent: "" });
  }, [ready, params, draft.design, patch]);
  useEffect(() => { if (params.get("stage") === "send") setSending(true); }, [params]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileFull(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    try { const prefs = JSON.parse(localStorage.getItem("wedsent-studio-canvas-v1") || "{}"); if (["paper", "gallery", "ink"].includes(prefs.scene)) setCanvasScene(prefs.scene); if (["device", "soft", "edge"].includes(prefs.frame)) setCanvasFrame(prefs.frame); } catch { /* default to paper */ }
  }, []);
  useEffect(() => { localStorage.setItem("wedsent-studio-canvas-v1", JSON.stringify({ scene: canvasScene, frame: canvasFrame })); }, [canvasScene, canvasFrame]);

  const events: InviteEvent[] = rawEvents.map((e) => ({ id: e.id, title: e.title, startsOn: e.starts_on, startsAt: e.starts_at_local, venue: e.venue, city: e.city }));
  const select = (id: Panel) => {
    setPanel(id);
    setSending(false);
    setMobileMode("edit");
    setMobileFull(false);
    setView(id === "look" || id === "photo" ? "cover" : "inside");
  };
  const showSend = () => { setSending(true); setMobileMode("edit"); };
  const tool = tools.find((entry) => entry.id === panel)!;
  const saveLabel = state === "saved" ? account ? "Saved to account" : "Saved on this device" : state === "saving" ? "Saving…" : state === "conflict" ? "Changed in another tab" : state === "offline" ? "Offline, not synced" : state === "failed" ? "Save failed" : "Loading…";
  const missing = [!draft.names.trim() && "Names", !draft.date && "Date", !draft.venue.trim() && !rawEvents.some((e) => e.venue) && "Venue"].filter(Boolean);

  return <div className="atelier atelier--guided" data-full={mobileFull} data-mode={mobileMode}>
    <header className="atelier-top">
      <Link href={account ? "/dashboard" : "/"} className="atelier-brand" aria-label="Wedsent"><span className="atelier-brand-word">wedsent<span className="studio-brand-dot">.</span></span><span>Studio</span></Link>
      <div className="atelier-top-middle"><span className="atelier-file">{draft.names || "Your invitation"}</span><span className="atelier-save" data-state={state}>{state === "saving" || state === "loading" ? <LoaderCircle size={13} className="atelier-spin"/> : <span className="atelier-save-dot"/>}{saveLabel}</span>{state === "conflict" && <button onClick={reload}>Reload</button>}</div>
      <div className="atelier-top-actions">
        <button className="atelier-icon-button" type="button" aria-label="Undo" title="Undo" disabled={!canUndo} onClick={undo}><RotateCcw size={17}/></button>
        <button className="atelier-icon-button" type="button" aria-label="Redo" title="Redo" disabled={!canRedo} onClick={redo}><RotateCw size={17}/></button>
      </div>
    </header>

    <nav className="atelier-dock" aria-label="Invitation tools">
      {tools.map((item) => <button key={item.id} type="button" className="studio-tool" aria-pressed={!sending && panel === item.id} onClick={() => select(item.id)}><item.icon size={17} /><span>{item.name}</span></button>)}
      <button type="button" className="studio-tool studio-tool--send" aria-pressed={sending} onClick={showSend}><ArrowRight size={17} /> Publish & share</button>
    </nav>

    <main className="atelier-stage" data-scene={canvasScene} data-frame={canvasFrame} aria-label="Live invitation composition">
      <div className="atelier-stage-top"><div><h1>Invitation preview</h1></div><div className="atelier-stage-tools"><div className="atelier-view-switch" role="group" aria-label="Invitation preview state"><button type="button" aria-pressed={view === "cover"} onClick={() => setView("cover")}>Opening</button><button type="button" aria-pressed={view === "inside"} onClick={() => setView("inside")}>Inside</button></div></div></div>
      <div className="atelier-stage-centre">
        <div className="atelier-preview-frame" style={{ ["--preview-tone" as string]: specById(draft.design).site.bg }}>
          <Phone label="Your live invitation"><Invitation data={draft} events={events} open={view === "inside"} onOpenChange={(opened) => setView(opened ? "inside" : "cover")} onEditTarget={(target) => select(target === "words" ? "story" : target === "details" || target === "events" ? "events" : "extras")}/></Phone>
        </div>
      </div>
      <div className="atelier-stage-bottom"><div><button type="button" onClick={() => setMobileFull(true)}><Maximize2 size={15}/> Full preview</button></div></div>
      {!missing.length ? <span className="atelier-ready"><Check size={13}/> Essentials added</span> : <button className="atelier-ready atelier-ready--todo" type="button" onClick={() => select(missing.includes("Names") ? "story" : "events")}>{missing.length} essential {missing.length === 1 ? "detail" : "details"} to review <ArrowRight size={13}/></button>}
    </main>

    <aside className="atelier-inspector" aria-label="Invitation editor">
      <header className="atelier-inspector-head"><h2>{sending ? "Publish & share" : tool.name}</h2></header>
      <div className="atelier-inspector-scroll" key={panel}>
        {sending && <div className="studio-send"><span className="studio-send-mark"><Check size={26}/></span><h3>{missing.length ? "Before you invite everyone…" : "Let's get your invitations out."}</h3>{missing.length ? <p>Still to add: {missing.join(", ")}. Complete these essentials before publishing. Your edits stay saved while you work.</p> : <p>Next, add your households, publish your invitation and choose how to share each personal link. Replies will appear in your dashboard.</p>}<Link href={account ? "/dashboard?tab=Guests" : "/signin?mode=up&next=%2Fstudio%3Fstage%3Dsend"}>{account ? "Manage guest list" : "Create account to continue"}<ArrowRight size={17}/></Link>{missing.length > 0 && <button type="button" className="studio-send-return" onClick={() => select(missing.includes("Venue") ? "events" : "story")}>Edit missing details <Pencil size={15}/></button>}<small>Guests can reply without signing in. Sending an invitation requires publishing it first.</small></div>}
        {!sending && panel === "story" && <StoryEditor draft={draft} patch={patch}/>}
        {!sending && panel === "events" && <EventsEditor account={!!account} draft={draft} patch={patch} events={rawEvents} reload={loadEvents}/>}
        {!sending && panel === "look" && <LookEditor draft={draft} patch={patch} replay={() => setView("cover")}/>}
        {!sending && panel === "photo" && <PhotoEditor draft={draft} patch={patch} account={!!account}/>}
        {!sending && panel === "sound" && <SoundEditor draft={draft} patch={patch} account={!!account}/>}
        {!sending && panel === "extras" && <ExtrasEditor draft={draft} patch={patch}/>}
      </div>
    </aside>
    <nav className="atelier-mobile-nav" aria-label="Mobile Studio navigation">
      <div className="studio-mobile-steps">
        {tools.map((item) => <button key={item.id} type="button" aria-pressed={!sending && panel === item.id} onClick={() => select(item.id)}>{item.name}</button>)}
        <button type="button" aria-pressed={sending} onClick={showSend}>Publish</button>
      </div>
      <div className="studio-mobile-modes"><button type="button" aria-pressed={mobileMode === "edit"} onClick={() => setMobileMode("edit")}><Pencil size={16} /> Edit</button><button type="button" aria-pressed={mobileMode === "preview"} onClick={() => setMobileMode("preview")}><Eye size={16} /> Preview</button></div>
    </nav>
    {notice && <div className="atelier-toast" role="status">{notice}<button type="button" aria-label="Dismiss notification" onClick={() => setNotice("")}><X size={15}/></button></div>}
    {mobileFull && <div className="atelier-fullscreen" role="dialog" aria-modal="true" aria-label="Guest invitation preview"><div className="atelier-fullscreen-controls"><button onClick={() => setMobileFull(false)}><ArrowLeft size={17}/> Back to Studio</button><div><button type="button" onClick={() => setView("cover")}>Opening</button><button type="button" onClick={() => setView("inside")}>Inside</button></div></div><div className="atelier-fullscreen-invitation"><Invitation data={draft} events={events} open={view === "inside"} onOpenChange={(opened) => setView(opened ? "inside" : "cover")}/></div></div>}
  </div>;
}

function Field({ title, children, hint }: { title: string; children: React.ReactNode; hint?: string }) { return <label className="atelier-field"><span>{title}</span>{children}{hint && <small>{hint}</small>}</label>; }
function Group({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) { return <section className="atelier-group"><div className="atelier-group-title"><h3>{title}</h3>{note && <p>{note}</p>}</div>{children}</section>; }

function StoryEditor({ draft, patch }: { draft: InviteData; patch: Patch }) {
  return <>
    <Group title="The couple"><Field title="Names"><input aria-label="Names" maxLength={60} value={draft.names} onChange={(e) => patch({ names: e.target.value })} placeholder="e.g. Amina & Yusuf" aria-invalid={!draft.names.trim()}/></Field>
      <Field title="Celebration"><select value={occasions.includes(draft.occasion) ? draft.occasion : "other"} onChange={(e) => patch({ occasion: e.target.value === "other" ? "" : e.target.value })}>{occasions.map((o) => <option key={o}>{o}</option>)}<option value="other">Something else</option></select></Field>
      {!occasions.includes(draft.occasion) && <Field title="Name your celebration"><input value={draft.occasion} maxLength={30} onChange={(e) => patch({ occasion: e.target.value })}/></Field>}
    </Group>
    <Group title="Invitation message"><Field title="Your words"><textarea value={draft.message} maxLength={600} rows={4} onChange={(e) => patch({ message: e.target.value })} placeholder="We would love you to be there…"/></Field>
      <div className="atelier-preset-list">{sampleNotes.map((s) => <button type="button" key={s.label} aria-pressed={draft.message === s.text} onClick={() => patch({ message: s.text })}><strong>{s.label}</strong><span>{s.text}</span>{draft.message === s.text && <Check size={15}/>}</button>)}</div>
      <div className="atelier-choice-grid">{(["plain", "framed", "editorial"] as const).map((s) => <button type="button" key={s} aria-pressed={draft.messageStyle === s} onClick={() => patch({ messageStyle: s })}><span className={`atelier-message-style atelier-message-style--${s}`}>Together, always.</span><strong>{s === "plain" ? "Clean" : s === "framed" ? "Bordered" : "Editorial"}</strong></button>)}</div>
    </Group>
    <Group title="Guest details"><Field title="Dress code"><input value={draft.dress} maxLength={80} onChange={(e) => patch({ dress: e.target.value })} placeholder="Optional, e.g. Black tie"/></Field><Field title="Reply by"><input type="date" value={draft.rsvpBy} onChange={(e) => patch({ rsvpBy: e.target.value })}/></Field></Group>
  </>;
}

const emptyEvent = { title: "", startsOn: "", startsAt: "", venue: "", city: "", visibility: "invited" as "invited" | "everyone" };
function EventsEditor({ draft, patch, account, events, reload }: { draft: InviteData; patch: Patch; account: boolean; events: RawEvent[]; reload: () => Promise<void> }) {
  const [form, setForm] = useState(emptyEvent);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const storeLocal = (next: RawEvent[]) => localStorage.setItem(PENDING_EVENTS_KEY, JSON.stringify(next.map((e) => ({ id: e.id, title: e.title, startsOn: e.starts_on, startsAt: e.starts_at_local, venue: e.venue, city: e.city, visibility: e.visibility }))));
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError("");
    const payload = { ...form, startsOn: form.startsOn || null, startsAt: form.startsAt || null };
    try {
      if (account) await call(editing ? "PUT" : "POST", editing ? `/api/wedding/events/${editing}` : "/api/wedding/events", payload);
      else { const item = { id: editing ?? crypto.randomUUID(), title: payload.title, starts_on: payload.startsOn, starts_at_local: payload.startsAt, venue: payload.venue, city: payload.city, visibility: payload.visibility }; storeLocal(editing ? events.map((x) => x.id === editing ? item : x) : [...events, item]); }
      setForm(emptyEvent); setEditing(null); await reload();
    } catch (err) { setError(err instanceof Error ? err.message : "Couldn't save the event."); }
    finally { setBusy(false); }
  };
  const remove = async (event: RawEvent) => {
    if (!window.confirm(`Remove ${event.title}? Its replies may be deleted.`)) return;
    try { if (account) await call("DELETE", `/api/wedding/events/${event.id}`); else storeLocal(events.filter((e) => e.id !== event.id)); await reload(); if (editing === event.id) { setEditing(null); setForm(emptyEvent); } }
    catch (err) { setError(err instanceof Error ? err.message : "Couldn't remove the event."); }
  };
  return <>
    <div className="atelier-intro"><strong>Where and when?</strong><p>Add one celebration or several. Nikah, Walima, Mehndi and reception are all optional, and guests can be invited to specific events later.</p></div>
    <Group title="Main date & venue"><div className="atelier-two"><Field title="Date"><input type="date" value={draft.date} aria-label="Date" onChange={(e) => patch({ date: e.target.value })}/></Field><Field title="Time"><input type="time" value={draft.time} onChange={(e) => patch({ time: e.target.value })}/></Field></div>
      <Field title="Venue"><input aria-label="Venue" maxLength={80} value={draft.venue} onChange={(e) => patch({ venue: e.target.value })} placeholder="The Glasshouse"/></Field>
      <Field title="Address"><input maxLength={160} value={draft.address} onChange={(e) => patch({ address: e.target.value })} placeholder="Street, postcode"/></Field>
      <Field title="City"><input maxLength={80} value={draft.city} onChange={(e) => patch({ city: e.target.value })} placeholder="London"/></Field>
      <p className="atelier-small-note"><MapPin size={13}/> Guests can open directions from their invitation.</p>
    </Group>
    <Group title="Event schedule" note="Add individual celebrations when the wedding spans more than one occasion.">
      {events.length > 0 && <div className="atelier-event-list">{events.map((item) => <div key={item.id} className="atelier-event-row"><div><strong>{item.title}</strong><small>{[item.starts_on, item.starts_at_local, item.venue].filter(Boolean).join(" · ") || "Add time and place"}</small></div><button type="button" aria-label={`Edit ${item.title}`} onClick={() => { setEditing(item.id); setForm({ title: item.title, startsOn: item.starts_on ?? "", startsAt: item.starts_at_local ?? "", venue: item.venue, city: item.city, visibility: item.visibility }); }}><Pencil size={15}/></button><button type="button" aria-label={`Delete ${item.title}`} onClick={() => void remove(item)}><Trash2 size={15}/></button></div>)}</div>}
      <form className="atelier-event-form" onSubmit={(e) => void save(e)}><h4>{editing ? "Edit celebration" : "Add a celebration"}</h4><Field title="Event name"><input required maxLength={80} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Nikah"/></Field><div className="atelier-two"><Field title="Date"><input type="date" value={form.startsOn} onChange={(e) => setForm({ ...form, startsOn: e.target.value })}/></Field><Field title="Time"><input type="time" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })}/></Field></div><Field title="Venue"><input maxLength={80} value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })}/></Field><Field title="City"><input maxLength={80} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}/></Field><Field title="Who can see this event?"><select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value as RawEvent["visibility"] })}><option value="invited">Guests invited to it</option><option value="everyone">Anyone with the public link</option></select></Field>{error && <p className="atelier-error" role="alert">{error}</p>}<div className="atelier-form-actions"><button type="submit" disabled={busy || !form.title.trim()}><Plus size={15}/>{editing ? "Save changes" : "Add event"}</button>{editing && <button type="button" onClick={() => { setEditing(null); setForm(emptyEvent); }}>Cancel</button>}</div></form>
      <p className="atelier-small-note">{account ? "Manage who is invited from the guest dashboard." : "In build mode, events stay in this browser until you create an account."}</p>
    </Group>
  </>;
}

function LookEditor({ draft, patch, replay }: { draft: InviteData; patch: Patch; replay: () => void }) {
  const spec = specById(draft.design);
  const selected = paletteOf(spec, draft.palette);
  return <><div className="atelier-intro"><strong>Choose a visual world.</strong><p>Different invitation compositions, not just colour changes. Your names and events stay in place when you switch.</p></div>
    <Group title="Invitation designs"><div className="atelier-design-list">{designs.map((d) => <button key={d.id} type="button" aria-pressed={draft.design === d.id} onClick={() => { patch({ design: d.id, palette: "", accent: "", opening: "" }); replay(); }}><span className="atelier-design-thumb" style={{ background: d.bg, color: d.ink }}><Invitation data={{ ...draft, design: d.id, palette: "", accent: "", opening: "" }} still/></span><span><strong>{d.name}</strong><small>{d.mood}</small><em>{d.opening}</em></span>{draft.design === d.id && <Check size={17}/>}</button>)}</div></Group>
    <Group title="Colour" note={undefined}><div className="atelier-palette-grid">{spec.palettes.map((p) => <button type="button" key={p.id} aria-pressed={p.id === selected.id && !draft.accent} onClick={() => patch({ palette: p.id, accent: "" })}><span style={{ background: p.bg, color: p.fg }}><i style={{ background: p.accent }}/><b>A & Y</b></span><strong>{p.name}</strong></button>)}</div><Field title="Custom accent"><input type="color" aria-label="Custom accent colour" value={draft.accent || selected.accent} onChange={(e) => patch({ accent: e.target.value })}/></Field><button className="atelier-text-action" type="button" onClick={() => patch({ accent: "" })}>Use the design colour</button></Group>
    <Group title="Lettering"><div className="atelier-font-grid"><button type="button" aria-pressed={!draft.type} onClick={() => patch({ type: "" })}>Designer’s choice</button>{FONT_PACKS.filter((f) => f.script || ["classic", "didone", "deco", "italiana", "garamond"].includes(f.id)).map((f) => <button type="button" key={f.id} aria-pressed={draft.type === f.id} onClick={() => patch({ type: f.id })}><span style={{ fontFamily: f.script ?? f.head }}>{(draft.names || "Amina").split(/[ &]/)[0]}</span><small>{f.name}</small></button>)}</div></Group>
    <Group title="Opening experience" note="Each design has a crafted opening. Choose a simple alternative reveal, or keep the original."><div className="atelier-opening-grid"><button type="button" aria-pressed={!draft.opening} onClick={() => { patch({ opening: "" }); replay(); }}><Film size={21}/><strong>Design original</strong><small>The artist’s intended entrance</small></button>{OPENING_CHOICES.map((key) => <button type="button" key={key} aria-pressed={draft.opening === key} onClick={() => { patch({ opening: key }); replay(); }}><Film size={21}/><strong>{OPENINGS[key].label}</strong><small>{OPENINGS[key].hint}</small></button>)}</div><Field title="Opening line"><select aria-label="Opening line" value={draft.intro === "" || draft.intro === "none" || INTRO_PRESETS.some((p) => p.text === draft.intro) ? draft.intro : "custom"} onChange={(e) => patch({ intro: e.target.value === "custom" ? "Custom introduction" : e.target.value })}><option value="">Design original</option><option value="none">No opening line</option>{INTRO_PRESETS.filter((p) => p.id !== "none").map((p) => <option key={p.id} value={p.text}>{p.label}</option>)}<option value="custom">Write my own</option></select></Field>{draft.intro && draft.intro !== "none" && !INTRO_PRESETS.some((p) => p.text === draft.intro) && <Field title="Custom opening line"><input maxLength={120} value={draft.intro} onChange={(e) => patch({ intro: e.target.value })}/></Field>}</Group>
  </>;
}

function PhotoEditor({ draft, patch, account }: { draft: InviteData; patch: Patch; account: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const upload = async (file?: File) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 15_000_000) { setError("Use a JPEG, PNG or WebP image under 15 MB."); return; }
    setBusy(true); setError("");
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas"); canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Photo processing isn't available in this browser.");
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => b ? resolve(b) : reject(new Error("Couldn't process this image.")), "image/jpeg", 0.8));
      if (blob.size > 2_500_000) throw new Error("Choose a smaller photograph.");
      let src = "";
      if (account) {
        const response = await fetch("/api/media", { method: "POST", credentials: "same-origin", body: blob }); const json = await response.json();
        if (!response.ok) throw new Error(json?.error?.message || "Photo upload failed."); src = json.src;
      } else src = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("Couldn't read the photo.")); reader.readAsDataURL(blob); });
      patch({ photo: { src, fx: 50, fy: 50 } });
    } catch (e) { setError(e instanceof Error ? e.message : "Photo upload failed."); }
    finally { setBusy(false); }
  };
  return <><div className="atelier-intro"><strong>Your favourite photograph.</strong><p>One beautiful image can make the invitation personal. Some designs are intentionally typography-only.</p></div><Group title="Photograph"><label className="atelier-upload"><UploadCloud size={26}/><strong>{busy ? "Processing photograph…" : draft.photo ? "Replace your image" : "Choose an image"}</strong><span>JPEG, PNG or WebP · up to 15 MB</span><input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(e) => { void upload(e.target.files?.[0]); e.target.value = ""; }}/></label>{draft.photo && <><div className="atelier-photo-preview"><img src={draft.photo.src} alt="Your selected photograph" style={{ objectPosition: `${draft.photo.fx}% ${draft.photo.fy}%` }}/></div><Field title="Move crop horizontally"><input type="range" min="0" max="100" value={draft.photo.fx} onChange={(e) => patch({ photo: { ...draft.photo!, fx: Number(e.target.value) } })}/></Field><Field title="Move crop vertically"><input type="range" min="0" max="100" value={draft.photo.fy} onChange={(e) => patch({ photo: { ...draft.photo!, fy: Number(e.target.value) } })}/></Field><button className="atelier-text-action" type="button" onClick={() => patch({ photo: null })}><Trash2 size={14}/> Remove image</button></>}{error && <p className="atelier-error" role="alert">{error}</p>}{!account && <p className="atelier-small-note">Build-mode photos are saved only in this browser.</p>}</Group></>;
}

function SoundEditor({ draft, patch, account }: { draft: InviteData; patch: Patch; account: boolean }) {
  const [step, setStep] = useState<"browse" | "edit" | "upload">(draft.music ? "edit" : "browse");
  const [myTracks, setMyTracks] = useState<{ id: string; title: string; bytes: number; src: string }[]>([]);
  const [libraryError, setLibraryError] = useState("");
  const [category, setCategory] = useState<"nasheed" | "duff" | "instrumental" | "songs">("nasheed");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [revision, setRevision] = useState(0);
  const refreshMyTracks = useCallback(async () => {
    if (!account) return;
    try { const result = await call<{ tracks: { id: string; title: string; bytes: number; src: string }[] }>("GET", "/api/music"); setMyTracks(result.tracks); setLibraryError(""); }
    catch { setLibraryError("Your uploads couldn't load. Please try again."); }
  }, [account]);
  useEffect(() => { void refreshMyTracks(); }, [refreshMyTracks]);
  useEffect(() => {
    let alive = true; let url = "";
    const src = draft.music?.src;
    if (src !== "local-music") return;
    readLocalMusic().then((blob) => { if (!alive) return; if (!blob) { setError("Local recording missing. Upload it again."); return; } url = URL.createObjectURL(blob); setPreview(url); }).catch(() => { if (alive) setError("Couldn't load your local recording."); });
    return () => { alive = false; if (url) URL.revokeObjectURL(url); };
  }, [draft.music?.src, revision]);
  const upload = async (file?: File) => {
    if (!file) return;
    if (!confirmed || !/\.mp3$/i.test(file.name) || file.size > 12_000_000) { setError("Confirm your rights and choose an MP3 smaller than 12 MB."); return; }
    setBusy(true); setError("");
    try {
      let src = "local-music";
      if (account) { const r = await fetch("/api/music", { method: "POST", body: file, credentials: "same-origin", headers: { "x-music-rights": "confirmed", "x-music-title": file.name.replace(/\.mp3$/i, "").slice(0, 100) } }); const j = await r.json(); if (!r.ok) throw new Error(j?.error?.message || "Couldn't upload the recording."); src = j.src; await refreshMyTracks(); }
      else await saveLocalMusic(file);
      patch({ music: { src, title: file.name.replace(/\.mp3$/i, "").slice(0, 80), startAt: 0, endAt: 15, trigger: "open", volume: .45 } }); setRevision((i) => i + 1); setStep("edit");
    } catch (e) { setError(e instanceof Error ? e.message : "Couldn't upload the recording."); }
    finally { setBusy(false); }
  };
  const selectedSrc = draft.music?.src === "local-music" ? preview : draft.music?.src || "";
  return <><div className="atelier-intro"><strong>Set the mood.</strong><p>Pick a recording, choose your favourite 15 seconds, then decide when guests hear it.</p></div>
    {draft.music && <div className="atelier-selected-track"><span><Volume2 size={16}/> PLAYING ON YOUR INVITATION</span><strong>{draft.music.title}</strong><p>{`From ${draft.music.startAt ?? 0}s to ${draft.music.endAt ?? "the end"}s · ${draft.music.trigger === "manual" ? "Guest presses play" : draft.music.trigger === "load" ? "On page load, if allowed" : "After opening"}`}</p><button type="button" onClick={() => { patch({ music: null }); setStep("browse"); }}>Remove soundtrack <Minus size={14}/></button></div>}
    <div className="atelier-sound-steps" role="group" aria-label="Music tools"><button type="button" aria-pressed={step === "browse"} onClick={() => setStep("browse")}><ListMusic size={15}/> Library</button><button type="button" aria-pressed={step === "edit"} onClick={() => setStep("edit")} disabled={!draft.music}><Settings2 size={15}/> Trim & timing</button><button type="button" aria-pressed={step === "upload"} onClick={() => setStep("upload")}><UploadCloud size={15}/> Upload</button></div>
    {step === "browse" && <Group title="Explore by sound"><div className="atelier-filter-row" role="group" aria-label="Soundtrack categories">{([{ id: "nasheed", name: "Nasheeds" }, { id: "duff", name: "Duff" }, { id: "instrumental", name: "Instrumental" }, { id: "songs", name: "Songs" }] as const).map((c) => <button type="button" key={c.id} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>{c.name}</button>)}</div><div className="atelier-track-list">{CURATED_TRACKS.filter((t) => t.category === category).map((track) => <div key={track.id} className="atelier-track"><div><strong>{track.title}</strong><small>{track.mood} · {track.artist}</small></div><button type="button" className="atelier-track-select" aria-pressed={draft.music?.src === track.src} onClick={() => { patch({ music: { src: track.src, title: track.title, startAt: 0, endAt: 15, trigger: "open", volume: .45 } }); setStep("edit"); }}>{draft.music?.src === track.src ? <Check size={17}/> : <Plus size={17}/>}</button><audio controls preload="none" src={track.src} aria-label={`Listen to ${track.title}`}/><small className="atelier-source">{track.source && <><a href={track.source} target="_blank" rel="noreferrer">Source</a> · </>}{track.licenseUrl ? <a href={track.licenseUrl} target="_blank" rel="noreferrer">{track.license}</a> : track.license}</small></div>)}{!CURATED_TRACKS.some((t) => t.category === category) && <p className="atelier-small-note">Nothing in this collection yet.</p>}</div><p className="atelier-small-note">Recordings supplied by the owner are marked separately from Creative Commons material.</p></Group>}
    {step === "edit" && draft.music && <Group title="Choose the moment" note="Move the handles to the exact part you love. The preview loops this excerpt.">{selectedSrc && <SoundWaveform key={selectedSrc} src={selectedSrc} title={draft.music.title} start={draft.music.startAt ?? 0} end={draft.music.endAt} onTrim={(startAt, endAt) => patch({ music: { ...draft.music!, startAt, endAt } })}/>}<div className="atelier-two"><Field title="Start (seconds)"><input type="number" min="0" max="1799" value={draft.music.startAt ?? 0} onChange={(e) => { const startAt = Math.max(0, Math.min(1799, Number(e.target.value) || 0)); patch({ music: { ...draft.music!, startAt, endAt: draft.music!.endAt && draft.music!.endAt <= startAt ? undefined : draft.music!.endAt } }); }}/></Field><Field title="Stop (seconds)"><input type="number" min="1" max="1800" placeholder="Full track" value={draft.music.endAt ?? ""} onChange={(e) => patch({ music: { ...draft.music!, endAt: e.target.value ? Math.max((draft.music!.startAt ?? 0) + 1, Math.min(1800, Number(e.target.value))) : undefined } })}/></Field></div><Group title="When should it start?"><div className="atelier-playback-options">{([{value:"open",title:"After they open it",description:"The music begins with the invitation reveal."},{value:"load",title:"As soon as the link opens",description:"We'll try immediately. Some phones require a tap first."},{value:"manual",title:"Only when they press play",description:"Guests choose when to listen."}] as const).map((option) => <button type="button" key={option.value} aria-pressed={(draft.music!.trigger ?? "open") === option.value} onClick={() => patch({music:{...draft.music!,trigger:option.value}})}><span><strong>{option.title}</strong><small>{option.description}</small></span>{(draft.music!.trigger ?? "open") === option.value && <Check size={17}/>}</button>)}</div></Group><Field title={`Volume · ${Math.round((draft.music.volume ?? .45) * 100)}%`}><input type="range" min="0.05" max="1" step="0.05" value={draft.music.volume ?? .45} onChange={(e) => patch({ music: { ...draft.music!, volume: Number(e.target.value) } })}/></Field><p className="atelier-small-note">Only one recording plays at a time. Some browsers require guests to tap before sound can begin.</p><button className="atelier-text-action" type="button" onClick={() => setStep("browse")}>Change song <ArrowRight size={14}/></button></Group>}
    {step === "upload" && <Group title="Your recordings" note={account ? "Saved to this wedding. Choose one, or add another with appropriate rights." : "Build mode keeps one recording on this device until you create an account."}>{account && <div className="atelier-track-list">{myTracks.length === 0 && <p className="atelier-small-note">No recordings uploaded to this wedding yet.</p>}{myTracks.map((track) => <div className="atelier-track" key={track.id}><div><strong>{track.title}</strong><small>{(track.bytes / 1_000_000).toFixed(1)} MB · Your upload</small></div><button className="atelier-track-select" type="button" aria-label={`Use ${track.title}`} aria-pressed={draft.music?.src === track.src} onClick={() => { patch({ music: { src: track.src, title: track.title, startAt: 0, endAt: 15, trigger: "open", volume: .45 } }); setStep("edit"); }}>{draft.music?.src === track.src ? <Check size={17}/> : <Plus size={17}/>}</button><audio controls preload="none" src={track.src}/></div>)}{libraryError && <p role="alert" className="atelier-error">{libraryError} <button type="button" onClick={() => void refreshMyTracks()}>Retry</button></p>}</div>}<p className="atelier-small-note">Up to eight recordings per wedding; each MP3 can be up to 12 MB.</p><label className="atelier-toggle"><input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)}/><span>I have permission to stream and edit this recording for wedding guests</span></label><label className="atelier-upload"><UploadCloud size={23}/><strong>{busy ? "Uploading…" : "Add MP3"}</strong><input type="file" accept=".mp3,audio/mpeg" disabled={!confirmed || busy} onChange={(e) => { void upload(e.target.files?.[0]); e.target.value = ""; }}/></label>{error && <p role="alert" className="atelier-error">{error}</p>}{!account && <p className="atelier-small-note">Local music won't transfer automatically to another device.</p>}</Group>}
  </>;
}

function ExtrasEditor({ draft, patch }: { draft: InviteData; patch: Patch }) {
  return <><div className="atelier-intro"><strong>Little things, beautifully done.</strong><p>All optional. The invitation should still feel complete with these switched off.</p></div><Group title="Wedding countdown"><label className="atelier-toggle"><span>Show days until our wedding</span><input type="checkbox" checked={draft.countdown.enabled} onChange={(e) => patch({ countdown: { ...draft.countdown, enabled: e.target.checked } })}/></label>{draft.countdown.enabled && <><Field title="Countdown title"><input value={draft.countdown.label} maxLength={48} onChange={(e) => patch({ countdown: { ...draft.countdown, label: e.target.value } })} placeholder="Until our day"/></Field><div className="atelier-filter-row">{(["type", "tiles", "dial"] as const).map((s) => <button key={s} type="button" aria-pressed={draft.countdown.style === s} onClick={() => patch({ countdown: { ...draft.countdown, style: s } })}>{s === "type" ? "Editorial" : s === "tiles" ? "Tiles" : "Circles"}</button>)}</div><Field title="Countdown colour"><input type="color" aria-label="Countdown colour" value={draft.countdown.accent || paletteOf(specById(draft.design), draft.palette).accent} onChange={(e) => patch({ countdown: { ...draft.countdown, accent: e.target.value } })}/></Field></>}</Group><Group title="Guest-facing labels" note="These translate selected labels, not your own written message.">{([{ key: "details", label: "Details & directions" }, { key: "countdown", label: "Countdown" }, { key: "reply", label: "Reply button" }] as const).map((field) => <Field title={field.label} key={field.key}><select value={draft.languages[field.key]} onChange={(e) => patch({ languages: { ...draft.languages, [field.key]: e.target.value as "en" | "fr" | "ar" | "so" } })}><option value="en">English</option><option value="ar">العربية</option><option value="so">Soomaali</option><option value="fr">Français</option></select></Field>)}</Group><Group title="Take it further"><Link className="atelier-secondary-link" href="/invite/print" target="_blank">View A5 print layout <ArrowRight size={15}/></Link><p className="atelier-small-note">Print layout is experimental; this isn't a printer-ready proof.</p></Group></>;
}
