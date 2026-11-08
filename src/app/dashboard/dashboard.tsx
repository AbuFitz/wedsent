"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Download, ExternalLink, Link2, MessageCircle, Plus, RefreshCw, Trash2, Upload } from "lucide-react";
import { call, ApiError } from "@/lib/api-client";
import { friendlyDate } from "@/lib/designs";
import "./dashboard.css";

type Event = { id: string; title: string; starts_on: string | null; starts_at_local: string | null; venue: string; city: string; visibility: "invited" | "everyone" };
type Guest = { id: string; name: string; email: string | null; child: boolean; events: { eventId: string; status: string | null }[] };
type Household = { id: string; name: string; link: string | null; lastOpenedAt: string | null; guests: Guest[] };
type Counts = { eventId: string; title: string; invited: number; attending: number; declined: number; noReply: number }[];
type PublicReply = { id: string; name: string; email: string; status: string; note: string | null; event_title: string | null; created_at: string };
type Wedding = { id: string; rev: number; content: any; wedding: { slug: string | null; state: string; rsvp_deadline: string | null; allow_changes_after_deadline: boolean } };

const tabs = ["Overview", "Events", "Guests", "Replies"] as const;
type Tab = (typeof tabs)[number];

export function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Overview");
  const [w, setW] = useState<Wedding | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [hh, setHh] = useState<Household[]>([]);
  const [counts, setCounts] = useState<Counts>([]);
  const [publicReplies, setPublicReplies] = useState<PublicReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [fatal, setFatal] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const say = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2600); };

  const load = useCallback(async () => {
    try {
      const [wd, ev, hs, rs] = await Promise.all([call<Wedding>("GET", "/api/wedding"), call("GET", "/api/wedding/events"), call("GET", "/api/wedding/households"), call("GET", "/api/wedding/rsvps")]);
      setW(wd); setEvents(ev.events); setHh(hs.households); setCounts(rs.counts); setPublicReplies(rs.publicReplies ?? []); setFatal(null);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return router.replace("/signin?next=/dashboard");
      setFatal(e instanceof ApiError ? e.message : "Couldn’t load your wedding.");
    } finally { setLoading(false); }
  }, [router]);
  useEffect(() => { load(); const f = () => document.visibilityState === "visible" && load(); document.addEventListener("visibilitychange", f); return () => document.removeEventListener("visibilitychange", f); }, [load]);

  const act = async (fn: () => Promise<unknown>, ok?: string) => {
    try { await fn(); await load(); if (ok) say(ok); }
    catch (e) { say(e instanceof ApiError ? e.message : "That didn’t work. Try again."); throw e; }
  };

  if (loading) return <div className="db-center">Loading your wedding…</div>;
  if (fatal || !w) return <div className="db-center"><p>{fatal}</p><button className="btn btn-dark" onClick={load}>Try again</button></div>;

  return (
    <div className="db">
      <header className="db-top">
        <Link href="/" className="db-logo">wedsent</Link>
        <nav className="db-tabs" aria-label="Sections">
          {tabs.map((t) => <button key={t} aria-current={tab === t} onClick={() => { setTab(t); load(); }}>{t}</button>)}
        </nav>
        <div className="db-right">
          <Link href="/studio" className="btn btn-light db-studio">Open Studio</Link>
          <button className="db-out" onClick={async () => { await call("POST", "/api/auth/logout"); router.push("/"); }}>Sign out</button>
        </div>
      </header>
      <main className="db-main">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {tab === "Overview" && <Overview w={w} events={events} hh={hh} act={act} go={setTab} />}
            {tab === "Events" && <Events events={events} act={act} />}
            {tab === "Guests" && <Guests events={events} hh={hh} act={act} say={say} />}
            {tab === "Replies" && <Replies w={w} counts={counts} events={events} publicReplies={publicReplies} act={act} />}
          </motion.div>
        </AnimatePresence>
      </main>
      <div className="db-toast" role="status" aria-live="polite">{toast}</div>
    </div>
  );
}

