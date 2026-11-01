# heige-animation · 像素黑哥动画工程

问问黑哥（HeiGeAi）的像素角色动画工程，fork 自 [JohnHeibel/ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)。在原项目的 p5.js 水彩引擎旁边加了一套像素后端：像素黑哥（四个朝向、31 种情绪、手势、走路）、像素 Clawd、像素 DeepSeek，以及「像素游戏动画」套件（幕布舞台、聚光灯、金框游戏 UI、章节栏、关键词字幕），问问黑哥的像素视频都用它做。

![黑哥武馆角色设定表](docs/wuxia/cast-sheet.png)

问问黑哥的 AI 大模型全家福也都有像素版（Claude 由 Clawd 出演，另有 GPT、Gemini、Grok、Muse、DeepSeek、豆包、千问、元宝、Kimi、智谱、MiMo、MiniMax、文心），见 [src/pixel/models/roster.js](src/pixel/models/roster.js) 和 [docs/roster/](docs/roster/)：

![AI 大模型全家福](docs/roster/04-family.jpg)

另一批角色是视频「黑哥武馆」的九个武侠小人（小黑子、黑哥馆主、达里奥、大肥鱼、梁圣、房东老黄、掌柜山姆奥特曼、徒弟、摊主老马），见 [src/pixel/models/wuxia.js](src/pixel/models/wuxia.js) 和 [docs/wuxia/](docs/wuxia/)。

```bash
npm install
node render.mjs --page=pixel.html --loop=pxWuxiaCast --stills=1.4,3.4,5.4,7.4 --out=out/pixel/wuxia
```

**授权：** 代码沿用上游的 MIT（见 [LICENSE](LICENSE)）。角色形象另有约定，见 [CHARACTERS.md](CHARACTERS.md)。

The original English README follows.

---

# Claude Animation Base

This is a small starter kit with code, instructions and assets for animating a character in [p5.js](https://p5js.org) and [p5.brush](https://github.com/acamposuribe/p5.brush) with Claude Opus 5.5. It's based on the code from the music video [I'm Upping My P(doom)](https://github.com/JohnHeibel/PDoomVideo) and an analysis of what the model did and didn't do well. I highly recommend playing around with your prompting: make it give you the storyboard before coding, give it very broad instructions, try being very specific, ask for subagents, and try a bunch of other fun ways of testing the model's capabilities. In my testing, it can do a lot with very little, but it's also quite accurate when you give it more requirements. Also try asking the model to swap out the character or make new emotions or costumes, give it your own reference images, and try many other fun things like that. I've found that the reasoning level corresponds to how "extravagant" and detail-oriented the model makes the scene. All test videos were generated with Opus 5.5 on xhigh reasoning in Claude Code.

![Clawd's emotions, animated](docs/emotions.webp)

## Make a video

Clone it, open it in Claude Code (or any coding agent) and ask for what you want:

> Read ANIMATION_GUIDE.md, then make a 15-second video of Clawd trying to catch a butterfly.

The model storyboards first, builds shot by shot, renders contact sheets to check its own work, and writes `out/video.mp4`. [ANIMATION_GUIDE.md](ANIMATION_GUIDE.md) holds the rules it follows: handmade, alive, one piece, no text, transitions always, something happens in every scene, and a solid medium of brush strokes, flat 2D and boiling linework. It also covers timing for the viewer and the core principles of character animation.

## Run it yourself

You need Node.js, Google Chrome and ffmpeg.

Without a dedicated GPU, p5.brush's watercolour fills make render times fairly slow, measured in seconds per frame. If you're running on integrated graphics, I recommend asking the model to avoid those fills and replace them with something else appropriate. (I love the look of the watercolours, though.)

```bash
npm install
node render.mjs --clip --out=out/video.mp4
```

That renders the 11-second demo in [src/scenes/demo.js](src/scenes/demo.js). Open [studio.html](studio.html) in Chrome to scrub through it. Add `?loop=emotions` or `?loop=views` to see the model sheets. If Chrome isn't in a standard location, pass `--chrome=<path>` or set `CHROME_PATH`.

On Linux, `render.mjs` starts Chrome with `--no-sandbox` (Ubuntu 23.10+ blocks Chrome's sandbox in headless use) and also finds a Chromium installed by Playwright. With no GPU at all, add `--soft-gl` to render WebGL in software: slow on watercolour fills, but it works. On a headless Linux machine with an NVIDIA GPU (a cloud or cluster node), add `--gpu-angle=gl-egl` (or `vulkan`); `node gpu_probe.mjs <chrome path>` shows which renderer each set of flags gets.

## Pixel back end

The same emotions, moves and turns also drive pixel-art characters: `pixel.html` draws into a small canvas and blows it up with hard edges, every pixel the same size. It comes with 黑哥 (four views, 31 emotions with drawn gestures, walk cycles) and pixel Clawd. See the Pixel back end section of the guide.

```bash
node render.mjs --page=pixel.html --loop=pxActing --clip --fps=24 --out=out/pixel/acting.mp4
```

## What's here

| path | what it is |
|---|---|
| [ANIMATION_GUIDE.md](ANIMATION_GUIDE.md) | The rules, the workflow and the full API. Read it first. |
| [src/clawd.js](src/clawd.js) | Clawd: views, emotions, eyes, mouths, hats, emotes, dances |
| [src/motion.js](src/motion.js) | Tempo, easing, timing and motion helpers, shared by both back ends |
| [src/core.js](src/core.js) | The painted engine: boil, painting, camera, light, paper |
| [src/timeline.js](src/timeline.js) | Shots, loops and the brush-wipe transition |
| [src/config.js](src/config.js) | Length and tempo |
| [src/scenes/](src/scenes/) | Your video goes here (the demo is an example) |
| [render.mjs](render.mjs) | Headless renderer: contact sheets, frame strips, crops, stills, MP4 |
| [pixel.html](pixel.html), [src/pixel/](src/pixel/) | The pixel back end: the same acting code drawn as pixel art, with 黑哥 and pixel Clawd |
| [tools/pixel/](tools/pixel/), [art/heige/](art/heige/) | Turning concept art into sprites and building 黑哥's parts; green_scan.py |
| [docs/](docs/) | Model sheets: [emotions](docs/emotions.jpg) (also [animated](docs/emotions.webp)) and [views, motion and hats](docs/views.jpg) |
