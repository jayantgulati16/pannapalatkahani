// ख़ामोशी की क़ीमत (The Decibel Curse) — Ep 12/13, 29–30 Nov 2026 (Jayant's horror story, 25 Nov). Vertical 1080×1920, 24 fps.
// A haunted flat: every room has an old brass sound meter; above 30 dB at night, a faceless thing with one huge ear finds you.
// Kabir (25) survives the night by throwing a Bluetooth speaker out of the window — next morning his voice is gone: it steals voices.
// THIS FILE NOW: character / creature / meter sheets for approval (?test=cast | faces | balaa | meter).
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

function ik(sh, hd, L1, L2, side, down) {
  let dx = hd[0] - sh[0], dy = hd[1] - sh[1]; let d = Math.hypot(dx, dy); const mx = L1 + L2 - 1;
  let tgt = hd; if (d > mx) { tgt = [sh[0] + dx / d * mx, sh[1] + dy / d * mx]; dx = tgt[0] - sh[0]; dy = tgt[1] - sh[1]; d = mx; }
  d = Math.max(d, 1e-3);
  const a = Math.atan2(dy, dx), B = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
  const e1 = [sh[0] + Math.cos(a + B) * L1, sh[1] + Math.sin(a + B) * L1], e2 = [sh[0] + Math.cos(a - B) * L1, sh[1] + Math.sin(a - B) * L1];
  const score = down ? e => e[1] : e => side * e[0];
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
  if (P0.hair === 'bun') part(C, th(handCircle(0, -66, 30, sd + 11, 0, 20)), { col: hairCol, p: 1, seed: sd + 12 }, O(4, sd + 13));
  if (P0.hood) part(C, tw(smooth([[-60, 36], [-40, 14], [40, 14], [60, 36], [56, 96], [-56, 96]], 3)), { col: P0.hood, p: 1, seed: sd + 9 }, O(4, sd + 10, lc));
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
  if (P0.stripes) for (let i = -2; i <= 2; i++) line(C.l, tw([[i * 22, 60], [i * 23, L - 12]]), { w: 4, col: P0.stripes, seed: sd + 30 + i });
  if (P0.pallu) part(C, tp(smooth([[-50, 58], [-26, 50], [50, 170], [60, Math.min(300, L - 10)], [34, Math.min(300, L - 10)], [-44, 120]], 4)), { col: P0.pallu, p: 1, seed: sd + 18 }, O(4, sd + 19));
  if (P0.hoodie) { for (const sg of [-1, 1]) line(C.l, tw([[sg * 12, 58], [sg * 14, 140]]), { w: 4, col: '#e9e6f0', seed: sd + 36 + sg }); if (!s.bust) line(C.l, tw([[-40, L - 110], [40, L - 110], [44, L - 40], [-44, L - 40], [-40, L - 110]]), { w: 3.5, col: '#5c5f70', seed: sd + 38 }); }
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
  if (P0.hair === 'bun') part(C, th(smooth([[-55, 2], [-52, -40], [-30, -62], [0, -66], [30, -62], [52, -40], [55, 2], [44, -24], [20, -36], [0, -38], [-20, -36], [-44, -24]], 5)), { col: hairCol, p: 1, seed: sd + 50 }, O(4, sd + 51));
  if (P0.hair === 'sweep') part(C, th(smooth([[-55, 0], [-58, -40], [-40, -66], [-4, -76], [36, -70], [58, -46], [56, -4], [46, -30], [26, -46], [0, -40], [-20, -54], [-42, -34]], 4)), { col: hairCol, p: 1, seed: sd + 54 }, O(4, sd + 55));
  if (P0.stubble) for (let i = 0; i < 18; i++) { const a = Math.PI * (0.15 + 0.7 * i / 17); dab(C.l, ...PH(Math.cos(a) * 40, 6 + Math.sin(a) * 36), 2.2 * k * hk, { col: '#6b5246', p: 0.7, seed: sd + 80 + i }); }
  if (P0.phones) { line(C.l, th(smooth([[-44, 46], [-20, 66], [20, 66], [44, 46]], 4, false)), { w: 7, col: '#2c2e3a', seed: sd + 85 }); for (const sg of [-1, 1]) part(C, th(rrect(sg * 46 - 16, 36, sg * 46 + 16, 74, 10)), { col: '#2c2e3a', p: 1, seed: sd + 86 + sg }, O(3, sd + 88 + sg)); }
  if (s.mark) { part(C, tp(rrect(-28, 52, 28, 76, 6)), { col: '#2a1416', p: 0.9, seed: sd + 90 }, null); digits(C.l, s.mark, ...P(0, 64), 17 * k, '#ff4a4a', { glow: 1 }); }
  if (P0.glasses) { for (const sg of [-1, 1]) line(C.l, th(handCircle(sg * 20, -2, 17, sd + 68 + sg, 0.08, 24)), { w: 4, col: '#3b2a22', seed: sd + 69 + sg }); line(C.l, th([[-4, -4], [4, -4]]), { w: 3.5, col: '#3b2a22', seed: sd + 71 }); if (s.glint) for (const sg of [-1, 1]) line(C.l, th([[sg * 20 - 8, -10], [sg * 20 - 2, -16]]), { w: 3, col: K.white, seed: sd + 72 + sg }); }
  if (P0.bindi) dab(C.l, ...PH(0, -24), 4 * k * hk, { col: K.red, p: 1, seed: sd + 74 });
  if (s.sweat) dab(C.l, ...PH(58, -24 + 18 * ((s.t * 1.4) % 1)), 7 * k, { col: K.water, p: 1, seed: sd + 79 });
  const arms = {};
  if (!s.bust || s.hands) {
    for (const [side, sg] of [['L', -1], ['R', 1]]) {
      const shp = P(sg * 46 * wd, 68), [el, hd] = ik(shp, s.hands[side], 118 * k, 110 * k, sg, s.elbowDown || (s.pose && s.pose[side] === 'flat')); arms[side] = hd; arms['e' + side] = el;
      part(C, tube([el, hd], 24 * k, 20 * k), skin, O(4, sd + 100 + sg));
      part(C, tube([shp, el, [lerp(el[0], hd[0], P0.tee ? 0.25 : 0.5), lerp(el[1], hd[1], P0.tee ? 0.25 : 0.5)]], 32 * k, 26 * k), { col: P0.sleeve || P0.top, p: 1, seed: sd + 102 + sg }, O(4, sd + 104 + sg, lc));
    }
    for (const side of ['L', 'R']) hand(C, arms['e' + side], arms[side], k, skin, skinC, (s.pose && s.pose[side]) || 'open', side === 'L' ? -1 : 1, sd + 110 + (side === 'L' ? 0 : 20));
    if (P0.watch) wristBand(C, arms, 'L', 'gold', k);
  }
  WMUL.k = 1;
  arms.k = k; s.head = PH(0, 0); return arms;
}

// ——— hands with real fingers (Jayant, 25 Nov: "haatho ki ungaliya") ———
// pose: open (relaxed) | spread (scared / waving) | fist | point | grip (holding something) | flat (palm on mouth)
function hand(C, el, hd, k, skin, skinC, pose, sg, sd) {
  let dx = hd[0] - el[0], dy = hd[1] - el[1]; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
  const ang = Math.atan2(dy, dx), O = q => ({ w: 3.5, col: K.ink, seed: q, p: 0.9 });
  const at = (a, r) => [hd[0] + Math.cos(ang + a) * r * k, hd[1] + Math.sin(ang + a) * r * k];
  const spec = { open: [[-0.3, 38], [-0.1, 43], [0.1, 42], [0.3, 35]], spread: [[-0.75, 40], [-0.26, 46], [0.22, 45], [0.66, 37]], fist: [[-0.3, 14], [-0.1, 15], [0.1, 15], [0.3, 14]],
    point: [[-0.3, 14], [-0.04, 48], [0.12, 15], [0.3, 14]], grip: [[-0.3, 22], [-0.1, 24], [0.1, 24], [0.3, 21]], flat: [[-0.17, 42], [-0.06, 46], [0.06, 45], [0.17, 40]] }[pose] || [];
  const fw = 9.5 * k, base = 10;
  spec.forEach(([a, L], i) => { const b = at(a * 0.6, base), tip = at(a, base + L); part(C, tube([b, tip], fw * 1.05, fw * 0.9), skin, O(sd + i)); });
  const ta = pose === 'spread' ? 1.25 : pose === 'fist' || pose === 'grip' ? 0.9 : 1.05, tl = pose === 'fist' ? 16 : 28;   // thumb on the inner side
  part(C, tube([at(-sg * 0.9, 6), at(-sg * ta, 6 + tl)], fw * 1.15, fw), skin, O(sd + 6));
  part(C, smooth([at(Math.PI - 0.55, 20), at(-1.3, 16), at(-0.45, 19), at(0.45, 19), at(1.3, 16), at(Math.PI + 0.55, 20)], 4), skin, O(sd + 8));   // the palm, over the finger roots
  if (pose === 'fist' || pose === 'grip') for (let i = 0; i < 3; i++) line(C.l, [at(-0.28 + i * 0.28, 14), at(-0.2 + i * 0.28, 20)], { w: 2.5, col: '#9a5f45', seed: sd + 10 + i });
}
const AH = 680;
function stand(kind, x, gy, k, t, o = {}) {
  const hy = gy - AH * k - (SPEC[kind].kid ? 18 * k : 0);
  return { kind, t, x, gy, k, hy, hk: o.hk, feet: o.feet || { L: [x - 42 * k, gy], R: [x + 42 * k, gy] }, hands: o.hands || { L: [x - 78 * k, hy + 320 * k], R: [x + 78 * k, hy + 320 * k] }, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'small' }, look: o.look || [0, 0], sweat: o.sweat, tears: o.tears, blush: o.blush, glint: o.glint, pose: o.pose, elbowDown: o.elbowDown };
}
function seat(kind, x, t, o = {}) {
  const k = o.k ?? 1, hy = o.hy ?? 2010, gy = hy + 600;
  return { kind, t, x, gy, k, hy, hk: o.hk, seated: 1, kneel: o.kneel, feet: { L: [x - 40, gy], R: [x + 40, gy] }, hands: o.hands || { L: [x - 90 * k, hy + 300 * k], R: [x + 90 * k, hy + 300 * k] }, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'smile' }, look: o.look || [0, 0], sweat: o.sweat, tears: o.tears, blush: o.blush, glint: o.glint, pose: o.pose, elbowDown: o.elbowDown };
}
function bust(kind, x, hy, k, t, o = {}) { return { kind, t, x, hy, k, hk: o.hk, bust: 1, bustL: o.L || 300, hands: o.hands, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'smile' }, look: o.look || [0, 0], sweat: o.sweat, tears: o.tears, blush: o.blush, glint: o.glint, pose: o.pose, elbowDown: o.elbowDown }; }
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

