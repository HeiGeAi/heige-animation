// scenes/nvyou_c.js: V071 shots 106.30–161.56 s, the turn: 整活 behind them, the real thing (she gets where you're stuck,
// the 3 a.m. PC run and her sleepy 「测完了早点睡」), then how hard the job is and what a girlfriend who doesn't get it says.
(() => {
  const N = window.NV;
  const { G, VX, K, shot, P, A, AT, sfx, edit, flash, heige, gf, ppl, prop, bubble, label, burst, heartsUp,
    seg01, sm, lerp, hh, clamp01, fadeIO, outlined, panel, icon, slam, floatTxt, stamp, toast, tagUI, clockUI, hhmm, dream,
    cold, heartsUI, termWin, PC, AMBER, PINK, WARM } = N;

  // ======================================================================================= this chunk's own overlay bits
  // a game "paused" look: pull the colour out (the frame stops)
  const desat = (c, a) => { if (a <= 0) return; c.save(); c.globalCompositeOperation = 'saturation'; c.fillStyle = `rgba(128,128,128,${a})`; c.fillRect(0, 0, 1920, 1080); c.restore(); };
  // the place tag with a red strike drawn across it from t0
  function tagStrike(c, t, txt, a, t0) {
    if (a <= 0) return; tagUI(c, txt, a);
    if (t < t0) return; c.save(); c.font = `800 40px ${N.FONT}`; const w = c.measureText(txt).width, k = sm(seg01(t, t0, t0 + .22));
    c.globalAlpha = a; c.strokeStyle = '#E83A44'; c.lineWidth = 10; c.lineCap = 'round';
    c.beginPath(); c.moveTo(56, 98); c.lineTo(56 + (w + 30) * k, 98 - 34 * k); c.stroke(); c.restore();
  }
  // a pixel pointing hand (finger up), tip at (x, y)
  function hand(c, x, y, s = 6) {
    const R = ['...aa.....', '..abba....', '..abba....', '..abbaaa..', '..abbabbaa', 'aaabbabbab', 'abbbbbbbba', 'abbbbbbbba', '.abbbbbbba', '..abbbbba.', '..aaaaaaa.'];
    R.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '.') return; c.fillStyle = ch === 'a' ? '#140A10' : '#F8D5C0'; c.fillRect(x + (i - 4.5) * s, y + j * s, s, s); }));
  }
  // five steps in a row; steps before `stuck` turn yellow one by one, step `stuck` spins then flashes red 卡住 at redAt;
  // a hand flies in and taps it at tapAt
  function flowUI(c, t, t0, t1, steps, stuck, okAt, redAt, tapAt) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .2), bw = 250, gap = 70, n = steps.length, x0 = 960 - (n * bw + (n - 1) * gap) / 2, y = 150, bh = 130;
    c.save(); c.globalAlpha = a; panel(c, x0 - 40, y - 40, n * bw + (n - 1) * gap + 80, bh + 80);
    steps.forEach((s, i) => {
      const x = x0 + i * (bw + gap), done = i < stuck && t > okAt[i], isStuck = i === stuck, red = isStuck && t > redAt, blink = red && Math.floor((t - redAt) * 6) % 2 === 0;
      if (i > 0) { c.fillStyle = (i <= stuck && (i < stuck ? t > okAt[i] : t > okAt[i - 1])) ? '#FFD43B' : '#4A4858'; c.fillRect(x - gap + 8, y + bh / 2 - 6, gap - 16, 12); }
      const pop = done ? 1 + .25 * Math.exp(-(t - okAt[i]) * 12) : red ? 1 + .3 * Math.exp(-(t - redAt) * 10) : 1;
      c.save(); c.translate(x + bw / 2, y + bh / 2); c.scale(pop, pop);
      c.fillStyle = red ? (blink ? '#E83A44' : '#8A1E28') : done ? '#C8962A' : '#2A2638'; c.fillRect(-bw / 2, -bh / 2, bw, bh);
      c.strokeStyle = red ? '#FFB0A8' : done ? '#FFD43B' : '#5A5870'; c.lineWidth = 6; c.strokeRect(-bw / 2, -bh / 2, bw, bh);
      outlined(c, `${i + 1}`, -bw / 2 + 30, -bh / 2 + 30, 30, done || red ? '#FFF6D0' : '#8A86A0', { lw: 0, shadow: false });
      outlined(c, s, 0, 6, 40, '#FFFFFF', { lw: 6, shadow: false });
      if (isStuck && !red && t > okAt[stuck - 1]) { c.strokeStyle = '#FFD43B'; c.lineWidth = 6; c.beginPath(); c.arc(0, 0, 70, t * 7, t * 7 + 1.6); c.stroke(); }
      c.restore();
      if (red) { const k = sm(seg01(t, redAt, redAt + .15)); c.save(); c.globalAlpha = a * k; c.translate(x + bw / 2, y + bh + 60); c.rotate(-.08); outlined(c, '卡住', 0, 0, 60, '#FF6A5A', { lw: 10 }); c.restore(); }
    });
    if (t > tapAt - .45) {                                    // the hand: flies up from the bottom right, taps the stuck step
      const k = sm(seg01(t, tapAt - .45, tapAt)), tx = x0 + stuck * (bw + gap) + bw / 2 + 20, ty = y + bh / 2 + 10;
      const tap = t > tapAt ? Math.abs(Math.sin((t - tapAt) * 9)) * Math.exp(-(t - tapAt) * 3) * 18 : 0;
      hand(c, lerp(1500, tx, k), lerp(760, ty, k) + tap, 7);
      if (t > tapAt && t < tapAt + .5) { const r = 30 + (t - tapAt) * 220; c.strokeStyle = `rgba(255,212,59,${1 - (t - tapAt) * 2})`; c.lineWidth = 8; c.beginPath(); c.arc(tx, ty, r, 0, 7); c.stroke(); }
    }
    c.restore();
  }
  // a run's progress bar: climbs from t0 to 99% at t99, sits there, then turns red 运行失败 at tFail
  function progUI(c, t, t0, t1, title, t99, tFail) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .2), x = 460, y = 110, w = 1000, h = 64, fail = t > tFail;
    const k = fail ? .99 : lerp(0, .99, Math.pow(sm(seg01(t, t0 + .2, t99)), .8)), f = Math.floor(t * 24);
    const jx = fail ? (hh(f) - .5) * 24 * Math.exp(-(t - tFail) * 5) : 0;
    c.save(); c.globalAlpha = a; c.translate(jx, 0); panel(c, x - 40, y - 40, w + 80, h + 190);
    outlined(c, title, x + 6, y + 10, 40, '#F2E6C8', { align: 'left', lw: 6, shadow: false });
    outlined(c, `${Math.round(k * 100)}%`, x + w - 6, y + 10, 46, fail ? '#FF6A5A' : '#FFD43B', { align: 'right', lw: 7, shadow: false });
    c.fillStyle = '#1A1428'; c.fillRect(x, y + 50, w, h); c.fillStyle = fail ? '#E83A44' : '#E8A93A'; c.fillRect(x + 6, y + 56, (w - 12) * k, h - 12);
    c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(x + 6, y + 56, (w - 12) * k, 8);
    if (fail) { const s = 1 + .5 * Math.exp(-(t - tFail) * 10); c.save(); c.translate(960, y + 180); c.rotate(-.05); c.scale(s, s); outlined(c, '运行失败', 0, 0, 72, '#FF6A5A', { lw: 12 }); c.restore();
      for (let i = 0; i < 14; i++) { const e = t - tFail, vx = (hh(i, 7) - .5) * 900, vy = -200 - hh(i, 8) * 400; if (e > 1.2) break;
        c.fillStyle = i % 3 ? '#E8A93A' : '#FFD43B'; c.fillRect(x + w * .99 + vx * e, y + 80 + vy * e + 900 * e * e, 18, 18); } }
    c.restore();
  }
  // the 体力 bar (a Minecraft-ish hunger row of drumsticks would read as food; this is plain): top centre
  function staminaUI(c, t, k, a) {
    if (a <= 0) return; const x = 610, y = 70, w = 700, low = k < .12 && Math.floor(t * 6) % 2;
    c.save(); c.globalAlpha = a; panel(c, x - 150, y - 26, w + 190, 96); outlined(c, '体力', x - 80, y + 22, 44, '#F2E6C8', { lw: 7, shadow: false });
    c.fillStyle = '#1A1428'; c.fillRect(x, y, w, 44); c.fillStyle = low ? '#FF3A3A' : '#E8A93A'; c.fillRect(x + 5, y + 5, (w - 10) * clamp01(k), 34);
    for (let i = 1; i < 10; i++) { c.fillStyle = 'rgba(20,10,16,.6)'; c.fillRect(x + i * w / 10 - 2, y, 4, 44); }
    c.restore();
  }
  // a little grey rain cloud over someone's head (world)
  function rainCloud(t, x, y, z, k = 1) {
    if (k <= 0) return;
    for (let i = 0; i < 9; i++) VX.pt(x - .45 + (i % 5) * .22 + .04 * Math.sin(t * 2 + i), y + (i < 5 ? 0 : .16) + .03 * Math.sin(t * 3 + i), z, .16 * k, [96, 96, 112]);
    for (let i = 0; i < 6; i++) { const a = ((t * 1.6 + i / 6) % 1); VX.pt(x - .4 + i * .16, y - .1 - a * .9, z, .035 * k, [190, 196, 220], true); }
  }
  // falling tears from heige's eyes (heige at x, y feet, z): ph staggers them
  function tears(t, t0, x, y, z) { if (t < t0) return; for (let i = 0; i < 6; i++) { const a = ((t - t0) * 1.4 + i / 6) % 1; for (const s of [-1, 1]) prop(x + s * .2 + s * a * .25, y + 1.32 - a * 1.1 + a * a * .2, z + .2, 'tear', { k: 1 / 70, a: 1 - a }); } }

  const FRZ = P('整活') - .45, TRUE_ = P('但真相处久了');

  // ======================================================================================= 1 · 听着好像全是在整活对吧？
  // the camera snaps back out of the living room to the whole town and the world stops; 整活 gets struck out
  const S1 = A('听着好像全是在整活对吧'), S2 = AT('跟懂AI的女生在一起');
  shot(S1, S2, { day: t => lerp(.32, .2, sm(seg01(t, TRUE_, S2))), fog: [70, 170], kicks: [[FRZ, .9]],
    keys: [K(S1, [83.6, G + 4.4, 64.6], [83.4, G + 1.9, 57.4], 56), K(FRZ, [93, G + 15, 99], [102, G + 2, 60], 64),
      K(TRUE_, [94, G + 14.5, 97.5], [102, G + 2, 60], 62), K(S2, [88, G + 10, 84], [85, G + 4, 58], 60)],
    act: t => { const frozen = t > FRZ;
      heige(82.6, G + 1, 57.6, { feel: frozen ? 'scared' : 'nervous', view: 'q' });
      gf(84.4, G + 1, 57.6, 'point', { flip: true, emote: frozen ? null : 'anger', emoteAge: t - S1 });
      if (!frozen) burst(t, S1 + .1, 83.5, G + 2.6, 57.6, [255, 212, 59], 12); },
    ui: (c, t) => { desat(c, .55 * sm(seg01(t, FRZ, FRZ + .15)) * (1 - sm(seg01(t, TRUE_, TRUE_ + .6))));
      tagStrike(c, t, '整活', fadeIO(t, S1 + .2, S2, .25), P('整活') + .1); } });
  sfx(FRZ, 'click', -8); sfx(P('整活') + .1, 'scratch', -10); sfx(TRUE_, 'chime', -13);
  flash(FRZ, '255,255,255', .35);

  // ======================================================================================= 2 · 但真相处久了你就知道 …… 最戳人的还真不是这些段子
  // night turns warm: the two of them up on the roof lip, stars behind, a shooting star; slow push in
  const S3 = AT('是那种');
  const STARS = []; for (let i = 0; i < 46; i++) STARS.push([60 + hh(i, 1) * 50, G + 9 + hh(i, 2) * 16, 20 + hh(i, 3) * 14, hh(i, 4)]);
  shot(S2, S3, { day: .17, fog: [60, 150], noWhoosh: false,
    keys: [K(S2, [83.6, G + 3.6, 64.5], [83.6, G + 6.9, 55], 58), K(S3, [83.6, G + 4.4, 61.2], [83.6, G + 7.0, 55], 52)],
    lights: (t, cam) => { VX.light(83.6, G + 7.5, 57, AMBER, 6, .9 * sm(seg01(t, S2, S2 + 1.5))); },
    act: t => { heige(82.9, G + 6, 55.4, { ...emotions(t, [[0, 'relieved'], [P('最戳人的'), 'love']]), view: 'q' });
      gf(84.3, G + 6, 55.4, 'shy', { flip: true, emote: t > P('最戳人的') ? 'heart' : null, emoteAge: t - P('最戳人的') });
      for (const [x, y, z, ph] of STARS) VX.pt(x, y, z, .12 + .08 * Math.sin(t * 3 + ph * 20), [255, 236, 190], true);
      const sa = seg01(t, P('最戳人的') + .2, P('最戳人的') + 1.1); if (sa > 0 && sa < 1) for (let i = 0; i < 8; i++) { const u = sa - i * .025; VX.pt(70 + u * 26, G + 22 - u * 8, 30, .16 - i * .016, [255, 224, 150], true); }
      for (let i = 0; i < 4; i++) { const a = ((t * .35 + i / 4) % 1); VX.pt(83.6 + Math.sin(i * 2 + t) * .9, G + 7.6 + a * 1.4, 55.6, .05, [255, 190, 200], true); } },
    ui: (c, t) => {} });
  sfx(P('最戳人的') + .2, 'chime', -12); sfx(P('这些段子'), 'pop', -14);

  // ======================================================================================= 3 · 是那种你放个屁她都知道你卡在哪一步的痛快
  // the five-step flow over the PC; step 3 spins, she points, it flashes red 卡住, ding
  const S4 = A('你半夜三点'), KNOW = P('她都知道'), STUCK = P('卡在哪一步');
  shot(S3, S4, { day: .2, fog: [30, 90], kicks: [[STUCK, .8]],
    keys: [K(S3, [87.2, G + 3.0, 59.7], [83.6, G + 1.9, 56.2], 58), K(S4, [86.6, G + 2.8, 59.5], [83.6, G + 2.0, 56.2], 52)],
    act: t => { heige(82.4, G + 1, 56.9, { ...emotions(t, [[0, 'confused'], [STUCK + .1, 'surprised'], [P('的痛快'), 'starstruck']]), view: t > STUCK + .1 ? 'q' : 'back' });
      gf(85.3, G + 1, 56.2, t > KNOW - .1 ? 'point' : 'idle', { flip: true, hop: seg01(t, KNOW - .1, KNOW + .25), emote: t > STUCK ? '!' : null, emoteAge: t - STUCK });
      if (t > STUCK && t < STUCK + .9) burst(t, STUCK, 83.5, G + 2.4, 56.0, [255, 212, 59], 14); },
    ui: (c, t) => flowUI(c, t, S3 + .1, S4, ['需求', '写提示词', '调接口', '跑测试', '上线'], 2, [S3 + .3, S3 + .6], STUCK, STUCK) });
  sfx(S3 + .3, 'click', -13); sfx(S3 + .6, 'click', -13); sfx(KNOW, 'pop', -12); sfx(STUCK, 'ding', -8); sfx(P('的痛快'), 'xp', -12);

  // ======================================================================================= 4 · 你半夜三点偷偷从床上爬起来，摸黑去客厅开电脑
  // 03:00, the dark bedroom; he slips out of bed and tiptoes off (back to us); the camera whips to the PC, the screen wakes
  const S5 = A('换别的女朋友'), UP = P('偷偷从床上爬起来'), GO = P('摸黑去客厅'), ON = P('开电脑'), WHIP = GO + .35;
  edit(S4 - .05, PC.x, G + 2, PC.z, 'box'); edit(ON, PC.x, G + 2, PC.z, 'monitor');          // the screen is dark until he turns it on
  const tip = t => {                                         // where he is: by the bed → out past the partition; after the whip, at the desk
    if (t < UP) return [75.1, 58.6, 'q', true];
    if (t < WHIP) { const k = seg01(t, UP, WHIP); return k < .55 ? [lerp(75.1, 78.4, k / .55), lerp(58.6, 60.5, k / .55), 'back', false] : [lerp(78.4, 80.3, (k - .55) / .45), 60.5, 'back', false]; }
    const k = sm(seg01(t, WHIP, ON - .05)); return [lerp(80.6, 82.5, k), lerp(58.6, 56.8, k), 'back', false];
  };
  shot(S4, S5, { day: .03, fog: [24, 70],
    keys: [K(S4, [75.6, G + 3.4, 65.2], [74.6, G + 1.7, 57.5], 56), K(UP + .3, [75.8, G + 3.2, 65.6], [76.2, G + 1.7, 58.5], 58),
      K(GO, [76.4, G + 3.0, 66.2], [79.2, G + 1.6, 59.5], 60), K(WHIP - .05, [76.6, G + 3.0, 66.0], [79.6, G + 1.6, 59.6], 60), K(WHIP + .05, [85.8, G + 2.8, 59.6], [82.8, G + 1.8, 55.8], 58), K(S5, [85.2, G + 2.6, 59.2], [82.8, G + 2.0, 55.8], 52)],
    lights: (t, cam) => { const k = sm(seg01(t, ON, ON + .35)); if (k > 0) VX.light(PC.x + .5, G + 2.4, PC.z + 2.2, [1, .95, .86], 2 + 4 * k, 1.6 * k); },
    act: t => { const [x, z, view, still] = tip(t), moving = !still && t > UP && t < ON - .05;
      heige(x, G + 1, z, { ...emotions(t, [[0, 'sleepy'], [UP, 'mischief'], [ON, 'excited']]), view, flip: still, walk: moving ? t * .65 : undefined }, { dy: moving ? -Math.abs(Math.sin(t * 5)) * .06 : 0 });
      gf(72.5, G + 1.25, 57.4, 'sleep');
      const za = ((t * .5) % 1); prop(72.2 + za * .4, G + 2.7 + za * .6, 57.4, 'zzz', { k: 1 / 60, a: 1 - za }); },
    ui: (c, t) => { clockUI(c, '03:00', fadeIO(t, S4 + .1, S5, .2)); if (t > ON) { const k = Math.exp(-(t - ON) * 6); c.fillStyle = `rgba(255,246,220,${.18 * k})`; c.fillRect(0, 0, 1920, 1080); } } });
  for (let i = 0; i < 5; i++) sfx(UP + .3 + i * .36, 'step_wood', -16); sfx(WHIP, 'whoosh', -12); sfx(ON, 'click', -9); sfx(ON + .1, 'zap', -13); sfx(S4 + .1, 'tick', -14);

  // ======================================================================================= 5 · 换别的女朋友，高低得怀疑你在外面背着她聊骚
  // 脑补: a villager girlfriend glares from behind him, a big red ? over her, 「你在跟谁聊？」
  const S6 = A('她倒好'), SUS = P('高低得怀疑'), SAO = P('背着她聊骚');
  shot(S5, S6, { day: .06, fog: [24, 70], kicks: [[SUS, .7]],
    keys: [K(S5, [86.2, G + 3.2, 59.7], [81.6, G + 2.1, 57.4], 58), K(S6, [85.6, G + 3.0, 59.5], [81.4, G + 2.2, 57.6], 50)],
    lights: (t, cam) => { VX.light(PC.x + .5, G + 2.4, PC.z + 2.2, [1, .95, .86], 6, 1.4); VX.light(81.4, G + 3, 59.6, PINK, 4, .8); },
    act: t => { heige(82.5, G + 1, 56.8, { ...emotions(t, [[0, 'happy'], [SAO, 'nervous']]), view: t > SAO ? 'q' : 'back', flip: t > SAO }, {});
      prop(82.1, G + 2.05, 56.4, 'phone', { k: 1 / 48 });
      const step = sm(seg01(t, S5 + .1, SUS)); ppl(lerp(80.5, 80.5, step), G + 1, lerp(61.6, 58.6, step), '女生', t > SAO ? 'shout' : t > SUS ? 'angry' : 'worry', t, { walk: step > 0 && step < 1 });
      if (t > SUS) label(80.5, G + 3.7 + .08 * Math.sin(t * 6), 58.6, '?', 1.3, '#E83A44', t, SUS);
      bubble(80.5, G + 3.0, 58.6, '你在跟谁聊？', t, SAO - .5, S6); },
    ui: (c, t) => dream(c, t, S5, S6) });
  sfx(S5 + .1, 'magic', -13); sfx(SUS, 'glitch', -11); sfx(SAO - .5, 'chat', -10);

  // ======================================================================================= 6 · 她倒好，在被窝里迷迷糊糊翻个身
  const S7 = AT('闭着眼睛问你'), TURN = P('迷迷糊糊翻个身');
  shot(S6, S7, { day: .06, fog: [24, 70],
    keys: [K(S6, [74.6, G + 3.4, 63.2], [72.9, G + 1.9, 57.3], 56), K(S7, [74.0, G + 2.9, 61.4], [72.9, G + 1.9, 57.3], 50)],
    act: t => { const fl = t > TURN + .2, roll = seg01(t, TURN, TURN + .4);
      gf(72.5, G + 1.25, 57.4, 'sleep', { flip: fl, sq: roll > 0 && roll < 1 ? .18 * Math.sin(roll * Math.PI) : 0, hop: roll > 0 && roll < 1 ? roll * .45 : 0 });
      for (let i = 0; i < 3; i++) { const za = ((t * .45 + i / 3) % 1); prop(72.3 + za * .5 + i * .05, G + 2.6 + za * .8, 57.4, 'zzz', { k: 1 / 64, a: 1 - za }); } },
    ui: (c, t) => {} });
  sfx(TURN, 'flip', -11); sfx(TURN + .05, 'step_wood', -15);

  // ======================================================================================= 7 · 闭着眼睛问你：老公，是不是半夜又有新的开源模型发了？测完了早点睡，别熬太晚。
  // the cutaway: her in bed (left), him at the lit PC (right); her two lines; the bedside lamp clicks on
  const S8 = A('就这一句话'), HUBBY = P('老公'), MODEL = P('新的开源模型'), SLEEP = P('测完了早点睡');
  edit(SLEEP, 76, G + 2, 55, 'lamp'); edit(S8 + 3.0, 76, G + 2, 55, 'offlamp');   // on for her line, off again once the bedroom is behind us
  shot(S7, S8, { day: .06, fog: [26, 80],
    keys: [K(S7, [77.4, G + 6.8, 71.5], [77.6, G + 1.6, 57], 60), K(SLEEP, [77.4, G + 6.2, 69.8], [77.4, G + 1.7, 57], 58), K(S8, [78.6, G + 5.6, 68.6], [78.6, G + 1.8, 57], 56)],
    lights: (t, cam) => { VX.light(PC.x + .5, G + 2.4, PC.z + 2.2, [1, .95, .86], 6, 1.3); const k = sm(seg01(t, SLEEP, SLEEP + .3)); if (k > 0) VX.light(76.5, G + 2.6, 56.2, AMBER, 5, 1.3 * k); },
    act: t => { gf(72.5, G + 1.25, 57.4, 'sleep', { flip: true });
      heige(82.5, G + 1, 56.8, { ...emotions(t, [[0, 'determined'], [HUBBY + .1, 'surprised'], [MODEL + .2, 'happy'], [SLEEP + .4, 'love']]), view: t > HUBBY + .1 ? 'q' : 'back', flip: t > HUBBY + .1 });
      for (let i = 0; i < 2; i++) { const za = ((t * .4 + i / 2) % 1); prop(72.0 + za * .4, G + 2.7 + za * .7, 57.4, 'zzz', { k: 1 / 64, a: (1 - za) * .9 }); }
      bubble(72.6, G + 2.7, 57.4, '老公\n又有新的开源模型发了？', t, HUBBY - .1, SLEEP - .05);
      bubble(72.6, G + 2.7, 57.4, '测完了早点睡\n别熬太晚', t, SLEEP + .05, S8 + .1); },
    ui: (c, t) => clockUI(c, '03:07', fadeIO(t, S7, S8 + .3, .25)) });
  sfx(HUBBY - .1, 'chat', -12); sfx(HUBBY + .1, 'pop', -14); sfx(SLEEP + .05, 'chat', -12); sfx(SLEEP, 'click', -10);

  // ======================================================================================= 8 · 就这一句话，能把你感动得死死的
  const S9 = A('说实话'), MOVED = P('感动得死死的');
  shot(S8, S9, { day: .06, fog: [24, 70], kicks: [[MOVED, .6]],
    keys: [K(S8, [84.6, G + 2.7, 60.2], [82.7, G + 2.1, 56.8], 56), K(S9, [83.6, G + 2.4, 59.4], [82.7, G + 2.2, 56.8], 46)],
    lights: (t, cam) => VX.light(PC.x + .5, G + 2.4, PC.z + 2.2, [1, .95, .86], 6, 1.3),
    act: t => { heige(82.7, G + 1, 57.0, { ...emotions(t, [[0, 'surprised'], [S8 + .4, 'cry'], [MOVED, 'love']]), view: 'front' });
      tears(t, S8 + .5, 82.7, G + 1, 57.0); heartsUp(t, MOVED - .2, S9 + .3, 82.7, G + 2.8, 57.2, 7); },
    ui: (c, t) => { heartsUI(c, t, MOVED, S9 + .1, 10); } });
  sfx(S8 + .4, 'sad', -14); sfx(MOVED, 'heart', -9); sfx(MOVED + .4, 'heart', -12);

  // ======================================================================================= 9 · 说实话，现在干 AI 这一行，有时候真挺憋屈的
  // grey and cold, him alone at the desk, the camera circling; a little rain cloud gathers over his head
  const S10 = A('白天在电脑前'), BLUE = P('有时候真挺憋屈的');
  shot(S9, S10, { day: .3, fog: [26, 80],
    keys: [K(S9, [80.6, G + 2.9, 59.5], [82.6, G + 2.0, 56.6], 56), K((S9 + S10) / 2, [83.2, G + 3.3, 59.7], [82.6, G + 2.0, 56.6], 54), K(S10, [85.6, G + 2.9, 59.3], [82.6, G + 2.1, 56.6], 52)],
    act: t => { heige(82.6, G + 1, 56.8, { ...emotions(t, [[0, 'sad'], [BLUE, 'bored']]), view: 'q' }); rainCloud(t, 82.6, G + 3.1, 56.8, sm(seg01(t, BLUE - .4, BLUE + .3))); },
    ui: (c, t) => { desat(c, .6); cold(c, t, S9 - 1); if (t > BLUE) floatTxt(c, t, BLUE + .2, '憋屈', 960, 300); } });
  sfx(S9 + .1, 'sad', -14); sfx(BLUE, 'sizzle', -15);

  // ======================================================================================= 10 · 白天在电脑前调了一整天提示词，AI 还在那儿一本正经地胡说八道
  // the clock runs 09:00 → 18:00, the light goes from day to dusk, the terminal answers with straight-faced nonsense
  const S11 = AT('或者辛辛苦苦'), TUNE = P('调了一整天提示词'), STILL = P('AI还在那儿'), NONS = P('一本正经地胡说八道');
  shot(S10, S11, { day: t => lerp(.6, .3, sm(seg01(t, S10 + .2, STILL))), fog: [30, 90], kicks: [[NONS, .7]],
    keys: [K(S10, [80.5, G + 2.9, 59.8], [83.6, G + 2.0, 56.0], 60), K(S11, [80.7, G + 2.7, 59.5], [83.6, G + 2.1, 56.0], 54)],
    act: t => { heige(82.4, G + 1, 56.9, { ...emotions(t, [[0, 'determined'], [NONS, 'confused'], [NONS + .9, 'dizzy']]), view: t > NONS ? 'q' : 'back' });
      if (t > NONS + .9) for (let i = 0; i < 3; i++) { const th = t * 5 + i * 2.1; prop(82.4 + Math.cos(th) * .35, G + 2.85, 56.9 + Math.sin(th) * .2, 'star', { k: 1 / 80 }); } },
    ui: (c, t) => { clockUI(c, hhmm(lerp(9, 18, sm(seg01(t, S10 + .2, STILL)))), fadeIO(t, S10, S11, .2));
      termWin(c, t, TUNE - .2, S11, '提示词调试', [[TUNE - .1, '> 提示词 第 37 版：请严谨作答', '#E8E6F8', 26], [STILL, '好的，已为您核实：', '#C8C0E0', 30],
        [NONS, '地球是方的。', '#FFD43B', 14], [NONS + .5, '1 + 1 = 3，绝对正确。', '#FFD43B', 20]], { x: 1000, y: 130, w: 860, h: 440, fs: 38 }); } });
  sfx(S10 + .2, 'tick', -13); sfx(TUNE, 'type_burst', -12); sfx(STILL, 'type', -13); sfx(NONS, 'glitch', -9); sfx(NONS + .9, 'chime', -14);

  // ======================================================================================= 11 · 或者辛辛苦苦跑了一宿的数据，早上一看全崩了
  // overnight run: the bar crawls to 99% as dawn comes up, then it all goes red; the screen shatters
  const S12 = A('下班回到家'), RUN = P('跑了一宿的数据'), MORN = P('早上一看'), CRASH = P('全崩了');
  edit(CRASH, PC.x, G + 2, PC.z, 'redlamp'); edit(S12 + .05, PC.x, G + 2, PC.z, 'monitor');
  shot(S11, S12, { day: t => lerp(.08, .55, sm(seg01(t, RUN, MORN + .2))), fog: [30, 90], kicks: [[CRASH, 1.5]],
    keys: [K(S11, [86.0, G + 3.0, 59.6], [82.6, G + 2.0, 56.2], 60), K(CRASH, [85.4, G + 2.8, 59.4], [82.6, G + 2.0, 56.2], 56), K(S12, [85.0, G + 2.6, 59.2], [82.6, G + 2.1, 56.2], 52)],
    lights: (t, cam) => { if (t > CRASH) VX.light(PC.x + .5, G + 2.4, PC.z + 1.8, [1, .3, .25], 5, 1.4 * Math.max(.4, Math.exp(-(t - CRASH) * 2))); },
    act: t => { const sleepy = t < MORN;
      heige(81.6, G + 1, 57.6, { ...emotions(t, [[0, 'determined'], [RUN + .6, 'sleepy'], [MORN, 'hopeful'], [CRASH, 'ko']]), view: 'q' }, { dy: sleepy && t > RUN + .6 ? -.04 * Math.sin(t * 2) : 0 });
      if (t > CRASH) { burst(t, CRASH, PC.x + .5, G + 2.5, PC.z + 1.1, [235, 230, 240], 26); burst(t, CRASH + .05, PC.x + .5, G + 2.5, PC.z + 1.1, [232, 58, 68], 16); } },
    ui: (c, t) => { progUI(c, t, S11 + .1, S12, '数据跑了一宿', MORN, CRASH); clockUI(c, hhmm(lerp(23, 31, sm(seg01(t, RUN, MORN + .2)))), fadeIO(t, S11, S12, .2));
      if (t > CRASH) { const k = Math.exp(-(t - CRASH) * 2.5); c.fillStyle = `rgba(200,30,40,${.25 * k})`; c.fillRect(0, 0, 1920, 1080); } } });
  flash(CRASH, '232,58,68', .45);
  sfx(RUN, 'tick', -14); sfx(MORN, 'xp_2', -12); sfx(CRASH, 'break_glass', -7); sfx(CRASH + .08, 'boom', -12); sfx(CRASH + .5, 'sad', -12);

  // ======================================================================================= 12 · 下班回到家，你累得跟条狗一样，瘫在沙发上一句话都不想说
  // he drags in from the street and collapses into the sofa; 体力 drains to empty
  const S13 = A('要是家里那位'), HOMEIN = P('下班回到家'), DOG = P('累得跟条狗一样'), FLOP = P('瘫在沙发上'), MUTE = P('一句话都不想说');
  const flopPos = t => { if (t < FLOP - .25) { const k = seg01(t, HOMEIN - .1, FLOP - .4); return [83.5, lerp(70.5, 62.7, k), 'back', G + 1, true]; }
    const k = sm(seg01(t, FLOP - .25, FLOP + .1)); return [83.5, lerp(62.9, 61.45, k), 'front', lerp(G + 1, G + 1.72 - .06 * seg01(t, FLOP, S13), k), false]; };
  shot(S12, S13, { day: .14, fog: [30, 90], kicks: [[FLOP + .1, 1.1]],
    keys: [K(S12, [84.2, G + 3.0, 75.2], [83.5, G + 1.9, 64], 58), K(FLOP - .3, [81.8, G + 3.4, 68.2], [83.5, G + 1.8, 61.8], 58), K(S13, [82.6, G + 3.1, 66.4], [83.5, G + 2.45, 61.6], 52)],
    act: t => { const [x, z, view, y, walking] = flopPos(t);
      heige(x, y, z, { ...emotions(t, [[0, 'sad'], [DOG, 'sleepy'], [FLOP + .1, 'ko']]), view, walk: walking && t > HOMEIN - .1 ? t * .7 : undefined }, { dy: walking ? -.05 * Math.abs(Math.sin(t * 4)) : 0, noShadow: !walking });
      if (t > MUTE) { const a = ((t - MUTE) * .8) % 1; label(x + .3, G + 3.3 + a * .4, z, '…', .5, '#C8C0E0', t, MUTE); }
      if (t > FLOP + .1 && t < FLOP + 1) burst(t, FLOP + .1, 83.5, G + 2.1, 62.3, [216, 200, 168], 14); },
    ui: (c, t) => { staminaUI(c, t, lerp(.35, 0, sm(seg01(t, DOG, FLOP + .4))), fadeIO(t, S12 + .2, S13, .2)); clockUI(c, '20:40', 0); } });
  sfx(HOMEIN - .2, 'door', -10); for (let i = 0; i < 5; i++) sfx(HOMEIN + .1 + i * .42, 'step_wood', -15); sfx(FLOP + .1, 'thud', -8); sfx(MUTE, 'sad', -13);

  // ======================================================================================= 13 · 要是家里那位完全不懂 …… 别想工作了，多喝热水 …… 坐办公室吹空调敲键盘有什么好累的
  // 脑补, three beats: he complains and she doesn't get it; she brings 多喝热水; she rolls her eyes and turns away
  const D0 = S13, D1 = A('但懂AI的女生不一样');
  const B1 = AT('她也只能回你一句'), B2 = AT('甚至还觉得你矫情');
  const NOGET = P('完全不懂'), GRIPE = P('跟她吐槽两句'), WATER = P('多喝热水'), JQ = P('甚至还觉得你矫情'), AC = P('坐办公室');
  const he = (t, keys) => heige(83.5, G + 1.72, 61.45, { ...emotions(t, keys), view: 'front' }, { noShadow: true });
  // 13a · 要是家里那位完全不懂，你跟她吐槽两句
  shot(D0, B1, { day: .14, fog: [30, 90],
    keys: [K(D0, [85.4, G + 3.6, 71.0], [85.4, G + 2.0, 62], 56), K(B1, [85.4, G + 3.4, 69.8], [85.4, G + 2.1, 62], 52)],
    lights: (t, cam) => VX.light(85.4, G + 3, 63, PINK, 5, .6),
    act: t => { he(t, [[0, 'ko'], [GRIPE, 'sad']]);
      ppl(87.6, G + 1, 63.0, '女生', t > NOGET ? 'neutral' : 'happy', t); prop(87.2, G + 2.15, 63.3, 'phone', { k: 1 / 50 });
      if (t > NOGET) label(87.6, G + 3.6 + .06 * Math.sin(t * 5), 63.0, '?', .9, '#C8C0E0', t, NOGET);
      bubble(83.5, G + 3.1, 62.1, '模型又崩了\n跑了一宿全白干', t, GRIPE - .1, B1); },
    ui: (c, t) => dream(c, t, D0, D1) });
  sfx(D0 + .1, 'magic', -13); sfx(GRIPE - .1, 'chat', -12); sfx(NOGET + .1, 'pop', -14);
  // 13b · 她也只能回你一句：别想工作了，多喝热水
  shot(B1, B2, { day: .14, fog: [30, 90], noWhoosh: true,
    keys: [K(B1, [85.4, G + 3.4, 69.8], [85.4, G + 2.1, 62], 52), K(B2, [85.0, G + 3.1, 68.2], [84.8, G + 2.1, 62], 48)],
    lights: (t, cam) => VX.light(85.4, G + 3, 63, PINK, 5, .6),
    act: t => { he(t, [[0, 'sad'], [WATER + .2, 'bored']]);
      const k = sm(seg01(t, B1 + .1, WATER - .2)); ppl(lerp(87.6, 85.6, k), G + 1, lerp(63.0, 63.3, k), '女生', 'happy', t, { walk: k > 0 && k < 1 });
      const hand = t > WATER ? sm(seg01(t, WATER, WATER + .3)) : 0, cx = lerp(lerp(87.2, 85.2, k), 84.5, hand), cz = lerp(63.5, 62.5, hand);
      prop(cx, lerp(G + 2.05, G + 2.02, hand) + .06 * Math.sin(t * 3) * (1 - hand), cz, 'cup', { k: 1 / 44 });
      bubble(85.6, G + 3.2, 63.3, '别想工作了\n多喝热水', t, P('别想工作了') - .1, B2); },
    ui: (c, t) => { dream(c, t, D0, D1); if (t > WATER) stamp(c, t, WATER, '多喝热水'); } });
  sfx(P('别想工作了') - .1, 'chat', -12); sfx(WATER, 'pickup', -10); sfx(WATER + .1, 'slap', -12);
  // 13c · 甚至还觉得你矫情，坐办公室吹空调敲键盘有什么好累的
  shot(B2, D1, { day: .14, fog: [30, 90], kicks: [[JQ + .2, .6]],
    keys: [K(B2, [86.6, G + 3.4, 69.6], [85.0, G + 2.1, 62], 54), K(AC, [85.6, G + 3.1, 68.0], [84.8, G + 2.2, 62], 50), K(D1, [84.2, G + 2.8, 66.2], [83.7, G + 2.4, 62.1], 44)],
    lights: (t, cam) => VX.light(85.4, G + 3, 63, PINK, 5, .6),
    act: t => { he(t, [[0, 'bored'], [JQ + .2, 'sad'], [AC + 1.2, 'cry']]); rainCloud(t, 83.5, G + 3.4, 62.1, sm(seg01(t, AC + .8, AC + 1.4)));
      prop(84.5, G + 2.02, 62.5, 'cup', { k: 1 / 44 });
      const turn = seg01(t, JQ - .1, JQ + .5); ppl(lerp(85.6, 87.2, turn), G + 1, 63.3, '女生', t > JQ ? 'angry' : 'happy', t, { walk: turn > 0 && turn < 1 });
      if (t > JQ && t < AC) label(87.2, G + 3.5, 63.3, '矫情', .55, '#FF6A5A', t, JQ + .1);
      bubble(87.2, G + 3.2, 63.3, '坐办公室吹空调\n有什么好累的', t, AC - .1, D1 - .1); },
    ui: (c, t) => dream(c, t, D0, D1) });
  sfx(JQ + .1, 'hit', -12); sfx(AC - .1, 'chat', -12); sfx(P('有什么好累的'), 'sad', -11);
})();
