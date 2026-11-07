"use client";
import { useCallback, useEffect, useState } from "react";
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
