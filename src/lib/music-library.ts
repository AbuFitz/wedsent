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
