
// ═══════════════════════ 3D world → our flat drawing ═══════════════════════
const C3 = { wall: '#c9cdca', ceil: '#d8d9d3', floor: '#484c57', seat: '#97a3b1', seatB: '#6a7483', steel: '#c4cad2', door: '#b8bec6',
  seam: '#e8a92a', dwin: '#151b2d', glass: '#a7c0ca', tunnel: '#0d1222', tlight: '#ffd98a', lamp: '#fffdf0', rubber: '#2c2e35',
  ad1: '#d9c7a0', ad2: '#9cc2b3', map: '#2d4f86',
  shirt: '#a7c7e8', trou: '#383d4c', shoe: '#2a2522', bag: '#2f323d', rHair: '#1f1714', rSkin: '#d9a27f', phone: '#22242c',
  saree: '#f2efe7', pallu: '#ebe7dd', mSkin: '#cf9a76', mHair: '#c4c0ba', chappal: '#6b4a32',
  pfloor: '#8a877f', pwall: '#cbbfa8', pceil: '#5d616b', pillar: '#9aa0a8', sign: '#1d3c78' };
const hex = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; };
const rgb = ([r, g, b]) => `rgb(${r | 0},${g | 0},${b | 0})`;
const shade = (h, k) => rgb(hex(h).map(v => v * k));
const mixC = (a, b, u) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, '0')).join(''); };
const pr = (t, a, b) => clamp((t - a) / (b - a));
const back1 = u => { u = clamp(u) - 1; return 1 + u * u * (2.8 * u + 1.8); };

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
reg('rSkin', C3.rSkin, { ow: 4 }); reg('rHead', C3.rSkin, { ow: 4.5, head: 'rohan', shade: 0 }); reg('rHair', C3.rHair, { ow: 4 }); reg('phone', C3.phone, { ow: 3, shade: 0 });
reg('saree', C3.saree, { ow: 4 }); reg('pallu', C3.pallu, { ow: 4 });
reg('mSkin', C3.mSkin, { ow: 4 }); reg('mHead', C3.mSkin, { ow: 4.5, head: 'maa', shade: 0 }); reg('mHair', C3.mHair, { ow: 3.5 });
reg('chappal', C3.chappal, { ow: 3 }); reg('tiffin', '#c9ced6', { ow: 3.5 });
reg('pfloor', C3.pfloor, { shade: 0 }); reg('pwall', C3.pwall); reg('pceil', C3.pceil, { shade: 0 }); reg('pillar', C3.pillar); reg('sign', C3.sign, { ow: 4, shade: 0 });

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

// ——— the coach: walls with windows, longitudinal steel benches, glass partitions, poles, rails, handles, sliding doors, lamps ———
const CW = 1.42, CL = 13, DOORS = [-6.5, 0, 6.5], SEGS = [[-12.3, -7.4], [-5.6, -0.9], [0.9, 5.6], [7.4, 12.3]];
function bay(g, s, a, b) {   // one wall stretch between doors: below/above the windows, pillars, ad panels
  const xi = s * CW, xo = s * (CW + 0.06);
  boxm(g, 'wall', xi, 0, a, xo, 0.95, b); boxm(g, 'wall', xi, 1.75, a, xo, 2.3, b);
  const n = Math.max(1, Math.round((b - a) / 1.4)), wwid = (b - a) / n;
  for (let i = 0; i <= n; i++) { const zc = a + i * wwid; boxm(g, 'wall', xi, 0.95, Math.max(a, zc - 0.13), xo, 1.75, Math.min(b, zc + 0.13)); }
  for (let i = 0; i < n; i++) boxm(g, i % 2 ? 'ad1' : 'ad2', xi - s * 0.01, 1.84, a + i * wwid + 0.25, xi, 2.14, a + (i + 1) * wwid - 0.25);
}
function coach(p, z0 = 0) {
  const g = G(p, 0, 0, z0); g.userData.doors = [];
  boxm(g, 'floor', -CW, -0.05, -CL, CW, 0, CL); boxm(g, 'ceil', -CW, 2.3, -CL, CW, 2.36, CL);
  for (const x of [-0.7, 0.7]) for (const [a, b] of SEGS) boxm(g, 'lamp', x - 0.08, 2.27, a, x + 0.08, 2.3, b);
  for (const s of [-1, 1]) {
    const xi = s * CW, xo = s * (CW + 0.06);
    let zs = -CL;
    for (const dz of DOORS) {
      bay(g, s, zs, dz - 0.65);
      // the door: two sliding leaves, each with a dark window and half of the yellow seam
      const leaves = [];
      for (const h of [-1, 1]) {
        const L = G(g, 0, 0, 0); L.userData.s = s;
        boxm(L, 'door', xi, 0, dz + (h < 0 ? -0.65 : 0), xo, 2.02, dz + (h < 0 ? 0 : 0.65));
        boxm(L, 'dwin', xi - s * 0.012, 1.0, dz + h * 0.1, xi, 1.72, dz + h * 0.5);
        boxm(L, 'seam', xi - s * 0.014, 0, dz + (h < 0 ? -0.025 : 0), xi, 2.02, dz + (h < 0 ? 0 : 0.025));
        L.userData.h = h; leaves.push(L);
      }
      g.userData.doors.push({ s, dz, leaves });
      boxm(g, 'wall', xi, 2.02, dz - 0.65, xo, 2.3, dz + 0.65);
      boxm(g, 'map', xi - s * 0.012, 2.06, dz - 0.6, xi, 2.24, dz + 0.6);
      zs = dz + 0.65;
    }
    bay(g, s, zs, CL);
    for (const [a, b] of SEGS) {
      boxm(g, 'seatB', xi - s * 0.46, 0, a, xi, 0.4, b); boxm(g, 'seat', xi - s * 0.48, 0.4, a, xi, 0.46, b);
      const bk = boxm(g, 'seat', xi - s * 0.08, 0.46, a, xi, 0.9, b); bk.rotation.z = s * 0.08;
      for (const ze of [a, b]) { boxm(g, 'glass', xi - s * 0.56, 0.12, ze - 0.015, xi, 1.55, ze + 0.015); cylm(g, 'steel', xi - s * 0.56, 1.15, ze, 0.022, 0.022, 2.3, 12); }
      for (let z = a + 0.3; z < b - 0.2; z += 0.55) { const hd = add(M(new THREE.TorusGeometry(0.045, 0.009, 8, 18), 'steel'), s * 0.62, 1.8, z, g); hd.rotation.y = Math.PI / 2; boxm(g, 'steel', s * 0.62 - 0.008, 1.84, z - 0.008, s * 0.62 + 0.008, 1.98, z + 0.008); }
    }
    cylm(g, 'steel', s * 0.62, 1.98, 0, 0.016, 0.016, 2 * CL - 0.2, 10).rotation.x = Math.PI / 2;
  }
  for (const e of [-1, 1]) {   // end walls with the open gangway to the next coach
    const z = e * CL;
    boxm(g, 'wall', -CW, 0, z, -0.5, 2.3, z + e * 0.06); boxm(g, 'wall', 0.5, 0, z, CW, 2.3, z + e * 0.06); boxm(g, 'wall', -0.5, 1.95, z, 0.5, 2.3, z + e * 0.06);
    boxm(g, 'rubber', -0.62, 0, z + e * 0.06, -0.5, 2.0, z + e * 0.5); boxm(g, 'rubber', 0.5, 0, z + e * 0.06, 0.62, 2.0, z + e * 0.5); boxm(g, 'rubber', -0.62, 1.95, z + e * 0.06, 0.62, 2.05, z + e * 0.5);
    boxm(g, 'floor', -0.5, -0.05, z, 0.5, 0, z + e * 0.5);
  }
  return g;
}
// the empty platform outside the right-hand doors (only while the train stands at the station)
function platform(p) {
  const g = G(p), x0 = CW + 0.06, x1 = CW + 5.5;
  boxm(g, 'pfloor', x0, -0.05, -30, x1, 0, 30); boxm(g, 'seam', x0 + 0.35, 0, -30, x0 + 0.5, 0.006, 30);
  boxm(g, 'pwall', x1, 0, -30, x1 + 0.1, 4, 30); boxm(g, 'pceil', x0, 3.5, -30, x1, 3.6, 30);
  for (let z = -27; z <= 27; z += 4.5) boxm(g, 'lamp', x0 + 2.2, 3.44, z - 1, x0 + 2.4, 3.5, z + 1);
  for (let z = -24; z <= 24; z += 6) cylm(g, 'pillar', x0 + 3.2, 1.75, z + 3, 0.28, 0.28, 3.5, 20);
  boxm(g, 'sign', x1 - 0.04, 2.0, -2.2, x1, 2.75, 2.2);
  for (const z of [-9, 8]) { boxm(g, 'seatB', x1 - 0.5, 0, z - 1, x1, 0.42, z + 1); boxm(g, 'seat', x1 - 0.52, 0.42, z - 1, x1, 0.47, z + 1); }
  g.userData.sign = [V(x1 - 0.05, 2.375, 0), V(x1 - 0.05, 2.75, 0)];
  return g;
}

