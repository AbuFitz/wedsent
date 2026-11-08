"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, ChevronUp, Palette, Printer, RotateCcw, RotateCw, Sparkles, Type, CalendarDays, CalendarRange, AlertCircle, Loader2, Plus, Trash2, Pencil, Share2, Music2, Image as ImageIcon, SlidersHorizontal, ChevronRight, Eye, PanelLeftClose, PanelLeftOpen, LayoutTemplate, Settings2, Send, MapPin } from "lucide-react";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { designs, daysUntil, onColor, PENDING_EVENTS_KEY, type DesignId, type InviteData, type InviteEvent } from "@/lib/designs";
import { FONT_PACKS, INTRO_PRESETS, OPENINGS, paletteOf, specById, type OpeningKind } from "@/engine/registry";
import { call, ApiError } from "@/lib/api-client";
import { useStudioDraft } from "@/lib/use-draft";
import { readLocalMusic, saveLocalMusic } from "@/lib/local-music";
import { recommendExperience, type Mood, type AudioPreference } from "@/lib/recommendations";
import { CURATED_TRACKS } from "@/lib/music-library";
import { makeFeedbackLink } from "@/lib/feedback-share";
import { SoundWaveform } from "@/components/studio/sound-waveform";
import "./studio.css";

type Tab = "design" | "words" | "details" | "events" | "photos" | "appearance" | "music" | "extras";
type RawEvent = { id: string; title: string; starts_on: string | null; starts_at_local: string | null; venue: string; city: string; visibility: "invited" | "everyone" };
const tabs: { id: Tab; label: string; icon: typeof Palette }[] = [
  { id: "design", label: "Design", icon: Sparkles },
  { id: "words", label: "Wording", icon: Type },
  { id: "details", label: "Details", icon: CalendarDays },
  { id: "events", label: "Events", icon: CalendarRange },
  { id: "photos", label: "Photos", icon: ImageIcon },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "music", label: "Music", icon: Music2 },
  { id: "extras", label: "Extras", icon: SlidersHorizontal },
];
type Workspace = "compose" | "style" | "sound" | "finish";
const workspaces: { id: Workspace; label: string; icon: typeof Palette; description: string; tasks: Tab[] }[] = [
  { id: "compose", label: "Content", icon: LayoutTemplate, description: "The words and practical details", tasks: ["words", "details", "events"] },
  { id: "style", label: "Design", icon: Palette, description: "The invitation's visual world", tasks: ["design", "appearance", "photos"] },
  { id: "sound", label: "Sound", icon: Music2, description: "Set the atmosphere", tasks: ["music"] },
  { id: "finish", label: "Finishing", icon: Settings2, description: "Extra touches and sharing", tasks: ["extras"] },
];
const workspaceFor = (task: Tab): Workspace => workspaces.find((area) => area.tasks.includes(task))?.id ?? "compose";
const stepText: Record<Tab, { title: string; summary: string }> = {
  design: { title: "Choose your invitation", summary: "Start with an art-directed design. Every choice updates the real guest experience." },
  words: { title: "Make it yours", summary: "Names, occasion and the words your guests will remember." },
  details: { title: "The essentials", summary: "Make the date, venue and practical details effortless to find." },
  events: { title: "Your celebrations", summary: "Nikah, Walima, ceremony, reception, or just one beautiful event." },
  photos: { title: "Your photographs", summary: "Add a favourite photo and position it exactly where it belongs." },
  appearance: { title: "Shape the look", summary: "Refine the palette, lettering and opening experience." },
  music: { title: "Set the atmosphere", summary: "Explore recordings, listen, select a moment and set how it begins." },
  extras: { title: "Little personal touches", summary: "Countdown, languages and optional finishing details." },
};
const occasions = ["Wedding", "Nikah", "Walima", "Mehndi", "Reception", "Civil ceremony"];
const tones = [
  { label: "Warm", text: "We’re so happy to share this day with the people we love most. Please join us." },
  { label: "Short", text: "Come celebrate with us." },
  { label: "Playful", text: "A little love, a lot of joy, and a dance floor with your name on it." },
];

