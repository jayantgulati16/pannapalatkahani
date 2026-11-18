"""Score + foley + ambience for "बारिश वाली चिट्ठी" → out/mix.wav
6/8 at 96 (dotted quarter = 0.625 s, bar = 1.25 s), D major. Music box, ukulele, flute, clarinet, glockenspiel, woodblock. No voice.
Run from anywhere: .venv/bin/python films/baarish-wali-chitthi/mix.py
"""
import sys, os, json
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '../..'))
sys.path.insert(0, LIB)
from core.audio import sampler as S, pluck as P
from core.audio.sfx import SR, add, bp, lp, hp, noise, brown, click, creak, thump, pop, rumble, whoosh, compress, limit

S.seed(5)
EVJ = json.load(open(os.path.join(HERE, 'events.json')))
DUR = EVJ['dur'] if isinstance(EVJ, dict) and 'dur' in EVJ else 61.5
EV = EVJ['ev'] if isinstance(EVJ, dict) and 'ev' in EVJ else (EVJ.get('EV') if isinstance(EVJ, dict) else EVJ)
N = int((DUR + 0.5) * SR)
rng = np.random.default_rng(3)
st = {k: np.zeros((N, 2), np.float32) for k in ['mbox', 'uke', 'flute', 'clar', 'glock', 'perc', 'foley', 'amb', 'rain']}
E8 = 0.625 / 3                       # an eighth note
m = S.midi

def mbox(t, p, v=.6, pan=.1, g=1.0):
    add(st['mbox'], P.pluck('music_box', m(p) if isinstance(p, str) else p, None, v), t, g, pan)
def samp(k, inst, t, p, d, v=.6, pan=0., g=1., attack=0., release=None):
    add(st[k], S.note(inst, p, d, v, release=release, attack=attack), t, g, pan)
def uke(t, chord, v=.5, pan=-.2, g=1., spread=.018, up=False):
    notes = chord[::-1] if up else chord
    for i, p in enumerate(notes): samp('uke', 'ukulele', t + i * spread, p, 1.1, v * (0.85 + 0.15 * (i == 0)), pan, g)
def glock(t, p, v=.5, pan=.2, g=1.):
    samp('glock', 'glockenspiel', t, p, 2.5, v, pan, g)
def wood(t, v=.6, pan=0., var='a'):
    add(st['perc'], S.hit('woodblock', var, v), t, 1.0, pan)

CH = {'D': ['D4', 'F#4', 'A4', 'D5'], 'Bm': ['D4', 'F#4', 'B4', 'D5'], 'G': ['D4', 'G4', 'B4', 'D5'], 'A': ['C#4', 'E4', 'A4', 'C#5'],
      'Em': ['E4', 'G4', 'B4', 'E5'], 'A7': ['C#4', 'E4', 'G4', 'A4']}
# the theme: four two-bar phrases (pitch, start eighth, length in eighths)
PH = {
  'A': [('F#5', 0, 2), ('E5', 2, 1), ('D5', 3, 2), ('E5', 5, 1), ('F#5', 6, 3), ('A5', 9, 3)],
  'B': [('B5', 0, 2), ('A5', 2, 1), ('F#5', 3, 2), ('E5', 5, 1), ('D5', 6, 3), ('E5', 9, 3)],
  'C': [('F#5', 0, 2), ('A5', 2, 1), ('B5', 3, 2), ('A5', 5, 1), ('F#5', 6, 2), ('E5', 8, 1), ('D5', 9, 3)],
}
HARM = {'A': ['D', 'Bm'], 'B': ['G', 'A'], 'C': ['G', 'D']}
def phrase(name, t0, fn, e8=E8, trans=0):
    for p, s, d in PH[name]: fn(t0 + s * e8, m(p) + trans, d * e8)
