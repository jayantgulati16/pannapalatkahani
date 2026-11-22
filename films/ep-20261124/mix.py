"""Score + foley + Gemini voice for "टिफ़िन चोर" → out/mix.wav
Office comedy: a sneaky pizzicato detective walk (bassoon + pizz strings, A minor), clarinet comic hits, a sizzling kitchen with a
plucky scheming motif, a drum roll + slide whistle as Sharma sir turns red, an orchestra stab on the reveal, then warm strings + harp for
"माँ जैसे हैं", and a bouncy marimba/glock ending in A major. Original melodies.
Voice: Gemini TTS lines in voice/<id>.wav (Meera Leda, narrator Sulafat, Sharma sir Charon).
"""
import sys, os, json
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '../..'))
sys.path.insert(0, LIB)
from core.audio import sampler as S, pluck as P
from core.audio.sfx import SR, add, bp, lp, hp, noise, brown, click, thump, pop, whoosh, ding, crash

S.seed(23)
EVJ = json.load(open(os.path.join(HERE, 'events.json')))
DUR = EVJ['dur'] if isinstance(EVJ, dict) and 'dur' in EVJ else 47.0
EV = EVJ['ev'] if isinstance(EVJ, dict) and 'ev' in EVJ else EVJ
N = int((DUR + 0.5) * SR)
rng = np.random.default_rng(23)
st = {k: np.zeros((N, 2), np.float32) for k in ['bass', 'str', 'mel', 'keys', 'perc', 'foley', 'amb', 'voice']}
m = S.midi
CU = {e['id']: e['t'] for e in EV if e['type'] == 'cue'}

def samp(k, inst, t, p, d, v=.6, pan=0., g=1., attack=0., release=None):
    add(st[k], S.note(inst, p, d, v, release=release, attack=attack), t, g, pan)
def hit(k, inst, var, t, v=.6, pan=0.): add(st[k], S.hit(inst, var, v), t, 1.0, pan)
def pizz(t, p, v=.5, pan=-.1): samp('str', 'cellos_pizz', t, p, .4, v, pan)
def vpizz(t, p, v=.4, pan=.2): samp('str', 'violins_pizz', t, p, .3, v, pan)
def bsn(t, p, d, v=.5, pan=-.05): samp('mel', 'bassoon_stac' if d < .3 else 'bassoon', t, p, d, v, pan)
def clar(t, p, d, v=.45, pan=.1): samp('mel', 'clarinet_stac' if d < .3 else 'clarinet', t, p, d, v, pan)
def marimba(t, p, v=.45, pan=.15): samp('keys', 'marimba', t, p, .8, v, pan)
def glock(t, p, v=.35, pan=.25): samp('keys', 'glockenspiel', t, p, 1.5, v, pan)
def harp(t, p, v=.35, pan=.2): samp('keys', 'harp', t, p, 2.0, v, pan)
def pad(t, d, ch, v=.16): [samp('str', 'violas' if i else 'cellos', t + i * .04, p, d, v, .2 * (-1) ** i, 1.0, attack=.8, release=1.0) for i, p in enumerate(ch)]
BT = 60 / 112   # 112 bpm

# detective walk: bass line on quarters, sneaky bassoon on top (A minor)
WALK = ['A2', 'C3', 'E3', 'D#3', 'D3', 'C3', 'B2', 'G#2']
SNEAK = [('A3', 0, .5), ('C4', .5, .5), ('E4', 1, .25), ('D#4', 1.5, .25), ('E4', 2, 1), ('C4', 3.5, .5), ('B3', 4, .5), ('G#3', 5, 1)]
def walk(t0, beats, v=.5, top=True):
    for i in range(beats): pizz(t0 + i * BT, WALK[i % 8], v)
    if top:
        for b0 in range(0, beats, 8):
            for p, b, d in SNEAK:
                if b0 + b < beats: bsn(t0 + (b0 + b) * BT, p, d * BT, .42)
    for i in range(beats): hit('perc', 'world_perc', 'darbuka_tak', t0 + i * BT + BT / 2, .18, .2)