// ═══════════════════════ ख़ामोशी की क़ीमत — cast ═══════════════════════
SPEC.kabir = { top: '#8f93a6', hood: '#7d8196', hoodie: 1, len: 360, bottom: '#2b2d38', shoe: '#e9e6f0', hair: 'sweep', hairCol: '#1f1714', skin: K.skinM, stubble: 1, phones: 1, iris: '#3a2414', lineCol: '#3a3c4a' };
SPEC.broker = { top: '#d9b46a', stripes: '#b38d45', len: 380, bottom: '#5b4a3a', shoe: '#3b2a1e', hair: 'side', hairCol: '#2a201c', moustache: '#2a201c', skin: K.skinO, browCol: '#2a201c' };
SPEC.maa = { fem: 1, top: '#c9576a', len: 430, bottom: '#c9576a', shoe: K.woodD, hair: 'bun', hairCol: '#6e6a66', bindi: 1, skin: K.skinM, pallu: '#e8c26a' };
const NIGHT = { bg: '#161827', bg2: '#22253a', rim: '#8a7bd6' };

// ——— the thing: a tall faceless shadow with ONE huge ear, backward-bent legs, long fingers (facing left) ———
function balaa(C, x, gy, k, t, o = {}) {
  const P = (dx, dy) => [x + dx * k, gy + dy * k], tp = pts => pts.map(([a, b]) => P(a, b));
  const body = o.body || '#050508', rim = o.rim || '#a493f5', sway = Math.sin((t || 0) * 1.3) * 8, bend = o.bend ?? 0.22;   // bend: 0 upright … 1 ear down to the floor
  const lo = { w: 5, col: rim, seed: 2101, p: 0.95 };
  for (const [sg, sd] of [[1, 2110], [-1, 2120]]) {   // legs: hip → knee (bent BACKWARD) → ankle → feet turned backwards
    const hx = sg * 30, hip = [hx, -980], knee = [hx + 190, -600], ank = [hx - 30, -190], heel = [hx - 40, -40], toe = [hx + 150, -10];
    part(C, tube(tp([hip, knee]), 120 * k, 80 * k), { col: body, p: 1, seed: sd }, lo);
    part(C, tube(tp([knee, ank]), 76 * k, 46 * k), { col: body, p: 1, seed: sd + 1 }, lo);
    part(C, smooth(tp([ank, heel, [hx - 30, 6], toe, [hx + 140, -30], [hx + 20, -60]]), 3), { col: body, p: 1, seed: sd + 2 }, lo);
    for (let i = 0; i < 3; i++) line(C.l, tp([[hx + 120 + i * 8, -20 + i * 8], [hx + 175 + i * 10, -4 + i * 10]]), { w: 4, col: rim, seed: sd + 3 + i });
  }
  const sh = [-30 - 140 * bend + sway * 0.3, -1560 + 420 * bend];
  part(C, smooth(tp([[-90, -980], [90, -980], [100, -1250], [sh[0] + 110, sh[1] + 10], [sh[0] - 100, sh[1] + 40], [-110, -1260]]), 4), { col: body, p: 1, seed: 2130 }, lo);   // a thin, hunched body
  for (const [sg, sd] of [[-1, 2140], [1, 2150]]) {   // very long arms, fingers past the knees
    const s0 = [sh[0] + sg * 70, sh[1] + 40], el = [s0[0] + sg * 110 - 40, s0[1] + 440], hd = o.reach && sg < 0 ? [s0[0] - 480, s0[1] + 300] : [s0[0] + sg * 150 - 40, s0[1] + 900];
    part(C, tube(tp([s0, el, hd]), 64 * k, 40 * k), { col: body, p: 1, seed: sd }, lo);
    for (let i = 0; i < 4; i++) { const a = (o.reach && sg < 0 ? Math.PI : Math.PI / 2) + (i - 1.5) * 0.22; const f1 = [hd[0] + Math.cos(a) * 230, hd[1] + Math.sin(a) * 230], f2 = [hd[0] + Math.cos(a - sg * 0.35) * 300, hd[1] + Math.sin(a - sg * 0.35) * 300]; line(C.l, tp([hd, f1, f2]), { w: 14 * Math.sqrt(k), col: rim, seed: sd + 12 + i }); line(C.l, tp([hd, f1, f2]), { w: 9 * Math.sqrt(k), col: body, seed: sd + 2 + i }); line(C.l, tp([f1, f2]), { w: 3, col: '#d9d0c4', seed: sd + 8 + i }); }
  }
  // the head: an oval with no eyes, no mouth — only a huge pale ear
  const hc = [sh[0] - 20 - 60 * bend, sh[1] - 170 + 60 * bend], hr = [120, 160], rot = -0.25 - 1.1 * bend;
  const R = (u, v) => [hc[0] + u * Math.cos(rot) - v * Math.sin(rot), hc[1] + u * Math.sin(rot) + v * Math.cos(rot)];
  part(C, tp(Array.from({ length: 40 }, (_, i) => { const a = i / 40 * Math.PI * 2; return R(Math.cos(a) * hr[0], Math.sin(a) * hr[1]); })), { col: body, p: 1, seed: 2160 }, { w: 5, col: rim, seed: 2161, p: 0.9 });
  const ear = [[10, -110], [60, -90], [80, -30], [70, 30], [40, 80], [10, 110], [-20, 100], [-22, 70], [5, 60], [25, 20], [28, -20], [10, -60], [-20, -70], [-40, -40], [-30, -95]].map(([u, v]) => R(u * 0.95, v * 0.95));
  part(C, smooth(tp(ear), 4), { col: '#cdb4b0', p: 1, seed: 2162 }, { w: 4, col: '#3a2a2e', seed: 2163 });
  line(C.l, tp(smooth([[-5, -75], [30, -60], [45, -10], [35, 40], [15, 70]].map(([u, v]) => R(u * 0.95, v * 0.95)), 4, false)), { w: 5, col: '#8a6a6e', seed: 2164 });
  part(C, tp(smooth([[0, -20], [15, 0], [5, 25], [-10, 10]].map(([u, v]) => R(u, v)), 3)), { col: '#3a2026', p: 1, seed: 2165 }, null);
  for (let i = 0; i < 14; i++) { const a = hash(i * 3.7) * Math.PI * 2, rr = 140 + 60 * hash(i * 1.9); dab(FX, ...P(hc[0] + Math.cos(a) * rr, hc[1] + Math.sin(a) * rr * 1.2), 22 * k, { col: '#6b5fb0', p: 0.22, seed: 2170 + i }); }
  if (o.glowEar) sglow(...P(hc[0], hc[1]), 220 * k, '#e8d7ff', 0.35 * o.glowEar, 2190);
  return { head: P(...hc), ear: P(...R(30, 0)), handL: P(...(o.reach ? [sh[0] - 60 - 420, sh[1] + 340] : [sh[0] - 100, sh[1] + 860])) };
}

