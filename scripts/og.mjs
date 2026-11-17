// Regenerates public/og.png (the 1200×630 image shown when the site is shared) from the hero.
// Usage: npm run build && npm run preview   (in another terminal)   then   node scripts/og.mjs
import { chromium } from '@playwright/test';

const base = process.argv[2] ?? 'http://localhost:4321';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(`${base}/en/`);
await page.waitForTimeout(6200); // headline reveal done, the map a few steps in
await page.screenshot({ path: 'public/og.png' });
await browser.close();
console.log('wrote public/og.png');