// ——— the cast (3D bodies; faces are drawn in 2D on the head) ———
// Rohan (28, office): light-blue shirt, sleeves rolled, dark trousers, laptop bag. Seated: local +z = where he faces.
// o.phone = holding the phone up (the call), else hands on his lap
function rohan(p, o = {}) {
  const g = G(p);
  for (const s of [-1, 1]) { limb(g, 'trou', V(s * 0.09, 0.5, 0), V(s * 0.1, 0.5, 0.4), 0.074); limb(g, 'trou', V(s * 0.1, 0.5, 0.4), V(s * 0.11, 0.09, 0.44), 0.062); ball(g, 'shoe', s * 0.11, 0.045, 0.5, 0.068, 0.9, 0.6, 1.6); }
  ball(g, 'trou', 0, 0.53, -0.02, 0.17, 1.05, 0.6, 0.85);
  const tor = limb(g, 'shirt', V(0, 0.62, -0.03), V(0, 0.96, -0.01), 0.15); tor.scale.set(1.2, 1, 0.82);
  limb(g, 'rSkin', V(0, 1.0, 0), V(0, 1.12, 0.01), 0.045); ball(g, 'shirt', 0, 1.045, 0, 0.1, 1.5, 0.45, 1.15);
  const hd = G(g, 0, 1.25, 0.02);
  ball(hd, 'rHead', 0, 0, 0, 0.13); for (const s of [-1, 1]) ball(hd, 'rHead', s * 0.127, -0.005, -0.005, 0.028, 0.55, 1, 1);
  const hair = add(M(new THREE.SphereGeometry(0.139, 26, 18, 0, Math.PI * 2, 0, Math.PI * 0.5), 'rHair'), 0, 0.01, -0.012, hd); hair.rotation.x = -0.55;
  ball(hd, 'rHair', 0.025, 0.095, 0.06, 0.075, 1.45, 0.5, 0.95);
  const ph = o.phone;
  for (const s of [-1, 1]) {
    const sh = V(s * 0.2, 0.93, -0.01);
    const el = ph && s > 0 ? V(0.22, 0.72, 0.16) : V(s * 0.24, 0.7, 0.08), hn = ph && s > 0 ? V(0.05, 0.8, 0.32) : V(s * 0.13, 0.6, 0.3);
    limb(g, 'shirt', sh, el, 0.056); const mid = el.clone().lerp(hn, 0.3); limb(g, 'shirt', el, mid, 0.05); limb(g, 'rSkin', mid, hn, 0.04);
    hand3(g, 'rSkin', hn, hn.clone().sub(el), V(0, 1, 0), -s, ph && s > 0 ? 'grip' : 'open');
  }
  let phone = null;
  if (ph) { phone = G(g, 0.02, 0.88, 0.33); phone.rotation.x = -2.24; boxm(phone, 'phone', -0.036, -0.075, -0.005, 0.036, 0.075, 0.005); }
  boxm(g, 'bag', -0.52, 0.46, -0.14, -0.28, 0.76, 0.1);
  return { g, head: hd, r: 0.13, phone };
}
// Maa (the old woman): white saree, the pallu over her head, grey hair, round glasses, the steel tiffin on her lap / at her chest
function maa(p, o = {}) {
  const g = G(p), st = !!o.stand, dy = st ? 0.3 : 0;
  if (st) { const sk = cylm(g, 'saree', 0, 0.47, 0, 0.17, 0.25, 0.94, 26); sk.scale.set(1, 1, 0.85); for (const s of [-1, 1]) ball(g, 'chappal', s * 0.08, 0.025, 0.12, 0.05, 0.9, 0.45, 1.6); }
  else {
    ball(g, 'saree', 0, 0.52, 0.12, 0.2, 1, 0.48, 1.45);
    const sk = cylm(g, 'saree', 0, 0.25, 0.33, 0.16, 0.2, 0.46, 22); sk.scale.set(1.15, 1, 0.55);
    for (const s of [-1, 1]) ball(g, 'chappal', s * 0.08, 0.025, 0.42, 0.05, 0.9, 0.45, 1.6);
  }
  const tor = limb(g, 'saree', V(0, 0.6 + dy, -0.02), V(0, 0.88 + dy, 0), 0.14); tor.scale.set(1.15, 1, 0.85);
  limb(g, 'mSkin', V(0, 0.93 + dy, 0), V(0, 1.04 + dy, 0.01), 0.04);
  const hd = G(g, 0, 1.15 + dy, 0.03);
  ball(hd, 'mHead', 0, 0, 0, 0.12);
  add(M(new THREE.SphereGeometry(0.124, 26, 18, 0, Math.PI * 2, 0, Math.PI * 0.42), 'mHair'), 0, 0.006, -0.004, hd).rotation.x = -0.12;
  add(M(new THREE.SphereGeometry(0.146, 30, 20, Math.PI * 0.78, Math.PI * 1.44, 0, Math.PI * 0.74), 'pallu', 1), 0, 0.004, -0.02, hd);
  for (const s of [-1, 1]) limb(g, 'pallu', V(s * 0.115, 1.12 + dy, 0.0), V(s * 0.17, 0.84 + dy, -0.01), 0.05);
  add(M(new THREE.CylinderGeometry(0.13, 0.26, 0.36, 28, 1, true, Math.PI * 0.36, Math.PI * 1.28), 'pallu', 1), 0, 0.9 + dy, -0.03, g);
  const tz = st ? 0.2 : 0.25, ty = st ? 0.78 : 0.62;
  for (const s of [-1, 1]) {
    const sh = V(s * 0.17, 0.88 + dy, 0), el = V(s * 0.2, (st ? 0.74 : 0.67), 0.1), hn = V(s * 0.085, ty + 0.05, tz);
    limb(g, 'saree', sh, el, 0.05); limb(g, 'mSkin', el, hn, 0.036);
    hand3(g, 'mSkin', hn, hn.clone().sub(el), V(0, 1, 0), s, 'grip', 0.9);
  }
  const tf = G(g, 0, ty, tz);   // the 3-tier steel tiffin
  for (let i = 0; i < 3; i++) cylm(tf, 'tiffin', 0, 0.05 + i * 0.066, 0, 0.068, 0.068, 0.06, 28);
  cylm(tf, 'tiffin', 0, 0.25, 0, 0.03, 0.06, 0.03, 20);
  add(M(new THREE.TorusGeometry(0.06, 0.007, 8, 22, Math.PI), 'tiffin'), 0, 0.27, 0, tf);
  return { g, head: hd, r: 0.12, tiffin: tf };
}

