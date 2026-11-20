"""Gemini TTS: .venv/bin/python gemini_tts.py <out.wav> <voiceName> <model> <prompt text>
Key from /root/.gemini_key (never committed). Writes 24 kHz mono 16-bit WAV."""
import sys, json, base64, wave, urllib.request, urllib.error, os
out, voice, model, text = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
key = (os.environ.get('GEMINI_API_KEY') or open('/root/.gemini_key').read()).strip()
body = {"contents": [{"parts": [{"text": text}]}],
        "generationConfig": {"responseModalities": ["AUDIO"],
                             "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}}}
req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
                             data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": key})
try:
    r = json.load(urllib.request.urlopen(req, timeout=180))
except urllib.error.HTTPError as e:
    print('HTTP', e.code, e.read().decode()[:700]); sys.exit(1)
part = r["candidates"][0]["content"]["parts"][0]["inlineData"]
pcm = base64.b64decode(part["data"])
if pcm[:4] == b'RIFF':
    open(out, 'wb').write(pcm); w = wave.open(out); print(out, part.get("mimeType"), round(w.getnframes() / w.getframerate(), 2), 's'); sys.exit(0)
rate = 24000
if 'rate=' in part.get("mimeType", ""): rate = int(part["mimeType"].split('rate=')[1].split(';')[0])
with wave.open(out, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(pcm)
print(out, part.get("mimeType"), round(len(pcm) / 2 / rate, 2), 's')
