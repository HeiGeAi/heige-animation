#!/bin/zsh
# V071 「懂 AI 的女生」: the girlfriend's six poses (design/concepts/nv-gf-<pose>.png, gpt-image, poses edited from idle)
# -> pixel sprites -> src/pixel/scenes/nvyou_cast.js (SPRITES.nvGf_<pose>). Same steps as tools/pixel/wuxia/build.sh.
set -e
cd "$(dirname $0)/../../.."
P=/opt/homebrew/bin/python3; T=$(mktemp -d)
for k in idle angry cheer shy sleep point; do
  $P tools/pixel/pixelize.py design/concepts/nv-gf-$k.png design/sprites/nv-gf-$k --colors ${COLORS:-20} --block ${BLOCK:-10} --bgtol ${BGTOL:-10} > /dev/null
  $P tools/pixel/dehalo.py design/sprites/nv-gf-$k.png design/sprites/nv-gf-$k-clean.png --light .97 > /dev/null
  $P tools/pixel/nvyou/islands.py design/sprites/nv-gf-$k-clean.png design/sprites/nv-gf-$k-clean.png > /dev/null
  $P tools/pixel/outline.py design/sprites/nv-gf-$k-clean.png design/sprites/nv-gf-$k-final.png > /dev/null
  $P tools/pixel/sprite2js.py design/sprites/nv-gf-$k-final.png nvGf_$k $T/$k.js --passes 0 > /dev/null
  $P -c "from PIL import Image;im=Image.open('design/sprites/nv-gf-$k-final.png');print('$k',im.size)"
done
{ echo "// scenes/nvyou_cast.js: the girlfriend of V071 「懂 AI 的女生」, six poses on 黑哥's grid (tools/pixel/nvyou/build.sh)."
  echo "var SPRITES = window.SPRITES = window.SPRITES || {};"
  for k in idle angry cheer shy sleep point; do grep -v "^var SPRITES" $T/$k.js; done; } > src/pixel/scenes/nvyou_cast.js
rm -rf $T
