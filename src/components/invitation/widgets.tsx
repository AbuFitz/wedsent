"use client";
import { useEffect, useState, type CSSProperties } from "react";
import type { CountdownConfig, WidgetLanguage } from "@/lib/designs";

/** UI labels only. Couple-authored wording and names are never machine-translated. */
const copy = {
  en: { when: "When", where: "Where", dress: "Dress code", maps: "Open in Maps", calendar: "Add to calendar", reply: "Reply", days: "Days", hours: "Hours", minutes: "Minutes", soon: "The celebration is here", countdown: "Counting down" },
  fr: { when: "Quand", where: "Où", dress: "Tenue", maps: "Voir sur la carte", calendar: "Ajouter au calendrier", reply: "Répondre", days: "Jours", hours: "Heures", minutes: "Minutes", soon: "Le grand jour est arrivé", countdown: "Compte à rebours" },
  ar: { when: "الموعد", where: "المكان", dress: "اللباس", maps: "افتح الخريطة", calendar: "أضف إلى التقويم", reply: "الرد", days: "يوم", hours: "ساعة", minutes: "دقيقة", soon: "حان يوم الاحتفال", countdown: "العد التنازلي" },
  so: { when: "Goorta", where: "Goobta", dress: "Labbiska", maps: "Ka eeg khariidadda", calendar: "Ku dar jadwalka", reply: "Ka jawaab", days: "Maalmood", hours: "Saacadood", minutes: "Daqiiqado", soon: "Maalintii dabaaldegga waa timid", countdown: "Tirinta maalmaha" },
} as const;

export function label(lang: WidgetLanguage, key: keyof typeof copy.en) { return copy[lang]?.[key] ?? copy.en[key]; }

function remaining(date: string, time: string) {
  const target = new Date(`${date}T${/^\d{2}:\d{2}$/.test(time) ? time : "12:00"}:00`);
  if (!date || Number.isNaN(target.getTime())) return null;
  const minutes = Math.max(0, Math.floor((target.getTime() - Date.now()) / 60000));
  return { days: Math.floor(minutes / 1440), hours: Math.floor((minutes % 1440) / 60), minutes: minutes % 60, done: minutes <= 0 };
}

export function CountdownWidget({ date, time, config, lang, design }: { date: string; time: string; config: CountdownConfig; lang: WidgetLanguage; design?: string }) {
  const [now, setNow] = useState<ReturnType<typeof remaining>>(null);
  useEffect(() => {
    const update = () => setNow(remaining(date, time));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, [date, time]);
  if (!config.enabled || !date) return null;
  const title = config.label.trim() || label(lang, "countdown");
  const tone = config.accent || "var(--a)";
  const world = design === "velvet" || design === "gilt" || design === "nocturne" ? "theatre"
    : design === "heritage" || design === "nikah-etched" || design === "rosewood" ? "engraved"
    : design === "pearl" || design === "embossed" || design === "botanica" ? "botanical"
    : design === "gallery" || design === "postmark" || design === "atelier" ? "editorial" : "classic";
  const segments = now ? [{ n: now.days, key: "days" }, { n: now.hours, key: "hours" }, { n: now.minutes, key: "minutes" }] as const : null;
  return (
    <section className={`in-countdown in-countdown--${config.style} in-countdown--${world}`} style={{ "--count-tone": tone } as CSSProperties} aria-label={title} dir={lang === "ar" ? "rtl" : undefined} lang={lang}>
      <div className="in-count-ornament" aria-hidden="true"><span /><i>{world === "theatre" ? "✦" : world === "engraved" ? "❦" : world === "botanical" ? "✿" : world === "editorial" ? "·" : "◇"}</i><span /></div>
      <p className="in-count-title">{title}</p>
      {now?.done ? <p className="in-count-done">{label(lang, "soon")}</p> : (
        <div className="in-count-segments">
          {(segments ?? [{ n: 0, key: "days" }, { n: 0, key: "hours" }, { n: 0, key: "minutes" }] as const).map((segment) => (
            <div className="in-count-segment" key={segment.key}>
              <strong>{new Intl.NumberFormat(lang, { minimumIntegerDigits: 2, useGrouping: false }).format(segment.n)}</strong>
              <span>{label(lang, segment.key)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
