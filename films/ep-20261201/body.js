
// ═══════════════════════ 3D world → our flat drawing ═══════════════════════
const C3 = { wall: '#c9cdca', ceil: '#d8d9d3', floor: '#484c57', seat: '#97a3b1', seatB: '#6a7483', steel: '#c4cad2', door: '#b8bec6',
  seam: '#e8a92a', dwin: '#151b2d', glass: '#a7c0ca', tunnel: '#0d1222', tlight: '#ffd98a', lamp: '#fffdf0', rubber: '#2c2e35',
  ad1: '#d9c7a0', ad2: '#9cc2b3', map: '#2d4f86',
  shirt: '#a7c7e8', trou: '#383d4c', shoe: '#2a2522', bag: '#2f323d', rHair: '#1f1714', rSkin: '#d9a27f',
  saree: '#f2efe7', pallu: '#ebe7dd', border: '#8fa3bd', mSkin: '#cf9a76', mHair: '#c4c0ba', chappal: '#6b4a32' };
const hex = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; };
const rgb = ([r, g, b]) => `rgb(${r | 0},${g | 0},${b | 0})`;
const shade = (h, k) => rgb(hex(h).map(v => v * k));
const mixC = (a, b, u) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, '0')).join(''); };

// one region = one drawing recipe: col fill, ow outline width (px, 0 = none), lc line colour, shade (darker fill on the shadow side)
const R = {}, RR = {};   // RR = the same parts seen as a faint reflection in the night glass
function reg(name, col, o = {}) {
  R[name] = region({ col, ow: o.ow ?? 3, lc: o.lc, shade: o.shade ?? 1, glow: o.glow, head: o.head });
  RR[name] = region({ col: mixC(col, C3.tunnel, 0.62), ow: o.ow ? 2 : 0, lc: '#2a3350', shade: 0, refl: 1, head: o.head ? o.head + 'R' : 0 });
}
reg('tunnel', C3.tunnel, { ow: 0, shade: 0 }); reg('tlight', C3.tlight, { ow: 0, shade: 0, glow: 1 });
reg('wall', C3.wall, { ow: 3 }); reg('ceil', C3.ceil, { ow: 3, shade: 0 }); reg('floor', C3.floor, { ow: 3, shade: 0 });
reg('lamp', C3.lamp, { ow: 0, shade: 0, glow: 1 }); reg('seat', C3.seat); reg('seatB', C3.seatB); reg('steel', C3.steel, { ow: 2.5 });
reg('door', C3.door); reg('seam', C3.seam, { ow: 2 }); reg('dwin', C3.dwin, { ow: 3, shade: 0 }); reg('glass', C3.glass, { ow: 3, shade: 0 });
reg('rubber', C3.rubber); reg('ad1', C3.ad1); reg('ad2', C3.ad2); reg('map', C3.map);
reg('shirt', C3.shirt, { ow: 4 }); reg('trou', C3.trou, { ow: 4 }); reg('shoe', C3.shoe, { ow: 4 }); reg('bag', C3.bag, { ow: 4 });
reg('rSkin', C3.rSkin, { ow: 4 }); reg('rHead', C3.rSkin, { ow: 4.5, head: 'rohan', shade: 0 }); reg('rHair', C3.rHair, { ow: 4 });
reg('saree', C3.saree, { ow: 4 }); reg('pallu', C3.pallu, { ow: 4 }); reg('border', C3.border, { ow: 0, shade: 0 });
reg('mSkin', C3.mSkin, { ow: 4 }); reg('mHead', C3.mSkin, { ow: 4.5, head: 'maa', shade: 0 }); reg('mHair', C3.mHair, { ow: 3.5 });
reg('chappal', C3.chappal, { ow: 3 }); reg('tiffin', '#c9ced6', { ow: 3.5 });