def strum_bars(t0, chords, v=.42, e8=E8, light=False):
    """6/8 lilt: a strum on 1 and 4, soft upstroke on 3 and 6"""
    for i, c in enumerate(chords):
        b = t0 + i * 6 * e8
        uke(b, CH[c], v, -.25); uke(b + 3 * e8, CH[c], v * .8, -.25)
        if not light: uke(b + 2 * e8, CH[c][1:], v * .45, -.15, up=True); uke(b + 5 * e8, CH[c][1:], v * .45, -.15, up=True)

# ===== A 0–5.2: the hook. A music-box fragment that stops on a question =====
phrase('A', 0.15, lambda t, p, d: mbox(t, p, .55, .15))
mbox(2.55, 'B5', .5, .15); mbox(2.55 + 2 * E8, 'C#6', .5, .15)       # unresolved: leans on the leading tone
add(st['clar'], S.note('clarinet', 'A3', .5, .5, release=.3), 3.2, .9, -.2)          # "huh?" — a small clarinet lift
samp('clar', 'clarinet', 3.45, 'D4', .7, .5, -.2, .9, release=.4)

# ===== T 5.2–9.6: the title is written; music box + glock, uke enters =====
phrase('A', 5.3, lambda t, p, d: mbox(t, p, .5, .1))
phrase('B', 7.8, lambda t, p, d: mbox(t, p, .5, .1))
for i, p in enumerate(['D6', 'F#6', 'A6']): glock(6.2 + i * 0.6, p, .35, .3)
strum_bars(7.8, ['G', 'A'], .3, light=True)

# ===== B 9.6–19.0: the lane. Flute sings the theme over a ukulele lilt =====
B0 = 9.6
strum_bars(B0, ['D', 'Bm', 'G', 'A', 'D', 'Bm', 'G', 'D'], .4)
for k, nm in enumerate('ABAC'):
    phrase(nm, B0 + k * 12 * E8, lambda t, p, d: samp('flute', 'flute', t, p - 12, d * 1.05, .42, .15, .9, attack=.05, release=.3))
samp('clar', 'clarinet', B0, 'D3', 2.4, .25, -.3, .5, attack=.4, release=.5)
samp('clar', 'clarinet', B0 + 5, 'G3', 2.4, .25, -.3, .5, attack=.4, release=.5)

# ===== C 19.0–26.5: Arjun. A shy clarinet line, uke softer =====
C0 = 19.0
strum_bars(C0, ['Bm', 'G', 'D', 'A', 'Bm', 'G'], .3, light=True)
shy = [('F#4', 0, 3), ('A4', 3, 2), ('B4', 5, 1), ('A4', 6, 6), ('F#4', 12, 2), ('E4', 14, 1), ('D4', 15, 3), ('E4', 18, 6)]
for p, s, d in shy: samp('clar', 'clarinet', C0 + 0.6 + s * E8, p, d * E8 * 1.05, .42, -.1, .9, attack=.04, release=.25)
mbox(23.75, 'A6', .45, .4)                                        # clip!
samp('flute', 'flute', 24.3, 'D5', 1.6, .3, .2, .7, attack=.2, release=.4)

# ===== D 26.5–35.0: the gag of blank notes =====
D0 = 26.5
for tt in (27.25, 29.55): wood(tt, .7, -.2, 'a'); wood(tt + E8, .5, -.1, 'b')
for tt in (27.6, 29.8): mbox(tt, 'D6', .5, -.1); mbox(tt + E8, 'E6', .45, -.1)      # opening… (and?)
samp('clar', 'clarinet_stac', 28.0, 'F4', .3, .6, -.2, 1.0); samp('clar', 'clarinet_stac', 28.25, 'E4', .3, .55, -.2, 1.0)   # blank.
# blank again: a falling clarinet "wah-wah"
for k, (p, tt) in enumerate([('F4', 30.0), ('E4', 30.3), ('D#4', 30.6)]): samp('clar', 'clarinet', tt, p, .28, .55, -.2, 1.0, release=.12)
samp('clar', 'clarinet', 30.9, 'D4', .7, .5, -.2, 1.0, release=.3)
wood(31.05, .5, .2, 'c'); wood(31.3, .5, .2, 'c')                 # shrug
strum_bars(26.5, ['D', 'Bm'], .28, light=True)
strum_bars(31.5, ['G', 'A'], .26, light=True)
# she secretly likes it: a music-box phrase, softer, slowing
phrase('A', 32.4, lambda t, p, d: mbox(t, p, .4, .1), e8=E8 * 1.1)

