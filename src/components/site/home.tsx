"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowRight, UploadSimple } from "@phosphor-icons/react";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { DesignCard } from "@/components/gallery/design-card";
import { sampleData, sampleEvents } from "@/components/gallery/samples";
import { DESIGNS, specById } from "@/engine/registry";
import { defaults, type Photo } from "@/lib/designs";
import { storePhoto } from "@/lib/photo-upload";
import { Nav } from "./nav";
import { Configurator } from "./configurator";
import { PriceTeaser, Faq, Closing, SiteFooter } from "./sections";
import "./home.css";

const ease = [0.22, 0.8, 0.2, 1] as const;

export function Home() {
  return (
    <>
      <Nav />
      <main className="hm">
        <Hero />
        <Make />
        <Celebrations />
        <GuestTour />
        <Collection />
        <Behind />
        <PriceTeaser />
        <Faq />
        <Closing />
      </main>
      <SiteFooter />
    </>
  );
}

/* One hero. One phone. The only interaction is the one that matters: put your own photograph in it. */
function Hero() {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const spec = specById("gallery");
  const take = async (f?: File) => {
    if (!f) return;
    setBusy(true); setErr(null);
    try { setPhoto(await storePhoto(f, false)); } catch (e) { setErr(e instanceof Error ? e.message : "Couldn’t add that photo."); }
    setBusy(false);
  };
  return (
    <section className="hm-hero">
      <div className="hm-hero-copy">
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>Wedding invitations people keep.</motion.h1>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.8, ease }}>
          Design it with your own photograph and words. Send each family a private link. See who’s coming to which event, person by person.
        </motion.p>
        <motion.div className="hm-cta" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease }}>
          <Link href="/start" className="btn btn-dark">Start your invitation <ArrowRight size={18} /></Link>
          <Link href="/designs" className="hm-textlink">Browse designs</Link>
        </motion.div>
        <p className="hm-note">No account needed to start. Guests need no app.</p>
      </div>
      <motion.div className="hm-stage" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1, ease }}>
        <div className="hm-phone"><Phone label="Invitation preview. Tap to open it."><Invitation data={{ ...sampleData(spec), photo }} events={sampleEvents(spec)} /></Phone></div>
        <div className="hm-try">
          <button type="button" className="btn btn-light" onClick={() => file.current?.click()} disabled={busy}><UploadSimple size={17} /> {busy ? "Adding…" : photo ? "Try another photo" : "Add your photo"}</button>
          <input ref={file} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { take(e.target.files?.[0]); e.target.value = ""; }} />
          <span>{err ?? "It stays on your device. Swipe the invitation up to open it."}</span>
        </div>
      </motion.div>
    </section>
  );
}

/* The product, for real. */
function Make() {
  return (
    <section id="make" className="hm-sec">
      <div className="hm-head">
        <h2>Make it yours in a minute.</h2>
        <p>Change anything below and the invitation changes with it. This is the same editor you’ll use, with nothing held back.</p>
      </div>
      <div className="hm-make"><Configurator /></div>
    </section>
  );
}

const EVENTS = ["Nikah", "Walima", "Mehndi", "Sangeet", "Haldi", "Ceremony", "Reception", "Civil ceremony", "Rehearsal dinner", "Brunch"];
function Celebrations() {
  return (
    <section className="hm-sec hm-cel">
      <div className="hm-head"><h2>Built around how you celebrate.</h2></div>
      <p className="hm-big" aria-label="Events you can add">
        {EVENTS.map((e, i) => <span key={e}>{e}{i < EVENTS.length - 1 ? <i> / </i> : ""}</span>)}
      </p>
      <div className="hm-cols">
        <article><h3>Different guests, different events</h3><p>Invite the whole family to the Walima and only close family to the Nikah. Each household opens a page showing just their own events.</p></article>
        <article><h3>Your language and script</h3><p>Add an opening line in Arabic or Hindi, or write your own. Right-to-left and Devanagari are set properly, in real calligraphic fonts.</p>
          <div className="hm-scripts"><span lang="ar" dir="rtl">بسم الله الرحمن الرحيم</span><span lang="hi">शुभ विवाह</span></div></article>
        <article><h3>Nothing assumed</h3><p>Celebration names, wording and designs are suggestions. Every one can be changed, and none is required.</p></article>
      </div>
    </section>
  );
}

const TOUR = [
  { t: "It opens with a gesture", d: "Lift the cover, tap to open, or watch it clear. Quiet movement, not cartoons. It plays once, and skips if reduced motion is on." },
  { t: "It shows each family their day", d: "Your card first, then only the events this household is invited to, with directions in Google or Apple Maps and a calendar file for each." },
  { t: "They reply in a minute", d: "One page for the household: yes or no for each person and each event. No app, no account, and they can change their answer later." },
];
function GuestTour() {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setI(Math.max(0, Math.min(2, Math.floor(v * 3 * 0.999)))));
  const s = specById("botanica");
  return (
    <section ref={ref} className="hm-tour" style={{ height: "300svh" }}>
      <div className="hm-tour-stick">
        <div className="hm-tour-text">
          <h2>What your guests see</h2>
          <ol>{TOUR.map((x, n) => (
            <li key={x.t} data-on={n === i}><h3>{x.t}</h3><motion.p initial={false} animate={{ height: n === i ? "auto" : 0, opacity: n === i ? 1 : 0 }} transition={{ duration: 0.4, ease }}>{x.d}</motion.p></li>
          ))}</ol>
        </div>
        <div className="hm-tour-phone">
          <Phone label="Live guest invitation"><Invitation key={i === 0 ? "closed" : "open"} data={sampleData(s)} events={sampleEvents(s)} greeting="Sara & family" open={i > 0 ? true : undefined} /></Phone>
        </div>
      </div>
    </section>
  );
}

function Collection() {
  return (
    <section id="designs" className="hm-sec">
      <div className="hm-head hm-head--row">
        <div><h2>{DESIGNS.length} designs, and growing.</h2><p>Each has its own composition, lettering and way of opening. Every colour and font is yours to change.</p></div>
        <Link href="/designs" className="btn btn-light">See all designs <ArrowRight size={16} /></Link>
      </div>
      <div className="hm-grid">{DESIGNS.map((d) => <DesignCard key={d.id} spec={d} />)}</div>
    </section>
  );
}

const LIST: [string, string][] = [
  ["A private link per household", "Reset one link and only that family’s old link stops working."],
  ["Replies per person, per event", "A link is never a headcount. Plus-ones are named guests."],
  ["Directions and calendar", "Google and Apple Maps links and a calendar file on every event."],
  ["Change it after you send it", "Edits stay a draft until you publish. Your link never changes."],
  ["Private by default", "Link previews show no names or dates, and pages are not searchable."],
  ["Print the same design", "An A5 layout today. Print-shop files are next."],
];
function Behind() {
  return (
    <section className="hm-sec">
      <div className="hm-head"><h2>The details, done properly.</h2></div>
      <ul className="hm-list">{LIST.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}</ul>
      <p className="hm-later">Still to come: reminders, music, a Photo Hall for after the day.</p>
    </section>
  );
}
void defaults;
