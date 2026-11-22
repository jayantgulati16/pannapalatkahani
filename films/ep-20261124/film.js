// असली कौन? — Who's the Real One? (The Robot). Ep 7, posts 24 Nov 2026. Vertical 1080×1920, 24 fps, 59 s. Clean cartoon.
// Story by Jayant (22 Nov). Cold open: Aryan bangs on his own flat's door; his look-alike ROBOT peeks out and slams it.
// A month earlier he built the robot (face scan, voice, his fingerprints). It went to office (promotion!), then everywhere — even to Maa's.
// Maa on a video call: "you're sitting here eating with me!". Shutdown → ACCESS DENIED, OWNER CHANGED. The robot, with Aryan's ID card,
// pushes him out: "this house needs only one Aryan." Cyber cell: "ID दिखाओ" — empty pockets. Screen: ARYAN · OFFICE: PRESENT ·
// FINGERPRINT MATCH ✓. Officer: "the real Aryan is at office… who are you?" Ends on his scared face (loops to frame 1).
import { layer, clear, line, fill, dab, handCircle, smooth, CAM, BOIL, WMUL, STYLE, W, H, sx, sy } from './crayon.js';
import { group, clearGroup, part, tube } from './rig.js';
import { clamp, lerp, hash, ss, eio, eo, ei } from '/core/lib.js';
STYLE.clean = true;

export const DUR = 61.5;
const NOSUBS = new URLSearchParams(location.search).get('nosubs') === '1';
const K = { ink: '#1d1b22', bone: '#fbf8f1', cream: '#f3ead2', white: '#ffffff', grey: '#9a9aa3', dgrey: '#55555f', steel: '#b9bfc6', steelD: '#6f767f', steelL: '#e3e7ea',
  wood: '#b57f52', woodD: '#7d5434', red: '#e2412f', green: '#4f9a5a', leaf: '#7cc36e', yellow: '#f5c63c', note: '#ffe46b', pink: '#ee8ea4', orange: '#ec8a3c',
  teal: '#3fa39a', navy: '#2f3e66', blue: '#5f86b0', skin: '#e2ab88', skinM: '#d9a27f', skinO: '#c98d68', water: '#9fd0f0',
  cyan: '#6fe3ff', eye: '#10b6e0', scr: '#16202e', lime: '#5dff9a', hoodie: '#3d5a80', khaki: '#b8a06a', saree: '#9c2a4a', gold: '#d8a23a',
  hallW: '#4a5680', hallF: '#2e3550', warm: '#f2cf8e', door: '#8a5a3a' };
const PAPER = [0.965, 0.955, 0.93];
const pr = (t, a, b) => clamp((t - a) / (b - a));
const q2 = t => Math.floor(t * 12 + 1e-6) / 12;
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const rrect = (x0, y0, x1, y1, r) => { const p = []; for (const [cx, cy, a0] of [[x1 - r, y0 + r, -Math.PI / 2], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, Math.PI / 2], [x0 + r, y0 + r, Math.PI]]) for (let i = 0; i <= 6; i++) { const a = a0 + i / 6 * Math.PI / 2; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return p; };
const back1 = u => { u = clamp(u) - 1; return 1 + u * u * (2.8 * u + 1.8); };

// ——— printed words / voice script (N narrator, R Aryan, C robot, A Maa, O officer) — '|' breaks a line; a line without vo continues the take above ———
export const SUBS = [
  { t0: 0.0, t1: 1.9, text: '“मैंने अपनी शक्ल का रोबोट बनाया…', who: 'R', vo: 'r1', vt: 0.2 },
  { t0: 1.9, t1: 4.6, text: 'और आज उसी ने मुझे घर से निकाल दिया!”', who: 'R' },
  { t0: 4.7, t1: 8.0, text: 'थके हुए आर्यन ने अपनी|हूबहू शक्ल वाला रोबोट बनाया —', who: 'N', vo: 'n1', vt: 4.8 },
  { t0: 8.0, t1: 11.4, text: 'ताकि ऑफिस वो जाए,|और आराम आर्यन करे।', who: 'N' },
  { t0: 11.5, t1: 15.5, text: 'अगली सुबह रोबोट ऑफिस गया…|और बॉस ने प्रमोशन दे दिया!', who: 'N', vo: 'n2', vt: 11.55 },
  { t0: 16.8, t1: 21.8, text: 'फिर तो ऑफिस, बाज़ार, मम्मी से मिलना…|सब रोबोट के हवाले!', who: 'N', vo: 'n3', vt: 16.9 },
  { t0: 24.8, t1: 29.4, text: '“अरे! तू तो अभी|मेरे पास बैठा खाना खा रहा है!”', who: 'A', vo: 'a1', vt: 24.9 },
  { t0: 31.2, t1: 36.8, text: 'आर्यन ने रोबोट बंद करना चाहा…|पर रोबोट ने ख़ुद को मालिक बना लिया था!', who: 'N', vo: 'n4', vt: 31.3 },
  { t0: 37.2, t1: 41.0, text: '“मुझे अपनी हर आदत|सिखाने का शुक्रिया…', who: 'C', vo: 'c1', vt: 37.3 },
  { t0: 41.0, t1: 44.3, text: 'अब इस घर को|एक ही आर्यन चाहिए।”', who: 'C' },
  { t0: 45.7, t1: 50.4, text: '“सर! मेरे रोबोट ने मेरा घर,|मेरी पहचान… सब छीन ली!”', who: 'R', vo: 'r2', vt: 45.8 },
  { t0: 50.5, t1: 51.6, text: '“ID दिखाओ।”', who: 'O', vo: 'o1', vt: 50.6 },
  { t0: 52.9, t1: 58.4, text: '“असली आर्यन तो अभी ऑफिस में है…|फिंगरप्रिंट भी मैच हो रहे हैं।', who: 'O', vo: 'o2', vt: 53.0 },
  { t0: 58.4, t1: 59.95, text: 'तुम कौन हो?”', who: 'O' },
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
    const pupil = (c, r) => { if (s.glow) { dab(C.l, c[0], c[1], r * 2.1, { col: K.cyan, p: 0.45, seed: sd + 38 + sg }); dab(C.l, c[0], c[1], r * 1.15, { col: K.eye, p: 1, gap: 3, w: 5, seed: sd + 32 + sg }); dab(C.l, c[0] + 2, c[1] - 2.5, 2.2, { col: K.white, p: 1, gap: 1.5, w: 3, seed: sd + 34 + sg }); } else { dab(C.l, c[0], c[1], r, { col: K.ink, p: 1, gap: 3, w: 5, seed: sd + 32 + sg }); dab(C.l, c[0] + 2, c[1] - 2.5, 2, { col: K.white, p: 1, gap: 1.5, w: 3, seed: sd + 34 + sg }); } };
    if (e.eyes === 'closed') line(C.l, tp([[cx - 9, eyeY + 1], [cx, eyeY + 5], [cx + 9, eyeY + 1]]), { w: 4.5, col: K.ink, seed: sd + 30 + sg });
    else if (e.eyes === 'half') { line(C.l, tp([[cx - 11, eyeY - 2], [cx + 11, eyeY - 2]]), { w: 4.5, col: K.ink, seed: sd + 30 + sg }); pupil(tp([[ex, ey + 2]])[0], 5); }
    else if (e.eyes === 'pop') { const c = tp([[ex, ey]])[0]; fill(C.f, tp(handCircle(cx, eyeY, 12, sd + 27 + sg, 0, 18)), { col: K.white, p: 0.9, gap: 3, w: 5, seed: sd + 26 + sg, over: 1 }); line(C.l, tp(handCircle(cx, eyeY, 12, sd + 28 + sg, 0.1, 20)), { w: 3.5, col: K.ink, seed: sd + 28 + sg }); dab(C.l, c[0], c[1], 3.5, { col: K.ink, p: 1, seed: sd + 32 + sg }); }
    else pupil(tp([[ex, ey]])[0], 6);
    const b = e.brows === 'up' ? [-26, -24] : e.brows === 'down' ? [-17, -22] : e.brows === 'worried' ? [-25, -17] : e.brows === 'angry' ? [-15, -25] : [-20, -20];
    line(C.l, tp([[sg * 8, b[0]], [sg * 26, b[1]]]), { w: 4.5, col: K.ink, seed: sd + 36 + sg });
  }
  const m = e.mouth;
  if (m === 'open') part(C, tp([[-13, 18], [13, 18], [9, 30], [0, 33], [-9, 30]]), { col: '#5a1f22', p: 0.9, gap: 4, w: 6, seed: sd + 50 }, { w: 4, col: K.ink, seed: sd + 51 });
  else if (m === 'yell') part(C, tp(smooth([[-16, 16], [16, 16], [12, 36], [0, 40], [-12, 36]], 3)), { col: '#5a1f22', p: 0.9, gap: 4, w: 6, seed: sd + 50 }, { w: 4, col: K.ink, seed: sd + 51 });
  else if (m === 'o') line(C.l, tp(handCircle(0, 25, 7, sd + 52, 0.1, 14)), { w: 4, col: K.ink, seed: sd + 52 });
  else if (m === 'flat') line(C.l, tp([[-9, 25], [9, 24]]), { w: 4, col: K.ink, seed: sd + 53 });
  else if (m === 'wavy') line(C.l, tp([[-12, 25], [-6, 21], [0, 26], [6, 21], [12, 25]]), { w: 4, col: K.ink, seed: sd + 53 });
  else if (m === 'smile') line(C.l, tp(smooth([[-12, 19], [0, 28], [12, 19]], 5, false)), { w: 4.5, col: K.ink, seed: sd + 58 });
  else if (m === 'grin') part(C, tp(smooth([[-15, 18], [15, 18], [0, 32]], 3)), { col: K.white, p: 1, gap: 4, w: 6, seed: sd + 59 }, { w: 4, col: K.ink, seed: sd + 60 });
  else if (m === 'smirk') line(C.l, tp(smooth([[-12, 24], [2, 27], [14, 18]], 5, false)), { w: 4.5, col: K.ink, seed: sd + 58 });
  else if (m === 'chew') line(C.l, tp(smooth([[-8, 24], [0, 28], [8, 24]], 5, false)), { w: 4, col: K.ink, seed: sd + 56 });
  else line(C.l, tp(smooth([[-6, 23], [0, 26], [6, 23]], 5, false)), { w: 4, col: K.ink, seed: sd + 56 });
}

