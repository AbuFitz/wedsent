import type { Metadata } from "next";
import Link from "next/link";
import { ASSETS } from "@/engine/assets";
import { FONT_PACKS } from "@/engine/registry";
import { Nav } from "@/components/site/nav";
import "./credits.css";

export const metadata: Metadata = { title: "Artwork credits — Wedsent", description: "Where Wedsent's artwork, fonts and icons come from, and their licences." };

const OTHER = [
  ["Phosphor Icons", "MIT", "https://phosphoricons.com"],
  ["Lucide", "ISC", "https://lucide.dev"],
  ["Motion", "MIT", "https://motion.dev"],
  ["Fontsource (font packaging)", "MIT", "https://fontsource.org"],
  ["colord", "MIT", "https://github.com/omgovich/colord"],
  ["qrcode", "MIT", "https://github.com/soldair/node-qrcode"],
];

export default function Page() {
  const rows = Object.values(ASSETS);
  return (
    <>
      <Nav />
      <main className="cr">
        <h1>Artwork credits</h1>
        <p className="cr-lead">Wedsent’s botanical illustrations and ornament are public-domain or CC0 plates held by museums and libraries, cut out and recoloured for use in invitations. The licence shown is what Wikimedia Commons records for each file. We link every source so you can check it yourself.</p>
        <h2>Illustrations and ornament</h2>
        <ul className="cr-list">
          {rows.map((a) => (
            <li key={a.id}>
              <strong>{a.title.replace(/\.(jpe?g|png|webp)$/i, "")}</strong>
              <span>{a.licence}</span>
              <a href={a.page} target="_blank" rel="noreferrer">Source</a>
            </li>
          ))}
        </ul>
        <h2>Fonts</h2>
        <p className="cr-lead">All typefaces are licensed under the SIL Open Font License 1.1 and self-hosted: {Array.from(new Set(FONT_PACKS.flatMap((f) => [f.head, f.script, f.body].filter(Boolean) as string[]).map((s) => s.split(",")[0].replace(/["']|\sVariable/g, "")))).sort().join(", ")}, plus Amiri, Noto Naskh Arabic, Tiro Devanagari Hindi, Instrument Serif, Geist and Bricolage Grotesque.</p>
        <h2>Software</h2>
        <ul className="cr-list">{OTHER.map(([n, l, u]) => <li key={n}><strong>{n}</strong><span>{l}</span><a href={u} target="_blank" rel="noreferrer">Project</a></li>)}</ul>
        <p className="cr-lead"><Link href="/">Back to Wedsent</Link></p>
      </main>
    </>
  );
}
