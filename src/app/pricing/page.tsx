import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { Phone } from "@/components/phone";
import { Invitation } from "@/components/invitation/invitation";
import { defaults } from "@/lib/designs";
import "./pricing.css";

export const metadata: Metadata = { title: "Pricing — Wedsent", description: "One price per wedding. Pay once, no subscription. Provisional price shown; checkout is not live yet." };

const items: { text: string; ready: boolean }[] = [
  { text: "Your invitation, hosted at its own link", ready: true },
  { text: "Seven designs, each with its own way of opening", ready: true },
  { text: "A private link for every household", ready: true },
  { text: "Replies per person, per event, with plus-ones as named guests", ready: true },
  { text: "Calendar file and directions on every invitation", ready: true },
  { text: "A5 print layout (browser print)", ready: true },
  { text: "Reminders to guests who haven’t replied", ready: false },
  { text: "Music, photos and professional print files", ready: false },
];

const faqs = [
  { q: "Is it really one payment?", a: "That’s the plan: one payment per wedding, no subscription. The price shown is provisional and the hosting period isn’t final. You’ll see both, in full, before you’re asked to pay." },
  { q: "Can I pay today?", a: "Not yet. Checkout isn’t switched on, so nothing is charged. You can design, add guests and collect replies in the preview." },
  { q: "How do guests get their invitation?", a: "Every household gets its own link. Paste it into WhatsApp, a text or an email. It opens on their phone with no app and no account." },
  { q: "Will you send the invitations for me?", a: "Not yet. You copy each link and send it yourself, so you decide who gets what and when. Sending and reminders by email are on the list." },
  { q: "Can I see who’s coming?", a: "Yes. Counts are people, not links, and they’re split by event, so a guest can say yes to the reception and no to the ceremony." },
  { q: "Can I print it?", a: "There’s an A5 layout for your own printer or a PDF today. Print-shop files with bleed and crop marks come later." },
];

export default function Pricing() {
  const phone = (design: "botanica" | "zellige" | "marigold", names: string) => (
    <Phone label={`${design} invitation`}><Invitation data={{ ...defaults, design, names, accent: "", palette: "" }} still /></Phone>
  );
  return (
    <>
      <Nav />
      <main className="pp">
        <section className="pp-hero">
          <div className="pp-copy">
            <h1>One price for<br />the whole day.</h1>
            <p>Design the invitation, give every household their own link, and watch the replies come in. Pay once, per wedding. No subscription.</p>
            <div className="pp-cta">
              <Link href="/studio" className="btn btn-dark">Start designing <ArrowRight size={18} /></Link>
              <Link href="/#designs" className="btn btn-light">See the designs</Link>
            </div>
          </div>
          <div className="pp-fan" aria-hidden="true">
            <div className="pp-ph pp-ph--l">{phone("zellige", "Aisha & Yusuf")}</div>
            <div className="pp-ph pp-ph--r">{phone("marigold", "Priya & Arjun")}</div>
            <div className="pp-ph pp-ph--c">{phone("botanica", "Eleanor & James")}</div>
          </div>
        </section>

        <section className="pp-ticket-wrap" aria-labelledby="ticket">
          <article className="pp-ticket">
            <div className="pp-ticket-main">
              <p className="pp-badge">Provisional price</p>
              <h2 id="ticket" className="pp-price"><span>£</span>39</h2>
              <p className="pp-per">once, for one wedding</p>
              <Link href="/studio" className="btn btn-dark pp-go">Try it free <ArrowRight size={18} /></Link>
              <p className="pp-fine">Checkout isn’t live. Nothing is charged, and the price may change before launch.</p>
            </div>
            <div className="pp-ticket-list">
              <h3>What’s in it</h3>
              <ul>
                {items.map((i) => (
                  <li key={i.text} data-ready={i.ready}>
                    <Check size={17} strokeWidth={2.6} />
                    <span>{i.text}</span>
                    {!i.ready && <em>coming</em>}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </section>

        <section className="pp-story">
          <h2>From first look to final headcount.</h2>
          <div className="pp-steps">
            <figure className="pp-step">
              <div className="pp-demo pp-demo--send">
                <span className="pp-bubble">You’re invited. Open your invitation:</span>
                <span className="pp-link">wedsent.com/r/k3x9…</span>
              </div>
              <figcaption><strong>Send one link</strong>Each household gets its own. Copy it into WhatsApp, a text or an email.</figcaption>
            </figure>
            <figure className="pp-step">
              <div className="pp-demo pp-demo--reply">
                <div><span>Sara</span><b>Yes</b><i>No</i></div>
                <div><span>Omar</span><b>Yes</b><i>No</i></div>
                <div><span>Zayn</span><i>Yes</i><b className="no">No</b></div>
              </div>
              <figcaption><strong>They reply in a minute</strong>One page for the whole family. Yes or no, for each person and each event.</figcaption>
            </figure>
            <figure className="pp-step">
              <div className="pp-demo pp-demo--count">
                <p>Reception</p>
                <div className="pp-bar"><span style={{ flex: 12 }} /><span style={{ flex: 3 }} /><span style={{ flex: 5 }} /></div>
                <dl><div><dt>Coming</dt><dd>12</dd></div><div><dt>Can’t</dt><dd>3</dd></div><div><dt>Waiting</dt><dd>5</dd></div></dl>
              </div>
              <figcaption><strong>See who’s coming</strong>Counts are people, not links, and they’re split by event.</figcaption>
            </figure>
          </div>
          <p className="pp-caption-note">Illustrations of the real screens. Names and numbers are examples.</p>
        </section>

        <section className="pp-faq">
          <h2>Good to know</h2>
          <div>
            {faqs.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}<span aria-hidden="true" /></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="pp-end">
          <h2>See what feels like you.</h2>
          <Link href="/studio" className="btn pp-end-btn">Open the Studio <ArrowRight size={18} /></Link>
        </section>
        <footer className="pp-foot"><Link href="/">wedsent</Link><span>Early build. Drafts you make while signed out stay in your browser.</span></footer>
      </main>
    </>
  );
}
