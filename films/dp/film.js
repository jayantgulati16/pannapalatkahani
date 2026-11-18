import { layer, clear, line, fill, dab, handCircle, smooth, xf, CAM, BOIL } from './crayon.js';
import { group, clearGroup, part } from './rig.js';
export const DUR = 1, EV = [], TEXTS = () => [];
const K = { ink: '#2d3263', yellow: '#f5c63c', orange: '#ec8a3c', red: '#d4483c', pink: '#ee8ea4', teal: '#4fb3a9', violet: '#6a5aa6', brown: '#7a4b31', green: '#62a24c' };
const BG = { f: layer(), l: layer() }, B = group(), FX = layer();
const R = p => p;
function wtext(L, str, x, y, size, col) { const g = L.g; g.save(); g.font = `700 ${size}px Kalam`; g.textAlign = 'center'; g.fillStyle = col; g.fillText(str, x, y); g.lineWidth = 3; g.strokeStyle = col; g.globalAlpha = .6; g.strokeText(str, x, y); g.restore(); }
export function frame(comp, t) {
  CAM.x = 540; CAM.y = 960; CAM.s = 1; BOIL.amp = 0.4;
  clearGroup(B); [BG.f, BG.l, FX].forEach(clear);
  // a big sunny disc behind everything
  fill(BG.f, handCircle(540, 960, 505, 3, 0, 80), { col: K.yellow, p: 0.62, gap: 12, w: 13, ang: 0.4, seed: 4, cross: true, crossP: 0.5, over: 4 });
  line(BG.l, handCircle(540, 960, 505, 3, 0.05, 80), { w: 9, col: K.orange, seed: 5 });
  // title
  wtext(BG.l, 'पन्ना पलट', 540, 760, 170, K.ink);
  // book: cover strip, two pages, spine
  const cx = 540, by = 1180;
  part(B, [[cx - 400, by - 30], [cx, by + 10], [cx + 400, by - 30], [cx + 400, by + 20], [cx, by + 60], [cx - 400, by + 20]], { col: K.red, p: 0.95, gap: 8, w: 10, seed: 10 }, { w: 7, seed: 11 });
  const left = smooth([[cx - 380, by - 30], [cx - 390, by - 260], [cx - 200, by - 300], [cx - 10, by - 270], [cx, by + 6], [cx - 190, by - 24]], 6);
  const right = smooth([[cx + 380, by - 30], [cx + 390, by - 260], [cx + 200, by - 300], [cx + 10, by - 270], [cx, by + 6], [cx + 190, by - 24]], 6);
  part(B, left, null, { w: 7, seed: 12 }); part(B, right, null, { w: 7, seed: 13 });
  // left page doodle: a heart; right page: a cloud with rain
  const hp = smooth([[0, 26], [-40, -10], [-34, -38], [-12, -40], [0, -22], [12, -40], [34, -38], [40, -10]], 6).map(([x, y]) => [cx - 200 + x * 1.5, by - 150 + y * 1.5]);
  fill(B.f, hp, { col: K.red, p: 0.95, gap: 6, w: 8, seed: 14 }); line(B.l, hp, { w: 6, seed: 15 });
  const cl = smooth([[150, -130], [170, -190], [230, -210], [280, -185], [320, -195], [345, -150], [310, -120], [180, -115]], 6).map(([x, y]) => [cx + x - 40, by + y]);
  fill(B.f, cl, { col: K.teal, p: 0.9, gap: 7, w: 9, seed: 16 }); line(B.l, cl, { w: 6, seed: 17 });
  for (let i = 0; i < 5; i++) line(B.l, [[cx + 150 + i * 32, by - 95 + (i % 2) * 14], [cx + 143 + i * 32, by - 65 + (i % 2) * 14]], { w: 6, col: K.violet, seed: 18 + i });
  // the turning page, mid-flip, lifting from the spine
  const turn = smooth([[cx + 4, by + 4], [cx + 70, by - 120], [cx + 120, by - 320], [cx + 60, by - 360], [cx - 30, by - 300], [cx - 40, by - 140]], 6);
  part(B, turn, null, { w: 7, seed: 30 });
  line(B.l, smooth([[cx + 20, by - 40], [cx + 60, by - 180], [cx + 80, by - 300]], 6, false), { w: 3, p: 0.35, seed: 31 });
  // motion arcs + sparkles
  for (let k = 0; k < 3; k++) line(FX, smooth([[cx + 150 + k * 22, by - 380 + k * 10], [cx + 200 + k * 25, by - 300], [cx + 175 + k * 22, by - 210]], 6, false), { w: 5, col: K.orange, seed: 40 + k });
  for (const [x, y, s] of [[cx - 330, by - 360, 1], [cx + 330, by - 390, .8], [cx - 150, by - 410, .6]]) { line(FX, [[x - 22 * s, y], [x + 22 * s, y]], { w: 6, col: K.pink, seed: x }); line(FX, [[x, y - 22 * s], [x, y + 22 * s]], { w: 6, col: K.pink, seed: y }); }
  comp.paperCam(540, 960, 1); comp.begin();
  comp.crayon(BG.f.c); comp.crayon(BG.l.c); comp.group(B); comp.crayon(FX.c); comp.finish({ vig: 0.12 });
}
export function testFrame(comp, t) { frame(comp, t); }