# A: the empty tiffin — comic "dun dun" + clarinet wobble, then the walk starts
A0 = CU['A']; pad(A0, 1.2, ['A2', 'E3'], .2)
bsn(A0 + .05, 'A2', .25, .6); bsn(A0 + .35, 'A2', .25, .6); bsn(A0 + .65, 'G#2', .9, .6)
for i, p in enumerate(['E4', 'D#4', 'D4', 'C#4']): clar(1.25 + i * .18, p, .18, .4)
walk(A0 + 1.9, 5, .4, top=False)
# B/C: the suspects — the detective walk, a vibraphone "ting" on each clue
B0 = CU['B']; walk(B0, int((CU['D'] - B0) / BT), .5)
for t in (CU['C'] + .6, CU['C'] + 3.0, CU['C'] + 5.3): samp('keys', 'vibraphone_hard', t, 'E6', 1.0, .4, .25)
# D: the kitchen at night — scheming plucks, pizz in minor, a little evil glissando when the note is written
D0 = CU['D']
for i in range(int((CU['E'] - D0) / (BT / 2))):
    p = ['A3', 'E4', 'A3', 'F4', 'A3', 'E4', 'G#3', 'E4'][i % 8]; vpizz(D0 + i * BT / 2, p, .3 + .1 * (i % 2 == 0))
pad(D0, 7.0, ['A2', 'E3', 'C4'], .12)
for i, p in enumerate(['A4', 'C5', 'E5', 'A5']): glock(D0 + 4.4 + i * .1, p, .3)
# E: next day, the meeting — quiet, a ticking clock
E0 = CU['E']
for i in range(6): hit('perc', 'world_perc', 'darbuka_tak', E0 + .2 + i * .5, .12, .3)
bsn(E0 + .3, 'E3', 1.0, .3)
# F: Sharma sir turns red — drum roll building, rising slide (clarinet steps), kettle whistle in foley
F0 = CU['F']
for i in range(int(4.3 / .07)): hit('perc', 'world_perc', 'darbuka_tak', F0 + .1 + i * .07, .08 + .3 * i / 61, 0)
for i, p in enumerate(['C4', 'D4', 'E4', 'F#4', 'G#4', 'A#4', 'C5']): clar(F0 + .4 + i * .5, p, .45, .32)
# G: the reveal — orchestra stab + cymbal, then the walk once, triumphant
G0 = CU['G']
for p in ['A2', 'E3', 'A3', 'C4', 'E4']: samp('str', 'violins_spic' if m(p) > 55 else 'cellos_spic', G0, p, .3, .7)
samp('mel', 'trombone', G0, 'A2', .6, .55); samp('mel', 'trumpet_stac', G0, 'E4', .3, .5); add(st['perc'], crash(.5), G0, .5, 0)
walk(G0 + .6, 5, .4, top=False)
# H/I: "माँ जैसे हैं" — warm strings, harp, a soft clarinet line (A major)
H0 = CU['H']; pad(H0, 4.0, ['A2', 'E3', 'C#4'], .18); pad(H0 + 4.0, 5.0, ['F#2', 'C#3', 'A3'], .18)
for i, p in enumerate(['A3', 'C#4', 'E4', 'A4', 'C#5', 'E5']): harp(H0 + .3 + i * .22, p, .3)
for p, b, d in [('E4', 1.2, 1), ('C#4', 2.3, .8), ('D4', 3.2, 1.4), ('B3', 4.8, 1), ('C#4', 6.0, 2.0)]: clar(H0 + b, p, d, .3)
# J: next morning, two tiffins — bouncy marimba + glock tune in A major
J0 = CU['J']
TUNE = [('A4', 0), ('C#5', .5), ('E5', 1), ('C#5', 1.5), ('D5', 2), ('B4', 2.5), ('A4', 3), ('E5', 3.5), ('F#5', 4), ('E5', 4.5), ('C#5', 5), ('A4', 6)]
for p, b in TUNE: marimba(J0 + .2 + b * BT, p, .45)
for i in range(8): pizz(J0 + .2 + i * BT, ['A2', 'E3', 'F#2', 'C#3', 'D3', 'A2', 'E2', 'A2'][i], .4)
glock(J0 + 1.4, 'A6', .35); glock(J0 + 1.5, 'C#7', .3)
# Z: end card — a little "ta-da"
Z0 = CU['Z']
for i, p in enumerate(['E5', 'A5']): marimba(Z0 + .1 + i * .18, p, .5)
pad(Z0 + .4, 1.6, ['A3', 'C#4', 'E4'], .15)

# ———————————————————— foley ————————————————————
def env(n, a=.004, r=.05):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e
def nz(x, v): return (x / (np.abs(x).max() + 1e-9) * v).astype(np.float32)
def tt_(d): return np.arange(int(round(d * SR))) / SR
def boing(v=1.0):
    d = .45; tt = tt_(d); f = 180 + 240 * np.exp(-tt / .08) + 40 * np.sin(2 * np.pi * 14 * tt) * np.exp(-tt / .2)
    return nz(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / .18), .2 * v)
