// टिफ़िन चोर — The Tiffin Thief. Ep 6, posts 23 Nov 2026. Vertical 1080×1920, 24 fps, 47 s. Clean cartoon, daytime.
// Meera's tiffin keeps vanishing from the office fridge. Three suspects. She packs the hottest chilli parathas with a note "बिल्कुल कम मिर्च!".
// Next day's meeting: Sharma sir turns red, smoke from his ears. The boss is the thief — his wife is at her maika and her parathas taste like his mother's.
// Next morning the fridge holds two tiffins.
import { layer, clear, line, fill, dab, handCircle, smooth, CAM, BOIL, WMUL, STYLE, W, H, sx, sy } from './crayon.js';
import { group, clearGroup, part, tube } from './rig.js';
import { clamp, lerp, hash, ss, eio, eo, ei } from '/core/lib.js';
STYLE.clean = true;

export const DUR = 47.0;
const NOSUBS = new URLSearchParams(location.search).get('nosubs') === '1';
const K = { ink: '#1d1b22', bone: '#fbf8f1', cream: '#f3ead2', white: '#ffffff', grey: '#9a9aa3', dgrey: '#55555f', steel: '#b9bfc6', steelD: '#6f767f', steelL: '#e3e7ea',
  wall: '#efe6cf', wallT: '#cfe6df', floor: '#c9c2b6', wood: '#b57f52', woodD: '#7d5434', fridge: '#f1f4f6', fridgeIn: '#e2f0f7', red: '#e2412f', chilli: '#cf2416',
  green: '#4f9a5a', leaf: '#7cc36e', yellow: '#f5c63c', note: '#ffe46b', pink: '#ee8ea4', orange: '#ec8a3c', teal: '#3fa39a', navy: '#2f3e66', blue: '#5f86b0',
  skin: '#e2ab88', skinP: '#c98d68', skinS: '#dda07c', hot: '#e8533f', night: '#25304f', amber: '#e7b25a', tea: '#c8915a', water: '#9fd0f0', monitor: '#2b2f3a' };
const PAPER = [0.965, 0.955, 0.93];
const pr = (t, a, b) => clamp((t - a) / (b - a));
const q2 = t => Math.floor(t * 12 + 1e-6) / 12;
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const AH = 680;

// ——— printed words / voice script (N narrator, M Meera, S Sharma sir) — '|' breaks a line ———
export const SUBS = [
  { t0: 0.0, t1: 4.5, text: '“तीसरी बार… ऑफिस के फ्रिज से|मेरा टिफ़िन फिर गायब!”', who: 'M', vo: 'm1', vt: 0.15 },
  { t0: 4.6, t1: 6.6, text: 'शक तीन लोगों पर था…', who: 'N', vo: 'n1', vt: 4.7 },
  { t0: 14.6, t1: 18.2, text: '“अब देखती हूँ…|कौन खाता है मेरा टिफ़िन!”', who: 'M', vo: 'm2', vt: 14.6 },
  { t0: 21.1, t1: 23.8, text: 'अगले दिन… मीटिंग में।', who: 'N', vo: 'n2', vt: 21.1 },
  { t0: 28.6, t1: 31.4, text: 'टिफ़िन चोर… बॉस निकले!', who: 'N', vo: 'n3', vt: 28.6 },
  { t0: 31.8, t1: 38.4, text: '“बीवी मायके गई है… और तुम्हारे पराठे…|बिल्कुल माँ जैसे हैं।”', who: 'S', vo: 's1', vt: 31.8 },
  { t0: 41.2, t1: 44.6, text: '“कल से… दो टिफ़िन!”', who: 'M', vo: 'm3', vt: 41.3 },
];

// ——— text: Devanagari needs whole words; reveal = clip wiping left → right ———
function wtext(L, str, x, y, o = {}) {
  const g = L.g, scr = !!o.screen, size = (o.size || 40) * (scr ? 1 : CAM.s);
  const st = BOIL.step, ba = BOIL.amp * (o.boil ?? 1), seed = o.seed || 1;
  g.save(); g.font = `${o.weight || 400} ${size}px Kalam`; g.textBaseline = 'alphabetic';
  const words = str.split(' '), sp = g.measureText(' ').width, wd = words.map(w => g.measureText(w).width);
  const tw = wd.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  g.translate(scr ? x : sx(x), scr ? y : sy(y)); if (o.rot) g.rotate(o.rot);
  let cx = o.align === 'left' ? 0 : -tw / 2;
  const rv = o.reveal ?? 1; if (rv <= 0) { g.restore(); return tw; }
  if (rv < 1) { g.beginPath(); g.rect(cx - 12, -size * 1.6, (tw + 24) * rv, size * 2.6); g.clip(); }
  g.fillStyle = o.col || K.bone; g.strokeStyle = o.col || K.bone;
  words.forEach((w, i) => {
    const jx = (hash(seed + i * 3.3 + st * 1.1) - .5) * 1.8 * ba, jy = (hash(seed + i * 7.1 + st * 2.3) - .5) * 1.8 * ba;
    const r = (hash(seed + i * 1.9) - .5) * 0.05 + (hash(seed + i + st * .7) - .5) * 0.02 * ba;
    g.save(); g.translate(cx + wd[i] / 2 + jx, jy); g.rotate(r);
    g.globalAlpha = o.p ?? 1; g.fillText(w, -wd[i] / 2, 0);
    if (o.stroke) { g.lineWidth = o.stroke * (scr ? 1 : CAM.s); g.globalAlpha = (o.p ?? 1) * .55; g.strokeText(w, -wd[i] / 2, 0); }
    g.restore(); cx += wd[i] + sp;
  });
  g.restore(); return tw;
}


