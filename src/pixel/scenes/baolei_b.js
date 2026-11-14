// scenes/baolei_b.js: Act I — 老板画大饼裁掉整个前端部 -> 1人扛3人活拿高压喷枪糊水泥盖3栋危楼 -> 1000行代码麻木提交 -> 测试修东墙塌西墙 -> 戴墨镜离场
(() => {
  const N = window.BAOLEI;
  const { B, G, VX, K, shot, P, A, AT, sfx, edit, fillEdit, flash,
    ppl, prop, bubble, label, burst, sweat, sprayStream,
    seg01, sm, lerp, hh, clamp01, tagUI, slam, toast, stamp, ratioBar, codeWall,
    SITE, WAR, AMBER, WARM, ALARM, DUSK, NIGHT, DAY } = N;

  const bob = (t, f = 8, h = .07) => -Math.abs(Math.sin(t * f)) * h;

  // ======================================================================================= B1 · 画大饼转全栈，连根砍掉前端部
  const PIE_T = AT('老板在会上画大饼'), CUT_T = AT('直接连根砍掉了'), B2 = A('留下来的人');
  // 前端部整块拆除（x=92..98, y=G+2..G+5, z=40..46）
  fillEdit(CUT_T, 92, G + 2, 40, 98, G + 5, 46, 0);
  fillEdit(CUT_T + .05, 93, G + 1, 41, 97, G + 1, 45, 'crimsonSoft');
  edit(CUT_T + .05, 95, G + 2, 43, 'tnt');

  shot(A('看看他们公司'), B2, {
    day: DAY, fog: [55, 165], kicks: [[CUT_T, 1.0]],
    keys: [
      K(A('看看他们公司'), [98, G + 6.5, 62], [97, G + 3.0, 44], 60),
      K(PIE_T, [96, G + 5.8, 58], [96, G + 3.2, 45], 56),
      K(CUT_T, [99, G + 7.0, 60], [95, G + 2.8, 43], 58),
      K(B2, [104, G + 7.5, 61], [104, G + 3.0, 44], 58),
    ],
    act: t => {
      const cut = t >= CUT_T;
      ppl(99.5, G + 1, 48, '老板', cut ? 'angry' : 'happy', t, { tag: '老板', tagCol: '#FFD34E', dy: cut ? 0 : bob(t, 10, .06) });
      if (!cut) prop(99.5, G + 3.3 + Math.sin(t * 6) * .15, 48, 'pie', { k: .035 });
      ppl(95, G + 1, 49, '开发', cut ? 'shock' : 'neutral', t, { tag: cut ? '全员转全栈!' : '前端部', tagCol: cut ? '#FF5A5A' : '#72C9FE' });
      if (!cut) ppl(93.5, G + 1, 47, '开发', 'neutral', t, { flip: true, tag: false });
      if (cut) {
        burst(t, CUT_T, 95, G + 3.5, 43, [255, 90, 72], 30);
        label(95, G + 5.0, 43, '[×] 前端部已砍！', 48, '#FF5A5A', t, CUT_T, B2);
      }
    },
    ui: (c, t) => {
      tagUI(c, '两个月实录 · 降本增效', 1, '#FFD34E');
      if (t >= PIE_T && t < CUT_T) toast(c, t, PIE_T, '老板画饼：全员转全栈！', 180, '#FFD34E', CUT_T - PIE_T);
      if (t >= CUT_T) slam(c, t, CUT_T, '整个前端部门 连根砍掉！', 220, 86, '#FF5A5A', 2.2);
    },
  });
  flash(CUT_T, '#FF6A5A', .48, .3);
  sfx(PIE_T, 'toast', -10); sfx(CUT_T, 'boom', -5); sfx(CUT_T + .15, 'break_stone', -7);

  // ======================================================================================= B2 · 1人硬扛3人活，塞高压喷枪同时糊3栋楼
  const GUN_T = AT('塞一把高压喷枪'), SPRAY_T = AT('疯狂往外糊水泥'), B3 = A('刚用AI那阵');
  // 3 栋楼逐层狂飙（高度从 G+3 喷到 G+10）
  for (let step = 0; step < 7; step++) {
    const tt = lerp(GUN_T, B3 - .5, step / 7);
    const by = G + 3 + step;
    for (const tx of [104, 110, 116]) {
      const blk = (step + tx) % 3 === 0 ? 'crimsonSoft' : (step % 2 ? 'worange' : 'sandSoft');
      fillEdit(tt, tx - 1, by, 42, tx + 1, by, 45, blk);
    }
  }
  shot(B2, B3, {
    day: DAY, fog: [55, 165], kicks: [[SPRAY_T, .4]],
    keys: [
      K(B2, [108.5, G + 7.2, 63], [107.8, G + 4.5, 44], 62),
      K(GUN_T, [107.5, G + 8.5, 65], [107.8, G + 5.8, 44], 60),
      K(SPRAY_T, [109.0, G + 9.8, 67], [108.0, G + 6.5, 44], 62),
      K(B3, [108.5, G + 10.2, 68], [108.2, G + 6.2, 44], 62),
    ],
    lights: t => {
      VX.light(110, G + 6, 48, WARM, 12, 1.15);
    },
    act: t => {
      const gunOut = t >= GUN_T;
      // 一个开发左右狂奔对三栋楼喷水泥
      const devX = 110 + Math.sin(t * 2.8) * 5.2;
      ppl(devX, G + 1, 49.5, '背锅侠', 'panic', t, {
        walk: true, shake: true, flip: Math.cos(t * 2.8) < 0,
        tag: gunOut ? '1 人 × 高压 AI 喷枪' : '1 人扛 3 人活', tagCol: '#FFD34E',
      });
      if (gunOut) {
        prop(devX + (Math.cos(t * 2.8) >= 0 ? .9 : -.9), G + 1.9, 49.6, 'gun', { k: .028 });
        const targetTx = Math.sin(t * 2.8) < -.3 ? 104 : Math.sin(t * 2.8) > .3 ? 116 : 110;
        sprayStream(t, devX, G + 2.0, 49.2, targetTx, G + 6 + (t - GUN_T) * .35, 44, [224, 198, 148]);
      }
      // 需求箱子从天而降
      for (let i = 0; i < 4; i++) {
        const dropY = G + 9 - ((t * 2.6 + i * .9) % 7);
        prop(103 + i * 4.5, dropY, 47, 'doc', { k: .022 });
      }
      label(104, G + 10.5, 43.5, '楼 1 (违建)', 30, '#FF7B73', t, GUN_T, B3);
      label(110, G + 11.2, 43.5, '楼 2 (违建)', 30, '#FFD34E', t, GUN_T, B3);
      label(116, G + 10.5, 43.5, '楼 3 (违建)', 30, '#FF7B73', t, GUN_T, B3);
    },
    ui: (c, t) => {
      ratioBar(c, t, B2, B3, '人力与工作量严重倒挂', .33, '人力 1/3 (已裁两拨)', '需求 300% 硬扛!', 60, 125);
    },
  });
  sfx(GUN_T, 'powerup', -9); sfx(SPRAY_T, 'sizzle', -8);
  for (let i = 0; i < 6; i++) sfx(GUN_T + i * 1.4, 'place', -13);

  // ======================================================================================= B3 · 上千行瀑布代码 -> 心态崩了，闭眼盲点提交！
  const CODE_T = AT('动辄上千行'), NUMB_T = AT('后来大家都麻了'), B4 = A('测试老哥天天');
  shot(B3, B4, {
    day: DUSK, fog: [45, 130], kicks: [[NUMB_T, .55]],
    keys: [
      K(B3, [121.5, G + 3.8, 61], [121.0, G + 2.2, 54], 54),
      K(CODE_T, [121.8, G + 3.5, 60], [121.2, G + 2.2, 54], 52),
      K(NUMB_T, [121.4, G + 3.4, 59.5], [121.0, G + 2.1, 54], 50),
      K(B4, [121.5, G + 3.6, 60], [121.2, G + 2.2, 54], 52),
    ],
    act: t => {
      const numb = t >= NUMB_T;
      ppl(118, G + 1, 55.2, '开发', numb ? 'closed' : 'dizzy', t, {
        blind: numb, tag: numb ? '闭眼直接提交线上' : '看不过来了...', tagCol: numb ? '#FF5A5A' : '#72C9FE',
      });
      if (!numb) sweat(t, 118, G + 2.9, 55.2);
      if (numb) burst(t, NUMB_T, 118, G + 2.2, 54, [255, 198, 92], 14);
    },
    ui: (c, t) => {
      codeWall(c, t, B3 + .2, B4, 1130, 80);
      if (t >= NUMB_T) toast(c, t, NUMB_T, '闭着眼往线上交！', 780, '#FF5A5A', 2.2);
    },
  });
  sfx(CODE_T, 'type_burst', -10); sfx(NUMB_T, 'click', -6); sfx(NUMB_T + .1, 'boom', -10);

  // ======================================================================================= B4 · 测试一测一屏幕窟窿，修东墙塌西墙 -> 戴墨镜摆烂离场
  const FIX_T = AT('修完东墙塌西墙'), QUIT_T = AT('反正大家想的都一样'), B5 = A('老哥在视频里算过一笔账');
  // 东墙西墙来回塌：修西(113) 塌东(123)，再修东 塌西
  fillEdit(B4 + .2, 113, G + 2, 53, 113, G + 3, 55, 0);        // 西墙先破
  fillEdit(FIX_T, 113, G + 2, 53, 113, G + 3, 55, 'brickSoft');  // 修好西墙
  fillEdit(FIX_T + .15, 123, G + 2, 53, 123, G + 3, 55, 0);      // 东墙瞬间塌掉！
  fillEdit(FIX_T + 1.0, 123, G + 2, 53, 123, G + 3, 55, 'brickSoft');
  fillEdit(FIX_T + 1.15, 113, G + 2, 53, 113, G + 3, 55, 0);

  shot(B4, B5, {
    day: t => t >= QUIT_T ? NIGHT : DUSK, fog: [42, 125], kicks: [[FIX_T + .15, .55], [FIX_T + 1.15, .55]],
    keys: [
      K(B4, [118, G + 4.5, 62], [118, G + 2.4, 54], 56),
      K(FIX_T, [118, G + 5.2, 64], [118, G + 2.6, 54], 60),
      K(QUIT_T, [118, G + 4.2, 62], [118, G + 2.2, 55.5], 54),
      K(B5, [122, G + 5.5, 64], [119, G + 2.2, 57], 56),
    ],
    act: t => {
      const quit = t >= QUIT_T;
      const walkDz = quit ? (t - QUIT_T) * .75 : 0;
      ppl(118, G + 1, 55.5 + walkDz, '测试', quit ? 'shrug' : 'panic', t, {
        walk: quit, blind: quit,
        tag: quit ? '谁在不在都难说' : '测试老哥：一屏窟窿',
        tagCol: quit ? '#FFD34E' : '#FF7B73',
      });
      if (quit) {
        ppl(116, G + 1, 55.2 + walkDz, '开发', 'shrug', t, { walk: true, blind: true, tag: false });
        prop(118, G + 2.2, 53.5, 'bomb', { k: .028 });
      } else {
        for (let i = 0; i < 6; i++) {
          const bx = 115.5 + i * 1.1, by = G + 2.6 + Math.sin(t * 5 + i) * .5;
          label(bx, by, 53.8, 'BUG!', 28, '#FF5A5A', t, B4, QUIT_T);
        }
      }
    },
    ui: (c, t) => {
      if (t < QUIT_T) toast(c, t, B4 + .2, '修完东墙塌西墙 · BUG × 47', 175, '#FF7B73', QUIT_T - B4);
      if (t >= QUIT_T) stamp(c, t, QUIT_T + .4, '闭眼放行 · 随时炸雷', 1420, 290, '#FF5A5A', B5 - QUIT_T);
    },
  });
  sfx(FIX_T, 'place', -9); sfx(FIX_T + .15, 'break_stone', -7);
  sfx(FIX_T + 1.15, 'break_stone', -7); sfx(QUIT_T + .3, 'tick', -10);
})();
