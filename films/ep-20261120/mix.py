"""Score + foley + Gemini voice for "अर्जुन का डांस" → out/mix.wav
A sangeet-night groove at 120 bpm (beat 0.5 s) in D: a dhol pattern (darbuka doom/tak + frame drum), claps, tambourine,
accordion (harmonium colour), oboe (shehnai colour), flute, glockenspiel and music box. Original melody.
Voice: Gemini TTS lines in voice/<id>.wav (narrator Sulafat, Arjun Achird, Meera Leda), placed by the 'voice' events.
Run from anywhere: .venv/bin/python films/ep-20261120/mix.py
"""
import sys, os, json
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '../..'))
sys.path.insert(0, LIB)
from core.audio import sampler as S, pluck as P
from core.audio.sfx import SR, add, bp, lp, hp, noise, brown, click, thump, pop, whoosh, ding

S.seed(13)
EVJ = json.load(open(os.path.join(HERE, 'events.json')))
DUR = EVJ['dur'] if isinstance(EVJ, dict) and 'dur' in EVJ else 46.0
EV = EVJ['ev'] if isinstance(EVJ, dict) and 'ev' in EVJ else (EVJ.get('EV') if isinstance(EVJ, dict) else EVJ)
N = int((DUR + 0.5) * SR)
rng = np.random.default_rng(5)
st = {k: np.zeros((N, 2), np.float32) for k in ['dhol', 'perc', 'acc', 'mel', 'glock', 'foley', 'amb', 'voice']}
BT = 0.5
m = S.midi
D0 = 26.4

def samp(k, inst, t, p, d, v=.6, pan=0., g=1., attack=0., release=None):
    add(st[k], S.note(inst, p, d, v, release=release, attack=attack), t, g, pan)
def hit(k, inst, var, t, v=.6, pan=0., g=1.):
    add(st[k], S.hit(inst, var, v), t, g, pan)
def mbox(t, p, v=.5, pan=.1):
    add(st['glock'], P.pluck('music_box', m(p) if isinstance(p, str) else p, None, v), t, 1.0, pan)
def glock(t, p, v=.5, pan=.2): samp('glock', 'glockenspiel', t, p, 2.2, v, pan)
def acc(t, chord, d, v=.32, pan=-.15): [samp('acc', 'accordion', t + i * .012, p, d, v, pan, 1.0, attack=.03, release=.2) for i, p in enumerate(chord)]
def oboe(t, p, d, v=.45, pan=.1): samp('mel', 'oboe', t, p, d * 1.02, v, pan, 1.0, attack=.02, release=.15)
def flute(t, p, d, v=.42, pan=.2): samp('mel', 'flute', t, p, d * 1.02, v, pan, .9, attack=.04, release=.25)
def clar(t, p, d, v=.42, pan=-.1, release=.12): samp('mel', 'clarinet', t, p, d, v, pan, .9, attack=.02, release=release)

CH = {'D': ['D4', 'F#4', 'A4'], 'G': ['D4', 'G4', 'B4'], 'A': ['C#4', 'E4', 'A4'], 'Bm': ['D4', 'F#4', 'B4'], 'C': ['C4', 'E4', 'G4'], 'Em': ['E4', 'G4', 'B4']}

# the dhol: "dha – ge – na – dhin" on eighths (doom = low, tak = high slap), a frame-drum backbeat
def dhol_bar(t0, v=.6, fill=False):
    pat = [('doom', 0, 1.0), ('tak', 1, .55), ('tak', 1.5, .45), ('doom', 2, .85), ('doom', 2.5, .5), ('tak', 3, .7), ('tak', 3.5, .5)]
    if fill: pat = [('tak', i * .25, .4 + .1 * (i % 2)) for i in range(16)]
    for k, b, vv in pat:
        hit('dhol', 'world_perc', 'darbuka_' + k, t0 + b * BT, v * vv, -.05 if k == 'doom' else .1)
    hit('dhol', 'frame_drum', 'large', t0, v * .7, 0); hit('dhol', 'frame_drum', 'small', t0 + 2 * BT, v * .5, .05)
def groove(t0, bars, v=.6, claps=True, tamb=True, fill_last=False):
    for i in range(bars):
        b = t0 + i * 4 * BT
        dhol_bar(b, v, fill=fill_last and i == bars - 1)
        if claps: [hit('perc', 'claps', 'group', b + k * BT, .45, .15 * (-1) ** k) for k in (1, 3)]
        if tamb: [hit('perc', 'tambourine', None, b + k * BT / 2, .22 + .1 * (k % 2), .3) for k in range(8)]

