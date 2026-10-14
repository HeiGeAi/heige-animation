// compare_watercolor.js: the comparison still in the original painted style: the same night hill, moon, stars,
// fireflies and framing as LOOPS.pxClawd in pixel.html (pixel coordinates × 8), with the original Clawd waving.
//   node render.mjs --loop=compareWatercolor --stills=1 --out=out/compare/watercolor
(() => {
  const S = 8, GROUND = 101;
  const ridgeFar = x => 86 + 5 * Math.sin(x * .032 + 1.1) + 3 * Math.sin(x * .087 + .4);
  const ridgeMid = x => 95 + 7 * Math.sin(x * .026 + 2.3) + 2 * Math.sin(x * .12);
  const hillTop = x => GROUND + ((x - 120) / 96) ** 2 * 24;
  const curve = (f, step = 6) => { const pts = []; for (let x = -4; x <= 244; x += step) pts.push([x * S, f(x) * S]); return pts; };

  LOOPS.compareWatercolor = t => {
    // sky: a night wash, warming to violet at the horizon
    boilSeed('sky');
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#1C1D43', ink: null });
    paint(rectPts(-60, 380, W + 120, 520, 8), { fill: '#36306B', fillOp: 150, bleed: .3, tex: .6, ink: null });
    paint(rectPts(-60, 600, W + 120, 300, 8), { fill: '#4A3B7A', fillOp: 160, bleed: .3, tex: .6, ink: null });
    // stars, at the pixel version's positions
    for (let i = 0; i < 52; i++) {
      const x = Math.floor(hash(i) * 240), y = Math.floor(hash(i + 100) * 84);
      if (Math.hypot(x - 44, y - 28) < 17) continue;
      boilSeed('star' + i);
      const tw = .55 + .45 * Math.sin(t * (1.5 + 2 * hash(i + 7)) + i * 1.7), big = hash(i + 300) > .9;
      paint(starPts(x * S + 4, y * S + 4, (big ? 9 : 4.5) * (.6 + .4 * tw), .35, 4), { wash: PAL.cream, washOp: 160 + 90 * tw, ink: null });
    }
    // the moon and its glow
    glow(44 * S, 28 * S, 190, '#F8E9C6', .55);
    boilSeed('moon');
    paint(ellPts(44 * S, 28 * S, 88, 88, 30, 1.5), { wash: '#F8E9C6', fill: PAL.ochre, fillOp: 35, ink: PAL.ink, sw: 1.1 });
    for (const [cx, cy, r] of [[40, 24, 1.6], [47, 31, 2.2], [44, 34, 1.2], [49, 23, 1.1]]) paint(ellPts(cx * S, cy * S, r * S, r * S * .9, 12), { fill: '#DCC28F', fillOp: 140, bleed: .1, ink: null });
    // far ridge, middle ridge, near hill
    boilSeed('far');
    paint([...curve(ridgeFar), [W + 40, H + 40], [-40, H + 40]], { wash: '#2B2659', fill: '#3A3270', fillOp: 70, bleed: .15, tex: .5, ink: null });
    boilSeed('mid');
    paint([...curve(ridgeMid), [W + 40, H + 40], [-40, H + 40]], { wash: '#2E386B', fill: '#3B4A86', fillOp: 60, bleed: .15, tex: .5, ink: null });
    boilSeed('hill');
    const hill = [...curve(hillTop, 4), [W + 40, H + 40], [-40, H + 40]];
    paint(hill, { wash: '#2E5A70', fill: '#213F50', fillOp: 90, bleed: .12, tex: .6, ink: null });
    inkLine(curve(hillTop, 8).filter(([x]) => x > -10 && x < W + 10), 1, PAL.ink, 'ink', .5);
    // grass tufts and amber flowers along the hilltop
    for (let x = 4; x < 236; x += 3) {
      if (hash(x + 9) < .35) continue;
      boilSeed('tuft' + x);
      const yt = hillTop(x) * S, h = (1 + Math.floor(hash(x) * 3)) * S, sway = Math.sin(t * 2 + x) * 4;
      inkLine([[x * S, yt + 2], [x * S + sway, yt - h]], 1.6, '#5FA2BC', 'ink', .4);
    }
    for (const fx of [34, 61, 88, 151, 178, 205]) { boilSeed('flower' + fx); const fy = (hillTop(fx) + 2 + Math.floor(hash(fx) * 4)) * S; paint(ellPts(fx * S, fy, 6, 6, 10), { wash: '#F2B24C', ink: PAL.ink, sw: .5 }); }
    // fireflies
    for (let i = 0; i < 6; i++) {
      const ph = t * (.35 + .2 * hash(i)) + i * 1.9;
      const x = (30 + 180 * hash(i + 50) + 10 * Math.sin(ph * 1.3)) * S, y = (62 + 26 * hash(i + 60) + 6 * Math.sin(ph * 2.1)) * S;
      if (Math.sin(t * 3 + i * 2.3) > -.3) { glow(x, y, 46, '#FFC766', .9); boilSeed('ff' + i); paint(ellPts(x, y, 5, 5, 8), { wash: '#FFD27A', ink: null }); }
    }
    // Clawd on the hilltop, waving: 50 pixel-px wide in the pixel version, so 10u = 400 here
    clawd(120 * S, GROUND * S, 40, { ...feel('neutral', t, { seed: 1 }), aL: 0, aR: 1.25 + .2 * Math.sin(t * TAU * 1.2), boilKey: 'clawd' });
  };
  LOOPS.compareWatercolor.len = 4;
})();
