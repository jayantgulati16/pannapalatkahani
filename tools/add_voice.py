"""Lay Gemini voice lines over a finished music+foley mix, ducking the bed under them.
.venv/bin/python add_voice.py <bed.wav> <out.wav> <voice_dir> id@t [id@t ...]"""
import sys, os, numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt
bed_f, out_f, vd = sys.argv[1:4]
bed, SR = sf.read(bed_f, dtype='float32')
if bed.ndim == 1: bed = np.stack([bed, bed], 1)
N = len(bed); voice = np.zeros(N, np.float32); mask = np.zeros(N, np.float32)
hp = butter(2, 90, 'high', fs=SR, output='sos')
for spec in sys.argv[4:]:
    vid, t = spec.split('@'); t = float(t)
    x, sr = sf.read(os.path.join(vd, vid + '.wav'), dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR: x = resample_poly(x, SR, sr).astype(np.float32)
    x = sosfilt(hp, x).astype(np.float32); x = x / (np.abs(x).max() + 1e-9) * .8
    a = int(t * SR); b = min(N, a + len(x)); voice[a:b] += x[:b - a]; mask[a:b] = 1
k = int(.2 * SR); sm = np.convolve(mask, np.ones(k) / k, mode='same')
out = bed / (np.abs(bed).max() + 1e-9) * .8 * (1 - .55 * sm)[:, None] + voice[:, None] * 1.2
out = out / np.abs(out).max() * .85
sf.write(out_f, out, SR); print('ok', out_f, N / SR)
