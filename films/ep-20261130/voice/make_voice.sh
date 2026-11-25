#!/bin/sh
# Gemini TTS lines for Ep 13 "ख़ामोशी की क़ीमत (भाग 2)" (key in /root/.gemini_key or $GEMINI_API_KEY, never committed). Usage: sh make_voice.sh [id ...]
# k2/k3 = KABIR's voice, but in the film it is THE THING speaking with his stolen voice (made eerie in the mix).
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
NAR="Narrator: a hushed Hindi horror storyteller, late at night, slow and chilling, every word clear"
KABIR="Kabir: a 25-year-old young man"
ARGS="$*"
ok() { [ -z "$ARGS" ] && return 0; for w in $ARGS; do [ "$w" = "$1" ] && return 0; done; return 1; }
ok n1 && say n1 Sulafat "$NAR" "Style: quick, tense recap. Pace: medium." "पिछले भाग में… गिलास टूटा, मीटर पचासी पर गया… और वो चीज़ कमरे में आ गई।"
ok n2 && say n2 Sulafat "$NAR" "Style: chilling description, slow. Pace: slow." "उसके न आँखें थीं, न मुँह… सिर्फ़ एक बड़ा कान — जो हर आवाज़ सुनता था।"
ok n3 && say n3 Sulafat "$NAR" "Style: breathless whisper. Pace: medium." "कबीर बिना आवाज़ किए बेड के नीचे छिप गया… वो चीज़ ठीक बेड के पास आकर रुक गई।"
ok n4 && say n4 Sulafat "$NAR" "Style: dread, slow, almost a whisper. Pace: slow." "उसने अपना कान ज़मीन से लगा दिया… वो कबीर की धड़कन सुन रही थी।"
ok n5 && say n5 Sulafat "$NAR" "Style: a discovery, hushed. Pace: medium." "तभी फ़र्श पर खुरचा हुआ एक पुराना संदेश दिखा… पिछले किरायेदार का — आवाज़ दूर फेंको।"
ok n6 && say n6 Sulafat "$NAR" "Style: tense, clear, explaining the plan. Pace: medium." "कबीर ने चुपचाप फ़ोन को ब्लूटूथ स्पीकर से जोड़ा… अब सारी आवाज़ सिर्फ़ स्पीकर से आएगी।"
ok n7 && say n7 Sulafat "$NAR" "Style: tense, decisive. Pace: medium-quick." "उसने स्पीकर खिड़की की तरफ़ फेंका… और प्ले दबा दिया।"
ok n8 && say n8 Sulafat "$NAR" "Style: sudden, fast, intense. Pace: quick." "पंचानबे डेसिबल! वो चीज़ बिजली की तेज़ी से खिड़की पर झपटी… और स्पीकर के साथ बाहर कूद गई।"
ok n9 && say n9 Sulafat "$NAR" "Style: relief, quiet, a soft exhale. Pace: slow." "मीटर फिर हरा हो गया… कबीर को लगा, वो बच गया।"
ok n10 && say n10 Sulafat "$NAR" "Style: calm morning turning cold. Pace: medium-slow." "अगली सुबह… दरवाज़े पर कबीर ने बोलना चाहा — पर गले से एक भी आवाज़ नहीं निकली।"
ok n11 && say n11 Sulafat "$NAR" "Style: the final chilling reveal, slow and heavy. Pace: slow." "वो चीज़ जान नहीं लेती थी… आवाज़ चुराती थी। और अब… वो कबीर की आवाज़ में बोल रही थी।"
ok k2 && say k2 Iapetus "$KABIR" "Style: a relieved young MAN, then a slightly wrong, hollow laugh at the end. Pace: slow." "शुक्र है… जान बची!"
ok k3 && say k3 Iapetus "$KABIR" "Style: a young MAN, soft and friendly through a closed door at night, a little too slow. Pace: slow." "भाई… दरवाज़ा खोलो… मैं हूँ।"
ok n12 && say n12 Sulafat "$NAR" "Style: a soft creepy WHISPER with a hint of a smile. Pace: slow." "अगली कहानी देखने के लिए… सब्सक्राइब और फ़ॉलो करो… पर धीरे से।"
