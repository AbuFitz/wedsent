"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { defaults, loadDraft, saveDraft, type InviteData } from "./designs";

export type SaveState = "loading" | "saving" | "saved" | "failed";

/** Draft stored in this browser only. There is no account or server yet. */
export function useDraft() {
  const [draft, setDraft] = useState<InviteData>(defaults);
  const [state, setState] = useState<SaveState>("loading");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDraft(loadDraft());
    setReady(true);
    setState("saved");
  }, []);

  useEffect(() => {
    if (!ready) return;
    setState("saving");
    const t = setTimeout(() => setState(saveDraft(draft) ? "saved" : "failed"), 350);
    return () => clearTimeout(t);
  }, [draft, ready]);

  const patch = useCallback((p: Partial<InviteData>) => setDraft((d) => ({ ...d, ...p })), []);
  return { draft, patch, state, ready };
}

import { call, ApiError } from "./api-client";
import { DRAFT_KEY } from "./designs";
import { clearLocalEvents, readLocalEvents, writeLocalEvents } from "./local-events";

export type StudioSave = "loading" | "saving" | "saved" | "failed" | "conflict" | "offline";

/**
 * Signed in: the draft lives on the server (optimistic concurrency via `rev`).
 * Signed out: the draft lives in this browser only. The first sign-in claims an untouched server draft with the local one.
 */
export function useStudioDraft() {
  const [draft, setDraft] = useState<InviteData>(defaults);
  const [state, setState] = useState<StudioSave>("loading");
  const [ready, setReady] = useState(false);
  const [account, setAccount] = useState<{ email: string } | null>(null);
  const rev = useRef(0);
  const dirty = useRef(false);

  useEffect(() => {
    (async () => {
      let user: { email: string } | null = null;
      try { user = (await call("GET", "/api/me")).user; } catch { /* backend not connected: stay local */ }
      if (user) {
        try {
          const w = await call("GET", "/api/wedding");
          rev.current = w.rev;
          // Events built while signed out are created now, once. The key is consumed first so a double-run cannot duplicate them.
          const pending = readLocalEvents();
          if (pending.length) {
            clearLocalEvents();
            try {
              const existing = (await call("GET", "/api/wedding/events")).events;
              if (!existing.length) for (const e of pending) await call("POST", "/api/wedding/events", { title: e.title, startsOn: e.starts_on, startsAt: e.starts_at_local, venue: e.venue, address: e.address, city: e.city, visibility: e.visibility });
            } catch { writeLocalEvents(pending); }
          }
          const hasLocal = !!localStorage.getItem(DRAFT_KEY);
          if (w.rev === 1 && hasLocal) {
            const local = loadDraft();
            if (local.photo?.src.startsWith("data:")) {
              try {
                const blob = await (await fetch(local.photo.src)).blob();
                const r = await fetch("/api/media", { method: "POST", body: blob, headers: { "content-type": blob.type }, credentials: "same-origin" });
                const j = await r.json();
                local.photo = r.ok ? { ...local.photo, src: j.src } : null;
              } catch { local.photo = null; }
            }
            setDraft(local); dirty.current = true;
          }
          else setDraft({ ...defaults, ...w.content });
          setAccount(user);
        } catch { setDraft(loadDraft()); }
      } else setDraft(loadDraft());
      setReady(true); setState("saved");
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (account && !dirty.current) return;
    setState("saving");
    const t = setTimeout(async () => {
      if (!account) return setState(saveDraft(draft) ? "saved" : "failed");
      try {
        const r = await call("PUT", "/api/wedding", { content: draft, rev: rev.current });
        rev.current = r.rev; dirty.current = false; setState("saved");
      } catch (e) {
        if (e instanceof ApiError && e.code === "stale_draft") setState("conflict");
        else if (e instanceof ApiError && e.code === "offline") setState("offline");
        else setState("failed");
      }
    }, 600);
    return () => clearTimeout(t);
  }, [draft, ready, account]);

  // Never lose the last keystrokes: flush the local draft when the tab hides or the Studio unmounts (client navigation).
  const latest = useRef(draft); latest.current = draft;
  useEffect(() => {
    if (!ready || account) return;
    const flush = () => { saveDraft(latest.current); };
    const vis = () => { if (document.visibilityState === "hidden") flush(); };
    window.addEventListener("pagehide", flush); document.addEventListener("visibilitychange", vis);
    return () => { window.removeEventListener("pagehide", flush); document.removeEventListener("visibilitychange", vis); flush(); };
  }, [ready, account]);

  const patch = useCallback((p: Partial<InviteData>) => { dirty.current = true; setDraft((d) => ({ ...d, ...p })); }, []);
  return { draft, patch, state, ready, account, reload: () => location.reload() };
}
