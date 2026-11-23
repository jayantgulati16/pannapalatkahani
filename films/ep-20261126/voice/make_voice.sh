#!/bin/sh
# Gemini TTS lines for Ep 9 "असली भक्ति (भाग 2)" (key in /root/.gemini_key or $GEMINI_API_KEY, never committed). Usage: sh make_voice.sh [id ...]
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
MAA="Maa: an elderly village mother, warm and loving"
VAIDYA="The vaidya: an old village healer in his sixties, grave and kind"
DIVINE="The merchant / the divine voice: calm, deep, serene and kind, with quiet warmth and a hint of a knowing smile"
ARGS="$*"
ok() { [ -z "$ARGS" ] && return 0; for w in $ARGS; do [ "$w" = "$1" ] && return 0; done; return 1; }
ok r1 && say r1 Achird "$RAGHAV" "Style: crying, broken, guilty, almost a sob. Pace: medium-quick." "प्रभु… आज मैंने आपका फूल बेच दिया!"
ok r1 && say r1 Achird "$RAGHAV" "Style: stunned, trembling with awe, almost a whisper that rises. Pace: medium." "ये फूल… ये तो मैंने आज सुबह बेच दिया था!"
ok n1 && say n1 Sulafat "$NAR" "Style: gentle recap, emotional. Pace: medium-quick." "माँ की जान बचाने के लिए राघव ने भगवान का फूल एक व्यापारी को बेच दिया था।"
ok r2 && say r2 Achird "$RAGHAV" "Style: amazed, confused, reverent. Pace: medium." "प्रभु… ये आपके हाथ में कैसे?"
ok p1 && say p1 Alnilam "$DIVINE" "Style: serene, warm, a gentle smile, divine calm. Pace: slow." "वो व्यापारी कोई और नहीं… मैं ही था, राघव।"
ok r3 && say r3 Achird "$RAGHAV" "Style: ashamed, tearful, humble. Pace: medium." "पर प्रभु, मैंने तो आपकी पूजा छोड़ दी… आप नाराज़ नहीं?"
ok p2 && say p2 Alnilam "$DIVINE" "Style: loving, wise, deeply kind, like a blessing. Pace: slow and clear." "माँ को तड़पता छोड़कर चढ़ाया फूल मुझ तक नहीं पहुँचता… माँ की सेवा भी मेरी ही पूजा है।"
ok a1 && say a1 Gacrux "$MAA" "Style: healthy now, warm, cheerful, calling her son lovingly. Pace: medium." "राघव, आ जा… दिया जला दिया।"
ok n2 && say n2 Sulafat "$NAR" "Style: wonder, joyful. Pace: medium." "और अगली सुबह… पूरा तालाब कमलों से भर गया।"
ok n3 && say n3 Sulafat "$NAR" "Style: warm, the moral of the story, gentle and firm. Pace: slow." "सेवा ही सबसे बड़ी पूजा है।"
