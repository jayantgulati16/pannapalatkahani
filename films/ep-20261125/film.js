// असली कौन? — Who's the Real One? (The Digital Clone). Ep 8, posts 25 Nov 2026. Vertical 1080×1920, 24 fps, 59 s. Clean cartoon.
// Story by Jayant. Cold open: Aryan and his own face on the laptop. A week earlier he made an AI clone of himself; it took his meetings
// (promotion!), then every call — office, friends, family. Maa: "you were just talking to me!". Passwords changed. The clone: "thanks for
// teaching me all your habits… I don't need you now." Cyber cell: the record says the real Aryan is logged in at office, biometric
// verified — "then who are you?" Loops back to his frightened face.
import { layer, clear, line, fill, dab, handCircle, smooth, CAM, BOIL, WMUL, STYLE, W, H, sx, sy } from './crayon.js';
import { group, clearGroup, part, tube } from './rig.js';
import { clamp, lerp, hash, ss, eio, eo, ei } from '/core/lib.js';
STYLE.clean = true;

export const DUR = 59.0;
const NOSUBS = new URLSearchParams(location.search).get('nosubs') === '1';
const K = { ink: '#1d1b22', bone: '#fbf8f1', cream: '#f3ead2', white: '#ffffff', grey: '#9a9aa3', dgrey: '#55555f', steel: '#b9bfc6', steelD: '#6f767f', steelL: '#e3e7ea',
  wood: '#b57f52', woodD: '#7d5434', red: '#e2412f', green: '#4f9a5a', leaf: '#7cc36e', yellow: '#f5c63c', note: '#ffe46b', pink: '#ee8ea4', orange: '#ec8a3c',
  teal: '#3fa39a', navy: '#2f3e66', blue: '#5f86b0', skin: '#e2ab88', skinM: '#d9a27f', skinO: '#c98d68', night: '#25304f', amber: '#e7b25a', water: '#9fd0f0',
  cyan: '#6fe3ff', scr: '#16202e', lime: '#5dff9a', hoodie: '#3d5a80', khaki: '#b8a06a', saree: '#9c2a4a', gold: '#d8a23a' };
const PAPER = [0.965, 0.955, 0.93];
const pr = (t, a, b) => clamp((t - a) / (b - a));
const q2 = t => Math.floor(t * 12 + 1e-6) / 12;
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const rrect = (x0, y0, x1, y1, r) => { const p = []; for (const [cx, cy, a0] of [[x1 - r, y0 + r, -Math.PI / 2], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, Math.PI / 2], [x0 + r, y0 + r, Math.PI]]) for (let i = 0; i <= 6; i++) { const a = a0 + i / 6 * Math.PI / 2; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return p; };
const back1 = u => { u = clamp(u) - 1; return 1 + u * u * (2.8 * u + 1.8); };

// ——— printed words / voice script (N narrator, R Aryan, C the clone, A Maa, O officer) — '|' breaks a line ———
export const SUBS = [
  { t0: 0.0, t1: 3.5, text: '“मैं असली आर्यन हूँ…|तो फिर ये कौन है?!”', who: 'R', vo: 'r1', vt: 0.2 },
  { t0: 4.0, t1: 9.2, text: 'थके हुए आर्यन ने बनाया अपना AI क्लोन —|हूबहू वही शक्ल, वही आवाज़।', who: 'N', vo: 'n1', vt: 4.1 },
  { t0: 9.6, t1: 15.2, text: 'अगली सुबह क्लोन ने मीटिंग संभाली…|और बॉस ने प्रमोशन दे दिया!', who: 'N', vo: 'n2', vt: 9.7 },
  { t0: 15.8, t1: 21.6, text: 'फिर तो हर कॉल — दोस्त, घरवाले…|सब क्लोन के हवाले!', who: 'N', vo: 'n3', vt: 15.9 },
  { t0: 24.5, t1: 29.4, text: '“अरे! तू तो अभी-अभी|मुझसे बात कर रहा था!”', who: 'A', vo: 'a1', vt: 24.6 },
  { t0: 30.8, t1: 36.4, text: 'आर्यन ने ऐप बंद करना चाहा…|पर सारे पासवर्ड बदल चुके थे!', who: 'N', vo: 'n4', vt: 31.0 },
  { t0: 37.6, t1: 44.6, text: '“अपनी हर आदत सिखाने का शुक्रिया…|अब तुम्हारी ज़रूरत नहीं।”', who: 'C', vo: 'c1', vt: 37.7 },
  { t0: 45.3, t1: 50.4, text: '“सर! मेरे AI क्लोन ने|मेरी पहचान चुरा ली!”', who: 'R', vo: 'r2', vt: 45.4 },
  { t0: 51.4, t1: 57.4, text: '“असली आर्यन तो अभी ऑफिस में काम कर रहा है…|तुम कौन हो?”', who: 'O', vo: 'o1', vt: 51.5 },
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
    else if (e.eyes === 'half') { line(C.l, tp([[cx - 10, eyeY - 1], [cx + 10, eyeY - 1]]), { w: 4.5, col: K.ink, seed: sd + 30 + sg }); const c = tp([[ex, ey + 2]])[0]; dab(C.l, c[0], c[1], 4.5, { col: s.eyeCol || K.ink, p: 1, seed: sd + 32 + sg }); }
    else if (e.eyes === 'pop') { const c = tp([[ex, ey]])[0]; fill(C.f, tp(handCircle(cx, eyeY, 12, sd + 27 + sg, 0, 18)), { col: K.white, p: 0.9, gap: 3, w: 5, seed: sd + 26 + sg, over: 1 }); line(C.l, tp(handCircle(cx, eyeY, 12, sd + 28 + sg, 0.1, 20)), { w: 3.5, col: K.ink, seed: sd + 28 + sg }); dab(C.l, c[0], c[1], 3.5, { col: K.ink, p: 1, seed: sd + 32 + sg }); }
    else { const c = tp([[ex, ey]])[0]; dab(C.l, c[0], c[1], 6, { col: s.eyeCol || K.ink, p: 1, gap: 3, w: 5, seed: sd + 32 + sg }); dab(C.l, c[0] + 2, c[1] - 2.5, 2, { col: K.white, p: 1, gap: 1.5, w: 3, seed: sd + 34 + sg }); }
    const b = e.brows === 'up' ? [-26, -24] : e.brows === 'down' ? [-17, -22] : e.brows === 'worried' ? [-25, -17] : [-20, -20];
    line(C.l, tp([[sg * 8, b[0]], [sg * 26, b[1]]]), { w: 4, col: K.ink, seed: sd + 36 + sg });
  }
  const m = e.mouth;
  if (m === 'open') part(C, tp([[-13, 18], [13, 18], [9, 30], [0, 33], [-9, 30]]), { col: '#5a1f22', p: 0.9, gap: 4, w: 6, seed: sd + 50 }, { w: 4, col: K.ink, seed: sd + 51 });
  else if (m === 'yawn') part(C, tp(handCircle(0, 26, 12, sd + 49, 0, 18)), { col: '#5a1f22', p: 0.9, gap: 4, w: 6, seed: sd + 50 }, { w: 4, col: K.ink, seed: sd + 51 });
  else if (m === 'o') line(C.l, tp(handCircle(0, 25, 7, sd + 52, 0.1, 14)), { w: 4, col: K.ink, seed: sd + 52 });
  else if (m === 'flat') line(C.l, tp([[-9, 25], [9, 24]]), { w: 4, col: K.ink, seed: sd + 53 });
  else if (m === 'wavy') line(C.l, tp([[-12, 25], [-6, 21], [0, 26], [6, 21], [12, 25]]), { w: 4, col: K.ink, seed: sd + 53 });
  else if (m === 'smile') line(C.l, tp(smooth([[-12, 19], [0, 28], [12, 19]], 5, false)), { w: 4.5, col: K.ink, seed: sd + 58 });
  else if (m === 'smirk') line(C.l, tp(smooth([[-12, 24], [2, 27], [14, 18]], 5, false)), { w: 4.5, col: K.ink, seed: sd + 58 });
  else line(C.l, tp(smooth([[-6, 23], [0, 26], [6, 23]], 5, false)), { w: 4, col: K.ink, seed: sd + 56 });
}

