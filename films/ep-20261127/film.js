// 0000 · लफ़्ज़ों का क़र्ज़ (भाग 1/2) — Ep 10, posts 27 Nov 2026. Vertical 1080×1920, 24 fps, ~80 s. Clean cartoon, expressive faces.
// Story by Jayant (23 Nov), fixes agreed 24 Nov (see films/scripts/ep10-11-lafzon-ka-karz.md). A world where everyone gets 10,00,000 words
// for life on a glowing wrist band; Meera (lawyer, 45 words left) must save her innocent Papa in court; her words hit 0000 mid-sentence;
// Aarav (who only talks with his sketchbook, 1,200 words) transfers ALL his words to her. Cliffhanger: why did he have only 1,200?
import { layer, clear, line, fill, dab, handCircle, smooth, CAM, BOIL, WMUL, STYLE, W, H, sx, sy } from './crayon.js';
import { group, clearGroup, part, tube } from './rig.js';
import { clamp, lerp, hash, ss, eio, eo, ei } from '/core/lib.js';
STYLE.clean = true;

const NOSUBS = new URLSearchParams(location.search).get('nosubs') === '1';
const K = { ink: '#1d1b22', bone: '#fbf8f1', cream: '#f3ead2', white: '#ffffff', grey: '#9a9aa3', dgrey: '#55555f',
  wood: '#b57f52', woodD: '#7d5434', red: '#e2412f', green: '#4f9a5a', leaf: '#7cc36e', yellow: '#f5c63c', note: '#ffe46b', pink: '#f29ab8', pinkL: '#fbd3e0', orange: '#ec8a3c',
  skin: '#e2ab88', skinM: '#d9a27f', skinO: '#c98d68', water: '#9fd0f0', gold: '#e2a92f', goldL: '#ffd76a', copper: '#b8693a', copperL: '#d98c5a',
  pitambar: '#f2b632', maroon: '#7a2340', stone: '#3c3a46', stoneL: '#5a5866', saffron: '#e8863a', mud: '#a8754a', nightSky: '#1b2142',
  navy: '#2e3d66', jeans: '#5b6472', coat: '#26252d', robe: '#1d1c23', kurta: '#efe2c4', gown: '#bfd8e8', court: '#8a5a3c', courtD: '#5e3b26', wall: '#e9dcc0' };
const PAPER = [0.965, 0.955, 0.93];
const pr = (t, a, b) => clamp((t - a) / (b - a));
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const rrect = (x0, y0, x1, y1, r) => { const p = []; for (const [cx, cy, a0] of [[x1 - r, y0 + r, -Math.PI / 2], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, Math.PI / 2], [x0 + r, y0 + r, Math.PI]]) for (let i = 0; i <= 6; i++) { const a = a0 + i / 6 * Math.PI / 2; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return p; };
const back1 = u => { u = clamp(u) - 1; return 1 + u * u * (2.8 * u + 1.8); };
const oval = (cx, cy, rx, ry, n = 32) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });

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

// ——— characters (Ep 10/11 cast: designs from Jayant's Gemini sheet, redrawn in our clean style) ———
const SPEC = {
  aarav: { top: K.navy, tee: K.white, collar: 1, len: 360, bottom: K.jeans, shoe: '#6b4a32', hair: 'curly', hairCol: '#2a1c16', skin: K.skinO, glasses: 1, iris: '#3a2414', sleeve: K.navy },
  meera: { fem: 1, top: K.coat, shirt: K.white, bands: 1, len: 350, bottom: '#2a2f36', shoe: K.ink, hair: 'long', hairCol: '#2b1d18', skin: K.skinM, bindi: 1, lineCol: '#5a5866' },
  papa: { top: K.kurta, len: 440, bottom: K.white, shoe: '#8a5a3a', hair: 'balding', hairCol: '#cfcbc4', moustache: '#dcd8d1', skin: K.skinO, browCol: '#bdb8b0', kurtaBtn: 1 },
  judge: { top: K.robe, shirt: K.white, bands: 1, len: 470, bottom: K.robe, shoe: K.ink, hair: 'side', hairCol: '#dad7d2', moustache: '#dad7d2', skin: K.skinM, browCol: '#c9c4bd', lineCol: '#5a5866' },
  khanna: { top: K.coat, shirt: K.white, bands: 1, len: 370, wide: 1.2, bottom: '#24232b', shoe: K.ink, hair: 'slick', hairCol: '#171214', moustache: '#171214', skin: K.skin, watch: 1, lineCol: '#5a5866' },
  aaravKid: { top: K.gown, gown: 1, len: 400, bottom: K.gown, shoe: K.skinO, hair: 'curly', hairCol: '#2a1c16', skin: K.skinO, glasses: 1, kid: 1 },
  meeraKid: { fem: 1, top: K.gown, gown: 1, len: 400, bottom: K.gown, shoe: K.skinM, hair: 'pigtails', hairCol: '#2b1d18', skin: K.skinM, kid: 1 },
};
function person3(C, s, sd) {
  const P0 = SPEC[s.kind], k = s.k ?? 1, hy = s.hy, hairCol = P0.hairCol || '#2a201e', wd = P0.wide || 1, hk = s.hk ?? (P0.kid ? 1.35 : 1);
  const P = (dx, dy) => [s.x + dx * k, hy + dy * k], tp = pts => pts.map(([a, b]) => P(a, b));
  const tw = pts => pts.map(([a, b]) => P(a * wd, b));
  const PH = (dx, dy) => [s.x + dx * k * hk, hy + dy * k * hk], th = pts => pts.map(([a, b]) => PH(a, b));
  WMUL.k = clamp(Math.sqrt(k), 0.45, 1.3);
  const lc = P0.lineCol || K.ink;
  const skinC = P0.skin, skin = { col: skinC, p: 1, gap: 7, w: 9, seed: sd + 1 }, O = (w, q, c = K.ink) => ({ w, col: c, seed: q, p: 0.9 });
  if (!s.seated && !s.bust) for (const [side, sg] of [['L', -1], ['R', 1]]) {   // legs
    const hip = P(sg * 24 * wd, 330), [kn, f] = ik(hip, s.feet[side], 178 * k, 178 * k, sg);
    part(C, tube([hip, kn, f], 44 * k * wd, 34 * k), { col: P0.bottom, p: 1, seed: sd + 2 + sg }, O(4, sd + 4 + sg, lc));
    part(C, smooth([[f[0] - 26 * k, f[1] - 10 * k], [f[0] + sg * 6 * k + 22 * k, f[1] - 12 * k], [f[0] + sg * 30 * k, f[1] + 4 * k], [f[0] - 22 * sg * k, f[1] + 10 * k]], 4), { col: P0.shoe, p: 1, seed: sd + 6 + sg }, O(4, sd + 8 + sg));
  }
  if (s.kneel) part(C, tp(smooth([[-70, 270], [70, 270], [120, 330], [116, 400], [-96, 404], [-84, 330]], 3)), { col: P0.bottom, p: 1, seed: sd + 168 }, O(4, sd + 169, lc));
  // hair behind the body
  if (P0.hair === 'long') part(C, th(smooth([[-58, -34], [-70, 30], [-78, 120], [-70, 210], [-82, 262], [-40, 276], [0, 250], [40, 276], [82, 262], [70, 210], [78, 120], [70, 30], [58, -34], [0, -72]].map(([a, b]) => [a, b > 0 && s.bust ? b * Math.min(1, ((s.bustL || 300) - 30) / 276) : b]), 4)), { col: hairCol, p: 1, seed: sd + 9 }, O(4, sd + 10));
  if (P0.hair === 'pigtails') for (const sg of [-1, 1]) { part(C, th(handCircle(sg * 60, 4, 22, sd + 11 + sg, 0, 18)), { col: hairCol, p: 1, seed: sd + 12 + sg }, O(4, sd + 13 + sg)); dab(C.l, ...PH(sg * 48, -6), 7 * k * hk, { col: K.red, p: 1, seed: sd + 14 + sg }); }
  const L = s.bust ? (s.bustL || 300) : P0.len;
  const y1 = Math.min(140, L - 40), y2 = Math.min(250, L - 25);
  part(C, tw(smooth([[-15, 48], [15, 48], [50, 62], [58, y1], [62, y2], [64, L - 10], [0, L], [-64, L - 10], [-62, y2], [-58, y1], [-50, 62]], 3)), { col: P0.top, p: 1, seed: sd + 14 }, O(5, sd + 15, lc));
  if (P0.tee) {   // open shirt over a white tee
    part(C, tw([[-24, 50], [24, 50], [22, L - 8], [-22, L - 8]]), { col: P0.tee, p: 1, seed: sd + 16 }, O(4, sd + 17));
    for (const sg of [-1, 1]) part(C, tw([[sg * 14, 46], [sg * 44, 60], [sg * 30, 96]]), { col: P0.top, p: 1, seed: sd + 18 + sg }, O(3.5, sd + 19 + sg));
  }
  if (P0.shirt) {   // coat / robe: white shirt V, lapels, advocate bands
    part(C, tw([[-22, 48], [22, 48], [0, 160]]), { col: P0.shirt, p: 1, seed: sd + 16 }, null);
    for (const sg of [-1, 1]) line(C.l, tw([[sg * 22, 50], [sg * 2, 160], [sg * 4, Math.min(230, L - 8)]]), { w: 4, col: lc, seed: sd + 18 + sg });
    if (P0.kind !== 'robe') for (const yy of [196, 246]) if (yy < L - 14) dab(C.l, ...P(0, yy), 5 * k, { col: '#6b6976', p: 1, seed: sd + 20 + yy });
    if (P0.bands) for (const sg of [-1, 1]) part(C, tw(rrect(sg > 0 ? 1 : -12, 54, sg > 0 ? 12 : -1, 104, 3)), { col: K.white, p: 1, seed: sd + 22 + sg }, O(2.5, sd + 24 + sg));
  }
  if (P0.kurtaBtn) { line(C.l, tw([[-16, 50], [0, 56], [16, 50]]), { w: 4, col: '#b9a77f', seed: sd + 16 }); for (let i = 0; i < 3; i++) dab(C.l, ...P(0, 78 + i * 32), 4.5 * k, { col: '#b9a77f', p: 1, seed: sd + 17 + i }); }
  if (P0.gown) for (let i = 0; i < 9; i++) dab(C.l, ...P(-40 + (i % 3) * 40, 110 + Math.floor(i / 3) * 80), 4 * k, { col: '#8fb3cb', p: 1, seed: sd + 16 + i });
  part(C, tp([[-11, 30], [11, 30], [12, 56], [-12, 56]]), skin, O(4, sd + 40));
  for (const sg of [-1, 1]) part(C, th(handCircle(sg * 50, 6, 11, sd + 41 + sg, 0, 16)), skin, O(4, sd + 43 + sg));
  part(C, th(handCircle(0, 0, 50, sd + 45, 0.06, 44)), skin, O(5, sd + 46));
  // hair on top of the head
  if (P0.hair === 'short') part(C, th(smooth([[-54, -2], [-54, -42], [-34, -64], [-4, -72], [30, -66], [52, -46], [55, -4], [46, -28], [28, -40], [-6, -44], [-30, -36], [-46, -20]], 4)), { col: hairCol, p: 1, seed: sd + 54 }, O(4, sd + 55));
  if (P0.hair === 'balding' || P0.hair === 'side') { for (const sg of [-1, 1]) part(C, th(smooth([[sg * 56, 6], [sg * 58, -30], [sg * 44, -48], [sg * 38, -30], [sg * 46, -10]], 4)), { col: hairCol, p: 1, seed: sd + 54 + sg }, O(3.5, sd + 56 + sg)); if (P0.hair === 'side') part(C, th(smooth([[-40, -46], [-10, -60], [30, -56], [44, -44], [10, -50], [-24, -44]], 4)), { col: hairCol, p: 1, seed: sd + 58 }, O(3, sd + 59)); else line(C.l, th(smooth([[-30, -52], [-8, -46], [8, -52]], 4, false)), { w: 3, col: '#b07a5c', seed: sd + 59 }); }
  if (P0.hair === 'slick') { part(C, th(smooth([[-54, -4], [-56, -44], [-30, -68], [10, -72], [44, -60], [56, -30], [55, -6], [46, -30], [20, -46], [-14, -50], [-40, -36]], 4)), { col: hairCol, p: 1, seed: sd + 54 }, O(4, sd + 55)); line(C.l, th(smooth([[-30, -58], [0, -64], [30, -58]], 4, false)), { w: 4, col: '#6b6470', seed: sd + 56 }); }
  if (P0.hair === 'curly') {
    const pts = []; for (let i = 0; i <= 18; i++) { const a = Math.PI * (0.96 + 1.08 * i / 18), r = 60 + (i % 2 ? 11 : 0); pts.push([Math.cos(a) * r, Math.sin(a) * r * 1.02 - 4]); }
    part(C, th(smooth([...pts, [50, -14], [34, -34], [16, -38], [0, -46], [-16, -38], [-34, -36], [-50, -16]], 3)), { col: hairCol, p: 1, seed: sd + 54 }, O(4, sd + 55));
    for (const [cx, cy, r] of [[-22, -42, 11], [2, -48, 12], [24, -40, 10]]) part(C, th(handCircle(cx, cy, r, sd + 57 + cx, 0, 14)), { col: hairCol, p: 1, seed: sd + 58 + cx }, O(3, sd + 59 + cx));
  }
  if (P0.hair === 'long') {
    part(C, th(smooth([[-56, 14], [-58, -38], [-36, -64], [0, -72], [36, -64], [58, -38], [56, 14], [48, -14], [26, -34], [2, -46], [-2, -46], [-26, -34], [-48, -14]], 4)), { col: hairCol, p: 1, seed: sd + 54 }, O(4, sd + 55));
    for (const sg of [-1, 1]) part(C, th(smooth([[sg * 58, -20], [sg * 46, -16], [sg * 44, 30], [sg * 50, 70], [sg * 64, 56], [sg * 62, 10]], 4)), { col: hairCol, p: 1, seed: sd + 60 + sg }, O(3.5, sd + 62 + sg));
  }
  if (P0.hair === 'pigtails') part(C, th(smooth([[-54, 0], [-54, -42], [-30, -64], [0, -70], [30, -64], [54, -42], [54, 0], [44, -24], [24, -36], [2, -44], [-2, -44], [-24, -36], [-44, -24]], 4)), { col: hairCol, p: 1, seed: sd + 54 }, O(4, sd + 55));
  face(C, th, { ...s, look: s.look || [0, 0], browCol: P0.browCol, skinC, fem: P0.fem, iris: P0.iris }, sd);
  if (P0.moustache) part(C, th(smooth([[-28, 14], [0, 7], [28, 14], [22, 21], [0, 15], [-22, 21]], 4)), { col: P0.moustache, p: 1, seed: sd + 66 }, O(3, sd + 67));
  if (P0.glasses) { for (const sg of [-1, 1]) line(C.l, th(handCircle(sg * 20, -2, 17, sd + 68 + sg, 0.08, 24)), { w: 4, col: '#3b2a22', seed: sd + 69 + sg }); line(C.l, th([[-4, -4], [4, -4]]), { w: 3.5, col: '#3b2a22', seed: sd + 71 }); if (s.glint) for (const sg of [-1, 1]) line(C.l, th([[sg * 20 - 8, -10], [sg * 20 - 2, -16]]), { w: 3, col: K.white, seed: sd + 72 + sg }); }
  if (P0.bindi) dab(C.l, ...PH(0, -24), 4 * k * hk, { col: K.red, p: 1, seed: sd + 74 });
  if (s.sweat) dab(C.l, ...PH(58, -24 + 18 * ((s.t * 1.4) % 1)), 7 * k, { col: K.water, p: 1, seed: sd + 79 });
  const arms = {};
  if (!s.bust || s.hands) {
    for (const [side, sg] of [['L', -1], ['R', 1]]) {
      const shp = P(sg * 46 * wd, 68), [el, hd] = ik(shp, s.hands[side], 118 * k, 110 * k, sg); arms[side] = hd; arms['e' + side] = el;
      part(C, tube([el, hd], 24 * k, 20 * k), skin, O(4, sd + 100 + sg));
      part(C, tube([shp, el, [lerp(el[0], hd[0], P0.tee ? 0.25 : 0.5), lerp(el[1], hd[1], P0.tee ? 0.25 : 0.5)]], 32 * k, 26 * k), { col: P0.sleeve || P0.top, p: 1, seed: sd + 102 + sg }, O(4, sd + 104 + sg, lc));
    }
    for (const side of ['L', 'R']) part(C, handCircle(arms[side][0], arms[side][1], 15 * k, sd + 110 + (side === 'L' ? 0 : 1), 0, 18), skin, O(4, sd + 112 + (side === 'L' ? 0 : 1)));
    if (P0.watch) wristBand(C, arms, 'L', 'gold', k);
  }
  WMUL.k = 1;
  arms.k = k; s.head = PH(0, 0); return arms;
}
const AH = 680;
function stand(kind, x, gy, k, t, o = {}) {
  const hy = gy - AH * k - (SPEC[kind].kid ? 18 * k : 0);
  return { kind, t, x, gy, k, hy, hk: o.hk, feet: o.feet || { L: [x - 42 * k, gy], R: [x + 42 * k, gy] }, hands: o.hands || { L: [x - 78 * k, hy + 320 * k], R: [x + 78 * k, hy + 320 * k] }, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'small' }, look: o.look || [0, 0], sweat: o.sweat, tears: o.tears, blush: o.blush, glint: o.glint };
}
function seat(kind, x, t, o = {}) {
  const k = o.k ?? 1, hy = o.hy ?? 2010, gy = hy + 600;
  return { kind, t, x, gy, k, hy, hk: o.hk, seated: 1, kneel: o.kneel, feet: { L: [x - 40, gy], R: [x + 40, gy] }, hands: o.hands || { L: [x - 90 * k, hy + 300 * k], R: [x + 90 * k, hy + 300 * k] }, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'smile' }, look: o.look || [0, 0], sweat: o.sweat, tears: o.tears, blush: o.blush, glint: o.glint };
}
function bust(kind, x, hy, k, t, o = {}) { return { kind, t, x, hy, k, hk: o.hk, bust: 1, bustL: o.L || 300, hands: o.hands, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'smile' }, look: o.look || [0, 0], sweat: o.sweat, tears: o.tears, blush: o.blush, glint: o.glint }; }
function talking(t, a, b) { return t > a && t < b && BOIL.step % 3 ? 'open' : 'small'; }

