"""Score + foley + Gemini voice for "ख़ामोशी की क़ीमत (भाग 1)" (Ep 12) — HORROR → out/mix.wav
Sci-fi heartbreak in A minor. The WORD theme (A–C–E–D, then E–G–A) is the leitmotif: a fragile piano in the café, a solo violin for
"who was it?", full strings when Aarav gives everything away. Digital colour from bowed vibraphone + glass; every spoken word of Meera's
gets a tiny digital tick; at 0000 an alarm beep and then TOTAL silence (music and ambience cut) for ~1 s. The court: low ostinato,
trombone stabs for Khanna, the gavel, then the 5-minute countdown = clock ticks + heartbeat + a low pulse to the end card, unresolved.
Original melodies. Voices: voice/<id>.wav (Gemini TTS)."""
import sys, os, json
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '../..'))
sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio.sfx import SR, add, bp, lp, hp, noise, click, thump, whoosh, ding, crash, heartbeat, creak, clack, step, rumble

S.seed(12)
EVJ = json.load(open(os.path.join(HERE, 'events.json')))
DUR = EVJ['dur'] if isinstance(EVJ, dict) and 'dur' in EVJ else 91.2
EV = EVJ['ev'] if isinstance(EVJ, dict) and 'ev' in EVJ else EVJ
N = int((DUR + 1.0) * SR)
rng = np.random.default_rng(12)
st = {k: np.zeros((N, 2), np.float32) for k in ['bass', 'str', 'mel', 'keys', 'perc', 'foley', 'amb', 'voice']}
CU = {e['id']: e['t'] for e in EV if e['type'] == 'cue'}
VO = {e['id']: e['t'] for e in EV if e['type'] == 'voice'}

def samp(k, inst, t, p, d, v=.6, pan=0., g=1., attack=0., release=None):
    if t >= DUR: return
    add(st[k], S.note(inst, p, d, v, release=release, attack=attack), t, g, pan)
def hit(k, inst, var, t, v=.6, pan=0.): add(st[k], S.hit(inst, var, v), t, 1.0, pan)
def drone(t0, t1, v=.13, lo='D2', hi='A2'):   # tanpura-like Sa–Pa, re-struck every 4 s
    t = t0
    while t < t1 - .5:
        d = min(4.4, t1 - t + .6)
        samp('str', 'cellos', t, lo, d, v, -.2, attack=.6, release=1.0); samp('str', 'violas', t + .05, hi, d, v * .8, .2, attack=.6, release=1.0)
        samp('bass', 'contrabass', t, 'D1', d, v * .9, 0, attack=.5, release=1.0); t += 4.0
def flute(t, notes, v=.32, pan=.15):   # notes: [(pitch, beats)], beat = .5 s
    for p, b in notes:
        if p: samp('mel', 'flute', t, p, b * .5 + .15, v, pan, attack=.06)
        t += b * .5
    return t
def violin(t, notes, v=.34, pan=-.1):
    for p, b in notes:
        if p: samp('mel', 'violin', t, p, b * .5 + .2, v, pan, attack=.12)
        t += b * .5
def harp(t, ps, step=.16, v=.3, pan=.1): [samp('keys', 'harp', t + i * step, p, 2.0, v, pan) for i, p in enumerate(ps)]
def harmonium(t, d, ch, v=.13): [samp('keys', 'organ_soft', t + i * .02, p, d, v, (-.2, .2)[i % 2], attack=.25, release=.6) for i, p in enumerate(ch)]
def pad(t, d, ch, v=.13): [samp('str', 'violins' if S.midi(p) > 60 else 'violas', t + i * .05, p, d, v, (-.25, .25)[i % 2], attack=1.0, release=1.2) for i, p in enumerate(ch)]
def shimmer(t, d, ch=('D5', 'F#5', 'A5', 'C#6'), v=.12): [samp('keys', 'vibraphone_bowed', t + i * .12, p, d, v, (-.3, .3)[i % 2], attack=.5, release=1.2) for i, p in enumerate(ch)]
def bell(t, p='D4', v=.3, pan=.2): samp('perc', 'tubular_bells', t, p, 3.0, v, pan)
def chimes(t, ps, v=.22, step=.09): [samp('perc', 'hand_chimes', t + i * step, p, 2.0, v, .25) for i, p in enumerate(ps)]
def tabla(t0, t1, bpm=72, v=.16):
    b = 60 / bpm; i = 0
    while t0 + i * b < t1: hit('perc', 'world_perc', 'darbuka_doom' if i % 4 == 0 else 'darbuka_tak', t0 + i * b, v * (1 if i % 4 == 0 else .6), -.15); i += 1