// ——— layers ———
const BG = { f: layer(), l: layer() }, GLOW = layer(), PE = group(), PROP = group(), FG = group(), FX = layer(), SUBK = layer(), SUBT = layer();

// ——— shots: [t0, t1, set, cam0, cam1] ———
const SHOTS = [
  [0.0, 3.6, 'room', [895, 2000, 1.24], [895, 2010, 1.36]],        // hook: two Aryans
  [3.6, 6.4, 'room', [960, 1960, 0.8], [960, 1980, 0.9]],         // a week earlier, 11 PM, he clicks
  [6.4, 9.4, 'room', [1160, 1990, 1.9], [1160, 1990, 2.1]],       // the clone on the screen
  [9.4, 12.4, 'bed', [2950, 2100, 0.95], [2950, 2120, 1.1]],      // sleeping in, the phone buzzes
  [12.4, 14.4, 'phone', [6900, 2100, 1.25], [6900, 2100, 1.32]],  // boss: promotion!
  [14.4, 15.6, 'bed', [2950, 2050, 1.3], [2950, 2040, 1.45]],     // joy
  [15.6, 21.0, 'sofa', [5050, 2120, 0.92], [5060, 2130, 1.0]],    // gaming; every call to the clone
  [21.0, 22.4, 'sofa', [5450, 2160, 2.6], [5450, 2160, 2.8]],     // the clone glances sideways
  [22.4, 24.4, 'sofa', [4690, 2110, 1.9], [4690, 2110, 2.0]],     // a week later, he calls Maa
  [24.4, 29.0, 'phone', [6900, 2100, 1.25], [6900, 2110, 1.34]],  // Maa: "you were just talking to me!"
  [29.0, 30.6, 'sofa', [4690, 2080, 2.2], [4690, 2075, 2.45]],    // twist 1 — his face
  [30.6, 37.4, 'room', [1000, 1980, 1.15], [1000, 1990, 1.4]],    // ACCESS DENIED
  [37.4, 44.8, 'room', [1160, 1990, 2.0], [1160, 1980, 2.35]],    // the clone speaks
  [44.8, 50.6, 'station', [9000, 2300, 0.74], [9000, 2310, 0.8]],// cyber cell
  [50.6, 53.6, 'station', [9530, 2210, 2.4], [9530, 2210, 2.6]],  // LIVE OFFICE LOGIN: ARYAN
  [53.6, 56.0, 'station', [9150, 2080, 2.3], [9150, 2080, 2.45]], // the officer's stare
  [56.0, 59.01, 'station', [8500, 2400, 2.1], [8500, 2395, 2.3]], // twist 2 — his face, loop
];
function shotAt(t) { return SHOTS.find(s => t >= s[0] && t < s[1]) || SHOTS[SHOTS.length - 1]; }
const HITS = [[0.05, 8], [5.4, 6], [12.6, 4], [29.0, 12], [30.8, 8], [37.4, 8], [53.6, 6], [56.0, 12]];
function shake(t) {
  let x = 0, y = 0;
  for (const [h, a] of HITS) { const d = t - h; if (d < 0 || d > 0.5) continue; const e = a * Math.exp(-d / 0.08); x += (hash(BOIL.step * 3.1 + h) - .5) * 2 * e; y += (hash(BOIL.step * 5.7 + h) - .5) * 2 * e; }
  if (t > 30.8 && t < 33.5) { x += (hash(BOIL.step * 1.7) - .5) * 5; }
  return [x, y];
}

