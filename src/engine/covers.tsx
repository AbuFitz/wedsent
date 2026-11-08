"use client";
import { useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import type { InviteData } from "@/lib/designs";
import { paletteOf, type DesignSpec } from "./registry";
import { StationeryCard } from "./stationery";

type P = { data: InviteData; spec: DesignSpec; onOpen: () => void; still: boolean };
const ease = [0.22, 0.8, 0.2, 1] as const;

function Face({ data, spec, hint }: { data: InviteData; spec: DesignSpec; hint: string }) {
  return (
    <>
      <StationeryCard data={data} spec={spec} palette={paletteOf(spec, data.palette)} fill />
      <span className="cv-hint" aria-hidden="true"><i />{hint}</span>
    </>
  );
}

/** The cover softly clears. The quietest opening: no object metaphor, just focus. */
export function VeilCover({ data, spec, onOpen }: P) {
  const reduced = useReducedMotion();
  return (
    <motion.section className="cover cv" aria-label="Invitation cover" exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.035, filter: "blur(14px)", transition: { duration: 0.95, ease } }}>
      <Face data={data} spec={spec} hint={spec.opening.label} />
      <button type="button" className="cv-hit" onClick={onOpen} aria-label="Open invitation" />
    </motion.section>
  );
}

/** Editorial focus: a restrained typographic reveal with a distinct depth and timing. */
export function FocusCover({ data, spec, onOpen, still }: P) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      className="cover cv"
      aria-label="Invitation cover"
      exit={reduced ? { opacity: 0, transition: { duration: 0.12 } } : {
        opacity: 0, scale: 0.96, y: -20, filter: "blur(5px)",
        transition: { duration: 0.7, ease },
      }}
    >
      <Face data={data} spec={spec} hint={spec.opening.label} />
      <button type="button" className="cv-hit" onClick={onOpen} disabled={still} aria-label="Open invitation" />
    </motion.section>
  );
}

/** The invitation opens outward from where you touch. */
export function BloomCover({ data, spec, onOpen, still }: P) {
  const r = useMotionValue(0);
  const [o, setO] = useState({ x: 50, y: 62 });
  const reduced = useReducedMotion();
  const [go, setGo] = useState(false);
  const mask = useTransform(r, (v) => `radial-gradient(circle at ${o.x}% ${o.y}%, transparent ${v}%, #000 ${v + 0.4}%)`);
  const open = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (go) return;
    if (reduced) return onOpen();
    const b = e.currentTarget.getBoundingClientRect();
    // keyboard clicks have no pointer position: open from the centre
    setO(e.detail === 0 ? { x: 50, y: 62 } : { x: ((e.clientX - b.left) / b.width) * 100, y: ((e.clientY - b.top) / b.height) * 100 });
    setGo(true);
    requestAnimationFrame(() => animate(r, 150, { duration: 1.15, ease: [0.5, 0, 0.2, 1] }).then(onOpen));
  };
  return (
    <motion.section className="cover cv" aria-label="Invitation cover" style={{ WebkitMaskImage: go ? mask : undefined, maskImage: go ? mask : undefined }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
      <Face data={data} spec={spec} hint={spec.opening.label} />
      <button type="button" className="cv-hit" onClick={open} disabled={still} aria-label="Open invitation" />
    </motion.section>
  );
}

/** The cover is a sheet you lift away. Drag, tap or press Enter. */
export function LiftCover({ data, spec, onOpen, still }: P) {
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
    <motion.section
      ref={ref} className="cover cv" aria-label="Invitation cover" style={{ y, boxShadow: shadow, touchAction: "none" }}
      drag={still ? false : "y"} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0.9, bottom: 0.05 }}
      onDragEnd={(_, info) => {
        const h = ref.current?.clientHeight ?? 800;
        if (info.offset.y < -h * 0.2 || info.velocity.y < -500) finish();
        else animate(y, 0, { type: "spring", stiffness: 420, damping: 32 });
      }}
      exit={{ y: "-104%", transition: { duration: 0.01 } }}
    >
      <Face data={data} spec={spec} hint={spec.opening.label} />
      <button type="button" className="cv-hit" onClick={finish} disabled={still} aria-label="Open invitation" />
    </motion.section>
  );
}