// ——— the word meter ———
const BAND = { cyan: ['#47e8f0', '#0f3a44'], red: ['#ff4a4a', '#4a0f12'], green: ['#4cf08a', '#0f3f22'], off: ['#55555f', '#1f1f26'], gold: [K.gold, K.goldL] };
function sglow(x, y, r, col, a, sd = 1) { for (let i = 0; i < 4; i++) poly(GLOW, handCircle(x, y, r * (1 - i * 0.2), sd + i, 0, 30), col, a * 0.32, { seed: sd + i }); }
function fxGlow(x, y, r, col, a, sd = 1) { for (let i = 0; i < 3; i++) dab(FX, x, y, r * (1 - i * 0.28), { col, p: a * 0.3, seed: sd + i }); }
function wristBand(C, arms, side, state, k = arms.k || 1, blink = 1) {   // the band on a forearm (full-body shots)
  const e = arms['e' + side], h = arms[side]; if (!e) return;
  const dx = h[0] - e[0], dy = h[1] - e[1], d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d, nx = -uy, ny = ux;
  const c = [lerp(e[0], h[0], 0.72), lerp(e[1], h[1], 0.72)], hl = 13 * k, hw = 17 * k;
  const q = (a, b) => [c[0] + ux * a + nx * b, c[1] + uy * a + ny * b];
  if (state === 'gold') { part(C, [q(-hl, -hw), q(hl, -hw), q(hl, hw), q(-hl, hw)], { col: K.gold, p: 1, seed: 901 }, { w: 3, col: K.ink, seed: 902 }); return; }
  part(C, [q(-hl, -hw), q(hl, -hw), q(hl, hw), q(-hl, hw)], { col: '#2a2a33', p: 1, seed: 903 }, { w: 3, col: K.ink, seed: 904 });
  const [lit] = BAND[state]; poly(C.l, [q(-hl * 0.6, -hw * 0.55), q(hl * 0.6, -hw * 0.55), q(hl * 0.6, hw * 0.55), q(-hl * 0.6, hw * 0.55)], lit, blink, { seed: 905 });
  if (blink > 0.05) fxGlow(c[0], c[1], 34 * k, lit, blink, 906);
}
function digits(L, str, x, y, size, col, o = {}) {   // digital numbers (world coords unless o.screen)
  const g = L.g, scr = !!o.screen, sz = size * (scr ? 1 : CAM.s);
  g.save(); g.font = `700 ${sz}px "DejaVu Sans Mono", monospace`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.translate(scr ? x : sx(x), scr ? y : sy(y)); if (o.rot) g.rotate(o.rot);
  if (o.glow) { g.shadowColor = col; g.shadowBlur = sz * 0.35; }
  g.globalAlpha = o.p ?? 1; g.fillStyle = col; g.fillText(str, 0, 0); g.restore();
}
function fmt(n) { if (n < 10000) return String(Math.max(0, Math.round(n))).padStart(4, '0'); const s = String(Math.round(n)); const last3 = s.slice(-3), rest = s.slice(0, -3); return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3; }
function bandBig(C, x, y, s, value, state, o = {}) {   // close-up of a wrist with the band (world coords; forearm left→right)
  const skinC = o.skin || K.skinM, sd = o.sd || 950;
  const f = o.flip ? -1 : 1;
  if (!o.noArm) {
    const hx = x + f * 470 * s, hy2 = y - 14 * s;
    for (let i = 0; i < 4; i++) part(C, tube([[hx + f * 40 * s, hy2 - 60 * s + i * 40 * s], [hx + f * 120 * s, hy2 - 66 * s + i * 42 * s]], 40 * s, 34 * s), { col: skinC, p: 1, seed: sd + 20 + i }, { w: 4, col: K.ink, seed: sd + 24 + i });
    part(C, smooth([[hx - f * 60 * s, hy2 - 90 * s], [hx + f * 70 * s, hy2 - 96 * s], [hx + f * 110 * s, hy2 - 20 * s], [hx + f * 80 * s, hy2 + 90 * s], [hx - f * 60 * s, hy2 + 86 * s]], 4), { col: skinC, p: 1, seed: sd + 28 }, { w: 5, col: K.ink, seed: sd + 29 });
    part(C, tube([[x - f * 1300 * s, y + 40 * s], [x + f * 420 * s, y - 10 * s]], 200 * s, 165 * s), { col: skinC, p: 1, seed: sd }, { w: 5, col: K.ink, seed: sd + 1 });
    if (o.sleeve) part(C, tube([[x - f * 1500 * s, y + 44 * s], [x - f * 330 * s, y + 22 * s]], 240 * s, 225 * s), { col: o.sleeve, p: 1, seed: sd + 2 }, { w: 5, col: o.sleeveLine || K.ink, seed: sd + 3 }); }
  const [lit, dark] = BAND[state], bw = 210 * s, bh = 230 * s;
  part(C, rrect(x - bw / 2 - 30 * s, y - bh / 2 - 10 * s, x + bw / 2 + 30 * s, y + bh / 2 + 10 * s, 36 * s), { col: '#2a2a33', p: 1, seed: sd + 4 }, { w: 5, col: K.ink, seed: sd + 5 });
  const scr = rrect(x - bw / 2 - 10 * s, y - bh / 2 + 22 * s, x + bw / 2 + 10 * s, y + bh / 2 - 22 * s, 22 * s);
  part(C, scr, { col: dark, p: 1, seed: sd + 6 }, { w: 6, col: lit, seed: sd + 7 });
  const blink = o.blink ?? 1;
  if (blink > 0.05) sglow(x, y, (o.noArm ? 190 : 300) * s, lit, (o.noArm ? 0.45 : 0.7) * blink, sd + 8);
  const txt = typeof value === 'string' ? value : fmt(value), fs = (txt.length > 6 ? 300 / txt.length : 62) * s * (o.fs || 1);
  if (blink > 0.05) digits(C.l, txt, x, y + 2 * s, fs * 1.1, lit, { glow: 1, p: blink });
  if (o.cap) wtext(C.l, o.cap, x, y + bh / 2 + 90 * s, { size: 46 * s, weight: 700, col: o.capCol || K.ink, seed: sd + 9, tilt: 0 });
}

