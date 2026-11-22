"""Score + foley + Gemini voice for "असली कौन?" (Ep 7) → out/mix.wav
Sci-fi thriller in D minor, 96 bpm: tremolo strings + timpani on the door hook, a cold celesta/vibraphone "machine" ostinato for the
robot (D–F–A–C#), a bright pizzicato/marimba groove for the easy-life montage (F major) that sours into B-flat minor, brass + timpani
stabs on each twist, a ticking woodblock under the shutdown, low piano + contrabass in the cyber cell, a tam-tam on "तुम कौन हो?",
a heartbeat on Aryan's face, and the machine motif on the end card. Original melodies.
Voice: Gemini TTS lines in voice/<id>.wav (Aryan + robot Achird, narrator Sulafat, Maa Gacrux, officer Algenib).
"""
import sys, os, json
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '../..'))
sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio.sfx import SR, add, bp, lp, hp, noise, click, thump, whoosh, ding, crash, creak, heartbeat

S.seed(7)
EVJ = json.load(open(os.path.join(HERE, 'events.json')))
DUR = EVJ['dur'] if isinstance(EVJ, dict) and 'dur' in EVJ else 61.5
EV = EVJ['ev'] if isinstance(EVJ, dict) and 'ev' in EVJ else EVJ
N = int((DUR + 1.0) * SR)
rng = np.random.default_rng(7)
st = {k: np.zeros((N, 2), np.float32) for k in ['bass', 'str', 'mel', 'keys', 'perc', 'foley', 'amb', 'voice']}
CU = {e['id']: e['t'] for e in EV if e['type'] == 'cue'}

def samp(k, inst, t, p, d, v=.6, pan=0., g=1., attack=0., release=None):
    add(st[k], S.note(inst, p, d, v, release=release, attack=attack), t, g, pan)
def hit(k, inst, var, t, v=.6, pan=0.): add(st[k], S.hit(inst, var, v), t, 1.0, pan)
def trem(t, d, ps, v=.22): [samp('str', 'violins_trem', t + i * .03, p, d, v, (-.3, .3)[i % 2], attack=.3, release=.6) for i, p in enumerate(ps)]
def pad(t, d, ch, v=.16): [samp('str', 'violas' if i else 'cellos', t + i * .04, p, d, v, .2 * (-1) ** i, 1.0, attack=.8, release=1.0) for i, p in enumerate(ch)]
def timp(t, p='D2', v=.6): samp('perc', 'timpani', t, p, 1.5, v, 0)
def stab(t, ch=('D2', 'A2', 'D3', 'F3', 'A3'), v=.7):
    for p in ch: samp('str', 'violins_spic' if S.midi(p) > 55 else 'cellos_spic', t, p, .3, v)
    samp('mel', 'trombone', t, ch[0], .7, .55); samp('mel', 'french_horn', t, ch[2], .7, .45); timp(t, ch[0], .8); hit('perc', 'bass_drum', None, t, .6)
def celesta(t, p, v=.35, pan=.2): samp('keys', 'celesta', t, p, 1.2, v, pan)
def vib(t, p, v=.3, pan=-.2): samp('keys', 'vibraphone', t, p, 1.2, v, pan)
def pizz(t, p, v=.45, pan=-.1): samp('str', 'cellos_pizz', t, p, .4, v, pan)
def vpizz(t, p, v=.35, pan=.2): samp('str', 'violins_pizz', t, p, .3, v, pan)
def marimba(t, p, v=.4, pan=.15): samp('keys', 'marimba', t, p, .8, v, pan)
def glock(t, p, v=.3, pan=.25): samp('keys', 'glockenspiel', t, p, 1.5, v, pan)
def piano(t, p, d=1.5, v=.4, pan=0.): samp('keys', 'grand_piano', t, p, d, v, pan)
BT = 60 / 96
MACH = ['D5', 'F5', 'A5', 'C#6', 'A5', 'F5']   # the robot's motif
def machine(t0, t1, v=.28, inst=celesta):
    i = 0
    while t0 + i * BT / 2 < t1: inst(t0 + i * BT / 2, MACH[i % 6], v * (1.0 if i % 6 == 0 else .75)); i += 1

