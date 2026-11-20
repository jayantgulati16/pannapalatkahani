"""Score + foley + Gemini voice for "13वाँ फ्लोर (भाग 1)" → out/mix.wav
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

S.seed(21)
EVJ = json.load(open(os.path.join(HERE, 'events.json')))
DUR = EVJ['dur'] if isinstance(EVJ, dict) and 'dur' in EVJ else 45.0
EV = EVJ['ev'] if isinstance(EVJ, dict) and 'ev' in EVJ else (EVJ.get('EV') if isinstance(EVJ, dict) else EVJ)
N = int((DUR + 0.5) * SR)
rng = np.random.default_rng(13)
st = {k: np.zeros((N, 2), np.float32) for k in ['drone', 'str', 'keys', 'box', 'hit', 'foley', 'amb', 'voice']}
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

# amma's lullaby (original): slow 3/4 in A minor, (pitch, beat, beats); beat = 0.5 s
LUL = [('E5', 0, 1), ('C5', 1, 1), ('E5', 2, 1), ('D5', 3, 1.5), ('B4', 4.5, 1.5), ('C5', 6, 1), ('A4', 7, 1), ('B4', 8, 1), ('G#4', 9, 3)]
def lullaby(t0, v=.4, beat=.5, upto=99, det=0.):
    for p, b, d in LUL:
        if b < upto: box(t0 + b * beat, p, v, .15, det * (1 if int(b) % 2 else -1))

# ===== A 0–3: the display climbs; glass harp and a held drone; the HIT on 13 =====
drone(0.0, 3.2, ('A1', 'E2'), .3)
glass(0.0, 'E6', .25); glass(0.6, 'F6', .28); glass(1.2, 'F#6', .3)
cluster(1.9, .75)
samp('str', 'violins_trem', 1.9, 'A#5', 1.4, .2, .3, 1.0, attack=.02, release=.6)
# ===== B 3–8.6: the lift; the lullaby on a music box, too slow; the ding stops it =====
drone(3.0, 5.0, ('A1',), .22)
lullaby(3.4, .4, .52, upto=8.5)
air(5.2, 2.6, ['E4', 'B4'], .18)
# ===== C 8.6–14.2: the corridor: low air, a rising tremolo under amma's voice =====
drone(8.6, 5.8, ('A1', 'D#2'), .3)
air(8.7, 5.0, ['D#4', 'A4', 'E5'], .2)
trem(10.0, 4.2, ['A4', 'A#4'], .14, 2.5)
glass(12.0, 'D#6', .25, -.3)
# ===== D 14.2–17.6: frozen: only the heartbeat and one held cello =====
samp('drone', 'cellos', 14.2, 'D#2', 3.4, .3, 0, 1.0, attack=.4, release=.8)
# ===== close button 17.6–21.2: tremolo cluster climbs =====
trem(17.6, 3.6, ['E5', 'F5', 'A#5'], .2, 1.2)
drone(17.6, 3.8, ('A1', 'A#1'), .3)
# ===== E 21.2–27: amma comes closer: the lullaby again, slower, detuned; everything swells — then silence at 26.5 =====
drone(21.2, 5.3, ('A1', 'E2'), .35)
lullaby(21.4, .42, .6, upto=8.5, det=.35)
trem(22.6, 3.9, ['A4', 'A#4', 'E5', 'F5'], .22, 2.8)
air(23.0, 3.4, ['A#4', 'F5'], .2)
# ===== F 27–28.6: the slam and the drop =====
cluster(27.35, .9)
samp('str', 'violins_trem', 27.65, 'F6', .9, .3, 0, 1.0, attack=.02, release=.3)
for i, p in enumerate(['A5', 'G5', 'E5', 'D5', 'B4', 'A4', 'F4', 'E4']): samp('keys', 'piano', 27.65 + i * .11, p, .3, .38, .1)
samp('hit', 'timpani', 28.55, 'A2', 2.0, .7)
# ===== G 28.6–33.4: the lobby: room tone, a few lonely piano notes =====
for t, p in [(29.0, 'A3'), (30.4, 'E4'), (31.6, 'C4'), (32.9, 'B3')]: piano(t, p, 1.6, .28, -.1)
drone(28.6, 4.8, ('A1',), .18)
# ===== H 33.4–37.6: "…1996 की आग": low strings swell under the watchman =====
drone(33.4, 4.4, ('A1', 'E2'), .33)
for i, p in enumerate(['C3', 'D#3', 'A3']): samp('str', 'cellos', 33.6 + i * .5, p, 3.8 - i * .5, .25, .2 * (-1) ** i, 1.0, attack=1.0, release=1.0)
trem(34.6, 3.0, ['D#5', 'E5'], .16, 2.0)
# ===== I 37.6–41: the warm tiffin: three music-box notes, steam =====
for i, p in enumerate(['E5', 'C5', 'E5']): box(37.8 + i * .6, p, .38, .1)
air(37.7, 3.0, ['A4', 'C5'], .16)
# ===== J 41–43.3: the mirror: silence … the STING =====
samp('str', 'violins_trem', 41.0, 'A6', .9, .08, 0, 1.0, attack=.6, release=.2)
cluster(41.9, 1.0)
for i, p in enumerate(['A5', 'A#5', 'B5', 'F6']): samp('str', 'violins', 41.9, p, 1.3, .3, .2 * (-1) ** i, 1.0, attack=.01, release=.8)
add(st['hit'], crash(.5), 41.9, .5, 0)
# ===== Z 43.3–45: end card: the lullaby fragment, out of tune, one bell =====
drone(43.3, 1.9, ('A1',), .25)
lullaby(43.4, .36, .38, upto=4.5, det=.5)

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
gains = {'drone': 1.0, 'str': .9, 'keys': .85, 'box': .9, 'hit': 1.0}
mus = sum(st[k] * gains[k] for k in gains)
# real silence: the bulb dies (26.5–27.0) and the breath before the sting (41.2–41.9)
gate = np.ones(N, np.float32)
for a, b in [(26.5, 27.0), (41.25, 41.88)]:
    i0, i1 = int(a * SR), int(b * SR); r = int(.08 * SR); gate[i0:i1] = .05; gate[i0 - r:i0] = np.linspace(1, .05, r)
out = mus * (gate * duck)[:, None] + (st['foley'] * 1.1 + st['amb'] * gate[:, None]) * (1 - .3 * sm)[:, None] + st['voice'] * 1.3
out = out[:int(DUR * SR)]
pk = np.abs(out).max(); out = out / pk * 0.85
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out, SR)
print('mix ok', out.shape, 'peak', pk, 'voices', have)