// ——— props ———
function sketchbook(C, x, y, s, sd = 700, open = 0, page = null) {   // held at (x, y); open: show the drawing page facing camera
  const w = 150 * s, h = 190 * s;
  part(C, rrect(x - w / 2, y - h / 2, x + w / 2, y + h / 2, 10 * s), { col: '#c99a62', p: 1, seed: sd }, { w: 4, col: K.ink, seed: sd + 1 });
  if (open) { part(C, rrect(x - w / 2 + 10 * s, y - h / 2 + 10 * s, x + w / 2 - 10 * s, y + h / 2 - 10 * s, 6 * s), { col: K.white, p: 1, seed: sd + 2 }, null); if (page) page(C, x, y, s); }
  for (let i = 0; i < 7; i++) dab(C.l, x - w / 2 + 4 * s, y - h / 2 + 18 * s + i * 26 * s, 6 * s, { col: '#555', p: 1, seed: sd + 3 + i });
}
function caseFile(C, x, y, s, sd = 720) {
  part(C, smooth([[x - 90 * s, y - 120 * s], [x - 20 * s, y - 120 * s], [x - 6 * s, y - 136 * s], [x + 50 * s, y - 136 * s], [x + 60 * s, y - 120 * s], [x + 90 * s, y - 120 * s], [x + 90 * s, y + 120 * s], [x - 90 * s, y + 120 * s]], 2), { col: '#c58f55', p: 1, seed: sd }, { w: 4, col: K.ink, seed: sd + 1 });
  line(C.l, [[x - 70 * s, y - 40 * s], [x + 60 * s, y - 40 * s]], { w: 4, col: '#8a5f36', seed: sd + 2 });
}
function gavel(C, x, y, s, a = 0, sd = 740) {
  const c = Math.cos(a), si = Math.sin(a), R = (u, v) => [x + u * c - v * si, y + u * si + v * c];
  part(C, tube([R(0, 0), R(0, -150 * s)], 16 * s, 14 * s), { col: K.woodD, p: 1, seed: sd }, { w: 3, col: K.ink, seed: sd + 1 });
  part(C, [R(-60 * s, -150 * s), R(60 * s, -150 * s), R(60 * s, -200 * s), R(-60 * s, -200 * s)], { col: K.wood, p: 1, seed: sd + 2 }, { w: 4, col: K.ink, seed: sd + 3 });
}

// ——— text boxes ———
function box(cx, cy, hw, hh, col = 'rgba(20,19,26,0.93)', L = SUBT) {
  const g = L.g; g.save(); g.fillStyle = col; g.beginPath();
  for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 2, px = Math.cos(a), py = Math.sin(a), sq = Math.pow(Math.abs(px), 0.3) * Math.sign(px), sqy = Math.pow(Math.abs(py), 0.5) * Math.sign(py), nn = 1 + 0.03 * Math.sin(a * 7 + 1.3) + 0.02 * Math.sin(a * 17); g.lineTo(cx + sq * hw * nn, cy + sqy * hh * nn); }
  g.closePath(); g.fill(); g.restore();
}
function tag(x, y, txt, col = K.goldL, size = 40, bg) { const g = SUBT.g; g.save(); g.font = `700 ${size}px Kalam`; const w = g.measureText(txt).width; g.restore(); box(x, y, w / 2 + 22, size * 0.62, bg); wtext(SUBT, txt, x, y + size * 0.36, { screen: true, size, weight: 700, col, seed: 7 + x, tilt: 0 }); }

const finish = (comp, vig = 0.15) => {
  comp.paperCam(CAM.x * 0.6, CAM.y * 0.6, CAM.s / 0.6); comp.clean = true; comp.begin(PAPER);
  comp.crayon(BG.f.c); comp.crayon(BG.l.c); comp.crayon(GLOW.c); comp.group(PE); comp.group(PROP); comp.group(FG); comp.crayon(FX.c); comp.knock(SUBK.c); comp.crayon(SUBT.c);
  comp.finish({ vig, emb: 0, bright: 1, lamp: [0.5, 0.5, 1, 0] });
};
// ═══════════════════════ भाग 1 ═══════════════════════
SPEC.vendor = { top: '#e0893a', len: 420, bottom: '#f1ece0', shoe: '#7d5434', hair: 'short', hairCol: '#241a16', moustache: '#241a16', skin: K.skinO };
SPEC.oldman = { top: '#9db8c9', len: 430, bottom: '#e9e4d8', shoe: '#7d5434', hair: 'balding', hairCol: '#e2ded8', moustache: '#e8e4de', skin: K.skinM, browCol: '#d0cbc4' };

// ——— printed words / voice script (N narrator Sulafat, M Meera, J judge, V Khanna) ———
export const SUBS = [
  { t0: 0.0, t1: 2.0, text: '“जज साहब… ये—”', who: 'M', vo: 'm1', vt: 0.2, words: [0.35, 0.95, 1.55] },
  { t0: 5.3, t1: 10.9, text: 'इस दुनिया में हर इंसान को|पूरी ज़िंदगी के लिए|सिर्फ़ दस लाख लफ़्ज़ मिलते हैं।', who: 'N', vo: 'n1', vt: 5.4 },
  { t0: 11.1, t1: 15.4, text: 'मीटर ज़ीरो…|तो आवाज़ हमेशा के लिए चली जाती है।', who: 'N', vo: 'n2', vt: 11.2 },
  { t0: 19.9, t1: 26.4, text: 'आरव के पास सिर्फ़ बारह सौ लफ़्ज़ थे।|लोग कहते थे,|बचपन में सब बर्बाद कर दिए।', who: 'N', vo: 'n3', vt: 20.0 },
  { t0: 26.6, t1: 33.1, text: 'और मीरा… एक वकील,|जिसने ग़रीबों को इंसाफ़ दिलाने में|अपने लगभग सारे लफ़्ज़ ख़र्च कर दिए।', who: 'N', vo: 'n4', vt: 26.7 },
  { t0: 33.3, t1: 39.8, text: 'बचपन में किसी अनजान ने|अपने लफ़्ज़ देकर उसकी आवाज़ लौटाई थी…|मीरा उसे आज तक ढूँढ रही थी।', who: 'N', vo: 'n5', vt: 33.4 },
  { t0: 40.2, t1: 46.6, text: 'आज मीरा को|अपने बेक़सूर पापा को बचाना था…|पर उसके पास बस पैंतालीस लफ़्ज़ थे।', who: 'N', vo: 'n6', vt: 40.3 },
  { t0: 48.2, t1: 51.5, text: '“माई लॉर्ड, सारे काग़ज़|इसके ख़िलाफ़ हैं!”', who: 'V', vo: 'v1', vt: 48.3 },
  { t0: 51.7, t1: 55.4, text: '“मेरे पापा बेक़सूर हैं।|घोटाला किसी और ने किया।”', who: 'M', vo: 'm2', vt: 51.8, words: [52.0, 52.4, 52.9, 53.5, 54.0, 54.4, 54.8, 55.1] },
  { t0: 58.0, t1: 60.0, text: '“जज साहब… ये—”', who: 'M', vo: 'm1', vt: 58.2, words: [58.35, 58.95, 59.55] },
  { t0: 63.7, t1: 67.4, text: '“कहने को कुछ नहीं?|पाँच मिनट बाद फ़ैसला।”', who: 'J', vo: 'j1', vt: 63.8 },
  { t0: 73.1, t1: 78.7, text: 'मीरा को टूटता देख…|आरव ने अपनी आख़िरी आवाज़ भी|उसके नाम कर दी।', who: 'N', vo: 'n7', vt: 73.2 },
];
// Meera's meter over time (what the HUD shows): 3 → 0 in the hook; 45 → 37 → 3 → 0 in court
function meeraWords(t) {
  const tick = (S, from) => { let v = from; for (const w of S.words) if (t >= w) v--; return v; };
  if (t < 5.3) return tick(SUBS[0], 3);
  if (t < 29.5) return 45;
  if (t < 33.2) return Math.round(lerp(320, 45, eio(pr(t, 29.5, 32.6))));
  if (t < 51.9) return 45;
  if (t < 55.3) return tick(SUBS[8], 45);
  if (t < 58.3) return Math.round(lerp(37, 3, eio(pr(t, 55.4, 58.0))));
  if (t < 70) return tick(SUBS[9], 3);
  return t < 73.0 ? 0 : Math.round(lerp(0, 1200, eio(pr(t, 73.0, 75.4))));
}
const aaravWords = t => t < 73.0 ? 1200 : Math.round(lerp(1200, 0, eio(pr(t, 73.0, 75.4))));