// ——— build the world ———
let N, scene, cam, MIR, PLAT, COACH1, TL = [];
let ROH_P, ROH_L, ROHR_P, ROHR_L, MAA1, MAA2, MAAS;
const ROH_Z = 3.6, MAA_Z = 1.25, SEAT_X = -CW + 0.27, Z2 = -2 * CL - 1, MAA2_Z = Z2 + 12.0, MAAS_Z = -13.72;
const seated = (p, x, z) => { const g = G(p, x, 0, z); g.rotation.y = Math.PI / 2; return g; };
function build() {
  scene = new THREE.Scene();
  MAP = R;
  add(M(new THREE.BoxGeometry(16, 7, 160), 'tunnel', 0), 0, 1.2, -20, scene).material.side = THREE.BackSide;
  for (let i = 0; i < 26; i++) for (const s of [-1, 1]) { const m = boxm(scene, 'tlight', 0, 0, 0, 0.12, 0.08, 0.6); m.userData.s = s; m.userData.i = i; TL.push(m); }
  COACH1 = coach(scene, 0); coach(scene, Z2);
  PLAT = platform(scene);
  ROH_P = rohan(seated(scene, SEAT_X, ROH_Z), { phone: 1 }); ROH_L = rohan(seated(scene, SEAT_X, ROH_Z));
  MAA1 = maa(seated(scene, SEAT_X, MAA_Z));
  MAA2 = maa(seated(scene, SEAT_X, MAA2_Z));   // the next coach: the same corner seat, the same woman
  { const g = G(scene, -0.04, 0, MAAS_Z); g.rotation.y = Math.PI; MAAS = maa(g, { stand: 1 }); }   // right behind him, standing, facing -z
  // the night glass on the right-hand wall (x = +CW) reflects the coach: a mirrored copy behind it, faint. MAA IS NOT IN IT.
  MAP = RR;
  MIR = G(scene, 2 * CW + 0.08, 0, 0); MIR.scale.x = -1;
  coach(MIR, 0);
  ROHR_P = rohan(seated(MIR, SEAT_X, ROH_Z), { phone: 1 }); ROHR_L = rohan(seated(MIR, SEAT_X, ROH_Z));
  MAP = R;
  cam = new THREE.PerspectiveCamera(52, RW / RH, 0.03, 200);
  N = makeNPR();
}

