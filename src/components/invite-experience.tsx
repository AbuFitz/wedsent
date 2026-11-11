"use client";
import {useState} from "react";
import Link from "next/link";
import {ArrowDown,ArrowRight,CalendarDays,MapPin} from "lucide-react";
import {type InviteData,friendlyDate} from "@/lib/designs";

const variants={
  sway:{kind:"poster"},
  noor:{kind:"paper"},
  afterglow:{kind:"midnight"}
} as const;

export function InviteExperience({data,embedded=false,preview=false}:{data:InviteData;embedded?:boolean;preview?:boolean}){
  const [open,setOpen]=useState(false);
  const kind=variants[data.design]?.kind??"paper";
  const names=data.names.trim()||"Your names";
  return <article className={`wd-invite wd-invite-${kind}`} style={data.accent?{"--wd-personal":data.accent} as React.CSSProperties:undefined}>
    <section className="wd-invite-cover">
      <div className="wd-invite-top"><span>THE WEDDING OF</span><span>W / 27</span></div>
      <div className="wd-invite-center"><span>TOGETHER WITH THEIR FAMILIES</span><h1>{names}</h1><p>INVITE YOU TO CELEBRATE</p></div>
      <div className="wd-invite-bottom"><span>{friendlyDate(data.date)}</span><button onClick={()=>setOpen(!open)} aria-expanded={open}>{open?"Close":"Open invitation"} <ArrowDown size={14}/></button></div>
    </section>
    {open&&<section className="wd-invite-details">
      <span className="wd-mono">You're invited</span>
      <h2>We'd love<br/><em>you there.</em></h2>
      <p className="wd-invite-message">{data.message||"We'd love you to celebrate with us."}</p>
      <div className="wd-detail-row"><CalendarDays size={18}/><div><strong>{data.ceremony||"The celebration"}</strong><span>{friendlyDate(data.date)}</span></div></div>
      <div className="wd-detail-row"><MapPin size={18}/><div><strong>{data.venue||"Venue to be confirmed"}</strong><span>{data.city||"Location to be confirmed"}</span></div></div>
      {!preview?<Link href="/invite/rsvp" className="wd-invite-rsvp">Reply to invitation <ArrowRight size={17}/></Link>:<p className="wd-preview-note">Design preview only. Guest responses are not live yet.</p>}
    </section>}
  </article>
}
