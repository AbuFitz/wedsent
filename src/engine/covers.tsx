"use client";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import type { InviteData } from "@/lib/designs";
import { paletteOf, type DesignSpec } from "./registry";
import { StationeryCard } from "./stationery";
import { splitNames } from "@/lib/designs";

type P = { data: InviteData; spec: DesignSpec; onOpen: () => void; still: boolean };
const ease = [0.22, 0.8, 0.2, 1] as const;

/** Material-led, phased openings. The card is real HTML; only its physical sleeve is animated. */
export function KeepsakeCover({ data, spec, onOpen, still }: P) {
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const names = splitNames(data.names);
  const lift = spec.id === "embossed";
  const dark = spec.id === "gilt";
  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(onOpen, lift ? 1320 : 1480);
    return () => window.clearTimeout(timer);
  }, [opening, onOpen, lift]);
  const start = () => {
    if (still || opening) return;
    if (reduced) onOpen();
    else setOpening(true);
  };
  return (
    <motion.section className={`cover cv cv-keepsake cv-keepsake--${spec.id}`} aria-label={`${spec.name} invitation envelope`} exit={{ opacity: 0, transition: { duration: 0.16 } }}>
      <motion.div className="cv-keepsake-card" aria-hidden="true" animate={opening ? { scale: 1.035, y: lift ? 18 : -8, filter: "brightness(1.06)" } : { scale: .955, y: 8, filter: "brightness(.9)" }} transition={{ duration: 1.2, ease }}>
        <StationeryCard data={data} spec={spec} palette={paletteOf(spec, data.palette)} fill />
      </motion.div>
      <div className="cv-pearl-panels" aria-hidden="true">
        {lift ? <motion.div className="cv-keepsake-sleeve" animate={opening ? { y: "-110%", rotateX: -11, opacity: .86 } : { y: "0%", rotateX: 0, opacity: 1 }} transition={{ duration: 1.2, ease: [.25,.74,.13,1] }} /> : <>
          <motion.div className="cv-pearl-panel cv-pearl-panel--left" animate={opening ? { rotateY: -117, x: "-9%", filter: "brightness(.68)" } : { rotateY: 0, x: 0, filter: "brightness(1)" }} transition={{ duration: 1.28, delay: .13, ease: [0.2, .74, .1, 1] }} />
          <motion.div className="cv-pearl-panel cv-pearl-panel--right" animate={opening ? { rotateY: 117, x: "9%", filter: "brightness(.68)" } : { rotateY: 0, x: 0, filter: "brightness(1)" }} transition={{ duration: 1.28, delay: .13, ease: [0.2, .74, .1, 1] }} />
        </>}
      </div>
      <motion.div className="cv-pearl-seal" aria-hidden="true" animate={opening ? { opacity: 0, scale: .84, y: lift ? -70 : -15, rotate: dark ? -12 : 12 } : { opacity: 1, scale: 1, y: 0, rotate: 0 }} transition={{ duration: .44, ease: [.2,.7,.2,1] }}>
        <span className="cv-pearl-seal-inner">{names.a.slice(0, 1)}<i>&amp;</i>{names.b.slice(0, 1)}</span>
      </motion.div>
      <motion.span className="cv-pearl-caption" animate={opening ? { opacity: 0, y: 14 } : { opacity: 1, y: 0 }} transition={{ duration: .28 }}>{lift ? "LIFT TO REVEAL" : "TAP THE SEAL TO OPEN"}</motion.span>
      <button type="button" className="cv-hit" onClick={start} disabled={still || opening} aria-label={`Open ${spec.name} invitation`} />
    </motion.section>
  );
}

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

/** Hinged architectural panels with a single perspective vanishing plane. */
export function DoorsCover({ data, spec, onOpen, still }: P) {
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);
  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(onOpen, 1050);
    return () => window.clearTimeout(timer);
  }, [opening, onOpen]);
  return (
    <motion.section className="cover cv cv-doors" aria-label="Invitation cover" exit={{ opacity: 0, transition: { duration: 0.1 } }}>
      <Face data={data} spec={spec} hint="" />
      <div className="cv-pair" aria-hidden="true">
        <motion.div className="cv-door cv-door--left" animate={opening ? { rotateY: -112 } : { rotateY: 0 }} transition={{ duration: 0.95, ease: [0.23, 0.65, 0.2, 1] }} />
        <motion.div className="cv-door cv-door--right" animate={opening ? { rotateY: 112 } : { rotateY: 0 }} transition={{ duration: 0.95, ease: [0.23, 0.65, 0.2, 1] }} />
      </div>
      {!opening && <span className="cv-invite-action" aria-hidden="true">Tap to enter</span>}
      <button type="button" className="cv-hit" onClick={() => reduced ? onOpen() : setOpening(true)} disabled={still || opening} aria-label="Open the invitation doors" />
    </motion.section>
  );
}

/** Fabric-like surface with directional light on each fold; no WebGL required. */
export function CurtainCover({ data, spec, onOpen, still }: P) {
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);
  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(onOpen, 1150);
    return () => window.clearTimeout(timer);
  }, [opening, onOpen]);
  return (
    <motion.section className="cover cv cv-curtain" aria-label="Invitation cover" exit={{ opacity: 0, transition: { duration: 0.1 } }}>
      <Face data={data} spec={spec} hint="" />
      <div className="cv-pair" aria-hidden="true">
        <motion.div className="cv-drape cv-drape--left" animate={opening ? { x: "-104%", scaleX: 0.8 } : { x: 0, scaleX: 1 }} transition={{ duration: 1.05, ease: [0.3, 0, 0.16, 1] }} />
        <motion.div className="cv-drape cv-drape--right" animate={opening ? { x: "104%", scaleX: 0.8 } : { x: 0, scaleX: 1 }} transition={{ duration: 1.05, ease: [0.3, 0, 0.16, 1] }} />
      </div>
      {!opening && <span className="cv-invite-action" aria-hidden="true">Reveal the invitation</span>}
      <button type="button" className="cv-hit" onClick={() => reduced ? onOpen() : setOpening(true)} disabled={still || opening} aria-label="Draw the invitation curtains" />
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