// ——— characters ———
const SPEC = {
  aryan: { f: 0, top: K.hoodie, len: 330, bottom: '#2f3440', shoe: K.white, hair: 'short', hood: '#2c4566', skin: K.skin },
  maa: { f: 1, top: K.saree, trim: K.gold, len: 430, bottom: K.saree, shoe: K.woodD, hair: 'bun', hairCol: '#8d8a88', bindi: 1, glasses: 1, dupatta: K.gold, skin: K.skinM },
  officer: { f: 0, top: K.khaki, len: 330, bottom: '#5a4b30', shoe: K.ink, hair: 'short', moustache: 1, belt: 1, pocket: 1, skin: K.skinO },
};
function person2(C, s, sd) {
  const P0 = SPEC[s.kind], k = s.k ?? 1, hy = s.hy, hairCol = P0.hairCol || '#2a201e';
  const P = (dx, dy) => [s.x + dx * k, hy + dy * k], tp = pts => pts.map(([a, b]) => P(a, b));
  WMUL.k = clamp(Math.sqrt(k), 0.45, 1.3);
  const skinC = s.skinCol || P0.skin, skin = { col: skinC, p: 1, gap: 7, w: 9, seed: sd + 1 }, O = (w, q) => ({ w, col: K.ink, seed: q, p: 0.9 });
  if (!s.seated && !s.bust) for (const [side, sg] of [['L', -1], ['R', 1]]) {   // legs
    const hip = P(sg * 24, 330), [kn, f] = ik(hip, s.feet[side], 178 * k, 178 * k, sg);
    part(C, tube([hip, kn, f], 44 * k, 34 * k), { col: P0.bottom, p: 1, seed: sd + 2 + sg }, O(4, sd + 4 + sg));
    part(C, smooth([[f[0] - 26 * k, f[1] - 10 * k], [f[0] + sg * 6 * k + 22 * k, f[1] - 12 * k], [f[0] + sg * 30 * k, f[1] + 4 * k], [f[0] - 22 * sg * k, f[1] + 10 * k]], 4), { col: P0.shoe, p: 1, seed: sd + 6 + sg }, O(4, sd + 8 + sg));
  }
  if (P0.hair === 'bun') part(C, tp(handCircle(0, -66, 30, sd + 11, 0, 20)), { col: hairCol, p: 1, seed: sd + 12 }, O(4, sd + 13));
  const L = s.bust ? (s.bustL || 300) : P0.len;
  part(C, tp(smooth([[-15, 48], [15, 48], [50, 62], [58, 140], [62, 250], [64, L - 10], [0, L], [-64, L - 10], [-62, 250], [-58, 140], [-50, 62]], 3)), { col: P0.top, p: 1, seed: sd + 14 }, O(5, sd + 15));
  if (P0.trim && !s.bust) line(C.l, tp([[-62, L - 26], [62, L - 26]]), { w: 6, col: P0.trim, seed: sd + 16 });
  if (P0.hood) { line(C.l, tp(smooth([[-48, 58], [-20, 84], [0, 88], [20, 84], [48, 58]], 5, false)), { w: 12, col: P0.hood, seed: sd + 17 }); for (const sg of [-1, 1]) line(C.l, tp([[sg * 12, 84], [sg * 14, 170]]), { w: 4, col: K.white, seed: sd + 18 + sg }); if (L > 260) line(C.l, tp([[-40, 230], [40, 230]]), { w: 4, col: P0.hood, seed: sd + 20 }); }
  if (P0.pocket) { for (const sg of [-1, 1]) part(C, tp([[sg * 20, 110], [sg * 48, 110], [sg * 48, 150], [sg * 20, 150]]), { col: '#a68d58', p: 1, seed: sd + 21 + sg }, O(3, sd + 23 + sg)); for (let i = 0; i < 4; i++) dab(C.l, ...tp([[0, 80 + i * 55]])[0], 3.5 * k, { col: K.ink, p: 1, seed: sd + 25 + i }); line(C.l, tp([[-28, 48], [0, 72], [28, 48]]), { w: 4, col: K.ink, seed: sd + 29 }); }
  if (P0.belt && L > 290) line(C.l, tp([[-64, 300], [64, 300]]), { w: 12, col: '#4a3a24', seed: sd + 30 });
  part(C, tp([[-11, 30], [11, 30], [12, 56], [-12, 56]]), skin, O(4, sd + 40));
  for (const sg of [-1, 1]) part(C, tp(handCircle(sg * 50, 6, 11, sd + 41 + sg, 0, 16)), skin, O(4, sd + 43 + sg));
  part(C, tp(handCircle(0, 0, 50, sd + 45, 0.06, 44)), skin, O(5, sd + 46));
  if (P0.hair === 'bun') part(C, tp(smooth([[-55, 2], [-52, -40], [-30, -62], [0, -66], [30, -62], [52, -40], [55, 2], [44, -24], [20, -36], [0, -38], [-20, -36], [-44, -24]], 5)), { col: hairCol, p: 1, seed: sd + 50 }, O(4, sd + 51));
  if (P0.hair === 'short') part(C, tp(smooth([[-54, -2], [-54, -42], [-34, -64], [-4, -72], [30, -66], [52, -46], [55, -4], [46, -28], [28, -40], [-6, -44], [-30, -36], [-46, -20]], 4)), { col: hairCol, p: 1, seed: sd + 54 }, O(4, sd + 55));
  face(C, tp, { ...s, look: s.look || [0, 0] }, sd);
  if (P0.moustache) part(C, tp(smooth([[-28, 14], [0, 6], [28, 14], [22, 22], [0, 16], [-22, 22]], 4)), { col: '#2a2226', p: 1, seed: sd + 61 }, O(3, sd + 62));
  if (P0.glasses) { for (const sg of [-1, 1]) line(C.l, tp(handCircle(sg * 19, -2, 15, sd + 65 + sg, 0.08, 22)), { w: 3.5, col: K.ink, seed: sd + 66 + sg }); line(C.l, tp([[-4, -3], [4, -3]]), { w: 3, col: K.ink, seed: sd + 68 }); }
  if (P0.bindi) dab(C.l, ...tp([[0, -22]])[0], 4 * k, { col: K.red, p: 1, seed: sd + 69 });
  if (P0.dupatta) part(C, tp(smooth([[-50, 58], [-30, 52], [44, 150], [64, 240], [40, 250], [-40, 110]], 4)), { col: P0.dupatta, p: 1, seed: sd + 97 }, O(4, sd + 98));
  if (s.sweat) dab(C.l, ...tp([[62, -30 + 20 * ((s.t * 1.5) % 1)]])[0], 7 * k, { col: K.water, p: 1, seed: sd + 99 });
  const arms = {};
  if (!s.bust || s.bustArms) {
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
function seat(kind, x, t, o = {}) {   // sitting: feet hidden below, hands in front
  const k = o.k ?? 1, hy = o.hy ?? 2010, gy = hy + 600;
  return { kind, t, x, gy, k, hy, seated: 1, feet: { L: [x - 40, gy], R: [x + 40, gy] }, hands: o.hands || { L: [x - 90 * k, hy + 300 * k], R: [x + 90 * k, hy + 300 * k] }, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'smile' }, look: o.look || [0, 0], sweat: o.sweat };
}
function bust(kind, x, hy, k, t, o = {}) { return { kind, t, x, hy, k, bust: 1, bustL: o.L || 300, bustArms: !!o.hands, hands: o.hands, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'smile' }, look: o.look || [0, 0], eyeCol: o.eyeCol }; }
function talking(t, a, b) { return t > a && t < b && BOIL.step % 3 ? 'open' : 'small'; }

// ——— screens ———
function scanlines(x0, y0, x1, y1, col, p = 0.12) { for (let y = y0 + 14; y < y1; y += 22) line(FX, [[x0 + 6, y], [x1 - 6, y]], { w: 2, col, p, seed: 900 + y }); }
function laptop(S, scrCol, sd = 950) {   // S = [x0, y0, x1, y1] screen; returns a closure that draws the bezel + keyboard deck on top
  const [x0, y0, x1, y1] = S, bw = (x1 - x0) * 0.08, dk = (x1 - x0) * 0.16;
  part(PROP, rect(x0, y0, x1, y1), { col: scrCol, p: 1, seed: sd }, null);
  return () => {
    edge(FX, rect(x0, y0, x1, y1), '#22252e', 16, 1, sd + 1);
    const base = [[x0 - bw * 0.4, y1], [x1 + bw * 0.4, y1], [x1 + bw, y1 + dk], [x0 - bw, y1 + dk]];
    poly(FX, base, '#c3c8cf', 1, { seed: sd + 2 }); edge(FX, base, K.ink, 4, 0.9, sd + 3);
    line(FX, [[x0 - 4, y1 + 4], [x1 + 4, y1 + 4]], { w: 12, col: '#22252e', seed: sd + 4 });
  };
}
function liveDot(x, y, t, k = 1) { if (BOIL.step % 12 < 8) dab(FX, x, y, 9 * k, { col: K.red, p: 1, seed: 960 }); }

