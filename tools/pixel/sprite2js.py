"""Clean an extracted sprite and emit it as a JS text-grid sprite for the pixel back end.

Cleanup: a pixel whose colour matches none of its 4 neighbours, while most of its 8 neighbours share one colour, takes
that colour (the specks image models leave on edges). Transparent pixels are left alone; holes of one pixel inside the
silhouette are filled from the majority.

usage: python3 sprite2js.py sprite.png NAME out.js [--passes 1] [--scale 1.0]
"""
import argparse
from collections import Counter

import numpy as np
from PIL import Image


def clean(a, passes=1):
    h, w, _ = a.shape
    for _ in range(passes):
        b = a.copy()
        for y in range(h):
            for x in range(w):
                me = tuple(a[y, x])
                n4 = [tuple(a[y + dy, x + dx]) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)) if 0 <= x + dx < w and 0 <= y + dy < h]
                n8 = [tuple(a[y + dy, x + dx]) for dy in (-1, 0, 1) for dx in (-1, 0, 1) if (dx or dy) and 0 <= x + dx < w and 0 <= y + dy < h]
                if me in n4: continue
                col, cnt = Counter(n8).most_common(1)[0]
                if cnt >= 5 and (me[3] > 0 or col[3] > 0): b[y, x] = col
        a = b
    return a


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src'); ap.add_argument('name'); ap.add_argument('out')
    ap.add_argument('--passes', type=int, default=1)
    o = ap.parse_args()
    a = np.array(Image.open(o.src).convert('RGBA'))
    a[a[..., 3] < 128] = 0
    a = clean(a, o.passes)
    Image.fromarray(a, 'RGBA').save(o.src.replace('.png', '_clean.png'))
    Image.fromarray(a, 'RGBA').resize((a.shape[1] * 8, a.shape[0] * 8), Image.NEAREST).save(o.src.replace('.png', '_clean_x8.png'))
    keys = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    pal, rows = {}, []
    for y in range(a.shape[0]):
        r = ''
        for x in range(a.shape[1]):
            if a[y, x, 3] == 0: r += '.'; continue
            c = '#%02X%02X%02X' % tuple(a[y, x, :3])
            if c not in pal: pal[c] = keys[len(pal)]
            r += pal[c]
        rows.append(r)
    # trim empty rows/columns
    while rows and set(rows[0]) == {'.'}: rows.pop(0)
    while rows and set(rows[-1]) == {'.'}: rows.pop()
    l = min(len(r) - len(r.lstrip('.')) for r in rows); rr = max(len(r.rstrip('.')) for r in rows)
    rows = [r[l:rr] for r in rows]
    js = 'var SPRITES = window.SPRITES = window.SPRITES || {};\n'
    js += f"SPRITES[{o.name!r}] = {{ pal: {{ {', '.join(f'{k!r}: {v!r}' for v, k in pal.items())} }},\n  rows: [\n"
    js += ''.join(f'    {r!r},\n' for r in rows) + '  ] };\n'
    open(o.out, 'w').write(js)
    print(f'{o.name}: {len(rows[0])}x{len(rows)} px, {len(pal)} colours -> {o.out}')


if __name__ == '__main__':
    main()
