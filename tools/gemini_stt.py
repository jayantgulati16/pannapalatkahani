"""Transcribe a WAV with Gemini (speech check): python3 gemini_stt.py <file.wav> [model]"""
import os, sys, json, base64, urllib.request, urllib.error
f = sys.argv[1]; model = sys.argv[2] if len(sys.argv) > 2 else 'gemini-2.5-flash'
key = (os.environ.get('GEMINI_API_KEY') or open('/root/.gemini_key').read()).strip()
body = {"contents": [{"parts": [{"text": "One line only: exact transcript (Devanagari) | speech start-end seconds | speaker gender and tone | any mispronounced or extra words."},
                                {"inlineData": {"mimeType": "audio/wav", "data": base64.b64encode(open(f, 'rb').read()).decode()}}]}]}
req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent", data=json.dumps(body).encode(),
                             headers={"Content-Type": "application/json", "x-goog-api-key": key})
try:
    r = json.load(urllib.request.urlopen(req, timeout=180))
except urllib.error.HTTPError as e:
    print("HTTP", e.code, e.read().decode()[:400]); sys.exit(1)
print(r["candidates"][0]["content"]["parts"][0]["text"])