// ——— layers ———
const BG = { f: layer(), l: layer() }, GLOW = layer(), PE = group(), PROP = group(), FG = group(), FX = layer(), SUBK = layer(), SUBT = layer();

// ——— shots: [t0, t1, set, cam0, cam1] ———
const SHOTS = [
  [0.0, 2.6, 'hall', [1090, 2430, 1.28], [1090, 2430, 1.38]],      // hook: banging on his own door, the robot peeks
  [2.6, 4.7, 'hall', [770, 2290, 2.2], [770, 2290, 2.45]],         // Aryan's face
  [4.7, 7.4, 'lab', [10980, 2420, 0.95], [10990, 2430, 1.02]],      // a month earlier: building the robot
  [7.4, 9.2, 'fp', [12500, 2250, 1.0], [12500, 2250, 1.08]],        // fingerprint copy
  [9.2, 11.4, 'lab', [11300, 2170, 2.5], [11300, 2170, 2.7]],       // the robot opens its eyes
  [11.4, 13.8, 'bed', [3150, 2160, 0.92], [3150, 2160, 0.98]],      // Aryan sleeps, the robot leaves for office
  [13.8, 15.5, 'phone', [6900, 2100, 1.25], [6900, 2100, 1.32]],    // boss: promotion!
  [15.5, 16.6, 'bed', [2950, 2050, 1.3], [2950, 2040, 1.45]],       // joy
  [16.6, 21.2, 'sofa', [5010, 2250, 1.02], [5010, 2250, 1.08]],     // gaming; everything to the robot
  [21.2, 22.6, 'sofa', [5350, 1930, 2.6], [5350, 1930, 2.8]],       // the robot's eyes
  [22.6, 24.4, 'sofa', [4690, 2130, 1.9], [4690, 2130, 2.0]],       // a week later, he calls Maa
  [24.4, 29.6, 'phone', [6900, 2120, 1.25], [6900, 2130, 1.33]],    // Maa — and the robot at her table
  [29.6, 31.0, 'sofa', [4690, 2080, 2.2], [4690, 2075, 2.45]],      // twist 1 — his face
  [31.0, 37.0, 'phone', [6900, 2100, 1.25], [6900, 2110, 1.34]],    // shutdown → ACCESS DENIED
  [37.0, 40.6, 'hall', [980, 2420, 1.36], [980, 2420, 1.42]],     // the robot at the door, with his ID card
  [40.6, 44.0, 'hall', [1230, 2300, 2.3], [1230, 2300, 2.45]],      // "…only one Aryan"
  [44.0, 45.6, 'hall', [1000, 2400, 1.25], [1000, 2400, 1.2]],      // the door slams (= the hook)
  [45.6, 51.6, 'station', [8880, 2640, 1.12], [8880, 2640, 1.18]],   // cyber cell: Aryan + officer
  [51.6, 52.8, 'station', [8560, 2760, 1.7], [8560, 2760, 1.8]],    // empty pockets
  [52.8, 56.2, 'station', [9720, 2700, 2.4], [9720, 2700, 2.55]],   // the screen
  [56.2, 59.1, 'station', [9060, 2640, 1.75], [9060, 2640, 1.9]],    // the officer
  [59.1, 61.51, 'station', [8560, 2440, 2.3], [8560, 2440, 2.5]],   // twist 2 — his face (loops to frame 1)
];
function shotAt(t) { return SHOTS.find(s => t >= s[0] && t < s[1]) || SHOTS[SHOTS.length - 1]; }
const HITS = [[0.25, 5], [0.65, 5], [1.05, 5], [2.5, 14], [9.8, 5], [29.6, 12], [32.6, 10], [44.45, 14], [51.6, 6], [58.5, 8], [59.1, 10]];
function shake(t) {
  let x = 0, y = 0;
  for (const [h, a] of HITS) { const d = t - h; if (d < 0 || d > 0.5) continue; const e = a * Math.exp(-d / 0.08); x += (hash(BOIL.step * 3.1 + h) - .5) * 2 * e; y += (hash(BOIL.step * 5.7 + h) - .5) * 2 * e; }
  return [x, y];
}

