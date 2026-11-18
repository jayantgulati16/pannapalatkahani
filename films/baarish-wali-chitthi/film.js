// बारिश वाली चिट्ठी — The Rain Letter. Crayon picture book, vertical 1080×1920, 24 fps.
// One page (world 1800×3200), one camera. Two balconies across a narrow lane, a pulley clothesline between them.
import { layer, clear, line, fill, dab, handCircle, smooth, xf, CAM, BOIL, W, H, sx, sy } from './crayon.js';
import { group, clearGroup, part, tube, erase } from './rig.js';
import { clamp, lerp, hash, track, ss, eio, eo, back, mulberry } from '/core/lib.js';

export const DUR = 61.5;
const NOSUBS = new URLSearchParams(location.search).get('nosubs') === '1';   // comic stills: no printed words in the frame
const K = { ink: '#2d3263', yellow: '#f5c63c', orange: '#ec8a3c', red: '#d4483c', pink: '#ee8ea4', peach: '#f4c7a4', brown: '#7a4b31',
  ochre: '#e7b867', green: '#62a24c', teal: '#4fb3a9', violet: '#6a5aa6', white: '#fbfaf4' };
const WASHC = [0.15, 0.19, 0.44];               // ultramarine: the monsoon
const pr = (t, a, b) => clamp((t - a) / (b - a));
const q2 = t => Math.floor(t * 12 + 1e-6) / 12;  // drawn things act on twos
const RAIL = 1440, HY = 1296;
const PA = [690, 1240], PM = [1140, 1240];        // pulley wheels (Arjun's, Meera's)
const NOTE = { w: 96, h: 112, fw: 50, fh: 40 };
const RAILX = [1205, 1305, 1405];                  // where Meera hangs the three notes

// ——— printed words (no voice: the book's text) ———
export const SUBS = [
  { t0: 10.4, t1: 14.6, text: 'एक तंग गली… आमने-सामने, दो बालकनी।' },
  { t0: 14.8, t1: 19.0, text: 'बीच में, कपड़े सुखाने की एक रस्सी।' },
  { t0: 19.8, t1: 24.6, text: 'अर्जुन रोज़ मीरा को एक चिट्ठी भेजता…' },
  { t0: 30.4, t1: 34.8, text: '…और हर बार, कोरा कागज़।' },
  { t0: 42.6, t1: 47.0, text: 'सफ़ेद क्रेयॉन से लिखी बात… बारिश ने पढ़ ली।' },
  { t0: 55.2, t1: 60.6, text: 'उस दिन से, वो गली थोड़ी छोटी लगने लगी।' },
];
const TITLE = 'बारिश वाली चिट्ठी', TITLE_T = [6.2, 8.0];

// ——— camera ———
const camT = track([
  [0, [1185, 1300, 2.25]], [1.2, [1185, 1300, 2.25]], [4.6, [1225, 1320, 2.5]], [5.2, [1225, 1320, 2.5]],
  [6.5, [1000, 330, 1.15]], [9.8, [1000, 360, 1.2]], [12.2, [900, 1600, 0.6]], [19.0, [900, 1600, 0.6]],
  [20.3, [620, 1330, 2.2]], [24.4, [640, 1320, 2.2]], [26.3, [760, 1310, 2.0]], [27.4, [1250, 1340, 1.9]], [34.6, [1265, 1350, 1.9]],
  [36.0, [900, 1600, 0.6]], [41.0, [900, 1600, 0.6]], [42.5, [1305, 1420, 2.35]], [45.6, [1300, 1405, 2.35]],
  [46.3, [1265, 1345, 2.5]], [48.7, [1255, 1335, 2.5]], [49.2, [1130, 1320, 2.35]], [49.9, [650, 1320, 2.3]], [52.4, [650, 1315, 2.3]],
  [54.0, [905, 1330, 1.0]], [56.9, [905, 1350, 1.0]], [59.6, [900, 1600, 0.6]], [61.5, [900, 1600, 0.6]],
]);

// ——— the lane leans in at the end (child logic: the lane feels smaller) ———
let LA = 0;
const TL = pts => LA ? xf(pts, { r: LA, ox: 560, oy: 3200 }) : pts;
const TR = pts => LA ? xf(pts, { r: -LA, ox: 1240, oy: 3200 }) : pts;
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

// ——— text: Devanagari needs whole words (conjuncts and matras can't be split into letters); reveal = a clip wiping left → right ———
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
  g.fillStyle = o.col || K.ink; g.strokeStyle = o.col || K.ink;
  words.forEach((w, i) => {
    const jx = (hash(seed + i * 3.3 + st * 1.1) - .5) * 1.8 * ba, jy = (hash(seed + i * 7.1 + st * 2.3) - .5) * 1.8 * ba;
    const r = (hash(seed + i * 1.9) - .5) * 0.06 + (hash(seed + i + st * .7) - .5) * 0.02 * ba;
    g.save(); g.translate(cx + wd[i] / 2 + jx, jy); g.rotate(r);
    g.globalAlpha = o.p ?? 1; g.fillText(w, -wd[i] / 2, 0);
    if (o.stroke) { g.lineWidth = o.stroke * (scr ? 1 : CAM.s); g.globalAlpha = (o.p ?? 1) * .55; g.strokeText(w, -wd[i] / 2, 0); }
    g.restore(); cx += wd[i] + sp;
  });
  g.restore(); return tw;
}

// ——— layers ———
const BG = { f: layer(), l: layer() }, NT = group(), MR = group(), AJ = group(), WASH = layer(), FX = layer(), SUBK = layer(), SUBT = layer();

