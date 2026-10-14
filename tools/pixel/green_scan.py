"""Count green pixels in renders (the 问问黑哥 brand rule: no green anywhere). Pixel art is scanned at full size, never
resampled, since smoothing would invent in-between colours. A pixel is green when its hue is 90-150 degrees with real
saturation (> .25) and brightness (> .2).
usage: python3 green_scan.py image.png [video.mp4 ...]     (videos are sampled at 4 fps through ffmpeg)
exit code 1 if any green pixel is found."""
import os
import subprocess
import sys
import tempfile

import numpy as np
from PIL import Image


def green_count(path):
    a = np.asarray(Image.open(path).convert('RGB'), np.float32) / 255
    mx, mn = a.max(axis=2), a.min(axis=2); d = mx - mn
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    with np.errstate(invalid='ignore', divide='ignore'):
        h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
        s = np.where(mx > 0, d / mx, 0)
    hit = (d > 0) & (h >= 90) & (h <= 150) & (s > .25) & (mx > .2)
    return int(hit.sum()), a.shape[0] * a.shape[1]


def main():
    bad = 0
    for target in sys.argv[1:]:
        if target.lower().endswith(('.mp4', '.mov', '.webm')):
            with tempfile.TemporaryDirectory() as d:
                subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', target, '-vf', 'fps=4', os.path.join(d, 'f%04d.png')], check=True)
                res = [(green_count(os.path.join(d, f))[0], f) for f in sorted(os.listdir(d))]
                total = sum(n for n, _ in res); worst = max(res)
                print(f'{os.path.basename(target)}: {len(res)} frames sampled, green pixels {total} (worst {worst[1]}: {worst[0]})')
                bad += total
        else:
            n, tot = green_count(target)
            print(f'{os.path.basename(target)}: green pixels {n} / {tot}')
            bad += n
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
