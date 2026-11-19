// अर्जुन का डांस — Arjun's Dance. Crayon picture book, vertical 1080×1920, 24 fps. Ep 3, for 20 Nov 2026 (shaadi season opens).
// One page (world 1800×3200), one camera. A sangeet night under a striped shamiana: the card says Arjun will dance; he can't.
// Meera throws her red crayon, it runs across the floor drawing numbered footprints; he steps on them and every one lights up.
import { layer, clear, line, fill, dab, handCircle, smooth, CAM, BOIL, W, H, sx, sy } from './crayon.js';
import { group, clearGroup, part, tube } from './rig.js';
import { clamp, lerp, hash, track, ss, eio, eo, ei, back } from '/core/lib.js';

export const DUR = 46.0;
const NOSUBS = new URLSearchParams(location.search).get('nosubs') === '1';   // comic stills: no printed words in the frame
const K = { ink: '#2d3263', yellow: '#f5c63c', orange: '#ec8a3c', red: '#d4483c', pink: '#ee8ea4', peach: '#f4c7a4', brown: '#7a4b31',
  ochre: '#e7b867', green: '#62a24c', teal: '#4fb3a9', violet: '#6a5aa6', white: '#fbfaf4', grey: '#8d90a8', navy: '#3d4b86', dark: '#3a3340',
  magenta: '#c4467e', maroon: '#8e2f45', cream: '#fbeec8' };
const pr = (t, a, b) => clamp((t - a) / (b - a));
const q2 = t => Math.floor(t * 12 + 1e-6) / 12;  // drawn things act on twos
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const GY = 2650;                                 // where the dancers stand (stage floor)
const AH = 680;                                  // feet → head centre (adults)
const BEAT = 0.5;                                // 120 bpm
const D0 = 26.4;                                 // the dance starts (first footprint)

// ——— printed words (also the voice script: N = narrator, A = Arjun, M = Meera) ———
export const SUBS = [
  { t0: 0.0, t1: 4.9, text: 'शादी का कार्ड आया… और अर्जुन के होश उड़ गए!', who: 'N', vo: 'n1', vt: 0.15 },
  { t0: 6.4, t1: 10.2, text: 'अर्जुन को एक भी स्टेप नहीं आता था।', who: 'N', vo: 'n2', vt: 6.4 },
  { t0: 13.6, t1: 16.3, text: '“मैं तो बस खाना खाने आया था!”', who: 'A', vo: 'a1', vt: 13.6 },
  { t0: 16.8, t1: 19.6, text: 'पर मीरा के पास क्रेयॉन थे।', who: 'N', vo: 'n3', vt: 16.8 },
  { t0: 24.5, t1: 26.4, text: '“बस निशानों पे पैर रखो!”', who: 'M', vo: 'm1', vt: 24.6 },
  { t0: 37.6, t1: 42.8, text: 'डांस आए न आए… पार्टनर सही होना चाहिए!', who: 'N', vo: 'n4', vt: 37.6 },
];
const TITLE = 'अर्जुन का डांस', TITLE_T = [3.4, 5.0];

// ——— camera: [x, y, scale] ———
const camT = track([
  [0, [720, 2075, 2.5]], [2.5, [720, 2075, 2.5]], [3.9, [900, 1950, 0.64]], [6.0, [900, 1960, 0.64]],
  [7.0, [760, 2330, 1.3]], [12.9, [760, 2330, 1.3]], [13.5, [740, 2150, 1.75]], [15.6, [740, 2150, 1.75]],
  [16.4, [1360, 2160, 1.35]], [19.4, [1360, 2160, 1.35]], [20.2, [1060, 2470, 1.18]], [26.0, [1060, 2470, 1.18]],
  [30.6, [1060, 2360, 1.1]], [32.0, [1130, 2250, 0.86]], [36.6, [1130, 2250, 0.86]], [37.6, [1250, 2150, 1.45]], [42.4, [1250, 2150, 1.45]],
  [44.0, [900, 1600, 0.56]], [46.0, [900, 1600, 0.56]],
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
const BG = { f: layer(), l: layer() }, LIGHTS = layer(), FP = group(), CARD = group(), ME = group(), AR = group(), CROWD = group(),
  FX = layer(), WASH = layer(), SUBK = layer(), SUBT = layer();

// ——— the page: shamiana, drapes, marigolds, stage floor, speakers ———
function drawBG(t) {
  const B = BG;
  // canopy: red/yellow stripes fanning out from the top
  const top = [900, 380], y1 = 1130;
  for (let i = 0; i < 14; i++) {
    const xa = -100 + i * 143, xb = xa + 143;
    fill(B.f, [top, [xb, y1], [xa, y1]], { col: i % 2 ? K.yellow : K.red, p: 0.78, gap: 10, w: 12, ang: 1.2, seed: 10 + i, boil: 0 });
    line(B.l, [top, [xa, y1]], { w: 4, seed: 30 + i, p: 0.45, boil: 0.5 });
  }
  // scalloped edge
  const sc = []; for (let i = 0; i <= 14; i++) { const x0 = -100 + i * 143; for (let k = 0; k <= 6; k++) { const u = k / 6; sc.push([x0 + 143 * u, y1 + 46 * Math.sin(Math.PI * u)]); } }
  fill(B.f, [...sc, [1900, y1 - 20], [-100, y1 - 20]], { col: K.red, p: 0.85, gap: 8, w: 10, seed: 50, boil: 0 });
  line(B.l, sc, { w: 6, seed: 51, p: 0.8, boil: 0.6 });
  // drapes behind the stage (magenta with pink folds)
  fill(B.f, rect(100, 1150, 1700, 2350), { col: K.magenta, p: 0.55, gap: 12, w: 13, ang: 1.45, seed: 60, boil: 0 });
  for (let i = 0; i < 12; i++) { const x = 160 + i * 130; line(B.l, smooth([[x, 1160], [x + 14, 1500], [x - 10, 1900], [x + 8, 2340]], 6, false), { w: 5, col: K.maroon, seed: 61 + i, p: 0.5, boil: 0.5 }); }
  for (let i = 0; i < 6; i++) { const x = 220 + i * 270; fill(B.f, rect(x, 1160, x + 60, 2340), { col: K.pink, p: 0.32, gap: 10, w: 11, ang: 1.5, seed: 80 + i, boil: 0 }); }
  // banner: संगीत
  line(B.l, [[700, 1180], [700, 1420]], { w: 4, seed: 90, p: 0.7, boil: 0.5 }); line(B.l, [[1100, 1180], [1100, 1420]], { w: 4, seed: 91, p: 0.7, boil: 0.5 });
  fill(B.f, rect(620, 1410, 1180, 1580), { col: K.yellow, p: 0.9, gap: 8, w: 10, seed: 92, boil: 0 });
  line(B.l, [...rect(620, 1410, 1180, 1580), [620, 1410]], { w: 7, col: K.maroon, seed: 93, p: 0.9, boil: 0.6 });
  wtext(B.l, 'संगीत', 900, 1535, { size: 110, weight: 700, seed: 94, stroke: 2, col: K.red, boil: 0.6 });
  // stage floor: a checker in perspective
  const bk = [[260, 2330], [1540, 2330]], fr = [[40, 2800], [1760, 2800]];
  fill(B.f, [bk[0], bk[1], fr[1], fr[0]], { col: K.ochre, p: 0.55, gap: 12, w: 13, ang: 0.1, seed: 100, boil: 0 });
  const yr = [2330, 2410, 2505, 2620, 2800];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 10; c++) {
    if ((r + c) % 2) continue;
    const xA = (y, u) => { const v = (y - 2330) / 470; return lerp(lerp(260, 40, v), lerp(1540, 1760, v), u); };
    const q = [[xA(yr[r], c / 10), yr[r]], [xA(yr[r], (c + 1) / 10), yr[r]], [xA(yr[r + 1], (c + 1) / 10), yr[r + 1]], [xA(yr[r + 1], c / 10), yr[r + 1]]];
    fill(B.f, q, { col: K.brown, p: 0.32, gap: 10, w: 11, ang: 0.2, seed: 110 + r * 10 + c, boil: 0 });
  }
  line(B.l, [bk[0], bk[1]], { w: 6, seed: 120, p: 0.7, boil: 0.5 }); line(B.l, [fr[0], fr[1]], { w: 7, seed: 121, p: 0.85, boil: 0.5 });
  fill(B.f, rect(-100, 2800, 1900, 3300), { col: K.navy, p: 0.35, gap: 13, w: 13, ang: 0.15, seed: 125, boil: 0 });
  // speakers
  for (const [x0, sd] of [[130, 130], [1490, 140]]) {
    fill(B.f, rect(x0, 2180, x0 + 180, 2600), { col: K.dark, p: 0.85, gap: 7, w: 9, seed: sd, boil: 0 });
    line(B.l, [...rect(x0, 2180, x0 + 180, 2600), [x0, 2180]], { w: 6, seed: sd + 1, p: 0.8, boil: 0.5 });
    const pump = t > D0 - 0.2 ? 1 + 0.08 * Math.max(0, Math.cos(Math.PI * 2 * (t - D0) / BEAT)) : 1;
    for (const [cy, r] of [[2280, 40], [2460, 70]]) { line(B.l, handCircle(x0 + 90, cy, r * pump, sd + cy, 0.06, 28), { w: 5, col: K.grey, seed: sd + cy + 1, p: 0.9 }); dab(B.l, x0 + 90, cy, r * 0.3, { col: K.grey, p: 0.9, seed: sd + cy + 2 }); }
  }
  // title, written across the drapes
  if (t > TITLE_T[0] && t < 6.6) wtext(SKYT, TITLE, 900, 1830, { size: 150, weight: 700, reveal: pr(t, TITLE_T[0], TITLE_T[1]), seed: 21, stroke: 3, boil: 0.8, col: K.maroon, p: 1 - pr(t, 6.0, 6.6) });
}
const SKYT = layer();
// marigold strings hanging from the canopy, fairy lights that twinkle
function drawGarlands(L, t) {
  for (let i = 0; i < 13; i++) {
    const x = 60 + i * 140, len = 160 + 130 * hash(i * 3.7), sway = 6 * Math.sin(t * 1.3 + i);
    for (let k = 0; k * 22 < len; k++) { const u = k * 22 / len; dab(L, x + sway * u, 1150 + k * 22, 12, { col: k % 3 === 2 ? K.yellow : K.orange, p: 0.95, seed: 200 + i * 40 + k }); }
    dab(L, x + sway, 1150 + len + 14, 8, { col: K.red, p: 0.95, seed: 199 + i });
  }
  const cols = [K.yellow, K.pink, K.teal, K.white, K.orange];
  for (const [y0, sag, sd] of [[1250, 80, 0], [1340, 110, 1]]) {
    const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push([lerp(100, 1700, u), y0 + sag * Math.abs(Math.sin(Math.PI * u * 3))]); }
    line(L, pts, { w: 3, col: K.dark, seed: 240 + sd, p: 0.6, boil: 0.5 });
    pts.forEach(([x, y], i) => { if (i % 2) return; const on = 0.5 + 0.5 * Math.sin(BOIL.step * 0.9 + i * 1.7 + sd); dab(L, x, y + 10, 9, { col: cols[(i / 2 + sd) % 5 | 0], p: 0.45 + 0.55 * on, seed: 250 + i + sd * 40 }); });
  }
}

