"use client";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ArrowLeft, ArrowRight, Plus, Minus, Check } from "lucide-react";
import { Nav } from "./nav";
import { SiteFooter } from "./sections";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { sampleData, sampleEvents } from "@/components/gallery/samples";
import { specById, FEATURED_DESIGN_IDS } from "@/engine/registry";
import "./home-stux.css";

export function Home(){
  return <><Nav/><main className="sx">
    <Hero/><Introduction/><Projects/><InvitationLive/><WhatWeDo/><FeatureFilm/><GuestDemo/><Process/><Questions/><FinalCall/>
  </main><SiteFooter/></>;
}
function Hero(){
  return <section className="sx-hero">
    {/* eslint-disable-next-line @next/next/no-img-element */}<img src="/art/weddsent-courtyard-stux.webp" alt="Illuminated stone wedding courtyard with a reflecting pool at dusk" width={1700} height={950}/>
    <div className="sx-hero-block" aria-hidden="true"/>
    <div className="sx-hero-main"><span>NOT ANOTHER WEDDING WEBSITE</span><h1>WEDDING<br/>INVITATIONS</h1><p>THAT FEEL LIKE AN OCCASION.</p></div>
    <div className="sx-hero-bottom"><span>DESIGN / INVITE / REPLY</span><span>SCROLL TO EXPLORE ↓</span></div>
  </section>;
}
function SectionHeading({n,label,title,href,action}:{n:string;label:string;title:string;href?:string;action?:string}){
  return <div className="sx-section-heading"><div className="sx-section-number"><span>{n}</span><span>{label}</span></div><div className="sx-section-title"><h2>{title}</h2>{href&&<Link href={href} className="sx-outline-button">{action??"EXPLORE"}<ArrowUpRight size={22}/></Link>}</div></div>;
}
const features=[["01","AN OPENING WORTH WAITING FOR"],["02","A LINK FOR EACH HOUSEHOLD"],["03","ONE REPLY PER PERSON, PER EVENT"],["04","NO GUEST APP. NO GUEST LOGIN."]];
function Introduction(){
  return <section className="sx-intro sx-container">
    <SectionHeading n="01" label="THE IDEA" title="THE FIRST IMPRESSION OF YOUR WEDDING ISN'T THE VENUE. IT'S THE INVITE." href="/start" action="MAKE YOURS"/>
    <div className="sx-intro-facts">{features.map(([n,t])=><div key={n}><strong>{t}</strong><span>({n})</span></div>)}</div>
    <div className="sx-intro-essay"><p>THE WAY IT OPENS. THE WORDS YOU CHOOSE. THE EVENTS ONLY YOUR GUESTS CAN SEE. THIS IS WHERE THE CELEBRATION BEGINS.</p><div className="sx-image-stack">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/art/weddsent-hands.webp" width={850} height={1062} alt="Wedding couple holding hands" />{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/art/weddsent-veil.webp" width={1000} height={1500} alt="Wedding portrait beneath a flowing veil"/></div><span>MADE FOR EVERY KIND OF CELEBRATION.</span></div>
    <figure className="sx-intro-image">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/art/weddsent-digital-hero.webp" alt="Digital wedding invitation displayed on a realistic smartphone" width={1300} height={866}/><figcaption>DESIGNED ON THE SCREEN. FELT IN THE MOMENT.</figcaption></figure>
  </section>;
}
const projects=[
  {name:"THE PEARL GARDEN",where:"Soft florals, modern romance",category:"BOTANICAL",image:"/art/weddsent-veil.webp",id:"pearl"},
  {name:"SCULPTED IVORY",where:"Quiet, architectural elegance",category:"MINIMAL",image:"/art/weddsent-digital-hero.webp",id:"embossed"},
  {name:"GILDED NIGHT",where:"A cinematic first impression",category:"DARK EDITORIAL",image:"/art/weddsent-pavilion-stux.webp",id:"gilt"},
  {name:"ROSEWOOD LETTER",where:"An invitation to remember",category:"CLASSIC",image:"/art/weddsent-watercolour.webp",id:"rosewood"}
];
function Projects(){
  return <section className="sx-projects sx-container" id="designs">
    <SectionHeading n="02" label="THE COLLECTION" title="FIND THE INVITATION THAT FEELS LIKE THE TWO OF YOU." href="/designs" action="VIEW ALL DESIGNS"/>
    <div className="sx-project-grid">{projects.map((p,i)=><Link href={`/designs/${p.id}`} className="sx-project" key={p.id}>
      <div className="sx-project-background" style={{backgroundImage:`url("${p.image}")`}}/>
      <div className="sx-project-object">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={p.image} alt={`${p.name} creative mood`} width={1000} height={1200}/><div><strong>{p.name}</strong><span>{p.where}</span></div></div>
      <span className="sx-project-category">{p.category}</span><span className="sx-project-index">0{i+1} / 04</span><span className="sx-project-arrow"><ArrowUpRight size={21}/></span>
    </Link>)}</div>
  </section>;
}
const stackDesigns=FEATURED_DESIGN_IDS.slice(0,5).map(id=>specById(id));
function InvitationLive(){
  const [active,setActive]=useState(2);
  const selected=stackDesigns[active];
  const shift=(step:number)=>setActive(i=>(i+step+stackDesigns.length)%stackDesigns.length);
  const [touchStart,setTouchStart]=useState<number|null>(null);
  return <section className="sx-live" id="invitation-carousel" aria-label="Explore Weddsent invitation designs">
    <div className="sx-container sx-live-inner">
      <SectionHeading n="03" label="ON THE SCREEN" title="FIVE DIFFERENT WAYS TO MAKE AN ENTRANCE." href="/designs" action="EXPLORE THE COLLECTION"/>
      <p className="sx-live-lead">NOT MOCKUPS OF WHAT COULD BE. REAL WEDDSENT INVITATIONS, READY TO OPEN, PERSONALISE AND SEND.</p>
      <div className="sx-stack-stage" tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Invitation previews" onKeyDown={e=>{if(e.key==="ArrowRight"){e.preventDefault();shift(1);}if(e.key==="ArrowLeft"){e.preventDefault();shift(-1);}}} onTouchStart={e=>setTouchStart(e.touches[0].clientX)} onTouchEnd={e=>{if(touchStart===null)return;const delta=e.changedTouches[0].clientX-touchStart;if(Math.abs(delta)>45)shift(delta<0?1:-1);setTouchStart(null);}}>
        {stackDesigns.map((spec,index)=>{
          const raw=index-active;
          const offset=raw>2?raw-stackDesigns.length:raw< -2?raw+stackDesigns.length:raw;
          return <motion.div key={spec.id} className="sx-stack-slot" data-center={offset===0} style={{"--slot-offset":offset} as CSSProperties} animate={{rotate:offset*7,scale:offset===0?1:Math.abs(offset)===1?.83:.7,opacity:Math.abs(offset)===2?.73:1}} transition={{type:"spring",stiffness:180,damping:24}}>
            <Link className="sx-stack-link" href={`/designs/${spec.id}`} aria-label={`View ${spec.name} design`} tabIndex={offset===0?0:-1}>
              <Phone label={`${spec.name} invitation preview`}><Invitation data={sampleData(spec)} events={sampleEvents(spec)} open still/></Phone>
            </Link>
          </motion.div>;
        })}
        <div className="sx-stack-caption">CHOOSE AN INVITATION. MAKE IT YOURS.</div>
      </div>
      <div className="sx-stack-controls">
        <div className="sx-stack-buttons"><button type="button" onClick={()=>shift(-1)} aria-label="Previous invitation"><ArrowLeft size={22}/></button><button type="button" onClick={()=>shift(1)} aria-label="Next invitation"><ArrowRight size={22}/></button></div>
        <div className="sx-stack-current" aria-live="polite"><span>0{active+1} / 0{stackDesigns.length}</span><strong>{selected.name}</strong><small>{selected.family}</small></div>
        <Link className="sx-stack-view" href={`/designs/${selected.id}`}>VIEW THIS DESIGN <ArrowUpRight size={21}/></Link>
      </div>
      <div className="sx-stack-pagination" aria-label="Choose a preview">{stackDesigns.map((spec,i)=><button type="button" key={spec.id} className={i===active?"is-active":""} aria-label={`Show ${spec.name}`} aria-pressed={i===active} onClick={()=>setActive(i)}/>)}</div>
    </div>
  </section>;
}
const services=[
  {name:"THE DESIGN",body:"Choose from distinct invitation worlds, each crafted with its own lettering, compositions, palettes and opening.",image:"/art/weddsent-watercolour.webp"},
  {name:"THE EXPERIENCE",body:"A personal opening gesture turns the first tap into a little moment, right on the guest's phone.",image:"/art/weddsent-handheld.webp"},
  {name:"THE GUESTS",body:"One private link per household. Multiple celebrations, named guests and replies that make sense.",image:"/art/weddsent-hands.webp"},
  {name:"THE DETAILS",body:"Times, locations, directions and calendar information remain together in one invitation.",image:"/art/weddsent-digital-hero.webp"}
];
function WhatWeDo(){
  const [active,setActive]=useState(0);
  return <section className="sx-services sx-container">
    <SectionHeading n="04" label="THE EXPERIENCE" title="THE LITTLE DETAILS THAT MAKE IT PERSONAL."/>
    <div className="sx-services-list">{services.map((s,i)=><button className="sx-service" data-active={active===i} key={s.name} type="button" aria-expanded={active===i} onClick={()=>setActive(i)}><span className="sx-service-heading"><small>0{i+1}</small><strong>{s.name}</strong><span>{active===i?<Minus size={22}/>:<Plus size={22}/>}</span></span><AnimatePresence initial={false}>{active===i&&<motion.div className="sx-service-inside" initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.35}}><p>{s.body}</p><img src={s.image} alt="" width={500} height={650}/></motion.div>}</AnimatePresence></button>)}</div>
  </section>;
}
function FeatureFilm(){
  return <section className="sx-feature-film"><img src="/art/weddsent-pavilion-stux.webp" alt="Modern architectural wedding reception pavilion by the lake at blue hour" width={1100} height={1400}/><div className="sx-film-overlay"/><div className="sx-feature-top"><span>ONE STORY. MANY TRADITIONS.</span><span>WEDDSENT / CELEBRATIONS</span></div><div className="sx-feature-center"><h2>ONE DAY.<br/>OR THREE.</h2><p>NIKAH. WALIMA. MEHNDI. CEREMONY. RECEPTION. YOU DECIDE WHAT BELONGS.</p></div><div className="sx-feature-bottom"><span>EVENTS AS INDIVIDUAL AS YOUR CELEBRATION</span><span>ONE BEAUTIFUL INVITATION</span></div></section>;
}
function GuestDemo(){
  const guests=["AISHA","OMAR"] as const;
  const [guest,setGuest]=useState<(typeof guests)[number]>("AISHA");
  const [responses,setResponses]=useState<Record<string,boolean>>({"AISHA-NIKAH":true,"AISHA-WALIMA":true,"OMAR-NIKAH":true,"OMAR-WALIMA":false});
  const events=["NIKAH","WALIMA"] as const;
  return <section className="sx-guest"><div className="sx-container sx-guest-wrap">
    <div className="sx-guest-copy"><SectionHeading n="05" label="THE REPLY" title="TWO EVENTS. TWO GUESTS. NO SPREADSHEET CHAOS."/><p>A single household invitation can have several named guests and different events. Each guest responds for themselves. You see who&apos;s attending what — without chasing a group chat.</p><span className="sx-guest-note">INTERACTIVE EXAMPLE · NO ANSWERS ARE SAVED</span></div>
    <div className="sx-rsvp-example"><div className="sx-rsvp-header"><span>AN INVITATION FOR</span><h3>THE HASSAN FAMILY</h3><small>GUEST REPLY / EXAMPLE</small></div><div className="sx-rsvp-tabs" role="group" aria-label="Select guest">{guests.map(g=><button key={g} type="button" aria-pressed={guest===g} data-active={guest===g} onClick={()=>setGuest(g)}>{g}</button>)}</div><p className="sx-rsvp-prompt">WILL {guest} BE JOINING US?</p>{events.map(event=><div className="sx-rsvp-event" key={event}><span>{event}<small>{event==="NIKAH"?"12 JUNE / 11:00":"13 JUNE / 18:30"}</small></span><button type="button" aria-pressed={Boolean(responses[`${guest}-${event}`])} onClick={()=>setResponses(old=>({...old,[`${guest}-${event}`]:!old[`${guest}-${event}`]}))}>{responses[`${guest}-${event}`]?<><Check size={15}/> ATTENDING</>:"NOT ATTENDING"}</button></div>)}<div className="sx-rsvp-foot"><span>NO APP TO DOWNLOAD</span><span>NO ACCOUNT NEEDED</span></div></div>
  </div></section>;
}
function Process(){
  const steps=[{n:"/01",title:"TELL YOUR STORY",detail:"Add your names, dates and the events that make your celebration yours.",img:"/art/weddsent-veil.webp"},{n:"/02",title:"MAKE IT YOURS",detail:"Choose a design and shape its lettering, colour and opening.",img:"/art/weddsent-digital-hero.webp"},{n:"/03",title:"INVITE YOUR PEOPLE",detail:"Continue into Studio to organise the details and guest links.",img:"/art/weddsent-handheld.webp"}];
  return <section className="sx-process sx-container"><SectionHeading n="06" label="HOW IT WORKS" title="THE INVITE TAKES SHAPE BEFORE THE GUEST LIST DOES."/><div className="sx-process-grid">{steps.map(s=><Link href="/start" className="sx-process-card" key={s.n}><strong>{s.n}</strong><img src={s.img} alt="" width={800} height={900}/><div><span>{s.detail}</span><b>{s.title}</b></div></Link>)}</div></section>;
}
const faqs=[
  ["DO GUESTS NEED AN ACCOUNT?","No. Guests open their own link on a phone and reply without creating an account."],
  ["CAN I INVITE DIFFERENT PEOPLE TO DIFFERENT EVENTS?","Yes. Households and individual guests can be assigned to specific events, so each sees the relevant celebration details."],
  ["CAN I SEND IT THROUGH WHATSAPP?","You can copy each invitation link and send it through WhatsApp, text or email. Automatic sending isn't live yet."],
  ["HOW MUCH DOES IT COST?","Our proposed one-time wedding price is £39, but it's provisional. Checkout isn't active yet."],
  ["CAN I CHANGE IT LATER?","You can adjust the design and event details in Studio. Draft and published states remain separate."]
];
function Questions(){
  return <section className="sx-faq sx-container"><SectionHeading n="07" label="THE DETAILS" title="GOOD QUESTIONS. STRAIGHT ANSWERS."/><div className="sx-questions">{faqs.map(([q,a])=><details key={q}><summary>{q}<Plus size={21}/></summary><p>{a}</p></details>)}</div></section>;
}
function FinalCall(){
  return <section className="sx-final"><div><span>IT STARTS WITH AN INVITATION.</span><h2>YOUR STORY.<br/>THEIR <i>FIRST LOOK.</i></h2></div><Link href="/start">CREATE YOUR INVITATION <ArrowUpRight size={25}/></Link><p>START WITH YOUR NAMES. THE REST WILL FOLLOW.</p></section>;
}