/* ------------------------------ Overview ------------------------------ */
function Overview({ w, events, hh, act, go }: { w: Wedding; events: Event[]; hh: Household[]; act: any; go: (t: Tab) => void }) {
  const live = w.wedding.state === "published" && w.wedding.slug;
  const url = live ? `${location.origin}/w/${w.wedding.slug}` : null;
  const [problems, setProblems] = useState<string[]>([]);
  const guests = hh.reduce((n, h) => n + h.guests.length, 0);
  const steps = [
    { done: !!w.content.names?.trim() && !!w.content.venue?.trim(), title: "Design your invitation", sub: "Pick a look, add names, date and venue.", action: <Link className="btn btn-light" href="/studio">Open Studio</Link> },
    { done: events.length > 0, title: "Add your events", sub: "Nikah, ceremony, reception. Whatever you’re hosting.", action: <button className="btn btn-light" onClick={() => go("Events")}>Add events</button> },
    { done: guests > 0, title: "Add your guests", sub: `${guests} ${guests === 1 ? "person" : "people"} in ${hh.length} ${hh.length === 1 ? "household" : "households"}.`, action: <button className="btn btn-light" onClick={() => go("Guests")}>Add guests</button> },
    { done: !!live, title: "Publish and share", sub: live ? "Your invitation is live." : "Makes your invitation and every guest link work.", action: null },
  ];
  const share = url ? `Join us: ${url}` : "";
  return (
    <div className="db-stack">
      <h1 className="db-h">{live ? "You’re live." : "Let’s get you ready to send."}</h1>
      <ol className="db-steps">
        {steps.map((s, i) => (
          <li key={i} data-done={s.done}>
            <span className="db-tick">{s.done ? <Check size={16} strokeWidth={3} /> : i + 1}</span>
            <div><strong>{s.title}</strong><p>{s.sub}</p></div>
            {s.action}
          </li>
        ))}
      </ol>
      <section className="db-card">
        <h2>Publish</h2>
        {live && url ? (
          <>
            <p className="db-muted">Public link (generic, shows no guest details). Guests should use their own link from the Guests tab.</p>
            <div className="db-link"><code>{url}</code>
              <button className="btn btn-light" onClick={() => navigator.clipboard.writeText(url)}><Copy size={16} /> Copy</button>
              <a className="btn btn-light" href={url} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Open</a>
            </div>
            <div className="db-row">
              <a className="btn btn-light" href={`https://wa.me/?text=${encodeURIComponent(share)}`} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Share on WhatsApp</a>
              <button className="btn btn-dark" onClick={() => act(() => call("POST", "/api/wedding/publish").catch(publishErr(setProblems)), "Latest changes are live")}>Publish latest changes</button>
            </div>
            <p className="db-muted">Edits in the Studio stay as a draft until you publish again. Your link never changes.</p>
          </>
        ) : (
          <>
            <p className="db-muted">Publishing is free in this preview. Payment is added before launch; the price isn’t decided yet.</p>
            {problems.length > 0 && <ul className="db-problems" role="alert">{problems.map((p) => <li key={p}>{p}</li>)}</ul>}
            <button className="btn btn-dark" onClick={() => act(() => call("POST", "/api/wedding/publish").catch(publishErr(setProblems)), "Published").catch(() => {})}>Publish invitation</button>
          </>
        )}
      </section>
    </div>
  );
}
const publishErr = (set: (p: string[]) => void) => (e: unknown) => { if (e instanceof ApiError && e.code === "not_ready") set(e.details as string[]); throw e; };