# the theme (original): a bouncy pentatonic hook in D, (pitch, start beat, beats)
TH = [('A4', 0, .5), ('B4', .5, .5), ('D5', 1, 1), ('B4', 2, .5), ('A4', 2.5, .5), ('F#4', 3, 1),
      ('A4', 4, .5), ('B4', 4.5, .5), ('D5', 5, .5), ('E5', 5.5, .5), ('F#5', 6, 1.5), ('E5', 7.5, .5),
      ('D5', 8, .5), ('E5', 8.5, .5), ('F#5', 9, 1), ('E5', 10, .5), ('D5', 10.5, .5), ('B4', 11, 1),
      ('A4', 12, .5), ('B4', 12.5, .5), ('D5', 13, 1), ('E5', 14, 1), ('D5', 15, 1)]
HARM = ['D', 'G', 'A', 'D']
def theme(t0, fn, trans=0, beats=16):
    for p, s, d in TH:
        if s < beats: fn(t0 + s * BT, m(p) + trans, d * BT)
def chords(t0, seq, v=.3, bar=4):
    for i, c in enumerate(seq): acc(t0 + i * bar * BT, CH[c], bar * BT * .95, v)

# ===== A 0–3.4: the hook. A harmonium "dun-dun-DUN" while the circle is drawn; boing on his eyes =====
acc(0.05, CH['D'], .35, .4); acc(0.45, CH['D'], .35, .4); acc(0.85, ['C#4', 'F4', 'A#4'], 1.6, .45)
clar(1.1, 'D3', .2, .4); clar(1.35, 'C#3', .2, .4); clar(1.6, 'C3', .8, .38, release=.3)
for i, p in enumerate(['A5', 'G5', 'E5', 'C#5']): mbox(2.0 + i * .18, p, .38)

# ===== T 3.4–6.0: the title; the band warms up =====
for i, p in enumerate(['D5', 'F#5', 'A5', 'D6']): glock(3.4 + i * .35, p, .35, .25)
groove(4.0, 1, .4, claps=False, tamb=False)

# ===== B 6.0–13.35: the band plays on while Arjun tries (light groove, oboe theme, comic clarinet on the falls) =====
B0 = 6.0
groove(B0, 3, .45, claps=False)
chords(B0, ['D', 'G', 'A'], .22)
theme(B0, lambda t, p, d: oboe(t, p, d, .36), beats=12)
for i, p in enumerate(['A3', 'G#3', 'G3', 'F#3']): clar(10.0 + i * .22, p, .22, .45)   # wah-wah-wah after the fall
B1 = B0 + 12 * BT
groove(B1, 1, .4, claps=False)
for i in range(8): clar(11.6 + i * .12, 'E4' if i % 2 else 'G4', .12, .32, .1)       # the spin: a dizzy trill
clar(12.6, 'B3', .4, .35); clar(12.9, 'A#3', .4, .35)

# ===== S 13.35–15.9: needle scratch, music stops; only the room and his line =====

# ===== C 15.9–20.0: the idea; a hushed harmonium, glock sparkle =====
acc(16.6, CH['Bm'], 1.9, .22); acc(18.6, CH['G'], 1.4, .22)
for i, p in enumerate(['D6', 'F#6', 'A6']): glock(17.4 + i * .12, p, .42, .3)

# ===== D 20.0–26.4: the crayon draws the footprints; a music-box run per pair, frame drum builds to the dance =====
for i in range(5):
    t0 = 20.6 + i * .72
    for k, p in enumerate(['D5', 'F#5', 'A5'] if i < 4 else ['A5', 'D6', 'F#6']): mbox(t0 + k * .2, m(p) + 2 * i if i < 4 else p, .4, -.2 + i * .1)
acc(20.0, CH['D'], 2.0, .2); acc(22.0, CH['G'], 2.0, .2); acc(24.0, CH['A'], 2.4, .24)
for i in range(16): hit('dhol', 'frame_drum', 'small', 24.4 + i * .125, .15 + .4 * i / 16, 0)   # roll into the dance
hit('dhol', 'world_perc', 'darbuka_doom', 26.3, .7, 0)

