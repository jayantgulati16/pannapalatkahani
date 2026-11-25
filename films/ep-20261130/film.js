// ख़ामोशी की क़ीमत (The Decibel Curse) — Ep 12/13, 29–30 Nov 2026 (Jayant's horror story, 25 Nov). Vertical 1080×1920, 24 fps.
// A haunted flat: every room has an old brass sound meter; above 30 dB at night, a faceless thing with one huge ear finds you.
// Kabir (25) survives the night by throwing a Bluetooth speaker out of the window — next morning his voice is gone: it steals voices.
// भाग 2 (Ep 13, 30 Nov): opens on भाग 1's last shot (the almirah); under the bed; the speaker trick; morning: no voice; the mirror; Part 3 hook.
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
  if (s.mark) { part(C, tp(rrect(-36, 86, 36, 114, 6)), { col: '#2a1416', p: 0.92, seed: sd + 90 }, null); digits(C.l, s.mark, ...P(0, 100), 19 * k, '#ff4a4a', { glow: 1 }); }
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
  return { kind, t, x, gy, k, hy, hk: o.hk, feet: o.feet || { L: [x - 42 * k, gy], R: [x + 42 * k, gy] }, hands: o.hands || { L: [x - 78 * k, hy + 320 * k], R: [x + 78 * k, hy + 320 * k] }, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'small' }, look: o.look || [0, 0], sweat: o.sweat, tears: o.tears, blush: o.blush, glint: o.glint, pose: o.pose, elbowDown: o.elbowDown, mark: o.mark };
}
function seat(kind, x, t, o = {}) {
  const k = o.k ?? 1, hy = o.hy ?? 2010, gy = hy + 600;
  return { kind, t, x, gy, k, hy, hk: o.hk, seated: 1, kneel: o.kneel, feet: { L: [x - 40, gy], R: [x + 40, gy] }, hands: o.hands || { L: [x - 90 * k, hy + 300 * k], R: [x + 90 * k, hy + 300 * k] }, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'smile' }, look: o.look || [0, 0], sweat: o.sweat, tears: o.tears, blush: o.blush, glint: o.glint, pose: o.pose, elbowDown: o.elbowDown, mark: o.mark };
}
function bust(kind, x, hy, k, t, o = {}) { return { kind, t, x, hy, k, hk: o.hk, bust: 1, bustL: o.L || 300, hands: o.hands, exp: o.exp || { eyes: 'open', brows: 'flat', mouth: 'smile' }, look: o.look || [0, 0], sweat: o.sweat, tears: o.tears, blush: o.blush, glint: o.glint, pose: o.pose, elbowDown: o.elbowDown, mark: o.mark }; }
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

// ═══════════════════════ भाग 2 ═══════════════════════
// ——— voice script (N narrator Sulafat; X = THE THING speaking with KABIR's stolen voice — Iapetus takes made eerie in the mix) ———
export const SUBS = [
  { t0: 4.3, t1: 12.7, text: 'उसके न आँखें थीं, न मुँह… सिर्फ़ एक बड़ा कान — जो हर आवाज़ सुनता था।', scr: 'न आँखें… न मुँह…|सिर्फ़ एक बड़ा कान।', who: 'N', vo: 'n2', vt: 4.4 },
  { t0: 12.8, t1: 19.4, text: 'कबीर बिना आवाज़ किए बेड के नीचे छिप गया… वो चीज़ ठीक बेड के पास आकर रुक गई।', scr: 'कबीर बेड के नीचे छिप गया…|वो चीज़ ठीक पास आकर रुकी।', who: 'N', vo: 'n3', vt: 12.9 },
  { t0: 19.4, t1: 25.5, text: 'उसने अपना कान ज़मीन से लगा दिया… वो कबीर की धड़कन सुन रही थी।', scr: 'कान ज़मीन से लगाया…|वो धड़कन सुन रही थी।', who: 'N', vo: 'n4', vt: 19.5 },
  { t0: 25.7, t1: 35.4, text: 'तभी फ़र्श पर खुरचा हुआ एक पुराना संदेश दिखा… पिछले किरायेदार का — आवाज़ दूर फेंको।', scr: 'पिछले किरायेदार का खुरचा संदेश…|“आवाज़ दूर फेंको”', who: 'N', vo: 'n5', vt: 25.8 },
  { t0: 35.5, t1: 43.6, text: 'कबीर ने चुपचाप फ़ोन को ब्लूटूथ स्पीकर से जोड़ा… अब सारी आवाज़ सिर्फ़ स्पीकर से आएगी।', scr: 'फ़ोन चुप → ब्लूटूथ स्पीकर से जुड़ा…|आवाज़ सिर्फ़ स्पीकर से आएगी।', who: 'N', vo: 'n6', vt: 35.6 },
  { t0: 43.7, t1: 48.5, text: 'उसने स्पीकर खिड़की की तरफ़ फेंका… और प्ले दबा दिया।', scr: 'स्पीकर खिड़की की तरफ़…|और प्ले!', who: 'N', vo: 'n7', vt: 43.8 },
  { t0: 48.6, t1: 54.9, text: 'पंचानबे डेसिबल! वो चीज़ बिजली की तेज़ी से खिड़की पर झपटी… और स्पीकर के साथ बाहर कूद गई।', scr: '95 dB!|वो चीज़ खिड़की से बाहर कूद गई…', who: 'N', vo: 'n8', vt: 48.7 },
  { t0: 55.1, t1: 60.1, text: 'मीटर फिर हरा हो गया… कबीर को लगा, वो बच गया।', scr: 'मीटर फिर हरा…|कबीर को लगा, वो बच गया।', who: 'N', vo: 'n9', vt: 55.2 },
  { t0: 60.5, t1: 68.3, text: 'अगली सुबह… दरवाज़े पर कबीर ने बोलना चाहा — पर गले से एक भी आवाज़ नहीं निकली।', scr: 'कबीर ने बोलना चाहा…|पर एक भी आवाज़ नहीं निकली!', who: 'N', vo: 'n10', vt: 60.6 },
  { t0: 68.7, t1: 71.9, text: '“शुक्र है… जान बची!”', who: 'X', vo: 'k2', vt: 68.8 },
  { t0: 71.9, t1: 80.7, text: 'वो चीज़ जान नहीं लेती थी… आवाज़ चुराती थी। और अब… वो कबीर की आवाज़ में बोल रही थी।', scr: 'वो जान नहीं… आवाज़ चुराती थी।|अब वो कबीर की आवाज़ में बोलती है।', who: 'N', vo: 'n11', vt: 72.0 },
  { t0: 81.3, t1: 85.1, text: '“भाई… दरवाज़ा खोलो… मैं हूँ।”', who: 'X', vo: 'k3', vt: 81.4 },
  { t0: 85.3, t1: 92.0, text: 'अगली कहानी देखने के लिए… सब्सक्राइब और फ़ॉलो करो… पर धीरे से।', scr: '', who: 'N', vo: 'n12', vt: 85.4 },
];
export const DUR = 92.0;
function toStory(t) { return t; }
const T_PLAY = 47.8, T_WIN = 52.4, T_MORN = 60.2;
function dbAt(t) {
  const tr = (a, f = 23) => a * Math.sin(t * f) + 0.6 * a * Math.sin(t * f * 2.3);
  if (t < 12.8) return 14 + tr(0.6, 5);
  if (t < 19.4) return 21 + tr(1.2, 7);
  if (t < 25.6) return 28.4 + tr(0.6);
  if (t < T_PLAY) return 22 + tr(1.0, 6);
  if (t < T_WIN + 0.2) return lerp(22, 95, eo(pr(t, T_PLAY, T_PLAY + 0.25))) + tr(1.5, 30);
  if (t < 55.0) return lerp(95, 15, eo(pr(t, T_WIN + 0.2, 54.6)));
  if (t < T_MORN) return 15 + tr(0.5, 4);
  return 12 + tr(0.4, 4);   // morning: he "speaks" — the needle does not move
}