// ——— the old brass sound meter: needle 0–100 dB, green / yellow / red ———
function vuMeter(C, x, y, s, db, o = {}) {
  const sd = o.sd || 2200, P = (u, v) => [x + u * s, y + v * s];
  part(C, smooth([P(-220, -150), P(220, -150), P(230, 140), P(-230, 140)], 2), { col: '#9c7432', p: 1, seed: sd }, { w: 6, col: K.ink, seed: sd + 1 });
  for (const sg of [-1, 1]) dab(C.l, ...P(sg * 195, -120), 9 * s, { col: '#e3c27a', p: 1, seed: sd + 2 + sg });
  part(C, smooth([P(-190, -120), P(190, -120), P(195, 110), P(-195, 110)], 2), { col: '#f2e7cc', p: 1, seed: sd + 5 }, { w: 4, col: '#5a4320', seed: sd + 6 });
  const piv = P(0, 120), ang = v => Math.PI * (1.18 + 0.64 * clamp(v / 100)), arcP = (v, r) => [piv[0] + Math.cos(ang(v)) * r * s, piv[1] + Math.sin(ang(v)) * r * s];
  for (const [a, b, col] of [[0, 30, '#3fae5a'], [30, 60, '#e6b422'], [60, 100, '#d8392f']]) { const pts = []; for (let i = 0; i <= 12; i++) pts.push(arcP(a + (b - a) * i / 12, 170)); line(C.l, pts, { w: 16 * s, col, seed: sd + 7 + a }); }
  for (let v = 0; v <= 100; v += 10) line(C.l, [arcP(v, 150), arcP(v, v % 30 === 0 ? 126 : 138)], { w: 3, col: '#3a2a18', seed: sd + 20 + v });
  for (const v of [0, 30, 60, 100]) digits(C.l, String(v), ...arcP(v, 108), 22 * s, '#3a2a18');
  digits(C.l, 'dB', ...P(0, 40), 30 * s, '#3a2a18');
  const shake = o.shake ? Math.sin((o.t || 0) * 60) * 1.2 : 0, nd = arcP(db + shake, 165);
  line(C.l, [piv, nd], { w: 6 * s, col: '#1d1b22', seed: sd + 40 });
  dab(C.l, ...piv, 16 * s, { col: '#3a2a18', p: 1, seed: sd + 41 });
  const lamp = db > 60 ? '#ff3b3b' : db > 30 ? '#ffc23a' : '#4cf08a';
  dab(C.l, ...P(170, -170), 16 * s, { col: lamp, p: 1, seed: sd + 42 }); sglow(...P(170, -170), 60 * s, lamp, 0.8, sd + 43);
  if (o.label !== false) { const g = db > 60 ? '#ff6a6a' : db > 30 ? '#ffd36a' : '#7cf0a0'; digits(C.l, `${Math.round(db)} dB`, ...P(0, 205), 54 * s, g, { glow: 1 }); }
}
function phoneFrame(C, x, y, s, sd = 2300) {   // a phone held up: video call screen (Maa)
  part(C, rrect(x - 150 * s, y - 280 * s, x + 150 * s, y + 280 * s, 34 * s), { col: '#111217', p: 1, seed: sd }, { w: 5, col: '#5c5f70', seed: sd + 1 });
  part(C, rrect(x - 132 * s, y - 250 * s, x + 132 * s, y + 250 * s, 20 * s), { col: '#f3d9c0', p: 1, seed: sd + 2 }, null);
}

// ═══════════════════════ भाग 1 ═══════════════════════
// ——— printed words / voice script (N narrator Sulafat, B broker Fenrir, K Kabir Iapetus, M Maa Gacrux, X the thing = Maa's voice, made eerie in the mix) ———
export const SUBS = [
  { t0: 0.2, t1: 4.6, text: '“कबीर बेटा…|दरवाज़ा खोलो… मैं हूँ।”', who: 'X', vo: 'v1', vt: 0.3 },
  { t0: 7.9, t1: 12.3, text: '“रात को… तीस डेसिबल से|ज़्यादा आवाज़ मत करना।”', who: 'B', vo: 'b1', vt: 8.0 },
  { t0: 12.4, t1: 19.1, text: 'इस पुराने फ़्लैट के हर कमरे में|एक साउंड मीटर लगा है…|और एक ही नियम है।', who: 'N', vo: 'n1', scr: 'हर कमरे में एक साउंड मीटर…|और एक ही नियम।', vt: 12.5 },
  { t0: 19.5, t1: 22.4, text: '“हाँ माँ, पहुँच गया!|बढ़िया फ़्लैट है!”', who: 'K', vo: 'k1', vt: 19.6 },
  { t0: 22.5, t1: 24.1, text: '“खाना खा लेना बेटा।”', who: 'M', vo: 'm1', vt: 22.6 },
  { t0: 24.2, t1: 28.8, text: 'कबीर ने इसे मज़ाक समझा…|और हेडफ़ोन लगाकर सो गया।', who: 'N', vo: 'n2', scr: 'कबीर ने इसे मज़ाक समझा…', vt: 24.3 },
  { t0: 29.0, t1: 37.1, text: 'रात सवा दो बजे… फ़ोन नीचे गिरा —|और सुई पहली बार|तीस के पार गई।', who: 'N', vo: 'n3', scr: 'रात 2:15 — फ़ोन गिरा…|सुई पहली बार 30 के पार!', vt: 29.1 },
  { t0: 37.3, t1: 42.6, text: 'तभी दीवार के पीछे से…|लंबे नाख़ूनों से|खुरचने की आवाज़ आई।', who: 'N', vo: 'n4', scr: 'दीवार के पीछे…|नाख़ूनों की खुरचन', vt: 37.4 },
  { t0: 42.8, t1: 50.2, text: 'दरवाज़े की दरार से दिखा…|बाहर कोई खड़ा था।|उसके पैर उल्टे मुड़े हुए थे।', who: 'N', vo: 'n5', scr: 'बाहर कोई खड़ा था…|पैर उल्टे मुड़े हुए!', vt: 42.9 },
  { t0: 50.3, t1: 57.8, text: 'कबीर ने मुँह दबा लिया…|उसकी धड़कन से ही|सुई उनतीस पर काँप रही थी।', who: 'N', vo: 'n6', scr: 'धड़कन से ही|सुई 29 पर काँप रही थी…', vt: 50.4 },
  { t0: 58.5, t1: 62.8, text: '“बेटा… माँ हूँ…|दरवाज़ा खोलो ना…”', who: 'X', vo: 'v2', vt: 58.6 },
  { t0: 63.0, t1: 70.6, text: 'पर माँ तो दूसरे शहर में थी…|उस चीज़ ने शाम को फ़ोन पर|माँ की आवाज़ सुन ली थी।', who: 'N', vo: 'n7', scr: 'पर माँ तो दूसरे शहर में थी…|उसने फ़ोन पर माँ की आवाज़ सुन ली थी!', vt: 63.1 },
  { t0: 70.7, t1: 74.9, text: 'पीछे हटते ही…|उसका पैर काँच के गिलास से टकराया।', who: 'N', vo: 'n8', scr: 'पैर काँच के गिलास से टकराया…', vt: 70.8 },
  { t0: 77.0, t1: 85.4, text: 'कबीर को लगा ख़तरा दरवाज़े के बाहर है…|पर वो चीज़|अब कमरे के अंदर थी।', who: 'N', vo: 'n9', scr: 'ख़तरा बाहर नहीं था…|वो चीज़ अब अंदर थी।', vt: 77.1 },
  { t0: 85.6, t1: 91.0, text: 'भाग 2 देखने के लिए…|फ़ॉलो और सब्सक्राइब करो… पर धीरे से।', who: 'N', vo: 'n10', scr: '', vt: 85.7 },
];
export const DUR = 91.2;
const STRETCH = [];
function toReal(s) { return s; }
function toStory(t) { return t; }
const T_THUD = 30.6, T_CRASH = 75.2, T_DARK = 76.6, T_KNOCK = 57.9;
function dbAt(t) {   // what the meter reads (story time)
  const tr = (a, f = 23) => a * Math.sin(t * f) + 0.6 * a * Math.sin(t * f * 2.3);
  if (t < 7.0) return 29 + tr(0.6);
  if (t < 19.2) return 38 + tr(3, 7);
  if (t < 24.2) return 60 + tr(4, 9);
  if (t < T_THUD) return lerp(22, 13, pr(t, 24.2, 28.8)) + tr(0.4);
  if (t < 34.0) return (t < 32.4 ? 48 + tr(1.2) : lerp(48, 20, eo(pr(t, 32.4, 34.0)))) * (t < T_THUD + 0.12 ? Math.max(0.3, pr(t, T_THUD, T_THUD + 0.12)) : 1);
  if (t < 50.2) return 18 + tr(1.2, 5);
  if (t < 70.6) return 28.6 + tr(0.5);
  if (t < T_CRASH) return 26 + tr(1.5, 8);
  if (t < T_DARK) return lerp(85, 82, pr(t, T_CRASH, T_DARK)) + tr(1.5);
  return lerp(82, 14, eo(pr(t, T_DARK, T_DARK + 1.5)));
}

