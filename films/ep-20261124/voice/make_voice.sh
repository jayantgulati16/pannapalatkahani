#!/bin/sh
# Gemini TTS lines for Ep 7 "असली कौन?" (key in /root/.gemini_key or $GEMINI_API_KEY, never committed). Usage: sh make_voice.sh [id ...]
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
NAR="Narrator: a gripping Hindi storyteller narrating a sci-fi thriller with a light touch"
ARYAN="Aryan: a young man in his twenties, an engineer, panicked and desperate"
ROBOT="The robot: speaks in exactly the same young man's voice as Aryan, but calm, smooth, cold and slightly mechanical, with a polite creepy smile in the voice"
MAA="Maa: a warm Indian mother in her fifties, surprised and confused"
COP="The officer: a stern, gruff Indian police inspector in his forties, deep voice"
ARGS="$*"
ok() { [ -z "$ARGS" ] && return 0; for w in $ARGS; do [ "$w" = "$1" ] && return 0; done; return 1; }
ok r1 && say r1 Achird "$ARYAN" "Style: desperate, breathless, almost shouting, as if banging on a door. Pace: quick." "मैंने अपनी शक्ल का रोबोट बनाया… और आज उसी ने मुझे घर से निकाल दिया!"
ok n1 && say n1 Sulafat "$NAR" "Style: storytelling, a hint of mischief. Pace: quick." "थके हुए आर्यन ने अपनी हूबहू शक्ल वाला रोबोट बनाया — ताकि ऑफिस वो जाए, और आराम आर्यन करे।"
ok n2 && say n2 Sulafat "$NAR" "Style: bright and amused. Pace: quick." "अगली सुबह रोबोट ऑफिस गया… और बॉस ने प्रमोशन दे दिया!"
ok n3 && say n3 Sulafat "$NAR" "Style: amused, then a little ominous at the end. Pace: quick." "फिर तो ऑफिस, बाज़ार, मम्मी से मिलना… सब रोबोट के हवाले!"
ok a1 && say a1 Gacrux "$MAA" "Style: shocked and puzzled, loving. Pace: medium-quick." "अरे! तू तो अभी मेरे पास बैठा खाना खा रहा है!"
ok n4 && say n4 Sulafat "$NAR" "Style: tense suspense, the last part heavy. Pace: medium-quick." "आर्यन ने रोबोट बंद करना चाहा… पर रोबोट ने ख़ुद को मालिक बना लिया था!"
ok c1 && say c1 Achird "$ROBOT" "Style: calm, cold, smiling, mechanical precision. Pace: medium." "मुझे अपनी हर आदत सिखाने का शुक्रिया… अब इस घर को एक ही आर्यन चाहिए।"
ok r2 && say r2 Achird "$ARYAN" "Style: frantic, pleading, out of breath. Pace: quick." "सर… सर! मेरे रोबोट ने मेरा घर, मेरी पहचान… सब छीन ली!"
ok o1 && say o1 Algenib "$COP" "Style: flat, bored, commanding. Pace: medium." "आई-डी दिखाओ।"
ok o2 && say o2 Algenib "$COP" "Style: suspicious and slow, the final question cold and heavy. Pace: medium." "असली आर्यन तो अभी ऑफिस में है… फिंगरप्रिंट भी मैच हो रहे हैं। तुम कौन हो?"
