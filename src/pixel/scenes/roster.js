// pixel/scenes/roster.js: 问问黑哥与 17 位大模型 Q 版全员（18 位同框）AI 大模型全家福 in pixels, fully rigged and acting.
// Every model uses the shared acting engine (emotions(), jump(), take(), feel(), blinking, iris gaze, tears,
// shades, and animated signature props) alongside 黑哥 across four close shots plus a lively 18-character finale.
//   node render.mjs --page=pixel.html --loop=pxRoster --stills=1.8,4.8,7.8,10.8,14.4 --out=out/pixel/roster
(() => {
  const D = { marks: { a: 0, b: 3, c: 6, d: 9, all: 12 }, cues: [], len: 16 }, K = pxGame(D);
  const { shot, curtain, spot, hg, cl, emo, feelT, chip, push, sparkle, GOLDL, CREAM } = K;
  const NAME = {
    heige: '黑哥',
    claude: 'Claude', gpt: 'GPT', gemini: 'Gemini', grok: 'Grok', llama: 'Llama', mistral: 'Mistral', newbing: 'NewBing', updream: 'Updream',
    deepseek: 'DeepSeek', doubao: '豆包', qianwen: '千问', kimi: 'Kimi', hunyuan: '混元', zhipu: '智谱', minimax: 'MiniMax', mimo: 'MiMo', wenxin: '文心'
  };

  // Distinct multi-beat acting script per character inside each 3s close shot (lt runs 0..3s)
  const ACT = {
    claude:   (lt, i) => { const h = jump(lt, 1.05, 1.55, 2.2), tk = take(lt, .82, .25); const o = emo(lt, [[0, 'sleepy'], [.85, 'surprised'], [1.7, 'happy', { poseL: 'wave', poseR: 'wave' }]], { seed: i }); o.dy += h.dy + tk.dy; o.sq += h.sq + tk.sq; o.rot = (o.rot || 0) + tk.rot; return o; },
    gpt:      (lt, i) => { const h = jump(lt, 1.65, 2.15, 2.0); const o = emo(lt, [[0, 'happy', { lookX: -1 }], [1.55, 'starstruck']], { seed: i }); o.dy += h.dy; o.sq += h.sq; return o; },
    gemini:   (lt, i) => { const h = jump(lt, 1.85, 2.35, 2.2); const o = emo(lt, [[0, 'playful', { lookX: 1 }], [1.7, 'excited']], { seed: i }); o.dy += h.dy; o.sq += h.sq; return o; },
    grok:     (lt, i) => { const tk = take(lt, 1.05, .28); const o = emo(lt, [[0, 'mischief', { lookX: -1 }], [1.1, 'cool'], [2.2, 'laugh']], { seed: i }); o.dy += tk.dy; o.sq += tk.sq; o.rot = (o.rot || 0) + tk.rot; return o; },

    llama:    (lt, i) => { const h = jump(lt, 1.15, 1.6, 1.5), tk = take(lt, .98, .26); const o = emo(lt, [[0, 'sleepy'], [1.0, 'surprised'], [1.8, 'shy']], { seed: i }); o.dy += h.dy + tk.dy; o.sq += h.sq + tk.sq; o.rot = (o.rot || 0) + tk.rot; return o; },
    mistral:  (lt, i) => { const h = jump(lt, 1.3, 1.85, 2.2); const o = emo(lt, [[0, 'determined', { lookX: 1 }], [1.2, 'excited'], [2.1, 'proud']], { seed: i }); o.dy += h.dy; o.sq += h.sq; return o; },
    newbing:  (lt, i) => emo(lt, [[0, 'happy', { lookX: -1 }], [1.35, 'idea', { lookY: -1 }]], { seed: i }),
    updream:  (lt, i) => { const h = jump(lt, 1.45, 2.05, 2.6); const o = emo(lt, [[0, 'hopeful', { lookX: -1 }], [1.35, 'love']], { seed: i }); o.dy += h.dy; o.sq += h.sq; return o; },

    deepseek: (lt, i) => { const h = jump(lt, 1.0, 1.55, 2.4); const o = emo(lt, [[0, 'happy', { lookX: 1 }], [1.5, 'love']], { seed: i }); o.dy += h.dy; o.sq += h.sq; return o; },
    doubao:   (lt, i) => { const h = jump(lt, 1.5, 2.05, 2.2); const o = emo(lt, [[0, 'playful', { lookX: -1 }], [1.35, 'excited']], { seed: i }); o.dy += h.dy; o.sq += h.sq; return o; },
    qianwen:  (lt, i) => emo(lt, [[0, 'thinking', { lookX: -1, lookY: -1 }], [1.45, 'idea']], { seed: i }),
    kimi:     (lt, i) => { const h = jump(lt, 1.6, 2.1, 1.8); const o = emo(lt, [[0, 'cry'], [1.45, 'happy']], { seed: i }); o.dy += h.dy; o.sq += h.sq; return o; },
    hunyuan:  (lt, i) => { const h = jump(lt, 1.4, 1.9, 2.0); const o = emo(lt, [[0, 'shy', { lookX: -1 }], [1.3, 'happy']], { seed: i }); o.dy += h.dy; o.sq += h.sq; return o; },

    zhipu:    (lt, i) => { const h = jump(lt, 1.1, 1.55, 1.8), tk = take(lt, .92, .25); const o = emo(lt, [[0, 'sleepy'], [.95, 'surprised'], [1.8, 'proud']], { seed: i }); o.dy += h.dy + tk.dy; o.sq += h.sq + tk.sq; o.rot = (o.rot || 0) + tk.rot; return o; },
    minimax:  (lt, i) => { const h = jump(lt, 1.55, 2.05, 2.1); const o = emo(lt, [[0, 'laugh'], [1.45, 'starstruck']], { seed: i }); o.dy += h.dy; o.sq += h.sq; return o; },
    mimo:     (lt, i) => { const h = jump(lt, 1.75, 2.25, 2.1), tk = take(lt, .98, .25); const o = emo(lt, [[0, 'excited'], [1.0, 'angry'], [1.7, 'happy']], { seed: i }); o.dy += h.dy + tk.dy; o.sq += h.sq + tk.sq; o.rot = (o.rot || 0) + tk.rot; return o; },
    wenxin:   (lt, i) => emo(lt, [[0, 'teary', { lookX: -1 }], [1.4, 'happy']], { seed: i }),
  };

  // Contrasting signature moods + staggered waves & hops for the 18-character (黑哥 + 17 AI models) grand finale
  const FINALE_MOOD = {
    heige: 'happy', claude: 'happy', gpt: 'happy', gemini: 'playful', grok: 'cool', llama: 'sleepy', mistral: 'excited', newbing: 'idea', updream: 'love',
    deepseek: 'excited', doubao: 'playful', qianwen: 'happy', kimi: 'happy', hunyuan: 'shy', zhipu: 'smug', minimax: 'laugh', mimo: 'starstruck', wenxin: 'hopeful',
  };

  const drawOne = (k, x, y, o, size = 7) => {
    if (k === 'heige') hg(Math.round(x), y, o);
    else if (k === 'claude') cl(x, y, o);
    else modelPx(k, Math.round(x), y, o);
    chip(NAME[k], x, y + 12, k === 'heige' ? GOLDL : CREAM, size);
  };

  const row = (lt, t, keys, seedBase = 0) => {
    const n = keys.length, gap = (PW - 36) / n;
    keys.forEach((k, i) => {
      const x = Math.round(18 + gap * (i + .5));
      spot(x, t, { w: gap * .9 });
      const o = ACT[k] ? ACT[k](lt, seedBase + i + 1) : feelT('happy', t, { seed: seedBase + i + 1 });
      drawOne(k, x, FLOOR, o, 7);
    });
  };

  const cam = { in: { type: 'cut' }, cam: push(160, 92, 1.0, 1.0) };
  shot('a', (lt, t) => { curtain(t, 1); row(lt, t, ['claude', 'gpt', 'gemini', 'grok'], 0); }, cam);
  shot('b', (lt, t) => { curtain(t, 1); row(lt, t, ['llama', 'mistral', 'newbing', 'updream'], 4); }, cam);
  shot('c', (lt, t) => { curtain(t, 1); row(lt, t, ['deepseek', 'doubao', 'qianwen', 'kimi', 'hunyuan'], 8); }, cam);
  shot('d', (lt, t) => { curtain(t, 1); row(lt, t, ['zhipu', 'minimax', 'mimo', 'wenxin'], 13); }, cam);
  shot('all', (lt, t) => {
    curtain(t, 1);
    const back = ['claude', 'gpt', 'gemini', 'grok', 'heige', 'llama', 'mistral', 'newbing', 'updream'];
    const front = ['deepseek', 'doubao', 'qianwen', 'kimi', 'hunyuan', 'zhipu', 'minimax', 'mimo', 'wenxin'];
    const yb = FLOOR - 128, R = prect;
    R(86, yb + 2, PW - 172, 6, '#4A2C1C'); R(86, yb + 2, PW - 172, 1, '#8A5A34'); R(86, yb + 8, PW - 172, 3, '#2E1C14');
    const xb = i => Math.round(100 + (PW - 200) * i / 8);
    const xf = i => Math.round(100 + (PW - 200) * i / 8);

    const castFinale = (k, i, x, y, rowOff) => {
      const idx = rowOff + i;
      const waveAt = .35 + i * .22;
      const waving = lt >= waveAt && lt <= waveAt + 1.6;
      const hopT0 = .8 + ((idx * .43) % 2.1);
      const h = jump(lt, hopT0, hopT0 + .46, 1.9);
      const baseMood = FINALE_MOOD[k] || 'happy';
      const o = k === 'zhipu'
        ? emo(lt, [[0, 'sleepy'], [1.4, 'surprised'], [2.3, 'proud']], { seed: idx + 1 })
        : k === 'heige'
          ? emo(lt, [[0, 'happy', { poseR: 'wave' }], [1.5, 'excited', { poseL: 'cheer', poseR: 'cheer' }], [2.5, 'happy', { poseR: 'wave' }]], { seed: 99 })
          : feelT(baseMood, t + idx * .13, { seed: idx + 1 });
      if (waving && k === 'claude') { o.poseL = 'wave'; o.poseR = 'wave'; }
      o.dy = (o.dy || 0) + h.dy; o.sq = (o.sq || 0) + h.sq;
      drawOne(k, x, y, o, 7);
    };

    back.forEach((k, i) => castFinale(k, i, xb(i), yb, 0));
    front.forEach((k, i) => castFinale(k, i, xf(i), FLOOR, 9));
    sparkle(PW / 2, PH * .4, PW * .45, t, 24);
  }, { in: { type: 'cut' }, res: [640, 360], cam: (lt, t, d) => [320, 176, 1.0] });

  LOOPS.pxRoster = () => {};
  Object.assign(LOOPS.pxRoster, { len: D.len, film: K.film({ chapters: [['海外四位', 0], ['平台四位', 3], ['国产五位', 6], ['国产四位', 9], ['全家福', 12]] }) });
})();
