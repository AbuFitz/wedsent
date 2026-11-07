"use client";
import {useState} from "react";
import Link from "next/link";
import {ArrowDown, ArrowRight, CalendarDays, MapPin, Volume2, VolumeX} from "lucide-react";
import {type InviteData, friendlyDate} from "@/lib/designs";

const variants = {
  noor: {label:"FRAME",category:"Contemporary",kind:"frame"},
  sway: {label:"LINE",category:"Essential",kind:"line"},
  afterglow: {label:"MUSE",category:"Expressive",kind:"muse"}
} as const;

export function InviteExperience({data,embedded=false,preview=false}:{data:InviteData;embedded?:boolean;preview?:boolean}){
 const [open,setOpen]=useState(false);
 const [audio,setAudio]=useState(false);
 const style=variants[data.design]||variants.sway;
 const displayNames=data.names.trim()||"Your names";
 return <article className={`w7-invite w7-invite-${style.kind} ${embedded?"w7-invite-embedded":""}`} style={data.accent?{"--w7-personal":data.accent} as React.CSSProperties:undefined}>
   <div className="w7-invite-cover">
     <header className="w7-invite-top"><span>THE WEDDING OF</span><span className="w7-invite-index">W / 001</span></header>
     {style.kind==="frame"?<div className="w7-frame-shape" aria-hidden="true"><span/><span/><span/></div>:null}
     {style.kind==="muse"?<div className="w7-muse-shapes" aria-hidden="true"><span/><span/></div>:null}
     <div className="w7-invite-center"><span className="w7-invite-prelude">TOGETHER WITH THEIR FAMILIES</span><h1>{displayNames}</h1><p>INVITE YOU TO CELEBRATE</p></div>
     <footer className="w7-invite-bottom"><span>{friendlyDate(data.date)}</span><button type="button" onClick={()=>setOpen(!open)} aria-expanded={open}>{open?"Close details":"Open invitation"} <ArrowDown size={16}/></button></footer>
   </div>
   {open&&<section className="w7-invite-information"><p className="w7-small-kicker">YOU'RE INVITED</p><h2>We can't wait<br/>to see you.</h2><p className="w7-invite-message">{data.message||"We'd love you to celebrate with us."}</p><div className="w7-info-line"><CalendarDays size={19}/><div><strong>{data.ceremony||"The celebration"}</strong><span>{friendlyDate(data.date)}</span></div></div><div className="w7-info-line"><MapPin size={19}/><div><strong>{data.venue||"Venue to be confirmed"}</strong><span>{data.city||"Location to be confirmed"}</span></div></div>{!preview&&<Link href="/invite/rsvp" className="w7-invite-response">Reply to invitation <ArrowRight size={19}/></Link>}{preview&&<p className="w7-preview-note">This is a design preview. Guest replies aren't live yet.</p>}</section>}
 </article>
}