# ===== E 26.4–30.8: the dance: full groove, a glock note rising on every lit footprint =====
groove(D0, 2, .65)
chords(D0, ['D', 'G'], .3)
theme(D0, lambda t, p, d: flute(t, p, d, .34), beats=8)

# ===== F 30.8–37.2: the bhangra together: everything, shehnai theme, cheering =====
F0 = 30.4
groove(F0, 3, .75, fill_last=True)
chords(F0, ['D', 'G', 'A'], .34)
theme(F0, lambda t, p, d: oboe(t, p + 12, d, .5, .05))
theme(F0, lambda t, p, d: flute(t, p, d, .3, .25), beats=12)
hit('perc', 'crash', None, F0, .4, 0)

# ===== G 36.4–42.6: soft outro under the narrator: harmonium + flute, a gentle dhol =====
G0 = 36.4
groove(G0, 3, .32, claps=False, tamb=False)
chords(G0, ['D', 'G', 'A'], .2)
theme(G0 + 4 * BT, lambda t, p, d: flute(t, p, d, .26, .2), beats=8)

# ===== Z 42.6–46: end card: dha-dhin, music box =====
Z0 = 42.6
acc(Z0, CH['D'], 3.0, .28)
for i, p in enumerate(['A5', 'B5', 'D6', 'F#6', 'D6']): mbox(Z0 + .2 + i * .32, p, .45)
hit('dhol', 'world_perc', 'darbuka_doom', Z0, .7, 0); hit('dhol', 'world_perc', 'darbuka_tak', Z0 + .25, .5, .1); hit('dhol', 'world_perc', 'darbuka_doom', Z0 + .5, .8, 0)
glock(45.0, 'D6', .35)

# ———————————————————— foley ————————————————————
def env(n, a=.004, r=.05):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e
def nz(x, v): return (x / (np.abs(x).max() + 1e-9) * v).astype(np.float32)
def tt_(d): return np.arange(int(round(d * SR))) / SR
def crayon(d=1.0, v=1.0, rate=7.0):
    tt = tt_(d); x = bp(noise(d), 1400, 4200) * (.35 + .65 * np.abs(np.sin(np.pi * rate * tt)) ** 2)
    return nz(x * env(len(x), .02, .1), .12 * v)
def boing(v=1.0):
    d = .45; tt = tt_(d); f = 180 + 240 * np.exp(-tt / .08) + 40 * np.sin(2 * np.pi * 14 * tt) * np.exp(-tt / .2)
    return nz(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / .18), .22 * v)
def paper(v=1.0):
    d = .5; tt = tt_(d); x = bp(noise(d), 800, 5000) * (.3 + .7 * np.abs(np.sin(np.pi * 18 * tt))) * np.sin(np.pi * tt / d)
    return nz(x, .08 * v)
def laugh(d=1.0, v=1.0):        # a small crowd giggle: amplitude-modulated, formant-shaped noise
    tt = tt_(d); x = np.zeros(len(tt))
    for k in range(6):
        f0, ph = rng.uniform(4.5, 6.5), rng.uniform(0, 6)
        am = np.clip(np.sin(2 * np.pi * f0 * tt + ph), 0, 1) ** 2 * np.sin(np.pi * np.clip(tt / d, 0, 1)) ** .6
        x += bp(noise(d), rng.uniform(500, 800), rng.uniform(1200, 2200)) * am
    return nz(x, .1 * v)
def cheer(d=5.0, v=1.0):
    tt = tt_(d); sw = np.clip(tt / .6, 0, 1) * np.clip((d - tt) / 1.5, 0, 1)
    x = bp(noise(d), 400, 3000) * (0.7 + .3 * np.sin(2 * np.pi * 2 * tt)) * sw
    return nz(x, .07 * v)
def scratch(v=1.0):
    d = .55; tt = tt_(d); f = 900 * (1 - .8 * tt / d)
    x = bp(noise(d), 600, 3500) * (.5 + .5 * np.sin(2 * np.pi * np.cumsum(f / 60) / SR * 60)) * np.exp(-tt / .25)
    return nz(x * env(len(x), .005, .05), .2 * v)
def sparkle(d=1.2, v=1.0):
    out = np.zeros(int(d * SR) + 8000)
    for k in range(10):
        f = rng.uniform(2500, 5500); dd = .12; tt = tt_(dd); s = np.sin(2 * np.pi * f * tt) * np.exp(-tt / .04)
        i = int(rng.uniform(0, d) * SR); out[i:i + len(s)] += s
    return nz(out, .05 * v)

