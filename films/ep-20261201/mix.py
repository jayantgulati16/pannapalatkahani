"""Score + foley + Gemini voice for "आख़िरी मेट्रो (भाग 1)" (Ep 14) — HORROR with a mother's heart → out/mix.wav
D minor. Under everything the last metro: a low rumble and the wheel joints (clack-clack). The MAA theme (D–F–A–G–F–E–D, a simple
lullaby) is planted on a music box under the old woman and returns, broken and slow, when she says "बेटा…" — it pays off in भाग 2.
Dread = a contrabass/cello minor-second drone; scares = stinger (gran cassa + gong + violin cluster + low brass) + light flicker buzz;
the run = spiccato cellos + footsteps. Original melodies. Voices: voice/<id>.wav (Gemini TTS)."""
import sys, os, json
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '../..'))
sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio.sfx import SR, add, bp, lp, hp, noise, click, thump, whoosh, ding, heartbeat, clack, step, rumble, brown

S.seed(14)
EVJ = json.load(open(os.path.join(HERE, 'events.json')))
DUR, EV = EVJ['dur'], EVJ['ev']
N = int((DUR + 1.0) * SR)
rng = np.random.default_rng(14)
st = {k: np.zeros((N, 2), np.float32) for k in ['bass', 'str', 'mel', 'keys', 'perc', 'foley', 'amb', 'voice']}
CU = {e['id']: e['t'] for e in EV if e['type'] == 'cue'}

def samp(k, inst, t, p, d, v=.6, pan=0., g=1., attack=0., release=None):
    if t >= DUR: return
    add(st[k], S.note(inst, p, d, v, release=release, attack=attack), t, g, pan)
def hit(k, inst, var, t, v=.6, pan=0.): add(st[k], S.hit(inst, var, v), t, 1.0, pan)
def dread(t0, t1, v=.12, lo='D1', hi='Eb2'):
    t = t0
    while t < t1 - .3:
        d = min(4.6, t1 - t + .6)
        samp('bass', 'contrabass', t, lo, d, v, -.15, attack=.8, release=1.2); samp('str', 'cellos', t + .1, hi, d, v * .8, .15, attack=.9, release=1.2); t += 4.2
def cluster(t, d, v=.08, notes=('A5', 'Bb5', 'D6', 'Eb6')): [samp('str', 'violins_trem', t + i * .05, p, d, v, (-.35, .35)[i % 2], attack=min(1.5, d * .5), release=.6) for i, p in enumerate(notes)]
def stinger(t, v=1.0):
    hit('perc', 'gran_cassa', None, t, .9 * v, 0); hit('perc', 'gong', None, t, .5 * v, 0)
    [samp('str', 'violins', t + i * .01, p, 1.6, .32 * v, (-.3, .3)[i % 2], attack=.01) for i, p in enumerate(['D5', 'Eb5', 'A5', 'Bb5'])]
    [samp('mel', m, t, p, 1.8, .45 * v, 0, attack=.02) for m, p in [('trombone', 'D2'), ('tuba', 'Eb1'), ('horn', 'A2')]]
def musicbox(t, notes, v=.13, beat=.42):
    for p, b in notes:
        if p: samp('keys', 'glockenspiel', t, p, 1.6, v, .25); samp('keys', 'kalimba', t + .012, p, 1.2, v * .6, -.25)
        t += b * beat
    return t
def pad(t, d, ch, v=.1): [samp('str', 'violins' if S.midi(p) > 60 else 'violas', t + i * .05, p, d, v, (-.25, .25)[i % 2], attack=1.0, release=1.2) for i, p in enumerate(ch)]
def vib(t, d, ch, v=.08): [samp('keys', 'vibraphone_bowed', t + i * .12, p, d, v, (-.3, .3)[i % 2], attack=.5, release=1.2) for i, p in enumerate(ch)]
def cello(t, notes, v=.26, pan=-.15, beat=.5):
    for p, b in notes:
        if p: samp('mel', 'cellos', t, p, b * beat + .3, v, pan, attack=.2)
        t += b * beat
