#!/bin/sh
# Gemini TTS lines for Ep 1 (key in /root/.gemini_key, never committed). Usage: sh make_voice.sh [id ...]
T=/home/claude/tools/gemini_tts.py; MODELS=${MODELS:-"gemini-3.8-flash-tts gemini-3.1-flash-tts-preview gemini-2.5-flash-preview-tts"}
say() { # id voice profile notes text
  P="# AUDIO PROFILE: $3

### DIRECTOR'S NOTES
$4 Accent: natural Hindi (North India). Only speak the transcript below. Do not read these notes.

#### TRANSCRIPT
$5"
  rm -f "$1.wav"
  for M in $MODELS; do python3 $T "$1.wav" "$2" $M "$P" | cut -c1-80 && [ -f "$1.wav" ] && { echo "  ($M)"; break; }; sleep 4; done
  sleep 4
}
NAR="Narrator: a warm, tender Hindi storyteller reading a children's crayon picture book about a shy first love in a narrow lane, monsoon season"
ARGS="$*"
ok() { [ -z "$ARGS" ] && return 0; for w in $ARGS; do [ "$w" = "$1" ] && return 0; done; return 1; }
ok h0 && say h0 Sulafat "$NAR" "Style: curious, a hook that makes you lean in, rising on the question. Pace: lively." "ये चिट्ठी… कोरी क्यों है?"
ok n1 && say n1 Sulafat "$NAR" "Style: cosy, setting the scene. Pace: unhurried." "एक तंग गली… आमने-सामने, दो बालकनी।"
ok n2 && say n2 Sulafat "$NAR" "Style: gentle, smiling. Pace: unhurried." "बीच में, कपड़े सुखाने की एक रस्सी।"
ok n3 && say n3 Sulafat "$NAR" "Style: soft and a little teasing, like sharing a secret. Pace: medium." "अर्जुन रोज़ मीरा को एक चिट्ठी भेजता…"
ok n4 && say n4 Sulafat "$NAR" "Style: playful puzzlement. Pace: medium." "…और हर बार, कोरा कागज़।"
ok n5 && say n5 Sulafat "$NAR" "Style: magical wonder, slowing down at the end. Pace: slow." "सफ़ेद क्रेयॉन से लिखी बात… बारिश ने पढ़ ली।"
ok m1 && say m1 Leda "Meera: a bright young woman in her twenties, blushing, answering yes to a shy invitation for chai" "Style: happy, shy but bold, a big smile, one word. Pace: quick." "हाँ!"
ok n6 && say n6 Sulafat "$NAR" "Style: warm, tender ending, like closing a storybook. Pace: slow." "उस दिन से, वो गली थोड़ी छोटी लगने लगी।"
