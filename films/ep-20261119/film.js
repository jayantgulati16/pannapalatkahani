// पापा का मफ़लर — Papa's Muffler. Crayon picture book, vertical 1080×1920, 24 fps.
// One page (world 1800×3200), one camera. A foggy winter morning at a school-bus stop: Papa gives his muffler to Tara every winter;
// she draws him one with her crayon, and it becomes real. Then she draws a sun, and the fog melts.
import { layer, clear, line, fill, dab, handCircle, smooth, xf, CAM, BOIL, W, H, sx, sy } from './crayon.js';
import { group, clearGroup, part, tube, erase } from './rig.js';
import { clamp, lerp, hash, track, ss, eio, eo, ei, back } from '/core/lib.js';

export const DUR = 48.5;
const NOSUBS = new URLSearchParams(location.search).get('nosubs') === '1';   // comic stills: no printed words in the frame
const K = { ink: '#2d3263', yellow: '#f5c63c', orange: '#ec8a3c', red: '#d4483c', pink: '#ee8ea4', peach: '#f4c7a4', brown: '#7a4b31',
  ochre: '#e7b867', green: '#62a24c', teal: '#4fb3a9', violet: '#6a5aa6', white: '#fbfaf4', grey: '#8d90a8', navy: '#3d4b86', dark: '#3a3340' };
const pr = (t, a, b) => clamp((t - a) / (b - a));
const q2 = t => Math.floor(t * 12 + 1e-6) / 12;  // drawn things act on twos
const GROUND = 2905, SEAT = 2735;
const PX = 760, PHY = GROUND - 742, HIPY = 330;   // Papa: x, head-centre y, hip below head centre
const THT = 430;                                   // Tara: feet → head centre
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

// ——— printed words (no voice: the book's text) ———
export const SUBS = [
  { t0: 9.0, t1: 13.2, text: 'कोहरे वाली सुबह… स्कूल बस का इंतज़ार।' },
  { t0: 13.4, t1: 17.4, text: 'पापा का मफ़लर, हर सर्दी… तारा के गले में।' },
  { t0: 18.0, t1: 22.6, text: '“मुझे ठंड नहीं लगती,” पापा हमेशा कहते।' },
  { t0: 26.4, t1: 30.4, text: 'पर तारा के पास क्रेयॉन थे।' },
  { t0: 40.6, t1: 45.3, text: 'पापा को भी ठंड लगती है… बस वो बताते नहीं।' },
];
const TITLE = 'पापा का मफ़लर', TITLE_T = [5.2, 7.0];

// ——— camera: [x, y, scale] ———
const camT = track([
  [0, [1012, 2505, 2.7]], [1.9, [1012, 2500, 2.7]], [3.1, [800, 2215, 2.3]], [4.6, [800, 2215, 2.3]],
  [5.6, [960, 1900, 1.0]], [8.2, [960, 1920, 1.0]], [9.2, [980, 2250, 0.95]], [17.2, [980, 2260, 0.95]],
  [18.2, [920, 2330, 1.35]], [22.7, [920, 2330, 1.35]], [23.0, [830, 2260, 1.75]], [23.8, [830, 2260, 1.75]], [24.5, [930, 2340, 1.4]],
  [26.2, [960, 2340, 1.4]], [27.3, [890, 2265, 1.9]], [30.6, [890, 2265, 1.9]], [31.6, [860, 2300, 1.55]], [33.4, [860, 2300, 1.55]],
  [34.6, [930, 1720, 0.75]], [37.0, [930, 1740, 0.75]], [38.6, [960, 2230, 0.92]], [44.8, [960, 2240, 0.92]],
  [46.6, [900, 1600, 0.6]], [48.5, [900, 1600, 0.6]],
]);

// ——— text: Devanagari needs whole words; reveal = a clip wiping left → right ———
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
const BG = { f: layer(), l: layer() }, FOGF = layer(), SKY = layer(), BUS = group(), PROPS = group(), PA = group(), TA = group(),
  FOGN = layer(), WASH = layer(), FX = layer(), SUBK = layer(), SUBT = layer();
const BGC = { k: BG.f, f: BG.f, l: BG.l };

// ——— fog: how thick it is (melts from the sun outward) ———
const SUN = [430, 1000];
function fogK(t, x = 900, y = 1800) {
  const d = Math.hypot(x - SUN[0], y - SUN[1]) / 2600;
  return 1 - 0.9 * ss(pr(t, 35.2 + d * 1.6, 36.6 + d * 1.6));
}

// ——— the page ———
function windowAt(x, y, w, h, seed, glass, sill) {
  fill(BG.f, rect(x, y, x + w, y + h), { col: glass, p: 0.42, gap: 10, w: 11, ang: 1.0, seed, boil: 0 });
  line(BG.l, [...rect(x, y, x + w, y + h), [x + 8, y]], { w: 5, seed: seed + 1, p: 0.6, boil: 0.6 });
  line(BG.l, [[x + w / 2, y], [x + w / 2, y + h]], { w: 4, seed: seed + 2, p: 0.6, boil: 0.6 });
  fill(BG.f, rect(x - 10, y + h, x + w + 10, y + h + 16), { col: sill, p: 0.6, gap: 7, w: 9, seed: seed + 3, boil: 0 });
}
function drawBG(t) {
  // left building (ochre), right building (teal): far away in the fog, so drawn lightly
  fill(BG.f, rect(-60, 1100, 520, 2380), { col: K.ochre, p: 0.5, gap: 12, w: 12, ang: 0.35, seed: 11, cross: true, crossP: 0.5, boil: 0 });
  line(BG.l, [[520, 2380], [520, 1100], [-60, 1100]], { w: 7, seed: 12, p: 0.6, boil: 0.6 });
  fill(BG.f, rect(-60, 1062, 545, 1100), { col: K.red, p: 0.6, gap: 8, w: 10, seed: 13, boil: 0 });
  windowAt(70, 1220, 140, 170, 20, K.teal, K.red); windowAt(320, 1220, 140, 170, 30, K.teal, K.red);
  windowAt(70, 1620, 140, 170, 40, K.teal, K.red); windowAt(320, 1620, 140, 170, 50, K.teal, K.green);
  windowAt(70, 2020, 140, 170, 60, K.teal, K.red);
  fill(BG.f, rect(1320, 900, 1860, 2380), { col: K.teal, p: 0.48, gap: 12, w: 12, ang: 0.35, seed: 111, cross: true, crossP: 0.5, boil: 0 });
  line(BG.l, [[1320, 2380], [1320, 900], [1860, 900]], { w: 7, seed: 112, p: 0.6, boil: 0.6 });
  fill(BG.f, rect(1295, 862, 1860, 900), { col: K.orange, p: 0.6, gap: 8, w: 10, seed: 113, boil: 0 });
  windowAt(1400, 1020, 140, 170, 120, K.yellow, K.violet); windowAt(1640, 1020, 140, 170, 130, K.yellow, K.violet);
  windowAt(1400, 1420, 140, 170, 140, K.yellow, K.violet); windowAt(1640, 1420, 140, 170, 150, K.yellow, K.violet);
  windowAt(1400, 1820, 140, 170, 160, K.yellow, K.green); windowAt(1640, 1820, 140, 170, 170, K.yellow, K.violet);
  // a far skyline between them, barely there
  line(BG.l, [[520, 1700], [600, 1700], [600, 1560], [720, 1560], [720, 1660], [860, 1660], [860, 1500], [980, 1500], [980, 1640], [1120, 1640], [1120, 1590], [1320, 1590]], { w: 5, seed: 180, p: 0.35, boil: 0.6 });
  // electric wires
  for (const [y0, y1, sag, sd] of [[1380, 1300, 70, 190], [1430, 1370, 85, 191]]) { const pts = []; for (let i = 0; i <= 16; i++) { const u = i / 16; pts.push([lerp(520, 1320, u), lerp(y0, y1, u) + sag * Math.sin(Math.PI * u)]); } line(BG.l, pts, { w: 3, seed: sd, p: 0.55, boil: 0.5 }); }
  // the road and the pavement
  fill(BG.f, rect(-80, 2380, 1880, 2620), { col: K.grey, p: 0.42, gap: 12, w: 12, ang: 0.08, seed: 200, boil: 0 });
  for (let i = 0; i < 7; i++) line(BG.l, [[-40 + i * 290, 2500], [100 + i * 290, 2500]], { w: 9, col: K.white, seed: 201 + i, p: 0.8, boil: 0.5 });
  fill(BG.f, rect(-80, 2620, 1880, 3300), { col: K.ochre, p: 0.34, gap: 13, w: 13, ang: 0.15, seed: 210, boil: 0 });
  line(BG.l, [[-80, 2620], [1880, 2620]], { w: 7, seed: 211, p: 0.85, boil: 0.6 });
  line(BG.l, [[-80, 2648], [1880, 2648]], { w: 4, seed: 212, p: 0.45, boil: 0.6 });
  for (let i = 0; i < 9; i++) line(BG.l, [[-60 + i * 230, 2650], [-90 + i * 230, 3300]], { w: 3, seed: 213 + i, p: 0.28, boil: 0.5 });
  // street lamp (left)
  line(BG.l, [[250, 2640], [250, 1720]], { w: 10, col: K.dark, seed: 230, p: 0.8, boil: 0.6 });
  line(BG.l, smooth([[250, 1730], [262, 1680], [310, 1662], [350, 1676]], 6, false), { w: 8, col: K.dark, seed: 231, p: 0.8, boil: 0.6 });
  part(BGC, [[322, 1676], [378, 1676], [366, 1702], [334, 1702]], { col: K.dark, p: 0.8, gap: 5, w: 6, seed: 232, boil: 0 }, { w: 5, seed: 233 }, { occ: false, kn: false });
  // title, written in the fog
  if (t > TITLE_T[0] && t < 9.4) wtext(SKY, TITLE, 960, 1560, { size: 128, weight: 700, reveal: pr(t, TITLE_T[0], TITLE_T[1]), seed: 21, stroke: 2.5, boil: 0.8, p: 1 - pr(t, 8.5, 9.3) });
}
function drawFog(L, t, near) {
  const bands = near ? [[2040, 150, 1], [2500, 120, 2], [2880, 140, 3]] : [[900, 300, 1], [1250, 300, 2], [1600, 300, 3], [1950, 300, 4], [2300, 300, 5], [2650, 280, 6], [3000, 320, 7]];
  bands.forEach(([cy, hh, k]) => {
    const fk = fogK(t, 900, cy); if (fk < 0.02) return;
    const drift = (near ? 22 : 12) * t * (k % 2 ? 1 : -1);
    const top = [], bot = [];
    for (let x = -200; x <= 2000; x += 100) {
      top.push([x, cy - hh / 2 + 40 * Math.sin(x * 0.004 + k * 1.7 + drift * 0.004)]);
      bot.push([x, cy + hh / 2 + 40 * Math.sin(x * 0.005 + k * 2.3 - drift * 0.004)]);
    }
    const poly = [...top, ...bot.reverse()];
    fill(L, poly, { col: K.white, p: (near ? 0.26 : 0.56) * fk, gap: 15, w: 18, ang: 0.05, seed: 300 + k * 7 + (near ? 50 : 0), over: 10, boil: 0.6 });
  });
}
function drawLampGlow(L, t) {
  const on = 1 - ss(pr(t, 35.6, 36.4)); if (on <= 0) return;
  fill(L, handCircle(350, 1715, 70, 240, 0, 28), { col: K.yellow, p: 0.55 * on, gap: 8, w: 10, seed: 241, over: 3 });
  fill(L, handCircle(350, 1715, 30, 242, 0, 20), { col: K.yellow, p: 0.95 * on, gap: 5, w: 7, seed: 243, over: 2 });
}

