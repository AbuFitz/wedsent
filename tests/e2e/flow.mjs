// Browser end-to-end: sign up -> studio -> events -> guests -> publish -> guest link -> reply -> counts.
// Run against a dev server: WEDSENT_PGLITE=memory next dev -p 3113 ; node tests/e2e/flow.mjs http://localhost:3113 <outdir>
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)(process.env.PW_PATH ?? "playwright");
const base = process.argv[2] ?? "http://localhost:3113", out = process.argv[3] ?? ".";
const ok = (c, m) => { if (!c) { console.error("FAIL:", m); process.exitCode = 1; } else console.log("ok  :", m); };
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, extraHTTPHeaders: { "x-forwarded-for": `10.1.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` } });
const p = await ctx.newPage();
p.on("pageerror", (e) => console.error("pageerror", e.message));
if (process.env.DEBUG_API) p.on("response", (r) => r.url().includes("/api/") && console.log(r.status(), r.request().method(), r.url().replace(base, "")));
const email = `e2e${Date.now()}@example.com`;

// Local draft first (signed out), then sign up claims it.
await p.goto(base + "/studio"); await p.waitForTimeout(800);
await p.getByRole("tab", { name: "Words" }).click();
await p.getByLabel("Names").fill("Layla & Omar");
await p.waitForTimeout(700);
await p.getByRole("link", { name: /Save & publish/ }).click();
await p.waitForURL(/signin/);
await p.getByLabel("Email").fill(email); await p.getByLabel("Password").fill("a-long-passphrase");
await p.getByRole("button", { name: "Create account" }).click();
await p.waitForURL(/\/studio/);
ok(true, "sign-up returns to Studio (next param)");

// Draft claimed from local.
await p.goto(base + "/studio"); await p.waitForTimeout(1200);
await p.getByRole("tab", { name: "Words" }).click();
ok((await p.getByLabel("Names").inputValue()) === "Layla & Omar", "local draft claimed into account");
await p.getByRole("tab", { name: "Details" }).click();
await p.getByLabel("Venue", { exact: true }).fill("Hall of Mirrors");
await p.getByText("Saved to your account").first().waitFor({ timeout: 10000 }).catch(() => {});
ok(await p.getByText("Saved to your account").first().isVisible(), "studio autosaves to server");
await p.reload(); await p.waitForTimeout(1200);
await p.getByRole("tab", { name: "Details" }).click();
ok((await p.getByLabel("Venue", { exact: true }).inputValue()) === "Hall of Mirrors", "draft persists across reload (server)");

// Events + guests.
await p.goto(base + "/dashboard"); await p.getByRole("button", { name: "Events", exact: true }).waitFor({ timeout: 15000 });
await p.getByRole("button", { name: "Events", exact: true }).click();
for (const t of ["Nikah", "Walima"]) { await p.getByLabel("Name", { exact: true }).fill(t); await p.getByRole("button", { name: "Add event" }).click(); await p.waitForTimeout(500); }
await p.getByRole("button", { name: "Guests", exact: true }).click();
await p.getByLabel("People").fill("Sara Khan, sara@example.com\nOmar Khan\nZayn Khan (child)");
await p.getByLabel(/Household name/).fill("The Khans");
await p.getByRole("button", { name: "Add household" }).click(); await p.waitForTimeout(800);
ok(await p.getByText("The Khans").first().isVisible(), "household added");
await p.screenshot({ path: `${out}/dash-guests.png` });

// Publish.
await p.getByRole("button", { name: "Overview", exact: true }).click();
await p.getByRole("button", { name: "Publish invitation" }).click(); await p.waitForTimeout(900);
ok(await p.getByText("You’re live.").isVisible(), "published");
const url = await p.locator(".db-link code").innerText();
await p.screenshot({ path: `${out}/dash-live.png` });

// Guest link (grab from API as the host would copy it).
const hh = await p.evaluate(async () => (await (await fetch("/api/wedding/households")).json()).households);
const link = hh[0].link;
const g = await b.newContext({ viewport: { width: 390, height: 844 } }); const gp = await g.newPage();
gp.on("pageerror", (e) => console.error("guest pageerror", e.message));
const pub = await gp.goto(url); ok(pub.status() === 200, "public link resolves");
await gp.goto(link); await gp.waitForTimeout(1500);
await gp.screenshot({ path: `${out}/guest-cover.png` });
const raw = await (await fetch(link)).text();
ok(!raw.includes("Khan") && !raw.includes("Layla") && /noindex/.test(raw), "guest link server HTML/meta has no guest or couple data and is noindex");
await gp.goto(link.replace(/\/r\//, "/r/") + "/reply"); await gp.waitForTimeout(1000);
ok(await gp.getByText("Who’s coming, The Khans?").isVisible(), "reply flow shows household");
const rows = gp.locator(".rp-person");
const n = await rows.count();
for (let i = 0; i < n; i++) await rows.nth(i).getByRole("button", { name: i % 3 === 1 ? "No" : "Yes" }).click();
await gp.screenshot({ path: `${out}/guest-reply.png` });
await gp.getByRole("button", { name: "Continue" }).click();
await gp.getByRole("button", { name: "Send reply" }).click();
await gp.getByText("Your reply is saved").waitFor({ timeout: 8000 }).catch(() => {});
await gp.waitForTimeout(600);
ok(await gp.getByText("Your reply is saved").isVisible(), "reply saved");
await gp.screenshot({ path: `${out}/guest-done.png` });

// Host sees accurate counts.
await p.getByRole("button", { name: "Replies", exact: true }).click(); await p.waitForTimeout(600);
await p.screenshot({ path: `${out}/dash-replies.png` });
const counts = await p.evaluate(async () => (await (await fetch("/api/wedding/rsvps")).json()).counts);
ok(counts.every((c) => c.invited === 3 && c.attending + c.declined === 3), "host counts: people per event, all 3 answered");

// Revoked link dies.
await p.getByRole("button", { name: "Guests", exact: true }).click();
p.once("dialog", (d) => d.accept());
await p.getByRole("button", { name: "Reset link" }).click(); await p.waitForTimeout(800);
const r = await gp.goto(link + "/reply"); await gp.waitForTimeout(800);
ok(await gp.getByText("This link isn’t active").isVisible(), "old guest link stops working after reset");
await b.close();