// ——— the page ———
const wallO = (col, seed) => ({ col, p: 0.62, gap: 11, w: 12, ang: 0.35, seed, cross: true, crossP: 0.55, boil: 0 });
function F(L, T, poly, o) { fill(L, T(poly), o); }
function Ln(L, T, pts, o) { line(L, T(pts), { boil: 0.6, ...o }); }
function windowAt(T, x, y, w, h, seed, glass = K.teal, sill = K.red) {
  F(BG.f, T, rect(x, y, x + w, y + h), { col: glass, p: 0.5, gap: 10, w: 11, ang: 1.0, seed, boil: 0 });
  Ln(BG.l, T, [...rect(x, y, x + w, y + h), [x + 8, y]], { w: 6, seed: seed + 1, closed: false });
  Ln(BG.l, T, [[x + w / 2, y], [x + w / 2, y + h]], { w: 4.5, seed: seed + 2 });
  F(BG.f, T, rect(x - 12, y + h, x + w + 12, y + h + 18), { col: sill, p: 0.8, gap: 7, w: 9, seed: seed + 3, boil: 0 });
  Ln(BG.l, T, rect(x - 12, y + h, x + w + 12, y + h + 18).concat([[x - 12, y + h]]), { w: 4.5, seed: seed + 4 });
}
function balcony(T, x0, x1, seed) {
  // slab
  F(BG.f, T, rect(x0 - 10, 1530, x1 + 10, 1578), { col: K.red, p: 0.85, gap: 8, w: 10, seed, boil: 0 });
  Ln(BG.l, T, rect(x0 - 10, 1530, x1 + 10, 1578).concat([[x0 - 10, 1530]]), { w: 7, seed: seed + 1 });
  // iron railing: top bar, bottom bar, bars
  Ln(BG.l, T, [[x0, RAIL], [x1, RAIL]], { w: 12, seed: seed + 2, p: 0.95 });
  Ln(BG.l, T, [[x0, 1520], [x1, 1520]], { w: 7, seed: seed + 3 });
  for (let x = x0 + 4, i = 0; x <= x1; x += 44, i++) Ln(BG.l, T, [[x, RAIL + 4], [x, 1528]], { w: 5, seed: seed + 10 + i, p: 0.85 });
}
function drawBG(t, p) {
  const A = TL, M = TR;
  // —— Arjun's building (left, ochre) ——
  F(BG.f, A, rect(-60, 420, 560, 3300), wallO(K.ochre, 11));
  Ln(BG.l, A, [[560, 3300], [560, 420], [-60, 420]], { w: 8, seed: 12 });
  F(BG.f, A, rect(-60, 380, 585, 420), { col: K.red, p: 0.8, gap: 8, w: 10, seed: 13, boil: 0 });
  Ln(BG.l, A, [[-60, 380], [585, 380], [585, 420], [-60, 420]], { w: 7, seed: 14 });
  // water tank on the roof
  part({ k: BG.f, f: BG.f, l: BG.l }, A([[110, 380], [110, 290], [130, 270], [250, 270], [270, 290], [270, 380]]), { col: K.violet, p: 0.8, gap: 8, w: 10, seed: 15, boil: 0 }, { w: 6, seed: 16 }, { occ: false, kn: false });
  Ln(BG.l, A, [[110, 310], [270, 310]], { w: 4, seed: 17 }); Ln(BG.l, A, [[110, 345], [270, 345]], { w: 4, seed: 18 });
  windowAt(A, 70, 560, 150, 190, 20); windowAt(A, 330, 560, 150, 190, 30);
  windowAt(A, 70, 2050, 150, 190, 40); windowAt(A, 330, 2050, 150, 190, 50);
  windowAt(A, 70, 2620, 150, 190, 60, K.teal, K.green); windowAt(A, 330, 2620, 150, 190, 70);
  // Arjun's door
  F(BG.f, A, rect(230, 1170, 400, RAIL), { col: K.brown, p: 0.85, gap: 9, w: 10, ang: 1.4, seed: 80, boil: 0 });
  Ln(BG.l, A, [[230, RAIL], [230, 1170], [400, 1170], [400, RAIL]], { w: 7, seed: 81 });
  dab(BG.l, A([[380, 1320]])[0][0], A([[380, 1320]])[0][1], 6, { col: K.yellow, p: 1, seed: 82, boil: 0 });
  balcony(A, 120, 700, 90);
  // —— Meera's building (right, teal) ——
  F(BG.f, M, rect(1240, 380, 1860, 3300), wallO(K.teal, 111));
  Ln(BG.l, M, [[1240, 3300], [1240, 380], [1860, 380]], { w: 8, seed: 112 });
  F(BG.f, M, rect(1215, 340, 1860, 380), { col: K.orange, p: 0.8, gap: 8, w: 10, seed: 113, boil: 0 });
  Ln(BG.l, M, [[1860, 340], [1215, 340], [1215, 380], [1860, 380]], { w: 7, seed: 114 });
  // dish antenna
  Ln(BG.l, M, [[1560, 340], [1580, 250]], { w: 5, seed: 115 });
  part({ k: BG.f, f: BG.f, l: BG.l }, M(smooth([[1520, 250], [1560, 200], [1640, 190], [1650, 230], [1600, 270]], 6)), { col: K.white, p: 0.7, gap: 7, w: 9, seed: 116, boil: 0 }, { w: 5, seed: 117 }, { occ: false, kn: false });
  windowAt(M, 1320, 560, 150, 190, 120, K.yellow, K.violet); windowAt(M, 1580, 560, 150, 190, 130, K.yellow, K.violet);
  windowAt(M, 1320, 2050, 150, 190, 140, K.yellow, K.violet); windowAt(M, 1580, 2050, 150, 190, 150, K.yellow, K.violet);
  windowAt(M, 1320, 2620, 150, 190, 160, K.yellow, K.green); windowAt(M, 1580, 2620, 150, 190, 170, K.yellow, K.violet);
  // Meera's door with a toran
  F(BG.f, M, rect(1440, 1170, 1600, RAIL), { col: K.violet, p: 0.8, gap: 9, w: 10, ang: 1.4, seed: 180, boil: 0 });
  Ln(BG.l, M, [[1440, RAIL], [1440, 1170], [1600, 1170], [1600, RAIL]], { w: 7, seed: 181 });
  Ln(BG.l, M, [[1430, 1172], [1610, 1172]], { w: 5, seed: 182, col: K.green });
  for (let i = 0; i < 7; i++) { const x = 1446 + i * 25; part({ k: BG.f, f: BG.f, l: BG.l }, M([[x - 10, 1174], [x + 10, 1174], [x, 1200]]), { col: i % 2 ? K.yellow : K.orange, p: 0.95, gap: 4, w: 6, seed: 190 + i, boil: 0 }, null, { occ: false, kn: false }); }
  balcony(M, 1100, 1680, 200);
  // tulsi pot on Meera's railing
  part({ k: BG.f, f: BG.f, l: BG.l }, M([[1600, RAIL - 4], [1592, 1380], [1668, 1380], [1660, RAIL - 4]]), { col: K.orange, p: 0.9, gap: 7, w: 9, seed: 210, boil: 0 }, { w: 6, seed: 211 }, { occ: false, kn: false });
  for (let i = 0; i < 5; i++) { const a = -1.9 + i * 0.32; const bx = 1630, by = 1380; const tip = [bx + Math.cos(a) * 70, by + Math.sin(a) * 70];
    Ln(BG.l, M, [[bx, by], tip], { w: 4.5, col: K.green, seed: 220 + i });
    part({ k: BG.f, f: BG.f, l: BG.l }, M(handCircle(tip[0], tip[1], 13, 230 + i, 0, 14)), { col: K.green, p: 0.95, gap: 5, w: 7, seed: 240 + i }, null, { occ: false, kn: false }); }
  // —— pulley posts ——
  const pa = TL([PA])[0], pm = TR([PM])[0];
  Ln(BG.l, A, [[PA[0], RAIL], [PA[0], PA[1] - 12]], { w: 9, col: K.brown, seed: 300 });
  Ln(BG.l, M, [[PM[0], RAIL], [PM[0], PM[1] - 12]], { w: 9, col: K.brown, seed: 301 });
  const spin = t * 2.2;
  for (const [c, sd] of [[pa, 310], [pm, 320]]) {
    line(BG.l, handCircle(c[0], c[1], 15, sd, 0.1, 24), { w: 6, seed: sd, boil: 0.6 });
    line(BG.l, [[c[0] + Math.cos(spin) * 13, c[1] + Math.sin(spin) * 13], [c[0] - Math.cos(spin) * 13, c[1] - Math.sin(spin) * 13]], { w: 3.5, seed: sd + 1, boil: 0.6 });
  }
  // —— rope: two strands of the loop ——
  for (const low of [0, 1]) { const pts = []; for (let i = 0; i <= 24; i++) pts.push(ropePt(i / 24, low)); line(BG.l, pts, { w: 4.5, col: K.brown, seed: 330 + low, boil: 0.6, p: 0.9 }); }
  // —— electric wires across the lane, a lamp, the lane floor, a cycle ——
  line(BG.l, TLR(560, 820, 1240, 790, 60), { w: 3.2, seed: 340, boil: 0.5 });
  line(BG.l, TLR(560, 860, 1240, 850, 75), { w: 3.2, seed: 341, boil: 0.5 });
  F(BG.f, x => x, rect(560, 3020, 1240, 3300), { col: K.brown, p: 0.38, gap: 12, w: 12, ang: 0.15, seed: 350, boil: 0 });
  line(BG.l, [[560, 3020], [1240, 3020]], { w: 6, seed: 351, boil: 0.6 });
  // cycle
  const cyc = 352; line(BG.l, handCircle(820, 3080, 42, cyc, 0.08, 28), { w: 5, seed: cyc, boil: 0.6 }); line(BG.l, handCircle(990, 3080, 42, cyc + 1, 0.08, 28), { w: 5, seed: cyc + 1, boil: 0.6 });
  line(BG.l, [[820, 3080], [880, 3010], [960, 3010], [990, 3080]], { w: 6, col: K.red, seed: cyc + 2, boil: 0.6 }); line(BG.l, [[880, 3010], [905, 3080], [960, 3010]], { w: 6, col: K.red, seed: cyc + 3, boil: 0.6 });
  line(BG.l, [[960, 3010], [975, 2975], [1000, 2972]], { w: 5, seed: cyc + 4, boil: 0.6 }); line(BG.l, [[870, 3000], [895, 3000]], { w: 7, seed: cyc + 5, boil: 0.6 });
  // —— sky: a sun with a face (until the cloud is scribbled over it) ——
  const sunC = [300, 220];
  part({ k: BG.f, f: BG.f, l: BG.l }, handCircle(sunC[0], sunC[1], 82, 400, 0.08, 40), { col: K.yellow, p: 0.85, gap: 9, w: 10, seed: 401 }, { w: 7, seed: 402, col: K.orange }, { occ: false, kn: false });
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + 0.2; line(BG.l, [[sunC[0] + Math.cos(a) * 104, sunC[1] + Math.sin(a) * 104], [sunC[0] + Math.cos(a) * 146, sunC[1] + Math.sin(a) * 146]], { w: 7, col: K.orange, seed: 410 + i }); }
  dab(BG.l, sunC[0] - 26, sunC[1] - 12, 6, { col: K.ink, p: 1, seed: 430 }); dab(BG.l, sunC[0] + 26, sunC[1] - 12, 6, { col: K.ink, p: 1, seed: 431 });
  line(BG.l, smooth([[sunC[0] - 26, sunC[1] + 18], [sunC[0], sunC[1] + 34], [sunC[0] + 26, sunC[1] + 18]], 6, false), { w: 5, seed: 432 });
  // cloud: scribbled over the sun before the rain (colouring is an action)
  if (p.cloud > 0) {
    const cl = smooth([[90, 300], [80, 200], [170, 130], [260, 70], [380, 90], [460, 150], [560, 140], [640, 220], [620, 320], [480, 360], [300, 370], [160, 360]], 6);
    part({ k: BG.f, f: BG.f, l: BG.l }, cl, { col: K.violet, p: 0.95, gap: 9, w: 12, ang: 0.3, seed: 450, draw: p.cloud, cross: true }, { w: 8, seed: 451, draw: clamp(p.cloud * 1.6) }, { occ: true, kn: false });
  }
  // —— title, written on the page ——
  if (t > TITLE_T[0]) wtext(BG.l, TITLE, 1000, 300, { size: 118, weight: 700, reveal: pr(t, TITLE_T[0], TITLE_T[1]), seed: 21, stroke: 2.5, boil: 0.8 });
}
// polyline across the lane between a point on the left building and one on the right, sagging
function TLR(x0, y0, x1, y1, sag) { const a = TL([[x0, y0]])[0], b = TR([[x1, y1]])[0]; const out = []; for (let i = 0; i <= 16; i++) { const u = i / 16; out.push([lerp(a[0], b[0], u), lerp(a[1], b[1], u) + sag * Math.sin(Math.PI * u)]); } return out; }
function ropePt(u, low = 1) { const a = TL([PA])[0], b = TR([PM])[0]; return [lerp(a[0], b[0], u), lerp(a[1], b[1], u) + (low ? 14 : -13) + (low ? 26 : 18) * Math.sin(Math.PI * u)]; }
const ropeU = x => (x - PA[0]) / (PM[0] - PA[0]);