# ===== S 35.0–37.5: silence before the rain (thunder and a first drop are foley) =====

# ===== E 37.5–46.0: the wash. Glock on every revealed word, then the full theme =====
glints = sorted([e for e in EV if e['type'] == 'glint'], key=lambda e: e['t'])
for e, p in zip(glints, ['D6', 'F#6', 'A6']): glock(e['t'], p, .65, e.get('pan', 0) * .6); mbox(e['t'], m(p) + 12, .4, e.get('pan', 0) * .6)
for i, p in enumerate(['A5', 'B5', 'D6']): mbox(37.6 + i * 0.42, p, .35, -.2)
E0 = 40.6
for k, nm in enumerate('ABAC'):
    phrase(nm, E0 + k * 12 * E8, lambda t, p, d: mbox(t, p, .62, .1))
    phrase(nm, E0 + k * 12 * E8, lambda t, p, d: samp('flute', 'flute', t, p - 12, d, .3, -.15, .55, attack=.08, release=.3))
strum_bars(E0, ['D', 'Bm', 'G', 'A', 'D', 'Bm', 'G', 'D'], .32)
samp('clar', 'clarinet', E0, 'D3', 4.8, .3, -.3, .55, attack=.5, release=.6)
samp('clar', 'clarinet', E0 + 5, 'G3', 4.6, .3, -.3, .55, attack=.5, release=.6)

# ===== F 46.0–52.5: her answer. Uke on "हाँ", a held breath, then joy =====
uke(47.6, CH['D'], .7, -.1); uke(47.6 + 3 * E8, CH['D'], .5, -.1)
for i, p in enumerate(['D5', 'E5', 'F#5', 'A5']): mbox(48.95 + i * 0.22, p, .45, -.3 + i * .2)     # the note travels back
# 50.65–51.0: held breath (nothing new) — 51.0 the jump
for i, p in enumerate(['D6', 'F#6', 'A6', 'D7']): glock(51.0 + i * 0.07, p, .6, .1 * i)
uke(51.0, CH['D'], .8, -.1, spread=.012); uke(51.0 + 3 * E8, CH['D'], .6, -.1)
strum_bars(51.0 + 6 * E8, ['G', 'A'], .45)

# ===== G 52.5–61.5: chai. A slower reprise, then the music box winds down =====
G0 = 52.6
e8s = E8 * 1.08
strum_bars(G0, ['D', 'Bm', 'G', 'A', 'D', 'Bm'], .32, e8=e8s, light=True)
phrase('A', G0, lambda t, p, d: samp('flute', 'flute', t, p - 12, d, .36, .15, .8, attack=.06, release=.35), e8=e8s)
phrase('B', G0 + 12 * e8s, lambda t, p, d: samp('flute', 'flute', t, p - 12, d, .34, .15, .8, attack=.06, release=.35), e8=e8s)
phrase('C', G0 + 24 * e8s, lambda t, p, d: mbox(t, p, .55, .1), e8=e8s * 1.12)
# final cadence and a music box running down (each note later and a little flatter)
fin = 59.6
uke(fin, CH['D'], .5, -.1, spread=.04)
samp('clar', 'clarinet', fin, 'D3', 1.9, .3, -.3, .55, attack=.2, release=.8)
tt = fin + 0.1
for i, p in enumerate(['A5', 'F#5', 'E5', 'D5']):
    mbox(tt, m(p) - 0.12 * i, .45 - .06 * i, .1); tt += 0.32 + 0.12 * i
