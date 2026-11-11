// Featured designs -> a local draft -> account and event persistence in Studio.
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const { chromium } = createRequire(import.meta.url)(process.env.PW_PATH ?? "playwright");
const base = process.argv[2] ?? "http://localhost:3113";
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ["--no-sandbox"] });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(base);
  await page.getByRole("button", { name: "Next design" }).click();
  await page.getByRole("link", { name: "View design", exact: true }).click();
  await page.getByRole("heading", { name: "Sculpted Ivory", exact: true }).waitFor();
  await page.getByRole("button", { name: "Full screen" }).click();
  await page.getByRole("dialog").waitFor();
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "hidden" });

  await page.goto(base + "/designs");
  assert.equal(await page.locator(".dc").count(), 7);
  await page.getByRole("button", { name: "Filters", exact: true }).click();
  await page.getByRole("combobox", { name: "Celebration", exact: true }).selectOption("Nikah");
  const names = await page.locator(".dc-meta h3").allInnerTexts();
  assert(names.includes("The Garden Nikah") && names.length < 7);
  await page.getByRole("link", { name: "The Garden Nikah", exact: true }).click();
  await page.getByRole("link", { name: /Start with/ }).click();

  await page.getByRole("textbox", { name: "Names", exact: true }).fill("Aisha & Yusuf");
  await page.getByLabel("Wedding date").fill("2027-06-12");
  await page.getByLabel("Venue").fill("Central Mosque");
  await page.getByRole("button", { name: "Add an event" }).click();
  await page.getByRole("textbox", { name: "Event 1" }).fill("Nikah");
  await page.getByRole("button", { name: "Add an event" }).click();
  await page.getByRole("textbox", { name: "Event 2" }).fill("Walima");
  await page.getByRole("button", { name: "Choose a design" }).click();
  await page.getByRole("radio", { name: "Rosewood Letter" }).check();
  await page.reload();
  await page.getByRole("heading", { name: "Choose your design" }).waitFor();
  assert(await page.getByRole("radio", { name: "Rosewood Letter" }).isChecked());
  await page.getByRole("button", { name: "Review invitation" }).click();
  await page.getByText("Nikah, Walima", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Create an account" }).click();
  await page.getByRole("heading", { name: "Create your account" }).waitFor();

  await page.getByLabel("Email").fill(`onboarding-${Date.now()}@example.com`);
  await page.getByLabel("Password").fill("test-only-long-password");
  await page.getByRole("button", { name: "Create my account" }).click();
  await page.waitForURL((url) => url.pathname === "/studio");
  await page.getByRole("button", { name: "Celebrations", exact: true }).click();
  await page.getByText("Walima", { exact: true }).first().waitFor();
  const events = await page.locator(".atelier-event-row strong").allInnerTexts();
  assert.deepEqual([...events].sort(), ["Nikah", "Walima"]);
  await page.getByRole("button", { name: "Words", exact: true }).click();
  assert.equal(await page.getByLabel("Names", { exact: true }).inputValue(), "Aisha & Yusuf");
  await page.getByText("Saved to account", { exact: true }).waitFor();
  const { content } = await page.evaluate(async () => (await fetch("/api/wedding")).json());
  assert.equal(content.design, "rosewood");
  assert.equal(content.venue, "Central Mosque");
  await page.goto(base);
  await page.getByRole("link", { name: "Open Studio", exact: true }).waitFor();
  console.log("Carousel, filters, draft recovery, account handoff, and event persistence passed.");
} finally {
  await browser.close();
}
