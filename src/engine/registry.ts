/**
 * The design engine's data model. A design is a *spec*: opening gesture + stationery layout + surface + art +
 * palettes + type pairing. Content (names, events...) is separate and survives switching designs.
 * Pure TypeScript, safe to import on the server (validation) and the client (rendering).
 */
export type OpeningKind = "envelope" | "shutter" | "hold" | "gates" | "iris" | "curtain";
export type ArtKind = "none" | "wreath" | "peony" | "arch" | "stars" | "mandala" | "paisley";
export type Shape = "Portrait" | "Arch" | "Frame" | "Full bleed" | "Scalloped";

export type Palette = {
  id: string; name: string;
  accent: string;          // primary colour of the design
  bg?: string; fg?: string; soft?: string; line?: string;
  art?: string[];          // asset ids (public-domain plates / ink masks) used by this palette
};

export type FontPack = {
  id: string; name: string; note: string;
  head: string;            // names and display lines
  script?: string;         // calligraphic names (optional)
  body: string;            // details
  caps?: string;           // small-caps labels
};

export const FONT_PACKS: FontPack[] = [
  { id: "classic", name: "Classic serif", note: "Cormorant, timeless and light", head: '"Cormorant Garamond Variable", Georgia, serif', body: '"Jost Variable", "Geist Variable", sans-serif', caps: '"Cormorant Garamond Variable", serif' },
  { id: "pinyon", name: "Formal calligraphy", note: "Pinyon Script with Cormorant", head: '"Cormorant Garamond Variable", serif', script: '"Pinyon Script", cursive', body: '"Cormorant Garamond Variable", serif', caps: '"Cormorant Garamond Variable", serif' },
  { id: "vibes", name: "Romantic script", note: "Great Vibes with Jost", head: '"Cormorant Garamond Variable", serif', script: '"Great Vibes", cursive', body: '"Jost Variable", sans-serif', caps: '"Jost Variable", sans-serif' },
  { id: "allura", name: "Fashion script", note: "Allura with Bodoni", head: '"Bodoni Moda Variable", serif', script: '"Allura", cursive', body: '"Jost Variable", sans-serif', caps: '"Bodoni Moda Variable", serif' },
  { id: "parisienne", name: "Soft script", note: "Parisienne with Playfair", head: '"Playfair Display Variable", serif', script: '"Parisienne", cursive', body: '"Jost Variable", sans-serif', caps: '"Playfair Display Variable", serif' },
  { id: "didone", name: "Modern Didone", note: "Bodoni Moda, high contrast", head: '"Bodoni Moda Variable", serif', body: '"Jost Variable", sans-serif', caps: '"Jost Variable", sans-serif' },
  { id: "deco", name: "Art deco", note: "Cinzel with Tenor Sans", head: '"Cinzel Variable", serif', body: '"Tenor Sans", sans-serif', caps: '"Cinzel Variable", serif' },
  { id: "italiana", name: "Elegant roman", note: "Italiana with Marcellus", head: '"Italiana", serif', body: '"Marcellus", serif', caps: '"Marcellus", serif' },
  { id: "garamond", name: "Literary", note: "EB Garamond throughout", head: '"EB Garamond Variable", serif', body: '"EB Garamond Variable", serif', caps: '"EB Garamond Variable", serif' },
  { id: "editorial", name: "Editorial", note: "Instrument Serif with Geist", head: '"Instrument Serif", serif', body: '"Geist Variable", sans-serif', caps: '"Geist Variable", sans-serif' },
  { id: "display", name: "Heritage display", note: "DM Serif Display with Jost", head: '"DM Serif Display", serif', body: '"Jost Variable", sans-serif', caps: '"Jost Variable", sans-serif' },
];
export const fontPackById = (id: string | undefined) => FONT_PACKS.find((f) => f.id === id);