const V = (x, y, z) => new THREE.Vector3(x, y, z);
let MAP = R, SIDE = THREE.FrontSide;
const M = (geo, name, ds) => mesh(geo, MAP[name], ds || MAP === RR ? THREE.DoubleSide : SIDE);
const add = (m, x, y, z, p) => { m.position.set(x, y, z); p.add(m); return m; };
const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); p.add(g); return g; };
const boxm = (p, name, x0, y0, z0, x1, y1, z1) => add(M(new THREE.BoxGeometry(Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0)), name), (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, p);
function limb(p, name, a, b, r) { const d = b.clone().sub(a), L = d.length(); const m = M(new THREE.CapsuleGeometry(r, L, 4, 14), name); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); p.add(m); return m; }
function ball(p, name, x, y, z, r, sx = 1, sy = 1, sz = 1) { const m = add(M(new THREE.SphereGeometry(r, 26, 18), name), x, y, z, p); m.scale.set(sx, sy, sz); return m; }
function cylm(p, name, x, y, z, r0, r1, h, n = 24) { return add(M(new THREE.CylinderGeometry(r0, r1, h, n), name), x, y, z, p); }

// a hand with real fingers: wrist point, pointing direction, palm-up vector, sg = which side the thumb is on
function hand3(p, name, wrist, dir, up, sg, pose = 'open', s = 1) {
  const f = dir.clone().normalize(), side = new THREE.Vector3().crossVectors(f, up).normalize(), u = new THREE.Vector3().crossVectors(side, f).normalize();
  const pc = wrist.clone().addScaledVector(f, 0.04 * s);
  const palm = ball(p, name, pc.x, pc.y, pc.z, 0.04 * s, 1.05, 0.5, 1); palm.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(side, u, f));
  const curl = pose === 'grip' ? 1.0 : pose === 'fist' ? 1.5 : 0.2;
  for (let i = 0; i < 4; i++) {
    const b = pc.clone().addScaledVector(f, 0.034 * s).addScaledVector(side, (i - 1.5) * 0.018 * s), L = (i === 1 || i === 2 ? 0.048 : 0.04) * s;
    limb(p, name, b, b.clone().addScaledVector(f, L * Math.cos(curl)).addScaledVector(u, -L * Math.sin(curl)), 0.0088 * s);
  }
  const tb = pc.clone().addScaledVector(side, sg * 0.03 * s).addScaledVector(f, -0.01 * s);
  limb(p, name, tb, tb.clone().addScaledVector(f, 0.03 * s).addScaledVector(side, sg * 0.018 * s).addScaledVector(u, -0.01 * s), 0.01 * s);
}

