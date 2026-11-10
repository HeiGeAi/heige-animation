// scenes/nvyou_e.js: V071 shots 193.22–252.08 s, the ending: years later (the kid and the kindergarten knowledge base),
// the proposal that costs nothing (余生只维护你一个项目), she reviews the source, 800 love lines a second mean nothing,
// a montage of what does (the jargon, the bad joke, the scolding, the 3 a.m. lamp, the errors), and the walk home.
(() => {
  const N = window.NV;
  const { G, VX, K, shot, P, A, AT, sfx, edit, flash, heige, gf, ppl, kid, prop, bubble, label, tag, burst, heartsUp, coinsUp, firework,
    seg01, sm, lerp, hh, clamp01, fadeIO, outlined, panel, icon, slam, floatTxt, toast, titleCard, clockUI, crossOut, stamp, termWin, heartsUI, counterUI,
    PC, SOFA, DESK2, KIN, DUSK, NIGHT, WARM, AMBER, PINK } = N;
  const END = N.DD.len;
  const emo = (t, keys) => emotions(t, keys);

  // ---------------------------------------------------------------- small pieces of this chunk
  // the back of a laptop lid (her heart sticker), seen from the front of the study desk
  let LID = null;
  const lidImg = () => LID || (LID = (() => { const s = new Spr();
    s.rect(-14, -2, 28, 2, '#6A6A78').rect(-12, -20, 24, 18, '#4A4858').rect(-12, -20, 24, 2, '#6A6A78')
      .rect(-4, -14, 3, 2, '#E83A54').rect(1, -14, 3, 2, '#E83A54').rect(-4, -12, 8, 2, '#E83A54').rect(-2, -10, 4, 2, '#E83A54');
    s.outline('#140A10'); return VX.capture((x, y) => s.draw(x, y), 40, 40, 20, 34); })());
  const lid = (x, y, z) => VX.sprite(lidImg(), x, y, z, { k: 1 / 40 });
  // the 「小日子」 bar over the montage (kept above the subtitle band)
  const LIFE = [[237.0, 0], [P('黑话') + .2, .16], [P('烂梗') + .2, .32], [P('乱花钱') + .3, .48], [P('留一盏灯') + .3, .64], [P('每一次报错') + .6, .8], [P('一点点跑通') + .5, 1]];
  const lifeK = t => { for (let i = 1; i < LIFE.length; i++) if (t < LIFE[i][0]) return lerp(LIFE[i - 1][1], LIFE[i][1], sm(seg01(t, LIFE[i - 1][0] + (LIFE[i][0] - LIFE[i - 1][0]) * .55, LIFE[i][0]))); return 1; };
  function lifeBar(c, t, a = 1) {
    const k = lifeK(t), bx = 620, by = 868, bw = 740, full = k >= .999;
    c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(12,8,16,.78)'; c.fillRect(bx - 8, by - 8, bw + 16, 38);
    c.fillStyle = '#E8A93A'; c.fillRect(bx, by, bw * k, 22); c.fillStyle = 'rgba(255,240,200,.45)'; c.fillRect(bx, by, bw * k, 6);
    outlined(c, '小日子', bx - 28, by + 11, 42, '#FFD34E', { align: 'right', lw: 8 });
    outlined(c, `${Math.round(k * 100)}%`, bx + bw + 28, by + 11, 38, full ? '#FFD34E' : '#F2E6C8', { align: 'left', lw: 7 });
    c.restore();
  }
  // love letters raining down the frame
  function loveRain(c, t, t0, t1, dens) {
    if (t < t0 || t > t1) return;
    c.save(); c.beginPath(); c.rect(0, 0, 1920, 910); c.clip();
    for (let i = 0; i < 64; i++) { const b = t0 + i * .07; if (t < b || hh(i, 3) > dens(t)) continue; const a = t - b, col = i % 9, x = 60 + col * 220 + (hh(i, 1) - .5) * 70, y = -140 + ((a * (380 + hh(i, 2) * 260)) % 1160), r = (hh(i, 4) - .5) * .5;
      c.save(); c.translate(x, y); c.rotate(r + Math.sin(a * 2 + i) * .08); c.globalAlpha = .92;
      c.fillStyle = '#140A10'; c.fillRect(-84, -56, 168, 112); c.fillStyle = i % 3 ? '#ECE6DA' : '#F4C4D2'; c.fillRect(-80, -52, 160, 104);
      c.fillStyle = '#C8323C'; c.fillRect(-80, -52, 160, 18); c.fillStyle = '#9A8A78'; c.fillRect(-60, -18, 120, 6); c.fillRect(-60, 0, 90, 6); c.fillRect(-60, 18, 104, 6);
      icon(c, 'heart', 40, 22, 4); c.restore(); }
    c.restore();
  }
  // errors stacking up, then flipping to fixed
  function errPanel(c, t, rows, fix0) {
    if (t < rows[0][1] - .1) return; const a = Math.min(1, (t - rows[0][1] + .1) * 5), x = 1290, y = 230, w = 560;
    c.save(); c.globalAlpha = a; panel(c, x, y, w, 70 + rows.length * 88);
    rows.forEach(([txt, at], i) => { if (t < at) return; const fx = fix0 + i * .22, fixed = t > fx, yy = y + 70 + i * 88, k = 1 + .35 * Math.exp(-(t - (fixed ? fx : at)) * 12);
      c.save(); c.translate(x + 40, yy); c.scale(k, k);
      if (fixed) { icon(c, 'star', 0, -22, 6); outlined(c, '已解决', 70, 0, 44, '#FFD34E', { align: 'left', lw: 7, shadow: false }); }
      else outlined(c, txt, 0, 0, 40, (Math.floor(t * 6) % 2) ? '#FF6A5A' : '#FF8A7A', { align: 'left', lw: 7, shadow: false });
      c.restore(); });
    c.restore();
  }
  const greyAll = (c, k) => { if (k <= 0) return; c.save(); c.globalCompositeOperation = 'saturation'; c.globalAlpha = k; c.fillStyle = '#808080'; c.fillRect(0, 0, 1920, 1080); c.restore(); };

  // block edits this chunk needs (all after 193 s, so the earlier chunks never see them)
  const T_E = 193.2;
  edit(T_E, 82, G + 1, 89, 'woolPink');                                            // the kid's stool at the kindergarten table
  for (let x = 91; x <= 94; x++) edit(T_E, x, G + 1, 59, 'plankSoft');             // the front desk in the study (they face the camera)
  edit(T_E, 84, G + 2, 55, 'offlamp');                                             // the desk lamp next to the PC (lit at 3 a.m.)

  // ---------------------------------------------------------------- 1 · 往后你俩结了婚生了娃，画风估计也跟别人不一样。
  const S1 = A('往后你俩结了婚生了娃'), S2 = A('别的小孩三岁'), BABY = P('生了娃'), HUAF = P('画风估计');
  const HUT = []; {                                                                 // a little yellow room next to the house, block by block
    const wall = []; for (const [x, z] of [[99, 59], [99, 58], [99, 57], [100, 57], [101, 57], [101, 58], [101, 59]]) wall.push([x, z]);
    for (const y of [1, 2]) for (const [x, z] of wall) HUT.push([x, G + y, z, 'woolYellow']);
    HUT.push([100, G + 3, 59, 'plankSoft']); for (const [x, z] of [[99, 57], [100, 57], [101, 57], [99, 58], [100, 58], [101, 58], [99, 59], [101, 59]]) HUT.push([x, G + 3, z, z === 58 && x === 100 ? 'woolRose' : 'plankSoft']);
    HUT.forEach((b, i) => { const t = S1 + .45 + i * (3.1 / HUT.length); edit(t, b[0], b[1], b[2], b[3]); if (i % 2 === 0) sfx(t, 'place', -14); });
  }
  shot(S1, S2, { day: t => t < S1 + .35 ? DUSK : t < S1 + 3.4 ? .52 + .4 * Math.sin((t - S1 - .35) * 9.5) : lerp(.6, DUSK, sm(seg01(t, S1 + 3.4, S2))), fog: [34, 100], kicks: [[BABY, .9]],
    keys: [K(S1, [104.2, G + 4.6, 73.5], [99.6, G + 2.0, 60], 60), K(BABY, [103.6, G + 4.0, 72], [99.7, G + 1.9, 61], 56), K(S2, [103.0, G + 3.4, 70.6], [99.8, G + 1.8, 61.6], 50)],
    act: t => {
      heige(98.3, G + 1, 64.6, { ...emo(t, [[0, 'hopeful'], [BABY, 'love'], [HUAF, 'proud']]), view: 'q' }, { noShadow: false });
      gf(101.4, G + 1, 64.6, t < BABY ? 'shy' : 'cheer', { flip: true, hop: t > BABY ? (t - BABY) * 1.8 % 1 : 0, emote: t > BABY ? 'heart' : undefined, emoteAge: t - BABY });
      if (t > BABY) { const u = sm(seg01(t, BABY, BABY + .35)); kid(99.85, G + 1, 65.0, t < HUAF ? 'happy' : 'proud', t, { dy: (1 - u) * 1.2 - Math.abs(Math.sin(t * 6)) * .08 }); }
      burst(t, BABY, 99.85, G + 1.6, 65.0, [255, 211, 78], 26); heartsUp(t, BABY + .1, BABY + 1.4, 99.85, G + 1.8, 65.0, 5);
    },
    ui: (c, t) => { titleCard(c, t, S1 + .1, BABY - .05, '多年以后', ''); } });
  sfx(S1 + .1, 'chime', -12); sfx(BABY, 'pop', -8); sfx(BABY + .05, 'levelup', -12); sfx(HUAF, 'xp', -12);

  // ---------------------------------------------------------------- 2 · 别的小孩三岁背唐诗、学英语，你俩的孩子
  const S3 = AT('三岁学Python'), TS = P('背唐诗'), EN = P('学英语'), OURS = P('你俩的孩子');
  shot(S2, S3, { day: .72, fog: [36, 110],
    keys: [K(S2, [77.8, G + 3.2, 97.6], [78.9, G + 1.5, 90], 46), K(OURS, [79.6, G + 3.2, 97.6], [79.8, G + 1.5, 90], 50), K(S3, [81.4, G + 3.4, 97.8], [81.6, G + 1.6, 89.6], 56)],
    act: t => {
      const kk = { k: 1 / 70 };
      ppl(77.8, G + 1, 90.4, '男生2', Math.floor(t * 3) % 2 ? 'talk' : 'happy', t, { ...kk, dy: .03 * Math.sin(t * 7) });
      ppl(79.9, G + 1, 90.4, '女生', Math.floor(t * 3 + 1) % 2 ? 'talk' : 'happy', t, { ...kk, dy: .03 * Math.sin(t * 7 + 1.5) });
      prop(78.05, G + 1.35, 90.75, 'book', { k: 1 / 52 }); prop(80.15, G + 1.35, 90.75, 'book', { k: 1 / 52 });
      label(77.8, G + 2.0, 90.4, '唐诗', .42, '#FFD34E', t, TS); label(79.9, G + 2.0, 90.4, 'ABC', .42, '#FFFFFF', t, EN);
      if (t > TS) for (let i = 0; i < 3; i++) { const a = (t - TS + i * .4) % 1.2; VX.pt(77.8 + Math.sin(a * 4 + i) * .2, G + 1.6 + a * .7, 90.6, .05, [255, 214, 120], true); }
      if (t > OURS - .2) kid(82.5, G + 2, 89.5, 'talk', t);
    } });
  sfx(S2 + .2, 'villager', -12); sfx(TS, 'page', -10); sfx(EN, 'pop', -10);

  // ---------------------------------------------------------------- 3 · 三岁学 Python，五岁就能给幼儿园部署一套本地 RAG 知识库
  const S4 = AT('背着小书包'), PY = P('三岁学Python'), FIVE = P('五岁就能'), DEP = P('部署一套'), KB = P('本地RAG知识库');
  const KBX = 88.5, KBY = G + 1.5, KBZ = 87.25;                                   // the front face of the obsidian block
  const BOOKS = 8, bookAt = i => DEP + .05 + i * .16;
  shot(S3, S4, { day: .72, fog: [36, 110], kicks: [[KB, .8]],
    keys: [K(S3, [82.8, G + 3.4, 96.8], [83, G + 2.1, 89.4], 46), K(DEP - .2, [84.2, G + 3.7, 97.6], [84.6, G + 1.7, 88.2], 62), K(S4, [85.2, G + 3.4, 96.6], [85.4, G + 1.7, 88], 60)],
    lights: t => { const k = sm(seg01(t, DEP, KB + .3)); if (k > 0) VX.light(KBX, G + 2, KBZ + .3, [.75, .5, 1], 3 + 2 * k, .4 + .9 * k); },
    act: t => {
      kid(82.5, G + 2, 89.5, t < FIVE ? 'talk' : t < KB ? 'happy' : 'proud', t, { dy: t < DEP ? -Math.abs(Math.sin(t * 9)) * .03 : 0, tag: t < FIVE ? '3 岁' : '5 岁' });
      prop(83.5, G + 2.02, 89.7, 'laptop', { k: 1 / 44 });
      if (t > PY && t < DEP) label(83.5, G + 2.7, 89.7, 'Python', .34, '#FFD34E', t, PY);
      if (t < DEP) for (let i = 0; i < 4; i++) { const a = (t * 1.6 + i / 4) % 1; VX.pt(83.3 + (hh(i) - .5) * .4, G + 2.4 + a * .5, 89.8, .035, [255, 211, 78], true); }
      for (let i = 0; i < BOOKS; i++) { const b = bookAt(i), u = seg01(t, b, b + .7); if (t < b || u >= 1) continue; const e = sm(u);
        prop(lerp(80.6 + (i % 2), KBX, e), lerp(G + 1.4 + (i % 3) * .35, KBY - .2, e) + Math.sin(u * Math.PI) * 1.4, lerp(86.2, KBZ, e), 'book', { k: lerp(1 / 26, 1 / 60, e) }); }
      for (let i = 0; i < BOOKS; i++) burst(t, bookAt(i) + .7, KBX, KBY, KBZ, i % 2 ? [190, 140, 255] : [255, 211, 78], 10);
      const g = sm(seg01(t, DEP, KB + .5));
      if (g > 0) for (let i = 0; i < 22; i++) { const th = i / 22 * 6.28 + t * 1.6, r = .75 + .15 * Math.sin(t * 3 + i), yy = KBY + ((i * .37 + t * .6) % 1.6) - .5;
        VX.pt(KBX + Math.cos(th) * r, yy, KBZ - .75 + Math.sin(th) * r, .05 * g, i % 3 ? [190, 140, 255] : [255, 211, 78], true); }
      label(KBX, G + 2.75, KBZ - .5, '本地知识库', .5, '#FFD34E', t, KB);
    } });
  sfx(PY, 'type_burst', -11); sfx(FIVE, 'xp_2', -11); for (let i = 0; i < BOOKS; i++) sfx(bookAt(i), 'page', -15); sfx(DEP + .3, 'enchant', -9); sfx(KB, 'powerup', -10);

  // ---------------------------------------------------------------- 4 · 背着小书包跟老师说：老师，我把绘本全喂进去了
  const S5 = AT('以后小朋友'), SAY = P('跟老师说'), FEED = P('我把绘本');
  const TCH = { x: 87.4, z: 91.4 }, kidX = t => lerp(82.6, 86.1, sm(seg01(t, S4 + .15, SAY + .2)));
  shot(S4, S5, { day: .72, fog: [36, 110],
    keys: [K(S4, [83.4, G + 3.0, 97.8], [83.8, G + 1.5, 90.4], 50), K(SAY + .2, [85.6, G + 3.0, 98], [86.2, G + 1.7, 90.8], 50), K(S5, [86.2, G + 2.9, 97.4], [86.6, G + 1.8, 91], 46)],
    lights: t => VX.light(KBX, G + 2, KBZ + .3, [.75, .5, 1], 5, 1.2),
    act: t => {
      const walking = t > S4 + .15 && t < SAY + .2, x = kidX(t);
      kid(x, G + 1, lerp(90.4, 91.3, seg01(t, S4, SAY)), t < FEED ? 'neutral' : 'talk', t, { dy: walking ? -Math.abs(Math.sin(t * 10)) * .1 : 0 });
      ppl(TCH.x, G + 1, TCH.z, '老师', t < SAY + .3 ? 'neutral' : 'happy', t);
      bubble(x, G + 1.3, 91.3, '老师！', t, SAY - .05, FEED - .3);
      bubble(x, G + 1.3, 91.3, '老师\n绘本我全喂进去了', t, FEED - .25, S5);
      for (let i = 0; i < 10; i++) { const th = i / 10 * 6.28 + t * 1.6; VX.pt(KBX + Math.cos(th) * .8, KBY + ((i * .37 + t * .6) % 1.6) - .5, KBZ - .75 + Math.sin(th) * .8, .05, i % 3 ? [190, 140, 255] : [255, 211, 78], true); }
    } });
  for (let i = 0; i < 5; i++) sfx(S4 + .25 + i * .32, 'step', -15); sfx(SAY, 'chat', -11); sfx(FEED - .25, 'chat', -10);

  // ---------------------------------------------------------------- 5 · 以后小朋友问十万个为什么，你直接问它就行。
  const S6 = A('至于求婚'), WHY = P('十万个为什么'), ASK = P('你直接问它就行');
  shot(S5, S6, { day: .72, fog: [36, 110], kicks: [[ASK, 1.1]],
    keys: [K(S5, [87.0, G + 3.2, 97.6], [87.3, G + 1.7, 89.4], 56), K(ASK, [87.0, G + 2.9, 96.6], [87.1, G + 2.0, 90.4], 46), K(S6, [87.0, G + 2.8, 96.0], [87.1, G + 2.1, 90.8], 40)],
    lights: t => VX.light(KBX, G + 2, KBZ + .3, [.75, .5, 1], 5, 1.3),
    act: t => {
      kid(86.1, G + 1, 91.3, t < ASK ? 'talk' : 'proud', t, { dy: t > ASK ? -Math.abs(Math.sin((t - ASK) * 7)) * .12 : 0 });
      ppl(TCH.x, G + 1, TCH.z, '老师', t < WHY ? 'happy' : t < ASK ? 'worry' : 'shock', t, { dy: t > ASK && t < ASK + .3 ? .12 * Math.sin((t - ASK) / .3 * Math.PI) : 0 });
      bubble(86.1, G + 1.3, 91.3, '以后问它就行', t, S5 + .2, S6);
      if (t > ASK) label(TCH.x + .1, G + 3.05, TCH.z, '!', .9, '#FFD34E', t, ASK);
      for (let i = 0; i < 6; i++) { const b = WHY + i * .14, a = t - b; if (a < 0 || a > 1.6) continue;
        label(KBX + (hh(i, 7) - .5) * 1.4, KBY + .8 + a * .9, KBZ - .3, '?', .4, i % 2 ? '#C8A8FF' : '#FFD34E', t, b, b + 1.6); }
      for (let i = 0; i < 14; i++) { const th = i / 14 * 6.28 + t * 1.6; VX.pt(KBX + Math.cos(th) * .8, KBY + ((i * .37 + t * .6) % 1.6) - .5, KBZ - .75 + Math.sin(th) * .8, .05, i % 3 ? [190, 140, 255] : [255, 211, 78], true); }
    } });
  for (let i = 0; i < 6; i++) sfx(WHY + i * .14, 'pop', -15); sfx(ASK, 'hit', -9); sfx(ASK + .05, 'villager', -10);

  // ---------------------------------------------------------------- 6 · 至于求婚，更是连买玫瑰花摆蜡烛的钱都省了。挑个普通的晚上
  const S7 = AT('你俩并排'), ROSE = P('玫瑰花'), CAND = P('摆蜡烛'), SAVE = P('钱都省了'), EVE = P('挑个普通的晚上');
  const RC = { x: 84, z: 71.2 }, RING = 10, ringAt = i => P('至于求婚') + .55 + i * (CAND + .1 - P('至于求婚') - .55) / RING;
  shot(S6, S7, { day: t => lerp(DUSK, NIGHT, sm(seg01(t, EVE - .1, EVE + .9))), fog: [34, 100], kicks: [[SAVE, 1.2]],
    keys: [K(S6, [84, G + 2.4, 77.2], [84, G + 1.5, 71.2], 56), K(SAVE, [84, G + 2.8, 76.6], [84, G + 1.4, 71.2], 60), K(EVE + .2, [84.6, G + 3.4, 76.4], [85.6, G + 2.6, 66], 60), K(S7, [88.5, G + 6.5, 75.5], [92, G + 3, 59], 60)],
    act: t => {
      heige(RC.x, G + 1, RC.z, { ...emo(t, [[0, 'hopeful'], [ROSE, 'nervous'], [SAVE, 'smug']]), view: 'front', poseR: t > SAVE + .2 && t < EVE ? 'cheer' : undefined });
      if (t < SAVE + .15) prop(RC.x + .35, G + 1.75, RC.z + .25, 'ring', { k: 1 / 70 });
      for (let i = 0; i < RING; i++) { const b = ringAt(i); if (t < b || t > SAVE) continue; const th = i / RING * 6.28 + .3, k = Math.min(1, (t - b) * 6);
        prop(RC.x + Math.cos(th) * 1.7, G + 1, RC.z + Math.sin(th) * 1.2, i % 2 ? 'candle' : 'rose', { k: k / 34 }); }
      for (let i = 0; i < RING; i++) { const th = i / RING * 6.28 + .3; burst(t, SAVE + i * .015, RC.x + Math.cos(th) * 1.7, G + 1.3, RC.z + Math.sin(th) * 1.2, [235, 230, 240], 8); }
      coinsUp(t, SAVE + .1, RC.x, G + 1.6, RC.z + .4, 14);
    },
    ui: (c, t) => { if (t > ROSE && t < SAVE + .75) crossOut(c, t, SAVE, '玫瑰 蜡烛'); } });
  for (let i = 0; i < RING; i += 2) sfx(ringAt(i), 'pop', -14); sfx(SAVE, 'poof', -7); sfx(SAVE + .15, 'coin', -9); sfx(SAVE + .4, 'coin', -11); sfx(EVE + .1, 'chime', -14);

  // ---------------------------------------------------------------- 7 · 你俩并排坐在书房改完最后一行代码，你打开终端
  // study: the two sit side by side behind a front desk (z 59), facing the camera; hidden stools lift them half a block
  const S8 = AT('敲下一行字'), DONE = P('最后一行代码') + .5, TERM = P('打开终端'), SIT = G + 1.5, HX = 91.8, GX = 93.8, SZ = 58.3;
  const warmDesk = t => { VX.light(92.8, G + 3.4, 60.4, WARM, 5, .75); VX.light(92.8, G + 2.4, 59.8, [1, .8, .55], 3, .5); };
  const TW = { x: 420, y: 120, w: 1080, h: 330, fs: 64 };
  const TLINES = [[P('敲下一行字') + .05, '$ git commit -m', '#8A86A0', 18], [P('余生只维护'), '余生只维护你一个项目', '#FFD43B', 7.6]];
  shot(S7, S8, { day: NIGHT, fog: [30, 90], kicks: [[DONE, .5]],
    keys: [K(S7, [92.8, G + 3.3, 65.6], [92.8, G + 2.3, 58.4], 56), K(S8, [92.8, G + 2.95, 63.4], [92.8, G + 2.45, 58.4], 50)],
    lights: warmDesk,
    act: t => {
      heige(HX, SIT, SZ, { ...emo(t, [[0, 'thinking'], [DONE, 'happy'], [TERM, 'mischief']]), view: t < TERM ? 'front' : 'q' }, { noShadow: true, dy: t < DONE ? -Math.abs(Math.sin(t * 11)) * .02 : 0 });
      gf(GX, SIT, SZ, 'idle', { flip: true }, { noShadow: true });
      lid(HX, G + 2.02, 59.55);
      if (t < DONE) for (let i = 0; i < 6; i++) { const a = (t * 1.8 + i / 6) % 1, x = i % 2 ? HX : GX; VX.pt(x + (hh(i) - .5) * .4, G + 2.5 + a * .6, 59.2, .035, [255, 211, 78], true); }
      burst(t, DONE, HX, G + 2.6, 59.4, [255, 211, 78], 16); burst(t, DONE + .08, GX, G + 2.6, 59.2, [255, 211, 78], 16);
      if (t > DONE) label(92.8, G + 3.6, SZ, '收工', .45, '#FFD34E', t, DONE, TERM);
    },
    ui: (c, t) => termWin(c, t, TERM, S8 + 30, '终端', TLINES, TW) });
  for (let i = 0; i < 6; i++) sfx(S7 + .2 + i * .22, 'type', -15); sfx(DONE, 'ding', -10); sfx(TERM, 'click', -9);

  // ---------------------------------------------------------------- 8 · 敲下一行字推给她：余生只维护你一个项目
  const S9 = A('她盯着屏幕'), SEND = P('推给她'), VOW = P('余生只维护'), VOWDONE = VOW + 10 / 7.6;
  shot(S8, S9, { day: NIGHT, fog: [30, 90], noWhoosh: true,
    keys: [K(S8, [92.8, G + 2.8, 62.6], [92.8, G + 2.35, 58.4], 50), K(S9, [92.8, G + 2.75, 61.9], [92.8, G + 2.4, 58.4], 47)],
    lights: t => { warmDesk(t); VX.light(92.8, G + 3, 60.6, [1, .75, .5], 4, .5 + .5 * sm(seg01(t, VOW, VOWDONE))); },
    act: t => {
      heige(HX, SIT, SZ, { ...emo(t, [[0, 'shy'], [VOW, 'love']]), view: 'q' }, { noShadow: true });
      gf(GX, SIT, SZ, 'idle', { flip: true }, { noShadow: true });
      lid(HX, G + 2.02, 59.55);
      if (t > SEND) { const u = seg01(t, SEND, SEND + .45); if (u < 1) prop(lerp(HX, GX, u), G + 2.6 + Math.sin(u * Math.PI) * .4, 59, 'heart', { k: 1 / 70 }); }
    },
    ui: (c, t) => { termWin(c, t, TERM, S9 + 30, '终端', TLINES, TW);
      const g = c.createRadialGradient(960, 620, 200, 960, 620, 1000); g.addColorStop(0, 'rgba(255,190,110,0)'); g.addColorStop(1, `rgba(255,170,90,${.14 * sm(seg01(t, VOW, VOWDONE))})`); c.fillStyle = g; c.fillRect(0, 0, 1920, 1080);
      heartsUI(c, t, VOWDONE + .05, S9 + .3, 4, 760, 1160); } });
  for (let i = 0; i < 15; i += 3) sfx(TLINES[0][0] + i / 18, 'type', -15); for (let i = 0; i < 10; i++) sfx(VOW + i / 7.6, 'type', -13); sfx(VOWDONE + .02, 'chime', -9);

  // ---------------------------------------------------------------- 9 · 她盯着屏幕愣了两秒，嘴角憋不住地往上翘，把电脑往自己那边一拽，白了你一眼
  const S10 = A('少整这些虚的'), FROZE = P('愣了两秒'), SMIRK = P('嘴角憋不住'), PULL = P('那边一拽'), ROLL = P('白了你一眼');
  const lidX = t => lerp(HX, GX - .35, sm(seg01(t, PULL - .05, PULL + .35)));
  shot(S9, S10, { day: NIGHT, fog: [30, 90], kicks: [[PULL + .1, .8], [ROLL, .6]],
    keys: [K(S9, [93.5, G + 2.95, 61.6], [93.7, G + 2.65, 58.3], 50), K(SMIRK, [93.6, G + 2.85, 60.9], [93.8, G + 2.7, 58.3], 44),
      K(PULL - .25, [93.2, G + 2.9, 61.3], [93.3, G + 2.55, 58.6], 52), K(ROLL, [93.3, G + 2.9, 61.4], [93.5, G + 2.6, 58.4], 52), K(S10, [93.5, G + 2.85, 61.0], [93.7, G + 2.65, 58.3], 46)],
    lights: warmDesk,
    act: t => {
      heige(HX, SIT, SZ, { ...emo(t, [[0, 'hopeful'], [SMIRK, 'happy'], [PULL, 'surprised'], [ROLL, 'nervous']]), view: 'q' }, { noShadow: true });
      const pose = t < SMIRK ? 'idle' : t < ROLL ? 'shy' : 'point';
      gf(GX, SIT, SZ, pose, { flip: true, emote: t > SMIRK && t < PULL ? 'heart' : undefined, emoteAge: t - SMIRK, hop: t > ROLL && t < ROLL + .3 ? (t - ROLL) / .3 * .3 : 0 }, { noShadow: true });
      lid(lidX(t), G + 2.02, 59.55);
      if (t > FROZE && t < SMIRK) label(GX + .05, G + 3.35, SZ, ['.', '..', '...'][Math.floor((t - FROZE) * 4) % 3], .5, '#FFFFFF', t, FROZE, SMIRK);
      burst(t, PULL + .3, GX - .3, G + 2.3, 59.5, [235, 230, 240], 10);
    } });
  sfx(FROZE, 'tick', -12); sfx(FROZE + .5, 'tick', -13); sfx(SMIRK, 'heart', -11); sfx(PULL, 'scratch', -9); sfx(ROLL, 'flip', -10);

  // ---------------------------------------------------------------- 10 · 少整这些虚的，把源码发我，我先看看有没有 Bug。
  const S11 = A('说到底'), SRC = P('把源码发我'), LOOK = P('我先看看');
  shot(S10, S11, { day: NIGHT, fog: [30, 90],
    keys: [K(S10, [92.6, G + 3.05, 63.4], [92.8, G + 2.55, 58.4], 54), K(S11, [93.0, G + 2.95, 62.4], [92.9, G + 2.55, 58.4], 50)],
    lights: warmDesk,
    act: t => {
      heige(HX, SIT, SZ, { ...emo(t, [[0, 'nervous'], [LOOK, 'love']]), view: 'q' }, { noShadow: true });
      gf(GX, SIT, SZ, t < LOOK ? 'point' : 'idle', { flip: true, emote: t > LOOK ? 'heart' : undefined, emoteAge: t - LOOK }, { noShadow: true });
      lid(GX - .35, G + 2.02, 59.55);
      bubble(GX, G + 3.1, SZ, '少整这些虚的\n把源码发我', t, S10 + .25, LOOK - .1);
      bubble(GX, G + 3.1, SZ, '我先看看\n有没有 Bug', t, LOOK - .05, S11);
      heartsUp(t, LOOK + .1, S11 - .4, HX, G + 3.2, SZ, 4);
    },
    ui: (c, t) => { c.save(); c.translate(-1290, 0); toast(c, t, LOOK + .1, S11 + .3, '代码审查中…', '审查人：她', 'heart', '#E85AA8'); c.restore(); } });
  sfx(S10 + .25, 'chat', -10); sfx(SRC, 'click', -12); sfx(LOOK + .1, 'toast', -10); sfx(LOOK + .3, 'heart', -12);

  // ---------------------------------------------------------------- 11 · 说到底，在这个连情话都能让 AI 一秒钟生成八百条的年代，嘴甜一点都不稀罕。
  const S12 = A('最稀罕的'), LOVE = P('连情话'), SEC = P('一秒钟生成'), N800 = P('八百条'), SWEET = P('嘴甜'), NOPE = P('都不稀罕');
  const flyAt = i => LOVE + .1 + Math.pow(i / 40, 1.4) * (SWEET - LOVE);
  shot(S11, S12, { day: NIGHT, fog: [30, 90], kicks: [[N800, .8], [NOPE, 1.2]],
    keys: [K(S11, [86.2, G + 3.0, 59.6], [82.8, G + 2.1, 55.8], 62), K(SEC, [85.8, G + 3.2, 59.5], [82.8, G + 2.6, 55.8], 66), K(S12, [85.5, G + 3.6, 59.6], [82.9, G + 3.2, 55.8], 72)],
    act: t => {
      heige(81.9, G + 1, 56.9, { ...emo(t, [[0, 'neutral'], [SEC, 'surprised'], [SWEET, 'bored']]), view: 'q' });
      for (let i = 0; i < 40; i++) { const b = flyAt(i), a = t - b; if (a < 0 || a > 1.6) continue;
        const vx = (hh(i, 1) - .5) * 3.2, vy = 1.6 + hh(i, 2) * 1.6;
        prop(83.5 + vx * a, G + 2.5 + vy * a - .5 * a * a, 55.9 + a * (1.2 + hh(i, 3)), 'card', { k: 1 / 70, a: 1 - Math.max(0, a - 1.1) * 2 }); }
    },
    ui: (c, t) => {
      loveRain(c, t, LOVE + .2, S12, tt => .15 + .85 * sm(seg01(tt, LOVE + .2, N800 + .4)));
      counterUI(c, t, SEC - .1, NOPE - .15, 1, 800, N800 + .35 - SEC, '一秒钟生成情话', ' 条', { y: 300 });
      greyAll(c, sm(seg01(t, SWEET, SWEET + .6)));
      if (t > NOPE) stamp(c, t, NOPE, '不稀罕');
    } });
  sfx(LOVE, 'magic', -11); sfx(SEC, 'type_burst', -9); for (let i = 0; i < 8; i++) sfx(SEC + .1 + i * .12, 'xp_' + (1 + i % 4), -15); sfx(N800 + .35, 'ding', -10); sfx(SWEET + .1, 'sad', -12); sfx(NOPE, 'anvil', -9);

  // ---------------------------------------------------------------- 12 · 最稀罕的，是有人听得懂你的黑话 (montage 1: the café)
  const M2 = AT('接得住你的烂梗'), JARG = P('黑话'), RARE = P('最稀罕的'), UNDER = P('有人听得懂');
  shot(S12, M2, { day: NIGHT, fog: [30, 90],
    keys: [K(S12, [136.3, G + 2.9, 67.6], [136.3, G + 1.9, 61.8], 56), K(M2, [136.3, G + 2.65, 65.9], [136.3, G + 2.0, 61.8], 50)],
    act: t => {
      heige(135.1, G + 1, 62.3, { ...emo(t, [[0, 'sad'], [UNDER, 'surprised'], [JARG, 'happy']]), view: 'q' });
      gf(137.5, G + 1, 62.3, 'idle', { flip: true, emote: t > JARG ? 'spark' : undefined, emoteAge: t - JARG });
      prop(136.3, G + 2.02, 61.5, 'cup', { k: 1 / 46 });
      bubble(135.1, G + 2.0, 62.3, '上下文又爆了', t, RARE + .05, UNDER + .35);
      bubble(137.5, G + 1.85, 62.3, '先压缩\n再挂个 RAG', t, UNDER + .4, M2);
    },
    ui: (c, t) => { lifeBar(c, t, Math.min(1, (t - S12) * 4)); floatTxt(c, t, JARG + .1, '全听得懂', 1180, 260); } });
  sfx(RARE, 'chat', -11); sfx(UNDER + .4, 'chat', -10); sfx(JARG + .1, 'xp_3', -11);

  // ---------------------------------------------------------------- 13 · 接得住你的烂梗，平时能骂你傻逼嫌你乱花钱 (montage 2: the sofa)
  const M3 = AT('半夜三点又能'), PUN = P('接得住你的烂梗'), LAUGH = P('烂梗'), SCOLD = P('平时能骂你'), SPEND = P('乱花钱');
  shot(M2, M3, { day: NIGHT, fog: [30, 90], kicks: [[SCOLD + .1, 1.0]],
    keys: [K(M2, [83.7, G + 3.1, 67.4], [83.7, G + 2.3, 61], 56), K(SCOLD, [83.7, G + 2.95, 66.1], [83.7, G + 2.4, 61], 52), K(M3, [83.9, G + 2.9, 65.6], [83.8, G + 2.45, 61], 48)],
    act: t => {
      const mad = t > SCOLD;
      heige(82.8, G + 1.55, 61.4, { ...emo(t, [[0, 'smug'], [LAUGH, 'laugh'], [SCOLD, 'scared']]), view: 'q' }, { noShadow: true });
      gf(84.7, G + 1.55, 61.4, mad ? 'angry' : t > LAUGH ? 'cheer' : 'idle', { flip: true, hop: !mad && t > LAUGH ? ((t - LAUGH) * 2.6) % 1 : 0, emote: mad ? 'anger' : t > LAUGH ? 'music' : undefined, emoteAge: mad ? t - SCOLD : t - LAUGH }, { noShadow: true });
      bubble(82.8, G + 3.35, 61.4, '你就是我的\n最优解', t, M2 + .15, SCOLD - .05);
      if (mad) { prop(82.2, G + 2.25, 61.8, 'handbag', { k: 1 / 40 }); bubble(84.7, G + 3.15, 61.4, '又乱花钱', t, SCOLD + .05, M3); }
      if (t > LAUGH && t < SCOLD) label(85.6, G + 3.4, 61.4, '哈哈哈', .45, '#FFD34E', t, LAUGH + .1, SCOLD);
    },
    ui: (c, t) => lifeBar(c, t) });
  sfx(M2 + .15, 'chat', -11); sfx(LAUGH + .1, 'xp_1', -10); sfx(SCOLD + .1, 'hit', -8); sfx(SPEND, 'coin', -11);

  // ---------------------------------------------------------------- 14 · 半夜三点又能给你留一盏灯，陪你熬过每一次报错，把往后的小日子一点点跑通 (montage 3: the house at 3 a.m.)
  const S13 = A('遇到这样的女生'), LAMP = P('留一盏灯'), STAY = P('陪你熬过'), ERRS = P('每一次报错'), DAYS = P('把往后的小日子'), RUN = P('一点点跑通') + .5;
  const ERRROWS = [['报错：格式不对', STAY + .3], ['报错：连接超时', ERRS + .1], ['报错：上下文溢出', ERRS + .45]];
  edit(LAMP, 84, G + 2, 55, 'lamp');
  shot(M3, S13, { day: NIGHT * .6, fog: [30, 90], kicks: [[RUN, .9]],
    keys: [K(M3, [78.4, G + 8.5, 73], [79, G + 1.6, 57], 62), K(LAMP, [80.4, G + 6.4, 68], [81.4, G + 1.8, 56.6], 58), K(S13, [81.6, G + 4.6, 62.4], [83.3, G + 2.2, 56.2], 54)],
    lights: t => { if (t > LAMP) VX.light(84.5, G + 2.5, 56, AMBER, 2.5 + 2.5 * sm(seg01(t, LAMP, LAMP + .4)), 1.1); },
    act: t => {
      gf(72.5, G + 1.25, 57.4, 'sleep');
      if (t < LAMP) { const u = seg01(t, LAMP - .8, LAMP); if (u > 0 && u < 1) prop(lerp(73.2, 84.5, u), G + 2.4 + Math.sin(u * Math.PI) * 1.4, lerp(57.6, 55.9, u), 'heart', { k: 1 / 50 }); }
      prop(73.6, G + 2.5 + .1 * Math.sin(t * 2), 57.4, 'zzz', { k: 1 / 44, a: .8 });
      heige(83, G + 1, 56.8, { ...emo(t, [[0, 'sleepy'], [LAMP, 'love'], [STAY + .3, 'nervous'], [DAYS, 'relieved'], [RUN, 'excited']]), view: t < LAMP || t > RUN ? 'q' : 'back', flip: t > LAMP && t <= RUN ? false : true },
        { dy: t > RUN ? -Math.abs(Math.sin((t - RUN) * 7)) * .25 : 0 });
      burst(t, LAMP, 84.5, G + 2.6, 55.8, [255, 200, 120], 18);
      burst(t, RUN, 83, G + 2.8, 56.8, [255, 211, 78], 24);
    },
    ui: (c, t) => {
      const ca = fadeIO(t, M3 + .1, STAY + .2, .25); if (ca > 0) clockUI(c, hhmm3(t), ca);
      errPanel(c, t, ERRROWS, DAYS);
      lifeBar(c, t); if (t > RUN) slam(c, t, RUN, S13 + .2, '跑通', '#FFD34E', 130, 700);
    } });
  const hhmm3 = t => `03:${String(Math.min(59, Math.floor((t - M3) * 4))).padStart(2, '0')}`;
  sfx(LAMP - .6, 'heart', -13); sfx(LAMP, 'click', -8); sfx(LAMP + .05, 'chime', -11);
  ERRROWS.forEach(([, at]) => sfx(at, 'glitch', -12)); for (let i = 0; i < 3; i++) sfx(DAYS + i * .22, 'xp_' + (2 + i), -11); sfx(RUN, 'levelup', -9);

  // ---------------------------------------------------------------- 15 · 遇到这样的女生，真别犹豫，赶紧领回家吧。
  const HOMEGO = P('赶紧领回家吧'), FW = [S13 + .5, S13 + 1.3, HOMEGO, HOMEGO + .55];
  // the tree at (100, 74) stands in front of this shot's lens: take it away for the last shot (dense leaves read as moiré)
  for (let y = 1; y <= 3; y++) edit(S13 - .01, 100, G + y, 74, 0);
  for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) for (let y = 4; y <= 5; y++) edit(S13 - .01, 100 + dx, G + y, 74 + dz, 0);
  const walkX = (t, x0) => lerp(x0, x0 - 4.6, seg01(t, S13, END)), WZ = 70.2;
  shot(S13, END, { day: NIGHT, fog: [40, 120], kicks: [[HOMEGO, 1.1]],
    keys: [K(S13, [104.8, G + 2.8, 77.6], [101.2, G + 2.2, 66], 54), K(HOMEGO, [106.0, G + 3.4, 79.4], [99.6, G + 4.4, 62], 64), K(END, [106.2, G + 3.6, 80], [99, G + 5.4, 61], 68)],
    lights: t => { VX.light(83, G + 3, 60, WARM, 10, .5 + .5 * sm(seg01(t, HOMEGO, HOMEGO + .5))); VX.light(93, G + 3, 59, WARM, 7, .6); VX.light(100, G + 2.5, 60, AMBER, 4, .7);
      for (const f of FW) { const a = t - f; if (a > 0 && a < 1.2) VX.light(96 + (hh(f) - .5) * 10, G + 12, 58, PINK, 12, 1.2 * (1 - a / 1.2)); } },
    act: t => {
      heige(walkX(t, 102.6), G + 1, WZ, { ...emo(t, [[0, 'happy'], [HOMEGO, 'love']]), view: 'side', flip: true, walk: t });
      kid(walkX(t, 103.7), G + 1, WZ + .2, 'happy', t, { dy: -Math.abs(Math.sin(t * 8)) * .14 });
      gf(walkX(t, 104.8), G + 1, WZ, t < HOMEGO ? 'idle' : 'cheer', { emote: 'heart', emoteAge: t - S13 }, { dy: -Math.abs(Math.sin(t * 8)) * .05 });
      FW.forEach((f, i) => { const a = t - f; if (a > 0) firework(90 + i * 3.4 + (hh(i) - .5) * 3, G + 10 + hh(i, 2) * 3, 56, a); });
    },
    ui: (c, t) => { slam(c, t, HOMEGO, END + .5, '赶紧领回家吧', '#FFD34E', 150, 420); heartsUI(c, t, HOMEGO + .2, END, 8, 520, 1400); } });
  for (let i = 0; i < 6; i++) sfx(S13 + .2 + i * .5, 'step', -15); FW.forEach(f => sfx(f, 'firework', -11)); sfx(HOMEGO, 'thud', -8);
})();