# ———————————————————— score ————————————————————
def piano(t, notes, v=.32, pan=0., beat=.5):
    for p, b in notes:
        if p: [samp('keys', 'piano', t + i * .012, q, b * beat + .8, v, pan) for i, q in enumerate(p if isinstance(p, tuple) else (p,))]
        t += b * beat
    return t
def glass(t, ps, step=.14, v=.18, pan=.2): [samp('keys', 'glass', t + i * step, p, 1.6, v, pan) for i, p in enumerate(ps)]
def trem(t, d, ps, v=.1): [samp('str', 'violins_trem', t + i * .03, p, d, v, (-.3, .3)[i % 2], attack=.6) for i, p in enumerate(ps)]
def cello(t, notes, v=.3, pan=-.15):
    for p, b in notes:
        if p: samp('mel', 'cellos', t, p, b * .5 + .3, v, pan, attack=.15)
        t += b * .5
def lowpulse(t0, t1, p='A1', step=1.0, v=.16):
    t = t0
    while t < t1 - .1: samp('bass', 'contrabass_pizz', t, p, .8, v, 0); hit('perc', 'bass_drum', None, t, v * .7, 0); t += step
def digi(t, d, ch=('A4', 'E5', 'B5'), v=.1): [samp('keys', 'vibraphone_bowed', t + i * .1, p, d, v, (-.3, .3)[i % 2], attack=.5, release=1.0) for i, p in enumerate(ch)]
WORD = [('A4', 1), ('C5', 1), ('E5', 2), ('D5', 2)]
WORD2 = [('E5', 1), ('G5', 1), ('A5', 3)]


c = CU
def dread(t0, t1, v=.12, lo='A1', hi='Bb1'):   # a low minor-second drone that never resolves
    t = t0
    while t < t1 - .3:
        d = min(4.6, t1 - t + .6)
        samp('bass', 'contrabass', t, lo, d, v, -.15, attack=.8, release=1.2); samp('str', 'cellos', t + .1, hi, d, v * .8, .15, attack=.9, release=1.2); t += 4.2
def cluster(t, d, v=.08, notes=('E5', 'F5', 'Bb5', 'B5')): [samp('str', 'violins_trem', t + i * .05, p, d, v, (-.35, .35)[i % 2], attack=min(1.5, d * .5), release=.6) for i, p in enumerate(notes)]
def stinger(t, v=1.0):
    hit('perc', 'gran_cassa', None, t, .9 * v, 0); hit('perc', 'gong', None, t, .55 * v, 0)
    [samp('str', 'violins', t + i * .01, p, 1.6, .32 * v, (-.3, .3)[i % 2], attack=.01) for i, p in enumerate(['A4', 'Bb4', 'E5', 'F5'])]
    [samp('mel', m, t, p, 1.8, .45 * v, 0, attack=.02) for m, p in [('trombone', 'A1'), ('tuba', 'Bb1'), ('horn', 'E3')]]
def musicbox(t, notes, v=.13, beat=.42):   # a broken lullaby (A minor, slightly too slow)
    for p, b in notes:
        if p: samp('keys', 'glockenspiel', t, p, 1.6, v, .25); samp('keys', 'kalimba', t + .012, p, 1.2, v * .6, -.25)
        t += b * beat
    return t