// ═══════════════════════ आख़िरी मेट्रो — भाग 1: timeline ═══════════════════════
// N narrator (Sulafat) · R Rohan (Enceladus, tired young man) · M Maa (Gacrux, old woman, soft and strange)
export const SUBS = [
  { t0: 0.25, t1: 5.1, text: 'रात के ग्यारह बजकर पचपन मिनट… आख़िरी मेट्रो।', scr: 'रात 11:55… आख़िरी मेट्रो।', who: 'N', vo: 'n1', vt: 0.3 },
  { t0: 5.3, t1: 9.3, text: 'रोहन ऑफ़िस से थककर लौट रहा था… तभी माँ का फ़ोन आया।', scr: 'रोहन ऑफ़िस से थका-हारा…|तभी माँ का फ़ोन आया।', who: 'N', vo: 'n2', vt: 5.35 },
  { t0: 9.4, t1: 11.4, text: 'माँ… बाद में बात करता हूँ।', who: 'R', vo: 'r1', vt: 9.45 },
  { t0: 11.6, t1: 17.5, text: 'कोने में एक बूढ़ी अम्मा बैठी थीं… हाथ में पुराना टिफ़िन… नज़रें खिड़की के बाहर अँधेरे पर।', scr: 'कोने में एक बूढ़ी अम्मा…|हाथ में पुराना टिफ़िन।', who: 'N', vo: 'n3', vt: 11.65 },
  { t0: 19.5, t1: 23.4, text: 'स्टेशन आया… दरवाज़े खुले… पर कोई नहीं चढ़ा।', scr: 'स्टेशन आया… दरवाज़े खुले…|पर कोई नहीं चढ़ा।', who: 'N', vo: 'n4', vt: 19.55 },
  { t0: 24.7, t1: 27.3, text: 'रोहन ने अम्मा की नज़र का पीछा किया…', who: 'N', vo: 'n5', vt: 24.75 },
  { t0: 27.6, t1: 30.2, text: 'शीशे में वो ख़ुद दिख रहा था…', who: 'N', vo: 'n6', vt: 27.65 },
  { t0: 30.6, t1: 33.9, text: 'पर अम्मा की सीट… ख़ाली थी।', who: 'N', vo: 'n7', vt: 30.65 },
  { t0: 39.8, t1: 43.4, text: 'रोहन बैग छोड़कर अगले डिब्बे की तरफ़ भागा…', scr: 'रोहन अगले डिब्बे की तरफ़ भागा…', who: 'N', vo: 'n8', vt: 39.85 },
  { t0: 46.0, t1: 49.5, text: 'वही कोना। वही सीट। वही टिफ़िन।', who: 'N', vo: 'n9', vt: 46.05 },
  { t0: 51.9, t1: 57.3, text: 'बेटा… मेरा स्टेशन आ गया… पर मैं उतर नहीं सकती।', scr: 'बेटा… मेरा स्टेशन आ गया…|पर मैं उतर नहीं सकती।', who: 'M', vo: 'm1', vt: 51.95 },
  { t0: 58.6, t1: 64.0, text: 'भाग 2 देखने के लिए… फ़ॉलो और सब्सक्राइब करो!', scr: '', who: 'N', vo: 'n10', vt: 58.65 },
];
export const DUR = 64.0;
const T_RING = 7.4, T_CUT = 11.2, T_STA0 = 17.6, T_OPEN = 18.4, T_CLOSE = 23.3, T_STA1 = 24.6, T_EMPTY = 30.4, T_TURN2 = 38.4, T_SEE2 = 45.5, T_BEHIND = 51.0, T_BLACK = 57.4, END = 58.4;
const talk = (t, ids) => SUBS.some(S => ids.includes(S.vo) && t > S.vt && t < S.t1 - 0.3) && BOIL.step % 3 !== 0;

