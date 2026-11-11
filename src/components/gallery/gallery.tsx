"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Nav, SiteFooter } from "@/components/site/nav";
import { FEATURED_DESIGNS, type DesignSpec } from "@/engine/registry";
import { DesignCard, OPENING_NAME } from "./design-card";
import "./gallery.css";

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
      <main className="ed-gallery">
        <div className="ed-width">
          <header className="ed-gallery-head">
            <h1>Invitation designs</h1>
            <p>Open a sample invitation, try its colours and start with your favourite.</p>
          </header>
          <div className="ed-gallery-toolbar">
            <button type="button" className="ed-button ed-button--secondary" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls="gallery-filters">
              <SlidersHorizontal size={17} /> Filters{filterCount ? ` (${filterCount})` : ""}
            </button>
            <p role="status">{results.length} {results.length === 1 ? "design" : "designs"}</p>
            <label>Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="az">Name (A–Z)</option></select></label>
          </div>
          <div className="ed-gallery-filters" id="gallery-filters" hidden={!expanded}>
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
          {filterCount > 0 && <div className="ed-gallery-active">
            {facets.map(({ key }) => {
              const value = filters[key];
              return value ? <button key={key} type="button" aria-label={`Remove ${getLabel(key, value)} filter`} onClick={() => setFilters({ ...filters, [key]: "" })}>{getLabel(key, value)} <X size={14} /></button> : null;
            })}
            <button type="button" onClick={() => setFilters({})}>Clear filters</button>
          </div>}
          {results.length ? <div className="ed-gallery-grid">{results.map((spec) => <DesignCard key={spec.id} spec={spec} />)}</div>
            : <div className="ed-gallery-empty"><h2>No matching designs</h2><p>Try removing a filter to see more options.</p><button type="button" className="ed-button ed-button--primary" onClick={() => setFilters({})}>Clear filters</button></div>}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
