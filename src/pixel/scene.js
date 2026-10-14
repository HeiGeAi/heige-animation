// pixel/scene.js: a night hill in pixel art, and the comparison stills: Clawd and 黑哥 on the same hill, same framing.
// The hill, sky and fireflies are shared as window.pxNight (scenes/acting.js uses them on a bigger canvas).
//   node render.mjs --page=pixel.html --loop=pxClawd --stills=1 --out=out/compare
// The palette keeps to night blues and violets with amber lights: no green anywhere.
(() => {
  const SKY = [[0, '#141530'], [26, '#1C1D43'], [52, '#272758'], [78, '#36306B'], [96, '#4A3B7A'], [112, '#5A4485']];
  // Laid out for 240 × 135; a bigger canvas (a loop's res) keeps the sky's top and the moon, and moves the hills down
  // (VO) and the hill's crest to the middle (HC).
  const VO = () => PH - 135, HC = () => PW / 2;
  const GROUND = 101;                                                     // hilltop under the character, at x = 120 (on 240 × 135)
  const hillTop = x => Math.round(GROUND + VO() + ((x - HC()) / (PW * .4)) ** 2 * 24);

  function sky(t) {
    const vo = VO(); for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) pset(x, y, bandAt(x, y, y - vo * .6, SKY, 4));
    // stars: most a single pixel, a few crosses; each twinkles on its own clock, in steps (on twos)
    const tt = Math.floor(t * 12) / 12;
    for (let i = 0; i < Math.round(52 * PW / 240); i++) {
      const x = Math.floor(hash(i) * PW), y = Math.floor(hash(i + 100) * (84 + VO() * .6));
      if (Math.hypot(x - 44, y - 28) < 17) continue;
      const tw = .5 + .5 * Math.sin(tt * (1.5 + 2 * hash(i + 7)) + i * 1.7), big = hash(i + 300) > .9;
      const c = tw > .75 ? '#FFF6DA' : tw > .35 ? '#C9C2EE' : '#7F78B8';
      pset(x, y, c);
      if (big && tw > .45) { pset(x - 1, y, '#8F88C8'); pset(x + 1, y, '#8F88C8'); pset(x, y - 1, '#8F88C8'); pset(x, y + 1, '#8F88C8'); }
    }
    // the moon, with a dithered halo, a shaded limb and a few craters
    for (let y = 8; y < 50; y++) for (let x = 24; x < 66; x++) {
      const d = Math.hypot(x - 44, y - 28);
      if (d > 11.5 && d < 18) pset(x, y, ditherPick(x, y, '#272758', '#3A3A73', clamp((18 - d) / 6.5) * .9));
    }
    for (let y = 16; y <= 40; y++) for (let x = 32; x <= 56; x++) {
      const d = Math.hypot(x - 44, y - 28); if (d > 11.3) continue;
      const lit = Math.hypot(x - 41, y - 26) < 10.6;
      pset(x, y, lit ? '#F8E9C6' : '#E3CB9C');
    }
    for (const [cx, cy, r] of [[40, 24, 1.6], [47, 31, 2.2], [44, 34, 1.2], [49, 23, 1.1]]) for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) if (Math.hypot(x, y) <= r) pset(cx + x, cy + y, '#DFC58F');
  }

  function hills(t) {
    // far ridge, middle ridge, then the near hill the character stands on
    for (let x = 0; x < PW; x++) {
      const yf = Math.round(86 + VO() + 5 * Math.sin(x * .032 + 1.1) + 3 * Math.sin(x * .087 + .4));
      for (let y = yf; y < PH; y++) pset(x, y, y === yf ? '#3A3270' : '#2B2659');
      const ym = Math.round(95 + VO() + 7 * Math.sin(x * .026 + 2.3) + 2 * Math.sin(x * .12));
      for (let y = ym; y < PH; y++) pset(x, y, y === ym ? '#3B4A86' : bandAt(x, y, y - ym, [[0, '#2E386B'], [16, '#29315F']], 3));
    }
    for (let x = 0; x < PW; x++) {
      const yt = hillTop(x);
      for (let y = yt; y < PH; y++) pset(x, y, bandAt(x, y, y - yt, [[0, '#3F7590'], [2, '#2E5A70'], [11, '#284D61'], [23, '#213F50']], 3));
    }
    // grass blades along the hilltop, swaying a pixel on the beat; a few amber flowers
    const sway = Math.floor(t * 4) % 2;
    for (let x = 4; x < PW - 4; x += 3) {
      if (hash(x + 9) < .35) continue;
      const yt = hillTop(x), h = 1 + Math.floor(hash(x) * 3), lean = (hash(x + 3) < .5 ? 0 : sway);
      for (let j = 1; j <= h; j++) pset(x + (j === h ? lean : 0), yt - j, j === h ? '#5FA2BC' : '#4A8AA4');
    }
    for (const fx of [34, 61, 88, 151, 178, 205].map(f => Math.round(f * PW / 240))) { const fy = hillTop(fx) + 2 + Math.floor(hash(fx) * 4); pset(fx, fy, '#F2B24C'); pset(fx, fy - 1, '#FFE2A0'); }
  }

  function fireflies(t) {
    for (let i = 0; i < 6; i++) {
      const ph = t * (.35 + .2 * hash(i)) + i * 1.9;
      const x = Math.round((30 + 180 * hash(i + 50)) * PW / 240 + 10 * Math.sin(ph * 1.3)), y = Math.round(62 + VO() * .8 + 26 * hash(i + 60) + 6 * Math.sin(ph * 2.1));
      const on = Math.sin(t * 3 + i * 2.3) > -.3;
      if (!on) continue;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) pset(x + dx, y + dy, '#A86E3C');
      pset(x, y, '#FFD27A');
    }
  }

  function shadowAt(cx, w) {
    const y = hillTop(cx) + 1;
    for (let x = cx - w; x <= cx + w; x++) for (let dy = -1; dy <= 1; dy++) if (Math.abs(x - cx) <= w - Math.abs(dy) * 3) pset(x, y + dy, ditherPick(x, y + dy, '#2A5266', '#18303D', .65));
  }

  // shared with other pixel scenes (scenes/acting.js)
  window.pxNight = { sky: t => sky(t), hills: t => hills(t), fireflies: t => fireflies(t), shadowAt: (cx, w) => shadowAt(cx, w), hillTop };

  function scene(t, drawChar) {
    sky(t); hills(t); fireflies(t);
    drawChar(t);
  }

  // The comparison stills: same hill, same framing, the character on the hilltop at x = 120, waving.
  LOOPS.pxClawd = t => scene(t, t => {
    shadowAt(120, 30);
    const wave = .7 + .3 * Math.sin(t * TAU * 1.2);
    clawdSprite({ wave, blink: frac(t / 3.3) < .04 }).draw(120, GROUND);
  });
  LOOPS.pxClawd.len = 4;
  // The four 黑哥 directions from the design concepts (design/), each on the same hill, for choosing.
  for (const key of ['hgChibi', 'hgStreet', 'hgRPG', 'hgBlock']) {
    LOOPS['px_' + key] = t => scene(t, t => {
      const S = window.SPRITES && SPRITES[key]; if (!S) return;
      shadowAt(120, 15);
      gridSprite(S.rows, S.pal).draw(120, GROUND);
    });
    LOOPS['px_' + key].len = 4;
  }
  // Both sprites big on a flat ground, for inspecting them pixel by pixel.
  LOOPS.pxSprites = t => {
    prect(0, 0, PW, PH, '#2B2A55');
    clawdSprite({ wave: 1 }).draw(64, 118);
    heigePx(176, 118, { ...feel('happy', 0), poseR: 'waveA', dy: 0, sq: 0, noShadow: true });
  };
  LOOPS.pxSprites.len = 1;
})();