// ——— the sun Tara draws in the fog (outline → colour → rays → face) ———
function drawSun(t) {
  const o = pr(t, 33.9, 34.7); if (o <= 0) return;
  const ring = handCircle(SUN[0], SUN[1], 150, 400, 0.1, 44);
  const fp = pr(t, 34.6, 35.3);
  if (fp > 0) fill(SKY, ring, { col: K.yellow, p: 0.9, gap: 10, w: 12, seed: 401, draw: fp, cross: fp > 0.6, over: 6 });
  line(SKY, ring, { w: 9, col: K.orange, seed: 402, draw: o });
  const rp = pr(t, 35.1, 35.6);
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + 0.25; if (rp * 12 < i) break; const r0 = 180, r1 = 250 + 15 * Math.sin(q2(t) * 3 + i);
    line(SKY, [[SUN[0] + Math.cos(a) * r0, SUN[1] + Math.sin(a) * r0], [SUN[0] + Math.cos(a) * r1, SUN[1] + Math.sin(a) * r1]], { w: 10, col: K.orange, seed: 410 + i }); }
  if (t > 35.4) {
    dab(SKY, SUN[0] - 46, SUN[1] - 22, 10, { col: K.ink, p: 1, seed: 430 }); dab(SKY, SUN[0] + 46, SUN[1] - 22, 10, { col: K.ink, p: 1, seed: 431 });
    line(SKY, smooth([[SUN[0] - 50, SUN[1] + 30], [SUN[0], SUN[1] + 62], [SUN[0] + 50, SUN[1] + 30]], 6, false), { w: 8, seed: 432, draw: pr(t, 35.4, 35.8) });
    for (const sg of [-1, 1]) fill(SKY, handCircle(SUN[0] + sg * 80, SUN[1] + 20, 20, 433 + sg, 0, 16), { col: K.orange, p: 0.7, gap: 5, w: 7, seed: 435 + sg });
  }
}

// ——— props: bench, bus-stop sign ———
function drawProps() {
  const C = PROPS;
  for (const x of [925, 1205]) part(C, rect(x - 9, SEAT + 20, x + 9, GROUND + 4), { col: K.dark, p: 0.85, gap: 5, w: 6, seed: x }, { w: 5, seed: x + 1 });
  part(C, rect(890, SEAT - 4, 1240, SEAT + 26), { col: K.brown, p: 0.85, gap: 7, w: 9, ang: 0.1, seed: 501 }, { w: 6, seed: 502 });
  line(C.l, [[896, SEAT + 11], [1234, SEAT + 11]], { w: 3, seed: 503, p: 0.5 });
  part(C, rect(900, SEAT - 150, 1230, SEAT - 118), { col: K.brown, p: 0.85, gap: 7, w: 9, ang: 0.1, seed: 504 }, { w: 6, seed: 505 });
  for (const x of [935, 1195]) part(C, rect(x - 7, SEAT - 118, x + 7, SEAT - 4), { col: K.dark, p: 0.8, gap: 4, w: 5, seed: x + 7 }, { w: 4, seed: x + 8 });
  // Tara's school bag on the bench
  part(C, smooth([[1110, SEAT - 4], [1104, SEAT - 92], [1130, SEAT - 112], [1196, SEAT - 112], [1214, SEAT - 90], [1210, SEAT - 4]], 5), { col: K.red, p: 0.9, gap: 7, w: 9, seed: 510 }, { w: 6, seed: 511 });
  part(C, rect(1122, SEAT - 64, 1198, SEAT - 24), { col: K.orange, p: 0.9, gap: 6, w: 8, seed: 512 }, { w: 5, seed: 513 });
  line(C.l, smooth([[1128, SEAT - 108], [1160, SEAT - 150], [1192, SEAT - 108]], 6, false), { w: 6, seed: 514 });
  // bus-stop pole and sign
  part(C, rect(1412, 2280, 1428, GROUND + 4), { col: K.grey, p: 0.85, gap: 5, w: 6, seed: 520 }, { w: 5, seed: 521 });
  part(C, rect(1310, 2170, 1530, 2290), { col: K.yellow, p: 0.95, gap: 8, w: 10, seed: 522 }, { w: 6, seed: 523 });
  wtext(C.l, 'बस स्टॉप', 1420, 2248, { size: 52, weight: 700, seed: 524, stroke: 1.5 });
}

