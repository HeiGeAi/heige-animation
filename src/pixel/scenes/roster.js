// pixel/scenes/roster.js: 问问黑哥's AI 大模型全家福 in pixels: the locked roster (问问黑哥/IP/模型角色), every model as a
// Q 萌大头 sprite on 黑哥's grid (models/roster.js, DeepSeek from models/deepseek.js). Claude is Clawd, Anthropic's own
// character (Blake, 2026-11-01): the 立绘 robot dog is not drawn in pixels. Three close shots at the size they act at,
// then the whole family on risers in the poster's order (14 models, as on the 全家福 poster).
//   node render.mjs --page=pixel.html --loop=pxRoster --stills=1.4,3.4,5.4,7.4 --out=out/pixel/roster
(() => {
  const D = { marks: { a: 0, b: 2, c: 4, all: 6 }, cues: [], len: 8 }, K = pxGame(D);
  const { shot, curtain, spot, hg, cl, feelT, chip, push, sparkle, GOLDL, CREAM } = K;
  const NAME = { claude: 'Claude', gpt: 'GPT', gemini: 'Gemini', grok: 'Grok', muse: 'Muse', deepseek: 'DeepSeek', doubao: '豆包', qianwen: '千问',
    yuanbao: '元宝', kimi: 'Kimi', zhipu: '智谱', mimo: 'MiMo', minimax: 'MiniMax', wenxin: '文心' };
  const one = (k, x, y, t, size = 7) => {
    if (k === 'hg') { hg(x, y, { ...feelT('happy', t), poseR: 'wave' }); chip('黑哥', x, y + 12, GOLDL, size); return; }
    if (k === 'claude') { cl(x, y, feelT('happy', t)); chip('Claude', x, y + 12, CREAM, size); return; }
    modelPx(k, Math.round(x), y, feelT('happy', t + x * .01)); chip(NAME[k], x, y + 12, CREAM, size);
  };
  const row = (t, keys, y = FLOOR) => { const n = keys.length, gap = (PW - 40) / n; keys.forEach((k, i) => { const x = Math.round(20 + gap * (i + .5)); spot(x, t, { w: gap * .9 }); one(k, x, y, t); }); };
  const cam = { in: { type: 'cut' }, cam: push(160, 92, 1.0, 1.0) };
  shot('a', (lt, t) => { curtain(t, 1); row(t, ['claude', 'gpt', 'gemini', 'grok', 'muse']); }, cam);
  shot('b', (lt, t) => { curtain(t, 1); row(t, ['deepseek', 'doubao', 'qianwen', 'yuanbao', 'kimi']); }, cam);
  shot('c', (lt, t) => { curtain(t, 1); row(t, ['zhipu', 'mimo', 'minimax', 'wenxin']); }, cam);
  shot('all', (lt, t) => {
    curtain(t, 1);
    const back = ['claude', 'gpt', 'gemini', 'grok', 'muse', 'deepseek', 'doubao'], front = ['qianwen', 'yuanbao', 'kimi', 'zhipu', 'mimo', 'minimax', 'wenxin'];
    const yb = FLOOR - 124, R = prect; R(88, yb + 2, PW - 176, 6, '#4A2C1C'); R(88, yb + 2, PW - 176, 1, '#8A5A34'); R(88, yb + 8, PW - 176, 3, '#2E1C14');
    const xs = i => Math.round(112 + (PW - 224) * i / 6);              // inside the curtains
    back.forEach((k, i) => one(k, xs(i), yb, t, 8)); front.forEach((k, i) => one(k, xs(i), FLOOR, t, 8));
    sparkle(PW / 2, PH * .4, PW * .45, t, 24);
  }, { in: { type: 'cut' }, res: [640, 360], cam: (lt, t, d) => [320, 176, 1.0] });
  LOOPS.pxRoster = () => {};
  Object.assign(LOOPS.pxRoster, { len: D.len, film: K.film({ chapters: [['海外五位', 0], ['国产五位', 2], ['国产四位', 4], ['全家福', 6]] }) });
})();