// ——— the invitation card ———
function cardTL(t) {            // where the card is: held [cx, cy, rot, squash] or fallen on the floor
  if (t < 2.75) return null;
  if (t < 3.5) { const u = pr(t, 2.75, 3.5); return [lerp(720, 480, u), lerp(GY - AH + 220, 2735, ei(u)), -0.25 * u + 0.25 * Math.sin(u * 9), lerp(1, 0.35, u)]; }
  return [480, 2735, -0.25, 0.35];
}
function drawCard(C, cx, cy, rot, sq, t, sd) {
  const w = 330, h = 230;
  const R = pts => pts.map(([x, y]) => { const yy = y * sq; return [cx + x * Math.cos(rot) - yy * Math.sin(rot), cy + x * Math.sin(rot) + yy * Math.cos(rot)]; });
  part(C, R(rect(-w / 2, -h / 2, w / 2, h / 2)), { col: K.maroon, p: 0.95, gap: 6, w: 8, seed: sd }, { w: 5, seed: sd + 1 });
  part(C, R(rect(-w / 2 + 16, -h / 2 + 16, w / 2 - 16, h / 2 - 16)), { col: K.cream, p: 0.95, gap: 6, w: 8, seed: sd + 2 }, { w: 3.5, col: K.orange, seed: sd + 3 });
  for (const [x, y] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) dab(C.l, ...R([[x * (w / 2 - 16), y * (h / 2 - 16)]])[0], 13, { col: K.orange, p: 1, seed: sd + 4 + x + y * 2 });
  if (sq < 0.9) return;
  wtext(C.l, 'संगीत में डांस करेगा:', cx, cy - 50, { size: 30, weight: 700, seed: sd + 10, col: K.maroon, rot });
  wtext(C.l, 'अर्जुन', cx, cy + 42, { size: 74, weight: 700, seed: sd + 11, col: K.red, stroke: 1.5, rot });
  line(C.l, handCircle(cx, cy + 20, 92, sd + 12, 0.2, 40).map(([x, y]) => [x, cy + 20 + (y - cy - 20) * 0.5]), { w: 5, col: K.red, seed: sd + 13, draw: pr(t, 0.1, 0.8) });
}

