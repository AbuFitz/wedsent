"use client";
import { useEffect, useRef, useState } from "react";
import { Music2, Pause, Play, VolumeX } from "lucide-react";
import type { MusicChoice } from "@/lib/designs";
import { readLocalMusic } from "@/lib/local-music";

/** A single guest player, including on-arrival playback attempts. The browser
 * may refuse sound until interaction, so the play button always remains usable. */
export function GuestMusic({ choice, opened }: { choice: MusicChoice | null; opened: boolean }) {
  const audio = useRef<HTMLAudioElement>(null);
  const frame = useRef<number>(0);
  const wasOpened = useRef(false);
  const [src, setSrc] = useState("");
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(false);
  const begin = choice?.startAt ?? 0;
  const end = choice?.endAt;
  const level = choice?.volume ?? 0.45;

  useEffect(() => {
    let active = true;
    let url = "";
    setPlaying(false); setError(""); setBlocked(false); wasOpened.current = false;
    if (!choice) { setSrc(""); return; }
    if (choice.src !== "local-music") { setSrc(choice.src); return; }
    readLocalMusic().then((blob) => {
      if (!active) return;
      if (!blob) { setError("Local audio no longer available"); setSrc(""); return; }
      url = URL.createObjectURL(blob); setSrc(url);
    }).catch(() => { if (active) setError("Cannot read local audio"); });
    return () => { active = false; if (url) URL.revokeObjectURL(url); };
  }, [choice?.src]);

  const start = async () => {
    const player = audio.current;
    if (!player || !src) return;
    try {
      if (player.currentTime < begin || (end !== undefined && player.currentTime >= end)) player.currentTime = begin;
      await player.play(); setPlaying(true); setBlocked(false); setError("");
    } catch {
      setPlaying(false); setBlocked(true); setError("Your browser needs a tap to play music");
    }
  };
  // Keep the latest playback handler available to delayed opening gestures.
  const startRef = useRef(start);
  startRef.current = start;

  useEffect(() => {
    if (!src || !audio.current || (choice?.trigger ?? "open") !== "load") return;
    audio.current.volume = 0;
    void startRef.current();
  }, [src, choice?.trigger]);

  useEffect(() => {
    if (!opened || !src || wasOpened.current) return;
    wasOpened.current = true;
    if ((choice?.trigger ?? "open") !== "open") return;
    // Let the opening gesture resolve before fading sound in.
    const timer = window.setTimeout(() => { void startRef.current(); }, 380);
    return () => window.clearTimeout(timer);
  }, [opened, choice?.trigger, src]);

  useEffect(() => {
    const tick = () => {
      const player = audio.current;
      if (!player || player.paused) return;
      const effectiveEnd = end ?? player.duration;
      const elapsed = Math.max(0, player.currentTime - begin);
      const remaining = Number.isFinite(effectiveEnd) ? Math.max(0, effectiveEnd - player.currentTime) : Infinity;
      player.volume = Math.max(0, Math.min(1, level * Math.min(1, elapsed / 1.3, remaining / 1.8)));
      if (end !== undefined && player.currentTime >= end - 0.06) {
        player.currentTime = begin;
        player.volume = 0;
      }
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [src, begin, end, level, playing]);

  useEffect(() => {
    const hidden = () => {
      if (document.hidden) { audio.current?.pause(); setPlaying(false); }
    };
    document.addEventListener("visibilitychange", hidden);
    return () => document.removeEventListener("visibilitychange", hidden);
  }, []);

  if (!choice) return null;
  return (
    <div className="in-music" aria-label="Invitation music" data-opened={opened}>
      <audio ref={audio} src={src || undefined} loop={end === undefined} preload="metadata"
        onEnded={() => setPlaying(false)} onError={() => { if (src) { setPlaying(false); setError("Music could not be loaded"); } }} />
      <button type="button" disabled={!src} onClick={() => {
        if (!audio.current) return;
        if (playing) { audio.current.pause(); setPlaying(false); }
        else void start();
      }} aria-label={playing ? `Pause ${choice.title}` : `Play ${choice.title}`} aria-pressed={playing} title={error || choice.title}>
        {error && !playing ? <VolumeX size="1em" /> : playing ? <Pause size="1em" fill="currentColor" /> : <Play size="1em" fill="currentColor" />}
      </button>
      <span className="in-music-caption"><Music2 size="1em" /> {playing ? "Music on" : blocked ? "Tap for music" : "Music off"}</span>
    </div>
  );
}