/* ------------------------------- Events ------------------------------- */
function Events({ events, act }: { events: Event[]; act: any }) {
  const [f, setF] = useState({ title: "", startsOn: "", startsAt: "", venue: "", city: "", visibility: "invited" });
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    await act(() => call("POST", "/api/wedding/events", { ...f, startsOn: f.startsOn || null, startsAt: f.startsAt || null }), "Event added");
    setF({ title: "", startsOn: "", startsAt: "", venue: "", city: "", visibility: "invited" });
  };
  return (
    <div className="db-stack">
      <h1 className="db-h">Events</h1>
      <p className="db-muted">Each guest is invited to specific events. Guests only ever see the events they’re invited to.</p>
      {events.length === 0 && <p className="db-empty">No events yet. Add your first below.</p>}
      <ul className="db-list">
        {events.map((e) => (
          <li key={e.id}>
            <div><strong>{e.title}</strong><p>{[e.starts_on && friendlyDate(e.starts_on), e.starts_at_local?.slice(0, 5), e.venue, e.city].filter(Boolean).join(" · ") || "No details yet"}</p></div>
            <span className="db-pill">{e.visibility === "everyone" ? "Shown publicly" : "Invited guests only"}</span>
            <button className="db-icon" aria-label={`Delete ${e.title}`} onClick={() => confirm(`Delete “${e.title}”? Replies to it will be removed.`) && act(() => call("DELETE", `/api/wedding/events/${e.id}`), "Event deleted")}><Trash2 size={17} /></button>
          </li>
        ))}
      </ul>
      <form className="db-card db-form" onSubmit={add}>
        <h2>Add an event</h2>
        <label><span>Name</span><input required maxLength={80} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Nikah" /></label>
        <div className="db-2"><label><span>Date</span><input type="date" value={f.startsOn} onChange={(e) => setF({ ...f, startsOn: e.target.value })} /></label>
          <label><span>Time</span><input type="time" value={f.startsAt} onChange={(e) => setF({ ...f, startsAt: e.target.value })} /></label></div>
        <div className="db-2"><label><span>Venue</span><input maxLength={80} value={f.venue} onChange={(e) => setF({ ...f, venue: e.target.value })} /></label>
          <label><span>City</span><input maxLength={80} value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></label></div>
        <label><span>Who can see it?</span>
          <select value={f.visibility} onChange={(e) => setF({ ...f, visibility: e.target.value })}>
            <option value="invited">Only guests invited to it</option><option value="everyone">Everyone with the public link</option>
          </select></label>
        <button className="btn btn-dark" disabled={!f.title.trim()}><Plus size={16} /> Add event</button>
      </form>
    </div>
  );
}