// ——— SET: Aryan's room at night ———
const ROOM_SCR = [900, 1800, 1420, 2220];
function drawRoom(t, clockTxt) {
  const B = BG;
  poly(B.f, rect(-200, 200, 2000, 2600), '#4a587c', 1, { seed: 10 });
  poly(B.f, rect(-200, 2600, 2000, 3400), '#353b55', 1, { seed: 11 });
  poly(B.f, rect(150, 760, 560, 1380), '#1d2540', 1, { seed: 12 }); edge(B.l, rect(150, 760, 560, 1380), K.woodD, 14, 1, 13); line(B.l, [[355, 760], [355, 1380]], { w: 10, col: K.woodD, seed: 14 });
  dab(B.f, 470, 880, 46, { col: K.cream, p: 1, seed: 15 }); dab(B.f, 490, 868, 40, { col: '#1d2540', p: 1, seed: 16 });
  for (let i = 0; i < 6; i++) dab(B.f, 190 + hash(i * 3.1) * 340, 820 + hash(i * 5.3) * 300, 5, { col: K.cream, p: 1, seed: 17 + i });
  for (let i = 0; i < 5; i++) poly(B.f, rect(170 + i * 78, 1380 - 80 - 140 * hash(i * 2.2), 230 + i * 78, 1380), '#2c3656', 1, { seed: 25 + i });
  part(PROP, rect(1140, 1300, 1460, 1440), { col: '#15171f', p: 1, seed: 30 }, { w: 4, col: K.ink, seed: 31 });   // the wall clock (digital)
  wtext(PROP.l, clockTxt, 1300, 1395, { size: 64, weight: 700, col: '#ff5a4a', seed: 32 });
  poly(B.f, rect(1560, 1500, 1960, 1530), K.woodD, 1, { seed: 33 });   // shelf
  for (let i = 0; i < 6; i++) poly(B.f, rect(1580 + i * 58, 1500 - 120 - 40 * hash(i), 1630 + i * 58, 1500), ['#c84b4b', '#e7b25a', '#5f86b0', '#7cc36e', '#ee8ea4', '#ec8a3c'][i], 1, { seed: 34 + i });
  poly(GLOW, handCircle(1160, 1980, 480, 41, 0, 40), '#56688f', 0.55, { seed: 42 });   // laptop glow on the wall
}
function drawDesk(C) {
  part(C, rect(300, 2330, 1700, 2950), { col: K.wood, p: 1, seed: 50 }, { w: 5, col: K.ink, seed: 51 });
  part(C, rect(270, 2296, 1730, 2340), { col: K.woodD, p: 1, seed: 52 }, { w: 4, col: K.ink, seed: 53 });
  part(C, smooth([[380, 2296], [470, 2296], [466, 2190], [384, 2190]], 3), { col: K.white, p: 1, seed: 54 }, { w: 4, col: K.ink, seed: 55 });   // mug
  line(C.l, smooth([[466, 2215], [500, 2225], [500, 2265], [466, 2272]], 4, false), { w: 6, col: K.ink, seed: 56 });
}

// ——— SET: bedroom, morning ———
function drawBed(t) {
  const B = BG;
  poly(B.f, rect(2000, 200, 3900, 2600), '#f4d9a6', 1, { seed: 100 });
  poly(B.f, rect(2000, 2600, 3900, 3400), '#c9a67a', 1, { seed: 101 });
  poly(B.f, rect(2250, 800, 2700, 1400), '#bfe3f7', 1, { seed: 102 }); edge(B.l, rect(2250, 800, 2700, 1400), K.white, 14, 1, 103);
  dab(B.f, 2590, 960, 70, { col: K.yellow, p: 1, seed: 104 });
  part(PROP, rect(3350, 1000, 3700, 1140), { col: '#15171f', p: 1, seed: 106 }, { w: 4, col: K.ink, seed: 107 });
  wtext(PROP.l, '10:30 AM', 3525, 1092, { size: 58, weight: 700, col: '#ff5a4a', seed: 108 });
  poly(B.f, rect(2580, 1620, 3320, 2500), K.woodD, 1, { seed: 109 }); edge(B.l, rect(2580, 1620, 3320, 2500), K.ink, 5, 0.9, 110);
  poly(B.f, smooth([[2700, 2000], [3200, 1990], [3230, 2220], [2680, 2230]], 4), K.white, 1, { seed: 111 });
}
function drawBlanket(C, t) {
  const pts = smooth([[2520, 2330], [3380, 2300], [3460, 2980], [2440, 2980]], 4);
  part(C, pts, { col: K.blue, p: 1, seed: 120 }, { w: 5, col: K.ink, seed: 121 });
  for (let i = 1; i < 6; i++) line(C.l, [[2520 + i * 150, 2330], [2470 + i * 170, 2980]], { w: 4, col: '#4b6f99', p: 0.8, seed: 122 + i });
  for (let i = 1; i < 4; i++) line(C.l, [[2500, 2330 + i * 160], [3420, 2310 + i * 165]], { w: 4, col: '#4b6f99', p: 0.8, seed: 130 + i });
}
function phoneSmall(C, x, y, k = 1, lit = false, sd = 140) {
  part(C, rrect(x - 32 * k, y - 58 * k, x + 32 * k, y + 58 * k, 10 * k), { col: '#1d1f26', p: 1, seed: sd }, { w: 3, col: K.ink, seed: sd + 1 });
  part(C, rect(x - 26 * k, y - 50 * k, x + 26 * k, y + 50 * k), { col: lit ? '#bfe3f7' : '#2b2f3a', p: 1, seed: sd + 2 }, null);
}

