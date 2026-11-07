export type DesignId = "zest" | "mono" | "nocturne";

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
  accent: string; // "" = design default
  design: DesignId;
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
  design: "zest",
};

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

export const designs: DesignMeta[] = [
  {
    id: "zest",
    name: "Vermilion",
    mood: "Warm, artistic, quietly expressive",
    opening: "Tap the envelope",
    openingHint: "Flap lifts, card rises, envelope drops away",
    bg: "#9F4E3B",
    ink: "#2A1714",
    accents: ["#9F4E3B", "#875759", "#355C52", "#6F6683", "#946A3D"],
  },
  {
    id: "mono",
    name: "Monolith",
    mood: "Big type, hard edges, one colour",
    opening: "Swipe up",
    openingHint: "The cover lifts under your thumb like a shutter",
    bg: "#EDEDE8",
    ink: "#0C0C0C",
    accents: ["#2437F2", "#0C0C0C", "#D8342A", "#0F7B5F", "#7A3FF2"],
  },
  {
    id: "nocturne",
    name: "Nocturne",
    mood: "Slow, dark, cinematic",
    opening: "Press and hold",
    openingHint: "A ring fills while the names come into focus",
    bg: "#0B0A0F",
    ink: "#F4EFE6",
    accents: ["#E8C98A", "#F4EFE6", "#C9A7FF", "#8FD3C2", "#FF8F7A"],
  },
];

export const designById = (id: string): DesignMeta =>
  designs.find((d) => d.id === id) ?? designs[0];

export const accentFor = (d: InviteData) => d.accent || designById(d.design).accents[0];

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
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([d.venue, d.city].filter(Boolean).join(", "))}`;
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
    const parsed = { ...defaults, ...JSON.parse(raw) };
    parsed.design = designById(parsed.design).id;
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

/** Readable text colour on a given background. */
export function onColor(hex: string, dark = "#17120D", light = "#FFFFFF") {
  const h = hex.replace("#", "");
  if (h.length !== 6) return dark;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L > 0.3 ? dark : light;
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