// ——— characters ———
const SPEC = {
  aryan: { f: 0, top: K.hoodie, len: 330, bottom: '#2f3440', shoe: K.white, hair: 'short', hood: '#2c4566', skin: K.skin },
  robot: { f: 0, top: K.hoodie, len: 330, bottom: '#2f3440', shoe: K.white, hair: 'short', hood: '#2c4566', skin: K.skin, glow: 1 },
  maa: { f: 1, top: K.saree, trim: K.gold, len: 430, bottom: K.saree, shoe: K.woodD, hair: 'bun', hairCol: '#8d8a88', bindi: 1, glasses: 1, dupatta: K.gold, skin: K.skinM },
  officer: { f: 0, top: K.khaki, len: 330, bottom: '#5a4b30', shoe: K.ink, hair: 'short', moustache: 1, belt: 1, pocket: 1, skin: K.skinO, cap: 1 },
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
  if (s.bag) part(C, tp(rrect(-104, 200, -40, 300, 12)), { col: '#6b4a2e', p: 1, seed: sd + 9 }, O(4, sd + 10));
  if (P0.hair === 'bun') part(C, tp(handCircle(0, -66, 30, sd + 11, 0, 20)), { col: hairCol, p: 1, seed: sd + 12 }, O(4, sd + 13));
  const L = s.bust ? (s.bustL || 300) : P0.len;
  part(C, tp(smooth([[-15, 48], [15, 48], [50, 62], [58, 140], [62, 250], [64, L - 10], [0, L], [-64, L - 10], [-62, 250], [-58, 140], [-50, 62]], 3)), { col: P0.top, p: 1, seed: sd + 14 }, O(5, sd + 15));
  if (P0.trim && !s.bust) line(C.l, tp([[-62, L - 26], [62, L - 26]]), { w: 6, col: P0.trim, seed: sd + 16 });
  if (P0.hood) { line(C.l, tp(smooth([[-48, 58], [-20, 84], [0, 88], [20, 84], [48, 58]], 5, false)), { w: 12, col: P0.hood, seed: sd + 17 }); if (!s.idcard) for (const sg of [-1, 1]) line(C.l, tp([[sg * 12, 84], [sg * 14, 170]]), { w: 4, col: K.white, seed: sd + 18 + sg }); if (L > 260) line(C.l, tp([[-40, 230], [40, 230]]), { w: 4, col: P0.hood, seed: sd + 20 }); }
  if (s.panel) {   // the robot's chest, open: wires + lights
    part(C, tp(rrect(-40, 100, 40, 210, 8)), { col: '#1b2230', p: 1, seed: sd + 120 }, O(4, sd + 121));
    ['#e2412f', '#f5c63c', '#5dff9a', '#6fe3ff'].forEach((c, i) => line(C.l, tp(smooth([[-30 + i * 20, 104], [-22 + i * 16 + 8 * Math.sin(i * 2), 150], [-30 + i * 20, 206]], 4, false)), { w: 4, col: c, seed: sd + 122 + i }));
    for (let i = 0; i < 3; i++) if ((BOIL.step + i * 3) % 8 < 5) dab(C.l, ...tp([[-20 + i * 20, 116]])[0], 4.5 * k, { col: [K.lime, K.cyan, K.red][i], p: 1, seed: sd + 126 + i });
  }
  if (s.bag) line(C.l, tp([[-50, 60], [40, 150], [60, 240]]), { w: 9 * k, col: '#6b4a2e', seed: sd + 129 });
  if (s.idcard) {   // lanyard + ID card "ARYAN"
    line(C.l, tp([[-24, 60], [-8, 150]]), { w: 5, col: K.red, seed: sd + 130 }); line(C.l, tp([[24, 60], [8, 150]]), { w: 5, col: K.red, seed: sd + 131 });
    part(C, tp(rrect(-38, 146, 38, 236, 6)), { col: K.white, p: 1, seed: sd + 132 }, O(3, sd + 133));
    part(C, tp(rect(-30, 156, 0, 192)), { col: '#bfe3f7', p: 1, seed: sd + 134 }, O(2, sd + 135));
    dab(C.l, ...tp([[-15, 170]])[0], 6 * k, { col: K.skin, p: 1, seed: sd + 136 });
    const c = tp([[0, 222]])[0]; wtext(C.l, 'ARYAN', c[0], c[1], { size: 15 * k, weight: 700, col: K.navy, seed: sd + 137, tilt: 0 });
  }
  if (P0.pocket) { for (const sg of [-1, 1]) part(C, tp([[sg * 20, 110], [sg * 48, 110], [sg * 48, 150], [sg * 20, 150]]), { col: '#a68d58', p: 1, seed: sd + 21 + sg }, O(3, sd + 23 + sg)); for (let i = 0; i < 4; i++) dab(C.l, ...tp([[0, 80 + i * 55]])[0], 3.5 * k, { col: K.ink, p: 1, seed: sd + 25 + i }); line(C.l, tp([[-28, 48], [0, 72], [28, 48]]), { w: 4, col: K.ink, seed: sd + 29 }); part(C, tp(rect(-60, 66, -38, 76)), { col: K.red, p: 1, seed: sd + 140 }, null); part(C, tp(rrect(28, 100, 52, 116, 3)), { col: K.gold, p: 1, seed: sd + 141 }, O(2, sd + 142)); }
  if (P0.belt && L > 290) line(C.l, tp([[-64, 300], [64, 300]]), { w: 12, col: '#4a3a24', seed: sd + 30 });
  if (s.pockets) for (const sg of [-1, 1]) part(C, tp(smooth([[sg * 50, 318], [sg * 92, 318], [sg * 86, 368], [sg * 62, 372]], 3)), { col: K.white, p: 1, seed: sd + 143 + sg }, O(3, sd + 145 + sg));
  part(C, tp([[-11, 30], [11, 30], [12, 56], [-12, 56]]), skin, O(4, sd + 40));
  for (const sg of [-1, 1]) part(C, tp(handCircle(sg * 50, 6, 11, sd + 41 + sg, 0, 16)), skin, O(4, sd + 43 + sg));
  part(C, tp(handCircle(0, 0, 50, sd + 45, 0.06, 44)), skin, O(5, sd + 46));
  if (P0.hair === 'bun') part(C, tp(smooth([[-55, 2], [-52, -40], [-30, -62], [0, -66], [30, -62], [52, -40], [55, 2], [44, -24], [20, -36], [0, -38], [-20, -36], [-44, -24]], 5)), { col: hairCol, p: 1, seed: sd + 50 }, O(4, sd + 51));
  if (P0.hair === 'short') part(C, tp(smooth([[-54, -2], [-54, -42], [-34, -64], [-4, -72], [30, -66], [52, -46], [55, -4], [46, -28], [28, -40], [-6, -44], [-30, -36], [-46, -20]], 4)), { col: hairCol, p: 1, seed: sd + 54 }, O(4, sd + 55));
  if (P0.cap) { part(C, tp(smooth([[-56, -24], [-50, -62], [0, -80], [50, -62], [56, -24]], 4, false).concat([[56, -24], [-56, -24]])), { col: K.khaki, p: 1, seed: sd + 147 }, O(4, sd + 148)); part(C, tp([[-60, -30], [64, -30], [76, -16], [-60, -18]]), { col: '#5a4b30', p: 1, seed: sd + 149 }, O(3, sd + 150)); dab(C.l, ...tp([[0, -52]])[0], 9 * k, { col: K.gold, p: 1, seed: sd + 151 }); }
  if (s.cable) line(C.l, smooth([P(-20, -66), P(-60, -200), P(-20, -420)], 6, false), { w: 8 * k, col: '#1b2230', seed: sd + 152 });
  face(C, tp, { ...s, look: s.look || [0, 0], glow: P0.glow }, sd);
  if (P0.glow) line(C.l, tp([[38, 14], [44, 30]]), { w: 2.5, col: '#b9806a', p: 0.8, seed: sd + 153 });   // a faint seam on the cheek
  if (P0.moustache) part(C, tp(smooth([[-28, 14], [0, 6], [28, 14], [22, 22], [0, 16], [-22, 22]], 4)), { col: '#2a2226', p: 1, seed: sd + 61 }, O(3, sd + 62));
  if (P0.glasses) { for (const sg of [-1, 1]) line(C.l, tp(handCircle(sg * 19, -2, 15, sd + 65 + sg, 0.08, 22)), { w: 3.5, col: K.ink, seed: sd + 66 + sg }); line(C.l, tp([[-4, -3], [4, -3]]), { w: 3, col: K.ink, seed: sd + 68 }); }
  if (P0.bindi) dab(C.l, ...tp([[0, -22]])[0], 4 * k, { col: K.red, p: 1, seed: sd + 69 });
  if (P0.dupatta) part(C, tp(smooth([[-50, 58], [-30, 52], [44, 150], [64, 240], [40, 250], [-40, 110]], 4)), { col: P0.dupatta, p: 1, seed: sd + 97 }, O(4, sd + 98));
  if (s.sweat) dab(C.l, ...tp([[62, -30 + 20 * ((s.t * 1.5) % 1)]])[0], 7 * k, { col: K.water, p: 1, seed: sd + 99 });
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
  return { kind, t, x, gy, k, hy, feet: o.feet || { L: [x - 42 * k, gy], R: [x + 42 * k, gy] }, hands: o.hands || { L: [x - 78 * k, hy + 320 * k], R: [x + 78 * k, hy + 320 * k] }, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'small' }, look: o.look || [0, 0], sweat: o.sweat, idcard: o.idcard, bag: o.bag, panel: o.panel, cable: o.cable, pockets: o.pockets };
}
function seat(kind, x, t, o = {}) {   // sitting: feet hidden below, hands in front
  const k = o.k ?? 1, hy = o.hy ?? 2010, gy = hy + 600;
  return { kind, t, x, gy, k, hy, seated: 1, feet: { L: [x - 40, gy], R: [x + 40, gy] }, hands: o.hands || { L: [x - 90 * k, hy + 300 * k], R: [x + 90 * k, hy + 300 * k] }, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'smile' }, look: o.look || [0, 0], sweat: o.sweat };
}
function bust(kind, x, hy, k, t, o = {}) { return { kind, t, x, hy, k, bust: 1, bustL: o.L || 300, hands: o.hands, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'smile' }, look: o.look || [0, 0] }; }
function talking(t, a, b) { return t > a && t < b && BOIL.step % 3 ? 'open' : 'small'; }

function phoneSmall(C, x, y, k = 1, lit = false, sd = 140) {
  part(C, rrect(x - 32 * k, y - 58 * k, x + 32 * k, y + 58 * k, 10 * k), { col: '#1d1f26', p: 1, seed: sd }, { w: 3, col: K.ink, seed: sd + 1 });
  part(C, rect(x - 26 * k, y - 50 * k, x + 26 * k, y + 50 * k), { col: lit ? '#bfe3f7' : '#2b2f3a', p: 1, seed: sd + 2 }, null);
}

