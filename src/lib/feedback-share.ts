import { defaults, type InviteData, type InviteEvent } from "@/lib/designs";
import { DESIGN_IDS } from "@/engine/registry";

export type FeedbackShare = { data: InviteData; events: InviteEvent[] };

/** Feedback-only link: contains a self-contained copy. No household tokens or private RSVP data. */
export function makeFeedbackLink(data: InviteData, events: InviteEvent[]): string {
  const copy: InviteData = { ...data, photo: null, music: data.music?.src === "local-music" || data.music?.src.startsWith("/music/") ? null : data.music };
  const json = JSON.stringify({ v: 1, data: copy, events: events.slice(0, 8).map(({ title, startsOn, startsAt, venue, city }, i) => ({ id: `share-${i}`, title, startsOn, startsAt, venue, city })) });
  const bytes = new TextEncoder().encode(json);
  if (bytes.length > 6000) throw new Error("This draft contains too much text for a feedback link.");
  const encoded = btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(""))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${window.location.origin}/share#${encoded}`;
}

export function readFeedbackLink(hash: string): FeedbackShare | null {
  try {
    if (!hash || hash.length > 10000) return null;
    const raw = atob(hash.replace(/-/g, "+").replace(/_/g, "/"));
    const decoded = new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(raw, (c) => c.charCodeAt(0)));
    const candidate = JSON.parse(decoded);
    if (candidate.v !== 1 || !candidate.data || !DESIGN_IDS.includes(candidate.data.design)) return null;
    const values = candidate.data;
    if (typeof values.names !== "string" || values.names.length > 60 || typeof values.message !== "string" || values.message.length > 300) return null;
    const data: InviteData = { ...defaults, ...values, photo: null, music: values.music?.src?.startsWith("/library/") ? values.music : null };
    const events: InviteEvent[] = Array.isArray(candidate.events) ? candidate.events.slice(0, 8).filter((e: InviteEvent) => e && typeof e.title === "string" && e.title.length <= 80).map((e: InviteEvent, i: number) => ({ id: `share-${i}`, title: e.title, startsOn: e.startsOn || null, startsAt: e.startsAt || null, venue: String(e.venue || "").slice(0, 80), city: String(e.city || "").slice(0, 80) })) : [];
    return { data, events };
  } catch { return null; }
}
