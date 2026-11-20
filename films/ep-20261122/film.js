// 13वाँ फ्लोर (भाग 2) — The 13th Floor, Part 2: amma's secret. Ep 5, posts 22 Nov 2026. Vertical 1080×1920, 24 fps, 50 s.
// Night look: wax pastel on black paper (light is drawn, dark is the paper), one spot red (the lift's "13").
// A 12-floor building. 11:40 pm, Riya alone in the lift. It stops at 13. An old amma in a shawl calls her by name, offers a tiffin.
// Ground floor: the watchman says the 13th floor has been shut since the 1996 fire. The tiffin in her hand is still warm.
// In the lift mirror: amma, right behind her. Part 2 tomorrow.
import { layer, clear, line, fill, dab, handCircle, smooth, CAM, BOIL, WMUL, STYLE, W, H, sx, sy } from './crayon.js';
const CLEAN = new URLSearchParams(location.search).get('look') !== 'pastel';   // default: clean cartoon (Jayant, 20 Nov)
STYLE.clean = CLEAN;
import { group, clearGroup, part, tube } from './rig.js';
import { clamp, lerp, hash, ss, eio, eo, ei } from '/core/lib.js';

export const DUR = 53.0;
// the picture was timed on a 50 s grid; the voice needs 53 s: WARP maps film time → picture time (piecewise linear per shot)
const WK = [[0, 0], [3.6, 3.4], [9.6, 9.6], [16.7, 15.0], [23.4, 21.6], [29.3, 27.0], [35.4, 32.0], [37.6, 34.4], [40.4, 39.2], [46.4, 44.6], [49.9, 47.2], [53.0, 50.0]];
function pw(t, a, b) { for (let i = 1; i < WK.length; i++) if (t <= WK[i][a] || i === WK.length - 1) { const [p, q] = [WK[i - 1], WK[i]]; return p[b] + (t - p[a]) * (q[b] - p[b]) / (q[a] - p[a]); } return t; }
const WARP = t => pw(t, 0, 1), UNWARP = t => pw(t, 1, 0);
const NOSUBS = new URLSearchParams(location.search).get('nosubs') === '1';
const K = { ink: '#141218', bone: '#ece4d2', chalk: '#cfc9bb', grey: '#86858e', dgrey: '#45434d', steel: '#a3a9b1', steelD: '#5e646d', steelL: '#d3d8dc',
  red: '#ff3b2a', redD: '#9e2318', bulb: '#ffe6a0', amber: '#e7b25a', skin: '#d8a585', skinO: '#c99a7e', kurta: '#5f86b0', kurtaD: '#3e5f86', jeans: '#34456b',
  shawl: '#874650', shawlD: '#5c2c35', saree: '#d9d2c1', khaki: '#a69468', khakiD: '#6f6343', hair: '#26201f', white: '#f2eee4', cream: '#d8cfb4',
  wallG: '#55665c', wallC: '#a39b86', floor: '#5a5048', wood: '#6b4a32', teal: '#5aa6a0', bag: '#8a6a4a' };
const PAPER = [0.075, 0.07, 0.085];
const pr = (t, a, b) => clamp((t - a) / (b - a));
const q2 = t => Math.floor(t * 12 + 1e-6) / 12;
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const AH = 680;