// ——— notes ———
// n: { x, top, open, rot, wax, red, redRev, pin, swing }
function drawNote(C, n, seed) {
  const w = n.open ? NOTE.w : NOTE.fw, h = n.open ? NOTE.h : NOTE.fh;
  const o = { x: n.x, y: n.top, r: n.rot || 0 };
  const poly = xf(rect(-w / 2, 0, w / 2, h), o);
  erase(C.f, poly);
  part(C, poly, null, { w: 4.5, seed, boil: 1 });
  if (n.open) {
    line(C.l, xf([[-w / 2 + 4, h * 0.78], [w / 2 - 4, h * 0.8]], o), { w: 2.5, p: 0.3, seed: seed + 1 });     // fold crease
    if (n.wax) { const T = xf([[0, h * 0.42]], o)[0]; wtext(C.f, n.wax, T[0], T[1] + n.waxSize * 0.35, { size: n.waxSize, weight: 700, col: K.white, p: 0.48, rot: n.rot || 0, seed: seed + 3, boil: 0.5 }); }
    if (n.red) { const T = xf([[0, h * 0.5]], o)[0]; wtext(C.l, n.red, T[0], T[1] + 16, { size: 50, weight: 700, col: K.red, p: 1, rot: n.rot || 0, seed: seed + 4, reveal: n.redRev ?? 1, stroke: 2 }); }
  } else {
    line(C.l, xf([[-w / 2 + 3, 3], [w / 2 - 3, h - 3]], o), { w: 2.5, p: 0.4, seed: seed + 2 });
  }
  if (n.pin) { const pp = xf(rect(-5, -14, 5, 14), o); part(C, pp, { col: K.brown, p: 0.95, gap: 3, w: 4, seed: seed + 5 }, { w: 3, seed: seed + 6 }); }
}
// kulhad (clay cup) hanging or held
function drawCup(C, x, y, seed, steam, t, hang) {
  if (hang) line(C.l, [[x, y - 50], [x, y - 22]], { w: 3, col: K.brown, seed: seed + 9 });
  part(C, [[x - 24, y - 24], [x + 24, y - 24], [x + 17, y + 22], [x - 17, y + 22]], { col: K.orange, p: 0.9, gap: 6, w: 8, seed, ang: 1.2 }, { w: 5, seed: seed + 1 });
  line(C.l, [[x - 25, y - 24], [x + 25, y - 24]], { w: 7, col: K.brown, seed: seed + 2 });
  if (steam) for (let i = 0; i < 2; i++) { const ph = q2(t) * 2 + i; const pts = []; for (let k = 0; k < 8; k++) pts.push([x - 8 + i * 16 + 6 * Math.sin(ph + k * 0.8), y - 34 - k * 9]); line(C.l, pts, { w: 3, p: 0.35, seed: seed + 3 + i }); }
}