// ——— footprints the crayon draws (4 numbered pairs + a last pair with a heart) ———
const PAIRS = [[770, 2700], [870, 2610], [970, 2700], [1070, 2610], [1215, 2665]];
const FW = 46;                                   // half spacing of a pair
const DRAW0 = 20.6, PAIR_DT = 0.72;              // when the crayon draws each pair
const stepT = i => D0 + i * 2 * BEAT;            // left foot lands; right foot a half-beat later
function footPoly(x, y, sg, k = 1) {
  k *= 1.7; const s = [[0, -30], [14, -24], [18, -6], [15, 14], [8, 28], [-8, 28], [-14, 12], [-12, -10], [-9, -26]].map(([a, b]) => [x + sg * a * k, y + b * k * 0.55]);
  return smooth(s, 5);
}
function drawFootprints(C, t) {
  PAIRS.forEach(([cx, cy], i) => {
    const td = DRAW0 + i * PAIR_DT; if (t < td) return;
    for (const [sg, k] of [[-1, 0], [1, 1]]) {
      const x = cx + sg * FW, dp = pr(t, td + k * 0.3, td + k * 0.3 + 0.3); if (dp <= 0) continue;
      const lit = i < 4 ? pr(t, stepT(i) + k * BEAT, stepT(i) + k * BEAT + 0.15) : pr(t, stepT(4) + k * 0.3, stepT(4) + k * 0.3 + 0.15);
      const poly = footPoly(x, cy, sg);
      if (lit > 0) {
        fill(C.f, poly, { col: K.yellow, p: 0.95, gap: 5, w: 7, seed: 600 + i * 4 + k, draw: lit, over: 3 });
        const gl = 1 - pr(t, stepT(Math.min(i, 4)) + k * BEAT + 0.15, stepT(Math.min(i, 4)) + k * BEAT + 0.9);
        if (gl > 0) for (let j = 0; j < 6; j++) { const a = j / 6 * Math.PI * 2 + i, r0 = 38, r1 = 38 + 26 * gl; line(C.l, [[x + Math.cos(a) * r0, cy + Math.sin(a) * r0 * 0.55], [x + Math.cos(a) * r1, cy + Math.sin(a) * r1 * 0.55]], { w: 4, col: K.orange, seed: 620 + j + i * 7, p: gl }); }
      }
      line(C.l, [...poly, poly[0]], { w: 4.5, col: K.red, seed: 640 + i * 4 + k, draw: dp });
      for (let j = 0; j < 4; j++) if (dp >= 1) dab(C.l, x + sg * (-14 + j * 12), cy - 38 + Math.abs(j - 1.5) * 3, 6 - j * 0.7, { col: K.red, p: 1, seed: 660 + j + i * 5 + k * 20 });
    }
    if (i < 4 && t > td + 0.62) wtext(C.l, String(i + 1), cx, cy + 62, { size: 50, weight: 700, seed: 680 + i, col: K.red, p: 0.9 });
    if (i === 4 && t > td + 0.62) { const hk = back(pr(t, td + 0.62, td + 0.9)); const hx = cx, hy = cy - 4, s = 20 * hk;
      part(C, smooth([[hx, hy + s * 1.4], [hx - s * 1.6, hy - s * 0.1], [hx - s * 0.9, hy - s * 1.2], [hx, hy - s * 0.5], [hx + s * 0.9, hy - s * 1.2], [hx + s * 1.6, hy - s * 0.1]], 5), { col: K.red, p: 0.95, gap: 3, w: 5, seed: 690 }, { w: 3.5, col: K.red, seed: 691 }); }
  });
}
// the crayon as a sprite: thrown, runs along the footprints drawing them, flies back to Meera
function crayonPath(t) {
  const hand = [MX0 - 70, GY - AH + 40];
  if (t < 20.0 || t > 25.0) return null;
  if (t < DRAW0) { const u = pr(t, 20.0, DRAW0); return [lerp(hand[0], PAIRS[0][0] - FW, eo(u)), lerp(hand[1], PAIRS[0][1], u) - 260 * Math.sin(Math.PI * u), -2.2 + 6 * u]; }
  const k = (t - DRAW0) / PAIR_DT;
  if (k < PAIRS.length) {
    const i = Math.floor(k), f = k - i, [cx, cy] = PAIRS[i];
    // trace: left foot (0–0.42), right foot (0.42–0.84), hop to next pair
    const fp = (sg, u) => { const poly = footPoly(cx + sg * FW, cy, sg); const p = poly[Math.min(poly.length - 1, Math.floor(u * poly.length))]; return p; };
    let p;
    if (f < 0.42) p = fp(-1, f / 0.42); else if (f < 0.84) p = fp(1, (f - 0.42) / 0.42);
    else { const nx = PAIRS[Math.min(i + 1, PAIRS.length - 1)]; const u = (f - 0.84) / 0.16; p = [lerp(cx + FW, nx[0] - FW, u), lerp(cy, nx[1], u) - 40 * Math.sin(Math.PI * u)]; }
    return [p[0], p[1], -1.3];
  }
  const u = pr(t, DRAW0 + PAIRS.length * PAIR_DT, 25.0), a = PAIRS[PAIRS.length - 1];
  return [lerp(a[0] + FW, hand[0], eio(u)), lerp(a[1], hand[1], u) - 200 * Math.sin(Math.PI * u), -1.3 - 5 * u];
}
function drawCrayonSprite(C, t) {
  const p = crayonPath(t); if (!p) return;
  const [x, y, ang] = p, L = 96;
  const tip = [x, y], tail = [x - Math.cos(ang) * L, y - Math.sin(ang) * L];
  part(C, tube([tail, tip], 28, 20), { col: K.red, p: 0.95, gap: 3, w: 5, seed: 700 }, { w: 4, seed: 701 });
  line(C.l, [[lerp(tail[0], tip[0], 0.35) - Math.sin(ang) * 10, lerp(tail[1], tip[1], 0.35) + Math.cos(ang) * 10], [lerp(tail[0], tip[0], 0.35) + Math.sin(ang) * 10, lerp(tail[1], tip[1], 0.35) - Math.cos(ang) * 10]], { w: 3, col: K.white, seed: 702 });
  // speed lines behind it
  for (let i = 0; i < 3; i++) line(C.l, [[tail[0] - Math.cos(ang) * (20 + i * 4), tail[1] - Math.sin(ang) * (20 + i * 4) + (i - 1) * 14], [tail[0] - Math.cos(ang) * (60 + i * 10), tail[1] - Math.sin(ang) * (60 + i * 10) + (i - 1) * 14]], { w: 3, col: K.orange, seed: 705 + i, p: 0.7 });
}

// ——— characters: IK limbs ———
function ik(sh, hd, L1, L2, side) {
  let dx = hd[0] - sh[0], dy = hd[1] - sh[1]; let d = Math.hypot(dx, dy); const mx = L1 + L2 - 1;
  let tgt = hd; if (d > mx) { tgt = [sh[0] + dx / d * mx, sh[1] + dy / d * mx]; dx = tgt[0] - sh[0]; dy = tgt[1] - sh[1]; d = mx; }
  d = Math.max(d, 1e-3);
  const a = Math.atan2(dy, dx), B = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
  const e1 = [sh[0] + Math.cos(a + B) * L1, sh[1] + Math.sin(a + B) * L1], e2 = [sh[0] + Math.cos(a - B) * L1, sh[1] + Math.sin(a - B) * L1];
  const score = e => side * e[0];   // elbows / knees bend outward
  return [score(e1) > score(e2) ? e1 : e2, tgt];
}
function face(C, tp, s, sd) {
  const e = s.exp, lk = s.look || [0, 0], eyeY = -2;
  for (const sg of [-1, 1]) {
    const ex = sg * 18 + lk[0] * 5, ey = eyeY + lk[1] * 4, cx = sg * 18;
    if (e.eyes === 'closed') line(C.l, tp([[cx - 9, eyeY + 1], [cx, eyeY + 5], [cx + 9, eyeY + 1]]), { w: 4.5, seed: sd + 30 + sg });
    else if (e.eyes === 'happy') line(C.l, tp([[cx - 9, eyeY + 4], [cx, eyeY - 5], [cx + 9, eyeY + 4]]), { w: 4.5, seed: sd + 30 + sg });
    else if (e.eyes === 'squeeze') line(C.l, tp([[cx - 9 * sg, eyeY - 6], [cx + 7 * sg, eyeY], [cx - 9 * sg, eyeY + 6]]), { w: 4.5, seed: sd + 30 + sg });
    else if (e.eyes === 'spiral') line(C.l, tp(Array.from({ length: 16 }, (_, i) => { const a = i * 0.8 + BOIL.step * 0.9 * sg, r = 1 + i * 0.6; return [cx + Math.cos(a) * r, eyeY + Math.sin(a) * r]; })), { w: 3, seed: sd + 30 + sg });
    else if (e.eyes === 'pop') { const c = tp([[ex, ey]])[0]; line(C.l, tp(handCircle(cx, eyeY, 12, sd + 28 + sg, 0.1, 20)), { w: 3.5, seed: sd + 28 + sg }); dab(C.l, c[0], c[1], 4, { col: K.ink, p: 1, seed: sd + 32 + sg }); }
    else { const c = tp([[ex, ey]])[0]; dab(C.l, c[0], c[1], 6.5, { col: K.ink, p: 1, gap: 3, w: 5, seed: sd + 32 + sg }); dab(C.l, c[0] + 2, c[1] - 2.5, 2.2, { col: K.white, p: 1, gap: 1.5, w: 3, seed: sd + 34 + sg }); }
    const b = e.brows === 'up' ? [-26, -24] : e.brows === 'down' ? [-17, -22] : e.brows === 'worried' ? [-25, -17] : e.brows === 'puzzled' ? (sg < 0 ? [-26, -28] : [-17, -18]) : [-20, -20];
    line(C.l, tp([[sg * 8, b[0]], [sg * 26, b[1]]]), { w: 4, seed: sd + 36 + sg });
  }
  if (s.blush > 0) for (const sg of [-1, 1]) fill(C.f, tp(handCircle(sg * 31, 14, 10 + 3 * s.blush, sd + 60 + sg, 0, 18)), { col: K.pink, p: 0.75, gap: 4, w: 6, seed: sd + 62 + sg, draw: clamp(s.blush * 1.4), over: 2 });
  const m = e.mouth;
  if (m === 'open') part(C, tp([[-15, 17], [15, 17], [10, 30], [0, 34], [-10, 30]]), { col: K.red, p: 0.9, gap: 4, w: 6, seed: sd + 50 }, { w: 4, seed: sd + 51 });
  else if (m === 'big') part(C, tp(smooth([[-16, 14], [16, 14], [12, 38], [0, 44], [-12, 38]], 4)), { col: K.red, p: 0.9, gap: 4, w: 6, seed: sd + 50 }, { w: 4.5, seed: sd + 51 });
  else if (m === 'o') line(C.l, tp(handCircle(0, 25, 6, sd + 52, 0.1, 14)), { w: 4, seed: sd + 52 });
  else if (m === 'flat') line(C.l, tp([[-8, 25], [8, 24]]), { w: 4, seed: sd + 53 });
  else if (m === 'wavy') line(C.l, tp([[-12, 25], [-6, 21], [0, 26], [6, 21], [12, 25]]), { w: 4, seed: sd + 53 });
  else if (m === 'tongue') { line(C.l, tp(smooth([[-9, 22], [0, 27], [9, 22]], 5, false)), { w: 4, seed: sd + 54 }); dab(C.l, ...tp([[8, 28]])[0], 4.5, { col: K.pink, p: 1, seed: sd + 55 }); }
  else if (m === 'small') line(C.l, tp(smooth([[-6, 23], [0, 26], [6, 23]], 5, false)), { w: 4, seed: sd + 56 });
  else if (m === 'side') line(C.l, tp(smooth([[-4, 25], [5, 25], [10, 21]], 5, false)), { w: 4, seed: sd + 57 });
  else line(C.l, tp(smooth([[-12, 19], [0, 29], [12, 19]], 5, false)), { w: 4.5, seed: sd + 58 });
}

