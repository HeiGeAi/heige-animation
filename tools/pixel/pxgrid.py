"""Sparse pixel grids for building sprites by hand in Python: {(x, y): palette key}, with the same moves the JS side
has (fills ringed with an outline, polygons, ellipses, thick strokes), plus loading, slicing and previews."""
import math

import numpy as np
from PIL import Image


class Grid(dict):
    """(x, y) -> palette key. y grows downward; coordinates may be negative (parts are built around their own origin)."""

    @classmethod
    def from_rows(cls, rows, ox=0, oy=0):
        g = cls()
        for y, r in enumerate(rows):
            for x, ch in enumerate(r):
                if ch != '.': g[(x - ox, y - oy)] = ch
        return g

    def copy(self): return Grid(self)

    def bbox(self):
        xs = [x for x, _ in self]; ys = [y for _, y in self]
        return min(xs), min(ys), max(xs), max(ys)

    def shifted(self, dx, dy): return Grid({(x + dx, y + dy): c for (x, y), c in self.items()})

    def mirrored(self, axis2=0):
        """Mirror left-right about x = axis2 / 2 (axis2 = 2 * the axis, so half-pixel axes stay integers)."""
        return Grid({(axis2 - x, y): c for (x, y), c in self.items()})

    def where(self, test): return Grid({p: c for p, c in self.items() if test(*p, c)})

    def paste(self, other):
        self.update(other); return self

    def rows(self, x0=None, y0=None, x1=None, y1=None):
        bx0, by0, bx1, by1 = self.bbox()
        x0 = bx0 if x0 is None else x0; y0 = by0 if y0 is None else y0
        x1 = bx1 if x1 is None else x1; y1 = by1 if y1 is None else y1
        return [''.join(self.get((x, y), '.') for x in range(x0, x1 + 1)) for y in range(y0, y1 + 1)]

    def ring(self, key='O'):
        """Turn every pixel on the edge of the shape (a 4-neighbour is empty) into `key`."""
        edge = [p for p in self if any((p[0] + dx, p[1] + dy) not in self for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))]
        for p in edge: self[p] = key
        return self

    def outline(self, key='O'):
        """Add a 1px outline OUTSIDE the shape (4-neighbours)."""
        add = {(x + dx, y + dy) for (x, y) in self for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))} - set(self)
        for p in add: self[p] = key
        return self


# ---------- pixel sets ----------
def s_ell(cx, cy, rx, ry, n=2.0):
    out = set()
    for y in range(math.ceil(cy - ry), math.floor(cy + ry) + 1):
        dy = abs((y - cy) / ry); dx = rx * max(0.0, 1 - dy ** n) ** (1 / n)
        for x in range(math.ceil(cx - dx - .01), math.floor(cx + dx + .01) + 1): out.add((x, y))
    return out


def s_rect(x, y, w, h): return {(x + i, y + j) for j in range(h) for i in range(w)}


def s_poly(pts):
    """Scanline fill, sampling each row at its centre (y + .5) like the JS side."""
    out = set(); ys = [p[1] for p in pts]
    for y in range(math.floor(min(ys)), math.ceil(max(ys)) + 1):
        yc = y + .5; xs = []
        for i in range(len(pts)):
            (ax, ay), (bx, by) = pts[i], pts[(i + 1) % len(pts)]
            if (ay <= yc < by) or (by <= yc < ay): xs.append(ax + (yc - ay) / (by - ay) * (bx - ax))
        xs.sort()
        for i in range(0, len(xs) - 1, 2):
            for x in range(round(xs[i]), round(xs[i + 1])): out.add((x, y))
    return out


def s_capsule(a, b, r):
    """Every pixel centre within r of the segment a-b: a limb with round ends."""
    (ax, ay), (bx, by) = a, b; out = set()
    for y in range(math.floor(min(ay, by) - r) - 1, math.ceil(max(ay, by) + r) + 2):
        for x in range(math.floor(min(ax, bx) - r) - 1, math.ceil(max(ax, bx) + r) + 2):
            px, py = x + .5, y + .5; vx, vy = bx - ax, by - ay; L2 = vx * vx + vy * vy
            k = 0 if L2 == 0 else max(0, min(1, ((px - ax) * vx + (py - ay) * vy) / L2))
            if math.hypot(px - (ax + k * vx), py - (ay + k * vy)) <= r: out.add((x, y))
    return out


def fill(g, pts, key, ring=None):
    """Fill a pixel set into g, its own edge pixels in `ring` (a part ringed with its outline)."""
    for p in pts:
        edge = ring and any((p[0] + dx, p[1] + dy) not in pts for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        g[p] = ring if edge else key
    return g


# ---------- images ----------
def hexrgb(h): return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def load_keys(path, pal, keys=None):
    """A sprite PNG (transparent background) as a Grid of the nearest palette keys."""
    a = np.array(Image.open(path).convert('RGBA')); keys = keys or list(pal)
    rgb = {k: np.array(hexrgb(pal[k]), np.float32) for k in keys}; g = Grid()
    for y in range(a.shape[0]):
        for x in range(a.shape[1]):
            if a[y, x, 3] == 0: continue
            c = a[y, x, :3].astype(np.float32); g[(x, y)] = min(keys, key=lambda k: float(((rgb[k] - c) ** 2).sum()))
    return g


def to_image(g, pal, scale=1, box=None, bg=None):
    x0, y0, x1, y1 = box or g.bbox(); w, h = x1 - x0 + 1, y1 - y0 + 1
    img = Image.new('RGBA', (w, h), bg or (0, 0, 0, 0)); px = img.load()
    for (x, y), c in g.items():
        if x0 <= x <= x1 and y0 <= y <= y1: px[x - x0, y - y0] = hexrgb(pal[c]) + (255,)
    return img.resize((w * scale, h * scale), Image.NEAREST) if scale > 1 else img


def sheet(items, pal, scale=6, pad=4, bg=(0xE6, 0xE6, 0xEA, 255)):
    """Several grids side by side on one baseline (each item: (grid, box or None)), for looking at."""
    ims = [to_image(g, pal, scale, box) for g, box in items]
    W = sum(i.width for i in ims) + pad * scale * (len(ims) + 1); H = max(i.height for i in ims) + 2 * pad * scale
    out = Image.new('RGBA', (W, H), bg); x = pad * scale
    for im in ims: out.alpha_composite(im, (x, H - pad * scale - im.height)); x += im.width + pad * scale
    return out