// ——— note timelines (owner: 'rope' | 'rail' | 'm' | 'a' | null) ———
const travel = (t, a, b, x0, x1) => lerp(x0, x1, eio(pr(t, a, b)));
function noteStates(t, ms, as) {
  const S = [];
  const onRope = (x, wax, red) => ({ owner: 'rope', x, top: ropePt(ropeU(x), 1)[1] - 4, open: false, pin: true, rot: 0.06 * Math.sin(t * 9 + x * 0.05), wax, red });
  const onRail = (i, wax, size) => ({ owner: 'rail', x: RAILX[i], top: RAIL + 6, open: true, pin: true, rot: (0.035 + 0.05 * rainK(t)) * Math.sin(t * (2.2 + i * 0.4) + i * 2), wax, waxSize: size });
  const inHand = (who, st, side, open, wax, size, red, redRev) => {
    const h = st.hands[side];
    if (!open) return { owner: who, x: h[0], top: h[1] - 8, open: false, rot: side === 'L' ? -0.15 : 0.15 };
    const c = st.noteC; return { owner: who, x: c[0], top: c[1] - NOTE.h / 2, open: true, rot: c[2] || 0, wax, waxSize: size, red, redRev };
  };
  // note 1: चाय
  if (t < 1.6) S.push(onRope(travel(t, 0, 1.25, 870, 1112), 'चाय'));
  else if (t < 2.35) S.push(inHand('m', ms, 'L', false));
  else if (t < 5.6) S.push(inHand('m', ms, 'L', true, 'चाय', 40));
  else S.push(onRail(0, 'चाय', 40));
  // note 2: पर
  if (t >= 21.0 && t < 23.1) S.push(inHand('a', as, 'L', true, 'पर', 44));
  else if (t >= 23.1 && t < 23.75) S.push(inHand('a', as, 'R', false));
  else if (t >= 23.75 && t < 27.25) S.push(onRope(travel(t, 24.05, 26.95, 712, 1112)));
  else if (t >= 27.25 && t < 27.6) S.push(inHand('m', ms, 'L', false));
  else if (t >= 27.6 && t < 28.45) S.push(inHand('m', ms, 'L', true, 'पर', 44));
  else if (t >= 28.45 && t < 28.8) S.push(inHand('m', ms, 'R', false));
  else if (t >= 28.8) S.push(onRail(1, 'पर', 44));
  // note 3: चलोगी?
  if (t >= 28.5 && t < 29.55) S.push(onRope(travel(t, 28.5, 29.35, 860, 1112)));
  else if (t >= 29.55 && t < 29.8) S.push(inHand('m', ms, 'L', false));
  else if (t >= 29.8 && t < 30.45) S.push(inHand('m', ms, 'L', true, 'चलोगी?', 30));
  else if (t >= 30.45 && t < 30.9) S.push(inHand('m', ms, 'R', false));
  else if (t >= 30.9) S.push(onRail(2, 'चलोगी?', 30));
  // note 4: हाँ! (red crayon, her answer)
  if (t >= 46.0 && t < 48.35) S.push(inHand('m', ms, 'L', true, null, 0, 'हाँ!', pr(t, 46.5, 47.5)));
  else if (t >= 48.35 && t < 48.7) S.push(inHand('m', ms, 'L', false));
  else if (t >= 48.7 && t < 50.4) S.push(onRope(travel(t, 49.0, 50.2, 1112, 712)));
  else if (t >= 50.4 && t < 50.65) S.push(inHand('a', as, 'R', false));
  else if (t >= 50.65 && t < 52.3) S.push(inHand('a', as, 'R', true, null, 0, 'हाँ!', 1));
  return S;
}