/** Optional opening lines. Never assumed: the default is none or a neutral line. */
export type IntroPreset = { id: string; label: string; text: string; lang?: "ar" | "hi"; group: string };
export const INTRO_PRESETS: IntroPreset[] = [
  { id: "none", label: "None", text: "", group: "Neutral" },
  { id: "families", label: "Together with their families", text: "Together with their families", group: "Neutral" },
  { id: "pleasure", label: "Request the pleasure of your company", text: "Request the pleasure of your company", group: "Neutral" },
  { id: "joy", label: "With joy in their hearts", text: "With joy in their hearts", group: "Neutral" },
  { id: "blessings", label: "With the blessings of God", text: "With the blessings of God", group: "Faith" },
  { id: "bismillah", label: "Bismillah (Arabic)", text: "بسم الله الرحمن الرحيم", lang: "ar", group: "Islamic" },
  { id: "bismillah-en", label: "In the name of God, the Most Gracious", text: "In the name of God, the Most Gracious, the Most Merciful", group: "Islamic" },
  { id: "shubh", label: "Shubh Vivah (Hindi)", text: "शुभ विवाह", lang: "hi", group: "South Asian" },
  { id: "ganesh", label: "Shri Ganeshaya Namah", text: "श्री गणेशाय नमः", lang: "hi", group: "South Asian" },
  { id: "mazel", label: "Siman tov u'mazel tov", text: "Siman tov u’mazel tov", group: "Jewish" },
  { id: "double", label: "Double happiness", text: "囍", group: "East Asian" },
];
export const introText = (id: string) => INTRO_PRESETS.find((i) => i.id === id)?.text ?? id;

export type DesignSpec = {
  id: DesignId; name: string; family: string; blurb: string;
  styles: string[]; colours: string[]; shape: Shape; cultures: string[];
  opening: { kind: OpeningKind; label: string; hint: string };
  layout: "stationery" | "cards" | "editorial" | "chapters";
  fonts: string;            // default FontPack id (or "own" for designs with bespoke CSS type)
  art: ArtKind;
  palettes: Palette[];
  intro: string;            // default intro preset id
  sample: { names: string; occasion: string };
  site: { bg: string; ink: string };  // marketing-page tone for this design
};

export const DESIGN_IDS = ["botanica", "arch", "zellige", "marigold", "zest", "mono", "nocturne"] as const;
export type DesignId = (typeof DESIGN_IDS)[number];

const pal = (id: string, name: string, accent: string, rest: Partial<Palette> = {}): Palette => ({ id, name, accent, ...rest });

