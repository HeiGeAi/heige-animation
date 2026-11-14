// scenes/baolei_c.js: Act II — 去年 50% 承重墙 vs 今年 99% AI -> Sonar 2026 (42%/96%/48%) -> GitClear 6亿+ 只写不读 (-70%/+81%/+47%)
(() => {
  const N = window.BAOLEI;
  const { B, G, VX, K, shot, P, A, AT, sfx, edit, fillEdit, flash,
    heige, clawd, model, ppl, prop, bubble, label, burst,
    seg01, sm, lerp, hh, clamp01, tagUI, slam, toast, stamp, ratioBar, metricCard,
    DATA, AMBER, WARM, ALARM, DUSK, NIGHT, DAY } = N;

  // ======================================================================================= C1 · 去年 50% 承重墙 vs 今年 99% AI 没底
  const Y25 = AT('去年用AI写代码'), Y26 = AT('可从今年过年开始'), NOBOTTOM = AT('心里真的没底'), C2 = A('这真不是他一家公司的奇葩事');
  shot(A('老哥在视频里算过一笔账'), C2, {
    day: DUSK, fog: [55, 165], kicks: [[Y26, .6]],
    keys: [
      K(A('老哥在视频里算过一笔账'), [135, G + 6.6, 65], [134.5, G + 3.8, 43], 60),
      K(Y25, [133.5, G + 6.2, 64], [133.8, G + 3.8, 43], 58),
      K(Y26, [136.0, G + 6.2, 64], [135.2, G + 3.8, 43], 58),
      K(C2, [135, G + 6.5, 65], [135, G + 3.8, 43], 58),
    ],
    lights: t => {
      VX.light(130, G + 5, 45, WARM, 8, 1.15);
      VX.light(139, G + 5, 45, t >= Y26 ? ALARM : AMBER, 8, 1.15);
    },
    act: t => {
      const cur99 = t >= Y26;
      heige(cur99 ? 137 : 131.5, G + 1, 47.8, {
        ...emotions(t, [[0, 'determined'], [Y26 - .1, 'nervous'], [NOBOTTOM, 'sad']]),
        view: 'q', flip: cur99,
      }, { tag: '黑哥' });
      label(130, G + 9.2, 43, '去年：50% 承重墙', 34, '#FFD34E', t, Y25, C2);
      label(139, G + 9.2, 43, '今年：99% AI 危楼', 34, cur99 ? '#FF5A5A' : '#B8B4C8', t, Y26, C2);
      if (t >= NOBOTTOM) {
        burst(t, NOBOTTOM, 139, G + 4.5, 41.5, [255, 92, 82], 14);
      }
    },
    ui: (c, t) => {
      const pct = t < Y26 ? .50 : .01;
      ratioBar(c, t, Y25, C2,
        t < Y26 ? '2025 写法：先立好承重墙再抹腻子' : '2026 写法：几乎 100% 交给 AI 生成',
        pct, t < Y26 ? '50% 亲手敲 (承重墙)' : '1% 人工', t < Y26 ? '50% AI 抹腻子' : '99% AI 硬糊',
        80, 108);
      if (t >= NOBOTTOM) stamp(c, t, NOBOTTOM, '提交时 心里真没底', 1520, 290, '#FF5A5A', C2 - NOBOTTOM);
    },
  });
  sfx(Y25, 'place', -9); sfx(Y26, 'alarm', -9); sfx(NOBOTTOM, 'crack', -8);

  // ======================================================================================= C2 · Sonar 2026 开发者报告（42% / 96% / 48%）
  const S42 = AT('已经有42%'), S96 = AT('但高达96%'), S48 = AT('只有48%'), C3 = A('代码分析机构GitClear更直接');
  // 3 根巨大体素柱随解说动态拔地而起 (x = 139, 143, 147, z = 62..63，全部落在右侧留给左侧大卡空间)
  for (let i = 0; i < 4; i++) fillEdit(S42 + i * .12, 138, G + 2 + i, 61, 140, G + 2 + i, 63, 'goldSoft');
  for (let i = 0; i < 8; i++) {
    const blk = i >= 6 ? 'redlamp' : 'crimsonSoft';
    fillEdit(S96 + i * .10, 142, G + 2 + i, 61, 144, G + 2 + i, 63, blk);
  }
  for (let i = 0; i < 4; i++) fillEdit(S48 + i * .12, 146, G + 2 + i, 61, 148, G + 2 + i, 63, 'steelSoft');

  shot(C2, C3, {
    day: DUSK, fog: [55, 165], kicks: [[S96, .55]],
    keys: [
      K(C2, [138.5, G + 6.8, 81], [139.0, G + 4.2, 62], 60),
      K(S42, [138.0, G + 6.6, 80.5], [138.8, G + 4.2, 62], 58),
      K(S96, [139.0, G + 7.6, 82], [139.5, G + 4.8, 62], 60),
      K(C3, [139.5, G + 6.8, 81], [139.5, G + 4.4, 62], 60),
    ],
    lights: t => {
      VX.light(142, G + 8, 65, t >= S96 ? ALARM : WARM, 13, 1.25);
    },
    act: t => {
      heige(135.2, G + 1, 65.5, { ...emotions(t, [[0, 'determined'], [S96, 'surprised']]), view: 'q' }, { tag: '黑哥' });
      if (t >= S42) label(139, G + 6.8, 62, '42% AI代码', 32, '#FFD34E', t, S42, C3);
      if (t >= S96) label(143, G + 10.6, 62, '96% 不敢全信!', 34, '#FF5A5A', t, S96, C3);
      if (t >= S48) label(147, G + 6.8, 62, '48% 提交前查', 32, '#9DB4FF', t, S48, C3);
    },
    ui: (c, t) => {
      tagUI(c, '权威实测 · 行业失控', 1, '#FFD34E');
      metricCard(c, t, C2 + .2, C3, 'Sonar 2026 开发者调查报告', [
        [S42, '42%', '提交代码由 AI 生成/辅助', '#FFD34E'],
        [S96, '96%', '开发者不敢完全相信其正确性', '#FF5A5A'],
        [S48, '48%', '提交前老实查一遍的人不到一半', '#72C9FE'],
      ], 56, 125, 620);
    },
  });
  sfx(S42, 'ding', -9); sfx(S96, 'alarm', -8); sfx(S48, 'pop', -9);

  // ======================================================================================= C3 · GitClear 2026.06 报告（6亿+ / 只写不读 / -70% / +81% / +47%）
  const WRITEONLY = AT('只写不读'), DROP70 = AT('暴跌70%'), UP81 = AT('暴涨81%'), UP47 = AT('涨了47%'), C4 = A('你以为这就够魔幻了');
  // 清空并重绘 GitClear 对比柱阵 (x = 139, 143, 147)
  fillEdit(C3, 138, G + 2, 61, 148, G + 13, 63, 0);
  fillEdit(C3 + .05, 138, G + 2, 61, 140, G + 6, 63, 'goldSoft');
  fillEdit(DROP70, 138, G + 3, 61, 140, G + 6, 63, 0); // 重构暴跌只剩 1 格
  fillEdit(DROP70, 138, G + 2, 61, 140, G + 2, 63, 'steelSoft');
  // 复制粘贴柱狂长 7 格
  for (let i = 0; i < 7; i++) fillEdit(UP81 + i * .09, 142, G + 2 + i, 61, 144, G + 2 + i, 63, i % 2 ? 'worange' : 'box');
  // 掩盖报错结构：底埋 lava 红灯，上面强行盖石板
  fillEdit(UP47, 146, G + 2, 61, 148, G + 4, 63, 'lava');
  fillEdit(UP47 + .25, 146, G + 5, 61, 148, G + 5, 63, 'stoneSoft');

  shot(C3, C4, {
    day: DUSK, fog: [55, 165], kicks: [[DROP70, .55], [UP81, .5]],
    keys: [
      K(C3, [138.8, G + 6.8, 81], [139.2, G + 4.4, 62], 60),
      K(DROP70, [138.2, G + 6.4, 80.5], [139.0, G + 4.2, 62], 58),
      K(UP81, [139.5, G + 7.4, 82], [139.6, G + 4.8, 62], 60),
      K(C4, [140.2, G + 6.8, 81], [140.0, G + 4.4, 62], 60),
    ],
    act: t => {
      clawd(135.2, G + 1, 65.5, { ...feel('dizzy', t) }, { tag: '超过 6 亿条变更' });
      if (t >= DROP70) label(139, G + 4.2, 62, '-70% 重构', 32, '#9DB4FF', t, DROP70, C4);
      if (t >= UP81) label(143, G + 9.6, 62, '+81% 复制粘贴', 32, '#FFD34E', t, UP81, C4);
      if (t >= UP47) label(147, G + 6.8, 62, '+47% 掩盖报错', 32, '#FF5A5A', t, UP47, C4);
    },
    ui: (c, t) => {
      tagUI(c, 'GitClear 2026.06 · 6亿+变更', 1, '#FFD34E');
      if (t >= WRITEONLY && t < DROP70 + 1.2) slam(c, t, WRITEONLY, '“只写不读”模式！', 680, 78, '#FFD34E', 2.0);
      metricCard(c, t, C3 + .3, C4, '2023 → 2026 代码健康度滑坡', [
        [DROP70, '-70%', '回头重构整理旧代码暴跌', '#72C9FE'],
        [UP81, '+81%', '复制粘贴重复代码暴涨', '#FFD34E'],
        [UP47, '+47%', '用来掩盖报错的结构上升', '#FF5A5A'],
      ], 56, 125, 620);
    },
  });
  sfx(WRITEONLY, 'toast', -9); sfx(DROP70, 'break_stone', -8); sfx(UP81, 'xp', -9); sfx(UP47, 'sizzle', -9);
})();
