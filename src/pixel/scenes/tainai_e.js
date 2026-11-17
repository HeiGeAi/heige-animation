// scenes/tainai_e.js: 第四段位与大结局（L31–L41）— 跑路健身房 × 宜昌西陵法院通报 × 撤卡特写砸法槌训诫 × 退费时间线全员同框 × 吐槽/立规矩/A-B投票/星光太奶重聚终章
(() => {
  const N = window.TAINAI;
  const { B, G, VX, D, IMG, K, shot, P, A, AT, PE, LS, LE, sfx, edit, fillEdit, flash,
    heige, clawd, model, ppl, prop, bubble, label,
    burst, riseSparks, orbitSparks, ringPulse, projArc, quantumBeam, firework,
    seg01, sm, lerp, hh, clamp01, fadeIO, outlined, panel, tagUI, slam, stamp,
    worldScreen, promptCard, yellowHammer, worldSign, skyBeams, holoBoard,
    GRANDMA, BLVD, TOWER, CAFE, ARENA, COURT,
    AMBER, WARM, ALARM, ICE, ROSE, DUSK, NIGHT, DAY, GOLDEN, FONT } = N;

  // ======================================================================================= S31 · 开头埋的大雷揭晓：跑路健身房关门（无铁栏杆！）+ 哑铃扣押金 + 找AI编法条
  const S31 = A('最后说开头埋的那个大雷'), T_GYM = AT('健身房关门'), T_LAW = AT('找法条撑腰'), S32 = A('千万留个心眼');
  shot(S31, S32, {
    day: DUSK, fog: [48, 155],
    keys: [
      K(S31, [126.0, G + 4.4, 98.8], [126.0, G + 2.8, 88.2], 62),
      K(T_LAW, [126.0, G + 4.0, 96.8], [126.0, G + 2.6, 88.2], 60),
    ],
    lights: () => VX.light(126.0, G + 5, 89, AMBER, 12, 1.3),
    act: t => {
      ppl(123.4, G + 1, 88.8, '老员工', 'angry', t, { tag: '被扣押金消费者', tagCol: '#FF7B73' });
      prop(125.8, G + 2.0 + Math.sin(t * 4) * .08, 88.2, 'dumbbell', { k: .036 });
      heige(128.4, G + 1, 89.0, { ...feel('nervous', onTwos(t)), view: 'q', poseR: 'wave' }, { tag: '千万小心假法条！' });
      if (t >= T_LAW) bubble(123.4, G + 3.5, 88.8, '让 AI 给我找几条法条吓死他！', t, T_LAW - .1, S32);
    },
    ui: (c, t) => {
      worldSign(c, 125.5, G + 6.8, 86, '动感健身 · 已闭店跑路', '会员押金 ¥5,000 拒不退还', '#FF5A5A', 420);
      tagUI(c, '段位 IV 终极排雷 · 开场大债揭晓', 1, '#FF5A5A');
    },
  });
  sfx(S31 + .1, 'door', -9);

  // ======================================================================================= S32 · 2026-07-20 湖北宜昌西陵区法院真事：助理汇总 -> 律师交上法庭
  const T_DATE = AT('2026年7月20号'), T_SUBMIT = AT('没有全面核实的案例直接交上了法庭'), S33 = A('法官一查才发现');
  const T_FAKECASE = AT('有的根本查不到'), T_TAMPER = AT('司法解释的条文都被篡改了'), T_REPRIMAND = AT('当庭就被训诫'), S34 = A('所以说拿着AI编出来的假法条');

  shot(S32, S33, {
    day: NIGHT, fog: [46, 160], kicks: [[T_SUBMIT, .75]],
    keys: [
      K(S32, [142.2, G + 4.8, 94.5], [142.0, G + 2.8, 79.0], 60),
      K(T_SUBMIT, [142.8, G + 4.2, 91.2], [142.6, G + 2.6, 78.5], 56),
    ],
    lights: () => VX.light(143, G + 8, 80, WARM, 15, 1.35),
    act: t => {
      ppl(143.5, G + 3, 76.8, '法官', 'neutral', t, { k: .026, tag: '承办法官' });
      prop(143.5, G + 6.6, 75.2, 'scales', { k: .034 });
      ppl(138.6, G + 1, 81.5, '助理', 'talk', t, { k: .022, tag: '助理：AI 汇总未全面核实', tagCol: '#72C9FE' });
      const walkK = sm(seg01(t, AT('结果律师把这些'), T_SUBMIT + .3));
      ppl(lerp(141.0, 141.8, walkK), G + 1, lerp(82.2, 79.8, walkK), '律师', 'neutral', t, {
        k: .023, walk: walkK > 0 && walkK < 1, tag: '代理律师：直接交上法庭', tagCol: '#FF7B73',
      });
      prop(lerp(141.6, 142.4, walkK), G + 2.4, lerp(81.8, 79.2, walkK), 'fakeDoc', { k: .034 });
    },
    ui: (c, t) => {
      tagUI(c, '2026年7月20号 · 湖北宜昌西陵区法院公开通报真事', 1, '#FFD43B');
      if (t >= T_DATE && t < T_SUBMIT) slam(c, t, T_DATE, '2026.07.20 法院公开通报', 180, 76, '#FFD43B', 2.0);
    },
  });
  sfx(S32 + .1, 'ring', -10); sfx(T_SUBMIT, 'place', -9);

  // ======================================================================================= S33a · 法官查明三连爆雷：左排通报卡片、右清晰法官核查！
  shot(S33, T_REPRIMAND - .75, {
    day: NIGHT, fog: [44, 155], kicks: [[T_FAKECASE, .75], [T_TAMPER, .8]],
    keys: [
      K(S33, [141.0, G + 4.8, 92.8], [140.4, G + 3.0, 78.5], 60),
      K(T_TAMPER, [141.6, G + 4.4, 91.0], [141.0, G + 2.8, 78.5], 58),
    ],
    lights: t => VX.light(143, G + 7, 80, t >= T_FAKECASE ? ALARM : WARM, 15, 1.4),
    act: t => {
      ppl(144.6, G + 3, 76.8, '法官', 'angry', t, { k: .026, tag: '当庭核查发现异常！' });
      ppl(142.8, G + 1, 80.2, '律师', 'shock', t, { k: .023, shake: t >= T_TAMPER, tag: '涉事代理律师', tagCol: '#FF7B73' });
      prop(144.6, G + 6.6, 75.2, 'scales', { k: .034 });
    },
    ui: (c, t) => {
      tagUI(c, '司法红线实锤 · 假案号 + 错配案情 + 篡改司法解释条文', 1, '#FF5A5A');
      worldScreen(c, t, S33 + .1, T_REPRIMAND - .8, {
        key: 'court',
        x: 490, y: 468, w: 750,
        border: '#FF5A5A',
        badge: '上观新闻 / 湖北日报',
        title: '宜昌西陵法院：律师交 AI 编造案例被训诫',
        boxes: [
          [0.03, 0.16, 0.64, 0.06, S33 + .15],
          [0.44, 0.896, 0.30, 0.040, T_FAKECASE],
          [0.04, 0.942, 0.15, 0.040, AT('案情完全对不上')],
          [0.195, 0.942, 0.255, 0.040, T_TAMPER],
        ],
      });
    },
  });
  sfx(T_FAKECASE, 'crack', -8); sfx(T_TAMPER, 'break_glass', -8);

  // ======================================================================================= S33b · 撤掉通报卡片！直接特写推近法槌怒砸审判台 + 律师当庭被训诫！
  shot(T_REPRIMAND - .75, S34, {
    day: NIGHT, fog: [42, 150], kicks: [[T_REPRIMAND, 1.35]],
    keys: [
      K(T_REPRIMAND - .75, [142.8, G + 4.4, 88.8], [142.6, G + 2.8, 78.2], 54),
      K(T_REPRIMAND, [143.0, G + 4.0, 86.2], [142.8, G + 2.6, 78.0], 50),
    ],
    lights: () => VX.light(143, G + 6, 80, ALARM, 15, 1.45),
    act: t => {
      ppl(143.5, G + 3, 76.8, '法官', 'angry', t, { k: .028, tag: '严厉训诫！' });
      ppl(141.4, G + 1, 80.2, '律师', 'panic', t, { k: .024, shake: true, tag: '当庭就被训诫！', tagCol: '#FF5A5A' });
      const gY = lerp(G + 6.2, G + 3.8, sm(seg01(t, T_REPRIMAND - .2, T_REPRIMAND + .06)));
      prop(145.0, gY, 77.4, 'gavel', { k: .048 });
      if (t >= T_REPRIMAND) {
        burst(t, T_REPRIMAND, 145.0, G + 3.8, 77.4, [255, 82, 72], 28);
        ringPulse(t, .85, 141.4, G + 2.0, 80.2, 3.8, [255, 72, 72], 18, .09);
      }
    },
    ui: (c, t) => {
      tagUI(c, '当庭被训诫 · 千万别拿 AI 编的假法条交差！', 1, '#FF5A5A');
      if (t >= T_REPRIMAND - .05) stamp(c, t, T_REPRIMAND - .05, '当庭予以训诫！', 1480, 215, '#FF5A5A', S34 - T_REPRIMAND + .1);
    },
  });
  flash(T_REPRIMAND, '#FF3A3A', .45, .28);
  sfx(T_REPRIMAND, 'anvil', -5);

  // ======================================================================================= S34a · 退费维权拆招（全员居中同框 + 3 大真实证据时间线逐站亮灯！）
  const S35 = A('别说空话'), T_NOFAKE = AT('严禁编造任何法条和案号'), S36 = A('听到这儿可能有人会吐槽');
  const T_PAY = AT('付款记录'), T_CHAT = AT('聊天记录'), T_CONTRADICT = AT('前后说话矛盾的地方');
  shot(S34, S35, {
    day: GOLDEN, fog: [50, 165],
    keys: [
      K(S34, [142.8, G + 4.4, 96.5], [142.8, G + 2.8, 84.5], 62),
      K(S35, [142.8, G + 4.2, 95.5], [142.8, G + 2.8, 84.5], 62),
    ],
    lights: () => VX.light(142.8, G + 6, 86, WARM, 13, 1.35),
    act: t => {
      heige(138.6, G + 1, 85.0, { ...feel('determined', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '只摆真实证据链！' });
      model('doubao', 146.8, G + 1, 84.8, 'determined', t, { k: .023, flip: true, tag: '严守真实记录对账' });
      prop(141.0, G + 2.4, 84.5, 'fakeDoc', { k: .034 });
      prop(144.4, G + 2.4, 84.5, 'shield', { k: .034 });
      label(141.0, G + 3.6, 84.5, '[×] 编假法条坑自己', 28, '#FF5A5A', t, S34, S35);
      label(144.4, G + 3.6, 84.5, '[✓] 只理真实时间线', 28, '#FFD43B', t, AT('退费扯皮'), S35);
    },
    ui: (c, t) => {
      tagUI(c, '维权正确打开方式 · 别让 AI 瞎编法条 只拿真实记录对账', 1, '#FFD43B');
    },
  });

  // S34b · 退费扯皮三步时间线 + 口令 #5 -> 黑哥黄结论重锤 #2
  shot(S35, S36, {
    day: GOLDEN, fog: [50, 165], kicks: [[T_NOFAKE, .95]],
    keys: [
      K(S35, [142.8, G + 4.4, 96.5], [142.8, G + 2.8, 84.5], 62),
      K(T_CHAT, [142.8, G + 4.2, 95.0], [142.8, G + 2.8, 84.5], 60),
      K(T_NOFAKE, [142.8, G + 4.2, 95.0], [142.8, G + 2.8, 84.5], 60),
    ],
    lights: () => VX.light(142.8, G + 6, 86, WARM, 13, 1.35),
    act: t => {
      heige(138.6, G + 1, 85.0, { ...feel('determined', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '时间线对账法' });
      model('doubao', 146.8, G + 1, 84.8, 'determined', t, { k: .023, flip: true, tag: '严格逐条对清楚' });
      for (const [i, dx, propNm, atT] of [[0, 140.8, 'coin', T_PAY], [1, 142.8, 'doc', T_CHAT], [2, 144.8, 'shield', T_CONTRADICT]]) {
        const lit = t >= atT;
        prop(dx, G + 2.6 + Math.sin(t * 4 + i) * .08, 84.2, propNm, { k: lit ? .034 : .024 });
      }
      riseSparks(t, 142.8, G + 1.6, 84.5, 5.5, 3.6, [255, 212, 59], 16, 1.1, .06);
    },
    ui: (c, t) => {
      tagUI(c, '野路子口令 #5 · 退费扯皮时间线对账法', 1, '#FFD43B');
      if (t < T_NOFAKE - .05) {
        holoBoard(c, 500, 260, 760, 265,
          '维权时间线证据对照表', '证据链', '#FFD43B', [
            ['① 付款记录：10月1日 年卡实付 ¥3,800', t >= T_PAY ? '#FFD43B' : '#9CA8C4', t >= T_PAY ? 'rgba(255,212,59,.14)' : null],
            ['② 聊天承诺：10月5日 微信承诺“随时全退”', t >= T_CHAT ? '#FFD43B' : '#9CA8C4', t >= T_CHAT ? 'rgba(255,212,59,.14)' : null],
            ['③ 矛盾实锤：10月20日 闭店改口称不可退', t >= T_CONTRADICT ? '#FF7B73' : '#9CA8C4', t >= T_CONTRADICT ? 'rgba(255,90,90,.18)' : null],
          ]);
        promptCard(c, t, S35 - .1, T_NOFAKE - .05, 5, '退费对账安全口令', [
          [S35, '“别说空话，按时间顺序把付款、聊天记录跟承诺对清楚”'],
          [T_CONTRADICT, '“找出矛盾列证据清单和退费要求”'],
          [AT('严禁编造'), '“严禁编造任何法条和案号！”'],
        ], 960, 118, 880);
      } else {
        yellowHammer(c, t, T_NOFAKE - .05, S36 - .08,
          '保命铁律 02 · 维权红线',
          '只理真实时间线与证据漏洞',
          '严禁编造任何法条和案号！');
      }
    },
  });
  flash(T_NOFAKE, '#FFD43B', .4, .2);
  sfx(S34 + .15, 'chime', -10); sfx(T_NOFAKE, 'anvil', -6);

  // ======================================================================================= S36a · 吐槽时刻（专属特写镜头：疲惫打工人摘面具吐槽“是不是太累了？”）
  const T_TIRED = AT('那确实累'), T_RULE = AT('把规矩立在前面'), S38 = A('今天讲的这5句提示词'), S39 = A('你平时被AI坑得最狠的一次');
  shot(S36, T_TIRED, {
    day: DUSK, fog: [50, 165],
    keys: [
      K(S36, [BLVD.x - .5, G + 3.6, 98.2], [BLVD.x - .5, G + 2.4, 91.5], 54),
      K(T_TIRED, [BLVD.x, G + 3.6, 97.6], [BLVD.x, G + 2.4, 91.5], 52),
    ],
    lights: () => VX.light(BLVD.x, G + 5, 92, ROSE, 11, 1.25),
    act: t => {
      ppl(BLVD.x - 2.2, G + 1, 91.6, '老员工', 'dizzy', t, { tag: '吐槽：还得跟 AI 演戏斗心眼？', tagCol: '#FF7B73' });
      prop(BLVD.x, G + 2.5 + Math.sin(t * 5) * .1, 91.6, 'mask', { k: .036 });
      heige(BLVD.x + 2.0, G + 1, 91.6, { ...feel('thinking', onTwos(t)), view: 'q', flip: true, poseR: 'chin' }, { tag: '听完吐槽' });
    },
    ui: (c, t) => {
      tagUI(c, '灵魂发问 · 用个 AI 还要演戏斗心眼太累了？', 1, '#FF7B73');
      if (t >= AT('演戏斗心眼')) slam(c, t, AT('演戏斗心眼'), '“用个工具还得斗心眼，太累了！”', 190, 74, '#FF7B73', T_TIRED - AT('演戏斗心眼'));
    },
  });

  // ======================================================================================= S36b · 顺毛立规矩 + 5 句提示词汇总简介（370.56 -> 388.66）
  shot(T_TIRED, S39, {
    day: GOLDEN, fog: [54, 175], kicks: [[T_TIRED, .55], [S38 + .2, .65]],
    keys: [
      K(T_TIRED, [BLVD.x, G + 4.8, 102.0], [BLVD.x, G + 3.0, 88.5], 62),
      K(T_RULE, [BLVD.x, G + 5.0, 102.5], [BLVD.x, G + 3.2, 88.5], 62),
      K(S38, [BLVD.x, G + 5.2, 103.5], [BLVD.x, G + 3.5, 88.5], 64),
    ],
    lights: () => VX.light(BLVD.x, G + 7, 90, WARM, 15, 1.35),
    act: t => {
      heige(BLVD.x, G + 1, 92.4, {
        ...emotions(t, [[0, 'relieved'], [T_TIRED, 'happy'], [T_RULE, 'proud']]),
        view: 'front', poseR: t >= S38 ? 'cheer' : 'point',
      }, { tag: '把规矩立在前面 · 少走一半弯路' });
      model('deepseek', 98.4, G + 1.8, 87.5, 'happy', t, { k: .021, tag: '1.太奶法' });
      model('doubao', 101.2, G + 1.8, 87.5, 'happy', t, { k: .021, tag: '2.电梯法' });
      clawd(106.8, G + 1.8, 87.5, { ...feel('happy', t), flip: true }, { k: .016, tag: '3.验尸法' });
      model('kimi', 109.6, G + 1.8, 87.5, 'happy', t, { k: .021, flip: true, tag: '4.分窗+5.对账' });
      if (t >= S38) {
        for (let i = 0; i < 5; i++) {
          prop(BLVD.x - 4 + i * 2, G + 3.8 + Math.sin(t * 4.5 + i) * .15, 90.2, 'card5', { k: .034 });
        }
        riseSparks(t, BLVD.x, G + 2.0, 90.2, 10, 5.0, [255, 212, 59], 18, 1.2, .07);
      }
    },
    ui: (c, t) => {
      skyBeams(c, t, .18);
      tagUI(c, '通关总结 · 5 句完整提示词已放进视频简介', 1, '#FFD43B');
      if (t >= T_TIRED && t < T_RULE - .4) slam(c, t, T_TIRED, '那确实累！但少走一半弯路', 185, 76, '#FFD43B', T_RULE - T_TIRED);
      if (t >= S38) {
        panel(c, 410, 114, 1100, 178, '#FFD43B');
        outlined(c, '5 句完整提示词 -> 视频简介直接复制', 960, 170, 44, '#FFD43B', { lw: 0, shadow: false });
        outlined(c, '1.太奶读天书  2.电梯去官腔  3.事前验尸  4.换窗抓瞎编  5.退费禁编法条', 960, 236, 29, '#FAF6EE', { lw: 0, shadow: false });
      }
    },
  });
  sfx(T_TIRED, 'chat', -11); sfx(T_RULE, 'place', -9); sfx(S38 + .15, 'chest', -9);

  // ======================================================================================= S37a · 互动投票：拿官腔敷衍你 vs 一本正经给你瞎编（左右对比摇镜！）
  const S40 = A('现在你再回头看开头那句80岁老太奶'), T_FOLLOW = AT('关注问问黑哥'), S41 = LS(41), END_T = D.len || 408.32;
  const T_POLL_B = AT('一本正经给你瞎编');
  shot(S39, S40, {
    day: DUSK, fog: [52, 170],
    keys: [
      K(S39, [BLVD.x - 1.0, G + 4.0, 100.6], [BLVD.x - 1.5, G + 2.6, 90.5], 62),
      K(T_POLL_B, [BLVD.x + 1.0, G + 4.0, 100.6], [BLVD.x + 1.5, G + 2.6, 90.5], 62),
    ],
    lights: () => VX.light(BLVD.x, G + 6, 91, WARM, 14, 1.3),
    act: t => {
      model('gpt', BLVD.x - 3.0, G + 1, 90.6, 'proud', t, { k: .024, tag: 'A · 结合上述情况（官腔）' });
      heige(BLVD.x, G + 1, 91.8, { ...feel('thinking', onTwos(t)), view: 'front', poseR: 'out' }, { tag: '你最烦哪种？' });
      model('deepseek', BLVD.x + 3.0, G + 1, 90.6, 'nervous', t, { k: .024, flip: true, tag: 'B · 编假论文法条（瞎编）' });
      prop(BLVD.x + 1.6, G + 2.3, 91.2, 'fakeDoc', { k: .030 });
    },
    ui: (c, t) => {
      skyBeams(c, t, .18);
      tagUI(c, '评论区站队 · 你被 AI 坑得最狠的是哪种？', 1, '#FFD43B');
      panel(c, 320, 114, 1280, 198, '#FFD43B');
      outlined(c, '你平时被 AI 坑得最狠的一次是哪种？', 960, 170, 42, '#FFD43B', { lw: 0, shadow: false });
      outlined(c, 'A · 拿官腔敷衍你     vs     B · 一本正经给你瞎编', 960, 248, 40, '#FAF6EE', { lw: 0, shadow: false });
    },
  });

  // ======================================================================================= S37b · 大电影终章：回头看 80 岁太奶 + 手套重聚 + 烟花盛典 + 固定签名
  shot(S40, END_T + .5, {
    day: t => lerp(DUSK, .08, seg01(t, S40, END_T)),
    fog: [55, 180], kicks: [[T_FOLLOW, .65]],
    keys: [
      K(S40, [BLVD.x, G + 3.8, 99.6], [BLVD.x, G + 2.6, 90.5], 58),
      K(T_FOLLOW, [BLVD.x, G + 5.0, 102.5], [BLVD.x, G + 3.2, 89.5], 62),
      K(END_T, [BLVD.x, G + 8.0, 107.0], [BLVD.x, G + 4.2, 86.5], 64),
    ],
    lights: () => VX.light(BLVD.x, G + 7, 90, WARM, 16, 1.4),
    act: t => {
      heige(BLVD.x - 1.5, G + 1, 91.6, {
        ...emotions(t, [[0, 'happy'], [S40, 'proud'], [S41, 'happy']]),
        view: 'front', poseR: t >= T_FOLLOW ? 'wave' : 'point',
      }, { tag: '问问黑哥' });
      ppl(BLVD.x + 1.5, G + 1, 91.6, '太奶', 'cheer', t, { flip: true, k: .027, tag: '80岁太奶完美收官', tagCol: '#FFD43B' });
      prop(BLVD.x - 3.5, G + 4.2 + Math.sin(t * 5) * .15, 90.8, 'gloveL', { k: .034 });
      prop(BLVD.x + 3.5, G + 4.2 - Math.sin(t * 5) * .15, 90.8, 'gloveR', { k: .034 });
      quantumBeam(t, BLVD.x - 3.5, G + 4.2, 90.8, BLVD.x + 3.5, G + 4.2, 90.8);
      model('deepseek', BLVD.x - 4.4, G + 1, 91.0, 'happy', t, { k: .022, tag: false });
      model('doubao', BLVD.x + 4.4, G + 1, 91.0, 'happy', t, { k: .022, flip: true, tag: false });
      if (t >= T_FOLLOW) {
        firework(BLVD.x - 7, G + 12, BLVD.archZ, (t - T_FOLLOW) % 1.6);
        firework(BLVD.x + 7, G + 13, BLVD.archZ, (t - T_FOLLOW + .55) % 1.6);
        firework(BLVD.x, G + 15, BLVD.archZ - 2, (t - T_FOLLOW + 1.05) % 1.6);
      }
    },
    ui: (c, t) => {
      skyBeams(c, t, .24);
      if (t < T_FOLLOW) worldSign(c, BLVD.x, G + 13.5, 82, 'HEIGE STUDIOS · 黑哥大电影世界', '不吹 AI · 不惧 AI · 只说真话', '#FFD43B', 520);
      if (t >= T_FOLLOW) {
        const a = fadeIO(t, T_FOLLOW, END_T - .15);
        c.save(); c.globalAlpha = a; panel(c, 260, 126, 1400, 224, '#FFD43B');
        outlined(c, '点个赞 · 关注 问问黑哥', 960, 192, 52, '#FFD43B', { lw: 0, shadow: false, w: 900 });
        outlined(c, '我是黑哥，不吹AI也不恐惧AI，只说真话。', 960, 286, 42, '#FFFFFF', { lw: 0, shadow: false });
        c.restore();
      }
      const fadeOut = seg01(t, END_T - .45, END_T + .1);
      if (fadeOut > 0) {
        c.save(); c.fillStyle = `rgba(6,4,12,${fadeOut})`; c.fillRect(0, 0, 1920, 1080); c.restore();
      }
    },
  });
  sfx(S40, 'magic', -10); sfx(T_FOLLOW, 'levelup', -8); sfx(T_FOLLOW + .2, 'firework', -10); sfx(S41, 'firework', -11);
})();
