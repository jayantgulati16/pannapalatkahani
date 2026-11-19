// YouTube channel banner, 2560×1440 (safe area for all devices: centre 1546×423). Crayon picture-book style.
import { layer, clear, line, fill, dab, handCircle, smooth, CAM, BOIL } from './crayon.js';
import { group, clearGroup, part, tube } from './rig.js';
export const DUR = 1, EV = [], TEXTS = () => [];
const K = { ink: '#2d3263', yellow: '#f5c63c', orange: '#ec8a3c', red: '#d4483c', pink: '#ee8ea4', teal: '#4fb3a9', violet: '#6a5aa6', brown: '#7a4b31',
  green: '#62a24c', ochre: '#e7b867', white: '#fbfaf4', peach: '#f4c7a4', magenta: '#c4467e', cream: '#fbeec8' };
const BG = { f: layer(), l: layer() }, B = group(), FX = layer();
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
function wtext(L, str, x, y, size, col, sw = 3) { const g = L.g; g.save(); g.font = `700 ${size}px Kalam`; g.textAlign = 'center'; g.fillStyle = col; g.fillText(str, x, y); g.lineWidth = sw; g.strokeStyle = col; g.globalAlpha = .6; g.strokeText(str, x, y); g.restore(); }
function windowAt(x, y, w, h, seed, glass, sill) {
  fill(BG.f, rect(x, y, x + w, y + h), { col: glass, p: 0.5, gap: 10, w: 11, ang: 1.0, seed, boil: 0 });
  line(BG.l, [...rect(x, y, x + w, y + h), [x + 8, y]], { w: 5, seed: seed + 1, p: 0.7 });
  fill(BG.f, rect(x - 10, y + h, x + w + 10, y + h + 16), { col: sill, p: 0.7, gap: 7, w: 9, seed: seed + 3, boil: 0 });
}
function face(C, cx, cy, sd, m) {   // a simple happy face, head radius 60
  part(C, handCircle(cx, cy, 60, sd, 0.06, 40), { col: K.peach, p: 0.6, gap: 7, w: 9, ang: 0.5, seed: sd + 1 }, { w: 6, seed: sd + 2 });
  const hair = m ? smooth([[-64, 0], [-58, -48], [-26, -74], [0, -70], [28, -76], [60, -48], [66, 0], [48, -26], [18, -44], [0, -48], [-16, -42], [-46, -24]], 5)
    : smooth([[-66, 0], [-64, -48], [-44, -72], [-18, -80], [4, -94], [22, -78], [44, -88], [48, -64], [68, -50], [66, -4], [50, -30], [24, -38], [0, -34], [-26, -40], [-50, -24]], 5);
  part(C, hair.map(([x, y]) => [cx + x, cy + y]), { col: K.brown, p: 0.97, gap: 6, w: 9, ang: 1, seed: sd + 3 }, { w: 5.5, seed: sd + 4 });
  for (const s of [-1, 1]) {
    line(C.l, [[cx + s * 22 - 11, cy + 2], [cx + s * 22, cy - 8], [cx + s * 22 + 11, cy + 2]], { w: 5, seed: sd + 5 + s });
    fill(C.f, handCircle(cx + s * 38, cy + 18, 13, sd + 8 + s, 0, 16), { col: K.pink, p: 0.75, gap: 4, w: 6, seed: sd + 10 + s });
  }
  part(C, [[cx - 18, cy + 22], [cx + 18, cy + 22], [cx + 12, cy + 38], [cx, cy + 42], [cx - 12, cy + 38]], { col: K.red, p: 0.9, gap: 4, w: 6, seed: sd + 12 }, { w: 4.5, seed: sd + 13 });
  if (!m) for (const s of [-1, 1]) line(C.l, handCircle(cx + s * 22, cy - 3, 18, sd + 14 + s, 0.08, 22), { w: 4, seed: sd + 16 + s });
  else { dab(C.l, cx, cy - 30, 6, { col: K.red, p: 1, seed: sd + 18 }); }
}
export function frame(comp, t) {
  CAM.x = 1280; CAM.y = 720; CAM.s = 1; BOIL.amp = 0.4;
  clearGroup(B); [BG.f, BG.l, FX].forEach(clear);
  // sky wash behind the title
  fill(BG.f, rect(-40, -40, 2600, 1480), { col: K.cream, p: 0.35, gap: 16, w: 16, ang: 0.3, seed: 1, boil: 0 });
  // left building (ochre, Arjun's) and right building (teal, Meera's)
  fill(BG.f, rect(-40, 160, 560, 1500), { col: K.ochre, p: 0.6, gap: 12, w: 13, ang: 0.35, seed: 2, cross: true, crossP: 0.5, boil: 0 });
  line(BG.l, [[560, 1500], [560, 160], [-40, 160]], { w: 8, seed: 3, p: 0.7 });
  fill(BG.f, rect(-40, 128, 590, 164), { col: K.red, p: 0.7, gap: 8, w: 10, seed: 4, boil: 0 });
  windowAt(70, 260, 150, 180, 10, K.teal, K.red); windowAt(330, 260, 150, 180, 20, K.teal, K.green);
  windowAt(70, 1020, 150, 180, 30, K.teal, K.red); windowAt(330, 1020, 150, 180, 40, K.teal, K.red);
  fill(BG.f, rect(2000, 120, 2600, 1500), { col: K.teal, p: 0.55, gap: 12, w: 13, ang: 0.35, seed: 5, cross: true, crossP: 0.5, boil: 0 });
  line(BG.l, [[2000, 1500], [2000, 120], [2600, 120]], { w: 8, seed: 6, p: 0.7 });
  fill(BG.f, rect(1970, 88, 2600, 124), { col: K.orange, p: 0.7, gap: 8, w: 10, seed: 7, boil: 0 });
  windowAt(2090, 220, 150, 180, 50, K.yellow, K.violet); windowAt(2340, 220, 150, 180, 60, K.yellow, K.violet);
  windowAt(2090, 1020, 150, 180, 70, K.yellow, K.violet); windowAt(2340, 1020, 150, 180, 80, K.yellow, K.green);
  // Arjun peeking from his balcony (left), Meera from hers (right) — outside the safe area on phones, visible on TV/desktop
  fill(BG.f, rect(540, 700, 760, 724), { col: K.brown, p: 0.85, gap: 7, w: 9, seed: 90, boil: 0 });
  for (let i = 0; i < 6; i++) line(BG.l, [[556 + i * 38, 724], [556 + i * 38, 860]], { w: 6, col: K.brown, seed: 91 + i, p: 0.85 });
  line(BG.l, [[540, 860], [760, 860]], { w: 8, col: K.brown, seed: 99, p: 0.9 });
  fill(BG.f, rect(1800, 700, 2020, 724), { col: K.brown, p: 0.85, gap: 7, w: 9, seed: 100, boil: 0 });
  for (let i = 0; i < 6; i++) line(BG.l, [[1816 + i * 38, 724], [1816 + i * 38, 860]], { w: 6, col: K.brown, seed: 101 + i, p: 0.85 });
  line(BG.l, [[1800, 860], [2020, 860]], { w: 8, col: K.brown, seed: 109, p: 0.9 });
  part(B, rect(600, 690, 720, 760), { col: K.teal, p: 0.8, gap: 8, w: 9, seed: 110 }, { w: 6, seed: 111 });
  face(B, 660, 620, 120, false);
  part(B, rect(1840, 690, 1960, 760), { col: K.yellow, p: 0.85, gap: 8, w: 9, seed: 130 }, { w: 6, seed: 131 });
  face(B, 1900, 620, 140, true);
  // clothesline across the lane with three notes and a heart
  const rope = []; for (let i = 0; i <= 24; i++) { const u = i / 24; rope.push([560 + 1440 * u, 330 + 70 * Math.sin(Math.PI * u)]); }
  line(BG.l, rope, { w: 4, col: K.ink, seed: 150, p: 0.7 });
  for (const [u, col, sd] of [[0.12, K.white, 160], [0.88, K.white, 170]]) { const x = 560 + 1440 * u, y = 330 + 70 * Math.sin(Math.PI * u); part(B, rect(x - 40, y + 4, x + 40, y + 96), { col, p: 0.9, gap: 6, w: 8, seed: sd }, { w: 4.5, seed: sd + 1 }); }
  // marigold strings hanging from the top edge
  for (let i = 0; i < 22; i++) { const x = 30 + i * 120, len = 70 + 60 * ((i * 7) % 5) / 4; for (let k = 0; k * 24 < len; k++) dab(BG.l, x, k * 24 + 10, 13, { col: k % 3 === 2 ? K.yellow : K.orange, p: 0.95, seed: 200 + i * 10 + k }); }
  // title + tagline in the safe area (centre 1546×423 → x 507–2053, y 508–931)
  wtext(BG.l, 'पन्ना पलट', 1280, 760, 230, K.ink, 4);
  wtext(BG.l, 'हर दिन एक नई कहानी', 1280, 880, 84, K.red, 2);
  // a little open book and crayons under the title
  const cx = 1280, by = 1060;
  part(B, [[cx - 170, by - 10], [cx, by + 8], [cx + 170, by - 10], [cx + 170, by + 12], [cx, by + 30], [cx - 170, by + 12]], { col: K.red, p: 0.95, gap: 7, w: 9, seed: 300 }, { w: 5, seed: 301 });
  part(B, smooth([[cx - 160, by - 10], [cx - 166, by - 110], [cx - 80, by - 128], [cx - 4, by - 116], [cx, by + 4], [cx - 80, by - 10]], 6), { col: K.white, p: 0.9, gap: 6, w: 8, seed: 302 }, { w: 5, seed: 303 });
  part(B, smooth([[cx + 160, by - 10], [cx + 166, by - 110], [cx + 80, by - 128], [cx + 4, by - 116], [cx, by + 4], [cx + 80, by - 10]], 6), { col: K.white, p: 0.9, gap: 6, w: 8, seed: 304 }, { w: 5, seed: 305 });
  for (const [x, a, col, sd] of [[cx - 330, -0.4, K.teal, 310], [cx - 250, 0.3, K.yellow, 320], [cx + 260, -0.25, K.red, 330], [cx + 340, 0.45, K.violet, 340]]) {
    const p0 = [x, by - 10], p1 = [x + Math.sin(a) * 120, by - 10 - Math.cos(a) * 120];
    part(B, tube([p0, p1], 30, 24), { col, p: 0.95, gap: 4, w: 6, seed: sd }, { w: 4.5, seed: sd + 1 });
  }
  wtext(BG.l, 'रोज़ शाम 7:30 बजे · @pannapalatkahani', 1280, 1210, 54, K.ink, 1.5);
  for (const [x, y, s] of [[900, 560, 1], [1680, 540, .8], [1060, 1000, .6], [1520, 1010, .7]]) { line(FX, [[x - 22 * s, y], [x + 22 * s, y]], { w: 7, col: K.pink, seed: x }); line(FX, [[x, y - 22 * s], [x, y + 22 * s]], { w: 7, col: K.pink, seed: y }); }
  comp.paperCam(1280, 720, 1); comp.begin();
  comp.crayon(BG.f.c); comp.crayon(BG.l.c); comp.group(B); comp.crayon(FX.c); comp.finish({ vig: 0.1 });
}
export function testFrame(comp, t) { frame(comp, t); }