// s: { who, x, gy (floor y under him), hy (head centre y), fx (turn: 1 front, -1 back), lean, hands{L,R}, feet{L,R}, exp, look, blush, glasses:[dx,dy,rot], items }
function person(C, s, sd) {
  const isM = s.who === 'm';
  const piv = [s.x, s.gy];
  const rot = ([x, y]) => { if (!s.lean) return [x, y]; const c = Math.cos(s.lean), si = Math.sin(s.lean), dx = x - piv[0], dy = y - piv[1]; return [piv[0] + dx * c - dy * si, piv[1] + dx * si + dy * c]; };
  const fx = s.fx ?? 1, ax = Math.max(0.12, Math.abs(fx));
  const P = (dx, dy) => rot([s.x + dx * ax, s.hy + dy]);
  const tp = pts => pts.map(([dx, dy]) => P(dx, dy));
  const skin = { col: K.peach, p: 0.6, gap: 7, w: 9, ang: 0.5, seed: sd + 1 };
  const kc = isM ? K.yellow : K.teal;
  // legs + shoes (drawn first: the kurta covers the thighs)
  const hipY = 330;
  for (const [side, sg] of [['L', -1], ['R', 1]]) {
    const hip = P(sg * 24, hipY), ft = rot(s.feet[side]);
    const [kn, f] = ik(hip, ft, 178, 178, sg);
    if (!isM) part(C, tube([hip, kn, f], 44, 32), { col: K.white, p: 0.85, gap: 6, w: 8, ang: 1.3, seed: sd + 2 + sg }, { w: 5, seed: sd + 4 + sg });
    else part(C, tube([hip, kn, f], 30, 24), skin, { w: 4.5, seed: sd + 4 + sg });
    const shoe = smooth([[f[0] - 26, f[1] - 10], [f[0] + sg * 6 + 22, f[1] - 12], [f[0] + sg * 30, f[1] + 4], [f[0] - 22 * sg + (sg < 0 ? 0 : 0), f[1] + 10]], 4);
    part(C, shoe, { col: isM ? K.red : K.brown, p: 0.92, gap: 5, w: 7, seed: sd + 6 + sg }, { w: 4.5, seed: sd + 8 + sg });
    if (isM) dab(C.l, f[0] + sg * 4, f[1] - 4, 4, { col: K.yellow, p: 1, seed: sd + 9 + sg });
  }
  // back hair (Meera's braid hangs behind when she turns away)
  if (isM) part(C, tp(smooth([[-56, -30], [-50, -64], [0, -76], [50, -64], [58, -28], [64, 40], [50, 84], [-50, 84], [-64, 40]], 6)), { col: K.brown, p: 0.95, gap: 7, w: 10, ang: 1.2, seed: sd + 12 }, { w: 6, seed: sd + 13 });
  // torso: Arjun's knee-length kurta; Meera's flared anarkali to the ankle (it swirls when she dances)
  const sw = s.swirl || 0;
  if (isM) {
    const hem = 560, fl = 150 + 40 * sw;
    part(C, tp(smooth([[-15, 48], [15, 48], [44, 62], [52, 150], [46, 230], [fl * 0.9 + 20 * sw, hem - 20], [fl, hem + 10 * Math.sin(BOIL.step)], [0, hem + 24], [-fl, hem + 10 * Math.cos(BOIL.step)], [-fl * 0.9 + 20 * sw, hem - 20], [-46, 230], [-52, 150], [-44, 62]], 3)),
      { col: kc, p: 0.78, gap: 9, w: 10, ang: 0.9, seed: sd + 14, cross: true, crossP: 0.5 }, { w: 6.5, seed: sd + 15 });
    line(C.l, tp([[-46, 230], [46, 230]]), { w: 5, col: K.orange, seed: sd + 16, p: 0.9 });
    for (let i = 0; i < 9; i++) dab(C.l, ...tp([[-fl * 0.85 + i * fl * 0.21, hem - 6]])[0], 6, { col: K.orange, p: 0.95, seed: sd + 17 + i });
    for (let i = 0; i < 6; i++) dab(C.l, ...tp([[-30 + (i % 3) * 30 + (i > 2 ? 15 : 0), 110 + (i > 2 ? 40 : 0)]])[0], 4.5, { col: K.orange, p: 0.95, seed: sd + 27 + i });
  } else {
    part(C, tp(smooth([[-15, 48], [15, 48], [50, 62], [60, 120], [64, 300], [72, 420], [0, 430], [-72, 420], [-64, 300], [-60, 120], [-50, 62]], 3)),
      { col: kc, p: 0.78, gap: 9, w: 10, ang: 0.9, seed: sd + 14, cross: true, crossP: 0.5 }, { w: 6.5, seed: sd + 15 });
    if (fx > 0) line(C.l, tp([[-10, 50], [0, 74], [10, 50]]), { w: 4, seed: sd + 16 });
    if (fx > 0) for (let i = 0; i < 3; i++) dab(C.l, ...tp([[0, 86 + i * 20]])[0], 4, { col: K.yellow, p: 0.95, seed: sd + 17 + i });
    for (let i = 0; i < 2; i++) line(C.l, tp([[-60, 330 + i * 18], [60, 330 + i * 18]]), { w: 3.5, col: K.yellow, seed: sd + 20 + i, p: 0.8 });
  }
  // neck
  part(C, tp([[-11, 34], [11, 34], [12, 56], [-12, 56]]), skin, { w: 4.5, seed: sd + 40 });
  // ears (Arjun) / earrings (Meera)
  if (!isM) for (const sg of [-1, 1]) part(C, tp(handCircle(sg * 50, 6, 12, sd + 41 + sg, 0, 16)), skin, { w: 5, seed: sd + 43 + sg });
  // head
  part(C, tp(handCircle(0, 0, 50, sd + 45, 0.06, 44)), skin, { w: 6, seed: sd + 46 });
  const back = fx < 0;
  if (back) {   // seen from behind: all hair
    part(C, tp(handCircle(0, -6, 52, sd + 47, 0.06, 40)), { col: isM ? K.brown : K.brown, p: 0.97, gap: 6, w: 9, ang: 1.0, seed: sd + 48 }, { w: 5.5, seed: sd + 49 });
  } else {
    if (isM) part(C, tp(smooth([[-54, -2], [-48, -42], [-22, -62], [0, -58], [24, -64], [50, -42], [55, -2], [40, -22], [16, -38], [2, -42], [-14, -36], [-38, -20]], 5)), { col: K.brown, p: 0.97, gap: 6, w: 9, ang: 1.0, seed: sd + 50 }, { w: 5.5, seed: sd + 51 });
    else part(C, tp(smooth([[-55, 0], [-54, -40], [-38, -60], [-16, -66], [4, -78], [18, -64], [36, -74], [40, -54], [56, -42], [56, -4], [42, -26], [20, -32], [0, -28], [-22, -34], [-42, -20]], 5)), { col: K.brown, p: 0.97, gap: 6, w: 9, ang: 1.0, seed: sd + 50 }, { w: 5.5, seed: sd + 51 });
    if (ax > 0.5) face(C, tp, s, sd);
    if (isM) { dab(C.l, ...tp([[0, -24]])[0], 4.5, { col: K.red, p: 1, seed: sd + 52 }); for (const sg of [-1, 1]) dab(C.l, ...tp([[sg * 51, 24]])[0], 6, { col: K.yellow, p: 1, seed: sd + 53 + sg }); }
    if (!isM && ax > 0.5) {   // round glasses (they can fly off)
      const [gx, gy, gr] = s.glasses || [0, 0, 0];
      const G = pts => tp(pts.map(([x, y]) => [gx + x * Math.cos(gr) - y * Math.sin(gr), gy + x * Math.sin(gr) + y * Math.cos(gr)]));
      for (const sg of [-1, 1]) line(C.l, G(handCircle(sg * 18, -2, 15, sd + 54 + sg, 0.08, 22)), { w: 3.5, seed: sd + 54 + sg });
      line(C.l, G([[-4, -3], [4, -3]]), { w: 3, seed: sd + 57 });
    }
  }
  // Meera's braid over the shoulder + pink dupatta
  if (isM && !back) {
    for (let i = 0; i < 5; i++) { const c = [44 + i * 3, 46 + i * 20]; part(C, tp(handCircle(c[0], c[1], 13 - i, sd + 60 + i, 0, 16)), { col: K.brown, p: 0.97, gap: 5, w: 7, seed: sd + 66 + i }, { w: 4.5, seed: sd + 72 + i }); }
    dab(C.l, ...tp([[58, 146]])[0], 7, { col: K.red, p: 1, seed: sd + 78 });
  }
  if (isM) { const fl = 18 * Math.sin(q2(s.t) * 3) + 40 * sw; part(C, tp(smooth([[-50, 58], [-30, 52], [-60, 180], [-90 - fl, 330], [-64 - fl, 360], [-44, 200]], 4)), { col: K.pink, p: 0.85, gap: 7, w: 9, ang: -0.6, seed: sd + 80 }, { w: 5.5, seed: sd + 81 }); }
  // arms
  const arms = {};
  for (const [side, sg] of [['L', -1], ['R', 1]]) {
    const shp = P(sg * 44, 66), [el, hd] = ik(shp, rot(s.hands[side]), 118, 110, sg);
    arms[side] = hd;
    part(C, tube([shp, el, hd], 30, 24), { col: kc, p: 0.78, gap: 8, w: 9, ang: 0.4, seed: sd + 90 + sg }, { w: 5.5, seed: sd + 92 + sg });
    if (isM) for (let j = 0; j < 3; j++) line(C.l, [[hd[0] - 12, hd[1] - 18 - j * 6], [hd[0] + 12, hd[1] - 18 - j * 6]], { w: 3, col: [K.red, K.yellow, K.green][j], seed: sd + 95 + j + sg });
  }
  for (const it of s.items || []) if (it.type === 'crayon') {
    const a = it.ang ?? -0.9, h = arms[it.side];
    part(C, tube([[h[0] - Math.cos(a) * 6, h[1] - Math.sin(a) * 6], [h[0] + Math.cos(a) * 62, h[1] + Math.sin(a) * 62]], 17, 14), { col: K.red, p: 0.95, gap: 3, w: 5, seed: sd + 140 }, { w: 3.5, seed: sd + 141 });
  }
  for (const side of ['L', 'R']) part(C, handCircle(arms[side][0], arms[side][1], 15, sd + 160 + (side === 'L' ? 0 : 1), 0, 18), skin, { w: 5, seed: sd + 162 + (side === 'L' ? 0 : 1) });
  if (s.card) drawCard(C, ...s.card, s.t, sd + 300);
  s.head = P(0, 0);
}