// ——— printed words / voice script (N narrator, R Riya, A amma) — '|' breaks a line ———
export const SUBS = [
  { t0: 0.0, t1: 4.2, text: '13वें फ्लोर वाली अम्मा…|आखिर कौन हैं?', who: 'N', vo: 'n1', vt: 0.15 },
  { t0: 4.4, t1: 9.5, text: '“डर गई बेटा? मैं तो रोज़ रात|दूध लेने नीचे आती हूँ।”', who: 'A', vo: 'a1', vt: 4.4 },
  { t0: 9.6, t1: 12.5, text: 'पर अम्मा को रिया का|नाम कैसे पता था?', who: 'N', vo: 'n2', vt: 9.6 },
  { t0: 12.6, t1: 16.6, text: '“तेरे गले में लिखा है ना… रिया।”', who: 'A', vo: 'a2', vt: 12.6 },
  { t0: 16.8, t1: 23.3, text: 'चौकीदार नया था। आग के बाद 13वाँ फ्लोर|कभी ठीक नहीं हुआ… और अम्मा वहीं अकेली रह गईं।', who: 'N', vo: 'n3', vt: 16.8 },
  { t0: 23.5, t1: 29.2, text: 'अम्मा की पोती का नाम भी रिया था…|जो सालों पहले विदेश चली गई।', who: 'N', vo: 'n4', vt: 23.5 },
  { t0: 29.4, t1: 35.2, text: '“रोज़ उसके लिए पराठे बनाती हूँ…|शायद आज आ जाए।”', who: 'A', vo: 'a3', vt: 29.4 },
  { t0: 35.5, t1: 39.3, text: 'अगली रात… रिया ख़ुद|13वें फ्लोर पर गई।', who: 'N', vo: 'n5', vt: 35.5 },
  { t0: 40.6, t1: 42.5, text: '“आ गई बेटा?”', who: 'A', vo: 'a4', vt: 40.6 },
  { t0: 42.7, t1: 45.6, text: '“हाँ अम्मा… आ गई।”', who: 'R', vo: 'r1', vt: 42.7 },
  { t0: 47.1, t1: 49.8, text: 'पर… 14वाँ फ्लोर?', who: 'N', vo: 'n6', vt: 47.15 },
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

// ——— layers ———
const BG = { f: layer(), l: layer() }, GLOW = layer(), RI = group(), AM = group(), GU = group(), MR = group(), PROP = group(), FG = group(),
  FX = layer(), SUBK = layer(), SUBT = layer();

// ——— shots: [t0, t1, set, cam0, cam1] ———
const SHOTS = [
  [0.0, 3.4, 'mirror', [6858, 2330, 2.8], [6858, 2300, 2.55]],
  [3.4, 9.6, 'lobby', [6820, 2120, 0.95], [6830, 2200, 1.12]],
  [9.6, 15.0, 'lobby', [6650, 2420, 2.3], [6650, 2470, 2.9]],
  [15.0, 21.6, 'corr', [4900, 1680, 0.92], [4900, 1760, 1.3]],
  [21.6, 27.0, 'room', [10900, 2000, 0.95], [11380, 1330, 1.8]],
  [27.0, 32.0, 'room', [10840, 2200, 1.2], [10860, 2180, 1.35]],
  [32.0, 34.4, 'panel', [930, 2100, 1.3], [930, 1700, 1.35]],
  [34.4, 39.2, 'lift', [2900, 2150, 1.05], [2900, 2250, 1.4]],
  [39.2, 44.6, 'corr', [4900, 2100, 0.95], [4900, 2150, 1.1]],
  [44.6, 47.2, 'panel', [900, 960, 1.3], [900, 940, 1.55]],
  [47.2, 50.01, 'end', [900, 1000, 1.15], [900, 1000, 1.2]],
];
function shotAt(t) { return SHOTS.find(s => t >= s[0] && t < s[1]) || SHOTS[SHOTS.length - 1]; }
const HITS = [[0.05, 8], [45.0, 22]];
function shake(t) {
  let x = 0, y = 0;
  for (const [h, a] of HITS) { const d = t - h; if (d < 0 || d > 0.6) continue; const e = a * Math.exp(-d / 0.09); x += (hash(BOIL.step * 3.1 + h) - .5) * 2 * e; y += (hash(BOIL.step * 5.7 + h) - .5) * 2 * e; }
  return [x, y];
}
function flick(t, set) {
  if (set === 'corr') return t < 39.2 ? 0.95 + 0.05 * hash(BOIL.step * 0.37) : 1;
  if (set === 'panel' && t > 45.0 && t < 45.5) return (BOIL.step % 2) ? 0.4 : 1;
  return 1;
}

// ——— helpers ———
function seg7(L, ch, x, y, h, col, p = 1, sd = 1) {
  const w = h * 0.5, m = [[x - w / 2, y], [x + w / 2, y], [x + w / 2, y + h / 2], [x + w / 2, y + h], [x - w / 2, y + h], [x - w / 2, y + h / 2]];
  const S = { a: [m[0], m[1]], b: [m[1], m[2]], c: [m[2], m[3]], d: [m[3], m[4]], e: [m[4], m[5]], f: [m[5], m[0]], g: [m[5], m[2]] };
  const D = { '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg', 'G': 'afedc', '-': 'g' };
  for (const s of (D[ch] || '')) { const [a, b] = S[s]; const ins = 0.12; const A = [lerp(a[0], b[0], ins), lerp(a[1], b[1], ins)], B = [lerp(a[0], b[0], 1 - ins), lerp(a[1], b[1], 1 - ins)];
    line(L, [A, B], { w: h * 0.11, col, p, seed: sd + s.charCodeAt(0), wob: 0.3, streak: 1 }); }
}
function poly(L, pts, col, p = 0.85, o = {}) { fill(L, pts, { col, p, gap: o.gap ?? 9, w: o.w ?? 10, ang: o.ang ?? 0.6, seed: o.seed ?? 1, boil: o.boil ?? 0.3, over: o.over ?? 4 }); }
function edge(L, pts, col, w = 4, p = 0.6, sd = 1, closed = true) { line(L, closed ? [...pts, pts[0]] : pts, { w, col, p, seed: sd, boil: 0.5 }); }
function scr2w(X, Y) { return [(X - W / 2) / CAM.s + CAM.x, (Y - H / 2) / CAM.s + CAM.y]; }
function clipTo(C, r) {
  for (const L of [C.k, C.f, C.l]) { const g = L.g; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'destination-in'; g.fillStyle = '#000'; g.fillRect(sx(r[0]), sy(r[1]), (r[2] - r[0]) * CAM.s, (r[3] - r[1]) * CAM.s); g.restore(); }
}
function lampAt(x, y, rad, w) { return [sx(x) / W, 1 - sy(y) / H, rad, w]; }

// ——— SET: the lift's control panel (close-up) ———
const DISPLAY = t => {
  if (t >= 32.0 && t < 34.4) { if (t < 32.8) return '11'; if (t < 33.5) return '12'; return '13'; }
  if (t >= 45.0) return (t < 45.5 && BOIL.step % 2) ? '13' : '14';
  return '13';
};
const BTN = []; for (let r = 0; r < 6; r++) for (let c = 0; c < 2; c++) BTN.push({ n: 12 - r * 2 - (1 - c), x: 720 + c * 360, y: 1360 + r * 230 });
const CLOSE = [1080, 2760], OPEN = [720, 2760];
const PRESSES = [];
function drawPanel(t) {
  const B = BG;
  poly(B.f, rect(300, 300, 1500, 3200), K.steelD, 0.9, { gap: 7, w: 9, ang: 1.57, seed: 10 });
  for (let i = 0; i < 9; i++) line(B.l, [[340 + i * 135, 320], [350 + i * 135, 3180]], { w: 3, col: K.steel, p: 0.25, seed: 20 + i, boil: 0.2 });
  edge(B.l, rect(300, 300, 1500, 3200), K.steelL, 6, 0.7, 30);
  for (const [x, y] of [[360, 360], [1440, 360], [360, 3140], [1440, 3140]]) dab(B.l, x, y, 14, { col: K.steel, p: 0.8, seed: x + y });
  poly(B.f, rect(520, 640, 1280, 1080), '#1a0c0c', 0.95, { gap: 6, w: 8, seed: 40 });
  edge(B.l, rect(520, 640, 1280, 1080), K.steelL, 7, 0.8, 41);
  const d = DISPLAY(t), is13 = d === '13';
  const flk = is13 ? (t < 2.6 ? ((BOIL.step % 2) ? 0.55 : 1) : 0.75 + 0.25 * hash(BOIL.step)) : 0.95;
  const ch = d.split(''), dh = 300, gap = 250, x0 = 900 - (ch.length - 1) * gap / 2;
  ch.forEach((c, i) => { seg7(GLOW, c, x0 + i * gap, 710, dh, K.red, flk, 50 + i * 9); seg7(BG.f, c, x0 + i * gap, 710, dh, K.redD, 0.35, 70 + i * 9); });
  const up = !(t >= 27.65 && t < 28.6);
  line(GLOW, up ? [[580, 900], [620, 840], [660, 900]] : [[580, 840], [620, 900], [660, 840]], { w: 10, col: K.red, p: 0.8 * flk, seed: 90 });
  for (const b of BTN) {
    poly(B.f, handCircle(b.x, b.y, 78, b.n * 3, 0, 30), K.steel, 0.75, { gap: 6, w: 8, seed: 100 + b.n });
    edge(B.l, handCircle(b.x, b.y, 78, b.n * 3 + 1, 0.06, 30), K.steelL, 5, 0.7, 120 + b.n, false);
    edge(B.l, handCircle(b.x, b.y, 62, b.n * 3 + 2, 0.06, 30), K.dgrey, 3, 0.6, 140 + b.n, false);
    wtext(B.l, String(b.n), b.x, b.y + 26, { size: 74, weight: 700, col: K.ink, seed: 160 + b.n, boil: 0.4 });
  }
  const pressN = PRESSES.filter(p => t >= p && t < p + 0.25).length;
  for (const [c, kind] of [[OPEN, 'o'], [CLOSE, 'c']]) {
    const lit = kind === 'c' && pressN > 0;
    poly(B.f, handCircle(c[0], c[1], 92, kind === 'o' ? 7 : 8, 0, 30), lit ? K.amber : K.steel, lit ? 0.9 : 0.75, { gap: 6, w: 8, seed: kind === 'o' ? 180 : 181 });
    edge(B.l, handCircle(c[0], c[1], 92, kind === 'o' ? 9 : 10, 0.06, 30), K.steelL, 5, 0.7, kind === 'o' ? 182 : 183, false);
    const [x, y] = c, s = 30;
    if (kind === 'o') { line(B.l, [[x - 8, y - s], [x - 8 - s, y], [x - 8, y + s]], { w: 8, col: K.ink, seed: 190 }); line(B.l, [[x + 8, y - s], [x + 8 + s, y], [x + 8, y + s]], { w: 8, col: K.ink, seed: 191 }); }
    else { line(B.l, [[x - 8 - s, y - s], [x - 8, y], [x - 8 - s, y + s]], { w: 8, col: K.ink, seed: 192 }); line(B.l, [[x + 8 + s, y - s], [x + 8, y], [x + 8 + s, y + s]], { w: 8, col: K.ink, seed: 193 }); }
  }
}
function drawPressHand(C, t) {
  let k = 0; for (const p of PRESSES) { const d = t - p; if (d > -0.18 && d < 0.2) k = Math.max(k, d < 0 ? 1 + d / 0.18 : 1 - d / 0.2); }
  const tip = [CLOSE[0] + 20 + (1 - k) * 90 + 6 * Math.sin(t * 40), CLOSE[1] + 30 + (1 - k) * 140];
  const wrist = [tip[0] + 200, tip[1] + 330], elbow = [wrist[0] + 260, wrist[1] + 520];
  part(C, tube([elbow, wrist], 170, 130), { col: K.kurta, p: 0.85, gap: 9, w: 10, seed: 210 }, { w: 6, col: K.ink, seed: 211 });
  part(C, smooth([[wrist[0] - 75, wrist[1] - 20], [tip[0] - 30, tip[1] - 10], [tip[0] - 4, tip[1] - 40], [tip[0] + 30, tip[1] - 20], [tip[0] + 60, tip[1] + 60], [wrist[0] + 70, wrist[1] + 30]], 5), { col: K.skin, p: 0.85, gap: 7, w: 9, seed: 212 }, { w: 5, col: K.ink, seed: 213 });
  for (let i = 0; i < 3; i++) line(C.l, [[tip[0] + 40 + i * 24, tip[1] + 30 + i * 20], [wrist[0] - 10 + i * 30, wrist[1] - 40 + i * 14]], { w: 4, col: K.ink, p: 0.6, seed: 214 + i });
  for (let i = 0; i < 2; i++) line(C.l, [[wrist[0] - 70, wrist[1] + 10 + i * 18], [wrist[0] + 72, wrist[1] + 40 + i * 18]], { w: 4, col: K.teal, p: 0.8, seed: 218 + i });
}

// ——— SET: inside the lift (we stand at the doors) ———
function drawLift(t) {
  const B = BG, L0 = 2000, R0 = 3800;
  const bw = [2330, 1000, 3470, 2700];
  poly(B.f, [[L0, 300], [bw[0], bw[1]], [bw[0], bw[3]], [L0, 3300]], K.steelD, 0.8, { ang: 1.2, seed: 300 });
  poly(B.f, [[R0, 300], [bw[2], bw[1]], [bw[2], bw[3]], [R0, 3300]], K.steelD, 0.8, { ang: 1.9, seed: 301 });
  poly(B.f, rect(...bw), K.steelD, 0.62, { ang: 1.57, seed: 302 });
  poly(B.f, [[L0, 300], [R0, 300], [bw[2], bw[1]], [bw[0], bw[1]]], K.dgrey, 0.8, { seed: 303 });
  poly(B.f, [[L0, 3300], [R0, 3300], [bw[2], bw[3]], [bw[0], bw[3]]], K.floor, 0.75, { ang: 0.1, seed: 304 });
  for (let i = 1; i < 6; i++) { const u = i / 6; line(B.l, [[lerp(bw[0], bw[2], u), bw[3]], [lerp(L0, R0, u), 3300]], { w: 3, col: K.grey, p: 0.35, seed: 310 + i }); }
  edge(B.l, rect(...bw), K.steel, 4, 0.5, 320);
  for (const [a, b] of [[[L0, 300], [bw[0], bw[1]]], [[R0, 300], [bw[2], bw[1]]], [[L0, 3300], [bw[0], bw[3]]], [[R0, 3300], [bw[2], bw[3]]]]) line(B.l, [a, b], { w: 4, col: K.steel, p: 0.5, seed: a[0] + b[1] });
  const lb = flick(t, 'lift');
  poly(GLOW, [[2560, 700], [3240, 700], [3200, 820], [2600, 820]], K.bulb, 0.9 * lb, { gap: 6, w: 8, seed: 330 });
  const mr = [2440, 1180, 3360, 2420];
  poly(B.f, rect(...mr), '#2b3036', 0.8, { gap: 7, w: 9, seed: 340 });
  for (let i = 0; i < 2; i++) line(B.l, [[2560 + i * 90, 1240], [2800 + i * 90, 2360]], { w: 22 - i * 10, col: K.steel, p: 0.18, seed: 341 + i });
  edge(B.l, rect(...mr), K.steelL, 6, 0.7, 345);
  line(B.l, [[2380, 2480], [3420, 2480]], { w: 14, col: K.steel, p: 0.8, seed: 350 });
  line(B.l, [[2380, 2496], [3420, 2496]], { w: 4, col: K.ink, p: 0.5, seed: 351 });
}

// ——— SET: the 13th-floor corridor (seen from the open lift) ———
const FAR = [4770, 1330, 5030, 1980];
function corrPt(side, u, v) {
  const nx = side < 0 ? 3950 : 5850, fx = side < 0 ? FAR[0] : FAR[2];
  const x = lerp(nx, fx, u), yF = lerp(3350, FAR[3], u), yC = lerp(350, FAR[1], u);
  return [x, lerp(yF, yC, v)];
}
function drawCorr(t) {
  const B = BG, b = flick(t, 'corr');
  for (const sd of [-1, 1]) poly(B.f, [corrPt(sd, 0, 0), corrPt(sd, 1, 0), corrPt(sd, 1, 1), corrPt(sd, 0, 1)], K.wallC, 0.42, { ang: sd < 0 ? 0.3 : -0.3, seed: 400 + sd, gap: 11 });
  for (const sd of [-1, 1]) poly(B.f, [corrPt(sd, 0, 0), corrPt(sd, 1, 0), corrPt(sd, 1, 0.38), corrPt(sd, 0, 0.38)], K.wallG, 0.55, { ang: sd < 0 ? 0.3 : -0.3, seed: 403 + sd, gap: 11 });
  poly(B.f, [corrPt(-1, 0, 0), corrPt(1, 0, 0), corrPt(1, 1, 0), corrPt(-1, 1, 0)], K.floor, 0.6, { ang: 0.05, seed: 406 });
  poly(B.f, [corrPt(-1, 0, 1), corrPt(1, 0, 1), corrPt(1, 1, 1), corrPt(-1, 1, 1)], K.dgrey, 0.45, { seed: 407 });
  poly(B.f, rect(...FAR), '#1d1a20', 0.9, { seed: 408 });
  for (let i = 1; i < 7; i++) { const u = 1 - Math.pow(1 - i / 7, 1.6); line(B.l, [corrPt(-1, u, 0), corrPt(1, u, 0)], { w: 3, col: K.grey, p: 0.3, seed: 410 + i }); }
  for (const sd of [-1, 1]) for (const v of [0, 1, 0.38]) line(B.l, [corrPt(sd, 0, v), corrPt(sd, 1, v)], { w: 4, col: K.chalk, p: 0.35, seed: 420 + sd * 3 + v * 7 });
  edge(B.l, rect(...FAR), K.chalk, 4, 0.4, 430);
  [[-1, 0.18, '1301'], [-1, 0.62, '1303'], [1, 0.3, '1302'], [1, 0.66, '1304']].forEach(([sd, u, n], i) => {
    const u1 = u + 0.13; const q = [corrPt(sd, u, 0), corrPt(sd, u1, 0), corrPt(sd, u1, 0.72), corrPt(sd, u, 0.72)];
    poly(B.f, q, K.wood, 0.55, { ang: 1.57, seed: 440 + i });
    edge(B.l, q, K.chalk, 4, 0.45, 450 + i);
    const c = corrPt(sd, u + 0.065, 0.6), sc = lerp(1, 0.35, u);
    wtext(B.l, n, c[0], c[1], { size: 46 * sc, weight: 700, col: K.chalk, p: 0.5, seed: 460 + i, boil: 0.3 });
    const kn = corrPt(sd, u + (sd < 0 ? 0.11 : 0.02), 0.36); dab(B.l, kn[0], kn[1], 9 * sc, { col: K.amber, p: 0.6, seed: 470 + i });
  });
  const cq = [corrPt(-1, 0.36, 0.48), corrPt(-1, 0.47, 0.48), corrPt(-1, 0.47, 0.8), corrPt(-1, 0.36, 0.8)];
  poly(B.f, cq, K.cream, 0.7, { seed: 480 });
  edge(B.l, cq, K.ink, 4, 0.6, 481);
  const cc = corrPt(-1, 0.415, 0.74); wtext(B.l, '1996', cc[0], cc[1] + 10, { size: 44, weight: 700, col: K.redD, seed: 482, boil: 0.4, rot: 0.08 });
  for (let r = 0; r < 4; r++) { const a = corrPt(-1, 0.37, 0.52 + r * 0.045), bb = corrPt(-1, 0.46, 0.52 + r * 0.045); line(B.l, [a, bb], { w: 2.5, col: K.ink, p: 0.5, seed: 483 + r }); }
  for (const sd of [-1, 1]) { const c = corrPt(sd, 0.02, 0.98); for (let i = 0; i < 5; i++) { const a = i * 0.32; line(B.l, [c, [c[0] - sd * Math.cos(a) * 260, c[1] + Math.sin(a) * 260 + 20]], { w: 2, col: K.chalk, p: 0.35, seed: 490 + i + sd * 9 }); } }
  const bx = 4900, by = 980 + 6 * Math.sin(t * 1.7);
  line(B.l, [[4900, 640], [bx, by - 40]], { w: 3, col: K.ink, p: 0.9, seed: 500 });
  poly(GLOW, handCircle(bx, by, 34, 501, 0, 20), K.bulb, 0.95 * b, { gap: 4, w: 6, seed: 502 });
  if (b > 0.3) for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + 0.2, r1 = 80 + 20 * hash(i + BOIL.step); line(GLOW, [[bx + Math.cos(a) * 52, by + Math.sin(a) * 52], [bx + Math.cos(a) * r1, by + Math.sin(a) * r1]], { w: 4, col: K.bulb, p: 0.5 * b, seed: 503 + i }); }
  if (b > 0.2) poly(GLOW, smooth([[4600, 2350], [5200, 2350], [5420, 2650], [4380, 2650]], 6), K.amber, 0.12 * b, { gap: 12, w: 12, seed: 515 });
}
function drawLiftDoors(C, t) {
  const [l, top] = scr2w(0, 0), [r, bot] = scr2w(W, H);
  const fw = 95 / CAM.s, u = 0;
  const half = (r - l) / 2, mid = (l + r) / 2;
  const wL = fw + (half - fw) * u, wR = wL;
  part(C, rect(l - 50, top - 50, l + wL, bot + 50), { col: K.steelD, p: 0.92, gap: 6, w: 8, ang: 1.57, seed: 520 }, { w: 6, col: K.steelL, seed: 521 });
  part(C, rect(r - wR, top - 50, r + 50, bot + 50), { col: K.steelD, p: 0.92, gap: 6, w: 8, ang: 1.57, seed: 522 }, { w: 6, col: K.steelL, seed: 523 });
  for (let i = 0; i < 4; i++) { line(C.l, [[l + wL - 20 - i * 60, top], [l + wL - 20 - i * 60, bot]], { w: 3, col: K.steel, p: 0.25, seed: 524 + i }); line(C.l, [[r - wR + 20 + i * 60, top], [r - wR + 20 + i * 60, bot]], { w: 3, col: K.steel, p: 0.25, seed: 530 + i }); }
  if (u >= 1) line(C.l, [[mid, top], [mid, bot]], { w: 6, col: K.ink, p: 0.9, seed: 540 });
}

