"""8-bit sound effects, synthesised (no samples, nothing to license): pop, whoosh, ding, glitch, boom, alarm, tick,
zap, powerup, coin, thud, type. Writes 44.1 kHz mono WAVs into the given folder.
usage: python3 sfx.py out_dir"""
import os
import sys
import wave

import numpy as np

SR = 44100


def env(n, a=.005, r=.08):
    t = np.arange(n) / SR; e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r); return e


def sq(f, n, duty=.5):
    t = np.arange(n) / SR; ph = np.cumsum(np.broadcast_to(f, (n,)) / SR) if np.ndim(f) else f * t
    return np.where((ph % 1) < duty, 1.0, -1.0)


def tone(f, dur, kind='sq', a=.003, r=.1, vol=.5):
    n = int(SR * dur); f = np.broadcast_to(np.asarray(f, float), (n,))
    ph = np.cumsum(f / SR)
    w = np.where((ph % 1) < .5, 1.0, -1.0) if kind == 'sq' else np.sin(ph * 2 * np.pi) if kind == 'sin' else 2 * np.abs(2 * (ph % 1) - 1) - 1
    return w * env(n, a, r) * vol


def noise(dur, r=.1, vol=.5, seed=1):
    n = int(SR * dur); rng = np.random.default_rng(seed); return rng.uniform(-1, 1, n) * env(n, .002, r) * vol


def lowpass(x, k):
    y = np.zeros_like(x); acc = 0.0
    for i, v in enumerate(x): acc += k * (v - acc); y[i] = acc
    return y


def make():
    S = {}
    n = int(SR * .12); S['pop'] = tone(np.linspace(900, 300, n), .12, 'sq', r=.04, vol=.35)
    d = .45; n = int(SR * d); nz = noise(d, r=1, vol=1, seed=3); sweep = np.sin(np.linspace(0, np.pi, n)) ** 2
    S['whoosh'] = lowpass(nz, .08) * sweep * 1.4
    S['ding'] = tone(1568, .6, 'tri', r=.25, vol=.35) + tone(2093, .6, 'tri', a=.02, r=.2, vol=.2)
    g = noise(.35, r=.2, vol=.6, seed=7); g = np.round(g * 3) / 3 * (np.arange(len(g)) // 600 % 2); S['glitch'] = g * .6 + tone(np.repeat([220, 880, 110, 660], len(g) // 4 + 1)[:len(g)], .35, 'sq', r=.2, vol=.2)
    n = int(SR * .6); S['boom'] = tone(np.linspace(140, 40, n), .6, 'sin', r=.25, vol=.9) + lowpass(noise(.6, r=.15, vol=.8, seed=5), .05) * .9
    a = np.concatenate([tone(988, .12, 'sq', r=.5, vol=.25), np.zeros(int(SR * .05)), tone(988, .12, 'sq', r=.5, vol=.25)]); S['alarm'] = np.concatenate([a, a])
    S['tick'] = tone(2200, .03, 'sq', r=.01, vol=.25)
    n = int(SR * .3); S['zap'] = tone(np.linspace(1800, 120, n), .3, 'sq', r=.12, vol=.3)
    n = int(SR * .5); S['powerup'] = tone(np.repeat([523, 659, 784, 1047], n // 4 + 1)[:n], .5, 'sq', r=.6, vol=.25)
    S['coin'] = np.concatenate([tone(988, .07, 'sq', r=.2, vol=.25), tone(1319, .25, 'sq', r=.12, vol=.25)])
    n = int(SR * .25); S['thud'] = tone(np.linspace(90, 50, n), .25, 'sin', r=.08, vol=.9)
    S['type'] = np.concatenate([np.concatenate([noise(.02, r=.006, vol=.35, seed=i), np.zeros(int(SR * .05))]) for i in range(6)])
    n = int(SR * .5); S['sad'] = tone(np.linspace(440, 220, n), .5, 'tri', r=.4, vol=.3)
    return S


def main():
    out = sys.argv[1]; os.makedirs(out, exist_ok=True)
    for k, x in make().items():
        x = np.clip(x, -1, 1); w = wave.open(os.path.join(out, k + '.wav'), 'wb')
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes()); w.close()
    print('sfx:', ', '.join(sorted(make())))


if __name__ == '__main__':
    main()
