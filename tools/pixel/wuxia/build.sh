#!/bin/zsh
# usage: build.sh <key> [block] [colors]   concept design/concepts/wx-<key>.png -> design/sprites/wx-<key>-final.png
set -e
cd .
P=/opt/homebrew/bin/python3; k=$1; b=${2:-10}; c=${3:-20}
# 老马's white apron sits close to the backdrop grey: a tighter background cut, and dehalo only on near-white specks
if [[ $k == laoma ]]; then T=(--bgtol 10); L=(--light .97); else T=(); L=(); fi
$P tools/pixel/pixelize.py design/concepts/wx-$k.png design/sprites/wx-$k --colors $c --block $b $T
$P tools/pixel/dehalo.py design/sprites/wx-$k.png design/sprites/wx-$k-clean.png $L
$P tools/pixel/outline.py design/sprites/wx-$k-clean.png design/sprites/wx-$k-final.png
$P -c "from PIL import Image;im=Image.open('design/sprites/wx-$k-final.png');print('$k',im.size);im.resize((im.width*8,im.height*8),Image.NEAREST).save('design/sprites/wx-$k-final_x8.png')"
