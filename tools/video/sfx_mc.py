"""Block-game sound effects for the voxel-world explainer films, synthesised from scratch with numpy.

Nothing here is sampled, resampled, traced or derived from any game audio file or sample pack: every sound is
built from sine partials, coloured noise, impulse trains and resonator banks, tuned by ear to *evoke* the
familiar block-game palette (orb ding, level-up chime, crunchy digging, chest creak, anvil clang ...).
48 kHz, mono, 16-bit, every file starts at t=0 (cue tables trigger at exact times), short fades at both ends,
peak normalised to -3 dBFS, DC removed. Also writes _demo.wav (all sounds, 0.4 s gaps) and CATALOG.md.

usage: /opt/homebrew/bin/python3 tools/video/sfx_mc.py out/video/shuohua/sfx"""
import os
import sys
import wave

import numpy as np

SR = 48000
PEAK = 10 ** (-3 / 20)


# ---------------------------------------------------------------- primitives

def n_(d):
    return max(1, int(round(SR * d)))


def T(d):
    return np.arange(n_(d)) / SR


def env(d, a=.002, r=.1, hold=0.0):
    """linear attack, optional hold, exponential release (time constant r)"""
    t = T(d)
    e = np.minimum(1.0, t / max(a, 1e-5))
    return e * np.exp(-np.maximum(0.0, t - a - hold) / max(r, 1e-5))


def pad_to(x, n):
    return x[:n] if len(x) >= n else np.concatenate([x, np.zeros(n - len(x))])


def at(x, t, total=None):
    """place x starting at time t (s) inside a buffer"""
    off = n_(t) if t > 0 else 0
    y = np.concatenate([np.zeros(off), x])
    return pad_to(y, n_(total)) if total else y


def mix(*xs):
    n = max(len(x) for x in xs)
    return sum(pad_to(x, n) for x in xs)


def cn(d, lo=20.0, hi=20000.0, tilt=0.0, seed=0, order=2):
    """coloured noise: white noise shaped in the frequency domain (band edges + tilt in dB/octave), RMS 1.
    Shaped before any envelope is applied, so there is no filter pre-ringing ahead of the onset."""
    n = n_(d)
    rng = np.random.default_rng(seed)
    X = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    f[0] = 1.0
    g = 1 / np.sqrt(1 + (lo / f) ** (2 * order)) / np.sqrt(1 + (f / hi) ** (2 * order))
    g *= (f / 1000.0) ** (tilt / 6.0206)
    g[0] = 0
    y = np.fft.irfft(X * g, n)
    return y / (np.sqrt(np.mean(y ** 2)) + 1e-12)


