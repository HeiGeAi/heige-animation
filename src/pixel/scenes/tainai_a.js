// scenes/tainai_a.js: 序幕（L00–L04）— 0秒太奶暖炕炸场 × 科学网露天巨幕实锤 × 京沪量子手套星门 × 黑哥星光大道5口令 × 法庭大债悬念
(() => {
  const N = window.TAINAI;
  const { B, G, VX, D, K, shot, P, A, AT, PE, sfx, edit, fillEdit, flash,
    heige, clawd, model, ppl, prop, bubble, label,
    burst, riseSparks, orbitSparks, ringPulse, projArc, quantumBeam, firework,
    seg01, sm, lerp, hh, clamp01, outlined, panel, tagUI, slam, stamp,
    worldScreen, promptCard, worldSign, skyBeams,
    GRANDMA, BLVD, TOWER, COURT, AMBER, WARM, ALARM, ICE, DUSK, NIGHT, DAY, GOLDEN } = N;

  const bob = (t, f = 6, h = .05) => -Math.abs(Math.sin(t * f)) * h;

  // ======================================================================================= S1 · 0.0s 生死首帧：太奶暖炕院直怼天书论文（全员无遮挡正面全身入画！）
  const S1 = 0, T_BOOK = AT('孙子非让我学这篇论文'), T_PRAISE = AT('讲完记得夸夸我'), S2 = A('你敢信吗');
  shot(S1, S2, {
    day: GOLDEN, fog: [48, 155], kicks: [[.18, .65], [T_PRAISE, .7]],
    keys: [
      K(0, [66.2, G + 3.6, 52.8], [66.0, G + 2.3, 44.5], 54),
      K(T_BOOK, [66.8, G + 3.8, 53.5], [66.2, G + 2.4, 44.5], 55),
      K(S2, [67.4, G + 4.0, 54.0], [66.5, G + 2.5, 44.0], 56),
    ],
    lights: t => {
      VX.light(63, G + 4, 47, WARM, 10, 1.3);
      VX.light(69, G + 4, 47, t >= T_PRAISE ? WARM : ICE, 9, 1.15);
    },
    act: t => {
      ppl(64.0, G + 1, 46.2, '太奶', t >= T_PRAISE ? 'cheer' : 'talk', t, {
        k: .028, tag: '我：80岁老太奶', tagCol: '#FFD43B', dy: bob(t, 5, .04),
      });
      heige(61.4, G + 1, 46.8, {
        ...emotions(t, [[0, 'mischief'], [T_BOOK, 'happy'], [T_PRAISE, 'proud']]),
        view: 'q', poseR: 'point',
      }, { tag: '黑哥', dy: bob(t, 4, .03) });
      const warm = t >= AT('别用专业词');
      model('deepseek', 68.4, G + 1, 46.2, warm ? 'happy' : 'thinking', t, {
        k: .024, flip: true, tag: warm ? '乖孙模式启动' : '高冷 AI',
      });
      clawd(70.8, G + 1, 46.8, { ...feel(warm ? 'love' : 'neutral', t), flip: true }, {
        k: .018, dy: warm ? Math.abs(Math.sin(t * 6)) * .16 : 0,
      });
      prop(66.2, G + 2.6 + Math.sin(t * 4) * .15, 46.0, 'tome', { k: .034 });
      orbitSparks(t, 66.2, G + 2.6, 46.0, .95, warm ? [255, 212, 59] : [146, 194, 255], 6, 3.4, .07);
      if (t >= T_PRAISE) {
        burst(t, T_PRAISE, 64.0, G + 3.2, 46.2, [255, 212, 59], 22);
        bubble(64.0, G + 3.9, 46.2, '讲完记得夸夸我！', t, T_PRAISE, S2);
      } else {
        bubble(64.0, G + 3.9, 46.2, '没读过书 · 眼神不好', t, 1.1, T_BOOK);
      }
    },
    ui: (c, t) => {
      tagUI(c, '野路子口令 #1 · 80岁太奶降维法', 1, '#FFD43B');
      promptCard(c, t, .25, S2 - .1, 1, '80 岁太奶读天书口令', [
        [.25, '“我是个 80 岁的老太奶，没读过书，眼神不好”'],
        [T_BOOK, '“孙子非让我学这篇论文，别用专业词”'],
        [AT('全拿生活里的事'), '“全拿生活里的事打比方，讲完记得夸夸我！”'],
      ], 1030, 108, 830);
    },
  });
  sfx(.12, 'pop', -9); sfx(T_BOOK, 'magic', -10); sfx(T_PRAISE, 'levelup', -8);

  // ======================================================================================= S2 · 露天电影巨幕升起：嵌入《科学网》2026-04-28 真实报道
  const T_SCI = AT('连科学网都专门发了一篇文章'), S3 = A('平时满嘴专业词的AI');
  shot(S2, S3, {
    day: NIGHT, fog: [48, 160], kicks: [[T_SCI, .6]],
    keys: [
      K(S2, [GRANDMA.x + 1.5, G + 4.4, GRANDMA.z + 9.0], [GRANDMA.x + 1.0, G + 5.8, GRANDMA.scrZ], 58),
      K(T_SCI, [GRANDMA.x + .4, G + 4.8, GRANDMA.z + 7.8], [GRANDMA.x + 1.0, G + 6.0, GRANDMA.scrZ], 54),
      K(S3, [GRANDMA.x - .6, G + 4.6, GRANDMA.z + 7.4], [GRANDMA.x + 1.0, G + 5.8, GRANDMA.scrZ], 54),
    ],
    lights: t => {
      VX.light(GRANDMA.x + 1, G + 7, GRANDMA.scrZ + 2, WARM, 14, 1.35);
    },
    act: t => {
      heige(GRANDMA.x - 4.8, G + 1, GRANDMA.z + 1.2, { ...feel('surprised', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '黑哥' });
      ppl(GRANDMA.x + 5.6, G + 1, GRANDMA.z + 1.2, '太奶', 'happy', t, { flip: true, tag: '学术太奶' });
      riseSparks(t, GRANDMA.x + 1, G + 2.5, GRANDMA.scrZ + 1.2, 10, 6.5, [255, 212, 59], 16, 1.1, .07);
    },
    ui: (c, t) => {
      tagUI(c, '权威实锤 · 中国科学报社旗下科学网', 1, '#FFD43B');
      worldScreen(c, t, S2 + .15, S3 - .1, {
        key: 'sciencenet',
        x: 960, y: 465, w: 1060,
        anchor: [GRANDMA.x + 1, G + 6.5, GRANDMA.scrZ],
        beamFrom: [GRANDMA.x - 4.8, G + 2.4, GRANDMA.z + 1.2],
        badge: '科学网报道',
        title: '2026年4月28日 ·《谁发明的太奶论文法？一夜之间论文全读懂了》',
        boxes: [
          [0.03, 0.34, 0.94, 0.36, T_SCI + .15],
        ],
      });
      if (t < T_SCI) slam(c, t, S2 + .05, '你敢信吗？！', 180, 92, '#FFD43B', 1.3);
    },
  });
  sfx(S2 + .08, 'whoosh', -11); sfx(T_SCI, 'toast', -9);

  // ======================================================================================= S3 · 京沪双塔量子手套星门 + AI 送棉袄大反转（全景完整收纳双塔与左右手套）
  const T_CHANGE = AT('态度立马就变了'), T_QUANT = AT('就算是量子纠缠'), T_GLOVE = AT('分隔两地的左右手套'), T_COAT = AT('天冷记得多穿件衣服'), S4 = A('你平时用豆包或者DeepSeek');
  shot(S3, S4, {
    day: t => lerp(NIGHT, GOLDEN, sm(seg01(t, S3, T_CHANGE + .5))),
    fog: [50, 165], kicks: [[T_CHANGE, .75], [T_COAT, .65]],
    keys: [
      K(S3, [67.5, G + 4.8, 54.5], [67.5, G + 3.6, 41], 58),
      K(T_QUANT, [67.5, G + 6.2, 55.5], [67.5, G + 4.4, 41], 60),
      K(T_GLOVE, [67.5, G + 5.6, 54.0], [67.5, G + 4.2, 41], 58),
      K(T_COAT, [66.2, G + 3.8, 52.5], [66.2, G + 2.4, 45.5], 52),
    ],
    lights: t => {
      VX.light(63, G + 6, 41, [1, .45, .42], 10, 1.3);
      VX.light(72, G + 6, 41, ICE, 10, 1.3);
      VX.light(66, G + 4, 47, WARM, 10, 1.25);
    },
    act: t => {
      const changed = t >= T_CHANGE;
      ppl(64.5, G + 1, 46.5, '太奶', t >= T_COAT ? 'cheer' : 'happy', t, {
        k: .028, tag: '80岁太奶', tagCol: '#FFD43B', dy: bob(t, 5, .04),
      });
      model('deepseek', 69.2, G + 1, 46.5, changed ? 'love' : 'neutral', t, {
        k: .024, flip: true, tag: changed ? '孝顺大棉袄 AI' : '高冷术语 AI',
        dy: changed ? Math.abs(Math.sin(t * 5.5)) * .14 : 0,
      });
      if (t >= T_CHANGE) burst(t, T_CHANGE, 69.2, G + 2.8, 46.5, [255, 212, 59], 22);

      // 京沪双塔上方悬浮分隔两地的左、右手套 + 量子纠缠正弦波光束！
      if (t >= T_QUANT) {
        const hover = Math.sin(t * 4.5) * .20;
        prop(63, G + 6.4 + hover, 40.5, 'gloveL', { k: .042 });
        prop(72, G + 7.2 - hover, 40.5, 'gloveR', { k: .042 });
        quantumBeam(t, 63, G + 6.4 + hover, 40.5, 72, G + 7.2 - hover, 40.5);
        label(63, G + 7.9, 40.5, '北京 · 左手套', 34, '#FF7B73', t, T_GLOVE, T_COAT);
        label(72, G + 8.7, 40.5, '上海 · 右手套', 34, '#92C2FF', t, T_GLOVE, T_COAT);
      }
      if (t >= T_COAT - .2) {
        const ck = sm(seg01(t, T_COAT - .2, T_COAT + .45));
        prop(lerp(68.8, 65.4, ck), lerp(G + 3.4, G + 2.5, ck), 46.8, 'coat', { k: .038 });
        burst(t, T_COAT + .2, 65.2, G + 2.8, 46.8, [255, 212, 59], 18);
        bubble(69.2, G + 3.5, 46.5, '奶奶天冷记得加衣！', t, T_COAT, S4);
      }
    },
    ui: (c, t) => {
      tagUI(c, '量子纠缠 -> 分隔两地的左右手套', 1, '#FFD43B');
      if (t >= T_CHANGE && t < T_QUANT) slam(c, t, T_CHANGE, '态度当场大变！', 210, 92, '#FFD43B', 1.6);
      if (t >= T_COAT) stamp(c, t, T_COAT, '附赠：天冷加衣关怀', 1460, 250, '#FFD43B', S4 - T_COAT);
    },
  });
  sfx(T_CHANGE, 'enchant', -9); sfx(T_GLOVE, 'portal', -11); sfx(T_COAT, 'heart', -9);

  // ======================================================================================= S4 · 痛点反差：客客气气问豆包/DeepSeek -> 砸下一堆「正确的废话」
  const T_POLITE = AT('你跟它客客气气说话'), T_TRASH = AT('回你一堆正确的废话'), S5 = A('那今天这期视频');
  shot(S4, S5, {
    day: NIGHT, fog: [45, 145], kicks: [[T_TRASH, .85]],
    keys: [
      K(S4, [98.5, G + 4.0, 53.5], [98.5, G + 2.4, 44], 54),
      K(T_TRASH, [99.2, G + 3.8, 52.0], [98.5, G + 2.2, 45], 50),
      K(S5, [99.5, G + 4.0, 52.5], [98.5, G + 2.3, 45], 52),
    ],
    lights: () => VX.light(98.5, G + 5, 46, ICE, 10, 1.15),
    act: t => {
      const crushed = t >= T_TRASH;
      heige(95.8, G + 1, 46.8, {
        ...emotions(t, [[0, 'shy'], [T_POLITE, 'hopeful'], [T_TRASH, 'dizzy']]),
        view: 'q', poseR: crushed ? 'cover' : 'clasp',
      }, { tag: '客客气气的你', dy: crushed ? -.12 : 0 });
      model('doubao', 99.6, G + 1, 46.2, 'happy', t, { k: .022, flip: true });
      model('deepseek', 101.8, G + 1, 46.6, 'happy', t, { k: .022, flip: true });
      bubble(95.8, G + 3.3, 46.8, '劳驾帮我看看…', t, S4 + .3, T_TRASH - .1);
      if (crushed) {
        for (let i = 0; i < 5; i++) {
          const dk = sm(seg01(t, T_TRASH + i * .09, T_TRASH + i * .09 + .25));
          prop(97.6 + (i - 2) * .45, lerp(G + 6.5, G + 1.5 + i * .28, dk), 46.8, 'doc', { k: .028 });
        }
        burst(t, T_TRASH, 97.6, G + 2.2, 46.8, [255, 102, 92], 20);
      }
    },
    ui: (c, t) => {
      tagUI(c, '打工人日常痛点 · 礼貌提问翻车现场', 1, '#FF7B73');
      if (t >= T_TRASH) slam(c, t, T_TRASH, '一堆正确的废话！', 230, 96, '#FF5A5A', S5 - T_TRASH);
    },
  });
  sfx(T_POLITE, 'chat', -11); sfx(T_TRASH, 'anvil', -7);

  // ======================================================================================= S5 & S6 · 黑哥大电影星光大道：5 句黄金口令卡带 + 远方法庭暴雷大债预告
  const T_FIVE = AT('5句提示词直接分享给你'), T_DEBT = AT('法院刚通报的真事'), T_SCOLD = AT('当场在法庭上挨了训'), S7 = A('我们先说第一个问题');
  shot(S5, T_DEBT - .15, {
    day: DUSK, fog: [55, 175], kicks: [[T_FIVE, .7]],
    keys: [
      K(S5, [BLVD.x, G + 6.5, 101.5], [BLVD.x, G + 4.8, BLVD.archZ], 60),
      K(T_FIVE, [BLVD.x + .8, G + 4.2, 98.2], [BLVD.x, G + 3.2, 88], 54),
    ],
    lights: () => VX.light(BLVD.x, G + 7, 89, WARM, 14, 1.35),
    act: t => {
      heige(BLVD.x, G + 1, 91.5, { ...feel('excited', onTwos(t)), view: 'front', poseR: 'cheer', poseL: 'up' }, { tag: '问问黑哥' });
      model('doubao', BLVD.x - 3.8, G + 1, 91.0, 'happy', t, { k: .022 });
      model('deepseek', BLVD.x + 3.8, G + 1, 91.0, 'happy', t, { k: .022, flip: true });
      for (let i = 0; i < 5; i++) {
        const appear = sm(seg01(t, T_FIVE - .3 + i * .1, T_FIVE + .15 + i * .1));
        if (appear <= 0) continue;
        const ang = (i - 2) * .42;
        const cx = BLVD.x + Math.sin(ang) * 4.4, cy = G + 3.6 + Math.cos(ang) * .9 + Math.sin(t * 4 + i) * .12;
        prop(cx, cy, 90.8, 'card5', { k: .032 * appear });
      }
      riseSparks(t, BLVD.x, G + 2, 88, 12, 6, [255, 212, 59], 18, 1.2, .07);
    },
    ui: (c, t) => {
      skyBeams(c, t, .24);
      worldSign(c, BLVD.x, G + 13.5, 82, 'HEIGE STUDIOS · 黑哥大电影世界', '5 COMMANDS · 4 TIERS', '#FFD43B', 520);
      tagUI(c, '黑哥 AI 大电影宇宙 · 四大段位通关指南', 1, '#FFD43B');
      if (t >= T_FIVE - .1) slam(c, t, T_FIVE - .1, '5 句口令 复制即用！', 225, 92, '#FFD43B', 2.4);
    },
  });
  sfx(S5 + .1, 'powerup', -9); for (let i = 0; i < 5; i++) sfx(T_FIVE + i * .1, 'xp', -12);

  // S6：急速甩镜切至暴雨红警最高审判庭（法官与台前律师全身同框入画！）
  shot(T_DEBT - .15, S7, {
    day: NIGHT, fog: [42, 145], kicks: [[T_SCOLD, 1.1]],
    keys: [
      K(T_DEBT - .15, [143.0, G + 4.6, 92.0], [142.6, G + 2.8, 78.5], 58),
      K(T_SCOLD, [143.0, G + 4.1, 89.8], [142.6, G + 2.6, 78.5], 55),
    ],
    lights: t => VX.light(143, G + 6, 80, t >= T_SCOLD ? ALARM : WARM, 13, 1.35),
    act: t => {
      ppl(143.5, G + 3, 76.5, '法官', 'angry', t, { k: .026, tag: '审判长' });
      ppl(141.2, G + 1, 80.2, '律师', t >= T_SCOLD ? 'panic' : 'neutral', t, { k: .023, shake: t >= T_SCOLD, tag: '涉事代理律师', tagCol: '#FF7B73' });
      prop(143.5, G + 6.6 + Math.sin(t * 3) * .1, 75.0, 'scales', { k: .034 });
      if (t >= T_SCOLD) {
        prop(145.0, G + 4.4, 77.2, 'gavel', { k: .038 });
        ringPulse(t, .9, 141.2, G + 2.0, 80.2, 3.4, [255, 82, 82], 18, .08);
        burst(t, T_SCOLD, 145.0, G + 4.0, 77.2, [255, 90, 80], 24);
      }
    },
    ui: (c, t) => {
      tagUI(c, '片尾高能预警 · 真实法院通报大雷', 1, '#FF5A5A');
      if (t >= T_SCOLD) slam(c, t, T_SCOLD, '漏掉一步 当庭挨训！', 235, 96, '#FF5A5A', S7 - T_SCOLD);
    },
  });
  flash(T_SCOLD, '#FF3A3A', .42, .28);
  sfx(T_DEBT, 'whoosh', -9); sfx(T_SCOLD, 'boom', -6); sfx(T_SCOLD + .15, 'anvil', -8);
})();
