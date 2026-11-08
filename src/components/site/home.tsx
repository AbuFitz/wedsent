"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, CalendarPlus, Lock, Printer, Translate, UsersThree, PencilSimpleLine, MapPin } from "@phosphor-icons/react";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { DesignCard } from "@/components/gallery/design-card";
import { sampleData, sampleEvents } from "@/components/gallery/samples";
import { FEATURED_DESIGNS, specById } from "@/engine/registry";
import { Nav } from "./nav";
import { PriceTeaser, Faq, Closing, SiteFooter } from "./sections";
import "./home.css";

const ease = [0.2, 0.8, 0.2, 1] as const;
const spec = (id: string) => specById(id);

export function Home() {
  return (
    <>
      <Nav />
      <main className="hm">
        <Hero />
        <Collection />
        <EveryWedding />
        <GuestTour />
        <Everything />
        <PriceTeaser />
        <Faq />
        <Closing />
      </main>
      <SiteFooter />
    </>
  );
}

/* ------------------------------ Hero ------------------------------ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const lift = useSpring(useTransform(scrollYProgress, [0, 1], [0, -70]), { stiffness: 80, damping: 20 });
  const sink = useSpring(useTransform(scrollYProgress, [0, 1], [0, 40]), { stiffness: 80, damping: 20 });
  const words = ["Invitations", "that", "open", "like", "a", "moment."];
  const z = spec("zellige"), b = spec("botanica"), m = spec("marigold");
  return (
    <section ref={ref} className="hm-hero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img src="/art/rose-sprig.webp" alt="" aria-hidden="true" className="hm-leaf hm-leaf--a" style={{ y: sink }} width={688} height={900} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img src="/art/peony-paxton.webp" alt="" aria-hidden="true" className="hm-leaf hm-leaf--b" style={{ y: lift }} width={790} height={900} />
      <div className="hm-hero-copy">
        <h1 aria-label={words.join(" ")}>
          {words.map((w, i) => (
            <span className="mask" key={i} aria-hidden="true">
              <motion.span initial={{ y: "108%" }} animate={{ y: 0 }} transition={{ delay: 0.1 + i * 0.07, duration: 0.9, ease }}>{w}&nbsp;</motion.span>
            </span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8, ease }}>
          Choose a design made like real stationery, add your events, and send each family their own private link. Replies come back counted, per person and per event.
        </motion.p>
        <motion.div className="hm-cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.8, ease }}>
          <Link href="/start" className="btn btn-dark">Start your invitation <ArrowRight size={18} /></Link>
          <Link href="/designs" className="btn btn-light">Browse designs</Link>
        </motion.div>
        <p className="hm-note">Free to try. No app or account needed for guests.</p>
      </div>
      <motion.div className="hm-fan" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1.1, ease }}>
        <div className="hm-ph hm-ph--l"><Phone label="Zellige invitation"><Invitation data={sampleData(z)} still /></Phone></div>
        <div className="hm-ph hm-ph--r"><Phone label="Marigold invitation"><Invitation data={sampleData(m)} still /></Phone></div>
        <div className="hm-ph hm-ph--c"><Phone label="Botanica invitation, try opening it"><Invitation data={sampleData(b)} events={sampleEvents(b)} /></Phone></div>
        <span className="hm-try">Try the middle one</span>
      </motion.div>
    </section>
  );
}

/* ---------------------------- Collection ---------------------------- */
const CELEBRATIONS = [
  ["Nikah & Walima", "Nikah"], ["Mehndi & Sangeet", "Mehndi"], ["Church & garden", "Church"], ["Civil", "Civil"], ["Any wedding", "Any wedding"],
] as const;
function Collection() {
  return (
    <section id="designs" className="hm-sec">
      <div className="hm-head">
        <h2>{FEATURED_DESIGNS.length} crafted invitation worlds.</h2>
        <p>Not one template in different colours. Every design has its own composition, lettering, artwork and way of opening, and every one is a working invitation.</p>
      </div>
      <div className="hm-chips" aria-label="Browse by celebration">
        {CELEBRATIONS.map(([label, v]) => <Link key={v} href={`/designs?culture=${encodeURIComponent(v)}`}>{label}</Link>)}
        <Link href="/designs" className="hm-chips-all">See all <ArrowRight size={14} /></Link>
      </div>
      <div className="hm-rail" tabIndex={0} aria-label="Designs">
        {FEATURED_DESIGNS.map((d) => <div className="hm-rail-item" key={d.id}><DesignCard spec={d} /></div>)}
      </div>
    </section>
  );
}