// ——— shots: [t0, t1, set, cam0, cam1] ———
const SHOTS = [
  [0.0, 5.3, 'court', [700, 2760, 1.45], [700, 2760, 1.6]],       // HOOK: Meera, file raised, 0003 → 0000, silence, title
  [5.3, 9.7, 'baby', [6000, 2420, 1.0], [6000, 2420, 1.12]],       // a newborn's wrist lights 10,00,000
  [9.7, 15.6, 'street', [4170, 2760, 0.92], [4200, 2760, 0.98]],     // quiet street: gestures, the rich talk
  [15.6, 21.6, 'cafe', [8000, 2600, 1.0], [8000, 2600, 1.06]],      // उसी सुबह… café: the funny drawing, Meera laughs
  [21.6, 23.4, 'cafe', [7860, 2470, 2.0], [7860, 2470, 2.15]],      // close on the sketchbook: page flip → the hospital-bed drawing (clue)
  [23.4, 26.5, 'cafe', [7700, 2420, 1.35], [7700, 2420, 1.42]],     // Aarav: 1,200
  [26.5, 29.5, 'wrist', [6000, 2420, 1.0], [6000, 2420, 1.1]],      // Meera's band 0045 blinking red
  [29.5, 33.2, 'court', [760, 2700, 1.25], [740, 2700, 1.32]],      // montage: arguing for the poor, numbers falling
  [33.2, 40.0, 'steps', [11380, 2760, 1.25], [11380, 2740, 1.35]],    // Meera looks at her band… who was it?
  [40.0, 43.6, 'steps', [10900, 2560, 0.74], [10950, 2560, 0.8]],
  [43.6, 47.8, 'steps', [10760, 2620, 1.55], [10760, 2620, 1.65]],   // court steps: Papa, the board, Aarav's note
  [47.8, 51.6, 'court', [1350, 2800, 1.2], [1350, 2800, 1.28]],     // Khanna
  [51.6, 55.4, 'court', [700, 2760, 1.3], [700, 2760, 1.38]],       // Meera: "मेरे पापा बेक़सूर हैं…"
  [55.4, 58.0, 'court', [1100, 2560, 0.74], [1100, 2560, 0.8]],     // wide: 37… 18… 08… 03
  [58.0, 61.0, 'court', [700, 2760, 1.5], [700, 2760, 1.62]],       // the file — "जज साहब… ये—" 0000
  [61.0, 63.6, 'court', [1720, 2560, 1.9], [1720, 2560, 2.0]],      // Papa's face
  [63.6, 68.0, 'court', [1100, 2200, 1.4], [1100, 2200, 1.5]],      // the judge: five minutes
  [68.0, 70.2, 'court', [900, 2700, 0.9], [980, 2700, 0.9]],        // Meera runs out crying
  [70.2, 72.6, 'corridor', [14000, 2800, 1.1], [14000, 2800, 1.16]],// Aarav grabs her hand
  [72.6, 76.0, 'wrists', [16000, 2420, 1.0], [16000, 2420, 1.06]],  // bands join: सारे लफ़्ज़ भेजें? → 1,200 ⇄ 0000
  [76.0, 82.1, 'corridor', [14000, 2780, 1.35], [14000, 2780, 1.42]],// his smile through tears, her shock → end card
];
export const DUR = 82.0;
function shotAt(t) { return SHOTS.find(s => t >= s[0] && t < s[1]) || SHOTS[SHOTS.length - 1]; }
const HITS = [[1.6, 10], [59.8, 10], [67.0, 8], [73.0, 6]];
function shake(t) {
  let x = 0, y = 0;
  for (const [h, a] of HITS) { const d = t - h; if (d < 0 || d > 0.5) continue; const e = a * Math.exp(-d / 0.08); x += (hash(BOIL.step * 3.1 + h) - .5) * 2 * e; y += (hash(BOIL.step * 5.7 + h) - .5) * 2 * e; }
  return [x, y];
}

// ——— SET: courtroom ———
function drawCourt(t) {
  const B = BG;
  poly(B.f, rect(-600, 900, 2800, 3000), '#efe3c8', 1, { seed: 10 });
  poly(B.f, rect(-600, 2250, 2800, 3000), K.court, 1, { seed: 11 });
  for (let i = 0; i < 16; i++) line(B.l, [[-500 + i * 210, 2270], [-500 + i * 210, 2990]], { w: 4, col: K.courtD, seed: 12 + i });
  line(B.l, [[-600, 2250], [2800, 2250]], { w: 8, col: K.courtD, seed: 30 });
  poly(B.f, rect(-600, 3000, 2800, 3900), '#b98b5e', 1, { seed: 31 });
  for (let i = 0; i < 7; i++) line(B.l, [[-600, 3060 + i * 120], [2800, 3060 + i * 120]], { w: 3, col: '#9a7048', seed: 32 + i });
  // the balance (justice) on the wall
  const bx = 1100, by = 1380; line(B.l, [[bx, by - 40], [bx, by + 300]], { w: 10, col: K.gold, seed: 40 }); line(B.l, [[bx - 170, by + 20], [bx + 170, by + 20]], { w: 9, col: K.gold, seed: 41 });
  for (const sg of [-1, 1]) { line(B.l, [[bx + sg * 170, by + 20], [bx + sg * 210, by + 150]], { w: 4, col: K.gold, seed: 42 + sg }); line(B.l, [[bx + sg * 170, by + 20], [bx + sg * 130, by + 150]], { w: 4, col: K.gold, seed: 44 + sg }); poly(B.f, smooth([[bx + sg * 170 - 60, by + 150], [bx + sg * 170 + 60, by + 150], [bx + sg * 170, by + 190]], 4), K.gold, 1, { seed: 46 + sg }); }
  poly(B.f, rect(bx - 70, by + 300, bx + 70, by + 330), K.gold, 1, { seed: 48 });
  // the board: court rule (planted)
  poly(B.f, rect(110, 1500, 640, 1860), '#2f4a3a', 1, { seed: 50 }); edge(B.l, rect(110, 1500, 640, 1860), K.woodD, 14, 1, 51);
  wtext(B.l, 'अदालत में दलील', 375, 1640, { size: 52, weight: 700, col: K.white, seed: 52, tilt: 0 });
  wtext(B.l, 'सिर्फ़ वकील की ज़ुबानी', 375, 1730, { size: 52, weight: 700, col: '#ffe9a0', seed: 53, tilt: 0 });
  // the judge's chair back
  poly(B.f, rrect(960, 1760, 1240, 2330, 40), K.maroon, 1, { seed: 55 }); edge(B.l, rrect(960, 1760, 1240, 2330, 40), K.ink, 5, 0.9, 56);
  // clock
  poly(B.f, handCircle(1780, 1450, 90, 57, 0, 30), K.white, 1, { seed: 57 }); edge(B.l, handCircle(1780, 1450, 90, 58, 0, 30), K.woodD, 10, 1, 58);
  const a = t * 0.5; line(B.l, [[1780, 1450], [1780 + Math.sin(a) * 60, 1450 - Math.cos(a) * 60]], { w: 5, col: K.ink, seed: 59 }); line(B.l, [[1780, 1450], [1780 + 38, 1450 - 20]], { w: 7, col: K.ink, seed: 60 });
}
function bench(C) {
  part(C, rect(760, 2340, 1440, 2780), { col: K.courtD, p: 1, seed: 600 }, { w: 5, col: K.ink, seed: 601 });
  part(C, rect(730, 2300, 1470, 2350), { col: K.wood, p: 1, seed: 602 }, { w: 5, col: K.ink, seed: 603 });
  for (const x of [880, 1100, 1320]) line(C.l, [[x - 70, 2420], [x + 70, 2420], [x + 70, 2700], [x - 70, 2700], [x - 70, 2420]], { w: 4, col: '#4a2e1e', seed: 604 + x });
}
function dock(C) {
  part(C, rect(1560, 2790, 1890, 3160), { col: K.court, p: 1, seed: 620 }, { w: 5, col: K.ink, seed: 621 });
  part(C, rect(1540, 2760, 1910, 2800), { col: K.wood, p: 1, seed: 622 }, { w: 5, col: K.ink, seed: 623 });
  for (let i = 0; i < 5; i++) line(C.l, [[1600 + i * 70, 2820], [1600 + i * 70, 3140]], { w: 4, col: K.courtD, seed: 624 + i });
}
function lawTable(C, x0, x1, y, sd) {
  part(C, rect(x0, y, x1, y + 380), { col: '#7d5434', p: 1, seed: sd }, { w: 5, col: K.ink, seed: sd + 1 });
  part(C, rect(x0 - 20, y - 30, x1 + 20, y + 10), { col: K.wood, p: 1, seed: sd + 2 }, { w: 5, col: K.ink, seed: sd + 3 });
}

// ——— SET: a newborn's wrist / Meera's wrist (close-ups) ———
function drawSoft(col) { poly(BG.f, rect(5000, 1000, 7000, 3800), col, 1, { seed: 70 }); for (let i = 0; i < 8; i++) dab(BG.f, 5300 + hash(i * 2.1) * 1400, 1500 + hash(i * 3.3) * 1800, 120 + 80 * hash(i), { col: '#ffffff', p: 0.25, seed: 71 + i }); }

// ——— SET: the quiet street ———
function drawStreet(t) {
  const B = BG;
  poly(B.f, rect(2600, 900, 5600, 3000), '#bfe3ee', 1, { seed: 100 });
  const bl = [[2700, 1500, '#e6c9a8'], [3150, 1250, '#d9b8c8'], [3600, 1600, '#c9d6b0'], [4050, 1150, '#e8d2a0'], [4500, 1450, '#c8c2e0'], [4950, 1300, '#e3b9a0']];
  bl.forEach(([x, top, col], i) => {
    poly(B.f, rect(x, top, x + 430, 3000), col, 1, { seed: 101 + i }); edge(B.l, rect(x, top, x + 430, 3000), K.ink, 4, 0.5, 110 + i);
    for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) { const wy = top + 80 + r * 190; if (wy > 2500) continue; poly(B.f, rect(x + 50 + c * 130, wy, x + 130 + c * 130, wy + 110), '#7fa6c4', 1, { seed: 120 + i * 20 + r * 3 + c }); }
    poly(GLOW, rect(x + 20, top + 30, x + 410, top + 46), i % 2 ? '#47e8f0' : '#ff7ad1', 0.8, { seed: 200 + i });   // neon strip
  });
  // a big floating band hologram
  const hx = 4280, hy = 1350 + Math.sin(t * 1.5) * 20; poly(GLOW, rrect(hx - 170, hy - 70, hx + 170, hy + 70, 40), '#47e8f0', 0.35, { seed: 210 }); edge(B.l, rrect(hx - 170, hy - 70, hx + 170, hy + 70, 40), '#47e8f0', 7, 0.9, 211);
  digits(B.l, '10,00,000', hx, hy, 52, '#47e8f0', { glow: 1 });
  poly(B.f, rect(2600, 2900, 5600, 3200), '#b7b0a6', 1, { seed: 220 }); poly(B.f, rect(2600, 3200, 5600, 3900), '#8d8a86', 1, { seed: 221 });
  for (let i = 0; i < 10; i++) line(B.l, [[2700 + i * 300, 3500], [2850 + i * 300, 3500]], { w: 8, col: '#f1ece0', seed: 222 + i });
}

