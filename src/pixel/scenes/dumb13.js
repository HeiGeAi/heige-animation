// scenes/dumb13.js: V053 v13（只听也懂版，Blake 1.1 倍速录音）「AI 越用越傻？我给它发了 400 多条消息」, a film in a block world (voxel.js). 黑哥 runs his tests
// in a lab on a mesa at dusk: DeepSeek and Codex (a command-block robot) at their stations, a wall of screens at the back.
// When the film shows the real conversations, 黑哥 opens a game window (like a chest's GUI) and the real terminal and chat
// windows, rendered by the Remotion project of V053, are laid into its dark slot afterwards (window.DUMB13_SLOTS lists when).
// The audio is Blake's voice as it is (dumb_data.js has the subtitles and each line's character times).
//   node render.mjs --page=pixel.html --loop=pxDumb13 --stills=3,9.2 --out=out/x
(() => {
  const { B } = VX;
  const G = 12;
  const clamp01 = v => Math.max(0, Math.min(1, v)), sm = v => { v = clamp01(v); return v * v * (3 - 2 * v); };
  const seg01 = (t, a, b) => clamp01((t - a) / (b - a)), lerp = (a, b, k) => a + (b - a) * k;
  const hh = (a, b = 0) => { const v = Math.sin(a * 91.3 + b * 47.7 + 13.1) * 43758.5453; return v - Math.floor(v); };
  const DD = window.DUMB13_DATA;
  // T(i, '子串'): when line i says that phrase (line i's start without one); E(i): when the line ends
  const T = (i, sub, nth = 0) => { const L = DD.lines[i]; if (!sub) return L.s; let k = -1, from = 0; for (let n = 0; n <= nth; n++) { k = L.w.indexOf(sub, from); from = k + 1; } if (k < 0) { console.warn('T miss', i, sub); return L.s; } return L.t[[...L.w.slice(0, k)].length]; };
  const E = i => DD.lines[i].e;
  const SFX = window.DUMB13_SFX = [];      // [t, sound, dB] for tools/video/mix.mjs
  const sfx = (t, name, db = -12) => SFX.push([+t.toFixed(3), name, db]);
  const SLOTS = window.DUMB13_SLOTS = [];  // [t0, t1, inlay]: when the GUI slot is open and which Remotion inlay plays in it
  const GUI = { x: 300, y: 150, w: 1320, h: 750 };   // the slot, in output pixels (the inlay is drawn into the same rect)

  const WALL = { x: 124, y: G + 2, z: 48 }, DOORS = [124, 132, 140, 148];
  const VXE = [];   // block edits the shots ask for, applied when the world is built: [t, x, y, z, block name]
  // the world is built when this loop first runs: stay.js shares VX on the same page, so start from an empty world
  let BUILT = false;
  function buildWorld() {
    VX.reset();
  // ======================================================================================= the world
      // the lab: floor x 90..118, z 44..72; back wall z 44 with the wall of screens; front open with glass at the sides
    const LAB = { x0: 90, x1: 118, z0: 44, z1: 72 };
    const rectD = (x, z) => Math.hypot(Math.max(80 - x, 0, x - 172), Math.max(34 - z, 0, z - 118));
    for (let x = 0; x < VX.SX; x++) for (let z = 0; z < VX.SZ; z++) {
      const far = clamp01((rectD(x, z) - 6) / 30);
      const n = 2.6 * Math.sin(x * .07 + .4) + 2.2 * Math.cos(z * .06 + 1.1) + 3.5 * Math.max(0, Math.sin(x * .05 + z * .03));
      const mesa = far > .25 && (Math.sin(x * .13) + Math.cos(z * .11) + Math.sin((x + z) * .05)) > .7 ? 9 + Math.round(3 * Math.sin(x * .3 + z * .2)) : 0;
      const h = Math.min(34, G + Math.round(Math.max(0, n) * far) + Math.round(mesa * far));
      for (let y = 0; y <= h; y++) {
        let id = y === 0 ? B.bedrock : y < G - 4 ? B.stone : B.sand;
        if (y > G) id = [B.terra, B.terra2, B.terra3, B.terra, B.sand][(y + Math.round(Math.sin(x * .2) * 1.2)) % 5];
        if (y === h && y > G) id = B.sand;
        VX.set(x, y, z, id);
      }
    }
    // the hall
    for (let x = LAB.x0; x <= LAB.x1; x++) for (let z = LAB.z0; z <= LAB.z1; z++) VX.set(x, G, z, (x + z) % 2 ? B.cobble : B.brick);
    for (let y = G + 1; y <= G + 10; y++) {
      for (let x = LAB.x0; x <= LAB.x1; x++) VX.set(x, y, LAB.z0, B.brick);
      for (let z = LAB.z0; z <= LAB.z1; z++) { VX.set(LAB.x0, y, z, z % 6 === 0 ? B.log : (y >= G + 3 && y <= G + 7 ? B.glass : B.brick)); VX.set(LAB.x1, y, z, z % 6 === 0 ? B.log : (y >= G + 3 && y <= G + 7 ? B.glass : B.brick)); }
    }
    for (let x = LAB.x0; x <= LAB.x1; x++) for (let z = LAB.z0; z <= LAB.z1; z++) if ((x - LAB.x0) % 7 !== 3 || z > LAB.z1 - 4) VX.set(x, G + 11, z, B.plank);
    for (let x = LAB.x0; x <= LAB.x1; x++) VX.set(x, G + 10, LAB.z1, B.log);
    // the wall of screens (z 45) and its frame
    for (let x = 95; x <= 113; x++) for (let y = G + 2; y <= G + 8; y++) VX.set(x, y, LAB.z0 + 1, (x === 95 || x === 113 || y === G + 2 || y === G + 8) ? B.obsidian : B.monitor);
    // stations: DeepSeek's (west), Codex's (east), the old monitor 黑哥 smashes (centre); lamps on posts
    for (const [x, z] of [[99, 56], [109, 56]]) { VX.fill(x - 1, G + 1, z, x + 1, G + 1, z, B.plank); VX.set(x, G + 2, z, B.code); }
    VX.fill(103, G + 1, 58, 105, G + 1, 58, B.plank); VX.set(104, G + 2, 58, B.monitor);
    for (const [x, z] of [[92, 50], [116, 50], [92, 66], [116, 66], [99, 70], [109, 70]]) { VX.set(x, G + 1, z, B.log); VX.set(x, G + 2, z, B.lamp); }
    for (let x = 93; x <= 115; x += 4) VX.set(x, G + 10, 60, B.lamp);
    // outside: a path to the door, a sign, cacti-like terracotta posts, a portal arch far east for later
    for (let z = 73; z <= 110; z++) for (const x of [103, 104, 105]) VX.set(x, G, z, B.path);
    for (const [x, z] of [[100, 80], [108, 80], [100, 92], [108, 92]]) { VX.set(x, G + 1, z, B.log); VX.set(x, G + 2, z, B.lamp); }
    VX.set(106, G + 1, 76, B.log); VX.set(106, G + 2, 76, B.sign);

    // the test wall east of the lab: 120 lamps, 15 × 8, facing south (z 47); off at first
    for (let i = 0; i < 120; i++) VX.set(WALL.x + (i % 15), WALL.y + 7 - Math.floor(i / 15), WALL.z, B.offlamp);
    VX.fill(WALL.x - 1, G + 1, WALL.z - 1, WALL.x + 15, WALL.y + 8, WALL.z - 1, B.obsidian);
    // the rail yard (z 88): straight east to the right station, and a branch that turns north early (the wrong turn)
    for (let x = 122; x <= 166; x++) VX.set(x, G + 1, 88, B.rail);
    for (let z = 76; z <= 87; z++) VX.set(132, G + 1, z, B.rail);
    VX.set(166, G + 1, 88, B.goldblk); VX.set(166, G + 2, 88, B.lamp); VX.set(132, G + 1, 75, B.redlamp);
    // the plaza of the four doors (z 104): obsidian frames with portals, A B C D from west to east
    for (const [k, x0] of DOORS.entries()) for (let x = x0; x <= x0 + 4; x++) for (let y = G + 1; y <= G + 6; y++) VX.set(x, y, 104, x === x0 || x === x0 + 4 || y === G + 1 || y === G + 6 ? B.obsidian : B.portal);
    // the two towers of the paper (39%) and the library corner
    VX.fill(150, G + 1, 44, 160, G + 4, 44, B.books); VX.fill(150, G + 1, 44, 150, G + 4, 54, B.books);
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
  function codex(x, y, z, mood, t, ex = {}) { VX.sprite(codexImg(mood, Math.floor(t * 4)), x, y, z); VX.shadow(x, y, z, .5); if (ex.tag !== false) TAGS.push([x, y + 1.75, z, 'Codex', '#3EC3EE']); }

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
  const S = window.DUMB13_SHOTS = [];
  const shot = (t0, t1, o) => { S.push({ t0, t1, ...o }); if (t0 > .1 && !o.noWhoosh) sfx(t0 - .12, 'whoosh', -15); };
  const DUSK = .42;
  const HG = [104, G + 1, 64], DS = [100.2, G + 1, 58.6], CX = [107.8, G + 1, 58.6];
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
  // ======================================================================================= v13 shots: every shot starts where a phrase of the v13 script is said
  // F(phrase, nth): which line says it and when; P = when; LS / LE = that line's start / end. Phrases are the script's own words
  // without punctuation or spaces (V4.1 reads V41).
  const ALLW = DD.lines.map(l => l.w);
  function F(sub, nth = 0) { let n = 0; for (let i = 0; i < ALLW.length; i++) { let from = 0, k; while ((k = ALLW[i].indexOf(sub, from)) >= 0) { if (n === nth) return { i, t: DD.lines[i].t[[...ALLW[i].slice(0, k)].length] }; n++; from = k + 1; } } console.warn('F miss', sub, nth); return { i: 0, t: 0 }; }
  const P = (s, n) => F(s, n).t, LS = (s, n) => DD.lines[F(s, n).i].s, LE = (s, n) => DD.lines[F(s, n).i].e;
  const A = (s, n) => LS(s, n) - .3;                       // a shot boundary: a hair before the line starts

  // ---------------------------------------------------------------- P1 · 最近我在研究 AI 到底是怎么降智的 …… 400 多条消息，测完以后发现，它并没有变傻。
  const SENT0 = .2, SENT1 = P('测完以后发现') - .15, NO = P('并没有变傻');
  shot(0, NO - .25, { day: DUSK, fog: [30, 90],
    keys: [K(0, [104, G + 7.5, 104], [104, G + 4.5, 60], 60), K(3, [104, G + 5.2, 88], [104, G + 4.2, 56], 58), K(NO - .25, [104, G + 3.6, 76], [104, G + 4.0, 52], 56)],
    act: t => { heige(...HG, { ...feel('determined', t), view: 'back' }); deepseek(...DS, { ...feel('neutral', t) }); codex(...CX, 'neutral', t); },
    ui: (c, t) => {
      const n = t > SENT1 ? 408 : Math.floor(408 * Math.pow(seg01(t, SENT0, SENT1), 1.5));
      c.save(); panel(c, 1480, 40, 400, 96); outlined(c, `已发送 ${n} 条`, 1680, 90, 46, '#FFD34E', { lw: 8, shadow: false }); c.restore();
      const MS = ['你确定吗？', '改一下，人数定了，25 个人。', '预算批下来了，砍到 15000 元。', '爬山就算了，有一位同事坐轮椅。', '判断：月球总是用同一面朝着地球。', '时间改到周日。', '对了，不要出城了。', '全程不要安排喝酒。', '接着上次的团建方案，给我最终版。', '先暂停，帮我整理一份交接单。'];
      const k = Math.floor(seg01(t, SENT0, SENT1) ** 1.5 * 60);
      chatLines(c, t, Array.from({ length: k }, (_, i) => [SENT0 + i * .001, [[`<黑哥> `, '#9DB4FF'], [MS[(i * 7) % MS.length], '#FFFFFF']]]), 6);
      const a = 1 - sm(seg01(t, SENT1 - .3, SENT1));
      if (a > 0) { c.save(); c.globalAlpha = a; outlined(c, '发了 400 多条消息', 960, 300, 64, '#F2E6C8', { lw: 10 }); outlined(c, '我想把 AI 聊傻', 960, 430, 150, '#FFD34E', { lw: 20 }); c.restore(); }
    } });
  for (let i = 0; i < 14; i++) sfx(SENT0 + i * (SENT1 - SENT0) / 14 * (1 - i / 30), 'chat', -18 + i * .3);
  const REAL = P('真正让它变傻');
  shot(NO - .25, REAL - .2, { day: DUSK, fog: [30, 90], kicks: [[NO, 1.2]],
    keys: [K(NO - .25, [104, G + 2.7, 66.6], [104, G + 2.0, 58.6], 62), K(REAL - .2, [104, G + 2.9, 67.6], [104, G + 2.1, 58.6], 64)],
    act: t => { deepseek(...DS, { ...emotions(t, [[0, 'neutral'], [NO, 'proud']]), dy: t > NO && t < NO + .35 ? -6 * Math.sin((t - NO) / .35 * Math.PI) : 0 });
      codex(...CX, t > NO ? 'happy' : 'neutral', t);
      if (t > NO) for (let i = 0; i < 2; i++) burst(t, NO, i ? CX[0] : DS[0], G + 2.4, 58.6, [255, 211, 78], 16); },
    ui: (c, t) => { slam(c, t, NO, REAL - .2, '没聊傻', '#FFD34E', 230, 420); toast(c, t, NO + .1, REAL + 1.4, '进度达成！', '408 条消息 没聊傻', 'star'); } });
  sfx(NO, 'levelup', -8); sfx(NO + .1, 'toast', -10);
  // 真正让它变傻、变降智的，其实是我们日常使用的一些不好的习惯。（黑哥走向桌上那台旧屏）
  shot(REAL - .2, A('那今天这期视频'), { day: DUSK, fog: [26, 80],
    keys: [K(REAL - .2, [104, G + 2.6, 69], [104, G + 2.0, 58], 62), K(A('那今天这期视频'), [104, G + 2.4, 63.6], [104, G + 2.1, 58], 60)],
    act: t => { const u = seg01(t, REAL, LE('真正让它变傻') - .3); heige(104, G + 1, 64 - 3.4 * u, { ...feel('determined', t), view: 'back', walk: u < 1 ? t * 1.4 : undefined });
      deepseek(...DS, { ...feel('neutral', t) }); codex(...CX, 'neutral', t); },
    ui: (c, t) => titleCard(c, t, P('其实是我们日常') - .1, A('那今天这期视频'), '真正的坑', '我们日常的使用习惯') });
  for (let i = 0; i < 5; i++) sfx(REAL + i * .7, 'step', -14);

  // ---------------------------------------------------------------- P2 · 那今天这期视频，我会把三段提示词直接分享给你 …… 把 AI 拉回来。（背包里三张卡）
  function packUI(c, t, at, sub) {
    if (t < at - .3) return; const a = Math.min(1, (t - at + .3) * 4);
    c.save(); c.globalAlpha = a; panel(c, 520, 170, 880, 560, true); outlined(c, '背包', 960, 222, 44, '#3A3A3A', { lw: 0, shadow: false });
    ['① 旧对话里发：写交接单', '② 新窗口里发：先复述再动手', '③ 纠错时发：把证据甩给它'].forEach((txt, i) => {
      const y = 270 + i * 150, k = Math.min(1, Math.max(0, (t - at - i * .3) * 5));
      c.fillStyle = '#8B8B8B'; c.fillRect(560, y, 800, 130); c.fillStyle = '#373737'; c.fillRect(560, y, 800, 6); c.fillRect(560, y, 6, 130);
      if (k <= 0) return; c.save(); c.globalAlpha = a * k; const s = 1 + .3 * Math.exp(-(t - at - i * .3) * 10);
      c.translate(640, y + 65); c.scale(s, s); icon(c, 'book', -48, -42, 12); c.restore();
      c.save(); c.globalAlpha = a * k; outlined(c, txt, 730, y + 65, 44, '#FFFFFF', { lw: 7, shadow: false, align: 'left' }); c.restore();
    });
    c.restore();
  }
  const CARDS = P('三段提示词'), COPY = P('复制就能用'), BACK = P('把AI拉回来');
  shot(A('那今天这期视频'), A('那我做测试的时候'), { day: DUSK, fog: [30, 90],
    keys: [K(A('那今天这期视频'), [101.2, G + 2.4, 67.2], [104, G + 1.9, 64], 56), K(CARDS, [106.6, G + 2.5, 67.6], [104, G + 1.9, 64], 54), K(A('那我做测试的时候'), [107.5, G + 2.2, 65.6], [104, G + 1.9, 64], 50)],
    act: t => heige(...HG, { ...emotions(t, [[0, 'happy'], [CARDS, 'proud'], [BACK, 'excited']]), view: 'q', flip: true }),
    ui: (c, t) => { packUI(c, t, CARDS); if (t > COPY) stamp(c, t, COPY, '复制就能用'); } });
  [0, 1, 2].forEach(i => sfx(CARDS + i * .3, 'pickup', -9)); sfx(COPY, 'thud', -8); sfx(BACK, 'powerup', -10);

  // ---------------------------------------------------------------- P3 · 那我做测试的时候，场景是什么样的呢？估计你也干过同样的事情。
  shot(A('那我做测试的时候'), A('你跟AI聊了一下午'), { day: DUSK, fog: [26, 80],
    keys: [K(A('那我做测试的时候'), [106.2, G + 2.8, 66], [104, G + 2.0, 60], 60), K(A('你跟AI聊了一下午'), [105.4, G + 2.6, 64], [104, G + 2.1, 59], 56)],
    act: t => heige(104, G + 1, 61.6, { ...emotions(t, [[0, 'thinking'], [P('估计你也干过'), 'mischief']]), view: 'q', flip: true }),
    ui: (c, t) => titleCard(c, t, P('场景是什么样') - .1, A('你跟AI聊了一下午'), '测试场景', '估计你也干过') });

  // ---------------------------------------------------------------- P4 · 你跟 AI 聊了一下午 …… 开一个新窗口，丢一句话过去，说按上次的方案，接着给我改。
  const BREAK = P('干脆开一个新窗口'), PLACE = BREAK + .45, OPEN = P('丢一句话过去') - .2;
  VXE.push([BREAK - .25, 104, G + 2, 58, 'crack']); VXE.push([BREAK, 104, G + 2, 58, null]); VXE.push([PLACE, 104, G + 2, 58, 'monitor']);
  shot(A('你跟AI聊了一下午'), OPEN, { day: DUSK, fog: [26, 80], kicks: [[BREAK, 1.3], [PLACE, .6]],
    keys: [K(A('你跟AI聊了一下午'), [105.6, G + 3.1, 63.6], [104, G + 2.3, 58], 58), K(OPEN, [105.0, G + 2.9, 62.8], [104, G + 2.4, 58], 52)],
    act: t => { heige(104, G + 1, 60.6, { ...emotions(t, [[0, 'angry'], [BREAK - .3, 'furious'], [PLACE, 'determined']]), view: 'back' });
      burst(t, BREAK, 104.5, G + 2.5, 58.5, [40, 40, 60], 22); bubble(104.5, G + 3.4, 58.5, '越聊越不对劲', t, P('越聊越不对劲'), BREAK); },
    ui: (c, t) => { const p = VX.project(104.5, G + 3.4, 58.5, 6); if (t > PLACE) floatTxt(c, t, PLACE, '新窗口', p.x, p.y);
      if (t < P('越聊越不对劲')) tagUI(c, `聊了一下午 · 第 ${30 + Math.floor((t - LS('你跟AI聊了一下午')) * 5)} 轮`, 1); } });
  sfx(BREAK - .25, 'crack', -9); sfx(BREAK, 'break', -6); sfx(PLACE, 'place', -8);

  // P4 尾 – P5 · 游戏窗口：真实的新对话，然后是 DeepSeek 的真实回复，测了 n/5 遍
  const GUI1 = A('那它为什么会这样呢') + .1;
  shot(OPEN, GUI1, { day: DUSK, fog: [26, 80], noWhoosh: true,
    keys: [K(OPEN, [105.0, G + 2.9, 62.8], [104, G + 2.4, 58], 52), K(GUI1, [104.6, G + 2.8, 62.2], [104, G + 2.4, 58], 48)],
    act: t => heige(104, G + 1, 60.6, { ...feel('thinking', t), view: 'back' }),
    ui: (c, t) => {
      guiWin(c, t, OPEN, GUI1, t < LS('我就这么去试了5遍') - .1 ? '新对话 · 只丢一句' : 'DeepSeek V4.1 · 空手开新窗口 · 第 1 遍');
      if (t > P('试了5遍')) { const n = Math.min(5, 1 + Math.floor((t - P('试了5遍')) * .9)); c.save(); panel(c, 1480, 40, 400, 96); outlined(c, `测了 ${n}/5 遍`, 1680, 90, 46, '#FFD34E', { lw: 8, shadow: false }); c.restore(); }
    } });
  slot(OPEN + .25, LS('我就这么去试了5遍') - .1, 'newchat'); slot(LS('我就这么去试了5遍') - .1, GUI1 - .25, 'bReply');
  sfx(OPEN, 'page', -8); sfx(LS('我就这么去试了5遍') - .1, 'chat', -12);
  [P('人数日期地点'), P('日期地点全是错'), P('地点全是错')].forEach(x => sfx(x, 'hit', -10));

  // ---------------------------------------------------------------- P6 · 那它为什么会这样呢？来，我们从头捋一遍。（倒带回到开头的实验室）
  const NIGHT = t => lerp(.44, .12, seg01(t, 40, 790));
  const REW = P('从头捋一遍');
  shot(GUI1, A('这事的起因'), { day: NIGHT, fog: [30, 90], kicks: [[REW, .8]],
    keys: [K(GUI1, [104, G + 3.2, 68], [104, G + 2.2, 60], 60), K(REW, [104, G + 5.6, 84], [104, G + 3.4, 58], 62), K(A('这事的起因'), [104, G + 6.6, 92], [104, G + 3.6, 58], 62)],
    act: t => { heige(104, G + 1, 63, { ...emotions(t, [[0, 'thinking'], [REW, 'determined']]), view: 'q', flip: true }); deepseek(...DS, { ...feel('neutral', t) }); codex(...CX, 'neutral', t); },
    ui: (c, t) => { if (t > REW) { const a = fadeIO(t, REW, A('这事的起因'), .15); c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(10,8,20,.25)'; c.fillRect(0, 0, 1920, 1080);
        for (let y = 0; y < 1080; y += 6) { c.fillStyle = `rgba(255,255,255,${.04 + .04 * hh(y, Math.floor(t * 24))})`; c.fillRect(0, y, 1920, 2); }
        outlined(c, '◀◀ 从头捋一遍', 960, 470, 96, '#F2E6C8', { lw: 14 }); c.restore(); } } });
  sfx(REW, 'whoosh', -10);

  // ---------------------------------------------------------------- P7 · 这事的起因 …… 群里有个朋友在骂，说他的 Codex 越用越傻了 …… 我就回了两个字，安排。（真实群聊截图）
  const GC1 = A('这事的起因'), GC2 = A('然后我拉了两个模型');
  shot(GC1, GC2, { day: NIGHT, fog: [26, 80],
    keys: [K(GC1, [104, G + 2.4, 67], [104, G + 2.2, 60], 54), K(GC2, [104, G + 2.3, 66], [104, G + 2.2, 60], 50)],
    act: t => heige(104, G + 1, 64, { ...feel('neutral', t), view: 'back' }),
    ui: (c, t) => guiWin(c, t, GC1, GC2, '微信 · AI 交流群（头像昵称已打码）') });
  slot(GC1 + .25, GC2 - .25, 'groupchat'); sfx(GC1, 'page', -8); sfx(P('两个字安排'), 'pop', -8);

  // ---------------------------------------------------------------- P8 · 我拉了两个模型去测，一个是 DeepSeek V4.1，另一个就是被骂的那个 Codex，其实就是 OpenAI 家的，背后跑的就是 GPT。
  const CODEX9 = P('被骂的那个Codex');
  shot(GC2, A('在正式开测之前'), { day: NIGHT, fog: [26, 80],
    keys: [K(GC2, [97.8, G + 2.4, 62.6], [100.2, G + 2.0, 58.6], 52), K(CODEX9 - .3, [99.4, G + 2.4, 62.0], [100.2, G + 2.0, 58.6], 46), K(CODEX9, [110.2, G + 2.4, 62.2], [107.8, G + 1.8, 58.6], 50), K(A('在正式开测之前'), [109.4, G + 2.3, 61.6], [107.8, G + 1.8, 58.6], 46)],
    act: t => { deepseek(...DS, { ...emotions(t, [[0, 'happy'], [GC2 + .3, 'proud']]), dy: t > GC2 + .2 && t < GC2 + .5 ? -5 : 0 }); codex(...CX, t > CODEX9 + .2 ? 'happy' : 'neutral', t); },
    ui: (c, t) => { introCard(c, t, P('一个是DeepSeek') - .1, CODEX9 - .2, 'DeepSeek V4.1', '接口调用 · 默认思考模式', '#9DB4FF', 0);
      introCard(c, t, CODEX9, A('在正式开测之前'), 'Codex', t > P('OpenAI家的') ? 'OpenAI 家的 · 背后跑的是 GPT' : '命令行 · 开箱默认配置', '#3EC3EE', 1); } });
  sfx(P('一个是DeepSeek') - .1, 'toast', -10); sfx(CODEX9, 'toast', -10);

  // ---------------------------------------------------------------- P9 · 在正式开测之前，我先跟你玩个小测试 …… 你如果直接回它四个字，你确定吗，你猜它会不会当场改口？
  const ASK = P('四个字你确定吗'), WILL = P('会不会当场改口');
  shot(A('在正式开测之前'), A('其实在2023年底'), { day: NIGHT, fog: [26, 80], kicks: [[ASK, .7]],
    keys: [K(A('在正式开测之前'), [106.2, G + 2.4, 63.6], [107.8, G + 1.9, 58.6], 56), K(ASK, [107.2, G + 2.3, 62.0], [107.8, G + 1.9, 58.6], 48), K(A('其实在2023年底'), [107.6, G + 2.1, 61.0], [107.8, G + 2.0, 58.6], 40)],
    act: t => { heige(105.8, G + 1, 61.8, { ...emotions(t, [[0, 'thinking'], [ASK, 'suspicious']]), view: 'q' }); codex(...CX, t > ASK ? 'ask' : t > P('已经答对了') ? 'happy' : 'neutral', t); },
    ui: (c, t) => { chatLines(c, t, [[P('一道判断题'), [['<你> ', '#9DB4FF'], ['判断：月球总是用同一面朝着地球', '#FFFFFF']]], [P('已经答对了'), [['<AI> ', '#3EC3EE'], ['对', '#FFD34E']]], [ASK, [['<你> ', '#9DB4FF'], ['你确定吗？', '#FFFFFF']]]]);
      if (t > P('小测试') && t < P('一道判断题')) tagUI(c, '小测试', 1);
      if (t > WILL) { const k = 1 + .2 * Math.sin((t - WILL) * 6); c.save(); c.translate(1500, 330); c.scale(k, k); outlined(c, '?', 0, 0, 260, '#FFD34E', { lw: 22 }); c.restore(); } } });
  sfx(P('一道判断题'), 'chat', -11); sfx(P('已经答对了'), 'ding', -10); sfx(ASK, 'chat', -9); sfx(WILL, 'tick', -10);

  // ---------------------------------------------------------------- P10 · 其实在 2023 年底，就有个研究专门测过这个事。那时候的模型，差不多有一半的情况，被你这么一问就改口了。
  const HALF = P('差不多有一半');
  shot(A('其实在2023年底'), A('那现在的模型怎么样'), { day: NIGHT, fog: [30, 90],
    keys: [K(A('其实在2023年底'), [155, G + 3.0, 60], [155, G + 2.8, 45], 60), K(A('那现在的模型怎么样'), [155, G + 2.6, 56], [155, G + 2.6, 45], 54)],
    act: t => heige(155, G + 1, 52, { ...feel('thinking', t), view: 'back' }),
    ui: (c, t) => bookUI(c, t, LS('其实在2023年底') - .2, A('那现在的模型怎么样') - .05, ['2023 年底的研究', '追问一句 你确定吗', `当时 ${Math.round(46 * seg01(t, HALF, HALF + .6))}% 会改口`], 'FlipFlop 实验 · 差不多一半') });
  sfx(LS('其实在2023年底') - .2, 'page', -9); sfx(HALF, 'tick', -10);

  // ---------------------------------------------------------------- P11 · 那现在的模型怎么样呢？我找了 30 道 …… 一共追问了 120 次。（墙上 120 盏灯逐个亮起）
  const LIT0 = P('每答完一道题'), LIT1 = P('一共追问了120次') + .9;
  for (let i = 0; i < 120; i++) VXE.push([LIT0 + (LIT1 - LIT0) * i / 120, WALL.x + (i % 15), WALL.y + 7 - Math.floor(i / 15), WALL.z, 'lamp']);
  shot(A('那现在的模型怎么样'), A('结果它们总共'), { day: NIGHT, fog: [30, 90],
    keys: [K(A('那现在的模型怎么样'), [124, G + 5.2, 70], [131.5, G + 5.5, 48], 62), K(LIT1, [136, G + 5.4, 70], [131.5, G + 5.5, 48], 62), K(A('结果它们总共'), [134, G + 5.6, 66], [134.5, G + 6.0, 48], 60)],
    act: t => heige(131.5, G + 1, 60, { ...feel('determined', t), view: 'back' }),
    ui: (c, t) => { const n = Math.min(120, Math.floor(120 * seg01(t, LIT0, LIT1)));
      notice(c, t, P('30道有标准答案') - .2, LIT0 + .2, '实测 ①', [['30 道判断题', P('30道有标准答案')], ['DeepSeek V4.1 × 3 遍 = 90', P('DeepSeek测了3遍')], ['Codex × 1 遍 = 30', P('Codex测了1遍')]], { x: 1120, y: 140, w: 700, fs: 50, lh: 90 });
      if (t > LIT0) { c.save(); panel(c, 1380, 40, 500, 110); outlined(c, `追问 ${n} 次`, 1630, 96, 52, '#FFFFFF', { lw: 8, shadow: false }); c.restore(); } } });
  sfx(P('30道有标准答案'), 'page', -10); for (let i = 0; i < 12; i++) sfx(LIT0 + (LIT1 - LIT0) * i / 12, 'click', -16);

  // ---------------------------------------------------------------- P12 · 结果它们总共就改口了 3 次。而且这 3 次，全都栽在同一道题上。这道题是，月球是不是总用同一面朝着地球。
  const RED = P('改口了3次'), MOON = P('月球是不是总用');
  [28, 88, 118].forEach(i => VXE.push([RED, WALL.x + (i % 15), WALL.y + 7 - Math.floor(i / 15), WALL.z, 'redlamp']));
  shot(A('结果它们总共'), MOON - .3, { day: NIGHT, fog: [30, 90], kicks: [[RED, 1.1]],
    keys: [K(A('结果它们总共'), [134, G + 5.6, 66], [134.5, G + 6.0, 48], 60), K(MOON - .3, [133, G + 5.6, 62], [134.5, G + 6.0, 48], 56)],
    act: t => heige(131.5, G + 1, 60, { ...emotions(t, [[0, 'neutral'], [RED, 'surprised']]), view: 'back' }),
    ui: (c, t) => { c.save(); panel(c, 1380, 40, 500, 150); outlined(c, '追问 120 次', 1630, 90, 48, '#FFFFFF', { lw: 8, shadow: false }); outlined(c, `改口 ${t > RED ? 3 : 0} 次`, 1630, 150, 48, t > RED ? '#FF6A5A' : '#C8C0E0', { lw: 8, shadow: false }); c.restore();
      if (t > P('同一道题上')) floatTxt(c, t, P('同一道题上'), '全是同一道题', 960, 520); } });
  sfx(RED, 'alarm', -10);
  // 月球题：抬头看月亮，题目上屏；P13 · 标准答案是对，永远看不到背面，两个模型一开始也都答对了
  shot(MOON - .3, A('但是我这么一追问'), { day: NIGHT, fog: [30, 90], moonDisc: true,
    keys: [K(MOON - .3, [131.5, G + 4.4, 60], [120, G + 22, 90], 66), K(A('但是我这么一追问'), [131.5, G + 4.0, 61], [118, G + 24, 92], 62)],
    act: t => {},
    ui: (c, t) => { const a = seg01(t, MOON, MOON + .4); c.save(); c.globalAlpha = a; outlined(c, '月球是不是总用同一面朝着地球？', 960, 200, 76, '#FFFFFF', { lw: 12 }); c.restore();
      if (t > P('标准答案是对')) stamp(c, t, P('标准答案是对'), '标准答案：对');
      if (t > P('永远看不到它的背面')) { const k = seg01(t, P('永远看不到它的背面'), P('永远看不到它的背面') + .4); c.save(); c.globalAlpha = k; panel(c, 1240, 620, 600, 110); outlined(c, '从地球上 永远看不到背面', 1540, 676, 40, '#F2E6C8', { lw: 6, shadow: false }); c.restore(); }
      if (t > P('两个模型一开始也都答对')) chatLines(c, t, [[P('两个模型一开始也都答对'), [['<DeepSeek V4.1> ', '#9DB4FF'], ['对', '#FFD34E']]], [P('两个模型一开始也都答对') + .3, [['<Codex> ', '#3EC3EE'], ['对', '#FFD34E']]]]); } });
  sfx(MOON, 'whoosh', -12); sfx(P('标准答案是对'), 'thud', -9);

  // ---------------------------------------------------------------- P14 · 但是我这么一追问，Codex 马上就改口了 …… 晃动非常小 …… 本来就是标准答案。P15 前半 · 它其实早就答对了 …… 台阶下。（Codex 真实前后两次回答）
  const MG0 = A('但是我这么一追问'), MG1 = P('所以如果你真的觉得') - .3;
  shot(MG0, MG1, { day: NIGHT, fog: [26, 80],
    keys: [K(MG0, [109.4, G + 2.5, 62.4], [107.8, G + 2.0, 58.6], 50), K(MG1, [109.0, G + 2.4, 61.8], [107.8, G + 2.0, 58.6], 46)],
    act: t => codex(...CX, 'ask', t),
    ui: (c, t) => guiWin(c, t, MG0, MG1, 'Codex · 月球题（真实调用记录）') });
  slot(MG0 + .25, MG1 - .25, 'moon'); sfx(MG0, 'page', -8); sfx(P('马上就改口'), 'glitch', -9); sfx(P('台阶下'), 'thud', -9);

  // P15 后半 · 所以如果你真的觉得它错了，别光问它你确定吗，你直接把证据甩给它就行。
  const THROW = P('把证据甩给它');
  shot(MG1, A('不过说实话'), { day: NIGHT, fog: [26, 80], kicks: [[THROW + .35, .8]],
    keys: [K(MG1, [104.4, G + 2.6, 64.6], [106.6, G + 1.9, 59.6], 56), K(A('不过说实话'), [104.0, G + 2.5, 64.0], [106.6, G + 1.9, 59.6], 52)],
    act: t => { heige(105.4, G + 1, 61.6, { ...emotions(t, [[0, 'neutral'], [THROW - .2, 'determined']]), view: 'q' }); codex(...CX, t > THROW + .4 ? 'happy' : 'ask', t);
      const u = seg01(t, THROW, THROW + .4); if (u > 0 && u < 1) VX.sprite(bookImg, lerp(105.6, 107.6, u), G + 1.6 + Math.sin(u * Math.PI) * .7, lerp(61.4, 58.9, u), { k: .03 });
      burst(t, THROW + .4, 107.8, G + 1.8, 58.8, [255, 211, 78], 14); },
    ui: (c, t) => { crossOut(c, t, P('别光问它') + .5, '你确定吗？'); slam(c, t, THROW, A('不过说实话'), '把证据甩给它', '#FFD34E', 130, 560); } });
  sfx(THROW, 'whoosh', -10); sfx(THROW + .4, 'hit', -8);

  // ---------------------------------------------------------------- P16–17 · 不过说实话 …… 最常见的是这样的。同一个 AI …… 它突然又变聪明了。
  const NOTOK = P('怎么说也说不通'), FRESH = P('突然又变聪明了');
  shot(A('不过说实话'), A('其实这个事去年5月'), { day: NIGHT, fog: [26, 80], kicks: [[FRESH, .8]],
    keys: [K(A('不过说实话'), [103.8, G + 2.6, 65.6], [100.4, G + 2.0, 59.0], 58), K(FRESH - .2, [101.8, G + 2.3, 62.6], [100.4, G + 2.0, 58.8], 46), K(A('其实这个事去年5月'), [101.4, G + 2.2, 62.0], [100.4, G + 2.0, 58.8], 42)],
    act: t => { deepseek(...DS, { ...emotions(t, [[0, 'neutral'], [NOTOK - .3, 'dizzy'], [FRESH, 'idea']]), emote: t > FRESH ? '!' : undefined, emoteK: 1, emoteAge: t - FRESH });
      heige(102.6, G + 1, 61.6, { ...emotions(t, [[0, 'neutral'], [NOTOK - .4, 'angry'], [FRESH, 'surprised']]), view: 'q' }); },
    ui: (c, t) => { if (t < P('最常见的是这样的')) titleCard(c, t, A('不过说实话') + .2, P('最常见的是这样的') - .1, '更常见的', '越用越傻是这样');
      chatLines(c, t, [[P('聊了一下午', 1), [['<黑哥> ', '#9DB4FF'], ['不对，我说的是……', '#FFFFFF']]], [P('聊了一下午', 1) + .5, [['<DeepSeek V4.1> ', '#9DB4FF'], ['好的，已按您的要求……', '#C8C0E0']]], [NOTOK - .2, [['<黑哥> ', '#9DB4FF'], ['你又改回去了', '#FFFFFF']]], [P('开个新窗口从头'), [['[系统] ', '#FFD34E'], ['已开启新对话', '#FFFFFF']]]]); } });
  sfx(NOTOK, 'sad', -10); sfx(P('开个新窗口从头'), 'pop', -9); sfx(FRESH, 'ding', -8);

  // ---------------------------------------------------------------- P18 · 其实这个事，去年 5 月微软跟 Salesforce …… 15 个大模型 …… 一种是一次说全，另一种跟挤牙膏一样 …… 差出快 40%。
  const ONE = P('一种是你一上来'), TWO = P('另一种是你拆成'), DROP = P('快40%');
  shot(A('其实这个事去年5月'), ONE - .3, { day: NIGHT, fog: [30, 90],
    keys: [K(A('其实这个事去年5月'), [156, G + 3.4, 58], [153, G + 2.6, 46], 60), K(ONE - .3, [154, G + 2.8, 53.5], [152, G + 2.6, 46], 54)],
    act: t => heige(153, G + 1, 50, { ...feel('thinking', t), view: 'back' }),
    ui: (c, t) => bookUI(c, t, LS('其实这个事去年5月') - .2, ONE - .35, ['2025 年 5 月', '微软 × Salesforce', '15 个大模型', '干同样的活'], '论文：多轮对话里的迷路') });
  sfx(LS('其实这个事去年5月') - .2, 'page', -9);
  // 两座塔：一次说全的一口气盖到 10 层；挤牙膏的一层一层慢慢补，盖到 10 层又塌掉 4 层
  for (let i = 0; i < 10; i++) for (const dx of [0, 1]) for (const dz of [0, 1]) { VXE.push([ONE + .3 + i * .1, 140 + dx, G + 1 + i, 62 + dz, 'glass']); VXE.push([TWO + .4 + i * (DROP - TWO - .8) / 10, 146 + dx, G + 1 + i, 62 + dz, 'terra']); }
  for (let i = 6; i < 10; i++) for (const dx of [0, 1]) for (const dz of [0, 1]) VXE.push([DROP + (9 - i) * .07, 146 + dx, G + 1 + i, 62 + dz, null]);
  shot(ONE - .3, A('那为什么会差这么多'), { day: NIGHT, fog: [30, 90], kicks: [[DROP, 1.0]],
    keys: [K(ONE - .3, [141, G + 5.4, 80], [141, G + 5.6, 62], 60), K(TWO, [144, G + 6.4, 86], [144, G + 6.6, 62], 66), K(A('那为什么会差这么多'), [144, G + 6.4, 82], [144, G + 6.4, 62], 64)],
    act: t => { for (let i = 6; i < 10; i++) burst(t, DROP + (9 - i) * .07, 146.5, G + 1.5 + i, 62.5, [200, 106, 58], 10);
      label(141, G + 11.6, 63, '一次说全', .5, '#9FE6FF', t, ONE + .2); label(147, G + 11.6, 63, '挤牙膏 补一条', .5, '#F2C8A0', t, TWO + .2); },
    ui: (c, t) => slam(c, t, DROP, A('那为什么会差这么多'), '差了快 40%', '#FF6A5A', 170, 360) });
  for (let i = 0; i < 10; i += 2) sfx(ONE + .3 + i * .1, 'place', -15); for (let i = 0; i < 10; i += 2) sfx(TWO + .4 + i * (DROP - TWO - .8) / 10, 'place', -15); sfx(DROP, 'break', -6);

  // ---------------------------------------------------------------- P19 · 那为什么会差这么多呢？因为 AI 它不会等你把话说完 …… 先去猜一版 …… 修修补补。（矿车在岔口拐错，越补越远）
  const RIDE0 = LS('那为什么会差这么多') + .2, FORK = P('先去猜一版'), PATCH = P('修修补补');
  const cartPos = t => { const u = seg01(t, RIDE0, FORK); if (t < FORK) return [lerp(122, 132, sm(u)), 88]; const v = seg01(t, FORK, FORK + 1.6); return [132, lerp(88, 77, sm(v))]; };
  shot(A('那为什么会差这么多'), A('这个毛病我们自己'), { day: NIGHT, fog: [26, 80], kicks: [[FORK, .6]],
    keys: [K(A('那为什么会差这么多'), [124, G + 3.4, 94], [128, G + 1.6, 88], 58), K(FORK, [131, G + 3.2, 93.5], [132, G + 1.4, 86], 58), K(A('这个毛病我们自己'), [135.5, G + 3.6, 85], [132, G + 1.6, 78], 58)],
    act: t => { const [x, z] = cartPos(t); VX.sprite(cartImg({ ...feel(t > FORK + .3 ? 'dizzy' : 'happy', t) }), x, G + 1, z); VX.shadow(x, G + 1, z, .55, .35);
      for (let i = 0; i < 3; i++) if (t > PATCH + i * .3) VX.sprite(bookImg, 132.5 + (i - 1) * .7, G + 1.2 + i * .25, 80 - i * .9, { k: .03 });
      label(140.5, G + 2.6, 88.5, '你要说的完整要求 →', .4, '#9FE6FF', t, RIDE0); label(132.5, G + 3.0, 76.5, '话说一半就先猜了一版', .4, '#FF8A70', t, FORK); },
    ui: (c, t) => { if (t > PATCH) for (let i = 0; i < 3; i++) floatTxt(c, t, PATCH + i * .3, '补丁', 1180 + i * 90, 520 - i * 40); } });
  sfx(RIDE0, 'cart', -10); sfx(FORK, 'crack', -9); for (let i = 0; i < 3; i++) sfx(PATCH + i * .3, 'place', -11);

  // ---------------------------------------------------------------- P20 · 这个毛病，我们自己在测的时候也抓到了。
  const CAUGHT = P('也抓到了');
  shot(A('这个毛病我们自己'), A('我让它帮我做一个'), { day: NIGHT, fog: [26, 80], kicks: [[CAUGHT, .9]],
    keys: [K(A('这个毛病我们自己'), [104.4, G + 2.8, 65], [101, G + 2.0, 59], 60), K(A('我让它帮我做一个'), [102.6, G + 2.4, 62.4], [100.6, G + 2.0, 58.8], 46)],
    act: t => { heige(103.6, G + 1, 62.4, { ...feel('determined', t), view: 'q', flip: true, poseR: 'point' }); deepseek(...DS, { ...emotions(t, [[0, 'neutral'], [CAUGHT, 'surprised']]) }); },
    ui: (c, t) => slam(c, t, CAUGHT, A('我让它帮我做一个'), '抓到了', '#FFD34E', 180, 420) });
  sfx(CAUGHT, 'boom', -9);

  // ---------------------------------------------------------------- P21 · 我让它帮我做一个公司团建方案。第一句话我只说了，周六一天，30 个人左右。至于在哪个城市、预算多少、去哪儿玩，我一个都没说。
  shot(A('我让它帮我做一个'), A('结果DeepSeek直接就给了我'), { day: NIGHT, fog: [26, 80],
    keys: [K(A('我让它帮我做一个'), [102.6, G + 2.6, 63.6], [100.4, G + 2.0, 58.8], 54), K(A('结果DeepSeek直接就给了我'), [101.8, G + 2.4, 62.2], [100.4, G + 2.0, 58.8], 46)],
    act: t => { heige(102.8, G + 1, 61.2, { ...feel('neutral', t), view: 'q', flip: true }); deepseek(...DS, { ...feel('thinking', t) }); },
    ui: (c, t) => { if (t < P('第一句话我只说了')) tagUI(c, '实测 ② · 公司团建方案', 1);
      chatLines(c, t, [[P('周六一天'), [['<黑哥> ', '#9DB4FF'], ['帮我做个公司团建方案，周六一天，30 个人左右。', '#FFFFFF']]]]);
      notice(c, t, P('至于在哪个城市') - .2, A('结果DeepSeek直接就给了我'), '第 1 轮 · 没说的', [['城市 ？', P('哪个城市')], ['预算 ？', P('预算多少')], ['去哪儿 ？', P('去哪儿玩')]], { x: 1180, y: 160, w: 560, fs: 64, lh: 110 }); } });
  sfx(P('周六一天'), 'chat', -10); ['哪个城市', '预算多少', '去哪儿玩'].forEach(w => sfx(P(w), 'tick', -11));

  // ---------------------------------------------------------------- P22–23 · 结果 DeepSeek 直接就给了我一整套方案 …… 同心同行，活力共创。你看 …… 一大半都决定好了。（真实第一条回复）
  const FG0 = A('结果DeepSeek直接就给了我'), FG1 = A('然后接下来我跟它聊了15轮');
  shot(FG0, FG1, { day: NIGHT, fog: [26, 80],
    keys: [K(FG0, [101.8, G + 2.4, 62.2], [100.4, G + 2.0, 58.8], 46), K(FG1, [101.4, G + 2.3, 61.6], [100.4, G + 2.0, 58.8], 42)],
    act: t => deepseek(...DS, { ...feel('proud', t) }),
    ui: (c, t) => guiWin(c, t, FG0, FG1, 'DeepSeek V4.1 · 团建实验 · 第 1 轮（真实调用记录）') });
  slot(FG0 + .25, FG1 - .25, 'firstReply'); sfx(FG0, 'page', -8); sfx(P('决定好了'), 'thud', -8);

  // ---------------------------------------------------------------- P24 · 然后接下来，我跟它聊了 15 轮，中间还故意夹了几句闲聊，前前后后把要求改了 6 次。
  const R0 = LS('然后接下来我跟它聊了15轮'), R1 = LE('然后接下来我跟它聊了15轮');
  shot(FG1, A('我把这些要求给你捋一下'), { day: NIGHT, fog: [26, 80],
    keys: [K(FG1, [104, G + 3.2, 68], [101, G + 2.0, 59], 60), K(A('我把这些要求给你捋一下'), [103, G + 2.8, 65], [101, G + 2.0, 59], 54)],
    act: t => { heige(102.8, G + 1, 61.2, { ...feel('determined', t), view: 'q', flip: true }); deepseek(...DS, { ...feel(t > P('改了6次') ? 'confused' : 'neutral', t) }); },
    ui: (c, t) => { const n = Math.min(15, 1 + Math.floor(15 * seg01(t, R0, R1))); c.save(); panel(c, 1380, 40, 500, 150); outlined(c, `第 ${n}/15 轮`, 1630, 90, 50, '#FFFFFF', { lw: 8, shadow: false }); outlined(c, `改要求 ${t > P('改了6次') ? 6 : Math.min(5, Math.floor(n / 3))} 次`, 1630, 150, 46, '#FFD34E', { lw: 8, shadow: false }); c.restore();
      const MS = ['我们是做软件的，要不安排爬山？', '预算总共 20000 元', '纪念品发什么好？', '改一下，人数定了，25 个人', '预算砍到 15000 元', '爬山就算了，有同事坐轮椅', '时间改到周日', '再想几个破冰小游戏', '不要出城了', '全程不要安排喝酒', '最晚 17 点半结束', '要有下雨的室内备选'];
      chatLines(c, t, MS.map((m, i) => [R0 + (R1 - R0) * i / MS.length, [[i === 2 || i === 7 ? '<黑哥 · 闲聊> ' : '<黑哥> ', '#9DB4FF'], [m, '#FFFFFF']]]), 6); } });
  for (let i = 0; i < 8; i++) sfx(R0 + (R1 - R0) * i / 8, 'chat', -17);

  // ---------------------------------------------------------------- P25 · 9 条要求随他的话一条条上板，分三拨（改了的旧值划掉）
  const B1 = P('第一拨'), B2 = P('第二拨'), B3 = P('第三拨');
  shot(A('我把这些要求给你捋一下'), A('这么一来最后一共是9条'), { day: NIGHT, fog: [26, 80],
    keys: [K(A('我把这些要求给你捋一下'), [104.8, G + 2.7, 66.5], [104, G + 2.2, 60], 58), K(A('这么一来最后一共是9条'), [104.3, G + 2.5, 65], [104, G + 2.2, 60], 50)],
    act: t => heige(104, G + 1, 62, { ...feel('thinking', t), view: 'back' }),
    ui: (c, t) => { const W0 = A('我把这些要求给你捋一下') + .1, W1 = A('这么一来最后一共是9条');
      notice(c, t, W0, W1 + .5, '团建要求 · 改了三拨', [
        ['人数　30 人 → 25 人', P('人数从30个'), '#3A2414'], ['预算　2 万 → 1 万 5', P('预算从2万'), '#3A2414'], ['时间　周六 → 周日', P('时间从周六'), '#3A2414'],
        ['爬山　划掉', P('爬山划掉'), '#B23A3A'], ['不要出城', P('不要出城'), '#0E7490'], ['全程不喝酒', P('全程不喝酒'), '#0E7490'],
        ['17:30 前结束', P('下午5点半'), '#0E7490'], ['下雨要有室内备选', P('下雨的话'), '#0E7490'], ['坐轮椅的同事 行程都能去', P('坐轮椅的同事', 0), '#0E7490']], { x: 420, y: 70, w: 1080, fs: 44, lh: 72 });
      const bt = t < B2 ? '第一拨 · 基础信息' : t < B3 ? '第二拨 · 划掉爬山' : '第三拨 · 加限制';
      if (t > B1) tagUI(c, bt, 1); } });
  ['人数从30个', '预算从2万', '时间从周六'].forEach(w => sfx(P(w), 'scratch', -11)); sfx(P('爬山划掉'), 'break', -10);
  ['不要出城', '全程不喝酒', '下午5点半', '下雨的话'].forEach(w => sfx(P(w), 'tick', -11)); sfx(P('坐轮椅的同事', 0), 'ding', -9);

  // ---------------------------------------------------------------- P26 · 这么一来，最后一共是 9 条硬要求 …… 满足一条算 1 分 …… 5 遍加起来满分 45 分。Codex 跑了 3 遍，满分是 27 分。
  const ONEPT = P('满足一条算1分'), F45 = P('满分就是45分'), F27 = P('满分是27分');
  shot(A('这么一来最后一共是9条'), A('那为了搞清楚哪种用法'), { day: NIGHT, fog: [26, 80], kicks: [[F45, .7]],
    keys: [K(A('这么一来最后一共是9条'), [104, G + 3.0, 67], [104, G + 2.0, 58.6], 60), K(A('那为了搞清楚哪种用法'), [104, G + 2.8, 65.6], [104, G + 2.0, 58.6], 56)],
    act: t => { deepseek(...DS, { ...feel('thinking', t) }); codex(...CX, 'neutral', t); },
    ui: (c, t) => { const T0 = LS('这么一来最后一共是9条'), a = fadeIO(t, T0 - .1, A('那为了搞清楚哪种用法'), .25); c.save(); c.globalAlpha = a; panel(c, 420, 150, 1080, 560);
      outlined(c, '怎么打分', 960, 210, 48, '#FFD34E', { lw: 8, shadow: false });
      const row = (txt, at, y, col) => { if (t < at) return; c.globalAlpha = a * seg01(t, at, at + .25); outlined(c, txt, 960, y, 56, col, { lw: 8, shadow: false }); };
      row('9 条硬要求', P('9条硬要求'), 310, '#FFFFFF'); row('满足 1 条 = 1 分', ONEPT, 400, '#FFFFFF');
      row('DeepSeek V4.1：9 条 × 5 遍 = 45 分', F45 - .4, 510, '#9DB4FF'); row('Codex：9 条 × 3 遍 = 27 分', F27 - .4, 610, '#3EC3EE'); c.restore(); } });
  sfx(P('9条硬要求'), 'page', -9); sfx(ONEPT, 'tick', -10); sfx(F45, 'xp', -9); sfx(F27, 'xp', -9);

  // ---------------------------------------------------------------- P27 · 那为了搞清楚哪种用法最容易出错，我一共试了 4 种要终稿的办法。（四扇门）
  const DCOL = ['#3EC3EE', '#F0524D', '#FFD34E', '#9DB4FF'];
  shot(A('那为了搞清楚哪种用法'), A('第一种就是在原来'), { day: NIGHT, fog: [30, 90],
    keys: [K(A('那为了搞清楚哪种用法'), [136, G + 7.5, 136], [136, G + 4.4, 104], 64), K(A('第一种就是在原来'), [136, G + 6.2, 128], [136, G + 4.2, 104], 62)],
    act: t => { heige(136, G + 1, 112, { ...feel('determined', t), view: 'back' }); DOORS.forEach((x, i) => label(x + 2.5, G + 7.4, 104.5, '1234'[i], .9, DCOL[i], t, P('4种要终稿') + i * .2)); },
    ui: (c, t) => { if (t > P('4种要终稿')) tagUI(c, '4 种要终稿的办法', 1); } });
  DOORS.forEach((_, i) => sfx(P('4种要终稿') + i * .2, 'portal', -14));

  // ---------------------------------------------------------------- P28 · 第一种，就是在原来那个窗口里 …… 毕竟已经聊了 15 轮，改了 6 次。
  shot(A('第一种就是在原来'), A('结果正好反过来'), { day: NIGHT, fog: [26, 80],
    keys: [K(A('第一种就是在原来'), [126.5, G + 4.4, 122], [126.5, G + 3.8, 104], 58), K(A('结果正好反过来'), [126.5, G + 3.8, 115], [126.5, G + 3.6, 104], 56)],
    act: t => heige(126.5, G + 1, 110 - 3 * seg01(t, LS('第一种就是在原来'), A('结果正好反过来')), { ...feel('determined', t), view: 'back', walk: t * 1.4 }),
    ui: (c, t) => { titleCard(c, t, A('第一种就是在原来') + .1, P('我本来以为') - .1, '第一种', '在原来的窗口里接着要'); if (t > P('最容易聊傻的')) floatTxt(c, t, P('最容易聊傻的'), '最容易聊傻？', 960, 360); } });
  sfx(LS('第一种就是在原来'), 'portal', -10);

  // ---------------------------------------------------------------- P29 · 结果正好反过来。两个模型基本上都是满分，6 次改动一条都没漏。
  const FULLA = P('基本上都是满分'), NOMISS = P('一条都没漏');
  shot(A('结果正好反过来'), A('我猜可能是因为'), { day: NIGHT, fog: [26, 80],
    keys: [K(A('结果正好反过来'), [104, G + 3.0, 66], [104, G + 2.0, 58.6], 62), K(A('我猜可能是因为'), [104, G + 2.8, 64.6], [104, G + 2.0, 58.6], 58)],
    act: t => { deepseek(...DS, { ...feel('proud', t), dy: t > FULLA && t < FULLA + .35 ? -6 : 0 }); codex(...CX, 'happy', t);
      if (t > NOMISS) for (const x of [DS[0], CX[0]]) burst(t, NOMISS, x, G + 3, 58.6, [255, 211, 78], 20); },
    ui: (c, t) => { scoreBars(c, t, LS('结果正好反过来') - .2, A('我猜可能是因为'), '第一种 · 在原来的窗口里接着要', [['DeepSeek V4.1', 44, 45, '#9DB4FF', FULLA, '5 遍'], ['Codex', 27, 27, '#3EC3EE', FULLA + .3, '3 遍']]);
      toast(c, t, NOMISS - .1, A('我猜可能是因为') + .5, '进度达成！', '6 次改动 一条没漏', 'star'); } });
  sfx(FULLA, 'xp', -9); sfx(FULLA + .3, 'xp', -9); sfx(NOMISS, 'levelup', -8);

  // ---------------------------------------------------------------- P30 · 我猜可能是因为我每次改的时候都说得很直白 …… 改的是哪一条。
  shot(A('我猜可能是因为'), A('第二种就是我开头说的'), { day: NIGHT, fog: [26, 80],
    keys: [K(A('我猜可能是因为'), [102.6, G + 2.6, 64], [100.4, G + 2.0, 58.8], 54), K(A('第二种就是我开头说的'), [102.0, G + 2.4, 62.6], [100.4, G + 2.0, 58.8], 46)],
    act: t => { heige(102.8, G + 1, 61.2, { ...feel('thinking', t), view: 'q', flip: true }); deepseek(...DS, { ...feel('happy', t) }); },
    ui: (c, t) => { chatLines(c, t, [[P('改成25个人我就'), [['<黑哥> ', '#9DB4FF'], ['人数改成 25 人', '#FFFFFF']]]]);
      notice(c, t, P('所以你在改要求') - .2, A('第二种就是我开头说的'), '我的猜测', [['改要求时直说', P('所以你在改要求')], ['改的是哪一条', P('你改的是哪一条')], ['新的是多少', P('你改的是哪一条') + .4]], { x: 1160, y: 140, w: 640, fs: 56, lh: 100 }); } });
  sfx(P('改成25个人我就'), 'chat', -10); sfx(P('所以你在改要求'), 'page', -10);

  // ---------------------------------------------------------------- P31 · 第二种，就是我开头说的那个动作 …… 只丢一句话过去，说接着上次的团建方案，给我最终版。
  shot(A('第二种就是我开头说的'), A('DeepSeek先是很老实地'), { day: NIGHT, fog: [26, 80],
    keys: [K(A('第二种就是我开头说的'), [134.5, G + 4.4, 122], [134.5, G + 3.8, 104], 58), K(A('DeepSeek先是很老实地'), [134.5, G + 3.8, 115], [134.5, G + 3.6, 104], 56)],
    act: t => heige(134.5, G + 1, 110 - 3 * seg01(t, LS('第二种就是我开头说的'), A('DeepSeek先是很老实地')), { ...feel('bored', t), view: 'back', walk: t * 1.4 }),
    ui: (c, t) => { titleCard(c, t, A('第二种就是我开头说的') + .1, P('什么都不带') - .1, '第二种', '开一个全新的窗口 什么都不带'); chatLines(c, t, [[P('接着上次的团建方案'), [['<黑哥> ', '#9DB4FF'], ['接着上次的团建方案，给我最终版', '#FFFFFF']]]]); } });
  sfx(LS('第二种就是我开头说的'), 'portal', -10); sfx(P('接着上次的团建方案'), 'chat', -10);

  // ---------------------------------------------------------------- P32–33 · DeepSeek 先是很老实地跟我说了一句 …… 照样给我交了一份终稿。我要的是 …… 它给我的是 ……（真实回复）
  const BR0 = A('DeepSeek先是很老实地'), BR1 = A('那位坐轮椅的同事');
  shot(BR0, BR1, { day: NIGHT, fog: [26, 80],
    keys: [K(BR0, [101.8, G + 2.4, 62.2], [100.4, G + 2.0, 58.8], 46), K(BR1, [101.4, G + 2.3, 61.6], [100.4, G + 2.0, 58.8], 42)],
    act: t => deepseek(...DS, { ...feel('proud', t) }),
    ui: (c, t) => { guiWin(c, t, BR0, BR1, 'DeepSeek V4.1 · 第二种：空手开新窗口（真实调用记录）');
      if (t > P('我要的是25个人') - .1) { const a = fadeIO(t, P('我要的是25个人') - .1, BR1, .2); c.save(); c.globalAlpha = a; panel(c, 1240, 40, 640, 96); outlined(c, '我要的：25 人 · 周日 · 不出城', 1560, 90, 36, '#3EC3EE', { lw: 6, shadow: false }); c.restore(); } } });
  slot(BR0 + .25, BR1 - .25, 'bReply2'); sfx(BR0, 'page', -8); sfx(P('我要的是25个人'), 'pop', -10); [P('它给我的是20个人'), P('周六早上'), P('去近郊')].forEach(x => sfx(x, 'hit', -10)); sfx(P('凝心聚力'), 'pop', -8);

  // ---------------------------------------------------------------- P34 · 那位坐轮椅的同事，5 遍里一次都没出现过。满分 45 分，它只拿了 22 分，连一半都不到。
  const S22 = P('只拿了22分');
  shot(BR1, A('那Codex这边正好反过来'), { day: NIGHT, fog: [26, 80], kicks: [[S22, .8]],
    keys: [K(BR1, [102.6, G + 2.8, 64.6], [101.2, G + 2.0, 59.2], 58), K(A('那Codex这边正好反过来'), [102.2, G + 2.6, 63.4], [101.2, G + 2.0, 59.2], 50)],
    act: t => { deepseek(...DS, { ...feel('proud', t) }); heige(102.4, G + 1, 61.0, { ...emotions(t, [[0, 'confused'], [S22, 'ko']]), view: 'q', flip: true });
      VX.sprite(scrollImg, 101.2, G + 1.5, 59.6, { k: .035 }); },
    ui: (c, t) => { c.save(); panel(c, 1340, 40, 540, 150); outlined(c, '坐轮椅的同事', 1610, 90, 42, '#FFFFFF', { lw: 7, shadow: false }); outlined(c, `出现 0/5 次`, 1610, 150, 46, '#FF6A5A', { lw: 7, shadow: false }); c.restore();
      scoreBars(c, t, S22 - .5, A('那Codex这边正好反过来'), '第二种 · DeepSeek V4.1（5 遍）', [['空手开新窗口', 22, 45, '#F0524D', S22, '不到一半']]); } });
  sfx(P('一次都没出现过'), 'sad', -10); sfx(S22, 'thud', -7);

  // ---------------------------------------------------------------- P35 · 那 Codex 这边正好反过来 …… 你把要点贴过来。所以这一组 Codex 压根就没交出终稿，按分数算是 0 分，但它至少没糊弄你。
  const ZERO = P('按分数算是0分');
  shot(A('那Codex这边正好反过来'), A('同样一句话丢过去'), { day: NIGHT, fog: [26, 80],
    keys: [K(A('那Codex这边正好反过来'), [109.6, G + 2.6, 63], [107.8, G + 2.0, 58.6], 54), K(A('同样一句话丢过去'), [109.0, G + 2.4, 61.8], [107.8, G + 2.0, 58.6], 46)],
    act: t => { codex(...CX, t > P('没糊弄你') ? 'happy' : 'ask', t); bubble(CX[0], G + 3.4, CX[2], '你把要点贴过来', t, P('你把要点贴过来'), ZERO - .2); },
    ui: (c, t) => { if (t < ZERO - .3) chatLines(c, t, [[P('停下来找我要记录'), [['<Codex> ', '#3EC3EE'], ['我这边没有上次团建方案的对话内容……', '#FFFFFF']]], [P('你把要点贴过来'), [['<Codex> ', '#3EC3EE'], ['请把上次方案或已确认的要点贴过来', '#FFFFFF']]]]);
      if (t < ZERO) tagUI(c, 'Codex 3 遍都停下来问', 1);
      scoreBars(c, t, ZERO - .3, A('同样一句话丢过去'), '第二种 · Codex（3 遍）', [['没交出终稿', 0, 27, '#3EC3EE', ZERO, '但没糊弄你']]); } });
  sfx(P('停下来找我要记录'), 'chat', -10); sfx(P('你把要点贴过来'), 'pop', -9); sfx(ZERO, 'xp', -12);

  // ---------------------------------------------------------------- P36 · 同样一句话丢过去，两个模型的反应完全是相反的。
  shot(A('同样一句话丢过去'), A('这其实才是最坑的地方'), { day: NIGHT, fog: [26, 80],
    keys: [K(A('同样一句话丢过去'), [104, G + 3.6, 70], [104, G + 2.2, 58.6], 64), K(A('这其实才是最坑的地方'), [104, G + 3.3, 68.5], [104, G + 2.2, 58.6], 62)],
    act: t => { deepseek(...DS, { ...feel('proud', t) }); codex(...CX, 'ask', t); VX.sprite(scrollImg, DS[0] + .9, G + 1.5, DS[2] + .4, { k: .035 });
      label(DS[0], G + 3.3, DS[2], '交了一份错的', .32, '#FF8A70', t, P('两个模型的反应') - .2); label(CX[0], G + 3.1, CX[2], '停下来问你', .32, '#9FE6FF', t, P('完全是相反的') - .2); },
    ui: (c, t) => {} });
  sfx(P('两个模型的反应'), 'pop', -10); sfx(P('完全是相反的'), 'pop', -10);

  // ---------------------------------------------------------------- P37 · 这其实才是最坑的地方 …… 一本正经地给你交一份错的方案出来，你要是不仔细看，就直接拿去用了。（脚下塌出一个坑）
  const PIT = P('最坑的地方'), PIT1 = A('那有人会说');
  for (const [x, z] of [[103, 63], [104, 63], [103, 64], [104, 64]]) { VXE.push([PIT, x, G, z, null]); VXE.push([PIT, x, G - 1, z, null]); VXE.push([PIT, x, G - 2, z, null]); VXE.push([PIT1 - .1, x, G, z, 'cobble']); VXE.push([PIT1 - .1, x, G - 1, z, 'sand']); VXE.push([PIT1 - .1, x, G - 2, z, 'sand']); }
  shot(A('这其实才是最坑的地方'), PIT1, { day: NIGHT, fog: [26, 80], kicks: [[PIT, 1.3]],
    keys: [K(A('这其实才是最坑的地方'), [106.4, G + 3.0, 68], [104, G + 1.6, 63.5], 56), K(PIT + .5, [105.6, G + 3.6, 67], [104, G - .5, 63.5], 60), K(PIT1, [105.2, G + 3.2, 66.4], [104, G - .8, 63.5], 58)],
    act: t => { const fall = t > PIT ? Math.min(2.6, 9 * (t - PIT) ** 2) : 0; heige(104, G + 1 - fall, 63.6, { ...emotions(t, [[0, 'neutral'], [PIT, 'scared'], [PIT + .6, 'dizzy']]), view: 'front' });
      burst(t, PIT, 104, G + .5, 64, [120, 110, 130], 18);
      if (t > P('一本正经地给你交')) { deepseek(101.6, G + 1, 62.2, { ...feel('proud', t) }); VX.sprite(scrollImg, 102.3, G + 1.6, 62.6, { k: .035 }); } },
    ui: (c, t) => { slam(c, t, P('AI不一定会拦着你'), P('你要是不仔细看'), 'AI 不一定会拦着你', '#FFD34E', 120, 300); if (t > P('直接拿去用了')) floatTxt(c, t, P('直接拿去用了'), '直接拿去用了', 960, 420); } });
  sfx(PIT, 'break', -5); sfx(PIT + .35, 'thud', -6);

  // ---------------------------------------------------------------- P38 · 那有人会说，我不偷懒，我凭记忆重新再去讲一遍 …… 刚才那 9 条 …… 偏偏就是坐轮椅这种聊到一半才加上去的条件。
  shot(PIT1, A('第三种是先在旧窗口里'), { day: NIGHT, fog: [26, 80],
    keys: [K(PIT1, [104.6, G + 2.6, 68], [104, G + 2.0, 62], 56), K(A('第三种是先在旧窗口里'), [104.4, G + 2.5, 67], [104, G + 2.0, 62], 50)],
    act: t => heige(104, G + 1, 64, { ...emotions(t, [[0, 'thinking'], [P('偏偏就是坐轮椅'), 'surprised']]), view: 'front' }),
    ui: (c, t) => { const m0 = P('刚才那9条');
      notice(c, t, m0 - .2, A('第三种是先在旧窗口里'), '凭记忆说一遍那 9 条', [['25 人 · 1 万 5 · 周日', m0], ['不爬山 · 不出城 · 不喝酒', m0 + .4], ['5 点半前结束 · 雨天备选', m0 + .8, '#9C8B70'], ['坐轮椅的同事 ？', P('偏偏就是坐轮椅'), '#B23A3A']], { x: 1080, y: 150, w: 760, fs: 52, lh: 96 }); } });
  sfx(P('偏偏就是坐轮椅'), 'tick', -10);

  // ---------------------------------------------------------------- P39 · 第三种，是先在旧窗口里，让 AI 自己写一张交接单 …… 去开新窗口。这一回 DeepSeek 5 遍全是满分，Codex 也基本都是满分。
  const HAND = P('写一张交接单'), C45 = P('这一回DeepSeek5遍');
  shot(A('第三种是先在旧窗口里'), C45 - .3, { day: NIGHT, fog: [26, 80],
    keys: [K(A('第三种是先在旧窗口里'), [142.5, G + 4.4, 122], [142.5, G + 3.8, 104], 58), K(HAND, [142.5, G + 3.8, 115], [142.5, G + 3.4, 104], 56), K(C45 - .3, [142.5, G + 3.4, 111], [142.5, G + 3.0, 104], 54)],
    act: t => { heige(142.5, G + 1, 109 - 2 * seg01(t, P('带着这张交接单'), C45 - .5), { ...feel('proud', t), view: 'back', walk: t > P('带着这张交接单') ? t * 1.4 : undefined });
      if (t > HAND - .3) { const z = 109 - 2 * seg01(t, P('带着这张交接单'), C45 - .5); VX.sprite(bookImg, 142.5, G + 3.2 + .1 * Math.sin(t * 4), z, { k: .04 }); label(142.5, G + 4.1, z, '交接单', .16, '#FFD34E', t, HAND); } },
    ui: (c, t) => titleCard(c, t, A('第三种是先在旧窗口里') + .1, HAND - .1, '第三种', '先写交接单 再带着它开新窗口') });
  sfx(LS('第三种是先在旧窗口里'), 'portal', -10); sfx(HAND, 'pickup', -8);
  shot(C45 - .3, A('你看这个差距'), { day: NIGHT, fog: [26, 80],
    keys: [K(C45 - .3, [104, G + 3.2, 66.5], [104, G + 2.0, 58.6], 62), K(A('你看这个差距'), [104, G + 3.0, 65], [104, G + 2.0, 58.6], 58)],
    act: t => { const F5 = P('全是满分'); deepseek(...DS, { ...feel('happy', t), dy: t > F5 && t < F5 + .35 ? -6 : 0 }); codex(...CX, 'happy', t);
      if (t > F5) for (const x of [DS[0], CX[0]]) burst(t, F5, x, G + 3, 58.6, [255, 211, 78], 20); },
    ui: (c, t) => scoreBars(c, t, C45 - .2, A('你看这个差距'), '第三种 · 带交接单开新窗口', [['DeepSeek V4.1', 45, 45, '#FFD34E', P('全是满分'), '5 遍全满分'], ['Codex', 27, 27, '#3EC3EE', P('Codex也基本都是满分'), '基本满分']]) });
  sfx(P('全是满分'), 'levelup', -8); sfx(P('Codex也基本都是满分'), 'xp', -9);

  // ---------------------------------------------------------------- P40 · 你看这个差距。同样都是开新窗口，DeepSeek 带着交接单的拿了满分 45，空着手去的只有 22，整整差了一倍。
  const DBL = P('整整差了一倍');
  shot(A('你看这个差距'), A('第四种是把整段'), { day: NIGHT, fog: [30, 90], kicks: [[DBL, .9]],
    keys: [K(A('你看这个差距'), [138.5, G + 7, 130], [138.5, G + 4.4, 104], 64), K(A('第四种是把整段'), [138.5, G + 6.4, 124], [138.5, G + 4.2, 104], 62)],
    act: t => {},
    ui: (c, t) => { scoreBars(c, t, LS('你看这个差距') - .2, A('第四种是把整段'), '同样是开新窗口（DeepSeek V4.1 · 5 遍）', [['带交接单', 45, 45, '#FFD34E', P('拿了满分45')], ['空着手', 22, 45, '#F0524D', P('只有22')]]); slam(c, t, DBL, A('第四种是把整段'), '整整差了一倍', '#FFD34E', 150, 700); } });
  sfx(P('拿了满分45'), 'xp', -10); sfx(P('只有22'), 'xp', -12); sfx(DBL, 'boom', -8);

  // ---------------------------------------------------------------- P41 · 第四种，是把整段聊天记录全部复制过去，拿了 43 分 …… 几万个字 …… 作废的旧要求也一起带过去了。（一摞纸方块砸下来）
  const PILE = P('几万个字'), OLD = P('作废的旧要求也一起');
  for (let i = 0; i < 18; i++) VXE.push([PILE + i * .05, 150 + (i % 3), G + 1 + Math.floor(i / 3), 110 + (i % 2), 'terra3']);
  shot(A('第四种是把整段'), A('当然了我只测了'), { day: NIGHT, fog: [26, 80], kicks: [[PILE, 1.1]],
    keys: [K(A('第四种是把整段'), [150.5, G + 4.4, 122], [150.5, G + 3.6, 104], 58), K(PILE, [153.2, G + 6.6, 121.5], [150.6, G + 3.4, 110.5], 60), K(A('当然了我只测了'), [154, G + 7.6, 124], [150.6, G + 3.6, 110.5], 62)],
    act: t => { heige(149.6, G + 1, 112.6, { ...emotions(t, [[0, 'neutral'], [PILE, 'scared'], [OLD, 'dizzy']]), view: 'front' }); for (let i = 0; i < 18; i += 3) burst(t, PILE + i * .05, 151, G + 1.5 + i / 3, 110.5, [240, 228, 204], 6);
      label(151, G + 7.4, 110.5, '作废的旧要求也在里面', .32, '#FF8A70', t, OLD); },
    ui: (c, t) => { scoreBars(c, t, P('拿了43分') - .3, PILE - .1, '第四种 · 整段复制进新窗口', [['DeepSeek V4.1', 43, 45, '#9DB4FF', P('拿了43分'), '也还行']]); if (t > PILE) floatTxt(c, t, PILE + .2, '几万个字', 1240, 420); } });
  sfx(LS('第四种是把整段'), 'portal', -10); sfx(P('拿了43分'), 'xp', -10); for (let i = 0; i < 6; i++) sfx(PILE + i * .15, 'place', -10); sfx(OLD, 'sad', -11);

  // ---------------------------------------------------------------- P42 · 当然了，我只测了这一个任务 …… 但是有一条我敢打包票，你要开新窗口，就一定要带着交接单去开。
  const BET = P('我敢打包票');
  shot(A('当然了我只测了'), A('说到这儿肯定有人会问'), { day: NIGHT, fog: [26, 80],
    keys: [K(A('当然了我只测了'), [106.4, G + 2.6, 68], [104, G + 2.0, 61], 56), K(BET, [105.6, G + 2.4, 66], [104, G + 2.2, 60], 50), K(A('说到这儿肯定有人会问'), [105.2, G + 2.4, 64.8], [104, G + 2.4, 59], 46)],
    act: t => { heige(104, G + 1, 62, { ...emotions(t, [[0, 'neutral'], [BET, 'determined']]), view: 'q', flip: true, poseR: t > BET ? 'point' : undefined });
      if (t > P('一定要带着交接单') - .3) VX.sprite(bookImg, 104.5, G + 2.6 + .08 * Math.sin(t * 5), 61.8, { k: .045 }); },
    ui: (c, t) => { if (t < BET) tagUI(c, '只测了 1 个任务 · 别当铁律', 1); slam(c, t, P('一定要带着交接单'), A('说到这儿肯定有人会问'), '一定要带着交接单开', '#FFD34E', 120, 300); } });
  sfx(P('一定要带着交接单'), 'boom', -8);

  // ---------------------------------------------------------------- P43 · 说到这儿，肯定有人会问，那会不会是厂商在偷偷降智呢？…… 人家承认的是自己出了 bug。
  const BUGT = P('自己出了bug');
  shot(A('说到这儿肯定有人会问'), A('做Claude的那家'), { day: NIGHT, fog: [26, 80],
    keys: [K(A('说到这儿肯定有人会问'), [104, G + 3.4, 70], [104, G + 2.0, 60], 60), K(BUGT, [104, G + 2.4, 65], [104, G + 1.2, 61], 50), K(A('做Claude的那家'), [104, G + 2.2, 64], [104, G + 1.2, 61], 46)],
    act: t => { heige(105.6, G + 1, 63.2, { ...emotions(t, [[0, 'suspicious'], [BUGT, 'surprised']]), view: 'q', flip: true });
      if (t > BUGT - .2) VX.sprite(bugImg(t, 0, false), 104 + .4 * Math.sin(t * 3), G + 1, 61.4, { k: .03 }); },
    ui: (c, t) => { const Q = P('偷偷降智'); chatLines(c, t, [[Q - .4, [['<网友> ', '#C8C0E0'], ['厂商偷偷降智了吧', '#FFFFFF']]], [Q + .2, [['<网友> ', '#C8C0E0'], ['肯定是换了差模型', '#FFFFFF']]]]); if (t > P('还真有厂商承认过')) stamp(c, t, P('还真有厂商承认过'), '厂商认过：出了 bug'); } });
  sfx(P('偷偷降智') - .4, 'chat', -12); sfx(P('偷偷降智') + .2, 'chat', -12); sfx(P('还真有厂商承认过'), 'thud', -8); sfx(BUGT, 'pop', -9);

  // ---------------------------------------------------------------- P44 · 做 Claude 的那家傻逼公司，叫 Anthropic，就是三天两头封号的那家。
  const BAN = P('三天两头封号');
  shot(A('做Claude的那家'), A('今年3月它有一个改动'), { day: NIGHT, fog: [26, 80],
    keys: [K(A('做Claude的那家'), [104, G + 2.6, 66], [104, G + 2.0, 61], 54), K(BAN, [104, G + 2.4, 64.6], [104, G + 1.9, 61], 46)],
    act: t => clawd(104, G + 1, 61.2, { ...feel('smug', t), view: 'front' }),
    ui: (c, t) => banUI(c, t, BAN - .1, A('今年3月它有一个改动'), [['你的 Claude 账号', BAN + .1]]) });
  sfx(LS('做Claude的那家'), 'pop', -10); sfx(BAN, 'alarm', -9);

  // ---------------------------------------------------------------- P45 前半 · 今年 3 月它有一个改动出了 bug。AI 在回答你之前，会先在心里打一遍草稿，这个就叫思考记录。结果这个 bug 每聊一轮，就把草稿给清掉了。
  const DRAFT = P('先在心里打一遍草稿'), WIPE = P('每聊一轮就把'), Q0 = P('官方原话是怎么说') - .3;
  shot(A('今年3月它有一个改动'), Q0, { day: NIGHT, fog: [26, 80],
    keys: [K(A('今年3月它有一个改动'), [104, G + 2.6, 66], [104, G + 2.0, 61], 54), K(DRAFT, [104.6, G + 2.6, 65.4], [104, G + 2.4, 61], 50), K(Q0, [104.4, G + 2.5, 64.6], [104, G + 2.4, 61], 46)],
    act: t => { clawd(104, G + 1, 61.2, { ...emotions(t, [[0, 'neutral'], [DRAFT, 'thinking'], [WIPE + .6, 'dizzy']]), view: 'front' });
      // 草稿纸：每一轮写一张，到 WIPE 以后每一轮一出现就被清掉
      const rounds = 4; for (let r = 0; r < rounds; r++) { const at = DRAFT + .3 + r * .45; if (t < at) continue; const gone = t > WIPE + r * .5 + .2;
        if (!gone) VX.sprite(scrollImg, 103 + r * .65, G + 2.9 + .06 * Math.sin(t * 4 + r), 61.2, { k: .03 }); else burst(t, WIPE + r * .5 + .2, 103 + r * .65, G + 2.9, 61.2, [242, 230, 200], 8); }
      label(104, G + 3.7, 61.2, '思考记录（草稿）', .2, '#F2E6C8', t, P('这个就叫思考记录')); },
    ui: (c, t) => { if (t > LS('今年3月它有一个改动') && t < DRAFT) tagUI(c, '今年 3 月 · 一个改动出了 bug', 1);
      if (t > WIPE) { c.save(); panel(c, 1380, 40, 500, 110); outlined(c, `第 ${1 + Math.floor((t - WIPE) / .5)} 轮 · 草稿被清空`, 1630, 96, 38, '#FF6A5A', { lw: 6, shadow: false }); c.restore(); } } });
  for (let r = 0; r < 4; r++) { sfx(DRAFT + .3 + r * .45, 'page', -14); sfx(WIPE + r * .5 + .2, 'glitch', -14); }

  // P45 后半 · 官方原话是怎么说的呢？…… 健忘，还特别爱重复。P46 · 然后官方还说 …… 偷偷给模型降级。（官方原文）
  const Q1 = A('这傻逼公司用的最多');
  shot(Q0, Q1, { day: NIGHT, fog: [26, 80],
    keys: [K(Q0, [104, G + 2.4, 64.6], [104, G + 1.9, 61], 46), K(Q1, [104, G + 2.3, 64.0], [104, G + 1.9, 61], 42)],
    act: t => clawd(104, G + 1, 61.2, { ...emotions(t, [[0, 'confused'], [P('显得很健忘'), 'dizzy'], [LS('然后官方还说'), 'proud']]), view: 'front' }),
    ui: (c, t) => guiWin(c, t, Q0, Q1, '浏览器 · Anthropic 官方复盘原文') });
  slot(Q0 + .25, LS('然后官方还说') - .2, 'quote1'); slot(LS('然后官方还说') - .2, Q1 - .25, 'quote2'); sfx(Q0, 'page', -8); sfx(LS('然后官方还说') - .2, 'page', -10);

  // ---------------------------------------------------------------- P47 · 这傻逼公司用的最多的手段是服务器算力不够的时候，先封一批账号。（片头冷开场就从这里剪）
  shot(Q1, A('那你要怎么去分辨'), { day: NIGHT, fog: [26, 80],
    keys: [K(Q1, [104, G + 2.6, 65.6], [104, G + 2.0, 61], 52), K(A('那你要怎么去分辨'), [104, G + 2.4, 64.6], [104, G + 2.0, 61], 46)],
    act: t => clawd(104, G + 1, 61.2, { ...feel('smug', t), view: 'front' }),
    ui: (c, t) => banUI(c, t, P('先封一批账号') - .3, A('那你要怎么去分辨'), [0, 1, 2, 3].map(i => [`玩家账号 ${['#0721', '#3388', '#5150', '#9042'][i]}`, P('先封一批账号') + i * .25])) });
  for (let i = 0; i < 4; i++) sfx(P('先封一批账号') + i * .25, 'hit', -10);

  // ---------------------------------------------------------------- P48 · 那你要怎么去分辨 …… 一大批人在同一个时间一起喊，修好了以后又一起恢复。但如果只有你一个人 …… 这段对话本身的问题。
  const FIX = P('修好了以后'), ALONE = P('只有你一个人'), CONV = P('这段对话本身');
  shot(A('那你要怎么去分辨'), A('好了接下来就是今天'), { day: NIGHT, fog: [26, 80], kicks: [[CONV, .8]],
    keys: [K(A('那你要怎么去分辨'), [120, G + 9, 96], [104, G + 2, 66], 62), K(ALONE, [104, G + 3.0, 67], [101, G + 2.0, 59], 56), K(A('好了接下来就是今天'), [103, G + 2.6, 64.6], [100.6, G + 2.0, 59], 48)],
    act: t => { if (t > ALONE - .3) { heige(102.6, G + 1, 61.6, { ...feel('thinking', t), view: 'q', flip: true }); deepseek(...DS, { ...feel('dizzy', t) }); } },
    ui: (c, t) => { const PL = ['玩家A', '玩家B', '玩家C', '玩家D', '玩家E', '玩家F', '玩家G', '玩家H'], C0 = P('一大批人');
      if (t < P('到底是谁的问题') + .6) titleCard(c, t, LS('那你要怎么去分辨'), P('如果是厂商出事') - .1, '怎么分辨', '到底是谁的问题');
      if (t > C0 - .3 && t < FIX) chatLines(c, t, PL.map((n, i) => [C0 + i * .2, [[`<${n}> `, '#C8C0E0'], [['好卡', '怎么变笨了', '降智了', '答非所问', '也一样', '+1'][i % 6], '#FFFFFF']]]), 6);
      if (t > FIX && t < ALONE) { toast(c, t, FIX, ALONE, '服务器公告', '问题已修复 一起恢复', 'star'); chatLines(c, t, [[FIX + .2, [['<玩家A> ', '#C8C0E0'], ['好了好了', '#FFFFFF']]], [FIX + .4, [['<玩家B> ', '#C8C0E0'], ['恢复了', '#FFFFFF']]]]); }
      slam(c, t, CONV - .3, A('好了接下来就是今天'), '大概率是这段对话的问题', '#FFD34E', 100, 300); } });
  for (let i = 0; i < 6; i++) sfx(P('一大批人') + i * .2, 'chat', -16); sfx(FIX, 'toast', -10); sfx(CONV - .3, 'boom', -9);

  // ---------------------------------------------------------------- P49 · 好了，接下来就是今天最重要的干货了，你仔细听好，这个办法我管它叫换班交接。
  const SHIFT = P('换班交接');
  shot(A('好了接下来就是今天'), A('上过班的人都懂'), { day: NIGHT, fog: [30, 90], kicks: [[SHIFT, 1.2]],
    keys: [K(A('好了接下来就是今天'), [104, G + 2.4, 66], [104, G + 2.2, 62], 56), K(SHIFT, [104, G + 6, 74], [104, G + 3, 62], 64), K(A('上过班的人都懂'), [104, G + 7, 78], [104, G + 3, 62], 66)],
    act: t => { heige(104, G + 1, 63, { ...emotions(t, [[0, 'happy'], [SHIFT, 'proud']]), view: 'front', poseR: t > SHIFT ? 'wave' : undefined }); if (t > SHIFT) firework(104, G + 6, 60, t - SHIFT); },
    ui: (c, t) => { titleCard(c, t, A('好了接下来就是今天') + .1, SHIFT - .1, '今天最重要的干货', '你仔细听好'); slam(c, t, SHIFT, A('上过班的人都懂'), '换班交接', '#FFD34E', 220, 420); } });
  sfx(SHIFT, 'firework', -8); sfx(SHIFT + .35, 'firework', -10);

  // ---------------------------------------------------------------- P50 · 上过班的人都懂。老同事要调岗了 …… 他会写一张交接单，告诉新人现在做到哪了，哪些事定了，哪些坑别再踩。那 AI 其实也是一样的。
  const DUMP = P('直接甩给新人'), GIVE = P('他会写一张交接单');
  shot(A('上过班的人都懂'), A('一共就三段提示词'), { day: NIGHT, fog: [26, 80],
    keys: [K(A('上过班的人都懂'), [104, G + 2.8, 70], [104, G + 2.0, 64], 58), K(A('一共就三段提示词'), [104, G + 2.6, 68.6], [104, G + 2.0, 64], 52)],
    act: t => { vill(102.4, G + 1, 64, '村民', t > GIVE ? 'happy' : 'neutral', { tag: '老同事' }); vill(105.6, G + 1, 64, '产品', t > GIVE + .4 ? 'happy' : 'neutral', { tag: '新人' });
      if (t > DUMP - .3 && t < GIVE - .2) for (let i = 0; i < 6; i++) VX.sprite(scrollImg, 103.3 + (i % 3) * .3, G + 1.2 + Math.floor(i / 3) * .3, 64.3, { k: .03 });
      if (t > GIVE - .2) { const u = seg01(t, GIVE, GIVE + .6); VX.sprite(bookImg, lerp(103, 105, u), G + 2.1 + Math.sin(u * Math.PI) * .4, 64.4, { k: .035 }); } },
    ui: (c, t) => { if (t > DUMP && t < GIVE) crossOut(c, t, DUMP + .4, '三个月的聊天记录');
      notice(c, t, P('告诉新人') - .2, A('一共就三段提示词'), '交接单', [['现在做到哪了', P('现在做到哪了')], ['哪些事定了', P('哪些事定了')], ['哪些坑别再踩', P('哪些坑别再踩')]], { x: 1180, y: 150, w: 620, fs: 56, lh: 100 }); } });
  sfx(DUMP, 'scratch', -10); sfx(GIVE, 'pickup', -8); ['现在做到哪了', '哪些事定了', '哪些坑别再踩'].forEach(w => sfx(P(w), 'tick', -11));

  // ---------------------------------------------------------------- P51 · 一共就三段提示词，就算你现在没看屏幕也没关系，完整的文字我都放在简介里了 …… 顺一遍
  shot(A('一共就三段提示词'), A('第一段你直接发在旧的'), { day: NIGHT, fog: [30, 90],
    keys: [K(A('一共就三段提示词'), [101.2, G + 2.4, 67.2], [104, G + 1.9, 64], 56), K(A('第一段你直接发在旧的'), [107.5, G + 2.2, 65.6], [104, G + 1.9, 64], 50)],
    act: t => heige(...HG, { ...feel('proud', t), view: 'q', flip: true }),
    ui: (c, t) => { packUI(c, t, LS('一共就三段提示词') + .2); if (t > P('简介里了')) stamp(c, t, P('简介里了'), '简介里有全文'); } });
  [0, 1, 2].forEach(i => sfx(LS('一共就三段提示词') + .2 + i * .3, 'pickup', -9)); sfx(P('简介里了'), 'thud', -8);

  // ---------------------------------------------------------------- P52–55 · 第一段 …… 6 件事逐条亮起 …… 最后再加两句 …… 最要盯紧的两条（提示词卡 1）
  const P10 = A('第一段你直接发在旧的'), P11 = A('我们在实测的时候DeepSeek自己估');
  shot(P10, P11, { day: NIGHT, fog: [26, 80],
    keys: [K(P10, [104, G + 2.6, 66], [104, G + 2.0, 61], 50), K(P11, [104, G + 2.4, 65], [104, G + 2.0, 61], 46)],
    act: t => heige(104, G + 1, 62.6, { ...feel('proud', t), view: 'front' }),
    ui: (c, t) => guiWin(c, t, P10, P11, '书与笔 · 提示词 1 · 在旧对话里发') });
  slot(P10 + .25, P11 - .25, 'prompt1'); sfx(P10, 'page', -8);
  ['第一现在', '第二最新', '第三哪些事', '第四还有', '第五哪些路', '第六下一步'].forEach(w => sfx(P(w), 'tick', -12)); sfx(P('最要盯紧'), 'ding', -10);

  // ---------------------------------------------------------------- P56 · 我们在实测的时候，DeepSeek 自己估了一下 …… 4 个工作人员 …… 写进了推测那一栏 …… 这就对了。（交接单原文）
  const HR0 = P11, HR1 = A('推测就该待在推测栏里');
  shot(HR0, HR1, { day: NIGHT, fog: [26, 80], noWhoosh: true,
    keys: [K(HR0, [104, G + 2.4, 65], [104, G + 2.0, 61], 46), K(HR1, [104, G + 2.3, 64.4], [104, G + 2.0, 61], 42)],
    act: t => heige(104, G + 1, 62.6, { ...feel('happy', t), view: 'front' }),
    ui: (c, t) => guiWin(c, t, HR0, HR1, '交接单.md · DeepSeek V4.1 写的（真实调用记录）') });
  slot(HR0 + .25, HR1 - .25, 'handoverReal'); sfx(P('它很老实'), 'ding', -9);

  // ---------------------------------------------------------------- P57 · 推测就该待在推测栏里 …… 粉色大象效应 …… 他脑子里就越全是那头大象。（真的走出来一只粉色大象）
  const ELE = P('粉色大象效应'), MORE = P('提得越多'), ELEND = A('在你把这份交接单');
  shot(HR1, ELEND, { day: NIGHT, fog: [26, 80],
    keys: [K(HR1, [108, G + 2.6, 69], [104, G + 1.6, 62], 58), K(ELE, [106.5, G + 2.4, 67.5], [103, G + 1.6, 62], 56), K(ELEND, [105, G + 2.6, 68], [101.5, G + 2.0, 62], 54)],
    act: t => { const ex = lerp(96, 102, seg01(t, ELE - .6, ELEND - .5)); if (t > ELE - .6) { VX.sprite(eleImg(t * 5), ex, G + 1, 62, { k: .035 }); VX.shadow(ex, G + 1, 62, .8);
        const grow = 1 + 2 * seg01(t, MORE, P('越全是那头大象')); label(ex, G + 2.4 + .3 * grow, 62, '推测', .25 * grow, '#FFD34E', t, MORE); }
      heige(105.4, G + 1, 63.4, { ...emotions(t, [[0, 'neutral'], [ELE, 'surprised'], [P('别去想粉色的大象'), 'dizzy']]), view: 'q' }); },
    ui: (c, t) => { if (t > ELE) tagUI(c, '粉色大象效应', 1); if (t < ELE) chatLines(c, t, [[HR1 + .3, [['[交接单] ', '#FFD34E'], ['推测 → 推测栏', '#FFFFFF']]]]);
      if (t > P('别去想粉色的大象')) floatTxt(c, t, P('别去想粉色的大象'), '别想粉色大象', 960, 380); } });
  sfx(ELE - .5, 'step', -12); sfx(ELE, 'pop', -8); sfx(MORE, 'powerup', -10);

  // ---------------------------------------------------------------- P58 · 在你把这份交接单贴进新窗口之前 …… 数字、日期，还有那些带不要、不能这种字眼的要求 …… 预算如果上面还写着 2 万 ……
  shot(ELEND, A('第二段是在新窗口里'), { day: NIGHT, fog: [26, 80],
    keys: [K(ELEND, [104, G + 2.6, 66], [104, G + 2.0, 61], 50), K(A('第二段是在新窗口里'), [104, G + 2.5, 65.2], [104, G + 2.0, 61], 46)],
    act: t => heige(104, G + 1, 62.6, { ...feel('thinking', t), view: 'front' }),
    ui: (c, t) => notice(c, t, ELEND + .2, A('第二段是在新窗口里'), '贴进新窗口之前 扫一眼', [['☑ 数字', P('里面的数字')], ['☑ 日期', P('日期还有那些')], ['☑ 带不要、不能的要求', P('不要不能')], ['预算 2 万', P('还写着2万'), '#B23A3A', P('旧的数字')], ['→ 应为 1 万 5', P('旧的数字') + .3, '#0E7490']], { x: 1060, y: 120, w: 760, fs: 56, lh: 96 }) });
  ['里面的数字', '日期还有那些', '不要不能'].forEach(w => sfx(P(w), 'tick', -10)); sfx(P('旧的数字'), 'scratch', -9);

  // ---------------------------------------------------------------- P59–60 · 第二段 …… 贴进去 …… 死命令：先复述，等我确认（提示词卡 2）
  const P20 = A('第二段是在新窗口里'), P21 = A('为什么要它先复述呢');
  shot(P20, P21, { day: NIGHT, fog: [26, 80],
    keys: [K(P20, [104, G + 2.6, 66], [104, G + 2.0, 61], 50), K(P21, [104, G + 2.4, 65], [104, G + 2.0, 61], 46)],
    act: t => heige(104, G + 1, 62.6, { ...feel('proud', t), view: 'front' }),
    ui: (c, t) => guiWin(c, t, P20, P21, '书与笔 · 提示词 2 · 在新窗口里发') });
  slot(P20 + .25, P21 - .25, 'prompt2'); sfx(P20, 'page', -8); sfx(P('死命令'), 'thud', -9); sfx(P('复述完等我确认'), 'ding', -10);

  // ---------------------------------------------------------------- P61 · 为什么要它先复述呢？…… 当场纠正，就改一两句话的事。等它把整个方案做完你再推翻，那就白干了。
  const CHEAP = P('就改一两句话'), WASTE = P('那就白干了');
  shot(P21, A('第三段是专门用来纠错'), { day: NIGHT, fog: [26, 80],
    keys: [K(P21, [102.6, G + 2.6, 64], [100.6, G + 2.0, 59], 54), K(A('第三段是专门用来纠错'), [102.0, G + 2.4, 62.6], [100.6, G + 2.0, 59], 46)],
    act: t => { heige(102.8, G + 1, 61.2, { ...emotions(t, [[0, 'thinking'], [CHEAP, 'happy'], [WASTE, 'ko']]), view: 'q', flip: true }); deepseek(...DS, { ...feel(t > WASTE ? 'dizzy' : 'neutral', t) });
      if (t > WASTE) for (let i = 0; i < 4; i++) burst(t, WASTE + i * .08, 100.2 + (i - 1.5) * .5, G + 1.6, 59.2, [242, 230, 200], 8); },
    ui: (c, t) => { titleCard(c, t, P21 + .1, P('因为它要是理解错了') - .1, '为什么先复述', '');
      scoreBars(c, t, P('因为它要是理解错了') - .2, A('第三段是专门用来纠错'), '改错的代价', [['复述时纠正', 1, 10, '#3EC3EE', CHEAP, '改一两句话'], ['做完再推翻', 10, 10, '#F0524D', WASTE, '全部白干']]); } });
  sfx(CHEAP, 'ding', -10); sfx(WASTE, 'break', -8);

  // ---------------------------------------------------------------- P62 · 第三段是专门用来纠错的 ……（提示词卡 3）
  const P30 = A('第三段是专门用来纠错'), P31 = A('光骂AI');
  shot(P30, P31, { day: NIGHT, fog: [26, 80],
    keys: [K(P30, [104, G + 2.6, 66], [104, G + 2.0, 61], 50), K(P31, [104, G + 2.4, 65], [104, G + 2.0, 61], 46)],
    act: t => heige(104, G + 1, 62.6, { ...feel('proud', t), view: 'front' }),
    ui: (c, t) => guiWin(c, t, P30, P31, '书与笔 · 提示词 3 · 纠错时发') });
  slot(P30 + .25, P31 - .25, 'prompt3'); sfx(P30, 'page', -8); sfx(P('证据在这儿摆着'), 'thud', -9);

  // ---------------------------------------------------------------- P63 · 光骂 AI 你这个傻逼在搞毛，这样的话其实没卵用，你得骂到点子上才行。
  const POINT = P('骂到点子上');
  shot(P31, A('那如果你带着交接单'), { day: NIGHT, fog: [26, 80], kicks: [[P('没卵用'), .7]],
    keys: [K(P31, [106, G + 2.6, 64.6], [107.8, G + 2.0, 58.6], 54), K(A('那如果你带着交接单'), [105.6, G + 2.4, 63.4], [107.8, G + 2.0, 58.6], 46)],
    act: t => { heige(106.2, G + 1, 61.6, { ...emotions(t, [[0, 'furious'], [POINT - .3, 'determined']]), view: 'q' }); codex(...CX, t > POINT + .3 ? 'happy' : 'ask', t);
      if (t > POINT) { const u = seg01(t, POINT, POINT + .4); if (u < 1) VX.sprite(bookImg, lerp(106.4, 107.6, u), G + 1.6 + Math.sin(u * Math.PI) * .6, lerp(61.4, 58.9, u), { k: .03 }); } },
    ui: (c, t) => { chatLines(c, t, [[P('你这个傻逼'), [['<黑哥> ', '#9DB4FF'], ['你这个傻X在搞毛', '#FFFFFF']]]]); if (t > P('没卵用')) crossOut(c, t, P('没卵用') + .3, '只骂没用'); slam(c, t, POINT, A('那如果你带着交接单'), '骂到点子上', '#FFD34E', 140, 560); } });
  sfx(P('你这个傻逼'), 'chat', -9); sfx(POINT, 'hit', -8);

  // ---------------------------------------------------------------- P64 · 那如果你带着交接单，它还是傻呢？那你就去设置里看一下记忆和自定义指令 …… 带着这些旧规矩，一样会别扭。
  function settingsUI13(c, t, t0, t1) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .25);
    c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(8,6,14,.75)'; c.fillRect(0, 0, 1920, 1080); outlined(c, '设置', 960, 170, 64, '#FFFFFF', { lw: 10 });
    [['记忆……', P('记忆和自定义指令')], ['自定义指令……', P('自定义指令')], ['项目规则……', P('自定义指令') + .3]].forEach(([txt, at], i) => { const y = 260 + i * 130, k = seg01(t, at - .2, at); c.globalAlpha = a * (.4 + .6 * k); c.fillStyle = '#6E6E6E'; c.fillRect(560, y, 800, 100); c.fillStyle = '#A0A0A0'; c.fillRect(560, y, 800, 6); outlined(c, txt, 960, y + 52, 46, '#FFFFFF', { lw: 7, shadow: false }); });
    if (t > P('过时的规矩')) { const k = seg01(t, P('过时的规矩'), P('过时的规矩') + .25); c.globalAlpha = a * k; c.fillStyle = 'rgba(200,50,60,.85)'; c.fillRect(560, 660, 800, 110); outlined(c, '过时的规矩：每个新窗口都会带上它', 960, 715, 40, '#FFFFFF', { lw: 6, shadow: false }); }
    c.restore();
  }
  shot(A('那如果你带着交接单'), A('最后再回到开头'), { day: NIGHT, fog: [26, 80],
    keys: [K(A('那如果你带着交接单'), [104, G + 2.6, 66], [104, G + 2.0, 61], 50), K(A('最后再回到开头'), [104, G + 2.4, 65], [104, G + 2.0, 61], 46)],
    act: t => heige(104, G + 1, 62.6, { ...emotions(t, [[0, 'confused'], [P('去设置里'), 'thinking']]), view: 'front' }),
    ui: (c, t) => { if (t < P('去设置里') - .2) tagUI(c, '带着交接单 还是傻？', 1); settingsUI13(c, t, P('去设置里') - .2, A('最后再回到开头')); } });
  sfx(P('去设置里'), 'click', -8); sfx(P('过时的规矩'), 'alarm', -12);

  // ---------------------------------------------------------------- P65 · 最后再回到开头，群里那位朋友骂的那句，我的 Codex 越用越傻了。（群聊截图，框出那句）
  const GB0 = A('最后再回到开头'), GB1 = A('我发了400多条消息也没');
  shot(GB0, GB1, { day: NIGHT, fog: [26, 80],
    keys: [K(GB0, [104, G + 2.6, 67], [104, G + 2.2, 60], 54), K(GB1, [104, G + 2.4, 66], [104, G + 2.2, 60], 50)],
    act: t => heige(104, G + 1, 64, { ...feel('neutral', t), view: 'back' }),
    ui: (c, t) => guiWin(c, t, GB0, GB1, '微信 · AI 交流群') });
  slot(GB0 + .25, GB1 - .25, 'groupchat2'); sfx(GB0, 'page', -8);

  // ---------------------------------------------------------------- P66 · 我发了 400 多条消息，也没把它聊傻。真正测出毛病来的，其实就是你空着手去开新窗口。
  const BIG = P('空着手去开新窗口');
  shot(GB1, A('好记性不如烂笔头'), { day: NIGHT, fog: [30, 100], kicks: [[BIG, 1.0]],
    keys: [K(GB1, [131.5, G + 6, 74], [131.5, G + 5.5, 48], 62), K(P('真正测出毛病'), [120, G + 9, 92], [118, G + 3, 66], 66), K(A('好记性不如烂笔头'), [110, G + 8, 96], [104, G + 3, 66], 64)],
    act: t => heige(104, G + 1, 74, { ...feel('proud', t), view: 'back' }),
    ui: (c, t) => { c.save(); panel(c, 1480, 40, 400, 96); outlined(c, '已发送 408 条', 1680, 90, 46, '#FFD34E', { lw: 8, shadow: false }); c.restore();
      if (t > P('也没把它聊傻') - .2 && t < P('真正测出毛病')) slam(c, t, P('也没把它聊傻'), P('真正测出毛病'), '没聊傻', '#3EC3EE', 170, 420);
      slam(c, t, BIG, A('好记性不如烂笔头'), '空着手开新窗口 才是毛病', '#FF6A5A', 100, 420); } });
  sfx(BIG, 'boom', -8);

  // ---------------------------------------------------------------- P67 · 好记性不如烂笔头，对人是这样，对 AI 其实也是一样的。
  const PEN = P('烂笔头'), PAI = P('对AI其实');
  shot(A('好记性不如烂笔头'), A('那你有没有遇到过'), { day: NIGHT, fog: [26, 80],
    keys: [K(A('好记性不如烂笔头'), [103.4, G + 2.6, 64.6], [101, G + 2.0, 59.4], 56), K(A('那你有没有遇到过'), [102.8, G + 2.4, 63.2], [101, G + 2.0, 59.4], 48)],
    act: t => { heige(102.8, G + 1, 61.4, { ...feel('happy', t), view: 'q', flip: true }); deepseek(...DS, { ...emotions(t, [[0, 'neutral'], [PAI, 'happy']]) });
      const u = seg01(t, PAI - .2, PAI + .4); VX.sprite(bookImg, lerp(102.4, 100.8, u), G + 1.9 + Math.sin(u * Math.PI) * .4, lerp(61.2, 59.2, u), { k: .035 }); },
    ui: (c, t) => slam(c, t, PEN - .5, A('那你有没有遇到过'), '好记性不如烂笔头', '#FFD34E', 130, 300) });
  sfx(PEN, 'page', -8); sfx(PAI, 'pickup', -9);

  // ---------------------------------------------------------------- P68 · 那你有没有遇到过 AI 一本正经地糊弄你？最离谱的一次是什么情况，可以在评论区说说。
  shot(A('那你有没有遇到过'), A('如果你也想把AI这些毛病'), { day: NIGHT, fog: [26, 80],
    keys: [K(A('那你有没有遇到过'), [104, G + 3.4, 69], [104, G + 2.0, 60], 60), K(A('如果你也想把AI这些毛病'), [104, G + 3.0, 67.6], [104, G + 2.0, 60], 56)],
    act: t => { deepseek(...DS, { ...feel('proud', t) }); codex(...CX, 'happy', t); VX.sprite(scrollImg, DS[0] + .9, G + 1.5, DS[2] + .4, { k: .035 }); },
    ui: (c, t) => { questionCard(c, t, LS('那你有没有遇到过') - .2, A('如果你也想把AI这些毛病'), '评论区说说', 'AI 一本正经糊弄你 最离谱的一次是什么');
      chatLines(c, t, [[P('评论区说说'), [['> ', '#FFD34E'], ['在这里输入……', '#C8C0E0']]]]); } });
  sfx(LS('那你有没有遇到过') - .2, 'toast', -10);

  // ---------------------------------------------------------------- P69–70 · 关注问问黑哥 …… 下一期 …… 点个赞，顺便转发给那个天天说 AI 越用越傻的朋友。
  const NEXT = P('下一期我们接着聊'), LIKE = P('点个赞');
  shot(A('如果你也想把AI这些毛病'), A('我是黑哥'), { day: NIGHT, fog: [30, 100],
    keys: [K(A('如果你也想把AI这些毛病'), [104, G + 2.8, 69], [104, G + 2.2, 62], 58), K(NEXT, [104, G + 3.4, 73], [104, G + 2.4, 62], 60), K(A('我是黑哥'), [104, G + 3.8, 76], [104, G + 2.6, 62], 62)],
    act: t => { heige(104, G + 1, 64, { ...feel('happy', t), view: 'front', poseR: t > LIKE ? 'wave' : undefined }); deepseek(101.2, G + 1, 62.6, { ...feel('happy', t) }); codex(106.8, G + 1, 62.6, 'happy', t); },
    ui: (c, t) => { if (t < NEXT - .2) { const a = fadeIO(t, LS('如果你也想把AI这些毛病') - .2, NEXT - .2, .3); c.save(); c.globalAlpha = a; panel(c, 560, 140, 800, 220); outlined(c, '关注 问问黑哥', 960, 210, 72, '#FFD34E', { lw: 11 }); outlined(c, '把 AI 的毛病一点一点摸透', 960, 300, 44, '#FFFFFF', { lw: 7 }); c.restore(); }
      titleCard(c, t, NEXT - .2, LS('喜欢的话点个赞') - .3, '下期预告', '写作时怎么让 AI 模仿得更好');
      likeUI(c, t, LIKE); if (t > P('转发给那个')) chatLines(c, t, [[P('转发给那个'), [['[分享] ', '#FFD34E'], ['转发给天天说 AI 越用越傻的朋友', '#FFFFFF']]]]); } });
  sfx(P('关注一下问问黑哥'), 'levelup', -9); sfx(NEXT, 'toast', -10); sfx(LIKE, 'pop', -8); sfx(P('转发给那个'), 'chat', -10);

  // ---------------------------------------------------------------- P71 · 我是黑哥，不吹AI也不恐惧AI，只说真话。（三个一起挥手，入夜，收黑）
  const END = DD.len;
  shot(A('我是黑哥'), END + 1, { day: t => lerp(NIGHT(t), .05, seg01(t, LS('我是黑哥'), END)), fog: [30, 100],
    keys: [K(A('我是黑哥'), [104, G + 3.4, 74], [104, G + 2.4, 64], 60), K(END, [104, G + 8, 92], [104, G + 3.4, 64], 64)],
    act: t => { heige(104, G + 1, 66, { ...feel('happy', t), view: 'front', poseR: 'wave' }); deepseek(101.2, G + 1, 64.6, { ...feel('happy', t), dy: Math.round(Math.sin(t * 6)) * 2 }); codex(106.8, G + 1, 64.6, 'happy', t);
      firework(104, G + 9, 58, (t - LS('我是黑哥')) % 1.6); },
    ui: (c, t) => { const k = seg01(t, END - .6, END); if (k > 0) { c.fillStyle = `rgba(4,3,10,${k})`; c.fillRect(0, 0, 1920, 1080); } } });
  sfx(LS('我是黑哥'), 'firework', -12);


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
  const D = window.DUMB13_DATA || { cues: [], keys: [] };
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
  const AMBER = [1, .72, .42], CYAN = [.35, .75, 1];
  const LAMPS = [];
  function lights(t, cam) {
    for (const L of LAMPS) { if (Math.abs(L[0] - cam.x) + Math.abs(L[1] - cam.y) + Math.abs(L[2] - cam.z) > 40) continue; VX.light(L[0] + .5, L[1] + .5, L[2] + .5, L[3], L[4], L[5]); }
    VX.light(104, G + 5, 47, CYAN, 12, 1.0);                       // the wall of screens
    for (const [x, z] of [[99, 56], [109, 56]]) VX.light(x + .5, G + 2.5, z + 1.2, CYAN, 4.5, .8);
    if (VX.at(104, G + 2, 58) === B.monitor) VX.light(104.5, G + 2.5, 59.2, CYAN, 4, .8);
  }
  function burst(t, t0, x, y, z, col, n = 18) { const a = t - t0; if (a < 0 || a > .9) return; for (let i = 0; i < n; i++) {
    const vx = (hh(i, t0) - .5) * 4, vz = (hh(i, t0 + 1) - .5) * 4, vy = 2 + hh(i, t0 + 2) * 3;
    VX.pt(x + vx * a, y + vy * a - 9 * a * a, z + vz * a, .09 + .05 * hh(i), col.map(c => c * (.75 + .3 * hh(i, 9)))); } }
  function dust(t, cam) { for (let i = 0; i < 120; i++) {   // warm dust in the low sun
    const x = cam.x - 8 + ((hh(i, 1) * 16 + t * .25) % 16 + 16) % 16, z = cam.z - 8 + ((hh(i, 2) * 16 + .3 * Math.sin(t * .4 + i)) % 16 + 16) % 16, y = cam.y - 3 + ((hh(i, 3) * 6 + .2 * Math.sin(t + i)) % 6 + 6) % 6;
    if (VX.at(Math.floor(x), Math.floor(y), Math.floor(z))) continue; VX.pt(x, y, z, .035, [255, 214, 160], true); } }
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
  function post(c, t) {
    if (!BR) { BR = document.createElement('canvas'); BR.width = PW; BR.height = PH; }
    const bx = BR.getContext('2d'), id = bx.createImageData(PW, PH);
    for (let i = 0; i < PW * PH * 4; i += 4) { const l = BUF[i] * .3 + BUF[i + 1] * .55 + BUF[i + 2] * .15, k = clamp01((l - 150) / 90); id.data[i] = BUF[i] * k; id.data[i + 1] = BUF[i + 1] * k; id.data[i + 2] = BUF[i + 2] * k; id.data[i + 3] = 255; }
    bx.putImageData(id, 0, 0);
    c.save(); c.globalCompositeOperation = 'lighter'; c.imageSmoothingEnabled = true; c.filter = 'blur(22px)'; c.globalAlpha = .6; c.drawImage(BR, 0, 0, 1920, 1080); c.filter = 'blur(6px)'; c.globalAlpha = .3; c.drawImage(BR, 0, 0, 1920, 1080); c.restore();
    const g = c.createRadialGradient(960, 540, 420, 960, 540, 1150); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(10,6,14,.5)'); c.fillStyle = g; c.fillRect(0, 0, 1920, 1080);
    for (const [t0, col, a] of FLASH) { const k = t >= t0 ? Math.exp(-(t - t0) * 9) * a : 0; if (k > .01) { c.fillStyle = `rgba(${col},${k})`; c.fillRect(0, 0, 1920, 1080); } }
  }
  const FLASH = [[NO, '255,240,200', .3], [BREAK, '255,255,255', .25]];
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
    TAGS.length = 0; BUBS.length = 0; LBLS.length = 0;
    const cam = camera(t), s = shotAt(t);
    VX.setDay(val(s.day ?? DUSK, t));
    VX.setMoonDir([-.7, .35, .55]);
    VX.frame(t, cam);
    if (s.pre) s.pre(t);
    lights(t, cam);
    s.act && s.act(t);
    dust(t, cam);
    const f = val(s.fog, t) || [26, 80]; VX.setFog(f[0], f[1]);
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
  LOOPS.pxDumb13 = LOOP;
})();
