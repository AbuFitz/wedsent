import { colord, extend } from "colord";
import a11y from "colord/plugins/a11y";
import { DESIGNS } from "../src/engine/registry";
import { onColor } from "../src/lib/designs";
extend([a11y]);
for (const d of DESIGNS) for (const p of d.palettes) {
  const on = colord(onColor(p.accent)).contrast(p.accent);
  const t = p.bg && p.fg ? colord(p.fg).contrast(p.bg) : 99;
  const c = p.soft && p.fg ? colord(p.fg).contrast(p.soft) : 99;
  if (on < 4.5 || t < 4.5 || c < 4.5) console.log(d.id, p.id, p.accent, "on", on.toFixed(2), "text", t.toFixed(2), "card", c.toFixed(2));
}
