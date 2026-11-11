"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence } from "motion/react";
import { accentFor, onColor, type InviteData, type InviteEvent } from "@/lib/designs";
import { OPENINGS, fontPackById, paletteOf, specById } from "@/engine/registry";
import "@/engine/fonts-import";
import "@/invite/invite.css";
import { Cover, resolveOpening } from "@/invite/covers";
import { Inside } from "@/invite/inside";
import { GuestMusic } from "./music-control";

export type InvitationProps = {
  data: InviteData;
  /** Controlled open state. Omit to let the invitation manage itself. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Where the Reply button goes. Omit for a non-navigating preview button. */
  rsvpHref?: string;
  /** Thumbnails: render the cover only and ignore input. */
  still?: boolean;
  /** The events this guest may see. When present they replace the single date/venue block. */
  events?: InviteEvent[];
  /** Who the invitation is for (household name). */
  greeting?: string;
  /** Only true on an actual guest-facing page, not a phone mockup in the editor. */
  syncChrome?: boolean;
  /** Studio-only: select an invitation section instead of activating its guest links. */
  onEditTarget?: (target: "words" | "details" | "events" | "extras") => void;
};

export function Invitation({ data, open: openProp, onOpenChange, rsvpHref, still, events, greeting, syncChrome = false, onEditTarget }: InvitationProps) {
  const [inner, setInner] = useState(false);
  const open = openProp ?? inner;
  const setOpen = (v: boolean) => { setInner(v); onOpenChange?.(v); };
  const accent = accentFor(data);
  const base = specById(data.design);
  const kind = resolveOpening(data.opening && OPENINGS[data.opening] ? data.opening : base.opening.kind);
  const spec = { ...base, opening: { kind, ...OPENINGS[kind] } };
  const palette = paletteOf(spec, data.palette);

  useEffect(() => {
    if (!syncChrome) return;
    const color = spec.id === "gilt" ? "#15110c" : palette.bg || "#F4F4F2";
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const previous = meta?.content;
    if (meta) meta.content = color;
    const oldHtml = document.documentElement.style.backgroundColor, oldBody = document.body.style.backgroundColor;
    document.documentElement.style.backgroundColor = color;
    document.body.style.backgroundColor = color;
    return () => {
      if (meta && previous !== undefined) meta.content = previous;
      document.documentElement.style.backgroundColor = oldHtml;
      document.body.style.backgroundColor = oldBody;
    };
  }, [syncChrome, palette.bg, spec.id]);

  const pack = fontPackById(data.type) ?? fontPackById(spec.fonts);
  const style = {
    "--a": accent, "--on-a": onColor(accent),
    ...(palette.bg ? { "--bg": palette.bg, "--fg": palette.fg, "--soft": palette.soft, "--line": palette.line } : {}),
    ...(pack ? { "--f-head": pack.head, "--f-script": pack.script ?? pack.head, "--f-body": pack.body, "--f-caps": pack.caps ?? pack.body } : {}),
  } as CSSProperties;

  return (
    <div className={`inv inv--${spec.id}`} style={style} data-open={open || !!still} {...(still ? { inert: true } : {})}>
      <Inside data={data} open={open || !!still} rsvpHref={rsvpHref} events={events} greeting={greeting} spec={spec} palette={palette} onEditTarget={onEditTarget} />
      {!still && <GuestMusic choice={data.music ?? null} opened={open} />}
      <AnimatePresence>
        {!open && !still && <Cover key={spec.id + kind} kind={kind} spec={spec} data={data} onOpen={() => setOpen(true)} still={false} />}
        {!open && still && <Cover key="still" kind={kind} spec={spec} data={data} onOpen={() => {}} still />}
      </AnimatePresence>
    </div>
  );
}
