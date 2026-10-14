// pixel/scenes/manong3.js: 「码农这行纯粹是邪门」, third cut, in the look of a pixel book-talk show: a velvet-curtain
// stage under soft spotlights, a banner hall, game-UI cards in gold frames, character cards on sunbursts with name
// tags, a chapter bar along the top and subtitles with the key words in gold. 黑哥 hosts; Clawd plays the coder friend.
// Every shot has a camera (a slow push, a follow, a punch-in on a hit), and every beat hangs on a phrase of the voice.
//   node render.mjs --page=pixel.html --loop=pxManong3 --clip --fps=24 --out=out/video/manong/picture3.mp4
(() => {
  if (!window.MANONG) return;
  const D = MANONG, K = pxGame(D);
  const { at, after, since, R, GOLD, GOLDL, GOLDD, INK, CARD, CREAM, RED, PINK, SKY, vgrad, box, out3, pop, over, kick, ramp, vlen, hg, cl, feelT, emo, icon, typing, walker, sparkle, frame, chip, chipL, stamp, card, spot, curtain, curtainCloth, darkStage, sunburst, hall, pedestal, office, desk, bedroom, serverRoom, examHall, examDesks, bar, barTop, street, npc, hp, cloud, charCard, shot, push, title } = K;

  // 1. the curtain opens on the host: 黑哥 in the spotlight, waving
  shot(null, (lt, t) => {
    curtain(t, 0); spot(160, t, { a: .34 }); hg(160, FLOOR, { ...feelT('happy', t), poseR: 'wave' });
    if (lt > .5) chip('主持 · 黑哥', 160, 50, GOLDL, 6);
    curtainCloth(t, clamp((lt - .1) / .7));
  }, { in: { type: 'cut' }, cam: push(160, 112, 1.25, 1.12) });
  // 2. Clawd's character card: the coder friend, ten years in
  shot('干了整整十年', (lt, t) => charCard(t, lt, (x, y) => cl(x, y, feelT('excited', t)), '码农朋友', ['Clawd 饰', '入行 10 年', '全栈 · 夜班'], ['#5A1420', '#7A1C2A']), { res: [160, 90], in: { type: 'slide', dur: .25 }, cam: push(80, 45, 1.0, 1.06) });
  // 3. in the spotlight, the epiphany; 热门? no: 邪门, on a red sunburst
  shot('前几天他跟我说', (lt, t) => {
    if (!after(t, '纯粹是')) {
      darkStage(t, []); spot(80, t, { w: 46, a: .36 });
      const j = jump(onTwos(t), at('顿悟') ?? 999, (at('顿悟') ?? 999) + .45, 4);
      cl(80, FLOOR, { ...emo(t, [[0, 'neutral'], [at('顿悟'), 'idea'], [at('这个行业哪是'), 'suspicious']]), dy: j.dy, sq: j.sq });
      if (after(t, '顿悟') && !after(t, '这个行业哪是')) { pxFx({ type: 'glow', x: 80, y: 40, r: 40, a: .4 }); sparkle(80, 40, 26, t, 10); }
      if (after(t, '这个行业哪是')) { const k = pop(since(t, '这个行业哪是'), .25); chip('热门？', 124, Math.round(lerp(70, 30, k)), PINK, 7); }
    } else {
      sunburst(t, '#5A0E18', '#8A1828', 80, 55); cl(80, FLOOR, feelT('furious', t));
      stamp('邪门', 124, 26, since(t, '邪门#1'), 9); kick(since(t, '邪门#1'), 3);
    }
  }, { res: [160, 90], in: { type: 'iris', dur: .4 }, cam: (lt, t) => after(t, '纯粹是') ? [80, 45, 1.02 + .3 * Math.max(0, .3 - since(t, '纯粹是'))] : [80, 50, ramp(t, [[at('前几天他跟我说'), 1.0], [at('纯粹是'), 1.2]])] });
  // 4. the host walks out, asks the question, puts the shades on
  shot('有人问哪里', (lt, t) => {
    curtain(t, 1);
    const w = walker(t, [[at('有人问哪里'), 40], [at('有人问哪里') + 1.4, 160]]);
    spot(Math.round(w.x), t);
    hg(w.x, FLOOR, w.moving ? { ...feelT('neutral', t), view: 'side', walk: w.x / 14 } : emo(t, [[0, 'confused'], [at('我给你们盘盘'), 'cool']], after(t, '我给你们盘盘') ? { poseR: 'point' } : { emote: '?', emoteK: 1 }));
    if (after(t, '我给你们盘盘')) chip('来 盘盘', 214, Math.round(lerp(110, 72, pop(since(t, '我给你们盘盘'), .25))), GOLDL, 8);
  }, { in: { type: 'wipe', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('有人问哪里'), 100], [at('有人问哪里') + 1.4, 175]]), 112, ramp(t, [[at('有人问哪里'), 1.15], [at('我给你们盘盘'), 1.15], [at('我给你们盘盘') + .3, 1.35]])] });
  // 5. the hall of three pedestals: 黑哥 walks past them, pointing at each as it rises: strength, learning, stability
  shot('三个维度', (lt, t) => {
    hall(t);
    const P = [['工作强度#1', 'bolt', 80, '工作强度'], ['持续学习#1', 'book', 160, '持续学习'], ['稳定程度#1', 'shield', 240, '稳定程度']];
    frame(96, 6, 128, 18, { fill: '#2A1418' }); pxText('找工作 · 三个维度', 160, 15, { size: 7, color: GOLDL });
    const two = after(t, '能占两样');
    P.forEach(([ph, ic, x, lab], i) => {
      pedestal(x); chip(lab, x, FLOOR - 10, GOLDL, 5.5);
      if (!after(t, ph, -.1)) return;
      const lt2 = since(t, ph) + .1, y = FLOOR - 44 - Math.round(over(lt2 / .5) * 8) + Math.round(Math.sin(t * 3 + i) * 2), dim = two && i === 2;
      if (!dim) { pxFx({ type: 'glow', x, y, r: 28, a: .45 }); sparkle(x, y, 20, t, 6); }
      icon(ic, x, y, 3, dim ? '#5A4A4A' : null);
      if (two) icon(i < 2 ? 'check' : 'cross', x + 20, y - 14, 2);
    });
    const tA = at('工作强度#1'), tB = at('持续学习#1'), tC = at('稳定程度#1'), tD = at('能占两样');
    const w = walker(t, [[tA - .9, 14], [tA - .1, 40], [tB - .8, 40], [tB - .1, 120], [tC - .8, 120], [tC - .1, 200], [tD - .1, 200], [tD + .7, 292]]);
    hg(w.x, FLOOR, w.moving ? { ...feelT('neutral', t), view: 'side', walk: w.x / 14, flip: w.flip } : two ? { ...feelT('smug', t), poseL: 'hip', poseR: 'out' } : { ...feelT('happy', t), view: 'q', poseR: 'point' });
    if (two) chip('能占两样 = 到头', 160, 40, CREAM, 8);
  }, { in: { type: 'iris', dur: .45 }, cam: (lt, t) => { const tA = at('工作强度#1'), tD = at('能占两样'); return [ramp(t, [[tA - .9, 160], [tA - .1, 64], [at('持续学习#1') - .1, 144], [at('稳定程度#1') - .1, 224], [tD, 224], [tD + .6, 160]]), ramp(t, [[tA - .9, 90], [tA - .1, 108], [tD, 108], [tD + .6, 92]]), ramp(t, [[tA - .9, 1.02], [tA - .1, 1.45], [tD, 1.45], [tD + .6, 1.03]])]; } });
  // 6. the coders hold all three: the icons slam round Clawd, a triangle locks, each turns red as it's named
  shot('但这帮码农', (lt, t) => {
    curtain(t, 1);
    const w = walker(t, [[at('但这帮码农'), 300], [at('但这帮码农') + 1.6, 160]]);
    spot(Math.round(w.x), t, { a: .34 });
    const tri = since(t, '不可能三角'), hits = [at('工作强度极大'), at('天天拼命学'), at('极其不稳定')];
    const pts = [[160, 40], [96, 112], [224, 112]], ics = ['bolt', 'book', 'shield'];
    if (tri >= 0) {
      const k = clamp(tri / .6);
      for (let i = 0; i < 3; i++) { const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % 3], red = hits.every(h => h != null && t >= h); for (let q = 0; q < 2; q++) pline(ax, ay + q, lerp(ax, bx, k), lerp(ay, by, k) + q, red ? RED : GOLDL); }
      ics.forEach((n, i) => { const lt2 = tri - i * .12; if (lt2 < 0) return; const s = over(lt2 / .35), [x, y] = pts[i], red = hits[i] != null && t >= hits[i]; icon(n, x, lerp(-30, y, s), 2, red ? RED : null); if (red) pxFx({ type: 'glow', x, y, r: 22, a: .5, col: '#FF6A6A' }); });
      chip('不可能三角', 160, 22, GOLDL, 9); kick(tri - .5, 2);
    }
    hits.forEach(h => kick(h == null ? -1 : t - h, 2.5));
    const wob = after(t, '极其不稳定') ? Math.round(Math.sin(t * 9) * 3) : 0;
    if (after(t, '工作强度极大') && Math.floor(t * 10) % 3 === 0) for (let i = 0; i < 8; i++) pset(160 + Math.round((hash(i + Math.floor(t * 10)) - .5) * 40), 50 + i * 9, GOLDL);
    cl(w.x + wob, FLOOR, w.moving ? { ...feelT('neutral', t), view: 'side', walk: w.x / 10, flip: true } : emo(t, [[0, 'nervous'], [at('工作强度极大'), 'scared'], [at('天天拼命学'), 'dizzy'], [at('极其不稳定'), 'ko']], { emote: 'sweat', emoteK: 1 }));
  }, { in: { type: 'slide', dur: .3 }, cam: (lt, t) => [ramp(t, [[at('但这帮码农'), 250], [at('但这帮码农') + 1.6, 160]]), ramp(t, [[at('不可能三角'), 118], [at('不可能三角') + .5, 92]]), ramp(t, [[at('但这帮码农'), 1.3], [at('不可能三角'), 1.3], [at('不可能三角') + .5, 1.03], [at('极其不稳定'), 1.08]])] });
  // 7. 既要 又要 还要: three weights drop on Clawd, squashing him flatter each time
  shot('用我朋友的话说', (lt, t) => {
    curtain(t, 1); spot(160, t);
    const W = [['既要', GOLDL], ['又要', SKY], ['还要', PINK]], landed = W.filter(([w]) => after(t, w)).length;
    if (!after(t, '既要')) chip('入行 10 年', 160, 92, CREAM, 8);
    cl(160, FLOOR, { ...emo(t, [[0, 'mischief'], [at('既要'), 'surprised'], [at('还要'), 'ko']]), sq: landed * .1 });
    W.forEach(([w, c], i) => { if (!after(t, w, -.25)) return; const d = ease(clamp((t - at(w) + .25) / .25)), y = Math.round(lerp(-20, FLOOR - 41 + landed - 9 - i * 17, d)); frame(128, y - 8, 64, 16, { fill: '#2A1418' }); pxText(w, 160, y, { size: 7.5, color: c }); kick(since(t, w), 3); });
  }, { in: { type: 'cut' }, cam: (lt, t) => [160, 110, ramp(t, [[at('用我朋友的话说'), 1.1], [at('既要'), 1.35]])] });
  shot('先说第一个', title('一', '工作强度', 'bolt'), { in: { type: 'slide', dur: .3 }, cam: push(160, 88, 1.02, 1.1) });
  // 8. the office time-lapse: days and nights fly across the window, cups pile up, Clawd types on and on
  shot('很多人可能根本无法想象', (lt, t) => {
    office(t, { phase: lt * .5, clockSpin: lt * 30 });
    cl(140, FLOOR - 2, { ...emo(t, [[0, 'scared'], [at('有多变态'), 'dizzy']]), ...typing(t, 14) });
    desk(140, t, { cups: Math.min(20, Math.floor(lt * 4)) });
    if (after(t, '有多变态')) { stamp('变态', 140, 92, since(t, '有多变态'), 9); kick(since(t, '有多变态'), 3); }
  }, { in: { type: 'dissolve', dur: .4 }, cam: push(150, 96, 1.04, 1.25) });
  // 9. the resume in a gold frame: 10 years of work, stamped 15
  shot('哥们儿我干了十年码农', (lt, t) => {
    darkStage(t, [160]);
    const y0 = Math.round(lerp(190, 16, over(lt / .5)));
    frame(76, y0, 168, 126, { title: '简历', fill: CREAM });
    cl(118, y0 + 70, { ...feelT('neutral', t), noShadow: true });
    pxText('码农 · Clawd', 198, y0 + 26, { size: 7, color: INK, stroke: false });
    pxText('工作经验', 198, y0 + 50, { size: 8, color: INK, stroke: false });
    const st = since(t, '十五年'); pxText('10 年', 198, y0 + 74, { size: 12, color: st >= 0 ? '#8C88A6' : INK, stroke: false });
    if (st >= 0) { R(178, y0 + 74, 40, 2, RED); stamp('15 年', 204, y0 + 98, st, 10); kick(st, 3.5); }
  }, { in: { type: 'iris', dur: .4 }, cam: (lt, t) => [ramp(t, [[at('十五年') - .2, 160], [at('十五年'), 196]]), ramp(t, [[at('十五年') - .2, 90], [at('十五年'), 104]]), ramp(t, [[at('哥们儿我干了十年码农'), 1.02], [at('十五年') - .2, 1.08], [at('十五年'), 1.5]])] });
  // 10. where did the 5 years come from? the clock races; "全他妈是加班", Clawd boils over
  shot('多出来的五年', (lt, t) => {
    office(t, { phase: .8, clockSpin: lt * 60 });
    for (let i = 0; i < 3; i++) { const ph = (lt * .8 + i / 3) % 1; if (lt > .3) pxText('+1 年', 40 + Math.sin(ph * 6) * 4, 30 - ph * 30, { size: 6, color: GOLDL }); }
    const mad = after(t, '全他妈是加班');
    cl(140, FLOOR - 2, { ...emo(t, [[0, 'confused'], [at('全他妈是加班'), 'furious']]), ...(mad ? {} : typing(t, 10)) });
    desk(140, t, { cups: 20 });
    if (mad) { stamp('加班', 250, 120, since(t, '全他妈是加班'), 11); kick(since(t, '全他妈是加班'), 4); pxFx({ type: 'tint', col: '#FF2A2A', a: .1 * Math.max(0, 1 - since(t, '全他妈是加班') * 2) }); }
  }, { in: { type: 'cut' }, cam: (lt, t) => [ramp(t, [[at('多出来的五年'), 60], [at('全他妈是加班') - .1, 60], [at('全他妈是加班'), 150]]), ramp(t, [[at('多出来的五年'), 60], [at('全他妈是加班') - .1, 60], [at('全他妈是加班'), 100]]), ramp(t, [[at('多出来的五年'), 1.8], [at('全他妈是加班') - .1, 1.8], [at('全他妈是加班'), 1.15]])] });
  // 11. two cards: other people's quitting time is the end; the coder's is the start of the dread
  shot('别人下班', (lt, t) => {
    hall(t);
    card(20, 24, 136, 110, '别人下班 = 结束', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#E8A06A'], [h, '#8A4A4A']]); pellipse(x + w - 24, y + 22, 9, 9, '#FFF1C9'); npc(x + 20 + Math.floor((lt * 22) % 90), y + h, lt * 2); npc(x + 50 + Math.floor((lt * 16) % 60), y + h, lt * 2 + .4, '#4A2A36'); }, pop(lt, .3));
    const k2 = after(t, '码农下班', -.3) ? pop(since(t, '码农下班') + .3, .3) : 0;
    card(164, 24, 136, 110, '码农下班 = 开始', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#0E0A20'], [h, '#2A1C44']]); cl(x + 50, y + h, { ...emo(t, [[0, 'neutral'], [at('提心吊胆'), 'nervous']]), emote: after(t, '提心吊胆') ? 'sweat' : null, emoteK: 1, noShadow: true, lookX: Math.sin(t * 3) }); box(x + 86, y + h - 20, 22, 14, '#2C4A7A'); R(x + 88, y + h - 18, 18, 10, '#4AA8E0'); }, k2);
  }, { in: { type: 'wipe', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('别人下班'), 88], [at('码农下班') - .2, 88], [at('码农下班') + .3, 232]]), 80, ramp(t, [[at('别人下班'), 1.3], [at('提心吊胆'), 1.3], [at('提心吊胆') + .4, 1.05]])] });
  // 12. home in bed; his soul floats out the window . . . and back to the server room
  shot('身体是回家了', (lt, t) => {
    const soul = since(t, '魂还挂在');
    if (soul < .3) { bedroom(t); cl(226, FLOOR - 24, { ...feelT('sleepy', t), emote: 'zzz', emoteK: 1 }); if (soul > -1) { const k = clamp((soul + 1) / 1.2); icon('ghost', lerp(226, 74, k), lerp(FLOOR - 54, 46, k) + Math.sin(lt * 6) * 2, 2); pxFx({ type: 'glow', x: lerp(226, 74, k), y: lerp(FLOOR - 54, 46, k), r: 22, a: .3, col: '#CFE4FF' }); } }
    else { serverRoom(t, Math.floor((soul - .3) * 40)); const k = clamp((soul - .3) / 1.4), gx = lerp(-10, 160, out3(k)); icon('ghost', gx, 80 + Math.sin(lt * 5) * 3, 3); pxFx({ type: 'glow', x: gx, y: 80, r: 30, a: .3, col: '#CFE4FF' }); if (k >= 1) chip('魂挂在服务器上', 160, 128, SKY, 8); }
  }, { in: { type: 'dissolve', dur: .4 }, cam: (lt, t) => after(t, '魂还挂在', .3) ? [160, 90, 1.08] : [ramp(t, [[at('身体是回家了'), 210], [at('魂还挂在') - 1, 210], [at('魂还挂在') + .2, 120]]), 96, 1.3] });
  // 13. midnight: the phone buzzes, a Bug crawls out and grows, Clawd jumps out of bed
  shot('你永远不知道', (lt, t) => {
    const ring = after(t, '诡异的', -.4), bugT = since(t, '诡异的');
    bedroom(t, { phone: ring });
    const j = jump(onTwos(t), at('诡异的') ?? 999, (at('诡异的') ?? 999) + .5, 6);
    const hop = clamp(bugT / .5); cl(lerp(226, 130, hop), Math.round(lerp(FLOOR - 24, FLOOR, hop) - Math.sin(hop * Math.PI) * 20), { ...emo(t, [[0, 'sleepy'], [at('诡异的'), 'scared'], [at('惊喜'), 'surprised']]), dy: j.dy, sq: j.sq });
    if (bugT >= 0) { const bk = clamp(bugT / 1.6), bx = 284 - bk * 60, by = FLOOR - 40 - bk * 26; icon('bug', bx, by, 1 + Math.floor(bk * 4)); pxFx({ type: 'glow', x: bx, y: by, r: 20 + bk * 30, a: .35, col: '#FF6A6A' }); if (Math.floor(t * 4) % 2) pxFx({ type: 'tint', col: '#FF2A2A', a: .06 }); }
    if (after(t, '惊喜')) { stamp('惊喜', 236, 30, since(t, '惊喜'), 9); kick(since(t, '惊喜'), 3); }
    kick(bugT, 3);
  }, { in: { type: 'iris', dur: .5, x: 1400, y: 760 }, cam: (lt, t) => [ramp(t, [[at('你永远不知道'), 250], [at('诡异的'), 250], [at('诡异的') + .4, 190]]), 100, ramp(t, [[at('你永远不知道'), 1.5], [at('诡异的'), 1.5], [at('诡异的') + .4, 1.06]])] });
  // 14. 崩溃边缘: a close-up on a purple sunburst, cracks running across the screen
  shot('精神状态', (lt, t) => {
    sunburst(t, '#2A1430', '#3A1E44', 80, 40); cl(80, FLOOR, feelT('ko', t));
    const c = clamp(lt / .5); for (let i = 0; i < 7; i++) { const a = i * .95 + .3; pline(80, 36, 80 + Math.cos(a) * 110 * c, 36 + Math.sin(a) * 70 * c, CREAM); }
    stamp('崩溃边缘', 80, 18, lt - .4, 6.5); kick(lt - .4, 3);
  }, { res: [160, 90], in: { type: 'glitch', dur: .3 }, cam: push(80, 48, 1.15, 1.02) });
  shot('再说第二个', title('二', '持续学习', 'book'), { in: { type: 'slide', dur: .3 }, cam: push(160, 88, 1.02, 1.1) });
  // 15. "lifelong learning" in one card; then it splits: a craftsman learns to do less, the coder to keep working
  shot('按理说', (lt, t) => {
    hall(t);
    const split = since(t, '但别人学门手艺');
    if (split < 0) {
      card(100, 24, 120, 110, '终身学习', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#3A2418'], [h, '#5A3A2C']]); icon('book', x + w / 2, y + 36 + Math.sin(t * 2) * 2, 3); if (after(t, '终身学习')) icon('check', x + w / 2 + 24, y + 18, 2); }, pop(lt, .3));
      pxFx({ type: 'glow', x: 160, y: 70, r: 70, a: .25 });
      hg(lerp(-20, 64, out3(lt / .8)), FLOOR, lt < .8 ? { ...feelT('neutral', t), view: 'side', walk: lt * 4 } : { ...feelT('happy', t), poseR: 'point', view: 'q' });
    } else {
      card(20, 24, 136, 110, '学手艺 = 少干活', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#E8A06A'], [h, '#C08A5C']]); R(x + 16, y + 30, 2, h - 30, '#5A3A2C'); R(x + w - 18, y + 30, 2, h - 30, '#5A3A2C'); pline(x + 18, y + 44, x + w - 18, y + 48 + Math.round(Math.sin(t * 2) * 2), CREAM); npc(x + w / 2, y + 48 + Math.round(Math.sin(t * 2) * 2), null, '#5A3A2C'); }, pop(split, .3));
      const k2 = after(t, '码农学门手艺', -.3) ? pop(since(t, '码农学门手艺') + .3, .3) : 0;
      card(164, 24, 136, 110, '码农学 = 继续干', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#0E0A20'], [h, '#2A1C44']]); cl(x + w / 2, y + h, { ...emo(t, [[0, 'neutral'], [at('继续干活'), 'angry']]), ...typing(t, 14), noShadow: true }); box(x + w / 2 - 22, y + h - 12, 44, 5, '#5A3A2C'); }, k2);
    }
  }, { in: { type: 'wipe', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('但别人学门手艺') - .1, 140], [at('但别人学门手艺') + .2, 88], [at('码农学门手艺') - .1, 88], [at('码农学门手艺') + .3, 232]]), 80, ramp(t, [[at('按理说'), 1.05], [at('但别人学门手艺') - .1, 1.12], [at('但别人学门手艺') + .2, 1.3], [at('继续干活'), 1.3], [at('继续干活') + .5, 1.05]])] });
  // 16. a game life bar: Clawd's life drains away . . . learning, for a coder, is life support
  shot('在别的行业学习叫提升', (lt, t) => {
    curtain(t, 1); spot(160, t);
    const life = since(t, '叫续命'), k = life >= 0 ? clamp(.08 + life / .8) : clamp(1 - lt * .2, .08, 1);
    const j = life >= 0 ? jump(onTwos(t), at('叫续命') + .3, at('叫续命') + .8, 6) : { dy: 0, sq: 0 };
    cl(160, FLOOR, { ...emo(t, [[0, 'hopeful'], [at('叫提升') + .5, 'nervous'], [at('叫续命'), 'excited']]), dy: j.dy, sq: j.sq });
    hp(105, 50, k, life >= 0 ? '续命' : after(t, '叫提升') ? '提升？' : null);
    if (life >= 0 && life < 1.2) { for (let i = 0; i < 8; i++) { const ph = (life * 1.5 + hash(i)) % 1; icon('heart', 140 + hash(i + 2) * 40, FLOOR - 20 - ph * 60, 1); } pxFx({ type: 'glow', x: 160, y: 120, r: 50, a: .35, col: '#FF8C9A' }); }
    kick(life, 3);
  }, { in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [160, 100, ramp(t, [[at('在别的行业学习叫提升'), 1.05], [at('叫续命'), 1.35], [at('叫续命') + .4, 1.12]])] });
  // 17. two cards: the doctor's book feeds him for life; the coder's crumbles to dust overnight
  shot('医生看病', (lt, t) => {
    hall(t);
    const gone = since(t, '过时淘汰了');
    card(20, 24, 136, 110, '医生 · 吃一辈子', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#3A2418'], [h, '#5A3A2C']]); icon('book', x + w / 2, y + 40 + Math.sin(t * 2) * 2, 3); sparkle(x + w / 2, y + 40, 26, t, 6); }, pop(lt, .3));
    const k2 = after(t, '而计算机技术呢', -.3) ? pop(since(t, '而计算机技术呢') + .3, .3) : 0;
    card(164, 24, 136, 110, gone >= 0 ? '计算机 · 过时淘汰' : '计算机 · 明天就不用学', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#0E0A20'], [h, '#2A1C44']]); if (gone < 0) icon('book', x + w / 2 + Math.round(Math.sin(t * 30) * (after(t, '而计算机技术呢', 2) ? 1 : 0)), y + 40, 3); else for (let i = 0; i < 40; i++) pset(x + w / 2 - 16 + Math.floor(hash(i) * 32 + gone * 40 * (hash(i + 3) - .3)), y + 28 + Math.floor(hash(i + 7) * 24 + gone * 30 * hash(i + 9)), '#8C88A6'); }, k2);
    kick(gone, 2.5);
  }, { in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('医生看病'), 88], [at('而计算机技术呢') - .1, 88], [at('而计算机技术呢') + .4, 232]]), 80, ramp(t, [[at('医生看病'), 1.3], [at('过时淘汰了') - .3, 1.3], [at('过时淘汰了'), 1.5]])] });
  // 18. a dead end: the walls close in from both sides
  shot('这就形成了一种死局', (lt, t) => {
    darkStage(t, [160]);
    const k = ease(clamp(lt / 3.5)), w = Math.round(lerp(40, 116, k));
    frame(-6, 16, w + 6, 136); frame(PW - w, 16, w + 6, 136);
    pxText('焦虑死', w / 2, 82, { size: 11, color: SKY }); pxText('累死', PW - w / 2, 82, { size: 11, color: PINK });
    if (after(t, '死局')) chip('死局', 160, 34, CREAM, 9);
    cl(160, FLOOR, { ...feelT('sad', t), lookX: Math.sin(t * 2.4) > 0 ? 1 : -1, emote: 'sweat', emoteK: 1 });
    kick(lt - 3.4, 2);
  }, { in: { type: 'iris', dur: .45 }, cam: push(160, 96, 1.02, 1.2) });
  // 19. others learn a page at a time; the coders binge: books rain on Clawd
  shot('而且码农和其他行业', (lt, t) => {
    curtain(t, 1); spot(90, t, { w: 50 }); spot(230, t, { w: 50 });
    npc(90, FLOOR, null, '#4A2A36'); icon('book', 96, FLOOR - 18, 1); chip('持续学习', 90, 90, CREAM, 7);
    const binge = since(t, '爆发式狂补');
    if (binge >= 0) { for (let i = 0; i < 30; i++) { const ph = (binge * (1.1 + hash(i)) + hash(i + 3)) % 1; icon('book', 190 + hash(i * 5) * 80, -10 + ph * 160, 1); } stamp('爆发式狂补', 230, 40, binge, 8); kick(binge, 3); }
    else chip('码农', 230, 90, CREAM, 7);
    cl(230, FLOOR, emo(t, [[0, 'neutral'], [at('爆发式狂补'), 'excited']], binge >= 0 ? { aL: 1.4, aR: 1.4 } : {}));
  }, { in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('而且码农和其他行业'), 160], [at('爆发式狂补') - .2, 160], [at('爆发式狂补'), 226]]), 100, ramp(t, [[at('而且码农和其他行业'), 1.03], [at('爆发式狂补') - .2, 1.06], [at('爆发式狂补'), 1.4]])] });
  // 20. the AI storm roars in: 黑哥's cap blows off, Clawd hangs on
  shot('大家仔细想想', (lt, t) => {
    const storm = since(t, '呼啸而来'), sx = storm < 0 ? 340 : lerp(340, 240, out3(storm / 1.2));
    vgrad(0, PW, 0, FLOOR, [[0, '#0E0A20'], [FLOOR, '#3A1E44']]); vgrad(0, PW, FLOOR, PH, [[0, '#4A2C1C'], [30, '#2A1810']]);
    for (let i = 0; i < 90; i++) { const y = 10 + i * 1.5, a = t * 4 + i * .4, r = 6 + y * .28; pset(Math.round(sx + Math.cos(a) * r), Math.round(y + Math.sin(a) * 2), i % 3 ? '#B8D8FF' : '#4AA8E0'); }
    for (let i = 0; i < 6; i++) { const a = t * 3 + i, y = 30 + i * 18; icon('chip', sx + Math.cos(a) * (10 + y * .25), y, 1); }
    pxFx({ type: 'glow', x: sx, y: 80, r: 70, a: .3, col: '#9BC8FF' });
    const blown = storm >= 0;
    if (blown) { for (let i = 0; i < 16; i++) R(Math.round(340 - (t * 300 + hash(i) * 400) % 360), Math.round(hash(i + 3) * 140), 14 + Math.round(hash(i + 5) * 20), 1, '#5A6A9A'); kick(0, 1); chip('AI 时代', 160, 26, SKY, 9); }
    hg(70 - (blown ? Math.round(Math.sin(t * 20)) : 0), FLOOR, emo(t, [[0, 'thinking'], [at('呼啸而来'), 'surprised']], blown ? { capPop: 1, lookX: .8 } : { lookX: .8 }));
    if (blown) { const k = clamp(storm / 1.5), cx = Math.round(70 - k * 100), cy = Math.round(FLOOR - 48 - Math.sin(k * 3) * 22); R(cx - 6, cy, 12, 5, '#1A1A22'); R(cx - 9, cy + 4, 7, 2, '#1A1A22'); }
    cl(170 - (blown ? Math.round(Math.sin(t * 17)) : 0), FLOOR, emo(t, [[0, 'neutral'], [at('呼啸而来'), 'scared'], [at('他们用了多久'), 'confused']], blown ? { aL: 1.2, aR: .2 } : {}));
    if (after(t, '他们用了多久')) { chip('普通工程师', 112, 62, CREAM, 7); chip('Agent 工程师', 228, 62, SKY, 7); pxText('→', 168, 62, { size: 9, color: GOLDL }); chip('用了多久？', 170, 82, GOLDL, 7); }
  }, { in: { type: 'wipe', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('大家仔细想想'), 120], [at('呼啸而来'), 160]]), 96, ramp(t, [[at('大家仔细想想'), 1.25], [at('呼啸而来'), 1.03]])] });
  // 21. a month for some . . . one night for him: the moon swings to sun over Clawd's desk
  shot('有人用一个月', (lt, t) => {
    hall(t);
    card(20, 24, 136, 110, '有人 · 一个月', (x, y, w, h) => { vgrad(x, x + w, y, y + h, [[0, '#3A2418'], [h, '#5A3A2C']]); const pg = Math.floor(lt * 6) % 30 + 1; frame(x + 34, y + 10, 58, 50, { fill: CREAM }); R(x + 39, y + 15, 48, 8, RED); pxText(`${pg} 日`, x + 63, y + 41, { size: 10, color: INK, stroke: false }); npc(x + 110, y + h, null, '#4A2A36'); }, pop(lt, .3));
    const one = since(t, '只用了一夜'), k2 = one >= -.3 ? pop(one + .3, .3) : 0;
    card(164, 24, 136, 110, '他 · 一夜', (x, y, w, h) => { const k = clamp(one / 1.2), day = k > .5; vgrad(x, x + w, y, y + h, day ? [[0, '#E8A06A'], [h, '#FFD8A0']] : [[0, '#0E0A20'], [h, '#3A1E44']]); const a = Math.PI * (1 - k); icon(day ? 'sun' : 'moon', x + w / 2 + Math.cos(a) * 44, y + 52 - Math.sin(a) * 40, 2); cl(x + w / 2, y + h, { ...emo(t, [[0, 'neutral'], [at('只用了一夜'), 'starstruck']]), ...(day ? {} : typing(t, 16)), noShadow: true }); }, k2);
  }, { in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('有人用一个月'), 88], [at('只用了一夜') - .1, 88], [at('只用了一夜') + .4, 232]]), 80, 1.3] });
  // 22. before he knows what happened: forced full stack, the job titles stack up on his head
  shot('你都还没搞懂', (lt, t) => {
    curtain(t, 1); spot(160, t);
    const full = since(t, '被迫全栈');
    cl(160, FLOOR, { ...emo(t, [[0, 'confused'], [at('被迫全栈'), 'dizzy']]), emote: full < 0 ? '?' : null, emoteK: 1, sq: full >= 0 ? Math.min(4, Math.floor(full / .2) + 1) * .05 : 0 });
    ['前端', '后端', '运维', '数据库'].forEach((w, i) => { const lt2 = full - i * .2; if (lt2 < 0) return; const y = Math.round(Math.min(FLOOR - 41 - 8 - i * 15, -20 + lt2 * 700)); frame(132, y - 7, 56, 14, { fill: '#2A1418' }); pxText(w, 160, y, { size: 6.5, color: GOLDL }); kick(lt2 - .2, 2); });
  }, { in: { type: 'cut' }, cam: (lt, t) => [160, ramp(t, [[at('被迫全栈'), 112], [at('被迫全栈') + .8, 96]]), ramp(t, [[at('你都还没搞懂'), 1.4], [at('被迫全栈'), 1.4], [at('被迫全栈') + .8, 1.15]])] });
  // 23. the old pride into the bin; then a salute, a recruit again
  shot('不得不把你过去', (lt, t) => {
    curtain(t, 1); spot(120, t);
    icon('trash', 236, 128, 3);
    const toss = since(t, '扔进垃圾桶'), k = clamp(toss / .7);
    if (k < 1) { const x = toss < 0 ? 136 : lerp(136, 236, k), y = toss < 0 ? 88 + Math.sin(t * 3) * 2 : lerp(88, 116, k) - Math.sin(k * Math.PI) * 40; icon('crown', x, y, 2); pxFx({ type: 'glow', x, y, r: 20, a: .4 }); } else { kick(toss - .7, 2.5); sparkle(236, 104, 14, t, 6, CREAM); }
    if (toss < 0) chip('引以为傲的经验', 136, 66, CREAM, 7);
    const sal = after(t, '新兵蛋子');
    cl(120, FLOOR, emo(t, [[0, 'proud'], [at('扔进垃圾桶'), 'sad'], [at('新兵蛋子'), 'determined']], sal ? { aR: 1.6 } : {}));
    if (sal) chip('新兵蛋子', 120, 82, GOLDL, 8);
  }, { in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('扔进垃圾桶'), 150], [at('扔进垃圾桶') + .8, 190], [at('新兵蛋子'), 190], [at('新兵蛋子') + .4, 130]]), 100, ramp(t, [[at('不得不把你过去'), 1.3], [at('扔进垃圾桶'), 1.3], [at('扔进垃圾桶') + .8, 1.15], [at('新兵蛋子') + .4, 1.4]])] });
  // 24. others' years pile up as gold; his are only a cache, and DEL comes down on it
  shot('那一刻他彻底懂了', (lt, t) => {
    serverRoom(t);
    const acc = since(t, '叫积累'), fr = since(t, '一键释放');
    if (acc >= 0) { npc(60, FLOOR, null, '#4A2A36'); for (let i = 0; i < Math.min(6, 1 + Math.floor(acc * 3)); i++) box(80, FLOOR - 6 - i * 6, 16, 6, GOLD, GOLDD); chip('积累', 70, 94, GOLDL, 8); pxFx({ type: 'glow', x: 88, y: FLOOR - 20, r: 30, a: .35 }); }
    if (fr < .2) { icon('box', 236, 112, 3); if (after(t, '缓存')) chip('缓存', 236, 80, SKY, 9); }
    else for (let i = 0; i < 50; i++) pset(236 + Math.floor((hash(i) - .5) * 100 * fr), 112 + Math.floor((hash(i + 4) - .5) * 70 * fr), SKY);
    if (fr >= 0) { const ky = Math.min(90, -30 + fr * 600); frame(208, Math.round(ky), 56, 26, { fill: RED }); pxText('DEL', 236, Math.round(ky + 13), { size: 9 }); kick(fr - .2, 4); }
    cl(170, FLOOR, emo(t, [[0, 'idea'], [at('别人的阅历'), 'thinking'], [at('缓存'), 'nervous'], [at('一键释放'), 'furious']]));
  }, { in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('别人的阅历'), 170], [at('叫积累'), 100], [at('缓存') - .2, 100], [at('缓存') + .2, 210]]), 100, ramp(t, [[at('那一刻他彻底懂了'), 1.3], [at('别人的阅历'), 1.3], [at('叫积累'), 1.25], [at('一键释放'), 1.25], [at('一键释放') + .3, 1.08]])] });
  // 25. job hopping = the college entrance exam all over again
  shot('更恐怖的还有跳槽', (lt, t) => {
    examHall(t); examDesks(t, 0);
    [['算法#1', '算法'], ['网络协议', '网络协议'], ['操作系统', '操作系统'], ['数据库', '数据库'], ['八股文', '八股文']].forEach(([m, w], i) => { if (after(t, m)) chip(w, 70 + (i % 3) * 90, 28 + Math.floor(i / 3) * 20, CREAM, 8); });
    const exam = since(t, '高考');
    if (exam >= 0) { stamp('高考', 266, 30, exam, 8); kick(exam, 3); for (let i = 0; i < 16; i++) { const ph = (exam * (1 + hash(i)) + hash(i + 2)) % 1; icon('paper', 10 + hash(i * 3) * 300, ph * 170 - 10, 1); } }
    const w = walker(t, [[at('更恐怖的还有跳槽'), -20], [at('更恐怖的还有跳槽') + 2.5, 160]]);
    cl(w.x, FLOOR + 8, w.moving ? { ...feelT('neutral', t), view: 'side', walk: w.x / 10 } : emo(t, [[0, 'scared'], [at('高考'), 'ko'], [at('算法#1'), 'dizzy'], [at('学习真的太累了'), 'sleepy']], after(t, '学习真的太累了') ? { emote: 'zzz', emoteK: 1 } : {}));
    if (w.moving) icon('box', w.x + 2, FLOOR - 16, 1);
    examDesks(t, 1);
  }, { in: { type: 'iris', dur: .45 }, cam: (lt, t) => [ramp(t, [[at('更恐怖的还有跳槽'), 60], [at('更恐怖的还有跳槽') + 2.5, 160]]), ramp(t, [[at('高考') - .1, 120], [at('高考') + .4, 92]]), ramp(t, [[at('更恐怖的还有跳槽'), 1.35], [at('高考') - .1, 1.35], [at('高考') + .4, 1.03], [at('学习真的太累了'), 1.03], [at('学习真的太累了') + .5, 1.4]])] });
  // 26. 黑哥 plays the poser: "学习使我快乐"
  shot('有人还喜欢装', (lt, t) => {
    sunburst(t, '#8A4A6A', '#B86A8A', 80, 50);
    hg(76, PH + 10, { ...feelT('smug', t), poseL: 'clasp', poseR: 'clasp' });
    for (let i = 0; i < 7; i++) icon('heart', 10 + i * 24, 14 + Math.sin(lt * 4 + i) * 3, 1);
    if (lt > .8) chip('学习使我快乐', 126, 46, CREAM, 5.5);
  }, { res: [160, 90], in: { type: 'slide', dur: .3 }, cam: push(80, 50, 1.0, 1.15) });
  // 27. Clawd: 放P! learning is never fun; having learnt it is
  shot('放屁', (lt, t) => {
    sunburst(t, '#5A0E18', '#8A1828', 64, 46);
    const j = jump(onTwos(t), at('放屁'), at('放屁') + .4, 4);
    cl(64, FLOOR, { ...emo(t, [[0, 'furious'], [at('学会了才快乐'), 'laugh']]), dy: j.dy, sq: j.sq });
    stamp('放P', 100, 18, lt - .1, 10); kick(lt - .1, 4.5);
    if (after(t, '学会了才快乐')) chip('学会了才快乐', 64, 14, GOLDL, 5);
  }, { res: [128, 72], in: { type: 'glitch', dur: .25 }, cam: (lt, t) => [64, 38, 1.02 + .25 * Math.max(0, .25 - lt) * 4] });
  // 28. tangled in code, until he talks himself into a comfortable pit
  shot('当你算法', (lt, t) => {
    curtain(t, 1); spot(160, t);
    const pit = since(t, '跳什么槽啊');
    if (pit < 0) { for (let i = 0; i < 110; i++) { const a = i * .7 + t * 2, r = 10 + 34 * hash(i); pset(Math.round(160 + Math.cos(a) * r * 1.3), Math.round(124 + Math.sin(a * 1.2) * r * .6), i % 4 ? CREAM : RED); } ['算法', '底层逻辑', '框架'].forEach((w, i) => { if (lt > i * 1.6) chip(w, 90 + i * 70, 60 + (i % 2) * 14, PINK, 7); }); }
    else { pellipse(160, FLOOR + 3, 40, 7, INK); pellipse(160, FLOOR + 3, 36, 5, '#0A0608'); chip('这坑挺好的', 160, 54, CREAM, 9); }
    cl(160, FLOOR + (pit >= 0 ? Math.min(14, Math.round(pit * 30)) : 0), emo(t, [[0, 'dizzy'], [at('麻痹自己'), 'relieved'], [at('跳什么槽啊'), 'relieved']], pit >= 0 ? { emote: 'music', emoteK: 1 } : {}));
    if (pit >= 0) pellipse(160, FLOOR + 6, 40, 4, '#2E1C14');
  }, { in: { type: 'dissolve', dur: .35 }, cam: (lt, t) => [160, 104, ramp(t, [[at('当你算法'), 1.03], [at('跳什么槽啊'), 1.2], [at('跳什么槽啊') + .5, 1.3]])] });
  shot('最后一个', title('三', '稳定程度', 'shield'), { in: { type: 'slide', dur: .3 }, cam: push(160, 88, 1.02, 1.1) });
  // 29. the host loses it: 最邪门
  shot('这个最他妈邪门', (lt, t) => { sunburst(t, '#5A0E18', '#8A1828', 80, 55); hg(76, PH + 10, feelT('furious', t)); stamp('最邪门', 126, 24, lt - .2, 8); kick(lt - .2, 4); }, { res: [160, 90], in: { type: 'glitch', dur: .25 }, cam: push(80, 50, 1.15, 1.0) });
  // 30. he studies AND works overtime: books pile on one side of the desk, the clock spins
  shot('你很难想象', (lt, t) => {
    office(t, { phase: lt * .3 + .7, clockSpin: lt * 20 });
    cl(140, FLOOR - 2, { ...feelT('determined', t), ...typing(t, 12) });
    desk(140, t, { cups: 12 });
    for (let i = 0; i < Math.min(8, Math.floor(lt * 1.5) + 1); i++) icon('book', 104 + (i % 2), FLOOR - 22 - i * 7, 1);
    chip('学习', 104, 70, CREAM, 7); chip('加班', 176, 70, CREAM, 7);
  }, { in: { type: 'dissolve', dur: .35 }, cam: push(140, 100, 1.1, 1.35) });
  // 31. in any other trade: lifted onto a throne, crowned, bowed to
  shot('这要搁别的行业', (lt, t) => {
    hall(t); pedestal(160, 50); frame(140, FLOOR - 64, 40, 40, { fill: '#9A2232' });
    const up = clamp(lt / .8);
    for (let i = 0; i < 4; i++) { const x = [90, 116, 204, 230][i], bow = Math.sin(t * 4 + i) > 0 ? 2 : 0; R(x - 5, FLOOR - 20 + bow, 10, 12, '#4A2A36'); R(x - 4 + (i < 2 ? bow : -bow), FLOOR - 28 + bow * 2, 8, 8, '#4A2A36'); R(x - 3, FLOOR - 8, 2, 8, '#4A2A36'); R(x + 1, FLOOR - 8, 2, 8, '#4A2A36'); }
    cl(160, Math.round(lerp(FLOOR, FLOOR - 28, out3(up))), emo(t, [[0, 'surprised'], [at('当祖宗供起来'), 'proud']]));
    if (after(t, '当祖宗供起来')) { const k = pop(since(t, '当祖宗供起来'), .3); icon('crown', 160, lerp(20, FLOOR - 28 - 41 - 8, k), 2); pxFx({ type: 'glow', x: 160, y: FLOOR - 50, r: 50, a: .5 }); sparkle(160, FLOOR - 50, 34, t, 12); chip('核心骨干', 160, 30, GOLDL, 8); }
  }, { in: { type: 'iris', dur: .4 }, cam: (lt, t) => [160, ramp(t, [[at('这要搁别的行业'), 100], [at('当祖宗供起来'), 86]]), ramp(t, [[at('这要搁别的行业'), 1.05], [at('当祖宗供起来'), 1.3]])] });
  // 32. . . . but here: the crown slides off, the bowing stops, an old greasy stick
  shot('结果在码农行业', (lt, t) => {
    hall(t); pedestal(160, 50); frame(140, FLOOR - 64, 40, 40, { fill: '#5A4A4A' });
    for (let i = 0; i < 4; i++) { const x = [90, 116, 204, 230][i]; R(x - 5, FLOOR - 22, 10, 14, '#3A2430'); R(x - 4, FLOOR - 30, 8, 8, '#3A2430'); R(x - 3, FLOOR - 8, 2, 8, '#3A2430'); R(x + 1, FLOOR - 8, 2, 8, '#3A2430'); }
    const oily = since(t, '被嫌弃的老油条');
    cl(160, FLOOR - 28, emo(t, [[0, 'nervous'], [at('被嫌弃的老油条'), 'disgusted']]));
    if (oily < 0) icon('crown', 160 + Math.round(Math.sin(lt * 9)), FLOOR - 77, 2);
    else { icon('crown', 160 + oily * 60, FLOOR - 77 + oily * oily * 260, 2); for (let i = 0; i < 8; i++) R(144 + i * 4, FLOOR - 50 + ((oily * 30 + i * 9) % 40), 2, 4, '#C08A5C'); stamp('老油条', 250, 46, oily, 10); kick(oily, 3); }
  }, { in: { type: 'cut' }, cam: (lt, t) => [ramp(t, [[at('被嫌弃的老油条'), 160], [at('被嫌弃的老油条') + .3, 190]]), 92, ramp(t, [[at('结果在码农行业'), 1.3], [at('被嫌弃的老油条'), 1.3], [at('被嫌弃的老油条') + .3, 1.1]])] });
  // 33. dragging the baggage of history down the street, bigger every year, until it's optimised away
  shot('程序员的职业生涯', (lt, t) => {
    const cut = since(t, '优化掉');
    street(t, Math.floor(lt * 14));
    const bag = Math.min(5, 1 + Math.floor(lt / 1.8));
    if (cut < .25) { icon('bag', 130 - bag * 6, FLOOR - 6 * bag, bag); R(130, FLOOR - 3 * bag, 46, 1, '#8A5A3C'); cl(186, FLOOR, { ...feelT('sad', t), view: 'side', walk: lt * 1.2 }); if (after(t, '历史包袱')) chip('历史包袱', 130 - bag * 6, FLOOR - 12 * bag - 10, '#E8C08A', 8); }
    if (cut >= 0) { const ky = Math.min(FLOOR - 34, -40 + cut * 900); frame(140, Math.round(ky), 70, 32, { fill: RED }); pxText('优化', 175, Math.round(ky + 16), { size: 12 }); kick(cut - .2, 4); if (cut > .25) { for (let i = 0; i < 40; i++) pset(175 + Math.floor((hash(i) - .5) * 140 * cut), FLOOR - 10 - Math.floor(hash(i + 3) * 50 * cut), CREAM); cl(186 + cut * 160, FLOOR - Math.round(Math.sin(clamp(cut) * Math.PI) * 30), feelT('ko', t)); } }
  }, { in: { type: 'wipe', dur: .35 }, cam: (lt, t) => [ramp(t, [[at('程序员的职业生涯'), 180], [at('历史包袱'), 150]]), ramp(t, [[at('程序员的职业生涯'), 116], [at('历史包袱'), 104]]), ramp(t, [[at('程序员的职业生涯'), 1.45], [at('历史包袱'), 1.15], [at('优化掉') - .2, 1.15], [at('优化掉'), 1.05]])] });
  // 34. at the bar, together: every system fits but him
  shot('喝到最后', (lt, t) => {
    bar(t);
    const me = since(t, '竟然是他妈我'), alone = since(t, '年纪轻轻的');
    chip('系统兼容性', 98, 28, SKY, 7);
    for (let i = 0; i < 6; i++) box(54 + i * 16, 36, 15, 12, '#4A68B0', '#2A3A70');
    const mx = me >= 0 ? Math.round(150 + me * 30) : 150, my = me >= 0 ? Math.round(36 + me * me * 140) : 36;
    box(mx, my, 15, 12, RED); pxText('我', mx + 7.5, my + 6, { size: 7 }); kick(me - .6, 2.5);
    hg(110, FLOOR - 8, { ...emo(t, [[0, 'sad'], [at('竟然是他妈我'), 'sad']]), view: 'q' });
    cl(220, FLOOR - 8, emo(t, [[0, 'sad'], [at('老子写了一辈子'), 'angry'], [at('竟然是他妈我'), 'cry'], [at('年纪轻轻的'), 'cry']]));
    barTop();
    box(130, FLOOR - 34, 8, 12, GOLD, INK); box(196, FLOOR - 34, 8, 12, GOLD, INK);
    if (alone >= 0) chip('被抛弃', 220, 64, PINK, 8);
  }, { in: { type: 'dissolve', dur: .4 }, cam: (lt, t) => [ramp(t, [[at('喝到最后'), 165], [at('老子写了一辈子'), 205], [at('竟然是他妈我') - .3, 140], [at('竟然是他妈我') + .8, 200]]), ramp(t, [[at('老子写了一辈子'), 100], [at('竟然是他妈我') - .3, 70], [at('竟然是他妈我') + .8, 104]]), ramp(t, [[at('喝到最后'), 1.05], [at('老子写了一辈子'), 1.35], [at('竟然是他妈我') - .3, 1.3], [at('竟然是他妈我') + .8, 1.45]])] });
  // 35. both under the rain cloud of anxiety
  shot('这就是为什么', (lt, t) => {
    curtain(t, 1); spot(160, t, { w: 90 });
    cloud(160, 60, t); chip('焦虑', 160, 42, SKY, 8);
    hg(124, FLOOR, feelT('nervous', t)); cl(204, FLOOR, { ...feelT('nervous', t), emote: 'sweat', emoteK: 1 });
  }, { in: { type: 'dissolve', dur: .35 }, cam: push(160, 96, 1.05, 1.25) });
  // 36. the advice to the young: a line of newcomers walks toward the gate; Clawd raises a hand
  shot('所以他常说', (lt, t) => {
    curtain(t, 1); spot(110, t);
    frame(220, 40, 70, FLOOR - 40, { fill: '#0E0A20' }); pxText('码农', 255, 56, { size: 9, color: GOLDL });
    for (let i = 0; i < 4; i++) { const stop = 200 - i * 22, x = Math.round(Math.min(stop, -20 + lt * 30 - i * 22)); npc(x + 40, FLOOR, x < stop ? lt * 2 + i : null, '#5A3A4A'); }
    cl(110, FLOOR, emo(t, [[0, 'determined'], [at('奉劝一下'), 'thinking']], after(t, '奉劝一下') ? { aR: 1.2 } : {}));
    if (after(t, '入行的第一天')) chip('入行第一天', 110, 80, CREAM, 8);
  }, { in: { type: 'iris', dur: .45 }, cam: push(150, 100, 1.05, 1.25) });
  // 37. a thorn in the heart: easy money, cruel trade
  shot('一根刺', (lt, t) => {
    sunburst(t, '#1E1424', '#2E1E34', 52, 46);
    cl(52, FLOOR, emo(t, [[0, 'determined'], [at('能赚点快钱'), 'happy'], [at('极其残酷'), 'suspicious']]));
    const d = clamp(lt / .3); icon('thorn', lerp(122, 64, d), lerp(4, 38, d), 1); kick(lt - .3, 2.5);
    if (after(t, '能赚点快钱')) { for (let i = 0; i < 5; i++) { const ph = (since(t, '能赚点快钱') * 1.5 + i / 5) % 1; pellipse(96 + i * 6, 60 - ph * 30, 2, 2, after(t, '极其残酷') ? RED : GOLDL); } chip(after(t, '极其残酷') ? '残酷' : '快钱', 100, 14, after(t, '极其残酷') ? PINK : GOLDL, 6); }
  }, { res: [128, 72], in: { type: 'glitch', dur: .3 }, cam: push(64, 38, 1.0, 1.1) });
  // 38. he builds the future, and sinks into the past
  shot('这个行业最伟大的地方', (lt, t) => {
    vgrad(0, PW, 0, FLOOR, [[0, '#2A1430'], [100, '#8A4A4A'], [FLOOR, '#E8A06A']]);
    pxFx({ type: 'glow', x: 240, y: FLOOR, r: 120, a: .35, col: '#FFC27A' });
    const sink = since(t, '最残忍的地方');
    for (let i = 0; i < 12; i++) { const h = Math.round(Math.min(1, lt / 4 + hash(i) * .3) * (40 + hash(i + 3) * 70)); R(170 + i * 12, FLOOR - h, 10, h, '#1A1220'); for (let j = 4; j < h; j += 6) if (hash(i * 7 + j) > .4) R(172 + i * 12, FLOOR - h + j, 6, 2, GOLD); }
    vgrad(0, PW, FLOOR, PH, [[0, '#4A2C1C'], [30, '#2A1810']]);
    cl(90, FLOOR + (sink >= 0 ? Math.min(17, Math.round(sink * 5)) : 0), emo(t, [[0, 'hopeful'], [at('最残忍的地方'), 'sad']], sink < 0 ? typing(t, 8) : {}));
    R(0, FLOOR, PW, PH - FLOOR, '#2A1810'); R(0, FLOOR, PW, 1, '#6A4028');
    chip(sink >= 0 ? '自己被埋在过去' : '创造未来', sink >= 0 ? 90 : 236, sink >= 0 ? 70 : 36, sink >= 0 ? CREAM : GOLDL, 9);
  }, { in: { type: 'dissolve', dur: .4 }, cam: (lt, t) => [ramp(t, [[at('这个行业最伟大的地方'), 200], [at('最残忍的地方'), 200], [at('最残忍的地方') + 1, 110]]), 100, ramp(t, [[at('这个行业最伟大的地方'), 1.05], [at('最残忍的地方'), 1.15], [at('最残忍的地方') + 1, 1.35]])] });
  // 39. "……做码农挺好": Clawd bounces up with a wink, 黑哥 facepalms, the curtain closes
  shot('但话是这么说', (lt, t) => {
    const end = D.len - t, close = end < 1.8 ? 1 - end / 1.8 : 0;
    curtain(t, 1); spot(160, t, { w: 110 });
    const up = since(t, '做码农挺好');
    hg(110, FLOOR, emo(t, [[0, 'neutral'], [at('做码农挺好'), 'bored']], up >= 0 ? { poseL: 'cover' } : {}));
    const j = up >= 0 ? jump(onTwos(t), at('做码农挺好'), at('做码农挺好') + .5, 6) : { dy: 0, sq: 0 };
    cl(210, FLOOR, { ...emo(t, [[0, 'neutral'], [at('做码农挺好'), 'playful']]), dy: j.dy, sq: j.sq, aR: up >= 0 ? 1.4 : .2 });
    if (up >= 0) { kick(up, 2.5); sparkle(210, 110, 30, t, 10); }
    curtainCloth(t, 1 - close);
    if (up >= 0) stamp('做码农挺好', 210, 50, up, 9);
  }, { in: { type: 'iris', dur: .5 }, cam: (lt, t) => [ramp(t, [[at('但话是这么说'), 160], [at('做码农挺好') - .2, 160], [at('做码农挺好'), 190], [D.len - 1.8, 190], [D.len - .3, 160]]), 100, ramp(t, [[at('但话是这么说'), 1.03], [at('做码农挺好') - .2, 1.15], [at('做码农挺好'), 1.3], [D.len - 1.8, 1.3], [D.len - .3, 1.02]])] });

  // ---------- the chapter bar and the gold words ----------
  const chapters = [['邪门在哪', 0], ['不可能三角', at('三个维度')], ['工作强度', at('先说第一个')], ['持续学习', at('再说第二个')], ['稳定程度', at('最后一个')], ['写在最后', at('所以他常说')]];
  const keys = ['码农', '十年', '邪门', '三个维度', '工作强度', '持续学习', '稳定程度', '不可能三角', '既要', '又要', '还要', '变态', '十五年', '加班', '提心吊胆', '服务器', 'Bug', '惊喜', '崩溃边缘', '续命', '提升', '过时淘汰', '死局', '爆发式狂补', 'Agent', '一夜', '全栈', '垃圾桶', '缓存', '一键释放', '跳槽', '高考', '放P', '快乐', '老油条', '历史包袱', '优化', '兼容', '抛弃', '焦虑', '刺', '残酷', '未来', '过去', '挺好'];
  LOOPS.pxManong3 = () => {};
  Object.assign(LOOPS.pxManong3, { len: D.len, film: K.film({ chapters, keys }) });
})();