// ——— SET: ground-floor lobby ———
const LDOOR = [6560, 1480, 7140, 2720], LMIR = [6690, 1700, 7010, 2470];
function drawLobby(t) {
  const B = BG, L0 = 5900, R0 = 7900;
  poly(B.f, rect(L0, 400, R0, 2050), K.wallC, 0.45, { ang: 0.2, seed: 600, gap: 11 });
  poly(B.f, rect(L0, 2050, R0, 2720), K.wallG, 0.6, { ang: 0.2, seed: 601, gap: 11 });
  line(B.l, [[L0, 2050], [R0, 2050]], { w: 5, col: K.chalk, p: 0.5, seed: 602 });
  poly(B.f, rect(L0, 2720, R0, 3400), K.floor, 0.62, { ang: 0.05, seed: 603 });
  for (let i = 0; i < 9; i++) line(B.l, [[6850 + (i - 4) * 120, 2720], [6850 + (i - 4) * 420, 3400]], { w: 3, col: K.grey, p: 0.28, seed: 610 + i });
  for (let i = 0; i < 3; i++) { const y = 2720 + [60, 190, 400][i]; line(B.l, [[L0, y], [R0, y]], { w: 3, col: K.grey, p: 0.28, seed: 620 + i }); }
  poly(B.f, rect(LDOOR[0] - 60, LDOOR[1] - 140, LDOOR[2] + 60, LDOOR[3]), K.steelD, 0.85, { ang: 1.57, seed: 630 });
  const open = 1;
  poly(B.f, rect(...LDOOR), K.steel, 0.5, { ang: 1.57, seed: 631 });
  poly(B.f, rect(LMIR[0] - 30, LMIR[1] - 30, LMIR[2] + 30, LMIR[3] + 30), K.steelD, 0.7, { seed: 632 });
  poly(B.f, rect(...LMIR), '#2b3036', 0.85, { seed: 633 });
  edge(B.l, rect(...LMIR), K.steelL, 5, 0.7, 634);
  line(B.l, [[LMIR[0] + 40, LMIR[1] + 30], [LMIR[0] + 160, LMIR[3] - 40]], { w: 16, col: K.steel, p: 0.15, seed: 635 });
  poly(GLOW, rect(LDOOR[0] + 80, LDOOR[1] + 14, LDOOR[2] - 80, LDOOR[1] + 60), K.bulb, 0.7 * flick(t, 'lobby'), { gap: 5, w: 7, seed: 636 });
  const dw = (LDOOR[2] - LDOOR[0]) / 2 * (1 - open);
  if (dw > 2) { poly(B.f, rect(LDOOR[0], LDOOR[1], LDOOR[0] + dw, LDOOR[3]), K.steelD, 0.95, { ang: 1.57, seed: 637 }); poly(B.f, rect(LDOOR[2] - dw, LDOOR[1], LDOOR[2], LDOOR[3]), K.steelD, 0.95, { ang: 1.57, seed: 638 }); }
  edge(B.l, rect(LDOOR[0] - 60, LDOOR[1] - 140, LDOOR[2] + 60, LDOOR[3]), K.steelL, 5, 0.6, 639);
  poly(B.f, rect(6760, 1360, 6940, 1460), '#1a0c0c', 0.95, { seed: 640 });
  seg7(GLOW, 'G', 6850, 1372, 76, K.red, 0.85, 641);
  poly(GLOW, rect(6200, 760, 6500, 800), K.white, 0.8 * flick(t, 'lobby'), { gap: 5, w: 7, seed: 650 });
  poly(B.f, rect(5980, 1300, 6320, 1760), K.wood, 0.6, { seed: 655 });
  for (let i = 0; i < 4; i++) poly(B.f, rect(6010 + (i % 2) * 150, 1330 + Math.floor(i / 2) * 200, 6140 + (i % 2) * 150, 1500 + Math.floor(i / 2) * 200), K.cream, 0.55, { seed: 656 + i });
  wtext(B.l, 'सूचना', 6150, 1290, { size: 46, weight: 700, col: K.chalk, seed: 660, p: 0.7 });
}
function drawDesk(C) {
  const g0 = 2690;
  part(C, rect(7180, g0, 7840, 3060), { col: K.wood, p: 0.85, gap: 8, w: 10, ang: 0.1, seed: 670 }, { w: 6, col: K.ink, seed: 671 });
  part(C, rect(7150, g0 - 30, 7870, g0 + 10), { col: K.cream, p: 0.6, gap: 6, w: 8, seed: 672 }, { w: 5, col: K.ink, seed: 673 });
  part(C, [[7230, g0 - 34], [7470, g0 - 50], [7480, g0 - 18], [7240, g0 - 6]], { col: K.white, p: 0.8, gap: 5, w: 7, seed: 674 }, { w: 3.5, col: K.ink, seed: 675 });
}

