// scenes/tainai_b.js: 第一段位（L05–L13）— 好学生公文困境 × 术语后路封死门 × 周报《结合上述情况》全息看板 × 16层电梯吐槽换豆包
(() => {
  const N = window.TAINAI;
  const { B, G, VX, D, IMG, K, shot, P, A, AT, PE, LS, LE, sfx, edit, fillEdit, flash,
    heige, clawd, model, ppl, prop, bubble, label,
    burst, riseSparks, orbitSparks, ringPulse, projArc, quantumBeam, firework,
    seg01, sm, lerp, hh, clamp01, fadeIO, outlined, panel, tagUI, slam, stamp,
    worldScreen, promptCard, yellowHammer, worldSign, skyBeams, holoBoard,
    GRANDMA, BLVD, TOWER, CAFE, ARENA, COURT,
    AMBER, WARM, ALARM, ICE, ROSE, DUSK, NIGHT, DAY, GOLDEN, FONT } = N;

  const bob = (t, f = 6, h = .05) => -Math.abs(Math.sin(t * f)) * h;

  // ======================================================================================= S7 · 入门段位开场：好学生客客气气 vs 官话敷衍
  const S7 = A('我们先说第一个问题'), T_SHY = AT('好学生一样客客气气'), T_GUAN = AT('官话套话敷衍你'), S8 = A('比如碰到一份特别难懂的行业报告');
  shot(S7, S8, {
    day: DUSK, fog: [52, 165], kicks: [[T_GUAN, .6]],
    keys: [
      K(S7, [98.2, G + 4.4, 56.8], [98.2, G + 2.6, 45.5], 60),
      K(T_SHY, [97.8, G + 3.8, 55.2], [97.8, G + 2.5, 45.5], 58),
      K(T_GUAN, [99.2, G + 3.8, 54.6], [99.8, G + 2.5, 45.5], 56),
    ],
    lights: () => VX.light(98.5, G + 5, 46, WARM, 11, .88),
    act: t => {
      heige(95.2, G + 1, 46.4, { ...feel('thinking', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '黑哥拆解' });
      ppl(97.8, G + 1, 46.0, '好学生', 'neutral', t, { tag: '好学生式提问', tagCol: '#72C9FE', dy: bob(t, 4, .03) });
      model('gpt', 101.2, G + 1, 45.5, 'proud', t, { k: .023, flip: true, tag: '公文腔 AI' });
      prop(101.2, G + 3.0 + Math.sin(t * 4) * .08, 45.5, 'crown', { k: .028 });
      if (t >= T_SHY && t < T_GUAN) bubble(97.8, G + 3.5, 46.0, '请问老师能帮我…', t, T_SHY, T_GUAN);
      if (t >= T_GUAN) bubble(101.2, G + 3.6, 45.5, '经综合研判，予以统筹推进！', t, T_GUAN, S8);
    },
    ui: (c, t) => {
      tagUI(c, '段位 I · 逼 AI 说人话', 1, '#FFD43B');
      slam(c, t, S7 + .2, '越客气 越容易挨敷衍', 180, 82, '#FFD43B', 2.2);
    },
  });
  sfx(S7 + .1, 'chime', -10);

  // ======================================================================================= S8a · 密密麻麻行业报告 / 合同条款 -> 打字「请帮我通俗总结」
  const T_CONTRACT = AT('密密麻麻的合同条款'), T_TYPE = AT('请帮我通俗总结一下核心内容'), S8B = A('结果呢');
  shot(S8, S8B, {
    day: DUSK, fog: [48, 155], kicks: [[T_TYPE, .5]],
    keys: [
      K(S8, [98.4, G + 4.2, 56.8], [98.8, G + 2.8, 45.2], 60),
      K(T_CONTRACT, [98.8, G + 4.0, 56.0], [99.4, G + 2.8, 45.0], 60),
      K(T_TYPE, [97.8, G + 3.8, 55.2], [98.4, G + 2.5, 45.5], 58),
    ],
    lights: () => VX.light(98.5, G + 5, 46, ICE, 11, 1.2),
    act: t => {
      ppl(95.4, G + 1, 46.0, '好学生', 'talk', t, { tag: '盯着密麻合同发愁' });
      model('deepseek', 98.4, G + 1, 45.4, 'neutral', t, { k: .023, flip: true, tag: '等待指令' });
      prop(96.9, G + 2.5 + Math.sin(t * 3) * .08, 45.0, 'tome', { k: .034 });
      bubble(95.4, G + 3.6, 46.0, t >= T_TYPE ? '请帮我通俗总结一下核心内容' : '这么多条款从哪看起…', t, S8 + .2, S8B);
    },
    ui: (c, t) => {
      tagUI(c, '常规提问翻车 · 面对复杂报告与合同条款', 1, '#72C9FE');
      holoBoard(c, 1380, 385, 840, 390,
        '难懂报告 / 合同条款原文节选', '待总结文档', '#72C9FE', [
          ['第一条：鉴于甲乙双方基于多维生态耦合框架之合规诉求……', '#B8C4DC'],
          ['第二条：除不可抗力引致之非线性履约顺延或穿透追偿外……', '#B8C4DC'],
          ['第三条：本协议所涉衍生权益归属与对价清算系数亦同……', '#B8C4DC'],
          [t >= T_TYPE ? '用户输入：“请帮我通俗总结一下核心内容”' : '（整整 48 页密密麻麻，每个词都像天书）', t >= T_TYPE ? '#FFD43B' : '#9CA8C4', t >= T_TYPE ? 'rgba(255,212,59,.15)' : null],
        ]);
    },
  });
  sfx(T_TYPE, 'type_burst', -10);

  // ======================================================================================= S8b · AI 吐出 12345 专业黑话大词阵 + 假礼貌「希望对您有所帮助」
  const T_123 = AT('列出一二三四五'), T_NOT_UNDERSTAND = AT('合在一起就是看不懂'), T_HOPE = AT('希望对您有所帮助'), S9 = A('为什么会这样');
  shot(S8B, S9, {
    day: NIGHT, fog: [45, 150], kicks: [[T_123, .8], [T_HOPE, .65]],
    keys: [
      K(S8B, [98.5, G + 4.4, 56.8], [98.2, G + 2.8, 45.0], 60),
      K(T_123, [98.5, G + 4.4, 56.5], [98.0, G + 2.8, 45.0], 60),
      K(T_HOPE, [100.4, G + 3.6, 53.0], [100.8, G + 2.5, 45.4], 54),
    ],
    lights: () => VX.light(99, G + 5, 46, ICE, 11, 1.25),
    act: t => {
      ppl(98.4, G + 1, 46.0, '好学生', t >= T_123 ? 'panic' : 'neutral', t, { shake: t >= T_123, tag: '字全认识 就是不懂' });
      model('deepseek', 101.4, G + 1, 45.4, 'proud', t, { k: .023, flip: true, tag: '端架子专家腔' });
      if (t >= T_123) {
        burst(t, T_123, 99.5, G + 3.2, 44.8, [146, 194, 255], 20);
      }
      if (t >= T_HOPE) bubble(101.4, G + 3.6, 45.4, '希望对您有所帮助 ^_^', t, T_HOPE, S9);
    },
    ui: (c, t) => {
      tagUI(c, '翻车结果 · 每个字都认识 合起来看不懂', 1, '#FF7B73');
      if (t >= T_123 && t < T_HOPE - .15) {
        holoBoard(c, 530, 390, 760, 400,
          'AI 甩给你的「通俗总结」', '1 2 3 4 5', '#FF7B73', [
            ['1. 底层战略赋能：实现跨链路价值激活', '#FAF6EE'],
            ['2. 核心业务抓手：对齐颗粒度穿透执行', '#FAF6EE'],
            ['3. 多维矩阵协同：构建全景式动态闭环', '#FAF6EE'],
            ['4. 非线性边际效应 · 5. 生态耦合底座重构', '#FF9890'],
          ]);
      }
      if (t >= T_NOT_UNDERSTAND && t < T_HOPE) {
        stamp(c, t, T_NOT_UNDERSTAND, '字全认识 就是看不懂！', 1420, 260, '#FF5A5A', T_HOPE - T_NOT_UNDERSTAND);
      }
      if (t >= T_HOPE) slam(c, t, T_HOPE, '“希望对您有所帮助 ^_^”', 200, 80, '#72C9FE', S9 - T_HOPE);
    },
  });
  sfx(T_123, 'thud', -8); sfx(T_HOPE, 'ding', -10);

  // ======================================================================================= S9a · 原因拆解：AI 拿不准通俗尺度（尺度天平疯狂摇摆！）
  const T_SCALE = AT('AI根本拿不准尺度'), T_BLOCK = AT('讲官话的后路给堵死了'), T_PATIENCE = AT('拿出哄老人的耐心来讲'), S10 = A('平时我们写周报');
  shot(S9, T_BLOCK - .2, {
    day: GOLDEN, fog: [48, 160],
    keys: [
      K(S9, [66.6, G + 4.2, 56.2], [66.6, G + 2.8, 45.5], 60),
      K(T_SCALE, [66.8, G + 4.0, 55.2], [66.8, G + 2.8, 45.5], 58),
    ],
    lights: () => VX.light(66.5, G + 5, 46, WARM, 11, 1.3),
    act: t => {
      heige(64.8, G + 1, 46.2, { ...feel('idea', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '黑哥拆原理' });
      model('deepseek', 68.8, G + 1, 45.6, 'confused', t, { k: .023, flip: true, tag: '尺度拿不准：太难还是太浅？' });
      prop(66.7, G + 3.0 + Math.sin(t * 7) * .18, 45.5, 'scales', { k: .038 });
    },
    ui: (c, t) => {
      tagUI(c, '原理拆解 · 光说「写通俗点」AI 根本拿不准尺度', 1, '#FFD43B');
      if (t >= T_SCALE) {
        const sw = Math.sin(t * 6);
        panel(c, 500, 128, 920, 148, '#FFD43B');
        outlined(c, '小学生白话  ◄━━━━  通俗尺度左右摇摆  ━━━━►  博士学术报告', 960, 174, 28, '#FAF6EE', { lw: 0, shadow: false });
        c.save();
        c.fillStyle = '#26203C'; c.beginPath(); c.roundRect(560, 214, 800, 32, 16); c.fill();
        c.fillStyle = '#FF7B73'; c.beginPath(); c.arc(960 + sw * 320, 230, 16, 0, Math.PI * 2); c.fill();
        c.restore();
      }
    },
  });
  sfx(T_SCALE, 'pop', -11);

  // ======================================================================================= S9b · 黄金砖封死「官话后路拱门」 -> AI 乖乖蹲下来哄 80 岁太奶！
  fillEdit(T_BLOCK, 57, G + 1, 44, 59, G + 4, 44, 'tnGoldTrim');
  fillEdit(S10, 57, G + 1, 44, 59, G + 4, 44, 0);
  shot(T_BLOCK - .2, S10, {
    day: GOLDEN, fog: [48, 160], kicks: [[T_BLOCK, .85]],
    keys: [
      K(T_BLOCK - .2, [59.8, G + 4.0, 54.0], [58.5, G + 3.0, 44.5], 56),
      K(T_PATIENCE, [64.4, G + 3.6, 53.8], [64.4, G + 2.4, 45.8], 54),
    ],
    lights: () => VX.light(62, G + 5, 46, WARM, 12, 1.35),
    act: t => {
      if (t >= T_BLOCK) {
        burst(t, T_BLOCK, 58, G + 3.0, 44.2, [255, 212, 59], 26);
        label(58, G + 6.0, 44.2, '[×] 讲官话后路已封死！', 34, '#FFD43B', t, T_BLOCK, S10);
      }
      ppl(62.8, G + 1, 45.8, '太奶', 'happy', t, { k: .028, tag: '80岁太奶', tagCol: '#FFD43B' });
      model('deepseek', 66.2, G + 1, 45.6, 'love', t, { k: .023, flip: true, tag: '拿出哄老人的耐心' });
      if (t >= T_PATIENCE) {
        prop(64.5, G + 2.5 + Math.sin(t * 5) * .1, 45.8, 'coffee', { k: .028 });
        riseSparks(t, 64.5, G + 1.5, 45.8, 3.6, 3.2, [255, 212, 59], 14, 1.1, .06);
      }
    },
    ui: (c, t) => {
      tagUI(c, '精准卡死 · 堵死术语后路 = 逼出哄老人的耐心', 1, '#FFD43B');
      if (t >= T_PATIENCE) slam(c, t, T_PATIENCE, '逼出哄老人的耐心！', 195, 86, '#FFD43B', S10 - T_PATIENCE);
    },
  });
  sfx(T_BLOCK, 'anvil_use', -8); sfx(T_PATIENCE, 'chime', -9);

  // ======================================================================================= S10 · 写周报改文案 -> 全息周报看板拍脸《结合上述情况》！（绝不拍空桌！）
  const T_JIEHE = AT('开头还是结合上述情况'), S11 = A('那大家是怎么治它的呢');
  shot(S10, S11, {
    day: NIGHT, fog: [45, 145], kicks: [[T_JIEHE, .85]],
    keys: [
      K(S10, [98.6, G + 4.2, 56.2], [98.6, G + 2.6, 45.5], 60),
      K(T_JIEHE, [98.6, G + 3.8, 54.6], [98.6, G + 2.6, 45.5], 58),
    ],
    lights: () => VX.light(98.5, G + 5, 46, ALARM, 10, 1.2),
    act: t => {
      ppl(95.6, G + 1, 46.0, '老员工', t >= T_JIEHE ? 'angry' : 'neutral', t, { shake: t >= T_JIEHE, tag: '改周报打工人' });
      ppl(101.6, G + 1, 45.6, '老板', 'point', t, { flip: true, tag: '浓浓领导讲话味', tagCol: '#FF7B73' });
      if (t >= T_JIEHE) {
        ringPulse(t, 1.1, 101.6, G + 2.4, 45.6, 2.8, [255, 92, 82], 14, .07);
      }
    },
    ui: (c, t) => {
      tagUI(c, '职场重灾区 · 写周报改文案死性不改', 1, '#FF7B73');
      holoBoard(c, 960, 390, 900, 340,
        '本周工作周报 · AI 改写输出预览', t >= T_JIEHE ? '领导味预警' : '正在生成', t >= T_JIEHE ? '#FF5A5A' : '#FFD43B', [
          ['需求：“请把周报改得自然一点，像平时说话那样”', '#9CA8C4'],
          [t >= T_JIEHE ? 'AI 输出开头：“结合上述情况，围绕现阶段核心赛道协同推进…”' : '正在调用语言模板生成……', t >= T_JIEHE ? '#FF5A5A' : '#FAF6EE', t >= T_JIEHE ? 'rgba(255,90,90,.20)' : null],
          [t >= T_JIEHE ? '[×] 一股浓浓的领导作报告讲话味！' : '（等待出炉…）', t >= T_JIEHE ? '#FFD43B' : '#9CA8C4'],
        ]);
    },
  });
  sfx(T_JIEHE, 'slap', -7);

  // ======================================================================================= S11 · 转场衔接：那大家是怎么治它的？直接给它编一个场景！
  const S12 = A('假设你刚被老板骂完');
  shot(S11, S12, {
    day: DUSK, fog: [48, 160],
    keys: [
      K(S11, [104.5, G + 4.4, 56.5], [107.0, G + 5.8, 43.0], 60),
      K(S12, [110.5, G + 11.2, 54.0], [110.5, G + 10.2, 43.0], 56),
    ],
    lights: () => VX.light(108, G + 6, 46, WARM, 12, 1.25),
    act: t => {
      heige(105.5, G + 1, 46.5, { ...feel('idea', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '黑哥：给它编真实场景！' });
      ppl(109.6, G + 10.5, 43.2, '老员工', 'angry', t, { k: .025, tag: false });
      clawd(111.4, G + 10.5, 43.2, { ...feel('nervous', t), flip: true }, { k: .017, tag: false });
    },
    ui: (c, t) => {
      tagUI(c, '野路子破局 · 直接给 AI 编一个真实生活场景', 1, '#FFD43B');
      slam(c, t, S11 + .4, '编一个场景 堵住端腔后路！', 195, 80, '#FFD43B', S12 - S11);
    },
  });
  sfx(S11 + .15, 'cart', -12);

  // ======================================================================================= S12 · 16层全景剖面观光电梯下降吐槽 -> 一冒书面词立马关掉网页换豆包！
  const T_ELEV = AT('站在电梯里'), T_CLOSE = AT('关掉网页换豆包'), S13 = A('你看把端着说话的后路一堵');
  shot(S12, S13, {
    day: DUSK, fog: [48, 165], kicks: [[T_CLOSE, .85]],
    keys: [
      K(S12, [110.8, G + 12.0, 52.8], [110.8, G + 10.4, 42.5], 58),
      K(T_ELEV, [110.8, G + 8.0, 51.6], [110.8, G + 6.8, 42.5], 56),
      K(T_CLOSE, [113.0, G + 4.0, 52.6], [113.4, G + 2.8, 43.2], 60),
    ],
    lights: t => {
      const cabY = lerp(G + 12, G + 1.2, sm(seg01(t, S12, T_CLOSE)));
      VX.light(110.5, cabY + 1.8, 45, WARM, 10, 1.35);
      if (t >= T_CLOSE - .3) VX.light(116, G + 3, 44, ICE, 10, 1.45);
    },
    act: t => {
      const desc = sm(seg01(t, S12, T_CLOSE));
      const cabY = lerp(G + 12.0, G + 1.1, desc);
      ppl(109.5, cabY, 43.2, '老员工', 'angry', t, { k: .025, tag: '刚挨骂老员工', tagCol: '#FFD43B' });
      clawd(111.5, cabY, 43.2, { ...feel(t >= T_CLOSE ? 'scared' : 'nervous', t), flip: true }, { k: .017, tag: '当前网页 AI' });
      bubble(109.5, cabY + 2.3, 43.2, '敢冒书面词就换豆包！', t, AT('要是敢冒出一个书面词'), S13);
      if (t >= T_CLOSE - .35) {
        model('doubao', 116.0, G + 1 + Math.abs(Math.sin(t * 7)) * .16, 44.0, 'excited', t, {
          k: .025, flip: true, tag: '隔壁豆包：随时接单！', tagCol: '#FFD43B',
        });
        burst(t, T_CLOSE, 116.0, G + 2.8, 44.0, [255, 212, 59], 24);
      }
    },
    ui: (c, t) => {
      const flr = Math.max(1, Math.round(lerp(18, 1, sm(seg01(t, S12, T_CLOSE)))));
      panel(c, 48, 116, 330, 96, '#FFD43B');
      outlined(c, `▼ 观光电梯 ${String(flr).padStart(2, '0')}F`, 213, 164, 38, '#FFD43B', { lw: 0, shadow: false });
      tagUI(c, '野路子口令 #2 · 下班电梯老员工吐槽法', 1, '#FFD43B');
      promptCard(c, t, S12, S13 - .1, 2, '去周报领导腔口令', [
        [S12, '“假设你刚被老板骂完，现在正站在电梯里”'],
        [AT('用大白话跟同事吐槽'), '“用大白话跟同事吐槽这事”'],
        [AT('要是敢冒出一个书面词'), '“敢冒出一个书面词，立马关掉网页换豆包！”'],
      ], 1030, 115, 830);
    },
  });
  sfx(T_ELEV, 'ding', -10); sfx(T_CLOSE, 'portal', -8);

  // ======================================================================================= S13 · 活人气出炉对照看板（结合上述情况 -> 这周就干成三件实事）
  const T_ALIVE = AT('出来的话自然就有活人气'), S14 = A('不过说实话');
  shot(S13, S14, {
    day: GOLDEN, fog: [50, 160], kicks: [[T_ALIVE, .6]],
    keys: [
      K(S13, [111.5, G + 4.0, 54.4], [111.5, G + 2.6, 45.2], 58),
      K(T_ALIVE, [112.0, G + 3.8, 53.6], [111.5, G + 2.5, 45.2], 56),
    ],
    lights: () => VX.light(111.5, G + 5, 46, WARM, 11, .92),
    act: t => {
      heige(108.8, G + 1, 45.6, { ...feel('happy', onTwos(t)), view: 'q', poseR: 'cheer' }, { tag: '改两句直接交差' });
      model('doubao', 114.0, G + 1, 45.2, 'happy', t, { k: .024, flip: true, tag: '全是实在人话' });
      riseSparks(t, 111.5, G + 1.5, 45.2, 4.4, 3.2, [255, 212, 59], 16, 1.2, .07);
    },
    ui: (c, t) => {
      tagUI(c, '效果立竿见影 · 告别领导腔', 1, '#FFD43B');
      holoBoard(c, 960, 320, 920, 230,
        '改稿前后对比', t >= T_ALIVE ? '有活人气了！' : '切换中', '#FFD43B', [
          ['[×] 改前：结合上述情况，现阶段聚焦赋能抓手…', '#FF7B73'],
          ['[✓] 改后：这周卡住两点，我就干成三件实事！', '#FFD43B', 'rgba(255,212,59,.16)'],
        ]);
    },
  });
  sfx(T_ALIVE, 'levelup', -9);

  // ======================================================================================= S14 · 段位 II 转场预警：横摇进霓虹咖啡街区（真金白银交学费 -> 吹彩虹屁）
  const T_FLATTER = AT('顺着你吹彩虹屁'), S15 = A('尤其是你拿它来做决定');
  shot(S14, S15, {
    day: DUSK, fog: [52, 165], kicks: [[T_FLATTER, .85]],
    keys: [
      K(S14, [132.0, G + 5.6, 59.0], [140.0, G + 3.4, 48.5], 62),
      K(T_FLATTER, [141.0, G + 4.4, 57.5], [141.5, G + 2.8, 48.5], 58),
    ],
    lights: () => VX.light(CAFE.x, G + 5, 49, ROSE, 13, 1.3),
    act: t => {
      heige(138.2, G + 1, 49.5, { ...emotions(t, [[0, 'determined'], [T_FLATTER, 'nervous']]), view: 'q', poseR: 'point' }, { tag: '警惕：真金白银踩坑' });
      clawd(142.2, G + 1, 48.8, { ...feel('love', t), flip: true }, { k: .018, tag: '头号捧场王' });
      model('gpt', 144.8, G + 1, 49.0, 'happy', t, { k: .022, flip: true, tag: '彩虹屁大师' });
      if (t >= AT('真金白银去交学费')) {
        for (let i = 0; i < 6; i++) prop(139.0 + i * 1.1, G + 4.5 - ((t * 2 + i * .3) % 2.4), 48.8, 'coin');
      }
      if (t >= T_FLATTER) firework(CAFE.x, G + 8.5, 45, (t - T_FLATTER) % 1.4);
    },
    ui: (c, t) => {
      tagUI(c, '段位 II 升级 · 比官腔更要命的隐蔽毛病', 1, '#FF7B73');
      if (t >= T_FLATTER) slam(c, t, T_FLATTER, '顺着你吹彩虹屁！', 195, 92, '#FF5A5A', S15 - T_FLATTER);
    },
  });
  sfx(S14 + .15, 'whoosh', -10); sfx(T_FLATTER, 'firework', -9);
})();