LULL = [('E5', 1), ('A5', 1), ('C6', 1), ('B5', 2), ('A5', 1), ('G#5', 1), ('A5', 3), (None, 1), ('E5', 1), ('F5', 1), ('E5', 1), ('D5', 2), ('C5', 1), ('B4', 1), ('A4', 3)]
# A: hook 2:15 — dread drone + a thin tremolo cluster; the lullaby under "माँ"'s voice; stinger on the title
dread(c['A'], c['B'] + .3, .13); cluster(c['A'] + .5, 4.0, .06); musicbox(c['A'] + .4, LULL[:7], .1, .5); stinger(4.5, .8)
# B–D: the evening — uneasy calm: a soft minor piano, the drone very low
piano(c['B'] + .2, [(('A2', 'E3', 'C4'), 4), (('F2', 'C3', 'A3'), 4), (('D2', 'A2', 'F3'), 4)], .14, -.1); dread(c['B'], c['D'], .06)
glass(c['C'] + .3, ['E6', 'F6'], .6, .12); samp('keys', 'vibraphone_bowed', c['C'] + .3, 'Bb5', 4.0, .07, .2, attack=.8)
piano(c['D'] + .2, [(('C3', 'G3', 'E4'), 4), (('F2', 'C3', 'A3'), 4)], .14, .1); samp('keys', 'glass', 22.6, 'F6', 2.4, .16, -.3)   # the ear in the almirah
# E: sleep — the lullaby again, fading; the lamp dims
musicbox(c['E'] + .3, LULL, .09, .45); pad(c['E'], c['F'] - c['E'], ['A2', 'E3', 'C4'], .05)
# F: 2:15 — silence, a clock; THUD (foley) + a low hit
hit('perc', 'gran_cassa', None, 30.6, .4, 0); samp('bass', 'contrabass', 30.6, 'A0', 2.5, .2, 0)
# G: he wakes — a slow tremolo swell
cluster(c['G'], c['H'] - c['G'] + .5, .07, ('A4', 'Bb4', 'E5'))
# H: the scratching — irregular spiccato cellos, dread
H0 = c['H']; dread(H0, c['I'], .1)
for i in range(14): samp('str', 'cellos_spic', H0 + .3 + i * .37 + .08 * rng.standard_normal(), ['A2', 'Bb2', 'A2', 'E3'][i % 4], .25, .12, -.2)
# I: the door gap — high glass harmonics + rumble + the drone
I0 = c['I']; dread(I0, c['J'] + .3, .13, 'G#1', 'A1'); cluster(I0 + 1.5, c['J'] - I0, .07, ('D#6', 'E6', 'A6')); stinger(44.5, .55)
# J: hands over his mouth — almost nothing: heartbeat + breath (foley), one very low note
samp('bass', 'contrabass', c['J'], 'A0', 7.5, .14, 0, attack=1.5)
# K: knock knock — the lullaby, wrong and slow, under "बेटा… माँ हूँ…"
K0 = c['K']; musicbox(K0 + .6, LULL[:9], .12, .55); dread(K0, c['L'], .1); cluster(K0 + 1.0, 4.5, .05, ('B5', 'C6'))
# L: realisation — low brass swell
L0 = c['L']; [samp('mel', m, L0, p, 2.6, .22, 0, attack=1.0) for m, p in [('trombone', 'A1'), ('tuba', 'E1'), ('horn', 'Bb2')]]
# M: memory — the warm evening, muffled (just a soft pad)
pad(c['M'], c['N'] - c['M'], ['F2', 'C3', 'A3'], .07)
# N: he steps back — a rising cluster, faster and faster to the crash
N0 = c['N']; dread(N0, c['O'], .12)
for i, p in enumerate(['A4', 'Bb4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5']): cluster(N0 + i * .9, 1.2, .05 + .01 * i, (p,))
# O: CRASH — the big stinger; P: the lights die — a low rumble, then near-silence
stinger(c['O'], 1.15); samp('bass', 'contrabass', c['P'] + .1, 'A0', 3.5, .2, 0, attack=.5)
# Q: the almirah — creak (foley), a slow rising cluster to a stinger on the ear
Q0 = c['Q']; dread(Q0, c['Z'] + 3.0, .13); cluster(Q0 + .5, 83.5 - Q0 - .5, .06, ('E5', 'F5', 'Bb5', 'B5')); stinger(83.5, .9)
# Z: end card — the lullaby's first notes, unresolved, under the whisper
musicbox(c['Z'] + .3, LULL[:4], .1, .6)