// ——— characters ———
// IK: shoulder → hand with two segments; the elbow bends down/outward
function ik(sh, hd, L1, L2, side) {
  let dx = hd[0] - sh[0], dy = hd[1] - sh[1]; let d = Math.hypot(dx, dy); const mx = L1 + L2 - 1;
  let tgt = hd; if (d > mx) { tgt = [sh[0] + dx / d * mx, sh[1] + dy / d * mx]; dx = tgt[0] - sh[0]; dy = tgt[1] - sh[1]; d = mx; }
  d = Math.max(d, 1e-3);
  const a = Math.atan2(dy, dx), B = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
  const e1 = [sh[0] + Math.cos(a + B) * L1, sh[1] + Math.sin(a + B) * L1], e2 = [sh[0] + Math.cos(a - B) * L1, sh[1] + Math.sin(a - B) * L1];
  const score = e => e[1] + side * e[0] * 0.6;
  return [score(e1) > score(e2) ? e1 : e2, tgt];
}
function person(C, s, T, sd) {
  const isM = s.who === 'm';
  const P = (dx, dy) => [s.x + dx, s.hy + dy];
  const tp = pts => T(pts.map(([dx, dy]) => P(dx, dy)));
  const skin = { col: K.peach, p: 0.6, gap: 7, w: 9, ang: 0.5, seed: sd + 1 };
  const bot = RAIL - s.hy + 30;
  // back hair
  if (isM) part(C, tp(smooth([[-56, -30], [-50, -64], [0, -76], [50, -64], [58, -28], [64, 40], [50, 84], [-50, 84], [-64, 40]], 6)), { col: K.brown, p: 0.95, gap: 7, w: 10, ang: 1.2, seed: sd + 2 }, { w: 6, seed: sd + 3 });
  // ears (Arjun)
  if (!isM) for (const sg of [-1, 1]) part(C, tp(handCircle(sg * 50, 6, 12, sd + 4 + sg, 0, 16)), skin, { w: 5, seed: sd + 6 + sg });
  // neck
  part(C, tp([[-11, 36], [11, 36], [12, 58], [-12, 58]]), skin, { w: 4.5, seed: sd + 8 });
  // torso (kurta) — ends behind the railing
  const kc = isM ? K.yellow : K.teal;
  const sh = s.shrug || 0;
  part(C, tp([[-15, 48], [15, 48], [46, 60 - sh * 8], [56, 100], [58, bot], [-58, bot], [-56, 100], [-46, 60 - sh * 8]]), { col: kc, p: 0.75, gap: 9, w: 10, ang: 0.9, seed: sd + 9, cross: true, crossP: 0.5 }, { w: 6.5, seed: sd + 10 });
  if (isM) { // round neckline + little dots on the kurta
    line(C.l, tp(smooth([[-16, 50], [0, 64], [16, 50]], 6, false)), { w: 4, seed: sd + 11 });
    for (let i = 0; i < 6; i++) dab(C.l, ...tp([[-36 + (i % 3) * 32 + (i > 2 ? 16 : 0), 96 + (i > 2 ? 34 : 0)]])[0], 4.5, { col: K.orange, p: 0.95, seed: sd + 12 + i });
  } else { line(C.l, tp([[-10, 50], [0, 72], [10, 50]]), { w: 4, seed: sd + 11 }); for (let i = 0; i < 3; i++) dab(C.l, ...tp([[0, 82 + i * 18]])[0], 3.5, { col: K.ink, p: 0.9, seed: sd + 13 + i }); }
  // head
  part(C, tp(handCircle(0, 0, 50, sd + 20, 0.06, 44)), skin, { w: 6, seed: sd + 21 });
  // front hair
  if (isM) part(C, tp(smooth([[-54, -2], [-48, -42], [-22, -62], [0, -58], [24, -64], [50, -42], [55, -2], [40, -22], [16, -38], [2, -42], [-14, -36], [-38, -20]], 5)), { col: K.brown, p: 0.97, gap: 6, w: 9, ang: 1.0, seed: sd + 22 }, { w: 5.5, seed: sd + 23 });
  else part(C, tp(smooth([[-55, 0], [-54, -40], [-38, -60], [-16, -66], [4, -78], [18, -64], [36, -74], [40, -54], [56, -42], [56, -4], [42, -26], [20, -32], [0, -28], [-22, -34], [-42, -20]], 5)), { col: K.brown, p: 0.97, gap: 6, w: 9, ang: 1.0, seed: sd + 22 }, { w: 5.5, seed: sd + 23 });
  // face
  const e = s.exp, lk = s.look || [0, 0];
  const eyeY = -2;
  for (const sg of [-1, 1]) {
    const ex = sg * 18 + lk[0] * 5, ey = eyeY + lk[1] * 4;
    if (e.eyes === 'closed') line(C.l, tp([[sg * 18 - 9, eyeY + 1], [sg * 18, eyeY + 5], [sg * 18 + 9, eyeY + 1]]), { w: 4.5, seed: sd + 30 + sg });
    else if (e.eyes === 'happy') line(C.l, tp([[sg * 18 - 9, eyeY + 4], [sg * 18, eyeY - 5], [sg * 18 + 9, eyeY + 4]]), { w: 4.5, seed: sd + 30 + sg });
    else { const c = tp([[ex, ey]])[0]; dab(C.l, c[0], c[1], 6.5, { col: K.ink, p: 1, gap: 3, w: 5, seed: sd + 32 + sg }); dab(C.l, c[0] + 2, c[1] - 2.5, 2.2, { col: K.white, p: 1, gap: 1.5, w: 3, seed: sd + 34 + sg }); }
    // brows: [inner dy, outer dy]
    const b = e.brows === 'up' ? [-24, -22] : e.brows === 'down' ? [-17, -22] : e.brows === 'worried' ? [-24, -17] : e.brows === 'puzzled' ? (sg < 0 ? [-26, -28] : [-17, -18]) : [-20, -20];
    line(C.l, tp([[sg * 8, b[0]], [sg * 26, b[1]]]), { w: 4, seed: sd + 36 + sg });
  }
  if (!isM) { // round glasses
    for (const sg of [-1, 1]) line(C.l, tp(handCircle(sg * 18, eyeY, 15, sd + 40 + sg, 0.08, 22)), { w: 3.5, seed: sd + 40 + sg });
    line(C.l, tp([[-4, eyeY - 1], [4, eyeY - 1]]), { w: 3, seed: sd + 43 });
  }
  if (isM) { dab(C.l, ...tp([[0, -24]])[0], 4.5, { col: K.red, p: 1, seed: sd + 44 }); for (const sg of [-1, 1]) dab(C.l, ...tp([[sg * 51, 22]])[0], 5, { col: K.yellow, p: 1, seed: sd + 45 + sg }); }
  // mouth
  const m = e.mouth;
  if (m === 'open') part(C, tp([[-15, 17], [15, 17], [10, 30], [0, 34], [-10, 30]]), { col: K.red, p: 0.9, gap: 4, w: 6, seed: sd + 50 }, { w: 4, seed: sd + 51 });
  else if (m === 'o') line(C.l, tp(handCircle(0, 25, 5.5, sd + 52, 0.1, 14)), { w: 4, seed: sd + 52 });
  else if (m === 'flat') line(C.l, tp([[-8, 25], [8, 24]]), { w: 4, seed: sd + 53 });
  else if (m === 'tongue') { line(C.l, tp(smooth([[-9, 22], [0, 27], [9, 22]], 5, false)), { w: 4, seed: sd + 54 }); dab(C.l, ...tp([[8, 28]])[0], 4.5, { col: K.pink, p: 1, seed: sd + 55 }); }
  else if (m === 'small') line(C.l, tp(smooth([[-6, 23], [0, 26], [6, 23]], 5, false)), { w: 4, seed: sd + 56 });
  else if (m === 'side') line(C.l, tp(smooth([[-4, 25], [5, 25], [10, 21]], 5, false)), { w: 4, seed: sd + 57 });
  else line(C.l, tp(smooth([[-12, 19], [0, 29], [12, 19]], 5, false)), { w: 4.5, seed: sd + 58 });
  // blush: pink scribble that grows (colouring is an action)
  if (s.blush > 0) for (const sg of [-1, 1]) fill(C.f, tp(handCircle(sg * 31, 14, 10 + 3 * s.blush, sd + 60 + sg, 0, 18)), { col: K.pink, p: 0.75, gap: 4, w: 6, seed: sd + 62 + sg, draw: clamp(s.blush * 1.4), over: 2 });
  // dupatta (Meera)
  if (isM) part(C, tp([[-50, 58], [-30, 54], [56, bot - 30], [58, bot], [26, bot]]), { col: K.pink, p: 0.85, gap: 7, w: 9, ang: -0.6, seed: sd + 70 }, { w: 5.5, seed: sd + 71 });
  // braid over her shoulder
  if (isM) for (let i = 0; i < 5; i++) { const c = [44 + i * 3, 46 + i * 20]; part(C, tp(handCircle(c[0], c[1], 13 - i, sd + 72 + i, 0, 16)), { col: K.brown, p: 0.97, gap: 5, w: 7, seed: sd + 78 + i }, { w: 4.5, seed: sd + 84 + i }); }
  if (isM) dab(C.l, ...tp([[58, 146]])[0], 7, { col: K.red, p: 1, seed: sd + 90 });
  // arms
  const shL = P(-42, 66 - sh * 8), shR = P(42, 66 - sh * 8);
  const arms = {};
  for (const [side, shp, sg] of [['L', shL, -1], ['R', shR, 1]]) {
    const [el, hd] = ik(shp, s.hands[side], 62, 60, sg);
    arms[side] = hd;
    part(C, T(tube([shp, el, hd], 26, 21)), { col: kc, p: 0.78, gap: 8, w: 9, ang: 0.4, seed: sd + 100 + sg }, { w: 5.5, seed: sd + 102 + sg });
  }
  // held items
  for (const it of s.items || []) {
    if (it.type === 'note') drawNote(C, it, sd + 200 + (it.seed || 0));
    else if (it.type === 'news') {
      const o = { x: it.x, y: it.y, r: it.rot || 0 };
      part(C, xf(rect(-95, -66, 95, 66), o), null, { w: 5, seed: sd + 120 });
      line(C.l, xf([[0, -60], [0, 60]], o), { w: 2.5, p: 0.5, seed: sd + 121 });
      line(C.l, xf([[-82, -48], [-12, -48]], o), { w: 7, p: 0.8, seed: sd + 122 });
      for (let i = 0; i < 6; i++) { line(C.l, xf([[-82, -26 + i * 14], [-14, -26 + i * 14]], o), { w: 2.5, p: 0.45, seed: sd + 123 + i }); line(C.l, xf([[12, -48 + i * 16], [82, -48 + i * 16]], o), { w: 2.5, p: 0.45, seed: sd + 130 + i }); }
    } else if (it.type === 'crayon') {
      const a = it.ang ?? -0.9, h = arms[it.side];
      part(C, tube([[h[0] - Math.cos(a) * 6, h[1] - Math.sin(a) * 6], [h[0] + Math.cos(a) * 34, h[1] + Math.sin(a) * 34]], 9, 8), { col: it.col, p: 0.95, gap: 3, w: 5, seed: sd + 140 }, { w: 3.5, seed: sd + 141 });
    } else if (it.type === 'cup') drawCup(C, it.x, it.y, sd + 150, it.steam, it.t, false);
  }
  // hands (mittens) on top of what they hold
  for (const side of ['L', 'R']) part(C, handCircle(arms[side][0], arms[side][1], 14, sd + 160 + (side === 'L' ? 0 : 1), 0, 18), skin, { w: 5, seed: sd + 162 + (side === 'L' ? 0 : 1) });
  // everything below the railing is hidden behind it
  const cut = T(rect(s.x - 500, RAIL - 6, s.x + 500, RAIL + 600));
  erase(C.l, cut); erase(C.f, cut); erase(C.k, cut);
}