# A: the door — tremolo on D, timpani under the knocks, stab on the title
A0 = CU['A']; trem(A0, 3.2, ['D4', 'D5'], .2); samp('bass', 'contrabass', A0, 'D1', 3.0, .45, attack=.1)
for t in (.25, .65, 1.05): timp(A0 + t, 'D2', .45)
stab(3.0)
# B: the lab — the machine motif is born, a pad underneath; power-up shimmer on the eyes
B0 = CU['B']; pad(B0, 6.5, ['D2', 'A2', 'F3'], .14); machine(B0 + .3, CU['C'] - .2, .24, vib)
for i, p in enumerate(['D5', 'F5', 'A5', 'D6', 'F6', 'A6']): glock(9.8 + i * .09, p, .26)
# C: morning, promotion — bright pizzicato in F
C0 = CU['C']
for i in range(int((CU['D'] - C0) / (BT / 2))): (pizz if i % 2 == 0 else vpizz)(C0 + i * BT / 2, ['F2', 'C4', 'A2', 'C4', 'D3', 'A3', 'C3', 'A3'][i % 8], .35)
for p, b in [('C5', 0), ('F5', 1), ('A5', 2), ('G5', 3), ('F5', 4), ('C6', 5.5)]: marimba(14.0 + b * BT / 2, p, .4)
# D: the easy-life montage — groove in F, sours to B-flat minor as the robot stares
D0 = CU['D']; nD = int((21.2 - D0) / (BT / 2))
for i in range(nD): (pizz if i % 2 == 0 else vpizz)(D0 + i * BT / 2, ['F2', 'C4', 'A2', 'C4', 'Bb2', 'D4', 'C3', 'E4'][i % 8], .38)
for j, (p, b) in enumerate([('A4', 0), ('C5', 1), ('F5', 2), ('E5', 3), ('D5', 4), ('C5', 5), ('A4', 6), ('C5', 7)] * 2):
    tt = D0 + .3 + b * BT / 2 + (j // 8) * 4 * BT
    if tt < 21.1: marimba(tt, p, .35)
for i in range(8): hit('perc', 'world_perc', 'darbuka_tak', D0 + i * BT, .15, .3)
pad(21.2, 1.6, ['Bb1', 'F2', 'Db3'], .18); machine(21.2, 22.5, .22)
# E: the call — light tension, then the robot waves: stab
E0 = CU['E']; pad(E0 + 1.8, 5.0, ['D2', 'A2', 'F3'], .12)
for i in range(8): vib(E0 + 2.0 + i * BT / 2, ['D5', 'A4'][i % 2], .16)
stab(27.8, ('Bb1', 'F2', 'Bb2', 'Db3', 'F3'), .6); machine(28.0, 29.5, .2)
# F: his face — boom
F0 = CU['F']; timp(F0, 'D2', .8); hit('perc', 'bass_drum', None, F0, .5); trem(F0, 1.4, ['G#4', 'D5'], .2)
# G: shutdown — ticking clock, then ACCESS DENIED: big stab + alarm, rising tremolo
G0 = CU['G']
for i in range(4): hit('perc', 'woodblock', None, G0 + i * BT / 2, .35, .2)
stab(32.6); trem(32.8, 4.0, ['D4', 'A4'], .16); trem(34.8, 2.2, ['Eb4', 'Bb4'], .18); samp('bass', 'contrabass', 32.6, 'D1', 4.4, .45, attack=.05)
# H: the robot at the door — cold machine ostinato, cello drone, timpani heartbeat; the slam
H0 = CU['H']; machine(H0 + .2, 44.3, .3); samp('bass', 'contrabass', H0, 'D1', 7.2, .4, attack=.4); pad(H0, 7.2, ['D2', 'A2', 'C#3'], .13)
for i in range(int(7.0 / (BT * 2))): timp(H0 + .2 + i * BT * 2, 'D2', .3)
stab(44.45, ('D2', 'G#2', 'D3', 'F3', 'G#3'), .75)
# I: the cyber cell — low piano + contrabass pulse, brushed snare
I0 = CU['I']
for i in range(int((CU['J'] - I0) / BT)):
    piano(I0 + i * BT, ['D2', 'D2', 'F2', 'E2'][i % 4], 1.0, .28); samp('bass', 'contrabass', I0 + i * BT, ['D1', 'D1', 'F1', 'E1'][i % 4], .6, .3)
    if i % 2: hit('perc', 'snare', None, I0 + i * BT, .12, .1)
timp(51.6, 'A1', .55)
# J: the screen — tremolo rising, glock pings; the fingerprint match
J0 = CU['J']; trem(J0, 5.6, ['D4', 'F4'], .15); trem(J0 + 2.8, 2.8, ['G4', 'Bb4'], .17)
for i in range(6): glock(J0 + .3 + i * .8, ['A6', 'A6', 'Bb6', 'A6', 'C#7', 'D7'][i], .2)
samp('bass', 'contrabass', J0, 'D1', 5.6, .4, attack=.3)
# K: "तुम कौन हो?" — full stab + tam-tam, then the heartbeat on his face
K0 = CU['K']; stab(K0, ('D1', 'A1', 'D2', 'F2', 'A2'), .85); hit('perc', 'tamtam', None, K0, .55)
trem(K0 + .3, 1.6, ['C#5', 'D5'], .14)
# Z: end card — the machine motif one last time, unresolved
Z0 = CU['Z']; machine(Z0 + .05, DUR - .1, .3); pad(Z0, 1.5, ['D2', 'A2', 'F3'], .14)

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
def knock():
    x = thump(1.0, 110).astype(np.float32); c = click(.6, 1.0); n = min(len(x), len(c)); x[:n] += .4 * c[:n]; return nz(x, .45)
def slam(): x = thump(1.0, 55); return nz(x, .7)
def scan(d):
    tt = tt_(d); f = 900 + 500 * np.sin(2 * np.pi * 1.5 * tt)
    return nz(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), .1, .2) + .2 * hp(noise(d), 4000)[:len(tt)], .05)
