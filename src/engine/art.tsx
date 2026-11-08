/**
 * Procedural wedding artwork. Everything here is generated in code (original, no third-party artwork),
 * deterministic per seed so server and client render identically.
 */
import { useId, type CSSProperties, type ReactNode } from "react";

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const TAU = Math.PI * 2;
const f = (n: number) => Math.round(n * 100) / 100;

/** Shared filter: pigment edge wobble and soft bleed, so shapes read as watercolour rather than vector. */
export function WatercolorDefs({ id, seed = 3, wobble = 5 }: { id: string; seed?: number; wobble?: number }) {
  return (
    <defs>
      <filter id={id} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed={seed} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={wobble} result="d" />
        <feGaussianBlur in="d" stdDeviation="0.55" />
      </filter>
    </defs>
  );
}

type Pt = { x: number; y: number; a: number };
/** A branch of leaves along any path. `at(t)` returns the stem point and its heading (radians). */
function Leaves({ at, count, seed, colors, size, round = 0.62, side = 0.95, tip = true }: {
  at: (t: number) => Pt; count: number; seed: number; colors: string[]; size: number; round?: number; side?: number; tip?: boolean;
}) {
  const r = rng(seed);
  const out: ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const p = at(t);
    const sz = size * (1.05 - t * 0.55) * (0.85 + r() * 0.3);
    for (const s of [-1, 1]) {
      if (r() > side) continue;
      const ang = p.a + s * (0.9 + r() * 0.5);
      const L = sz * (1 + r() * 0.25), W = L * round * (0.85 + r() * 0.3);
      const c = colors[Math.floor(r() * colors.length)];
      const d = `M0 0C${f(W)} ${f(-L * 0.2)} ${f(W * 0.95)} ${f(-L * 0.85)} 0 ${f(-L)}C${f(-W * 0.95)} ${f(-L * 0.85)} ${f(-W)} ${f(-L * 0.2)} 0 0Z`;
      out.push(
        <g key={`${i}${s}`} transform={`translate(${f(p.x)} ${f(p.y)}) rotate(${f((ang * 180) / Math.PI + 90)})`}>
          <path d={d} fill={c} opacity={0.78} />
          <path d={`M0 0L0 ${f(-L * 0.88)}`} stroke="#fff" strokeOpacity={0.28} strokeWidth={0.7} fill="none" />
        </g>,
      );
    }
  }
  if (tip) {
    const p = at(1);
    const L = size * 0.62;
    out.push(<ellipse key="tip" cx={0} cy={0} rx={L * round * 0.7} ry={L} fill={colors[0]} opacity={0.8} transform={`translate(${f(p.x)} ${f(p.y)}) rotate(${f((p.a * 180) / Math.PI + 90)})`} />);
  }
  return <>{out}</>;
}

/** Eucalyptus / olive style branch drawn as a curved stem with leaf pairs. */
export function Branch({ length = 120, bend = 18, leaves = 9, seed = 1, colors = ["#7C9A86", "#93AF98", "#6A8A78"], stem = "#6F8A74", size = 15, round = 0.62, wob = 4, transform }: {
  length?: number; bend?: number; leaves?: number; seed?: number; colors?: string[]; stem?: string; size?: number; round?: number; wob?: number; transform?: string;
}) {
  const id = useId().replace(/:/g, "");
  const P = (t: number): Pt => {
    const x = length * t, y = -bend * Math.sin(t * Math.PI * 0.9) * (1 - t * 0.2);
    const dx = length, dy = -bend * Math.PI * 0.9 * Math.cos(t * Math.PI * 0.9) * (1 - t * 0.2);
    return { x, y, a: Math.atan2(dy, dx) };
  };
  const stemD = Array.from({ length: 21 }, (_, i) => { const p = P(i / 20); return `${i ? "L" : "M"}${f(p.x)} ${f(p.y)}`; }).join("");
  return (
    <g transform={transform}>
      <WatercolorDefs id={id} seed={seed + 2} wobble={wob} />
      <g filter={`url(#${id})`}>
        <path d={stemD} stroke={stem} strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.85} />
        <g style={{ mixBlendMode: "multiply" } as CSSProperties}>
          <Leaves at={P} count={leaves} seed={seed} colors={colors} size={size} round={round} />
        </g>
      </g>
    </g>
  );
}

/** A wreath of two branches meeting at the bottom, open at the top. */
export function Wreath({ r = 110, seed = 7, colors, stem, size = 15, leaves = 11, round = 0.62, accent }: {
  r?: number; seed?: number; colors?: string[]; stem?: string; size?: number; leaves?: number; round?: number; accent?: ReactNode;
}) {
  const id = useId().replace(/:/g, "");
  const side = (dir: 1 | -1, sd: number) => {
    const a0 = Math.PI / 2 + dir * 0.18, span = Math.PI * 1.32;
    const P = (t: number): Pt => {
      const a = a0 + dir * span * t;
      return { x: r * Math.cos(a), y: r * Math.sin(a), a: a + dir * (Math.PI / 2) + Math.PI };
    };
    const d = Array.from({ length: 31 }, (_, i) => { const p = P(i / 30); return `${i ? "L" : "M"}${f(p.x)} ${f(p.y)}`; }).join("");
    return (
      <g key={dir}>
        <path d={d} stroke={stem ?? "#6F8A74"} strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.85} />
        <g style={{ mixBlendMode: "multiply" } as CSSProperties}>
          <Leaves at={P} count={leaves} seed={sd} colors={colors ?? ["#7C9A86", "#93AF98", "#6A8A78"]} size={size} round={round} />
        </g>
      </g>
    );
  };
  return (
    <g>
      <WatercolorDefs id={id} seed={seed} wobble={4.5} />
      <g filter={`url(#${id})`}>{side(1, seed)}{side(-1, seed + 11)}</g>
      {accent}
    </g>
  );
}

