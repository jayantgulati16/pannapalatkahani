// कर्तव्य या भक्ति? (भाग 1/2) — Ep 8, posts 25 Nov 2026. Vertical 1080×1920, 24 fps, ~60 s. Clean cartoon.
// Story by Jayant (22 Nov), revised. Cold open: night, temple steps, Raghav with empty hands: "Prabhu… today I sold your flower!"
// A day earlier: every morning he offers his best lotus at Vishnu's feet. Maa has a high fever; the vaidya wants 10 gold coins for the medicine;
// Raghav has 4 copper coins. Next morning only ONE lotus blooms; a rich merchant (yellow pitambar, conch flag on his chariot, Vaishnav tilak —
// hidden clues; same voice as the god at the end) offers 10 gold coins for it. Puja or Maa's life? He sells it, Maa wakes: "Raghav…".
// Night, the steps again: "Will you forgive me?" — the temple doors glow gold: "Raghav…" → "भाग 2 · कल शाम 7:30".
// 2-PART SIGNALS (Jayant, 23 Nov): title card with "भाग 1", a "भाग 1/2" badge all through, narrator + end card for भाग 2.
import { layer, clear, line, fill, dab, handCircle, smooth, CAM, BOIL, WMUL, STYLE, W, H, sx, sy } from './crayon.js';
import { group, clearGroup, part, tube } from './rig.js';
import { clamp, lerp, hash, ss, eio, eo, ei } from '/core/lib.js';
STYLE.clean = true;

export const DUR = 60.5;
const NOSUBS = new URLSearchParams(location.search).get('nosubs') === '1';
const K = { ink: '#1d1b22', bone: '#fbf8f1', cream: '#f3ead2', white: '#ffffff', grey: '#9a9aa3', dgrey: '#55555f',
  wood: '#b57f52', woodD: '#7d5434', red: '#e2412f', green: '#4f9a5a', leaf: '#7cc36e', yellow: '#f5c63c', note: '#ffe46b', pink: '#f29ab8', pinkL: '#fbd3e0', orange: '#ec8a3c',
  skin: '#e2ab88', skinM: '#d9a27f', skinO: '#c98d68', water: '#9fd0f0', gold: '#e2a92f', goldL: '#ffd76a', copper: '#b8693a', copperL: '#d98c5a',
  pitambar: '#f2b632', maroon: '#7a2340', stone: '#3c3a46', stoneL: '#5a5866', saffron: '#e8863a', mud: '#a8754a', nightSky: '#1b2142' };
const PAPER = [0.965, 0.955, 0.93];
const pr = (t, a, b) => clamp((t - a) / (b - a));
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const rrect = (x0, y0, x1, y1, r) => { const p = []; for (const [cx, cy, a0] of [[x1 - r, y0 + r, -Math.PI / 2], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, Math.PI / 2], [x0 + r, y0 + r, Math.PI]]) for (let i = 0; i <= 6; i++) { const a = a0 + i / 6 * Math.PI / 2; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return p; };
const back1 = u => { u = clamp(u) - 1; return 1 + u * u * (2.8 * u + 1.8); };
const oval = (cx, cy, rx, ry, n = 32) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });

// ——— printed words / voice script (N narrator, R Raghav, A Maa, V vaidya, B merchant, P the voice from the temple = SAME voice as B) ———
export const SUBS = [
  { t0: 0.0, t1: 2.5, text: '“प्रभु… आज मैंने|आपका फूल बेच दिया!”', who: 'R', vo: 'r1', vt: 0.2 },
  { t0: 4.7, t1: 9.9, text: 'राघव रोज़ अपना सबसे सुंदर कमल|भगवान विष्णु के चरणों में चढ़ाता था।', who: 'N', vo: 'n1', vt: 4.8 },
  { t0: 10.1, t1: 13.7, text: '“प्रभु, मुझे कुछ नहीं चाहिए…|बस मेरी माँ ठीक रहे।”', who: 'R', vo: 'r2', vt: 10.2 },
  { t0: 13.9, t1: 18.5, text: '“बुखार बहुत तेज़ है। ये दवा चाहिए…|दस सोने के सिक्के की।”', who: 'V', vo: 'v1', vt: 14.0 },
  { t0: 18.7, t1: 23.7, text: 'राघव के पास बस चार ताँबे के सिक्के थे।|वो पूरी रात रोता रहा।', who: 'N', vo: 'n2', vt: 18.8 },
  { t0: 24.0, t1: 29.5, text: 'अगली सुबह तालाब में सिर्फ़ एक कमल खिला…|तभी एक अमीर व्यापारी ने उसे रोका।', who: 'N', vo: 'n3', vt: 24.1 },
  { t0: 29.7, t1: 33.9, text: '“ये कमल मुझे दे दो।|बदले में… दस सोने के सिक्के।”', who: 'B', vo: 'b1', vt: 29.8 },
  { t0: 35.5, t1: 40.0, text: 'एक तरफ़ भगवान की पूजा…|दूसरी तरफ़ माँ की जान।', who: 'N', vo: 'n4', vt: 35.6 },
  { t0: 45.9, t1: 48.4, text: '“राघव…”', who: 'A', vo: 'a1', vt: 46.0 },
  { t0: 48.9, t1: 53.4, text: '“प्रभु…|क्या आप मुझे माफ़ करेंगे?”', who: 'R', vo: 'r3', vt: 49.0 },
  { t0: 54.7, t1: 56.6, text: '“राघव…”', who: 'P', vo: 'p1', vt: 54.8 },
  { t0: 56.8, t1: 60.5, text: 'आगे क्या हुआ… देखिए भाग 2 में,|कल शाम 7:30 बजे!', who: 'N', vo: 'n5', vt: 56.9 },
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
    const r = (hash(seed + i * 1.9) - .5) * 0.04 * (o.tilt ?? 1);
    g.save(); g.translate(cx + wd[i] / 2 + jx, jy); g.rotate(r);
    g.globalAlpha = o.p ?? 1;
    if (o.outline) { g.lineWidth = o.outline; g.strokeStyle = K.ink; g.lineJoin = 'round'; g.strokeText(w, -wd[i] / 2, 0); g.strokeStyle = o.col || K.bone; }
    g.fillText(w, -wd[i] / 2, 0);
    g.restore(); cx += wd[i] + sp;
  });
  g.restore(); return tw;
}
function poly(L, pts, col, p = 0.85, o = {}) { fill(L, pts, { col, p, gap: o.gap ?? 9, w: o.w ?? 10, ang: o.ang ?? 0.6, seed: o.seed ?? 1, boil: o.boil ?? 0.3, over: o.over ?? 4 }); }
function edge(L, pts, col, w = 4, p = 0.6, sd = 1, closed = true) { line(L, closed ? [...pts, pts[0]] : pts, { w, col, p, seed: sd, boil: 0.5 }); }

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
    const pupil = (c, r) => { dab(C.l, c[0], c[1], r, { col: K.ink, p: 1, gap: 3, w: 5, seed: sd + 32 + sg }); dab(C.l, c[0] + 2, c[1] - 2.5, 2, { col: K.white, p: 1, gap: 1.5, w: 3, seed: sd + 34 + sg }); };
    if (e.eyes === 'closed') line(C.l, tp([[cx - 9, eyeY + 1], [cx, eyeY + 5], [cx + 9, eyeY + 1]]), { w: 4.5, col: K.ink, seed: sd + 30 + sg });
    else if (e.eyes === 'shut') line(C.l, tp([[cx - 10, eyeY + 3], [cx, eyeY - 2], [cx + 10, eyeY + 3]]), { w: 4.5, col: K.ink, seed: sd + 30 + sg });
    else if (e.eyes === 'half') { line(C.l, tp([[cx - 11, eyeY - 2], [cx + 11, eyeY - 2]]), { w: 4.5, col: K.ink, seed: sd + 30 + sg }); pupil(tp([[ex, ey + 2]])[0], 5); }
    else if (e.eyes === 'pop') { const c = tp([[ex, ey]])[0]; fill(C.f, tp(handCircle(cx, eyeY, 12, sd + 27 + sg, 0, 18)), { col: K.white, p: 0.9, gap: 3, w: 5, seed: sd + 26 + sg, over: 1 }); line(C.l, tp(handCircle(cx, eyeY, 12, sd + 28 + sg, 0.1, 20)), { w: 3.5, col: K.ink, seed: sd + 28 + sg }); dab(C.l, c[0], c[1], 3.5, { col: K.ink, p: 1, seed: sd + 32 + sg }); }
    else pupil(tp([[ex, ey]])[0], 6);
    const b = e.brows === 'up' ? [-26, -24] : e.brows === 'down' ? [-17, -22] : e.brows === 'worried' ? [-25, -17] : e.brows === 'angry' ? [-15, -25] : [-20, -20];
    line(C.l, tp([[sg * 8, b[0]], [sg * 26, b[1]]]), { w: 4.5, col: s.browCol || K.ink, seed: sd + 36 + sg });
  }
  const m = e.mouth;
  if (m === 'open') part(C, tp([[-13, 18], [13, 18], [9, 30], [0, 33], [-9, 30]]), { col: '#5a1f22', p: 0.9, gap: 4, w: 6, seed: sd + 50 }, { w: 4, col: K.ink, seed: sd + 51 });
  else if (m === 'yell') part(C, tp(smooth([[-16, 16], [16, 16], [12, 36], [0, 40], [-12, 36]], 3)), { col: '#5a1f22', p: 0.9, gap: 4, w: 6, seed: sd + 50 }, { w: 4, col: K.ink, seed: sd + 51 });
  else if (m === 'o') line(C.l, tp(handCircle(0, 25, 7, sd + 52, 0.1, 14)), { w: 4, col: K.ink, seed: sd + 52 });
  else if (m === 'flat') line(C.l, tp([[-9, 25], [9, 24]]), { w: 4, col: K.ink, seed: sd + 53 });
  else if (m === 'wavy') line(C.l, tp([[-12, 25], [-6, 21], [0, 26], [6, 21], [12, 25]]), { w: 4, col: K.ink, seed: sd + 53 });
  else if (m === 'sad') line(C.l, tp(smooth([[-12, 28], [0, 21], [12, 28]], 5, false)), { w: 4.5, col: K.ink, seed: sd + 57 });
  else if (m === 'smile') line(C.l, tp(smooth([[-12, 19], [0, 28], [12, 19]], 5, false)), { w: 4.5, col: K.ink, seed: sd + 58 });
  else if (m === 'grin') part(C, tp(smooth([[-15, 18], [15, 18], [0, 32]], 3)), { col: K.white, p: 1, gap: 4, w: 6, seed: sd + 59 }, { w: 4, col: K.ink, seed: sd + 60 });
  else if (m === 'knowing') line(C.l, tp(smooth([[-13, 21], [0, 27], [15, 18]], 5, false)), { w: 4.5, col: K.ink, seed: sd + 58 });
  else line(C.l, tp(smooth([[-6, 23], [0, 26], [6, 23]], 5, false)), { w: 4, col: K.ink, seed: sd + 56 });
}