glock(fin + 0.1, 'D6', .35, .3)

# ———————————————————— foley ————————————————————
def env(n, a=.004, r=.05):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e
def squeak_one(v=1.0, f=2100):
    d = .11; tt = np.arange(int(round(d * SR))) / SR
    fr = f * (1 + .25 * np.sin(np.pi * tt / d)) + 60 * np.sin(2 * np.pi * 37 * tt)
    x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-((tt - d / 2) / (d / 3)) ** 2)
    x += bp(noise(d), 1500, 4000) * .15 * np.exp(-((tt - d / 2) / (d / 3)) ** 2)
    return (x * .12 * v).astype(np.float32)
def paper(d=.35, v=1.0, lo=900, hi=6500):
    x = bp(noise(d), lo, hi)
    k = np.zeros(len(x)); idx = rng.integers(0, len(x), int(d * 90)); k[idx] = rng.uniform(.4, 1, len(idx))
    k = np.convolve(k, np.exp(-np.arange(int(.01 * SR)) / (.002 * SR)), 'same')
    x = x * (.25 + k) * env(len(x), .01, .08)
    return (x / (np.abs(x).max() + 1e-9) * .22 * v).astype(np.float32)
def crayon(d=1.0, v=1.0, rate=7.0):
    tt = np.arange(int(round(d * SR))) / SR
    x = bp(noise(d), 1400, 4200) * (.35 + .65 * np.abs(np.sin(np.pi * rate * tt)) ** 2)
    x *= (1 + .5 * (rng.random(len(x)) < .002))
    return (x / (np.abs(x).max() + 1e-9) * .12 * v * env(len(x), .02, .1)).astype(np.float32)
def plink(f=1300, v=1.0):
    d = .35; tt = np.arange(int(round(d * SR))) / SR
    x = np.sin(2 * np.pi * (f + 900 * np.exp(-tt / .01)) * tt) * np.exp(-tt / .06)
    return (x * .25 * v).astype(np.float32)
def slurp(v=1.0):
    d = .45; tt = np.arange(int(round(d * SR))) / SR
    x = bp(noise(d), 700, 2600) * np.sin(np.pi * tt / d) ** 2 * (1 + .6 * np.sin(2 * np.pi * 22 * tt))
    return (x / (np.abs(x).max() + 1e-9) * .15 * v).astype(np.float32)
def brush(d, v=1.0):
    tt = np.arange(int(round(d * SR))) / SR
    x = lp(noise(d), 1800) * (.6 + .4 * np.sin(np.pi * tt / d)) + bp(noise(d), 2500, 6000) * .15 * (rng.random(len(tt)) < .02)
    return (x / (np.abs(x).max() + 1e-9) * .06 * v * env(len(x), .15, .3)).astype(np.float32)
def chirp(v=1.0):
    out = []
    f0 = rng.uniform(3200, 4400)
    for k in range(rng.integers(2, 4)):
        d = rng.uniform(.05, .09); tt = np.arange(int(round(d * SR))) / SR
        fr = f0 * (1 + rng.uniform(.15, .35) * np.sin(np.pi * tt / d))
        out.append(np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.sin(np.pi * tt / d)); out.append(np.zeros(int(rng.uniform(.03, .07) * SR)))
    return (np.concatenate(out) * .05 * v).astype(np.float32)

