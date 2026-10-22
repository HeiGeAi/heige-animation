"""Synthesised sound effects for the block-world films (scenes/stay.js): footsteps in snow, blocks breaking and
being placed, a minecart, lava, level-ups, chat pings, a phone, a portal and so on. Everything is generated from
noise and tones here (no recorded game audio), 44.1 kHz mono 16-bit, into the directory given.
The 13 sounds from tools/video/sfx.py (whoosh, boom, thud, pop, ding, coin, glitch, powerup, sad, alarm, tick ...)
are copied in as they are.
usage: python3 tools/video/sfx_block.py out/video/stay/sfx [out/video/manong/sfx]"""
import os
import shutil
import sys
import wave

import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def t_(d):
    return np.arange(int(SR * d)) / SR


def env(n, a=.004, r=.1, hold=0.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4))
    rel = np.exp(-np.maximum(0, t - a - hold) / max(r, 1e-4))
    return e * rel


def lp(x, k):
    """one-pole low-pass, k in (0, 1]: smaller is darker"""
    y = np.zeros_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += k * (v - acc)
        y[i] = acc
    return y


def hp(x, k):
    return x - lp(x, k)


def noise(d):
    return rng.uniform(-1, 1, int(SR * d))


def tone(f, d, kind='sin', a=.004, r=.15, hold=0.0):
    t = t_(d)
    ph = 2 * np.pi * np.cumsum(np.broadcast_to(f, t.shape)) / SR if np.ndim(f) else 2 * np.pi * f * t
    w = np.sin(ph) if kind == 'sin' else np.sign(np.sin(ph)) * .6 if kind == 'sq' else 2 * (ph / (2 * np.pi) % 1) - 1
    return w * env(len(t), a, r, hold)


def seq(parts, gap):
    out = []
    for p in parts:
        out.append(p)
        out.append(np.zeros(int(SR * gap)))
    return np.concatenate(out)


def mix(*xs):
    n = max(len(x) for x in xs)
    y = np.zeros(n)
    for x in xs:
        y[:len(x)] += x
    return y


def norm(x, peak=.85):
    m = np.max(np.abs(x)) or 1
    return x / m * peak


def crunch(d=.16, k=.25, grains=6):
    """gritty block break: short noise grains, darkened"""
    y = np.zeros(int(SR * d))
    for g in range(grains):
        s = int(rng.uniform(0, .5) * len(y))
        n = noise(.05) * env(int(SR * .05), .001, .015)
        y[s:s + len(n)] += n[:len(y) - s] * rng.uniform(.5, 1)
    return lp(y, k)