// ——— layers ———
const BG = { f: layer(), l: layer() }, GLOW = layer(), PE = group(), PROP = group(), FG = group(), FX = layer(), SUBK = layer(), SUBT = layer();

// ——— shots: [t0, t1, set, cam0, cam1] ———
const SHOTS = [
  [0.0, 2.5, 'steps', [1000, 2470, 1.3], [1000, 2470, 1.42]],      // HOOK: night, temple steps, empty hands, tears
  [2.5, 4.6, 'steps', [1000, 2280, 0.82], [1000, 2280, 0.88]],     // wide: the closed temple — title card + भाग 1
  [4.6, 7.6, 'pond', [3000, 2480, 1.05], [3020, 2470, 1.12]],      // a day earlier: the pond, his best lotus
  [7.6, 13.8, 'mandir', [5620, 2560, 1.15], [5620, 2560, 1.27]],   // offering at the feet; prayer for Maa
  [13.8, 18.6, 'hut', [8150, 2470, 1.0], [8150, 2470, 1.06]],      // vaidya: 10 gold coins
  [18.6, 21.4, 'coins', [10000, 2420, 1.0], [10000, 2420, 1.08]],  // 4 copper coins
  [21.4, 23.9, 'hut', [8440, 2380, 1.45], [8440, 2380, 1.55]],       // he cries all night
  [23.9, 26.8, 'pond', [3000, 2480, 1.05], [3000, 2480, 1.1]],     // next morning: only one lotus
  [26.8, 29.6, 'pond', [3700, 2460, 0.9], [3740, 2460, 0.95]],     // the merchant + his chariot (conch flag)
  [29.6, 32.2, 'pond', [3960, 2340, 1.55], [3960, 2340, 1.65]],    // "give me this lotus"
  [32.2, 34.0, 'gold', [10000, 2420, 1.0], [10000, 2420, 1.08]],   // 10 gold coins
  [34.0, 35.4, 'pond', [3380, 2300, 2.1], [3380, 2300, 2.3]],      // Raghav: दस?!
  [35.4, 40.0, 'dilemma', [11600, 2470, 1.0], [11600, 2470, 1.07]],// puja or Maa?
  [40.0, 42.9, 'pond', [3680, 2420, 1.3], [3680, 2420, 1.36]],     // he gives the lotus — the merchant's knowing smile
  [42.9, 45.6, 'hutday', [8330, 2420, 1.3], [8330, 2420, 1.36]],   // the medicine
  [45.6, 48.6, 'hutday', [8330, 2260, 1.9], [8330, 2260, 2.0]],    // Maa opens her eyes
  [48.6, 54.2, 'steps', [1000, 2470, 1.3], [1000, 2470, 1.42]],    // night again (= the hook)
  [54.2, 56.8, 'steps', [1000, 2330, 0.95], [1000, 2330, 1.0]],    // the doors glow gold: "राघव…"
  [56.8, 60.51, 'steps', [1000, 2400, 1.05], [1000, 2400, 1.1]],   // his face in the light → भाग 2 कल
];
function shotAt(t) { return SHOTS.find(s => t >= s[0] && t < s[1]) || SHOTS[SHOTS.length - 1]; }
const HITS = [[2.5, 8], [18.6, 5], [32.2, 6], [34.0, 10], [36.0, 3], [37.0, 3], [38.0, 3], [39.0, 3], [54.2, 8], [54.8, 6]];
function shake(t) {
  let x = 0, y = 0;
  for (const [h, a] of HITS) { const d = t - h; if (d < 0 || d > 0.5) continue; const e = a * Math.exp(-d / 0.08); x += (hash(BOIL.step * 3.1 + h) - .5) * 2 * e; y += (hash(BOIL.step * 5.7 + h) - .5) * 2 * e; }
  return [x, y];
}