// ——— the school bus (comes in behind them, leaves with Tara) ———
function busX(t) { return t < 39 ? -1700 * (1 - eo(pr(t, 37.0, 39.0))) : 1900 * ei(pr(t, 42.6, 44.8)); }
function drawBus(t, tara) {
  const dx = busX(t); if (t < 37 || t > 44.8) return;
  const C = BUS, X = x => x + dx;
  const moving = (t > 37 && t < 39) || t > 42.6;
  const bob = moving ? 4 * Math.sin(q2(t) * 20) : 0;
  const T = pts => pts.map(([x, y]) => [X(x), y]);
  const B = pts => T(pts).map(([x, y]) => [x, y + bob]);
  part(C, B(smooth([[230, 2575], [228, 2000], [260, 1960], [1380, 1960], [1440, 2040], [1462, 2300], [1460, 2575]], 4)), { col: K.yellow, p: 0.92, gap: 9, w: 11, ang: 0.2, seed: 600, cross: true, crossP: 0.4 }, { w: 7, seed: 601 });
  part(C, B(rect(236, 2420, 1458, 2460)), { col: K.dark, p: 0.85, gap: 6, w: 8, seed: 602 }, { w: 4, seed: 603 });
  for (let i = 0; i < 5; i++) { const x0 = 290 + i * 190; part(C, B(rect(x0, 2030, x0 + 150, 2200)), { col: K.teal, p: 0.6, gap: 8, w: 9, ang: 1.0, seed: 610 + i }, { w: 5, seed: 620 + i }); }
  part(C, B(rect(1250, 2020, 1360, 2560)), { col: K.teal, p: 0.5, gap: 8, w: 9, ang: 1.0, seed: 630 }, { w: 6, seed: 631 });
  line(C.l, B([[1305, 2020], [1305, 2560]]), { w: 4, seed: 632 });
  part(C, B([[1372, 2030], [1430, 2060], [1448, 2240], [1372, 2240]]), { col: K.teal, p: 0.55, gap: 8, w: 9, ang: 1.0, seed: 633 }, { w: 5, seed: 634 });
  wtext(C.l, 'स्कूल बस', X(700), 2350 + bob, { size: 92, weight: 700, seed: 640, stroke: 2, col: K.ink });
  part(C, B(handCircle(1430, 2380, 22, 650, 0, 16)), { col: K.white, p: 0.95, gap: 5, w: 7, seed: 651 }, { w: 5, seed: 652 });
  if (t < 40) for (let i = 0; i < 3; i++) line(C.l, B([[1470, 2360 + i * 20], [1530 + i * 6, 2350 + i * 30]]), { w: 4, col: K.orange, seed: 653 + i, p: 0.6 });
  for (const [x, sd] of [[440, 660], [1200, 670]]) {
    const rot = dx * 0.02;
    part(C, T(handCircle(x, 2580, 62, sd, 0.05, 28)), { col: K.dark, p: 0.95, gap: 6, w: 8, seed: sd + 1 }, { w: 6, seed: sd + 2 });
    part(C, T(handCircle(x, 2580, 24, sd + 3, 0.05, 18)), { col: K.grey, p: 0.9, gap: 5, w: 6, seed: sd + 4 }, { w: 4, seed: sd + 5 });
    line(C.l, T([[x + Math.cos(rot) * 22, 2580 + Math.sin(rot) * 22], [x - Math.cos(rot) * 22, 2580 - Math.sin(rot) * 22]]), { w: 4, seed: sd + 6 });
  }
  // Tara in the last window, waving
  if (tara) {
    const wx = X(290 + 4 * 190 + 75), wy = 2150 + bob;
    const tp = pts => pts.map(([px, py]) => [wx + px * 0.75, wy + py * 0.75]);
    const sd = 700, skin = { col: K.peach, p: 0.6, gap: 6, w: 8, ang: 0.5, seed: sd + 1 };
    for (const sg of [-1, 1]) part(C, tp(tube([[sg * 44, -6], [sg * 56, 50], [sg * 60, 84]], 22, 16)), { col: K.dark, p: 0.95, gap: 5, w: 7, seed: sd + 3 + sg }, { w: 4, seed: sd + 5 + sg });
    part(C, tp(handCircle(0, 0, 56, sd + 7, 0.06, 40)), skin, { w: 5, seed: sd + 8 });
    part(C, tp(smooth([[-58, 0], [-52, -40], [-24, -62], [0, -60], [26, -64], [52, -40], [58, 0], [42, -22], [16, -36], [0, -38], [-14, -34], [-40, -20]], 5)), { col: K.dark, p: 0.97, gap: 6, w: 8, ang: 1.0, seed: sd + 9 }, { w: 5, seed: sd + 10 });
    for (const sg of [-1, 1]) line(C.l, tp([[sg * 18 - 8, 2], [sg * 18, -6], [sg * 18 + 8, 2]]), { w: 4, seed: sd + 11 + sg });
    part(C, tp([[-14, 20], [14, 20], [8, 32], [0, 35], [-8, 32]]), { col: K.red, p: 0.9, gap: 4, w: 5, seed: sd + 14 }, { w: 3.5, seed: sd + 15 });
    for (const sg of [-1, 1]) dab(C.l, ...tp([[sg * 32, 14]])[0], 8, { col: K.pink, p: 0.8, seed: sd + 16 + sg });
    part(C, tp([[-50, 42], [50, 42], [46, 76], [-46, 76]]), { col: K.red, p: 0.9, gap: 6, w: 8, seed: sd + 19 }, { w: 4, seed: sd + 20 });
    const wv = Math.sin(q2(t) * 9) * 18;
    part(C, tp(tube([[44, 84], [84 + wv * 0.3, 20], [90 + wv, -60]], 20, 16)), { col: K.green, p: 0.8, gap: 6, w: 8, seed: sd + 21 }, { w: 4, seed: sd + 22 });
    part(C, tp(handCircle(90 + wv, -66, 14, sd + 23, 0, 14)), skin, { w: 4, seed: sd + 24 });
  }
}

// ——— shared face (k = head size relative to 50) ———
function face(C, tp, s, sd, k) {
  const e = s.exp, lk = s.look || [0, 0], eyeY = -2 * k;
  for (const sg of [-1, 1]) {
    const ex = (sg * 18 + lk[0] * 5) * k, ey = eyeY + lk[1] * 4 * k, cx = sg * 18 * k;
    if (e.eyes === 'closed') line(C.l, tp([[cx - 9 * k, eyeY + k], [cx, eyeY + 5 * k], [cx + 9 * k, eyeY + k]]), { w: 4.5, seed: sd + 30 + sg });
    else if (e.eyes === 'happy') line(C.l, tp([[cx - 9 * k, eyeY + 4 * k], [cx, eyeY - 5 * k], [cx + 9 * k, eyeY + 4 * k]]), { w: 4.5, seed: sd + 30 + sg });
    else if (e.eyes === 'squeeze') line(C.l, tp([[cx - 9 * k * sg, eyeY - 6 * k], [cx + 7 * k * sg, eyeY], [cx - 9 * k * sg, eyeY + 6 * k]]), { w: 4.5, seed: sd + 30 + sg });
    else if (e.eyes === 'half') { const c = tp([[ex, ey + 2 * k]])[0]; dab(C.l, c[0], c[1], 6 * k, { col: K.ink, p: 1, gap: 3, w: 5, seed: sd + 32 + sg, sq: 0.6 }); line(C.l, tp([[cx - 10 * k, eyeY - k], [cx + 10 * k, eyeY - k]]), { w: 4.5, seed: sd + 38 + sg }); }
    else { const c = tp([[ex, ey]])[0]; dab(C.l, c[0], c[1], 6.5 * k, { col: K.ink, p: 1, gap: 3, w: 5, seed: sd + 32 + sg }); dab(C.l, c[0] + 2 * k, c[1] - 2.5 * k, 2.2 * k, { col: K.white, p: 1, gap: 1.5, w: 3, seed: sd + 34 + sg }); }
    const b = e.brows === 'up' ? [-24, -22] : e.brows === 'down' ? [-17, -22] : e.brows === 'worried' ? [-24, -17] : e.brows === 'puzzled' ? (sg < 0 ? [-26, -28] : [-17, -18]) : [-20, -20];
    line(C.l, tp([[sg * 8 * k, b[0] * k], [sg * 26 * k, b[1] * k]]), { w: s.who === 'p' ? 5.5 : 4, seed: sd + 36 + sg });
  }
  if (s.blush > 0) for (const sg of [-1, 1]) fill(C.f, tp(handCircle(sg * 31 * k, 14 * k, (10 + 3 * s.blush) * k, sd + 60 + sg, 0, 18)), { col: K.pink, p: 0.75, gap: 4, w: 6, seed: sd + 62 + sg, draw: clamp(s.blush * 1.4), over: 2 });
  const m = e.mouth, my = s.who === 'p' ? 8 * k : 0;
  if (m === 'open') part(C, tp([[-15 * k, 17 * k + my], [15 * k, 17 * k + my], [10 * k, 30 * k + my], [0, 34 * k + my], [-10 * k, 30 * k + my]]), { col: K.red, p: 0.9, gap: 4, w: 6, seed: sd + 50 }, { w: 4, seed: sd + 51 });
  else if (m === 'big') part(C, tp(smooth([[-16 * k, 14 * k + my], [16 * k, 14 * k + my], [12 * k, 38 * k + my], [0, 44 * k + my], [-12 * k, 38 * k + my]], 4)), { col: K.red, p: 0.9, gap: 4, w: 6, seed: sd + 50 }, { w: 4.5, seed: sd + 51 });
  else if (m === 'o') line(C.l, tp(handCircle(0, 25 * k + my, 6 * k, sd + 52, 0.1, 14)), { w: 4, seed: sd + 52 });
  else if (m === 'flat') line(C.l, tp([[-8 * k, 25 * k + my], [8 * k, 24 * k + my]]), { w: 4, seed: sd + 53 });
  else if (m === 'tongue') { line(C.l, tp(smooth([[-9 * k, 22 * k + my], [0, 27 * k + my], [9 * k, 22 * k + my]], 5, false)), { w: 4, seed: sd + 54 }); dab(C.l, ...tp([[8 * k, 28 * k + my]])[0], 4.5 * k, { col: K.pink, p: 1, seed: sd + 55 }); }
  else if (m === 'small') line(C.l, tp(smooth([[-6 * k, 23 * k + my], [0, 26 * k + my], [6 * k, 23 * k + my]], 5, false)), { w: 4, seed: sd + 56 });
  else if (m === 'side') line(C.l, tp(smooth([[-4 * k, 25 * k + my], [5 * k, 25 * k + my], [10 * k, 21 * k + my]], 5, false)), { w: 4, seed: sd + 57 });
  else if (m === 'grit') { const j = (hash(BOIL.step * 1.7) - .5) * 3 * k; part(C, tp(rect(-13 * k + j, 20 * k + my, 13 * k + j, 30 * k + my)), { col: K.white, p: 0.95, gap: 3, w: 4, seed: sd + 58 }, { w: 4, seed: sd + 59 }); line(C.l, tp([[-13 * k + j, 25 * k + my], [13 * k + j, 25 * k + my]]), { w: 2.5, seed: sd + 64 }); for (const xx of [-5, 4]) line(C.l, tp([[xx * k + j, 20 * k + my], [xx * k + j, 30 * k + my]]), { w: 2.2, seed: sd + 66 + xx }); }
  else line(C.l, tp(smooth([[-12 * k, 19 * k + my], [0, 29 * k + my], [12 * k, 19 * k + my]], 5, false)), { w: 4.5, seed: sd + 58 });
}

