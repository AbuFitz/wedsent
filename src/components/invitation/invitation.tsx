"use client";
import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { CalendarPlus, MapPin, ChevronDown, ExternalLink } from "lucide-react";
import {
  accentFor, appleMapsUrl, buildEventIcs, buildIcs, dateParts, eventMapsUrl, fit, friendlyDate, friendlyTime,
  mapsUrl, onColor, splitNames, type InviteData, type InviteEvent,
} from "@/lib/designs";
import "./invitation.css";
import "@/engine/engine.css";
import { LiftCover, BloomCover, VeilCover, FocusCover, KeepsakeCover, RosewoodCover, VelvetStageCover, EngravedLetterCover } from "@/engine/covers";
import { StationeryCard } from "@/engine/stationery";
import { fontPackById, paletteOf, specById, OPENINGS, type DesignSpec, type Palette } from "@/engine/registry";
import { CountdownWidget, label } from "./widgets";
import { GuestMusic } from "./music-control";

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
  /** Only true on an actual guest-facing page, not a phone mockup in the editor. */
  syncChrome?: boolean;
  /** Studio-only: select an invitation section instead of activating its guest links. */
  onEditTarget?: (target: "words" | "details" | "events" | "extras") => void;
};

export function Invitation({ data, open: openProp, onOpenChange, rsvpHref, still, events, greeting, syncChrome = false, onEditTarget }: InvitationProps) {
  const [inner, setInner] = useState(false);
  const open = openProp ?? inner;
  const setOpen = (v: boolean) => {
    setInner(v);
    onOpenChange?.(v);
  };
  const accent = accentFor(data);
  const original = specById(data.design);
  // Historical generic door/curtain settings now resolve to the design's own art-directed cover.
  const spec = data.opening && data.opening !== "doors" && data.opening !== "curtain" && OPENINGS[data.opening] ? { ...original, opening: { kind: data.opening, ...OPENINGS[data.opening] } } : original;
  const palette = paletteOf(spec, data.palette);
  useEffect(() => {
    if (!syncChrome) return;
    const color = spec.id === "velvet" ? (open ? "#1b151a" : "#251725") : spec.id === "gilt" ? "#181512" : palette.bg || "#F4F4F2";
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const previous = meta?.content;
    if (meta) meta.content = color;
    const oldBackground = document.documentElement.style.backgroundColor;
    const oldBodyBackground = document.body.style.backgroundColor;
    document.documentElement.style.backgroundColor = color;
    document.body.style.backgroundColor = color;
    return () => {
      if (meta && previous !== undefined) meta.content = previous;
      document.documentElement.style.backgroundColor = oldBackground;
      document.body.style.backgroundColor = oldBodyBackground;
    };
  }, [syncChrome, palette.bg, spec.id, open]);
  const pack = fontPackById(data.type) ?? fontPackById(spec.fonts);
  const style = {
    "--a": accent, "--on-a": onColor(accent),
    ...(palette.bg ? { "--bg": palette.bg, "--fg": palette.fg, "--soft": palette.soft, "--line": palette.line } : {}),
    ...(pack ? { "--f-head": pack.head, "--f-script": pack.script ?? pack.head, "--f-body": pack.body, "--f-caps": pack.caps ?? pack.body } : {}),
  } as CSSProperties;
  const design = spec.id;

  return (
    <div className={`inv inv--${design}`} style={style} data-open={open} data-layout={spec.layout} {...(still ? { inert: true } : {})}>
      <Inside data={data} open={open || !!still} rsvpHref={rsvpHref} events={events} greeting={greeting} spec={spec} palette={palette} onEditTarget={onEditTarget} />
      {!still && <GuestMusic choice={data.music ?? null} opened={open} />}
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
  if (spec.id === "rosewood" && (!p.data.opening || p.data.opening === "doors")) return <RosewoodCover spec={spec} {...p} />;
  if (spec.id === "velvet" && (!p.data.opening || p.data.opening === "curtain")) return <VelvetStageCover spec={spec} {...p} />;
  if (["heritage", "nikah-etched"].includes(spec.id) && (!p.data.opening || p.data.opening === specById(spec.id).opening.kind)) return <EngravedLetterCover spec={spec} {...p} />;
  if (["pearl", "embossed", "gilt"].includes(spec.id) && (!p.data.opening || p.data.opening === specById(spec.id).opening.kind)) return <KeepsakeCover spec={spec} {...p} />;
  switch (spec.opening.kind) {
    case "lift": return <LiftCover spec={spec} {...p} />;
    case "bloom": return <BloomCover spec={spec} {...p} />;
    case "focus": return <FocusCover spec={spec} {...p} />;
    case "doors": return <RosewoodCover spec={spec} {...p} />;
    case "curtain": return <VelvetStageCover spec={spec} {...p} />;
    default: return <VeilCover spec={spec} {...p} />;
  }
}

/* ------------------------------------------------------------------ */
/* Inside: details, one layout language per design                     */
/* ------------------------------------------------------------------ */

function Inside({ data, open, rsvpHref, events, greeting, spec, palette, onEditTarget }: { data: InviteData; open: boolean; rsvpHref?: string; events?: InviteEvent[]; greeting?: string; spec: DesignSpec; palette: Palette; onEditTarget?: InvitationProps["onEditTarget"] }) {
  const design = spec.id;
  const names = splitNames(data.names);
  const parts = dateParts(data.date);
  const time = friendlyTime(data.time);
  const hideUntilOpen = true;
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
      <div className="inside-scroll" data-studio-interactive={!!onEditTarget} onClickCapture={(event) => {
        if (!onEditTarget) return;
        const target = (event.target as HTMLElement).closest<HTMLElement>("[data-studio-edit]");
        if (!target) return;
        event.preventDefault(); event.stopPropagation();
        const section = target.dataset.studioEdit;
        if (section === "words" || section === "details" || section === "events" || section === "extras") onEditTarget(section);
      }}>
        {spec.layout === "stationery" ? (
          <motion.div {...reveal(0)} data-studio-edit="words">
            <StationeryCard data={data} spec={spec} palette={palette} greeting={greeting} event={evs?.[0]} />
            {data.message.trim() && <p className={`in-message in-note in-message--${data.messageStyle || "plain"}`}>{data.message}</p>}
          </motion.div>
        ) : (<>
        <motion.header className="in-hero" {...reveal(0)} data-studio-edit="words">
          <p className="in-kicker">{greeting ? `For ${greeting}` : data.occasion || "Celebration"}</p>
          <h2 className="in-names" style={{ fontSize: `${nameSize}cqw` }}>
            {names.a}
            {names.joined && <><span className="in-amp"> &amp; </span>{names.b}</>}
          </h2>
        </motion.header>

        {data.message.trim() && (
          <motion.p data-studio-edit="words" className={`in-message in-message--${data.messageStyle || "plain"}`} {...reveal(1)}>{data.message}</motion.p>
        )}
        </>)}

        <ThemeInterlude design={design} position="opening" />
        <ThemeChapter design={design} names={data.names} occasion={data.occasion || "Wedding"} />

        {evs ? evs.map((ev, i) => {
          const p = dateParts(ev.startsOn ?? "");
          const t = friendlyTime(ev.startsAt ?? "");
          return (
            <motion.section key={ev.id} data-studio-edit="events" className="in-card in-event" {...reveal(2 + i)}>
              <span className="in-event-index" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              {i === 0 && <p className="in-section-overline">THE CELEBRATIONS</p>}
              <h3 className="in-label in-evtitle">{ev.title}</h3>
              {ev.startsOn ? (
                <div className="in-date"><strong>{p.day}</strong><span>{p.month}<br />{p.year}</span></div>
              ) : <p className="in-sub">Date to be confirmed</p>}
              {ev.startsOn && <p className="in-sub">{p.weekday}{t && ` at ${t}`}</p>}
              {(ev.venue || ev.city) && <VenueEmblem design={design} />}
              {(ev.venue || ev.city) && <p className="in-venue">{ev.venue || ev.city}</p>}
              {ev.venue && ev.city && <p className="in-sub">{ev.city}</p>}
              <div className="in-links">
                {(ev.venue || ev.city) && <a className="in-link" href={eventMapsUrl(ev)} target="_blank" rel="noreferrer"><MapPin size="1em" /> {label(data.languages?.details ?? "en", "maps")}</a>}
                {ev.startsOn && <button type="button" className="in-cal" onClick={() => downloadEvent(ev)}><CalendarPlus size="1.1em" /> {label(data.languages?.details ?? "en", "calendar")}</button>}
              </div>
              {(ev.venue || ev.city) && <VenueMap place={[ev.venue, ev.city].filter(Boolean).join(", ")} mapsHref={eventMapsUrl(ev)} />}
            </motion.section>
          );
        }) : (<>
        <motion.section data-studio-edit="details" className="in-card in-when" {...reveal(2)}>
          <h3 className="in-label">{label(data.languages?.details ?? "en", "when")}</h3>
          <div className="in-date">
            <strong>{parts.day}</strong>
            <span>{parts.month}<br />{parts.year}</span>
          </div>
          <p className="in-sub">{parts.weekday}{time && ` at ${time}`}</p>
        </motion.section>

        <motion.section data-studio-edit="details" className="in-card in-where" {...reveal(3)}>
          <h3 className="in-label">{label(data.languages?.details ?? "en", "where")}</h3>
          {(data.venue || data.city) && <VenueEmblem design={design} />}
          <p className="in-venue">{data.venue || "Venue to be confirmed"}</p>
          {data.city && <p className="in-sub">{data.city}</p>}
          {(data.venue || data.city) && (
            <a className="in-link" href={mapsUrl(data)} target="_blank" rel="noreferrer">
              <MapPin size="1em" /> {label(data.languages?.details ?? "en", "maps")}
            </a>
          )}
          {(data.venue || data.city) && <VenueMap place={[data.venue, data.city].filter(Boolean).join(", ")} mapsHref={mapsUrl(data)} />}
        </motion.section></>)}

        <CountdownWidget date={evs?.[0]?.startsOn ?? data.date} time={evs?.[0]?.startsAt ?? data.time} config={data.countdown ?? { enabled: false, style: "type", accent: "", label: "" }} lang={data.languages?.countdown ?? "en"} design={design} />

        <ThemeInterlude design={design} position="details" />

        {data.dress.trim() && (
          <motion.section data-studio-edit="details" className="in-card in-dress" {...reveal(4)}>
            <h3 className="in-label">{label(data.languages?.details ?? "en", "dress")}</h3>
            <p className="in-venue">{data.dress}</p>
          </motion.section>
        )}

        <motion.div data-studio-edit="extras" className="in-actions" {...reveal(5)}>
          <p className="in-response-kicker">THE PLEASURE OF YOUR COMPANY</p>
          {rsvpHref ? (
            <Link className="in-rsvp" href={rsvpHref}>{label(data.languages?.reply ?? "en", "reply")}</Link>
          ) : (
            <button type="button" className="in-rsvp" aria-disabled="true" title="Replies are switched off in previews">{label(data.languages?.reply ?? "en", "reply")}</button>
          )}
          {rsvpBy && <p className="in-sub in-by">Please reply by {rsvpBy}</p>}
          {!evs && (
            <button type="button" className="in-cal" onClick={addToCalendar}>
              <CalendarPlus size="1.1em" /> {label(data.languages?.details ?? "en", "calendar")}
            </button>
          )}
        </motion.div>

        <p className="in-foot">Made with Wedsent</p>
      </div>
    </div>
  );
}

