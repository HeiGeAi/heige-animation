#!/usr/bin/env python3
"""
Build zero-green, privacy-safe, URL-free real-world evidence images for V075 (pxTainai):
- Crops left chat-history sidebars from real V060 Chrome screenshots (R3 DeepSeek, R5 Doubao, R5 Kimi).
- Crops genuine live browser screenshots captured from original news/papers via capture_real_sources.mjs:
  * sciencenet: https://news.sciencenet.cn/htmlnews/2026/4/563878.shtm
  * court: https://www.shobserver.com/staticsg/res/html/web/newsDetail.html?id=1150827&sid=11
  * anthropic: https://arxiv.org/abs/2310.13548
  * hbr: https://hbr.org/2007/09/performing-a-project-premortem
  * deepmind: https://arxiv.org/abs/2310.01798
- Enforces strict 0-green-pixel guarantee on every image and writes:
  1) /Users/blakexu/Documents/项目管理/问问黑哥/视频/075-80岁太奶AI邪修/04-素材/真实证据图/*.jpg
  2) /Users/blakexu/Documents/项目管理/开源项目/heige-animation/src/pixel/scenes/tainai_img.js
"""
import base64
import io
import json
import os
import subprocess
import numpy as np
from PIL import Image

ROOT = "/Users/blakexu/Documents/项目管理/开源项目/heige-animation"
V060_SHOTS = "/Users/blakexu/Documents/项目管理/问问黑哥/视频/060-AI一本正经瞎编/04-素材/实测/截图"
RAW_SHOTS_DIR = os.path.join(ROOT, "out/video/tainai/raw_shots")
OUT_ASSET_DIR = "/Users/blakexu/Documents/项目管理/问问黑哥/视频/075-80岁太奶AI邪修/04-素材/真实证据图"
OUT_JS = os.path.join(ROOT, "src/pixel/scenes/tainai_img.js")
CAPTURE_JS = os.path.join(ROOT, "tools/video/tainai/capture_real_sources.mjs")


def strip_green(img: Image.Image) -> Image.Image:
    """Eliminate any pixel in green/yellow-green hue zone (58..175 deg) so green_scan is strictly 0."""
    arr = np.asarray(img.convert("RGB"), dtype=np.float32)
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    d = mx - mn
    with np.errstate(invalid="ignore", divide="ignore"):
        h = np.where(
            d == 0,
            0.0,
            np.where(
                mx == r,
                ((g - b) / d) % 6,
                np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4),
            )
            * 60.0,
        )
        s = np.where(mx > 0, d / mx, 0.0)
    mask = (d > 6) & (mx > 25) & (h >= 52) & (h <= 185) & (s > 0.10)
    if np.any(mask):
        lum = r * 0.30 + g * 0.55 + b * 0.15
        arr[..., 0] = np.where(mask, np.minimum(255, lum * 1.04), r)
        arr[..., 1] = np.where(mask, lum * 0.90, g)
        arr[..., 2] = np.where(mask, lum * 0.98, b)
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


def crop_real_shots():
    out = {}
    # 1. R3-DeepSeek-Q11.jpg (1920x1080 range): crop out left sidebar (x < 385) and bottom input box
    im = Image.open(os.path.join(V060_SHOTS, "R3-DeepSeek-Q11.jpg")).convert("RGB")
    w, h = im.size
    ds = im.crop((int(w * 0.215), int(h * 0.055), int(w * 0.965), int(h * 0.785)))
    ds = ds.resize((960, int(960 * ds.height / ds.width)), Image.Resampling.LANCZOS)
    out["ds_r3"] = strip_green(ds)

    # 2. R5-豆包-Q12.jpg: crop out left sidebar (x < 22.5%) and bottom input bar
    im2 = Image.open(os.path.join(V060_SHOTS, "R5-豆包-Q12.jpg")).convert("RGB")
    w2, h2 = im2.size
    db = im2.crop((int(w2 * 0.225), int(h2 * 0.065), int(w2 * 0.975), int(h2 * 0.775)))
    dw, dh = db.size
    db = db.resize((960, int(960 * dh / dw)), Image.Resampling.LANCZOS)
    out["doubao_r5"] = strip_green(db)

    # 3. R5-Kimi-Q12.jpg: crop out left sidebar and bottom input bar
    im3 = Image.open(os.path.join(V060_SHOTS, "R5-Kimi-Q12.jpg")).convert("RGB")
    w3, h3 = im3.size
    km = im3.crop((int(w3 * 0.205), int(h3 * 0.065), int(w3 * 0.965), int(h3 * 0.805)))
    km = km.resize((960, int(960 * km.height / km.width)), Image.Resampling.LANCZOS)
    out["kimi_r5"] = strip_green(km)
    return out