// ——— IK: shoulder → hand, two segments; the elbow bends down/outward ———
function ik(sh, hd, L1, L2, side) {
  let dx = hd[0] - sh[0], dy = hd[1] - sh[1]; let d = Math.hypot(dx, dy); const mx = L1 + L2 - 1;
  let tgt = hd; if (d > mx) { tgt = [sh[0] + dx / d * mx, sh[1] + dy / d * mx]; dx = tgt[0] - sh[0]; dy = tgt[1] - sh[1]; d = mx; }
  d = Math.max(d, 1e-3);
  const a = Math.atan2(dy, dx), B = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
  const e1 = [sh[0] + Math.cos(a + B) * L1, sh[1] + Math.sin(a + B) * L1], e2 = [sh[0] + Math.cos(a - B) * L1, sh[1] + Math.sin(a - B) * L1];
  const score = e => e[1] + side * e[0] * 0.6;
  return [score(e1) > score(e2) ? e1 : e2, tgt];
}
function arms(C, s, shL, shR, L1, L2, w0, w1, col, sd) {
  const out = {};
  for (const [side, shp, sg] of [['L', shL, -1], ['R', shR, 1]]) {
    const [el, hd] = ik(shp, s.hands[side], L1, L2, sg);
    out[side] = hd;
    part(C, tube([shp, el, hd], w0, w1), { col, p: 0.8, gap: 8, w: 9, ang: 0.4, seed: sd + 100 + sg }, { w: 5.5, seed: sd + 102 + sg });
  }
  return out;
}
function crayonItem(C, h, ang, col, sd) {
  part(C, tube([[h[0] - Math.cos(ang) * 8, h[1] - Math.sin(ang) * 8], [h[0] + Math.cos(ang) * 42, h[1] + Math.sin(ang) * 42]], 11, 9), { col, p: 0.95, gap: 3, w: 5, seed: sd }, { w: 3.5, seed: sd + 1 });
  dab(C.l, h[0] + Math.cos(ang) * 46, h[1] + Math.sin(ang) * 46, 4, { col, p: 1, seed: sd + 2 });
}
// a striped muffler band (around a neck) and its tail; draw/fill/real drive Tara's live drawing on Papa
function muffler(C, band, tail, o) {
  const { c1, c2, sd } = o, draw = o.draw ?? 1, fp = o.fill ?? 1, real = o.real ?? 1;
  const solid = fp > 0.05;
  const fo = f => solid ? { col: c1, p: 0.92, gap: 6, w: 9, ang: 1.25, seed: f, draw: fp, cross: real > 0.5, crossP: 0.4 } : null;
  if (tail) part(C, tail, fo(sd), { w: 5.5 + 1.5 * real, seed: sd + 1, draw: clamp(draw * 2 - 1) }, { occ: solid, kn: solid });
  part(C, band, fo(sd + 2), { w: 5.5 + 1.5 * real, seed: sd + 3, draw: clamp(draw * 2) }, { occ: solid, kn: solid });
  if (fp > 0.3) {
    const sp = clamp((fp - 0.3) / 0.7);
    (o.stripes || []).forEach((st, i) => { if (i / o.stripes.length < sp) line(C.l, st, { w: 9, col: c2, p: 0.95, seed: sd + 10 + i }); });
  }
  if (real > 0 && o.fringe) o.fringe.forEach((f, i) => line(C.l, [f[0], [lerp(f[0][0], f[1][0], real), lerp(f[0][1], f[1][1], real)]], { w: 4.5, col: c1, seed: sd + 40 + i }));
}

// ——— Papa ———
const REST_P = [-84, 300, 84, 300], HUG_P = [52, 196, -48, 182];
const pHands = track([
  [0, HUG_P], [9.8, HUG_P], [10.2, [-6, 122, -48, 182]], [11.6, [-6, 122, -48, 182]], [12.0, HUG_P],
  [13.2, HUG_P], [13.6, [-16, 48, 16, 52]], [15.2, [-16, 48, 16, 52]], [15.5, [-10, 70, 12, 66]], [16.4, [-10, 70, 12, 66]], [16.8, HUG_P],
  [19.2, HUG_P], [19.6, [-84, 300, 150, 230]], [20.1, [-84, 300, 150, 230]], [20.5, [120, 270, 200, 250]], [21.5, [120, 270, 200, 250]],
  [21.9, [-78, 306, 78, 306]], [22.8, [-78, 306, 78, 306]], [23.2, [-14, 38, 14, 40]], [24.2, [-14, 38, 14, 40]], [24.6, HUG_P],
  [26.9, HUG_P], [27.4, [20, 420, 90, 400]], [30.9, [20, 420, 90, 400]], [31.6, [-14, 140, 36, 156]], [33.3, [-14, 140, 36, 156]],
  [33.8, REST_P], [40.4, REST_P], [40.8, [-84, 300, 118, -46]], [43.4, [-84, 300, 118, -46]], [43.9, [-22, 128, 28, 84]], [48.5, [-22, 128, 28, 84]],
]);
const leanT = track([[0, [0]], [19.5, [0]], [20.1, [0.16]], [21.5, [0.16]], [21.9, [-0.06]], [22.8, [-0.08]], [23.0, [-0.14]], [23.3, [0.12]], [23.7, [0]],
  [26.9, [0]], [27.5, [0.36]], [30.9, [0.36]], [31.7, [0]], [48.5, [0]]]);
