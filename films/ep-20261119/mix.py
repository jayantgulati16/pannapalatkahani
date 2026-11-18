"""Score + foley + ambience for "पापा का मफ़लर" → out/mix.wav
A winter waltz-lullaby in 3/4 (beat 0.62 s, bar 1.86 s), G major with an E-minor "cold" colour.
Music box, ukulele, flute, clarinet, glockenspiel, woodblock. No voice.
Run from anywhere: .venv/bin/python films/ep-20261119/mix.py
"""
import sys, os, json
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '../..'))
sys.path.insert(0, LIB)
from core.audio import sampler as S, pluck as P
from core.audio.sfx import SR, add, bp, lp, hp, noise, brown, click, creak, thump, pop, rumble, whoosh

S.seed(11)
EVJ = json.load(open(os.path.join(HERE, 'events.json')))
DUR = EVJ['dur'] if isinstance(EVJ, dict) and 'dur' in EVJ else 48.5
EV = EVJ['ev'] if isinstance(EVJ, dict) and 'ev' in EVJ else (EVJ.get('EV') if isinstance(EVJ, dict) else EVJ)
N = int((DUR + 0.5) * SR)
rng = np.random.default_rng(7)
st = {k: np.zeros((N, 2), np.float32) for k in ['mbox', 'uke', 'flute', 'clar', 'glock', 'perc', 'foley', 'amb']}
BT = 0.62                            # one beat (3 per bar)
m = S.midi

def mbox(t, p, v=.6, pan=.1, g=1.0):
    add(st['mbox'], P.pluck('music_box', m(p) if isinstance(p, str) else p, None, v), t, g, pan)
def samp(k, inst, t, p, d, v=.6, pan=0., g=1., attack=0., release=None):
    add(st[k], S.note(inst, p, d, v, release=release, attack=attack), t, g, pan)
def uke(t, chord, v=.5, pan=-.2, g=1., spread=.02):
    for i, p in enumerate(chord): samp('uke', 'ukulele', t + i * spread, p, 1.0, v * (0.85 + 0.15 * (i == 0)), pan, g)
def glock(t, p, v=.5, pan=.2, g=1.):
    samp('glock', 'glockenspiel', t, p, 2.5, v, pan, g)
def wood(t, v=.6, pan=0., var='a'):
    add(st['perc'], S.hit('woodblock', var, v), t, 1.0, pan)
def flute(t, p, d, v=.42, pan=.15, g=.9):
    samp('flute', 'flute', t, p, d * 1.02, v, pan, g, attack=.05, release=.3)
def clar(t, p, d, v=.42, pan=-.15, g=.9, release=.25):
    samp('clar', 'clarinet', t, p, d, v, pan, g, attack=.03, release=release)

CH = {'G': ['D4', 'G4', 'B4', 'D5'], 'C': ['E4', 'G4', 'C5', 'E5'], 'D': ['D4', 'F#4', 'A4', 'D5'], 'Em': ['E4', 'G4', 'B4', 'E5'],
      'Am': ['E4', 'A4', 'C5', 'E5'], 'B7': ['D#4', 'F#4', 'A4', 'B4'], 'D7': ['D4', 'F#4', 'A4', 'C5']}
# the theme (original): three four-bar phrases of (pitch, start beat, length in beats)
PH = {
  'X': [('B4', 0, 1), ('D5', 1, 1), ('G5', 2, 1), ('F#5', 3, 2), ('E5', 5, 1), ('D5', 6, 1), ('E5', 7, 1), ('D5', 8, 1), ('B4', 9, 3)],
  'Y': [('C5', 0, 1), ('E5', 1, 1), ('A5', 2, 1), ('G5', 3, 2), ('F#5', 5, 1), ('E5', 6, 1), ('F#5', 7, 1), ('A5', 8, 1), ('G5', 9, 3)],
  'W': [('E5', 0, 1), ('G5', 1, 1), ('B5', 2, 1), ('A5', 3, 2), ('G5', 5, 1), ('F#5', 6, 1), ('E5', 7, 1), ('D#5', 8, 1), ('E5', 9, 3)],
}
HARM = {'X': ['G', 'D', 'G', 'G'], 'Y': ['C', 'G', 'D', 'G'], 'W': ['Em', 'Am', 'B7', 'Em']}
def phrase(name, t0, fn, bt=BT, trans=0, bars=4):
    for p, s, d in PH[name]:
        if s < bars * 3: fn(t0 + s * bt, m(p) + trans, d * bt)
