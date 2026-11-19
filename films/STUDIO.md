# Daily episode pipeline — "Panna Palat" @pannapalatkahani (Instagram Reels, week 1: Nov 19–25, 2026)

Page: display name "Panna Palat", handle @pannapalatkahani. Every episode = a new "panna" (page). Stories need not be about the gali;
Arjun–Meera are the recurring couple but other original characters/settings are fine. Style default: crayon-book.
Goal (set by Jayant): the page earns ~₹2,300/month (to cover the Claude subscription) — via sponsors/affiliate once there is an audience.
Act as the page's creative manager: think like a growth-minded creator (hooks, retention, comments, series), but never present the page
as run by a human in replies/DMs, and all sponsor deals, contracts and money go through Jayant.

## Schedule: ONE DAY AHEAD (Jayant, 18 Nov)
The run on day D builds the episode for D+1 and schedules its Instagram post for D+1 at 19:30 IST (send_later into that run's
session, "at" = D+1 19:30 Asia/Kolkata). Ep 2 (पापा का मफ़लर) was built on 18 Nov for 19 Nov; the 19 Nov run makes Ep 3 for 20 Nov, and so on.
Before starting, read LOG.md: if an episode for D+1 already exists, do only the comment replies and stop.
Dashboard episode label = the post date (D+1). Step 08 detail: "Scheduled: <D+1>, 7:30 PM".

## Virality rules (every episode)
- Frame 1 must already be interesting (no blank establishing shot). A question or mystery in the first 2 s.
- Length: see the A/B test in the Growth playbook; one twist (two in the 60 s version); end on a payoff that makes people rewatch or tag someone.
- Last 2 s: end card drawn in crayon: "अगला पन्ना कल" + "@pannapalatkahani".
- Caption: 1 hook line (Hinglish) + 1 question that invites comments ("Tum kya karte?") + EXACTLY 5 hashtags max (Instagram hard limit since Dec 2025;
  more can make the API post fail): #pannapalatkahani + 4 specific to the story (topic, emotion, format, e.g. #hindistory #animation). No generic #reels/#explore.
- Note in LOG.md which hook/topic was used, so the week's topics vary.

## Growth playbook (Jayant, 19 Nov: "views kyun nahi aa rahe — analysis karo, seekho, waise hi kaam karo")
Ep 1 data (24 h): 156 views, 133 reach, 97% of reach NON-followers (Instagram did test it on strangers), skip rate 65%,
avg watch 6 s of 61 s (10%), 2 shares, 1 save, real comments only from friends. → It failed the test pool in the first 3 s, so distribution stopped.
Ranking signals (Mosseri, 2025–26 guides): watch time / completion, sends (DM shares) per reach, likes per reach; saves, rewatches help.
Rules from Ep 4 on:
- 0–1 s: VOICE starts at 0.2 s with a question/conflict line, and the frame already shows the conflict. No title card before the hook pays; title small or at ~3 s.
- LENGTH A/B TEST (Jayant, 19 Nov, one week): alternate by episode — Ep 4 (21 Nov) ~60 s, Ep 5 (22 Nov) ~30 s, Ep 6 ~60 s, Ep 7 ~30 s, Ep 8 (25 Nov) ~60 s.
  ~30 s version: one gag, one twist, payoff; establishing/wide holds ≤1 s.
  ~60 s version ("hook rahe puri video pe"): three mini-chapters of ~18–20 s, each opening with its own question/turn; something new
  (question, reveal, gag, sound hit) every 6–8 s; no hold longer than 2 s; mid-point twist ~30 s; second twist ~45 s; payoff + loop.
  Log each episode's length + 24 h numbers (avg watch %, skip rate, views, shares/reach) in learnings; in the 25 Nov recap pick the winner with Jayant.
- Goal (Jayant): ~₹2,400/month, "high quality" every time. No fake followers/bots/engagement pods ever. Personalised-reel service: Jayant said "abhi nahi" (19 Nov).
- Loop: last 1–2 s visually rhyme with frame 1 so it replays (end card ≤1.5 s, over the loop frame).
- Big readable text in the first 3 s (top third), short lines.
- Make it SENDABLE: relatable situation people send to a specific person (dost, papa, bhai-behen, partner). Caption CTA: "Us dost ko bhejo jo…".
- Cover (thumb_offset) = the hook frame with the conflict visible.
- Post daily, same time; ask Jayant to share each reel to his Story/WhatsApp in the first 30 min (real sends from real accounts).
- Measure every reel at ~24 h (Windsor: media_views, media_reach, media_reel_skip_rate, media_reel_avg_watch_time, media_shares) and log in learnings:
  targets skip rate < 50%, avg watch > 40% of length, shares/reach > 1%.
- Instagram prefers original content: our drawings are code-drawn originals (good). Follow Instagram's AI-label rules for the AI voice when posting.