const coldK = t => ss(pr(t, 2.5, 4.3)) * (1 - ss(pr(t, 31.0, 32.6)));
function papa(t) {
  const tq = q2(t), cold = coldK(t);
  const shiver = cold > 0.4 && t < 31 ? (hash(BOIL.step * 3.1) - .5) * 7 : 0;
  const x = PX + shiver, hy = PHY;
  const lean = leanT(tq)[0];
  const h = pHands(tq);
  const hands = { L: [x + h[0], hy + h[1]], R: [x + h[2], hy + h[3]] };
  if (t >= 15.2 && t < 16.4) { const w = Math.sin(tq * 26) * 10; hands.L[1] += w; hands.R[1] -= w; }       // rubbing hands
  if (t >= 40.8 && t < 43.4) hands.R[0] += Math.sin(tq * 9) * 26;                                            // waving
  const exp = { eyes: 'open', brows: 'worried', mouth: 'smile' }; let look = [1, 0.4], blush = 0;
  if (t < 2.2) { look = [1, 0.6]; exp.mouth = 'grit'; }
  else if (t < 4.8) { look = [0.2, 0.1]; exp.mouth = 'grit'; }
  else if (t < 9.8) { look = [1, 0.7]; exp.mouth = 'smile'; }
  else if (t < 11.6) { look = [-0.3, 1]; exp.brows = 'flat'; exp.mouth = 'small'; }
  else if (t < 13.2) { look = [-1, 0]; exp.mouth = 'side'; }
  else if (t < 16.8) { look = [0, 0.6]; exp.mouth = 'o'; exp.eyes = t > 13.8 && t < 14.9 ? 'closed' : 'open'; }
  else if (t < 18.2) { look = [-1, 0]; exp.mouth = 'grit'; }
  else if (t < 21.9) { look = [1, 1]; exp.brows = t < 19.4 ? 'up' : 'flat'; exp.mouth = 'smile'; }
  else if (t < 22.9) { look = [0, -1]; exp.eyes = 'closed'; exp.brows = 'up'; exp.mouth = 'smile'; }
  else if (t < 23.3) { exp.eyes = 'squeeze'; exp.brows = 'up'; exp.mouth = 'o'; }
  else if (t < 23.7) { exp.eyes = 'squeeze'; exp.brows = 'down'; exp.mouth = 'big'; }
  else if (t < 25.0) { look = [1, 0.8]; exp.brows = 'worried'; exp.mouth = 'side'; blush = 0.5; }
  else if (t < 26.9) { look = [1, 0.9]; exp.brows = 'up'; exp.mouth = 'small'; }
  else if (t < 31.0) { look = [1, 0.3]; exp.brows = 'up'; exp.mouth = t > 29 ? 'smile' : 'small'; }
  else if (t < 32.0) { look = [0.3, 1]; exp.brows = 'up'; exp.mouth = 'o'; }
  else if (t < 33.6) { exp.eyes = 'happy'; exp.brows = 'flat'; exp.mouth = 'open'; blush = 0.8; }
  else if (t < 38.4) { look = [-0.8, -1]; exp.brows = 'up'; exp.mouth = t < 35.4 ? 'o' : 'open'; blush = 0.3; }
  else if (t < 40.4) { look = [1, 0]; exp.brows = 'flat'; exp.mouth = 'smile'; }
  else if (t < 43.8) { look = [1, -0.2]; exp.brows = 'flat'; exp.mouth = 'open'; }
  else { exp.eyes = 'closed'; exp.brows = 'flat'; exp.mouth = 'smile'; blush = 0.7; }
  return { who: 'p', x, hy, hands, exp, look, blush, lean, cold,
    mdraw: pr(t, 27.5, 29.3), mfill: pr(t, 29.3, 30.7), mreal: t >= 30.8 ? back(pr(t, 30.8, 31.2)) : 0 };
}
// Papa's body; returns the world outline of the drawn muffler (Tara's crayon follows it)
function drawPapa(C, s, sd) {
  const hip = [s.x, s.hy + HIPY];
  const rot = ([x, y]) => { if (!s.lean) return [x, y]; const c = Math.cos(s.lean), si = Math.sin(s.lean), dx = x - hip[0], dy = y - hip[1]; return [hip[0] + dx * c - dy * si, hip[1] + dx * si + dy * c]; };
  const P = (dx, dy) => rot([s.x + dx, s.hy + dy]);
  const tp = pts => pts.map(([dx, dy]) => P(dx, dy));
  const k = 62 / 50;
  const skin = { col: K.peach, p: 0.6, gap: 7, w: 9, ang: 0.5, seed: sd + 1 };
  // legs (trousers) and shoes — they don't lean
  for (const sg of [-1, 1]) {
    part(C, tube([[s.x + sg * 34, s.hy + HIPY - 10], [s.x + sg * 38, s.hy + 540], [s.x + sg * 40, s.hy + 712]], 60, 50), { col: K.brown, p: 0.75, gap: 8, w: 9, ang: 1.3, seed: sd + 2 + sg }, { w: 6, seed: sd + 4 + sg });
    const fx = s.x + sg * 40;
    part(C, smooth([[fx - 34, s.hy + 700], [fx + sg * 10 + 30, s.hy + 700], [fx + sg * 30 + 28, s.hy + 728], [fx - 36, s.hy + 732]], 4), { col: K.dark, p: 0.92, gap: 5, w: 7, seed: sd + 6 + sg }, { w: 5, seed: sd + 8 + sg });
  }
  // neck, sweater
  part(C, tp([[-15, 44], [15, 44], [16, 74], [-16, 74]]), skin, { w: 4.5, seed: sd + 10 });
  part(C, tp(smooth([[-18, 60], [18, 60], [72, 86], [84, 160], [80, HIPY + 6], [-80, HIPY + 6], [-84, 160], [-72, 86]], 3)), { col: K.violet, p: 0.75, gap: 9, w: 10, ang: 0.9, seed: sd + 11, cross: true, crossP: 0.5 }, { w: 6.5, seed: sd + 12 });
  line(C.l, tp([[-20, 62], [0, 100], [20, 62]]), { w: 5, seed: sd + 13 });
  line(C.l, tp([[-78, HIPY - 22], [78, HIPY - 22]]), { w: 4, seed: sd + 14, p: 0.6 });
  for (let i = 0; i < 3; i++) line(C.l, tp([[-60, 150 + i * 50], [-40, 165 + i * 50], [-20, 150 + i * 50]]), { w: 3, seed: sd + 15 + i, p: 0.35 });
  // ears: they go red in the cold (colouring is an action)
  for (const sg of [-1, 1]) {
    part(C, tp(handCircle(sg * 61, 8, 16, sd + 20 + sg, 0, 16)), skin, { w: 5, seed: sd + 22 + sg });
    if (s.cold > 0) fill(C.f, tp(handCircle(sg * 61, 8, 14, sd + 24 + sg, 0, 16)), { col: K.red, p: 0.9, gap: 4, w: 6, seed: sd + 26 + sg, draw: s.cold, over: 2 });
  }
  part(C, tp(handCircle(0, 0, 62, sd + 30, 0.05, 44)), skin, { w: 6, seed: sd + 31 });
  part(C, tp(smooth([[-63, -2], [-62, -42], [-40, -68], [0, -76], [40, -68], [62, -42], [63, -2], [50, -32], [24, -44], [-6, -40], [-30, -46], [-52, -30]], 5)), { col: K.dark, p: 0.97, gap: 6, w: 9, ang: 1.0, seed: sd + 32 }, { w: 5.5, seed: sd + 33 });
  face(C, tp, s, sd, k);
  // nose (red tip in the cold) and moustache
  line(C.l, tp(smooth([[2, 0], [8, 12], [0, 16]], 4, false)), { w: 4, seed: sd + 70 });
  if (s.cold > 0) dab(C.f, ...tp([[4, 12]])[0], 7, { col: K.red, p: 0.8 * s.cold, seed: sd + 71 });
  part(C, tp(smooth([[-28, 26], [-6, 18], [0, 21], [6, 18], [28, 26], [18, 30], [0, 26], [-18, 30]], 4)), { col: K.dark, p: 0.95, gap: 4, w: 6, seed: sd + 72 }, { w: 4, seed: sd + 73 }, { occ: false });
  // the muffler Tara draws on him
  let path = null;
  if (s.mdraw > 0) {
    const kk = s.mreal > 0 && s.mreal < 1.2 ? 1 + 0.12 * Math.sin(Math.PI * clamp(s.mreal)) : 1;
    const M = pts => tp(pts.map(([px, py]) => [px * kk, 74 + (py - 74) * kk]));
    const band = M(smooth([[-66, 52], [0, 66], [66, 52], [72, 94], [0, 108], [-72, 94]], 4));
    const tail = M(smooth([[20, 96], [54, 92], [66, 200], [70, 290], [36, 294], [30, 190]], 4));
    const stripes = [M([[-46, 56], [-50, 100]]), M([[-14, 63], [-14, 106]]), M([[18, 63], [20, 106]]), M([[48, 56], [52, 100]]),
      M([[28, 160], [64, 154]]), M([[32, 230], [68, 226]])];
    const fringe = [0, 1, 2, 3].map(i => [M([[38 + i * 10, 294]])[0], M([[38 + i * 10, 322]])[0]]);
    muffler(C, band, tail, { c1: K.teal, c2: K.yellow, sd: sd + 400, draw: s.mdraw, fill: s.mfill, real: s.mreal, stripes, fringe });
    path = [...band, ...tail];
  }
  // arms + hands
  const hd = arms(C, s, P(-70, 96), P(70, 96), 128, 120, 36, 30, K.violet, sd);
  for (const side of ['L', 'R']) part(C, handCircle(hd[side][0], hd[side][1], 18, sd + 160 + (side === 'L' ? 0 : 1), 0, 18), skin, { w: 5, seed: sd + 162 + (side === 'L' ? 0 : 1) });
  s.mouth = P(0, 34);
  return path;
}

