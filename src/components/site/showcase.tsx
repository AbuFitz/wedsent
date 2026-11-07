"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Check, Link2, Plus } from "lucide-react";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { defaults, type InviteData } from "@/lib/designs";
import "./showcase.css";

const steps = [
  { id: "design", title: "Design it in minutes", body: "Pick a look, type your names, and watch the invitation rewrite itself. Change the design any time without losing a word." },
  { id: "send", title: "Send one link per household", body: "Every family gets its own private link. Paste it into WhatsApp, a text or an email. Guests open it on their phone: no app, no account." },
  { id: "reply", title: "They reply in a minute", body: "One page for the whole household. Yes or no for each person and each event, so a guest can attend the reception and miss the ceremony." },
  { id: "track", title: "See exactly who’s coming", body: "Counts are people, not links, split by event. Change a reply yourself after the deadline and every change is kept." },
] as const;
const ease = [0.2, 0.8, 0.2, 1] as const;

export function ProductTour({ data }: { data: InviteData }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [i, setI] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setI(Math.max(0, Math.min(steps.length - 1, Math.floor(v * steps.length * 0.999)))));
  return (
    <section id="how" ref={ref} className="pt" style={{ height: `${steps.length * 95 + 30}svh` }}>
      <div className="pt-stick">
        <div className="pt-text">
          <h2 className="pt-title">How it works</h2>
          <ol className="pt-list">
            {steps.map((s, n) => (
              <li key={s.id} data-on={n === i} data-past={n < i}>
                <span className="pt-dot" aria-hidden="true">{n < i ? <Check size={14} strokeWidth={3} /> : n + 1}</span>
                <div><h3>{s.title}</h3>
                  <motion.p initial={false} animate={{ height: n === i ? "auto" : 0, opacity: n === i ? 1 : 0 }} transition={{ duration: 0.4, ease }}>{s.body}</motion.p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="pt-stage" aria-hidden="true">
          <AnimatePresence mode="wait">
            <motion.div key={steps[i].id} className="pt-scene" initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5, ease }}>
              {i === 0 && <SceneDesign data={data} />}
              {i === 1 && <SceneSend data={data} />}
              {i === 2 && <SceneReply data={data} />}
              {i === 3 && <SceneTrack />}
            </motion.div>
          </AnimatePresence>
          <p className="pt-example">Example screens. Names and numbers are made up.</p>
        </div>
      </div>
    </section>
  );
}

function Window({ title, children, chip }: { title: string; children: React.ReactNode; chip?: React.ReactNode }) {
  return (
    <div className="win">
      <div className="win-bar"><span /><span /><span /><b>{title}</b>{chip}</div>
      <div className="win-body">{children}</div>
    </div>
  );
}

/* 1 — Studio with live preview ------------------------------------- */
function SceneDesign({ data }: { data: InviteData }) {
  const names = ["Amina & Yusuf", "Layla & Omar", "Hannah & James"];
  const [n, setN] = useState(0);
  const [typed, setTyped] = useState(names[0].length);
  useEffect(() => {
    let k = 0, c = names[0].length, dir: "del" | "type" = "del", t: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (dir === "del") { c--; if (c <= 0) { k = (k + 1) % names.length; dir = "type"; } }
      else { c++; if (c >= names[k].length) { dir = "del"; setN(k); setTyped(c); t = setTimeout(tick, 1700); return; } }
      setN(k); setTyped(Math.max(c, 0)); t = setTimeout(tick, dir === "del" ? 40 : 75);
    };
    t = setTimeout(tick, 1400);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line
  const shown = names[n].slice(0, typed);
  return (
    <Window title="Studio" chip={<em className="win-chip"><Check size={12} strokeWidth={3} /> Saved</em>}>
      <div className="sd">
        <div className="sd-panel">
          <div className="sd-tabs"><b>Design</b><span>Words</span><span>Details</span><span>Style</span></div>
          <label>Names<div className="sd-input">{shown}<i /></div></label>
          <label>Occasion<div className="sd-chips"><span data-on>Wedding</span><span>Nikah</span><span>Reception</span></div></label>
          <label>Accent<div className="sd-sw"><span style={{ background: "#9F4E3B" }} data-on /><span style={{ background: "#355C52" }} /><span style={{ background: "#6F6683" }} /><span style={{ background: "#946A3D" }} /></div></label>
        </div>
        <div className="sd-phone"><Phone label="Live preview"><Invitation data={{ ...data, names: shown || " " }} open still /></Phone></div>
      </div>
    </Window>
  );
}

/* 2 — Send a link -------------------------------------------------- */
function SceneSend({ data }: { data: InviteData }) {
  return (
    <div className="sn">
      <div className="sn-card">
        <p className="sn-h">Guests</p>
        {[["The Khans", "3 people"], ["Priya & Sam", "2 people"], ["Uncle Tariq", "1 person"]].map(([a, b], k) => (
          <motion.div key={a} className="sn-row" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + k * 0.1, ease }}>
            <div><strong>{a}</strong><span>{b}</span></div>
            <span className="sn-copy" data-hot={k === 0}><Link2 size={14} /> Copy link</span>
          </motion.div>
        ))}
        <span className="sn-add"><Plus size={14} /> Add household</span>
      </div>
      <div className="sn-phone">
        <Phone label="Message"><div className="chat">
          <div className="chat-top">Amina</div>
          <motion.p className="chat-b" initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.6 }}>You’re invited to our wedding 🤍</motion.p>
          <motion.div className="chat-b chat-link" initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 1.1 }}>
            <div className="chat-card"><Invitation data={{ ...data }} still /></div>
            <span>wedsent.com/r/k3x9mQ…</span>
          </motion.div>
          <motion.p className="chat-b chat-me" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9 }}>Opening it now!</motion.p>
        </div></Phone>
      </div>
    </div>
  );
}

