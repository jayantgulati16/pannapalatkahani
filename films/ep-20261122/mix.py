"""Score + foley + Gemini voice for "13वाँ फ्लोर (भाग 2)" → out/mix.wav
Horror, quiet and close: a low cello/contrabass drone, glass harp and bowed vibraphone air, a detuned music-box lullaby (amma's theme,
original, A minor), tremolo strings that rise with the tension, piano/timpani hits on the scares, real silence before the sting.
Foley: lift hum, ding, sliding doors, bulb buzz, button clicks, heartbeats, the slam and the drop, a glass falling, steam.
Voice: Gemini TTS lines in voice/<id>.wav (narrator, Riya, amma, watchman) placed by the 'voice' events; music ducks under them.
If voice files are missing the mix still renders (music + printed words only).
"""
import sys, os, json
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '../..'))
sys.path.insert(0, LIB)
from core.audio import sampler as S, pluck as P
from core.audio.sfx import SR, add, bp, lp, hp, noise, brown, click, thump, pop, whoosh, ding, heartbeat, crash

S.seed(22)
EVJ = json.load(open(os.path.join(HERE, 'events.json')))
DUR = EVJ['dur'] if isinstance(EVJ, dict) and 'dur' in EVJ else 53.0
EV = EVJ['ev'] if isinstance(EVJ, dict) and 'ev' in EVJ else (EVJ.get('EV') if isinstance(EVJ, dict) else EVJ)
N = int((DUR + 0.5) * SR)
rng = np.random.default_rng(13)
st = {k: np.zeros((N, 2), np.float32) for k in ['drone', 'str', 'keys', 'box', 'hit', 'mel', 'foley', 'amb', 'voice']}
m = S.midi

def samp(k, inst, t, p, d, v=.6, pan=0., g=1., attack=0., release=None):
    add(st[k], S.note(inst, p, d, v, release=release, attack=attack), t, g, pan)
def box(t, p, v=.45, pan=.1, detune=0.):
    add(st['box'], P.pluck('music_box', (m(p) if isinstance(p, str) else p) + detune, None, v), t, 1.0, pan)
def drone(t, d, notes=('A1', 'E2'), v=.35):
    for i, p in enumerate(notes): samp('drone', 'contrabass' if i == 0 else 'cellos', t, p, d, v, (-.2, .2)[i % 2], 1.0, attack=1.2, release=1.5)
def trem(t, d, notes, v=.25, attack=1.5): [samp('str', 'violins_trem', t, p, d, v, .25 * (-1) ** i, 1.0, attack=attack, release=.8) for i, p in enumerate(notes)]
def air(t, d, notes, v=.3): [samp('str', 'vibraphone_bowed', t + i * .3, p, d, v, .3 * (-1) ** i, 1.0, attack=.6, release=1.0) for i, p in enumerate(notes)]
def glass(t, p, v=.35, pan=.2): samp('keys', 'glass', t, p, 2.5, v, pan)
def piano(t, p, d=2.0, v=.5, pan=0.): samp('keys', 'piano', t, p, d, v, pan)
def cluster(t, v=.8):   # a low piano cluster + timpani: the scare hit
    for p in ['A0', 'A#0', 'B0', 'C1', 'E1', 'F1']: piano(t, p, 2.5, v * .8)
    samp('hit', 'timpani', t, 'A2', 2.5, v); add(st['hit'], thump(v, 45), t, .9, 0)

# amma's lullaby (original): slow 3/4, (pitch, beat, beats); minor in Part 1, major now that we know her
LUL = [('E5', 0, 1), ('C5', 1, 1), ('E5', 2, 1), ('D5', 3, 1.5), ('B4', 4.5, 1.5), ('C5', 6, 1), ('A4', 7, 1), ('B4', 8, 1), ('G#4', 9, 3)]
LULM = [('E5', 0, 1), ('C#5', 1, 1), ('E5', 2, 1), ('D5', 3, 1.5), ('B4', 4.5, 1.5), ('C#5', 6, 1), ('A4', 7, 1), ('B4', 8, 1), ('A4', 9, 3)]
def lullaby(t0, v=.4, beat=.5, upto=99, det=0., mel=LUL, fn=None):
    for p, b, d in mel:
        if b < upto: (fn or (lambda t, pp, dd: box(t, pp, v, .15, det * (1 if int(b) % 2 else -1))))(t0 + b * beat, p, d * beat)