def waltz(t0, chords, v=.4, bt=BT, light=False):
    """oom-pah-pah: low chord on 1, two light upper strums on 2 and 3"""
    for i, c in enumerate(chords):
        b = t0 + i * 3 * bt
        uke(b, CH[c], v, -.25)
        if not light: uke(b + bt, CH[c][1:], v * .45, -.15, spread=.012); uke(b + 2 * bt, CH[c][1:], v * .4, -.15, spread=.012)

# ===== A 0–4.8: the hook. A cold music-box fragment, then Papa's shiver (clarinet "brrr") =====
phrase('W', 0.15, lambda t, p, d: mbox(t, p, .55, .2), bars=2)
for i in range(9):                                     # brrr: a fast low clarinet wobble while his teeth chatter
    clar(2.25 + i * 0.13, 'E3' if i % 2 == 0 else 'F3', .14, .38, -.2, .8, release=.06)
clar(3.6, 'B2', 1.0, .3, -.2, .7, release=.4)
mbox(4.0, 'D#6', .45, .3); mbox(4.3, 'E6', .4, .3)

# ===== T 4.8–8.6: the title is written in the fog =====
for i, p in enumerate(['G5', 'B5', 'D6']): glock(5.2 + i * 0.6, p, .32, .3)
phrase('X', 5.3, lambda t, p, d: mbox(t, p, .5, .1), bars=2)
waltz(6.6, ['G'], .28, light=True)

# ===== B 8.6–17.5: the bus stop. Flute sings the theme over a ukulele waltz =====
B0 = 8.8
waltz(B0, ['G', 'D', 'G', 'G', 'Em'], .38)
phrase('X', B0, lambda t, p, d: flute(t, p - 12, d))
samp('clar', 'clarinet', B0, 'G2', 3.6, .22, -.3, .5, attack=.4, release=.5)
wood(10.0, .35, -.2, 'c')                             # the watch
for i, p in enumerate(['E5', 'G5', 'B5']): mbox(16.2 + i * BT, p, .4, .2)   # she notices his ears

# ===== C 17.5–22.9: she offers it back; he wraps her up; "I'm never cold" =====
C0 = 17.6
waltz(C0, ['C', 'G', 'D'], .3, light=True)
phrase('Y', C0, lambda t, p, d: clar(t, p - 12, d * 1.02, .4), bars=3)
for i, p in enumerate(['D6', 'C6', 'B5', 'A5', 'G5']): mbox(20.4 + i * 0.2, p, .38, .2)   # wrapping round and round
uke(21.9, CH['G'], .65, -.1, spread=.012); glock(21.9, 'G6', .45, .2); glock(22.1, 'B6', .45, .2)   # ta-daa
clar(22.25, 'D4', .5, .45, -.1, .9)

# ===== S 22.9–25.0: the sneeze. Music stops dead; then a sheepish "wah-wah" =====
for k, (p, tt) in enumerate([('A3', 24.15), ('G#3', 24.45), ('G3', 24.75)]): clar(tt, p, .28, .5, -.2, 1.0, release=.12)
clar(25.05, 'F#3', .5, .45, -.2, .9, release=.3)

# ===== D 25.0–33.5: the idea, the drawing, the magic =====
glock(25.0, 'G6', .6, .1); glock(25.08, 'D7', .5, .1)
for i, p in enumerate(['G5', 'A5', 'B5', 'C6', 'D6']): mbox(25.6 + i * 0.3, p, .42, .1)          # climbing up the bench
D0 = 27.4
waltz(D0, ['G', 'C', 'D', 'D7'], .3)
phrase('X', D0, lambda t, p, d: mbox(t, p, .52, .1), bars=3)
for i, p in enumerate(['G6', 'B6', 'D7', 'G7']): glock(30.8 + i * 0.07, p, .55, .15 * i - .2)   # it becomes real
uke(30.8, CH['G'], .7, -.1, spread=.012)
phrase('Y', 31.2, lambda t, p, d: flute(t, p - 12, d, .44), bars=2)
waltz(31.2, ['C', 'G'], .34)

# ===== E 33.5–38.5: she draws a sun; the fog melts =====
for i, p in enumerate(['G5', 'B5', 'D6', 'G6', 'B6', 'D7']): glock(33.9 + i * 0.24, p, .45, -.4 + i * .1)
E0 = 35.4
waltz(E0, ['G', 'D', 'C'], .4)
phrase('X', E0, lambda t, p, d: mbox(t, p, .6, .1), bars=3)
phrase('X', E0, lambda t, p, d: flute(t, p - 12, d, .36, -.1, .6), bars=3)