/** A second visual vocabulary for the scroll, separate from the illustration on the opening card. */
function ThemeInterlude({ design, position }: { design: string; position: "opening" | "details" }) {
  return <div className={`in-interlude in-interlude--${position}`} aria-hidden="true">
    <span className="in-interlude-rule" />
    <span className="in-interlude-emblem">{design === "velvet" ? "✦" : design === "heritage" ? "❧" : design === "nikah-etched" ? "۞" : design === "rosewood" ? "✤" : design === "gilt" ? "◇" : "✿"}</span>
    <span className="in-interlude-rule" />
  </div>;
}

/** Secondary editorial scene: never repeats the cover illustration or its opening gesture. */
function ThemeChapter({ design, names, occasion }: { design: string; names: string; occasion: string }) {
  const copy: Record<string, { eyebrow: string; line: string }> = {
    velvet: { eyebrow: "ACT I · AN INVITATION", line: "An evening to remember" },
    rosewood: { eyebrow: "A LETTER FROM OUR HEARTS", line: "Together, a new chapter" },
    heritage: { eyebrow: "THE CELEBRATION", line: "A day written in history" },
    "nikah-etched": { eyebrow: "WITH LOVE AND BLESSINGS", line: "A beautiful beginning" },
    gilt: { eyebrow: "YOU ARE CORDIALLY INVITED", line: "A night of golden memories" },
    pearl: { eyebrow: "A CELEBRATION OF LOVE", line: "A little moment of magic" },
    embossed: { eyebrow: "A PERSONAL INVITATION", line: "The beginning of forever" },
  };
  const text = copy[design] ?? { eyebrow: occasion.toUpperCase(), line: "A day to remember" };
  return <section className="in-chapter" aria-label="Invitation introduction">
    <span className="in-chapter-figure" aria-hidden="true"><i /><i /><i /></span>
    <p className="in-chapter-eyebrow">{text.eyebrow}</p>
    <p className="in-chapter-line">{text.line}</p>
    <p className="in-chapter-signature">{names && `with ${names}`}</p>
  </section>;
}

