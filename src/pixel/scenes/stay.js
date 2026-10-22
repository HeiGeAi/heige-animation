// scenes/stay.js: V042「码农明知邪门为什么还不走」, a film in a block world (voxel.js) instead of on a stage. The camera
// walks with 黑哥 through a snowy night to his coder friend's cabin, falls with him into a lava cave, rides a minecart
// past 加班 and 学习, and then explores the village for the three reasons, the two kinds of players and the three
// questions. The audio is Blake's finished mix (voice + music, stay_data.js has its subtitles); hits land on the music's
// beat grid (93.02 BPM, first beat 0.13 s; the song restarts near 196.5 s, about 0.1 s later in phase).
//   node render.mjs --page=pixel.html --loop=pxStay --stills=3,9.2 --out=out/x
(() => {
  const { B } = VX;
  const BPM = 93.02, OFF = .13, BT = 60 / BPM, beat = n => OFF + n * BT;
  // the whole track's grid: beat n, with the measured drift and the jump where the song restarts
  const beatT = n => { const tb = OFF + n * BT; return tb + (tb < 196.5 ? -.01 + tb * .00023 : .10 + (tb - 200) * .00021); };
  const nb = t => { let n = Math.round((t - OFF) / BT), best = beatT(n); for (const k of [n - 1, n + 1]) if (Math.abs(beatT(k) - t) < Math.abs(best - t)) best = beatT(k); return best; };
  const clamp01 = v => Math.max(0, Math.min(1, v)), sm = v => { v = clamp01(v); return v * v * (3 - 2 * v); };
  const seg01 = (t, a, b) => clamp01((t - a) / (b - a)), lerp = (a, b, k) => a + (b - a) * k;
  const hh = (a, b = 0) => { const v = Math.sin(a * 91.3 + b * 47.7 + 13.1) * 43758.5453; return v - Math.floor(v); };
  const SFX = window.STAY_SFX = [];      // [t, sound, dB]: dumped to stay_sfx.js for tools/video/mix.mjs
  const sfx = (t, name, db = -12) => SFX.push([+t.toFixed(3), name, db]);

  // ======================================================================================= the world
  const G = 17;   // the snow plain's top block
  const rectD = (x, z, x0, x1, z0, z1) => Math.hypot(Math.max(x0 - x, 0, x - x1), Math.max(z0 - z, 0, z - z1));
  const flat = (x, z) => clamp01(Math.min(rectD(x, z, 50, 84, 54, 98), rectD(x, z, 126, 204, 56, 134), rectD(x, z, 84, 126, 60, 110)) / 7);
  for (let x = 0; x < VX.SX; x++) for (let z = 0; z < VX.SZ; z++) {
    const n = 1.7 * Math.sin(x * .11 + .7) + 1.5 * Math.cos(z * .09 + 1.3) + 1.1 * Math.sin((x + z) * .05) + 2.2 * Math.max(0, Math.sin(x * .045 - 2) * Math.cos(z * .04));
    const h = Math.min(30, G + Math.round(n * flat(x, z)));
    for (let y = 0; y <= h; y++) VX.set(x, y, z, y === 0 ? B.bedrock : y < h - 3 ? (y < 12 ? B.deep : B.stone) : y < h ? B.dirt : B.snow);
  }
  // the cave under the cabin: a lava lake on the west, a stone ledge on the east, an irregular ceiling up to y 15
  const inCave = (x, z) => ((x - 77) / 23) ** 2 + ((z - 75) / 18) ** 2 < 1 + .12 * Math.sin(x * .5) * Math.cos(z * .4);
  for (let x = 50; x < 104; x++) for (let z = 54; z < 96; z++) {
    if (!inCave(x, z)) continue;
    let ceil = Math.min(15, 12 + Math.round(1.8 * Math.sin(x * .31) + 1.4 * Math.cos(z * .27) + 1.2));
    if (x >= 70 && x <= 73 && z >= 62 && z <= 67) ceil = 15;
    const ledge = x >= 74 && z >= 64 && z <= 84;
    for (let y = 1; y <= ceil; y++) VX.set(x, y, z, ledge ? (y <= 4 ? (y === 4 ? B.cobble : B.deep) : 0) : (y === 1 ? B.deep : y === 2 ? B.lava : 0));
    if (hh(x, z) < .035) VX.set(x, ceil + 1, z, B.amethyst);
    else if (hh(x + 3, z) < .03) VX.set(x, ceil + 1, z, B.gold);
  }
  for (let y = 3; y <= 14; y++) VX.set(60, y, 70, B.lava);
  for (let y = 3; y <= 13; y++) VX.set(57, y, 80, B.lava);
  for (const [x, z] of [[58, 66], [61, 85], [66, 90], [95, 66], [97, 82], [90, 88], [68, 58]]) for (let y = 3; y <= 6; y++) if (!VX.get(x, y, z) || VX.get(x, y, z) === B.lava) VX.set(x, y + (VX.get(x, 2, z) === B.lava ? 0 : 2), z, B.amethyst);
  for (let x = 84; x <= 117; x++) VX.set(x, 4, 75, B.rail);
  for (let x = 96; x <= 118; x++) for (let z = 73; z <= 77; z++) for (let y = 4; y <= 8; y++) {
    const wall = z === 73 || z === 77 || y === 8 || x === 118;
    if (x <= 98 && !wall) continue;
    VX.set(x, y, z, wall ? B.cobble : y === 4 ? (z === 75 ? B.rail : B.cobble) : 0);
  }
  const TUN_LAMPS = []; for (let x = 100; x <= 116; x += 4) { const z = x % 8 === 4 ? 77 : 73; VX.set(x, 7, z, B.lamp); TUN_LAMPS.push([x, 7, z]); }
  VX.set(101, 6, 73, B.sign); VX.set(109, 6, 77, B.sign); VX.set(118, 6, 75, B.sign);
  for (const [x, z] of [[76, 66], [76, 83], [93, 67], [93, 82]]) { VX.set(x, 5, z, B.cobble); VX.set(x, 6, z, B.lamp); }

  // the cabin, its porch, the path and the spruces
  VX.fill(60, G, 60, 68, G, 68, B.plank);
  for (let y = G + 1; y <= G + 4; y++) for (let i = 60; i <= 68; i++) for (const [x, z] of [[i, 60], [i, 68], [60, i], [68, i]]) VX.set(x, y, z, (x === 60 || x === 68) && (z === 60 || z === 68) ? B.log : B.plank);
  for (let k = 0; k < 5; k++) VX.fill(59 + k, G + 5 + k, 59 + k, 69 - k, G + 5 + k, 69 - k, B.roof);
  for (const x of [63, 64]) for (const y of [G + 1, G + 2]) VX.set(x, y, 68, 0);
  for (const [x, z] of [[61, 68], [62, 68], [66, 68], [67, 68], [68, 64], [68, 65]]) for (const y of [G + 2, G + 3]) VX.set(x, y, z, 0);
  VX.fill(61, G + 1, 63, 61, G + 1, 66, B.plank);
  VX.set(61, G + 2, 64, B.monitor); VX.set(61, G + 2, 65, B.monitor);
  VX.fill(63, G + 1, 61, 67, G + 3, 61, B.books);
  VX.set(64, G + 4, 64, B.lamp); VX.set(67, G + 1, 67, B.lamp);
  VX.fill(69, G, 62, 73, G, 67, B.plank);
  for (const x of [69, 73]) { VX.set(x, G + 1, 62, B.log); VX.set(x, G + 2, 62, B.lamp); }
  VX.set(71, G + 1, 64, B.plank); VX.set(72, G + 1, 64, B.plank);
  for (let z = 69; z <= 100; z++) for (const x of [63, 64]) VX.set(x, G, z, B.path);
  for (const z of [75, 87]) for (const x of [60, 68]) { VX.set(x, G + 1, z, B.log); VX.set(x, G + 2, z, B.lamp); }
  const tree = (x, z, hgt = 6) => {
    let y0 = G; while (VX.get(x, y0 + 1, z)) y0++;
    for (let y = 1; y <= hgt; y++) VX.set(x, y0 + y, z, B.log);
    for (let y = 3; y <= hgt + 1; y++) { const r = y > hgt ? 0 : y > hgt - 2 ? 1 : 2; for (let i = -r; i <= r; i++) for (let j = -r; j <= r; j++) if (Math.abs(i) + Math.abs(j) <= r + 1 && (i || j || y > hgt)) VX.set(x + i, y0 + y, z + j, B.leaves); }
  };
  for (const [x, z, h] of [[56, 74, 6], [72, 79, 7], [53, 87, 6], [76, 89, 7], [57, 95, 6], [70, 96, 5], [81, 70, 7], [50, 64, 6], [47, 80, 7], [85, 84, 6], [52, 56, 6], [79, 55, 7], [44, 92, 6], [88, 93, 7], [58, 104, 6], [72, 108, 7], [40, 70, 6], [92, 62, 7],
    [125, 70, 7], [131, 118, 6], [198, 60, 7], [202, 120, 6], [133, 60, 6], [190, 128, 7], [110, 100, 6], [118, 64, 7], [170, 128, 6]]) tree(x, z, h);

  // the village: the office, the machine room, starter houses, the plaza with its comment wall, the reason pillars
  // and the portal, the road east to the fork of the three questions, and the dungeon under the plaza
  const box = (x0, z0, x1, z1, y0, y1, id) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) if (x === x0 || x === x1 || z === z0 || z === z1) VX.set(x, y, z, id); };
  for (let x = 138; x <= 172; x++) for (let z = 80; z <= 112; z++) VX.set(x, G, z, B.path);
  for (let x = 172; x <= 187; x++) for (const z of [95, 96]) VX.set(x, G, z, B.path);
  for (let z = 89; z <= 102; z++) for (const x of [186, 187]) VX.set(x, G, z, B.path);
  for (let z = 77; z <= 80; z++) for (const x of [145, 146]) VX.set(x, G, z, B.path);
  box(140, 66, 152, 76, G + 1, G + 6, B.brick); VX.fill(140, G + 7, 66, 152, G + 7, 76, B.roof);
  for (const x of [145, 146]) for (const y of [G + 1, G + 2]) VX.set(x, y, 76, 0);
  for (const x of [142, 143, 149, 150]) for (const y of [G + 3, G + 4]) VX.set(x, y, 76, B.lamp);
  box(156, 64, 164, 74, G + 1, G + 4, B.brick); VX.fill(156, G + 5, 64, 164, G + 5, 74, B.roof);
  for (let x = 157; x <= 163; x++) for (let y = G + 1; y <= G + 3; y++) VX.set(x, y, 74, 0);
  for (let x = 157; x <= 163; x++) for (let y = G + 1; y <= G + 3; y++) VX.set(x, y, 65, B.code);
  for (const x of [158, 160, 162]) VX.set(x, G + 4, 69, B.offlamp);
  VX.set(160, G + 1, 71, B.tnt);
  const house = (x0, z0) => { box(x0, z0, x0 + 5, z0 + 5, G + 1, G + 3, B.plank); for (const [x, z] of [[x0, z0], [x0 + 5, z0], [x0, z0 + 5], [x0 + 5, z0 + 5]]) for (let y = G + 1; y <= G + 3; y++) VX.set(x, y, z, B.log);
    for (let k = 0; k < 3; k++) VX.fill(x0 - 1 + k, G + 4 + k, z0 - 1 + k, x0 + 6 - k, G + 4 + k, z0 + 6 - k, B.roof); VX.set(x0 + 2, G + 1, z0 + 5, 0); VX.set(x0 + 2, G + 2, z0 + 5, 0); VX.set(x0 + 4, G + 2, z0 + 5, B.lamp); };
  house(176, 62); house(184, 70); house(176, 76); house(192, 64);
  VX.set(172, G + 1, 84, B.log); VX.set(172, G + 2, 84, B.sign);
  VX.fill(140, G + 1, 113, 151, G + 3, 113, B.plank); VX.fill(140, G + 1, 112, 151, G + 3, 112, B.sign);
  const PILL = [[152, B.worange, '兴趣'], [156, B.wblue, '投入'], [160, B.wpurple, '尊重']], PZ = 92;
  for (const [x, id] of PILL) { for (let y = G + 1; y <= G + 3; y++) VX.set(x, y, PZ, id); VX.set(x, G + 4, PZ, B.offlamp); }
  for (let x = 160; x <= 163; x++) for (let y = G + 1; y <= G + 5; y++) VX.set(x, y, 100, x === 160 || x === 163 || y === G + 1 || y === G + 5 ? B.obsidian : B.portal);
  for (const y of [G + 1, G + 2]) { VX.edit(72.7, 159, y, 96, B.log); VX.edit(77.0, 159, y, 96, 0); }
  for (const [x, z, lid] of [[185, 90, B.lamp], [188, 90, B.lamp], [185, 101, B.redlamp], [188, 101, B.redlamp]]) { VX.set(x, G + 1, z, B.log); VX.set(x, G + 2, z, B.log); VX.set(x, G + 3, z, lid); }
  for (const [x, z] of [[139, 84], [167, 84], [139, 108], [167, 108], [172, 92], [172, 99]]) { VX.set(x, G + 1, z, B.log); VX.set(x, G + 2, z, B.lamp); }
  // the dungeon (副本) under the plaza: obsidian walls, iron bars, a post, a portal out it never takes
  for (let x = 150; x <= 168; x++) for (let z = 118; z <= 132; z++) for (let y = 3; y <= 10; y++) {
    const wall = x === 150 || x === 168 || z === 118 || z === 132 || y === 3 || y === 10;
    VX.set(x, y, z, wall ? B.obsidian : 0);
  }
  for (let z = 121; z <= 129; z += 2) for (let y = 4; y <= 6; y++) VX.set(162, y, z, B.iron);
  for (let z = 123; z <= 126; z++) for (let y = 4; y <= 6; y++) VX.set(167, y, z, B.portal);
  VX.set(155, 4, 126, B.log); VX.set(155, 5, 126, B.log);
  for (const [x, z] of [[151, 119], [151, 131], [161, 119], [161, 131]]) VX.set(x, 9, z, B.amethyst);

  // ------------------------------------------------ what changes over time
  for (let x = 71; x <= 72; x++) for (let z = 63; z <= 66; z++) { VX.edit(beat(15) + .1, x, G, z, B.crack); VX.edit(beat(16), x, G, z, 0); VX.edit(beat(16), x, G - 1, z, 0); VX.edit(23, x, G, z, B.plank); VX.edit(23, x, G - 1, z, B.dirt); }
  VX.edit(beat(16), 71, G + 1, 64, 0); VX.edit(beat(16), 72, G + 1, 64, 0); VX.edit(23, 71, G + 1, 64, B.plank); VX.edit(23, 72, G + 1, 64, B.plank);
  const TW = [[78, 71, B.code], [82, 71, B.books]], BUILD0 = beat(19), STEP = BT / 4, BREAK0 = beat(23), BSTEP = BT / 8;
  for (const [x, z, id] of TW) for (let i = 0; i < 10; i++) { VX.edit(BUILD0 + i * STEP, x, 5 + i, z, id); VX.edit(BREAK0 + (9 - i) * BSTEP, x, 5 + i, z, 0); }
  // 日志: the tunnel stuffed with logs, chopped a column a beat, then the bug block, then the lamps light up the line
  const LOG0 = 88.6, CHOPS = [92.95, 93.6, 94.25, 94.9, 95.5, 95.85].map(nb), FIX = nb(97.4), RUN = nb(98.15);
  for (let i = 0; i < 6; i++) for (let y = 5; y <= 7; y++) for (let z = 74; z <= 76; z++) { VX.edit(LOG0, 102 + i, y, z, B.log); VX.edit(CHOPS[i], 102 + i, y, z, 0); }
  VX.edit(LOG0, 108, 6, 75, B.redlamp); VX.edit(FIX, 108, 6, 75, B.lamp); VX.edit(101, 108, 6, 75, 0);
  for (const [x, y, z] of TUN_LAMPS) { VX.edit(LOG0, x, y, z, B.offlamp); VX.edit(RUN + (x - 100) / 4 * BT / 4, x, y, z, B.lamp); }
  // the machine room blows: the TNT goes, the racks die, the red lamps come on
  const BLAST = nb(171.6);
  VX.edit(BLAST, 160, G + 1, 71, 0); for (let x = 157; x <= 163; x++) for (let y = G + 1; y <= G + 3; y++) if (hh(x, y) < .7) VX.edit(BLAST, x, y, 65, B.box);
  for (const x of [158, 160, 162]) VX.edit(BLAST, x, G + 4, 69, B.redlamp);
  for (const [x, z] of [[159, 71], [161, 71], [160, 72], [160, 70]]) VX.edit(BLAST, x, G, z, B.dirt);
  // the hour on top: a gold pedestal in front of the door, then the gold pile behind him
  const PED = 188.4, PILE = nb(196.0);
  for (const x of [63, 64]) { VX.edit(PED, x, G + 1, 73, B.goldblk); VX.edit(203, x, G + 1, 73, 0); }
  for (let x = 60; x <= 67; x++) for (let z = 69; z <= 71; z++) { const hgt = 3 - Math.floor(Math.abs(x - 63.5) / 1.6); for (let y = 0; y < hgt; y++) { VX.edit(PILE + hh(x, z) * .5 + y * .08, x, G + 1 + y, z, B.goldblk); VX.edit(203, x, G + 1 + y, z, 0); } }
  // the reason pillars light up (and again for 1, 2, 3 at the end)
  const PLIT = [nb(55.1), nb(55.8), nb(56.45)], PLIT2 = [nb(305.5), nb(306.95), nb(309.35)];
  PILL.forEach(([x], i) => { VX.edit(PLIT[i], x, G + 4, PZ, B.lamp); VX.edit(120, x, G + 4, PZ, B.offlamp); VX.edit(202.8, x, G + 4, PZ, B.lamp); VX.edit(205.5, x, G + 4, PZ, B.offlamp); VX.edit(PLIT2[i], x, G + 4, PZ, B.lamp); VX.edit(67.2 + i * .2, x, G + 4, PZ, B.lamp); });

  // ======================================================================================= sprites
  const SPK = 1.75 / 87;
  const hgImg = o => VX.capture((x, y) => heigePx(x, y, { ...o, noShadow: true }));
  const bottle = (() => { const s = new Spr(); s.rect(-3, -9, 6, 9, '#8A4A1E').rect(-2, -8, 1, 6, '#E8A060').rect(-1, -13, 2, 4, '#7A3E18').rect(-3, -6, 6, 3, '#F2E6C8').outline('#2A140C'); return VX.capture((x, y) => s.draw(x, y), 20, 24, 10, 22); })();
  const cartSpr = (() => { const s = new Spr(); s.rect(-27, -22, 54, 18, '#5E6172').rect(-27, -22, 54, 3, '#8E92A4').rect(-25, -18, 50, 1, '#43465A').rect(-25, -12, 50, 1, '#43465A');
    for (const cx of [-17, 17]) s.ell(cx, -4, 5, 5, '#2A2A36').ell(cx, -4, 2, 2, '#8E92A4'); return s.outline('#16161E'); })();
  const cartImg = withClawd => VX.capture((x, y) => { if (withClawd) clawdPx(x, y - 11, { ...withClawd, noShadow: true }); cartSpr.draw(x, y); }, 150, 150, 75, 140);
  const goldImg = (() => { const s = new Spr(); s.rect(-7, -14, 14, 14, '#F2C14E').rect(-7, -14, 14, 2, '#FFF2B8').rect(5, -12, 2, 12, '#B8862E').outline('#5A3E10'); return VX.capture((x, y) => s.draw(x, y), 24, 24, 12, 20); })();
  const chestImg = (() => { const s = new Spr(); s.rect(-10, -16, 20, 16, '#9E6A38').rect(-10, -16, 20, 6, '#B07B45').rect(-10, -10, 20, 1, '#4A2E1C').rect(-2, -12, 4, 4, '#D8D8E0').outline('#2A1A10'); return VX.capture((x, y) => s.draw(x, y), 30, 26, 15, 22); })();
  // Clawd with extras: gold armour, a crown, a sword (a quest mark is drawn in the overlay)
  function clawdExtras(X, Y, o, ex) {
    const by = (o.sq || 0) >= .16 ? 3 : (o.sq || 0) >= .07 ? 1 : 0, dy = Math.round((o.dy || 0) * 5);
    const s = new Spr();
    if (ex.armor) { s.rect(-27, -47, 54, 8, '#F2C14E').rect(-27, -47, 54, 2, '#FFF2B8').rect(-27, -41, 54, 2, '#B8862E').rect(-27, -24, 54, 7, '#F2C14E').rect(-27, -24, 54, 1, '#FFF2B8').rect(-27, -18, 54, 1, '#B8862E'); }
    if (ex.crown) { s.rect(-11, -48, 22, 5, '#F2C14E').rect(-11, -53, 4, 5, '#F2C14E').rect(-2, -55, 4, 7, '#F2C14E').rect(7, -53, 4, 5, '#F2C14E').set(0, -50, '#E83A44').set(-6, -46, '#3E5AA8').set(6, -46, '#3E5AA8'); }
    if (ex.sword != null) { const a = ex.sword, ox = 28, oy = -28; for (let i = 0; i < 20; i++) { const x = ox + Math.round(Math.cos(a) * i), y = oy - Math.round(Math.sin(a) * i); s.set(x, y, i < 5 ? '#6B4428' : i === 5 ? '#3A2A20' : '#D8DCE8'); s.set(x + 1, y, i < 5 ? '#5A3820' : '#9A9EB0'); } }
    if (s.m.size) { s.outline('#2A1A10'); s.draw(X, Y + by + dy, !!o.flip); }
  }
  const clImg = (o, ex = {}) => VX.capture((x, y) => { clawdPx(x, y, { ...o, noShadow: true }); clawdExtras(x, y, o, ex); }, 160, 160, 80, 150);
  function clawd(x, y, z, o = {}, ex = {}) { VX.sprite(clImg(o, ex), x, y, z, { a: ex.a ?? 1 }); if (!ex.noShadow) VX.shadow(x, y, z, .5); if (ex.tag) TAGS.push([x, y + 1.25, z, ex.tag, ex.tagCol]); }
  function heige(x, y, z, o = {}, ex = {}) { VX.sprite(hgImg(o), x, y, z); VX.shadow(x, y, z, .42); if (ex.tag) TAGS.push([x, y + 2.05, z, ex.tag]); }
  // villagers: robe colour by role, arms crossed, the big nose; moods change brows, eyes and mouth; bow drops the head
  const VC = { 测试: ['#D8783A', '#B4602C', '#6E3A1C'], 产品: ['#3E5AA8', '#2E4686', '#1E2A50'], 项目经理: ['#7A4AA8', '#5E3884', '#3A2050'], 领导: ['#2A2E4A', '#1C1F34', '#141420'], 甲方: ['#B8862E', '#94681E', '#5A3E10'], 村民: ['#8A5A3A', '#6E4628', '#3A2418'] };
  const villCache = new Map();
  function villImg(role, mood = 'neutral', bow = 0) {
    const key = [role, mood, bow].join('|'); if (villCache.has(key)) return villCache.get(key);
    const [c1, c2, hat] = VC[role] || VC.村民, s = new Spr(), H = -92 + bow * 9, SK = '#C8946A', SKD = '#B07A55', D = '#3A2418';
    s.rect(-14, -54, 28, 54, c1).rect(6, -54, 8, 54, c2).rect(-14, -6, 28, 6, c2).rect(-16, -44, 32, 10, c2).rect(-6, -43, 12, 8, SK);
    if (role === '领导') s.rect(-2, -54, 4, 10, '#C8323C').rect(-14, -54, 6, 22, '#EDE6DA');
    s.rect(-12, H, 24, 36, SK).rect(6, H, 6, 36, SKD).rect(-12, H, 24, 7, hat);
    const ey = H + 15, closed = mood === 'bow' || bow;
    if (mood === 'dizzy') { for (const ex of [-9, 3]) { s.line(ex, ey, ex + 4, ey + 4, D); s.line(ex, ey + 4, ex + 4, ey, D); } }
    else if (closed) { s.rect(-9, ey + 2, 5, 1, D).rect(3, ey + 2, 5, 1, D); }
    else { s.rect(-9, ey, 5, 4, '#FFFFFF').rect(3, ey, 5, 4, '#FFFFFF').rect(-6, ey, 2, 4, '#3A6A8A').rect(3, ey, 2, 4, '#3A6A8A'); }
    if (mood === 'angry' || mood === 'shout') { s.line(-10, ey - 4, -3, ey - 1, D).line(9, ey - 4, 2, ey - 1, D); } else s.rect(-10, ey - 3, 19, 2, D);
    s.rect(-2, ey + 3, 5, 12, '#A8704C');
    const my = H + 31;
    if (mood === 'happy' || mood === 'bow') { s.rect(-5, my, 11, 1, '#5A2E20').set(-6, my - 1, '#5A2E20').set(6, my - 1, '#5A2E20'); }
    else if (mood === 'angry' || mood === 'shout') { s.rect(-4, my - 1, 9, 3, '#5A2E20'); }
    else s.rect(-4, my, 9, 1, '#5A2E20');
    s.outline('#24140E');
    const img = VX.capture((x, y) => s.draw(x, y), 70, 120, 35, 112); villCache.set(key, img); return img;
  }
  function vill(x, y, z, role, mood = 'neutral', ex = {}) { VX.sprite(villImg(role, mood, ex.bow || 0), x, y + (ex.dy || 0), z); VX.shadow(x, y, z, .4); if (ex.tag !== false) TAGS.push([x, y + 2.05 - (ex.bow ? .2 : 0), z, ex.tag || role, ex.tagCol]); }
  // the bug: a little silverfish, or (scaled up) the boss
  function bugImg(ph, hurt = 0, boss = false) {
    const s = new Spr(); const cols = hurt ? ['#F07A7A', '#D85A5A'] : boss ? ['#7A5AA8', '#5E4488'] : ['#8E8AA8', '#77738F'];
    [4, 5, 5, 4, 3].forEach((r, i) => { const x = -12 + i * 6, y = -6 + Math.round(Math.sin(ph * 6 + i) * 1.2); s.ell(x, y, r, r * .85, cols[i % 2]); s.line(x, y + 3, x - 2, 0, '#2A2638').line(x, y + 3, x + 2, 0, '#2A2638'); });
    s.set(-15, -7, '#FF3A3A').set(-15, -6, '#FF3A3A').line(-15, -9, -19, -13, '#2A2638').line(-14, -9, -16, -14, '#2A2638');
    if (boss) s.rect(-17, -9, 3, 3, '#FF5A3A');
    return VX.capture((x, y) => s.outline('#1A1622').draw(x, y), 48, 30, 24, 26);
  }

  // ======================================================================================= part 1: the opening (0 to 23.4 s)
  const cr = (p0, p1, p2, p3, u) => { const u2 = u * u, u3 = u2 * u; return .5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3); };
  function along(keys, t) {
    if (keys.length === 1) return { p: [...keys[0][1]], q: [...keys[0][2]], fov: keys[0][3] };
    let i = 0; while (i < keys.length - 2 && t >= keys[i + 1][0]) i++;
    let k1 = keys[i], k2 = keys[i + 1], k0 = keys[Math.max(0, i - 1)], k3 = keys[Math.min(keys.length - 1, i + 2)];
    // keys a hair apart are a cut: no easing across them, and the spline doesn't reach over them
    if (k2[0] - k1[0] < .15) return { p: [...k1[1]], q: [...k1[2]], fov: k1[3] };
    if (k1[0] - k0[0] < .15) k0 = k1; if (k3[0] - k2[0] < .15) k3 = k2;
    const u = sm(seg01(t, k1[0], k2[0])) * .35 + seg01(t, k1[0], k2[0]) * .65;
    const v = (a, b) => cr(k0[a][b], k1[a][b], k2[a][b], k3[a][b], u);
    return { p: [v(1, 0), v(1, 1), v(1, 2)], q: [v(2, 0), v(2, 1), v(2, 2)], fov: k1[3] + (k2[3] - k1[3]) * sm(u) };
  }
  const look = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2]; return { yaw: Math.atan2(dx, -dz), pitch: Math.atan2(dy, Math.hypot(dx, dz)) }; };
  const A = [
    [0.00, [64.0, 20.1, 85.2], [64.0, 18.9, 70.0], 64], [beat(2), [64.0, 20.9, 83.4], [64.0, 19.3, 68.0], 64],
    [1.93, [64.0, 21.0, 80.2], [64.0, 19.2, 68.0], 66], [2.40, [64.0, 19.2, 69.6], [63.2, 18.9, 64.8], 72],
    [beat(4), [65.4, 19.35, 66.4], [62.7, 18.6, 64.6], 62], [3.60, [65.2, 19.3, 65.8], [62.5, 18.7, 64.6], 58],
    [beat(7), [64.3, 19.25, 65.6], [61.9, 19.1, 64.9], 54], [beat(8), [64.3, 18.95, 66.0], [62.7, 18.55, 64.6], 54],
    [7.30, [63.9, 18.8, 66.4], [62.7, 18.5, 64.6], 50],
  ];
  const Bk = [
    [beat(11), [72.2, 20.6, 70.6], [76.6, 24.8, 65.0], 62], [beat(12), [72.2, 21.0, 70.0], [72.1, 18.9, 64.5], 66],
    [8.80, [72.1, 20.8, 69.6], [72.1, 18.8, 64.5], 64], [beat(15), [72.1, 20.7, 69.3], [72.1, 18.8, 64.5], 62],
    [beat(16), [72.1, 21.2, 68.4], [72.0, 17.5, 64.6], 62], [beat(17), [72.0, 22.2, 66.2], [71.8, 12.0, 64.6], 66],
    [11.45, [71.6, 16.0, 64.9], [74.0, 8.0, 68.0], 72], [beat(18), [73.5, 10.5, 69.0], [79.8, 6.0, 75.5], 66],
    [beat(19), [78.2, 7.4, 84.5], [80.0, 6.4, 73.0], 62], [13.83, [79.6, 8.6, 85.5], [80.0, 10.6, 72.0], 64], [beat(22), [80.4, 8.7, 85.3], [80.0, 10.6, 72.0], 64],
    [beat(23), [80.8, 8.6, 85.0], [80.0, 10.2, 72.0], 64], [15.7, [80.6, 7.4, 83.0], [79.8, 6.3, 74.0], 58], [beat(25), [80.4, 6.9, 80.2], [79.8, 6.2, 75.5], 54],
    [beat(27), [82.5, 7.3, 80.3], [83.5, 6.0, 75.5], 56], [beat(28), [83.0, 7.4, 80.0], [86.0, 6.0, 75.5], 58],
  ];
  const RIDE0 = beat(28), RIDE1 = beat(33), CART0 = 85.5, CART1 = 114.5, P1END = 23.40;
  const cartX = t => CART0 + (CART1 - CART0) * (1 - (1 - seg01(t, RIDE0, RIDE1)) ** 2);
  function camera1(t) {
    if (t < 7.22) return along(A, t);
    if (t < RIDE0) return along(Bk, t);
    const x = cartX(t), bump = t < RIDE1 ? Math.exp(-((t - OFF) % BT) * 9) * .05 : 0;
    const chase = { p: [x - 3.4 + .35 * sm(seg01(t, 21.6, P1END)), 6.85 - bump, 75.5], q: [x + 7, 6.1, 75.5], fov: 68 };
    const end = seg01(t, 20.9, 21.6), q = [chase.q[0] + (118 - chase.q[0]) * sm(end), 6.1 + .4 * sm(end), 75.5];
    const k = sm(seg01(t, RIDE0, RIDE0 + BT)), from = along(Bk, RIDE0);
    return { p: from.p.map((v, i) => v + (chase.p[i] - v) * k), q: from.q.map((v, i) => v + (q[i] - v) * k), fov: from.fov + (chase.fov - from.fov) * k };
  }
  function act1(t) {
    if (t < 3) { const z = 80.5 - 1.55 * Math.min(t, 2.6); heige(64.0, G + 1, z, { ...feel('neutral', t), view: 'back', walk: (t - OFF) / (2 * BT) }); }
    if (t < 7.22) {
      clawd(62.7, G + 1, 64.6, { ...emotions(t, [[0, 'angry'], [beat(6) - .08, 'surprised'], [beat(7) - .05, 'bored'], [beat(8) - .1, 'furious']]), view: 'front' });
      VX.setAlert(t > beat(6) - .02 && t < beat(8) - .2 && (Math.floor((t - beat(6)) * 6) % 2 === 0 || t > beat(6) + .3));
    }
    if (t >= 7.22 && t < beat(28)) {
      const jumpU = seg01(t, beat(17), beat(18));
      if (t < beat(18)) {
        let x = 69.9, y = G + 1, z = 64.5;
        const hop = t > beat(14) - .25 && t < beat(14) ? Math.sin(Math.PI * seg01(t, beat(14) - .25, beat(14))) * .35 : 0;
        if (jumpU > 0) { x = 69.9 + 9.9 * jumpU; z = 64.5 + 11 * jumpU; y = G + 1 + 1.6 * 4 * jumpU * (1 - jumpU) - 13 * jumpU * jumpU; }
        const keys = [[0, 'happy', { blush: .8 }], [8.8, 'angry'], [beat(14) - .1, 'furious', { aL: 1.3, aR: 1.3 }], [beat(15) - .05, 'furious'], [beat(16) - .05, 'scared'], [beat(17) - .1, 'determined']];
        clawd(x, y, z, { ...emotions(t, keys), view: jumpU > 0 ? 'front' : 'q', dy: hop * 4 }, { noShadow: jumpU > 0 });
      }
      const hk = [[0, 'neutral'], [beat(14) + .02, 'surprised'], [beat(15) + .1, 'scared'], [beat(16) + .05, 'scared'], [beat(18) + .2, 'confused']];
      if (t < beat(19)) heige(73.6, G + 1, 64.5, { ...emotions(t, hk), view: 'q', flip: true });
      for (const [bx, i] of [[71.55, 0], [72.3, 1]]) {
        let by = G + 2;
        if (t > beat(14) && t < beat(14) + .32) by += Math.sin(Math.PI * (t - beat(14)) / .32) * (.28 + .1 * i);
        if (t > beat(16)) by -= 12.5 * (t - beat(16)) ** 2;
        if (by > 3) VX.sprite(bottle, bx, by, 64.5 + .2 * i, { k: .028 });
      }
    }
    if (t >= beat(18) && t < RIDE0) {
      const keys = [[beat(18), 'dizzy'], [beat(18) + .45, 'proud'], [beat(23) - .05, 'scared'], [beat(24), 'sad'], [beat(25) - .08, 'furious']];
      let x = 79.8, view = 'front', walk;
      if (t > beat(26)) { const u = seg01(t, beat(26), beat(28) - .25); x = 79.8 + 5.7 * u; view = 'side'; walk = (t - OFF) / (2 * BT); }
      const land = Math.exp(-(t - beat(18)) * 9), y = 5 + (t > beat(28) - .25 ? Math.sin(Math.PI * seg01(t, beat(28) - .25, beat(28))) * .6 : 0);
      clawd(x, y, 75.5, { ...emotions(t, keys), view, walk, sq: land * .3 });
    }
    {
      const x = t < RIDE0 ? CART0 : cartX(t), withC = t >= RIDE0 ? { ...emotions(t, [[RIDE0, 'furious'], [beat(30), 'determined'], [beat(32), 'sad'], [21.7, 'furious', { emote: 'anger' }]]), view: 'back' } : null;
      if (t > beat(18)) { VX.sprite(cartImg(withC), x, 5, 75.5); VX.shadow(x, 5, 75.5, .55, .35); }
    }
  }
  const kicks1 = [[beat(14), 1], [beat(15), .6], [beat(16), 1.4], [beat(17), .8], [beat(18), 1], [beat(23), .9], [beat(25), 1.2], [beat(26), .5], [beat(27), .5], [beat(33), .8]];

  // ======================================================================================= the shots after the opening
  // A shot: { t0, t1, keys: [[t, pos, target, fov]...], day, fog, snow, embers, moon, pre(t), act(t), ui(c, t), kicks }
  const K = (t, p, q, f = 62) => [t, p, q, f];
  const TAGS = [], BUBS = [], LBLS = [];
  const bubble = (x, y, z, txt, t, t0, t1) => { if (t >= t0 && t < t1) BUBS.push([x, y, z, txt, t - t0, t1 - t]); };
  const label = (x, y, z, txt, size, col, t, t0, t1 = 1e9) => { if (t >= t0 && t < t1) LBLS.push([x, y, z, txt, size, col, t - t0, t1 - t]); };
  const swing = (t, hits) => { let s = .3; for (const h of hits) { const a = t - h; if (a > -.12 && a < .25) s = a < 0 ? 1.4 : 1.4 - a * 7; } return s; };
  const S = [];
  const shot = (t0, t1, o) => { S.push({ t0, t1, ...o }); sfx(t0 - .12, 'whoosh', -15); };

  // 一直骂到凌晨 2 点 is the ride's end; 领导来俩嘴巴子 is a daydream at the office
  const SLAP = [nb(25.3), nb(26.0)];
  shot(P1END, 27.8, { day: 0, snow: true, fog: [26, 64], keys: [K(P1END, [146.8, 19.9, 86.6], [146.8, 19.1, 79.6], 62), K(27.8, [146.8, 19.6, 85.2], [146.8, 19.0, 79.6], 56)], kicks: SLAP.map(t => [t, 1.1]),
    act: t => { vill(146.0, G + 1, 79.6, '领导', t > SLAP[0] && t < SLAP[1] + .6 ? 'dizzy' : 'angry');
      const lunge = SLAP.reduce((m, h) => Math.max(m, Math.exp(-Math.abs(t - h) * 9)), 0);
      clawd(147.6 - .5 * lunge, G + 1, 80.0, { ...feel('furious', t), view: 'side', flip: true, aL: lunge > .3 ? 1.1 : .2 }); },
    ui: (c, t) => { dream(c, t, P1END, 27.8); SLAP.forEach(h => pow(c, t, h, '啪！', 1180, 360)); } });
  SLAP.forEach(h => sfx(h - .03, 'slap', -7));
  // 结果第二天早上 9 点: a time-lapse sunrise over the cabin
  shot(27.8, 29.5, { day: t => sm(seg01(t, 27.9, 29.3)) * .82, fog: [30, 70], moon: [.7, .35, .3], keys: [K(27.8, [70, 24.5, 92], [64, 20, 64], 62), K(29.5, [62, 25.5, 90], [64, 20.5, 64], 60)], ui: (c, t) => clockUI(c, hhmm(lerp(2, 9, sm(seg01(t, 27.9, 29.3)))), 1) });
  sfx(28.0, 'chime', -12);
  // 他在工作群里又是秒回, 还修了个 bug, 一修就修到晚上 11 点 (the day passes in the windows)
  const BUGHIT = [nb(32.0), nb(33.25), nb(33.9), nb(34.55)], BUGDIE = nb(35.1);
  shot(29.5, 35.3, { day: t => t < 32.6 ? .9 : t < 34.3 ? lerp(.9, .5, seg01(t, 32.6, 34.3)) : lerp(.5, .05, seg01(t, 34.3, 35.2)), moon: [-.3, .5, .8], fog: [18, 44],
    keys: [K(29.5, [66.4, 19.9, 62.4], [62.6, 18.8, 66.0], 70), K(35.3, [66.0, 19.7, 62.0], [62.6, 18.7, 66.0], 66)], kicks: BUGHIT.map(t => [t, .5]),
    act: t => { const bx = 63.6 + .25 * Math.sin(t * 2.3), alive = t < BUGDIE;
      clawd(62.7 + (t > 31.6 ? .5 * Math.min(1, (t - 31.6) * 3) : 0), G + 1, 64.6 + (t > 31.6 ? .8 : 0), { ...emotions(t, [[29.5, 'determined'], [31.5, 'angry'], [34.2, 'sleepy'], [BUGDIE, 'proud']]), view: 'front' }, { sword: t > 31.6 ? swing(t, BUGHIT) : null });
      if (t > 31.5 && alive) { const hurt = BUGHIT.some(h => t > h && t < h + .18); VX.sprite(bugImg(t, hurt), bx, G + 1, 66.2, { k: .03 }); }
      VX.setAlert(t > 29.6 && t < 31.5); },
    ui: (c, t) => { clockUI(c, hhmm(t < 32.6 ? 9 : lerp(9, 23, seg01(t, 32.6, 35.1))), 1);
      chatPanel(c, t, '工作群', [[29.65, '产品经理', '@码农朋友 线上有个 bug'], [30.15, '码农朋友', '收到', '秒回']]); } });
  sfx(29.65, 'chat', -12); sfx(30.15, 'chat', -10); BUGHIT.forEach(h => sfx(h, 'hit', -9)); sfx(BUGDIE, 'poof', -9);
  // 这他妈叫什么事儿啊: 黑哥 at the door, looking in
  shot(35.3, 37.1, { day: 0, snow: true, fog: [22, 60], keys: [K(35.3, [64.0, 19.8, 75.0], [64.0, 19.2, 69.5], 58), K(37.1, [64.0, 19.6, 74.0], [64.0, 19.2, 69.5], 52)],
    act: t => heige(64.0, G + 1, 69.8, { ...emotions(t, [[35.3, 'confused'], [36.0, 'bored']]), view: 'front' }) });
  // 骂这行邪门的是他
  shot(37.1, 38.85, { day: 0, keys: [K(37.1, [64.7, 19.1, 63.2], [62.7, 18.6, 64.6], 52), K(38.85, [64.4, 19.0, 63.6], [62.7, 18.6, 64.6], 48)],
    act: t => clawd(62.7, G + 1, 64.6, { ...feel('furious', t), view: 'front' }),
    ui: (c, t) => chatLines(c, t, [[37.3, [['<码农朋友> 这行真邪门', '#FFFFFF']]]]) });
  sfx(37.3, 'chat', -12);
  // 每天准时上线的也是他: days flick past over the cabin; he joins the game every morning
  const JOIN = [nb(39.2), nb(39.85), nb(40.5)];
  shot(38.85, 41.3, { day: t => .5 - .5 * Math.cos((t - 38.85) / (BT * 2) * Math.PI * 2), moon: [.7, .45, .2], fog: [30, 70], keys: [K(38.85, [80, 27, 82], [64, 19, 64], 62), K(41.3, [50, 27, 82], [64, 19, 64], 62)],
    ui: (c, t) => { chatLines(c, t, JOIN.map(j => [j, [['码农朋友 加入了游戏', '#FFE070']]])); JOIN.forEach((j, i) => { if (t >= j && t < (JOIN[i + 1] || 1e9)) dayCounter(c, `第 ${3651 + i} 天`, 1); }); } });
  JOIN.forEach(j => sfx(j, 'join', -12));
  // 跟网游里那种骂着服务器是垃圾 还天天登录的老玩家
  const QUIT = nb(44.0), BACK = nb(44.65);
  shot(41.3, 46.7, { day: 0, keys: [K(41.3, [65.8, 19.5, 66.6], [62.7, 18.7, 64.6], 58), K(46.7, [65.2, 19.3, 62.9], [62.7, 18.7, 64.6], 56)],
    act: t => { if (t < QUIT || t > BACK) clawd(62.7, G + 1, 64.6, { ...emotions(t, [[41.3, 'angry'], [BACK, 'happy']]), view: 'front' }, { a: t > BACK ? Math.min(1, (t - BACK) * 5) : 1 });
      for (const t0 of [QUIT, BACK]) { const a = t - t0; if (a > 0 && a < .6) for (let i = 0; i < 14; i++) VX.pt(62.7 + Math.cos(i) * a, G + 1.2 + i % 4 * .2 + a, 64.6 + Math.sin(i) * a, .07, [235, 225, 255], true); } },
    ui: (c, t) => { chatLines(c, t, [[41.6, [['<码农朋友> 什么垃圾服务器', '#FFFFFF']]], [42.7, [['<码农朋友> 又卡了', '#FFFFFF']]], [QUIT, [['码农朋友 退出了游戏', '#FFE070']]], [BACK, [['码农朋友 加入了游戏', '#FFE070']]]]);
      tagUI(c, '在线时长 3650 天', 1); } });
  sfx(41.6, 'chat', -12); sfx(42.7, 'chat', -12); sfx(QUIT, 'poof', -11); sfx(BACK, 'join', -11);
  // 上期视频的结尾 他贱兮兮地补了一句 做码农挺好
  shot(46.7, 51.1, { day: 0, snow: true, fog: [24, 60], keys: [K(46.7, [71.8, 20.6, 69.8], [71.8, 18.8, 64.5], 66), K(51.1, [71.8, 20.2, 68.6], [71.8, 18.8, 64.5], 60)],
    act: t => { clawd(69.9, G + 1, 64.5, { ...emotions(t, [[46.7, 'neutral'], [nb(49.65), 'playful']]), view: 'q' }); heige(73.6, G + 1, 64.5, { ...emotions(t, [[46.7, 'neutral'], [50.2, 'confused']]), view: 'q', flip: true });
      bubble(69.9, G + 2.2, 64.5, '做码农挺好', t, nb(49.65), 51.1); },
    ui: (c, t) => tagUI(c, '上期回顾', t < 49.5 ? 1 : 0) });
  sfx(nb(49.65), 'pop', -10);
  // 评论区很多码农现身 / 整理出来三条理由 / 解释这行到底好在哪
  const CODERS = Array.from({ length: 10 }, (_, i) => ({ x: 141 + (i % 5) * 2.4 + (i > 4 ? 1.2 : 0), z: i > 4 ? 107.2 : 109.0, t0: nb(51.4 + i * .17) + (i % 2) * BT / 2, tint: ['blue', 'gold', 'pale', 'rosy', null][i % 5], name: '码农' + 'ABCDEFGHIJ'[i] }));
  const COMMENTS = ['加班到吐', '还爱写代码', '离不开了', '沉没成本', '被需要', '上头', '修 bug 真爽', '舍不得'];
  const commentText = t => COMMENTS.forEach((txt, i) => label(141.5 + (i % 4) * 3, G + 2.0 + (i < 4 ? 1.1 : 0), 111.96, txt, .3, '#3A1E10', t, 0));
  shot(51.1, 59.2, { day: 0, snow: true, fog: [26, 64], keys: [K(51.1, [146.0, 21.4, 99.4], [146.0, 19.2, 111.0], 66), K(53.2, [146.0, 20.8, 100.4], [146.0, 19.0, 108.0], 64), K(55.0, [155.0, 21.2, 103.0], [156.0, 20.4, 92.0], 64), K(59.2, [156.0, 21.0, 101.6], [156.0, 20.4, 92.0], 60)],
    act: t => { for (const C of CODERS) if (t >= C.t0) clawd(C.x, G + 1, C.z, { ...feel(['happy', 'excited', 'proud', 'cool', 'neutral'][Math.floor(hh(C.x) * 5)], t + C.x), view: 'front', tint: C.tint, tintK: .35 }, { tag: C.name, a: Math.min(1, (t - C.t0) * 6) });
      commentText(t); PILL.forEach(([x, , name], i) => label(x + .5, G + 4.75, PZ + .5, name, .5, '#FFD34E', t, PLIT[i])); } });
  CODERS.forEach(C => sfx(C.t0, 'join', -16)); PLIT.forEach(t => sfx(t, 'ding', -9));
  // 我朋友也看了评论区 回了我4个字 一字不差
  shot(59.2, 63.3, { day: 0, snow: true, fog: [26, 64], keys: [K(59.2, [146.5, 19.9, 104.4], [146.5, 19.4, 112.0], 60), K(63.3, [146.5, 19.6, 105.6], [146.5, 19.4, 112.0], 54)],
    act: t => { clawd(146.5, G + 1, 109.2, { ...feel('thinking', t), view: 'back' }); commentText(t); },
    ui: (c, t) => { chatLines(c, t, [[61.2, [['<码农朋友> 一字不差', '#FFFFFF']]]]); slam(c, t, nb(62.15), 63.3, '一字不差', '#FFD34E', 170, 330); } });
  sfx(61.2, 'chat', -11); sfx(nb(62.15), 'boom', -9);
  // 一个被骂了十年的行业 凭什么还留得住人: over the whole world at night
  shot(63.3, 67.0, { day: .12, snow: true, fog: [40, 95], keys: [K(63.3, [96, 30, 104], [72, 18, 72], 64), K(67.0, [84, 28, 100], [64, 18, 66], 64)] });
  // 今天就把这三条理由摊开讲 / 文末送你三个问题
  shot(67.0, 72.7, { day: 0, snow: true, fog: [26, 64], keys: [K(67.0, [150.0, 20.8, 101.0], [154.0, 20.4, 92.0], 64), K(72.7, [161.0, 20.6, 101.0], [158.0, 20.4, 92.0], 64)],
    act: t => PILL.forEach(([x, , name]) => label(x + .5, G + 4.75, PZ + .5, name, .5, '#FFD34E', t, 67.0)),
    ui: (c, t) => toast(c, t, nb(69.8), 72.6, '文末福利', '三个问题 一测就知道', 'book') });
  sfx(nb(69.8), 'toast', -10);
  // 你留在现在这行 到底是真爱 还是被拴住了
  const LOVE = nb(74.3), TIED = nb(75.5);
  shot(72.7, 77.0, { day: 0, snow: true, fog: [26, 64], keys: [K(72.7, [155.2, 20.2, 102.6], [155.2, 18.9, 96.5], 62), K(77.0, [155.2, 20.0, 101.6], [155.2, 18.9, 96.5], 58)],
    act: t => { clawd(152.8, G + 1, 96.6, { ...feel(t > LOVE ? 'love' : 'neutral', t), view: 'front' }); clawd(157.4, G + 1, 96.8, { ...feel(t > TIED ? 'sad' : 'neutral', t), view: 'front', dx: t > TIED ? .25 * Math.sin(t * 9) : 0 });
      if (t > TIED - .2) rope(157.8, G + 1.4, 96.8, 159.0, G + 2.6, 96.5);
      label(152.8, G + 2.6, 96.6, '真爱', .45, '#FFB0C8', t, LOVE); label(157.4, G + 2.6, 96.8, '被拴住', .45, '#C8D0E8', t, TIED); } });
  sfx(LOVE, 'pop', -10); sfx(TIED, 'thud', -10);

  // ---------------------------------------------------------------- 第一个理由：真有兴趣
  shot(77.0, 79.5, { day: 0, keys: [K(77.0, [65.6, 19.6, 66.2], [62.7, 18.7, 64.8], 60), K(79.5, [65.2, 19.4, 65.6], [62.7, 18.7, 64.8], 56)],
    act: t => clawd(62.7, G + 1, 64.6, { ...feel('happy', t), view: 'q', flip: true }),
    ui: (c, t) => titleCard(c, t, 77.03, 79.4, '第一个理由', '真有兴趣') });
  sfx(77.05, 'levelup', -10);
  shot(79.5, 84.4, { day: 0, keys: [K(79.5, [65.0, 19.5, 66.0], [62.7, 18.7, 64.8], 56), K(84.4, [64.6, 19.3, 65.6], [62.7, 18.7, 64.8], 52)],
    act: t => clawd(62.7, G + 1, 64.6, { ...feel('thinking', t), view: 'front' }),
    ui: (c, t) => bookUI(c, t, 79.55, 84.3, ['不反感写代码', '这是我们', '一辈子的原罪'], '评论区一位同行') });
  sfx(79.6, 'page', -9);
  const FLIP = []; for (let t = nb(84.6); t < 89; t += BT) FLIP.push(t);
  shot(84.4, 89.1, { day: 0, keys: [K(84.4, [64.7, 19.1, 63.3], [62.7, 18.6, 64.6], 52), K(89.1, [64.2, 18.9, 63.9], [62.7, 18.6, 64.6], 46)], kicks: FLIP.map(t => [t, .25]),
    act: t => clawd(62.7, G + 1, 64.6, { ...emotions(t, FLIP.map((f, i) => [f, i % 2 ? 'laugh' : 'furious'])), view: 'front' }) });
  // 他给我描述过那个瞬间 / 一个 bug 查了整整一天 / 日志翻到眼睛发直 头发掉了一把
  const cX = t => 100.6 + CHOPS.filter(c => t > c).length * .95;
  shot(89.1, 95.7, { day: 0, fog: [16, 36], keys: [K(89.1, [96.4, 6.7, 75.5], [104, 5.6, 75.5], 70), K(95.7, [98.6, 6.6, 75.5], [107, 5.7, 75.5], 66)], kicks: CHOPS.map(t => [t, .35]),
    act: t => { const x = cX(t);
      clawd(x, 5, 75.5, { ...emotions(t, [[89.1, 'determined'], [93.6, 'nervous'], [94.6, 'dizzy']]), view: 'side' }, { sword: swing(t, CHOPS) });
      if (t > 94.9) for (let i = 0; i < 8; i++) { const a = (t - 94.9 - i * .07); if (a > 0 && a < 1.2) VX.pt(x - .2 + hh(i) * .5, 6.3 - a * 1.1, 75.5 + (hh(i, 2) - .5) * .4, .05, [30, 24, 34]); } },
    ui: (c, t) => { clockUI(c, hhmm(lerp(9, 23.9, seg01(t, 89.3, 95.5))), 1); CHOPS.forEach(h => floatTxt(c, t, h, '日志 +1', 1100, 420)); } });
  CHOPS.forEach(h => sfx(h, 'break', -8));
  // 突然定位到那一行 / 改一个字符 / 跑通 绿灯一亮
  shot(95.7, 99.9, { day: 0, fog: [16, 40], keys: [K(95.7, [102.0, 6.6, 75.5], [108.5, 6.4, 75.5], 64), K(nb(96.1), [105.4, 6.5, 75.9], [108.5, 6.4, 75.5], 44), K(98.0, [105.6, 6.6, 75.9], [108.5, 6.4, 75.5], 46), K(99.9, [102.5, 7.2, 75.5], [116, 6.6, 75.5], 66)],
    kicks: [[nb(96.1), 1], [FIX, .6], [RUN, .8]],
    act: t => clawd(106.9, 5, 75.5, { ...emotions(t, [[95.7, 'surprised'], [FIX - .2, 'determined'], [RUN, 'excited']]), view: 'side' }),
    ui: (c, t) => slam(c, t, nb(96.1), 97.1, '就是这一行', '#FF8A6A', 120, 300) });
  sfx(nb(96.1), 'boom', -9); sfx(FIX, 'place', -7); TUN_LAMPS.forEach((_, i) => sfx(RUN + i * BT / 4, 'tick', -12)); sfx(RUN, 'powerup', -9);
  // 他半夜一个人在工位上 直接吼了一嗓子 卧槽牛逼
  const YELL = nb(103.15);
  shot(99.9, 104.4, { day: 0, keys: [K(99.9, [66.4, 20.0, 67.2], [62.7, 18.9, 64.6], 64), K(YELL, [65.3, 19.4, 66.0], [62.7, 18.8, 64.6], 56), K(104.4, [64.9, 19.3, 65.6], [62.7, 18.9, 64.6], 52)], kicks: [[YELL, 1.4]],
    act: t => { clawd(62.7, G + 1, 64.6, { ...emotions(t, [[99.9, 'determined'], [YELL - .1, 'excited']]), view: 'front', dy: t > YELL ? -1.4 * Math.abs(Math.sin((t - YELL) * 7)) * Math.exp(-(t - YELL) * 1.2) : 0 });
      if (t > YELL) firework(62.7, G + 2.8, 64.6, t - YELL); },
    ui: (c, t) => slam(c, t, YELL, 104.4, '牛X！', '#FFD34E', 230, 300) });
  sfx(YELL, 'firework', -8); sfx(YELL + .35, 'firework', -11);
  // 那一下 什么加班 什么35岁 全他妈忘了: the status effects pop off
  const UNE = [nb(105.2), nb(106.3)];
  shot(104.4, 108.0, { day: 0, keys: [K(104.4, [64.4, 19.0, 63.8], [62.7, 18.7, 64.6], 46), K(108.0, [64.0, 18.9, 64.2], [62.7, 18.7, 64.6], 42)],
    act: t => clawd(62.7, G + 1, 64.6, { ...feel('starstruck', t), view: 'front' }),
    ui: (c, t) => effects(c, t, [['加班', '#E83A44', UNE[0]], ['35岁', '#E8A93A', UNE[1]], ['焦虑', '#7A4AA8', UNE[1] + .3]]) });
  UNE.forEach(t => sfx(t, 'poof', -10));
  // 就像游戏里打了一整晚的 Boss / 血条见底的那一下 / 手都在抖
  const BHIT = [108.65, 109.3, 109.95, 110.6, 111.25].map(nb), BDIE = nb(112.9);
  const bossHP = t => t > BDIE ? 0 : Math.max(.04, 1 - BHIT.filter(h => t > h).length * .19);
  shot(108.0, 112.75, { day: 0, embers: true, fog: [20, 48], keys: [K(108.0, [78.2, 6.6, 83.4], [82.0, 6.6, 71.5], 68), K(112.75, [77.6, 6.3, 82.6], [82.0, 6.4, 71.5], 62)], kicks: [...BHIT.map(t => [t, .6]), [nb(111.6), 1.3]],
    act: t => { const hurt = BHIT.some(h => t > h && t < h + .15), shake = t > nb(111.6) ? .07 * Math.sin(t * 60) : 0;
      VX.sprite(bugImg(t * .7, hurt, true), 83.5 + .3 * Math.sin(t * 2), 5, 70.0, { k: SPK * 12 });
      const jump = BHIT.reduce((m, h) => Math.max(m, t > h - .3 && t < h + .1 ? Math.sin(Math.PI * seg01(t, h - .3, h + .1)) : 0), 0);
      clawd(80.0 + shake, 5, 77.0, { ...feel(t > nb(111.6) ? 'nervous' : 'determined', t), view: 'front', dy: -jump * 2.2 }, { sword: swing(t, BHIT) }); },
    ui: (c, t) => bossBar(c, t, 'BUG 之王', bossHP(t)) });
  BHIT.forEach(h => sfx(h, 'hit', -7)); sfx(108.1, 'roar', -9); sfx(nb(110.2), 'alarm', -16);
  // 这种爽 一旦染上 戒不掉 所以才叫原罪
  shot(112.75, 117.3, { day: 0, embers: true, fog: [20, 48], keys: [K(112.75, [77.6, 6.3, 82.6], [81.5, 6.2, 73.0], 62), K(117.3, [82.6, 6.5, 81.0], [80.0, 5.7, 77.0], 54)], kicks: [[BDIE, 1.6]],
    act: t => { if (t < BDIE + .1) VX.sprite(bugImg(t, true, true), 83.5, 5, 70.0, { k: SPK * 12, a: 1 - seg01(t, BDIE, BDIE + .1) });
      clawd(80.0, 5, 77.0, { ...feel(t > BDIE + .3 ? 'proud' : 'determined', t), view: 'front' }, { sword: .5 });
      const a = t - BDIE; if (a > 0) for (let i = 0; i < 40; i++) { const u = clamp01(a / 1.3 - hh(i) * .3); const sx = 83.5 + (hh(i, 1) - .5) * 4, sy = 7 + hh(i, 2) * 3, sz = 70 + (hh(i, 3) - .5) * 3;
        if (u < 1) VX.pt(lerp(sx, 80, sm(u)), lerp(sy, 6, sm(u)) + Math.sin(u * 3) * .8, lerp(sz, 77, sm(u)), .1, [255, 210, 90], true); }
      if (t > BDIE + .8) for (let i = 0; i < 18; i++) { const ph = t * 1.3 + i * .35; VX.pt(80 + Math.cos(ph * 2 + i) * .7, 5.2 + (ph * .9 % 1.6), 77 + Math.sin(ph * 2 + i) * .5, .05, [190, 140, 255], true); } },
    ui: (c, t) => { if (t < BDIE + .3) bossBar(c, t, 'BUG 之王', bossHP(t)); effects(c, t, [['原罪 ∞', '#B48CF0', -1, nb(115.1)]]); } });
  sfx(BDIE, 'boom', -6); sfx(BDIE + .4, 'xp', -10); sfx(BDIE + .7, 'xp', -12); sfx(nb(115.1), 'magic', -10);

  // ---------------------------------------------------------------- 第二个理由：投入太大 舍不得放
  shot(117.3, 120.4, { day: 0, snow: true, fog: [30, 70], keys: [K(117.3, [58, 23.5, 82], [64, 20, 64], 62), K(120.4, [70, 23.5, 82], [64, 20, 64], 62)],
    ui: (c, t) => titleCard(c, t, 117.45, 120.3, '第二个理由', '投入太大 舍不得放') });
  sfx(117.45, 'levelup', -10);
  const INV = [[nb(120.6), '时间', '10 年', 'clock'], [nb(121.5), '精力', '10 年', 'bolt'], [nb(122.45), '熬过的夜', '3650', 'moon'], [nb(123.6), '八股文', '999', 'book']], THROW = nb(124.6);
  shot(120.4, 126.2, { day: 0, snow: true, fog: [30, 70], keys: [K(120.4, [64, 20.4, 76.2], [64, 19.3, 66], 60), K(126.2, [64, 27, 92], [64, 18, 62], 66)],
    act: t => { clawd(64.0, G + 1, 71.5, { ...feel(t > THROW ? 'excited' : 'proud', t), view: 'front' });
      const a = t - THROW; if (a > 0 && a < 1.5) INV.forEach((_, i) => { const u = clamp01(a / 1.2); VX.pt(lerp(64, 61 + i * 2, u), G + 2 + Math.sin(u * Math.PI) * 3 - u * 1.5, lerp(71.5, 64, u), .25, [[242, 193, 78], [255, 220, 120], [120, 120, 200], [216, 161, 58]][i], true); }); },
    ui: (c, t) => inventory(c, t, INV, THROW) });
  INV.forEach(([t]) => sfx(t, 'pickup', -9)); sfx(THROW, 'whoosh', -10);
  // 码农的经验 充其量叫缓存 / 可缓存再不值钱: the cabin flickers into code
  const GLITCH = []; for (let t = nb(128.3); t < 131.4; t += BT / 2) GLITCH.push(t);
  shot(126.2, 131.5, { day: 0, snow: true, fog: [26, 64], keys: [K(126.2, [71.5, 20.6, 78.0], [64.5, 19.4, 67.5], 64), K(131.5, [72.6, 20.3, 75.6], [64.5, 19.4, 67.5], 58)],
    pre: t => { if (GLITCH.some(g => t >= g && t < g + BT / 4)) { VX.remap(B.plank, B.code); VX.remap(B.roof, B.code); VX.remap(B.log, B.code); } },
    act: t => clawd(66.0, G + 1, 72.0, { ...feel('thinking', t), view: 'q', flip: true }),
    ui: (c, t) => label2(c, t, nb(128.3), '缓存', 960, 260) });
  GLITCH.forEach((g, i) => i % 2 || sfx(g, 'glitch', -15));
  // 那也是他十年一点一点存进去的 / 让他一键清空 手指悬在删除键上 / 怎么也按不下去
  shot(131.5, 139.5, { day: 0, snow: true, fog: [26, 64], keys: [K(131.5, [64, 26, 90], [64, 19, 64], 62), K(139.5, [64, 25, 86], [64, 19, 64], 58)],
    ui: (c, t) => worldUI(c, t, 131.6, nb(134.7), 139.4) });
  sfx(131.6, 'click', -9); sfx(nb(134.7), 'click', -8); for (let t = nb(136.3); t < 139.3; t += BT) sfx(t, 'heart', -10);
  // 我现在跳槽 等于把十年的存档全删了 从新手村重新打
  shot(139.5, 146.0, { day: t => t < 144 ? 0 : 1, moon: [.4, .7, .3], fog: t => t < 144 ? [26, 64] : [40, 90], snow: true,
    keys: [K(139.5, [64, 26, 90], [64, 19, 64], 58), K(143.9, [64, 25.5, 88], [64, 19, 64], 58), K(144.0, [181.2, 19.3, 92.2], [181.2, 18.8, 86.0], 60), K(146.0, [181.2, 19.1, 91.0], [181.2, 18.8, 86.0], 54)],
    act: t => { if (t > 144) { clawd(181.2, G + 1, 86.6, { ...feel('nervous', t), view: 'front' }, { sword: .3, tag: 'Lv.1 码农' }); vill(178.8, G + 1, 85.8, '村民', 'happy'); label(172.5, G + 2.8, 84.6, '新手村', .55, '#FFF2C8', t, 144); } },
    ui: (c, t) => { if (t < 144) worldUI(c, t, 139.5, -1, 144, { deleted: nb(141.9) }); else toast(c, t, 144.3, 146.0, '新手任务', '砍一棵树', 'axe'); } });
  sfx(nb(141.9), 'break', -8); sfx(144.0, 'whoosh', -10); sfx(144.3, 'toast', -10);
  // 就像一个练了十年的网游账号 / 装备练满了 / 等级到顶了
  const ARM = nb(148.2), MAX = nb(149.2);
  shot(146.0, 151.0, { day: 0, snow: true, fog: [24, 60], keys: [K(146.0, [69.8, 19.8, 70.2], [70.4, 18.9, 64.6], 60), K(151.0, [70.0, 19.6, 68.8], [70.4, 18.9, 64.6], 54)], kicks: [[ARM, .6], [MAX, .8]],
    act: t => clawd(70.4, G + 1, 64.6, { ...feel(t > MAX ? 'proud' : 'cool', t), view: 'front' }, { armor: t > ARM, crown: t > MAX }),
    ui: (c, t) => levelUI(c, t, t < MAX ? 'Lv.99' : 'Lv.MAX', t > MAX ? 1 : .9) });
  sfx(ARM, 'armor', -8); sfx(MAX, 'levelup', -8);
  // 明知道这个服务器迟早要关服 / 你让他弃号 他真他妈舍不得
  const SHUT = nb(151.2);
  shot(151.0, 155.0, { day: 0, fog: t => [lerp(24, 6, seg01(t, SHUT, 154.8)), lerp(60, 14, seg01(t, SHUT, 154.8))], snow: true, keys: [K(151.0, [70.0, 19.6, 68.8], [70.4, 18.8, 64.6], 54), K(155.0, [70.2, 19.4, 67.8], [70.4, 18.7, 64.6], 50)],
    act: t => { clawd(70.4, G + 1, 64.6, { ...feel(t > nb(153.3) ? 'cry' : 'sad', t), view: 'front' }, { armor: true }); VX.sprite(chestImg, 69.6, G + 1, 64.9, { k: .045 }); },
    ui: (c, t) => chatLines(c, t, [[SHUT, [['[服务器] 本服务器将于 7 天后关闭', '#FF6A5A']]]]) });
  sfx(SHUT, 'alarm', -13); sfx(nb(153.3), 'sad', -10);

  // ---------------------------------------------------------------- 第三个理由：最扎心
  shot(155.0, 160.4, { day: 0, snow: true, fog: [26, 64], keys: [K(155.0, [146.0, 21.0, 88.0], [146.0, 20.0, 76.0], 62), K(160.4, [146.0, 20.2, 85.0], [146.0, 19.6, 76.0], 56)],
    act: t => clawd(146.0, G + 1, 80.6, { ...feel('neutral', t), view: 'front' }),
    ui: (c, t) => { titleCard(c, t, 155.1, 157.9, '第三个理由', '最扎心'); label2(c, t, 158.1, '尊重', 960, 300); } });
  sfx(155.1, 'levelup', -10);
  const DIS = [[nb(161.4), '测试', '代码烂！', 64.4, 63.0], [nb(162.95), '产品', '改得慢！', 65.4, 65.4], [nb(164.5), '项目经理', '估时太长！', 64.2, 66.7]], REQ = [nb(166.7), nb(167.95), nb(169.2)];
  shot(160.4, 170.4, { day: 0, keys: [K(160.4, [66.8, 20.4, 67.6], [63.4, 18.9, 64.4], 72), K(170.4, [66.4, 20.2, 67.2], [63.0, 18.9, 64.6], 66)], kicks: DIS.map(d => [d[0], .4]),
    act: t => { clawd(62.7, G + 1, 64.6, { ...emotions(t, [[160.4, 'neutral'], [161.4, 'sad'], [nb(168.9), 'happy', { emote: 'sweat' }]]), view: 'front' });
      DIS.forEach(([t0, role, txt, x, z]) => { vill(x, G + 1, z, role, t > t0 ? 'angry' : 'neutral'); bubble(x, G + 2.3, z, txt, t, t0, t0 + 2.6); }); },
    ui: (c, t) => reqCard(c, t, REQ, 170.3) });
  DIS.forEach(([t]) => sfx(t, 'grunt', -9)); REQ.forEach(t => sfx(t, 'flip', -10));
  // 可是一旦线上出事 半夜系统挂了 你看群里什么样
  shot(170.4, 174.5, { day: 0, snow: true, fog: [24, 60], keys: [K(170.4, [160.0, 19.8, 80.5], [160.0, 19.2, 68.0], 62), K(174.5, [160.0, 19.6, 78.6], [160.0, 19.0, 68.0], 56)], kicks: [[BLAST, 2.2]],
    act: t => { if (t > BLAST) { const a = t - BLAST; for (let i = 0; i < 50; i++) if (a < 1.4) VX.pt(160.5 + (hh(i) - .5) * 6 * a, G + 1.5 + hh(i, 2) * 4 * a - 4 * a * a, 71.5 + (hh(i, 3) - .5) * 6 * a, .14, i % 3 ? [70, 66, 80] : [255, 150, 60], i % 3 === 0);
        if (Math.floor(t * 3) % 2 === 0) for (const x of [158, 160, 162]) VX.light(x + .5, G + 3.5, 69.5, [1, .25, .2], 7, 1.4); } },
    ui: (c, t) => { if (t > BLAST && Math.floor(t * 3) % 2 === 0) { c.fillStyle = 'rgba(200,30,40,.18)'; c.fillRect(0, 0, 1920, 1080); } } });
  sfx(nb(170.7), 'fuse', -10); sfx(BLAST, 'boom', -4); sfx(BLAST + .2, 'alarm', -10); sfx(BLAST + 1.5, 'alarm', -12);
  // 产品经理亲自打电话 测试说辛苦了 项目经理发红包 / 全公司的人排着队艾特他 大佬看看
  const CALL = nb(174.75), THX = nb(176.0), RED = nb(177.25), QUEUE = 178.5;
  shot(174.5, 181.6, { day: 0, snow: true, fog: [30, 70], keys: [K(174.5, [65.6, 19.5, 66.4], [62.7, 18.8, 64.6], 58), K(QUEUE - .01, [65.4, 19.4, 66.0], [62.7, 18.8, 64.6], 54), K(QUEUE, [71, 27, 101], [64, 18, 78], 64), K(181.6, [70, 25, 95], [64, 18, 74], 62)],
    act: t => { if (t < QUEUE) clawd(62.7, G + 1, 64.6, { ...feel(t < THX ? 'surprised' : 'nervous', t), view: 'front' });
      else for (let i = 0; i < 16; i++) vill(63.9 + (i % 2) * .3, G + 1, 70.6 + i * 1.5, ['测试', '产品', '项目经理', '村民'][i % 4], 'shout', { tag: '@码农朋友' }); },
    ui: (c, t) => { phoneUI(c, t, CALL, THX + .2, '产品经理'); chatPanel(c, t, '工作群', [[THX, '测试', '辛苦了大佬'], [RED, '项目经理', '[红包] 大佬辛苦'], ...Array.from({ length: 12 }, (_, i) => [QUEUE + .2 + i * .22, ['测试', '产品经理', '运营', '项目经理'][i % 4], '@码农朋友 大佬看看'])]); } });
  sfx(CALL, 'ring', -10); sfx(CALL + .6, 'ring', -12); sfx(THX, 'chat', -11); sfx(RED, 'coin', -9); for (let i = 0; i < 12; i += 2) sfx(QUEUE + .2 + i * .22, 'chat', -14);
  // 什么测试 什么项目经理 什么产品 最后都得求着找过来 / 再不满意 问题也得解决
  const BOWS = [nb(182.0), nb(182.7), nb(183.6)];
  shot(181.6, 188.4, { day: 0, snow: true, fog: [26, 64], keys: [K(181.6, [66.8, 21.4, 76.6], [64.0, 18.6, 70.4], 62), K(188.4, [66.0, 21.0, 75.6], [64.0, 18.6, 70.4], 58)],
    act: t => { clawd(64.0, G + 1, 69.9, { ...feel('cool', t), view: 'front' });
      [['测试', 62.6, 72.6], ['项目经理', 64.0, 73.0], ['产品', 65.4, 72.6]].forEach(([r, x, z], i) => vill(x, G + 1, z, r, t > BOWS[i] ? 'bow' : 'neutral', { bow: t > BOWS[i] ? 1 : 0 })); } });
  BOWS.forEach(t => sfx(t, 'thud', -12));
  // 我朋友说那一小时 是他一整年里腰杆最硬的一小时
  shot(188.4, 193.6, { day: 0, snow: true, fog: [26, 64], keys: [K(188.4, [64.0, 18.6, 76.6], [64.0, 20.0, 72.6], 60), K(193.6, [64.0, 18.7, 75.6], [64.0, 20.2, 72.6], 54)],
    act: t => clawd(64.0, G + 2, 73.5, { ...feel('proud', t), view: 'front' }, { crown: true }),
    ui: (c, t) => timerUI(c, t, 188.6) });
  sfx(nb(188.6), 'powerup', -9);
  // 可他又补了一句 说得我后背发凉 / 公司尊重的是每分钟损失多少钱 / 他只是刚好站在那笔钱前面
  shot(193.6, 202.8, { day: 0, snow: true, fog: [30, 72], keys: [K(193.6, [64.0, 19.2, 76.4], [64.0, 20.0, 72.0], 56), K(PILE, [64.0, 20.0, 79.0], [64.0, 19.8, 71.0], 60), K(202.8, [64.0, 23.0, 86.0], [64.0, 19.4, 71.0], 62)],
    act: t => { clawd(64.0, G + 2, 73.5, { ...feel(t > nb(194.2) ? 'scared' : 'proud', t), view: 'front' }, { crown: t < nb(194.2) });
      if (t > PILE) for (let i = 0; i < 8; i++) vill(i < 4 ? 58.6 + i * 1.3 : 64.6 + (i - 3) * 1.3, G + 1, 76.5 + (i % 3) * .8, ['测试', '产品', '项目经理', '村民'][i % 4], 'happy', { tag: '¥' }); },
    ui: (c, t) => { cold(c, t, 193.9); lossUI(c, t, nb(197.0)); } });
  sfx(PILE, 'coin', -8); sfx(PILE + .4, 'coin', -10); sfx(PILE + .8, 'coin', -12); for (let t = nb(197.0); t < 202.4; t += BT) sfx(t, 'tick', -13);

  // ---------------------------------------------------------------- 两种人
  shot(202.8, 205.2, { day: 0, snow: true, fog: [26, 64], keys: [K(202.8, [156.0, 21.2, 102.6], [156.0, 20.4, 92.0], 64), K(205.2, [156.0, 21.0, 101.4], [156.0, 20.4, 92.0], 60)],
    act: t => PILL.forEach(([x, , name]) => label(x + .5, G + 4.75, PZ + .5, name, .5, '#FFD34E', t, 202.8)) });
  const PORT = []; for (let t = nb(208.1); t < 212; t += BT * 2) PORT.push(t);
  shot(205.2, 212.1, { day: 0, snow: true, fog: [26, 64], keys: [K(205.2, [161.8, 20.6, 107.0], [161.6, 19.8, 100.0], 62), K(212.1, [160.6, 20.2, 105.6], [161.6, 19.8, 100.0], 58)],
    act: t => { const past = PORT.filter(p => t > p), inside = past.length % 2 === 1, last = past[past.length - 1] || 0;
      if (!inside || t - last < .2) clawd(161.6, G + 1, 101.6 + (inside ? -(t - last) * 4 : 0), { ...feel('excited', t), view: inside ? 'back' : 'front' }, { a: inside ? 1 - (t - last) * 5 : Math.min(1, last ? (t - last) * 6 : 1) });
      label(161.6, G + 6.3, 100.5, '打副本', .55, '#E8C8FF', t, nb(208.1));
      if (past.length) for (let i = 0; i < 10; i++) { const a = (t * .8 + i * .1) % 1; VX.pt(161.6 + Math.cos(i * 2) * .8, G + 1 + a * 2, 101.4, .06, [255, 210, 90], true); } },
    ui: (c, t) => { if (PORT.some(p => t > p)) effects(c, t, [['上瘾', '#B48CF0', -1, PORT[0]]]); } });
  PORT.forEach(t => sfx(t, 'portal', -11));
  const PULL = [nb(214.2), nb(215.5), nb(216.8)];
  shot(212.1, 217.2, { day: 0, fog: [14, 32], keys: [K(212.1, [154.4, 6.4, 129.2], [157.6, 5.0, 126.0], 64), K(217.2, [154.8, 6.2, 128.8], [157.8, 5.0, 126.0], 58)], kicks: PULL.map(t => [t, .5]),
    act: t => { const tug = PULL.reduce((m, p) => Math.max(m, t > p - .45 && t < p ? seg01(t, p - .45, p) : t >= p && t < p + .25 ? 1 - seg01(t, p, p + .25) : 0), 0);
      const x = 157.4 + tug * 1.6; clawd(x, 4, 126.0, { ...feel(tug > .2 ? 'determined' : 'sad', t), view: 'side' });
      rope(x - .3, 4.5, 126.0, 155.5, 5.6, 126.4, tug > .9 ? 0 : .35);
      label(160.5, 7.9, 125.0, '卡副本', .5, '#C8D0E8', t, 212.6);
      VX.light(160, 6, 126, [.6, .35, 1], 9, 1.0); } });
  PULL.forEach(t => sfx(t, 'thud', -10));
  const JA = nb(221.1), JB = nb(221.75);
  shot(217.2, 223.0, { day: 0, snow: true, fog: [26, 64], keys: [K(217.2, [161.6, 19.8, 108.2], [161.6, 19.0, 103.0], 58), K(223.0, [161.6, 19.6, 107.0], [161.6, 19.0, 103.0], 52)],
    act: t => { clawd(160.3, G + 1, 103.4, { ...feel('neutral', t), view: 'front' }, { tag: '码农A' }); clawd(162.9, G + 1, 103.4, { ...feel('neutral', t + .3), view: 'front' }, { tag: '码农B' }); },
    ui: (c, t) => chatLines(c, t, [[JA, [['码农A 加入了游戏', '#FFE070']]], [JB, [['码农B 加入了游戏', '#FFE070']]]]) });
  sfx(JA, 'join', -11); sfx(JB, 'join', -11);
  shot(223.0, 229.2, { day: 0, snow: true, fog: [26, 64], keys: [K(223.0, [160.0, 19.7, 109.4], [160.0, 19.0, 104.5], 54), K(229.2, [160.0, 20.4, 112.0], [160.0, 19.0, 104.5], 64)],
    act: t => { heige(160.0, G + 1, 104.6, { ...emotions(t, [[223, 'idea'], [225.5, 'happy']]), view: 'front' });
      for (let i = 0; i < 6; i++) if (t > 226 + i * .25) { const x = 155.6 + i * 1.8, z = 102.6 - (i % 2) * .8; if (i % 2) vill(x, G + 1, z, ['测试', '产品', '项目经理'][i % 3], 'neutral'); else clawd(x, G + 1, z, { ...feel('neutral', t), view: 'front', tint: ['blue', 'gold', 'pale'][i % 3], tintK: .3 }); } },
    ui: (c, t) => toast(c, t, nb(223.3), 228.8, '测一测', '三个问题 适合所有行业', 'book') });
  sfx(nb(223.3), 'toast', -10);

  // ---------------------------------------------------------------- 三个问题 (the fork: the left gate is yes, the right gate no)
  const GATE_L = [186.5, G + 1, 90.0], GATE_R = [186.5, G + 1, 101.0];
  const gateSigns = (t, l, r) => { label(186.5, G + 4.0, 90.5, l, .42, '#FFE6A6', t, 0); label(186.5, G + 4.0, 100.5, r, .42, '#FFC0B8', t, 0); };
  const toGate = (t, t0, t1, gate) => { const u = sm(seg01(t, t0, t1)); return u < .5 ? [lerp(181, 186.5, u * 2), G + 1, 95.5] : [186.5, G + 1, lerp(95.5, gate[2] + (gate[2] < 95 ? .9 : -.9), (u - .5) * 2)]; };
  function quiz(qt, q, n, yes, no, t1) {
    shot(qt, t1, { day: 0, snow: true, fog: [30, 70], keys: [K(qt, [175.0, 21.0, 95.5], [188.0, 19.4, 95.5], 74), K(t1, [177.0, 20.8, 95.5], [188.0, 19.4, 95.5], 72)],
      act: t => { gateSigns(t, yes, no); clawd(181, G + 1, 95.5, { ...feel('thinking', t), view: 'back' }); },
      ui: (c, t) => questionCard(c, t, qt + .05, t1 - .2, n, q) });
    sfx(qt + .05, 'levelup', -11);
  }
  const walkTo = (t, t0, t1, gate, mood, viewAfter) => { const p = toGate(t, t0, t1, gate); clawd(p[0], p[1], p[2], { ...feel(mood, t), view: t < (t0 + t1) / 2 ? 'side' : viewAfter, walk: t < t1 ? t / (2 * BT) : null }); return p; };
  quiz(229.2, '工资砍一半 你还愿意干这行吗', '第一问', '愿意', '不愿意', 233.9);
  shot(233.9, 237.3, { day: 0, snow: true, fog: [30, 70], keys: [K(233.9, [180.0, 20.8, 95.5], [188.0, 19.0, 92.0], 66), K(237.3, [182.0, 20.8, 95.0], [187.0, 19.0, 90.0], 62)],
    act: t => { gateSigns(t, '愿意', '不愿意'); walkTo(t, 234.0, 235.6, GATE_L, 'love', 'back'); },
    ui: (c, t) => toast(c, t, nb(235.0), 237.2, '成就达成', '真爱型玩家', 'heart') });
  sfx(nb(235.0), 'toast', -9);
  shot(237.3, 243.4, { day: 0, snow: true, fog: [30, 70], keys: [K(237.3, [180.0, 20.8, 96.0], [188.0, 19.0, 99.0], 66), K(243.4, [182.4, 20.6, 96.5], [187.0, 19.0, 101.0], 60)],
    act: t => { gateSigns(t, '愿意', '不愿意'); const p = walkTo(t, 237.4, 239.0, GATE_R, t > 240 ? 'sad' : 'neutral', 'front'); if (t > nb(240.1)) rope(p[0] + .2, G + 1.4, p[2], 188, G + 2.4, 101.0); },
    ui: (c, t) => { crossOut(c, t, nb(238.3), '兴趣'); toast(c, t, nb(240.1), 243.3, '称号获得', '签到打工人', 'clock', '#E83A44'); } });
  sfx(nb(238.3), 'scratch', -9); sfx(nb(240.1), 'toast', -10);
  quiz(243.4, '这十年重新来过 你还会选这行吗', '第二问', '会', '不会', 246.5);
  shot(246.5, 249.6, { day: 0, snow: true, fog: [30, 70], keys: [K(246.5, [180.0, 20.8, 95.5], [188.0, 19.0, 92.0], 66), K(249.6, [182.0, 20.8, 95.0], [187.0, 19.0, 90.0], 62)],
    act: t => { gateSigns(t, '会', '不会'); walkTo(t, 246.6, 248.2, GATE_L, 'proud', 'back'); },
    ui: (c, t) => toast(c, t, nb(247.8), 249.5, '成就达成', '十年没白熬', 'star') });
  sfx(nb(247.8), 'toast', -9);
  const SINK = [nb(253.8), nb(254.9)], STOP = nb(255.75);
  shot(249.6, 257.1, { day: 0, embers: t => t > 252, fog: t => t < 252 ? [30, 70] : [20, 48], snow: t => t < 252,
    keys: [K(249.6, [180.0, 20.8, 96.0], [188.0, 19.0, 99.0], 66), K(251.9, [181.8, 20.6, 96.5], [187.0, 19.0, 101.0], 62), K(252.0, [77.4, 7.0, 77.6], [72.6, 4.2, 72.6], 62), K(257.1, [77.0, 6.8, 76.8], [72.6, 4.2, 72.6], 56)],
    act: t => { if (t < 252) { gateSigns(t, '会', '不会'); walkTo(t, 249.7, 251.3, GATE_R, 'sad', 'front'); }
      else { clawd(75.0, 5, 72.6, { ...feel(t > STOP ? 'surprised' : 'determined', t), view: 'side', flip: true });
        SINK.forEach((s, i) => { const a = t - s + .55; if (a > 0) { const u = clamp01(a / .55); const y = a < .55 ? 5.6 + Math.sin(u * Math.PI) * 1.2 - u * 1.8 : 3.8 - (a - .55) * .8; if (y > 1.6) VX.sprite(i ? chestImg : goldImg, lerp(74.6, 71.2, u), y, 72.6, { k: .04 }); } });
        if (t > STOP - .3) VX.sprite(goldImg, 74.4, 5.9, 72.6, { k: .04 }); } },
    ui: (c, t) => { if (t < 252) label2(c, t, 250.2, '等服务器倒闭的老玩家', 960, 280); stamp(c, t, STOP, '别再追加了'); } });
  sfx(252.0, 'whoosh', -10); SINK.forEach(s => sfx(s + .05, 'sizzle', -8)); sfx(STOP, 'boom', -9);
  quiz(257.1, '平时没出事 有人把你当回事吗', '第三问', '有', '只有出事才找你', 260.2);
  shot(260.2, 263.4, { day: 0, snow: true, fog: [30, 70], keys: [K(260.2, [180.0, 20.8, 95.5], [188.0, 19.0, 92.0], 66), K(263.4, [182.0, 20.8, 95.0], [187.0, 19.0, 90.0], 62)],
    act: t => { gateSigns(t, '有', '只有出事才找你'); walkTo(t, 260.3, 261.9, GATE_L, 'happy', 'back');
      if (t > 261.9) [[185.0, '测试'], [188.0, '产品']].forEach(([x, r]) => vill(x, G + 1, 88.4, r, 'happy')); },
    ui: (c, t) => toast(c, t, nb(261.5), 263.3, '成就达成', '这才叫尊重', 'heart') });
  sfx(nb(261.5), 'toast', -9);
  const NPC = nb(266.3);
  shot(263.4, 271.7, { day: 0, snow: true, fog: [30, 70], keys: [K(263.4, [181.0, 20.4, 97.0], [186.5, 19.2, 100.4], 62), K(271.7, [183.0, 19.9, 96.6], [186.5, 19.2, 100.4], 54)],
    act: t => { clawd(186.5, G + 1, 100.0, { ...feel(t > NPC ? 'bored' : 'neutral', t), view: 'front' }, { tag: t > NPC ? 'NPC' : '码农朋友', tagCol: t > NPC ? '#FFE070' : null });
      if (t > NPC) label(186.5, G + 3.1, 100.0, '!', .7, '#FFE070', t, NPC);
      const v = seg01(t, 267.5, 271.5), vx = lerp(180, 184.2, sm(Math.min(1, v * 2))) + (v > .6 ? -(v - .6) * 10 : 0); if (t > 267.5) vill(vx, G + 1, 99.0, '产品', v > .6 ? 'neutral' : 'shout'); } });
  sfx(NPC, 'villager', -9);
  shot(271.7, 280.6, { day: 0, snow: true, fog: [26, 64], keys: [K(271.7, [146.0, 19.9, 84.2], [146.0, 19.0, 79.8], 58), K(280.6, [146.0, 19.6, 83.2], [146.0, 19.0, 79.8], 52)],
    act: t => { clawd(144.8, G + 1, 80.4, { ...feel(t < 275.5 ? 'nervous' : 'thinking', t), view: 'q' }); vill(147.4, G + 1, 80.0, '村民', 'happy', { tag: '猎头' }); },
    ui: (c, t) => tradeUI(c, t, nb(275.9), 280.4) });
  sfx(nb(275.9), 'click', -9); sfx(nb(277.2), 'coin', -11);

  // ---------------------------------------------------------------- 结尾
  shot(280.6, 286.1, { day: 0, snow: true, fog: [24, 60], keys: [K(280.6, [71.8, 19.8, 69.0], [71.6, 18.9, 64.5], 58), K(286.1, [71.6, 19.6, 68.0], [71.6, 18.9, 64.5], 54)],
    act: t => { clawd(69.9, G + 1, 64.5, { ...emotions(t, [[280.6, 'neutral'], [nb(283.6), 'confused']]), view: 'q' }); heige(73.6, G + 1, 64.5, { ...emotions(t, [[280.6, 'thinking'], [284.5, 'laugh']]), view: 'q', flip: true });
      bubble(73.6, G + 2.4, 64.5, '那你到底算哪一种', t, nb(281.0), 283.4); bubble(69.9, G + 2.2, 64.5, '俺也不晓得', t, nb(283.65), 286.1); } });
  const NEWBUG = nb(289.4);
  shot(286.1, 291.6, { day: 0, keys: [K(286.1, [66.4, 19.9, 62.4], [62.6, 18.8, 66.0], 66), K(291.6, [66.0, 19.7, 62.2], [62.6, 18.8, 66.0], 60)],
    act: t => { clawd(62.7, G + 1, 64.6, { ...emotions(t, [[286.1, 'furious'], [NEWBUG + .3, 'determined']]), view: 'front' }, { sword: t > NEWBUG + .3 ? .5 : null }); if (t > NEWBUG) VX.sprite(bugImg(t), 63.6 + .25 * Math.sin(t * 2.3), G + 1, 66.2, { k: .03 }); },
    ui: (c, t) => chatPanel(c, t, '工作群', [[nb(287.2), '码农朋友', '这行真邪门'], [NEWBUG, '产品经理', '@码农朋友 又有个 bug'], [NEWBUG + .5, '码农朋友', '收到', '秒回']]) });
  sfx(nb(287.2), 'chat', -11); sfx(NEWBUG, 'chat', -11); sfx(NEWBUG + .5, 'chat', -10);
  const LV = nb(295.4), LD = nb(296.7);
  shot(291.6, 301.8, { day: 0, snow: true, fog: [24, 60], keys: [K(291.6, [64.0, 19.7, 87.8], [64.0, 19.2, 84.0], 50), K(297.8, [64.0, 19.6, 87.2], [64.0, 19.2, 84.0], 46), K(301.8, [64.0, 20.6, 90.6], [64.0, 19.4, 84.0], 56)],
    act: t => { heige(64.0, G + 1, 84.2, { ...emotions(t, [[291.6, 'cool'], [297.8, 'thinking']]), view: 'front' });
      if (t > 297.9) clawd(65.6, G + 1, 82.6, { ...feel('confused', t), view: 'front' }, { a: Math.min(1, (t - 297.9) * 3) }); },
    ui: (c, t) => { iconPop(c, t, LV, 'heart', '真爱', 560, 420); iconPop(c, t, LD, 'lead', '被拴住', 1360, 420); } });
  sfx(LV, 'pop', -10); sfx(LD, 'pop', -10);
  const NUM = [nb(305.5), nb(306.95), nb(309.35)];
  shot(301.8, 317.4, { day: 0, snow: true, fog: [26, 64], keys: [K(301.8, [150.0, 21.2, 103.4], [154.0, 20.2, 92.0], 64), K(309.8, [158.4, 21.2, 103.4], [157.0, 20.2, 92.0], 64), K(312.3, [156.0, 23.0, 104.4], [156.0, 19.8, 92.0], 66), K(317.4, [156.0, 22.6, 103.6], [156.0, 19.8, 92.0], 62)],
    act: t => { PILL.forEach(([x, , name], i) => label(x + .5, G + 4.75, PZ + .5, `${i + 1} ${name}`, .5, '#FFD34E', t, NUM[i]));
      if (t > 312.3) for (let i = 0; i < 9; i++) clawd(149.6 + i * 1.6, G + 1, 97.0 + (i % 2) * .8, { ...feel(['happy', 'excited', 'proud'][i % 3], t + i), view: 'back', tint: ['blue', 'gold', 'pale', 'rosy', null][i % 5], tintK: .3 }); },
    ui: (c, t) => { if (t > 312.4) chatLines(c, t, Array.from({ length: 14 }, (_, i) => [312.5 + i * .33, [[`<码农${'ABCDEFGHIJKLMN'[i]}> `, '#C8D0E8'], [String(1 + Math.floor(hh(i, 4) * 3)), '#FFD34E']]]), 7); } });
  NUM.forEach(t => sfx(t, 'ding', -9)); for (let i = 0; i < 14; i += 2) sfx(312.5 + i * .33, 'chat', -15);
  const NEXT = 323.6;
  shot(317.4, 331.3, { day: 0, snow: true, fog: [26, 64],
    keys: [K(317.4, [71.6, 20.0, 69.6], [71.6, 18.9, 64.5], 58), K(323.5, [71.6, 19.8, 68.6], [71.6, 18.9, 64.5], 54), K(323.6, [146.0, 21.0, 88.0], [146.0, 19.6, 78.0], 64), K(331.3, [146.0, 20.4, 85.6], [146.0, 19.6, 78.0], 58)],
    act: t => { if (t < NEXT) { clawd(69.9, G + 1, 64.5, { ...feel('happy', t), view: 'q' }); heige(73.6, G + 1, 64.5, { ...feel('happy', t), view: 'q', flip: true }); }
      else { const h = Math.min(9, Math.floor((t - NEXT) / (BT / 2))); vill(148.4, G + 1, 79.0, '甲方', 'shout');
        for (let i = 0; i < h; i++) VX.sprite(goldImg, 149.8, G + 1 + i * .3, 79.4, { k: .03 });
        clawd(144.0, G + 1, 79.6, { ...feel(t > 327 ? 'cry' : 'nervous', t), view: 'q' }, { sword: swing(t, [325.5, 326.1, 326.8]) });
        if (t > 328.9) for (let i = 0; i < 6; i++) { const a = (t - 328.9 - i * .12); if (a > 0 && a < .6) VX.pt(lerp(144.4, 146.6, a / .6), G + 1.6 + Math.sin(a / .6 * Math.PI) * .6, 79.4, .1, [255, 210, 90], true); }
        bubble(148.4, G + 2.4, 79.0, '再加 10 个需求', t, nb(325.7), 328.6); label(146.6, G + 5.2, 76.4, 'AI 工具', .4, '#9FE6FF', t, nb(328.9)); } },
    ui: (c, t) => { if (t > 317.6 && t < NEXT) followCard(c, t, 317.6, NEXT); if (t >= NEXT) titleCard(c, t, NEXT, 326.0, '下期预告', 'AI 让开发变快了 甲方的要求涨得更快'); } });
  sfx(317.6, 'toast', -10); sfx(NEXT, 'levelup', -10); sfx(nb(328.9), 'coin', -9); sfx(nb(329.6), 'coin', -11);
  const LIKE = nb(331.6);
  shot(331.3, 340.4, { day: 0, keys: [K(331.3, [65.6, 19.5, 66.2], [62.7, 18.7, 64.6], 58), K(340.4, [65.0, 19.3, 65.2], [62.7, 18.7, 64.6], 52)],
    act: t => clawd(62.7, G + 1, 64.6, { ...emotions(t, [[331.3, 'furious'], [nb(336.9), 'happy']]), view: 'front' }),
    ui: (c, t) => { likeUI(c, t, LIKE); chatLines(c, t, [[nb(333.5), [['<码农朋友> 傻X公司 傻X领导', '#FFFFFF']]], [nb(336.9), [['码农朋友 加入了游戏', '#FFE070']]], [nb(338.3), [['<码农朋友> 收到', '#FFFFFF']]]]); } });
  sfx(LIKE, 'pop', -8); sfx(nb(333.5), 'chat', -12); sfx(nb(336.9), 'join', -11); sfx(nb(338.3), 'chat', -10);
  shot(340.4, 344.45, { day: 0, snow: true, fog: [30, 80], keys: [K(340.4, [71.6, 19.8, 68.8], [71.6, 18.9, 64.5], 56), K(344.45, [71.6, 27.0, 80.0], [68.0, 19.0, 64.5], 64)],
    act: t => { clawd(69.9, G + 1, 64.5, { ...feel('happy', t), view: 'front', aR: 1.3 }); heige(73.6, G + 1, 64.5, { ...feel('happy', t), view: 'front', poseR: 'wave' }); },
    ui: (c, t) => { const k = seg01(t, 343.8, 344.45); if (k > 0) { c.fillStyle = `rgba(4,3,10,${k})`; c.fillRect(0, 0, 1920, 1080); } } });

  // ======================================================================================= the overlay pieces
  const FONT = '"PingFang SC", "HarmonyOS Sans SC", sans-serif';
  function outlined(c, txt, x, y, size, fill, o = {}) {
    c.font = `${o.w || 900} ${size}px ${FONT}`; c.textAlign = o.align || 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
    if (o.shadow !== false) { c.fillStyle = 'rgba(8,4,12,.55)'; c.fillText(txt, x + size * .07, y + size * .07); }
    if ((o.lw ?? 1) > 0) { c.lineWidth = o.lw ?? Math.max(6, size * .16); c.strokeStyle = o.stroke || '#140A10'; c.strokeText(txt, x, y); }
    c.fillStyle = fill; c.fillText(txt, x, y);
  }
  const fadeIO = (t, t0, t1, d = .25) => sm(seg01(t, t0, t0 + d)) * (1 - sm(seg01(t, t1 - d, t1)));
  const D = window.STAY_DATA || { cues: [], keys: [] };
  function subtitle(c, t) {
    for (const [a, b, txt] of D.cues) if (t >= a && t < b) {
      c.font = `900 64px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.lineJoin = 'round';
      const parts = []; let i = 0;
      while (i < txt.length) { const k = D.keys.find(w => txt.startsWith(w, i)); if (k) { parts.push([k, true]); i += k.length; } else { if (parts.length && !parts[parts.length - 1][1]) parts[parts.length - 1][0] += txt[i]; else parts.push([txt[i], false]); i++; } }
      let x = 960 - parts.reduce((s, [p]) => s + c.measureText(p).width, 0) / 2;
      for (const [p, key] of parts) { c.lineWidth = 14; c.strokeStyle = '#140A10'; c.strokeText(p, x, 1006); c.fillStyle = key ? '#FFD34E' : '#FFFFFF'; c.fillText(p, x, 1006); x += c.measureText(p).width; }
      break;
    }
  }
  function slam(c, t, t0, t1, txt, fill, size, y = 470) {
    if (t < t0 || t > t1) return;
    const a = t - t0, k = (1 + .9 * Math.exp(-a * 16) * Math.cos(a * 30)) * (1 - sm(seg01(t, t1 - .16, t1))), f = Math.floor(t * 24);
    if (k <= .02) return;
    c.save(); c.translate(960 + (hh(f) - .5) * 14 * Math.exp(-a * 5), y + (hh(f, 2) - .5) * 14 * Math.exp(-a * 5)); c.rotate(-.04); c.scale(k, k);
    outlined(c, txt, 0, 0, size, fill, { lw: size * .14 }); c.restore();
  }
  const pow = (c, t, t0, txt, x, y) => { const a = t - t0; if (a < 0 || a > .5) return; c.save(); c.globalAlpha = 1 - a * 2; c.translate(x, y - a * 80); const k = 1 + .6 * Math.exp(-a * 12); c.scale(k, k); outlined(c, txt, 0, 0, 110, '#FFFFFF', { stroke: '#C8323C', lw: 16 }); c.restore(); };
  const floatTxt = (c, t, t0, txt, x, y) => { const a = t - t0; if (a < 0 || a > .8) return; c.save(); c.globalAlpha = 1 - a / .8; outlined(c, txt, x, y - a * 120, 48, '#F2D29A', { lw: 8 }); c.restore(); };
  const label2 = (c, t, t0, txt, x, y, t1 = 1e9) => { if (t < t0 || t > t1) return; const a = t - t0; c.save(); c.globalAlpha = Math.min(1, a * 4); const k = 1 + .3 * Math.exp(-a * 10); c.translate(x, y); c.scale(k, k); outlined(c, txt, 0, 0, 96, '#FFD34E', { lw: 14 }); c.restore(); };
  function panel(c, x, y, w, h, light = false) {
    if (light) { c.fillStyle = '#C6C6C6'; c.fillRect(x, y, w, h); c.fillStyle = '#FFFFFF'; c.fillRect(x, y, w, 6); c.fillRect(x, y, 6, h); c.fillStyle = '#555555'; c.fillRect(x, y + h - 6, w, 6); c.fillRect(x + w - 6, y, 6, h); c.strokeStyle = '#000'; c.lineWidth = 4; c.strokeRect(x - 2, y - 2, w + 4, h + 4); }
    else { c.fillStyle = 'rgba(16,10,28,.88)'; c.fillRect(x, y, w, h); c.fillStyle = '#3A1E6A'; c.fillRect(x, y, w, 5); c.fillRect(x, y + h - 5, w, 5); c.fillRect(x, y, 5, h); c.fillRect(x + w - 5, y, 5, h); }
  }
  const ICON = {
    briefcase: ['..aaaa..', '..a..a..', 'bbbbbbbb', 'bbbbbbbb', 'ccccdccc', 'bbbbbbbb', 'bbbbbbbb'], book: ['aaaaaaa.', 'abbbbbba', 'abccccba', 'abbbbbba', 'abccccba', 'abbbbbba', 'aaaaaaa.'],
    heart: ['.aa..aa.', 'abbaabba', 'abbbbbba', 'abbbbbba', '.abbbba.', '..abba..', '...aa...'], clock: ['..aaaa..', '.abbbba.', 'abbcbbba', 'abbcccba', 'abbbbbba', '.abbbba.', '..aaaa..'],
    star: ['...a....', '..aba...', 'aabbbaa.', '.abbba..', '.ab.ba..', 'a.....a.'], axe: ['.aaa....', 'abbba...', 'abbbad..', '.aa.d...', '...d....', '..d.....'],
    bolt: ['....aa..', '...ab...', '..abb...', '.abbbba.', '...bba..', '...ba...', '..a.....'], moon: ['..aaa...', '.abba...', 'abb.....', 'abb.....', 'abba....', '.abbaaa.', '..aaa...'],
    lead: ['aa......', 'abaa....', '.abba...', '..abba..', '...abba.', '....abba', '.....aa.'],
  };
  const ICOL = { briefcase: ['#5E3E28', '#B07B45', '#F2C14E', '#6B4428'], book: ['#4A2E1C', '#B23A3A', '#F2E6C8'], heart: ['#5A1418', '#E83A54'], clock: ['#5A3E10', '#F2C14E', '#3A2A20'], star: ['#5A3E10', '#FFD34E'], axe: ['#5E6172', '#C8CCD8', '#6B4428', '#6B4428'], bolt: ['#5A3E10', '#FFE070'], moon: ['#2A3060', '#E8E6F8'], lead: ['#3A2414', '#B07B45'] };
  function icon(c, name, x, y, s) { const rows = ICON[name] || ICON.book, cols = ICOL[name] || ICOL.book; rows.forEach((r, j) => [...r].forEach((ch, i) => { const k = 'abcd'.indexOf(ch); if (k < 0) return; c.fillStyle = cols[Math.min(k, cols.length - 1)]; c.fillRect(x + i * s, y + j * s, s, s); })); }
  function toast(c, t, t0, t1, title, text, ic = 'briefcase', rim = '#E8A93A') {
    if (t < t0 || t > t1) return;
    const slide = 1 - sm(seg01(t, t0, t0 + .22)) + sm(seg01(t, t1 - .25, t1)), x = 1340 + slide * 620, y = 70;
    c.fillStyle = '#1E1B30'; c.fillRect(x, y, 520, 124); c.fillStyle = rim; c.fillRect(x, y, 520, 6); c.fillRect(x, y + 118, 520, 6); c.fillRect(x, y, 6, 124); c.fillRect(x + 514, y, 6, 124);
    icon(c, ic, x + 26, y + 30, 9);
    outlined(c, title, x + 124, y + 42, 32, '#FFD34E', { align: 'left', lw: 6, shadow: false }); outlined(c, text, x + 124, y + 86, 38, '#FFFFFF', { align: 'left', lw: 6, shadow: false });
  }
  function titleCard(c, t, t0, t1, big, small) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .3);
    c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(6,4,12,.35)'; c.fillRect(0, 300, 1920, 360);
    outlined(c, big, 960, 430, 120, '#FFFFFF', { lw: 18 }); outlined(c, small, 960, 560, 64, '#FFD34E', { lw: 11 }); c.restore();
  }
  const questionCard = (c, t, t0, t1, n, q) => { if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .3); c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(6,4,12,.4)'; c.fillRect(0, 160, 1920, 300); outlined(c, n, 960, 240, 92, '#FFD34E', { lw: 14 }); outlined(c, q, 960, 370, 70, '#FFFFFF', { lw: 12 }); c.restore(); };
  function chatLines(c, t, msgs, max = 6) {
    const shown = msgs.filter(([t0]) => t >= t0 && t - t0 < 9).slice(-max);
    shown.forEach(([t0, segs], i) => { const y = 880 - (shown.length - 1 - i) * 54, a = Math.min(1, (t - t0) * 6);
      c.save(); c.globalAlpha = a; c.font = `800 38px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle';
      const w = segs.reduce((s, [txt]) => s + c.measureText(txt).width, 0); c.fillStyle = 'rgba(10,8,14,.6)'; c.fillRect(40, y - 26, w + 40, 52);
      let x = 60; for (const [txt, col] of segs) { c.fillStyle = '#000'; c.fillText(txt, x + 3, y + 3); c.fillStyle = col; c.fillText(txt, x, y); x += c.measureText(txt).width; } c.restore(); });
  }
  function chatPanel(c, t, title, msgs) {
    if (t < msgs[0][0] - .4) return; const shown = msgs.filter(([t0]) => t >= t0).slice(-6);
    const x = 1300, w = 560, a = Math.min(1, (t - msgs[0][0] + .4) * 4); c.save(); c.globalAlpha = a;
    panel(c, x, 120, w, 70 + 6 * 96); outlined(c, title, x + w / 2, 156, 36, '#FFD34E', { lw: 6, shadow: false });
    shown.forEach(([t0, who, txt, tag], i) => { const y = 210 + i * 96, k = Math.min(1, (t - t0) * 6), me = who === '码农朋友', ox = x + 34 + (me ? 60 : 0);
      c.globalAlpha = a * k; c.fillStyle = me ? '#2E4A7A' : '#3A2E4A'; c.fillRect(x + 20 + (me ? 60 : 0), y, w - 100, 82);
      c.font = `700 26px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'top'; c.fillStyle = '#C8C0E0'; c.fillText(who, ox, y + 8);
      if (tag) { c.fillStyle = '#FFD34E'; c.fillText(tag, ox + c.measureText(who + '  ').width, y + 8); }
      c.font = `800 32px ${FONT}`; c.fillStyle = '#FFFFFF'; c.fillText(txt, ox, y + 40); });
    c.restore();
  }
  const hhmm = h => { const H = Math.floor(h) % 24, M = Math.floor((h % 1) * 60); return `${String(H).padStart(2, '0')}:${String(M).padStart(2, '0')}`; };
  function clockUI(c, txt, a) { c.save(); c.globalAlpha = a; panel(c, 40, 40, 300, 100); icon(c, 'clock', 62, 58, 9); outlined(c, txt, 230, 92, 54, '#FFFFFF', { lw: 8, shadow: false }); c.restore(); }
  const tagUI = (c, txt, a) => { if (a <= 0) return; c.save(); c.globalAlpha = a; c.font = `800 40px ${FONT}`; const w = c.measureText(txt).width; panel(c, 40, 40, w + 60, 80); outlined(c, txt, 70 + w / 2, 82, 40, '#F2E6C8', { lw: 6, shadow: false }); c.restore(); };
  const dayCounter = (c, txt, a) => { if (a <= 0) return; c.save(); c.globalAlpha = a; outlined(c, txt, 960, 120, 58, '#F2E6C8', { lw: 9 }); c.restore(); };
  function dream(c, t, t0, t1) { const a = fadeIO(t, t0, t1, .3); const g = c.createRadialGradient(960, 540, 300, 960, 540, 1100); g.addColorStop(0, 'rgba(255,190,230,0)'); g.addColorStop(1, `rgba(200,120,220,${.55 * a})`); c.fillStyle = g; c.fillRect(0, 0, 1920, 1080); tagUI(c, '脑补中', a); }
  function bookUI(c, t, t0, t1, lines, by) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .3);
    c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(6,4,12,.5)'; c.fillRect(0, 0, 1920, 1080);
    c.fillStyle = '#E8D8B0'; c.fillRect(620, 120, 680, 760); c.fillStyle = '#C8B488'; c.fillRect(620, 120, 680, 14); c.fillRect(620, 866, 680, 14); c.fillStyle = '#6B4428'; c.fillRect(600, 110, 20, 780);
    lines.forEach((ln, i) => { const k = seg01(t, t0 + .3 + i * .5, t0 + .6 + i * .5); c.globalAlpha = a * k; c.font = `900 76px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#3A2414'; c.fillText(ln, 960, 330 + i * 140); });
    c.globalAlpha = a * seg01(t, t0 + 2, t0 + 2.4); c.font = `700 38px ${FONT}`; c.fillStyle = '#7A5A3A'; c.fillText(by, 960, 790); c.restore();
  }
  function effects(c, t, list) {
    list.forEach(([name, col, gone, born = -1], i) => { if (t < born) return; const pop = gone > 0 && t > gone ? 1 - seg01(t, gone, gone + .3) : 1; if (pop <= 0) return;
      const x = 1500, y = 70 + i * 120, k = born > 0 ? Math.min(1, (t - born) * 5) : 1; c.save(); c.globalAlpha = pop * k; c.translate(x + 180, y + 50); c.scale(1 + (1 - pop) * .5, 1 + (1 - pop) * .5); c.translate(-x - 180, -y - 50);
      panel(c, x, y, 360, 100); c.fillStyle = col; c.fillRect(x + 22, y + 22, 56, 56); outlined(c, name, x + 210, y + 52, 44, '#FFFFFF', { lw: 7, shadow: false });
      if (gone > 0 && t > gone) { c.strokeStyle = '#E83A44'; c.lineWidth = 12; c.beginPath(); c.moveTo(x + 10, y + 10); c.lineTo(x + 350, y + 90); c.stroke(); } c.restore(); });
  }
  function bossBar(c, t, name, k) {
    const w = 900, x = 510, y = 80, low = k < .15 && Math.floor(t * 8) % 2;
    outlined(c, name, 960, 50, 44, '#FFFFFF', { lw: 8 }); c.fillStyle = '#1A0E1A'; c.fillRect(x - 6, y - 6, w + 12, 36);
    c.fillStyle = low ? '#FF3A3A' : '#E85AA8'; c.fillRect(x, y, w * k, 24); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(x, y, w * k, 6);
  }
  function inventory(c, t, items, thr) {
    if (t < items[0][0] - .3 || t > thr + .5) return; const a = Math.min(1, (t - items[0][0] + .3) * 4) * (1 - seg01(t, thr, thr + .5));
    c.save(); c.globalAlpha = a; panel(c, 560, 200, 800, 520, true); outlined(c, '背包', 960, 250, 44, '#3A3A3A', { lw: 0, shadow: false });
    items.forEach(([t0, name, n, ic], i) => { const x = 600 + (i % 2) * 380, y = 300 + Math.floor(i / 2) * 200; c.fillStyle = '#8B8B8B'; c.fillRect(x, y, 340, 170); c.fillStyle = '#373737'; c.fillRect(x, y, 340, 6); c.fillRect(x, y, 6, 170);
      if (t < t0) return; const k = Math.min(1, (t - t0) * 6), fly = t > thr ? sm(seg01(t, thr, thr + .5)) : 0;
      c.save(); c.translate(fly * (960 - x - 170) * .8, fly * 300); c.globalAlpha = a * k; icon(c, ic, x + 26, y + 40, 12); outlined(c, name, x + 230, y + 62, 40, '#FFFFFF', { lw: 7, shadow: false }); outlined(c, '×' + n, x + 230, y + 122, 40, '#FFD34E', { lw: 7, shadow: false }); c.restore(); });
    c.restore();
  }
  function worldUI(c, t, t0, tDel, t1, o = {}) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .25);
    c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(8,6,14,.72)'; c.fillRect(0, 0, 1920, 1080);
    outlined(c, '选择世界', 960, 130, 56, '#FFFFFF', { lw: 8 });
    const gone = o.deleted && t > o.deleted;
    c.fillStyle = gone ? 'rgba(80,20,24,.8)' : 'rgba(30,26,46,.9)'; c.fillRect(520, 200, 880, 150); c.strokeStyle = '#FFFFFF'; c.lineWidth = 4; c.strokeRect(520, 200, 880, 150);
    icon(c, 'clock', 548, 238, 10); outlined(c, '码农的十年', 640, 250, 52, '#FFFFFF', { align: 'left', lw: 8, shadow: false }); outlined(c, '生存模式  第 3650 天', 640, 312, 36, '#C8C0E0', { align: 'left', lw: 6, shadow: false });
    if (gone) { c.strokeStyle = '#E83A44'; c.lineWidth = 12; c.beginPath(); c.moveTo(520, 275); c.lineTo(1400, 275); c.stroke(); outlined(c, '存档已删除', 960, 420, 60, '#FF6A5A', { lw: 9 }); }
    if (tDel > 0 && t > tDel) {
      const k = Math.min(1, (t - tDel) * 5); c.globalAlpha = a * k; panel(c, 460, 400, 1000, 420, true);
      outlined(c, '确定要删除这个世界吗', 960, 470, 50, '#3A3A3A', { lw: 0, shadow: false }); outlined(c, '码农的十年 将永久消失', 960, 548, 44, '#B23A3A', { lw: 0, shadow: false });
      c.fillStyle = '#B23A3A'; c.fillRect(530, 650, 400, 110); c.fillStyle = '#8B8B8B'; c.fillRect(990, 650, 400, 110);
      outlined(c, '永久删除', 730, 705, 46, '#FFFFFF', { lw: 6, shadow: false }); outlined(c, '取消', 1190, 705, 46, '#FFFFFF', { lw: 6, shadow: false });
      // the cursor drifts to the button and hovers, trembling, never clicking
      const u = sm(seg01(t, tDel + .6, tDel + 2.2)), tr = t > tDel + 2.2 ? 5 * Math.sin(t * 47) : 0, cx = lerp(1250, 735, u) + tr, cy = lerp(880, 690, u) + tr * .6;
      c.fillStyle = '#FFFFFF'; c.strokeStyle = '#000'; c.lineWidth = 4; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx, cy + 70); c.lineTo(cx + 18, cy + 54); c.lineTo(cx + 32, cy + 82); c.lineTo(cx + 44, cy + 76); c.lineTo(cx + 30, cy + 50); c.lineTo(cx + 52, cy + 48); c.closePath(); c.fill(); c.stroke();
    }
    c.restore();
  }
  const levelUI = (c, t, txt, k) => { const bx = 560, by = 930, bw = 800; c.fillStyle = 'rgba(12,8,16,.75)'; c.fillRect(bx - 4, by - 4, bw + 8, 26); c.fillStyle = '#E8A93A'; c.fillRect(bx, by, bw * k, 18); outlined(c, txt, 960, by - 34, 50, '#FFD34E', { lw: 8 }); };
  function reqCard(c, t, flips, t1) {
    if (t < flips[0] - .2 || t > t1) return; const n = Math.max(1, flips.filter(f => t >= f).length), a = Math.min(1, (t - flips[0] + .2) * 5), f = flips[n - 1];
    c.save(); c.globalAlpha = a; c.translate(330, 330); c.scale(Math.max(.05, Math.min(1, (t - f) * 5 + (t < f ? 1 : 0))), 1); panel(c, -230, -110, 460, 220, true);
    outlined(c, `需求 v${n}`, 0, -50, 54, '#3A3A3A', { lw: 0, shadow: false }); outlined(c, ['先做 A', '改成 B', '还是 A 吧'][n - 1] || '', 0, 40, 50, '#B23A3A', { lw: 0, shadow: false }); c.restore();
  }
  function phoneUI(c, t, t0, t1, who) {
    if (t < t0 || t > t1 + .3) return; const a = fadeIO(t, t0, t1 + .3, .2), sh = Math.sin(t * 50) * 6 * (t < t1 ? 1 : 0);
    c.save(); c.globalAlpha = a; c.translate(sh, 0); c.fillStyle = '#1A1826'; c.fillRect(160, 220, 380, 640); c.fillStyle = '#2E2A48'; c.fillRect(184, 260, 332, 540);
    outlined(c, who, 350, 420, 52, '#FFFFFF', { lw: 7, shadow: false }); outlined(c, '来电中', 350, 500, 40, '#C8C0E0', { lw: 6, shadow: false });
    c.fillStyle = '#E83A44'; c.beginPath(); c.arc(270, 700, 46, 0, 7); c.fill(); c.fillStyle = '#3EC3EE'; c.beginPath(); c.arc(430, 700, 46, 0, 7); c.fill(); c.restore();
  }
  function timerUI(c, t, t0) { if (t < t0) return; const s = Math.max(0, 3600 - Math.floor((t - t0) * 60)), txt = `${Math.floor(s / 3600)}:${String(Math.floor(s % 3600 / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; c.save(); c.globalAlpha = Math.min(1, (t - t0) * 4); panel(c, 40, 40, 380, 100); icon(c, 'clock', 62, 58, 9); outlined(c, txt, 260, 92, 54, '#FFD34E', { lw: 8, shadow: false }); c.restore(); }
  function cold(c, t, t0) { if (t < t0) return; c.fillStyle = `rgba(70,46,130,${.2 * Math.min(1, (t - t0) * 2)})`; c.fillRect(0, 0, 1920, 1080); }
  function lossUI(c, t, t0) { if (t < t0) return; const n = Math.floor((t - t0) * 1.2e5 + 12000); c.save(); c.globalAlpha = Math.min(1, (t - t0) * 4); panel(c, 1300, 60, 580, 150); outlined(c, '每分钟损失', 1590, 104, 40, '#C8C0E0', { lw: 6, shadow: false }); outlined(c, '¥ ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '), 1590, 166, 56, '#FFD34E', { lw: 8, shadow: false }); c.restore(); }
  function crossOut(c, t, t0, txt) { if (t < t0 - .5) return; const a = Math.min(1, (t - t0 + .5) * 4); c.save(); c.globalAlpha = a; panel(c, 760, 200, 400, 150); outlined(c, txt, 960, 275, 80, '#FFD34E', { lw: 10, shadow: false });
    if (t > t0) { const k = Math.min(1, (t - t0) * 6); c.strokeStyle = '#E83A44'; c.lineWidth = 16; c.beginPath(); c.moveTo(780, 220); c.lineTo(780 + 360 * k, 220 + 110 * k); c.stroke(); if (k >= 1) { c.beginPath(); c.moveTo(1140, 220); c.lineTo(780, 330); c.stroke(); } } c.restore(); }
  function stamp(c, t, t0, txt) { if (t < t0) return; const a = t - t0, k = 1 + 1.2 * Math.exp(-a * 14); c.save(); c.translate(960, 380); c.rotate(-.12); c.scale(k, k); c.globalAlpha = Math.min(1, a * 8);
    c.strokeStyle = '#E83A44'; c.lineWidth = 14; c.strokeRect(-330, -90, 660, 180); outlined(c, txt, 0, 0, 96, '#E83A44', { stroke: '#FFF0E8', lw: 8, shadow: false }); c.restore(); }
  function tradeUI(c, t, t0, t1) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .25); c.save(); c.globalAlpha = a; panel(c, 460, 140, 1000, 640, true); outlined(c, '交易', 960, 200, 48, '#3A3A3A', { lw: 0, shadow: false });
    [['简历', '面试邀请'], ['作品', '内推机会'], ['经验', '行情参考']].forEach(([a1, b1], i) => { const y = 260 + i * 160, k = seg01(t, t0 + .4 + i * .5, t0 + .6 + i * .5); c.globalAlpha = a * k;
      c.fillStyle = '#8B8B8B'; c.fillRect(520, y, 880, 130); outlined(c, a1, 680, y + 65, 48, '#FFFFFF', { lw: 7, shadow: false }); outlined(c, '→', 960, y + 65, 60, '#FFD34E', { lw: 7, shadow: false }); outlined(c, b1, 1220, y + 65, 48, '#FFFFFF', { lw: 7, shadow: false }); });
    c.restore();
  }
  function iconPop(c, t, t0, ic, txt, x, y) { if (t < t0) return; const a = t - t0, k = (1 + .5 * Math.exp(-a * 10)) * (t < 297.8 ? 1 : Math.max(0, 1 - (t - 297.8) * 3)); if (k <= 0) return; c.save(); c.translate(x, y); c.scale(k, k); icon(c, ic, -72, -100, 18); outlined(c, txt, 0, 110, 64, '#FFFFFF', { lw: 10 }); c.restore(); }
  function followCard(c, t, t0, t1) { const a = fadeIO(t, t0, t1, .3); c.save(); c.globalAlpha = a; panel(c, 560, 140, 800, 220); outlined(c, '关注 问问黑哥', 960, 210, 72, '#FFD34E', { lw: 11 }); outlined(c, '打工人和 AI 的破事 一件件讲明白', 960, 300, 42, '#FFFFFF', { lw: 7 }); c.restore(); }
  function likeUI(c, t, t0) { if (t < t0) return; const a = t - t0, k = 1 + .6 * Math.exp(-a * 9); c.save(); c.globalAlpha = Math.min(1, a * 6) * (1 - seg01(t, t0 + 4, t0 + 4.5)); c.translate(1640, 300); c.scale(k, k);
    const rows = ['....aa..', '...abba.', '...abba.', 'aaaabbaa', 'abbbbbba', 'abbbbbba', 'abbbbbba', '.aaaaaa.']; rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '.') return; c.fillStyle = ch === 'a' ? '#5A3E10' : '#FFD34E'; c.fillRect(-96 + i * 24, -96 + j * 24, 24, 24); }));
    outlined(c, '点个赞', 0, 150, 56, '#FFFFFF', { lw: 9 }); c.restore(); }
  // world-anchored text: name tags, speech bubbles, labels
  function worldText(c) {
    for (const [x, y, z, txt, col] of TAGS) { const p = VX.project(x, y, z, 6); if (!p.vis || p.cz > 22) continue; const s = Math.max(22, Math.min(44, p.k * 6 * .2));
      c.font = `800 ${s}px ${FONT}`; const w = c.measureText(txt).width; c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(p.x - w / 2 - 10, p.y - s * .75, w + 20, s * 1.4); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = col || '#FFFFFF'; c.fillText(txt, p.x, p.y - s * .05); }
    for (const [x, y, z, txt, size, col, age, left] of LBLS) { const p = VX.project(x, y, z, 6); if (p.cz < .3 || p.cz > 40) continue; const s = Math.max(26, Math.min(220, p.k * 6 * size)) * (1 + .4 * Math.exp(-age * 8));
      c.save(); c.globalAlpha = Math.min(1, age * 5) * Math.min(1, left * 4); outlined(c, txt, p.x, p.y, s, col, { lw: s * .14, stroke: col === '#3A1E10' ? '#F2D29A' : '#140A10' }); c.restore(); }
    for (const [x, y, z, txt, age, left] of BUBS) { const p = VX.project(x, y, z, 6); if (p.cz < .3) continue; const k = Math.min(1, age * 6) * Math.min(1, left * 5), s = 50;
      c.save(); c.globalAlpha = k; c.font = `900 ${s}px ${FONT}`; const w = c.measureText(txt).width + 60, bx = Math.max(20, Math.min(1900 - w, p.x - w / 2)), by = p.y - 150;
      c.fillStyle = '#FFFFFF'; c.strokeStyle = '#140A10'; c.lineWidth = 6; c.beginPath(); c.roundRect(bx, by, w, 96, 18); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(p.x - 18, by + 94); c.lineTo(p.x, by + 130); c.lineTo(p.x + 18, by + 94); c.fill(); c.stroke(); c.fillStyle = '#FFFFFF'; c.fillRect(p.x - 15, by + 88, 30, 8);
      c.fillStyle = '#140A10'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, bx + w / 2, by + 50); c.restore(); }
  }
  function rope(x0, y0, z0, x1, y1, z1, slack = .35) { for (let i = 0; i <= 22; i++) { const u = i / 22; VX.pt(lerp(x0, x1, u), lerp(y0, y1, u) - Math.sin(u * Math.PI) * slack, lerp(z0, z1, u), .06, [150, 100, 60]); } }
  function firework(x, y, z, a) { for (const [k, off] of [[0, 0], [1, .35]]) { const b = a - off; if (b < 0 || b > 1.2) continue; for (let i = 0; i < 26; i++) { const th = i / 26 * Math.PI * 2, ph = hh(i, k) * 2 - 1, r = b * 2.2; VX.pt(x + Math.cos(th) * r * .8, y + 1 + ph * r * .7 - b * b, z + Math.sin(th) * r * .5, .07, [[255, 210, 90], [255, 120, 160], [180, 140, 255]][(i + k) % 3], true); } } }

  // ======================================================================================= lights, particles, the frame
  const AMBER = [1, .72, .42], LAVA = [1, .46, .16], VIOLET = [.62, .42, 1];
  const LAMPS = [];
  for (let x = 0; x < VX.SX; x++) for (let y = 1; y < VX.SY; y++) for (let z = 0; z < VX.SZ; z++) { const id = VX.get(x, y, z); if (id === B.lamp) LAMPS.push([x, y, z, AMBER, 7, 1.15]); else if (id === B.amethyst) LAMPS.push([x, y, z, VIOLET, 4.5, .5]); else if (id === B.portal) LAMPS.push([x, y, z, VIOLET, 5, .55]); }
  for (let x = 54; x <= 74; x += 5) for (let z = 58; z <= 92; z += 6) if (VX.get(x, 2, z) === B.lava) LAMPS.push([x, 2.4, z, LAVA, 9, 1.25]);
  LAMPS.push([60, 8, 70, LAVA, 8, 1.2], [57, 8, 80, LAVA, 8, 1.2]);
  function lights(t, cam) {
    for (const L of LAMPS) { if (Math.abs(L[0] - cam.x) + Math.abs(L[1] - cam.y) + Math.abs(L[2] - cam.z) > 34) continue;
      if (L[3] === AMBER && VX.at(L[0], L[1], L[2]) !== B.lamp) continue;
      VX.light(L[0] + .5, L[1] + .5, L[2] + .5, L[3], L[4], L[5] * (L[3] === LAVA ? .9 + .1 * Math.sin(t * 5 + L[2]) : 1)); }
    // lamps lit by edits (the pillars, the bug block, the gold) that weren't lamps at the start
    for (const [x] of PILL) if (VX.at(x, G + 4, PZ) === B.lamp && Math.abs(x - cam.x) < 30) VX.light(x + .5, G + 4.5, PZ + .5, AMBER, 6, 1.1);
    if (VX.at(108, 6, 75) === B.redlamp) VX.light(108.5, 6.5, 75.5, [1, .25, .2], 6, 1.3); else if (VX.at(108, 6, 75) === B.lamp) VX.light(108.5, 6.5, 75.5, AMBER, 6, 1.2);
    if (VX.at(64, G + 1, 70) === B.goldblk) { VX.light(64, G + 4, 73.5, [1, .8, .4], 8, 1.4); VX.light(61, G + 3, 72.5, [1, .8, .4], 6, 1.0); VX.light(67, G + 3, 72.5, [1, .8, .4], 6, 1.0); }
    if (VX.at(63, G + 1, 73) === B.goldblk) VX.light(64, G + 1.6, 73.6, [1, .8, .35], 4, .8);
    VX.light(62.0, G + 2.5, 65.0, [.5, .62, 1], 4.5, .85);
    if (t > beat(16) && t < 23) VX.light(72, G - 1, 64.8, LAVA, 6, 1.4 * sm(seg01(t, beat(16), beat(16) + .3)));
    if (VX.at(160, G + 4, 69) === B.redlamp) for (const x of [158, 162]) VX.light(x + .5, G + 3.5, 69.5, [1, .25, .2], 6, .9);
  }
  function snow(t, cam) { for (let i = 0; i < 380; i++) {
    const fx = hh(i, 1), fz = hh(i, 2), fy = hh(i, 3), sp = .55 + .5 * hh(i, 4);
    const x = cam.x - 9 + ((fx * 18 + .25 * Math.sin(t * .8 + i)) % 18 + 18) % 18, z = cam.z - 9 + ((fz * 18 + t * .3) % 18 + 18) % 18, y = cam.y - 5 + (((fy * 10 - t * sp) % 10) + 10) % 10;
    if (VX.at(Math.floor(x), Math.floor(y), Math.floor(z))) continue; VX.pt(x, y, z, .045, [235, 242, 255], true); } }
  function embers(t) { for (let i = 0; i < 160; i++) {
    const life = 2.4, a = ((t * .9 + hh(i, 5) * life) % life), x0 = 56 + hh(i, 6) * 30, z0 = 60 + hh(i, 7) * 30;
    const x = x0 + .4 * Math.sin(t * 2 + i), y = 3 + a * 3.2, z = z0 + .3 * Math.cos(t * 1.7 + i); if (y > 14) continue; VX.pt(x, y, z, .07, hh(i, 8) < .5 ? [255, 190, 80] : [255, 120, 40], true); } }
  function burst(t, t0, x, y, z, col, n = 18) { const a = t - t0; if (a < 0 || a > .9) return; for (let i = 0; i < n; i++) {
    const vx = (hh(i, t0) - .5) * 4, vz = (hh(i, t0 + 1) - .5) * 4, vy = 2 + hh(i, t0 + 2) * 3;
    VX.pt(x + vx * a, y + vy * a - 9 * a * a, z + vz * a, .09 + .05 * hh(i), col.map(c => c * (.75 + .3 * hh(i, 9)))); } }
  function particles1(t, cam) {
    if (t < 2.55 || (t >= 7.22 && t < 11.3)) snow(t, cam);
    if (t > beat(16) - .4 && t < 23) embers(t);
    for (let x = 71; x <= 72; x++) for (let z = 63; z <= 66; z++) burst(t, beat(16), x + .5, G + .5, z + .5, [168, 116, 63], 6);
    for (const [x, z, id] of TW) for (let i = 0; i < 10; i++) burst(t, BREAK0 + (9 - i) * BSTEP, x + .5, 5.5 + i, z + .5, id === B.code ? [62, 195, 238] : [178, 58, 58], 8);
    for (const [x, z] of TW) for (let i = 0; i < 10; i++) { const a = t - (BUILD0 + i * STEP); if (a > 0 && a < .25) for (let k = 0; k < 6; k++) VX.pt(x + .5 + Math.cos(k) * (.6 + a * 2), 5 + i + .1, z + .5 + Math.sin(k) * (.6 + a * 2), .06, [255, 226, 160], true); }
    if (t > beat(18) && t < beat(18) + .6) burst(t, beat(18), 79.8, 5.1, 75.5, [110, 104, 130], 14);
  }
  const shotAt = t => S.find(s => t >= s.t0 && t < s.t1) || S[S.length - 1];
  const val = (v, t) => typeof v === 'function' ? v(t) : v;
  function camera(t) {
    let c, kicks;
    if (t < P1END) { c = camera1(t); kicks = kicks1; }
    else { const s = shotAt(t); c = along(s.keys, t); kicks = s.kicks || []; }
    const hit = kicks.reduce((m, [t0, a]) => Math.max(m, t >= t0 ? a * Math.exp(-(t - t0) * 7) : 0), 0);
    const f = Math.floor(t * 24), sh = hit * .06;
    c.p[0] += .03 * Math.sin(t * 1.3) + (hh(f) - .5) * sh; c.p[1] += .02 * Math.sin(t * 1.7 + 1) + (hh(f, 3) - .5) * sh;
    const L = look(c.p, c.q);
    return { x: c.p[0], y: c.p[1], z: c.p[2], yaw: L.yaw + .004 * Math.sin(t * .9), pitch: L.pitch, fov: c.fov - hit * 3, roll: .006 * Math.sin(t * .7) };
  }

  // the opening's own overlay and sounds (from the approved sample)
  const CUE1 = 21.6;
  function ui1(c, t) {
    if (t <= 2.7) dayCounter(c, '第 3650 天', sm(seg01(t, OFF, OFF + .3)) * (1 - sm(seg01(t, 2.3, 2.7))));
    toast(c, t, beat(6), beat(9) + .2, '新任务！', '又接了个新活', 'briefcase');
    if (t >= BUILD0 && t <= beat(25)) {
      const n = Math.max(0, Math.min(10, Math.floor((t - BUILD0) / STEP) + 1)), broke = Math.max(0, Math.min(10, Math.floor((t - BREAK0) / BSTEP) + 1)), left = t >= BREAK0 ? 10 - broke : n;
      c.save(); c.globalAlpha = 1 - sm(seg01(t, beat(24), beat(25)));
      [['写代码', 0], ['学习', 1]].forEach(([name, i]) => { const [x, z] = TW[i], p = VX.project(x + .5, 5 + Math.max(1, left) + .9, z + .5, 6); if (p.cz < .3) return; outlined(c, `${name} ${left} 年`, p.x, p.y, Math.max(34, Math.min(60, p.k * 6 * .3)), i ? '#F2C8C8' : '#9FE6FF', { lw: 9 }); });
      levelUI(c, t, `Lv.${left}`, left / 10); c.restore();
    }
    if (t >= BREAK0 && t <= beat(27)) chatLines(c, t, [[BREAK0, [['[系统] ', '#FFD34E'], ['码农朋友 已被优化', '#FFFFFF']]]]);
    for (const [x, y, z, txt, say] of [[101.5, 6.5, 74.02, '加班', 18.75], [109.5, 6.5, 76.98, '学习', 19.55], [117.98, 6.5, 75.5, '35岁', 21.0]]) {
      const p = VX.project(x, y, z, 6); if (!p.vis || p.cz > 26) continue;
      const pulse = 1 + .25 * Math.exp(-Math.max(0, t - say) * 6) * (t > say ? 1 : 0), size = Math.min(320, p.k * 6 * .42) * pulse;
      c.save(); c.globalAlpha = clamp01((26 - p.cz) / 6); outlined(c, txt, p.x, p.y, size, '#3A1E10', { stroke: '#F2D29A', lw: size * .1, shadow: false }); c.restore();
    }
    if (t > CUE1 - .2) clockUI(c, '02:00', Math.min(1, (t - CUE1 + .2) * 5));
    slam(c, t, beat(17), beat(18) + .1, '火坑', '#FF8A2A', 260); slam(c, t, beat(25), beat(27) + .2, '谁爱上谁上', '#FFD34E', 190, 300);
  }
  for (let i = 0; i < 4; i++) sfx(OFF + .02 + i * BT, 'step', -14);
  sfx(2.1, 'whoosh', -12); sfx(beat(6), 'toast', -9); sfx(7.22, 'whoosh', -13); sfx(beat(14), 'thud', -5); sfx(beat(15) + .1, 'crack', -9); sfx(beat(16), 'break', -6); sfx(beat(16) + .05, 'sizzle', -10);
  sfx(beat(17), 'boom', -7); sfx(beat(18), 'thud', -7); for (let i = 0; i < 10; i++) sfx(BUILD0 + i * STEP, 'place', -13); for (let i = 0; i < 10; i += 2) sfx(BREAK0 + i * BSTEP, 'break', -11);
  sfx(BREAK0, 'chat', -12); sfx(beat(25), 'boom', -7); sfx(beat(26), 'step', -10); sfx(beat(27), 'step', -10); sfx(RIDE0, 'cart', -10); sfx(RIDE0 + 1.0, 'cart', -12); sfx(RIDE0 + 2.0, 'cart', -14); sfx(RIDE1, 'thud', -9); sfx(CUE1 - .2, 'tick', -12);

  // bloom from the bright pixels, a vignette, flashes on the big hits
  let BR = null;
  const FLASH = [[beat(14), '255,250,235', .22], [beat(16), '255,150,60', .32], [beat(17), '255,170,80', .2], [beat(23), '255,255,255', .18], [beat(25), '255,90,70', .22], [BLAST, '255,160,90', .5], [BDIE, '255,255,255', .5], [YELL, '255,240,200', .3], [nb(96.1), '255,255,255', .25], [RUN, '255,220,150', .3]];
  function post(c, t) {
    if (!BR) { BR = document.createElement('canvas'); BR.width = PW; BR.height = PH; }
    const bx = BR.getContext('2d'), id = bx.createImageData(PW, PH);
    for (let i = 0; i < PW * PH * 4; i += 4) { const l = BUF[i] * .3 + BUF[i + 1] * .55 + BUF[i + 2] * .15, k = clamp01((l - 150) / 90); id.data[i] = BUF[i] * k; id.data[i + 1] = BUF[i + 1] * k; id.data[i + 2] = BUF[i + 2] * k; id.data[i + 3] = 255; }
    bx.putImageData(id, 0, 0);
    c.save(); c.globalCompositeOperation = 'lighter'; c.imageSmoothingEnabled = true; c.filter = 'blur(22px)'; c.globalAlpha = .7; c.drawImage(BR, 0, 0, 1920, 1080); c.filter = 'blur(6px)'; c.globalAlpha = .35; c.drawImage(BR, 0, 0, 1920, 1080); c.restore();
    const g = c.createRadialGradient(960, 540, 420, 960, 540, 1150); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(6,4,14,.55)'); c.fillStyle = g; c.fillRect(0, 0, 1920, 1080);
    for (const [t0, col, a] of FLASH) { const k = t >= t0 ? Math.exp(-(t - t0) * 9) * a : 0; if (k > .01) { c.fillStyle = `rgba(${col},${k})`; c.fillRect(0, 0, 1920, 1080); } }
    if (t >= 7.22 && t < 7.22 + 2 / 24) { c.fillStyle = '#05040A'; c.fillRect(0, 0, 1920, 1080); }
  }

  const LOOP = t => {
    TAGS.length = 0; BUBS.length = 0; LBLS.length = 0;
    const cam = camera(t), s = t >= P1END ? shotAt(t) : null;
    VX.setDay(s ? val(s.day ?? 0, t) : 0);
    VX.setMoonDir(s && s.moon ? s.moon : [.55, .5, -.65]);
    VX.frame(t, cam);
    if (s && s.pre) s.pre(t);
    lights(t, cam);
    if (!s) { act1(t); particles1(t, cam); VX.setFog(t < 2.5 ? 24 : 18, t < 2.5 || (t > 7.22 && t < 11.2) ? 60 : 44); }
    else {
      VX.setAlert(false);
      s.act && s.act(t);
      if (val(s.snow, t)) snow(t, cam); if (val(s.embers, t)) embers(t);
      const f = val(s.fog, t) || [18, 44]; VX.setFog(f[0], f[1]);
      if (t < 101) for (let i = 0; i < 6; i++) burst(t, CHOPS[i], 102.5 + i, 6, 75.5, [94, 62, 40], 16);
      burst(t, BLAST, 160.5, G + 1.5, 71.5, [200, 60, 60], 20);
    }
    VX.draw();
  };
  LOOP.res = [320, 180]; LOOP.px = 6; LOOP.len = 344.45; LOOP.tempo = [BPM, OFF];
  LOOP.overlay = (c, t) => {
    post(c, t);
    worldText(c);
    if (t < P1END) ui1(c, t); else { const s = shotAt(t); s.ui && s.ui(c, t); }
    subtitle(c, t);
    greenGuard(c);
  };
  // the brand's no-green rule, enforced on the finished frame: translucent yellow over cyan (a fading word over a code
  // screen) blends into green, so any pixel landing in the green hues is pulled to its own grey
  function greenGuard(c) {
    const im = c.getImageData(0, 0, 1920, 1080), d = im.data; let n = 0;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b), dd = mx - mn;
      if (g !== mx || dd < 30 || mx < 45) continue;
      const h = 60 * ((b - r) / dd + 2); if (h < 80 || h > 160) continue;
      const y = r * .3 + g * .55 + b * .15; d[i] = d[i + 1] = d[i + 2] = y; n++;
    }
    if (n) c.putImageData(im, 0, 0);
  }
  LOOPS.pxStay = LOOP;
  // covers: the snowy cabin with its windows lit, no characters (they're composited at full size), one loop per shape
  for (const [name, res, px, p, q, fov] of [
    ['pxStayCover34', [270, 360], 8, [64.0, 21.2, 83.0], [64.0, 21.6, 64.0], 66],
    ['pxStayCover43', [360, 270], 8, [57.6, 21.8, 87.6], [65.8, 21.4, 64.0], 58],
    ['pxStayCover169', [320, 180], 6, [57.6, 21.8, 87.6], [65.8, 21.4, 64.0], 58]]) {
    const L = t => { const L2 = look(p, q), cam = { x: p[0], y: p[1], z: p[2], yaw: L2.yaw, pitch: L2.pitch, fov, roll: 0 };
      VX.setDay(0); VX.setMoonDir([.55, .5, -.65]); VX.frame(30.6, cam); lights(30.6, cam); VX.setFog(30, 80); VX.draw(); };
    L.res = res; L.px = px; L.len = 1; LOOPS[name] = L;
  }
})();