// ——— Arjun's acting ———
// position along the floor: stands at 720; the dance carries him pair by pair to the last (heart) pair
function aPos(t) {
  if (t < stepT(0) - 0.3) return [720, GY];
  for (let i = 0; i < 5; i++) {
    const t0 = i < 4 ? stepT(i) - 0.3 : stepT(4) - 0.4, t1 = i < 4 ? stepT(i) : stepT(4);
    const prev = i ? PAIRS[i - 1] : [720, GY];
    if (t < t1) { const u = pr(t, t0, t1); return [lerp(prev[0], PAIRS[i][0], eio(u)), lerp(prev[1], PAIRS[i][1], u)]; }
    if (i === 4 || t < stepT(i + 1) - (i === 3 ? 0.4 : 0.3)) return PAIRS[i];
  }
  return PAIRS[4];
}
const sitK = t => ss(pr(t, 9.85, 10.15)) * (1 - ss(pr(t, 11.0, 11.4)));
const spinU = t => pr(t, 11.6, 12.6);
// hands relative to head centre: [Lx, Ly, Rx, Ry]
const H_REST = [-70, 330, 70, 330], H_CARD = [-120, 160, 120, 160], H_UP = [-150, -150, 150, -150];
const aHands = track([
  [0, [-120, 150, 120, 150]], [0.85, [-120, 150, 120, 150]], [1.15, [-125, 245, 125, 245]], [2.6, [-125, 245, 125, 245]], [2.85, [-150, 250, 150, 250]], [3.2, H_REST],
  [8.5, H_REST], [8.9, H_UP], [9.4, H_UP], [9.7, [-190, -40, 170, 20]], [9.9, [-200, 60, 200, 60]], [10.2, [-170, 300, 170, 300]], [11.0, [-170, 300, 170, 300]], [11.4, H_REST],
  [11.5, H_REST], [11.65, [-200, 120, 200, 120]], [12.6, [-200, 120, 200, 120]], [12.9, [-160, 220, 160, 220]], [13.4, H_REST],
  [13.6, H_REST], [13.9, [-70, 330, 40, -60]], [15.6, [-70, 330, 40, -60]], [15.9, H_REST],
  [D0 - 0.6, H_REST], [D0 - 0.2, [-110, 180, 110, 180]],
  [33.0, [-110, 180, 110, 180]],
  [41.6, [-110, 180, 110, 180]], [42.0, H_REST],
]);
// the bhangra "bulb" (both dancers, from bar 7 of the dance): one hand up twisting, the other on the hip, swap each beat
function bhangra(t, x, hy, mirror) {
  const b = Math.floor((t - 30.8) / BEAT), f = ((t - 30.8) / BEAT) % 1, up = (b % 2 === 0) !== mirror ? 1 : -1;
  const tw = 14 * Math.sin(q2(t) * 20);
  return { L: up < 0 ? [x - 130 + tw, hy - 170] : [x - 90, hy + 250], R: up > 0 ? [x + 130 + tw, hy - 170] : [x + 90, hy + 250], bounce: 14 * Math.abs(Math.sin(Math.PI * f)) };
}
function arjun(t) {
  const tq = q2(t);
  const [px, gy] = aPos(tq);
  let x = px, hy = gy - AH;
  const sit = sitK(t); hy += 270 * sit;
  let lean = 0, fx = 1;
  // try 1: kick, wobble, fall
  if (t > 9.0 && t < 9.95) lean = 0.16 * Math.sin((t - 9.0) * 17) * pr(t, 9.0, 9.4);
  // try 2: spin, then dizzy sway
  const su = spinU(t); if (su > 0 && su < 1) fx = Math.cos(Math.PI * 2 * 2 * eio(su));
  if (t > 12.6 && t < 13.5) lean = 0.13 * Math.sin((t - 12.6) * 9);
  let h = aHands(tq).slice();
  let hands = { L: [x + h[0], hy + h[1]], R: [x + h[2], hy + h[3]] };
  // feet
  let feet = { L: [x - 34, gy], R: [x + 34, gy] };
  if (sit > 0) { feet.L = [x - 34 - 120 * sit, gy - 10 * sit]; feet.R = [x + 34 + 120 * sit, gy - 10 * sit]; }
  if (t > 9.0 && t < 9.95) feet.R = [x + 34 + 150 * ss(pr(t, 9.0, 9.3)), gy - 170 * ss(pr(t, 9.0, 9.3)) * (1 - ss(pr(t, 9.6, 9.95))) ];
  if (t > 13.9 && t < 15.6) hands.R = [x + 40 + 10 * Math.sin(tq * 30), hy - 60];   // scratching his head
  // the dance: feet land on each pair (left, then right a half-beat later), knees lift between
  let bounce = 0;
  if (t >= D0 - 0.3 && t < 30.8) {
    const i = Math.min(4, Math.max(0, Math.floor((t - D0 + 0.3) / (2 * BEAT)))), [cx, cy] = PAIRS[i], prev = i ? PAIRS[i - 1] : [720, GY];
    const tl = stepT(i), tr = stepT(i) + BEAT;
    const lift = (t0, t1) => Math.sin(Math.PI * pr(t, t0, t1));
    feet.L = t < tl ? [lerp(prev[0] - 34, cx - FW, pr(t, tl - 0.3, tl)), lerp(prev[1], cy, pr(t, tl - 0.3, tl)) - 80 * lift(tl - 0.3, tl)] : [cx - FW, cy];
    feet.R = t < tr ? [lerp(prev[0] + 34, cx + FW, pr(t, tr - 0.3, tr)), lerp(prev[1], cy, pr(t, tr - 0.3, tr)) - 80 * lift(tr - 0.3, tr)] : [cx + FW, cy];
    if (i === 4 && t < stepT(4)) fx = Math.cos(Math.PI * 2 * eio(pr(t, stepT(4) - 0.4, stepT(4))));   // a twirl onto the heart
    bounce = 10 * Math.abs(Math.sin(Math.PI * (t - D0) / BEAT));
    hands = { L: [x - 120, hy + 150 - 40 * Math.abs(Math.sin(Math.PI * (t - D0) / BEAT))], R: [x + 120, hy + 150 - 40 * Math.abs(Math.cos(Math.PI * (t - D0) / BEAT))] };
  }
  if (t >= 30.8 && t < 37.2) {
    const bh = bhangra(t, x, hy, false); bounce = bh.bounce; hands = { L: bh.L, R: bh.R };
    const b = Math.floor((t - 30.8) / BEAT) % 4; if (b === 1) feet.L = [x - FW - 10, gy - 70 * Math.sin(Math.PI * (((t - 30.8) / BEAT) % 1))]; if (b === 3) feet.R = [x + FW + 10, gy - 70 * Math.sin(Math.PI * (((t - 30.8) / BEAT) % 1))];
  }
  if (t >= 37.2 && t < 42.0) { hands = { L: [x - 70, hy + 330], R: [x + 70, hy + 330] }; }
  hy += bounce;
  // glasses: jump at the hook, fly off at the fall
  let glasses = [0, 0, 0];
  if (t > 0.9 && t < 1.5) glasses = [0, -18 * Math.sin(Math.PI * pr(t, 0.9, 1.3)), 0];
  if (t > 10.1 && t < 10.9) { const u = pr(t, 10.1, 10.9); glasses = [30 * Math.sin(Math.PI * u), -150 * Math.sin(Math.PI * u), 6.28 * u]; }
  if (t > 10.9 && t < 37.6 && t > 10.9) glasses = [0, 6, 0.12];   // a bit crooked after the fall …
  if (t > 38.6) glasses = [0, 0, 0];                               // … until Meera straightens them
  // face
  const exp = { eyes: 'open', brows: 'flat', mouth: 'small' }; let look = [0, 0], blush = 0;
  if (t < 0.9) { look = [0, 0.4]; exp.brows = 'worried'; }
  else if (t < 2.9) { exp.eyes = 'pop'; exp.brows = 'up'; exp.mouth = 'big'; }
  else if (t < 6.4) { look = [0.4, 0.4]; exp.brows = 'worried'; exp.mouth = 'wavy'; }
  else if (t < 8.5) { look = [0.6, 0.2]; exp.brows = 'worried'; exp.mouth = 'wavy'; }
  else if (t < 9.6) { exp.brows = 'down'; exp.mouth = 'tongue'; look = [0, -1]; }
  else if (t < 9.95) { exp.eyes = 'pop'; exp.brows = 'up'; exp.mouth = 'o'; }
  else if (t < 11.4) { exp.eyes = 'squeeze'; exp.brows = 'down'; exp.mouth = 'wavy'; }
  else if (t < 12.6) { exp.brows = 'down'; exp.mouth = 'tongue'; }
  else if (t < 13.5) { exp.eyes = 'spiral'; exp.mouth = 'wavy'; }
  else if (t < 15.9) { look = [0.3, 0.6]; exp.brows = 'worried'; exp.mouth = t < 15.2 ? 'open' : 'side'; blush = 0.45; }
  else if (t < 20.0) { look = [1, 0]; exp.brows = 'up'; exp.mouth = 'small'; blush = 0.4; }
  else if (t < 24.5) { look = [0.4, 1]; exp.brows = 'up'; exp.mouth = 'o'; }
  else if (t < D0) { look = [1, 0]; exp.brows = 'puzzled'; exp.mouth = 'side'; }
  else if (t < 28.4) { look = [0, 1]; exp.brows = 'up'; exp.mouth = 'o'; }
  else if (t < 37.2) { exp.eyes = 'happy'; exp.brows = 'up'; exp.mouth = 'open'; blush = 0.4; }
  else if (t < 38.6) { look = [1, 0]; exp.mouth = 'smile'; blush = 0.7; }
  else { exp.eyes = t > 39.4 ? 'happy' : 'open'; look = [1, 0]; exp.mouth = 'smile'; blush = 1; }
  const card = t < 2.75 ? [(hands.L[0] + hands.R[0]) / 2, (hands.L[1] + hands.R[1]) / 2 - 20, 0, 1] : null;
  return { who: 'a', t, x, gy, hy, fx, lean, hands, feet, exp, look, blush, glasses, card, items: [] };
}