def beep(f=1800): return tone(.12, f, f, .09, lambda tt, d: env(len(tt), .003, .02))
def powerup(d): return tone(d, 180, 1400, .08, lambda tt, d: np.clip(tt / d, 0, 1) * env(len(tt), .01, .15))
def birds(d):
    out = np.zeros(int(d * SR) + SR)
    for k in range(7):
        i = int(rng.uniform(0, d) * SR); c = tone(.09, rng.uniform(3000, 4200), rng.uniform(2400, 5000), .05, lambda tt, d: np.sin(np.pi * tt / d)); out[i:i + len(c)] += c
    return out.astype(np.float32)
def sparkle(d):
    out = np.zeros(int(d * SR) + 8000)
    for k in range(8):
        f = rng.uniform(2500, 5500); tt = tt_(.12); s = np.sin(2 * np.pi * f * tt) * np.exp(-tt / .04)
        i = int(rng.uniform(0, d) * SR); out[i:i + len(s)] += s
    return nz(out, .05)
def blip(): return tone(.07, rng.choice([660, 880, 990, 1320]), rng.choice([660, 1760]), .05, lambda tt, d: env(len(tt), .002, .02))
def ehum(d):
    tt = tt_(d); x = np.sin(2 * np.pi * 60 * tt) + .5 * np.sin(2 * np.pi * 120 * tt) + .3 * np.sin(2 * np.pi * 180 * tt)
    return nz(x * env(len(tt), .2, .3), .05)
def ring(d):
    tt = tt_(d); g = ((tt % .5) < .35).astype(float)
    return nz((np.sin(2 * np.pi * 1300 * tt) + np.sin(2 * np.pi * 1650 * tt)) * g * env(len(tt), .01, .05), .06)
def alarm(d):
    tt = tt_(d); f = np.where((tt % .5) < .25, 880, 660)
    return nz(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .5 * env(len(tt), .01, .2), .05)
def typing(d):
    out = np.zeros(int(d * SR) + 4000)
    for k in range(int(d * 12)):
        c = click(rng.uniform(1.5, 2.5), .5); i = int(k / 12 * SR + rng.uniform(0, .02) * SR); out[i:i + len(c)] += c[:len(out) - i]
    return nz(out, .06)
