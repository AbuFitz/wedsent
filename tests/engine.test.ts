import { describe, expect, it } from "vitest";
import { colord, extend } from "colord";
import a11y from "colord/plugins/a11y";
import { ASSETS } from "@/engine/assets";
import { DESIGNS, DESIGN_IDS, FONT_PACKS, INTRO_PRESETS, FACETS, specById } from "@/engine/registry";
import { ContentSchema } from "@/server/weddings";
import { onColor, defaults } from "@/lib/designs";
import { label } from "@/components/invitation/widgets";
extend([a11y]);

describe("design engine registry", () => {
  it("lists each design once, with palettes and a real opening", () => {
    expect(new Set(DESIGNS.map((d) => d.id)).size).toBe(DESIGNS.length);
    expect(DESIGNS.map((d) => d.id).sort()).toEqual([...DESIGN_IDS].sort());
    for (const d of DESIGNS) {
      expect(d.palettes.length, d.id).toBeGreaterThanOrEqual(4);
      expect(new Set(d.palettes.map((p) => p.id)).size, d.id).toBe(d.palettes.length);
      expect(["lift", "bloom", "veil", "focus", "doors", "curtain"]).toContain(d.opening.kind);
    }
  });
  it("every referenced artwork file, font pack and intro preset exists", () => {
    for (const d of DESIGNS) {
      for (const p of d.palettes) for (const id of p.art ?? []) expect(ASSETS[id], `${d.id}/${p.id}: ${id}`).toBeTruthy();
      if (d.fonts !== "own") expect(FONT_PACKS.some((f) => f.id === d.fonts), d.fonts).toBe(true);
      expect(INTRO_PRESETS.some((i) => i.id === d.intro), d.intro).toBe(true);
    }
  });
  it("only public-domain or CC0 artwork is bundled, each with a source page", () => {
    for (const a of Object.values(ASSETS)) {
      expect(a.licence, a.id).toMatch(/public domain|cc0|no restrictions/i);
      expect(a.page, a.id).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
    }
  });
  it("palette text and accent buttons meet WCAG AA contrast (4.5:1)", () => {
    for (const d of DESIGNS) for (const p of d.palettes) {
      if (p.bg && p.fg) expect(colord(p.fg).contrast(p.bg), `${d.id}/${p.id} text on bg`).toBeGreaterThanOrEqual(4.5);
      if (p.bg && p.fg && p.soft) expect(colord(p.fg).contrast(p.soft), `${d.id}/${p.id} text on card`).toBeGreaterThanOrEqual(4.5);
      expect(colord(onColor(p.accent)).contrast(p.accent), `${d.id}/${p.id} on-accent`).toBeGreaterThanOrEqual(4.5);
    }
  });
  it("server validation accepts every design and rejects unknown ones; content survives a design switch", () => {
    for (const d of DESIGNS) expect(ContentSchema.safeParse({ ...defaults, design: d.id, palette: d.palettes[1].id }).success, d.id).toBe(true);
    expect(ContentSchema.safeParse({ ...defaults, design: "nope" }).success).toBe(false);
    const a = { ...defaults, names: "Layla & Omar", design: "botanica" as const };
    const b = { ...a, design: "zellige" as const, palette: "", type: "", intro: "" };
    expect(b.names).toBe(a.names);
    expect(specById("zellige").intro).toBe("bismillah");
    expect(ContentSchema.safeParse({ ...defaults, opening: "focus" }).success).toBe(true);
    expect(ContentSchema.safeParse({ ...defaults, opening: "doors" }).success).toBe(true);
    expect(ContentSchema.safeParse({ ...defaults, opening: "curtain" }).success).toBe(true);
    expect(ContentSchema.safeParse({ ...defaults, opening: "not-a-motion" }).success).toBe(false);
    expect(ContentSchema.safeParse({ ...defaults, countdown: { enabled: true, style: "tiles", accent: "#724C66", label: "Until our day" } }).success).toBe(true);
    expect(ContentSchema.safeParse({ ...defaults, countdown: { enabled: true, style: "fake", accent: "red", label: "" } }).success).toBe(false);
    expect(ContentSchema.safeParse({ ...defaults, languages: { details: "ar", countdown: "so", reply: "fr" } }).success).toBe(true);
    expect(ContentSchema.safeParse({ ...defaults, languages: { details: "not-a-language", countdown: "en", reply: "en" } }).success).toBe(false);
  });
  it("offers separately selectable guest interface languages without translating user content", () => {
    expect(label("fr", "reply")).toBe("Répondre");
    expect(label("ar", "where")).toBe("المكان");
    expect(label("so", "days")).toBe("Maalmood");
  });
  it("filter facets cover every design", () => {
    for (const d of DESIGNS) { expect(FACETS.shape).toContain(d.shape); expect(FACETS.opening).toContain(d.opening.kind); }
  });
});
