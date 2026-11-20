#!/bin/sh
# Gemini TTS lines for Ep 4 "13वाँ फ्लोर" (key in /root/.gemini_key, never committed). Usage: sh make_voice.sh [id ...]
T=/home/claude/tools/gemini_tts.py; M=${M:-gemini-3.8-flash-tts}
cd "$(dirname "$0")"
say() { # id voice profile notes text
  P="# AUDIO PROFILE: $3

### DIRECTOR'S NOTES
$4 Accent: natural Hindi (North India). Only speak the transcript below. Do not read these notes.

#### TRANSCRIPT
$5"
  python3 $T "$1.wav" "$2" $M "$P" || { sleep 20; python3 $T "$1.wav" "$2" $M "$P"; }
  sleep 6
}
NAR="Narrator: a low, hushed Hindi storyteller telling a night-time mystery, close to the microphone"
RIYA="Riya: a 24-year-old working woman, alone in a lift at night, frightened"
AMMA="Amma: a frail, very old grandmother with a soft, slow, affectionate voice that is somehow unsettling"
GRD="Watchman: a middle-aged building watchman, rough voice, sleepy at first"
ARGS="$*"
ok() { [ -z "$ARGS" ] && return 0; for w in $ARGS; do [ "$w" = "$1" ] && return 0; done; return 1; }
ok n1 && say n1 Sulafat "$NAR" "Style: tense, a slow first half, a chilling question at the end. Pace: medium." "बिल्डिंग में सिर्फ बारह फ्लोर हैं… तो लिफ्ट तेरह पे क्यों रुकी?"
ok n2 && say n2 Sulafat "$NAR" "Style: quiet, setting the scene. Pace: slow." "रात के ग्यारह चालीस… रिया लिफ्ट में अकेली थी।"
ok a1 && say a1 Gacrux "$AMMA" "Style: warm and slow, as if she has waited for years; a little breathy. Pace: slow." "रिया… आ गई बेटा? कब से राह देख रही थी।"
ok n3 && say n3 Sulafat "$NAR" "Style: almost a whisper, the last words land like a cold realisation. Pace: slow." "रिया ने यहाँ किसी को… अपना नाम नहीं बताया था।"
ok r1 && say r1 Kore "$RIYA" "Style: panicked whisper, out of breath, pleading. Pace: quick." "बंद हो जा… प्लीज़!"
ok a2 && say a2 Gacrux "$AMMA" "Style: sweet and loving, very close, too calm. Pace: slow." "तेरे लिए आलू के पराठे बनाए हैं…"
ok g1 && say g1 Algenib "$GRD" "Style: casual, a little sleepy, curious. Pace: medium." "मैडम, किस फ्लोर से आ रही हो?"
ok r2 && say r2 Kore "$RIYA" "Style: shaky and breathless, barely audible. Pace: slow." "तेरह से…"
ok g2 && say g2 Algenib "$GRD" "Style: his voice drops, scared, slowly. Pace: slow." "तेरहवाँ फ्लोर? वो तो उन्नीस सौ छियानवे की आग के बाद से बंद है…"
ok n4 && say n4 Sulafat "$NAR" "Style: hushed, ominous, a pause after the first half. Pace: slow." "तो ये टिफ़िन… अब तक गरम क्यों है?"