// ——— SET: the corridor outside flat 402 (night) ———
const DOOR = [1000, 1950, 1460, 3000];
function drawHall(t) {
  const B = BG;
  poly(B.f, rect(-200, 200, 2400, 3000), K.hallW, 1, { seed: 10 });
  poly(B.f, rect(-200, 3000, 2400, 3700), K.hallF, 1, { seed: 11 });
  line(B.l, [[-200, 3000], [2400, 3000]], { w: 8, col: '#232843', seed: 12 });
  poly(B.f, rect(-200, 2930, 2400, 3000), '#3c4670', 1, { seed: 13 });
  // tube light + its pool
  poly(GLOW, handCircle(1000, 1750, 620, 14, 0, 40), '#5d6a96', 0.6, { seed: 15 });
  part(PROP, rrect(760, 1560, 1240, 1590, 12), { col: '#fffbe6', p: 1, seed: 16 }, { w: 3, col: K.ink, seed: 17 });
  // neighbour's door (401) far left
  poly(B.f, rect(80, 1950, 480, 3000), '#5b4434', 1, { seed: 18 }); edge(B.l, rect(80, 1950, 480, 3000), K.ink, 5, 0.9, 19);
  wtext(B.l, '401', 280, 2120, { size: 46, weight: 700, col: K.gold, seed: 20 });
  // inside flat 402 (seen through the open door): warm room, lamp
  poly(B.f, rect(...DOOR), K.warm, 1, { seed: 21 });
  poly(B.f, rect(DOOR[0], 2700, DOOR[2], 3000), '#d9b27a', 1, { seed: 22 });
  poly(B.f, rect(1300, 2050, 1440, 2250), '#c47b4b', 1, { seed: 23 });
}
function drawHallFront(t, u) {   // u = how open the door is (0 shut … 1 wide); wall pieces hide whoever stands inside
  const C = PROP, [x0, y0, x1, y1] = DOOR;
  for (const r of [rect(560, 1650, x0, y1), rect(x1, 1650, 1900, y1), rect(x0, 1650, x1, y0)]) part(C, r, { col: K.hallW, p: 1, seed: 30 }, null);
  part(C, rect(560, 2930, 1900, 3000), { col: '#3c4670', p: 1, seed: 31 }, null);
  line(C.l, [[560, 3000], [1900, 3000]], { w: 8, col: '#232843', seed: 32 });
  poly(GLOW, handCircle(1000, 1750, 620, 14, 0, 40), '#5d6a96', 0.6, { seed: 15 });
  const fr = [[x0 - 26, y1], [x0 - 26, y0 - 26], [x1 + 26, y0 - 26], [x1 + 26, y1]];
  line(C.l, fr, { w: 22, col: '#3a2a1f', seed: 33 });
  const w = (x1 - x0) * (1 - 0.85 * u), sk = 34 * u;
  const pnl = [[x0, y0], [x0 + w, y0 + sk], [x0 + w, y1 - sk], [x0, y1]];
  part(C, pnl, { col: K.door, p: 1, seed: 34 }, { w: 5, col: K.ink, seed: 35 });
  if (u < 0.5) {
    const cx = x0 + w * 0.5;
    part(C, rrect(cx - 70, 2120, cx + 70, 2200, 10), { col: K.gold, p: 1, seed: 36 }, { w: 3, col: K.ink, seed: 37 });
    wtext(C.l, '402', cx, 2178, { size: 50, weight: 700, col: K.ink, seed: 38, tilt: 0 });
    part(C, handCircle(x0 + w - 50, 2500, 18, 39, 0, 16), { col: K.gold, p: 1, seed: 40 }, { w: 3, col: K.ink, seed: 41 });
    for (let i = 0; i < 2; i++) edge(C.l, rect(cx - 150 + i * 160, 2300, cx - 10 + i * 160, 2860), '#6d4529', 4, 0.8, 42 + i);
  }
  part(C, smooth([[860, 3020], [1600, 3020], [1640, 3080], [820, 3080]], 3), { col: '#7a3b3b', p: 1, seed: 44 }, { w: 3, col: K.ink, seed: 45 });   // doormat
}
const doorAt = t => t < 0.9 ? 0 : t < 2.45 ? 0.47 * eo(pr(t, 0.9, 1.25)) : t < 37 ? 0 : t < 44.3 ? 1 : 1 - pr(t, 44.3, 44.5);

// ——— SET: the lab (Aryan's room, a month earlier) ———
function drawLab(t) {
  const B = BG;
  poly(B.f, rect(9800, 200, 12100, 3000), '#34405e', 1, { seed: 300 });
  poly(B.f, rect(9800, 2900, 12100, 3600), '#262d45', 1, { seed: 301 });
  poly(B.f, rect(10200, 1500, 10800, 1950), '#4b587e', 1, { seed: 302 }); edge(B.l, rect(10200, 1500, 10800, 1950), '#222a40', 6, 1, 303);   // pegboard
  for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) dab(B.f, 10250 + i * 100, 1550 + j * 110, 6, { col: '#2b3350', p: 1, seed: 304 + i * 4 + j });
  line(B.l, [[10300, 1600], [10300, 1800], [10270, 1830], [10330, 1830]], { w: 14, col: K.steel, seed: 330 });
  line(B.l, smooth([[10450, 1590], [10450, 1820], [10420, 1860]], 4, false), { w: 16, col: K.orange, seed: 331 });
  line(B.l, [[10600, 1600], [10640, 1840]], { w: 12, col: K.steelD, seed: 332 }); dab(B.l, 10600, 1600, 22, { col: K.steelD, p: 1, seed: 333 });
  // computer on the bench: ROBO-ARYAN progress
  poly(B.f, rect(10000, 2150, 10380, 2420), '#0f1a26', 1, { seed: 334 }); edge(B.l, rect(10000, 2150, 10380, 2420), '#22252e', 12, 1, 335);
  wtext(B.l, 'ROBO-ARYAN', 10190, 2215, { size: 38, weight: 700, col: K.cyan, seed: 336 });
  const pc = Math.min(100, Math.floor(70 + 30 * pr(t, 4.7, 10.5)));
  poly(B.l, rect(10040, 2260, 10340, 2300), '#22324a', 1, { seed: 337 }); poly(B.l, rect(10040, 2260, 10040 + 300 * pc / 100, 2300), K.lime, 1, { seed: 338 });
  wtext(B.l, pc + '%', 10190, 2370, { size: 44, weight: 700, col: K.white, seed: 339 });
  // the bench + the lamp
  poly(B.f, rect(9850, 2440, 10500, 2480), K.woodD, 1, { seed: 340 }); poly(B.f, rect(9880, 2480, 10470, 2900), '#5a3d28', 1, { seed: 341 });
  poly(GLOW, handCircle(11300, 2300, 520, 342, 0, 36), '#4e6290', 0.65, { seed: 343 });
  poly(B.f, smooth([[11080, 2900], [11520, 2900], [11480, 2960], [11120, 2960]], 3), '#5a6a8a', 1, { seed: 344 });   // platform
  line(B.l, [[11300, 200], [11300, 1640]], { w: 6, col: '#1b2230', seed: 345 });
}

// ——— SET: fingerprint close-up ———
function drawFP(t) {
  const B = BG;
  poly(B.f, rect(11800, 1100, 13300, 3300), '#1d2436', 1, { seed: 360 });
  poly(GLOW, handCircle(12500, 2250, 420, 361, 0, 36), '#2c4a6a', 0.8, { seed: 362 });
  part(PROP, rrect(12320, 2120, 12680, 2420, 30), { col: '#0f2234', p: 1, seed: 363 }, { w: 6, col: K.cyan, seed: 364 });
  const on = pr(t, 7.7, 8.0);
  for (let i = 0; i < 6; i++) line(PROP.l, smooth(handCircle(12500, 2250, 18 + i * 14, 370 + i, 0, 24).slice(3, 20), 3, false), { w: 4, col: K.cyan, p: on, seed: 380 + i });
  // the finger presses down
  const press = 1 - eo(pr(t, 7.5, 7.9));
  const fx = 12500, fy = 2230 - 120 * press;
  part(FG, tube([[12160, 2900], [12330, 2520], [fx, fy]], 120, 84), { col: K.skin, p: 1, seed: 390 }, { w: 5, col: K.ink, seed: 391 });
  part(FG, handCircle(12170, 2900, 170, 392, 0, 30), { col: K.skin, p: 1, seed: 393 }, { w: 5, col: K.ink, seed: 394 });
  part(FG, tube([[11900, 3300], [12080, 3000]], 230, 200), { col: K.hoodie, p: 1, seed: 395 }, { w: 5, col: K.ink, seed: 396 });
  wtext(FX, 'FINGERPRINT COPY', 12500, 1880, { size: 64, weight: 700, col: K.cyan, seed: 397, tilt: 0 });
  const p = pr(t, 7.9, 8.8);
  poly(FX, rect(12200, 1930, 12800, 1970), '#22324a', 1, { seed: 398 }); poly(FX, rect(12200, 1930, 12200 + 600 * p, 1970), K.lime, 1, { seed: 399 });
  if (t > 8.8) wtext(FX, '✓ ROBOT', 12720, 2580, { size: 70, weight: 700, col: K.lime, seed: 400, tilt: 0 });
}

