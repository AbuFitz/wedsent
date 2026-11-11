"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, RotateCcw } from "lucide-react";
import { Phone } from "@/components/phone";
import { Invitation } from "@/components/invitation/invitation";
import { sampleData, sampleEvents } from "@/components/gallery/samples";
import { specById, type DesignId } from "@/engine/registry";

const featured = [
  { id: "rosewood", tone: "rose", detail: "A wax-sealed envelope" },
  { id: "embossed", tone: "ivory", detail: "Blind-embossed flowers" },
  { id: "gilt", tone: "gilt", detail: "Black paper and gold foil" },
  { id: "nikah-etched", tone: "garden", detail: "A botanical engraving" },
  { id: "velvet", tone: "velvet", detail: "A velvet curtain reveal" },
] as const satisfies ReadonlyArray<{ id: DesignId; tone: string; detail: string }>;

export function HeroInvitation() {
  const spec = specById("rosewood");
  const [open, setOpen] = useState(false);
  return (
    <div className="ed-hero-product">
      <Phone label="Rosewood Letter example invitation">
        <Invitation data={sampleData(spec)} events={sampleEvents(spec)} open={open} onOpenChange={setOpen} />
      </Phone>
      {open && <button className="ed-replay" type="button" aria-label="Replay the opening" onClick={() => setOpen(false)}><RotateCcw size={16} /></button>}
    </div>
  );
}

export function InvitationStack() {
  const [active, setActive] = useState(0);
  const [start, setStart] = useState<number | null>(null);
  const move = (direction: number) => setActive((index) => (index + direction + featured.length) % featured.length);
  const current = featured[active];
  const currentSpec = specById(current.id);

  return (
    <div className="ed-stack" aria-roledescription="carousel" aria-label="Featured invitation designs">
      <div className="ed-stack-stage" data-tone={current.tone}
        onTouchStart={(event) => setStart(event.touches[0].clientX)}
        onTouchCancel={() => setStart(null)}
        onTouchEnd={(event) => {
          if (start === null) return;
          const delta = start - event.changedTouches[0].clientX;
          if (Math.abs(delta) > 45) move(delta > 0 ? 1 : -1);
          setStart(null);
        }}>
        {featured.map(({ id }, index) => {
          const spec = specById(id);
          const offset = (index - active + featured.length + 2) % featured.length - 2;
          return (
            <div key={id} className="ed-stack-phone" data-offset={offset}>
              <div inert aria-hidden="true"><Phone label={spec.name}><Invitation data={sampleData(spec)} still /></Phone></div>
              <Link className="ed-stack-hit" href={`/designs/${id}`} aria-label={`View ${spec.name}`} tabIndex={offset === 0 ? 0 : -1} aria-hidden={offset !== 0} />
            </div>
          );
        })}
        <button className="ed-stack-arrow ed-stack-arrow--left" onClick={() => move(-1)} type="button" aria-label="Previous design"><ArrowLeft size={19} /></button>
        <button className="ed-stack-arrow ed-stack-arrow--right" onClick={() => move(1)} type="button" aria-label="Next design"><ArrowRight size={19} /></button>
      </div>
      <div className="ed-stack-caption">
        <div aria-live="polite"><strong>{currentSpec.name}</strong><span>{current.detail}</span></div>
        <div className="ed-stack-dots" role="group" aria-label="Select a featured design">
          {featured.map(({ id }, index) => <button key={id} type="button" aria-label={specById(id).name} aria-pressed={active === index} onClick={() => setActive(index)} />)}
        </div>
        <Link className="ed-text-link" href={`/designs/${current.id}`}>View design <ArrowUpRight size={16} /></Link>
      </div>
    </div>
  );
}

const guests = ["Aisha", "Omar"] as const;
const events = [
  { title: "Nikah", date: "Sat, 12 June · 11:00 am" },
  { title: "Walima", date: "Sun, 13 June · 6:30 pm" },
] as const;
type Guest = (typeof guests)[number];
type Event = (typeof events)[number]["title"];
type Reply = "yes" | "no";

export function HouseholdExample() {
  const [guest, setGuest] = useState<Guest>("Aisha");
  const [replies, setReplies] = useState<Record<Guest, Partial<Record<Event, Reply>>>>({
    Aisha: { Nikah: "yes", Walima: "yes" }, Omar: { Nikah: "yes" },
  });
  return (
    <div className="ed-reply">
      <header><div><span>Invited household</span><h3>The Hassan family</h3></div><span className="ed-reply-sample">Example RSVP</span></header>
      <div className="ed-reply-guests" role="group" aria-label="Choose a guest">
        {guests.map((name) => <button key={name} type="button" aria-pressed={guest === name} onClick={() => setGuest(name)}>{name}</button>)}
      </div>
      {events.map(({ title, date }) => (
        <div key={title} className="ed-reply-event">
          <div><strong>{title}</strong><span>{date}</span></div>
          <div className="ed-reply-choices" role="group" aria-label={`${guest}'s reply for ${title}`}>
            {(["yes", "no"] as const).map((answer) => (
              <button key={answer} type="button" aria-pressed={replies[guest][title] === answer} onClick={() => setReplies((old) => ({ ...old, [guest]: { ...old[guest], [title]: answer } }))}>
                {answer === "yes" && <Check size={14} aria-hidden="true" />}{answer === "yes" ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>
      ))}
      <p className="ed-reply-note">Try a reply. This example doesn’t save your choices.</p>
    </div>
  );
}
