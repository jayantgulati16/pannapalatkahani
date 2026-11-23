// असली भक्ति (भाग 2/2) — Ep 9, posts 26 Nov 2026. Vertical 1080×1920, 24 fps, ~71 s. Clean cartoon, expressive faces.
// Story by Jayant (22 Nov). Cold open: the temple doors open in gold light — Bhagwan Vishnu (blue, Sheshnaag hood) holds the SAME lotus
// Raghav sold that morning. Recap (पिछले भाग में). "How is it in your hand?" Flashback: the merchant glows (clues circled: pitambar, tilak,
// conch flag) and becomes Vishnu: "That merchant was none other than me." "But I left your puja…" — hand on his head: "A flower offered
// while leaving Maa in pain never reaches me; serving Maa is my puja too." He vanishes; the lotus stays. Maa, healthy, lights the diya.
// Next morning the whole pond is full of lotuses. Raghav + Maa offer a lotus at the brass murti. "सेवा ही सबसे बड़ी पूजा है।"
import { layer, clear, line, fill, dab, handCircle, smooth, CAM, BOIL, WMUL, STYLE, W, H, sx, sy } from './crayon.js';
import { group, clearGroup, part, tube } from './rig.js';
import { clamp, lerp, hash, ss, eio, eo, ei } from '/core/lib.js';
STYLE.clean = true;

export const DUR = 73.6;
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
  { t0: 0.0, t1: 2.4, text: '“राघव…”', who: 'P', vo: 'p0', vt: 0.2 },
  { t0: 6.1, t1: 9.9, text: '“ये फूल…|ये तो मैंने आज सुबह बेच दिया था!”', who: 'R', vo: 'r1', vt: 6.2 },
  { t0: 10.2, t1: 17.8, text: 'माँ की जान बचाने के लिए|राघव ने भगवान का फूल|एक व्यापारी को बेच दिया था।', who: 'N', vo: 'n1', vt: 10.3 },
  { t0: 18.1, t1: 21.1, text: '“प्रभु…|ये आपके हाथ में कैसे?”', who: 'R', vo: 'r2', vt: 18.2 },
  { t0: 24.5, t1: 29.5, text: '“वो व्यापारी कोई और नहीं…|मैं ही था, राघव।”', who: 'P', vo: 'p1', vt: 24.6 },
  { t0: 29.6, t1: 35.0, text: '“पर प्रभु, मैंने तो आपकी पूजा छोड़ दी…|आप नाराज़ नहीं?”', who: 'R', vo: 'r3', vt: 29.7 },
  { t0: 35.1, t1: 43.4, text: '“माँ को तड़पता छोड़कर चढ़ाया फूल|मुझ तक नहीं पहुँचता…|माँ की सेवा भी मेरी ही पूजा है।”', who: 'P', vo: 'p2', vt: 35.2 },
  { t0: 47.6, t1: 52.9, text: '“राघव, आ जा…|दिया जला दिया।”', who: 'A', vo: 'a1', vt: 47.7 },
  { t0: 53.6, t1: 59.9, text: 'और अगली सुबह…|पूरा तालाब कमलों से भर गया।', who: 'N', vo: 'n2', vt: 53.7 },
  { t0: 62.1, t1: 67.9, text: 'सेवा ही|सबसे बड़ी पूजा है।', who: 'N', vo: 'n3', vt: 62.2 },
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
// Expressive face (23 Nov, Jayant: "cartoon mein emotions ho"): almond eyes with iris + highlights, lids that droop, thick brows,
// filled mouths, blush, real tear streams. eyes: open | sad | teary | half | calm (closed, peaceful) | closed | squeeze (crying hard) | happy | pop | shut(=squeeze)
// brows: flat | worried | sad | angry | up | calm. mouth: small | smile | grin | open | o | sad | cry | flat | wavy | knowing | yell
function face(C, tp, s, sd) {
  const e = s.exp, lk = s.look || [0, 0], ey = -2, skinC = s.skinC || K.skin, ink = K.ink, lidCol = s.lidCol || ink;
  const eyes = e.eyes === 'shut' ? 'squeeze' : e.eyes, fem = s.fem;
  const W = 13, Hh = 9.5;
  for (const sg of [-1, 1]) {
    const cx = sg * 20, X = u => cx + sg * u;   // u > 0 = outer side
    const alm = [[X(-W), ey + 1], [X(-W * 0.45), ey - Hh], [X(W * 0.35), ey - Hh * 1.05], [X(W), ey - Hh * 0.15], [X(W * 0.55), ey + Hh * 0.75], [X(-W * 0.4), ey + Hh * 0.8]];
    if (eyes === 'calm' || eyes === 'closed') {
      line(C.l, tp(smooth([[X(-W), ey], [cx, ey + 5], [X(W), ey]], 5, false)), { w: 5, col: lidCol, seed: sd + 30 + sg });
      if (fem) line(C.l, tp([[X(W - 1), ey], [X(W + 6), ey - 3]]), { w: 3.5, col: lidCol, seed: sd + 31 + sg });
    } else if (eyes === 'happy') {
      line(C.l, tp(smooth([[X(-W), ey + 3], [cx, ey - 7], [X(W), ey + 3]], 5, false)), { w: 5.5, col: lidCol, seed: sd + 30 + sg });
    } else if (eyes === 'squeeze') {
      line(C.l, tp([[X(-W), ey - 6], [X(W * 0.6), ey + 1], [X(-W * 0.9), ey + 7]]), { w: 5.5, col: lidCol, seed: sd + 30 + sg });
    } else if (eyes === 'pop') {
      part(C, tp(handCircle(cx, ey, 14, sd + 26 + sg, 0, 18)), { col: K.white, p: 1, gap: 3, w: 5, seed: sd + 27 + sg }, { w: 4, col: ink, seed: sd + 28 + sg });
      dab(C.l, ...tp([[cx + lk[0] * 4, ey + lk[1] * 4]])[0], 4.5, { col: ink, p: 1, seed: sd + 32 + sg });
    } else {
      part(C, tp(smooth(alm, 4)), { col: K.white, p: 1, gap: 3, w: 5, seed: sd + 26 + sg }, null);
      const ic = tp([[cx + lk[0] * 5, ey + 1 + lk[1] * 3]])[0], kk = Math.abs(tp([[1, 0]])[0][0] - tp([[0, 0]])[0][0]);
      dab(C.l, ic[0], ic[1], 8.2 * kk, { col: s.iris || '#4a2c18', p: 1, gap: 2.5, w: 4, seed: sd + 32 + sg });
      dab(C.l, ic[0], ic[1], 4.6 * kk, { col: '#140b07', p: 1, gap: 2, w: 3, seed: sd + 33 + sg });
      dab(C.l, ic[0] + 2.6 * kk, ic[1] - 3.2 * kk, 2.6 * kk, { col: K.white, p: 1, gap: 1.2, w: 2.5, seed: sd + 34 + sg });
      dab(C.l, ic[0] - 2.4 * kk, ic[1] + 2.6 * kk, 1.3 * kk, { col: K.white, p: 1, gap: 1, w: 2, seed: sd + 35 + sg });
      // lids: sad = outer side droops, half = flat heavy lid, teary = sad + wet line
      let lid = null;
      if (eyes === 'sad' || eyes === 'teary') lid = [[X(-W - 2), ey - Hh * 1.0], [X(W + 2), ey - Hh * 0.4]];
      if (eyes === 'half') lid = [[X(-W - 2), ey - Hh * 0.15], [X(W + 2), ey - Hh * 0.15]];
      if (lid) {
        part(C, tp([[X(-W - 4), ey - Hh - 8], [X(W + 4), ey - Hh - 8], lid[1], lid[0]]), { col: skinC, p: 1, gap: 6, w: 8, seed: sd + 36 + sg }, null);
        line(C.l, tp(lid), { w: 5.5, col: lidCol, seed: sd + 37 + sg });
      } else line(C.l, tp(smooth(alm.slice(0, 4), 4, false)), { w: 5.5, col: lidCol, seed: sd + 37 + sg });
      if (eyes === 'teary') { line(C.l, tp(smooth([[X(-W * 0.6), ey + Hh * 0.55], [cx, ey + Hh * 0.8], [X(W * 0.5), ey + Hh * 0.6]], 4, false)), { w: 4, col: '#bfe6ff', seed: sd + 38 + sg }); dab(C.l, ic[0] - 2 * kk, ic[1] - 1 * kk, 1.8 * kk, { col: K.white, p: 1, seed: sd + 39 + sg }); }
      if (fem) line(C.l, tp([[X(W - 1), ey - Hh * 0.2], [X(W + 7), ey - Hh * 0.8]]), { w: 3.5, col: lidCol, seed: sd + 31 + sg });
    }
    // brows: [inner y, outer y]
    const bw = { flat: [-25, -25], worried: [-33, -22], sad: [-33, -21], angry: [-19, -30], up: [-35, -33], calm: [-27, -26], down: [-20, -26] }[e.brows || 'flat'] || [-25, -25];
    part(C, tp(smooth([[sg * 7, bw[0] + 2], [sg * 18, (bw[0] + bw[1]) / 2 - 3], [sg * 31, bw[1] + 1], [sg * 30, bw[1] + 4], [sg * 18, (bw[0] + bw[1]) / 2 + 2], [sg * 7, bw[0] + 6]], 3)), { col: s.browCol || '#2a1d18', p: 1, gap: 3, w: 4, seed: sd + 40 + sg }, null);
  }
  line(C.l, tp(smooth([[-2, 6], [3, 13], [-3, 15]], 4, false)), { w: 3, col: '#9a5f45', seed: sd + 44 });   // nose
  if (['happy', 'squeeze', 'teary'].includes(eyes) || ['grin', 'cry'].includes(e.mouth) || s.blush) for (const sg of [-1, 1]) dab(C.l, ...tp([[sg * 31, 15]])[0], 8 * Math.abs(tp([[1, 0]])[0][0] - tp([[0, 0]])[0][0]), { col: '#ef8a8a', p: 0.45, seed: sd + 45 + sg, sq: 0.6 });
  const m = e.mouth, MO = { col: '#6b2323', p: 1, gap: 3, w: 5, seed: sd + 50 }, ML = { w: 4, col: ink, seed: sd + 51 };
  if (m === 'open') part(C, tp(smooth([[-11, 24], [11, 24], [8, 33], [0, 35], [-8, 33]], 3)), MO, ML);
  else if (m === 'yell') part(C, tp(smooth([[-15, 20], [15, 20], [12, 37], [0, 41], [-12, 37]], 3)), MO, ML);
  else if (m === 'cry') { part(C, tp(smooth([[-17, 31], [-9, 23], [0, 25], [9, 23], [17, 31], [11, 39], [0, 41], [-11, 39]], 3)), MO, ML); part(C, tp(smooth([[-8, 37], [0, 34], [8, 37], [0, 40]], 3)), { col: '#e0767a', p: 1, seed: sd + 52 }, null); line(C.l, tp([[-8, 25.5], [8, 25.5]]), { w: 3.5, col: K.white, seed: sd + 53 }); }
  else if (m === 'grin') { part(C, tp(smooth([[-15, 21], [15, 21], [9, 32], [0, 35], [-9, 32]], 3)), MO, ML); line(C.l, tp([[-11, 23.5], [11, 23.5]]), { w: 4, col: K.white, seed: sd + 54 }); dab(C.l, ...tp([[0, 31]])[0], 4, { col: '#e0767a', p: 1, seed: sd + 55 }); }
  else if (m === 'o') part(C, tp(handCircle(0, 28, 6.5, sd + 56, 0, 14)), MO, ML);
  else if (m === 'flat') line(C.l, tp([[-9, 27], [9, 27]]), { w: 4, col: ink, seed: sd + 57 });
  else if (m === 'wavy') line(C.l, tp([[-12, 28], [-6, 24], [0, 29], [6, 24], [12, 28]]), { w: 4, col: ink, seed: sd + 57 });
  else if (m === 'sad') { line(C.l, tp(smooth([[-12, 31], [0, 25], [12, 31]], 5, false)), { w: 4.5, col: ink, seed: sd + 58 }); line(C.l, tp([[-4, 34], [4, 34]]), { w: 2.5, col: '#9a5f45', seed: sd + 59 }); }
  else if (m === 'smile') line(C.l, tp(smooth([[-13, 22], [0, 31], [13, 22]], 5, false)), { w: 4.5, col: ink, seed: sd + 58 });
  else if (m === 'knowing') line(C.l, tp(smooth([[-12, 25], [2, 30], [14, 21]], 5, false)), { w: 4.5, col: ink, seed: sd + 58 });
  else line(C.l, tp(smooth([[-6, 26], [0, 29], [6, 26]], 5, false)), { w: 4, col: ink, seed: sd + 58 });
  if (s.tears) {   // tear streams down both cheeks + falling drops
    const sq = eyes === 'squeeze';
    for (const sg of [-1, 1]) {
      const x0 = sg * (sq ? 22 : 24), y0 = ey + 8;
      line(C.l, tp(smooth([[x0, y0], [x0 + sg * 3, y0 + 18], [x0 + sg * 1, y0 + 34], [x0 + sg * 4, y0 + 46]], 4, false)), { w: 5, col: '#9fd8ff', p: 0.95, seed: sd + 60 + sg });
      const u = ((s.t || 0) * 1.3 + (sg > 0 ? 0.45 : 0)) % 1;
      dab(C.l, ...tp([[x0 + sg * 4, y0 + 48 + 40 * u]])[0], 4.5 * Math.abs(tp([[1, 0]])[0][0] - tp([[0, 0]])[0][0]), { col: '#9fd8ff', p: 1 - u, seed: sd + 62 + sg });
    }
  }
}