// ——— characters ———
const SPEC = {
  raghav: { top: K.saffron, len: 330, bottom: '#efe6d0', shoe: K.skinO, hair: 'short', skin: K.skinO, gamchha: '#c9483a' },
  amma: { top: '#e6dcc6', trim: '#5f86b0', len: 430, bottom: '#e6dcc6', shoe: K.woodD, hair: 'bun', hairCol: '#b9b4ae', bindi: 1, skin: K.skinM, pallu: '#d4c7aa' },
  vaidya: { top: '#f6f1e4', len: 420, bottom: '#f6f1e4', shoe: K.woodD, hair: 'short', hairCol: '#dcd8d2', beard: '#efebe5', moustache: '#efebe5', turban: '#e39a3a', glasses: 1, tilak: 'dot', skin: K.skinM, browCol: '#cfcac3' },
  vyapari: { top: K.pitambar, trim: K.gold, len: 420, bottom: K.pitambar, shoe: '#8a3b2a', hair: 'short', turban: '#c7362f', jewel: 1, mala: 1, tilak: 'v', skin: K.skin, angavastra: K.maroon },
};
function person2(C, s, sd) {
  const P0 = SPEC[s.kind], k = s.k ?? 1, hy = s.hy, hairCol = P0.hairCol || '#2a201e';
  const P = (dx, dy) => [s.x + dx * k, hy + dy * k], tp = pts => pts.map(([a, b]) => P(a, b));
  WMUL.k = clamp(Math.sqrt(k), 0.45, 1.3);
  const skinC = P0.skin, skin = { col: skinC, p: 1, gap: 7, w: 9, seed: sd + 1 }, O = (w, q) => ({ w, col: K.ink, seed: q, p: 0.9 });
  if (!s.seated && !s.bust) for (const [side, sg] of [['L', -1], ['R', 1]]) {   // legs
    const hip = P(sg * 24, 330), [kn, f] = ik(hip, s.feet[side], 178 * k, 178 * k, sg);
    part(C, tube([hip, kn, f], 44 * k, 34 * k), { col: P0.bottom, p: 1, seed: sd + 2 + sg }, O(4, sd + 4 + sg));
    part(C, smooth([[f[0] - 26 * k, f[1] - 10 * k], [f[0] + sg * 6 * k + 22 * k, f[1] - 12 * k], [f[0] + sg * 30 * k, f[1] + 4 * k], [f[0] - 22 * sg * k, f[1] + 10 * k]], 4), { col: P0.shoe, p: 1, seed: sd + 6 + sg }, O(4, sd + 8 + sg));
  }
  if (s.squat) for (const sg of [-1, 1]) {   // sitting on a step: shins down to the step below
    part(C, tube([P(sg * 30, 300), P(sg * 46, 460)], 52 * k, 40 * k), { col: P0.bottom, p: 1, seed: sd + 160 + sg }, O(4, sd + 162 + sg));
    part(C, smooth(tp([[sg * 46 - 26, 452], [sg * 46 + 26, 452], [sg * 46 + 30, 478], [sg * 46 - 30, 480]]), 3), { col: skinC, p: 1, seed: sd + 164 + sg }, O(4, sd + 166 + sg));
  }
  if (s.kneel) part(C, tp(smooth([[-70, 270], [70, 270], [120, 330], [116, 400], [-96, 404], [-84, 330]], 3)), { col: P0.bottom, p: 1, seed: sd + 168 }, O(4, sd + 169));
  if (P0.hair === 'bun') part(C, tp(handCircle(0, -66, 30, sd + 11, 0, 20)), { col: hairCol, p: 1, seed: sd + 12 }, O(4, sd + 13));
  const L = s.bust ? (s.bustL || 300) : P0.len;
  part(C, tp(smooth([[-15, 48], [15, 48], [50, 62], [58, 140], [62, 250], [64, L - 10], [0, L], [-64, L - 10], [-62, 250], [-58, 140], [-50, 62]], 3)), { col: P0.top, p: 1, seed: sd + 14 }, O(5, sd + 15));
  if (P0.trim && !s.bust) line(C.l, tp([[-62, L - 26], [62, L - 26]]), { w: 6, col: P0.trim, seed: sd + 16 });
  if (P0.trim && P0.angavastra) line(C.l, tp([[0, 62], [0, L - 30]]), { w: 5, col: P0.trim, seed: sd + 17 });
  if (P0.pallu) part(C, tp(smooth([[-50, 58], [-26, 50], [50, 170], [60, Math.min(300, L - 10)], [34, Math.min(300, L - 10)], [-44, 120]], 4)), { col: P0.pallu, p: 1, seed: sd + 18 }, O(4, sd + 19));
  if (P0.angavastra) part(C, tp(smooth([[-52, 60], [-30, 52], [56, 160], [62, 300], [38, 300], [-46, 130]], 4)), { col: P0.angavastra, p: 1, seed: sd + 21 }, O(4, sd + 22));
  if (P0.gamchha) { part(C, tp(smooth([[30, 52], [52, 60], [60, 150], [44, 160], [36, 70]], 3)), { col: P0.gamchha, p: 1, seed: sd + 23 }, O(3, sd + 24)); for (let i = 0; i < 3; i++) line(C.l, tp([[40, 80 + i * 26], [58, 84 + i * 26]]), { w: 3, col: K.white, seed: sd + 25 + i }); }
  if (P0.mala) for (let i = 0; i <= 14; i++) { const a = Math.PI * (0.12 + 0.76 * i / 14); dab(C.l, ...P(Math.cos(a) * 34, 52 + Math.sin(a) * 66), 5.5 * k, { col: i % 4 === 2 ? K.red : '#fff6dc', p: 1, seed: sd + 170 + i }); }
  part(C, tp([[-11, 30], [11, 30], [12, 56], [-12, 56]]), skin, O(4, sd + 40));
  for (const sg of [-1, 1]) part(C, tp(handCircle(sg * 50, 6, 11, sd + 41 + sg, 0, 16)), skin, O(4, sd + 43 + sg));
  part(C, tp(handCircle(0, 0, 50, sd + 45, 0.06, 44)), skin, O(5, sd + 46));
  if (P0.hair === 'bun') part(C, tp(smooth([[-55, 2], [-52, -40], [-30, -62], [0, -66], [30, -62], [52, -40], [55, 2], [44, -24], [20, -36], [0, -38], [-20, -36], [-44, -24]], 5)), { col: hairCol, p: 1, seed: sd + 50 }, O(4, sd + 51));
  if (P0.hair === 'short' && !P0.turban) part(C, tp(smooth([[-54, -2], [-54, -42], [-34, -64], [-4, -72], [30, -66], [52, -46], [55, -4], [46, -28], [28, -40], [-6, -44], [-30, -36], [-46, -20]], 4)), { col: hairCol, p: 1, seed: sd + 54 }, O(4, sd + 55));
  if (P0.turban) {
    part(C, tp(smooth([[-58, -8], [-64, -50], [-42, -88], [0, -100], [42, -88], [64, -50], [58, -8], [36, -30], [0, -36], [-36, -30]], 5)), { col: P0.turban, p: 1, seed: sd + 56 }, O(4, sd + 57));
    for (let i = 0; i < 2; i++) line(C.l, tp(smooth([[-54, -30 - i * 24], [0, -56 - i * 26], [56, -34 - i * 22]], 5, false)), { w: 3.5, col: K.ink, p: 0.6, seed: sd + 58 + i });
    if (P0.jewel) { dab(C.l, ...P(0, -58), 10 * k, { col: K.goldL, p: 1, seed: sd + 61 }); dab(C.l, ...P(0, -58), 5 * k, { col: '#3fa39a', p: 1, seed: sd + 62 }); line(C.l, tp(smooth([[4, -66], [16, -104], [30, -124]], 4, false)), { w: 6, col: K.gold, seed: sd + 63 }); }
  }
  face(C, tp, { ...s, look: s.look || [0, 0], browCol: P0.browCol }, sd);
  if (P0.beard) part(C, tp(smooth([[-50, 0], [-46, 38], [-26, 70], [0, 82], [26, 70], [46, 38], [50, 0], [38, 22], [14, 34], [0, 36], [-14, 34], [-38, 22]], 4)), { col: P0.beard, p: 1, seed: sd + 64 }, O(3, sd + 65));
  if (P0.moustache) part(C, tp(smooth([[-28, 14], [0, 6], [28, 14], [22, 22], [0, 16], [-22, 22]], 4)), { col: P0.moustache, p: 1, seed: sd + 66 }, O(3, sd + 67));
  if (P0.glasses) { for (const sg of [-1, 1]) line(C.l, tp(handCircle(sg * 19, -2, 15, sd + 68 + sg, 0.08, 22)), { w: 3.5, col: K.ink, seed: sd + 69 + sg }); line(C.l, tp([[-4, -3], [4, -3]]), { w: 3, col: K.ink, seed: sd + 71 }); }
  if (P0.bindi) dab(C.l, ...P(0, -22), 4 * k, { col: K.red, p: 1, seed: sd + 72 });
  if (P0.tilak === 'dot') dab(C.l, ...P(0, -26), 4 * k, { col: K.red, p: 1, seed: sd + 73 });
  if (P0.tilak === 'v') { for (const sg of [-1, 1]) line(C.l, tp([[sg * 4, -18], [sg * 10, -42]]), { w: 4, col: K.white, seed: sd + 74 + sg }); line(C.l, tp([[0, -20], [0, -40]]), { w: 4, col: K.red, seed: sd + 76 }); }
  if (s.patti) part(C, tp(rrect(-34, -44, 34, -26, 6)), { col: K.white, p: 1, seed: sd + 77 }, O(3, sd + 78));
  if (s.sweat) dab(C.l, ...P(58, -24 + 18 * ((s.t * 1.4) % 1)), 7 * k, { col: K.water, p: 1, seed: sd + 79 });
  if (s.tears) for (const sg of [-1, 1]) for (let i = 0; i < 2; i++) { const u = (s.t * 1.1 + i * 0.5 + (sg > 0 ? 0.25 : 0)) % 1; dab(C.l, ...P(sg * 20 + sg * 3 * u, 10 + 46 * u), 5.5 * k, { col: K.water, p: Math.sin(Math.PI * u), seed: sd + 80 + i + sg }); }
  const arms = {};
  if (!s.bust || s.hands) {
    for (const [side, sg] of [['L', -1], ['R', 1]]) {
      const shp = P(sg * 46, 68), [el, hd] = ik(shp, s.hands[side], 118 * k, 110 * k, sg); arms[side] = hd;
      part(C, tube([el, hd], 24 * k, 20 * k), skin, O(4, sd + 100 + sg));
      part(C, tube([shp, el, [lerp(el[0], hd[0], 0.5), lerp(el[1], hd[1], 0.5)]], 32 * k, 26 * k), { col: P0.top, p: 1, seed: sd + 102 + sg }, O(4, sd + 104 + sg));
    }
    for (const side of ['L', 'R']) part(C, handCircle(arms[side][0], arms[side][1], 15 * k, sd + 110 + (side === 'L' ? 0 : 1), 0, 18), skin, O(4, sd + 112 + (side === 'L' ? 0 : 1)));
  }
  WMUL.k = 1;
  s.head = P(0, 0); return arms;
}
const AH = 680;
function stand(kind, x, gy, k, t, o = {}) {
  const hy = gy - AH * k;
  return { kind, t, x, gy, k, hy, feet: o.feet || { L: [x - 42 * k, gy], R: [x + 42 * k, gy] }, hands: o.hands || { L: [x - 78 * k, hy + 320 * k], R: [x + 78 * k, hy + 320 * k] }, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'small' }, look: o.look || [0, 0], sweat: o.sweat, tears: o.tears };
}
function seat(kind, x, t, o = {}) {   // sitting: feet hidden below (or shins with squat), hands in front
  const k = o.k ?? 1, hy = o.hy ?? 2010, gy = hy + 600;
  return { kind, t, x, gy, k, hy, seated: 1, squat: o.squat, kneel: o.kneel, feet: { L: [x - 40, gy], R: [x + 40, gy] }, hands: o.hands || { L: [x - 90 * k, hy + 300 * k], R: [x + 90 * k, hy + 300 * k] }, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'smile' }, look: o.look || [0, 0], sweat: o.sweat, tears: o.tears, patti: o.patti };
}
function bust(kind, x, hy, k, t, o = {}) { return { kind, t, x, hy, k, bust: 1, bustL: o.L || 300, hands: o.hands, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'smile' }, look: o.look || [0, 0], patti: o.patti, sweat: o.sweat }; }
function talking(t, a, b) { return t > a && t < b && BOIL.step % 3 ? 'open' : 'small'; }