F = st['foley']
STEP_P = ['D5', 'E5', 'F#5', 'A5', 'D6']
for e in EV:
    t, ty, pan = e['t'], e['type'], e.get('pan', 0)
    if ty == 'write': add(F, crayon(e['dur'], 1.0, 6.0), t, 1.0, pan)
    elif ty == 'boing': add(F, boing(1.0), t, 1.0, -.1)
    elif ty == 'paper': add(F, paper(1.0), t, 1.0, pan)
    elif ty == 'land': add(F, thump(.3, 120), t, .6, pan)
    elif ty == 'whoosh': add(F, whoosh(.3, .4), t, .7, pan)
    elif ty == 'fall': add(F, thump(.9, 70), t, 1.0, pan); add(F, whoosh(.25, .3), t - .2, .5, pan)
    elif ty == 'laugh': add(st['amb'], laugh(e['dur'], 1.0), t, 1.0, 0)
    elif ty == 'tink': add(F, click(4.0, .4), t, 1.0, pan); glock(t, 'A6', .25, pan)
    elif ty == 'spin': add(F, whoosh(e['dur'], .35), t, .7, pan)
    elif ty == 'dizzy': [glock(t + i * .15, p, .2, .2) for i, p in enumerate(['E6', 'C6', 'E6', 'C6'])]
    elif ty == 'scratch': add(F, scratch(1.0), t, 1.0, 0)
    elif ty == 'ding': add(F, ding(.5), t, .8, .2)
    elif ty == 'pop': add(F, pop(.4), t, .7, pan)
    elif ty == 'catch': add(F, click(1.6, .5), t, 1.0, pan)
    elif ty == 'step':
        n = e.get('n', 0); add(F, thump(.35, 110), t, .6, pan); glock(t, STEP_P[min(n, 4)], .5, pan); add(F, sparkle(.4, .7), t, 1.0, pan)
    elif ty == 'cheer': add(st['amb'], cheer(e['dur'], 1.0), t, 1.0, 0)
    elif ty == 'sparkle': add(F, sparkle(e['dur'], 1.0), t, 1.0, .2)

# ambience: a wedding tent at night: low murmur of guests, a distant generator hum
A = st['amb']
mur = bp(noise(DUR + .5), 250, 1800)[:N] * .012 * (1 + .3 * np.sin(2 * np.pi * .3 * np.arange(N) / SR))
A[:len(mur), 0] += mur; A[:len(mur), 1] += mur * .95

# ———————————————————— voice (Gemini TTS) ————————————————————
V = st['voice']
vmask = np.zeros(N, np.float32)
for e in EV:
    if e['type'] != 'voice': continue
    f = os.path.join(HERE, 'voice', e['id'] + '.wav')
    x, sr = sf.read(f, dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR: x = resample_poly(x, SR, sr).astype(np.float32)
    x = hp(x, 90).astype(np.float32)
    x = x / (np.abs(x).max() + 1e-9) * .8
    add(V, x, e['t'], 1.0, -.05 if e['who'] == 'A' else .05 if e['who'] == 'M' else 0)
    a = int(e['t'] * SR); vmask[a:a + len(x)] = 1
# duck the music and the foley under the voice (smoothed)
k = int(.15 * SR); sm = np.convolve(vmask, np.ones(k) / k, mode='same')
duck = 1 - .55 * sm

# ———————————————————— mix ————————————————————
gains = {'dhol': .9, 'perc': .7, 'acc': .8, 'mel': .85, 'glock': .8, 'foley': 1.1, 'amb': 1.0}
mus = sum(st[k] * gains[k] for k in ['dhol', 'perc', 'acc', 'mel', 'glock'])
# the needle scratch: the band stops dead and comes back at the idea
cut = np.ones(N, np.float32); a, b = int(13.45 * SR), int(16.5 * SR); cut[a:b] = 0.0
r = int(.05 * SR); cut[a - r:a] = np.linspace(1, 0, r)
out = mus * (cut * duck)[:, None] + (st['foley'] * gains['foley'] + st['amb']) * (1 - .3 * sm)[:, None] + st['voice'] * 1.25
out = out[:int(DUR * SR)]
pk = np.abs(out).max(); out = out / pk * 0.85
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out, SR)
print('mix ok', out.shape, 'peak', pk)
