#!/bin/sh
# Gemini TTS lines for Ep 5 "13वाँ फ्लोर भाग 2" (key in /root/.gemini_key, never committed). Usage: sh make_voice.sh [id ...]
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
ok n1 && say n1 Sulafat "$NAR" "Style: hushed, mysterious, a pause after the first half. Pace: slow." "तेरहवें फ्लोर वाली अम्मा… आखिर कौन हैं?"
ok a1 && say a1 Gacrux "$AMMA" "Style: warm, a little amused, kind and reassuring like a grandmother. Pace: slow." "डर गई बेटा? मैं तो रोज़ रात दूध लेने नीचे आती हूँ।"
ok n2 && say n2 Sulafat "$NAR" "Style: curious, building intrigue. Pace: medium." "पर अम्मा को रिया का नाम कैसे पता था?"
ok a2 && say a2 Gacrux "$AMMA" "Style: a soft chuckle, teasing and loving. Pace: slow." "तेरे गले में लिखा है ना… रिया।"
ok n3 && say n3 Sulafat "Narrator: a warm, gentle Hindi storyteller, the mystery turning into something sad and tender" "Style: gentle and a little sad, softer on the last part. Pace: medium." "चौकीदार नया था। आग के बाद तेरहवाँ फ्लोर कभी ठीक नहीं हुआ… और अम्मा वहीं अकेली रह गईं।"
ok n4 && say n4 Sulafat "Narrator: a warm, gentle Hindi storyteller, the mystery turning into something sad and tender" "Style: tender, slow, emotional. Pace: slow." "अम्मा की पोती का नाम भी रिया था… जो सालों पहले विदेश चली गई।"
ok a3 && say a3 Gacrux "$AMMA" "Style: quiet and hopeful, a lonely smile in the voice, slight pause before the last words. Pace: slow." "रोज़ उसके लिए पराठे बनाती हूँ… शायद आज आ जाए।"
ok n5 && say n5 Sulafat "Narrator: a warm, gentle Hindi storyteller" "Style: warm, a smile in the voice. Pace: medium." "अगली रात… रिया ख़ुद तेरहवें फ्लोर पर गई।"
ok a4 && say a4 Gacrux "$AMMA" "Style: overjoyed, loving, a little teary. Pace: slow." "आ गई बेटा?"
ok r1 && say r1 Kore "Riya: a 24-year-old woman, warm and emotional, smiling through tears" "Style: soft, warm, smiling. Pace: slow." "हाँ अम्मा… आ गई।"
ok n6 && say n6 Sulafat "$NAR" "Style: a sudden chilling whisper. Pace: slow." "पर… चौदहवाँ फ्लोर?"