// ——— Meera's acting ———
const MX0 = 1440;
function mPos(t) { return t < 36.6 ? [MX0, GY] : [lerp(MX0, 1375, eio(pr(t, 36.6, 37.2))), GY]; }
const mHands = track([
  [0, [-70, 330, 70, 330]], [9.9, [-70, 330, 70, 330]], [10.1, [-30, 40, -10, 40]], [11.2, [-30, 40, -10, 40]], [11.5, [-70, 330, 70, 330]],
  [12.7, [-70, 330, 70, 330]], [12.9, [-30, 40, -10, 40]], [13.6, [-30, 40, -10, 40]], [13.9, [-70, 330, 70, 330]],
  [15.9, [-70, 330, 70, 330]], [16.3, [-40, 190, 60, 200]], [17.2, [-40, 190, 60, 200]], [17.6, [-150, -80, 70, 330]], [19.6, [-150, -80, 70, 330]],
  [19.85, [-60, -150, 70, 330]], [20.0, [-200, 20, 70, 330]], [20.3, [-190, 250, 70, 330]], [23.8, [-190, 250, 70, 330]],
  [24.4, [-150, 40, 70, 330]], [25.0, [-90, 40, 70, 330]], [25.3, [-120, -60, 70, 330]], [26.2, [-120, -60, 70, 330]], [26.5, [-70, 330, 70, 330]],
  [29.6, [-70, 330, 70, 330]], [30.0, [-30, 120, 30, 120]], [30.6, [-30, 120, 30, 120]],
  [37.2, [-70, 330, 70, 330]], [38.0, [-70, 330, 70, 330]], [38.3, [-150, 10, 70, 330]], [38.9, [-150, 10, 70, 330]], [39.3, [-70, 330, 70, 330]],
]);
function meera(t) {
  const tq = q2(t);
  const [x, gy] = mPos(tq);
  let hy = gy - AH + 10;
  let lean = 0, swirl = 0, fx = 1;
  const h = mHands(tq);
  let hands = { L: [x + h[0], hy + h[1]], R: [x + h[2], hy + h[3]] };
  let feet = { L: [x - 30, gy], R: [x + 30, gy] };
  // giggles (shoulders shake) at both falls
  if ((t > 10.1 && t < 11.2) || (t > 12.9 && t < 13.6)) hy += 5 * Math.sin(tq * 40);
  // clapping on the beat while he steps
  if (t >= 26.6 && t < 29.6) { const c = Math.abs(Math.sin(Math.PI * (t - D0) / BEAT)); hands = { L: [x - 20 - 40 * c, hy + 150], R: [x + 20 + 40 * c, hy + 150] }; }
  let bounce = 0;
  if (t >= 30.6 && t < 37.2) {
    if (t < 30.8) fx = 1; else { const bh = bhangra(t, x, hy, true); bounce = bh.bounce; hands = { L: bh.L, R: bh.R }; swirl = 0.6 + 0.4 * Math.sin(tq * 6); }
    if (t > 30.6 && t < 31.4) { fx = Math.cos(Math.PI * 2 * eio(pr(t, 30.6, 31.4))); swirl = 1; }
  }
  if (t >= 38.3 && t < 38.9) hands.L = [x - 150, hy + 4];   // straightens his glasses
  hy += bounce;
  const exp = { eyes: 'open', brows: 'flat', mouth: 'smile' }; let look = [-1, 0], blush = 0;
  if (t < 9.9) { look = [-1, 0.1]; }
  else if (t < 11.5) { exp.eyes = 'happy'; exp.mouth = 'open'; }
  else if (t < 12.9) { look = [-1, 0]; exp.brows = 'up'; exp.mouth = 'o'; }
  else if (t < 13.9) { exp.eyes = 'happy'; exp.mouth = 'open'; }
  else if (t < 15.9) { look = [-1, 0.2]; exp.brows = 'worried'; exp.mouth = 'small'; }
  else if (t < 16.6) { look = [0, -1]; exp.brows = 'up'; exp.mouth = 'o'; }
  else if (t < 19.6) { look = [-1, -0.4]; exp.brows = 'down'; exp.mouth = 'tongue'; }
  else if (t < 24.4) { look = [-1, 1]; exp.brows = 'up'; exp.mouth = 'open'; }
  else if (t < 26.4) { look = [-1, 0]; exp.mouth = 'open'; exp.brows = 'up'; }
  else if (t < 30.6) { look = [-1, 0.3]; exp.eyes = 'happy'; exp.mouth = 'open'; }
  else if (t < 37.2) { exp.eyes = 'happy'; exp.mouth = 'open'; blush = 0.4; }
  else { look = [-1, 0]; exp.mouth = 'smile'; blush = 0.8; exp.eyes = t > 39.4 ? 'happy' : 'open'; }
  const items = [];
  if ((t >= 17.4 && t < 20.0) || (t >= 25.0 && t < 30.0)) items.push({ type: 'crayon', side: 'L', ang: -2.0 });
  return { who: 'm', t, x, gy, hy, fx, lean, swirl, hands, feet, exp, look, blush, items };
}

