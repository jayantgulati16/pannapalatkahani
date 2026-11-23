"""Score + foley + Gemini voice for "असली भक्ति (भाग 2)" (Ep 9) → out/mix.wav (same palette as Ep 8; resolves to D major)
Devotional score on D: a tanpura-like drone (Sa–Pa on cellos/violas/contrabass), a bansuri-style flute singing raag Bhairav phrases
(D Eb F# G A Bb C#) for the night/sorrow and Bhoopali (D E F# A B) for the dawn pond, temple bells + a harmonium-like soft organ
in the mandir, a solo-violin lament while Raghav cries all night, a bowed-vibraphone shimmer whenever the merchant (= Vishnu) is near,
heartbeats on the dilemma, a warm D-major resolution when Maa wakes, a conch-like horn + tubular bells + gong when the doors glow, and
an unresolved flute phrase under "भाग 2 में…". Original melodies. Voices: voice/<id>.wav (Gemini TTS); p1 = the divine voice, with a temple echo.
"""
import sys, os, json
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '../..'))
sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio.sfx import SR, add, bp, lp, hp, noise, click, thump, whoosh, ding, crash, heartbeat

S.seed(9)
EVJ = json.load(open(os.path.join(HERE, 'events.json')))
DUR = EVJ['dur'] if isinstance(EVJ, dict) and 'dur' in EVJ else 85.0
EV = EVJ['ev'] if isinstance(EVJ, dict) and 'ev' in EVJ else EVJ
N = int((DUR + 1.0) * SR)
rng = np.random.default_rng(9)
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

# A: the hook (continues भाग 1) — the doors glow, a voice from the light: hushed shimmer + drone, a rising tremolo
A0 = CU['A']; shimmer(A0, CU['B'] + .3, ('D5', 'F#5', 'A5', 'C#6'), .12); drone(A0, CU['B'] + .5, .08)
[samp('str', 'violins_trem', A0 + 1.6 + i * .03, p, 2.6, .1, (-.3, .3)[i], attack=1.2) for i, p in enumerate(('A4', 'D5'))]
# B: प्रकट — conch-like horn, bells, gong, a full D-major bloom with chimes
B0 = CU['B']; samp('mel', 'horn', B0, 'D3', 2.4, .42, 0, attack=.2); samp('mel', 'horn', B0 + .1, 'A3', 2.2, .3, 0, attack=.25)
bell(B0, 'D4', .35); bell(B0 + .7, 'A4', .28); hit('perc', 'gong', None, B0, .35)
pad(B0, CU['C'] - B0 + .3, ['D3', 'A3', 'D4', 'F#4', 'A4'], .15); chimes(B0 + .2, ['D6', 'E6', 'F#6', 'A6', 'B6', 'D7'], .18, .12)
# B2: "ये फूल…" — harmonium under his line; the title
harmonium(CU['B2'], CU['C'] - CU['B2'] + .3, ['D3', 'F#3', 'A3', 'D4'], .1); bell(CU['B2'] + 1.0, 'D3', .3)
# C: पिछले भाग में — the sorrow returns: drone + the violin lament
C0 = CU['C']; drone(C0, CU['D'] + .2, .11)
violin(C0 + .4, [('A4', 2), ('Bb4', 1), ('A4', 1), ('G4', 2), ('F#4', 1), ('G4', 1), ('Eb4', 2), ('D4', 3)], .3)
# D: "ये आपके हाथ में कैसे?" — suspended shimmer
D0 = CU['D']; shimmer(D0, CU['E'] - D0 + .4, ('D5', 'G5', 'A5', 'C#6'), .12); drone(D0, CU['E'] + .2, .08)
# E: flashback — the merchant glows: tremolo rising, chimes on each clue
E0 = CU['E']; [samp('str', 'violins_trem', E0 + i * .9, p, 1.4, .1 + .02 * i, (-.3, .3)[i % 2], attack=.3) for i, p in enumerate(['D5', 'E5', 'F#5'])]
for t_ in (18.9, 19.7, 20.5): chimes(t_, ['A6'], .16)
# F: the reveal — conch-like horn, bells, gong, full D major
F0 = CU['F']; samp('mel', 'horn', F0, 'D3', 2.4, .42, 0, attack=.25); samp('mel', 'horn', F0 + .1, 'A3', 2.2, .3, 0, attack=.3)
bell(F0, 'D4', .35); bell(F0 + .7, 'A4', .28); hit('perc', 'gong', None, F0, .35)
pad(F0, CU['G'] - F0, ['D3', 'A3', 'D4', 'F#4', 'A4'], .16); chimes(F0 + .3, ['D6', 'E6', 'F#6', 'A6', 'B6', 'D7'], .18, .12)
# G: ashamed — a soft Bhairav flute over the drone
G0 = CU['G']; drone(G0, CU['H'] + .2, .09)
flute(G0 + .5, [('Bb4', 1), ('A4', 2), ('G4', 1), ('F#4', 1), ('Eb4', 1), ('D4', 3)], .2)
# H: the blessing — warm harmonium + strings in D major, the flute sings gently
H0 = CU['H']; harmonium(H0, CU['I'] - H0 + .4, ['D3', 'A3', 'D4', 'F#4'], .12); pad(H0, CU['I'] - H0 + .4, ['D3', 'A3', 'F#4', 'A4'], .12)
flute(H0 + 1.0, [('F#5', 2), ('E5', 1), ('D5', 1), ('E5', 2), ('F#5', 1), ('A5', 1), ('B5', 2), ('A5', 2), ('F#5', 1), ('E5', 1), ('D5', 3)], .22)
tabla(H0 + .5, CU['I'] - .2, 66, .1)
# I: he vanishes into light — rising chimes, the shimmer
I0 = CU['I']; chimes(I0, ['D6', 'E6', 'F#6', 'A6', 'B6', 'D7', 'E7'], .18, .16); shimmer(I0, 3.2, v=.12)
# J: Maa, healthy — Bhoopali, harp + flute, joy
J0 = CU['J']; harp(J0, ['D4', 'F#4', 'A4', 'B4', 'D5', 'E5', 'F#5', 'A5'], .14, .26); pad(J0, CU['K'] - J0, ['D3', 'A3', 'F#4'], .1)
flute(J0 + 1.2, [('D5', 1), ('E5', 1), ('F#5', 2), ('A5', 1), ('F#5', 1), ('E5', 2), ('D5', 2)], .26)
# K: the pond full of lotuses — bright, dancing tabla, harp ripples, flute
K0 = CU['K']; tabla(K0, CU['L'] - .2, 88, .14); harp(K0, ['D5', 'F#5', 'A5', 'B5', 'D6'], .1, .24); harp(K0 + 3.4, ['A4', 'B4', 'D5', 'E5', 'F#5', 'A5'], .1, .22)
flute(K0 + .8, [('A5', 1), ('B5', 1), ('D6', 2), ('B5', 1), ('A5', 1), ('F#5', 2), ('E5', 1), ('F#5', 1), ('A5', 3)], .28)
pad(K0, CU['L'] - K0, ['D3', 'A3', 'F#4', 'A4'], .12)
# L: the mandir — bells, harmonium, the devotional theme resolving home
L0 = CU['L']; bell(L0, 'A4', .25); harmonium(L0, DUR - L0, ['D3', 'A3', 'D4', 'F#4'], .11); tabla(L0 + .5, CU['Z'] - .2, 72, .1)
flute(L0 + 1.4, [('F#5', 2), ('E5', 1), ('D5', 1), ('E5', 2), ('A4', 2), ('B4', 1), ('D5', 1), ('E5', 1), ('D5', 4)], .24)
chimes(62.0, ['D7', 'A6'], .16)
# Z: end card — a last bell, the drone settles on D
Z0 = CU['Z']; bell(Z0, 'D4', .3); drone(Z0, DUR, .09)

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