export function Studio() {
  const { draft, patch, undo, redo, canUndo, canRedo, state, ready, account, reload } = useStudioDraft();
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>("words");
  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState(true);
  const [workspace, setWorkspace] = useState<Workspace>("compose");
  const [mobilePreview, setMobilePreview] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [rawEvents, setRawEvents] = useState<RawEvent[]>([]);
  const [shareStatus, setShareStatus] = useState("");
  const loadEvents = useCallback(async () => {
    if (!account) {
      try {
        const pending = JSON.parse(localStorage.getItem(PENDING_EVENTS_KEY) || "[]") as { id?: string; title: string; startsOn?: string | null; startsAt?: string | null; venue?: string; city?: string; visibility?: "invited" | "everyone" }[];
        setRawEvents(pending.map((e, i) => ({ id: e.id ?? `local-${i}`, title: e.title, starts_on: e.startsOn ?? null, starts_at_local: e.startsAt ?? null, venue: e.venue ?? "", city: e.city ?? "", visibility: e.visibility ?? "invited" })));
      } catch { setRawEvents([]); }
      return;
    }
    try { setRawEvents((await call("GET", "/api/wedding/events")).events); } catch { /* keep what we have */ }
  }, [account]);
  useEffect(() => { loadEvents(); }, [loadEvents]);
  const events: InviteEvent[] = rawEvents.map((e) => ({ id: e.id, title: e.title, startsOn: e.starts_on, startsAt: e.starts_at_local, venue: e.venue, city: e.city }));
  const shareFeedback = async () => {
    try {
      const url = makeFeedbackLink(draft, events);
      await navigator.clipboard.writeText(url);
      setShareStatus(draft.photo ? "Link copied. Uploaded photos aren't included in feedback links yet." : "Feedback link copied. Send it to anyone!");
    } catch { setShareStatus("Couldn’t copy the link. Try again in a secure browser."); }
  };

  useEffect(() => {
    const d = params.get("design");
    if (ready && d && designs.some((x) => x.id === d)) patch({ design: d as DesignId, accent: "" });
  }, [ready, params, patch]);

  const go = (t: Tab) => {
    setTab(t);
    setWorkspace(workspaceFor(t));
    setSheet(true);
    setMobilePreview(false);
    if (t === "details" || t === "events" || t === "words" || t === "extras") setOpen(true);
    if (t === "design" || t === "appearance" || t === "photos") setOpen(false);
  };
  const selectWorkspace = (id: Workspace) => {
    setWorkspace(id);
    go(workspaces.find((area) => area.id === id)!.tasks[0]);
  };
  const area = workspaces.find((item) => item.id === workspace)!;
  const activeTask = tabs.find((item) => item.id === tab)!;
  const previewTargets: { id: Tab; label: string; icon: typeof Palette; position: "cover" | "inside" | "both" }[] = [
    { id: "words", label: "Names & message", icon: Type, position: "both" },
    { id: "appearance", label: "Opening & colours", icon: Palette, position: "cover" },
    { id: "details", label: "Date & venue", icon: MapPin, position: "inside" },
    { id: "music", label: "Soundtrack", icon: Music2, position: "both" },
  ];

  return (
    <div className="st st-workspace" data-sheet={sheet} data-preview={mobilePreview} data-focus={focusMode}>
      <header className="st-top">
        <Link href="/" className="st-logo">wedsent <span className="st-studio-word">/ studio</span></Link>
        <div className="st-seg" role="group" aria-label="Preview">
          <button type="button" aria-pressed={!open} onClick={() => setOpen(false)}>Opening</button>
          <button type="button" aria-pressed={open} onClick={() => setOpen(true)}>Inside</button>
        </div>
        <div className="st-right">
          <div className="st-history" role="group" aria-label="Edit history"><button type="button" aria-label="Undo change" title="Undo change" onClick={undo} disabled={!canUndo}><RotateCcw size={16}/></button><button type="button" aria-label="Redo change" title="Redo change" onClick={redo} disabled={!canRedo}><RotateCw size={16}/></button></div>
          <SaveBadge state={state} account={!!account} reload={reload} />
          {account
            ? <Link href="/dashboard" className="btn btn-dark st-guest"><span>Guests &amp; publish</span></Link>
            : null}
          <Link href="/invite" target="_blank" className="btn btn-light st-guest" aria-label="Open the guest invitation in a new tab"><span>Guest view</span> <ArrowUpRight size={16} /></Link>
          <button type="button" className="btn btn-dark st-guest" onClick={() => void shareFeedback()} aria-label="Copy a shareable invitation link for feedback"><span>Share preview</span><Share2 size={16} /></button>
        </div>
      </header>
      {shareStatus && <div className="st-share-toast" role="status">{shareStatus}</div>}

      <nav className="st-rail" aria-label="Invitation sections">
        <div className="st-rail-heading">YOUR INVITATION <span>SECTIONS</span></div>
        {workspaces.map((item) => <div className="st-rail-group" key={item.id}>
          <button type="button" className="st-rail-button" aria-expanded={workspace === item.id} aria-current={workspace === item.id ? "page" : undefined} onClick={() => selectWorkspace(item.id)} title={item.description}>
            <item.icon size={19} strokeWidth={1.8} /><span>{item.label}</span><ChevronRight className="st-rail-chevron" size={15}/>
          </button>
          <div className="st-rail-children" aria-label={`${item.label} sections`}>
            {item.tasks.map((task) => { const entry = tabs.find((t) => t.id === task)!; return <button type="button" key={task} onClick={() => go(task)} aria-current={tab === task ? "page" : undefined} className="st-rail-child"><entry.icon size={15}/><span>{entry.label}</span>{tab === task && <span className="st-selected-dot"/>}</button>; })}
          </div>
        </div>)}
        <div className="st-rail-bottom"><button type="button" onClick={() => setFocusMode((value) => !value)} title={focusMode ? "Show editor" : "Focus on the preview"} aria-pressed={focusMode}>{focusMode ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}<span>{focusMode ? "Show editor" : "Focus"}</span></button></div>
      </nav>

      <main className="st-canvas">
        <div className="st-phone" style={{ ["--bgtone" as string]: specById(draft.design).site.bg }}>
          <div className="st-preview-label"><span className="st-live-dot" /> Live guest preview <span>·</span> {open ? "Inside" : "Opening"}</div>
          <Phone label="Live invitation preview">
            <Invitation data={draft} open={open} onOpenChange={setOpen} events={events} />
          </Phone>
          <div className="st-preview-actions"><button type="button" className="st-replay" onClick={() => setOpen(false)} disabled={!open}><RotateCcw size={14} /> Replay opening</button>
          <button type="button" className="st-replay" onClick={() => go(open ? "details" : "design")}><Pencil size={14} /> Edit {open ? "details" : "cover"}</button></div>
        </div>
        <div className="st-preview-shortcuts" aria-label="Edit what you see">
          <span>QUICK EDIT</span>
          {previewTargets.filter((target) => target.position === "both" || target.position === (open ? "inside" : "cover")).map((target) => <button type="button" key={target.id} onClick={() => go(target.id)}><target.icon size={15} />{target.label}<ChevronRight size={14} /></button>)}
          <button type="button" onClick={() => setOpen((value) => !value)}><Eye size={15} />View {open ? "opening" : "inside"}<ChevronRight size={14} /></button>
        </div>
      </main>

      <aside className="st-panel" aria-label="Edit invitation">
        <button type="button" className="st-grab" onClick={() => setSheet((s) => !s)} aria-expanded={sheet} aria-label="Toggle editor">
          <ChevronUp size={20} />
        </button>
        <div className="st-panel-navigation">
          <div className="st-panel-area"><span>{area.label}</span><small>{area.description}</small></div>
          <div className="st-tabs" role="tablist" aria-label={`${area.label} editing tools`}>
            {area.tasks.map((id) => { const item = tabs.find((candidate) => candidate.id === id)!; return <button key={id} type="button" role="tab" id={`studio-tab-${id}`} aria-controls="studio-editor-content" aria-selected={tab === id} tabIndex={tab === id ? 0 : -1} className="st-tab" onClick={() => go(id)} onKeyDown={(event) => {
              const at = area.tasks.indexOf(id);
              const next = event.key === "ArrowRight" ? (at + 1) % area.tasks.length : event.key === "ArrowLeft" ? (at + area.tasks.length - 1) % area.tasks.length : event.key === "Home" ? 0 : event.key === "End" ? area.tasks.length - 1 : -1;
              if (next === -1) return;
              event.preventDefault(); go(area.tasks[next]);
              document.getElementById(`studio-tab-${area.tasks[next]}`)?.focus();
            }}><item.icon size={16} /><span>{item.label}</span></button>; })}
          </div>
        </div>
        <div className="st-body" id="studio-editor-content" role="tabpanel" aria-labelledby={`studio-tab-${tab}`}>
          <header className="st-task-header">
            <span className="st-task-counter">EDITING <span>{activeTask.label.toUpperCase()}</span></span>
            <h1>{stepText[tab].title}</h1><p>{stepText[tab].summary}</p>
          </header>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              {tab === "design" && <DesignTab draft={draft} patch={patch} />}
              {tab === "words" && <WordsTab draft={draft} patch={patch} />}
              {tab === "details" && <DetailsTab draft={draft} patch={patch} />}
              {tab === "events" && <EventsTab account={!!account} events={rawEvents} reload={loadEvents} />}
              {(tab === "photos" || tab === "appearance" || tab === "music" || tab === "extras") && <StyleTab draft={draft} patch={patch} account={!!account} mode={tab} />}
            </motion.div>
          </AnimatePresence>
          <div className="st-task-next"><button type="button" onClick={() => { setMobilePreview(true); setSheet(false); }}><Eye size={16} /> Preview changes</button><button type="button" className="st-task-primary" onClick={() => void shareFeedback()}><Send size={15} /> Share preview</button></div>
        </div>
        <p className="st-note">{account ? "Edits save to your account. Publish from Guests & publish when you’re ready." : "Build mode: your draft saves on this device. Share for feedback creates a working invitation preview link, not a published RSVP invitation."}</p>
      </aside>
      <div className="st-mobile-switch" role="group" aria-label="Mobile Studio mode"><button type="button" aria-pressed={!mobilePreview} onClick={() => { setMobilePreview(false); setSheet(true); }}><Pencil size={15} /> Edit</button><button type="button" aria-pressed={mobilePreview} onClick={() => { setMobilePreview(true); setSheet(false); }}><Eye size={15} /> Preview</button></div>
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
  const [mood, setMood] = useState<Mood>("romantic");
  const [audio, setAudio] = useState<AudioPreference>("undecided");
  const suggestion = recommendExperience(draft.occasion, mood, audio);
  return (
    <div className="st-stack">
      <div className="st-panel-intro"><span>01 / LOOKS</span><p>Pick a visual world. Your names, events and answers stay exactly as they are.</p></div>
      <h2 className="st-h">Invitation collection</h2>
      <p className="st-help st-help--flat">Choose the artwork first. Your content and guest replies are preserved when you change the design.</p>
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
      <details className="st-guided-choice"><summary><Sparkles size={17} /> Help me choose <ChevronRight size={16} /></summary>
        <section className="st-recommend" aria-label="Personalised starting point">
        <p className="st-help st-help--flat">Tell us the feeling you want. Suggestions never lock your choices or change anything until you apply them.</p>
        <label className="st-field"><span>What feels like you?</span><select value={mood} onChange={(e) => setMood(e.target.value as Mood)}>
          <option value="minimal">Minimal and modern</option><option value="romantic">Soft and romantic</option><option value="grand">Grand and glamorous</option><option value="heritage">Heritage and detail</option><option value="celebration">Colourful celebration</option>
        </select></label>
        <label className="st-field"><span>Soundtrack preference</span><select value={audio} onChange={(e) => setAudio(e.target.value as AudioPreference)}>
          <option value="undecided">Show me options</option><option value="vocal">Vocals-only nasheed</option><option value="duff">Nasheed with duff</option><option value="instrumental">Instrumental music</option><option value="ambient">Ambient sound</option><option value="silent">No music</option>
        </select></label>
        <div className="st-recommend-result"><strong>{suggestion.title}</strong><p>{suggestion.reason}</p><small>{suggestion.audioHint}</small></div>
        <button type="button" className="btn btn-dark" onClick={() => patch({ design: suggestion.design, opening: suggestion.opening, accent: "", ...(audio === "silent" ? { music: null } : {}) })}>Use this design and opening</button>
        </section>
      </details>
    </div>
  );
}

function WordsTab({ draft, patch }: TabProps) {
  const custom = !occasions.includes(draft.occasion);
  return (
    <div className="st-stack">
      <div className="st-panel-intro"><span>02 / WORDS</span><p>Make the invitation sound like you. All copy updates live.</p></div>
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
      <h2 className="st-h">Message presentation</h2>
      <p className="st-help">Style this section independently of the cover. The rest of the invitation stays as you designed it.</p>
      <div className="st-chips" role="group" aria-label="Message layout">
        {([{ id: "plain", label: "Minimal" }, { id: "framed", label: "Fine border" }, { id: "editorial", label: "Editorial quote" }] as const).map((style) => (
          <button type="button" className="st-chip" key={style.id} aria-pressed={(draft.messageStyle || "plain") === style.id} onClick={() => patch({ messageStyle: style.id })}>{style.label}</button>
        ))}
      </div>
    </div>
  );
}

function DetailsTab({ draft, patch }: TabProps) {
  const left = daysUntil(draft.date);
  return (
    <div className="st-stack">
      <div className="st-panel-intro"><span>04 / DETAILS</span><p>The practical things guests need to know, kept clear and easy to find.</p></div>
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

function StyleTab({ draft, patch, account, mode }: TabProps & { account: boolean; mode: "photos" | "appearance" | "music" | "extras" }) {
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [musicBusy, setMusicBusy] = useState(false);
  const [musicError, setMusicError] = useState<string | null>(null);
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [audioPreview, setAudioPreview] = useState("");
  const [audioPreviewError, setAudioPreviewError] = useState("");
  const [musicMood, setMusicMood] = useState("nasheed");
  const [musicRevision, setMusicRevision] = useState(0);
  useEffect(() => {
    let active = true;
    let objectUrl = "";
    setAudioPreview(""); setAudioPreviewError("");
    const selected = draft.music;
    if (!selected) return;
    if (selected.src !== "local-music") { setAudioPreview(selected.src); return; }
    readLocalMusic().then((blob) => {
      if (!active) return;
      if (!blob) { setAudioPreviewError("This browser no longer has the track. Please upload it again."); return; }
      objectUrl = URL.createObjectURL(blob);
      setAudioPreview(objectUrl);
    }).catch(() => { if (active) setAudioPreviewError("Couldn't load the local track. Please upload again."); });
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [draft.music?.src, musicRevision]);
  const uploadMusic = async (file?: File) => {
    if (!file) return;
    if (file.size > 8_000_000 || !/\.mp3$/i.test(file.name) || !rightsConfirmed) {
      setMusicError("Choose an MP3 below 8 MB and confirm your permission to use the recording."); return;
    }
    setMusicBusy(true); setMusicError(null);
    try {
      let src = "local-music";
      if (account) {
        const res = await fetch("/api/music", { method: "POST", body: file, credentials: "same-origin", headers: { "x-music-rights": "confirmed" } });
        const result = await res.json();
        if (!res.ok) throw new Error(result?.error?.message || "Couldn’t upload this MP3.");
        src = result.src;
      } else await saveLocalMusic(file);
      patch({ music: { src, title: file.name.replace(/\.mp3$/i, "").slice(0, 80) } });
      setMusicRevision((revision) => revision + 1);
    } catch (e) { setMusicError(e instanceof Error ? e.message : "Couldn’t add music."); }
    finally { setMusicBusy(false); }
  };
  const upload = async (file?: File) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 15_000_000) {
      setPhotoError("Choose a JPEG, PNG or WebP photo smaller than 15 MB."); return;
    }
    setPhotoBusy(true); setPhotoError(null);
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("This browser cannot process the photograph.");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => b ? resolve(b) : reject(new Error("Couldn’t process this image.")), "image/jpeg", 0.8));
      if (blob.size > 2_500_000) throw new Error("Please choose a smaller photograph.");
      let src: string;
      if (account) {
        const res = await fetch("/api/media", { method: "POST", body: blob, credentials: "same-origin" });
        const result = await res.json();
        if (!res.ok) throw new Error(result?.error?.message || "Couldn’t upload your photograph.");
        src = result.src;
      } else {
        src = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("Couldn’t read this photograph.")); reader.readAsDataURL(blob);
        });
      }
      patch({ photo: { src, fx: 50, fy: 50 } });
    } catch (e) { setPhotoError(e instanceof Error ? e.message : "Couldn’t add that image."); }
    finally { setPhotoBusy(false); }
  };
  const spec = specById(draft.design);
  const pal = paletteOf(spec, draft.palette);
  const stationery = spec.layout === "stationery";
  const custom = draft.accent || pal.accent;
  return (
    <div className="st-stack">
      {mode === "photos" && <>
      <h2 className="st-h st-section-anchor" id="studio-media">Your photograph</h2>
      <p className="st-help">Choose a sharp portrait or landscape photo. We optimise it for the invitation and let you position the focal point. Gallery and Arch use photos most prominently.</p>
      <label className="st-field">
        <span>{photoBusy ? "Processing photograph…" : draft.photo ? "Replace photograph" : "Upload photograph"}</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" disabled={photoBusy} onChange={(e) => { void upload(e.target.files?.[0]); e.target.value = ""; }} />
      </label>
      {draft.photo && <>
        <div className="st-photo-crop">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={draft.photo.src} alt="Your uploaded photograph, showing the current crop" style={{ objectPosition: `${draft.photo.fx}% ${draft.photo.fy}%` }} />
        </div>
        <label className="st-field"><span>Move photo left or right</span><input type="range" min="0" max="100" value={draft.photo.fx} onChange={(e) => patch({ photo: { ...draft.photo!, fx: Number(e.target.value) } })} /></label>
        <label className="st-field"><span>Move photo up or down</span><input type="range" min="0" max="100" value={draft.photo.fy} onChange={(e) => patch({ photo: { ...draft.photo!, fy: Number(e.target.value) } })} /></label>
        <button type="button" className="st-chip" onClick={() => patch({ photo: null })}>Remove photograph</button>
      </>}
      {photoError && <small className="st-err" role="alert">{photoError}</small>}
      {!account && <p className="st-help">Build mode: the photo stays in this browser. Signed-in uploads use private owner-scoped storage.</p>}
      </>}
      {mode === "appearance" && <>
      <h2 className="st-h st-section-anchor" id="studio-colours">Colours</h2>
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
      <h2 className="st-h st-section-anchor" id="studio-motion">Opening motion</h2>
      <p className="st-help">Choose how your invitation opens. Replay it on the phone to feel the difference.</p>
      <div className="st-chips" role="group" aria-label="Opening animation">
        <button type="button" className="st-chip" aria-pressed={!draft.opening} onClick={() => patch({ opening: "" })}>Designer’s choice</button>
        {(Object.keys(OPENINGS) as OpeningKind[]).map((kind) => (
          <button key={kind} type="button" className="st-chip" aria-pressed={draft.opening === kind} title={OPENINGS[kind].hint} onClick={() => patch({ opening: kind })}>
            {{ lift: "Lift", bloom: "Bloom", veil: "Veil", focus: "Focus", doors: "Doors", curtain: "Curtain" }[kind]}
          </button>
        ))}
      </div>
      </>}
      {mode === "extras" && <>
      <h2 className="st-h st-section-anchor" id="studio-extras">Little extras</h2>
      <label className="st-widget-toggle">
        <span><strong>Wedding countdown</strong><small>A sweet live countdown on the invitation</small></span>
        <input type="checkbox" checked={draft.countdown?.enabled ?? false} onChange={(e) => patch({ countdown: { ...(draft.countdown ?? { style: "type", accent: "", label: "" }), enabled: e.target.checked } })} />
      </label>
      {draft.countdown?.enabled && <>
        <div className="st-chips" role="group" aria-label="Countdown appearance">
          {([{ id: "type", label: "Editorial" }, { id: "tiles", label: "Soft tiles" }, { id: "dial", label: "Circles" }] as const).map((o) => (
            <button className="st-chip" key={o.id} type="button" aria-pressed={draft.countdown.style === o.id} onClick={() => patch({ countdown: { ...draft.countdown, style: o.id } })}>{o.label}</button>
          ))}
        </div>
        <label className="st-field"><span>Countdown heading <i>optional</i></span><input maxLength={48} value={draft.countdown.label} placeholder="Until our day" onChange={(e) => patch({ countdown: { ...draft.countdown, label: e.target.value } })} /></label>
        <label className="st-widget-colour"><span>Countdown colour</span><input type="color" aria-label="Countdown accent colour" value={draft.countdown.accent || pal.accent} onChange={(e) => patch({ countdown: { ...draft.countdown, accent: e.target.value } })} /><button type="button" onClick={() => patch({ countdown: { ...draft.countdown, accent: "" } })}>Use theme colour</button></label>
      </>}
      <h2 className="st-h st-section-anchor" id="studio-language">Languages by section</h2>
      <p className="st-help">Choose the language for labels in each section. Your own names, messages and event descriptions stay exactly as you wrote them.</p>
      {([{ id: "details", label: "Details and directions" }, { id: "countdown", label: "Countdown" }, { id: "reply", label: "Reply button" }] as const).map((section) => (
        <label className="st-field" key={section.id}><span>{section.label}</span><select value={draft.languages?.[section.id] ?? "en"} onChange={(e) => patch({ languages: { ...(draft.languages ?? { details: "en", countdown: "en", reply: "en" }), [section.id]: e.target.value as "en" | "fr" | "ar" | "so" } })}>
          <option value="en">English</option><option value="fr">Français</option><option value="ar">العربية</option><option value="so">Soomaali</option>
        </select></label>
      ))}
      </>}
      {mode === "appearance" && stationery && (
        <>
          <h2 className="st-h st-section-anchor" id="studio-lettering">Lettering</h2>
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
      {mode === "music" && <>
      <div className="st-sound-current">
        <span>YOUR INVITATION SOUNDTRACK</span>
        <strong>{draft.music?.title || "The quiet option"}</strong>
        <p>{draft.music ? "Selected and saved to your invitation. You can fine-tune its entrance and excerpt below." : "No music yet. Silence is a perfectly good choice, or choose a recording from the collection."}</p>
        {draft.music && <button type="button" onClick={() => patch({ music: null })}>Remove soundtrack</button>}
      </div>
      <h2 className="st-h st-section-anchor" id="studio-music">Explore the collection</h2>
      <p className="st-help st-help--flat">Listen first, then choose. Uploaded recordings and saved selections are preserved when you change designs.</p>
      <div className="st-chips" role="group" aria-label="Filter soundtrack mood">
        {([{ id: "nasheed", label: "Vocals-only nasheed" }, { id: "duff", label: "Duff" }, { id: "instrumental", label: "Instrumental" }] as const).map((mood) => (
          <button type="button" key={mood.id} className="st-chip" aria-pressed={musicMood === mood.id} onClick={() => setMusicMood(mood.id)}>{mood.label}</button>
        ))}
      </div>
      <div className={`st-album-header st-album-header--${musicMood}`}>
        <small>WEDSENT SOUND COLLECTION / {musicMood === "nasheed" ? "01" : musicMood === "instrumental" ? "02" : "03"}</small>
        <strong>{musicMood === "nasheed" ? "Quiet devotion" : musicMood === "instrumental" ? "Ceremony & stillness" : "Voice & rhythm"}</strong>
        <p>{musicMood === "nasheed" ? "Gentle vocal selections for a meaningful opening." : musicMood === "instrumental" ? "Considered piano and traditional ceremony pieces for the atmosphere you want." : "Duff-led options will appear here once the recordings are individually cleared."}</p>
      </div>
      <div className="st-library" aria-label="Soundtrack library">
        {CURATED_TRACKS.filter((track) => track.category === musicMood).map((track) => (
          <div key={track.id} className="st-library-track">
            <div><strong>{track.title}</strong><small>{track.mood} · {track.artist}</small><small><a href={track.source} target="_blank" rel="noopener noreferrer">Source</a> · <a href={track.licenseUrl} target="_blank" rel="noopener noreferrer">{track.license}</a></small></div>
            <button type="button" className="st-chip" aria-pressed={draft.music?.src === track.src} onClick={() => patch({ music: { src: track.src, title: track.title, startAt: 0, endAt: 15, trigger: "open", volume: .45 } })}>{draft.music?.src === track.src ? "Selected" : "Choose recording"}</button>
            <audio controls preload="none" src={track.src} aria-label={`Audition ${track.title}`} />
          </div>
        ))}
        {!CURATED_TRACKS.some((track) => track.category === musicMood) && <p className="st-help">No approved recordings in this category yet. You can upload a recording you have permission to use below; we won't fill this section with unrelated beats.</p>}
      </div>
      <p className="st-help st-help--flat">The vocals-only source above is hosted by Wikimedia Commons under the licence shown. Its original large FLAC file may not play on every mobile device; a verified optimised MP3 is still needed. We have not independently auditioned its lyrics or certified religious suitability.</p>
      <h2 className="st-h">Your own recording</h2>
      <p className="st-help">Add an MP3 that you have permission to use. For build-mode local uploads, only this browser holds the recording.</p>
      <label className="st-widget-toggle"><span><strong>I have permission to use this recording</strong><small>Only upload music you own or have rights to share with guests.</small></span><input type="checkbox" checked={rightsConfirmed} onChange={(e) => setRightsConfirmed(e.target.checked)} /></label>
      <label className="st-field"><span>{musicBusy ? "Uploading music…" : "Choose MP3 (up to 8 MB)"}</span><input type="file" accept="audio/mpeg,.mp3" disabled={!rightsConfirmed || musicBusy} onChange={(e) => { void uploadMusic(e.target.files?.[0]); e.target.value = ""; }} /></label>
      {draft.music && audioPreview && <SoundWaveform key={audioPreview} src={audioPreview} title={draft.music.title} start={draft.music.startAt ?? 0} end={draft.music.endAt} onTrim={(startAt, endAt) => patch({ music: { ...draft.music!, startAt, endAt } })} />}
      {draft.music && <fieldset className="st-audio-trim"><legend>Playback on the invitation</legend><p>Make your favourite moment loop softly. Choose how it plays for guests.</p>
        <div className="st-audio-trim-fields">
          <label>Start (seconds)<input type="number" min="0" max="1799" step="1" value={draft.music.startAt ?? 0} onChange={(e) => {
            const startAt = Math.max(0, Math.min(1799, Number(e.target.value) || 0));
            patch({ music: { ...draft.music!, startAt, endAt: draft.music!.endAt && draft.music!.endAt <= startAt ? undefined : draft.music!.endAt } });
          }} /></label>
          <label>End (seconds)<input type="number" min="1" max="1800" step="1" placeholder="Full track" value={draft.music.endAt ?? ""} onChange={(e) => patch({ music: { ...draft.music!, endAt: e.target.value ? Math.max((draft.music!.startAt ?? 0) + 1, Math.min(1800, Number(e.target.value))) : undefined } })} /></label>
        </div>
        <div className="st-audio-trim-fields">
          <label>When music begins
            <select className="st-select" value={draft.music.trigger ?? "open"} onChange={(e) => patch({ music: { ...draft.music!, trigger: e.target.value as "load" | "open" | "manual" } })}>
              <option value="load">When the link loads (browser permitting)</option>
              <option value="open">After the invitation opens</option>
              <option value="manual">Only when the guest taps play</option>
            </select>
          </label>
          <label>Background volume ({Math.round((draft.music.volume ?? 0.45) * 100)}%)
            <input type="range" min="0.05" max="1" step="0.05" value={draft.music.volume ?? 0.45}
              onChange={(e) => patch({ music: { ...draft.music!, volume: Number(e.target.value) } })} />
          </label>
        </div>
        <p>Audition from your chosen start point in the player above. For a complete track, leave the end time blank. Browser autoplay restrictions apply to every mode.</p>
      </fieldset>}
      {draft.music && audioPreviewError && <small className="st-err" role="alert">{audioPreviewError}</small>}
      <p className="st-help st-help--flat">If a remote recording won't load, check its source or upload an MP3 you can legally use. We are continuing the duff and wedding instrumental selection.</p>
      {!account && <p className="st-help">Build mode music stays in this browser only. Re-upload once account publishing is enabled.</p>}
      {musicError && <small className="st-err" role="alert">{musicError}</small>}
      </>}
      {mode === "extras" &&
      <Link href="/invite/print" target="_blank" className="st-link"><Printer size={16} /> A5 print layout <ArrowUpRight size={14} /></Link>
      }
    </div>
  );
}

const blank = { title: "", startsOn: "", startsAt: "", venue: "", city: "", visibility: "invited" as "invited" | "everyone" };
function EventsTab({ account, events, reload }: { account: boolean; events: RawEvent[]; reload: () => Promise<void> }) {
  const [f, setF] = useState(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr(null);
    const body = { ...f, startsOn: f.startsOn || null, startsAt: f.startsAt || null };
    try {
      if (!account) {
        const next = editing
          ? events.map((event) => event.id === editing ? { ...event, title: body.title, starts_on: body.startsOn, starts_at_local: body.startsAt, venue: body.venue, city: body.city, visibility: body.visibility } : event)
          : [...events, { id: crypto.randomUUID(), title: body.title, starts_on: body.startsOn, starts_at_local: body.startsAt, venue: body.venue, city: body.city, visibility: body.visibility }];
        localStorage.setItem(PENDING_EVENTS_KEY, JSON.stringify(next.map((event) => ({ id: event.id, title: event.title, startsOn: event.starts_on, startsAt: event.starts_at_local, venue: event.venue, city: event.city, visibility: event.visibility }))));
      } else if (editing) await call("PUT", `/api/wedding/events/${editing}`, body); else await call("POST", "/api/wedding/events", body);
      setF(blank); setEditing(null); await reload();
    } catch (x) { setErr(x instanceof ApiError ? x.message : "Couldn’t save the event."); }
    setBusy(false);
  };
  const del = async (id: string, title: string) => {
    if (!confirm(`Delete “${title}”? Replies to it will be removed.`)) return;
    try {
      if (!account) {
        localStorage.setItem(PENDING_EVENTS_KEY, JSON.stringify(events.filter((event) => event.id !== id).map((event) => ({ id: event.id, title: event.title, startsOn: event.starts_on, startsAt: event.starts_at_local, venue: event.venue, city: event.city, visibility: event.visibility }))));
      } else await call("DELETE", `/api/wedding/events/${id}`);
      if (editing === id) { setEditing(null); setF(blank); }
      await reload();
    } catch (x) { setErr(x instanceof ApiError ? x.message : "Couldn’t delete."); }
  };
  return (
    <div className="st-stack">
      <h2 className="st-h">Events</h2>
      {events.length === 0 && <p className="st-help st-help--flat">No events yet. Add the first below and it appears in the preview.</p>}
      <ul className="st-events">
        {events.map((e) => (
          <li key={e.id} data-editing={editing === e.id}>
            <div><strong>{e.title}</strong><span>{[e.starts_on, e.starts_at_local, e.venue].filter(Boolean).join(" · ") || "No details yet"}</span></div>
            <button type="button" className="st-ico" aria-label={`Edit ${e.title}`} onClick={() => { setEditing(e.id); setF({ title: e.title, startsOn: e.starts_on ?? "", startsAt: e.starts_at_local ?? "", venue: e.venue, city: e.city, visibility: e.visibility }); }}><Pencil size={15} /></button>
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
        <p className="st-help st-help--flat">{account ? <>Choose who’s invited to each event in <Link href="/dashboard" className="st-inl">Guests</Link>.</> : "These are local build-mode events. Private guest permissions and publishing will be available when account access is enabled."}</p>
      </form>
    </div>
  );
}
