"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Plus, X } from "lucide-react";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { Wordmark } from "@/components/site/nav";
import { call } from "@/lib/api-client";
import { DRAFT_KEY, defaults, friendlyDate, loadDraft, saveDraft, PENDING_EVENTS_KEY, type InviteData, type InviteEvent } from "@/lib/designs";
import { START_PROGRESS_KEY, parseStartProgress } from "@/lib/start-progress";
import { DESIGN_IDS, FEATURED_DESIGNS, paletteOf, specById, type DesignId } from "@/engine/registry";
import "./start.css";

const steps = ["Details", "Design", "Review"];
const stepKeys = ["names", "design", "preview"] as const;
const emptyDraft: InviteData = { ...defaults, names: "", date: "", time: "", venue: "", city: "", message: "" };
type AccountDraft = { content: InviteData; rev: number };
type AccountEvent = { title: string; starts_on: string | null; starts_at_local: string | null; venue: string; city: string; id: string };

export function Start() {
  const router = useRouter();
  const query = useSearchParams();
  const source = query.toString();
  const [draft, setDraft] = useState<InviteData>(emptyDraft);
  const [titles, setTitles] = useState<string[]>([]);
  const [accountDraft, setAccountDraft] = useState<AccountDraft | null>(null);
  const [accountEvents, setAccountEvents] = useState<InviteEvent[]>([]);
  const [step, setStep] = useState(0);
  const [view, setView] = useState<"cover" | "inside">("cover");
  const [mobilePreview, setMobilePreview] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    async function hydrate() {
      let base = emptyDraft;
      let pending: string[] = [];
      let progress: ReturnType<typeof parseStartProgress> = null;
      try {
        if (localStorage.getItem(DRAFT_KEY)) base = loadDraft();
        const existing = JSON.parse(localStorage.getItem(PENDING_EVENTS_KEY) ?? "[]") as { title?: string }[];
        pending = existing.flatMap(({ title }) => typeof title === "string" ? [title] : []);
        progress = parseStartProgress(sessionStorage.getItem(START_PROGRESS_KEY));
      } catch { /* Continue without a browser draft. */ }

      let saved: AccountDraft | null = null;
      let savedEvents: InviteEvent[] = [];
      let sessionError = "";
      try {
        const { user } = await call<{ user: { id: string } | null }>("GET", "/api/me");
        if (user) {
          const [wedding, { events }] = await Promise.all([
            call<AccountDraft>("GET", "/api/wedding"),
            call<{ events: AccountEvent[] }>("GET", "/api/wedding/events"),
          ]);
          saved = wedding;
          if (wedding.rev > 1) base = { ...emptyDraft, ...wedding.content };
          savedEvents = events.map((event) => ({ id: event.id, title: event.title, startsOn: event.starts_on, startsAt: event.starts_at_local, venue: event.venue, city: event.city }));
        }
      } catch (failure) { sessionError = failure instanceof Error ? failure.message : "Couldn’t check your account."; }

      if (!active) return;
      if (progress) {
        base = { ...base, ...progress.draft, date: progress.undecided ? "" : progress.draft.date };
        pending = progress.events;
        setStep(progress.step === "preview" ? 2 : ["design", "style"].includes(progress.step) ? 1 : 0);
      }
      const design = query.get("design");
      if (design && progress?.source !== source && DESIGN_IDS.includes(design as DesignId)) {
        const spec = specById(design);
        base = { ...base, design: spec.id, palette: paletteOf(spec, query.get("palette") ?? undefined).id, type: query.get("type") ?? "", intro: query.get("intro") ?? "", opening: "", accent: "" };
      }
      setDraft(base);
      setTitles(pending.slice(0, 8));
      setAccountDraft(saved);
      setAccountEvents(savedEvents);
      setLoadError(sessionError);
      setReady(true);
    }
    void hydrate();
    return () => { active = false; };
  }, [query, source]);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(START_PROGRESS_KEY, JSON.stringify({ step: stepKeys[step], draft, events: titles, preset: "", undecided: !draft.date, source }));
    } catch { /* The open form can still be used. */ }
  }, [ready, draft, titles, step, source]);

  const spec = specById(draft.design);
  const update = (value: Partial<InviteData>) => setDraft((current) => ({ ...current, ...value }));
  const designs = FEATURED_DESIGNS.some((design) => design.id === spec.id) ? FEATURED_DESIGNS : [spec, ...FEATURED_DESIGNS];
  const eventNames = titles.map((title) => title.trim()).filter(Boolean);
  const previewEvents: InviteEvent[] = accountEvents.length ? accountEvents : eventNames.map((title, index) => ({
    id: `draft-${index}`, title, startsOn: index === 0 ? draft.date || null : null, startsAt: null, venue: draft.venue, city: draft.city,
  }));

  function navigate(next: number) {
    setError("");
    setStep(next);
    setView(next === 0 ? "inside" : "cover");
    setMobilePreview(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (step === 0 && !draft.names.trim()) { setError("Enter the names you want on the invitation."); return; }
    if (step < 2) { navigate(step + 1); return; }
    if (!draft.names.trim()) { navigate(0); setError("Enter the names you want on the invitation."); return; }
    setBusy(true);
    setError("");
    const content = { ...draft, names: draft.names.trim() };
    try {
      const { user } = await call<{ user: { id: string } | null }>("GET", "/api/me");
      if (user) {
        if (!accountDraft) throw new Error("Your sign-in changed. Refresh to load your wedding and try again.");
        const wedding = await call<{ rev: number }>("PUT", "/api/wedding", { content: { ...content, music: content.music?.src === "local-music" ? null : content.music }, rev: accountDraft.rev });
        setAccountDraft({ content, rev: wedding.rev });
        if (!accountEvents.length && previewEvents.length) {
          const { events } = await call<{ events: AccountEvent[] }>("GET", "/api/wedding/events");
          for (const item of previewEvents) {
            if (!events.some((saved) => saved.title === item.title && saved.starts_on === item.startsOn)) {
              await call("POST", "/api/wedding/events", { ...item, visibility: "invited" });
            }
          }
        }
      } else {
        if (accountDraft) throw new Error("Your session expired. Open sign-in in another tab, then try again.");
        if (!saveDraft(content)) throw new Error("Your browser couldn’t save this draft. Allow site storage and try again.");
        localStorage.setItem(PENDING_EVENTS_KEY, JSON.stringify(previewEvents));
      }
      try { sessionStorage.removeItem(START_PROGRESS_KEY); } catch { /* The draft has already been saved. */ }
      router.push(user ? "/studio" : "/signin?mode=up&next=%2Fstudio");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Couldn’t save your invitation. Try again.");
      setBusy(false);
    }
  }

  const shown = { ...draft, names: draft.names.trim() || "Your names" };
  return (
    <main className="ed-start">
      <header className="ed-start-header ed-width"><Wordmark /><Link className="ed-text-link" href="/designs">Browse designs</Link></header>
      <div className="ed-start-grid ed-width" data-preview={mobilePreview}>
        <section className="ed-start-editor">
          <ol className="ed-start-steps" aria-label="Invitation setup progress">
            {steps.map((name, index) => <li key={name} aria-current={step === index ? "step" : undefined}><span>{index < step ? <Check size={13} /> : index + 1}</span>{name}</li>)}
          </ol>
          {!ready ? <p className="ed-start-state" role="status">Loading your draft…</p> : (
            <form onSubmit={submit} key={step}>
              {step === 0 && <>
                <h1>Your wedding details</h1>
                <label className="ed-field">Names<input dir="auto" name="names" required value={draft.names} onChange={(event) => update({ names: event.target.value })} placeholder="Amina & Yusuf" maxLength={60} /></label>
                <div className="ed-field-pair">
                  <label className="ed-field">Wedding date <span>Optional</span><input type="date" value={draft.date} onChange={(event) => update({ date: event.target.value })} /></label>
                  <label className="ed-field">Venue <span>Optional</span><input dir="auto" value={draft.venue} onChange={(event) => update({ venue: event.target.value })} maxLength={80} /></label>
                </div>
                <fieldset className="ed-start-events"><legend>Events <span>Optional</span></legend>
                  {accountEvents.length > 0 ? <p>Edit your existing events in Studio.</p> : <>
                    {titles.map((title, index) => <div key={index}><input aria-label={`Event ${index + 1}`} dir="auto" value={title} placeholder={index === 0 ? "e.g. Ceremony or Nikah" : "e.g. Reception or Walima"} maxLength={80} onChange={(event) => setTitles(titles.map((value, position) => position === index ? event.target.value : value))} /><button type="button" aria-label={`Remove event ${index + 1}`} onClick={() => setTitles(titles.filter((_, position) => position !== index))}><X size={17} /></button></div>)}
                    {titles.length < 8 && <button className="ed-start-add" type="button" onClick={() => setTitles([...titles, ""])}><Plus size={16} /> Add an event</button>}
                  </>}
                </fieldset>
              </>}
              {step === 1 && <>
                <h1>Choose your design</h1>
                <fieldset className="ed-start-designs"><legend>Designs</legend>
                  {designs.map((design) => (
                    <label key={design.id}><input type="radio" name="design" checked={design.id === draft.design} onChange={() => { update({ design: design.id, palette: "", type: "", intro: "", opening: "", accent: "" }); setView("cover"); }} /><span>{design.name}</span></label>
                  ))}
                </fieldset>
                <fieldset className="ed-start-colours"><legend>Colours</legend>
                  {spec.palettes.map((colour) => <label key={colour.id}><input type="radio" name="palette" checked={paletteOf(spec, draft.palette).id === colour.id} onChange={() => update({ palette: colour.id, accent: "" })} /><span style={{ background: colour.bg ?? colour.accent, boxShadow: `inset 0 0 0 4px ${colour.accent}` }} />{colour.name}</label>)}
                </fieldset>
              </>}
              {step === 2 && <>
                <h1>Review your invitation</h1>
                <dl className="ed-start-summary">
                  <div><dt>Names</dt><dd dir="auto">{draft.names || "To add"}</dd></div>
                  <div><dt>Date</dt><dd>{draft.date ? friendlyDate(draft.date) : "To be confirmed"}</dd></div>
                  <div><dt>Design</dt><dd>{spec.name}</dd></div>
                  {previewEvents.length > 0 && <div><dt>Events</dt><dd>{previewEvents.map((item) => item.title).join(", ")}</dd></div>}
                </dl>
                <p>{accountDraft ? "Continue to Studio to add the finishing details." : "Create an account to save this draft and continue in Studio."}</p>
              </>}
              {(error || loadError) && <p className="ed-start-error" role="alert">{error || loadError}</p>}
              <div className="ed-start-actions">
                {step > 0 && <button type="button" className="ed-button ed-button--secondary" onClick={() => navigate(step - 1)} disabled={busy}><ArrowLeft size={16} /> Back</button>}
                <button className="ed-button ed-button--primary" type="submit" disabled={busy}>{busy ? "Saving…" : step === 2 ? accountDraft ? "Continue to Studio" : "Create an account" : step === 1 ? "Review invitation" : "Choose a design"} <ArrowRight size={17} /></button>
              </div>
            </form>
          )}
          <button className="ed-start-toggle ed-text-link" type="button" onClick={() => setMobilePreview(!mobilePreview)} aria-expanded={mobilePreview} aria-controls="start-preview">{mobilePreview ? "Back to setup" : "Show invitation preview"}</button>
        </section>
        <aside className="ed-start-stage" id="start-preview" aria-label="Live invitation preview">
          <div className="ed-start-stage-top"><strong>Live preview</strong><div role="group" aria-label="Preview view"><button type="button" aria-pressed={view === "cover"} onClick={() => setView("cover")}>Cover</button><button type="button" aria-pressed={view === "inside"} onClick={() => setView("inside")}>Inside</button></div></div>
          <Phone label="Your invitation"><Invitation key={draft.design} data={shown} events={previewEvents} open={view === "inside"} onOpenChange={(open) => setView(open ? "inside" : "cover")} /></Phone>
        </aside>
      </div>
    </main>
  );
}