/** Watercolour peony / rose: layered petals, deeper toward the heart. */
export function Peony({ size = 40, seed = 5, petals = ["#F3CFCB", "#EBB5B3", "#D98F93", "#B96A74"], center = "#E0B66A", x = 0, y = 0, rot = 0 }: {
  size?: number; seed?: number; petals?: string[]; center?: string; x?: number; y?: number; rot?: number;
}) {
  const id = useId().replace(/:/g, "");
  const r = rng(seed);
  const rings = [0, 1, 2, 3].map((k) => {
    const n = 6 + k, rad = size * (0.62 - k * 0.14), col = petals[Math.min(k, petals.length - 1)];
    const off = r() * TAU;
    return Array.from({ length: n }, (_, i) => {
      const a = off + (i / n) * TAU + (r() - 0.5) * 0.25;
      const w = size * (0.36 - k * 0.05) * (0.85 + r() * 0.3), h = size * (0.5 - k * 0.07) * (0.85 + r() * 0.3);
      return <ellipse key={`${k}-${i}`} cx={f(Math.cos(a) * rad * 0.7)} cy={f(Math.sin(a) * rad * 0.7)} rx={f(w)} ry={f(h)} transform={`rotate(${f((a * 180) / Math.PI + 90)} ${f(Math.cos(a) * rad * 0.7)} ${f(Math.sin(a) * rad * 0.7)})`} fill={col} opacity={0.72} />;
    });
  });
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <WatercolorDefs id={id} seed={seed} wobble={size * 0.12} />
      <g filter={`url(#${id})`} style={{ mixBlendMode: "multiply" } as CSSProperties}>{rings}</g>
      <circle r={size * 0.1} fill={center} opacity={0.9} />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={f(Math.cos(i * 0.7) * size * 0.12)} cy={f(Math.sin(i * 0.7) * size * 0.12)} r={size * 0.025} fill={center} />)}
    </g>
  );
}

/** Single-stroke olive / laurel sprig for minimal designs. */
export function Sprig({ length = 100, bend = 10, leaves = 8, color = "currentColor", seed = 2, width = 1 }: { length?: number; bend?: number; leaves?: number; color?: string; seed?: number; width?: number }) {
  const r = rng(seed);
  const parts: ReactNode[] = [<path key="s" d={`M0 0Q${length / 2} ${-bend * 2} ${length} 0`} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" />];
  for (let i = 1; i <= leaves; i++) {
    const t = i / (leaves + 1);
    const x = length * t, y = -bend * 2 * 2 * t * (1 - t) * 1;
    const L = 11 * (1.1 - t * 0.5) * (0.9 + r() * 0.2);
    for (const s of [-1, 1]) parts.push(<path key={`${i}${s}`} d={`M${f(x)} ${f(y)}q${f(L * 0.5)} ${f(s * L * 0.15)} ${f(L)} ${f(s * -L * 0.75)}q${f(-L * 0.55)} ${f(s * L * 0.1)} ${f(-L)} ${f(s * L * 0.75)}z`} fill={color} fillOpacity={0.14} stroke={color} strokeWidth={width * 0.8} strokeLinejoin="round" />);
  }
  return <g>{parts}</g>;
}

/** Eight-point star lattice (girih-inspired), as an SVG <pattern>. Geometry is public domain mathematics. */
export function StarPattern({ id, size = 48, stroke = "#C9A24B", width = 0.8, fill = "none" }: { id: string; size?: number; stroke?: string; width?: number; fill?: string }) {
  const s = size, c = s / 2, R = s * 0.5, ri = R * 0.62;
  const star = Array.from({ length: 16 }, (_, i) => { const a = (i * Math.PI) / 8 - Math.PI / 2, rr = i % 2 ? ri : R; return `${f(c + Math.cos(a) * rr)},${f(c + Math.sin(a) * rr)}`; }).join(" ");
  const diamond = `${f(0)},${f(0)} ${f(ri * 0.7)},${f(0)} ${f(0)},${f(ri * 0.7)}`;
  return (
    <pattern id={id} width={s} height={s} patternUnits="userSpaceOnUse">
      <polygon points={star} fill={fill} stroke={stroke} strokeWidth={width} strokeLinejoin="round" />
      <circle cx={c} cy={c} r={ri * 0.42} fill="none" stroke={stroke} strokeWidth={width * 0.8} />
      {[[0, 0], [s, 0], [0, s], [s, s]].map(([x, y], i) => <rect key={i} x={x - ri * 0.3} y={y - ri * 0.3} width={ri * 0.6} height={ri * 0.6} transform={`rotate(45 ${x} ${y})`} fill="none" stroke={stroke} strokeWidth={width * 0.8} />)}
      <polygon points={diamond} fill="none" stroke={stroke} strokeWidth={0} />
    </pattern>
  );
}

/** Radial mandala (mehndi-inspired), layered petal rings. */
export function Mandala({ size = 120, color = "currentColor", rings = 5, strokeWidth = 0.8, seed = 4 }: { size?: number; color?: string; rings?: number; strokeWidth?: number; seed?: number }) {
  const out: ReactNode[] = [];
  for (let k = 0; k < rings; k++) {
    const n = 8 + k * 4, r0 = size * (0.1 + k * 0.17), pl = size * (0.14 + k * 0.012), pw = Math.max(3, ((TAU * r0) / n) * 0.42);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU;
      out.push(<path key={`${k}-${i}`} transform={`rotate(${f((a * 180) / Math.PI)}) translate(0 ${-f(r0)})`} d={`M0 0C${f(pw)} ${f(-pl * 0.3)} ${f(pw)} ${f(-pl * 0.8)} 0 ${f(-pl)}C${f(-pw)} ${f(-pl * 0.8)} ${f(-pw)} ${f(-pl * 0.3)} 0 0Z`} fill={k % 2 ? color : "none"} fillOpacity={0.16} stroke={color} strokeWidth={strokeWidth} />);
    }
    out.push(<circle key={`c${k}`} r={r0 * 0.96} fill="none" stroke={color} strokeWidth={strokeWidth * 0.6} strokeDasharray={k % 2 ? "1 3" : undefined} />);
  }
  void seed;
  return <g>{out}</g>;
}