function poly(L, pts, col, p = 0.85, o = {}) { fill(L, pts, { col, p, gap: o.gap ?? 9, w: o.w ?? 10, ang: o.ang ?? 0.6, seed: o.seed ?? 1, boil: o.boil ?? 0.3, over: o.over ?? 4 }); }
function edge(L, pts, col, w = 4, p = 0.6, sd = 1, closed = true) { line(L, closed ? [...pts, pts[0]] : pts, { w, col, p, seed: sd, boil: 0.5 }); }
function drawTiffin(C, x, y, k = 1, sd = 800) {   // a three-tier steel dabba, centre x, bottom y; returns the handle top
  const w = 150 * k, h = 105 * k;
  for (let i = 0; i < 3; i++) {
    const yb = y - i * h, q = smooth([[x - w, yb - h + 12 * k], [x + w, yb - h + 12 * k], [x + w, yb - 10 * k], [x, yb + 8 * k], [x - w, yb - 10 * k]], 4);
    part(C, q, { col: K.steel, p: 0.82, gap: 6, w: 8, ang: 1.5, seed: sd + i }, { w: 4.5, col: K.ink, seed: sd + 10 + i });
    line(C.l, [[x - w * 0.6, yb - h * 0.7], [x - w * 0.6, yb - h * 0.25]], { w: 9 * k, col: K.steelL, p: 0.5, seed: sd + 20 + i });
  }
  part(C, smooth([[x - w * 0.95, y - 3 * h + 14 * k], [x, y - 3 * h - 22 * k], [x + w * 0.95, y - 3 * h + 14 * k]], 5, false).concat([[x + w * 0.95, y - 3 * h + 24 * k], [x - w * 0.95, y - 3 * h + 24 * k]]), { col: K.steelL, p: 0.8, gap: 5, w: 7, seed: sd + 30 }, { w: 4, col: K.ink, seed: sd + 31 });
  for (const sg of [-1, 1]) line(C.l, [[x + sg * w * 1.05, y - 10 * k], [x + sg * w * 1.05, y - 3 * h - 40 * k], [x + sg * w * 0.4, y - 3 * h - 90 * k]], { w: 8 * k + 1, col: K.steelD, seed: sd + 40 + sg });
  line(C.l, [[x - w * 0.4, y - 3 * h - 90 * k], [x + w * 0.4, y - 3 * h - 90 * k]], { w: 12 * k + 1, col: K.steelD, seed: sd + 43 });
  return [x, y - 3 * h - 90 * k];
}
function steam(L, x, y, k, t, n = 3, p = 0.5) {
  for (let i = 0; i < n; i++) {
    const ph = ((t * 0.45 + i / n) % 1), pts = [];
    for (let j = 0; j < 12; j++) { const v = j / 11; pts.push([x + (i - (n - 1) / 2) * 60 * k + Math.sin(v * 6 + t * 2 + i) * 22 * k, y - ph * 120 * k - v * 260 * k]); }
    line(L, pts, { w: 7 * k + 1, col: K.bone, p: p * Math.sin(Math.PI * ph), seed: 860 + i });
  }
}

function ik(sh, hd, L1, L2, side) {
  let dx = hd[0] - sh[0], dy = hd[1] - sh[1]; let d = Math.hypot(dx, dy); const mx = L1 + L2 - 1;
  let tgt = hd; if (d > mx) { tgt = [sh[0] + dx / d * mx, sh[1] + dy / d * mx]; dx = tgt[0] - sh[0]; dy = tgt[1] - sh[1]; d = mx; }
  d = Math.max(d, 1e-3);
  const a = Math.atan2(dy, dx), B = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
  const e1 = [sh[0] + Math.cos(a + B) * L1, sh[1] + Math.sin(a + B) * L1], e2 = [sh[0] + Math.cos(a - B) * L1, sh[1] + Math.sin(a - B) * L1];
  const score = e => side * e[0];
  return [score(e1) > score(e2) ? e1 : e2, tgt];
}
function face(C, tp, s, sd) {
  const e = s.exp, lk = s.look || [0, 0], eyeY = -2;
  for (const sg of [-1, 1]) {
    const ex = sg * 18 + lk[0] * 5, ey = eyeY + lk[1] * 4, cx = sg * 18;
    if (e.eyes === 'closed') line(C.l, tp([[cx - 9, eyeY + 1], [cx, eyeY + 5], [cx + 9, eyeY + 1]]), { w: 4.5, col: K.ink, seed: sd + 30 + sg });
    else if (e.eyes === 'half') { line(C.l, tp([[cx - 10, eyeY - 1], [cx + 10, eyeY - 1]]), { w: 4.5, col: K.ink, seed: sd + 30 + sg }); const c = tp([[ex, ey + 2]])[0]; dab(C.l, c[0], c[1], 4.5, { col: K.ink, p: 1, seed: sd + 32 + sg }); }
    else if (e.eyes === 'pop') { const c = tp([[ex, ey]])[0]; fill(C.f, tp(handCircle(cx, eyeY, 12, sd + 27 + sg, 0, 18)), { col: K.white, p: 0.9, gap: 3, w: 5, seed: sd + 26 + sg, over: 1 }); line(C.l, tp(handCircle(cx, eyeY, 12, sd + 28 + sg, 0.1, 20)), { w: 3.5, col: K.ink, seed: sd + 28 + sg }); dab(C.l, c[0], c[1], 3.5, { col: K.ink, p: 1, seed: sd + 32 + sg }); }
    else if (e.eyes === 'glint') { const c = tp([[cx, eyeY]])[0]; fill(C.f, tp(handCircle(cx, eyeY, 14, sd + 27 + sg, 0, 18)), { col: K.white, p: 0.95, gap: 3, w: 5, seed: sd + 26 + sg, over: 1 }); dab(C.l, c[0] - 4, c[1] - 4, 3, { col: K.white, p: 1, seed: sd + 33 + sg }); }
    else { const c = tp([[ex, ey]])[0]; dab(C.l, c[0], c[1], 6, { col: K.ink, p: 1, gap: 3, w: 5, seed: sd + 32 + sg }); dab(C.l, c[0] + 2, c[1] - 2.5, 2, { col: K.white, p: 1, gap: 1.5, w: 3, seed: sd + 34 + sg }); }
    const b = e.brows === 'up' ? [-26, -24] : e.brows === 'down' ? [-17, -22] : e.brows === 'worried' ? [-25, -17] : [-20, -20];
    if (!s.noBrows) line(C.l, tp([[sg * 8, b[0]], [sg * 26, b[1]]]), { w: 4, col: s.browCol || K.ink, seed: sd + 36 + sg });
  }
  const m = e.mouth;
  if (m === 'open') part(C, tp([[-13, 18], [13, 18], [9, 30], [0, 33], [-9, 30]]), { col: '#5a1f22', p: 0.9, gap: 4, w: 6, seed: sd + 50 }, { w: 4, col: K.ink, seed: sd + 51 });
  else if (m === 'o') line(C.l, tp(handCircle(0, 25, 7, sd + 52, 0.1, 14)), { w: 4, col: K.ink, seed: sd + 52 });
  else if (m === 'flat') line(C.l, tp([[-9, 25], [9, 24]]), { w: 4, col: K.ink, seed: sd + 53 });
  else if (m === 'wavy') line(C.l, tp([[-12, 25], [-6, 21], [0, 26], [6, 21], [12, 25]]), { w: 4, col: K.ink, seed: sd + 53 });
  else if (m === 'smile') line(C.l, tp(smooth([[-12, 19], [0, 28], [12, 19]], 5, false)), { w: 4.5, col: K.ink, seed: sd + 58 });
  else line(C.l, tp(smooth([[-6, 23], [0, 26], [6, 23]], 5, false)), { w: 4, col: K.ink, seed: sd + 56 });
}
// s: { kind 'riya'|'amma'|'guard', x, gy, k, hy, fx, hands{L,R}, feet{L,R}, exp, look, t, items, buds, shiver }

// ——— layers ———
const BG = { f: layer(), l: layer() }, GLOW = layer(), PE = group(), PROP = group(), FG = group(), FX = layer(), SUBK = layer(), SUBT = layer();

