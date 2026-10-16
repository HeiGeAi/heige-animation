// pixel/scenes/fde.js: 「FDE 免费演示工程师」 as a 像素游戏动画 (pixel game animation), the second story in the 我的精神状态
// set after manong3.js: 黑哥 hosts and plays the boss and the client; Clawd plays the product-manager friend who landed an
// FDE job and found out it means Free Demo Engineer; DeepSeek works the night shift with him. Same look as manong3.js:
// the velvet stage, the gold UI, a chapter bar, gold words in the subtitles, a camera on every shot.
//   node render.mjs --page=pixel.html --loop=pxFde --clip --fps=24 --out=out/video/fde/picture.mp4
(() => {
  if (!window.FDE) return;
  const D = FDE, K = pxGame(D);
  const { at, after, since, R, GOLD, GOLDL, GOLDD, INK, CARD, CREAM, RED, PINK, SKY, vgrad, box, out3, pop, over, kick, ramp, vlen, hg, cl, ds, feelT, emo, icon, typing, walker, sparkle, frame, chip, chipL, stamp, card, spot, curtain, curtainCloth, darkStage, sunburst, hall, pedestal, office, desk, bedroom, serverRoom, examHall, examDesks, bar, barTop, street, npc, hp, cloud, charCard, shot, push, title } = K;
  const ORANGE = '#FF8A3A', SUIT = '#2A2238', BROWN = '#8A5A3C';

  // ---------- props for this story ----------
  // flames along a strip: red body, orange heart, gold tips, flickering per column
  const flames = (x, y, w, h, t) => { for (let i = 0; i < w; i++) { const hh = Math.round(h * (.4 + .6 * Math.abs(Math.sin(t * 7 + i * .9 + hash(i) * 6)))); R(x + i, y - hh, 1, hh, RED); const h2 = Math.round(hh * .6); R(x + i, y - h2, 1, h2, ORANGE); const h3 = Math.round(hh * .25); R(x + i, y - h3, 1, h3, GOLDL); } };
  const pit = (cx, t, w = 60) => { pellipse(cx, FLOOR + 2, w / 2 + 3, 8, INK); pellipse(cx, FLOOR + 2, w / 2, 6, '#2A0A0A'); flames(cx - w / 2 + 4, FLOOR + 4, w - 8, 22, t); };
  // a tasting stall: striped awning, posts, a counter with a tray of sausage slices (draw it after whoever stands behind it)
  const stall = (cx, t, o = {}) => {
    const y = FLOOR;
    for (let k = 0; k < 10; k++) R(cx - 40 + k * 8, y - 66, 8, 9, k % 2 ? CREAM : RED);
    for (let k = 0; k < 10; k++) pellipse(cx - 36 + k * 8, y - 57, 4, 2, k % 2 ? CREAM : RED);
    R(cx - 38, y - 57, 2, 32, '#5A3A2C'); R(cx + 36, y - 57, 2, 32, '#5A3A2C');
    box(cx - 40, y - 26, 80, 26, '#8A4A3A'); R(cx - 39, y - 25, 78, 1, '#B8705A');
    if (o.sign !== false) { frame(cx - 22, y - 20, 44, 14, { fill: CREAM }); pxText(o.sign || '免费试吃', cx, y - 13, { size: 5.5, color: RED, stroke: false }); }
    const n = o.slices ?? 5; for (let j = 0; j < n; j++) pellipse(cx - 18 + j * 9, y - 29, 3, 2, '#C0483A');
  };
  const coin = (x, y) => { pellipse(x, y, 4, 4, GOLDD); pellipse(x, y, 3, 3, GOLD); R(Math.round(x) - 1, Math.round(y) - 2, 1, 3, GOLDL); };
  // a phone held up close: a feed post with a caption, likes ticking up; del from 0..1 crumbles it
  const phone = (cx, cy, txt, t, o = {}) => {
    box(cx - 34, cy - 50, 68, 100, '#1A1420'); R(cx - 30, cy - 44, 60, 84, CREAM); R(cx - 6, cy - 48, 12, 2, '#3A3040');
    pxText('朋友圈', cx, cy - 37, { size: 5, color: INK, stroke: false }); R(cx - 30, cy - 31, 60, 1, '#D8C8A8');
    const del = o.del ?? 0;
    if (del < 1) {
      const sh = Math.round(del * 30);
      cl(cx - 18, cy - 12 + sh, { ...feelT('happy', t), noShadow: true, sq: .5 });
      pxText(txt, cx + 8, cy - 4 + sh, { size: 9, color: RED, stroke: false });
      if (o.likes) { icon('heart', cx - 18, cy + 20 + sh, 1); pxText(`${o.likes}`, cx - 6, cy + 20 + sh, { size: 5, color: INK, stroke: false }); }
    }
    if (del > 0) for (let i = 0; i < 40; i++) pset(cx - 24 + Math.floor(hash(i) * 48), cy - 20 + Math.floor(hash(i + 5) * 30 + del * 40 * hash(i + 9)), del < .9 ? '#8C88A6' : CREAM);
  };
  // a wall calendar: one row of weekdays, each cell filled with a word when k reaches it
  const calendar = (x, y, days, t) => {
    frame(x, y, 200, 70, { title: '这周', fill: CREAM });
    const W = (200 - 14) / days.length;
    days.forEach(([d, word, col, on], i) => { const cx = x + 7 + W * i + W / 2; R(Math.round(x + 7 + W * i), y + 12, 1, 50, '#D8C8A8'); pxText(d, cx, y + 18, { size: 6, color: INK, stroke: false }); if (on) { const k = pop(on, .25); pxText(word, cx, y + 40 - Math.round((1 - k) * 8), { size: 9, color: col, stroke: false }); } });
  };
  // a hamster wheel turning at speed sp, with spokes
  const wheel = (cx, cy, r, t, sp) => { for (let a = 0; a < TAU; a += .02) { pset(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), GOLD); pset(Math.round(cx + Math.cos(a) * (r - 1)), Math.round(cy + Math.sin(a) * (r - 1)), GOLDD); } for (let k = 0; k < 8; k++) { const a = t * sp + k * TAU / 8; pline(cx, cy, cx + Math.cos(a) * r, cy + Math.sin(a) * r, '#6A4A2A'); } R(cx - 3, cy - 3, 6, 6, GOLDL); R(cx - 2, cy, 4, r + 8, '#5A3A2C'); };
  // a bubble with a word in it, wobbling; burst from 0 sprays droplets
  const bubble = (cx, cy, r, word, t, burst) => {
    if (burst < 0) { const rr = r + Math.sin(t * 4) * 2; for (let a = 0; a < TAU; a += .03) pset(Math.round(cx + Math.cos(a) * rr), Math.round(cy + Math.sin(a) * rr * .9), SKY); pellipse(cx - rr * .4, cy - rr * .4, 4, 3, CREAM); pxText(word, cx, cy, { size: 12, color: SKY }); }
    else for (let i = 0; i < 40; i++) { const a = hash(i) * TAU, d = r * (1 + burst * 3 * hash(i + 3)); pset(Math.round(cx + Math.cos(a) * d), Math.round(cy + Math.sin(a) * d * .9 + burst * burst * 40), SKY); }
  };
  const parachute = (cx, top) => { for (let k = 0; k < 7; k++) pellipse(cx - 18 + k * 6, top + 6, 4, 6, k % 2 ? CREAM : RED); R(cx - 21, top + 8, 42, 3, CREAM); for (let k = 0; k < 4; k++) pline(cx - 20 + k * 13, top + 10, cx - 6 + k * 4, top + 34, '#D8C8A8'); };

  // ================= 开场：上岸 =================
  // 1. the curtain opens on the host; the friend slides in when he's named
  shot(null, (lt, t) => {
    curtain(t, 0); spot(130, t, { a: .34 }); spot(220, t, { a: .3 });
    hg(130, FLOOR, { ...feelT('happy', t), poseR: 'wave' });
    if (lt > .5) chip('主持 · 黑哥', 130, 50, GOLDL, 6);
    const k = since(t, '产品经理的朋友');
    if (k >= 0) { const x = lerp(340, 220, out3(k / .6)); cl(x, FLOOR, k < .6 ? { ...feelT('neutral', t), view: 'side', walk: x / 10, flip: true } : feelT('happy', t)); if (k > .6) chip('产品经理朋友', 220, 92, CREAM, 6); }
    curtainCloth(t, clamp((lt - .1) / .7));
  }, { in: { type: 'cut' }, cam: (lt, t) => [ramp(t, [[0, 130], [at('产品经理的朋友') ?? 2, 130], [(at('产品经理的朋友') ?? 2) + .6, 176]]), 110, ramp(t, [[0, 1.25], [at('产品经理的朋友') ?? 2, 1.2], [(at('产品经理的朋友') ?? 2) + .6, 1.1]])] });
  // 2. the character card
  shot('去年底费了', (lt, t) => charCard(t, lt, (x, y) => cl(x, y, feelT('determined', t)), '产品经理朋友', ['Clawd 饰', '转岗 FDE', '九牛二虎之力'], ['#5A1420', '#7A1C2A']), { res: [160, 90], in: { type: 'slide', dur: .25 }, cam: push(80, 45, 1.0, 1.06) });
  // 3. pushing the boulder uphill . . . the offer lands in his hands
  shot('九牛二虎之力', (lt, t) => {
    vgrad(0, PW, 0, PH, [[0, '#2A1430'], [PH, '#8A4A4A']]);
    for (let x = 0; x < PW; x++) { const y = Math.round(160 - x * .32); R(x, y, 1, PH - y, '#3A2418'); R(x, y, 1, 1, '#6A4028'); }
    const got = since(t, '拿到了一个'), k = got < 0 ? clamp(lt / 3) * .55 : .55 + out3(got / .6) * .45, bx = lerp(70, 250, k), by = 160 - bx * .32;
    if (got < 0) { pellipse(bx + 18, by - 14, 16, 14, '#5A4A4A'); pellipse(bx + 14, by - 18, 6, 4, '#7A6A6A'); cl(bx - 8, by, { ...feelT('determined', t), view: 'side', walk: lt * 1.4, emote: 'sweat', emoteK: 1, aL: 1.2, aR: 1.2 }); }
    else { cl(bx, by, { ...feelT('starstruck', t), dy: -Math.round(Math.sin(clamp(got / .5) * Math.PI) * 10), aL: 1.4, aR: 1.4 }); const fy = lerp(-20, by - 58, out3(got / .5)); frame(bx - 22, fy - 12, 44, 24, { fill: CREAM }); pxText('FDE offer', bx, fy, { size: 5.5, color: INK, stroke: false }); pxFx({ type: 'glow', x: bx, y: fy, r: 34, a: .5 }); sparkle(bx, fy, 26, t, 12); }
  }, { in: { type: 'wipe', dur: .3 }, cam: (lt, t) => { const got = since(t, '拿到了一个'), k = got < 0 ? clamp(lt / 3) * .55 : .55 + out3(got / .6) * .45, bx = lerp(70, 250, k); return [bx, 160 - bx * .32 - 30, 1.35]; } });
  // 4. that night: a post with two words, 上岸, likes pouring in
  shot('拿到那天晚上', (lt, t) => {
    bedroom(t, { phone: true });
    const up = since(t, '上岸#1');
    cl(226, FLOOR - 24, { ...emo(t, [[0, 'happy'], [at('上岸#1'), 'excited']]), aR: 1.3 });
    const k = pop(lt - .8, .4);
    if (k > 0) { pxFx({ type: 'glow', x: 160, y: 86, r: 60, a: .3 }); phone(160, Math.round(lerp(220, 88, k)), up >= 0 ? '上岸！' : '', t, { likes: up >= 0 ? Math.min(99, Math.floor(up * 30)) : 0 }); }
    if (up >= 0) { for (let i = 0; i < 10; i++) { const ph = (up * 1.2 + hash(i)) % 1; icon('heart', 110 + hash(i + 3) * 100, 140 - ph * 120, 1); } kick(up, 2.5); }
  }, { in: { type: 'iris', dur: .45 }, cam: (lt, t) => [ramp(t, [[at('拿到那天晚上'), 210], [at('拿到那天晚上') + .8, 160]]), ramp(t, [[at('拿到那天晚上'), 110], [at('拿到那天晚上') + .8, 90]]), ramp(t, [[at('拿到那天晚上'), 1.3], [at('拿到那天晚上') + .8, 1.15], [at('上岸#1'), 1.15], [at('上岸#1') + .2, 1.4]])] });
  // 5. half a year later he deletes it
  shot('结果才干了半年', (lt, t) => {
    darkStage(t, [160]);
    const del = since(t, '给删了');
    phone(160, 84, '上岸！', t, { likes: 99, del: del < 0 ? 0 : clamp(del / .8) });
    if (del >= 0) { icon('trash', 226, 112, 3); chip('已删除', 160, 30, PINK, 8); kick(del, 2); }
    else chip('半年后', 160, 30, CREAM, 8);
    cl(76, FLOOR, emo(t, [[0, 'sad'], [at('给删了'), 'cry']]));
  }, { in: { type: 'dissolve', dur: .4 }, cam: push(150, 88, 1.15, 1.3) });
  // 6. not ashore at all: out of one fire pit into another
  shot('因为他发现', (lt, t) => {
    vgrad(0, PW, 0, FLOOR, [[0, '#1A0A0E'], [FLOOR, '#4A1418']]); vgrad(0, PW, FLOOR, PH, [[0, '#2A1A10'], [30, '#140C08']]);
    pit(90, t); pit(230, t);
    pxFx({ type: 'glow', x: 90, y: FLOOR, r: 50, a: .35, col: '#FF7A3A' }); pxFx({ type: 'glow', x: 230, y: FLOOR, r: 50, a: .35, col: '#FF7A3A' });
    const hop = since(t, '跳进了'), k = clamp(hop / .7);
    const x = hop < 0 ? 90 : lerp(90, 230, k), y = hop < 0 ? FLOOR - 2 + Math.round(Math.sin(t * 8)) : FLOOR - 2 - Math.round(Math.sin(k * Math.PI) * 60);
    cl(x, y, emo(t, [[0, 'scared'], [at('上岸#2'), 'angry'], [at('跳进了'), 'surprised'], [at('另一个火坑'), 'ko']], { emote: 'sweat', emoteK: 1 }));
    if (after(t, '上岸#2')) chip('上岸？', 160, 56, CREAM, 9);
    if (after(t, '另一个火坑')) { stamp('另一个火坑', 160, 70, since(t, '另一个火坑'), 9); kick(since(t, '另一个火坑'), 4); pxFx({ type: 'tint', col: '#FF2A2A', a: .1 * Math.max(0, 1 - since(t, '另一个火坑') * 2) }); }
  }, { in: { type: 'glitch', dur: .3 }, cam: (lt, t) => [ramp(t, [[at('因为他发现'), 90], [at('跳进了'), 90], [at('跳进了') + .7, 180]]), ramp(t, [[at('跳进了'), 100], [at('跳进了') + .7, 96]]), ramp(t, [[at('因为他发现'), 1.4], [at('跳进了'), 1.3], [at('跳进了') + .7, 1.1], [at('另一个火坑'), 1.25]])] });

  // ================= 一 FDE 是个啥 =================
  shot('FDE，听起来', title('一', 'FDE 是个啥', 'star'), { in: { type: 'slide', dur: .3 }, cam: push(160, 88, 1.02, 1.1) });
  // 7. the full name on a gold plate; 黑哥 points, the Chinese name drops under it
  shot('全称', (lt, t) => {
    hall(t);
    frame(56, 26, 208, 40, { title: '全称', fill: '#2A1418' });
    const words = ['Forward', 'Deployed', 'Engineer']; words.forEach((w, i) => { if (lt > .3 + i * .35) pxText(w, 100 + i * 60, 46, { size: 8, color: GOLDL }); });
    if (after(t, '前沿部署工程师')) { const k = pop(since(t, '前沿部署工程师'), .3); chip('前沿部署工程师', 160, Math.round(lerp(120, 84, k)), CREAM, 9); sparkle(160, 84, 50, t, 10); }
    hg(40, FLOOR, { ...feelT('happy', t), view: 'q', poseR: 'point' });
  }, { in: { type: 'wipe', dur: .3 }, cam: push(160, 80, 1.05, 1.2) });
  // 8. Palantir's special forces: a parachute drop out of the night sky
  shot('最早是硅谷的', (lt, t) => {
    vgrad(0, PW, 0, PH, [[0, '#0E0A20'], [PH, '#3A1E44']]);
    for (let i = 0; i < 30; i++) pset(Math.floor(hash(i) * PW), Math.floor(hash(i + 7) * 100), Math.sin(t * 3 + i) > .3 ? CREAM : '#8C88A6');
    for (let i = 0; i < 14; i++) { const h = 20 + Math.round(hash(i + 11) * 30); R(i * 24, FLOOR - h, 20, h, '#1A1220'); for (let j = 4; j < h; j += 7) if (hash(i * 5 + j) > .5) R(i * 24 + 4, FLOOR - h + j, 4, 2, GOLD); }
    R(0, FLOOR, PW, PH - FLOOR, '#2A1A10'); R(0, FLOOR, PW, 1, '#5A3A2C');
    const px = Math.round(-40 + lt * 70); box(px - 24, 46, 48, 10, '#5A5068'); R(px - 8, 40, 16, 22, '#4A4058'); R(px + 20, 40, 4, 8, '#4A4058');
    chip(after(t, 'Palantir') ? 'Palantir · 硅谷' : '硅谷', 80, 74, GOLDL, 7);
    const drop = since(t, '肉身空降'), k = drop < 0 ? 0 : clamp(drop / 1.4), y = drop < 0 ? 104 + Math.sin(t * 2) * 3 : lerp(104, FLOOR, out3(k));
    if (after(t, '技术特种兵')) { if (k < 1) parachute(220, y - 75); cl(220, y, { ...emo(t, [[0, 'cool'], [at('肉身空降') + 1.4, 'determined']]), noShadow: k < 1 }); chip('技术特种兵', 260, 58, CREAM, 7); }
    if (k >= 1) { kick(drop - 1.4, 3); sparkle(220, FLOOR - 4, 20, t, 8, CREAM); if (after(t, '客户现场')) chip('客户现场', 220, FLOOR - 52, GOLDL, 6); }
  }, { in: { type: 'dissolve', dur: .4 }, cam: (lt, t) => [ramp(t, [[at('最早是硅谷的'), 120], [at('技术特种兵'), 200]]), ramp(t, [[at('最早是硅谷的'), 80], [at('肉身空降'), 86], [at('肉身空降') + 1.4, 104]]), ramp(t, [[at('最早是硅谷的'), 1.1], [at('技术特种兵'), 1.2]])] });
  // 9. a mountain of legacy code; he forces the system to run
  shot('在客户留下的', (lt, t) => {
    office(t, { phase: .9, clockSpin: lt * 10 });
    for (let r = 0; r < 6; r++) for (let c = 0; c <= 5 - r; c++) box(176 + c * 16 + r * 8, FLOOR - 12 - r * 11, 16, 12, r % 2 ? '#7A4A30' : BROWN, '#4A2A18');
    for (let i = 0; i < 5; i++) pset(Math.round(220 + Math.cos(t * 6 + i) * 18), Math.round(FLOOR - 76 + Math.sin(t * 8 + i * 2) * 6), INK);
    if (after(t, '屎山代码')) chip('屎山代码', 228, 34, '#E8C08A', 8);
    const run = since(t, '强行跑通');
    cl(130, FLOOR - 2, { ...emo(t, [[0, 'disgusted'], [at('强行跑通'), 'determined']]), ...typing(t, run >= 0 ? 18 : 10) });
    desk(130, t, { cups: 4 });
    if (run >= 0) { icon('check', 228, FLOOR - 92, 3); pxFx({ type: 'glow', x: 228, y: FLOOR - 92, r: 26, a: .45 }); kick(run, 2); }
  }, { in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('在客户留下的'), 200], [at('强行跑通'), 180]]), 96, ramp(t, [[at('在客户留下的'), 1.35], [at('屎山代码'), 1.2], [at('强行跑通'), 1.1]])] });
  // 10. everyone grabbing for them: OpenAI, Anthropic, then big and small shops at home
  shot('这两年 OpenAI', (lt, t) => {
    hall(t);
    cl(160, FLOOR, emo(t, [[0, 'surprised'], [at('疯狂招聘'), 'starstruck']], { emote: '!', emoteK: 1 }));
    [['OpenAI', 60, 'OpenAI'], ['Anthropic', 260, 'Anthropic']].forEach(([ph, x, w], i) => { if (!after(t, ph, -.1)) return; const k = pop(since(t, ph) + .1, .3); chip(w, x, 40, SKY, 8); const hx = lerp(x, i ? 196 : 124, k * (.6 + .2 * Math.sin(t * 6))); R(Math.min(x, hx), FLOOR - 26, Math.abs(hx - x), 3, CREAM); R(Math.round(hx) - 3, FLOOR - 29, 6, 8, CREAM); npc(x, FLOOR, null, SUIT); });
    const home = since(t, '国内大厂小厂');
    if (home >= 0) for (let i = 0; i < 12; i++) { const lt2 = home - i * .15; if (lt2 < 0) continue; const y = Math.min(70 + (i % 3) * 14, -10 + lt2 * 400); chip(i % 2 ? '小厂' : '大厂', 40 + (i % 6) * 48, y, i % 2 ? CREAM : GOLDL, 6); }
    if (after(t, '疯狂招聘')) { stamp('疯狂招聘', 160, 112, since(t, '疯狂招聘'), 9); kick(since(t, '疯狂招聘'), 3); }
  }, { in: { type: 'wipe', dur: .35 }, cam: (lt, t) => [160, 92, ramp(t, [[at('这两年 OpenAI'), 1.2], [at('国内大厂小厂'), 1.03], [at('疯狂招聘'), 1.15]])] });
  // 11. a product manager drools: business, frontier tech, the front line of AI
  shot('多少产品经理', (lt, t) => {
    hall(t);
    const P = [['既懂业务', 'book', 70, '懂业务'], ['最前沿的技术', 'chip', 160, '前沿技术'], ['站在 AI 最前线', 'bolt', 250, 'AI 最前线']];
    P.forEach(([ph, ic, x, lab], i) => { pedestal(x); chip(lab, x, FLOOR - 10, GOLDL, 5.5); if (!after(t, ph, -.1)) return; const y = FLOOR - 44 - Math.round(over((since(t, ph) + .1) / .5) * 8) + Math.round(Math.sin(t * 3 + i) * 2); pxFx({ type: 'glow', x, y, r: 26, a: .45 }); sparkle(x, y, 18, t, 6); icon(ic, x, y, 3); });
    const drool = after(t, '流口水');
    const w = walker(t, [[at('多少产品经理'), -20], [at('多少产品经理') + 1.3, 160]]);
    cl(w.x, FLOOR - 20, w.moving ? { ...feelT('neutral', t), view: 'side', walk: w.x / 10 } : { ...feelT('love', t), emote: 'heart', emoteK: 1 });
    if (drool && !w.moving) for (let i = 0; i < 3; i++) { const ph = (t * 1.5 + i / 3) % 1; R(166, FLOOR - 30 + Math.round(ph * 14), 1, 2, SKY); }
  }, { in: { type: 'iris', dur: .4 }, cam: (lt, t) => [ramp(t, [[at('多少产品经理'), 160], [at('既懂业务'), 70], [at('最前沿的技术'), 160], [at('站在 AI 最前线'), 250], [at('站在 AI 最前线') + 1, 160]]), ramp(t, [[at('既懂业务'), 96], [at('站在 AI 最前线') + 1, 92]]), ramp(t, [[at('多少产品经理'), 1.3], [at('既懂业务'), 1.45], [at('站在 AI 最前线') + .3, 1.45], [at('站在 AI 最前线') + 1, 1.05]])] });
  // 12. the resume: "pure PM, 10 years" greys out, FDE shines
  shot('简历上一写', (lt, t) => {
    darkStage(t, [160]);
    const y0 = Math.round(lerp(190, 16, over(lt / .5)));
    frame(76, y0, 168, 126, { title: '简历', fill: CREAM });
    cl(118, y0 + 70, { ...feelT('proud', t), noShadow: true });
    pxText('纯 PM · 10 年', 198, y0 + 40, { size: 7, color: after(t, '牛逼#1') ? '#8C88A6' : INK, stroke: false });
    if (after(t, '牛逼#1')) R(166, y0 + 40, 64, 1, RED);
    pxText('FDE', 198, y0 + 72, { size: 16, color: GOLDD, stroke: false });
    if (after(t, '牛逼#1')) { stamp('更牛', 204, y0 + 104, since(t, '牛逼#1'), 9); kick(since(t, '牛逼#1'), 3); pxFx({ type: 'glow', x: 198, y: y0 + 72, r: 30, a: .5 }); sparkle(198, y0 + 72, 24, t, 10); }
  }, { in: { type: 'iris', dur: .4 }, cam: (lt, t) => [ramp(t, [[at('简历上一写'), 160], [at('牛逼#1'), 196]]), ramp(t, [[at('简历上一写'), 90], [at('牛逼#1'), 98]]), ramp(t, [[at('简历上一写'), 1.05], [at('牛逼#1'), 1.4]])] });

  // ================= 二 免费演示工程师 =================
  // 13. half a year in: under the rain cloud, despair
  shot('可我这朋友干了半年', (lt, t) => {
    darkStage(t, [160]); cloud(160, 56, t);
    cl(160, FLOOR, emo(t, [[0, 'sad'], [at('彻底绝望'), 'cry']]));
    if (after(t, '彻底绝望')) { stamp('绝望', 230, 60, since(t, '彻底绝望'), 10); kick(since(t, '彻底绝望'), 3); }
  }, { in: { type: 'dissolve', dur: .4 }, cam: push(160, 100, 1.1, 1.35) });
  // 14. a new name: Forward Deployed → Free Demo
  shot('他自己给这个岗位', (lt, t) => {
    hall(t); frame(56, 30, 208, 44, { title: '新名字', fill: '#2A1418' });
    const sw = since(t, 'Free Demo Engineer');
    if (sw < 0) { pxText('Forward', 100, 52, { size: 8, color: GOLDL }); pxText('Deployed', 160, 52, { size: 8, color: GOLDL }); }
    else { [['Free', 100], ['Demo', 160]].forEach(([w, x], i) => { const k = pop(sw - i * .25, .25); if (k > 0) { pxText(w, x, Math.round(lerp(20, 52, k)), { size: 9, color: PINK }); } else { pxText(i ? 'Deployed' : 'Forward', x, 52, { size: 8, color: '#8C88A6' }); R(x - 18, 52, 36, 1, RED); } }); kick(sw, 2); }
    pxText('Engineer', 220, 52, { size: 8, color: GOLDL });
    if (after(t, '免费演示工程师')) { stamp('免费演示工程师', 160, 100, since(t, '免费演示工程师'), 8); kick(since(t, '免费演示工程师'), 3.5); }
    cl(270, FLOOR, emo(t, [[0, 'suspicious'], [at('免费演示工程师'), 'mischief']]));
  }, { in: { type: 'wipe', dur: .3 }, cam: (lt, t) => [160, ramp(t, [[at('他自己给这个岗位'), 60], [at('免费演示工程师'), 80]]), ramp(t, [[at('他自己给这个岗位'), 1.3], [at('Free Demo Engineer'), 1.4], [at('免费演示工程师'), 1.1]])] });
  // 15. a corporate free-tasting stall, and he's the one handing it out
  shot('说实话', (lt, t) => {
    sunburst(t, '#5A0E18', '#8A1828', 160, 90);
    cl(160, FLOOR - 4, { ...emo(t, [[0, 'nervous'], [at('天天给人免费试吃'), 'happy']]), aR: Math.floor(t * 3) % 2 ? 1.3 : .4 });
    stall(160, t, { sign: '企业级 · 免费试吃' });
    if (after(t, '免费试吃摊#1')) { stamp('免费试吃摊', 160, 32, since(t, '免费试吃摊#1'), 10); kick(since(t, '免费试吃摊#1'), 4); }
  }, { in: { type: 'glitch', dur: .3 }, cam: (lt, t) => [160, 90, 1.02 + .3 * Math.max(0, .3 - Math.max(0, since(t, '免费试吃摊#1')))] });
  // 16. lifted by the wind of the hot job . . . dropped into plain free labour
  shot('一个风口上的', (lt, t) => {
    vgrad(0, PW, 0, FLOOR, [[0, '#2A1C44'], [FLOOR, '#8A4A6A']]); vgrad(0, PW, FLOOR, PH, [[0, '#4A2C1C'], [30, '#2A1810']]);
    const fall = since(t, '沦落成');
    for (let i = 0; i < 14; i++) R(Math.floor((hash(i) * 400 + t * 200) % 360) - 20, Math.floor(hash(i + 3) * 140), 18, 1, fall < 0 ? '#C8B8E8' : '#5A4A6A');
    const y = fall < 0 ? Math.round(lerp(FLOOR, 60, out3(lt / 1.5)) + Math.sin(t * 3) * 4) : Math.round(Math.min(FLOOR, 60 + fall * fall * 400));
    if (fall < 0) { chip('风口', 160, 24, GOLDL, 9); sparkle(160, y - 20, 30, t, 10); }
    cl(160, y, { ...emo(t, [[0, 'excited'], [at('沦落成'), 'scared'], [at('免费苦力'), 'ko']]), noShadow: y < FLOOR - 2 });
    if (after(t, '免费苦力')) { for (let i = 0; i < 3; i++) box(130 + i * 2, FLOOR - 41 - 9 - i * 13, 60 - i * 6, 12, '#7A5A3A'); stamp('免费苦力', 250, 70, since(t, '免费苦力'), 9); kick(since(t, '免费苦力'), 3.5); }
  }, { in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [160, ramp(t, [[at('一个风口上的'), 110], [at('沦落成') - .1, 70], [at('沦落成') + .5, 110]]), ramp(t, [[at('一个风口上的'), 1.1], [at('沦落成') - .1, 1.3], [at('沦落成') + .5, 1.1]])] });
  // 17. the host: half a year of weird
  shot('今天就讲讲', (lt, t) => {
    sunburst(t, '#2A1430', '#3A1E44', 80, 50);
    hg(76, PH + 10, { ...emo(t, [[0, 'mischief'], [at('魔幻经历'), 'excited']]), poseR: 'point' });
    if (after(t, '魔幻经历')) { chip('魔幻半年', 124, 30, PINK, 6.5); sparkle(124, 30, 26, t, 10, PINK); }
  }, { res: [160, 90], in: { type: 'slide', dur: .3 }, cam: push(80, 48, 1.0, 1.12) });
  // 18. three sealed scrolls held up: save-your-life questions, at the end
  shot('文末送你三句保命真话', (lt, t) => {
    curtain(t, 1); spot(160, t, { w: 120 });
    for (let i = 0; i < 3; i++) { const k = pop(lt - .2 - i * .25, .3), x = 100 + i * 60; if (k <= 0) continue; const y = Math.round(lerp(140, 60, k) + Math.sin(t * 3 + i) * 2); frame(x - 20, y - 22, 40, 44, { fill: CREAM }); pxText(['一', '二', '三'][i], x, y - 6, { size: 9, color: RED, stroke: false }); pxText('？', x, y + 10, { size: 8, color: INK, stroke: false }); pxFx({ type: 'glow', x, y, r: 24, a: .35 }); }
    chip('保命真话', 160, 22, GOLDL, 9);
    hg(160, FLOOR + 8, { ...emo(t, [[0, 'happy'], [at('当面问清楚'), 'determined']]), poseR: after(t, '当面问清楚') ? 'point' : 'up' });
    if (after(t, '当面问清楚')) { stamp('问清楚', 250, 110, since(t, '当面问清楚'), 9); kick(since(t, '当面问清楚'), 3); }
  }, { in: { type: 'iris', dur: .4 }, cam: (lt, t) => [160, 92, ramp(t, [[at('文末送你三句保命真话'), 1.05], [at('当面问清楚'), 1.1], [at('当面问清楚') + .3, 1.35]])] });

  // ================= 二 魔幻半年 =================
  shot('刚入职第一周', title('二', '魔幻半年', 'clock'), { in: { type: 'slide', dur: .3 }, cam: push(160, 88, 1.02, 1.1) });
  // 19. the boss (黑哥) paints a giant pie: you're the spearhead company of the AI war
  shot('老板拉着开会', (lt, t) => {
    hall(t);
    const pie = since(t, '大饼画得'), r = pie < 0 ? 0 : Math.min(46, 6 + pie * 22);
    if (r > 0) { pellipse(200, 70, r, r * .55, GOLDD); pellipse(200, 68, r - 2, r * .55 - 2, GOLD); for (let i = 0; i < 8; i++) pset(Math.round(200 + Math.cos(i) * r * .5), Math.round(68 + Math.sin(i * 2) * r * .25), GOLDL); sparkle(200, 68, r + 6, t, 12); chip('大饼', 200, Math.round(68 - r * .55 - 10), CREAM, 7); }
    hg(110, FLOOR, { ...emo(t, [[0, 'happy'], [at('尖刀连'), 'excited']]), poseR: after(t, '大饼画得') ? 'waveA' : 'point', poseL: 'hip' });
    chip('老板 · 黑哥饰', 110, 44, GOLDL, 6);
    if (after(t, '尖刀连')) { frame(226, 62, 70, 22, { fill: RED }); pxText('尖刀连', 261, 73, { size: 8 }); kick(since(t, '尖刀连'), 2.5); }
    cl(260, FLOOR, { ...emo(t, [[0, 'neutral'], [at('尖刀连'), 'starstruck']]), view: 'q', flip: true });
  }, { in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('老板拉着开会'), 140], [at('大饼画得'), 180], [at('尖刀连'), 220]]), 90, ramp(t, [[at('老板拉着开会'), 1.05], [at('大饼画得'), 1.25], [at('尖刀连'), 1.2]])] });
  // 20. blood boiling; welding himself to the desk
  shot('他当时听得热血沸腾', (lt, t) => {
    office(t, { phase: .5, clockSpin: lt * 15 });
    const weld = since(t, '把命焊在工位上');
    pxFx({ type: 'glow', x: 140, y: FLOOR - 20, r: 40, a: .3 + .1 * Math.sin(t * 8), col: '#FF6A4A' });
    cl(140, FLOOR - 2, { ...emo(t, [[0, 'excited'], [at('把命焊在工位上'), 'determined']]), ...(weld >= 0 ? typing(t, 14) : { aL: 1.3, aR: 1.3 }) });
    desk(140, t, { cups: 2 });
    if (weld >= 0) { for (let i = 0; i < 12; i++) { const ph = (t * 3 + hash(i)) % 1; pset(Math.round(112 + (hash(i + 2) - .5) * 20 * ph * 3), Math.round(FLOOR - 14 - ph * 20), ph < .5 ? GOLDL : ORANGE); } pxFx({ type: 'glow', x: 112, y: FLOOR - 14, r: 12, a: .7, col: '#FFF1C9' }); chip('焊在工位上', 140, 40, GOLDL, 8); }
  }, { in: { type: 'cut' }, cam: (lt, t) => [ramp(t, [[at('他当时听得热血沸腾'), 140], [at('把命焊在工位上'), 120]]), 100, ramp(t, [[at('他当时听得热血沸腾'), 1.3], [at('把命焊在工位上'), 1.55]])] });
  // 21. week two: the salesman leads him down the street to the client
  shot('结果第二周', (lt, t) => {
    street(t, Math.floor(lt * 16));
    npc(150, FLOOR, lt * 3, SUIT); chip('销售', 150, FLOOR - 40, CREAM, 6);
    cl(100, FLOOR, { ...feelT('neutral', t), view: 'side', walk: lt * 1.4 });
    if (lt > .8) chip('拜访客户', 230, 40, GOLDL, 8);
  }, { in: { type: 'wipe', dur: .35 }, cam: push(130, 110, 1.3, 1.2) });
  // 22. the client (黑哥) blows hot air for 30 minutes
  shot('甲方在那唾沫横飞', (lt, t) => {
    curtain(t, 1); spot(110, t);
    hg(110, FLOOR, { ...feelT('smug', t), poseR: Math.floor(t * 4) % 2 ? 'waveA' : 'waveB', poseL: 'hip' }); chip('甲方 · 黑哥饰', 110, 44, GOLDL, 6);
    for (let i = 0; i < 10; i++) { const ph = (t * 1.6 + hash(i)) % 1; pset(Math.round(124 + ph * 70), Math.round(FLOOR - 70 + (hash(i + 3) - .5) * 20 + ph * ph * 30), SKY); }
    const m = Math.min(30, Math.floor(lt * 9)); frame(210, 40, 70, 34, { title: '计时', fill: INK }); pxText(`${m} 分钟`, 245, 58, { size: 9, color: m >= 30 ? RED : GOLDL });
    cl(250, FLOOR, { ...feelT('bored', t), emote: 'zzz', emoteK: 1 });
  }, { in: { type: 'iris', dur: .4 }, cam: push(170, 96, 1.1, 1.25) });
  // 23. the wish made, the salesman winks hard: "this one's doable, right?"
  shot('然后甲方许完愿', (lt, t) => {
    darkStage(t, [40, 120]);
    for (let i = 0; i < 6; i++) { const ph = (t + hash(i)) % 1; icon('star', 20 + hash(i + 1) * 40, 60 - ph * 40, 1); }
    npc(40, FLOOR, null, SUIT); const wink = Math.floor(t * 5) % 3 === 0;
    R(36, FLOOR - 27, 3, wink ? 1 : 2, CREAM); chip('销售', 40, FLOOR - 40, CREAM, 5);
    if (after(t, '这个能搞吧')) chip('这个能搞吧？', 60, 14, GOLDL, 6);
    cl(120, FLOOR, { ...emo(t, [[0, 'neutral'], [at('疯狂使眼色'), 'nervous']]), emote: 'sweat', emoteK: 1, flip: true });
  }, { res: [160, 90], in: { type: 'slide', dur: .25 }, cam: (lt, t) => [ramp(t, [[at('然后甲方许完愿'), 40], [at('这个能搞吧'), 80]]), 50, ramp(t, [[at('然后甲方许完愿'), 1.3], [at('这个能搞吧'), 1.0]])] });
  // 24. he nods anyway; DeepSeek rises behind him as the safety net
  shot('他明知道搞不定', (lt, t) => {
    curtain(t, 1); spot(130, t);
    const nod = since(t, '点了点头'), j = nod >= 0 ? jump(onTwos(t), at('点了点头'), at('点了点头') + .35, 3) : { dy: 0, sq: 0 };
    cl(130, FLOOR, { ...emo(t, [[0, 'nervous'], [at('咬咬牙'), 'determined']]), dy: j.dy, sq: j.sq });
    if (after(t, '搞不定')) chip('搞不定', 130, 64, PINK, 8);
    const net = since(t, '给他兜底');
    if (after(t, 'AI 可以给他兜底', -.2)) { const k = pop(since(t, 'AI 可以给他兜底') + .2, .5); ds(220, Math.round(lerp(FLOOR + 90, FLOOR, k)), { flip: true, emote: net >= 0 ? 'spark' : null }); }
    if (net >= 0) { for (let x = 90; x < 170; x += 4) pline(x, FLOOR + 4, x + 4, FLOOR + 6, CREAM); chip('AI 兜底', 220, 40, SKY, 8); }
  }, { in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('他明知道搞不定'), 130], [at('AI 可以给他兜底'), 175]]), 100, ramp(t, [[at('他明知道搞不定'), 1.4], [at('AI 可以给他兜底'), 1.1]])] });
  // 25. two weeks of all-nighters with DeepSeek
  shot('回公司以后', (lt, t) => {
    office(t, { phase: lt * .6, clockSpin: lt * 40 });
    cl(110, FLOOR - 2, { ...feelT('sleepy', t), ...typing(t, 12) });
    ds(196, FLOOR, { dy: Math.floor(t * 4) % 2 ? -1 : 0 });
    desk(120, t, { cups: Math.min(14, Math.floor(lt * 3)) });
    if (after(t, '两个星期大夜')) chip('熬了两个星期', 150, 30, GOLDL, 8);
  }, { in: { type: 'dissolve', dur: .4 }, cam: push(150, 96, 1.05, 1.25) });
  // 26. why at night? the price board: day full price, after work half price
  shot('为什么熬夜呢', (lt, t) => {
    hall(t);
    const half = after(t, '下班后才能半价');
    card(20, 24, 136, 110, '白天 · 原价', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#E8A06A'], [h, '#C08A5C']]); icon('sun', x + w / 2, y + 26, 2); pxText('¥¥¥¥', x + w / 2, y + 60, { size: 9, color: INK, stroke: false }); }, pop(lt, .3));
    card(164, 24, 136, 110, '下班后 · 半价', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#0E0A20'], [h, '#2A1C44']]); icon('moon', x + w / 2, y + 26, 2); pxText('¥¥', x + w / 2, y + 60, { size: 9, color: GOLDL }); }, after(t, '下班后', -.3) ? pop(since(t, '下班后') + .3, .3) : 0);
    if (half) { stamp('半价', 262, 78, since(t, '下班后才能半价'), 9); kick(since(t, '下班后才能半价'), 3); }
  }, { in: { type: 'wipe', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('为什么熬夜呢'), 88], [at('下班后') - .1, 88], [at('下班后') + .4, 232]]), 82, 1.3] });
  // 27. the company caps the token claims: the bar drains to empty
  shot('说起来这还是他公司不靠谱', (lt, t) => {
    office(t, { phase: .3 });
    const cap = since(t, '报销额度月上限'), k = cap < 0 ? 1 : clamp(1 - cap / 1.2, .06, 1);
    hp(105, 30, k, cap >= 0 ? 'token 额度' : null);
    cl(160, FLOOR - 2, emo(t, [[0, 'neutral'], [at('报销额度月上限'), 'nervous'], [at('还卡报销'), 'furious']]));
    if (after(t, '提升效率')) chip('提升效率 → 产出', 160, 74, CREAM, 7);
    if (after(t, '还卡报销')) { stamp('卡报销', 240, 100, since(t, '还卡报销'), 9); kick(since(t, '还卡报销'), 4); pxFx({ type: 'tint', col: '#FF2A2A', a: .1 * Math.max(0, 1 - since(t, '还卡报销') * 2) }); }
  }, { in: { type: 'cut' }, cam: (lt, t) => [160, ramp(t, [[at('说起来这还是他公司不靠谱'), 60], [at('提升效率'), 80]]), ramp(t, [[at('说起来这还是他公司不靠谱'), 1.4], [at('提升效率'), 1.1], [at('还卡报销'), 1.25]])] });
  // 28. pricey models behind glass; unlimited tokens crossed out
  shot('没办法', (lt, t) => {
    hall(t);
    card(20, 24, 136, 110, '贵的模型', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#3A2418'], [h, '#5A3A2C']]); icon('chip', x + w / 2, y + 30, 3); for (let i = 0; i < 4; i++) chip('¥', x + 20 + i * 28, y + 64, GOLDL, 6); R(x + 10, y + 10, 2, h - 20, SKY); R(x + w - 12, y + 10, 2, h - 20, SKY); }, pop(lt, .3));
    const k2 = after(t, '无限 token', -.3) ? pop(since(t, '无限 token') + .3, .3) : 0;
    card(164, 24, 136, 110, '无限 token', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#0E0A20'], [h, '#2A1C44']]); pxText('∞', x + w / 2, y + 40, { size: 20, color: SKY }); if (after(t, '无限 token', .4)) icon('cross', x + w / 2, y + 40, 4); }, k2);
    if (after(t, '真用不起')) chip('用不起', 88, 140, PINK, 8);
  }, { in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('没办法'), 88], [at('无限 token') - .2, 88], [at('无限 token') + .4, 232]]), 82, 1.25] });
  // 29. 黑哥 yanks it back on topic; the all-nighters shed hair; the Demo is done
  shot('好了扯远了', (lt, t) => {
    office(t, { phase: .95 });
    const done = since(t, '把 Demo 给搓出来了');
    if (lt < 1.2) { hg(60, FLOOR, { ...feelT('mischief', t), poseR: 'point' }); chip('回归正题', 60, 40, GOLDL, 7); }
    cl(170, FLOOR - 2, { ...emo(t, [[0, 'sleepy'], [at('库库掉'), 'cry'], [at('把 Demo 给搓出来了'), 'proud']]), ...(done < 0 ? typing(t, 16) : { aL: 1.4, aR: 1.4 }) });
    desk(170, t, { cups: 14 });
    if (after(t, '库库掉')) for (let i = 0; i < 14; i++) { const ph = (t * .9 + hash(i)) % 1; R(Math.round(150 + hash(i + 2) * 40 + Math.sin(ph * 6 + i) * 3), Math.round(FLOOR - 60 + ph * 50), 1, 3, INK); }
    if (done >= 0) { const k = pop(done, .4); frame(214, Math.round(lerp(120, 34, k)), 70, 44, { title: 'Demo', fill: '#1A1C30' }); R(222, Math.round(lerp(120, 34, k)) + 12, 54, 4, SKY); R(222, Math.round(lerp(120, 34, k)) + 20, 34, 4, GOLDL); R(222, Math.round(lerp(120, 34, k)) + 28, 44, 4, PINK); sparkle(249, 56, 34, t, 12); kick(done, 2.5); }
  }, { in: { type: 'glitch', dur: .3 }, cam: (lt, t) => [ramp(t, [[at('好了扯远了'), 100], [at('库库掉'), 170], [at('把 Demo 给搓出来了'), 210]]), 92, ramp(t, [[at('好了扯远了'), 1.2], [at('库库掉'), 1.45], [at('把 Demo 给搓出来了'), 1.2]])] });
  // 30. trotting off to demo it
  shot('屁颠屁颠跑去', (lt, t) => {
    street(t, Math.floor(lt * 22));
    const j = { dy: -Math.abs(Math.round(Math.sin(lt * 8) * 5)) };
    cl(140, FLOOR, { ...feelT('happy', t), view: 'side', walk: lt * 2, dy: j.dy });
    frame(152, FLOOR - 50 + j.dy, 30, 22, { fill: '#1A1C30' }); R(156, FLOOR - 44 + j.dy, 20, 3, SKY);
    chip('去演示', 220, 40, GOLDL, 8);
  }, { in: { type: 'wipe', dur: .3 }, cam: push(150, 108, 1.3, 1.2) });
  // 31. the client (黑哥) wipes his mouth: "good lad, so inspiring, we'll study it"
  shot('客户看完擦擦嘴', (lt, t) => {
    sunburst(t, '#8A4A6A', '#B86A8A', 50, 50);
    hg(50, PH + 10, { ...emo(t, [[0, 'smug'], [at('好样的小伙汁'), 'laugh'], [at('我再研究研究'), 'mischief']]), poseR: after(t, '好样的小伙汁') ? 'fistUp' : 'chin', poseL: 'belly' });
    const L = [['好样的小伙汁', '好样的小伙汁'], ['真他妈牛逼', '真牛X'], ['很有启发', '很有启发'], ['我再研究研究', '我再研究研究']];
    L.forEach(([ph, w], i) => { if (!after(t, ph)) return; const k = pop(since(t, ph), .25); chip(w, 118, 16 + i * 15 - Math.round((1 - k) * 6), i === 3 ? PINK : CREAM, 5.5); });
    if (after(t, '给内部同步一下')) chip('内部同步一下', 118, 76, GOLDL, 5.5);
  }, { res: [160, 90], in: { type: 'slide', dur: .3 }, cam: push(80, 48, 1.0, 1.12) });
  // 32. and then . . . nothing; cobwebs, a clock spinning
  shot('然后呢', (lt, t) => {
    darkStage(t, [160]);
    const none = since(t, '彻底没有然后了');
    cl(160, FLOOR, emo(t, [[0, 'hopeful'], [at('彻底没有然后了'), 'ko']], none < 0 ? { emote: '?', emoteK: 1 } : {}));
    icon('clock', 60, 50, 3); for (let k = 0; k < 6; k++) pline(250, 10, 250 + Math.cos(k * .5 + 1.6) * 50, 10 + Math.sin(k * .5 + 1.6) * 50, '#8C88A6');
    if (none >= 0) { stamp('没有然后', 160, 50, none, 10); kick(none, 4); }
  }, { in: { type: 'iris', dur: .4 }, cam: (lt, t) => [160, 100, ramp(t, [[at('然后呢'), 1.4], [at('彻底没有然后了'), 1.1]])] });
  // 33. next client, same routine: a conveyor of clients, the count going up
  shot('接着换下一个客户', (lt, t) => {
    hall(t);
    for (let i = 0; i < 5; i++) { const x = Math.round(((lt * 40 + i * 70) % 350) - 20); npc(x, FLOOR, lt * 3 + i, i % 2 ? SUIT : '#4A2A36'); }
    R(0, FLOOR + 2, PW, 4, '#3A2A2A'); for (let x = 0; x < PW; x += 12) R(Math.round((x + lt * 40) % PW), FLOOR + 3, 2, 2, GOLDD);
    cl(160, FLOOR - 24, { ...feelT('bored', t), aR: Math.floor(t * 2) % 2 ? 1.3 : .2 }); frame(140, FLOOR - 24, 40, 24, { fill: CARD });
    const n = 1 + Math.floor(lt * 1.2); chip(`第 ${n} 遍`, 160, 30, after(t, '原样来一遍') ? RED : GOLDL, 9);
  }, { in: { type: 'cut' }, cam: push(160, 96, 1.05, 1.2) });
  // 34. the weekly calendar makes him sick
  shot('他说他每天打开日历都想吐', (lt, t) => {
    office(t, { phase: .4 });
    calendar(60, 26, [['一', '听', '#3A4A9A', since(t, '周一周二')], ['二', '听', '#3A4A9A', since(t, '周一周二') - .2], ['三', '搓', GOLDD, since(t, '周三到周五')], ['四', '搓', GOLDD, since(t, '周三到周五') - .2], ['五', '搓', GOLDD, since(t, '周三到周五') - .4], ['下周一', '演', RED, since(t, '下周一')]].map(d => [d[0], d[1], d[2], d[3] >= 0 ? d[3] : 0]), t);
    cl(160, FLOOR - 2, emo(t, [[0, 'nervous'], [at('都想吐'), 'disgusted'], [at('瞎扯淡'), 'bored'], [at('没日没夜'), 'dizzy']]));
  }, { in: { type: 'dissolve', dur: .35 }, cam: push(160, 80, 1.2, 1.1) });
  // 35. a month's tally: a pile of clients, 7 or 8 Demos, zero deals
  shot('一个月折腾下来', (lt, t) => {
    hall(t);
    const a = since(t, '客户见了一大堆'), b = since(t, '七八个'), c = since(t, '一单都没有');
    if (a < 0) { const k = pop(lt, .3); frame(110, Math.round(lerp(150, 50, k)), 100, 50, { title: '月度总结', fill: CREAM }); pxText('一个月', 160, Math.round(lerp(150, 50, k)) + 26, { size: 12, color: INK, stroke: false }); cl(250, FLOOR, { ...feelT('sleepy', t), emote: 'sweat', emoteK: 1 }); }
    if (a >= 0) { for (let i = 0; i < Math.min(9, Math.floor(a * 9) + 1); i++) npc(40 + (i % 3) * 14, FLOOR - Math.floor(i / 3) * 8, null, i % 2 ? SUIT : '#4A2A36'); chip('客户 一大堆', 54, 40, CREAM, 7); }
    if (b >= 0) { for (let i = 0; i < Math.min(8, Math.floor(b * 10) + 1); i++) frame(130 + (i % 4) * 16, FLOOR - 22 - Math.floor(i / 4) * 16, 15, 14, { fill: '#1A1C30' }); chip('Demo 七八个', 160, 40, GOLDL, 7); }
    if (c >= 0) { pxText('0', 260, 96, { size: 30, color: RED }); chip('签单', 260, 40, CREAM, 7); stamp('一单都没有', 260, 130, c, 7); kick(c, 4); }
  }, { in: { type: 'iris', dur: .4 }, cam: (lt, t) => [ramp(t, [[at('一个月折腾下来'), 160], [at('客户见了一大堆'), 60], [at('七八个'), 160], [at('一单都没有'), 250]]), 90, ramp(t, [[at('一个月折腾下来'), 1.03], [at('客户见了一大堆'), 1.4], [at('一单都没有') + .3, 1.4]])] });

  // ================= 试吃摊 =================
  // 36. the mall aisle: his stall, shoppers walking past; he cuts a slice and begs a taste
  shot('他就跟我吐槽', (lt, t) => {
    vgrad(0, PW, 0, FLOOR, [[0, '#3A2A3A'], [FLOOR, '#6A4A4A']]); for (let x = 0; x < PW; x += 40) { R(x, 20, 30, 60, '#4A3A4A'); R(x + 2, 22, 26, 56, '#2A1C2A'); R(x + 4, 24, 22, 4, GOLDD); }
    vgrad(0, PW, FLOOR, PH, [[0, '#8A7A6A'], [30, '#5A4A3A']]);
    for (let i = 0; i < 3; i++) { const x = Math.round(((lt * 26 + i * 120) % 380) - 30); npc(x, FLOOR + 14, lt * 3 + i, i % 2 ? '#4A2A36' : SUIT); }
    const cut = since(t, '切一块香肠');
    cl(160, FLOOR - 4, { ...emo(t, [[0, 'hopeful'], [at('求着路过的人'), 'nervous']]), aR: cut >= 0 ? (Math.floor(t * 5) % 2 ? 1.2 : .6) : .3 });
    stall(160, t, { slices: cut >= 0 ? 5 + Math.floor(cut * 2) % 4 : 5 });
    if (after(t, '免费试吃摊#2')) chip('免费试吃摊', 160, 30, GOLDL, 8);
    if (after(t, '求着路过的人')) chip('尝一口？', 210, 56, CREAM, 7);
  }, { in: { type: 'dissolve', dur: .4 }, cam: (lt, t) => [160, 100, ramp(t, [[at('他就跟我吐槽'), 1.05], [at('切一块香肠'), 1.35]])] });
  // 37. a shopper tastes: "wow, delicious!", wipes his mouth, walks off to the next stall
  shot('路人尝完', (lt, t) => {
    vgrad(0, PW, 0, FLOOR, [[0, '#3A2A3A'], [FLOOR, '#6A4A4A']]); vgrad(0, PW, FLOOR, PH, [[0, '#8A7A6A'], [30, '#5A4A3A']]);
    const go = since(t, '屁股一拍走人了'), next = since(t, '下一个摊子');
    cl(110, FLOOR - 4, emo(t, [[0, 'hopeful'], [at('屁股一拍走人了'), 'sad'], [at('低头切下一块'), 'cry']]));
    stall(110, t, {});
    stall(270, t, { sign: '隔壁小吃' });
    const px = go < 0 ? 170 : next < 0 ? Math.min(220, 170 + go * 30) : Math.min(270, 220 + next * 40);
    npc(px, FLOOR + 14, go >= 0 ? t * 3 : null, SUIT);
    if (after(t, '卧槽太好吃了') && go < 0) chip('太好吃了！', 176, 70, GOLDL, 7);
    if (after(t, '嘴巴一抹') && go < .8) chip('嘴巴一抹', 200, 52, CREAM, 6);
  }, { in: { type: 'cut' }, cam: (lt, t) => [ramp(t, [[at('路人尝完'), 150], [at('屁股一拍走人了'), 150], [at('下一个摊子'), 220]]), 100, ramp(t, [[at('路人尝完'), 1.35], [at('屁股一拍走人了'), 1.2], [at('下一个摊子'), 1.15]])] });
  // 38. nobody cares when the shop will actually open: shutters down, a sign with a question mark
  shot('根本他妈没有人关心', (lt, t) => {
    darkStage(t, [160]);
    frame(100, 30, 120, 90, { title: '店铺', fill: '#3A2A2A' }); for (let y = 40; y < 114; y += 5) R(106, y, 108, 2, '#5A4A4A');
    chip('开张？', 160, 76, CREAM, 10);
    cl(240, FLOOR, emo(t, [[0, 'sad'], [at('什么时候才开张'), 'cry']]));
    if (after(t, '什么时候才开张')) { stamp('没人关心', 160, 132, since(t, '什么时候才开张'), 8); kick(since(t, '什么时候才开张'), 3); }
  }, { in: { type: 'dissolve', dur: .35 }, cam: push(160, 84, 1.05, 1.25) });
  // 39. no money down, so nothing given: data, access, time, each locked
  shot('因为没掏真金白银的东西', (lt, t) => {
    hall(t);
    const L = [['不给真实数据', 'server', 80, '数据'], ['不给系统权限', 'shield', 160, '权限'], ['沟通时间都懒得留', 'clock', 240, '时间']];
    L.forEach(([ph, ic, x, lab]) => { pedestal(x); chip(lab, x, FLOOR - 10, GOLDL, 6); icon(ic, x, FLOOR - 46, 3, after(t, ph) ? '#5A4A4A' : null); if (after(t, ph)) { icon('cross', x + 16, FLOOR - 60, 2); kick(since(t, ph), 2); } });
    if (after(t, '不会上心')) chip('没掏钱 = 不上心', 160, 30, PINK, 9);
  }, { in: { type: 'wipe', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('因为没掏真金白银的东西'), 160], [at('不给真实数据'), 80], [at('不给系统权限'), 160], [at('沟通时间都懒得留'), 240], [at('沟通时间都懒得留') + 1.2, 160]]), 92, ramp(t, [[at('因为没掏真金白银的东西'), 1.05], [at('不给真实数据'), 1.35], [at('沟通时间都懒得留') + 1.2, 1.05]])] });
  // 40. however shiny the Demo, it's the little brother: it shrinks, no deal
  shot('你把 Demo 搓得再漂亮', (lt, t) => {
    curtain(t, 1); spot(160, t);
    const sh = since(t, '也是个弟弟'), s = sh < 0 ? 1 : Math.max(.3, 1 - sh * 1.2);
    const w = Math.round(80 * s), h = Math.round(56 * s); frame(160 - w / 2, 90 - h, w, h, { fill: '#1A1C30' }); if (sh < 0) { sparkle(160, 60, 50, t, 14); pxFx({ type: 'glow', x: 160, y: 60, r: 50, a: .4 }); }
    if (sh >= 0) chip('弟弟', 160, 100, PINK, 9);
    cl(240, FLOOR, emo(t, [[0, 'proud'], [at('也是个弟弟'), 'sad']]));
    if (after(t, '做不了成交')) { stamp('成交 0', 90, 120, since(t, '做不了成交'), 9); kick(since(t, '做不了成交'), 3.5); }
  }, { in: { type: 'iris', dur: .4 }, cam: (lt, t) => [160, 90, ramp(t, [[at('你把 Demo 搓得再漂亮'), 1.25], [at('也是个弟弟'), 1.25], [at('也是个弟弟') + .6, 1.05]])] });

  // ================= 三 三个谁 =================
  shot('后来他把这里面的猫腻', title('三', '三个谁', 'crown'), { in: { type: 'slide', dur: .3 }, cam: push(160, 88, 1.02, 1.1) });
  // 41. who pays? nobody: the client's wallet stays shut, two weeks of wages and compute burn
  shot('第一，谁给钱', (lt, t) => {
    darkStage(t, [160]);
    chip('谁给钱？', 160, 24, GOLDL, 10);
    frame(30, 60, 80, 50, { title: '客户', fill: CARD }); pxText('¥ 0', 70, 88, { size: 10, color: CREAM });
    frame(210, 60, 80, 50, { title: '公司', fill: CARD }); pxText('¥ 0', 250, 88, { size: 10, color: CREAM });
    const burn = since(t, '凭空烧掉了');
    if (after(t, '工资和算力成本')) { for (let i = 0; i < 6; i++) box(138 + (i % 3) * 14, FLOOR - 10 - Math.floor(i / 3) * 8, 14, 8, burn < 0 ? '#C8A86A' : '#5A3A2C'); chip('工资 + 算力', 160, 116, CREAM, 6); }
    if (burn >= 0) { flames(130, FLOOR - 4, 60, 28, t); pxFx({ type: 'glow', x: 160, y: FLOOR - 16, r: 40, a: .4, col: '#FF7A3A' }); kick(burn, 3); }
    cl(70, FLOOR, emo(t, [[0, 'neutral'], [at('凭空烧掉了'), 'scared']]));
  }, { in: { type: 'iris', dur: .4 }, cam: (lt, t) => [ramp(t, [[at('第一，谁给钱'), 160], [at('凭空烧掉了'), 160]]), 90, ramp(t, [[at('第一，谁给钱'), 1.05], [at('凭空烧掉了'), 1.35]])] });
  // 42. that's the AI bubble: it wobbles . . . pop
  shot('才叫 AI 泡沫', (lt, t) => {
    sunburst(t, '#1E1424', '#2E1E34', 160, 90);
    bubble(160, 76, 46, 'AI', t, since(t, '泡沫'));
    if (after(t, '泡沫')) { stamp('AI 泡沫', 160, 120, since(t, '泡沫'), 10); kick(since(t, '泡沫'), 4); }
    cl(236, FLOOR, emo(t, [[0, 'suspicious'], [at('泡沫'), 'furious']]));
  }, { in: { type: 'cut' }, cam: (lt, t) => [160, 90, ramp(t, [[at('才叫 AI 泡沫'), 1.25], [at('泡沫'), 1.05]])] });
  // 43. who sets the targets? the sales director's KPI board: Demos made, visits paid, not one word about launches
  shot('谁考核', (lt, t) => {
    office(t, { phase: .6 });
    frame(60, 24, 200, 100, { title: 'KPI 考核表', fill: CREAM });
    const rows = [['Demo 产出数量', 'check'], ['客户拜访次数', 'check'], ['真正上线了几个系统', 'cross']];
    rows.forEach(([ph, ic], i) => { if (!after(t, ph)) return; const y = 46 + i * 24; pxText(i === 2 ? '上线系统' : ph, 140, y, { size: 7.5, color: i === 2 ? '#8C88A6' : INK, stroke: false }); icon(ic, 226, y, 2); });
    if (after(t, '最他妈讽刺')) { stamp('讽刺', 270, 30, since(t, '最他妈讽刺'), 8); kick(since(t, '最他妈讽刺'), 3); }
    npc(30, FLOOR, null, SUIT); chip('销售总监', 30, FLOOR - 40, CREAM, 5.5);
    cl(290, FLOOR, { ...emo(t, [[0, 'suspicious'], [at('真正上线了几个系统'), 'angry']]), flip: true });
  }, { in: { type: 'wipe', dur: .35 }, cam: (lt, t) => [160, ramp(t, [[at('谁考核'), 90], [at('Demo 产出数量'), 74]]), ramp(t, [[at('谁考核'), 1.05], [at('Demo 产出数量'), 1.3], [at('真正上线了几个系统') + .6, 1.3], [at('真正上线了几个系统') + 1.2, 1.05]])] });
  // 44. the loop: the better he grinds, the more they praise, the faster the wheel; delivery never comes
  shot('这就他妈非常魔幻了', (lt, t) => {
    darkStage(t, [160]);
    const sp = 2 + Math.max(0, since(t, '你越能通宵搓')) * 2.5;
    wheel(160, 92, 46, t, Math.min(sp, 14));
    cl(160, 132, { ...emo(t, [[0, 'nervous'], [at('越停不下来'), 'dizzy']]), view: 'side', walk: t * Math.min(sp, 14) * .9, noShadow: true });
    if (after(t, '你越能通宵搓')) chip('通宵搓 Demo', 60, 50, GOLDL, 7);
    if (after(t, '领导越夸你')) { chip('领导夸你', 260, 50, PINK, 7); for (let i = 0; i < 4; i++) { const ph = (t + i / 4) % 1; icon('star', 260 + Math.cos(i) * 12, 70 - ph * 20, 1); } }
    if (after(t, '越停不下来')) chip('停不下来', 260, 120, CREAM, 7);
    if (after(t, '真正的交付')) { stamp('交付 0', 60, 120, since(t, '真正的交付'), 9); kick(since(t, '真正的交付'), 3.5); }
  }, { in: { type: 'glitch', dur: .3 }, cam: (lt, t) => [160, 92, ramp(t, [[at('这就他妈非常魔幻了'), 1.25], [at('你越能通宵搓'), 1.05], [at('真正的交付'), 1.05], [at('真正的交付') + .3, 1.2]])] });
  // 45. who gets the bargain? the client (黑哥) on a pink sunburst, taking it all for free
  shot('第三，谁占便宜', (lt, t) => {
    sunburst(t, '#8A4A6A', '#B86A8A', 80, 50);
    hg(76, PH + 10, { ...emo(t, [[0, 'smug'], [at('真他妈绝了'), 'laugh']]), poseL: 'clasp', poseR: 'clasp' });
    for (let i = 0; i < 7; i++) { const ph = (lt * .8 + hash(i)) % 1; coin(10 + hash(i + 2) * 140, ph * 90); }
    chip('谁占便宜？', 120, 16, GOLDL, 6);
    if (after(t, '真他妈绝了')) { stamp('绝了', 128, 60, since(t, '真他妈绝了'), 8); kick(since(t, '真他妈绝了'), 3); }
  }, { res: [160, 90], in: { type: 'slide', dur: .3 }, cam: push(80, 50, 1.0, 1.15) });
  // 46. the Demo screenshot through the copier: copies, price tags falling, the lowest bidder copies it
  shot('圈子里还有更恶心的', (lt, t) => {
    hall(t);
    frame(30, 40, 70, 50, { title: 'Demo 截图', fill: '#1A1C30' }); R(38, 56, 54, 4, SKY); R(38, 64, 34, 4, GOLDL); R(38, 72, 44, 4, PINK);
    const cmp = since(t, '恶意比价');
    if (cmp >= 0) for (let i = 0; i < 3; i++) { const k = pop(cmp - i * .3, .3); if (k <= 0) continue; const x = 140 + i * 56; frame(x - 22, Math.round(lerp(100, 40, k)), 44, 34, { fill: '#1A1C30' }); chip(['¥¥¥', '¥¥', '¥'][i], x, Math.round(lerp(100, 40, k)) + 44, i === 2 ? PINK : CREAM, 6); }
    if (after(t, '谁报价低')) { pxText('↓', 252, 124, { size: 10, color: RED }); icon('check', 252, 26, 2); }
    if (after(t, '照着抄一份')) { stamp('照着抄', 200, 130, since(t, '照着抄一份'), 8); kick(since(t, '照着抄一份'), 3); }
    npc(66, FLOOR, null, SUIT); chip('甲方', 66, FLOOR - 40, CREAM, 6);
  }, { in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('圈子里还有更恶心的'), 70], [at('恶意比价'), 180]]), 86, ramp(t, [[at('圈子里还有更恶心的'), 1.35], [at('恶意比价'), 1.1]])] });
  // 47. three months of free consulting: questions pile up, calendar pages fly
  shot('还有的甲方更孙子', (lt, t) => {
    office(t, { phase: lt * .4 });
    npc(70, FLOOR, null, SUIT); chip('甲方', 70, FLOOR - 40, CREAM, 6);
    const qs = ['选型？', '架构？', '评测？', '链路？', '运维？'];
    qs.forEach((q, i) => { if (lt < .6 + i * .7) return; chip(q, 110 + (i % 2) * 30, 30 + i * 14, i % 2 ? SKY : GOLDL, 6); });
    if (after(t, '白嫖你三个月')) { const p = Math.min(3, 1 + Math.floor(since(t, '白嫖你三个月') * 2)); frame(220, 30, 70, 40, { title: '日历', fill: CREAM }); pxText(`第 ${p} 个月`, 255, 52, { size: 7, color: INK, stroke: false }); }
    cl(200, FLOOR - 2, { ...emo(t, [[0, 'happy'], [at('全摸透了'), 'suspicious']]), ...typing(t, 6) });
    if (after(t, '全摸透了')) chip('全摸透了', 200, 92, PINK, 7);
  }, { in: { type: 'cut' }, cam: (lt, t) => [ramp(t, [[at('还有的甲方更孙子'), 100], [at('白嫖你三个月'), 220]]), 90, 1.2] });
  // 48. two cheap new grads build a wobbly knock-off; "what can you do?"
  shot('转头在校招上', (lt, t) => {
    hall(t);
    npc(90, FLOOR, null, '#5A3A4A'); npc(118, FLOOR, null, '#5A3A4A'); if (after(t, '应届牛马')) chip('应届牛马', 104, FLOOR - 44, CREAM, 6);
    const wob = Math.round(Math.sin(t * 6) * 2);
    if (after(t, '搭了个猴版')) { for (let i = 0; i < 4; i++) box(180 + wob * (i % 2) + i, FLOOR - 12 - i * 12, 40 - i * 4, 12, i % 2 ? '#7A5A3A' : '#8A6A4A'); chip('猴版产品', 200, 40, PINK, 8); }
    cl(270, FLOOR, emo(t, [[0, 'surprised'], [at('你说你咋整'), 'ko']]));
    if (after(t, '你说你咋整')) { stamp('咋整', 270, 70, since(t, '你说你咋整'), 9); kick(since(t, '你说你咋整'), 3); }
  }, { in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('转头在校招上'), 104], [at('搭了个猴版'), 200], [at('你说你咋整'), 250]]), 96, 1.3] });
  // 49. why do they dare? the big boss slaps his forehead: we have to do AI this year too
  shot('然后这些个甲方', (lt, t) => {
    curtain(t, 1); spot(160, t);
    const slap = since(t, '一拍脑门');
    hg(160, FLOOR, emo(t, [[0, 'confused'], [at('一拍脑门'), 'idea']], slap >= 0 ? { poseR: 'cover', capPop: slap < .3 ? 1 : 0 } : { emote: '?', emoteK: 1 }));
    if (after(t, '大老板')) chip('大老板 · 黑哥饰', 160, 40, GOLDL, 6);
    if (slap >= 0) { kick(slap, 3); pxFx({ type: 'glow', x: 160, y: FLOOR - 80, r: 30, a: .5 * Math.max(0, 1 - slap) }); }
    if (after(t, '我们今年也得搞 AI')) { stamp('今年也得搞 AI', 160, 110, since(t, '我们今年也得搞 AI'), 8); kick(since(t, '我们今年也得搞 AI'), 3); }
  }, { in: { type: 'iris', dur: .4 }, cam: (lt, t) => [160, ramp(t, [[at('然后这些个甲方'), 96], [at('一拍脑门'), 76]]), ramp(t, [[at('然后这些个甲方'), 1.1], [at('一拍脑门'), 1.4], [at('我们今年也得搞 AI'), 1.1]])] });
  // 50. underlings with question marks; so: call in a few young suppliers for a free Demo
  shot('下面的人自己都不知道要什么', (lt, t) => {
    hall(t);
    for (let i = 0; i < 4; i++) { npc(50 + i * 26, FLOOR, null, SUIT); pxText('?', 50 + i * 26, FLOOR - 40 + Math.round(Math.sin(t * 4 + i) * 2), { size: 8, color: GOLDL }); }
    if (after(t, '傻小子小年轻乙方')) { for (let i = 0; i < 3; i++) cl(200 + i * 40, FLOOR, { ...feelT('happy', t), dy: -Math.abs(Math.round(Math.sin(t * 6 + i) * 3)) }); chip('乙方', 240, 50, CREAM, 8); }
    if (after(t, '免费做个 Demo')) chip('免费做个 Demo', 240, 30, PINK, 8);
  }, { in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('下面的人自己都不知道要什么'), 90], [at('傻小子小年轻乙方'), 230]]), 92, 1.25] });
  // 51. an endless queue of suppliers at the door; push one out, the next steps in
  shot('更可悲的是', (lt, t) => {
    curtain(t, 1); spot(90, t);
    frame(30, 40, 70, FLOOR - 40, { fill: '#0E0A20' }); pxText('甲方', 65, 56, { size: 9, color: GOLDL });
    for (let i = 0; i < 6; i++) npc(140 + i * 26, FLOOR, lt * 2 + i, i % 2 ? '#5A3A4A' : '#4A2A36');
    const out = since(t, '有的是人干');
    cl(out < 0 ? 112 : 112 + out * 160, FLOOR - (out < 0 ? 0 : Math.round(Math.sin(clamp(out) * Math.PI) * 30)), emo(t, [[0, 'nervous'], [at('有的是人干'), 'ko']]));
    if (after(t, '卷到极致')) chip('卷到极致', 200, 50, PINK, 8);
    if (out >= 0) { stamp('有的是人干', 200, 100, out, 8); kick(out, 4); }
  }, { in: { type: 'wipe', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('更可悲的是'), 120], [at('有的是人干'), 160]]), 96, ramp(t, [[at('更可悲的是'), 1.3], [at('有的是人干'), 1.08]])] });

  // ================= 健康的 FDE =================
  // 52. a healthy road: Demo, paid pilot, real launch, reuse, coins trailing along
  shot('但我朋友也说', (lt, t) => {
    vgrad(0, PW, 0, FLOOR, [[0, '#2A1430'], [FLOOR, '#8A4A4A']]); vgrad(0, PW, FLOOR, PH, [[0, '#4A2C1C'], [30, '#2A1810']]);
    R(0, FLOOR - 4, PW, 4, '#6A4028');
    const M = [['一棍子全打死', 40, 'Demo'], ['付费试点', 120, '付费试点'], ['真金白银的上线', 200, '上线'], ['标准化复用', 280, '复用']];
    M.forEach(([ph, x, w], i) => { const on = after(t, ph); frame(x - 26, FLOOR - 50, 52, 22, { fill: on ? '#3A2418' : '#1A1220' }); pxText(w, x, FLOOR - 39, { size: 6.5, color: on ? GOLDL : '#8C88A6' }); if (on) { pxFx({ type: 'glow', x, y: FLOOR - 39, r: 22, a: .35 }); if (i) kick(since(t, ph), 1.5); } if (i < 3) pxText('→', x + 40, FLOOR - 39, { size: 7, color: on ? GOLDL : '#5A4A6A' }); });
    const keys = M.map(m => [at(m[0]), m[1]]).filter(k => k[0] != null);
    const w = walker(t, keys.length ? keys : [[0, 40]]);
    cl(w.x, FLOOR - 4, w.moving ? { ...feelT('happy', t), view: 'side', walk: w.x / 10 } : feelT('hopeful', t));
    for (let i = 0; i < 4; i++) if (after(t, '付费试点')) coin(w.x - 26 - i * 10, FLOOR - 12 - Math.abs(Math.round(Math.sin(t * 6 + i) * 4)));
  }, { in: { type: 'dissolve', dur: .4 }, cam: (lt, t) => [ramp(t, [[at('但我朋友也说'), 100], [at('付费试点'), 120], [at('真金白银的上线'), 200], [at('标准化复用'), 220]]), 100, 1.3] });
  // 53. "free" crossed out, "up-front investment" stamped in; coins following behind
  shot('人家的 Demo 不叫免费', (lt, t) => {
    hall(t);
    frame(90, 36, 140, 40, { fill: CREAM });
    const inv = since(t, '前置投资');
    pxText('免费', 160, 56, { size: 12, color: inv >= 0 ? '#8C88A6' : RED, stroke: false }); if (inv >= 0) { R(136, 56, 48, 2, RED); stamp('前置投资', 160, 96, inv, 10); kick(inv, 3); }
    const back = since(t, '屁股后面跟着钱');
    cl(back < 0 ? 160 : 160 + back * 50, FLOOR, back < 0 ? feelT('proud', t) : { ...feelT('happy', t), view: 'side', walk: back * 6 });
    if (back >= 0) for (let i = 0; i < 6; i++) coin(160 + back * 50 - 30 - i * 12, FLOOR - 8 - Math.abs(Math.round(Math.sin(t * 6 + i) * 4)));
  }, { in: { type: 'cut' }, cam: (lt, t) => [ramp(t, [[at('人家的 Demo 不叫免费'), 160], [at('屁股后面跟着钱'), 200]]), 84, ramp(t, [[at('人家的 Demo 不叫免费'), 1.2], [at('前置投资'), 1.35], [at('屁股后面跟着钱'), 1.1]])] });
  // 54. two cards: the real special forces, the sucker at the stall; between them one question: is there a next step?
  shot('说白了，正规特种兵', (lt, t) => {
    hall(t);
    card(20, 24, 136, 110, '正规特种兵', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#0E0A20'], [h, '#2A1C44']]); cl(x + w / 2, y + h, { ...feelT('cool', t), noShadow: true }); for (let i = 0; i < 3; i++) coin(x + 20 + i * 12, y + 20); }, pop(lt, .3));
    const k2 = after(t, '大冤种', -.3) ? pop(since(t, '大冤种') + .3, .3) : 0;
    card(164, 24, 136, 110, '大冤种', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#3A2418'], [h, '#5A3A2C']]); cl(x + w / 2, y + h, { ...feelT('cry', t), noShadow: true }); }, k2);
    if (after(t, '到底有没有下一步')) { chip('有没有下一步？', 160, 150, GOLDL, 10); kick(since(t, '到底有没有下一步'), 3); }
  }, { in: { type: 'wipe', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('说白了，正规特种兵'), 88], [at('大冤种') - .1, 88], [at('大冤种') + .4, 232], [at('到底有没有下一步'), 232], [at('到底有没有下一步') + .4, 160]]), ramp(t, [[at('到底有没有下一步'), 80], [at('到底有没有下一步') + .4, 96]]), ramp(t, [[at('说白了，正规特种兵'), 1.3], [at('到底有没有下一步'), 1.3], [at('到底有没有下一步') + .4, 1.03]])] });

  // ================= 四 保命三句 =================
  shot('所以他现在彻底长记性了', title('四', '保命三句', 'shield'), { in: { type: 'slide', dur: .3 }, cam: push(160, 88, 1.02, 1.1) });
  // 55. three questions before any Demo; 黑哥 says write them down, each one learnt the hard way
  shot('如果你也在看这类岗位', (lt, t) => {
    curtain(t, 1); spot(110, t); spot(230, t, { a: .25 });
    hg(110, FLOOR, { ...emo(t, [[0, 'determined'], [at('赶紧记下来'), 'excited']]), poseR: 'point' });
    if (after(t, '赶紧记下来')) { frame(190, 40, 80, 70, { title: '小本本', fill: CREAM }); for (let i = 0; i < 3; i++) R(200, 60 + i * 12, Math.round(Math.min(60, since(t, '赶紧记下来') * 40 - i * 20)), 2, INK); }
    if (after(t, '被坑的经验')) chip('被坑出来的经验', 230, 128, PINK, 7);
  }, { in: { type: 'iris', dur: .4 }, cam: push(170, 96, 1.05, 1.25) });
  // 56–58. the three questions, each on a gold scroll, each followed by its verdict
  const scroll = (n, lines, t, lt) => { const k = over(lt / .5), y = Math.round(lerp(180, 14, k)); frame(40, y, 240, 66, { title: `第${n}句`, fill: CREAM }); lines.forEach((l, i) => pxText(l, 160, y + 24 + i * 16, { size: 8, color: INK, stroke: false })); };
  shot('第一句', (lt, t) => {
    darkStage(t, [160]); scroll('一', ['Demo 做完之后', '有没有预算和上线时间表？'], t, lt);
    const v = since(t, '如果没有，别扯淡');
    cl(160, FLOOR, emo(t, [[0, 'thinking'], [at('如果没有，别扯淡'), 'angry'], [at('纯牛马'), 'ko']]));
    if (v >= 0) { stall(160, t, { sign: '免费试吃' }); stamp('纯牛马', 260, 130, since(t, '纯牛马'), 9); kick(since(t, '纯牛马'), 3.5); }
  }, { in: { type: 'slide', dur: .3 }, cam: (lt, t) => [160, ramp(t, [[at('第一句'), 70], [at('如果没有，别扯淡'), 100]]), ramp(t, [[at('第一句'), 1.15], [at('如果没有，别扯淡'), 1.05]])] });
  shot('第二句', (lt, t) => {
    darkStage(t, [160]); scroll('二', ['绩效看什么？', 'Demo 数量，还是上线数量？'], t, lt);
    const run = since(t, '赶紧跑');
    cl(run < 0 ? 160 : 160 + run * 180, FLOOR, run < 0 ? emo(t, [[0, 'thinking'], [at('全看 Demo 数量'), 'scared']]) : { ...feelT('scared', t), view: 'side', walk: run * 10 });
    if (run >= 0) { for (let i = 0; i < 6; i++) R(Math.round(140 + run * 180 - 30 - i * 8), FLOOR - 20 + i * 3, 10, 1, CREAM); stamp('赶紧跑', 90, 130, run, 9); kick(run, 3.5); }
  }, { in: { type: 'slide', dur: .3 }, cam: (lt, t) => [ramp(t, [[at('第二句'), 160], [at('赶紧跑'), 160], [at('赶紧跑') + .8, 220]]), ramp(t, [[at('第二句'), 70], [at('全看 Demo 数量'), 100]]), ramp(t, [[at('第二句'), 1.15], [at('全看 Demo 数量'), 1.05]])] });
  shot('第三句', (lt, t) => {
    darkStage(t, [160]);
    const show = since(t, '陪着老板在装逼');
    if (show < 0) { scroll('三', ['肯不肯给真实数据', '和系统底层权限？'], t, lt); cl(160, FLOOR, emo(t, [[0, 'thinking'], [at('如果不肯给'), 'suspicious']])); }
    else { curtain(t, 1); spot(160, t, { w: 80 }); const j = jump(onTwos(t), at('陪着老板在装逼'), at('陪着老板在装逼') + .6, 18); hg(160, FLOOR, { ...feelT('smug', t), dy: j.dy, sq: j.sq, poseL: 'up', poseR: 'up' }); chip('老板 · 看杂技', 160, 40, GOLDL, 7); [50, 270].forEach((bx, i) => cl(bx, FLOOR, { ...feelT('bored', t), aL: Math.floor(t * 4 + i) % 2 ? 1.2 : .2, aR: Math.floor(t * 4 + i) % 2 ? 1.2 : .2 })); stamp('装X', 250, 70, show, 10); kick(show, 3.5); }
  }, { in: { type: 'slide', dur: .3 }, cam: (lt, t) => after(t, '陪着老板在装逼') ? [160, 96, 1.05] : [160, ramp(t, [[at('第三句'), 70], [at('如果不肯给'), 100]]), ramp(t, [[at('第三句'), 1.15], [at('如果不肯给'), 1.05]])] });

  // ================= 写在最后 =================
  // 59. the phone again: the 上岸 post goes in the bin
  shot('前几天，他默默把', (lt, t) => {
    bedroom(t);
    cl(226, FLOOR - 24, feelT('sad', t));
    const del = since(t, '朋友圈删了');
    pxFx({ type: 'glow', x: 140, y: 86, r: 60, a: .25 }); phone(140, 88, '上岸！', t, { likes: 99, del: del < 0 ? 0 : clamp(del / .8) });
    if (del >= 0) { icon('trash', 196, 120, 2); kick(del, 2); }
  }, { in: { type: 'dissolve', dur: .4 }, cam: push(150, 92, 1.15, 1.35) });
  // 60. tasting at the roadside vs. ordering the meal
  shot('所以观众姥爷们记住了', (lt, t) => {
    hall(t);
    card(20, 24, 136, 110, '路边试吃', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#3A2418'], [h, '#5A3A2C']]); for (let j = 0; j < 4; j++) pellipse(x + 30 + j * 20, y + 50, 4, 3, '#C0483A'); pxText('免费', x + w / 2, y + 22, { size: 8, color: CREAM }); }, pop(lt, .3));
    const k2 = after(t, '真金白银#3', -.3) ? pop(since(t, '真金白银#3') + .3, .3) : 0;
    card(164, 24, 136, 110, '点餐', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#E8A06A'], [h, '#C08A5C']]); frame(x + 30, y + 20, 66, 44, { fill: CREAM }); pxText('菜单', x + 63, y + 34, { size: 6, color: INK, stroke: false }); for (let i = 0; i < 3; i++) coin(x + 44 + i * 18, y + 54); }, k2);
    if (after(t, '才叫点餐')) { stamp('点餐', 232, 112, since(t, '才叫点餐'), 10); kick(since(t, '才叫点餐'), 4); }
  }, { in: { type: 'wipe', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('所以观众姥爷们记住了'), 160], [at('路边试吃'), 88], [at('真金白银#3') - .1, 88], [at('真金白银#3') + .4, 232]]), 82, ramp(t, [[at('所以观众姥爷们记住了'), 1.03], [at('路边试吃'), 1.3]])] });
  // 61. 黑哥 asks the audience: what did your last free job get you?
  shot('你上一次免费帮人', (lt, t) => {
    sunburst(t, '#5A1420', '#7A1C2A', 80, 50);
    hg(76, PH + 10, { ...feelT('thinking', t), poseR: 'point' });
    if (after(t, '血泪史')) { chip('你的血泪史？', 120, 22, GOLDL, 6.5); for (let i = 0; i < 5; i++) { const ph = (t * .8 + i / 5) % 1; R(Math.round(120 + (hash(i) - .5) * 30), Math.round(36 + ph * 40), 1, 3, SKY); } }
  }, { res: [160, 90], in: { type: 'slide', dur: .3 }, cam: push(80, 48, 1.0, 1.12) });
  // 62. both of them: more on workers and AI to come
  shot('我会继续更新', (lt, t) => {
    curtain(t, 1); spot(130, t); spot(210, t);
    hg(130, FLOOR, { ...feelT('happy', t), poseR: 'wave' }); cl(210, FLOOR, feelT('happy', t));
    chip('打工人 × AI', 170, 40, GOLDL, 9);
    if (after(t, '感谢关注')) for (let i = 0; i < 8; i++) { const ph = (since(t, '感谢关注') * 1.2 + hash(i)) % 1; icon('heart', 120 + hash(i + 3) * 100, 140 - ph * 120, 1); }
  }, { in: { type: 'dissolve', dur: .35 }, cam: push(170, 100, 1.1, 1.25) });
  // 63. next time: the coder friend from the last episode, why can't he leave?
  shot('下一期咱们聊聊', (lt, t) => {
    hall(t);
    frame(80, 24, 160, 110, { title: '下期', fill: '#1A1C30' });
    cl(130, 116, { ...feelT('nervous', t), noShadow: true }); chip('码农朋友', 130, 44, CREAM, 6);
    if (after(t, '码农明知道这行邪门')) chip('邪门', 200, 60, PINK, 8);
    if (after(t, '舍不得走')) { stamp('舍不得走？', 190, 100, since(t, '舍不得走'), 7); kick(since(t, '舍不得走'), 2.5); }
  }, { in: { type: 'iris', dur: .4 }, cam: push(160, 80, 1.05, 1.25) });
  // 64. likes and shares rising
  shot('喜欢的话点赞收藏不迷路', (lt, t) => {
    curtain(t, 1); spot(160, t, { w: 110 });
    [['heart', 100, '点赞'], ['star', 160, '收藏'], ['bolt', 220, '转发']].forEach(([ic, x, w], i) => { const k = pop(lt - i * .5, .3); if (k <= 0) return; const y = Math.round(lerp(150, 60, k) + Math.sin(t * 3 + i) * 2); icon(ic, x, y, 3); pxFx({ type: 'glow', x, y, r: 22, a: .4 }); chip(w, x, y + 26, GOLDL, 7); });
    if (after(t, '转 FDE 的朋友')) chip('转发给想转 FDE 的朋友', 160, 30, CREAM, 7);
    cl(270, FLOOR, { ...feelT('happy', t), aR: 1.3 });
  }, { in: { type: 'dissolve', dur: .35 }, cam: push(160, 92, 1.05, 1.15) });
  // 65. the sign-off: 黑哥 centre stage, the seal, the curtain closes
  shot('我是黑哥', (lt, t) => {
    const end = D.len - t, close = end < 1.8 ? 1 - end / 1.8 : 0;
    curtain(t, 1); spot(160, t, { w: 100 });
    hg(130, FLOOR, { ...emo(t, [[0, 'happy'], [at('只说真话'), 'cool']]), poseR: after(t, '只说真话') ? 'fistUp' : 'wave' });
    cl(210, FLOOR, feelT('happy', t));
    if (after(t, '不吹 AI')) chip('不吹 AI 也不恐惧 AI', 170, 40, GOLDL, 7);
    curtainCloth(t, 1 - close);
    if (after(t, '只说真话')) stamp('只说真话', 170, 70, since(t, '只说真话'), 9);
  }, { in: { type: 'iris', dur: .4 }, cam: (lt, t) => [170, 100, ramp(t, [[at('我是黑哥'), 1.1], [D.len - 1.8, 1.2], [D.len - .3, 1.02]])] });

  // ---------- the chapter bar and the gold words ----------
  const chapters = [['上岸', 0], ['FDE 是个啥', at('FDE，听起来')], ['免费演示工程师', at('可我这朋友干了半年')], ['魔幻半年', at('刚入职第一周')], ['免费试吃摊', at('他就跟我吐槽')], ['三个谁', at('后来他把这里面的猫腻')], ['健康的 FDE', at('但我朋友也说')], ['保命三句', at('所以他现在彻底长记性了')], ['写在最后', at('前几天，他默默把')]];
  const keys = ['FDE', '上岸', '火坑', '前沿部署工程师', 'Palantir', '技术特种兵', '屎山代码', '疯狂招聘', 'Free Demo Engineer', '免费演示工程师', '免费试吃摊', '免费苦力', '保命真话', '大饼', '尖刀连', '30 分钟', 'deepseek', '半价', 'token', '报销', 'Demo', '没有然后', '七八个', '一单都没有', '香肠', '开张', '真实数据', '系统权限', '弟弟', '谁给钱', 'AI 泡沫', '谁考核', 'KPI', '谁占便宜', '恶意比价', '猴版', '有的是人干', '付费试点', '前置投资', '下一步', '预算', '上线时间表', '绩效', '赶紧跑', '点餐', '血泪史', '舍不得走', '只说真话'];
  LOOPS.pxFde = () => {};
  Object.assign(LOOPS.pxFde, { len: D.len, film: K.film({ chapters, keys }) });
})();
