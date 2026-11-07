"use client";
import {useState} from "react";
import {InviteData,friendlyDate} from "@/lib/designs";
import {ArrowDown,ArrowUpRight,CalendarDays,MapPin,Volume2,VolumeX} from "lucide-react";
export function Invitation({data,interactive=true}:{data:InviteData;interactive?:boolean}){
 const [opened,setOpened]=useState(false);const [muted,setMuted]=useState(true);
 const parts=data.names.split(/\s*&\s*|\s+and\s+/i);const first=parts[0]||data.names;const second=parts[1]||"forever";
 return <article className={`invitation invitation--${data.design}`} style={data.accent?{"--invite-accent":data.accent} as React.CSSProperties:undefined}>
  <div className="invite-grain" aria-hidden="true"/>
  <div className="invite-top"><span>WEDSENT / {data.ceremony}</span><span>YOU'RE INVITED</span></div>
  <div className="invite-main"><div className="invite-ornament" aria-hidden="true">{data.design==="noor"?"✳":"✦"}</div><p className="invite-kicker">With love, we invite you to celebrate</p><h2><span>{first}</span><em>&</em><span>{second}</span></h2><p className="invite-date">{friendlyDate(data.date)}</p></div>
  <div className="invite-bottom"><div className="invite-rule"/><p>{data.venue}<br/>{data.city}</p>{interactive?<button className="invite-open" onClick={()=>setOpened(v=>!v)} aria-expanded={opened}>{opened?"Close details":"Open invitation"} {opened?<ArrowDown size={16}/>:<ArrowUpRight size={16}/>}</button>:<span>THE DETAILS ↓</span>}</div>
  {opened&&<div className="invite-details"><div className="detail-stars">✳ &nbsp; ✳ &nbsp; ✳</div><h3>We can’t wait<br/>to see you.</h3><p>{data.message}</p><div className="detail-card"><CalendarDays size={19}/><span>{friendlyDate(data.date)}<br/><small>{data.ceremony}</small></span></div><div className="detail-card"><MapPin size={19}/><span>{data.venue}<br/><small>{data.city}</small></span></div><a className="invite-rsvp" href="/invite/rsvp">RSVP to this moment <ArrowUpRight size={17}/></a><button className="sound-toggle" onClick={()=>setMuted(!muted)}>{muted?<VolumeX size={16}/>:<Volume2 size={16}/>} {muted?"Sound off":"Sound on"} <small>Music coming soon</small></button></div>}
 </article>
}