// ——— the guests (backs of heads, foreground) ———
function drawCrowd(C, t) {
  const cols = [K.green, K.orange, K.violet, K.red, K.teal, K.pink, K.yellow, K.navy];
  for (let i = 0; i < 8; i++) {
    const x = 80 + i * 235 + (i % 2) * 30, y = 3050 + (i % 2) * 70;
    let dy = 0;
    if (t > D0 && t < 37.6) dy = -16 * Math.abs(Math.sin(Math.PI * (t - D0) / BEAT + i));
    else if ((t > 10.1 && t < 11.2) || (t > 12.9 && t < 13.6)) dy = 6 * Math.sin(q2(t) * 40 + i);
    part(C, smooth([[x - 120, y + 260], [x - 110, y + 120], [x - 40, y + 70], [x + 40, y + 70], [x + 110, y + 120], [x + 120, y + 260]], 4), { col: cols[i], p: 0.8, gap: 9, w: 10, ang: 0.8, seed: 900 + i }, { w: 6, seed: 910 + i });
    part(C, handCircle(x, y + dy, 66, 920 + i, 0.06, 36), { col: K.dark, p: 0.95, gap: 7, w: 9, ang: 1.1, seed: 930 + i }, { w: 6, seed: 940 + i });
    if (i % 3 === 1) dab(C.l, x + 30, y - 40 + dy, 14, { col: K.orange, p: 1, seed: 950 + i });   // a marigold in her hair
    if (t > 31.0 && t < 37.0 && i % 2 === 0) { const a = Math.sin(q2(t) * 8 + i) * 18; part(C, tube([[x + 70, y + 110 + dy], [x + 100 + a, y - 40 + dy]], 26, 22), { col: cols[i], p: 0.8, gap: 7, w: 8, seed: 960 + i }, { w: 4.5, seed: 970 + i }); part(C, handCircle(x + 100 + a, y - 50 + dy, 16, 980 + i, 0, 16), { col: K.peach, p: 0.6, gap: 6, w: 8, seed: 990 + i }, { w: 4, seed: 995 + i }); }
  }
}

