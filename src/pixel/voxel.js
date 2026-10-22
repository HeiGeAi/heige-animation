// pixel/voxel.js: a small CPU voxel ray caster for the pixel back end, for scenes that should feel like walking around
// a block world (a Minecraft-like sandbox) instead of a stage. The world is a grid of 16×16-textured blocks; each frame
// is cast per buffer pixel (DDA), lit by a night ambient, the moon and point lights, with soft edge occlusion and fog.
// The pixel characters (heigePx, clawdPx) are captured into small images and drawn as billboards with a depth test,
// so they stand in the world and get hidden behind walls. Everything is a pure function of t, like the rest of the kit.
//   VX.fill(...) / VX.set(...)       build the world once
//   VX.edit(t, x, y, z, id)          a block that changes at time t (breaks, builds)
//   VX.frame(t, cam)                 cam = { x, y, z, yaw, pitch, fov, roll }; then VX.sprite(...), VX.pt(...), VX.draw()
//   VX.project(x, y, z)              world point to output pixels (for labels in an overlay)
const VX = (() => {
  const SX = 208, SY = 40, SZ = 136, N = SX * SY * SZ;
  const base = new Uint8Array(N), W = new Uint8Array(N);
  const I = (x, y, z) => (y * SZ + z) * SX + x;
  const inb = (x, y, z) => x >= 0 && y >= 0 && z >= 0 && x < SX && y < SY && z < SZ;
  const set = (x, y, z, id) => { if (inb(x, y, z)) base[I(x, y, z)] = id; };
  const get = (x, y, z) => inb(x, y, z) ? base[I(x, y, z)] : 0;
  const at = (x, y, z) => inb(x, y, z) ? W[I(x, y, z)] : 0;
  function fill(x0, y0, z0, x1, y1, z1, id) {
    for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) for (let z = Math.min(z0, z1); z <= Math.max(z0, z1); z++)
      for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) set(x, y, z, id);
  }
  let EDITS = [], sorted = true;
  const edit = (t, x, y, z, id) => { EDITS.push([t, x, y, z, id]); sorted = false; };
  function prepare(t) {
    if (!sorted) { EDITS.sort((a, b) => a[0] - b[0]); sorted = true; }
    W.set(base);
    for (const e of EDITS) { if (e[0] > t) break; if (inb(e[1], e[2], e[3])) W[I(e[1], e[2], e[3])] = e[4]; }
  }

  // ---------- blocks and textures ----------
  const h3 = (x, y, s) => { const v = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return v - Math.floor(v); };
  const hex = c => [parseInt(c.slice(1, 3), 16) / 255, parseInt(c.slice(3, 5), 16) / 255, parseInt(c.slice(5, 7), 16) / 255];
  // a 16×16 texture from fn(u, v) → '#rrggbb' (u right, v down)
  function tex(fn) { const a = new Float32Array(768); for (let v = 0; v < 16; v++) for (let u = 0; u < 16; u++) { const c = hex(fn(u, v)); a.set(c, (v * 16 + u) * 3); } return a; }
  const pick = (r, cs) => cs[Math.min(cs.length - 1, Math.floor(r * cs.length))];
  const B = {}, BL = [null];          // B.name = id; BL[id] = { top, side, bot, emit, frames }
  function block(name, o) { const id = BL.length; B[name] = id; BL.push({ top: o.top || o.side, side: o.side, bot: o.bot || o.side, emit: o.emit || 0, frames: o.frames || null, glow: o.glow || 0 }); return id; }

  const speck = (cs, s) => (u, v) => pick(h3(u, v, s), cs);
  const STONE = ['#6B6D7C', '#626473', '#727585', '#5C5E6C', '#7A7D8C'];
  const DEEP = ['#4A4559', '#433E52', '#514C61', '#3C384B', '#57526A'];
  const DIRT = ['#6A4A36', '#5E412F', '#75533D', '#56392A'];
  const SNOW = ['#E9EFF9', '#E2E9F5', '#F1F5FC', '#D6E0EF'];
  const stoneT = tex((u, v) => { const r = h3(u >> 1, v >> 1, 3); return r < .12 ? '#55576A' : pick(h3(u, v, 1), STONE); });
  const deepT = tex((u, v) => { const r = h3(u >> 1, v >> 1, 9); return r < .14 ? '#36324A' : pick(h3(u, v, 4), DEEP); });
  const dirtT = tex(speck(DIRT, 5));
  const snowTop = tex((u, v) => h3(u, v, 7) < .06 ? '#C9D5E8' : pick(h3(u, v, 8), SNOW));
  const snowSide = tex((u, v) => { const drip = 3 + (h3(u, 0, 11) < .35 ? 1 : 0) + (h3(u, 0, 12) < .12 ? 1 : 0); return v < drip ? pick(h3(u, v, 8), SNOW) : v === drip ? '#B9C6DB' : pick(h3(u, v, 5), DIRT); });
  const plankT = tex((u, v) => { const row = v >> 2, seam = (u + row * 5) % 16 === 0; if (v % 4 === 3 || seam) return '#6B4428'; return pick(h3(u + row * 7, row, 13), ['#A8743F', '#9E6A38', '#B07B45', '#97653A']); });
  const plankCrack = tex((u, v) => { const k = Math.abs(u - 8 + Math.round(4 * Math.sin(v * .9))) < 1 || Math.abs(v - 9 + Math.round(3 * Math.sin(u * 1.3))) < 1; if (k) return '#2A1A12'; const row = v >> 2; if (v % 4 === 3) return '#6B4428'; return pick(h3(u + row * 7, row, 13), ['#A8743F', '#9E6A38', '#B07B45']); });
  const logSide = tex((u, v) => pick(h3(u, v >> 2, 14), ['#5E3E28', '#4E3220', '#6B472E', '#553824']));
  const logTop = tex((u, v) => { const d = Math.max(Math.abs(u - 7.5), Math.abs(v - 7.5)); return d > 6.5 ? '#5E3E28' : Math.floor(d) % 2 ? '#A8794A' : '#8E6238'; });
  const leavesT = tex((u, v) => { const r = h3(u, v, 15); return r < .16 ? '#1B2240' : r < .42 ? '#36446E' : r < .5 ? '#4D5C8C' : pick(h3(u, v, 16), SNOW); });
  const pathT = tex((u, v) => h3(u, v, 17) < .1 ? '#A9B5C9' : pick(h3(u, v, 18), ['#C6D0E1', '#BCC7DA', '#CDD6E6']));
  const cobT = tex((u, v) => { const cx = Math.floor((u + (v >> 2) * 3) / 4), e = (u + (v >> 2) * 3) % 4 === 0 || v % 4 === 0; return e ? '#3E4050' : pick(h3(cx, v >> 2, 19), ['#878A99', '#7A7D8C', '#93969F', '#6E7180']); });
  const lampT = tex((u, v) => { const e = u === 0 || v === 0 || u === 15 || v === 15 || u === 7 || v === 7; return e ? '#8A5428' : pick(h3(u, v, 20), ['#FFE6A6', '#FFD27A', '#F7C060', '#FFF1C8']); });
  const bookSide = tex((u, v) => { if (v < 2 || v > 13 || v === 7 || v === 8) return v === 7 || v === 8 ? '#6B4428' : '#A8743F'; const b = Math.floor(u / 2); const c = pick(h3(b, v < 7 ? 1 : 2, 21), ['#B23A3A', '#3E5AA8', '#D8A13A', '#7A4AA8', '#E8DCC4', '#C86A3A', '#8E3050']); return u % 2 === 1 && h3(b, v, 22) < .3 ? '#2A1A22' : c; });
  const darkBox = tex((u, v) => u === 0 || v === 0 || u === 15 || v === 15 ? '#14121F' : '#23203A');
  const bedrock = tex(speck(['#2A2638', '#221F30', '#332E44'], 23));
  const railTop = tex((u, v) => { if (v === 4 || v === 11) return '#B4B6C4'; if (v === 5 || v === 12) return '#6E7080'; if (u % 4 === 1 && v > 2 && v < 14) return '#6B4428'; return pick(h3(u, v, 24), STONE); });
  const signT = tex((u, v) => u === 0 || v === 0 || u === 15 || v === 15 ? '#4A2E1C' : pick(h3(u, v >> 2, 25), ['#C8925A', '#BC8650', '#D29C64']));
  const amethyst = tex((u, v) => { const d = Math.abs(u - 7.5) + Math.abs(v - 7.5); return d < 3 ? '#F2DCFF' : d < 6 ? '#B48CF0' : d < 8 ? '#7E5AC8' : pick(h3(u, v, 4), DEEP); });
  const goldOre = tex((u, v) => h3(u >> 1, v >> 1, 26) < .1 ? '#F2C14E' : h3(u >> 1, v >> 1, 26) < .13 ? '#B8862E' : pick(h3(u, v, 4), DEEP));
  // animated: lava, the monitor screen (code scrolling, or a red alert), code blocks
  const lavaF = Array.from({ length: 8 }, (_, f) => tex((u, v) => { const w = Math.sin((u + f * .9) * .7 + Math.sin((v + f * 2) * .5) * 1.6) + Math.cos((v - f * 1.3) * .6 + u * .3); return w > 1.1 ? '#FFE48A' : w > .5 ? '#FFB43C' : w > -.4 ? '#F2781E' : '#C84A16'; }));
  const codeLine = (u, v, f, bg) => { const row = (v + f) % 16, len = 3 + Math.floor(h3(row, 0, 27 + Math.floor((v + f) / 16)) * 10), ind = Math.floor(h3(row, 1, 28) * 3); if (row % 2 === 1 || u < 2 + ind || u > 2 + ind + len) return bg; return pick(h3(Math.floor(u / 3), row, 29), ['#3EC3EE', '#F2E6C8', '#F2E6C8', '#9FE6FF', '#E8DCC4']); };
  const screenF = Array.from({ length: 8 }, (_, f) => tex((u, v) => u === 0 || v === 0 || u === 15 || v === 15 ? '#14121F' : codeLine(u, v, f, '#0E1428')));
  const alertT = tex((u, v) => { if (u === 0 || v === 0 || u === 15 || v === 15) return '#14121F'; const bang = (u === 7 || u === 8) && ((v >= 3 && v <= 9) || v === 11 || v === 12); return bang ? '#FFF6E8' : '#C8323C'; });
  const codeF = Array.from({ length: 8 }, (_, f) => tex((u, v) => u === 0 || v === 0 || u === 15 || v === 15 ? '#3EC3EE' : codeLine(u, v, f, '#141228')));

  block('stone', { side: stoneT }); block('deep', { side: deepT }); block('dirt', { side: dirtT });
  block('snow', { top: snowTop, side: snowSide, bot: dirtT }); block('snowblk', { side: snowTop });
  block('plank', { side: plankT }); block('crack', { side: plankCrack }); block('log', { top: logTop, side: logSide });
  block('leaves', { side: leavesT }); block('path', { top: pathT, side: snowSide, bot: dirtT }); block('cobble', { side: cobT });
  block('lamp', { side: lampT, emit: 1.0 }); block('books', { top: plankT, side: bookSide }); block('box', { side: darkBox });
  block('monitor', { top: darkBox, side: screenF[0], frames: screenF, emit: 1.05 }); block('bedrock', { side: bedrock });
  block('lava', { side: lavaF[0], frames: lavaF, emit: 1.2 }); block('rail', { top: railTop, side: stoneT });
  block('sign', { side: signT }); block('amethyst', { side: amethyst, emit: .8 }); block('gold', { side: goldOre });
  block('code', { top: darkBox, side: codeF[0], frames: codeF, emit: .9 });
  block('roof', { top: snowTop, side: plankT, bot: plankT });
  const portalF = Array.from({ length: 8 }, (_, f) => tex((u, v) => { const w = Math.sin(u * .9 + f * .8 + Math.sin(v * .6 - f) * 2) + Math.cos(v * .7 - f * .5); return w > 1.1 ? '#F0D8FF' : w > .3 ? '#B070F0' : w > -.6 ? '#7A3CC8' : '#4A1E8C'; }));
  block('portal', { side: portalF[0], frames: portalF, emit: 1.1 });
  block('tnt', { top: tex((u, v) => (u + v) % 5 === 0 ? '#3A3A3A' : '#C8323C'), side: tex((u, v) => v >= 5 && v <= 10 ? ((u > 2 && u < 13 && (v === 7 || v === 8) && u % 3 !== 0) ? '#1E1E1E' : '#EDE6DA') : (u % 4 === 0 ? '#9A2028' : '#D83A44')) });
  block('goldblk', { side: tex((u, v) => u === 0 || v === 0 ? '#FFF2B8' : u === 15 || v === 15 ? '#B8862E' : h3(u, v, 33) < .15 ? '#FFE27A' : '#F2C14E'), emit: .95 });
  block('chest', { top: tex((u, v) => u === 0 || v === 0 || u === 15 || v === 15 ? '#4A2E1C' : '#A8743F'), side: tex((u, v) => { if (u === 0 || v === 0 || u === 15 || v === 15 || v === 5) return '#4A2E1C'; if (u >= 7 && u <= 8 && v >= 4 && v <= 7) return '#D8D8E0'; return v < 5 ? '#B07B45' : '#9E6A38'; }) });
  block('obsidian', { side: tex((u, v) => h3(u, v, 34) < .1 ? '#5A3C8C' : pick(h3(u, v, 35), ['#1A1428', '#221A34', '#140F20'])) });
  block('redlamp', { side: tex((u, v) => u === 0 || v === 0 || u === 15 || v === 15 ? '#5A1418' : pick(h3(u, v, 36), ['#FF5A4A', '#E83A34', '#FF8A70'])), emit: 1.15 });
  block('offlamp', { side: tex((u, v) => u === 0 || v === 0 || u === 15 || v === 15 || u === 7 || v === 7 ? '#3A2414' : '#5A4030') });
  block('brick', { side: tex((u, v) => { const row = v >> 2, off = row % 2 ? 4 : 0; if (v % 4 === 3 || (u + off) % 8 === 0) return '#3E4050'; return pick(h3((u + off) >> 3, row, 37), ['#8A8C99', '#7E8190', '#94969F']); }) });
  for (const [n, a, b2] of [['wred', '#B23A3A', '#9A2E30'], ['wblue', '#3E5AA8', '#334C90'], ['wpurple', '#7A4AA8', '#683E92'], ['worange', '#D8783A', '#C26830'], ['wcream', '#EDE3CC', '#DDD2B8']]) block(n, { side: tex((u, v) => h3(u, v, 38) < .3 ? b2 : a) });
  block('iron', { side: tex((u, v) => u % 4 === 1 || v === 0 || v === 15 ? '#A9AAB8' : '#1A1826') });
  // V053 dusk lab: mesa sand, terracotta bands, lab glass (cyan only next to dark frames)
  block('sand', { side: tex(speck(['#E2C08A', '#D8B47C', '#E8C894', '#CFA970'], 40)) });
  block('terra', { side: tex(speck(['#C86A3A', '#BC6034', '#D27444', '#B45A30'], 41)) });
  block('terra2', { side: tex(speck(['#8E5A3E', '#7E4E36', '#9A6444', '#704430'], 42)) });
  block('terra3', { side: tex(speck(['#E8DCC4', '#DED2B8', '#F0E4CC'], 43)) });
  block('glass', { side: tex((u, v) => u === 0 || v === 0 || u === 15 || v === 15 ? '#1A2234' : (u + v) % 9 === 0 ? '#E8F7FF' : '#7FC8E8'), emit: .25 });
  let ALERT = false;   // the monitor shows the red alert instead of code

  // ---------- frame state ----------
  let CAM = null, T0 = 0, ZB = new Float32Array(0), FOC = 1;
  let LIGHTS = [], SPR = [], PTS = [], SHD = [];
  const AMB = [.30, .33, .50], FOG = [.10, .11, .22], SKY = { zen: [.06, .07, .19], hor: [.19, .17, .40], stars: 1, sun: 0 };
  let LDIR = [.26, .28, .40];
  const mix3 = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
  // time of day: 0 night, .5 dawn or dusk, 1 day. Sky, ambient, the moon or sun light and the fog follow.
  function setDay(k) {
    const N = { zen: [.06, .07, .19], hor: [.19, .17, .40], amb: [.30, .33, .50], fog: [.10, .11, .22], l: [.26, .28, .40] };
    const D = { zen: [.30, .36, .62], hor: [.96, .62, .46], amb: [.55, .48, .52], fog: [.52, .42, .48], l: [.75, .5, .35] };
    const Y = { zen: [.36, .56, .90], hor: [.80, .88, .98], amb: [.80, .82, .90], fog: [.72, .80, .93], l: [.55, .52, .45] };
    const [A, Bq, q] = k < .5 ? [N, D, k / .5] : [D, Y, (k - .5) / .5];
    SKY.zen = mix3(A.zen, Bq.zen, q); SKY.hor = mix3(A.hor, Bq.hor, q); SKY.stars = Math.max(0, 1 - k * 2.2); SKY.sun = Math.max(0, k * 2 - .6);
    const am = mix3(A.amb, Bq.amb, q), fg = mix3(A.fog, Bq.fog, q); AMB[0] = am[0]; AMB[1] = am[1]; AMB[2] = am[2]; FOG[0] = fg[0]; FOG[1] = fg[1]; FOG[2] = fg[2]; LDIR = mix3(A.l, Bq.l, q);
  }
  let MOON = (() => { const v = [.55, .5, -.65], l = Math.hypot(...v); return v.map(c => c / l); })();
  let fog0 = 18, fog1 = 46, moonK = 1, ambK = 1;
  const light = (x, y, z, c, r = 7, k = 1) => LIGHTS.push([x, y, z, c[0] * k, c[1] * k, c[2] * k, r]);
  const sprite = (img, x, y, z, o = {}) => SPR.push({ img, x, y, z, k: o.k ?? 1.75 / 87, lit: o.lit ?? 1, a: o.a ?? 1 });
  const pt = (x, y, z, s, c, e = false) => PTS.push([x, y, z, s, c, e]);
  const shadow = (x, y, z, r = .45, k = .45) => SHD.push([x, y, z, r, k]);

  function basis(c) {
    const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw), cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
    const f = [sy * cp, sp, -cy * cp]; let r = [cy, 0, sy];
    let u = [-sy * f[1], sy * f[0] - cy * f[2], cy * f[1]];
    if (c.roll) { const cr = Math.cos(c.roll), sr = Math.sin(c.roll); const r2 = r.map((v, i) => v * cr + u[i] * sr), u2 = u.map((v, i) => u[i] * cr - r[i] * sr); r = r2; u = u2; }
    return { f, r, u };
  }
  function frame(t, cam) {
    T0 = t; CAM = { ...cam, ...basis(cam) }; FOC = (PW / 2) / Math.tan((cam.fov || 70) * Math.PI / 360);
    LIGHTS = []; SPR = []; PTS = []; SHD = []; prepare(t);
    if (ZB.length !== PW * PH) ZB = new Float32Array(PW * PH);
  }

  // light arriving at point P with normal n (rgb written into L3)
  const L3 = [0, 0, 0];
  function lightAt(px, py, pz, nx, ny, nz, face) {
    let r = AMB[0] * face * ambK, g = AMB[1] * face * ambK, b = AMB[2] * face * ambK;
    const md = nx * MOON[0] + ny * MOON[1] + nz * MOON[2];
    if (md > 0) { r += LDIR[0] * md * moonK; g += LDIR[1] * md * moonK; b += LDIR[2] * md * moonK; }
    for (let i = 0; i < LIGHTS.length; i++) {
      const Lg = LIGHTS[i], dx = Lg[0] - px, dy = Lg[1] - py, dz = Lg[2] - pz, d2 = dx * dx + dy * dy + dz * dz, R = Lg[6];
      if (d2 > R * R) continue;
      const d = Math.sqrt(d2) + 1e-4, a = (1 - d / R), att = a * a, ndl = Math.max(0, (nx * dx + ny * dy + nz * dz) / d) * .75 + .25;
      r += Lg[3] * att * ndl; g += Lg[4] * att * ndl; b += Lg[5] * att * ndl;
    }
    L3[0] = r; L3[1] = g; L3[2] = b;
  }
  function sky(dx, dy, dz, out) {
    const l = Math.hypot(dx, dy, dz); dx /= l; dy /= l; dz /= l;
    const e = Math.max(0, Math.min(1, dy * 1.7 + .12));
    let r = SKY.hor[0] + (SKY.zen[0] - SKY.hor[0]) * e, g = SKY.hor[1] + (SKY.zen[1] - SKY.hor[1]) * e, b = SKY.hor[2] + (SKY.zen[2] - SKY.hor[2]) * e;
    const md = dx * MOON[0] + dy * MOON[1] + dz * MOON[2];
    if (SKY.sun > 0 && md > .995) { const k = Math.min(1, SKY.sun); r += (1.0 - r) * k; g += (.92 - g) * k; b += (.7 - b) * k; }
    else if (SKY.sun > 0 && md > .96) { const k = SKY.sun * ((md - .96) / .035) ** 2 * .5; r += .5 * k; g += .4 * k; b += .2 * k; }
    else if (SKY.stars < .3) {}
    else if (md > .9986) { const cr = Math.sin(dx * 900) * Math.sin(dy * 700) > .55; r = cr ? .86 : .96; g = cr ? .80 : .91; b = cr ? .66 : .78; }
    else {
      if (md > .97) { const k = (md - .97) / .03; r += .22 * k * k; g += .2 * k * k; b += .22 * k * k; }
      if (dy > .02 && SKY.stars > 0) { const az = Math.atan2(dx, -dz), el = Math.asin(dy), ci = Math.floor(az * 80), cj = Math.floor(el * 80), hh = h3(ci, cj, 31);
        if (hh > .985) { const tw = (.55 + .45 * Math.sin(T0 * (2 + 3 * h3(ci, cj, 32)) + hh * 40)) * SKY.stars; r += .7 * tw; g += .68 * tw; b += .6 * tw; } }
    }
    out[0] = r; out[1] = g; out[2] = b;
  }

  // ---------- the cast ----------
  const SK = [0, 0, 0];
  function castWorld() {
    const { f, r, u } = CAM, ox = CAM.x, oy = CAM.y, oz = CAM.z, half = PW / 2, inv = 1 / FOC, fr = Math.floor(T0 * 8) % 8;
    for (let py = 0; py < PH; py++) for (let px = 0; px < PW; px++) {
      const sx = (px + .5 - half) * inv, sy = -(py + .5 - PH / 2) * inv;
      const dx = f[0] + r[0] * sx + u[0] * sy, dy = f[1] + r[1] * sx + u[1] * sy, dz = f[2] + r[2] * sx + u[2] * sy;
      let x = Math.floor(ox), y = Math.floor(oy), z = Math.floor(oz);
      const stx = dx > 0 ? 1 : -1, sty = dy > 0 ? 1 : -1, stz = dz > 0 ? 1 : -1;
      const tdx = dx ? Math.abs(1 / dx) : 1e9, tdy = dy ? Math.abs(1 / dy) : 1e9, tdz = dz ? Math.abs(1 / dz) : 1e9;
      let tmx = dx ? (dx > 0 ? x + 1 - ox : ox - x) * tdx : 1e9, tmy = dy ? (dy > 0 ? y + 1 - oy : oy - y) * tdy : 1e9, tmz = dz ? (dz > 0 ? z + 1 - oz : oz - z) * tdz : 1e9;
      let t = 0, ax = -1, id = 0;
      for (let s = 0; s < 260; s++) {
        if (tmx < tmy) { if (tmx < tmz) { x += stx; t = tmx; tmx += tdx; ax = 0; } else { z += stz; t = tmz; tmz += tdz; ax = 2; } }
        else { if (tmy < tmz) { y += sty; t = tmy; tmy += tdy; ax = 1; } else { z += stz; t = tmz; tmz += tdz; ax = 2; } }
        if (x < 0 || y < 0 || z < 0 || x >= SX || y >= SY || z >= SZ || t > 70) break;
        id = W[(y * SZ + z) * SX + x]; if (id) break;
      }
      const o = (py * PW + px) * 4;
      if (!id) { sky(dx, dy, dz, SK); BUF[o] = SK[0] * 255; BUF[o + 1] = SK[1] * 255; BUF[o + 2] = SK[2] * 255; BUF[o + 3] = 255; ZB[py * PW + px] = 1e9; continue; }
      ZB[py * PW + px] = t;
      const hx = ox + dx * t, hy = oy + dy * t, hz = oz + dz * t;
      let nx = 0, ny = 0, nz = 0, uu, vv, kind, face;
      if (ax === 0) { nx = -stx; uu = hz - Math.floor(hz); vv = 1 - (hy - Math.floor(hy)); kind = 1; face = .82; if (stx < 0) uu = 1 - uu; }
      else if (ax === 1) { ny = -sty; uu = hx - Math.floor(hx); vv = hz - Math.floor(hz); kind = sty < 0 ? 0 : 2; face = sty < 0 ? 1 : .5; }
      else { nz = -stz; uu = hx - Math.floor(hx); vv = 1 - (hy - Math.floor(hy)); kind = 1; face = .68; if (stz > 0) uu = 1 - uu; }
      const bl = BL[id];
      let tx = kind === 0 ? bl.top : kind === 2 ? bl.bot : bl.side;
      if (bl.frames && (kind === 1 || id === B.lava || id === B.code || id === B.portal)) tx = (id === B.monitor && ALERT) ? alertT : bl.frames[fr];
      const ti = (Math.min(15, (vv * 16) | 0) * 16 + Math.min(15, (uu * 16) | 0)) * 3;
      let cr = tx[ti], cg = tx[ti + 1], cb = tx[ti + 2];
      const dist = t * Math.hypot(dx, dy, dz);
      if (bl.emit && (kind === 1 || id === B.lava || id === B.lamp || id === B.amethyst || id === B.portal || id === B.goldblk || id === B.redlamp)) { cr *= bl.emit; cg *= bl.emit; cb *= bl.emit; }
      else {
        // edge occlusion: darken toward edges that meet a solid block, seen from the empty cell in front of the face
        const ex = x + nx, ey = y + ny, ez = z + nz;
        let ao = 0;
        const occ = (a, b2, c) => at(a, b2, c) ? 1 : 0, w = q => { const k = Math.max(0, 1 - q * 2.6); return k * k; };
        let fu, fv;
        if (ax === 0) { fu = hz - Math.floor(hz); fv = hy - Math.floor(hy); ao = occ(ex, ey, ez - 1) * w(fu) + occ(ex, ey, ez + 1) * w(1 - fu) + occ(ex, ey - 1, ez) * w(fv) + occ(ex, ey + 1, ez) * w(1 - fv); }
        else if (ax === 1) { fu = hx - Math.floor(hx); fv = hz - Math.floor(hz); ao = occ(ex - 1, ey, ez) * w(fu) + occ(ex + 1, ey, ez) * w(1 - fu) + occ(ex, ey, ez - 1) * w(fv) + occ(ex, ey, ez + 1) * w(1 - fv); }
        else { fu = hx - Math.floor(hx); fv = hy - Math.floor(hy); ao = occ(ex - 1, ey, ez) * w(fu) + occ(ex + 1, ey, ez) * w(1 - fu) + occ(ex, ey - 1, ez) * w(fv) + occ(ex, ey + 1, ez) * w(1 - fv); }
        lightAt(hx + nx * .01, hy + ny * .01, hz + nz * .01, nx, ny, nz, face);
        const aok = 1 - Math.min(.55, ao * .42);
        cr *= L3[0] * aok * 1.25; cg *= L3[1] * aok * 1.25; cb *= L3[2] * aok * 1.25;
      }
      const fk = Math.max(0, Math.min(1, (dist - fog0) / (fog1 - fog0)));
      cr += (FOG[0] - cr) * fk; cg += (FOG[1] - cg) * fk; cb += (FOG[2] - cb) * fk;
      BUF[o] = cr * 255; BUF[o + 1] = cg * 255; BUF[o + 2] = cb * 255; BUF[o + 3] = 255;
    }
  }
  function proj(x, y, z) {
    const { f, r, u } = CAM, dx = x - CAM.x, dy = y - CAM.y, dz = z - CAM.z;
    const cz = dx * f[0] + dy * f[1] + dz * f[2];
    return [PW / 2 + (dx * r[0] + dy * r[1] + dz * r[2]) / cz * FOC, PH / 2 - (dx * u[0] + dy * u[1] + dz * u[2]) / cz * FOC, cz];
  }
  // soft round shadows on the ground under the billboards: sample the disc, darken the pixels that land on it
  function drawShadows() {
    if (!SHD.length) return;
    const mark = new Uint8Array(PW * PH);
    for (const [x, y, z, r, k] of SHD) for (let i = -12; i <= 12; i++) for (let j = -12; j <= 12; j++) {
      const ux = i / 12, uz = j / 12, d = ux * ux + uz * uz; if (d > 1) continue;
      const [sx, sy, cz] = proj(x + ux * r, y + .02, z + uz * r * .8); const X = Math.round(sx), Y = Math.round(sy);
      if (cz < .2 || X < 0 || Y < 0 || X >= PW || Y >= PH) continue; const zi = Y * PW + X;
      if (mark[zi] || Math.abs(ZB[zi] - cz) > .3) continue; mark[zi] = 1;
      const f = 1 - k * (1 - d * .7), o = zi * 4; BUF[o] *= f; BUF[o + 1] *= f; BUF[o + 2] *= f * 1.05;
    }
  }
  function drawSprites() {
    drawShadows();
    const items = SPR.map(s => ({ s, p: proj(s.x, s.y, s.z) })).filter(o => o.p[2] > .2).sort((a, b) => b.p[2] - a.p[2]);
    for (const { s, p } of items) {
      const [sx, sy, cz] = p, img = s.img, k = s.k / cz * FOC;
      // scalar light at the sprite, so its colours keep their hue (no tint toward green under coloured light)
      lightAt(s.x, s.y + .8, s.z, -CAM.f[0], 0, -CAM.f[2], .9);
      const lum = (L3[0] * .3 + L3[1] * .5 + L3[2] * .2) * 1.25, lk = Math.max(.62, Math.min(1.12, .5 + lum * .75)) * s.lit;
      const x0 = Math.floor(sx - img.ox * k), y0 = Math.floor(sy - img.oy * k), x1 = Math.ceil(sx + (img.w - img.ox) * k), y1 = Math.ceil(sy + (img.h - img.oy) * k);
      for (let Y = Math.max(0, y0); Y < Math.min(PH, y1); Y++) {
        const v = Math.floor((Y + .5 - (sy - img.oy * k)) / k); if (v < 0 || v >= img.h) continue;
        for (let X = Math.max(0, x0); X < Math.min(PW, x1); X++) {
          const u = Math.floor((X + .5 - (sx - img.ox * k)) / k); if (u < 0 || u >= img.w) continue;
          const j = (v * img.w + u) * 4; if (!img.d[j + 3]) continue;
          const zi = Y * PW + X; if (cz > ZB[zi]) continue;
          const o = zi * 4, a = s.a;
          BUF[o] = BUF[o] * (1 - a) + img.d[j] * lk * a; BUF[o + 1] = BUF[o + 1] * (1 - a) + img.d[j + 1] * lk * a; BUF[o + 2] = BUF[o + 2] * (1 - a) + img.d[j + 2] * lk * a;
        }
      }
    }
    for (const [x, y, z, s, c, e] of PTS) {
      const [sx, sy, cz] = proj(x, y, z); if (cz < .15) continue;
      const n = Math.max(1, Math.round(s / cz * FOC)), X0 = Math.round(sx - n / 2), Y0 = Math.round(sy - n / 2);
      let k = 1; if (!e) { lightAt(x, y, z, -CAM.f[0], -CAM.f[1], -CAM.f[2], 1); k = Math.min(1.2, (L3[0] + L3[1] + L3[2]) / 3 * 1.6 + .25); }
      for (let Y = Y0; Y < Y0 + n; Y++) for (let X = X0; X < X0 + n; X++) {
        if (X < 0 || Y < 0 || X >= PW || Y >= PH) continue; const zi = Y * PW + X; if (cz > ZB[zi]) continue;
        const o = zi * 4; BUF[o] = c[0] * k; BUF[o + 1] = c[1] * k; BUF[o + 2] = c[2] * k;
      }
    }
  }
  function draw() { castWorld(); drawSprites(); }
  // swap one block for another in this frame only (after frame()): the cabin turning to code, lamps going dark
  function remap(a, b) { for (let i = 0; i < N; i++) if (W[i] === a) W[i] = b; }
  // a world point → output pixels (scale s = output px per buffer px), and whether it's in front of the world there
  function project(x, y, z, s = 1) {
    const [sx, sy, cz] = proj(x, y, z), X = Math.round(sx), Y = Math.round(sy);
    const vis = cz > .2 && X >= 0 && Y >= 0 && X < PW && Y < PH && cz <= ZB[Y * PW + X] + .35;
    return { x: sx * s, y: sy * s, cz, vis, k: FOC / cz };
  }
  // draw something with heigePx / clawdPx into its own small image (feet at ox, oy), for sprite()
  function capture(fn, w = 150, h = 150, ox = 75, oy = 140) {
    const sB = BUF, sW = PW, sH = PH;
    BUF = new Uint8ClampedArray(w * h * 4); PW = w; PH = h;
    let img; try { fn(ox, oy); } finally { img = { d: BUF, w, h, ox, oy }; BUF = sB; PW = sW; PH = sH; }
    return img;
  }
  return {
    B, SX, SY, SZ, set, get, fill, edit, at, frame, draw, remap, light, sprite, pt, shadow, project, capture,
    reset: () => { base.fill(0); EDITS = []; sorted = true; },   // a scene that shares the page with another world starts clean
    setAlert: v => { ALERT = v; }, setDay, setMoonDir: v => { const l = Math.hypot(...v); MOON = v.map(c => c / l); }, setFog: (a, b) => { fog0 = a; fog1 = b; }, setMoon: k => { moonK = k; }, setAmb: k => { ambK = k; },
    rgbOf: name => { const bl = BL[B[name]]; const tx = bl.side; return [tx[0] * 255, tx[1] * 255, tx[2] * 255]; },
    texel: (name, i) => { const tx = BL[B[name]].side; return [tx[i * 3] * 255, tx[i * 3 + 1] * 255, tx[i * 3 + 2] * 255]; },
  };
})();
