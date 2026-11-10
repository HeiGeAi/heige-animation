// scenes/nvyou_d.js: V071 shots 161.56–193.22 s, 懂 AI 的她回家：冰可乐、上下文爆了、流程跑通一起蹦、获得队友
(() => {
  const N = window.NV;
  const { G, VX, K, shot, P, A, AT, sfx, edit, flash, heige, gf, ppl, prop, bubble, label, burst, heartsUp, firework,
    seg01, sm, lerp, hh, clamp01, fadeIO, outlined, panel, icon, slam, pow, toast, termWin, dream, cold,
    SOFA, WARM, AMBER, DUSK, NIGHT } = N;
  const T0 = A('但懂AI的女生不一样'), T1 = A('往后你俩结了婚生了娃');
  const SIT = G + 1.45;                                   // sitting on the sofa: feet sink behind the seat's front face (z=62)
  const hop = (t, t0, d = .55) => { const a = (t - t0) / d; return a > 0 && a < 1 ? Math.sin(a * Math.PI) : 0; };
  const bob = (t, f = 8, h = .08) => -Math.abs(Math.sin(t * f)) * h;            // 颠步 (blocks)
  const pick = (t, list) => { let v = list[0][1]; for (const [a, b] of list) if (t >= a) v = b; return v; };

  // the study's stools (from S4 on), gone again when this chunk ends
  for (const x of [91, 94]) { edit(A('等哪天你终于'), x, G + 1, 57, 'woolRose'); edit(T1, x, G + 1, 57, 0); }

  // ---- shared overlay pieces of this chunk
  // the 上下文 meter: fills, then overflows past its frame in red
  function ctxBar(c, t, t0, t1, boom) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .2), x = 60, y = 60, w = 560, f = Math.floor(t * 20);
    const k = t < boom ? lerp(.62, 1, sm(seg01(t, t0, boom))) : 1 + sm(seg01(t, boom, boom + .35)) * .55;
    const over = t >= boom, sh = over ? (hh(f) - .5) * 16 * Math.exp(-(t - boom) * 3) : 0;
    c.save(); c.globalAlpha = a; c.translate(sh, sh * .5);
    panel(c, x - 20, y - 20, w + 40, 150);
    outlined(c, '上下文', x + 8, y + 22, 40, '#F2E6C8', { align: 'left', lw: 6, shadow: false });
    outlined(c, over ? '爆了！' : Math.round(k * 100) + '%', x + w - 8, y + 22, 40, over ? '#FF6A5A' : '#FFD43B', { align: 'right', lw: 6, shadow: false });
    c.fillStyle = '#0B0812'; c.fillRect(x, y + 60, w, 44);
    const col = !over ? (k < .9 ? '#FFD43B' : '#E8A93A') : (Math.floor(t * 10) % 2 ? '#FF3A3A' : '#C8323C');
    c.fillStyle = col; c.fillRect(x + 4, y + 64, (w - 8) * k, 36); c.fillStyle = 'rgba(255,255,255,.28)'; c.fillRect(x + 4, y + 64, (w - 8) * k, 8);
    if (over) for (let i = 0; i < 10; i++) { const b = (t - boom) * 3 - i * .12; if (b < 0) continue; const px = x + w + 20 + (b * 260 + i * 37) % 280, py = y + 82 + Math.sin(i * 2.3) * 40 * b;
      c.fillStyle = i % 2 ? '#FF6A5A' : '#FFD43B'; c.fillRect(px, py, 14, 14); }
    c.restore();
  }
  // a red X striking a daydream out
  function bigX(c, t, t0, t1) {
    if (t < t0 || t > t1) return; const k1 = sm(seg01(t, t0, t0 + .14)), k2 = sm(seg01(t, t0 + .12, t0 + .26));
    c.save(); c.lineCap = 'square';
    for (const [lw, col] of [[64, '#140A10'], [44, '#E83A44']]) { c.strokeStyle = col; c.lineWidth = lw;
      c.beginPath(); c.moveTo(620, 200); c.lineTo(620 + 680 * k1, 200 + 620 * k1); c.stroke();
      if (k2 > 0) { c.beginPath(); c.moveTo(1300, 200); c.lineTo(1300 - 680 * k2, 200 + 620 * k2); c.stroke(); } }
    c.restore();
  }
  // portraits for the party panel (pixel sprites copied to little canvases once)
  const toCanvas = img => { const cv = document.createElement('canvas'); cv.width = img.w; cv.height = img.h; cv.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(img.d), img.w, img.h), 0, 0);
    let x0 = img.w, y0 = img.h, x1 = 0, y1 = 0; for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) if (img.d[(y * img.w + x) * 4 + 3]) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    return { cv, x0, y0, w: x1 - x0 + 1, h: y1 - y0 + 1 }; };
  let PORT = null;
  const portraits = () => PORT || (PORT = [
    toCanvas(VX.capture((x, y) => heigePx(x, y, { ...feel('happy'), view: 'front', noShadow: true }))),
    toCanvas(VX.capture((x, y) => { const S = SPRITES.nvGf_shy; gridSprite(S.rows, S.pal).draw(x, y); }, 180, 170, 90, 160)),
  ]);
  function face(c, p, x, y, s) { const hh_ = Math.min(p.h, p.w * 1.05); c.save(); c.imageSmoothingEnabled = false; c.beginPath(); c.rect(x, y, s, s); c.clip();
    const k = s / p.w * 1.1; c.drawImage(p.cv, p.x0, p.y0, p.w, hh_ * .62, x + (s - p.w * k) / 2, y + 4, p.w * k, hh_ * .62 * k); c.restore(); }
  // the party panel: 队伍 1/2, then 她 joins
  function partyUI(c, t, t0, t1, join) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .25), sl = (1 - sm(seg01(t, t0, t0 + .3))) * -560, x = 50 + sl, y = 50, P2 = portraits();
    c.save(); c.globalAlpha = a; panel(c, x, y, 470, 330);
    const n = t >= join ? 2 : 1, pk = t >= join ? 1 + .5 * Math.exp(-(t - join) * 10) : 1;
    c.save(); c.translate(x + 235, y + 48); c.scale(pk, pk); outlined(c, `队伍 ${n}/2`, 0, 0, 44, '#FFD43B', { lw: 7, shadow: false }); c.restore();
    for (let i = 0; i < 2; i++) { const sy = y + 96 + i * 112, on = i === 0 || t >= join;
      c.fillStyle = on ? '#2A2238' : 'rgba(42,34,56,.5)'; c.fillRect(x + 22, sy, 426, 96);
      if (!on) { c.strokeStyle = '#6A6488'; c.lineWidth = 3; c.setLineDash([10, 8]); c.strokeRect(x + 30, sy + 8, 80, 80); c.setLineDash([]); outlined(c, '?', x + 70, sy + 50, 50, '#6A6488', { lw: 0, shadow: false }); continue; }
      const jk = i === 1 ? sm(seg01(t, join, join + .25)) : 1; c.globalAlpha = a * jk;
      c.fillStyle = i ? '#F29AB0' : '#3A3550'; c.fillRect(x + 30, sy + 8, 80, 80); face(c, P2[i], x + 30, sy + 8, 80);
      outlined(c, i ? '她' : '黑哥', x + 132, sy + 32, 38, '#FFFFFF', { align: 'left', lw: 6, shadow: false });
      for (let h = 0; h < 5; h++) icon(c, 'heart', x + 132 + h * 52, sy + 58, 5);
      c.globalAlpha = a; }
    c.restore();
  }

  // ---- 1 · 但懂 AI 的女生不一样。门开了，她抱着电脑回家，屋里从冷变暖
  const OPEN = P('但懂AI的女生不一样') + .12, DIFF = P('女生不一样'), S1E = AT('看你那张臭脸');
  // a front wall with a door, just for this shot (the house is a cutaway otherwise)
  for (let x = 79; x <= 88; x++) for (let y = 1; y <= 3; y++) { if ((x === 83 || x === 84) && y <= 2) continue; edit(T0, x, G + y, 66, x === 79 || x === 88 || y === 3 ? 'log' : 'brickSoft'); edit(S1E, x, G + y, 66, 0); }
  for (const x of [83, 84]) for (const y of [1, 2]) { edit(T0, x, G + y, 66, 'plankSoft'); edit(OPEN, x, G + y, 66, 0); }
  const s1z = t => lerp(68.2, 63.6, sm(seg01(t, OPEN + .25, S1E - .3)));
  shot(T0, S1E, { day: t => lerp(NIGHT, DUSK, sm(seg01(t, OPEN, OPEN + 1.4))), fog: [30, 90], kicks: [[OPEN, .5]],
    keys: [K(T0, [83.4, G + 5.4, 58.0], [83.9, G + 1.8, 65.6], 60), K(DIFF, [83.5, G + 5.3, 58.3], [83.95, G + 1.75, 65.2], 56), K(S1E, [83.6, G + 5.1, 58.6], [84.0, G + 1.7, 64.6], 50)],
    lights: t => { const k = sm(seg01(t, OPEN - .05, OPEN + .5)); if (k > 0) { VX.light(83.9, G + 2.6, 68.2, WARM, 7 * k, 1.0); VX.light(83.9, G + 2.4, 63.4, AMBER, 3.5 * k, .5); } },
    act: t => {
      heige(82.6, SIT, 61.5, { ...emotions(t, [[0, 'sad'], [DIFF + .4, 'surprised']]), view: 'back' }, { noShadow: true });
      const z = s1z(t), walking = t > OPEN + .25 && t < S1E - .3;
      if (t > OPEN - .05) gf(84.0 + .25 * Math.sin(z), G + 1, z, 'idle', { flip: true, emote: t > S1E - .6 ? 'heart' : undefined, emoteAge: t - S1E + .6 }, { dy: walking ? bob(t) : 0 });
      if (t > OPEN && t < OPEN + 1) burst(t, OPEN, 83.9, G + 2.2, 66.6, [255, 214, 140], 22);
    },
    ui: (c, t) => {
      const k = 1 - sm(seg01(t, OPEN, OPEN + 1.2)); if (k > 0) { c.fillStyle = `rgba(70,46,130,${.32 * k})`; c.fillRect(0, 0, 1920, 1080); }
      const w = sm(seg01(t, OPEN, OPEN + 1.0)) * (1 - .4 * sm(seg01(t, OPEN + 1.2, S1E)));
      if (w > 0) { const g = c.createRadialGradient(960, 520, 60, 960, 520, 900); g.addColorStop(0, `rgba(255,190,110,${.32 * w})`); g.addColorStop(1, 'rgba(255,150,80,0)'); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(0, 0, 1920, 1080); c.restore(); }
    } });
  sfx(OPEN - .05, 'door', -8); sfx(OPEN + .15, 'chime', -9); for (let i = 0; i < 4; i++) sfx(OPEN + .45 + i * .42, 'step_wood', -15);

  // ---- 2 · 她下班回来往沙发上一坐，看你那张臭脸，连问都不用多问，直接递过来一罐冰可乐
  const FACE = P('臭脸'), GIVE = P('直接递过来') + .15, GOT = GIVE + .55, S2E = AT('咋了');
  const sitK = t => sm(seg01(t, S1E, S1E + .45));
  const colaAt = t => { const u = sm(seg01(t, GIVE, GOT)); return [lerp(84.05, 83.05, u), SIT + .62 + Math.sin(u * Math.PI) * .3, 61.75]; };
  shot(S1E, S2E, { day: DUSK, fog: [30, 90], kicks: [[S1E + .45, .5], [GOT, .6]],
    keys: [K(S1E, [83.6, G + 3.0, 66.8], [83.6, G + 2.3, 61], 54), K(GIVE, [83.6, G + 2.85, 66.0], [83.6, G + 2.35, 61], 50), K(S2E, [83.55, G + 2.8, 65.5], [83.55, G + 2.4, 61], 48)],
    act: t => {
      heige(82.6, SIT, 61.5, { ...emotions(t, [[0, 'sad'], [FACE, 'bored'], [GOT, 'surprised']]), view: 'front', poseR: t > GOT ? 'clasp' : undefined }, { noShadow: true });
      const k = sitK(t); gf(lerp(85.4, 84.5, k), lerp(G + 1, SIT, k) - Math.sin(k * Math.PI) * .25, lerp(62.6, 61.5, k), 'idle', { flip: true, emote: t > GOT ? 'heart' : undefined, emoteAge: t - GOT }, { noShadow: k > .5 });
      // a little grey rain cloud over the sulky face
      if (t > FACE - .2 && t < GOT + .3) { const ca = Math.min(1, (t - FACE + .2) * 4); for (let i = 0; i < 9; i++) VX.pt(82.6 + (i % 5 - 2) * .13, SIT + 1.98 + (i > 4 ? .12 : 0) + .02 * Math.sin(t * 3 + i), 61.5, .12 * ca, [120, 116, 140], true);
        for (let i = 0; i < 4; i++) { const f = ((t * 2.2 + i / 4) % 1); VX.pt(82.4 + i * .14, SIT + 1.9 - f * .4, 61.5, .04, [170, 190, 230], true); } }
      if (t > GIVE - .1) { const [x, y, z] = colaAt(t); prop(x, y, z, 'cola', { k: 1 / 60 });
        for (let i = 0; i < 5; i++) { const f = (t * 1.5 + i / 5) % 1; VX.pt(x + Math.sin(i * 2 + t) * .1, y + .42 + f * .3, z + .05, .035, [235, 240, 255], true); } }
      if (t > GOT) burst(t, GOT, 83.05, SIT + .9, 61.3, [255, 214, 90], 8);
    },
    ui: (c, t) => {} });
  sfx(S1E + .4, 'thud', -12); sfx(FACE, 'sad', -14); sfx(GIVE, 'pickup', -11); sfx(GOT, 'pop', -8);

  // ---- 3 · 咋了，今天模型又抽风了？还是上下文爆了？来，发我看看。
  const Q1 = P('咋了'), Q2 = P('还是上下文爆了'), BOOM = P('爆了'), Q3 = P('来发我看看'), S3E = A('等哪天你终于');
  shot(S2E, S3E, { day: DUSK, fog: [30, 90], kicks: [[BOOM, 1.1]],
    keys: [K(S2E, [84.0, G + 2.8, 65.2], [83.6, G + 2.45, 61.2], 50), K(BOOM, [83.7, G + 2.7, 64.6], [83.55, G + 2.45, 61.3], 47), K(S3E, [83.55, G + 2.7, 64.6], [83.55, G + 2.5, 61.3], 47)],
    act: t => {
      heige(82.6, SIT, 61.5, { ...emotions(t, [[0, 'sad'], [BOOM, 'dizzy'], [Q3 + .1, 'relieved']]), view: 'q', poseR: 'clasp' }, { noShadow: true });
      prop(83.05, SIT + .62, 61.75, 'cola', { k: 1 / 60 });
      const pose = t < Q2 ? 'idle' : t < Q3 ? 'point' : 'idle';
      gf(84.5, SIT, 61.5, pose, { flip: pose !== 'point', emote: t < Q2 ? '?' : t < Q3 ? '!' : 'heart', emoteAge: t - (t < Q2 ? Q1 : t < Q3 ? Q2 : Q3) }, { noShadow: true, dy: hop(t, Q3, .4) * .25 });
      bubble(84.5, SIT + 1.95, 61.5, '咋了？\n模型又抽风了？', t, Q1 - .05, Q2 - .08);
      bubble(84.5, SIT + 1.95, 61.5, '还是\n上下文爆了？', t, Q2 - .02, Q3 - .08);
      bubble(84.5, SIT + 1.95, 61.5, '来，发我看看', t, Q3 - .02, S3E);
      if (t > BOOM && t < BOOM + 1) burst(t, BOOM, 82.6, SIT + 1.9, 61.6, [255, 110, 90], 16);
    },
    ui: (c, t) => ctxBar(c, t, Q2 - .1, Q3 + .7, BOOM) });
  sfx(Q1, 'chat', -12); sfx(Q2, 'chat', -12); sfx(Q2 + .2, 'tick', -12); sfx(BOOM, 'glitch', -8); sfx(BOOM + .05, 'boom', -14); sfx(Q3, 'pop', -10);
  flash(BOOM, '232,58,68', .18);

  // ---- 4 · 等哪天你终于把一个折腾了好几天的流程跑通，激动得从椅子上蹦起来嗷嗷叫的时候
  const RUN = P('流程跑通'), PASS = P('跑通'), HYPE = P('激动得从椅子上'), JUMP = P('蹦起来'), AO = P('嗷嗷叫'), S4E = AT('也不用尴尬');
  const STEPS = ['读取表格', '调用模型', '整理结果', '生成报告', '自动发送'], TICK = STEPS.map((_, i) => lerp(A('等哪天你终于') + .55, PASS - .3, i / (STEPS.length - 1)));
  shot(S3E, S4E, { day: DUSK, fog: [30, 90], kicks: [[PASS, .6], [JUMP + .05, 1.3], [AO + .05, .9]],
    keys: [K(S3E, [93.0, G + 2.9, 61.0], [93.2, G + 2.3, 55.6], 56), K(HYPE - .1, [92.7, G + 2.7, 60.0], [92.9, G + 2.35, 55.6], 52),
      K(JUMP - .15, [91.9, G + 2.1, 60.6], [91.6, G + 3.0, 56.2], 58), K(S4E, [91.7, G + 2.0, 61.4], [91.6, G + 3.2, 56.2], 62)],
    lights: t => { if (t > PASS) VX.light(91.5, G + 2.6, 56.4, AMBER, 4, .9 * Math.min(1, (t - PASS) * 3)); },
    act: t => {
      const turned = t > HYPE, up = hop(t, JUMP, .62) * 1.45 + hop(t, AO, .48) * .8 + (turned && t < JUMP ? hop(t, HYPE + .1, .3) * .25 + hop(t, HYPE + .5, .3) * .25 : 0);
      heige(91.5, G + 1, 56.5, { ...emotions(t, [[0, 'thinking'], [TICK[2], 'nervous'], [PASS, 'starstruck'], [HYPE, 'excited'], [JUMP, 'laugh']]), view: turned ? 'front' : 'back', poseR: t > JUMP ? 'cheer' : undefined, poseL: t > JUMP ? 'cheer' : undefined }, { dy: up });
      if (t < HYPE) for (let i = 0; i < 3; i++) VX.pt(91.5 + Math.sin(t * 9 + i * 2) * .3, G + 2.9 + i * .1, 56.0, .05, [255, 214, 140], true);
      firework(91.6, G + 3.2, 55.9, t - JUMP - .05); firework(93.4, G + 3.6, 55.9, t - AO); firework(89.8, G + 3.4, 55.9, t - AO - .2);
      if (t > JUMP) burst(t, JUMP, 91.5, G + 2.6, 56.6, [255, 212, 59], 22);
    },
    ui: (c, t) => {
      const lines = STEPS.map((s, i) => [S3E + .2, (t >= TICK[i] ? '[✓] ' : i === 0 || t >= TICK[i - 1] ? '[…] ' : '[ ] ') + `第 ${i + 1} 步  ${s}`, t >= TICK[i] ? '#FFD43B' : '#8A86A0', 0]);
      termWin(c, t, S3E + .15, HYPE + .2, '流程调试 · 第 5 天', lines, { x: 1000, y: 90, w: 860, h: 600, fs: 40 });
      if (t > PASS && t < HYPE + .2) { const a = t - PASS, k = (1 + .6 * Math.exp(-a * 12)) * (1 - sm(seg01(t, HYPE, HYPE + .2))); c.save(); c.translate(1430, 600); c.rotate(-.05); c.scale(k, k); outlined(c, '全部通过', 0, 0, 96, '#FFD43B', { lw: 14 }); c.restore(); }
      pow(c, t, AO, '嗷！', 1180, 360); pow(c, t, AO + .22, '嗷！', 760, 300);
    } });
  TICK.forEach((tk, i) => sfx(tk, ['xp', 'xp_1', 'xp_2', 'xp_3', 'xp_4'][i], -11)); sfx(PASS, 'levelup', -9);
  sfx(HYPE + .1, 'step_wood', -12); sfx(JUMP, 'firework', -8); sfx(JUMP + .05, 'boom', -14); sfx(AO, 'firework', -9); flash(JUMP + .05, '255,212,59', .22);

  // ---- 5 · 也不用尴尬地跟她解释半天这玩意儿到底牛在哪（脑补：对着一个不懂的人比划半天，打叉）
  const EXPL = P('解释半天'), XX = P('这玩意儿'), S5E = A('她凑过来');
  shot(S4E, S5E, { day: DUSK, fog: [30, 90], kicks: [[XX, 1.0]],
    keys: [K(S4E, [111.8, G + 2.9, 76.6], [111.9, G + 2.1, 70.5], 54), K(S5E, [111.9, G + 2.7, 75.3], [111.9, G + 2.3, 70.5], 50)],
    act: t => {
      const g = ['point', 'wave', 'chin', 'hip', 'point', 'scratch'][Math.floor((t - S4E) * 3.2) % 6];
      heige(110.9, G + 1, 70.6, { ...emotions(t, [[0, 'determined'], [EXPL, 'nervous'], [XX, 'confused']]), view: 'q', poseR: g }, { dy: bob(t, 6, .05) });
      ppl(112.9, G + 1, 70.6, '女生', t < EXPL ? 'neutral' : 'worry', t);
      [S4E + .45, S4E + .95, EXPL + .1].forEach((q, i) => label(112.55 + i * .35, G + 3.15 + .08 * Math.sin(t * 6 + i), 70.6, '?', .55, '#FFFFFF', t, q, S5E));
      if (t > S4E + .2) for (let i = 0; i < 4; i++) { const f = ((t - S4E) * 1.6 + i / 4) % 1; VX.pt(110.5 + i * .25, G + 2.6 + f * .5, 70.7, .05, [240, 230, 255], true); }
    },
    ui: (c, t) => { dream(c, t, S4E, S5E + .1); bigX(c, t, XX, S5E); } });
  sfx(S4E + .45, 'villager', -12); sfx(S4E + .95, 'villager', -13); sfx(EXPL + .1, 'villager', -12); sfx(XX, 'break', -8); sfx(XX + .05, 'thud', -10);

  // ---- 6 · 她凑过来扫一眼你的屏幕，比你还激动：（牛逼啊！）
  const COME = P('她凑过来'), SCAN = P('扫一眼'), SCREEN = P('屏幕'), WOW = P('比你还激动'), BANG = P('牛逼啊'), S6E = AT('这一步居然');
  const s6x = t => lerp(94.5, 92.75, sm(seg01(t, COME + .1, SCAN))), s6z = t => lerp(56.5, 57.6, sm(seg01(t, COME + .1, SCAN)));
  shot(S5E, S6E, { day: DUSK, fog: [30, 90], kicks: [[BANG, 1.3]],
    keys: [K(S5E, [93.2, G + 2.9, 62.0], [93.0, G + 2.25, 56.4], 54), K(SCREEN, [92.6, G + 2.75, 61.0], [92.4, G + 2.3, 56.5], 50), K(BANG, [92.3, G + 2.65, 60.9], [92.3, G + 2.4, 56.6], 50), K(S6E, [92.25, G + 2.6, 60.7], [92.3, G + 2.45, 56.6], 50)],
    lights: t => VX.light(91.5, G + 2.6, 56.4, AMBER, 3.5, .6),
    act: t => {
      const turn = t > WOW;
      heige(91.5, G + 1, 56.5, { ...emotions(t, [[0, 'proud'], [WOW, 'surprised'], [BANG, 'laugh']]), view: turn ? 'q' : 'back', flip: false }, { dy: hop(t, BANG, .5) * .5 });
      const walking = t > COME + .1 && t < SCAN;
      const pose = t < SCAN ? 'idle' : t < WOW ? 'shy' : 'cheer';
      const hp = t > WOW ? hop(t, WOW, .5) + hop(t, WOW + .5, .45) * .7 + hop(t, BANG - .05, .55) : 0;
      gf(s6x(t), G + 1, s6z(t), pose, { flip: true, emote: t > SCREEN && t < WOW ? '!' : t > WOW ? 'spark' : undefined, emoteAge: t - (t < WOW ? SCREEN : WOW) }, { dy: (walking ? bob(t) : 0) + hp * .6 });
      if (t > BANG) { burst(t, BANG, 92.3, G + 2.9, 56.2, [255, 212, 59], 16); heartsUp(t, BANG, S6E, 93.6, G + 2.4, 57.4, 3); }
    },
    ui: (c, t) => slam(c, t, BANG, S6E + .1, '哇！', '#FFD43B', 210, 190) });
  sfx(COME + .15, 'step_wood', -14); sfx(COME + .55, 'step_wood', -14); sfx(SCREEN, 'ding', -11); sfx(WOW, 'magic', -11); sfx(BANG, 'powerup', -8); flash(BANG, '255,212,59', .2);

  // ---- 7 · 这一步居然真让你跑通了？快给我看看怎么搞的！两人一起蹦
  const L1 = P('这一步居然'), L2 = P('快给我看看'), S7E = A('那一刻你就会明白');
  shot(S6E, S7E, { day: DUSK, fog: [30, 90], kicks: [[L1, .5], [L2, .6]],
    keys: [K(S6E, [91.6, G + 2.5, 61.6], [92.4, G + 2.4, 58.3], 52), K(L2, [92.8, G + 2.6, 61.9], [92.5, G + 2.45, 58.3], 50), K(S7E, [93.3, G + 2.7, 61.7], [92.6, G + 2.5, 58.3], 49)],
    lights: t => VX.light(92.5, G + 3, 59.5, AMBER, 4, .7),
    act: t => {
      const hb = (t - S6E) * 2.4, hpH = Math.abs(Math.sin(hb * Math.PI)) * .55, hpG = Math.abs(Math.sin((hb + .5) * Math.PI)) * .6;
      heige(91.8, G + 1, 58.4, { ...emotions(t, [[0, 'laugh'], [L2, 'proud']]), view: 'front', poseR: 'cheer', poseL: t < L2 ? 'cheer' : undefined }, { dy: hpH });
      const pose = t < L2 ? 'cheer' : 'point';
      gf(93.2, G + 1, 58.4, pose, { flip: pose === 'point', emote: 'heart', emoteAge: (t - S6E) % 1.2 }, { dy: pose === 'cheer' ? hpG : hpG * .35 });
      bubble(93.2, G + 2.75, 58.4, '这一步居然\n真让你跑通了？', t, L1 - .05, L2 - .15);
      bubble(93.2, G + 2.75, 58.4, '快给我看看\n怎么搞的！', t, L2 - .05, S7E);
      heartsUp(t, S6E + .1, S7E - .4, 92.5, G + 2.8, 58.6, 7);
      for (let i = 0; i < 26; i++) { const f = ((t - S6E) * .55 + hh(i, 3)) % 1; VX.pt(90.6 + hh(i, 1) * 3.8, G + 4.4 - f * 3.2, 57.6 + hh(i, 2) * 1.6, .05 + .03 * hh(i, 4), [255, 212 - 40 * hh(i, 5), 70], true); }
      if (t > L2) burst(t, L2, 93.2, G + 2.8, 58.5, [255, 150, 170], 18);
    },
    ui: (c, t) => {} });
  for (let i = 0; i < 7; i++) sfx(S6E + .2 + i * .42, i % 2 ? 'step_wood' : 'xp', -14); sfx(L1, 'heart', -11); sfx(L2, 'chime', -10); sfx(L2 + .05, 'chat', -13);

  // ---- 8 · 那一刻你就会明白，找对象这事，找个能聊到一块去的队友，到底有多爽。
  const JOIN = P('找个能聊到一块去'), MATE = P('队友'), COOL = P('到底有多爽');
  shot(S7E, T1, { day: DUSK, fog: [34, 100], kicks: [[JOIN, .5], [COOL, .7]],
    keys: [K(S7E, [92.5, G + 2.4, 62.4], [92.5, G + 2.25, 58.6], 54), K(JOIN, [92.5, G + 4.2, 64.8], [92.5, G + 1.95, 58.5], 56), K(T1, [92.5, G + 9.2, 70.4], [92.5, G + 1.6, 57.8], 58)],
    lights: t => VX.light(92.5, G + 3, 59.6, AMBER, 5, .8),
    act: t => {
      heige(91.8, G + 1, 58.6, { ...emotions(t, [[0, 'happy'], [JOIN, 'proud'], [COOL, 'love']]), view: 'front', poseR: t > COOL ? 'cheer' : undefined }, { dy: hop(t, COOL, .5) * .45 });
      gf(93.2, G + 1, 58.6, t < JOIN ? 'shy' : t < COOL ? 'idle' : 'cheer', { emote: t > JOIN ? 'heart' : undefined, emoteAge: t - JOIN }, { dy: hop(t, COOL, .5) * .55 });
      if (t > JOIN) burst(t, JOIN, 93.2, G + 2.4, 58.7, [255, 212, 59], 20);
      heartsUp(t, MATE - .3, T1, 92.5, G + 3, 58.8, 6);
      firework(92.5, G + 4.4, 58.2, t - COOL); firework(90.6, G + 5.0, 57.6, t - COOL - .3);
    },
    ui: (c, t) => { partyUI(c, t, S7E + .25, T1 + .2, JOIN); toast(c, t, MATE - .5, T1 + .3, '成就达成', '获得队友', 'heart'); } });
  sfx(S7E + .3, 'click', -12); sfx(JOIN, 'join', -9); sfx(MATE - .5, 'toast', -10); sfx(COOL, 'firework', -9); sfx(COOL + .1, 'levelup', -11);
})();