// ——— SET: the tiffin in her hands (close-up) ———
function drawTiffinCU() {
  const B = BG;
  poly(B.f, rect(7950, 300, 9850, 3300), K.wallG, 0.35, { seed: 700, gap: 13 });
  poly(B.f, rect(7950, 2300, 9850, 3300), K.kurtaD, 0.55, { seed: 701, gap: 11, ang: 1.2 });
}
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

// ——— SET: amma's room on the 13th floor (warm) ———
function drawRoom(t) {
  const B = BG, L0 = 9950, R0 = 11950;
  poly(B.f, rect(L0, 400, R0, 2600), '#8a6a45', 0.75, { ang: 0.2, seed: 1000, gap: 11 });
  poly(B.f, rect(L0, 2050, R0, 2600), '#6e5338', 0.8, { ang: 0.2, seed: 1001 });
  line(B.l, [[L0, 2050], [R0, 2050]], { w: 5, col: K.cream, p: 0.5, seed: 1002 });
  poly(B.f, rect(L0, 2600, R0, 3400), '#5c4636', 0.85, { ang: 0.05, seed: 1003 });
  for (let i = 0; i < 6; i++) line(B.l, [[L0, 2700 + i * 120], [R0, 2700 + i * 120]], { w: 3, col: K.ink, p: 0.25, seed: 1004 + i });
  // doorway on the left (where Riya stands): the dark corridor beyond
  poly(B.f, rect(10430, 1250, 10770, 2600), '#26222a', 0.95, { seed: 1010 });
  edge(B.l, rect(10430, 1250, 10770, 2600), K.wood, 12, 0.9, 1011);
  // window: night, a thin moon
  poly(B.f, rect(10010, 900, 10350, 1500), '#1d2238', 0.95, { seed: 1020 });
  dab(B.f, 10270, 1020, 34, { col: K.cream, p: 0.95, seed: 1021 }); dab(B.f, 10286, 1012, 30, { col: '#1d2238', p: 1, seed: 1022 });
  edge(B.l, rect(10010, 900, 10350, 1500), K.wood, 10, 0.9, 1023); line(B.l, [[10180, 900], [10180, 1500]], { w: 8, col: K.wood, seed: 1024 }); line(B.l, [[10010, 1200], [10350, 1200]], { w: 8, col: K.wood, seed: 1025 });
  // the photo of the other Riya (a girl in school uniform, two plaits) + a name strip
  const px = 11380, py = 1420;
  poly(B.f, rect(px - 150, py - 190, px + 150, py + 190), K.wood, 0.95, { seed: 1030 });
  poly(B.f, rect(px - 120, py - 160, px + 120, py + 160), '#cfd8dc', 0.95, { seed: 1031 });
  part(PROP, handCircle(px, py - 50, 52, 1032, 0, 30), { col: K.skin, p: 0.9, gap: 5, w: 7, seed: 1033 }, { w: 4, col: K.ink, seed: 1034 });
  part(PROP, smooth([[px - 56, py - 50], [px - 50, py - 100], [px, py - 112], [px + 50, py - 100], [px + 56, py - 50], [px + 36, py - 82], [px - 36, py - 82]], 4), { col: K.hair, p: 0.95, gap: 5, w: 7, seed: 1035 }, { w: 3, col: K.ink, seed: 1036 });
  for (const sg of [-1, 1]) part(PROP, smooth([[px + sg * 54, py - 60], [px + sg * 70, py + 20], [px + sg * 58, py + 70], [px + sg * 46, py + 20]], 4), { col: K.hair, p: 0.95, gap: 4, w: 6, seed: 1037 + sg }, { w: 3, col: K.ink, seed: 1039 + sg });
  for (const sg of [-1, 1]) dab(PROP.l, px + sg * 18, py - 52, 6, { col: K.ink, p: 1, seed: 1041 + sg });
  line(PROP.l, smooth([[px - 16, py - 26], [px, py - 18], [px + 16, py - 26]], 5, false), { w: 4, col: K.ink, seed: 1043 });
  part(PROP, [[px - 90, py + 160], [px - 70, py + 10], [px + 70, py + 10], [px + 90, py + 160]], { col: '#e8e3d6', p: 0.95, gap: 5, w: 7, seed: 1044 }, { w: 4, col: K.ink, seed: 1045 });
  line(PROP.l, [[px - 10, py + 12], [px, py + 60], [px + 10, py + 12]], { w: 8, col: K.kurtaD, seed: 1046 });
  wtext(B.l, 'रिया', px, py + 250, { size: 54, weight: 700, col: K.cream, seed: 1047 });
  // shelf of steel tiffins (one for every night)
  poly(B.f, rect(11600, 1600, 11920, 1630), K.wood, 0.95, { seed: 1050 });
  poly(B.f, rect(11600, 1960, 11920, 1990), K.wood, 0.95, { seed: 1051 });
  for (let r = 0; r < 2; r++) for (let i = 0; i < 2; i++) drawTiffin(PROP, 11680 + i * 160, 1600 + r * 360, 0.42, 1060 + r * 10 + i);
  // the stove table (drawn over amma's legs: see frame)
  // a hanging bulb, warm
  line(B.l, [[11050, 400], [11050, 820]], { w: 3, col: K.ink, seed: 1080 });
  poly(GLOW, handCircle(11050, 860, 34, 1081, 0, 20), K.bulb, 0.95, { gap: 4, w: 6, seed: 1082 });
}
function drawStove(C, t) {
  part(C, rect(10650, 2380, 11450, 3150), { col: K.wood, p: 0.92, gap: 8, w: 10, ang: 0.1, seed: 1090 }, { w: 6, col: K.ink, seed: 1091 });
  part(C, rect(10620, 2350, 11480, 2400), { col: K.cream, p: 0.85, gap: 6, w: 8, seed: 1092 }, { w: 4, col: K.ink, seed: 1093 });
  part(C, rect(10780, 2290, 11080, 2350), { col: K.steelD, p: 0.95, gap: 5, w: 7, seed: 1094 }, { w: 4, col: K.ink, seed: 1095 });   // stove
  part(C, smooth([[10770, 2285], [11090, 2285], [11060, 2262], [10800, 2262]], 4), { col: K.ink, p: 0.95, gap: 4, w: 6, seed: 1096 }, null);   // tawa
  part(C, smooth([[10850, 2262], [11010, 2262], [10990, 2240], [10870, 2240]], 4), { col: '#d9a35b', p: 0.95, gap: 4, w: 6, seed: 1097 }, { w: 3, col: K.wood, seed: 1098 });   // paratha
  steam(FX, 10930, 2230, 0.9, t, 3, 0.45);
  drawTiffin(C, 11300, 2350, 0.45, 1099);
}
function drawCan(C, x, y, k = 1, sd = 1200) {   // a small steel milk can, centre x, bottom y
  part(C, smooth([[x - 46 * k, y - 120 * k], [x + 46 * k, y - 120 * k], [x + 54 * k, y - 10 * k], [x, y + 6 * k], [x - 54 * k, y - 10 * k]], 4), { col: K.steel, p: 0.9, gap: 5, w: 7, seed: sd }, { w: 4, col: K.ink, seed: sd + 1 });
  part(C, smooth([[x - 40 * k, y - 120 * k], [x, y - 138 * k], [x + 40 * k, y - 120 * k]], 4, false).concat([[x + 40 * k, y - 112 * k], [x - 40 * k, y - 112 * k]]), { col: K.steelL, p: 0.9, gap: 4, w: 6, seed: sd + 2 }, { w: 3, col: K.ink, seed: sd + 3 });
  line(C.l, smooth([[x - 44 * k, y - 118 * k], [x, y - 200 * k], [x + 44 * k, y - 118 * k]], 6, false), { w: 6 * k + 1, col: K.steelD, seed: sd + 4 });
}

