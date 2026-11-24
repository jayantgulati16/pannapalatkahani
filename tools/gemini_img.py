"""Gemini image: python gemini_img.py <out.png> <model> <aspect> <prompt> [ref images...]  (key: GEMINI_API_KEY or /root/.gemini_key)"""
import sys, json, base64, urllib.request, urllib.error, os, mimetypes
out, model, aspect, prompt, refs = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5:]
key = os.environ.get('GEMINI_API_KEY') or open('/root/.gemini_key').read().strip()
parts = [{"inline_data": {"mime_type": mimetypes.guess_type(r)[0] or 'image/png', "data": base64.b64encode(open(r, 'rb').read()).decode()}} for r in refs] + [{"text": prompt}]
body = {"contents": [{"parts": parts}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": aspect}}}
req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent", data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": key})
try: r = json.load(urllib.request.urlopen(req, timeout=300))
except urllib.error.HTTPError as e: print("HTTP", e.code, e.read().decode()[:600]); sys.exit(1)
for c in r.get('candidates', []):
    for p in c.get('content', {}).get('parts', []):
        d = p.get('inlineData') or p.get('inline_data')
        if d: open(out, 'wb').write(base64.b64decode(d['data'])); print("ok", out); sys.exit(0)
print("no image", json.dumps(r)[:600]); sys.exit(2)
