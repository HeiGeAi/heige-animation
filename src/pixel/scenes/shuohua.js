// scenes/shuohua.js: V058「让 AI 说人话」（Blake 本人录音 2026-10-26）, a film in a block world (voxel.js), V053's sequel.
// The script's central metaphor is a game (an AI is a game character that spends its skill points on code), so the world's
// own game things carry it: two leaderboard towers (代码榜 and 写作榜), an XP bar and a skill tree, an enchanting table for
// the skill, a crafting table, an anvil, a canteen cauldron. Real windows (leaderboards, papers, the lint run, prompts) are
// rendered by V058 工程's Remotion project and laid into the game window's slot afterwards (window.SHUOHUA_SLOTS lists when).
// Anti-moiré from the start (V053 fan feedback): VX.setMip, the soft block set, no walls tiled with bright patterns,
// emissive blocks only as accents, fog for the distance.
//   node render.mjs --page=pixel.html --loop=pxShuohua --stills=3,9.2 --out=out/x
(() => {
  const { B } = VX;
  const G = 12;
  const clamp01 = v => Math.max(0, Math.min(1, v)), sm = v => { v = clamp01(v); return v * v * (3 - 2 * v); };
  const seg01 = (t, a, b) => clamp01((t - a) / (b - a)), lerp = (a, b, k) => a + (b - a) * k;
  const hh = (a, b = 0) => { const v = Math.sin(a * 91.3 + b * 47.7 + 13.1) * 43758.5453; return v - Math.floor(v); };
  const DD = window.SHUOHUA_DATA;
  const SFX = window.SHUOHUA_SFX = [];     // [t, sound, dB] for the mixer (sounds: out/video/shuohua/sfx, synthesized)
  const sfx = (t, name, db = -12) => SFX.push([+t.toFixed(3), name, db]);
  const SLOTS = window.SHUOHUA_SLOTS = []; // [t0, t1, inlay]: when the GUI slot is open and which Remotion inlay plays in it
  const GUI = { x: 300, y: 150, w: 1320, h: 750 };
  const VXE = [];   // block edits the shots ask for, applied when the world is built: [t, x, y, z, block name]
  let BUILT = false;

  // ======================================================================================= the world
  // two leaderboard towers in the north (rank r sits at height rankY(r)); 黑哥's desk in the west; the training ground in
  // the east; the judges and the canteen cauldron in the south-east; the enchanting table, crafting table and anvil south.
  const TL = { x0: 92, x1: 97 }, TR = { x0: 111, x1: 116 }, TZ0 = 40, TZ1 = 42, TH = 26;
  const TLX = (TL.x0 + TL.x1 + 1) / 2, TRX = (TR.x0 + TR.x1 + 1) / 2, TFZ = TZ1 + 1.05;   // tower centres, front face
  const rankY = r => G + TH + .5 - (r - 1) * .58;
  const DESK = { x: 82, z: 66 }, STK = { x: 86, z: 65 }, STK2 = { x: 88, z: 65 };
  const PLAZA = { x0: 70, x1: 150, z0: 30, z1: 122 };
  function buildWorld() {
    VX.reset();
    VX.setMip(1.5);
    const rectD = (x, z) => Math.hypot(Math.max(PLAZA.x0 - x, 0, x - PLAZA.x1), Math.max(PLAZA.z0 - z, 0, z - PLAZA.z1));
    for (let x = 0; x < VX.SX; x++) for (let z = 0; z < VX.SZ; z++) {
      const far = clamp01((rectD(x, z) - 2) / 26);
      const n = 3 * Math.sin(x * .06 + .4) + 2.6 * Math.cos(z * .05 + 1.1) + 4 * Math.max(0, Math.sin(x * .045 + z * .03));
      const h = Math.min(30, G + Math.round(Math.max(0, n + 2) * far * 1.6));
      for (let y = 0; y <= h; y++) VX.set(x, y, z, y === 0 ? B.bedrock : y === h && y > G ? B.terra : y < G ? B.stoneSoft : (far > 0 ? B.stoneSoft : B.floorSoft));
    }
    // the leaderboard towers: plain soft stone, a gold crown on top (rank 1)
    for (const T of [TL, TR]) { VX.fill(T.x0, G + 1, TZ0, T.x1, G + TH, TZ1, B.stoneSoft); VX.fill(T.x0, G + TH + 1, TZ0, T.x1, G + TH + 1, TZ1, B.goldblk);
      VX.fill(T.x0, G + TH - 3, TZ1, T.x1, G + TH, TZ1, T === TL ? B.bannerBlue : B.bannerOrange); }
    for (const [x, z] of [[89, 46], [100, 46], [108, 46], [119, 46]]) { VX.set(x, G + 1, z, B.log); VX.set(x, G + 2, z, B.lamp); }
    // 黑哥's desk: a plank desk, one screen, a lamp post; the chest the skill comes out of
    VX.fill(DESK.x - 1, G + 1, DESK.z, DESK.x + 1, G + 1, DESK.z, B.plankSoft); VX.set(DESK.x, G + 2, DESK.z, B.monitor);
    VX.set(DESK.x - 3, G + 1, DESK.z - 2, B.log); VX.set(DESK.x - 3, G + 2, DESK.z - 2, B.lamp);
    VX.set(DESK.x + 2, G + 1, DESK.z + 4, B.chest);
    // the training ground: a quest board (sign blocks) and two lamp posts; the judges' bench (a plank table)
    VX.fill(QB.x - 1, G + 1, QB.z, QB.x + 1, G + 2, QB.z, B.sign); VX.set(QB.x - 3, G + 1, QB.z + 1, B.log); VX.set(QB.x - 3, G + 2, QB.z + 1, B.lamp); VX.set(QB.x + 3, G + 1, QB.z + 1, B.log); VX.set(QB.x + 3, G + 2, QB.z + 1, B.lamp);
    VX.fill(BENCH.x - 3, G + 1, BENCH.z, BENCH.x + 3, G + 1, BENCH.z, B.plankSoft); VX.set(BENCH.x - 5, G + 1, BENCH.z - 2, B.log); VX.set(BENCH.x - 5, G + 2, BENCH.z - 2, B.lamp); VX.set(BENCH.x + 5, G + 1, BENCH.z - 2, B.log); VX.set(BENCH.x + 5, G + 2, BENCH.z - 2, B.lamp);
    // the canteen cauldron: a dark ring, grey stew inside, lamps around
    for (let x = -2; x <= 2; x++) for (let z = -2; z <= 2; z++) { const ring = Math.max(Math.abs(x), Math.abs(z)) === 2; VX.set(POT.x + x, G + 1, POT.z + z, B.box); if (ring) VX.set(POT.x + x, G + 2, POT.z + z, B.box); else VX.set(POT.x + x, G + 2, POT.z + z, B.stoneSoft); }
    for (const [x, z] of [[POT.x - 5, POT.z - 2], [POT.x + 5, POT.z - 2]]) { VX.set(x, G + 1, z, B.log); VX.set(x, G + 2, z, B.lamp); }
    // the enchanting table (obsidian, a few bookshelves around it), the crafting table, the anvil
    VX.set(ENCH.x, G + 1, ENCH.z, B.obsidian); for (const [dx, dz] of [[-2, 2], [2, 2], [-2, -2], [2, -2]]) VX.set(ENCH.x + dx, G + 1, ENCH.z + dz, B.books);
    VX.set(CRAFT.x, G + 1, CRAFT.z, B.plankSoft); VX.set(CRAFT.x + 1, G + 1, CRAFT.z, B.plankSoft);
    VX.set(ANV.x, G + 1, ANV.z, B.box);
    for (const [x, z] of [[ENCH.x - 4, ENCH.z - 3], [CRAFT.x - 2, CRAFT.z - 2], [ANV.x + 3, ANV.z - 2]]) { VX.set(x, G + 1, z, B.log); VX.set(x, G + 2, z, B.lamp); }
    // ------------------------------------------------ what changes over time (filled by the shots)
    for (let x = 0; x < VX.SX; x++) for (let y = 1; y < VX.SY; y++) for (let z = 0; z < VX.SZ; z++) { const id = VX.get(x, y, z); if (id === B.lamp) LAMPS.push([x, y, z, AMBER, 7, 1.1]); }
    for (const [t, x, y, z, nm] of VXE) VX.edit(t, x, y, z, nm ? B[nm] : 0);
    BUILT = true;
  }

  // ======================================================================================= sprites
  const hgImg = o => VX.capture((x, y) => heigePx(x, y, { ...o, noShadow: true }));
  function heige(x, y, z, o = {}, ex = {}) { VX.sprite(hgImg(o), x, y, z); VX.shadow(x, y, z, .42); if (ex.tag) TAGS.push([x, y + 2.05, z, ex.tag, ex.tagCol]); }
  const dsCache = new Map();
  const dsImg = o => VX.capture((x, y) => modelPx('deepseek', x, y, { ...o, noShadow: true }), 170, 170, 85, 160);
  function deepseek(x, y, z, o = {}, ex = {}) { VX.sprite(dsImg(o), x, y, z); VX.shadow(x, y, z, .5); if (ex.tag !== false) TAGS.push([x, y + 2.25, z, ex.tag || 'DeepSeek V4.1', '#9DB4FF']); }
  // Codex: a command-block robot (a dark block with a terminal face, an amber antenna light, block legs)
  const codexImg = (mood = 'neutral', ph = 0) => VX.capture((X, Y) => {
    const s = new Spr(), bob = Math.round(Math.sin(ph) * 1);
    s.rect(-12, -8, 8, 8, '#3A3550').rect(4, -8, 8, 8, '#3A3550');
    s.rect(-22, -58, 44, 50, '#2A2640').rect(-22, -58, 44, 4, '#4A4466').rect(16, -58, 6, 50, '#1E1B30');
    s.rect(-17, -52, 34, 30, '#0E1428');
    const C = '#3EC3EE';
    if (mood === 'ask') { s.rect(-6, -46, 12, 3, C).rect(3, -43, 3, 6, C).rect(-2, -37, 4, 3, C).rect(-2, -31, 4, 3, C); }
    else if (mood === 'happy') { s.rect(-12, -40, 6, 2, C).rect(6, -40, 6, 2, C).rect(-8, -32, 16, 2, C).set(-9, -33, C).set(8, -33, C); }
    else { s.rect(-13, -44, 3, 2, C).rect(-10, -42, 3, 2, C).rect(-13, -40, 3, 2, C).rect(-4, -36, 10, 2, C); }
    s.rect(-28, -50, 6, 22, '#2A2640').rect(22, -50, 6, 22, '#2A2640');
    s.rect(-1, -66, 2, 8, '#6E6A88').rect(-3, -70, 6, 4, '#F5A524');
    s.outline('#0A0812'); s.draw(X, Y + bob);
  }, 90, 100, 45, 92);
  const bookImg = VX.capture((x, y) => { const s = new Spr(); s.rect(-8, -10, 16, 10, '#B23A3A').rect(-8, -10, 16, 2, '#F2E6C8').rect(-6, -7, 12, 1, '#F2E6C8').outline('#2A1A10'); s.draw(x, y); }, 30, 24, 15, 20);
  function codex(x, y, z, mood, t, ex = {}) { VX.sprite(codexImg(mood, Math.floor(t * 4)), x, y, z); VX.shadow(x, y, z, .5); if (ex.tag !== false) TAGS.push([x, y + 1.75, z, ex.tag || 'Codex', '#3EC3EE']); }

  // ---------------------------------------------------------------- V058 props
  // the model on the leaderboards: a gold block with a little screen face (no logo: it's "a top model" until line 20 names it)
  const mbCache = new Map();
  const mbImg = (mood = 'happy', ghost = false) => { const key = mood + ghost; if (mbCache.has(key)) return mbCache.get(key);
    const img = VX.capture((X, Y) => { const s = new Spr(), C = ghost ? ['#8C7A4E', '#6E5E3A', '#B8A470'] : ['#F2C14E', '#C8932E', '#FFE27A'];
      s.rect(-16, -32, 32, 32, C[0]).rect(-16, -32, 32, 5, C[2]).rect(10, -32, 6, 32, C[1]);
      s.rect(-11, -25, 22, 16, '#1A1622');
      const F = '#FFE9A8';
      if (mood === 'happy') s.rect(-7, -20, 3, 3, F).rect(4, -20, 3, 3, F).rect(-5, -14, 10, 2, F);
      else if (mood === 'ko') { for (const ex of [-7, 4]) s.set(ex, -21, F).set(ex + 2, -21, F).set(ex + 1, -20, F).set(ex, -19, F).set(ex + 2, -19, F); s.rect(-4, -14, 8, 2, F); }
      else s.rect(-7, -20, 3, 3, F).rect(4, -20, 3, 3, F).rect(-4, -14, 8, 2, F);
      s.outline('#2A1A08'); s.draw(X, Y); }, 60, 50, 30, 46);
    mbCache.set(key, img); return img; };
  function modelBlock(x, y, z, mood, ex = {}) { VX.sprite(mbImg(mood, ex.ghost), x, y, z, { k: 1.75 / 87 * 1.7 }); if (ex.tag !== false) TAGS.push([x, y + 1.0, z, ex.tag || '某个顶级模型', ex.tagCol || '#FFD34E']); }
  // a desk microphone; its REC light on when recording
  const micImg = on => VX.capture((X, Y) => { const s = new Spr(); s.rect(-1, -16, 2, 14, '#6E6A88').rect(-6, -3, 12, 3, '#3A3550').rect(-4, -26, 8, 11, '#2A2640').rect(-4, -26, 8, 2, '#6E6A88');
    if (on) s.rect(-2, -22, 4, 3, '#FF4A4A'); s.outline('#0A0812'); s.draw(X, Y); }, 30, 34, 15, 31);
  const MIC = [micImg(false), micImg(true)];
  // a sheet of paper (the script), and the enchanted book of the skill
  const paperImg = VX.capture((X, Y) => { const s = new Spr(); s.rect(-9, -24, 18, 24, '#F2E6C8'); for (let i = 0; i < 6; i++) s.rect(-6, -20 + i * 3, i % 3 === 2 ? 7 : 12, 1, '#7A6A58'); s.outline('#3A2414'); s.draw(X, Y); }, 26, 30, 13, 27);
  const ebookImg = ph => VX.capture((X, Y) => { const s = new Spr(), g = Math.floor(ph) % 2; s.rect(-11, -16, 22, 15, '#6A3EA8').rect(-11, -16, 22, 3, '#C8A8F0').rect(-1, -16, 2, 15, '#3A2060').rect(-8, -11, 6, 1, '#E8D8FF').rect(3, -11, 6, 1, '#E8D8FF');
    if (g) s.set(-7, -14, '#FFFFFF').set(6, -8, '#FFFFFF'); else s.set(5, -14, '#FFFFFF').set(-6, -7, '#FFFFFF'); s.outline('#1E0E34'); s.draw(X, Y); }, 34, 24, 17, 21);
  const EBOOK = [ebookImg(0), ebookImg(1)];
  const bowlImg = VX.capture((X, Y) => { const s = new Spr(); s.rect(-7, -6, 14, 6, '#9A98A8').rect(-6, -7, 12, 2, '#8A8698').rect(-5, -8, 10, 1, '#B4B0BE'); s.outline('#2A2638'); s.draw(X, Y); }, 20, 14, 10, 12);
  function paperStack(t, t0, t1, x, z, n, tags) {   // n cream blocks stacking up between t0 and t1 (block edits, see VXE)
    for (let i = 0; i < n; i++) VXE.push([t0 + (t1 - t0) * i / Math.max(1, n - 1), x, G + 1 + i, z, 'paperSoft']);
  }

  // ======================================================================================= camera and shots
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
  const K = (t, p, q, f = 62) => [t, p, q, f];
  const TAGS = [], BUBS = [], LBLS = [];
  const bubble = (x, y, z, txt, t, t0, t1) => { if (t >= t0 && t < t1) BUBS.push([x, y, z, txt, t - t0, t1 - t]); };
  const label = (x, y, z, txt, size, col, t, t0, t1 = 1e9) => { if (t >= t0 && t < t1) LBLS.push([x, y, z, txt, size, col, t - t0, t1 - t]); };
  const S = window.SHUOHUA_SHOTS = [];
  const shot = (t0, t1, o) => { S.push({ t0, t1, ...o }); if (t0 > .1 && !o.noWhoosh) sfx(t0 - .12, 'whoosh', -15); };
  const slot = (t0, t1, inlay) => SLOTS.push([+t0.toFixed(3), +t1.toFixed(3), inlay]);

  // ======================================================================================= helpers kept from dumb.js
  // a paper notice panel (requirements, papers, checklists)
  function notice(c, t, t0, t1, title, lines, o = {}) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .25), x = o.x ?? 560, y = o.y ?? 150, w = o.w ?? 800, lh = o.lh ?? 92, fs = o.fs ?? 54;
    c.save(); c.globalAlpha = a; c.fillStyle = '#E8D8B0'; c.fillRect(x, y, w, 120 + lines.length * lh); c.fillStyle = '#C8B488'; c.fillRect(x, y, w, 12); c.fillStyle = '#6B4428'; c.fillRect(x - 16, y - 8, 16, 136 + lines.length * lh);
    outlined(c, title, x + w / 2, y + 64, 44, '#7A5A3A', { lw: 0, shadow: false });
    lines.forEach((ln, i) => { const [txt, at, col, strike] = Array.isArray(ln) ? ln : [ln, t0 + .25 + i * .35]; const k = seg01(t, at, at + .25); if (k <= 0) return;
      c.globalAlpha = a * k; outlined(c, txt, x + w / 2, y + 140 + i * lh, fs, col || '#3A2414', { lw: 0, shadow: false });
      if (strike && t > strike) { c.font = `900 ${fs}px ${FONT}`; const tw = c.measureText(txt).width, kk = seg01(t, strike, strike + .25); c.fillStyle = '#C8323C'; c.fillRect(x + w / 2 - tw / 2, y + 140 + i * lh - 4, tw * kk, 8); } });
    c.restore();
  }
  // character card: a portrait sprite drawn flat on the overlay, a name and a line
  function introCard(c, t, t0, t1, name, sub, col, side) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .2), sl = 1 - sm(seg01(t, t0, t0 + .3)), x = side ? 1180 + sl * 300 : 120 - sl * 300;
    c.save(); c.globalAlpha = a; panel(c, x, 680, 620, 150); outlined(c, name, x + 40, 732, 56, col, { align: 'left', lw: 9, shadow: false }); outlined(c, sub, x + 40, 796, 34, '#F2E6C8', { align: 'left', lw: 6, shadow: false }); c.restore();
  }

  function scoreBars(c, t, t0, t1, title, rows) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .25);
    c.save(); c.globalAlpha = a; panel(c, 360, 120, 1200, 110 + rows.length * 110); outlined(c, title, 960, 172, 42, '#FFD34E', { lw: 7, shadow: false });
    rows.forEach(([name, v, max, col, at, note], i) => { const y = 250 + i * 110, k = sm(seg01(t, at, at + .8)), n = Math.round(v * k);
      outlined(c, name, 640, y, 40, '#FFFFFF', { lw: 7, shadow: false, align: 'right' });
      c.fillStyle = '#1A0E1A'; c.fillRect(670, y - 20, 620, 40); c.fillStyle = col; c.fillRect(674, y - 16, 612 * v / max * k, 32); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(674, y - 16, 612 * v / max * k, 8);
      if (t > at) outlined(c, `${n}/${max}`, 1300, y, 42, col, { lw: 7, shadow: false, align: 'left' });
      if (note && t > at + .8) outlined(c, note, 1430, y, 30, '#C8C0E0', { lw: 5, shadow: false, align: 'left' }); });
    c.restore();
  }
  const cartSpr = (() => { const s = new Spr(); s.rect(-27, -22, 54, 18, '#5E6172').rect(-27, -22, 54, 3, '#8E92A4').rect(-25, -18, 50, 1, '#43465A').rect(-25, -12, 50, 1, '#43465A');
    for (const cx of [-17, 17]) s.ell(cx, -4, 5, 5, '#2A2A36').ell(cx, -4, 2, 2, '#8E92A4'); return s.outline('#16161E'); })();
  const cartImg = withDs => VX.capture((x, y) => { if (withDs) modelPx('deepseek', x, y - 11, { ...withDs, noShadow: true }); cartSpr.draw(x, y); }, 170, 170, 85, 160);

  const scrollImg = (() => { const s = new Spr(); s.rect(-9, -14, 18, 14, '#F2E6C8').rect(-11, -15, 22, 3, '#C8925A').rect(-11, -2, 22, 3, '#C8925A').rect(-6, -10, 12, 1, '#7A5A3A').rect(-6, -7, 10, 1, '#7A5A3A').outline('#3A2414'); return VX.capture((x, y) => s.draw(x, y), 30, 24, 15, 20); })();
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
  function bugImg(ph, hurt = 0, boss = false) {
    const s = new Spr(); const cols = hurt ? ['#F07A7A', '#D85A5A'] : boss ? ['#7A5AA8', '#5E4488'] : ['#8E8AA8', '#77738F'];
    [4, 5, 5, 4, 3].forEach((r, i) => { const x = -12 + i * 6, y = -6 + Math.round(Math.sin(ph * 6 + i) * 1.2); s.ell(x, y, r, r * .85, cols[i % 2]); s.line(x, y + 3, x - 2, 0, '#2A2638').line(x, y + 3, x + 2, 0, '#2A2638'); });
    s.set(-15, -7, '#FF3A3A').set(-15, -6, '#FF3A3A').line(-15, -9, -19, -13, '#2A2638').line(-14, -9, -16, -14, '#2A2638');
    if (boss) s.rect(-17, -9, 3, 3, '#FF5A3A');
    return VX.capture((x, y) => s.outline('#1A1622').draw(x, y), 48, 30, 24, 26);
  }

  // ======================================================================================= batch 4: vendor, handover, the three prompts (302 to 452 s)
  const clImg = o => VX.capture((x, y) => clawdPx(x, y, { ...o, noShadow: true }), 160, 160, 80, 150);
  function clawd(x, y, z, o = {}, ex = {}) { VX.sprite(clImg(o), x, y, z); VX.shadow(x, y, z, .5); if (ex.tag !== false) TAGS.push([x, y + 1.3, z, ex.tag || 'Claude · Anthropic', '#F2A27A']); }
  // the pink elephant: a blocky one, trunk swinging
  const eleImg = ph => VX.capture((X, Y) => { const s = new Spr(), P = '#F4A6C6', Pd = '#E88AB2', sw = Math.round(Math.sin(ph) * 2);
    s.rect(-30, -44, 50, 30, P).rect(-30, -44, 50, 4, '#F8C0D8').rect(14, -54, 22, 22, P).rect(18, -50, 10, 14, Pd).set(30, -46, '#1F2937').set(31, -46, '#1F2937');
    s.rect(32 + sw, -34, 6, 18, P).rect(34 + sw, -18, 6, 6, P);
    for (const x of [-26, -14, 2, 12]) s.rect(x, -14, 8, 14, P).rect(x, -2, 8, 2, Pd);
    s.outline('#8E4466'); s.draw(X, Y); }, 110, 80, 55, 74);
  function banUI(c, t, t0, t1, rows) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .2);
    c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(30,18,22,.92)'; c.fillRect(0, 0, 1920, 1080);
    outlined(c, '连接已断开', 960, 250, 70, '#FFFFFF', { lw: 10 }); outlined(c, '你已被此服务器封禁', 960, 350, 54, '#FF6A5A', { lw: 9 });
    rows.forEach(([name, at], i) => { if (t < at) return; const k = seg01(t, at, at + .15), y = 470 + i * 96; c.globalAlpha = a * k; c.fillStyle = '#2A2238'; c.fillRect(600, y - 36, 720, 76);
      outlined(c, name, 640, y + 2, 38, '#C8C0E0', { align: 'left', lw: 6, shadow: false });
      c.save(); c.translate(1220, y); c.rotate(-.12); const sc = 1 + .5 * Math.exp(-(t - at) * 12); c.scale(sc, sc); c.strokeStyle = '#E83A44'; c.lineWidth = 6; c.strokeRect(-70, -28, 140, 56); outlined(c, '已封禁', 0, 2, 34, '#FF6A5A', { lw: 6, shadow: false }); c.restore(); });
    c.globalAlpha = a; c.fillStyle = '#8B8B8B'; c.fillRect(760, 470 + rows.length * 96 + 10, 400, 80); outlined(c, '返回标题画面', 960, 470 + rows.length * 96 + 50, 38, '#FFFFFF', { lw: 6, shadow: false }); c.restore();
  }
  // ======================================================================================= shots: each starts where a phrase of the script is said
  // F(phrase, nth): which line says it and when; P = when; LS / LE = that line's start / end; A = a shot boundary a hair
  // before a line starts. Phrases are the script's own words without punctuation or spaces.
  const ALLW = DD.lines.map(l => l.w);
  function F(sub, nth = 0) { let n = 0; for (let i = 0; i < ALLW.length; i++) { let from = 0, k; while ((k = ALLW[i].indexOf(sub, from)) >= 0) { if (n === nth) return { i, t: DD.lines[i].t[[...ALLW[i].slice(0, k)].length] }; n++; from = k + 1; } } console.warn('F miss', sub, nth); return { i: 0, t: 0 }; }
  const P = (s, n) => F(s, n).t, LS = (s, n) => DD.lines[F(s, n).i].s, LE = (s, n) => DD.lines[F(s, n).i].e;
  const A = (s, n) => LS(s, n) - .3;
  const DUSK = .3;
  const NIGHTK = t => lerp(.34, .14, seg01(t, 20, 600));   // dusk sinks into night over the film

  // ---------------------------------------------------------------- 1 · 全球代码能力榜单排第 2 的模型，它在写作的榜单上排第 39。
  const R2 = P('排第2'), LEAP = P('它在写作的榜单上'), TOP = LEAP + .55, LAND = P('排第39') + .1;
  const mbPos = t => {
    if (t < LEAP) return [TLX, rankY(2) - .45 + .08 * Math.sin(t * 4), TFZ + .4];
    if (t < TOP) { const u = seg01(t, LEAP, TOP); return [lerp(TLX, TRX, u), lerp(rankY(2), rankY(1) + 2.2, u) + 2.4 * Math.sin(u * Math.PI), TFZ + .4]; }
    if (t < LAND) { const u = seg01(t, TOP, LAND); return [TRX, lerp(rankY(1) + 2.2, rankY(39) - .45, u * u), TFZ + .4]; }
    return [TRX, rankY(39) - .45 + Math.max(0, .5 * Math.sin((t - LAND) * 9) * Math.exp(-(t - LAND) * 4)), TFZ + .4];
  };
  VXE.push([LAND, TRX - .5 | 0, Math.round(rankY(39) - 1), TZ1, 'redlamp']);
  shot(0, A('同一个模型'), { day: DUSK, fog: [40, 110], kicks: [[LAND, 1.6]], noWhoosh: true,
    keys: [K(0, [TLX + 3.5, rankY(2) + 1.2, 54], [TLX, rankY(2) - .2, TZ1], 60), K(R2 + .4, [TLX + 2.8, rankY(2) + .8, 51], [TLX, rankY(2) - .2, TZ1], 54),
      K(LEAP, [101, rankY(2) + 1, 60], [TLX + 3, rankY(2), TZ1], 62), K(TOP, [104.5, G + 21, 76], [104.5, G + 21, TZ1], 66), K(LAND - .05, [TRX - 2, G + 12, 72], [TRX, rankY(39) + 3, TZ1], 62),
      K(A('同一个模型'), [TRX - 3.6, rankY(39) + 2.2, 53], [TRX, rankY(39) - .3, TZ1], 56)],
    act: t => { const p = mbPos(t); modelBlock(...p, t < LAND ? 'happy' : 'ko');
      if (t > LAND) burst(t, LAND, TRX, rankY(39), TFZ + .5, [242, 193, 78], 26); if (t > LAND) burst(t, LAND + .05, TRX, rankY(39), TFZ + .5, [120, 120, 140], 18);
      if (t > LEAP && t < LAND) for (let i = 0; i < 6; i++) { const q = mbPos(t - i * .04); VX.pt(q[0], q[1] - .4, q[2], .07, [255, 211, 78], true); } },
    ui: (c, t) => {
      slam(c, t, R2, LEAP - .05, '代码榜 第 2', '#FFD34E', 150, 300);
      slam(c, t, LAND, A('同一个模型') + .3, '写作榜 第 39', '#FF6A5A', 170, 300);
    } });
  sfx(R2, 'levelup', -10); sfx(LEAP, 'whoosh', -10); sfx(LAND - .02, 'boom', -9); sfx(LAND, 'break_stone', -8);
  // ---------------------------------------------------------------- 2 · 同一个模型，写代码是尖子生，写文章排到了 30 多名开外。
  const TOPK = P('写代码是尖子生'), OUTK = P('30多名开外');
  shot(A('同一个模型'), A('所以你会发现'), { day: DUSK, fog: [40, 110],
    keys: [K(A('同一个模型'), [104.5, G + 16.5, 92], [104.5, G + 15.5, TZ1], 62), K(A('所以你会发现'), [104.5, G + 16, 87], [104.5, G + 15.5, TZ1], 60)],
    act: t => { modelBlock(TLX, rankY(2) - .45, TFZ + .4, 'happy', { ghost: true, tag: false }); modelBlock(TRX, rankY(39) - .45, TFZ + .4, 'ko', { tag: false });
      // a dotted fall line between the two places
      for (let i = 0; i <= 20; i++) { const u = i / 20, k = seg01(t, A('同一个模型') + .3 + u * .6, A('同一个模型') + .4 + u * .6); if (k <= 0 || i % 2) continue; VX.pt(lerp(TLX, TRX, u), lerp(rankY(2), rankY(39), u * u), TFZ + .3, .08, [255, 211, 78], true); }
      label(TLX, G + TH + 2.6, TFZ + .6, '写代码榜', 2.0, '#FFFFFF', t, 0); label(TRX, G + TH + 2.6, TFZ + .6, '写作榜', 2.0, '#FFFFFF', t, 0);
      label(TLX - 5.4, rankY(2) - .4, TFZ, '#2', 2.4, '#FFD34E', t, 0); label(TRX + 5.4, rankY(39), TFZ, '#39', 2.4, '#FF8A70', t, 0);
      label(TLX, rankY(2) - 4.6, TFZ + .6, '尖子生', 2.0, '#FFD34E', t, TOPK); label(TRX, rankY(39) + 3, TFZ + .6, '30 多名开外', 2.0, '#FF8A70', t, OUTK); } });
  sfx(TOPK, 'ding', -12); sfx(OUTK, 'sad', -12);

  // ---------------------------------------------------------------- 3 · 所以你会发现，现在的 AI 一个比一个聪明，但你让它帮你写个朋友圈 …… 那股 AI 味还是一模一样。
  const SMART = P('一个比一个聪明'), POST = P('写个朋友圈'), SMELL = P('那股AI味'), SAME = P('还是一模一样');
  shot(A('所以你会发现'), A('我日常也会用AI'), { day: DUSK, fog: [34, 100],
    keys: [K(A('所以你会发现'), [104, G + 2.6, 58.5], [104, G + 2.0, 52], 62), K(POST, [104.6, G + 2.4, 57.6], [104, G + 2.0, 52], 58), K(A('我日常也会用AI'), [102.8, G + 2.4, 57.8], [103.4, G + 2.0, 52], 54)],
    act: t => { const lvJ = Math.floor(seg01(t, A('所以你会发现') + .4, SMART + .8) * 3);
      deepseek(102.6, G + 1, 52.6, { ...emotions(t, [[0, 'proud'], [SMELL, 'neutral']]), dy: t < SMART + .8 ? -Math.abs(Math.sin(t * 9)) * 3 : 0 }, { tag: `DeepSeek · Lv ${[60, 75, 90, 99][lvJ]}` });
      codex(106.2, G + 1, 52.6, t < SMELL ? 'happy' : 'neutral', t, { tag: `Codex · Lv ${[58, 74, 88, 99][lvJ]}` });
      if (t < SMART + .8) for (let i = 0; i < 3; i++) { const a = (t * 1.6 + i / 3) % 1; VX.pt(102.6 + Math.sin(i * 2 + t) * .5, G + 1 + a * 2.4, 52.8, .06, [255, 211, 78], true); VX.pt(105.4 + Math.cos(i * 2 + t) * .5, G + 1 + a * 2.4, 52.8, .06, [255, 211, 78], true); } },
    ui: (c, t) => { postCard(c, t, POST - .1, A('我日常也会用AI') + .3, SMELL); slam(c, t, SAME, A('我日常也会用AI') + .3, '一模一样', '#FF6A5A', 150, 780); } });
  [0, 1, 2].forEach(i => sfx(A('所以你会发现') + .6 + i * .45, 'xp', -12)); sfx(SMART + .2, 'levelup', -11); sfx(POST - .1, 'page', -10); sfx(SMELL, 'glitch', -12); sfx(SAME, 'thud', -8);

  // ---------------------------------------------------------------- 4 · 我日常也会用 AI 找选题写稿子，我就发现问题特别大。
  const BIG = P('问题特别大');
  shot(A('我日常也会用AI'), A('上期那个AI越用越傻'), { day: DUSK, fog: [30, 90],
    keys: [K(A('我日常也会用AI'), [DESK.x + 3.4, G + 2.9, DESK.z + 4.4], [DESK.x, G + 2.0, DESK.z + .5], 60), K(A('上期那个AI越用越傻'), [DESK.x + 2.6, G + 2.7, DESK.z + 3.6], [DESK.x, G + 2.1, DESK.z + .5], 54)],
    act: t => { heige(DESK.x, G + 1, DESK.z + 1.5, { ...emotions(t, [[0, 'thinking'], [BIG, 'surprised']]), view: 'q', flip: true });
      VX.sprite(MIC[0], DESK.x + .9, G + 2, DESK.z + .5);
      bubble(DESK.x, G + 3.3, DESK.z + 1.5, '问题特别大', t, BIG, A('上期那个AI越用越傻')); },
    ui: (c, t) => toast(c, t, A('我日常也会用AI') + .3, BIG + .5, '日常工作流', 'AI 找选题 · AI 写稿子', 'book') });
  sfx(A('我日常也会用AI') + .3, 'toast', -12); sfx(BIG, 'hit', -10);

  // ---------------------------------------------------------------- 5 · 上期那个 AI 越用越傻的视频，稿子第一版就是 AI 帮我写的，我坐到电脑前，打开麦克风 …… 这是给人念的稿子吗？
  const V1 = P('稿子第一版'), SIT = P('我坐到电脑前'), MICON = P('打开麦克风'), LOOKP = P('一看稿子'), WTF = P('这是给人念的稿子吗');
  shot(A('上期那个AI越用越傻'), A('最后推倒重来'), { day: DUSK, fog: [30, 90], kicks: [[WTF, 1.4]],
    keys: [K(A('上期那个AI越用越傻'), [DESK.x - 3.4, G + 3.4, DESK.z + 7.4], [DESK.x, G + 2.0, DESK.z + 1], 58), K(SIT, [DESK.x - 2.4, G + 3.0, DESK.z + 5.6], [DESK.x + .2, G + 2.0, DESK.z + .8], 56),
      K(LOOKP - .2, [DESK.x + 2.6, G + 2.8, DESK.z + 5.6], [DESK.x, G + 2.2, DESK.z + 1.4], 56), K(WTF, [DESK.x + 1.9, G + 2.6, DESK.z + 4.6], [DESK.x, G + 2.3, DESK.z + 1.4], 52),
      K(A('最后推倒重来'), [DESK.x + 1.8, G + 2.6, DESK.z + 4.4], [DESK.x, G + 2.3, DESK.z + 1.4], 50)],
    act: t => { const walk = seg01(t, A('上期那个AI越用越傻') + .2, SIT); const z = lerp(DESK.z + 4.2, DESK.z + 1.5, sm(walk));
      const turned = t > LOOKP;
      heige(DESK.x, G + 1, z, { ...emotions(t, [[0, 'neutral'], [MICON, 'determined'], [LOOKP, 'confused'], [WTF, 'disgusted']]), view: turned ? 'front' : 'back', walk: walk > 0 && walk < 1 ? t * 1.4 : undefined, poseR: turned ? 'scratch' : undefined });
      VX.sprite(MIC[t > MICON ? 1 : 0], DESK.x + .9, G + 2, DESK.z + .5);
      if (t > V1 && !turned) VX.sprite(paperImg, DESK.x - .6, G + 2, DESK.z + .4);
      if (turned) VX.sprite(paperImg, DESK.x - .55, G + 1.55, z + .25);
      if (t > MICON) TAGS.push([DESK.x + .9, G + 2.75, DESK.z + .5, '● 录音中', '#FF6A5A']);
      if (turned) TAGS.push([DESK.x - .55, G + 2.45, z + .25, '第 1 版 · AI 写的', '#F2E6C8']); },
    ui: (c, t) => { tagUI(c, '上期 · AI 越用越傻', fadeIO(t, A('上期那个AI越用越傻') + .2, V1 + 1.5, .25)); slam(c, t, WTF, A('最后推倒重来') + .2, '这是给人念的稿子吗？', '#FFFFFF', 110, 300); } });
  for (let i = 0; i < 4; i++) sfx(A('上期那个AI越用越傻') + .3 + i * .5, 'step', -15); sfx(V1, 'page', -11); sfx(MICON, 'click', -8); sfx(LOOKP, 'page', -10); sfx(WTF, 'hit', -7);

  // ---------------------------------------------------------------- 6 · 最后推倒重来，前前后后改到第 13 版，才算定下来。
  const REDO = P('推倒重来'), V13 = P('改到第13版'), FIX = P('才算定下来');
  paperStack(0, REDO + .25, V13 + .5, STK.x, STK.z, 13);
  for (let i = 0; i < 13; i++) VXE.splice(VXE.length - 13 + i, 1, [REDO + .25 + (V13 + .5 - REDO - .25) * Math.pow(i / 12, .8), STK.x, G + 1 + i, STK.z, 'paperSoft']);
  shot(A('最后推倒重来'), A('那今天这期视频'), { day: DUSK, fog: [30, 90], kicks: [[FIX, .7]],
    keys: [K(A('最后推倒重来'), [STK.x + 1.0, G + 3.0, STK.z + 9], [STK.x - .6, G + 2.6, STK.z + 1], 60), K(V13 + .5, [STK.x + 2.4, G + 7.6, STK.z + 25], [STK.x - .2, G + 7.2, STK.z], 60), K(A('那今天这期视频'), [STK.x + 2.4, G + 7.8, STK.z + 26], [STK.x - .2, G + 7.2, STK.z], 60)],
    act: t => { heige(STK.x - 1.6, G + 1, STK.z + 1.8, { ...emotions(t, [[0, 'furious'], [V13, 'sad'], [FIX, 'relieved']]), view: 'q' });
      if (t > REDO && t < REDO + .9) burst(t, REDO, STK.x - 1.6, G + 2.4, STK.z + 1.8, [242, 230, 200], 20);
      const n = Math.max(0, Math.min(13, Math.floor(1 + 12 * Math.pow(seg01(t, REDO + .25, V13 + .5), 1 / .8))));
      if (t > REDO + .25) label(STK.x + .5, G + 1.6 + n, STK.z + 1.3, `第 ${n} 版`, .55, n === 13 ? '#FFD34E' : '#F2E6C8', t, REDO + .25); },
    ui: (c, t) => { if (t > FIX) stamp(c, t, FIX, '第 13 版才定下来'); } });
  sfx(REDO, 'break_wood', -9); for (let i = 0; i < 13; i++) sfx(REDO + .25 + (V13 + .5 - REDO - .25) * Math.pow(i / 12, .8), 'place', -13 + i * .3); sfx(FIX, 'thud', -8);

  // ---------------------------------------------------------------- 7 · 那今天这期视频，我会把我自己做的一个开源 skill，再加 4 个让 AI 说人话的小技巧 …… 你复制就能用。
  const CH = { x: DESK.x + 2, z: DESK.z + 4 }, OPENC = P('开源skill') - .25, TIPS = P('再加4个'), READY = P('提示词我都给你准备好了'), COPY = P('复制就能用');
  shot(A('那今天这期视频'), A('如果你跟我一样'), { day: DUSK, fog: [30, 90], kicks: [[OPENC, .7]],
    keys: [K(A('那今天这期视频'), [CH.x + 3.2, G + 2.8, CH.z + 3.6], [CH.x, G + 1.6, CH.z], 60), K(OPENC + .4, [CH.x + 2.4, G + 2.4, CH.z + 2.8], [CH.x, G + 1.8, CH.z], 52), K(A('如果你跟我一样'), [CH.x + 2.2, G + 2.4, CH.z + 2.6], [CH.x, G + 2.0, CH.z], 50)],
    act: t => { heige(CH.x - 1.4, G + 1, CH.z + .8, { ...emotions(t, [[0, 'happy'], [OPENC, 'excited'], [COPY, 'proud']]), view: 'q' });
      if (t > OPENC) { const u = sm(seg01(t, OPENC, OPENC + .7)); VX.sprite(EBOOK[Math.floor(t * 4) % 2], CH.x + .5, G + 1.2 + u * 1.3 + .08 * Math.sin(t * 3), CH.z + .5);
        for (let i = 0; i < 4; i++) { const a = ((t * .9 + i / 4) % 1); VX.pt(CH.x + .5 + Math.sin(i * 1.7 + t * 2) * .4, G + 1.4 + u * 1.3 + a * .8, CH.z + .5, .05, [200, 160, 255], true); } } },
    ui: (c, t) => { packUI5(c, t, OPENC + .5, TIPS); if (t > COPY) stamp(c, t, COPY, '复制就能用'); } });
  sfx(OPENC, 'chest', -8); sfx(OPENC + .3, 'enchant', -10); [0, 1, 2, 3].forEach(i => sfx(TIPS + .2 + i * .3, 'pickup', -10)); sfx(COPY, 'thud', -8);

  // ---------------------------------------------------------------- 8 · 如果你跟我一样，平时用 AI 总感觉它写出来的东西没法用，那么可以试试我这个 skill。
  const NOUSE = P('没法用'), TRY = P('试试我这个skill');
  shot(A('如果你跟我一样'), A('我不能保证'), { day: DUSK, fog: [30, 90],
    keys: [K(A('如果你跟我一样'), [DESK.x + .6, G + 2.5, DESK.z + 6.4], [DESK.x + .6, G + 2.2, DESK.z + 2], 56), K(A('我不能保证'), [DESK.x + .6, G + 2.4, DESK.z + 5.4], [DESK.x + .6, G + 2.2, DESK.z + 2], 50)],
    act: t => { heige(DESK.x + .6, G + 1, DESK.z + 2.6, { ...emotions(t, [[0, 'neutral'], [NOUSE, 'sad'], [TRY, 'happy']]), view: 'front', poseR: t > TRY ? 'point' : undefined });
      if (t < TRY) { for (let i = 0; i < 3; i++) { const a = t - NOUSE - i * .25; if (a > 0 && a < 1.2) VX.sprite(paperImg, DESK.x - 1.4 + i * .9, G + 3.2 - a * a * 2.6, DESK.z + 3.2); } }
      else VX.sprite(EBOOK[Math.floor(t * 4) % 2], DESK.x + 1.6, G + 2.1 + .06 * Math.sin(t * 3), DESK.z + 3.0); },
    ui: (c, t) => { if (t > NOUSE && t < TRY + .2) slam(c, t, NOUSE, TRY + .2, '没法用', '#FF6A5A', 140, 260); } });
  sfx(NOUSE, 'sad', -12); sfx(TRY, 'enchant', -11);

  // ---------------------------------------------------------------- 9 · 我不能保证 …… 百分百地去掉 AI 味，但起码能减少你百分之七八十的工作量。只要有提效，我认为它就是有用的。
  const NOT100 = P('百分百地去掉AI味'), CUT = P('百分之七八十的工作量'), USEFUL = P('只要有提效');
  shot(A('我不能保证'), A('最起码我原先'), { day: DUSK, fog: [30, 90],
    keys: [K(A('我不能保证'), [DESK.x - 2.6, G + 2.6, DESK.z + 5.2], [DESK.x + .6, G + 2.1, DESK.z + 2.4], 58), K(A('最起码我原先'), [DESK.x - 2.0, G + 2.5, DESK.z + 4.6], [DESK.x + .6, G + 2.1, DESK.z + 2.4], 54)],
    act: t => heige(DESK.x + .6, G + 1, DESK.z + 2.6, { ...emotions(t, [[0, 'thinking'], [CUT, 'determined'], [USEFUL, 'proud']]), view: 'q', flip: true }),
    ui: (c, t) => workBar(c, t, A('我不能保证') + .2, A('最起码我原先') + .2, NOT100, CUT, USEFUL) });
  sfx(NOT100 + .3, 'click', -10); sfx(CUT, 'xp', -10); sfx(CUT + .5, 'xp_2', -11); sfx(USEFUL, 'ding', -10);

  // ---------------------------------------------------------------- 10 · 最起码我原先一个稿子要改 13 版，现在改个 3 到 4 个版本就 OK 了。
  const OLD13 = P('要改13版'), NEW4 = P('3到4个版本');
  paperStack(0, NEW4 - .1, NEW4 + .5, STK2.x, STK2.z, 4);
  shot(A('最起码我原先'), A('先说清楚'), { day: DUSK, fog: [30, 90],
    keys: [K(A('最起码我原先'), [STK.x + 2.6, G + 7.6, STK.z + 25], [STK.x + 2.2, G + 7.0, STK.z], 60), K(A('先说清楚'), [STK.x + 2.6, G + 7.2, STK.z + 23.5], [STK.x + 2.2, G + 6.8, STK.z], 58)],
    act: t => { heige(STK.x + 4.2, G + 1, STK.z + 1.6, { ...emotions(t, [[0, 'neutral'], [NEW4, 'happy']]), view: 'q', flip: true });
      label(STK.x + .5, G + 14.8, STK.z + 1.3, '以前 13 版', .55, '#F2E6C8', t, OLD13 - .2); label(STK2.x + .5, G + 6.0, STK2.z + 1.3, '现在 3 到 4 版', .55, '#FFD34E', t, NEW4 + .5); },
    ui: (c, t) => {} });
  for (let i = 0; i < 4; i++) sfx(NEW4 - .1 + i * .2, 'place', -11); sfx(NEW4 + .7, 'levelup', -12);

  // ---------------------------------------------------------------- 11 · 先说清楚，今天不讲哪个模型最聪明，就讲一件事，为什么越聪明的 AI，反而越不会好好说话。这个事背后是有原因的，我从头给你捋一遍。
  const NOTTALK = P('今天不讲哪个模型最聪明'), Q = P('为什么越聪明的AI'), WHY = P('这个事背后是有原因的'), REW = P('从头给你捋一遍');
  shot(A('先说清楚'), A('你肯定见过这样的句子'), { day: DUSK, fog: [44, 120],
    keys: [K(A('先说清楚'), [104, G + 6, 78], [104, G + 9, TZ1], 62), K(WHY, [104, G + 10, 72], [104, G + 14, TZ1], 62), K(A('你肯定见过这样的句子'), [104, G + 16, 64], [104, G + 18, TZ1], 66)],
    act: t => { modelBlock(TLX, rankY(2) - .45, TFZ + .4, 'happy', { tag: false }); modelBlock(TRX, rankY(39) - .45, TFZ + .4, 'ko', { tag: false }); heige(104, G + 1, 70, { ...emotions(t, [[0, 'neutral'], [Q, 'thinking']]), view: 'back' }); },
    ui: (c, t) => { crossOut2(c, t, NOTTALK - .2, NOTTALK + 1.2, Q - .3, '今天不讲：哪个模型最聪明');
      questionCard(c, t, Q - .1, A('你肯定见过这样的句子') + .2, '今天只讲一件事', '为什么越聪明的 AI，反而越不会好好说话？'); } });
  sfx(NOTTALK + 1.2, 'click', -9); sfx(Q - .1, 'toast', -10); sfx(REW, 'whoosh', -10);

  // ======================================================================================= chunk 2: why (89 to 227 s)
  const QB = { x: 125, z: 60 }, BENCH = { x: 121, z: 82 };   // the quest board (training ground) and the judges' bench
  // ---------------------------------------------------------------- 12 · 你肯定见过这样的句子。首先其次、总而言之、不是什么而是什么，再来一堆破折号，一看就知道是 AI 写的。
  const TILES = [['首先 其次', P('首先其次')], ['总而言之', P('总而言之')], ['不是…而是…', P('不是什么而是什么')], ['——', P('一堆破折号') + .2]], AIW = P('一看就知道是AI写的');
  shot(A('你肯定见过这样的句子'), A('开头那个排名'), { day: NIGHTK, fog: [34, 100], kicks: TILES.map(([, t0]) => [t0 + .32, .5]),
    keys: [K(A('你肯定见过这样的句子'), [104, G + 3.2, 80], [104, G + 2.4, 70], 62), K(A('开头那个排名'), [104, G + 2.8, 77.5], [104, G + 2.2, 70], 56)],
    act: t => heige(104, G + 1, 71, { ...emotions(t, [[0, 'neutral'], [TILES[0][1], 'suspicious'], [AIW, 'disgusted']]), view: 'front' }),
    ui: (c, t) => { dropTiles(c, t, TILES, A('开头那个排名') + .2); if (t > AIW) slam(c, t, AIW, A('开头那个排名') + .2, 'AI 写的', '#FF6A5A', 150, 300); } });
  TILES.forEach(([, t0]) => sfx(t0 + .3, 'thud', -9)); sfx(AIW, 'glitch', -10);

  // ---------------------------------------------------------------- 13 · 开头那个排名，其实讲的就是 AI 写东西好不好。
  const WRT = P('其实讲的就是AI写东西好不好');
  shot(A('开头那个排名'), A('它是从哪来的呢'), { day: NIGHTK, fog: [44, 120],
    keys: [K(A('开头那个排名'), [TRX - 2, G + 18, 64], [TRX, G + 22, TZ1], 60), K(A('它是从哪来的呢'), [TRX - 1.4, G + 19, 60], [TRX, G + 23, TZ1], 56)],
    act: t => { modelBlock(TRX, rankY(39) - .45, TFZ + .4, 'ko', { tag: false }); label(TRX, G + TH - 1.4, TFZ + .6, '写作榜', 1.0, '#FFFFFF', t, 0);
      label(TRX, G + TH - 5, TFZ + .6, 'AI 写东西好不好', .8, '#FFD34E', t, WRT); },
    ui: (c, t) => {} });
  sfx(WRT, 'ding', -12);

  // ---------------------------------------------------------------- 14 · 它是从哪来的呢？有个叫大模型竞技场的网站 …… 你觉得哪个好就投哪个。（游戏窗口：盲投示意）
  const AR0 = P('有个叫大模型竞技场的网站') - .2, AR1 = A('它分了好几个榜') + .05;
  shot(A('它是从哪来的呢'), AR1, { day: NIGHTK, fog: [44, 120],
    keys: [K(A('它是从哪来的呢'), [104, G + 3, 64], [104, G + 2.4, 54], 60), K(AR1, [104, G + 2.8, 62.4], [104, G + 2.4, 54], 52)],
    act: t => heige(104, G + 1, 56, { ...emotions(t, [[0, 'thinking'], [AR0, 'idea']]), view: 'front', poseR: t < AR0 ? 'chin' : undefined }),
    ui: (c, t) => guiWin(c, t, AR0, AR1, '大模型竞技场 · 真人盲投') });
  slot(AR0 + .25, AR1 - .25, 'arenaVote'); sfx(AR0, 'chest', -10); sfx(P('你觉得哪个好就投哪个'), 'click', -8); sfx(AR1 - .25, 'chestclose', -12);

  // ---------------------------------------------------------------- 15 · 它分了好几个榜，有写代码的榜，也有写作的榜。
  const BC = P('有写代码的榜'), BW = P('也有写作的榜');
  shot(AR1, A('我看的是10月22号的数据'), { day: NIGHTK, fog: [44, 120], noWhoosh: true,
    keys: [K(AR1, [104.5, G + 16, 88], [104.5, G + 15.5, TZ1], 62), K(A('我看的是10月22号的数据'), [104.5, G + 15.5, 84], [104.5, G + 15.5, TZ1], 60)],
    act: t => { label(TLX, G + TH - 1.4, TFZ + .6, '写代码榜', 2.0, '#FFFFFF', t, BC); label(TRX, G + TH - 1.4, TFZ + .6, '写作榜', 2.0, '#FFFFFF', t, BW);
      modelBlock(TLX, rankY(2) - .45, TFZ + .4, 'happy', { tag: false }); modelBlock(TRX, rankY(39) - .45, TFZ + .4, 'ko', { tag: false }); },
    ui: (c, t) => {} });
  sfx(BC, 'xp_1', -11); sfx(BW, 'xp_3', -11);

  // ---------------------------------------------------------------- 16 · 我看的是 10 月 22 号的数据。开头说的那个模型，就是 OpenAI 家的 GPT 6 Astra …… 在写作的榜上排第 39。（游戏窗口：两张榜）
  const BD0 = LS('我看的是10月22号的数据') - .2, BD1 = A('那为什么会这样呢') + .05;
  shot(A('我看的是10月22号的数据'), BD1, { day: NIGHTK, fog: [44, 120],
    keys: [K(A('我看的是10月22号的数据'), [104.5, G + 15.5, 84], [104.5, G + 15.5, TZ1], 60), K(BD1, [104.5, G + 15, 80], [104.5, G + 15.5, TZ1], 58)],
    act: t => { modelBlock(TLX, rankY(2) - .45, TFZ + .4, 'happy', { tag: false }); modelBlock(TRX, rankY(39) - .45, TFZ + .4, 'ko', { tag: false }); },
    ui: (c, t) => guiWin(c, t, BD0, BD1, '排行榜 · 2026 年 10 月 22 日') });
  slot(BD0 + .25, BD1 - .25, 'boards'); sfx(BD0, 'page', -9); sfx(P('在写代码的榜上排第2'), 'ding', -11); sfx(P('在写作的榜上排第39'), 'sad', -11);

  // ---------------------------------------------------------------- 17 · 那为什么会这样呢？我给你打个比方。你把大模型想象成一个游戏角色，它每升一级，就有技能点可以去加。
  const GAME = P('想象成一个游戏角色'), LVUP = P('它每升一级'), SP = P('就有技能点可以去加');
  shot(BD1, A('那现在各家公司'), { day: NIGHTK, fog: [34, 100], noWhoosh: true, kicks: [[LVUP, .6]],
    keys: [K(BD1, [104, G + 2.8, 61], [104, G + 2.2, 54], 62), K(GAME, [104.8, G + 2.4, 58.4], [104, G + 2.0, 54], 52), K(A('那现在各家公司'), [104.4, G + 2.4, 57.8], [104, G + 2.0, 54], 48)],
    act: t => { deepseek(104, G + 1, 54, { ...emotions(t, [[0, 'neutral'], [GAME, 'excited'], [LVUP, 'proud']]), dy: t > LVUP && t < LVUP + .4 ? -6 * Math.sin((t - LVUP) / .4 * Math.PI) : 0 }, { tag: t > GAME ? '大模型 · 游戏角色' : '大模型' });
      if (t > LVUP && t < LVUP + 1.2) for (let i = 0; i < 18; i++) { const a = (t - LVUP) / 1.2, th = i / 18 * 6.28 + a * 3; VX.pt(104 + Math.cos(th) * .7, G + 1 + a * 2.6, 54 + Math.sin(th) * .7, .06, [255, 211, 78], true); } },
    ui: (c, t) => { if (t > GAME - .2) xpBar(c, t, t < LVUP ? 'Lv 41' : 'Lv 42', t < LVUP ? .2 + .75 * seg01(t, GAME, LVUP) : seg01(t, LVUP, LVUP + .5) * .15);
      toast(c, t, SP - .1, A('那现在各家公司') + .3, '升级！', '技能点 +1', 'star'); } });
  sfx(BD1, 'chestclose', -12); [0, 1, 2, 3].forEach(i => sfx(GAME + .2 + i * .25, 'xp_' + (1 + i % 4), -13)); sfx(LVUP, 'levelup', -9); sfx(SP - .1, 'toast', -11);

  // ---------------------------------------------------------------- 18 · 那现在各家公司，基本都把技能点加到了写代码和做题上，写作这棵技能树，几乎没人去点。
  const PT = P('加到了写代码和做题上'), WTREE = P('写作这棵技能树'), NONE = P('几乎没人去点');
  shot(A('那现在各家公司'), A('那为什么都去点代码呢'), { day: NIGHTK, fog: [34, 100],
    keys: [K(A('那现在各家公司'), [104.6, G + 2.4, 58.2], [104, G + 2.0, 54], 50), K(A('那为什么都去点代码呢'), [104.2, G + 2.6, 59], [104, G + 2.0, 54], 54)],
    act: t => deepseek(104, G + 1, 54, { ...emotions(t, [[0, 'proud'], [NONE, 'neutral']]) }, { tag: '大模型' }),
    ui: (c, t) => skillTree(c, t, A('那现在各家公司') + .1, A('那为什么都去点代码呢') + .2, PT, WTREE, NONE) });
  [0, 1, 2, 3, 4, 5].forEach(i => sfx(PT + i * .18, 'click', -14)); sfx(NONE, 'sad', -12);

  // ---------------------------------------------------------------- 19 · 那为什么都去点代码呢？因为训练收益明显。AI 变聪明 …… 对了加分，错了扣分，然后再去做下一题。
  const GAIN = P('因为训练收益明显'), DO = P('让它去大量做题'), CHECK = P('做完直接去对答案'), PLUS = P('对了加分'), MINUS = P('错了扣分'), NEXTQ = P('然后再去做下一题');
  shot(A('那为什么都去点代码呢'), A('数学题有标准答案'), { day: NIGHTK, fog: [34, 100], kicks: [[GAIN, .8]],
    keys: [K(A('那为什么都去点代码呢'), [QB.x + 4.4, G + 3.4, QB.z + 9.4], [QB.x, G + 2.0, QB.z + 1], 58), K(DO, [QB.x + 3.6, G + 3.0, QB.z + 8.2], [QB.x, G + 2.0, QB.z + 1.4], 56), K(A('数学题有标准答案'), [QB.x + 3.2, G + 2.9, QB.z + 7.6], [QB.x, G + 2.0, QB.z + 1.4], 54)],
    act: t => { const hop = [PLUS, MINUS, NEXTQ].some(x => t > x && t < x + .3); deepseek(QB.x, G + 1, QB.z + 2.4, { ...emotions(t, [[0, 'determined'], [PLUS, 'happy'], [MINUS, 'sad'], [NEXTQ, 'determined']]), view: 'back', dy: hop ? -3 : 0 }, { tag: '大模型 · 刷题中' });
      if (t > PLUS && t < PLUS + 1) for (let i = 0; i < 10; i++) { const a = t - PLUS - i * .05; if (a > 0 && a < .8) VX.pt(QB.x + Math.sin(i * 2.1) * .8 * (1 - a), G + 2.6 - a * .8, QB.z + .9 + a * 1.4, .07, [255, 230, 120], true); } },
    ui: (c, t) => { slam(c, t, GAIN, DO - .1, '训练收益明显', '#FFD34E', 150, 300);
      quests(c, t, DO - .2, A('数学题有标准答案') + .3, [[CHECK, '第 1 题', '对答案…', ''], [PLUS, '第 1 题', '对了', '+10'], [MINUS, '第 2 题', '错了', '-10'], [NEXTQ, '第 3 题', '下一题', '']]);
      xpBar(c, t, '经验', .3 + .5 * seg01(t, PLUS, NEXTQ + 1.5)); } });
  sfx(GAIN, 'thud', -9); sfx(CHECK, 'page', -11); sfx(PLUS, 'xp', -8); sfx(PLUS + .15, 'xp_2', -10); sfx(MINUS, 'hit', -10); sfx(NEXTQ, 'click', -10);

  // ---------------------------------------------------------------- 20 · 数学题有标准答案，一对就知道对没对；代码就更简单了，写完跑一遍，能不能跑通，电脑自己就告诉你了。
  const MATH = P('数学题有标准答案'), CODE = P('代码就更简单了'), RUN = P('写完跑一遍'), TELL = P('电脑自己就告诉你了');
  shot(A('数学题有标准答案'), A('这事真不是我瞎猜的'), { day: NIGHTK, fog: [34, 100],
    keys: [K(A('数学题有标准答案'), [QB.x + 3.2, G + 2.9, QB.z + 7.6], [QB.x, G + 2.0, QB.z + 1.4], 54), K(A('这事真不是我瞎猜的'), [QB.x + 2.4, G + 3.0, QB.z + 8.2], [QB.x, G + 2.0, QB.z + 1.4], 56)],
    act: t => deepseek(QB.x, G + 1, QB.z + 2.4, { ...emotions(t, [[0, 'determined'], [TELL, 'happy']]), view: 'back' }, { tag: '大模型 · 刷题中' }),
    ui: (c, t) => checkCards(c, t, MATH - .1, A('这事真不是我瞎猜的') + .3, MATH, CODE, RUN, TELL) });
  sfx(MATH + .6, 'ding', -10); sfx(RUN, 'type_burst', -12); sfx(TELL, 'ding', -9); sfx(TELL + .12, 'xp', -10);

  // ---------------------------------------------------------------- 21 · 这事真不是我瞎猜的。DeepSeek 发 R1 的时候 …… 打分的模型很容易被钻空子。（游戏窗口：R1 论文原文）
  const R10 = P('论文里就写得很清楚') - .2, R11 = A('那写作呢') + .05;
  shot(A('这事真不是我瞎猜的'), R11, { day: NIGHTK, fog: [34, 100],
    keys: [K(A('这事真不是我瞎猜的'), [QB.x - 4, G + 2.8, QB.z + 6], [QB.x - 1.2, G + 2.2, QB.z + 2.4], 58), K(R11, [QB.x - 3.4, G + 2.7, QB.z + 5.4], [QB.x - 1.2, G + 2.2, QB.z + 2.4], 52)],
    act: t => { heige(QB.x - 2.4, G + 1, QB.z + 3, { ...emotions(t, [[0, 'determined'], [R10, 'smug']]), view: 'q' }); deepseek(QB.x, G + 1, QB.z + 2.4, { ...feel('happy', t) }, { tag: 'DeepSeek' }); },
    ui: (c, t) => guiWin(c, t, R10, R11, 'DeepSeek-R1 论文 · 原文') });
  slot(R10 + .25, R11 - .25, 'r1Quote'); sfx(R10, 'page', -9); [P('数学题是让模型按固定格式给答案'), P('编程题就用编译器去跑一遍'), P('没用另外一个模型去打分')].forEach(x => sfx(x, 'click', -12)); sfx(P('很容易被钻空子'), 'glitch', -12);

  // ---------------------------------------------------------------- 22 · 那写作呢？一段话写得好不好，没有标准答案。你觉得好，我觉得一般，电脑自己就更没法判断好坏。
  const NOANS = P('没有标准答案'), YOU = P('你觉得好'), ME = P('我觉得一般'), PC = P('电脑自己就更没法判断好坏');
  shot(R11, A('写作要练'), { day: NIGHTK, fog: [34, 100], noWhoosh: true,
    keys: [K(R11, [BENCH.x, G + 3.0, BENCH.z + 5.6], [BENCH.x, G + 2.4, BENCH.z - 1], 58), K(A('写作要练'), [BENCH.x + .6, G + 2.9, BENCH.z + 4.8], [BENCH.x, G + 2.4, BENCH.z - 1], 52)],
    act: t => { vill(BENCH.x - 2, G + 1, BENCH.z - 1, '村民', t > YOU ? 'happy' : 'neutral', { tag: '评委 A' }); vill(BENCH.x + 2, G + 1, BENCH.z - 1, '甲方', t > ME ? 'angry' : 'neutral', { tag: '评委 B' });
      if (t > YOU) label(BENCH.x - 2, G + 3.2, BENCH.z - .8, '8 分', .22, '#FFD34E', t, YOU); if (t > ME) label(BENCH.x + 2, G + 3.2, BENCH.z - .8, '4 分', .22, '#FF8A70', t, ME);
      if (t > PC) label(BENCH.x, G + 2.6, BENCH.z + .6, '电脑：判不了', .22, '#C8C0E0', t, PC); },
    ui: (c, t) => { slam(c, t, NOANS, YOU - .1, '没有标准答案', '#FFFFFF', 130, 220); } });
  sfx(NOANS, 'thud', -10); sfx(YOU, 'ding', -11); sfx(ME, 'hit', -11); sfx(PC, 'glitch', -11);

  // ---------------------------------------------------------------- 23 · 写作要练，就只能找另一个模型来打分 …… 被钻空子。所以写作这棵技能树，就很难用这种办法去练，练不动。
  const JUDGE = P('就只能找另一个模型来打分'), GAMED = P('打分的模型很容易被钻空子'), STUCK = P('练不动');
  shot(A('写作要练'), A('所以这事儿放到你身上'), { day: NIGHTK, fog: [34, 100], kicks: [[STUCK, .8]],
    keys: [K(A('写作要练'), [BENCH.x + .6, G + 3.2, BENCH.z + 8.4], [BENCH.x - .8, G + 2.0, BENCH.z], 56), K(GAMED, [BENCH.x - .2, G + 3.0, BENCH.z + 7.4], [BENCH.x - .8, G + 2.0, BENCH.z + .3], 54), K(A('所以这事儿放到你身上'), [BENCH.x, G + 3.0, BENCH.z + 7.8], [BENCH.x - .8, G + 2.0, BENCH.z + .3], 56)],
    act: t => { codex(BENCH.x, G + 1, BENCH.z - 1, t > GAMED + .4 ? 'happy' : 'neutral', t, { tag: t > JUDGE ? '打分模型' : false });
      deepseek(BENCH.x - 2.6, G + 1, BENCH.z + 1.0, { ...emotions(t, [[0, 'neutral'], [GAMED, 'mischief']]) }, { tag: '大模型' });
      if (t > GAMED) VX.sprite(scrollImg, BENCH.x - 1.3, G + 2.0 + .1 * Math.sin(t * 5), BENCH.z + .3);
      if (t > GAMED + .4) label(BENCH.x, G + 3.1, BENCH.z - .6, '满分！', .3, '#FFD34E', t, GAMED + .4); },
    ui: (c, t) => { if (t > GAMED) toast(c, t, GAMED, STUCK - .2, '钻空子', '满篇套话 照样高分', 'bolt', '#E83A44');
      if (t > STUCK - .6) { skillTree(c, t, STUCK - .6, A('所以这事儿放到你身上') + .2, -1, STUCK - .6, STUCK - .6); stamp(c, t, STUCK, '练不动'); } } });
  sfx(GAMED, 'pop', -10); sfx(GAMED + .4, 'levelup', -14); sfx(STUCK, 'thud', -7);

  // ---------------------------------------------------------------- 24 · 所以这事儿放到你身上也是一样的，你手里的 AI 再新，在写东西这件事上，可能真没比去年强多少。
  const NEWAI = P('你手里的AI再新'), LASTY = P('可能真没比去年强多少');
  shot(A('所以这事儿放到你身上'), A('再说回前面那些'), { day: NIGHTK, fog: [30, 90],
    keys: [K(A('所以这事儿放到你身上'), [DESK.x + 2.6, G + 2.8, DESK.z + 5], [DESK.x, G + 2.0, DESK.z + 1.5], 56), K(A('再说回前面那些'), [DESK.x + 2.0, G + 2.6, DESK.z + 4.2], [DESK.x, G + 2.0, DESK.z + 1.5], 50)],
    act: t => heige(DESK.x, G + 1, DESK.z + 1.8, { ...emotions(t, [[0, 'neutral'], [LASTY, 'bored']]), view: 'q', flip: true }),
    ui: (c, t) => yearCompare(c, t, NEWAI - .2, A('再说回前面那些') + .2, LASTY) });
  sfx(NEWAI - .2, 'page', -11); sfx(LASTY, 'sad', -12);


  // ======================================================================================= chunk 3: the taste of machines, other models (227 to 356 s)
  const POT = { x: 108, z: 96 };   // the canteen cauldron
  // ---------------------------------------------------------------- 25 · 再说回前面那些一看就是 AI 写的句子。那 AI 为什么老用这些句子呢？这就要说到 AI 学说话的最后一步了。
  const WHYQ = P('那AI为什么老用这些句子呢'), LAST = P('学说话的最后一步');
  shot(A('再说回前面那些'), A('它学完以后'), { day: NIGHTK, fog: [34, 100],
    keys: [K(A('再说回前面那些'), [104, G + 3.2, 80], [104, G + 2.4, 70], 62), K(A('它学完以后'), [BENCH.x - 6, G + 3.6, BENCH.z + 8], [BENCH.x, G + 2.2, BENCH.z], 60)],
    act: t => heige(104, G + 1, 71, { ...emotions(t, [[0, 'suspicious'], [WHYQ, 'thinking']]), view: 'front', poseR: 'chin' }),
    ui: (c, t) => { if (t < WHYQ) dropTiles(c, t, [['首先 其次', A('再说回前面那些') - .4], ['总而言之', A('再说回前面那些') - .3], ['不是…而是…', A('再说回前面那些') - .2], ['——', A('再说回前面那些') - .1]], WHYQ);
      questionCard(c, t, WHYQ - .1, LAST - .2, '那 AI 为什么', '老用这些句子？'); tagUI(c, '学说话的最后一步：打分', fadeIO(t, LAST, A('它学完以后') + .3, .2)); } });
  sfx(WHYQ - .1, 'toast', -11); sfx(LAST, 'click', -10);

  // ---------------------------------------------------------------- 26 · 它学完以后，会有人给它的回答打分，挑出更喜欢的那个，然后让它往那个方向靠。
  const SCORE = P('会有人给它的回答打分'), PICK = P('挑出更喜欢的那个'), LEAN = P('往那个方向靠');
  shot(A('它学完以后'), A('问题就出在这儿'), { day: NIGHTK, fog: [34, 100],
    keys: [K(A('它学完以后'), [BENCH.x - 1, G + 3.2, BENCH.z + 7.4], [BENCH.x - .6, G + 2.2, BENCH.z], 58), K(A('问题就出在这儿'), [BENCH.x - .4, G + 3.0, BENCH.z + 6.6], [BENCH.x - .6, G + 2.2, BENCH.z], 54)],
    act: t => { vill(BENCH.x - 1.6, G + 1, BENCH.z - 1, '村民', t > PICK ? 'happy' : 'neutral', { tag: '打分的人' }); vill(BENCH.x + 1.6, G + 1, BENCH.z - 1, '村民', t > PICK ? 'happy' : 'neutral', { tag: '打分的人' });
      const lean = sm(seg01(t, LEAN, LEAN + .8)); deepseek(BENCH.x - 2.6 - lean * .9, G + 1, BENCH.z + 1.6, { ...emotions(t, [[0, 'neutral'], [LEAN, 'happy']]) }, { tag: '大模型' }); },
    ui: (c, t) => pickUI(c, t, SCORE - .1, A('问题就出在这儿') + .2, PICK, LEAN) });
  sfx(SCORE, 'page', -11); sfx(PICK, 'ding', -10); sfx(LEAN, 'whoosh', -13);

  // ---------------------------------------------------------------- 27 · 问题就出在这儿。人天生就更喜欢眼熟的东西。
  const HERE = P('问题就出在这儿'), FAMI = P('人天生就更喜欢眼熟的东西');
  shot(A('问题就出在这儿'), A('去年有一篇论文'), { day: NIGHTK, fog: [34, 100], kicks: [[HERE, .8]],
    keys: [K(A('问题就出在这儿'), [BENCH.x, G + 2.9, BENCH.z + 4.6], [BENCH.x, G + 2.4, BENCH.z - 1], 54), K(A('去年有一篇论文'), [BENCH.x + .4, G + 2.8, BENCH.z + 4.0], [BENCH.x, G + 2.4, BENCH.z - 1], 50)],
    act: t => { vill(BENCH.x - 1.6, G + 1, BENCH.z - 1, '村民', t > FAMI ? 'happy' : 'neutral', { tag: '打分的人' }); vill(BENCH.x + 1.6, G + 1, BENCH.z - 1, '村民', t > FAMI ? 'happy' : 'neutral', { tag: '打分的人' });
      if (t > FAMI) bubble(BENCH.x - 1.6, G + 3.2, BENCH.z - .8, '这句眼熟，给高分', t, FAMI + .2, A('去年有一篇论文')); },
    ui: (c, t) => slam(c, t, HERE, FAMI, '问题就出在这儿', '#FF6A5A', 140, 300) });
  sfx(HERE, 'thud', -8); sfx(FAMI + .2, 'pop', -11);

  // ---------------------------------------------------------------- 28 · 去年有一篇论文 …… 会习惯性地把分给比较常见的一些句式。（游戏窗口：论文原文）
  const VS0 = P('去年有一篇论文') - .2, VS1 = A('那打着打着') + .05;
  shot(A('去年有一篇论文'), VS1, { day: NIGHTK, fog: [34, 100],
    keys: [K(A('去年有一篇论文'), [BENCH.x + .4, G + 2.8, BENCH.z + 4.0], [BENCH.x, G + 2.4, BENCH.z - 1], 50), K(VS1, [BENCH.x + .2, G + 2.8, BENCH.z + 3.6], [BENCH.x, G + 2.4, BENCH.z - 1], 48)],
    act: t => { vill(BENCH.x - 1.6, G + 1, BENCH.z - 1, '村民', 'happy', { tag: false }); vill(BENCH.x + 1.6, G + 1, BENCH.z - 1, '村民', 'happy', { tag: false }); },
    ui: (c, t) => guiWin(c, t, VS0, VS1, '论文原文 · Verbalized Sampling') });
  slot(VS0 + .25, VS1 - .25, 'vsPaper'); sfx(VS0, 'page', -9); sfx(P('会习惯性地把分给比较常见的一些句式'), 'click', -11);

  // ---------------------------------------------------------------- 29 · 那打着打着，AI 就学会了一件事 …… 一看几万个人都在用同样的句子，那么赶紧存起来，以后我也这么写。
  const LEARN = P('AI就学会了一件事'), SAFE = P('往最常见最保险的那种说法上靠'), CROWD = P('一看几万个人都在用同样的句子'), SAVE = P('那么赶紧存起来'), ME2 = P('以后我也这么写');
  shot(VS1, A('这个就是我们说的机器味'), { day: NIGHTK, fog: [34, 100], noWhoosh: true,
    keys: [K(VS1, [QB.x - 6, G + 2.8, QB.z + 9], [QB.x - 6, G + 2.0, QB.z + 3], 56), K(A('这个就是我们说的机器味'), [QB.x - 5.6, G + 2.6, QB.z + 7.6], [QB.x - 6, G + 2.0, QB.z + 3], 50)],
    act: t => { deepseek(QB.x - 6, G + 1, QB.z + 3, { ...emotions(t, [[0, 'thinking'], [CROWD, 'starstruck'], [SAVE, 'excited'], [ME2, 'proud']]), view: 'front' }, { tag: '大模型' });
      if (t > SAVE) VX.sprite(bookImg, QB.x - 5.2, G + 2.0 + .05 * Math.sin(t * 6), QB.z + 3.4);
      bubble(QB.x - 6, G + 3.4, QB.z + 3, '几万人都这么写？', t, CROWD, SAVE); bubble(QB.x - 6, G + 3.4, QB.z + 3, '赶紧存起来！', t, SAVE, ME2); bubble(QB.x - 6, G + 3.4, QB.z + 3, '以后我也这么写', t, ME2, A('这个就是我们说的机器味')); },
    ui: (c, t) => { tagUI(c, '学会了：往最常见、最保险的说法上靠', fadeIO(t, LEARN, CROWD, .2)); crowdCards(c, t, CROWD - .1, A('这个就是我们说的机器味') + .2); } });
  sfx(CROWD, 'chat', -12); for (let i = 0; i < 6; i++) sfx(CROWD + .1 + i * .12, 'chat', -16); sfx(SAVE, 'pickup', -9); sfx(ME2, 'page', -11);

  // ---------------------------------------------------------------- 30 · 这个就是我们说的机器味。就像食堂的大锅菜 …… 谁都能吃，但谁也不会觉得好吃到惊艳。
  const TASTE = P('这个就是我们说的机器味'), POTP = P('就像食堂的大锅菜'), ALL = P('谁都能吃'), WOW = P('好吃到惊艳');
  shot(A('这个就是我们说的机器味'), A('说到这儿'), { day: NIGHTK, fog: [34, 100], kicks: [[TASTE, .7]],
    keys: [K(A('这个就是我们说的机器味'), [POT.x + 8.5, G + 6.5, POT.z + 6], [POT.x, G + 2, POT.z + 1], 60), K(POTP + .4, [POT.x + 7.4, G + 5.6, POT.z + 6.4], [POT.x - .4, G + 2, POT.z + 1.4], 58), K(A('说到这儿'), [POT.x + 6.6, G + 5.0, POT.z + 6.8], [POT.x - .8, G + 2, POT.z + 1.8], 56)],
    act: t => { for (let i = 0; i < 5; i++) { const x = POT.x - 4 + i * 2, z = POT.z + 3.4; vill(x, G + 1, z, '村民', t > WOW ? 'neutral' : t > ALL ? 'happy' : 'neutral', { tag: false }); if (t > ALL) VX.sprite(bowlImg, x + .45, G + 1.9, z + .3); }
      for (let i = 0; i < 8; i++) { const a = ((t * .5 + i / 8) % 1); VX.pt(POT.x + .5 + Math.sin(i * 2.4 + t) * .9, G + 2.4 + a * 2.6, POT.z + .5 + Math.cos(i * 1.7) * .9, .12 * (1 - a) + .04, [200, 196, 210]); } },
    ui: (c, t) => { slam(c, t, TASTE, POTP - .1, '这就是机器味', '#FFD34E', 140, 300); tagUI(c, '食堂大锅菜：照顾所有人的口味', fadeIO(t, POTP, WOW - .2, .2));
      if (t > WOW) slam(c, t, WOW, A('说到这儿') + .2, '惊艳？没有', '#FF6A5A', 130, 300); } });
  sfx(TASTE, 'thud', -9); sfx(POTP, 'sizzle', -12); sfx(ALL, 'pop', -12); sfx(WOW, 'sad', -11);

  // ---------------------------------------------------------------- 31 · 说到这儿，肯定有人会说，那我换一个更强的模型不就行了？其实也不一定。
  const SWAP = P('那我换一个更强的模型不就行了'), NOTN = P('其实也不一定');
  shot(A('说到这儿'), A('还是那个榜'), { day: NIGHTK, fog: [34, 100],
    keys: [K(A('说到这儿'), [104, G + 2.9, 78], [104, G + 2.2, 71], 58), K(A('还是那个榜'), [104, G + 2.8, 77], [104, G + 2.2, 71], 54)],
    act: t => { heige(105.2, G + 1, 71, { ...emotions(t, [[0, 'neutral'], [NOTN, 'smug']]), view: 'q', flip: true, poseR: t > NOTN ? 'point' : undefined }); vill(102.6, G + 1, 71.4, '甲方', 'shout', { tag: '观众' });
      bubble(102.6, G + 3.3, 71.4, '换个更强的模型不就行了？', t, SWAP - .3, NOTN); },
    ui: (c, t) => slam(c, t, NOTN, A('还是那个榜') + .2, '不一定', '#FFD34E', 160, 300) });
  sfx(SWAP - .3, 'chat', -11); sfx(NOTN, 'thud', -9);

  // ---------------------------------------------------------------- 32-33 · 还是那个榜 …… Gemini 4 Argon，写作榜排第 2，写代码的榜排第 9 …… 我自己做视频改稿的时候，就是专门让 Gemini 来帮我挑 ……（游戏窗口：榜单，再换成真实审稿记录）
  const GM0 = P('还是那个榜') - .2, AG0 = P('我自己做视频改稿的时候') - .2, GM1 = A('当然两个榜都排第一的模型也有') + .05;
  shot(A('还是那个榜'), GM1, { day: NIGHTK, fog: [44, 120],
    keys: [K(A('还是那个榜'), [104.5, G + 16, 88], [104.5, G + 15.5, TZ1], 62), K(GM1, [104.5, G + 15, 82], [104.5, G + 15.5, TZ1], 58)],
    act: t => { modelBlock(TLX, rankY(2) - .45, TFZ + .4, 'happy', { tag: false }); modelBlock(TRX, rankY(39) - .45, TFZ + .4, 'ko', { tag: false }); },
    ui: (c, t) => guiWin(c, t, GM0, GM1, t < AG0 ? '排行榜 · Gemini 4 Argon' : '黑哥的改稿流程 · 人味审稿') });
  slot(GM0 + .25, AG0, 'boardsGemini'); slot(AG0, GM1 - .25, 'antigravity');
  sfx(GM0, 'page', -9); sfx(P('写作榜排第2'), 'ding', -11); sfx(P('写代码的榜排第9'), 'click', -11); sfx(AG0, 'page', -10);

  // ---------------------------------------------------------------- 34 · 当然，两个榜都排第一的模型也有，但那家公司我就不推荐了，老粉丝都知道为什么，因为这傻逼公司老封号。
  const BOTH = P('两个榜都排第一的模型也有'), NOREC = P('但那家公司我就不推荐了'), BAN = P('老封号');
  shot(A('当然两个榜都排第一的模型也有'), A('那如果你在国内'), { day: NIGHTK, fog: [44, 120], kicks: [[BAN, 1.2]],
    keys: [K(A('当然两个榜都排第一的模型也有'), [104.5, G + TH + 1, 66], [104.5, G + TH, 50], 60), K(NOREC, [104.5, G + TH + .6, 60], [104.5, G + TH - .4, 50], 54), K(A('那如果你在国内'), [104.5, G + TH + .5, 58.6], [104.5, G + TH - .4, 50], 50)],
    act: t => { const up = sm(seg01(t, BOTH, BOTH + .6)); clawd(104.5, G + TH - 2 + up * 1.2, 52, { ...feel(t > NOREC ? 'neutral' : 'smug', t) }, { tag: '两个榜都第一的模型' });
      label(TLX + 5.2, G + TH + 1.8, TFZ, '写代码榜 第 1', .45, '#FFD34E', t, BOTH + .3); label(TRX - 5.2, G + TH + 1.8, TFZ, '写作榜 第 1', .45, '#FFD34E', t, BOTH + .5); },
    ui: (c, t) => { if (t > NOREC && t < BAN) slam(c, t, NOREC, BAN, '不推荐', '#FF6A5A', 150, 300); banUI(c, t, BAN - .1, A('那如果你在国内') + .2, [['账号 A', BAN + .1], ['账号 B', BAN + .3], ['账号 C', BAN + .5]]); } });
  sfx(BOTH, 'levelup', -12); sfx(NOREC, 'click', -9); sfx(BAN - .1, 'glitch', -8); [0, 1, 2].forEach(i => sfx(BAN + .1 + i * .2, 'anvil', -12));

  // ---------------------------------------------------------------- 35 · 那如果你在国内 …… 在这个写作榜上，国产模型里排得最靠前的，是千问和 Kimi。（游戏窗口：写作榜国产）
  const CN0 = P('在这个写作榜上') - .2, CN1 = A('所以我的看法是这样的') + .05;
  shot(A('那如果你在国内'), CN1, { day: NIGHTK, fog: [44, 120],
    keys: [K(A('那如果你在国内'), [104.5, G + 16, 88], [104.5, G + 15.5, TZ1], 62), K(CN1, [104.5, G + 15, 82], [104.5, G + 15.5, TZ1], 58)],
    act: t => { modelBlock(TLX, rankY(2) - .45, TFZ + .4, 'happy', { tag: false }); modelBlock(TRX, rankY(39) - .45, TFZ + .4, 'ko', { tag: false });
      label(104.5, G + 8, TFZ + 6, '国内能直接用的', 1.6, '#FFD34E', t, A('那如果你在国内') + .3, CN0); },
    ui: (c, t) => guiWin(c, t, CN0, CN1, '写作榜 · 国产模型') });
  slot(CN0 + .25, CN1 - .25, 'boardsCN'); sfx(CN0, 'page', -9); sfx(P('是千问和Kimi'), 'ding', -10);

  // ---------------------------------------------------------------- 36 · 所以我的看法是这样的，想让它写作的时候，就挑写作好的模型；想让它 coding 的时候，就选 coding 好的模型。一定要选对场景。
  const WR = P('想让它写作的时候'), CD = P('想让它coding的时候'), RIGHT = P('一定要选对场景');
  shot(CN1, A('那么今天讲的是写作'), { day: NIGHTK, fog: [34, 100], noWhoosh: true,
    keys: [K(CN1, [104, G + 2.9, 78], [104, G + 2.2, 71], 58), K(A('那么今天讲的是写作'), [104, G + 2.8, 76.6], [104, G + 2.2, 71], 52)],
    act: t => heige(104, G + 1, 71, { ...emotions(t, [[0, 'thinking'], [WR, 'idea'], [RIGHT, 'determined']]), view: 'front', poseR: t > RIGHT ? 'point' : undefined }),
    ui: (c, t) => pickTools(c, t, CN1 + .1, A('那么今天讲的是写作') + .2, WR, CD, RIGHT) });
  sfx(WR, 'pickup', -10); sfx(CD, 'pickup', -10); sfx(RIGHT, 'thud', -8);

  // ---------------------------------------------------------------- 37 · 那么今天讲的是写作。写作除了选好模型之外，还要给它加一些约束。
  const TODAY = P('那么今天讲的是写作'), RULES = P('还要给它加一些约束');
  shot(A('那么今天讲的是写作'), A('好了接下来就是今天最重要的干货了'), { day: NIGHTK, fog: [34, 100],
    keys: [K(A('那么今天讲的是写作'), [104, G + 2.8, 76.6], [104, G + 2.2, 71], 52), K(A('好了接下来就是今天最重要的干货了'), [102.8, G + 2.6, 75.4], [104, G + 2.2, 71], 48)],
    act: t => { heige(104, G + 1, 71, { ...emotions(t, [[0, 'happy'], [RULES, 'determined']]), view: 'front' }); VX.sprite(bookImg, 104.9, G + 1.9, 71.4); },
    ui: (c, t) => { tagUI(c, '今天讲：写作', fadeIO(t, TODAY, RULES, .2)); if (t > RULES) stamp(c, t, RULES, '选好模型 + 加约束'); } });
  sfx(RULES, 'anvil_use', -10);


  // ======================================================================================= chunk 4: the skill and the four tips (356 to 570 s)
  const ENCH = { x: 100, z: 86 }, CRAFT = { x: 92, z: 82 }, ANV = { x: 116, z: 86 };   // enchanting table, crafting table, anvil
  // ---------------------------------------------------------------- 38 · 好了，接下来就是今天最重要的干货了，你仔细听好。
  const GOODS = P('最重要的干货了'), LISTEN = P('你仔细听好');
  shot(A('好了接下来就是今天最重要的干货了'), A('先说这个我自己做的开源skill'), { day: NIGHTK, fog: [34, 100], kicks: [[GOODS, .8]],
    keys: [K(A('好了接下来就是今天最重要的干货了'), [104, G + 6, 78], [ENCH.x, G + 2, ENCH.z], 64), K(A('先说这个我自己做的开源skill'), [ENCH.x + 3, G + 3.4, ENCH.z - 5.6], [ENCH.x, G + 2, ENCH.z], 56)],
    act: t => { heige(104, G + 1, 74, { ...emotions(t, [[0, 'excited'], [LISTEN, 'determined']]), view: 'back', walk: t * 1.2 }); },
    ui: (c, t) => { slam(c, t, GOODS, A('先说这个我自己做的开源skill') + .2, '干货来了', '#FFD34E', 170, 300); } });
  sfx(GOODS, 'levelup', -10); sfx(LISTEN, 'click', -9);

  // ---------------------------------------------------------------- 39 · 先说这个我自己做的开源 skill。skill 你可以理解成给 AI 准备的一套做事说明，装上以后，它改稿就按这套标准来。
  const MANUAL = P('给AI准备的一套做事说明'), INSTALL = P('装上以后');
  shot(A('先说这个我自己做的开源skill'), A('这个skill中文名叫说人话'), { day: NIGHTK, fog: [34, 100], kicks: [[INSTALL, .7]],
    keys: [K(A('先说这个我自己做的开源skill'), [ENCH.x + 3, G + 3.4, ENCH.z - 5.6], [ENCH.x, G + 2, ENCH.z], 56), K(INSTALL, [ENCH.x + 2.2, G + 3.0, ENCH.z - 4.4], [ENCH.x - .4, G + 2, ENCH.z], 50), K(A('这个skill中文名叫说人话'), [ENCH.x + 1.8, G + 2.9, ENCH.z - 4], [ENCH.x - .4, G + 2, ENCH.z], 48)],
    act: t => { const fly = sm(seg01(t, INSTALL, INSTALL + .8));
      VX.sprite(EBOOK[Math.floor(t * 4) % 2], ENCH.x + .5 + fly * (-2.2), G + 2.4 + .1 * Math.sin(t * 3) - fly * .2, ENCH.z + .5 - fly * 2.8);
      deepseek(ENCH.x - 1.8, G + 1, ENCH.z - 2.6, { ...emotions(t, [[0, 'neutral'], [INSTALL + .8, 'starstruck']]) }, { tag: t > INSTALL + .8 ? '大模型 · 已装说人话' : '大模型' });
      for (let i = 0; i < 10; i++) { const a = ((t * .7 + i / 10) % 1); VX.pt(ENCH.x + .5 + Math.sin(i * 2.3 + t) * 1.2, G + 1.5 + a * 2, ENCH.z + .5 + Math.cos(i * 1.9 + t) * 1.2, .05, [200, 160, 255], true); }
      if (t > INSTALL + .8) for (let i = 0; i < 6; i++) { const a = ((t * 1.1 + i / 6) % 1); VX.pt(ENCH.x - 1.8 + Math.sin(i * 2 + t * 3) * .5, G + 1.2 + a * 2.2, ENCH.z - 2.6, .05, [200, 160, 255], true); } },
    ui: (c, t) => { tagUI(c, 'skill = 给 AI 的一套做事说明', fadeIO(t, MANUAL - .1, A('这个skill中文名叫说人话') + .2, .2)); if (t > INSTALL + .8) toast(c, t, INSTALL + .8, A('这个skill中文名叫说人话') + .2, '附魔成功', '改稿按这套标准来', 'book', '#B48CF0'); } });
  sfx(MANUAL, 'page', -10); sfx(INSTALL, 'enchant', -8); sfx(INSTALL + .8, 'toast', -11);

  // ---------------------------------------------------------------- 40 · 这个 skill 中文名叫说人话，项目名叫 heige shuorenhua …… 也是 MIT 协议，免费用。（游戏窗口：项目卡）
  const PJ0 = P('这个skill中文名叫说人话') - .2, PJ1 = A('那它具体管什么呢') + .05;
  shot(A('这个skill中文名叫说人话'), PJ1, { day: NIGHTK, fog: [34, 100],
    keys: [K(A('这个skill中文名叫说人话'), [ENCH.x + 1.8, G + 2.9, ENCH.z - 4], [ENCH.x - .4, G + 2, ENCH.z], 48), K(PJ1, [ENCH.x + 1.4, G + 2.8, ENCH.z - 3.6], [ENCH.x - .4, G + 2, ENCH.z], 46)],
    act: t => deepseek(ENCH.x - 1.8, G + 1, ENCH.z - 2.6, { ...feel('happy', t) }, { tag: false }),
    ui: (c, t) => guiWin(c, t, PJ0, PJ1, '开源项目 · 说人话 skill') });
  slot(PJ0 + .25, PJ1 - .25, 'projectCard'); sfx(PJ0, 'chest', -10); sfx(P('heigeshuorenhua'), 'ding', -10); sfx(P('MIT协议'), 'xp', -11);

  // ---------------------------------------------------------------- 41 · 那它具体管什么呢？它会把你写好的东西改成人话，它会遵守你原文的内容，不会导致幻觉 …… 只去改说法。
  const KEEP = P('它会遵守你原文的内容'), HALL = P('不会导致幻觉'), ONLY = P('只去改说法');
  shot(PJ1, A('它专门去抓两类毛病'), { day: NIGHTK, fog: [34, 100], noWhoosh: true,
    keys: [K(PJ1, [ENCH.x + 1, G + 3, ENCH.z - 5], [ENCH.x - 1.4, G + 2, ENCH.z - 1], 54), K(A('它专门去抓两类毛病'), [ENCH.x + .6, G + 2.9, ENCH.z - 4.4], [ENCH.x - 1.4, G + 2, ENCH.z - 1], 50)],
    act: t => deepseek(ENCH.x - 1.8, G + 1, ENCH.z - 2.6, { ...emotions(t, [[0, 'neutral'], [ONLY, 'happy']]) }, { tag: '大模型 · 已装说人话' }),
    ui: (c, t) => keepCard(c, t, PJ1 + .1, A('它专门去抓两类毛病') + .2, KEEP, HALL, ONLY) });
  sfx(KEEP, 'click', -11); sfx(HALL, 'click', -11); sfx(ONLY, 'ding', -10);

  // ---------------------------------------------------------------- 42 · 它专门去抓两类毛病。一类是格式上的 …… 另一类是说话的套路 …… 这种套话。
  const TWO = P('它专门去抓两类毛病'), FMT = P('一类是格式上的'), DASH = P('像破折号'), SUM = P('每段最后来一句总结升华'), NUMS = P('一句话里塞好几个数字'), PAT = P('另一类是说话的套路'), NOTB = P('像不是什么而是什么'), CLI = P('还有首先其次');
  shot(A('它专门去抓两类毛病'), A('它还带了一个检查脚本'), { day: NIGHTK, fog: [34, 100],
    keys: [K(A('它专门去抓两类毛病'), [ENCH.x + .6, G + 2.9, ENCH.z - 4.4], [ENCH.x - 1.4, G + 2, ENCH.z - 1], 50), K(A('它还带了一个检查脚本'), [ENCH.x + 1.4, G + 3.1, ENCH.z - 5.2], [ENCH.x - 1.4, G + 2, ENCH.z - 1], 54)],
    act: t => deepseek(ENCH.x - 1.8, G + 1, ENCH.z - 2.6, { ...feel('determined', t) }, { tag: '大模型 · 已装说人话' }),
    ui: (c, t) => twoFaults(c, t, TWO - .1, A('它还带了一个检查脚本') + .2, [[FMT, '格式上的', [['破折号', DASH], ['每段末尾总结升华', SUM], ['一句塞好几个数字', NUMS]]], [PAT, '说话的套路', [['不是…而是…', NOTB], ['首先其次', CLI], ['综上所述 · 值得注意的是', CLI + 1.4]]]]) });
  [DASH, SUM, NUMS, NOTB, CLI, CLI + 1.4].forEach(x => sfx(x, 'crack', -11)); sfx(FMT, 'click', -10); sfx(PAT, 'click', -10);

  // ---------------------------------------------------------------- 43 · 它还带了一个检查脚本，有硬伤就直接报错，错误清零了才算改完。（游戏窗口：真实运行记录）
  const LN0 = P('它还带了一个检查脚本') - .2, LN1 = A('开头我说上期稿子改到第13版') + .05;
  shot(A('它还带了一个检查脚本'), LN1, { day: NIGHTK, fog: [30, 90],
    keys: [K(A('它还带了一个检查脚本'), [DESK.x + 2.6, G + 2.8, DESK.z + 4.6], [DESK.x, G + 2.1, DESK.z + .5], 56), K(LN1, [DESK.x + 2.0, G + 2.6, DESK.z + 3.8], [DESK.x, G + 2.1, DESK.z + .5], 50)],
    act: t => heige(DESK.x, G + 1, DESK.z + 1.8, { ...feel('determined', t), view: 'back' }),
    ui: (c, t) => guiWin(c, t, LN0, LN1, '终端 · 说人话检查脚本') });
  slot(LN0 + .25, LN1 - .25, 'lintRun'); sfx(LN0, 'type_burst', -11); sfx(P('有硬伤就直接报错'), 'glitch', -10); sfx(P('错误清零了才算改完'), 'ding', -10);

  // ---------------------------------------------------------------- 44 · 开头我说上期稿子改到第 13 版，问题出在哪呢？（游戏窗口：13 个版本的文件）
  const FL0 = P('开头我说上期稿子改到第13版') - .2, FL1 = A('我回头去数了一下') + .05;
  shot(LN1, FL1, { day: NIGHTK, fog: [30, 90], noWhoosh: true,
    keys: [K(LN1, [DESK.x + 2.0, G + 2.6, DESK.z + 3.8], [DESK.x, G + 2.1, DESK.z + .5], 50), K(FL1, [DESK.x + 1.8, G + 2.6, DESK.z + 3.6], [DESK.x, G + 2.1, DESK.z + .5], 48)],
    act: t => heige(DESK.x, G + 1, DESK.z + 1.8, { ...feel('thinking', t), view: 'back' }),
    ui: (c, t) => guiWin(c, t, FL0, FL1, '上期 · 00-文案') });
  slot(FL0 + .25, FL1 - .25, 'fileList'); sfx(FL0, 'page', -10);

  // ---------------------------------------------------------------- 45 · 我回头去数了一下，第一版每 1000 个字里就有 21 个数字 …… 像在念报告。（游戏窗口：第一次录音的稿子）
  const NM0 = P('我回头去数了一下') - .2, NM1 = A('按这套标准去改完以后') + .05;
  shot(FL1, NM1, { day: NIGHTK, fog: [30, 90], noWhoosh: true,
    keys: [K(FL1, [DESK.x + 1.8, G + 2.6, DESK.z + 3.6], [DESK.x, G + 2.1, DESK.z + .5], 48), K(NM1, [DESK.x + 1.6, G + 2.6, DESK.z + 3.4], [DESK.x, G + 2.1, DESK.z + .5], 46)],
    act: t => heige(DESK.x, G + 1, DESK.z + 1.8, { ...feel('disgusted', t), view: 'back' }),
    ui: (c, t) => guiWin(c, t, NM0, NM1, '上期 · 第一次录音用的稿子') });
  slot(NM0 + .25, NM1 - .25, 'v1Numbers'); sfx(P('就有21个数字'), 'glitch', -10); sfx(P('每1000字只有一两个'), 'ding', -11); sfx(P('像在念报告'), 'sad', -12);

  // ---------------------------------------------------------------- 46 · 按这套标准去改完以后，我才觉得像人话了。
  const HUMAN = P('我才觉得像人话了');
  shot(NM1, A('接下来是4个小技巧'), { day: NIGHTK, fog: [30, 90], noWhoosh: true,
    keys: [K(NM1, [DESK.x + 1.2, G + 2.6, DESK.z + 5.4], [DESK.x, G + 2.2, DESK.z + 1.8], 52), K(A('接下来是4个小技巧'), [DESK.x + 1.0, G + 2.6, DESK.z + 4.8], [DESK.x, G + 2.2, DESK.z + 1.8], 48)],
    act: t => { heige(DESK.x, G + 1, DESK.z + 2, { ...emotions(t, [[0, 'neutral'], [HUMAN, 'happy']]), view: 'front' }); VX.sprite(MIC[1], DESK.x + .9, G + 2, DESK.z + .5); },
    ui: (c, t) => { if (t > HUMAN) toast(c, t, HUMAN, A('接下来是4个小技巧') + .3, '进度达成！', '像人话了', 'star'); } });
  sfx(HUMAN, 'levelup', -10);

  // ---------------------------------------------------------------- 47 · 接下来是 4 个小技巧。第一个技巧，就是上期我答应你的，怎么喂例子 …… 其实按三步走就行。
  const T1 = P('第一个技巧'), PROMISE = P('就是上期我答应你的'), STEPS = P('其实按三步走就行');
  shot(A('接下来是4个小技巧'), A('第一步例子要用你本人说的话'), { day: NIGHTK, fog: [30, 90],
    keys: [K(A('接下来是4个小技巧'), [CRAFT.x + 3.4, G + 3.4, CRAFT.z + 5], [CRAFT.x, G + 1.6, CRAFT.z], 58), K(A('第一步例子要用你本人说的话'), [CRAFT.x + 2.4, G + 3.0, CRAFT.z + 4], [CRAFT.x, G + 1.6, CRAFT.z], 52)],
    act: t => heige(CRAFT.x - 1.4, G + 1, CRAFT.z + 1.4, { ...emotions(t, [[0, 'happy'], [STEPS, 'determined']]), view: 'q' }),
    ui: (c, t) => { tipBanner(c, t, A('接下来是4个小技巧') + .2, T1 - .1, '4 个小技巧', ''); tipBanner(c, t, T1 - .1, A('第一步例子要用你本人说的话') + .2, '技巧 1', '怎么喂例子 · 上期答应你的'); } });
  sfx(T1 - .1, 'toast', -10); sfx(STEPS, 'click', -10);

  // ---------------------------------------------------------------- 48 · 第一步 …… 第二步 …… 第三步 ……（游戏窗口：提示词模板，三步）
  const TP0 = P('第一步例子要用你本人说的话') - .2, TP1 = A('这里有个坑') + .05;
  shot(A('第一步例子要用你本人说的话'), TP1, { day: NIGHTK, fog: [30, 90],
    keys: [K(A('第一步例子要用你本人说的话'), [CRAFT.x + 2.4, G + 3.0, CRAFT.z + 4], [CRAFT.x, G + 1.6, CRAFT.z], 52), K(TP1, [CRAFT.x + 2.0, G + 2.9, CRAFT.z + 3.6], [CRAFT.x, G + 1.6, CRAFT.z], 50)],
    act: t => heige(CRAFT.x - 1.4, G + 1, CRAFT.z + 1.4, { ...feel('determined', t), view: 'q' }),
    ui: (c, t) => guiWin(c, t, TP0, TP1, '合成台 · 喂例子的提示词') });
  slot(TP0 + .25, TP1 - .25, 'promptTip1'); [P('第一步'), P('第二步'), P('第三步')].forEach(x => sfx(x, 'place', -9));

  // ---------------------------------------------------------------- 49 · 这里有个坑，就是随手丢几篇旧稿子给它 …… 当然我测得不多，你就当个提醒。
  const PIT = P('这里有个坑'), OLDD = P('就是随手丢几篇旧稿子给它'), BAD = P('一些句式是有问题的'), STILL = P('最后出来的还是有AI味'), FEW = P('当然我测得不多');
  shot(TP1, A('第二个技巧'), { day: NIGHTK, fog: [30, 90], noWhoosh: true, kicks: [[PIT, .8]],
    keys: [K(TP1, [CRAFT.x + 2.0, G + 2.9, CRAFT.z + 3.6], [CRAFT.x - .4, G + 1.8, CRAFT.z], 50), K(A('第二个技巧'), [CRAFT.x + 1.6, G + 2.8, CRAFT.z + 3.2], [CRAFT.x - .4, G + 1.8, CRAFT.z], 48)],
    act: t => { heige(CRAFT.x - 1.4, G + 1, CRAFT.z + 1.4, { ...emotions(t, [[0, 'surprised'], [STILL, 'disgusted'], [FEW, 'neutral']]), view: 'q' });
      if (t > OLDD) { for (let i = 0; i < 3; i++) VX.sprite(paperImg, CRAFT.x + .2 + i * .35, G + 2.0 + i * .05, CRAFT.z + .5); }
      if (t > STILL) for (let i = 0; i < 8; i++) { const a = ((t * .8 + i / 8) % 1); VX.pt(CRAFT.x + .6 + Math.sin(i * 2 + t) * .4, G + 2.1 + a * 1.6, CRAFT.z + .6, .1 * (1 - a) + .04, [150, 140, 170]); } },
    ui: (c, t) => { slam(c, t, PIT, OLDD + .6, '有个坑', '#FF6A5A', 150, 300); if (t > BAD) tagUI(c, '旧稿没审仔细 · 句式本来就有问题', fadeIO(t, BAD, FEW, .2)); if (t > STILL) slam(c, t, STILL, FEW, '学出来还是 AI 味', '#FF6A5A', 110, 300);
      tagUI(c, '我测得不多 · 当个提醒', fadeIO(t, FEW, A('第二个技巧') + .3, .2)); } });
  sfx(PIT, 'hit', -9); sfx(OLDD, 'pickup', -11); sfx(STILL, 'sizzle', -12);

  // ---------------------------------------------------------------- 50 · 第二个技巧，先自己说一遍 …… 然后跟 AI 说这么一句话 ……（游戏窗口：提示词）…… 核心就是自己的观点表达。
  const T2 = P('第二个技巧'), PHONE = P('你对着手机'), SAY0 = P('然后跟AI说这么一句话') - .2, SAY1 = A('这样出来的东西') + .05, CORE = P('核心就是自己的观点表达');
  shot(A('第二个技巧'), SAY0, { day: NIGHTK, fog: [30, 90],
    keys: [K(A('第二个技巧'), [DESK.x - 2.6, G + 2.8, DESK.z + 7.4], [DESK.x - .4, G + 2.2, DESK.z + 4], 56), K(SAY0, [DESK.x - 1.8, G + 2.6, DESK.z + 6.6], [DESK.x - .4, G + 2.2, DESK.z + 4], 50)],
    act: t => { heige(DESK.x - .4, G + 1, DESK.z + 4, { ...emotions(t, [[0, 'happy'], [PHONE, 'determined']]), view: 'front', poseR: t > PHONE ? 'chin' : undefined });
      if (t > PHONE) for (let i = 0; i < 5; i++) { const a = ((t * .9 + i / 5) % 1); VX.pt(DESK.x - .4 + .4 + a * 1.2, G + 2.6 + Math.sin(a * 6 + i) * .15, DESK.z + 4.3, .07, [255, 211, 78], true); } },
    ui: (c, t) => { tipBanner(c, t, T2 - .1, P('比如你想发个朋友圈') - .1, '技巧 2', '先自己说一遍'); if (t > PHONE) tagUI(c, '对着手机说半分钟 → 转成文字', fadeIO(t, PHONE, SAY0, .2)); } });
  sfx(T2 - .1, 'toast', -10); sfx(PHONE, 'click', -10);
  shot(SAY0, SAY1, { day: NIGHTK, fog: [30, 90], noWhoosh: true,
    keys: [K(SAY0, [DESK.x - 1.8, G + 2.6, DESK.z + 6.6], [DESK.x - .4, G + 2.2, DESK.z + 4], 50), K(SAY1, [DESK.x - 1.6, G + 2.6, DESK.z + 6.2], [DESK.x - .4, G + 2.2, DESK.z + 4], 48)],
    act: t => heige(DESK.x - .4, G + 1, DESK.z + 4, { ...feel('determined', t), view: 'front' }),
    ui: (c, t) => guiWin(c, t, SAY0, SAY1, '对话框 · 复制就能用') });
  slot(SAY0 + .25, SAY1 - .25, 'promptTip2'); sfx(SAY0, 'chat', -10); sfx(P('不许改我的说法'), 'thud', -10);
  shot(SAY1, A('第三个技巧'), { day: NIGHTK, fog: [30, 90], noWhoosh: true,
    keys: [K(SAY1, [DESK.x - 1.6, G + 2.6, DESK.z + 6.2], [DESK.x - .4, G + 2.2, DESK.z + 4], 48), K(A('第三个技巧'), [DESK.x - 1.4, G + 2.6, DESK.z + 5.8], [DESK.x - .4, G + 2.2, DESK.z + 4], 46)],
    act: t => heige(DESK.x - .4, G + 1, DESK.z + 4, { ...emotions(t, [[0, 'neutral'], [CORE, 'proud']]), view: 'front' }),
    ui: (c, t) => { if (t > CORE) stamp(c, t, CORE, '核心是你的观点'); } });
  sfx(CORE, 'thud', -9);

  // ---------------------------------------------------------------- 51 · 第三个技巧，让它多写几版，你再来挑 ……（游戏窗口：5 篇打分）…… 也一定要人工复核修改 …… 持续迭代自己的 Skill ……
  const T3 = P('第三个技巧'), FIVE0 = P('我们可以让AI生成5篇文章') - .2, FIVE1 = A('而且你可以持续迭代') + .05, ITER = P('而且你可以持续迭代'), RULE = P('AI在每次生成的时候就会参考这套规则');
  shot(A('第三个技巧'), FIVE0, { day: NIGHTK, fog: [30, 90],
    keys: [K(A('第三个技巧'), [ANV.x - 3.4, G + 3.0, ANV.z + 5], [ANV.x, G + 1.8, ANV.z], 56), K(FIVE0, [ANV.x - 2.6, G + 2.8, ANV.z + 4.2], [ANV.x, G + 1.8, ANV.z], 50)],
    act: t => heige(ANV.x - 1.6, G + 1, ANV.z + 1.4, { ...feel('happy', t), view: 'q' }),
    ui: (c, t) => tipBanner(c, t, T3 - .1, FIVE0, '技巧 3', '让它多写几版 · 你再来挑') });
  sfx(T3 - .1, 'toast', -10);
  shot(FIVE0, FIVE1, { day: NIGHTK, fog: [30, 90], noWhoosh: true,
    keys: [K(FIVE0, [ANV.x - 2.6, G + 2.8, ANV.z + 4.2], [ANV.x, G + 1.8, ANV.z], 50), K(FIVE1, [ANV.x - 2.2, G + 2.7, ANV.z + 3.8], [ANV.x, G + 1.8, ANV.z], 48)],
    act: t => heige(ANV.x - 1.6, G + 1, ANV.z + 1.4, { ...feel('thinking', t), view: 'q' }),
    ui: (c, t) => guiWin(c, t, FIVE0, FIVE1, '对话框 · 写 5 篇 打分') });
  slot(FIVE0 + .25, FIVE1 - .25, 'promptTip3'); for (let i = 0; i < 5; i++) sfx(P('给它们打分') + i * .2, 'xp_' + (1 + i % 4), -12); sfx(P('选出质量最高的一篇'), 'levelup', -12); sfx(P('也一定要人工复核修改'), 'anvil', -10);
  shot(FIVE1, A('第四个技巧最简单'), { day: NIGHTK, fog: [30, 90], noWhoosh: true,
    keys: [K(FIVE1, [ENCH.x + 3, G + 3.2, ENCH.z - 5], [ENCH.x, G + 2, ENCH.z], 56), K(A('第四个技巧最简单'), [ENCH.x + 2.2, G + 3.0, ENCH.z - 4.2], [ENCH.x, G + 2, ENCH.z], 50)],
    act: t => { const pg = Math.min(4, Math.floor(seg01(t, ITER, RULE) * 4)); VX.sprite(EBOOK[Math.floor(t * 4) % 2], ENCH.x + .5, G + 2.4 + .1 * Math.sin(t * 3), ENCH.z + .5);
      for (let i = 0; i < 10; i++) { const a = ((t * .7 + i / 10) % 1); VX.pt(ENCH.x + .5 + Math.sin(i * 2.3 + t) * 1.2, G + 1.5 + a * 2, ENCH.z + .5 + Math.cos(i * 1.9 + t) * 1.2, .05, [200, 160, 255], true); }
      label(ENCH.x + .5, G + 3.2, ENCH.z + .5, `说人话 skill · 第 ${1 + pg} 版`, .16, '#E8D8FF', t, ITER); },
    ui: (c, t) => { tagUI(c, '持续迭代你的 skill：新的要求、风格习惯补进去', fadeIO(t, ITER, A('第四个技巧最简单') + .2, .2)); } });
  sfx(ITER, 'enchant', -10); for (let i = 1; i <= 3; i++) sfx(ITER + (RULE - ITER) * i / 4, 'page', -12);

  // ---------------------------------------------------------------- 52 · 第四个技巧最简单，写完念一遍，或者闭上眼睛听一遍 …… 就把它删除或者修改。这是一个笨方法，但也是最有效的。
  const T4 = P('第四个技巧最简单'), READ = P('写完念一遍'), EYES = P('或者闭上眼睛听一遍'), ODD = P('哪句话你自己平时根本不会这么说'), FIXIT = P('就把它删除或者修改'), DUMB = P('这是一个笨方法');
  const LINE = { x: DESK.x + 6, z: DESK.z + 1 };   // a row of five sentence blocks in front of the desk; the odd one breaks
  VXE.push([FIXIT, LINE.x + 2, G + 1, LINE.z, null]); VXE.push([FIXIT + .5, LINE.x + 2, G + 1, LINE.z, 'paperSoft']);
  shot(A('第四个技巧最简单'), A('我们再回到开头那个排名'), { day: NIGHTK, fog: [30, 90], kicks: [[FIXIT, .9]],
    keys: [K(A('第四个技巧最简单'), [LINE.x + 1.5, G + 4.2, LINE.z + 10], [LINE.x + 1.5, G + 1.6, LINE.z], 58), K(ODD, [LINE.x + 2, G + 3.6, LINE.z + 8.4], [LINE.x + 2, G + 1.4, LINE.z], 54), K(A('我们再回到开头那个排名'), [LINE.x + 2, G + 3.4, LINE.z + 8], [LINE.x + 2, G + 1.4, LINE.z], 52)],
    act: t => { heige(LINE.x - 1.2, G + 1, LINE.z + 1.4, { ...emotions(t, [[0, 'happy'], [EYES, 'sleepy'], [ODD, 'suspicious'], [FIXIT, 'determined'], [DUMB, 'proud']]), view: 'q' });
      if (t > READ && t < ODD) for (let i = 0; i < 4; i++) { const a = ((t * 1.2 + i / 4) % 1); VX.pt(LINE.x - .6 + a * 4, G + 2.6, LINE.z + 1.0, .06, [255, 211, 78], true); }
      if (t > ODD && t < FIXIT) label(LINE.x + 2.5, G + 2.4, LINE.z + .6, '这句我不会这么说', .3, '#FF8A70', t, ODD);
      if (t > FIXIT && t < FIXIT + .9) burst(t, FIXIT, LINE.x + 2.5, G + 1.5, LINE.z + .5, [240, 230, 210], 22); },
    ui: (c, t) => { tipBanner(c, t, T4 - .1, ODD - .2, '技巧 4', '写完念一遍 · 闭上眼睛听一遍'); if (t > DUMB) stamp(c, t, DUMB, '笨方法 · 最有效'); } });
  for (let i = 0; i < 5; i++) VXE.push([0, LINE.x + i, G + 1, LINE.z, i === 2 ? 'wred' : 'paperSoft']);
  sfx(T4 - .1, 'toast', -10); sfx(READ, 'page', -12); sfx(ODD, 'hit', -10); sfx(FIXIT, 'break', -8); sfx(FIXIT + .5, 'place', -9); sfx(DUMB, 'thud', -8);


  // ======================================================================================= chunk 5: back to the leaderboards, the end (570 s to the end)
  // ---------------------------------------------------------------- 53 · 我们再回到开头那个排名 …… 原因就是它的技能点没往写作上加。机器味既然是训练出来的，那你也可以用 skill 来调整它的输出质量。
  const BACK = P('我们再回到开头那个排名'), NOPT = P('原因就是它的技能点没往写作上加'), TRAINED = P('机器味既然是训练出来的'), TUNE = P('用skill来调整它的输出质量');
  const bookPos = t => { const u = sm(seg01(t, TUNE - .2, TUNE + 1)); return [lerp(104.5, TRX, u), lerp(G + 6, rankY(39) + .6, u) + Math.sin(u * Math.PI) * 4, lerp(60, TFZ + 1, u)]; };
  shot(A('我们再回到开头那个排名'), A('那你见过最有机器味的一句AI话是什么'), { day: NIGHTK, fog: [44, 120], kicks: [[TUNE + 1, .7]],
    keys: [K(A('我们再回到开头那个排名'), [104.5, G + 16.5, 92], [104.5, G + 15.5, TZ1], 62), K(TRAINED, [104.5, G + 15.5, 86], [104.5, G + 15, TZ1], 60), K(TUNE + .3, [TRX - 3, rankY(39) + 3, 62], [TRX, rankY(39), TZ1], 58), K(A('那你见过最有机器味的一句AI话是什么'), [TRX - 3.4, rankY(39) + 2.6, 58], [TRX, rankY(39), TZ1], 54)],
    act: t => { modelBlock(TLX, rankY(2) - .45, TFZ + .4, 'happy', { tag: false }); const glow = t > TUNE + 1;
      modelBlock(TRX, rankY(39) - .45, TFZ + .4, glow ? 'happy' : 'ko', { tag: glow ? '装上说人话 skill' : false, tagCol: '#E8D8FF' });
      label(TLX, G + TH + 2.6, TFZ + .6, '写代码榜', 2.0, '#FFFFFF', t, BACK); label(TRX, G + TH + 2.6, TFZ + .6, '写作榜', 2.0, '#FFFFFF', t, BACK);
      label(TLX - 5.4, rankY(2) - .4, TFZ, '#2', 2.4, '#FFD34E', t, BACK + .5); label(TRX + 5.4, rankY(39), TFZ, '#39', 2.4, '#FF8A70', t, BACK + .9);
      if (t > TUNE - .2 && t < TUNE + 1) { const b = bookPos(t); VX.sprite(EBOOK[Math.floor(t * 4) % 2], ...b); for (let i = 0; i < 5; i++) { const q = bookPos(t - i * .05); VX.pt(q[0], q[1] - .2, q[2], .06, [200, 160, 255], true); } }
      if (glow) for (let i = 0; i < 10; i++) { const a = ((t * .8 + i / 10) % 1); VX.pt(TRX + Math.sin(i * 2.3 + t * 2) * .9, rankY(39) - .8 + a * 2, TFZ + .6, .06, [200, 160, 255], true); } },
    ui: (c, t) => { if (t > NOPT - .3 && t < TRAINED) skillTree(c, t, NOPT - .3, TRAINED, -1, NOPT, NOPT); tagUI(c, '机器味是训练出来的', fadeIO(t, TRAINED, TUNE, .2)); } });
  sfx(BACK, 'whoosh', -11); sfx(NOPT, 'click', -10); sfx(TUNE - .2, 'enchant', -8); sfx(TUNE + 1, 'levelup', -10);

  // ---------------------------------------------------------------- 54 · 那你见过最有机器味的一句 AI 话是什么？评论区说一句就行。
  const CMT = P('评论区说一句就行');
  shot(A('那你见过最有机器味的一句AI话是什么'), A('如果你也想把AI一件一件用明白'), { day: NIGHTK, fog: [30, 90],
    keys: [K(A('那你见过最有机器味的一句AI话是什么'), [104, G + 2.8, 77], [104, G + 2.2, 71], 56), K(A('如果你也想把AI一件一件用明白'), [104, G + 2.7, 76], [104, G + 2.2, 71], 52)],
    act: t => heige(104, G + 1, 71, { ...emotions(t, [[0, 'mischief'], [CMT, 'happy']]), view: 'front', poseR: t > CMT ? 'point' : undefined }),
    ui: (c, t) => { questionCard(c, t, A('那你见过最有机器味的一句AI话是什么') + .2, A('如果你也想把AI一件一件用明白') + .2, '你见过最有机器味的', '一句 AI 话是什么？'); commentBox(c, t, CMT - .1, A('如果你也想把AI一件一件用明白') + .2); } });
  sfx(CMT, 'chat', -10);

  // ---------------------------------------------------------------- 55 · 如果你也想把 AI 一件一件用明白，就关注一下问问黑哥。
  shot(A('如果你也想把AI一件一件用明白'), A('喜欢的话点个赞'), { day: NIGHTK, fog: [30, 90],
    keys: [K(A('如果你也想把AI一件一件用明白'), [104, G + 2.7, 76], [104, G + 2.2, 71], 52), K(A('喜欢的话点个赞'), [104, G + 2.6, 75.2], [104, G + 2.2, 71], 48)],
    act: t => heige(104, G + 1, 71, { ...feel('happy', t), view: 'front', poseR: 'wave' }),
    ui: (c, t) => followCard2(c, t, P('就关注一下问问黑哥') - .3, A('喜欢的话点个赞') + .2) });
  sfx(P('就关注一下问问黑哥'), 'toast', -10);

  // ---------------------------------------------------------------- 56 · 喜欢的话点个赞，顺便转发给那个天天让 AI 帮他写朋友圈的朋友。
  const SHARE = P('顺便转发给那个天天让AI帮他写朋友圈的朋友');
  shot(A('喜欢的话点个赞'), A('我是黑哥'), { day: NIGHTK, fog: [30, 90],
    keys: [K(A('喜欢的话点个赞'), [104, G + 2.6, 75.2], [104, G + 2.2, 71], 48), K(A('我是黑哥'), [104, G + 2.7, 76], [104, G + 2.2, 71], 52)],
    act: t => heige(104, G + 1, 71, { ...emotions(t, [[0, 'happy'], [SHARE, 'mischief']]), view: 'front' }),
    ui: (c, t) => { likeUI(c, t, P('喜欢的话点个赞')); if (t > SHARE) tagUI(c, '转发给天天让 AI 写朋友圈的朋友', fadeIO(t, SHARE, A('我是黑哥') + .2, .2)); } });
  sfx(P('喜欢的话点个赞'), 'pop', -9); sfx(SHARE, 'chat', -11);

  // ---------------------------------------------------------------- 57 · 我是黑哥，不吹AI也不恐惧AI，只说真话。（三个一起挥手，烟花，收黑）
  const END = DD.len;
  shot(A('我是黑哥'), END + 1, { day: t => lerp(NIGHTK(t), .05, seg01(t, LS('我是黑哥'), END)), fog: [30, 100],
    keys: [K(A('我是黑哥'), [104, G + 3.4, 79], [104, G + 2.4, 70], 60), K(END, [104, G + 8, 96], [104, G + 3.4, 70], 64)],
    act: t => { heige(104, G + 1, 71, { ...feel('happy', t), view: 'front', poseR: 'wave' }); deepseek(101.2, G + 1, 70.6, { ...feel('happy', t), dy: Math.round(Math.sin(t * 6)) * 2 }, { tag: false }); codex(106.8, G + 1, 70.6, 'happy', t, { tag: false });
      firework(104, G + 9, 62, (t - LS('我是黑哥')) % 1.6); },
    ui: (c, t) => { const k = seg01(t, END - .6, END); if (k > 0) { c.fillStyle = `rgba(4,3,10,${k})`; c.fillRect(0, 0, 1920, 1080); } } });
  sfx(LS('我是黑哥'), 'firework', -12); sfx(LS('我是黑哥') + 1.6, 'firework', -14);


  // a game window: the world dims, a grey container frame with a title, a dark slot the inlay is laid into
  function guiWin(c, t, t0, t1, title) {
    const a = sm(seg01(t, t0, t0 + .22)) * (1 - sm(seg01(t, t1 - .22, t1)));
    if (a <= 0) return;
    const { x, y, w, h } = GUI, k = .92 + .08 * a;
    c.save(); c.fillStyle = `rgba(6,4,12,${.55 * a})`; c.fillRect(0, 0, 1920, 1080);
    c.globalAlpha = a; c.translate(960, 540); c.scale(k, k); c.translate(-960, -540);
    panel(c, x - 26, y - 86, w + 52, h + 112, true);
    outlined(c, title, x + 4, y - 44, 38, '#3A3A3A', { lw: 0, shadow: false, align: 'left' });
    c.fillStyle = '#0B0F16'; c.fillRect(x, y, w, h);
    c.fillStyle = '#373737'; c.fillRect(x - 4, y - 4, w + 8, 4); c.fillRect(x - 4, y - 4, 4, h + 8);
    c.restore();
  }

  // ======================================================================================= the overlay pieces
  const FONT = '"PingFang SC", "HarmonyOS Sans SC", sans-serif';
  function outlined(c, txt, x, y, size, fill, o = {}) {
    c.font = `${o.w || 900} ${size}px ${FONT}`; c.textAlign = o.align || 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
    if (o.shadow !== false) { c.fillStyle = 'rgba(8,4,12,.55)'; c.fillText(txt, x + size * .07, y + size * .07); }
    if ((o.lw ?? 1) > 0) { c.lineWidth = o.lw ?? Math.max(6, size * .16); c.strokeStyle = o.stroke || '#140A10'; c.strokeText(txt, x, y); }
    c.fillStyle = fill; c.fillText(txt, x, y);
  }
  const fadeIO = (t, t0, t1, d = .25) => sm(seg01(t, t0, t0 + d)) * (1 - sm(seg01(t, t1 - d, t1)));
  const D = window.SHUOHUA_DATA || { cues: [], keys: [] };
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
    for (const [x, y, z, txt, size, col, age, left] of LBLS) { const p = VX.project(x, y, z, 6); if (p.cz < .3 || p.cz > 70) continue; const s = Math.max(26, Math.min(220, p.k * 6 * size)) * (1 + .4 * Math.exp(-age * 8));
      c.save(); c.globalAlpha = Math.min(1, age * 5) * Math.min(1, left * 4); outlined(c, txt, p.x, p.y, s, col, { lw: s * .14, stroke: col === '#3A1E10' ? '#F2D29A' : '#140A10' }); c.restore(); }
    for (const [x, y, z, txt, age, left] of BUBS) { const p = VX.project(x, y, z, 6); if (p.cz < .3) continue; const k = Math.min(1, age * 6) * Math.min(1, left * 5), s = 50;
      c.save(); c.globalAlpha = k; c.font = `900 ${s}px ${FONT}`; const w = c.measureText(txt).width + 60, bx = Math.max(20, Math.min(1900 - w, p.x - w / 2)), by = p.y - 150;
      c.fillStyle = '#FFFFFF'; c.strokeStyle = '#140A10'; c.lineWidth = 6; c.beginPath(); c.roundRect(bx, by, w, 96, 18); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(p.x - 18, by + 94); c.lineTo(p.x, by + 130); c.lineTo(p.x + 18, by + 94); c.fill(); c.stroke(); c.fillStyle = '#FFFFFF'; c.fillRect(p.x - 15, by + 88, 30, 8);
      c.fillStyle = '#140A10'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, bx + w / 2, by + 50); c.restore(); }
  }
  function rope(x0, y0, z0, x1, y1, z1, slack = .35) { for (let i = 0; i <= 22; i++) { const u = i / 22; VX.pt(lerp(x0, x1, u), lerp(y0, y1, u) - Math.sin(u * Math.PI) * slack, lerp(z0, z1, u), .06, [150, 100, 60]); } }
  function firework(x, y, z, a) { for (const [k, off] of [[0, 0], [1, .35]]) { const b = a - off; if (b < 0 || b > 1.2) continue; for (let i = 0; i < 26; i++) { const th = i / 26 * Math.PI * 2, ph = hh(i, k) * 2 - 1, r = b * 2.2; VX.pt(x + Math.cos(th) * r * .8, y + 1 + ph * r * .7 - b * b, z + Math.sin(th) * r * .5, .07, [[255, 210, 90], [255, 120, 160], [180, 140, 255]][(i + k) % 3], true); } } }

  // ======================================================================================= V058 overlay pieces
  // a WeChat-moments style post an AI wrote: the template phrases light up red once the voice says 那股 AI 味
  function postCard(c, t, t0, t1, hl) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .25), sl = 1 - sm(seg01(t, t0, t0 + .3));
    const x = 1000 + sl * 260, y = 140, w = 860, L = [['在这个快节奏的时代，'], ['周末', '不是', '用来躺平的，', '而是', '用来重新出发的', '——'], ['愿你我都能', '在平凡中找到属于自己的光。']];
    const BAD = new Set(['在这个快节奏的时代，', '不是', '而是', '——', '愿你我都能']);
    c.save(); c.globalAlpha = a; c.fillStyle = '#F7F8FA'; c.fillRect(x, y, w, 470); c.fillStyle = '#E9ECF1'; c.fillRect(x, y, w, 70);
    c.font = `800 30px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = '#4B5563'; c.fillText('朋友圈 · AI 帮我写的', x + 30, y + 36);
    c.fillStyle = '#9DB4FF'; c.fillRect(x + 30, y + 100, 72, 72); c.fillStyle = '#111827'; c.font = `800 32px ${FONT}`; c.fillText('我', x + 124, y + 124);
    let yy = y + 220; c.font = `700 36px ${FONT}`;
    for (const line of L) { let xx = x + 30; for (const part of line) { const wd = c.measureText(part).width; const on = t > hl && BAD.has(part);
        if (on) { const k = sm(seg01(t, hl, hl + .3)); c.fillStyle = `rgba(232,58,68,${.22 * k})`; c.fillRect(xx - 2, yy - 26, wd + 4, 52); c.fillStyle = '#E83A44'; c.fillRect(xx, yy + 24, wd * k, 5); }
        c.fillStyle = on ? '#B4232C' : '#1F2937'; c.fillText(part, xx, yy); xx += wd; } yy += 74; }
    c.restore();
  }
  // the chest's contents: the skill (an enchanted book) and the four tips
  function packUI5(c, t, at, tipsAt) {
    if (t < at - .3) return; const a = Math.min(1, (t - at + .3) * 4);
    c.save(); c.globalAlpha = a; panel(c, 330, 600, 1260, 300, true); outlined(c, '宝箱', 960, 640, 36, '#3A3A3A', { lw: 0, shadow: false });
    const items = [['开源 skill', '说人话', 'book', at], ['技巧 1', '', 'bolt', tipsAt + .2], ['技巧 2', '', 'bolt', tipsAt + .5], ['技巧 3', '', 'bolt', tipsAt + .8], ['技巧 4', '', 'bolt', tipsAt + 1.1]];
    items.forEach(([name, sub, ic, t0], i) => { const x = 360 + i * 245, y = 680;
      c.fillStyle = '#8B8B8B'; c.fillRect(x, y, 220, 190); c.fillStyle = '#373737'; c.fillRect(x, y, 220, 6); c.fillRect(x, y, 6, 190);
      if (t < t0) return; const k = Math.min(1, (t - t0) * 6), s = 1 + .35 * Math.exp(-(t - t0) * 10);
      c.save(); c.globalAlpha = a * k; c.translate(x + 110, y + 70); c.scale(s, s); icon(c, ic, -48, -42, 12); c.restore();
      c.save(); c.globalAlpha = a * k; outlined(c, name, x + 110, y + 142, 34, i ? '#FFFFFF' : '#E8D8FF', { lw: 6, shadow: false }); if (sub) outlined(c, sub, x + 110, y + 174, 26, '#FFD34E', { lw: 5, shadow: false }); c.restore(); });
    c.restore();
  }
  // 不能保证百分百去掉 AI 味，但起码减少七八十的工作量
  function workBar(c, t, t0, t1, not100, cut, useful) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .25);
    c.save(); c.globalAlpha = a; panel(c, 360, 140, 1200, 420);
    // chip: 100% 去掉 AI 味, struck through
    const kc = seg01(t, not100 - .4, not100); c.globalAlpha = a * kc; c.fillStyle = '#2A2238'; c.fillRect(420, 190, 560, 90);
    outlined(c, '百分百去掉 AI 味', 700, 236, 46, '#C8C0E0', { lw: 6, shadow: false });
    if (t > not100 + .3) { const k = seg01(t, not100 + .3, not100 + .55); c.fillStyle = '#E83A44'; c.fillRect(420, 230, 560 * k, 9); outlined(c, '不保证', 1100, 236, 52, '#FF6A5A', { lw: 8, shadow: false }); }
    // the bar: the work left after the skill
    c.globalAlpha = a; outlined(c, '改稿工作量', 520, 360, 44, '#FFFFFF', { lw: 7, shadow: false });
    const k = sm(seg01(t, cut, cut + 1.2)), left = 1 - .75 * k;
    c.fillStyle = '#1A0E1A'; c.fillRect(680, 330, 820, 60); c.fillStyle = '#F59E0B'; c.fillRect(684, 334, 812 * left, 52); c.fillStyle = 'rgba(255,255,255,.28)'; c.fillRect(684, 334, 812 * left, 10);
    if (k > 0) outlined(c, '省下七八成', 684 + 812 * left + 20 + (1 - left) * 812 / 2 - 100, 360, 44, '#FFD34E', { lw: 8, shadow: false, align: 'left' });
    if (t > useful) { const kk = seg01(t, useful, useful + .25); c.globalAlpha = a * kk; outlined(c, '只要有提效 就是有用的', 960, 480, 56, '#FFD34E', { lw: 9 }); }
    c.restore();
  }
  // a line struck through: 今天不讲……
  function crossOut2(c, t, t0, tS, t1, txt) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .2);
    c.save(); c.globalAlpha = a; c.font = `900 70px ${FONT}`; const w = c.measureText(txt).width; panel(c, 960 - w / 2 - 50, 150, w + 100, 130);
    outlined(c, txt, 960, 216, 70, '#F2E6C8', { lw: 10, shadow: false });
    if (t > tS) { const k = seg01(t, tS, tS + .2); c.fillStyle = '#E83A44'; c.fillRect(960 - w / 2 - 20, 210, (w + 40) * k, 12); }
    c.restore();
  }

  // ---------------------------------------------------------------- chunk 2 overlay pieces
  // the template phrases fall like blocks and land in a row
  function dropTiles(c, t, tiles, t1) {
    if (t > t1) return; const out = 1 - sm(seg01(t, t1 - .3, t1));
    tiles.forEach(([txt, t0], i) => { if (t < t0) return; const a = t - t0, fall = Math.min(1, a / .32), y = lerp(-140, 560, fall * fall) - (a > .32 ? 60 * Math.exp(-(a - .32) * 10) * Math.abs(Math.sin((a - .32) * 22)) : 0);
      const x = 300 + i * 340; c.save(); c.globalAlpha = out; c.translate(0, 200); c.fillStyle = '#1E1426'; c.fillRect(x, y - 70, 300, 140); c.strokeStyle = '#E83A44'; c.lineWidth = 8; c.strokeRect(x, y - 70, 300, 140);
      c.fillStyle = '#2E2238'; c.fillRect(x + 8, y - 62, 284, 20); outlined(c, txt, x + 150, y + 6, txt.length > 4 ? 52 : 64, '#FFFFFF', { lw: 9, shadow: false }); c.restore(); });
  }
  const xpBar = (c, t, txt, k) => levelUI(c, t, txt, clamp01(k));
  // the skill tree: 写代码 and 做题 fill up, 写作 stays grey and gets a cobweb
  function skillTree(c, t, t0, t1, pt, wtree, none) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .25);
    c.save(); c.globalAlpha = a; panel(c, 1080, 120, 780, 660); outlined(c, '技能树', 1470, 176, 48, '#FFD34E', { lw: 8, shadow: false });
    [['写代码', 'axe'], ['做题', 'star'], ['写作', 'book']].forEach(([nm, ic], i) => {
      const x = 1180 + i * 250, writing = i === 2, n = writing ? 0 : pt < 0 ? 5 : Math.min(5, Math.floor(Math.max(0, t - pt) / .18 * .5 + (t > pt ? 1 : 0)) + Math.floor(Math.max(0, t - pt - .9) / .18));
      c.globalAlpha = a * (writing ? .55 : 1); icon(c, ic, x - 48, 230, 12);
      outlined(c, nm, x, 350, 40, writing ? '#9A94B0' : '#FFFFFF', { lw: 7, shadow: false });
      for (let j = 0; j < 5; j++) { const y = 680 - j * 62, on = j < n; c.fillStyle = on ? '#F59E0B' : '#2A2238'; c.fillRect(x - 40, y - 24, 80, 48); c.strokeStyle = on ? '#FFE27A' : '#4A4060'; c.lineWidth = 4; c.strokeRect(x - 40, y - 24, 80, 48); }
      if (writing && t > wtree) { c.globalAlpha = a * (.6 + .4 * Math.sin(t * 8)); c.strokeStyle = '#FFD34E'; c.lineWidth = 6; c.strokeRect(x - 80, 210, 160, 510); }
      if (writing && t > none) { const k = sm(seg01(t, none, none + .4)); c.globalAlpha = a * k; c.strokeStyle = '#E8E6F8'; c.lineWidth = 3;
        for (let r = 1; r <= 3; r++) { c.beginPath(); c.arc(x + 70, 210, r * 34, Math.PI / 2, Math.PI); c.stroke(); }
        for (let q = 0; q < 4; q++) { const th = Math.PI / 2 + q * Math.PI / 6; c.beginPath(); c.moveTo(x + 70, 210); c.lineTo(x + 70 + Math.cos(th) * 120, 210 + Math.sin(th) * 120); c.stroke(); }
        outlined(c, '没人点', x, 770, 40, '#C8C0E0', { lw: 7, shadow: false }); }
    });
    c.restore();
  }
  // the quest log: 对答案 → +10 / -10 → 下一题
  function quests(c, t, t0, t1, rows) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .25), shown = rows.filter(r => t >= r[0]).slice(-3);
    c.save(); c.globalAlpha = a; panel(c, 60, 140, 620, 120 + 3 * 120); outlined(c, '任务', 370, 190, 44, '#FFD34E', { lw: 7, shadow: false });
    shown.forEach(([t0r, q, st, d], i) => { const y = 270 + i * 120, k = Math.min(1, (t - t0r) * 6); c.globalAlpha = a * k;
      c.fillStyle = '#2A2238'; c.fillRect(90, y - 46, 560, 96); outlined(c, q, 120, y, 40, '#FFFFFF', { lw: 6, shadow: false, align: 'left' }); outlined(c, st, 330, y, 40, '#C8C0E0', { lw: 6, shadow: false, align: 'left' });
      if (d) outlined(c, d, 620, y, 54, d[0] === '+' ? '#FFD34E' : '#FF6A5A', { lw: 8, shadow: false, align: 'right' }); });
    c.restore();
  }
  // 数学题对答案、代码跑一遍：电脑自己就能判
  function checkCards(c, t, t0, t1, math, code, run, tell) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .25);
    c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(6,4,12,.5)'; c.fillRect(0, 0, 1920, 1080);
    panel(c, 160, 160, 760, 480); outlined(c, '数学题', 540, 220, 48, '#FFD34E', { lw: 7, shadow: false }); outlined(c, '37 × 4 = ?', 540, 340, 80, '#FFFFFF', { lw: 10, shadow: false });
    if (t > math + .3) { const k = seg01(t, math + .3, math + .6); c.globalAlpha = a * k; outlined(c, '答：148', 540, 460, 64, '#FFFFFF', { lw: 9, shadow: false }); outlined(c, '标准答案 148  对', 540, 570, 50, '#3EC3EE', { lw: 8, shadow: false }); }
    c.globalAlpha = a * seg01(t, code - .2, code + .1);
    panel(c, 1000, 160, 760, 480); outlined(c, '代码', 1380, 220, 48, '#FFD34E', { lw: 7, shadow: false });
    c.fillStyle = '#0B0F16'; c.fillRect(1040, 270, 680, 170); c.font = `700 40px "SF Mono", Menlo, monospace`; c.textAlign = 'left'; c.textBaseline = 'middle';
    c.fillStyle = '#9DB4FF'; c.fillText('def add(a, b):', 1070, 320); c.fillStyle = '#F2E6C8'; c.fillText('    return a + b', 1070, 384);
    const pressed = t > run && t < run + .2; c.fillStyle = pressed ? '#0E6A86' : '#0891B2'; c.fillRect(1290, 470 + (pressed ? 4 : 0), 180, 70); outlined(c, '运行', 1380, 506 + (pressed ? 4 : 0), 40, '#FFFFFF', { lw: 0, shadow: false });
    if (t > tell) { const k = seg01(t, tell, tell + .2); c.globalAlpha = a * k; outlined(c, '测试 3/3 通过', 1380, 600, 50, '#3EC3EE', { lw: 8, shadow: false }); }
    c.restore();
  }
  // 去年的 AI 和今年的 AI 写的东西差不多
  function yearCompare(c, t, t0, t1, lasty) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .25);
    c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(6,4,12,.45)'; c.fillRect(0, 0, 1920, 1080);
    [['去年的 AI 写的', 260], ['今年的 AI 写的', 1060]].forEach(([title, x], i) => { const k = seg01(t, t0 + i * .4, t0 + i * .4 + .3); c.globalAlpha = a * k;
      c.fillStyle = '#F7F8FA'; c.fillRect(x, 200, 600, 400); c.fillStyle = '#E9ECF1'; c.fillRect(x, 200, 600, 70); c.font = `800 32px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = '#4B5563'; c.fillText(title, x + 30, 236);
      c.font = `700 36px ${FONT}`; c.fillStyle = '#1F2937'; ['在这个快节奏的时代，', '我们不是在追赶时间，', '而是在追寻自己——', '愿你我都能被温柔以待。'].forEach((ln, j) => c.fillText(ln, x + 30, 320 + j * 66)); });
    if (t > lasty) { const k = seg01(t, lasty, lasty + .3); c.globalAlpha = a * k; outlined(c, '≈', 960, 400, 160, '#FFD34E', { lw: 16 }); outlined(c, '没强多少', 960, 700, 72, '#FFD34E', { lw: 11 }); }
    c.restore();
  }

  // ---------------------------------------------------------------- chunk 3 overlay pieces
  // 打分：两个回答，挑一个，往那边靠
  function pickUI(c, t, t0, t1, pick, lean) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .25);
    c.save(); c.globalAlpha = a;
    [['回答 A', 360], ['回答 B', 1000]].forEach(([nm, x], i) => { const chosen = i === 1 && t > pick, dim = i === 0 && t > pick;
      c.globalAlpha = a * (dim ? .45 : 1); panel(c, x, 150, 560, 300, true); outlined(c, nm, x + 280, 210, 48, '#3A3A3A', { lw: 0, shadow: false });
      c.fillStyle = '#8B8B8B'; for (let j = 0; j < 3; j++) c.fillRect(x + 50, 270 + j * 50, j === 2 ? 300 : 460, 22);
      if (chosen) { const k = 1 + .4 * Math.exp(-(t - pick) * 10); c.save(); c.translate(x + 280, 520); c.scale(k, k); outlined(c, '选这个', 0, 0, 64, '#3EC3EE', { lw: 10 }); c.restore(); } });
    if (t > lean) { const k = sm(seg01(t, lean, lean + .5)); c.globalAlpha = a * k; c.fillStyle = '#FFD34E'; c.beginPath(); c.moveTo(760, 620); c.lineTo(760 + 380 * k, 620); c.lineTo(760 + 380 * k, 590); c.lineTo(1180 * k + 760 * (1 - k) + 50, 640); c.lineTo(760 + 380 * k, 690); c.lineTo(760 + 380 * k, 660); c.lineTo(760, 660); c.fill();
      outlined(c, '以后往这边靠', 960, 760, 54, '#FFD34E', { lw: 9 }); }
    c.restore();
  }
  // 几万个人都在用同样的句子
  function crowdCards(c, t, t0, t1) {
    if (t < t0 || t > t1) return; const out = 1 - sm(seg01(t, t1 - .3, t1));
    for (let i = 0; i < 6; i++) { const ti = t0 + i * .14; if (t < ti) continue; const k = Math.min(1, (t - ti) * 6), x = 1100 + (i % 2) * 50 - i * 6, y = 160 + i * 64;
      c.save(); c.globalAlpha = out * k; c.fillStyle = '#F7F8FA'; c.fillRect(x, y, 700, 120); c.strokeStyle = '#C8CCD8'; c.lineWidth = 3; c.strokeRect(x, y, 700, 120);
      c.font = `700 36px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = '#1F2937'; c.fillText('在这个快节奏的时代……', x + 30, y + 60); c.restore(); }
    if (t > t0 + .9) { c.save(); c.globalAlpha = out * seg01(t, t0 + .9, t0 + 1.1); outlined(c, '几万人都这么写', 1450, 640, 60, '#FFD34E', { lw: 9 }); c.restore(); }
  }
  // 选对场景：写作挑写作好的，coding 选 coding 好的
  function pickTools(c, t, t0, t1, wr, cd, right) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .25);
    c.save(); c.globalAlpha = a;
    [['写作', '挑写作好的模型', 'book', wr, 300], ['coding', '选 coding 好的模型', 'axe', cd, 1060]].forEach(([nm, sub, ic, at, x]) => { if (t < at - .2) return; const k = Math.min(1, (t - at + .2) * 5), s = 1 + .3 * Math.exp(-(t - at) * 9);
      c.globalAlpha = a * k; panel(c, x, 150, 560, 380); c.save(); c.translate(x + 280, 270); c.scale(s, s); icon(c, ic, -48, -42, 12); c.restore();
      outlined(c, nm, x + 280, 390, 56, '#FFFFFF', { lw: 8, shadow: false }); outlined(c, sub, x + 280, 470, 44, '#FFD34E', { lw: 7, shadow: false }); });
    if (t > right) { const k = seg01(t, right, right + .25); c.globalAlpha = a * k; c.fillStyle = '#6B4428'; c.fillRect(940, 560, 40, 200); panel(c, 660, 560, 600, 130, true); outlined(c, '选对场景', 960, 625, 72, '#3A3A3A', { lw: 0, shadow: false }); }
    c.restore();
  }

  // ---------------------------------------------------------------- chunk 4 overlay pieces
  // 说人话 skill 不动什么、只改什么
  function keepCard(c, t, t0, t1, keep, hall, only) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .25);
    c.save(); c.globalAlpha = a; panel(c, 360, 140, 1200, 520); outlined(c, '说人话 skill 改稿时', 960, 200, 50, '#E8D8FF', { lw: 8, shadow: false });
    [['遵守原文内容', keep, '#FFFFFF'], ['不会因为幻觉增加或减少观点和事件', hall, '#FFFFFF'], ['只改说法', only, '#FFD34E']].forEach(([txt, at, col], i) => { if (t < at) return; const k = seg01(t, at, at + .25);
      c.globalAlpha = a * k; const y = 320 + i * 110; c.fillStyle = '#2A2238'; c.fillRect(420, y - 42, 1080, 84); outlined(c, txt, 470, y, 46, col, { lw: 7, shadow: false, align: 'left' }); });
    c.restore();
  }
  // 两类毛病：格式上的、说话的套路
  function twoFaults(c, t, t0, t1, groups) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .25);
    c.save(); c.globalAlpha = a;
    groups.forEach(([at, title, items], gi) => { if (t < at - .2) return; const x = 140 + gi * 860, k = seg01(t, at - .2, at + .1); c.globalAlpha = a * k;
      panel(c, x, 140, 780, 560); outlined(c, title, x + 390, 200, 52, '#FFD34E', { lw: 8, shadow: false });
      items.forEach(([txt, it], i) => { if (t < it) return; const y = 310 + i * 130, s = 1 + .25 * Math.exp(-(t - it) * 10); c.globalAlpha = a * seg01(t, it, it + .2);
        c.fillStyle = '#2A2238'; c.fillRect(x + 40, y - 50, 700, 100); c.save(); c.translate(x + 100, y); c.scale(s, s); c.strokeStyle = '#E83A44'; c.lineWidth = 9; c.beginPath(); c.moveTo(-22, -22); c.lineTo(22, 22); c.moveTo(22, -22); c.lineTo(-22, 22); c.stroke(); c.restore();
        outlined(c, txt, x + 160, y, txt.length > 9 ? 38 : 46, '#FFFFFF', { lw: 7, shadow: false, align: 'left' }); }); });
    c.restore();
  }
  // a tip banner, like an advancement: 技巧 n and what it is
  function tipBanner(c, t, t0, t1, big, small) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .25), sl = 1 - sm(seg01(t, t0, t0 + .3));
    c.save(); c.globalAlpha = a; c.translate(0, -sl * 160); c.fillStyle = '#1E1B30'; c.fillRect(460, 60, 1000, small ? 190 : 140); c.fillStyle = '#E8A93A'; c.fillRect(460, 60, 1000, 8); c.fillRect(460, (small ? 242 : 192), 1000, 8);
    icon(c, 'bolt', 500, 96, 11); outlined(c, big, small ? 620 : 960, 130, 76, '#FFD34E', { lw: 10, shadow: false, align: small ? 'left' : 'center' }); if (small) outlined(c, small, 620, 205, 46, '#FFFFFF', { lw: 7, shadow: false, align: 'left' });
    c.restore();
  }

  // ---------------------------------------------------------------- chunk 5 overlay pieces
  function commentBox(c, t, t0, t1) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .2), n = Math.max(0, Math.floor((t - t0 - .3) * 10)), txt = '在这个快节奏的时代……';
    c.save(); c.globalAlpha = a; c.fillStyle = '#F7F8FA'; c.fillRect(460, 640, 1000, 110); c.strokeStyle = '#94A3B8'; c.lineWidth = 4; c.strokeRect(460, 640, 1000, 110);
    c.font = `700 40px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = '#9CA3AF'; c.fillText('评论区说一句：', 500, 695); c.fillStyle = '#111827'; c.fillText([...txt].slice(0, n).join(''), 790, 695);
    c.restore();
  }
  function followCard2(c, t, t0, t1) { if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .3); c.save(); c.globalAlpha = a; panel(c, 560, 140, 800, 220); outlined(c, '关注 问问黑哥', 960, 210, 72, '#FFD34E', { lw: 11 }); outlined(c, '把 AI 一件一件用明白', 960, 300, 46, '#FFFFFF', { lw: 7 }); c.restore(); }

  // ======================================================================================= lights, particles, the frame
  const AMBER = [1, .72, .42], CYAN = [.35, .75, 1], VIOLET = [.7, .45, 1];
  const LAMPS = [];
  function lights(t, cam) {
    for (const L of LAMPS) { if (Math.abs(L[0] - cam.x) + Math.abs(L[1] - cam.y) + Math.abs(L[2] - cam.z) > 44) continue; VX.light(L[0] + .5, L[1] + .5, L[2] + .5, L[3], L[4], L[5]); }
    VX.light(DESK.x + .5, G + 2.5, DESK.z + 1.4, CYAN, 4.5, .9);        // the desk screen
    VX.light(TLX, rankY(2), TFZ + 1.5, AMBER, 6, .8); VX.light(TRX, rankY(39), TFZ + 1.5, [1, .4, .35], 6, t > LAND ? .9 : 0);
    if (t > OPENC && t < A('我不能保证')) VX.light(CH.x + .5, G + 2.6, CH.z + .5, VIOLET, 5, 1);
  }
  function burst(t, t0, x, y, z, col, n = 18) { const a = t - t0; if (a < 0 || a > .9) return; for (let i = 0; i < n; i++) {
    const vx = (hh(i, t0) - .5) * 4, vz = (hh(i, t0 + 1) - .5) * 4, vy = 2 + hh(i, t0 + 2) * 3;
    VX.pt(x + vx * a, y + vy * a - 9 * a * a, z + vz * a, .09 + .05 * hh(i), col.map(c => c * (.75 + .3 * hh(i, 9)))); } }
  function dust(t, cam) { for (let i = 0; i < 70; i++) {   // a few warm motes near the camera (sparse: no fine noise)
    const x = cam.x - 8 + ((hh(i, 1) * 16 + t * .25) % 16 + 16) % 16, z = cam.z - 8 + ((hh(i, 2) * 16 + .3 * Math.sin(t * .4 + i)) % 16 + 16) % 16, y = cam.y - 3 + ((hh(i, 3) * 6 + .2 * Math.sin(t + i)) % 6 + 6) % 6;
    if (VX.at(Math.floor(x), Math.floor(y), Math.floor(z))) continue; VX.pt(x, y, z, .04, [255, 214, 160], true); } }
  const shotAt = t => S.find(s => t >= s.t0 && t < s.t1) || S[S.length - 1];
  const val = (v, t) => typeof v === 'function' ? v(t) : v;
  function camera(t) {
    const s = shotAt(t), c = along(s.keys, t), kicks = s.kicks || [];
    const hit = kicks.reduce((m, [t0, a]) => Math.max(m, t >= t0 ? a * Math.exp(-(t - t0) * 7) : 0), 0);
    const f = Math.floor(t * 24), sh = hit * .06;
    c.p[0] += .03 * Math.sin(t * 1.3) + (hh(f) - .5) * sh; c.p[1] += .02 * Math.sin(t * 1.7 + 1) + (hh(f, 3) - .5) * sh;
    const L = look(c.p, c.q);
    return { x: c.p[0], y: c.p[1], z: c.p[2], yaw: L.yaw + .004 * Math.sin(t * .9), pitch: L.pitch, fov: c.fov - hit * 3, roll: .006 * Math.sin(t * .7) };
  }
  let BR = null;
  const FLASH = [[LAND, '255,240,200', .3], [WTF, '255,255,255', .2], [OPENC, '220,190,255', .25]];
  function post(c, t) {
    if (!BR) { BR = document.createElement('canvas'); BR.width = PW; BR.height = PH; }
    const bx = BR.getContext('2d'), id = bx.createImageData(PW, PH);
    for (let i = 0; i < PW * PH * 4; i += 4) { const l = BUF[i] * .3 + BUF[i + 1] * .55 + BUF[i + 2] * .15, k = clamp01((l - 150) / 90); id.data[i] = BUF[i] * k; id.data[i + 1] = BUF[i + 1] * k; id.data[i + 2] = BUF[i + 2] * k; id.data[i + 3] = 255; }
    bx.putImageData(id, 0, 0);
    c.save(); c.globalCompositeOperation = 'lighter'; c.imageSmoothingEnabled = true; c.filter = 'blur(22px)'; c.globalAlpha = .55; c.drawImage(BR, 0, 0, 1920, 1080); c.filter = 'blur(6px)'; c.globalAlpha = .25; c.drawImage(BR, 0, 0, 1920, 1080); c.restore();
    const g = c.createRadialGradient(960, 540, 420, 960, 540, 1150); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(10,6,14,.5)'); c.fillStyle = g; c.fillRect(0, 0, 1920, 1080);
    for (const [t0, col, a] of FLASH) { const k = t >= t0 ? Math.exp(-(t - t0) * 9) * a : 0; if (k > .01) { c.fillStyle = `rgba(${col},${k})`; c.fillRect(0, 0, 1920, 1080); } }
  }
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

  const LOOP = t => {
    if (!BUILT) buildWorld();
    VX.setMip(1.5);
    TAGS.length = 0; BUBS.length = 0; LBLS.length = 0;
    const cam = camera(t), s = shotAt(t);
    VX.setDay(val(s.day ?? DUSK, t));
    VX.setMoonDir([-.7, .35, .55]);
    VX.frame(t, cam);
    if (s.pre) s.pre(t);
    lights(t, cam);
    s.act && s.act(t);
    dust(t, cam);
    const f = val(s.fog, t) || [30, 90]; VX.setFog(f[0], f[1]);
    VX.draw();
  };
  LOOP.res = [320, 180]; LOOP.px = 6; LOOP.len = DD.len;
  LOOP.overlay = (c, t) => {
    post(c, t);
    worldText(c);
    const s = shotAt(t); s.ui && s.ui(c, t);
    subtitle(c, t);
    greenGuard(c);
  };
  LOOPS.pxShuohua = LOOP;
})();