// camera: either a look-at target (lk) or a yaw/pitch (POV). yaw 0 looks -z, +π/2 looks +x.
// [t0, t1, pos0, pos1, lookOrYaw0, lookOrYaw1, fov, ease]
const LOOK = (a, b) => ({ lk: [a, b] }), YAW = (y0, y1, p0 = 0, p1 = p0) => ({ yaw: [y0, y1], pit: [p0, p1] });
const SH = [
  { t: [0, 5.2], p: [[0.25, 1.48, 12.2], [-0.05, 1.3, 2.4]], ...LOOK([-0.4, 0.95, -6], [-1.0, 1.05, MAA_Z]), fov: 50, set: 'A' },
  { t: [5.2, 11.4], p: [[0.2, 1.22, 3.0], [0.14, 1.2, 3.15]], ...LOOK([SEAT_X, 1.08, ROH_Z + 0.05], [SEAT_X, 1.1, ROH_Z + 0.05]), fov: 42, set: 'B' },
  { t: [11.4, 17.6], p: [[0.6, 1.1, 2.6], [0.42, 1.11, 2.3]], ...LOOK([SEAT_X + 0.16, 0.98, MAA_Z + 0.08], [SEAT_X + 0.16, 1.0, MAA_Z + 0.08]), fov: 40, set: 'C' },
  { t: [T_STA0, T_STA1], p: [[-0.8, 1.46, 2.0], [-0.72, 1.44, 1.85]], ...LOOK([CW, 1.0, -0.05], [CW, 1.0, 0]), fov: 58, set: 'D' },
  { t: [T_STA1, 27.4], p: [[0.15, 1.24, 3.05], [0.1, 1.24, 3.15]], ...LOOK([SEAT_X, 1.2, ROH_Z], [SEAT_X, 1.22, ROH_Z]), fov: 40, set: 'E1' },
  { t: [27.4, 34.0], p: [[-0.98, 1.27, ROH_Z], [-0.96, 1.26, ROH_Z - 0.02]], ...YAW(1.38, 1.34, -0.03, -0.05), fov: 64, fov1: 54, set: 'E2', pov: 1 },
  { t: [34.0, 36.6], p: [[0.15, 1.22, 3.0], [0.12, 1.22, 3.12]], ...LOOK([SEAT_X, 1.16, ROH_Z], [SEAT_X, 1.17, ROH_Z]), fov: 40, set: 'F1' },
  { t: [36.6, 39.6], p: [[0.5, 1.1, 2.45], [0.4, 1.12, 2.2]], ...LOOK([SEAT_X + 0.16, 1.02, MAA_Z + 0.06], [SEAT_X + 0.14, 1.08, MAA_Z + 0.06]), fov: 34, set: 'F2' },
  { t: [39.6, 45.5], set: 'G1', fov: 62, pov: 1 },
  { t: [T_SEE2, 46.5], p: [[-0.15, 1.58, -14.45], [-0.18, 1.57, -14.5]], ...YAW(-0.55, -1.1, -0.2, -0.38), fov: 58, set: 'G2', pov: 1 },
  { t: [46.5, 49.6], p: [[-0.18, 1.57, -14.5], [-0.22, 1.55, -14.62]], ...YAW(-1.1, -1.13, -0.38, -0.4), fov: 58, fov1: 50, set: 'G2', pov: 1 },
  { t: [49.6, 51.6], p: [[-0.22, 1.55, -14.62], [-0.08, 1.56, -14.42]], ...YAW(-1.13, -Math.PI, -0.4, -0.16), fov: 52, set: 'H1', pov: 1 },
  { t: [51.6, DUR + 1], p: [[-0.08, 1.56, -14.42], [-0.07, 1.53, -14.3]], ...LOOK([-0.04, 1.42, MAAS_Z], [-0.04, 1.43, MAAS_Z]), fov: 50, set: 'H2', pov: 1 },
];
const shotAt = t => SH.find(s => t >= s.t[0] && t < s.t[1]) || SH[SH.length - 1];
// G1: stand up from the seat, turn, run down the aisle, through the gangway into the next coach
function runCam(t) {
  const u = pr(t, 39.6, 40.6), r = pr(t, 40.6, 45.3), run = r > 0 && r < 1 ? 1 : 0;
  const p = u < 1 ? [lerp(-0.98, -0.7, eio(u)), lerp(1.27, 1.6, eio(u)), ROH_Z - 0.1 * u] : [lerp(-0.7, -0.12, eio(pr(r, 0, 0.3))), 1.6 + 0.035 * Math.abs(Math.sin(t * 9)) * run, lerp(ROH_Z - 0.1, -14.45, eio(r))];
  const yaw = u < 1 ? lerp(1.326, 0, eio(u)) : r > 0.92 ? lerp(0, -0.55, eio(pr(r, 0.92, 1))) : 0;
  return { p, yaw, pit: -0.06 + 0.02 * Math.sin(t * 9) * run };
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
const shown = o => { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true; };
// our 2D face on a 3D head: face coords (u right, v down, head radius 50) → a point on the head sphere → screen
function faceOn(C, c, o, sd) {
  if (!shown(c.head)) return;
  const hd = c.head; hd.updateWorldMatrix(true, false); const mw = hd.matrixWorld, r = c.r;
  const ctr = V(0, 0, 0).applyMatrix4(mw), fwd = V(0, 0, 1).transformDirection(mw);
  if (fwd.dot(cam.position.clone().sub(ctr).normalize()) < 0.08) return;
  const tp = pts => pts.map(([u, v]) => { const x = u / 50 * r * 0.95, y = -v / 50 * r * 0.95, z = Math.sqrt(Math.max(0, r * r - x * x - y * y)); return proj(V(x, y, z).applyMatrix4(mw)); });
  const a = tp([[0, 0]])[0], b = tp([[0, 40]])[0], px = Math.hypot(b[0] - a[0], b[1] - a[1]) / 40;
  if (px < 0.12) return;
  WMUL.k = clamp(px, 0.25, 3);
  face(C, tp, { exp: o.exp, look: o.look || [0, 0], skinC: o.skin, fem: o.fem, iris: o.iris, t: o.t, tears: o.tears, blush: o.blush, browCol: o.brow }, sd);
  if (o.old) for (const sg of [-1, 1]) { line(C.l, tp([[sg * 33, -6], [sg * 39, -9]]), { w: 2.5, col: '#9a6a52', seed: sd + 90 + sg }); line(C.l, tp([[sg * 33, 2], [sg * 39, 4]]), { w: 2.5, col: '#9a6a52', seed: sd + 92 + sg }); line(C.l, tp(smooth([[sg * 10, 18], [sg * 15, 26], [sg * 14, 33]], 4, false)), { w: 2.5, col: '#9a6a52', seed: sd + 94 + sg }); }
  if (o.glasses) { for (const sg of [-1, 1]) line(C.l, tp(handCircle(sg * 20, -2, 16, sd + 70 + sg, 0.06, 26)), { w: 3.5, col: '#6b5a4a', seed: sd + 72 + sg }); line(C.l, tp([[-4, -4], [4, -4]]), { w: 3, col: '#6b5a4a', seed: sd + 74 }); }
  if (o.sweat) { const q = tp([[62, -44 + 18 * ((o.t * 1.3) % 1)]])[0]; dab(C.l, q[0], q[1], 7 * px, { col: K.water, p: 1, seed: sd + 96 }); }
  WMUL.k = 1;
}
function glows(Sh, k = 1) {
  const g = GLOW.g; g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  for (const id in Sh) { const R0 = REG[id]; if (!R0 || !R0.glow) continue; const s = Sh[id];
    for (const ring of s.rings) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of ring) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rr = Math.max(30, Math.hypot(x1 - x0, y1 - y0) * 0.6);
      const gr = g.createRadialGradient(cx, cy, 0, cx, cy, rr); gr.addColorStop(0, R0.col === C3.tlight ? `rgba(255,214,130,${0.38 * k})` : `rgba(255,253,235,${0.22 * k})`); gr.addColorStop(1, 'rgba(255,253,235,0)');
      g.fillStyle = gr; g.fillRect(cx - rr, cy - rr, 2 * rr, 2 * rr); } }
  g.restore();
}

// ——— 2D helpers (screen pixels) ———
const rrect = (x0, y0, x1, y1, r) => { const p = []; for (const [cx, cy, a0] of [[x1 - r, y0 + r, -Math.PI / 2], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, Math.PI / 2], [x0 + r, y0 + r, Math.PI]]) for (let i = 0; i <= 6; i++) { const a = a0 + i / 6 * Math.PI / 2; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return p; };
function wtext(L, str, x, y, o = {}) {
  const g = L.g, size = o.size || 40;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.font = `${o.weight || 700} ${size}px Kalam`; g.textBaseline = 'alphabetic';
  const tw = g.measureText(str).width; let cx = o.align === 'left' ? 0 : -tw / 2;
  g.translate(x, y); if (o.rot) g.rotate(o.rot);
  const rv = o.reveal ?? 1; if (rv <= 0) { g.restore(); return tw; }
  if (rv < 1) { g.beginPath(); g.rect(cx - 12, -size * 1.6, (tw + 24) * rv, size * 2.6); g.clip(); }
  g.globalAlpha = o.p ?? 1;
  if (o.outline) { g.lineWidth = o.outline; g.strokeStyle = K.ink; g.lineJoin = 'round'; g.strokeText(str, cx, 0); }
  g.fillStyle = o.col || K.white; g.fillText(str, cx, 0);
  g.restore(); return tw;
}
function box(cx, cy, hw, hh, col = 'rgba(20,19,26,0.93)', L = SUBT) {
  const g = L.g; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = col; g.beginPath();
  for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 2, px = Math.cos(a), py = Math.sin(a), sq = Math.pow(Math.abs(px), 0.3) * Math.sign(px), sqy = Math.pow(Math.abs(py), 0.5) * Math.sign(py), nn = 1 + 0.03 * Math.sin(a * 7 + 1.3) + 0.02 * Math.sin(a * 17); g.lineTo(cx + sq * hw * nn, cy + sqy * hh * nn); }
  g.closePath(); g.fill(); g.restore();
}
function tag(x, y, txt, col = '#ffd76a', size = 40, bg) { const g = SUBT.g; g.save(); g.font = `700 ${size}px Kalam`; const w = g.measureText(txt).width; g.restore(); box(x, y, w / 2 + 22, size * 0.62, bg); wtext(SUBT, txt, x, y + size * 0.36, { size, col }); }
function digits(L, str, x, y, size, col) { const g = L.g; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.font = `700 ${size}px 'DejaVu Sans Mono', monospace`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = col; g.shadowBlur = size * 0.35; g.fillStyle = col; g.fillText(str, x, y); g.restore(); }

