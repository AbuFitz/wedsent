"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, Menu, X } from "lucide-react";
import { InvitationV2 } from "@/components/invitation-v2";
import { defaults, type DesignId } from "@/lib/designs";
import "./v3.css";
import "./v3-polish.css";

const looks: { id: DesignId; name: string; description: string }[] = [
  { id: "afterglow", name: "A little louder", description: "For the colour lovers and the dance-floor starters." },
  { id: "noor", name: "A beautiful tradition", description: "A quietly dramatic take on the details that mean something." },
  { id: "sway", name: "Less, but lovely", description: "Type, space, and two names that say everything." },
];

export default function HomeV3() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<DesignId>("afterglow");
  const active = looks.find((look) => look.id === selected)!;

  return <main className="ws3">
    <header className="ws3-nav">
      <Link href="/" className="ws3-brand">wed<span>sent</span><b>✳</b></Link>
      <nav className={menuOpen ? "ws3-links open" : "ws3-links"} aria-label="Main navigation">
        <a href="#collection" onClick={() => setMenuOpen(false)}>The collection</a>
        <a href="#experience" onClick={() => setMenuOpen(false)}>The experience</a>
        <a href="#details" onClick={() => setMenuOpen(false)}>Good to know</a>
      </nav>
      <Link href="/studio" className="ws3-nav-action">Make yours <ArrowUpRight size={18}/></Link>
      <button className="ws3-menu" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
    </header>

    <section className="ws3-hero">
      <div className="ws3-hero-art" aria-hidden="true"/>
      <div className="ws3-hero-meta"><span>NOT ANOTHER WEDDING WEBSITE</span><span>YOUR DAY, YOUR WAY.</span></div>
      <div className="ws3-hero-content">
        <p className="ws3-sup">For your people, and all your moments.</p>
        <h1>Love looks<br/><em>good</em> on you.</h1>
        <p className="ws3-hero-deck">Your wedding starts before the big day. Make the invitation a moment of its own.</p>
        <div className="ws3-hero-actions"><Link href="/studio" className="ws3-button">Make your invitation <ArrowUpRight size={18}/></Link><a href="#collection">Find your kind of beautiful <ArrowDownRight size={17}/></a></div>
      </div>
      <div className="ws3-hero-base"><span>DESIGNED TO BE OPENED, NOT JUST SEEN.</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>

    <section className="ws3-open-section" id="experience">
      <div className="ws3-open-intro"><span>01 / THE FIRST FEELING</span><span>GO ON, OPEN IT ↘</span></div>
      <div className="ws3-open-layout">
        <div className="ws3-open-copy"><p className="ws3-hand">a little something special</p><h2>Not just<br/>a <em>link.</em><br/>A feeling.</h2><p>A name on the front. A moment to open. Everything your guests need once they&apos;re inside.</p><button className="ws3-outline" onClick={() => setOpened(!opened)}>{opened ? "Close invitation" : "Open invitation"} <ArrowUpRight size={17}/></button><small>Try the invitation reveal. No account needed.</small></div>
        <div className="ws3-open-stage">
          <span className="ws3-asterisk" aria-hidden="true">✺</span>
          <div className={opened ? "ws3-envelope is-open" : "ws3-envelope"}>
            <button className="ws3-envelope-front" onClick={() => setOpened(!opened)} aria-expanded={opened}><small>TO OUR FAVOURITE PEOPLE</small><strong>Amina <i>&</i> Yusuf</strong><span>WE WOULD LOVE FOR YOU TO BE THERE</span><b className="ws3-seal">w ✳</b><small>12 JUNE 2027 · LONDON</small><span className="ws3-tap">TAP TO {opened ? "CLOSE" : "OPEN"} ↗</span></button>
            <div className="ws3-envelope-inside" aria-hidden={!opened}><small>TOGETHER WITH OUR FAMILIES</small><h3>Amina <i>&</i><br/>Yusuf</h3><p>invite you to celebrate their marriage</p><div className="ws3-date"><span>SATURDAY</span><b>12</b><span>JUNE 2027</span></div><p>The Glasshouse<br/>London, England</p><Link tabIndex={opened ? 0 : -1} href="/invite">Explore the guest view <ArrowRight size={15}/></Link></div>
          </div>
          <p className="ws3-stage-mark">A LITTLE REVEAL.<br/>A BIG DAY.</p>
        </div>
      </div>
    </section>

    <section className="ws3-collection" id="collection">
      <div className="ws3-collection-heading"><span>THE WEDSENT COLLECTION / VOL. 01</span><h2>Pick your<br/><em>kind of magic.</em></h2><p>One love story. So many ways to tell it. These are starting points, not boxes to fit into.</p></div>
      <div className="ws3-gallery">
        <div className="ws3-gallery-index"><span>CHOOSE A LOOK</span><span>AN INTERACTIVE LOOKBOOK ↙</span></div>
        <div className="ws3-gallery-tabs" role="group" aria-label="Choose invitation look">{looks.map((look, index) => <button key={look.id} className={selected === look.id ? "active" : ""} onClick={() => setSelected(look.id)}><small>0{index + 1}</small>{look.name}<ArrowUpRight size={17}/></button>)}</div>
        <div className={`ws3-gallery-scene scene-${selected}`}>
          <div className="ws3-gallery-art" aria-hidden="true"/>
          <div className="ws3-gallery-preview"><InvitationV2 data={{...defaults, design: selected}} compact interactive={false}/></div>
          <div className="ws3-gallery-description"><span>INVITATION STUDY / 0{looks.findIndex((l) => l.id === selected) + 1}</span><h3>{active.name}</h3><p>{active.description}</p><Link href={`/studio?design=${selected}`}>Make this yours <ArrowUpRight size={17}/></Link></div>
        </div>
        <p className="ws3-gallery-note">These are real interactive previews, not customer weddings. More fully art-directed designs are being developed.</p>
      </div>
    </section>

    <section className="ws3-real">
      <div className="ws3-real-art"><div><span>AMINA & YUSUF</span><b>12 <i>JUNE</i> 27</b><span>THE GLASSHOUSE · LONDON</span></div></div>
      <div className="ws3-real-copy"><span>BEAUTIFUL IS ONLY THE START</span><h2>The little<br/>things <em>matter.</em></h2><div className="ws3-real-points"><article><b>01</b><p><strong>Every celebration has its place.</strong> Nikah, Walima, Mehndi, reception or ceremony. Your wedding doesn&apos;t have to fit a template.</p></article><article><b>02</b><p><strong>Know who&apos;s coming.</strong> Guests, households, plus-ones and event-specific replies, all designed to be easier to manage.</p></article><article><b>03</b><p><strong>Plans change. Your invite can too.</strong> Dates, venues and helpful information belong in one place.</p></article></div><small>Guest management and live RSVPs are in development. We&apos;ll only call them live when they genuinely work.</small></div>
    </section>

    <section className="ws3-maker"><div className="ws3-maker-head"><span>THE MAKING OF A MOMENT</span><h2>All the personality.<br/><em>None of the fuss.</em></h2></div><div className="ws3-maker-main"><div className="ws3-maker-art"><div><small>YOUR INVITATION</small><strong>Your names.<br/>Your day.<br/><i>Your way.</i></strong><span>✳</span></div></div><div className="ws3-maker-copy"><p>Start with a look you love. Add the names, the celebrations, the place and the little details that make it yours. See it come to life as you go.</p><ul><li><Check size={17}/> Try a design before you commit</li><li><Check size={17}/> Change colours and written details</li><li><Check size={17}/> Preview the guest experience</li></ul><Link href="/studio" className="ws3-button">Try the Studio <ArrowUpRight size={18}/></Link><small>The Studio is an early browser-saved preview. Publishing is not available yet.</small></div></div></section>

    <section className="ws3-questions" id="details"><div><span>GOOD TO KNOW</span><h2>Clear answers.<br/><em>No surprises.</em></h2></div><div className="ws3-answers"><details><summary>Can I send a real invite yet?<b>+</b></summary><p>Not yet. The design editor is a working local preview. Accounts, live publishing and guest tracking are still being developed and tested.</p></details><details><summary>Is it just for one kind of wedding?<b>+</b></summary><p>No. You choose the events and wording that match your wedding, independently from the look you choose.</p></details><details><summary>What's the price?<b>+</b></summary><p>We are working toward one straightforward payment, with the amount and hosting terms clearly stated before checkout launches.</p></details><details><summary>Will guests need to sign up?<b>+</b></summary><p>The plan is account-free guest RSVPs using appropriate invitation links. Private access and RSVP correctness need full testing before launch.</p></details></div></section>

    <footer className="ws3-footer"><span>YOUR STORY STARTS HERE</span><h2>Send something<br/><em>worth opening.</em></h2><Link href="/studio">Make your invitation <ArrowUpRight size={20}/></Link><div><Link href="/" className="ws3-brand">wed<span>sent</span><b>✳</b></Link><small>MADE FOR THE MOMENT · © 2026 WEDSENT</small><a href="#">BACK TO TOP ↑</a></div></footer>
  </main>;
}