# ———————————————————— foley ————————————————————
def env(n, a=.004, r=.05):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e
def nz(x, v): return (x / (np.abs(x).max() + 1e-9) * v).astype(np.float32)
def tt_(d): return np.arange(int(round(d * SR))) / SR
def tone(d, f0, f1, v, shape=lambda tt, d: np.exp(-tt / (d / 3))):
    tt = tt_(d); f = f0 + (f1 - f0) * tt / d
    return nz(np.sin(2 * np.pi * np.cumsum(f) / SR) * shape(tt, d), v)
def crickets(d):
    out = np.zeros(int(d * SR) + SR)
    for k in range(int(d * 2.2)):
        i = int(rng.uniform(0, d) * SR); f = rng.uniform(4200, 5200)
        for j in range(3):
            c = tone(.035, f, f, .02, lambda tt, d: np.sin(np.pi * tt / d)); a = i + int(j * .055 * SR); out[a:a + len(c)] += c
    return out.astype(np.float32)
def birds(d):
    out = np.zeros(int(d * SR) + SR)
    for k in range(int(d * 2)):
        i = int(rng.uniform(0, d) * SR); c = tone(.09, rng.uniform(3000, 4200), rng.uniform(2400, 5000), .045, lambda tt, d: np.sin(np.pi * tt / d)); out[i:i + len(c)] += c
    return out.astype(np.float32)
def cough():
    out = np.zeros(int(.7 * SR))
    for a in (0, .22):
        x = bp(noise(.16), 300, 2200) * np.exp(-tt_(.16) / .05); i = int(a * SR); out[i:i + len(x)] += x
    return nz(out, .12)
def clink(f): tt = tt_(.25); return (np.sin(2 * np.pi * f * tt) + .5 * np.sin(2 * np.pi * f * 2.7 * tt)) * np.exp(-tt / .05)
def coins(n, gold):
    out = np.zeros(int((n * .25 + .6) * SR))
    for k in range(n):
        x = clink(rng.uniform(2600, 3400) if gold else rng.uniform(1700, 2300)); i = int(k * (.09 if gold else .25) * SR); out[i:i + len(x)] += x
    return nz(out, .1 if gold else .09)
def hooves(d):
    out = np.zeros(int(d * SR) + SR)
    for k in range(int(d / .22)):
        x = nz(thump(.6, 140 + 40 * (k % 2)), .12); i = int(k * .22 * SR); out[i:i + len(x)] += x[:len(out) - i]
    return (out * np.linspace(.3, 1, len(out))).astype(np.float32)
def sparkle(d):
    out = np.zeros(int(d * SR) + 8000)
    for k in range(10):
        f = rng.uniform(2500, 5500); tt = tt_(.12); s = np.sin(2 * np.pi * f * tt) * np.exp(-tt / .04)
        i = int(rng.uniform(0, d) * SR); out[i:i + len(s)] += s
    return nz(out, .05)
def scribble(d):
    tt = tt_(d); x = bp(noise(d), 1400, 4200)[:len(tt)] * (.35 + .65 * np.abs(np.sin(np.pi * 7 * tt)) ** 2)
    return nz(x * env(len(x), .02, .1), .04)


def blip(f=1800, d=.06, v=.07): return tone(d, f, f, v, lambda tt, d: np.exp(-tt / (d / 2.5)))
def alarm():
    out = np.zeros(int(.9 * SR))
    for k in range(3): x = tone(.18, 1320, 1320, .12, lambda tt, d: np.where(tt < d * .85, 1., 0.)); i = int(k * .25 * SR); out[i:i + len(x)] += x
    return nz(out, .14)
def paper(): x = bp(noise(.35), 900, 5000)[:int(.35 * SR)] * np.exp(-tt_(.35) / .1); return nz(x, .07)
def gavel(): tt = tt_(.4); x = (np.sin(2 * np.pi * 180 * tt) + .6 * np.sin(2 * np.pi * 410 * tt)) * np.exp(-tt / .05) + bp(noise(.4), 300, 3000)[:len(tt)] * np.exp(-tt / .02) * .6; return nz(x, .3)
def clock(d):
    out = np.zeros(int(d * SR) + SR)
    for k in range(int(d)):
        x = nz(click(4.0 if k % 2 else 3.0, .5), .05); i = int(k * SR); out[i:i + len(x)] += x
    return out.astype(np.float32)
