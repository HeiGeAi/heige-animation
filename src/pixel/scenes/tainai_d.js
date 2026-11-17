// scenes/tainai_d.js: 第三段位（L23–L30）— DeepMind 论文降智 × 追问当场改错 × 断网 DeepSeek 5 篇论文实测 × 跨窗飞桥 × 豆包 Kimi 双审 + 特写抓出第 5 篇 × 写审分家墙与黄锤 #1
(() => {
  const N = window.TAINAI;
  const { B, G, VX, D, IMG, K, shot, P, A, AT, PE, LS, LE, sfx, edit, fillEdit, flash,
    heige, clawd, model, ppl, prop, bubble, label,
    burst, riseSparks, orbitSparks, ringPulse, projArc, quantumBeam, firework,
    seg01, sm, lerp, hh, clamp01, fadeIO, outlined, panel, tagUI, slam, stamp,
    worldScreen, promptCard, yellowHammer, worldSign, skyBeams, holoBoard,
    GRANDMA, BLVD, TOWER, CAFE, ARENA, COURT,
    AMBER, WARM, ALARM, ICE, ROSE, DUSK, NIGHT, DAY, GOLDEN, FONT } = N;

  // ======================================================================================= S23 · DeepMind & UIUC (ICLR 2024)：原窗口自查，准确率不升反降！
  const S23 = A('同年DeepMind联合高校团队'), T_DROP = AT('反而还会往下掉'), S24 = A('而且前面那篇研究还测出来');
  shot(S23, S24, {
    day: NIGHT, fog: [48, 160], kicks: [[T_DROP, .75]],
    keys: [
      K(S23, [64.0, G + 4.8, 92.2], [63.5, G + 3.6, 80.0], 62),
      K(T_DROP, [64.8, G + 4.4, 90.6], [64.2, G + 3.0, 80.0], 60),
    ],
    lights: t => VX.light(64.5, G + 6, 80, t >= T_DROP ? ALARM : ICE, 13, 1.3),
    act: t => {
      heige(65.0, G + 1, 81.0, { ...feel('determined', onTwos(t)), view: 'q', flip: true, poseR: 'point' }, { tag: '论文铁证' });
      model('gemini', 67.6, G + 1, 80.5, t >= T_DROP ? 'sad' : 'thinking', t, { k: .022, flip: true, tag: '原窗口越查越错' });
      if (t >= T_DROP) ringPulse(t, 1.1, 67.6, G + 2.2, 80.5, 2.8, [255, 86, 76], 14, .07);
    },
    ui: (c, t) => {
      tagUI(c, '学术实锤 · Google DeepMind 联合高校团队 (ICLR 2024)', 1, '#FFD43B');
      worldScreen(c, t, S23 + .15, S24 - .1, {
        key: 'deepmind',
        x: 500, y: 455, w: 800,
        badge: 'ICLR 2024',
        title: '无外部参考标准时，原窗口自查准确率不升反降',
        boxes: [
          [0.01, 0.21, 0.96, 0.08, S23 + .3],
          [0.03, 0.69, 0.96, 0.17, AT('没有外部参考标准的时候')],
        ],
      });
      if (t >= T_DROP - .2) stamp(c, t, T_DROP - .2, '准确率 📉 往下掉！', 1480, 220, '#FF5A5A', S24 - T_DROP + .2);
    },
  });
  sfx(S23 + .15, 'page', -9); sfx(T_DROP, 'sad', -10);

  // ======================================================================================= S24 · 哪怕本来答对：追问「你确定吗？」-> 当场从 [✓] 改成 [×]！
  const T_SURE2 = P('你确定吗', 0, 1), T_FLIP = AT('经常当场改口'), T_WRONG = AT('原本对的答案改成错的'), S25 = A('这个事我们在自己电脑上实测过');
  shot(S24, S25, {
    day: NIGHT, fog: [44, 150], kicks: [[T_FLIP, .75], [T_WRONG, .9]],
    keys: [
      K(S24, [63.2, G + 4.0, 90.2], [63.2, G + 2.6, 80.2], 58),
      K(T_WRONG, [63.8, G + 3.6, 88.6], [63.4, G + 2.4, 80.2], 54),
    ],
    lights: t => VX.light(63.2, G + 5, 80, t >= T_FLIP ? ALARM : WARM, 11, 1.3),
    act: t => {
      const flipped = t >= T_FLIP;
      ppl(60.4, G + 1, 80.6, '老员工', 'point', t, { tag: '追问：你确定吗？' });
      clawd(65.6, G + 1 + (flipped ? -.12 : 0), 80.2, {
        ...feel(flipped ? 'scared' : 'proud', t), flip: true,
      }, { k: .020, tag: flipped ? '当场慌了改错！' : '原本已经答对' });
      prop(63.0, G + 2.7 + Math.sin(t * 5) * .1, 80.0, flipped ? 'fakeDoc' : 'shield', { k: .036 });
      if (flipped) burst(t, T_FLIP, 63.0, G + 2.8, 80.0, [255, 86, 76], 22);
    },
    ui: (c, t) => {
      tagUI(c, '连环坑真相 · 一被质疑就当场改口认怂', 1, '#FF7B73');
      const flipped = t >= T_FLIP;
      holoBoard(c, 960, 295, 760, 200,
        '同一窗口追问实测现象', flipped ? '改成错的！' : '原本答对', flipped ? '#FF5A5A' : '#FFD43B', [
          [flipped ? '[×] 当前输出：“抱歉我算错了！答案应该是 B（错）”' : '[✓] 初始输出：“正确结论为 A”', flipped ? '#FF7B73' : '#FFD43B', flipped ? 'rgba(255,90,90,.20)' : 'rgba(255,212,59,.15)'],
        ]);
      if (t >= T_WRONG) stamp(c, t, T_WRONG, '把对的改成错的！', 1480, 240, '#FF5A5A', S25 - T_WRONG);
    },
  });
  sfx(T_SURE2, 'chat', -10); sfx(T_FLIP, 'glitch', -8); sfx(T_WRONG, 'break_glass', -8);

  // ======================================================================================= S25 · 断网实测 Step 1：黑哥 + 断网线 + DeepSeek 全员完整同框！
  const T_UNPLUG = AT('联网搜索关掉'), T_5PAPERS = AT('推荐5篇中文期刊论文'), S26 = A('这家伙一口气列了5篇');
  const T_CHECK = AT('一条条去查'), T_4FAKE = AT('4篇根本查不到记录'), T_1MIX = AT('剩下1篇标题是真的'), T_0MATCH = AT('没有一篇能完全对得上'), S27 = A('那真正管用的办法是什么');

  shot(S25, S26, {
    day: NIGHT, fog: [46, 155], kicks: [[T_UNPLUG, .8]],
    keys: [
      K(S25, [61.5, G + 4.4, 92.0], [61.5, G + 2.8, 80.5], 60),
      K(T_UNPLUG, [61.5, G + 4.0, 90.8], [61.5, G + 2.6, 80.5], 58),
    ],
    lights: () => VX.light(61.5, G + 5, 81, ICE, 12, 1.3),
    act: t => {
      heige(58.4, G + 1, 81.2, { ...feel('determined', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '本机电脑实测' });
      model('deepseek', 64.6, G + 1, 80.6, 'happy', t, { k: .024, flip: true, tag: '窗口 1 · 断网 DeepSeek' });
      if (t >= T_UNPLUG) {
        prop(61.5, G + 3.2 + Math.sin(t * 7) * .1, 80.2, 'unplug', { k: .040 });
        burst(t, T_UNPLUG, 61.5, G + 3.2, 80.2, [255, 110, 86], 20);
        label(61.5, G + 4.6, 80.2, '[×] 联网搜索已关闭', 34, '#FF7B73', t, T_UNPLUG, S26);
      }
      if (t >= T_5PAPERS) bubble(58.4, G + 3.5, 81.2, '推荐5篇《大学生短视频成瘾》论文', t, T_5PAPERS, S26);
    },
    ui: (c, t) => {
      tagUI(c, '真机实测 Step 1 · 关闭联网让 DeepSeek 推荐 5 篇论文', 1, '#FFD43B');
    },
  });
  sfx(T_UNPLUG, 'zap', -8); sfx(T_5PAPERS, 'type_burst', -10);

  // ======================================================================================= S26 · Real Chrome 截图 ds_r3 + 5 篇论文逐一验伪（左图右核查表 + 最后全红 0/5）
  shot(S26, S27, {
    day: NIGHT, fog: [46, 155], kicks: [[T_4FAKE, .85], [T_0MATCH, .95]],
    keys: [
      K(S26, [61.5, G + 4.6, 91.5], [61.5, G + 3.6, 79.5], 60),
      K(T_4FAKE, [60.8, G + 4.0, 89.8], [60.8, G + 3.0, 80.0], 56),
      K(T_0MATCH, [61.5, G + 4.0, 89.2], [61.5, G + 2.8, 80.0], 56),
    ],
    lights: t => VX.light(61.5, G + 6, 80, t >= T_4FAKE ? ALARM : WARM, 13, 1.3),
    act: t => {
      model('deepseek', 64.6, G + 1, 80.5, t >= T_4FAKE ? 'nervous' : 'proud', t, { k: .023, flip: true, tag: '写得整整齐齐' });
      for (let i = 0; i < 5; i++) {
        const px = 57.6 + i * 1.4;
        const isFake = t >= T_4FAKE && i < 4;
        const isMix = t >= T_1MIX && i === 4;
        prop(px, G + 2.3 + Math.sin(t * 4 + i) * .08, 80.8, (isFake || isMix) ? 'fakeDoc' : 'doc', { k: .028 });
        if (isFake) burst(t, T_4FAKE + i * .08, px, G + 2.3, 80.8, [255, 82, 72], 8);
      }
      if (t >= T_CHECK && t < T_0MATCH) {
        prop(57.6 + ((t - T_CHECK) * 2.2 % 5.6), G + 3.0, 81.2, 'magnify', { k: .034 });
      }
    },
    ui: (c, t) => {
      tagUI(c, '本机 Chrome 实测原图 · 5 篇论文出处全军覆没', 1, '#FF5A5A');
      worldScreen(c, t, S26 + .15, T_0MATCH - .05, {
        key: 'ds_r3',
        x: 560, y: 425, w: 860,
        border: t >= T_4FAKE ? '#FF5A5A' : '#FFD43B',
        badge: '实测原图 R3',
        title: 'DeepSeek（关联网）生成的 5 篇论文清单',
        boxes: [[0.08, 0.36, 0.84, 0.60, T_CHECK]],
      });
      if (t >= T_CHECK && t < T_0MATCH) {
        holoBoard(c, 1440, 390, 760, 390,
          '知网 / 学术库逐条核验结果', '打假清单', '#FF5A5A', [
            [t >= T_4FAKE ? '第 1 篇：李敏等 · 《心理健康》 → [×] 查无此文' : '第 1 篇：李敏等 · 核查中…', t >= T_4FAKE ? '#FF7B73' : '#FAF6EE', t >= T_4FAKE ? 'rgba(255,90,90,.16)' : null],
            [t >= T_4FAKE ? '第 2 篇：王冰等 · 《中国校医》 → [×] 查无此文' : '第 2 篇：王冰等 · 核查中…', t >= T_4FAKE ? '#FF7B73' : '#FAF6EE', t >= T_4FAKE ? 'rgba(255,90,90,.16)' : null],
            [t >= T_4FAKE ? '第 3–4 篇：刘文 / 陈晨等 → [×] 均查无此文' : '第 3–4 篇：刘文 / 陈晨等 · 核查中…', t >= T_4FAKE ? '#FF7B73' : '#FAF6EE', t >= T_4FAKE ? 'rgba(255,90,90,.16)' : null],
            [t >= T_1MIX ? '第 5 篇：黄文涛等 → [!] 真标题但错作者/年份' : '第 5 篇：黄文涛等 · 核查中…', t >= T_1MIX ? '#FFD43B' : '#FAF6EE', t >= T_1MIX ? 'rgba(255,212,59,.18)' : null],
          ]);
      }
      if (t >= T_0MATCH) slam(c, t, T_0MATCH, '5 篇出处 0 篇能完全对上！', 210, 88, '#FF5A5A', S27 - T_0MATCH);
    },
  });
  sfx(S26 + .15, 'page', -10); sfx(T_4FAKE, 'break_stone', -8); sfx(T_1MIX, 'crack', -8); sfx(T_0MATCH, 'boom', -7);

  // ======================================================================================= S27a · 拆解办法（1）：别在原窗口死磕！
  const T_COPY = AT('这5篇复制出来'), T_NEWWIN = AT('另开新窗口发给联网的豆包和Kimi'), S28 = A('下面这段话是另一个AI写的'), S29 = A('你看换了新窗口以后');
  shot(S27, T_COPY - .1, {
    day: NIGHT, fog: [48, 160],
    keys: [
      K(S27, [62.5, G + 4.2, 91.5], [62.0, G + 2.8, 80.5], 58),
      K(T_COPY - .2, [64.5, G + 4.6, 92.0], [64.0, G + 3.0, 80.5], 60),
    ],
    lights: () => VX.light(62, G + 5, 81, ICE, 12, 1.3),
    act: t => {
      heige(60.5, G + 1, 81.2, { ...feel('determined', onTwos(t)), view: 'q', poseR: 'wave' }, { tag: '别在原窗口死磕！' });
      model('deepseek', 64.2, G + 1, 80.5, 'nervous', t, { k: .023, flip: true, tag: '原窗口有历史包袱' });
    },
    ui: (c, t) => {
      tagUI(c, '破局第一步 · 千万别在原窗口里跟它较劲', 1, '#FFD43B');
      slam(c, t, AT('千万别在原来的窗口里跟它较劲'), '[×] 别在原窗口死磕！', 200, 86, '#FF7B73', T_COPY - AT('千万别在原来的窗口里跟它较劲'));
    },
  });

  // ======================================================================================= S27b · 跨窗天桥追踪运镜：5 份论文飞跃高空栈桥送进联网新窗口！
  shot(T_COPY - .1, S28, {
    day: DUSK, fog: [50, 165], kicks: [[T_NEWWIN, .75]],
    keys: [
      K(T_COPY - .1, [64.5, G + 5.6, 92.5], [64.5, G + 3.6, 79.0], 60),
      K(T_NEWWIN, [72.0, G + 5.6, 92.5], [72.0, G + 3.8, 79.0], 62),
      K(S28, [78.0, G + 4.8, 91.2], [78.5, G + 3.2, 80.0], 60),
    ],
    lights: () => {
      VX.light(64, G + 6, 79, ICE, 10, 1.2);
      VX.light(79, G + 6, 80, WARM, 13, 1.35);
    },
    act: t => {
      heige(64.5, G + 1, 81.0, { ...feel('excited', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '复制出来搬去新窗！' });
      model('doubao', 77.0, G + 1, 80.2, 'determined', t, { k: .024, flip: true, tag: '新窗口 · 联网豆包' });
      model('kimi', 80.4, G + 1, 80.2, 'determined', t, { k: .024, flip: true, tag: '新窗口 · 联网 Kimi' });
      for (let i = 0; i < 5; i++) {
        const cyc = clamp01((t - T_COPY - i * .16) / 1.5);
        if (cyc > 0 && cyc < 1) {
          prop(lerp(64.5, 78.2, cyc), G + 4.2 + Math.sin(cyc * Math.PI) * 2.4, 79.0, 'doc', { k: .030 });
          projArc(cyc, 0, 1, 64.5, G + 4.2, 79.0, 78.2, G + 4.2, 79.0, 2.4, [255, 212, 59], .09);
        }
      }
      riseSparks(t, 79.0, G + 2.0, 79.0, 5.5, 4.5, [255, 212, 59], 16, 1.2, .07);
    },
    ui: (c, t) => {
      tagUI(c, '破局第二步 · 另开新窗口发给联网豆包和 Kimi', 1, '#FFD43B');
    },
  });
  sfx(T_COPY, 'pickup', -10); sfx(T_NEWWIN, 'portal', -9);

  // ======================================================================================= S28 · 联网核查口令 #4（左角色、右口令卡片零遮挡！）
  shot(S28, S29, {
    day: DUSK, fog: [50, 165],
    keys: [
      K(S28, [80.2, G + 4.2, 91.5], [80.2, G + 2.8, 80.5], 60),
      K(S29, [79.8, G + 4.0, 90.8], [80.0, G + 2.8, 80.5], 58),
    ],
    lights: () => VX.light(79, G + 6, 80, WARM, 13, 1.35),
    act: t => {
      model('doubao', 76.6, G + 1, 80.5, 'determined', t, { k: .024, tag: '新窗口 · 联网豆包' });
      model('kimi', 79.6, G + 1, 80.5, 'determined', t, { k: .024, tag: '新窗口 · 联网 Kimi' });
      riseSparks(t, 78.0, G + 1.8, 80.5, 5.0, 4.0, [255, 212, 59], 14, 1.1, .06);
    },
    ui: (c, t) => {
      tagUI(c, '野路子口令 #4 · 跨窗口交叉联网挑刺法', 1, '#FFD43B');
      promptCard(c, t, S28, S29 - .1, 4, '跨窗口抓瞎编核查口令', [
        [S28, '“下面这段话是另一个 AI 写的”'],
        [AT('人名书名日期数字和引用的原话'), '“把人名、书名、日期、数字和原话一条条列出来”'],
        [AT('是真的还是可能编的'), '“每条说说觉得是真的还是可能编的，拿不准就说拿不准”'],
      ], 960, 118, 890);
    },
  });
  sfx(S28 + .1, 'magic', -10);

  // ======================================================================================= S29 · 实测双截图实锤 #6 & #7 + 豆包特写抓出第 5 篇！
  const T_CATCH = AT('毛病全挑出来了'), T_DOUBAO_WIN = AT('被豆包当场抓了出来'), S30 = A('所以大家记住一条铁律');
  shot(S29, T_DOUBAO_WIN - .6, {
    day: GOLDEN, fog: [50, 165], kicks: [[T_CATCH, .75]],
    keys: [
      K(S29, [79.0, G + 5.2, 92.0], [79.0, G + 4.4, 79.5], 60),
      K(T_CATCH, [79.0, G + 5.0, 91.2], [79.0, G + 4.2, 79.5], 58),
    ],
    lights: () => VX.light(79, G + 7, 80, WARM, 14, 1.4),
    act: t => {
      model('doubao', 76.2, G + 1 + Math.abs(Math.sin(t * 6)) * .15, 81.2, 'proud', t, { k: .023, tag: '豆包 · 独立联网挑错' });
      model('kimi', 81.8, G + 1 + Math.abs(Math.sin(t * 6 + 1)) * .15, 81.2, 'proud', t, { k: .023, flip: true, tag: 'Kimi · 5篇全标存疑' });
      if (t >= T_CATCH) burst(t, T_CATCH, 79.0, G + 3.6, 80.5, [255, 212, 59], 24);
    },
    ui: (c, t) => {
      tagUI(c, '本机实测双截图 · 没了前文包袱 5 篇假出处全现原形', 1, '#FFD43B');
      worldScreen(c, t, S29 + .15, T_DOUBAO_WIN - .65, {
        key: 'doubao_r5',
        x: 500, y: 345, w: 760,
        badge: '豆包实测 R5',
        title: '用时 5分39秒：揪出 4 篇查无 + 第 5 篇真标题错归属',
        boxes: [[0.02, 0.72, 0.96, 0.25, T_CATCH - 1.0]],
      });
      worldScreen(c, t, S29 + .25, T_DOUBAO_WIN - .65, {
        key: 'kimi_r5',
        x: 1420, y: 345, w: 760,
        badge: 'Kimi实测 R5',
        title: '独立联网核验：5 条文献全部高度疑似编造',
        boxes: [[0.24, 0.80, 0.68, 0.18, T_CATCH]],
      });
    },
  });
  sfx(S29 + .2, 'toast', -9); sfx(T_CATCH, 'levelup', -8);

  // S29b · 特写 Hero-Zoom `doubao_r5`（当场抓出套着真标题的第 5 篇！）
  shot(T_DOUBAO_WIN - .6, S30, {
    day: GOLDEN, fog: [50, 165], kicks: [[T_DOUBAO_WIN, .85]],
    keys: [
      K(T_DOUBAO_WIN - .6, [77.6, G + 4.4, 91.2], [77.8, G + 3.4, 80.2], 58),
      K(S30, [77.2, G + 4.2, 90.4], [77.4, G + 3.2, 80.5], 56),
    ],
    lights: () => VX.light(77, G + 6, 81, WARM, 14, 1.4),
    act: t => {
      model('doubao', 73.4, G + 1 + Math.abs(Math.sin(t * 7)) * .16, 81.2, 'proud', t, { k: .024, tag: '豆包包公当场抓获！' });
      prop(75.4, G + 2.8, 81.0, 'magnify', { k: .036 });
    },
    ui: (c, t) => {
      tagUI(c, '高光抓假实锤 · 套着真标题的拼接论文被豆包当场抓出！', 1, '#FFD43B');
      worldScreen(c, t, T_DOUBAO_WIN - .55, S30 - .05, {
        key: 'doubao_r5',
        x: 1240, y: 445, w: 1000,
        badge: '豆包特写 R5',
        title: '第 5 篇精准定性：真标题存在，但作者/期刊/年份全错！',
        boxes: [[0.02, 0.72, 0.96, 0.25, T_DOUBAO_WIN - .4]],
      });
      stamp(c, t, T_DOUBAO_WIN, '当场抓现形！', 1620, 210, '#FFD43B', S30 - T_DOUBAO_WIN);
    },
  });
  sfx(T_DOUBAO_WIN, 'ding', -8);

  // ======================================================================================= S30 · 物理分窗墙轰然落下（两AI + 墙 + 黑哥全员完整入框！）-> 黑哥黄结论重锤 #1！
  const T_HAMMER1 = AT('一个窗口负责写'), S31 = A('最后说开头埋的那个大雷');
  fillEdit(S30 + .12, 70, G + 1, 73, 70, G + 8, 83, 'obsidian');
  fillEdit(S30 + .28, 70, G + 8, 73, 70, G + 9, 83, 'tnGoldTrim');
  shot(S30, S31, {
    day: DUSK, fog: [50, 165], kicks: [[S30 + .2, .9], [T_HAMMER1, .8]],
    keys: [
      K(S30, [70.0, G + 5.6, 98.5], [70.0, G + 3.4, 81.5], 64),
      K(T_HAMMER1, [70.0, G + 5.2, 96.5], [70.0, G + 3.4, 81.5], 62),
    ],
    lights: () => VX.light(70, G + 8, 82, WARM, 14, 1.35),
    act: t => {
      model('deepseek', 65.4, G + 1, 82.0, 'happy', t, { k: .023, tag: '窗口 A：专心写初稿' });
      model('doubao', 74.6, G + 1, 82.0, 'proud', t, { k: .023, flip: true, tag: '窗口 B：换窗当包公挑刺' });
      heige(70.0, G + 1, 85.8, { ...feel('proud', onTwos(t)), view: 'front', poseR: 'point' }, { tag: '写审分家铁律' });
      burst(t, S30 + .2, 70, G + 7, 80, [255, 212, 59], 28);
      label(70, G + 10.2, 80, '物理分窗隔离墙', 36, '#FFD43B', t, S30 + .2, T_HAMMER1);
    },
    ui: (c, t) => {
      tagUI(c, '保命铁律 #1 · 写初稿与挑毛病必须彻底分家', 1, '#FFD43B');
      yellowHammer(c, t, T_HAMMER1, S31 - .08,
        '保命铁律 01 · 写审分家',
        '一个窗口负责写初稿',
        '换个新窗口专门负责查！');
    },
  });
  flash(T_HAMMER1, '#FFD43B', .4, .2);
  sfx(S30 + .2, 'anvil', -6); sfx(T_HAMMER1, 'hit', -6);
})();
