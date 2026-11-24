#!/bin/sh
# Gemini TTS lines for Ep 10 "0000 · लफ़्ज़ों का क़र्ज़ (भाग 1)" (key in /root/.gemini_key or $GEMINI_API_KEY, never committed). Usage: sh make_voice.sh [id ...]
# Aarav is SILENT in भाग 1 (his voice is heard only at the end of भाग 2).
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
MEERA="Meera: a 23-year-old lawyer, brave and sharp, but scared for her father; she knows every word costs her"
KHANNA="Khanna: a rich, arrogant senior lawyer in his fifties, loud, smug and theatrical"
JUDGE="The judge: a strict, tired old judge in his sixties, cold and final"
ARGS="$*"
ok() { [ -z "$ARGS" ] && return 0; for w in $ARGS; do [ "$w" = "$1" ] && return 0; done; return 1; }
ok m1 && say m1 Leda "$MEERA" "Style: a young WOMAN, urgent and desperate, holding up the evidence; say the two words JAJ and SAAHAB clearly and separately; she is cut off abruptly right after ये. Pace: slow, each word weighed." "जज… साहब… ये—"
ok n1 && say n1 Sulafat "$NAR" "Style: mysterious, wonder, setting up a strange world. Pace: medium." "इस दुनिया में हर इंसान को पूरी ज़िंदगी के लिए सिर्फ़ दस लाख लफ़्ज़ मिलते हैं।"
ok n2 && say n2 Sulafat "$NAR" "Style: ominous, quiet, a little chilling. Pace: slow." "मीटर ज़ीरो… तो आवाज़ हमेशा के लिए चली जाती है।"
ok n3 && say n3 Sulafat "$NAR" "Style: gentle, a little sad, curious. Pace: medium." "आरव के पास सिर्फ़ बारह सौ लफ़्ज़ थे। लोग कहते थे, बचपन में सब बर्बाद कर दिए।"
ok n4 && say n4 Sulafat "$NAR" "Style: admiring, warm, a bit sad. Pace: medium." "और मीरा… एक वकील, जिसने ग़रीबों को इंसाफ़ दिलाने में अपने लगभग सारे लफ़्ज़ ख़र्च कर दिए।"
ok n5 && say n5 Sulafat "$NAR" "Style: mysterious, tender, a secret. Pace: medium." "बचपन में किसी अनजान ने अपने लफ़्ज़ देकर उसकी आवाज़ लौटाई थी… मीरा उसे आज तक ढूँढ रही थी।"
ok n6 && say n6 Sulafat "$NAR" "Style: tense, stakes rising. Pace: medium." "आज मीरा को अपने बेक़सूर पापा को बचाना था… पर उसके पास बस पैंतालीस लफ़्ज़ थे।"
ok v1 && say v1 Algieba "$KHANNA" "Style: loud, smug courtroom showman, pointing at the accused. Pace: medium-quick." "माई लॉर्ड, सारे काग़ज़ इसके ख़िलाफ़ हैं!"
ok m2 && say m2 Leda "$MEERA" "Style: firm, emotional, every word precious, voice shaking slightly. Say exactly the transcript, nothing added after किया. Pace: medium." "मेरे पापा बेक़सूर हैं। घोटाला किसी और ने किया।"
ok j1 && say j1 Orus "$JUDGE" "Style: cold, final, slightly impatient. Pace: medium-slow." "कहने को कुछ नहीं? पाँच मिनट बाद फ़ैसला।"
ok n7 && say n7 Sulafat "$NAR" "Style: deeply emotional, tender, a lump in the throat. Pace: slow." "मीरा को टूटता देख… आरव ने अपनी आख़िरी आवाज़ भी उसके नाम कर दी।"