// ——— shots: [t0, t1, set, cam0, cam1] ———
const SHOTS = [
  [0.0, 7.0, 'room', [1640, 2260, 1.05], [1660, 2240, 1.22]],      // HOOK 2:15 — Kabir presses his mouth, the needle shakes at 29; "माँ" at the door
  [7.0, 12.3, 'room', [1050, 2380, 0.82], [1050, 2380, 0.88]],     // उसी शाम… the broker in the doorway, whispering, pointing at the meter
  [12.3, 19.2, 'room', [1300, 2010, 1.6], [1300, 2000, 2.3]],      // zoom into the old meter: the red line at 30
  [19.2, 24.2, 'room', [800, 2380, 0.72], [820, 2380, 0.76]],      // the loud speakerphone call with Maa (the almirah is ajar…)
  [24.2, 28.9, 'room', [1820, 2300, 1.1], [1820, 2300, 1.18]],     // headphones, sleep; the lamp dims → night
  [28.9, 31.6, 'room', [1480, 2560, 2.0], [1460, 2620, 2.1]],      // 2:15 — the phone buzzes, slides, falls: THUD
  [31.6, 33.6, 'room', [1300, 2000, 2.4], [1300, 2000, 2.5]],      // the needle jumps to 48
  [33.6, 37.2, 'room', [1850, 2240, 1.4], [1850, 2240, 1.5]],      // Kabir wakes up
  [37.2, 42.7, 'room', [1480, 1960, 1.35], [1520, 1950, 1.5]],     // scratching behind the wall — claw marks appear
  [42.7, 50.2, 'gap', [5000, 2560, 1.0], [5000, 2620, 1.2]],       // the door gap: the light is blocked… backward feet
  [50.2, 54.0, 'room', [1850, 2200, 1.65], [1850, 2200, 1.75]],    // hands over his mouth
  [54.0, 57.8, 'room', [1300, 2000, 2.4], [1300, 2000, 2.6]],      // the needle trembles at 29 with his heartbeat
  [57.8, 62.9, 'room', [1000, 2300, 0.95], [1050, 2300, 1.05]],    // knock knock — "बेटा… माँ हूँ…"
  [62.9, 65.3, 'room', [1360, 2250, 1.5], [1360, 2250, 1.6]],      // his face: realisation
  [65.3, 67.6, 'memory', [7000, 2400, 1.0], [7000, 2400, 1.06]],   // memory: the evening speakerphone call
  [67.6, 73.4, 'room', [1250, 2400, 1.0], [1300, 2420, 1.05]],     // he steps back, away from the door…
  [73.4, 75.3, 'room', [1440, 2620, 1.4], [1470, 2620, 1.5]],      // …his heel hits the glass; it rolls; CRASH
  [75.3, 76.8, 'room', [1300, 2000, 2.4], [1300, 2000, 2.3]],      // 85 dB — red — the lights die
  [76.8, 80.4, 'gap', [5000, 2700, 1.1], [5000, 2700, 1.2]],       // in the dark, the shadow slides in under the door
  [80.4, 91.2, 'room', [320, 2150, 1.25], [320, 2120, 1.4]],       // the almirah creaks open: fingers… the ear → end card
];
function shotAt(t) { return SHOTS.find(s => t >= s[0] && t < s[1]) || SHOTS[SHOTS.length - 1]; }
const HITS = [[T_THUD, 12], [T_KNOCK, 5], [T_KNOCK + 0.4, 5], [T_CRASH, 14], [T_DARK, 6]];
function shake(t) {
  let x = 0, y = 0;
  for (const [h, a] of HITS) { const d = t - h; if (d < 0 || d > 0.5) continue; const e = a * Math.exp(-d / 0.08); x += (hash(BOIL.step * 3.1 + h) - .5) * 2 * e; y += (hash(BOIL.step * 5.7 + h) - .5) * 2 * e; }
  return [x, y];
}

// ——— SET: Kabir's room (evening / night / dark) ———
function drawRoom(t, mode) {   // mode: 'eve' | 'night' | 'dark'
  const B = BG, eve = mode === 'eve';
  poly(B.f, rect(-600, 800, 2900, 2800), eve ? '#c79f78' : '#262a40', 1, { seed: 10 });
  for (let i = 0; i < 18; i++) line(B.l, [[-560 + i * 200, 820], [-560 + i * 200, 2790]], { w: 3, col: eve ? '#b88f69' : '#2e3350', seed: 11 + i });
  poly(B.f, rect(-600, 2800, 2900, 3900), eve ? '#8a6446' : '#30272a', 1, { seed: 30 });
  for (let i = 0; i < 7; i++) line(B.l, [[-600, 2860 + i * 140], [2900, 2860 + i * 140]], { w: 3, col: eve ? '#74523a' : '#261e20', seed: 31 + i });
  line(B.l, [[-600, 2800], [2900, 2800]], { w: 6, col: eve ? '#6b4a32' : '#1a1416', seed: 38 });
  // window
  poly(B.f, rect(1750, 1250, 2250, 1850), eve ? '#f2a35a' : '#1c2a55', 1, { seed: 40 }); edge(B.l, rect(1750, 1250, 2250, 1850), eve ? '#6b4a32' : '#151726', 14, 1, 41);
  line(B.l, [[2000, 1250], [2000, 1850]], { w: 8, col: eve ? '#6b4a32' : '#151726', seed: 42 }); line(B.l, [[1750, 1550], [2250, 1550]], { w: 8, col: eve ? '#6b4a32' : '#151726', seed: 43 });
  if (!eve) { dab(B.f, 2130, 1360, 38, { col: '#e9f0ff', p: 1, seed: 44 }); poly(GLOW, [[1760, 1260], [2240, 1260], [2050, 2800], [1350, 2800]], '#7d93d6', mode === 'dark' ? 0.16 : 0.1, { seed: 45 }); }
  // almirah (left) — the right leaf can open
  const aj = almirahOpen(t);
  poly(B.f, rect(80, 1350, 520, 2800), eve ? '#6e4a32' : '#3a281e', 1, { seed: 50 }); edge(B.l, rect(80, 1350, 520, 2800), '#120c0a', 6, 1, 51);
  line(B.l, [[300, 1380], [300, 2780]], { w: 5, col: '#120c0a', seed: 52 });
  if (aj > 0) { poly(B.f, rect(300, 1380, 300 + 200 * aj, 2780), '#050508', 1, { seed: 53 }); poly(B.f, [[300 + 200 * aj, 1370], [520, 1400], [520, 2770], [300 + 200 * aj, 2800]], eve ? '#7a5238' : '#46301f', 1, { seed: 54 }); }
  for (const hx of [280, 320 + 200 * aj * 0.9]) dab(B.l, hx, 2100, 10, { col: K.gold, p: 1, seed: 55 + hx });
  // the door (left-centre) + light gap
  const open = mode === 'eve' && t < 12.3;
  poly(B.f, rect(680, 1580, 1120, 2800), '#1a1210', 1, { seed: 60 });
  if (open) { poly(B.f, rect(700, 1600, 1100, 2800), '#e9d3a0', 1, { seed: 61 }); poly(B.f, [[1100, 1600], [1180, 1560], [1180, 2840], [1100, 2800]], '#6b4a32', 1, { seed: 62 }); }
  else { poly(B.f, rect(700, 1600, 1100, 2790), eve ? '#7d5434' : '#4a3326', 1, { seed: 63 }); edge(B.l, rect(700, 1600, 1100, 2790), '#120c0a', 5, 1, 64);
    for (const [y0, y1] of [[1680, 2140], [2240, 2700]]) edge(B.l, rect(760, y0, 1040, y1), '#2a1c14', 4, 0.8, 65 + y0);
    dab(B.l, 1060, 2250, 13, { col: K.gold, p: 1, seed: 67 });
    if (mode !== 'eve') { const blocked = feetAt(t); poly(B.f, rect(700, 2786, 1100, 2800), '#ffe6a8', mode === 'dark' ? 0.3 : 1, { seed: 68 }); if (blocked > 0) for (const fx of [840, 960]) poly(B.f, rect(fx - 40, 2786, fx + 40, 2800), '#000', blocked, { seed: 69 + fx }); } }
  edge(B.l, rect(680, 1580, 1120, 2800), '#120c0a', 10, 1, 70);
  // the meter on the wall
  vuMeter(PROP, 1300, 2000, 0.5, dbAt(t), { sd: 2200, label: false, shake: false, t });
  // scratch marks behind the wallpaper (37.6 → 42.6)
  const sc = pr(t, 38.2, 41.6); if (sc > 0 && t < 80) for (let i = 0; i < 4; i++) { const x0 = 1500 + i * 38, y0 = 1700 + i * 10, L = 340 * clamp(sc * 1.4 - i * 0.12); if (L > 0) { line(B.l, [[x0, y0], [x0 + 40, y0 + L]], { w: 9, col: '#0e0f18', seed: 80 + i }); line(B.l, [[x0 + 6, y0], [x0 + 46, y0 + L]], { w: 3, col: eve ? '#a8805c' : '#3d4260', seed: 84 + i }); } }
  // bed (right) + side table + lamp + phone
  part(PE, rect(2280, 2050, 2380, 2800), { col: eve ? '#6e4a32' : '#3a281e', p: 1, seed: 90 }, { w: 5, col: '#120c0a', seed: 91 });
  part(PE, rect(1560, 2560, 2380, 2800), { col: eve ? '#6e4a32' : '#3a281e', p: 1, seed: 92 }, { w: 5, col: '#120c0a', seed: 93 });
  part(PE, rrect(1580, 2470, 2370, 2580, 20), { col: eve ? '#e9e1cf' : '#9aa0b8', p: 1, seed: 94 }, { w: 4, col: '#120c0a', seed: 95 });
  part(PE, rrect(2100, 2380, 2330, 2480, 30), { col: eve ? '#f6f1e4' : '#b9bed4', p: 1, seed: 96 }, { w: 4, col: '#120c0a', seed: 97 });
  part(PROP, rect(1400, 2480, 1540, 2510), { col: eve ? '#6e4a32' : '#3a281e', p: 1, seed: 98 }, { w: 4, col: '#120c0a', seed: 99 });
  for (const x of [1412, 1528]) part(PROP, rect(x - 8, 2510, x + 8, 2800), { col: eve ? '#5a3c28' : '#2a1c14', p: 1, seed: 100 + x }, { w: 3, col: '#120c0a', seed: 101 + x });
  const lampOn = mode !== 'dark';
  part(PROP, smooth([[1420, 2470], [1480, 2470], [1470, 2420], [1430, 2420]], 2), { col: '#3a3c4a', p: 1, seed: 110 }, { w: 3, col: '#120c0a', seed: 111 });
  part(PROP, smooth([[1400, 2420], [1500, 2420], [1475, 2340], [1425, 2340]], 2), { col: lampOn ? '#ffd98a' : '#4a4436', p: 1, seed: 112 }, { w: 3, col: '#120c0a', seed: 113 });
  if (lampOn) sglow(1450, 2390, eve ? 520 : 360, '#ffcf7a', eve ? 0.5 : 0.35 * (t > 24.2 && t < 28.9 ? 1 - pr(t, 26.5, 28.5) * 0.4 : 1), 114);
}
const almirahOpen = t => t >= 21.8 && t < 24.4 ? 0.12 : t >= 80.9 ? 0.75 * ei(pr(t, 80.9, 84.4)) : 0;
const feetAt = t => t >= 44.4 && t < 76.8 ? clamp((t - 44.4) / 0.6) : 0;
function phoneOnTable(C, t) {   // buzzes, slides, falls (28.9 → T_THUD)
  let x = 1490, y = 2468, a = 0;
  if (t >= 28.9) { const bz = t < 29.9 ? Math.sin(t * 90) * 3 : 0; x += bz + 60 * ei(pr(t, 29.2, 29.95)); }
  if (t >= 29.95) { const u = pr(t, 29.95, T_THUD); x = 1550 + 50 * u; y = 2468 + 320 * u * u; a = 2.2 * u; }
  if (t >= T_THUD) { x = 1600; y = 2788; a = Math.PI / 2; }
  const c = Math.cos(a), s2 = Math.sin(a), R = (u, v) => [x + u * c - v * s2, y + u * s2 + v * c];
  part(C, [R(-55, -16), R(55, -16), R(55, 12), R(-55, 12)], { col: '#15161d', p: 1, seed: 120 }, { w: 3, col: '#6b6f82', seed: 121 }); if (t >= 28.9 && t < T_THUD) poly(C.l, [R(-46, -12), R(46, -12), R(46, 6), R(-46, 6)], '#7fd0ff', 0.8, { seed: 123 });
  if (t >= 28.9 && t < 29.9) sglow(x, y - 6, 40, '#9fd8ff', 0.6, 122);
}
function glassOnFloor(C, t) {   // his heel knocks it (73.8) → it rolls → CRASH
  if (t >= T_CRASH) { if (t < 80) for (let i = 0; i < 9; i++) { const a = -Math.PI * (0.1 + 0.8 * hash(i * 2.3)), r = 30 + 90 * eo(pr(t, T_CRASH, T_CRASH + 0.4)) * (0.5 + hash(i * 1.7)); part(C, [[1560 + Math.cos(a) * r, 2795 + Math.sin(a) * r * 0.3], [1572 + Math.cos(a) * r, 2785 + Math.sin(a) * r * 0.3], [1566 + Math.cos(a) * r, 2800]], { col: '#cfe8ff', p: 0.9, seed: 130 + i }, { w: 2, col: '#7a93a8', seed: 140 + i }); } return; }
  const u = pr(t, 73.9, T_CRASH), x = 1430 + 130 * ei(u), a = u * 7;
  const c = Math.cos(a), s2 = Math.sin(a), y = u > 0 ? 2780 : 2760, R = (p, q) => [x + p * c - q * s2, y + p * s2 + q * c];
  const shape = u > 0 ? [R(-55, -28), R(55, -34), R(55, 34), R(-55, 28)] : [[x - 28, 2690], [x + 28, 2690], [x + 22, 2798], [x - 22, 2798]];
  part(C, shape, { col: '#bfe0f5', p: 0.85, seed: 150 }, { w: 3, col: '#7a93a8', seed: 151 });
}

