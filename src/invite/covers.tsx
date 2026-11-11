"use client";
import { useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import type { InviteData } from "@/lib/designs";
import { paletteOf, type DesignSpec, type OpeningKind } from "@/engine/registry";
import { Face, Seal, initials } from "./face";

type P = { data: InviteData; spec: DesignSpec; kind: OpeningKind; onOpen: () => void; still: boolean };
const out = { duration: 0.95, ease: [0.22, 0.8, 0.2, 1] as const };

function Hint({ text }: { text: string }) {
  return <span className="cv-hint" aria-hidden="true"><i />{text}</span>;
}
const hintFor = (spec: DesignSpec, kind: OpeningKind) => (kind === "lift" ? "Swipe up to open" : kind === "doors" || kind === "bloom" ? "Tap to open" : spec.opening.label || "Tap to open");

/* Falling blooms for the `petals` opening: real plates, drifting at different depths. */
const FALL = [
  { id: "marigold-orange", x: -6, s: 22, d: 0, r: -20, t: 8 }, { id: "peony-pink", x: 74, s: 24, d: 2.2, r: 25, t: 9 }, { id: "rose-wild", x: 2, s: 18, d: 4.1, r: 12, t: 10 },
  { id: "marigold-african", x: 82, s: 16, d: 1.1, r: -35, t: 7.5 }, { id: "peony-paxton", x: -2, s: 20, d: 5.6, r: 30, t: 9.5 }, { id: "marigold-french", x: 70, s: 15, d: 3.3, r: -10, t: 8.5 },
];

/** Every cover other than doors / lift / bloom: the title card plays its entrance, a tap dissolves it. */
export function DissolveCover({ data, spec, kind, onOpen, still }: P) {
  const reduced = useReducedMotion();
  const [go, setGo] = useState(false);
  const open = () => { if (reduced) return onOpen(); setGo(true); setTimeout(onOpen, 120); };
  return (
    <motion.section className={`cover cv cv--${kind}`} aria-label="Invitation cover" data-go={go}
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: kind === "kinetic" ? 1.08 : 1.035, filter: "blur(14px)", transition: out }}>
      <Face data={data} spec={spec} palette={paletteOf(spec, data.palette)} fill cover uid="c" />
      {kind === "petals" && !still && !reduced && (
        <div className="cv-fall" aria-hidden="true">
          {FALL.map((f, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <motion.img key={i} src={`/art/${f.id}.webp`} alt="" draggable={false} className="cv-petal" style={{ left: `${f.x}%`, width: `${f.s}cqw` }}
              initial={{ y: "-40cqh", rotate: f.r }} animate={{ y: "125cqh", rotate: f.r + 160 }}
              transition={go ? { duration: 1.2, ease: [0.5, 0, 0.9, 0.5] } : { duration: f.t, delay: f.d, ease: "linear", repeat: Infinity }} />
          ))}
        </div>
      )}
      <Hint text={hintFor(spec, kind)} />
      <button type="button" className="cv-hit" onClick={open} aria-label="Open invitation" />
    </motion.section>
  );
}

/** A folded card that opens from the middle. Two halves of the same face hinge outward in 3D. */
export function DoorsCover({ data, spec, kind, onOpen }: P) {
  const reduced = useReducedMotion();
  const [go, setGo] = useState(false);
  const open = () => { if (reduced) return onOpen(); setGo(true); setTimeout(onOpen, 1500); };
  const pal = paletteOf(spec, data.palette);
  const t = { duration: 1.45, ease: [0.55, 0, 0.18, 1] as const };
  return (
    <motion.section className="cover cv cv--doors" aria-label="Invitation cover" exit={{ opacity: 0, transition: { duration: 0.25 } }}>
      <div className="dr-stage">
        {(["l", "r"] as const).map((side) => (
          <motion.div key={side} className={`dr dr-${side}`} animate={{ rotateY: go ? (side === "l" ? -118 : 118) : 0 }} transition={t}>
            <div className="dr-front"><div className="dr-face"><Face data={data} spec={spec} palette={pal} fill cover uid={`d${side}`} /></div><motion.span className="dr-shade" animate={{ opacity: go ? 0.55 : 0 }} transition={t} /></div>
            <div className="dr-back" />
          </motion.div>
        ))}
      </div>
      <motion.div className="dr-seal" aria-hidden="true" animate={go ? { scale: 1.25, opacity: 0, rotate: -8 } : { scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.3, 0, 0.2, 1] }}><Seal initials={initials(data.names)} /></motion.div>
      <Hint text={hintFor(spec, kind)} />
      <button type="button" className="cv-hit" onClick={open} aria-label="Open invitation" />
    </motion.section>
  );
}

