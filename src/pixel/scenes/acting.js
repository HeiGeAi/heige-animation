// pixel/scenes/acting.js: an acting test on the night hill. 黑哥 walks in side on, stops and turns to us, jumps at
// the sight of us, waves, thinks, gets an idea, leaps for joy and laughs, and puts on his shades; pixel Clawd hops in
// for the last beat. Both are driven by the same acting code as the painted kit (emotions(), jump(), turn()).
//   node render.mjs --page=pixel.html --loop=pxActing --clip --fps=24 --out=out/pixel/acting.mp4
(() => {
  const N = window.pxNight;
  const X0 = -34, XS = 138, WALK = [0.1, 2.75], TURN = [2.75, 3.0];
  const KEYS = [[0, 'neutral'], [3.15, 'surprised'], [3.7, 'happy', { poseR: 'wave' }], [5.05, 'thinking'], [6.15, 'idea'],
                [7.15, 'excited'], [8.15, 'laugh'], [8.95, 'cool']];
  const CKEYS = [[0, 'excited'], [8.15, 'happy'], [8.95, 'cool']];

  LOOPS.pxActing = t => {
    const tt = onTwos(t);
    N.sky(tt); N.hills(tt); N.fireflies(tt);

    // ---- pixel Clawd: hops in from the right for the finale ----
    if (tt > 7.55) {
      const k = seg(tt, 7.55, 8.75), cx = Math.round(lerp(350, 222, 1 - (1 - k) ** 2));
      const hop = tt < 8.75 ? Math.abs(Math.sin(Math.PI * (tt - 7.55) / .4)) * 2.6 : 0;
      clawdPx(cx, N.hillTop(cx), { ...emotions(tt, CKEYS), dy: -hop, flip: true, seed: 3 });
    }

    // ---- 黑哥 ----
    const p = seg(tt, ...WALK), x = Math.round(lerp(X0, XS, 1 - (1 - p) ** 2)), walking = tt < WALK[1];
    const o = { ...emotions(tt, KEYS, { take: .9 }) };
    if (walking) Object.assign(o, { view: 'side', walk: (x - X0) / 28, aL: .15, aR: .15, dy: 0, sq: 0 });
    else if (tt < TURN[1] + .05) Object.assign(o, turn(tt, ...TURN, .25, 0));
    // a hop on the idea, a big leap for joy
    const j1 = jump(tt, 6.32, 6.68, 1.3), j2 = jump(tt, 7.42, 8.02, 3.6);
    o.dy = (o.dy || 0) + j1.dy + j2.dy; o.sq = (o.sq || 0) + j1.sq + j2.sq;
    heigePx(x, N.hillTop(x), o);
  };
  Object.assign(LOOPS.pxActing, { len: 10, res: [320, 180], px: 6 });   // a wider shot: 320 × 180 at 6×
  LOOPS.default = LOOPS.pxActing;
})();
