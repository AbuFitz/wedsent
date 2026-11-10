"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import "./sections.css";

const ease = [0.2, 0.8, 0.2, 1] as const;
const rise = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.8, ease } };

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
      <Link href="/start" className="btn cl-btn">Start your invitation <ArrowRight size={18} /></Link>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="sf">
      <div className="sf-top">
        <div><span className="sf-logo">weddsent</span><p>Invitations worth opening. Moments worth remembering.</p></div>
        <nav aria-label="Footer">
          <Link href="/start">Start</Link><Link href="/designs">Designs</Link><Link href="/pricing">Pricing</Link><Link href="/studio">Studio</Link><Link href="/credits">Artwork credits</Link>
        </nav>
      </div>
      <div className="sf-bottom"><span>WEDDSENT © 2026</span><span>MADE FOR THE BEGINNING OF SOMETHING BEAUTIFUL.</span></div>
      <p className="sf-note">Early build. Signed-out drafts stay in your browser. Invitations aren't automatically sent to guests.</p>
    </footer>
  );
}
