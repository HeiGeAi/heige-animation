// scenes/baolei_e.js: Act V — 客观评价 AI 搭把手 -> 搬砖 vs 承重墙 -> 三条保命铁律详拆 -> 结尾呼应老码农 -> 提问互动 -> 签名收尾
(() => {
  const N = window.BAOLEI;
  const { B, G, VX, D, K, shot, P, A, AT, sfx, edit, fillEdit, flash,
    heige, clawd, model, ppl, prop, bubble, label, burst,
    seg01, sm, lerp, hh, clamp01, tagUI, slam, toast, stamp, ruleCard, questionCard, signOff,
    IRON, HOST, AMBER, WARM, ALARM, DUSK, NIGHT, DAY } = N;

  const bob = (t, f = 8, h = .07) => -Math.abs(Math.sin(t * f)) * h;

  // ======================================================================================= E1 · 先别一棍子打死：AI 省搬砖，承重墙一分钟不能省
  const WALL_WARN = AT('看懂承重墙'), E2 = A('最后这三条保命铁律');
  shot(A('先别把AI一棍子打死'), E2, {
    day: DAY, fog: [55, 165],
    keys: [
      K(A('先别把AI一棍子打死'), [104, G + 4.8, 76], [104, G + 2.2, 67], 56),
      K(AT('错在拿高速喷枪'), [101, G + 4.4, 74], [103, G + 2.2, 67], 52),
      K(WALL_WARN, [98, G + 4.4, 73], [100, G + 2.2, 67], 50),
    ],
    lights: () => VX.light(104, G + 5, 70, WARM, 11, 1.15),
    act: t => {
      heige(102, G + 1, 68.5, { ...emotions(t, [[0, 'happy'], [AT('错在拿高速喷枪'), 'determined']]), view: 'q' }, { tag: '黑哥' });
      clawd(105.5, G + 1, 68.5, { ...feel('happy', t), flip: true }, { k: .016, tag: '好助手 Claude' });
      model('deepseek', 107.8, G + 1, 68.5, 'happy', t, { k: .020 });
      model('doubao', 109.8, G + 1, 68.5, 'happy', t, { k: .020 });
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
      K(E2, [98.6, G + 4.8, 79.0], [99.0, G + 3.4, 67], 58),
      K(R1_1, [98.4, G + 4.8, 78.5], [98.8, G + 3.5, 67], 58),
      K(E3, [99.2, G + 5.0, 79.0], [99.2, G + 3.6, 67], 58),
    ],
    act: t => {
      heige(94.2, G + 1, 68.5, { ...feel('proud', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '黑哥' });
      if (t >= R1_3 + .35) burst(t, R1_3 + .35, 97, G + 6.5, 67, [255, 212, 59], 18);
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
      K(E3, [106.0, G + 4.0, 78.2], [106.4, G + 2.5, 68.2], 58),
      K(MINS, [105.8, G + 3.9, 77.6], [106.2, G + 2.5, 68.2], 56),
      K(E4, [106.4, G + 4.2, 78.2], [106.5, G + 2.6, 68.2], 58),
    ],
    act: t => {
      const bmb = t >= BOMB2;
      heige(102.2, G + 1, 68.5, { ...feel(bmb ? 'nervous' : 'idea', onTwos(t)), view: 'front', poseR: 'wave' }, { tag: '脱稿讲清楚自检' });
      ppl(106.0, G + 1, 68.2, '开发', bmb ? 'panic' : 'neutral', t, { flip: true, tag: bmb ? '讲不清 = 危险!' : '关屏幕讲清楚', tagCol: bmb ? '#FF5A5A' : '#72C9FE' });
      if (bmb) prop(106.0, G + 3.2, 68.2, 'bomb', { k: .038 });
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
  fillEdit(SEP_T, 112, G + 5, 64, 112, G + 7, 69, 'obsidian');
  fillEdit(SEP_T + .15, 112, G + 8, 64, 112, G + 8, 69, 'goldSoft');

  shot(E4, E5, {
    day: DUSK, fog: [48, 150], kicks: [[SEP_T, .75]],
    keys: [
      K(E4, [110.5, G + 5.6, 81.5], [109.8, G + 3.4, 66.5], 60),
      K(SEP_T, [110.5, G + 6.0, 81.0], [109.8, G + 3.8, 66.5], 58),
      K(E5, [111.0, G + 5.6, 80.5], [110.0, G + 3.6, 66.5], 58),
    ],
    act: t => {
      // 测试库 (x=109..110, z=65..67) 前方的 AI 站在 z=68.5；生产库 (114..115, z=65..67) 前方站黑哥
      clawd(108.8, G + 1, 68.8, { ...feel('confused', t) }, { k: .015, tag: '测试库' });
      model('deepseek', 110.2, G + 1, 69.5, 'happy', t, { k: .018, tag: false });
      heige(114.6, G + 1, 68.6, { ...feel('proud', onTwos(t)), view: 'q', flip: true }, { tag: '生产库 / 账本兜底' });
      label(112, G + 8.8, 66.5, '[墙] 物理隔离墙', 36, '#FFD34E', t, SEP_T, E5);
      if (t >= SEP_T) burst(t, SEP_T, 112, G + 7.5, 66.5, [255, 212, 59], 20);
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
      K(E5, [HOST.x - 1.2, G + 3.0, HOST.z + 5.2], [HOST.x, G + 2.8, HOST.scrZ], 54),
      K(HUMAN_END, [HOST.x, G + 3.2, HOST.z + 6.0], [HOST.x, G + 2.6, HOST.z - .5], 54),
      K(Q_START, [HOST.x + .4, G + 3.4, HOST.z + 6.8], [HOST.x, G + 2.6, HOST.z], 56),
      K(END_T, [HOST.x, G + 4.4, HOST.z + 9.5], [HOST.x, G + 2.6, HOST.scrZ], 60),
    ],
    lights: () => {
      VX.light(HOST.x, G + 5, HOST.z, WARM, 12, 1.2);
      VX.light(HOST.x, G + 5, HOST.scrZ + 2, AMBER, 10, 1.1);
    },
    act: t => {
      const sign = t >= SIGN_START;
      // 屏幕中老码农呼应退场
      if (t < HUMAN_END + 1.5) {
        ppl(HOST.x, G + 2.2, HOST.scrZ + .6, '老码农', 'talk', t, { k: .024, tag: '老码农提醒' });
      }
      // 黑哥与模型伙伴站在主台前正面致意
      heige(HOST.x, G + 1, HOST.z - .4, {
        ...emotions(t, [[0, 'determined'], [Q_START, 'thinking'], [SIGN_START, 'happy']]),
        view: 'front', poseR: sign ? 'wave' : undefined,
      }, { tag: '问问黑哥' });
      clawd(HOST.x - 2.6, G + 1, HOST.z + .2, { ...feel('happy', t) }, { k: .016, tag: false });
      model('deepseek', HOST.x + 2.4, G + 1, HOST.z + .2, 'happy', t, { k: .020, tag: false });
      model('doubao', HOST.x + 4.2, G + 1, HOST.z + .6, 'happy', t, { k: .020, tag: false });
    },
    ui: (c, t) => {
      if (t >= HUMAN_END && t < Q_START) toast(c, t, HUMAN_END, '塌楼赔钱那天 · 签字背锅的还是活人', 175, '#FFD34E', Q_START - HUMAN_END);
      if (t >= Q_START && t < SIGN_START) questionCard(c, t, Q_START, SIGN_START - .1);
      if (t >= SIGN_START) signOff(c, t, SIGN_START, END_T + .5);
    },
  });
  sfx(Q_START, 'pop', -9); sfx(SIGN_START, 'chime', -8);
})();