/* --------------------------- Every wedding --------------------------- */
const EVENTS = ["Nikah", "Walima", "Mehndi", "Sangeet", "Haldi", "Ceremony", "Reception", "Civil ceremony", "Rehearsal dinner", "Brunch"];
function EveryWedding() {
  return (
    <section className="hm-sec hm-every">
      <div className="hm-head">
        <h2>Made for the way you actually celebrate.</h2>
        <p>Weddings are rarely one event. Wedsent starts from yours, in your words, and never assumes a tradition.</p>
      </div>
      <motion.ul className="hm-events" aria-label="Examples of events you can add" initial="h" whileInView="v" viewport={{ once: true, margin: "-60px" }} transition={{ staggerChildren: 0.05 }}>
        {EVENTS.map((e) => <motion.li key={e} variants={{ h: { opacity: 0, y: 10 }, v: { opacity: 1, y: 0 } }}>{e}</motion.li>)}
      </motion.ul>
      <div className="hm-cols">
        <article>
          <UsersThree size={30} weight="duotone" />
          <h3>Guests invited to different things</h3>
          <p>Invite the whole family to the Walima and only close family to the Nikah. Each household opens a page showing just their own events.</p>
        </article>
        <article>
          <Translate size={30} weight="duotone" />
          <h3>Your language, your script</h3>
          <p>Add an opening line in Arabic or Hindi, or write your own. Right-to-left text and Devanagari set properly, with real calligraphic fonts.</p>
          <div className="hm-scripts"><span lang="ar" dir="rtl">بسم الله الرحمن الرحيم</span><span lang="hi">शुभ विवाह</span><span lang="en">Together with their families</span></div>
        </article>
        <article>
          <PencilSimpleLine size={30} weight="duotone" />
          <h3>Simple to make, real to send</h3>
          <p>Pick a design, type your names, add your events. You can change the colours, lettering and wording any time without losing a word.</p>
        </article>
      </div>
    </section>
  );
}

/* ---------------------------- Guest tour ---------------------------- */
const TOUR = [
  { t: "It arrives with a gesture", d: "A wax seal to break, doors to part, curtains to draw. Guests open it with their thumb, and it plays once." },
  { t: "It shows them their day", d: "A card first, in your lettering. Then only the events this family is invited to, with directions and a calendar file for each." },
  { t: "They reply in a minute", d: "One page for the household: yes or no for each person and each event. No app, no account, and they can change their answer later." },
];
function GuestTour() {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setI(Math.max(0, Math.min(2, Math.floor(v * 3 * 0.999)))));
  const s = spec("botanica");
  useEffect(() => {
    const el = ref.current?.querySelector(".inside-scroll");
    if (el) (el as HTMLElement).scrollTo({ top: i === 2 ? 520 : 0, behavior: "smooth" });
  }, [i]);
  return (
    <section ref={ref} className="hm-tour" style={{ height: "330svh" }}>
      <div className="hm-tour-stick">
        <div className="hm-tour-text">
          <h2>What your guests see</h2>
          <ol>
            {TOUR.map((x, n) => (
              <li key={x.t} data-on={n === i}>
                <h3>{x.t}</h3>
                <motion.p initial={false} animate={{ height: n === i ? "auto" : 0, opacity: n === i ? 1 : 0 }} transition={{ duration: 0.4, ease }}>{x.d}</motion.p>
              </li>
            ))}
          </ol>
        </div>
        <div className="hm-tour-phone">
          <Phone label="Live invitation">
            <Invitation key={i === 0 ? "closed" : "open"} data={sampleData(s)} events={sampleEvents(s)} greeting="Sara & family" open={i > 0 ? true : undefined} rsvpHref="/designs/botanica" />
          </Phone>
        </div>
      </div>
    </section>
  );
}

/* ----------------------- Everything behind it ----------------------- */
const LIST = [
  { Icon: Lock, t: "A private link per household", d: "Reset one link and only that family’s old link stops working." },
  { Icon: UsersThree, t: "Replies per person, per event", d: "A link is never a headcount. Plus-ones are named guests." },
  { Icon: CalendarPlus, t: "Calendar and directions", d: "A calendar file and a maps link on every event." },
  { Icon: PencilSimpleLine, t: "Change it after you send it", d: "Edits stay a draft until you publish. Your link never changes." },
  { Icon: Printer, t: "Print the same design", d: "An A5 layout today. Print-shop files are next." },
  { Icon: MapPin, t: "Private by default", d: "Link previews show no names or dates, and pages are not searchable." },
];
function Everything() {
  return (
    <section className="hm-sec">
      <div className="hm-head"><h2>The unglamorous parts, done properly.</h2><p>Families, events, replies and changes of plan, handled without turning your wedding into a spreadsheet.</p></div>
      <ul className="hm-list">
        {LIST.map(({ Icon, t, d }) => (
          <motion.li key={t} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, ease }}>
            <Icon size={26} weight="duotone" /><div><h3>{t}</h3><p>{d}</p></div>
          </motion.li>
        ))}
      </ul>
      <p className="hm-later">Still to come: reminders, music, photos, and a Photo Hall for after the day.</p>
    </section>
  );
}