// ——— Meera's acting ———
const REST_M = [[-56, 178], [56, 178]];
const mX = track([[0, [1290]], [1.0, [1290]], [1.35, [1240]], [5.6, [1240]], [6.2, [1270]], [26.5, [1270]], [26.85, [1240]], [28.0, [1240]], [28.35, [1290]], [28.85, [1290]], [29.15, [1240]], [30.3, [1240]], [30.65, [1300]], [46.0, [1300]], [48.3, [1300]], [48.6, [1240]], [61.5, [1240]]]);
const rel = (abs, t) => [abs[0] - mX(t)[0], abs[1] - HY];
const PULL_M = [PM[0] - 20, PM[1] + 22];
// hand keys: [t, [Lx, Ly, Rx, Ry]] relative to body
const mHands = track([
  [0, [...REST_M[0], ...REST_M[1]]], [1.25, [...REST_M[0], ...REST_M[1]]], [1.55, [-112, -34, 56, 178]], [1.75, [-112, -34, 56, 178]],
  [2.2, [-46, 96, 46, 96]], [5.0, [-46, 96, 46, 96]], [5.6, [...REST_M[0], ...REST_M[1]]],
  [26.7, [...REST_M[0], ...REST_M[1]]], [27.05, [-112, -34, 56, 178]], [27.25, [-112, -34, 56, 178]], [27.55, [-46, 96, 46, 96]], [28.2, [-46, 96, 46, 96]],
  [28.6, [-56, 178, 15, 148]], [28.8, [-56, 178, 15, 148]], [29.1, [-90, 20, 56, 178]], [29.4, [-112, -34, 56, 178]], [29.55, [-112, -34, 56, 178]],
  [29.8, [-46, 96, 46, 96]], [30.35, [-46, 96, 46, 96]], [30.75, [-56, 178, 105, 148]], [30.95, [-56, 178, 105, 148]],
  [31.2, [-82, 44, 82, 44]], [32.2, [-82, 44, 82, 44]], [32.6, [...REST_M[0], ...REST_M[1]]],
  [37.9, [...REST_M[0], ...REST_M[1]]], [38.3, [-56, 178, 96, 40]], [40.6, [-56, 178, 96, 40]], [41.0, [...REST_M[0], ...REST_M[1]]],
  [45.6, [...REST_M[0], ...REST_M[1]]], [46.0, [-56, 104, 10, 96]],
  [48.0, [-56, 104, 10, 96]], [48.35, [-60, 70, 56, 178]], [48.6, [-112, -34, 56, 178]], [48.8, [-112, -34, 56, 178]], [48.95, [-104, 6, 56, 178]], [49.1, [-112, -30, 56, 178]], [49.25, [-104, 8, 56, 178]], [49.5, [...REST_M[0], ...REST_M[1]]],
  [54.8, [...REST_M[0], ...REST_M[1]]], [55.05, [-112, -34, 56, 178]], [55.2, [-112, -34, 56, 178]], [55.6, [-30, 80, 56, 178]], [55.9, [-8, 34, 56, 178]], [57.3, [-8, 34, 56, 178]], [57.7, [-30, 90, 56, 178]], [61.5, [-30, 90, 56, 178]],
]);
function meera(t) {
  const tq = q2(t);
  const x = mX(t)[0];
  const moving = Math.abs(mX(t + 0.04)[0] - mX(t - 0.04)[0]) > 0.5;
  const hy = HY - (moving ? 6 * Math.abs(Math.sin(tq * 13)) : 0);
  const h = mHands(tq);
  let hands = { L: [x + h[0], hy + h[1]], R: [x + h[2], hy + h[3]] };
  let exp = { eyes: 'open', brows: 'flat', mouth: 'small' }, look = [-0.6, 0], blush = 0, shrug = 0;
  const items = [];
  // writing her answer: the right hand scribbles across the note
  if (t >= 46.4 && t < 47.6) { const u = pr(tq, 46.4, 47.6); hands.R = [x - 34 + 62 * u, hy + 92 + 10 * Math.sin(tq * 30)]; }
  const noteC = [x, hy + 104, 0];
  if (t >= 46.0 && t < 48.35) { noteC[0] = x - 22; noteC[1] = hy + 102; }
  // expressions
  if (t < 1.3) { look = [-1, 0.2]; exp.mouth = 'small'; }
  else if (t < 2.4) { look = [-0.8, 0.3]; exp.brows = 'up'; exp.mouth = 'o'; }
  else if (t < 5.6) { look = [0, 1]; exp.brows = 'puzzled'; exp.mouth = 'side'; }
  else if (t < 16.6) { look = [0.7, 0.2]; exp.mouth = 'smile'; }
  else if (t < 18.4) { look = [-1, 0]; exp.brows = 'up'; exp.mouth = 'small'; }
  else if (t < 26.8) { look = [0.6, 0]; exp.mouth = 'smile'; }
  else if (t < 29.8) { look = t < 27.6 ? [-0.9, 0.2] : [0, 1]; exp.brows = 'puzzled'; exp.mouth = 'side'; }
  else if (t < 30.9) { look = [0, 1]; exp.brows = 'down'; exp.mouth = 'flat'; }
  else if (t < 32.4) { look = [0, 0]; exp.brows = 'up'; exp.mouth = 'flat'; shrug = ss(pr(t, 31.0, 31.3)) * (1 - ss(pr(t, 32.0, 32.3))); }
  else if (t < 35.0) { look = [-0.4, -1]; exp.mouth = 'side'; blush = 0.35 * pr(t, 33.4, 34.0); }
  else if (t < 41.4) { look = [0, -1]; exp.brows = t > 37.5 ? 'up' : 'worried'; exp.mouth = t > 37.5 ? 'o' : 'small'; }
  else if (t < 42.2) { look = [0.2, 1]; exp.mouth = 'small'; }
  else if (t < 43.3) { look = [0.2, 1]; exp.brows = 'up'; exp.mouth = 'o'; }
  else if (t < 46.0) { look = [-0.3, 0.6]; exp.brows = 'up'; exp.mouth = t > 44.4 ? 'open' : 'smile'; blush = pr(t, 43.3, 44.1); if (t > 44.4) exp.eyes = 'happy'; }
  else if (t < 48.6) { look = [0, 1]; exp.mouth = t < 47.6 ? 'tongue' : 'open'; blush = 1; if (t > 47.6) exp.eyes = 'happy'; }
  else if (t < 55.8) { look = [-1, 0]; exp.mouth = 'smile'; blush = 0.7; exp.brows = t < 50 ? 'worried' : 'flat'; }
  else if (t < 57.3) { exp.eyes = 'closed'; exp.mouth = 'small'; blush = 0.8; look = [0, 0]; }
  else { look = [-1, 0]; exp.mouth = 'smile'; exp.eyes = t > 58.4 ? 'happy' : 'open'; blush = 0.8; }
  // items
  if (t >= 46.0 && t < 47.8) items.push({ type: 'crayon', side: 'R', col: K.red, ang: -1.1 });
  if (t >= 55.2) { const c = hands.L; items.push({ type: 'cup', x: c[0] + 6, y: c[1] - 14, steam: true, t }); }
  return { who: 'm', x, hy, hands, exp, look, blush, shrug, items, noteC };
}

