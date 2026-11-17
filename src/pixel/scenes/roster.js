// pixel/scenes/roster.js: 问问黑哥's 17-model Q-version AI 大模型全家福 in pixels: every model updated to its
// Q-version chibi sprite on 黑哥's grid (models/roster.js, DeepSeek from models/deepseek.js), while Claude stays
// Clawd (Anthropic's own pixel character). Four close shots at the size they act at, then all 17 on risers.
//   node render.mjs --page=pixel.html --loop=pxRoster --stills=1.4,3.4,5.4,7.4,9.4 --out=out/pixel/roster
(() => {
  const D = { marks: { a: 0, b: 2, c: 4, d: 6, all: 8 }, cues: [], len: 10 }, K = pxGame(D);
  const { shot, curtain, spot, hg, cl, feelT, chip, push, sparkle, GOLDL, CREAM } = K;
  const NAME = {
    claude: 'Claude', gpt: 'GPT', gemini: 'Gemini', grok: 'Grok', llama: 'Llama', mistral: 'Mistral', newbing: 'NewBing', updream: 'Updream',
    deepseek: 'DeepSeek', doubao: '豆包', qianwen: '千问', kimi: 'Kimi', hunyuan: '混元', zhipu: '智谱', minimax: 'MiniMax', mimo: 'MiMo', wenxin: '文心'
  };
  const one = (k, x, y, t, size = 7) => {
    if (k === 'hg') { hg(x, y, { ...feelT('happy', t), poseR: 'wave' }); chip('黑哥', x, y + 12, GOLDL, size); return; }
    if (k === 'claude') { cl(x, y, feelT('happy', t)); chip('Claude', x, y + 12, CREAM, size); return; }
    modelPx(k, Math.round(x), y, feelT('happy', t + x * .01)); chip(NAME[k], x, y + 12, CREAM, size);
  };
  const row = (t, keys, y = FLOOR) => { const n = keys.length, gap = (PW - 36) / n; keys.forEach((k, i) => { const x = Math.round(18 + gap * (i + .5)); spot(x, t, { w: gap * .9 }); one(k, x, y, t); }); };
  const cam = { in: { type: 'cut' }, cam: push(160, 92, 1.0, 1.0) };
  shot('a', (lt, t) => { curtain(t, 1); row(t, ['claude', 'gpt', 'gemini', 'grok']); }, cam);
  shot('b', (lt, t) => { curtain(t, 1); row(t, ['llama', 'mistral', 'newbing', 'updream']); }, cam);
  shot('c', (lt, t) => { curtain(t, 1); row(t, ['deepseek', 'doubao', 'qianwen', 'kimi', 'hunyuan']); }, cam);
  shot('d', (lt, t) => { curtain(t, 1); row(t, ['zhipu', 'minimax', 'mimo', 'wenxin']); }, cam);
  shot('all', (lt, t) => {
    curtain(t, 1);
    const back = ['claude', 'gpt', 'gemini', 'grok', 'llama', 'mistral', 'newbing', 'updream'];
    const front = ['deepseek', 'doubao', 'qianwen', 'kimi', 'hunyuan', 'zhipu', 'minimax', 'mimo', 'wenxin'];
    const yb = FLOOR - 128, R = prect; R(86, yb + 2, PW - 172, 6, '#4A2C1C'); R(86, yb + 2, PW - 172, 1, '#8A5A34'); R(86, yb + 8, PW - 172, 3, '#2E1C14');
    const xb = i => Math.round(108 + (PW - 216) * i / 7);
    const xf = i => Math.round(100 + (PW - 200) * i / 8);
    back.forEach((k, i) => one(k, xb(i), yb, t, 7));
    front.forEach((k, i) => one(k, xf(i), FLOOR, t, 7));
    sparkle(PW / 2, PH * .4, PW * .45, t, 24);
  }, { in: { type: 'cut' }, res: [640, 360], cam: (lt, t, d) => [320, 176, 1.0] });
  LOOPS.pxRoster = () => {};
  Object.assign(LOOPS.pxRoster, { len: D.len, film: K.film({ chapters: [['海外四位', 0], ['平台四位', 2], ['国产五位', 4], ['国产四位', 6], ['全家福', 8]] }) });
})();