// ——— the coach: walls with windows, longitudinal steel benches, glass partitions, poles, rails, handles, doors, lamps ———
const CW = 1.42, CL = 13, DOORS = [-6.5, 0, 6.5], SEGS = [[-12.3, -7.4], [-5.6, -0.9], [0.9, 5.6], [7.4, 12.3]];
function coach(p, z0 = 0) {
  const g = G(p, 0, 0, z0);
  boxm(g, 'floor', -CW, -0.05, -CL, CW, 0, CL); boxm(g, 'ceil', -CW, 2.3, -CL, CW, 2.36, CL);
  for (const x of [-0.7, 0.7]) for (const [a, b] of SEGS) boxm(g, 'lamp', x - 0.08, 2.27, a, x + 0.08, 2.3, b);
  for (const s of [-1, 1]) {
    const xi = s * CW, xo = s * (CW + 0.06);
    // wall: below the windows, above them, pillars between them; doors in the gaps
    let zs = -CL;
    for (const dz of DOORS) {
      const a = zs, b = dz - 0.65;
      boxm(g, 'wall', xi, 0, a, xo, 0.95, b); boxm(g, 'wall', xi, 1.75, a, xo, 2.3, b);
      const n = Math.max(1, Math.round((b - a) / 1.4)), wwid = (b - a) / n;
      for (let i = 0; i <= n; i++) { const zc = a + i * wwid; boxm(g, 'wall', xi, 0.95, Math.max(a, zc - 0.13), xo, 1.75, Math.min(b, zc + 0.13)); }
      for (let i = 0; i < n; i++) boxm(g, i % 2 ? 'ad1' : 'ad2', xi - s * 0.01, 1.84, a + i * wwid + 0.25, xi, 2.14, a + (i + 1) * wwid - 0.25);
      // the door: two leaves, a dark window in each, the yellow seam in the middle
      boxm(g, 'door', xi, 0, dz - 0.65, xo, 2.02, dz + 0.65); boxm(g, 'wall', xi, 2.02, dz - 0.65, xo, 2.3, dz + 0.65);
      for (const h of [-1, 1]) boxm(g, 'dwin', xi - s * 0.012, 1.0, dz + h * 0.1, xi, 1.72, dz + h * 0.5);
      boxm(g, 'seam', xi - s * 0.014, 0, dz - 0.025, xi, 2.02, dz + 0.025);
      boxm(g, 'map', xi - s * 0.012, 2.06, dz - 0.6, xi, 2.24, dz + 0.6);
      zs = dz + 0.65;
    }
    { const a = zs, b = CL; boxm(g, 'wall', xi, 0, a, xo, 0.95, b); boxm(g, 'wall', xi, 1.75, a, xo, 2.3, b);
      const n = Math.max(1, Math.round((b - a) / 1.4)), wwid = (b - a) / n;
      for (let i = 0; i <= n; i++) { const zc = a + i * wwid; boxm(g, 'wall', xi, 0.95, Math.max(a, zc - 0.13), xo, 1.75, Math.min(b, zc + 0.13)); }
      for (let i = 0; i < n; i++) boxm(g, i % 2 ? 'ad1' : 'ad2', xi - s * 0.01, 1.84, a + i * wwid + 0.25, xi, 2.14, a + (i + 1) * wwid - 0.25); }
    // benches + glass partitions + poles
    for (const [a, b] of SEGS) {
      boxm(g, 'seatB', xi - s * 0.46, 0, a, xi, 0.4, b); boxm(g, 'seat', xi - s * 0.48, 0.4, a, xi, 0.46, b);
      const bk = boxm(g, 'seat', xi - s * 0.08, 0.46, a, xi, 0.9, b); bk.rotation.z = s * 0.08;
      for (const ze of [a, b]) {
        boxm(g, 'glass', xi - s * 0.56, 0.12, ze - 0.015, xi, 1.55, ze + 0.015);
        cylm(g, 'steel', xi - s * 0.56, 1.15, ze, 0.022, 0.022, 2.3, 12);
      }
      for (let z = a + 0.3; z < b - 0.2; z += 0.55) { const hd = add(M(new THREE.TorusGeometry(0.045, 0.009, 8, 18), 'steel'), s * 0.62, 1.8, z, g); hd.rotation.y = Math.PI / 2; boxm(g, 'steel', s * 0.62 - 0.008, 1.84, z - 0.008, s * 0.62 + 0.008, 1.98, z + 0.008); }
    }
    cylm(g, 'steel', s * 0.62, 1.98, 0, 0.016, 0.016, 2 * CL - 0.2, 10).rotation.x = Math.PI / 2;
  }
  // end walls with the open gangway to the next coach
  for (const e of [-1, 1]) {
    const z = e * CL;
    boxm(g, 'wall', -CW, 0, z, -0.5, 2.3, z + e * 0.06); boxm(g, 'wall', 0.5, 0, z, CW, 2.3, z + e * 0.06); boxm(g, 'wall', -0.5, 1.95, z, 0.5, 2.3, z + e * 0.06);
    boxm(g, 'rubber', -0.62, 0, z + e * 0.06, -0.5, 2.0, z + e * 0.5); boxm(g, 'rubber', 0.5, 0, z + e * 0.06, 0.62, 2.0, z + e * 0.5); boxm(g, 'rubber', -0.62, 1.95, z + e * 0.06, 0.62, 2.05, z + e * 0.5);
    boxm(g, 'floor', -0.5, -0.05, z, 0.5, 0, z + e * 0.5);
  }
  return g;
}

