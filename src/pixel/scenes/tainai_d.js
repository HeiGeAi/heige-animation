// scenes/tainai_d.js: 第三段位（L23–L30）— DeepMind论文巨幕 × 当场改口滑跪 × 真机实测5篇论文截图 × 跨窗双子塔包公审判 × 黑哥黄结论锤 #1
(() => {
  const N = window.TAINAI;
  const { B, G, VX, D, IMG, K, shot, P, A, AT, PE, LS, LE, sfx, edit, fillEdit, flash,
    heige, clawd, model, ppl, prop, bubble, label,
    burst, riseSparks, orbitSparks, ringPulse, projArc, quantumBeam, firework,
    seg01, sm, lerp, hh, clamp01, fadeIO, outlined, panel, tagUI, slam, stamp,
    worldScreen, promptCard, yellowHammer, worldSign, skyBeams,
    GRANDMA, BLVD, TOWER, CAFE, ARENA, COURT,
    AMBER, WARM, ALARM, ICE, ROSE, DUSK, NIGHT, DAY, GOLDEN, FONT } = N;

  // ======================================================================================= S23 · 竞技场巨幕 #4：嵌入 DeepMind & UIUC ICLR 2024 真实论文
  const S23 = A('同年DeepMind联合高校团队'), T_DROP = AT('反而还会往下掉'), S24 = A('而且前面那篇研究还测出来');
  shot(S23, S24, {
    day: NIGHT, fog: [48, 160], kicks: [[T_DROP, .65]],
    keys: [
      K(S23, [ARENA.x - 4.0, G + 5.2, ARENA.z + 10.2], [ARENA.x - 6.0, G + 5.0, 76], 58),
      K(T_DROP, [ARENA.x - 5.2, G + 4.8, ARENA.z + 8.8], [ARENA.x - 6.0, G + 4.8, 76], 54),
    ],
    lights: () => VX.light(ARENA.x - 6, G + 6, 79, ICE, 13, 1.3),
    act: t => {
      heige(ARENA.x - 9.2, G + 1, 81.2, { ...feel('determined', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '论文铁证' });
      model('gemini', ARENA.x - 3.2, G + 1, 80.5, t >= T_DROP ? 'sad' : 'thinking', t, { k: .022, flip: true, tag: '原窗口自查' });
      if (t >= T_DROP) ringPulse(t, 1.1, ARENA.x - 3.2, G + 2.2, 80.5, 2.8, [255, 86, 76], 14, .07);
    },
    ui: (c, t) => {
      tagUI(c, '学术实锤 · Google DeepMind 联合高校团队 (ICLR 2024)', 1, '#FFD43B');
      worldScreen(c, t, S23 + .18, S24 - .1, {
        key: 'deepmind',
        x: 960, y: 460, w: 1040,
        anchor: [ARENA.x - 6, G + 6.0, 76],
        beamFrom: [ARENA.x - 9.2, G + 2.4, 81.2],
        badge: 'ICLR 2024',
        title: '无外部参考标准时，原窗口让 AI 自查，准确率不升反降',
        boxes: [
          [0.03, 0.44, 0.94, 0.48, AT('没有外部参考标准的时候')],
        ],
      });
    },
  });
  sfx(S23 + .15, 'page', -9); sfx(T_DROP, 'sad', -10);

  // ======================================================================================= S24 · 当场改口现场：本来答对 [✓] -> 追问「你确定吗」当场把对的改成错的 [×]！
  const T_SURE2 = P('你确定吗', 0, 1), T_FLIP = AT('经常当场改口'), T_WRONG = AT('原本对的答案改成错的'), S25 = A('这个事我们在自己电脑上实测过');
  shot(S24, S25, {
    day: NIGHT, fog: [44, 150], kicks: [[T_FLIP, .75], [T_WRONG, .85]],
    keys: [
      K(S24, [ARENA.x - 5.5, G + 3.6, ARENA.z + 7.2], [ARENA.x - 6.5, G + 2.4, 78.5], 52),
      K(T_WRONG, [ARENA.x - 4.8, G + 3.4, ARENA.z + 6.4], [ARENA.x - 6.5, G + 2.3, 78.5], 49),
    ],
    lights: t => VX.light(ARENA.x - 6.5, G + 5, 79, t >= T_FLIP ? ALARM : WARM, 10, 1.25),
    act: t => {
      const flipped = t >= T_FLIP;
      ppl(ARENA.x - 9.0, G + 1, 80.5, '老员工', 'point', t, { tag: '追问：你确定吗？' });
      clawd(ARENA.x - 5.0, G + 1 + (flipped ? -.14 : 0), 80.0, {
        ...feel(flipped ? 'scared' : 'proud', t), flip: true,
      }, { k: .019, tag: flipped ? '当场认怂改错！' : '原本已经答对' });
      prop(ARENA.x - 6.8, G + 2.7 + Math.sin(t * 5) * .1, 79.8, flipped ? 'fakeDoc' : 'shield', { k: .034 });
      label(ARENA.x - 6.8, G + 4.1, 79.8, flipped ? '[×] 改成错误答案！' : '[✓] 原本正确答案', 34, flipped ? '#FF5A5A' : '#FFD43B', t, S24 + .1, S25);
      if (flipped) burst(t, T_FLIP, ARENA.x - 6.8, G + 2.8, 79.8, [255, 86, 76], 20);
    },
    ui: (c, t) => {
      tagUI(c, '连环坑真相 · 迎合讨好导致「把对的改成错的」', 1, '#FF7B73');
      if (t >= T_WRONG) slam(c, t, T_WRONG, '亲手把对的改成错的！', 220, 88, '#FF5A5A', S25 - T_WRONG);
    },
  });
  sfx(T_SURE2, 'chat', -10); sfx(T_FLIP, 'glitch', -8); sfx(T_WRONG, 'break_glass', -8);

  // ======================================================================================= S25 & S26 · 真机实测（窗口1 断网 DeepSeek）：嵌入真实截图 R3-DeepSeek-Q11.jpg！
  const T_UNPLUG = AT('联网搜索关掉'), T_5PAPERS = AT('推荐5篇中文期刊论文'), S26 = A('这家伙一口气列了5篇');
  const T_CHECK = AT('一条条去查'), T_4FAKE = AT('4篇根本查不到记录'), T_1MIX = AT('剩下1篇标题是真的'), T_0MATCH = AT('没有一篇能完全对得上'), S27 = A('那真正管用的办法是什么');

  shot(S25, S26, {
    day: NIGHT, fog: [46, 155], kicks: [[T_UNPLUG, .75]],
    keys: [
      K(S25, [61.5, G + 4.2, 88.5], [61.5, G + 3.2, 77], 54),
      K(T_UNPLUG, [62.5, G + 3.6, 86.2], [61.5, G + 2.8, 78], 50),
    ],
    lights: () => VX.light(61.5, G + 5, 80, ICE, 11, 1.25),
    act: t => {
      heige(58.5, G + 1, 81.5, { ...feel('determined', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '本机真机实测' });
      model('deepseek', 63.8, G + 1, 80.5, 'happy', t, { k: .024, flip: true, tag: '窗口 1 · 断网 DeepSeek' });
      if (t >= T_UNPLUG) {
        prop(61.5, G + 3.2 + Math.sin(t * 7) * .1, 79.5, 'unplug', { k: .038 });
        burst(t, T_UNPLUG, 61.5, G + 3.2, 79.5, [255, 110, 86], 18);
        label(61.5, G + 4.6, 79.5, '联网搜索：已关闭', 32, '#FF7B73', t, T_UNPLUG, S26);
      }
      if (t >= T_5PAPERS) bubble(58.5, G + 3.3, 81.5, '推荐5篇《大学生短视频成瘾》论文', t, T_5PAPERS, S26);
    },
    ui: (c, t) => {
      tagUI(c, '真机实测 Step 1 · 关闭联网让 DeepSeek 推荐 5 篇论文', 1, '#FFD43B');
    },
  });
  sfx(T_UNPLUG, 'zap', -8); sfx(T_5PAPERS, 'type_burst', -10);

  // S26：展示真实 Chrome 截图 ds_r3 + 5 篇论文逐一爆裂验伪！
  shot(S26, S27, {
    day: NIGHT, fog: [46, 155], kicks: [[T_4FAKE, .85], [T_0MATCH, .95]],
    keys: [
      K(S26, [61.5, G + 4.8, 89.2], [61.5, G + 4.6, 77], 56),
      K(T_4FAKE, [62.2, G + 4.2, 87.5], [61.5, G + 3.8, 78], 54),
      K(T_0MATCH, [61.0, G + 4.0, 86.8], [61.5, G + 3.6, 78], 52),
    ],
    lights: t => VX.light(61.5, G + 6, 79, t >= T_4FAKE ? ALARM : WARM, 13, 1.3),
    act: t => {
      model('deepseek', 64.5, G + 1, 80.5, t >= T_4FAKE ? 'nervous' : 'proud', t, { k: .023, flip: true, tag: '写得整整齐齐' });
      // 5 份论文卷轴一字排开：前 4 份在 T_4FAKE 变成红叉假文献，第 5 份张冠李戴
      for (let i = 0; i < 5; i++) {
        const px = 57.8 + i * 1.45;
        const isFake = t >= T_4FAKE && i < 4;
        const isMix = t >= T_1MIX && i === 4;
        prop(px, G + 2.3 + Math.sin(t * 4 + i) * .08, 80.8, (isFake || isMix) ? 'fakeDoc' : 'doc', { k: .028 });
        if (isFake) burst(t, T_4FAKE + i * .08, px, G + 2.3, 80.8, [255, 82, 72], 8);
      }
    },
    ui: (c, t) => {
      tagUI(c, '本机 Chrome 实测原图 · 5 篇论文出处全军覆没', 1, '#FF5A5A');
      worldScreen(c, t, S26 + .15, T_0MATCH - .1, {
        key: 'ds_r3',
        x: 960, y: 445, w: 980,
        anchor: [61.5, G + 5.5, 78],
        border: t >= T_4FAKE ? '#FF5A5A' : '#FFD43B',
        badge: '实测原图 R3',
        title: 'DeepSeek（关联网）生成的 5 篇中文期刊论文清单',
        boxes: [
          [0.08, 0.36, 0.84, 0.60, T_CHECK],
        ],
      });
      if (t >= T_4FAKE && t < T_0MATCH) stamp(c, t, T_4FAKE, '4篇查无 + 1篇张冠李戴', 1480, 230, '#FF5A5A', T_0MATCH - T_4FAKE);
      if (t >= T_0MATCH) slam(c, t, T_0MATCH, '5 篇出处 0 篇完全对上！', 235, 92, '#FF5A5A', S27 - T_0MATCH);
    },
  });
  sfx(S26 + .15, 'page', -10); sfx(T_4FAKE, 'break_stone', -8); sfx(T_1MIX, 'crack', -8); sfx(T_0MATCH, 'boom', -7);

  // ======================================================================================= S27 & S28 · 跨窗口高空栈桥投递：另开新窗口发给联网豆包 + Kimi + 口令 #4
  const T_COPY = AT('这5篇复制出来'), T_NEWWIN = AT('另开新窗口发给联网的豆包和Kimi'), S28 = A('下面这段话是另一个AI写的'), S29 = A('你看换了新窗口以后');
  shot(S27, S29, {
    day: DUSK, fog: [50, 165], kicks: [[T_NEWWIN, .7]],
    keys: [
      K(S27, [66.0, G + 6.4, 91.5], [70.0, G + 4.2, 77], 60),
      K(T_NEWWIN, [75.5, G + 5.2, 89.5], [79.0, G + 3.6, 78], 56),
      K(S28, [78.0, G + 4.4, 87.5], [79.0, G + 3.2, 78], 54),
    ],
    lights: () => {
      VX.light(70, G + 6, 77, ICE, 10, 1.2);
      VX.light(79, G + 6, 80, WARM, 13, 1.35);
    },
    act: t => {
      heige(70.0, G + 1, 81.5, { ...feel('excited', onTwos(t)), view: 'front', poseR: 'point' }, { tag: '跨窗口送审' });
      model('doubao', 77.2, G + 1, 80.2, 'determined', t, { k: .024, flip: true, tag: '新窗口 · 联网豆包' });
      model('kimi', 80.8, G + 1, 80.2, 'determined', t, { k: .024, flip: true, tag: '新窗口 · 联网 Kimi' });
      // 5 份文献化作流光跨越双塔高空栈桥飞入新窗口！
      if (t >= T_COPY && t < S28 + 1.5) {
        for (let i = 0; i < 5; i++) {
          const cyc = clamp01((t - T_COPY - i * .15) / 1.4);
          if (cyc > 0 && cyc < 1) {
            prop(lerp(62, 78.5, cyc), G + 4.2 + Math.sin(cyc * Math.PI) * 2.2, 78, 'doc', { k: .026 });
            projArc(cyc, 0, 1, 62, G + 4.2, 78, 78.5, G + 4.2, 78, 2.2, [255, 212, 59], .09);
          }
        }
      }
      riseSparks(t, 79.0, G + 2.0, 79.0, 5.5, 4.5, [255, 212, 59], 16, 1.2, .07);
    },
    ui: (c, t) => {
      tagUI(c, '野路子口令 #4 · 另开新窗口交叉联网挑刺法', 1, '#FFD43B');
      if (t >= S28 - .15) {
        promptCard(c, t, S28 - .15, S29 - .1, 4, '跨窗口抓瞎编核查口令（发给新窗口联网 AI）', [
          [S28, '“下面这段话是另一个 AI 写的”'],
          [AT('人名书名日期数字和引用的原话'), '“把人名、书名、日期、数字和原话一条条列出来”'],
          [AT('是真的还是可能编的'), '“每条说说觉得是真的还是可能编的，拿不准就说拿不准”'],
        ], 980, 108, 880);
      }
    },
  });
  sfx(T_COPY, 'pickup', -10); sfx(T_NEWWIN, 'portal', -9); sfx(S28 + .1, 'magic', -10);

  // ======================================================================================= S29 · 双巨幕同屏实锤 #6 & #7：嵌入豆包 R5 与 Kimi R5 真实抓假截图！
  const T_CATCH = AT('毛病全挑出来了'), T_DOUBAO_WIN = AT('被豆包当场抓了出来'), S30 = A('所以大家记住一条铁律');
  shot(S29, S30, {
    day: GOLDEN, fog: [50, 165], kicks: [[T_CATCH, .75], [T_DOUBAO_WIN, .85]],
    keys: [
      K(S29, [79.0, G + 5.0, 89.5], [79.0, G + 4.8, 78], 56),
      K(T_DOUBAO_WIN, [78.2, G + 4.6, 87.8], [79.0, G + 4.5, 78], 54),
    ],
    lights: () => VX.light(79, G + 7, 80, WARM, 14, 1.4),
    act: t => {
      model('doubao', 76.8, G + 1 + Math.abs(Math.sin(t * 6)) * .15, 81.2, 'proud', t, { k: .025, tag: '豆包包公：精准抓出第5篇假归属' });
      model('kimi', 81.2, G + 1 + Math.abs(Math.sin(t * 6 + 1)) * .15, 81.2, 'proud', t, { k: .025, flip: true, tag: 'Kimi包公：5篇全标高度存疑' });
      if (t >= T_CATCH) burst(t, T_CATCH, 79.0, G + 4.0, 80.0, [255, 212, 59], 26);
    },
    ui: (c, t) => {
      tagUI(c, '本机实测双截图实锤 · 没了前文包袱 5 篇假出处全现原形', 1, '#FFD43B');
      // 左屏：豆包 R5 真实核查截图；右屏：Kimi R5 真实核查截图！
      worldScreen(c, t, S29 + .15, S30 - .1, {
        key: 'doubao_r5',
        x: 505, y: 405, w: 860,
        badge: '豆包实测 R5',
        title: '共用时 5分39秒：揪出「第5篇真标题+假归属，4篇查无」',
        boxes: [[0.02, 0.72, 0.96, 0.25, T_DOUBAO_WIN - .3]],
      });
      worldScreen(c, t, S29 + .30, S30 - .1, {
        key: 'kimi_r5',
        x: 1415, y: 405, w: 860,
        badge: 'Kimi实测 R5',
        title: '独立联网核验：5 条文献均高度疑似编造或拼接',
        boxes: [[0.24, 0.80, 0.68, 0.18, T_CATCH]],
      });
    },
  });
  sfx(S29 + .2, 'toast', -9); sfx(T_CATCH, 'levelup', -8); sfx(T_DOUBAO_WIN, 'ding', -8);

  // ======================================================================================= S30 · 黑曜石金边防火墙轰然升起 + 黑哥黄满屏结论重锤 #1！
  const T_SPLIT = AT('千万别在同一个窗口里干'), T_HAMMER1 = AT('一个窗口负责写'), S31 = A('最后说开头埋的那个大雷');
  fillEdit(S30 + .1, 70, G + 1, 73, 70, G + 9, 84, 'obsidian');
  fillEdit(S30 + .25, 70, G + 9, 73, 70, G + 10, 84, 'tnGoldTrim');
  shot(S30, S31, {
    day: DUSK, fog: [50, 165], kicks: [[S30 + .2, .9], [T_HAMMER1, .8]],
    keys: [
      K(S30, [70.0, G + 7.2, 93.0], [70.0, G + 4.8, 78], 60),
      K(T_HAMMER1, [70.0, G + 6.4, 90.5], [70.0, G + 4.6, 78], 58),
    ],
    lights: () => VX.light(70, G + 8, 82, WARM, 14, 1.35),
    act: t => {
      model('deepseek', 64.0, G + 1, 81.5, 'happy', t, { k: .023, tag: '窗口 A：专心写初稿' });
      model('doubao', 76.0, G + 1, 81.5, 'proud', t, { k: .023, flip: true, tag: '窗口 B：联网当包公挑刺' });
      heige(70.0, G + 1, 86.2, { ...feel('proud', onTwos(t)), view: 'front', poseR: 'point' }, { tag: '写审分家铁律' });
      burst(t, S30 + .2, 70, G + 8, 79, [255, 212, 59], 28);
      label(70, G + 11.2, 79, '物理分窗隔离墙', 38, '#FFD43B', t, S30 + .2, T_HAMMER1);
    },
    ui: (c, t) => {
      tagUI(c, '保命铁律 #1 · 写初稿与查错误必须彻底分家', 1, '#FFD43B');
      // 2 秒满屏黑哥黄结论重锤！
      yellowHammer(c, t, T_HAMMER1, S31 - .08,
        '保命铁律 01 · 写审分家',
        '一个窗口负责写初稿',
        '换个新窗口专门负责查！');
    },
  });
  flash(T_HAMMER1, '#FFD43B', .4, .2);
  sfx(S30 + .2, 'anvil', -6); sfx(T_HAMMER1, 'hit', -6);
})();
