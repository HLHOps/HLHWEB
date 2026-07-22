// Automated accessibility scan: serves the built ./dist and runs axe-core
// (WCAG 2 A/AA rules) against every page via Playwright/Chromium.
//
//   node scripts/a11y-scan.mjs
//
// Exits non-zero if any page has violations, so it can gate CI later.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';

const DIST = join(process.cwd(), 'dist');
const EXECUTABLE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const axeSource = readFileSync(join(process.cwd(), 'node_modules/axe-core/axe.min.js'), 'utf8');

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.xml': 'application/xml', '.txt': 'text/plain', '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon',
  '.json': 'application/json', '.mp4': 'video/mp4',
};

function resolve(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  let fsPath = join(DIST, p);
  if (existsSync(fsPath) && statSync(fsPath).isDirectory()) fsPath = join(fsPath, 'index.html');
  else if (!extname(fsPath)) {
    if (existsSync(fsPath + '.html')) fsPath += '.html';
    else if (existsSync(join(fsPath, 'index.html'))) fsPath = join(fsPath, 'index.html');
  }
  return fsPath;
}

const server = createServer(async (req, res) => {
  try {
    const fsPath = resolve(req.url);
    const body = await readFile(fsPath);
    res.writeHead(200, { 'content-type': MIME[extname(fsPath)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end('not found');
  }
});

const PAGES = ['/', '/hilltop/', '/littlemeadow/', '/ponderosa/', '/meadow/',
  '/lake/', '/loft/', '/winbeds/', '/hlhid2604/'];

await new Promise((r) => server.listen(0, r));
const port = server.address().port;
const base = `http://127.0.0.1:${port}`;

const browser = await chromium.launch({ executablePath: EXECUTABLE });
const page = await browser.newPage();

let totalViolations = 0;
const summary = [];

for (const path of PAGES) {
  await page.goto(base + path, { waitUntil: 'networkidle' });
  await page.evaluate(axeSource);
  const results = await page.evaluate(async () => {
    return await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    });
  });
  const v = results.violations;
  totalViolations += v.length;
  summary.push({ path, count: v.length });
  console.log(`\n=== ${path} — ${v.length} violation(s) ===`);
  for (const item of v) {
    console.log(`  [${item.impact}] ${item.id}: ${item.help}`);
    console.log(`     ${item.helpUrl}`);
    for (const node of item.nodes.slice(0, 3)) {
      console.log(`     → ${node.target.join(' ')}`);
    }
  }
}

await browser.close();
server.close();

console.log('\n---------------- SUMMARY ----------------');
for (const s of summary) console.log(`${s.count === 0 ? 'PASS' : 'FAIL'}  ${s.path}  (${s.count})`);
console.log(`\nTotal violations across ${PAGES.length} pages: ${totalViolations}`);
process.exit(totalViolations > 0 ? 1 : 0);
