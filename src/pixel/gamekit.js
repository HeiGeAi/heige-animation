// pixel/gamekit.js: 「像素游戏动画」 (pixel game animation), the look of a pixel book-talk show, as a kit: a velvet-curtain
// stage under soft spotlights and the other sets, gold game-UI frames, cards, chips and seals, character cards on
// sunbursts, a camera on every shot, a chapter bar along the top and subtitles with the key words in gold.
// A scene file asks for a kit bound to its voice data (from tools/video/align.py) and builds its shots with it:
//   const K = pxGame(DATA), { shot, cl, hg, curtain, spot, chip, ... } = K;
//   shot('phrase', (lt, t) => { ... }, { res, in, cam });   ...
//   LOOPS.myFilm = () => {}; Object.assign(LOOPS.myFilm, { len: DATA.len, film: K.film({ chapters, keys }) });
// FLOOR is the floor line of whatever shot is being drawn (5/6 of the way down). The sample is scenes/manong3.js.
Object.defineProperty(window, 'FLOOR', { get: () => Math.round(PH * 5 / 6), configurable: true });
function pxGame(D) {
  const M = D.marks, at = ph => M[ph] ?? M[ph + '#1'] ?? null;
  const after = (t, ph, d = 0) => at(ph) != null && t >= at(ph) + d;
  const since = (t, ph) => at(ph) == null ? -1 : t - at(ph);
  let SHK = 0;                                                        // this frame's shake
  const R = prect;
  const GOLD = '#E8A93A', GOLDL = '#FFD86A', GOLDD = '#8A5A22', INK = '#140A10', CARD = '#2A1A22', CREAM = '#FFF1C9', RED = '#E8384A', PINK = '#FF8C9A', SKY = '#9BE3F7';
  // ---------- helpers ----------
  const vgrad = (x0, x1, y0, y1, stops) => { for (let y = Math.max(0, y0); y < Math.min(PH, y1); y++) for (let x = Math.max(0, x0); x < Math.min(PW, x1); x++) pset(x, y, bandAt(x, y, y - y0, stops, 3)); };
  const box = (x, y, w, h, fill, rim = INK) => { R(Math.round(x), Math.round(y), w, h, rim); R(Math.round(x) + 1, Math.round(y) + 1, w - 2, h - 2, fill); };
  const out3 = x => 1 - (1 - clamp(x)) ** 3;
  const pop = (lt, d = .2) => lt <= 0 ? 0 : out3(lt / d);
  const over = x => { x = clamp(x); return 1 + 2.7 * (x - 1) ** 3 + 1.7 * (x - 1) ** 2; };   // overshoots a little, then settles
  const kick = (dt, amp = 3, dur = .35) => { if (dt >= 0 && dt < dur) SHK = Math.max(SHK, amp * (1 - dt / dur)); };
  // a value that eases between [time, value] keys (keys with a null time are dropped)
  const ramp = (t, keys) => { const k = keys.filter(q => q[0] != null); if (t <= k[0][0]) return k[0][1]; for (let i = 1; i < k.length; i++) if (t < k[i][0]) { const [a, va] = k[i - 1], [b, vb] = k[i]; return lerp(va, vb, ease((t - a) / (b - a))); } return k[k.length - 1][1]; };
  const vlen = s => [...s].reduce((n, ch) => n + (ch.charCodeAt(0) > 0x2E80 ? 1 : ch === ' ' ? .35 : .62), 0);
  const hg = (x, y, o = {}) => heigePx(Math.round(x), Math.round(y), o);
  const cl = (x, y, o = {}) => clawdPx(Math.round(x), Math.round(y), o);
  const ds = (x, y, o = {}) => modelPx('deepseek', Math.round(x), Math.round(y), o);   // DeepSeek, from the locked roster
  const feelT = (name, t, extra = {}) => ({ ...feel(name, onTwos(t)), ...extra });
  const emo = (t, keys, extra = {}) => ({ ...emotions(onTwos(t), keys.filter(k => k[0] != null), { take: .8 }), ...extra });
  const icon = (n, cx, cy, s = 2, tint) => pxIcon(n, Math.round(cx - 6 * s), Math.round(cy - 6 * s), s, tint);
  const typing = (t, f = 9) => Math.floor(t * f) % 2 ? { aL: .7, aR: .1 } : { aL: .1, aR: .7 };
  // someone walking between [time, x] keys: the x, and whether they're walking (and which way) right now
  const walker = (t, keys) => { const x = ramp(t, keys), x0 = ramp(t - .06, keys); return { x, moving: Math.abs(x - x0) > .15, flip: x < x0 }; };
  const sparkle = (cx, cy, r, t, n = 10, col = GOLDL) => { for (let i = 0; i < n; i++) { const ph = (t * (1 + hash(i + 2)) + hash(i + 3)) % 1; if (ph > .55) continue; const a = hash(i) * TAU, d = r * (.35 + .65 * hash(i + 1)), x = Math.round(cx + Math.cos(a) * d), y = Math.round(cy + Math.sin(a) * d * .7); pset(x, y, col); if (ph < .25) { pset(x - 1, y, col); pset(x + 1, y, col); pset(x, y - 1, col); pset(x, y + 1, col); } } };
  // a gold game-UI frame: dark rim, gold band lit on top, corner studs; an optional title plate on its top edge
  const frame = (x, y, w, h, o = {}) => {
    x = Math.round(x); y = Math.round(y);
    R(x, y, w, h, INK); R(x + 1, y + 1, w - 2, h - 2, GOLDD); R(x + 2, y + 2, w - 4, h - 4, GOLD); R(x + 2, y + 2, w - 4, 1, GOLDL); R(x + 2, y + 2, 1, h - 4, GOLDL);
    R(x + 4, y + 4, w - 8, h - 8, INK); if (o.fill !== false) R(x + 5, y + 5, w - 10, h - 10, o.fill || CARD);
    for (const [cx, cy] of [[x + 1, y + 1], [x + w - 4, y + 1], [x + 1, y + h - 4], [x + w - 4, y + h - 4]]) { R(cx, cy, 3, 3, GOLDL); pset(cx + 1, cy + 1, RED); }
    if (o.title) { const sz = o.titleSize || 6.5, tw = Math.round(vlen(o.title) * sz + 16), th = Math.round(sz * 1.6) + 2, tx = Math.round(x + w / 2 - tw / 2), ty = Math.round(y - th / 2); R(tx, ty, tw, th, INK); R(tx + 1, ty + 1, tw - 2, th - 2, '#3A2418'); R(tx + 1, ty + 1, tw - 2, 1, GOLD); pxText(o.title, x + w / 2, ty + th / 2, { size: sz, color: GOLDL }); }
  };
  // a tag chip, centred (chipL: from its left edge): dark plate, gold edge, sized to its text
  const chipW = (txt, size) => Math.round(vlen(txt) * size + size * 1.6);
  const chip = (txt, x, y, col = GOLDL, size = 6) => { const w = chipW(txt, size), h = Math.round(size * 1.5) + 2, x0 = Math.round(x - w / 2), y0 = Math.round(y - h / 2); R(x0, y0, w, h, GOLD); R(x0 + 1, y0 + 1, w - 2, h - 2, '#2A1418'); R(x0 + 1, y0 + 1, w - 2, 1, '#4A2A22'); pxText(txt, x0 + w / 2, y0 + h / 2, { size, color: col }); };
  const chipL = (txt, x0, y, col, size) => chip(txt, x0 + chipW(txt, size) / 2, y, col, size);
  // a red seal slammed down: big for a moment, then its size
  const stamp = (txt, x, y, lt, size = 10) => { if (lt < 0) return; const k = 1 + 1.1 * Math.max(0, 1 - lt / .1), s = size * k, w = Math.round(vlen(txt) * s + s * 1.3), h = Math.round(s * 1.7), x0 = Math.round(x - w / 2), y0 = Math.round(y - h / 2), b = Math.max(1, Math.round(size / 6)); R(x0, y0, w, h, RED); R(x0 + b, y0 + b, w - 2 * b, h - 2 * b, '#F4E4D0'); pxText(txt, x, y, { size: s, color: RED, stroke: false }); };
  // an item card: a framed picture with a caption plate under it (inner(x, y, w, h) paints the picture); k slides it up
  const card = (x, y, w, h, caption, inner, k = 1) => { if (k <= 0) return; const yy = Math.round(y + (1 - k) * 40); frame(x, yy, w, h); inner(x + 5, yy + 5, w - 10, h - 24); R(x + 8, yy + h - 18, w - 16, 12, '#3A2418'); R(x + 8, yy + h - 18, w - 16, 1, GOLD); pxText(caption, x + w / 2, yy + h - 12, { size: 6.5, color: CREAM }); };
  // ---------- sets ----------
  // a stage light: a soft cone down to a pool on the floor (drawn smooth over the pixels), dust drifting in it
  const spot = (sx, t, o = {}) => {
    const y1 = o.floor ?? FLOOR + 2, w1 = o.w ?? PW * .2, w0 = w1 * .22;
    pellipse(sx, y1 + 1, w1 * .46, Math.max(2, PH / 50), o.pool || '#6A4630');
    for (let i = 0; i < 14; i++) { const y = (hash(i + 3) * y1 + t * 3 * (.5 + hash(i + 5))) % y1, half = lerp(w0, w1, y / y1) * .45, x = sx + (hash(i) - .5) * 2 * half + Math.sin(t + i) * 1.5; if (Math.sin(t * 2 + i * 3) > -.2) pset(x, y, '#E8D2A8'); }
    pxFx({ type: 'spot', x: sx, y0: -6, y1, w0, w1, a: o.a ?? .3, col: o.col });
  };
  // the velvet-curtain stage: folds in four reds, a scalloped valance with a gold fringe, plank floor; open 0..1
  const curtain = (t, open = 1) => {
    vgrad(0, PW, 0, FLOOR, [[0, '#120A14'], [FLOOR, '#1E1020']]);
    vgrad(0, PW, FLOOR, PH, [[0, '#6A4028'], [2, '#4A2C1C'], [30, '#2E1C14']]);
    for (let y = FLOOR + 4; y < PH; y += 7) R(0, y, PW, 1, '#2A170F');
    for (let x = 10; x < PW; x += 37) for (let y = FLOOR; y < PH; y++) if (((y - FLOOR) / 7 | 0) % 2 === (x / 37 | 0) % 2) pset(x, y, '#2A170F');
    curtainCloth(t, open);
  };
  const curtainCloth = (t, open) => {
    const u = PW / 320, w = Math.round(lerp(PW / 2 + 2, 46 * u, ease(open))), bottom = PH - (PH - FLOOR) * .3;
    for (const side of [-1, 1]) for (let i = 0; i < w; i++) { const x = side < 0 ? i : PW - 1 - i, f = Math.sin((i / u + (side < 0 ? 0 : 7)) * .45 + t * .5); for (let y = 0; y < bottom; y++) pset(x, y, f > .6 ? '#A82A3A' : f > -.1 ? '#7A1C2A' : f > -.7 ? '#5A1420' : '#3A0E16'); if (i === w - 1) for (let y = 0; y < bottom; y++) pset(x, y, INK); }
    for (let x = 0; x < PW; x++) { const s = Math.abs(Math.sin(x / (20 * u) * Math.PI)), h = Math.round((14 + s * 5) * u); for (let y = 0; y < h; y++) pset(x, y, y < 3 ? '#5A1420' : y > h - 3 ? GOLD : '#8A2232'); if (x % 3 === 0) pset(x, h, GOLDL); }
  };
  const darkStage = (t, spots = []) => { vgrad(0, PW, 0, FLOOR, [[0, '#08060C'], [FLOOR, '#160E18']]); vgrad(0, PW, FLOOR, PH, [[0, '#2A1A10'], [30, '#140C08']]); for (const s of spots) spot(s, t); };
  const sunburst = (t, a, c, cx = PW / 2, cy = PH * .55) => { for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) { const ang = Math.atan2(y - cy, x - cx) + t * .25; pset(x, y, Math.floor((ang / TAU) * 28 + 28) % 2 === 0 ? c : a); } pxFx({ type: 'glow', x: cx, y: cy, r: PH * .55, a: .35, col: '#FFC27A' }); };
  const hall = (t) => {
    vgrad(0, PW, 0, FLOOR, [[0, '#1A1018'], [FLOOR, '#2A1820']]);
    for (let x = 0; x < PW; x += 16) R(x, 30, 1, FLOOR - 30, '#22141C');
    for (let i = 0; i < 5; i++) { const bx = 26 + i * 68, sw = Math.round(Math.sin(t * 1.4 + i) * 1); R(bx - 1, 18, 26, 2, GOLD); for (let y = 20; y < 70; y++) { const w = y > 62 ? 24 - (y - 62) * 3 : 24, s2 = y > 50 ? sw : 0; R(bx + (24 - w) / 2 + s2, y, w, 1, '#9A2232'); } R(bx + 8 + sw, 34, 8, 8, GOLD); pset(bx + 11 + sw, 37, RED); }
    vgrad(0, PW, FLOOR, PH, [[0, '#3A2A2A'], [30, '#1E1414']]);
    for (const fx of [14, 306]) { R(fx - 4, FLOOR - 30, 8, 30, '#3A2418'); R(fx - 6, FLOOR - 32, 12, 3, GOLD); const fl = Math.floor(t * 12); for (let j = 0; j < 9; j++) pset(fx - 2 + Math.round(hash(j + fl) * 4), FLOOR - 34 - j, j < 4 ? GOLDL : RED); pxFx({ type: 'glow', x: fx, y: FLOOR - 36, r: 26, a: .45, col: '#FFB347' }); }
  };
  const pedestal = (x, w = 40) => { R(x - w / 2, FLOOR - 22, w, 22, '#3A2A2A'); R(x - w / 2 - 2, FLOOR - 24, w + 4, 3, GOLD); R(x - w / 2 - 2, FLOOR - 24, w + 4, 1, GOLDL); R(x - w / 2 + 3, FLOOR - 18, w - 6, 1, '#4A3636'); };
  // the office: night or day through the window (sun and moon cross it), a wall clock, a wall screen of code
  const office = (t, o = {}) => {
    vgrad(0, PW, 0, FLOOR, [[0, '#1E141C'], [FLOOR, '#2A1C24']]);
    const ph = o.phase ?? .8, day = Math.sin(ph * TAU) > 0, wx = 200, wy = 22, ww = 96, wh = 60;
    frame(wx - 6, wy - 6, ww + 12, wh + 12, { fill: false });
    vgrad(wx, wx + ww, wy, wy + wh, day ? [[0, '#E8A06A'], [wh, '#FFD8A0']] : [[0, '#0E0A20'], [wh, '#2A1C44']]);
    const a = (ph % .5) * 2, cx = wx + 8 + a * (ww - 16), cy = wy + wh - 8 - Math.sin(a * Math.PI) * (wh - 20);
    if (day) pellipse(cx, cy, 7, 7, '#FFF1C9'); else { pellipse(cx, cy, 5, 5, '#F8E9C6'); pellipse(cx + 2, cy - 1, 4, 4, '#0E0A20'); }
    for (let i = 0; i < 9; i++) { const bx = wx + i * 11, bh = 14 + Math.floor(hash(i + 3) * 26); R(bx, wy + wh - bh, 10, bh, day ? '#8A5A4A' : '#140E22'); if (!day) for (let j = 0; j < bh - 4; j += 5) for (let k = 2; k < 9; k += 4) if (hash(i * 31 + j * 7 + k) > .45) pset(bx + k, wy + wh - bh + 3 + j, GOLD); }
    pxFx({ type: 'glow', x: wx + ww / 2, y: wy + wh / 2, r: 70, a: day ? .35 : .12, col: day ? '#FFC27A' : '#7A6AC8' });
    vgrad(0, PW, FLOOR, PH, [[0, '#4A2C1C'], [30, '#2A1810']]);
    const ccx = 40, ccy = 40, sp = o.clockSpin ?? 0; frame(ccx - 16, ccy - 16, 32, 32, { fill: CREAM }); pline(ccx, ccy, ccx + Math.sin(sp) * 9, ccy - Math.cos(sp) * 9, INK); pline(ccx, ccy, ccx + Math.sin(sp / 12) * 6, ccy - Math.cos(sp / 12) * 6, RED);
    box(70, 26, 70, 44, '#0E1420', '#3A2A2A');
    for (let i = 0; i < 7; i++) { const ln = (i + Math.floor(t * 6)) % 12, w = 8 + Math.floor(hash(ln) * 40); R(74 + Math.floor(hash(ln + 50) * 6), 30 + i * 5, w, 2, hash(ln + 9) > .7 ? GOLD : '#4AA8E0'); }
  };
  // the desk, drawn after whoever sits behind it: the top, a front panel that hides their legs, a monitor seen
  // edge-on facing them (its light on their face), coffee cups that pile up
  const desk = (dx, t, o = {}) => {
    R(dx - 52, FLOOR - 17, 104, 4, '#9A6A44'); R(dx - 52, FLOOR - 17, 104, 1, '#C08A5C'); R(dx - 50, FLOOR - 13, 100, 13, '#5A3A2C'); R(dx - 50, FLOOR - 13, 100, 1, '#3A2418');
    for (const x of [dx - 46, dx + 4]) { R(x, FLOOR - 10, 42, 8, '#4A2C22'); R(x + 18, FLOOR - 7, 6, 2, GOLD); }
    const mx = dx + (o.mx ?? 30); R(mx, FLOOR - 40, 4, 23, '#2C2B3D'); R(mx - 1, FLOOR - 41, 6, 1, '#141026'); R(mx + 1, FLOOR - 19, 2, 2, '#2C2B3D'); R(mx - 4, FLOOR - 18, 10, 1, '#2C2B3D');
    pxFx({ type: 'glow', x: mx - 8, y: FLOOR - 30, r: 26, a: .3, col: '#CFE4FF' });
    for (let i = 0; i < (o.cups || 0); i++) { const cx = dx - 48 + (i % 7) * 6, cy = FLOOR - 23 - Math.floor(i / 7) * 6; box(cx, cy, 5, 6, CREAM); }
  };
  const bedroom = (t, o = {}) => {
    vgrad(0, PW, 0, FLOOR, [[0, '#120A18'], [FLOOR, '#1E1224']]);
    frame(34, 16, 80, 62, { fill: '#0E0A20' }); vgrad(39, 109, 21, 73, [[0, '#0E0A20'], [52, '#24183A']]); pellipse(88, 34, 6, 6, '#F8E9C6');
    pxFx({ type: 'glow', x: 88, y: 34, r: 40, a: .18, col: '#B8B0FF' });
    vgrad(0, PW, FLOOR, PH, [[0, '#3A2420'], [30, '#221410']]);
    R(170, FLOOR - 22, 130, 22, '#7A1C2A'); R(170, FLOOR - 26, 130, 5, CREAM); R(176, FLOOR - 36, 30, 12, '#E8D8C0'); R(166, FLOOR - 40, 4, 40, '#5A3A2C'); R(300, FLOOR - 30, 4, 30, '#5A3A2C');
    if (o.phone != null) { const buzz = o.phone ? Math.round(Math.sin(t * 60)) : 0; box(278 + buzz, FLOOR - 31, 12, 6, INK); R(280 + buzz, FLOOR - 30, 8, 4, o.phone ? SKY : '#2B2558'); if (o.phone) pxFx({ type: 'glow', x: 284, y: FLOOR - 30, r: 30, a: .5, col: '#BFE8FF' }); }
  };
  const serverRoom = (t, cam = 0) => {
    vgrad(0, PW, 0, PH, [[0, '#0C0810'], [180, '#1A1218']]);
    for (let i = -1; i < 9; i++) { const x = 16 + i * 44 - (cam % 44); box(x, 30, 34, FLOOR - 30, '#1B1418', '#3A2A2A'); for (let j = 0; j < 14; j++) { R(x + 4, 36 + j * 8, 26, 5, '#241A1E'); if (Math.sin(t * (3 + hash(i * 9 + j) * 6) + j) > 0) pset(x + 6 + (j % 3) * 3, 38 + j * 8, hash(i + j) > .5 ? '#4AA8E0' : GOLD); } }
    vgrad(0, PW, FLOOR, PH, [[0, '#2C2224'], [30, '#1B1416']]);
  };
  const examHall = t => {
    vgrad(0, PW, 0, FLOOR, [[0, '#24161C'], [FLOOR, '#2E1E22']]);
    frame(24, 12, 272, 58, { fill: '#22262E' });
    vgrad(0, PW, FLOOR, PH, [[0, '#5A3A2C'], [30, '#3A2418']]);
  };
  const examDesks = (t, row) => { for (let i = 0; i < 6; i++) { const x = 14 + i * 52 + row * 20, y = FLOOR - 6 + row * 18; R(x, y - 10, 34, 4, '#8A5A3C'); R(x + 2, y - 6, 2, 10, '#5A3A2C'); R(x + 30, y - 6, 2, 10, '#5A3A2C'); box(x + 10, y - 12, 12, 3, CREAM); } };
  const bar = t => {
    vgrad(0, PW, 0, FLOOR, [[0, '#1E1014'], [FLOOR, '#2E1A1E']]);
    for (let s = 0; s < 3; s++) { R(0, 50 + s * 24, PW, 3, '#5A3A2C'); for (let i = 0; i < 22; i++) { const h = 8 + Math.floor(hash(i + s * 30) * 10); R(8 + i * 14, 50 + s * 24 - h, 5, h, [GOLD, '#A61F35', '#8F6CC8', '#C08A5C'][Math.floor(hash(i * 7 + s) * 4)]); } }
    for (const lx of [60, 160, 260]) { R(lx, 0, 1, 20, '#3A2A2A'); pellipse(lx, 22, 5, 3, GOLD); pxFx({ type: 'glow', x: lx, y: 24, r: 40, a: .35, col: '#FFB347' }); }
    vgrad(0, PW, FLOOR, PH, [[0, '#2A1810'], [30, '#1A0E0A']]);
  };
  const barTop = () => { R(0, FLOOR - 22, PW, 22, '#5A3A2C'); R(0, FLOOR - 24, PW, 3, '#9A6A44'); R(0, FLOOR - 24, PW, 1, '#C08A5C'); };
  const street = (t, cam = 0) => {
    vgrad(0, PW, 0, FLOOR, [[0, '#0E0A1A'], [100, '#2A1830'], [FLOOR, '#5A2A3A']]);
    for (let i = -2; i < 16; i++) { const k = i + Math.floor(cam / 34), bx = i * 34 - (cam % 34), bh = 50 + Math.floor(hash(k + 3) * 60); R(bx, FLOOR - bh, 30, bh, '#1A1220'); for (let j = 4; j < bh - 6; j += 7) for (let q = 4; q < 28; q += 7) if (hash(k * 31 + j * 7 + q) > .55) R(bx + q, FLOOR - bh + j, 3, 3, GOLD); }
    vgrad(0, PW, FLOOR, PH, [[0, '#3A2A2A'], [12, '#201618']]);
    for (let x = -(cam * 2 % 40); x < PW; x += 40) R(x, FLOOR + 12, 18, 2, '#5A4444');
  };
  const npc = (x, y, ph = null, col = '#3A2430') => { const lift = ph == null ? 0 : (Math.floor(ph * 4) % 2); for (const [dx, up] of [[-3, lift], [1, 1 - lift]]) R(x + dx, y - 9 - (ph == null ? 0 : up), 3, 9, col); R(x - 5, y - 22, 10, 14, col); R(x - 4, y - 30, 8, 8, col); };
  const hp = (x, y, k, label) => { frame(x, y, 110, 24); R(x + 26, y + 9, 76, 6, INK); R(x + 27, y + 10, Math.round(74 * clamp(k)), 4, k < .3 ? RED : GOLD); R(x + 27, y + 10, Math.round(74 * clamp(k)), 1, GOLDL); icon('heart', x + 15, y + 12, 1); if (label) chip(label, x + 55, y - 8, k < .3 ? PINK : GOLDL, 7); };
  const cloud = (cx, cy, t) => { for (const [dx, dy, r] of [[-12, 2, 9], [0, -3, 12], [13, 2, 9]]) pellipse(cx + dx, cy + dy, r, r * .7, '#5A5068'); R(cx - 20, cy + 3, 42, 6, '#5A5068'); for (let i = 0; i < 10; i++) { const ph = (t * 2 + hash(i)) % 1; R(Math.round(cx - 18 + hash(i + 4) * 36), Math.round(cy + 10 + ph * 34), 1, 3, '#8EA6D8'); } };
  // a character card: a sunburst, the figure big, a name and tags popping in one by one (160 × 90 shots)
  const charCard = (t, lt, draw, name, tags, col) => {
    sunburst(t, col[0], col[1], 44, 50); sparkle(44, 44, 30, t, 12);
    draw(44, FLOOR + Math.round((1 - over(lt / .45)) * 50));
    const k = pop(lt - .1, .3); pxText(name, lerp(190, 86, k), 18, { size: 11, align: 'left' });
    tags.forEach((g, i) => { if (lt > .35 + i * .18) chipL(g, 86, 36 + i * 13, GOLDL, 5.5); });
  };


  // ---------- shots ----------
  const S = [];
  // o.cam(lt, t, d) -> [x, y, z]; the default is a slow push into the middle
  const shot = (ph, draw, o = {}) => S.push({ ph, draw, cam: o.cam, res: o.res || [320, 180], in: o.in || { type: 'dissolve', dur: .35 }, lead: o.lead ?? .15, grade: o.grade, bloom: o.bloom });
  const push = (x, y, z0 = 1.02, z1 = 1.12) => (lt, t, d) => [x, y, lerp(z0, z1, ease(clamp(lt / d)))];
  const title = (n, txt, ic) => (lt, t) => {
    curtain(t, 1); spot(160, t, { w: 90, a: .38 });
    const k = over(lt / .45), y = Math.round(lerp(-90, 50, k));
    frame(70, y, 180, 66, { title: `第${n}个` }); icon(ic, 112, y + 34, 2); pxText(txt, 184, y + 34, { size: 16, color: GOLDL });
    pxFx({ type: 'glow', x: 160, y: y + 33, r: 110, a: .25 }); sparkle(160, y + 33, 110, t, 16);
    kick(lt - .3, 2.5);
  };

  // the film: times from the phrases, each shot's camera and shake, the chapter bar and the subtitles
  //   chapters: [[name, start time], ...]   keys: words to colour gold in the subtitles
  const film = ({ chapters = [], keys = [], post = false } = {}) => {
    const missing = S.filter(s => s.ph && at(s.ph) == null).map(s => s.ph);
    if (missing.length) console.warn('shots on phrases with no time (run phrases.mjs and align.py again):', missing);
    const shots = S.filter(s => !s.ph || at(s.ph) != null).map(s => ({ ...s, t0: s.ph ? Math.max(0, at(s.ph) - s.lead) : 0 })).sort((a, b) => a.t0 - b.t0);  // in time order, however they were written
    for (let i = 0; i < shots.length; i++) {
      const sh = shots[i]; sh.t1 = i + 1 < shots.length ? shots[i + 1].t0 : D.len;
      const d = sh.t1 - sh.t0, draw = sh.draw, cam = sh.cam || push(PW / 2, PH / 2 + 6);
      sh.draw = (lt, t) => {
        SHK = 0;
        if (typeof FX2 !== 'undefined') { if (sh.grade) fx2Grade(sh.grade); if (sh.bloom != null) FX2.frame.bloom = sh.bloom; }
        draw(lt, t);
        if (typeof FX2 !== 'undefined' && SHK > 0) fx2Hit(Math.min(1, SHK / 4.5));
        let [cx, cy, z] = cam(lt, t, d);
        if (SHK > 0) { const f = Math.floor(t * 24); cx += (hash(f) - .5) * 2 * SHK * PW / 320; cy += (hash(f + 7) - .5) * 2 * SHK * PW / 320; z = Math.max(z, 1.05); }
        pxCam(cx, cy, z); pxFx({ type: 'vig', k: .6 });
      };
    }
    const CHAPTERS = chapters, KEY = keys;
    const subtitle = (c, t) => {
      let ci = 0; CHAPTERS.forEach(([, s], i) => { if (s != null && t >= s - .2) ci = i; });
      const W = 1920 / CHAPTERS.length;
      c.fillStyle = 'rgba(12,6,10,.72)'; c.fillRect(0, 0, 1920, 46);
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = '700 24px "PingFang SC", sans-serif';
      CHAPTERS.forEach(([name], i) => { if (i === ci) { c.fillStyle = 'rgba(232,169,58,.92)'; c.fillRect(i * W + 4, 5, W - 8, 36); c.fillStyle = '#1A0E10'; } else c.fillStyle = i < ci ? '#C9B8A0' : '#7A6A60'; c.fillText(name, i * W + W / 2, 24); if (i) { c.fillStyle = '#3A2A26'; c.fillRect(i * W, 10, 2, 26); } });
      for (const [a, b, txt] of D.cues) if (t >= a && t < b) {
        c.font = '900 66px "PingFang SC", sans-serif'; c.textAlign = 'left'; c.lineJoin = 'round';
        const parts = []; let i = 0;
        while (i < txt.length) { const k = KEY.find(w => txt.startsWith(w, i)); if (k) { parts.push([k, true]); i += k.length; } else { if (parts.length && !parts[parts.length - 1][1]) parts[parts.length - 1][0] += txt[i]; else parts.push([txt[i], false]); i++; } }
        const total = parts.reduce((s, [p]) => s + c.measureText(p).width, 0); let x = 960 - total / 2;
        for (const [p, key] of parts) { c.lineWidth = 14; c.strokeStyle = '#140A10'; c.strokeText(p, x, 1010); c.fillStyle = key ? '#FFD34E' : '#FFFFFF'; c.fillText(p, x, 1010); x += c.measureText(p).width; }
        c.textAlign = 'center'; break;
      }
    };
    return { shots, subtitle, post };
  };
  return {
    at, after, since, R, GOLD, GOLDL, GOLDD, INK, CARD, CREAM, RED, PINK, SKY,
    vgrad, box, out3, pop, over, kick, ramp, vlen, hg, cl, ds, feelT, emo, icon, typing, walker, sparkle,
    frame, chip, chipL, stamp, card,
    spot, curtain, curtainCloth, darkStage, sunburst, hall, pedestal, office, desk, bedroom, serverRoom, examHall, examDesks, bar, barTop, street, npc, hp, cloud, charCard,
    shot, push, title, film,
  };
}
