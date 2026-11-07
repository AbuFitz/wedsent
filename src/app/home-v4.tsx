"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronRight, Menu, Users, X } from "lucide-react";
import { InvitationV2 } from "@/components/invitation-v2";
import { defaults, designs, type DesignId } from "@/lib/designs";
import "./v4.css";
import "./v4-polish.css";

export default function HomeV4() {
  const [selected, setSelected] = useState<DesignId>("noor");
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const active = designs.find((d) => d.id === selected)!;
  return <main className="w4">
    <header className="w4-nav"><Link href="/" className="w4-logo">wedsent<span>.</span></Link><nav className={menu ? "w4-menu open" : "w4-menu"}><a href="#designs" onClick={() => setMenu(false)}>Designs</a><a href="#how-it-works" onClick={() => setMenu(false)}>How it works</a><a href="#features" onClick={() => setMenu(false)}>What&apos;s included</a></nav><div className="w4-nav-right"><Link className="w4-nav-link" href="/studio">Open Studio</Link><Link className="w4-nav-cta" href="/studio">Create an invite <ArrowUpRight size={16}/></Link></div><button className="w4-menu-toggle" onClick={() => setMenu(!menu)} aria-label={menu ? "Close menu" : "Open menu"}>{menu ? <X/> : <Menu/>}</button></header>

    <section className="w4-hero" aria-label="Wedding invitation maker">
      <div className="w4-hero-text"><span className="w4-status"><i/> WEDSENT EARLY ACCESS</span><h1>Wedding invites,<br/><em>beautifully</em> done.</h1><p>Make something your guests will love opening. Choose a design, make it yours, and bring the details of your big day together.</p><div className="w4-hero-buttons"><Link href="/studio" className="w4-primary">Create your invitation <ArrowUpRight size={18}/></Link><a href="#designs" className="w4-secondary">Explore designs <ArrowDown size={17}/></a></div><div className="w4-hero-note"><span><Check size={15}/> Personalise your design</span><span><Check size={15}/> Preview as a guest</span></div></div>
      <div className="w4-product-stage" aria-label="Examples of Wedsent invitation designs"><div className="w4-stage-aura"/>
        <div className="w4-preview-card w4-preview-left"><InvitationV2 data={{...defaults,design:"afterglow"}} compact interactive={false}/></div>
        <div className="w4-preview-card w4-preview-right"><InvitationV2 data={{...defaults,design:"sway"}} compact interactive={false}/></div>
        <div className="w4-preview-card w4-preview-front"><InvitationV2 data={{...defaults,design:"noor"}} compact interactive={false}/></div>
        <span className="w4-stage-caption">THREE STARTING POINTS. YOUR STORY.</span>
      </div>
    </section>

    <section className="w4-design-section" id="designs"><div className="w4-section-heading"><div><span className="w4-eyebrow">01 / THE DESIGNS</span><h2>Find your look.</h2><p>Different moods, different stories. Start somewhere beautiful and put your own stamp on it.</p></div><Link href="/studio">Start designing <ArrowUpRight size={17}/></Link></div>
      <div className="w4-design-browser"><div className="w4-design-options">{designs.map((d,idx)=><button className={selected===d.id?"active":""} key={d.id} onClick={()=>setSelected(d.id)}><span>0{idx+1}</span><div><strong>{d.name}</strong><small>{d.description}</small></div><ChevronRight size={18}/></button>)}</div><div className={`w4-design-display w4-display-${selected}`}><div className="w4-design-device"><InvitationV2 data={{...defaults,design:selected}} compact interactive={false}/></div><div className="w4-design-display-foot"><span>{active.name} · {active.palette}</span><Link href={`/studio?design=${selected}`}>Use this design <ArrowUpRight size={17}/></Link></div></div></div>
      <p className="w4-gallery-disclaimer">This is the current preview collection. We&apos;re developing more fully customisable designs before launch.</p>
    </section>

    <section className="w4-open-section" id="how-it-works"><div className="w4-open-title"><span className="w4-eyebrow">02 / FOR YOUR GUESTS</span><h2>A lovely first<br/>impression.</h2><p>Every invitation has a story. Try opening this one.</p><button onClick={()=>setOpen(!open)}>{open?"Back to the cover":"Open the invitation"} <ArrowRight size={17}/></button></div><div className="w4-guest-scene"><div className="w4-guest-label">GUEST VIEW · EXAMPLE</div><div className={open?"w4-open-card is-open":"w4-open-card"}><div className="w4-open-cover"><small>YOU&apos;RE INVITED</small><h3>Amina <i>&</i> Yusuf</h3><p>12 June 2027 · London</p><span>Tap “Open the invitation” to see inside</span></div><div className="w4-open-details"><span>TOGETHER WITH THEIR FAMILIES</span><h3>Amina & Yusuf</h3><p>Joyfully invite you to celebrate their marriage.</p><div><CalendarDays size={17}/> Saturday, 12 June 2027</div><div>The Glasshouse · London, England</div><Link href="/invite">See full guest example <ArrowUpRight size={15}/></Link></div></div></div></section>

    <section className="w4-features" id="features"><div className="w4-features-title"><span className="w4-eyebrow">03 / MORE THAN THE DESIGN</span><h2>The day has enough<br/>moving parts.</h2><p>Wedsent is being built to make the invitation side feel easier, from your first draft to the final reply.</p></div><div className="w4-feature-rows"><div><div className="w4-feature-icon"><CalendarDays size={27}/></div><div><h3>Every celebration, one place.</h3><p>Nikah, Walima, Mehndi, ceremony, reception. Add the moments that matter to you.</p></div><span>EVENTS</span></div><div><div className="w4-feature-icon"><Users size={27}/></div><div><h3>Actually know who&apos;s coming.</h3><p>Guest-specific invitations, households, plus-ones and event-by-event replies are planned for launch.</p></div><span>GUESTS</span></div><div><div className="w4-feature-icon"><ArrowUpRight size={27}/></div><div><h3>Share something worth opening.</h3><p>A personalised link for your people, with the details they need and a phone-first guest experience.</p></div><span>SHARING</span></div></div><p className="w4-feature-note">Live invitations, guest management and publishing are not available yet. The current Studio is an interactive browser-saved preview.</p></section>

    <section className="w4-final"><div><span>READY TO EXPLORE?</span><h2>Start with a design.<br/>Make it <i>yours.</i></h2><p>No payment or account required to try the current editor.</p><Link href="/studio">Explore the Studio <ArrowUpRight size={18}/></Link></div><div className="w4-final-art"><div className="w4-final-invite"><InvitationV2 data={{...defaults,design:"sway"}} compact interactive={false}/></div></div></section>
    <footer className="w4-footer"><Link href="/" className="w4-logo">wedsent<span>.</span></Link><span>AN INVITE WORTH OPENING.</span><small>© 2026 WEDSENT · EARLY ACCESS</small></footer>
  </main>;
}