// ——— layers ———
const BG = { f: layer(), l: layer() }, GLOW = layer(), PE = group(), PROP = group(), FG = group(), FX = layer(), SUBK = layer(), SUBT = layer();

// ——— shots: [t0, t1, set, cam0, cam1] ———
const SHOTS = [
  [0.0, 3.6, 'steps', [1000, 2300, 0.95], [1000, 2300, 1.02]],     // HOOK (continues भाग 1): the doors glow, a voice from the light: "राघव…"
  [3.6, 6.0, 'steps', [1000, 2290, 1.02], [1005, 2300, 1.12]],     // प्रकट: the light swells, a flash — Bhagwan appears
  [6.0, 10.0, 'steps', [1010, 2330, 1.22], [1010, 2320, 1.32]],    // the SAME lotus in his hand: "ये फूल…" + title असली भक्ति · भाग 2
  [10.0, 14.0, 'hut', [8440, 2420, 1.45], [8440, 2420, 1.55]],      // पिछले भाग में: Maa's fever, his tears
  [14.0, 18.0, 'pond', [3680, 2420, 1.3], [3680, 2420, 1.38]],     // … he sold the lotus to the merchant
  [18.0, 21.2, 'steps', [880, 2400, 2.0], [880, 2400, 2.15]],      // "ये आपके हाथ में कैसे?"
  [21.2, 29.6, 'reveal', [3700, 2430, 1.0], [3720, 2420, 1.06]],   // flashback: the merchant glows… and becomes Vishnu
  [29.6, 34.6, 'steps', [960, 2300, 1.4], [960, 2300, 1.5]],       // "आप नाराज़ नहीं?"
  [34.6, 43.6, 'steps', [1000, 2260, 1.12], [1000, 2250, 1.22]],   // the blessing — hand on his head
  [43.6, 46.6, 'steps', [1000, 2300, 1.0], [1000, 2300, 1.04]],    // Bhagwan vanishes into light; the lotus stays in Raghav's hands
  [46.6, 53.1, 'hutday', [8330, 2380, 1.15], [8330, 2380, 1.22]],  // Maa, healthy, lights the diya
  [53.1, 60.1, 'pondfull', [3050, 2470, 1.0], [3050, 2470, 1.1]],  // next morning: the whole pond full of lotuses
  [60.1, 69.1, 'mandir', [5560, 2430, 0.92], [5580, 2430, 1.0]],   // Raghav + Maa offer a lotus together
  [69.1, 73.61, 'mandir', [5720, 2520, 1.3], [5720, 2520, 1.36]],  // the lotus at the feet → end card
];
function shotAt(t) { return SHOTS.find(s => t >= s[0] && t < s[1]) || SHOTS[SHOTS.length - 1]; }
const HITS = [[4.1, 8], [23.9, 10], [44.2, 6]];
function shake(t) {
  let x = 0, y = 0;
  for (const [h, a] of HITS) { const d = t - h; if (d < 0 || d > 0.5) continue; const e = a * Math.exp(-d / 0.08); x += (hash(BOIL.step * 3.1 + h) - .5) * 2 * e; y += (hash(BOIL.step * 5.7 + h) - .5) * 2 * e; }
  return [x, y];
}

