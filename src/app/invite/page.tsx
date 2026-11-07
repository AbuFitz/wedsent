"use client";
import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { designById } from "@/lib/designs";
import { useDraft } from "@/lib/use-draft";
import "@/components/guest/guest.css";

const SEEN = "wedsent-opened-v8";

export default function InvitePage() {
  const { draft, ready } = useDraft();
  const [open, setOpen] = useState(false);
  const [round, setRound] = useState(0);

  // Like Punchbowl/Greenvelope: play the opening once per device, then skip it.
  useEffect(() => {
    if (ready && sessionStorage.getItem(SEEN) === draft.names) setOpen(true);
  }, [ready, draft.names]);

  const onOpen = (v: boolean) => {
    setOpen(v);
    if (v) sessionStorage.setItem(SEEN, draft.names);
  };

  if (!ready) return <div className="guest" />;
  return (
    <main className="guest" style={{ ["--g-bg" as string]: designById(draft.design).id === "nocturne" ? "#18161d" : "#101014" }}>
      <div className="guest-wrap">
        <Phone label="Invitation">
          <Invitation key={round} data={draft} open={open} onOpenChange={onOpen} rsvpHref="/invite/rsvp" />
          {open && (
            <button className="guest-replay" onClick={() => { sessionStorage.removeItem(SEEN); setOpen(false); setRound((n) => n + 1); }} aria-label="Replay opening">
              <RotateCcw size={17} />
            </button>
          )}
        </Phone>
        <p className="guest-note">Preview of your draft. It isn’t a shareable link yet.</p>
      </div>
    </main>
  );
}
