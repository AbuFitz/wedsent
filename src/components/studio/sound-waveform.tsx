"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import { Pause, Play, RotateCcw } from "lucide-react";
import { registerAudioPlayer } from "@/lib/audio-focus";

type Props = {
  src: string;
  title: string;
  start: number;
  end?: number;
  onTrim: (start: number, end: number) => void;
};

const format = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

/** A source-aware audio editor with a draggable excerpt region. When a remote
 * source denies waveform decoding, ordinary native playback remains available. */
export function SoundWaveform({ src, title, start, end, onTrim }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const player = useRef<WaveSurfer | null>(null);
  const region = useRef<ReturnType<RegionsPlugin["addRegion"]> | null>(null);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [waveError, setWaveError] = useState(false);
  const trimRef = useRef(onTrim);
  trimRef.current = onTrim;

  useEffect(() => {
    if (!root.current) return;
    setWaveError(false); setDuration(0); setPlaying(false);
    const regions = RegionsPlugin.create();
    const ws = WaveSurfer.create({
      container: root.current, url: src, height: 88, normalize: true,
      waveColor: "#cac9c6", progressColor: "#111111", cursorColor: "#111111",
      barWidth: 2, barGap: 2, barRadius: 2, plugins: [regions],
    });
    const unregisterAudio = registerAudioPlayer(ws.getMediaElement());
    player.current = ws;
    ws.on("ready", (length) => {
      setDuration(length);
      const startAt = Math.min(Math.max(0, start), Math.max(0, length - 1));
      const finish = Math.min(length, Math.max(startAt + 1, end ?? Math.min(length, startAt + 15)));
      region.current = regions.addRegion({ id: "excerpt", start: startAt, end: finish, color: "rgba(91,61,245,.16)", drag: true, resize: true });
    });
    regions.on("region-updated", (r) => {
      trimRef.current(Math.round(r.start * 10) / 10, Math.round(r.end * 10) / 10);
    });
    regions.on("region-out", (r) => { if (ws.isPlaying()) ws.setTime(r.start); });
    ws.on("play", () => setPlaying(true));
    ws.on("pause", () => setPlaying(false));
    ws.on("error", () => setWaveError(true));
    return () => { region.current = null; player.current = null; unregisterAudio(); ws.destroy(); };
    // A new track gets a new waveform; region changes are handled without reloading audio.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    const r = region.current;
    if (!r || !duration) return;
    const from = Math.min(Math.max(0, start), duration - 1);
    const to = Math.min(duration, Math.max(from + 1, end ?? duration));
    if (Math.abs(r.start - from) > .15 || Math.abs(r.end - to) > .15) r.setOptions({ start: from, end: to });
  }, [start, end, duration]);

  return <section className="st-wave" aria-label={`Edit ${title}`}>
    <div className="st-wave-title"><strong>Your selected excerpt</strong><span>{duration ? `${format(start)} to ${format(end ?? duration)}` : "Drag the handles to choose a moment"}</span></div>
    <div ref={root} className="st-wave-visual" aria-label="Audio waveform timeline" />
    {waveError && <p className="st-wave-fallback">Waveform unavailable for this source. You can still play and enter start/end times below.</p>}
    <div className="st-wave-actions">
      <button type="button" disabled={!duration || waveError} onClick={() => {
        const ws = player.current;
        if (!ws) return;
        if (ws.isPlaying()) ws.pause(); else { ws.setTime(region.current?.start ?? start); void ws.play(); }
      }}>{playing ? <Pause size={15} /> : <Play size={15} />} {playing ? "Pause excerpt" : "Play excerpt"}</button>
      <button type="button" disabled={!duration} onClick={() => { player.current?.pause(); player.current?.setTime(start); }}><RotateCcw size={14} /> Restart</button>
    </div>
    <audio controls preload="none" src={src} aria-label={`Native playback fallback for ${title}`} className="st-wave-native" />
  </section>;
}
