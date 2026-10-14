// heige_sheets.js: 黑哥's model sheets, as standalone loops. Reference for you (and the model), not part of a video,
// so labels are fine here. Scrub them at studio.html?loop=heigeLook, ?loop=heigeViews or ?loop=heigeEmotions, or render:
//   node render.mjs --loop=heigeEmotions --sheet=1 --cols=1 --w=1920 --out=docs/heige-emotions.jpg
(() => {
  const label = (txt, x, y, size = 20) => letter(txt, x, y, size, PAL.ink, { ink: false, alpha: .8 });
  const floor = (y, x0 = 0, x1 = W) => inkLine([[x0 + 40, y + 6], [(x0 + x1) / 2, y + 4], [x1 - 40, y + 7]], .6, mixCol(PAL.paper, PAL.ink, .35), 'inkfine', .5);

  // The face, big, for checking it against the avatar (ref/heige-avatar.jpg): crop x 420..1500 of the frame.
  LOOPS.heigeFace = t => { heige(960, 1180, 84, { ...feel('neutral', t, { seed: 2 }), boilKey: 'face' }); };
  LOOPS.heigeFace.len = 4;

  // The look: one big 黑哥 and six faces, for judging the design before anything else gets built on it.
  LOOPS.heigeLook = t => {
    heige(430, 1015, 54, { ...feel('neutral', t, { seed: 1 }), boilKey: 'hero' });
    floor(1010, 60, 820);
    const faces = ['happy', 'laugh', 'surprised', 'sad', 'angry', 'thinking'];
    faces.forEach((name, i) => {
      const x = 1010 + (i % 3) * 300, gy = 485 + Math.floor(i / 3) * 500;
      heige(x, gy, 19, { ...feel(name, t, { seed: i }), boilKey: 'face' + i });
      label(name, x, gy + 34, 22);
    });
    floor(485, 830, W); floor(985, 830, W);
  };
  LOOPS.heigeLook.len = 4;

  // Four directions to choose from, one per quarter: the same 黑哥 in four styles (see HG_STYLES in heige.js).
  //   A avatar: his avatar, painted.   B storybook: fine sepia ink and watercolour.
  //   C youth: 1:2 head-to-body.       D sticker: round and short, bold flat colour.
  LOOPS.heigeChoice = t => {
    const cards = [['A', 'avatar'], ['B', 'storybook'], ['C', 'youth'], ['D', 'sticker']];
    cards.forEach(([tag, style], i) => {
      const x0 = (i % 2) * W / 2, y0 = Math.floor(i / 2) * H / 2, S = HG_STYLES[style];
      const tall = 5.3 * S.bodyK + 8.0 * S.headK, uMain = 430 / tall, uSmall = 215 / tall;
      heige(x0 + 235, y0 + 500, uMain, { ...feel('neutral', t, { seed: i }), style, boilKey: 'main' + tag });
      ['happy', 'surprised', 'angry'].forEach((name, j) => heige(x0 + 560 + j * 140, y0 + 500, uSmall, { ...feel(name, t, { seed: i * 3 + j }), style, boilKey: tag + name }));
      letter(tag, x0 + 48, y0 + 52, 54, PAL.ink, { ink: false, alpha: .85 });
      inkLine([[x0 + 60, y0 + 505], [x0 + W / 2 - 60, y0 + 507]], .6, mixCol(PAL.paper, PAL.ink, .35), 'inkfine', .5);
    });
    inkLine([[W / 2, 30], [W / 2, H - 30]], .8, mixCol(PAL.paper, PAL.ink, .45), 'inkfine', .2);
    inkLine([[30, H / 2], [W - 30, H / 2]], .8, mixCol(PAL.paper, PAL.ink, .45), 'inkfine', .2);
  };
  LOOPS.heigeChoice.len = 4;

  // Views and motion.
  LOOPS.heigeViews = t => {
    const views = ['front', 'q', 'side', 'qback', 'back'];
    views.forEach((v, i) => { const x = 230 + i * 365; heige(x, 470, 24, { ...feel('neutral', t, { seed: i }), view: v }); label(v, x, 510, 24); });
    floor(470);
    const y2 = 995, u2 = 19, row = [
      ['walk (side)', x => heige(x, y2, u2, { ...move('walk', t), view: 'side' })],
      ['turn / spinView', x => heige(x, y2, u2, { ...feel('happy', t), ...spinView(Math.floor(t * 2) / 8) })],
      ['jump', x => { const k = t % 1.5; heige(x, y2, u2, { ...feel('happy', t), ...jump(k, .35, .95, 3) }); }],
      ['take', x => heige(x, y2, u2, { ...feel('surprised', t), ...take(t % 2, .5, 1.2), emoteAge: (t % 2) - .5, emoteK: seg(t % 2, .5, .7) })],
      ['cheer', x => heige(x, y2, u2, { ...feel('excited', t) })],
      ['cap pop', x => heige(x, y2, u2, { ...feel('furious', t), capPop: .5 + .5 * Math.abs(Math.sin(t * TAU * .75)) })],
    ];
    row.forEach(([name, f], i) => { const x = 180 + i * 312; f(x); label(name, x, y2 + 36); });
    floor(y2);
  };
  LOOPS.heigeViews.len = 4;

  // Every emotion in EMO, alive.
  LOOPS.heigeEmotions = t => {
    const names = Object.keys(EMO), cols = 8, cw = W / cols, ch = H / 4;
    names.forEach((name, i) => {
      const cx = cw * (i % cols) + cw / 2, gy = ch * Math.floor(i / cols) + ch - 40;
      heige(cx, gy, 13, feel(name, t, { seed: i }));
      label(name, cx, gy + 24, 17);
    });
    for (let r = 0; r < 4; r++) floor(ch * r + ch - 40);
  };
  LOOPS.heigeEmotions.len = 4;
})();