// ——— props ———
function sglow(x, y, r, col, a, sd = 1) { for (let i = 0; i < 4; i++) poly(GLOW, handCircle(x, y, r * (1 - i * 0.2), sd + i, 0, 30), col, a * 0.32, { seed: sd + i }); }
function lotus(C, x, y, s = 1, sd = 1, glow = 0) {   // a pink lotus; y = base of the flower
  if (glow) sglow(x, y - 40 * s, 130 * s, K.goldL, 0.6 * glow, sd + 9);
  const petal = (a, len, wid, col, q) => {
    const tip = [x + Math.sin(a) * len, y - Math.cos(a) * len], m = [x + Math.sin(a) * len * 0.5, y - Math.cos(a) * len * 0.5], nx = Math.cos(a) * wid, ny = Math.sin(a) * wid;
    part(C, smooth([[x, y], [m[0] - nx, m[1] - ny], tip, [m[0] + nx, m[1] + ny]], 5), { col, p: 1, seed: q }, { w: 3, col: '#9c3a5e', seed: q + 1 });
  };
  [-1.25, 1.25].forEach((a, i) => petal(a, 66 * s, 22 * s, K.pinkL, sd + i * 2));
  [-0.75, 0.75].forEach((a, i) => petal(a, 84 * s, 26 * s, K.pink, sd + 10 + i * 2));
  petal(0, 96 * s, 28 * s, K.pink, sd + 20);
  part(C, oval(x, y - 6 * s, 30 * s, 12 * s, 16), { col: '#79b85e', p: 1, seed: sd + 22 }, { w: 3, col: '#3e6e3a', seed: sd + 23 });
}
function lilyPad(L, x, y, r, sd) { poly(L, oval(x, y, r, r * 0.32, 18), '#5fa35a', 1, { seed: sd }); edge(L, oval(x, y, r, r * 0.32, 18), '#3e6e3a', 3, 0.8, sd + 1); }
function coin(C, x, y, r, gold, sd) {
  part(C, handCircle(x, y, r, sd, 0, 22), { col: gold ? K.gold : K.copper, p: 1, seed: sd + 1 }, { w: 3.5, col: K.ink, seed: sd + 2 });
  line(C.l, handCircle(x, y, r * 0.66, sd + 3, 0.05, 18), { w: 3, col: gold ? K.goldL : K.copperL, seed: sd + 4 });
  if (gold) dab(C.l, x - r * 0.35, y - r * 0.35, r * 0.18, { col: K.white, p: 1, seed: sd + 5 });
}
function shankh(F, Lw, x, y, s, col, sd) {   // a conch, simple (F fill layer, Lw line layer)
  const pts = smooth([[x - 30 * s, y + 18 * s], [x - 26 * s, y - 14 * s], [x, y - 30 * s], [x + 30 * s, y - 18 * s], [x + 44 * s, y], [x + 18 * s, y + 16 * s]], 5);
  poly(F, pts, col, 1, { seed: sd }); edge(Lw, pts, K.ink, 3, 0.9, sd + 1);
  line(Lw, smooth([[x - 14 * s, y + 6 * s], [x - 8 * s, y - 12 * s], [x + 10 * s, y - 14 * s], [x + 14 * s, y]], 4, false), { w: 3, col: K.ink, seed: sd + 2 });
}
function diya(C, x, y, s, sd) {
  sglow(x, y - 30 * s, 120 * s, '#ffcf6a', 0.6, sd);
  part(C, smooth([[x - 34 * s, y - 10 * s], [x + 34 * s, y - 10 * s], [x + 22 * s, y + 10 * s], [x - 22 * s, y + 10 * s]], 3), { col: '#b8693a', p: 1, seed: sd + 1 }, { w: 3, col: K.ink, seed: sd + 2 });
  const fl = 1 + 0.12 * Math.sin(BOIL.step * 1.7 + sd);
  part(C, smooth([[x - 9 * s, y - 12 * s], [x, y - 44 * s * fl], [x + 9 * s, y - 12 * s]], 4), { col: K.orange, p: 1, seed: sd + 3 }, null);
  dab(C.l, x, y - 20 * s, 5 * s, { col: K.goldL, p: 1, seed: sd + 4 });
}
function marigold(L, x0, x1, y, sag, sd) { for (let i = 0; i <= 14; i++) { const u = i / 14, x = lerp(x0, x1, u), yy = y + Math.sin(Math.PI * u) * sag; dab(L, x, yy, 13, { col: i % 2 ? K.orange : K.yellow, p: 1, seed: sd + i }); } }
function bell(L, x, y, sd) { line(L, [[x, y - 120], [x, y - 10]], { w: 4, col: K.dgrey, seed: sd }); const b = smooth([[x - 24, y + 40], [x - 18, y], [x, y - 14], [x + 18, y], [x + 24, y + 40]], 4); poly(L, b, K.gold, 1, { seed: sd + 1 }); edge(L, b, K.ink, 3, 0.9, sd + 2); }

// ——— SET: temple steps at night (hook + ending) ———
const DOOR = [830, 1840, 1170, 2650];
function drawSteps(t, glowU) {
  const B = BG;
  poly(B.f, rect(-300, 0, 2300, 2300), K.nightSky, 1, { seed: 10 });
  for (let i = 0; i < 26; i++) dab(B.f, -200 + hash(i * 3.1) * 2400, 900 + hash(i * 5.3) * 900, 4 + 3 * hash(i), { col: '#fff6d0', p: 0.5 + 0.5 * Math.sin(t * 2 + i), seed: 11 + i });
  dab(B.f, 1580, 1250, 70, { col: '#fff3c4', p: 1, seed: 40 }); dab(B.f, 1610, 1235, 62, { col: K.nightSky, p: 1, seed: 41 });   // crescent moon
  const wall = '#6a5468', wallD = '#4f3e52';
  poly(B.f, smooth([[620, 1500], [700, 1080], [860, 820], [1000, 700], [1140, 820], [1300, 1080], [1380, 1500]], 6), wall, 1, { seed: 42 });   // shikhara
  for (let i = 0; i < 5; i++) line(B.l, [[680 + i * 22, 1460 - i * 150], [1320 - i * 22, 1460 - i * 150]], { w: 6, col: wallD, seed: 43 + i });
  poly(B.f, handCircle(1000, 680, 40, 50, 0, 18), K.gold, 1, { seed: 51 }); line(B.l, [[1000, 640], [1000, 520]], { w: 6, col: K.ink, seed: 52 });
  poly(B.f, [[1000, 520], [1130, 560], [1000, 600]], K.saffron, 1, { seed: 53 });
  poly(B.f, rect(420, 1500, 1580, 2650), wall, 1, { seed: 54 });
  for (const x of [520, 1380]) poly(B.f, rect(x, 1560, x + 100, 2650), wallD, 1, { seed: 55 + x });
  poly(B.f, rect(400, 1480, 1600, 1540), wallD, 1, { seed: 57 });
  poly(B.f, smooth([[790, 2650], [790, 1900], [880, 1800], [1000, 1770], [1120, 1800], [1210, 1900], [1210, 2650]], 4), '#3a2a24', 1, { seed: 58 });
  const gap = 140 * eo(glowU);
  if (glowU > 0) poly(GLOW, rect(1000 - gap - 20, DOOR[1], 1000 + gap + 20, DOOR[3]), '#fff2b0', 1, { seed: 59 });
  for (const sg of [-1, 1]) {
    const xa = 1000 + sg * gap, xb = sg < 0 ? DOOR[0] : DOOR[2];
    const leaf = rect(Math.min(xa, xb), DOOR[1] + 40, Math.max(xa, xb), DOOR[3]);
    poly(B.f, leaf, '#7a4a2e', 1, { seed: 60 + sg }); edge(B.l, leaf, K.ink, 5, 0.9, 62 + sg);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) dab(B.l, lerp(xa, xb, 0.3 + j * 0.4), DOOR[1] + 160 + i * 170, 8, { col: K.gold, p: 1, seed: 64 + i * 2 + j + sg });
  }
  const st = [[2650, 2730, 260], [2730, 2810, 300], [2810, 2890, 340], [2890, 2970, 380]];
  st.forEach(([y0, y1, hw], i) => { poly(B.f, rect(1000 - hw * 2.2, y0, 1000 + hw * 2.2, y1), i % 2 ? '#8b8395' : '#7a7386', 1, { seed: 70 + i }); line(B.l, [[1000 - hw * 2.2, y0], [1000 + hw * 2.2, y0]], { w: 5, col: '#4a4456', seed: 74 + i }); });
  poly(B.f, rect(-300, 2970, 2300, 3700), '#2e3046', 1, { seed: 78 });
  if (glowU > 0) {   // rays from the doors
    for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * 0.28; poly(GLOW, [[1000, 2250], [1000 + Math.cos(a - 0.05) * 1600, 2250 + Math.sin(a - 0.05) * 1600], [1000 + Math.cos(a + 0.05) * 1600, 2250 + Math.sin(a + 0.05) * 1600]], '#ffe7a0', 0.35 * glowU, { seed: 80 + i }); }
    sglow(1000, 2400, 800, '#ffdc80', 0.55 * glowU, 91);
  }
}

