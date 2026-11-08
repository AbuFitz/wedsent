"use client";
import { useEffect, useRef, useState } from "react";
import { Music2, Pause, Play, VolumeX } from "lucide-react";
import type { MusicChoice } from "@/lib/designs";
import { readLocalMusic } from "@/lib/local-music";

export function GuestMusic({ choice }: { choice: MusicChoice | null }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [src, setSrc] = useState("");
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let live = true;
    let url = "";
    setPlaying(false); setError("");
    if (!choice) { setSrc(""); return; }
    if (choice.src !== "local-music") { setSrc(choice.src); return; }
    readLocalMusic().then((blob) => {
      if (!live) return;
      if (!blob) { setError("Local audio no longer available"); return; }
      url = URL.createObjectURL(blob); setSrc(url);
    }).catch(() => { if (live) setError("Cannot read local audio"); });
    return () => { live = false; if (url) URL.revokeObjectURL(url); };
  }, [choice?.src]);
  useEffect(() => {
    const hidden = () => { if (document.hidden) { audio.current?.pause(); setPlaying(false); } };
    document.addEventListener("visibilitychange", hidden);
    return () => document.removeEventListener("visibilitychange", hidden);
  }, []);
  useEffect(() => {
    if (!src || !audio.current) return;
    const player = audio.current;
    // Opening the cover is a guest gesture. Try to start then, but honour browser
    // autoplay policy: if blocked, leave the play control available and silent.
    if (choice?.startAt) player.currentTime = choice.startAt;
    player.play().then(() => { setPlaying(true); setError(""); }).catch(() => setPlaying(false));
    return () => { player.pause(); };
  }, [src, choice?.startAt]);
  if (!choice) return null;
  const toggle = async () => {
    if (!audio.current) return;
    if (playing) { audio.current.pause(); setPlaying(false); return; }
    try {
      if (audio.current.currentTime < (choice.startAt ?? 0) || (choice.endAt !== undefined && audio.current.currentTime >= choice.endAt)) audio.current.currentTime = choice.startAt ?? 0;
      await audio.current.play(); setPlaying(true); setError("");
    }
    catch { setError("Tap again to play music"); setPlaying(false); }
  };
  return (
    <div className="in-music" aria-label="Invitation music">
      <audio ref={audio} src={src || undefined} loop preload="none" onTimeUpdate={() => {
        const player = audio.current;
        if (player && choice.endAt !== undefined && player.currentTime >= choice.endAt) player.currentTime = choice.startAt ?? 0;
      }} onEnded={() => setPlaying(false)} onError={() => { if (src) setError("Music could not be loaded"); }} />
      <button type="button" disabled={!src} onClick={toggle} aria-label={playing ? `Pause ${choice.title}` : `Play ${choice.title}`} aria-pressed={playing} title={error || choice.title}>
        {error ? <VolumeX size="1em" /> : playing ? <Pause size="1em" fill="currentColor" /> : <Play size="1em" fill="currentColor" />}
      </button>
      <span className="in-music-caption"><Music2 size="1em" /> {playing ? "Music on" : "Music off"}</span>
    </div>
  );
}
