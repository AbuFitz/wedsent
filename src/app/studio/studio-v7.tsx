"use client";
import {Suspense,useEffect,useState} from "react";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
import {ArrowUpRight,Check,Eye} from "lucide-react";
import {InviteExperience} from "@/components/invite-experience";
import {type InviteData,type DesignId,defaults,designs} from "@/lib/designs";

const KEY="wedsent-preview-draft-v1";
const looks:{id:DesignId;name:string;kind:string;desc:string}[]=[
  {id:"sway",name:"Postmark",kind:"poster",desc:"Graphic / warm"},
  {id:"noor",name:"The Vow",kind:"paper",desc:"Quiet / editorial"},
  {id:"afterglow",name:"After Dark",kind:"midnight",desc:"Cinematic / modern"}
];

function Studio(){
  const params=useSearchParams();
  const [draft,setDraft]=useState<InviteData>(defaults);
  const [loaded,setLoaded]=useState(false);
  const [status,setStatus]=useState("Opening draft");
  const [mobilePreview,setMobilePreview]=useState(false);

  useEffect(()=>{try{
    const raw=localStorage.getItem(KEY);
    if(raw)setDraft({...defaults,...JSON.parse(raw)});
    else {
      const design=params.get("design");
      if(designs.some(d=>d.id===design))setDraft({...defaults,design:design as DesignId});
    }
  }catch{} setLoaded(true)},[params]);

  useEffect(()=>{if(!loaded)return;setStatus("Saving…");const timer=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(draft));setStatus("Saved on this device")}catch{setStatus("Unable to save")}},250);return()=>clearTimeout(timer)},[draft,loaded]);

  const set=(v:Partial<InviteData>)=>setDraft(d=>({...d,...v}));
  const current=looks.find(l=>l.id===draft.design)??looks[0];

  return <main className="wd-studio">
    <header className="wd-studio-top">
      <Link href="/" className="wd-studio-brand">weddsent <span>Studio</span></Link>
      <div className="wd-studio-status"><span><Check size={13}/> {status}</span><Link href="/invite" target="_blank">Guest preview <ArrowUpRight size={15}/></Link></div>
    </header>

    <div className="wd-studio-layout">
      <section className="wd-editor">
        <div className="wd-editor-intro"><span className="wd-mono">Your invitation</span><h1>Make it feel<br/><em>like yours.</em></h1><p>Edit the essentials here. The invitation updates beside you — no endless back-and-forth wizard.</p></div>

        <div className="wd-editor-section">
          <div className="wd-editor-section-title"><strong>Choose a design</strong><span>01</span></div>
          <div className="wd-look-grid">{looks.map(l=><button className={`wd-look ${draft.design===l.id?"is-active":""}`} key={l.id} onClick={()=>set({design:l.id,accent:""})}>
            <div className={`wd-look-art ${l.kind}`}><span>THE WEDDING OF</span><strong>A & Y</strong><small>12 · 06 · 27</small></div>
            <div className="wd-look-meta"><span><b>{l.name}</b><small>{l.desc}</small></span>{draft.design===l.id?<Check size={14}/>:null}</div>
          </button>)}</div>
        </div>

        <div className="wd-editor-section">
          <div className="wd-editor-section-title"><strong>The day</strong><span>02</span></div>
          <div className="wd-field-grid">
            <label className="wd-field full"><span>Couple's names</span><input value={draft.names} onChange={e=>set({names:e.target.value})} placeholder="Amina & Yusuf" maxLength={90}/></label>
            <label className="wd-field"><span>Date</span><input type="date" value={draft.date} onChange={e=>set({date:e.target.value})}/></label>
            <label className="wd-field"><span>Event title</span><input value={draft.ceremony} onChange={e=>set({ceremony:e.target.value})} maxLength={60}/></label>
            <label className="wd-field"><span>Venue</span><input value={draft.venue} onChange={e=>set({venue:e.target.value})} placeholder="Venue name" maxLength={90}/></label>
            <label className="wd-field"><span>City / location</span><input value={draft.city} onChange={e=>set({city:e.target.value})} placeholder="London, England" maxLength={90}/></label>
          </div>
          <p className="wd-helper">You can keep details simple now. Multi-event wedding setup is part of the wider product flow and is still being built.</p>
        </div>

        <div className="wd-editor-section">
          <div className="wd-editor-section-title"><strong>Occasion</strong><span>03</span></div>
          <div className="wd-occasion-row">{["Wedding","Nikah","Walima","Mehndi","Reception","Civil ceremony"].map(v=><button className={draft.ceremony===v?"is-active":""} onClick={()=>set({ceremony:v})} key={v}>{v}</button>)}</div>
        </div>

        <div className="wd-editor-section">
          <div className="wd-editor-section-title"><strong>Personalise</strong><span>04</span></div>
          <label className="wd-field full"><span>Message to your guests</span><textarea value={draft.message} onChange={e=>set({message:e.target.value})} maxLength={350}/></label>
          <div style={{marginTop:18}}><span style={{display:"block",fontSize:10,fontWeight:700,marginBottom:9}}>Colour accent</span><div className="wd-colours">{["","#181818","#2f49d0","#662b35","#377e69","#a77a55"].map((v,i)=><button key={i} className={draft.accent===v?"is-active":""} onClick={()=>set({accent:v})} style={{background:v||"linear-gradient(135deg,#eee 50%,#222 50%)"}} aria-label={v||"Original palette"}/>)}</div></div>
        </div>

        <div className="wd-editor-actions">
          <Link href="/invite" target="_blank" className="wd-btn-dark">Open guest preview <ArrowUpRight size={16}/></Link>
          <Link href="/invite/print" target="_blank" className="wd-btn-light">Print preview <ArrowUpRight size={16}/></Link>
        </div>
        <p className="wd-helper" style={{marginTop:16}}>Early preview: drafts are stored only in this browser. Accounts, publishing, payments and real responses are not live yet.</p>
      </section>

      <aside className={`wd-preview ${mobilePreview?"is-visible":""}`}>
        <div className="wd-preview-head"><span>Live invitation</span><span>{current.name}</span></div>
        <div className="wd-preview-stage"><div className="wd-preview-device"><InviteExperience data={draft} embedded preview/></div></div>
        <div className="wd-preview-foot"><span>Updates as you type</span><span>Mobile</span></div>
      </aside>
    </div>
    <button className="wd-mobile-preview-toggle" onClick={()=>setMobilePreview(!mobilePreview)}>{mobilePreview?"Back to editing":"View invitation"} <Eye size={17}/></button>
  </main>
}
export default function StudioV7(){return <Suspense fallback={<div className="wd-studio">Opening Studio…</div>}><Studio/></Suspense>}
