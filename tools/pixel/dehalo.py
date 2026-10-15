"""Strip the light halo an image model leaves around a character drawn on a flat light background: pixelize.py keeps
the blend of figure and background on the silhouette edge, so the outline gets light specks next to dark hair or
clothes. A light, low-saturation pixel on the edge (touching transparency) goes when most of its drawn neighbours are
darker than it; the same pixel inside lace or an apron (light neighbours) stays. Repeats until nothing changes.
usage: python3 dehalo.py in.png out.png [--light .72] [--sat .22]"""
import argparse

import numpy as np
from PIL import Image


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('dst'); ap.add_argument('--light', type=float, default=.72); ap.add_argument('--sat', type=float, default=.22)
    o = ap.parse_args()
    a = np.asarray(Image.open(o.src).convert('RGBA')).copy(); h, w = a.shape[:2]; gone = 0
    f = a[..., :3].astype(np.float32) / 255; V = f.max(-1); S = np.where(V > 0, (V - f.min(-1)) / np.maximum(V, 1e-6), 0)
    while True:
        kill = []
        for y in range(h):
            for x in range(w):
                if not a[y, x, 3] or V[y, x] < o.light or S[y, x] > o.sat: continue
                nb = [(y + dy, x + dx) for dy in (-1, 0, 1) for dx in (-1, 0, 1) if (dx or dy) and 0 <= y + dy < h and 0 <= x + dx < w]
                if not any(not a[p][3] for p in nb if abs(p[0] - y) + abs(p[1] - x) == 1) and not (y in (0, h - 1) or x in (0, w - 1)): continue
                drawn = [p for p in nb if a[p][3]]
                if drawn and sum(V[p] < V[y, x] - .15 for p in drawn) > len(drawn) / 2: kill.append((y, x))
        if not kill: break
        for p in kill: a[p] = 0
        gone += len(kill)
    Image.fromarray(a).save(o.dst); print(f'{gone} halo pixels removed -> {o.dst}')


if __name__ == '__main__':
    main()
