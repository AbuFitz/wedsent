"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, MoveUpRight, Play } from "lucide-react";
import { Nav } from "./nav";
import { SiteFooter } from "./sections";
import { Phone } from "@/components/phone";
import { Invitation } from "@/components/invitation/invitation";
import { sampleData, sampleEvents } from "@/components/gallery/samples";
import { FEATURED_DESIGN_IDS, specById } from "@/engine/registry";
import "./home-reimagined.css";

const looks = FEATURED_DESIGN_IDS.map(specById);
const portrait = "/art/weddsent-editorial-hands-v2.webp";

function Device({ id, cover=false }:{id:string;cover?:boolean}){
  const spec=specById(id);
  return <Phone label={`${spec.name} digital invitation`}><Invitation data={sampleData(spec)} events={sampleEvents(spec)} open={!cover} still/></Phone>;
}

function Opening(){
  const [open,setOpen]=useState(false);
  return <section className="wr-hero">
    <div className="wr-hero-intro"><div className="wr-label"><span className="wr-dot"/> THE NEXT CHAPTER BEGINS HERE</div><h1>Make the first<br/>moment <em>matter.</em></h1><div className="wr-hero-intro-bottom"><p>Digital wedding invitations with the feeling of something you can hold. Beautiful to open. Effortless to share. Thoughtful down to the last reply.</p><Link className="wr-pill wr-dark" href="/start">Create your invitation <ArrowUpRight size={18}/></Link></div></div>
    <div className="wr-hero-image"><img src="/art/weddsent-editorial-table-v2.webp" alt="An intimate candlelit wedding table in a stone courtyard, with a couple holding hands"/><div className="wr-hero-image-note">THE INVITATION IS ONLY THE BEGINNING <span>↘</span></div><div className="wr-hero-device"><div className="wr-hero-device-caption"><span>01 / A LITTLE MOMENT</span><button type="button" onClick={()=>setOpen(v=>!v)}>{open?"Show the cover":"See it open"} <Play size={11}/></button></div><div className="wr-hero-phone"><Phone label="Pearl Garden invitation with opening preview"><Invitation data={sampleData(looks[0])} events={sampleEvents(looks[0])} open={open}/></Phone></div></div></div>
    <div className="wr-hero-tail"><span>A LOVE STORY, BEAUTIFULLY TOLD</span><span>DESIGNED FOR REAL LIFE, ON REAL PHONES.</span></div>
  </section>;
}

function Statement(){
  return <section className="wr-statement wr-pad"><div className="wr-section-index"><span>WHAT IS WEDDSENT?</span><span>01 / 05</span></div><div className="wr-statement-layout"><p className="wr-statement-mini">The wedding begins long before the wedding day. It begins with an invitation.</p><h2>Not just a link.<br/><em>An occasion.</em></h2></div><div className="wr-statement-end"><p>One considered place for the design, the details and the people you can&apos;t imagine celebrating without.</p><Link href="/designs">Discover the designs <ArrowUpRight size={18}/></Link></div></section>;
}

