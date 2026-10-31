// pixel/scenes/wuxia_cast.js: the cast of 「小黑开武馆」 on the 像素游戏动画 stage, at the size they act at (320 × 180, 6× up):
// the three leads, the four townsfolk, then 小黑 and the DeepSeek disciple beside 黑哥 and the roster's DeepSeek for scale.
//   node render.mjs --page=pixel.html --loop=pxWuxiaCast --stills=1.4,3.4,5.4 --out=out/pixel/wuxia
(() => {
  const D = { marks: { leads: 0, town: 2, scale: 4 }, cues: [], len: 6 }, K = pxGame(D);
  const { shot, curtain, spot, hg, ds, feelT, chip, push, sparkle, GOLDL, SKY, CREAM, PINK } = K;
  const px = (k, x, t, o = {}) => modelPx(k, Math.round(x), FLOOR, { ...feelT(o.feel || 'happy', t), ...o });
  const row = (t, cast) => { for (const [k, x, name, col, o] of cast) { spot(x, t, { w: 56 }); px(k, x, t, o); chip(name, x, FLOOR + 14, col, 7); } };
  shot('leads', (lt, t) => {
    curtain(t, 1);
    row(t, [['xiaohei', 64, '小黑', GOLDL], ['dario', 160, '达里奥', CREAM], ['ds_menren', 256, 'DeepSeek 门人', SKY]]);
    sparkle(256, 70, 30, t, 6, SKY);
  }, { in: { type: 'cut' }, cam: push(160, 92, 1.0, 1.0) });
  shot('town', (lt, t) => {
    curtain(t, 1);
    row(t, [['fangdong', 50, '房东', CREAM], ['zhanggui', 120, '掌柜', CREAM], ['tudi', 195, '徒弟', GOLDL], ['shaobing', 270, '烧饼摊', PINK]]);
  }, { in: { type: 'cut' }, cam: push(160, 92, 1.0, 1.0) });
  shot('scale', (lt, t) => {
    curtain(t, 1); for (const x of [42, 108, 186, 272]) spot(x, t, { w: 52 });
    hg(42, FLOOR, { ...feelT('happy', t), poseR: 'wave' }); px('xiaohei', 108, t); ds(186, FLOOR, feelT('happy', t)); px('ds_menren', 272, t);
    chip('黑哥', 42, FLOOR + 14, GOLDL, 7); chip('小黑', 108, FLOOR + 14, GOLDL, 7); chip('DeepSeek', 186, FLOOR + 14, SKY, 7); chip('门人', 272, FLOOR + 14, SKY, 7);
  }, { in: { type: 'cut' }, cam: push(160, 92, 1.0, 1.0) });
  LOOPS.pxWuxiaCast = () => {};
  Object.assign(LOOPS.pxWuxiaCast, { len: D.len, film: K.film({ chapters: [['武馆主角', 0], ['街坊', 2], ['和黑哥同台', 4]] }) });
})();