// ——— SET: the door gap, seen from the floor ———
function drawGap(t) {
  const B = BG, dark = t >= T_DARK;
  poly(B.f, rect(4200, 1000, 5800, 2600), '#4a3326', 1, { seed: 300 }); for (const [y0, y1] of [[1150, 1900], [2000, 2560]]) edge(B.l, rect(4400, y0, 5600, y1), '#2a1c14', 6, 0.8, 301 + y0);
  poly(B.f, rect(4200, 2650, 5800, 3900), '#30272a', 1, { seed: 303 });
  for (let i = 0; i < 5; i++) line(B.l, [[4200, 2780 + i * 220], [5800, 2780 + i * 220]], { w: 4, col: '#261e20', seed: 304 + i });
  const lit = dark ? 0.35 : 1;
  poly(B.f, rect(4200, 2600, 5800, 2650), '#ffe6a8', lit, { seed: 310 }); sglow(5000, 2640, 700, '#ffe6a8', 0.45 * lit, 311);
  for (let i = 0; i < 8; i++) poly(GLOW, [[4300 + i * 190, 2650], [4380 + i * 190, 2650], [4500 + i * 200, 3600], [4380 + i * 200, 3600]], '#ffe6a8', 0.08 * lit, { seed: 320 + i });
  const f = feetAt(t);
  if (f > 0) for (const [fx, sg] of [[4840, -1], [5160, 1]]) {   // two feet turned BACKWARDS: heels toward us, long toes pointing away
    poly(B.f, rect(fx - 70, 2600, fx + 70, 2650), '#000', f, { seed: 330 + fx });
    poly(GLOW, [[fx - 90, 2650], [fx + 90, 2650], [fx + 140 + sg * 40, 3300], [fx - 140 + sg * 40, 3300]], '#000000', 0.55 * f, { seed: 334 + fx });
  }
  if (t >= T_DARK) {   // the shadow slides IN under the door
    const u = ei(pr(t, 77.0, 80.2));
    poly(FX, smooth([[4700, 2640], [5300, 2640], [5250 + 120 * u, 2650 + 900 * u], [5000, 2700 + 1100 * u], [4750 - 120 * u, 2650 + 900 * u]], 4), '#000000', 0.9, { seed: 340 });
    for (let i = 0; i < 5; i++) { const w = 4760 + i * 120; line(FX, smooth([[w, 2650], [w + 30 * Math.sin(t * 3 + i), 2650 + 600 * u], [w + 60 * Math.sin(t * 2 + i), 2650 + (900 + 150 * hash(i)) * u]], 4, false), { w: 22, col: '#000', seed: 345 + i }); }
  }
}

// ——— dB chip (top-left) so the danger is always readable ———
function dbChip(t) {
  const db = dbAt(t), col = db > 60 ? '#ff4a4a' : db > 30 ? '#ffc23a' : '#4cf08a';
  box(190, 560, 140, 52, 'rgba(10,10,16,0.95)');
  digits(SUBT, `${String(Math.round(db)).padStart(2, '0')} dB`, 190, 564, 58, col, { screen: true, glow: 1 });
}