function DesignExhibition(){
  const [active,setActive]=useState(2);
  const [touch,setTouch]=useState<number|null>(null);
  const reduced=useReducedMotion();
  const move=(direction:number)=>setActive(i=>(i+direction+looks.length)%looks.length);
  const chosen=looks[active];
  return <section className="wr-designs wr-pad" id="collection"><div className="wr-section-index"><span>THE INVITATION COLLECTION</span><span>02 / 05</span></div>
    <div className="wr-designs-heading"><h2>Every story<br/>has its <em>style.</em></h2><p>Something classic. Something cinematic. Something entirely you. Explore the collection and find the one that feels right.</p></div>
    <div className="wr-phone-stage" role="region" aria-label="Browse invitation designs" aria-roledescription="carousel" tabIndex={0} onKeyDown={e=>{if(e.key==="ArrowRight"){e.preventDefault();move(1)}else if(e.key==="ArrowLeft"){e.preventDefault();move(-1)}}} onTouchStart={e=>setTouch(e.touches[0].clientX)} onTouchEnd={e=>{if(touch!==null){const delta=e.changedTouches[0].clientX-touch;if(Math.abs(delta)>50)move(delta<0?1:-1)}setTouch(null)}}>
      <div className="wr-stage-grid" aria-hidden="true"/>
      {looks.map((spec,i)=>{const d=i-active;const offset=d>looks.length/2?d-looks.length:d< -looks.length/2?d+looks.length:d;return <motion.div key={spec.id} className="wr-stage-item" data-current={offset===0} initial={false} animate={{x:`${offset*51}%`,scale:offset===0?1:Math.abs(offset)===1?.83:.67,rotate:offset*(reduced?0:7),opacity:Math.abs(offset)>2?.5:1}} transition={reduced?{duration:0}:{type:"spring",stiffness:160,damping:22}} style={{zIndex:10-Math.abs(offset)}}><Link href={`/designs/${spec.id}`} tabIndex={offset===0?0:-1} aria-label={`Explore ${spec.name}`}><Device id={spec.id}/></Link></motion.div>})}
      <div className="wr-stage-corner wr-stage-corner-top">CURATED BY WEDDSENT</div><div className="wr-stage-corner wr-stage-corner-bottom">SWIPE TO EXPLORE / TAP TO VIEW</div>
    </div>
    <div className="wr-designs-controls"><div className="wr-designs-arrows"><button type="button" onClick={()=>move(-1)} aria-label="Previous design"><ArrowLeft size={22}/></button><button type="button" onClick={()=>move(1)} aria-label="Next design"><ArrowRight size={22}/></button></div><div aria-live="polite" className="wr-designs-selected"><span>0{active+1} — 0{looks.length}</span><strong>{chosen.name}</strong><small>{chosen.family}</small></div><Link href={`/designs/${chosen.id}`} className="wr-pill wr-dark">Explore this design <ArrowUpRight size={17}/></Link></div>
    <div className="wr-designs-footer"><span>DIFFERENT DESIGNS. THE SAME THOUGHTFUL DETAILS.</span><Link href="/designs">See the full collection <MoveUpRight size={18}/></Link></div>
  </section>;
}

function Editorial(){
  return <section className="wr-editorial"><div className="wr-editorial-image"><img src={portrait} alt="A couple holding hands, dressed in ivory silk and black tailoring, with calla lilies"/><div className="wr-image-counter">THE HUMAN PART / 001</div></div><div className="wr-editorial-content"><span className="wr-eyebrow">MADE FOR THE WAY YOU CELEBRATE</span><h2>Every tradition.<br/>Every <em>little detail.</em></h2><p>A Nikah followed by a Walima. A ceremony and an evening celebration. One day, three days, or something entirely your own. Your invitation should make room for all of it.</p><div className="wr-event-lines"><div><span>01</span><strong>Nikah</strong><span>Saturday · 11:00</span></div><div><span>02</span><strong>Walima</strong><span>Sunday · 18:30</span></div><div><span>+</span><strong>Your celebration</strong><span>On your terms</span></div></div><Link href="/start" className="wr-text-link">Begin with your story <ArrowUpRight size={20}/></Link></div></section>;
}

