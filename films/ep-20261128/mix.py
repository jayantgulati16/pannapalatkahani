"""Score + foley + Gemini voice for "0000 · लफ़्ज़ों का क़र्ज़ (भाग 2)" (Ep 11) → out/mix.wav
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
from core.audio.sfx import SR, add, bp, lp, hp, noise, click, thump, whoosh, ding, crash, heartbeat

S.seed(11)
EVJ = json.load(open(os.path.join(HERE, 'events.json')))
DUR = EVJ['dur'] if isinstance(EVJ, dict) and 'dur' in EVJ else 87.0
EV = EVJ['ev'] if isinstance(EVJ, dict) and 'ev' in EVJ else EVJ
N = int((DUR + 1.0) * SR)
rng = np.random.default_rng(11)
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
MAJ = [('A4', 1), ('C#5', 1), ('E5', 2), ('D5', 2)]
# A: same corridor as भाग 1's end — low pulse + tremolo under the heartbeat/clock (foley)
A0 = c['A']; lowpulse(A0, c['B'], 'A1', 1.0, .11); trem(A0, c['B'] - A0, ['A3', 'E4'], .07)
samp('bass', 'contrabass', 3.6, 'A1', 2.4, .2, 0); hit('perc', 'gran_cassa', None, 3.6, .3, 0); digi(3.7, 2.2, ('A4', 'C#5', 'E5'), .08)
# B: पिछले भाग में — the WORD theme on glass, sepia
B0 = c['B']; glass(B0 + .2, [p for p, _ in WORD], .45, .14); pad(B0, c['C'] - B0, ['A2', 'E3', 'C4'], .08)
# C: the fight in court — brave ostinato, a horn call rising
C0 = c['C']
for i in range(int((c['D'] - C0) / .25)): samp('str', 'cellos_spic', C0 + i * .25, ['A2', 'A2', 'E3', 'A2', 'C3', 'A2', 'G3', 'A2'][i % 8], .3, .15, -.1)
samp('mel', 'horn', C0 + .3, 'E3', 1.4, .3, 0, attack=.1); samp('mel', 'horn', C0 + 1.8, 'A3', 1.6, .32, 0, attack=.1); samp('mel', 'horn', C0 + 3.6, 'C4', 2.0, .34, 0, attack=.1)
hit('perc', 'timpani', None, C0 + 1.8, .25, 0); hit('perc', 'timpani', None, C0 + 3.6, .3, 0); trem(C0 + 5.2, 1.9, ['A4', 'C5', 'E5'], .09)
# D: the verdict — hush, then the gavel → A-major bloom
D0 = c['D']; pad(D0, 2.7, ['A2', 'E3', 'A3'], .07)
G0 = 21.8; pad(G0, c['E'] - G0 + 1.0, ['A2', 'E3', 'A3', 'C#4', 'E4'], .16); samp('mel', 'horn', G0, 'A3', 2.0, .32, 0, attack=.05); samp('mel', 'horn', G0 + .05, 'E4', 1.8, .26, 0, attack=.05); bell(G0, 'A4', .25)
# E: the hug — warm strings, a gentle violin
E0 = c['E']; pad(E0, c['F'] - E0, ['F2', 'C3', 'A3', 'C4'], .12); violin(E0 + .6, [('C5', 2), ('A4', 1), ('C5', 1), ('D5', 2), ('C5', 3)], .26)
# F: running to Aarav — the café theme returns, light and happy
F0 = c['F']; t_ = F0
for ch in [('F3', 'A3', 'C4'), ('C3', 'G3', 'E4'), ('A2', 'E3', 'C4'), ('G2', 'D3', 'B3')]:
    piano(t_, [(ch, 4)], .2, -.1); t_ += 1.75
piano(F0 + .5, [('C5', 1), ('E5', 1), ('G5', 2), ('F5', 1), ('E5', 1), ('D5', 2), ('C5', 1), ('D5', 1), ('E5', 3)], .26, .1)
# G: his 0000 — everything drops to a single low A and a glass note
G1 = c['G']; samp('keys', 'piano', G1, 'A1', 4.0, .3, 0); glass(G1 + .4, ['E6'], .3, .12); pad(G1, c['H'] - G1, ['A2', 'E3', 'C4'], .07)
cello(G1 + 2.6, [('E3', 2), ('D3', 1), ('C3', 1), ('B2', 3)], .24)
# H: the bands join — a rising tremolo of doubt
H0 = c['H']; [trem(H0 + i * .7, .9, [p], .07 + .012 * i) for i, p in enumerate(['A4', 'Bb4', 'B4', 'C5'])]
# I: TWIST — the history: gong, low boom, string stab, glass cluster
I0 = c['I']; hit('perc', 'gong', None, I0, .45, 0); hit('perc', 'gran_cassa', None, I0, .5, 0); samp('bass', 'contrabass', I0, 'A1', 3.5, .25, 0)
[samp('str', 'violins', I0 + i * .02, p, 2.8, .14, (-.3, .3)[i % 2], attack=.05) for i, p in enumerate(['A4', 'C5', 'E5', 'A5'])]; glass(I0 + .3, ['A6', 'C7', 'E7'], .12, .14)
# J: the flashback — a music box (glockenspiel + kalimba) plays the WORD theme slowly, soft pad
J0 = c['J']; pad(J0, c['K'] - J0 + .5, ['A2', 'E3', 'A3', 'C4'], .09)
t_ = J0 + .5
for rep in range(3):
    for p, bt in WORD + [(None, 1)] + WORD2 + [(None, 2)]:
        if p: samp('keys', 'glockenspiel', t_, p, 1.5, .16, .2); samp('keys', 'kalimba', t_, p, 1.2, .12, -.2)
        t_ += bt * .45
    if t_ > c['K'] - 1: break
# K: "एक बात कहने के लिए" — tender solo violin
K0 = c['K']; violin(K0 + .3, WORD2 + [('G5', 1), ('E5', 1), ('D5', 2), ('C5', 1), ('E5', 3)], .3); pad(K0, c['L'] - K0, ['F2', 'C3', 'A3', 'E4'], .1)
# L: she breaks down — cello + piano
L0 = c['L']; cello(L0 + .3, [('E3', 2), ('D3', 1), ('C3', 1), ('B2', 2), ('A2', 3), ('C3', 1), ('B2', 1), ('A2', 3)], .28)
piano(L0, [(('A2', 'E3', 'C4'), 4), (('F2', 'C3', 'A3'), 4), (('D2', 'A2', 'F3'), 4), (('E2', 'B2', 'G#3'), 4)], .18)
# M: she sends 200 — rising harp + glass
M0 = c['M']; harp(M0 + .3, ['A3', 'C#4', 'E4', 'A4', 'C#5', 'E5', 'A5'], .18, .26); glass(M0 + .6, ['A5', 'C#6', 'E6', 'A6'], .25, .14)
# N: his first words — almost silence: a soft high pad so the voice stands alone; then the theme blooms in A MAJOR
N0 = c['N']; pad(N0, 3.4, ['A3', 'E4'], .05)
B1 = 77.7; pad(B1, c['P'] - B1 + .5, ['A2', 'E3', 'A3', 'C#4', 'E4'], .15); violin(B1 + .2, MAJ + [('E5', 1), ('F#5', 1), ('A5', 3)], .32)
piano(B1, [(('A2', 'E3', 'C#4'), 4), (('F#2', 'C#3', 'A3'), 4)], .2)
# P: the sketchbook — music box + harp, resolving home in A major
P0 = c['P']; [samp('keys', 'glockenspiel', P0 + .3 + i * .4, p, 1.6, .16, .2) for i, p in enumerate(['A5', 'C#6', 'E6', 'D6', 'C#6', 'A5'])]
harp(P0, ['A3', 'E4', 'A4', 'C#5', 'E5'], .16, .22); pad(P0, DUR - P0, ['A2', 'E3', 'A3', 'C#4', 'E4'], .13)
Z0 = c['Z']; bell(Z0, 'A4', .26); samp('keys', 'piano', Z0, ('A2'), 3.5, .25, 0); glass(Z0 + .5, ['C#6', 'E6', 'A6'], .3, .12)

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

F = st['foley']; ZEROS = []
for e in EV:
    t, ty = e['t'], e['type']
    if ty == 'birds': add(st['amb'], birds(e['dur']), t, 1.0, -.3)
    elif ty == 'whoosh': add(F, whoosh(.25, .25), t - .1, .5, 0)
    elif ty == 'heartbeat':
        n = max(1, int(e['dur'] / .9))
        for k in range(n): add(F, nz(heartbeat(.9), .26 + .06 * k / n), t + k * .9, 1.0, 0)
    elif ty == 'tick': add(F, blip(2000, .06, .08), t, 1.0, .1)
    elif ty == 'ticks':
        n = int(e['dur'] / .12)
        for k in range(n): add(F, blip(1600 + 800 * k / n, .04, .05), t + k * .12, 1.0, .1)
    elif ty == 'zero': add(F, alarm(), t, 1.0, 0); add(F, nz(thump(.6, 45), .3), t, 1.0, 0); ZEROS.append(t)
    elif ty == 'glitch': [add(F, blip(rng.uniform(600, 3000), .03, .06), t + k * .05, 1.0, rng.uniform(-.5, .5)) for k in range(8)]
    elif ty == 'sparkle': add(F, sparkle(e['dur']), t, 1.0, .2)
    elif ty == 'city': add(st['amb'], traffic(e['dur']), t, 1.0, 0)
    elif ty == 'cafe': add(st['amb'], murmur(e['dur']), t, 1.0, -.2); [add(F, nz(clink(rng.uniform(2400, 3200)), .03), t + rng.uniform(.5, e['dur'] - .5), 1.0, .3) for _ in range(4)]
    elif ty == 'laugh': add(F, sparkle(1.0), t, .6, .3)
    elif ty == 'page': add(F, paper(), t, 1.0, -.2)
    elif ty == 'beep':
        for k in range(int(e['dur'] / .7)): add(F, blip(1400, .08, .05), t + k * .7, 1.0, .2)
    elif ty == 'gavel': add(F, gavel(), t, 1.0, 0); hit('perc', 'gong', None, t, .2, 0)
    elif ty == 'clock': add(F, clock(e['dur']), t, 1.0, .3)
    elif ty == 'join': add(F, nz(click(2.0, .6), .1), t, 1.0, 0); add(F, sweep(.6, 200, 400, .04), t, 1.0, 0)
    elif ty == 'transfer': add(F, sweep(e['dur'], 300, 1800, .05), t, 1.0, 0); add(F, sparkle(e['dur']), t, 1.0, 0)
    elif ty == 'ding': add(F, blip(2640, .5, .1), t, 1.0, 0); add(F, blip(3520, .5, .06), t + .12, 1.0, 0)
    elif ty == 'write': add(F, scribble(e['dur']), t, 1.0, .2)
    elif ty == 'tv': add(F, nz(bp(noise(.5), 1000, 6000)[:int(.5 * SR)] * np.exp(-tt_(.5) / .2), .05), t, 1.0, -.3); add(F, blip(1000, .12, .05), t + .4, 1.0, -.3)
    elif ty == 'sting': add(F, nz(thump(.9, 40), .35), t, 1.0, 0); add(F, whoosh(.6, .4), t - .5, .7, 0)
    elif ty == 'monitor':
        for k in range(int(e['dur'] / 1.1)): add(F, blip(1046, .09, .025), t + .3 + k * 1.1, 1.0, -.4)
A = st['amb']; tone_ = lp(noise(DUR + 1.0), 400)[:N] * .003
A[:len(tone_), 0] += tone_; A[:len(tone_), 1] += tone_
# 0000 = total silence: music + ambience cut for ~1 s after each zero (the alarm itself stays)
SIL = np.ones(N, np.float32)
for z in ZEROS:
    a = int((z + .35) * SR); b = int((z + 1.15) * SR); r = int(.35 * SR)
    SIL[a:b] = 0; SIL[b:b + r] = np.minimum(SIL[b:b + r], np.linspace(0, 1, r)[:max(0, min(r, N - b))])
    SIL[a - int(.1 * SR):a] = np.linspace(1, 0, int(.1 * SR))

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
    if False:   # the divine voice: a temple echo
        y = np.concatenate([x, np.zeros(int(1.4 * SR), np.float32)])
        for dl, g in [(.09, .35), (.19, .25), (.33, .18), (.52, .12), (.8, .07)]: d = int(dl * SR); y[d:d + len(x)] += g * lp(x, 3500)[:len(x)]
        x = (y / (np.abs(y).max() + 1e-9) * .8).astype(np.float32)
    add(V, x, e['t'], 1.0, 0)
    a = int(e['t'] * SR); vmask[a:a + len(x)] = 1
k = int(.15 * SR); sm = np.convolve(vmask, np.ones(k) / k, mode='same'); duck = 1 - .55 * sm


gains = {'bass': 1.0, 'str': .95, 'mel': .9, 'keys': .85, 'perc': .8}
mus = sum(st[k] * g for k, g in gains.items())
out = mus * (duck * SIL)[:, None] + st['foley'] * 1.1 + st['amb'] * ((1 - .3 * sm) * SIL)[:, None] + st['voice'] * 1.35
out = out[:int(DUR * SR)]
fade = int(.5 * SR); out[-fade:] *= np.linspace(1, 0, fade)[:, None]
pk = np.abs(out).max(); out = out / pk * 0.85
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out, SR)
print('mix ok', out.shape, 'peak', pk)
