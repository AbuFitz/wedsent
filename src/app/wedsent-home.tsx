"use client";

import {useState} from "react";
import Link from "next/link";
import {ArrowDown,ArrowLeft,ArrowRight,ArrowUpRight,Check,Menu,X} from "lucide-react";

const showcase = [
  {id:"poster",name:"Postmark",mood:"Graphic / warm",names:"Amina & Yusuf",date:"12 · 06 · 27"},
  {id:"paper",name:"The Vow",mood:"Quiet / editorial",names:"Noor & Adam",date:"18 · 09 · 27"},
  {id:"midnight",name:"After Dark",mood:"Cinematic / modern",names:"Leila & Sami",date:"02 · 10 · 27"},
] as const;

function DemoInvite({kind,names,date}:{kind:string;names:string;date:string}) {
  return <div className={`wd-demo-invite ${kind}`}>
    <div className="top"><span>THE WEDDING OF</span><span>W / 27</span></div>
    <div className="center"><span>TOGETHER WITH THEIR FAMILIES</span><h3>{names}</h3><p>YOU'RE INVITED TO CELEBRATE</p></div>
    <div className="bottom"><span>{date}</span><span>LONDON</span></div>
  </div>;
}

export default function Home(){
  const [active,setActive]=useState(1);
  const [menu,setMenu]=useState(false);
  const current=showcase[active];
  const cycle=(dir:number)=>setActive(v=>(v+dir+showcase.length)%showcase.length);

  return <main className="wd-site" id="top">
    <header className="wd-nav">
      <Link href="/" className="wd-wordmark">wedd<i>sent</i></Link>
      <nav className={menu?"is-open":""}>
        <div className="wd-nav-links">
          <a href="#designs">Designs</a><a href="#experience">Experience</a><a href="#how">How it works</a>
        </div>
      </nav>
      <div className="wd-nav-actions">
        <Link href="/studio" className="wd-nav-link">Studio</Link>
        <Link href="/studio" className="wd-btn-dark">Create yours <ArrowUpRight size={15}/></Link>
        <button className="wd-menu" onClick={()=>setMenu(!menu)} aria-label="Toggle menu">{menu?<X size={19}/>:<Menu size={19}/>}</button>
      </div>
    </header>

    <section className="wd-hero">
      <div className="wd-hero-copy">
        <div className="wd-kicker">Digital wedding invitations</div>
        <h1>An invitation<br/><em>worth opening.</em></h1>
        <p>Build a beautifully designed mobile invitation, send one link, and keep the details and replies in one place.</p>
        <div className="wd-hero-actions">
          <Link href="/studio" className="wd-btn-dark">Create your invitation <ArrowUpRight size={16}/></Link>
          <a href="#designs" className="wd-btn-outline">See the designs <ArrowDown size={16}/></a>
        </div>
        <div className="wd-hero-proof">
          <span>Made for phones first</span><span>Multi-event weddings</span><span>Household-aware RSVP</span>
        </div>
      </div>
      <div className="wd-hero-showcase" aria-label="Invitation design previews">
        <div className="wd-stack">
          {showcase.map(d=><div className="wd-stack-phone" key={d.id}><div className="wd-stack-screen"><DemoInvite kind={d.id} names={d.names} date={d.date}/></div></div>)}
        </div>
        <div className="wd-stack-caption"><span>Three directions. One product.</span><span>01—03</span></div>
      </div>
    </section>

    <div className="wd-strip"><div className="wd-strip-track">
      <span>Invitation design</span><b>×</b><span>Guest details</span><b>×</b><span>RSVP</span><b>×</b><span>Multiple events</span><b>×</b><span>Mobile first</span><b>×</b>
      <span>Invitation design</span><b>×</b><span>Guest details</span><b>×</b><span>RSVP</span><b>×</b><span>Multiple events</span><b>×</b><span>Mobile first</span><b>×</b>
    </div></div>

    <section className="wd-section wd-designs" id="designs">
      <div className="wd-section-head">
        <span className="wd-mono">01 / Designs</span>
        <h2>Start with a look.<br/><em>Not a blank page.</em></h2>
        <p>Each invitation has its own composition, typography and mood. Pick one, add your details, then make it yours.</p>
      </div>
      <div className="wd-design-layout">
        <div className="wd-design-index">
          {showcase.map((d,i)=><button key={d.id} className={`wd-design-tab ${active===i?"is-active":""}`} onClick={()=>setActive(i)}>
            <span className="wd-mono">0{i+1}</span><strong>{d.name}</strong><ArrowUpRight size={16}/><small>{d.mood}</small>
          </button>)}
          <p className="wd-design-index-note">These are live product directions, not stock wedding templates. The invitation system is still in early preview.</p>
        </div>
        <div className={`wd-design-stage is-${current.id}`}>
          <span className="wd-design-badge">{current.name} / live preview</span>
          <div className="wd-design-device"><DemoInvite kind={current.id} names={current.names} date={current.date}/></div>
          <div className="wd-design-controls"><button aria-label="Previous design" onClick={()=>cycle(-1)}><ArrowLeft size={17}/></button><button aria-label="Next design" onClick={()=>cycle(1)}><ArrowRight size={17}/></button></div>
        </div>
      </div>
      <Link href="/studio" className="wd-design-link">Use this as your starting point <ArrowUpRight size={16}/></Link>
    </section>

    <section className="wd-section wd-feature-story" id="experience">
      <div className="wd-section-head">
        <span className="wd-mono">02 / Experience</span>
        <h2>Beautiful outside.<br/><em>Useful underneath.</em></h2>
        <p>The invite should feel special to a guest without making the couple manage a spreadsheet in disguise.</p>
      </div>
      <div className="wd-feature-grid">
        <article className="wd-feature-block">
          <span className="wd-mono">Multiple events</span>
          <h3>One wedding can hold <em>more than one day.</em></h3>
          <p>Nikah, Walima, Mehndi, civil ceremony, reception — organise them as separate events without forcing the wedding into one template.</p>
          <div className="wd-event-card">
            <div className="wd-event-row"><span>FRI 11 JUN</span><strong>Nikah</strong><small>Family & close friends</small></div>
            <div className="wd-event-row"><span>SAT 12 JUN</span><strong>Walima</strong><small>All invited guests</small></div>
            <div className="wd-event-row"><span>SUN 13 JUN</span><strong>Brunch</strong><small>Optional</small></div>
          </div>
        </article>
        <article className="wd-feature-block">
          <span className="wd-mono">RSVP that understands people</span>
          <h3>Invite households.<br/><em>Track people.</em></h3>
          <p>A family link can still record who is actually coming, which event they can attend, plus-ones, children and notes.</p>
          <div className="wd-rsvp-card">
            <div className="wd-rsvp-card-head"><span>THE ADEN HOUSEHOLD</span><span>3 INVITED</span></div>
            {["Riyana Aden","Sahra Aden","Yusuf Aden"].map((name,i)=><div className="wd-rsvp-person" key={name}><div><strong>{name}</strong><small>{i===2?"Nikah only":"Nikah + Walima"}</small></div><div className="wd-rsvp-choice"><span className={i!==2?"active":""}>{i===2?"Awaiting":"Going"}</span></div></div>)}
          </div>
        </article>
      </div>
    </section>

    <section className="wd-section wd-process" id="how">
      <div className="wd-section-head">
        <span className="wd-mono">03 / How it works</span>
        <h2>Keep the setup<br/><em>small.</em></h2>
        <p>No twenty-screen onboarding flow. Start with the invitation, add what matters, create an account only when you want to keep going.</p>
      </div>
      <div className="wd-process-list">
        {[
          ["01","Choose a design","Start from a curated invitation direction rather than a generic page builder."],
          ["02","Add your day","Names, dates, venue, events and the details your guests actually need."],
          ["03","Make it yours","Adjust the approved palette, wording, imagery and motion without breaking the design."],
          ["04","Preview as a guest","Open the invitation exactly as someone receiving the link would."],
          ["05","Publish & share","Once publishing launches, keep the same invitation link even when details change."]
        ].map(([n,t,p])=><div className="wd-process-row" key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p><ArrowUpRight size={18}/></div>)}
      </div>
    </section>

    <section className="wd-section wd-mobile-first">
      <div className="wd-mobile-grid">
        <div className="wd-mobile-copy">
          <span className="wd-mono">04 / Where it gets opened</span>
          <h2>Designed for<br/><em>the message thread.</em></h2>
          <p>Most guests will meet your invitation from WhatsApp, SMS or email on a phone. Weddsent starts with that reality instead of shrinking a desktop wedding website down afterwards.</p>
          <Link href="/invite" className="wd-design-link">Open the guest preview <ArrowUpRight size={16}/></Link>
        </div>
        <div className="wd-message-stage">
          <div className="wd-message-bubble one">Amina & Yusuf sent an invitation ✨</div>
          <div className="wd-message-phone"><DemoInvite kind="paper" names="Amina & Yusuf" date="12 · 06 · 27"/></div>
          <div className="wd-message-bubble two">Tap to open →</div>
        </div>
      </div>
    </section>

    <section className="wd-final">
      <span className="wd-mono">Your invitation starts here</span>
      <h2>Make it<br/><em>yours.</em></h2>
      <Link href="/studio" className="wd-btn-dark">Create your invitation <ArrowUpRight size={17}/></Link>
      <p>Weddsent is currently an early product preview. Publishing, payments and live guest delivery are not yet enabled.</p>
    </section>

    <footer className="wd-footer">
      <span className="wd-wordmark">wedd<i>sent</i></span>
      <p>Digital wedding invitations, thoughtfully made.</p>
      <a href="#top">Back to top ↑</a>
    </footer>
  </main>
}