const SUBY = 1560;
const SUBCOL = { N: K.white, R: '#bfe0ff', M: '#f6e7c9' };
const WHO = { R: 'रोहन', M: 'अम्मा' };
function subTo(t) {
  const S = SUBS.find(s => t >= s.t0 && t < s.t1); if (!S) return;
  const txt = S.scr ?? S.text; if (!txt) return;
  const lines = txt.split('|'), size0 = 66, lh = size0 * 1.28;
  const g = SUBK.g; g.save(); g.font = `700 ${size0}px Kalam`; const tw = Math.max(...lines.map(l => g.measureText(l).width)); g.restore();
  const sc = tw > 980 ? 980 / tw : 1, size = size0 * sc;
  const g2 = SUBT.g, top = SUBY - 60, bot = SUBY + (lines.length - 1) * lh * sc + 40;
  const grd = g2.createLinearGradient(0, top - 60, 0, bot + 60); grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.3, 'rgba(0,0,0,0.45)'); grd.addColorStop(0.7, 'rgba(0,0,0,0.45)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g2.save(); g2.fillStyle = grd; g2.fillRect(0, top - 60, W, bot - top + 120); g2.restore();
  if (WHO[S.who]) { const nw = 26 + 19 * WHO[S.who].length; box(540, top - 18, nw / 2 + 12, 28, SUBCOL[S.who]); wtext(SUBT, WHO[S.who], 540, top - 6, { size: 36, col: K.ink }); }
  lines.forEach((ln, i) => wtext(SUBT, ln, 540, SUBY + 24 + i * lh * sc, { size, col: SUBCOL[S.who], outline: 9, reveal: pr(t, S.t0 + i * 0.3, S.t0 + i * 0.3 + 0.4) }));
}
export const TEXTS = t => { const S = SUBS.find(s => t >= s.t0 && t < s.t1); const tx = S && (S.scr ?? S.text); if (!tx) return []; const n = tx.split('|').length; return [{ id: 's' + S.t0, text: tx.replace(/\|/g, ' '), x0: 20, y0: SUBY - 110, x1: 1060, y1: SUBY + 60 + (n - 1) * 85 }]; };
function badge(t) { if (t > END) return; box(905, 560, 118, 40, 'rgba(160,30,40,0.92)'); wtext(SUBT, 'भाग 1/2', 905, 576, { size: 46, col: K.white }); }
function clock(t) {   // the time, top-left: it creeps towards midnight
  if (t > END) return;
  const m = t < 40 ? '11:55' : t < T_BEHIND ? '11:56' : '11:57';
  box(190, 560, 140, 52, 'rgba(10,10,16,0.95)'); digits(SUBT, m + ' PM', 190, 562, 50, t > T_BEHIND && BOIL.step % 4 < 2 ? '#ff5a4a' : '#7fe0ff');
}
function title(t) {
  if (t < 2.6 || t > 5.2) return;
  const u = back1(pr(t, 2.6, 2.9)); box(540, 880, 380 * u + 1, 100 * u + 1, 'rgba(8,8,14,0.95)');
  wtext(SUBT, 'आख़िरी मेट्रो', 540, 915, { size: 110 * u + 1, col: '#f6e7c9' });
  const w = back1(pr(t, 3.1, 3.4)); box(540, 1040, 120 * w + 1, 44 * w + 1, 'rgba(160,30,40,0.95)');
  wtext(SUBT, 'भाग 1', 540, 1062, { size: 58 * w + 1, col: K.white });
}
function endCard(t) {
  if (t < END) return;
  const g = SUBT.g; g.save(); g.fillStyle = 'rgba(8,8,14,0.95)'; g.fillRect(0, 1180, W, 740); g.restore();
  wtext(SUBT, 'अम्मा उतर क्यों नहीं सकती?', 540, 1290, { size: 66, col: '#f6e7c9', reveal: pr(t, END + 0.05, END + 0.45) });
  wtext(SUBT, 'अंदाज़ा कमेंट करो 👇', 540, 1390, { size: 60, col: '#ffd36a', reveal: pr(t, END + 0.45, END + 0.85) });
  const u = back1(pr(t, END + 0.9, END + 1.2)); box(540, 1520, 360 * u + 1, 56 * u + 1, 'rgba(160,30,40,0.97)');
  wtext(SUBT, 'भाग 2 · कल शाम 7:30', 540, 1544, { size: 62 * u + 1, col: K.white });
  wtext(SUBT, 'Follow & Subscribe करो · @pannapalatkahani', 540, 1650, { size: 44, col: '#ffd36a', reveal: pr(t, END + 1.3, END + 1.8) });
}
function phoneScreen(t, c) {   // the call on Rohan's phone (2D on the 3D phone's face)
  if (!c.phone || !shown(c.phone)) return;
  c.phone.updateWorldMatrix(true, false); const mw = c.phone.matrixWorld;
  const P = (x, y) => proj(V(x, y, 0.0056).applyMatrix4(mw));
  const q = [P(-0.031, -0.068), P(0.031, -0.068), P(0.031, 0.068), P(-0.031, 0.068)];
  const g = FACE.l.g; g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  const ring = t >= T_RING && t < T_CUT, ended = t >= T_CUT;
  g.beginPath(); q.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath();
  g.fillStyle = ring ? '#1e3a2c' : ended ? '#121318' : '#2a3550'; g.fill();
  const cx = (q[0][0] + q[2][0]) / 2, cy = (q[0][1] + q[2][1]) / 2, s = Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]) / 100;
  g.restore();
  if (ring) { wtext(FACE.l, 'माँ ❤️', cx, cy - 18 * s, { size: 30 * s, col: K.white }); wtext(FACE.l, 'calling…', cx, cy + 14 * s, { size: 18 * s, col: '#9fe0b0' }); for (const [dx, col] of [[-26, '#e24a3a'], [26, '#3ac46a']]) { const g2 = FACE.l.g; g2.save(); g2.fillStyle = col; g2.beginPath(); g2.arc(cx + dx * s, cy + 46 * s, 9 * s, 0, 7); g2.fill(); g2.restore(); } }
  else if (ended) wtext(FACE.l, 'Call ended', cx, cy + 6 * s, { size: 16 * s, col: '#8a8f9c', p: 1 - pr(t, T_CUT + 0.8, T_CUT + 1.6) });
  else wtext(FACE.l, '11:55', cx, cy, { size: 22 * s, col: '#cfd8ee' });
}
function signText() {   // the platform's station board
  const [a, b] = PLAT.userData.sign.map(v => proj(v.clone().applyMatrix4(PLAT.matrixWorld))); const h = Math.abs(b[1] - a[1]);
  if (h < 8) return;
  wtext(FACE.l, 'पुरानी चुंगी', a[0], a[1] + h * 0.3, { size: h * 0.85, col: K.white });
}