// ——— Tara ———
function tPos(t) {
  const hop = (u, x0, x1, y0, y1, hgt) => [lerp(x0, x1, eio(u)), lerp(y0, y1, eio(u)) - hgt * Math.sin(Math.PI * u)];
  if (t < 26.3) return [1010, GROUND];
  if (t < 26.8) return hop(pr(t, 26.3, 26.8), 1010, 960, GROUND, SEAT, 90);
  if (t < 38.8) return [960, SEAT];
  if (t < 39.4) return hop(pr(t, 38.8, 39.25), 960, 1110, SEAT, GROUND, 60);
  if (t < 39.9) return hop(pr(t, 39.4, 39.85), 1110, 1275, GROUND, GROUND, 70);
  return null;
}
const REST_T = [-50, 196, 50, 196];
const tHands = track([
  [0, [-24, 66, 24, 68]], [2.2, [-24, 66, 24, 68]], [2.6, REST_T], [16.8, REST_T], [17.2, [-14, 120, 22, 136]], [18.1, [-14, 120, 22, 136]],
  [18.5, [-118, 6, 30, 140]], [19.7, [-118, 6, 30, 140]], [20.0, REST_T], [23.8, REST_T], [24.0, [-12, 62, 50, 196]], [24.4, [-12, 82, 50, 196]], [24.7, REST_T],
  [25.3, REST_T], [25.5, [-42, 196, 50, 196]], [25.8, [-42, 196, 50, 196]], [26.1, [-70, -24, 50, 196]], [26.3, [-70, -24, 50, 196]], [26.5, [-90, 110, 90, 110]], [26.8, [-90, 110, 90, 110]],
  [27.0, [-110, 40, 50, 196]], [27.15, [-80, 80, 50, 196]], [27.3, [-110, 40, 50, 196]],
  [30.8, [-110, 40, 50, 196]], [31.2, [-20, 150, 20, 150]], [33.4, [-20, 150, 20, 150]], [33.8, [-100, -96, 50, 196]], [35.4, [-100, -96, 50, 196]],
  [35.8, [-24, 60, 24, 60]], [36.6, [-24, 60, 24, 60]], [37.0, REST_T], [38.7, REST_T], [38.85, [-90, 110, 90, 110]], [39.9, [-90, 110, 90, 110]],
]);
const mTopT = track([[0, [10]], [2.2, [10]], [2.6, [22]], [19.8, [22]], [21.6, [2]], [23.9, [2]], [24.4, [30]], [48.5, [30]]]);
function tara(t, pPath) {
  const pos = tPos(t); if (!pos) return null;
  const tq = q2(t), x = pos[0], hy = pos[1] - THT;
  const h = tHands(tq);
  const hands = { L: [x + h[0], hy + h[1]], R: [x + h[2], hy + h[3]] };
  // drawing the muffler on Papa: her crayon follows the line, then scribbles the colour in
  let tip = null;
  if (pPath && t >= 27.5 && t < 30.7) {
    const L = pathLen(pPath);
    if (t < 29.3) tip = pathAt(pPath, L, pr(t, 27.5, 29.3) * 0.999);
    else { const u = pr(tq, 29.3, 30.7), a = pathAt(pPath, L, 0.08 + 0.3 * u), b = pathAt(pPath, L, 0.5 - 0.3 * u), w = 0.5 + 0.5 * Math.sin(tq * 28); tip = [lerp(a[0], b[0], w), lerp(a[1], b[1], w)]; }
    const ang = -2.4; hands.L = [tip[0] - Math.cos(ang) * 46, tip[1] - Math.sin(ang) * 46];
  }
  if (t >= 33.9 && t < 35.4) { const a = q2(t) * 9; hands.L = [hands.L[0] + Math.cos(a) * 12, hands.L[1] + Math.sin(a) * 12]; }   // drawing the sun in the air
  if (t >= 35.8 && t < 36.6) { const c = Math.abs(Math.sin(tq * 14)) * 22; hands.L[0] -= c; hands.R[0] += c; }                        // claps
  const exp = { eyes: 'open', brows: 'flat', mouth: 'smile' }; let look = [-0.7, -0.8], blush = 0;
  if (t < 1.2) { look = [-0.4, -0.9]; exp.eyes = t > 0.85 && t < 1.0 ? 'closed' : 'open'; }
  else if (t < 2.2) { look = [0, 0]; exp.eyes = t > 1.55 && t < 1.7 ? 'closed' : 'open'; }
  else if (t < 9.8) { look = [-1, -1]; }
  else if (t < 14.6) { look = [-1, -0.9]; }
  else if (t < 16.8) { look = [-1, -1]; exp.brows = 'worried'; exp.mouth = 'small'; }
  else if (t < 18.2) { look = [0, 1]; exp.brows = 'puzzled'; exp.mouth = 'side'; }
  else if (t < 19.8) { look = [-1, -1]; exp.brows = 'up'; exp.mouth = 'smile'; }
  else if (t < 21.8) { exp.eyes = 'squeeze'; exp.brows = 'down'; }
  else if (t < 23.0) { look = [-1, -1]; exp.eyes = 'half'; exp.brows = 'puzzled'; }
  else if (t < 25.0) { look = [-1, -1]; exp.eyes = 'half'; exp.brows = 'down'; exp.mouth = 'flat'; }
  else if (t < 26.3) { look = [0, -1]; exp.brows = 'up'; exp.mouth = 'open'; }
  else if (t < 27.4) { look = [-1, -0.5]; exp.brows = 'up'; exp.mouth = 'smile'; }
  else if (t < 30.8) { look = [-1, -0.2]; exp.brows = 'down'; exp.mouth = 'tongue'; }
  else if (t < 33.6) { exp.eyes = 'happy'; exp.mouth = 'open'; blush = 0.7; }
  else if (t < 35.6) { look = [-1, -1]; exp.brows = 'down'; exp.mouth = 'tongue'; }
  else if (t < 38.8) { exp.eyes = 'happy'; exp.mouth = 'open'; blush = 0.6; }
  else { look = [1, 0]; exp.mouth = 'open'; }
  const items = [];
  if (t >= 25.75 && t < 38.8) items.push({ type: 'crayon', side: 'L', ang: tip ? -2.4 : -2.0, col: K.teal });
  return { who: 't', x, hy, hands, exp, look, blush, items, mTop: mTopT(tq)[0], offer: t >= 18.3 && t < 19.9, tip };
}
function drawTara(C, s, sd, t) {
  const P = (dx, dy) => [s.x + dx, s.hy + dy];
  const tp = pts => pts.map(([dx, dy]) => P(dx, dy));
  const k = 56 / 50;
  const skin = { col: K.peach, p: 0.6, gap: 7, w: 9, ang: 0.5, seed: sd + 1 };
  const feet = s.hy + THT, air = Math.abs(feet - GROUND) > 4 && Math.abs(feet - SEAT) > 4;
  // legs, socks, shoes
  for (const sg of [-1, 1]) {
    const fx = sg * (air ? 30 : 20);
    part(C, tube(tp([[sg * 18, 220], [fx, 318]]), 24, 22), skin, { w: 4.5, seed: sd + 2 + sg });
    part(C, tube(tp([[fx, 312], [fx, 396]]), 24, 23), { col: K.white, p: 0.85, gap: 5, w: 6, seed: sd + 4 + sg }, { w: 4.5, seed: sd + 6 + sg });
    part(C, smooth(tp([[fx - 22, 392], [fx + 6 + sg * 10, 390], [fx + sg * 26 + 4, 410], [fx - 24, 414]]), 4), { col: K.dark, p: 0.95, gap: 4, w: 6, seed: sd + 8 + sg }, { w: 4.5, seed: sd + 10 + sg });
  }
  // skirt, sweater
  part(C, tp(smooth([[-40, 160], [40, 160], [62, 232], [0, 240], [-62, 232]], 3)), { col: K.navy, p: 0.85, gap: 7, w: 9, ang: 1.1, seed: sd + 12 }, { w: 5.5, seed: sd + 13 });
  for (let i = 0; i < 3; i++) line(C.l, tp([[-30 + i * 30, 172], [-40 + i * 40, 230]]), { w: 3, seed: sd + 14 + i, p: 0.5 });
  part(C, tp(smooth([[-18, 50], [18, 50], [40, 64], [46, 140], [44, 176], [-44, 176], [-46, 140], [-40, 64]], 3)), { col: K.green, p: 0.8, gap: 8, w: 9, ang: 0.9, seed: sd + 17, cross: true, crossP: 0.45 }, { w: 6, seed: sd + 18 });
  // plaits with red ribbons
  for (const sg of [-1, 1]) {
    part(C, tube(tp([[sg * 46, -6], [sg * 58, 50], [sg * 60, 104]]), 24, 18), { col: K.dark, p: 0.95, gap: 5, w: 7, ang: 1.2, seed: sd + 20 + sg }, { w: 4.5, seed: sd + 22 + sg });
    part(C, tp([[sg * 60, 104], [sg * 60 - 22, 92], [sg * 60 - 20, 124], [sg * 60, 112], [sg * 60 + 20, 124], [sg * 60 + 22, 92]]), { col: K.red, p: 0.95, gap: 4, w: 6, seed: sd + 26 + sg }, { w: 4, seed: sd + 28 + sg });
  }
  // neck, ears, head, fringe, hair clips
  part(C, tp([[-10, 38], [10, 38], [11, 56], [-11, 56]]), skin, { w: 4.5, seed: sd + 30 });
  for (const sg of [-1, 1]) part(C, tp(handCircle(sg * 54, 8, 11, sd + 31 + sg, 0, 14)), skin, { w: 4.5, seed: sd + 33 + sg });
  part(C, tp(handCircle(0, 0, 56, sd + 35, 0.06, 44)), skin, { w: 6, seed: sd + 36 });
  part(C, tp(smooth([[-58, 2], [-54, -42], [-26, -66], [0, -62], [28, -66], [54, -42], [58, 2], [44, -22], [24, -26], [8, -36], [-8, -28], [-28, -32], [-44, -18]], 5)), { col: K.dark, p: 0.97, gap: 6, w: 9, ang: 1.0, seed: sd + 37 }, { w: 5.5, seed: sd + 38 });
  for (const sg of [-1, 1]) dab(C.l, ...tp([[sg * 40, -54]])[0], 7, { col: K.red, p: 1, seed: sd + 39 + sg });
  face(C, tp, s, sd, k);
  // Papa's muffler (red + yellow): wrapped up to her nose; the tail hangs, or she holds it out to him
  const top = s.mTop, sw = Math.sin(q2(t) * 2.4) * 8;
  const band = tp(smooth([[-56, top], [0, top + 8], [56, top], [54, 78], [0, 86], [-54, 78]], 4));
  const stripes = [tp([[-36, top + 4], [-36, 82]]), tp([[-8, top + 7], [-8, 86]]), tp([[22, top + 6], [22, 84]]), tp([[46, top + 2], [46, 78]])];
  let tail, fringe = [];
  if (s.offer) {
    const hdl = s.hands.L, a = P(-30, 74), mid = [lerp(a[0], hdl[0], 0.5), Math.max(a[1], hdl[1]) + 40];
    tail = tube(curveP([a, mid, hdl]), 34, 30);
    stripes.push(...[0.35, 0.7].map(u => { const p0 = qb(a, mid, hdl, u); return [[p0[0] - 12, p0[1] - 14], [p0[0] + 12, p0[1] + 14]]; }));
  } else {
    tail = tp(smooth([[22, 72], [52, 70], [66 + sw, 200], [70 + sw, 300], [40 + sw, 304], [30, 190]], 4));
    stripes.push(tp([[30, 160], [64 + sw * 0.6, 154]]), tp([[34, 240], [68 + sw, 236]]));
    fringe = [0, 1, 2, 3].map(i => [P(44 + i * 8 + sw, 304), P(42 + i * 8 + sw, 326)]);
  }
  muffler(C, band, tail, { c1: K.red, c2: K.yellow, sd: sd + 300, stripes, fringe });
  // arms (sweater), held items, hands
  const hd = arms(C, s, P(-36, 70), P(36, 70), 70, 64, 22, 18, K.green, sd);
  for (const it of s.items) if (it.type === 'crayon') crayonItem(C, hd[it.side], it.ang, it.col, sd + 140);
  for (const side of ['L', 'R']) part(C, handCircle(hd[side][0], hd[side][1], 12, sd + 160 + (side === 'L' ? 0 : 1), 0, 16), skin, { w: 4.5, seed: sd + 162 + (side === 'L' ? 0 : 1) });
}
const qb = (a, b, c, u) => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * b[0] + u * u * c[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * b[1] + u * u * c[1]];
const curveP = ([a, b, c]) => { const o = []; for (let i = 0; i <= 10; i++) o.push(qb(a, b, c, i / 10)); return o; };
function pathLen(p) { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; }
function pathAt(p, L, u) { let acc = 0; const tgt = L * u; for (let i = 1; i < p.length; i++) { const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); if (acc + d >= tgt) { const v = (tgt - acc) / d; return [lerp(p[i - 1][0], p[i][0], v), lerp(p[i - 1][1], p[i][1], v)]; } acc += d; } return p[p.length - 1]; }