// ——— SET: big phone close-up ———
const PH = [6520, 1400, 7280, 2860], PHS = [6552, 1462, 7248, 2798];
function drawPhone(t, mode) {
  const B = BG;
  poly(B.f, rect(5900, 200, 7900, 3400), mode === 'msg' ? '#d6c4a8' : '#5c4a6e', 1, { seed: 200 });
  for (let i = 0; i < 5; i++) dab(B.f, 6000 + hash(i * 2.7) * 1800, 1200 + hash(i * 4.1) * 1800, 150, { col: mode === 'msg' ? '#e3d4bb' : '#6b5980', p: 1, seed: 201 + i });
  poly(B.f, rrect(...PH, 70), '#15171c', 1, { seed: 210 });
  if (mode === 'msg') {
    poly(B.l, rect(...PHS), '#ece5dd', 1, { seed: 211 });
    poly(B.l, rect(PHS[0], PHS[1], PHS[2], PHS[1] + 150), '#2f7d6d', 1, { seed: 212 });
    poly(B.l, handCircle(6630, 1560, 36, 213, 0, 20), '#9fb7c9', 1, { seed: 214 });
    wtext(B.l, 'Boss', 6690, 1578, { size: 46, weight: 700, col: K.white, seed: 215, align: 'left' });
    const u = back1(pr(t, 12.6, 12.95));
    if (t > 12.6) {
      const cx = 6880, cy = 1950, hw = 300 * u, hh = 190 * u;
      part(PROP, rrect(cx - hw, cy - hh, cx + hw, cy + hh, 28 * u + 1), { col: K.white, p: 1, seed: 216 }, { w: 3, col: '#b9b2a8', seed: 217 });
      if (u > 0.9) {
        wtext(PROP.l, 'आर्यन, आज की', 6610, 1850, { size: 44, weight: 700, col: K.ink, seed: 218, align: 'left' });
        wtext(PROP.l, 'presentation कमाल थी!!', 6610, 1920, { size: 44, weight: 700, col: K.ink, seed: 219, align: 'left' });
        wtext(PROP.l, 'Promotion पक्का!', 6610, 2010, { size: 54, weight: 700, col: K.green, seed: 220, align: 'left' });
        wtext(PROP.l, '9:15 AM', 7110, 2110, { size: 28, col: K.grey, seed: 221 });
      }
    }
  } else {
    poly(B.l, rect(...PHS), '#e8cfa6', 1, { seed: 230 });   // Maa's room
    poly(B.l, rect(6600, 1700, 6740, 1880), K.woodD, 1, { seed: 231 }); poly(B.l, rect(6616, 1716, 6724, 1864), '#f7e7c3', 1, { seed: 232 });
    poly(B.l, rect(PHS[0], 2560, PHS[2], PHS[3]), '#c9a882', 1, { seed: 233 });
  }
  return () => {   // bezel, buttons, hand — on top
    edge(FX, rrect(...PH, 70), '#15171c', 18, 1, 240);
    line(FX, [[6840, 1432], [6960, 1432]], { w: 10, col: '#33363f', seed: 241 });
    if (mode === 'call') {
      poly(FX, handCircle(6900, 2700, 52, 242, 0, 24), K.red, 1, { seed: 243 });
      line(FX, smooth([[6872, 2706], [6900, 2690], [6928, 2706]], 4, false), { w: 10, col: K.white, seed: 244 });
      wtext(FX, 'मम्मी · 0:' + String(12 + Math.floor(t - 24.4)).padStart(2, '0'), 6900, 2610, { size: 40, weight: 700, col: K.white, seed: 245, stroke: 2 });
    }
    const hand = smooth([[6380, 3000], [6420, 2470], [6500, 2380], [6585, 2440], [6560, 2620], [6680, 3000]], 4);
    poly(FX, hand, K.skin, 1, { seed: 246 }); edge(FX, hand, K.ink, 4, 0.9, 247);
    const thumb = smooth([[6520, 2400], [6600, 2300], [6640, 2320], [6590, 2440]], 4);
    poly(FX, thumb, K.skin, 1, { seed: 248 }); edge(FX, thumb, K.ink, 4, 0.9, 249);
  };
}

// ——— SET: the sofa (daytime) ———
const SOFA_SCR = [5280, 2030, 5620, 2290];
function drawSofaSet(t) {
  const B = BG;
  poly(B.f, rect(3900, 200, 5900, 2600), '#efd9c3', 1, { seed: 300 });
  poly(B.f, rect(3900, 2600, 5900, 3400), '#b98d64', 1, { seed: 301 });
  poly(B.f, rect(3980, 1250, 4220, 1700), '#2b2f3a', 1, { seed: 302 });   // TV edge, the game glow
  for (let i = 0; i < 4; i++) dab(B.f, 4050 + i * 45, 1350 + (i % 2) * 120 + 30 * Math.sin(t * 6 + i), 22, { col: ['#ff5a4a', '#5dff9a', '#6fe3ff', '#f5c63c'][i], p: 1, seed: 303 + i });
  poly(B.f, rect(4700, 900, 5100, 1250), K.white, 1, { seed: 310 }); edge(B.l, rect(4700, 900, 5100, 1250), K.woodD, 10, 1, 311);
  poly(B.f, [[4740, 1210], [4840, 1060], [4930, 1150], [5000, 1050], [5060, 1210]], K.leaf, 1, { seed: 312 });
  const back = smooth([[4300, 2500], [4300, 1950], [4420, 1900], [4960, 1900], [5080, 1950], [5080, 2500]], 4);
  poly(B.f, back, '#8c3b3b', 1, { seed: 313 }); edge(B.l, back, K.ink, 5, 0.9, 314);
}
function drawSofaFront(C, t) {
  part(C, rrect(4250, 2380, 5130, 2720, 40), { col: '#a54646', p: 1, seed: 320 }, { w: 5, col: K.ink, seed: 321 });
  for (const x of [4200, 5030]) part(C, rrect(x, 2120, x + 130, 2720, 50), { col: '#9a4040', p: 1, seed: 322 + x }, { w: 5, col: K.ink, seed: 323 + x });
  part(C, smooth([[4400, 2380], [4520, 2330], [4560, 2380]], 3), { col: K.yellow, p: 1, seed: 330 }, { w: 3, col: K.ink, seed: 331 });   // chips packet
  part(C, rect(5250, 2330, 5650, 2900), { col: K.wood, p: 1, seed: 340 }, { w: 5, col: K.ink, seed: 341 });
  part(C, rect(5230, 2310, 5670, 2340), { col: K.woodD, p: 1, seed: 342 }, { w: 4, col: K.ink, seed: 343 });
}
function controller(C, x, y) {
  part(C, smooth([[x - 80, y - 20], [x + 80, y - 20], [x + 100, y + 30], [x + 60, y + 40], [x, y + 20], [x - 60, y + 40], [x - 100, y + 30]], 4), { col: '#2b2b33', p: 1, seed: 350 }, { w: 4, col: K.ink, seed: 351 });
  [['#ff5a4a', 40, -2], ['#5dff9a', 58, 10], ['#6fe3ff', 22, 10]].forEach(([c, dx, dy], i) => dab(C.l, x + dx, y + dy, 7, { col: c, p: 1, seed: 352 + i }));
}