// ——— SET: the pond (morning) + the road with the merchant's chariot ———
function drawPond(t, day2) {
  const B = BG;
  poly(B.f, rect(2300, 0, 4900, 2300), '#cfe8f2', 1, { seed: 200 });
  dab(B.f, 2600, 1500, 90, { col: '#ffe9a0', p: 1, seed: 201 });
  for (let i = 0; i < 9; i++) dab(B.f, 2350 + i * 300, 2250 - 60 * hash(i * 2.2), 170 + 50 * hash(i * 3.3), { col: i % 2 ? '#6fae63' : '#5f9e58', p: 1, seed: 202 + i });
  poly(B.f, rect(2300, 2300, 4900, 3700), '#a9cf7e', 1, { seed: 212 });
  poly(B.f, oval(3050, 2720, 720, 210, 40), '#6fb3c9', 1, { seed: 213 }); edge(B.l, oval(3050, 2720, 720, 210, 40), '#4d8ea6', 6, 0.9, 214);
  for (let i = 0; i < 4; i++) line(B.l, [[2700 + i * 200, 2700 + (i % 2) * 60], [2800 + i * 200, 2700 + (i % 2) * 60]], { w: 3, col: '#e6f5fb', seed: 215 + i });
  const pads = [[2560, 2700, 70], [2760, 2620, 60], [2980, 2790, 80], [3200, 2640, 64], [3400, 2760, 74], [3560, 2660, 60], [2860, 2850, 56], [3300, 2860, 60]];
  pads.forEach(([x, y, r], i) => lilyPad(B.f, x, y, r, 220 + i * 2));
  const taken = day2 && t > 25.4;
  const spots = day2 ? (taken ? [] : [[3200, 2640]]) : [[2560, 2700], [2760, 2620], [3200, 2640], [3400, 2760], [3560, 2660], [2860, 2850]];
  spots.forEach(([x, y], i) => lotus(PROP, x, y - 4, day2 ? 0.9 : 0.75, 240 + i * 30, day2 ? 0.6 : 0));
  poly(B.f, rect(3820, 2900, 4900, 3700), '#d9c08f', 1, { seed: 280 });
  const cx = 4380;   // the chariot: flag with a conch, canopy, body, wheel
  line(B.l, [[cx + 40, 1700], [cx + 40, 2240]], { w: 10, col: K.woodD, seed: 281 });
  const fw = 1 + 0.06 * Math.sin(t * 5), flag = [[cx + 45, 1700], [cx + 45 + 230 * fw, 1740], [cx + 45 + 210 * fw, 1820], [cx + 45 + 230 * fw, 1900], [cx + 45, 1880]];
  poly(B.f, flag, K.pitambar, 1, { seed: 282 }); edge(B.l, flag, K.ink, 3, 0.9, 283);
  shankh(B.l, B.l, cx + 150, 1800, 1.3, K.white, 284);
  const can = smooth([[cx - 260, 2260], [cx - 220, 2080], [cx, 2000], [cx + 220, 2080], [cx + 260, 2260]], 5);
  poly(B.f, can, K.red, 1, { seed: 290 }); edge(B.l, can, K.ink, 4, 0.9, 291);
  marigold(B.l, cx - 250, cx + 250, 2265, 40, 292);
  for (const x of [cx - 230, cx + 230]) poly(B.f, rect(x - 12, 2260, x + 12, 2560), K.gold, 1, { seed: 300 + x });
  poly(B.f, rect(cx - 280, 2560, cx + 280, 2780), '#9b3b2c', 1, { seed: 302 }); edge(B.l, rect(cx - 280, 2560, cx + 280, 2780), K.ink, 5, 0.9, 303);
  line(B.l, [[cx - 280, 2600], [cx + 280, 2600]], { w: 8, col: K.gold, seed: 304 });
  for (let i = 0; i < 5; i++) dab(B.l, cx - 220 + i * 110, 2690, 14, { col: K.gold, p: 1, seed: 305 + i });
  const wx = cx - 120, wy = 2800;
  poly(B.f, handCircle(wx, wy, 150, 310, 0, 30), '#c28a4e', 1, { seed: 311 }); line(B.l, handCircle(wx, wy, 150, 312, 0.05, 30), { w: 8, col: K.woodD, seed: 312 });
  for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI; line(B.l, [[wx + Math.cos(a) * 140, wy + Math.sin(a) * 140], [wx - Math.cos(a) * 140, wy - Math.sin(a) * 140]], { w: 6, col: K.woodD, seed: 313 + i }); }
  dab(B.l, wx, wy, 22, { col: K.gold, p: 1, seed: 322 });
}

// ——— SET: inside the temple (day) — only the feet of the murti are seen ———
function drawMandir(t) {
  const B = BG;
  poly(B.f, rect(4700, 600, 6700, 3000), '#ead3a6', 1, { seed: 400 });
  poly(B.f, rect(4700, 3000, 6700, 3700), '#c9a878', 1, { seed: 401 });
  for (const x of [4900, 6420]) { poly(B.f, rect(x, 600, x + 140, 3000), '#d8bb8a', 1, { seed: 402 + x }); edge(B.l, rect(x, 600, x + 140, 3000), '#a8865a', 4, 0.8, 403 + x); }
  for (let i = 0; i < 4; i++) poly(B.f, handCircle(5710, 2250, 640 - i * 120, 405 + i, 0, 36), ['#eed9ae', '#f2dfb6', '#f5e5bf', '#f8ebc8'][i], 1, { seed: 406 + i });
  poly(B.f, smooth([[5520, 1500], [5900, 1500], [5930, 2480], [5880, 2540], [5540, 2540], [5490, 2480]], 4), K.pitambar, 1, { seed: 410 });
  edge(B.l, [[5490, 2480], [5540, 2540], [5880, 2540], [5930, 2480]], K.ink, 4, 0.9, 411, false);
  line(B.l, [[5500, 2500], [5920, 2500]], { w: 10, col: K.gold, seed: 412 });
  for (let i = 0; i < 4; i++) line(B.l, smooth([[5590 + i * 80, 1600], [5600 + i * 80, 2100], [5590 + i * 80, 2460]], 4, false), { w: 3, col: '#c98f22', seed: 413 + i });
  marigold(B.l, 5500, 5920, 1620, 260, 420);
  for (const x of [5640, 5780]) { const ft = smooth([[x - 44, 2540], [x + 44, 2540], [x + 54, 2610], [x - 50, 2614]], 4); poly(B.f, ft, K.stone, 1, { seed: 440 + x }); edge(B.l, ft, K.ink, 4, 0.9, 441 + x); line(B.l, [[x - 44, 2552], [x + 44, 2552]], { w: 6, col: '#dfe3e8', seed: 442 + x }); }
  for (let i = 0; i < 7; i++) { const x = 5520 + i * 64, pt = smooth([[x - 38, 2660], [x, 2610], [x + 38, 2660]], 4); poly(B.f, pt, K.pink, 1, { seed: 450 + i }); edge(B.l, pt, '#9c3a5e', 3, 0.9, 457 + i); }
  poly(B.f, rect(5440, 2660, 5980, 2940), '#8e7a66', 1, { seed: 470 }); edge(B.l, rect(5440, 2660, 5980, 2940), K.ink, 5, 0.9, 471);
  line(B.l, [[5440, 2700], [5980, 2700]], { w: 6, col: K.gold, seed: 472 });
  bell(B.l, 5120, 1700, 480); bell(B.l, 6300, 1720, 484);
}

// ——— SET: the hut (night / morning) ———
function drawHut(t, day) {
  const B = BG;
  poly(B.f, rect(7000, 600, 9300, 2950), day ? '#c99260' : '#6e4e3a', 1, { seed: 500 });
  poly(B.f, rect(7000, 2950, 9300, 3700), day ? '#8a6446' : '#4a3628', 1, { seed: 501 });
  for (let i = 0; i < 6; i++) line(B.l, [[7100 + i * 360, 700 + (i % 3) * 400], [7260 + i * 360, 720 + (i % 3) * 400]], { w: 4, col: day ? '#a8754a' : '#5a3f2e', seed: 502 + i });
  poly(B.f, rect(8640, 1600, 8920, 1900), day ? '#fff1c4' : '#24305a', 1, { seed: 510 }); edge(B.l, rect(8640, 1600, 8920, 1900), K.woodD, 14, 1, 511);
  line(B.l, [[8780, 1600], [8780, 1900]], { w: 8, col: K.woodD, seed: 512 });
  if (!day) dab(B.f, 8840, 1680, 26, { col: '#fff3c4', p: 1, seed: 513 });
  if (day) for (let i = 0; i < 3; i++) poly(GLOW, [[8650 + i * 90, 1610], [8700 + i * 90, 1610], [8420 + i * 90, 2900], [8330 + i * 90, 2900]], '#ffe9a8', 0.35, { seed: 514 + i });
  poly(B.f, rect(7150, 1900, 7550, 1930), K.woodD, 1, { seed: 520 });
  for (let i = 0; i < 3; i++) { poly(B.f, handCircle(7210 + i * 120, 1850, 44, 521 + i, 0, 18), '#b8693a', 1, { seed: 524 + i }); edge(B.l, handCircle(7210 + i * 120, 1850, 44, 527 + i, 0, 18), K.ink, 3, 0.8, 530 + i); }
  if (!day) sglow(7480, 2700, 700, '#ffb860', 0.4, 536);
}
function cotBack(C) { part(C, rect(8000, 2760, 8640, 2800), { col: K.woodD, p: 1, seed: 540 }, { w: 4, col: K.ink, seed: 541 }); part(C, rrect(8140, 2380, 8440, 2520, 30), { col: '#f1ece0', p: 1, seed: 542 }, { w: 3, col: K.ink, seed: 543 }); }
function cotFront(C, day) {
  part(C, smooth([[8020, 2580], [8580, 2570], [8640, 2810], [7980, 2820]], 4), { col: day ? '#c25b4a' : '#8f3f3a', p: 1, seed: 545 }, { w: 4, col: K.ink, seed: 546 });   // the blanket
  for (let i = 1; i < 5; i++) line(C.l, [[8020 + i * 112, 2580], [7990 + i * 130, 2815]], { w: 3, col: day ? '#a84a3c' : '#73302c', seed: 547 + i });
  part(C, rect(7970, 2800, 8650, 2850), { col: K.wood, p: 1, seed: 552 }, { w: 4, col: K.ink, seed: 553 });
  for (const x of [7990, 8610]) part(C, rect(x - 18, 2850, x + 18, 3020), { col: K.woodD, p: 1, seed: 554 + x }, { w: 4, col: K.ink, seed: 555 + x });
}
function stool(C, x, y) { part(C, rect(x - 110, y, x + 110, y + 40), { col: K.wood, p: 1, seed: 560 }, { w: 4, col: K.ink, seed: 561 }); for (const sg of [-1, 1]) part(C, rect(x + sg * 80 - 14, y + 40, x + sg * 80 + 14, y + 200), { col: K.woodD, p: 1, seed: 562 + sg }, { w: 4, col: K.ink, seed: 564 + sg }); }

