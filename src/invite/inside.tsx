"use client";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { CalendarPlus, ChevronDown, ExternalLink, MapPin } from "lucide-react";
import { buildEventIcs, buildIcs, dateParts, eventMapsUrl, friendlyDate, friendlyTime, mapsUrl, type InviteData, type InviteEvent } from "@/lib/designs";
import type { DesignSpec, Palette } from "@/engine/registry";
import { CountdownWidget, label } from "@/components/invitation/widgets";
import { PhotoFill } from "@/engine/photo";
import { Face } from "./face";

type Edit = "words" | "details" | "events" | "extras";
type Props = { data: InviteData; open: boolean; rsvpHref?: string; events?: InviteEvent[]; greeting?: string; spec: DesignSpec; palette: Palette; onEditTarget?: (t: Edit) => void };

function download(name: string, ics: string) {
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** The scrolling invitation: the card, a note, each celebration, a countdown, dress code, reply. */
export function Inside({ data, open, rsvpHref, events, greeting, spec, palette, onEditTarget }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const evs = events && events.length ? events : null;
  const lang = data.languages?.details ?? "en";
  const rsvpBy = data.rsvpBy ? friendlyDate(data.rsvpBy).replace(/^\w+day,? /, "") : "";
  const parts = dateParts(data.date);
  const time = friendlyTime(data.time);

  const R = ({ children, edit, className, i = 0 }: { children: ReactNode; edit?: Edit; className?: string; i?: number }) => (
    <motion.section className={className} data-studio-edit={edit} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25, root }} transition={{ duration: 0.7, delay: i * 0.05, ease: [0.2, 0.7, 0.2, 1] }}>{children}</motion.section>
  );

  return (
    <div className="inside" {...(open ? {} : { inert: true })}>
      <div ref={root} className="inside-scroll" data-studio-interactive={!!onEditTarget} onClickCapture={(event) => {
        if (!onEditTarget) return;
        const target = (event.target as HTMLElement).closest<HTMLElement>("[data-studio-edit]");
        if (!target) return;
        event.preventDefault(); event.stopPropagation();
        const s = target.dataset.studioEdit as Edit | undefined;
        if (s) onEditTarget(s);
      }}>
        <div className="in-card0" data-studio-edit="words" data-play={open}>
          <Face data={data} spec={spec} palette={palette} greeting={greeting} event={evs?.[0]} fill uid="i" />
          <span className="in-scrollhint" aria-hidden="true" />
        </div>

        {data.message.trim() && (
          <R className={`in-message in-message--${data.messageStyle || "plain"}`} edit="words">
            <span className="in-mark" aria-hidden="true" />
            <p>{data.message}</p>
          </R>
        )}

        {data.photo && spec.id !== "gallery" && (
          <R className="in-photo" edit="words"><PhotoFill photo={data.photo} /></R>
        )}

        {evs ? evs.map((ev, i) => {
          const p = dateParts(ev.startsOn ?? "");
          const t = friendlyTime(ev.startsAt ?? "");
          const place = [ev.venue, ev.city].filter(Boolean).join(", ");
          return (
            <R key={ev.id} edit="events" className="in-event" i={i}>
              <p className="in-no" aria-hidden="true">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="in-evtitle">{ev.title}</h3>
              {ev.startsOn ? <div className="in-date"><strong>{p.day}</strong><span>{p.month}<br />{p.year}</span></div> : <p className="in-sub">Date to be confirmed</p>}
              {ev.startsOn && <p className="in-sub">{p.weekday}{t && ` · ${t}`}</p>}
              {place && <p className="in-venue">{ev.venue || ev.city}</p>}
              {ev.venue && ev.city && <p className="in-sub">{ev.city}</p>}
              <div className="in-links">
                {place && <a className="in-link" href={eventMapsUrl(ev)} target="_blank" rel="noreferrer"><MapPin size="1em" /> {label(lang, "maps")}</a>}
                {ev.startsOn && <button type="button" className="in-cal" onClick={() => { const ics = buildEventIcs(ev, data.names || "Wedding"); if (ics) download(`${ev.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "event"}.ics`, ics); }}><CalendarPlus size="1.1em" /> {label(lang, "calendar")}</button>}
              </div>
              {place && <VenueMap place={place} mapsHref={eventMapsUrl(ev)} />}
            </R>
          );
        }) : (
          <>
            <R edit="details" className="in-event">
              <h3 className="in-evtitle">{label(lang, "when")}</h3>
              <div className="in-date"><strong>{parts.day}</strong><span>{parts.month}<br />{parts.year}</span></div>
              <p className="in-sub">{parts.weekday}{time && ` · ${time}`}</p>
            </R>
            <R edit="details" className="in-event" i={1}>
              <h3 className="in-evtitle">{label(lang, "where")}</h3>
              <p className="in-venue">{data.venue || "Venue to be confirmed"}</p>
              {data.city && <p className="in-sub">{data.city}</p>}
              {(data.venue || data.city) && <div className="in-links"><a className="in-link" href={mapsUrl(data)} target="_blank" rel="noreferrer"><MapPin size="1em" /> {label(lang, "maps")}</a><button type="button" className="in-cal" onClick={() => download("invitation.ics", buildIcs(data))}><CalendarPlus size="1.1em" /> {label(lang, "calendar")}</button></div>}
              {(data.venue || data.city) && <VenueMap place={[data.venue, data.city].filter(Boolean).join(", ")} mapsHref={mapsUrl(data)} />}
            </R>
          </>
        )}

        <CountdownWidget date={evs?.[0]?.startsOn ?? data.date} time={evs?.[0]?.startsAt ?? data.time} config={data.countdown ?? { enabled: false, style: "type", accent: "", label: "" }} lang={data.languages?.countdown ?? "en"} design={spec.id} />

        {data.dress.trim() && (
          <R edit="details" className="in-event in-dress"><h3 className="in-evtitle">{label(lang, "dress")}</h3><p className="in-venue">{data.dress}</p></R>
        )}

        <R edit="extras" className="in-actions">
          <p className="in-response-kicker">Will you join us?</p>
          {rsvpHref ? <Link className="in-rsvp" href={rsvpHref}>{label(data.languages?.reply ?? "en", "reply")}</Link>
            : <button type="button" className="in-rsvp" aria-disabled="true" title="Replies are switched off in previews">{label(data.languages?.reply ?? "en", "reply")}</button>}
          {rsvpBy && <p className="in-sub in-by">Please reply by {rsvpBy}</p>}
        </R>

        <p className="in-foot">Made with Wedsent</p>
      </div>
    </div>
  );
}

/** An opt-in map reveal; the Google embed only loads after a guest chooses to open it. */
function VenueMap({ place, mapsHref }: { place: string; mapsHref: string }) {
  const [on, setOn] = useState(false);
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  const src = key ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${encodeURIComponent(place)}` : "";
  return (
    <div className="in-map-wrap">
      <button type="button" className="in-map-toggle" aria-expanded={on} onClick={() => setOn(!on)}><MapPin size="1.1em" /><span>{on ? "Hide map" : "View the venue"}</span><ChevronDown size="1em" style={{ transform: on ? "rotate(180deg)" : undefined } as CSSProperties} /></button>
      {on && (
        <div className="in-map-panel">
          {src ? <iframe src={src} title={`Map of ${place}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            : <div className="in-map-fallback"><MapPin size="2.3em" strokeWidth={1.3} /><strong>{place}</strong></div>}
          <a href={mapsHref} target="_blank" rel="noopener noreferrer"><ExternalLink size="1em" /> Directions</a>
        </div>
      )}
    </div>
  );
}
