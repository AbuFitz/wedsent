"use client";
import type { CSSProperties } from "react";
import { asset } from "./assets";
import { fit, friendlyDate, friendlyTime, splitNames, type InviteData, type InviteEvent } from "@/lib/designs";
import { INTRO_PRESETS, introText, type DesignSpec, type Palette } from "./registry";

const lang = (t: string) => (/[؀-ۿ]/.test(t) ? "ar" : /[ऀ-ॿ]/.test(t) ? "hi" : /[㐀-鿿]/.test(t) ? "zh" : "");
export function resolveIntro(data: InviteData, spec: DesignSpec) {
  if (data.intro === "none") return "";
  if (data.intro) return data.intro;
  return introText(spec.intro);
}
void INTRO_PRESETS;

function Cut({ id, className, style }: { id: string; className: string; style?: CSSProperties }) {
  const a = asset(id);
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`sc-cut ${className}`} src={a.src} width={a.w} height={a.h} alt="" aria-hidden="true" decoding="async" draggable={false} style={style} />;
}
function Ink({ id, className, style }: { id: string; className: string; style?: CSSProperties }) {
  const a = asset(id);
  return <span aria-hidden="true" className={`sc-ink ${className}`} style={{ ["--mask" as string]: `url(${a.src})`, aspectRatio: `${a.w} / ${a.h}`, ...style }} />;
}

/** The first thing a guest sees inside: the stationery card, composed from real plates and ornament masks. */
export function StationeryCard({ data, spec, palette, greeting, event }: { data: InviteData; spec: DesignSpec; palette: Palette; greeting?: string; event?: InviteEvent }) {
  const names = splitNames(data.names);
  const intro = resolveIntro(data, spec);
  const il = lang(intro);
  const [A, B] = palette.art ?? [];
  const date = event?.startsOn ?? data.date, time = event?.startsAt ?? data.time;
  const venue = event?.venue || data.venue, city = event?.city || data.city;
  const occ = (data.occasion || "wedding").toLowerCase();
  const nameLine = names.joined ? [names.a, names.b] : [names.a];
  const longest = Math.max(...nameLine.map((n) => n.length));
  const script = spec.fonts === "own" ? false : true;
  const size = fit("x".repeat(longest + (names.joined ? 3 : 0)), 70, script ? 0.42 : 0.5, script ? 13 : 11, 7);

  const wording =
    spec.id === "botanica" ? `request the pleasure of your company at the ${occ} of`
    : spec.id === "arch" ? `invite you to celebrate the ${occ} of`
    : spec.id === "marigold" ? `celebrate the ${occ} of`
    : `${data.occasion || "Wedding"}`;

  return (
    <section className={`sc sc--${spec.id}`} aria-label="Invitation">
      {spec.id === "botanica" && (<>
        <Cut id={A ?? "peony-pink"} className="sc-a1" />
        <Cut id={B ?? "rose-wild"} className="sc-a2" />
        <Cut id="olive-b" className="sc-a3" />
      </>)}
      {spec.id === "arch" && (<>
        <svg className="sc-archline" viewBox="0 0 100 150" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="foil-a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8F6B2A" /><stop offset=".35" stopColor="#F0DA98" /><stop offset=".6" stopColor="#B88B3A" /><stop offset=".85" stopColor="#F7E9B8" /><stop offset="1" stopColor="#9A7330" /></linearGradient></defs>
          <path d="M3 148V50A47 47 0 0 1 97 50V148Z" fill="none" stroke="url(#foil-a)" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
          <path d="M7 148V51A43 43 0 0 1 93 51V148Z" fill="none" stroke="url(#foil-a)" strokeWidth=".5" vectorEffect="non-scaling-stroke" />
        </svg>
        <Cut id={A ?? "peony-pink"} className="sc-a1" />
        <Cut id={B ?? "rose-sprig"} className="sc-a2" />
      </>)}
      {spec.id === "zellige" && (<>
        <Ink id="orn-tile-a" className="sc-tiles" />
        <span className="sc-mihrab" aria-hidden="true"><Ink id="orn-moresque-b" className="sc-panel" /></span>
      </>)}
      {spec.id === "marigold" && (<>
        <Ink id="orn-roundel-a" className="sc-medal" />
        <Cut id={A ?? "marigold-african"} className="sc-a1" />
        <Cut id={B ?? "marigold-orange"} className="sc-a2" />
      </>)}

      <div className="sc-text">
        {greeting && <p className="sc-for">For {greeting}</p>}
        {intro && <p className={`sc-intro${il ? ` sc-${il}` : ""}`} lang={il || undefined} dir={il === "ar" ? "rtl" : undefined}>{intro}</p>}
        <p className="sc-line">{wording}</p>
        <h2 className="sc-names" style={{ fontSize: `${size}cqw` }}>
          {nameLine[0]}
          {names.joined && <><span className="sc-and">&amp;</span>{nameLine[1]}</>}
        </h2>
        <p className="sc-date">{date ? friendlyDate(date) : "Date to be announced"}{friendlyTime(time) && <span> · {friendlyTime(time)}</span>}</p>
        {(venue || city) && <p className="sc-venue">{[venue, city].filter(Boolean).join(", ")}</p>}
      </div>
    </section>
  );
}
