#!/bin/sh
# Gemini TTS lines for Ep 8 "कर्तव्य या भक्ति? (भाग 1)" (key in /root/.gemini_key or $GEMINI_API_KEY, never committed). Usage: sh make_voice.sh [id ...]
# B (merchant) and P (the voice from the temple) are the SAME voice on purpose — the hidden clue for भाग 2.
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
NAR="Narrator: a warm, devotional Hindi storyteller, like a grandmother telling a sacred tale at night, gentle but gripping"
RAGHAV="Raghav: a poor, gentle young flower-seller in his twenties, deeply devoted, voice full of emotion"
MAA="Maa: a frail elderly village mother, weak from fever, waking up"
VAIDYA="The vaidya: an old village healer in his sixties, grave and kind"
DIVINE="The merchant / the divine voice: calm, deep, serene and kind, with quiet warmth and a hint of a knowing smile"
ARGS="$*"
ok() { [ -z "$ARGS" ] && return 0; for w in $ARGS; do [ "$w" = "$1" ] && return 0; done; return 1; }
ok r1 && say r1 Achird "$RAGHAV" "Style: crying, broken, guilty, almost a sob. Pace: medium-quick." "प्रभु… आज मैंने आपका फूल बेच दिया!"
ok n1 && say n1 Sulafat "$NAR" "Style: gentle storytelling, loving. Pace: medium-quick." "राघव रोज़ अपना सबसे सुंदर कमल भगवान विष्णु के चरणों में चढ़ाता था।"
ok r2 && say r2 Achird "$RAGHAV" "Style: soft prayer, sincere, folded hands. Pace: medium." "प्रभु, मुझे कुछ नहीं चाहिए… बस मेरी माँ ठीक रहे।"
ok v1 && say v1 Rasalgethi "$VAIDYA" "Style: grave, worried, matter-of-fact. Pace: medium." "बुखार बहुत तेज़ है। ये दवा चाहिए… दस सोने के सिक्के की।"
ok n6 && say n6 Sulafat "$NAR" "Style: ominous, worried. Pace: medium." "पर उसी रात… माँ को तेज़ बुख़ार चढ़ गया।"
ok n2 && say n2 Sulafat "$NAR" "Style: sad, heavy. Pace: medium." "राघव के पास बस चार ताँबे के सिक्के थे।"
ok n7 && say n7 Sulafat "$NAR" "Style: very soft, heartbroken. Pace: slow." "वो पूरी रात माँ का हाथ पकड़कर रोता रहा।"
ok n3 && say n3 Sulafat "$NAR" "Style: soft, a little hopeful. Pace: medium." "अगली सुबह तालाब में सिर्फ़ एक कमल खिला…"
ok n8 && say n8 Sulafat "$NAR" "Style: curious, a little mysterious. Pace: medium." "तभी एक अमीर व्यापारी ने उसे रोका।"
ok b1 && say b1 Alnilam "$DIVINE" "Style: calm, kind, a gentle knowing smile, unhurried. Pace: medium." "ये कमल मुझे दे दो। बदले में… दस सोने के सिक्के।"
ok n4 && say n4 Sulafat "$NAR" "Style: tense, torn, emotional. Pace: medium." "एक तरफ़ भगवान की पूजा… दूसरी तरफ़ माँ की जान।"
ok a1 && say a1 Gacrux "$MAA" "Style: weak, waking, tender, a faint smile. Pace: slow." "राघव…"
ok r3 && say r3 Achird "$RAGHAV" "Style: tearful, humble, asking forgiveness. Pace: medium." "प्रभु… क्या आप मुझे माफ़ करेंगे?"
ok p1 && say p1 Alnilam "$DIVINE" "Style: soft, serene, divine, loving, calling his name from far. Pace: slow." "राघव…"
ok n5 && say n5 Sulafat "$NAR" "Style: suspenseful teaser, inviting. Pace: medium-quick." "आगे क्या हुआ… देखिए भाग दो में, कल शाम साढ़े सात बजे!"