// ——— breath puffs, "!", sneeze, sparkle ———
const PUFFS = [[3.0, 'p'], [4.1, 'p'], [6.2, 't'], [9.6, 'p'], [11.9, 'p'], [13.9, 'p'], [14.6, 'p'], [17.2, 'p'], [19.0, 'p'], [24.3, 'p'], [25.9, 'p']];
function drawPuffs(L, t, pm, tm) {
  for (const [t0, who] of PUFFS) {
    const a = (t - t0) / 1.5; if (a < 0 || a > 1) continue;
    const m = who === 'p' ? pm : tm; if (!m) continue;
    const dir = who === 'p' ? (t0 > 13.5 && t0 < 15 ? [0, 1] : [1, -0.5]) : [-0.6, -1];
    for (let i = 0; i < 3; i++) {
      const c = [m[0] + dir[0] * (30 + 90 * a) + (i - 1) * 16 * (1 + a), m[1] + dir[1] * (30 + 90 * a) - 40 * a - i * 8];
      const r = (12 + 22 * a) * (1 - 0.2 * i);
      const ring = handCircle(c[0], c[1], r, 800 + t0 * 10 + i, 0.05, 18);
      fill(L, ring, { col: K.white, p: 0.9 * (1 - a), gap: 5, w: 7, seed: 820 + i });
      line(L, ring, { w: 3.5, col: K.grey, p: 0.55 * (1 - a), seed: 830 + i + t0 });
    }
  }
}
function drawSneeze(L, t, m) {
  if (t < 23.25 || t > 24.1 || !m) return;
  const k = back(pr(t, 23.25, 23.45)) * (1 - pr(t, 23.9, 24.1));
  wtext(L, 'आ-छीं!', m[0] - 40, m[1] - 150, { size: 96 * k + 1, weight: 700, seed: 840, stroke: 2.5, col: K.red });
  for (let i = 0; i < 7; i++) { const a = -2.3 + i * 0.32, r0 = 60, r1 = 60 + 70 * k; line(L, [[m[0] + Math.cos(a) * r0, m[1] + Math.sin(a) * r0 + 30], [m[0] + Math.cos(a) * r1, m[1] + Math.sin(a) * r1 + 30]], { w: 5, col: K.ink, seed: 850 + i }); }
}
function drawIdea(L, t, s) {
  if (!s || t < 25.0 || t > 26.3) return;
  const k = back(pr(t, 25.0, 25.25)) * (1 - pr(t, 26.0, 26.3));
  wtext(L, '!', s.x + 4, s.hy - 90, { size: 120 * k + 1, weight: 700, seed: 860, stroke: 3, col: K.orange });
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * 0.5; line(L, [[s.x + Math.cos(a) * 120, s.hy - 120 + Math.sin(a) * 40], [s.x + Math.cos(a) * (120 + 40 * k), s.hy - 120 + Math.sin(a) * (40 + 40 * k)]], { w: 5, col: K.yellow, seed: 870 + i }); }
}
function drawPop(L, t, path) {
  if (!path || t < 30.8 || t > 31.8) return;
  const u = pr(t, 30.8, 31.8), c = pathAt(path, pathLen(path), 0.25);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + 0.3, r0 = 110 + 90 * u, r1 = r0 + 40 * (1 - u);
    line(L, [[c[0] + Math.cos(a) * r0, c[1] + Math.sin(a) * r0], [c[0] + Math.cos(a) * r1, c[1] + Math.sin(a) * r1]], { w: 6, col: i % 2 ? K.yellow : K.orange, seed: 880 + i }); }
}

