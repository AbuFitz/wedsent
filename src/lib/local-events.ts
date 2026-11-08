import { PENDING_EVENTS_KEY } from "./designs";

/** Events as the Studio lists them. Stored locally until an account exists, then created on the server once. */
export type RawEvent = { id: string; title: string; starts_on: string | null; starts_at_local: string | null; venue: string; address: string; city: string; visibility: "invited" | "everyone" };

const uid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Math.random()).slice(2));

export function readLocalEvents(): RawEvent[] {
  try {
    const raw = JSON.parse(localStorage.getItem(PENDING_EVENTS_KEY) ?? "[]") as any[];
    return raw.map((e) => ({
      id: e.id ?? uid(), title: String(e.title ?? ""),
      starts_on: e.starts_on ?? e.startsOn ?? null, starts_at_local: e.starts_at_local ?? e.startsAt ?? null,
      venue: e.venue ?? "", address: e.address ?? "", city: e.city ?? "", visibility: (e.visibility === "everyone" ? "everyone" : "invited") as RawEvent["visibility"],
    })).filter((e) => e.title);
  } catch { return []; }
}
export function writeLocalEvents(list: RawEvent[]) {
  try { localStorage.setItem(PENDING_EVENTS_KEY, JSON.stringify(list)); } catch { /* storage blocked */ }
}
export const clearLocalEvents = () => { try { localStorage.removeItem(PENDING_EVENTS_KEY); } catch {} };
export const newLocalEvent = (e: Omit<RawEvent, "id">): RawEvent => ({ ...e, id: uid() });
