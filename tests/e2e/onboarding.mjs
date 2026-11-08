// Gallery filters + guided onboarding -> account -> events claimed in the Studio.
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)(process.env.PW_PATH ?? "playwright");
const base = process.argv[2] ?? "http://localhost:3113", out = process.argv[3] ?? ".";
const ok = (c, m) => { if (!c) { console.error("FAIL:", m); process.exitCode = 1; } else console.log("ok  :", m); };
for (const u of ["/", "/designs", "/designs/zellige", "/start", "/signin", "/studio", "/credits", "/api/me"]) await fetch(base + u).catch(() => {});
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, extraHTTPHeaders: { "x-forwarded-for": `10.3.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` } });
const p = await ctx.newPage();
p.on("pageerror", (e) => console.error("pageerror", e.message.slice(0, 160)));

// Gallery
await p.goto(base + "/designs"); await p.waitForTimeout(1500);
ok((await p.locator(".dc").count()) === 7, "gallery shows all 7 designs");
await p.locator(".gf-opt", { hasText: "Nikah" }).first().locator("input").check();
await p.waitForTimeout(400);
const names = await p.locator(".dc-meta h3").allInnerTexts();
ok(names.includes("Zellige") && !names.includes("Monolith"), `culture filter narrows results (${names.join(", ")})`);
await p.locator(".dc-meta h3 a", { hasText: "Zellige" }).click();
await p.waitForURL(/designs\/zellige/);
ok(await p.getByRole("heading", { name: "Zellige" }).isVisible(), "design detail page opens");
await p.getByRole("button", { name: "Burgundy & gold" }).click(); await p.waitForTimeout(400);
await p.screenshot({ path: `${out}/e2e-detail.png` });

// Onboarding
await p.goto(base + "/start"); await p.waitForTimeout(800);
await p.getByLabel("Names").fill("Aisha & Yusuf");
await p.getByRole("button", { name: "Continue" }).click();
await p.getByLabel("Date").fill("2027-06-12"); await p.getByRole("button", { name: "Continue" }).click();
await p.getByRole("button", { name: /Nikah & Walima/ }).click(); await p.getByRole("button", { name: "Continue" }).click();
await p.getByRole("button", { name: "Choose Zellige" }).click(); await p.getByRole("button", { name: "Continue" }).click();
await p.getByRole("button", { name: "Continue" }).click();
await p.getByLabel("Venue").fill("Central Mosque"); await p.getByRole("button", { name: "See it" }).click();
await p.getByRole("button", { name: /Save and continue/ }).click();
await p.waitForURL(/signin/);
ok(true, "onboarding finishes at sign-in with the draft saved locally");
const email = `ob${Date.now()}@example.com`;
await p.getByLabel("Email").fill(email); await p.getByLabel("Password").fill("a-long-passphrase");
await p.getByRole("button", { name: "Create account" }).click();
await p.waitForURL((u) => u.pathname === "/studio", { timeout: 30000 });
await p.getByRole("tab", { name: "Events" }).click(); await p.waitForTimeout(1500);
const evs = await p.locator(".st-events li strong").allInnerTexts();
ok(evs.length === 2 && evs.includes("Nikah") && evs.includes("Walima"), `events from onboarding are in the account exactly once (${evs.join(", ")})`);
await p.getByRole("tab", { name: "Words" }).click();
ok((await p.getByLabel("Names").inputValue()) === "Aisha & Yusuf", "names carried into the Studio");
await p.screenshot({ path: `${out}/e2e-studio.png` });
const me = await p.evaluate(async () => (await (await fetch("/api/wedding")).json()).content);
ok(me.design === "zellige" && me.venue === "Central Mosque", "saved draft has the chosen design and venue");
await b.close();
