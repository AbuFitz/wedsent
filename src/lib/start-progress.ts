import type { InviteData } from "./designs";

export const START_PROGRESS_KEY = "wedsent-start-progress-v1";

export const START_STEPS = ["names", "date", "celebrate", "design", "style", "details", "preview"] as const;
export type StartStep = (typeof START_STEPS)[number];

export type StartProgress = {
  step: StartStep;
  draft: InviteData;
  preset: string;
  events: string[];
  undecided: boolean;
  source?: string;
};

/** Reject malformed, old or unexpectedly large session snapshots. */
export function parseStartProgress(raw: string | null): StartProgress | null {
  if (!raw || raw.length > 160_000) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const p = value as Partial<StartProgress>;
    if (!START_STEPS.includes(p.step as StartStep) || !p.draft || typeof p.draft !== "object") return null;
    if (typeof p.draft.names !== "string" || !Array.isArray(p.events) || p.events.length > 8 || !p.events.every((x) => typeof x === "string" && x.length <= 80)) return null;
    if (typeof p.preset !== "string" || p.preset.length > 32 || typeof p.undecided !== "boolean") return null;
    return p as StartProgress;
  } catch { return null; }
}
