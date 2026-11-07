import Link from "next/link";
import {ArrowLeft,ArrowRight,Check,MoveUpRight} from "lucide-react";
import "./pricing.css";

const included=[
  "One wedding invitation, beautifully hosted",
  "Curated invitation designs and personalised details",
  "Your own shareable guest link",
  "Guest RSVP collection and response overview",
  "Plus-ones and household responses",
  "Event details, maps and add-to-calendar",
  "Guest updates and reminders",
  "Matching digital and print layout",
];
const faqs=[
  {q:"Is it really one payment?",a:"That's the intended pricing model: a single payment per wedding invitation, rather than an ongoing subscription. The final inclusions and hosting period will be confirmed before checkout launches."},
  {q:"Can I share the invitation on WhatsApp?",a:"Yes, shareable invitation links are a core feature in development. The goal is one link that opens beautifully on a guest's phone, with no app required."},
  {q:"Can I see who is coming?",a:"The planned guest view will show accepted, declined and awaiting responses, with household and plus-one handling. Real responses are not live in this early preview."},
  {q:"Will I be able to print the invitation?",a:"An experimental A5 print preview is available today. Production artwork with bleed, trim and professional export quality still needs to be completed."},
  {q:"Do I need an account to try a design?",a:"No. You can explore designs and edit a draft right now. It is saved in the browser on your device until accounts and secure cloud saving are ready."}
];
export default function Pricing(){return <main className="pr-site"><header className="pr-nav"><Link href="/" className="pr-brand">wedsent</Link><div><Link href="/">Explore designs</Link><Link href="/studio" className="pr-nav-cta">Open Studio <MoveUpRight size={15}/></Link></div></header><section className="pr-hero"><div className="pr-kicker"><span/> STRAIGHTFORWARD BY DESIGN</div><h1>One celebration.<br/><span>One simple price.</span></h1><p>Everything you need to make a first impression and keep the guest list in one place. No confusing tiers. No ongoing subscription in our proposed model.</p></section><section className="pr-main"><div className="pr-intro"><span>THE IDEA</span><h2>Pay once.<br/>Make it yours.</h2><p>We’re designing Wedsent to make brilliant wedding invitations accessible without complexity. The launch offer is being finalised, so there’s no checkout or payment collection yet.</p></div><article className="pr-card"><div className="pr-card-top"><span>THE WEDSENT INVITATION</span><span className="pr-proposal">PROPOSED LAUNCH PRICE</span></div><div className="pr-price"><span>£</span><strong>39</strong><div>one time<br/>per wedding</div></div><p>Provisional pricing for the complete invitation experience. Final price and limits will be shown before any payment is accepted.</p><Link href="/studio">Try the invitation Studio <ArrowRight size={20}/></Link><span className="pr-notlive">EARLY PREVIEW · CHECKOUT IS NOT LIVE</span></article></section><section className="pr-included"><div><span>ONE PACKAGE. THE ESSENTIALS.</span><h2>Thoughtful details,<br/>all together.</h2><p>These are the intended inclusions for the full product. Availability will be clearly identified as features launch.</p></div><ul>{included.map(item=><li key={item}><Check size={17}/>{item}</li>)}</ul></section><section className="pr-questions"><span>GOOD TO KNOW</span><h2>A few things<br/>worth asking.</h2><div>{faqs.map(({q,a},i)=><details key={q} open={i===0}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section><section className="pr-end"><span>START WITH A DESIGN</span><h2>See what feels<br/>like you.</h2><Link href="/studio">Open Studio <ArrowRight size={19}/></Link></section><footer className="pr-footer"><Link href="/">wedsent</Link><p>Digital invitations, thoughtfully made.</p><Link href="/">Back to the website <ArrowLeft size={15}/></Link></footer></main>}