// ——— the cast (3D bodies; faces are drawn in 2D on the head) ———
// Rohan (28, office): light-blue shirt, sleeves rolled, dark trousers, laptop bag. Seated: local +z = where he faces.
function rohan(p, o = {}) {
  const g = G(p);
  for (const s of [-1, 1]) { limb(g, 'trou', V(s * 0.09, 0.5, 0), V(s * 0.1, 0.5, 0.4), 0.074); limb(g, 'trou', V(s * 0.1, 0.5, 0.4), V(s * 0.11, 0.09, 0.44), 0.062); ball(g, 'shoe', s * 0.11, 0.045, 0.5, 0.068, 0.9, 0.6, 1.6); }
  ball(g, 'trou', 0, 0.53, -0.02, 0.17, 1.05, 0.6, 0.85);
  const tor = limb(g, 'shirt', V(0, 0.62, -0.03), V(0, 0.96, -0.01), 0.15); tor.scale.set(1.2, 1, 0.82);
  limb(g, 'rSkin', V(0, 1.0, 0), V(0, 1.12, 0.01), 0.045); ball(g, 'shirt', 0, 1.045, 0, 0.1, 1.5, 0.45, 1.15);
  const hd = G(g, 0, 1.25, 0.02); hd.rotation.set(o.pitch || 0, o.yaw || 0, 0, 'YXZ');
  ball(hd, 'rHead', 0, 0, 0, 0.13); for (const s of [-1, 1]) ball(hd, 'rHead', s * 0.127, -0.005, -0.005, 0.028, 0.55, 1, 1);
  const hair = add(M(new THREE.SphereGeometry(0.139, 26, 18, 0, Math.PI * 2, 0, Math.PI * 0.5), 'rHair'), 0, 0.01, -0.012, hd); hair.rotation.x = -0.55;
  ball(hd, 'rHair', 0.025, 0.095, 0.06, 0.075, 1.45, 0.5, 0.95);
  for (const s of [-1, 1]) {
    const sh = V(s * 0.2, 0.93, -0.01), el = (o.el && o.el[s]) || V(s * 0.24, 0.7, 0.08), hn = (o.hn && o.hn[s]) || V(s * 0.13, 0.6, 0.3);
    limb(g, 'shirt', sh, el, 0.056); const mid = el.clone().lerp(hn, 0.3); limb(g, 'shirt', el, mid, 0.05); limb(g, 'rSkin', mid, hn, 0.04);
    hand3(g, 'rSkin', hn, hn.clone().sub(el), V(0, 1, 0), -s, (o.pose && o.pose[s]) || 'open');
  }
  boxm(g, 'bag', -0.52, 0.46, -0.14, -0.28, 0.76, 0.1);
  return { g, head: hd, r: 0.13 };
}
// Maa (the old woman): white saree, the pallu over her head, grey hair, round glasses, the steel tiffin on her lap.
function maa(p, o = {}) {
  const g = G(p);
  ball(g, 'saree', 0, 0.52, 0.12, 0.2, 1, 0.48, 1.45);
  const sk = cylm(g, 'saree', 0, 0.25, 0.33, 0.16, 0.2, 0.46, 22); sk.scale.set(1.15, 1, 0.55);
  for (const s of [-1, 1]) ball(g, 'chappal', s * 0.08, 0.025, 0.42, 0.05, 0.9, 0.45, 1.6);
  const tor = limb(g, 'saree', V(0, 0.6, -0.02), V(0, 0.88, 0), 0.14); tor.scale.set(1.15, 1, 0.85);
  limb(g, 'mSkin', V(0, 0.93, 0), V(0, 1.04, 0.01), 0.04);
  const hd = G(g, 0, 1.15, 0.03); hd.rotation.set(o.pitch || 0, o.yaw || 0, 0, 'YXZ');
  ball(hd, 'mHead', 0, 0, 0, 0.12);
  add(M(new THREE.SphereGeometry(0.124, 26, 18, 0, Math.PI * 2, 0, Math.PI * 0.42), 'mHair'), 0, 0.006, -0.004, hd).rotation.x = -0.12;
  add(M(new THREE.SphereGeometry(0.146, 30, 20, Math.PI * 0.78, Math.PI * 1.44, 0, Math.PI * 0.74), 'pallu', 1), 0, 0.004, -0.02, hd);
  for (const s of [-1, 1]) limb(g, 'pallu', V(s * 0.115, 1.12, 0.0), V(s * 0.17, 0.84, -0.01), 0.05);   // the pallu falls on both sides of her face
  add(M(new THREE.CylinderGeometry(0.13, 0.26, 0.36, 28, 1, true, Math.PI * 0.36, Math.PI * 1.28), 'pallu', 1), 0, 0.9, -0.03, g);
  for (const s of [-1, 1]) {
    const sh = V(s * 0.17, 0.88, 0), el = V(s * 0.2, 0.67, 0.1), hn = V(s * 0.085, 0.67, 0.25);
    limb(g, 'saree', sh, el, 0.05); limb(g, 'mSkin', el, hn, 0.036);
    hand3(g, 'mSkin', hn, hn.clone().sub(el), V(0, 1, 0), s, 'grip', 0.9);
  }
  const tf = G(g, 0, 0.62, 0.25);   // the 3-tier steel tiffin
  for (let i = 0; i < 3; i++) cylm(tf, 'tiffin', 0, 0.05 + i * 0.066, 0, 0.068, 0.068, 0.06, 28);
  cylm(tf, 'tiffin', 0, 0.25, 0, 0.03, 0.06, 0.03, 20);
  const hdl = add(M(new THREE.TorusGeometry(0.06, 0.007, 8, 22, Math.PI), 'tiffin'), 0, 0.27, 0, tf);
  return { g, head: hd, r: 0.12, tiffin: tf };
}

