// scenes/nvyou_b.js: V071 shots 43.22–106.30 s, 平时处对象（省心、咖啡馆刷开源、查岗）和吵架（摔门、我是中国人、封号墓碑）
(() => {
  const N = window.NV;
  const { B, G, VX, K, shot, P, A, AT, sfx, edit, flash, heige, gf, ppl, clawd, prop, bubble, label, burst, coinsUp,
    seg01, sm, lerp, hh, clamp01, fadeIO, outlined, panel, icon, slam, pow, toast, tagUI, bossBar, cold, banScreen, termWin, commitGrid,
    PC, DUSK, NIGHT, WARM, FONT } = N;
  const em = (t, keys) => emotions(t, keys);
  const bounce = (t, on = true, f = 8) => on ? -Math.abs(Math.sin(t * f)) * 2 : 0;

  // ======================================================================================= overlay helpers (this chunk only)
  const _cv = document.createElement('canvas');
  function capDraw(c, img, x, y, s) {   // a VX.capture image drawn on the overlay, feet at (x, y)
    if (!img) return; _cv.width = img.w; _cv.height = img.h;
    _cv.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(img.d), img.w, img.h), 0, 0);
    c.save(); c.imageSmoothingEnabled = false; c.drawImage(_cv, Math.round(x - img.ox * s), Math.round(y - img.oy * s), img.w * s, img.h * s); c.restore();
  }
  // 省心程度 meter (top centre): fills, then MAX pops
  function meterUI(c, t, t0, t1, k, maxAt) {
    const a = fadeIO(t, t0, t1, .2); if (a <= 0) return;
    const x = 560, y = 150, w = 800;
    c.save(); c.globalAlpha = a; outlined(c, '省心程度', 960, 92, 54, '#FFD34E', { lw: 9 });
    c.fillStyle = 'rgba(12,8,16,.8)'; c.fillRect(x - 6, y - 6, w + 12, 40);
    const n = 20; for (let i = 0; i < n; i++) { if (i / n >= k) break; c.fillStyle = i % 2 ? '#E8A93A' : '#FFD43B'; c.fillRect(x + i * w / n + 2, y, w / n - 4, 28); }
    if (t > maxAt) { const b = t - maxAt, s = 1 + .8 * Math.exp(-b * 12); c.save(); c.translate(x + w + 90, y + 14); c.rotate(-.08); c.scale(s, s); outlined(c, 'MAX', 0, 0, 64, '#FF6A5A', { lw: 10 }); c.restore(); }
    c.restore();
  }
  // 排队 timer counting up to 02:00:00
  function queueTimer(c, t, t0, t1, t2) {
    const a = fadeIO(t, t0, t1, .25); if (a <= 0) return;
    const sec = Math.round(7200 * sm(seg01(t, t0 + .2, t2))), txt = `${String(Math.floor(sec / 3600)).padStart(2, '0')}:${String(Math.floor(sec % 3600 / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
    c.save(); c.globalAlpha = a; panel(c, 40, 40, 560, 110); icon(c, 'clock', 64, 64, 9);
    outlined(c, '排队', 200, 96, 48, '#F2E6C8', { lw: 7, shadow: false }); outlined(c, txt, 420, 96, 56, t >= t2 ? '#FF6A5A' : '#FFD34E', { lw: 8, shadow: false }); c.restore();
  }
  // a feed of open-source project cards scrolling up; the gold one lands on `goldAt`
  const CARDS = [['离线翻译', '3.2k'], ['一键抠图', '8.9k'], ['本地知识库', '15k'], ['视频转字幕', '6.4k'], ['宝藏项目', '21k'], ['开源 Agent', '11k'], ['表格助手', '2.7k']];
  function feedUI(c, t, t0, t1, goldAt) {
    const a = fadeIO(t, t0, t1, .25); if (a <= 0) return;
    const x = 70, y = 90, w = 640, h = 720, ch = 150;
    c.save(); c.globalAlpha = a; panel(c, x, y, w, h); outlined(c, '开源项目', x + w / 2, y + 50, 44, '#FFD34E', { lw: 7, shadow: false });
    c.beginPath(); c.rect(x + 10, y + 100, w - 20, h - 110); c.clip();
    const goldI = 4, off = lerp(0, (goldI - 1) * (ch + 20), sm(seg01(t, t0 + .2, goldAt))) + (t > goldAt ? 0 : 0);
    CARDS.forEach(([nm, st], i) => {
      const cy = y + 120 + i * (ch + 20) - off; if (cy > y + h || cy + ch < y + 100) return;
      const gold = i === goldI && t > goldAt, g = gold ? 1 + .06 * Math.exp(-(t - goldAt) * 8) : 1;
      c.save(); c.translate(x + w / 2, cy + ch / 2); c.scale(g, g);
      c.fillStyle = gold ? '#4A3A12' : '#241A38'; c.fillRect(-(w - 80) / 2, -ch / 2, w - 80, ch);
      c.fillStyle = gold ? '#FFD43B' : '#3A2E58'; c.fillRect(-(w - 80) / 2, -ch / 2, w - 80, 6); c.fillRect(-(w - 80) / 2, ch / 2 - 6, w - 80, 6); c.fillRect(-(w - 80) / 2, -ch / 2, 6, ch); c.fillRect((w - 80) / 2 - 6, -ch / 2, 6, ch);
      icon(c, 'book', -(w - 80) / 2 + 30, -32, 8);
      outlined(c, nm, -(w - 80) / 2 + 120, -14, 46, gold ? '#FFD34E' : '#F2E6C8', { align: 'left', lw: 7, shadow: false });
      outlined(c, '★ ' + st, -(w - 80) / 2 + 120, 40, 34, '#E8A93A', { align: 'left', lw: 5, shadow: false });
      c.restore();
    });
    c.restore();
  }
  // the Star button: presses = [t, ...]; the count goes up by one on each
  function starUI(c, t, t0, t1, presses, base = 1203) {
    const a = fadeIO(t, t0, t1, .25); if (a <= 0) return;
    const n = presses.filter(p => t >= p).length, last = presses.filter(p => t >= p).pop(), x = 80, y = 300;
    c.save(); c.globalAlpha = a; panel(c, x, y, 620, 230);
    const pk = last != null ? Math.exp(-(t - last) * 10) : 0, s = 1 - .12 * pk;
    c.save(); c.translate(x + 190, y + 115); c.scale(s, s);
    c.fillStyle = n ? '#FFD43B' : '#3A2E58'; c.fillRect(-140, -60, 280, 120); c.fillStyle = n ? '#B8862E' : '#241A38'; c.fillRect(-140, 54, 280, 6);
    outlined(c, (n ? '★' : '☆') + ' Star', 0, 2, 56, n ? '#3A2414' : '#F2E6C8', { lw: 0, shadow: false }); c.restore();
    c.fillStyle = '#0E0C16'; c.fillRect(x + 360, y + 55, 220, 120);
    const cs = last != null ? 1 + .4 * Math.exp(-(t - last) * 9) : 1;
    c.save(); c.translate(x + 470, y + 117); c.scale(cs, cs); outlined(c, (base + n).toLocaleString('en-US'), 0, 0, 56, '#FFD43B', { lw: 0, shadow: false }); c.restore();
    for (const p of presses) { const b = t - p; if (b < 0 || b > .9) continue;
      outlined(c, '+1', x + 470, y + 30 - b * 120, 52, '#FFD34E', { lw: 8 });
      for (let i = 0; i < 8; i++) { const th = i / 8 * 6.28 + p, r = 60 + b * 260; c.save(); c.globalAlpha = a * (1 - b / .9); icon(c, 'star', x + 190 + Math.cos(th) * r - 24, y + 115 + Math.sin(th) * r * .7 - 24, 6); c.restore(); } }
    c.restore();
  }
  // a phone flipping through three pages (no brands): pages = [[t, title, kind]]
  function phoneFlip(c, t, t0, t1, pages) {
    const a = fadeIO(t, t0, t1, .25); if (a <= 0) return;
    const x = 1270, y = 100, w = 470, h = 780, sl = (1 - sm(seg01(t, t0, t0 + .3))) * 160;
    c.save(); c.globalAlpha = a; c.translate(0, sl); c.rotate(.03);
    c.fillStyle = '#1A1622'; c.beginPath(); c.roundRect(x - 20, y - 20, w + 40, h + 40, 44); c.fill();
    c.fillStyle = '#EDEBF2'; c.fillRect(x, y, w, h); c.beginPath(); c.rect(x, y, w, h); c.clip();
    let cur = -1; pages.forEach(([pt], i) => { if (t >= pt) cur = i; });
    const draw = (i, dx) => {
      c.save(); c.translate(dx, 0);
      if (i < 0) { c.fillStyle = '#2A2638'; c.fillRect(x, y, w, h); outlined(c, '22:47', x + w / 2, y + 220, 96, '#FFFFFF', { lw: 0, shadow: false }); c.restore(); return; }
      const [, title, kind] = pages[i];
      c.fillStyle = '#EDEBF2'; c.fillRect(x, y, w, h); c.fillStyle = '#2A2638'; c.fillRect(x, y, w, 96); outlined(c, title, x + w / 2, y + 50, 40, '#FFFFFF', { lw: 0, shadow: false });
      for (let r = 0; r < 6; r++) { const yy = y + 130 + r * 106;
        if (kind === 'chat') { const me = r % 2; c.fillStyle = me ? '#FFD43B' : '#FFFFFF'; const bw = 160 + hh(r, 3) * 150; c.beginPath(); c.roundRect(me ? x + w - 40 - bw : x + 90, yy, bw, 70, 14); c.fill(); c.fillStyle = me ? '#3A3550' : '#F29AB0'; c.fillRect(me ? x + w - 34 : x + 24, yy, 0, 0); c.fillStyle = '#B8B4C8'; c.fillRect(me ? x + w - 30 - bw + 20 : x + 110, yy + 30, bw - 60, 10); c.fillStyle = me ? '#3A3550' : '#F29AB0'; c.fillRect(me ? x + w - 34 + 0 : x + 24, yy + 6, 0, 0); c.fillStyle = me ? '#6A6480' : '#F29AB0'; if (!me) c.fillRect(x + 24, yy + 6, 52, 52); }
        else { c.fillStyle = '#FFFFFF'; c.fillRect(x + 24, yy, w - 48, 86); c.fillStyle = kind === 'taxi' ? '#E8A93A' : '#E890A8'; c.fillRect(x + 40, yy + 16, 54, 54);
          c.fillStyle = '#B8B4C8'; c.fillRect(x + 112, yy + 22, 150, 12); c.fillRect(x + 112, yy + 50, 100, 10);
          outlined(c, '¥ ' + (kind === 'taxi' ? (18 + Math.floor(hh(r, 5) * 60)) : (39 + Math.floor(hh(r, 6) * 400))), x + w - 50, yy + 43, 34, '#C8323C', { align: 'right', lw: 0, shadow: false }); }
      }
      c.restore();
    };
    const pt = cur >= 0 ? pages[cur][0] : t0, k = sm(seg01(t, pt, pt + .25));
    if (k < 1 && cur >= 0) draw(cur - 1, -k * w);
    draw(cur, cur >= 0 ? (1 - k) * w : 0);
    c.restore();
  }
  // a soft additive light cone from the top onto (px, py), and a dark vignette around it
  function spotUI(c, px, py, a) {
    if (a <= 0) return;
    const g = c.createRadialGradient(px, py, 120, px, py, 900); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(6,4,10,${.6 * a})`); c.fillStyle = g; c.fillRect(0, 0, 1920, 1080);
    c.save(); c.globalCompositeOperation = 'lighter'; const lg = c.createLinearGradient(0, 0, 0, py + 200); lg.addColorStop(0, `rgba(255,246,220,${.32 * a})`); lg.addColorStop(1, 'rgba(255,246,220,0)');
    c.fillStyle = lg; c.beginPath(); c.moveTo(px - 60, 0); c.lineTo(px + 60, 0); c.lineTo(px + 260, py + 200); c.lineTo(px - 260, py + 200); c.closePath(); c.fill(); c.restore();
  }
  // the big enter key, a finger trembling over it
  function enterKeyUI(c, t, t0, t1, touchAt) {
    const a = fadeIO(t, t0, t1, .22); if (a <= 0) return;
    const zk = 1 + .1 * seg01(t, t0, t1);
    c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(14,10,24,.92)'; c.fillRect(0, 0, 1920, 1080);
    c.translate(960, 600); c.scale(zk * 1.35, zk * 1.35);
    const glow = .5 + .5 * Math.sin(t * 9); c.fillStyle = `rgba(255,90,70,${.12 + .1 * glow})`; c.fillRect(-330, -170, 660, 360);
    c.fillStyle = '#8E8676'; c.fillRect(-260, -70, 520, 230); c.fillStyle = '#E8E2D6'; c.fillRect(-260, -110, 520, 230); c.fillStyle = '#F6F2EA'; c.fillRect(-260, -110, 520, 12);
    c.strokeStyle = '#140A10'; c.lineWidth = 8; c.strokeRect(-260, -110, 520, 270);
    outlined(c, '回车 ↵', 0, 4, 96, '#3A3550', { lw: 0, shadow: false });
    const tr = (hh(Math.floor(t * 30)) - .5) * 10, down = t > touchAt ? 40 * sm(seg01(t, touchAt, touchAt + .3)) : 0, fy = -560 + down + tr * .4;
    c.fillStyle = '#E9B099'; c.fillRect(-55 + tr, fy, 110, 400); c.fillStyle = '#D18E78'; c.fillRect(33 + tr, fy, 22, 400);
    c.fillStyle = '#F7E3D6'; c.fillRect(-38 + tr, fy + 318, 76, 64); c.strokeStyle = '#140A10'; c.lineWidth = 6; c.strokeRect(-55 + tr, fy - 10, 110, 410);
    c.fillStyle = '#F2C63A'; c.fillRect(-64 + tr, fy - 10, 128, 120); c.strokeRect(-64 + tr, fy - 10, 128, 120);   // her yellow sleeve
    c.restore();
    cold(c, t, t0);
  }
  // Clawd inside the terminal
  const clawdUI = (c, x, y, s, o) => capDraw(c, VX.capture((xx, yy) => clawdPx(xx, yy, { ...o, noShadow: true }), 160, 160, 80, 150), x, y, s);

  // ======================================================================================= shot boundaries
  const T0 = A('平时处起对象来'), C1 = P('别的情侣周末约会') - .05, C2 = A('你俩约会'), C3 = AT('凑一块刷GitHub'), C4 = AT('还得互相提醒'),
    C5 = A('别的情侣互查手机'), C6 = A('她查你的岗'), C7 = AT('老实交代'), C8 = A('就连吵架'), C9 = A('别的女生吵架'), C10 = A('她生气不哭也不闹'),
    C11 = AT('点开你正在干活的ClaudeCode'), C12 = AT('手指头往回车键上一搭'), C13 = AT('道不道歉'), C14 = A('干这行的都知道'), C15 = AT('你攒了半年的账号和环境'),
    C16 = A('这种精准拿捏命门的狠活'), TEND = A('听着好像全是在整活对吧');

  // ---------------------------------------------------------------- 1 · 平时处起对象来，省心程度更是拉满。
  {
    const SX = P('省心程度'), MX = P('拉满'), x0 = 101.5, x1 = 106.5, Z = 71.2;
    const hx = t => lerp(x0, x1, seg01(t, T0, C1)), cheerAt = MX - .05;
    shot(T0, C1, { day: DUSK, fog: [30, 90], kicks: [[MX, .8]],
      keys: [K(T0, [x0 + 2.4, G + 2.6, Z + 5.4], [x0 + .4, G + 1.8, Z], 58), K(C1, [x1 + 2.6, G + 2.4, Z + 4.4], [x1 + .6, G + 1.8, Z], 54)],
      act: t => { const x = hx(t), ch = t > cheerAt;
        heige(x, G + 1, Z, { ...em(t, [[0, 'happy'], [SX, 'proud'], [MX, 'excited']]), view: 'q', walk: t, poseR: ch ? 'cheer' : undefined });
        gf(x + 1.15, G + 1, Z + .15, ch ? 'cheer' : 'idle', { dy: ch ? 0 : bounce(t), hop: ch ? seg01(t, cheerAt, cheerAt + .45) : 0, emote: ch ? 'heart' : undefined });
        if (t > MX) burst(t, MX, x + .6, G + 2.6, Z, [255, 211, 78], 22); },
      ui: (c, t) => meterUI(c, t, SX - .3, C1 + .2, sm(seg01(t, SX, MX - .1)), MX - .1) });
    for (let i = 0; i < 4; i++) sfx(T0 + .3 + i * .5, 'step', -15);
    sfx(SX, 'xp_1', -12); sfx(SX + .3, 'xp_2', -12); sfx(SX + .6, 'xp_3', -12); sfx(MX - .1, 'levelup', -9);
  }

  // ---------------------------------------------------------------- 2 · 别的情侣周末约会，排队两小时吃网红店，或者去电影院摸黑睡大觉。（一镜：沿队伍横移，甩进剖开的影院）
  {
    const Q2 = P('排队两小时'), EAT = P('吃网红店'), CIN0 = P('或者去电影院'), SLP = P('摸黑睡大觉');
    // the cinema's front wall opens for this shot (cutaway), and closes again after
    for (let x = 131; x <= 141; x++) for (let y = G + 1; y <= G + 6; y++) { if (x >= 135 && x <= 137 && y <= G + 3) continue; edit(C1, x, y, 52, 0); edit(C2, x, y, 52, 'box'); }
    const day = t => lerp(DUSK, NIGHT * .7, sm(seg01(t, CIN0 - .4, CIN0 + .5)));
    shot(C1, C2, { day, fog: [30, 90], kicks: [[SLP, .5]],
      keys: [K(C1, [111.5, G + 3.2, 55.5], [113.5, G + 2, 47.5], 60), K(EAT, [121.5, G + 3.0, 54.5], [123.5, G + 2, 46.5], 58), K(CIN0 + .55, [136, G + 3.2, 59], [136, G + 2.2, 47], 58),
        K(C2, [136, G + 2.8, 55.6], [136, G + 2.0, 47.5], 52)],
      lights: t => { const f = .55 + .25 * Math.sin(t * 13) * Math.sin(t * 5.3); VX.light(136, G + 3.5, 42.5, [1, .92, .8], 7, f); },
      act: t => {
        for (let i = 0; i < 7; i++) { const x = 112 + i * 1.9, r = ['男生2', '女生2', '男生', '女生', '路人', '女生2', '男生2'][i];
          ppl(x, G + 1, N.QUEUE.z + (i % 2) * .35, r, t > Q2 + i * .12 ? (i % 2 ? 'sad' : 'worry') : 'neutral', t + i, { dy: -Math.abs(Math.sin(t * 2 + i)) * .05 }); }
        if (t > Q2) for (let i = 0; i < 3; i++) { const a = ((t - Q2) * .8 + i / 3) % 1; prop(113 + i * 4.5, G + 3.2 + a * .7, 47.6, 'tear', { k: 1 / 40, a: 1 - a }); }
        // inside the cinema: a couple asleep, zzz rising
        ppl(135.3, G + .65, 47.7, '男生', 'sleep', t, { dy: Math.sin(t * 2) * .03 }); ppl(136.7, G + .6, 47.7, '女生', 'sleep', t, { dy: Math.sin(t * 2 + 1) * .03 });
        if (t > CIN0) for (let i = 0; i < 3; i++) { const a = ((t - CIN0) * .7 + i / 3) % 1; prop(136 + (i - 1) * .9 + Math.sin(a * 6) * .15, G + 2.9 + a * 1.1, 47.6, 'zzz', { k: 1 / 20, a: 1 - a }); }
      },
      ui: (c, t) => { queueTimer(c, t, C1 + .2, CIN0 + .2, EAT + .1);
        if (t > CIN0 + .3) { const a = sm(seg01(t, CIN0 + .3, CIN0 + .8)); const g = c.createRadialGradient(960, 520, 260, 960, 520, 1000); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(4,2,8,${.6 * a})`); c.fillStyle = g; c.fillRect(0, 0, 1920, 1080); } } });
    sfx(C1 + .3, 'villager', -13); sfx(Q2, 'tick', -12); sfx(Q2 + .4, 'tick', -12); sfx(EAT + .1, 'ding', -11); sfx(CIN0 + .1, 'whoosh', -10); sfx(SLP, 'pop', -13); sfx(SLP + .4, 'pop', -14);
  }

  // ---------------------------------------------------------------- 3 · 你俩约会，一人背台电脑找个咖啡馆一坐
  const TBL = { x: 136.5, z: 61.45 }, SEATZ = 60.35, SY = G + 1.1;   // bar stools: heads clear the table
  const laptops = () => { prop(TBL.x - .42, G + 2.01, TBL.z, 'laptop', { k: 1 / 74 }); prop(TBL.x + .42, G + 2.01, TBL.z, 'laptop', { k: 1 / 74 }); prop(TBL.x, G + 2.01, TBL.z + .35, 'cup', { k: 1 / 80 }); };
  {
    const BAGS = P('一人背台电脑'), SIT = P('找个咖啡馆一坐') + .65, WALK0 = C2 + .15;
    const hxA = t => lerp(141.6, 135.75, sm(seg01(t, WALK0, SIT))), gxA = t => lerp(143.0, 137.25, sm(seg01(t, WALK0 + .15, SIT)));
    shot(C2, C3, { day: DUSK, fog: [30, 90], kicks: [[SIT, .6]],
      keys: [K(C2, [140.2, G + 2.9, 67.4], [140.4, G + 1.8, 60.5], 56), K(SIT, [137.2, G + 2.7, 66.4], [136.6, G + 1.8, 60.5], 54), K(C3, [136.9, G + 2.6, 65.9], [136.5, G + 1.8, 60.5], 52)],
      act: t => { const sat = t > SIT, hx = hxA(t), gx = gxA(t);
        heige(hx, sat ? SY : G + 1, SEATZ, { ...em(t, [[0, 'happy'], [SIT, 'cool']]), view: sat ? 'front' : 'q', flip: !sat, walk: sat ? undefined : t });
        gf(gx, sat ? SY : G + 1, SEATZ + .05, 'idle', { dy: sat ? 0 : bounce(t, true, 9), flip: !sat });
        if (!sat) { if (t > BAGS - .2) { prop(hx + .25, G + 1.55, SEATZ + .3, 'laptop', { k: 1 / 46 }); prop(gx - .25, G + 1.5, SEATZ + .35, 'laptop', { k: 1 / 46 }); } }
        else laptops();
        if (t > BAGS - .2 && t < BAGS + 1) label(hx + .7, G + 2.9, SEATZ, '一人一台', .3, '#FFD34E', t, BAGS - .2, BAGS + 1.1); },
      ui: (c, t) => tagUI(c, '咖啡馆', fadeIO(t, C2 + .3, C3 + .2, .25)) });
    for (let i = 0; i < 5; i++) sfx(WALK0 + .1 + i * .45, 'step_wood', -14);
    sfx(BAGS, 'pickup', -12); sfx(SIT, 'place', -9); sfx(SIT + .15, 'place', -10); sfx(SIT + .4, 'chime', -14);
  }

  // ---------------------------------------------------------------- 4 · 凑一块刷 GitHub，看到好用的开源项目跟捡了钱一样
  {
    const GH = P('凑一块刷GitHub'), GOOD = P('看到好用的开源项目'), MONEY = P('跟捡了钱一样');
    shot(C3, C4, { day: DUSK, fog: [30, 90], kicks: [[MONEY, 1.0]],
      keys: [K(C3, [136.0, G + 2.7, 66.4], [135.4, G + 1.9, 60.6], 56), K(MONEY, [136.1, G + 2.6, 65.6], [135.5, G + 1.95, 60.6], 52), K(C4, [136.1, G + 2.6, 65.4], [135.5, G + 1.95, 60.6], 50)],
      act: t => { const lean = sm(seg01(t, C3, GH + .5)), rich = t > MONEY;
        heige(lerp(135.75, 136.0, lean), SY, SEATZ, { ...em(t, [[0, 'happy'], [GOOD, 'surprised'], [MONEY, 'starstruck']]), view: 'front', poseR: rich ? 'cheer' : undefined });
        gf(lerp(137.25, 137.0, lean), SY, SEATZ + .05, rich ? 'cheer' : 'idle', { hop: rich ? seg01(t, MONEY, MONEY + .5) : 0, emote: rich ? 'spark' : undefined });
        laptops();
        coinsUp(t, MONEY, TBL.x, G + 2.2, TBL.z - .4, 14); coinsUp(t, MONEY + .35, TBL.x, G + 2.2, TBL.z - .4, 10); },
      ui: (c, t) => { feedUI(c, t, GH - .1, C4 + .2, MONEY - .05); if (t > MONEY) slam(c, t, MONEY, C4 + .1, '捡到钱了', '#FFD34E', 110, 180); } });
    sfx(GH, 'page', -11); for (let i = 0; i < 5; i++) sfx(GH + .5 + i * .45, 'click', -15);
    sfx(MONEY, 'coin', -8); sfx(MONEY + .15, 'coin', -10); sfx(MONEY + .35, 'coin', -9); sfx(MONEY + .55, 'coin', -11); sfx(MONEY + .1, 'xp_4', -12);
  }

  // ---------------------------------------------------------------- 5 · 还得互相提醒：快快快，给人家点个 Star，别白嫖。
  {
    const KKK = P('快快快'), STAR = P('给人家点个Star'), BAI = P('别白嫖'), P1 = STAR + .55, P2 = BAI + .25;
    shot(C4, C5, { day: DUSK, fog: [30, 90], kicks: [[P1, .6], [P2, .6]],
      keys: [K(C4, [135.4, G + 2.6, 65.6], [135.6, G + 2.0, 60.6], 54), K(C5, [135.7, G + 2.5, 64.8], [135.8, G + 2.05, 60.6], 50)],
      act: t => {
        heige(136.0, SY, SEATZ, { ...em(t, [[0, 'happy'], [KKK, 'surprised'], [P2, 'proud']]), view: 'front', poseR: t > P2 - .1 && t < P2 + .5 ? 'point' : undefined });
        gf(137.0, SY, SEATZ + .05, t > KKK ? 'point' : 'idle', { flip: true, hop: t > P1 && t < P1 + .5 ? seg01(t, P1, P1 + .5) : 0, dy: t > KKK && t < STAR ? bounce(t, true, 14) : 0 });
        laptops();
        bubble(137.0, SY + 1.6, SEATZ, '快快快\n给人家点个 Star', t, KKK - .05, BAI - .1);
        bubble(136.0, SY + 1.7, SEATZ, '别白嫖！', t, BAI - .05, C5 + .1);
        for (const p of [P1, P2]) if (t > p && t < p + 1) for (let i = 0; i < 6; i++) { const b = t - p; prop(TBL.x + Math.cos(i * 1.05) * b * 1.2, G + 2.2 + b * 1.3 - b * b * .8, TBL.z + .2, 'star', { k: 1 / 70, a: 1 - b }); } },
      ui: (c, t) => starUI(c, t, C4 + .2, C5 + .2, [P1, P2]) });
    sfx(KKK, 'chat', -11); sfx(P1, 'click', -8); sfx(P1 + .05, 'xp', -10); sfx(P2, 'click', -8); sfx(P2 + .05, 'xp_2', -10);
  }

  // ---------------------------------------------------------------- 6 · 别的情侣互查手机，翻的是微信聊天记录、打车账单、淘宝订单。
  {
    const FAN = P('翻的是'), PG = [[P('微信聊天记录'), '聊天记录', 'chat'], [P('打车账单'), '打车账单', 'taxi'], [P('淘宝订单'), '购物订单', 'shop']];
    const BX = 115.6, BZ = 70.6;
    shot(C5, C6, { day: DUSK, fog: [30, 90], kicks: PG.map(([p]) => [p, .5]),
      keys: [K(C5, [BX - 1.2, G + 2.8, BZ + 6.4], [BX + 1.6, G + 1.9, BZ], 58), K(C6, [BX + .4, G + 2.5, BZ + 4.8], [BX + 1.6, G + 2.0, BZ], 52)],
      act: t => { const grab = t > FAN - .3;
        ppl(BX, G + 1, BZ + .2, '男生', t > PG[2][0] ? 'shock' : grab ? 'worry' : 'neutral', t, { dy: grab ? Math.sin(t * 20) * .02 : 0 });
        ppl(BX + 1.3, G + 1, BZ, '女生', grab ? 'angry' : 'talk', t);
        prop(grab ? BX + 1.0 : BX + .35, G + 1.75 + (grab ? Math.sin(t * 6) * .03 : 0), BZ + .5, 'phone', { k: 1 / 52 });
        for (const [p] of PG) if (t > p && t < p + .8) prop(BX - .1, G + 2.4 + (t - p) * .4, BZ + .4, 'tear', { k: 1 / 40, a: 1 - (t - p) / .8 }); },
      ui: (c, t) => phoneFlip(c, t, FAN - .4, C6 + .2, PG.map(([p, ti, k]) => [p, ti, k])) });
    sfx(C5 + .3, 'villager', -13); sfx(FAN - .3, 'pickup', -11); PG.forEach(([p]) => sfx(p, 'page', -9));
  }

  // ---------------------------------------------------------------- 7 · 她查你的岗，直接点开你的 GitHub 看提交记录
  const GF_PC = { x: 82.5, z: 56.8 }, HG_PC = { x: 84.4, z: 57.6 };
  // the sofa steps out while the camera stands where it was (PC close-ups), and comes back after
  for (const [a, b] of [[C6, C8], [C10, C14]]) for (let x = 81; x <= 86; x++) { for (const [y, z] of [[G + 1, 61], [G + 1, 60], [G + 2, 60]]) { edit(a, x, y, z, 0); edit(b, x, y, z, 'woolRose'); } }
  const gridAt = (c, t, t0, t1, emptyAt) => { c.save(); c.translate(1010, -6); c.scale(.56, .56); commitGrid(c, t, t0, t1, 20, 23, emptyAt); c.restore(); };
  {
    const CHK = P('她查你的岗'), OPEN = P('直接点开你的GitHub'), REC = P('看提交记录');
    shot(C6, C7, { day: DUSK, fog: [30, 90], kicks: [[OPEN, .5]],
      keys: [K(C6, [82.6, G + 2.7, 62.6], [82.4, G + 1.9, 57.2], 56), K(OPEN, [83.0, G + 2.6, 61.8], [82.9, G + 1.95, 57.1], 54), K(C7, [83.2, G + 2.5, 61.3], [83.1, G + 2.0, 57.1], 51)],
      act: t => { const k = sm(seg01(t, C6 + .1, OPEN - .1));
        gf(lerp(80.2, GF_PC.x, k), G + 1 - (t > OPEN ? .1 : 0), lerp(59.4, GF_PC.z, k), t > OPEN ? 'point' : 'angry', { dy: k > 0 && k < 1 ? bounce(t, true, 10) : 0, flip: true, emote: t > CHK && t < OPEN ? '!' : undefined });
        heige(HG_PC.x, G + 1, HG_PC.z, { ...em(t, [[0, 'neutral'], [CHK, 'surprised'], [REC, 'nervous']]), view: 'q' }); },
      ui: (c, t) => gridAt(c, t, REC - .1, C8 + .3, 1e9) });
    sfx(CHK, 'step_wood', -13); sfx(CHK + .35, 'step_wood', -13); sfx(OPEN, 'click', -8); sfx(REC - .1, 'chest', -11);
  }

  // ---------------------------------------------------------------- 8 · 老实交代，昨晚八点到十一点，你一行代码都没 Commit，干嘛去了？（审讯灯）
  {
    const TELL = P('老实交代'), EIGHT = P('昨晚八点到十一点'), NOC = P('你一行代码都没Commit'), WHAT = P('干嘛去了');
    shot(C7, C8, { day: t => lerp(DUSK, NIGHT * .6, sm(seg01(t, C7, C7 + .5))), fog: [30, 90], kicks: [[TELL, .9], [NOC, .7]],
      keys: [K(C7, [84.0, G + 2.6, 61.8], [83.5, G + 2.0, 57.3], 54), K(C8, [84.1, G + 2.45, 60.9], [83.6, G + 2.05, 57.4], 48)],
      lights: t => { const f = t > TELL ? .85 : .3; VX.light(HG_PC.x + .2, G + 3.6, HG_PC.z + .6, [1, .97, .9], 3.6, f); },
      act: t => {
        heige(HG_PC.x, G + 1, HG_PC.z, { ...em(t, [[0, 'nervous'], [EIGHT, 'scared'], [WHAT, 'nervous']]), view: 'front', emote: 'sweat', poseR: t > NOC ? 'scratch' : undefined }, { dy: Math.sin(t * 22) * .012 });
        gf(GF_PC.x + .2, G + .9, GF_PC.z + .2, t > TELL ? 'point' : 'angry', { flip: true, emote: t > NOC ? 'anger' : undefined });
        bubble(GF_PC.x + .2, G + 2.5, GF_PC.z + .2, t < EIGHT - .1 ? '老实交代！' : '昨晚八点到十一点\n干嘛去了？', t, TELL - .05, C8 + .1);
        if (t > NOC) for (let i = 0; i < 2; i++) { const a = ((t - NOC) * 1.3 + i * .5) % 1; prop(HG_PC.x - .25 + i * .5, G + 2.6 - a * .8, HG_PC.z + .3, 'tear', { k: 1 / 36, a: 1 - a }); } },
      ui: (c, t) => { const p = VX.project(HG_PC.x, G + 2.2, HG_PC.z, 6); spotUI(c, p.x, p.y, sm(seg01(t, TELL - .1, TELL + .25)));
        gridAt(c, t, C6 - 1, C8 + .3, EIGHT + .5); } });
    sfx(TELL, 'anvil', -10); sfx(TELL + .05, 'zap', -14); sfx(EIGHT + .5, 'alarm', -14); sfx(NOC, 'thud', -9); sfx(WHAT, 'hit', -10);
  }

  // ---------------------------------------------------------------- 9 · 就连吵架，她的招数都比别人狠得多。
  const ARG = { gf: { x: 81.4, z: 62.8 }, hg: { x: 85.2, z: 62.8 } };
  {
    const QUAR = P('就连吵架'), MOVES = P('她的招数'), HARD = P('狠得多');
    shot(C8, C9, { day: t => lerp(DUSK, NIGHT * .55, sm(seg01(t, C8, QUAR + .9))), fog: [30, 90], kicks: [[MOVES, 1.3]],
      keys: [K(C8, [83.3, G + 5.6, 75.5], [83.3, G + 2.2, 61], 58), K(MOVES, [83.3, G + 3.9, 70.0], [83.3, G + 1.9, 62], 56), K(C9, [83.3, G + 3.3, 68.4], [83.3, G + 1.9, 62.2], 54)],
      lights: t => { if (t > MOVES && t < MOVES + .25) VX.light(83, G + 9, 66, [1, 1, 1], 30, 2); },
      act: t => {
        gf(ARG.gf.x, G + 1, ARG.gf.z, 'angry', { emote: 'anger', dy: t > QUAR ? bounce(t, true, 6) * .6 : 0 });
        heige(ARG.hg.x, G + 1, ARG.hg.z, { ...em(t, [[0, 'nervous'], [MOVES, 'scared']]), view: 'q', flip: true }, { dy: t > MOVES ? Math.sin(t * 30) * .015 : 0 });
        if (t > MOVES) burst(t, MOVES, ARG.gf.x, G + 2.4, ARG.gf.z, [232, 58, 68], 20); },
      ui: (c, t) => { cold(c, t, C8 + .2); if (t > QUAR) bossBar(c, t, '吵架模式', sm(seg01(t, QUAR, QUAR + 1.2)));
        if (t > HARD) slam(c, t, HARD, C9 + .2, '狠', '#FF6A5A', 200, 420); } });
    flash(MOVES, '255,255,255', .5); sfx(QUAR, 'roar', -14); sfx(MOVES, 'boom', -8); sfx(HARD, 'anvil', -10);
  }

  // ---------------------------------------------------------------- 10 · 别的女生吵架，翻来覆去就是那句「你根本就不懂我」，说完摔门就走。
  {
    const FAN2 = P('翻来覆去'), DONT = P('你根本就不懂我'), GO = P('说完摔门就走'), SLAM = P('摔门');
    // a villager cottage put up for this shot only: cream front wall (z = 66) with a door gap at x 113, a rose roof lip
    const HUT = [];
    for (let x = 109; x <= 117; x++) for (let y = G + 1; y <= G + 3; y++) if (!(x === 113 && y <= G + 2)) HUT.push([x, y, 66, 'woolCream']);
    for (let x = 108; x <= 118; x++) HUT.push([x, G + 4, 66, 'woolRose'], [x, G + 4, 65, 'woolRose']);
    for (const z of [62, 63, 64, 65]) for (let y = G + 1; y <= G + 3; y++) HUT.push([109, y, z, 'woolCream'], [117, y, z, 'woolCream']);
    HUT.push([111, G + 2, 66, 'offlamp'], [115, G + 2, 66, 'offlamp']);
    for (const [x, y, z, nm] of HUT) { edit(C9, x, y, z, nm); edit(C10, x, y, z, 0); }
    const DOOR_OPEN = [[114, G + 1, 67], [114, G + 2, 67]], DOOR_SHUT = [[113, G + 1, 66], [113, G + 2, 66]];
    for (const [x, y, z] of DOOR_OPEN) { edit(C9, x, y, z, 'plankSoft'); edit(SLAM, x, y, z, 0); }
    for (const [x, y, z] of DOOR_SHUT) { edit(SLAM, x, y, z, 'plankSoft'); edit(C10, x, y, z, 0); }
    const GZ0 = 67.9, walk = t => sm(seg01(t, GO - .15, SLAM - .08));
    shot(C9, C10, { day: NIGHT * .8, fog: [30, 90], kicks: [[SLAM, 1.5]],
      keys: [K(C9, [111.6, G + 3.4, 78.0], [112.8, G + 2.0, 67.6], 58), K(GO, [112.4, G + 3.0, 75.6], [113.0, G + 2.0, 67.4], 56), K(C10, [112.8, G + 2.8, 74.6], [113.2, G + 2.1, 67.0], 54)],
      act: t => { const w = walk(t);
        ppl(113.5, G + 1, lerp(GZ0, 64.4, w), '女生', t < FAN2 ? 'angry' : w > 0 ? 'angry' : 'shout', t, { dy: t > FAN2 && t < GO ? -Math.abs(Math.sin(t * 9)) * .12 : 0 });
        ppl(111.7, G + 1, 69.2, '男生', t > SLAM ? 'sad' : t > DONT ? 'shock' : 'worry', t);
        bubble(113.5, G + 2.4, GZ0, '你不懂我！', t, FAN2 - .05, DONT - .25);
        bubble(113.5, G + 2.4, GZ0, '你根本就不懂我', t, DONT - .2, GO + .05);
        if (t > SLAM) { burst(t, SLAM, 113.5, G + 1.4, 66.9, [200, 190, 170], 26); burst(t, SLAM + .05, 113.5, G + 2.6, 66.9, [200, 190, 170], 14); }
        if (t > SLAM + .1 && t < C10) prop(111.3, G + 2.6 + (t - SLAM) * .2, 69.4, 'tear', { k: 1 / 38, a: .9 }); },
      ui: (c, t) => { if (t > SLAM) pow(c, t, SLAM, '砰', 960, 330); } });
    sfx(FAN2, 'villager', -12); sfx(DONT - .2, 'chat', -12); sfx(GO, 'step', -12); sfx(GO + .25, 'step', -12); sfx(SLAM, 'door', -7); sfx(SLAM + .02, 'thud', -8);
  }

  // ---------------------------------------------------------------- 11 · 她生气不哭也不闹，直接走到你电脑前
  {
    const NOCRY = P('她生气不哭也不闹'), WALKTO = P('直接走到你电脑前'), ARR = WALKTO + .7;
    const path = t => { const k = sm(seg01(t, NOCRY + .3, ARR)); return [lerp(80.4, GF_PC.x, k), lerp(60.4, GF_PC.z, k)]; };
    shot(C10, C11, { day: NIGHT * .6, fog: [30, 90], kicks: [[ARR, .7]],
      keys: [K(C10, [82.4, G + 2.6, 62.8], [81.2, G + 1.9, 58.2], 56), K(ARR, [83.2, G + 2.6, 61.8], [82.8, G + 1.95, 57.1], 54), K(C11, [83.3, G + 2.5, 61.4], [82.9, G + 2.0, 57.1], 52)],
      act: t => { const [x, z] = path(t), moving = t > NOCRY + .5 && t < ARR;
        gf(x, G + 1, z, 'angry', { dy: moving ? bounce(t, true, 11) : 0, emote: t > NOCRY ? 'anger' : undefined, flip: t > ARR });
        heige(HG_PC.x, G + 1, HG_PC.z, { ...em(t, [[0, 'nervous'], [WALKTO, 'scared']]), view: 'q', flip: true }, { dy: t > WALKTO ? Math.sin(t * 26) * .012 : 0 });
        clawd(84.15, G + 2, 55.5, { ...feel('happy', t) }, { k: 1 / 130, noShadow: true }); },
      ui: (c, t) => { cold(c, t, C10); } });
    for (let i = 0; i < 5; i++) sfx(NOCRY + .35 + i * .4, 'step_wood', -11); sfx(ARR, 'thud', -10);
  }

  // ---------------------------------------------------------------- 12 · 点开你正在干活的 Claude Code，啪啪敲下「我是中国人」五个字
  {
    const OPN = P('点开你正在干活的ClaudeCode'), PAPA = P('啪啪敲下'), CN = P('我是中国人'), FIVE = P('五个字');
    const CODE = ['读取 data/clean.py', '整理 214 行数据', '跑测试 · 38 项通过', '重构 parse_rows()', '写入缓存', '修复 3 处报错', '生成报告 report.md', '跑测试 · 41 项通过', '提交前检查'];
    const LINES = CODE.map((s, i) => [OPN + .35 + i * .22, '  ' + s, i % 3 === 2 ? '#FFD43B' : '#C8C0E0', 0]).filter(l => l[0] < PAPA - .1);
    const TYPE0 = PAPA + .25, TYPED = [TYPE0 - 2 / 3, '> 我是中国人', '#FFD43B', 3];
    shot(C11, C12, { day: NIGHT * .6, fog: [30, 90], kicks: [[PAPA, .8], [PAPA + .26, .8]],
      keys: [K(C11, [83.4, G + 2.6, 61.4], [83.0, G + 2.0, 57.0], 54), K(C12, [83.3, G + 2.5, 60.8], [83.0, G + 2.0, 57.0], 50)],
      act: t => { gf(GF_PC.x, G + .9, GF_PC.z, 'point', { flip: true, emote: 'anger' }); heige(HG_PC.x, G + 1, HG_PC.z, { ...em(t, [[0, 'scared']]), view: 'q', flip: true }); },
      ui: (c, t) => { const sh = LINES.filter(l => l[0] <= t).slice(-5), lines = t > TYPED[0] ? [...sh.slice(-4), TYPED] : sh;
        termWin(c, t, OPN - .1, C12 + .2, 'Claude Code', lines, { x: 330, y: 100, w: 1260, h: 720, fs: 46 });
        const a = fadeIO(t, OPN - .1, C12 + .2, .2);
        if (a > 0) { c.save(); c.globalAlpha = a; const typing = t > CN; clawdUI(c, 1400, 800 + (typing ? 0 : -Math.abs(Math.sin(t * 9)) * 12), 5, { ...em(t, [[0, 'happy'], [CN + .2, 'scared']]), emote: typing ? 'sweat' : undefined }); c.restore(); }
        pow(c, t, PAPA, '啪', 620, 330); pow(c, t, PAPA + .26, '啪', 1280, 300);
        if (t > FIVE) slam(c, t, FIVE, C12 + .1, '五个字', '#FF6A5A', 110, 640); } });
    sfx(OPN, 'click', -8); sfx(OPN + .1, 'chest', -12); LINES.forEach(l => sfx(l[0], 'type', -16));
    sfx(PAPA, 'slap', -8); sfx(PAPA + .26, 'slap', -8);
    for (let i = 0; i < 5; i++) sfx(TYPE0 + .33 + i / 3, 'type', -9);
  }

  // ---------------------------------------------------------------- 13 · 手指头往回车键上一搭，转头冷冷看着你
  {
    const FING = P('手指头往回车键上一搭'), TURN = P('转头冷冷看着你'), KEY1 = TURN - .25;
    shot(C12, C13, { day: NIGHT * .5, fog: [30, 90], kicks: [[TURN, .9]],
      keys: [K(C12, [83.4, G + 2.5, 60.4], [82.5, G + 2.1, 56.6], 54), K(KEY1, [83.3, G + 2.4, 60.0], [82.5, G + 2.1, 56.6], 52), K(TURN, [82.8, G + 2.2, 59.6], [82.5, G + 2.05, 56.7], 50), K(C13, [82.7, G + 2.15, 59.8], [82.5, G + 2.3, 56.7], 40)],
      act: t => { gf(GF_PC.x, G + .9, GF_PC.z, t > TURN ? 'angry' : 'point', { flip: t < TURN, emote: t > TURN ? 'anger' : undefined }); },
      ui: (c, t) => { enterKeyUI(c, t, C12 - .05, KEY1, FING + .55); if (t > KEY1) cold(c, t, KEY1); } });
    sfx(FING + .55, 'click', -12); [0, .5, 1].forEach(d => sfx(FING + .9 + d, 'tick', -12)); sfx(TURN, 'hit', -10); sfx(TURN + .05, 'sizzle', -14);
  }

  // ---------------------------------------------------------------- 14 · 道不道歉？不道歉我现在就按下去，让你号都没了。
  {
    const SORRY = P('道不道歉'), PRESS = P('不道歉我现在就按下去'), GONE = P('让你号都没了');
    const hp = t => t < PRESS ? 1 : t < GONE ? lerp(1, .32, sm(seg01(t, PRESS, PRESS + 1.1))) : lerp(.32, .06, sm(seg01(t, GONE, GONE + .35)));
    shot(C13, C14, { day: NIGHT * .5, fog: [30, 90], kicks: [[SORRY, .6], [GONE, 1.3]],
      keys: [K(C13, [83.6, G + 2.9, 62.4], [83.4, G + 1.85, 57.2], 56), K(GONE, [83.6, G + 2.8, 61.6], [83.4, G + 1.85, 57.2], 52), K(C14, [83.6, G + 2.75, 61.3], [83.4, G + 1.85, 57.2], 50)],
      act: t => {
        gf(GF_PC.x, G + .9, GF_PC.z, 'point', { flip: true, emote: 'anger', hop: t > GONE && t < GONE + .4 ? seg01(t, GONE, GONE + .4) * .5 : 0 });
        heige(HG_PC.x, G + 1 - (t > PRESS ? .25 : 0), HG_PC.z, { ...em(t, [[0, 'scared'], [GONE, 'cry']]), view: 'q', flip: true, poseR: 'clasp', poseL: 'clasp' }, { dy: Math.sin(t * 28) * .015 });
        clawd(84.15, G + 2, 55.5, { ...feel('scared', t), emote: 'sweat' }, { k: 1 / 130, noShadow: true });
        bubble(GF_PC.x, G + 2.5, GF_PC.z, '道不道歉？', t, SORRY - .05, PRESS - .05);
        bubble(GF_PC.x, G + 2.5, GF_PC.z, '不道歉我就按下去', t, PRESS, C14 + .1); },
      ui: (c, t) => { bossBar(c, t, '你的账号', hp(t)); if (t > GONE) { const k = Math.floor(t * 8) % 2; if (k) { c.fillStyle = 'rgba(200,40,50,.14)'; c.fillRect(0, 0, 1920, 1080); } } } });
    flash(GONE, '232,58,68', .35);
    sfx(SORRY, 'hit', -11); sfx(PRESS, 'anvil_use', -11); sfx(GONE, 'alarm', -9); sfx(GONE + .5, 'alarm', -11);
  }

  // ---------------------------------------------------------------- 15 · 干这行的都知道封号有多狠，这五个字发出去（封号界面）
  {
    const KNOW = P('干这行的都知道'), BAN = P('封号有多狠'), SEND = P('这五个字发出去');
    const ROWS = [['账号', BAN + .1], ['项目环境', BAN + .65], ['半年的对话', SEND + .2]];
    shot(C14, C15, { day: NIGHT * .5, fog: [30, 90], kicks: ROWS.map(([, a]) => [a, .7]),
      keys: [K(C14, [83.6, G + 3.4, 64.5], [83.4, G + 1.9, 57], 56), K(C15, [83.6, G + 3.0, 62.5], [83.4, G + 1.9, 57], 52)],
      act: t => { gf(GF_PC.x, G + .9, GF_PC.z, 'point', { flip: true }); heige(HG_PC.x, G + .75, HG_PC.z, { ...em(t, [[0, 'cry']]), view: 'q', flip: true }); },
      ui: (c, t) => banScreen(c, t, C14 - .05, C15 + .15, ROWS) });
    sfx(C14 + .02, 'glitch', -9); ROWS.forEach(([, a]) => sfx(a, 'break_glass', -10)); sfx(SEND + .7, 'glitch', -12);
  }

  // ---------------------------------------------------------------- 16 · 你攒了半年的账号和环境当场去世（客厅里冒出一块墓碑）
  const TOMB = { x: 83, z: 63 };
  {
    const SAVED = P('你攒了半年的账号和环境'), DIE = P('当场去世'), RISE = SAVED + .15;
    edit(RISE, TOMB.x, G + 1, TOMB.z, 'tomb');
    edit(TEND, TOMB.x, G + 1, TOMB.z, 0);
    shot(C15, C16, { day: NIGHT * .6, fog: [30, 90], kicks: [[RISE, 1.0], [DIE, .8]],
      keys: [K(C15, [84.6, G + 3.0, 72.0], [83.8, G + 2.0, 63.2], 56), K(DIE, [84.4, G + 2.8, 70.2], [83.8, G + 2.0, 63.4], 52), K(C16, [84.3, G + 2.7, 69.8], [83.8, G + 2.0, 63.4], 50)],
      lights: t => VX.light(TOMB.x + .5, G + 3.6, TOMB.z + 1.4, [.9, .88, 1], 4.5, .9),
      act: t => {
        heige(84.75, G + 1 - .38, 64.3, { ...em(t, [[0, 'sad'], [DIE, 'cry']]), view: 'q', flip: true, poseR: 'clasp' }, { dy: Math.sin(t * 3) * .02 });
        if (t > RISE) burst(t, RISE, TOMB.x + .5, G + 1.2, TOMB.z + 1, [190, 180, 170], 26);
        label(TOMB.x + .5, G + 2.55, TOMB.z + .6, '账号 享年半岁', .2, '#F2E6C8', t, RISE + .35);
        if (t > RISE + .3) { for (const dx of [.2, .5, .8]) prop(TOMB.x + dx, G + 1, TOMB.z + 1.15, dx === .5 ? 'candle' : 'rose', { k: 1 / 60 }); }
        if (t > DIE - .2) for (let i = 0; i < 2; i++) { const a = ((t - DIE) * 1.5 + i * .5 + 1) % 1; prop(84.6 + i * .3, G + 1.9 - a * .7, 64.6, 'tear', { k: 1 / 34, a: 1 - a }); } },
      ui: (c, t) => {} });
    flash(DIE, '255,255,255', .3);
    sfx(RISE, 'break_stone', -8); sfx(RISE + .18, 'place', -9); sfx(RISE + .4, 'sad', -11); sfx(DIE, 'chime', -10);
  }

  // ---------------------------------------------------------------- 17 · 这种精准拿捏命门的狠活，一般女生真干不出来。
  {
    const PRE = P('精准拿捏'), NORM = P('一般女生真干不出来');
    shot(C16, TEND, { day: NIGHT * .6, fog: [30, 90], kicks: [[PRE, .7]],
      keys: [K(C16, [81.6, G + 2.7, 68.4], [82.8, G + 1.8, 63.2], 54), K(NORM, [84.4, G + 3.3, 69.6], [83.2, G + 1.8, 63.0], 56), K(TEND, [85.6, G + 4.0, 71.5], [83.4, G + 1.9, 62.6], 58)],
      lights: t => VX.light(TOMB.x + .5, G + 3.6, TOMB.z + 1.4, [.9, .88, 1], 4.5, .7),
      act: t => {
        gf(81.6, G + 1, 63.6, 'point', { hop: t > NORM && t < NORM + .5 ? seg01(t, NORM, NORM + .5) : 0, emote: t > PRE ? 'spark' : undefined });
        heige(84.9, G + .35, 64.3, { ...em(t, [[0, 'ko']]), view: 'front' }, { dy: Math.sin(t * 2) * .02 });
        label(TOMB.x + .5, G + 2.55, TOMB.z + .6, '账号 享年半岁', .2, '#F2E6C8', t, C16 - 1); },
      ui: (c, t) => toast(c, t, PRE - .1, TEND + .1, '进度达成', '精准拿捏', 'star') });
    sfx(PRE - .1, 'toast', -9); sfx(PRE + .2, 'xp', -11); sfx(NORM, 'xp_3', -11); sfx(NORM + .3, 'pop', -12);
  }
})();
