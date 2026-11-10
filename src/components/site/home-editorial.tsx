"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronRight, Heart } from "lucide-react";
import { Nav } from "./nav";
import { SiteFooter } from "./sections";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { sampleData, sampleEvents } from "@/components/gallery/samples";
import { FEATURED_DESIGNS, specById } from "@/engine/registry";
import "./home-editorial.css";

export function Home() {
  return <><Nav /><main className="ed">
    <Opening /><Manifesto /><InvitationExperience /><Collection /><Personal /><Guests /><Making /><Finale />
  </main><SiteFooter /></>;
}

function Opening() {
  return <section className="ed-opening" aria-labelledby="ed-title">
    <div className="ed-overline"><span>THE WEDDING BEGINS HERE</span><span>AN INVITATION, REIMAGINED</span></div>
    <motion.h1 id="ed-title" initial={{opacity:0,y:35}} animate={{opacity:1,y:0}} transition={{duration:.9}}>Make the<br/><em>first</em> moment<br/>unforgettable<span className="ed-dot">.</span></motion.h1>
    <div className="ed-opening-aside"><span className="ed-asterisk">✳</span><p>Beautifully designed digital wedding invitations that feel as extraordinary as the day itself.</p><Link href="/start" className="ed-circle" aria-label="Create your invitation"><ArrowUpRight size={28}/></Link></div>
    <div className="ed-film">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/art/weddsent-evening.webp" alt="Candlelit wedding celebration in a stone courtyard at twilight" width={1500} height={1000} />
      <span className="ed-film-top">CELEBRATIONS ARE MADE OF MOMENTS.</span><span className="ed-film-bottom">LET THE FIRST ONE BE BEAUTIFUL.</span>
    </div>
    <div className="ed-film-foot"><span>LESS ORDINARY. MORE YOU.</span><Link href="/designs">Discover the collection <ArrowDownRight size={18}/></Link></div>
  </section>;
}

function Manifesto() {
  return <section className="ed-manifesto">
    <div><span className="ed-label">A NEW KIND OF INVITATION</span><h2>It isn't a link.<br/>It's <em>the feeling</em><br/>before the day.</h2></div>
    <div className="ed-manifesto-copy"><p>The anticipation. The little details. That first glimpse of what's to come. Weddsent turns your invitation into a moment your guests can experience, wherever they are.</p><Link className="ed-underline" href="/start">Make your entrance <ArrowUpRight size={18}/></Link></div>
  </section>;
}

function InvitationExperience() {
  const [opened,setOpened] = useState(false);
  const design = specById("botanica");
  return <section className="ed-experience">
    <div className="ed-section-head"><div><span className="ed-label">01 / THE EXPERIENCE</span><h2>Don't just see it.<br/><em>Open it.</em></h2></div><p>Every design has a different way of welcoming your guests. This is a working example. Give it a tap.</p></div>
    <div className="ed-experience-stage">
      <div className="ed-stage-words"><span className="ed-label">NOT A STATIC CARD</span><h3>A little<br/>magic at<br/>first touch.</h3><span className="ed-stage-arrow">↗</span><p>What arrives is an invitation. What opens is an experience.</p></div>
      <div className="ed-stage-phone"><Phone label="Interactive invitation"><Invitation key={opened?"opened":"closed"} data={sampleData(design)} events={sampleEvents(design)} greeting="Sara & family" open={opened?true:undefined} onOpenChange={setOpened} rsvpHref="/designs/botanica"/></Phone><button type="button" onClick={()=>setOpened(false)}>Replay the opening <ArrowRight size={15}/></button></div>
      <figure className="ed-stage-photo">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/art/weddsent-handheld.webp" alt="Digital wedding invitation on a phone in beautiful natural light" width={900} height={1200} loading="lazy"/><figcaption>BEAUTY, RIGHT IN THEIR HANDS.</figcaption></figure>
    </div>
  </section>;
}

const showcased = FEATURED_DESIGNS.slice(0,4);
function Collection() {
  return <section id="designs" className="ed-collection">
    <div className="ed-section-head"><div><span className="ed-label">02 / THE COLLECTION</span><h2>A design for<br/>your kind of <em>love.</em></h2></div><Link className="ed-button" href="/designs">Explore all designs <ArrowUpRight size={19}/></Link></div>
    <div className="ed-collection-grid">{showcased.map((d,i)=><Link href={`/designs/${d.id}`} key={d.id} className="ed-design">
      <div className={`ed-design-field field-${i}`}><div className="ed-design-sheet" style={{background:d.palettes[0]?.bg??"#f3f0e9",color:"#292621"}}><small>THE WEDDING OF</small><strong>{["Amina & Yusuf","Sofia & Elias","Noor & Adam","Isla & James"][i]}</strong><span>{i===0?"TOGETHER WITH THEIR FAMILIES":"JUNE · TWO THOUSAND TWENTY SEVEN"}</span><b>{["❦","✳","✦","✧"][i]}</b></div></div>
      <div className="ed-design-foot"><div><strong>{d.name}</strong><span>{d.styles.slice(0,2).join(" / ")}</span></div><ArrowUpRight size={22}/></div>
    </Link>)}</div>
    <div className="ed-collection-outro"><p>Not just different colours. A different world to step into.</p><Link href="/designs">The entire collection <ArrowRight size={18}/></Link></div>
  </section>;
}

