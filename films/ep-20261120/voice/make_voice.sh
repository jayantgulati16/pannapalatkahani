#!/bin/sh
# Gemini TTS lines for Ep 3 (key in /root/.gemini_key, never committed). Usage: sh make_voice.sh [id ...]
T=/home/claude/tools/gemini_tts.py; M=gemini-3.8-flash-tts
say() { # id voice profile notes text
  P="# AUDIO PROFILE: $3

### DIRECTOR'S NOTES
$4 Accent: natural Hindi (North India). Only speak the transcript below. Do not read these notes.

#### TRANSCRIPT
$5"
  python3 $T "$1.wav" "$2" $M "$P" || { sleep 20; python3 $T "$1.wav" "$2" $M "$P"; }
  sleep 6
}
NAR="Narrator: a warm, playful Hindi storyteller reading a children's crayon picture book aloud"
want() { [ $# -eq 0 ] && return 0; for w in $ARGS; do [ "$w" = "$1" ] && return 0; done; return 1; }
ARGS="$*"
ok() { [ -z "$ARGS" ] && return 0; for w in $ARGS; do [ "$w" = "$1" ] && return 0; done; return 1; }
ok n1 && say n1 Sulafat "$NAR" "Style: smiling, building to a comic surprise on the last words. Pace: lively." "शादी का कार्ड आया… और अर्जुन के होश उड़ गए!"
ok n2 && say n2 Sulafat "$NAR" "Style: amused, gently teasing. Pace: lively." "अर्जुन को एक भी स्टेप नहीं आता था।"
ok a1 && say a1 Achird "Arjun: a shy, sweet young man in his twenties, wearing glasses, embarrassed after falling on the dance floor" "Style: sheepish, a little out of breath, half laughing at himself. Pace: quick." "मैं तो बस खाना खाने आया था!"
ok n3 && say n3 Sulafat "$NAR" "Style: a knowing, magical smile, slowing down on the last word like a secret. Pace: medium." "पर मीरा के पास क्रेयॉन थे।"
ok m1 && say m1 Leda "Meera: a bright, confident young woman in her twenties, cheering her shy friend on at a wedding dance" "Style: playful, encouraging, a big smile, calling across a noisy wedding stage. Pace: quick." "बस निशानों पे पैर रखो!"
ok n4 && say n4 Sulafat "$NAR" "Style: warm and wise with a wink, a small pause after the first half, the last words land like a punchline. Pace: medium." "डांस आए न आए… पार्टनर सही होना चाहिए!"
