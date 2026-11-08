"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { ArrowUp, CalendarPlus, ChevronsUp, MapPin } from "lucide-react";
import {
  accentFor, buildEventIcs, buildIcs, dateParts, daysUntil, designById, eventMapsUrl, fit, friendlyDate, friendlyTime,
  mapsUrl, onColor, splitNames, type InviteData, type InviteEvent,
} from "@/lib/designs";
import "./invitation.css";
import "@/engine/engine.css";
import { GatesCover, IrisCover, CurtainCover } from "@/engine/covers";
import { StationeryCard, resolveIntro } from "@/engine/stationery";
import { fontPackById, paletteOf, specById, type DesignSpec, type Palette } from "@/engine/registry";

export type InvitationProps = {
  data: InviteData;
  /** Controlled open state. Omit to let the invitation manage itself. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Where the Reply button goes. Omit for a non-navigating preview button. */
  rsvpHref?: string;
  /** Thumbnails: render the cover only and ignore input. */
  still?: boolean;
  /** The events this guest may see. When present they replace the single date/venue block. */
  events?: InviteEvent[];
  /** Who the invitation is for (household name). Shown instead of the occasion label. */
  greeting?: string;
};

export function Invitation({ data, open: openProp, onOpenChange, rsvpHref, still, events, greeting }: InvitationProps) {
  const [inner, setInner] = useState(false);
  const open = openProp ?? inner;
  const setOpen = (v: boolean) => {
    setInner(v);
    onOpenChange?.(v);
  };
  const accent = accentFor(data);
  const spec = specById(data.design);
  const palette = paletteOf(spec, data.palette);
  const pack = fontPackById(data.type) ?? fontPackById(spec.fonts);
  const style = {
    "--a": accent, "--on-a": onColor(accent),
    ...(palette.bg ? { "--bg": palette.bg, "--fg": palette.fg, "--soft": palette.soft, "--line": palette.line } : {}),
    ...(pack ? { "--f-head": pack.head, "--f-script": pack.script ?? pack.head, "--f-body": pack.body, "--f-caps": pack.caps ?? pack.body } : {}),
  } as CSSProperties;
  const design = spec.id;

  return (
    <div className={`inv inv--${design}`} style={style} data-open={open} data-layout={spec.layout} {...(still ? { inert: true } : {})}>
      <Inside data={data} open={open || !!still} rsvpHref={rsvpHref} events={events} greeting={greeting} spec={spec} palette={palette} />
      <AnimatePresence>
        {!open && (
          <Cover key={design} spec={spec} data={data} onOpen={() => setOpen(true)} still={!!still} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Covers: each design has its own opening gesture                     */
/* ------------------------------------------------------------------ */

type CoverProps = { data: InviteData; onOpen: () => void; still: boolean };

function Cover({ spec, ...p }: CoverProps & { spec: DesignSpec }) {
  switch (spec.opening.kind) {
    case "shutter": return <MonoCover {...p} />;
    case "hold": return <NocturneCover {...p} />;
    case "gates": return <GatesCover spec={spec} {...p} />;
    case "iris": return <IrisCover spec={spec} {...p} />;
    case "curtain": return <CurtainCover spec={spec} {...p} />;
    default: return <ZestCover {...p} seal={spec.id === "botanica"} />;
  }
}

/* Zest: tap the envelope ------------------------------------------- */
function ZestCover({ data, onOpen, seal }: CoverProps & { seal?: boolean }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "flap" | "rise" | "away">("idle");
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const names = splitNames(data.names);
  const label = names.joined ? `${names.a} & ${names.b}` : names.a;
  const parts = dateParts(data.date);

  const start = () => {
    if (phase !== "idle") return;
    if (reduced) return onOpen();
    setPhase("flap");
    timers.current.push(
      window.setTimeout(() => setPhase("rise"), 380),
      window.setTimeout(() => setPhase("away"), 900),
      window.setTimeout(onOpen, 1350),
    );
  };

  return (
    <motion.section
      className="cover zest-cover" aria-label="Invitation cover" data-phase={phase}
      initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.35 } }}
    >
      <svg className="zest-shape zest-star" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 0 61 34 96 24 72 50 96 76 61 66 50 100 39 66 4 76 28 50 4 24 39 34Z" fill="#FFE14D" />
      </svg>
      <span className="zest-shape zest-blob" aria-hidden="true" />
      <svg className="zest-shape zest-squiggle" viewBox="0 0 120 40" aria-hidden="true">
        <path d="M4 20c10-22 20-22 28 0s18 22 28 0 18-22 28 0 18 22 28 0" fill="none" stroke="#17120D" strokeWidth="6" strokeLinecap="round" />
      </svg>
      <p className="zest-headline">You’re<br />invited.</p>

      <button type="button" className="zest-envelope" onClick={start} aria-label={`Open invitation from ${label}`}>
        <span className="env-back" />
        <span className="env-card">
          <span className="env-card-names" style={{ fontSize: `${fit(label, 52, 0.5, 11, 6.5)}cqw` }}>{label}</span>
          <span className="env-card-meta">{data.occasion || "Celebration"} · {parts.day} {parts.month}</span>
        </span>
        <span className="env-front" />
        <span className="env-flap" />
        {seal && <span className="env-seal" aria-hidden="true">{(names.a[0] ?? "") + (names.b[0] ?? "")}</span>}
      </button>
      {seal && <img className="env-sprig" src="/art/rose-wild.webp" alt="" aria-hidden="true" width={688} height={900} />}

      <p className="zest-hint" aria-hidden="true">{seal ? "Tap the seal to open" : "Tap to open"}</p>
      <div className="zest-badge" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <defs><path id="zest-ring" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1-74 0" /></defs>
          <circle cx="50" cy="50" r="49" fill="#FFE14D" />
          <text fontSize="10.5" fontWeight="700" fill="#17120D">
            <textPath href="#zest-ring" textLength="228" lengthAdjust="spacing">TAP TO OPEN • TAP TO OPEN •</textPath>
          </text>
        </svg>
        <ArrowUp className="zest-badge-arrow" strokeWidth={2.6} />
      </div>
    </motion.section>
  );
}

/* Monolith: swipe the shutter up ------------------------------------ */
function MonoCover({ data, onOpen, still }: CoverProps) {
  const ref = useRef<HTMLElement>(null);
  const y = useMotionValue(0);
  const names = splitNames(data.names);
  const longest = Math.max(names.a.length, names.b.length);
  const size = fit("x".repeat(longest), 86, 0.5, 36, 11);
  const parts = dateParts(data.date);

  const finish = () => {
    const h = ref.current?.clientHeight ?? 800;
    animate(y, -h * 1.02, { type: "spring", stiffness: 170, damping: 26, restSpeed: 4 }).then(onOpen);
  };

  return (
    <motion.section
      ref={ref} className="cover mono-cover" aria-label="Invitation cover"
      style={{ y, touchAction: "none" }}
      drag={still ? false : "y"} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0.9, bottom: 0.08 }}
      onDragEnd={(_, info) => {
        const h = ref.current?.clientHeight ?? 800;
        if (info.offset.y < -h * 0.22 || info.velocity.y < -550) finish();
        else animate(y, 0, { type: "spring", stiffness: 420, damping: 32 });
      }}
      exit={{ y: "-104%", transition: { duration: 0.01 } }}
    >
      <div className="mono-top">
        <span>{data.occasion || "Celebration"}</span>
        <span>{/^\d{4}-\d{2}-\d{2}$/.test(data.date) ? `${data.date.slice(8, 10)}.${data.date.slice(5, 7)}.${data.date.slice(2, 4)}` : "TBA"}</span>
      </div>
      <h1 className="mono-names" style={{ fontSize: `${size}cqw` }}>
        <span>{names.a}</span>
        {names.joined && <span className="mono-amp">&amp;</span>}
        {names.joined && <span>{names.b}</span>}
      </h1>
      <button type="button" className="mono-pull" onClick={finish}>
        <ChevronsUp className="mono-chev" strokeWidth={2.4} />
        <span>Swipe up to open</span>
      </button>
    </motion.section>
  );
}