def scribble(d):
    tt = tt_(d); x = bp(noise(d), 1400, 4200)[:len(tt)] * (.35 + .65 * np.abs(np.sin(np.pi * 7 * tt)) ** 2)
    return nz(x * env(len(x), .02, .1), .05)

F = st['foley']
for e in EV:
    t, ty, pan = e['t'], e['type'], e.get('pan', 0)
    if ty == 'knock': add(F, knock(), t, 1.0, .2)
    elif ty == 'creak': add(F, nz(creak(1.0), .12), t, 1.0, .25)
    elif ty == 'slam': add(F, slam(), t, 1.0, .1); add(F, nz(crash(.4), .06), t, 1.0, .1)
    elif ty == 'stab': pass   # carried by the score
    elif ty == 'whoosh': add(F, whoosh(.25, .3), t - .1, .6, 0)
    elif ty == 'scan': add(F, scan(e['dur']), t, 1.0, .2)
    elif ty == 'beep': add(F, beep(), t, 1.0, .1)
    elif ty == 'ding': add(F, nz(ding(.6), .08), t, 1.0, .2)
    elif ty == 'powerup': add(F, powerup(e['dur']), t, 1.0, 0)
    elif ty == 'birds': add(st['amb'], birds(e['dur']), t, 1.0, -.3)
    elif ty == 'door': add(F, nz(creak(.6), .07), t, 1.0, .4)
    elif ty == 'sparkle': add(F, sparkle(e['dur']), t, 1.0, .2)
    elif ty == 'blip': add(F, blip(), t, 1.0, pan)
    elif ty == 'tick': add(F, nz(click(3.0, .5), .08), t, 1.0, .1)
    elif ty == 'hum': add(st['amb'], ehum(e['dur']), t, 1.0, .3)
    elif ty == 'ring': add(F, ring(e['dur']), t, 1.0, .1)
    elif ty == 'pickup': add(F, nz(click(1.2, .8), .1), t, 1.0, 0)
    elif ty == 'tap': add(F, nz(click(1.8, .8), .1), t, 1.0, 0)
    elif ty == 'alarm': add(F, alarm(e['dur']), t, 1.0, 0)
    elif ty == 'shove': add(F, nz(thump(.8, 90), .3), t, 1.0, -.1); add(F, whoosh(.2, .25), t, .5, -.1)
    elif ty == 'hit': add(F, nz(thump(.7, 60), .35), t, 1.0, 0)
    elif ty == 'typing': add(F, typing(e['dur']), t, 1.0, .25)
    elif ty == 'write': add(F, scribble(e['dur']), t, 1.0, .2)
# heartbeat on his face at the end
for i in range(3): add(F, nz(heartbeat(.9), .3), 59.2 + i * .75, 1.0, 0)
A = st['amb']; tone_ = lp(noise(DUR + 1.0), 400)[:N] * .004
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
    if e['id'] == 'c1':   # the robot: same voice, a faint metallic ring-mod + short slap echo
        tt = np.arange(len(x)) / SR; x = (.82 * x + .18 * x * np.sin(2 * np.pi * 55 * tt)).astype(np.float32)
        d = int(.045 * SR); y = x.copy(); y[d:] += .25 * x[:-d]; x = (y / (np.abs(y).max() + 1e-9) * .8).astype(np.float32)
    add(V, x, e['t'], 1.0, 0)
    a = int(e['t'] * SR); vmask[a:a + len(x)] = 1
k = int(.15 * SR); sm = np.convolve(vmask, np.ones(k) / k, mode='same'); duck = 1 - .6 * sm

gains = {'bass': 1.0, 'str': .9, 'mel': .85, 'keys': .85, 'perc': .8}
mus = sum(st[k] * g for k, g in gains.items())
out = mus * duck[:, None] + (st['foley'] * 1.1 + st['amb']) * (1 - .3 * sm)[:, None] + st['voice'] * 1.35
out = out[:int(DUR * SR)]
fade = int(.4 * SR); out[-fade:] *= np.linspace(1, 0, fade)[:, None]
pk = np.abs(out).max(); out = out / pk * 0.85
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out, SR)
print('mix ok', out.shape, 'peak', pk)
