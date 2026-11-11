/**
 * The design engine's data model. A design is a *spec*: opening gesture + stationery layout + surface + art +
 * palettes + type pairing. Content (names, events...) is separate and survives switching designs.
 * Pure TypeScript, safe to import on the server (validation) and the client (rendering).
 */
/** How an invitation opens. `veil`, `focus` and `curtain` are legacy values kept so old drafts still load; they render as `script`/`bloom`. */
export type OpeningKind = "lift" | "doors" | "bloom" | "ignite" | "script" | "kinetic" | "grow" | "petals" | "veil" | "focus" | "curtain";
export type ArtKind = "none" | "plates" | "photo" | "ornament" | "pearl" | "foil";
export type Shape = "Portrait" | "Arch" | "Frame" | "Full bleed" | "Minimal" | "Gatefold";

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
  { id: "editorial2", name: "Editorial", note: "Newsreader, high contrast", head: '"Newsreader Variable", Georgia, serif', body: '"Geist Variable", sans-serif', caps: '"Geist Variable", sans-serif' },
  { id: "editorial", name: "Display", note: "Instrument Serif with Geist", head: '"Instrument Serif", serif', body: '"Geist Variable", sans-serif', caps: '"Geist Variable", sans-serif' },
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
  layout: "stationery";
  fonts: string;            // default FontPack id (or "own" for designs with bespoke CSS type)
  art: ArtKind;
  palettes: Palette[];
  intro: string;            // default intro preset id
  sample: { names: string; occasion: string };
  site: { bg: string; ink: string };  // marketing-page tone for this design
};

export const DESIGN_IDS = ["vellum", "gilt", "pearl", "botanica", "marigold", "zellige", "gallery", "linen"] as const;
export type DesignId = (typeof DESIGN_IDS)[number];
export const FEATURED_DESIGN_IDS: readonly DesignId[] = DESIGN_IDS;

/** Designs from earlier versions resolve to the nearest current design so saved drafts and published weddings still render. */
export const LEGACY_DESIGN: Record<string, DesignId> = {
  embossed: "vellum", rosewood: "pearl", velvet: "gilt", heritage: "zellige", "nikah-etched": "zellige", atelier: "vellum",
  nocturne: "gilt", postmark: "linen", arch: "pearl", zest: "linen", mono: "gallery",
};
export const normalizeDesignId = (id: unknown): DesignId => (DESIGN_IDS as readonly string[]).includes(id as string) ? (id as DesignId) : LEGACY_DESIGN[id as string] ?? "pearl";

const pal = (id: string, name: string, accent: string, rest: Partial<Palette> = {}): Palette => ({ id, name, accent, ...rest });

export const OPENINGS: Record<OpeningKind, { label: string; hint: string }> = {
  lift: { label: "Swipe up to open", hint: "The cover lifts away like a sheet of paper, following your thumb" },
  doors: { label: "Tap to open", hint: "A folded card opens from the middle, like a gatefold invitation" },
  bloom: { label: "Tap to open", hint: "The invitation opens outward from exactly where you touch" },
  ignite: { label: "Tap to open", hint: "A line of foil draws the frame, then the names light up" },
  script: { label: "Tap to open", hint: "The names are written out in ink, then the card turns" },
  kinetic: { label: "Tap to open", hint: "Type rises into place over your photograph" },
  grow: { label: "Tap to open", hint: "Botanical plates grow in from the edges around the names" },
  petals: { label: "Tap to open", hint: "Petals fall and settle, then the invitation opens" },
  veil: { label: "Tap to open", hint: "The cover softly clears" },
  focus: { label: "Tap to open", hint: "Typography moves into focus" },
  curtain: { label: "Tap to open", hint: "The cover parts" },
};

/** Which openings a couple can pick in the Studio (legacy ones are not offered). */
export const OPENING_CHOICES: OpeningKind[] = ["lift", "doors", "bloom", "ignite", "script", "kinetic", "grow", "petals"];

const D = (d: Omit<DesignSpec, "layout" | "opening"> & { opening: { kind: OpeningKind } }): DesignSpec => ({ ...d, layout: "stationery", opening: { kind: d.opening.kind, ...OPENINGS[d.opening.kind] } });