// ——— shots ———
const SHOTS = [
  [0.0, 4.0, 'room', [380, 2150, 1.4], [450, 2200, 1.05]],        // SAME shot as भाग 1's end: the almirah… it unfolds out
  [4.0, 12.8, 'room', [900, 2350, 0.66], [560, 1760, 1.45]],      // the thing in the dark — push in to the ear
  [12.8, 19.4, 'under', [9150, 2250, 1.15], [9180, 2270, 1.25]],  // under the bed: Kabir, hands on mouth; backward feet arrive
  [19.4, 25.6, 'under', [9160, 2250, 1.25], [9160, 2260, 1.4]],   // the ear lowers to the floor… a thin glow from his throat
  [25.6, 30.4, 'under', [8980, 1900, 1.7], [8980, 1880, 1.8]],    // the old message scratched under the bed
  [30.4, 35.4, 'under', [9100, 2250, 1.25], [9100, 2250, 1.3]],   // his eyes: the phone and the speaker
  [35.4, 43.6, 'under', [9110, 2440, 2.4], [9110, 2440, 2.6]],    // phone: silent mode, Bluetooth → speaker ✓
  [43.6, 48.6, 'room', [1600, 2480, 0.85], [1640, 2480, 0.88]],   // the speaker flies to the window → play
  [48.6, 50.0, 'room', [1300, 2000, 2.4], [1300, 2000, 2.5]],     // 95 dB
  [50.0, 55.0, 'room', [1550, 2300, 0.72], [1600, 2300, 0.76]],   // it LUNGES — through the window — gone
  [55.0, 57.4, 'room', [1300, 2000, 2.3], [1300, 2000, 2.3]],     // green again
  [57.4, 60.2, 'room', [1700, 2450, 1.1], [1700, 2450, 1.15]],    // Kabir crawls out, breathing
  [60.2, 68.4, 'room', [1000, 2350, 0.95], [1000, 2300, 1.15]],   // अगली सुबह… at the door — no voice
  [68.4, 80.6, 'mirror', [12000, 2250, 1.1], [12000, 2230, 1.4]], // the mirror: 00 dB on his throat… it, behind him, laughs in HIS voice
  [80.6, 92.0, 'next', [14000, 2350, 0.95], [14000, 2350, 1.05]], // अगली रात… a new tenant's door: "भाई… दरवाज़ा खोलो…" → end card
];
function shotAt(t) { return SHOTS.find(s => t >= s[0] && t < s[1]) || SHOTS[SHOTS.length - 1]; }
const HITS = [[1.0, 10], [T_PLAY, 6], [T_WIN, 16], [69.6, 8]];
function shake(t) {
  let x = 0, y = 0;
  for (const [h, a] of HITS) { const d = t - h; if (d < 0 || d > 0.5) continue; const e = a * Math.exp(-d / 0.08); x += (hash(BOIL.step * 3.1 + h) - .5) * 2 * e; y += (hash(BOIL.step * 5.7 + h) - .5) * 2 * e; }
  return [x, y];
}

