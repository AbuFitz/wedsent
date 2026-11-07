"use client";
import {useState} from "react";
import Link from "next/link";
import {ArrowDownRight,ArrowUpRight,CalendarDays,MapPin} from "lucide-react";
import {InviteData,friendlyDate} from "@/lib/designs";
export function InvitationV2({data,interactive=true,compact=false}:{data:InviteData;interactive?:boolean;compact?:boolean}){
 const [opened,setOpened]=useState(false);
 const names=data.names.split(/\s*&\s*|\s+and\s+/i).map(s=>s.trim()).filter(Boolean);
 const first=names[0]||"Your names",second=names.slice(1).join(" & ")||"Your person";
 return <article className={`inv2 inv2-${data.design} ${compact?"inv2-compact":""}`} style={data.accent?{"--invite-custom":data.accent} as React.CSSProperties:undefined}>
 <div className="inv2-surface"><div className="inv2-top"><span>{data.design==="sway"?"AN INVITATION TO CELEBRATE":data.design==="noor"?"WITH JOY AND GRATITUDE":"YOU + ME + EVERYONE WE LOVE"}</span><span>✳</span></div>
 {data.design==="sway"&&<div className="inv2-sway-art"><span className="inv2-side">A LITTLE MOMENT / A BIG FEELING</span><div className="inv2-sway-names"><span>{first}</span><i>and</i><span>{second}</span></div><div className="inv2-sway-line"/><div className="inv2-sway-footer">{data.ceremony}<span>{friendlyDate(data.date)}</span></div></div>}
 {data.design==="noor"&&<div className="inv2-noor-art"><div className="inv2-noor-arch"><div className="inv2-noor-glyph">✳</div><small>IN THE NAME OF LOVE</small><div className="inv2-noor-names">{first}<em>&</em>{second}</div><p>{data.ceremony}</p></div><span className="inv2-noor-date">{friendlyDate(data.date)}</span></div>}
 {data.design==="afterglow"&&<div className="inv2-after-art"><span className="inv2-after-edition">THE LOVE EDITION / 001</span><div className="inv2-after-circle"/><div className="inv2-after-names"><span>{first}</span><em>&</em><span>{second}</span></div><span className="inv2-after-stamp">FOREVER<br/>LOOKS GOOD<br/>ON US ↗</span><p>{data.ceremony} · {friendlyDate(data.date)}</p></div>}
 <div className="inv2-base"><span>{data.venue||"Venue to follow"} · {data.city||"Location to follow"}</span>{interactive?<button onClick={()=>setOpened(v=>!v)} aria-expanded={opened}>{opened?"Close":"Open invite"} <ArrowDownRight size={16}/></button>:<span>THE DETAILS ↓</span>}</div></div>
 {opened&&<div className="inv2-details"><span className="inv2-detail-symbol">✳</span><h3>Here's to<br/><i>us.</i></h3><p>{data.message}</p><div className="inv2-detail-row"><CalendarDays size={18}/><span>{friendlyDate(data.date)}<small>{data.ceremony}</small></span></div><div className="inv2-detail-row"><MapPin size={18}/><span>{data.venue||"Venue to follow"}<small>{data.city}</small></span></div><Link href="/invite/rsvp" className="inv2-rsvp">Let us know <ArrowUpRight size={19}/></Link></div>}
 </article>
}
