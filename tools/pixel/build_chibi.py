"""Build the clean chibi 黑哥 sprite: the body from the extracted concept (palette normalised), the head redrawn by hand
on the same grid with clean pixel shapes. Writes out/art/hgChibi_final*.png and src/pixel/heige_variants/hgChibi.js.

usage: python3 build_chibi.py
"""
import os

import numpy as np
from PIL import Image

REPO = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
SRC = os.path.join(REPO, 'art', 'heige', 'chibi-concept-clean.png')   # the concept, through pixelize.py + sprite2js.py
OUT = os.path.join(REPO, 'out', 'art', 'hgChibi_final')                # previews
JS = os.path.join(REPO, 'src', 'pixel', 'heige_variants', 'hgChibi.js')

P = {   # the clean palette
    'O': '#0B0920',                                                                        # outline
    'k': '#1B1A2B', 'c': '#2C2B3D', 'm': '#3B3B50', 'h': '#5A5F7E', 'r': '#4A68B0',        # cap / hoodie ramp, blue rim
    's': '#FCC79B', 'S': '#F4A77D', 'd': '#E0805B', 'l': '#FFE2C6',                        # skin ramp
    'b': '#4A3238', 'B': '#6B4A4A',                                                        # hair
    'w': '#FEFEFE', 'g': '#C3C8DA', 'G': '#9EA4BC',                                        # whites and shoe greys
    'y': '#22A7D6', 'Y': '#7AD3EE',                                                        # cyan drawstrings
    'p': '#3A2733',                                                                        # pants shadow line
}
RGB = {k: np.array([int(v[i:i + 2], 16) for i in (1, 3, 5)], np.float32) for k, v in P.items()}


def nearest(c, keys):
    return min(keys, key=lambda k: float(((RGB[k] - c) ** 2).sum()))


LOGO = False   # the white bunny on the cap's front panel: off since 2026-10-14 (Blake: 人物帽子头上的兔子去掉吧)