// ——— effects: sweat drop, "!" idea, dizzy stars, falling marigold petals, ripple lines ———
function drawFX(L, t, a, m) {
  if (t > 0.9 && t < 2.8 && a.head) { const u = (t - 0.9) % 0.9 / 0.9; const p = [a.head[0] + 58, a.head[1] - 30 + 40 * u]; part0(L, smooth([[p[0], p[1] - 18], [p[0] + 9, p[1] + 2], [p[0], p[1] + 10], [p[0] - 9, p[1] + 2]], 4), K.teal); }
  // "!!!" over Arjun at the card
  if (t > 0.9 && t < 2.6 && a.head) { const k = back(pr(t, 0.9, 1.1)); for (let i = 0; i < 3; i++) wtext(L, '!', a.head[0] - 60 + i * 60, a.head[1] - 100 - (i === 1 ? 20 : 0), { size: 70 * k + 1, weight: 700, seed: 800 + i, stroke: 2, col: K.red }); }
  if (t > 12.6 && t < 13.6 && a.head) for (let i = 0; i < 3; i++) { const an = t * 7 + i * 2.09, c = [a.head[0] + Math.cos(an) * 80, a.head[1] - 70 + Math.sin(an) * 22]; star(L, c, 16, 810 + i); }
  if (t > 15.9 && t < 17.0 && m.head) { const k = back(pr(t, 15.9, 16.15)) * (1 - pr(t, 16.7, 17.0)); wtext(L, '!', m.head[0], m.head[1] - 90, { size: 120 * k + 1, weight: 700, seed: 860, stroke: 3, col: K.orange });
    for (let i = 0; i < 5; i++) { const an = -Math.PI / 2 + (i - 2) * 0.5; line(L, [[m.head[0] + Math.cos(an) * 120, m.head[1] - 120 + Math.sin(an) * 40], [m.head[0] + Math.cos(an) * (120 + 40 * k), m.head[1] - 120 + Math.sin(an) * (40 + 40 * k)]], { w: 5, col: K.yellow, seed: 870 + i }); } }
  // hearts float up at the end
  if (t > 39.4 && t < 43.5) for (let i = 0; i < 4; i++) { const u = ((t - 39.4) * 0.5 + i * 0.25) % 1, c = [1295 + Math.sin(u * 6 + i) * 50 + (i - 1.5) * 40, 1860 - 260 * u], s = 14 * (1 - u * 0.4);
    part0(L, smooth([[c[0], c[1] + s * 1.4], [c[0] - s * 1.6, c[1] - s * 0.1], [c[0] - s * 0.9, c[1] - s * 1.2], [c[0], c[1] - s * 0.5], [c[0] + s * 0.9, c[1] - s * 1.2], [c[0] + s * 1.6, c[1] - s * 0.1]], 5), K.red, 1 - u); }
}
function part0(L, poly, col, p = 1) { fill(L, poly, { col, p: 0.95 * p, gap: 4, w: 6, seed: 777, over: 2 }); line(L, [...poly, poly[0]], { w: 3.5, col: K.ink, p: 0.8 * p, seed: 778 }); }
function star(L, c, r, sd) { const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; pts.push([c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr]); } part0(L, pts, K.yellow); }
function drawPetals(L, t) {
  if (t < 31.0 || t > 41.0) return;
  for (let i = 0; i < 46; i++) {
    const t0 = 31.0 + hash(i * 1.7) * 4.5, u = (t - t0) / 3.2; if (u < 0 || u > 1) continue;
    const x = 120 + hash(i * 3.1) * 1560 + 40 * Math.sin(u * 7 + i), y = 1150 + u * 1700;
    dab(L, x, y, 10 + 4 * hash(i), { col: i % 3 ? K.orange : K.yellow, p: 0.95 * (1 - ss(pr(u, 0.85, 1))), seed: 1000 + i, sq: 0.6 });
  }
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
  const size = tw > 960 ? 54 * 960 / tw : 54;
  wtext(SUBT, S.text, cx, cy + 16, { screen: true, size, col: S.who === 'A' ? K.teal : S.who === 'M' ? K.magenta : K.ink, reveal: rv, seed: 11 + S.t0 * 3, p: 1, stroke: 1.4 });
}
export const TEXTS = t => { const S = SUBS.find(s => t >= s.t0 && t < s.t1); return S ? [{ id: 's' + S.t0, text: S.text, x0: 30, y0: SUBY - 55, x1: 1050, y1: SUBY + 55 }] : []; };
function endCard(L, t) {
  if (t < 43.0) return;
  const g = SUBK.g, cx = sx(900), cy = sy(1350), hw = 520 * CAM.s * ss(pr(t, 43.0, 43.3)), hh = 200 * CAM.s;
  g.save(); g.fillStyle = '#000'; g.beginPath();
  for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 2; const px = Math.cos(a), py = Math.sin(a); const sq = Math.pow(Math.abs(px), 0.3) * Math.sign(px); const nn = 1 + 0.05 * Math.sin(a * 7 + 0.3) + 0.03 * Math.sin(a * 17); const X = cx + sq * hw * nn, Y = cy + py * hh * nn; i ? g.lineTo(X, Y) : g.moveTo(X, Y); }
  g.closePath(); g.fill(); g.restore();
  if (t < 43.2) return;
  wtext(L, 'अगला पन्ना कल', 900, 1280, { size: 128, weight: 700, reveal: pr(t, 43.2, 44.2), seed: 890, stroke: 2.5, col: K.ink });
  wtext(L, '@pannapalatkahani', 900, 1440, { size: 70, weight: 700, reveal: pr(t, 44.1, 44.9), seed: 891, stroke: 1.5, col: K.red });
  if (t > 44.9) line(L, smooth([[640, 1475], [900, 1490], [1160, 1470]], 6, false), { w: 7, col: K.orange, seed: 892, draw: pr(t, 44.9, 45.3) });
}

// ——— events for the mixer ———
export const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
ev(0, 'amb', { kind: 'party' });
SUBS.forEach(S => ev(S.vt, 'voice', { id: S.vo, who: S.who }));
ev(0.1, 'write', { dur: 0.7, pan: 0 }); ev(0.9, 'boing'); ev(2.75, 'paper', { pan: -0.2 }); ev(3.45, 'land', { pan: -0.3 });
ev(TITLE_T[0], 'write', { dur: TITLE_T[1] - TITLE_T[0], pan: 0 });
ev(8.6, 'whoosh', { pan: -0.2 }); ev(9.0, 'whoosh', { pan: -0.1 }); ev(9.95, 'fall', { pan: -0.2 }); ev(10.1, 'laugh', { dur: 1.1 }); ev(10.15, 'boing'); ev(10.85, 'tink', { pan: -0.2 });
ev(11.6, 'spin', { dur: 1.0, pan: -0.2 }); ev(12.6, 'dizzy', { dur: 0.9 }); ev(12.9, 'laugh', { dur: 0.7 }); ev(13.35, 'scratch');
ev(15.9, 'ding'); ev(17.4, 'pop', { pan: 0.4 });
ev(19.9, 'whoosh', { pan: 0.4 }); PAIRS.forEach((_, i) => { ev(DRAW0 + i * PAIR_DT, 'write', { dur: 0.6, pan: -0.2 + i * 0.1 }); });
ev(DRAW0 + 4 * PAIR_DT + 0.62, 'ding'); ev(24.4, 'whoosh', { pan: 0.3 }); ev(25.0, 'catch', { pan: 0.4 });
for (let i = 0; i < 4; i++) { ev(stepT(i), 'step', { n: i, pan: -0.3 + i * 0.15 }); ev(stepT(i) + BEAT, 'step', { n: i, pan: -0.25 + i * 0.15 }); }
ev(stepT(4) - 0.4, 'spin', { dur: 0.4 }); ev(stepT(4), 'step', { n: 4 }); ev(stepT(4) + 0.3, 'step', { n: 4 }); ev(30.6, 'spin', { dur: 0.8, pan: 0.3 });
ev(31.0, 'cheer', { dur: 5.5 }); ev(38.3, 'tink', { pan: 0.2 }); ev(39.4, 'sparkle', { dur: 1.2 });
ev(43.2, 'write', { dur: 1.0 }); ev(44.1, 'write', { dur: 0.8 });
[['A', 0], ['T', 3.4], ['B', 6.0], ['S', 13.35], ['C', 15.9], ['D', 20.0], ['E', D0], ['F', 30.8], ['G', 37.2], ['Z', 42.6]].forEach(([id, t]) => ev(t, 'cue', { id }));

// ——— one frame ———
export function frame(comp, t) {
  [CAM.x, CAM.y, CAM.s] = camT(t);
  BOIL.amp = 1;
  [FP, CARD, ME, AR, CROWD].forEach(clearGroup);
  [BG.f, BG.l, LIGHTS, SKYT, FX, WASH, SUBK, SUBT].forEach(clear);
  drawBG(t);
  drawGarlands(LIGHTS, t);
  drawFootprints(FP, t);
  const cd = cardTL(t); if (cd) drawCard(CARD, ...cd, t, 1300);
  const ms = meera(t); person(ME, ms, 3000);
  const as = arjun(t); person(AR, as, 2000);
  drawCrayonSprite(CARD, t);
  drawCrowd(CROWD, t);
  drawPetals(FX, t);
  drawFX(FX, t, as, ms);
  endCard(SUBT, t);
  if (!NOSUBS) subTo(t);
  // a warm party glow once the dance lands
  const warm = ss(pr(t, 30.6, 31.4)) * (1 - ss(pr(t, 42.0, 43.0)));
  if (warm > 0) { const g = WASH.g; g.save(); g.fillStyle = '#000'; g.globalAlpha = 0.22 * warm; g.fillRect(0, 0, W, H); g.restore(); }
  comp.paperCam(CAM.x * 0.6, CAM.y * 0.6, CAM.s / 0.6);
  comp.begin();
  comp.crayon(BG.f.c); comp.crayon(BG.l.c);
  const go = [hash(BOIL.step) * 300, hash(BOIL.step + 7) * 300];
  comp.crayon(SKYT.c, { goff: go });
  comp.crayon(LIGHTS.c, { goff: go });
  if (warm > 0) comp.wash(WASH.c, { color: [1.0, 0.82, 0.55], edge: 0.2, resist: 0.6 });
  comp.group(FP, { goff: go });
  comp.group(ME, { goff: go }); comp.group(AR, { goff: go });
  comp.group(CARD, { goff: go });
  comp.group(CROWD, { goff: go });
  comp.crayon(FX.c, { goff: go });
  comp.knock(SUBK.c); comp.crayon(SUBT.c);
  comp.finish({ vig: 0.24 });
}
export function testFrame(comp, t) { frame(comp, t); }