MAA = [('D5', 1), ('F5', 1), ('A5', 2), ('G5', 1), ('F5', 1), ('E5', 2), ('D5', 3)]
MAA2 = [('A4', 1), ('C5', 1), ('D5', 2), ('F5', 1), ('E5', 1), ('D5', 4)]
c = CU
# A: the empty coach — dread + glass + the Maa theme far away on the music box
dread(c['A'], c['B'] + .5, .1); cluster(c['A'] + .6, 5.0, .045, ('A5', 'Bb5')); musicbox(c['A'] + 1.2, MAA, .07, .55)
# B: Rohan, tired; the phone — a warm, sad pad (his own mother) then cold again after he cuts the call
pad(c['B'] + .2, 8.0, ['D3', 'A3', 'F4'], .07); vib(c['B'] + 3.6, 4.5, ('F5', 'A5', 'D6'), .06)
# C: the old woman — the Maa theme, slow and lonely, over a low drone
dread(c['C'], c['D'], .09); musicbox(c['C'] + .8, MAA + MAA2, .1, .62)
# D: the station — almost no music, one high glass note when nobody gets in
samp('keys', 'vibraphone_bowed', c['D'] + 3.5, 'Eb6', 4.0, .06, .2, attack=.8)
# E: following her gaze — a slow rising cluster to the scare
dread(c['E'], c['F'] + .3, .11); cluster(c['E'] + .5, c['F'] - c['E'], .06, ('D5', 'Eb5', 'A5'))
F0 = c['F']; stinger(F0, .9); dread(F0, c['G'], .13, 'C#1', 'D2')
# G: he turns to her — heartbeat (foley) + a held low note; stinger when she turns her head
samp('bass', 'contrabass', c['G'], 'D1', 4.5, .14, 0, attack=1.0); cluster(c['G'] + 1.5, 3.0, .05, ('Bb5', 'B5'))
# H: the run — spiccato ostinato, accelerating
H0 = c['H'];
for i in range(30): samp('str', 'cellos_spic', H0 + .9 + i * .19, ['D2', 'D2', 'Eb2', 'D2', 'A2'][i % 5], .2, .12 + .002 * i, -.2)
dread(H0, c['I'], .1)
# I: the same seat in the next coach — stinger, then dread
stinger(c['I'], 1.0); dread(c['I'], c['J'], .13); cluster(c['I'] + .6, c['J'] - c['I'], .05, ('D6', 'Eb6'))
# J: she is right behind him — the biggest stinger; under "बेटा…" the Maa theme broken and slow (and sad, not only scary)
stinger(c['J'], 1.15); musicbox(c['J'] + 1.2, MAA, .11, .72); pad(c['J'] + 1.0, 5.2, ['D3', 'F3', 'A3'], .06); samp('mel', 'cellos', c['J'] + 1.2, 'D3', 5.0, .12, -.1, attack=1.2)
# K: black — a low boom (foley); Z: end card — the theme's first notes, unresolved
musicbox(c['Z'] + .4, MAA[:4], .09, .6); samp('bass', 'contrabass', c['Z'], 'D1', 5.0, .09, 0, attack=1.0)

# ———————————————————— foley ————————————————————
def nz(x, v): return (x / (np.abs(x).max() + 1e-9) * v).astype(np.float32)
def tt_(d): return np.arange(int(round(d * SR))) / SR
def tone(d, f0, f1, v, shape=lambda tt, d: np.exp(-tt / (d / 3))):
    tt = tt_(d); f = f0 + (f1 - f0) * tt / d
    return nz(np.sin(2 * np.pi * np.cumsum(f) / SR) * shape(tt, d), v)
def train(d):   # the running train: low rumble + the wheel joints, slightly irregular
    n = int(d * SR); x = lp(brown(d)[:n], 160) * 1.0 + bp(noise(d)[:n], 200, 900) * .08
    x = nz(x, .07)
    t = .3
    while t < d - .3:
        for k in (0, .11):
            c_ = nz(clack(.5, .7), .045); i = int((t + k) * SR); x[i:i + len(c_)] += c_[:len(x) - i]
        t += .92 + .05 * rng.standard_normal()
    return x
def brake(d): tt = tt_(d); return nz(np.sin(2 * np.pi * np.cumsum(2400 + 300 * np.sin(2 * np.pi * 3 * tt)) / SR) * np.sin(np.pi * tt / d) ** 2 * .3 + lp(noise(d)[:len(tt)], 400) * .7, .07)
def chime():   # station announcement ding-dong (original two-tone)
    out = np.zeros(int(1.6 * SR))
    for k, f in enumerate([880, 698.5]): x = tone(.9, f, f, .1); i = int(k * .45 * SR); out[i:i + len(x)] += x
    return nz(out, .1)
def doors(): x = bp(noise(.9), 300, 2500)[:int(.9 * SR)] * np.sin(np.pi * tt_(.9) / .9) ** 1.5; return nz(x, .07)
def beep(d):
    out = np.zeros(int(d * SR) + SR)
    for k in range(int(d / .15)): x = tone(.08, 2000, 2000, .05, lambda tt, d: np.ones_like(tt)); i = int(k * .15 * SR); out[i:i + len(x)] += x
    return out.astype(np.float32)