/** The invitation opens outward from exactly where you touch. */
export function BloomCover({ data, spec, kind, onOpen, still }: P) {
  const r = useMotionValue(0);
  const [o, setO] = useState({ x: 50, y: 62 });
  const reduced = useReducedMotion();
  const [go, setGo] = useState(false);
  const mask = useTransform(r, (v) => `radial-gradient(circle at ${o.x}% ${o.y}%, transparent ${v}%, #000 ${v + 0.4}%)`);
  const open = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (go) return;
    if (reduced) return onOpen();
    const b = e.currentTarget.getBoundingClientRect();
    setO(e.detail === 0 ? { x: 50, y: 62 } : { x: ((e.clientX - b.left) / b.width) * 100, y: ((e.clientY - b.top) / b.height) * 100 });
    setGo(true);
    requestAnimationFrame(() => animate(r, 150, { duration: 1.2, ease: [0.5, 0, 0.2, 1] }).then(onOpen));
  };
  return (
    <motion.section className="cover cv cv--bloom" aria-label="Invitation cover" style={{ WebkitMaskImage: go ? mask : undefined, maskImage: go ? mask : undefined }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
      <Face data={data} spec={spec} palette={paletteOf(spec, data.palette)} fill cover uid="b" />
      <Hint text={hintFor(spec, kind)} />
      <button type="button" className="cv-hit" onClick={open} disabled={still} aria-label="Open invitation" />
    </motion.section>
  );
}

/** The cover is a sheet you lift away with your thumb. Drag, tap or press Enter. */
export function LiftCover({ data, spec, kind, onOpen, still }: P) {
  const ref = useRef<HTMLElement>(null);
  const y = useMotionValue(0);
  const shadow = useTransform(y, (v) => (v < -4 ? "0 3cqw 10cqw rgba(0,0,0,.35)" : "0 0 0 rgba(0,0,0,0)"));
  const reduced = useReducedMotion();
  const finish = () => {
    if (reduced) return onOpen();
    const h = ref.current?.clientHeight ?? 800;
    animate(y, -h * 1.03, { type: "spring", stiffness: 150, damping: 24, restSpeed: 4 }).then(onOpen);
  };
  return (
    <motion.section ref={ref} className="cover cv cv--lift" aria-label="Invitation cover" style={{ y, boxShadow: shadow, touchAction: "none" }}
      drag={still ? false : "y"} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0.9, bottom: 0.05 }}
      onDragEnd={(_, info) => {
        const h = ref.current?.clientHeight ?? 800;
        if (info.offset.y < -h * 0.2 || info.velocity.y < -500) finish();
        else animate(y, 0, { type: "spring", stiffness: 420, damping: 32 });
      }}
      exit={{ y: "-104%", transition: { duration: 0.01 } }}>
      <Face data={data} spec={spec} palette={paletteOf(spec, data.palette)} fill cover uid="l" />
      <Hint text={hintFor(spec, kind)} />
      <button type="button" className="cv-hit" onClick={finish} disabled={still} aria-label="Open invitation" />
    </motion.section>
  );
}

export function Cover(p: Omit<P, "kind"> & { kind: OpeningKind }) {
  switch (p.kind) {
    case "lift": return <LiftCover {...p} />;
    case "doors": return <DoorsCover {...p} />;
    case "bloom": return <BloomCover {...p} />;
    default: return <DissolveCover {...p} />;
  }
}
/** Legacy openings from earlier drafts map onto current ones. */
export const resolveOpening = (k: OpeningKind): OpeningKind => (k === "veil" || k === "focus" ? "script" : k === "curtain" ? "doors" : k);