export const DESIGNS: DesignSpec[] = [
  D({
    id: "pearl", name: "Pearl", family: "Pearlescent", blurb: "Iridescent pearl stock, a quiet embossed monogram, and a folded card that opens from the middle.",
    styles: ["Elegant & Formal", "Simple & Minimalist", "Modern"], colours: ["Pastel", "Ivory & Gold", "Neutral Tones"], shape: "Gatefold", cultures: ["Any wedding", "Nikah", "Church", "Civil"],
    opening: { kind: "doors" }, fonts: "classic", art: "pearl", intro: "none", sample: { names: "Emily & James", occasion: "Wedding" },
    site: { bg: "#E9E4EE", ink: "#2B2433" },
    palettes: [
      pal("pearl", "Pearl", "#8A7A93", { bg: "#EFEAF0", fg: "#2F2837", soft: "#F8F5F9", line: "#CFC3D6" }),
      pal("blush", "Blush pearl", "#A9707A", { bg: "#F4E8E8", fg: "#3A2328", soft: "#FBF4F4", line: "#DDBFC2" }),
      pal("mist", "Sea mist", "#4F6F78", { bg: "#E6EEEE", fg: "#1F3236", soft: "#F4F8F8", line: "#BCD0D2" }),
      pal("champagne", "Champagne", "#A18454", { bg: "#F1EADB", fg: "#3A2F1C", soft: "#FAF6EC", line: "#D8C9A5" }),
    ],
  }),
  D({
    id: "vellum", name: "Vellum", family: "Letterpress", blurb: "A translucent vellum sheet over a letterpress card. Lift it with your thumb.",
    styles: ["Simple & Minimalist", "Classic & Traditional", "Calligraphy"], colours: ["Neutral Tones", "Earthy"], shape: "Portrait", cultures: ["Any wedding", "Church", "Garden", "Civil"],
    opening: { kind: "lift" }, fonts: "pinyon", art: "none", intro: "families", sample: { names: "Clara & Theo", occasion: "Wedding" },
    site: { bg: "#EDEAE3", ink: "#25231F" },
    palettes: [
      pal("ivory", "Ivory", "#6E5B3F", { bg: "#F3EFE6", fg: "#2A241B", soft: "#FAF8F2", line: "#D9D0BE" }),
      pal("slate", "Slate", "#455566", { bg: "#E9ECEF", fg: "#1E2630", soft: "#F6F7F9", line: "#C5CDD5" }),
      pal("sage", "Sage", "#587060", { bg: "#E8ECE6", fg: "#1F2D24", soft: "#F5F7F3", line: "#C3CDBE" }),
      pal("rose", "Dusty rose", "#9A5E66", { bg: "#F2E8E6", fg: "#3A2326", soft: "#FAF4F3", line: "#DDC4C3" }),
    ],
  }),
  D({
    id: "gilt", name: "Gilt", family: "Foil", blurb: "Black card, gold foil. A line of foil draws the frame and the names light up.",
    styles: ["Elegant & Formal", "Glam", "Modern"], colours: ["Black & White", "Metallic", "Jewel"], shape: "Frame", cultures: ["Any wedding", "Evening", "Nikah", "Walima"],
    opening: { kind: "ignite" }, fonts: "didone", art: "foil", intro: "none", sample: { names: "Layla & Omar", occasion: "Wedding" },
    site: { bg: "#111111", ink: "#F1E7C8" },
    palettes: [
      pal("noir", "Noir & gold", "#D2AE62", { bg: "#111010", fg: "#F2EAD6", soft: "#1A1817", line: "#B8944A" }),
      pal("midnight", "Midnight & silver", "#C5CCD8", { bg: "#0E1420", fg: "#EEF1F6", soft: "#151D2D", line: "#9AA6BC" }),
      pal("bordeaux", "Bordeaux & gold", "#D6B46C", { bg: "#2A0F18", fg: "#F6E9D2", soft: "#371621", line: "#C29B55" }),
      pal("forest", "Forest & gold", "#CDB06A", { bg: "#0E2019", fg: "#F0E7CE", soft: "#152C23", line: "#B89B58" }),
    ],
  }),
  D({
    id: "botanica", name: "Botanica", family: "Botanical", blurb: "Antique botanical plates grow in around formal calligraphy on warm cotton paper.",
    styles: ["Floral & Botanical", "Calligraphy", "Classic & Traditional"], colours: ["Earthy", "Pastel", "Neutral Tones"], shape: "Portrait", cultures: ["Any wedding", "Church", "Garden"],
    opening: { kind: "grow" }, fonts: "pinyon", art: "plates", intro: "families", sample: { names: "Eleanor & James", occasion: "Wedding" },
    site: { bg: "#E8E1D3", ink: "#2A2F26" },
    palettes: [
      pal("rose", "Pink peony", "#A8566A", { bg: "#F5EFE4", fg: "#3B2A2A", soft: "#FBF7EF", line: "#D9C7B8", art: ["peony-pink", "rose-wild"] }),
      pal("crimson", "Crimson", "#8E2B42", { bg: "#F3ECE0", fg: "#3A1D24", soft: "#FAF5EC", line: "#D6C2B2", art: ["peony-crimson", "rose-red"] }),
      pal("blush", "Blush rose", "#9E5F5B", { bg: "#F6EEE6", fg: "#40292A", soft: "#FCF7F1", line: "#DDC8BB", art: ["peony-paxton", "rose-sprig"] }),
      pal("olive", "Olive & cream", "#6E7A44", { bg: "#F3EFE1", fg: "#2F3320", soft: "#FAF7EC", line: "#D3CDAE", art: ["olive-b", "rose-sprig"] }),
    ],
  }),
  D({
    id: "marigold", name: "Marigold", family: "Celebration", blurb: "Saffron, magenta and real marigold plates for mehndi, haldi and sangeet. Petals fall, then it opens.",
    styles: ["Maximalism", "Bold & Typographic", "Hand Drawn"], colours: ["Bright", "Jewel"], shape: "Portrait", cultures: ["Mehndi", "Haldi", "Sangeet", "Shaadi", "Dholki"],
    opening: { kind: "petals" }, fonts: "display", art: "plates", intro: "shubh", sample: { names: "Priya & Arjun", occasion: "Mehndi" },
    site: { bg: "#F2B33D", ink: "#33102B" },
    palettes: [
      pal("saffron", "Saffron & magenta", "#A81F55", { bg: "#FBE3A1", fg: "#33102B", soft: "#FFF2CC", line: "#E5A93C", art: ["marigold-african", "marigold-orange"] }),
      pal("rani", "Rani pink", "#B7255C", { bg: "#FCDDE7", fg: "#44112B", soft: "#FFF0F4", line: "#EFA3BD", art: ["marigold-orange", "marigold-french"] }),
      pal("peacock", "Peacock", "#0F5C5A", { bg: "#D5EEE8", fg: "#0A2E2D", soft: "#ECF8F5", line: "#8CC7BE", art: ["marigold-french", "marigold-african"] }),
      pal("coral", "Coral & teal", "#B3432A", { bg: "#FFE3D4", fg: "#3C1B12", soft: "#FFF3EC", line: "#F0B49C", art: ["marigold-orange", "marigold-african"] }),
    ],
  }),
  D({
    id: "zellige", name: "Zellige", family: "Heritage", blurb: "Gold geometry from historic ornament plates, with room for an opening line in your language.",
    styles: ["Classic & Traditional", "Glam", "Maximalism"], colours: ["Jewel", "Ivory & Gold", "Metallic"], shape: "Frame", cultures: ["Nikah", "Walima", "Arabic", "Persian", "Turkish", "Moroccan"],
    opening: { kind: "bloom" }, fonts: "classic", art: "ornament", intro: "bismillah", sample: { names: "Aisha & Yusuf", occasion: "Nikah" },
    site: { bg: "#0F3D33", ink: "#F3E7C4" },
    palettes: [
      pal("emerald", "Emerald & gold", "#C9A24B", { bg: "#0F3D33", fg: "#F3E7C4", soft: "#14493D", line: "#B8923F", art: ["orn-moresque-b", "orn-tile-a"] }),
      pal("burgundy", "Burgundy & gold", "#D9B66A", { bg: "#4E1220", fg: "#F6E8CF", soft: "#5D1A2A", line: "#C9A45A", art: ["orn-moresque-b", "orn-tile-a"] }),
      pal("midnight", "Midnight & silver", "#C8CED8", { bg: "#101A33", fg: "#EEF1F6", soft: "#16234A", line: "#9AA5BC", art: ["orn-moresque-b", "orn-tile-a"] }),
      pal("ivory", "Ivory & emerald", "#1F5C4D", { bg: "#F6F0E1", fg: "#16372E", soft: "#FBF7EC", line: "#C9A24B", art: ["orn-moresque-b", "orn-tile-a"] }),
    ],
  }),
  D({
    id: "gallery", name: "Gallery", family: "Editorial", blurb: "Your photograph, full bleed, with your names set large like a magazine cover. Type rises into place.",
    styles: ["Full Bleed Photo", "Modern", "Elegant & Formal"], colours: ["Neutral Tones", "Black & White", "Earthy"], shape: "Full bleed", cultures: ["Any wedding", "Civil", "Evening", "Nikah"],
    opening: { kind: "kinetic" }, fonts: "editorial2", art: "photo", intro: "none", sample: { names: "Hannah & James", occasion: "Wedding" },
    site: { bg: "#E9E4DB", ink: "#1D1A15" },
    palettes: [
      pal("ink", "Ink", "#1D1A15", { bg: "#F4F1EA", fg: "#1D1A15", soft: "#FBF9F4", line: "#CFC8B8" }),
      pal("sand", "Sand", "#7A5F3E", { bg: "#EFE6D8", fg: "#2D2318", soft: "#F8F2E8", line: "#CDBB9F" }),
      pal("sage", "Sage", "#4F6B57", { bg: "#E8EDE4", fg: "#1F2D24", soft: "#F4F7F1", line: "#BFCDBB" }),
      pal("rose", "Rose", "#9A4A57", { bg: "#F5E9E6", fg: "#3A1E24", soft: "#FBF4F2", line: "#DDBFC0" }),
    ],
  }),
  D({
    id: "linen", name: "Linen", family: "Minimal", blurb: "Woven linen and almost nothing else. The names are written out in ink.",
    styles: ["Simple & Minimalist", "Modern", "Calligraphy"], colours: ["Neutral Tones", "Black & White"], shape: "Minimal", cultures: ["Any wedding", "Civil", "Church"],
    opening: { kind: "script" }, fonts: "vibes", art: "none", intro: "none", sample: { names: "Maya & Theo", occasion: "Wedding" },
    site: { bg: "#EFEBE3", ink: "#1B1B19" },
    palettes: [
      pal("oat", "Oat", "#3B3A36", { bg: "#EFEBE2", fg: "#232220", soft: "#F7F4EE", line: "#D4CEC0" }),
      pal("stone", "Stone", "#4B5560", { bg: "#E8EAEC", fg: "#1E252C", soft: "#F5F6F7", line: "#C5CBD1" }),
      pal("clay", "Clay", "#8C4A35", { bg: "#EEE4DB", fg: "#3A2218", soft: "#F8F2EC", line: "#D8C5B6" }),
      pal("moss", "Moss", "#55623F", { bg: "#E9ECE0", fg: "#242B18", soft: "#F5F7EF", line: "#CDD3BC" }),
    ],
  }),
];

export const specById = (id: string): DesignSpec => DESIGNS.find((d) => d.id === normalizeDesignId(id)) ?? DESIGNS[0];
export const paletteOf = (spec: DesignSpec, id?: string) => spec.palettes.find((p) => p.id === id) ?? spec.palettes[0];
export const FEATURED_DESIGNS = DESIGNS;

/** Filter facets for the gallery (mirrors how Evite groups designs: style, colour, shape, plus culture and opening). */
export const FACETS = {
  style: Array.from(new Set(FEATURED_DESIGNS.flatMap((d) => d.styles))).sort(),
  colour: Array.from(new Set(FEATURED_DESIGNS.flatMap((d) => d.colours))).sort(),
  shape: Array.from(new Set(FEATURED_DESIGNS.map((d) => d.shape))).sort(),
  culture: Array.from(new Set(FEATURED_DESIGNS.flatMap((d) => d.cultures))).sort(),
  opening: Array.from(new Set(FEATURED_DESIGNS.map((d) => d.opening.kind))).sort(),
};