# ===== F 38.5–45.5: the bus; she waves; the last line. A slower reprise =====
F0 = 41.0
bts = BT * 1.08
waltz(F0 - 3 * bts, ['G'], .3, bt=bts, light=True)
waltz(F0, ['C', 'G', 'D7', 'G'], .32, bt=bts, light=True)
phrase('Y', F0, lambda t, p, d: flute(t, p - 12, d, .4), bt=bts)
samp('clar', 'clarinet', F0, 'C3', 3.5, .25, -.3, .5, attack=.4, release=.6)
samp('clar', 'clarinet', F0 + 6 * bts, 'D3', 3.5, .25, -.3, .5, attack=.4, release=.6)

# ===== Z 45.5–48.5: end card. The music box runs down on the theme's first bar =====
Z0 = 45.7
tt = Z0
for i, p in enumerate(['B4', 'D5', 'G5', 'F#5', 'G5']):
    mbox(tt, m(p) + 12 - 0.1 * max(0, i - 2), .5 - .05 * i, .1); tt += 0.4 + 0.1 * i
glock(Z0, 'G6', .35, .3); uke(Z0, CH['G'], .4, -.1, spread=.04)
samp('clar', 'clarinet', Z0, 'G2', 2.4, .25, -.3, .5, attack=.2, release=.8)

# ———————————————————— foley ————————————————————
def env(n, a=.004, r=.05):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e
def nz(x, v): return (x / (np.abs(x).max() + 1e-9) * v).astype(np.float32)
def crayon(d=1.0, v=1.0, rate=7.0):
    tt = np.arange(int(round(d * SR))) / SR
    x = bp(noise(d), 1400, 4200) * (.35 + .65 * np.abs(np.sin(np.pi * rate * tt)) ** 2)
    return nz(x * env(len(x), .02, .1), .12 * v)
def cloth(d=.35, v=1.0):
    tt = np.arange(int(round(d * SR))) / SR
    x = bp(noise(d), 300, 2400) * np.sin(np.pi * tt / d) ** 1.5 * (1 + .4 * np.sin(2 * np.pi * 13 * tt))
    return nz(x, .12 * v)
def breath(d=.6, v=1.0, lo=500, hi=2200):
    tt = np.arange(int(round(d * SR))) / SR
    x = bp(noise(d), lo, hi) * np.sin(np.pi * tt / d) ** 2
    return nz(x, .07 * v)
def inhale(d=.35, v=1.0):
    tt = np.arange(int(round(d * SR))) / SR
    x = bp(noise(d), 900, 3500) * (tt / d) ** 1.5
    return nz(x * env(len(x), .01, .03), .08 * v)
def sneeze(v=1.0):
    d = .5; tt = np.arange(int(round(d * SR))) / SR
    burst = bp(noise(d), 1500, 7000) * np.exp(-tt / .08) + lp(noise(d), 900) * np.exp(-tt / .05) * .8
    return nz(burst * env(len(burst), .002, .1), .45 * v)
def horn(v=1.0):
    d = .2; tt = np.arange(int(round(d * SR))) / SR
    out = []
    for f in (330, 415):
        x = np.sign(np.sin(2 * np.pi * f * tt)) * .5 + np.sin(2 * np.pi * f * 2 * tt) * .3
        out.append(lp(x, 1800) * env(len(tt), .01, .04)); out.append(np.zeros(int(.07 * SR)))
    return nz(np.concatenate(out), .22 * v)
def engine(d, k_fn, v=1.0):
    tt = np.arange(int(round(d * SR))) / SR
    x = lp(brown(d), 160)[:len(tt)] * (1 + .35 * np.sin(2 * np.pi * 21 * tt)) + lp(noise(d), 400)[:len(tt)] * .2
    return nz(x * k_fn(tt), .16 * v)
def hiss(d=.6, v=1.0):
    tt = np.arange(int(round(d * SR))) / SR
    return nz(hp(noise(d), 3000) * np.exp(-tt / .25) * env(len(tt), .01, .1), .08 * v)
def chirp(v=1.0):
    out = []; f0 = rng.uniform(3200, 4400)
    for k in range(rng.integers(2, 4)):
        d = rng.uniform(.05, .09); tt = np.arange(int(round(d * SR))) / SR
        fr = f0 * (1 + rng.uniform(.15, .35) * np.sin(np.pi * tt / d))
        out.append(np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.sin(np.pi * tt / d)); out.append(np.zeros(int(rng.uniform(.03, .07) * SR)))
    return (np.concatenate(out) * .04 * v).astype(np.float32)

