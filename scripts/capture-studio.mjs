/** Capture actual responsive Studio and edit states when run in an unrestricted Playwright environment.
 * Usage: PW_PATH=/path/to/playwright node scripts/capture-studio.mjs http://localhost:3113 ./screenshots
 */
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_PATH || "playwright");
const base = process.argv[2] || "http://127.0.0.1:3113";
const output = resolve(process.argv[3] || "./screenshots");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [360, 390, 430, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    await page.goto(`${base}/studio`, { waitUntil: "networkidle" });
    await page.screenshot({ path: `${output}/studio-${width}-preview.png`, fullPage: true });
    const editButton = page.getByRole("button", { name: /Edit Your words/i });
    if (width <= 860 && await editButton.isVisible()) await editButton.click();
    else await page.getByRole("button", { name: /Soundtrack/i }).first().click();
    await page.screenshot({ path: `${output}/studio-${width}-editing.png`, fullPage: true });
    await page.getByRole("button", { name: /Soundtrack/i }).first().click();
    await page.screenshot({ path: `${output}/studio-${width}-sound.png`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (overflow) throw new Error(`Horizontal overflow at ${width}px`);
    await page.close();
  }
} finally { await browser.close(); }
console.log(`Studio screenshots saved to ${output}`);
