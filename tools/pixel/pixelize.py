"""Turn a generated "pixel art" concept into a real sprite.

Image models draw pixel art with an approximate grid: blocks of roughly equal size, soft edges, colour drift. This
finds the grid, samples one colour per block, cuts the flat background away, quantizes to a small palette and crops to
the character, so the result is a true low-resolution sprite (one array entry per pixel) ready to clean by hand.

usage: python3 pixelize.py concept.png out_prefix [--colors 16] [--block auto|N] [--bg auto|#rrggbb]
writes: out_prefix.png (the sprite at 1:1), out_prefix_x8.png (blown up 8x for viewing), out_prefix.txt (palette grid)
"""
import argparse
import sys

import numpy as np
from PIL import Image


def _profiles(img):
    a = img.astype(np.float32)
    return [np.abs(np.diff(a, axis=ax)).sum(axis=2).sum(axis=0 if ax == 1 else 1) for ax in (1, 0)]


def _score(prof, s):
    """Best phase for period s on one axis: edge energy on the grid lines minus energy mid-cell."""
    n = len(prof); best = (-1e18, 0.0)
    for o in np.arange(0, s, 0.25):
        lines = np.arange(o, n - 1, s)
        on = prof[np.clip(np.round(lines).astype(int), 0, n - 1)].mean()
        mid = prof[np.clip(np.round(lines + s / 2).astype(int), 0, n - 1)].mean()
        if on - mid > best[0]: best = (on - mid, o)
    return best