function GuestExperience(){
  const [guest,setGuest]=useState("Amina");
  const [answers,setAnswers]=useState<Record<string,boolean>>({"Amina-Nikah":true,"Amina-Walima":true,"Yusuf-Nikah":true,"Yusuf-Walima":false});
  return <section className="wr-guest wr-pad"><div className="wr-section-index"><span>ONE INVITATION. EVERYONE ACCOUNTED FOR.</span><span>03 / 05</span></div><div className="wr-guest-intro"><h2>The beautiful part<br/>is how <em>simple</em> it feels.</h2><p>Guests get their own link, see the events that matter to them and respond without downloading an app. You get a clearer picture of who&apos;s coming.</p></div><div className="wr-guest-content"><div className="wr-guest-points"><div><span>01 / OPEN</span><h3>A personal hello</h3><p>Send an invitation made for each household, with the names and celebration details that belong to them.</p></div><div><span>02 / REPLY</span><h3>Each person, each event</h3><p>One family can reply separately for a Nikah, Walima or reception. No guessing from a single yes.</p></div><div><span>03 / KNOW</span><h3>Less chasing, more celebrating</h3><p>See responses organised by guest and event in your Studio.</p></div></div><div className="wr-reply-card"><header><span>WEDDSENT / GUEST PREVIEW</span><span>EXAMPLE ONLY</span></header><div className="wr-reply-monogram">A & Y</div><h3>We can&apos;t wait<br/>to celebrate with you.</h3><p>An invitation for the Hassan family</p><div className="wr-reply-switch" role="group" aria-label="Choose a guest">{["Amina","Yusuf"].map(g=><button type="button" key={g} aria-pressed={g===guest} onClick={()=>setGuest(g)}>{g}</button>)}</div>{["Nikah","Walima"].map((ev,i)=><div key={ev} className="wr-reply-event"><div><strong>{ev}</strong><small>{i===0?"Saturday 12 June · 11:00":"Sunday 13 June · 18:30"}</small></div><button type="button" aria-pressed={!!answers[`${guest}-${ev}`]} onClick={()=>setAnswers(a=>({...a,[`${guest}-${ev}`]:!a[`${guest}-${ev}`]}))}>{answers[`${guest}-${ev}`]?<><Check size={14}/> Attending</>:"Not attending"}</button></div>)}<footer>Try changing the replies above. This example isn&apos;t submitted or saved.</footer></div></div></section>;
}

function Steps(){
  const steps=[{n:"01",title:"Tell us the little things.",desc:"Your names, date and celebrations. Just enough to start imagining it.",image:"/art/weddsent-editorial-table-v2.webp"},{n:"02",title:"Find your kind of beautiful.",desc:"Choose a distinctive invitation, then make the words, colours and details yours.",image:"/art/weddsent-digital-hero.webp"},{n:"03",title:"Let the moment begin.",desc:"Continue into Studio, organise your guests and prepare personal invitation links.",image:"/art/weddsent-editorial-hands-v2.webp"}];
  return <section className="wr-steps wr-pad"><div className="wr-section-index"><span>FROM YOUR FIRST IDEA TO THEIR FIRST OPEN</span><span>04 / 05</span></div><h2>It starts with <em>you.</em></h2><div className="wr-steps-grid">{steps.map(s=><Link href="/start" key={s.n} className="wr-step"><div className="wr-step-image"><img src={s.image} alt=""/><span>{s.n} / 03</span></div><div className="wr-step-bottom"><h3>{s.title}</h3><ArrowUpRight size={23}/></div><p>{s.desc}</p></Link>)}</div></section>;
}

const questions=[
  ["Do our guests need to download anything?","No. They can open their invitation from a link on their phone without downloading an app or creating an account."],
  ["Can we invite different guests to different events?","Yes. Your invitation can include multiple events, with guest-specific access and separate replies for each person and event."],
  ["Can we send it by WhatsApp?","You can copy your invitation link and share it yourself through WhatsApp, text or email. Automated sending is not available yet."],
  ["Is it really one payment?","That is the intended model, with a provisional £39 price per wedding. Checkout is not live and the final price and hosting term have not yet been confirmed."],
  ["Can we try a design before paying?","Yes. You can browse the designs and begin creating a draft. There is no live payment checkout at present."]
];
function Closing(){
  return <><section className="wr-questions wr-pad"><div className="wr-section-index"><span>A FEW THINGS TO KNOW</span><span>05 / 05</span></div><div className="wr-questions-layout"><h2>Good questions,<br/><em>honest answers.</em></h2><div>{questions.map(([q,a])=><details key={q}><summary>{q}<ChevronDown size={20}/></summary><p>{a}</p></details>)}</div></div></section><section className="wr-closing"><div className="wr-closing-art"><img src="/art/weddsent-editorial-table-v2.webp" alt="A softly illuminated wedding courtyard"/></div><div className="wr-closing-copy"><span>THE NEXT CHAPTER STARTS HERE</span><h2>Something beautiful<br/>is about to <em>begin.</em></h2><Link href="/start" className="wr-pill wr-light">Create your invitation <ArrowUpRight size={18}/></Link></div></section></>;
}

export function HomeReimagined(){
  return <><Nav/><main className="wr"><Opening/><Statement/><DesignExhibition/><Editorial/><GuestExperience/><Steps/><Closing/></main><SiteFooter/></>;
}