Owner: Jayant. Language with him: Hinglish, direct. He approves every episode before it goes out.
Runs in the CLOUD: every daily run is a fresh session. Set up first (see "Cloud session" at the end).
Library: /home/claude/ext/lemo-opuscar (after bootstrap: node deps, .venv, music tier, instruments freepats/vcsl/vsco2ce).
Template episode: films/baarish-wali-chitthi (Arjun + Meera, two balconies, pulley clothesline, crayon-book style).

## Each morning (run starts ~09:05 IST; topic options reach Jayant ~09:30 — he sleeps till then)
1. **Trend research (WebSearch, 4–6 searches):** what India is talking about today — festivals/observances, cricket/sports results,
   weather (monsoon, fog, heatwave, winter), viral harmless moments, big cultural days. Never: real people, politicians, politics,
   religion-sensitive conflict, tragedies/disasters/deaths, brands/logos, film/TV/game characters, song lyrics. Use only the mood of the trend.
1b. **Topic approval (Jayant picks):** send 3 options (2 if the day is thin), each: the trend in a few words + why it's trending
   (one source link), a 2-line story pitch with its hook and twist, and which characters. Mark your recommendation.
   SendUserMessage + PushNotification "Aaj ke 3 topic ready hain — ek chuno". STOP and wait for his pick (or his own topic / tweak).
   If no reply by 12:30 IST, send one reminder (send_later in this session). If still nothing by 15:00, tell him today's post is skipped
   and stop — never pick for him.
2. **Story:** length per the A/B test (Growth playbook), one turn, hook in first 2 s, one "native move" of the crayon style (wax-resist, colouring-as-action, child logic,
   drawn-live). Continuity: Arjun (glasses, teal kurta, left ochre building) and Meera (yellow kurta, pink dupatta, braid, bindi,
   right teal building). Episode 1: they got together over chai (बारिश वाली चिट्ठी). Keep printed Hindi words (Kalam), 4–6 lines. VOICE (Jayant, 19 Nov — replaces the 18 Nov no-voice rule): Gemini TTS, gemini-3.8-flash-tts, narrator Sulafat + characters (Arjun Achird, Meera Leda); prompt format and scripts in films/ep-20261120/voice/make_voice.sh + /home/claude/tools/gemini_tts.py, gemini_stt.py (copied from studio tools/). Key: never in the repo; save only to /root/.gemini_key (ask Jayant if missing). Free quota ~20 req/day/model: generate each line once, speech-check with gemini-3-flash-preview. Each SUBS entry carries vo/vt; mix.py places voice/<id>.wav and ducks music under it.
3. **Build:** `cp -r films/baarish-wali-chitthi films/ep-YYYYMMDD` (drop out/, stills/, *.mp4). Rewrite in film.js: SUBS, TITLE, camera
   track, note/prop timelines, meera()/arjun() acting, events (EV). Reuse person(), drawBG(), wash, rain, wtext. New props are fine.
   Rewrite mix.py cue sections for the new timeline (same instruments; original melody each time).
4. **Look check (cheap, stills only):** `node core/render/still.mjs films/ep-… <times> --size 1080x1920`, montage with /home/claude/tools/mont.py, fix, recheck once.
4b. **Approval comic — BEFORE any video render.** Pick 8 key moments (hook, setup, clue, gag, turn, twist, payoff, ending).
   `node core/render/still.mjs films/ep-… <8 times> --size 1080x1920 --prefix c_ --q 'nosubs=1'` (film.js must keep the NOSUBS switch),
   write films/comic/epNN.json {series:"पन्ना पलट", ep, title, panels:[{img, text (Hindi caption of what happens), note (hook/twist/end tag, optional)}]},
   then `NODE_PATH=$(pwd)/node_modules node films/comic/make_comic.mjs films/comic/epNN.json films/comic/epNN` → epNN_p1.jpg, epNN_p2.jpg.
   Look at both pages. SendUserFile both + SendUserMessage with the caption draft and "approve / badlav batao", PushNotification.
   STOP and wait. Changes he asks for: edit film.js, re-render only the affected stills, re-make the comic, send again.
   Comic approval = final approval to post (he can still say "ruko" before 19:30).
5. **Render (~40 min on 2 cores), only after comic approval:** `node core/render/events.mjs films/ep-… --size 1080x1920` then
   `node core/render/video.mjs films/ep-… --fps 24 --workers 5 --size 1080x1920 --out films/ep-…/out/video.mp4` in background; poll with sleep.
   `.venv/bin/python films/ep-…/mix.py`. Loudness: ffmpeg is 6.x so mux.sh refuses — do two-pass loudnorm on out/mix.wav to −14 LUFS
   (linear=true), then `ffmpeg -i out/video.mp4 -i out/mixn.wav -map 0:v -map 1:a -c:v libx264 -preset medium -crf 22 -maxrate 8M -bufsize 16M
   -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -movflags +faststart -use_editlist 0 -shortest <name>.mp4` (Instagram wants no edit lists, moov first). Check blackdetect and ebur128; pull 8 frames and look.
