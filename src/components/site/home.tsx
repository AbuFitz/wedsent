"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform,
} from "motion/react";
import { ArrowRight, Check, Circle, RotateCcw } from "lucide-react";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { Nav } from "./nav";
import { designs, saveDraft, type DesignId, type InviteData } from "@/lib/designs";
import { useDraft } from "@/lib/use-draft";
import "./home.css";

const ease = [0.2, 0.8, 0.2, 1] as const;

export function Home() {
  const { draft, patch } = useDraft();
  return (
    <>
      <Nav />
      <main>
        <Hero draft={draft} patch={patch} />
        <Designs draft={draft} />
        <Essentials />
        <Closing />
      </main>
      <footer className="foot">
        <span className="foot-logo">wedsent</span>
        <span>Early build. Drafts stay in your browser; nothing is sent or stored on a server.</span>
      </footer>
    </>
  );
}

/* ----------------------------- Hero ----------------------------- */

function Hero({ draft, patch }: { draft: InviteData; patch: (p: Partial<InviteData>) => void }) {
  const [replay, setReplay] = useState(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [7, -7]), { stiffness: 140, damping: 18 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-9, 9]), { stiffness: 140, damping: 18 });

  const words = ["The", "invitation", "they’ll", "actually", "open."];
  return (
    <section
      className="hero"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
    >
      <div className="hero-copy">
        <h1 className="hero-title" aria-label={words.join(" ")}>
          {words.map((w, i) => (
            <span className="mask" key={i} aria-hidden="true">
              <motion.span
                initial={{ y: "108%" }} animate={{ y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.9, ease }}
              >{w}&nbsp;</motion.span>
            </span>
          ))}
        </h1>
        <motion.p className="hero-sub" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.8, ease }}>
          Type your names and the phone beside you rewrites itself. Pick a design, open it like a guest would, then carry on in the Studio.
        </motion.p>
        <motion.div className="hero-form" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8, ease }}>
          <label className="field">
            <span>Names</span>
            <input value={draft.names} maxLength={60} onChange={(e) => patch({ names: e.target.value })} placeholder="Amina & Yusuf" autoComplete="off" />
          </label>
          <label className="field field-date">
            <span>Date</span>
            <input type="date" value={draft.date} onChange={(e) => patch({ date: e.target.value })} />
          </label>
          <Link href="/studio" className="btn btn-dark hero-go">Continue in Studio <ArrowRight size={18} /></Link>
        </motion.div>
        <motion.div className="hero-picks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}>
          {designs.map((d) => (
            <div key={d.id} className="pick" data-on={draft.design === d.id}>
              <span className="pick-thumb">
                <Invitation data={{ ...draft, design: d.id, accent: "" }} still />
              </span>
              <span className="pick-name">{d.name}</span>
              <button
                type="button" className="pick-hit" aria-pressed={draft.design === d.id} aria-label={`Preview ${d.name}`}
                onClick={() => { patch({ design: d.id, accent: "" }); setReplay((n) => n + 1); }}
              />
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div className="hero-stage" initial={{ opacity: 0, y: 60, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.25, duration: 1.1, ease }}>
        <div className="hero-glow" aria-hidden="true" style={{ background: designs.find((d) => d.id === draft.design)?.bg }} />
        <motion.div style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }} className="hero-tilt">
          <Phone label="Live invitation preview">
            <Invitation key={`${draft.design}-${replay}`} data={draft} rsvpHref="/invite/rsvp" />
          </Phone>
        </motion.div>
        <button type="button" className="replay" onClick={() => setReplay((n) => n + 1)}>
          <RotateCcw size={15} /> Close it again
        </button>
      </motion.div>
    </section>
  );
}

/* ------------------- Scroll-pinned design tour ------------------- */

const stage: Record<DesignId, { bg: string; fg: string }> = {
  zest: { bg: "#17120D", fg: "#FFF3E6" },
  mono: { bg: "#2437F2", fg: "#FFFFFF" },
  nocturne: { bg: "#E9E5DD", fg: "#0E0E10" },
};

function Designs({ draft }: { draft: InviteData }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [i, setI] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setI(Math.max(0, Math.min(designs.length - 1, Math.floor(v * designs.length * 0.999)))));
  const d = designs[i];
  const s = stage[d.id];

  return (
    <section id="designs" ref={ref} className="tour" style={{ height: `${designs.length * 100 + 40}svh` }}>
      <motion.div className="tour-stick" animate={{ backgroundColor: s.bg, color: s.fg }} transition={{ duration: 0.7, ease: "easeInOut" }}>
        <div className="tour-text">
          <p className="tour-count" aria-hidden="true">
            {designs.map((x, n) => <span key={x.id} className={n === i ? "on" : ""} />)}
          </p>
          <AnimatePresence mode="wait">
            <motion.div key={d.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45, ease }}>
              <h2 className="tour-title">{d.name}</h2>
              <p className="tour-mood">{d.mood}.</p>
              <p className="tour-open"><strong>{d.opening}.</strong> {d.openingHint}.</p>
              <div className="tour-actions">
                <Link
                  href="/studio" className="btn tour-btn"
                  onClick={() => saveDraft({ ...draft, design: d.id, accent: "" })}
                >Use {d.name} <ArrowRight size={18} /></Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="tour-phone">
          <AnimatePresence mode="wait">
            <motion.div key={d.id} initial={{ opacity: 0, y: 40, rotate: 3 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -30, rotate: -3 }} transition={{ duration: 0.5, ease }}>
              <Phone label={`${d.name} invitation`}>
                <Invitation data={{ ...draft, design: d.id, accent: "" }} rsvpHref="/invite/rsvp" />
              </Phone>
            </motion.div>
          </AnimatePresence>
          <p className="tour-try">Try it. This is the real invitation.</p>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------- Product essentials ------------------- */

const essentials = [
  { n: "01", title: "One link, everyone invited.", body: "Your own beautifully presented invitation link to share by WhatsApp, text, email or wherever your guests are.", state: "Planned for launch" },
  { n: "02", title: "Replies without the chasing.", body: "See who's coming, who can't make it and who still needs a reminder. Handle plus-ones and households thoughtfully.", state: "In development" },
  { n: "03", title: "Your details, always there.", body: "Directions, times, dress codes and event information in one clear place, designed to work beautifully on a phone.", state: "Interactive preview available" },
  { n: "04", title: "Digital first. Print too.", body: "A digital invitation guests can open with a little anticipation, with matching print-ready artwork as the product matures.", state: "A5 preview available" },
];

function Essentials() {
  return (
    <section id="status" className="status">
      <motion.h2 className="status-title" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease }}>
        Beautiful to open.<br />Simple to organise.
      </motion.h2>
      <p className="status-lead">An invitation that makes an impression. A few useful things behind it that make the whole experience easier for you and your guests.</p>
      <div className="essentials-grid">
        {essentials.map((item) => <motion.article key={item.n} className="essential" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.55}}><span className="essential-number">{item.n}</span><h3>{item.title}</h3><p>{item.body}</p><span className="essential-state">{item.state}</span></motion.article>)}
      </div>
      <div className="status-bottom"><span>Wedsent is currently an early preview. Publishing and real guest responses are not live yet.</span><Link href="/pricing">One simple price <ArrowRight size={16}/></Link></div>
    </section>
  );
}

function Closing() {
  return (
    <section className="closing">
      <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.9, ease }}>
        Make yours in<br />a few minutes.
      </motion.h2>
      <Link href="/studio" className="btn btn-dark closing-btn">Open Studio <ArrowRight size={18} /></Link>
    </section>
  );
}
