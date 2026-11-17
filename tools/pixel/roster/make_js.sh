#!/bin/zsh
# Build all 16 non-Claude Q-version roster sprites (build.sh) and write src/pixel/models/deepseek.js + roster.js.
set -e
cd "$(dirname $0)/../../.."
P=/opt/homebrew/bin/python3; T=$(mktemp -d)
typeset -A N=(deepseek dsChibi gpt rsGpt gemini rsGemini grok rsGrok llama rsLlama mistral rsMistral newbing rsNewbing updream rsUpdream qianwen rsQianwen doubao rsDoubao kimi rsKimi hunyuan rsHunyuan zhipu rsZhipu minimax rsMinimax mimo rsMimo wenxin rsWenxin)

# 1) DeepSeek (dsChibi) lives in src/pixel/models/deepseek.js so every scene using deepseek stays aligned
tools/pixel/roster/build.sh deepseek ${COLORS:-24}
$P tools/pixel/sprite2js.py design/sprites/rs-deepseek-final.png dsChibi src/pixel/models/deepseek.js --passes 0 > /dev/null

# 2) Other 15 roster models live in src/pixel/models/roster.js (Claude stays Clawd via clawdPx)
for k in gpt gemini grok llama mistral newbing updream qianwen doubao kimi hunyuan zhipu minimax mimo wenxin; do
  tools/pixel/roster/build.sh $k ${COLORS:-24}
  $P tools/pixel/sprite2js.py design/sprites/rs-$k-final.png ${N[$k]} $T/$k.js --passes 0 > /dev/null
done
{ cat <<'H'
// pixel/models/roster.js: 问问黑哥's 17-model Q-version locked roster (问问黑哥/IP/模型角色) as pixel sprites on 黑哥's grid,
// beside DeepSeek (models/deepseek.js). Claude is played by Clawd (clawdPx). Cut by tools/pixel/roster/build.sh.
// Cast with modelPx('gpt', x, FLOOR, o); the line-up is pxRoster.
var SPRITES = window.SPRITES = window.SPRITES || {};
H
for k in gpt gemini grok llama mistral newbing updream qianwen doubao kimi hunyuan zhipu minimax mimo wenxin; do grep -v "^var SPRITES" $T/$k.js; done; } > src/pixel/models/roster.js
rm -rf $T; echo "deepseek.js + roster.js: 1 + $(grep -c "^SPRITES\[" src/pixel/models/roster.js) sprites"
