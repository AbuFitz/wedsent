"use client";
import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { CalendarPlus, MapPin } from "lucide-react";
import {
  accentFor, appleMapsUrl, buildEventIcs, buildIcs, dateParts, daysUntil, eventMapsUrl, fit, friendlyDate, friendlyTime,
  mapsUrl, onColor, splitNames, type InviteData, type InviteEvent,
} from "@/lib/designs";
import "./invitation.css";
import "@/engine/engine.css";
import { LiftCover, BloomCover, VeilCover } from "@/engine/covers";
import { StationeryCard } from "@/engine/stationery";
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

type CoverProps = { data: InviteData; onOpen: () => void; still: boolean };

function Cover({ spec, ...p }: CoverProps & { spec: DesignSpec }) {
  switch (spec.opening.kind) {
    case "lift": return <LiftCover spec={spec} {...p} />;
    case "bloom": return <BloomCover spec={spec} {...p} />;
    default: return <VeilCover spec={spec} {...p} />;
  }
}

/* ------------------------------------------------------------------ */
/* Inside: details, one layout language per design                     */
/* ------------------------------------------------------------------ */

function Inside({ data, open, rsvpHref, events, greeting, spec, palette }: { data: InviteData; open: boolean; rsvpHref?: string; events?: InviteEvent[]; greeting?: string; spec: DesignSpec; palette: Palette }) {
  const design = spec.id;
  const names = splitNames(data.names);
  const parts = dateParts(data.date);
  const left = daysUntil(data.date);
  const time = friendlyTime(data.time);
  const hideUntilOpen = true;
  const countdown =
    left === null ? "" : left > 1 ? `${left} days to go` : left === 1 ? "Tomorrow" : left === 0 ? "Today" : "Celebrated";
  const rsvpBy = data.rsvpBy ? friendlyDate(data.rsvpBy).replace(/^\w+day,? /, "") : "";
  const nameSize = fit(names.a + (names.joined ? " & " + names.b : ""), 84, 0.55, 15, 8);

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
