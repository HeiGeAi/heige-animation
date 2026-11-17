// scenes/tainai_e.js: 第四段位与大结局（L31–L41）— 跑路健身房 × 宜昌西陵法院通报巨幕 × 法槌训诫 × 黑哥黄结论锤 #2 × 星光终章
(() => {
  const N = window.TAINAI;
  const { B, G, VX, D, K, shot, P, A, AT, PE, LS, sfx, edit, fillEdit, flash,
    heige, clawd, model, ppl, prop, bubble, label,
    burst, riseSparks, orbitSparks, ringPulse, quantumBeam, firework,
    seg01, sm, lerp, hh, clamp01, fadeIO, outlined, panel, tagUI, slam, stamp,
    worldScreen, promptCard, yellowHammer, worldSign, skyBeams,
    GRANDMA, BLVD, COURT, AMBER, WARM, ALARM, ICE, DUSK, NIGHT, DAY, GOLDEN, FONT } = N;

  // ======================================================================================= S31 · 开头埋的大雷揭晓：跑路健身房关门扣押金 -> 想找 AI 编法条撑腰
  const S31 = A('最后说开头埋的那个大雷'), T_GYM = AT('健身房关门'), T_LAW = AT('找法条撑腰'), S32 = A('千万留个心眼');
  shot(S31, S32, {
    day: DUSK, fog: [48, 155],
    keys: [
      K(S31, [125.5, G + 4.0, 95.0], [125.5, G + 2.8, 85], 54),
      K(T_LAW, [126.8, G + 3.6, 92.8], [125.8, G + 2.5, 85.5], 50),
    ],
    lights: () => VX.light(125.5, G + 4, 88, AMBER, 10, 1.2),
    act: t => {
      ppl(124.2, G + 1, 88.8, '老员工', 'angry', t, { tag: '被扣押金消费者', tagCol: '#FF7B73' });
      heige(128.0, G + 1, 89.2, { ...feel('nervous', onTwos(t)), view: 'q', poseR: 'wave' }, { tag: '千万小心假法条！' });
      label(125.5, G + 5.8, 86, '健身房停业 · 押金不退', 32, '#FFD43B', t, T_GYM - .2, S32);
      if (t >= T_LAW) bubble(124.2, G + 3.3, 88.8, '让 AI 给我找几条法条吓死他！', t, T_LAW - .1, S32);
    },
    ui: (c, t) => {
      tagUI(c, '段位 IV 终极排雷 · 开场大债揭晓', 1, '#FF5A5A');
    },
  });
  sfx(S31 + .1, 'door', -9);

  // ======================================================================================= S32 & S33 · 2026-07-20 湖北宜昌西陵区法院真事：嵌入真实法院通报巨幕 + 当庭训诫！
  const T_DATE = AT('2026年7月20号'), T_SUBMIT = AT('没有全面核实的案例直接交上了法庭'), S33 = A('法官一查才发现');
  const T_FAKECASE = AT('有的根本查不到'), T_TAMPER = AT('司法解释的条文都被篡改了'), T_REPRIMAND = AT('当庭就被训诫'), S34 = A('所以说拿着AI编出来的假法条');

  shot(S32, S33, {
    day: NIGHT, fog: [46, 160], kicks: [[T_SUBMIT, .75]],
    keys: [
      K(S32, [143.0, G + 4.8, 93.0], [142.4, G + 2.8, 78.5], 58),
      K(T_SUBMIT, [143.0, G + 4.2, 90.0], [142.6, G + 2.6, 78.5], 54),
    ],
    lights: () => VX.light(143, G + 8, 80, WARM, 15, 1.35),
    act: t => {
      ppl(143.5, G + 3, 76.8, '法官', 'neutral', t, { k: .026, tag: '承办法官' });
      prop(143.5, G + 6.6, 75.2, 'scales', { k: .034 });
      ppl(138.8, G + 1, 81.5, '助理', 'talk', t, { k: .022, tag: '助理：AI 汇总未全面核实', tagCol: '#72C9FE' });
      const walkK = sm(seg01(t, AT('结果律师把这些'), T_SUBMIT + .3));
      ppl(lerp(141.0, 141.6, walkK), G + 1, lerp(82.2, 79.8, walkK), '律师', 'neutral', t, {
        k: .023, walk: walkK > 0 && walkK < 1, tag: '代理律师：直接交上法庭', tagCol: '#FF7B73',
      });
      prop(lerp(141.6, 142.4, walkK), G + 2.4, lerp(81.8, 79.2, walkK), 'fakeDoc', { k: .032 });
    },
    ui: (c, t) => {
      tagUI(c, '2026年7月20号 · 湖北宜昌西陵区法院公开通报真事', 1, '#FFD43B');
      if (t >= T_DATE && t < T_SUBMIT) slam(c, t, T_DATE, '2026.07.20 法院公开通报', 200, 76, '#FFD43B', 2.0);
    },
  });
  sfx(S32 + .1, 'ring', -10); sfx(T_SUBMIT, 'place', -9);

  // S33：法官核查三连爆雷 + 真实通报巨幕 court + 法槌重砸当庭训诫！
  shot(S33, S34, {
    day: NIGHT, fog: [44, 155], kicks: [[T_FAKECASE, .7], [T_TAMPER, .8], [T_REPRIMAND, 1.25]],
    keys: [
      K(S33, [143.0, G + 5.0, 91.5], [143.0, G + 3.6, 77], 56),
      K(T_REPRIMAND, [143.0, G + 4.4, 89.5], [142.6, G + 3.0, 78], 54),
    ],
    lights: t => VX.light(143, G + 7, 80, t >= T_FAKECASE ? ALARM : WARM, 15, 1.4),
    act: t => {
      ppl(143.5, G + 3, 76.8, '法官', 'angry', t, { k: .026, tag: '当庭核查发现异常！' });
      ppl(141.4, G + 1, 80.2, '律师', 'panic', t, { k: .023, shake: true, tag: '代理律师当庭被训诫', tagCol: '#FF5A5A' });
      if (t >= T_REPRIMAND - .15) {
        const gY = lerp(G + 5.8, G + 3.8, sm(seg01(t, T_REPRIMAND - .15, T_REPRIMAND + .06)));
        prop(145.0, gY, 77.4, 'gavel', { k: .042 });
        burst(t, T_REPRIMAND, 145.0, G + 3.8, 77.4, [255, 82, 72], 28);
        ringPulse(t, .85, 141.4, G + 2.0, 80.2, 3.8, [255, 72, 72], 18, .09);
      }
    },
    ui: (c, t) => {
      tagUI(c, '司法红线实锤 · 假案号 + 错配案情 + 篡改司法解释条文', 1, '#FF5A5A');
      worldScreen(c, t, S33 + .15, S34 - .1, {
        key: 'court',
        x: 960, y: 455, w: 1040,
        anchor: [143, G + 7.0, 74],
        border: '#FF5A5A',
        badge: '法院公开通报',
        title: '湖北省宜昌市西陵区人民法院 · 2026年7月20日通报案例',
        boxes: [
          [0.04, 0.42, 0.29, 0.34, T_FAKECASE],
          [0.35, 0.42, 0.29, 0.34, AT('案情完全对不上')],
          [0.66, 0.42, 0.30, 0.34, T_TAMPER],
        ],
      });
      if (t >= T_REPRIMAND) stamp(c, t, T_REPRIMAND, '当庭予以训诫！', 1490, 215, '#FF5A5A', S34 - T_REPRIMAND);
    },
  });
  flash(T_REPRIMAND, '#FF3A3A', .45, .28);
  sfx(T_FAKECASE, 'crack', -8); sfx(T_TAMPER, 'break_glass', -8); sfx(T_REPRIMAND, 'anvil', -5);

  // ======================================================================================= S34 & S35 · 正确退费维权口令 #5 + 黑哥黄满屏结论重锤 #2！
  const S35 = A('别说空话'), T_NOFAKE = AT('严禁编造任何法条和案号'), S36 = A('听到这儿可能有人会吐槽');
  shot(S34, S36, {
    day: GOLDEN, fog: [50, 165], kicks: [[T_NOFAKE, .95]],
    keys: [
      K(S34, [140.0, G + 4.4, 91.5], [142.0, G + 3.0, 82], 54),
      K(S35, [141.5, G + 4.2, 89.5], [143.0, G + 3.0, 81], 52),
    ],
    lights: () => VX.light(142, G + 6, 84, WARM, 13, 1.35),
    act: t => {
      heige(139.5, G + 1, 85.0, { ...feel('determined', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '只摆真实证据链' });
      model('doubao', 144.8, G + 1, 84.5, 'determined', t, { k: .023, flip: true, tag: '严守真实记录对账' });
      // 三块金色真实证据牌按时间线稳稳排开
      for (const [i, dx, lb] of [[0, 141.0, '1.付款记录'], [1, 142.8, '2.聊天记录'], [2, 144.6, '3.商家承诺矛盾']]) {
        prop(dx, G + 2.8 + Math.sin(t * 4 + i) * .08, 83.2, 'shield', { k: .026 });
        label(dx, G + 3.9, 83.2, lb, 26, '#FFD43B', t, S35, T_NOFAKE);
      }
      riseSparks(t, 142.8, G + 1.6, 83.5, 5.0, 3.5, [255, 212, 59], 14, 1.1, .06);
    },
    ui: (c, t) => {
      tagUI(c, '野路子口令 #5 · 退费扯皮时间线对账法', 1, '#FFD43B');
      if (t < T_NOFAKE - .05) {
        promptCard(c, t, S35 - .2, T_NOFAKE, 5, '日常退费维权安全口令', [
          [S35, '“别说空话，按时间顺序把付款、聊天记录跟商家承诺对清楚”'],
          [AT('前后说话矛盾的地方'), '“找出他前后说话矛盾的地方，列一份证据清单和退费要求”'],
          [T_NOFAKE - .5, '“严禁编造任何法条和案号！”'],
        ], 960, 108, 900);
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

  // ======================================================================================= S36 · 星光大道黄金收束：顺毛回应「那确实累」+ 5 句口令总金库
  const T_TIRED = AT('那确实累'), T_RULE = AT('把规矩立在前面'), S38 = A('今天讲的这5句提示词'), S39 = A('你平时被AI坑得最狠的一次');
  shot(S36, S39, {
    day: GOLDEN, fog: [54, 175], kicks: [[T_TIRED, .55], [S38 + .2, .65]],
    keys: [
      K(S36, [BLVD.x - 1.5, G + 4.2, 99.5], [BLVD.x, G + 3.0, 87], 56),
      K(T_RULE, [BLVD.x + .5, G + 4.5, 100.2], [BLVD.x, G + 3.2, 87], 58),
      K(S38, [BLVD.x, G + 4.8, 101.0], [BLVD.x, G + 3.6, 87], 58),
    ],
    lights: () => VX.light(BLVD.x, G + 7, 90, WARM, 15, 1.35),
    act: t => {
      heige(BLVD.x, G + 1, 91.8, {
        ...emotions(t, [[0, 'relieved'], [T_TIRED, 'happy'], [T_RULE, 'proud']]),
        view: 'front', poseR: t >= S38 ? 'cheer' : 'point',
      }, { tag: '摸透脾气 · 少走一半弯路' });
      // 四大 AI 站在后置金色规矩基座上（z=86.5，绝不挡前方黑哥！）
      model('deepseek', 96, G + 2.0, 86.5, 'happy', t, { k: .021, tag: '太奶法' });
      model('doubao', 101, G + 2.0, 86.5, 'happy', t, { k: .021, tag: '电梯法' });
      clawd(107, G + 2.0, 86.5, { ...feel('happy', t), flip: true }, { k: .016, tag: '验尸法' });
      model('kimi', 112, G + 2.0, 86.5, 'happy', t, { k: .021, flip: true, tag: '分窗+禁编法条' });
      if (t >= S38) {
        for (let i = 0; i < 5; i++) {
          prop(BLVD.x - 4 + i * 2, G + 4.2 + Math.sin(t * 4.5 + i) * .15, 90.2, 'card5', { k: .032 });
        }
        riseSparks(t, BLVD.x, G + 2.0, 90.2, 10, 5.0, [255, 212, 59], 18, 1.2, .07);
      }
    },
    ui: (c, t) => {
      skyBeams(c, t, .20);
      tagUI(c, '通关总结 · 5 句完整提示词已放进视频简介', 1, '#FFD43B');
      if (t >= T_TIRED && t < T_RULE) slam(c, t, T_TIRED, '那确实累！但少走一半弯路', 205, 76, '#FFD43B', 2.2);
      if (t >= S38) {
        panel(c, 420, 118, 1080, 176, '#FFD43B');
        outlined(c, '5 句完整提示词 -> 视频简介直接复制', 960, 174, 44, '#FFD43B', { lw: 0, shadow: false });
        outlined(c, '1.太奶读天书  2.电梯去官腔  3.事前验尸  4.换窗抓瞎编  5.退费禁编法条', 960, 240, 29, '#FAF6EE', { lw: 0, shadow: false });
      }
    },
  });
  sfx(T_TIRED, 'chat', -11); sfx(T_RULE, 'place', -9); sfx(S38 + .15, 'chest', -9);

  // ======================================================================================= S37 · 大电影终章：互动提问 + 回扣80岁太奶手套重聚 + 烟花盛典 + 固定签名
  const S40 = A('现在你再回头看开头那句80岁老太奶'), T_FOLLOW = AT('关注问问黑哥'), S41 = LS(41), END_T = D.len || 408.32;
  shot(S39, END_T + .5, {
    day: t => lerp(DUSK, .08, seg01(t, S40, END_T)),
    fog: [55, 180], kicks: [[T_FOLLOW, .65]],
    keys: [
      K(S39, [BLVD.x - .8, G + 4.0, 99.0], [BLVD.x, G + 2.8, 88], 54),
      K(S40, [BLVD.x + .4, G + 4.4, 99.8], [BLVD.x, G + 3.2, 88], 56),
      K(END_T, [BLVD.x, G + 9.2, 107.0], [BLVD.x, G + 4.2, 85], 60),
    ],
    lights: () => VX.light(BLVD.x, G + 7, 90, WARM, 16, 1.4),
    act: t => {
      heige(BLVD.x - 1.4, G + 1, 91.8, {
        ...emotions(t, [[0, 'happy'], [S40, 'proud'], [S41, 'happy']]),
        view: 'front', poseR: t >= T_FOLLOW ? 'wave' : 'point',
      }, { tag: '问问黑哥' });
      if (t >= S40 - .2) {
        ppl(BLVD.x + 1.6, G + 1, 91.8, '太奶', 'cheer', t, { flip: true, k: .026, tag: '80岁太奶完美收官', tagCol: '#FFD43B' });
        prop(BLVD.x - 3.8, G + 4.4 + Math.sin(t * 5) * .15, 90.8, 'gloveL', { k: .034 });
        prop(BLVD.x + 4.0, G + 4.4 - Math.sin(t * 5) * .15, 90.8, 'gloveR', { k: .034 });
        quantumBeam(t, BLVD.x - 3.8, G + 4.4, 90.8, BLVD.x + 4.0, G + 4.4, 90.8);
      }
      model('deepseek', BLVD.x - 4.8, G + 1, 91.0, 'happy', t, { k: .022, tag: false });
      model('doubao', BLVD.x + 4.8, G + 1, 91.0, 'happy', t, { k: .022, flip: true, tag: false });
      if (t >= T_FOLLOW) {
        firework(BLVD.x - 7, G + 12, BLVD.archZ, (t - T_FOLLOW) % 1.6);
        firework(BLVD.x + 7, G + 13, BLVD.archZ, (t - T_FOLLOW + .55) % 1.6);
        firework(BLVD.x, G + 15, BLVD.archZ - 2, (t - T_FOLLOW + 1.05) % 1.6);
      }
    },
    ui: (c, t) => {
      skyBeams(c, t, .26);
      if (t < T_FOLLOW) worldSign(c, BLVD.x, G + 13.5, 82, 'HEIGE STUDIOS · 黑哥大电影世界', '不吹 AI · 不惧 AI · 只说真话', '#FFD43B', 520);
      if (t >= S39 && t < S40 - .15) {
        const a = fadeIO(t, S39, S40 - .15);
        c.save(); c.globalAlpha = a; panel(c, 340, 118, 1240, 210, '#FFD43B');
        outlined(c, '你平时被 AI 坑得最狠的一次是哪种？', 960, 178, 44, '#FFD43B', { lw: 0, shadow: false });
        outlined(c, 'A · 拿官腔敷衍你     vs     B · 一本正经给你瞎编', 960, 260, 42, '#FAF6EE', { lw: 0, shadow: false });
        c.restore();
      }
      if (t >= T_FOLLOW) {
        const a = fadeIO(t, T_FOLLOW, END_T - .15);
        c.save(); c.globalAlpha = a; panel(c, 260, 136, 1400, 232, '#FFD43B');
        outlined(c, '点个赞 · 关注 问问黑哥', 960, 204, 52, '#FFD43B', { lw: 0, shadow: false, w: 900 });
        outlined(c, '我是黑哥，不吹AI也不恐惧AI，只说真话。', 960, 298, 42, '#FFFFFF', { lw: 0, shadow: false });
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