// ——— shots: [t0, t1, set, cam0, cam1] ———
const SHOTS = [
  [0.0, 4.6, 'fridge', [950, 1750, 1.2], [960, 1820, 1.45]],
  [4.6, 6.6, 'office', [2900, 1950, 0.82], [2900, 1980, 0.9]],
  [6.6, 9.0, 'office', [2350, 2120, 1.9], [2350, 2120, 2.15]],
  [9.0, 11.4, 'office', [2900, 2150, 1.9], [2900, 2150, 2.15]],
  [11.4, 14.0, 'office', [3450, 2080, 1.9], [3450, 2060, 2.25]],
  [14.0, 21.0, 'kitchen', [4900, 2050, 1.0], [4980, 2200, 1.4]],
  [21.0, 24.0, 'meeting', [6850, 2080, 0.84], [6850, 2100, 0.92]],
  [24.0, 28.4, 'meeting', [6950, 2060, 1.7], [6950, 2040, 1.95]],
  [28.4, 31.6, 'meeting', [6850, 2100, 0.92], [6850, 2120, 1.0]],
  [31.6, 38.6, 'meeting', [6950, 2080, 1.8], [6950, 2060, 2.1]],
  [38.6, 40.8, 'meeting', [7350, 2120, 1.9], [7350, 2110, 2.1]],
  [40.8, 45.0, 'fridge2', [960, 1800, 1.3], [960, 1820, 1.45]],
  [45.0, 47.01, 'end', [960, 1820, 1.45], [960, 1820, 1.5]],
];
function shotAt(t) { return SHOTS.find(s => t >= s[0] && t < s[1]) || SHOTS[SHOTS.length - 1]; }
const HITS = [[0.05, 8], [6.6, 6], [9.0, 6], [11.4, 6], [24.4, 10], [28.4, 14]];
function shake(t) {
  let x = 0, y = 0;
  for (const [h, a] of HITS) { const d = t - h; if (d < 0 || d > 0.5) continue; const e = a * Math.exp(-d / 0.08); x += (hash(BOIL.step * 3.1 + h) - .5) * 2 * e; y += (hash(BOIL.step * 5.7 + h) - .5) * 2 * e; }
  return [x, y];
}

// ——— SET: the office pantry fridge ———
function stickyNote(L, x, y, lines, k = 1, rot = 0, sd = 1, wd = 200) {
  const w = wd * k, h = (70 + 52 * lines.length) * k;
  const R = ([a, b]) => [x + a * Math.cos(rot) - b * Math.sin(rot), y + a * Math.sin(rot) + b * Math.cos(rot)];
  part(L, [R([-w / 2, -h / 2]), R([w / 2, -h / 2]), R([w / 2, h / 2]), R([-w / 2, h / 2])], { col: K.note, p: 1, seed: sd }, { w: 3, col: K.woodD, seed: sd + 1 });
  lines.forEach((ln, i) => wtext(L.l, ln, x, y - h / 2 + (70 + i * 52) * k, { size: 40 * k, weight: 700, col: K.ink, seed: sd + 2 + i, rot }));
}
function drawFridge(t, ending) {
  const B = BG;
  poly(B.f, rect(-200, 200, 2000, 3400), K.wall, 1, { seed: 10 });
  poly(B.f, rect(-200, 2900, 2000, 3400), K.floor, 1, { seed: 11 });
  // fridge body + open door on the left
  poly(B.f, rect(560, 600, 1520, 3150), K.fridge, 1, { seed: 12 }); edge(B.l, rect(560, 600, 1520, 3150), K.steelD, 6, 0.9, 13);
  poly(GLOW, rect(620, 680, 1460, 3060), K.fridgeIn, 1, { seed: 14 });
  poly(B.f, [[300, 560], [560, 600], [560, 3150], [300, 3240]], '#dfe4e8', 1, { seed: 15 }); edge(B.l, [[300, 560], [560, 600], [560, 3150], [300, 3240]], K.steelD, 6, 0.9, 16);
  for (const y of [1250, 1900, 2550]) { poly(B.f, rect(620, y, 1460, y + 24), K.steelL, 1, { seed: y }); line(B.l, [[620, y + 24], [1460, y + 24]], { w: 3, col: K.steelD, p: 0.7, seed: y + 1 }); }
  for (const y of [1200, 1850, 2500]) { poly(B.f, [[330, y], [540, y + 20], [540, y + 90], [330, y + 70]], K.steelL, 1, { seed: y + 5 }); }
  // the other things in the fridge
  part(PROP, rect(720, 1000, 820, 1250), { col: K.white, p: 1, seed: 20 }, { w: 3, col: K.steelD, seed: 21 }); part(PROP, rect(745, 960, 795, 1000), { col: K.blue, p: 1, seed: 22 }, { w: 3, col: K.steelD, seed: 23 });
  part(PROP, handCircle(1320, 1190, 55, 24, 0, 24), { col: K.red, p: 1, seed: 25 }, { w: 3, col: K.woodD, seed: 26 }); line(PROP.l, [[1320, 1135], [1330, 1105]], { w: 5, col: K.woodD, seed: 27 });
  part(PROP, smooth([[700, 2470], [1000, 2470], [960, 2550], [740, 2550]], 4), { col: K.leaf, p: 1, seed: 28 }, { w: 3, col: K.green, seed: 29 });
  if (!ending) {   // the empty tiffin: only the bottom tier left, open, a few crumbs; the note
    const x = 1060, y = 1900;
    part(PROP, smooth([[x - 160, y - 100], [x + 160, y - 100], [x + 160, y - 8], [x, y + 8], [x - 160, y - 8]], 4), { col: K.steel, p: 1, seed: 30 }, { w: 4, col: K.ink, seed: 31 });
    part(PROP, smooth([[x - 150, y - 108], [x + 150, y - 108], [x + 130, y - 84], [x - 130, y - 84]], 4), { col: K.steelD, p: 1, seed: 32 }, null);
    for (let i = 0; i < 5; i++) dab(PROP.l, x - 60 + i * 30, y - 96 + (i % 2) * 6, 5, { col: K.tea, p: 1, seed: 33 + i });
    part(PROP, smooth([[x + 170, y - 30], [x + 330, y - 60], [x + 330, y - 10], [x + 170, y + 10]], 4), { col: K.steelL, p: 1, seed: 38 }, { w: 3, col: K.ink, seed: 39 });   // the lid, put aside
    stickyNote(PROP, x - 10, y - 270, ['मीरा का —', 'हाथ मत लगाना!'], 1, -0.06, 40);
    // big "?" floating
    if (t > 1.2) wtext(FX, '?', x + 260, y - 420, { size: 220 * back1(pr(t, 1.2, 1.5)) + 1, weight: 700, col: K.red, seed: 45 });
  } else {          // next morning: two full tiffins, two notes
    drawTiffin(PROP, 880, 1900, 0.62, 50); drawTiffin(PROP, 1240, 1900, 0.62, 60);
    stickyNote(PROP, 880, 1540, ['मीरा का'], 0.9, -0.05, 70);
    stickyNote(PROP, 1240, 1500, ['शर्मा सर का', 'कम मिर्च!'], 0.9, 0.05, 80);
  }
}
const back1 = u => { u = clamp(u) - 1; return 1 + u * u * (2.8 * u + 1.8); };