// ——— characters ———
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
function person(C, s, sd) {
  const k = s.k ?? 1, kind = s.kind, fx = s.fx ?? 1, ax = Math.max(0.12, Math.abs(fx)), back = fx < 0;
  const hy = s.hy ?? (s.gy - AH * k);
  const P = (dx, dy) => [s.x + dx * ax * k, hy + dy * k];
  const tp = pts => pts.map(([dx, dy]) => P(dx, dy));
  WMUL.k = clamp(Math.sqrt(k), 0.45, 1.25);
  const skin = { col: kind === 'amma' ? K.skinO : K.skin, p: 0.85, gap: 7, w: 9, ang: 0.5, seed: sd + 1 };
  const O = (w, sdd, col = K.ink) => ({ w, col, seed: sdd, p: 0.8 });
  if (kind === 'amma') {
    const hem = 640;
    part(C, tp(smooth([[-46, 60], [46, 60], [70, 200], [92, hem - 20], [96, hem + 6], [0, hem + 14], [-96, hem + 6], [-92, hem - 20], [-70, 200]], 3)), { col: K.saree, p: 0.8, gap: 9, w: 10, ang: 1.3, seed: sd + 2 }, O(6, sd + 3));
    line(C.l, tp([[-96, hem - 18], [96, hem - 18]]), { w: 6, col: K.shawlD, seed: sd + 4, p: 0.8 });
    for (let i = 0; i < 4; i++) line(C.l, tp([[-30 + i * 22, 300], [-50 + i * 34, hem - 30]]), { w: 3, col: K.grey, seed: sd + 5 + i, p: 0.5 });
  } else {
    for (const [side, sg] of [['L', -1], ['R', 1]]) {
      const hip = P(sg * 24, 330), ft = s.feet[side];
      const [kn, f] = ik(hip, ft, 178 * k, 178 * k, sg);
      part(C, tube([hip, kn, f], 44 * k, 34 * k), { col: kind === 'guard' ? K.khakiD : K.jeans, p: 0.85, gap: 7, w: 9, ang: 1.3, seed: sd + 2 + sg }, O(5, sd + 4 + sg));
      const shoe = smooth([[f[0] - 26 * k, f[1] - 10 * k], [f[0] + sg * 6 * k + 22 * k, f[1] - 12 * k], [f[0] + sg * 30 * k, f[1] + 4 * k], [f[0] - 22 * sg * k, f[1] + 10 * k]], 4);
      part(C, shoe, { col: kind === 'guard' ? K.ink : K.white, p: 0.9, gap: 5, w: 7, seed: sd + 6 + sg }, O(4.5, sd + 8 + sg));
    }
  }
  if (kind === 'riya' && !back) part(C, tp(smooth([[-54, -20], [-48, -60], [0, -72], [48, -60], [56, -20], [60, 40], [-60, 40]], 6)), { col: K.hair, p: 0.95, gap: 7, w: 9, ang: 1.2, seed: sd + 12 }, O(5, sd + 13));
  if (kind === 'riya') {
    part(C, tp(smooth([[-15, 48], [15, 48], [48, 62], [56, 140], [60, 300], [66, 420], [0, 428], [-66, 420], [-60, 300], [-56, 140], [-48, 62]], 3)), { col: K.kurta, p: 0.85, gap: 9, w: 10, ang: 0.9, seed: sd + 14 }, O(6, sd + 15));
    for (let i = 0; i < 2; i++) line(C.l, tp([[-60, 400 - i * 16], [60, 400 - i * 16]]), { w: 3, col: K.white, seed: sd + 16 + i, p: 0.5 });
    line(C.l, tp([[30, 52], [58, 210], [70, 300]]), { w: 9, col: K.bag, seed: sd + 18, p: 0.9 });
    if (!back) part(C, tp([[56, 280], [128, 270], [140, 420], [66, 430]]), { col: K.bag, p: 0.85, gap: 7, w: 9, seed: sd + 19 }, O(5, sd + 20));
  } else if (kind === 'guard') {
    part(C, tp(smooth([[-15, 48], [15, 48], [54, 62], [62, 140], [62, 330], [0, 336], [-62, 330], [-62, 140], [-54, 62]], 3)), { col: K.khaki, p: 0.85, gap: 9, w: 10, ang: 0.9, seed: sd + 14 }, O(6, sd + 15));
    line(C.l, tp([[-62, 320], [62, 320]]), { w: 9, col: K.ink, seed: sd + 16 });
    if (!back) { line(C.l, tp([[0, 60], [0, 320]]), { w: 3, col: K.khakiD, seed: sd + 17 }); for (let i = 0; i < 4; i++) dab(C.l, ...tp([[0, 90 + i * 55]])[0], 4 * k + 1, { col: K.cream, p: 0.9, seed: sd + 18 + i });
      part(C, tp([[-50, 110], [-18, 110], [-18, 150], [-50, 150]]), { col: K.khakiD, p: 0.7, gap: 5, w: 7, seed: sd + 23 }, O(3, sd + 24)); }
    for (const sg of [-1, 1]) line(C.l, tp([[sg * 30, 58], [sg * 54, 70]]), { w: 7, col: K.khakiD, seed: sd + 25 + sg });
  } else {
    part(C, tp(smooth([[-15, 48], [15, 48], [50, 62], [60, 160], [64, 260], [0, 268], [-64, 260], [-60, 160], [-50, 62]], 3)), { col: K.saree, p: 0.8, gap: 9, w: 10, ang: 0.9, seed: sd + 14 }, O(5, sd + 15));
  }
  part(C, tp([[-11, 30], [11, 30], [12, 56], [-12, 56]]), skin, O(4.5, sd + 40));
  if (kind !== 'amma') for (const sg of [-1, 1]) part(C, tp(handCircle(sg * 50, 6, 11, sd + 41 + sg, 0, 16)), skin, O(4.5, sd + 43 + sg));
  part(C, tp(handCircle(0, 0, 50, sd + 45, 0.06, 44)), skin, O(6, sd + 46));
  if (back) {
    part(C, tp(handCircle(0, -6, 53, sd + 47, 0.06, 40)), { col: K.hair, p: 0.97, gap: 6, w: 9, ang: 1.0, seed: sd + 48 }, O(5, sd + 49));
    if (kind === 'riya') part(C, tp(smooth([[-14, 20], [14, 20], [18, 120], [6, 190], [-6, 190], [-18, 120]], 4)), { col: K.hair, p: 0.97, gap: 6, w: 9, seed: sd + 50 }, O(5, sd + 51));
  } else if (kind === 'riya') {
    part(C, tp(smooth([[-55, 2], [-52, -40], [-30, -62], [0, -66], [30, -62], [52, -40], [55, 2], [44, -24], [20, -36], [0, -34], [-26, -38], [-46, -22]], 5)), { col: K.hair, p: 0.97, gap: 6, w: 9, ang: 1.0, seed: sd + 50 }, O(5, sd + 51));
    if (ax > 0.5) face(C, tp, s, sd);
    if (s.buds !== false) for (const sg of [-1, 1]) { if (s.buds === 'R' && sg > 0) continue; const e = tp([[sg * 50, 12]])[0]; dab(C.l, e[0], e[1], 6 * k + 1, { col: K.white, p: 1, seed: sd + 55 + sg }); line(C.l, [e, ...tp([[sg * 30, 90], [0, 170]])], { w: 2.5, col: K.white, p: 0.7, seed: sd + 57 + sg }); }
    dab(C.l, ...tp([[0, -22]])[0], 3.5 * k + 0.5, { col: K.redD, p: 0.9, seed: sd + 59 });
  } else if (kind === 'guard') {
    part(C, tp(smooth([[-55, -10], [-52, -50], [0, -68], [52, -50], [56, -10], [70, -6], [-70, -6]], 4)), { col: K.khakiD, p: 0.95, gap: 6, w: 8, seed: sd + 50 }, O(5, sd + 51));
    line(C.l, tp([[-62, -8], [62, -8]]), { w: 6, col: K.ink, seed: sd + 52 });
    if (ax > 0.5) { face(C, tp, s, sd); part(C, tp(smooth([[-26, 14], [0, 8], [26, 14], [20, 22], [0, 17], [-20, 22]], 4)), { col: K.hair, p: 0.95, gap: 4, w: 6, seed: sd + 53 }, O(3, sd + 54)); }
  } else {
    part(C, tp(smooth([[-50, -4], [-46, -40], [-20, -52], [20, -52], [46, -40], [50, -4], [30, -26], [0, -32], [-30, -26]], 5)), { col: K.white, p: 0.9, gap: 6, w: 8, seed: sd + 50 }, O(4, sd + 51));
    if (ax > 0.5) {
      face(C, tp, { ...s, noBrows: s.exp.eyes === 'glint', browCol: K.white }, sd);
      for (const sg of [-1, 1]) { line(C.l, tp(handCircle(sg * 19, -2, 16, sd + 54 + sg, 0.08, 22)), { w: 3.5, col: K.ink, seed: sd + 54 + sg }); line(C.l, tp([[sg * 34, 6], [sg * 40, 14]]), { w: 2.5, col: K.ink, p: 0.6, seed: sd + 60 + sg }); }
      line(C.l, tp([[-4, -3], [4, -3]]), { w: 3, col: K.ink, seed: sd + 57 });
      for (let i = 0; i < 2; i++) line(C.l, tp([[-14, -32 - i * 7], [14, -32 - i * 7]]), { w: 2.5, col: K.ink, p: 0.45, seed: sd + 62 + i });
    }
    const sw = 3 * Math.sin(q2(s.t) * 2);
    part(C, tp(smooth([[-62, 10], [-60, -50], [-30, -82], [30, -82], [60, -50], [62, 10], [70, 70], [118 + sw, 150], [126 + sw, 330], [80, 340], [62, 120], [44, 60], [52, 0], [40, -42], [0, -60], [-40, -42], [-52, 0], [-44, 60], [-62, 120], [-80, 340], [-126 - sw, 330], [-118 - sw, 150], [-70, 70]], 3)),
      { col: K.shawl, p: 0.85, gap: 8, w: 9, ang: 1.1, seed: sd + 70 }, O(5, sd + 71));
    for (let i = 0; i < 6; i++) dab(C.l, ...tp([[-118 + i * 4, 170 + i * 30]])[0], 4 * k + 1, { col: K.amber, p: 0.7, seed: sd + 72 + i });
  }
  const arms = {};
  const sleeve = kind === 'riya' ? K.kurta : kind === 'guard' ? K.khaki : K.shawl;
  for (const [side, sg] of [['L', -1], ['R', 1]]) {
    const shp = P(sg * 46, 68), [el, hd] = ik(shp, s.hands[side], 118 * k, 110 * k, sg);
    arms[side] = hd;
    if (kind === 'riya') part(C, tube([el, hd], 24 * k, 20 * k), skin, O(4.5, sd + 88 + sg));
    const sl = kind === 'riya' ? [shp, el, [lerp(el[0], hd[0], 0.55), lerp(el[1], hd[1], 0.55)]] : [shp, el, hd];
    part(C, tube(sl, 32 * k, 26 * k), { col: sleeve, p: 0.85, gap: 8, w: 9, ang: 0.4, seed: sd + 90 + sg }, O(5, sd + 92 + sg));
    if (kind === 'amma') for (let j = 0; j < 2; j++) line(C.l, [[hd[0] - 12 * k, hd[1] - 18 * k - j * 6 * k], [hd[0] + 12 * k, hd[1] - 18 * k - j * 6 * k]], { w: 3, col: K.amber, seed: sd + 95 + j + sg });
  }
  if (kind === 'riya' && !back) {   // lanyard + office ID card (the Part 2 clue, in plain sight)
    line(C.l, tp([[-14, 50], [-22, 120], [-6, 196]]), { w: 4, col: K.teal, seed: sd + 100, p: 0.9 }); line(C.l, tp([[14, 50], [22, 120], [6, 196]]), { w: 4, col: K.teal, seed: sd + 101, p: 0.9 });
    const sw = s.shiver ? 2 * Math.sin(q2(s.t) * 50) : 0;
    part(C, tp([[-26 + sw, 194], [26 + sw, 194], [26 + sw, 266], [-26 + sw, 266]]), { col: K.white, p: 0.95, gap: 4, w: 6, seed: sd + 102 }, O(3.5, sd + 103));
    part(C, tp([[-18 + sw, 202], [0 + sw, 202], [0 + sw, 224], [-18 + sw, 224]]), { col: K.kurtaD, p: 0.9, gap: 3, w: 4, seed: sd + 104 }, null);
    const c = P(sw, 252); wtext(C.l, 'RIYA', c[0], c[1], { size: 15 * k, weight: 700, col: K.ink, seed: sd + 105, boil: 0.2 });
    line(C.l, tp([[4 + sw, 210], [20 + sw, 210]]), { w: 2, col: K.ink, p: 0.6, seed: sd + 106 }); line(C.l, tp([[4 + sw, 218], [16 + sw, 218]]), { w: 2, col: K.ink, p: 0.6, seed: sd + 107 });
  }
  for (const it of s.items || []) {
    if (it.type === 'phone') { const h = arms[it.side]; part(C, [[h[0] - 22 * k, h[1] - 50 * k], [h[0] + 22 * k, h[1] - 50 * k], [h[0] + 22 * k, h[1] + 30 * k], [h[0] - 22 * k, h[1] + 30 * k]], { col: K.ink, p: 0.95, gap: 3, w: 5, seed: sd + 120 }, O(3, sd + 121)); fill(C.f, [[h[0] - 16 * k, h[1] - 44 * k], [h[0] + 16 * k, h[1] - 44 * k], [h[0] + 16 * k, h[1] + 20 * k], [h[0] - 16 * k, h[1] + 20 * k]], { col: '#9fc4e8', p: 0.7 * (it.glow ?? 1), gap: 3, w: 4, seed: sd + 122 }); }
    if (it.type === 'tiffin') { const h = it.side === 'both' ? [(arms.L[0] + arms.R[0]) / 2, (arms.L[1] + arms.R[1]) / 2] : arms[it.side]; const tk = it.tk || 0.55; drawTiffin(C, h[0], h[1] + (it.hang ? 330 * k * tk : 40 * k), k * tk, sd + 200); }
    if (it.type === 'glass') { const h = arms[it.side]; part(C, [[h[0] - 18 * k, h[1] - 60 * k], [h[0] + 18 * k, h[1] - 60 * k], [h[0] + 14 * k, h[1] + 4 * k], [h[0] - 14 * k, h[1] + 4 * k]], { col: K.amber, p: 0.7, gap: 3, w: 5, seed: sd + 130 }, O(3, sd + 131)); }
  }
  for (const side of ['L', 'R']) part(C, handCircle(arms[side][0], arms[side][1], 15 * k, sd + 160 + (side === 'L' ? 0 : 1), 0, 18), skin, O(4.5, sd + 162 + (side === 'L' ? 0 : 1)));
  WMUL.k = 1;
  s.head = P(0, 0);
  return arms;
}