// ——— SET: Kabir's room after the crash (dark / morning), the almirah wide open, glass shards, broken window later ———
function drawRoom2(t, mode) {   // 'dark' | 'morning'
  const B = BG, morn = mode === 'morning';
  poly(B.f, rect(-600, 800, 2900, 2800), morn ? '#d6bf9c' : '#1d2033', 1, { seed: 10 });
  for (let i = 0; i < 18; i++) line(B.l, [[-560 + i * 200, 820], [-560 + i * 200, 2790]], { w: 3, col: morn ? '#c6ad88' : '#252a42', seed: 11 + i });
  poly(B.f, rect(-600, 2800, 2900, 3900), morn ? '#9a7656' : '#241d20', 1, { seed: 30 });
  for (let i = 0; i < 7; i++) line(B.l, [[-600, 2860 + i * 140], [2900, 2860 + i * 140]], { w: 3, col: morn ? '#85634a' : '#1c1618', seed: 31 + i });
  line(B.l, [[-600, 2800], [2900, 2800]], { w: 6, col: morn ? '#6b4a32' : '#140f10', seed: 38 });
  // window — broken after T_WIN
  const broke = t >= T_WIN;
  poly(B.f, rect(1750, 1250, 2250, 1850), morn ? '#cfe9ff' : '#141f44', 1, { seed: 40 });
  if (!broke) { line(B.l, [[2000, 1250], [2000, 1850]], { w: 8, col: '#151726', seed: 42 }); line(B.l, [[1750, 1550], [2250, 1550]], { w: 8, col: '#151726', seed: 43 }); }
  else for (const pts of [[[1750, 1250], [1880, 1250], [1790, 1420]], [[2250, 1250], [2120, 1250], [2220, 1400]], [[1750, 1850], [1760, 1680], [1870, 1850]], [[2250, 1850], [2240, 1700], [2120, 1850]]]) poly(B.l, pts, morn ? '#e8f4ff' : '#4a5a86', 1, { seed: 46 + pts[0][0] });
  edge(B.l, rect(1750, 1250, 2250, 1850), morn ? '#6b4a32' : '#0f1120', 14, 1, 41);
  if (morn) for (let i = 0; i < 3; i++) poly(GLOW, [[1770 + i * 150, 1260], [1850 + i * 150, 1260], [1500 + i * 150, 2800], [1300 + i * 150, 2800]], '#fff2c0', 0.3, { seed: 47 + i });
  else { dab(B.f, 2130, 1360, 38, { col: '#e9f0ff', p: 1, seed: 44 }); poly(GLOW, [[1760, 1260], [2240, 1260], [2050, 2800], [1350, 2800]], '#7d93d6', 0.14, { seed: 45 }); }
  // the almirah, wide open
  poly(B.f, rect(80, 1350, 520, 2800), morn ? '#6e4a32' : '#2e2018', 1, { seed: 50 }); edge(B.l, rect(80, 1350, 520, 2800), '#0c0808', 6, 1, 51);
  const aj = t < 2.5 ? lerp(0.75, 1.0, ei(pr(t, 0.4, 2.5))) : 1;
  poly(B.f, rect(300, 1380, 300 + 220 * aj, 2780), '#030305', 1, { seed: 53 }); poly(B.f, [[300 + 220 * aj, 1370], [560, 1400], [560, 2770], [300 + 220 * aj, 2800]], morn ? '#7a5238' : '#3a281e', 1, { seed: 54 });
  dab(B.l, 280, 2100, 10, { col: K.gold, p: 1, seed: 55 });
  // the door + gap
  poly(B.f, rect(680, 1580, 1120, 2800), '#120c0a', 1, { seed: 60 });
  poly(B.f, rect(700, 1600, 1100, 2790), morn ? '#7d5434' : '#3a281e', 1, { seed: 63 }); edge(B.l, rect(700, 1600, 1100, 2790), '#0c0808', 5, 1, 64);
  for (const [y0, y1] of [[1680, 2140], [2240, 2700]]) edge(B.l, rect(760, y0, 1040, y1), '#24180f', 4, 0.8, 65 + y0);
  dab(B.l, 1060, 2250, 13, { col: K.gold, p: 1, seed: 67 });
  poly(B.f, rect(700, 2786, 1100, 2800), '#ffe6a8', morn ? 0.6 : 0.3, { seed: 68 });
  edge(B.l, rect(680, 1580, 1120, 2800), '#0c0808', 10, 1, 70);
  // meter
  vuMeter(PROP, 1300, 2000, 0.5, dbAt(t), { sd: 2200, label: false, t });
  // the scratch marks (they stay)
  for (let i = 0; i < 4; i++) { const x0 = 1500 + i * 38, y0 = 1700 + i * 10; line(B.l, [[x0, y0], [x0 + 40, y0 + 340]], { w: 9, col: '#0b0c14', seed: 80 + i }); line(B.l, [[x0 + 6, y0], [x0 + 46, y0 + 340]], { w: 3, col: morn ? '#a88a66' : '#353a58', seed: 84 + i }); }
  // bed + table + lamp (off at night) + glass shards on the floor
  part(PE, rect(2280, 2050, 2380, 2800), { col: morn ? '#6e4a32' : '#2e2018', p: 1, seed: 90 }, { w: 5, col: '#0c0808', seed: 91 });
  part(PE, rect(1560, 2560, 2380, 2800), { col: morn ? '#6e4a32' : '#2e2018', p: 1, seed: 92 }, { w: 5, col: '#0c0808', seed: 93 });
  part(PE, rrect(1580, 2470, 2370, 2580, 20), { col: morn ? '#e9e1cf' : '#7d8298', p: 1, seed: 94 }, { w: 4, col: '#0c0808', seed: 95 });
  part(PE, rrect(2100, 2380, 2330, 2480, 30), { col: morn ? '#f6f1e4' : '#959ab0', p: 1, seed: 96 }, { w: 4, col: '#0c0808', seed: 97 });
  part(PROP, rect(1400, 2480, 1540, 2510), { col: morn ? '#6e4a32' : '#2e2018', p: 1, seed: 98 }, { w: 4, col: '#0c0808', seed: 99 });
  for (const x of [1412, 1528]) part(PROP, rect(x - 8, 2510, x + 8, 2800), { col: morn ? '#5a3c28' : '#20150f', p: 1, seed: 100 + x }, { w: 3, col: '#0c0808', seed: 101 + x });
  part(PROP, smooth([[1420, 2470], [1480, 2470], [1470, 2420], [1430, 2420]], 2), { col: '#3a3c4a', p: 1, seed: 110 }, { w: 3, col: '#0c0808', seed: 111 });
  part(PROP, smooth([[1400, 2420], [1500, 2420], [1475, 2340], [1425, 2340]], 2), { col: morn ? '#e8d8a8' : '#3a3528', p: 1, seed: 112 }, { w: 3, col: '#0c0808', seed: 113 });
  for (let i = 0; i < 9; i++) { const a = -Math.PI * (0.1 + 0.8 * hash(i * 2.3)), r = 30 + 90 * (0.5 + hash(i * 1.7)); part(FG, [[1560 + Math.cos(a) * r, 2795 + Math.sin(a) * r * 0.3], [1572 + Math.cos(a) * r, 2785 + Math.sin(a) * r * 0.3], [1566 + Math.cos(a) * r, 2800]], { col: '#cfe8ff', p: 0.8, seed: 130 + i }, { w: 2, col: '#7a93a8', seed: 140 + i }); }
}
function speaker(C, x, y, s, a = 0, sd = 1900, on = 0) {
  const c = Math.cos(a), si = Math.sin(a), R = (u, v) => [x + (u * c - v * si) * s, y + (u * si + v * c) * s];
  part(C, smooth([R(-70, -40), R(70, -40), R(80, 0), R(70, 40), R(-70, 40), R(-80, 0)], 3), { col: '#2c2e3a', p: 1, seed: sd }, { w: 4, col: '#0c0808', seed: sd + 1 });
  for (let i = 0; i < 3; i++) dab(C.l, ...R(-40 + i * 40, 0), 14 * s, { col: '#5c5f70', p: 1, seed: sd + 2 + i });
  dab(C.l, ...R(70, -30), 5 * s, { col: on ? '#4cf08a' : '#355', p: 1, seed: sd + 6 });
  if (on) for (let k = 0; k < 3; k++) { const r = (60 + 50 * k + ((BOIL.step * 9) % 50)) * s; line(FX, handCircle(x, y, r, sd + 10 + k, 0.1, 30).slice(0, 12), { w: 6, col: '#ffd36a', p: 0.8 - 0.2 * k, seed: sd + 20 + k }); }
}
function earHead(C, x, y, s, rot = 0, sd = 2400) {   // the faceless head with one ear (for under the bed / the mirror)
  const R = (u, v) => [x + (u * Math.cos(rot) - v * Math.sin(rot)) * s, y + (u * Math.sin(rot) + v * Math.cos(rot)) * s];
  part(C, Array.from({ length: 36 }, (_, i) => { const a = i / 36 * Math.PI * 2; return R(Math.cos(a) * 120, Math.sin(a) * 160); }), { col: '#050508', p: 1, seed: sd }, { w: 5, col: '#a493f5', seed: sd + 1 });
  const ear = [[10, -110], [60, -90], [80, -30], [70, 30], [40, 80], [10, 110], [-20, 100], [-22, 70], [5, 60], [25, 20], [28, -20], [10, -60], [-20, -70], [-40, -40], [-30, -95]].map(([u, v]) => R(u * 0.95, v * 0.95));
  part(C, smooth(ear, 4), { col: '#cdb4b0', p: 1, seed: sd + 2 }, { w: 4, col: '#3a2a2e', seed: sd + 3 });
  line(C.l, smooth([[-5, -75], [30, -60], [45, -10], [35, 40], [15, 70]].map(([u, v]) => R(u * 0.95, v * 0.95)), 4, false), { w: 5, col: '#8a6a6e', seed: sd + 4 });
  part(C, smooth([R(0, -20), R(15, 0), R(5, 25), R(-10, 10)], 3), { col: '#3a2026', p: 1, seed: sd + 5 }, null);
}
function lowerLegs(C, x, top, gy, k, sd = 2500) {   // the backward-bent legs + reversed feet next to the bed
  const lo = { w: 5, col: '#a493f5', seed: sd, p: 0.95 };
  for (const [sg, q] of [[-1, 0], [1, 10]]) {
    const hx = x + sg * 40 * k, knee = [hx + 110 * k, top + (gy - top) * 0.45], ank = [hx - 20 * k, gy - 110 * k];
    part(C, tube([[hx, top - 200], knee], 70 * k, 52 * k), { col: '#050508', p: 1, seed: sd + q }, lo);
    part(C, tube([knee, ank], 50 * k, 32 * k), { col: '#050508', p: 1, seed: sd + q + 1 }, lo);
    part(C, smooth([ank, [hx - 40 * k, gy - 30 * k], [hx - 30 * k, gy + 4], [hx + 150 * k, gy - 6], [hx + 140 * k, gy - 30 * k], [hx + 10 * k, gy - 60 * k]], 3), { col: '#050508', p: 1, seed: sd + q + 2 }, lo);
    for (let i = 0; i < 3; i++) line(C.l, [[hx + 120 * k + i * 8, gy - 20 + i * 6], [hx + 175 * k + i * 10, gy - 4 + i * 6]], { w: 3, col: '#d9d0c4', seed: sd + q + 3 + i });
  }
}

