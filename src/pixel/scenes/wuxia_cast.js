// pixel/scenes/wuxia_cast.js: the cast of 「黑哥武馆」 (V066) on the 像素游戏动画 stage, at the size they act at (320 × 180,
// 6× up): the hero before and after (小黑子, then 黑哥 the school's master), the two gates, the townsfolk, then the new
// faces beside 黑哥 himself and the roster's DeepSeek for scale.
//   node render.mjs --page=pixel.html --loop=pxWuxiaCast --stills=1.4,3.4,5.4,7.4 --out=out/pixel/wuxia
(() => {
  const D = { marks: { hero: 0, gates: 2, town: 4, scale: 6 }, cues: [], len: 8 }, K = pxGame(D);
  const { shot, curtain, spot, hg, ds, feelT, chip, push, sparkle, GOLDL, SKY, CREAM, PINK } = K;
  const px = (k, x, t, o = {}) => modelPx(k, Math.round(x), FLOOR, { ...feelT(o.feel || 'happy', t), ...o });
  const row = (t, cast) => { for (const [k, x, name, col, o] of cast) { spot(x, t, { w: 56 }); if (k === 'hg') hg(x, FLOOR, { ...feelT('happy', t), poseR: 'wave' }); else if (k === 'ds') ds(x, FLOOR, feelT('happy', t)); else px(k, x, t, o); chip(name, x, FLOOR + 14, col, 7); } };
  const cam = { in: { type: 'cut' }, cam: push(160, 92, 1.0, 1.0) };
  shot('hero', (lt, t) => { curtain(t, 1); row(t, [['xiaoheizi', 100, '小黑子', GOLDL], ['heige_guanzhu', 220, '黑哥 · 馆主', GOLDL]]); sparkle(220, 70, 34, t, 8); }, cam);
  shot('gates', (lt, t) => { curtain(t, 1); row(t, [['dario', 100, '达里奥', CREAM], ['ds_menren', 220, '大肥鱼', SKY]]); sparkle(220, 70, 30, t, 6, SKY); }, cam);
  shot('town', (lt, t) => { curtain(t, 1); row(t, [['laohuang', 46, '房东老黄', CREAM], ['sam', 118, '掌柜山姆', CREAM], ['tudi', 190, '徒弟', GOLDL], ['laoma', 268, 'Grok 烧饼 · 老马', PINK]]); }, cam);
  shot('scale', (lt, t) => { curtain(t, 1); row(t, [['hg', 42, '黑哥', GOLDL], ['xiaoheizi', 108, '小黑子', GOLDL], ['heige_guanzhu', 180, '馆主', GOLDL], ['ds', 262, 'DeepSeek', SKY]]); }, cam);
  LOOPS.pxWuxiaCast = () => {};
  Object.assign(LOOPS.pxWuxiaCast, { len: D.len, film: K.film({ chapters: [['主角前后', 0], ['两座山门', 2], ['街坊', 4], ['和黑哥同台', 6]] }) });
})();