F = st['foley']
for e in EV:
    t, ty, pan = e['t'], e['type'], e.get('pan', 0)
    if ty == 'chatter':
        for i in range(int(e['dur'] * 13)): add(F, click(2.6 + .3 * (i % 2), .22), t + i / 13 + rng.uniform(0, .01), 1.0, pan)
    elif ty == 'puff': add(F, breath(.6, .8), t, 1.0, pan)
    elif ty == 'write': add(F, crayon(e['dur'], 1.0, 6.0), t, 1.0, pan)
    elif ty == 'scribble': add(F, crayon(e['dur'], 1.1, 11.0), t, 1.0, pan)
    elif ty == 'tick': add(F, click(3.0, .3), t, 1.0, pan); add(F, click(3.0, .25), t + .5, 1.0, pan)
    elif ty == 'rub': add(F, breath(e['dur'], .9, 300, 1600), t, 1.0, pan)
    elif ty == 'cloth': add(F, cloth(.35, 1.0), t, 1.0, pan)
    elif ty == 'wrap':
        for i in range(3): add(F, cloth(.4, .9), t + i * .4, 1.0, pan + (-1) ** i * .1)
    elif ty == 'inhale': add(F, inhale(.32, 1.0), t, 1.0, -.2)
    elif ty == 'sneeze': add(F, sneeze(1.0), t, 1.0, pan)
    elif ty == 'hop': add(F, whoosh(.25, .35), t, .6, pan)
    elif ty == 'land': add(F, thump(.3, 110), t, .6, pan)
    elif ty == 'magic': add(F, pop(.5), t, .8, 0)
    elif ty == 'rays': add(F, crayon(e['dur'], .9, 14.0), t, 1.0, -.5)
    elif ty == 'clap':
        for i in range(4): add(F, click(1.4, .5), t + i * .2, 1.0, .2)
    elif ty == 'engine':
        d = e['dur']
        def kf(tt): s = lambda x: np.clip(x, 0, 1) ** 2 * (3 - 2 * np.clip(x, 0, 1)); return s(tt / 2.0) * (1 - .5 * s((tt - 2.2) / .6)) * (1 + .6 * s((tt - 5.7) / .8)) * (1 - s((tt - 6.6) / 1.4))
        add(F, engine(d, kf, 1.0), t, 1.0, -.2)
    elif ty == 'horn': add(F, horn(1.0), t, 1.0, .1)
    elif ty == 'brake': add(F, hiss(.6, 1.0), t, 1.0, .2)
    elif ty == 'depart': add(F, whoosh(1.2, .3), t + .6, .5, .5)

# ambience: a muffled foggy street; birds wake up once the sun comes out
A = st['amb']
street = lp(brown(DUR + .5), 300)[:N] * .03
A[:len(street), 0] += street; A[:len(street), 1] += street
for k in range(5): tt = rng.uniform(1.0, 33.0); add(A, chirp(rng.uniform(.3, .5)), tt, 1.0, rng.uniform(-.8, .8))
for k in range(14): tt = rng.uniform(35.8, 47.5); add(A, chirp(rng.uniform(.6, 1.0)), tt, 1.0, rng.uniform(-.8, .8))

# ———————————————————— mix ————————————————————
gains = {'mbox': 1.0, 'uke': 0.85, 'flute': 0.8, 'clar': 0.75, 'glock': 0.75, 'perc': 0.7, 'foley': 1.15, 'amb': 1.0}
out = np.zeros((N, 2), np.float32)
for k, g in gains.items(): out += st[k] * g
# the sneeze: the music bus stops dead just before it, and comes back with the "wah-wah"
mus = sum(st[k] * gains[k] for k in ['mbox', 'uke', 'flute', 'clar', 'glock', 'perc'])
duck = np.ones(N, np.float32); a, b = int(22.92 * SR), int(24.1 * SR); duck[a:b] = 0.05
ramp = int(.06 * SR); duck[a - ramp:a] = np.linspace(1, .05, ramp)
out = out - mus * (1 - duck)[:, None]
out = out[:int(DUR * SR)]
pk = np.abs(out).max(); out = out / pk * 0.8
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out, SR)
print('mix ok', out.shape, 'peak', pk)
