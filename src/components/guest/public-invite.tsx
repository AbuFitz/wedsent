"use client";
import { useState } from "react";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import type { InviteData } from "@/lib/designs";
import "./guest.css";

/** Full-bleed on phones, framed on desktop. `rsvpHref` omitted on the generic public link (replies need a personal link). */
export function PublicInvite({ content, rsvpHref, note }: { content: InviteData; rsvpHref?: string; note?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <main className="guest" style={{ ["--g-bg" as string]: content.design === "nocturne" ? "#18161d" : "#101014" }}>
      <div className="guest-wrap">
        <Phone label="Invitation"><Invitation data={content} open={open} onOpenChange={setOpen} rsvpHref={rsvpHref} /></Phone>
        {note && <p className="guest-note">{note}</p>}
      </div>
    </main>
  );
}
