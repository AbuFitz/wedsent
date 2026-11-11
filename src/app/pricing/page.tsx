import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";
import { Nav, SiteFooter } from "@/components/site/nav";

export const metadata: Metadata = { title: "Pricing | Wedsent", description: "Design and preview for free. Wedsent is planned as one price per wedding." };

const inclusions = ["Any of the invitation designs, with its opening", "Multiple events in one invitation", "A private link for each household", "Replies per person and per event", "Countdown, map and Add to calendar", "Music, if you want it"];
const free = ["Browse and open every design", "Build a full draft in Studio", "Preview on a phone-sized screen"];
const questions = [
  ["Can I try it before paying?", "Yes. Browse designs and build a draft for free. Checkout is not open yet."],
  ["Do guests pay to reply?", "No. Guests open their link and reply in their browser for free."],
  ["How long will the link stay live?", "The hosting period will be confirmed before paid checkout opens."],
  ["Is the price final?", "No. £39 is the proposed price and may change before launch. You will not be charged anything today."],
] as const;

export default function Pricing() {
  return (
    <>
      <Nav />
      <main className="ws-page">
        <div className="ws-wrap">
          <header className="ws-page-head">
            <p className="ws-eyebrow">Pricing</p>
            <h1 className="ws-h1">One price per wedding.</h1>
            <p className="ws-lead">No subscription, no per-guest fees. Design and preview for free first.</p>
          </header>
          <section className="ws-plan" aria-label="Plans">
            <div className="ws-plan-main">
              <h2>Wedding invitation</h2>
              <p className="ws-price-amt">£39<small>Proposed one-time price</small></p>
              <ul>{inclusions.map((i) => <li key={i}><Check size={18} weight="bold" />{i}</li>)}</ul>
              <div><Link href="/start" className="ws-pill ws-pill--light ws-pill--lg">Start free <ArrowRight size={18} /></Link></div>
              <p className="ws-plan-note">Checkout is not open yet. The final price will be confirmed before launch.</p>
            </div>
            <div className="ws-plan-side">
              <h2>Free while you design</h2>
              <ul>{free.map((i) => <li key={i}><Check size={18} weight="bold" />{i}</li>)}</ul>
              <p className="ws-plan-note">Photo Hall and printed stationery are planned for later and are not part of this price.</p>
            </div>
          </section>
          <section className="ws-faq" style={{ padding: 0 }}>
            <div className="ws-faq-grid">
              <div><h2 className="ws-h2">Questions</h2></div>
              <div>{questions.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