// ——— SET: the open office ———
const DESKS = [2350, 2900, 3450];
function drawOffice(t) {
  const B = BG;
  poly(B.f, rect(1900, 200, 3900, 2500), K.wallT, 1, { seed: 100 });
  poly(B.f, rect(2000, 600, 3800, 1350), '#bfe3f7', 1, { seed: 101 });   // window band, the city
  for (let i = 0; i < 12; i++) { const x = 2020 + i * 150, h = 180 + 260 * hash(i * 3.3); poly(B.f, rect(x, 1350 - h, x + 120, 1350), i % 2 ? '#9bb7cc' : '#88a6bd', 1, { seed: 102 + i }); }
  edge(B.l, rect(2000, 600, 3800, 1350), K.white, 14, 1, 120);
  for (let i = 1; i < 6; i++) line(B.l, [[2000 + i * 300, 600], [2000 + i * 300, 1350]], { w: 10, col: K.white, seed: 121 + i });
  poly(B.f, rect(1900, 2500, 3900, 3400), K.floor, 1, { seed: 130 });
  // plant
  part(PROP, rect(1990, 2250, 2110, 2500), { col: K.woodD, p: 1, seed: 131 }, { w: 3, col: K.ink, seed: 132 });
  for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.35; part(PROP, smooth([[2050, 2250], [2050 + Math.cos(a) * 80 - 20, 2250 + Math.sin(a) * 160], [2050 + Math.cos(a) * 160, 2250 + Math.sin(a) * 220], [2050 + Math.cos(a) * 80 + 20, 2250 + Math.sin(a) * 160]], 4), { col: K.green, p: 1, seed: 133 + i }, { w: 2, col: K.ink, seed: 140 + i }); }
}
function drawDesks(C, t) {
  DESKS.forEach((x, i) => {
    part(C, rect(x - 250, 2360, x + 250, 2900), { col: K.wood, p: 1, seed: 150 + i }, { w: 5, col: K.ink, seed: 160 + i });
    part(C, rect(x - 270, 2330, x + 270, 2370), { col: K.woodD, p: 1, seed: 170 + i }, { w: 4, col: K.ink, seed: 180 + i });
    part(C, rect(x + 70, 2120, x + 250, 2250), { col: K.monitor, p: 1, seed: 190 + i }, { w: 4, col: K.ink, seed: 200 + i });
    part(C, rect(x + 150, 2250, x + 170, 2330), { col: K.dgrey, p: 1, seed: 210 + i }, null);
    if (i === 0) {   // Pinto: a big chips packet
      part(C, smooth([[x - 220, 2330], [x - 210, 2190], [x - 120, 2180], [x - 110, 2330]], 4), { col: K.yellow, p: 1, seed: 220 }, { w: 3, col: K.ink, seed: 221 });
      wtext(C.l, 'CHIPS', x - 165, 2270, { size: 26, weight: 700, col: K.red, seed: 222, rot: -0.05 });
    }
    if (i === 1) {   // Sweety: a salad bowl on top… and a paratha wrapper under the desk
      part(C, smooth([[x - 220, 2330], [x - 60, 2330], [x - 80, 2290], [x - 200, 2290]], 4), { col: K.white, p: 1, seed: 230 }, { w: 3, col: K.ink, seed: 231 });
      for (let j = 0; j < 5; j++) dab(C.l, x - 190 + j * 26, 2285 - (j % 2) * 10, 14, { col: j % 2 ? K.leaf : K.red, p: 1, seed: 232 + j });
      part(C, handCircle(x + 120, 2960, 46, 238, 0, 18), { col: K.steelL, p: 1, seed: 239 }, { w: 3, col: K.ink, seed: 240 });
      dab(C.l, x + 108, 2950, 16, { col: K.amber, p: 0.8, seed: 241 });
      if (t > 9.6 && t < 11.4) line(FX, handCircle(x + 120, 2960, 78, 242, 0.15, 30), { w: 7, col: K.red, seed: 243, draw: pr(t, 9.6, 10.1) });
    }
    if (i === 2) { part(C, rect(x - 230, 2280, x - 60, 2330), { col: K.navy, p: 1, seed: 250 }, { w: 3, col: K.ink, seed: 251 }); wtext(C.l, 'BOSS', x - 145, 2318, { size: 30, weight: 700, col: K.yellow, seed: 252 }); }
  });
}

// ——— SET: Meera's kitchen at night ———
function drawKitchen(t) {
  const B = BG;
  poly(B.f, rect(3900, 200, 5900, 2550), '#f2d9a8', 1, { seed: 300 });
  poly(B.f, rect(4150, 800, 4650, 1500), K.night, 1, { seed: 301 }); edge(B.l, rect(4150, 800, 4650, 1500), K.woodD, 14, 1, 302);
  dab(B.f, 4540, 920, 40, { col: K.cream, p: 1, seed: 303 }); dab(B.f, 4560, 910, 36, { col: K.night, p: 1, seed: 304 });
  for (let i = 0; i < 4; i++) poly(B.f, rect(5050 + i * 170, 1150 + (i % 2) * 30, 5170 + i * 170, 1450), ['#d7a35b', '#c8915a', '#e0b56e', '#b8844f'][i], 1, { seed: 305 + i });   // jars on a shelf
  poly(B.f, rect(5020, 1450, 5760, 1480), K.woodD, 1, { seed: 310 });
  wtext(B.l, 'मिर्च', 5115, 1330, { size: 34, weight: 700, col: K.chilli, seed: 311 });
  poly(B.f, rect(3900, 2550, 5900, 3400), '#d2b48a', 1, { seed: 312 });
  // bulb
  line(B.l, [[4900, 200], [4900, 640]], { w: 3, col: K.ink, seed: 313 }); poly(GLOW, handCircle(4900, 680, 36, 314, 0, 20), K.yellow, 1, { seed: 315 });
}
function drawCounter(C, t) {
  part(C, rect(4050, 2420, 5750, 3150), { col: K.wood, p: 1, seed: 320 }, { w: 5, col: K.ink, seed: 321 });
  part(C, rect(4020, 2390, 5780, 2440), { col: K.cream, p: 1, seed: 322 }, { w: 4, col: K.ink, seed: 323 });
  part(C, rect(4500, 2330, 4900, 2390), { col: K.steelD, p: 1, seed: 324 }, { w: 4, col: K.ink, seed: 325 });
  part(C, smooth([[4480, 2330], [4920, 2330], [4880, 2300], [4520, 2300]], 4), { col: K.ink, p: 1, seed: 326 }, null);
  part(C, smooth([[4580, 2300], [4820, 2300], [4800, 2275], [4600, 2275]], 4), { col: '#d9a35b', p: 1, seed: 327 }, { w: 3, col: K.woodD, seed: 328 });
  // chillies piling up on the paratha
  const n = Math.floor(clamp((t - 15.4) / 2.4) * 14);
  for (let i = 0; i < n; i++) { const x = 4610 + hash(i * 3.1) * 180, y = 2272 - hash(i * 7.3) * 18; line(C.l, [[x - 22, y], [x + 22, y - 6]], { w: 12, col: K.chilli, seed: 330 + i }); line(C.l, [[x + 22, y - 6], [x + 30, y - 12]], { w: 5, col: K.green, seed: 360 + i }); }
  // a falling chilli
  if (t > 15.2 && t < 17.9) { const u = ((t - 15.2) * 3) % 1, x = 4720 + 30 * Math.sin(t * 7), y = 2050 + 220 * u; line(FX, [[x - 22, y], [x + 22, y - 6]], { w: 12, col: K.chilli, seed: 399 }); }
  // the tiffin, open, and the note she writes
  drawTiffin(C, 5250, 2390, 0.55, 400);
  if (t > 18.3) { const k = 1.25; stickyNote(FG, 5170, 2020, ['बिल्कुल कम मिर्च!'], 1.05, -0.05, 420, 330);
    const halo = handCircle(5170, 1915, 60, 425, 0.1, 24).map(([x, y]) => [x, 1915 + (y - 1915) * 0.3]);
    if (t > 19.4) line(FG.l, halo, { w: 6, col: K.amber, seed: 426, draw: pr(t, 19.4, 19.9) }); }
}

