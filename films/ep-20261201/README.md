# Ep 14 · आख़िरी मेट्रो (भाग 1) — FIRST 3D EPISODE (look test, 28 Nov)
Our flat look, 3D world. Pipeline:
1. three.js builds the set + cast (body.js: coach(), rohan(), maa()).
2. npr3.js renders an invisible 540x960 region-id image and traces every region into outline rings (from styles/crayon-world/demo/engine/npr.js, only RW/RH changed to vertical).
3. drawRegions() fills each ring with the region colour + clean ink outline + a darker fill on the shadow side (crayon.js with STYLE.clean = true, the SAME flat style as Ep 1–13; NO crayon strokes, NO paper tooth).
4. Faces = our 2D face() (face.part.js, copied from ep-20261130) mapped onto the 3D head sphere (faceOn) and masked to the visible head region.
5. Reflection in the night glass (x = +CW): a mirrored copy of the coach + Rohan behind the wall, faint colours (RR regions). Maa is NOT in it.
Build film.js: `sh build.sh` (cat head.js face.part.js body.js > film.js). Render stills as usual (core/render/still.mjs).
Speed: ~1 s per frame at 1080x1920 on software GL.
