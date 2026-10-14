// pixel/scenes/manong2.js: 「码农这行纯粹是邪门」 as a pixel film. 黑哥 plays the coder friend through ~30 shots
// in their own sets (office at night, the street home, his bedroom, the server room, a void of stars, an exam hall,
// a throne room, a bar, a city of the future), joined by transitions. Every shot and beat hangs on a phrase of the
// script (manong_data.js, from tools/video/align.py), so the picture follows the voice.
//   node render.mjs --page=pixel.html --loop=pxManong2 --clip --fps=24 --out=out/video/manong/picture2.mp4
(() => {
  if (!window.MANONG) return;
  const D = MANONG, M = D.marks, at = ph => M[ph] ?? M[ph + '#1'] ?? null;
  const after = (t, ph, d = 0) => at(ph) != null && t >= at(ph) + d;
  const since = (t, ph) => at(ph) == null ? -1 : t - at(ph);
  const G = 150;                                                     // the floor line in 320 × 180 sets
  const R = prect;
  // ---------- painting helpers ----------
  const vgrad = (x0, x1, y0, y1, stops) => { for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) pset(x, y, bandAt(x, y, y - y0, stops, 3)); };
  const box = (x, y, w, h, fill, rim = '#141026') => { R(x, y, w, h, rim); R(x + 1, y + 1, w - 2, h - 2, fill); };
  const stars = (t, n = 60, ymax = 120, seed = 0) => { for (let i = 0; i < n; i++) { const x = Math.floor(hash(i + seed) * PW), y = Math.floor(hash(i + 100 + seed) * ymax), tw = Math.sin(t * (1.5 + 2 * hash(i + 7)) + i) > 0; pset(x, y, tw ? '#FFF6DA' : '#7F78B8'); } };
  const slam = (txt, x, y, lt, size, color, o = {}) => { if (lt < 0) return; const k = 1 + .5 * Math.max(0, 1 - lt / .12); pxText(txt, x + (o.shake ? Math.round(Math.sin(lt * 70)) : 0), y, { size: size * k, color, ...o }); };
  const speed = (t, col = '#3B3758', n = 14) => { for (let i = 0; i < n; i++) { const y = Math.floor(hash(i * 3.1) * PH), x = Math.floor(((t * 600 + hash(i) * 900) % (PW + 80)) - 40); R(PW - x, y, 26 + Math.floor(hash(i + 5) * 30), 1, col); } };
  const hg = (x, y, o = {}) => heigePx(Math.round(x), Math.round(y), o);
  const feelT = (name, t, over = {}) => ({ ...feel(name, onTwos(t)), ...over });
  const emo = (t, keys, over = {}) => ({ ...emotions(onTwos(t), keys.filter(k => k[0] != null), { take: .8 }), ...over });
  // a person in silhouette (the other people in the story), walking if ph is given
  const npc = (x, y, ph = null, col = '#2A2650', hat = false) => {
    const lift = ph == null ? 0 : (Math.floor(ph * 4) % 2);
    for (const [dx, up] of [[-3, lift], [1, 1 - lift]]) R(x + dx, y - 9 - (ph == null ? 0 : up), 3, 9, col);
    R(x - 5, y - 22, 10, 14, col); R(x - 4, y - 30, 8, 8, col); if (hat) R(x - 5, y - 31, 10, 2, col);
  };
  // the office: wall, a window (day 0..1 for the sky), desk, monitor with scrolling code, wall clock
  const office = (t, o = {}) => {
    vgrad(0, PW, 0, G, [[0, '#1E1C3E'], [70, '#24224A'], [140, '#2B2856']]);
    for (let x = 0; x < PW; x += 40) R(x, 0, 1, G, '#262451');
    const day = o.day ?? 0, wx = 196, wy = 18, ww = 104, wh = 66;
    box(wx - 3, wy - 3, ww + 6, wh + 6, '#3B3758');
    const sky = day > .5 ? [[0, '#5AA4D6'], [40, '#8EC3E6']] : [[0, '#121230'], [40, '#2A2758']];
    vgrad(wx, wx + ww, wy, wy + wh, sky);
    if (day > .5) { pellipse(wx + 70, wy + 18, 7, 7, '#FFE27A'); } else { pellipse(wx + 74, wy + 16, 6, 6, '#F8E9C6'); }
    for (let i = 0; i < 9; i++) { const bx = wx + i * 12, bh = 14 + Math.floor(hash(i + 3) * 30); R(bx, wy + wh - bh, 10, bh, day > .5 ? '#6A7FB0' : '#1B1A38'); for (let j = 0; j < bh - 4; j += 5) for (let k = 2; k < 9; k += 4) if (day < .5 && hash(i * 31 + j * 7 + k) > .45) pset(bx + k, wy + wh - bh + 3 + j, '#F6B13E'); }
    R(wx + ww / 2 - 1, wy, 2, wh, '#3B3758'); R(wx, wy + wh / 2 - 1, ww, 2, '#3B3758');
    vgrad(0, PW, G, PH, [[0, '#3A2E3E'], [6, '#33283A'], [30, '#2A2132']]);
    // clock
    if (o.clock !== false) { const cx = 46, cy = 40, a = o.clockSpin ?? 0; pellipse(cx, cy, 13, 13, '#141026'); pellipse(cx, cy, 11, 11, '#F4F0FF'); pline(cx, cy, cx + Math.sin(a) * 9, cy - Math.cos(a) * 9, '#141026'); pline(cx, cy, cx + Math.sin(a / 12) * 6, cy - Math.cos(a / 12) * 6, '#F0384E'); }
    // desk and monitor
    const dx = o.deskX ?? 120;
    R(dx - 50, G - 32, 120, 6, '#5A4485'); R(dx - 50, G - 26, 120, 2, '#3B2F6B'); R(dx - 46, G - 26, 4, 26, '#3B2F6B'); R(dx + 62, G - 26, 4, 26, '#3B2F6B');
    box(dx + 4, G - 78, 60, 42, '#0E1B2E'); R(dx + 30, G - 36, 8, 4, '#2C2B3D');
    for (let i = 0; i < 8; i++) { const ln = (i + Math.floor(t * 6)) % 12, w = 8 + Math.floor(hash(ln) * 38); R(dx + 8 + Math.floor(hash(ln + 50) * 6), G - 74 + i * 5, w, 2, hash(ln + 9) > .7 ? '#F6B13E' : '#22A7D6'); }
    if (o.cups) for (let i = 0; i < o.cups; i++) { const cx = dx - 44 + (i % 6) * 8, cy = G - 38 - Math.floor(i / 6) * 7; box(cx, cy, 6, 6, '#F4F0FF'); }
  };
  const street = (t, cam = 0) => {
    vgrad(0, PW, 0, G, [[0, '#121230'], [90, '#24224F'], [140, '#3A2E66']]);
    stars(t, 40, 60);
    for (let i = -2; i < 16; i++) { const bx = i * 34 - (cam % 34) - Math.floor(cam / 34) * 0, k = i + Math.floor(cam / 34), bh = 50 + Math.floor(hash(k + 3) * 60); R(bx, G - bh, 30, bh, '#1B1A38'); for (let j = 4; j < bh - 6; j += 7) for (let q = 4; q < 28; q += 7) if (hash(k * 31 + j * 7 + q) > .55) R(bx + q, G - bh + j, 3, 3, '#F6B13E'); }
    vgrad(0, PW, G, PH, [[0, '#3B3758'], [3, '#2B2856'], [12, '#201E40']]);
    for (let i = -1; i < 5; i++) { const lx = i * 90 - (cam % 90); R(lx, G - 60, 2, 60, '#4A4570'); R(lx - 4, G - 62, 10, 3, '#4A4570'); for (let r = 0; r < 26; r++) for (let q = -r; q <= r; q++) if (hash(lx + r * 13 + q) > .7 + r / 60) pset(lx + q, G - 58 + r * 2, '#4A3B7A'); pset(lx + 1, G - 59, '#FFE27A'); }
  };
  const bedroom = (t, o = {}) => {
    vgrad(0, PW, 0, G, [[0, '#17163A'], [140, '#221F48']]);
    box(40, 20, 70, 56, '#141433'); vgrad(41, 109, 21, 75, [[0, '#0E0E2A'], [54, '#1E1C46']]); pellipse(88, 36, 6, 6, '#F8E9C6'); R(74, 20, 2, 56, '#2B2856');
    vgrad(0, PW, G, PH, [[0, '#2B2240'], [30, '#221A33']]);
    R(170, G - 26, 130, 26, '#4A68B0'); R(170, G - 30, 130, 6, '#F4F0FF'); R(170, G - 40, 30, 14, '#C9C3DE'); R(166, G - 44, 4, 44, '#5A4485'); R(300, G - 34, 4, 34, '#5A4485');
    if (o.phone != null) { const buzz = o.phone ? Math.round(Math.sin(t * 60)) : 0; box(232 + buzz, G - 36, 12, 7, '#141026'); R(234 + buzz, G - 35, 8, 5, o.phone ? '#9BE3F7' : '#2B2856'); }
  };
  const serverRoom = (t, cam = 0) => {
    vgrad(0, PW, 0, PH, [[0, '#0E1024'], [120, '#161838'], [180, '#1C1E44']]);
    for (let i = 0; i < 7; i++) { const x = 16 + i * 44 - cam; box(x, 30, 34, G - 30, '#1B1A2B', '#2C2B3D'); for (let j = 0; j < 14; j++) { R(x + 4, 36 + j * 8, 26, 5, '#24233A'); if (Math.sin(t * (3 + hash(i * 9 + j) * 6) + j) > 0) pset(x + 6 + (j % 3) * 3, 38 + j * 8, hash(i + j) > .5 ? '#22A7D6' : '#F6B13E'); } }
    vgrad(0, PW, G, PH, [[0, '#2C2B3D'], [30, '#1B1A2B']]);
  };
  const voidSet = (t, glow = '#4A3B7A') => {
    vgrad(0, PW, 0, PH, [[0, '#0B0A1E'], [110, '#16143A'], [180, '#221C4A']]);
    stars(t, 90, 150, 7);
    for (let x = 0; x < PW; x += 16) pline(PW / 2, G - 20, x * 2 - PW / 2, PH, '#2B2558');
    for (let y = G; y < PH; y += 6) R(0, y, PW, 1, glow);
  };
  const exam = (t, o = {}) => {
    vgrad(0, PW, 0, G, [[0, '#2A2448'], [140, '#322B52']]);
    box(30, 12, 260, 52, '#22303A', '#5A4485'); for (let i = 0; i < 3; i++) R(40 + i * 80, 64, 50, 2, '#C9C3DE');
    vgrad(0, PW, G, PH, [[0, '#4A3A40'], [30, '#3A2E33']]);
    for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) { const x = 14 + i * 52 + r * 20, y = G - 6 + r * 18; R(x, y - 10, 34, 4, '#8A5A3C'); R(x + 2, y - 6, 2, 10, '#5A3A2C'); R(x + 30, y - 6, 2, 10, '#5A3A2C'); box(x + 10, y - 12, 12, 3, '#F4F0FF'); }
  };
  const throne = (t) => {
    vgrad(0, PW, 0, G, [[0, '#2A1630'], [140, '#3A1E3A']]);
    for (let i = 0; i < 6; i++) { R(20 + i * 56, 0, 10, G, '#3A2442'); R(18 + i * 56, 0, 14, 4, '#F6B13E'); }
    vgrad(0, PW, G, PH, [[0, '#4A2A3A'], [30, '#331C2A']]); R(130, G, 60, PH - G, '#A61F35');
    box(132, G - 70, 56, 70, '#F6B13E', '#8A5A3C'); R(140, G - 60, 40, 40, '#A61F35');
  };
  const bar = (t) => {
    vgrad(0, PW, 0, G, [[0, '#2A1A22'], [140, '#3A2228']]);
    for (let s = 0; s < 3; s++) { R(0, 24 + s * 26, PW, 3, '#5A3A2C'); for (let i = 0; i < 22; i++) { const h = 8 + Math.floor(hash(i + s * 30) * 10); R(8 + i * 14, 24 + s * 26 - h, 5, h, ['#F6B13E', '#A61F35', '#8F6CC8', '#C08A5C'][Math.floor(hash(i * 7 + s) * 4)]); } }
    vgrad(0, PW, G, PH, [[0, '#2A1A1A'], [30, '#1E1212']]);
    R(0, G - 30, PW, 30, '#5A3A2C'); R(0, G - 32, PW, 3, '#8A5A3C');
    for (let i = 0; i < 40; i++) { const x = Math.floor(hash(i) * PW), y = Math.floor(hash(i + 3) * 80); if (Math.sin(t * 2 + i) > .6) pset(x, y, '#FFE7A6'); }
  };
  const hill = t => { pxNight.sky(t); pxNight.hills(t); pxNight.fireflies(t); };
  const ground = x => pxNight.hillTop(x);
  // close-ups: a 160 × 90 canvas, a plain backdrop (rays for drama), 黑哥 from the waist up
  const closeBg = (col1, col2, t, rays = false) => { vgrad(0, PW, 0, PH, [[0, col1], [90, col2]]); if (rays) for (let i = 0; i < 24; i++) { const a = i / 24 * TAU + t * .2; for (let r = 20; r < 120; r += 2) if (i % 2) pset(Math.round(PW / 2 + Math.cos(a) * r), Math.round(PH / 2 + Math.sin(a) * r), col2); } };
  const icon = (n, cx, cy, s = 2, tint) => pxIcon(n, Math.round(cx - 6 * s), Math.round(cy - 6 * s), s, tint);

  // ---------- the shots ----------
  const S = [];
  const shot = (ph, draw, o = {}) => S.push({ ph, draw, res: o.res || [320, 180], in: o.in || { type: 'dissolve', dur: .35 }, lead: o.lead ?? .15 });
  // 1. the office at night, ten years go by on the calendar
  shot(null, (lt, t) => {
    office(t, { clockSpin: t * 4 });
    const flips = Math.min(10, Math.max(0, Math.floor(since(t, '干了整整十年') * 9)));
    box(150, 26, 34, 30, '#F4F0FF'); R(151, 27, 32, 7, '#F0384E');
    pxText(String(2016 + flips), 167, 44, { size: 8, color: '#2C2B3D', stroke: false });
    const typing = Math.floor(t * 8) % 2;
    hg(94, G, { ...feelT('neutral', t), view: 'back', poseL: typing ? 'low' : 'down', poseR: typing ? 'down' : 'low' });
  }, { in: { type: 'cut' } });
  // 2. close-up: the epiphany, then 邪门
  shot('前几天他跟我说', (lt, t) => {
    const xm = after(t, '纯粹是');
    closeBg(xm ? '#3A0E1E' : '#1C1A40', xm ? '#6A1830' : '#2B2558', t, true);
    hg(80, 104, emo(t, [[0, 'neutral'], [at('顿悟'), 'idea'], [at('这个行业哪是'), 'suspicious'], [at('纯粹是'), 'furious']]));
    if (xm) { slam('邪门', 80, 22, since(t, '邪门#1'), 22, '#F0384E', { shake: true }); }
  }, { res: [160, 90], in: { type: 'iris', dur: .45, x: 700, y: 520 } });
  // 3. the narrator on the hill: "来，我给你们盘盘"
  shot('有人问哪里', (lt, t) => {
    hill(t);
    hg(160, ground(160), emo(t, [[0, 'confused'], [at('我给你们盘盘'), 'cool']]));
  }, { in: { type: 'wipe', dur: .4 } });
  // 4. the void: three pillars rise, become the impossible triangle, three weights land on him
  shot('三个维度', (lt, t) => {
    voidSet(t);
    const P = [['工作强度#1', 'bolt', 70, '工作强度'], ['持续学习#1', 'book', 160, '持续学习'], ['稳定程度#1', 'shield', 250, '稳定程度']];
    const tri = after(t, '不可能三角'), redAll = after(t, '工作强度极大');
    const spin = tri ? since(t, '不可能三角') : 0;
    P.forEach(([ph, ic, x, lab], i) => {
      if (!after(t, ph, -.05)) return;
      const rise = clamp(since(t, ph) / .5), fallen = after(t, '能占两样') && !tri && i === 2;
      let cx = x, cy = 70 + (1 - ease(rise)) * 60;
      if (tri) { const a = -Math.PI / 2 + i * TAU / 3 + spin * .8; cx = 160 + Math.cos(a) * 58; cy = 64 + Math.sin(a) * 38; }
      if (!tri) { R(x - 8, cy + 14, 16, G - cy - 14, fallen ? '#3B3758' : '#2B2558'); R(x - 8, cy + 14, 16, 2, '#22A7D6'); }
      icon(ic, cx, cy + (fallen ? 30 : 0), 2, redAll ? '#F0384E' : fallen ? '#5A5F7E' : null);
      if (!tri) pxText(lab, x, cy + 26, { size: 7 });
    });
    if (tri) { const pts = [0, 1, 2].map(i => { const a = -Math.PI / 2 + i * TAU / 3 + spin * .8; return [160 + Math.cos(a) * 58, 64 + Math.sin(a) * 38]; }); for (let i = 0; i < 3; i++) pline(...pts[i], ...pts[(i + 1) % 3], redAll ? '#F0384E' : '#F6B13E'); if (!redAll) pxText('不可能三角', 160, 120, { size: 9, color: '#F6B13E' }); }
    if (redAll && Math.floor(t * 10) % 3 === 0) for (let i = 0; i < 12; i++) pline(150 + i, 0, 160 + (hash(i + Math.floor(t * 10)) - .5) * 60, 64, '#FFE27A');
    // three weights: 既要 又要 还要, each squashing him a little more
    const W = [['既要', '#F6B13E'], ['又要', '#9BE3F7'], ['还要', '#FF8C9A']], landed = W.filter(([w]) => after(t, w)).length;
    hg(160, G + 2, { ...emo(t, [[0, 'thinking'], [at('能占两样'), 'proud'], [at('但这帮码农'), 'surprised'], [at('工作强度极大'), 'angry'], [at('用我朋友的话说'), 'mischief'], [at('既要'), 'ko']]), sq: landed * .08 });
    W.forEach(([w, c], i) => { if (!after(t, w, -.25)) return; const d = ease(clamp((t - at(w) + .25) / .25)), y = Math.round(lerp(-20, 50 + landed * 8 - i * 10, d)); box(136, y - 5, 48, 10, '#2B2558', c); pxText(w, 160, y, { size: 6, color: c }); });
  }, { in: { type: 'iris', dur: .5 } });
  // 5. title 01
  const title = (n, txt, ic, col) => (lt, t) => { voidSet(t, '#3A2E66'); speed(t, '#3B3758'); const k = ease(clamp(lt / .3)); icon(ic, 160, 70, 4); pxText(n, lerp(-40, 160, k), 116, { size: 12, color: col }); pxText(txt, lerp(360, 160, k), 136, { size: 18 }); };
  shot('先说第一个', title('01', '工作强度', 'bolt', '#F6B13E'), { in: { type: 'slide', dur: .3 } });
  // 6. office time-lapse: days and nights fly by the window, coffee cups pile up
  shot('很多人可能根本无法想象', (lt, t) => {
    const day = (Math.floor(lt * 3) % 2) ? 1 : 0;
    office(t, { day, clockSpin: lt * 30, cups: Math.min(18, Math.floor(lt * 3)) });
    const typing = Math.floor(t * 16) % 2;
    hg(94, G, { ...emo(t, [[0, 'scared'], [at('原话是这么说的'), 'dizzy']]), view: 'back', poseL: typing ? 'low' : 'down', poseR: typing ? 'down' : 'low' });
  }, { in: { type: 'dissolve', dur: .4 } });
  // 7. close-up: the resume, 10 years stamped 15
  shot('哥们儿我干了十年码农', (lt, t) => {
    closeBg('#2B2558', '#1C1A40', t);
    box(36, 10, 88, 74, '#F4F0FF', '#8C88A6'); for (let i = 0; i < 4; i++) R(44, 20 + i * 6, 40 + (i % 2) * 24, 2, '#C9C3DE');
    pxText('简历', 50, 15, { size: 5, color: '#2C2B3D', stroke: false });
    pxText('工作经验', 80, 52, { size: 7, color: '#2C2B3D', stroke: false });
    const st = since(t, '十五年');
    pxText('10 年', 80, 68, { size: 11, color: st >= 0 ? '#8C88A6' : '#2C2B3D', stroke: false });
    if (st >= 0) { slam('15 年', 104, 70, st, 12, '#F0384E', { stroke: true }); for (let i = 0; i < 3; i++) pline(64, 66 + i, 96, 70 + i, '#F0384E'); }
  }, { res: [160, 90], in: { type: 'iris', dur: .4 } });
  // 8. "多出来的五年哪来的？全他妈是加班" : he spins, the clock races
  shot('多出来的五年', (lt, t) => {
    office(t, { day: Math.floor(lt * 5) % 2, clockSpin: lt * 60, cups: 18 });
    const mad = after(t, '全他妈是加班');
    if (mad) speed(t, '#4A3B7A');
    hg(150, G, emo(t, [[0, 'confused'], [at('全他妈是加班'), 'furious']]));
    if (mad) slam('加班', 250, 120, since(t, '全他妈是加班'), 16, '#F6B13E', { shake: true });
  }, { in: { type: 'cut' } });
  // 9. the street home: everyone else goes home happy; he walks looking over his shoulder
  shot('别人下班', (lt, t) => {
    const cam = Math.floor(lt * 14); street(t, cam);
    for (let i = 0; i < 4; i++) npc(40 + i * 46 + Math.floor((lt * 20) % 46), G, lt * 2 + i * .3, '#1B1A38');
    const walking = !after(t, '提心吊胆', .3);
    hg(210, G, { ...emo(t, [[0, 'neutral'], [at('提心吊胆'), 'nervous']]), view: walking ? 'side' : 'q', flip: !walking, walk: walking ? lt * 1.4 : null, emote: after(t, '提心吊胆') ? 'sweat' : null, emoteK: 1 });
  }, { in: { type: 'wipe', dur: .4 } });
  // 10. home in bed: his soul floats out and flies back to the server room
  shot('身体是回家了', (lt, t) => {
    if (lt < 2.2) {
      bedroom(t);
      hg(140, G, { ...feelT('sleepy', t), poseL: 'down', poseR: 'down' });
      const k = clamp(lt / 2), gx = lerp(140, 60, k), gy = lerp(60, 40, k) + Math.sin(lt * 6) * 2;
      icon('ghost', gx, gy, 2);
    } else {
      serverRoom(t, Math.floor((lt - 2.2) * 6));
      const k = clamp((lt - 2.2) / 1.4); icon('ghost', lerp(-10, 150, ease(k)), 70 + Math.sin(lt * 5) * 3, 2);
      if (k >= 1) pxText('魂挂在服务器上', 160, 140, { size: 9, color: '#9BE3F7' });
    }
  }, { in: { type: 'dissolve', dur: .4 } });
  // 11. midnight: the phone buzzes and a Bug crawls out of it
  shot('你永远不知道', (lt, t) => {
    const ring = after(t, '诡异的', -.3), bugOut = after(t, '诡异的');
    bedroom(t, { phone: ring });
    if (Math.floor(t * 4) % 2 && ring) R(0, 0, PW, 2, '#F0384E');
    const bk = bugOut ? clamp(since(t, '诡异的') / 1.2) : 0;
    if (bugOut) icon('bug', 238 - bk * 40, G - 50 - bk * 30, 1 + Math.floor(bk * 4), null);
    const j = jump(onTwos(t), at('诡异的') ?? 999, (at('诡异的') ?? 999) + .45, 3);
    hg(110, G, { ...emo(t, [[0, 'sleepy'], [at('诡异的'), 'scared'], [at('惊喜'), 'surprised']]), dy: j.dy, sq: j.sq });
    if (after(t, '惊喜')) slam('惊喜', 230, 40, since(t, '惊喜'), 14, '#F0384E', { shake: true });
  }, { in: { type: 'iris', dur: .5, x: 1400, y: 760 } });
  // 12. the mind cracks
  shot('精神状态', (lt, t) => {
    closeBg('#1C1A40', '#2B2558', t, true);
    hg(80, 104, feelT('ko', t));
    const c = clamp(lt / .6); for (let i = 0; i < 6; i++) { const a = i * 1.1; pline(80, 45, 80 + Math.cos(a) * 90 * c, 45 + Math.sin(a) * 60 * c, '#F4F0FF'); }
    slam('崩溃边缘', 80, 12, lt - .3, 11, '#F6B13E', { shake: true });
  }, { res: [160, 90], in: { type: 'glitch', dur: .35 } });
  // 13. title 02
  shot('再说第二个', title('02', '持续学习', 'book', '#9BE3F7'), { in: { type: 'slide', dur: .3 } });
  // 14. other trades learn to do less; he learns to keep working (split screen)
  shot('按理说', (lt, t) => {
    office(t, { deskX: 250, clock: false });
    vgrad(0, 160, 0, PH, [[0, '#3A5A8A'], [180, '#6A8AC0']]); R(0, G, 160, PH - G, '#5A4A3A'); R(159, 0, 2, PH, '#141026');
    R(30, G - 40, 3, 40, '#8A5A3C'); R(120, G - 40, 3, 40, '#8A5A3C'); pline(33, G - 30, 120, G - 26, '#F4F0FF'); pline(33, G - 29, 120, G - 25, '#F4F0FF');
    npc(76, G - 22, null, '#2A2650'); pxText('学门手艺 少干活', 80, 30, { size: 8 });
    hg(232, G, { ...emo(t, [[0, 'neutral'], [at('为了少干活'), 'happy'], [at('继续干活'), 'angry']]), view: 'back', poseL: Math.floor(t * 10) % 2 ? 'low' : 'down' });
    if (after(t, '码农学门手艺')) pxText('码农学 为了继续干', 240, 30, { size: 8, color: '#F6B13E' });
  }, { in: { type: 'wipe', dur: .4 } });
  // 15. an HP bar over his head: learning is life support
  shot('在别的行业学习叫提升', (lt, t) => {
    voidSet(t, '#3A2E66');
    const life = after(t, '叫续命'), k = life ? clamp(since(t, '叫续命') / .8) : clamp(1 - lt * .25, .1, 1);
    hg(160, G, emo(t, [[0, 'hopeful'], [at('叫续命'), 'excited']]));
    box(120, 40, 80, 8, '#2B2558'); R(121, 41, Math.round(78 * k), 6, k < .3 ? '#F0384E' : '#F6B13E'); icon('heart', 112, 44, 1);
    if (life) { icon('book', 150 + Math.sin(lt * 8) * 2, 96, 1); slam('续命', 160, 26, since(t, '叫续命'), 14, '#F0384E'); } else pxText('提升', 160, 26, { size: 10, color: '#9BE3F7' });
  }, { in: { type: 'dissolve', dur: .35 } });
  // 16. a doctor's book lasts for centuries; his turns to dust overnight
  shot('医生看病', (lt, t) => {
    voidSet(t, '#2B2558');
    const tech = after(t, '而计算机技术呢'), gone = after(t, '过时淘汰了');
    box(140, 110, 40, 40, '#3B3758'); icon('book', 160, 96, 2, tech && gone ? '#5A5F7E' : null);
    if (!tech) pxText('几百年 吃一辈子', 160, 60, { size: 9, color: '#F6B13E' });
    if (gone) { const d = since(t, '过时淘汰了'); for (let i = 0; i < 30; i++) pset(150 + Math.floor(hash(i) * 20 + d * 40 * hash(i + 3)), 90 + Math.floor(hash(i + 7) * 12 - d * 30 * hash(i + 9)), '#8C88A6'); slam('过时淘汰', 160, 60, d, 12, '#F0384E'); }
    hg(70, G, emo(t, [[0, 'relieved'], [at('而计算机技术呢'), 'thinking'], [at('过时淘汰了'), 'scared']]));
  }, { in: { type: 'dissolve', dur: .35 } });
  // 17. a dead end: two walls close in
  shot('这就形成了一种死局', (lt, t) => {
    voidSet(t, '#3A1E3A');
    const k = ease(clamp(lt / 3));
    R(0, 0, Math.round(lerp(40, 108, k)), PH, '#2B2558'); R(PW - Math.round(lerp(40, 108, k)), 0, Math.round(lerp(40, 108, k)), PH, '#2B2558');
    pxText('焦虑', lerp(20, 54, k), 90, { size: 12, color: '#9BE3F7' }); pxText('累死', PW - lerp(20, 54, k), 90, { size: 12, color: '#FF8C9A' });
    hg(160, G, feelT('sad', t));
  }, { in: { type: 'iris', dur: .45 } });
  // 18. books rain down: binge learning
  shot('而且码农和其他行业', (lt, t) => {
    voidSet(t);
    const binge = after(t, '爆发式狂补');
    if (binge) { speed(t); for (let i = 0; i < 26; i++) { const ph = (since(t, '爆发式狂补') * (1.2 + hash(i)) + hash(i + 3)) % 1; icon('book', 20 + hash(i * 5) * 280, -10 + ph * 190, 1); } slam('爆发式狂补', 160, 24, since(t, '爆发式狂补'), 14, '#F6B13E', { shake: true }); }
    hg(160, G, emo(t, [[0, 'neutral'], [at('爆发式狂补'), 'excited']], binge ? { poseL: 'cheer', poseR: 'cheer' } : {}));
  }, { in: { type: 'dissolve', dur: .35 } });
  // 19. the AI storm, one night, sunrise: he's an Agent engineer
  shot('大家仔细想想', (lt, t) => {
    const storm = after(t, '呼啸而来'), night = after(t, '只用了一夜');
    hill(t);
    if (storm) { for (let i = 0; i < 40; i++) { const a = t * 3 + i * .5, r = 10 + i * 2; pset(Math.round(250 + Math.cos(a) * r * .5), Math.round(40 + i * 2.2 + Math.sin(a) * 4), i % 3 ? '#9BE3F7' : '#22A7D6'); } icon('chip', 250, 30, 2); }
    if (night) { const k = clamp(since(t, '只用了一夜') / 1); const a = Math.PI * (1 - k); icon(k < .5 ? 'moon' : 'sun', 160 + Math.cos(a) * 130, 110 - Math.sin(a) * 90, 2); if (k >= 1) pxText('Agent 工程师', 160, 30, { size: 12, color: '#9BE3F7' }); }
    hg(110, ground(110), emo(t, [[0, 'thinking'], [at('呼啸而来'), 'surprised'], [at('有人用一个月'), 'neutral'], [at('只用了一夜'), 'starstruck'], [at('被迫全栈'), 'dizzy']]));
    if (after(t, '被迫全栈')) { const k = since(t, '被迫全栈'); ['前端', '后端', '运维', '数据库'].forEach((w, i) => { if (k > i * .25) { const y = Math.min(48 - i * 0, 10 + (k - i * .25) * 200) - i * 11; box(84, Math.round(y), 52, 10, '#2B2558', '#F6B13E'); pxText(w, 110, Math.round(y + 5), { size: 6 }); } }); }
  }, { in: { type: 'wipe', dur: .4 } });
  // 20. into the bin with the old experience; salute, back to boot camp
  shot('不得不把你过去', (lt, t) => {
    voidSet(t, '#2B2558');
    icon('trash', 230, 128, 3);
    const k = clamp((lt - .6) / .7); if (k < 1) icon('crown', lerp(170, 230, k), lerp(90, 118, k) - Math.sin(k * Math.PI) * 30, 2);
    pxText('引以为傲的经验', 230, 80, { size: 8, color: '#C9C3DE' });
    hg(120, G, emo(t, [[0, 'sad'], [at('新兵蛋子'), 'determined']], after(t, '新兵蛋子') ? { poseR: 'fistUp' } : {}));
  }, { in: { type: 'dissolve', dur: .35 } });
  // 21. experience is only a cache: a giant delete key comes down
  shot('那一刻他彻底懂了', (lt, t) => {
    serverRoom(t);
    const fr = after(t, '一键释放'), d = fr ? since(t, '一键释放') : 0;
    if (!fr || d < .2) icon('box', 220, 110, 3); else for (let i = 0; i < 40; i++) pset(220 + Math.floor((hash(i) - .5) * 80 * d), 110 + Math.floor((hash(i + 4) - .5) * 60 * d), '#9BE3F7');
    if (after(t, '别人的阅历')) pxText('缓存', 220, 80, { size: 12, color: '#9BE3F7' });
    if (fr) { const ky = Math.min(84, -30 + d * 600); box(196, Math.round(ky), 48, 22, '#F0384E', '#141026'); pxText('DEL', 220, Math.round(ky + 11), { size: 9 }); }
    hg(100, G, emo(t, [[0, 'idea'], [at('别人的阅历'), 'thinking'], [at('一键释放'), 'furious']]));
  }, { in: { type: 'dissolve', dur: .35 } });
  // 22. job hopping = sitting the college exam again
  shot('更恐怖的还有跳槽', (lt, t) => {
    exam(t);
    const subj = [['算法#1', '算法'], ['网络协议', '网络协议'], ['操作系统', '操作系统'], ['数据库', '数据库'], ['八股文', '八股文']];
    subj.forEach(([m, w], i) => { if (after(t, m)) pxText(w, 60 + (i % 3) * 100, 26 + Math.floor(i / 3) * 18, { size: 9, color: '#F4F0FF' }); });
    if (after(t, '高考')) { slam('高考', 160, 44, since(t, '高考'), 12, '#F6B13E'); for (let i = 0; i < 16; i++) { const ph = (lt * (1 + hash(i)) + hash(i + 2)) % 1; icon('paper', 10 + hash(i * 3) * 300, ph * 160 - 10, 1); } }
    hg(160, G + 8, emo(t, [[0, 'scared'], [at('高考'), 'ko'], [at('算法#1'), 'dizzy'], [at('学习真的太累了'), 'sleepy']]));
  }, { in: { type: 'iris', dur: .45 } });
  // 23. "学习使我快乐" . . . 放屁!
  shot('有人还喜欢装', (lt, t) => {
    const p = after(t, '放屁');
    closeBg(p ? '#3A0E1E' : '#3A5A8A', p ? '#6A1830' : '#8EC3E6', t, true);
    hg(80, 104, emo(t, [[0, 'smug'], [at('放屁'), 'furious'], [at('学会了才快乐'), 'laugh']]));
    if (!p) { for (let i = 0; i < 6; i++) icon('heart', 20 + i * 24, 14 + Math.sin(lt * 4 + i) * 3, 1); pxText('学习使我快乐', 80, 80, { size: 9, color: '#141026', stroke: false }); }
    else slam('放P', 80, 24, since(t, '放屁'), 24, '#F0384E', { shake: true });
    if (after(t, '学会了才快乐')) pxText('学会了才快乐', 80, 80, { size: 9, color: '#FFE27A' });
  }, { res: [160, 90], in: { type: 'glitch', dur: .3 } });
  // 24. tangled in code, then settling into a comfortable pit
  shot('当你算法', (lt, t) => {
    hill(t);
    const pit = after(t, '跳什么槽啊');
    if (!pit) for (let i = 0; i < 80; i++) { const a = i * .7 + t * 2, r = 12 + 34 * hash(i); pset(Math.round(160 + Math.cos(a) * r * 1.3), Math.round(100 + Math.sin(a * 1.2) * r * .8), i % 4 ? '#C9C3DE' : '#F0384E'); }
    if (pit) { pellipse(160, ground(160) + 2, 34, 6, '#141026'); pxText('这坑挺好的', 160, 40, { size: 11, color: '#C9C3DE' }); }
    hg(160, ground(160) + (pit ? 22 : 0), emo(t, [[0, 'dizzy'], [at('麻痹自己'), 'relieved'], [at('跳什么槽啊'), 'relieved']]));
  }, { in: { type: 'dissolve', dur: .35 } });
  // 25. title 03
  shot('最后一个', title('03', '稳定程度', 'shield', '#FF8C9A'), { in: { type: 'slide', dur: .3 } });
  // 26. 这个最他妈邪门 (close-up, red)
  shot('这个最他妈邪门', (lt, t) => {
    closeBg('#3A0E1E', '#6A1830', t, true);
    hg(80, 104, feelT('furious', t));
    slam('最邪门', 80, 22, lt, 18, '#F0384E', { shake: true });
  }, { res: [160, 90], in: { type: 'glitch', dur: .25 } });
  // 27. crowned in any other trade . . . an old greasy stick in this one
  shot('你很难想象', (lt, t) => {
    throne(t);
    const crown = after(t, '当祖宗供起来'), oily = after(t, '被嫌弃的老油条');
    hg(160, G - 2, emo(t, [[0, 'nervous'], [at('当祖宗供起来'), 'proud'], [at('被嫌弃的老油条'), 'disgusted']]));
    if (crown && !oily) icon('crown', 160, 52 + Math.sin(lt * 4), 2);
    if (oily) { const d = since(t, '被嫌弃的老油条'); icon('crown', 160 + d * 40, 52 + d * d * 200, 2); for (let i = 0; i < 6; i++) R(140 + i * 8, 60 + ((d * 40 + i * 9) % 60), 2, 4, '#C08A5C'); slam('老油条', 260, 50, d, 14, '#C08A5C'); }
  }, { in: { type: 'dissolve', dur: .35 } });
  // 28. dragging the baggage of history, until a delete key falls on him
  shot('程序员的职业生涯', (lt, t) => {
    const cut = after(t, '优化掉'), d = cut ? since(t, '优化掉') : 0;
    street(t, Math.floor(lt * 10));
    const bag = Math.min(4, 1 + Math.floor(lt / 2));
    if (!cut || d < .25) { icon('bag', 104 - bag * 6, G - 6 * bag, bag); hg(170, G, { ...feelT('sad', t), view: 'side', walk: lt * 1.1 }); pxText('历史包袱', 104, 40, { size: 10, color: '#C08A5C' }); }
    if (cut) { const ky = Math.min(G - 30, -40 + d * 900); box(140, Math.round(ky), 60, 30, '#F0384E'); pxText('优化', 170, Math.round(ky + 15), { size: 12 }); if (d > .25) for (let i = 0; i < 30; i++) pset(170 + Math.floor((hash(i) - .5) * 120 * d), G - 10 - Math.floor(hash(i + 3) * 40 * d), '#C9C3DE'); }
  }, { in: { type: 'wipe', dur: .4 } });
  // 29. at the bar: everything fits together except him
  shot('喝到最后', (lt, t) => {
    bar(t);
    box(218, G - 44, 8, 12, '#F6B13E', '#141026'); R(219, G - 43, 6, 3, '#FFF6DA');
    const me = after(t, '竟然是他妈我');
    for (let i = 0; i < 6; i++) box(30 + i * 16, 20, 15, 15, '#4A68B0', '#22A7D6');
    pxText('系统兼容性', 74, 48, { size: 8, color: '#9BE3F7' });
    if (me) { const d = since(t, '竟然是他妈我'); box(130 + d * 20, 20 + d * d * 120, 15, 15, '#F0384E'); pxText('我', 137 + d * 20, 27 + d * d * 120, { size: 7 }); }
    hg(196, G, emo(t, [[0, 'sad'], [at('老子写了一辈子'), 'angry'], [at('竟然是他妈我'), 'cry']]));
  }, { in: { type: 'dissolve', dur: .4 } });
  // 30. rain cloud of anxiety
  shot('这就是为什么', (lt, t) => {
    hill(t);
    hg(160, ground(160), { ...feelT('nervous', t), emote: 'cloud', emoteK: 1, emoteAge: lt });
  }, { in: { type: 'dissolve', dur: .35 } });
  // 31. advice: a thorn in the heart (close-up)
  shot('所以他常说', (lt, t) => {
    closeBg('#1C1A40', '#2B2558', t);
    hg(80, 104, emo(t, [[0, 'determined'], [at('极其残酷'), 'suspicious']]));
    if (after(t, '一根刺')) { const d = clamp(since(t, '一根刺') / .3); icon('thorn', lerp(150, 92, d), lerp(10, 66, d), 1); }
  }, { res: [160, 90], in: { type: 'iris', dur: .45 } });
  // 32. he builds the future and sinks into the past
  shot('这个行业最伟大的地方', (lt, t) => {
    vgrad(0, PW, 0, G, [[0, '#2A2758'], [100, '#5A4485'], [150, '#C08A5C']]);
    const sink = after(t, '最残忍的地方') ? since(t, '最残忍的地方') : 0;
    for (let i = 0; i < 12; i++) { const h = Math.round(Math.min(1, lt / 4 + hash(i) * .3) * (40 + hash(i + 3) * 70)); R(170 + i * 12, G - h, 10, h, '#1B1A38'); for (let j = 4; j < h; j += 6) if (hash(i * 7 + j) > .4) R(172 + i * 12, G - h + j, 6, 2, '#9BE3F7'); }
    vgrad(0, PW, G, PH, [[0, '#3A2E3E'], [30, '#2A2132']]);
    hg(90, G + Math.min(60, Math.round(sink * 14)), emo(t, [[0, 'hopeful'], [at('最残忍的地方'), 'sad']]));
    R(0, G, PW, PH - G, '#2A2132');
    pxText(sink ? '自己被埋在过去' : '创造未来', sink ? 90 : 230, 30, { size: 11, color: sink ? '#C9C3DE' : '#9BE3F7' });
  }, { in: { type: 'dissolve', dur: .4 } });
  // 33. ". . . 做码农挺好." back on the hill, the wink, iris out
  shot('但话是这么说', (lt, t) => {
    hill(t);
    hg(160, ground(160), emo(t, [[0, 'neutral'], [at('做码农挺好'), 'playful']], after(t, '做码农挺好') ? { poseR: 'wave' } : {}));
    if (after(t, '做码农挺好')) slam('做码农挺好', 160, 30, since(t, '做码农挺好'), 16, '#FFE27A');
    const end = D.len - t; if (end < .8) { const r = Math.max(0, end / .8) * 220; for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) if ((x - 160) ** 2 + (y - 60) ** 2 > r * r) pset(x, y, '#0B0A1E'); }
  }, { in: { type: 'iris', dur: .5 } });

  // resolve times: each shot starts a little before its phrase, ends where the next begins
  const shots = S.map(s => ({ ...s, t0: s.ph ? Math.max(0, at(s.ph) - s.lead) : 0 }));
  for (let i = 0; i < shots.length; i++) shots[i].t1 = i + 1 < shots.length ? shots[i + 1].t0 : D.len;
  const subtitle = (c, t) => {
    for (const [a, b, txt] of D.cues) if (t >= a && t < b) {
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.font = '900 62px "PingFang SC", sans-serif';
      c.lineWidth = 12; c.strokeStyle = '#0E0B1E'; c.strokeText(txt, 960, 1010); c.fillStyle = '#FFFFFF'; c.fillText(txt, 960, 1010); break;
    }
  };
  LOOPS.pxManong2 = () => {};
  Object.assign(LOOPS.pxManong2, { len: D.len, film: { shots, subtitle } });
  window.MANONG2_SHOTS = shots.map(s => [s.ph, s.t0, s.t1]);
})();