/* 3 — Household reply ---------------------------------------------- */
function SceneReply({ data }: { data: InviteData }) {
  const people = ["Sara", "Omar", "Zayn"];
  const [pick, setPick] = useState<Record<string, "y" | "n">>({});
  useEffect(() => {
    const seq: [string, "y" | "n"][] = [["Sara", "y"], ["Omar", "y"], ["Zayn", "n"]];
    const ts = seq.map(([p, v], k) => setTimeout(() => setPick((s) => ({ ...s, [p]: v })), 700 + k * 650));
    return () => ts.forEach(clearTimeout);
  }, []);
  const done = Object.keys(pick).length === 3;
  return (
    <div className="rp">
      <Phone label="Reply">
        <div className="rp-screen">
          <p className="rp-top">Reply</p>
          <h4>Who’s coming, The Khans?</h4>
          <p className="rp-ev">Reception</p>
          {people.map((p) => (
            <div className="rp-row" key={p}><span>{p}</span>
              <div><b data-on={pick[p] === "y"}>Yes</b><b data-on={pick[p] === "n"} data-no>No</b></div></div>
          ))}
          <motion.span className="rp-go" animate={{ opacity: done ? 1 : 0.4 }}>Send reply</motion.span>
        </div>
      </Phone>
      <motion.div className="rp-note" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: done ? 1 : 0, scale: done ? 1 : 0.9 }}>
        <Check size={16} strokeWidth={3} /> Reply saved. They can change it from the same link.
      </motion.div>
    </div>
  );
}

/* 4 — Host counts -------------------------------------------------- */
function SceneTrack() {
  const rows = [
    { t: "Nikah", y: 18, n: 2, w: 6 },
    { t: "Reception", y: 41, n: 7, w: 12 },
    { t: "Walima", y: 22, n: 4, w: 9 },
  ];
  return (
    <Window title="Replies" chip={<em className="win-chip">Example data</em>}>
      <div className="tk">
        {rows.map((r, k) => (
          <div className="tk-card" key={r.t}>
            <p>{r.t}</p>
            <div className="tk-bar">
              <motion.span style={{ background: "#0F7B5F" }} initial={{ flexGrow: 0 }} animate={{ flexGrow: r.y }} transition={{ duration: 1.1, delay: 0.2 + k * 0.15, ease }} />
              <motion.span style={{ background: "#D3382B" }} initial={{ flexGrow: 0 }} animate={{ flexGrow: r.n }} transition={{ duration: 1.1, delay: 0.3 + k * 0.15, ease }} />
              <motion.span style={{ background: "#D9D5CC" }} initial={{ flexGrow: 0 }} animate={{ flexGrow: r.w }} transition={{ duration: 1.1, delay: 0.4 + k * 0.15, ease }} />
            </div>
            <dl><div><dt>Coming</dt><dd>{r.y}</dd></div><div><dt>Can’t</dt><dd>{r.n}</dd></div><div><dt>Waiting</dt><dd>{r.w}</dd></div></dl>
          </div>
        ))}
        <ul className="tk-feed">
          <li><b>Sara Khan</b> said yes to Reception <i>just now</i></li>
          <li><b>Priya &amp; Sam</b> replied for 2 events <i>12 min ago</i></li>
        </ul>
      </div>
    </Window>
  );
}