function Personal() {
  return <section className="ed-personal">
    <figure className="ed-personal-photo">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/art/weddsent-hands.webp" alt="Close-up of two people holding hands beside white wedding flowers; their faces are outside the frame" width={1024} height={1536} loading="lazy"/><figcaption>THE LITTLE THINGS ARE EVERYTHING.</figcaption></figure>
    <div className="ed-personal-copy"><span className="ed-label">03 / MAKE IT PERSONAL</span><h2>It should feel<br/>like <em>the two</em><br/>of you.</h2><p>Start with a design you love. Add your names, your words, your moments. Whether it's an intimate ceremony or a whole weekend of celebrations, it should feel unmistakably yours.</p><figure className="ed-personal-drawing">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/art/weddsent-watercolour.webp" alt="Watercolour illustration of a couple holding hands outside their wedding venue" width={1448} height={1086} loading="lazy"/><figcaption>AN INVITATION WITH A STORY TO TELL.</figcaption></figure></div>
  </section>;
}

function Guests() {
  const [guest,setGuest]=useState<"Sara"|"Omar">("Sara");
  const [answers,setAnswers]=useState<Record<string,boolean>>({Nikah:true,Walima:true});
  return <section className="ed-guests">
    <header className="ed-guests-heading"><span className="ed-label">04 / THOUGHTFULLY SIMPLE</span><h2>The beautiful part<br/>is only the <em>beginning.</em></h2><p>The invitation makes the first impression. The details, guest list and replies work quietly behind it.</p></header>
    <div className="ed-guest-showcase">
      <div className="ed-guest-intro"><span>ONE WEDDING. MANY MOMENTS.</span><h3>Two celebrations.<br/>One thoughtful<br/>invitation.</h3><p>Different households can be invited to different events. Each guest sees what matters to them and replies without an account.</p><b>W<small>✳</small></b></div>
      <div className="ed-guest-demo"><div className="ed-demo-head"><span>EXAMPLE GUEST VIEW</span><Heart size={15}/></div><p className="ed-demo-intro">Amina & Yusuf invite you</p><h4>Will you join us?</h4><div className="ed-demo-tabs">{(["Sara","Omar"] as const).map(n=><button type="button" key={n} className={guest===n?"active":""} onClick={()=>setGuest(n)}>{n}</button>)}</div><p className="ed-demo-for">Replying for {guest}</p>{[{id:"Nikah",date:"Friday · 18 June"},{id:"Walima",date:"Saturday · 19 June"}].map(e=><div className="ed-demo-row" key={e.id}><div><strong>The {e.id}</strong><span>{e.date}</span></div><button type="button" aria-pressed={answers[e.id]} onClick={()=>setAnswers(v=>({...v,[e.id]:!v[e.id]}))}>{answers[e.id]?<><Check size={13}/> Going</>:"Can't go"}</button></div>)}<div className="ed-demo-note"><span>Interactive illustration. Nothing is submitted.</span><span>♡</span></div></div>
    </div>
    <div className="ed-three"><article><span>01</span><h3>One link per household.</h3><p>A personal invitation, sent however you like.</p></article><article><span>02</span><h3>Every event accounted for.</h3><p>Nikah, Walima, ceremony, reception — your day, your way.</p></article><article><span>03</span><h3>Replies with real names.</h3><p>Know who's coming, not just how many links were opened.</p></article></div>
  </section>;
}

function Making() {
  return <section className="ed-making"><div className="ed-making-copy"><span className="ed-label">05 / THE FUN PART</span><h2>Made with<br/>your heart.<br/><em>Not your whole<br/>weekend.</em></h2><p>Tell us who's celebrating. Choose a look that feels right. Add the moments that matter. See your invitation take shape as you go.</p><Link href="/start" className="ed-button">Create your invitation <ArrowUpRight size={19}/></Link></div><div className="ed-making-visual"><div>{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/art/weddsent-digital-hero.webp" alt="A realistic iPhone with a digital wedding invitation placed over fine ivory stationery" width={1300} height={866} loading="lazy"/></div><p><span>GOOD DESIGN IS PERSONAL.</span><em>Yours starts here.</em></p></div></section>;
}

function Finale() {
  return <section className="ed-finale"><span className="ed-label">YOUR STORY, BEAUTIFULLY TOLD.</span><h2>Something worth<br/><em>opening.</em></h2><div><Link href="/start">Begin your invitation <ArrowUpRight size={22}/></Link><Link href="/pricing">See how pricing works <ChevronRight size={18}/></Link></div><p>A one-time price per wedding is planned. Checkout isn't live yet.</p></section>;
}