// ——— SET: café ———
function drawCafe(t) {
  const B = BG;
  poly(B.f, rect(6800, 900, 9200, 2800), '#f2d7b0', 1, { seed: 300 });
  poly(B.f, rect(6800, 2800, 9200, 3900), '#c89a6a', 1, { seed: 301 });
  for (let i = 0; i < 9; i++) line(B.l, [[6800 + i * 300, 2800], [6650 + i * 330, 3900]], { w: 3, col: '#a87c52', seed: 302 + i });
  poly(B.f, smooth([[7300, 2250], [7300, 1500], [7400, 1330], [7600, 1260], [7800, 1330], [7900, 1500], [7900, 2250]], 5), '#fff3d0', 1, { seed: 310 }); edge(B.l, smooth([[7300, 2250], [7300, 1500], [7400, 1330], [7600, 1260], [7800, 1330], [7900, 1500], [7900, 2250]], 5), '#7d5434', 14, 1, 311);
  line(B.l, [[7600, 1270], [7600, 2250]], { w: 8, col: '#7d5434', seed: 312 }); line(B.l, [[7300, 1760], [7900, 1760]], { w: 8, col: '#7d5434', seed: 313 });
  poly(B.f, smooth([[8250, 2250], [8250, 1500], [8350, 1330], [8550, 1260], [8750, 1330], [8850, 1500], [8850, 2250]], 5), '#fff3d0', 1, { seed: 314 }); edge(B.l, smooth([[8250, 2250], [8250, 1500], [8350, 1330], [8550, 1260], [8750, 1330], [8850, 1500], [8850, 2250]], 5), '#7d5434', 14, 1, 315);
  line(B.l, [[8550, 1270], [8550, 2250]], { w: 8, col: '#7d5434', seed: 316 }); line(B.l, [[8250, 1760], [8850, 1760]], { w: 8, col: '#7d5434', seed: 317 });
  for (let i = 0; i < 3; i++) poly(GLOW, [[7330 + i * 180, 1300], [7430 + i * 180, 1300], [7700 + i * 180, 2900], [7560 + i * 180, 2900]], '#ffe9a8', 0.28, { seed: 320 + i });
  // hanging plant
  line(B.l, [[8080, 900], [8080, 1260]], { w: 3, col: K.dgrey, seed: 330 }); poly(B.f, smooth([[8010, 1260], [8150, 1260], [8130, 1350], [8030, 1350]], 3), '#c4693e', 1, { seed: 331 });
  for (let i = 0; i < 7; i++) dab(B.f, 7990 + i * 28, 1250 + Math.sin(i) * 20 + (i % 2) * 60, 26, { col: i % 2 ? '#5fa35a' : '#7cc36e', p: 1, seed: 332 + i });
}
function cafeTable(C) {
  part(C, rect(7980, 2760, 8020, 3200), { col: K.woodD, p: 1, seed: 340 }, { w: 4, col: K.ink, seed: 341 });
  part(C, oval(8000, 3200, 140, 26), { col: K.woodD, p: 1, seed: 342 }, { w: 4, col: K.ink, seed: 343 });
  part(C, smooth([[7640, 2690], [8360, 2690], [8380, 2770], [7620, 2770]], 3), { col: K.wood, p: 1, seed: 344 }, { w: 5, col: K.ink, seed: 345 });
  for (const x of [7930, 8130]) { part(C, rect(x - 24, 2600, x + 24, 2690), { col: '#f6e3c0', p: 0.95, seed: 346 + x }, { w: 3, col: K.ink, seed: 347 + x }); poly(C.f, rect(x - 20, 2630, x + 20, 2686), '#c98a4a', 1, { seed: 348 + x }); }
}
// drawings on the sketchbook page
const pageFunny = (C, x, y, s) => {   // Meera as a superhero lawyer with a cape and a giant file (a joke)
  line(C.l, handCircle(x, y - 40 * s, 22 * s, 760, 0.1, 18), { w: 3.5, col: K.ink, seed: 761 }); line(C.l, [[x, y - 18 * s], [x, y + 40 * s]], { w: 3.5, col: K.ink, seed: 762 });
  line(C.l, [[x - 30 * s, y - 50 * s], [x - 18 * s, y - 70 * s], [x - 6 * s, y - 58 * s]], { w: 3, col: K.ink, seed: 763 });
  poly(C.l, [[x, y - 14 * s], [x - 55 * s, y + 50 * s], [x - 10 * s, y + 40 * s]], K.red, 1, { seed: 764 });
  line(C.l, [[x, y], [x + 40 * s, y - 30 * s]], { w: 3.5, col: K.ink, seed: 765 }); poly(C.l, rect(x + 36 * s, y - 70 * s, x + 66 * s, y - 30 * s), '#c58f55', 1, { seed: 766 });
  line(C.l, [[x, y + 40 * s], [x - 16 * s, y + 70 * s]], { w: 3.5, col: K.ink, seed: 767 }); line(C.l, [[x, y + 40 * s], [x + 16 * s, y + 70 * s]], { w: 3.5, col: K.ink, seed: 768 });
  for (const sg of [-1, 1]) dab(C.l, x + sg * 8 * s, y - 44 * s, 2.5 * s, { col: K.ink, p: 1, seed: 769 + sg }); line(C.l, smooth([[x - 9 * s, y - 32 * s], [x, y - 26 * s], [x + 9 * s, y - 32 * s]], 4, false), { w: 3, col: K.ink, seed: 771 });
};
const pageBed = (C, x, y, s) => {   // the clue: a hospital bed, a small girl, a tiny heart
  line(C.l, [[x - 55 * s, y + 20 * s], [x + 55 * s, y + 20 * s]], { w: 3.5, col: '#555', seed: 780 }); line(C.l, [[x - 55 * s, y - 20 * s], [x - 55 * s, y + 50 * s]], { w: 3.5, col: '#555', seed: 781 }); line(C.l, [[x + 55 * s, y + 5 * s], [x + 55 * s, y + 50 * s]], { w: 3.5, col: '#555', seed: 782 });
  line(C.l, handCircle(x - 30 * s, y + 2 * s, 13 * s, 783, 0.1, 14), { w: 3, col: '#555', seed: 784 }); line(C.l, smooth([[x - 15 * s, y + 8 * s], [x + 20 * s, y], [x + 50 * s, y + 10 * s]], 4, false), { w: 3, col: '#555', seed: 785 });
  const hx = x + 20 * s, hy = y - 50 * s; poly(C.l, smooth([[hx, hy + 14 * s], [hx - 16 * s, hy], [hx - 9 * s, hy - 10 * s], [hx, hy - 3 * s], [hx + 9 * s, hy - 10 * s], [hx + 16 * s, hy]], 3), K.red, 1, { seed: 786 });
};

// ——— SET: court steps (outside) ———
function drawSteps(t) {
  const B = BG;
  poly(B.f, rect(9600, 900, 12400, 3000), '#cfe7f2', 1, { seed: 400 });
  poly(B.f, rect(9900, 1250, 12100, 2700), '#efe6d2', 1, { seed: 401 }); edge(B.l, rect(9900, 1250, 12100, 2700), K.ink, 5, 0.6, 402);
  poly(B.f, [[9850, 1250], [11000, 900], [12150, 1250]], '#e4d8bf', 1, { seed: 403 }); edge(B.l, [[9850, 1250], [11000, 900], [12150, 1250]], K.ink, 5, 0.7, 404);
  for (let i = 0; i < 7; i++) { const x = 10050 + i * 300; poly(B.f, rect(x, 1330, x + 90, 2700), '#f8f2e4', 1, { seed: 405 + i }); line(B.l, [[x, 1330], [x, 2700]], { w: 3, col: '#b8ab92', seed: 412 + i }); line(B.l, [[x + 90, 1330], [x + 90, 2700]], { w: 3, col: '#b8ab92', seed: 419 + i }); }
  poly(B.f, rrect(10850, 1950, 11150, 2700, 20), '#6e4a32', 1, { seed: 430 }); edge(B.l, rrect(10850, 1950, 11150, 2700, 20), K.ink, 5, 0.9, 431);
  for (let i = 0; i < 6; i++) { const y = 2700 + i * 110; poly(B.f, rect(9600, y, 12400, y + 110), i % 2 ? '#d8cfbd' : '#cbc1ad', 1, { seed: 440 + i }); line(B.l, [[9600, y], [12400, y]], { w: 4, col: '#a59a85', seed: 450 + i }); }
  // the board at the gate
  part(PROP, rect(10180, 1880, 10220, 2760), { col: K.woodD, p: 1, seed: 460 }, { w: 4, col: K.ink, seed: 461 });
  part(PROP, rect(9900, 1560, 10500, 1960), { col: '#2f4a3a', p: 1, seed: 462 }, { w: 10, col: K.woodD, seed: 463 });
  wtext(PROP.l, 'अदालत में दलील', 10200, 1720, { size: 62, weight: 700, col: K.white, seed: 464, tilt: 0 });
  wtext(PROP.l, 'सिर्फ़ वकील की ज़ुबानी', 10200, 1830, { size: 62, weight: 700, col: '#ffe9a0', seed: 465, tilt: 0 });
}

// ——— SET: corridor ———
function drawCorridor(t) {
  const B = BG;
  poly(B.f, rect(12800, 900, 15200, 3900), '#e9dcc0', 1, { seed: 500 });
  poly(B.f, [[12800, 3900], [13700, 2700], [14300, 2700], [15200, 3900]], '#a8916e', 1, { seed: 501 });
  poly(B.f, rect(13700, 1500, 14300, 2700), '#d9cba9', 1, { seed: 502 });
  for (const [a, b] of [[[12800, 900], [13700, 1500]], [[15200, 900], [14300, 1500]], [[12800, 3900], [13700, 2700]], [[15200, 3900], [14300, 2700]]]) line(B.l, [a, b], { w: 5, col: '#8c7a5c', seed: 503 + a[0] + b[1] });
  poly(B.f, rect(13880, 1800, 14120, 2700), '#fff4d0', 1, { seed: 510 }); sglow(14000, 2300, 420, '#fff2c0', 0.5, 511);
  for (const sg of [-1, 1]) { const x0 = sg < 0 ? 12950 : 14750; poly(B.f, rect(x0, 1700, x0 + 300, 2900), '#7d5434', 1, { seed: 520 + sg }); edge(B.l, rect(x0, 1700, x0 + 300, 2900), K.ink, 5, 0.8, 522 + sg); }
}

// ——— HUD: the word meter on screen ———
function hud(x, y, value, state, who, sc = 1, blink = 1) {
  const [lit] = BAND[state];
  box(x, y, 190 * sc, 74 * sc, 'rgba(14,14,20,0.94)');
  const g = SUBT.g; g.save(); g.strokeStyle = lit; g.lineWidth = 5 * sc; g.globalAlpha = 0.9; g.beginPath(); g.roundRect(x - 172 * sc, y - 58 * sc, 344 * sc, 116 * sc, 22 * sc); g.stroke(); g.restore();
  if (blink > 0.05) digits(SUBT, fmt(value), x, y + 4 * sc, 84 * sc, lit, { screen: true, glow: 1, p: blink });
  if (who) { const nw = 26 + 22 * who.length; box(x - 120 * sc, y - 88 * sc, nw / 2 * sc + 12, 28 * sc, lit); wtext(SUBT, who, x - 120 * sc, y - 76 * sc, { screen: true, size: 36 * sc, weight: 700, col: K.ink, seed: 5, tilt: 0 }); }
}
function timer(t) {   // 05:00 from 67.3 s, real time
  if (t < 67.3) return;
  const left = Math.max(0, 300 - (t - 67.3)), mm = Math.floor(left / 60), ss2 = Math.floor(left % 60), u = back1(pr(t, 67.3, 67.7));
  box(190, 560, 140 * u + 1, 52 * u + 1, 'rgba(120,10,20,0.95)');
  digits(SUBT, `${String(mm).padStart(2, '0')}:${String(ss2).padStart(2, '0')}`, 190, 564, 66 * u + 1, '#ffffff', { screen: true });
}

