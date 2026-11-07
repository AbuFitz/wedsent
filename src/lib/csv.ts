/** Minimal RFC-4180 parser (quotes, escaped quotes, CRLF). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", q = false;
  const s = text.replace(/^﻿/, "");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === '"') { if (s[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && s[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((x) => x.trim() !== "")) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim() !== "")) rows.push(row);
  return rows;
}

/** CSV injection guard: cells starting with = + - @ are prefixed so spreadsheets do not run them. */
export function csvCell(v: unknown) {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
export const toCsv = (rows: unknown[][]) => rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";

export type ImportRow = { household: string; guest: string; email: string; child: boolean; line: number };
export type ImportPreview = { rows: ImportRow[]; errors: { line: number; message: string }[]; duplicates: { line: number; guest: string; reason: string }[] };

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

/** Expected headers (any order): household, name, email, child. `household` may be blank = own household. */
export function previewImport(text: string, existing: { name: string; email?: string | null }[]): ImportPreview {
  const out: ImportPreview = { rows: [], errors: [], duplicates: [] };
  const table = parseCsv(text);
  if (!table.length) { out.errors.push({ line: 1, message: "The file is empty." }); return out; }
  const head = table[0].map(norm);
  const idx = (n: string[]) => head.findIndex((h) => n.includes(h));
  const iName = idx(["name", "guest", "guest name", "full name"]);
  const iHouse = idx(["household", "family", "group"]);
  const iEmail = idx(["email", "e-mail"]);
  const iChild = idx(["child", "is child", "kid"]);
  if (iName < 0) { out.errors.push({ line: 1, message: "Add a “name” column." }); return out; }
  const seenName = new Set(existing.map((e) => norm(e.name)));
  const seenEmail = new Set(existing.map((e) => norm(e.email ?? "")).filter(Boolean));
  table.slice(1).forEach((r, i) => {
    const line = i + 2;
    const guest = (r[iName] ?? "").trim();
    if (!guest) { out.errors.push({ line, message: "Missing name." }); return; }
    if (guest.length > 120) { out.errors.push({ line, message: "Name is too long." }); return; }
    const email = (iEmail >= 0 ? r[iEmail] ?? "" : "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { out.errors.push({ line, message: `“${email}” is not a valid email.` }); return; }
    const dupName = seenName.has(norm(guest));
    const dupEmail = email && seenEmail.has(norm(email));
    if (dupName || dupEmail) { out.duplicates.push({ line, guest, reason: dupEmail ? "Email already on your list" : "Name already on your list" }); return; }
    seenName.add(norm(guest)); if (email) seenEmail.add(norm(email));
    const child = iChild >= 0 && /^(y|yes|true|1|child)$/i.test((r[iChild] ?? "").trim());
    out.rows.push({ household: ((iHouse >= 0 ? r[iHouse] : "") ?? "").trim() || guest, guest, email, child, line });
  });
  return out;
}