// ——— SET: the meeting room ———
const SEATS = { pinto: 6350, sweety: 6650, sharma: 6950, meera: 7350 };
function drawMeeting(t) {
  const B = BG;
  poly(B.f, rect(5900, 200, 7900, 2500), '#e6e1f0', 1, { seed: 500 });
  poly(B.f, rect(6250, 800, 7550, 1550), K.white, 1, { seed: 501 }); edge(B.l, rect(6250, 800, 7550, 1550), K.steelD, 10, 1, 502);
  line(B.l, [[6350, 1450], [6600, 1300], [6850, 1380], [7100, 1150], [7400, 1000]], { w: 8, col: K.green, seed: 503 });
  wtext(B.l, 'Q3 Sales', 6500, 950, { size: 54, weight: 700, col: K.navy, seed: 504 });
  poly(B.f, rect(5900, 2500, 7900, 3400), K.floor, 1, { seed: 505 });
}
function drawTable(C, t) {
  part(C, rect(6100, 2450, 7700, 2950), { col: K.woodD, p: 1, seed: 510 }, { w: 5, col: K.ink, seed: 511 });
  part(C, rect(6060, 2410, 7740, 2470), { col: K.wood, p: 1, seed: 512 }, { w: 4, col: K.ink, seed: 513 });
  for (const x of [6350, 6650, 7350]) part(C, smooth([[x + 70, 2410], [x + 120, 2410], [x + 116, 2340], [x + 74, 2340]], 3), { col: K.water, p: 0.9, seed: 520 + x }, { w: 3, col: K.ink, seed: 521 + x });
  for (const x of [6250, 6560, 7250]) part(C, rect(x, 2380, x + 120, 2410), { col: K.white, p: 1, seed: 530 + x }, { w: 2, col: K.ink, seed: 531 + x });
}
function drawJug(C, x, y, k = 1, sd = 540, level = 1) {
  part(C, smooth([[x - 60 * k, y - 200 * k], [x + 50 * k, y - 200 * k], [x + 60 * k, y], [x - 60 * k, y]], 3), { col: '#e8f5fb', p: 1, seed: sd }, { w: 4, col: K.ink, seed: sd + 1 });
  if (level > 0) part(C, [[x - 58 * k, y - 190 * k * level], [x + 58 * k, y - 190 * k * level], [x + 60 * k, y], [x - 60 * k, y]], { col: K.water, p: 1, seed: sd + 2 }, null);
  line(C.l, smooth([[x + 50 * k, y - 170 * k], [x + 110 * k, y - 150 * k], [x + 110 * k, y - 60 * k], [x + 56 * k, y - 50 * k]], 5, false), { w: 8 * k + 1, col: K.ink, seed: sd + 3 });
}

