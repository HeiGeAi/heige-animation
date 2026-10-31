"""Post-fixes for the wuxia cast: drop the ground shadow the image model drew under the feet (the engine draws its own),
repaint 掌柜's teacup (3 px of blue-and-white turns to mud at block 10), redraw the 馆主's glasses (thin frames fade at
block 10, and the glasses are what make him 黑哥), then re-outline and crop to the figure."""
import subprocess, colorsys, sys
from PIL import Image
P = '/opt/homebrew/bin/python3'; S = 'design/sprites/wx-'
CUP = ["...OO...", "..OWWO..", ".OWWWWO.", ".OBBBBO.", ".OWWWSO.", "OSSSSSSO", ".OOOOOO."]
COL = {'O': (18, 20, 43, 255), 'W': (255, 255, 255, 255), 'B': (37, 99, 235, 255), 'S': (200, 208, 228, 255)}
for k in sys.argv[1:]:
    im = Image.open(f'{S}{k}-clean.png').convert('RGBA'); w, h = im.size; px = im.load(); n = 0
    for y in range(h - 5, h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if not a: continue
            hh, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if s < .26 and .42 <= v <= .9: px[x, y] = (0, 0, 0, 0); n += 1
    im.save(f'{S}{k}-ns.png')
    subprocess.run([P, 'tools/pixel/outline.py', f'{S}{k}-ns.png', f'{S}{k}-final.png'], check=True, capture_output=True)
    f = Image.open(f'{S}{k}-final.png').convert('RGBA')
    if k == 'zhanggui':
        fp = f.load()
        for j, row in enumerate(CUP):
            for i, c in enumerate(row):
                if c != '.': fp[12 + i, 55 + j] = COL[c]
    if k == 'heige_guanzhu':                                       # two rings and a bridge, over the faded frames
        fp = f.load(); ink = (21, 19, 26, 255)
        for cx in (20, 35.5):
            for y in range(34, 47):
                for x in range(int(cx) - 6, int(cx) + 7):
                    d = (((x + .5 - cx) / 4.6) ** 2 + ((y + .5 - 40.5) / 4.9) ** 2) ** .5
                    if .78 <= d <= 1.1: fp[x, y] = ink
        for x in range(25, 31): fp[x, 39] = ink
    f = f.crop(f.getbbox()); f.save(f'{S}{k}-final.png')
    f.resize((f.width * 8, f.height * 8), Image.NEAREST).save(f'{S}{k}-final_x8.png')
    print(k, 'shadow px', n, '->', f.size)