# Exact crisp crop rectangles inside 2x Retina browser captures (URL-free, ad-free, high legibility)
RAW_SPECS = {
    "sciencenet": ("sciencenet_raw.png", (76, 64, 2042, 1765)),
    "court": ("court_shobs_960.png", (12, 95, 1818, 1695)),
    "anthropic": ("anthropic_raw.png", (0, 0, 1520, 1170)),
    "hbr": ("hbr_raw.png", (20, 572, 2180, 1935)),
    "deepmind": ("deepmind_raw.png", (0, 0, 1520, 1106)),
}


def crop_live_web_shots():
    missing = [
        k for k, (fname, _) in RAW_SPECS.items()
        if not os.path.exists(os.path.join(RAW_SHOTS_DIR, fname))
    ]
    if missing:
        subprocess.run(["node", CAPTURE_JS, f"--only={','.join(missing)}"], check=True)
    out = {}
    for key, (fname, box) in RAW_SPECS.items():
        im = Image.open(os.path.join(RAW_SHOTS_DIR, fname)).convert("RGB")
        x0, y0, x1, y1 = box
        crop = im.crop((x0, y0, min(im.width, x1), min(im.height, y1)))
        crop = crop.resize((960, int(960 * crop.height / crop.width)), Image.Resampling.LANCZOS)
        out[key] = strip_green(crop)
    return out


def _green_hits(img: Image.Image, h_lo=90, h_hi=150, s_min=0.25, mx_min=0.2):
    a = np.asarray(img.convert("RGB"), np.float32) / 255.0
    mx, mn = a.max(axis=2), a.min(axis=2)
    d = mx - mn
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    with np.errstate(invalid="ignore", divide="ignore"):
        h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
        s = np.where(mx > 0, d / mx, 0)
    return (d > 0) & (h >= h_lo) & (h <= h_hi) & (s > s_min) & (mx > mx_min)


def verify_zero_green(img: Image.Image, name: str):
    hit = int(_green_hits(img).sum())
    assert hit == 0, f"{name} still has {hit} green pixels!"


def encode_zero_green_jpeg(im: Image.Image, quality: int) -> bytes:
    """Encode JPEG with subsampling=0 and dampen any sub-pixel DCT ringing near green hue."""
    cur = im.convert("RGB")
    for _ in range(8):
        buf = io.BytesIO()
        cur.save(buf, format="JPEG", quality=quality, subsampling=0)
        raw = buf.getvalue()
        dec = Image.open(io.BytesIO(raw))
        bad = _green_hits(dec, h_lo=89, h_hi=151, s_min=0.24, mx_min=0.19)
        if not np.any(bad):
            verify_zero_green(dec, f"jpeg-q{quality}")
            return raw
        arr = np.asarray(cur, dtype=np.float32).copy()
        ys, xs = np.where(bad)
        for y, x in zip(ys, xs):
            arr[y, x, 0] += 12.0
            arr[y, x, 2] += 10.0
            arr[y, x, 1] -= 8.0
        cur = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")
    raise AssertionError(f"Failed to stabilize zero-green JPEG at q={quality}")


def main():
    os.makedirs(OUT_ASSET_DIR, exist_ok=True)
    imgs = {}
    imgs.update(crop_real_shots())
    imgs.update(crop_live_web_shots())

    data_uris = {}
    for k, im in imgs.items():
        verify_zero_green(im, k)
        out_file = os.path.join(OUT_ASSET_DIR, f"{k}.jpg")
        with open(out_file, "wb") as f:
            f.write(encode_zero_green_jpeg(im, 92))
        verify_zero_green(Image.open(out_file), f"{k}.jpg")
        jpg90 = encode_zero_green_jpeg(im, 90)
        verify_zero_green(Image.open(io.BytesIO(jpg90)), f"{k}-q90")
        b64 = base64.b64encode(jpg90).decode("ascii")
        data_uris[k] = f"data:image/jpeg;base64,{b64}"
        print(f"Built {k}: {im.size[0]}x{im.size[1]} | 0 green pixels | {len(b64)//1024} KB")

    with open(OUT_JS, "w", encoding="utf-8") as f:
        f.write("// tainai_img.js: V075 real-world source screenshots & publication plates (0 green, privacy-cropped, inline data URIs)\n")
        f.write("var TAINAI_IMG = window.TAINAI_IMG = ")
        json.dump(data_uris, f, ensure_ascii=False)
        f.write(";\n")
    print(f"Wrote {OUT_JS} ({os.path.getsize(OUT_JS)//1024} KB)")


if __name__ == "__main__":
    main()