// ——— printed words: big, high-contrast, top third ———
const SUBY = 280;
const SUBCOL = { N: K.white, M: '#ffb3c6', J: '#b8f0c0', V: '#ffe46b' };
const WHO = { M: 'मीरा', J: 'जज साहब', V: 'खन्ना वकील' };
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
const LABELS = [[2.0, 3.0, 'आवाज़ ग़ायब…'], [15.7, 18.6, 'उसी सुबह…'], [60.0, 61.0, 'आवाज़ ग़ायब…']];
const END = 78.8;
function badge(t) { if (t > END) return; const x = 905, y = 560; box(x, y, 118, 40, 'rgba(160,30,40,0.92)'); wtext(SUBT, 'भाग 1/2', x, y + 16, { screen: true, size: 46, weight: 700, col: K.white, seed: 3, tilt: 0 }); }
function labels(t) {
  const L = LABELS.find(l => t >= l[0] && t < l[1]);
  if (L) { box(540, 1690, 330, 60); wtext(SUBT, L[2], 540, 1712, { screen: true, size: 62, weight: 700, col: K.note, reveal: pr(t, L[0] + 0.1, L[0] + 0.5), seed: 61 + L[0], tilt: 0 }); }
  if (t > 3.0 && t < 5.3) {   // title
    const u = back1(pr(t, 3.0, 3.3)), gl = t < 3.6 && BOIL.step % 2 ? 8 : 0;
    box(540, 1500, 330 * u + 1, 110 * u + 1, 'rgba(14,14,20,0.95)');
    digits(SUBT, '0000', 540 + gl, 1505, 170 * u + 1, '#ff4a4a', { screen: true, glow: 1 });
    const v = back1(pr(t, 3.5, 3.8)); box(540, 1660, 300 * v + 1, 52 * v + 1);
    wtext(SUBT, 'लफ़्ज़ों का क़र्ज़', 540, 1684, { screen: true, size: 70 * v + 1, weight: 700, col: K.goldL, seed: 81, tilt: 0 });
    const w = back1(pr(t, 3.9, 4.2)); box(540, 1770, 110 * w + 1, 42 * w + 1, 'rgba(160,30,40,0.95)');
    wtext(SUBT, 'भाग 1', 540, 1792, { screen: true, size: 56 * w + 1, weight: 700, col: K.white, seed: 82, tilt: 0 });
  }
}
function endCard(t) {
  if (t < END) return;
  const g = SUBT.g; g.save(); g.fillStyle = 'rgba(20,19,26,0.94)'; g.fillRect(0, 1180, W, 740); g.restore();
  wtext(SUBT, 'आरव के पास सिर्फ़', 540, 1300, { screen: true, size: 70, weight: 700, col: K.bone, reveal: pr(t, END + 0.05, END + 0.4), seed: 90, tilt: 0 });
  wtext(SUBT, '1,200 लफ़्ज़ ही क्यों थे?', 540, 1395, { screen: true, size: 76, weight: 700, col: K.goldL, reveal: pr(t, END + 0.3, END + 0.7), seed: 91, tilt: 0 });
  wtext(SUBT, 'अपना अंदाज़ा कमेंट करो', 540, 1490, { screen: true, size: 54, weight: 700, col: '#ffb3c6', reveal: pr(t, END + 0.7, END + 1.1), seed: 92, tilt: 0 });
  const u = back1(pr(t, END + 1.2, END + 1.5)); box(540, 1610, 360 * u + 1, 56 * u + 1, 'rgba(160,30,40,0.97)');
  wtext(SUBT, 'भाग 2 · कल शाम 7:30', 540, 1634, { screen: true, size: 64 * u + 1, weight: 700, col: K.white, seed: 93, tilt: 0 });
  wtext(SUBT, 'Follow करो · @pannapalatkahani', 540, 1740, { screen: true, size: 50, weight: 700, col: K.note, reveal: pr(t, END + 1.6, END + 2.0), seed: 94, tilt: 0 });
}