def pad(t, d, chord, v=.18): [samp('str', 'violas' if i else 'cellos', t + i * .05, p, d, v, .2 * (-1) ** i, 1.0, attack=1.0, release=1.2) for i, p in enumerate(chord)]
def harp(t, p, v=.35, pan=.2): samp('keys', 'harp', t, p, 2.0, v, pan)
CU = {e['id']: e['t'] for e in EV if e['type'] == 'cue'}

# ===== A: the mirror again (eerie), then it melts into a warm chord as amma smiles =====
A0 = CU['A']; drone(A0, 3.0, ('A1', 'A#1'), .3); glass(A0 + .1, 'A#5', .25); cluster(A0 + .05, .55)
pad(A0 + 2.7, 1.6, ['A3', 'C#4', 'E4'], .2)
# ===== B: relief: gentle piano in A major =====
B0 = CU['B']
for i, (p, b) in enumerate([('A3', 0), ('E4', .5), ('C#5', 1), ('E4', 1.5), ('D3', 2.5), ('A4', 3), ('F#4', 3.5), ('A4', 4)]): piano(B0 + .3 + b, p, 1.2, .3, -.1)
pad(B0, 5.8, ['A3', 'C#4', 'E4'], .14)
# ===== C: the clue: playful pizzicato =====
C0 = CU['C']
for i, p in enumerate(['A4', 'C#5', 'E5', 'A5', 'E5', 'C#5', 'B4', 'G#4', 'A4', 'B4', 'C#5', 'E5']): samp('keys', 'violins_pizz', C0 + .2 + i * .5, p, .3, .4, .15 * (-1) ** i)
harp(C0 + 1.2, 'A5', .35)
for i, p in enumerate(['E5', 'A5', 'C#6']): harp(C0 + 3.3 + i * .12, p, .3)   # the circle around the ID card
pad(C0, 7.0, ['D3', 'F#3', 'A3'], .12)
# ===== D: the corridor, now sad: a cello line over a soft pad =====
D0 = CU['D']
pad(D0, 6.8, ['A2', 'E3', 'C4'], .16)
for p, b, d in [('E3', 0, 1.5), ('C3', 1.5, 1), ('D3', 2.5, 1), ('E3', 3.5, 2), ('A2', 5.5, 1.2)]: samp('mel' if 'mel' in st else 'str', 'cellos', D0 + .2 + b, p, d, .3, -.1, 1.0, attack=.15, release=.6)
# ===== E: amma's room: the lullaby, in tune at last, music box + harp =====
E0 = CU['E']; pad(E0, 6.0, ['A3', 'C#4', 'E4'], .12)
lullaby(E0 + .3, .42, .5, mel=LULM)
for i, p in enumerate(['A3', 'E4', 'A4', 'C#5']): harp(E0 + .3 + i * 1.5, p, .25, -.2)
# ===== F: "शायद आज आ जाए": strings swell, piano =====
F0 = CU['F']; pad(F0, 6.2, ['F#3', 'A3', 'D4'], .2); pad(F0 + 3.0, 3.2, ['E3', 'G#3', 'B3'], .16)
for p, b in [('F#5', .3), ('E5', 1.3), ('D5', 2.3), ('C#5', 3.3), ('B4', 4.3), ('A4', 5.3)]: piano(F0 + b, p, 1.4, .3, .1)
# ===== G: next night: the lift climbs (ticks, ding), hopeful =====
G0 = CU['G']; pad(G0, 2.3, ['A3', 'C#4', 'E4'], .12)
for i, p in enumerate(['A5', 'B5', 'C#6']): glass(G0 + .6 + i * .7, p, .22)
# ===== H: Riya in the lift with her own tiffin: the lullaby, major, glockenspiel =====
H0 = CU['H']; lullaby(H0 + .1, .4, .3, upto=8, mel=LULM, fn=lambda t, p, d: samp('keys', 'glockenspiel', t, p, 1.5, .3, .2))
pad(H0, 2.9, ['D3', 'A3', 'F#4'], .14)
# ===== I: "आ गई बेटा?": the reunion: full warm strings, the lullaby on violin =====
I0 = CU['I']; pad(I0, 6.2, ['A2', 'E3', 'A3', 'C#4'], .24)
lullaby(I0 + .2, .5, .5, mel=LULM, fn=lambda t, p, d: samp('mel' if 'mel' in st else 'str', 'violin', t, p, d * 1.02, .32, .1, 1.0, attack=.08, release=.4))
for i, p in enumerate(['A3', 'E4', 'A4', 'C#5', 'E5']): harp(I0 + 2.0 + i * .14, p, .3)
# ===== J: the 14: everything stops, then the sting =====
J0 = CU['J']; T14 = [e['t'] for e in EV if e['type'] == 'sting'][0]
pad(J0, T14 - J0 - .25, ['A3', 'C#4', 'E4'], .12)
cluster(T14, .9)
for i, p in enumerate(['A5', 'A#5', 'B5', 'F6']): samp('str', 'violins', T14, p, 1.6, .28, .2 * (-1) ** i, 1.0, attack=.01, release=.8)
add(st['hit'], crash(.5), T14, .5, 0)
drone(T14, 2.8, ('A1', 'A#1'), .3)
# ===== Z: end card: the lullaby again — out of tune =====
Z0 = CU['Z']; drone(Z0, 3.0, ('A1',), .22); lullaby(Z0 + .15, .36, .38, upto=5, det=.5)

