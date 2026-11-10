"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ArrowRight, Plus, Minus, Check } from "lucide-react";
import { Nav } from "./nav";
import { SiteFooter } from "./sections";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { sampleData, sampleEvents } from "@/components/gallery/samples";
import { specById } from "@/engine/registry";
import "./home-stux.css";

export function Home(){
  return <><Nav/><main className="sx">
    <Hero/><Introduction/><Projects/><WhatWeDo/><FeatureFilm/><Manifesto/><Process/><Questions/><FinalCall/>
  </main><SiteFooter/></>;
}
function Hero(){
  return <section className="sx-hero">
    {/* eslint-disable-next-line @next/next/no-img-element */}<img src="/art/weddsent-courtyard-stux.webp" alt="Illuminated stone wedding courtyard with a reflecting pool at dusk" width={1700} height={950}/>
    <div className="sx-hero-block" aria-hidden="true"/>
    <div className="sx-hero-main"><span>THE EXPERIENCE STARTS BEFORE THE DAY</span><h1>WEDDING<br/>INVITATIONS</h1><p>MADE TO BE OPENED</p></div>
    <div className="sx-hero-bottom"><span>ONE WEDDING / EVERY MOMENT</span><span>SCROLL TO EXPLORE ↓</span></div>
  </section>;
}
function SectionHeading({n,label,title,href,action}:{n:string;label:string;title:string;href?:string;action?:string}){
  return <div className="sx-section-heading"><div className="sx-section-number"><span>{n}</span><span>{label}</span></div><div className="sx-section-title"><h2>{title}</h2>{href&&<Link href={href} className="sx-outline-button">{action??"EXPLORE"}<ArrowUpRight size={22}/></Link>}</div></div>;
}
const features=[["01","DESIGNED FOR YOUR DAY"],["02","YOUR OWN PRIVATE LINKS"],["03","REPLIES BY PERSON & EVENT"],["04","NO GUEST ACCOUNT NEEDED"]];
function Introduction(){
  return <section className="sx-intro sx-container">
    <SectionHeading n="01" label="THE IDEA" title="AN INVITATION SHOULD FEEL AS GOOD AS THE WEDDING." href="/start" action="START YOURS"/>
    <div className="sx-intro-facts">{features.map(([n,t])=><div key={n}><strong>{t}</strong><span>({n})</span></div>)}</div>
    <div className="sx-intro-essay"><p>REAL WEDDINGS ARE PERSONAL. SO ARE THE INVITATIONS. CREATE SOMETHING BEAUTIFULLY YOURS, THEN MAKE EVERY GUEST FEEL PART OF THE MOMENT.</p><div className="sx-image-stack">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/art/weddsent-hands.webp" width={850} height={1062} alt="Wedding couple holding hands" />{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/art/weddsent-veil.webp" width={1000} height={1500} alt="Wedding portrait beneath a flowing veil"/></div><span>MADE FOR EVERY KIND OF CELEBRATION.</span></div>
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
    <SectionHeading n="02" label="THE COLLECTION" title="NOT TEMPLATES. DISTINCTIVE CREATIVE WORLDS." href="/designs" action="ALL DESIGNS"/>
    <div className="sx-project-grid">{projects.map((p,i)=><Link href={`/designs/${p.id}`} className="sx-project" key={p.id}>
      <div className="sx-project-background" style={{backgroundImage:`url("${p.image}")`}}/>
      <div className="sx-project-object">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={p.image} alt={`${p.name} creative mood`} width={1000} height={1200}/><div><strong>{p.name}</strong><span>{p.where}</span></div></div>
      <span className="sx-project-category">{p.category}</span><span className="sx-project-index">0{i+1} / 04</span><span className="sx-project-arrow"><ArrowUpRight size={21}/></span>
    </Link>)}</div>
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
    <SectionHeading n="03" label="THE EXPERIENCE" title="EVERY DETAIL, BEAUTIFULLY CONSIDERED."/>
    <div className="sx-services-list">{services.map((s,i)=><button className="sx-service" data-active={active===i} key={s.name} type="button" aria-expanded={active===i} onClick={()=>setActive(i)}><span className="sx-service-heading"><small>0{i+1}</small><strong>{s.name}</strong><span>{active===i?<Minus size={22}/>:<Plus size={22}/>}</span></span><AnimatePresence initial={false}>{active===i&&<motion.div className="sx-service-inside" initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.35}}><p>{s.body}</p><img src={s.image} alt="" width={500} height={650}/></motion.div>}</AnimatePresence></button>)}</div>
  </section>;
}
function FeatureFilm(){
  return <section className="sx-feature-film"><img src="/art/weddsent-pavilion-stux.webp" alt="Modern architectural wedding reception pavilion by the lake at blue hour" width={1100} height={1400}/><div className="sx-film-overlay"/><div className="sx-feature-top"><span>FEATURED EXPERIENCE</span><span>WEDDSENT / 2026</span></div><div className="sx-feature-center"><h2>THE MOMENT<br/>IS YOURS.</h2><p>MAKE THE FIRST IMPRESSION FEEL LIKE THE REST OF YOUR DAY.</p></div><div className="sx-feature-bottom"><span>PERSONAL BY DESIGN</span><span>MADE FOR MOBILE</span></div></section>;
}
function Manifesto(){
  return <section className="sx-manifesto"><p>“DESIGN ISN'T JUST HOW IT LOOKS. IT'S THE FEELING SOMEONE GETS WHEN THEY OPEN IT.”</p><span>THE WEDDSENT APPROACH</span><div className="sx-manifesto-images"><img src="/art/weddsent-watercolour.webp" alt="Watercolour wedding portrait" width={1100} height={825}/><img src="/art/weddsent-evening.webp" alt="Evening celebration" width={1500} height={1000}/></div></section>;
}
function Process(){
  const steps=[{n:"/01",title:"TELL YOUR STORY",detail:"Add your names, dates and the events that make your celebration yours.",img:"/art/weddsent-veil.webp"},{n:"/02",title:"MAKE IT YOURS",detail:"Choose a design and shape its lettering, colour and opening.",img:"/art/weddsent-digital-hero.webp"},{n:"/03",title:"INVITE YOUR PEOPLE",detail:"Continue into Studio to organise the details and guest links.",img:"/art/weddsent-handheld.webp"}];
  return <section className="sx-process sx-container"><SectionHeading n="04" label="THE PROCESS" title="FROM FIRST IDEA TO FIRST IMPRESSION."/><div className="sx-process-grid">{steps.map(s=><Link href="/start" className="sx-process-card" key={s.n}><strong>{s.n}</strong><img src={s.img} alt="" width={800} height={900}/><div><span>{s.detail}</span><b>{s.title}</b></div></Link>)}</div></section>;
}
const faqs=[
  ["DO GUESTS NEED AN ACCOUNT?","No. Guests open their own link on a phone and reply without creating an account."],
  ["CAN I INVITE DIFFERENT PEOPLE TO DIFFERENT EVENTS?","Yes. Households and individual guests can be assigned to specific events, so each sees the relevant celebration details."],
  ["CAN I SEND IT THROUGH WHATSAPP?","You can copy each invitation link and send it through WhatsApp, text or email. Automatic sending isn't live yet."],
  ["HOW MUCH DOES IT COST?","Our proposed one-time wedding price is £39, but it's provisional. Checkout isn't active yet."],
  ["CAN I CHANGE IT LATER?","You can adjust the design and event details in Studio. Draft and published states remain separate."]
];
function Questions(){
  return <section className="sx-faq sx-container"><SectionHeading n="05" label="FAQ" title="CURIOUS? WE'VE GOT THE ANSWERS."/><div className="sx-questions">{faqs.map(([q,a])=><details key={q}><summary>{q}<Plus size={21}/></summary><p>{a}</p></details>)}</div></section>;
}
function FinalCall(){
  return <section className="sx-final"><div><span>HAVE SOMETHING IN MIND?</span><h2>LET'S MAKE<br/>IT <i>MEMORABLE.</i></h2></div><Link href="/start">CREATE YOUR INVITATION <ArrowUpRight size={25}/></Link><p>START WITH YOUR NAMES. THE REST WILL FOLLOW.</p></section>;
}