// ——— SET: under the bed (floor level) ———
function drawUnder(t) {
  const B = BG;
  poly(B.f, rect(8000, 1000, 10200, 3800), '#0d0e16', 1, { seed: 700 });
  poly(B.f, rect(9420, 1950, 10200, 2440), '#1b2140', 1, { seed: 701 }); poly(GLOW, rect(9420, 1950, 10200, 2440), '#7d93d6', 0.12, { seed: 702 });   // the dark room beyond the bed edge
  poly(B.f, rect(8000, 2440, 10200, 3800), '#241d20', 1, { seed: 703 });
  for (let i = 0; i < 6; i++) line(B.l, [[8000, 2500 + i * 120], [10200, 2500 + i * 120]], { w: 3, col: '#1c1618', seed: 704 + i });
  // the bed's underside: frame + slats (top of the frame)
  poly(B.f, rect(8000, 1600, 9420, 1950), '#2a1c14', 1, { seed: 710 });
  for (let i = 0; i < 7; i++) { poly(B.f, rect(8000, 1640 + i * 44, 9420, 1668 + i * 44), '#3a281e', 1, { seed: 711 + i }); }
  part(PROP, rect(9400, 1600, 9450, 2440), { col: '#2a1c14', p: 1, seed: 720 }, { w: 4, col: '#0c0808', seed: 721 });   // the bed leg / edge
  // the old message scratched into the wood (with tally marks)
  const g = t < 25.6 ? 0.22 : 0.85;
  wtext(B.l, 'आवाज़ दूर फेंको', 8980, 1800, { size: 60, weight: 700, col: '#d8c7b0', seed: 730, tilt: 2.0, p: g });
  for (let i = 0; i < 7; i++) line(B.l, [[8620 + i * 22 + (i === 4 ? -60 : 0), 1860], [8630 + i * 22 + (i === 4 ? 30 : 0), 1915 + (i === 4 ? -40 : 0)]], { w: 4, col: '#c8b79e', p: g, seed: 731 + i });
  wtext(B.l, '— किरायेदार, 403', 9220, 1900, { size: 32, weight: 700, col: '#b8a68c', seed: 740, tilt: 2, p: g });
}