def make():
    S = {}
    S['step'] = norm(lp(noise(.14) * env(int(SR * .14), .005, .04), .18), .6)                  # boots in snow
    S['break'] = norm(mix(crunch(.22, .3, 9), lp(noise(.2) * env(int(SR * .2), .002, .06), .08) * .8))
    S['crack'] = norm(hp(crunch(.18, .6, 5), .3), .7)
    S['place'] = norm(mix(lp(noise(.08) * env(int(SR * .08), .001, .02), .2), tone(140, .12, r=.05) * .6), .75)
    S['hit'] = norm(mix(lp(noise(.1) * env(int(SR * .1), .001, .03), .35), tone(np.linspace(220, 90, int(SR * .14)), .14, r=.06)))
    S['slap'] = norm(mix(hp(noise(.12) * env(int(SR * .12), .0005, .025), .2), lp(noise(.12) * env(int(SR * .12), .001, .05), .1) * .6))
    S['poof'] = norm(lp(noise(.35) * env(int(SR * .35), .02, .12), .12), .7)
    S['chat'] = norm(mix(tone(1320, .09, r=.04), tone(1760, .09, r=.04) * .5), .5)
    S['join'] = norm(seq([tone(880, .07, r=.05), tone(1175, .1, r=.08)], .01), .5)
    S['toast'] = norm(seq([tone(784, .1, r=.12), tone(1046, .16, r=.2)], .02) + 0, .6)
    S['chime'] = norm(seq([tone(f, .18, r=.35) for f in (659, 784, 988, 1318)], .05), .55)
    S['levelup'] = norm(seq([tone(f, .1, 'sq', r=.08) * .6 for f in (523, 659, 784, 1046)], .01), .6)
    S['xp'] = norm(seq([tone(f, .06, r=.08) for f in (1568, 2093)], .0), .45)
    S['page'] = norm(hp(noise(.25) * env(int(SR * .25), .03, .08), .15), .5)
    S['pickup'] = norm(tone(np.linspace(600, 1200, int(SR * .1)), .1, r=.05), .55)
    S['click'] = norm(mix(hp(noise(.03) * env(int(SR * .03), .0005, .006), .4), tone(2400, .03, r=.01) * .4), .6)
    S['heart'] = norm(seq([lp(tone(60, .12, r=.06), .2), lp(tone(55, .16, r=.08), .2)], .11), .9)
    S['armor'] = norm(mix(hp(noise(.3) * env(int(SR * .3), .002, .12), .3) * .6, tone(1900, .3, r=.15) * .3, tone(2600, .3, r=.12) * .2))
    S['grunt'] = norm(lp(tone(np.linspace(170, 120, int(SR * .25)), .25, 'saw', a=.02, r=.1), .1), .7)     # a villager's "hmm"
    S['villager'] = norm(seq([lp(tone(np.linspace(200, 150, int(SR * .18)), .18, 'saw', r=.08), .12), lp(tone(np.linspace(150, 210, int(SR * .2)), .2, 'saw', r=.1), .12)], .03), .7)
    S['flip'] = norm(hp(noise(.12) * env(int(SR * .12), .01, .04), .25), .5)
    S['fuse'] = norm(hp(noise(.9) * env(int(SR * .9), .05, .6, .4), .5) * (1 + .3 * np.sin(2 * np.pi * 30 * t_(.9))), .5)
    S['ring'] = norm(seq([mix(tone(1400, .4, r=.2, hold=.3), tone(1750, .4, r=.2, hold=.3)) * (np.sin(2 * np.pi * 20 * t_(.4)) > 0)], .0), .5)
    S['portal'] = norm(mix(tone(np.linspace(220, 660, int(SR * .7)), .7, r=.4) * .5, lp(noise(.7), .05) * env(int(SR * .7), .1, .3)), .55)
    S['magic'] = norm(seq([tone(f, .12, r=.2) * .7 for f in (1318, 1568, 1976, 2637)], .03), .5)
    S['scratch'] = norm(hp(noise(.3) * env(int(SR * .3), .01, .15) * (1 + np.sin(2 * np.pi * 9 * t_(.3))), .2), .6)
    S['sizzle'] = norm(hp(noise(.7) * env(int(SR * .7), .01, .3), .5) * .7 + lp(noise(.7), .02) * env(int(SR * .7), .05, .3) * .5, .6)
    S['cart'] = norm(mix(lp(noise(1.0), .03) * env(int(SR * 1.0), .05, .5, .3), *[np.pad(crunch(.05, .4, 2) * .6, (int(SR * k), 0)) for k in (.1, .36, .62)]), .7)
    S['roar'] = norm(lp(tone(np.linspace(110, 60, int(SR * .9)), .9, 'saw', a=.05, r=.4) + noise(.9) * .3, .06), .9)
    S['firework'] = norm(mix(hp(noise(.5) * env(int(SR * .5), .001, .2), .2), *[np.pad(hp(noise(.03) * env(int(SR * .03), .001, .01), .4) * .5, (int(SR * k), 0)) for k in (.15, .22, .3, .41)]), .8)
    return S


def main():
    out = sys.argv[1]
    base = sys.argv[2] if len(sys.argv) > 2 else 'out/video/manong/sfx'
    os.makedirs(out, exist_ok=True)
    for f in os.listdir(base):
        if f.endswith('.wav'):
            shutil.copy(os.path.join(base, f), os.path.join(out, f))
    for name, x in make().items():
        y = np.clip(x, -1, 1)
        with wave.open(os.path.join(out, name + '.wav'), 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((y * 32767).astype('<i2').tobytes())
    print('wrote', len(os.listdir(out)), 'sounds to', out)


if __name__ == '__main__':
    main()
