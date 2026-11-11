"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, CalendarCheck, House, MusicNotes, Printer, Translate, UsersThree } from "@phosphor-icons/react";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { sampleData, sampleEvents } from "@/components/gallery/samples";
import { specById, type DesignId } from "@/engine/registry";
import { Nav, SiteFooter } from "./nav";

/** One real invitation that opens, rests, and closes again until you touch it. */
function HeroInvitation() {
  const spec = specById("pearl");
  const [open, setOpen] = useState(false);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setOpen((v) => !v), open ? 9000 : 3600);
    return () => window.clearInterval(id);
  }, [auto, open]);
  const data = { ...sampleData(spec), message: "We would be honoured to celebrate with you.", countdown: { enabled: true, style: "type" as const, accent: "", label: "" } };
  return (
    <div className="ws-hero-stage">
      <div className="ws-hero-phone">
        <Phone label="Example invitation. Tap to open it."><Invitation data={data} events={sampleEvents(spec)} greeting="the Okafor family" open={open} onOpenChange={(v) => { setAuto(false); setOpen(v); }} /></Phone>
      </div>
      <p className="ws-chip ws-chip--a"><b>Private link</b><span>wedsent.app/r/…</span></p>
      <p className="ws-chip ws-chip--b"><b>Per person, per event</b><span>Ceremony yes · Reception no</span></p>
    </div>
  );
}

const SHOW: { id: DesignId; line: string }[] = [
  { id: "gilt", line: "Foil draws the frame, then the names light up." },
  { id: "marigold", line: "Petals fall, then the invitation opens." },
  { id: "zellige", line: "Opens outward from wherever you touch." },
  { id: "botanica", line: "Antique botanicals grow in around the names." },
];

const FEATURES = [
  { icon: House, title: "A private link for every household", body: "Each household gets its own link that shows only the celebrations they are invited to. Nothing public, nothing guessable." },
  { icon: UsersThree, title: "Replies per person, per event", body: "Guests answer for each person and each celebration, with dietary notes. You see who is coming to what, not just a head count." },
  { icon: CalendarCheck, title: "Countdown, map and calendar", body: "A live countdown in three styles, directions in one tap, and an Add to calendar file for every event." },
  { icon: MusicNotes, title: "Your song, only if you want it", body: "Pick a track and the moment it starts. Guests are always in control of the sound." },
  { icon: Translate, title: "Your words, your language", body: "Opening lines in Arabic, Hindi and more, plus guest labels in English, French, Arabic and Somali. Nothing assumed about your culture." },
  { icon: Printer, title: "Matching print", body: "A print-ready invitation card and details insert, made from the same design.", tag: "Preview" },
] as const;

const STEPS = [
  ["Pick a design", "Open a few. Each one has its own opening, colours and lettering."],
  ["Add your details", "Names, date, venues and a note. The phone beside you updates as you type."],
  ["Send the links", "Share each household’s link on WhatsApp, by text or by email, then watch replies arrive."],
] as const;

const FAQ = [
  ["Do guests need an account?", "No. Guests open their link in the browser and reply there."],
  ["Can different people be invited to different events?", "Yes. Choose which celebrations each person in a household is invited to. They only see, and reply to, those."],
  ["Is this for every kind of wedding?", "Yes. Wording, languages and ceremonies are yours to set. Opening lines such as Bismillah or Shubh Vivah are optional choices, never defaults."],
  ["Can I change my design later?", "Yes. Your names, wording and events carry over when you switch."],
] as const;

