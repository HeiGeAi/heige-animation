// pixel/scenes/lineup.js: the cast side by side on the 像素游戏动画 stage, for judging a new character beside 黑哥 and
// Clawd at the size they act at (320 × 180, 6× up). Model characters from 问问黑哥's locked roster come in as sprites
// (src/pixel/models/); until they get a rig they bob on two frames.
//   node render.mjs --page=pixel.html --loop=pxModelLineup --stills=1.2 --out=out/pixel/lineup
(() => {
  const D = { marks: {}, cues: [], len: 4 }, K = pxGame(D);
  const { shot, curtain, spot, hg, cl, ds, feelT, chip, push, sparkle, GOLDL, SKY, CREAM } = K;
  shot(null, (lt, t) => {
    curtain(t, 1); for (const x of [72, 160, 248]) spot(x, t, { w: 60 });
    hg(72, FLOOR, { ...feelT('happy', t), poseR: 'wave' });
    ds(160, FLOOR, { ...feelT('happy', t), emote: lt > 2 ? 'heart' : null, emoteAge: lt - 2 }); sparkle(160, 70, 30, t, 6, SKY);
    cl(248, FLOOR, feelT('happy', t));
    chip('黑哥', 72, FLOOR + 14, GOLDL, 7); chip('DeepSeek', 160, FLOOR + 14, SKY, 7); chip('Clawd', 248, FLOOR + 14, CREAM, 7);
  }, { in: { type: 'cut' }, cam: push(160, 92, 1.0, 1.0) });
  LOOPS.pxModelLineup = () => {};
  Object.assign(LOOPS.pxModelLineup, { len: D.len, film: K.film({ chapters: [['像素角色同台', 0]] }) });
})();