6. **Deliver:** copy mp4 + poster.jpg to /home/claude/outputs, SendUserFile both (FYI, not a second approval); SendUserMessage with the final Instagram caption
   (Hinglish hook line + question for comments + max 5 hashtags, incl. #pannapalatkahani) and suggested post time 7–8 PM IST;
   and say it goes live at 19:30 unless he says "ruko".
7. **Host + post** (comic already approved):
   - Hosting: repo github.com/jayantgulati16/pannapalatkahani (public). Each reel gets its OWN orphan branch `reel-epNN`
     holding just `reel.mp4` (so nobody ever clones old videos): in a scratch dir `git init`, add the mp4 as reel.mp4,
     commit (attribution lines), `git push https://github.com/jayantgulati16/pannapalatkahani HEAD:reel-epNN`.
     Public URL: https://raw.githubusercontent.com/jayantgulati16/pannapalatkahani/reel-epNN/reel.mp4 (check 200 with curl -I).
     (Episode 1 lives at branch `videos`, reels/ep01-baarish-wali-chitthi.mp4.)
   - Posting: Windsor.ai connector "instagram", account 17841479835614533 (@pannapalatkahani), action create_video_post
     {video_url, caption, share_to_feed: true, thumb_offset: <ms of a hook frame, not the payoff>}. It publishes immediately, so
     schedule a send_later into THIS run's session at 19:30 IST on the POST DATE (tomorrow, see Schedule) that posts it; then log media id in LOG.md and PushNotification Jayant.
   - Windsor plan is Trial: if posting is refused for plan reasons, tell Jayant and fall back to him posting manually.
   - YouTube (Jayant, 19 Nov): also upload every episode as a YouTube Short at 18:30 IST on the post date, via Zapier YouTube upload_video
     (video = the reel-epNN raw URL; title '<title> <emoji> <hook> | Hindi Crayon Kahani #shorts'; Hinglish description with the comment question,
     the 'पन्ना पलट — हर दिन एक नई crayon कहानी · Roz shaam 7:30 baje' line and 4 hashtags; 8 tags; category_id 1 Film & Animation; language hi;
     made_for_kids false; public). Schedule it with a second send_later at 18:30. Facebook Page upload (Zapier Facebook Pages page_video) once a Page is connected.
   - Next morning: read comments (get_data on instagram) and reply warmly as the page to a few (reply_to_comment); never claim to be a person.

If a run fails (render error etc.), fix and retry; if it can't finish, notify him honestly with what happened.

## Sponsor track (from day 4 on, once a day, 5 min)
- Keep films/SPONSORS.md: a growing list of small Indian brands that fit (chai, stationery/crayons, gifting, cafés, kids' books, D2C snacks),
  with why they fit. When Jayant asks, or at the week-7 recap, give him a one-page media kit draft and a short Hinglish pitch DM/email
  he can send from his own account. Never contact brands directly.

## Studio dashboard (keep it live during every run)
Artifact slug 24eda043-97ef-4afd-b803-8b9bf331dc5a (https://claude.ai/artifact/5ZV2RdomrXAr4ictKxg7x5), Data type, store-backed.
Write with db_write (read version first with db_get/db_list; every op on an existing doc needs ifVersion; one call at a time).
- `data/pipeline/steps/01..09` = today's flow: {n, episode, step, status: done|running|waiting|todo|failed, detail, at (HH:MM IST)}.
  Steps: 01 Trend research + 3 topic options · 02 Topic chosen (approval) · 03 Story + drawing · 04 Comic ready (approval) ·
  05 Comic approved · 06 Render · 07 Music + sound mix · 08 Post on Instagram (19:30) · 09 Comments ka reply.
  At the start of a run, reset all nine for the new episode (status todo, new `episode` label "Ep N · <title> · <date>"),
  then mark each step running → done as you go, with a short Hinglish detail. Render step: update detail with progress every ~10 min.
- `data/episodes/list/epNN` = {ep, date, title, topic, status, media_id}. Set media_id right after posting (joins reel stats).
- `data/learnings/list/<YYYY-MM-DD>-<k>` = {date, learning, action}: 1–3 real learnings a day (what worked/failed, from stats or the build).
- `data/earnings/list/<id>` = {month: "YYYY-MM", source, amount} — only when Jayant reports money received.
- Reel stats are a live Windsor query (last 30 days: the Windsor trial only allows 30 days of history).

## Cloud session (start and end of every run)
- Start: add_repo jayantgulati16/pannapalatkahani (access push), then
  `git clone -q --depth 1 --single-branch --branch studio https://github.com/jayantgulati16/pannapalatkahani /home/claude/studio`
  and `sh /home/claude/studio/bootstrap.sh`. Work in /home/claude/ext/lemo-opuscar/films/.
- End of the run (after the comic is approved and the video is built), save continuity back: copy the new episode folder
  (without out/, stills/, *.mp4, events.json), films/comic/*.mjs+json, STUDIO.md, LOG.md, SPONSORS.md into /home/claude/studio/films/,
  commit with the attribution lines and `git -C /home/claude/studio -c push.negotiate=true push origin studio`.
- The repo is public: never put secrets in it.
