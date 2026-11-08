import { DESIGNS, DESIGN_IDS, paletteOf, specById, type DesignId, type OpeningKind } from "@/engine/registry";
export type { DesignId };

/** A cover photograph. `src` is /media/<id> (uploaded), /art/<file> (library artwork) or a data: URL (signed-out local draft). fx/fy are the focal point, 0-100. */
export type Photo = { src: string; fx: number; fy: number };
export type WidgetLanguage = "en" | "fr" | "ar" | "so";
export type CountdownStyle = "type" | "tiles" | "dial";
export type CountdownConfig = { enabled: boolean; style: CountdownStyle; accent: string; label: string };
export type SectionLanguages = { details: WidgetLanguage; countdown: WidgetLanguage; reply: WidgetLanguage };

export type InviteData = {
  names: string;
  occasion: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm or ""
  venue: string;
  city: string;
  message: string;
  dress: string;
  rsvpBy: string; // yyyy-mm-dd or ""
  accent: string; // custom colour override; "" = the palette's accent
  address: string; // street and postcode (optional)
  photo: Photo | null; // cover photograph (upload or library artwork) with focal point
  design: DesignId;
  palette: string; // palette id within the design; "" = the design's first
  type: string; // font pairing id; "" = the design's own
  intro: string; // opening line text; "" = the design's default, "none" = no line
  opening: OpeningKind | ""; // "" = the design's art-directed opening; otherwise a selected motion
  countdown: CountdownConfig;
  languages: SectionLanguages;
};

export const defaults: InviteData = {
  names: "Amina & Yusuf",
  occasion: "Wedding",
  date: "2027-06-12",
  time: "16:00",
  venue: "The Glasshouse",
  city: "London",
  message: "A little love, a lot of joy. Come celebrate with us.",
  dress: "",
  rsvpBy: "",
  accent: "",
  address: "",
  photo: null,
  design: "botanica",
  palette: "",
  type: "",
  intro: "",
  opening: "",
  countdown: { enabled: false, style: "type", accent: "", label: "" },
  languages: { details: "en", countdown: "en", reply: "en" },
};

export { DESIGN_IDS };

/** Compatibility view of a design for the marketing site and Studio lists. */
export type DesignMeta = {
  id: DesignId;
  name: string;
  mood: string;
  opening: string;
  openingHint: string;
  bg: string; // page tone used on the marketing site
  ink: string;
  accents: string[]; // first is the default
};

export const designs: DesignMeta[] = DESIGNS.map((d) => ({
  id: d.id, name: d.name, mood: d.blurb, opening: d.opening.label, openingHint: d.opening.hint,
  bg: d.site.bg, ink: d.site.ink, accents: d.palettes.map((p) => p.accent),
}));

export const designById = (id: string): DesignMeta =>
  designs.find((d) => d.id === id) ?? designs[0];

export const accentFor = (d: InviteData) => d.accent || paletteOf(specById(d.design), d.palette).accent;

