#!/bin/zsh
# The roster in pixels: design/roster/<key>.png (a Codex concept drawn after the locked 立绘, in the pixel DeepSeek's
# style, with chunky pixels: the figure is about 95 cells tall, 黑哥's scale) -> design/sprites/rs-<key>-final.png. The
# concept's own grid is found (--block auto) and sampled as drawn, with no resampling first, so faces stay crisp.
# The backdrop is found by flood fill from the edges and painted magenta, so white or silver hair inside the figure is
# never cut away as background.
# usage: tools/pixel/roster/build.sh <key> [colors] [bgtol]
set -e
cd "$(dirname $0)/../../.."
P=/opt/homebrew/bin/python3; k=$1; c=${2:-20}; t=${3:-26}
$P -c "
from PIL import Image
from PIL import ImageDraw
im=Image.open('design/roster/$k.png').convert('RGBA'); bg=Image.new('RGBA',im.size,(230,230,234,255)); bg.alpha_composite(im)
bg=bg.convert('RGB'); W,H=bg.size
for xy in [(0,0),(W-1,0),(0,H-1),(W-1,H-1),(W//2,0),(0,H//2),(W-1,H//2),(W//2,H-1)]: ImageDraw.floodfill(bg,xy,(255,0,255),thresh=40)
bg.save('design/sprites/rs-$k-src.png')"
$P tools/pixel/pixelize.py design/sprites/rs-$k-src.png design/sprites/rs-$k --colors $c --block ${BLOCK:-auto} --bg '#FF00FF' --bgtol $t > /dev/null
$P -c "
import colorsys
from PIL import Image
im=Image.open('design/sprites/rs-$k.png').convert('RGBA'); w,h=im.size; px=im.load(); n=1
while n:                                                    # magenta left on the rim by the backdrop: hue 280-318 next to empty
    n=0
    for y in range(h):
        for x in range(w):
            r,g,b,a=px[x,y]
            if not a: continue
            hh,ss,vv=colorsys.rgb_to_hsv(r/255,g/255,b/255)
            if not (280<=hh*360<=318 and ss>.25): continue
            if any(not (0<=x+dx<w and 0<=y+dy<h) or not px[x+dx,y+dy][3] for dx,dy in ((1,0),(-1,0),(0,1),(0,-1))): px[x,y]=(0,0,0,0); n+=1
im.save('design/sprites/rs-$k.png')"
$P tools/pixel/dehalo.py design/sprites/rs-$k.png design/sprites/rs-$k-clean.png > /dev/null
$P tools/pixel/outline.py design/sprites/rs-$k-clean.png design/sprites/rs-$k-final.png > /dev/null
$P -c "
from PIL import Image
im=Image.open('design/sprites/rs-$k-final.png'); im=im.crop(im.getbbox()); im.save('design/sprites/rs-$k-final.png'); print('$k', im.size)"
