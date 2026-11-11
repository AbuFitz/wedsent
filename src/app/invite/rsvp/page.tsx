"use client";
import {useState} from "react";
import Link from "next/link";
import {ArrowLeft,ArrowRight,Check} from "lucide-react";

export default function Rsvp(){
  const [answer,setAnswer]=useState<"yes"|"no"|null>(null);
  const [name,setName]=useState("");
  const [done,setDone]=useState(false);
  return <main className="wd-rsvp">
    <header className="wd-rsvp-top"><Link href="/invite"><ArrowLeft size={16}/> Back to invitation</Link><span>WEDDSENT / GUEST RESPONSE</span></header>
    <div className="wd-rsvp-shell">
      <div className="wd-rsvp-intro"><span className="wd-mono">The RSVP</span><h1>Will you<br/><em>be there?</em></h1><p>A short response, no account required. In the finished product, each invited person can reply to the events they were actually invited to.</p><div className="wd-rsvp-note">DEMO MODE · THIS RESPONSE IS NOT SENT OR SAVED TO A SERVER</div></div>
      <section className="wd-rsvp-panel">
        <div className="wd-rsvp-form">
          {done?<div className="wd-rsvp-complete"><div className="wd-rsvp-check"><Check size={26}/></div><h2>Thank you, {name.trim()}.</h2><p>{answer==="yes"?"You've previewed an attending response.":"You've previewed a decline response."} The couple has not received anything because this is still demo mode.</p><button onClick={()=>setDone(false)}>Change response <ArrowRight size={16}/></button></div>:
          <form onSubmit={e=>{e.preventDefault();if(answer&&name.trim())setDone(true)}}>
            <label htmlFor="guest-name">Your name</label>
            <input id="guest-name" value={name} onChange={e=>setName(e.target.value)} required maxLength={80} placeholder="Enter your full name"/>
            <fieldset><legend>Can you attend?</legend><div className="wd-rsvp-answer">
              <button type="button" className={answer==="yes"?"is-active":""} onClick={()=>setAnswer("yes")}><span>Joyfully accepts</span>{answer==="yes"?<Check size={17}/>:null}</button>
              <button type="button" className={answer==="no"?"is-active":""} onClick={()=>setAnswer("no")}><span>Regretfully declines</span>{answer==="no"?<Check size={17}/>:null}</button>
            </div></fieldset>
            <button className="wd-rsvp-submit" disabled={!answer||!name.trim()} type="submit">Preview response <ArrowRight size={17}/></button>
          </form>}
        </div>
      </section>
    </div>
  </main>
}
