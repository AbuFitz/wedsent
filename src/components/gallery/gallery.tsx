"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Nav, SiteFooter } from "@/components/site/nav";
import { FEATURED_DESIGNS, type DesignSpec } from "@/engine/registry";
import { DesignCard, OPENING_NAME } from "./design-card";

type Facet = "culture" | "style" | "colour" | "shape" | "opening";
const facets: { key: Facet; label: string; values: (design: DesignSpec) => string[] }[] = [
  { key: "style", label: "Style", values: (design) => design.styles },
  { key: "colour", label: "Colour", values: (design) => design.colours },
  { key: "opening", label: "Opening", values: (design) => [design.opening.kind] },
  { key: "culture", label: "Celebration", values: (design) => design.cultures },
  { key: "shape", label: "Shape", values: (design) => [design.shape] },
];
const choices = facets.map((facet) => ({ ...facet, options: [...new Set(FEATURED_DESIGNS.flatMap(facet.values))] }));
const getLabel = (key: Facet, value: string) => key === "opening" ? OPENING_NAME[value as keyof typeof OPENING_NAME] : value;

export function Gallery({ initial }: { initial?: Partial<Record<Facet, string>> }) {
  const [filters, setFilters] = useState<Partial<Record<Facet, string>>>(initial ?? {});
  const [expanded, setExpanded] = useState(Boolean(initial?.culture));
  const [sort, setSort] = useState("featured");
  const filterCount = Object.values(filters).filter(Boolean).length;
  const matched = FEATURED_DESIGNS.filter((design) => facets.every(({ key, values }) => !filters[key] || values(design).includes(filters[key])));
  const results = sort === "az" ? [...matched].sort((a, b) => a.name.localeCompare(b.name)) : matched;

  return (
    <>
      <Nav />
      <main className="ws-page">
        <div className="ws-wrap">
          <header className="ws-page-head">
            <p className="ws-eyebrow">The designs</p>
            <h1 className="ws-h1">Pick how it opens.</h1>
            <p className="ws-lead">Eight designs, each with its own opening, lettering and colours. Open one, change it, make it yours.</p>
          </header>
          <div className="ws-bar">
            <button type="button" className="ws-chipbtn" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls="gallery-filters"><SlidersHorizontal size={15} style={{ verticalAlign: "-2px", marginRight: 6 }} />Filters{filterCount ? ` (${filterCount})` : ""}</button>
            {filterCount > 0 && <button type="button" className="ws-chipbtn" onClick={() => setFilters({})}>Clear</button>}
            <span className="ws-bar-count" role="status">{results.length} {results.length === 1 ? "design" : "designs"}</span>
            <label className="sr-only" htmlFor="sort">Sort</label>
            <select id="sort" className="ws-chipbtn" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="az">Name (A–Z)</option></select>
          </div>
          <div className="ws-facets" id="gallery-filters" hidden={!expanded}>
            {choices.map(({ key, label, options }) => (
              <label key={key}>{label}
                <select value={filters[key] ?? ""} onChange={(event) => setFilters({ ...filters, [key]: event.target.value })}>
                  <option value="">All</option>
                  {filters[key] && !options.includes(filters[key]) && <option>{filters[key]}</option>}
                  {options.map((value) => <option key={value} value={value}>{getLabel(key, value)}</option>)}
                </select>
              </label>
            ))}
          </div>
          {results.length ? <div className="ws-grid">{results.map((spec) => <DesignCard key={spec.id} spec={spec} />)}</div>
            : <div className="ws-empty"><h2 className="ws-h2">No matching designs</h2><p className="ws-lead">Try removing a filter.</p><button type="button" className="ws-pill ws-pill--dark" onClick={() => setFilters({})}>Clear filters</button></div>}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