// ——— SET: the mirror (morning) ———
function drawMirror(t) {
  const B = BG;
  poly(B.f, rect(11000, 1000, 13000, 3800), '#d6bf9c', 1, { seed: 800 }); for (let i = 0; i < 10; i++) line(B.l, [[11040 + i * 200, 1000], [11040 + i * 200, 3800]], { w: 3, col: '#c6ad88', seed: 801 + i });
  const frame = oval(12000, 2200, 420, 560, 40), glass = oval(12000, 2200, 380, 520, 40);
  poly(B.f, frame, '#8a6a3a', 1, { seed: 810 }); edge(B.l, frame, '#3a2a18', 6, 1, 811);
  poly(B.f, glass, '#9fb3c2', 1, { seed: 812 });
  poly(B.f, oval(12000, 2400, 380, 300, 30), '#7f93a2', 1, { seed: 813 });   // the room reflected (darker lower half)
  for (let i = 0; i < 3; i++) line(B.l, [[11760 + i * 60, 1820 + i * 30], [11820 + i * 60, 1760 + i * 30]], { w: 6, col: '#e8f4ff', seed: 814 + i });
}

// ——— SET: the next tenant's door (night, corridor side) ———
function drawNext(t) {
  const B = BG;
  poly(B.f, rect(13000, 1000, 15000, 3800), '#22253a', 1, { seed: 900 });
  poly(B.f, rect(13000, 2900, 15000, 3800), '#1a1418', 1, { seed: 901 });
  poly(B.f, rect(13700, 1700, 14300, 2900), '#4a3326', 1, { seed: 902 }); edge(B.l, rect(13700, 1700, 14300, 2900), '#0c0808', 8, 1, 903);
  for (const [y0, y1] of [[1780, 2260], [2360, 2820]]) edge(B.l, rect(13780, y0, 14220, y1), '#2a1c14', 4, 0.8, 904 + y0);
  dab(B.l, 14240, 2340, 15, { col: K.gold, p: 1, seed: 906 });
  poly(B.f, rrect(13920, 1560, 14080, 1640, 10), '#c9a86a', 1, { seed: 907 }); digits(B.l, '402', 14000, 1602, 52, '#3a2a18');
  poly(B.f, rect(13700, 2886, 14300, 2900), '#ffe6a8', 1, { seed: 908 }); sglow(14000, 2894, 140, '#ffe6a8', 0.3, 909);
  sglow(14000, 2300, 900, '#7d93d6', 0.12, 910);
}

