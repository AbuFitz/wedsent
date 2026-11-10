"use client";
import { useMemo, useState } from "react";
import { FunnelSimple, X } from "@phosphor-icons/react";
import { Nav } from "@/components/site/nav";
import { FEATURED_DESIGNS, FACETS } from "@/engine/registry";
import { DesignCard, OPENING_NAME } from "./design-card";
import "./gallery.css";

type Facet = "culture" | "style" | "colour" | "shape" | "opening";
const FACET_LABEL: Record<Facet, string> = { culture: "Celebration", style: "Style", colour: "Colour", shape: "Shape", opening: "How it opens" };
const ORDER: Facet[] = ["culture", "style", "colour", "shape", "opening"];

export function Gallery({ initial }: { initial?: Partial<Record<Facet, string>> }) {
  const [sel, setSel] = useState<Record<Facet, string[]>>({ culture: initial?.culture ? [initial.culture] : [], style: [], colour: [], shape: [], opening: [] });
  const [sheet, setSheet] = useState(false);
  const [sort, setSort] = useState<"featured" | "az">("featured");
  const toggle = (f: Facet, v: string) => setSel((s) => ({ ...s, [f]: s[f].includes(v) ? s[f].filter((x) => x !== v) : [...s[f], v] }));
  const active = ORDER.flatMap((f) => sel[f].map((v) => ({ f, v })));

  const list = useMemo(() => {
    const l = FEATURED_DESIGNS.filter((d) => {
      const has: Record<Facet, string[]> = { culture: d.cultures, style: d.styles, colour: d.colours, shape: [d.shape], opening: [d.opening.kind] };
      return ORDER.every((f) => !sel[f].length || sel[f].some((v) => has[f].includes(v)));
    });
    return sort === "az" ? [...l].sort((a, b) => a.name.localeCompare(b.name)) : l;
  }, [sel, sort]);

  const Filters = (
    <div className="gf">
      {ORDER.map((f) => (
        <details key={f} open={f === "culture" || sel[f].length > 0}>
          <summary>{FACET_LABEL[f]}</summary>
          <div className="gf-opts">
            {FACETS[f].map((v) => (
              <label key={v} className="gf-opt">
                <input type="checkbox" checked={sel[f].includes(v)} onChange={() => toggle(f, v)} />
                <span>{f === "opening" ? OPENING_NAME[v as keyof typeof OPENING_NAME] : v}</span>
              </label>
            ))}
          </div>
        </details>
      ))}
    </div>
  );

  return (
    <>
      <Nav />
      <main className="gl">
        <header className="gl-head">
          <span className="gl-head-kicker">THE WEDDSENT COLLECTION / VOL. 01</span>
          <h1>Find your<br /><em>kind of magic.</em></h1>
          <div className="gl-head-bottom"><p>Art-directed invitations, made for the moment they open. Find one that feels like you, then make it yours.</p><span>EXPLORE THE COLLECTION ↓</span></div>
        </header>

        <div className="gl-editorial-pair"><figure><img src="/art/weddsent-veil.webp" alt="Wedding couple holding hands beneath a veil" width={1000} height={1500}/><figcaption>THE FEELING</figcaption></figure><figure><img src="/art/weddsent-digital-hero.webp" alt="Digital wedding invitation on a phone placed on fine stationery" width={1300} height={866}/><figcaption>THE INVITATION</figcaption></figure></div>

        <div className="gl-bar">
          <button type="button" className="gl-filter-btn" onClick={() => setSheet(true)}><FunnelSimple size={18} /> Filters{active.length ? ` (${active.length})` : ""}</button>
          <div className="gl-chips" aria-label="Active filters">
            {active.map(({ f, v }) => (
              <button key={f + v} type="button" onClick={() => toggle(f, v)}>{f === "opening" ? OPENING_NAME[v as keyof typeof OPENING_NAME] : v} <X size={12} weight="bold" /></button>
            ))}
            {active.length > 0 && <button type="button" className="gl-clear" onClick={() => setSel({ culture: [], style: [], colour: [], shape: [], opening: [] })}>Clear all</button>}
          </div>
          <label className="gl-sort">Sort <select value={sort} onChange={(e) => setSort(e.target.value as "featured" | "az")}><option value="featured">Featured</option><option value="az">A to Z</option></select></label>
        </div>

        <div className="gl-body">
          <aside className="gl-side" aria-label="Filters">{Filters}</aside>
          <section aria-live="polite">
            <p className="gl-count">{list.length} {list.length === 1 ? "design" : "designs"}</p>
            {list.length === 0 ? (
              <div className="gl-empty"><p>No design matches all of those at once.</p><button className="btn btn-dark" onClick={() => setSel({ culture: [], style: [], colour: [], shape: [], opening: [] })}>Clear filters</button></div>
            ) : (
              <div className="gl-grid">{list.map((d) => <DesignCard key={d.id} spec={d} />)}</div>
            )}
          </section>
        </div>

        {sheet && (
          <div className="gl-sheet" role="dialog" aria-modal="true" aria-label="Filters">
            <div className="gl-sheet-in">
              <header><strong>Filters</strong><button type="button" onClick={() => setSheet(false)} aria-label="Close"><X size={20} /></button></header>
              {Filters}
              <button className="btn btn-dark gl-sheet-go" onClick={() => setSheet(false)}>Show {list.length} {list.length === 1 ? "design" : "designs"}</button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
