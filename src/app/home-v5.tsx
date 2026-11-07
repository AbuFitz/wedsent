"use client";
import Link from "next/link";
import {useState} from "react";
import {ArrowDown, ArrowRight, ArrowUpRight, Menu, X, Check, Sparkles} from "lucide-react";
import {InvitationV2} from "@/components/invitation-v2";
import {defaults,designs,type DesignId} from "@/lib/designs";

const collections: {id:DesignId;name:string;mood:string;tag:string}[]=[
  {id:"noor",name:"Noor",mood:"An invitation in soft light.",tag:"AIRY · BOTANICAL"},
  {id:"afterglow",name:"Soli",mood:"A little colour, beautifully considered.",tag:"BLUSH · EXPRESSIVE"},
  {id:"sway",name:"Veil",mood:"Quiet type and endless possibility.",tag:"MINIMAL · EDITORIAL"}
];
export default function HomeV5(){
 const [active,setActive]=useState<DesignId>("noor");
 const [expanded,setExpanded]=useState(false);
 const [menu,setMenu]=useState(false);
 return <main className="w5-home">
  <nav className="w5-floating-nav" aria-label="Main navigation">
   <Link className="w5-wordmark w5-nav-logo" href="/">wedsent<span>✳</span></Link>
   <div className={menu?"w5-nav-links is-open":"w5-nav-links"}><a href="#collections" onClick={()=>setMenu(false)}>Designs</a><a href="#experience" onClick={()=>setMenu(false)}>Experience</a><a href="#questions" onClick={()=>setMenu(false)}>Details</a></div>
   <Link className="w5-nav-cta" href="/studio">Create yours <ArrowUpRight size={15}/></Link>
   <button className="w5-nav-menu" type="button" aria-label="Toggle menu" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
  </nav>
  <section className="w5-hero">
   <div className="w5-hero-content"><span className="w5-tiny-label">WEDDING INVITATIONS, BEAUTIFULLY REIMAGINED</span><h1>Something<br/><em>worth opening.</em></h1><p>Make an invitation that feels like your day. Designed to be personal, lovely to open, and easy for everyone you love.</p><div className="w5-hero-actions"><Link href="/studio" className="w5-cta">Make your invitation <ArrowUpRight size={17}/></Link><a href="#collections">Explore the collection <ArrowDown size={16}/></a></div><small>Try the early Studio for free. Publishing is coming later.</small></div>
   <div className="w5-hero-product"><div className="w5-product-toolbar"><span>THE INVITATION / A & Y</span><span>AN INTERACTIVE PREVIEW <Sparkles size={13}/></span></div><div className="w5-hero-invite"><InvitationV2 data={{...defaults,design:"noor"}}/></div><div className="w5-product-foot"><span>PERSONALISED TO YOUR STORY</span><span>OPEN THE EXAMPLE ↑</span></div></div>
  </section>
  <section className="w5-collection-section" id="collections"><div className="w5-section-intro"><p className="w5-tiny-label">THE COLLECTION</p><h2>Every story has<br/>its own <em>feeling.</em></h2><p>Thoughtfully different starting points. Choose the one you love, then make it entirely yours.</p></div>
   <div className="w5-accordion" role="group" aria-label="Explore invitation designs">{collections.map((d,index)=><button key={d.id} className={`w5-accordion-panel w5-accordion-${d.id} ${active===d.id?"is-active":""}`} onClick={()=>setActive(d.id)} aria-pressed={active===d.id}><div className="w5-accordion-backdrop"/><span className="w5-accordion-index">0{index+1} / {d.tag}</span><div className="w5-accordion-center"><span>{d.name}</span><small>{d.mood}</small></div><span className="w5-accordion-arrow"><ArrowUpRight size={18}/></span></button>)}</div>
   <div className="w5-selected-design"><div><span className="w5-tiny-label">CURRENTLY EXPLORING</span><h3>{collections.find(c=>c.id===active)?.name}</h3><p>{collections.find(c=>c.id===active)?.mood} The invitation preview is live: names and details will follow you into the Studio.</p><Link href={`/studio?design=${active}`}>Start with this design <ArrowUpRight size={17}/></Link></div><div className="w5-selected-preview"><InvitationV2 data={{...defaults,design:active}} compact interactive={false}/></div></div>
  </section>
  <section className="w5-experience" id="experience"><div className="w5-experience-media"><div className={expanded?"w5-envelope-experience is-open":"w5-envelope-experience"}><span>TO OUR DEAREST PEOPLE</span><h3>Amina <i>&</i> Yusuf</h3><p>{expanded?"THE GLASSHOUSE · LONDON · 12 JUNE 2027":"WE'D LOVE TO CELEBRATE WITH YOU"}</p><button onClick={()=>setExpanded(v=>!v)}>{expanded?"Close the reveal":"Tap to reveal"} <ArrowUpRight size={15}/></button></div></div><div className="w5-experience-copy"><span className="w5-tiny-label">MADE FOR THE MOMENT</span><h2>The first<br/><em>hello.</em></h2><p>Think beyond a static card. A gentle opening, meaningful details, and a guest experience that feels like a little part of your wedding.</p><ul><li><Check size={17}/> A beautiful opening moment</li><li><Check size={17}/> Event details and directions</li><li><Check size={17}/> A clear way to reply</li></ul><Link className="w5-quiet-link" href="/invite">Explore the guest view <ArrowUpRight size={17}/></Link></div></section>
  <section className="w5-how"><div className="w5-how-title"><span className="w5-tiny-label">YOUR INVITATION, YOUR WAY</span><h2>Easy to make.<br/><em>Lovely to receive.</em></h2></div><div className="w5-how-list"><div><span>01</span><strong>Find the right feeling.</strong><p>Browse curated designs and start with something that already looks beautiful.</p></div><div><span>02</span><strong>Make it your story.</strong><p>Names, date, venue, celebration, colours and a note from you.</p></div><div><span>03</span><strong>See it through their eyes.</strong><p>Preview the guest experience before real publishing becomes available.</p></div></div></section>
  <section className="w5-faq" id="questions"><div><span className="w5-tiny-label">THE PRACTICAL BITS</span><h2>Good to know.</h2></div><div><details><summary>Can I send my invitation right now?</summary><p>Not yet. Wedsent is in early development. The Studio works as a local preview; account-based publishing and live RSVPs are being built.</p></details><details><summary>Can I customise the design?</summary><p>Yes, the current preview supports names, date, ceremony, location, message and basic colour selection. More design, animation and music controls are planned.</p></details><details><summary>What about multiple wedding events?</summary><p>The product is designed for celebrations such as Nikah, Walima, Mehndi, ceremonies and receptions. Multi-event guest permissions and tracking are not live yet.</p></details><details><summary>How much will it cost?</summary><p>We intend to offer one straightforward price. The final fee and hosting terms will be confirmed before checkout opens.</p></details></div></section>
  <footer className="w5-footer"><div><span className="w5-tiny-label">IT ALL STARTS HERE</span><h2>Make it <em>yours.</em></h2><Link className="w5-cta" href="/studio">Explore the Studio <ArrowUpRight size={18}/></Link></div><div className="w5-footer-foot"><Link href="/" className="w5-wordmark">wedsent<span>✳</span></Link><small>© 2026 WEDSENT · EARLY ACCESS</small></div></footer>
 </main>
}