// ——— events for the mixer ———
export const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
SUBS.forEach(S => { if (S.vo) ev(S.vt, 'voice', { id: S.vo, who: S.who }); if (S.words) S.words.forEach(w => ev(w, 'tick')); });
ev(1.6, 'zero'); ev(3.0, 'glitch'); ev(5.3, 'whoosh'); ev(5.6, 'sparkle', { dur: 2 }); ev(9.7, 'whoosh'); ev(9.7, 'city', { dur: 5.9 }); ev(15.6, 'whoosh'); ev(15.6, 'cafe', { dur: 10.9 });
ev(18.4, 'laugh'); ev(21.9, 'page'); ev(26.5, 'whoosh'); ev(26.6, 'beep', { dur: 3 }); ev(29.6, 'ticks', { dur: 3.0 }); ev(33.2, 'whoosh'); ev(40.0, 'birds', { dur: 7.8 }); ev(44.6, 'page');
ev(47.8, 'whoosh'); ev(55.4, 'ticks', { dur: 2.6 }); ev(59.8, 'zero'); ev(61.0, 'heartbeat', { dur: 2.6 }); ev(67.0, 'gavel'); ev(67.3, 'heartbeat', { dur: 11.5 }); ev(67.3, 'clock', { dur: 14 });
ev(70.2, 'whoosh'); ev(72.0, 'join'); ev(73.0, 'transfer', { dur: 2.4 }); ev(75.4, 'ding'); ev(END, 'write', { dur: 1.6 });
[['A', 0], ['B', 5.3], ['C', 9.7], ['D', 15.6], ['E', 26.5], ['F', 33.2], ['G', 40.0], ['H', 47.8], ['I', 55.4], ['J', 58.0], ['K', 61.0], ['L', 63.6], ['M', 67.3], ['N', 70.2], ['O', 73.0], ['P', 76.0], ['Z', END]].forEach(([id, t]) => ev(t, 'cue', { id }));

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
  const spk = (a, b) => talking(t, a, b) === 'open';
  const flash = (t0, d, col = '#ff2a2a', a0 = 0.55) => { if (t > t0 && t < t0 + d) { const g = FX.g; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a0 * (1 - pr(t, t0, t0 + d)); g.fillStyle = col; g.fillRect(0, 0, W, H); g.restore(); } };
  const mw = meeraWords(t), mState = mw === 0 ? 'red' : mw < 100 ? 'red' : 'cyan', blinkR = mw < 100 ? (Math.sin(t * 9) > -0.3 ? 1 : 0.25) : 1;
  const tagW = (x, y, txt, col, size = 40) => tag(sx(x), sy(y), txt, col, size);
  if (set === 'court') {
    drawCourt(t);
    const judging = t >= 63.6 && t < 68.0, gu = pr(t, 66.6, 67.0), ga = judging ? (t < 66.6 ? -0.2 : t < 67.0 ? lerp(-0.9, 0.35, ei(gu)) : 0.35) : 0.3;
    const ja = person3(PE, seat('judge', 1100, t, { hy: 2080, k: 0.9, exp: judging ? { eyes: 'half', brows: 'down', mouth: spk(63.8, 67.2) ? 'open' : 'flat' } : { eyes: 'open', brows: 'down', mouth: 'flat' }, look: [-0.5, 0.3], hands: { L: [1040, 2300], R: [1190, judging && t < 67.0 && t > 66.6 ? 2200 : 2290] } }), 600);
    bench(PROP); gavel(PROP, ja.R[0], ja.R[1] + 6, 0.85, ga, 740);
    const papaScared = t >= 58.0;
    person3(PE, seat('papa', 1720, t, { hy: 2470, k: 0.85, exp: papaScared ? { eyes: t > 61 ? 'teary' : 'pop', brows: 'worried', mouth: t > 61 ? 'sad' : 'o' } : { eyes: 'sad', brows: 'worried', mouth: 'small' }, tears: t > 61.8, look: [-1, 0.2], hands: { L: [1650, 2760], R: [1790, 2760] } }), 900);
    dock(PROP);
    // Khanna
    const kTalk = t >= 47.8 && t < 51.6;
    const kx = 1350, kgy = 3420, kk = 1.08, khy = kgy - AH * kk;
    const ka = person3(FG, stand('khanna', kx, kgy, kk, t, { exp: kTalk ? { eyes: 'half', brows: 'angry', mouth: spk(48.3, 51.4) ? 'yell' : 'knowing' } : t >= 58.0 ? { eyes: 'half', brows: 'calm', mouth: 'knowing' } : { eyes: 'open', brows: 'angry', mouth: 'flat' }, look: kTalk ? [-0.3, -0.5] : [-1, 0], hands: kTalk ? { L: [kx - 90 * kk, khy + 300 * kk], R: [kx - 170 * kk, khy + 150 * kk] } : { L: [kx - 80 * kk, khy + 330 * kk], R: [kx + 70 * kk, khy + 320 * kk] } }), 700);
    wristBand(FG, ka, 'R', 'cyan');
    lawTable(FG, 1180, 1640, 3060, 650);
    // Meera
    const mx = 660, mgy = 3400, mk = 1.08, mhy = mgy - AH * mk;
    const hook = t < 5.3 || (t >= 58.0 && t < 61.0), zero = mw === 0, running = t >= 68.0;
    let exp, hands, tears = false, look = [0.6, -0.4];
    const raised = { L: [mx - 80 * mk, mhy + 330 * mk], R: [mx + 150 * mk, mhy + 40 * mk] };
    if (hook) { exp = zero ? { eyes: 'pop', brows: 'up', mouth: BOIL.step % 4 < 2 ? 'o' : 'open' } : { eyes: 'open', brows: 'worried', mouth: talking(t, 0.2, 1.6) === 'open' || talking(t, 58.2, 59.7) === 'open' ? 'open' : 'small' }; hands = raised; }
    else if (t < 33.2) { exp = { eyes: 'open', brows: 'angry', mouth: BOIL.step % 3 ? 'open' : 'small' }; hands = { L: [mx - 80 * mk, mhy + 330 * mk], R: [mx + 160 * mk, mhy + 160 * mk] }; look = [0.7, -0.2]; }
    else if (t < 51.6) { exp = { eyes: 'sad', brows: 'worried', mouth: 'flat' }; hands = { L: [mx - 20 * mk, mhy + 280 * mk], R: [mx + 60 * mk, mhy + 300 * mk] }; look = [0.8, -0.2]; }
    else if (t < 55.4) { exp = { eyes: 'open', brows: 'worried', mouth: spk(51.8, 55.2) ? 'open' : 'small' }; hands = { L: [mx + 10 * mk, mhy + 210 * mk], R: [mx + 140 * mk, mhy + 250 * mk] }; }
    else if (t < 58.0) { exp = { eyes: 'teary', brows: 'worried', mouth: BOIL.step % 3 ? 'open' : 'small' }; hands = { L: [mx - 80 * mk, mhy + 330 * mk], R: [mx + 170 * mk, mhy + 120 * mk] }; }
    else if (t < 68.0) { exp = { eyes: t > 62.5 ? 'squeeze' : 'pop', brows: 'sad', mouth: t > 62.5 ? 'cry' : 'o' }; hands = { L: [mx - 20 * mk, mhy + 120 * mk], R: [mx + 40 * mk, mhy + 110 * mk] }; tears = t > 62.5; look = [0.3, 0.3]; }
    if (!running) {
      const ma = person3(FG, stand('meera', mx, mgy, mk, t, { exp, look, hands, tears, sweat: t >= 55.4 && t < 58 }), 300);
      if (hook || (t >= 55.4 && t < 58)) caseFile(FG, ma.R[0] + 10, ma.R[1] - 70, 0.55, 720);
      if (hook) wtext(FG.l, 'CCTV', ma.R[0] + 10, ma.R[1] - 70, { size: 40, weight: 700, col: K.ink, seed: 730, tilt: 0 });
      wristBand(FG, ma, 'L', mState, mk, blinkR);
      lawTable(FG, 420, 900, 3060, 640);
    } else {   // running out (crying), left → right across the shot
      const rx = lerp(700, 1500, pr(t, 68.0, 70.2)), ph = Math.sin(t * 14);
      const ma = person3(FG, stand('meera', rx, 3420, mk, t, { exp: { eyes: 'squeeze', brows: 'sad', mouth: 'cry' }, tears: 1, look: [1, 0], feet: { L: [rx - 60 + ph * 50, 3420], R: [rx + 60 - ph * 50, 3420] }, hands: { L: [rx - 20, 3420 - AH * mk + 120], R: [rx + 40, 3420 - AH * mk + 110] } }), 300);
      wristBand(FG, ma, 'L', 'red', mk, 0.2);
    }
    if (t >= 59.8 && t < 61) flash(59.8, 0.6);
    if (t < 5.3) flash(1.6, 0.6);
    if (t < 5.3 || (t >= 51.6 && t < 61.0)) hud(540, 1560, mw, mState, 'मीरा', 1, blinkR);
    if (t >= 29.5 && t < 33.2) hud(540, 1560, mw, mw < 100 ? 'red' : 'cyan', 'मीरा', 1, 1);
    if (kTalk) hud(540, 1560, Math.round(450000 - 8 * pr(t, 48.3, 51.4)), 'cyan', 'खन्ना वकील', 1);
    vig = hook && zero ? 0.32 : 0.18;
  } else if (set === 'baby' || set === 'wrist') {
    if (set === 'baby') {
      drawSoft('#f8e1e8');
      const u = pr(t, 5.8, 7.0);
      bandBig(PE, 6060, 2500, 0.8, u < 0.05 ? '' : '10,00,000', 'cyan', { skin: '#f2c3a6', sleeve: '#ffffff', blink: u, fs: 1.25 });
      for (let i = 0; i < 18; i++) { const w = ((t - 5.3) * 0.25 + hash(i * 2.1)) % 1; dab(FX, 5700 + hash(i * 1.3) * 700, 2700 - w * 900, 8, { col: i % 2 ? '#bff8ff' : K.white, p: Math.sin(Math.PI * w) * u, seed: 60 + i }); }
    } else {
      drawSoft('#e8e3ef');
      bandBig(PE, 6060, 2500, 0.9, 45, 'red', { skin: K.skinM, sleeve: K.coat, sleeveLine: '#5a5866', blink: Math.sin(t * 9) > -0.3 ? 1 : 0.25 });
      if (t > 27.3) tagW(6060, 2200, 'सिर्फ़ 45 लफ़्ज़ बाक़ी', '#ff8a8a', 50);
    }
    vig = 0.14;
  } else if (set === 'street') {
    drawStreet(t);
    const k = 0.92, gy = 3260;
    const ka = person3(PE, stand('khanna', 3760, gy, k, t, { exp: { eyes: 'happy', brows: 'up', mouth: BOIL.step % 3 ? 'grin' : 'open' }, look: [1, 0], hands: { L: [3760 - 70, gy - AH * k + 300], R: [3760 + 190, gy - AH * k + 200] } }), 700);
    wristBand(PE, ka, 'R', 'cyan', k);
    const ox = 4230, oa = person3(PE, stand('oldman', ox, gy, k, t, { exp: { eyes: 'sad', brows: 'worried', mouth: 'flat' }, look: [-1, 0], hands: { L: [ox - 60, gy - AH * k + 330], R: [ox + 40, gy - AH * k + 150 + Math.sin(t * 6) * 20] } }), 800);
    wristBand(PE, oa, 'R', 'red', k, Math.sin(t * 9) > 0 ? 1 : 0.3);
    const vx = 4640, va = person3(PE, stand('vendor', vx, gy, k, t, { exp: { eyes: 'open', brows: 'up', mouth: 'smile' }, look: [-1, 0], hands: { L: [vx - 150, gy - AH * k + 120 + Math.sin(t * 5) * 30], R: [vx + 60, gy - AH * k + 320] } }), 900);
    wristBand(PE, va, 'L', 'cyan', k);
    part(PROP, rect(4740, 2750, 5040, 3000), { col: '#c4693e', p: 1, seed: 905 }, { w: 4, col: K.ink, seed: 906 });   // tea stall box
    for (let i = 0; i < 3; i++) part(PROP, rect(4780 + i * 80, 2690, 4820 + i * 80, 2750), { col: '#f6e3c0', p: 1, seed: 907 + i }, { w: 3, col: K.ink, seed: 910 + i });
    if (t > 10.4) tagW(3760, 3380, '4,50,000', '#47e8f0', 44);
    if (t > 11.2) tagW(4230, 3380, '0000', '#ff6a6a', 44);
    if (t > 12.0) tagW(4640, 3380, 'इशारों में बात', K.goldL, 40);
    vig = 0.12;
  } else if (set === 'cafe') {
    drawCafe(t);
    const ax = 7620, ahy = 2290, ak = 1.0, mx = 8400, mhy = 2290, mk = 1.0;
    for (const cx of [ax, mx]) { poly(BG.f, rrect(cx - 120, 2440, cx + 120, 2900, 30), '#8a5a3a', 1, { seed: 350 + cx }); edge(BG.l, rrect(cx - 120, 2440, cx + 120, 2900, 30), K.ink, 5, 0.9, 351 + cx); poly(BG.f, rect(cx - 150, 2880, cx + 150, 2930), '#6e4a32', 1, { seed: 352 + cx }); for (const sg of [-1, 1]) poly(BG.f, rect(cx + sg * 130 - 12, 2930, cx + sg * 130 + 12, 3250), '#6e4a32', 1, { seed: 353 + cx + sg }); }
    const laughing = t > 18.0 && t < 21.6, clueShot = t >= 21.6 && t < 23.4;
    const aa = person3(PE, seat('aarav', ax, t, { hy: ahy, k: ak, exp: t > 18 ? { eyes: 'happy', brows: 'up', mouth: 'smile' } : { eyes: 'open', brows: 'calm', mouth: 'small' }, look: [1, 0.3], hands: { L: [7780, 2580], R: [7880, 2560] }, glint: 1 }), 100);
    const flipped = t > 22.2;
    sketchbook(PE, 7860, 2470, 1.0, 700, 1, clueShot && flipped ? pageBed : pageFunny);
    if (clueShot && t > 21.9 && t < 22.5) { const u = pr(t, 21.9, 22.5); line(FX, [[7790 + 140 * u, 2390], [7790 + 140 * u, 2560]], { w: 6, col: '#8a6a4a', seed: 760 }); }
    wristBand(PE, aa, 'L', 'cyan', ak);
    const ma = person3(PE, seat('meera', mx, t, { hy: mhy, k: mk, exp: laughing ? { eyes: 'happy', brows: 'up', mouth: 'grin' } : t < 18 ? { eyes: 'open', brows: 'calm', mouth: 'smile' } : { eyes: 'open', brows: 'calm', mouth: 'smile' }, blush: laughing, look: [-1, 0.3], hands: laughing ? { L: [8330, 2390], R: [8480, 2600] } : { L: [8280, 2600], R: [8480, 2600] } }), 300);
    wristBand(PE, ma, 'R', 'red', mk, Math.sin(t * 9) > -0.3 ? 1 : 0.3);
    cafeTable(FG);
    if (laughing && t > 18.6) tag(780, 1500, 'हँसी मुफ़्त है!', K.goldL, 48);
    if (t >= 23.4) tag(540, 1560, 'सिर्फ़ 1,200 लफ़्ज़', '#47e8f0', 56);
    if (clueShot && flipped) tagW(7860, 2340, '?', K.red, 40);
    vig = 0.12;
  } else if (set === 'steps') {
    drawSteps(t);
    const close = t < 40.0;
    const px = 11000, pgy = 2700, pk = 0.62;
    const pa = person3(PE, stand('papa', px, pgy, pk, t, { exp: { eyes: 'sad', brows: 'worried', mouth: 'sad' }, look: [-0.5, 0.2], hands: { L: [px - 20, pgy - AH * pk + 250 * pk], R: [px + 20, pgy - AH * pk + 255 * pk] } }), 900);
    wristBand(PE, pa, 'L', 'cyan', pk);
    const ax = 10620, agy = 3330, ak = 1.0, ahy = agy - AH * ak;
    const noteUp = t > 43.6;
    const aa = person3(FG, stand('aarav', ax, agy, ak, t, { exp: noteUp ? { eyes: 'open', brows: 'worried', mouth: 'small' } : { eyes: 'open', brows: 'worried', mouth: 'small' }, look: [1, -0.2], glint: 1, hands: noteUp ? { L: [ax + 100, ahy + 250], R: [ax + 250, ahy + 250] } : { L: [ax - 70, ahy + 330], R: [ax + 110, ahy + 280] } }), 100);
    sketchbook(FG, noteUp ? ax + 175 : aa.R[0] + 10, noteUp ? ahy + 120 : aa.R[1] + 20, noteUp ? 1.25 : 0.5, 700, noteUp ? 1 : 0);
    if (noteUp) { wtext(FG.l, 'सिर्फ़ ज़रूरी', ax + 180, ahy + 60, { size: 30, weight: 700, col: K.ink, seed: 790, tilt: 0 }); wtext(FG.l, 'बोलना।', ax + 180, ahy + 100, { size: 30, weight: 700, col: K.ink, seed: 791, tilt: 0 }); wtext(FG.l, 'सबूत', ax + 180, ahy + 150, { size: 32, weight: 700, col: K.red, seed: 792, tilt: 0 }); wtext(FG.l, 'दिखाना।', ax + 180, ahy + 190, { size: 32, weight: 700, col: K.red, seed: 793, tilt: 0 }); }
    wristBand(FG, aa, 'L', 'cyan', ak);
    const mx = 11380, mgy = 3330, mk = 1.0, mhy = mgy - AH * mk, nod = t > 45.6 && t < 46.6 ? Math.sin(pr(t, 45.6, 46.6) * Math.PI * 2) * 12 : 0;
    const ms = stand('meera', mx, mgy, mk, t, { exp: close ? { eyes: t > 36.5 ? 'teary' : 'sad', brows: 'worried', mouth: 'small' } : t > 45.6 ? { eyes: 'open', brows: 'worried', mouth: 'flat' } : { eyes: 'sad', brows: 'worried', mouth: 'small' }, look: close ? [-0.2, 0.7] : [-1, -0.1], hands: close ? { L: [mx - 10, mhy + 260], R: [mx + 70, mhy + 300] } : { L: [mx - 70, mhy + 290], R: [mx + 80, mhy + 320] } });
    ms.hy += nod;
    const ma = person3(FG, ms, 300);
    if (!close) caseFile(FG, ma.R[0] + 6, ma.R[1] + 30, 0.42, 720);
    wristBand(FG, ma, 'L', 'red', mk, Math.sin(t * 9) > -0.3 ? 1 : 0.3);
    if (close && t > 36.2) tagW(11380, 2350, 'कौन था वो?', '#ffb3c6', 52);
    if (!close && t > 41.0 && t < 43.6) tagW(11000, 2800, 'पापा पर झूठा घोटाला', '#ff9a8a', 40);
    if (!close && t > 42.2 && t < 43.6) tagW(10200, 2060, 'अदालत का नियम', K.goldL, 38);
    if (!close && t > 40.4 && t < 43.6) hud(540, 1580, 45, 'red', 'मीरा', 0.8, Math.sin(t * 9) > -0.3 ? 1 : 0.25);
    vig = 0.12;
  } else if (set === 'corridor') {
    drawCorridor(t);
    const after = t >= 76.0, ax = 13720, mx = 14280, gy = 3330, k = 1.05, hy = gy - AH * k;
    const grab = t > 71.0;
    const aa = person3(FG, stand('aarav', after ? ax : lerp(13300, ax, eo(pr(t, 70.2, 71.2))), gy, k, t, { exp: after ? { eyes: 'teary', brows: 'worried', mouth: 'smile' } : { eyes: 'open', brows: 'worried', mouth: 'small' }, tears: after && t > 77, look: [1, -0.2], glint: 1, hands: grab ? { L: [ax - 70, hy + 330], R: [ax + 200, hy + 300] } : { L: [ax - 70, hy + 330], R: [ax + 80, hy + 300] } }), 100);
    wristBand(FG, aa, 'R', after ? 'red' : 'cyan', k, after ? 1 : 1);
    const ma = person3(FG, stand('meera', mx, gy, k, t, { exp: after ? { eyes: 'pop', brows: 'up', mouth: 'o' } : { eyes: 'squeeze', brows: 'sad', mouth: 'cry' }, tears: !after || t > 77.5, look: [-1, -0.2], hands: grab ? { L: [mx - 200, hy + 300], R: [mx + 70, hy + 320] } : { L: [mx - 20, hy + 120], R: [mx + 40, hy + 110] } }), 300);
    wristBand(FG, ma, 'L', after ? 'green' : 'red', k, after ? 1 : 0.3);
    if (after) { hud(300, 1580, 0, 'red', 'आरव', 0.75, 1); hud(780, 1580, 1200, 'green', 'मीरा', 0.75, 1); }
    vig = 0.2;
  } else if (set === 'wrists') {
    drawSoft('#1e1d2a');
    const u = pr(t, 73.0, 75.4), aw = aaravWords(t), mwv = meeraWords(t);
    bandBig(PE, 15720, 2620, 0.55, aw, aw === 0 ? 'red' : 'cyan', { skin: K.skinO, sleeve: K.navy, sd: 980 });
    bandBig(PROP, 16280, 2620, 0.55, mwv, mwv > 0 ? 'green' : 'red', { skin: K.skinM, sleeve: K.coat, sleeveLine: '#5a5866', flip: 1, sd: 1000 });
    if (t > 73.0 && t < 75.6) for (let i = 0; i < 20; i++) { const w = ((t - 73) * 1.4 + i / 20) % 1; dab(FX, lerp(15720, 16280, w), 2620 - Math.sin(Math.PI * w) * 140, 10, { col: '#bff8ff', p: Math.sin(Math.PI * w), seed: 1100 + i }); }
    if (t < 73.4) {   // the popup
      const v = back1(pr(t, 72.7, 73.0)); const pop = rrect(15730, 2080, 16270, 2380, 30);
      poly(FX, pop, 'rgba(14,14,20,0.95)', 1, { seed: 1110 }); edge(FX, pop, '#47e8f0', 6, 1, 1111);
      wtext(FX, 'सारे लफ़्ज़ भेजें?', 16000, 2190, { size: 60 * v + 1, weight: 700, col: K.white, seed: 1112, tilt: 0 });
      const press = t > 72.95; poly(FX, rrect(15900, 2240, 16100, 2340, 24), press ? '#2bd36e' : '#4cf08a', 1, { seed: 1113 });
      wtext(FX, 'भेजें', 16000, 2310, { size: 48, weight: 700, col: K.ink, seed: 1114, tilt: 0 });
    }
    hud(300, 1580, aw, aw === 0 ? 'red' : 'cyan', 'आरव', 0.75, 1); hud(780, 1580, mwv, mwv > 0 ? 'green' : 'red', 'मीरा', 0.75, 1);
    if (t > 75.4) flash(75.4, 0.5, '#4cf08a', 0.35);
    vig = 0.22;
  }
  badge(t); timer(t);
  if (!NOSUBS) { subTo(t); labels(t); }
  else if (t > 3.0 && t < 5.3) labels(t);
  endCard(t);
  finish(comp, vig);
}