// ——— printed words: LOWER THIRD, outlined text, no heavy box (Jayant/owner call 25 Nov: lighter subs for horror; dialogue in full, narration shortened) ———
const SUBY = 1560;
const SUBCOL = { N: K.white, B: '#ffe46b', K: '#9fe8ff', M: '#ffb3c6', X: '#ff9a8a' };
const WHO = { B: 'ब्रोकर', K: 'कबीर', M: 'माँ (फ़ोन)', X: 'दरवाज़े के बाहर से' };
function subTo(t) {
  const S = SUBS.find(s => t >= s.t0 && t < s.t1); if (!S) return;
  const txt = S.scr ?? S.text; if (!txt) return;
  const lines = txt.split('|'), size0 = 66, lh = size0 * 1.28;
  const g = SUBK.g; g.save(); g.font = `700 ${size0}px Kalam`; const tw = Math.max(...lines.map(l => g.measureText(l).width)); g.restore();
  const sc = tw > 980 ? 980 / tw : 1, size = size0 * sc;
  const g2 = SUBT.g, top = SUBY - 60, bot = SUBY + (lines.length - 1) * lh * sc + 40;   // a soft dark fade behind the words
  const grd = g2.createLinearGradient(0, top - 60, 0, bot + 60); grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.3, 'rgba(0,0,0,0.45)'); grd.addColorStop(0.7, 'rgba(0,0,0,0.45)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g2.save(); g2.fillStyle = grd; g2.fillRect(0, top - 60, W, bot - top + 120); g2.restore();
  if (WHO[S.who]) { const nw = 26 + 19 * WHO[S.who].length; box(540, top - 18, nw / 2 + 12, 28, SUBCOL[S.who]); wtext(SUBT, WHO[S.who], 540, top - 6, { screen: true, size: 36, weight: 700, col: K.ink, seed: 5, tilt: 0 }); }
  lines.forEach((ln, i) => wtext(SUBT, ln, 540, SUBY + 24 + i * lh * sc, { screen: true, size, weight: 700, col: SUBCOL[S.who], outline: 9, reveal: pr(t, S.t0 + i * 0.3, S.t0 + i * 0.3 + 0.4), seed: 11 + S.t0 * 3 + i, tilt: 0 }));
}
export const TEXTS = t => { const S = SUBS.find(s => t >= s.t0 && t < s.t1); const tx = S && (S.scr ?? S.text); if (!tx) return []; const n = tx.split('|').length; return [{ id: 's' + S.t0, text: tx.replace(/\|/g, ' '), x0: 20, y0: SUBY - 110, x1: 1060, y1: SUBY + 60 + (n - 1) * 85 }]; };
const LABELS = [[7.1, 10.0, 'उसी शाम…'], [29.0, 31.5, 'रात 2:15'], [65.4, 67.5, 'शाम का फ़ोन कॉल…']];
const END = 85.5;
function badge(t) { if (t > END) return; const x = 905, y = 560; box(x, y, 118, 40, 'rgba(160,30,40,0.92)'); wtext(SUBT, 'भाग 1/2', x, y + 16, { screen: true, size: 46, weight: 700, col: K.white, seed: 3, tilt: 0 }); }
function labels(t) {
  const L = LABELS.find(l => t >= l[0] && t < l[1]);
  if (L) { box(540, 760, 330, 60, 'rgba(8,8,14,0.94)'); wtext(SUBT, L[2], 540, 782, { screen: true, size: 62, weight: 700, col: '#e8d7ff', reveal: pr(t, L[0] + 0.1, L[0] + 0.5), seed: 61 + L[0], tilt: 0 }); }
  if (t > 4.5 && t < 7.0) {   // title
    const u = back1(pr(t, 4.5, 4.8)); box(540, 1480, 420 * u + 1, 100 * u + 1, 'rgba(8,8,14,0.95)');
    wtext(SUBT, 'ख़ामोशी की क़ीमत', 540, 1515, { screen: true, size: 108 * u + 1, weight: 700, col: '#e8d7ff', seed: 81, tilt: 0 });
    const w = back1(pr(t, 5.0, 5.3)); box(540, 1640, 120 * w + 1, 44 * w + 1, 'rgba(160,30,40,0.95)');
    wtext(SUBT, 'भाग 1', 540, 1662, { screen: true, size: 58 * w + 1, weight: 700, col: K.white, seed: 82, tilt: 0 });
  }
  if (t > 13.8 && t < 19.1) tag(540, 760, '30 dB के ऊपर = ख़तरा', '#ff9a8a', 56, 'rgba(8,8,14,0.92)');
  if (t > 46.0 && t < 50.2) tag(540, 760, 'उल्टे पैर…', '#ff9a8a', 60, 'rgba(8,8,14,0.92)');
  if (t > 66.2 && t < 67.6) tag(540, 760, 'इसने माँ की आवाज़ सुन ली थी!', '#ffd36a', 50, 'rgba(8,8,14,0.92)');
}
function endCard(t) {
  if (t < END) return;
  const g = SUBT.g; g.save(); g.fillStyle = 'rgba(8,8,14,0.95)'; g.fillRect(0, 1180, W, 740); g.restore();
  wtext(SUBT, 'भाग 1 यहीं तक…', 540, 1290, { screen: true, size: 66, weight: 700, col: '#cfd3e6', reveal: pr(t, END + 0.05, END + 0.4), seed: 90, tilt: 0 });
  wtext(SUBT, 'तुम होते तो क्या करते?', 540, 1395, { screen: true, size: 72, weight: 700, col: '#e8d7ff', reveal: pr(t, END + 0.4, END + 0.8), seed: 91, tilt: 0 });
  const u = back1(pr(t, END + 0.9, END + 1.2)); box(540, 1520, 360 * u + 1, 56 * u + 1, 'rgba(160,30,40,0.97)');
  wtext(SUBT, 'भाग 2 · कल शाम 7:30', 540, 1544, { screen: true, size: 64 * u + 1, weight: 700, col: K.white, seed: 93, tilt: 0 });
  wtext(SUBT, 'Follow & Subscribe करो · @pannapalatkahani', 540, 1650, { screen: true, size: 46, weight: 700, col: '#ffd36a', reveal: pr(t, END + 1.3, END + 1.8), seed: 94, tilt: 0 });
  wtext(SUBT, '…पर धीरे से', 540, 1745, { screen: true, size: 46, weight: 700, col: '#cfd3e6', reveal: pr(t, END + 2.4, END + 2.8), seed: 95, tilt: 0 });
}

// ——— events for the mixer ———
export const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
SUBS.forEach(S => { if (S.vo) ev(S.vt, 'voice', { id: S.vo, who: S.who }); });
ev(0, 'heartbeat', { dur: 7.0 }); ev(0, 'night', { dur: 7.0 }); ev(4.5, 'stinger'); ev(7.0, 'whoosh'); ev(7.0, 'evening', { dur: 17.2 }); ev(12.3, 'needle'); ev(19.2, 'whoosh'); ev(21.8, 'creakS');
ev(24.2, 'lampdim'); ev(28.9, 'night', { dur: 47.7 }); ev(28.9, 'buzz', { dur: 1.0 }); ev(T_THUD, 'thud'); ev(T_THUD + 0.05, 'needle'); ev(33.6, 'gasp'); ev(37.6, 'scratch', { dur: 4.6 });
ev(42.7, 'whoosh'); ev(44.4, 'step'); ev(45.2, 'step'); ev(50.2, 'heartbeat', { dur: 7.6 }); ev(50.2, 'breath', { dur: 7.0 }); ev(T_KNOCK, 'knock'); ev(T_KNOCK + 0.4, 'knock');
ev(65.3, 'whoosh'); ev(65.3, 'memory', { dur: 2.3 }); ev(67.6, 'whoosh'); ev(68.6, 'step'); ev(69.8, 'step'); ev(71.2, 'step'); ev(73.9, 'clink'); ev(73.9, 'roll', { dur: 1.3 }); ev(T_CRASH, 'crash'); ev(T_CRASH + 0.05, 'needle');
ev(T_DARK, 'lampoff'); ev(76.8, 'slither', { dur: 3.6 }); ev(80.9, 'creak', { dur: 3.5 }); ev(83.5, 'stinger'); ev(END, 'write', { dur: 1.6 });
[['A', 0], ['B', 7.0], ['C', 12.3], ['D', 19.2], ['E', 24.2], ['F', 28.9], ['G', 33.6], ['H', 37.2], ['I', 42.7], ['J', 50.2], ['K', 57.8], ['L', 62.9], ['M', 65.3], ['N', 67.6], ['O', T_CRASH], ['P', T_DARK], ['Q', 80.4], ['Z', END]].forEach(([id, t]) => ev(t, 'cue', { id }));

