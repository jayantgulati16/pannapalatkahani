// आख़िरी मेट्रो (भाग 1) — Ep 14, 1 Dec 2026 (Jayant's story, 28 Nov). Vertical 1080×1920, 24 fps.
// FIRST 3D EPISODE: the set and the characters are real 3D models (three.js); every frame the 3D render is traced into
// region outlines (npr3.js) and DRAWN IN OUR FLAT STYLE (solid fill + clean ink line + a darker fill on the shadow side).
// No crayon strokes, no paper tooth: crayon.js runs with STYLE.clean = true, exactly like Ep 1–13.
// Faces are drawn in 2D (our face()) mapped onto the 3D head, so the cast keeps the look of our flat episodes.
// (film.js is built from head.js + face.part.js + body.js: `sh build.sh`)
import * as THREE from 'three';
import { layer, clear, line, fill, dab, handCircle, smooth, CAM, BOIL, WMUL, STYLE, W, H } from './crayon.js';
import { group, clearGroup, part, tube } from './rig.js';
import { makeNPR, snap, shapes, region, mesh, REG, RW, RH } from './npr3.js';
import { clamp, lerp, hash, ss, eio, eo, ei } from '/core/lib.js';
STYLE.clean = true;
CAM.x = W / 2; CAM.y = H / 2; CAM.s = 1;   // 2D world = screen pixels
const Q = new URLSearchParams(location.search);
const NOSUBS = Q.get('nosubs') === '1';
const K = { ink: '#1d1b22', white: '#ffffff', skin: '#e2ab88', skinM: '#d9a27f', skinO: '#c98d68', water: '#9fd0f0', red: '#e2412f' };
const PAPER = [0.965, 0.955, 0.93];