// ——— build the world ———
let N, scene, cam, MIR, ROH, MAA, ROH_R, TL = [];
const ROH_Z = 3.6, MAA_Z = 1.25, SEAT_X = -CW + 0.27;
function build() {
  scene = new THREE.Scene();
  MAP = R;
  add(M(new THREE.BoxGeometry(14, 7, 140), 'tunnel', 0), 0, 1.2, -20, scene).material.side = THREE.BackSide;
  for (let i = 0; i < 24; i++) for (const s of [-1, 1]) { const m = boxm(scene, 'tlight', 0, 0, 0, 0.12, 0.08, 0.6); m.userData.s = s; m.userData.i = i; TL.push(m); }
  coach(scene, 0); coach(scene, -2 * CL - 1);
  ROH = rohan(G(scene, SEAT_X, 0, ROH_Z)); ROH.g.parent.rotation.y = Math.PI / 2;
  MAA = maa(G(scene, SEAT_X, 0, MAA_Z)); MAA.g.parent.rotation.y = Math.PI / 2;
  // the night glass on the right-hand wall (x = +CW) reflects the coach: a mirrored copy behind it, faint. MAA IS NOT IN IT.
  MAP = RR;
  MIR = G(scene, 2 * CW + 0.08, 0, 0); MIR.scale.x = -1;
  coach(MIR, 0);
  ROH_R = rohan(G(MIR, SEAT_X, 0, ROH_Z)); ROH_R.g.parent.rotation.y = Math.PI / 2;
  MAP = R;
  cam = new THREE.PerspectiveCamera(52, RW / RH, 0.03, 200);
  N = makeNPR();
}

// pose the cast for time t (both Rohan and his reflection get the same pose)
function poseCast(t, P) {
  for (const c of [ROH, ROH_R]) { c.head.rotation.set(P.rp || 0, P.ry || 0, 0, 'YXZ'); }
  MAA.head.rotation.set(P.mp || 0, P.my || 0, 0, 'YXZ');
  MAA.g.visible = P.maa !== 0; ROH.g.visible = !P.pov;
  const v = 9;   // the tunnel lights rush past
  for (const m of TL) { const L = 140; let z = ((m.userData.i * 6 + t * v) % L + L) % L - 100; m.position.set(m.userData.s * 6.8, 1.6, z); }
}