export function testFrame(comp, t, test) {
  [PE, PROP, FG].forEach(clearGroup); [BG.f, BG.l, GLOW, FX, SUBK, SUBT].forEach(clear); BOIL.amp = 0;
  CAM.x = 20000; CAM.y = 2400; CAM.s = 1.0;
  const W0 = 19460, H0 = 1440;   // world = screen + (W0, H0) at s = 1
  const title = (a, b) => { box(540, 120, 500, 92); wtext(SUBT, a, 540, 128, { screen: true, size: 70, weight: 700, col: K.goldL, seed: 1, tilt: 0 }); wtext(SUBT, b, 540, 188, { screen: true, size: 38, weight: 700, col: K.white, seed: 2, tilt: 0 }); };
  poly(BG.f, rect(19000, 1000, 21000, 3800), '#f4ead6', 1, { seed: 1 });
  if (test === 'cast') {
    const lab = (x, y, a, b) => { tag(x, y, a, K.goldL, 46); if (b) wtext(SUBT, b, x, y + 62, { screen: true, size: 32, weight: 700, col: '#3a3440', seed: 3 + x, tilt: 0 }); };
    // row 1: the leads
    const ak = 0.78, ax = W0 + 270, agy = H0 + 950;
    const aa = person3(PE, stand('aarav', ax, agy, ak, t, { exp: { eyes: 'open', brows: 'calm', mouth: 'smile' }, look: [0.3, 0], hands: { L: [ax - 70 * ak, agy - AH * ak + 330 * ak], R: [ax + 120 * ak, agy - AH * ak + 280 * ak] } }), 100);
    sketchbook(PE, aa.R[0] + 10, aa.R[1] + 20, 0.5, 700);
    wristBand(PE, aa, 'L', 'cyan');
    const mk = 0.78, mx = W0 + 800, mgy = H0 + 950;
    const ma = person3(PROP, stand('meera', mx, mgy, mk, t, { exp: { eyes: 'open', brows: 'worried', mouth: 'small' }, look: [-0.3, 0], hands: { L: [mx - 40 * mk, mgy - AH * mk + 250 * mk], R: [mx + 80 * mk, mgy - AH * mk + 320 * mk] } }), 300);
    caseFile(PROP, ma.L[0] + 6, ma.L[1] + 30, 0.42, 720);
    wristBand(PROP, ma, 'R', 'red');
    lab(W0 + 270 - W0, 1010, 'आरव · 24', 'गोल चश्मा · स्केचबुक · बोलता नहीं');
    lab(800, 1010, 'मीरा · 23', 'वकील · काला कोट + सफ़ेद बैंड्स');
    // row 2
    const k2 = 0.54, gy2 = H0 + 1490;
    const pa = person3(FG, stand('papa', W0 + 175, gy2, k2, t, { exp: { eyes: 'sad', brows: 'worried', mouth: 'small' } }), 500); wristBand(FG, pa, 'L', 'cyan');
    const ja = person3(FG, stand('judge', W0 + 540, gy2, k2, t, { exp: { eyes: 'half', brows: 'down', mouth: 'flat' }, hands: { L: [W0 + 540 - 42 * k2, gy2 - AH * k2 + 300 * k2], R: [W0 + 540 + 90 * k2, gy2 - AH * k2 + 250 * k2] } }), 600);
    gavel(FG, ja.R[0], ja.R[1] + 10, 0.5, 0.3); wristBand(FG, ja, 'L', 'cyan');
    const ka = person3(FG, stand('khanna', W0 + 905, gy2, k2, t, { exp: { eyes: 'half', brows: 'angry', mouth: 'knowing' }, hands: { L: [W0 + 905 - 80 * k2, gy2 - AH * k2 + 330 * k2], R: [W0 + 905 + 60 * k2, gy2 - AH * k2 + 340 * k2] } }), 700);
    wristBand(FG, ka, 'R', 'cyan');
    lab(175, 1535, 'पापा', 'बेक़सूर, फँसाए गए');
    lab(540, 1535, 'जज साहब', 'काला चोगा · हथौड़ा');
    lab(905, 1535, 'खन्ना वकील', '4,50,000 लफ़्ज़ · घड़ी');
    // band states
    const bs = [['1,200', 'cyan', 'आरव'], ['0045', 'red', 'मीरा'], ['0000', 'red', 'आवाज़ गई'], ['1,200', 'green', 'लफ़्ज़ मिले']];
    bs.forEach(([v, st, c], i) => { const bx = W0 + 140 + i * 267, by = H0 + 1745; bandBig(FG, bx, by, 0.36, v, st, { noArm: 1, sd: 960 + i * 20 }); wtext(SUBT, c, bx - W0, by - H0 + 92, { screen: true, size: 34, weight: 700, col: '#3a3440', seed: 50 + i, tilt: 0 }); });
    title('0000 · लफ़्ज़ों का क़र्ज़', 'पात्र — हमारे स्टाइल में (Gemini डिज़ाइन से)');
  } else if (test === 'faces') {
    const cells = [['aarav', { eyes: 'open', brows: 'calm', mouth: 'smile' }, 'आरव — शांत'], ['aarav', { eyes: 'happy', brows: 'up', mouth: 'grin' }, 'हँसाता है', 0, 1], ['aarav', { eyes: 'teary', brows: 'worried', mouth: 'smile' }, 'आँसू + मुस्कान', 1],
      ['meera', { eyes: 'happy', brows: 'up', mouth: 'grin' }, 'मीरा — हँसी', 0, 1], ['meera', { eyes: 'pop', brows: 'up', mouth: 'o' }, '0000! आवाज़ गई'], ['meera', { eyes: 'squeeze', brows: 'sad', mouth: 'cry' }, 'टूट गई', 1],
      ['khanna', { eyes: 'half', brows: 'angry', mouth: 'knowing' }, 'खन्ना — घमंड'], ['judge', { eyes: 'half', brows: 'down', mouth: 'flat' }, 'जज — सख़्त'], ['papa', { eyes: 'teary', brows: 'worried', mouth: 'sad' }, 'पापा — डर', 1],
      ['meeraKid', { eyes: 'teary', brows: 'sad', mouth: 'sad' }, 'छोटी मीरा · 8', 1], ['aaravKid', { eyes: 'open', brows: 'worried', mouth: 'small' }, 'छोटा आरव · 9'], ['aaravKid', { eyes: 'happy', brows: 'up', mouth: 'smile' }, 'वही चश्मा!', 0, 1]];
    cells.forEach(([kind, exp, lb, tears, blush], i) => {
      const cx = W0 + 180 + (i % 3) * 360, cy = H0 + 470 + Math.floor(i / 3) * 412;
      poly(BG.f, rrect(cx - 170, cy - 196, cx + 170, cy + 196, 30), i >= 9 ? '#efe0c4' : '#fbf6ea', 1, { seed: 10 + i });
      person3([PE, PROP, FG][Math.floor(i / 3) % 3], bust(kind, cx, cy - 40, SPEC[kind].kid ? 1.0 : 1.25, t, { L: SPEC[kind].kid ? 170 : 140, exp, tears, blush, glint: kind === 'aarav' }), 200 + i * 50);
      poly(FX, rrect(cx - 150, cy + 122, cx + 150, cy + 186, 20), '#2a2630', 1, { seed: 20 + i });
      wtext(FX, lb, cx, cy + 168, { size: 38, weight: 700, col: K.goldL, seed: 30 + i, tilt: 0 });
    });
    title('चेहरे के भाव', 'आरव · मीरा · खन्ना · जज · पापा · बचपन (15 साल पहले)');
  } else if (test === 'band') {
    poly(BG.f, rect(19000, 1000, 21000, 3800), '#232232', 1, { seed: 2 });
    const st = [[2000, 1200, 'cyan', 'आरव · 1,200'], [2500, 45, 'red', 'मीरा · 0045'], [3000, 0, 'red', '0000 — आवाज़ गई'], [3500, 1200, 'green', 'मीरा · 1,200 (आरव के लफ़्ज़)']];
    st.forEach(([y, v, s, c], i) => { bandBig(i % 2 ? PROP : PE, 20060, y - 260, 0.9, v, s, { skin: i === 0 ? K.skinO : K.skinM, sleeve: i === 0 ? K.navy : K.coat, sd: 960 + i * 20 }); tag(540, y - H0 - 260 + 190, c, BAND[s][0], 44); });
    title('कलाई का मीटर', 'हर बोला गया लफ़्ज़ गिनता है');
  }
  finish(comp);
}