// ——— printed words (top of the frame, on a ragged paper knock-out) ———
const SUBY = 330;
function subTo(t) {
  const S = SUBS.find(s => t >= s.t0 && t < s.t1); if (!S) return;
  const rv = pr(t, S.t0, S.t0 + 0.6);
  const g = SUBK.g; g.save(); g.font = '400 54px Kalam'; const tw = g.measureText(S.text).width; g.restore();
  const cx = 540, cy = SUBY, hw = Math.min(tw / 2 + 40, 525), hh = 50;
  g.save(); g.fillStyle = '#000'; g.beginPath();
  for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 2; const px = Math.cos(a), py = Math.sin(a); const sq = Math.pow(Math.abs(px), 0.3) * Math.sign(px); const nn = 1 + 0.06 * Math.sin(a * 7 + 1.3) + 0.03 * Math.sin(a * 17); const X = cx + sq * hw * nn, Y = cy + py * hh * nn; i ? g.lineTo(X, Y) : g.moveTo(X, Y); }
  g.closePath(); g.fill(); g.restore();
  wtext(SUBT, S.text, cx, cy + 16, { screen: true, size: 54, col: K.ink, reveal: rv, seed: 11 + S.t0 * 3, p: 1, stroke: 1.4 });
}
export const TEXTS = t => { const S = SUBS.find(s => t >= s.t0 && t < s.t1); return S ? [{ id: 's' + S.t0, text: S.text, x0: 30, y0: SUBY - 55, x1: 1050, y1: SUBY + 55 }] : []; };
// end card: "अगला पन्ना कल" + handle, written in crayon on the page
function endCard(L, t) {
  if (t < 45.7) return;
  // a torn paper card behind the words
  const g = SUBK.g, cx = sx(900), cy = sy(1350), hw = 520 * CAM.s * ss(pr(t, 45.7, 46.0)), hh = 200 * CAM.s;
  g.save(); g.fillStyle = '#000'; g.beginPath();
  for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 2; const px = Math.cos(a), py = Math.sin(a); const sq = Math.pow(Math.abs(px), 0.3) * Math.sign(px); const nn = 1 + 0.05 * Math.sin(a * 7 + 0.3) + 0.03 * Math.sin(a * 17); const X = cx + sq * hw * nn, Y = cy + py * hh * nn; i ? g.lineTo(X, Y) : g.moveTo(X, Y); }
  g.closePath(); g.fill(); g.restore();
  if (t < 45.9) return;
  wtext(L, 'अगला पन्ना कल', 900, 1280, { size: 128, weight: 700, reveal: pr(t, 45.9, 46.9), seed: 890, stroke: 2.5, col: K.ink });
  wtext(L, '@pannapalatkahani', 900, 1440, { size: 70, weight: 700, reveal: pr(t, 46.8, 47.6), seed: 891, stroke: 1.5, col: K.red });
  if (t > 47.6) line(L, smooth([[640, 1475], [900, 1490], [1160, 1470]], 6, false), { w: 7, col: K.orange, seed: 892, draw: pr(t, 47.6, 48.0) });
}

// ——— events for the mixer ———
export const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
ev(0, 'amb', { kind: 'winter' });
ev(2.2, 'chatter', { dur: 2.5, pan: -0.2 }); ev(17.0, 'chatter', { dur: 1.1, pan: -0.2 });
PUFFS.forEach(([t0, who]) => ev(t0, 'puff', { pan: who === 'p' ? -0.25 : 0.25 }));
ev(TITLE_T[0], 'write', { dur: TITLE_T[1] - TITLE_T[0], pan: 0 });
ev(10.0, 'tick', { pan: -0.2 }); ev(15.2, 'rub', { dur: 1.2, pan: -0.2 });
ev(17.1, 'cloth', { pan: 0.2 }); ev(18.4, 'cloth', { pan: 0.1 }); ev(20.4, 'wrap', { dur: 1.2, pan: 0.15 }); ev(21.9, 'proud');
ev(22.95, 'inhale'); ev(23.3, 'sneeze', { pan: -0.2 }); ev(23.25, 'silence', { dur: 1.6 }); ev(24.0, 'cloth', { pan: 0.2 });
ev(25.0, 'ding'); ev(25.5, 'cloth', { pan: 0.2 }); ev(26.3, 'hop', { pan: 0.2 }); ev(26.8, 'land', { pan: 0.1 });
ev(27.5, 'write', { dur: 1.8, pan: -0.1 }); ev(29.3, 'scribble', { dur: 1.4, pan: -0.1 }); ev(30.8, 'magic');
ev(33.9, 'write', { dur: 0.8, pan: -0.5 }); ev(34.6, 'scribble', { dur: 0.7, pan: -0.5 }); ev(35.1, 'rays', { dur: 0.5 }); ev(35.8, 'clap', { dur: 0.8 });
ev(36.9, 'engine', { dur: 8.0 }); ev(38.3, 'horn'); ev(38.9, 'brake');
ev(38.8, 'hop', { pan: 0.3 }); ev(39.25, 'land', { pan: 0.3 }); ev(39.4, 'hop', { pan: 0.4 }); ev(39.85, 'land', { pan: 0.5 });
ev(42.4, 'horn'); ev(42.6, 'depart', { dur: 2.4 });
ev(45.9, 'write', { dur: 1.0 }); ev(46.8, 'write', { dur: 0.8 });
[['A', 0], ['T', 4.8], ['B', 8.6], ['C', 17.5], ['S', 22.9], ['D', 25.0], ['E', 33.5], ['F', 38.5], ['Z', 45.5]].forEach(([id, t]) => ev(t, 'cue', { id }));

// ——— one frame ———
export function frame(comp, t) {
  [CAM.x, CAM.y, CAM.s] = camT(t);
  BOIL.amp = 1;
  clearGroup(BUS); clearGroup(PROPS); clearGroup(PA); clearGroup(TA);
  [BG.f, BG.l, FOGF, SKY, FOGN, WASH, FX, SUBK, SUBT].forEach(clear);
  drawBG(t);
  drawFog(FOGF, t, false);
  drawLampGlow(SKY, t);
  drawSun(t);
  drawBus(t, t >= 40.3 && t < 44.8);
  drawProps();
  const ps = papa(t);
  const path = drawPapa(PA, ps, 2000);
  const ts = tara(t, path);
  if (ts) drawTara(TA, ts, 1000, t);
  drawPuffs(FX, t, ps.mouth, ts ? [ts.x, ts.hy + 50] : null);
  drawSneeze(FX, t, ps.mouth);
  drawIdea(FX, t, ts);
  drawPop(FX, t, path);
  drawFog(FOGN, t, true);
  endCard(SUBT, t);
  if (!NOSUBS) subTo(t);
  // golden morning once the fog melts
  const gold = ss(pr(t, 35.4, 37.6));
  if (gold > 0) { const g = WASH.g; g.save(); g.fillStyle = '#000'; g.globalAlpha = 0.32 * gold; g.fillRect(0, 0, W, H); g.restore(); }
  // composite: paper → page → fog (white crayon) → sky (sun, lamp) → morning wash → bus → props → people → near fog → effects → words
  comp.paperCam(CAM.x * 0.6, CAM.y * 0.6, CAM.s / 0.6);
  comp.begin();
  comp.crayon(BG.f.c); comp.crayon(BG.l.c);
  const go = [hash(BOIL.step) * 300, hash(BOIL.step + 7) * 300];
  comp.crayon(FOGF.c, { goff: go });
  comp.crayon(SKY.c, { goff: go });
  if (gold > 0) comp.wash(WASH.c, { color: [1.0, 0.86, 0.6], edge: 0.2, resist: 0.6 });
  comp.group(BUS, { goff: go });
  comp.group(PROPS, { goff: go });
  comp.group(PA, { goff: go }); comp.group(TA, { goff: go });
  comp.crayon(FOGN.c, { goff: go });
  comp.crayon(FX.c, { goff: go });
  comp.knock(SUBK.c); comp.crayon(SUBT.c);
  comp.finish({ vig: 0.26 });
}
export function testFrame(comp, t) { frame(comp, t); }