/** Abstract, print-inspired architectural vignette; not a photograph of an unverified venue. */
function VenueEmblem({ design }: { design: string }) {
  return <div className={`in-venue-plate in-venue-plate--${design}`} aria-hidden="true">
    <span className="in-venue-arch"><i className="in-venue-roof"/><i className="in-venue-door"/><i className="in-venue-window in-venue-window--left"/><i className="in-venue-window in-venue-window--right"/></span>
    <span className="in-venue-ground" />
  </div>;
}

/** An opt-in map reveal; only load Google Maps after a guest chooses to view it. */
function VenueMap({ place, mapsHref }: { place: string; mapsHref: string }) {
  const [expanded, setExpanded] = useState(false);
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  const src = key ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${encodeURIComponent(place)}` : "";
  return <div className="in-map-wrap">
    <button type="button" className="in-map-toggle" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}><MapPin size="1.1em"/> <span>{expanded ? "Hide venue map" : "Explore the venue"}</span><ChevronDown className={expanded ? "in-map-chevron in-map-chevron--up" : "in-map-chevron"} size="1em"/></button>
    {expanded && <div className="in-map-panel">
      {src ? <iframe src={src} title={`Map of ${place}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /> : <div className="in-map-fallback"><MapPin size="2.3em" strokeWidth={1.3}/><strong>{place}</strong><p>Open directions to view the location on your map.</p></div>}
      <a href={mapsHref} target="_blank" rel="noopener noreferrer"><ExternalLink size="1em"/> Directions & nearby places</a>
    </div>}
  </div>;
}
