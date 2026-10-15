"""Give a sprite the cast's outline: 黑哥 and Clawd are ringed by one dark pixel, a concept sprite often is not. Every
transparent pixel that touches the figure (4 ways) becomes the outline colour; the canvas grows by one pixel each side
so nothing is cut. Specks first: islands smaller than --min-blob pixels (bits of a drawn ground shadow, stray blocks)
are dropped, or they would come back ringed.
usage: python3 outline.py in.png out.png [--color #12142B] [--min-blob 8]"""
import argparse

import numpy as np
from PIL import Image


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('dst'); ap.add_argument('--color', default='#12142B'); ap.add_argument('--min-blob', type=int, default=8)
    o = ap.parse_args(); col = tuple(int(o.color[i:i + 2], 16) for i in (1, 3, 5)) + (255,)
    im = Image.open(o.src).convert('RGBA'); a = np.zeros((im.height + 2, im.width + 2, 4), np.uint8); a[1:-1, 1:-1] = np.asarray(im)
    h, w = a.shape[:2]; on = a[..., 3] > 0
    seen = np.zeros_like(on)
    for y0, x0 in zip(*np.where(on)):
        if seen[y0, x0]: continue
        blob, stack = [], [(y0, x0)]; seen[y0, x0] = True
        while stack:
            y, x = stack.pop(); blob.append((y, x))
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and on[ny, nx] and not seen[ny, nx]: seen[ny, nx] = True; stack.append((ny, nx))
        if len(blob) < o.min_blob:
            for p in blob: a[p] = 0; on[p] = False
    ring = np.zeros_like(on)
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ring |= np.roll(np.roll(on, dy, 0), dx, 1)
    ring &= ~on
    a[ring] = col
    Image.fromarray(a).save(o.dst); print(f'{int(ring.sum())} outline pixels -> {o.dst} ({w}x{h})')


if __name__ == '__main__':
    main()
