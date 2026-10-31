"""Post-fixes for the wuxia cast: drop the ground shadow the image model drew under the feet (the engine draws its own),
repaint 掌柜's teacup (3 px of blue-and-white turns to mud at block 10), then re-outline and crop to the figure."""
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
    f = f.crop(f.getbbox()); f.save(f'{S}{k}-final.png')
    f.resize((f.width * 8, f.height * 8), Image.NEAREST).save(f'{S}{k}-final_x8.png')
    print(k, 'shadow px', n, '->', f.size)