// ——— acting ———
function talk(t, a, b) { return t > a && t < b && BOIL.step % 3 ? 'small' : 'smile'; }
function riyaLobby2(t) {
  const x = 6650, gy = 2980, k = 1.0, hy = gy - AH * k + (t < 6 ? 4 * Math.sin(q2(t) * 9) : 0);
  const exp = { eyes: 'pop', brows: 'worried', mouth: 'o' }; let look = [1, 0];
  if (t > 4.6) { exp.eyes = 'open'; exp.brows = 'up'; exp.mouth = 'small'; }
  if (t > 7.0) { exp.mouth = 'smile'; exp.brows = 'flat'; }
  if (t > 10.2 && t < 11.9) { look = [0.2, 1]; exp.brows = 'up'; exp.mouth = 'o'; }
  if (t > 12.4) { exp.eyes = 'closed'; exp.mouth = 'smile'; exp.brows = 'up'; }
  const hands = { L: [x - 70 * k, hy + 320 * k], R: t < 6.5 ? [x + 20 * k, hy + 170 * k] : [x + 75 * k, hy + 325 * k] };
  return { kind: 'riya', t, x, gy, k, fx: 1, hy, hands, feet: { L: [x - 34, gy], R: [x + 34, gy] }, exp, look, items: [{ type: 'tiffin', side: 'L', hang: true, tk: 0.5 }], buds: false };
}
function amma2(t) {
  const x = 7010, gy = 2950, k = 0.9, hy = gy - AH * k + 34 * k;
  const exp = { eyes: 'closed', brows: 'flat', mouth: talk(t, 4.0, 8.8) };
  let L = [x - 30 * k, hy + 290 * k];
  if (t > 4.0 && t < 8.8) L = [x - 90 * k, hy + 170 * k + 12 * Math.sin(q2(t) * 6)];
  if (t > 11.6) { L = [x - 150 * k, hy + 170 * k]; exp.mouth = talk(t, 11.9, 14.9); }
  return { kind: 'amma', t, x, gy, k, fx: 1, hy, hands: { L, R: [x + 60 * k, hy + 300 * k] }, feet: {}, exp, look: [-1, 0], items: [] };
}
function ammaCorr(t) {
  if (t < 39.2) {   // far end, by her lit door, beckoning
    const x = 4900, gy = 1962, k = 0.42, hy = gy - AH * k + 34 * k;
    const w = 20 * Math.sin(q2(t) * 5);
    return { kind: 'amma', t, x, gy, k, fx: 1, hy, hands: { L: [x - 70 * k, hy + 60 * k + w * k], R: [x + 30 * k, hy + 290 * k] }, feet: {}, exp: { eyes: 'closed', brows: 'flat', mouth: 'smile' }, look: [0, 0], items: [] };
  }
  const x = 4900, gy = 3020, k = 1.05, hy = gy - AH * k + 34 * k;
  const open = ss(pr(t, 41.9, 42.5));
  const hands = { L: [x - lerp(30, 170, open) * k, hy + lerp(290, 210, open) * k], R: [x + lerp(30, 170, open) * k, hy + lerp(290, 210, open) * k] };
  return { kind: 'amma', t, x, gy, k, fx: 1, hy, hands, feet: {}, exp: { eyes: 'closed', brows: 'flat', mouth: talk(t, 39.4, 41.0) }, look: [0, 0], items: [] };
}
function riyaWalk(t) {   // back view, walking into the corridor
  let x = 4780, gy, k;
  if (t < 39.2) { const u = pr(t, 15.0, 21.6); gy = lerp(3200, 2900, u); k = lerp(1.05, 0.85, u); }
  else { const u = eio(pr(t, 41.0, 43.2)); gy = lerp(3800, 3450, u); k = lerp(1.35, 1.2, u); x = 4720; }
  const step = Math.sin(q2(t) * 9), hy = gy - AH * k + 6 * Math.abs(step);
  return { kind: 'riya', t, x, gy, k, fx: -1, hy, hands: { L: [x - 90 * k, hy + 320 * k + 10 * step], R: [x + 90 * k, hy + 320 * k - 10 * step] }, feet: { L: [x - 34 * k, gy - 12 * Math.max(0, step)], R: [x + 34 * k, gy - 12 * Math.max(0, -step)] }, exp: { eyes: 'open', brows: 'flat', mouth: 'flat' }, look: [0, 0], items: [] };
}
function ammaRoom(t) {
  const x = 11050, gy = 2660, k = 1.0, hy = gy - AH * k + 34 * k;
  const f = 18 * Math.sin(q2(t) * 4);
  const exp = { eyes: 'closed', brows: 'flat', mouth: talk(t, 26.9, 31.6) }; let look = [0, 0.5];
  if (t > 29.4) { exp.eyes = 'open'; exp.brows = 'worried'; look = [1, -0.4]; }
  return { kind: 'amma', t, x, gy, k, fx: 1, hy, hands: { L: [x - 70, 2280 + f], R: [x + 60, 2275 - f] }, feet: {}, exp, look, items: [] };
}
function riyaRoom(t) {
  const x = 10600, gy = 3050, k = 1.0, hy = gy - AH * k;
  const exp = { eyes: 'open', brows: 'worried', mouth: 'small' };
  return { kind: 'riya', t, x, gy, k, fx: 1, hy, hands: { L: [x - 70 * k, hy + 320 * k], R: [x + 30 * k, hy + 175 * k] }, feet: { L: [x - 32, gy], R: [x + 32, gy] }, exp, look: [1, 0], items: [{ type: 'tiffin', side: 'L', hang: true, tk: 0.5 }], buds: false };
}
function riyaLift2(t) {
  const x = 2900, gy = 2960, k = 1.0, hy = gy - AH * k;
  const exp = { eyes: t > 36.5 ? 'closed' : 'open', brows: 'up', mouth: 'smile' };
  return { kind: 'riya', t, x, gy, k, fx: 1, hy, hands: { L: [x - 40, hy + 300], R: [x + 40, hy + 300] }, feet: { L: [x - 34, gy], R: [x + 34, gy] }, exp, look: [0, -0.6], items: [{ type: 'tiffin', side: 'both', tk: 0.5 }], buds: false };
}
function press12(C, t) {   // her finger presses 12 (the faulty button that goes to 13)
  const B = BTN.find(b => b.n === 12), d = t - 32.6, k = d > -0.2 && d < 0.25 ? (d < 0 ? 1 + d / 0.2 : 1 - d / 0.25) : 0;
  const tip = [B.x + 20 + (1 - k) * 90, B.y + 30 + (1 - k) * 140], wrist = [tip[0] + 200, tip[1] + 330], elbow = [wrist[0] + 260, wrist[1] + 520];
  part(C, tube([elbow, wrist], 170, 130), { col: K.kurta, p: 0.85, gap: 9, w: 10, seed: 1210 }, { w: 6, col: K.ink, seed: 1211 });
  part(C, smooth([[wrist[0] - 75, wrist[1] - 20], [tip[0] - 30, tip[1] - 10], [tip[0] - 4, tip[1] - 40], [tip[0] + 30, tip[1] - 20], [tip[0] + 60, tip[1] + 60], [wrist[0] + 70, wrist[1] + 30]], 5), { col: K.skin, p: 0.85, gap: 7, w: 9, seed: 1212 }, { w: 5, col: K.ink, seed: 1213 });
  if (k > 0.5) poly(GLOW, handCircle(B.x, B.y, 80, 1214, 0, 30), K.amber, 0.6, { seed: 1215 });
}
// ——— printed words (top third, on a dark ragged knock-out) ———
const SUBY = 300;
const SUBCOL = { N: K.bone, R: '#9fc4e8', A: K.amber, G: K.khaki };
function subTo(t) {
  const S = SUBS.find(s => t >= s.t0 && t < s.t1); if (!S) return;
  const lines = S.text.split('|'), size0 = lines.length > 1 ? 64 : 60, lh = size0 * 1.35;
  const g = SUBK.g; g.save(); g.font = `700 ${size0}px Kalam`; const tw = Math.max(...lines.map(l => g.measureText(l).width)); g.restore();
  const sc = tw > 980 ? 980 / tw : 1, size = size0 * sc;
  const cx = 540, cy = SUBY + (lines.length - 1) * lh * sc / 2, hw = Math.min(tw * sc / 2 + 46, 530), hh = 48 + (lines.length - 1) * lh * sc / 2;
  g.save(); g.fillStyle = '#000'; g.beginPath();
  for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 2; const px = Math.cos(a), py = Math.sin(a); const sq = Math.pow(Math.abs(px), 0.3) * Math.sign(px); const sqy = Math.pow(Math.abs(py), 0.5) * Math.sign(py); const nn = 1 + 0.05 * Math.sin(a * 7 + 1.3) + 0.03 * Math.sin(a * 17); g.lineTo(cx + sq * hw * nn, cy + sqy * hh * nn); }
  g.closePath(); g.fill(); g.restore();
  lines.forEach((ln, i) => {
    const rv = pr(t, S.t0 + i * 0.35, S.t0 + i * 0.35 + 0.5);
    wtext(SUBT, ln, cx, SUBY + 20 + i * lh * sc, { screen: true, size, weight: 700, col: SUBCOL[S.who], reveal: rv, seed: 11 + S.t0 * 3 + i, stroke: 1.2 });
  });
}
export const TEXTS = t => { const S = SUBS.find(s => t >= s.t0 && t < s.t1); if (!S) return []; const n = S.text.split('|').length; return [{ id: 's' + S.t0, text: S.text.replace('|', ' '), x0: 20, y0: SUBY - 60, x1: 1060, y1: SUBY + 60 + (n - 1) * 86 }]; };
function title(t) {
  if (t < 3.4 || t > 7.4) return;
  const p = 1 - pr(t, 7.0, 7.4);
  wtext(SUBT, '13वाँ फ्लोर', 540, 1690, { screen: true, size: 110, weight: 700, col: K.bone, reveal: pr(t, 3.5, 4.2), seed: 31, stroke: 2, p });
  wtext(SUBT, 'भाग 2', 540, 1775, { screen: true, size: 54, weight: 700, col: K.red, reveal: pr(t, 4.0, 4.5), seed: 32, p });
}
function endCard(t) {
  if (t < 47.2) return;
  const g = SUBK.g; g.save(); g.fillStyle = '#000'; g.fillRect(0, 1180, W, 740); g.restore();
  wtext(SUBT, 'अगला पन्ना कल', 540, 1340, { screen: true, size: 110, weight: 700, col: K.bone, reveal: pr(t, 47.25, 47.7), seed: 41, stroke: 2 });
  wtext(SUBT, 'हर शाम 7:30 — Follow करो', 540, 1480, { screen: true, size: 66, weight: 700, col: K.amber, reveal: pr(t, 47.6, 48.0), seed: 42, stroke: 1.2 });
  wtext(SUBT, '@pannapalatkahani', 540, 1600, { screen: true, size: 58, weight: 700, col: K.chalk, reveal: pr(t, 47.9, 48.3), seed: 44 });
}