// ——— one frame ———
export function frame(comp, t) { return frameS(comp, toStory(t)); }
function frameS(comp, t) {
  const S = shotAt(t), set = S[2];
  const e = ss((t - S[0]) / (S[1] - S[0]));
  CAM.x = lerp(S[3][0], S[4][0], e); CAM.y = lerp(S[3][1], S[4][1], e); CAM.s = lerp(S[3][2], S[4][2], e);
  const [shx, shy] = shake(t); CAM.x += shx / CAM.s; CAM.y += shy / CAM.s;
  BOIL.amp = 0;
  [PE, PROP, FG].forEach(clearGroup);
  [BG.f, BG.l, GLOW, FX, SUBK, SUBT].forEach(clear);
  const spk = (a, b) => talking(t, a, b) === 'open';
  const tint = (col, a) => { const g = FX.g; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = col; g.fillRect(0, 0, W, H); g.restore(); };
  const flash = (t0, d, col = '#ffffff', a0 = 0.6) => { if (t > t0 && t < t0 + d) tint(col, a0 * (1 - pr(t, t0, t0 + d))); };
  let vig = 0.42;
  if (set === 'room') {
    const mode = t >= 7.0 && t < 24.2 ? 'eve' : t >= T_DARK ? 'dark' : 'night';
    drawRoom(t, mode);
    phoneOnTable(PROP, t);
    if (t >= 67.6 && t < 80) glassOnFloor(FG, t); else if (t < 67.6 && t >= 24.2) glassOnFloor(FG, 0);
    if (t >= 76.8) glassOnFloor(FG, t);
    // Kabir
    const k = 1.0;
    if (t < 7.0 || (t >= 50.2 && t < 54.0)) {   // on the bed, hands over his mouth
      const x = 1850, hy = 2140;
      person3(FG, seat('kabir', x, t, { hy, k, kneel: 1, exp: { eyes: 'pop', brows: 'worried', mouth: 'small' }, sweat: 1, look: [-1, 0.1], hands: { L: [x - 12, hy + 30], R: [x + 12, hy + 34] }, pose: { L: 'flat', R: 'flat' } }), 100);
    } else if (t < 12.3) {   // evening: Kabir with his bag; the broker whispers in the doorway
      const bx = 900, bgy = 2800, bk = 0.95, bhy = bgy - AH * bk;
      person3(PE, stand('broker', bx, bgy, bk, t, { exp: { eyes: 'pop', brows: 'worried', mouth: spk(8.0, 12.1) ? 'open' : 'wavy' }, sweat: 1, look: [1, 0], hands: { L: [bx - 60, bhy + 300], R: [bx + 170, bhy + 120] }, pose: { R: 'point', L: 'grip' } }), 400);
      const kx = 1420, kgy = 2810, khy = kgy - AH * k;
      person3(FG, stand('kabir', kx, kgy, k, t, { exp: { eyes: 'open', brows: 'up', mouth: 'smile' }, look: [-1, 0], hands: { L: [kx - 80, khy + 320], R: [kx + 90, khy + 300] }, pose: { R: 'grip' } }), 100);
      part(FG, rrect(kx + 60, kgy - 260, kx + 220, kgy - 40, 24), { col: '#3a5a8a', p: 1, seed: 160 }, { w: 4, col: '#120c0a', seed: 161 });   // his bag
    } else if (t < 19.2) {   // (meter close-up) — no character
    } else if (t < 24.2) {   // loud speakerphone call, laughing
      const kx = 1250, kgy = 2810, khy = kgy - AH * k;
      const a = person3(FG, stand('kabir', kx, kgy, k, t, { exp: { eyes: 'happy', brows: 'up', mouth: spk(19.6, 22.3) ? 'grin' : 'smile' }, look: [0.2, -0.2], hands: { L: [kx - 80, khy + 320], R: [kx + 120, khy + 60] }, pose: { R: 'grip' } }), 100);
      part(FG, rrect(a.R[0] - 30, a.R[1] - 60, a.R[0] + 30, a.R[1] + 40, 8), { col: '#15161d', p: 1, seed: 162 }, { w: 3, col: '#6b6f82', seed: 163 });
      if (t > 19.4) { phoneFrame(FG, kx - 290, 2060, 0.62, 2320); person3(FG, bust('maa', kx - 290, 2020, 0.66, t, { L: 210, exp: { eyes: 'happy', brows: 'up', mouth: spk(22.6, 23.9) ? 'open' : 'smile' } }), 520); }
      if (t > 22.5) { const g = 1 - pr(t, 23.9, 24.2); poly(FX, handCircle(420, 2160, 34, 170, 0, 16), '#cdb4b0', 0.75 * g, { seed: 171 }); sglow(420, 2160, 70, '#e8d7ff', 0.5 * g, 172); }   // clue: an ear in the almirah gap
    } else if (t < 28.9) {   // headphones on, falls asleep
      const x = 1850, hy = 2140;
      person3(FG, seat('kabir', x, t, { hy, k, kneel: 1, exp: t > 26.2 ? { eyes: 'closed', brows: 'calm', mouth: 'small' } : { eyes: 'happy', brows: 'calm', mouth: 'smile' }, look: [-0.5, 0.3], hands: { L: [x - 60, hy + 300], R: [x + 60, hy + 300] } }), 100);
    } else if (t < 37.2 || (t >= 62.9 && t < 65.3)) {   // asleep → wakes / realisation
      const x = 1850, hy = 2140, woke = t >= 33.6;
      if (t < 62.9) person3(FG, seat('kabir', x, t, { hy, k, kneel: 1, exp: woke ? { eyes: 'pop', brows: 'up', mouth: 'o' } : { eyes: 'closed', brows: 'calm', mouth: 'small' }, look: [-1, 0], hands: { L: [x - 60, hy + 300], R: [x + 60, hy + 300] } }), 100);
      else { const kx = 1360, kgy = 2810, khy = kgy - AH * k; person3(FG, stand('kabir', kx, kgy, k, t, { exp: { eyes: 'pop', brows: 'worried', mouth: 'o' }, sweat: 1, look: [-1, 0.1], hands: { L: [kx - 55, khy + 25], R: [kx + 55, khy + 25] }, pose: { L: 'spread', R: 'spread' }, elbowDown: 1 }), 100); }
    } else if (t >= 54.0 && t < 57.8) {   // meter close
    } else if (t >= 57.8 && t < 62.9) {   // knock knock — he stands frozen near the bed
      const kx = 1380, kgy = 2810, khy = kgy - AH * k;
      person3(FG, stand('kabir', kx, kgy, k, t, { exp: { eyes: 'pop', brows: 'worried', mouth: 'small' }, sweat: 1, look: [-1, 0], hands: { L: [kx - 12, khy + 30], R: [kx + 12, khy + 34] }, pose: { L: 'flat', R: 'flat' } }), 100);
    } else if (t >= 67.6 && t < 75.3) {   // steps back toward the bed… the glass
      const kx = lerp(1220, 1380, ei(pr(t, 68.4, 73.6))), kgy = 2810, khy = kgy - AH * k, ph = Math.sin((t - 68.4) * 3.2);
      person3(FG, stand('kabir', kx, kgy, k, t, { exp: { eyes: 'pop', brows: 'worried', mouth: 'flat' }, sweat: 1, look: [-1, 0], feet: { L: [kx - 50 + ph * 20, kgy], R: [kx + 60 - ph * 20, kgy] }, hands: { L: [kx - 100, khy + 240], R: [kx + 110, khy + 250] }, pose: { L: 'spread', R: 'spread' } }), 100);
    }
    if (t >= 75.3 && t < 76.8) flash(T_CRASH + 0.05, 0.5, '#ff2a2a', 0.45);
    if (mode === 'dark') tint('#000008', 0.55 * pr(t, T_DARK, T_DARK + 0.3));
    if (t >= 80.4) {   // the almirah: fingers on the door edge, a pale ear in the dark
      const u = pr(t, 82.2, 83.2), ex = 300 + 200 * almirahOpen(t);
      for (let i = 0; i < 4; i++) { const y = 1980 + i * 46, L = 70 * u; if (u > 0) { line(FX, [[ex, y], [ex + 40 * u, y - 8], [ex + L, y + 10]], { w: 13, col: '#050508', seed: 400 + i }); line(FX, [[ex + 40 * u, y - 8], [ex + L, y + 10]], { w: 3, col: '#d9d0c4', seed: 404 + i }); } }
      const g = pr(t, 83.4, 84.4); if (g > 0) { part(FG, smooth([[ex - 120, 1800], [ex - 80, 1790], [ex - 66, 1840], [ex - 84, 1880], [ex - 118, 1860]], 3), { col: '#cdb4b0', p: 0.85 * g, seed: 410 }, null); sglow(ex - 95, 1835, 120, '#e8d7ff', 0.5 * g, 411); }
    }
    vig = mode === 'eve' ? 0.25 : mode === 'dark' ? 0.6 : 0.45;
  } else if (set === 'gap') {
    drawGap(t);
    if (t >= T_DARK) tint('#000008', 0.35);
    vig = 0.55;
  } else if (set === 'memory') {
    poly(BG.f, rect(6000, 1000, 8000, 3800), '#2a2236', 1, { seed: 600 });
    phoneFrame(PE, 7000, 2420, 1.5, 2300);
    person3(PE, bust('maa', 7000, 2330, 1.6, t, { L: 210, exp: { eyes: 'happy', brows: 'up', mouth: BOIL.step % 3 ? 'open' : 'smile' } }), 500);
    sglow(7000, 2420, 700, '#ffcf7a', 0.25, 601);
    tint('#6a4a2a', 0.22);
    vig = 0.45;
  }
  badge(t); if (t < END) dbChip(t);
  if (!NOSUBS) { subTo(t); labels(t); }
  else if (t > 4.5 && t < 7.0) labels(t);
  endCard(t);
  finish(comp, vig);
}
export function testFrame(comp, t, test) {
  [PE, PROP, FG].forEach(clearGroup); [BG.f, BG.l, GLOW, FX, SUBK, SUBT].forEach(clear); BOIL.amp = 0;
  CAM.x = 20000; CAM.y = 2400; CAM.s = 1.0;
  const W0 = 19460, H0 = 1440;
  const title = (a, b) => { box(540, 120, 500, 92, 'rgba(8,8,14,0.95)'); wtext(SUBT, a, 540, 128, { screen: true, size: 70, weight: 700, col: '#e8d7ff', seed: 1, tilt: 0 }); wtext(SUBT, b, 540, 188, { screen: true, size: 36, weight: 700, col: K.white, seed: 2, tilt: 0 }); };
  const lab = (x, y, a, b, col = '#e8d7ff') => { tag(x, y, a, col, 44, 'rgba(8,8,14,0.92)'); if (b) wtext(SUBT, b, x, y + 58, { screen: true, size: 30, weight: 700, col: '#cfd3e6', seed: 3 + x, tilt: 0 }); };
  poly(BG.f, rect(19000, 1000, 21000, 3800), NIGHT.bg, 1, { seed: 1 });
  for (let i = 0; i < 7; i++) dab(BG.f, 19500 + hash(i * 2.3) * 1000, 1700 + hash(i * 1.7) * 1800, 200, { col: NIGHT.bg2, p: 0.7, seed: 2 + i });
  if (test === 'cast') {
    const kk = 0.82, kx = W0 + 250, kgy = H0 + 1010, khy = kgy - AH * kk;
    const ka = person3(PE, stand('kabir', kx, kgy, kk, t, { exp: { eyes: 'open', brows: 'worried', mouth: 'small' }, look: [0.3, 0], pose: { R: 'grip' }, hands: { L: [kx - 70 * kk, khy + 330 * kk], R: [kx + 110 * kk, khy + 280 * kk] } }), 100);
    part(PE, rrect(ka.R[0] - 14, ka.R[1] - 30, ka.R[0] + 24, ka.R[1] + 40, 8), { col: '#1b1c24', p: 1, seed: 140 }, { w: 3, col: '#5c5f70', seed: 141 });   // phone
    part(PE, rrect(kx - 210, kgy - 120, kx - 110, kgy, 20), { col: '#2c2e3a', p: 1, seed: 142 }, { w: 3, col: '#5c5f70', seed: 143 }); for (let i = 0; i < 3; i++) dab(PE.l, kx - 160, kgy - 92 + i * 30, 10, { col: '#5c5f70', p: 1, seed: 144 + i });   // speaker
    lab(250, 1060, 'कबीर · 25', 'हुडी · हेडफ़ोन · स्पीकर');
    balaa(FG, W0 + 760, H0 + 1010, 0.41, t, { glowEar: 1 });
    lab(780, 1060, 'वो चीज़', 'चेहरा नहीं, सिर्फ़ कान', '#ff9a8a');
    const bk = 0.55, bx = W0 + 190, bgy = H0 + 1560;
    const ba = person3(PROP, stand('broker', bx, bgy, bk, t, { exp: { eyes: 'pop', brows: 'worried', mouth: 'wavy' }, sweat: 1, look: [0.6, 0], pose: { R: 'point' }, hands: { L: [bx - 60 * bk, bgy - AH * bk + 330 * bk], R: [bx + 130 * bk, bgy - AH * bk + 200 * bk] } }), 400);
    for (let i = 0; i < 2; i++) line(PROP.l, [[ba.R[0], ba.R[1]], [ba.R[0] + 10 + i * 12, ba.R[1] + 36]], { w: 4, col: K.gold, seed: 150 + i });
    lab(190, 1610, 'ब्रोकर', 'चाबी · पसीना');
    phoneFrame(PROP, W0 + 545, H0 + 1340, 0.85, 2300);
    person3(PROP, bust('maa', W0 + 545, H0 + 1270, 0.95, t, { L: 230, exp: { eyes: 'happy', brows: 'up', mouth: 'smile' } }), 500);
    lab(545, 1610, 'माँ (फ़ोन पर)', 'आवाज़ की नकल');
    vuMeter(FG, W0 + 900, H0 + 1300, 0.62, 18, { sd: 2200 });
    lab(900, 1610, 'पुराना मीटर', 'पीतल + सुई');
    title('ख़ामोशी की क़ीमत', 'पात्र — रात वाला लुक (गहरा नीला + पेस्टल)');
  } else if (test === 'faces') {
    const cells = [['kabir', { eyes: 'happy', brows: 'up', mouth: 'grin' }, 'मज़ाक समझा'], ['kabir', { eyes: 'closed', brows: 'calm', mouth: 'small' }, 'नींद'], ['kabir', { eyes: 'pop', brows: 'up', mouth: 'o' }, '2:15 — आँख खुली'],
      ['kabir', { eyes: 'pop', brows: 'worried', mouth: 'small' }, 'मुँह दबाया', 0, 0, 1], ['kabir', { eyes: 'teary', brows: 'sad', mouth: 'flat' }, 'साँस रोकी', 1], ['kabir', { eyes: 'happy', brows: 'calm', mouth: 'smile' }, 'सुबह — राहत'],
      ['kabir', { eyes: 'pop', brows: 'up', mouth: 'open' }, 'आवाज़ ग़ायब!', 0, 0, 0, '00 dB'], ['broker', { eyes: 'pop', brows: 'worried', mouth: 'wavy' }, 'ब्रोकर — डर'], ['maa', { eyes: 'happy', brows: 'up', mouth: 'smile' }, 'माँ']];
    cells.forEach(([kind, exp, lb, tears, blush, hush, mark], i) => {
      const cx = W0 + 180 + (i % 3) * 360, cy = H0 + 470 + Math.floor(i / 3) * 520;
      poly(BG.f, rrect(cx - 170, cy - 230, cx + 170, cy + 230, 30), NIGHT.bg2, 1, { seed: 10 + i });
      const G = [PE, PROP, FG][Math.floor(i / 3)];
      const hy = cy - 60, k = 1.35;
      const a = person3(G, bust(kind, cx, hy, k, t, { L: 170, exp, tears, blush, hands: hush ? { L: [cx - 14, hy + 30 * k], R: [cx + 14, hy + 34 * k] } : undefined, pose: hush ? { L: 'flat', R: 'flat' } : undefined }), 200 + i * 50);
      if (mark) { s_mark(G, cx, hy, k); }
      poly(FX, rrect(cx - 150, cy + 150, cx + 150, cy + 222, 20), '#0b0b12', 1, { seed: 20 + i });
      wtext(FX, lb, cx, cy + 202, { size: 40, weight: 700, col: '#e8d7ff', seed: 30 + i, tilt: 0 });
    });
    title('कबीर — चेहरे के भाव', 'मुँह दबाना · साँस रोकना · आवाज़ ग़ायब (गले पर 00 dB)');
  } else if (test === 'balaa') {
    balaa(PE, W0 + 470, H0 + 1200, 0.5, t, { glowEar: 1 });
    lab(400, 1240, 'वो चीज़ — पूरा रूप', 'लंबी, पतली, उल्टे मुड़े पैर, लंबी उँगलियाँ');
    // door gap: light strip + two backward feet shadows
    const dx = W0 + 290, dy = H0 + 1560;
    part(PROP, rect(dx - 230, dy - 160, dx + 230, dy + 40), { col: '#5a3a28', p: 1, seed: 300 }, { w: 4, col: K.ink, seed: 301 });
    poly(PROP.l, rect(dx - 230, dy + 40, dx + 230, dy + 64), '#ffe6a8', 1, { seed: 302 }); sglow(dx, dy + 52, 200, '#ffe6a8', 0.5, 303);
    for (const sg of [-1, 1]) poly(PROP.l, rect(dx + sg * 70 - 40, dy + 40, dx + sg * 70 + 40, dy + 64), '#000000', 1, { seed: 304 + sg });
    lab(290, 1680, 'दरवाज़े की दरार', 'बाहर उल्टे पैरों की परछाईं');
    // the almirah: the door ajar, long fingers on the edge, a pale ear in the dark
    const ax = W0 + 790, ay = H0 + 1500;
    part(PROP, rect(ax - 180, ay - 300, ax + 180, ay + 160), { col: '#4a3326', p: 1, seed: 320 }, { w: 5, col: K.ink, seed: 321 });
    poly(PROP.l, rect(ax - 20, ay - 280, ax + 50, ay + 140), '#000000', 1, { seed: 322 });
    for (let i = 0; i < 4; i++) { line(PROP.l, [[ax + 50, ay - 150 + i * 34], [ax + 90, ay - 156 + i * 34], [ax + 106, ay - 140 + i * 34]], { w: 9, col: '#0c0c12', seed: 323 + i }); line(PROP.l, [[ax + 90, ay - 156 + i * 34], [ax + 106, ay - 140 + i * 34]], { w: 3, col: '#d9d0c4', seed: 327 + i }); }
    part(PROP, smooth([[ax - 4, ay - 230], [ax + 30, ay - 220], [ax + 40, ay - 180], [ax + 20, ay - 150], [ax - 6, ay - 170]], 3), { col: '#cdb4b0', p: 0.9, seed: 331 }, null); sglow(ax + 14, ay - 190, 80, '#e8d7ff', 0.4, 332);
    lab(790, 1680, 'अलमारी', 'आँखें नहीं — उँगलियाँ + कान की चमक');
    title('वो चीज़ (बला)', 'डिज़ाइन — सिर्फ़ आवाज़ से शिकार करती है');
  } else if (test === 'hands') {
    const poses = [['open', 'आराम से'], ['spread', 'डर / हाथ हिलाना'], ['point', 'इशारा'], ['fist', 'मुट्ठी'], ['grip', 'फ़ोन पकड़ना'], ['flat', 'मुँह दबाना']];
    poses.forEach(([ps, lb], i) => {
      const cx = W0 + 270 + (i % 2) * 540, cy = H0 + 560 + Math.floor(i / 2) * 470;
      poly(BG.f, rrect(cx - 250, cy - 210, cx + 250, cy + 210, 30), NIGHT.bg2, 1, { seed: 10 + i });
      const G = [PE, PROP, FG][Math.floor(i / 2)], k = 2.6, el = [cx - 160, cy + 120], hd = [cx - 10, cy - 10];
      part(G, tube([[cx - 330, cy + 200], el, hd], 24 * k, 20 * k), { col: K.skinM, p: 1, seed: 40 + i }, { w: 5, col: K.ink, seed: 50 + i });
      hand(G, el, hd, k, { col: K.skinM, p: 1, gap: 7, w: 9, seed: 80 + i }, K.skinM, ps, 1, 100 + i * 20);
      wtext(SUBT, lb, cx - W0, cy - H0 + 180, { screen: true, size: 44, weight: 700, col: '#e8d7ff', seed: 30 + i, tilt: 0 });
    });
    title('हाथ — अब असली उँगलियाँ', '5 उँगलियाँ · हर भाव के लिए अलग पकड़');
  } else if (test === 'meter') {
    const st = [[18, 'हरा · सन्नाटा'], [29, 'सुई काँपती · 29 dB'], [48, 'पीला · फ़ोन गिरा'], [85, 'लाल · गिलास टूटा']];
    st.forEach(([db, c], i) => { const mx = W0 + 280 + (i % 2) * 520, my = H0 + 500 + Math.floor(i / 2) * 560; vuMeter(i < 2 ? PE : PROP, mx, my, 0.95, db, { sd: 2200 + i * 60, shake: db === 29, t }); wtext(SUBT, c, mx - W0, my - H0 + 290, { screen: true, size: 40, weight: 700, col: '#e8d7ff', seed: 40 + i, tilt: 0 }); });
    const kk = 1.6; person3(FG, bust('kabir', W0 + 540, H0 + 1600, kk, t, { L: 150, exp: { eyes: 'pop', brows: 'up', mouth: 'open' }, mark: '00 dB' }), 900);
    wtext(SUBT, 'आख़िर में: कबीर के गले पर 00 dB', 540, 1890, { screen: true, size: 40, weight: 700, col: '#ff9a8a', seed: 60, tilt: 0 });
    title('पुराना साउंड मीटर', '0–100 dB · 30 के ऊपर = ख़तरा');
  }
  finish(comp, 0.2);
}
function s_mark(G, cx, hy, k) { part(G, [[cx - 30 * k, hy + 60 * k], [cx + 30 * k, hy + 60 * k], [cx + 30 * k, hy + 86 * k], [cx - 30 * k, hy + 86 * k]], { col: '#2a1416', p: 0.9, seed: 990 }, null); digits(G.l, '00 dB', cx, hy + 73 * k, 18 * k, '#ff4a4a', { glow: 1 }); }
