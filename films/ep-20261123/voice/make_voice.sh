#!/bin/sh
# Gemini TTS lines for Ep 6 "टिफ़िन चोर" (key in /root/.gemini_key, never committed). Usage: sh make_voice.sh [id ...]
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
NAR="Narrator: a playful Hindi storyteller narrating an office comedy, with a detective-show tone"
MEERA="Meera: a bright, confident young woman in her twenties who works in an office, fed up that someone keeps eating her lunch"
SHARMA="Sharma sir: a strict middle-aged office boss with a deep voice, suddenly embarrassed and soft"
ARGS="$*"
ok() { [ -z "$ARGS" ] && return 0; for w in $ARGS; do [ "$w" = "$1" ] && return 0; done; return 1; }
ok m1 && say m1 Leda "$MEERA" "Style: exasperated and angry, comic, building up. Pace: quick." "तीसरी बार… ऑफिस के फ्रिज से मेरा टिफ़िन फिर गायब!"
ok n1 && say n1 Sulafat "$NAR" "Style: mock-serious detective, a little suspense. Pace: medium." "शक तीन लोगों पर था…"
ok m2 && say m2 Leda "$MEERA" "Style: a sly, scheming whisper with an evil little laugh in the voice. Pace: medium." "अब देखती हूँ… कौन खाता है मेरा टिफ़िन!"
ok n2 && say n2 Sulafat "$NAR" "Style: mock-serious, building suspense. Pace: medium." "अगले दिन… मीटिंग में।"
ok n3 && say n3 Sulafat "$NAR" "Style: big comic reveal, the last word punched. Pace: medium." "टिफ़िन चोर… बॉस निकले!"
ok s1 && say s1 Charon "$SHARMA" "Style: embarrassed, sheepish, softer and slower towards the end, a little emotional. Pace: slow." "बीवी मायके गई है… और तुम्हारे पराठे… बिल्कुल माँ जैसे हैं।"
ok m3 && say m3 Leda "$MEERA" "Style: warm, amused, smiling. Pace: medium." "कल से… दो टिफ़िन!"
