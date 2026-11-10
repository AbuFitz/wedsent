import { describe, expect, it } from "vitest";
import { defaults } from "../src/lib/designs";
import { parseStartProgress } from "../src/lib/start-progress";

describe("unfinished invitation setup", () => {
  const progress = { step: "design", draft: { ...defaults, names: "Amina & Yusuf" }, preset: "nikah", events: ["Nikah", "Walima"], undecided: true };

  it("restores a valid partially completed setup", () => {
    expect(parseStartProgress(JSON.stringify(progress))).toEqual(progress);
  });

  it("ignores bad snapshots without crashing setup", () => {
    expect(parseStartProgress("not json")).toBeNull();
    expect(parseStartProgress(JSON.stringify({ ...progress, step: "wrong" }))).toBeNull();
    expect(parseStartProgress(JSON.stringify({ ...progress, events: Array(9).fill("Guest") }))).toBeNull();
    expect(parseStartProgress(JSON.stringify({ ...progress, draft: null }))).toBeNull();
  });
});
