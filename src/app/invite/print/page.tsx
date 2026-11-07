"use client";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { accentFor, dateParts, friendlyTime, onColor, splitNames } from "@/lib/designs";
import { useDraft } from "@/lib/use-draft";
import type { CSSProperties } from "react";
import "./print.css";

export default function PrintPreview() {
  const { draft, ready } = useDraft();
  if (!ready) return <main className="pr" />;
  const a = accentFor(draft);
  const n = splitNames(draft.names);
  const p = dateParts(draft.date);
  const t = friendlyTime(draft.time);
  return (
    <main className="pr" style={{ "--a": a, "--on-a": onColor(a) } as CSSProperties}>
      <header className="pr-bar">
        <Link href="/studio"><ArrowLeft size={17} /> Studio</Link>
        <button type="button" onClick={() => window.print()}><Printer size={16} /> Print or save as PDF</button>
      </header>
      <div className="pr-stage">
        <article className={`pr-card pr-card--${draft.design}`}>
          <p className="pr-occ">{draft.occasion || "Celebration"}</p>
          <h1 className="pr-names">{n.a}{n.joined && <><span> &amp; </span>{n.b}</>}</h1>
          {draft.message.trim() && <p className="pr-msg">{draft.message}</p>}
          <div className="pr-meta">
            <p><strong>{p.weekday} {p.day} {p.month} {p.year}</strong>{t && <><br />{t}</>}</p>
            <p><strong>{draft.venue || "Venue to follow"}</strong>{draft.city && <><br />{draft.city}</>}</p>
            {draft.dress && <p>{draft.dress}</p>}
          </div>
        </article>
      </div>
      <p className="pr-note">Early A5 layout for home printing. Bleed, crop marks and print-shop colour export aren’t built yet.</p>
    </main>
  );
}
