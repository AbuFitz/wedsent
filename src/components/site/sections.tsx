"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CalendarPlus, Check, Lock, MapPin, Printer, X } from "lucide-react";
import "./sections.css";

const ease = [0.2, 0.8, 0.2, 1] as const;
const rise = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.8, ease } };

/* A quiet row of plain facts: no invented numbers. */
export function Trust() {
  const t = ["Guests need no app", "Guests need no account", "No ads, ever", "One price, no subscription"];
  return (
    <section className="tr" aria-label="Good to know">
      <ul>{t.map((x) => <li key={x}><Check size={16} strokeWidth={2.6} />{x}</li>)}</ul>
    </section>
  );
}

/* Feature index: each tile shows the real thing in miniature. */
export function Features() {
  return (
    <section id="features" className="ft">
      <motion.div className="ft-head" {...rise}>
        <h2>Beautiful to open.<br />Simple to organise.</h2>
        <p>An invitation that makes an impression, with the unglamorous parts handled properly: families, events, replies and changes of plan.</p>
      </motion.div>
      <div className="ft-grid">
        <motion.article className="ft-tile ft-wide" {...rise}>
          <div className="ft-viz ft-links">
            {["The Khans", "Priya & Sam", "Uncle Tariq"].map((n, k) => (
              <div key={n}><span>{n}</span><code>wedsent.com/r/{["k3x9", "p7a2", "m4q8"][k]}…</code><b>Copy</b></div>
            ))}
          </div>
          <h3>A private link for every household</h3>
          <p>Each family opens their own page, showing only the events they’re invited to. Forwarded by mistake? Reset that one link and the old one stops working.</p>
        </motion.article>

        <motion.article className="ft-tile" {...rise}>
          <div className="ft-viz ft-matrix">
            <div><i /><span>Nikah</span><span>Walima</span></div>
            <div><b>Sara</b><Check size={15} strokeWidth={3} data-y /><Check size={15} strokeWidth={3} data-y /></div>
            <div><b>Omar</b><X size={15} strokeWidth={3} data-n /><Check size={15} strokeWidth={3} data-y /></div>
            <div><b>Zayn</b><span className="ft-none">–</span><Check size={15} strokeWidth={3} data-y /></div>
          </div>
          <h3>Replies per person, per event</h3>
          <p>Yes to the reception, no to the ceremony. Plus-ones are named guests, so the headcount is always real.</p>
        </motion.article>

        <motion.article className="ft-tile" {...rise}>
          <div className="ft-viz ft-cal">
            <span><CalendarPlus size={16} /> Add to calendar</span>
            <span><MapPin size={16} /> Open in Maps</span>
          </div>
          <h3>Everything a guest asks for</h3>
          <p>Date, time, venue, dress code and directions, with a calendar file that works in any calendar app.</p>
        </motion.article>

        <motion.article className="ft-tile" {...rise}>
          <div className="ft-viz ft-ver">
            <span data-live>Live</span><span>Draft · 3 edits</span>
          </div>
          <h3>Change it after you send it</h3>
          <p>Edits stay private until you publish them. Your link never changes, so nobody has to be re-invited.</p>
        </motion.article>

        <motion.article className="ft-tile" {...rise}>
          <div className="ft-viz ft-priv"><Lock size={18} /><span>Link previews show no names, no dates, no guest details.</span></div>
          <h3>Private by default</h3>
          <p>Guest links aren’t listed or searchable, and the page behind them only shows that household’s own information.</p>
        </motion.article>

        <motion.article className="ft-tile ft-wide ft-print" {...rise}>
          <div className="ft-viz ft-a5"><div><i>Amina &amp; Yusuf</i><u /><u /></div><Printer size={22} /></div>
          <div>
            <h3>Print the same design</h3>
            <p>An A5 layout for your own printer or a PDF today. Print-shop files with bleed and crop marks are next.</p>
          </div>
        </motion.article>
      </div>
      <p className="ft-note">Still to come: reminders, music, photos, and a Photo Hall for after the day.</p>
    </section>
  );
}

export function PriceTeaser() {
  return (
    <section className="pt-teaser">
      <motion.div {...rise}>
        <h2><span>£39</span> once, for the whole wedding.</h2>
        <p>No subscription and no per-guest charges. This is the provisional price: checkout isn’t switched on yet, so nothing is charged while you try it.</p>
        <Link href="/pricing" className="btn btn-dark">See what’s included <ArrowRight size={18} /></Link>
      </motion.div>
    </section>
  );
}

const faqs = [
  { q: "Do my guests need an app or an account?", a: "No. Each household gets a link that opens on any phone. They reply on the page and can come back to change their answer." },
  { q: "Can I send it on WhatsApp?", a: "Yes. You copy each household’s link and send it however you like. Wedsent doesn’t send messages for you yet, so you stay in control of who gets what." },
  { q: "What if the family is invited to some events but not others?", a: "Invite each person to specific events. A guest only ever sees, and can only answer, the events they’re invited to." },
  { q: "Is it finished?", a: "It’s an early build. Designing, saving, publishing, household links and replies work. Payments, reminders, music and photos don’t yet, and the pricing page says so." },
];
export function Faq() {
  return (
    <section className="fq">
      <h2>Good to know</h2>
      <div>{faqs.map((f, i) => <details key={f.q} open={i === 0}><summary>{f.q}<span aria-hidden="true" /></summary><p>{f.a}</p></details>)}</div>
    </section>
  );
}

export function Closing() {
  return (
    <section className="cl">
      <motion.h2 {...rise}>Make one they’ll<br />want to open.</motion.h2>
      <Link href="/studio" className="btn cl-btn">Open the Studio <ArrowRight size={18} /></Link>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="sf">
      <div className="sf-top">
        <div><span className="sf-logo">wedsent</span><p>Wedding invitations that open like a moment, with replies you can actually count.</p></div>
        <nav aria-label="Footer">
          <Link href="/studio">Studio</Link><a href="#designs">Designs</a><a href="#how">How it works</a><Link href="/pricing">Pricing</Link>
        </nav>
      </div>
      <p className="sf-note">Early build. Drafts you make while signed out stay in your browser. Nothing is sent to guests for you.</p>
    </footer>
  );
}
