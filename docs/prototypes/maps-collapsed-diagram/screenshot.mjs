// screenshot.mjs — headless screenshot of a local page, printing page errors.
// Reuses the Playwright + Chromium install under ~/.claude/tools/chollos/node_modules.
// Usage: node screenshot.mjs "<url>" <out.png> [WxH]   (default 480x640)
import { chromium } from '/Users/rubenayla/.claude/tools/chollos/node_modules/playwright/index.mjs';

const [url, out, size] = process.argv.slice(2);
if (!url || !out) { console.error('Usage: node screenshot.mjs "<url>" <out.png> [WxH]'); process.exit(2); }
const [w, h] = (size || '480x640').split('x').map(Number);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: w, height: h } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(String(e)));
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(400);
await page.screenshot({ path: out });
await browser.close();

if (errors.length) { console.log('PAGE ERRORS:\n' + errors.join('\n')); process.exit(1); }
console.log('ok ' + out);