// ——— events for the mixer ———
export const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
ev(0, 'roomtone', { dur: 50 }); ev(0.05, 'hit'); ev(3.5, 'chalk', { dur: 0.7 });
ev(21.6, 'steam', { dur: 10.4 }); ev(32.6, 'click'); ev(32.8, 'tick'); ev(33.5, 'ding', { low: 1 });
ev(39.2, 'doors', { dur: 0.6 }); ev(45.0, 'sting'); ev(45.0, 'buzz', { dur: 0.6 }); ev(47.3, 'chalk', { dur: 1.0 });
[['A', 0], ['B', 3.4], ['C', 9.6], ['D', 15.0], ['E', 21.6], ['F', 27.0], ['G', 32.0], ['H', 34.4], ['I', 39.2], ['J', 44.6], ['Z', 47.2]].forEach(([id, t]) => ev(t, 'cue', { id }));
EV.forEach(e => { const t1 = UNWARP(e.t + (e.dur || 0)); e.t = +UNWARP(e.t).toFixed(3); if (e.dur) e.dur = +(t1 - e.t).toFixed(3); });
SUBS.forEach(S => ev(S.vt, 'voice', { id: S.vo, who: S.who }));

// ——— one frame ———
export function frame(comp, tf) {
  const t = WARP(tf);
  const S = shotAt(t), set = S[2];
  const e = ss((t - S[0]) / (S[1] - S[0]));
  CAM.x = lerp(S[3][0], S[4][0], e); CAM.y = lerp(S[3][1], S[4][1], e); CAM.s = lerp(S[3][2], S[4][2], e);
  const [shx, shy] = shake(t); CAM.x += shx / CAM.s; CAM.y += shy / CAM.s;
  BOIL.amp = CLEAN ? 0 : 1;
  [RI, AM, GU, MR, PROP, FG].forEach(clearGroup);
  [BG.f, BG.l, GLOW, FX, SUBK, SUBT].forEach(clear);
  let lamp = [0.5, 0.5, 1, 0], lampCol = [1.12, 1.02, 0.88], bright = 1;
  if (set === 'panel' || set === 'end') {
    drawPanel(t);
    if (t >= 32.0 && t < 33.3) press12(FG, t);
    lamp = lampAt(900, 860, 0.7, 0.5); lampCol = [1.15, 0.85, 0.8];
    bright = flick(t, 'panel') * (set === 'end' ? 0.75 : 1);
  } else if (set === 'mirror') {
    drawLobby(t);
    const mx = 6858, mk = 0.4, ak = mk * 0.94;
    person(MR, { kind: 'amma', t, x: mx + 70, gy: 2475, k: ak, fx: 1, hy: 2475 - AH * ak + 30 * ak, hands: { L: [mx + 70 - 30 * ak, 2475 - 380 * ak], R: [mx + 70 + 30 * ak, 2475 - 380 * ak] }, feet: {}, exp: { eyes: t < 2.6 ? 'glint' : 'closed', brows: 'flat', mouth: 'smile' }, look: [0, 0], items: [] }, 5000);
    const rx = mx - 30;
    person(MR, { kind: 'riya', t, x: rx, gy: 2500, k: mk, fx: 1, hands: { L: [rx - 90 * mk, 2500 - 360 * mk], R: [rx + 90 * mk, 2500 - 380 * mk] }, feet: { L: [rx - 14, 2500], R: [rx + 14, 2500] }, exp: { eyes: 'pop', brows: 'worried', mouth: 'o' }, look: [0, 0], items: [], buds: false }, 5200);
    clipTo(MR, LMIR);
    const x = 6600, gy = 3330, k = 1.18, hy = gy - AH * k;
    person(RI, { kind: 'riya', t, x, gy, k, fx: -1 + 2 * ss(pr(t, 2.7, 3.4)), hy, hands: { L: [x - 90 * k, hy + 320 * k], R: [x + 90 * k, hy + 300 * k] }, feet: { L: [x - 34 * k, gy], R: [x + 34 * k, gy] }, exp: { eyes: 'pop', brows: 'worried', mouth: 'o' }, look: [1, 0], items: [], buds: false }, 2000);
    lamp = lampAt(6850, 2000, 0.5, 0.5);
  } else if (set === 'lobby') {
    drawLobby(t);
    person(AM, amma2(t), 3000);
    const ra = person(RI, riyaLobby2(t), 2000);
    const a = amma2(t); drawCan(AM, a.hands.R[0], a.hands.R[1] + 160 * a.k, a.k * 0.9);
    if (t >= 9.6) {   // the clue: a circle around the ID card, amma's finger pointing at it
      const cx = 6650, cy = 2300 + 230;
      if (t > 10.6) line(FX, handCircle(cx, cy, 72, 1300, 0.15, 40), { w: 7, col: K.amber, seed: 1301, draw: pr(t, 10.6, 11.2) });
      if (t > 11.6) { const u = eo(pr(t, 11.6, 12.0)), tip = [lerp(7000, cx + 80, u), lerp(2560, cy + 10, u)];
        part(FG, tube([[7100, 2700], tip], 46, 30), { col: K.shawl, p: 0.9, gap: 6, w: 8, seed: 1302 }, { w: 4, col: K.ink, seed: 1303 });
        part(FG, handCircle(tip[0], tip[1], 16, 1304, 0, 18), { col: K.skinO, p: 0.9, gap: 5, w: 7, seed: 1305 }, { w: 4, col: K.ink, seed: 1306 }); }
    }
    lamp = lampAt(6850, 1900, 0.95, 0.25);
  } else if (set === 'corr') {
    drawCorr(t);
    const dq = [corrPt(-1, 0.62, 0), corrPt(-1, 0.75, 0), corrPt(-1, 0.75, 0.72), corrPt(-1, 0.62, 0.72)];   // amma's door (1303), open, lit
    if (t < 39.2) poly(GLOW, dq, K.bulb, 0.55, { seed: 1310 });
    person(AM, ammaCorr(t), 3000);
    if (t < 39.2 || t > 40.9) person(RI, riyaWalk(t), 2000);
    drawLiftDoors(FG, t);
    lamp = lampAt(4900, 1050, t >= 39.2 ? 0.7 : 0.55, 0.45);
  } else if (set === 'room') {
    drawRoom(t);
    person(AM, ammaRoom(t), 3000);
    drawStove(PROP, t);
    const r = riyaRoom(t); person(RI, r, 2000);
    if (t > 29.8) { const u = (t - 29.8) % 1.6 / 1.6; dab(FX, r.head[0] + 22 * r.k, r.head[1] + (8 + 40 * u) * r.k, 6, { col: '#9fd0f0', p: 0.9 * (1 - u * 0.5), seed: 1320 }); }
    lamp = lampAt(11050, 900, 1.0, 0.4); lampCol = [1.2, 1.05, 0.85];
  } else if (set === 'lift') {
    drawLift(t);
    person(RI, riyaLift2(t), 2000);
    lamp = lampAt(2900, 760, 0.95, 0.4); lampCol = [1.15, 1.02, 0.88];
  }
  if (!NOSUBS) { subTo(tf); title(t); }
  endCard(t);
  const go = [hash(BOIL.step) * 300, hash(BOIL.step + 7) * 300];
  comp.paperCam(CAM.x * 0.6, CAM.y * 0.6, CAM.s / 0.6);
  comp.clean = CLEAN;
  comp.begin(PAPER);
  comp.crayon(BG.f.c); comp.crayon(BG.l.c);
  comp.crayon(GLOW.c, { goff: go, gain: 1.15 });
  comp.group(MR, { goff: go });
  comp.group(AM, { goff: go }); comp.group(GU, { goff: go }); comp.group(PROP, { goff: go });
  comp.group(RI, { goff: go });
  comp.group(FG, { goff: go });
  comp.crayon(FX.c, { goff: go });
  comp.knock(SUBK.c); comp.crayon(SUBT.c);
  comp.finish({ vig: CLEAN ? 0.45 : 0.55, emb: CLEAN ? 0 : 0.45, lamp, lampCol, bright });
}
export function testFrame(comp, t) { frame(comp, t); }
