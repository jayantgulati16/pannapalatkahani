// Comic pages from an episode's key frames — for approval before the video is rendered.
// node films/comic/make_comic.mjs <spec.json> <out_prefix>
// spec: { series, ep, title, panels: [{ img: "/abs/path.jpg", text: "…", note?: "…" }] }   4 panels per page (2×2, 9:16 frames)
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
const [specPath, outPrefix] = process.argv.slice(2);
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const HERE = path.dirname(new URL(import.meta.url).pathname);
const fontDir = path.resolve(HERE, '../baarish-wali-chitthi/fonts');
const esc = s => String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const per = 4, pages = [];
for (let i = 0; i < spec.panels.length; i += per) pages.push(spec.panels.slice(i, i + per));
const css = `
@font-face{font-family:Kalam;font-weight:400;src:url(file://${fontDir}/kalam-devanagari-400-normal.woff2)}
@font-face{font-family:Kalam;font-weight:700;src:url(file://${fontDir}/kalam-devanagari-700-normal.woff2)}
@font-face{font-family:KalamL;font-weight:400;src:url(file://${fontDir}/kalam-latin-400-normal.woff2)}
@font-face{font-family:KalamL;font-weight:700;src:url(file://${fontDir}/kalam-latin-700-normal.woff2)}
*{box-sizing:border-box} body{margin:0;background:#f4efe3;font-family:KalamL,Kalam,sans-serif;color:#2d3263}
.page{width:1240px;padding:40px 44px 34px;background:#f4efe3 radial-gradient(circle at 30% 20%,#fbf7ec,#efe7d4)}
.head{display:flex;justify-content:space-between;align-items:baseline;border-bottom:5px solid #2d3263;padding-bottom:10px;margin-bottom:26px}
.head h1{margin:0;font-size:58px;font-weight:700;line-height:1.1}
.head .s{font-size:28px;font-weight:700;color:#d4483c}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:28px}
.panel{position:relative;border:6px solid #2d3263;border-radius:6px;background:#fff;box-shadow:6px 7px 0 #2d3263;transform:rotate(var(--r))}
.panel img{display:block;width:100%;aspect-ratio:9/16;object-fit:cover}
.num{position:absolute;top:-6px;left:-6px;background:#d4483c;color:#fff;font-weight:700;font-size:30px;padding:2px 14px;border:5px solid #2d3263;border-radius:6px 0 10px 0}
.cap{position:absolute;left:14px;right:14px;bottom:14px;background:#f5c63c;border:4px solid #2d3263;border-radius:4px;padding:10px 14px;font-size:31px;font-weight:700;line-height:1.3;box-shadow:3px 4px 0 #2d3263}
.note{font-size:21px;font-weight:400;margin-top:4px;color:#2d3263;opacity:.85}
.foot{display:flex;justify-content:space-between;margin-top:26px;font-size:24px;font-weight:700}
`;
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1240, height: 1000 }, deviceScaleFactor: 1 });
const outs = [];
let n = 0;
for (let p = 0; p < pages.length; p++) {
  const panels = pages[p].map((q, i) => { n++; const r = ((n * 37) % 5 - 2) * 0.35;
    return `<div class="panel" style="--r:${r}deg"><img src="file://${q.img}"><div class="num">${n}</div><div class="cap">${esc(q.text)}${q.note ? `<div class="note">${esc(q.note)}</div>` : ''}</div></div>`; }).join('');
  const html = `<!doctype html><meta charset="utf-8"><style>${css}</style><div class="page"><div class="head"><h1>${esc(spec.title)}</h1><div class="s">${esc(spec.series)} · Ep ${esc(spec.ep)}</div></div><div class="grid">${panels}</div><div class="foot"><span>@pannapalatkahani</span><span>पेज ${p + 1}/${pages.length}</span></div></div>`;
  const f = `${outPrefix}_tmp.html`; fs.writeFileSync(f, html);
  await page.goto('file://' + path.resolve(f));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const el = await page.$('.page'); const out = `${outPrefix}_p${p + 1}.jpg`;
  await el.screenshot({ path: out, type: 'jpeg', quality: 88 });
  outs.push(out); fs.unlinkSync(f);
}
await browser.close();
console.log(outs.join('\n'));
