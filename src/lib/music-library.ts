/** Small, source-attributed CC0 demo selection. Do not add tracks without reviewing their specific rights. */
export const DEMO_TRACKS = [
  { id: "quiet-room", title: "Quiet Room", mood: "Calm ambient", creator: "AERIS MUSIC", file: "quiet-room.mp3" },
  { id: "afterglow-vast", title: "Afterglow Vast", mood: "Warm instrumental", creator: "AERIS MUSIC", file: "afterglow-vast.mp3" },
  { id: "old-photos-outlands", title: "Old Photos", mood: "Nostalgic instrumental", creator: "AERIS MUSIC", file: "old-photos-outlands.mp3" },
] as const;

export const demoTrackById = (id: string) => DEMO_TRACKS.find((track) => track.id === id);
export const demoTrackSrc = (id: string) => `/library/${id}`;
export const isDemoTrackSrc = (src: string) => DEMO_TRACKS.some((track) => demoTrackSrc(track.id) === src);

export const DEMO_TRACK_LICENCE = "https://github.com/farmmer938-lgtm/aeris-cc0-music/blob/main/LICENSE";

/** Source-attributed recordings selected for review. Only explicitly approved records are exposed in Studio. */
export const CURATED_TRACKS = [
  {
    id: "owner-paradise-humming", title: "Paradise Humming", artist: "Nasheed Harmony", mood: "Gentle humming · serene", category: "nasheed" as const,
    src: "/audio/paradise-humming.mp3", source: "", license: "Owner-authorised recording", licenseUrl: "", note: "Owner confirmed permission on 8 November 2026.",
  },
  {
    id: "owner-rawaa", title: "Rawaa’", artist: "Raid al-Qahtani", mood: "Warm nasheed · expressive", category: "nasheed" as const,
    src: "/audio/rawaa.mp3", source: "", license: "Owner-authorised recording", licenseUrl: "", note: "Owner confirmed permission on 8 November 2026.",
  },
  {
    id: "owner-wedding-nasheed", title: "Wedding Nasheed (Muffled)", artist: "Maruf Mohammad Jisan", mood: "Soft, subdued nasheed", category: "nasheed" as const,
    src: "/audio/wedding-nasheed-muffled.mp3", source: "", license: "Owner-authorised recording", licenseUrl: "", note: "Source audio is intentionally muffled; check its quality before sharing.",
  },
  {
    id: "owner-min-awel-dekika", title: "Min Awel Dekika", artist: "Elissa", mood: "Arabic wedding song · lyrical", category: "songs" as const,
    src: "/audio/min-awel-dekika.mp3", source: "", license: "Owner-authorised recording", licenseUrl: "", note: "Commercial song supplied by the owner; permission scope should be documented.",
  },
  {
    id: "nasheed-alhamdulillah",
    title: "Alhamdulillah (Vocals Only)",
    artist: "Jawad Syed / SyedsLife",
    mood: "Reflective vocals",
    category: "nasheed" as const,
    src: "/library/nasheed-alhamdulillah",
    source: "https://commons.wikimedia.org/wiki/File:Jawad_Syed_-_Alhamdulilah_(Vocal_Only_Nasheed).flac",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    note: "Source file is FLAC; playback varies by browser and connection.",
  },
  {
    id: "satie-gymnopedie",
    title: "Gymnopédie No. 1",
    artist: "Erik Satie · recording by Teknopazzo",
    mood: "Soft piano · intimate and minimal",
    category: "instrumental" as const,
    src: "/library/satie-gymnopedie",
    source: "https://commons.wikimedia.org/wiki/File:Gymnopedie_No._1..ogg",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    note: "Source recording in the public domain; MP3 transcode by Wikimedia Commons.",
  },
  {
    id: "chopin-nocturne",
    title: "Nocturne in E minor",
    artist: "Frédéric Chopin · Musopen recording",
    mood: "Romantic piano · reflective and cinematic",
    category: "instrumental" as const,
    src: "/library/chopin-nocturne",
    source: "https://commons.wikimedia.org/wiki/File:Chopin_-_Nocturne_Op._posth._72_no._1.ogg",
    license: "CC0 1.0 (Commons record)",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    note: "Musopen sourced recording; licence and performer provenance should be rechecked before paid release.",
  },
] as const;