// ——— characters ———
const SPEC = {
  raghav: { top: K.saffron, len: 330, bottom: '#efe6d0', shoe: K.skinO, hair: 'short', skin: K.skinO, gamchha: '#c9483a' },
  amma: { fem: 1, top: '#e6dcc6', trim: '#5f86b0', len: 430, bottom: '#e6dcc6', shoe: K.woodD, hair: 'bun', hairCol: '#b9b4ae', bindi: 1, skin: K.skinM, pallu: '#d4c7aa' },
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
  face(C, tp, { ...s, look: s.look || [0, 0], browCol: P0.browCol, skinC, fem: P0.fem, iris: P0.iris }, sd);
  if (P0.beard) part(C, tp(smooth([[-50, 0], [-46, 38], [-26, 70], [0, 82], [26, 70], [46, 38], [50, 0], [38, 22], [14, 34], [0, 36], [-14, 34], [-38, 22]], 4)), { col: P0.beard, p: 1, seed: sd + 64 }, O(3, sd + 65));
  if (P0.moustache) part(C, tp(smooth([[-28, 14], [0, 6], [28, 14], [22, 22], [0, 16], [-22, 22]], 4)), { col: P0.moustache, p: 1, seed: sd + 66 }, O(3, sd + 67));
  if (P0.glasses) { for (const sg of [-1, 1]) line(C.l, tp(handCircle(sg * 19, -2, 15, sd + 68 + sg, 0.08, 22)), { w: 3.5, col: K.ink, seed: sd + 69 + sg }); line(C.l, tp([[-4, -3], [4, -3]]), { w: 3, col: K.ink, seed: sd + 71 }); }
  if (P0.bindi) dab(C.l, ...P(0, -22), 4 * k, { col: K.red, p: 1, seed: sd + 72 });
  if (P0.tilak === 'dot') dab(C.l, ...P(0, -26), 4 * k, { col: K.red, p: 1, seed: sd + 73 });
  if (P0.tilak === 'v') { for (const sg of [-1, 1]) line(C.l, tp([[sg * 4, -18], [sg * 10, -42]]), { w: 4, col: K.white, seed: sd + 74 + sg }); line(C.l, tp([[0, -20], [0, -40]]), { w: 4, col: K.red, seed: sd + 76 }); }
  if (s.patti) part(C, tp(rrect(-34, -44, 34, -26, 6)), { col: K.white, p: 1, seed: sd + 77 }, O(3, sd + 78));
  if (s.sweat) dab(C.l, ...P(58, -24 + 18 * ((s.t * 1.4) % 1)), 7 * k, { col: K.water, p: 1, seed: sd + 79 });
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
  return { kind, t, x, gy, k, hy, seated: 1, squat: o.squat, kneel: o.kneel, feet: { L: [x - 40, gy], R: [x + 40, gy] }, hands: o.hands || { L: [x - 90 * k, hy + 300 * k], R: [x + 90 * k, hy + 300 * k] }, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'smile' }, look: o.look || [0, 0], sweat: o.sweat, tears: o.tears, patti: o.patti, blush: o.blush };
}
function bust(kind, x, hy, k, t, o = {}) { return { kind, t, x, hy, k, bust: 1, bustL: o.L || 300, hands: o.hands, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'smile' }, look: o.look || [0, 0], patti: o.patti, sweat: o.sweat, tears: o.tears }; }
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

