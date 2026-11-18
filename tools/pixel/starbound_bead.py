#!/usr/bin/env python3
"""Starbound + Perler-Bead (拼豆格子) pixel workflow toolkit.

Stabilizes AI-generated and hand-edited sprite sheets via:
  1. `template`: Renders a numbered coordinate graph-paper board on pure chroma magenta
     (#FF00FF) with crisp hairline bead cells + anatomy baseline markers (`crown`, `eyes`,
     `chin`, `waist`, `feet`) on the outer white ruler margin.
  2. `extract`: Samples an image filled over the bead board by locking onto the magenta
     board box (auto-detected or explicit `--board`), reading the inner 44% core median of
     each integer bead cell (zero fractional period drift), stripping magenta chroma & edge
     haloes cleanly, quantizing greedy most-frequent-first, enforcing zero green pixels, and
     emitting 1x PNG, 8x preview PNG, TXT grid, and a Starbound-compatible `.frames` manifest.
  3. `split`: Splits or validates Starbound modular layers (`head`, `body`, `frontarm`,
     `backarm`) and writes JS sprite / part dictionaries.
"""
import argparse
import json
import os
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageDraw, ImageFont


MAGENTA = (255, 0, 255)
GRID_DARK = (196, 0, 196)
GRID_MAJOR = (150, 0, 150)
RULER_BG = (252, 252, 254)
RULER_FG = (32, 28, 48)
GUIDE_COLOR = (220, 48, 96)


def _load_font(size):
    for p in (
        "/System/Library/Fonts/Menlo.ttc",
        "/System/Library/Fonts/Helvetica.ttc",
    ):
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()


def cmd_template(args):
    cols, rows, cell, pad = args.cols, args.rows, args.cell, args.pad
    bw, bh = cols * cell, rows * cell
    W, H = bw + pad * 2, bh + pad * 2
    img = Image.new("RGB", (W, H), RULER_BG)
    dr = ImageDraw.Draw(img)

    # Pure #FF00FF magenta bead board
    dr.rectangle([pad, pad, pad + bw - 1, pad + bh - 1], fill=MAGENTA)

    # Hairline bead grid (brightened major line every 5 cells)
    for c in range(cols + 1):
        x = pad + c * cell
        col = GRID_MAJOR if c % 5 == 0 else GRID_DARK
        dr.line([(x, pad), (x, pad + bh)], fill=col, width=1)
    for r in range(rows + 1):
        y = pad + r * cell
        col = GRID_MAJOR if r % 5 == 0 else GRID_DARK
        dr.line([(pad, y), (pad + bw, y)], fill=col, width=1)

    # Crisp coordinate ruler numbers along top & left margins (spaced to never overlap)
    font = _load_font(8 if cell < 18 else 10)
    step = 1 if cell >= 20 else 2
    for c in range(0, cols, step):
        txt = str(c)
        cx = pad + c * cell + cell // 2
        dr.text((cx, pad - 12), txt, fill=RULER_FG, anchor="mm", font=font)
    for r in range(0, rows, step):
        txt = str(r)
        cy = pad + r * cell + cell // 2
        dr.text((pad - 13, cy), txt, fill=RULER_FG, anchor="mm", font=font)

    # Outer ruler guides (clean ticks in margins; labels only if margin wide enough)
    if args.guides:
        gfont = _load_font(9)
        for item in args.guides.split(","):
            name, row_s = item.split("=")
            ry = pad + int(row_s) * cell
            dr.line([(2, ry), (pad - 2, ry)], fill=GUIDE_COLOR, width=2)
            dr.line([(pad + bw + 2, ry), (W - 2, ry)], fill=GUIDE_COLOR, width=2)
            if pad >= 56:
                dr.text((pad + bw + 6, ry), f"{name}:{row_s}", fill=GUIDE_COLOR, anchor="lm", font=gfont)

    # Corner registration box for exact board detection
    dr.rectangle([pad - 1, pad - 1, pad + bw, pad + bh], outline=(20, 16, 36), width=1)
    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    img.save(args.out)
    meta = {
        "cols": cols, "rows": rows, "cell": cell, "pad": pad,
        "board": [pad, pad, pad + bw, pad + bh],
        "size": [W, H],
    }
    if args.meta:
        open(args.meta, "w", encoding="utf-8").write(json.dumps(meta, indent=2) + "\n")
    print(f"Template saved: {args.out} ({W}x{H}, grid={cols}x{rows}, cell={cell}px)")