// ——— SET: cyber cell ———
const MON = [9330, 2080, 9730, 2340];
function drawStation(t) {
  const B = BG;
  poly(B.f, rect(7900, 200, 9900, 2700), '#dbe3d3', 1, { seed: 500 });
  poly(B.f, rect(7900, 2700, 9900, 3600), '#a9a291', 1, { seed: 501 });
  poly(B.f, rect(7900, 2550, 9900, 2700), '#c3ccb9', 1, { seed: 502 });
  part(PROP, rect(8330, 1640, 8930, 1910), { col: K.navy, p: 1, seed: 503 }, { w: 5, col: K.ink, seed: 504 });
  wtext(PROP.l, 'साइबर सेल', 8630, 1790, { size: 96, weight: 700, col: K.white, seed: 505 });
  wtext(PROP.l, 'CYBER CELL', 8630, 1880, { size: 46, weight: 700, col: K.note, seed: 506 });
  poly(B.f, rect(9250, 1200, 9700, 1560), '#c49a6c', 1, { seed: 507 }); edge(B.l, rect(9250, 1200, 9700, 1560), K.woodD, 8, 1, 508);
  for (let i = 0; i < 4; i++) poly(B.f, rect(9280 + (i % 2) * 210, 1230 + Math.floor(i / 2) * 170, 9440 + (i % 2) * 210, 1370 + Math.floor(i / 2) * 170), K.white, 1, { seed: 509 + i });
  poly(B.f, rect(7980, 900, 8060, 2550), '#c8d0be', 1, { seed: 515 });
}
function drawStationDesk(C, t) {
  part(C, rect(8850, 2400, 9780, 3020), { col: K.wood, p: 1, seed: 520 }, { w: 5, col: K.ink, seed: 521 });
  part(C, rect(8820, 2370, 9810, 2410), { col: K.woodD, p: 1, seed: 522 }, { w: 4, col: K.ink, seed: 523 });
  part(C, rect(9505, 2340, 9555, 2372), { col: K.dgrey, p: 1, seed: 524 }, null);
  part(C, rect(9440, 2362, 9620, 2374), { col: K.dgrey, p: 1, seed: 525 }, null);
  part(C, rect(...MON), { col: '#0f1a14', p: 1, seed: 526 }, null);
  for (let i = 0; i < 3; i++) part(C, rect(8930 + i * 8, 2330 - i * 22, 9130 + i * 8, 2352 - i * 22), { col: ['#f3ead2', '#e7b25a', '#bfe3f7'][i], p: 1, seed: 527 + i }, { w: 3, col: K.ink, seed: 530 + i });   // files
}
function monitorContent(t) {
  const [x0, y0, x1, y1] = MON;
  wtext(PROP.l, 'LIVE OFFICE LOGIN:', 9530, 2128, { size: 30, weight: 700, col: K.lime, seed: 540 });
  wtext(PROP.l, 'ARYAN', 9530, 2176, { size: 44, weight: 700, col: K.white, seed: 541 });
  part(PROP, rect(9352, 2196, 9500, 2328), { col: '#cfe0ea', p: 1, seed: 542 }, { w: 3, col: K.lime, seed: 543 });
  if (t > 50.0) {
    wtext(PROP.l, 'BIOMETRIC', 9615, 2246, { size: 28, weight: 700, col: K.lime, seed: 544 });
    wtext(PROP.l, 'VERIFIED', 9615, 2282, { size: 28, weight: 700, col: K.lime, seed: 545 });
    line(PROP.l, [[9590, 2306], [9606, 2322], [9640, 2292]], { w: 7, col: K.lime, seed: 546 });
  }
  return () => { edge(FX, rect(x0, y0, x1, y1), '#22252e', 12, 1, 547); liveDot(9370, 2212, t, 0.8); scanlines(x0, y0, x1, y1, K.lime, 0.08); };
}