# ———————————————————— foley ————————————————————
def env(n, a=.004, r=.05):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e
def nz(x, v): return (x / (np.abs(x).max() + 1e-9) * v).astype(np.float32)
def tt_(d): return np.arange(int(round(d * SR))) / SR
def hum(d, v=1.0):        # lift motor + cable hum
    tt = tt_(d); x = .6 * np.sin(2 * np.pi * 50 * tt) + .3 * np.sin(2 * np.pi * 100 * tt + 1) + lp(noise(d), 300)[:len(tt)] * 2.0
    return nz(x * env(len(tt), .3, .3), .05 * v)
def buzz(d, v=1.0):       # a dying bulb: crackling 100 Hz buzz
    tt = tt_(d); g = (rng.random(len(tt) // 400 + 1) > .4).repeat(400)[:len(tt)]
    x = (np.sign(np.sin(2 * np.pi * 100 * tt)) * .4 + bp(noise(d), 2000, 6000)[:len(tt)] * .6) * g
    return nz(x * env(len(tt), .01, .05), .06 * v)
def doors(d, v=1.0):
    tt = tt_(d); x = bp(noise(d), 200, 1800)[:len(tt)] * np.sin(np.pi * np.clip(tt / d, 0, 1)) ** .5
    return nz(x * env(len(tt), .02, .05), .1 * v)
def roomtone(d, v=1.0):
    x = lp(brown(d), 400) + bp(noise(d), 300, 900) * .05
    return nz(x * env(len(x), .4, .4), .035 * v)
def chalk(d=1.0, v=1.0, rate=6.0):
    tt = tt_(d); x = bp(noise(d), 1400, 4200)[:len(tt)] * (.35 + .65 * np.abs(np.sin(np.pi * rate * tt)) ** 2)
    return nz(x * env(len(x), .02, .1), .06 * v)
def steamhiss(d, v=1.0):
    x = bp(noise(d), 3000, 9000); return nz(x * np.sin(np.pi * np.linspace(0, 1, len(x))) ** 2, .02 * v)
def clink(v=1.0):
    out = np.zeros(int(.8 * SR))
    for k, (f, a) in enumerate([(2900, 1), (4300, .6), (6100, .4)]):
        tt = tt_(.8); out += a * np.sin(2 * np.pi * f * tt) * np.exp(-tt / .12)
    return nz(out, .12 * v)

F = st['foley']
for e in EV:
    t, ty, pan = e['t'], e['type'], e.get('pan', 0)
    if ty == 'hum': add(st['amb'], hum(e['dur']), t, 1.0, 0)
    elif ty == 'roomtone': add(st['amb'], roomtone(e['dur']), t, 1.0, 0)
    elif ty == 'lobby': add(st['amb'], roomtone(e['dur'], .7), t, 1.0, 0)
    elif ty == 'tick': add(F, click(2.0, .3), t, .5, .1)
    elif ty == 'ding': add(F, ding(.5 if e.get('low') else .6), t, .7, .1)
    elif ty == 'doors': add(F, doors(e['dur']), t, 1.0, 0)
    elif ty == 'buzz': add(F, buzz(e['dur']), t, 1.0, .1)
    elif ty == 'click': add(F, click(1.2, .7), t, 1.0, .25)
    elif ty == 'heart':
        b = 60 / e['bpm']; k = 0
        while k * b < e['dur']: add(F, heartbeat(.8), t + k * b, .6, 0); k += 1
    elif ty == 'pop': add(F, pop(.6), t, .7, 0)
    elif ty == 'slam': add(F, thump(1.0, 60), t, 1.0, 0); add(F, click(.5, 1.0), t, .8, 0)
    elif ty == 'drop': add(F, whoosh(e['dur'], .6), t, 1.0, 0)
    elif ty == 'thud': add(F, thump(.9, 55), t, 1.0, 0)
    elif ty == 'clink': add(F, clink(1.0), t + .45, 1.0, .3)
    elif ty == 'steam': add(F, steamhiss(e['dur']), t, 1.0, 0)
    elif ty == 'chalk': add(F, chalk(e['dur']), t, 1.0, 0)
    elif ty == 'hit': pass

# ———————————————————— voice (Gemini TTS) ————————————————————
V = st['voice']
vmask = np.zeros(N, np.float32)
have = 0
for e in EV:
    if e['type'] != 'voice': continue
    f = os.path.join(HERE, 'voice', e['id'] + '.wav')
    if not os.path.exists(f): print('no voice file', e['id']); continue
    x, sr = sf.read(f, dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR: x = resample_poly(x, SR, sr).astype(np.float32)
    x = hp(x, 90).astype(np.float32); x = x / (np.abs(x).max() + 1e-9) * .8
    add(V, x, e['t'], 1.0, {'R': -.05, 'A': .05, 'G': .08}.get(e['who'], 0)); have += 1
    a = int(e['t'] * SR); vmask[a:a + len(x)] = 1
k = int(.15 * SR); sm = np.convolve(vmask, np.ones(k) / k, mode='same')
duck = 1 - .5 * sm

# ———————————————————— mix ————————————————————
gains = {'drone': 1.0, 'str': .9, 'keys': .85, 'box': .9, 'hit': 1.0, 'mel': .9}
mus = sum(st[k] * gains[k] for k in gains)
# real silence: the bulb dies (26.5–27.0) and the breath before the sting (41.2–41.9)
gate = np.ones(N, np.float32)
for a, b in [(T14 - .5, T14 - .02)]:
    i0, i1 = int(a * SR), int(b * SR); r = int(.08 * SR); gate[i0:i1] = .05; gate[i0 - r:i0] = np.linspace(1, .05, r)
out = mus * (gate * duck)[:, None] + (st['foley'] * 1.1 + st['amb'] * gate[:, None]) * (1 - .3 * sm)[:, None] + st['voice'] * 1.3
out = out[:int(DUR * SR)]
pk = np.abs(out).max(); out = out / pk * 0.85
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out, SR)
print('mix ok', out.shape, 'peak', pk, 'voices', have)