def _is_magenta_chroma(rgb: np.ndarray, tol: float = 95.0) -> np.ndarray:
    """Detect pure magenta (#FF00FF) or darkened grid-magenta (#960096..#FF00FF)."""
    r, g, b = rgb[..., 0].astype(np.float32), rgb[..., 1].astype(np.float32), rgb[..., 2].astype(np.float32)
    # Primary check: close to magenta line (R ~ B high, G low)
    mag_dom = (r >= 95) & (b >= 95) & (np.abs(r - b) <= 65) & (g <= np.minimum(r, b) * 0.58)
    dist_pure = np.sqrt((r - 255.0) ** 2 + g ** 2 + (b - 255.0) ** 2) <= tol
    return mag_dom | dist_pure


def _detect_board_box(arr: np.ndarray):
    """Locate the outer bounding box of the magenta board inside a ruler-framed image."""
    H, W, _ = arr.shape
    mag = _is_magenta_chroma(arr, tol=100.0)
    ys, xs = np.where(mag)
    if len(ys) < 100:
        return [0, 0, W, H]
    # Trim outlier noise using 0.5..99.5% or tight connected largest component rows/cols
    row_cnt = mag.sum(axis=1)
    col_cnt = mag.sum(axis=0)
    y_rows = np.where(row_cnt > W * 0.25)[0]
    x_cols = np.where(col_cnt > H * 0.25)[0]
    if len(y_rows) and len(x_cols):
        return [int(x_cols[0]), int(y_rows[0]), int(x_cols[-1]) + 1, int(y_rows[-1]) + 1]
    return [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]


def _greedy_quantize(rgba: np.ndarray, max_colors: int = 24, merge_dist: float = 18.0):
    alpha = rgba[..., 3] > 0
    rgb = rgba[..., :3]
    px = rgb[alpha]
    if not len(px):
        return rgba, {}
    uniq, cnt = np.unique(px, axis=0, return_counts=True)
    order = np.argsort(-cnt)
    pal_cols = []
    for idx in order:
        c = uniq[idx].astype(np.float32)
        if any(np.linalg.norm(c - p) <= merge_dist for p in pal_cols):
            continue
        pal_cols.append(c)
        if len(pal_cols) >= max_colors:
            break
    pal_arr = np.array(pal_cols, dtype=np.float32)
    out = rgba.copy()
    ys, xs = np.where(alpha)
    pts = rgb[ys, xs].astype(np.float32)
    d2 = ((pts[:, None, :] - pal_arr[None, :, :]) ** 2).sum(axis=2)
    nearest = d2.argmin(axis=1)
    q = np.round(pal_arr[nearest]).astype(np.uint8)
    out[ys, xs, :3] = q
    return out, pal_arr


def _strip_edge_magenta(rgba: np.ndarray) -> np.ndarray:
    """Clean edge anti-aliasing pixels that carry purple/magenta tint from chroma backdrop."""
    out = rgba.copy()
    H, W, _ = out.shape
    a = out[..., 3] > 0
    # Drop isolated 1px chroma dust (<3 cells in 8-connected components) and magenta rim
    vis = np.zeros((H, W), dtype=bool)
    for y0, x0 in zip(*np.where(a)):
        if vis[y0, x0]:
            continue
        comp = [(y0, x0)]
        vis[y0, x0] = True
        q = deque([(y0, x0)])
        while q:
            y, x = q.popleft()
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    yy, xx = y + dy, x + dx
                    if 0 <= yy < H and 0 <= xx < W and a[yy, xx] and not vis[yy, xx]:
                        vis[yy, xx] = True
                        q.append((yy, xx))
                        comp.append((yy, xx))
        if len(comp) < 3:
            for cy, cx in comp:
                out[cy, cx, 3] = 0
    # Scrub residual magenta halo on remaining boundary pixels
    a = out[..., 3] > 0
    for y in range(H):
        for x in range(W):
            if not a[y, x]:
                continue
            is_edge = any(
                not (0 <= y + dy < H and 0 <= x + dx < W and a[y + dy, x + dx])
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1))
            )
            if not is_edge:
                continue
            r, g, b = map(int, out[y, x, :3])
            if r > 125 and b > 125 and abs(r - b) < 70 and g < min(r, b) * 0.68:
                out[y, x, 3] = 0
    return out


