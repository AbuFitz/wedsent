"use client";
import type { CSSProperties } from "react";
import { asset } from "@/engine/assets";
import { PhotoFill } from "@/engine/photo";
import { fit, friendlyDate, friendlyTime, splitNames, type InviteData, type InviteEvent } from "@/lib/designs";
import { introText, type DesignSpec, type Palette } from "@/engine/registry";

const lang = (t: string) => (/[؀-ۿ]/.test(t) ? "ar" : /[ऀ-ॿ]/.test(t) ? "hi" : /[㐀-鿿]/.test(t) ? "zh" : "");

export function resolveIntro(data: InviteData, spec: DesignSpec) {
  if (data.intro === "none") return "";
  if (data.intro) return introText(data.intro) || data.intro;
  return introText(spec.intro);
}
export const initials = (names: string) => {
  const n = splitNames(names);
  return ((n.a[0] ?? "") + (n.b[0] ?? "")).toUpperCase() || "W";
};

function Cut({ id, className }: { id: string; className: string }) {
  const a = asset(id);
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`fc-cut ${className}`} src={a.src} width={a.w} height={a.h} alt="" aria-hidden="true" decoding="async" draggable={false} />;
}
function Ink({ id, className }: { id: string; className: string }) {
  const a = asset(id);
  return <span aria-hidden="true" className={`fc-ink ${className}`} style={{ ["--mask" as string]: `url(${a.src})`, aspectRatio: `${a.w} / ${a.h}` } as CSSProperties} />;
}

/** Foil frame whose stroke can be drawn on (stroke-dashoffset) by the `ignite` opening. */
function FoilFrame({ id }: { id: string }) {
  return (
    <svg className="fc-frame" viewBox="0 0 100 160" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="var(--line)" /><stop offset=".35" stopColor="#fff3c9" /><stop offset=".6" stopColor="var(--line)" /><stop offset=".85" stopColor="#fff3c9" /><stop offset="1" stopColor="var(--line)" /></linearGradient></defs>
      <rect className="fc-draw" x="5" y="5" width="90" height="150" fill="none" stroke={`url(#${id})`} strokeWidth="1" vectorEffect="non-scaling-stroke" pathLength={1} />
      <rect className="fc-draw fc-draw--in" x="8.4" y="8.4" width="83.2" height="143.2" fill="none" stroke={`url(#${id})`} strokeWidth=".5" vectorEffect="non-scaling-stroke" pathLength={1} />
    </svg>
  );
}

/**
 * One composition per design. Used as the full-screen cover (`fill`) and as the printed card at the top of the scroll.
 * Everything is sized in cqw so it renders identically as a thumbnail, in a phone frame, or full screen.
 */
export function Face({ data, spec, palette, greeting, event, fill, uid = "a" }: { data: InviteData; spec: DesignSpec; palette: Palette; greeting?: string; event?: InviteEvent; fill?: boolean; uid?: string }) {
  const names = splitNames(data.names);
  const intro = resolveIntro(data, spec);
  const il = lang(intro);
  const [A, B] = palette.art ?? [];
  const date = event?.startsOn ?? data.date, time = event?.startsAt ?? data.time;
  const venue = event?.venue || data.venue, city = event?.city || data.city;
  const occ = (data.occasion || "wedding").toLowerCase();
  const lines = names.joined ? [names.a, names.b] : [names.a];
  const longest = Math.max(...lines.map((n) => n.length));
  const script = ["pinyon", "vibes", "allura", "parisienne"].includes(data.type || spec.fonts);
  const size = fit("x".repeat(longest + (names.joined ? 3 : 0)), 74, script ? 0.4 : 0.5, spec.id === "gallery" ? 17 : script ? 15 : 13, 7);
  const photo = data.photo;
  const wording =
    spec.id === "botanica" ? `request the pleasure of your company at the ${occ} of`
    : spec.id === "pearl" ? `invite you to celebrate the ${occ} of`
    : spec.id === "gilt" ? `request the honour of your presence at the ${occ} of`
    : spec.id === "zellige" ? `request the honour of your presence at the ${occ} of`
    : spec.id === "marigold" ? `celebrate the ${occ} of`
    : spec.id === "vellum" ? `together with their families, invite you to the ${occ} of`
    : data.occasion || "Wedding";

  return (
    <section className={`face face--${spec.id}${photo ? " face--photo" : ""}${fill ? " face--fill" : ""}`} aria-label="Invitation" data-opening={data.opening || spec.opening.kind}>
      {/* ---- material and art, per design ---- */}
      {spec.id === "pearl" && (<><span className="fc-sheen" aria-hidden="true" /><span className="fc-fold" aria-hidden="true" /><span className="fc-mono" aria-hidden="true">{initials(data.names)}</span></>)}
      {spec.id === "vellum" && (<><span className="fc-press" aria-hidden="true" />{fill && <span className="fc-vellum" aria-hidden="true" />}</>)}
      {spec.id === "gilt" && (<><FoilFrame id={`foil-${uid}`} /><span className="fc-glow" aria-hidden="true" /></>)}
      {spec.id === "botanica" && (<><Cut id={A ?? "peony-pink"} className="fc-a1" /><Cut id={B ?? "rose-wild"} className="fc-a2" /><Cut id="olive-b" className="fc-a3" /></>)}
      {spec.id === "marigold" && (<><span className="fc-toran" aria-hidden="true" /><Cut id={A ?? "marigold-african"} className="fc-a1" /><Cut id={B ?? "marigold-orange"} className="fc-a2" /></>)}
      {spec.id === "zellige" && (<><Ink id="orn-tile-a" className="fc-tiles" /><span className="fc-mihrab" aria-hidden="true"><Ink id="orn-moresque-b" className="fc-panel" /></span></>)}
      {spec.id === "gallery" && (
        <div className="fc-photo" aria-hidden={!photo}>{photo ? <PhotoFill photo={photo} /> : <span className="fc-nophoto" />}<span className="fc-shade" /></div>
      )}
      {spec.id === "linen" && <span className="fc-rule" aria-hidden="true" />}

      <div className="fc-text">
        {greeting && <p className="fc-for">For {greeting}</p>}
        {intro && <p className={`fc-intro${il ? ` fc-${il}` : ""}`} lang={il || undefined} dir={il === "ar" ? "rtl" : undefined}>{intro}</p>}
        <p className="fc-line">{wording}</p>
        <h2 className="fc-names" style={{ fontSize: `${size}cqw` }} aria-label={lines.join(" and ")}>
          {lines.map((l, i) => (
            <span className="fc-mask" key={i}>
              {i === 1 && <span className="fc-and">&amp;</span>}
              <span className="fc-name" style={{ ["--i" as string]: i } as CSSProperties}>{l}</span>
            </span>
          ))}
        </h2>
        <p className="fc-date">{date ? friendlyDate(date) : "Date to be announced"}{friendlyTime(time) && <span> · {friendlyTime(time)}</span>}</p>
        {(venue || city) && <p className="fc-venue">{[venue, city].filter(Boolean).join(", ")}</p>}
      </div>
    </section>
  );
}