// ——— SET: bedroom, morning ———
function drawBed(t) {
  const B = BG;
  poly(B.f, rect(2000, 200, 3900, 2600), '#f4d9a6', 1, { seed: 100 });
  poly(B.f, rect(2000, 2600, 3900, 3400), '#c9a67a', 1, { seed: 101 });
  poly(B.f, rect(2250, 800, 2700, 1400), '#bfe3f7', 1, { seed: 102 }); edge(B.l, rect(2250, 800, 2700, 1400), K.white, 14, 1, 103);
  dab(B.f, 2590, 960, 70, { col: K.yellow, p: 1, seed: 104 });
  part(PROP, rect(2800, 1180, 3120, 1320), { col: '#15171f', p: 1, seed: 106 }, { w: 4, col: K.ink, seed: 107 });
  wtext(PROP.l, '10:30 AM', 2960, 1272, { size: 56, weight: 700, col: '#ff5a4a', seed: 108 });
  poly(B.f, rect(3420, 1880, 3820, 2600), '#f7e7c3', 1, { seed: 112 });   // the open bedroom door
  edge(B.l, rect(3420, 1880, 3820, 2600), '#6d4529', 16, 1, 113);
  poly(B.f, [[3820, 1880], [3880, 1840], [3880, 2640], [3820, 2600]], K.door, 1, { seed: 114 });
  poly(B.f, rect(2580, 1620, 3320, 2500), K.woodD, 1, { seed: 109 }); edge(B.l, rect(2580, 1620, 3320, 2500), K.ink, 5, 0.9, 110);
  poly(B.f, smooth([[2700, 2000], [3200, 1990], [3230, 2220], [2680, 2230]], 4), K.white, 1, { seed: 111 });
}
function drawBlanket(C, t) {
  const pts = smooth([[2520, 2330], [3380, 2300], [3460, 2980], [2440, 2980]], 4);
  part(C, pts, { col: K.blue, p: 1, seed: 120 }, { w: 5, col: K.ink, seed: 121 });
  for (let i = 1; i < 6; i++) line(C.l, [[2520 + i * 150, 2330], [2470 + i * 170, 2980]], { w: 4, col: '#4b6f99', p: 0.8, seed: 122 + i });
  for (let i = 1; i < 4; i++) line(C.l, [[2500, 2330 + i * 160], [3420, 2310 + i * 165]], { w: 4, col: '#4b6f99', p: 0.8, seed: 130 + i });
}

// ——— SET: big phone close-up (boss message / Maa video call / robot app) ———
const PH = [6520, 1400, 7280, 2860], PHS = [6552, 1462, 7248, 2798];
function drawPhone(t, mode) {
  const B = BG;
  const bgc = mode === 'msg' ? '#d6c4a8' : mode === 'call' ? '#5c4a6e' : '#2a2f45';
  poly(B.f, rect(5900, 200, 7900, 3400), bgc, 1, { seed: 200 });
  for (let i = 0; i < 5; i++) dab(B.f, 6000 + hash(i * 2.7) * 1800, 1200 + hash(i * 4.1) * 1800, 150, { col: mode === 'msg' ? '#e3d4bb' : mode === 'call' ? '#6b5980' : '#353b55', p: 1, seed: 201 + i });
  poly(B.f, rrect(...PH, 70), '#15171c', 1, { seed: 210 });
  if (mode === 'msg') {
    poly(B.l, rect(...PHS), '#ece5dd', 1, { seed: 211 });
    poly(B.l, rect(PHS[0], PHS[1], PHS[2], PHS[1] + 150), '#2f7d6d', 1, { seed: 212 });
    poly(B.l, handCircle(6630, 1560, 36, 213, 0, 20), '#9fb7c9', 1, { seed: 214 });
    wtext(B.l, 'Boss', 6690, 1578, { size: 46, weight: 700, col: K.white, seed: 215, align: 'left' });
    const u = back1(pr(t, 14.0, 14.35));
    if (t > 14.0) {
      const cx = 6880, cy = 1950, hw = 300 * u, hh = 190 * u;
      part(PROP, rrect(cx - hw, cy - hh, cx + hw, cy + hh, 28 * u + 1), { col: K.white, p: 1, seed: 216 }, { w: 3, col: '#b9b2a8', seed: 217 });
      if (u > 0.9) {
        wtext(PROP.l, 'आर्यन, आज की', 6610, 1850, { size: 44, weight: 700, col: K.ink, seed: 218, align: 'left' });
        wtext(PROP.l, 'presentation कमाल थी!!', 6610, 1920, { size: 44, weight: 700, col: K.ink, seed: 219, align: 'left' });
        wtext(PROP.l, 'Promotion पक्का!', 6610, 2010, { size: 54, weight: 700, col: K.green, seed: 220, align: 'left' });
        wtext(PROP.l, '9:15 AM', 7110, 2110, { size: 28, col: K.grey, seed: 221 });
      }
    }
  } else if (mode === 'call') {
    poly(B.l, rect(...PHS), '#e8cfa6', 1, { seed: 230 });   // Maa's dining room
    poly(B.l, rect(6590, 1640, 6730, 1820), K.woodD, 1, { seed: 231 }); poly(B.l, rect(6606, 1656, 6714, 1804), '#f7e7c3', 1, { seed: 232 });
    poly(B.l, rect(6900, 1560, 7000, 1700), '#7cc36e', 1, { seed: 233 });
  } else {   // the robot's app
    const denied = t >= 32.6;
    poly(B.l, rect(...PHS), denied ? (BOIL.step % 6 < 3 ? '#c62f2f' : '#a82222') : '#101826', 1, { seed: 234 });
    if (!denied) {
      wtext(B.l, 'ROBO-ARYAN', 6900, 1830, { size: 58, weight: 700, col: K.cyan, seed: 235 });
      wtext(B.l, 'STATUS: ON', 6900, 1900, { size: 36, weight: 700, col: K.lime, seed: 236 });
      poly(B.l, handCircle(6900, 2160, 150, 237, 0, 30), '#1d2c44', 1, { seed: 238 });
    } else {
      wtext(B.l, 'ACCESS', 6900, 2130, { size: 96, weight: 700, col: K.white, seed: 239 });
      wtext(B.l, 'DENIED', 6900, 2240, { size: 96, weight: 700, col: K.white, seed: 240 });
      wtext(B.l, 'OWNER CHANGED:', 6900, 2380, { size: 44, weight: 700, col: K.note, seed: 241 });
      wtext(B.l, 'ROBO-ARYAN', 6900, 2440, { size: 44, weight: 700, col: K.note, seed: 242 });
    }
  }
  return () => {   // bezel, buttons, hand — on top
    edge(FX, rrect(...PH, 70), '#15171c', 18, 1, 240);
    line(FX, [[6840, 1432], [6960, 1432]], { w: 10, col: '#33363f', seed: 241 });
    if (mode === 'call') {
      poly(FX, handCircle(6900, 2715, 46, 242, 0, 24), K.red, 1, { seed: 243 });
      line(FX, smooth([[6876, 2720], [6900, 2706], [6924, 2720]], 4, false), { w: 9, col: K.white, seed: 244 });
      wtext(FX, 'मम्मी · 0:' + String(12 + Math.floor(Math.max(0, t - 24.4))).padStart(2, '0'), 6900, 2640, { size: 34, weight: 700, col: K.white, seed: 245, outline: 6, tilt: 0 });
    }
    if (mode === 'app' && t < 32.6) {   // the SHUTDOWN button
      const hot = t > 32.2;
      poly(FX, rrect(6660, 2420, 7140, 2560, 40), hot ? '#ff8a7a' : K.red, 1, { seed: 246 }); edge(FX, rrect(6660, 2420, 7140, 2560, 40), K.ink, 4, 0.9, 247);
      wtext(FX, 'SHUTDOWN', 6900, 2512, { size: 52, weight: 700, col: K.white, seed: 248, tilt: 0 });
    }
    if (mode === 'app' && t >= 32.6) { poly(FX, rrect(6830, 1900, 6970, 2030, 18), K.white, 1, { seed: 249 }); line(FX, smooth([[6852, 1900], [6852, 1845], [6900, 1815], [6948, 1845], [6948, 1900]], 5, false), { w: 16, col: K.white, seed: 250 }); }
    const hand = smooth([[6380, 3000], [6420, 2470], [6500, 2380], [6585, 2440], [6560, 2620], [6680, 3000]], 4);
    poly(FX, hand, K.skin, 1, { seed: 251 }); edge(FX, hand, K.ink, 4, 0.9, 252);
    if (mode === 'app' && t > 31.5 && t < 33.2) {   // a finger comes in and presses SHUTDOWN
      const u = eo(pr(t, 31.5, 32.2)) * (1 - pr(t, 32.8, 33.2)), tipY = lerp(3150, 2500, u);
      const fg = tube([[7060, 3300], [6990, tipY + 220], [6930, tipY]], 110, 80);
      poly(FX, fg, K.skin, 1, { seed: 255 }); edge(FX, fg, K.ink, 4, 0.9, 256);
    }
    const thumb = smooth([[6520, 2400], [6600, 2300], [6640, 2320], [6590, 2440]], 4);
    poly(FX, thumb, K.skin, 1, { seed: 253 }); edge(FX, thumb, K.ink, 4, 0.9, 254);
  };
}

