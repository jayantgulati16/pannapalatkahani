#!/bin/sh
# Gemini TTS lines for Ep 2 (key in /root/.gemini_key, never committed). Usage: sh make_voice.sh [id ...]
T=/home/claude/tools/gemini_tts.py; M=${M:-gemini-3.8-flash-tts}
say() { # id voice profile notes text
  P="# AUDIO PROFILE: $3

### DIRECTOR'S NOTES
$4 Accent: natural Hindi (North India). Only speak the transcript below. Do not read these notes.

#### TRANSCRIPT
$5"
  python3 $T "$1.wav" "$2" $M "$P" || { sleep 20; python3 $T "$1.wav" "$2" $M "$P"; }
  sleep 6
}
NAR="Narrator: a warm, gentle Hindi storyteller reading a children's crayon picture book aloud on a foggy winter morning"
ARGS="$*"
ok() { [ -z "$ARGS" ] && return 0; for w in $ARGS; do [ "$w" = "$1" ] && return 0; done; return 1; }
ok n1 && say n1 Sulafat "$NAR" "Style: soft, cosy, a little hushed like fog. Pace: unhurried." "कोहरे वाली सुबह… स्कूल बस का इंतज़ार।"
ok n2 && say n2 Sulafat "$NAR" "Style: tender, smiling. Pace: unhurried." "पापा का मफ़लर, हर सर्दी… तारा के गले में।"
ok p1 && say p1 Algenib "Papa: a loving Indian father in his late thirties, teeth chattering in the cold but pretending to be fine" "Style: proud, cheerful bluff, a tiny shiver in the voice. Pace: quick." "मुझे ठंड नहीं लगती!"
ok n3 && say n3 Sulafat "$NAR" "Style: amused, knowing smile. Pace: medium." "पापा हमेशा कहते।"
ok n4 && say n4 Sulafat "$NAR" "Style: a knowing, magical smile, slowing down on the last word like a secret. Pace: medium." "पर तारा के पास क्रेयॉन थे।"
ok n5 && say n5 Sulafat "$NAR" "Style: warm and moving, a small pause after the first half, the last words soft and full of love. Pace: slow." "पापा को भी ठंड लगती है… बस वो बताते नहीं।"