// ——— characters ———
const SPEC = {
  meera: { f: 1, top: K.yellow, trim: K.orange, len: 430, bottom: '#f4efe6', shoe: K.red, hair: 'braid', bindi: 1, dupatta: K.pink, skin: K.skin },
  sweety: { f: 1, top: K.teal, len: 340, bottom: '#6d7383', shoe: '#2b2b33', hair: 'pony', glasses: 1, skin: K.skinS, lanyard: 1 },
  pinto: { f: 0, top: K.orange, len: 330, bottom: '#34456b', shoe: K.white, hair: 'spiky', phones: 1, skin: K.skinP, lanyard: 1 },
  sharma: { f: 0, top: '#f6f7fb', len: 330, bottom: '#4a4e5a', shoe: K.ink, hair: 'bald', moustache: 1, glasses: 1, tie: K.navy, belly: 1, skin: K.skin, lanyard: 0 },
};
function person2(C, s, sd) {
  const P0 = SPEC[s.kind], k = s.k ?? 1, hy = s.hy;
  const P = (dx, dy) => [s.x + dx * k, hy + dy * k], tp = pts => pts.map(([a, b]) => P(a, b));
  WMUL.k = clamp(Math.sqrt(k), 0.45, 1.3);
  const skinC = s.skinCol || P0.skin, skin = { col: skinC, p: 1, gap: 7, w: 9, seed: sd + 1 }, O = (w, q) => ({ w, col: K.ink, seed: q, p: 0.9 });
  if (!s.seated) for (const [side, sg] of [['L', -1], ['R', 1]]) {   // legs
    const hip = P(sg * 24, 330), [kn, f] = ik(hip, s.feet[side], 178 * k, 178 * k, sg);
    part(C, tube([hip, kn, f], 44 * k, 34 * k), { col: P0.bottom, p: 1, seed: sd + 2 + sg }, O(4, sd + 4 + sg));
    part(C, smooth([[f[0] - 26 * k, f[1] - 10 * k], [f[0] + sg * 6 * k + 22 * k, f[1] - 12 * k], [f[0] + sg * 30 * k, f[1] + 4 * k], [f[0] - 22 * sg * k, f[1] + 10 * k]], 4), { col: P0.shoe, p: 1, seed: sd + 6 + sg }, O(4, sd + 8 + sg));
  }
  if (P0.hair === 'braid' || P0.hair === 'pony') part(C, tp(smooth([[-54, -20], [-48, -60], [0, -72], [48, -60], [56, -20], [60, 40], [-60, 40]], 6)), { col: '#2a201e', p: 1, seed: sd + 12 }, O(4, sd + 13));
  const bw = P0.belly ? 22 : 0, L = P0.len;
  part(C, tp(smooth([[-15, 48], [15, 48], [50, 62], [58 + bw * 0.4, 140], [62 + bw, 250], [64 + bw * 0.6, L - 10], [0, L], [-64 - bw * 0.6, L - 10], [-62 - bw, 250], [-58 - bw * 0.4, 140], [-50, 62]], 3)), { col: P0.top, p: 1, seed: sd + 14 }, O(5, sd + 15));
  if (P0.trim) line(C.l, tp([[-62, L - 26], [62, L - 26]]), { w: 6, col: P0.trim, seed: sd + 16 });
  if (P0.tie) { part(C, tp([[-10, 52], [10, 52], [14, 220], [0, 250], [-14, 220]]), { col: P0.tie, p: 1, seed: sd + 17 }, O(3, sd + 18)); line(C.l, tp([[-30, 48], [0, 70], [30, 48]]), { w: 4, col: K.ink, seed: sd + 19 }); line(C.l, tp([[-66 - bw, 300], [66 + bw, 300]]), { w: 9, col: K.ink, seed: sd + 20 }); }
  if (P0.f === 0 && !P0.tie) line(C.l, tp([[-14, 50], [0, 66], [14, 50]]), { w: 4, col: K.ink, seed: sd + 21 });
  part(C, tp([[-11, 30], [11, 30], [12, 56], [-12, 56]]), skin, O(4, sd + 40));
  for (const sg of [-1, 1]) part(C, tp(handCircle(sg * 50, 6, 11, sd + 41 + sg, 0, 16)), skin, O(4, sd + 43 + sg));
  part(C, tp(handCircle(0, 0, 50, sd + 45, 0.06, 44)), skin, O(5, sd + 46));
  if (P0.hair === 'braid' || P0.hair === 'pony') part(C, tp(smooth([[-55, 2], [-52, -40], [-30, -62], [0, -66], [30, -62], [52, -40], [55, 2], [44, -24], [20, -36], [0, -34], [-26, -38], [-46, -22]], 5)), { col: '#2a201e', p: 1, seed: sd + 50 }, O(4, sd + 51));
  if (P0.hair === 'pony') part(C, tp(smooth([[48, -40], [78, -30], [92, 30], [76, 80], [60, 20]], 4)), { col: '#2a201e', p: 1, seed: sd + 52 }, O(4, sd + 53));
  if (P0.hair === 'spiky') part(C, tp(smooth([[-54, -6], [-50, -46], [-36, -62], [-26, -82], [-10, -66], [4, -90], [16, -68], [32, -84], [40, -60], [56, -40], [56, -6], [40, -30], [0, -36], [-40, -30]], 3)), { col: '#2a201e', p: 1, seed: sd + 54 }, O(4, sd + 55));
  if (P0.hair === 'bald') { for (const sg of [-1, 1]) part(C, tp(smooth([[sg * 52, 10], [sg * 56, -26], [sg * 40, -40], [sg * 42, -10]], 4)), { col: '#5a5a5f', p: 1, seed: sd + 56 + sg }, O(3, sd + 58 + sg)); line(C.l, tp([[-14, -38], [6, -44]]), { w: 6, col: K.white, p: 0.8, seed: sd + 60 }); }
  face(C, tp, { ...s, look: s.look || [0, 0] }, sd);
  if (P0.moustache) { part(C, tp(smooth([[-28, 14], [0, 6], [28, 14], [22, 22], [0, 16], [-22, 22]], 4)), { col: '#3a3236', p: 1, seed: sd + 61 }, O(3, sd + 62)); if (s.glint) { line(FX, tp([[24, 6], [32, 0]]), { w: 4, col: K.white, seed: sd + 63 }); line(FX, tp([[28, -4], [28, 10]]), { w: 4, col: K.white, seed: sd + 64 }); } }
  if (P0.glasses) { for (const sg of [-1, 1]) line(C.l, tp(handCircle(sg * 19, -2, 15, sd + 65 + sg, 0.08, 22)), { w: 3.5, col: K.ink, seed: sd + 66 + sg }); line(C.l, tp([[-4, -3], [4, -3]]), { w: 3, col: K.ink, seed: sd + 68 }); }
  if (P0.bindi) dab(C.l, ...tp([[0, -22]])[0], 4 * k, { col: K.red, p: 1, seed: sd + 69 });
  if (P0.phones) { line(C.l, tp(smooth([[-50, 40], [-60, 80], [0, 96], [60, 80], [50, 40]], 5, false)), { w: 7, col: K.ink, seed: sd + 70 }); for (const sg of [-1, 1]) part(C, tp(handCircle(sg * 54, 60, 16, sd + 71 + sg, 0, 14)), { col: K.dgrey, p: 1, seed: sd + 73 + sg }, O(3, sd + 75 + sg)); }
  if (P0.lanyard) { line(C.l, tp([[-14, 50], [-6, 196]]), { w: 4, col: K.blue, seed: sd + 77 }); line(C.l, tp([[14, 50], [6, 196]]), { w: 4, col: K.blue, seed: sd + 78 }); part(C, tp([[-22, 192], [22, 192], [22, 252], [-22, 252]]), { col: K.white, p: 1, seed: sd + 79 }, O(3, sd + 80)); }
  if (P0.hair === 'braid') { for (let i = 0; i < 5; i++) part(C, tp(handCircle(44 + i * 3, 46 + i * 20, 13 - i, sd + 81 + i, 0, 16)), { col: '#2a201e', p: 1, seed: sd + 86 + i }, O(3, sd + 91 + i)); dab(C.l, ...tp([[58, 146]])[0], 7 * k, { col: K.red, p: 1, seed: sd + 96 }); }
  if (P0.dupatta) part(C, tp(smooth([[-50, 58], [-30, 52], [-60, 180], [-90, 330], [-64, 360], [-44, 200]], 4)), { col: P0.dupatta, p: 1, seed: sd + 97 }, O(4, sd + 98));
  const arms = {};
  for (const [side, sg] of [['L', -1], ['R', 1]]) {
    const shp = P(sg * (46 + bw * 0.3), 68), [el, hd] = ik(shp, s.hands[side], 118 * k, 110 * k, sg); arms[side] = hd;
    part(C, tube([el, hd], 24 * k, 20 * k), skin, O(4, sd + 100 + sg));
    part(C, tube([shp, el, [lerp(el[0], hd[0], 0.5), lerp(el[1], hd[1], 0.5)]], 32 * k, 26 * k), { col: P0.top, p: 1, seed: sd + 102 + sg }, O(4, sd + 104 + sg));
  }
  for (const side of ['L', 'R']) part(C, handCircle(arms[side][0], arms[side][1], 15 * k, sd + 110 + (side === 'L' ? 0 : 1), 0, 18), skin, O(4, sd + 112 + (side === 'L' ? 0 : 1)));
  WMUL.k = 1;
  s.head = P(0, 0); return arms;
}
function seat(kind, x, t, o = {}) {   // sitting behind a desk/table: feet hidden below, hands on the table
  const k = o.k ?? 1, hy = o.hy ?? 2010, gy = hy + 600;
  return { kind, t, x, gy, k, hy, seated: 1, feet: { L: [x - 40, gy], R: [x + 40, gy] }, hands: o.hands || { L: [x - 90, hy + 300], R: [x + 90, hy + 300] }, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'smile' }, look: o.look || [0, 0], skinCol: o.skinCol, glint: o.glint };
}