// ——— Arjun's acting ———
const AX = 605;
const REST_A = [[-56, 178], [56, 178]];
const aHands = track([
  [0, [-80, 84, 80, 84]], [20.3, [-80, 84, 80, 84]], [20.8, [...REST_A[0], ...REST_A[1]]],
  [20.9, [-66, 104, 30, 96]], [22.9, [-66, 104, 30, 96]], [23.15, [-56, 178, 60, 70]], [23.5, [-56, 178, 107, -36]], [23.8, [-56, 178, 107, -36]],
  [23.95, [-56, 178, 100, 0]], [24.1, [-56, 178, 107, -36]], [24.25, [-56, 178, 100, 2]], [24.45, [-56, 178, 107, -36]], [24.8, [...REST_A[0], ...REST_A[1]]],
  [50.0, [...REST_A[0], ...REST_A[1]]], [50.3, [-56, 178, 107, -36]], [50.45, [-56, 178, 107, -36]], [50.75, [-46, 96, 46, 96]], [51.0, [-46, 96, 46, 96]],
  [51.25, [-70, -60, 76, -84]], [51.8, [-70, -60, 76, -84]], [52.2, [...REST_A[0], ...REST_A[1]]],
  [52.5, [...REST_A[0], ...REST_A[1]]], [52.7, [-56, 178, 46, 92]], [53.0, [-56, 178, 46, 92]], [53.3, [-56, 178, 107, -30]], [53.55, [-56, 178, 107, -30]], [53.9, [...REST_A[0], ...REST_A[1]]],
  [55.2, [...REST_A[0], ...REST_A[1]]], [55.5, [-56, 178, 40, 90]], [55.9, [-56, 178, 8, 34]], [57.3, [-56, 178, 8, 34]], [57.7, [-56, 178, 34, 92]], [61.5, [-56, 178, 34, 92]],
]);
function arjun(t) {
  const tq = q2(t);
  const jump = t >= 51.0 && t < 51.9 ? -46 * Math.sin(Math.PI * pr(tq, 51.0, 51.9)) : 0;
  const x = AX, hy = HY + jump;
  const h = aHands(tq);
  const hands = { L: [x + h[0], hy + h[1]], R: [x + h[2], hy + h[3]] };
  if (t >= 21.2 && t < 22.9) hands.R = [x - 48 + 52 * pr(tq, 21.2, 22.9) + 10 * Math.sin(tq * 26), hy + 92 + 9 * Math.cos(tq * 31)];
  let exp = { eyes: 'open', brows: 'flat', mouth: 'small' }, look = [1, 0], blush = 0;
  const items = [];
  // newspaper: his hiding place; he ducks when she looks his way
  if (t < 20.9) {
    let top = 12;                                          // peeking: eyes above the paper
    if (t > 16.9 && t < 18.3) top = -58 + 70 * ss(pr(t, 17.9, 18.3));   // she looks: he ducks behind it
    top += 160 * ss(pr(t, 20.35, 20.85));                  // lowers it below the railing
    items.push({ type: 'news', x, y: hy + top + 66, rot: -0.04 });
    hands.L = [x - 84, hy + top + 70]; hands.R = [x + 84, hy + top + 64];
    look = t > 16.9 && t < 18.3 ? [1, -0.3] : [1, 0.1];
    exp.brows = t > 19.4 ? 'up' : 'flat'; blush = t > 19.4 ? pr(t, 19.4, 20.0) : 0;
  } else if (t < 23.1) { look = [-0.2, 1]; exp.brows = 'down'; exp.mouth = 'tongue'; blush = 0.4; }
  else if (t < 26.5) { look = [1, -0.1]; exp.brows = 'worried'; exp.mouth = t < 24.6 ? 'small' : 'side'; blush = 0.6; }
  else if (t < 37.5) { look = [1, 0]; exp.mouth = 'small'; }
  else if (t < 42) { look = [0, -1]; exp.brows = 'up'; exp.mouth = 'o'; }
  else if (t < 50.6) { look = [1, 0]; exp.brows = 'worried'; exp.mouth = 'small'; }
  else if (t < 51.0) { look = [0, 1]; exp.brows = 'up'; exp.mouth = 'o'; }
  else if (t < 52.6) { exp.eyes = 'happy'; exp.brows = 'up'; exp.mouth = 'open'; blush = 1; }
  else if (t < 55.9) { look = [1, 0]; exp.mouth = 'smile'; blush = 0.8; }
  else if (t < 57.3) { exp.eyes = 'closed'; exp.mouth = 'small'; blush = 0.8; }
  else { look = [1, 0]; exp.mouth = 'smile'; exp.eyes = t > 58.4 ? 'happy' : 'open'; blush = 0.8; }
  if (t >= 20.9 && t < 22.95) items.push({ type: 'crayon', side: 'R', col: K.white, ang: -1.0 });
  if (t >= 52.6 && t < 53.4) { const c = hands.R; items.push({ type: 'cup', x: c[0], y: c[1] - 14, steam: true, t }); }
  if (t >= 55.3) { const c = hands.R; items.push({ type: 'cup', x: c[0] - 4, y: c[1] - 14, steam: true, t }); }
  const noteC = t >= 51.0 && t < 52.3 ? [hands.R[0] + 10, hands.R[1] - 40, 0.2] : t >= 21.0 && t < 23.1 ? [x - 18, hy + 102, 0] : [x, hy + 104, 0];
  return { who: 'a', x, hy, hands, exp, look, blush, items, noteC };
}

// ——— rain and the wash ———
function rainK(t) { return ss(pr(t, 37.4, 38.4)) * (1 - 0.8 * ss(pr(t, 52, 57.5))); }
const X0 = -140, X1 = 1940;
const BY = [-340, 760, 2300, 3420];
const edgeY = (k, x) => BY[k] + 14 * (Math.sin(x * 0.005 + k * 2) + 0.5 * Math.sin(x * 0.019 + k));
const BANDS = [
  { k: 0, t0: 37.6, t1: 38.7, dir: -1, seed: 1 },
  { k: 1, t0: 38.7, t1: 40.4, dir: 1, seed: 2 },
  { k: 2, t0: 40.4, t1: 41.6, dir: -1, seed: 3 },
].map(b => ({ ...b, y0: BY[b.k], y1: BY[b.k + 1] }));
function bandFront(b, t) { const u = clamp((t - b.t0) / (b.t1 - b.t0)); const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; const v = 0.15 * u + 0.85 * e; return b.dir > 0 ? lerp(X0, X1, v) : lerp(X1, X0, v); }
function drawWash(LW, t) {
  const g = LW.g; g.save();
  g.setTransform(CAM.s, 0, 0, CAM.s, W / 2 - CAM.x * CAM.s, H / 2 - CAM.y * CAM.s);
  for (const b of BANDS) {
    if (t < b.t0) continue;
    const f = bandFront(b, t), moving = t < b.t1;
    const top = [], bot = [];
    for (let x = X0; x <= X1; x += 40) {
      top.push([x, edgeY(b.k, x) - 3]);
      bot.push([x, edgeY(b.k + 1, x) + 3]);
    }
    const frontX = y => f + b.dir * 70 * Math.sin(clamp((y - b.y0) / (b.y1 - b.y0)) * Math.PI) + 12 * Math.sin(y * 0.05);
    g.save(); g.beginPath();
    if (b.dir > 0) { g.moveTo(X0 - 50, b.y0 - 200); for (let y = b.y0 - 200; y <= b.y1 + 200; y += 20) g.lineTo(frontX(y), y); g.lineTo(X0 - 50, b.y1 + 200); }
    else { g.moveTo(X1 + 50, b.y0 - 200); for (let y = b.y0 - 200; y <= b.y1 + 200; y += 20) g.lineTo(frontX(y), y); g.lineTo(X1 + 50, b.y1 + 200); }
    g.closePath(); g.clip();
    const shape = new Path2D(); top.forEach(([x, y], i) => i ? shape.lineTo(x, y) : shape.moveTo(x, y)); for (let i = bot.length - 1; i >= 0; i--) shape.lineTo(bot[i][0], bot[i][1]); shape.closePath();
    g.fillStyle = '#000'; g.globalAlpha = 0.66; g.fill(shape);
    g.save(); g.clip(shape);
    const R = mulberry(b.seed * 97);
    for (let i = 0; i < 26; i++) {
      const yy = lerp(b.y0, b.y1, R()), wdt = 6 + R() * 30, dark = R() < 0.55;
      g.beginPath(); for (let x = X0; x <= X1; x += 60) { const y = yy + 14 * Math.sin(x * 0.002 + i) + 6 * Math.sin(x * 0.01 + i * 2); x === X0 ? g.moveTo(x, y) : g.lineTo(x, y); }
      g.lineWidth = dark ? wdt : wdt * 0.5; g.globalCompositeOperation = dark ? 'source-over' : 'destination-out'; g.globalAlpha = dark ? 0.12 + R() * 0.1 : 0.05 + R() * 0.07; g.strokeStyle = '#000'; g.stroke();
    }
    g.globalCompositeOperation = 'source-over';
    g.beginPath(); for (let y = b.y0 - 80; y <= b.y1 + 80; y += 16) { const x = frontX(y) - b.dir * 14; y === b.y0 - 80 ? g.moveTo(x, y) : g.lineTo(x, y); }
    g.lineWidth = moving ? 34 : 22; g.globalAlpha = moving ? 0.3 : 0.14; g.stroke();
    g.restore(); g.restore();
  }
  g.restore();
}
function drawRain(L, t) {
  const k = rainK(t); if (k <= 0) return;
  const tq = q2(t), n = Math.round(150 * k);
  for (let i = 0; i < n; i++) {
    const x = hash(i * 1.31) * 1900 - 50, y0 = hash(i * 2.17 + 3) * 3400 - 100;
    const y = ((y0 + tq * 1500) % 3400) - 100;
    line(L, [[x, y], [x - 9, y + 46]], { w: 4, col: i % 4 ? K.white : K.teal, p: 0.9, seed: 900 + i, wob: 0.2, boil: 0.5 });
  }
}

