import Link from "next/link";
import { ArrowUpRight, Check, Minus } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/sections";
import "./pricing-editorial.css";

const included = ["A beautifully designed invitation","Your own invitation link","A personal link for each household","Guest replies for each person and event","Calendar details and directions","An A5 browser-print layout"];
const forthcoming = ["Automatic reminders and sending","Professional print files","Music and expanded media"];
const questions = [
  ["Can I pay for it today?","Not yet. Checkout isn't switched on. You can explore designs and try the creation flow without being charged."],
  ["Is it actually a one-time payment?","That's the intended model: one payment for a wedding, no monthly subscription. £39 is provisional and the hosting period still needs to be finalised before sales open."],
  ["How do guests receive it?","Each household gets its own link. You can share the link through WhatsApp, text or email. Guests don't need to install an app or create an account."],
  ["Can I have a Nikah and Walima?","Yes. You can create multiple events and choose which households see each one. Event and household RSVP handling is part of the working system."],
  ["Can I change the invitation later?","Yes. You can update the draft in Studio. Published changes use a deliberate publishing step, so you stay in control of what guests see."]
];
export function PricingEditorial(){
  return <><Nav/><main className="pe">
    <header className="pe-hero"><span className="pe-caption">THE SIMPLE PART</span><h1>All the feeling.<br/><em>One price.</em></h1><div className="pe-hero-foot"><p>A beautiful invitation, thoughtful guest management, and no monthly subscription. That's the idea.</p><Link href="/start">Begin your invitation <ArrowUpRight size={20}/></Link></div></header>
    <div className="pe-photo">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/art/weddsent-veil.webp" alt="Elegant wedding portrait focusing on the couple holding hands beneath a veil" width={1000} height={1500}/><div><span>PERSONAL BY DESIGN.</span><p>For one beautiful<br/>chapter of your life.</p></div></div>
    <section className="pe-plan"><div className="pe-plan-intro"><span className="pe-caption">ONE WEDDING, ONE PLAN</span><h2>Everything you need.<br/><em>Nothing you don't.</em></h2><p>The price is provisional while we finish the full experience. We won't charge you until checkout is ready.</p></div><div className="pe-card"><span>WEDDSENT / ONE WEDDING</span><div className="pe-price"><span>£</span>39<small>*</small></div><p>One-time planned price · not available to buy yet</p><Link href="/start">Try creating yours <ArrowUpRight size={19}/></Link><div className="pe-list"><h3>Included in the current experience</h3>{included.map(i=><div key={i}><Check size={17}/>{i}</div>)}<h3>Planned for later</h3>{forthcoming.map(i=><div className="future" key={i}><Minus size={17}/>{i}</div>)}</div><small>*Provisional. Final price and hosting duration will be confirmed before checkout launches.</small></div></section>
    <section className="pe-faq"><div><span className="pe-caption">A FEW GOOD QUESTIONS</span><h2>Before you<br/><em>begin.</em></h2></div><div>{questions.map(([q,a],i)=><details key={q} open={i===0}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
    <section className="pe-end"><span>START WITH THE FEELING.</span><h2>The invitation<br/><em>is just the beginning.</em></h2><Link href="/designs">Find your design <ArrowUpRight size={20}/></Link></section>
  </main><SiteFooter/></>;
}
