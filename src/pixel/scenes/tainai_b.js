// scenes/tainai_b.js: 第一段位（L05–L13）— 摩天写字楼公文牢笼 vs 16层现代玻璃观光电梯吐槽舱（逼 AI 说人话）
(() => {
  const N = window.TAINAI;
  const { B, G, VX, D, IMG, K, shot, P, A, AT, PE, LS, LE, sfx, edit, fillEdit, flash,
    heige, clawd, model, ppl, prop, bubble, label,
    burst, riseSparks, orbitSparks, ringPulse, projArc, quantumBeam, firework,
    seg01, sm, lerp, hh, clamp01, fadeIO, outlined, panel, tagUI, slam, stamp,
    worldScreen, promptCard, yellowHammer, worldSign, skyBeams,
    GRANDMA, BLVD, TOWER, CAFE, ARENA, COURT,
    AMBER, WARM, ALARM, ICE, ROSE, DUSK, NIGHT, DAY, GOLDEN, FONT } = N;

  const bob = (t, f = 6, h = .05) => -Math.abs(Math.sin(t * f)) * h;

  // ======================================================================================= S7 · 入门段位开场：好学生客客气气 vs 官话敷衍
  const S7 = A('我们先说第一个问题'), T_SHY = AT('好学生一样客客气气'), S8 = A('比如碰到一份特别难懂的行业报告');
  shot(S7, S8, {
    day: DAY, fog: [52, 165],
    keys: [
      K(S7, [TOWER.x - 4.0, G + 4.4, TOWER.z + 9.2], [TOWER.x - 4.5, G + 2.8, 42], 58),
      K(S8, [TOWER.x - 5.0, G + 3.8, TOWER.z + 7.4], [TOWER.x - 5.2, G + 2.5, 42], 54),
    ],
    lights: () => VX.light(TOWER.x - 4, G + 5, 45, WARM, 10, 1.15),
    act: t => {
      heige(TOWER.x - 8.2, G + 1, 46.5, { ...feel('thinking', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '黑哥拆解' });
      ppl(TOWER.x - 5.2, G + 1, 46.0, '好学生', 'neutral', t, { tag: '好学生式提问', tagCol: '#72C9FE', dy: bob(t, 4, .03) });
      model('gpt', TOWER.x - 2.2, G + 1, 45.2, 'proud', t, { k: .023, flip: true, tag: '公文腔 AI' });
      if (t >= T_SHY) bubble(TOWER.x - 5.2, G + 3.3, 46.0, '请问老师能帮我…', t, T_SHY, S8);
    },
    ui: (c, t) => {
      tagUI(c, '段位 I · 逼 AI 说人话', 1, '#FFD43B');
      slam(c, t, S7 + .2, '越客气 越容易挨敷衍', 210, 84, '#FFD43B', 2.2);
    },
  });
  sfx(S7 + .1, 'chime', -10);

  // ======================================================================================= S8 · 难懂报告打字「请通俗总结」 -> 5 块天书石碑当头砸下 +「希望对您有所帮助」
  const T_TYPE = AT('请帮我通俗总结一下核心内容'), T_123 = AT('列出一二三四五'), T_HOPE = AT('希望对您有所帮助'), S9 = A('为什么会这样');
  // 5 根官腔石柱随「一二三四五」拔地而起
  for (let i = 0; i < 5; i++) {
    const tt = T_123 + i * .16;
    fillEdit(tt, 96 + i, G + 2, 42, 96 + i, G + 3 + (i % 2), 42, 'iron');
    fillEdit(S9, 96 + i, G + 2, 42, 96 + i, G + 5, 42, 0);
  }
  shot(S8, S9, {
    day: DUSK, fog: [48, 155], kicks: [[T_123, .75], [T_HOPE, .55]],
    keys: [
      K(S8, [98.5, G + 3.8, 52.5], [98.5, G + 2.5, 43], 54),
      K(T_123, [99.8, G + 4.4, 51.0], [98.5, G + 2.8, 42.5], 56),
      K(T_HOPE, [98.0, G + 3.5, 49.8], [98.2, G + 2.4, 44], 50),
    ],
    lights: () => VX.light(98, G + 5, 45, ICE, 10, 1.15),
    act: t => {
      ppl(96.2, G + 1, 45.8, '好学生', t >= T_123 ? 'panic' : 'neutral', t, { shake: t >= T_123, tag: '一头雾水' });
      model('deepseek', 101.2, G + 1, 45.2, 'proud', t, { k: .023, flip: true, tag: '端架子专家腔' });
      prop(98.5, G + 2.4, 44.2, 'tome', { k: .028 });
      bubble(96.2, G + 3.2, 45.8, '请帮我通俗总结核心内容', t, T_TYPE - .2, T_123 - .15);
      if (t >= T_123) {
        burst(t, T_123, 98.5, G + 3.5, 42.5, [146, 194, 255], 20);
        label(98.5, G + 5.6, 42.2, '1.赋能 2.抓手 3.颗粒度 4.矩阵 5.耦合', 30, '#FF7B73', t, T_123, S9);
      }
      if (t >= T_HOPE) bubble(101.2, G + 3.4, 45.2, '希望对您有所帮助 ^_^', t, T_HOPE, S9);
    },
    ui: (c, t) => {
      tagUI(c, '常规提问翻车 · 每个字都认识 合起来看不懂', 1, '#FF7B73');
      if (t >= AT('合在一起就是看不懂')) stamp(c, t, AT('合在一起就是看不懂'), '字全认识 就是不懂', 1460, 270, '#FF5A5A', S9 - AT('合在一起就是看不懂'));
    },
  });
  sfx(T_TYPE, 'type_burst', -10); sfx(T_123, 'thud', -8); sfx(T_HOPE, 'ding', -10);

  // ======================================================================================= S9 · 机制解密：金砖封死「官话退路」-> 逼 AI 拿出哄老人的耐心
  const T_SCALE = AT('AI根本拿不准尺度'), T_BLOCK = AT('讲官话的后路给堵死了'), T_PATIENCE = AT('拿出哄老人的耐心来讲'), S10 = A('平时我们写周报');
  fillEdit(T_BLOCK, 65, G + 1, 42, 69, G + 4, 42, 'tnGoldTrim');
  fillEdit(S10, 65, G + 1, 42, 69, G + 4, 42, 0);
  shot(S9, S10, {
    day: GOLDEN, fog: [48, 160], kicks: [[T_BLOCK, .8]],
    keys: [
      K(S9, [GRANDMA.x + 2.0, G + 4.2, GRANDMA.z + 8.0], [GRANDMA.x, G + 2.6, 42], 56),
      K(T_BLOCK, [GRANDMA.x + .5, G + 3.8, GRANDMA.z + 6.8], [GRANDMA.x, G + 2.6, 42], 52),
      K(T_PATIENCE, [GRANDMA.x - 1.2, G + 3.4, GRANDMA.z + 5.8], [GRANDMA.x - 1.5, G + 2.3, 44], 50),
    ],
    lights: () => VX.light(GRANDMA.x, G + 5, 44, WARM, 11, 1.3),
    act: t => {
      heige(GRANDMA.x - 4.8, G + 1, 46.2, { ...feel('idea', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '黑哥拆原理' });
      ppl(GRANDMA.x - 1.8, G + 1, 45.6, '太奶', 'happy', t, { tag: '80岁老太奶设定', tagCol: '#FFD43B' });
      model('deepseek', GRANDMA.x + 2.0, G + 1, 45.2, t >= T_PATIENCE ? 'love' : 'confused', t, {
        k: .023, flip: true, tag: t >= T_PATIENCE ? '哄老人耐心模式' : '拿不准通俗尺度',
      });
      if (t >= T_BLOCK) {
        burst(t, T_BLOCK, 67, G + 3.2, 42.5, [255, 212, 59], 24);
        label(67, G + 5.4, 42, '[×] 专业术语退路已封死', 34, '#FFD43B', t, T_BLOCK, S10);
      }
      if (t >= T_PATIENCE) {
        prop(GRANDMA.x + .2, G + 2.3 + Math.sin(t * 5) * .1, 45.4, 'coffee', { k: .026 });
        riseSparks(t, GRANDMA.x - 1.8, G + 1.5, 45.6, 3.2, 3.0, [255, 212, 59], 12, 1.0, .06);
      }
    },
    ui: (c, t) => {
      tagUI(c, '原理拆解 · 堵死术语退路 = 精准卡死通俗尺度', 1, '#FFD43B');
      if (t >= T_PATIENCE) slam(c, t, T_PATIENCE, '逼出哄老人的耐心！', 220, 86, '#FFD43B', S10 - T_PATIENCE);
    },
  });
  sfx(T_SCALE, 'pop', -11); sfx(T_BLOCK, 'anvil_use', -8); sfx(T_PATIENCE, 'chime', -9);

  // ======================================================================================= S10 · 周报改文案痛点：打开一看开头还是“结合上述情况”！
  const T_JIEHE = AT('开头还是结合上述情况'), S11 = A('那大家是怎么治它的呢');
  shot(S10, S11, {
    day: NIGHT, fog: [45, 145], kicks: [[T_JIEHE, .8]],
    keys: [
      K(S10, [98.5, G + 3.6, 51.5], [98.5, G + 2.4, 44], 54),
      K(T_JIEHE, [98.5, G + 3.2, 49.5], [98.5, G + 2.4, 44], 48),
    ],
    lights: () => VX.light(98.5, G + 5, 45, ALARM, 9, 1.1),
    act: t => {
      ppl(96.4, G + 1, 45.8, '老员工', t >= T_JIEHE ? 'angry' : 'neutral', t, { shake: t >= T_JIEHE, tag: '改周报打工人' });
      ppl(100.8, G + 1, 45.2, '老板', 'point', t, { flip: true, tag: '浓浓领导讲话味', tagCol: '#FF7B73' });
      if (t >= T_JIEHE) {
        bubble(100.8, G + 3.3, 45.2, '“结合上述情况…”', t, T_JIEHE, S11);
        ringPulse(t, 1.1, 100.8, G + 2.4, 45.2, 2.8, [255, 92, 82], 14, .07);
      }
    },
    ui: (c, t) => {
      tagUI(c, '职场重灾区 · 写周报改文案死性不改', 1, '#FF7B73');
      if (t >= T_JIEHE) slam(c, t, T_JIEHE, '开头还是“结合上述情况”！', 225, 82, '#FF5A5A', S11 - T_JIEHE);
    },
  });
  sfx(T_JIEHE, 'slap', -7);

  // ======================================================================================= S11 & S12 · 16层现代全景剖面观光电梯吐槽舱 + 隔壁豆包随时待命！
  const T_ELEV = AT('站在电梯里'), T_CLOSE = AT('关掉网页换豆包'), S13 = A('你看把端着说话的后路一堵');
  shot(S11, S13, {
    day: DUSK, fog: [48, 165], kicks: [[T_CLOSE, .8]],
    keys: [
      K(S11, [111.0, G + 12.2, 52.8], [111.0, G + 10.5, 42], 56),
      K(T_ELEV, [111.0, G + 8.0, 51.2], [111.0, G + 6.8, 42], 54),
      K(T_CLOSE, [112.5, G + 4.0, 51.0], [113.0, G + 2.8, 42.5], 54),
    ],
    lights: t => {
      const cabY = lerp(G + 12, G + 1.2, sm(seg01(t, S11, T_CLOSE)));
      VX.light(110.5, cabY + 1.8, 45, WARM, 10, 1.35);
      if (t >= T_CLOSE - .3) VX.light(116, G + 3, 44, ICE, 9, 1.4);
    },
    act: t => {
      const desc = sm(seg01(t, S11, T_CLOSE));
      const cabY = lerp(G + 12.0, G + 1.1, desc);
      ppl(109.6, cabY, 43.2, '老员工', 'angry', t, { k: .025, tag: '刚挨骂老员工', tagCol: '#FFD43B' });
      clawd(111.5, cabY, 43.2, { ...feel(t >= T_CLOSE ? 'scared' : 'nervous', t), flip: true }, { k: .017, tag: '当前网页 AI' });
      bubble(109.6, cabY + 2.3, 43.2, '敢冒书面词就换豆包！', t, AT('要是敢冒出一个书面词'), S13);
      if (t >= T_CLOSE - .35) {
        model('doubao', 116.0, G + 1 + Math.abs(Math.sin(t * 7)) * .16, 44.2, 'excited', t, {
          k: .025, flip: true, tag: '隔壁豆包：随时待命！', tagCol: '#FFD43B',
        });
        burst(t, T_CLOSE, 116.0, G + 2.8, 44.2, [255, 212, 59], 22);
      }
    },
    ui: (c, t) => {
      const flr = Math.max(1, Math.round(lerp(18, 1, sm(seg01(t, S11, T_CLOSE)))));
      panel(c, 48, 116, 330, 96, '#FFD43B');
      outlined(c, `▼ 观光电梯 ${String(flr).padStart(2, '0')}F`, 213, 164, 38, '#FFD43B', { lw: 0, shadow: false });
      tagUI(c, '野路子口令 #2 · 下班电梯老员工吐槽法', 1, '#FFD43B');
      promptCard(c, t, AT('假设你刚被老板骂完') - .1, S13 - .1, 2, '去周报领导腔口令', [
        [AT('假设你刚被老板骂完'), '“假设你刚被老板骂完，现在正站在电梯里”'],
        [AT('用大白话跟同事吐槽'), '“用大白话跟同事吐槽这事”'],
        [AT('要是敢冒出一个书面词'), '“敢冒出一个书面词，立马关掉网页换豆包！”'],
      ], 1030, 115, 830);
    },
  });
  sfx(S11 + .1, 'cart', -12); sfx(T_ELEV, 'ding', -10); sfx(T_CLOSE, 'portal', -8);

  // ======================================================================================= S13 & S14 · 活人气出炉 + 答案升级钩子（迈向第二段位：顺着你吹彩虹屁！）
  const T_ALIVE = AT('出来的话自然就有活人气'), S14 = A('不过说实话'), T_FLATTER = AT('顺着你吹彩虹屁'), S15 = A('尤其是你拿它来做决定');
  shot(S13, S14, {
    day: DAY, fog: [50, 160], kicks: [[T_ALIVE, .55]],
    keys: [
      K(S13, [111.5, G + 3.8, 52.8], [111.5, G + 2.4, 44.5], 54),
      K(S14, [112.2, G + 4.0, 53.2], [111.5, G + 2.4, 44.5], 54),
    ],
    act: t => {
      heige(109.2, G + 1, 45.6, { ...feel('happy', onTwos(t)), view: 'q', poseR: 'cheer' }, { tag: '省心交差' });
      model('doubao', 113.2, G + 1, 45.2, 'happy', t, { k: .023, flip: true, tag: '满嘴大白话' });
      riseSparks(t, 111.2, G + 1.5, 45.2, 4.0, 3.2, [255, 212, 59], 14, 1.2, .07);
      bubble(112.4, G + 3.4, 45.2, '这周就干成三件实事！', t, T_ALIVE - .1, S14);
    },
    ui: (c, t) => {
      tagUI(c, '效果立竿见影 · 改两句直接交差', 1, '#FFD43B');
      if (t >= T_ALIVE) slam(c, t, T_ALIVE, '出来的话就有活人气！', 215, 86, '#FFD43B', S14 - T_ALIVE);
    },
  });
  sfx(T_ALIVE, 'levelup', -9);

  // S14：答案升级钩子横移摇镜奔向霓虹咖啡街区！
  shot(S14, S15, {
    day: DUSK, fog: [52, 165], kicks: [[T_FLATTER, .85]],
    keys: [
      K(S14, [120, G + 5.8, 56], [134, G + 3.5, 46], 60),
      K(T_FLATTER, [136, G + 4.4, 55], [CAFE.x, G + 3.2, 46], 54),
    ],
    lights: () => VX.light(CAFE.x, G + 5, 48, ROSE, 12, 1.3),
    act: t => {
      heige(136.5, G + 1, 49.5, { ...emotions(t, [[0, 'determined'], [T_FLATTER, 'nervous']]), view: 'q', poseR: 'point' }, { tag: '升级预警：真金白银踩坑' });
      clawd(141.5, G + 1, 48.2, { ...feel('love', t), flip: true }, { k: .018, tag: '头号捧场王' });
      model('gpt', 144.2, G + 1, 48.5, 'happy', t, { k: .022, flip: true, tag: '彩虹屁大师' });
      if (t >= AT('真金白银去交学费')) {
        for (let i = 0; i < 6; i++) prop(139 + i * 1.1, G + 4.5 - ((t * 2 + i * .3) % 2.4), 48.8, 'coin');
      }
      if (t >= T_FLATTER) firework(CAFE.x, G + 8.5, 45, (t - T_FLATTER) % 1.4);
    },
    ui: (c, t) => {
      tagUI(c, '段位 II 升级 · 比官腔更要命的隐蔽毛病', 1, '#FF7B73');
      if (t >= T_FLATTER) slam(c, t, T_FLATTER, '顺着你吹彩虹屁！', 225, 96, '#FF5A5A', S15 - T_FLATTER);
    },
  });
  sfx(S14 + .15, 'whoosh', -10); sfx(T_FLATTER, 'firework', -9);
})();