// ——— SET: palm close-up (4 copper coins / 10 gold coins) ———
function drawPalm(t, gold) {
  const B = BG;
  poly(B.f, rect(9300, 1100, 10700, 3600), gold ? '#5c4630' : '#3a2c26', 1, { seed: 600 });
  sglow(10000, 2420, 620, gold ? '#ffd76a' : '#c98a5a', gold ? 0.6 : 0.4, 602);
  const sk = gold ? K.skin : K.skinO;
  const palm = smooth([[9700, 2300], [9800, 2200], [10200, 2200], [10330, 2290], [10340, 2560], [10220, 2700], [9800, 2700], [9680, 2560]], 5);
  part(PROP, tube([[9560, 3600], [9800, 2700]], 300, 260), { col: gold ? K.pitambar : K.saffron, p: 1, seed: 603 }, { w: 5, col: K.ink, seed: 604 });
  for (let i = 0; i < 4; i++) part(PROP, tube([[9840 + i * 112, 2300], [9826 + i * 120, 1990 + (i === 0 || i === 3 ? 50 : 0)]], 96, 84), { col: sk, p: 1, seed: 607 + i }, { w: 5, col: K.ink, seed: 611 + i });
  part(PROP, tube([[9760, 2500], [9600, 2360]], 100, 84), { col: sk, p: 1, seed: 615 }, { w: 5, col: K.ink, seed: 616 });
  part(PROP, palm, { col: sk, p: 1, seed: 605 }, { w: 5, col: K.ink, seed: 606 });
  line(PROP.l, smooth([[9760, 2380], [10000, 2330], [10260, 2380]], 4, false), { w: 3, col: '#a8705a', seed: 617 });
  if (!gold) {   // an open cloth potli, 4 copper coins
    part(PROP, smooth([[9740, 2560], [9780, 2400], [10000, 2340], [10240, 2400], [10280, 2580], [10000, 2650]], 4), { col: '#cdbb92', p: 1, seed: 620 }, { w: 4, col: K.ink, seed: 621 });
    const cs = [[9880, 2470], [10010, 2440], [10130, 2490], [9970, 2560]];
    cs.forEach(([x, y], i) => { if (t > 18.75 + i * 0.25) coin(PROP, x, y, 46, false, 630 + i * 6); });
  } else {
    const cs = [[9840, 2500], [9940, 2460], [10050, 2440], [10160, 2470], [9880, 2580], [9990, 2550], [10100, 2560], [10210, 2580], [9950, 2640], [10070, 2640]];
    cs.forEach(([x, y], i) => { if (t > 32.25 + i * 0.09) coin(PROP, x, y - 30 * (1 - eo(pr(t, 32.25 + i * 0.09, 32.45 + i * 0.09))), 44, true, 660 + i * 6); });
    if (t > 33.2) for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + t * 2; line(FX, [[10000 + Math.cos(a) * 300, 2520 + Math.sin(a) * 200], [10000 + Math.cos(a) * 360, 2520 + Math.sin(a) * 240]], { w: 6, col: K.goldL, seed: 720 + i }); }
  }
}

// ——— SET: puja or Maa? (split, diagonal) ———
function drawDilemma(t) {
  const B = BG, look = t < 37.7 ? -1 : 1;
  poly(B.f, [[10600, 1000], [11760, 1000], [11440, 3700], [10600, 3700]], look < 0 ? '#f5cf7a' : '#c9a35a', 1, { seed: 800 });
  poly(B.f, [[11760, 1000], [12600, 1000], [12600, 3700], [11440, 3700]], look > 0 ? '#34406a' : '#262e4c', 1, { seed: 801 });
  line(B.l, [[11760, 1000], [11440, 3700]], { w: 10, col: K.ink, seed: 802 });
  poly(B.f, smooth([[11170, 1900], [11410, 1900], [11430, 2330], [11150, 2330]], 4), K.pitambar, 1, { seed: 803 });
  for (const x of [11240, 11340]) poly(B.f, smooth([[x - 34, 2330], [x + 34, 2330], [x + 40, 2380], [x - 38, 2384]], 4), K.stone, 1, { seed: 804 + x });
  for (let i = 0; i < 5; i++) poly(B.f, smooth([[11150 + i * 70 - 34, 2440], [11150 + i * 70, 2390], [11150 + i * 70 + 34, 2440]], 4), K.pink, 1, { seed: 806 + i });
  poly(B.f, rect(11110, 2440, 11470, 2640), '#8e7a66', 1, { seed: 812 }); edge(B.l, rect(11110, 2440, 11470, 2640), K.ink, 4, 0.9, 813);
  bell(B.l, 11140, 1700, 814); diya(PROP, 11140, 2430, 1.1, 818);
  person2(PE, bust('amma', 11960, 2240, 0.85, t, { L: 300, patti: 1, sweat: 1, exp: { eyes: 'closed', brows: 'worried', mouth: 'sad' } }), 3000);
  part(PE, smooth([[11750, 2470], [12180, 2460], [12220, 2620], [11720, 2630]], 4), { col: '#8f3f3a', p: 1, seed: 820 }, { w: 4, col: K.ink, seed: 821 });
  part(PE, rect(11700, 2620, 12240, 2660), { col: K.wood, p: 1, seed: 822 }, { w: 4, col: K.ink, seed: 823 });
  return look;
}

