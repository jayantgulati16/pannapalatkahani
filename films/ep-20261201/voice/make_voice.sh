#!/bin/sh
# Gemini TTS lines for Ep 14 "आख़िरी मेट्रो (भाग 1)" (key in /root/.gemini_key or $GEMINI_API_KEY, never committed). Usage: sh make_voice.sh [id ...]
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
NAR="Narrator: a hushed Hindi horror storyteller, late at night in an empty metro, slow and chilling, every word clear"
ROH="Rohan: a 28-year-old office worker, exhausted after a long day"
AMMA="Amma: a frail old Indian woman in a white saree, soft, sad and strangely calm, like a voice from far away"
ARGS="$*"
ok() { [ -z "$ARGS" ] && return 0; for w in $ARGS; do [ "$w" = "$1" ] && return 0; done; return 1; }
ok n1 && say n1 Sulafat "$NAR" "Style: mysterious, quiet, setting the scene. Pace: slow." "रात के ग्यारह बजकर पचपन मिनट… आख़िरी मेट्रो।"
ok n2 && say n2 Sulafat "$NAR" "Style: calm storytelling. Pace: medium." "रोहन ऑफ़िस से थककर लौट रहा था… तभी माँ का फ़ोन आया।"
ok r1 && say r1 Enceladus "$ROH" "Style: tired, a little irritated, quick, then he hangs up. Pace: medium." "माँ… बाद में बात करता हूँ।"
ok n3 && say n3 Sulafat "$NAR" "Style: eerie, slow, describing a strange old woman. Pace: medium-slow." "कोने में एक बूढ़ी अम्मा बैठी थीं… हाथ में पुराना टिफ़िन… नज़रें खिड़की के बाहर अँधेरे पर।"
ok n4 && say n4 Sulafat "$NAR" "Style: tense, quiet. Pace: medium." "स्टेशन आया… दरवाज़े खुले… पर कोई नहीं चढ़ा।"
ok n5 && say n5 Sulafat "$NAR" "Style: suspense building. Pace: medium." "रोहन ने अम्मा की नज़र का पीछा किया…"
ok n6 && say n6 Sulafat "$NAR" "Style: quiet, slow. Pace: medium-slow." "शीशे में वो ख़ुद दिख रहा था…"
ok n7 && say n7 Sulafat "$NAR" "Style: a chilling whisper, the scare. Pace: slow." "पर अम्मा की सीट… ख़ाली थी।"
ok n8 && say n8 Sulafat "$NAR" "Style: urgent, breathless. Pace: fast." "रोहन बैग छोड़कर अगले डिब्बे की तरफ़ भागा…"
ok n9 && say n9 Sulafat "$NAR" "Style: dread, each phrase separate. Pace: slow." "वही कोना। वही सीट। वही टिफ़िन।"
ok m1 && say m1 Gacrux "$AMMA" "Style: very soft, sad, slow, almost a whisper, close to his face. Pace: slow." "बेटा… मेरा स्टेशन आ गया… पर मैं उतर नहीं सकती।"
ok n10 && say n10 Sulafat "$NAR" "Style: soft, a little creepy, inviting. Pace: medium." "भाग 2 देखने के लिए… फ़ॉलो और सब्सक्राइब करो!"