// ——— printed words (top third, dark ragged box) ———
const SUBY = 300;
const SUBCOL = { N: K.bone, R: '#bcd7ff', C: K.cyan, A: '#ffd76a', O: '#ffb38a' };
function box(cx, cy, hw, hh, col = 'rgba(29,27,34,0.9)') {
  const g = SUBT.g; g.save(); g.fillStyle = col; g.beginPath();
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
const LABELS = [[4.2, 6.3, 'एक हफ़्ता पहले… रात 11 बजे'], [22.4, 24.4, 'एक हफ़्ते बाद…']];
const CHIPS = [
  [15.6, 21.0, [[16.2, 'ऑफिस की कॉल: क्लोन'], [17.8, 'दोस्तों की कॉल: क्लोन'], [19.4, 'मम्मी की कॉल: क्लोन']], K.note],
  [37.4, 44.8, [[39.6, 'आवाज़: कॉपी'], [40.9, 'चेहरा: कॉपी'], [42.2, 'बैंक डिटेल: कॉपी']], '#ff6b5e'],
];
function labels(t) {
  const L = LABELS.find(l => t >= l[0] && t < l[1]);
  if (L) { box(540, 1690, 450, 56); wtext(SUBT, L[2], 540, 1710, { screen: true, size: 56, weight: 700, col: K.note, reveal: pr(t, L[0] + 0.1, L[0] + 0.5), seed: 61 + L[0] }); }
  for (const [a, b, items, col] of CHIPS) if (t >= a && t < b) items.forEach(([t0, txt], i) => {
    if (t < t0) return; const u = back1(pr(t, t0, t0 + 0.3)), y = 1480 + i * 130;
    box(540, y, 330 * u + 1, 50 * u + 1); wtext(SUBT, txt, 540, y + 20, { screen: true, size: 54 * u + 1, weight: 700, col, seed: 70 + i + a });
  });
  if (t > 2.3 && t < 4.2) { const u = back1(pr(t, 2.3, 2.6)), p = 1 - pr(t, 3.9, 4.2); box(540, 1700, 330 * u + 1, 92 * u + 1); wtext(SUBT, 'असली कौन?', 540, 1745, { screen: true, size: 130 * u + 1, weight: 700, col: K.red, seed: 81, stroke: 3, p }); }
  if (t > 30.8 && t < 33.6) { const u = back1(pr(t, 30.8, 31.1)); box(540, 1660, 470 * u + 1, 110 * u + 1, 'rgba(160,20,20,0.92)'); wtext(SUBT, 'ACCESS DENIED', 540, 1650, { screen: true, size: 92 * u + 1, weight: 700, col: K.white, seed: 82, stroke: 2 }); wtext(SUBT, 'PASSWORD CHANGED BY USER', 540, 1730, { screen: true, size: 48 * u + 1, weight: 700, col: K.note, seed: 83 }); }
}
function endCard(t) {
  if (t < 57.5) return;
  const g = SUBT.g; g.save(); g.fillStyle = 'rgba(29,27,34,0.94)'; g.fillRect(0, 1240, W, 680); g.restore();
  wtext(SUBT, 'अगला पन्ना कल', 540, 1400, { screen: true, size: 110, weight: 700, col: K.bone, reveal: pr(t, 57.55, 58.0), seed: 91, stroke: 2 });
  wtext(SUBT, 'हर शाम 7:30 — Follow करो', 540, 1540, { screen: true, size: 66, weight: 700, col: K.note, reveal: pr(t, 57.9, 58.3), seed: 92, stroke: 1.2 });
  wtext(SUBT, '@pannapalatkahani', 540, 1660, { screen: true, size: 58, weight: 700, col: K.steelL, reveal: pr(t, 58.2, 58.6), seed: 93 });
}

// ——— events for the mixer ———
export const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
SUBS.forEach(S => ev(S.vt, 'voice', { id: S.vo, who: S.who }));
ev(0.05, 'hit'); ev(0, 'hum', { dur: 3.6 }); ev(2.3, 'stab'); ev(3.6, 'whoosh'); ev(5.3, 'click'); ev(5.4, 'glitch', { dur: 0.7 }); ev(6.4, 'whoosh');
ev(9.4, 'birds', { dur: 3.0 }); ev(10.4, 'buzz', { dur: 1.6 }); ev(12.6, 'ding'); ev(14.4, 'sparkle', { dur: 1.0 });
for (let i = 0; i < 9; i++) ev(15.7 + i * 0.6, 'blip', { pan: -0.5 }); [16.2, 17.8, 19.4].forEach(t => ev(t, 'tick')); ev(21.0, 'glitch', { dur: 0.3 });
ev(22.5, 'ring', { dur: 1.8 }); ev(24.4, 'pickup'); ev(29.0, 'stab'); ev(30.8, 'alarm', { dur: 3.0 }); ev(37.4, 'glitch', { dur: 0.6 });
[39.6, 40.9, 42.2].forEach(t => ev(t, 'beep')); ev(44.8, 'whoosh'); ev(50.6, 'typing', { dur: 1.2 }); ev(51.0, 'beep'); ev(53.6, 'hit'); ev(56.0, 'stab'); ev(57.55, 'write', { dur: 1.0 });
[['A', 0], ['B', 3.6], ['C', 9.4], ['D', 15.6], ['E', 22.4], ['F', 29.0], ['G', 30.6], ['H', 37.4], ['I', 44.8], ['J', 50.6], ['K', 56.0], ['Z', 57.5]].forEach(([id, t]) => ev(t, 'cue', { id }));

// ——— acting ———
function aryanRoom(t) {   // seated at the desk
  const x = 640, hy = 2000;
  let exp = { eyes: 'open', brows: 'flat', mouth: 'small' }, look = [1, 0], hands = { L: [x - 80, 2300], R: [x + 100, 2290] }, sweat = false;
  if (t < 3.6) { exp = { eyes: 'pop', brows: 'up', mouth: talking(t, 0.2, 3.2) === 'open' ? 'open' : 'wavy' }; hands = { L: [x + 110, hy + 210], R: [x + 210, hy + 110] }; sweat = true; }
  else if (t < 6.4) { const yawn = t < 4.9; exp = { eyes: yawn ? 'closed' : 'half', brows: 'flat', mouth: yawn ? 'yawn' : (t > 5.5 ? 'smile' : 'small') }; if (yawn) hands = { L: [x - 60, hy + 40], R: [x + 100, 2290] }; if (t > 5.0 && t < 5.6) hands.R = [x + 230, 2270]; look = t > 5.0 ? [1, 0.3] : [0, 0]; }
  else { const panic = t < 33.5; exp = { eyes: 'pop', brows: 'up', mouth: panic ? 'open' : 'wavy' }; hands = panic ? { L: [x - 60, hy - 50], R: [x + 60, hy - 50] } : { L: [x + 150, 2280], R: [x + 230, 2270] }; sweat = true; }
  return seat('aryan', x, t, { hy, exp, look, hands, sweat });
}
function cloneOnScreen(t) {
  let exp = { eyes: 'open', brows: 'flat', mouth: 'smile' }, look = [-0.6, 0], hands = null, eyeCol;
  const wave = { L: [1100, 2190], R: [1290, 1880 + 20 * Math.sin(t * 14)] };
  if (t < 3.6) { hands = wave; look = [-1, 0]; }
  else if (t < 9.4) { if (t > 6.6) hands = wave; look = [0, 0]; }
  else { exp = { eyes: 'half', brows: 'down', mouth: talking(t, 37.7, 44.2) === 'open' ? 'open' : 'smirk' }; look = [0, 0.1]; eyeCol = '#0aa8c8'; }
  let x = 1160; if ((t > 5.4 && t < 6.1) || (t > 37.4 && t < 37.9)) x += (hash(BOIL.step * 1.3) - .5) * 60;
  return bust('aryan', x, 1950, 0.85, t, { L: 300, exp, look, hands, eyeCol });
}

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
  if (set === 'room') {
    drawRoom(t, t >= 3.6 && t < 9.4 ? '11:00 PM' : '11:58 PM');
    person2(PE, aryanRoom(t), 2000);
    drawDesk(PROP);
    const err = t >= 30.6 && t < 37.4, dark = t >= 37.4, app = t >= 3.6 && t < 5.4;
    const scrCol = err ? (BOIL.step % 6 < 3 ? '#c62f2f' : '#a82222') : dark ? '#2a1630' : app ? '#203a5c' : '#1f3550';
    const top = laptop(ROOM_SCR, scrCol);
    if (app) {   // the app before the click
      wtext(PROP.l, 'AI CLONE', 1160, 1960, { size: 52, weight: 700, col: K.cyan, seed: 960 });
      part(PROP, rrect(1060, 2010, 1260, 2080, 30), { col: t > 5.1 ? K.white : K.cyan, p: 1, seed: 961 }, { w: 3, col: K.ink, seed: 962 });
      wtext(PROP.l, 'CREATE', 1160, 2058, { size: 34, weight: 700, col: K.scr, seed: 963 });
    } else if (err) {
      part(PROP, rrect(1110, 1850, 1210, 1940, 16), { col: K.white, p: 1, seed: 965 }, null);   // a lock
      line(PROP.l, smooth([[1130, 1850], [1130, 1810], [1160, 1790], [1190, 1810], [1190, 1850]], 5, false), { w: 12, col: K.white, seed: 966 });
      wtext(PROP.l, 'ACCESS DENIED', 1160, 2030, { size: 54, weight: 700, col: K.white, seed: 967 });
      wtext(PROP.l, 'PASSWORD CHANGED', 1160, 2100, { size: 34, weight: 700, col: K.note, seed: 968 });
      wtext(PROP.l, 'BY USER', 1160, 2150, { size: 34, weight: 700, col: K.note, seed: 969 });
      if (t > 35.6) person2(FG, { ...cloneOnScreen(t), x: lerp(1380, 1300, eo(pr(t, 35.6, 36.6))) + (BOIL.step % 4 < 1 ? 14 : 0), k: 0.6, hy: 2040 }, 4000);
    } else {
      person2(FG, cloneOnScreen(t), 4000);
      wtext(PROP.l, dark ? 'ARYAN 2.0' : 'AI CLONE: ON', 1160, 1846, { size: 30, weight: 700, col: dark ? '#ff6b5e' : K.cyan, seed: 970 }); liveDot(940, 1836, t, 0.8);
      if (t >= 5.4 && t < 5.55) poly(FX, rect(...ROOM_SCR), K.white, 1, { seed: 964 });
    }
    top();
    scanlines(...ROOM_SCR, err ? K.white : K.cyan, err ? 0.06 : 0.1);
    vig = 0.32;
  } else if (set === 'bed') {
    drawBed(t);
    const joy = t >= 14.4, awake = t > 11.2;
    const x = 2950, hy = 2050;
    let exp = { eyes: 'closed', brows: 'flat', mouth: 'o' }, hands = { L: [x - 110, 2330], R: [x + 130, 2320] }, look = [0, 0];
    if (awake) { exp = { eyes: t > 11.8 ? 'open' : 'half', brows: 'up', mouth: 'small' }; hands = { L: [x - 110, 2330], R: [x + 70, hy + 140] }; look = [0.5, 0.8]; }
    if (joy) { exp = { eyes: 'closed', brows: 'up', mouth: 'open' }; hands = { L: [x - 150, hy - 150], R: [x + 150, hy - 160] }; }
    const arms = person2(PE, seat('aryan', x, t, { hy, exp, look, hands }), 2000);
    drawBlanket(PROP, t);
    if (!joy) {
      const ph = awake ? arms.R : [x + 130, 2300], bz = t > 10.4 && t < 12.0 ? (hash(BOIL.step * 7.7) - .5) * 10 : 0;
      phoneSmall(FG, ph[0] + bz, ph[1] - 50, 1, t > 10.4, 140);
      if (t > 10.4 && t < 12.0) for (const sg of [-1, 1]) line(FX, [[ph[0] + sg * 60, ph[1] - 90], [ph[0] + sg * 80, ph[1] - 50], [ph[0] + sg * 60, ph[1] - 10]], { w: 6, col: K.ink, seed: 150 + sg });
    } else phoneSmall(FG, arms.R[0], arms.R[1] - 50, 1, true, 140);
    if (!awake) for (let i = 0; i < 3; i++) { const u = (t * 0.6 + i / 3) % 1; wtext(FX, 'Z', x + 90 + u * 120, hy - 80 - u * 200, { size: 50 + 30 * u, weight: 700, col: K.navy, p: Math.sin(Math.PI * u), seed: 160 + i }); }
    if (joy) for (let i = 0; i < 18; i++) { const u = ((t - 14.4) * 0.9 + hash(i * 3.7)) % 1; dab(FX, x - 400 + hash(i * 1.9) * 800, hy - 400 + u * 700, 12, { col: ['#e2412f', '#f5c63c', '#3fa39a', '#ee8ea4'][i % 4], p: 1, seed: 170 + i }); }
    vig = 0.18;
  } else if (set === 'phone') {
    const mode = t < 20 ? 'msg' : 'call';
    const top = drawPhone(t, mode);
    if (mode === 'call') {
      const shock = t > 24.6;
      person2(PE, bust('maa', 6900, 2010, 1.9, t, { L: 400, exp: { eyes: shock ? 'pop' : 'open', brows: shock ? 'up' : 'flat', mouth: shock ? (talking(t, 24.6, 28.6) === 'open' ? 'open' : 'o') : 'smile' } }), 2200);
      part(PROP, rect(7030, 1650, 7220, 1900), { col: '#4b5a7e', p: 1, seed: 250 }, { w: 4, col: K.white, seed: 251 });
      person2(FG, bust('aryan', 7125, 1748, 0.42, t, { L: 300, exp: { eyes: t > 26 ? 'pop' : 'open', brows: t > 26 ? 'up' : 'flat', mouth: t > 26 ? 'o' : 'smile' } }), 2400);
    }
    top();
    vig = 0.25;
  } else if (set === 'sofa') {
    drawSofaSet(t);
    const x = 4690, hy = 2060;
    let exp = { eyes: 'open', brows: 'down', mouth: q2(t) * 6 % 1 < 0.5 ? 'smile' : 'small' }, hands = { L: [x - 40, 2330], R: [x + 40, 2330] }, look = [-0.8, 0];
    const calling = t >= 22.4;
    if (calling) { exp = { eyes: 'open', brows: 'flat', mouth: 'smile' }; hands = { L: [x - 90, 2350], R: [x + 60, hy + 215] }; look = [0.2, 1]; }
    if (t >= 29.0) { exp = { eyes: 'pop', brows: 'up', mouth: 'open' }; look = [0, 0]; }
    const arms = person2(PE, seat('aryan', x, t, { hy, exp, look, hands, sweat: t >= 29 }), 2000);
    drawSofaFront(PROP, t);
    if (!calling) controller(FG, x, 2340);
    else phoneSmall(FG, arms.R[0], arms.R[1] - 40, 1.1, true, 360);
    const top = laptop(SOFA_SCR, '#1f3550', 980);
    const sneaky = t >= 21.0 && t < 22.4;
    person2(FG, bust('aryan', 5450, 2120, 0.55, t, { L: 300, exp: { eyes: sneaky ? 'half' : 'open', brows: sneaky ? 'down' : 'flat', mouth: sneaky ? 'smirk' : talking(t, 15.6, 21.0) }, look: sneaky ? [-1, 0] : [0, 0], eyeCol: sneaky ? '#0aa8c8' : undefined }), 4200);
    wtext(PROP.l, 'ON CALL', 5470, 2068, { size: 24, weight: 700, col: K.cyan, seed: 990 }); liveDot(5310, 2060, t, 0.6);
    top(); scanlines(...SOFA_SCR, K.cyan, 0.08);
    vig = 0.18;
  } else if (set === 'station') {
    drawStation(t);
    const ox = 9150, ohy = 2060;
    const stare = t >= 51.4;
    person2(PE, seat('officer', ox, t, { hy: ohy, k: 0.95, exp: stare ? { eyes: 'half', brows: 'down', mouth: talking(t, 51.5, 56.8) } : { eyes: 'open', brows: 'flat', mouth: 'flat' }, look: stare || t > 46 ? [-1, 0] : [0, 0.5], hands: t >= 50.0 && t < 51.4 ? { L: [ox - 60, 2360], R: [9330, 2368] } : undefined }), 3000);
    drawStationDesk(PROP, t);
    const mtop = monitorContent(t);
    person2(FG, bust('aryan', 9426, 2246, 0.28, t, { L: 290, exp: { eyes: 'open', brows: 'flat', mouth: 'smile' } }), 4400);
    const ax = 8500, agy = 3150, ak = 1.1, ahy = agy - 680 * ak;
    const scared = t >= 53.6;
    const ast = { kind: 'aryan', t, x: ax, gy: agy, k: ak, hy: ahy, feet: { L: [ax - 50, agy], R: [ax + 50, agy] },
      hands: scared ? { L: [ax - 90, ahy + 260], R: [ax + 90, ahy + 260] } : { L: [ax - 90, ahy + 300], R: [ax + 200, ahy + 120] },
      exp: scared ? { eyes: 'pop', brows: 'up', mouth: t > 56.2 ? 'wavy' : 'o' } : { eyes: 'open', brows: 'worried', mouth: talking(t, 45.4, 49.8) }, look: [1, 0], sweat: true };
    const arms = person2(FG, ast, 2000);
    if (!scared) {   // the ID card
      const [hx, hy2] = arms.R;
      part(FG, rrect(hx - 70, hy2 - 110, hx + 70, hy2 - 10, 10), { col: K.white, p: 1, seed: 560 }, { w: 3, col: K.ink, seed: 561 });
      part(FG, rect(hx - 60, hy2 - 98, hx - 10, hy2 - 40), { col: '#bfe3f7', p: 1, seed: 562 }, { w: 2, col: K.ink, seed: 563 });
      dab(FG.l, hx - 35, hy2 - 76, 12, { col: K.skin, p: 1, seed: 564 });
      wtext(FG.l, 'ARYAN', hx + 28, hy2 - 66, { size: 26, weight: 700, col: K.navy, seed: 565 });
      line(FG.l, [[hx - 2, hy2 - 40], [hx + 58, hy2 - 40]], { w: 4, col: K.grey, seed: 566 });
    }
    mtop();
    vig = 0.2;
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