/** Paisley (boteh) motif. */
export function Paisley({ size = 40, color = "currentColor", strokeWidth = 1, fill = "none", rot = 0, x = 0, y = 0 }: { size?: number; color?: string; strokeWidth?: number; fill?: string; rot?: number; x?: number; y?: number }) {
  const s = size / 40;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 22C-16 20 -22 2 -10 -14C-4 -22 6 -22 10 -14C14 -6 8 4 0 4C-6 4 -8 -2 -4 -6C0 -9 5 -6 3 -1" fill={fill} stroke={color} strokeWidth={strokeWidth / s} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-12 6C-12 -2 -6 -10 2 -10" fill="none" stroke={color} strokeWidth={(strokeWidth * 0.7) / s} strokeLinecap="round" strokeDasharray="1.5 3" />
    </g>
  );
}

/** Arch outline path of width w, height h (semicircle top). */
export const archPath = (w: number, h: number, x = 0, y = 0) => `M${x} ${y + h}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}Z`;
/** Scalloped (waved) top edge, as used for toran-style borders. */
export const scallopPath = (w: number, n: number, depth: number) => {
  const step = w / n; let d = `M0 0`;
  for (let i = 0; i < n; i++) d += `Q${f(step * i + step / 2)} ${f(depth * 2)} ${f(step * (i + 1))} 0`;
  return d;
};

export function Divider({ color = "currentColor", width = 120, kind = "leaf" }: { color?: string; width?: number; kind?: "leaf" | "diamond" | "dots" }) {
  const h = 14, c = width / 2;
  return (
    <svg viewBox={`0 0 ${width} ${h}`} width={width} height={h} aria-hidden="true" fill="none" stroke={color} strokeWidth={0.8}>
      <path d={`M0 ${h / 2}H${c - 14}M${c + 14} ${h / 2}H${width}`} />
      {kind === "diamond" && <path d={`M${c} 1L${c + 6} ${h / 2}L${c} ${h - 1}L${c - 6} ${h / 2}Z`} fill={color} fillOpacity={0.25} />}
      {kind === "leaf" && <g><path d={`M${c - 12} ${h / 2}Q${c - 6} 1 ${c} ${h / 2}Q${c - 6} ${h - 1} ${c - 12} ${h / 2}Z`} fill={color} fillOpacity={0.18} /><path d={`M${c + 12} ${h / 2}Q${c + 6} 1 ${c} ${h / 2}Q${c + 6} ${h - 1} ${c + 12} ${h / 2}Z`} fill={color} fillOpacity={0.18} /></g>}
      {kind === "dots" && <g fill={color}><circle cx={c - 6} cy={h / 2} r={1.2} /><circle cx={c} cy={h / 2} r={1.8} /><circle cx={c + 6} cy={h / 2} r={1.2} /></g>}
    </svg>
  );
}

/** Foil gradient defs (use fill="url(#id)"). */
export function FoilDefs({ id, stops = ["#8A6A2B", "#E9D08A", "#B48A3C", "#F6E7B0", "#9C7630"] }: { id: string; stops?: string[] }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      {stops.map((c, i) => <stop key={i} offset={`${(i / (stops.length - 1)) * 100}%`} stopColor={c} />)}
    </linearGradient>
  );
}
