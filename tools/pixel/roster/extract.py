#!/usr/bin/env python3
"""Extract a pixel sprite cleanly from a #E6E6EA concept image without magenta edge haloes.

Detects the outer backdrop by edge flood-fill plus small enclosed backdrop pockets surrounded by dark
outlines (e.g. ahoge loops, wheelchair/stand gaps), samples each grid cell from the foreground-only
median, drops tiny stray specks (<5 cells) while preserving intentional floating stars, and quantizes
greedy most-frequent-first.
"""
import argparse, json, os, sys
from collections import deque
import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pixelize import grid_period


def _find_bg_mask(im_rgb: np.ndarray) -> np.ndarray:
    H, W, _ = im_rgb.shape
    arr_f = im_rgb.astype(np.float32)
    bg_edge = np.median(
        np.array([im_rgb[0, 0], im_rgb[0, -1], im_rgb[-1, 0], im_rgb[-1, -1]]),
        axis=0,
    ).astype(np.float32)
    dist_edge = np.linalg.norm(arr_f - bg_edge, axis=2)
    is_bg_tone = (
        (arr_f.mean(axis=2) >= 214)
        & (arr_f.mean(axis=2) <= 240)
        & (np.abs(arr_f[..., 0] - arr_f[..., 1]) <= 6)
        & (arr_f[..., 2] - arr_f[..., 0] >= 0)
        & (arr_f[..., 2] - arr_f[..., 0] <= 10)
    )

    visited = np.zeros((H, W), dtype=bool)
    q = deque()
    for x in range(W):
        for y in (0, H - 1):
            if dist_edge[y, x] <= 20 and not visited[y, x]:
                visited[y, x] = True
                q.append((y, x))
    for y in range(H):
        for x in (0, W - 1):
            if dist_edge[y, x] <= 20 and not visited[y, x]:
                visited[y, x] = True
                q.append((y, x))
    while q:
        y, x = q.popleft()
        cur = arr_f[y, x]
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            yy, xx = y + dy, x + dx
            if 0 <= yy < H and 0 <= xx < W and not visited[yy, xx]:
                if dist_edge[yy, xx] <= 18 or (
                    is_bg_tone[yy, xx] and np.linalg.norm(arr_f[yy, xx] - cur) <= 8
                ):
                    visited[yy, xx] = True
                    q.append((yy, xx))

    bg_center = np.median(arr_f[visited], axis=0)
    dist_center = np.linalg.norm(arr_f - bg_center, axis=2)
    cand = ((dist_center <= 15) | is_bg_tone) & (~visited)
    comp_vis = np.zeros((H, W), dtype=bool)
    luma = arr_f.mean(axis=2)

    for sy0, sx0 in zip(*np.where(cand)):
        if comp_vis[sy0, sx0]:
            continue
        pts = [(sy0, sx0)]
        comp_vis[sy0, sx0] = True
        cq = deque([(sy0, sx0)])
        while cq:
            y, x = cq.popleft()
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                yy, xx = y + dy, x + dx
                if 0 <= yy < H and 0 <= xx < W and cand[yy, xx] and not comp_vis[yy, xx]:
                    comp_vis[yy, xx] = True
                    cq.append((yy, xx))
                    pts.append((yy, xx))
        if len(pts) < 12 or len(pts) > 12000:
            continue

        # Sample a 2..4px outer ring around this enclosed pocket to ignore 1px anti-aliasing
        ys = np.array([p[0] for p in pts])
        xs = np.array([p[1] for p in pts])
        y0, y1 = max(0, int(ys.min()) - 4), min(H, int(ys.max()) + 5)
        x0, x1 = max(0, int(xs.min()) - 4), min(W, int(xs.max()) + 5)
        sub_mask = np.zeros((y1 - y0, x1 - x0), dtype=bool)
        sub_mask[ys - y0, xs - x0] = True

        # Fast binary dilation via shifting
        d1 = sub_mask.copy()
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                if dy or dx:
                    s = np.roll(sub_mask, (dy, dx), axis=(0, 1))
                    if dy == 1: s[0, :] = False
                    elif dy == -1: s[-1, :] = False
                    if dx == 1: s[:, 0] = False
                    elif dx == -1: s[:, -1] = False
                    d1 |= s
        d4 = d1.copy()
        for _ in range(3):
            nx = d4.copy()
            nx[1:, :] |= d4[:-1, :]; nx[:-1, :] |= d4[1:, :]
            nx[:, 1:] |= d4[:, :-1]; nx[:, :-1] |= d4[:, 1:]
            d4 = nx
        ring = d4 & (~d1)
        if not ring.any():
            continue
        ring_luma = luma[y0:y1, x0:x1][ring]
        dark_frac = (ring_luma < 140).mean()
        bright_frac = (ring_luma > 205).mean()
        if dark_frac >= 0.45 and bright_frac < 0.35:
            visited[ys, xs] = True
    return visited


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src')
    ap.add_argument('out')
    ap.add_argument('--colors', type=int, default=24)
    ap.add_argument('--merge', type=float, default=22)
    ap.add_argument('--grid', default=None, help='Optional sx,ox,sy,oy override')
    ap.add_argument('--min-comp', type=int, default=5)
    o = ap.parse_args()

    im_rgb = np.array(Image.open(o.src).convert('RGB'))
    H, W, _ = im_rgb.shape
    if o.grid:
        sx, ox, sy, oy = [float(v) for v in o.grid.split(',')]
    else:
        (sx, ox), (sy, oy) = grid_period(im_rgb)

    bg_mask = _find_bg_mask(im_rgb)
    nx, ny = int((W - ox) // sx), int((H - oy) // sy)
    small = np.zeros((ny, nx, 3), np.uint8)
    fg = np.zeros((ny, nx), dtype=bool)
    for j in range(ny):
        for i in range(nx):
            x0, x1 = int(ox + i * sx), min(W, int(ox + (i + 1) * sx))
            y0, y1 = int(oy + j * sy), min(H, int(oy + (j + 1) * sy))
            bm_full = bg_mask[y0:y1, x0:x1]
            if not bm_full.size or (1.0 - bm_full.mean()) < 0.48:
                continue
            qx, qy = max(0, int(sx * 0.18)), max(0, int(sy * 0.18))
            sub = im_rgb[y0 + qy : max(y0 + qy + 1, y1 - qy), x0 + qx : max(x0 + qx + 1, x1 - qx)]
            sub_bm = bg_mask[y0 + qy : max(y0 + qy + 1, y1 - qy), x0 + qx : max(x0 + qx + 1, x1 - qx)]
            pxs = sub[~sub_bm]
            if not len(pxs):
                pxs = im_rgb[y0:y1, x0:x1][~bm_full]
            if not len(pxs):
                continue
            small[j, i] = np.median(pxs, axis=0)
            fg[j, i] = True

    lab = np.zeros(fg.shape, np.int32)
    cur = 0
    sizes = {}
    for sy0, sx0 in zip(*np.where(fg)):
        if lab[sy0, sx0]:
            continue
        cur += 1
        st = [(sy0, sx0)]
        lab[sy0, sx0] = cur
        n = 0
        while st:
            y, x = st.pop()
            n += 1
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    yy, xx = y + dy, x + dx
                    if 0 <= yy < ny and 0 <= xx < nx and fg[yy, xx] and not lab[yy, xx]:
                        lab[yy, xx] = cur
                        st.append((yy, xx))
        sizes[cur] = n
    if sizes:
        max_sz = max(sizes.values())
        keep = {c for c, sz in sizes.items() if sz == max_sz or sz >= o.min_comp}
        fg &= np.isin(lab, list(keep))

    px = small[fg].astype(np.float32)
    uniq, cnt = np.unique(px.astype(np.uint8), axis=0, return_counts=True)
    order = np.argsort(-cnt)
    cent = []
    for i in order:
        c = uniq[i].astype(np.float32)
        if not any(np.linalg.norm(c - m) < o.merge for m in cent):
            cent.append(c)
        if len(cent) >= o.colors:
            break
    pal = np.array(cent, dtype=np.float32)
    q = small.copy()
    fy, fx = np.where(fg)
    d = np.linalg.norm(small[fy, fx].astype(np.float32)[:, None, :] - pal[None, :, :], axis=2)
    q[fy, fx] = pal[np.argmin(d, axis=1)].astype(np.uint8)

    out = np.zeros((ny, nx, 4), np.uint8)
    out[..., :3] = q
    out[..., 3] = fg.astype(np.uint8) * 255
    img = Image.fromarray(out, 'RGBA')
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    img.save(o.out)


if __name__ == '__main__':
    main()