// ——— printed words: big, high-contrast, top third ———
const SUBY = 280;
const SUBCOL = { N: K.white, R: '#ffc27a', A: '#ffb3c6', V: '#b8f0c0', B: '#ffe46b', P: '#fff0b8' };
const WHO = { R: 'राघव', A: 'माँ', V: 'वैद्य जी', B: 'व्यापारी', P: '???' };
function box(cx, cy, hw, hh, col = 'rgba(20,19,26,0.93)') {
  const g = SUBT.g; g.save(); g.fillStyle = col; g.beginPath();
  for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 2, px = Math.cos(a), py = Math.sin(a), sq = Math.pow(Math.abs(px), 0.3) * Math.sign(px), sqy = Math.pow(Math.abs(py), 0.5) * Math.sign(py), nn = 1 + 0.03 * Math.sin(a * 7 + 1.3) + 0.02 * Math.sin(a * 17); g.lineTo(cx + sq * hw * nn, cy + sqy * hh * nn); }
  g.closePath(); g.fill(); g.restore();
}
function subTo(t) {
  const S = SUBS.find(s => t >= s.t0 && t < s.t1); if (!S) return;
  const lines = S.text.split('|'), size0 = lines.length > 1 ? 70 : 78, lh = size0 * 1.3;
  const g = SUBK.g; g.save(); g.font = `700 ${size0}px Kalam`; const tw = Math.max(...lines.map(l => g.measureText(l).width)); g.restore();
  const sc = tw > 960 ? 960 / tw : 1, size = size0 * sc, hh = 52 + (lines.length - 1) * lh * sc / 2;
  const cy = SUBY + (lines.length - 1) * lh * sc / 2;
  box(540, cy, Math.min(tw * sc / 2 + 50, 532), hh);
  if (WHO[S.who]) { const nw = 30 + 21 * WHO[S.who].length; box(120 + nw / 2, cy - hh - 22, nw / 2 + 14, 34, SUBCOL[S.who]); wtext(SUBT, WHO[S.who], 120 + nw / 2, cy - hh - 8, { screen: true, size: 42, weight: 700, col: K.ink, seed: 5, tilt: 0 }); }
  lines.forEach((ln, i) => wtext(SUBT, ln, 540, SUBY + 24 + i * lh * sc, { screen: true, size, weight: 700, col: SUBCOL[S.who], reveal: pr(t, S.t0 + i * 0.3, S.t0 + i * 0.3 + 0.4), seed: 11 + S.t0 * 3 + i, tilt: 0.3 }));
}
export const TEXTS = t => { const S = SUBS.find(s => t >= s.t0 && t < s.t1); if (!S) return []; const n = S.text.split('|').length; return [{ id: 's' + S.t0, text: S.text.replace('|', ' '), x0: 20, y0: SUBY - 90, x1: 1060, y1: SUBY + 70 + (n - 1) * 90 }]; };
const LABELS = [[4.7, 7.5, 'एक दिन पहले…'], [23.95, 26.6, 'अगली सुबह…']];
const CHIPS = [[18.6, 21.4, [[19.3, 'दवा: 10 सोने के सिक्के', K.goldL], [20.3, 'पास में: 4 ताँबे के सिक्के', '#ffb38a']]]];
function badge(t) {   // "भाग 1/2" — on screen the whole time (Jayant: people must know there are 2 parts)
  if (t > 57.4) return;
  const x = 905, y = 560; box(x, y, 118, 40, 'rgba(160,30,40,0.92)');
  wtext(SUBT, 'भाग 1/2', x, y + 16, { screen: true, size: 46, weight: 700, col: K.white, seed: 3, tilt: 0 });
}
function labels(t) {
  const L = LABELS.find(l => t >= l[0] && t < l[1]);
  if (L) { box(540, 1690, 330, 60); wtext(SUBT, L[2], 540, 1712, { screen: true, size: 62, weight: 700, col: K.note, reveal: pr(t, L[0] + 0.1, L[0] + 0.5), seed: 61 + L[0], tilt: 0 }); }
  for (const [a, b, items] of CHIPS) if (t >= a && t < b) items.forEach(([t0, txt, col], i) => {
    if (t < t0) return; const u = back1(pr(t, t0, t0 + 0.3)), y = 1500 + i * 135;
    box(540, y, 420 * u + 1, 54 * u + 1); wtext(SUBT, txt, 540, y + 21, { screen: true, size: 60 * u + 1, weight: 700, col, seed: 70 + i + a, tilt: 0 });
  });
  if (t > 2.6 && t < 4.6) {   // title + भाग 1
    const u = back1(pr(t, 2.6, 2.9)); box(540, 1560, 470 * u + 1, 92 * u + 1);
    wtext(SUBT, 'कर्तव्य या भक्ति?', 540, 1600, { screen: true, size: 118 * u + 1, weight: 700, col: K.goldL, seed: 81, tilt: 0 });
    const v = back1(pr(t, 3.0, 3.3)); box(540, 1716, 150 * v + 1, 48 * v + 1, 'rgba(160,30,40,0.95)');
    wtext(SUBT, 'भाग 1', 540, 1738, { screen: true, size: 66 * v + 1, weight: 700, col: K.white, seed: 82, tilt: 0 });
  }
  if (t > 34.05 && t < 35.4) { const u = back1(pr(t, 34.05, 34.35)); box(540, 1620, 200 * u + 1, 84 * u + 1); wtext(SUBT, 'दस?!', 540, 1664, { screen: true, size: 130 * u + 1, weight: 700, col: K.goldL, seed: 84, tilt: 0 }); }
}
function endCard(t) {
  if (t < 57.4) return;
  const g = SUBT.g; g.save(); g.fillStyle = 'rgba(20,19,26,0.94)'; g.fillRect(0, 1200, W, 720); g.restore();
  wtext(SUBT, 'भाग 1 यहीं तक…', 540, 1330, { screen: true, size: 70, weight: 700, col: K.bone, reveal: pr(t, 57.45, 57.8), seed: 90, tilt: 0 });
  const u = back1(pr(t, 57.8, 58.1)); box(540, 1460, 420 * u + 1, 76 * u + 1, 'rgba(160,30,40,0.97)');
  wtext(SUBT, 'भाग 2 · कल शाम 7:30', 540, 1494, { screen: true, size: 92 * u + 1, weight: 700, col: K.goldL, seed: 91, tilt: 0 });
  wtext(SUBT, 'Follow करो — छूट न जाए!', 540, 1620, { screen: true, size: 62, weight: 700, col: K.note, reveal: pr(t, 58.3, 58.7), seed: 92, tilt: 0 });
  wtext(SUBT, '@pannapalatkahani', 540, 1730, { screen: true, size: 56, weight: 700, col: '#e3e7ea', reveal: pr(t, 58.6, 59.0), seed: 93, tilt: 0 });
}

// ——— events for the mixer ———
export const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
SUBS.forEach(S => { if (S.vo) ev(S.vt, 'voice', { id: S.vo, who: S.who }); });
ev(0.0, 'crickets', { dur: 4.6 }); ev(2.5, 'stab'); ev(4.6, 'whoosh'); ev(4.7, 'birds', { dur: 3.0 }); ev(7.6, 'bell'); ev(9.0, 'chime');
ev(13.8, 'whoosh'); ev(14.0, 'crickets', { dur: 4.6 }); ev(18.6, 'coins'); ev(19.3, 'tick'); ev(20.3, 'tick'); ev(21.4, 'crickets', { dur: 2.5 });
ev(23.9, 'birds', { dur: 3.0 }); ev(26.8, 'hooves', { dur: 1.6 }); ev(32.2, 'coins', { gold: 1 }); ev(33.2, 'sparkle', { dur: 0.8 }); ev(34.0, 'hit');
for (let i = 0; i < 5; i++) ev(35.5 + i * 1.0, 'heartbeat'); ev(41.6, 'glint'); ev(42.9, 'whoosh'); ev(45.9, 'sparkle', { dur: 1.0 });
ev(48.6, 'crickets', { dur: 5.6 }); ev(54.2, 'swell', { dur: 2.6 }); ev(54.8, 'bell'); ev(57.4, 'write', { dur: 1.2 });
[['A', 0], ['B', 4.6], ['C', 13.8], ['D', 23.9], ['E', 29.6], ['F', 35.4], ['G', 40.0], ['H', 45.6], ['I', 48.6], ['J', 54.2], ['Z', 56.8]].forEach(([id, t]) => ev(t, 'cue', { id }));