def grid_period(img):
    """One square block size for both axes, to a hundredth of a pixel, plus each axis's phase. Image models draw grids
    like 11.6 px; sampling at a rounded period drifts off the blocks within a few dozen columns. A coarse period from
    the autocorrelation of the edge profiles, then a fine search where both axes vote."""
    profs = _profiles(img)
    acs = []
    for prof in profs:
        c = prof - prof.mean(); n = len(c)
        acs.append(np.correlate(c, c, mode='full')[n - 1:])
    ac = acs[0][:80] / acs[0][0] + acs[1][:80] / acs[1][0]
    coarse = max(range(5, 80), key=lambda k: ac[k] / (1 + 0.002 * k))
    best = (-1e18, coarse, 0, 0)
    for s in np.arange(coarse - 1.2, coarse + 1.2, 0.01):
        (sx, ox), (sy, oy) = _score(profs[0], s), _score(profs[1], s)
        tot = sx / profs[0].mean() + sy / profs[1].mean()
        if tot > best[0]: best = (tot, s, ox, oy)
    _, s, ox, oy = best
    return [(s, ox + 0.5), (s, oy + 0.5)]   # edges sit between pixels: the block starts half a pixel later


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src'); ap.add_argument('out')
    ap.add_argument('--colors', type=int, default=32)
    ap.add_argument('--merge', type=float, default=22)
    ap.add_argument('--block', default='auto')
    ap.add_argument('--bg', default='auto')
    ap.add_argument('--bgtol', type=float, default=26)
    o = ap.parse_args()
    im = np.array(Image.open(o.src).convert('RGB'))
    H, W, _ = im.shape
    if o.block == 'auto':
        (sx, ox), (sy, oy) = grid_period(im)
        s = (sx + sy) / 2
        print(f'grid: x period {sx:.2f} offset {ox:.2f}, y period {sy:.2f} offset {oy:.2f}')
    else:
        s = float(o.block); sx = sy = s; profs = _profiles(im); ox, oy = _score(profs[0], s)[1] + .5, _score(profs[1], s)[1] + .5   # given size, found phase
    # one colour per block: the median of the block's inner half (edges are where the model blurs)
    nx, ny = int((W - ox) // sx), int((H - oy) // sy)
    small = np.zeros((ny, nx, 3), np.uint8)
    for j in range(ny):
        for i in range(nx):
            x0, y0 = int(ox + i * sx), int(oy + j * sy)
            q = int(sx * .25), int(sy * .25)
            blk = im[y0 + q[1]: int(y0 + sy) - q[1], x0 + q[0]: int(x0 + sx) - q[0]].reshape(-1, 3)
            small[j, i] = np.median(blk, axis=0) if len(blk) else im[min(H - 1, y0), min(W - 1, x0)]
    # background: the most common border colour
    if o.bg == 'auto':
        border = np.concatenate([small[0], small[-1], small[:, 0], small[:, -1]])
        vals, counts = np.unique(border, axis=0, return_counts=True)
        bg = vals[np.argmax(counts)].astype(np.float32)
    else:
        bg = np.array([int(o.bg[i:i + 2], 16) for i in (1, 3, 5)], np.float32)
    mask = np.linalg.norm(small.astype(np.float32) - bg, axis=2) > o.bgtol
    # keep the largest 8-connected region: anything else in the crop (a neighbour's arm, specks) goes
    lab = np.zeros(mask.shape, np.int32); cur = 0; sizes = {}
    for sy0, sx0 in zip(*np.where(mask)):
        if lab[sy0, sx0]: continue
        cur += 1; stack = [(sy0, sx0)]; lab[sy0, sx0] = cur; n = 0
        while stack:
            y, x = stack.pop(); n += 1
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    yy, xx = y + dy, x + dx
                    if 0 <= yy < mask.shape[0] and 0 <= xx < mask.shape[1] and mask[yy, xx] and not lab[yy, xx]:
                        lab[yy, xx] = cur; stack.append((yy, xx))
        sizes[cur] = n
    if sizes: mask = lab == max(sizes, key=sizes.get)
    ys, xs = np.where(mask)
    if not len(ys):
        sys.exit('no character found')
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    small, mask = small[y0:y1, x0:x1], mask[y0:y1, x0:x1]
    # drop a baked-in ground shadow: a light, greyish colour that fills most of the bottom row
    bottom = small[-1][mask[-1]]
    if len(bottom):
        vals, cnt = np.unique(bottom, axis=0, return_counts=True)
        sh = vals[np.argmax(cnt)].astype(np.float32)
        if sh.mean() > 130 and sh.max() - sh.min() < 40:
            near = np.linalg.norm(small.astype(np.float32) - sh, axis=2) < 34
            rows = np.zeros_like(mask); rows[-4:] = True
            mask &= ~(near & rows)
            ys, xs = np.where(mask); y0b, y1b, x0b, x1b = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
            small, mask = small[y0b:y1b, x0b:x1b], mask[y0b:y1b, x0b:x1b]
    # colours: keep each block's own colour and only merge near-identical ones (greedy, most frequent first), so a
    # small white logo or a cyan cord never gets folded into a big neighbouring colour
    px = small[mask].astype(np.float32)
    uniq, cnt = np.unique(px.astype(np.uint8), axis=0, return_counts=True)
    order = np.argsort(-cnt)
    cent = []
    for i in order:
        c = uniq[i].astype(np.float32)
        if not any(np.linalg.norm(c - k) < o.merge for k in cent): cent.append(c)
        if len(cent) >= o.colors: break
    cent = np.array(cent)
    d = ((px[:, None, :] - cent[None, :, :]) ** 2).sum(2)
    lab = d.argmin(1)
    out = np.zeros((*small.shape[:2], 4), np.uint8)
    q = np.zeros_like(small); q[mask] = cent[lab].round().astype(np.uint8)
    out[..., :3] = q; out[..., 3] = mask * 255
    Image.fromarray(out, 'RGBA').save(o.out + '.png')
    Image.fromarray(out, 'RGBA').resize((out.shape[1] * 8, out.shape[0] * 8), Image.NEAREST).save(o.out + '_x8.png')
    # palette grid: one character per colour, '.' for transparent
    keys = '0123456789ABCDEFGHIJKLMNOPQRSTUV'
    pal = {}
    lines = []
    for j in range(out.shape[0]):
        row = ''
        for i in range(out.shape[1]):
            if out[j, i, 3] == 0: row += '.'; continue
            c = '#%02X%02X%02X' % tuple(out[j, i, :3])
            if c not in pal: pal[c] = keys[len(pal)]
            row += pal[c]
        lines.append(row)
    with open(o.out + '.txt', 'w') as f:
        f.write('palette: ' + ' '.join(f'{v}={k}' for k, v in pal.items()) + '\n')
        f.write('\n'.join(lines) + '\n')
    print(f'sprite {out.shape[1]}x{out.shape[0]} px, block ~{s:.1f}px, {len(pal)} colours -> {o.out}.png')


if __name__ == '__main__':
    main()