// ——— acting ———
function talking(t, a, b) { return t > a && t < b && BOIL.step % 3 ? 'open' : 'small'; }
function meeraFridge(t) {   // angry, at the fridge
  const x = 640, gy = 3050, k = 1.15, hy = gy - AH * k;
  const st = { kind: 'meera', t, x, gy, k, hy, feet: { L: [x - 40, gy], R: [x + 40, gy] }, hands: { L: [x - 60 * k, hy + 230 * k], R: [x + 60 * k, hy + 240 * k] }, exp: { eyes: 'open', brows: 'down', mouth: talking(t, 0.15, 4.4) }, look: [1, 0] };
  if (t >= 40.8) { st.exp = { eyes: t > 42.8 ? 'closed' : 'open', brows: 'up', mouth: t > 41.3 && t < 43 ? talking(t, 41.3, 43) : 'smile' }; }
  return st;
}
function sharmaRed(t) { const u = pr(t, 24.2, 25.4); return u <= 0 ? null : d3mix(K.skin, K.hot, u); }
function d3mix(a, b, u) { const A = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), Bc = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return '#' + A.map((v, i) => Math.round(lerp(v, Bc[i], u)).toString(16).padStart(2, '0')).join(''); }

// ——— printed words (top third, dark ragged box) ———
const SUBY = 300;
const SUBCOL = { N: K.bone, M: '#ffd76a', S: '#9fd2ff' };
function box(cx, cy, hw, hh) {
  const g = SUBT.g; g.save(); g.fillStyle = 'rgba(29,27,34,0.9)'; g.beginPath();
  for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 2, px = Math.cos(a), py = Math.sin(a), sq = Math.pow(Math.abs(px), 0.3) * Math.sign(px), sqy = Math.pow(Math.abs(py), 0.5) * Math.sign(py), nn = 1 + 0.05 * Math.sin(a * 7 + 1.3) + 0.03 * Math.sin(a * 17); g.lineTo(cx + sq * hw * nn, cy + sqy * hh * nn); }
  g.closePath(); g.fill(); g.restore();
}
function subTo(t) {
  const S = SUBS.find(s => t >= s.t0 && t < s.t1); if (!S) return;
  const lines = S.text.split('|'), size0 = lines.length > 1 ? 64 : 62, lh = size0 * 1.35;
  const g = SUBK.g; g.save(); g.font = `700 ${size0}px Kalam`; const tw = Math.max(...lines.map(l => g.measureText(l).width)); g.restore();
  const sc = tw > 980 ? 980 / tw : 1, size = size0 * sc;
  box(540, SUBY + (lines.length - 1) * lh * sc / 2, Math.min(tw * sc / 2 + 46, 530), 48 + (lines.length - 1) * lh * sc / 2);
  lines.forEach((ln, i) => wtext(SUBT, ln, 540, SUBY + 20 + i * lh * sc, { screen: true, size, weight: 700, col: SUBCOL[S.who], reveal: pr(t, S.t0 + i * 0.35, S.t0 + i * 0.35 + 0.5), seed: 11 + S.t0 * 3 + i, stroke: 1.2 }));
}
export const TEXTS = t => { const S = SUBS.find(s => t >= s.t0 && t < s.t1); if (!S) return []; const n = S.text.split('|').length; return [{ id: 's' + S.t0, text: S.text.replace('|', ' '), x0: 20, y0: SUBY - 60, x1: 1060, y1: SUBY + 60 + (n - 1) * 86 }]; };
const LABELS = [[6.6, 9.0, 'संदिग्ध 1: पिंटो — हमेशा भूखा'], [9.0, 11.4, 'संदिग्ध 2: स्वीटी — डाइट पर…?'], [11.4, 14.0, 'संदिग्ध 3: शर्मा सर — सबसे सख़्त']];
function labels(t) {
  const L = LABELS.find(l => t >= l[0] && t < l[1]);
  if (L) { box(540, 1690, 470, 56); wtext(SUBT, L[2], 540, 1710, { screen: true, size: 54, weight: 700, col: K.note, reveal: pr(t, L[0] + 0.1, L[0] + 0.5), seed: 61 + L[0] }); }
  if (t > 25.0 && t < 27.6) { const u = back1(pr(t, 25.0, 25.3)); wtext(SUBT, 'सी… सी… सी…!', 540, 1650, { screen: true, size: 120 * u + 1, weight: 700, col: K.red, seed: 71, stroke: 3, rot: -0.06 }); }
  if (t > 3.4 && t < 6.4) { const p = 1 - pr(t, 6.0, 6.4); wtext(SUBT, 'टिफ़िन चोर', 540, 1720, { screen: true, size: 120, weight: 700, col: K.red, reveal: pr(t, 3.4, 4.0), seed: 81, stroke: 3, p }); }
}
function endCard(t) {
  if (t < 45.0) return;
  const g = SUBT.g; g.save(); g.fillStyle = 'rgba(29,27,34,0.94)'; g.fillRect(0, 1180, W, 740); g.restore();
  wtext(SUBT, 'अगला पन्ना कल', 540, 1340, { screen: true, size: 110, weight: 700, col: K.bone, reveal: pr(t, 45.05, 45.5), seed: 91, stroke: 2 });
  wtext(SUBT, 'हर शाम 7:30 — Follow करो', 540, 1480, { screen: true, size: 66, weight: 700, col: K.note, reveal: pr(t, 45.4, 45.8), seed: 92, stroke: 1.2 });
  wtext(SUBT, '@pannapalatkahani', 540, 1600, { screen: true, size: 58, weight: 700, col: K.steelL, reveal: pr(t, 45.7, 46.1), seed: 93 });
}

// ——— events for the mixer ———
export const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
SUBS.forEach(S => ev(S.vt, 'voice', { id: S.vo, who: S.who }));
ev(0, 'hum', { dur: 4.6 }); ev(0.05, 'hit'); ev(1.2, 'boing'); ev(6.6, 'whoosh'); ev(9.0, 'whoosh'); ev(11.4, 'whoosh'); ev(11.6, 'tink');
ev(14.0, 'sizzle', { dur: 7.0 }); for (let i = 0; i < 14; i++) ev(15.4 + i * 0.17, 'plop', { pan: -0.2 + (i % 3) * 0.2 }); ev(18.3, 'write', { dur: 1.0 }); ev(19.4, 'sparkle', { dur: 0.6 });
ev(24.6, 'kettle', { dur: 2.2 }); [26.4, 26.9, 27.4, 27.9].forEach(t => ev(t, 'glug')); ev(28.4, 'stab'); ev(41.0, 'sparkle', { dur: 1.0 }); ev(45.05, 'write', { dur: 1.0 });
[['A', 0], ['B', 4.6], ['C', 6.6], ['D', 14.0], ['E', 21.0], ['F', 24.0], ['G', 28.4], ['H', 31.6], ['I', 38.6], ['J', 40.8], ['Z', 45.0]].forEach(([id, t]) => ev(t, 'cue', { id }));