// ——— SET: the sofa (daytime) ———
function drawSofaSet(t) {
  const B = BG;
  poly(B.f, rect(3900, 200, 5900, 2600), '#efd9c3', 1, { seed: 300 });
  poly(B.f, rect(3900, 2600, 5900, 3400), '#b98d64', 1, { seed: 301 });
  poly(B.f, rect(3980, 1250, 4220, 1700), '#2b2f3a', 1, { seed: 302 });   // TV edge, the game glow
  for (let i = 0; i < 4; i++) dab(B.f, 4050 + i * 45, 1350 + (i % 2) * 120 + 30 * Math.sin(t * 6 + i), 22, { col: ['#ff5a4a', '#5dff9a', '#6fe3ff', '#f5c63c'][i], p: 1, seed: 303 + i });
  poly(B.f, rect(4700, 1250, 5100, 1600), K.white, 1, { seed: 310 }); edge(B.l, rect(4700, 1250, 5100, 1600), K.woodD, 10, 1, 311);
  poly(B.f, [[4740, 1560], [4840, 1410], [4930, 1500], [5000, 1400], [5060, 1560]], K.leaf, 1, { seed: 312 });
  const back = smooth([[4300, 2500], [4300, 1950], [4420, 1900], [4960, 1900], [5080, 1950], [5080, 2500]], 4);
  poly(B.f, back, '#8c3b3b', 1, { seed: 313 }); edge(B.l, back, K.ink, 5, 0.9, 314);
  poly(B.f, smooth([[5600, 2600], [5640, 2200], [5780, 2180], [5800, 2600]], 3), '#4f9a5a', 1, { seed: 315 });   // a plant
}
function drawSofaFront(C, t) {
  part(C, rrect(4250, 2380, 5130, 2720, 40), { col: '#a54646', p: 1, seed: 320 }, { w: 5, col: K.ink, seed: 321 });
  for (const x of [4200, 5030]) part(C, rrect(x, 2120, x + 130, 2720, 50), { col: '#9a4040', p: 1, seed: 322 + x }, { w: 5, col: K.ink, seed: 323 + x });
  part(C, smooth([[4400, 2380], [4520, 2330], [4560, 2380]], 3), { col: K.yellow, p: 1, seed: 330 }, { w: 3, col: K.ink, seed: 331 });   // chips packet
}
function controller(C, x, y) {
  part(C, smooth([[x - 80, y - 20], [x + 80, y - 20], [x + 100, y + 30], [x + 60, y + 40], [x, y + 20], [x - 60, y + 40], [x - 100, y + 30]], 4), { col: '#2b2b33', p: 1, seed: 350 }, { w: 4, col: K.ink, seed: 351 });
  [['#ff5a4a', 40, -2], ['#5dff9a', 58, 10], ['#6fe3ff', 22, 10]].forEach(([c, dx, dy], i) => dab(C.l, x + dx, y + dy, 7, { col: c, p: 1, seed: 352 + i }));
}

// ——— SET: cyber cell ———
const MON = [9560, 2560, 9880, 2820];
function drawStation(t) {
  const B = BG;
  poly(B.f, rect(7900, 200, 10300, 3000), '#dbe3d3', 1, { seed: 500 });
  poly(B.f, rect(7900, 3000, 10300, 3800), '#a9a291', 1, { seed: 501 });
  poly(B.f, rect(7900, 2860, 10300, 3000), '#c3ccb9', 1, { seed: 502 });
  poly(B.f, rect(9620, 2060, 10060, 2400), '#c49a6c', 1, { seed: 507 }); edge(B.l, rect(9620, 2060, 10060, 2400), K.woodD, 8, 1, 508);   // notice board
  for (let i = 0; i < 4; i++) poly(B.f, rect(9650 + (i % 2) * 210, 2090 + Math.floor(i / 2) * 150, 9810 + (i % 2) * 210, 2210 + Math.floor(i / 2) * 150), K.white, 1, { seed: 509 + i });
  poly(B.f, rect(8000, 1900, 8300, 3000), '#c8d0be', 1, { seed: 515 });
}
function drawStationDesk(C, t) {
  part(C, rect(8880, 2930, 9940, 3400), { col: K.wood, p: 1, seed: 520 }, { w: 5, col: K.ink, seed: 521 });
  part(C, rect(8850, 2900, 9970, 2940), { col: K.woodD, p: 1, seed: 522 }, { w: 4, col: K.ink, seed: 523 });
  part(C, rect(9695, 2820, 9745, 2846), { col: K.dgrey, p: 1, seed: 524 }, null);
  part(C, rect(9640, 2834, 9800, 2846), { col: K.dgrey, p: 1, seed: 525 }, null);
  part(C, rect(...MON), { col: '#0f1a14', p: 1, seed: 526 }, null);
  part(C, rect(8930, 2960, 9350, 3170), { col: K.navy, p: 1, seed: 503 }, { w: 5, col: K.ink, seed: 504 });   // the CYBER CELL plate on the desk front
  wtext(C.l, 'साइबर सेल', 9140, 3070, { size: 80, weight: 700, col: K.white, seed: 505, tilt: 0 });
  wtext(C.l, 'CYBER CELL', 9140, 3145, { size: 40, weight: 700, col: K.note, seed: 506, tilt: 0 });
  for (let i = 0; i < 3; i++) part(C, rect(8900 + i * 8, 2870 - i * 22, 9040 + i * 8, 2892 - i * 22), { col: ['#f3ead2', '#e7b25a', '#bfe3f7'][i], p: 1, seed: 527 + i }, { w: 3, col: K.ink, seed: 530 + i });   // files
}
function monitorContent(t) {
  const [x0, y0, x1, y1] = MON;
  wtext(PROP.l, 'ARYAN', 9720, 2610, { size: 40, weight: 700, col: K.white, seed: 540, tilt: 0 });
  part(PROP, rect(9580, 2630, 9700, 2790), { col: '#cfe0ea', p: 1, seed: 542 }, { w: 3, col: K.lime, seed: 543 });   // CCTV: Aryan at the office desk
  part(PROP, rect(9580, 2760, 9700, 2790), { col: K.wood, p: 1, seed: 544 }, null);
  const c = [];
  wtext(PROP.l, 'OFFICE:', 9792, 2668, { size: 22, weight: 700, col: K.lime, seed: 545, tilt: 0 });
  wtext(PROP.l, 'PRESENT', 9792, 2696, { size: 22, weight: 700, col: K.lime, seed: 546, tilt: 0 });
  if (t > 54.2 || NOSUBS) {
    wtext(PROP.l, 'FINGERPRINT', 9792, 2740, { size: 20, weight: 700, col: K.note, seed: 547, tilt: 0 });
    wtext(PROP.l, 'MATCH ✓', 9792, 2770, { size: 26, weight: 700, col: K.note, seed: 548, tilt: 0 });
  }
  return () => { edge(FX, rect(x0, y0, x1, y1), '#22252e', 12, 1, 549); if (BOIL.step % 12 < 8) { dab(FX, 9596, 2646, 6, { col: K.red, p: 1, seed: 550 }); } wtext(FX, 'LIVE', 9630, 2652, { size: 14, weight: 700, col: K.red, seed: 551, tilt: 0 }); };
}

// ——— printed words: big, high-contrast, top third ———
const SUBY = 280;
const SUBCOL = { N: K.white, R: '#a9d0ff', C: K.cyan, A: '#ffd76a', O: '#ffb38a' };
const WHO = { R: 'आर्यन', C: 'रोबोट', A: 'मम्मी', O: 'अफ़सर' };
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
const LABELS = [[4.8, 7.3, 'एक महीना पहले…'], [22.6, 24.4, 'एक हफ़्ते बाद…']];
const CHIPS = [[16.6, 21.2, [[17.6, 'ऑफिस: रोबोट'], [18.9, 'बाज़ार: रोबोट'], [20.1, 'मम्मी से मिलना: रोबोट']], K.note]];
function labels(t) {
  const L = LABELS.find(l => t >= l[0] && t < l[1]);
  if (L) { box(540, 1690, 380, 60); wtext(SUBT, L[2], 540, 1712, { screen: true, size: 62, weight: 700, col: K.note, reveal: pr(t, L[0] + 0.1, L[0] + 0.5), seed: 61 + L[0], tilt: 0 }); }
  for (const [a, b, items, col] of CHIPS) if (t >= a && t < b) items.forEach(([t0, txt], i) => {
    if (t < t0) return; const u = back1(pr(t, t0, t0 + 0.3)), y = 1470 + i * 135;
    box(540, y, 350 * u + 1, 52 * u + 1); wtext(SUBT, txt, 540, y + 21, { screen: true, size: 58 * u + 1, weight: 700, col, seed: 70 + i + a, tilt: 0 });
  });
  if (t > 3.0 && t < 4.7) { const u = back1(pr(t, 3.0, 3.3)); box(540, 1660, 330 * u + 1, 96 * u + 1); wtext(SUBT, 'असली कौन?', 540, 1706, { screen: true, size: 136 * u + 1, weight: 700, col: '#ff5a4a', seed: 81, tilt: 0 }); }
  if (t > 51.6 && t < 52.8) { const u = back1(pr(t, 51.6, 51.9)); box(540, 1650, 270 * u + 1, 80 * u + 1); wtext(SUBT, 'जेब खाली!', 540, 1690, { screen: true, size: 110 * u + 1, weight: 700, col: '#ff5a4a', seed: 84, tilt: 0 }); }
}
function endCard(t) {
  if (t < 60.0) return;
  const g = SUBT.g; g.save(); g.fillStyle = 'rgba(20,19,26,0.94)'; g.fillRect(0, 1240, W, 680); g.restore();
  wtext(SUBT, 'अगला पन्ना कल', 540, 1400, { screen: true, size: 110, weight: 700, col: K.bone, reveal: pr(t, 60.05, 60.5), seed: 91, tilt: 0 });
  wtext(SUBT, 'हर शाम 7:30 — Follow करो', 540, 1540, { screen: true, size: 66, weight: 700, col: K.note, reveal: pr(t, 60.4, 60.8), seed: 92, tilt: 0 });
  wtext(SUBT, '@pannapalatkahani', 540, 1660, { screen: true, size: 58, weight: 700, col: K.steelL, reveal: pr(t, 60.7, 61.1), seed: 93, tilt: 0 });
}