/* ------------------------------- Guests ------------------------------- */
function Guests({ events, hh, act, say }: { events: Event[]; hh: Household[]; act: any; say: (m: string) => void }) {
  const [name, setName] = useState("");
  const [lines, setLines] = useState("");
  const [sel, setSel] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [imp, setImp] = useState<{ csv: string; preview: any } | null>(null);
  useEffect(() => { if (!sel.length && events.length) setSel(events.map((e) => e.id)); }, [events]); // eslint-disable-line

  const parsed = useMemo(() => lines.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => { const [n, e] = l.split(",").map((s) => s.trim()); return { name: n, email: e || null, child: /\(child\)$/i.test(n) }; }).map((g) => ({ ...g, name: g.name.replace(/\s*\(child\)$/i, "") })), [lines]);
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    await act(() => call("POST", "/api/wedding/households", { name: name || parsed[0]?.name, guests: parsed, eventIds: sel }), "Household added");
    setName(""); setLines("");
  };
  const shown = hh.filter((h) => !q || (h.name + h.guests.map((g) => g.name).join(" ")).toLowerCase().includes(q.toLowerCase()));

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    const csv = await f.text();
    try { setImp({ csv, preview: await call("POST", "/api/wedding/import", { csv }) }); } catch (e) { say(e instanceof ApiError ? e.message : "Couldn’t read that file."); }
  };

  return (
    <div className="db-stack">
      <h1 className="db-h">Guests</h1>
      {events.length === 0 && <p className="db-banner">Add an event first, so you can choose who’s invited to what.</p>}
      <form className="db-card db-form" onSubmit={add}>
        <h2>Add a household</h2>
        <p className="db-muted">A household shares one link. Put each person on a new line (optionally “Name, email” and “(child)”).</p>
        <label><span>Household name <i>optional</i></span><input value={name} maxLength={120} onChange={(e) => setName(e.target.value)} placeholder="The Khans" /></label>
        <label><span>People</span><textarea rows={4} value={lines} onChange={(e) => setLines(e.target.value)} placeholder={"Sara Khan, sara@example.com\nOmar Khan\nZayn Khan (child)"} /></label>
        <fieldset><legend>Invited to</legend>
          <div className="db-chips">{events.map((e) => (
            <label key={e.id} className="db-chip"><input type="checkbox" checked={sel.includes(e.id)} onChange={(x) => setSel(x.target.checked ? [...sel, e.id] : sel.filter((i) => i !== e.id))} />{e.title}</label>
          ))}</div></fieldset>
        <div className="db-row">
          <button className="btn btn-dark" disabled={!parsed.length || !sel.length}><Plus size={16} /> Add household</button>
          <label className="btn btn-light"><Upload size={16} /> Import CSV<input hidden type="file" accept=".csv,text/csv" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} /></label>
        </div>
      </form>

      {imp && (
        <section className="db-card" aria-label="Import preview">
          <h2>Review import</h2>
          <p><strong>{imp.preview.rows.length}</strong> ready to add · <strong>{imp.preview.duplicates.length}</strong> look like duplicates (skipped) · <strong>{imp.preview.errors.length}</strong> need fixing</p>
          {[...imp.preview.errors.map((e: any) => `Row ${e.line}: ${e.message}`), ...imp.preview.duplicates.map((d: any) => `Row ${d.line}: ${d.guest}. ${d.reason}`)].slice(0, 8).map((m) => <p className="db-muted" key={m}>{m}</p>)}
          <p className="db-muted">Everyone imported is invited to: {events.filter((e) => sel.includes(e.id)).map((e) => e.title).join(", ") || "no events selected"}.</p>
          <div className="db-row">
            <button className="btn btn-dark" disabled={!imp.preview.rows.length || !sel.length} onClick={() => act(() => call("POST", "/api/wedding/import", { csv: imp.csv, eventIds: sel, confirm: true, skipErrors: true }), "Guests imported").then(() => setImp(null))}>Import {imp.preview.rows.length}</button>
            <button className="btn btn-light" onClick={() => setImp(null)}>Cancel</button>
          </div>
          <p className="db-muted">Columns: name (required), household, email, child.</p>
        </section>
      )}

      {hh.length > 0 && <input className="db-search" type="search" placeholder="Search guests" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search guests" />}
      {hh.length === 0 && <p className="db-empty">No guests yet.</p>}
      <ul className="db-hh">
        {shown.map((h) => (
          <li key={h.id} className="db-card">
            <div className="db-hh-top">
              <div><strong>{h.name}</strong><p className="db-muted">{h.guests.length} {h.guests.length === 1 ? "person" : "people"} · {h.lastOpenedAt ? "Opened their link" : "Link not opened yet"}</p></div>
              <div className="db-row">
                {h.link && <button className="btn btn-light" onClick={() => { navigator.clipboard.writeText(h.link!); say("Link copied"); }}><Link2 size={16} /> Copy link</button>}
                {h.link && <a className="btn btn-light" target="_blank" rel="noreferrer" href={`https://wa.me/?text=${encodeURIComponent(`You’re invited: ${h.link}`)}`}><MessageCircle size={16} /> WhatsApp</a>}
                <button className="db-icon" title="Make a new link (the old one stops working)" aria-label="Reset link" onClick={() => confirm("Make a new link? The old one will stop working.") && act(() => call("POST", `/api/wedding/households/${h.id}/rotate`), "New link created")}><RefreshCw size={16} /></button>
                <button className="db-icon" aria-label={`Delete ${h.name}`} onClick={() => confirm(`Delete ${h.name} and their replies?`) && act(() => call("DELETE", `/api/wedding/households/${h.id}`), "Household deleted")}><Trash2 size={16} /></button>
              </div>
            </div>
            <ul className="db-people">
              {h.guests.map((g) => (
                <li key={g.id}><span>{g.name}{g.child && <i> · child</i>}</span>
                  <span className="db-ev">{g.events.map((ev) => {
                    const t = events.find((x) => x.id === ev.eventId)?.title ?? "";
                    return (
                      <label key={ev.eventId} className="db-status" data-s={ev.status ?? "none"} title={`Set reply for ${g.name}: ${t}`}>
                        <span>{t}</span>
                        <select value={ev.status ?? ""} aria-label={`${g.name}, ${t}`} onChange={(e) => e.target.value && act(() => call("POST", "/api/wedding/responses", { answers: [{ guestId: g.id, eventId: ev.eventId, status: e.target.value }] }), "Reply recorded")}>
                          <option value="" disabled>No reply</option><option value="attending">Attending</option><option value="declined">Declined</option>
                        </select>
                      </label>);
                  })}</span></li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------- Replies ------------------------------ */
function Replies({ w, counts, events, publicReplies, act }: { w: Wedding; counts: Counts; events: Event[]; publicReplies: PublicReply[]; act: any }) {
  const [deadline, setDeadline] = useState(w.wedding.rsvp_deadline ? w.wedding.rsvp_deadline.slice(0, 10) : "");
  const [allow, setAllow] = useState(w.wedding.allow_changes_after_deadline);
  return (
    <div className="db-stack">
      <h1 className="db-h">Replies</h1>
      <p className="db-muted">Counts are people, not links. “No reply” is different from “declined”.</p>
      {events.length === 0 && <p className="db-empty">Add events and guests to see replies here.</p>}
      <ul className="db-counts">
        {counts.map((c) => (
          <li key={c.eventId} className="db-card">
            <h2>{c.title}</h2>
            <div className="db-bar" role="img" aria-label={`${c.attending} attending, ${c.declined} declined, ${c.noReply} no reply`}>
              <span style={{ flex: c.attending }} data-k="yes" /><span style={{ flex: c.declined }} data-k="no" /><span style={{ flex: c.noReply }} data-k="wait" />
            </div>
            <dl><div><dt>Attending</dt><dd>{c.attending}</dd></div><div><dt>Declined</dt><dd>{c.declined}</dd></div><div><dt>No reply</dt><dd>{c.noReply}</dd></div><div><dt>Invited</dt><dd>{c.invited}</dd></div></dl>
          </li>
        ))}
      </ul>
      <section className="db-card">
        <h2>Public-link replies ({publicReplies.length})</h2>
        <p className="db-muted">These people submitted the public form. Their identity and eligibility have not been verified. They are not counted as confirmed invited guests or check-ins.</p>
        {publicReplies.length === 0 ? <p className="db-empty">No public-link replies yet.</p> :
          <ul className="db-list">{publicReplies.map((reply) => <li key={reply.id}>
            <div><strong>{reply.name}</strong><p>{reply.email} · {reply.event_title || "Main celebration"} · {reply.note || "No note"}</p></div>
            <span className="db-pill">{reply.status === "attending" ? "Accepts" : "Declines"} · unverified</span>
          </li>)}</ul>}
      </section>
      <section className="db-card db-form">
        <h2>Reply-by date</h2>
        <label><span>Guests can reply until</span><input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} /></label>
        <label className="db-check"><input type="checkbox" checked={allow} onChange={(e) => setAllow(e.target.checked)} />Still allow changes after that date</label>
        <button className="btn btn-dark" onClick={() => act(() => call("PUT", "/api/wedding/policy", { deadline: deadline ? `${deadline}T23:59:59.000Z` : null, allowAfter: allow }), "Saved")}>Save</button>
        <p className="db-muted">After the date, you can still enter or correct replies for guests yourself in the Guests tab.</p>
      </section>
      <a className="btn btn-light db-csv" href="/api/wedding/rsvps?format=csv"><Download size={16} /> Download replies (CSV)</a>
    </div>
  );
}
