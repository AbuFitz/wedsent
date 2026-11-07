import { api, json, mine } from "@/server/api";
import { listHouseholds, importHouseholds } from "@/server/guests";
import { previewImport } from "@/lib/csv";
import { bad } from "@/server/errors";
/** Two-step: { csv } returns a preview (rows, errors, duplicates); { csv, eventIds, confirm:true } imports the clean rows only. */
export const POST = api(async (req) => {
  const { user, weddingId } = await mine();
  const b = await json(req);
  const csv = String(b.csv ?? "");
  if (csv.length > 400_000) throw bad("That file is too large. Import up to 500 guests at a time.");
  const hs = await listHouseholds(user.id, weddingId, "");
  const existing = hs.flatMap((h) => h.guests.map((g) => ({ name: g.name, email: g.email })));
  const preview = previewImport(csv, existing);
  if (!b.confirm) return preview;
  if (preview.errors.length && !b.skipErrors) throw bad("Fix the highlighted rows or choose to skip them.", preview);
  return importHouseholds(user.id, weddingId, preview.rows, Array.isArray(b.eventIds) ? b.eventIds.map(String) : []);
});
