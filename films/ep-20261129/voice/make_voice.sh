#!/bin/sh
# Gemini TTS lines for Ep 12 "ख़ामोशी की क़ीमत (भाग 1)" (key in /root/.gemini_key or $GEMINI_API_KEY, never committed). Usage: sh make_voice.sh [id ...]
# v1/v2 = THE THING imitating Maa (same voice as Maa m1 = the clue); the mix makes it eerie (slowed, low, reverb).
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
MAA="Maa: a loving Indian mother in her fifties"
BROKER="The broker: a nervous middle-aged property broker, terrified of the flat"
KABIR="Kabir: a cheerful 25-year-old young man who just moved in"
ARGS="$*"
ok() { [ -z "$ARGS" ] && return 0; for w in $ARGS; do [ "$w" = "$1" ] && return 0; done; return 1; }
ok v1 && say v1 Gacrux "$MAA" "Style: soft, sweet, slow and strangely calm, calling her son through a closed door at night. Pace: slow." "कबीर बेटा… दरवाज़ा खोलो… मैं हूँ।"
ok b1 && say b1 Fenrir "$BROKER" "Style: a scared low voice, half whisper, trembling; say the number TEES (thirty) very clearly. Pace: slow." "रात को… तीस… डेसिबल से ज़्यादा आवाज़ मत करना।"
ok n1 && say n1 Sulafat "$NAR" "Style: mysterious, quiet, setting up the rule. Pace: medium-slow." "इस पुराने फ़्लैट के हर कमरे में एक साउंड मीटर लगा है… और एक ही नियम है।"
ok k1 && say k1 Iapetus "$KABIR" "Style: loud, happy, on speakerphone. Pace: medium." "हाँ माँ, पहुँच गया! बढ़िया फ़्लैट है!"
ok m1 && say m1 Gacrux "$MAA" "Style: warm, caring, on a phone call. Pace: medium." "खाना खा लेना बेटा।"
ok n2 && say n2 Sulafat "$NAR" "Style: calm, a little ominous. Pace: medium." "कबीर ने इसे मज़ाक समझा… और हेडफ़ोन लगाकर सो गया।"
ok n3 && say n3 Sulafat "$NAR" "Style: tense, quiet, then a sudden weight on the last words. Pace: medium." "रात सवा दो बजे… फ़ोन नीचे गिरा — और सुई पहली बार तीस के पार गई।"
ok n4 && say n4 Sulafat "$NAR" "Style: a frightened hush. Pace: slow." "तभी दीवार के पीछे से… लंबे नाख़ूनों से खुरचने की आवाज़ आई।"
ok n5 && say n5 Sulafat "$NAR" "Style: chilling, slow, almost a whisper. Pace: slow." "दरवाज़े की दरार से दिखा… बाहर कोई खड़ा था। उसके पैर उल्टे मुड़े हुए थे।"
ok n6 && say n6 Sulafat "$NAR" "Style: breathless tension. Pace: medium-slow." "कबीर ने मुँह दबा लिया… उसकी धड़कन से ही सुई उनतीस पर काँप रही थी।"
ok v2 && say v2 Gacrux "$MAA" "Style: sweet but slightly wrong, too slow, pleading through a door. Pace: slow." "बेटा… माँ हूँ… दरवाज़ा खोलो ना…"
ok n7 && say n7 Sulafat "$NAR" "Style: realisation, horror creeping in. Pace: medium." "पर माँ तो दूसरे शहर में थी… उस चीज़ ने शाम को फ़ोन पर माँ की आवाज़ सुन ली थी।"
ok n8 && say n8 Sulafat "$NAR" "Style: tense whisper. Pace: medium." "पीछे हटते ही… उसका पैर काँच के गिलास से टकराया।"
ok n9 && say n9 Sulafat "$NAR" "Style: dread, slow, the final chill. Pace: slow." "कबीर को लगा ख़तरा दरवाज़े के बाहर है… पर वो चीज़ अब कमरे के अंदर थी।"
ok n10 && say n10 Sulafat "$NAR" "Style: a soft creepy WHISPER with a hint of a smile. Pace: slow." "भाग 2 देखने के लिए… फ़ॉलो और सब्सक्राइब करो… पर धीरे से।"