export function Home() {
  return (
    <>
      <Nav />
      <main>
        <section className="ws-hero">
          <div className="ws-wrap ws-hero-grid">
            <div className="ws-hero-copy">
              <p className="ws-eyebrow">Wedding invitations for your phone</p>
              <h1 className="ws-h1">Invitations<br />worth <em>opening.</em></h1>
              <p className="ws-lead">Design an invitation with a real opening, send each household its own private link, and collect replies for every person and every celebration.</p>
              <div className="ws-hero-actions">
                <Link className="ws-pill ws-pill--dark ws-pill--lg" href="/start">Create your invitation <ArrowRight size={18} /></Link>
                <Link className="ws-link" href="/designs">See the designs <ArrowUpRight size={16} /></Link>
              </div>
              <p className="ws-hero-note">Free to design. Checkout is not open yet.</p>
            </div>
            <HeroInvitation />
          </div>
        </section>

        <section className="ws-night" aria-labelledby="open-h">
          <div className="ws-wrap">
            <div className="ws-night-head">
              <div>
                <p className="ws-eyebrow">The opening</p>
                <h2 className="ws-h2" id="open-h">The first thing guests feel is the way it opens.</h2>
              </div>
              <Link className="ws-pill ws-pill--light" href="/designs">All eight designs <ArrowUpRight size={16} /></Link>
            </div>
            <div className="ws-rail">
              {SHOW.map(({ id, line }) => {
                const spec = specById(id);
                return (
                  <article key={id} className="ws-rail-item">
                    <Phone label={`${spec.name} example`}><Invitation data={sampleData(spec)} events={sampleEvents(spec)} /></Phone>
                    <h3>{spec.name}</h3>
                    <p>{line}</p>
                  </article>
                );
              })}
            </div>
            <p className="ws-rail-hint">These are live. Tap one to open it.</p>
          </div>
        </section>

        <section className="ws-feats" id="features">
          <div className="ws-wrap ws-feats-grid">
            <div className="ws-feats-copy">
              <p className="ws-eyebrow">Behind the invitation</p>
              <h2 className="ws-h2">Beautiful on the outside. <em>Organised</em> underneath.</h2>
              <p className="ws-lead">Everything a guest needs is in one link. Everything you need to plan is in one place.</p>
              <Link className="ws-link" href="/pricing" style={{ alignSelf: "flex-start" }}>What it costs <ArrowUpRight size={16} /></Link>
            </div>
            <div className="ws-rows">
              {FEATURES.map(({ icon: Icon, title, body, ...rest }) => (
                <div className="ws-row" key={title}>
                  <Icon size={28} weight="light" aria-hidden="true" />
                  <div><h3>{title}{"tag" in rest && <span className="ws-tag">{rest.tag}</span>}</h3><p>{body}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ws-replies" aria-labelledby="rep-h">
          <div className="ws-wrap">
            <div className="ws-replies-card">
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <p className="ws-eyebrow">Replies</p>
                <h2 className="ws-h2" id="rep-h">Know who is coming to what.</h2>
                <p className="ws-lead">One household, several people, several celebrations. Every answer is kept per person, so the caterer, the venue and the seating plan all get the right number.</p>
              </div>
              <div className="ws-hh" role="img" aria-label="Example of a household reply: Amara attends the ceremony and reception, Chidi attends the ceremony only, Ife has not replied">
                <div className="ws-hh-top"><b>The Okafor household</b><span>Example</span></div>
                <table className="ws-hh-table" aria-hidden="true">
                  <thead><tr><th>Guest</th><th>Ceremony</th><th>Reception</th></tr></thead>
                  <tbody>
                    <tr><td>Amara</td><td><span className="ws-dot">Yes</span></td><td><span className="ws-dot">Yes</span></td></tr>
                    <tr><td>Chidi</td><td><span className="ws-dot">Yes</span></td><td><span className="ws-dot ws-dot--no">No</span></td></tr>
                    <tr><td>Ife</td><td><span className="ws-dot ws-dot--wait">Waiting</span></td><td><span className="ws-dot ws-dot--wait">Waiting</span></td></tr>
                  </tbody>
                </table>
                <p className="ws-hh-foot">Illustration with made-up names.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="ws-steps" id="how">
          <div className="ws-wrap">
            <div className="ws-steps-head"><p className="ws-eyebrow">How it works</p><h2 className="ws-h2">Three steps. No design skills.</h2></div>
            <div className="ws-steps-grid">{STEPS.map(([t, d], i) => <div className="ws-step" key={t}><b>{i + 1}</b><h3>{t}</h3><p>{d}</p></div>)}</div>
          </div>
        </section>

        <section className="ws-price">
          <div className="ws-wrap">
            <div className="ws-price-card">
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <p className="ws-eyebrow" style={{ color: "rgba(255,255,255,.55)" }}>Pricing</p>
                <h2 className="ws-h2">One price per wedding.</h2>
                <p className="ws-lead">No subscription and no per-guest fees. Design and preview for free first.</p>
                <div><Link className="ws-pill ws-pill--light" href="/pricing">See what’s included <ArrowUpRight size={16} /></Link></div>
              </div>
              <p className="ws-price-amt">£39<small>Proposed price. Checkout is not open yet.</small></p>
            </div>
          </div>
        </section>

        <section className="ws-faq">
          <div className="ws-wrap ws-faq-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}><p className="ws-eyebrow">Questions</p><h2 className="ws-h2">Good to know.</h2></div>
            <div>{FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
          </div>
        </section>

        <section className="ws-cta">
          <h2 className="ws-h2">Make the invitation you wish you had received.</h2>
          <p>It takes a few minutes, and the first draft is free.</p>
          <Link className="ws-pill ws-pill--light ws-pill--lg" href="/start">Create your invitation <ArrowRight size={18} /></Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