def osc(f, d, shape='sin', phase=0.0, harmonics=12):
    """phase-accumulating oscillator; f may be a scalar or an array (glide). 'sq'/'saw'/'tri' are band-limited
    additive versions (soft, no aliasing)"""
    n = n_(d)
    f = np.broadcast_to(np.asarray(f, float), (n,)) if np.ndim(f) else np.full(n, float(f))
    ph = 2 * np.pi * np.cumsum(f) / SR + phase
    if shape == 'sin':
        return np.sin(ph)
    y = np.zeros(n)
    for k in range(1, harmonics + 1):
        ok = (f * k) < SR * .45
        if shape == 'sq' and k % 2 == 0:
            continue
        if shape == 'tri' and k % 2 == 0:
            continue
        a = {'sq': 1 / k, 'saw': 1 / k, 'tri': (1 / k ** 2) * (-1) ** ((k - 1) // 2)}[shape]
        y += a * np.sin(k * ph) * ok
    return y


def partials(f0, d, spec, a=.001, seed=0, detune=0.0):
    """sum of decaying sine partials. spec: list of (ratio, amp, tau). detune>0 adds a beating twin per partial"""
    rng = np.random.default_rng(seed)
    t = T(d)
    y = np.zeros(len(t))
    for r, amp, tau in spec:
        ph = rng.uniform(0, 2 * np.pi)
        y += amp * np.sin(2 * np.pi * f0 * r * t + ph) * np.exp(-t / tau)
        if detune:
            y += amp * .6 * np.sin(2 * np.pi * (f0 * r + detune * r ** .5) * t + ph) * np.exp(-t / tau)
    return y * np.minimum(1, t / a)


def bell(f, d, tau=.4, bright=1.0, seed=0, a=.0015):
    """small struck bell / glockenspiel: harmonic body plus a few inharmonic shimmer partials"""
    spec = [(1, 1, tau), (2, .32 * bright, tau * .55), (3, .1 * bright, tau * .3),
            (2.76, .16 * bright, tau * .35), (5.40, .07 * bright, tau * .16), (8.93, .03 * bright, tau * .08)]
    return partials(f, d, spec, a=a, seed=seed)


def fftconv(x, h):
    n = len(x) + len(h) - 1
    m = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(h, m), m)[:len(x)]


def resonate(x, modes, ir_len=.4, seed=0):
    """run x through a bank of resonant modes (freq Hz, bandwidth Hz, gain) by convolving with their summed
    impulse response; causal, so nothing leaks ahead of the excitation"""
    rng = np.random.default_rng(seed)
    t = T(ir_len)
    h = np.zeros(len(t))
    for f, bw, g in modes:
        h += g * np.sin(2 * np.pi * f * t + rng.uniform(0, .3)) * np.exp(-np.pi * bw * t)
    return fftconv(x, h)


def svf(x, fc, q=1.0, mode='bp'):
    """time-varying TPT state-variable filter; fc scalar or per-sample array"""
    n = len(x)
    fc = np.broadcast_to(np.asarray(fc, float), (n,)) if np.ndim(fc) else np.full(n, float(fc))
    g = np.tan(np.pi * np.clip(fc, 10, SR * .45) / SR)
    k = 1.0 / q
    a1 = 1 / (1 + g * (g + k))
    a2 = g * a1
    a3 = g * a2
    ic1 = ic2 = 0.0
    out = np.empty(n)
    xs, A1, A2, A3 = x.tolist(), a1.tolist(), a2.tolist(), a3.tolist()
    for i in range(n):
        v0 = xs[i]
        v3 = v0 - ic2
        v1 = A1[i] * ic1 + A2[i] * v3
        v2 = ic2 + A2[i] * ic1 + A3[i] * v3
        ic1 = 2 * v1 - ic1
        ic2 = 2 * v2 - ic2
        out[i] = v1 if mode == 'bp' else v2 if mode == 'lp' else v0 - k * v1 - v2
    return out


def dc_block(x, fc=22.0):
    r = np.exp(-2 * np.pi * fc / SR)
    out = np.empty(len(x))
    px = py = 0.0
    for i, v in enumerate(x.tolist()):
        py = v - px + r * py
        px = v
        out[i] = py
    return out


def grains(d, times, amps, lo, hi, glen=(.002, .01), tilt=0.0, seed=0, decay_frac=.3):
    """granular crunch: short coloured-noise grains at given times"""
    rng = np.random.default_rng(seed)
    src = cn(d + .1, lo, hi, tilt, seed=seed + 101)
    y = np.zeros(n_(d))
    for t0, a in zip(times, amps):
        L = rng.uniform(*glen)
        g = env(L, a=min(.0004, L / 4), r=L * decay_frac)
        s = rng.integers(0, len(src) - len(g) - 1)
        piece = src[s:s + len(g)] * g * a
        i0 = n_(t0) if t0 > 0 else 0
        j = min(len(y), i0 + len(piece))
        y[i0:j] += piece[:j - i0]
    return y


def crunch(d, lo, hi, count, spread, tilt=0.0, seed=0, glen=(.002, .012)):
    """dig/break crunch: a dense cluster of grains whose density decays (first grain exactly at t=0)"""
    rng = np.random.default_rng(seed)
    times = np.concatenate([[0.0], np.sort(np.minimum(rng.exponential(spread, count - 1), d * .8))])
    amps = np.exp(-times / (spread * 1.6)) * rng.uniform(.45, 1.0, count)
    amps[0] = 1.0
    return grains(d, times, amps, lo, hi, glen, tilt, seed)


def debris(d, t_start, count, lo, hi, seed=0, gap=(.025, .07)):
    """little falling-bits ticks after a break"""
    rng = np.random.default_rng(seed)
    times = t_start + np.cumsum(rng.uniform(*gap, count))
    amps = .5 * np.exp(-(times - t_start) / .12) * rng.uniform(.5, 1, count)
    return grains(d, times, amps, lo, hi, (.0015, .005), 0, seed + 7, .25)


def creak(d, rate0, rate1, modes, jitter=.25, seed=0, amp_shape=None):
    """wooden creak: a stick-slip impulse train (rate gliding rate0->rate1 Hz, jittered) driving wood modes"""
    rng = np.random.default_rng(seed)
    n = n_(d)
    x = np.zeros(n)
    t = 0.0
    while t < d:
        frac = t / d
        rate = rate0 + (rate1 - rate0) * frac
        i = int(t * SR)
        if i < n:
            x[i] = rng.uniform(.6, 1.0) * (amp_shape(frac) if amp_shape else 1.0)
        t += (1 / rate) * (1 + rng.uniform(-jitter, jitter))
    return resonate(x, modes, ir_len=.08, seed=seed)


def soft_clip(x, drive=1.5):
    return np.tanh(x * drive) / np.tanh(drive)


def norm(x):
    return x / (np.max(np.abs(x)) + 1e-12)


def finish(x, tail_db=-60.0, fade_out=.010):
    """DC block, trim trailing silence, short raised-cosine fades, normalise to -3 dBFS"""
    x = dc_block(np.asarray(x, float))
    pk = np.max(np.abs(x)) + 1e-12
    loud = np.nonzero(np.abs(x) > pk * 10 ** (tail_db / 20))[0]
    end = min(len(x), loud[-1] + n_(.012)) if len(loud) else len(x)
    x = x[:end].copy()
    fi = n_(.0005)
    x[:fi] *= .5 - .5 * np.cos(np.linspace(0, np.pi, fi))
    fo = min(n_(fade_out), len(x) // 4)
    x[-fo:] *= .5 + .5 * np.cos(np.linspace(0, np.pi, fo))
    x[-1] = 0.0
    w = np.hanning(len(x))
    x -= np.mean(x) * len(x) * w / w.sum()       # remove residual DC of very short files without touching the edges
    return x / (np.max(np.abs(x)) + 1e-12) * PEAK


# ---------------------------------------------------------------- the sounds
# Each entry: name -> (function, one-line description for CATALOG.md)

WOOD = [(180, 40, 1.0), (395, 55, .8), (690, 70, .55), (1120, 110, .35), (1900, 180, .2)]
WOOD_DOOR = [(150, 35, 1.0), (330, 45, .8), (560, 60, .6), (910, 90, .4), (1500, 150, .25)]


def s_xp(p=1.0):
    def f():
        d = .32
        body = bell(1760 * p, d, tau=.075, bright=.9, seed=3)
        sparkle = partials(1760 * p * 2, d, [(1, .25, .03)], seed=4)
        tick = cn(.004, 5000, 14000, seed=5) * env(.004, .0002, .0012) * .25
        return mix(body, sparkle, tick)
    return f


def s_levelup():
    d = 1.7
    out = np.zeros(n_(d))
    for i, (fr, amp) in enumerate([(1046.5, .7), (1318.5, .75), (1568.0, .8), (2093.0, 1.0)]):
        t0 = i * .045
        n = bell(fr, d - t0, tau=.55, bright=1.1, seed=10 + i)
        n2 = bell(fr * 1.0035, d - t0, tau=.5, bright=.6, seed=20 + i)          # chorus twin -> shimmer
        out += at((n + .6 * n2) * amp, t0, d)
    pad = osc(523.25, d) * env(d, .03, .6) * .18                                  # soft octave-below bed
    trem = 1 + .12 * np.sin(2 * np.pi * 6.5 * T(d))
    return (out + pad) * trem


def s_toast():
    d = 1.1
    swish = cn(d, 2500, 9000, seed=31) * env(d, .002, .06) * .12
    c1 = bell(783.99, d, tau=.35, bright=.8, seed=32)
    c2 = at(bell(1174.66, d - .1, tau=.45, bright=.9, seed=33), .1, d)
    c3 = at(bell(1567.98, d - .1, tau=.3, bright=.5, seed=34), .1, d) * .35
    return mix(swish, c1 * .8, c2, c3)


def s_pickup():
    d = .12
    f = 650 + 900 * (1 - np.exp(-T(d) / .012))                                    # quick upward bubble chirp
    body = osc(f, d) * env(d, .0008, .028)
    click = cn(.003, 3000, 12000, seed=41) * env(.003, .0002, .001) * .3
    return mix(body, click)


def s_pop():
    d = .1
    f = 1250 * np.exp(-T(d) / .03) + 420                                          # cork-style downward plip
    body = osc(f, d) * env(d, .0006, .022)
    air = cn(d, 800, 5000, seed=42) * env(d, .0004, .006) * .35
    return mix(body, air)


def s_place():
    d = .22
    thump = osc(105 * np.exp(-T(d) / .08) + 60, d) * env(d, .0015, .045)
    grit = cn(d, 180, 1800, -3, seed=51) * env(d, .001, .022) * .55
    crumbs = crunch(d, 400, 3000, 5, .02, seed=52) * .25
    return mix(thump, grit, crumbs)


def s_break_generic():
    d = .45
    body = crunch(d, 300, 4200, 28, .035, -2, seed=61)
    thump = osc(95 * np.exp(-T(d) / .06) + 55, d) * env(d, .001, .05) * .55
    bits = debris(d, .11, 5, 1500, 7000, seed=62)
    return mix(body, thump, bits)


def s_break_stone():
    d = .45
    body = crunch(d, 700, 5500, 34, .03, 0, seed=71, glen=(.0015, .008))
    grit = cn(d, 1500, 7000, seed=72) * env(d, .0008, .02) * .35
    thump = osc(85 * np.exp(-T(d) / .05) + 60, d) * env(d, .001, .04) * .5
    bits = debris(d, .1, 6, 2500, 9000, seed=73)
    return mix(body, grit, thump, bits)


def s_break_wood():
    d = .5
    rng = np.random.default_rng(81)
    exc = np.zeros(n_(d))
    for t0, a in zip([0, .012, .03, .05] + list(rng.uniform(.06, .2, 5)), [1, .7, .5, .4] + list(rng.uniform(.1, .25, 5))):
        exc[n_(t0)] += a
    knock = resonate(exc, WOOD, ir_len=.15, seed=82) * .5
    splinter = crunch(d, 400, 3500, 20, .04, -2, seed=83, glen=(.003, .015))
    bits = debris(d, .14, 4, 800, 4000, seed=84)
    return mix(knock / (np.max(np.abs(knock)) + 1e-9), splinter * .8, bits)


def s_break_glass():
    d = .75
    rng = np.random.default_rng(91)
    out = np.zeros(n_(d))
    impact = cn(d, 2500, 14000, seed=92) * env(d, .0005, .025) * .9
    for i in range(26):                                                            # shards: inharmonic pings
        t0 = 0 if i == 0 else rng.exponential(.08)
        if t0 > d - .1:
            continue
        f0 = rng.uniform(2200, 7500)
        tau = rng.uniform(.03, .14)
        ping = partials(f0, d - t0, [(1, 1, tau), (1.53, .5, tau * .7), (2.31, .3, tau * .5)], a=.0004, seed=93 + i)
        out += at(ping * rng.uniform(.25, .7) * np.exp(-t0 / .2), t0, d)
    tinkle = crunch(d, 4000, 12000, 18, .07, seed=94, glen=(.001, .004)) * .5
    return mix(impact, out, tinkle)


def s_crack():
    d = .07
    return mix(crunch(d, 900, 6000, 6, .008, 0, seed=101, glen=(.002, .009)),
               cn(d, 2000, 8000, seed=102) * env(d, .0005, .006) * .3)


def s_step():
    d = .12
    body = cn(d, 120, 1600, -4, seed=111) * env(d, .002, .022)
    grit = crunch(d, 600, 3500, 4, .012, seed=112) * .35
    knock = osc(130, d) * env(d, .001, .018) * .45
    return mix(body, grit, knock)


def s_step_wood():
    d = .16
    exc = np.zeros(n_(d)); exc[0] = 1; exc[n_(.006)] = .35
    knock = resonate(exc, [(f * 1.25, bw, g) for f, bw, g in WOOD], ir_len=.1, seed=121)
    knock /= np.max(np.abs(knock)) + 1e-9
    scuff = cn(d, 300, 3000, -3, seed=122) * env(d, .002, .02) * .4
    return mix(knock, scuff)


def s_thud():
    d = .6
    boom = osc(48 + 55 * np.exp(-T(d) / .05), d) * env(d, .002, .14)
    dirt = cn(d, 40, 450, -3, seed=131) * env(d, .002, .07) * .7
    slap = cn(d, 300, 3000, seed=132) * env(d, .0005, .008) * .35
    return soft_clip(mix(boom, dirt, slap), 1.6)


def s_click():
    d = .06
    tick = cn(d, 2000, 9000, seed=141) * env(d, .0002, .0015) * .8
    tock = partials(1250, d, [(1, 1, .007), (2.1, .4, .004), (3.4, .2, .002)], a=.0002, seed=142)
    tock2 = at(partials(1500, d - .016, [(1, .35, .004)], a=.0002, seed=143), .016, d)
    return mix(tick, tock, tock2)


def s_page():
    d = .38
    t = T(d)
    rng = np.random.default_rng(151)
    shape = np.minimum(1, .35 + t / .08) * np.exp(-np.maximum(0, t - .12) / .07)  # starts audible, swells, falls
    flutter = np.repeat(rng.uniform(.3, 1.0, n_(d) // 120 + 1), 120)[:n_(d)]       # paper crinkle
    rustle = cn(d, 1500, 10000, -1, seed=152) * shape * flutter
    flap = at(cn(.12, 150, 900, -3, seed=153) * env(.12, .01, .03), .2, d) * .5
    return mix(rustle, flap)


def s_chest(close=False):
    if not close:
        d = .62
        latch = cn(.02, 1500, 7000, seed=161) * env(.02, .0003, .003) * .7
        cr = creak(.36, 35, 70, [(310, 30, 1), (620, 45, .7), (1180, 60, .45), (2150, 90, .2)], seed=162,
                   amp_shape=lambda u: .4 + .6 * np.sin(np.pi * u))
        cr = norm(cr) * .8
        exc = np.zeros(n_(.25)); exc[0] = 1; exc[n_(.01)] = .4
        lid = norm(resonate(exc, WOOD, ir_len=.2, seed=163)) * .6
        return mix(latch, cr, at(lid, .38, d))
    d = .45
    cr = norm(creak(.14, 60, 35, [(290, 30, 1), (600, 45, .7), (1100, 60, .45)], seed=164)) * .55
    exc = np.zeros(n_(.3)); exc[0] = 1; exc[n_(.008)] = .5; exc[n_(.02)] = .2
    slam = norm(resonate(exc, [(f * .9, bw, g) for f, bw, g in WOOD], ir_len=.25, seed=165))
    thump = osc(90, .3) * env(.3, .001, .05) * .6
    return mix(cr, at(mix(slam, thump), .14, d))


def s_anvil(use=False):
    if not use:
        d = 1.5
        f0 = 415
        spec = [(1, 1, .55), (1.47, .45, .4), (2.76, .7, .45), (3.9, .35, .3), (5.40, .4, .25), (6.2, .2, .18),
                (8.93, .18, .12), (11.3, .08, .08)]
        ring = partials(f0, d, spec, a=.0004, seed=171, detune=1.8)
        hit = cn(d, 1000, 12000, seed=172) * env(d, .0003, .012) * .9
        low = osc(70 * np.exp(-T(d) / .1) + 45, d) * env(d, .001, .08) * .7
        return soft_clip(mix(ring * .7, hit, low), 1.3)
    d = .7
    spec = [(1, 1, .28), (2.76, .5, .2), (5.40, .3, .12), (8.93, .12, .07)]
    ring = partials(920, d, spec, a=.0003, seed=173, detune=2.5)
    hit = cn(d, 2000, 12000, seed=174) * env(d, .0003, .006) * .7
    return mix(ring, hit)


def s_enchant():
    d = 1.4
    rng = np.random.default_rng(181)
    t = T(d)
    air = cn(d, 4000, 14000, seed=182) * np.minimum(1, .3 + t / .35) * np.exp(-np.maximum(0, t - .45) / .3) * .18
    out = np.zeros(n_(d))
    times = np.concatenate([[0.0], np.sort(rng.beta(2, 3, 55) * (d - .25))])
    scale = [1.0, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2.0, 9 / 4, 5 / 2]                    # major pentatonic-ish grains
    for i, t0 in enumerate(times):
        f0 = 2093 * scale[rng.integers(len(scale))] * rng.choice([1, 1, 2])
        tau = rng.uniform(.02, .07)
        g = partials(f0, .25, [(1, 1, tau), (2.01, .25, tau * .5)], a=.003, seed=200 + i)
        out += at(g * rng.uniform(.2, .55) * (1 if i else .8), t0, d)
    return mix(air, out)


def s_door():
    d = .4
    latch = cn(.02, 1800, 8000, seed=191) * env(.02, .0002, .002) * .6
    cr = norm(creak(.11, 45, 70, [(260, 30, 1), (540, 40, .7), (1050, 70, .4)], seed=192)) * .35
    exc = np.zeros(n_(.3)); exc[0] = 1; exc[n_(.007)] = .45
    knock = norm(resonate(exc, WOOD_DOOR, ir_len=.25, seed=193))
    return mix(latch, cr, at(knock, .1, d))


def s_hit():
    d = .26
    body = osc(55 + 140 * np.exp(-T(d) / .025), d) * env(d, .0008, .06)
    smack = cn(d, 200, 3500, -2, seed=211) * env(d, .0004, .012) * .7
    return soft_clip(mix(body, smack), 2.0)


def s_boom():
    d = 2.4
    t = T(d)
    crack_ = cn(d, 200, 12000, -1, seed=221) * env(d, .0005, .03)
    sub = osc(30 + 50 * np.exp(-t / .12), d) * env(d, .002, .4)
    rumble_mod = 1 + .35 * np.repeat(np.random.default_rng(222).standard_normal(n_(d) // 2400 + 1), 2400)[:n_(d)]
    rumble = cn(d, 25, 700, -6, seed=223) * env(d, .004, .65) * np.clip(rumble_mod, .2, 2)
    bits = debris(d, .25, 10, 600, 4000, seed=224, gap=(.04, .12)) * .8
    return soft_clip(mix(crack_ * .8, sub * 1.1, rumble * .9, bits), 2.2)


def s_firework():
    d = 1.9
    rng = np.random.default_rng(231)
    lt = .55
    t = T(lt)
    launch_src = cn(lt, 200, 9000, seed=232)
    launch = svf(launch_src, 700 + 3500 * (t / lt) ** 1.5, q=2.5) * np.minimum(1, .45 + t / .05) * np.exp(-t / .45)
    fwump = osc(70 + 80 * np.exp(-t / .03), lt) * env(lt, .001, .04) * .5
    bang = mix(cn(.4, 150, 9000, -2, seed=233) * env(.4, .0005, .05), osc(60, .4) * env(.4, .001, .1) * .8)
    ct = np.sort(rng.uniform(.1, 1.15, 70))
    crackle = grains(1.3, ct, rng.uniform(.25, .7, 70) * np.exp(-ct / .7), 2000, 10000, (.001, .004), seed=234)
    return mix(norm(launch) * .6 + fwump, at(bang, lt + .05, d), at(crackle, lt + .1, d))


def s_portal():
    d = 1.5
    t = T(d)
    drone = (osc(110 * (1 + .01 * np.sin(2 * np.pi * 1.3 * t)), d, 'saw', harmonics=20) +
             osc(110.9 * (1 + .012 * np.sin(2 * np.pi * 1.7 * t + 1)), d, 'saw', harmonics=20) * .8 +
             osc(164.8, d, 'saw', harmonics=14) * .4)
    drone = svf(drone, 500 + 380 * np.sin(2 * np.pi * 2.2 * t), q=3.0, mode='lp')
    swirl = svf(cn(d, 100, 8000, seed=241), 900 + 650 * np.sin(2 * np.pi * 3.1 * t + .7), q=4.0)
    amp = np.minimum(1, .45 + t / .4) * np.minimum(1, (d - t) / .45)
    wobble = 1 + .25 * np.sin(2 * np.pi * 4.3 * t)
    return (norm(drone) * .75 + norm(swirl) * .55) * amp * wobble


def s_whoosh():
    d = .38
    t = T(d)
    u = t / d
    fc = 400 + 1700 * np.sin(np.pi * np.minimum(1, u * 1.15)) ** 2
    x = svf(cn(d, 100, 9000, -2, seed=251), fc, q=1.4)
    amp = np.minimum(1, .25 + t / .14) * np.exp(-np.maximum(0, t - .16) / .07)
    return x * amp


def s_chat():
    d = .09
    f = 940 + 120 * (1 - np.exp(-T(d) / .01))
    return osc(f, d) * env(d, .0012, .025) + osc(f * 2, d) * env(d, .001, .012) * .18


def s_ding():
    d = .8
    return mix(bell(1318.5, d, tau=.32, bright=1.0, seed=261), bell(2637, d, tau=.12, bright=.4, seed=262) * .25)


def s_glitch():
    d = .34
    a = osc(233.08, .13, 'sq', harmonics=9) * env(.13, .002, .09, .03)
    b = osc(174.6, .2, 'sq', harmonics=9) * env(.2, .002, .08, .05)
    buzz = 1 + .3 * np.tanh(4 * np.sin(2 * np.pi * 38 * T(d)))          # rounded gate: buzzy, not clicky
    return mix(a, at(b, .14, d)) * buzz * .8


def s_type(seed=271, pitch=1.0, heavy=False):
    d = .03 if not heavy else .05
    tick = cn(d, 1800 * pitch, 9000, seed=seed) * env(d, .0002, .0018)
    body = partials(2900 * pitch, d, [(1, .5, .004), (1.79, .3, .0025)], a=.0002, seed=seed + 1)
    thock = osc(320 * pitch if not heavy else 210, d) * env(d, .0005, .006 if not heavy else .012) * (.5 if not heavy else .9)
    return mix(tick, body, thock)


def s_type_burst():
    d = .62
    rng = np.random.default_rng(281)
    out = np.zeros(n_(d))
    t0 = 0.0
    i = 0
    while t0 < d - .04:
        heavy = (i == 6)
        k = s_type(300 + i, rng.uniform(.85, 1.2), heavy) * (rng.uniform(.55, 1.0) if i else 1.0)
        out += at(k, t0, d)
        t0 += rng.uniform(.042, .075)
        i += 1
    return out


def pluck(f, d, tau=.25):
    """plucked note (harp-like): bright attack partials fading fast to a rounder body"""
    return partials(f, d, [(1, 1, tau), (2, .35, tau * .45), (3, .18, tau * .25), (4, .08, tau * .15)], a=.002)


def s_sad():
    d = 1.0
    notes = [(659.25, 0, .18), (523.25, .17, .2), (440.0, .34, .45)]
    out = np.zeros(n_(d))
    for f, t0, tau in notes:
        out += at(pluck(f, d - t0, tau), t0, d)
    droop = at(osc(440 * (1 - .03 * np.minimum(1, T(.6) / .5)), .6, 'tri', harmonics=7) * env(.6, .02, .25) * .3, .34, d)
    return mix(out, droop)


def s_villager(single=False):
    """non-verbal synthetic nasal hum: jittered pulse train through a nasal-murmur resonator bank"""
    segs = [(.26, 150, 172, 132)] if single else [(.24, 140, 165, 128), (.2, 125, 150, 170)]
    rng = np.random.default_rng(291)
    pieces = []
    for dur, f0, fmid, f1 in segs:
        n = n_(dur)
        u = np.arange(n) / n
        f = np.where(u < .4, f0 + (fmid - f0) * u / .4, fmid + (f1 - fmid) * (u - .4) / .6)
        f = f * (1 + .015 * np.sin(2 * np.pi * 5.5 * u * dur))
        ph = np.cumsum(f / SR)
        pulses = np.zeros(n)
        idx = np.nonzero(np.diff(np.floor(ph)) > 0)[0]
        pulses[idx] = rng.uniform(.85, 1.0, len(idx))
        e = np.minimum(1, .45 + u * dur / .03) * np.minimum(1, (1 - u) * dur / .06)
        pulses = np.concatenate([[1.0], pulses[1:]]) * e
        voc = resonate(pulses, [(260, 60, 1.0), (1050, 140, .25), (2300, 200, .12), (3300, 300, .05)],
                       ir_len=.05, seed=292)
        pieces.append(voc)
        pieces.append(np.zeros(n_(.045)))
    return np.concatenate(pieces[:-1])


# ---- the rest of the older library, re-voiced so existing cue tables keep working

def s_alarm():
    d = .9
    out = np.zeros(n_(d))
    for i in range(4):
        out += at(bell(1760 if i % 2 == 0 else 1318.5, .22, tau=.08, bright=.7, seed=300 + i), i * .2, d)
    return out


def s_armor():
    d = .4
    rng = np.random.default_rng(311)
    out = np.zeros(n_(d))
    for i in range(14):
        t0 = 0 if i == 0 else rng.uniform(0, .22)
        ping = partials(rng.uniform(2600, 6500), .12, [(1, 1, .025), (1.62, .5, .015)], a=.0003, seed=312 + i)
        out += at(ping * rng.uniform(.3, 1) * np.exp(-t0 / .15), t0, d)
    cloth = cn(d, 500, 4000, -2, seed=330) * env(d, .002, .07) * .3
    return mix(out, cloth)


def s_cart():
    d = 1.1
    t = T(d)
    roll = cn(d, 40, 900, -5, seed=341) * np.minimum(1, .5 + t / .2) * np.minimum(1, (d - t) / .3) * .6
    clacks = sum(at(mix(partials(780, .08, [(1, 1, .012), (2.4, .5, .008)], a=.0003, seed=342 + i) * .7,
                        cn(.02, 1000, 6000, seed=350 + i) * env(.02, .0003, .003) * .3), t0, d)
                 for i, t0 in enumerate([0, .03, .34, .37, .68, .71]))
    return mix(roll, clacks)


def s_chime():
    d = 1.2
    out = np.zeros(n_(d))
    for i, f in enumerate([1318.5, 1568, 1975.5, 2637]):
        out += at(bell(f, d - i * .07, tau=.4, bright=.8, seed=360 + i), i * .07, d)
    return out


def s_coin():
    d = .6
    return mix(bell(1975.5, .1, tau=.05, seed=371) * .8, at(bell(2637, .5, tau=.18, seed=372), .07, d))


def s_fuse():
    d = 1.0
    t = T(d)
    rng = np.random.default_rng(381)
    hiss = cn(d, 3000, 12000, seed=382) * (1 + .3 * np.sin(2 * np.pi * 23 * t)) * np.minimum(1, .5 + t / .05) * \
        np.minimum(1, (d - t) / .15) * .45
    sp = np.sort(np.concatenate([[0.0], rng.uniform(0, .9, 22)]))
    return mix(hiss, grains(d, sp, rng.uniform(.4, 1, len(sp)), 1500, 8000, (.001, .004), seed=383))


def s_heart():
    d = .6
    beat = lambda f, a: osc(f * (1 + .4 * np.exp(-T(.2) / .02)), .2) * env(.2, .002, .05) * a
    return mix(beat(62, 1.0), at(beat(55, .75), .2, d))


def s_join():
    d = .35
    return mix(bell(987.8, d, tau=.08, bright=.5, seed=391), at(bell(1318.5, d - .08, tau=.12, bright=.5, seed=392), .08, d))


def s_magic():
    d = .7
    rng = np.random.default_rng(401)
    out = np.zeros(n_(d))
    for i, t0 in enumerate(np.concatenate([[0.0], np.sort(rng.uniform(0, .45, 18))])):
        f0 = 2093 * rng.choice([1, 5 / 4, 3 / 2, 2, 5 / 2])
        out += at(partials(f0, .2, [(1, 1, .04)], a=.003, seed=402 + i) * rng.uniform(.3, .8), t0, d)
    air = cn(d, 5000, 14000, seed=430) * env(d, .002, .2) * .12
    return mix(out, air)


def s_poof():
    d = .4
    t = T(d)
    return cn(d, 150, 2800, -4, seed=441) * np.minimum(1, .5 + t / .01) * np.exp(-t / .09) + \
        cn(d, 3000, 9000, seed=442) * env(d, .002, .03) * .15


def s_powerup():
    d = .8
    out = np.zeros(n_(d))
    for i, f in enumerate([784, 987.8, 1174.7, 1568]):
        out += at(pluck(f, d - i * .07, .2), i * .07, d)
    return out


def s_ring():
    d = 1.0
    t = T(d)
    gate = (np.sin(2 * np.pi * 16 * t) > -.2).astype(float)
    tone_ = bell(1396.9, d, tau=1.5, bright=.6, seed=451) + bell(1760, d, tau=1.5, bright=.5, seed=452) * .7
    gate = gate * np.where(t < .45, 1, np.where(t < .55, 0, 1))
    k = np.hanning(n_(.003)); gate = np.convolve(gate, k / k.sum(), 'same')          # de-click the gate edges
    gate[:n_(.002)] = np.maximum(gate[:n_(.002)], 1.0)
    return tone_ * gate * np.minimum(1, (d - t) / .05)


def s_roar():
    d = .9
    t = T(d)
    rng = np.random.default_rng(461)
    f = 72 * (1 + .1 * np.sin(2 * np.pi * .9 * t)) * (1 + .03 * rng.standard_normal(n_(d)).cumsum() / 300)
    src = osc(f, d, 'saw', harmonics=30) * (1 + .5 * cn(d, 20, 60, seed=462) * .3)
    growl = resonate(src * np.minimum(1, .35 + t / .06) * np.minimum(1, (d - t) / .25), [(380, 90, 1), (850, 150, .5),
                                                                              (1900, 300, .15)], ir_len=.03)
    return soft_clip(norm(growl) + cn(d, 200, 2500, -3, seed=463) * .15 * env(d, .05, .4), 1.8)


def s_scratch():
    d = .35
    t = T(d)
    strokes = np.abs(np.sin(2 * np.pi * 8.5 * t)) ** .5
    return cn(d, 1200, 9000, seed=471) * strokes * np.minimum(1, .4 + t / .02) * np.exp(-t / .2)


def s_sizzle():
    d = .8
    t = T(d)
    rng = np.random.default_rng(481)
    hiss = cn(d, 2500, 12000, seed=482) * np.minimum(1, .6 + t / .03) * np.exp(-t / .5) * .5
    pops_t = np.sort(np.concatenate([[0.0], rng.uniform(0, .7, 9)]))
    pops = sum(at(osc(400 * np.exp(-T(.04) / .01) + 180, .04) * env(.04, .0005, .008) * rng.uniform(.4, 1), p, d)
               for p in pops_t)
    return mix(hiss, pops)


def s_slap():
    d = .12
    return mix(cn(d, 1200, 12000, seed=491) * env(d, .0002, .008), osc(180, d) * env(d, .0005, .02) * .5,
               cn(d, 200, 1500, seed=492) * env(d, .0005, .02) * .4)


def s_tick():
    d = .05
    exc = np.zeros(n_(d)); exc[0] = 1
    return norm(resonate(exc, [(1800, 120, 1), (3100, 200, .5), (5200, 400, .2)], ir_len=.04)) + \
        cn(d, 3000, 10000, seed=501) * env(d, .0002, .001) * .4


def s_zap():
    d = .4
    t = T(d)
    rng = np.random.default_rng(511)
    sweep = osc(160 + 1700 * np.exp(-t / .07), d, 'saw', harmonics=14) * env(d, .001, .12) * .6
    ct = np.sort(np.concatenate([[0.0], rng.uniform(0, .25, 25)]))
    crack_ = grains(d, ct, rng.uniform(.4, 1, len(ct)) * np.exp(-ct / .12), 2000, 12000, (.0008, .003), seed=512)
    return mix(sweep, crack_)


def s_flip():
    d = .16
    t = T(d)
    return cn(d, 1500, 9000, -1, seed=521) * np.minimum(1, .5 + t / .02) * np.exp(-np.maximum(0, t - .03) / .03) + \
        at(cn(.06, 200, 1200, seed=522) * env(.06, .004, .015) * .4, .06, d)


SOUNDS = {
    'xp': (s_xp(1.0), 'Orb-pickup ding: high bell (1.76 kHz harmonic + 2.76x inharmonic partials, 75 ms decay) with a tiny noise tick. Evokes the experience-orb pickup.'),
    'xp_1': (s_xp(.80), 'xp at 0.80x pitch (random-pitch variant).'),
    'xp_2': (s_xp(.90), 'xp at 0.90x pitch.'),
    'xp_3': (s_xp(1.06), 'xp at 1.06x pitch.'),
    'xp_4': (s_xp(1.19), 'xp at 1.19x pitch.'),
    'levelup': (s_levelup, 'C6-E6-G6-C7 bell arpeggio 45 ms apart, chorus-detuned twins, octave-below pad, 6.5 Hz tremolo shimmer, ~1.6 s. Evokes the level-up chime.'),
    'toast': (s_toast, 'Faint airy swish then a G5 -> D6 bell fifth with a G6 overtone. Evokes the advancement-made notification.'),
    'pickup': (s_pickup, 'Upward sine "bubble" chirp 650 -> 1550 Hz, 28 ms decay, plus a click. Evokes the item-pickup pop.'),
    'pop': (s_pop, 'Downward sine plip 1.67 kHz -> 420 Hz with an airy noise puff. Evokes the generic pop.'),
    'place': (s_place, 'Low sine thump 165 -> 60 Hz + short dark grit noise + a few crumbs. Evokes placing a block.'),
    'break': (s_break_generic, '28 mid-band noise grains with decaying density, low thump, falling debris ticks. Evokes breaking dirt/gravel.'),
    'break_stone': (s_break_stone, 'Brighter, denser grain cluster (0.7-5.5 kHz) + gritty hiss + thump + debris. Evokes breaking stone.'),
    'break_wood': (s_break_wood, 'Impulse cluster through a 5-mode wood resonator (180-1900 Hz) + splinter grains + debris. Evokes breaking wood.'),
    'break_glass': (s_break_glass, 'Bright noise impact + 26 inharmonic shard pings (2.2-7.5 kHz) scattered over 0.3 s + tinkle grains. Evokes glass breaking.'),
    'crack': (s_crack, 'Six scratchy noise grains in 70 ms. Evokes the mining/dig-progress tick.'),
    'step': (s_step, 'Dark noise burst (120-1600 Hz) + grit grains + 130 Hz knock, 120 ms. Evokes a footstep on stone.'),
    'step_wood': (s_step_wood, 'Double impulse through hollow wood modes + scuff noise. Evokes a footstep on planks.'),
    'thud': (s_thud, 'Sine drop 103 -> 48 Hz + dark dirt noise + slap, soft-clipped. Heavy landing / stamp.'),
    'click': (s_click, 'Noise tick + 1.25 kHz damped "tock" partials + small second click at 16 ms. Evokes the menu button click.'),
    'page': (s_page, 'Crinkle-modulated high noise rustle with a low flap at 0.2 s. Book page turn.'),
    'chest': (lambda: s_chest(False), 'Latch tick, stick-slip creak (35 -> 70 Hz impulses through wood modes), lid knock at 0.38 s. Evokes a chest opening.'),
    'chestclose': (lambda: s_chest(True), 'Short reverse creak then a heavier wooden slam + 90 Hz thump. Evokes a chest closing.'),
    'anvil': (lambda: s_anvil(False), 'Inharmonic metal partials (415 Hz x 1, 1.47, 2.76, 3.9, 5.4, 6.2, 8.93, 11.3) with beating twins, impact noise, low thump. Evokes an anvil landing.'),
    'anvil_use': (lambda: s_anvil(True), 'Lighter, higher (920 Hz) shorter metal ring. Evokes using an anvil.'),
    'enchant': (s_enchant, '55 pentatonic sine grains (2-10 kHz) scattered with a beta-shaped density over an airy high-noise swell. Evokes the enchanting-table shimmer.'),
    'door': (s_door, 'Latch tick, brief creak, wooden knock through door-panel modes. Evokes a wooden door.'),
    'hit': (s_hit, 'Punchy sine 195 -> 55 Hz + mid noise smack, soft-clipped; no voice. Evokes taking damage.'),
    'boom': (s_boom, 'Broadband crack + 80 -> 30 Hz sub drop + modulated brown rumble (0.65 s decay) + debris, saturated, ~2.3 s. Evokes a TNT explosion.'),
    'firework': (s_firework, 'Rising band-pass noise whistle with launch thump, bang at 0.6 s, then 70 decaying crackle grains. Evokes a firework rocket.'),
    'portal': (s_portal, 'Detuned band-limited saw drone (110/111/165 Hz) through LFO-swept low-pass + swirling band-pass noise, 4.3 Hz wobble, 1.5 s. Evokes the nether-portal hum.'),
    'whoosh': (s_whoosh, 'Band-pass noise with centre sweeping 400 -> 2100 -> 400 Hz, dark tilt. Subtle camera swoosh.'),
    'chat': (s_chat, 'Soft 940 Hz sine blip with slight upward glide, 90 ms. Chat message.'),
    'ding': (s_ding, 'E6 bell with an E7 overtone layer, 0.8 s. Correct-answer ding (note-block bell flavour).'),
    'glitch': (s_glitch, 'Two soft band-limited square notes (Bb3 -> F3) with a gentle 38 Hz buzz gate. Wrong-answer buzz (note-block bass flavour).'),
    'type': (s_type, 'Noise tick + 2.9 kHz keycap partials + 320 Hz thock, 30 ms. Single keystroke.'),
    'type_burst': (s_type_burst, 'About 10 keystrokes at 42-75 ms random intervals, random pitch/level, one heavier space bar. 0.6 s typing.'),
    'sad': (s_sad, 'Plucked E5 -> C5 -> A4 descent with a drooping triangle tail. Fail cue (note-block harp flavour).'),
    'villager': (lambda: s_villager(False), 'Two-part "hrm-hmm": jittered pulse train with a pitch contour through a nasal-murmur resonator bank (260/1050/2300/3300 Hz). A generic synthetic nasal hum, not modelled on any recording. Evokes a villager grunt.'),
    'grunt': (lambda: s_villager(True), 'Single short nasal hum (same synthetic pulse-train + resonator method as villager). Non-verbal grunt.'),
    'alarm': (s_alarm, 'Four alternating A6/E6 bell pings, 0.2 s apart. Alert.'),
    'armor': (s_armor, '14 clinky metal pings (2.6-6.5 kHz) in 0.22 s + cloth rustle. Evokes equipping armour.'),
    'cart': (s_cart, 'Dark rolling rumble with paired rail clacks every 0.34 s. Evokes a minecart.'),
    'chime': (s_chime, 'E6-G6-B6-E7 bell arpeggio. Generic chime.'),
    'coin': (s_coin, 'B6 -> E7 two-note bell. Coin / reward.'),
    'fuse': (s_fuse, 'Modulated high hiss with crackle sparks, 1 s. Evokes a lit TNT fuse.'),
    'heart': (s_heart, 'Double low sine thump (62/55 Hz). Heartbeat.'),
    'join': (s_join, 'B5 -> E6 soft bell blip. Player joined.'),
    'magic': (s_magic, 'Short sparkle: 19 sine grains + air. Lighter enchant.'),
    'poof': (s_poof, 'Soft dark noise puff with fast decay + air. Evokes a mob vanishing in smoke.'),
    'powerup': (s_powerup, 'Plucked G5-B5-D6-G6 rising arpeggio. Power-up.'),
    'ring': (s_ring, 'F6/A6 bell pair gated at 16 Hz, two bursts. Phone ring.'),
    'roar': (s_roar, 'Wobbling 72 Hz saw through growl formants, saturated. Generic low creature growl.'),
    'scratch': (s_scratch, 'High noise with 8.5 Hz stroke modulation. Scratching.'),
    'sizzle': (s_sizzle, 'Decaying hiss with low bubbly pops. Evokes lava / fire sizzle.'),
    'slap': (s_slap, 'Bright noise snap + low body. Slap.'),
    'tick': (s_tick, 'Single impulse through small hard-wood modes. Clock tick.'),
    'zap': (s_zap, 'Saw sweep 1.86 kHz -> 160 Hz + electric crackle grains. Zap.'),
    'flip': (s_flip, 'Quick paper flap: high rustle then soft low flap. Card / page flip.'),
}


def write_wav(path, x):
    pcm = np.clip(np.round(x * 32767), -32768, 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    rendered = {}
    for name, (fn, _) in SOUNDS.items():
        x = finish(fn())
        rendered[name] = x
        write_wav(os.path.join(out, name + '.wav'), x)
    gap = np.zeros(n_(.4))
    demo = np.concatenate([np.concatenate([rendered[k], gap]) for k in SOUNDS])
    write_wav(os.path.join(out, '_demo.wav'), demo)
    lines = ['# Block-game SFX catalog', '',
             'Generated by `tools/video/sfx_mc.py` (numpy only). Every sound is synthesised from sine partials, coloured',
             'noise, impulse trains and resonator banks. No game audio, sample pack or recording was used, resampled or',
             'traced; the goal is a familiar block-game character, not a copy. 48 kHz mono 16-bit, starts at t=0, peak -3 dBFS.',
             '', f'`_demo.wav` plays every file below in this order with 0.4 s gaps ({len(demo) / SR:.1f} s).', '',
             '| file | duration | how it is built / what it evokes |', '|---|---|---|']
    for k, (_, desc) in SOUNDS.items():
        lines.append(f'| {k}.wav | {len(rendered[k]) / SR:.2f} s | {desc} |')
    with open(os.path.join(out, 'CATALOG.md'), 'w') as fh:
        fh.write('\n'.join(lines) + '\n')
    print(f'sfx_mc: {len(rendered)} files + _demo.wav ({len(demo) / SR:.1f} s) + CATALOG.md -> {out}')


if __name__ == '__main__':
    main()