// ——— dB chip / printed words ———
function dbChip(t) {
  const db = dbAt(t), col = db > 60 ? '#ff4a4a' : db > 30 ? '#ffc23a' : '#4cf08a';
  box(190, 560, 140, 52, 'rgba(10,10,16,0.95)');
  digits(SUBT, `${String(Math.round(db)).padStart(2, '0')} dB`, 190, 564, 58, col, { screen: true, glow: 1 });
}
const SUBY = 1560;
const SUBCOL = { N: K.white, X: '#ff9a8a' };
const WHO = { X: 'कबीर की आवाज़…?' };
function subTo(t) {
  const S = SUBS.find(s => t >= s.t0 && t < s.t1); if (!S) return;
  const txt = S.scr ?? S.text; if (!txt) return;
  const lines = txt.split('|'), size0 = 66, lh = size0 * 1.28;
  const g = SUBK.g; g.save(); g.font = `700 ${size0}px Kalam`; const tw = Math.max(...lines.map(l => g.measureText(l).width)); g.restore();
  const sc = tw > 980 ? 980 / tw : 1, size = size0 * sc;
  const g2 = SUBT.g, top = SUBY - 60, bot = SUBY + (lines.length - 1) * lh * sc + 40;
  const grd = g2.createLinearGradient(0, top - 60, 0, bot + 60); grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.3, 'rgba(0,0,0,0.45)'); grd.addColorStop(0.7, 'rgba(0,0,0,0.45)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g2.save(); g2.fillStyle = grd; g2.fillRect(0, top - 60, W, bot - top + 120); g2.restore();
  if (WHO[S.who]) { const nw = 26 + 19 * WHO[S.who].length; box(540, top - 18, nw / 2 + 12, 28, SUBCOL[S.who]); wtext(SUBT, WHO[S.who], 540, top - 6, { screen: true, size: 36, weight: 700, col: K.ink, seed: 5, tilt: 0 }); }
  lines.forEach((ln, i) => wtext(SUBT, ln, 540, SUBY + 24 + i * lh * sc, { screen: true, size, weight: 700, col: SUBCOL[S.who], outline: 9, reveal: pr(t, S.t0 + i * 0.3, S.t0 + i * 0.3 + 0.4), seed: 11 + S.t0 * 3 + i, tilt: 0 }));
}
export const TEXTS = t => { const S = SUBS.find(s => t >= s.t0 && t < s.t1); const tx = S && (S.scr ?? S.text); if (!tx) return []; const n = tx.split('|').length; return [{ id: 's' + S.t0, text: tx.replace(/\|/g, ' '), x0: 20, y0: SUBY - 110, x1: 1060, y1: SUBY + 60 + (n - 1) * 85 }]; };
const LABELS = [[60.3, 63.0, 'अगली सुबह…'], [80.7, 83.4, 'अगली रात… नया किरायेदार']];
const END = 85.2;
function badge(t) { if (t > END) return; const x = 905, y = 560; box(x, y, 118, 40, 'rgba(160,30,40,0.92)'); wtext(SUBT, 'भाग 2/2', x, y + 16, { screen: true, size: 46, weight: 700, col: K.white, seed: 3, tilt: 0 }); }
function labels(t) {
  const L = LABELS.find(l => t >= l[0] && t < l[1]);
  if (L) { const g = SUBT.g; g.save(); g.font = '700 58px Kalam'; const w = g.measureText(L[2]).width; g.restore(); box(540, 760, w / 2 + 40, 58, 'rgba(8,8,14,0.94)'); wtext(SUBT, L[2], 540, 782, { screen: true, size: 58, weight: 700, col: '#e8d7ff', reveal: pr(t, L[0] + 0.1, L[0] + 0.5), seed: 61 + L[0], tilt: 0 }); }
  if (t > 2.2 && t < 4.6) {   // title
    const u = back1(pr(t, 2.2, 2.5)); box(540, 880, 420 * u + 1, 100 * u + 1, 'rgba(8,8,14,0.95)');
    wtext(SUBT, 'ख़ामोशी की क़ीमत', 540, 915, { screen: true, size: 108 * u + 1, weight: 700, col: '#e8d7ff', seed: 81, tilt: 0 });
    const w = back1(pr(t, 2.7, 3.0)); box(540, 1040, 120 * w + 1, 44 * w + 1, 'rgba(160,30,40,0.95)');
    wtext(SUBT, 'भाग 2', 540, 1062, { screen: true, size: 58 * w + 1, weight: 700, col: K.white, seed: 82, tilt: 0 });
  }
  if (t > 63.4 && t < 66.4) tag(540, 1360, '( आवाज़ नहीं निकली… )', '#ff9a8a', 52, 'rgba(8,8,14,0.92)');
  if (t > 49.0 && t < 50.0) tag(540, 760, '95 dB!', '#ff4a4a', 70, 'rgba(8,8,14,0.92)');
}
function endCard(t) {
  if (t < END) return;
  const g = SUBT.g; g.save(); g.fillStyle = 'rgba(8,8,14,0.95)'; g.fillRect(0, 1180, W, 740); g.restore();
  wtext(SUBT, 'कहानी पूरी हुई…?', 540, 1290, { screen: true, size: 70, weight: 700, col: '#e8d7ff', reveal: pr(t, END + 0.05, END + 0.4), seed: 90, tilt: 0 });
  wtext(SUBT, 'भाग 3 चाहिए? कमेंट करो “3”', 540, 1395, { screen: true, size: 62, weight: 700, col: '#ffd36a', reveal: pr(t, END + 0.4, END + 0.8), seed: 91, tilt: 0 });
  const u = back1(pr(t, END + 0.9, END + 1.2)); box(540, 1520, 340 * u + 1, 56 * u + 1, 'rgba(160,30,40,0.97)');
  wtext(SUBT, 'अगला पन्ना कल', 540, 1544, { screen: true, size: 64 * u + 1, weight: 700, col: K.white, seed: 93, tilt: 0 });
  wtext(SUBT, 'Subscribe & Follow करो · @pannapalatkahani', 540, 1650, { screen: true, size: 44, weight: 700, col: '#ffd36a', reveal: pr(t, END + 1.3, END + 1.8), seed: 94, tilt: 0 });
  wtext(SUBT, '…पर धीरे से', 540, 1745, { screen: true, size: 46, weight: 700, col: '#cfd3e6', reveal: pr(t, END + 2.4, END + 2.8), seed: 95, tilt: 0 });
}