// ——— layers ———
const SC = group(), FACE = group(), FACER = group(), GLOW = layer(), FX = layer(), SUBK = layer(), SUBT = layer();
function ringPath(g, rings) { g.beginPath(); for (const r of rings) { r.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); } }
function drawRegions(Sh) {
  const g = SC.f.g, gl = SC.l.g;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); gl.save(); gl.setTransform(1, 0, 0, 1, 0, 0);
  for (const id in Sh) { const R0 = REG[id], s = Sh[id]; if (!R0) continue;
    ringPath(g, s.rings); g.fillStyle = R0.col; g.fill('evenodd');
    if (s.dark.length) { ringPath(g, s.dark); g.fillStyle = shade(R0.col, 0.86); g.fill('evenodd'); } }
  gl.lineJoin = 'round'; gl.lineCap = 'round';
  for (const id in Sh) { const R0 = REG[id], s = Sh[id]; if (!R0 || !R0.ow) continue;
    ringPath(gl, s.rings); gl.strokeStyle = R0.lc || K.ink; gl.lineWidth = R0.ow; gl.stroke(); }
  g.restore(); gl.restore();
}
// keep only what lies inside the given head regions (so a pole or a hand in front of a face hides it, like in 3D)
function maskTo(C, Sh, heads) {
  const rings = []; for (const id in Sh) { const R0 = REG[id]; if (R0 && heads.includes(R0.head)) rings.push(...Sh[id].rings); }
  if (!rings.length) { [C.k, C.f, C.l].forEach(clear); return; }
  for (const L of [C.k, C.f, C.l]) { const g = L.g; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'destination-in'; ringPath(g, rings); g.fillStyle = '#000'; g.fill('evenodd'); g.restore(); }
}
const proj = v => { const q = v.clone().project(cam); return [(q.x * 0.5 + 0.5) * W, (-q.y * 0.5 + 0.5) * H]; };
// our 2D face on a 3D head: face coords (u right, v down, head radius 50) → a point on the head sphere → screen
function faceOn(C, c, o, sd) {
  for (let p = c.head; p; p = p.parent) if (!p.visible) return;
  const hd = c.head; hd.updateWorldMatrix(true, false); const mw = hd.matrixWorld, r = c.r;
  const ctr = V(0, 0, 0).applyMatrix4(mw), fwd = V(0, 0, 1).transformDirection(mw);
  if (fwd.dot(cam.position.clone().sub(ctr).normalize()) < 0.08) return;
  const tp = pts => pts.map(([u, v]) => { const x = u / 50 * r * 0.95, y = -v / 50 * r * 0.95, z = Math.sqrt(Math.max(0, r * r - x * x - y * y)); return proj(V(x, y, z).applyMatrix4(mw)); });
  const a = tp([[0, 0]])[0], b = tp([[0, 40]])[0], px = Math.hypot(b[0] - a[0], b[1] - a[1]) / 40;
  if (px < 0.12) return;
  WMUL.k = clamp(px, 0.25, 3);
  face(C, tp, { exp: o.exp, look: o.look || [0, 0], skinC: o.skin, fem: o.fem, iris: o.iris, t: o.t, tears: o.tears, sweat: 0, blush: o.blush, browCol: o.brow }, sd);
  if (o.old) for (const sg of [-1, 1]) { line(C.l, tp([[sg * 33, -6], [sg * 39, -9]]), { w: 2.5, col: '#9a6a52', seed: sd + 90 + sg }); line(C.l, tp([[sg * 33, 2], [sg * 39, 4]]), { w: 2.5, col: '#9a6a52', seed: sd + 92 + sg }); line(C.l, tp(smooth([[sg * 10, 18], [sg * 15, 26], [sg * 14, 33]], 4, false)), { w: 2.5, col: '#9a6a52', seed: sd + 94 + sg }); }
  if (o.glasses) { for (const sg of [-1, 1]) line(C.l, tp(handCircle(sg * 20, -2, 16, sd + 70 + sg, 0.06, 26)), { w: 3.5, col: '#6b5a4a', seed: sd + 72 + sg }); line(C.l, tp([[-4, -4], [4, -4]]), { w: 3, col: '#6b5a4a', seed: sd + 74 }); }
  WMUL.k = 1;
}
function glows(Sh) {
  const g = GLOW.g; g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  for (const id in Sh) { const R0 = REG[id]; if (!R0 || !R0.glow) continue; const b = Sh[id].box, s = Sh[id];
    for (const ring of s.rings) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of ring) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rr = Math.max(30, Math.hypot(x1 - x0, y1 - y0) * 0.6);
      const gr = g.createRadialGradient(cx, cy, 0, cx, cy, rr); gr.addColorStop(0, R0.col === C3.tlight ? 'rgba(255,214,130,0.38)' : 'rgba(255,253,235,0.22)'); gr.addColorStop(1, 'rgba(255,253,235,0)');
      g.fillStyle = gr; g.fillRect(cx - rr, cy - rr, 2 * rr, 2 * rr); } }
  g.restore();
}

