// heige_hello.js: "黑哥 says hello", a 7.8-second acting test for heige.js, as a standalone loop so the demo video is
// untouched:  studio.html?loop=heigeHello   or   node render.mjs --loop=heigeHello --clip --out=out/heige_hello.mp4
//   0.0–0.5  an iris opens on an empty, sunny study
//   0.2–2.3  黑哥 trots in from the left (side view)
//   2.3–2.5  he turns to the camera (drawn key views)
//   2.6      he notices us: a big surprised take
//   3.5      he thinks it over, hand on chin
//   4.6      he gets it: the bulb lights
//   5.4      he waves hello
//   6.6      he plants his hands on his hips, proud
//   7.2–7.8  the iris closes on him
(() => {
  const G = 860, U = 26;
  function room(t) {
    boilSeed('wall');
    paint(rectPts(-300, -300, W + 600, G + 320), { wash: '#F1E4CC', ink: null });
    paint(ellPts(1350, 330, 520, 330, 26, 8), { fill: '#FBEFD2', fillOp: 120, bleed: .3, tex: .6, ink: null });   // sunlight on the wall
    boilSeed('window');
    paint(rrPts(1180, 150, 360, 300, 18), { wash: '#DDE9F2', fill: PAL.sky, fillOp: 50, bleed: .1, ink: PAL.ink, sw: 1.1 });
    inkLine([[1360, 152], [1360, 448]], 1, PAL.ink, 'ink', 0); inkLine([[1182, 300], [1538, 300]], 1, PAL.ink, 'ink', 0);
    glow(1360, 300, 260, '#FFE6B0', .35 + .05 * Math.sin(t * 2));
    boilSeed('floor');
    paint(rectPts(-300, G - 40, W + 600, 460, 3), { wash: '#DCC3A0', fill: '#C9A97F', fillOp: 70, bleed: .05, tex: .6, ink: null });
    inkLine([[-200, G - 38], [W / 2, G - 44], [W + 200, G - 36]], 1, PAL.ink, 'ink', .5);
    boilSeed('rug');
    paint(ellPts(980, G + 60, 520, 70, 30, 3), { wash: '#E8B9A0', fill: PAL.rose, fillOp: 40, bleed: .1, ink: PAL.ink, sw: .8 });
  }

  LOOPS.heigeHello = t => {
    camBegin(kf(t, [[0, 900], [2.4, 960]]), kf(t, [[0, 600], [3, 560]]), kf(t, [[0, 1], [2.4, 1.04], [7.8, 1.12]]));
    room(t);
    const walk = stroll(t, .2, 2.3, 380, 960, U);
    const mood = emotions(t, [[0, 'happy'], [2.6, 'surprised', { lookX: 0 }], [3.5, 'thinking'], [4.6, 'idea'], [5.4, 'happy'], [6.6, 'proud']]);
    let pose = {};
    if (t < 2.3) pose = { view: 'side', walk: walk.walk, dy: walk.dy + (mood.dy || 0) * .3, noPose: true, aL: .3 * Math.sin(walk.walk * TAU), aR: -.3 * Math.sin(walk.walk * TAU) };
    else if (t < 2.5) pose = turn(t, 2.3, 2.48, .25, 0);
    if (t > 5.4 && t < 6.6) pose = { ...pose, aL: 1.25 + .35 * Math.sin((t - 5.4) * 13), bendL: .45 * (1 + Math.sin((t - 5.4) * 13)) / 2 };
    heige(walk.x, G, U, { ...mood, ...pose, dy: (pose.dy ?? (mood.dy || 0)), boilKey: 'heige' });
    const at = toScreen(walk.x, G - 7.5 * U);
    camEnd();
    if (t < .5) iris(...at, lerp(0, 1600, easeIn(t / .5)));
    if (t > 7.2) iris(...at, lerp(1600, 0, easeIn(seg(t, 7.2, 7.75))));
  };
  LOOPS.heigeHello.len = 7.8;
})();
