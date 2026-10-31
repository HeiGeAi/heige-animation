#!/bin/zsh
# Build every roster sprite (build.sh) and write src/pixel/models/roster.js.
set -e
cd "$(dirname $0)/../../.."
P=/opt/homebrew/bin/python3; T=$(mktemp -d)
typeset -A N=(gpt rsGpt gemini rsGemini grok rsGrok muse rsMuse doubao rsDoubao qianwen rsQianwen yuanbao rsYuanbao kimi rsKimi zhipu rsZhipu mimo rsMimo minimax rsMinimax wenxin rsWenxin)
for k in gpt gemini grok muse doubao qianwen yuanbao kimi zhipu mimo minimax wenxin; do
  tools/pixel/roster/build.sh $k ${COLORS:-22}
  $P tools/pixel/sprite2js.py design/sprites/rs-$k-final.png ${N[$k]} $T/$k.js --passes 0 > /dev/null
done
{ cat <<'H'
// pixel/models/roster.js: the rest of 问问黑哥's locked model roster (问问黑哥/IP/模型角色) as Q 萌大头 sprites on 黑哥's grid,
// beside the pixel DeepSeek (models/deepseek.js). Concepts drawn by Codex after each locked 立绘 in the pixel DeepSeek's
// style (design/roster, not in git), cut by tools/pixel/roster/build.sh. The Claude robot dog stays out: Clawd plays Claude.
// Cast with modelPx('gpt', x, FLOOR, o); the line-up is pxRoster.
var SPRITES = window.SPRITES = window.SPRITES || {};
H
for k in gpt gemini grok muse doubao qianwen yuanbao kimi zhipu mimo minimax wenxin; do grep -v "^var SPRITES" $T/$k.js; done; } > src/pixel/models/roster.js
rm -rf $T; echo "roster.js: $(grep -c "^SPRITES\[" src/pixel/models/roster.js) sprites"
