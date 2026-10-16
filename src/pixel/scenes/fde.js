// pixel/scenes/fde.js: 「FDE 免费演示工程师」 as a 像素游戏动画 (pixel game animation), second cut: the pixel book-talk
// stage of manong3.js pushed into a film. Over the pixels runs the fx2 layer (src/pixel/fx2.js): kinetic type smashed
// onto the screen on every big line, particles (confetti, embers, welding sparks, coins, shards), god rays, speed lines,
// bokeh, bloom, a colour grade per chapter, letterbox bars on the quiet beats, dutch tilts on the hits, and pixelate,
// whip and zoom-through transitions. 黑哥 hosts and plays the boss and the client; Clawd plays the PM friend; DeepSeek
// works the night shift with him.
//   node render.mjs --page=pixel.html --loop=pxFde --clip --fps=24 --out=out/video/fde/picture.mp4
(() => {
  if (!window.FDE) return;
  const D = FDE, K = pxGame(D);
  const { at, after, since, R, GOLD, GOLDL, GOLDD, INK, CARD, CREAM, RED, PINK, SKY, vgrad, box, out3, pop, over, kick, ramp, vlen, hg, cl, ds, feelT, emo, icon, typing, walker, sparkle, frame, chip, chipL, stamp, card, spot, curtain, curtainCloth, darkStage, sunburst, hall, pedestal, office, desk, bedroom, serverRoom, examHall, examDesks, bar, barTop, street, npc, hp, cloud, charCard, shot, push, title } = K;
  const ORANGE = '#FF8A3A', SUIT = '#2A2238', BROWN = '#8A5A3C';
  // kinetic type on a phrase: slam('上岸！', t, '上岸#1', { ... }) (nothing before the phrase is said)
  const slam = (txt, t, ph, o = {}) => { const l = since(t, ph) - (o.delay ?? 0); if (at(ph) != null && l >= 0) fx2Slam(txt, l, o); };
  const burst = (kind, t, ph, o = {}) => { if (at(ph) != null) fx2Burst(kind, since(t, ph) - (o.delay ?? 0), o); };
  const roll = (t, ph, r, dur = 1.2) => { const l = since(t, ph); if (at(ph) != null && l >= 0) fx2Roll(r * Math.max(0, 1 - l / dur)); };
  const stageFx = (t, o = {}) => { fx2Bokeh(t, { n: o.n ?? 12, a: o.a ?? .13 }); };

  // ---------- props for this story ----------
  const flames = (x, y, w, h, t) => { for (let i = 0; i < w; i++) { const hh = Math.round(h * (.4 + .6 * Math.abs(Math.sin(t * 7 + i * .9 + hash(i) * 6)))); R(x + i, y - hh, 1, hh, RED); const h2 = Math.round(hh * .6); R(x + i, y - h2, 1, h2, ORANGE); const h3 = Math.round(hh * .25); R(x + i, y - h3, 1, h3, GOLDL); } };
  const pit = (cx, t, w = 60) => { pellipse(cx, FLOOR + 2, w / 2 + 3, 8, INK); pellipse(cx, FLOOR + 2, w / 2, 6, '#2A0A0A'); flames(cx - w / 2 + 4, FLOOR + 4, w - 8, 26, t); };
  const stall = (cx, t, o = {}) => {
    const y = o.y ?? FLOOR;
    for (let k = 0; k < 10; k++) R(cx - 40 + k * 8, y - 66, 8, 9, k % 2 ? CREAM : RED);
    for (let k = 0; k < 10; k++) pellipse(cx - 36 + k * 8, y - 57, 4, 2, k % 2 ? CREAM : RED);
    R(cx - 38, y - 57, 2, 32, '#5A3A2C'); R(cx + 36, y - 57, 2, 32, '#5A3A2C');
    box(cx - 40, y - 26, 80, 26, '#8A4A3A'); R(cx - 39, y - 25, 78, 1, '#B8705A');
    if (o.sign !== false) { frame(cx - 26, y - 20, 52, 14, { fill: CREAM }); pxText(o.sign || '免费试吃', cx, y - 13, { size: 5.5, color: RED, stroke: false }); }
    const n = o.slices ?? 5; for (let j = 0; j < n; j++) { pellipse(cx - 18 + j * 9, y - 29, 3, 2, '#C0483A'); R(cx - 18 + j * 9, y - 33, 1, 3, CREAM); }
  };
  const coin = (x, y) => { pellipse(x, y, 4, 4, GOLDD); pellipse(x, y, 3, 3, GOLD); R(Math.round(x) - 1, Math.round(y) - 2, 1, 3, GOLDL); };
  // a little Clawd face for avatars and screens
  const face = (x, y, s = 1) => { R(x, y, 12 * s, 8 * s, '#E07850'); R(x + s, y + s, 10 * s, 1 * s, '#F09A70'); R(x + 3 * s, y + 3 * s, 2 * s, 1 * s, INK); R(x + 7 * s, y + 3 * s, 2 * s, 1 * s, INK); R(x + 5 * s, y + 6 * s, 2 * s, 1 * s, INK); };
  // a feed post on a phone screen, close up (160 × 90): avatar, name, a big caption, a row of likes; del crumbles it
  const post = (cx, cy, txt, t, o = {}) => {
    box(cx - 42, cy - 40, 84, 80, '#1A1420'); R(cx - 38, cy - 35, 76, 70, CREAM); R(cx - 8, cy - 38, 16, 2, '#3A3040');
    const del = o.del ?? 0, sh = Math.round(del * del * 60);
    if (del < 1) {
      R(cx - 38, cy - 35, 76, 9, '#E8DCC0'); pxText('朋友圈', cx, cy - 31, { size: 4, color: INK, stroke: false });
      face(cx - 34, cy - 22 + sh, 1); pxText('产品经理朋友', cx - 6, cy - 19 + sh, { size: 3.5, color: '#5A4A6A', stroke: false });
      if (txt) pxText(txt, cx, cy + 2 + sh, { size: 12, color: RED, stroke: false });
      const n = o.likes || 0; for (let i = 0; i < Math.min(8, Math.ceil(n / 12)); i++) icon('heart', cx - 30 + i * 8, cy + 24 + sh, 1);
      if (n) pxText(`${n}`, cx + 32, cy + 24 + sh, { size: 4, color: INK, stroke: false });
    }
    if (del > 0) for (let i = 0; i < 60; i++) pset(cx - 34 + Math.floor(hash(i) * 68), cy - 20 + Math.floor(hash(i + 5) * 40 + del * 60 * hash(i + 9)), del < .9 ? '#8C88A6' : CREAM);
  };
  const calendar = (x, y, days, t) => {
    frame(x, y, 200, 70, { title: '这周', fill: CREAM });
    const W = (200 - 14) / days.length;
    days.forEach(([d, word, col, on], i) => { const cx = x + 7 + W * i + W / 2; R(Math.round(x + 7 + W * i), y + 12, 1, 50, '#D8C8A8'); pxText(d, cx, y + 18, { size: 6, color: INK, stroke: false }); if (on > 0) { const k = pop(on, .2); R(Math.round(cx - W / 2 + 2), y + 26, Math.round(W - 4), Math.round(30 * k), col === RED ? '#FFD8D0' : '#F0E4C8'); pxText(word, cx, y + 40 - Math.round((1 - k) * 8), { size: 11, color: col, stroke: false }); } });
  };
  const wheel = (cx, cy, r, t, sp) => { for (let a = 0; a < TAU; a += .02) { pset(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), GOLD); pset(Math.round(cx + Math.cos(a) * (r - 1)), Math.round(cy + Math.sin(a) * (r - 1)), GOLDD); } for (let k = 0; k < 8; k++) { const a = t * sp + k * TAU / 8; pline(cx, cy, cx + Math.cos(a) * r, cy + Math.sin(a) * r, '#6A4A2A'); } R(cx - 3, cy - 3, 6, 6, GOLDL); R(cx - 2, cy, 4, r + 8, '#5A3A2C'); };
  const bubble = (cx, cy, r, word, t, burstT) => {
    if (burstT < 0) { const rr = r + Math.sin(t * 4) * 2; for (let a = 0; a < TAU; a += .02) { const c = Math.sin(a * 3 + t * 2) > .3 ? PINK : Math.sin(a * 2 - t) > 0 ? SKY : '#C8A8FF'; pset(Math.round(cx + Math.cos(a) * rr), Math.round(cy + Math.sin(a) * rr * .92), c); } pellipse(cx - rr * .4, cy - rr * .45, 6, 3, CREAM); pellipse(cx - rr * .55, cy - rr * .25, 2, 2, CREAM); pxText(word, cx, cy, { size: 14, color: SKY }); }
  };
  const parachute = (cx, top) => { for (let k = 0; k < 7; k++) pellipse(cx - 18 + k * 6, top + 6, 4, 6, k % 2 ? CREAM : RED); R(cx - 21, top + 8, 42, 3, CREAM); for (let k = 0; k < 4; k++) pline(cx - 20 + k * 13, top + 10, cx - 6 + k * 4, top + 34, '#D8C8A8'); };
  const plane = (x, y) => { box(x - 26, y, 52, 10, '#5A5068'); R(x - 10, y - 6, 18, 22, '#4A4058'); R(x + 22, y - 6, 4, 8, '#4A4058'); R(x - 22, y + 3, 6, 2, '#FFD86A'); };
  const mall = (t, scroll = 0) => {
    vgrad(0, PW, 0, FLOOR, [[0, '#2A1C2A'], [FLOOR, '#6A4A4A']]);
    for (let i = -1; i < 9; i++) { const x = Math.round(i * 44 - (scroll % 44)); R(x, 18, 34, 70, '#3A2A3A'); R(x + 2, 20, 30, 66, '#4A3448'); R(x + 4, 22, 26, 5, i % 2 ? GOLD : PINK); for (let j = 0; j < 3; j++) R(x + 6 + j * 8, 34, 6, 6, '#FFD8A0'); }
    for (let i = 0; i < 16; i++) { const x = Math.round((i * 24 - scroll * .5) % 400 + 400) % 400 - 40; pellipse(x, 12, 3, 2, '#FFF1C9'); }
    vgrad(0, PW, FLOOR, PH, [[0, '#9A8A7A'], [30, '#5A4A3A']]); for (let x = 0; x < PW; x += 20) R(Math.round(x - scroll % 20), FLOOR + 6, 1, 24, '#8A7A6A');
  };

  // ================= 开场：上岸 =================
  shot(null, (lt, t) => {
    curtain(t, 0); spot(130, t, { a: .38 }); spot(220, t, { a: .3 }); stageFx(t);
    hg(130, FLOOR, { ...feelT('happy', t), poseR: 'wave' });
    if (lt > .5) chip('主持 · 黑哥', 130, 50, GOLDL, 6);
    const k = since(t, '产品经理的朋友');
    if (k >= 0) { const x = lerp(340, 220, out3(k / .6)); cl(x, FLOOR, k < .6 ? { ...feelT('neutral', t), view: 'side', walk: x / 10, flip: true } : feelT('happy', t)); if (k > .6) chip('产品经理朋友', 220, 92, CREAM, 6); if (k < .7) fx2Streaks(t, 1 - k / .7, { n: 14 }); burst('dust', t, '产品经理的朋友', { at: [220, FLOOR], delay: .6, n: 10, speed: 300, arc: 1.2, life: .8 }); }
    curtainCloth(t, clamp((lt - .1) / .7));
    if (lt < 1.4) fx2Rays(960, -40, t, { a: .2 * (1 - lt / 1.4), col: [255, 230, 170] });
  }, { grade: 'warm', in: { type: 'cut' }, cam: (lt, t) => [ramp(t, [[0, 130], [at('产品经理的朋友') ?? 2, 130], [(at('产品经理的朋友') ?? 2) + .6, 176]]), 110, ramp(t, [[0, 1.3], [at('产品经理的朋友') ?? 2, 1.2], [(at('产品经理的朋友') ?? 2) + .6, 1.1]])] });
  shot('去年底费了', (lt, t) => { charCard(t, lt, (x, y) => cl(x, y, feelT('determined', t)), '产品经理朋友', ['Clawd 饰', '转岗 FDE', '九牛二虎之力'], ['#5A1420', '#7A1C2A']); fx2Burst('star', lt - .1, { x: 528, y: 520, n: 24, speed: 900, life: 1.2 }); fx2Rays(528, 560, t, { a: .18, col: [255, 200, 150] }); }, { res: [160, 90], grade: 'warm', in: { type: 'whip', dur: .3 }, cam: push(80, 45, 1.0, 1.08) });
  // pushing the boulder up at sunset . . . the offer lands, gold everywhere
  shot('九牛二虎之力', (lt, t) => {
    vgrad(0, PW, 0, PH, [[0, '#2A1440'], [80, '#B8505A'], [PH, '#FFB070']]);
    pellipse(250, 70, 30, 30, '#FFD890'); pellipse(250, 70, 24, 24, '#FFF1C9');
    for (let x = 0; x < PW; x++) { const y = Math.round(160 - x * .32); R(x, y, 1, PH - y, '#3A2418'); R(x, y, 1, 1, '#8A5038'); }
    const got = since(t, '拿到了一个'), k = got < 0 ? clamp(lt / 3) * .55 : .55 + out3(got / .6) * .45, bx = lerp(70, 250, k), by = 160 - bx * .32;
    if (got < 0) { pellipse(bx + 18, by - 14, 16, 14, '#5A4A4A'); pellipse(bx + 14, by - 18, 6, 4, '#7A6A6A'); cl(bx - 8, by, { ...feelT('determined', t), view: 'side', walk: lt * 1.4, emote: 'sweat', emoteK: 1, aL: 1.2, aR: 1.2 }); fx2Bars(1); if (Math.floor(lt * 3) % 2) fx2Burst('dust', (lt * 3 % 1) / 3, { at: [bx + 4, by], n: 6, speed: 200, arc: 1, dir: Math.PI, life: .5 }); }
    else { cl(bx, by, { ...feelT('starstruck', t), dy: -Math.round(Math.sin(clamp(got / .5) * Math.PI) * 10), aL: 1.4, aR: 1.4 }); const fy = lerp(-20, by - 58, out3(got / .5)); frame(bx - 24, fy - 12, 48, 24, { fill: CREAM }); pxText('FDE offer', bx, fy, { size: 6, color: INK, stroke: false }); pxFx({ type: 'glow', x: bx, y: fy, r: 40, a: .55 }); fx2Rays([bx, fy], 0, t, { a: .28 }); fx2Bars(Math.max(0, 1 - got * 2)); }
    burst('coin', t, '拿到了一个', { at: [bx, by - 58], delay: .4, n: 26, speed: 1100, life: 1.8 });
    slam('拿到 offer！', t, '拿到了一个', { delay: .45, y: 230, size: 120, pal: 'gold', out: 2.2 });
  }, { grade: 'warm', bloom: .6, in: { type: 'wipe', dur: .3 }, cam: (lt, t) => { const got = since(t, '拿到了一个'), k = got < 0 ? clamp(lt / 3) * .55 : .55 + out3(got / .6) * .45, bx = lerp(70, 250, k); return [bx, 160 - bx * .32 - 30, got < 0 ? 1.45 : 1.25]; } });
  // that night: a close-up of the phone, a two-word post, likes pouring in, confetti
  shot('拿到那天晚上', (lt, t) => {
    if (lt < 1.2 && !after(t, '上岸#1', -.3)) { bedroom(t, { phone: true }); cl(226, FLOOR - 24, { ...feelT('excited', t), aR: 1.3 }); return; }
    vgrad(0, PW, 0, PH, [[0, '#120A20'], [PH, '#2A1440']]);
    const up = since(t, '上岸#1');
    pxFx({ type: 'glow', x: 80, y: 45, r: 50, a: .35, col: '#FFF1C9' });
    post(80, 45, up >= 0 ? '上岸！' : '', t, { likes: up >= 0 ? Math.min(99, Math.floor(up * 40)) : 0 });
    if (up >= 0) { fx2Slam('上岸！', up, { y: 300, size: 240, flash: .5, out: 2.2 }); fx2Burst('confetti', up, { x: 960, y: 420, n: 110, speed: 1700, life: 2.4 }); fx2Stream('heart', t, { x: 1500, y: 1000, w: 600, h: 800, n: 16 }); fx2Rays(960, 300, t, { a: .22 }); }
  }, { res: [160, 90], grade: 'dream', bloom: .55, in: { type: 'zoom', dur: .4, x: 1356, y: 760 }, cam: (lt, t) => [80, 45, ramp(t, [[at('拿到那天晚上'), 1.02], [at('上岸#1'), 1.1], [at('上岸#1') + .3, 1.25]])] });
  // half a year later: the same post, cold light, it crumbles into the bin
  shot('结果才干了半年', (lt, t) => {
    vgrad(0, PW, 0, PH, [[0, '#0A0A14'], [PH, '#1A1A2A']]);
    const del = since(t, '给删了');
    post(70, 45, '上岸！', t, { likes: 99, del: del < 0 ? 0 : clamp(del / .8) });
    chip(del < 0 ? '半年后' : '已删除', 130, 14, del < 0 ? CREAM : PINK, 6);
    if (del >= 0) { icon('trash', 130, 66, 2); burst('shard', t, '给删了', { at: [70, 45], n: 40, speed: 700, life: 1.4, col: '#C8C0D8' }); }
    fx2Bars(1);
  }, { res: [160, 90], grade: 'cold', bloom: .3, in: { type: 'pixelate', dur: .7 }, cam: push(80, 45, 1.05, 1.2) });
  // out of one fire pit into another
  shot('因为他发现', (lt, t) => {
    vgrad(0, PW, 0, FLOOR, [[0, '#1A0A0E'], [FLOOR, '#5A1418']]); vgrad(0, PW, FLOOR, PH, [[0, '#2A1A10'], [30, '#140C08']]);
    pit(90, t); pit(230, t);
    pxFx({ type: 'glow', x: 90, y: FLOOR, r: 60, a: .4, col: '#FF7A3A' }); pxFx({ type: 'glow', x: 230, y: FLOOR, r: 60, a: .4, col: '#FF7A3A' });
    const hop = since(t, '跳进了'), k = clamp(hop / .7);
    const x = hop < 0 ? 90 : lerp(90, 230, k), y = hop < 0 ? FLOOR - 2 + Math.round(Math.sin(t * 8)) : FLOOR - 2 - Math.round(Math.sin(k * Math.PI) * 60);
    cl(x, y, emo(t, [[0, 'scared'], [at('上岸#2'), 'angry'], [at('跳进了'), 'surprised'], [at('另一个火坑'), 'ko']], { emote: 'sweat', emoteK: 1 }));
    fx2Stream('ember', t, { n: 80, y: 1080, h: 1000, w: 1900, speed: .5 });
    slam('上岸？', t, '上岸#2', { size: 120, pal: 'cream', y: 260, out: (at('跳进了') ?? 99) - (at('上岸#2') ?? 0), burst: false, hit: .3 });
    if (after(t, '另一个火坑')) { const l = since(t, '另一个火坑'); fx2Slam('另一个火坑', l, { pal: 'red', y: 300, size: 170, stagger: .06, flash: .4 }); fx2Speed(960, 540, t, Math.max(0, 1 - l)); fx2Roll(-.06 * Math.max(0, 1 - l * .5)); fx2Burst('spark', l, { at: [230, FLOOR], n: 70, speed: 1700, arc: 2, life: 1.2 }); }
  }, { grade: 'fire', bloom: .6, in: { type: 'glitch', dur: .3 }, cam: (lt, t) => [ramp(t, [[at('因为他发现'), 90], [at('跳进了'), 90], [at('跳进了') + .7, 180]]), ramp(t, [[at('跳进了'), 100], [at('跳进了') + .7, 96]]), ramp(t, [[at('因为他发现'), 1.4], [at('跳进了'), 1.3], [at('跳进了') + .7, 1.1], [at('另一个火坑'), 1.25]])] });

  // ================= 一 FDE 是个啥 =================
  shot('FDE，听起来', (lt, t) => { title('一', 'FDE 是个啥', 'star')(lt, t); fx2Rays(960, 560, t, { a: .2 }); fx2Shine(420, 400, 1500, 720, (lt - .3) / .8); stageFx(t); }, { grade: 'gold', bloom: .6, in: { type: 'pixelate', dur: .5 }, cam: push(160, 88, 1.02, 1.1) });
  // the full name typed onto a gold plate; the Chinese name slams in
  shot('全称', (lt, t) => {
    hall(t); stageFx(t);
    frame(56, 26, 208, 40, { title: '全称', fill: '#2A1418' });
    ['Forward', 'Deployed', 'Engineer'].forEach((w, i) => { const k = pop(lt - .3 - i * .35, .15); if (k > 0) pxText(w, 100 + i * 60, 46 - Math.round((1 - k) * 6), { size: 8, color: GOLDL }); });
    fx2Shine(336, 156, 1584, 396, (lt - 1.3) / .7);
    slam('前沿部署工程师', t, '前沿部署工程师', { size: 120, y: 620, stagger: .04, pal: 'gold', out: 2 });
    hg(40, FLOOR, { ...feelT('happy', t), view: 'q', poseR: 'point' });
  }, { grade: 'gold', in: { type: 'wipe', dur: .3 }, cam: push(160, 80, 1.05, 1.2) });
  // Palantir's special forces: a transport plane over Silicon Valley at night, a parachute drop, a landing in dust
  shot('最早是硅谷的', (lt, t) => {
    vgrad(0, PW, 0, PH, [[0, '#0A0820'], [PH, '#3A1E44']]);
    for (let i = 0; i < 40; i++) pset(Math.floor(hash(i) * PW), Math.floor(hash(i + 7) * 110), Math.sin(t * 3 + i) > .3 ? CREAM : '#8C88A6');
    for (let i = 0; i < 14; i++) { const h = 20 + Math.round(hash(i + 11) * 34); R(i * 24, FLOOR - h, 20, h, '#1A1220'); for (let j = 4; j < h; j += 7) if (hash(i * 5 + j) > .5) R(i * 24 + 4, FLOOR - h + j, 4, 2, GOLD); }
    R(0, FLOOR, PW, PH - FLOOR, '#2A1A10'); R(0, FLOOR, PW, 1, '#5A3A2C');
    plane(Math.round(-40 + lt * 70), 44);
    chip(after(t, 'Palantir') ? 'Palantir · 硅谷' : '硅谷', 80, 74, GOLDL, 7);
    const drop = since(t, '肉身空降'), k = drop < 0 ? 0 : clamp(drop / 1.4), y = drop < 0 ? 104 + Math.sin(t * 2) * 3 : lerp(104, FLOOR, out3(k));
    if (after(t, '技术特种兵')) { if (k < 1) parachute(220, y - 75); cl(220, y, { ...emo(t, [[0, 'cool'], [at('肉身空降') + 1.4, 'determined']]), noShadow: k < 1 }); if (k > 0 && k < 1) fx2Streaks(t, 1, { dir: 1, speed: -3000, n: 20 }); }
    slam('技术特种兵', t, '技术特种兵', { size: 130, x: 640, y: 760, pal: 'cream', out: 1.6, hit: .5 });
    if (k >= 1) { burst('dust', t, '肉身空降', { at: [220, FLOOR], delay: 1.4, n: 18, speed: 600, arc: 2.6, life: 1 }); fx2Ring([220, FLOOR], 0, drop - 1.4, { flat: .25, r: 500 }); if (after(t, '客户现场')) chip('客户现场', 220, FLOOR - 52, GOLDL, 6); }
    if (drop > 1.38 && drop < 1.5) fx2Hit(.7);
  }, { grade: 'night', bloom: .55, in: { type: 'dissolve', dur: .4 }, cam: (lt, t) => [ramp(t, [[at('最早是硅谷的'), 120], [at('技术特种兵'), 200]]), ramp(t, [[at('最早是硅谷的'), 80], [at('肉身空降'), 86], [at('肉身空降') + 1.4, 104]]), ramp(t, [[at('最早是硅谷的'), 1.1], [at('技术特种兵'), 1.2]])] });
  // a mountain of legacy code; flies; he forces it to run and it lights up
  shot('在客户留下的', (lt, t) => {
    office(t, { phase: .9, clockSpin: lt * 10 });
    const run = since(t, '强行跑通');
    for (let r = 0; r < 6; r++) for (let c = 0; c <= 5 - r; c++) box(176 + c * 16 + r * 8, FLOOR - 12 - r * 11, 16, 12, run >= 0 && hash(r * 7 + c + Math.floor(t * 6)) > .5 ? '#C8A060' : r % 2 ? '#7A4A30' : BROWN, '#4A2A18');
    for (let i = 0; i < 6; i++) pset(Math.round(220 + Math.cos(t * 6 + i) * 20), Math.round(FLOOR - 76 + Math.sin(t * 8 + i * 2) * 6), INK);
    if (after(t, '屎山代码')) chip('屎山代码', 228, 34, '#E8C08A', 8);
    cl(130, FLOOR - 2, { ...emo(t, [[0, 'disgusted'], [at('强行跑通'), 'determined']]), ...typing(t, run >= 0 ? 18 : 10) });
    desk(130, t, { cups: 4 });
    if (run >= 0) { icon('check', 228, FLOOR - 92, 3); pxFx({ type: 'glow', x: 228, y: FLOOR - 50, r: 60, a: .45 }); fx2Rays([228, FLOOR - 50], 0, t, { a: .22 }); burst('spark', t, '强行跑通', { at: [228, FLOOR - 60], n: 40, speed: 1200, life: 1 }); }
  }, { grade: 'warm', in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('在客户留下的'), 200], [at('强行跑通'), 180]]), 96, ramp(t, [[at('在客户留下的'), 1.35], [at('屎山代码'), 1.2], [at('强行跑通'), 1.1]])] });
  // everyone grabbing for them; chips raining; 疯狂招聘
  shot('这两年 OpenAI', (lt, t) => {
    hall(t); stageFx(t);
    cl(160, FLOOR, emo(t, [[0, 'surprised'], [at('疯狂招聘'), 'starstruck']], { emote: '!', emoteK: 1 }));
    [['OpenAI', 60, 'OpenAI'], ['Anthropic', 260, 'Anthropic']].forEach(([ph, x, w], i) => { if (!after(t, ph, -.1)) return; const k = pop(since(t, ph) + .1, .3); chip(w, x, 40, SKY, 8); const hx = lerp(x, i ? 196 : 124, k * (.6 + .2 * Math.sin(t * 6))); R(Math.min(x, hx), FLOOR - 26, Math.abs(hx - x), 3, CREAM); R(Math.round(hx) - 3, FLOOR - 29, 6, 8, CREAM); npc(x, FLOOR, null, SUIT); });
    const home = since(t, '国内大厂小厂');
    if (home >= 0) for (let i = 0; i < 12; i++) { const lt2 = home - i * .12; if (lt2 < 0) continue; const y = Math.min(70 + (i % 3) * 14, -10 + lt2 * 400); chip(i % 2 ? '小厂' : '大厂', 40 + (i % 6) * 48, y, i % 2 ? CREAM : GOLDL, 6); }
    slam('疯狂招聘', t, '疯狂招聘', { size: 170, y: 760, pal: 'gold', flash: .3, stagger: .05 });
    burst('confetti', t, '疯狂招聘', { x: 960, y: 700, n: 100, speed: 1600, life: 2 });
  }, { grade: 'gold', bloom: .5, in: { type: 'whip', dur: .3 }, cam: (lt, t) => [160, 92, ramp(t, [[at('这两年 OpenAI'), 1.2], [at('国内大厂小厂'), 1.03], [at('疯狂招聘'), 1.12]])] });
  // a product manager drools at three glowing pedestals
  shot('多少产品经理', (lt, t) => {
    hall(t); stageFx(t, { a: .18 });
    const P = [['既懂业务', 'book', 70, '懂业务'], ['最前沿的技术', 'chip', 160, '前沿技术'], ['站在 AI 最前线', 'bolt', 250, 'AI 最前线']];
    P.forEach(([ph, ic, x, lab], i) => { pedestal(x); chip(lab, x, FLOOR - 10, GOLDL, 5.5); if (!after(t, ph, -.1)) return; const y = FLOOR - 44 - Math.round(over((since(t, ph) + .1) / .5) * 8) + Math.round(Math.sin(t * 3 + i) * 2); pxFx({ type: 'glow', x, y, r: 30, a: .5 }); sparkle(x, y, 18, t, 6); icon(ic, x, y, 3); fx2Burst('star', since(t, ph), { at: [x, y], n: 14, speed: 500, life: .9 }); });
    const w = walker(t, [[at('多少产品经理'), -20], [at('多少产品经理') + 1.3, 160]]);
    cl(w.x, FLOOR - 20, w.moving ? { ...feelT('neutral', t), view: 'side', walk: w.x / 10 } : { ...feelT('love', t), emote: 'heart', emoteK: 1 });
    if (after(t, '流口水') && !w.moving) { for (let i = 0; i < 3; i++) { const ph = (t * 1.5 + i / 3) % 1; R(166, FLOOR - 30 + Math.round(ph * 14), 1, 2, SKY); } fx2Stream('heart', t, { at: [160, FLOOR - 40], w: 300, h: 300, n: 8 }); }
  }, { grade: 'dream', in: { type: 'iris', dur: .4 }, cam: (lt, t) => [ramp(t, [[at('多少产品经理'), 160], [at('既懂业务'), 70], [at('最前沿的技术'), 160], [at('站在 AI 最前线'), 250], [at('站在 AI 最前线') + 1, 160]]), ramp(t, [[at('既懂业务'), 96], [at('站在 AI 最前线') + 1, 92]]), ramp(t, [[at('多少产品经理'), 1.3], [at('既懂业务'), 1.45], [at('站在 AI 最前线') + .3, 1.45], [at('站在 AI 最前线') + 1, 1.05]])] });
  // the resume: "pure PM, 10 years" greys out, FDE shines with a sweep of light
  shot('简历上一写', (lt, t) => {
    darkStage(t, [160]); stageFx(t);
    const y0 = Math.round(lerp(190, 16, over(lt / .5)));
    frame(76, y0, 168, 126, { title: '简历', fill: CREAM });
    cl(118, y0 + 70, { ...feelT('proud', t), noShadow: true });
    pxText('纯 PM · 10 年', 198, y0 + 40, { size: 7, color: after(t, '牛逼#1') ? '#8C88A6' : INK, stroke: false });
    if (after(t, '牛逼#1')) R(166, y0 + 40, 64, 1, RED);
    pxText('FDE', 198, y0 + 72, { size: 16, color: GOLDD, stroke: false });
    fx2Shine(456, 96, 1464, 852, (lt - .6) / .8);
    if (after(t, '牛逼#1')) { pxFx({ type: 'glow', x: 198, y: y0 + 72, r: 36, a: .55 }); fx2Rays([198, y0 + 72], 0, t, { a: .25 }); }
    slam('更牛！', t, '牛逼#1', { size: 140, at: [204, y0 + 104], pal: 'red', out: 1.8 });
  }, { grade: 'gold', bloom: .5, in: { type: 'iris', dur: .4 }, cam: (lt, t) => [ramp(t, [[at('简历上一写'), 160], [at('牛逼#1'), 190]]), ramp(t, [[at('简历上一写'), 90], [at('牛逼#1'), 96]]), ramp(t, [[at('简历上一写'), 1.05], [at('牛逼#1'), 1.3]])] });

  // ================= 二 免费演示工程师 =================
  shot('可我这朋友干了半年', (lt, t) => {
    darkStage(t, []); cloud(80, 18, t);
    cl(80, FLOOR, emo(t, [[0, 'sad'], [at('彻底绝望'), 'cry']]));
    fx2Stream('rain', t, { n: 120, speed: 1.4 }); fx2Bars(1);
    slam('绝望', t, '彻底绝望', { size: 200, y: 360, pal: 'sky', burst: false, hit: .3, out: 1.5 });
  }, { res: [160, 90], grade: 'cold', bloom: .25, in: { type: 'pixelate', dur: .6 }, cam: push(80, 50, 1.05, 1.25) });
  // a new name: Forward Deployed glitches into Free Demo
  shot('他自己给这个岗位', (lt, t) => {
    hall(t); frame(56, 30, 208, 44, { title: '新名字', fill: '#2A1418' });
    const sw = since(t, 'Free Demo Engineer');
    if (sw < 0) { pxText('Forward', 100, 52, { size: 8, color: GOLDL }); pxText('Deployed', 160, 52, { size: 8, color: GOLDL }); }
    else { [['Free', 100], ['Demo', 160]].forEach(([w, x], i) => { const k = pop(sw - i * .25, .25); if (k > 0) pxText(w, x, Math.round(lerp(20, 52, k)), { size: 9, color: PINK }); else { pxText(i ? 'Deployed' : 'Forward', x + Math.round((hash(Math.floor(t * 20)) - .5) * 6), 52, { size: 8, color: '#8C88A6' }); R(x - 18, 52, 36, 1, RED); } }); if (sw < .6) fx2Hit(.6); }
    pxText('Engineer', 220, 52, { size: 8, color: GOLDL });
    slam('免费演示工程师', t, '免费演示工程师', { size: 130, y: 640, pal: 'pink', stagger: .05, flash: .25 });
    cl(270, FLOOR, emo(t, [[0, 'suspicious'], [at('免费演示工程师'), 'mischief']]));
  }, { grade: 'neon', in: { type: 'glitch', dur: .3 }, cam: (lt, t) => [160, ramp(t, [[at('他自己给这个岗位'), 60], [at('免费演示工程师'), 80]]), ramp(t, [[at('他自己给这个岗位'), 1.3], [at('Free Demo Engineer'), 1.4], [at('免费演示工程师'), 1.1]])] });
  // a corporate free-tasting stall, and he's the one handing it out
  shot('说实话', (lt, t) => {
    sunburst(t, '#5A0E18', '#8A1828', 160, 90);
    cl(160, FLOOR - 4, { ...emo(t, [[0, 'nervous'], [at('天天给人免费试吃'), 'happy']]), aR: Math.floor(t * 3) % 2 ? 1.3 : .4 });
    stall(160, t, { sign: '企业级 · 免费试吃' });
    slam('免费试吃摊', t, '免费试吃摊#1', { size: 170, y: 250, pal: 'red', stagger: .05, flash: .3 });
    burst('confetti', t, '免费试吃摊#1', { x: 960, y: 300, n: 80, speed: 1400, life: 2 });
    roll(t, '免费试吃摊#1', .05);
  }, { grade: 'warm', bloom: .55, in: { type: 'flash', dur: .3 }, cam: (lt, t) => [160, 96, 1.04 + .3 * Math.max(0, .3 - Math.max(0, since(t, '免费试吃摊#1')))] });
  // lifted by the wind of the hot job . . . dropped into plain free labour
  shot('一个风口上的', (lt, t) => {
    vgrad(0, PW, 0, FLOOR, [[0, '#2A1C44'], [FLOOR, '#8A4A6A']]); vgrad(0, PW, FLOOR, PH, [[0, '#4A2C1C'], [30, '#2A1810']]);
    const fall = since(t, '沦落成');
    for (let i = 0; i < 14; i++) R(Math.floor((hash(i) * 400 + t * 200) % 360) - 20, Math.floor(hash(i + 3) * 140), 18, 1, fall < 0 ? '#C8B8E8' : '#5A4A6A');
    const y = fall < 0 ? Math.round(lerp(FLOOR, 60, out3(lt / 1.5)) + Math.sin(t * 3) * 4) : Math.round(Math.min(FLOOR, 60 + fall * fall * 400));
    if (fall < 0) { chip('风口', 160, 24, GOLDL, 9); sparkle(160, y - 20, 30, t, 10); fx2Streaks(t, .8, { n: 26 }); fx2Rays([160, y - 20], 0, t, { a: .18 }); }
    cl(160, y, { ...emo(t, [[0, 'excited'], [at('沦落成'), 'scared'], [at('免费苦力'), 'ko']]), noShadow: y < FLOOR - 2 });
    if (after(t, '免费苦力')) { for (let i = 0; i < 3; i++) box(130 + i * 2, FLOOR - 41 - 9 - i * 13, 60 - i * 6, 12, '#7A5A3A'); burst('dust', t, '免费苦力', { at: [160, FLOOR], n: 16, speed: 600, arc: 2.4, life: 1 }); }
    slam('免费苦力', t, '免费苦力', { size: 160, y: 300, pal: 'red', flash: .25 });
  }, { grade: 'dream', in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [160, ramp(t, [[at('一个风口上的'), 110], [at('沦落成') - .1, 70], [at('沦落成') + .5, 110]]), ramp(t, [[at('一个风口上的'), 1.1], [at('沦落成') - .1, 1.3], [at('沦落成') + .5, 1.1]])] });
  shot('今天就讲讲', (lt, t) => {
    sunburst(t, '#2A1430', '#3A1E44', 80, 50);
    hg(76, PH + 10, { ...emo(t, [[0, 'mischief'], [at('魔幻经历'), 'excited']]), poseR: 'point' });
    if (after(t, '魔幻经历')) { chip('魔幻半年', 124, 30, PINK, 6.5); sparkle(124, 30, 26, t, 10, PINK); fx2Burst('star', since(t, '魔幻经历'), { x: 1488, y: 360, n: 30, speed: 700 }); }
    fx2Rays(912, 600, t, { a: .16, col: [210, 160, 255] });
  }, { res: [160, 90], grade: 'neon', in: { type: 'whip', dur: .3 }, cam: push(80, 48, 1.0, 1.12) });
  shot('文末送你三句保命真话', (lt, t) => {
    curtain(t, 1); spot(160, t, { w: 120 }); stageFx(t);
    for (let i = 0; i < 3; i++) { const k = pop(lt - .2 - i * .25, .3), x = 100 + i * 60; if (k <= 0) continue; const y = Math.round(lerp(140, 60, k) + Math.sin(t * 3 + i) * 2); frame(x - 20, y - 22, 40, 44, { fill: CREAM }); pxText(['一', '二', '三'][i], x, y - 6, { size: 9, color: RED, stroke: false }); pxText('？', x, y + 10, { size: 8, color: INK, stroke: false }); pxFx({ type: 'glow', x, y, r: 26, a: .4 }); }
    fx2Rays(960, 360, t, { a: .2 });
    slam('保命真话', t, '保命真话', { size: 120, y: 190, pal: 'gold', out: 2.5, burst: false, hit: .3 });
    hg(160, FLOOR + 8, { ...emo(t, [[0, 'happy'], [at('当面问清楚'), 'determined']]), poseR: after(t, '当面问清楚') ? 'point' : 'up' });
    slam('问清楚！', t, '当面问清楚', { size: 150, y: 820, pal: 'red', flash: .25 });
  }, { grade: 'gold', in: { type: 'iris', dur: .4 }, cam: (lt, t) => [160, 92, ramp(t, [[at('文末送你三句保命真话'), 1.05], [at('当面问清楚'), 1.1], [at('当面问清楚') + .3, 1.35]])] });

  // ================= 二 魔幻半年 =================
  shot('刚入职第一周', (lt, t) => { title('二', '魔幻半年', 'clock')(lt, t); fx2Rays(960, 560, t, { a: .2, col: [220, 170, 255] }); fx2Shine(420, 400, 1500, 720, (lt - .3) / .8); stageFx(t); }, { grade: 'neon', bloom: .55, in: { type: 'pixelate', dur: .5 }, cam: push(160, 88, 1.02, 1.1) });
  // the boss (黑哥) paints a giant glittering pie: the spearhead company of the AI war
  shot('老板拉着开会', (lt, t) => {
    hall(t); stageFx(t);
    const pie = since(t, '大饼画得'), r = pie < 0 ? 0 : Math.min(46, 6 + pie * 22);
    if (r > 0) { pellipse(200, 70, r, r * .55, GOLDD); pellipse(200, 68, r - 2, r * .55 - 2, GOLD); for (let i = 0; i < 10; i++) pset(Math.round(200 + Math.cos(i * 2.1) * r * .5), Math.round(68 + Math.sin(i * 1.7) * r * .25), GOLDL); sparkle(200, 68, r + 6, t, 14); chip('大饼', 200, Math.round(68 - r * .55 - 10), CREAM, 7); fx2Rays([200, 68], 0, t, { a: .25 }); }
    hg(110, FLOOR, { ...emo(t, [[0, 'happy'], [at('尖刀连'), 'excited']]), poseR: after(t, '大饼画得') ? 'waveA' : 'point', poseL: 'hip' });
    chip('老板 · 黑哥饰', 110, 44, GOLDL, 6);
    slam('尖刀连', t, '尖刀连', { size: 170, y: 820, pal: 'red', flash: .25, stagger: .06 });
    cl(260, FLOOR, { ...emo(t, [[0, 'neutral'], [at('尖刀连'), 'starstruck']]), view: 'q', flip: true });
  }, { grade: 'gold', bloom: .5, in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('老板拉着开会'), 140], [at('大饼画得'), 180], [at('尖刀连'), 200]]), 90, ramp(t, [[at('老板拉着开会'), 1.05], [at('大饼画得'), 1.25], [at('尖刀连'), 1.15]])] });
  // blood boiling; welding himself to the desk in a shower of sparks
  shot('他当时听得热血沸腾', (lt, t) => {
    office(t, { phase: .5, clockSpin: lt * 15 });
    const weld = since(t, '把命焊在工位上');
    pxFx({ type: 'glow', x: 140, y: FLOOR - 20, r: 44, a: .32 + .12 * Math.sin(t * 8), col: '#FF6A4A' });
    cl(140, FLOOR - 2, { ...emo(t, [[0, 'excited'], [at('把命焊在工位上'), 'determined']]), ...(weld >= 0 ? typing(t, 14) : { aL: 1.3, aR: 1.3 }) });
    desk(140, t, { cups: 2 });
    if (weld >= 0) { pxFx({ type: 'glow', x: 112, y: FLOOR - 14, r: 16, a: .9 * (.6 + .4 * Math.sin(t * 40)), col: '#FFF1C9' }); fx2Stream('spark', t, { at: [112, FLOOR - 14], w: 60, h: 260, n: 60, speed: 3 }); fx2Burst('spark', (weld * 2) % 1, { at: [112, FLOOR - 14], n: 30, speed: 1100, arc: 2.6, life: .5, seed: Math.floor(weld * 2) }); chip('焊在工位上', 140, 40, GOLDL, 8); }
    else fx2Stream('ember', t, { at: [140, FLOOR], w: 300, h: 400, n: 30 });
  }, { grade: 'fire', bloom: .7, in: { type: 'cut' }, cam: (lt, t) => [ramp(t, [[at('他当时听得热血沸腾'), 140], [at('把命焊在工位上'), 120]]), 100, ramp(t, [[at('他当时听得热血沸腾'), 1.3], [at('把命焊在工位上'), 1.55]])] });
  shot('结果第二周', (lt, t) => {
    street(t, Math.floor(lt * 16));
    npc(150, FLOOR, lt * 3, SUIT); chip('销售', 150, FLOOR - 40, CREAM, 6);
    cl(100, FLOOR, { ...feelT('neutral', t), view: 'side', walk: lt * 1.4 });
    if (lt > .8) chip('拜访客户', 230, 40, GOLDL, 8);
    fx2Bokeh(t, { n: 18, a: .2, cols: ['255,200,120', '255,150,120', '200,170,255'] });
  }, { grade: 'night', in: { type: 'whip', dur: .3 }, cam: push(130, 110, 1.3, 1.2) });
  // the client (黑哥) blows hot air for 30 minutes; spit flies; the clock races
  shot('甲方在那唾沫横飞', (lt, t) => {
    curtain(t, 1); spot(110, t);
    hg(110, FLOOR, { ...feelT('smug', t), poseR: Math.floor(t * 4) % 2 ? 'waveA' : 'waveB', poseL: 'hip' }); chip('甲方 · 黑哥饰', 110, 44, GOLDL, 6);
    fx2Burst('drop', (lt * 2) % 1, { at: [124, FLOOR - 70], n: 14, speed: 900, dir: -.2, arc: 1, life: .9, gravity: 900, seed: Math.floor(lt * 2) });
    const m = Math.min(30, Math.floor(lt * 9)); frame(210, 40, 70, 34, { title: '计时', fill: INK }); pxText(`${m} 分钟`, 245, 58, { size: 9, color: m >= 30 ? RED : GOLDL });
    cl(250, FLOOR, { ...feelT('bored', t), emote: 'zzz', emoteK: 1 });
    slam('吹了 30 分钟', t, '30 分钟', { size: 110, y: 800, pal: 'cream', burst: false, hit: .3, out: 2 });
  }, { grade: 'warm', in: { type: 'iris', dur: .4 }, cam: push(170, 96, 1.1, 1.25) });
  shot('然后甲方许完愿', (lt, t) => {
    darkStage(t, [40, 120]);
    for (let i = 0; i < 6; i++) { const ph = (t + hash(i)) % 1; icon('star', 20 + hash(i + 1) * 40, 60 - ph * 40, 1); }
    npc(40, FLOOR, null, SUIT); const wink = Math.floor(t * 5) % 3 === 0;
    R(36, FLOOR - 27, 3, wink ? 1 : 2, CREAM); chip('销售', 40, FLOOR - 40, CREAM, 5);
    if (wink) fx2Burst('star', .05, { at: [37, FLOOR - 27], n: 6, speed: 200, life: .3, seed: Math.floor(t * 5) });
    if (after(t, '这个能搞吧')) chip('这个能搞吧？', 60, 14, GOLDL, 6);
    cl(120, FLOOR, { ...emo(t, [[0, 'neutral'], [at('疯狂使眼色'), 'nervous']]), emote: 'sweat', emoteK: 1, flip: true });
  }, { res: [160, 90], grade: 'noir', in: { type: 'slide', dur: .25 }, cam: (lt, t) => [ramp(t, [[at('然后甲方许完愿'), 40], [at('这个能搞吧'), 80]]), 50, ramp(t, [[at('然后甲方许完愿'), 1.3], [at('这个能搞吧'), 1.0]])] });
  // he nods anyway; DeepSeek rises behind him in a halo, the safety net
  shot('他明知道搞不定', (lt, t) => {
    curtain(t, 1); spot(130, t); stageFx(t);
    const nod = since(t, '点了点头'), j = nod >= 0 ? jump(onTwos(t), at('点了点头'), at('点了点头') + .35, 3) : { dy: 0, sq: 0 };
    cl(130, FLOOR, { ...emo(t, [[0, 'nervous'], [at('咬咬牙'), 'determined']]), dy: j.dy, sq: j.sq });
    if (after(t, '搞不定')) chip('搞不定', 130, 64, PINK, 8);
    const net = since(t, '给他兜底');
    if (after(t, 'AI 可以给他兜底', -.2)) { const k = pop(since(t, 'AI 可以给他兜底') + .2, .5); pxFx({ type: 'glow', x: 220, y: FLOOR - 50, r: 70 * k, a: .5, col: '#CFE4FF' }); fx2Rays([220, FLOOR - 50], 0, t, { a: .28 * k, col: [220, 230, 255] }); ds(220, Math.round(lerp(FLOOR + 90, FLOOR, k)), { flip: true, emote: net >= 0 ? 'spark' : null }); }
    if (net >= 0) { for (let x = 90; x < 170; x += 4) pline(x, FLOOR + 4, x + 4, FLOOR + 6, CREAM); slam('AI 兜底', t, '给他兜底', { size: 110, y: 230, pal: 'sky', out: 1.6 }); }
  }, { grade: 'night', bloom: .55, in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('他明知道搞不定'), 130], [at('AI 可以给他兜底'), 175]]), 100, ramp(t, [[at('他明知道搞不定'), 1.4], [at('AI 可以给他兜底'), 1.1]])] });
  // two weeks of all-nighters with DeepSeek: a time-lapse, days and nights strobing past the window
  shot('回公司以后', (lt, t) => {
    office(t, { phase: lt * .6, clockSpin: lt * 40 });
    cl(110, FLOOR - 2, { ...feelT('sleepy', t), ...typing(t, 12) });
    ds(196, FLOOR, { dy: Math.floor(t * 4) % 2 ? -1 : 0 });
    desk(120, t, { cups: Math.min(14, Math.floor(lt * 3)) });
    pxFx({ type: 'glow', x: 150, y: FLOOR - 40, r: 50, a: .3, col: '#BFD8FF' });
    if (after(t, '两个星期大夜')) chip('熬了两个星期', 150, 30, GOLDL, 8);
    fx2Streaks(t, .4, { n: 10, speed: 1200 });
  }, { grade: 'night', in: { type: 'pixelate', dur: .5 }, cam: push(150, 96, 1.05, 1.25) });
  // why at night? day full price, after work half price
  shot('为什么熬夜呢', (lt, t) => {
    hall(t);
    card(20, 24, 136, 110, '白天 · 原价', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#E8A06A'], [h, '#C08A5C']]); icon('sun', x + w / 2, y + 26, 2); pxText('¥¥¥¥', x + w / 2, y + 60, { size: 9, color: INK, stroke: false }); }, pop(lt, .3));
    card(164, 24, 136, 110, '下班后 · 半价', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#0E0A20'], [h, '#2A1C44']]); icon('moon', x + w / 2, y + 26, 2); pxText('¥¥', x + w / 2, y + 60, { size: 9, color: GOLDL }); }, after(t, '下班后', -.3) ? pop(since(t, '下班后') + .3, .3) : 0);
    slam('半价！', t, '下班后才能半价', { size: 180, at: [232, 96], pal: 'gold', flash: .2 });
    burst('coin', t, '下班后才能半价', { at: [232, 80], n: 24, speed: 1000 });
  }, { grade: 'warm', in: { type: 'wipe', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('为什么熬夜呢'), 88], [at('下班后') - .1, 88], [at('下班后') + .4, 232]]), 82, 1.3] });
  // the company caps the token claims: the bar drains, the alarm goes red
  shot('说起来这还是他公司不靠谱', (lt, t) => {
    office(t, { phase: .3 });
    const cap = since(t, '报销额度月上限'), k = cap < 0 ? 1 : clamp(1 - cap / 1.2, .06, 1);
    hp(105, 30, k, cap >= 0 ? 'token 额度' : null);
    cl(160, FLOOR - 2, emo(t, [[0, 'neutral'], [at('报销额度月上限'), 'nervous'], [at('还卡报销'), 'furious']]));
    if (after(t, '提升效率')) chip('提升效率 → 产出', 160, 74, CREAM, 7);
    if (cap >= 0 && k < .1 && Math.floor(t * 4) % 2) pxFx({ type: 'tint', col: '#FF2A2A', a: .07 });
    slam('卡报销', t, '还卡报销', { size: 180, y: 700, pal: 'red', flash: .3, stagger: .06 });
    roll(t, '还卡报销', -.05);
  }, { grade: 'warm', in: { type: 'cut' }, cam: (lt, t) => [160, ramp(t, [[at('说起来这还是他公司不靠谱'), 60], [at('提升效率'), 80]]), ramp(t, [[at('说起来这还是他公司不靠谱'), 1.4], [at('提升效率'), 1.1], [at('还卡报销'), 1.25]])] });
  // pricey models behind glass; unlimited tokens shatter
  shot('没办法', (lt, t) => {
    hall(t);
    card(20, 24, 136, 110, '贵的模型', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#3A2418'], [h, '#5A3A2C']]); icon('chip', x + w / 2, y + 30, 3); for (let i = 0; i < 4; i++) chip('¥', x + 20 + i * 28, y + 64, GOLDL, 6); R(x + 10, y + 10, 2, h - 20, SKY); R(x + w - 12, y + 10, 2, h - 20, SKY); }, pop(lt, .3));
    const k2 = after(t, '无限 token', -.3) ? pop(since(t, '无限 token') + .3, .3) : 0, gone = after(t, '无限 token', .4);
    card(164, 24, 136, 110, '无限 token', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#0E0A20'], [h, '#2A1C44']]); if (!gone) pxText('∞', x + w / 2, y + 40, { size: 20, color: SKY }); else icon('cross', x + w / 2, y + 40, 4); }, k2);
    burst('shard', t, '无限 token', { delay: .4, at: [232, 64], n: 46, speed: 900, col: '#CFF3FF' });
    if (after(t, '真用不起')) chip('用不起', 88, 140, PINK, 8);
  }, { grade: 'night', in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('没办法'), 88], [at('无限 token') - .2, 88], [at('无限 token') + .4, 232]]), 82, 1.25] });
  // back on topic (a rewind glitch), hair falling . . . the Demo is born in a burst of light
  shot('好了扯远了', (lt, t) => {
    office(t, { phase: .95 });
    const done = since(t, '把 Demo 给搓出来了');
    if (lt < 1.2) { hg(60, FLOOR, { ...feelT('mischief', t), poseR: 'point' }); chip('回归正题', 60, 40, GOLDL, 7); if (lt < .5) { fx2Hit(.5); fx2Streaks(t, 1, { dir: 1, n: 30 }); } }
    cl(170, FLOOR - 2, { ...emo(t, [[0, 'sleepy'], [at('库库掉'), 'cry'], [at('把 Demo 给搓出来了'), 'proud']]), ...(done < 0 ? typing(t, 16) : { aL: 1.4, aR: 1.4 }) });
    desk(170, t, { cups: 14 });
    if (after(t, '库库掉')) for (let i = 0; i < 18; i++) { const ph = (t * .9 + hash(i)) % 1; R(Math.round(150 + hash(i + 2) * 40 + Math.sin(ph * 6 + i) * 3), Math.round(FLOOR - 60 + ph * 50), 1, 3, INK); }
    if (done >= 0) { const k = pop(done, .4), fy = Math.round(lerp(120, 34, k)); frame(214, fy, 70, 44, { title: 'Demo', fill: '#1A1C30' }); R(222, fy + 12, 54, 4, SKY); R(222, fy + 20, 34, 4, GOLDL); R(222, fy + 28, 44, 4, PINK); fx2Rays([249, fy + 22], 0, t, { a: .3 }); burst('star', t, '把 Demo 给搓出来了', { at: [249, fy + 22], n: 30, speed: 900 }); }
    slam('搓出来了！', t, '把 Demo 给搓出来了', { size: 140, y: 820, pal: 'gold', flash: .25, delay: .3 });
  }, { grade: 'warm', bloom: .55, in: { type: 'glitch', dur: .3 }, cam: (lt, t) => [ramp(t, [[at('好了扯远了'), 100], [at('库库掉'), 170], [at('把 Demo 给搓出来了'), 210]]), 92, ramp(t, [[at('好了扯远了'), 1.2], [at('库库掉'), 1.45], [at('把 Demo 给搓出来了'), 1.2]])] });
  shot('屁颠屁颠跑去', (lt, t) => {
    street(t, Math.floor(lt * 26));
    const j = { dy: -Math.abs(Math.round(Math.sin(lt * 8) * 6)) };
    cl(140, FLOOR, { ...feelT('happy', t), view: 'side', walk: lt * 2, dy: j.dy });
    frame(152, FLOOR - 50 + j.dy, 30, 22, { fill: '#1A1C30' }); R(156, FLOOR - 44 + j.dy, 20, 3, SKY);
    chip('去演示', 220, 40, GOLDL, 8); fx2Streaks(t, .9, { n: 24 });
  }, { grade: 'night', in: { type: 'whip', dur: .3 }, cam: push(150, 108, 1.3, 1.2) });
  // the client (黑哥) wipes his mouth; every compliment smashes onto the screen
  shot('客户看完擦擦嘴', (lt, t) => {
    sunburst(t, '#8A4A6A', '#B86A8A', 50, 50);
    hg(50, PH + 10, { ...emo(t, [[0, 'smug'], [at('好样的小伙汁'), 'laugh'], [at('我再研究研究'), 'mischief']]), poseR: after(t, '好样的小伙汁') ? 'fistUp' : 'chin', poseL: 'belly' });
    const end = at('给内部同步一下') ?? D.len;
    [['好样的小伙汁', '好样的小伙汁', 1300, 200, 'cream', .06], ['真他妈牛逼', '真牛X！', 1350, 420, 'gold', -.08], ['很有启发', '很有启发', 1250, 640, 'cream', .05], ['我再研究研究', '我再研究研究…', 1250, 860, 'pink', -.03]]
      .forEach(([ph, w, x, y, pal, rot], i) => slam(w, t, ph, { x, y, size: i === 1 ? 130 : 90, pal, rot, burst: i === 1, hit: .35, out: end - (at(ph) ?? 0) + 1.2 }));
    if (after(t, '给内部同步一下')) chip('内部同步一下', 118, 82, GOLDL, 5);
  }, { res: [160, 90], grade: 'dream', in: { type: 'slide', dur: .3 }, cam: push(70, 48, 1.0, 1.12) });
  // and then . . . nothing. Letterbox, silence, a clock spinning; then the hammer
  shot('然后呢', (lt, t) => {
    darkStage(t, [160]);
    const none = since(t, '彻底没有然后了');
    cl(160, FLOOR, emo(t, [[0, 'hopeful'], [at('彻底没有然后了'), 'ko']], none < 0 ? { emote: '?', emoteK: 1 } : {}));
    icon('clock', 60, 50, 3); for (let k = 0; k < 6; k++) pline(250, 10, 250 + Math.cos(k * .5 + 1.6) * 50, 10 + Math.sin(k * .5 + 1.6) * 50, '#8C88A6');
    fx2Bars(none < 0 ? 1 : Math.max(0, 1 - none * 3));
    slam('没有然后', t, '彻底没有然后了', { size: 200, y: 420, pal: 'red', flash: .4, stagger: .07 });
    if (none >= 0) { fx2Speed(960, 540, t, Math.max(0, 1 - none)); fx2Roll(.07 * Math.max(0, 1 - none)); }
  }, { grade: 'noir', in: { type: 'iris', dur: .4 }, cam: (lt, t) => [160, 100, ramp(t, [[at('然后呢'), 1.4], [at('彻底没有然后了'), 1.1]])] });
  shot('接着换下一个客户', (lt, t) => {
    hall(t);
    for (let i = 0; i < 5; i++) { const x = Math.round(((lt * 60 + i * 70) % 350) - 20); npc(x, FLOOR, lt * 3 + i, i % 2 ? SUIT : '#4A2A36'); }
    R(0, FLOOR + 2, PW, 4, '#3A2A2A'); for (let x = 0; x < PW; x += 12) R(Math.round((x + lt * 60) % PW), FLOOR + 3, 2, 2, GOLDD);
    cl(160, FLOOR - 24, { ...feelT('bored', t), aR: Math.floor(t * 2) % 2 ? 1.3 : .2 }); frame(140, FLOOR - 24, 40, 24, { fill: CARD });
    const n = 1 + Math.floor(lt * 1.6); chip(`第 ${n} 遍`, 160, 30, after(t, '原样来一遍') ? RED : GOLDL, 9);
    if (Math.floor(lt * 1.6) !== Math.floor((lt - 1 / 24) * 1.6)) fx2Hit(.3);
    fx2Streaks(t, .5, { n: 14, dir: 1, speed: -1600 });
  }, { grade: 'warm', in: { type: 'whip', dur: .3 }, cam: push(160, 96, 1.05, 1.2) });
  // the weekly calendar, each day slammed in
  shot('他说他每天打开日历都想吐', (lt, t) => {
    office(t, { phase: .4 });
    const d = [['一', '听', '#3A4A9A', '周一周二', 0], ['二', '听', '#3A4A9A', '周一周二', .2], ['三', '搓', GOLDD, '周三到周五', 0], ['四', '搓', GOLDD, '周三到周五', .2], ['五', '搓', GOLDD, '周三到周五', .4], ['下周一', '演', RED, '下周一', 0]];
    calendar(60, 26, d.map(([a, w, c, ph, dl]) => [a, w, c, since(t, ph) - dl]), t);
    d.forEach(([, , , ph, dl]) => { const l = since(t, ph) - dl; if (l > 0 && l < .06) fx2Hit(.35); });
    cl(160, FLOOR - 2, emo(t, [[0, 'nervous'], [at('都想吐'), 'disgusted'], [at('瞎扯淡'), 'bored'], [at('没日没夜'), 'dizzy']]));
  }, { grade: 'warm', in: { type: 'dissolve', dur: .35 }, cam: push(160, 80, 1.2, 1.1) });
  // a month's tally: a pile of clients, 7 or 8 Demos, and a giant red zero
  shot('一个月折腾下来', (lt, t) => {
    hall(t);
    const a = since(t, '客户见了一大堆'), b = since(t, '七八个'), c = since(t, '一单都没有');
    if (a < 0) { const k = pop(lt, .3); frame(110, Math.round(lerp(150, 50, k)), 100, 50, { title: '月度总结', fill: CREAM }); pxText('一个月', 160, Math.round(lerp(150, 50, k)) + 26, { size: 12, color: INK, stroke: false }); cl(250, FLOOR, { ...feelT('sleepy', t), emote: 'sweat', emoteK: 1 }); }
    if (a >= 0) { for (let i = 0; i < Math.min(9, Math.floor(a * 9) + 1); i++) npc(40 + (i % 3) * 14, FLOOR - Math.floor(i / 3) * 8, null, i % 2 ? SUIT : '#4A2A36'); chip('客户 一大堆', 54, 40, CREAM, 7); }
    if (b >= 0) { for (let i = 0; i < Math.min(8, Math.floor(b * 10) + 1); i++) frame(130 + (i % 4) * 16, FLOOR - 22 - Math.floor(i / 4) * 16, 15, 14, { fill: '#1A1C30' }); chip('Demo 七八个', 160, 40, GOLDL, 7); }
    if (c >= 0) chip('签单', 260, 40, CREAM, 7);
    slam('0', t, '一单都没有', { size: 420, x: 1560, y: 560, pal: 'red', flash: .4, rot: .04, sub: '一单都没有' });
  }, { grade: 'warm', in: { type: 'iris', dur: .4 }, cam: (lt, t) => [ramp(t, [[at('一个月折腾下来'), 160], [at('客户见了一大堆'), 60], [at('七八个'), 160], [at('一单都没有'), 200]]), 90, ramp(t, [[at('一个月折腾下来'), 1.03], [at('客户见了一大堆'), 1.4], [at('一单都没有') - .1, 1.4], [at('一单都没有') + .3, 1.08]])] });

  // ================= 免费试吃摊 =================
  shot('他就跟我吐槽', (lt, t) => {
    mall(t, lt * 14);
    for (let i = 0; i < 3; i++) { const x = Math.round(((lt * 26 + i * 120) % 380) - 30); npc(x, FLOOR + 14, lt * 3 + i, i % 2 ? '#4A2A36' : SUIT); }
    const cut = since(t, '切一块香肠');
    cl(160, FLOOR - 4, { ...emo(t, [[0, 'hopeful'], [at('求着路过的人'), 'nervous']]), aR: cut >= 0 ? (Math.floor(t * 5) % 2 ? 1.2 : .6) : .3 });
    stall(160, t, { slices: cut >= 0 ? 5 + Math.floor(cut * 2) % 4 : 5 });
    if (after(t, '免费试吃摊#2')) chip('免费试吃摊', 160, 30, GOLDL, 8);
    if (after(t, '求着路过的人')) chip('尝一口？', 210, 56, CREAM, 7);
    if (cut >= 0 && Math.floor(t * 5) % 2) fx2Burst('star', (t * 5 % 1) / 5, { at: [160, FLOOR - 32], n: 4, speed: 200, life: .25, seed: Math.floor(t * 5) });
    fx2Bokeh(t, { n: 16, a: .2 });
  }, { grade: 'warm', bloom: .5, in: { type: 'zoom', dur: .45 }, cam: (lt, t) => [160, 100, ramp(t, [[at('他就跟我吐槽'), 1.05], [at('切一块香肠'), 1.35]])] });
  shot('路人尝完', (lt, t) => {
    mall(t, 20 + lt * 4);
    const go = since(t, '屁股一拍走人了'), next = since(t, '下一个摊子');
    cl(110, FLOOR - 4, emo(t, [[0, 'hopeful'], [at('屁股一拍走人了'), 'sad'], [at('低头切下一块'), 'cry']]));
    stall(110, t, {}); stall(270, t, { sign: '隔壁小吃' });
    const px = go < 0 ? 170 : next < 0 ? Math.min(220, 170 + go * 30) : Math.min(270, 220 + next * 40);
    npc(px, FLOOR + 14, go >= 0 ? t * 3 : null, SUIT);
    slam('太好吃了！', t, '卧槽太好吃了', { at: [176, 56], size: 110, pal: 'gold', out: (at('屁股一拍走人了') ?? 99) - (at('卧槽太好吃了') ?? 0), hit: .3 });
    if (after(t, '嘴巴一抹') && go < .8) chip('嘴巴一抹', 200, 52, CREAM, 6);
    if (after(t, '低头切下一块')) fx2Bars(1);
  }, { grade: 'warm', in: { type: 'cut' }, cam: (lt, t) => [ramp(t, [[at('路人尝完'), 150], [at('屁股一拍走人了'), 150], [at('下一个摊子'), 220]]), 100, ramp(t, [[at('路人尝完'), 1.35], [at('屁股一拍走人了'), 1.2], [at('下一个摊子'), 1.15]])] });
  shot('根本他妈没有人关心', (lt, t) => {
    darkStage(t, [160]);
    frame(100, 30, 120, 90, { title: '店铺', fill: '#3A2A2A' }); for (let y = 40; y < 114; y += 5) R(106, y, 108, 2, '#5A4A4A');
    chip('开张？', 160, 76, CREAM, 10);
    cl(240, FLOOR, emo(t, [[0, 'sad'], [at('什么时候才开张'), 'cry']]));
    fx2Stream('rain', t, { n: 60, speed: 1.2 }); fx2Bars(1);
    slam('没人关心', t, '什么时候才开张', { size: 150, y: 300, pal: 'cream', burst: false, hit: .3 });
  }, { grade: 'cold', bloom: .25, in: { type: 'dissolve', dur: .35 }, cam: push(160, 84, 1.05, 1.25) });
  shot('因为没掏真金白银的东西', (lt, t) => {
    hall(t); stageFx(t);
    [['不给真实数据', 'server', 80, '数据'], ['不给系统权限', 'shield', 160, '权限'], ['沟通时间都懒得留', 'clock', 240, '时间']].forEach(([ph, ic, x, lab]) => { pedestal(x); chip(lab, x, FLOOR - 10, GOLDL, 6); icon(ic, x, FLOOR - 46, 3, after(t, ph) ? '#5A4A4A' : null); if (after(t, ph)) { icon('cross', x + 16, FLOOR - 60, 2); const l = since(t, ph); if (l < .06) fx2Hit(.5); fx2Ring([x, FLOOR - 46], 0, l, { r: 260, col: '255,120,110' }); } });
    if (after(t, '不会上心')) chip('没掏钱 = 不上心', 160, 30, PINK, 9);
  }, { grade: 'warm', in: { type: 'wipe', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('因为没掏真金白银的东西'), 160], [at('不给真实数据'), 80], [at('不给系统权限'), 160], [at('沟通时间都懒得留'), 240], [at('沟通时间都懒得留') + 1.2, 160]]), 92, ramp(t, [[at('因为没掏真金白银的东西'), 1.05], [at('不给真实数据'), 1.35], [at('沟通时间都懒得留') + 1.2, 1.05]])] });
  shot('你把 Demo 搓得再漂亮', (lt, t) => {
    curtain(t, 1); spot(160, t);
    const sh = since(t, '也是个弟弟'), s = sh < 0 ? 1 : Math.max(.3, 1 - sh * 1.2);
    const w = Math.round(80 * s), h = Math.round(56 * s); frame(160 - w / 2, 90 - h, w, h, { fill: '#1A1C30' }); if (sh < 0) { sparkle(160, 60, 50, t, 14); pxFx({ type: 'glow', x: 160, y: 60, r: 50, a: .45 }); fx2Rays([160, 60], 0, t, { a: .25 }); }
    cl(240, FLOOR, emo(t, [[0, 'proud'], [at('也是个弟弟'), 'sad']]));
    slam('弟弟', t, '也是个弟弟', { size: 200, y: 520, pal: 'pink', burst: false, hit: .4, out: 1.4 });
    slam('成交 0', t, '做不了成交', { size: 170, y: 760, pal: 'red', flash: .3 });
  }, { grade: 'gold', in: { type: 'iris', dur: .4 }, cam: (lt, t) => [160, 90, ramp(t, [[at('你把 Demo 搓得再漂亮'), 1.25], [at('也是个弟弟'), 1.25], [at('也是个弟弟') + .6, 1.05]])] });

  // ================= 三 三个谁 =================
  shot('后来他把这里面的猫腻', (lt, t) => { title('三', '三个谁', 'crown')(lt, t); fx2Rays(960, 560, t, { a: .22 }); fx2Shine(420, 400, 1500, 720, (lt - .3) / .8); stageFx(t); }, { grade: 'gold', bloom: .55, in: { type: 'pixelate', dur: .5 }, cam: push(160, 88, 1.02, 1.1) });
  shot('第一，谁给钱', (lt, t) => {
    darkStage(t, [160]);
    fx2Slam('谁给钱？', lt - .1, { size: 150, y: 190, pal: 'gold', out: 2.2, hit: .4 });
    frame(30, 60, 80, 50, { title: '客户', fill: CARD }); pxText('¥ 0', 70, 88, { size: 10, color: CREAM });
    frame(210, 60, 80, 50, { title: '公司', fill: CARD }); pxText('¥ 0', 250, 88, { size: 10, color: CREAM });
    const burn = since(t, '凭空烧掉了');
    if (after(t, '工资和算力成本')) { for (let i = 0; i < 6; i++) box(138 + (i % 3) * 14, FLOOR - 10 - Math.floor(i / 3) * 8, 14, 8, burn < 0 ? '#C8A86A' : '#5A3A2C'); chip('工资 + 算力', 160, 116, CREAM, 6); }
    if (burn >= 0) { flames(130, FLOOR - 4, 60, 30, t); pxFx({ type: 'glow', x: 160, y: FLOOR - 16, r: 50, a: .5, col: '#FF7A3A' }); fx2Stream('ember', t, { at: [160, FLOOR], w: 500, h: 700, n: 50 }); }
    cl(70, FLOOR, emo(t, [[0, 'neutral'], [at('凭空烧掉了'), 'scared']]));
  }, { grade: 'fire', bloom: .55, in: { type: 'flash', dur: .3 }, cam: (lt, t) => [160, 90, ramp(t, [[at('第一，谁给钱'), 1.05], [at('凭空烧掉了'), 1.35]])] });
  shot('才叫 AI 泡沫', (lt, t) => {
    sunburst(t, '#1E1424', '#2E1E34', 160, 90);
    const b = since(t, '泡沫');
    bubble(160, 76, 46, 'AI', t, b);
    if (b < 0) fx2Rays([160, 76], 0, t, { a: .15, col: [210, 190, 255] });
    burst('drop', t, '泡沫', { at: [160, 76], n: 70, speed: 1600, life: 1, col: '#CFE8FF', gravity: 700 });
    fx2Ring([160, 76], 0, b, { r: 700 });
    slam('AI 泡沫', t, '泡沫', { size: 190, y: 700, pal: 'sky', flash: .4 });
    cl(236, FLOOR, emo(t, [[0, 'suspicious'], [at('泡沫'), 'furious']]));
  }, { grade: 'neon', bloom: .5, in: { type: 'cut' }, cam: (lt, t) => [160, 90, ramp(t, [[at('才叫 AI 泡沫'), 1.25], [at('泡沫'), 1.05]])] });
  shot('谁考核', (lt, t) => {
    office(t, { phase: .6 });
    fx2Slam('谁考核？', lt - .05, { size: 130, x: 1500, y: 150, pal: 'gold', out: 1.6, hit: .4, rot: .04 });
    frame(60, 24, 200, 100, { title: 'KPI 考核表', fill: CREAM });
    [['Demo 产出数量', 'check'], ['客户拜访次数', 'check'], ['真正上线了几个系统', 'cross']].forEach(([ph, ic], i) => { if (!after(t, ph)) return; const y = 46 + i * 24; pxText(i === 2 ? '上线系统' : ph, 140, y, { size: 7.5, color: i === 2 ? '#8C88A6' : INK, stroke: false }); icon(ic, 226, y, 2); if (since(t, ph) < .06) fx2Hit(.4); });
    slam('讽刺', t, '最他妈讽刺', { size: 150, x: 1560, y: 860, pal: 'red', rot: .06 });
    npc(30, FLOOR, null, SUIT); chip('销售总监', 30, FLOOR - 40, CREAM, 5.5);
    cl(290, FLOOR, { ...emo(t, [[0, 'suspicious'], [at('真正上线了几个系统'), 'angry']]), flip: true });
  }, { grade: 'warm', in: { type: 'whip', dur: .3 }, cam: (lt, t) => [160, ramp(t, [[at('谁考核'), 90], [at('Demo 产出数量'), 74]]), ramp(t, [[at('谁考核'), 1.05], [at('Demo 产出数量'), 1.3], [at('真正上线了几个系统') + .6, 1.3], [at('真正上线了几个系统') + 1.2, 1.05]])] });
  shot('这就他妈非常魔幻了', (lt, t) => {
    darkStage(t, [160]);
    const sp = 2 + Math.max(0, since(t, '你越能通宵搓')) * 2.5, s2 = Math.min(sp, 14);
    wheel(160, 92, 46, t, s2);
    cl(160, 132, { ...emo(t, [[0, 'nervous'], [at('越停不下来'), 'dizzy']]), view: 'side', walk: t * s2 * .9, noShadow: true, emote: 'sweat', emoteK: 1 });
    fx2Speed([160, 92], 0, t, Math.min(1, (s2 - 2) / 12));
    if (after(t, '你越能通宵搓')) chip('通宵搓 Demo', 60, 50, GOLDL, 7);
    if (after(t, '领导越夸你')) { chip('领导夸你', 260, 50, PINK, 7); fx2Stream('heart', t, { at: [260, 60], w: 200, h: 300, n: 10 }); }
    if (after(t, '越停不下来')) chip('停不下来', 260, 120, CREAM, 7);
    slam('交付 0', t, '真正的交付', { size: 170, y: 820, pal: 'red', flash: .35 });
    roll(t, '这就他妈非常魔幻了', .05, 3);
  }, { grade: 'neon', bloom: .5, in: { type: 'glitch', dur: .3 }, cam: (lt, t) => [160, 92, ramp(t, [[at('这就他妈非常魔幻了'), 1.25], [at('你越能通宵搓'), 1.05], [at('真正的交付'), 1.05], [at('真正的交付') + .3, 1.2]])] });
  shot('第三，谁占便宜', (lt, t) => {
    sunburst(t, '#8A4A6A', '#B86A8A', 80, 50);
    hg(76, PH + 10, { ...emo(t, [[0, 'smug'], [at('真他妈绝了'), 'laugh']]), poseL: 'clasp', poseR: 'clasp' });
    fx2Stream('coin', t, { n: 30, speed: .6 });
    fx2Slam('谁占便宜？', lt - .05, { size: 120, x: 1380, y: 180, pal: 'gold', out: 2, hit: .4 });
    slam('绝了', t, '真他妈绝了', { size: 190, x: 1440, y: 560, pal: 'red', flash: .25, rot: .07 });
  }, { res: [160, 90], grade: 'dream', bloom: .5, in: { type: 'flash', dur: .3 }, cam: push(70, 50, 1.0, 1.15) });
  shot('圈子里还有更恶心的', (lt, t) => {
    hall(t);
    frame(30, 40, 70, 50, { title: 'Demo 截图', fill: '#1A1C30' }); R(38, 56, 54, 4, SKY); R(38, 64, 34, 4, GOLDL); R(38, 72, 44, 4, PINK);
    const cmp = since(t, '恶意比价');
    if (cmp >= 0) for (let i = 0; i < 3; i++) { const k = pop(cmp - i * .3, .3); if (k <= 0) continue; const x = 140 + i * 56; frame(x - 22, Math.round(lerp(100, 40, k)), 44, 34, { fill: '#1A1C30' }); chip(['¥¥¥', '¥¥', '¥'][i], x, Math.round(lerp(100, 40, k)) + 44, i === 2 ? PINK : CREAM, 6); const l = cmp - i * .3; if (l > 0 && l < .1) fx2Flash(.25); }
    if (after(t, '谁报价低')) { pxText('↓', 252, 124, { size: 10, color: RED }); icon('check', 252, 26, 2); }
    slam('照着抄', t, '照着抄一份', { size: 160, y: 860, pal: 'red', rot: .05 });
    npc(66, FLOOR, null, SUIT); chip('甲方', 66, FLOOR - 40, CREAM, 6);
  }, { grade: 'warm', in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('圈子里还有更恶心的'), 70], [at('恶意比价'), 180]]), 86, ramp(t, [[at('圈子里还有更恶心的'), 1.35], [at('恶意比价'), 1.1]])] });
  shot('还有的甲方更孙子', (lt, t) => {
    office(t, { phase: lt * .4 });
    npc(70, FLOOR, null, SUIT); chip('甲方', 70, FLOOR - 40, CREAM, 6);
    ['选型？', '架构？', '评测？', '链路？', '运维？'].forEach((q, i) => { const l = lt - .6 - i * .7; if (l < 0) return; chip(q, 110 + (i % 2) * 30, 30 + i * 14 - Math.round((1 - pop(l, .2)) * 6), i % 2 ? SKY : GOLDL, 6); });
    if (after(t, '白嫖你三个月')) { const p = Math.min(3, 1 + Math.floor(since(t, '白嫖你三个月') * 2)); frame(220, 30, 70, 40, { title: '日历', fill: CREAM }); pxText(`第 ${p} 个月`, 255, 52, { size: 7, color: INK, stroke: false }); }
    cl(200, FLOOR - 2, { ...emo(t, [[0, 'happy'], [at('全摸透了'), 'suspicious']]), ...typing(t, 6) });
    slam('全摸透了', t, '全摸透了', { size: 130, y: 860, pal: 'pink', burst: false, hit: .35 });
  }, { grade: 'warm', in: { type: 'cut' }, cam: (lt, t) => [ramp(t, [[at('还有的甲方更孙子'), 100], [at('白嫖你三个月'), 220]]), 90, 1.2] });
  shot('转头在校招上', (lt, t) => {
    hall(t);
    npc(90, FLOOR, null, '#5A3A4A'); npc(118, FLOOR, null, '#5A3A4A'); if (after(t, '应届牛马')) chip('应届牛马', 104, FLOOR - 44, CREAM, 6);
    const wob = Math.round(Math.sin(t * 6) * 2);
    if (after(t, '搭了个猴版')) { for (let i = 0; i < 4; i++) box(180 + wob * (i % 2) + i, FLOOR - 12 - i * 12, 40 - i * 4, 12, i % 2 ? '#7A5A3A' : '#8A6A4A'); chip('猴版产品', 200, 40, PINK, 8); }
    cl(270, FLOOR, emo(t, [[0, 'surprised'], [at('你说你咋整'), 'ko']]));
    slam('咋整？', t, '你说你咋整', { size: 180, y: 380, pal: 'red', flash: .25 });
    roll(t, '你说你咋整', -.06);
  }, { grade: 'warm', in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('转头在校招上'), 104], [at('搭了个猴版'), 200], [at('你说你咋整'), 250]]), 96, 1.3] });
  shot('然后这些个甲方', (lt, t) => {
    curtain(t, 1); spot(160, t); stageFx(t);
    const slap = since(t, '一拍脑门');
    hg(160, FLOOR, emo(t, [[0, 'confused'], [at('一拍脑门'), 'idea']], slap >= 0 ? { poseR: 'cover', capPop: slap < .3 ? 1 : 0 } : { emote: '?', emoteK: 1 }));
    if (after(t, '大老板')) chip('大老板 · 黑哥饰', 160, 40, GOLDL, 6);
    if (slap >= 0) { fx2Ring([160, FLOOR - 80], 0, slap, { r: 500 }); fx2Speed([160, FLOOR - 80], 0, t, Math.max(0, 1 - slap * 1.5)); if (slap < .08) fx2Hit(.7); }
    slam('今年也得搞 AI！', t, '我们今年也得搞 AI', { size: 130, y: 820, pal: 'gold', stagger: .04, flash: .25 });
  }, { grade: 'gold', in: { type: 'iris', dur: .4 }, cam: (lt, t) => [160, ramp(t, [[at('然后这些个甲方'), 96], [at('一拍脑门'), 76]]), ramp(t, [[at('然后这些个甲方'), 1.1], [at('一拍脑门'), 1.4], [at('我们今年也得搞 AI'), 1.1]])] });
  shot('下面的人自己都不知道要什么', (lt, t) => {
    hall(t);
    for (let i = 0; i < 4; i++) { npc(50 + i * 26, FLOOR, null, SUIT); pxText('?', 50 + i * 26, FLOOR - 40 + Math.round(Math.sin(t * 4 + i) * 2), { size: 8, color: GOLDL }); }
    if (after(t, '傻小子小年轻乙方')) { for (let i = 0; i < 3; i++) cl(200 + i * 40, FLOOR, { ...feelT('happy', t), dy: -Math.abs(Math.round(Math.sin(t * 6 + i) * 3)) }); chip('乙方', 240, 50, CREAM, 8); }
    if (after(t, '免费做个 Demo')) chip('免费做个 Demo', 240, 30, PINK, 8);
  }, { grade: 'warm', in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('下面的人自己都不知道要什么'), 90], [at('傻小子小年轻乙方'), 230]]), 92, 1.25] });
  shot('更可悲的是', (lt, t) => {
    curtain(t, 1); spot(90, t);
    frame(30, 40, 70, FLOOR - 40, { fill: '#0E0A20' }); pxText('甲方', 65, 56, { size: 9, color: GOLDL });
    for (let i = 0; i < 6; i++) npc(140 + i * 26, FLOOR, lt * 2 + i, i % 2 ? '#5A3A4A' : '#4A2A36');
    const out = since(t, '有的是人干');
    cl(out < 0 ? 112 : 112 + out * 160, FLOOR - (out < 0 ? 0 : Math.round(Math.sin(clamp(out) * Math.PI) * 30)), emo(t, [[0, 'nervous'], [at('有的是人干'), 'ko']]));
    if (after(t, '卷到极致')) chip('卷到极致', 200, 50, PINK, 8);
    slam('有的是人干', t, '有的是人干', { size: 160, y: 300, pal: 'red', stagger: .05, flash: .3 });
    if (out >= 0 && out < 1) fx2Streaks(t, 1 - out, { dir: 1, speed: -2600 });
  }, { grade: 'noir', in: { type: 'wipe', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('更可悲的是'), 120], [at('有的是人干'), 160]]), 96, ramp(t, [[at('更可悲的是'), 1.3], [at('有的是人干'), 1.08]])] });

  // ================= 健康的 FDE =================
  shot('但我朋友也说', (lt, t) => {
    vgrad(0, PW, 0, FLOOR, [[0, '#2A1440'], [FLOOR, '#C86A5A']]); vgrad(0, PW, FLOOR, PH, [[0, '#4A2C1C'], [30, '#2A1810']]);
    pellipse(300, 40, 26, 26, '#FFD890'); R(0, FLOOR - 4, PW, 4, '#6A4028');
    const M = [['一棍子全打死', 40, 'Demo'], ['付费试点', 120, '付费试点'], ['真金白银的上线', 200, '上线'], ['标准化复用', 280, '复用']];
    M.forEach(([ph, x, w], i) => { const on = after(t, ph); frame(x - 26, FLOOR - 50, 52, 22, { fill: on ? '#3A2418' : '#1A1220' }); pxText(w, x, FLOOR - 39, { size: 6.5, color: on ? GOLDL : '#8C88A6' }); if (on) { pxFx({ type: 'glow', x, y: FLOOR - 39, r: 26, a: .4 }); if (i) fx2Burst('star', since(t, ph), { at: [x, FLOOR - 39], n: 14, speed: 500, life: .8 }); } if (i < 3) pxText('→', x + 40, FLOOR - 39, { size: 7, color: on ? GOLDL : '#5A4A6A' }); });
    const keys = M.map(m => [at(m[0]), m[1]]).filter(k => k[0] != null);
    const w = walker(t, keys.length ? keys : [[0, 40]]);
    cl(w.x, FLOOR - 4, w.moving ? { ...feelT('happy', t), view: 'side', walk: w.x / 10 } : feelT('hopeful', t));
    for (let i = 0; i < 4; i++) if (after(t, '付费试点')) coin(w.x - 26 - i * 10, FLOOR - 12 - Math.abs(Math.round(Math.sin(t * 6 + i) * 4)));
    fx2Rays(1800, 240, t, { a: .2 });
  }, { grade: 'warm', bloom: .55, in: { type: 'pixelate', dur: .5 }, cam: (lt, t) => [ramp(t, [[at('但我朋友也说'), 100], [at('付费试点'), 120], [at('真金白银的上线'), 200], [at('标准化复用'), 220]]), 100, 1.3] });
  shot('人家的 Demo 不叫免费', (lt, t) => {
    hall(t); stageFx(t);
    frame(90, 36, 140, 40, { fill: CREAM });
    const inv = since(t, '前置投资');
    if (inv < .3) pxText('免费', 160, 56, { size: 12, color: inv >= 0 ? '#8C88A6' : RED, stroke: false });
    burst('shard', t, '前置投资', { at: [160, 56], n: 50, speed: 1000, col: '#FFF1C9' });
    slam('前置投资', t, '前置投资', { size: 180, y: 360, pal: 'gold', flash: .3, stagger: .05 });
    const back = since(t, '屁股后面跟着钱');
    cl(back < 0 ? 160 : 160 + back * 50, FLOOR, back < 0 ? feelT('proud', t) : { ...feelT('happy', t), view: 'side', walk: back * 6 });
    if (back >= 0) for (let i = 0; i < 6; i++) coin(160 + back * 50 - 30 - i * 12, FLOOR - 8 - Math.abs(Math.round(Math.sin(t * 6 + i) * 4)));
  }, { grade: 'gold', bloom: .55, in: { type: 'cut' }, cam: (lt, t) => [ramp(t, [[at('人家的 Demo 不叫免费'), 160], [at('屁股后面跟着钱'), 200]]), 84, ramp(t, [[at('人家的 Demo 不叫免费'), 1.2], [at('前置投资'), 1.3], [at('屁股后面跟着钱'), 1.1]])] });
  shot('说白了，正规特种兵', (lt, t) => {
    hall(t);
    card(20, 24, 136, 110, '正规特种兵', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#0E0A20'], [h, '#2A1C44']]); cl(x + w / 2, y + h, { ...feelT('cool', t), noShadow: true }); for (let i = 0; i < 3; i++) coin(x + 20 + i * 12, y + 20); }, pop(lt, .3));
    const k2 = after(t, '大冤种', -.3) ? pop(since(t, '大冤种') + .3, .3) : 0;
    card(164, 24, 136, 110, '大冤种', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#3A2418'], [h, '#5A3A2C']]); cl(x + w / 2, y + h, { ...feelT('cry', t), noShadow: true }); }, k2);
    slam('有没有下一步？', t, '到底有没有下一步', { size: 130, y: 900, pal: 'gold', stagger: .04, flash: .2 });
  }, { grade: 'gold', in: { type: 'wipe', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('说白了，正规特种兵'), 88], [at('大冤种') - .1, 88], [at('大冤种') + .4, 232], [at('到底有没有下一步'), 232], [at('到底有没有下一步') + .4, 160]]), ramp(t, [[at('到底有没有下一步'), 80], [at('到底有没有下一步') + .4, 96]]), ramp(t, [[at('说白了，正规特种兵'), 1.3], [at('到底有没有下一步'), 1.3], [at('到底有没有下一步') + .4, 1.03]])] });

  // ================= 四 保命三句 =================
  shot('所以他现在彻底长记性了', (lt, t) => { title('四', '保命三句', 'shield')(lt, t); fx2Rays(960, 560, t, { a: .22 }); fx2Shine(420, 400, 1500, 720, (lt - .3) / .8); stageFx(t); }, { grade: 'gold', bloom: .55, in: { type: 'pixelate', dur: .5 }, cam: push(160, 88, 1.02, 1.1) });
  shot('如果你也在看这类岗位', (lt, t) => {
    curtain(t, 1); spot(110, t); spot(230, t, { a: .25 }); stageFx(t);
    hg(110, FLOOR, { ...emo(t, [[0, 'determined'], [at('赶紧记下来'), 'excited']]), poseR: 'point' });
    if (after(t, '赶紧记下来')) { frame(190, 40, 80, 70, { title: '小本本', fill: CREAM }); for (let i = 0; i < 3; i++) R(200, 60 + i * 12, Math.round(Math.min(60, since(t, '赶紧记下来') * 40 - i * 20)), 2, INK); fx2Rays([230, 75], 0, t, { a: .22 }); }
    if (after(t, '被坑的经验')) chip('被坑出来的经验', 230, 128, PINK, 7);
  }, { grade: 'gold', in: { type: 'iris', dur: .4 }, cam: push(170, 96, 1.05, 1.25) });
  const scroll = (n, lines, t, lt) => { const k = over(lt / .5), y = Math.round(lerp(180, 14, k)); frame(40, y, 240, 66, { title: `第${n}句`, fill: CREAM }); lines.forEach((l, i) => pxText(l, 160, y + 24 + i * 16, { size: 8, color: INK, stroke: false })); };
  shot('第一句', (lt, t) => {
    darkStage(t, [160]); scroll('一', ['Demo 做完之后', '有没有预算和上线时间表？'], t, lt);
    fx2Shine(240, 84, 1680, 480, (lt - .5) / .8); fx2Rays(960, 280, t, { a: .15 });
    cl(160, FLOOR, emo(t, [[0, 'thinking'], [at('如果没有，别扯淡'), 'angry'], [at('纯牛马'), 'ko']]));
    if (after(t, '如果没有，别扯淡')) stall(160, t, { sign: '免费试吃' });
    slam('纯牛马', t, '纯牛马', { size: 180, x: 1500, y: 760, pal: 'red', flash: .3, rot: .06 });
  }, { grade: 'gold', in: { type: 'flash', dur: .3 }, cam: (lt, t) => [160, ramp(t, [[at('第一句'), 70], [at('如果没有，别扯淡'), 100]]), ramp(t, [[at('第一句'), 1.15], [at('如果没有，别扯淡'), 1.05]])] });
  shot('第二句', (lt, t) => {
    darkStage(t, [160]); scroll('二', ['绩效看什么？', 'Demo 数量，还是上线数量？'], t, lt);
    fx2Shine(240, 84, 1680, 480, (lt - .5) / .8); fx2Rays(960, 280, t, { a: .15 });
    const run = since(t, '赶紧跑');
    cl(run < 0 ? 160 : 160 + run * 180, FLOOR, run < 0 ? emo(t, [[0, 'thinking'], [at('全看 Demo 数量'), 'scared']]) : { ...feelT('scared', t), view: 'side', walk: run * 10 });
    if (run >= 0) { fx2Streaks(t, Math.max(0, 1 - run), { dir: 1, speed: -3000 }); burst('dust', t, '赶紧跑', { at: [160, FLOOR], n: 12, speed: 500, dir: Math.PI, arc: 1, life: .8 }); }
    slam('赶紧跑！', t, '赶紧跑', { size: 190, x: 760, y: 760, pal: 'red', flash: .3, rot: -.06 });
  }, { grade: 'gold', in: { type: 'flash', dur: .3 }, cam: (lt, t) => [ramp(t, [[at('第二句'), 160], [at('赶紧跑'), 160], [at('赶紧跑') + .8, 220]]), ramp(t, [[at('第二句'), 70], [at('全看 Demo 数量'), 100]]), ramp(t, [[at('第二句'), 1.15], [at('全看 Demo 数量'), 1.05]])] });
  shot('第三句', (lt, t) => {
    darkStage(t, [160]);
    const show = since(t, '陪着老板在装逼');
    if (show < 0) { scroll('三', ['肯不肯给真实数据', '和系统底层权限？'], t, lt); fx2Shine(240, 84, 1680, 480, (lt - .5) / .8); fx2Rays(960, 280, t, { a: .15 }); cl(160, FLOOR, emo(t, [[0, 'thinking'], [at('如果不肯给'), 'suspicious']])); }
    else { curtain(t, 1); spot(160, t, { w: 80 }); const j = jump(onTwos(t), at('陪着老板在装逼'), at('陪着老板在装逼') + .6, 18); hg(160, FLOOR, { ...feelT('smug', t), dy: j.dy, sq: j.sq, poseL: 'up', poseR: 'up' }); chip('老板 · 看杂技', 160, 40, GOLDL, 7); [50, 270].forEach((bx, i) => cl(bx, FLOOR, { ...feelT('bored', t), aL: Math.floor(t * 4 + i) % 2 ? 1.2 : .2, aR: Math.floor(t * 4 + i) % 2 ? 1.2 : .2 })); fx2Stream('confetti', t, { n: 40 }); fx2Rays([160, FLOOR - 60], 0, t, { a: .25 }); }
    slam('装X', t, '陪着老板在装逼', { size: 200, x: 1500, y: 420, pal: 'pink', flash: .3, rot: .07 });
  }, { grade: 'gold', in: { type: 'flash', dur: .3 }, cam: (lt, t) => after(t, '陪着老板在装逼') ? [160, 96, 1.05] : [160, ramp(t, [[at('第三句'), 70], [at('如果不肯给'), 100]]), ramp(t, [[at('第三句'), 1.15], [at('如果不肯给'), 1.05]])] });

  // ================= 写在最后 =================
  shot('前几天，他默默把', (lt, t) => {
    vgrad(0, PW, 0, PH, [[0, '#0A0A14'], [PH, '#1A1A2A']]);
    const del = since(t, '朋友圈删了');
    post(80, 45, '上岸！', t, { likes: 99, del: del < 0 ? 0 : clamp(del / .8) });
    if (del >= 0) { icon('trash', 134, 66, 2); burst('shard', t, '朋友圈删了', { at: [80, 45], n: 50, speed: 700, life: 1.6, col: '#C8C0D8' }); }
    fx2Bars(1);
  }, { res: [160, 90], grade: 'cold', bloom: .3, in: { type: 'pixelate', dur: .6 }, cam: push(80, 45, 1.05, 1.25) });
  shot('所以观众姥爷们记住了', (lt, t) => {
    hall(t); stageFx(t);
    card(20, 24, 136, 110, '路边试吃', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#3A2418'], [h, '#5A3A2C']]); for (let j = 0; j < 4; j++) pellipse(x + 30 + j * 20, y + 50, 4, 3, '#C0483A'); pxText('免费', x + w / 2, y + 22, { size: 8, color: CREAM }); }, pop(lt, .3));
    const k2 = after(t, '真金白银#3', -.3) ? pop(since(t, '真金白银#3') + .3, .3) : 0;
    card(164, 24, 136, 110, '点餐', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#E8A06A'], [h, '#C08A5C']]); frame(x + 30, y + 20, 66, 44, { fill: CREAM }); pxText('菜单', x + 63, y + 34, { size: 6, color: INK, stroke: false }); for (let i = 0; i < 3; i++) coin(x + 44 + i * 18, y + 54); }, k2);
    slam('点餐！', t, '才叫点餐', { size: 220, y: 560, pal: 'gold', flash: .4 });
    burst('coin', t, '才叫点餐', { x: 960, y: 560, n: 50, speed: 1500, life: 2 }); burst('confetti', t, '才叫点餐', { x: 960, y: 560, n: 80, speed: 1700, life: 2.2 });
  }, { grade: 'gold', bloom: .55, in: { type: 'wipe', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('所以观众姥爷们记住了'), 160], [at('路边试吃'), 88], [at('真金白银#3') - .1, 88], [at('真金白银#3') + .4, 232], [at('才叫点餐'), 232], [at('才叫点餐') + .3, 160]]), 82, ramp(t, [[at('所以观众姥爷们记住了'), 1.03], [at('路边试吃'), 1.3], [at('才叫点餐'), 1.3], [at('才叫点餐') + .3, 1.03]])] });
  shot('你上一次免费帮人', (lt, t) => {
    sunburst(t, '#5A1420', '#7A1C2A', 80, 50);
    hg(76, PH + 10, { ...feelT('thinking', t), poseR: 'point' });
    slam('你的血泪史？', t, '血泪史', { size: 110, x: 1380, y: 220, pal: 'cream', burst: false, hit: .3 });
    if (after(t, '血泪史')) fx2Stream('rain', t, { n: 30, speed: .8 });
  }, { res: [160, 90], grade: 'warm', in: { type: 'slide', dur: .3 }, cam: push(80, 48, 1.0, 1.12) });
  shot('我会继续更新', (lt, t) => {
    curtain(t, 1); spot(130, t); spot(210, t); stageFx(t, { n: 18, a: .18 });
    hg(130, FLOOR, { ...feelT('happy', t), poseR: 'wave' }); cl(210, FLOOR, feelT('happy', t));
    chip('打工人 × AI', 170, 40, GOLDL, 9);
    if (after(t, '感谢关注')) fx2Stream('heart', t, { x: 1000, y: 1000, w: 1400, h: 900, n: 30 });
  }, { grade: 'warm', bloom: .5, in: { type: 'dissolve', dur: .35 }, cam: push(170, 100, 1.1, 1.25) });
  shot('下一期咱们聊聊', (lt, t) => {
    hall(t); stageFx(t);
    frame(80, 24, 160, 110, { title: '下期', fill: '#1A1C30' });
    cl(130, 116, { ...feelT('nervous', t), noShadow: true }); chip('码农朋友', 130, 44, CREAM, 6);
    if (after(t, '码农明知道这行邪门')) chip('邪门', 200, 60, PINK, 8);
    fx2Shine(480, 144, 1440, 804, (lt - .4) / .8);
    slam('舍不得走？', t, '舍不得走', { size: 130, y: 880, pal: 'gold', stagger: .05 });
  }, { grade: 'neon', in: { type: 'zoom', dur: .45 }, cam: push(160, 80, 1.05, 1.25) });
  shot('喜欢的话点赞收藏不迷路', (lt, t) => {
    curtain(t, 1); spot(160, t, { w: 110 }); stageFx(t);
    [['heart', 100, '点赞'], ['star', 160, '收藏'], ['bolt', 220, '转发']].forEach(([ic, x, w], i) => { const k = pop(lt - i * .5, .3); if (k <= 0) return; const y = Math.round(lerp(150, 60, k) + Math.sin(t * 3 + i) * 2); icon(ic, x, y, 3); pxFx({ type: 'glow', x, y, r: 24, a: .45 }); chip(w, x, y + 26, GOLDL, 7); fx2Burst('star', lt - i * .5, { at: [x, y], n: 16, speed: 600, life: .9 }); });
    if (after(t, '转 FDE 的朋友')) chip('转发给想转 FDE 的朋友', 160, 30, CREAM, 7);
    cl(270, FLOOR, { ...feelT('happy', t), aR: 1.3 });
  }, { grade: 'gold', bloom: .55, in: { type: 'dissolve', dur: .35 }, cam: push(160, 92, 1.05, 1.15) });
  shot('我是黑哥', (lt, t) => {
    const end = D.len - t, close = end < 1.8 ? 1 - end / 1.8 : 0;
    curtain(t, 1); spot(160, t, { w: 100 }); stageFx(t, { n: 18, a: .18 });
    hg(130, FLOOR, { ...emo(t, [[0, 'happy'], [at('只说真话'), 'cool']]), poseR: after(t, '只说真话') ? 'fistUp' : 'wave' });
    cl(210, FLOOR, feelT('happy', t));
    if (after(t, '不吹 AI')) chip('不吹 AI 也不恐惧 AI', 170, 40, GOLDL, 7);
    curtainCloth(t, 1 - close);
    if (after(t, '只说真话')) stamp('只说真话', 170, 70, since(t, '只说真话'), 9);
    burst('confetti', t, '只说真话', { x: 960, y: 300, n: 90, speed: 1500, life: 2.4 });
    fx2Rays(960, -60, t, { a: .2 });
  }, { grade: 'warm', bloom: .55, in: { type: 'iris', dur: .4 }, cam: (lt, t) => [170, 100, ramp(t, [[at('我是黑哥'), 1.1], [D.len - 1.8, 1.2], [D.len - .3, 1.02]])] });

  // ---------- the chapter bar and the gold words ----------
  const chapters = [['上岸', 0], ['FDE 是个啥', at('FDE，听起来')], ['免费演示工程师', at('可我这朋友干了半年')], ['魔幻半年', at('刚入职第一周')], ['免费试吃摊', at('他就跟我吐槽')], ['三个谁', at('后来他把这里面的猫腻')], ['健康的 FDE', at('但我朋友也说')], ['保命三句', at('所以他现在彻底长记性了')], ['写在最后', at('前几天，他默默把')]];
  const keys = ['FDE', '上岸', '火坑', '前沿部署工程师', 'Palantir', '技术特种兵', '屎山代码', '疯狂招聘', 'Free Demo Engineer', '免费演示工程师', '免费试吃摊', '免费苦力', '保命真话', '大饼', '尖刀连', '30 分钟', 'deepseek', '半价', 'token', '报销', 'Demo', '没有然后', '七八个', '一单都没有', '香肠', '开张', '真实数据', '系统权限', '弟弟', '谁给钱', 'AI 泡沫', '谁考核', 'KPI', '谁占便宜', '恶意比价', '猴版', '有的是人干', '付费试点', '前置投资', '下一步', '预算', '上线时间表', '绩效', '赶紧跑', '点餐', '血泪史', '舍不得走', '只说真话'];
  LOOPS.pxFde = () => {};
  Object.assign(LOOPS.pxFde, { len: D.len, film: K.film({ chapters, keys, post: true }) });
})();