// ——— one frame ———
export function frame(comp, t) {
  const S = shotAt(t), set = S[2];
  const e = ss((t - S[0]) / (S[1] - S[0]));
  CAM.x = lerp(S[3][0], S[4][0], e); CAM.y = lerp(S[3][1], S[4][1], e); CAM.s = lerp(S[3][2], S[4][2], e);
  const [shx, shy] = shake(t); CAM.x += shx / CAM.s; CAM.y += shy / CAM.s;
  BOIL.amp = 0;
  [PE, PROP, FG].forEach(clearGroup);
  [BG.f, BG.l, GLOW, FX, SUBK, SUBT].forEach(clear);
  let vig = 0.22;
  if (set === 'steps') {
    const glowU = t < 54.2 ? 0 : pr(t, 54.2, 55.6);
    drawSteps(t, glowU);
    diya(PROP, 700, 2805, 1.2, 100);
    const lit = glowU > 0, x = 1000, hy = 2470;
    const look = lit ? [0, -1] : [0, 0.9];
    const speak = talking(t, 0.2, 2.4) === 'open' || talking(t, 49.0, 53.2) === 'open';
    const exp = lit ? { eyes: 'pop', brows: 'up', mouth: t > 56.8 ? 'o' : 'open' } : { eyes: 'shut', brows: 'worried', mouth: speak ? 'open' : 'sad' };
    const gy = 2810, k = 1.0, shy = gy - AH * k;
    const hands = lit ? { L: [x - 150, shy + 180], R: [x + 150, shy + 180] } : { L: [x - 120, shy + 250], R: [x + 120, shy + 250] };
    person2(PE, stand('raghav', x, gy, k, t, { exp, look, hands, tears: !lit || t > 56.8 }), 2000);

    vig = lit ? 0.18 : 0.34;
  } else if (set === 'pond') {
    const day2 = t >= 23.9;
    drawPond(t, day2);
    if (t < 7.6) {   // day 1: his best lotus
      const x = 3000, gy = 3020, k = 1.05, hy = gy - AH * k;
      const arms = person2(FG, stand('raghav', x, gy, k, t, { exp: { eyes: 'open', brows: 'flat', mouth: 'smile' }, look: [0.6, 0.4], hands: { L: [x - 20, hy + 250], R: [x + 40, hy + 245] } }), 2000);
      lotus(FG, (arms.L[0] + arms.R[0]) / 2, Math.min(arms.L[1], arms.R[1]) - 10, 0.8, 150);
    } else if (t < 26.8) {   // day 2: only one lotus — he takes it
      const x = 3000, gy = 3020, k = 1.05, hy = gy - AH * k, got = t > 25.4;
      const arms = person2(FG, stand('raghav', x, gy, k, t, { exp: { eyes: 'open', brows: 'worried', mouth: got ? 'small' : 'sad' }, look: got ? [0.4, 0.6] : [1, 0.3], hands: got ? { L: [x - 20, hy + 250], R: [x + 40, hy + 245] } : { L: [x - 80, hy + 320], R: [x + 80, hy + 320] } }), 2000);
      if (got) lotus(FG, (arms.L[0] + arms.R[0]) / 2, Math.min(arms.L[1], arms.R[1]) - 10, 0.8, 150, 0.4);
    } else {   // the merchant
      const rx = 3380, mx = 3990, gy = 3020, rk = 1.05, mk = 1.1, rhy = gy - AH * rk, mhy = gy - AH * mk;
      const give = t >= 40.0, handed = t > 41.2;
      const talk = t > 29.8 && t < 33.9;
      const mExp = give ? { eyes: t > 41.4 && t < 42.3 ? 'half' : 'open', brows: 'flat', mouth: 'knowing' } : talk ? { eyes: 'open', brows: 'flat', mouth: talking(t, 29.8, 33.8) === 'open' ? 'open' : 'smile' } : { eyes: 'open', brows: 'flat', mouth: 'smile' };
      const mHands = give ? { L: [lerp(mx - 110, mx - 230, eo(pr(t, 40.3, 41.0))), mhy + 230], R: [mx + 80, mhy + 320] } : talk ? { L: [mx - 160, mhy + 190], R: [mx + 80, mhy + 320] } : { L: [mx - 80, mhy + 320], R: [mx + 80, mhy + 320] };
      const marms = person2(PE, stand('vyapari', mx, gy, mk, t, { exp: mExp, look: [-1, 0], hands: mHands }), 3000);
      const rExp = t >= 34.0 && t < 35.4 ? { eyes: 'pop', brows: 'up', mouth: 'open' } : give ? { eyes: 'open', brows: 'worried', mouth: handed ? 'sad' : 'flat' } : { eyes: 'open', brows: 'flat', mouth: 'small' };
      const rHands = give && !handed ? { L: [rx - 30, rhy + 260], R: [lerp(rx + 70, rx + 250, eo(pr(t, 40.1, 40.9))), rhy + 230] } : handed ? { L: [rx - 40, rhy + 250], R: [rx + 60, rhy + 250] } : { L: [rx - 10, rhy + 250], R: [rx + 50, rhy + 245] };
      const rarms = person2(FG, stand('raghav', rx, gy, rk, t, { exp: rExp, look: [1, 0], hands: rHands, tears: handed }), 2000);
      if (!handed) lotus(FG, give ? rarms.R[0] + 10 : (rarms.L[0] + rarms.R[0]) / 2, rarms.R[1] - 10, 0.8, 150, 0.4);
      else { lotus(PE, marms.L[0], marms.L[1] - 6, 0.8, 150, 0.6);   // the merchant holds it; Raghav holds a red potli of gold
        const h = rarms.R;
        part(FG, smooth([[h[0] - 40, h[1] + 40], [h[0] - 30, h[1] - 20], [h[0], h[1] - 34], [h[0] + 30, h[1] - 20], [h[0] + 40, h[1] + 40]], 4), { col: '#c7362f', p: 1, seed: 170 }, { w: 3, col: K.ink, seed: 171 });
        dab(FG.l, h[0], h[1] - 34, 10, { col: K.gold, p: 1, seed: 172 }); }
      if (t > 41.5 && t < 42.4) {   // a gold glint in the merchant's eye
        const h = [mx + 22 * mk, mhy - 4 * mk], u = Math.sin(Math.PI * pr(t, 41.5, 42.4)) * 34;
        line(FX, [[h[0] - u, h[1]], [h[0] + u, h[1]]], { w: 5, col: K.goldL, seed: 180 }); line(FX, [[h[0], h[1] - u], [h[0], h[1] + u]], { w: 5, col: K.goldL, seed: 181 });
      }
    }
    vig = 0.16;
  } else if (set === 'mandir') {
    drawMandir(t);
    diya(PROP, 5400, 2930, 1.3, 490); diya(PROP, 6040, 2930, 1.3, 495);
    const x = 5330, hy = 2560, k = 1.05, placed = t > 9.0, pray = t > 10.0;
    const hands = pray ? { L: [x + 6, hy + 180], R: [x + 30, hy + 176] } : { L: [lerp(x + 40, x + 200, eo(pr(t, 7.8, 8.9))), hy + 250], R: [lerp(x + 80, x + 250, eo(pr(t, 7.8, 8.9))), hy + 240] };
    const arms = person2(FG, seat('raghav', x, t, { hy, k, kneel: 1, exp: pray ? { eyes: 'closed', brows: 'worried', mouth: talking(t, 10.2, 13.5) === 'open' ? 'open' : 'small' } : { eyes: 'open', brows: 'flat', mouth: 'smile' }, look: [1, 0.4], hands }), 2000);
    if (!placed) lotus(FG, (arms.L[0] + arms.R[0]) / 2, Math.min(arms.L[1], arms.R[1]) - 10, 0.8, 150, 0.3);
    else lotus(PROP, 5710, 2612, 0.85, 150, 0.5);
    vig = 0.2;
  } else if (set === 'hut' || set === 'hutday') {
    const day = set === 'hutday';
    drawHut(t, day);
    cotBack(PE);
    const better = day && t > 45.8;
    person2(PE, seat('amma', 8290, t, { hy: 2300, k: 0.95, patti: !better, sweat: !day, exp: better ? { eyes: 'open', brows: 'flat', mouth: talking(t, 46.0, 47.4) === 'open' ? 'open' : 'smile' } : { eyes: 'closed', brows: 'worried', mouth: 'sad' }, look: [1, 0.2], hands: { L: [8220, 2590], R: [8360, 2590] } }), 3000);
    cotFront(PE, day);
    if (!day) {
      if (t < 18.6) {   // the vaidya writes the medicine
        const vx = 7720, vhy = 2430;
        person2(PROP, seat('vaidya', vx, t, { hy: vhy, k: 1.0, exp: { eyes: 'open', brows: 'down', mouth: talking(t, 14.0, 18.4) === 'open' ? 'open' : 'flat' }, look: [1, 0], hands: { L: [vx + 10, vhy + 300], R: [vx + 110, vhy + 280 + 6 * Math.sin(t * 9)] } }), 3500);
        stool(PROP, vx, vhy + 400);
        part(PROP, rect(vx - 10, vhy + 250, vx + 120, vhy + 330), { col: '#f3ead2', p: 1, seed: 570 }, { w: 3, col: K.ink, seed: 571 });
        for (let i = 0; i < 3; i++) line(PROP.l, [[vx + 10, vhy + 270 + i * 20], [vx + 10 + 90 * clamp((t - 14.2 - i) / 1.2), vhy + 270 + i * 20]], { w: 3, col: K.ink, seed: 572 + i });
      }
      const x = 8620, gy = 3060, k = 1.0, hy = gy - AH * k, cry = t >= 21.4;
      person2(FG, stand('raghav', x, gy, k, t, { exp: cry ? { eyes: 'shut', brows: 'worried', mouth: 'sad' } : { eyes: 'open', brows: 'worried', mouth: 'flat' }, look: [-1, 0.3], hands: cry ? { L: [x - 80, hy + 320], R: [x + 26, hy + 14] } : { L: [x - 30, hy + 250], R: [x + 30, hy + 250] }, tears: cry }), 2000);
      diya(PROP, 7480, 2950, 1.2, 580);
      vig = 0.34;
    } else {   // morning: the medicine
      const x = 8580, hy = 2420, k = 1.0;
      const arms = person2(FG, seat('raghav', x, t, { hy, k, kneel: 1, exp: better ? { eyes: 'open', brows: 'up', mouth: 'grin' } : { eyes: 'open', brows: 'worried', mouth: 'small' }, look: [-1, -0.2], tears: better, hands: better ? { L: [x - 150, hy + 200], R: [x - 20, hy + 250] } : { L: [x - 180, hy + 140], R: [x - 60, hy + 200] } }), 2000);
      if (!better) part(FG, smooth([[arms.L[0] - 40, arms.L[1] - 10], [arms.L[0] + 40, arms.L[1] - 10], [arms.L[0] + 26, arms.L[1] + 24], [arms.L[0] - 26, arms.L[1] + 24]], 3), { col: '#b8693a', p: 1, seed: 590 }, { w: 3, col: K.ink, seed: 591 });
      vig = 0.16;
    }
  } else if (set === 'coins' || set === 'gold') {
    drawPalm(t, set === 'gold');
    vig = 0.3;
  } else if (set === 'dilemma') {
    const look = drawDilemma(t);
    const x = 11560, gy = 3060, k = 1.15, hy = gy - AH * k;
    const arms = person2(FG, stand('raghav', x, gy, k, t, { exp: { eyes: 'open', brows: 'worried', mouth: 'wavy' }, look: [look, -0.1], hands: { L: [x - 40, hy + 230], R: [x + 70, hy + 210] }, sweat: 1 }), 2000);
    lotus(FG, (arms.L[0] + arms.R[0]) / 2, Math.min(arms.L[1], arms.R[1]) - 10, 0.85, 150, 0.4);
    const beat = Math.exp(-((t - 35.5) % 1.0) / 0.12);
    vig = 0.25 + 0.15 * beat;
  }
  badge(t);
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