/* Nocturne: press and hold ------------------------------------------ */
function NocturneCover({ data, onOpen }: CoverProps) {
  const reduced = useReducedMotion();
  const progress = useMotionValue(0);
  const anim = useRef<ReturnType<typeof animate> | null>(null);
  const done = useRef(false);
  const names = splitNames(data.names);
  const label = names.joined ? [names.a, names.b] : [names.a];
  const size = fit("x".repeat(Math.max(names.a.length, names.b.length)), 80, 0.46, 21, 9);

  const complete = () => {
    if (done.current) return;
    done.current = true;
    navigator.vibrate?.(12);
    onOpen();
  };
  const press = () => {
    if (reduced) return complete();
    anim.current?.stop();
    anim.current = animate(progress, 1, { duration: 1.15, ease: [0.5, 0, 0.3, 1], onComplete: complete });
  };
  const release = () => {
    if (done.current) return;
    anim.current?.stop();
    anim.current = animate(progress, 0, { duration: 0.35, ease: "easeOut" });
  };

  return (
    <motion.section
      className="cover noc-cover" aria-label="Invitation cover"
      exit={{ opacity: 0, scale: 1.07, filter: "blur(14px)", transition: { duration: 0.7, ease: [0.3, 0, 0.2, 1] } }}
    >
      <div className="noc-glow" aria-hidden="true" />
      <p className="noc-lead">Together with their families</p>
      <h1 className="noc-names" style={{ fontSize: `${size}cqw` }} aria-label={label.join(" and ")}>
        {label.map((word, wi) => (
          <span key={wi} className="noc-line" aria-hidden="true">
            {wi === 1 && <em className="noc-amp">&amp;</em>}
            <span>
              {[...word].map((ch, i) => (
                <motion.span
                  key={i} className="noc-ch"
                  initial={{ opacity: 0, filter: "blur(10px)", y: "0.18em" }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ delay: 0.25 + (wi * word.length + i) * 0.055, duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
                >{ch === " " ? " " : ch}</motion.span>
              ))}
            </span>
          </span>
        ))}
      </h1>
      <p className="noc-date">{friendlyDate(data.date)}</p>
      <button
        type="button" className="noc-hold" aria-label="Open invitation (press and hold)"
        onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
        onClick={(e) => { if (e.detail === 0) complete(); }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="44" className="noc-ring-bg" />
          <motion.circle cx="50" cy="50" r="44" className="noc-ring" style={{ pathLength: progress }} />
        </svg>
        <span className="noc-dot" aria-hidden="true" />
      </button>
      <p className="noc-hint">Press and hold to open</p>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/* Inside: details, one layout language per design                     */
/* ------------------------------------------------------------------ */

function Inside({ data, open, rsvpHref, events, greeting, spec, palette }: { data: InviteData; open: boolean; rsvpHref?: string; events?: InviteEvent[]; greeting?: string; spec: DesignSpec; palette: Palette }) {
  const design = designById(data.design).id;
  const names = splitNames(data.names);
  const parts = dateParts(data.date);
  const left = daysUntil(data.date);
  const time = friendlyTime(data.time);
  const hideUntilOpen = design !== "mono";
  const countdown =
    left === null ? "" : left > 1 ? `${left} days to go` : left === 1 ? "Tomorrow" : left === 0 ? "Today" : "Celebrated";
  const rsvpBy = data.rsvpBy ? friendlyDate(data.rsvpBy).replace(/^\w+day,? /, "") : "";
  const nameSize = fit(names.a + (names.joined ? " & " + names.b : ""), 84, design === "mono" ? 0.58 : 0.55, 15, 8);

  const reveal = (i: number) => ({
    initial: false as const,
    animate: open || !hideUntilOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { delay: open ? 0.08 + i * 0.07 : 0, duration: 0.6, ease: [0.2, 0.7, 0.2, 1] as [number, number, number, number] },
  });

  const addToCalendar = () => {
    const url = URL.createObjectURL(new Blob([buildIcs(data)], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "invitation.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const evs = events && events.length ? events : null;
  const downloadEvent = (ev: InviteEvent) => {
    const ics = buildEventIcs(ev, data.names || "Wedding");
    if (!ics) return;
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ev.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "event"}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="inside" {...(open ? {} : { inert: true })}>
      <div className="inside-scroll">
        {spec.layout === "stationery" ? (
          <motion.div {...reveal(0)}>
            <StationeryCard data={data} spec={spec} palette={palette} greeting={greeting} event={evs?.[0]} />
            {data.message.trim() && <p className="in-message in-note">{data.message}</p>}
          </motion.div>
        ) : (<>
        <motion.header className="in-hero" {...reveal(0)}>
          <p className="in-kicker">{greeting ? `For ${greeting}` : data.occasion || "Celebration"}</p>
          <h2 className="in-names" style={{ fontSize: `${nameSize}cqw` }}>
            {names.a}
            {names.joined && <><span className="in-amp"> &amp; </span>{names.b}</>}
          </h2>
        </motion.header>

        {data.message.trim() && (
          <motion.p className="in-message" {...reveal(1)}>{data.message}</motion.p>
        )}
        </>)}

        {evs ? evs.map((ev, i) => {
          const p = dateParts(ev.startsOn ?? "");
          const t = friendlyTime(ev.startsAt ?? "");
          const left = ev.startsOn ? daysUntil(ev.startsOn) : null;
          return (
            <motion.section key={ev.id} className="in-card in-event" {...reveal(2 + i)}>
              <h3 className="in-label in-evtitle">{ev.title}</h3>
              {ev.startsOn ? (
                <div className="in-date"><strong>{p.day}</strong><span>{p.month}<br />{p.year}</span></div>
              ) : <p className="in-sub">Date to be confirmed</p>}
              {ev.startsOn && <p className="in-sub">{p.weekday}{t && ` at ${t}`}</p>}
              {i === 0 && left !== null && left >= 0 && <p className="in-count">{left > 1 ? `${left} days to go` : left === 1 ? "Tomorrow" : "Today"}</p>}
              {(ev.venue || ev.city) && <p className="in-venue">{ev.venue || ev.city}</p>}
              {ev.venue && ev.city && <p className="in-sub">{ev.city}</p>}
              <div className="in-links">
                {(ev.venue || ev.city) && <a className="in-link" href={eventMapsUrl(ev)} target="_blank" rel="noreferrer"><MapPin size="1em" /> Open in Maps</a>}
                {ev.startsOn && <button type="button" className="in-cal" onClick={() => downloadEvent(ev)}><CalendarPlus size="1.1em" /> Add to calendar</button>}
              </div>
            </motion.section>
          );
        }) : (<>
        <motion.section className="in-card in-when" {...reveal(2)}>
          <h3 className="in-label">When</h3>
          <div className="in-date">
            <strong>{parts.day}</strong>
            <span>{parts.month}<br />{parts.year}</span>
          </div>
          <p className="in-sub">{parts.weekday}{time && ` at ${time}`}</p>
          {countdown && <p className="in-count">{countdown}</p>}
        </motion.section>

        <motion.section className="in-card in-where" {...reveal(3)}>
          <h3 className="in-label">Where</h3>
          <p className="in-venue">{data.venue || "Venue to be confirmed"}</p>
          {data.city && <p className="in-sub">{data.city}</p>}
          {(data.venue || data.city) && (
            <a className="in-link" href={mapsUrl(data)} target="_blank" rel="noreferrer">
              <MapPin size="1em" /> Open in Maps
            </a>
          )}
        </motion.section></>)}

        {data.dress.trim() && (
          <motion.section className="in-card in-dress" {...reveal(4)}>
            <h3 className="in-label">Dress</h3>
            <p className="in-venue">{data.dress}</p>
          </motion.section>
        )}

        <motion.div className="in-actions" {...reveal(5)}>
          {rsvpHref ? (
            <Link className="in-rsvp" href={rsvpHref}>Reply</Link>
          ) : (
            <button type="button" className="in-rsvp" aria-disabled="true" title="Replies are switched off in previews">Reply</button>
          )}
          {rsvpBy && <p className="in-sub in-by">Please reply by {rsvpBy}</p>}
          {!evs && (
            <button type="button" className="in-cal" onClick={addToCalendar}>
              <CalendarPlus size="1.1em" /> Add to calendar
            </button>
          )}
        </motion.div>

        <p className="in-foot">Made with Wedsent</p>
      </div>
    </div>
  );
}