// ——— pose the world for time t ———
function poseWorld(t, S) {
  const sta = S.set === 'D';
  PLAT.visible = sta; MIR.visible = !sta;
  const v = sta ? 0 : 9 * (1 - pr(t, T_STA0 - 1.2, T_STA0)) + 9 * pr(t, T_STA1, T_STA1 + 1.5) * (t > T_STA1 ? 1 : 0);
  for (const m of TL) { const L = 156; let z = ((m.userData.i * 6 + t * 9) % L + L) % L - 110; m.position.set(m.userData.s * 7.6, 1.6, z); m.visible = !sta; }
  // the doors of the station stop (right-hand side, coach 1)
  const open = t < T_OPEN ? 0 : t < T_OPEN + 0.9 ? eio(pr(t, T_OPEN, T_OPEN + 0.9)) : t < T_CLOSE ? 1 : 1 - eio(pr(t, T_CLOSE, T_CLOSE + 0.9));
  for (const d of COACH1.userData.doors) if (d.s > 0) for (const L of d.leaves) { L.position.z = L.userData.h * 0.62 * open; L.position.x = d.s * 0.08 * Math.min(1, open * 5); }
  // Rohan: the phone version until he puts it away, then hands on the lap
  const ph = t < T_CUT + 0.6;
  ROH_P.g.visible = ph; ROHR_P.g.visible = ph; ROH_L.g.visible = !ph; ROHR_L.g.visible = !ph;
  if (S.pov) { ROH_P.g.visible = ROH_L.g.visible = false; }
  let ry = 0, rp = 0;
  if (t < T_CUT) { rp = 0.42; ry = 0.05; }
  else if (S.set === 'D') { ry = 0; rp = 0.1; }
  else if (S.set === 'E1') { ry = lerp(0.55, 0.0, eio(pr(t, 25.6, 26.6))); rp = 0; }
  else if (S.set === 'F1') { ry = lerp(0.0, 0.85, eio(pr(t, 34.5, 35.8))); rp = 0.02; }
  else { ry = 0; rp = 0; }
  for (const c of [ROH_P, ROH_L, ROHR_P, ROHR_L]) c.head.rotation.set(rp, ry, 0, 'YXZ');
  // Maa (coach 1): stares at the window; in F2 she slowly turns to look at him
  const my = S.set === 'F2' ? lerp(0, -0.75, eio(pr(t, 37.4, 38.6))) : 0;
  MAA1.head.rotation.set(S.set === 'F2' ? -0.04 : 0.02, my, 0, 'YXZ');
  MAA1.g.visible = t < 39.6;
  MAA2.g.visible = t >= 39.6 && t < T_BEHIND - 0.6; MAA2.head.rotation.set(0.02, 0, 0, 'YXZ');
  MAAS.g.visible = t >= T_BEHIND - 0.6;
  MAAS.head.rotation.set(-0.12, 0, 0, 'YXZ');
}
function exps(t, S) {
  const R = { exp: { eyes: 'half', brows: 'flat', mouth: 'flat' }, look: [0, 0.6] };
  if (t >= T_RING && t < T_CUT) R.exp = { eyes: 'open', brows: 'flat', mouth: talk(t, ['r1']) ? 'open' : 'flat' };
  if (t >= T_CUT && t < T_STA0) R.exp = { eyes: 'calm', brows: 'sad', mouth: 'sad' };
  if (S.set === 'D') { R.exp = { eyes: 'half', brows: 'flat', mouth: 'flat' }; R.look = [0.4, 0]; }
  if (S.set === 'E1') { R.exp = { eyes: 'open', brows: 'flat', mouth: 'flat' }; R.look = [0, 0]; }
  if (S.set === 'E2') { R.exp = { eyes: 'open', brows: 'worried', mouth: 'small' }; R.look = [0, 0]; }
  if (S.set === 'F1') { R.exp = { eyes: 'pop', brows: 'up', mouth: 'o' }; R.look = [-0.8, 0]; R.sweat = 1; }
  const Mx = { exp: { eyes: 'open', brows: 'sad', mouth: 'flat' }, look: [0, 0] };
  if (S.set === 'F2' && t > 38.6) Mx.look = [0, 0.1];
  if (S.set === 'H2') Mx.exp = { eyes: t > 55.6 ? 'teary' : 'open', brows: 'sad', mouth: talk(t, ['m1']) ? 'open' : 'flat' };
  return { R, M: Mx };
}
// flicker: the coach lights stutter at the scares (0 = dark, 1 = normal)
function lightAt(t) {
  const fl = (t0, d) => t > t0 && t < t0 + d ? (hash(Math.floor(t * 18) * 1.7 + t0) > 0.45 ? 1 : 0.35) : 1;
  return Math.min(fl(T_EMPTY, 0.7), fl(38.6, 0.5), fl(T_SEE2, 0.5), fl(T_BEHIND, 0.6), fl(55.9, 1.2));
}

