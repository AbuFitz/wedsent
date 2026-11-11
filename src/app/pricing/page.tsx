import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import { Nav, SiteFooter } from "@/components/site/nav";
import "./pricing.css";

export const metadata: Metadata = { title: "Pricing | Weddsent", description: "Preview your invitation for free. Weddsent is planned as a one-time payment per wedding." };

const inclusions = ["Your choice of invitation design", "Multiple events in one invitation", "Private links for each household", "RSVPs by guest and event"];
const questions = [
  ["Can I try it before paying?", "Yes. Browse designs and build a draft for free. Checkout isn’t open yet."],
  ["Do guests pay to reply?", "Guests can open their link and reply in their browser for free."],
  ["How long will the link stay live?", "The hosting period will be confirmed before paid checkout opens."],
] as const;

export default function Pricing() {
  return (
    <>
      <Nav />
      <main className="ed-price">
        <div className="ed-width">
          <section className="ed-price-grid">
            <header><h1>One price per wedding.</h1><p>Try a design and build your invitation for free.</p><Link className="ed-text-link" href="/designs">Browse designs <ArrowUpRight size={17} /></Link></header>
            <div className="ed-price-plan">
              <h2>Wedding invitation</h2>
              <p className="ed-price-amount">£39 <span>Proposed one-time price</span></p>
              <ul>{inclusions.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul>
              <Link href="/start" className="ed-button ed-button--primary">Create a free draft <ArrowUpRight size={17} /></Link>
              <p className="ed-price-note">Checkout is currently closed. The final price will be confirmed before launch.</p>
            </div>
          </section>
          <section className="ed-faq ed-price-faq">
            <h2>Questions</h2>
            <div>{questions.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={19} /></summary><p>{answer}</p></details>)}</div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
