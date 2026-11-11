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
    <header className="pe-hero"><span className="pe-caption">A BEAUTIFUL START SHOULD FEEL SIMPLE</span><h1>One wedding.<br/><em>One thoughtful price.</em></h1><div className="pe-hero-foot"><p>No monthly subscription is planned. Just your invitation, your people and a little less to think about.</p><Link href="/start">Try creating yours <ArrowUpRight size={20}/></Link></div></header>
    <div className="pe-photo">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/art/weddsent-editorial-hands-v2.webp" alt="Couple holding hands in wedding attire" width={1024} height={1536}/><div><span>PERSONAL BY DESIGN</span><p>For one beautiful<br/>chapter of your life.</p></div></div>
    <section className="pe-plan"><div className="pe-plan-intro"><span className="pe-caption">THE WEDDSENT EXPERIENCE</span><h2>Everything you need.<br/><em>Nothing you don&apos;t.</em></h2><p>We&apos;re still finishing the full experience. The price shown is provisional, and we won&apos;t charge you before checkout is ready.</p></div><div className="pe-card"><span>ONE WEDDING / ONE-TIME PAYMENT</span><div className="pe-price"><span>£</span>39<small>*</small></div><p>Proposed one-time price · checkout not live</p><Link href="/start">Begin your invitation <ArrowUpRight size={19}/></Link><div className="pe-list"><h3>Part of the current experience</h3>{included.map(i=><div key={i}><Check size={17}/>{i}</div>)}<h3>Planned for later</h3>{forthcoming.map(i=><div className="future" key={i}><Minus size={17}/>{i}</div>)}</div><small>*Provisional. Final price and hosting duration will be confirmed before checkout launches.</small></div></section>
    <section className="pe-faq"><div><span className="pe-caption">GOOD TO KNOW</span><h2>Before you <em>begin.</em></h2></div><div>{questions.map(([q,a],i)=><details key={q} open={i===0}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
    <section className="pe-end"><span>THE INVITATION IS ONLY THE BEGINNING</span><h2>Find something that feels like <em>you.</em></h2><Link href="/designs">Discover the designs <ArrowUpRight size={20}/></Link></section>
  </main><SiteFooter/></>;
}