def hum(d):
    tt = tt_(d); x = .6 * np.sin(2 * np.pi * 50 * tt) + .3 * np.sin(2 * np.pi * 100 * tt) + lp(noise(d), 250)[:len(tt)] * 2
    return nz(x * env(len(tt), .2, .3), .04)
def sizzle(d):
    x = hp(noise(d), 2500) * (.6 + .4 * np.abs(np.sin(np.pi * 3 * tt_(d)[:len(noise(d))]))) if False else hp(noise(d), 2500)
    return nz(x * env(len(x), .3, .4), .035)
def plop(v=1.0):
    d = .12; tt = tt_(d); f = 600 - 2500 * tt
    return nz(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / .03), .12 * v)
def scribble(d):
    tt = tt_(d); x = bp(noise(d), 1400, 4200)[:len(tt)] * (.35 + .65 * np.abs(np.sin(np.pi * 7 * tt)) ** 2)
    return nz(x * env(len(x), .02, .1), .07)
def sparkle(d):
    out = np.zeros(int(d * SR) + 8000)
    for k in range(8):
        f = rng.uniform(2500, 5500); tt = tt_(.12); s = np.sin(2 * np.pi * f * tt) * np.exp(-tt / .04)
        i = int(rng.uniform(0, d) * SR); out[i:i + len(s)] += s
    return nz(out, .05)
def kettle(d):
    tt = tt_(d); f = 1800 + 900 * np.clip(tt / d, 0, 1)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * (.4 + .6 * np.clip(tt / .4, 0, 1)) + .3 * bp(noise(d), 1500, 4000)[:len(tt)]
    return nz(x * env(len(tt), .3, .15), .06)
def glug(v=1.0):
    d = .25; tt = tt_(d); f = 220 + 180 * np.sin(np.pi * tt / d)
    return nz(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / d) ** 2, .14 * v)

F = st['foley']
for e in EV:
    t, ty, pan = e['t'], e['type'], e.get('pan', 0)
    if ty == 'hum': add(st['amb'], hum(e['dur']), t, 1.0, 0)
    elif ty == 'hit': add(F, thump(.7, 60), t, .8, 0)
    elif ty == 'boing': add(F, boing(), t, 1.0, .2)
    elif ty == 'whoosh': add(F, whoosh(.25, .3), t - .1, .6, 0)
    elif ty == 'tink': add(F, click(4.0, .4), t, .8, .2)
    elif ty == 'sizzle': add(st['amb'], sizzle(e['dur']), t, 1.0, -.2)
    elif ty == 'plop': add(F, plop(), t, 1.0, pan)
    elif ty == 'write': add(F, scribble(e['dur']), t, 1.0, .2)
    elif ty == 'sparkle': add(F, sparkle(e['dur']), t, 1.0, .2)
    elif ty == 'kettle': add(F, kettle(e['dur']), t, 1.0, 0)
    elif ty == 'glug': add(F, glug(), t, 1.0, 0)
    elif ty == 'stab': add(F, thump(.8, 70), t, .7, 0)
# office room tone under the office/meeting scenes
A = st['amb']; mur = bp(noise(DUR + .5), 300, 1600)[:N] * .006
A[:len(mur), 0] += mur; A[:len(mur), 1] += mur

# ———————————————————— voice ————————————————————
V = st['voice']; vmask = np.zeros(N, np.float32)
for e in EV:
    if e['type'] != 'voice': continue
    f = os.path.join(HERE, 'voice', e['id'] + '.wav')
    if not os.path.exists(f): print('no voice', e['id']); continue
    x, sr = sf.read(f, dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR: x = resample_poly(x, SR, sr).astype(np.float32)
    x = hp(x, 90).astype(np.float32); x = x / (np.abs(x).max() + 1e-9) * .8
    add(V, x, e['t'], 1.0, {'M': .05, 'S': -.05}.get(e['who'], 0))
    a = int(e['t'] * SR); vmask[a:a + len(x)] = 1
k = int(.15 * SR); sm = np.convolve(vmask, np.ones(k) / k, mode='same'); duck = 1 - .55 * sm

gains = {'bass': 1.0, 'str': .9, 'mel': .85, 'keys': .85, 'perc': .8}
mus = sum(st[k] * g for k, g in gains.items())
out = mus * duck[:, None] + (st['foley'] * 1.1 + st['amb']) * (1 - .3 * sm)[:, None] + st['voice'] * 1.3
out = out[:int(DUR * SR)]; pk = np.abs(out).max(); out = out / pk * 0.85
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out, SR)
print('mix ok', out.shape, 'peak', pk)
