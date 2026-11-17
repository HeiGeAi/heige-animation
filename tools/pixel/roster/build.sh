#!/bin/zsh
# The roster in pixels: design/roster/<key>.png -> design/sprites/rs-<key>-final.png.
# Uses extract.py (zero-magenta backdrop masking, enclosed-pocket detection, foreground-only block medians),
# then dehalo + 1px #12142B outline, cropped tight.
# usage: tools/pixel/roster/build.sh <key> [colors] [merge]
set -e
cd "$(dirname $0)/../../.."
P=/opt/homebrew/bin/python3; k=$1; c=${2:-24}; m=${3:-22}
GRID_ARG=()
if [[ -f design/roster/grids.json ]]; then
  g=$($P -c "import json;d=json.load(open('design/roster/grids.json'));print(','.join(map(str,d['$k'])) if '$k' in d else '')")
  [[ -n $g ]] && GRID_ARG=(--grid "$g")
fi
$P tools/pixel/roster/extract.py design/roster/$k.png design/sprites/rs-$k.png --colors $c --merge $m "${GRID_ARG[@]}"
$P tools/pixel/dehalo.py design/sprites/rs-$k.png design/sprites/rs-$k-clean.png > /dev/null
$P tools/pixel/outline.py design/sprites/rs-$k-clean.png design/sprites/rs-$k-final.png --min-blob 5 > /dev/null
$P -c "
from PIL import Image
im=Image.open('design/sprites/rs-$k-final.png'); im=im.crop(im.getbbox()); im.save('design/sprites/rs-$k-final.png'); print('$k', im.size)"
