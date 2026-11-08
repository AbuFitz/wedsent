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
  {
    id: "bridal-chorus",
    title: "Bridal Chorus",
    artist: "Richard Wagner · European Archive recording",
    mood: "Ceremonial · traditional entrance",
    category: "instrumental" as const,
    src: "/library/bridal-chorus",
    source: "https://commons.wikimedia.org/wiki/File:Richard_Wagner_-_Treulich_geführt,_version_2.ogg",
    license: "CC0 1.0 (Commons record)",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    note: "Traditional ceremony selection; sourced from European Archive via Musopen.",
  },
] as const;
