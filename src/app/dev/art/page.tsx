import { notFound } from "next/navigation";
import { Branch, Wreath, Peony, Sprig, StarPattern, Mandala, Paisley, Divider, FoilDefs } from "@/engine/art";

export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main style={{ padding: 24, background: "#FBF8F2", minHeight: "100vh" }}>
      <svg viewBox="0 0 900 640" width="100%" style={{ maxWidth: 1000 }}>
        <g transform="translate(160 160)"><Wreath r={110} /></g>
        <g transform="translate(160 160)"><text textAnchor="middle" y="8" fontFamily="serif" fontSize="22">Layla &amp; Omar</text></g>
        <g transform="translate(340 220)"><Branch length={160} bend={22} leaves={11} seed={4} /></g>
        <g transform="translate(560 130)"><Peony size={46} seed={3} /><Peony x={60} y={30} size={34} seed={9} /><Branch length={70} bend={8} seed={6} transform="translate(-10 60) rotate(30)" /></g>
        <g transform="translate(740 140)" stroke="#6b7d5b" fill="none"><Sprig length={120} bend={9} /></g>
        <svg x="20" y="330" width="260" height="260"><defs><StarPattern id="sp" size={40} stroke="#B8923F" /></defs><rect width="260" height="260" fill="#0F3D33" /><rect width="260" height="260" fill="url(#sp)" /></svg>
        <g transform="translate(420 450)" color="#9A5B3C"><Mandala size={200} /></g>
        <g transform="translate(640 450)" color="#B3396B"><Paisley size={70} x={0} y={0} /><Paisley size={50} x={70} y={20} rot={40} /></g>
        <g transform="translate(700 560)" color="#8a6a2b"><foreignObject width="150" height="20"><div><Divider /></div></foreignObject></g>
      </svg>
    </main>
  );
}