const parse = (v: string) => {
  const d = new Date(`${v}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};

export function friendlyDate(v: string) {
  const d = parse(v);
  return d
    ? new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d)
    : "Date to be announced";
}

export function dateParts(v: string) {
  const d = parse(v);
  if (!d) return { day: "--", month: "---", year: "----", weekday: "" };
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", o).format(d);
  return { day: f({ day: "2-digit" }), month: f({ month: "short" }), year: f({ year: "numeric" }), weekday: f({ weekday: "long" }) };
}

export function friendlyTime(t: string) {
  if (!/^\d{2}:\d{2}$/.test(t)) return "";
  const [h, m] = t.split(":").map(Number);
  return new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(2000, 0, 1, h, m));
}

export function daysUntil(v: string) {
  const d = parse(v);
  if (!d) return null;
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  return Math.round((d.getTime() - now.getTime()) / 86400000);
}

export function mapsUrl(d: InviteData) {
  return eventMapsUrl(d);
}

/** Split "Amina & Yusuf" into display lines. Falls back to one line. */
export function splitNames(raw: string) {
  const n = raw.trim() || "Your names";
  const m = n.split(/\s*(?:&|\band\b|\+)\s*/i);
  return m.length === 2 && m[0] && m[1] ? { a: m[0], b: m[1], joined: true } : { a: n, b: "", joined: false };
}

export const DRAFT_KEY = "wedsent-draft-v8";

export function loadDraft(): InviteData {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return defaults;
    const saved = JSON.parse(raw);
    const parsed = { ...defaults, ...saved, countdown: { ...defaults.countdown, ...saved.countdown }, languages: { ...defaults.languages, ...saved.languages } };
    parsed.design = designById(parsed.design).id;
    if (parsed.photo && typeof parsed.photo.src !== "string") parsed.photo = null;
    return parsed;
  } catch {
    return defaults;
  }
}

export function saveDraft(d: InviteData) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    return true;
  } catch {
    return false;
  }
}

/** Readable text colour on a given background: whichever of dark/light has the higher WCAG contrast. */
export function onColor(hex: string, dark = "#17120D", light = "#FFFFFF") {
  const lum = (h: string) => {
    const x = h.replace("#", "");
    if (x.length !== 6) return 0;
    const [r, g, b] = [0, 2, 4].map((i) => { const c = parseInt(x.slice(i, i + 2), 16) / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a: string, b: string) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };
  return ratio(hex, dark) >= ratio(hex, light) ? dark : light;
}

/** Font size (in cqw) so `text` fits one line in `width` cqw. */
export function fit(text: string, width: number, perChar: number, max: number, min = 8) {
  const len = Math.max(text.length, 1);
  return Math.max(min, Math.min(max, width / (len * perChar)));
}

/** A real .ics file for the event, generated in the browser. */
export function buildIcs(d: InviteData) {
  const date = d.date.replace(/-/g, "");
  const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  const hasTime = /^\d{2}:\d{2}$/.test(d.time);
  let start = `DTSTART;VALUE=DATE:${date}`;
  let end = "";
  if (hasTime) {
    const t = d.time.replace(":", "") + "00";
    const endH = String((parseInt(d.time.slice(0, 2), 10) + 4) % 24).padStart(2, "0");
    start = `DTSTART:${date}T${t}`;
    end = `DTEND:${date}T${endH}${d.time.slice(3)}00`;
  }
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedsent//Invitation//EN", "BEGIN:VEVENT",
    `UID:${date}-${Math.abs(hashCode(d.names + d.venue))}@wedsent`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    start, end,
    `SUMMARY:${esc(`${d.names} — ${d.occasion || "Celebration"}`)}`,
    `LOCATION:${esc([d.venue, d.city].filter(Boolean).join(", "))}`,
    "END:VEVENT", "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
}
function hashCode(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/** An event as the invitation renders it. Dates are plain yyyy-mm-dd / HH:mm strings. */
export type InviteEvent = { id: string; title: string; startsOn: string | null; startsAt: string | null; venue: string; city: string; address?: string };

export const eventMapsUrl = (e: { venue: string; city: string; address?: string }) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([e.venue, e.address, e.city].filter(Boolean).join(", "))}`;
export const appleMapsUrl = (e: { venue: string; city: string; address?: string }) =>
  `https://maps.apple.com/?q=${encodeURIComponent([e.venue, e.address, e.city].filter(Boolean).join(", "))}`;

/** A real .ics for one event. */
export function buildEventIcs(e: InviteEvent, couple: string) {
  const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  const date = (e.startsOn ?? "").replace(/-/g, "");
  if (!date) return "";
  const hasTime = !!e.startsAt && /^\d{2}:\d{2}$/.test(e.startsAt);
  const t = hasTime ? e.startsAt!.replace(":", "") + "00" : "";
  const endH = hasTime ? String((parseInt(e.startsAt!.slice(0, 2), 10) + 3) % 24).padStart(2, "0") + e.startsAt!.slice(3) + "00" : "";
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedsent//Invitation//EN", "BEGIN:VEVENT",
    `UID:${e.id}@wedsent`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    hasTime ? `DTSTART:${date}T${t}` : `DTSTART;VALUE=DATE:${date}`,
    hasTime ? `DTEND:${date}T${endH}` : "",
    `SUMMARY:${esc(`${e.title} — ${couple}`)}`,
    `LOCATION:${esc([e.venue, e.city].filter(Boolean).join(", "))}`,
    "END:VEVENT", "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
}

export const PENDING_EVENTS_KEY = "wedsent-pending-events-v1";