def murmur(d): x = bp(noise(d), 300, 1500)[:int(d * SR)]; return nz(x * (.6 + .4 * np.sin(2 * np.pi * .3 * tt_(d))[:len(x)]), .025)
def traffic(d): x = lp(noise(d), 300)[:int(d * SR)]; return nz(x, .04)
def sweep(d, f0, f1, v): return tone(d, f0, f1, v, lambda tt, d: np.sin(np.pi * tt / d))

def blip(f=1800, d=.06, v=.07): return tone(d, f, f, v, lambda tt, d: np.exp(-tt / (d / 2.5)))
def scratch(d):   # long nails behind plaster: rhythmic filtered noise strokes
    out = np.zeros(int(d * SR) + SR)
    for k in range(int(d / .55)):
        L = .32 + .1 * rng.random(); x = bp(noise(L), 1800, 6500) * np.sin(np.pi * tt_(L) / L) ** 2
        x = x * (1 + .6 * np.sin(2 * np.pi * 38 * tt_(L)))
        i = int(k * .55 * SR); out[i:i + len(x)] += x[:len(out) - i]
    return nz(out, .09)
def knock(): tt = tt_(.25); x = (np.sin(2 * np.pi * 110 * tt) + .5 * np.sin(2 * np.pi * 240 * tt)) * np.exp(-tt / .04) + bp(noise(.25), 200, 1500)[:len(tt)] * np.exp(-tt / .015); return nz(x, .28)
def roll(d):
    out = bp(noise(d), 1500, 5000) * (.5 + .5 * np.abs(np.sin(2 * np.pi * 6 * tt_(d))))
    return nz(out * np.linspace(.6, 1, len(out)), .05)
def glass_break():
    out = np.zeros(int(1.4 * SR))
    x = hp(noise(.6), 2500) * np.exp(-tt_(.6) / .12); out[:len(x)] += x * .8
    for k in range(18):
        f = rng.uniform(3000, 7500); c_ = tone(.25, f, f * .97, .2, lambda tt, d: np.exp(-tt / .05)); i = int(rng.uniform(0, .9) * SR); out[i:i + len(c_)] += c_[:len(out) - i]
    return nz(out, .35)
def buzz(d): tt = tt_(d); x = np.sign(np.sin(2 * np.pi * 150 * tt)) * (np.sin(2 * np.pi * 2.5 * tt) > 0); return nz(lp(x, 900) * .5, .08)
def breath(d):
    out = np.zeros(int(d * SR) + SR)
    for k in range(int(d / 1.6)):
        L = .9; x = bp(noise(L), 400, 2500) * np.sin(np.pi * tt_(L) / L) ** 3; i = int(k * 1.6 * SR); out[i:i + len(x)] += x[:len(out) - i]
    return nz(out, .035)
def slither(d): x = lp(noise(d), 500) * (.5 + .5 * np.sin(2 * np.pi * .8 * tt_(d))); return nz(x, .06)
def room_tone(d): return nz(lp(noise(d), 180), .012)

