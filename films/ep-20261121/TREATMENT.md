# 13वाँ फ्लोर (भाग 1) — The 13th Floor, Part 1 (Ep 4, posts 21 Nov 2026 · 2-part mystery, Part 2 posts 22 Nov)

Jayant (20 Nov): "kahani 2 part mein lao, suspense wali, user ko maja aaye, Part 2 ke liye profile visit / follow kare" and
"crayon (jaadu) se bahar niklo". He rejected soft topics; picked the horror hook "Building mein sirf 12 floor… lift 13 pe kyun ruki?".

Look (new): NIGHT PASTEL ON BLACK PAPER — same crayon engine, paper = near-black (PAPER), light is drawn (bulbs, lamp pools via
comp.finish lamp + bright flicker), heavy vignette, ONE spot red = the lift display "13" (and the G). No crayon magic in the plot.
gl.js changes: finish() takes bright + lampCol; knock() uses the current paper.
Characters: Riya (24, blue kurta, jeans, white sneakers, black hair + ponytail, small bindi, earphones, tote bag, teal lanyard with
white office ID card "RIYA"); Amma (stooped, off-white saree, maroon shawl over head, white hair, round glasses that glint white,
3-tier steel tiffin); Watchman (khaki uniform + cap, moustache, chai glass, wooden desk, register).
Sets in one world: panel (x 300–1500), lift interior (2000–3800), corridor POV (3950–5850), lobby (5900–7900), tiffin CU (7950–9850).

## Beats (t in s) — 45 s
- 0–3 Hook: CU display 10→11→12→13 (red, flicker), buttons only go to 12. VO n1. Hit at 1.9.
- 3–8.6 Riya alone in the lift, phone, looks up; title "13वाँ फ्लोर · भाग 1". VO n2. Ding 7.6, light flickers, doors open.
- 8.6–14.2 Corridor POV: bulb, dusty doors 1301–1304, 1996 calendar, amma at the far end. VO a1 "रिया… आ गई बेटा?…"
- 14.2–17.6 CU Riya frozen (ID card visible). VO n3 "रिया ने यहाँ किसी को अपना नाम नहीं बताया था।"
- 17.6–21.2 CU her finger jabbing CLOSE, nothing happens. VO r1 "बंद हो जा… प्लीज़!"
- 21.2–27 Amma glides close without footsteps, offers the tiffin. VO a2 "तेरे लिए आलू के पराठे बनाए हैं…". Bulb dies 26.5 → only glasses glint.
- 27–28.6 Doors slam, display drops 13→G.
- 28.6–37.6 Lobby: Riya stumbles out (tiffin already hanging from her hand). Watchman g1, Riya r2 "…तेरह से।", CU watchman g2 "…1996 की आग के बाद से बंद है…", his chai glass falls.
- 37.6–41 CU tiffin in her hands, steam, ID card "RIYA" swinging. VO n4 "तो ये टिफ़िन… अब तक गरम क्यों है?"
- 41–43.3 Riya (back) faces the open lift: in the mirror, amma right behind her shoulder; silence → sting 41.9; lights die.
- 43.3–45 End card over the red 13: "भाग 2 · कल शाम 7:30 बजे · Follow करो — छूट न जाए · @pannapalatkahani".

## PART 2 (22 Nov, build in the 21 Nov run, same folder copied to ep-20261122) — as pitched to and accepted by Jayant
- 0–3 Recap hook: "13वें फ्लोर वाली अम्मा… कौन हैं?"
- Twist 1 (everything was real): Riya turns — amma is really there, small and smiling; she slipped into the lift at the last second
  (goes down every night for milk). How did she know the name? Flashback: the ID card "RIYA" on the lanyard (visible all through Part 1).
- The watchman is new and repeated the building rumour; the 13th floor was never repaired after the fire and amma stayed on there alone.
  The lift button was faulty, so Riya ended up there by mistake.
- Twist 2 (heart): in amma's room, a photo of a girl she also called "Riya" — her granddaughter abroad who hasn't called in years.
  Amma still makes parathas every night: "शायद आज आ जाए…"
- Payoff + loop: next night Riya herself presses 13, carrying her own tiffin. Amma opens the door: "आ गई बेटा?" — "हाँ अम्मा… आ गई।"
  Last frame = the display stopping at 13 (loop). Optional 1 s sting: display goes to 14 — "पर 14वाँ फ्लोर…?"
- Caption idea: "Aaj apni dadi/nani ko ek phone kar lo ❤️ Us dost ko bhejo jo ghar se door rehta hai."

## Voice
voice/make_voice.sh: narrator Sulafat, Riya Kore, Amma Gacrux, Watchman Algenib. Key: GEMINI_API_KEY env var or /root/.gemini_key (never commit).
mix.py renders without voice files too (music + printed words) if the key is missing.
