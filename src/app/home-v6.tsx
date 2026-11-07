"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { InvitationV2 } from "@/components/invitation-v2";
import { defaults, designs, type DesignId } from "@/lib/designs";

const work = [
  { id: "noor" as DesignId, number: "01", kind: "THE MODERN EDIT", title: "Nadia & Adam", description: "Sculptural type. Electric blue. A dramatic first impression.", sample: "Nadia & Adam" },
  { id: "afterglow" as DesignId, number: "02", kind: "THE ARTIST EDIT", title: "Aisha + Sami", description: "Expressive marks and an unapologetically joyful palette.", sample: "Aisha & Sami" },
  { id: "sway" as DesignId, number: "03", kind: "THE CINEMATIC EDIT", title: "Maya & Leo", description: "An intimate, monochrome invitation that feels like a film.", sample: "Maya & Leo" },
];

function Phone({ design, compact = false }: { design: DesignId; compact?: boolean }) {
  const selected = work.find((item) => item.id === design)!;
  return <div className={`w6-phone ${compact ? "w6-phone-small" : ""}`}>
    <div className="w6-phone-screen"><InvitationV2 data={{ ...defaults, names: selected.sample, design }} compact={compact} /></div>
  </div>;
}

export default function HomeV6() {
  const [active, setActive] = useState<DesignId>("noor");
  const [menu, setMenu] = useState(false);
  const chosen = work.find((item) => item.id === active)!;
  return <main className="w6-site">
    <header className="w6-header"><Link href="/" className="w6-mark">wedsent<span>®</span></Link>
      <nav className={menu ? "w6-nav is-open" : "w6-nav"} aria-label="Primary navigation"><a href="#collection" onClick={() => setMenu(false)}>Collection</a><a href="#the-experience" onClick={() => setMenu(false)}>The experience</a><a href="#how" onClick={() => setMenu(false)}>How it works</a></nav>
      <Link className="w6-header-cta" href="/studio">Create an invite <ArrowUpRight size={16}/></Link><button className="w6-menu" aria-label="Toggle menu" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
    </header>

    <section className="w6-hero" aria-labelledby="w6-hero-title">
      <div className="w6-hero-type"><p className="w6-caption">WEDSENT / DIGITAL WEDDING INVITATIONS</p><h1 id="w6-hero-title">Make an<br/><i>entrance.</i></h1><p className="w6-hero-line">Invitations they won’t just open.<br/>Invitations they’ll remember.</p><div className="w6-hero-actions"><Link href="/studio" className="w6-primary">Make yours <ArrowUpRight size={18}/></Link><a href="#collection" className="w6-text-link">Explore the collection <ArrowDown size={17}/></a></div><span className="w6-stage-note">STUDIO PREVIEW OPEN · PUBLISHING COMING SOON</span></div>
      <div className="w6-hero-stage"><div className="w6-stage-note w6-stage-label">FEATURED / 01 — THE MODERN EDIT</div><div className="w6-hero-phone"><Phone design="noor"/></div><div className="w6-stage-side">01 / 03 <span>SCROLL TO DISCOVER</span></div></div>
    </section>

    <section className="w6-collection" id="collection"><div className="w6-section-heading"><div><span className="w6-caption">01 / THE COLLECTION</span><h2>Not one kind<br/>of <i>love story.</i></h2></div><p>Different moods. Different entrances. Designed to feel like your celebration, not everyone else’s.</p></div>
      <div className="w6-showcase" aria-label="Explore invitation collection"><div className="w6-showcase-tabs">{work.map((item) => <button type="button" className={active === item.id ? "is-active" : ""} key={item.id} onClick={() => setActive(item.id)} aria-pressed={active === item.id}><span>{item.number} / {item.kind}</span><strong>{item.title}</strong><ArrowUpRight size={20}/></button>)}</div><div className={`w6-showcase-canvas w6-canvas-${active}`} key={active}><div className="w6-showcase-phone"><Phone design={active}/></div><span className="w6-canvas-serial">WEDSENT COLLECTION — {chosen.number}</span></div></div>
      <div className="w6-showcase-footer"><p><strong>{chosen.title}</strong><span>{chosen.description}</span></p><Link href={`/studio?design=${active}`} className="w6-text-link">Make this yours <ArrowUpRight size={18}/></Link></div>
      <div className="w6-mini-gallery">{work.filter(item => item.id !== active).map(item => <button key={item.id} type="button" onClick={() => setActive(item.id)}><div className={`w6-mini-art w6-canvas-${item.id}`}><Phone design={item.id} compact/></div><span>{item.kind}<ArrowUpRight size={16}/></span><strong>{item.title}</strong></button>)}</div>
    </section>

    <section className="w6-experience" id="the-experience"><div className="w6-experience-copy"><span className="w6-caption">02 / THE EXPERIENCE</span><h2>A first look.<br/><i>Then the whole story.</i></h2><p>The invitation is only the beginning. Open it, discover the details and reply, all from the phone already in your hand.</p><Link href="/invite" className="w6-outline">Try the guest experience <ArrowUpRight size={18}/></Link></div><div className="w6-experience-stage"><div className="w6-experience-label">TAP TO OPEN THE INVITATION</div><Phone design="sway"/></div></section>

    <section className="w6-process" id="how"><div className="w6-process-head"><span className="w6-caption">03 / THE MAKING OF YOUR INVITE</span><h2>Yours, in a<br/><i>few good moves.</i></h2></div><div className="w6-process-list"><div><span>01</span><h3>Find your design.</h3><p>Start with a complete invitation that already has its own personality.</p></div><div><span>02</span><h3>Tell your story.</h3><p>Add the names, date and details. See every change as it happens.</p></div><div><span>03</span><h3>See it on their phone.</h3><p>Open a guest preview and refine it before publishing becomes available.</p></div></div></section>

    <section className="w6-final"><span>THE GOOD PART STARTS HERE</span><h2>Ready to make<br/><i>an entrance?</i></h2><Link href="/studio">Create your invitation <ArrowUpRight size={21}/></Link></section>
    <footer className="w6-footer"><Link href="/" className="w6-mark">wedsent<span>®</span></Link><span>MADE FOR THE MOMENT. © 2026</span><span>EARLY PRODUCT PREVIEW</span></footer>
  </main>;
}