// ——— one frame ———
export function frame(comp, t) {
  const S = shotAt(t), set = S[2];
  const e = ss((t - S[0]) / (S[1] - S[0]));
  CAM.x = lerp(S[3][0], S[4][0], e); CAM.y = lerp(S[3][1], S[4][1], e); CAM.s = lerp(S[3][2], S[4][2], e);
  const [shx, shy] = shake(t); CAM.x += shx / CAM.s; CAM.y += shy / CAM.s;
  BOIL.amp = 0;
  [PE, PROP, FG].forEach(clearGroup);
  [BG.f, BG.l, GLOW, FX, SUBK, SUBT].forEach(clear);
  let vig = 0.18;
  if (set === 'fridge' || set === 'fridge2' || set === 'end') {
    drawFridge(t, set !== 'fridge');
    person2(FG, meeraFridge(t), 2000);
  } else if (set === 'office') {
    drawOffice(t);
    const chew = q2(t) * 8 % 1 < 0.5 ? 'small' : 'open';
    const p = person2(PE, seat('pinto', DESKS[0], t, { exp: { eyes: 'open', brows: 'up', mouth: t > 6.6 && t < 9 ? 'smile' : chew }, look: [0.3, 0], hands: { L: [DESKS[0] - 150, 2290], R: [DESKS[0] - 60, 2320] } }), 3000);
    person2(PE, seat('sweety', DESKS[1], t, { exp: { eyes: 'open', brows: 'flat', mouth: 'small' }, look: t > 9 && t < 11.4 ? [-1, 0.2] : [0, 0.6] }), 3200);
    person2(PE, seat('sharma', DESKS[2], t, { exp: { eyes: 'open', brows: 'down', mouth: 'flat' }, look: [-0.4, 0], glint: t > 11.6 && (BOIL.step % 6 < 4) }), 3400);
    drawDesks(PROP, t);
    if (t > 6.6 && t < 9.0 && p) { dab(FX, DESKS[0] + 4, 2010 + 24, 7, { col: K.yellow, p: 1, seed: 600 }); }   // aloo stuck in his teeth
  } else if (set === 'kitchen') {
    drawKitchen(t);
    const grin = t > 14.6 && t < 18.2 ? talking(t, 14.6, 18.2) : 'smile';
    person2(PE, seat('meera', 4900, t, { hy: 2000, exp: { eyes: t > 18.2 && t < 21 ? 'half' : 'open', brows: 'down', mouth: grin }, look: t > 18.3 ? [1, 0.4] : [-0.4, 0.8], hands: { L: [4760, 2290 + 10 * Math.sin(q2(t) * 9)], R: [5010, 2370] } }), 3000);
    drawCounter(PROP, t);
    vig = 0.3;
  } else if (set === 'meeting') {
    drawMeeting(t);
    const red = sharmaRed(t), cool = t > 31.6 ? d3mix(K.hot, K.skin, pr(t, 31.6, 33.0)) : red;
    const turned = t > 28.4;
    person2(PE, seat('pinto', SEATS.pinto, t, { hy: 2090, exp: { eyes: turned ? 'pop' : 'open', brows: 'up', mouth: turned ? 'o' : 'smile' }, look: turned ? [1, 0] : [0.3, 0.3] }), 3000);
    person2(PE, seat('sweety', SEATS.sweety, t, { hy: 2090, exp: { eyes: turned ? 'pop' : 'open', brows: 'up', mouth: turned ? 'o' : 'small' }, look: turned ? [1, 0] : [0.2, 0.3] }), 3200);
    let sh = { eyes: 'open', brows: 'flat', mouth: 'small' }, hands, look = [0, 0.3];
    if (t > 24.4 && t < 31.6) { sh = { eyes: t > 25 ? 'closed' : 'pop', brows: 'up', mouth: 'open' }; }
    if (t > 26.2 && t < 28.6) hands = { L: [SEATS.sharma + 30, 2250], R: [SEATS.sharma + 130, 2240] };
    if (t >= 31.6) { sh = { eyes: 'half', brows: 'worried', mouth: talking(t, 31.8, 38.4) }; look = [0.4, 1]; }
    const sp = seat('sharma', SEATS.sharma, t, { hy: 2090, exp: sh, look, skinCol: cool, hands });
    person2(PE, sp, 3400);
    person2(PE, seat('meera', SEATS.meera, t, { hy: 2090, exp: t >= 38.6 ? { eyes: 'closed', brows: 'up', mouth: 'smile' } : { eyes: turned ? 'open' : 'open', brows: turned ? 'down' : 'flat', mouth: turned && t < 31.6 ? 'smile' : 'small' }, look: turned && t < 38.6 ? [-1, 0] : [0, 0], hands: t >= 38.6 ? { L: [SEATS.meera - 90, 2400], R: [SEATS.meera + 10, 2270] } : undefined }), 3600);
    drawTable(PROP, t);
    if (t > 26.2 && t < 28.6) drawJug(FG, SEATS.sharma + 80, 2240, 0.6, 540, 1 - pr(t, 26.4, 28.2));
    else drawJug(PROP, SEATS.sharma + 230, 2410, 0.9, 540, t > 28.6 ? 0 : 1);
    const hd = sp.head;
    if (t > 24.6 && t < 31.6 && hd) for (const sg of [-1, 1]) for (let i = 0; i < 3; i++) {   // smoke from his ears
      const ph = ((t * 1.3 + i / 3) % 1), x0 = hd[0] + sg * 62, y0 = hd[1] + 6, pts = [];
      for (let j = 0; j < 8; j++) { const v = j / 7; pts.push([x0 + sg * (20 + 50 * ph) + 10 * Math.sin(v * 6 + t * 8), y0 - 30 - 140 * ph - 40 * v]); }
      line(FX, pts, { w: 10, col: K.grey, p: 0.75 * Math.sin(Math.PI * ph), seed: 700 + i + sg * 10 });
    }
    if (t > 25.0 && t < 31.6 && hd) for (const sg of [-1, 1]) { const u = ((t - 25) * 1.4 + (sg + 1) * 0.25) % 1; dab(FX, hd[0] + sg * 24, hd[1] + 10 + 50 * u, 8, { col: K.water, p: 1 - u * 0.5, seed: 720 + sg }); }
    if (t > 32.5 && t < 38.6 && hd) for (const sg of [-1, 1]) dab(FX, hd[0] + sg * 32, hd[1] + 16, 12, { col: K.pink, p: 0.8, seed: 730 + sg });   // he blushes
  }
  if (!NOSUBS) { subTo(t); labels(t); }
  endCard(t);
  comp.paperCam(CAM.x * 0.6, CAM.y * 0.6, CAM.s / 0.6);
  comp.clean = true;
  comp.begin(PAPER);
  comp.crayon(BG.f.c); comp.crayon(BG.l.c);
  comp.crayon(GLOW.c);
  comp.group(PE); comp.group(PROP); comp.group(FG);
  comp.crayon(FX.c);
  comp.knock(SUBK.c); comp.crayon(SUBT.c);
  comp.finish({ vig, emb: 0, bright: 1, lamp: [0.5, 0.5, 1, 0] });
}
export function testFrame(comp, t) { frame(comp, t); }