let ready = false;
export function frame(comp, t) {
  if (!ready) { build(); ready = true; }
  const S = shotAt(t);
  poseWorld(t, S);
  let pos, look;
  if (S.set === 'G1') { const c = runCam(t); pos = c.p; const d = [Math.sin(c.yaw) * Math.cos(c.pit), Math.sin(c.pit), -Math.cos(c.yaw) * Math.cos(c.pit)]; look = pos.map((v, i) => v + d[i]); }
  else {
    const e = eio(clamp((t - S.t[0]) / (S.t[1] - S.t[0])));
    pos = S.p[0].map((v, i) => lerp(v, S.p[1][i], e));
    if (S.lk) look = S.lk[0].map((v, i) => lerp(v, S.lk[1][i], e));
    else { const yw = lerp(S.yaw[0], S.yaw[1], e), pt = lerp(S.pit[0], S.pit[1], e); const d = [Math.sin(yw) * Math.cos(pt), Math.sin(pt), -Math.cos(yw) * Math.cos(pt)]; look = pos.map((v, i) => v + d[i]); }
  }
  // a small shake on the scares
  const shk = (t0, d, a) => t > t0 && t < t0 + d ? a * (1 - pr(t, t0, t0 + d)) : 0, sa = shk(T_EMPTY, 0.5, 0.012) + shk(T_SEE2, 0.5, 0.015) + shk(T_BEHIND, 0.6, 0.02);
  pos = [pos[0] + sa * Math.sin(t * 61), pos[1] + sa * Math.cos(t * 53), pos[2]];
  cam.fov = S.fov1 ? lerp(S.fov, S.fov1, eio(clamp((t - S.t[0]) / (S.t[1] - S.t[0])))) : S.fov; cam.updateProjectionMatrix();
  cam.position.set(...pos); cam.lookAt(V(...look));
  scene.updateMatrixWorld(true);
  const Sh = shapes(snap(N, scene, cam), { minArea: 14 });
  [SC, FACE, FACER].forEach(clearGroup); [GLOW, FX, SUBK, SUBT].forEach(clear);
  drawRegions(Sh); const li = lightAt(t); glows(Sh, li);
  const X = exps(t, S);
  const rohNow = ROH_P.g.visible ? ROH_P : ROH_L, rohR = ROHR_P.g.visible ? ROHR_P : ROHR_L;
  faceOn(FACE, rohNow, { ...X.R, skin: C3.rSkin, iris: '#3a2414', brow: '#1f1714', t }, 300);
  for (const [c, sd] of [[MAA1, 500], [MAA2, 560], [MAAS, 620]]) faceOn(FACE, c, { ...X.M, skin: C3.mSkin, fem: 1, iris: '#2a1c14', brow: '#b5b0a8', old: 1, glasses: 1, t }, sd);
  maskTo(FACE, Sh, ['rohan', 'maa']);
  phoneScreen(t, rohNow);
  if (PLAT.visible) signText();
  faceOn(FACER, rohR, { exp: X.R.exp, look: [0, 0], skin: C3.rSkin, iris: '#3a2414', brow: '#1f1714', t, sweat: 0 }, 700);
  maskTo(FACER, Sh, ['rohanR']);
  for (const L of [FACER.f, FACER.l]) { const g = L.g; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(13,18,34,0.58)'; g.fillRect(0, 0, W, H); g.restore(); }
  // E2: the empty seat in the glass, circled in red
  if (S.set === 'E2' && t > T_EMPTY + 0.3) {
    const c = proj(V(2 * CW + 0.08 - SEAT_X, 1.02, MAA_Z + 0.1)), u = pr(t, T_EMPTY + 0.3, T_EMPTY + 1.1), pts = [];
    for (let i = 0; i <= 40 * u; i++) { const a = -2.2 + i / 40 * Math.PI * 2.1; pts.push([c[0] + Math.cos(a) * 150, c[1] + Math.sin(a) * 210]); }
    if (pts.length > 1) line(FX, pts, { w: 10, col: '#ff4a3a', seed: 801 });
  }
  { const g = FX.g; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = `rgba(6,10,28,${0.1 + (1 - li) * 0.55})`; g.fillRect(0, 0, W, H);
    const fl = (t0, d, a0) => { if (t > t0 && t < t0 + d) { g.fillStyle = `rgba(255,255,255,${a0 * (1 - pr(t, t0, t0 + d))})`; g.fillRect(0, 0, W, H); } };
    fl(T_BEHIND, 0.25, 0.4);
    if (t >= T_BLACK) { g.fillStyle = `rgba(0,0,0,${t < END ? eio(pr(t, T_BLACK, T_BLACK + 0.25)) : 0.82})`; g.fillRect(0, 0, W, H); }
    g.restore(); }
  badge(t); clock(t);
  if (!NOSUBS) { subTo(t); title(t); }
  endCard(t);
  comp.paperCam(CAM.x * 0.6, CAM.y * 0.6, CAM.s / 0.6); comp.clean = true; comp.begin(PAPER);
  comp.group(SC); comp.group(FACER); comp.crayon(GLOW.c); comp.group(FACE); comp.crayon(FX.c); comp.knock(SUBK.c); comp.crayon(SUBT.c);
  comp.finish({ vig: S.set === 'H2' ? 0.6 : 0.42, emb: 0, bright: 1, lamp: [0.5, 0.5, 1, 0] });
}
export function testFrame(comp, t) { frame(comp, t); }

// ——— events (for the mix) ———
export const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
SUBS.forEach(S => { if (S.vo) ev(S.vt, 'voice', { id: S.vo, who: S.who }); });
ev(0, 'train', { dur: T_STA0 - 0.6 }); ev(T_RING, 'buzz', { dur: T_CUT - T_RING }); ev(T_CUT, 'tap');
ev(T_STA0 - 1.4, 'brake', { dur: 1.6 }); ev(T_STA0 + 0.2, 'chime'); ev(T_OPEN, 'doors'); ev(T_OPEN + 0.9, 'platform', { dur: T_CLOSE - T_OPEN }); ev(T_CLOSE - 0.6, 'beep', { dur: 0.6 }); ev(T_CLOSE, 'doors');
ev(T_STA1, 'train', { dur: T_BLACK - T_STA1 }); ev(T_EMPTY, 'stinger'); ev(T_EMPTY, 'flicker', { dur: 0.7 }); ev(34.0, 'heartbeat', { dur: 5.6 }); ev(38.6, 'stinger'); ev(38.6, 'flicker', { dur: 0.5 });
ev(40.6, 'run', { dur: 4.7 }); ev(44.3, 'gangway'); ev(T_SEE2, 'stinger'); ev(T_SEE2, 'flicker', { dur: 0.5 }); ev(49.6, 'whoosh'); ev(T_BEHIND, 'stinger'); ev(T_BEHIND, 'flicker', { dur: 0.6 }); ev(55.9, 'flicker', { dur: 1.2 });
ev(T_BLACK, 'boom'); ev(END, 'write', { dur: 1.6 });
[['A', 0], ['B', 5.2], ['C', 11.4], ['D', T_STA0], ['E', T_STA1], ['F', T_EMPTY], ['G', 34.0], ['H', 39.6], ['I', T_SEE2], ['J', T_BEHIND], ['K', T_BLACK], ['Z', END]].forEach(([id, t]) => ev(t, 'cue', { id }));