F = st['foley']
for e in EV:
    t, ty = e['t'], e['type']
    if ty == 'crickets': add(st['amb'], crickets(e['dur']), t, 1.0, .25)
    elif ty == 'birds': add(st['amb'], birds(e['dur']), t, 1.0, -.3)
    elif ty == 'whoosh': add(F, whoosh(.25, .25), t - .1, .5, 0)
    elif ty == 'bell': hit('perc', 'nepal_bells', None, t, .35, .3)
    elif ty == 'chime': chimes(t, ['D6', 'A6'], .16)
    elif ty == 'cough': add(F, cough(), t, 1.0, -.15)
    elif ty == 'heartbeat': add(F, nz(heartbeat(.9), .28), t, 1.0, 0)
    elif ty == 'coins': add(F, coins(10 if e.get('gold') else 4, e.get('gold')), t, 1.0, .1)
    elif ty == 'tick': add(F, nz(click(3.0, .5), .06), t, 1.0, .1)
    elif ty == 'hooves': add(F, hooves(e['dur']), t, 1.0, .4)
    elif ty == 'sparkle': add(F, sparkle(e['dur']), t, 1.0, .2)
    elif ty == 'hit': add(F, nz(thump(.7, 60), .25), t, 1.0, 0)
    elif ty == 'glint': add(F, tone(.5, 3520, 3520, .05), t, 1.0, .3)
    elif ty == 'write': add(F, scribble(e['dur']), t, 1.0, .2)
    elif ty == 'flash': add(F, whoosh(.5, .4), t - .2, .8, 0); add(F, nz(thump(.6, 50), .25), t, 1.0, 0)
A = st['amb']; tone_ = lp(noise(DUR + 1.0), 400)[:N] * .003
A[:len(tone_), 0] += tone_; A[:len(tone_), 1] += tone_

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
    if e['id'] in ('p1', 'p2'):   # the divine voice: a temple echo
        y = np.concatenate([x, np.zeros(int(1.4 * SR), np.float32)])
        for dl, g in [(.09, .35), (.19, .25), (.33, .18), (.52, .12), (.8, .07)]: d = int(dl * SR); y[d:d + len(x)] += g * lp(x, 3500)[:len(x)]
        x = (y / (np.abs(y).max() + 1e-9) * .8).astype(np.float32)
    add(V, x, e['t'], 1.0, 0)
    a = int(e['t'] * SR); vmask[a:a + len(x)] = 1
k = int(.15 * SR); sm = np.convolve(vmask, np.ones(k) / k, mode='same'); duck = 1 - .55 * sm

gains = {'bass': 1.0, 'str': .95, 'mel': .9, 'keys': .85, 'perc': .8}
mus = sum(st[k] * g for k, g in gains.items())
out = mus * duck[:, None] + (st['foley'] * 1.1 + st['amb']) * (1 - .3 * sm)[:, None] + st['voice'] * 1.35
out = out[:int(DUR * SR)]
fade = int(.5 * SR); out[-fade:] *= np.linspace(1, 0, fade)[:, None]
pk = np.abs(out).max(); out = out / pk * 0.85
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out, SR)
print('mix ok', out.shape, 'peak', pk)
