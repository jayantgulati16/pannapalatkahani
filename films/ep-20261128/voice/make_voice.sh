#!/bin/sh
# Gemini TTS lines for Ep 11 "0000 · लफ़्ज़ों का क़र्ज़ (भाग 2)" (key in /root/.gemini_key or $GEMINI_API_KEY, never committed). Usage: sh make_voice.sh [id ...]
# a1 = Aarav's FIRST spoken words in 15 years — the only time his voice is heard in the series.
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
NAR="Narrator: a calm, emotional Hindi storyteller for a sci-fi love story, intimate and gripping, like a late-night audio drama"
MEERA="Meera: a 23-year-old woman lawyer, brave and sharp, deeply emotional"
JUDGE="The judge: a strict old judge in his sixties, formal and final"
PAPA="Papa: Meera's gentle father in his sixties, just freed, overwhelmed with relief and love"
AARAV="Aarav: a shy, gentle 24-year-old man who has not spoken a single word for fifteen years; his voice is soft, slightly hoarse and unsure, full of love"
ARGS="$*"
ok() { [ -z "$ARGS" ] && return 0; for w in $ARGS; do [ "$w" = "$1" ] && return 0; done; return 1; }
ok m1 && say m1 Leda "$MEERA" "Style: a young WOMAN, shocked, trembling, almost crying, whispering. Pace: slow." "आरव… ये तुमने क्या किया?"
ok n1 && say n1 Sulafat "$NAR" "Style: quick recap, tense and emotional. Pace: medium-quick." "मीरा के लफ़्ज़ अदालत में ख़त्म हो गए थे… और आरव ने अपने सारे लफ़्ज़ उसे दे दिए।"
ok m2 && say m2 Leda "$MEERA" "Style: a young WOMAN, powerful, confident, fighting for her father, pointing at the screen. Pace: medium." "जज साहब, ये सीसीटीवी देखिए… असली चोर कंपनी का मालिक है!"
ok j2 && say j2 Orus "$JUDGE" "Style: formal verdict, firm, with a hint of respect. Pace: medium-slow." "मुल्ज़िम बाइज़्ज़त बरी किया जाता है।"
ok p1 && say p1 Charon "$PAPA" "Style: tearful, relieved, hugging his daughter. Pace: slow." "बेटा…"
ok m3 && say m3 Leda "$MEERA" "Style: a young WOMAN, overjoyed, breathless, laughing, running to him. Pace: quick." "आरव, हम जीत गए! अब तो कुछ बोलो!"
ok n2 && say n2 Sulafat "$NAR" "Style: quiet, heartbreaking. Pace: slow." "आरव ने अपने लिए एक भी लफ़्ज़ नहीं बचाया था।"
ok n3 && say n3 Sulafat "$NAR" "Style: a gentle flashback, tender and sad, like revealing a secret. Pace: medium." "पंद्रह साल पहले एक हादसे में मीरा की आवाज़ चली गई थी… बगल वाले बेड के छोटे आरव ने अपनी पूरी ज़िंदगी के लफ़्ज़ उसे दे दिए।"
ok n4 && say n4 Sulafat "$NAR" "Style: tender, a lump in the throat. Pace: slow." "और बचाए सिर्फ़ बारह सौ… एक दिन मीरा से एक बात कहने के लिए।"
ok n5 && say n5 Sulafat "$NAR" "Style: deeply moving, realisation; say the name MEERA clearly. Pace: slow." "मीरा… आज जो भी बनी थी… वो आवाज़ आरव की दी हुई थी।"
ok a1 && say a1 Enceladus "$AARAV" "Style: a young MAN, soft, hoarse, a shy smile, tears in his voice, the first words after fifteen years of silence. Pace: slow." "अब तो ख़ुश हो?"
ok m4 && say m4 Leda "$MEERA" "Style: a young WOMAN laughing through happy tears, one word, full of love. Pace: slow." "बहुत।"