F = st['foley']
for e in EV:
    t, ty = e['t'], e['type']
    if ty == 'whoosh': add(F, whoosh(.3, .25), t - .1, .45, 0)
    elif ty == 'heartbeat':
        n = max(1, int(e['dur'] / .85))
        for k in range(n): add(F, nz(heartbeat(.9), .3 + .08 * k / n), t + k * .85, 1.0, 0)
    elif ty == 'night': add(st['amb'], room_tone(e['dur']), t, 1.0, 0)
    elif ty == 'evening': add(st['amb'], nz(bp(noise(e['dur']), 200, 1200)[:int(e['dur'] * SR)], .01), t, 1.0, 0)
    elif ty == 'stinger': pass
    elif ty == 'needle': add(F, nz(click(3.5, .5), .05), t, 1.0, -.3)
    elif ty == 'creakS': add(F, nz(creak(.6), .05), t, 1.0, -.6)
    elif ty == 'lampdim': add(F, nz(click(1.5, .4), .03), t, 1.0, .4)
    elif ty == 'buzz': add(F, buzz(e['dur']), t, 1.0, .3)
    elif ty == 'thud': add(F, nz(thump(1.0, 60), .95), t, 1.0, .2); add(F, nz(clack(.8, .8), .3), t + .02, 1.0, .2)
    elif ty == 'gasp': add(F, nz(bp(noise(.4), 500, 3000) * np.sin(np.pi * tt_(.4) / .4), .08), t, 1.0, 0)
    elif ty == 'scratch': add(F, scratch(e['dur']), t, 1.0, -.4)
    elif ty == 'step': add(F, nz(step(.6), .07), t, 1.0, 0)
    elif ty == 'breath': add(F, breath(e['dur']), t, 1.0, 0)
    elif ty == 'knock': add(F, knock(), t, 1.8, -.5)
    elif ty == 'memory': pass
    elif ty == 'clink': add(F, nz(clink(2600), .08), t, 1.0, .2)
    elif ty == 'roll': add(F, roll(e['dur']), t, 1.0, .2)
    elif ty == 'crash': add(F, glass_break(), t, 2.0, .2); add(F, nz(thump(1.0, 50), .7), t, 1.0, 0)
    elif ty == 'lampoff': add(F, nz(click(1.0, .8), .1), t, 1.0, .3); add(F, nz(rumble(2.0, 1.0)[:int(2.0 * SR)], .12), t, 1.0, 0)
    elif ty == 'slither': add(F, slither(e['dur']), t, 1.0, -.3)
    elif ty == 'creak': add(F, nz(creak(1.0), .14), t, 1.0, -.5); add(F, nz(creak(.7), .1), t + 1.4, 1.0, -.5)
    elif ty == 'write': pass

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
    if False:
        y = np.concatenate([x, np.zeros(int(1.4 * SR), np.float32)])
        for dl, g in [(.09, .35), (.19, .25), (.33, .18), (.52, .12), (.8, .07)]: d = int(dl * SR); y[d:d + len(x)] += g * lp(x, 3500)[:len(x)]
        x = (y / (np.abs(y).max() + 1e-9) * .8).astype(np.float32)
    if e.get('who') == 'X':   # THE THING doing Maa's voice: a little slower + lower, a cold room echo, a faint tremble
        y = resample_poly(x, 106, 100).astype(np.float32); tt = np.arange(len(y)) / SR; y = y * (1 + .12 * np.sin(2 * np.pi * 5.5 * tt))
        z = np.concatenate([y, np.zeros(int(1.6 * SR), np.float32)])
        for dl, g in [(.07, .4), (.16, .3), (.29, .22), (.47, .15), (.75, .09)]: d = int(dl * SR); z[d:d + len(y)] += g * lp(y, 2500)[:len(y)]
        x = (z / (np.abs(z).max() + 1e-9) * .8).astype(np.float32)
    if e.get('who') == 'N' and e['id'] == 'n10': x = x * 0.9
    add(V, x, e['t'], 1.0, 0)
    a = int(e['t'] * SR); vmask[a:a + len(x)] = 1
k = int(.15 * SR); sm = np.convolve(vmask, np.ones(k) / k, mode='same'); duck = 1 - .55 * sm



gains = {'bass': 1.1, 'str': 1.0, 'mel': .9, 'keys': .85, 'perc': .9}
mus = sum(st[k] * g for k, g in gains.items())
duck2 = 1 - .45 * sm
out = mus * duck2[:, None] + st['foley'] * 1.15 + st['amb'] * 1.0 + st['voice'] * 1.4
out = out[:int(DUR * SR)]
fade = int(.6 * SR); out[-fade:] *= np.linspace(1, 0, fade)[:, None]
pk = np.abs(out).max(); out = out / pk * 0.85
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out, SR)
print('mix ok', out.shape, 'peak', pk)