F = st['foley']
for e in EV:
    t, ty, pan = e['t'], e['type'], e.get('pan', 0)
    if ty == 'squeak':
        n = max(1, int(e['dur'] / .2))
        for i in range(n): add(F, squeak_one(.9 if i % 2 else .7, 2000 + (i % 2) * 260), t + i * .2, 1.0, pan)
    elif ty in ('unclip', 'clip'): add(F, click(1.6 if ty == 'clip' else 1.3, .5), t, 1.0, pan); add(F, click(2.0, .3), t + .04, 1.0, pan)
    elif ty in ('unfold', 'fold'): add(F, paper(.32 if ty == 'unfold' else .22, .9), t, 1.0, pan)
    elif ty == 'rustle': add(F, paper(.5, 1.0, 600, 5000), t, 1.0, pan)
    elif ty == 'write': add(F, crayon(e['dur'], 1.0, 6.0), t, 1.0, pan)
    elif ty == 'scribble': add(F, crayon(e['dur'], 1.1, 11.0), t, 1.0, pan)
    elif ty == 'tug': add(F, thump(.25, 120), t, .6, pan); add(F, squeak_one(.7, 1700), t + .02, 1.0, pan)
    elif ty == 'thunder': add(F, rumble(2.8, 1.0), t, 0.3, -.3)
    elif ty == 'drop': add(F, plink(1400, 1.0), t, 1.0, pan)
    elif ty == 'brush': add(F, brush(e['dur'], 1.0), t, 1.0, -.4 * e.get('dir', 1))
    elif ty == 'pop': add(F, pop(.4), t, .8, pan)
    elif ty == 'jump': add(F, whoosh(.3, .5), t, .7, .2)
    elif ty == 'land': add(F, thump(.3, 90), t, .6, .2)
    elif ty == 'heart': add(F, pop(.5), t, .8, -.2)
    elif ty == 'sip': add(F, slurp(.9), t, 1.0, pan)
    elif ty == 'creak':
        for i in range(4): add(F, creak(.5), t + i * .45, .6, (-1) ** i * .3)

# ambience: birds and a quiet street until the storm; then rain
A = st['amb']
street = lp(brown(DUR + .5), 400) * .03
street = street[:N]
envs = np.ones(N); i0, i1 = int(35.0 * SR), int(36.0 * SR); envs[i0:i1] = np.linspace(1, .15, i1 - i0); envs[i1:] = .15
A[:len(street), 0] += street * envs[:len(street)]; A[:len(street), 1] += street * envs[:len(street)]
for k in range(16):
    tt = rng.uniform(0.3, 34.0); add(A, chirp(rng.uniform(.6, 1.0)), tt, 1.0, rng.uniform(-.8, .8))
R = st['rain']
def rainK(t): s = lambda x: np.clip(x, 0, 1) ** 2 * (3 - 2 * np.clip(x, 0, 1)); return s((t - 37.4) / 1.0) * (1 - .7 * s((t - 52) / 5.5))
tt = np.arange(N) / SR
bed = hp(lp(noise(N / SR), 7000), 300)[:N]
bed2 = hp(lp(noise(N / SR), 7000), 300)[:N]
kk = rainK(tt) * .03
R[:, 0] += (bed * kk).astype(np.float32); R[:, 1] += (bed2 * kk).astype(np.float32)
for k in range(700):
    t0 = rng.uniform(37.5, DUR)
    if rng.random() < rainK(t0): add(R, plink(rng.uniform(1800, 4200), rng.uniform(.05, .18)), t0, 1.0, rng.uniform(-.9, .9))

# ———————————————————— mix ————————————————————
gains = {'mbox': 1.0, 'uke': 0.85, 'flute': 0.8, 'clar': 0.75, 'glock': 0.75, 'perc': 0.7, 'foley': 1.1, 'amb': 1.0, 'rain': 1.0}
out = np.zeros((N, 2), np.float32)
for k, g in gains.items(): out += st[k] * g
# the silence before the rain: everything but thunder and the drop is already sparse; duck the music bus around it
mus = sum(st[k] * gains[k] for k in ['mbox', 'uke', 'flute', 'clar', 'glock', 'perc'])
duck = np.ones(N, np.float32); a, b = int(34.9 * SR), int(37.4 * SR); duck[a:b] = 0.1
out = out - mus * (1 - duck)[:, None]
out = out[:int(DUR * SR)]
pk = np.abs(out).max(); out = out / pk * 0.8
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out, SR)
print('mix ok', out.shape, 'peak', pk)