def build(features=True, logo=LOGO):
    """The chibi as a grid of palette keys. features=False leaves out the brows, the eyes and the mouth: the base the
    animation rig stamps its expressions onto (see build_heige_rig.py). logo=True puts the bunny back on the cap."""
    a = np.array(Image.open(SRC).convert('RGBA'))
    h, w = a.shape[:2]
    g = [['.'] * w for _ in range(h)]
    body_keys = ['O', 'k', 'c', 'm', 'h', 'r', 's', 'S', 'd', 'l', 'b', 'w', 'g', 'G']
    for y in range(h):
        for x in range(w):
            if a[y, x, 3] == 0: continue
            g[y][x] = nearest(a[y, x, :3].astype(np.float32), body_keys)
    S = lambda x, y, c: (0 <= x < w and 0 <= y < h) and g[y].__setitem__(x, c)
    get = lambda x, y: g[y][x] if 0 <= x < w and 0 <= y < h else '.'

    # ---- the drawstrings: cyan, with a light tip ----
    for y in range(52, 62):
        for x in range(19, 32):
            if get(x, y) in ('r', 'h', 'm') and (x <= 23 or x >= 27): S(x, y, 'y')
    for x in (21, 28): S(x, 52, 'Y')

    # ---- the head, redrawn ----
    cx = 25.5
    def inside_face(x, y, rx=15.6, ry=12.6, cy=33.6, n=2.45):
        dx, dy = abs(x - cx) / rx, abs(y - cy) / ry
        return dx ** n + dy ** n <= 1
    # clear the old head below the brim (rows 21..47 between the ears) so nothing of the noisy face survives
    for y in range(21, 48):
        for x in range(0, w):
            if g[y][x] != '.' and (inside_face(x, y, 16.6, 13.6) or (y >= 23 and 2 <= x <= 49 and y <= 42)):
                g[y][x] = '.'
    # hair at the temples, behind everything
    for (x0, x1) in ((6, 12), (39, 45)):
        for y in range(22, 31):
            for x in range(x0, x1 + 1): S(x, y, 'b')
    # ears: round, skin, ringed, with an inner curl
    for ex in (5.5, 45.5):
        pts = [(x, y) for y in range(28, 43) for x in range(0, w) if ((x - ex) / 4.6) ** 2 + ((y - 35.2) / 5.8) ** 2 <= 1]
        ps = set(pts)
        for (x, y) in pts:
            edge = any((x + dx, y + dy) not in ps for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
            S(x, y, 'O' if edge else 's')
        s = -1 if ex < cx else 1
        for (x, y) in ((ex - s * 1, 33), (ex - s * 0, 34), (ex + s * 0, 35), (ex - s * 1, 37)):
            S(int(round(x)), y, 'd')
        for (x, y) in ((ex + s * 1, 32), (ex + s * 1, 33)): S(int(round(x)), y, 'S')
    # the face: skin, a ring, soft shading on the right and under the jaw, a little light top-left
    face = {(x, y) for y in range(19, 48) for x in range(w) if inside_face(x, y)}
    for (x, y) in face:
        edge = any((x + dx, y + dy) not in face for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        S(x, y, 'O' if edge else 's')
    for (x, y) in face:
        if get(x, y) != 's': continue
        if (x + 1, y) not in face or (x + 2, y) not in face:
            if x > cx: S(x, y, 'S')
        if (x, y + 1) not in face or (x, y + 2) not in face: S(x, y, 'S')
    for (x, y) in ((13, 36), (13, 37), (14, 38)): S(x, y, 'l')
    # ---- the cap's brim, clean: an arched band with a lit top surface ----
    def y_top(x): return 15.0 + ((x - cx) / 21.5) ** 2 * 7.0
    def y_bot(x): return 21.2 + ((x - cx) / 19.5) ** 2 * 3.6
    for x in range(4, 48):
        t, b = int(round(y_top(x))), int(round(y_bot(x))) if abs(x - cx) <= 20 else int(round(y_top(x))) + 2
        for y in range(t, b + 1): S(x, y, 'm')
        S(x, t - 1, 'O'); S(x, b + 1, 'O')
        if t + 1 <= b: S(x, t, 'h')
        if abs(x - cx) <= 12 and t + 2 <= b: S(x, t + 1, 'c' if (x + t) % 2 else 'm')
    for x in (3, 4, 47, 48):   # round the brim's ends
        for y in range(int(y_top(x)) - 1, int(y_top(x)) + 4): S(x, y, 'O' if get(x, y) != '.' else '.')
    # the brim's shadow on the forehead
    for (x, y) in face:
        if get(x, y) == 's' and y <= y_bot(x) + 2.4: S(x, y, 'd' if y <= y_bot(x) + 1.4 else 'S')
    # ---- brows: thick, slightly arched ----
    for (x0, x1, s) in ((14, 21, -1), (30, 37, 1)) if features else ():
        for x in range(x0, x1 + 1): S(x, 25, 'O')
        for x in range(x0 + 1, x1): S(x, 24, 'O')
        S(x0 if s < 0 else x1, 26, 'O')   # the outer end drops a pixel
    # ---- glasses: rounded frames, a bridge, temples; a glint in each lens ----
    for (x0, x1) in ((10, 22), (29, 41)):
        y0, y1 = 28, 38
        for x in range(x0 + 2, x1 - 1): S(x, y0, 'O'); S(x, y1, 'O')
        for y in range(y0 + 2, y1 - 1): S(x0, y, 'O'); S(x1, y, 'O')
        for (x, y) in ((x0 + 1, y0 + 1), (x1 - 1, y0 + 1), (x0 + 1, y1 - 1), (x1 - 1, y1 - 1)): S(x, y, 'O')
        for x in range(x0 + 1, x1):
            for y in range(y0 + 1, y1):
                if get(x, y) in ('d', 'S') and not ((x in (x0 + 1, x1 - 1)) and (y in (y0 + 1, y1 - 1))): S(x, y, 's')
        S(x0 + 2, y0 + 2, 'l'); S(x0 + 3, y0 + 2, 'l'); S(x0 + 2, y0 + 3, 'l')
    for x in range(23, 29): S(x, 29, 'O')
    for x in range(24, 28): S(x, 28, 'O')
    S(9, 31, 'O'); S(42, 31, 'O')
    # ---- eyes: round, dark, a white glint ----
    for ex in (16, 32) if features else ():
        for y in range(31, 36):
            for x in range(ex, ex + 4):
                if (x in (ex, ex + 3)) and (y in (31, 35)): continue
                S(x, y, 'O')
        S(ex + 1, 32, 'w')
    # ---- nose and smile ----
    S(25, 36, 'S'); S(26, 36, 'S'); S(26, 37, 'd')
    if features:
        for x in range(24, 28): S(x, 42, 'O')
        S(23, 41, 'O'); S(28, 41, 'O')
    # ---- the neck ----
    for y in range(46, 50):
        for x in range(22, 30):
            if get(x, y) in ('.', 'O', 'k', 'c', 'm', 'd', 'S') and y <= 48: S(x, y, 'S' if y == 46 else 's')
    # ---- the cap's front panel: the concept's logo cleared to plain cap; the bunny only when asked for ----
    for y in range(6, 14):
        for x in range(21, 31):
            if get(x, y) == 'w' or get(x, y) == 'g': S(x, y, 'c')
    bunny = ['.w.w.', '.w.w.', '.www.', 'wwwww', 'wOwOw', 'wwwww', '.www.']
    for j, row in enumerate(bunny if logo else ()):
        for i, ch in enumerate(row):
            if ch != '.': S(23 + i, 6 + j, ch)
    return g


def main():
    g = build()
    h, w = len(g), len(g[0])
    # ---- write ----
    img = np.zeros((h, w, 4), np.uint8)
    for y in range(h):
        for x in range(w):
            if g[y][x] != '.':
                img[y, x, :3] = RGB[g[y][x]]; img[y, x, 3] = 255
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    Image.fromarray(img, 'RGBA').save(OUT + '.png')
    Image.fromarray(img, 'RGBA').resize((w * 10, h * 10), Image.NEAREST).save(OUT + '_x10.png')
    rows = [''.join(r) for r in g]
    while rows and set(rows[-1]) == {'.'}: rows.pop()
    js = 'var SPRITES = window.SPRITES = window.SPRITES || {};\n'
    js += "SPRITES['hgChibi'] = { pal: { " + ', '.join(f"'{k}': '{v}'" for k, v in P.items()) + " },\n  rows: [\n"
    js += ''.join(f"    '{r}',\n" for r in rows) + '  ] };\n'
    open(JS, 'w').write(js)
    print(f'hgChibi final: {w}x{len(rows)} -> {JS}')


if __name__ == '__main__':
    main()