// ——— events ———
export const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
SUBS.forEach(S => { if (S.vo) ev(S.vt, 'voice', { id: S.vo, who: S.who }); });
ev(0, 'night', { dur: 60.2 }); ev(0.3, 'creak', { dur: 2 }); ev(1.0, 'stinger'); ev(2.2, 'whoosh'); ev(5.5, 'step'); ev(7.2, 'step'); ev(12.8, 'whoosh'); ev(12.9, 'breath', { dur: 12.6 });
ev(15.6, 'step'); ev(16.9, 'step'); ev(19.4, 'heartbeat', { dur: 6.2 }); ev(21.5, 'drain', { dur: 4.0 }); ev(25.6, 'whoosh'); ev(35.4, 'tick'); ev(38.0, 'tick'); ev(40.5, 'tick');
ev(43.6, 'whoosh'); ev(45.0, 'throw'); ev(46.4, 'clatter'); ev(T_PLAY, 'blast', { dur: T_WIN - T_PLAY + 0.2 }); ev(50.4, 'lunge'); ev(T_WIN, 'window'); ev(T_WIN + 0.1, 'stinger');
ev(55.0, 'exhale'); ev(57.6, 'step'); ev(T_MORN, 'birds', { dur: 8.2 }); ev(T_MORN, 'morning', { dur: 20.4 }); ev(63.4, 'silence', { dur: 2.2 }); ev(68.4, 'whoosh'); ev(69.6, 'stinger'); ev(80.6, 'whoosh'); ev(80.6, 'night', { dur: 11.4 }); ev(84.9, 'knock'); ev(85.3, 'knock'); ev(END, 'write', { dur: 1.6 });
[['A', 0], ['B', 4.0], ['C', 12.8], ['D', 19.4], ['E', 25.6], ['F', 35.4], ['G', 43.6], ['H', T_PLAY], ['I', T_WIN], ['J', 55.0], ['K', T_MORN], ['L', 63.4], ['M', 68.4], ['N', 72.0], ['O', 80.6], ['Z', END]].forEach(([id, t]) => ev(t, 'cue', { id }));

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
  let vig = 0.5;
  if (set === 'room') {
    const morn = t >= T_MORN;
    drawRoom2(t, morn ? 'morning' : 'dark');
    // THE THING in the room (0 → T_WIN)
    if (t < 12.8) {
      const x = lerp(330, 640, ei(pr(t, 0.2, 3.4))), k = lerp(0.6, 0.72, ei(pr(t, 0.2, 3.4)));
      balaa(PE, x, 2800, k, t, { glowEar: 0.6 + 0.4 * Math.sin(t * 2), bend: 0.25 });
    } else if (t >= 43.6 && t < T_WIN + 0.1) {
      const lung = pr(t, 50.4, T_WIN), x = lerp(1700, 1990, ei(lung)), k = 0.72;
      balaa(PE, x, 2800 - 300 * Math.sin(Math.PI * lung) * 0.8, k, t, { bend: t < 50.4 ? (t < T_PLAY ? 0.95 : lerp(0.95, 0.1, pr(t, T_PLAY, 48.4))) : 0.1, reach: t >= 50.4, glowEar: t >= T_PLAY ? 1 : 0.4 });
    }
    // the speaker: flies from under the bed to the window, blasts, then gone with it
    if (t >= 43.6 && t < T_WIN) {
      const u = pr(t, 45.0, 46.4), sx0 = lerp(1650, 2060, ei(u)), sy0 = lerp(2760, 2740, u) - 260 * Math.sin(Math.PI * u);
      speaker(FG, t < 45.0 ? 1650 : sx0, t < 45.0 ? 2760 : sy0, 0.7, u * 6, 1900, t >= T_PLAY);
      if (t >= T_PLAY - 0.1 && t < T_PLAY + 0.6) tag(540, 760, '▶  PLAY', '#4cf08a', 58, 'rgba(8,8,14,0.92)');
    }
    if (t >= T_WIN && t < T_WIN + 1.2) { for (let i = 0; i < 16; i++) { const a = -Math.PI * hash(i * 3.1), r = 60 + 500 * eo(pr(t, T_WIN, T_WIN + 0.8)) * (0.4 + hash(i * 1.3)); dab(FX, 2000 + Math.cos(a) * r, 1550 + Math.sin(a) * r * 0.8 + 400 * pr(t, T_WIN, T_WIN + 1.2), 10, { col: '#dff1ff', p: 1 - pr(t, T_WIN, T_WIN + 1.2), seed: 950 + i }); } flash(T_WIN, 0.35, '#e8f4ff', 0.5); }
    // Kabir
    const k = 1.0;
    if (t >= 57.4 && t < T_MORN) {   // crawls out, on his knees, breathing hard
      const x = 1700, hy = 2440;
      person3(FG, seat('kabir', x, t, { hy, k, kneel: 1, exp: { eyes: 'teary', brows: 'worried', mouth: BOIL.step % 4 < 2 ? 'o' : 'open' }, sweat: 1, look: [-0.6, 0.2], hands: { L: [x - 90, hy + 330], R: [x + 90, hy + 330] }, pose: { L: 'spread', R: 'spread' } }), 100);
    } else if (morn) {   // at the door with his bag — he tries to speak: no sound
      const kx = 1180, kgy = 2810, khy = kgy - AH * k, tries = t >= 63.4 && t < 65.6, shock = t >= 65.6;
      person3(FG, stand('kabir', kx, kgy, k, t, { exp: shock ? { eyes: 'pop', brows: 'up', mouth: 'o' } : tries ? { eyes: 'happy', brows: 'up', mouth: BOIL.step % 3 ? 'open' : 'smile' } : { eyes: 'open', brows: 'calm', mouth: 'smile' }, look: shock ? [0.2, 0.3] : [-0.6, 0], sweat: shock, hands: shock ? { L: [kx - 26, khy + 70], R: [kx + 26, khy + 74] } : { L: [kx - 80, khy + 320], R: [kx + 90, khy + 300] }, pose: shock ? { L: 'spread', R: 'spread' } : { R: 'grip' }, elbowDown: shock }), 100);
      part(FG, rrect(kx + 60, kgy - 260, kx + 220, kgy - 40, 24), { col: '#3a5a8a', p: 1, seed: 160 }, { w: 4, col: '#0c0808', seed: 161 });
    }
    if (!morn) tint('#000008', 0.35);
    vig = morn ? 0.25 : 0.55;
  } else if (set === 'under') {
    drawUnder(t);
    const kx = 8960, khy = 2240, kk = 1.35;
    const exp = t >= 30.4 && t < 35.4 ? { eyes: 'open', brows: 'up', mouth: 'small' } : t >= 25.6 && t < 30.4 ? { eyes: 'open', brows: 'worried', mouth: 'small' } : { eyes: t > 21.5 ? 'squeeze' : 'pop', brows: 'worried', mouth: 'small' };
    const handsMouth = t < 30.4;
    person3(PE, bust('kabir', kx, khy, kk, t, { L: 260, exp, sweat: 1, look: t >= 25.6 && t < 30.4 ? [0.2, -1] : t >= 30.4 ? [1, 0.6] : [0.6, 0], tears: t > 22 && t < 25.6, hands: handsMouth ? { L: [kx - 16, khy + 42], R: [kx + 16, khy + 46] } : { L: [kx - 110, khy + 260], R: [kx + 140, khy + 250] }, pose: handsMouth ? { L: 'flat', R: 'flat' } : { L: 'open', R: 'grip' }, elbowDown: 1 }), 100);
    part(FG, rect(8000, 2470, 10200, 3800), { col: '#241d20', p: 1, seed: 760 }, null);   // the floor hides his body
    line(FG.l, [[8000, 2470], [10200, 2470]], { w: 4, col: '#1c1618', seed: 761 });
    // phone + speaker on the floor
    const px = 9110, py = 2410;
    part(FG, rrect(px - 60, py - 30, px + 60, py + 30, 10), { col: '#15161d', p: 1, seed: 770 }, { w: 3, col: '#6b6f82', seed: 771 });
    if (t >= 35.4) {   // the screen: silent mode + Bluetooth → speaker
      poly(FG.l, rrect(px - 50, py - 22, px + 50, py + 22, 6), '#0f2236', 1, { seed: 772 });
      const m1 = t > 36.2, b1 = t > 38.6, c1 = t > 41.0;
      if (m1) { poly(FG.l, [[px - 42, py - 10], [px - 34, py - 10], [px - 26, py - 16], [px - 26, py + 2], [px - 34, py - 4], [px - 42, py - 4]], '#cfe3ff', 1, { seed: 773 }); line(FG.l, [[px - 22, py - 14], [px - 14, py - 2]], { w: 2.5, col: '#ff6a6a', seed: 774 }); line(FG.l, [[px - 22, py - 2], [px - 14, py - 14]], { w: 2.5, col: '#ff6a6a', seed: 775 }); }
      if (b1) wtext(FG.l, 'Bluetooth', px + 14, py - 2, { size: 13, weight: 700, col: '#9fd8ff', seed: 776, tilt: 0 });
      if (c1) wtext(FG.l, 'स्पीकर ✓', px + 14, py + 16, { size: 13, weight: 700, col: '#4cf08a', seed: 777, tilt: 0 });
    }
    speaker(FG, 9270, 2405, 0.55, 0, 1950, 0);
    // the thing: backward feet arrive, then the ear comes down to the floor
    if (t >= 15.4) lowerLegs(PROP, 9560, 1950, 2440, 0.8, 2500);
    if (t >= 19.4 && t < 35.4) {
      const u = ei(pr(t, 19.6, 22.0)); earHead(FG, 9360, lerp(1500, 2260, u), 0.85, -1.35, 2400);
      const th = pr(t, 21.5, 23.0) * (t < 30.4 ? 1 : 1 - pr(t, 30.4, 31.0));
      if (th > 0) {   // the thin glow from his throat into the ear — the theft nobody notices
        const a = [kx + 10, khy + 95], b = [9300, 2290], pts = []; for (let i = 0; i <= 16; i++) { const v = i / 16; pts.push([lerp(a[0], b[0], v), lerp(a[1], b[1], v) - 60 * Math.sin(Math.PI * v) + 10 * Math.sin(t * 6 + v * 9)]); }
        line(FX, pts, { w: 5, col: '#e8d7ff', p: 0.55 * th, seed: 780 });
        for (let i = 0; i < 6; i++) { const v = ((t * 0.5) + i / 6) % 1, q = pts[Math.round(v * 16)]; dab(FX, q[0], q[1], 6, { col: '#ffffff', p: 0.7 * th, seed: 781 + i }); }
      }
    }
    if (t >= 25.6 && t < 30.4) sglow(8980, 1800, 160, '#e8d7ff', 0.14, 790);
    vig = 0.55;
  } else if (set === 'mirror') {
    drawMirror(t);
    const show = pr(t, 69.6, 70.4);
    person3(PE, bust('kabir', 12000, 2150, 1.6, t, { L: 230, exp: t < 69.6 ? { eyes: 'open', brows: 'worried', mouth: 'small' } : { eyes: 'pop', brows: 'up', mouth: 'o' }, sweat: t > 69.6, look: [0, 0.3], mark: t > 70.0 ? '00 dB' : null }), 100);
    if (show > 0) { earHead(PROP, 12220, 1990, 0.55 * show + 0.01, -0.2, 2450); sglow(12220, 1990, 160, '#e8d7ff', 0.3 * show, 2470); }
    edge(FG.l, oval(12000, 2200, 400, 540, 40), '#8a6a3a', 40, 1, 2480);
    flash(69.6, 0.3, '#ffffff', 0.35);
    vig = 0.35;
  } else if (set === 'next') {
    drawNext(t);
    balaa(PE, 14560, 2900, 0.62, t, { bend: 0.45, glowEar: 0.8 + 0.2 * Math.sin(t * 3) });   // it stands at the next door, its ear to the wood
    vig = 0.5;
  }
  badge(t); if (t < END) dbChip(t);
  if (!NOSUBS) { subTo(t); labels(t); }
  else if (t > 2.2 && t < 4.6) labels(t);
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