// ——— Bhagwan Vishnu: mode 'deva' (living, blue, golden aura) | 'murti' (black-stone idol, silver eyes, real cloth + garlands) ———
// Four arms: upper L shankh, upper R Sudarshan chakra, lower L gada, lower R padma (the lotus = the story's lotus). Calm, kind, no comedy.
function vishnu(C, x, hy, k, mode, t, o = {}) {
  const P = (dx, dy) => [x + dx * k, hy + dy * k], tp = pts => pts.map(([a, b]) => P(a, b));
  const murti = mode !== 'deva';
  const SK = { murti: ['#2c2f3e', '#22242f'], marble: ['#f2ede3', '#cfc6b6'], brass: ['#c99a3a', '#9f7522'], deva: ['#5b8fd8', '#477ac2'] }[mode];
  const skin = SK[0], skinD = SK[1], gold = K.gold, goldL = K.goldL;
  const O = (w, q) => ({ w, col: K.ink, seed: q, p: 0.95 }), F = (col, q) => ({ col, p: 1, gap: 6, w: 8, seed: q });
  WMUL.k = clamp(Math.sqrt(k), 0.45, 1.4);
  if (o.shesh) {   // Sheshnaag: five hooded heads fanning over the crown
    const hc = [0, -70];
    part(C, tp(smooth([[-150, 160], [-205, 10], [-200, -150], [-120, -270], [0, -300], [120, -270], [200, -150], [205, 10], [150, 160]], 5)), F('#3d6b4b', 860), O(5, 861));
    part(C, tp(smooth([[-110, 140], [-150, 0], [-140, -130], [-80, -220], [0, -240], [80, -220], [140, -130], [150, 0], [110, 140]], 5)), F('#d8cf8c', 862), null);
    for (let i = 0; i < 5; i++) { const a = Math.PI * (-0.92 + 0.21 * i), hx = Math.cos(a) * 190, hy2 = hc[1] + Math.sin(a) * 210;
      part(C, tp(smooth([[hx - 34, hy2 + 10], [hx - 28, hy2 - 22], [hx, hy2 - 34], [hx + 28, hy2 - 22], [hx + 34, hy2 + 10], [hx, hy2 + 26]], 4)), F('#4f8a5f', 863 + i), O(4, 870 + i));
      for (const sg of [-1, 1]) dab(C.l, ...P(hx + sg * 13, hy2 - 6), 5 * k, { col: '#ffd23a', p: 1, seed: 880 + i * 2 + sg }); }
    for (let i = 0; i < 6; i++) line(C.l, tp(smooth([[-120 + i * 48, 120], [-110 + i * 44, -60], [-70 + i * 28, -200]], 4, false)), { w: 3, col: '#a89a56', p: 0.7, seed: 890 + i });
  }
  if (!murti && o.aura !== 0) {   // golden aura + halo ring
    sglow(x, hy + 160 * k, 520 * k, '#ffe08a', 0.75 * (o.aura ?? 1), 900);
    line(C.l, tp(handCircle(0, -40, 150, 901, 0, 48)), { w: 7, col: goldL, seed: 901 });
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + t * 0.15; line(C.l, tp([[Math.cos(a) * 160, -40 + Math.sin(a) * 160], [Math.cos(a) * 196, -40 + Math.sin(a) * 196]]), { w: 5, col: goldL, p: 0.8, seed: 902 + i }); }
  }
  // hair falling behind the shoulders
  part(C, tp(smooth([[-56, -24], [-74, 40], [-86, 140], [-58, 160], [-44, 70], [44, 70], [58, 160], [86, 140], [74, 40], [56, -24]], 4)), F('#1c1820', 910), O(4, 911));
  // upper arms (raised): shankh (L), chakra (R)
  const armU = (sg) => { const sh = P(sg * 64, 92), el = P(sg * 150, 70), hd = P(sg * 158, -20);
    part(C, tube([sh, el], 34 * k, 28 * k), F(skin, 912 + sg), O(4, 914 + sg)); part(C, tube([el, hd], 28 * k, 24 * k), F(skin, 916 + sg), O(4, 918 + sg));
    line(C.l, [P(sg * 118, 66), P(sg * 124, 98)], { w: 9 * k, col: gold, seed: 920 + sg }); line(C.l, [P(sg * 150, 10), P(sg * 168, 14)], { w: 8 * k, col: gold, seed: 922 + sg });
    part(C, handCircle(...hd, 17 * k, 924 + sg, 0, 18), F(skin, 925 + sg), O(4, 926 + sg)); return hd; };
  const hl = armU(-1), hr = armU(1);
  // shankh
  const sp = (dx, dy) => [hl[0] + dx * k, hl[1] + dy * k];
  part(C, smooth([sp(-36, -6), sp(-22, -40), sp(6, -52), sp(30, -30), sp(26, 2), sp(-6, 14)], 5), F('#fbf6ea', 930), O(4, 931));
  line(C.l, smooth([sp(-18, -14), sp(-6, -34), sp(14, -36), sp(16, -18), sp(2, -12)], 4, false), { w: 3, col: '#b9a98a', seed: 932 });
  // Sudarshan chakra, spinning
  const cc = [hr[0] + 6 * k, hr[1] - 48 * k], R = 44 * k;
  part(C, handCircle(cc[0], cc[1], R, 933, 0, 30), F(goldL, 934), O(4, 935));
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + t * 3; line(C.l, [[cc[0] + Math.cos(a) * R * 0.3, cc[1] + Math.sin(a) * R * 0.3], [cc[0] + Math.cos(a) * R * 0.92, cc[1] + Math.sin(a) * R * 0.92]], { w: 3.5, col: '#c98f22', seed: 936 + i }); }
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + t * 3; line(C.l, [[cc[0] + Math.cos(a) * R, cc[1] + Math.sin(a) * R], [cc[0] + Math.cos(a + 0.12) * R * 1.22, cc[1] + Math.sin(a + 0.12) * R * 1.22]], { w: 4, col: murti ? gold : K.orange, seed: 950 + i }); }
  dab(C.l, cc[0], cc[1], 9 * k, { col: K.red, p: 1, seed: 970 });
  // pitambar dhoti, gold border + belt
  part(C, tp(smooth([[-70, 250], [70, 250], [90, 400], [82, 560], [22, 570], [0, 470], [-22, 570], [-82, 560], [-90, 400]], 3)), F(K.pitambar, 971), O(5, 972));
  for (const dx of [-30, 0, 30]) line(C.l, tp(smooth([[dx, 280], [dx + 6, 420], [dx * 0.6, 540]], 4, false)), { w: 3, col: '#c98f22', seed: 973 + dx });
  line(C.l, tp([[-84, 548], [-22, 556]]), { w: 7, col: K.red, seed: 976 }); line(C.l, tp([[22, 556], [84, 548]]), { w: 7, col: K.red, seed: 977 });
  for (const sg of [-1, 1]) part(C, tp(smooth([[sg * 14, 566], [sg * 58, 566], [sg * 64, 590], [sg * 10, 592]], 3)), F(skin, 978 + sg), O(4, 980 + sg));
  for (const sg of [-1, 1]) line(C.l, tp([[sg * 16, 562], [sg * 56, 562]]), { w: 6, col: gold, seed: 982 + sg });
  // torso, janeu, necklaces, kaustubha
  part(C, tp(smooth([[-20, 46], [20, 46], [66, 82], [74, 160], [66, 256], [-66, 256], [-74, 160], [-66, 82]], 3)), F(skin, 984), O(5, 985));
  part(C, tp(rect(-72, 244, 72, 270)), F(gold, 986), O(3, 987)); dab(C.l, ...P(0, 257), 10 * k, { col: K.red, p: 1, seed: 988 });
  line(C.l, tp(smooth([[-50, 76], [0, 170], [56, 250]], 4, false)), { w: 3.5, col: '#fffbe8', seed: 989 });
  line(C.l, tp(smooth([[-36, 64], [0, 108], [36, 64]], 5, false)), { w: 8, col: gold, seed: 990 });
  line(C.l, tp(smooth([[-46, 70], [0, 146], [46, 70]], 5, false)), { w: 6, col: gold, seed: 991 });
  dab(C.l, ...P(0, 150), 11 * k, { col: K.red, p: 1, seed: 992 }); dab(C.l, ...P(0, 150), 5 * k, { col: K.white, p: 1, seed: 993 });
  // vanamala: a long garland of leaves and flowers to the knees
  for (let i = 0; i <= 26; i++) { const u = i / 26, a = Math.PI * (0.06 + 0.88 * u), px = Math.cos(a) * 74, py = 70 + Math.sin(a) * 360; dab(C.l, ...P(px, py), (i % 3 === 1 ? 9 : 7) * k, { col: i % 3 === 1 ? (i % 2 ? K.red : '#fff3e0') : '#3f8f4a', p: 1, seed: 994 + i }); }
  // lower arms: gada (L), padma (R)
  const armL = (sg, hd) => { const sh = P(sg * 66, 100), el = P(sg * 98, 186); const H = P(...hd);
    part(C, tube([sh, el], 32 * k, 28 * k), F(skin, 1030 + sg), O(4, 1032 + sg)); part(C, tube([el, H], 28 * k, 24 * k), F(skin, 1034 + sg), O(4, 1036 + sg));
    line(C.l, [P(sg * 84, 140), P(sg * 98, 150)], { w: 9 * k, col: gold, seed: 1038 + sg }); line(C.l, [P(sg * 104, 236), P(sg * 118, 244)], { w: 8 * k, col: gold, seed: 1040 + sg }); return H; };
  if (!o.bless) part(C, tube([P(-122, 300), P(-128, 590)], 14 * k, 14 * k), F(gold, 1042), O(3, 1043));   // gada shaft
  if (!o.bless) part(C, tp(handCircle(-120, 280, 34, 1044, 0, 22)), F(goldL, 1045), O(4, 1046)); if (!o.bless) for (let i = 0; i < 3; i++) line(C.l, tp([[-150 + i * 30, 262], [-146 + i * 28, 300]]), { w: 3, col: '#c98f22', seed: 1047 + i });
  const gl = armL(-1, o.bless || [-118, 246]);
  part(C, handCircle(...gl, 17 * k, 1050, 0, 18), F(skin, 1051), O(4, 1052));
  const pr_ = armL(1, o.lotusHand || [120, 250]);
  part(C, handCircle(...pr_, 17 * k, 1053, 0, 18), F(skin, 1054), O(4, 1055));
  if (o.lotus !== 0) lotus(C, pr_[0] + 4 * k, pr_[1] - 10 * k, 0.75 * k, 1056, murti ? 0 : 0.8);
  // neck, ears + kundal, head
  part(C, tp([[-14, 26], [14, 26], [15, 56], [-15, 56]]), F(skin, 1080), O(4, 1081));
  for (const sg of [-1, 1]) { part(C, tp(handCircle(sg * 54, 8, 12, 1082 + sg, 0, 16)), F(skin, 1084 + sg), O(4, 1086 + sg)); part(C, tp(smooth([[sg * 54, 18], [sg * 66, 34], [sg * 58, 56], [sg * 46, 34]], 4)), F(gold, 1088 + sg), O(3, 1090 + sg)); }
  part(C, tp(smooth([[-52, -10], [-50, 30], [-30, 54], [0, 60], [30, 54], [50, 30], [52, -10], [40, -44], [0, -56], [-40, -44]], 4)), F(skin, 1092), O(5, 1093));
  if (murti) for (const sg of [-1, 1]) { part(C, tp(smooth([[sg * 8, 0], [sg * 20, -10], [sg * 34, -4], [sg * 38, 4], [sg * 22, 10]], 4)), F(K.white, 1094 + sg), O(3, 1096 + sg)); dab(C.l, ...P(sg * 23, 0), 6.5 * k, { col: '#111', p: 1, seed: 1098 + sg }); dab(C.l, ...P(sg * 21, -2), 2.2 * k, { col: K.white, p: 1, seed: 1100 + sg }); }
  else for (const sg of [-1, 1]) {   // lotus-shaped eyes, half-lidded, gentle
    part(C, tp(smooth([[sg * 6, 2], [sg * 18, -6], [sg * 32, -4], [sg * 40, 0], [sg * 24, 7]], 4)), F(K.white, 1094 + sg), null);
    dab(C.l, ...P(sg * 21, 2 + (o.look || 0)), 6 * k, { col: '#2a1a14', p: 1, seed: 1098 + sg }); dab(C.l, ...P(sg * 19, 0), 2 * k, { col: K.white, p: 1, seed: 1100 + sg });
    part(C, tp([[sg * 4, -12], [sg * 42, -10], [sg * 40, -1], [sg * 6, -2]]), F(skin, 1102 + sg), null);
    line(C.l, tp(smooth([[sg * 6, -1], [sg * 22, -4], [sg * 41, 0]], 4, false)), { w: 4.5, col: K.ink, seed: 1104 + sg });
    line(C.l, tp([[sg * 39, 0], [sg * 46, -4]]), { w: 3, col: K.ink, seed: 1106 + sg });
  }
  for (const sg of [-1, 1]) line(C.l, tp(smooth([[sg * 8, -20], [sg * 22, -26], [sg * 40, -20]], 4, false)), { w: 4.5, col: murti ? '#0f0f14' : '#1c1820', seed: 1108 + sg });
  line(C.l, tp(smooth([[-2, 6], [3, 18], [-3, 21]], 4, false)), { w: 3, col: skinD, seed: 1110 });
  line(C.l, tp(smooth([[-12, 32], [0, 38], [12, 32]], 5, false)), { w: 4.5, col: murti ? '#9b1f2a' : '#7a2330', seed: 1111 });
  for (const sg of [-1, 1]) line(C.l, tp([[sg * 3, -14], [sg * 9, -48]]), { w: 5, col: K.white, seed: 1112 + sg }); line(C.l, tp([[0, -16], [0, -46]]), { w: 4.5, col: K.red, seed: 1114 });
  // kirita mukut (tall crown)
  line(C.l, tp(smooth([[-50, -40], [0, -50], [50, -40]], 4, false)), { w: 8, col: '#1c1820', seed: 1115 });
  const crown = smooth([[-56, -40], [-60, -92], [-42, -150], [-20, -186], [0, -208], [20, -186], [42, -150], [60, -92], [56, -40], [0, -52]], 4);
  part(C, tp(crown), F(gold, 1116), O(5, 1117));
  for (const [y, w] of [[-60, 56], [-100, 52], [-140, 38]]) line(C.l, tp(smooth([[-w, y], [0, y - 8], [w, y]], 4, false)), { w: 4, col: '#b97d16', seed: 1118 + y });
  for (const [dx, dy, c] of [[0, -78, K.red], [-30, -72, '#3fa39a'], [30, -72, '#3fa39a'], [0, -122, K.red], [0, -164, '#3fa39a']]) dab(C.l, ...P(dx, dy), 7 * k, { col: c, p: 1, seed: 1130 + dx + dy });
  dab(C.l, ...P(0, -212), 9 * k, { col: goldL, p: 1, seed: 1140 });
  WMUL.k = 1;
}
function lotusThrone(CB, C, x, y, w, sd = 1200) {   // a big open lotus seat: back petals, front petals
  for (const [row, n, ry, col, sc] of [[0, 9, 0.30, K.pinkL, 1.0], [1, 8, 0.36, K.pink, 0.85]]) for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n, a = Math.PI * (1 + u), bx = x + Math.cos(a) * w * 0.82 * (row ? 1.05 : 0.9), by = y + Math.sin(a) * w * ry * (row ? -1 : 1) * 0.5 + (row ? 30 : -10);
    const h = w * 0.42 * sc * (row ? 1 : 1.1), dir = row ? -1 : -1, tilt = (u - 0.5) * 1.2;
    const tip = [bx + Math.sin(tilt) * h, by + dir * Math.cos(tilt) * h], m = [(bx + tip[0]) / 2, (by + tip[1]) / 2], nx = Math.cos(tilt) * w * 0.11, ny = Math.sin(tilt) * w * 0.11;
    part(row ? C : CB, smooth([[bx - nx, by - ny], [m[0] - nx * 1.3, m[1] - ny * 1.3], tip, [m[0] + nx * 1.3, m[1] + ny * 1.3], [bx + nx, by + ny]], 4), { col, p: 1, seed: sd + row * 20 + i }, { w: 3.5, col: '#9c3a5e', seed: sd + 40 + row * 20 + i });
  }
  part(CB, smooth(oval(x, y + 50, w * 0.95, w * 0.14, 24), 2), { col: '#6fae63', p: 1, seed: sd + 80 }, { w: 4, col: '#3e6e3a', seed: sd + 81 });
}
function prabhavali(L, x, hy, k) {   // the gold arch frame behind a murti
  const P = (dx, dy) => [x + dx * k, hy + dy * k];
  const arch = smooth([[-230, 620], [-240, 120], [-200, -120], [-120, -260], [0, -310], [120, -260], [200, -120], [240, 120], [230, 620]], 6, false);
  line(L, arch.map(([a, b]) => P(a, b)), { w: 26 * k, col: K.gold, seed: 1150 });
  line(L, arch.map(([a, b]) => P(a * 0.9, b * 0.94 + 30)), { w: 6 * k, col: K.goldL, seed: 1151 });
  for (let i = 0; i < 22; i++) { const u = i / 21, p = arch[Math.floor(u * (arch.length - 1))]; dab(L, ...P(p[0] * 1.08, p[1] * 1.04 - 10), 12 * k, { col: i % 2 ? K.orange : K.goldL, p: 1, seed: 1152 + i }); }
}

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
function drawPond(t, day2, full) {
  const B = BG;
  poly(B.f, rect(2300, 0, 4900, 2300), '#cfe8f2', 1, { seed: 200 });
  dab(B.f, 2600, 1500, 90, { col: '#ffe9a0', p: 1, seed: 201 });
  for (let i = 0; i < 9; i++) dab(B.f, 2350 + i * 300, 2250 - 60 * hash(i * 2.2), 170 + 50 * hash(i * 3.3), { col: i % 2 ? '#6fae63' : '#5f9e58', p: 1, seed: 202 + i });
  poly(B.f, rect(2300, 2300, 4900, 3700), '#a9cf7e', 1, { seed: 212 });
  poly(B.f, oval(3050, 2720, 720, 210, 40), '#6fb3c9', 1, { seed: 213 }); edge(B.l, oval(3050, 2720, 720, 210, 40), '#4d8ea6', 6, 0.9, 214);
  for (let i = 0; i < 4; i++) line(B.l, [[2700 + i * 200, 2700 + (i % 2) * 60], [2800 + i * 200, 2700 + (i % 2) * 60]], { w: 3, col: '#e6f5fb', seed: 215 + i });
  const pads = [[2560, 2700, 70], [2760, 2620, 60], [2980, 2790, 80], [3200, 2640, 64], [3400, 2760, 74], [3560, 2660, 60], [2860, 2850, 56], [3300, 2860, 60]];
  pads.forEach(([x, y, r], i) => lilyPad(B.f, x, y, r, 220 + i * 2));
  const taken = day2 && !full && t > 45.0 && false;
  const spots = full ? [[2480, 2700], [2620, 2630], [2760, 2600], [2900, 2700], [3040, 2620], [3200, 2640], [3340, 2700], [3480, 2620], [3600, 2700], [2560, 2800], [2760, 2830], [2980, 2860], [3180, 2820], [3400, 2830], [3560, 2790]] : day2 ? (taken ? [] : [[3200, 2640]]) : [[2560, 2700], [2760, 2620], [3200, 2640], [3400, 2760], [3560, 2660], [2860, 2850]];
  spots.forEach(([x, y], i) => lotus(PROP, x, y - 4, full ? 0.7 : day2 ? 0.9 : 0.75, 240 + i * 30, day2 ? 0.6 : full ? 0.3 : 0));
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
function drawMandir(t) {   // inside the temple: the brass Vishnu murti in its niche (Jayant 23 Nov: a real murti, not an empty space)
  const B = BG;
  poly(B.f, rect(4700, 600, 6700, 3000), '#e3c99a', 1, { seed: 400 });
  poly(B.f, rect(4700, 3000, 6700, 3700), '#c9a878', 1, { seed: 401 });
  for (const x of [4880, 6440]) { poly(B.f, rect(x, 600, x + 140, 3000), '#d4b484', 1, { seed: 402 + x }); edge(B.l, rect(x, 600, x + 140, 3000), '#a8865a', 4, 0.8, 403 + x); }
  poly(B.f, smooth([[5340, 3000], [5340, 1720], [5450, 1500], [5750, 1380], [6050, 1500], [6160, 1720], [6160, 3000]], 5), '#3a2a24', 1, { seed: 404 });   // the niche
  sglow(5750, 2350, 620, '#ffcf6a', 0.5, 405);
  prabhavali(PROP.l, 5750, 2140, 0.92);
  vishnu(PE, 5750, 2140, 0.92, 'brass', t);
  marigold(FG.l, 5560, 5940, 2240, 220, 420);
  part(FG, rect(5420, 2700, 6080, 3000), { col: '#7b6450', p: 1, seed: 470 }, { w: 5, col: K.ink, seed: 471 });
  for (let i = 0; i < 8; i++) { const x = 5470 + i * 80; part(FG, smooth([[x - 44, 2716], [x, 2656], [x + 44, 2716]], 4), { col: K.pink, p: 1, seed: 450 + i }, { w: 3, col: '#9c3a5e', seed: 460 + i }); }
  line(FG.l, [[5420, 2750], [6080, 2750]], { w: 8, col: K.gold, seed: 472 });
  bell(B.l, 5130, 1600, 480); bell(B.l, 6370, 1620, 484);
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
  sglow(11260, 2200, 330, '#ffcf6a', 0.6, 811);
  prabhavali(PROP.l, 11260, 1990, 0.45); vishnu(PROP, 11260, 1990, 0.45, 'brass', t);
  poly(B.f, rect(11080, 2250, 11440, 2440), '#7b6450', 1, { seed: 812 }); edge(B.l, rect(11080, 2250, 11440, 2440), K.ink, 4, 0.9, 813);
  bell(B.l, 11140, 1640, 814); diya(PROP, 11120, 2240, 1.0, 818); diya(PROP, 11400, 2240, 1.0, 819);
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
const LABELS = [[10.1, 13.1, 'पिछले भाग में…'], [53.2, 56.1, 'अगली सुबह…']];
const CHIPS = [[21.2, 24.5, [[21.5, 'पीला पीतांबर ✓', K.goldL], [22.3, 'वैष्णव तिलक ✓', '#ffffff'], [23.1, 'रथ पर शंख ✓', '#b8f0c0']]]];
const END = 69.4;
function badge(t) {   // "भाग 2/2"
  if (t > END) return;
  const x = 905, y = 560; box(x, y, 118, 40, 'rgba(160,30,40,0.92)');
  wtext(SUBT, 'भाग 2/2', x, y + 16, { screen: true, size: 46, weight: 700, col: K.white, seed: 3, tilt: 0 });
}
function labels(t) {
  const L = LABELS.find(l => t >= l[0] && t < l[1]);
  if (L) { box(540, 1690, 330, 60); wtext(SUBT, L[2], 540, 1712, { screen: true, size: 62, weight: 700, col: K.note, reveal: pr(t, L[0] + 0.1, L[0] + 0.5), seed: 61 + L[0], tilt: 0 }); }
  for (const [a, b, items] of CHIPS) if (t >= a && t < b) items.forEach(([t0, txt, col], i) => {
    if (t < t0) return; const u = back1(pr(t, t0, t0 + 0.3)), y = 1460 + i * 125;
    box(540, y, 340 * u + 1, 50 * u + 1); wtext(SUBT, txt, 540, y + 20, { screen: true, size: 58 * u + 1, weight: 700, col, seed: 70 + i + a, tilt: 0 });
  });
  if (t > 7.0 && t < 10.0) {   // title + भाग 2
    const u = back1(pr(t, 7.0, 7.3)); box(540, 1560, 360 * u + 1, 92 * u + 1);
    wtext(SUBT, 'असली भक्ति', 540, 1600, { screen: true, size: 124 * u + 1, weight: 700, col: K.goldL, seed: 81, tilt: 0 });
    const v = back1(pr(t, 7.5, 7.8)); box(540, 1716, 150 * v + 1, 48 * v + 1, 'rgba(160,30,40,0.95)');
    wtext(SUBT, 'भाग 2', 540, 1738, { screen: true, size: 66 * v + 1, weight: 700, col: K.white, seed: 82, tilt: 0 });
  }
}
function endCard(t) {
  if (t < END) return;
  const g = SUBT.g; g.save(); g.fillStyle = 'rgba(20,19,26,0.94)'; g.fillRect(0, 1200, W, 720); g.restore();
  wtext(SUBT, 'कहानी पूरी हुई', 540, 1330, { screen: true, size: 76, weight: 700, col: K.goldL, reveal: pr(t, END + 0.05, END + 0.4), seed: 90, tilt: 0 });
  wtext(SUBT, 'उसे भेजो जो माँ-पापा की', 540, 1450, { screen: true, size: 58, weight: 700, col: K.bone, reveal: pr(t, END + 0.4, END + 0.8), seed: 91, tilt: 0 });
  wtext(SUBT, 'सेवा सबसे पहले करता है', 540, 1525, { screen: true, size: 58, weight: 700, col: K.bone, reveal: pr(t, END + 0.6, END + 1.0), seed: 92, tilt: 0 });
  const u = back1(pr(t, END + 1.1, END + 1.4)); box(540, 1640, 340 * u + 1, 56 * u + 1, 'rgba(160,30,40,0.97)');
  wtext(SUBT, 'अगला पन्ना कल', 540, 1664, { screen: true, size: 66 * u + 1, weight: 700, col: K.white, seed: 93, tilt: 0 });
  wtext(SUBT, 'Follow · @pannapalatkahani', 540, 1770, { screen: true, size: 52, weight: 700, col: K.note, reveal: pr(t, END + 1.5, END + 1.9), seed: 94, tilt: 0 });
}

// ——— events for the mixer ———
export const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
SUBS.forEach(S => { if (S.vo) ev(S.vt, 'voice', { id: S.vo, who: S.who }); });
ev(0.0, 'swell', { dur: 4.1 }); ev(4.1, 'flash'); ev(4.2, 'sparkle', { dur: 1.5 }); ev(4.2, 'bell'); ev(10.0, 'whoosh'); ev(10.1, 'crickets', { dur: 4.0 }); ev(14.0, 'birds', { dur: 4.0 });
ev(18.0, 'whoosh'); ev(21.2, 'whoosh'); ev(21.5, 'tick'); ev(22.3, 'tick'); ev(23.1, 'tick'); ev(23.9, 'flash'); ev(24.0, 'sparkle', { dur: 1.5 });
ev(34.6, 'bell'); ev(39.1, 'chime'); ev(43.6, 'sparkle', { dur: 2.5 }); ev(46.6, 'birds', { dur: 6.0 }); ev(47.6, 'chime');
ev(53.1, 'birds', { dur: 9.6 }); ev(53.8, 'sparkle', { dur: 5.0 }); ev(60.1, 'bell'); ev(64.6, 'chime'); ev(END, 'write', { dur: 1.6 });
[['A', 0], ['B', 4.1], ['B2', 6.0], ['C', 10.0], ['D', 18.0], ['E', 21.2], ['F', 23.9], ['G', 29.6], ['H', 34.6], ['I', 43.6], ['J', 46.6], ['K', 53.1], ['L', 60.1], ['Z', END]].forEach(([id, t]) => ev(t, 'cue', { id }));

// ——— one frame ———
export function frame(comp, t) {
  const S = shotAt(t), set = S[2];
  const e = ss((t - S[0]) / (S[1] - S[0]));
  CAM.x = lerp(S[3][0], S[4][0], e); CAM.y = lerp(S[3][1], S[4][1], e); CAM.s = lerp(S[3][2], S[4][2], e);
  const [shx, shy] = shake(t); CAM.x += shx / CAM.s; CAM.y += shy / CAM.s;
  BOIL.amp = 0;
  [PE, PROP, FG].forEach(clearGroup);
  [BG.f, BG.l, GLOW, FX, SUBK, SUBT].forEach(clear);
  let vig = 0.2;
  const spk = (a, b) => talking(t, a, b) === 'open';
  const flash = (t0, d) => { if (t > t0 && t < t0 + d) { const g = FX.g; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1 - pr(t, t0, t0 + d); g.fillStyle = '#fff8e0'; g.fillRect(0, 0, W, H); g.restore(); } };
  if (set === 'steps') {
    drawSteps(t, 1);
    diya(PROP, 640, 2805, 1.2, 100);
    const vk0 = 0.95, vx = 1080, gone = t > 44.4, shown = t >= 4.1;
    const vk = vk0 * (t < 4.9 ? lerp(0.8, 1, eo(pr(t, 4.1, 4.9))) : 1), vhy = 2650 - 590 * vk;
    if (t < 4.1) { const u = pr(t, 2.4, 4.1); sglow(1000, 2250, 420 + 700 * u * u, '#fff4c8', 0.5 + 0.5 * u, 140); for (let i = 0; i < 16; i++) { const w = ((t * 0.4) + hash(i * 2.3)) % 1; dab(FX, 860 + hash(i * 1.1) * 280, 2650 - w * 800, 7, { col: i % 2 ? K.goldL : K.white, p: Math.sin(Math.PI * w) * (0.4 + 0.6 * u), seed: 220 + i }); } }
    flash(4.1, 0.8);
    if (!gone && shown) {
      const bless = t >= 35.2 && t < 43.6, bu = eo(pr(t, 35.2, 36.2));
      vishnu(PE, vx, vhy, vk, 'deva', t, { shesh: 1, aura: 1, lotus: t < 43.6 ? 1 : 0, bless: bless ? [lerp(-118, -205, bu), lerp(246, 262, bu)] : null });
    }
    if (t > 43.6 && t < 46.6) { sglow(vx, 2300, 700 * (1 + pr(t, 43.6, 44.6)), '#fff2c0', 1 - pr(t, 44.6, 46.6), 150); for (let i = 0; i < 24; i++) { const u = ((t - 43.6) * 0.5 + hash(i * 3.1)) % 1; dab(FX, vx - 250 + hash(i * 1.7) * 500, 2600 - u * 900, 9, { col: i % 2 ? K.goldL : K.white, p: 1 - u, seed: 160 + i }); } }
    flash(44.2, 0.6);
    const x = 880, hy = 2420, k = 1.0;
    let exp, hands, look = [1, -1], tears = true;
    if (t < 4.1) { exp = { eyes: 'teary', brows: 'up', mouth: 'o' }; hands = { L: [x - 70, hy + 290], R: [x + 70, hy + 290] }; look = [0.6, -1]; }
    else if (t < 10.0) { exp = { eyes: 'pop', brows: 'up', mouth: spk(6.2, 9.6) ? 'open' : 'o' }; hands = { L: [x - 70, hy + 290], R: [x + 70, hy + 290] }; tears = false; }
    else if (t < 29.6) { exp = { eyes: 'teary', brows: 'worried', mouth: spk(18.2, 20.9) ? 'open' : 'o' }; hands = { L: [x + 6, hy + 200], R: [x + 34, hy + 196] }; tears = false; }
    else if (t < 34.6) { exp = { eyes: 'teary', brows: 'sad', mouth: spk(29.7, 34.8) ? 'open' : 'sad' }; hands = { L: [x + 6, hy + 200], R: [x + 34, hy + 196] }; look = [0.5, 0.6]; }
    else if (t < 43.6) { exp = t < 41.4 ? { eyes: 'calm', brows: 'calm', mouth: 'small' } : { eyes: 'happy', brows: 'up', mouth: 'grin' }; hands = { L: [x + 6, hy + 200], R: [x + 34, hy + 196] }; look = [0.4, -0.6]; }
    else { exp = { eyes: 'teary', brows: 'up', mouth: 'smile' }; hands = { L: [x - 20, hy + 250], R: [x + 40, hy + 245] }; look = [0.3, -0.8]; }
    const arms = person2(FG, seat('raghav', x, t, { hy, k, kneel: 1, exp, look, hands, tears, blush: t > 41.4 }), 2000);
    if (t >= 43.6) lotus(FG, (arms.L[0] + arms.R[0]) / 2, Math.min(arms.L[1], arms.R[1]) - 10, 0.85, 150, 1);
    vig = 0.16;
  } else if (set === 'reveal' || set === 'pond') {
    drawPond(t, true, false);
    const rx = 3380, mx = 3990, gy = 3020, rk = 1.05, rhy = gy - AH * rk, mk = 1.1, mhy = gy - AH * mk, turned = set === 'reveal' && t > 23.9;
    if (set === 'pond') {   // recap: he hands over the lotus
      const handed = t > 15.8, u = eo(pr(t, 14.4, 15.6));
      const marms = person2(PE, stand('vyapari', mx, gy, mk, t, { exp: { eyes: 'half', brows: 'calm', mouth: 'knowing' }, look: [-1, 0], hands: { L: [lerp(mx - 110, mx - 230, eo(pr(t, 14.8, 15.6))), mhy + 230], R: [mx + 80, mhy + 320] } }), 3000);
      const rarms = person2(FG, stand('raghav', rx, gy, rk, t, { exp: { eyes: handed ? 'squeeze' : 'teary', brows: 'sad', mouth: handed ? 'cry' : 'wavy' }, look: [1, 0], tears: handed, hands: handed ? { L: [rx - 40, rhy + 250], R: [rx + 60, rhy + 250] } : { L: [rx - 30, rhy + 260], R: [lerp(rx + 50, rx + 250, u), rhy + 230] } }), 2000);
      if (!handed) lotus(FG, rarms.R[0] + 10, rarms.R[1] - 10, 0.85, 150, 0.4); else lotus(PE, marms.L[0], marms.L[1] - 6, 0.85, 150, 0.6);
    } else {
      if (!turned) {
        sglow(mx, 2600, 300 + 500 * pr(t, 22.1, 23.9), '#ffe08a', 0.3 + 0.7 * pr(t, 22.1, 23.9), 170);
        const marms = person2(PE, stand('vyapari', mx, gy, mk, t, { exp: { eyes: 'half', brows: 'calm', mouth: 'knowing' }, look: [-1, 0], hands: { L: [mx - 110, mhy + 240], R: [mx + 80, mhy + 320] } }), 3000);
        lotus(PE, marms.L[0], marms.L[1] - 6, 0.85, 150, 0.8);
        if (t < 23.9) for (const [cx, cy, a0] of [[mx + 30, mhy + 200, 21.5], [mx + 2, mhy - 30, 22.3], [4420, 1800, 23.1]]) if (t > a0) line(FX, handCircle(cx, cy, 80, 175 + a0, 0.1, 30), { w: 9, col: K.red, seed: 176 + a0 });
      } else vishnu(PE, mx, gy - 590, 1.0, 'deva', t, { aura: 1 });
      flash(23.9, 0.7);
      const rarms = person2(FG, stand('raghav', rx, gy, rk, t, { exp: turned ? { eyes: 'pop', brows: 'up', mouth: 'yell' } : { eyes: 'sad', brows: 'sad', mouth: 'small' }, look: [1, -0.2], hands: turned && t > 26.1 ? { L: [rx + 8, rhy + 200], R: [rx + 36, rhy + 196] } : { L: [rx - 40, rhy + 250], R: [rx + 60, rhy + 250] } }), 2000);
      if (!(turned && t > 26.1)) { const h = rarms.R; part(FG, smooth([[h[0] - 40, h[1] + 40], [h[0] - 30, h[1] - 20], [h[0], h[1] - 34], [h[0] + 30, h[1] - 20], [h[0] + 40, h[1] + 40]], 4), { col: '#c7362f', p: 1, seed: 170 }, { w: 3, col: K.ink, seed: 171 }); dab(FG.l, h[0], h[1] - 34, 10, { col: K.gold, p: 1, seed: 172 }); }
    }
    vig = 0.16;
  } else if (set === 'pondfull') {
    drawPond(t, false, true);
    const x = 3000, gy = 3020, k = 1.05, hy = gy - AH * k, wow = t > 54.6;
    const arms = person2(FG, stand('raghav', x, gy, k, t, { exp: wow ? { eyes: t > 57.1 ? 'happy' : 'pop', brows: 'up', mouth: t > 57.1 ? 'grin' : 'o' } : { eyes: 'open', brows: 'calm', mouth: 'smile' }, look: [0.3, 0.4], tears: t > 57.1, blush: t > 57.1, hands: wow ? { L: [x - 190, hy + 40], R: [x + 190, hy + 40] } : { L: [x - 20, hy + 250], R: [x + 40, hy + 245] } }), 2000);
    if (!wow) lotus(FG, (arms.L[0] + arms.R[0]) / 2, Math.min(arms.L[1], arms.R[1]) - 10, 0.85, 150, 0.5);
    for (let i = 0; i < 40; i++) { const u = ((t - 53.1) * 0.18 + hash(i * 2.9)) % 1; const px = 2450 + hash(i * 1.3) * 1200 + 60 * Math.sin(t * 2 + i); dab(FX, px, 1500 + u * 1600, 11, { col: i % 3 ? K.pink : K.pinkL, p: Math.sin(Math.PI * u), seed: 300 + i, sq: 0.6 }); }
    vig = 0.12;
  } else if (set === 'mandir') {
    drawMandir(t);
    diya(FG, 5360, 3040, 1.4, 490); diya(FG, 6140, 3040, 1.4, 495);
    const placed = t > 62.2, reach = eo(pr(t, 60.5, 62.0));
    person2(FG, seat('amma', 5130, t, { hy: 2640, k: 1.1, kneel: 1, exp: { eyes: t > 62 ? 'calm' : 'open', brows: 'calm', mouth: 'smile' }, look: [1, -0.5], hands: { L: [5136, 2640 + 200 * 1.1], R: [5166, 2640 + 196 * 1.1] }, blush: 1 }), 2600);
    const x = 5330, hy = 2560, k = 1.25;
    const hands = placed ? { L: [x + 8, hy + 210], R: [x + 38, hy + 205] } : { L: [lerp(x + 20, x + 260, reach), lerp(hy + 300, hy + 160, reach)], R: [lerp(x + 70, x + 320, reach), lerp(hy + 290, hy + 150, reach)] };
    const arms = person2(FG, seat('raghav', x, t, { hy, k, kneel: 1, exp: placed ? { eyes: 'calm', brows: 'calm', mouth: 'smile' } : { eyes: 'open', brows: 'calm', mouth: 'smile' }, look: [1, -0.6], hands, blush: 1 }), 2000);
    if (!placed) lotus(FG, (arms.L[0] + arms.R[0]) / 2, Math.min(arms.L[1], arms.R[1]) - 10, 0.85, 150, 0.5);
    else lotus(FG, 5750, 2700, 0.9, 150, 1);
    if (t > 64.6 && t < 65.8) { const u = Math.sin(Math.PI * pr(t, 64.6, 65.8)) * 16; for (const sg of [-1, 1]) { const h = [5750 + sg * 21 * 0.92, 2140 - 2]; line(FX, [[h[0] - u, h[1]], [h[0] + u, h[1]]], { w: 5, col: K.white, seed: 190 + sg }); line(FX, [[h[0], h[1] - u], [h[0], h[1] + u]], { w: 5, col: K.white, seed: 192 + sg }); } }
    vig = 0.2;
  } else if (set === 'hut' || set === 'hutday') {
    const day = set === 'hutday';
    drawHut(t, day);
    if (!day) {   // recap: the fever night
      cotBack(PE);
      person2(PE, seat('amma', 8290, t, { hy: 2300, k: 0.95, patti: 1, sweat: 1, exp: { eyes: 'closed', brows: 'sad', mouth: 'sad' }, look: [1, 0.2], hands: { L: [8220, 2590], R: [8360, 2590] } }), 3000);
      cotFront(PE, false);
      person2(FG, seat('raghav', 8600, t, { hy: 2440, k: 1.0, kneel: 1, exp: { eyes: 'squeeze', brows: 'sad', mouth: 'cry' }, look: [-1, 0.2], hands: { L: [8400, 2600], R: [8440, 2615] }, tears: 1 }), 2000);
      diya(PROP, 7480, 2950, 1.2, 580);
      vig = 0.34;
    } else {   // Maa, healthy, lights the diya
      const mx = 8180, mgy = 3000, mk = 1.0, mhy = mgy - AH * mk;
      const marms = person2(PE, stand('amma', mx, mgy, mk, t, { exp: { eyes: t > 50.1 ? 'happy' : 'open', brows: 'calm', mouth: spk(47.7, 52.4) ? 'open' : 'smile' }, look: [1, 0], hands: { L: [mx + 10, mhy + 250], R: [mx + 70, mhy + 245] } }), 3000);
      diya(PE, (marms.L[0] + marms.R[0]) / 2, Math.min(marms.L[1], marms.R[1]) - 8, 1.3, 600);
      const rx = 8640, rgy = 3040, rk = 1.0, rhy = rgy - AH * rk;
      const rarms = person2(FG, stand('raghav', rx, rgy, rk, t, { exp: { eyes: t > 49.1 ? 'happy' : 'teary', brows: 'up', mouth: t > 49.1 ? 'grin' : 'smile' }, look: [-1, 0], tears: 1, blush: 1, hands: { L: [rx - 20, rhy + 250], R: [rx + 40, rhy + 245] } }), 2000);
      lotus(FG, (rarms.L[0] + rarms.R[0]) / 2, Math.min(rarms.L[1], rarms.R[1]) - 10, 0.85, 150, 0.6);
      vig = 0.14;
    }
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
export function testFrame(comp, t, test) {
  if (!['vishnu', 'murti', 'faces', 'reveal'].includes(test)) return frame(comp, t);
  const QS = new URLSearchParams(location.search), style = QS.get('style') || '';
  [PE, PROP, FG].forEach(clearGroup); [BG.f, BG.l, GLOW, FX, SUBK, SUBT].forEach(clear); BOIL.amp = 0;
  CAM.x = 20000; CAM.y = 2400; CAM.s = 1.0;
  const title = (a, b) => { box(540, 150, 500, 90); wtext(SUBT, a, 540, 160, { screen: true, size: 74, weight: 700, col: K.goldL, seed: 1, tilt: 0 }); wtext(SUBT, b, 540, 222, { screen: true, size: 40, weight: 700, col: K.white, seed: 2, tilt: 0 }); };
  if (test === 'vishnu') {
    poly(BG.f, rect(19000, 1000, 21000, 3800), '#f6e7c4', 1, { seed: 1 });
    for (let i = 0; i < 6; i++) dab(BG.f, 19500 + hash(i * 2.3) * 1000, 2900 + hash(i * 1.7) * 300, 160, { col: '#fff7e6', p: 1, seed: 2 + i });
    for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * 0.33; poly(GLOW, [[20000, 2150], [20000 + Math.cos(a - 0.06) * 1400, 2150 + Math.sin(a - 0.06) * 1400], [20000 + Math.cos(a + 0.06) * 1400, 2150 + Math.sin(a + 0.06) * 1400]], '#ffe7a0', 0.4, { seed: 20 + i }); }
    CAM.y = 2560; CAM.s = 1.45;
    if (style === 'shesh') { CAM.y = 2520; CAM.s = 1.32; }
    lotusThrone(PE, FG, 20000, 3110, 300);
    vishnu(PROP, 20000, 2380, 1.12, 'deva', t, { shesh: style === 'shesh' });
    if (style === 'shesh') title('रूप 2 — शेषनाग की छाया में', 'पाँच फन वाले शेषनाग · सुनहरी आभा'); else title('रूप 1 — भगवान विष्णु (कार्टून)', 'नीला रंग · कमल आसन · हाथ में वही कमल');
  } else if (test === 'murti') {
    CAM.y = 2520; CAM.s = 1.3;
    poly(BG.f, rect(19000, 1000, 21000, 3800), '#3a2c2a', 1, { seed: 1 });
    poly(BG.f, smooth([[19580, 3200], [19580, 1900], [19700, 1650], [20000, 1520], [20300, 1650], [20420, 1900], [20420, 3200]], 5), '#1d1618', 1, { seed: 2 });
    sglow(20000, 2500, 650, '#ffcf6a', 0.45, 3);
    prabhavali(PROP.l, 20000, 2330, 1.05);
    vishnu(PE, 20000, 2330, 1.05, style || 'murti', t);
    marigold(FG.l, 19770, 20230, 2440, 250, 60);
    part(FG, rect(19700, 2950, 20300, 3240), { col: '#6d5a4a', p: 1, seed: 70 }, { w: 5, col: K.ink, seed: 71 });
    for (let i = 0; i < 7; i++) { const x = 19760 + i * 80; part(FG, smooth([[x - 44, 2960], [x, 2900], [x + 44, 2960]], 4), { col: K.pink, p: 1, seed: 72 + i }, { w: 3, col: '#9c3a5e', seed: 80 + i }); }
    line(FG.l, [[19700, 3000], [20300, 3000]], { w: 8, col: K.gold, seed: 90 });
    diya(FG, 19640, 3260, 1.6, 91); diya(FG, 20360, 3260, 1.6, 96);
    bell(BG.l, 19480, 1500, 100); bell(BG.l, 20520, 1500, 104);
    title({ murti: 'मूर्ति A — काला पत्थर', marble: 'मूर्ति B — सफ़ेद संगमरमर', brass: 'मूर्ति C — पीतल / सुनहरी' }[style || 'murti'], 'पीतांबर + फूलों की माला · प्रभावली · कमल आसन');
  } else if (test === 'reveal') {
    CAM.y = 2470; CAM.x = 20090; CAM.s = 0.95;
    poly(BG.f, rect(19000, 1000, 21000, 3800), '#f3e4c0', 1, { seed: 1 });
    poly(BG.f, rect(19000, 3000, 21000, 3800), '#d9c08f', 1, { seed: 2 });
    sglow(20330, 2450, 560, '#ffe08a', 0.8, 3);
    person2(PE, stand('vyapari', 19640, 3020, 0.98, t, { exp: { eyes: 'half', brows: 'calm', mouth: 'knowing' }, look: [1, 0] }), 300);
    for (let i = 0; i < 14; i++) { const u = i / 13, x = lerp(19800, 19960, u), y = 2500 + Math.sin(u * Math.PI * 3) * 40; dab(FX, x, y, 8 + 6 * Math.sin(u * Math.PI), { col: i % 2 ? K.goldL : K.white, p: 1, seed: 10 + i }); }
    line(FX, [[19930, 2460], [19980, 2500], [19930, 2540]], { w: 8, col: K.gold, seed: 30 });
    lotusThrone(PROP, FG, 20330, 3090, 230, 1300);
    vishnu(FG, 20330, 2440, 0.98, 'deva', t, { aura: 0.7 });
    title('रूप 3 — व्यापारी ही भगवान!', 'भाग 2 का twist: पीतांबर · तिलक · शंख · वही कमल');
  } else {
    poly(BG.f, rect(19000, 1000, 21000, 3800), '#efe3cf', 1, { seed: 1 });
    const cells = [['raghav', { eyes: 'sad', brows: 'sad', mouth: 'sad' }, 'उदास'], ['raghav', { eyes: 'squeeze', brows: 'sad', mouth: 'cry' }, 'रोना', 1], ['raghav', { eyes: 'calm', brows: 'calm', mouth: 'small' }, 'प्रार्थना'],
      ['raghav', { eyes: 'pop', brows: 'up', mouth: 'o' }, 'हैरान'], ['raghav', { eyes: 'teary', brows: 'worried', mouth: 'wavy' }, 'दुविधा'], ['raghav', { eyes: 'happy', brows: 'up', mouth: 'grin' }, 'ख़ुशी के आँसू', 1],
      ['amma', { eyes: 'closed', brows: 'sad', mouth: 'sad' }, 'माँ — बुखार'], ['amma', { eyes: 'teary', brows: 'calm', mouth: 'smile' }, 'माँ — “राघव…”'], ['vyapari', { eyes: 'half', brows: 'calm', mouth: 'knowing' }, 'व्यापारी (राज़)']];
    cells.forEach(([kind, exp, lab, tears], i) => {
      const cx = 19640 + (i % 3) * 360, cy = 1830 + Math.floor(i / 3) * 520;
      poly(BG.f, rrect(cx - 170, cy - 220, cx + 170, cy + 230, 30), '#fbf6ea', 1, { seed: 10 + i });
      person2(i < 3 ? PE : i < 6 ? PROP : FG, bust(kind, cx, cy - 70, 1.5, t, { L: 260, exp, tears, patti: kind === 'amma' && i === 6 }), 200 + i * 50);
      poly(FX, rrect(cx - 150, cy + 150, cx + 150, cy + 222, 20), '#2a2630', 1, { seed: 20 + i });
      wtext(FX, lab, cx, cy + 202, { size: 44, weight: 700, col: K.goldL, seed: 30 + i, tilt: 0 });
    });
    title('चेहरे के भाव — नया स्टाइल', 'बड़ी आँखें · पलकें · भौहें · असली आँसू');
  }
  comp.paperCam(CAM.x * 0.6, CAM.y * 0.6, CAM.s / 0.6); comp.clean = true; comp.begin(PAPER);
  comp.crayon(BG.f.c); comp.crayon(BG.l.c); comp.crayon(GLOW.c); comp.group(PE); comp.group(PROP); comp.group(FG); comp.crayon(FX.c); comp.knock(SUBK.c); comp.crayon(SUBT.c);
  comp.finish({ vig: 0.15, emb: 0, bright: 1, lamp: [0.5, 0.5, 1, 0] });
}
