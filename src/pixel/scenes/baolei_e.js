// scenes/baolei_e.js: Act V — 客观评价 AI 搭把手 -> 搬砖 vs 承重墙 -> 三条保命铁律详拆 -> 结尾呼应老码农 -> 提问互动 -> 签名收尾
(() => {
  const N = window.BAOLEI;
  const { B, G, VX, D, K, shot, P, A, AT, sfx, edit, fillEdit, flash,
    heige, clawd, model, ppl, prop, bubble, label, burst, orbitSparks, riseSparks, ringPulse, projArc,
    seg01, sm, lerp, hh, clamp01, tagUI, slam, toast, stamp, ruleCard, questionCard, signOff,
    IRON, HOST, AMBER, WARM, ALARM, DUSK, NIGHT, DAY } = N;

  const bob = (t, f = 8, h = .07) => -Math.abs(Math.sin(t * f)) * h;

  // ======================================================================================= E1 · 先别一棍子打死：AI 省搬砖，承重墙一分钟不能省
  const WALL_WARN = AT('看懂承重墙'), E2 = A('最后这三条保命铁律');
  shot(A('先别把AI一棍子打死'), E2, {
    day: DAY, fog: [55, 165],
    keys: [
      K(A('先别把AI一棍子打死'), [104.8, G + 4.8, 76.2], [104, G + 2.2, 67], 56),
      K(AT('错在拿高速喷枪'), [101.2, G + 4.4, 74.0], [102.5, G + 2.2, 67], 52),
      K(WALL_WARN, [97.4, G + 4.4, 73.0], [99.6, G + 2.2, 67], 50),
    ],
    lights: t => VX.light(104, G + 5, 70, WARM, 11, 1.15 + .12 * Math.sin(t * 4)),
    act: t => {
      const hv = Math.sin(t * 4.2) * .16;
      heige(102, G + 1, 68.5, { ...emotions(t, [[0, 'happy'], [AT('错在拿高速喷枪'), 'determined']]), view: 'q', poseR: t >= WALL_WARN ? 'point' : undefined }, { tag: '黑哥', dy: bob(t, 4, .03) });
      clawd(105.5, G + 1 + hv, 68.5, { ...feel('happy', t), flip: true }, { k: .016, tag: '好助手 Claude' });
      model('deepseek', 107.8, G + 1 - hv, 68.5, 'happy', t, { k: .020 });
      model('doubao', 109.8, G + 1 + hv * .8, 68.5, 'happy', t, { k: .020 });
      // AI 帮搬砖，金色粒子源源不断飞向承重工作台
      const p1 = (t * 1.1) % 1, p2 = (t * 1.1 + .5) % 1;
      projArc(p1, 0, 1, 105.5, G + 2.0, 68.5, 97, G + 2.2, 67, 1.3, [255, 212, 59], .09);
      projArc(p2, 0, 1, 107.8, G + 2.0, 68.5, 97, G + 2.2, 67, 1.4, [114, 201, 254], .09);
      riseSparks(t, 97, G + 1.6, 67, 2.2, 3.0, [255, 212, 59], 10, 1.1, .06);
      if (t >= WALL_WARN) {
        prop(102, G + 2.9 + Math.sin(t * 5) * .12, 68.2, 'shield', { k: .026 });
        ringPulse(t, 1.5, 97, G + 2.2, 67, 2.8, [255, 212, 59], 14, .07);
      }
    },
    ui: (c, t) => {
      tagUI(c, '用对 AI · 苦力 vs 兜底', 1, '#FFD34E');
      if (t >= WALL_WARN) slam(c, t, WALL_WARN, '看懂承重墙 一分钟不能省！', 210, 78, '#FFD34E', 2.4);
    },
  });
  sfx(A('先别把AI一棍子打死') + .15, 'chime', -10);

  // ======================================================================================= E2 · 铁律 1：亲手定死承重墙（数据打哪来、核心分几步、崩了怎么撤回）
  const R1_1 = AT('数据打哪来'), R1_2 = AT('核心分几步'), R1_3 = AT('崩了怎么撤回'), E3 = A('第二条点提交前关掉AI');
  // 铁律 1 四根稳固承重柱逐一立起 (x=96,98; z=66,68)
  fillEdit(R1_1, 96, G + 2, 66, 96, G + 6, 66, 'goldSoft');
  fillEdit(R1_2, 98, G + 2, 66, 98, G + 6, 66, 'goldSoft');
  fillEdit(R1_3, 96, G + 2, 68, 96, G + 6, 68, 'obsidian');
  fillEdit(R1_3 + .2, 98, G + 2, 68, 98, G + 6, 68, 'obsidian');
  fillEdit(R1_3 + .35, 96, G + 6, 66, 98, G + 6, 68, 'goldSoft');

  shot(E2, E3, {
    day: DAY, fog: [50, 155], kicks: [[R1_3 + .35, .45]],
    keys: [
      K(E2, [99.6, G + 5.2, 82.0], [98.8, G + 3.4, 67], 60),
      K(R1_1, [97.4, G + 5.4, 81.0], [98.4, G + 3.6, 67], 59),
      K(R1_3, [95.8, G + 5.6, 80.5], [98.0, G + 3.8, 67], 60),
      K(E3, [99.4, G + 5.2, 81.2], [99.0, G + 3.6, 67], 60),
    ],
    lights: t => VX.light(97, G + 5, 67, WARM, 9, 1.15 + .15 * Math.sin(t * 5)),
    act: t => {
      heige(94.2, G + 1, 68.5, { ...feel('proud', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '黑哥', dy: bob(t, 4, .03) });
      prop(97, G + 3.0 + Math.sin(t * 4) * .15, 67, 'shield', { k: .028 });
      prop(95.2, G + 2.4 - Math.sin(t * 4) * .12, 68.0, 'wrench', { k: .022 });
      riseSparks(t, 97, G + 2.0, 67, 2.4, 4.6, [255, 212, 59], 14, 1.1, .07);
      if (t >= R1_1) orbitSparks(t, 96, G + 4.5, 66, .8, [255, 212, 59], 4, 3.0, .06);
      if (t >= R1_2) orbitSparks(t, 98, G + 4.5, 66, .8, [114, 201, 254], 4, -3.2, .06);
      if (t >= R1_3 + .35) {
        burst(t, R1_3 + .35, 97, G + 6.5, 67, [255, 212, 59], 18);
        ringPulse(t, 1.6, 97, G + 6.4, 67, 2.8, [255, 212, 59], 14, .07);
      }
      label(97, G + 7.5, 67, '承重墙已立稳 [OK]', 36, '#FFD34E', t, R1_3 + .3, E3);
    },
    ui: (c, t) => {
      tagUI(c, '保命铁律 1 / 3', 1, '#FFD34E');
      ruleCard(c, t, E2, E3, 1, '动手前先用人话定死承重墙', [
        [R1_1, '1 · 数据打哪来（输入源头）'],
        [R1_2, '2 · 核心分几步（关键链路）'],
        [R1_3, '3 · 崩了怎么撤回（回滚兜底）'],
      ], 1100, 120, 760);
    },
  });
  sfx(E2 + .1, 'levelup', -9); sfx(R1_1, 'place', -9); sfx(R1_2, 'place', -9); sfx(R1_3, 'anvil', -8);

  // ======================================================================================= E3 · 铁律 2：关掉 AI，脱稿讲清楚（定时炸弹对比）
  const MINS = AT('AI三分钟吐出的东西'), BOMB2 = AT('定时炸弹'), E4 = A('第三条要命的底线');
  shot(E3, E4, {
    day: DUSK, fog: [48, 150], kicks: [[BOMB2, .6]],
    keys: [
      K(E3, [106.4, G + 4.1, 78.4], [106.4, G + 2.5, 68.2], 58),
      K(MINS, [104.8, G + 3.8, 77.2], [106.0, G + 2.5, 68.2], 55),
      K(BOMB2, [106.8, G + 4.0, 77.8], [106.5, G + 2.6, 68.2], 57),
      K(E4, [105.6, G + 4.2, 78.4], [106.4, G + 2.6, 68.2], 58),
    ],
    lights: t => {
      const bmb = t >= BOMB2;
      VX.light(104, G + 4.2, 68, bmb ? ALARM : WARM, 9, bmb ? 1.1 + .3 * Math.sin(t * 14) : 1.0 + .15 * Math.sin(t * 5));
    },
    act: t => {
      const bmb = t >= BOMB2;
      heige(102.2, G + 1, 68.5, { ...feel(bmb ? 'nervous' : 'idea', onTwos(t)), view: 'front', poseR: 'wave' }, { tag: '脱稿讲清楚自检', dy: bob(t, 4, .03) });
      const sw = bmb ? 0 : Math.sin(t * 3.0) * .35;
      ppl(106.0 + sw, G + 1, 68.2, '开发', bmb ? 'panic' : 'neutral', t, {
        walk: !bmb, shake: bmb, flip: true,
        tag: bmb ? '讲不清 = 危险!' : '关屏幕讲清楚', tagCol: bmb ? '#FF5A5A' : '#72C9FE',
      });
      if (!bmb) {
        prop(104.2, G + 2.8 + Math.sin(t * 4) * .12, 67.2, 'clock', { k: .024 });
        orbitSparks(t, 102.2, G + 2.9, 68.5, .9, [255, 212, 59], 4, 2.8, .06);
      } else {
        prop(106.0, G + 3.2 + Math.sin(t * 11) * .10, 68.2, 'bomb', { k: .038 });
        ringPulse(t, .95, 106.0, G + 3.2, 68.2, 3.2, [255, 86, 70], 16, .08);
        riseSparks(t, 106.0, G + 2.6, 68.2, 1.8, 3.0, [255, 96, 80], 10, 1.3, .07);
        orbitSparks(t, 106.0, G + 3.4, 68.2, .75, [255, 212, 59], 4, 4.4, .06);
      }
    },
    ui: (c, t) => {
      tagUI(c, '保命铁律 2 / 3', 1, '#FFD34E');
      ruleCard(c, t, E3, E4, 2, '点提交前关掉AI · 脱稿讲清楚', [
        [E3 + .2, '[×] 屏幕已熄灭：脱离 AI 独立过逻辑'],
        [MINS, '[记] 花 20 分钟理明白 -> 保住年底饭碗'],
        [BOMB2, '[!] 讲不清楚？这就是写你名字的定时炸弹'],
      ], 1100, 120, 760);
    },
  });
  sfx(E3 + .1, 'click', -8); sfx(MINS, 'ding', -9); sfx(BOMB2, 'tick', -8);

  // ======================================================================================= E4 · 铁律 3：物理隔开（测试库 vs 生产库 + 手工公式验算）
  const SEP_T = AT('测试库和生产库彻底隔死'), CALC_T = AT('手工公式反向验算一遍'), E5 = A('现在回头看那条视频里说的');
  // 黑曜石金边防火墙猛然升起再加高两层 (x=112，匹配 IRON 区隔离墙坐标)
  fillEdit(SEP_T, 112, G + 5, 63, 112, G + 7, 66, 'obsidian');
  fillEdit(SEP_T + .15, 112, G + 8, 63, 112, G + 8, 66, 'goldSoft');

  shot(E4, E5, {
    day: DUSK, fog: [48, 150], kicks: [[SEP_T, .75]],
    keys: [
      K(E4, [111.8, G + 5.8, 82.0], [110.2, G + 3.4, 66.0], 60),
      K(SEP_T, [109.8, G + 6.4, 80.8], [110.2, G + 3.8, 66.0], 59),
      K(CALC_T, [112.0, G + 5.8, 80.5], [110.6, G + 3.6, 66.0], 58),
      K(E5, [110.5, G + 5.4, 81.2], [110.2, G + 3.5, 66.0], 59),
    ],
    act: t => {
      const hv = Math.sin(t * 4.5) * .16;
      // 测试库 (x=109..110, z=65..67) 前方的 AI 站在 z=68.5；生产库 (114..115, z=65..67) 前方站黑哥
      clawd(108.8, G + 1 + hv, 68.8, { ...feel('confused', t) }, { k: .015, tag: '测试库' });
      model('deepseek', 110.2, G + 1 - hv, 69.5, 'happy', t, { k: .018, tag: false });
      heige(114.6, G + 1, 68.6, { ...feel('proud', onTwos(t)), view: 'q', flip: true }, { tag: '生产库 / 账本兜底', dy: bob(t, 4, .03) });
      prop(114.6, G + 2.9 + Math.sin(t * 4) * .1, 67.6, 'shield', { k: .024 });
      riseSparks(t, 114.8, G + 1.8, 66.5, 2.2, 3.6, [255, 212, 59], 10, 1.0, .06);
      label(112, G + 8.8, 66.5, '[墙] 物理隔离墙', 36, '#FFD34E', t, SEP_T, E5);
      if (t >= SEP_T) {
        burst(t, SEP_T, 112, G + 7.5, 66.5, [255, 212, 59], 20);
        // 测试 AI 尝试穿透隔离墙，被金边墙弹回爆炸火花
        const cy = ((t - SEP_T) * .9) % 1;
        projArc(cy, 0, 1, 109.2, G + 2.4, 67.8, 111.7, G + 4.2, 66.8, .5, [255, 92, 82], .10);
        if (cy > .85) ringPulse(cy - .85, .15, 111.7, G + 4.2, 66.8, 1.4, [255, 212, 59], 10, .06);
      }
      if (t >= CALC_T) prop(115.6, G + 2.6 + Math.sin(t * 6) * .15, 66.5, 'coin', { k: .024 });
    },
    ui: (c, t) => {
      tagUI(c, '保命铁律 3 / 3', 1, '#FFD34E');
      ruleCard(c, t, E4, E5, 3, '用死规矩跟 AI 物理隔开', [
        [E4 + .2, '[×] 禁止同一个 AI 自己查自己'],
        [SEP_T, '[墙] 测试库 / 生产库 权限彻底隔死'],
        [CALC_T, '[算] 账目表格 手工公式反向验算'],
      ], 60, 120, 740);
    },
  });
  flash(SEP_T, '#FFD43B', .35, .25);
  sfx(SEP_T, 'anvil', -6); sfx(CALC_T, 'ding', -9);

  // ======================================================================================= E5 · 结尾呼应老码农 + 互动提问 + 关注/点赞/签名
  const HUMAN_END = AT('算力再快也只是替你砌墙'), Q_START = AT('现在你们公司推AI'), SIGN_START = AT('关注问问黑哥');
  const END_T = D.len || 448;
  shot(E5, END_T, {
    day: DUSK, fog: [55, 175],
    keys: [
      K(E5, [HOST.x - 1.5, G + 3.0, HOST.z + 5.4], [HOST.x, G + 2.8, HOST.scrZ], 54),
      K(HUMAN_END, [HOST.x + .4, G + 3.2, HOST.z + 6.2], [HOST.x, G + 2.6, HOST.z - .5], 54),
      K(Q_START, [HOST.x + .8, G + 3.6, HOST.z + 7.4], [HOST.x, G + 2.6, HOST.z], 56),
      K(END_T, [HOST.x - .6, G + 4.8, HOST.z + 10.6], [HOST.x, G + 2.8, HOST.scrZ], 60),
    ],
    lights: t => {
      VX.light(HOST.x, G + 5, HOST.z, WARM, 12, 1.2 + .12 * Math.sin(t * 4));
      VX.light(HOST.x, G + 5, HOST.scrZ + 2, AMBER, 10, 1.1);
    },
    act: t => {
      const sign = t >= SIGN_START, hv = Math.sin(t * 4.2) * .14;
      // 屏幕中老码农呼应退场
      if (t < HUMAN_END + 1.5) {
        ppl(HOST.x, G + 2.2, HOST.scrZ + .6, '老码农', 'talk', t, { k: .024, dy: bob(t, 6, .03), tag: '老码农提醒' });
        ringPulse(t, 1.5, HOST.x, G + 3.8, HOST.scrZ + 1.2, 2.8, [255, 212, 59], 12, .06);
      }
      // 黑哥与模型伙伴站在主台前正面致意 + 节日金光粒子
      heige(HOST.x, G + 1, HOST.z - .4, {
        ...emotions(t, [[0, 'determined'], [Q_START, 'thinking'], [SIGN_START, 'happy']]),
        view: 'front', poseR: sign ? 'wave' : undefined,
      }, { tag: '问问黑哥', dy: bob(t, 4, .03) });
      clawd(HOST.x - 2.6, G + 1 + Math.abs(hv), HOST.z + .2, { ...feel('happy', t) }, { k: .016, tag: false });
      model('deepseek', HOST.x + 2.4, G + 1 + hv, HOST.z + .2, 'happy', t, { k: .020, tag: false });
      model('doubao', HOST.x + 4.2, G + 1 - hv, HOST.z + .6, 'happy', t, { k: .020, tag: false });
      riseSparks(t, HOST.x, G + 1.5, HOST.z, 9.0, 4.5, [255, 212, 59], 18, .9, .06);
      if (sign) orbitSparks(t, HOST.x, G + 3.0, HOST.z - .4, 1.4, [255, 212, 59], 5, 2.5, .07);
    },
    ui: (c, t) => {
      if (t >= HUMAN_END && t < Q_START) toast(c, t, HUMAN_END, '塌楼赔钱那天 · 签字背锅的还是活人', 175, '#FFD34E', Q_START - HUMAN_END);
      if (t >= Q_START && t < SIGN_START) questionCard(c, t, Q_START, SIGN_START - .1);
      if (t >= SIGN_START) signOff(c, t, SIGN_START, END_T + .5);
    },
  });
  sfx(Q_START, 'pop', -9); sfx(SIGN_START, 'chime', -8);
})();
