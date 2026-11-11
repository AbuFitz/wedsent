import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { Nav, SiteFooter } from "./nav";
import { HeroInvitation, HouseholdExample, InvitationStack } from "./edition-demo";

const questions = [
  ["Do guests need an account?", "Guests open the link in their browser and can reply there."],
  ["Can I invite people to different events?", "Yes. Add your events in Studio, then choose which ones each person in a household is invited to. They’ll see and reply to those events."],
  ["Can I send an invitation on WhatsApp?", "Yes. Once you’ve published, copy the invitation link and share it on WhatsApp, by text or by email."],
  ["Can I change my design after I start?", "Yes. Your names, wording and events carry over when you choose a different design."],
] as const;

const steps = [
  ["Choose a design", "Try the opening and find the colours you want."],
  ["Add your details", "Add your names and celebrations. See each change on the live preview."],
  ["Share the link", "Publish in Studio, then share each household’s link when you’re ready."],
] as const;

export function EditionHome() {
  return (
    <>
      <Nav />
      <main className="ed-home">
        <section className="ed-hero ed-width">
          <div className="ed-hero-copy">
            <h1>Wedding invitations,<br /><em>made to open.</em></h1>
            <p>Design your invitation, share it as a link and keep every RSVP together.</p>
            <div className="ed-hero-actions">
              <Link className="ed-button ed-button--primary" href="/start">Create an invitation <ArrowUpRight size={18} /></Link>
              <Link className="ed-text-link" href="/designs">Browse designs <ArrowRight size={17} /></Link>
            </div>
          </div>
          <div className="ed-hero-visual">
            <Image src="/art/weddsent-editorial-table-v2.webp" alt="A couple holding hands across a candlelit wedding table" fill preload sizes="(max-width: 700px) 100vw, 63vw" />
            <HeroInvitation />
            <Link className="ed-photo-caption" href="/designs/rosewood">Rosewood Letter <ArrowUpRight size={14} /></Link>
          </div>
        </section>

        <section className="ed-collection ed-width" id="collection">
          <header className="ed-section-head">
            <div><h2>Invitation designs</h2><p>Try the opening of any design before you choose.</p></div>
            <Link className="ed-text-link" href="/designs">View all designs <ArrowUpRight size={17} /></Link>
          </header>
          <InvitationStack />
        </section>

        <section className="ed-guest ed-width" aria-labelledby="ed-rsvp-title">
          <div className="ed-guest-photo">
            <Image src="/art/weddsent-editorial-hands-v2.webp" alt="Newlyweds holding hands beside ivory calla lilies" fill sizes="(max-width: 740px) 100vw, 40vw" />
          </div>
          <div className="ed-guest-content">
            <h2 id="ed-rsvp-title">One link per household.</h2>
            <p>Each guest can reply to the events they’re invited to. You can see who’s coming to what in Studio.</p>
            <HouseholdExample />
          </div>
        </section>

        <section className="ed-process ed-width" id="how-it-works">
          <header className="ed-section-head"><h2>How it works</h2><Link className="ed-text-link" href="/pricing">See pricing <ArrowUpRight size={17} /></Link></header>
          <ol>
            {steps.map(([title, text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}
          </ol>
        </section>

        <section className="ed-faq ed-width">
          <h2>Questions</h2>
          <div>
            {questions.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={20} /></summary><p>{answer}</p></details>)}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