// ——— printed words ———
function subTo(t) {
  const S = SUBS.find(s => t >= s.t0 && t < s.t1); if (!S) return;
  const rv = pr(t, S.t0, S.t0 + 0.6);
  const g = SUBK.g; g.save(); g.font = '400 54px Kalam'; const tw = g.measureText(S.text).width; g.restore();
  const cx = 500, cy = 1585, hw = tw / 2 + 40, hh = 50;
  g.save(); g.fillStyle = '#000'; g.beginPath();
  for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 2; const px = Math.cos(a), py = Math.sin(a); const sq = Math.pow(Math.abs(px), 0.3) * Math.sign(px); const nn = 1 + 0.06 * Math.sin(a * 7 + 1.3) + 0.03 * Math.sin(a * 17); const X = cx + sq * hw * nn, Y = cy + py * hh * nn; i ? g.lineTo(X, Y) : g.moveTo(X, Y); }
  g.closePath(); g.fill(); g.restore();
  wtext(SUBT, S.text, cx, cy + 16, { screen: true, size: 54, col: K.ink, reveal: rv, seed: 11 + S.t0 * 3, p: 1, stroke: 1.4 });
}
export const TEXTS = t => { const S = SUBS.find(s => t >= s.t0 && t < s.t1); return S ? [{ id: 's' + S.t0, text: S.text, x0: 80, y0: 1530, x1: 920, y1: 1640 }] : []; };

// ——— events for the mixer ———
export const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
ev(0, 'amb', { kind: 'birds' });
ev(0.0, 'squeak', { dur: 1.25, pan: -0.4 }); ev(1.6, 'unclip', { pan: -0.2 }); ev(2.3, 'unfold', { pan: 0 }); ev(3.2, 'quizz');
ev(TITLE_T[0], 'write', { dur: TITLE_T[1] - TITLE_T[0], pan: 0 });
ev(16.95, 'rustle', { pan: -0.4 }); ev(18.0, 'rustle', { pan: -0.4 }); ev(20.4, 'rustle', { pan: 0 });
ev(21.2, 'write', { dur: 1.7, pan: 0.1 }); ev(23.1, 'fold', { pan: 0.2 }); ev(23.75, 'clip', { pan: 0.4 });
ev(23.95, 'tug', { pan: 0.4 }); ev(24.25, 'tug', { pan: 0.4 }); ev(24.05, 'squeak', { dur: 2.9, pan: 0.4 });
ev(27.25, 'unclip', { pan: -0.3 }); ev(27.6, 'unfold'); ev(28.8, 'clip', { pan: 0.1 });
ev(28.5, 'squeak', { dur: 0.85, pan: -0.4 }); ev(29.55, 'unclip', { pan: -0.3 }); ev(29.8, 'unfold'); ev(30.9, 'clip', { pan: 0.3 }); ev(31.05, 'shrug');
ev(35.0, 'silence', { dur: 2.5 }); ev(35.3, 'scribble', { dur: 1.2, pan: -0.6 }); ev(36.3, 'thunder'); ev(37.3, 'drop', { pan: 0.2 });
ev(37.45, 'rain', { dur: DUR - 37.45 });
BANDS.forEach(b => ev(b.t0, 'brush', { dur: b.t1 - b.t0, dir: b.dir }));
RAILX.forEach((x, i) => { const b = BANDS[1]; let lo = b.t0, hi = b.t1; for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (bandFront(b, m) < x) lo = m; else hi = m; } ev(lo, 'glint', { i, pan: (x - 900) / 900 }); });
ev(43.3, 'blush'); ev(46.0, 'pop'); ev(46.5, 'scribble', { dur: 1.1, pan: 0 }); ev(48.35, 'fold'); ev(48.7, 'clip', { pan: -0.3 });
ev(48.95, 'tug', { pan: -0.3 }); ev(49.25, 'tug', { pan: -0.3 }); ev(49.0, 'squeak', { dur: 1.2, pan: 0 });
ev(50.4, 'unclip', { pan: 0.3 }); ev(50.65, 'unfold'); ev(51.0, 'jump'); ev(51.25, 'heart'); ev(51.9, 'land');
ev(53.3, 'clip', { pan: 0.3 }); ev(53.4, 'squeak', { dur: 1.5, pan: 0 }); ev(55.15, 'unclip', { pan: -0.2 }); ev(55.9, 'sip', { pan: -0.2 }); ev(56.1, 'sip', { pan: 0.2 });
ev(57.4, 'creak', { dur: 2.0 });
[['A', 0], ['T', 5.2], ['B', 9.6], ['C', 19.0], ['D', 26.5], ['S', 35.0], ['E', 37.5], ['F', 46.0], ['G', 52.5], ['Z', 59.5]].forEach(([id, t]) => ev(t, 'cue', { id }));

// ——— one frame ———
export function frame(comp, t) {
  [CAM.x, CAM.y, CAM.s] = camT(t);
  LA = 0.042 * ss(pr(t, 57.4, 59.4));
  BOIL.amp = t > 57 ? 0.6 : 1;
  clearGroup(NT); clearGroup(MR); clearGroup(AJ);
  [BG.f, BG.l, WASH, FX, SUBK, SUBT].forEach(clear);
  drawBG(t, { cloud: pr(t, 35.3, 36.5) });
  const ms = meera(t), as = arjun(t);
  const notes = noteStates(t, ms, as);
  // the chai cup on the rope
  let ropeCup = null;
  if (t >= 53.4 && t < 55.15) { const x = travel(t, 53.4, 54.9, 712, 1112); ropeCup = [x, ropePt(ropeU(x), 1)[1] + 52]; }
  notes.forEach((n, i) => { if (n.owner === 'rope' || n.owner === 'rail') drawNote(NT, n, 500 + i * 37); });
  if (ropeCup) drawCup(NT, ropeCup[0], ropeCup[1], 600, true, t, true);
  ms.items = [...notes.filter(n => n.owner === 'm').map(n => ({ type: 'note', ...n })), ...ms.items];
  as.items = [...notes.filter(n => n.owner === 'a').map(n => ({ type: 'note', ...n })), ...as.items];
  person(MR, ms, TR, 1000);
  person(AJ, as, TL, 2000);
  // her "?" and his heart
  if (t > 3.2 && t < 5.4) wtext(FX, '?', ms.x + 64, HY - 70, { size: 70, weight: 700, reveal: pr(t, 3.2, 3.5), seed: 70, p: 0.95 });
  if (t > 51.2 && t < 52.6) { const k = back(pr(t, 51.2, 51.5)) * (1 - pr(t, 52.3, 52.6)), c = [AX - 92, HY - 120 - 30 * pr(t, 51.2, 52.6)];
    const hp = smooth([[0, 18], [-26, -6], [-22, -24], [-8, -26], [0, -14], [8, -26], [22, -24], [26, -6]], 6).map(([px, py]) => [c[0] + px * 1.6 * k, c[1] + py * 1.6 * k]);
    fill(FX, hp, { col: K.red, p: 0.95, gap: 5, w: 7, seed: 71 }); line(FX, hp, { w: 5, seed: 72 }); }
  drawRain(FX, t);
  if (t >= BANDS[0].t0) drawWash(WASH, t);
  if (!NOSUBS) subTo(t);
  // composite: paper → page → notes (white wax inside) → watercolour (wax resists) → people → rain → printed words
  comp.paperCam(CAM.x * 0.6, CAM.y * 0.6, CAM.s / 0.6);
  comp.begin();
  comp.crayon(BG.f.c); comp.crayon(BG.l.c);
  const go = [hash(BOIL.step) * 300, hash(BOIL.step + 7) * 300];
  comp.group(NT, { goff: go });
  if (t >= BANDS[0].t0) comp.wash(WASH.c, { color: WASHC, edge: 0.7 });
  comp.group(AJ, { goff: go }); comp.group(MR, { goff: go });
  comp.crayon(FX.c, { goff: go });
  comp.knock(SUBK.c); comp.crayon(SUBT.c);
  comp.finish({ vig: 0.26 });
}
export function testFrame(comp, t) { frame(comp, t); }
