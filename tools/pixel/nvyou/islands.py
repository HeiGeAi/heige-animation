"""Drop small islands (stray background specks left around the hair) from a cut sprite: keep 8-connected opaque
components of at least MIN pixels.  usage: islands.py in.png out.png [min=24]"""
import sys
from collections import deque
from PIL import Image
src, out = sys.argv[1], sys.argv[2]; MIN = int(sys.argv[3]) if len(sys.argv) > 3 else 24
im = Image.open(src).convert('RGBA'); W, H = im.size; px = im.load()
seen = [[False] * W for _ in range(H)]; drop = 0
for y in range(H):
    for x in range(W):
        if seen[y][x] or px[x, y][3] == 0: continue
        comp, q = [], deque([(x, y)]); seen[y][x] = True
        while q:
            cx, cy = q.popleft(); comp.append((cx, cy))
            for dx in (-1, 0, 1):
                for dy in (-1, 0, 1):
                    nx, ny = cx + dx, cy + dy
                    if 0 <= nx < W and 0 <= ny < H and not seen[ny][nx] and px[nx, ny][3]: seen[ny][nx] = True; q.append((nx, ny))
        if len(comp) < MIN:
            for cx, cy in comp: px[cx, cy] = (0, 0, 0, 0)
            drop += len(comp)
im.save(out); print('dropped', drop)
# second pass: lone light specks on the silhouette edge (a light, greyish pixel touching transparency with at most one light
# neighbour) take the colour of their darkest neighbour; pillow and sneaker edges have many light neighbours and stay.
im = Image.open(out).convert('RGBA'); px = im.load(); fix = []
light = lambda c: c[3] and (c[0] + c[1] + c[2]) / 3 > 120 and max(c[:3]) - min(c[:3]) < 60
for y in range(H):
    for x in range(W):
        c = px[x, y]
        if not light(c): continue
        nb = [px[x + dx, y + dy] if 0 <= x + dx < W and 0 <= y + dy < H else (0, 0, 0, 0) for dx in (-1, 0, 1) for dy in (-1, 0, 1) if dx or dy]
        if not any(n[3] == 0 for n in nb) or sum(1 for n in nb if light(n)) > 1: continue
        ops = [n for n in nb if n[3]]
        fix.append((x, y, min(ops, key=lambda n: sum(n[:3])) if ops else (0, 0, 0, 0)))
for x, y, c in fix: px[x, y] = c
im.save(out); print('specks', len(fix))