// ——— shots (camera position + look-at, eased) ———
// [t0, t1, from, to, lookFrom, lookTo, fov, pose]
const SHOTS = [
  [0, 2, [0.3, 1.5, 12.4], [0.3, 1.5, 12.4], [-0.35, 0.95, -4], [-0.35, 0.95, -4], 52, { ry: 0, rp: 0.45, my: 0 }],
  [2, 7, [0.25, 1.48, 12.2], [-0.05, 1.3, 2.2], [-0.4, 0.95, -6], [-1.0, 1.05, MAA_Z], 50, { ry: 0, rp: 0.45, my: 0 }],
  [7, 11, [0.5, 1.1, 2.55], [0.42, 1.11, 2.35], [SEAT_X + 0.16, 0.98, MAA_Z + 0.08], [SEAT_X + 0.16, 1.0, MAA_Z + 0.08], 40, { ry: 0, my: 0, mp: 0.05 }],
  [11, 15, [0.15, 1.24, 3.05], [0.1, 1.24, 3.1], [SEAT_X, 1.2, ROH_Z], [SEAT_X, 1.22, ROH_Z], 40, { ry: 0.35, rp: 0, my: 0 }],
  [15, 19, [-0.98, 1.27, ROH_Z], [-0.98, 1.27, ROH_Z], [CW, 1.22, 3.0], [CW, 1.22, 3.0], 60, { ry: 0, rp: 0, my: 0, pov: 1 }],
];
export const DUR = 19;
export const SUBS = [];
export const EV = [];
export const TEXTS = () => [];
function shotAt(t) { return SHOTS.find(s => t >= s[0] && t < s[1]) || SHOTS[SHOTS.length - 1]; }

let ready = false;
export function frame(comp, t) {
  if (!ready) { build(); ready = true; }
  const S = shotAt(t), e = eio(clamp((t - S[0]) / (S[1] - S[0])));
  const P = S[7] || {};
  poseCast(t, P);
  cam.fov = S[6]; cam.updateProjectionMatrix();
  cam.position.set(...S[2].map((v, i) => lerp(v, S[3][i], e)));
  cam.lookAt(V(...S[4].map((v, i) => lerp(v, S[5][i], e))));
  scene.updateMatrixWorld(true);
  const Sh = shapes(snap(N, scene, cam), { minArea: 14 });
  [SC, FACE, FACER].forEach(clearGroup); [GLOW, FX, SUBK, SUBT].forEach(clear);
  drawRegions(Sh); glows(Sh);
  faceOn(FACE, ROH, { exp: { eyes: 'half', brows: 'flat', mouth: 'flat' }, look: [0, 0.6], skin: C3.rSkin, iris: '#3a2414', brow: '#1f1714', t }, 300);
  faceOn(FACE, MAA, { exp: { eyes: 'open', brows: 'sad', mouth: 'flat' }, look: [0, 0], skin: C3.mSkin, fem: 1, iris: '#2a1c14', brow: '#b5b0a8', old: 1, glasses: 1, t }, 500);
  maskTo(FACE, Sh, ['rohan', 'maa']);
  faceOn(FACER, ROH_R, { exp: { eyes: 'half', brows: 'flat', mouth: 'flat' }, look: [0, 0], skin: C3.rSkin, iris: '#3a2414', brow: '#1f1714', t }, 700);
  maskTo(FACER, Sh, ['rohanR']);
  for (const L of [FACER.f, FACER.l]) { const g = L.g; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(13,18,34,0.58)'; g.fillRect(0, 0, W, H); g.restore(); }
  { const g = FX.g; g.save(); g.fillStyle = 'rgba(10,16,40,0.10)'; g.fillRect(0, 0, W, H); g.restore(); }   // night grade
  comp.paperCam(CAM.x * 0.6, CAM.y * 0.6, CAM.s / 0.6); comp.clean = true; comp.begin(PAPER);
  comp.group(SC); comp.group(FACER); comp.crayon(GLOW.c); comp.group(FACE); comp.crayon(FX.c); comp.knock(SUBK.c); comp.crayon(SUBT.c);
  comp.finish({ vig: 0.42, emb: 0, bright: 1, lamp: [0.5, 0.5, 1, 0] });
}
export function testFrame(comp, t) { frame(comp, t); }