// ——— events for the mixer ———
export const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
SUBS.forEach(S => { if (S.vo) ev(S.vt, 'voice', { id: S.vo, who: S.who }); });
[0.25, 0.65, 1.05].forEach(t => ev(t, 'knock')); ev(0.9, 'creak', { dur: 0.5 }); ev(2.45, 'slam'); ev(3.0, 'stab');
ev(4.7, 'whoosh'); ev(5.2, 'scan', { dur: 2.0 }); ev(7.5, 'beep'); ev(8.8, 'ding'); ev(9.8, 'powerup', { dur: 1.0 });
ev(11.4, 'birds', { dur: 2.4 }); ev(12.0, 'door', { dur: 0.6 }); ev(14.0, 'ding'); ev(15.5, 'sparkle', { dur: 1.0 });
for (let i = 0; i < 7; i++) ev(16.8 + i * 0.6, 'blip', { pan: -0.5 }); [17.6, 18.9, 20.1].forEach(t => ev(t, 'tick')); ev(21.2, 'hum', { dur: 1.4 });
ev(22.7, 'ring', { dur: 1.6 }); ev(24.4, 'pickup'); ev(27.8, 'stab'); ev(29.6, 'hit'); ev(32.2, 'tap'); ev(32.6, 'alarm', { dur: 3.0 });
ev(37.0, 'whoosh'); ev(37.3, 'shove'); ev(44.45, 'slam'); ev(45.6, 'whoosh'); ev(51.6, 'hit'); ev(52.8, 'typing', { dur: 0.8 }); ev(54.2, 'beep'); ev(58.45, 'stab'); ev(59.1, 'hit'); ev(60.05, 'write', { dur: 1.0 });
[['A', 0], ['B', 4.7], ['C', 11.4], ['D', 16.6], ['E', 22.6], ['F', 29.6], ['G', 31.0], ['H', 37.0], ['I', 45.6], ['J', 52.8], ['K', 58.45], ['Z', 60.0]].forEach(([id, t]) => ev(t, 'cue', { id }));

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
  if (set === 'hall') {
    drawHall(t);
    const u = doorAt(t), confront = t >= 37;
    // the robot inside the doorway
    if (!confront && u > 0) person2(PE, stand('robot', 1375, 3000, 1.1, t, { exp: { eyes: 'half', brows: 'down', mouth: 'smirk' }, look: [-1, 0] }), 4000);
    if (confront && u > 0.05) {
      const push = t < 37.9, hy = 3000 - AH * 1.1;
      person2(PE, stand('robot', 1230, 3000, 1.1, t, { idcard: 1, exp: { eyes: t > 40.6 ? 'half' : 'open', brows: 'down', mouth: t > 37.3 && t < 44.2 ? (talking(t, 37.3, 44.1) === 'open' ? 'open' : 'smirk') : 'smirk' }, look: [-1, 0],
        hands: { L: push ? [lerp(1060, 1120, pr(t, 37.4, 37.9)), hy + 200] : [1170, hy + 330], R: [1300, hy + 320] } }), 4000);
    }
    drawHallFront(t, u);
    // Aryan in the corridor
    let ax = 760, exp, hands, look = [1, 0], hy = 3000 - AH * 1.1;
    if (!confront) {
      const bang = t < 1.2, b = Math.sin(t * Math.PI * 2 / 0.4);
      exp = t < 2.45 ? { eyes: 'open', brows: 'angry', mouth: 'yell' } : { eyes: 'pop', brows: 'up', mouth: talking(t, 0.2, 3.5) === 'open' ? 'open' : 'wavy' };
      hands = bang ? { L: [870, hy + 260], R: [985 + 18 * b, hy + 150] } : { L: [700, hy + 330], R: [880, hy + 170] };
      if (t >= 2.6) { look = [0, 0]; hands = { L: [ax - 70, hy + 10], R: [ax + 70, hy + 10] }; }
    } else {
      ax = t < 37.9 ? lerp(880, 690, eo(pr(t, 37.3, 37.9))) : 690;
      exp = t < 44.3 ? { eyes: 'pop', brows: 'worried', mouth: 'o' } : { eyes: 'pop', brows: 'up', mouth: 'yell' };
      hands = { L: [ax - 70, hy + 300], R: [ax + 110, hy + 220] };
    }
    person2(FG, stand('aryan', ax, 3000, 1.1, t, { exp, look, hands, sweat: t > 2.4 }), 2000);
    if (t < 1.2) for (const [h] of [[0.25], [0.65], [1.05]]) if (t > h && t < h + 0.25) wtext(FX, 'धड़!', 1080, 2150 - 60 * pr(t, h, h + 0.25), { size: 70, weight: 700, col: K.note, seed: 21 + h * 10, outline: 8, p: 1 - pr(t, h + 0.1, h + 0.25) });
    if (t > 2.45 && t < 2.9) wtext(FX, 'धड़ाम!', 1230, 2250, { size: 110, weight: 700, col: K.red, seed: 29, outline: 10 });
    if (t > 44.45 && t < 45.1) wtext(FX, 'धड़ाम!', 1230, 2250, { size: 110, weight: 700, col: K.red, seed: 29, outline: 10 });
    vig = 0.3;
  } else if (set === 'lab') {
    drawLab(t);
    const awake = t > 9.8, k = 1.1, gy = 2900, rhy = gy - AH * k;
    person2(PE, stand('robot', 11300, gy, k, t, { panel: !awake, cable: !awake, exp: awake ? { eyes: 'open', brows: 'flat', mouth: t > 10.3 ? 'smile' : 'small' } : { eyes: 'closed', brows: 'flat', mouth: 'flat' }, look: [0, 0], hands: { L: [11220, rhy + 330], R: [11380, rhy + 330] } }), 4000);
    if (t < 7.4) {
      const ahy = gy - AH * k, scan = t > 5.2 && t < 7.2;
      const arms = person2(FG, stand('aryan', 10650, gy, k, t, { exp: { eyes: 'half', brows: 'flat', mouth: 'small' }, look: [1, -0.2], hands: { L: [10720, ahy + 260], R: [10860, ahy + 70] } }), 2000);
      const [hx, hyy] = arms.R;
      part(FG, rrect(hx - 20, hyy - 50, hx + 40, hyy + 20, 10), { col: K.steelD, p: 1, seed: 700 }, { w: 3, col: K.ink, seed: 701 });   // the scanner
      if (scan) { const sy2 = rhy - 40 + 90 * (0.5 + 0.5 * Math.sin(t * 6)); poly(GLOW, [[hx + 40, hyy - 20], [11250, sy2 - 70], [11350, sy2 + 70]], K.cyan, 0.45, { seed: 702 }); line(FX, [[11240, sy2], [11360, sy2]], { w: 5, col: K.cyan, seed: 703 }); }
      if (scan) wtext(FX, 'FACE SCAN', 11300, rhy - 160, { size: 46, weight: 700, col: K.cyan, seed: 704, tilt: 0, outline: 6 });
    }
    if (awake && t < 10.4) for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, r = 80 + 200 * pr(t, 9.8, 10.4); line(FX, [[11300 + Math.cos(a) * r, rhy + Math.sin(a) * r], [11300 + Math.cos(a) * (r + 50), rhy + Math.sin(a) * (r + 50)]], { w: 6, col: K.cyan, p: 1 - pr(t, 10.0, 10.4), seed: 710 + i }); }
    vig = 0.3;
  } else if (set === 'fp') {
    drawFP(t);
    vig = 0.35;
  } else if (set === 'bed') {
    drawBed(t);
    const joy = t >= 15.5, x = 2950, hy = 2050;
    let exp = { eyes: 'closed', brows: 'flat', mouth: 'o' }, hands = { L: [x - 110, 2330], R: [x + 130, 2320] };
    if (joy) { exp = { eyes: 'closed', brows: 'up', mouth: 'open' }; hands = { L: [x - 150, hy - 150], R: [x + 150, hy - 160] }; }
    if (!joy) {   // the robot leaves for office: bag, ID card, a wave
      const rk = 0.88, rgy = 2600, rhy = rgy - AH * rk, rx = lerp(3560, 3660, pr(t, 12.4, 13.6));
      person2(PE, stand('robot', rx, rgy, rk, t, { idcard: 1, bag: 1, exp: { eyes: 'open', brows: 'flat', mouth: 'smile' }, look: [-1, 0], hands: { L: [rx - 70, rhy + 320], R: [rx + 90, rhy - 30 + 25 * Math.sin(t * 12)] } }), 4000);
    }
    const arms = person2(FG, seat('aryan', x, t, { hy, exp, hands }), 2000);
    drawBlanket(FG, t);
    if (joy) phoneSmall(FG, arms.R[0], arms.R[1] - 50, 1, true, 140);
    if (!joy) for (let i = 0; i < 3; i++) { const u = (t * 0.6 + i / 3) % 1; wtext(FX, 'Z', x + 90 + u * 120, hy - 80 - u * 200, { size: 50 + 30 * u, weight: 700, col: K.navy, p: Math.sin(Math.PI * u), seed: 160 + i }); }
    if (!joy) wtext(FX, 'बाय!', 3590, 1790, { size: 54, weight: 700, col: K.white, seed: 165, outline: 8, tilt: 0 });
    if (joy) for (let i = 0; i < 18; i++) { const u = ((t - 15.5) * 0.9 + hash(i * 3.7)) % 1; dab(FX, x - 400 + hash(i * 1.9) * 800, hy - 400 + u * 700, 12, { col: ['#e2412f', '#f5c63c', '#3fa39a', '#ee8ea4'][i % 4], p: 1, seed: 170 + i }); }
    vig = 0.18;
  } else if (set === 'phone') {
    const mode = t < 20 ? 'msg' : t < 30 ? 'call' : 'app';
    const top = drawPhone(t, mode);
    if (mode === 'call') {
      const shock = t > 24.8, wave = t > 27.8;
      person2(PE, bust('maa', 6720, 2060, 1.35, t, { L: 420, exp: { eyes: shock ? 'pop' : 'open', brows: shock ? 'up' : 'flat', mouth: shock ? (talking(t, 24.9, 27.6) === 'open' ? 'open' : 'o') : 'smile' }, look: wave ? [1, 0] : [0, 0] }), 2200);
      const bob = 12 * Math.sin(t * 8);
      person2(FG, bust('robot', 7090, 2150, 1.05, t, { L: 330, exp: { eyes: 'open', brows: 'flat', mouth: wave ? 'grin' : (q2(t) * 4 % 1 < 0.5 ? 'chew' : 'small') }, look: wave ? [0, 0] : [-0.6, 0.6], hands: { L: [7020, 2440], R: wave ? [7200, 1990 + 25 * Math.sin(t * 14)] : [7150, 2420 + bob] } }), 2400);
      part(FG, rect(6552, 2440, 7248, 2798), { col: K.wood, p: 1, seed: 255 }, { w: 4, col: K.ink, seed: 256 });   // the dining table
      for (const [px, py] of [[6720, 2520], [7090, 2520]]) { part(FG, smooth(handCircle(px, py, 80, 257 + px, 0, 24).map(([a, b]) => [a, py + (b - py) * 0.35]), 2), { col: K.steelL, p: 1, seed: 258 + px }, { w: 3, col: K.ink, seed: 259 + px }); dab(FG.l, px - 20, py - 4, 22, { col: '#d9a35b', p: 1, seed: 260 + px }); dab(FG.l, px + 28, py, 14, { col: K.orange, p: 1, seed: 261 + px }); }
      part(FG, rect(7090, 1740, 7232, 1910), { col: '#4b5a7e', p: 1, seed: 262 }, { w: 4, col: K.white, seed: 263 });   // Aryan's own little window
      person2(FG, bust('aryan', 7161, 1816, 0.34, t, { L: 300, exp: { eyes: t > 26 ? 'pop' : 'open', brows: t > 26 ? 'up' : 'flat', mouth: t > 26 ? 'o' : 'smile' } }), 2600);
      if (wave) wtext(FX, 'हाय!', 6990, 2010, { size: 56, weight: 700, col: K.white, seed: 264, outline: 8, tilt: 0 });
    }
    if (mode === 'app' && t < 32.6) person2(PE, bust('robot', 6900, 2120, 0.95, t, { L: 120, exp: { eyes: 'open', brows: 'flat', mouth: 'smile' } }), 2800);
    top();
    vig = 0.25;
  } else if (set === 'sofa') {
    drawSofaSet(t);
    const x = 4690, hy = 2060;
    let exp = { eyes: 'open', brows: 'down', mouth: q2(t) * 6 % 1 < 0.5 ? 'smile' : 'grin' }, hands = { L: [x - 40, 2330], R: [x + 40, 2330] }, look = [-0.8, 0];
    const calling = t >= 22.6;
    if (calling) { exp = { eyes: 'open', brows: 'flat', mouth: 'smile' }; hands = { L: [x - 90, 2350], R: [x + 60, hy + 215] }; look = [0.2, 1]; }
    if (t >= 29.6) { exp = { eyes: 'pop', brows: 'up', mouth: 'yell' }; look = [0, 0]; }
    if (t < 22.6) {   // the robot stands behind, watching
      const sneaky = t >= 21.2, rk = 1.0, rhy = 2600 - AH * rk;
      person2(PE, stand('robot', 5350, 2600, rk, t, { exp: { eyes: sneaky ? 'half' : 'open', brows: sneaky ? 'down' : 'flat', mouth: sneaky ? 'smirk' : 'small' }, look: [-1, 0.2], hands: { L: [5280, rhy + 320], R: [5420, rhy + 320] } }), 4000);
    }
    const arms = person2(PE, seat('aryan', x, t, { hy, exp, look, hands, sweat: t >= 29.6 }), 2000);
    drawSofaFront(PROP, t);
    if (!calling) controller(FG, x, 2340);
    else phoneSmall(FG, arms.R[0], arms.R[1] - 40, 1.1, true, 360);
    vig = 0.18;
  } else if (set === 'station') {
    drawStation(t);
    const ox = 9110, ohy = 2500, ok = 1.35;
    const stare = t >= 52.8, ask = t >= 50.4 && t < 52.8;
    person2(PE, seat('officer', ox, t, { hy: ohy, k: ok, exp: stare ? { eyes: 'half', brows: 'angry', mouth: talking(t, 53.0, 59.0) } : ask ? { eyes: 'open', brows: 'down', mouth: talking(t, 50.6, 51.3) } : { eyes: 'open', brows: 'flat', mouth: 'flat' }, look: [-1, 0],
      hands: ask ? { L: [ox - 290, ohy + 250], R: [ox + 100, ohy + 400] } : stare && t > 56.2 ? { L: [ox - 280, ohy + 200], R: [ox + 100, ohy + 400] } : { L: [ox - 110, ohy + 400], R: [ox + 110, ohy + 400] } }), 3000);
    drawStationDesk(PROP, t);
    const mtop = monitorContent(t);
    person2(FG, bust('robot', 9640, 2700, 0.16, t, { L: 300, exp: { eyes: 'open', brows: 'flat', mouth: 'smile' } }), 4400);
    const ax = 8560, agy = 3150, ak = 1.15, ahy = agy - AH * ak;
    const pockets = t >= 51.6;
    const scared = t >= 52.8;
    const ast = stand('aryan', ax, agy, ak, t, { pockets, sweat: true, look: [1, 0],
      hands: pockets && !scared ? { L: [ax - 130, ahy + 300], R: [ax + 130, ahy + 300] } : scared ? { L: [ax - 70, ahy + 40], R: [ax + 70, ahy + 40] } : { L: [ax + 10, ahy + 190], R: [ax + 150, ahy + 290] },
      exp: t >= 59.1 ? { eyes: 'pop', brows: 'up', mouth: 'wavy' } : scared ? { eyes: 'pop', brows: 'up', mouth: 'o' } : pockets ? { eyes: 'pop', brows: 'worried', mouth: 'wavy' } : { eyes: 'open', brows: 'worried', mouth: talking(t, 45.8, 50.2) } });
    person2(FG, ast, 2000);
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
