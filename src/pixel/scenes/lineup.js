// pixel/scenes/lineup.js: 黑哥, DeepSeek, and Clawd acting together on the 像素游戏动画 stage (320 × 180, 6× up).
// DeepSeek strolls in, greets with a wave, reacts in a synchronized surprise take, thinks, catches an idea bulb,
// leaps for joy, laughs with hearts, and grooves in cool shades beside 黑哥 and Clawd.
//   node render.mjs --page=pixel.html --loop=pxModelLineup --clip --fps=24 --out=out/pixel/lineup.mp4
(() => {
  const D = { marks: { a: 0 }, cues: [], len: 8 }, K = pxGame(D);
  const { shot, curtain, spot, hg, cl, ds, emo, chip, push, sparkle, GOLDL, SKY, CREAM } = K;

  const HG_KEYS = [[0, 'happy', { poseR: 'wave', lookX: 1 }], [1.5, 'surprised', { lookX: 1 }], [2.5, 'thinking', { poseR: 'chin', lookY: -1 }], [3.8, 'idea', { poseR: 'point' }],
                   [4.2, 'excited', { poseR: 'cheer', poseL: 'cheer' }], [5.2, 'laugh', { lookX: 1 }], [6.4, 'cool'], [7.4, 'happy', { poseR: 'wave' }]];
  const DS_KEYS = [[1.05, 'happy', { lookX: -1 }], [1.55, 'surprised'], [2.58, 'thinking', { lookX: 1, lookY: -1 }], [3.85, 'idea'],
                   [4.2, 'excited'], [5.2, 'love'], [6.4, 'cool'], [7.4, 'happy']];
  const CL_KEYS = [[0, 'happy', { lookX: -1 }], [1.52, 'surprised', { lookX: -1 }], [2.55, 'thinking', { lookY: -1 }], [3.82, 'idea'],
                   [4.2, 'excited'], [5.2, 'laugh', { lookX: -1 }], [6.4, 'cool'], [7.4, 'happy']];

  shot(null, (lt, t) => {
    curtain(t, 1);
    for (const x of [72, 160, 248]) spot(x, t, { w: 60 });

    const walk = lt < 1.12 ? stroll(lt, 0, 1.05, 198, 160, 4) : { x: 160 };
    const tkHg = take(lt, 1.50, .34), tkDs = take(lt, 1.56, .34), tkCl = take(lt, 1.53, .34);
    const hop = jump(lt, 4.15, 4.75, 2.8);
    const hopCl = jump(lt, 4.22, 4.82, 2.5);

    const hgO = emo(lt, HG_KEYS, { seed: 1 });
    hgO.dy = (hgO.dy || 0) + hop.dy + tkHg.dy; hgO.sq = (hgO.sq || 0) + hop.sq + tkHg.sq; hgO.rot = (hgO.rot || 0) + tkHg.rot;
    hg(72, FLOOR, hgO);

    const dsO = lt < 1.05
      ? { ...emo(lt, [[0, 'happy']], { seed: 2 }), walk: walk.walk, dy: walk.dy, flip: true }
      : emo(lt, DS_KEYS, { seed: 2 });
    if (lt >= 1.05) {
      dsO.dy = (dsO.dy || 0) + hop.dy + tkDs.dy; dsO.sq = (dsO.sq || 0) + hop.sq + tkDs.sq;
      dsO.rot = (dsO.rot || 0) + tkDs.rot + (lt >= 6.4 && lt < 7.4 ? Math.sin(onTwos(lt) * 6) * .04 : 0);
    }
    ds(walk.x, FLOOR, dsO);

    const clO = emo(lt, CL_KEYS, { seed: 3 });
    clO.dy = (clO.dy || 0) + hopCl.dy + tkCl.dy; clO.sq = (clO.sq || 0) + hopCl.sq + tkCl.sq; clO.rot = (clO.rot || 0) + tkCl.rot;
    cl(248, FLOOR, clO);

    if (lt > 4.0) sparkle(160, 72, 34, t, 8, SKY);
    chip('黑哥', 72, FLOOR + 14, GOLDL, 7);
    chip('DeepSeek', 160, FLOOR + 14, SKY, 7);
    chip('Clawd', 248, FLOOR + 14, CREAM, 7);
  }, { in: { type: 'cut' }, cam: push(160, 92, 1.0, 1.0) });

  LOOPS.pxModelLineup = () => {};
  Object.assign(LOOPS.pxModelLineup, { len: D.len, film: K.film({ chapters: [['像素角色同台演戏', 0]] }) });
})();