def foot(): x = thump(.8, 85).astype(np.float64); n = bp(noise(.08), 300, 3000)[:int(.08 * SR)] * np.exp(-tt_(.08) / .015); x[:len(n)] += n * .6; return nz(x, .1)
def hum(d): x = lp(noise(d), 300)[:int(d * SR)] + .3 * np.sin(2 * np.pi * 100 * tt_(d))[:int(d * SR)]; return nz(x, .02)
def buzz(d): tt = tt_(d); x = np.sign(np.sin(2 * np.pi * 120 * tt)) * (np.sin(2 * np.pi * 9 * tt) > -.2); return nz(lp(x, 1200) * .5, .07)
def vibrate(d):
    out = np.zeros(int(d * SR) + SR)
    for k in range(int(d / 1.0)): L = .5; x = lp(np.sign(np.sin(2 * np.pi * 180 * tt_(L))), 600) * np.sin(np.pi * tt_(L) / L); i = int(k * SR); out[i:i + len(x)] += x[:len(out) - i]
    return nz(out, .05)

F = st['foley']
for e in EV:
    t, ty = e['t'], e['type']
    if ty == 'train': add(st['amb'], train(e['dur']), t, 1.0, 0)
    elif ty == 'buzz': add(F, vibrate(e['dur']), t, 1.0, .2)
    elif ty == 'tap': add(F, nz(click(3.0, .5), .05), t, 1.0, .2)
    elif ty == 'brake': add(F, brake(e['dur']), t, 1.0, 0)
    elif ty == 'chime': add(F, chime(), t, 1.0, 0)
    elif ty == 'doors': add(F, doors(), t, 1.0, .4)
    elif ty == 'platform': add(st['amb'], hum(e['dur']), t, 1.0, .3)
    elif ty == 'beep': add(F, beep(e['dur']), t, 1.0, .3)
    elif ty == 'flicker': add(F, buzz(e['dur']), t, 1.0, -.2); add(F, nz(click(1.5, .6), .06), t, 1.0, 0)
    elif ty == 'heartbeat':
        n = max(1, int(e['dur'] / .8))
        for k in range(n): add(F, nz(heartbeat(.9), .28 + .1 * k / n), t + k * .8, 1.0, 0)
    elif ty == 'run':
        k = 0
        while k * .3 < e['dur']: add(F, foot(), t + k * .3, 1.0, (-.15, .15)[k % 2]); k += 1
        add(F, nz(bp(noise(e['dur']), 400, 2500)[:int(e['dur'] * SR)] * .5, .02), t, 1.0, 0)
    elif ty == 'gangway': add(F, nz(clack(.6, .9), .12), t, 1.0, 0); add(F, nz(rumble(1.0, .8)[:SR], .06), t, 1.0, 0)
    elif ty == 'whoosh': add(F, whoosh(.3, .25), t - .1, .45, 0)
    elif ty == 'boom': add(F, nz(thump(1.0, 45), .8), t, 1.0, 0); add(F, nz(rumble(2.5, 1.0)[:int(2.5 * SR)], .15), t, 1.0, 0)

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
    if e.get('who') == 'M':   # Amma: soft, a faint cold echo (she isn't quite here)
        z = np.concatenate([x, np.zeros(int(1.4 * SR), np.float32)])
        for dl, g in [(.08, .3), (.18, .2), (.33, .13), (.55, .08)]: d = int(dl * SR); z[d:d + len(x)] += g * lp(x, 3000)[:len(x)]
        x = (z / (np.abs(z).max() + 1e-9) * .8).astype(np.float32)
    add(V, x, e['t'], 1.0, 0)
    a = int(e['t'] * SR); vmask[a:a + len(x)] = 1
k = int(.15 * SR); sm = np.convolve(vmask, np.ones(k) / k, mode='same')

gains = {'bass': 1.1, 'str': 1.0, 'mel': .9, 'keys': .85, 'perc': .9}
mus = sum(st[k] * g for k, g in gains.items())
duck = 1 - .45 * sm
out = mus * duck[:, None] + st['foley'] * 1.15 + st['amb'] * (1 - .35 * sm)[:, None] + st['voice'] * 1.4
out = out[:int(DUR * SR)]
fade = int(.6 * SR); out[-fade:] *= np.linspace(1, 0, fade)[:, None]
pk = np.abs(out).max(); out = out / pk * 0.85
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out, SR)
print('mix ok', out.shape, 'peak', pk)
