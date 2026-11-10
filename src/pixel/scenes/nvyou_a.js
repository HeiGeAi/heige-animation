// scenes/nvyou_a.js: V071 shots 0–43.22 s, the cold open (懂 AI 的女生，赶紧娶回家), the 恋爱烦恼 that don't apply,
// the bag vs the API top-up, the Claude 会员 kisses, the 算力卡 and the 民政局 appointment.
(() => {
  const N = window.NV;
  const { B, VX, G, K, shot, P, A, AT, LS, LE, sfx, edit, flash, heige, ppl, kid, clawd, prop, bubble, label, tag, burst, heartsUp, coinsUp, firework,
    seg01, sm, lerp, hh, clamp01, fadeIO, outlined, panel, icon, slam, pow, floatTxt, label2, toast, titleCard, questionCard, tagUI, clockUI, dream,
    bossBar, levelUI, timerUI, cold, crossOut, stamp, iconPop, phoneChat, termWin, tradeWin, banScreen, heartsUI, counterUI, commitGrid, guiWin, FONT,
    HOME, BEDR, BED, LIV, PC, SOFA, STUDY, DESK2, LIP, BAG, NET, QUEUE, CIN, CAFE, SRV, REG, KIN, RACKS, DUSK, NIGHT, AMBER, CYAN, PINK, WARM } = N;
  const bob = (t, f = 8, a = 2) => -Math.abs(Math.sin(t * f)) * a;          // her little hop-step while she moves (sprite px)
  const W2S = (x, y, z) => VX.project(x, y, z, 6);                          // world → overlay pixels
  const hopAt = (t, ts, d = .32) => { for (const a of ts) if (t >= a && t < a + d) return (t - a) / d; return 0; };   // a hop on each beat
  // NV.gf's own hop sinks her (it adds a negative world y); lift her through ex.dy instead, the shadow stays on the ground
  const gf = (x, y, z, pose, o = {}, ex = {}) => N.gf(x, y, z, pose, { ...o, hop: 0 }, { ...ex, dy: (ex.dy || 0) + (o.hop ? Math.sin(clamp01(o.hop) * Math.PI) * .45 : 0) });

  // ------------------------------------------------------------------ this chunk's own overlay pieces (base style)
  // an item card popping out of a world point (像获得物品): a light slot panel with the word
  function itemCard(c, t, t0, t1, txt, x, y, rim = '#FFD43B') {
    if (t < t0 || t > t1) return; const a = t - t0, k = (1 + .7 * Math.exp(-a * 11) * Math.cos(a * 22)) * (1 - sm(seg01(t, t1 - .2, t1))); if (k <= .02) return;
    c.save(); c.translate(x, y - Math.min(1, a * 6) * 30); c.scale(k, k); c.font = `900 50px ${FONT}`; const w = c.measureText(txt).width + 70;
    panel(c, -w / 2, -48, w, 96, true); c.fillStyle = rim; c.fillRect(-w / 2 + 6, -42, w - 12, 6);
    outlined(c, txt, 0, 4, 50, '#2A2230', { lw: 0, shadow: false }); c.restore();
    if (a < .6) { c.save(); c.globalAlpha = 1 - a / .6; outlined(c, '+1', x + 90, y - 80 - a * 90, 44, '#FFD43B', { lw: 7 }); c.restore(); }
  }
  // a level bar, top-left: name, Lv, the bar filling to k
  function lvBar(c, t, t0, t1, name, lv, k) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .2);
    c.save(); c.globalAlpha = a; panel(c, 40, 40, 560, 130); icon(c, 'heart', 64, 66, 9);
    outlined(c, name, 150, 86, 40, '#F2E6C8', { align: 'left', lw: 6, shadow: false }); outlined(c, `Lv ${lv}`, 572, 86, 44, '#FFD43B', { align: 'right', lw: 7, shadow: false });
    c.fillStyle = '#1A0E1A'; c.fillRect(64, 122, 512, 26); c.fillStyle = '#E8A93A'; c.fillRect(68, 126, 504 * k, 18); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(68, 126, 504 * k, 5);
    if (k >= 1 && Math.floor(t * 6) % 2) { c.strokeStyle = '#FFD43B'; c.lineWidth = 4; c.strokeRect(62, 120, 516, 30); }
    c.restore();
  }
  // three floating worry cards, each smashed at its own time (red cross, then the pieces fall)
  function woeCards(c, t, t0, t1, cards) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .2);
    cards.forEach(([txt, at, hit], i) => {
      if (t < at) return; const x = 520 + i * 440, y = 170 + 10 * Math.sin(t * 2.4 + i * 1.7), pop = 1 + .5 * Math.exp(-(t - at) * 12);
      if (t < hit + .12) { c.save(); c.globalAlpha = a; c.translate(x, y); c.rotate((i - 1) * .05); c.scale(pop, pop); panel(c, -190, -70, 380, 140);
        outlined(c, txt, 0, 2, 58, '#F2E6C8', { lw: 8, shadow: false });
        if (t > hit) { const k = seg01(t, hit, hit + .1); c.strokeStyle = '#E83A44'; c.lineWidth = 16; c.beginPath(); c.moveTo(-170, -55); c.lineTo(-170 + 340 * k, -55 + 110 * k); c.stroke(); c.beginPath(); c.moveTo(170, -55); c.lineTo(170 - 340 * k, -55 + 110 * k); c.stroke(); }
        c.restore(); return; }
      const b = t - hit - .12; if (b > 1) return;                                            // the shards
      c.save(); c.globalAlpha = a * (1 - b);
      for (let j = 0; j < 6; j++) { const sx = x + (j % 3 - 1) * 120 + (hh(j, i) - .5) * 160 * b, sy = y + (j < 3 ? -35 : 35) + 700 * b * b + 120 * b * hh(j, i + 4);
        c.save(); c.translate(sx, sy); c.rotate((hh(j, i + 7) - .5) * 6 * b); c.fillStyle = 'rgba(16,10,28,.9)'; c.fillRect(-60, -34, 120, 68); c.fillStyle = '#3A1E6A'; c.fillRect(-60, -34, 120, 5); c.restore(); }
      c.restore();
    });
  }
  // a top-left calendar plate: 距情人节 15 天
  function countdownUI(c, t, t0, t1, top, big) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .2), k = 1 + .25 * Math.exp(-(t - t0) * 9);
    c.save(); c.globalAlpha = a; c.translate(220, 130); c.scale(k, k); c.translate(-220, -130);
    panel(c, 40, 40, 360, 180, true); c.fillStyle = '#C8323C'; c.fillRect(46, 46, 348, 54); outlined(c, top, 220, 74, 34, '#FFFFFF', { lw: 0, shadow: false });
    outlined(c, big, 220, 160, 72, '#C8323C', { lw: 0, shadow: false }); c.restore();
  }
  // a damage number rising off a world point
  function dmgAt(c, t, t0, txt, x, y, z, col = '#FF6A5A', size = 64) {
    const a = t - t0; if (a < 0 || a > 1.4) return; const p = W2S(x, y, z); if (p.cz < .3) return;
    c.save(); c.globalAlpha = Math.min(1, (1.4 - a) * 3); const k = 1 + .6 * Math.exp(-a * 12); c.translate(p.x + 30 * a, Math.max(90, p.y - 90 * a)); c.scale(k, k);
    outlined(c, txt, 0, 0, size, col, { lw: size * .16 }); c.restore();
  }
  // a little training window hanging over the monitor: the bar stuck, 算力不足 blinking
  function trainWin(c, t, t0, t1, x, y, z, failAt, okAt) {
    if (t < t0 || t > t1) return; const p = W2S(x, y, z); if (p.cz < .3) return; const a = fadeIO(t, t0, t1, .2);
    const bx = Math.max(30, Math.min(1890 - 520, p.x - 260)), by = Math.max(30, Math.min(880 - 200, p.y - 220));
    const ok = t > okAt, k = ok ? lerp(.37, 1, sm(seg01(t, okAt, okAt + .5))) : Math.min(.37, (t - t0) * .5);
    c.save(); c.globalAlpha = a; panel(c, bx, by, 520, 190); outlined(c, '实验训练中', bx + 260, by + 44, 38, '#F2E6C8', { lw: 6, shadow: false });
    c.fillStyle = '#1A0E1A'; c.fillRect(bx + 30, by + 80, 460, 34); c.fillStyle = ok ? '#FFD43B' : '#E8A93A'; c.fillRect(bx + 34, by + 84, 452 * k, 26);
    outlined(c, `${Math.round(k * 100)}%`, bx + 260, by + 97, 28, '#FFFFFF', { lw: 5, shadow: false });
    if (!ok && t > failAt && Math.floor(t * 5) % 2 === 0) outlined(c, '算力不足', bx + 260, by + 152, 46, '#FF5A4A', { lw: 7, shadow: false });
    if (ok) outlined(c, '跑起来了', bx + 260, by + 152, 46, '#FFD43B', { lw: 7, shadow: false });
    c.restore();
  }
  // the 「啵」 counter: big text that thumps up by one at each time
  function kissUI(c, t, times, t1) {
    let n = 0; for (const tm of times) if (t >= tm) n++; if (!n || t > t1) return; const a = t - times[n - 1], k = 1 + .7 * Math.exp(-a * 12);
    c.save(); c.translate(960, 200); c.rotate(-.05); c.scale(k, k); outlined(c, `啵 ×${n}`, 0, 0, 120, '#FF9AB8', { lw: 16, stroke: '#5A1428' }); c.restore();
  }
  // a cart of glowing 算力卡 (a sprite, captured once)
  let CART = null;
  function cartImg() {
    if (CART) return CART; const s = new Spr();
    s.rect(-30, -20, 60, 6, '#6A6A78').rect(-30, -14, 60, 3, '#4A4858').line(26, -20, 34, -40, '#4A4858').line(27, -20, 35, -40, '#4A4858').rect(32, -42, 8, 3, '#2A2A36');
    s.ell(-20, -6, 5, 5, '#2A2A36').ell(20, -6, 5, 5, '#2A2A36').ell(-20, -6, 2, 2, '#8A8A98').ell(20, -6, 2, 2, '#8A8A98');
    for (let i = 0; i < 4; i++) { const x = -26 + i * 13; s.rect(x, -34, 11, 14, '#B8862E').rect(x + 1, -33, 9, 12, '#F2C14E').rect(x + 3, -30, 5, 5, '#FFE27A'); }
    s.outline('#140A10'); CART = VX.capture((x, y) => s.draw(x, y), 90, 60, 45, 50); return CART;
  }

  // =================================================================================== 1 · 遇到懂 AI 的女生，赶紧和她谈恋爱吧。
  const GO = P('赶紧和她谈恋爱吧'), E1 = AT('懂GitHub');
  const DOOR = { x: 83.5, z: 66.4 };
  shot(0, E1, { noWhoosh: true, day: DUSK, fog: [34, 110], kicks: [[GO, 1.1]],
    keys: [K(0, [83.5, G + 30, 100], [83.5, G + 1, 66], 66), K(1.15, [83.5, G + 9, 80], [83.5, G + 2, 64.5], 60), K(E1, [83.5, G + 2.7, 71.4], [83.5, G + 2.0, 65.8], 54)],
    act: t => {
      const u = sm(seg01(t, .25, 2.3)), z = lerp(57.6, DOOR.z, u), x = lerp(80.4, DOOR.x, sm(seg01(u, .5, 1)));   // round the sofa's west end
      gf(x, G + 1, z, 'idle', { dy: u > 0 && u < 1 ? bob(t) : 0, emote: t > GO ? 'heart' : undefined, emoteAge: t - GO });
      heartsUp(t, .4, E1, x + .1, G + 2.2, z + .1, 7);
      if (t > GO) burst(t, GO, x, G + 2.6, z, [255, 150, 190], 22);
    },
    ui: (c, t) => slam(c, t, GO, E1, '赶紧和她谈恋爱吧', '#FF9AB8', 128, 250) });
  sfx(.05, 'portal', -14); sfx(.9, 'step_wood', -14); sfx(1.4, 'step_wood', -14); sfx(GO, 'heart', -9); sfx(GO + .05, 'thud', -11);

  // =================================================================================== 2 · 如果她刚好还懂 GitHub、懂 GPT、天天拿 Claude 干活，听我一句劝，赶紧娶回家。
  const GH = P('GitHub'), GPT = P('GPT'), CL = P('拿Claude'), RUN = AT('听我一句劝') + .1, MARRY = P('赶紧娶回家'), E2 = A('跟这样的女生');
  shot(E1, E2, { day: DUSK, fog: [30, 90], kicks: [[MARRY, .9]],
    keys: [K(E1, [83.5, G + 2.3, 70.9], [83.5, G + 1.95, 66.4], 54), K(RUN, [83.8, G + 2.15, 70.1], [83.6, G + 1.9, 66.4], 52),
      K(MARRY, [84.7, G + 2.4, 72.0], [84.4, G + 1.75, 66.6], 56), K(E2, [84.6, G + 2.3, 71.3], [84.4, G + 1.8, 66.6], 52)],
    act: t => {
      const pose = t > MARRY + .35 ? 'shy' : t > CL ? 'point' : 'idle';
      gf(DOOR.x, G + 1, DOOR.z, pose, { hop: hopAt(t, [GH, GPT, CL]), emote: t > MARRY + .35 ? 'heart' : t > CL ? 'spark' : undefined, emoteAge: t - (t > MARRY + .35 ? MARRY + .35 : CL) });
      const w = seg01(t, RUN, RUN + .8), hx = lerp(89.5, 85.1, sm(w));
      if (t > RUN) heige(hx, G + 1, DOOR.z + .3, { ...emotions(t, [[0, 'excited'], [MARRY, 'love']]), view: 'q', flip: true, walk: w > 0 && w < 1 ? t * 1.8 : undefined, poseR: t > MARRY ? 'clasp' : undefined });
      if (t > MARRY - .1) { const a = sm(seg01(t, MARRY - .1, MARRY + .3)); prop(hx - .45, G + 1.6 + a * .5 + .05 * Math.sin(t * 6), DOOR.z + .45, 'ring', { k: 1 / 46 });
        for (let i = 0; i < 5; i++) { const b = (t * .9 + i / 5) % 1; VX.pt(hx - .45 + Math.sin(i * 2.3 + t * 3) * .25, G + 2.2 + b * .6, DOOR.z + .45, .045, [255, 220, 120], true); } }
    },
    ui: (c, t) => {
      const p = W2S(DOOR.x, G + 2.75, DOOR.z), y = Math.max(230, p.y - 60), end = RUN + .5;
      itemCard(c, t, GH, end, 'GitHub', p.x - 330, y); itemCard(c, t, GPT, end, 'GPT', p.x, y - 40); itemCard(c, t, CL, end, 'Claude', p.x + 330, y);
      lvBar(c, t, GH - .3, E2, 'AI 女友', t > CL + .3 ? 99 : t > GPT ? 66 : 33, t > CL ? lerp(.66, 1, sm(seg01(t, CL, CL + .4))) : t > GPT ? lerp(.33, .66, sm(seg01(t, GPT, GPT + .3))) : sm(seg01(t, GH, GH + .3)) * .33);
      toast(c, t, MARRY + .1, E2, '进度达成', '赶紧娶回家', 'heart', '#FF9AB8');
    } });
  sfx(GH, 'pickup', -9); sfx(GPT, 'pickup', -9); sfx(CL, 'pickup', -8); sfx(CL + .35, 'levelup', -10);
  for (let i = 0; i < 3; i++) sfx(RUN + .1 + i * .26, 'step', -13); sfx(MARRY, 'ring', -9); sfx(MARRY + .12, 'toast', -11);

  // =================================================================================== 3 · 跟这样的女生谈恋爱，你会发现以前听说的那些恋爱烦恼，在你俩这儿全都不成立。
  const WOE = P('恋爱烦恼'), NOPE = P('全都不成立'), E3 = A('比如别的情侣过节');
  const H1 = P('在你俩'), H2 = P('你俩这儿'), H3 = P('这儿全都');
  shot(E2, E3, { day: DUSK, fog: [30, 95], kicks: [[H1, .5], [H2, .5], [H3, .6], [NOPE, 1.2]],
    keys: [K(E2, [86.6, G + 2.7, 79.8], [87.0, G + 1.9, 74], 56), K(NOPE, [93.4, G + 2.9, 80.4], [93.8, G + 2.1, 74], 56), K(E3, [94.6, G + 3.1, 81.0], [94.9, G + 2.2, 74], 58)],
    act: t => {
      const x = lerp(85.5, 95.5, seg01(t, E2, E3));
      heige(x, G + 1, 74, { ...emotions(t, [[0, 'happy'], [WOE, 'confused'], [NOPE, 'proud']]), view: 'q', walk: t * 1.3 });
      gf(x + 1.3, G + 1, 74.2, t > NOPE ? 'cheer' : 'idle', { dy: bob(t, 6.5, 1.6), flip: true, hop: t > NOPE ? seg01(t, NOPE, NOPE + .35) : 0, emote: t > NOPE ? 'music' : undefined, emoteAge: t - NOPE });
      heartsUp(t, E2 + .3, WOE - .2, x + .65, G + 2.6, 74.1, 5);
    },
    ui: (c, t) => {
      woeCards(c, t, WOE - .1, E3, [['猜心思', WOE, H1], ['选色号', WOE + .15, H2], ['审美', WOE + .3, H3]]);
      if (t > NOPE) stamp(c, t, NOPE, '全都不成立');
    } });
  for (let i = 0; i < 7; i++) sfx(E2 + .3 + i * .6, 'step', -15);
  sfx(WOE, 'pop', -11); sfx(WOE + .15, 'pop', -11); sfx(WOE + .3, 'pop', -11); sfx(H1, 'break_glass', -10); sfx(H2, 'break_glass', -10); sfx(H3, 'break_glass', -10); sfx(NOPE, 'anvil', -9);

  // =================================================================================== 4 · 比如别的情侣过节，男生提前半个月抓耳挠腮猜心思，
  const BOY = P('男生提前'), HALF = P('提前半个月'), SCR = P('抓耳挠腮'), GUESS = P('猜心思'), E4 = AT('送口红');
  const B4 = { x: 106, z: 50.5 };
  shot(E3, E4, { day: DUSK, fog: [30, 95], kicks: [[GUESS, .6]],
    keys: [K(E3, [B4.x + 5, G + 4.4, B4.z + 7], [B4.x, G + 2.2, B4.z - 1], 62), K(SCR, [B4.x + 2.2, G + 3.2, B4.z + 6.0], [B4.x, G + 2.4, B4.z], 54), K(E4, [B4.x - 2.6, G + 3.2, B4.z + 6.0], [B4.x, G + 2.5, B4.z], 54)],
    act: t => {
      const spin = t > SCR ? (t - SCR) * 5 : 0, r = t > SCR ? .45 : 0;
      ppl(B4.x + Math.sin(spin) * r, G + 1, B4.z + Math.cos(spin) * r * .6, '男生', t > SCR ? 'worry' : t > BOY ? 'talk' : 'neutral', t, { dy: t > SCR ? -Math.abs(Math.sin(t * 9)) * .08 : 0 });
      if (t > BOY) label(B4.x + Math.sin(spin) * r + .5, G + 3.3 + .08 * Math.sin(t * 6), B4.z + .1, '?', .6, '#FFD43B', t, BOY);
      [['口红?', -1.3, 2.85, SCR], ['送包?', 1.3, 2.95, SCR + .3], ['送花?', -.2, 3.75, GUESS]].forEach(([s, dx, dy, at]) => label(B4.x + dx, G + dy + .06 * Math.sin(t * 3 + dx), B4.z, s, .32, '#F2E6C8', t, at));
      // a couple of passers-by in the back, the mall glowing
      ppl(B4.x - 4 + (t - E3) * .5, G + 1, B4.z - 3, '路人', 'neutral', t, { walk: true });
    },
    ui: (c, t) => countdownUI(c, t, HALF - .1, E4, '距情人节', '15 天') });
  sfx(BOY, 'villager', -12); sfx(HALF, 'page', -10); sfx(SCR, 'scratch', -9); sfx(SCR + .3, 'pop', -12); sfx(GUESS, 'pop', -11); sfx(GUESS + .1, 'grunt', -12);

  // =================================================================================== 5 · 送口红怕搞错色号，买个包又怕被嫌审美不行。
  const LIPS = P('送口红'), SHADE = P('色号'), BAGT = P('买个包又怕'), JUDGE = P('审美不行'), E5 = A('情人节你咬牙');
  for (let x = 100; x <= 103; x++) { edit(E4, x, G + 1, 44, 'woolPink'); edit(E5, x, G + 1, 44, 'woolWhite'); }   // a pink counter (the white one blooms out in close-up)
  shot(E4, E5, { day: DUSK, fog: [28, 90], kicks: [[JUDGE, 1.0]],
    keys: [K(E4, [102.6, G + 2.9, 50.2], [102.6, G + 2.3, 44.8], 52), K(BAGT - .3, [103.1, G + 2.85, 49.8], [103.0, G + 2.3, 44.8], 50),
      K(BAGT + .35, [108.4, G + 3.2, 51.6], [109.8, G + 2.3, 45.4], 56), K(E5, [110.4, G + 3.0, 51.8], [110.4, G + 2.3, 45.6], 54)],
    act: t => {
      for (let i = 0; i < 5; i++) { const x = 100.9 + i * .55, pick = t > SHADE && Math.floor((t - SHADE) * 4) % 5 === i;
        prop(x, G + 2.02 + (pick ? .12 : 0), 44.6, 'lipstick', { k: 1 / 44 }); label(x, G + 2.78 + (i % 2) * .22, 44.6, '色号?', .16, pick ? '#FFD43B' : '#F2E6C8', t, LIPS + .1 + i * .08); }
      const look = Math.sin((t - LIPS) * 5) * .25;
      ppl(104.15 + look * .5, G + 1, 45.8, '男生', t > SHADE ? 'shock' : 'worry', t);
      // the bag shop
      prop(109, G + 2.05, 43.3, 'handbag'); prop(112, G + 2.05, 43.3, 'handbag');
      ppl(111.3, G + 1, 45.7, '女生', t > JUDGE ? 'angry' : 'neutral', t, { dy: t > JUDGE ? -Math.abs(Math.sin((t - JUDGE) * 14)) * .06 : 0 });
      ppl(109.5, G + 1, 46.1, '男生2', t > JUDGE ? 'sad' : 'worry', t);
      prop(110.1, G + 1.75, 46.3, 'handbag', { k: 1 / 46 });
    },
    ui: (c, t) => { dmgAt(c, t, JUDGE, '审美 -10', 111.3, G + 2.9, 45.7); } });
  sfx(LIPS, 'click', -11); sfx(SHADE, 'tick', -10); sfx(SHADE + .25, 'tick', -11); sfx(SHADE + .5, 'tick', -12); sfx(BAGT, 'chest', -11); sfx(JUDGE, 'hit', -8);

  // =================================================================================== 6 · 情人节你咬牙给她买个包，她只会眉头一皱，还会骂你两句：
  const BITE = P('咬牙'), GIVE = P('给她买个包'), FROWN = P('眉头一皱'), SCOLD = P('骂你两句'), E6 = AT('你个傻逼');
  const V6 = { hx: 108.4, gx: 110.2, z: 52.2 };
  shot(E5, E6, { day: DUSK, fog: [30, 90], kicks: [[FROWN + .3, 1.3]],
    keys: [K(E5, [109.3, G + 2.9, 57.8], [109.3, G + 2.0, 52.2], 56), K(FROWN, [109.4, G + 2.6, 56.0], [109.4, G + 2.1, 52.2], 52),
      K(FROWN + .3, [109.9, G + 2.35, 56.5], [110.0, G + 1.95, 52.2], 50), K(E6, [109.9, G + 2.35, 56.2], [110.0, G + 1.95, 52.2], 48)],
    act: t => {
      heige(V6.hx, G + 1, V6.z, { ...emotions(t, [[0, 'nervous'], [BITE, 'determined'], [GIVE + .2, 'hopeful'], [FROWN + .3, 'scared']]), view: 'q' });
      const g = sm(seg01(t, GIVE, GIVE + .45)), drop = seg01(t, FROWN + .3, FROWN + .6);
      const bx = lerp(V6.hx + .55, V6.gx - .5, g), by = t > FROWN + .3 ? lerp(G + 1.75, G + 1.02, drop * drop) : G + 1.75 + Math.sin(g * Math.PI) * .25;
      prop(bx, by, V6.z + .25, 'handbag', { k: 1 / 44 });
      gf(V6.gx, G + 1, V6.z, t > SCOLD ? 'point' : t > FROWN ? 'angry' : 'idle', { flip: true, emote: t > FROWN ? 'anger' : 'heart', emoteAge: t > FROWN ? t - FROWN : t - E5, sq: t > FROWN && t < FROWN + .15 ? .1 : 0 });
      if (t > FROWN + .3 && t < FROWN + .8) burst(t, FROWN + .45, bx, G + 1.1, V6.z + .3, [200, 90, 100], 12);
      VX.pt(V6.gx - .3 + .1 * Math.sin(t * 7), G + 2.0 + ((t * .8) % 1), V6.z + .3, .05, [255, 140, 180], true);
    },
    ui: (c, t) => { counterUI(c, t, GIVE - .05, FROWN - .05, 0, 8999, .6, '包包 · 情人节', ' 元', { y: 250 });
      if (t > FROWN + .3) pow(c, t, FROWN + .3, '皱', 1240, 330); } });
  sfx(BITE, 'grunt', -12); sfx(GIVE, 'pickup', -10); for (let i = 0; i < 6; i++) sfx(GIVE + .1 + i * .09, 'tick', -15); sfx(FROWN + .3, 'anvil', -8); sfx(FROWN + .55, 'thud', -12); sfx(SCOLD, 'villager', -12);

  // =================================================================================== 7 · 你个傻逼，这钱拿去充 API 够跑多少 Token 啊？
  const CURSE = P('你个傻逼'), MONEY = P('这钱'), API = P('充API'), TOK = P('Token'), E7 = A('但凡你换个路子');
  shot(E6, E7, { day: DUSK, fog: [30, 90], kicks: [[CURSE, 1.1], [TOK, .8]],
    keys: [K(E6, [112.4, G + 2.4, 56.8], [111.5, G + 2.0, 52.2], 52), K(TOK, [112.2, G + 2.4, 56.2], [111.4, G + 2.05, 52.2], 50), K(E7, [112.1, G + 2.4, 56.0], [111.4, G + 2.05, 52.2], 48)],
    act: t => {
      heige(V6.hx, G + 1, V6.z, { ...emotions(t, [[0, 'scared'], [CURSE, 'ko'], [API, 'confused']]), view: 'q' });
      prop(V6.gx - .5, G + 1.02, V6.z + .25, 'handbag', { k: 1 / 44 });
      gf(V6.gx, G + 1, V6.z, t > MONEY && t < TOK ? 'angry' : 'point', { flip: true, emote: 'anger', emoteAge: t - E6, hop: seg01(t, CURSE, CURSE + .3), dy: t > TOK ? bob(t, 10, 1.5) : 0 });
      if (t > TOK) coinsUp(t, TOK, V6.gx + .6, G + 2.4, V6.z + .2, 10);
      bubble(V6.gx, G + 2.95, V6.z, '这钱拿去充 API\n够跑多少 Token 啊？', t, MONEY - .05, E7);
    },
    ui: (c, t) => {
      pow(c, t, CURSE, '哔', 760, 300);
      if (t > API) { c.save(); c.translate(1120, 40); c.scale(.76, .76); c.translate(-460, -170); tradeWin(c, t, API, E7 + .3, '包包', '×1', 'Token', '×999万+'); c.restore(); }
    } });
  sfx(CURSE, 'slap', -9); sfx(MONEY, 'chat', -11); sfx(API, 'click', -10); sfx(API + .45, 'villager', -11); sfx(TOK, 'coin', -9); sfx(TOK + .15, 'xp_2', -11);

  // =================================================================================== 8 · 但凡你换个路子，花 200 美金给她充个 Claude 会员，她当场就能抱着你亲三口。
  const SPEND = P('花200美金'), CLM = P('Claude会员'), RUSH = P('她当场'), HUG = P('抱着你'), K1 = P('亲三口'), K2 = P('三口'), K3 = P('三口') + .16, E8 = LE('亲三口') + .05;
  const VM = { x: 139.5, z: 57.5 }, H8 = { x: 137.8, z: 59.0 };
  edit(SPEND + .5, 139, G + 2, 57, 'lamp'); edit(E8, 139, G + 2, 57, 'offlamp');
  shot(E7, E8, { day: DUSK, fog: [30, 90], kicks: [[SPEND + .45, .6], [K1, .7], [K2, .7], [K3, .9]],
    keys: [K(E7, [135.6, G + 3.0, 64.4], [138.6, G + 1.9, 57.8], 56), K(CLM, [136.4, G + 2.8, 63.2], [138.8, G + 2.0, 58.0], 52),
      K(RUSH + .1, [136.0, G + 2.8, 64.4], [137.4, G + 2.0, 58.8], 56), K(E8, [136.4, G + 2.6, 63.4], [137.5, G + 2.1, 59.0], 50)],
    lights: (t, cam) => { if (t > SPEND + .5) VX.light(139.5, G + 2.5, 58.2, [1, .8, .6], 4, 1.2); },
    act: t => {
      tag(VM.x, G + 3.25, VM.z, '会员充值', '#FFD43B');
      const hx = t > RUSH ? lerp(H8.x, H8.x + .15, seg01(t, HUG, HUG + .2)) : H8.x;
      heige(hx, G + 1, H8.z, { ...emotions(t, [[0, 'thinking'], [SPEND, 'determined'], [CLM, 'happy'], [HUG, 'starstruck'], [K1, 'love']]), view: t > RUSH ? 'front' : 'q', poseR: t > SPEND && t < CLM ? 'point' : undefined });
      // the coin flies into the slot
      const ca = seg01(t, SPEND - .1, SPEND + .45); if (ca > 0 && ca < 1) prop(lerp(hx + .4, VM.x - .4, ca), G + 1.8 + Math.sin(ca * Math.PI) * .7, lerp(H8.z, VM.z + .6, ca), 'coin', { k: 1 / 40 });
      if (t > SPEND) label(VM.x - .6, G + 2.9 + .05 * Math.sin(t * 4), VM.z + .8, '$200', .45, '#FFD43B', t, SPEND, RUSH);
      // Clawd pops up beside the machine
      if (t > CLM - .15) { const up = sm(seg01(t, CLM - .15, CLM + .25)); clawd(VM.x + 1.1, G + 1 - (1 - up) * .9, VM.z + .8, { ...feel(t > RUSH ? 'excited' : 'happy', t), view: 'q', flip: true }); }
      // she runs in from the left
      if (t > RUSH - .2) { const r = sm(seg01(t, RUSH - .2, HUG)); gf(lerp(133.8, hx - .75, r), G + 1, H8.z + .15, r < 1 ? 'cheer' : 'shy', { hop: r < 1 ? (t * 3) % 1 : 0, emote: 'heart', emoteAge: t - RUSH }); }
      heartsUp(t, HUG, E8, hx - .35, G + 2.6, H8.z + .2, 6);
      for (const k of [K1, K2, K3]) if (t > k && t < k + .9) { burst(t, k, hx - .35, G + 2.6, H8.z + .2, [255, 120, 160], 14); }
    },
    ui: (c, t) => {
      toast(c, t, CLM + .1, E8, '已开通', 'Claude 会员', 'star', '#F2A27A');
      kissUI(c, t, [K1, K2, K3], E8); heartsUI(c, t, HUG, E8, 14);
    } });
  sfx(SPEND, 'coin', -8); sfx(SPEND + .45, 'click', -10); sfx(SPEND + .5, 'powerup', -11); sfx(CLM, 'pop', -9); sfx(CLM + .1, 'toast', -11);
  sfx(RUSH, 'step', -12); sfx(RUSH + .3, 'step', -12); sfx(HUG, 'heart', -10); sfx(K1, 'pop', -8); sfx(K2, 'pop', -8); sfx(K3, 'pop', -7);
  flash(K1, '255,150,200', .18); flash(K3, '255,150,200', .28);

  // =================================================================================== 9 · 要是赶上她跑实验缺算力，你二话不说给她租几张 H100，
  const LACK = P('缺算力'), NOWORD = P('你二话不说'), RENT = P('租几张'), E9 = AT('她反手');
  const DESKP = { x: 104, z: 92 }, GF9 = { x: 105.5, z: 93.3 }, CARTZ = 90.6;
  const LIT = RACKS.map((x, i) => [x, RENT + i * .14]);
  for (const [x, at] of LIT) { edit(at, x, G + 2, 89, 'lamp'); edit(AT('上午九点'), x, G + 2, 89, 'offlamp'); }
  const cartX = t => lerp(95.5, 101.8, sm(seg01(t, NOWORD - .1, RENT + .1)));
  shot(E8, E9, { day: NIGHT, fog: [26, 80], kicks: [[LACK, .7], [RENT, .8]],
    keys: [K(E8, [104.6, G + 2.8, 97.6], [104.9, G + 2.3, 92.4], 54), K(LACK + .2, [105.3, G + 2.6, 96.4], [105.2, G + 2.3, 92.4], 50),
      K(NOWORD, [101.4, G + 3.8, 100.6], [101.6, G + 2.0, 90], 62), K(E9, [102.4, G + 3.6, 99.4], [103.2, G + 2.2, 89.6], 60)],
    lights: (t, cam) => { for (const [x, at] of LIT) if (t > at) VX.light(x + .5, G + 2.5, 89.8, [1, .78, .45], 4.5, 1.2); VX.light(DESKP.x + .5, G + 2.5, DESKP.z + 1.2, t > LACK ? [1, .45, .4] : CYAN, 3, .9); },
    act: t => {
      gf(GF9.x, G + 1, GF9.z, t > RENT + .5 ? 'cheer' : t > LACK ? 'angry' : 'idle', { flip: true, hop: t > RENT + .5 ? (t * 2.2) % 1 : 0, emote: t > RENT + .5 ? 'spark' : t > LACK ? 'sweat' : undefined, emoteAge: t - (t > RENT + .5 ? RENT + .5 : LACK) });
      const cx = cartX(t), w = seg01(t, NOWORD - .1, RENT + .1);
      heige(cx - 1.0, G + 1, CARTZ, { ...emotions(t, [[0, 'determined'], [RENT, 'cool']]), view: 'q', walk: w > 0 && w < 1 ? t * 1.8 : undefined });
      VX.sprite(cartImg(), cx, G + 1, CARTZ, { k: 1 / 46 });
      for (let i = 0; i < 6; i++) { const b = (t * .8 + i / 6) % 1; VX.pt(cx - .4 + i * .16, G + 1.75 + b * .5, CARTZ, .04, [255, 220, 120], true); }
      if (t > RENT) label(cx, G + 2.5 + .05 * Math.sin(t * 4), CARTZ, '算力卡 ×4', .42, '#FFD43B', t, RENT);
    },
    ui: (c, t) => trainWin(c, t, E8 + .15, E9, DESKP.x + .5, G + 3.2, DESKP.z + .5, LACK, RENT + .5) });
  sfx(LACK, 'alarm', -12); sfx(LACK + .5, 'sad', -13); sfx(NOWORD, 'cart', -10); for (const [, at] of LIT) sfx(at, 'click', -11); sfx(RENT + .5, 'powerup', -10);

  // =================================================================================== 10 · 她反手就能把民政局的预约截图甩你微信上：「明天上午九点，
  const BACK = P('她反手'), SHOT = P('预约截图'), FLING = P('甩你微信上'), TOMO = P('明天上午九点'), E10 = AT('上午九点');
  const H10 = { x: 101.0, z: 91.2 }, G10 = { x: 99.8, z: 90.2 };
  shot(E9, E10, { day: NIGHT, fog: [26, 80], kicks: [[FLING, 1.0]],
    keys: [K(E9, [102.2, G + 2.4, 96.4], [101.7, G + 1.95, 91], 54), K(FLING, [102.0, G + 2.35, 95.6], [101.6, G + 2.0, 91], 52), K(E10, [101.9, G + 2.3, 95.2], [101.5, G + 2.0, 91], 50)],
    lights: (t, cam) => { for (const x of RACKS) VX.light(x + .5, G + 2.5, 89.8, [1, .78, .45], 4.5, 1.2); VX.light(H10.x + .3, G + 2.0, H10.z + .6, [1, .9, .7], 1.6, t > FLING ? 1 : .4); },
    act: t => {
      VX.sprite(cartImg(), 101.8 + 1.4, G + 1, 90.0, { k: 1 / 46 });
      gf(G10.x, G + 1, G10.z, t > BACK ? 'point' : 'cheer', { emote: t > FLING ? 'music' : undefined, emoteAge: t - FLING, hop: seg01(t, BACK, BACK + .3) });
      prop(G10.x + .35, G + 1.7 + (t > BACK && t < FLING ? .15 * Math.sin(t * 20) : 0), G10.z + .3, 'phone', { k: 1 / 48 });
      heige(H10.x, G + 1, H10.z, { ...emotions(t, [[0, 'cool'], [FLING, 'surprised'], [TOMO, 'starstruck']]), view: 'q', flip: true });
      const buzz = t > FLING && t < FLING + .5 ? .03 * Math.sin(t * 90) : 0;
      prop(H10.x - .45 + buzz, G + 1.6, H10.z + .3, 'phone', { k: 1 / 44 });
      if (t > FLING && t < FLING + .7) label(H10.x - .75, G + 2.2, H10.z + .3, '叮', .3, '#FFD43B', t, FLING, FLING + .7);
    },
    ui: (c, t) => phoneChat(c, t, SHOT - .2, E10 + .3, '她', [[FLING, 'her', '民政局\n明天 09:00', 'img'], [TOMO, 'her', '明天上午九点']]) });
  sfx(BACK, 'flip', -11); sfx(SHOT, 'click', -10); sfx(FLING, 'chat', -8); sfx(FLING + .05, 'ding', -10); sfx(TOMO, 'chat', -10);

  // =================================================================================== 11 · 带户口本，谁迟到谁是狗。
  const NINE = P('九点'), BOOK = P('带户口本'), WHO = P('谁迟到谁是狗'), DOG = P('狗'), E11 = A('平时处起对象来');
  const R11 = { gx: 129.6, hx0: 123.2, hx1: 127.6, z: 88.2 };
  shot(E10, E11, { day: .5, fog: [34, 100], kicks: [[WHO, 1.3], [DOG, .7]],
    keys: [K(E10, [126.4, G + 3.4, 96.0], [126.6, G + 2.3, 87.5], 58), K(WHO, [128.4, G + 2.6, 93.8], [128.6, G + 2.35, 88], 54), K(E11, [128.5, G + 2.55, 93.2], [128.6, G + 2.35, 88], 50)],
    act: t => {
      const r = seg01(t, E10 + .1, WHO - .1), hx = lerp(R11.hx0, R11.hx1, sm(r));
      heige(hx, G + 1, R11.z, { ...emotions(t, [[0, 'nervous'], [WHO, 'relieved'], [DOG, 'happy']]), view: 'q', walk: r > 0 && r < 1 ? t * 2.2 : undefined });
      const lo = sm(seg01(t, WHO - .1, WHO + .25)), bk = [lerp(hx + .05, hx + .55, lo), lerp(G + 2.85 + .06 * Math.sin(t * 14), G + 1.6, lo)];   // held high on the run, then handed over
      prop(bk[0], bk[1], R11.z + .3, 'book', { k: 1 / 46 }); if (t > BOOK && t < WHO) tag(bk[0], bk[1] + .6, R11.z + .3, '户口本', '#F2E6C8');
      if (r > 0 && r < 1) for (let i = 0; i < 3; i++) { const a = ((t * 2 + i / 3) % 1); VX.pt(hx - .4 - a * .6, G + 1.15 + a * .2, R11.z, .06 * (1 - a), [220, 200, 180]); }
      bubble(R11.gx, G + 2.95, R11.z, '带户口本', t, BOOK - .05, WHO - .05);
      gf(R11.gx, G + 1, R11.z, t > WHO ? 'point' : 'idle', { flip: true, emote: t > WHO ? 'spark' : undefined, emoteAge: t - WHO, hop: seg01(t, WHO, WHO + .3) });
    },
    ui: (c, t) => {
      clockUI(c, t > NINE + .1 ? '09:00' : '08:59', fadeIO(t, E10 + .05, E11, .2));
      slam(c, t, WHO, E11 + .2, '谁迟到谁是狗', '#FFFFFF', 140, 190);
    } });
  sfx(NINE + .1, 'ding', -9); for (let i = 0; i < 4; i++) sfx(E10 + .25 + i * .3, 'step', -13); sfx(BOOK, 'page', -10); sfx(WHO, 'anvil', -9); sfx(DOG, 'villager', -11);
})();
