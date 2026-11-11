import type { DesignId, OpeningKind } from "@/engine/registry";

export type Mood = "minimal" | "romantic" | "grand" | "heritage" | "celebration";
export type AudioPreference = "undecided" | "vocal" | "duff" | "instrumental" | "ambient" | "silent";

export type ExperienceRecommendation = {
  design: DesignId;
  opening: OpeningKind;
  title: string;
  reason: string;
  audioHint: string;
};

/** Transparent starter suggestions. An occasion never implies a religion or audio preference. */
export function recommendExperience(occasion: string, mood: Mood, audio: AudioPreference): ExperienceRecommendation {
  const celebration = /mehndi|haldi|sangeet/i.test(occasion);
  const rules: Record<Mood, Omit<ExperienceRecommendation, "audioHint">> = {
    minimal: { design: "linen", opening: "script", title: "Quietly modern", reason: "Precise typography and a gentle reveal." },
    romantic: { design: "pearl", opening: "doors", title: "Softly romantic", reason: "A photograph-led invitation with a delicate unveiling." },
    grand: { design: "gilt", opening: "ignite", title: "A grand entrance", reason: "A dramatic entrance with an editorial invitation." },
    heritage: { design: "zellige", opening: "bloom", title: "Considered heritage", reason: "Decorative geometry balanced with classic stationery." },
    celebration: { design: "marigold", opening: "petals", title: "A joyful entrance", reason: "Warm colour and an expressive opening." },
  };
  const selected = celebration && mood === "romantic" ? rules.celebration : rules[mood];
  const audioHints: Record<AudioPreference, string> = {
    undecided: "Choose any soundtrack or keep it silent. Nothing is assumed from the occasion.",
    vocal: "Vocals-only nasheed: curated recordings await rights review. You can upload your own permitted MP3 now.",
    duff: "Voice and duff: recordings await rights review. You can upload your own permitted MP3 now.",
    instrumental: "Instrumental: curated recordings await rights review. You can upload your own permitted MP3 now.",
    ambient: "Ambient: curated recordings await rights review. You can upload your own permitted MP3 now.",
    silent: "No soundtrack. Any previously selected track can be removed in Style → Music.",
  };
  return { ...selected, audioHint: audioHints[audio] };
}
