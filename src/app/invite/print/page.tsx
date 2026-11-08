"use client";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { accentFor, dateParts, friendlyTime, onColor } from "@/lib/designs";
import { useDraft } from "@/lib/use-draft";
import { StationeryCard } from "@/engine/stationery";
import { fontPackById, paletteOf, specById } from "@/engine/registry";
import type { CSSProperties } from "react";
import "@/engine/engine.css";
import "./print.css";

export default function PrintPreview() {
  const { draft, ready } = useDraft();
  if (!ready) return <main className="pr" />;
  const a = accentFor(draft);
  const spec = specById(draft.design);
  const palette = paletteOf(spec, draft.palette);
  const font = fontPackById(draft.type) ?? fontPackById(spec.fonts);
  const p = dateParts(draft.date);
  const t = friendlyTime(draft.time);
  return (
    <main className="pr" style={{ "--a": a, "--on-a": onColor(a), "--bg": palette.bg, "--fg": palette.fg, "--soft": palette.soft, "--line": palette.line, "--f-head": font?.head, "--f-script": font?.script ?? font?.head, "--f-body": font?.body, "--f-caps": font?.caps ?? font?.body } as CSSProperties}>
      <header className="pr-bar">
        <Link href="/studio"><ArrowLeft size={17} /> Studio</Link>
        <button type="button" onClick={() => window.print()}><Printer size={16} /> Print or save as PDF</button>
      </header>
      <div className="pr-stage" aria-label="Matching invitation stationery suite">
        <article className="pr-sheet pr-sheet--front" aria-label="Printed invitation front"><StationeryCard data={draft} spec={spec} palette={palette}/></article>
        <article className={`pr-sheet pr-sheet--insert pr-sheet--${draft.design}`} aria-label="Printed wedding details insert">
          <div className="pr-insert-inner">
            <span className="pr-insert-kicker">THE CELEBRATION</span>
            <h2>{draft.names}</h2>
            {draft.message.trim() && <p className="pr-insert-note">{draft.message}</p>}
            <div className="pr-insert-rule"/>
            <p><small>WHEN</small><strong>{p.weekday} {p.day} {p.month} {p.year}</strong>{t && <span>{t}</span>}</p>
            <p><small>WHERE</small><strong>{draft.venue || "Venue to follow"}</strong><span>{[draft.address,draft.city].filter(Boolean).join(", ")}</span></p>
            {draft.dress && <p><small>ATTIRE</small><strong>{draft.dress}</strong></p>}
            {draft.rsvpBy && <p><small>PLEASE REPLY BY</small><strong>{draft.rsvpBy}</strong></p>}
          </div>
        </article>
      </div>
      <p className="pr-note">Two matching A5 pages: invitation and details insert. Visual foil, paper grain and emboss are screen simulations; specialist finishing, bleed and CMYK proofing require a printer.</p>
    </main>
  );
}