export const DESIGNS: DesignSpec[] = [
  {
    id: "botanica", name: "Botanica", family: "Botanical", blurb: "Antique botanical plates around formal calligraphy, sealed in a lined envelope.",
    styles: ["Floral & Botanical", "Calligraphy", "Classic & Traditional"], colours: ["Earthy", "Neutral Tones", "Pastel"], shape: "Portrait", cultures: ["Any wedding", "Church", "Garden"],
    opening: { kind: "envelope", label: "Break the seal", hint: "Tap the wax seal; the flap lifts and the card rises" },
    layout: "stationery", fonts: "pinyon", art: "wreath", intro: "families", sample: { names: "Eleanor & James", occasion: "Wedding" },
    site: { bg: "#E8E1D3", ink: "#2A2F26" },
    palettes: [
      pal("rose", "Pink peony", "#B9697A", { bg: "#F7F1E6", fg: "#3B2A2A", soft: "#FBF7EF", line: "#D9C7B8", art: ["peony-pink", "rose-wild"] }),
      pal("crimson", "Crimson", "#8E2B42", { bg: "#F5EEE3", fg: "#3A1D24", soft: "#FAF5EC", line: "#D6C2B2", art: ["peony-crimson", "rose-red"] }),
      pal("blush", "Blush rose", "#C58A86", { bg: "#F8F0E8", fg: "#40292A", soft: "#FCF7F1", line: "#DDC8BB", art: ["peony-paxton", "rose-sprig"] }),
      pal("olive", "Olive & cream", "#6E7A44", { bg: "#F5F1E4", fg: "#2F3320", soft: "#FAF7EC", line: "#D3CDAE", art: ["olive-b", "rose-sprig"] }),
    ],
  },
  {
    id: "arch", name: "Foil Arch", family: "Contemporary romantic", blurb: "A tall arched window in gold foil, opened like double doors.",
    styles: ["Modern", "Elegant & Formal", "Simple & Minimalist"], colours: ["Earthy", "Pastel", "Ivory & Gold"], shape: "Arch", cultures: ["Any wedding", "Nikah", "Civil", "Church"],
    opening: { kind: "gates", label: "Open the doors", hint: "Swipe or tap and the arched doors part" },
    layout: "stationery", fonts: "classic", art: "arch", intro: "none", sample: { names: "Amara & Daniel", occasion: "Wedding" },
    site: { bg: "#EBD9CC", ink: "#3B2218" },
    palettes: [
      pal("terracotta", "Terracotta", "#B5654A", { bg: "#EBD3C5", fg: "#4A271B", soft: "#FAF1EA", line: "#C9A24B", art: ["peony-pink", "rose-sprig"] }),
      pal("sage", "Sage", "#5F7E67", { bg: "#D9E3D3", fg: "#26382B", soft: "#F6F8F1", line: "#C9A24B", art: ["peony-paxton", "olive-b"] }),
      pal("midnight", "Midnight", "#243B5E", { bg: "#D3DAE8", fg: "#16243C", soft: "#F5F7FB", line: "#C9A24B", art: ["peony-crimson", "rose-sprig"] }),
      pal("plum", "Plum", "#6D3D57", { bg: "#E8D6DF", fg: "#3A1E2D", soft: "#FBF4F7", line: "#C9A24B", art: ["peony-pink", "rose-red"] }),
    ],
  },
  {
    id: "zellige", name: "Zellige", family: "Heritage", blurb: "Gold geometry on deep emerald, a lattice that opens like a lantern.",
    styles: ["Classic & Traditional", "Glam", "Maximalism"], colours: ["Jewel", "Ivory & Gold", "Metallic"], shape: "Frame", cultures: ["Nikah", "Walima", "Arabic", "Persian", "Turkish", "Moroccan"],
    opening: { kind: "iris", label: "Touch the star", hint: "The lattice blooms open from the centre" },
    layout: "stationery", fonts: "classic", art: "stars", intro: "bismillah", sample: { names: "Aisha & Yusuf", occasion: "Nikah" },
    site: { bg: "#0F3D33", ink: "#F3E7C4" },
    palettes: [
      pal("emerald", "Emerald & gold", "#C9A24B", { bg: "#0F3D33", fg: "#F3E7C4", soft: "#14493D", line: "#B8923F", art: ["orn-moresque-b", "orn-tile-a"] }),
      pal("burgundy", "Burgundy & gold", "#D9B66A", { bg: "#4E1220", fg: "#F6E8CF", soft: "#5D1A2A", line: "#C9A45A", art: ["orn-moresque-b", "orn-tile-a"] }),
      pal("midnight", "Midnight & silver", "#C8CED8", { bg: "#101A33", fg: "#EEF1F6", soft: "#16234A", line: "#9AA5BC", art: ["orn-moresque-b", "orn-tile-a"] }),
      pal("ivory", "Ivory & emerald", "#1F5C4D", { bg: "#F6F0E1", fg: "#16372E", soft: "#FBF7EC", line: "#C9A24B", art: ["orn-moresque-b", "orn-tile-a"] }),
    ],
  },
  {
    id: "marigold", name: "Marigold", family: "Celebration", blurb: "Saffron, magenta and teal with paisley, opened like parting curtains.",
    styles: ["Maximalism", "Bold & Typographic", "Hand Drawn"], colours: ["Bright", "Jewel"], shape: "Scalloped", cultures: ["Mehndi", "Haldi", "Sangeet", "Shaadi", "Dholki"],
    opening: { kind: "curtain", label: "Draw the curtains", hint: "Tap and the drapes part to reveal the invitation" },
    layout: "stationery", fonts: "display", art: "paisley", intro: "shubh", sample: { names: "Priya & Arjun", occasion: "Mehndi" },
    site: { bg: "#F6B93B", ink: "#3A1030" },
    palettes: [
      pal("saffron", "Saffron & magenta", "#B0245B", { bg: "#FBE4A6", fg: "#3A1030", soft: "#FFF3CF", line: "#E5A93C", art: ["marigold-african", "marigold-orange"] }),
      pal("rani", "Rani pink", "#D6336C", { bg: "#FDE1EA", fg: "#4A1230", soft: "#FFF1F5", line: "#F0A6C0", art: ["marigold-orange", "marigold-french"] }),
      pal("peacock", "Peacock", "#0F5C5A", { bg: "#D8EFEA", fg: "#0A2E2D", soft: "#EEF9F6", line: "#8CC7BE", art: ["marigold-french", "marigold-african"] }),
      pal("coral", "Coral & teal", "#E0603F", { bg: "#FFE5D8", fg: "#3C1B12", soft: "#FFF3EC", line: "#F0B49C", art: ["marigold-orange", "marigold-african"] }),
    ],
  },
  {
    id: "zest", name: "Vermilion", family: "Stationery", blurb: "Warm clay and cream: a paper card tucked in a lined envelope.",
    styles: ["Classic & Traditional", "Simple & Minimalist"], colours: ["Earthy", "Neutral Tones"], shape: "Portrait", cultures: ["Any wedding"],
    opening: { kind: "envelope", label: "Tap the envelope", hint: "Flap lifts, card rises, envelope drops away" },
    layout: "cards", fonts: "own", art: "none", intro: "none", sample: { names: "Amina & Yusuf", occasion: "Wedding" },
    site: { bg: "#9F4E3B", ink: "#2A1714" },
    palettes: ["#9F4E3B", "#875759", "#355C52", "#6F6683", "#946A3D"].map((a, i) => pal(["clay", "rose", "forest", "dusk", "ochre"][i], ["Clay", "Rose", "Forest", "Dusk", "Ochre"][i], a)),
  },
  {
    id: "mono", name: "Monolith", family: "Bold typographic", blurb: "Huge condensed type, hard rules and one colour. A shutter you pull up.",
    styles: ["Bold & Typographic", "Modern"], colours: ["Black & White", "Bright"], shape: "Full bleed", cultures: ["Any wedding"],
    opening: { kind: "shutter", label: "Swipe up", hint: "The cover lifts under your thumb like a shutter" },
    layout: "editorial", fonts: "own", art: "none", intro: "none", sample: { names: "Hannah & James", occasion: "Wedding" },
    site: { bg: "#EDEDE8", ink: "#0C0C0C" },
    palettes: ["#2437F2", "#0C0C0C", "#D8342A", "#0F7B5F", "#7A3FF2"].map((a, i) => pal(["cobalt", "ink", "red", "green", "violet"][i], ["Cobalt", "Ink", "Signal red", "Green", "Violet"][i], a)),
  },
  {
    id: "nocturne", name: "Nocturne", family: "Cinematic", blurb: "Near-black with gold foil and slow light. Hold the ring to begin.",
    styles: ["Elegant & Formal", "Glam"], colours: ["Black & White", "Metallic"], shape: "Full bleed", cultures: ["Any wedding", "Evening"],
    opening: { kind: "hold", label: "Press and hold", hint: "A ring fills while the names come into focus" },
    layout: "chapters", fonts: "own", art: "none", intro: "families", sample: { names: "Layla & Omar", occasion: "Wedding" },
    site: { bg: "#0B0A0F", ink: "#F4EFE6" },
    palettes: ["#E8C98A", "#F4EFE6", "#C9A7FF", "#8FD3C2", "#FF8F7A"].map((a, i) => pal(["gold", "pearl", "amethyst", "jade", "coral"][i], ["Gold", "Pearl", "Amethyst", "Jade", "Coral"][i], a)),
  },
];

export const specById = (id: string): DesignSpec => DESIGNS.find((d) => d.id === id) ?? DESIGNS[0];
export const paletteOf = (spec: DesignSpec, id?: string) => spec.palettes.find((p) => p.id === id) ?? spec.palettes[0];

/** Filter facets for the gallery (mirrors how Evite groups designs: style, colour, shape, plus culture and opening). */
export const FACETS = {
  style: Array.from(new Set(DESIGNS.flatMap((d) => d.styles))).sort(),
  colour: Array.from(new Set(DESIGNS.flatMap((d) => d.colours))).sort(),
  shape: Array.from(new Set(DESIGNS.map((d) => d.shape))).sort(),
  culture: Array.from(new Set(DESIGNS.flatMap((d) => d.cultures))).sort(),
  opening: Array.from(new Set(DESIGNS.map((d) => d.opening.kind))).sort(),
};
