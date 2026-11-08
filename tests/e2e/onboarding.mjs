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
ok((await p.locator(".dc").count()) === 6, "gallery shows all 6 designs");
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
await p.getByRole("button", { name: /Open in Studio/ }).click();
await p.waitForURL((u) => u.pathname === "/studio", { timeout: 30000 });
ok(true, "onboarding opens the Studio with no sign-in wall");
await p.getByRole("tab", { name: "Events" }).click(); await p.waitForTimeout(800);
let evs = await p.locator(".st-events li strong").allInnerTexts();
ok(evs.length === 2 && evs.includes("Nikah") && evs.includes("Walima"), `signed-out Studio lists the onboarding events (${evs.join(", ")})`);
// add one more event while signed out
await p.getByLabel("Name", { exact: true }).fill("Mehndi"); await p.getByLabel("Street address").fill("2 Rose Lane, E1 1AA"); await p.getByRole("button", { name: "Add event" }).click();
await p.getByText("Mehndi", { exact: true }).first().waitFor({ timeout: 5000 });
ok((await p.locator(".st-events li").count()) === 3, "events can be added without an account");
// photo without an account
await p.getByRole("tab", { name: "Photo" }).click();
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC", "base64");
await p.locator('input[type=file]').first().setInputFiles({ name: "us.png", mimeType: "image/png", buffer: png });
await p.locator(".st-focus img").waitFor({ timeout: 8000 });
ok(await p.locator(".st-focus img").isVisible(), "photo uploads and previews without an account");
await p.locator(".st-focus-hit").click({ position: { x: 20, y: 20 } });
// now create the account: events and photo carry over
await p.getByRole("link", { name: /Save & publish/ }).click();
await p.waitForURL(/signin/);
const email = `ob${Date.now()}@example.com`;
await p.getByLabel("Email").fill(email); await p.getByLabel("Password").fill("a-long-passphrase");
await p.getByRole("button", { name: "Create account" }).click();
await p.waitForURL((u) => u.pathname === "/studio", { timeout: 30000 });
await p.getByRole("tab", { name: "Events" }).click(); await p.waitForTimeout(2500);
evs = await p.locator(".st-events li strong").allInnerTexts();
ok(evs.length === 3 && evs.includes("Mehndi"), `local events moved to the account exactly once (${evs.join(", ")})`);
await p.getByRole("tab", { name: "Words" }).click();
ok((await p.getByLabel("Names").inputValue()) === "Aisha & Yusuf", "names carried into the account");
const w = await p.evaluate(async () => (await (await fetch("/api/wedding")).json()).content);
ok(/^\/media\/[0-9a-f-]{36}$/.test(w.photo?.src ?? ""), `photo was uploaded to the account (${w.photo?.src})`);
await p.screenshot({ path: `${out}/e2e-studio.png` });
ok(w.design === "zellige" && w.venue === "Central Mosque", "saved draft has the chosen design and venue");
await b.close();