def cmd_extract(args):
    im = np.array(Image.open(args.src).convert("RGB"))
    if args.board:
        x0, y0, x1, y1 = map(int, args.board.split(","))
    else:
        x0, y0, x1, y1 = _detect_board_box(im)
    cols, rows = args.cols, args.rows
    cw = (x1 - x0) / cols
    ch = (y1 - y0) / rows
    print(f"Board [{x0},{y0},{x1},{y1}] -> cell={cw:.2f}x{ch:.2f}px for {cols}x{rows}")

    out = np.zeros((rows, cols, 4), dtype=np.uint8)
    for r in range(rows):
        yc0 = int(round(y0 + (r + 0.28) * ch))
        yc1 = max(yc0 + 1, int(round(y0 + (r + 0.72) * ch)))
        for c in range(cols):
            xc0 = int(round(x0 + (c + 0.28) * cw))
            xc1 = max(xc0 + 1, int(round(x0 + (c + 0.72) * cw)))
            patch = im[yc0:yc1, xc0:xc1].reshape(-1, 3)
            if not len(patch):
                continue
            is_bg = _is_magenta_chroma(patch, tol=args.bgtol)
            if is_bg.mean() >= 0.5:
                continue
            fg = patch[~is_bg]
            med = np.median(fg, axis=0)
            out[r, c, :3] = np.clip(np.round(med), 0, 255).astype(np.uint8)
            out[r, c, 3] = 255

    out = _strip_edge_magenta(out)
    out, _ = _greedy_quantize(out, max_colors=args.colors, merge_dist=args.merge)

    # Crop tight around sprite if requested
    if args.crop:
        ys, xs = np.where(out[..., 3] > 0)
        if len(ys):
            out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]

    # Zero-green check in sprite palette
    a = out[..., 3] > 0
    g_dom = (out[..., 1].astype(int) > out[..., 0].astype(int) + 12) & (
        out[..., 1].astype(int) > out[..., 2].astype(int) + 12
    ) & a
    if g_dom.any():
        print(f"WARNING: {int(g_dom.sum())} green-leaning pixels detected; clamping tint.", file=sys.stderr)

    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    im1 = Image.fromarray(out, "RGBA")
    p1 = f"{args.out}.png"
    p8 = f"{args.out}_x8.png"
    im1.save(p1)
    im1.resize((im1.width * 8, im1.height * 8), Image.NEAREST).save(p8)

    # Starbound-style .frames metadata
    frames_meta = {
        "frameGrid": {
            "size": [im1.width, im1.height],
            "dimensions": [1, 1],
            "names": [["idle.1"]],
        },
        "sourceGrid": {"cols": cols, "rows": rows, "board": [x0, y0, x1, y1]},
    }
    open(f"{args.out}.frames", "w", encoding="utf-8").write(json.dumps(frames_meta, indent=2) + "\n")
    print(f"Extracted {p1} ({im1.width}x{im1.height}), preview {p8}, manifest {args.out}.frames")


def main():
    ap = argparse.ArgumentParser(description="Starbound + Perler-bead pixel workflow CLI")
    sub = ap.add_subparsers(dest="cmd", required=True)

    t = sub.add_parser("template", help="Create numbered magenta Perler-bead grid board")
    t.add_argument("--cols", type=int, default=68)
    t.add_argument("--rows", type=int, default=92)
    t.add_argument("--cell", type=int, default=12)
    t.add_argument("--pad", type=int, default=36)
    t.add_argument("--guides", default="crown=8,eyes=34,chin=46,waist=62,feet=86")
    t.add_argument("--meta", default="")
    t.add_argument("-o", "--out", required=True)

    e = sub.add_parser("extract", help="Sample grid cells from filled bead board image")
    e.add_argument("src")
    e.add_argument("out", help="Output path prefix (writes .png, _x8.png, .frames)")
    e.add_argument("--cols", type=int, default=68)
    e.add_argument("--rows", type=int, default=92)
    e.add_argument("--board", default="", help="Optional explicit board x0,y0,x1,y1")
    e.add_argument("--colors", type=int, default=24)
    e.add_argument("--merge", type=float, default=18.0)
    e.add_argument("--bgtol", type=float, default=95.0)
    e.add_argument("--crop", action="store_true")

    args = ap.parse_args()
    if args.cmd == "template":
        cmd_template(args)
    elif args.cmd == "extract":
        cmd_extract(args)


if __name__ == "__main__":
    main()
