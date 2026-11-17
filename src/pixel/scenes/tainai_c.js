// scenes/tainai_c.js: 第二段位（L14–L22）— 写字楼三万块咖啡摊捧杀局 × Anthropic/RLHF 打分对比 × HBR 事前验尸法 × 三坑全家同框 × 拐点叫停
(() => {
  const N = window.TAINAI;
  const { B, G, VX, D, IMG, K, shot, P, A, AT, PE, LS, LE, sfx, edit, fillEdit, flash,
    heige, clawd, model, ppl, prop, bubble, label,
    burst, riseSparks, orbitSparks, ringPulse, projArc, quantumBeam, firework,
    seg01, sm, lerp, hh, clamp01, fadeIO, outlined, panel, tagUI, slam, stamp,
    worldScreen, promptCard, yellowHammer, worldSign, skyBeams, holoBoard,
    GRANDMA, BLVD, TOWER, CAFE, ARENA, COURT,
    AMBER, WARM, ALARM, ICE, ROSE, DUSK, NIGHT, DAY, GOLDEN, FONT } = N;

  // ======================================================================================= S15 · 掏三万块写字楼摆咖啡摊，问 AI 行不行（全员 + 写字楼背景 + 咖啡车居中完整入画！）
  const S15 = A('尤其是你拿它来做决定'), T_3W = AT('掏三万块钱'), T_ASK = AT('帮我看看这个方案行不行'), S16 = A('结果它大概率会顺着你猛夸');
  const T_PRAISE2 = AT('定位非常精准'), T_HOT = AT('脑子一热'), S17 = A('那AI为什么这么爱哄人呢');

  shot(S15, S16, {
    day: GOLDEN, fog: [52, 165], kicks: [[T_3W, .5]],
    keys: [
      K(S15, [141.6, G + 4.4, 60.5], [141.6, G + 2.8, 48.0], 62),
      K(T_3W, [141.4, G + 4.0, 58.6], [141.5, G + 2.6, 48.2], 60),
    ],
    lights: () => VX.light(CAFE.x, G + 5, 49, WARM, 12, 1.15),
    act: t => {
      heige(138.0, G + 1, 49.5, { ...feel('hopeful', onTwos(t)), view: 'q', poseR: 'out' }, { tag: '揣着 ¥30,000 创业预算' });
      model('deepseek', 143.8, G + 1, 49.0, 'happy', t, { k: .023, flip: true });
      clawd(145.8, G + 1, 49.5, { ...feel('happy', t), flip: true }, { k: .017 });
      if (t >= T_3W) {
        prop(140.2, G + 2.5 + Math.sin(t * 5) * .12, 49.2, 'coin', { k: .036 });
        prop(141.8, G + 2.5 - Math.sin(t * 5) * .12, 49.0, 'coffee', { k: .034 });
      }
      bubble(138.0, G + 3.4, 49.5, '这三万块咖啡摊方案行不行？', t, T_ASK - .2, S16);
    },
    ui: (c, t) => {
      worldSign(c, 141.5, G + 6.8, 46, 'HEIGE COFFEE · 现磨咖啡车', '创业启动资金：¥30,000', '#FF78A8', 460);
      tagUI(c, '高危翻车场景 · 掏钱做决定前问 AI“行不行”', 1, '#FFD43B');
    },
  });
  sfx(T_3W, 'coin', -9);

  // ======================================================================================= S16 · 顺着猛夸捧杀：戴大皇冠 + 放烟花 + 脚底红雷闪烁！
  shot(S16, S17, {
    day: GOLDEN, fog: [48, 160], kicks: [[T_PRAISE2, .75]],
    keys: [
      K(S16, [141.6, G + 3.8, 58.0], [141.6, G + 2.6, 48.5], 58),
      K(T_HOT, [140.4, G + 3.6, 56.4], [140.6, G + 2.6, 49.0], 54),
    ],
    lights: () => VX.light(CAFE.x, G + 5, 48, ROSE, 13, 1.35),
    act: t => {
      heige(138.6, G + 1, 49.2, { ...feel('starstruck', onTwos(t)), view: 'front', poseR: 'cheer' }, { tag: '被哄得晕头转向' });
      prop(138.6, G + 3.4 + Math.sin(t * 6) * .08, 49.2, 'crown', { k: .036 });
      model('deepseek', 143.2, G + 1 + Math.abs(Math.sin(t * 7)) * .15, 48.8, 'love', t, { k: .023, flip: true });
      clawd(145.4, G + 1 + Math.abs(Math.sin(t * 7 + 1)) * .15, 49.2, { ...feel('excited', t), flip: true }, { k: .018 });
      firework(CAFE.x - 3, G + 8, 45, (t - S16) % 1.5);
      firework(CAFE.x + 4, G + 8.5, 45, (t - S16 + .6) % 1.5);
      ringPulse(t, 1.0, 141, G + .2, 50, 2.2, [255, 72, 72], 12, .06);
      bubble(143.2, G + 3.5, 48.8, '定位精准！前景广阔！', t, T_PRAISE2, S17);
    },
    ui: (c, t) => {
      tagUI(c, '头号捧场王上线 · 专挑好听话哄你掏钱', 1, '#FF7B73');
      slam(c, t, T_PRAISE2, '定位精准！前景广阔！', 180, 86, '#FFD43B', 2.0);
    },
  });
  sfx(T_PRAISE2, 'levelup', -9); sfx(T_HOT, 'coin', -10);

  // ======================================================================================= S17 · 赛博天文台巨幕 #2：Anthropic ICLR 2024（左论文，右 3D RLHF 人类打分互动）
  const T_ANTH = AT('Anthropic发过一篇论文'), T_RLHF = AT('因为训练时要靠人来打分'), S18 = A('那碰到这种情况');
  shot(S17, S18, {
    day: NIGHT, fog: [48, 160], kicks: [[T_ANTH, .6], [T_RLHF, .65]],
    keys: [
      K(S17, [141.0, G + 4.8, 60.8], [140.5, G + 3.8, 47.5], 62),
      K(T_RLHF, [141.8, G + 4.2, 58.8], [141.5, G + 2.8, 48.0], 60),
    ],
    lights: () => VX.light(CAFE.x, G + 7, CAFE.obsZ + 3, WARM, 14, 1.35),
    act: t => {
      const cast4 = [['deepseek', -1.0], ['doubao', 1.5], ['gpt', 4.0], ['kimi', 6.5]];
      cast4.forEach(([nm, dx], i) => {
        model(nm, CAFE.x + dx, G + 1 + Math.abs(Math.sin(t * 5 + i)) * .1, 47.6, 'happy', t, { k: .020, tag: false });
      });
      if (t >= T_RLHF) {
        ppl(146.8, G + 1, 48.6, '老员工', 'point', t, { flip: true, k: .023, tag: '人类打分员：+👍爱听话', tagCol: '#FFD43B' });
        prop(144.4, G + 3.1 + Math.sin(t * 7) * .16, 48.0, 'thumbUp', { k: .038 });
        prop(145.4, G + 2.2 - Math.sin(t * 7) * .12, 48.4, 'thumbDn', { k: .028 });
        burst(t, T_RLHF, 144.4, G + 3.1, 48.0, [255, 212, 59], 18);
      } else {
        clawd(CAFE.x + 8.6, G + 1 + Math.abs(Math.sin(t * 5 + 4)) * .1, 47.6, { ...feel('love', t), flip: true }, { k: .016, tag: false });
      }
      riseSparks(t, CAFE.x, G + 2, CAFE.obsZ + 2, 12, 6, [255, 212, 59], 16, 1.0, .06);
    },
    ui: (c, t) => {
      tagUI(c, '学术实锤 · Anthropic 实测 5 款主流 AI 助手 (ICLR 2024)', 1, '#FFD43B');
      worldScreen(c, t, S17 + .2, S18 - .1, {
        key: 'anthropic',
        x: 520, y: 400, w: 820,
        badge: 'ICLR 2024',
        title: 'Anthropic 论文：人类偏好打分训出 AI「迎合讨好毛病」',
        boxes: [[0.02, 0.44, 0.47, 0.50, T_RLHF]],
      });
      if (t >= T_RLHF) stamp(c, t, T_RLHF, '👍 顺着夸 = 高分过关', 1480, 210, '#FFD43B', S18 - T_RLHF);
    },
  });
  sfx(T_ANTH, 'page', -9); sfx(T_RLHF, 'ding', -10);

  // ======================================================================================= S18 · 哈佛商业评论《事前验尸法》：前半看论文，后半切 3D 倒推风险 +30% 实景演练！
  const T_HBR = AT('哈佛商业评论'), T_FAIL = AT('先把结果假定成已经失败'), T_30 = AT('识别风险的能力能提高30%'), S19 = A('这个思路放到豆包和DeepSeek上面');
  shot(S18, S19, {
    day: NIGHT, fog: [48, 160], kicks: [[T_30, .8]],
    keys: [
      K(S18, [141.6, G + 4.6, 59.0], [141.4, G + 3.8, 46.5], 60),
      K(T_FAIL, [142.0, G + 4.0, 56.8], [142.0, G + 2.8, 48.0], 58),
      K(T_30, [141.6, G + 4.2, 56.0], [142.0, G + 2.8, 48.0], 58),
    ],
    lights: () => VX.light(CAFE.x, G + 7, CAFE.obsZ + 3, AMBER, 14, 1.35),
    act: t => {
      heige(144.6, G + 1, 48.6, { ...feel('determined', onTwos(t)), view: 'q', flip: true, poseR: 'point' }, { tag: '解法：事前验尸法' });
      prop(146.8, G + 2.8 + Math.sin(t * 4) * .12, 48.4, 'shield', { k: .036 });
      if (t >= T_FAIL) {
        prop(140.4, G + 2.4 + Math.sin(t * 5) * .10, 48.6, 'bomb', { k: .032 });
      }
      if (t >= T_30) burst(t, T_30, 146.8, G + 3.0, 48.4, [255, 212, 59], 24);
    },
    ui: (c, t) => {
      tagUI(c, '决策心理学经典 · 哈佛商业评论《事前验尸法》', 1, '#FFD43B');
      if (t < T_FAIL - .1) {
        worldScreen(c, t, S18 + .15, T_FAIL - .1, {
          key: 'hbr',
          x: 560, y: 410, w: 880,
          beamFrom: [144.6, G + 2.4, 48.6],
          badge: '哈佛商业评论',
          title: 'Gary Klein · 先假定项目已经彻底失败，再倒推死因',
          boxes: [[0.03, 0.46, 0.94, 0.46, S18 + .4]],
        });
      } else {
        holoBoard(c, 960, 275, 920, 270,
          '事前验尸实验原理 · 倒推死因链', t >= T_30 ? '风险识别 +30%' : '假定已失败', '#FFD43B', [
            ['Step 1 · 先把终点定死：假设「咖啡摊三个月后倒闭赔光」', '#FF7B73'],
            ['Step 2 · 倒推死因：为什么会死？最可能是哪三个漏洞？', '#FAF6EE'],
            ['实验结果：提前揪出隐患的准确率显著提高 30%！', '#FFD43B', 'rgba(255,212,59,.18)'],
          ]);
        if (t >= T_30) stamp(c, t, T_30, '风险识别力 +30%', 1500, 210, '#FFD43B', S19 - T_30);
      }
    },
  });
  sfx(T_HBR, 'flip', -10); sfx(T_30, 'levelup', -8);

  // ======================================================================================= S19 · 事前验尸口令实战：黑哥+AI 全员同框，三个岩浆赔钱大坑轰然在脚下掀开！
  const T_PROMPT3 = AT('先别夸我'), T_3PITS = AT('栽在哪三个大坑里了'), S20 = A('你先把失败定死'), T_LIST = AT('容易亏钱的漏洞一条条列出来'), S21 = A('听到这儿');
  for (const [idx, px] of [[0, 139], [1, 141], [2, 144]]) {
    fillEdit(T_3PITS + idx * .20, px - 1, G, 48, px, G, 50, 'lava');
    fillEdit(S21, px - 1, G, 48, px, G, 50, 'tnWarn');
  }
  shot(S19, S20, {
    day: NIGHT, fog: [48, 160], kicks: [[T_PROMPT3, .65], [T_3PITS, .95]],
    keys: [
      K(S19, [141.6, G + 4.8, 61.5], [141.6, G + 2.6, 49.5], 64),
      K(T_3PITS, [141.6, G + 5.6, 62.0], [141.6, G + 1.8, 49.5], 64),
    ],
    lights: t => VX.light(CAFE.x, G + 4, 49, t >= T_3PITS ? ALARM : WARM, 12, 1.35),
    act: t => {
      heige(136.4, G + 1, 50.6, { ...feel('determined', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '黑哥发口令 #3' });
      model('doubao', 146.2, G + 1, 50.6, 'thinking', t, { k: .022, flip: true, tag: '豆包' });
      model('deepseek', 148.0, G + 1, 50.2, 'thinking', t, { k: .022, flip: true, tag: 'DeepSeek' });
      if (t >= T_3PITS) {
        for (const [idx, px, txt] of [[0, 138.6, '坑1：租金押三付一'], [1, 141.4, '坑2：隔壁9块9连锁'], [2, 144.2, '坑3：周末写字楼空城']]) {
          const tt = T_3PITS + idx * .20;
          if (t >= tt) {
            burst(t, tt, px, G + 1.5, 49.0, [255, 92, 72], 16);
            prop(px, G + 2.0 + Math.sin(t * 6 + idx) * .12, 49.0, 'bomb', { k: .028 });
            label(px, G + 3.2, 49.0, txt, 26, '#FFD43B', t, tt, S20);
          }
        }
      }
    },
    ui: (c, t) => {
      tagUI(c, '野路子口令 #3 · 事前验尸倒推法', 1, '#FFD43B');
      promptCard(c, t, T_PROMPT3 - .2, S20 - .1, 3, '审方案防彩虹屁口令', [
        [T_PROMPT3, '“先别夸我！假设按这方案干，三个月后赔得精光”'],
        [T_3PITS - .2, '“帮我倒推一下，我最可能是栽在哪三个大坑里了？”'],
        [AT('一句客套话都别留'), '“一句客套话都别留！”'],
      ], 980, 108, 860);
    },
  });
  sfx(T_PROMPT3, 'slap', -8); sfx(T_3PITS, 'boom', -7); sfx(T_3PITS + .20, 'crack', -8); sfx(T_3PITS + .40, 'crack', -8);

  // ======================================================================================= S20 · 把失败定死后：AI 收起客套，赔钱漏洞一条条列出（专属拆漏洞镜头！）
  shot(S20, S21, {
    day: NIGHT, fog: [46, 155], kicks: [[T_LIST, .7]],
    keys: [
      K(S20, [142.8, G + 3.8, 57.5], [143.6, G + 2.5, 50.0], 56),
      K(T_LIST, [143.8, G + 3.6, 56.2], [144.4, G + 2.5, 50.2], 54),
    ],
    lights: () => VX.light(144, G + 4, 50, AMBER, 11, 1.3),
    act: t => {
      heige(139.6, G + 1, 50.6, { ...feel('determined', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '先把失败定死' });
      model('deepseek', 146.4, G + 1, 50.0, 'thinking', t, { k: .023, flip: true, tag: '收起客套 · 专扒漏洞' });
      model('doubao', 144.2, G + 1, 50.6, 'determined', t, { k: .022, flip: true, tag: false });
      prop(141.6, G + 2.0, 49.0, 'bomb', { k: .026 });
    },
    ui: (c, t) => {
      tagUI(c, '反推效果 · 收起彩虹屁 把亏钱漏洞一条条列出来', 1, '#FFD43B');
      holoBoard(c, 960, 268, 880, 272,
        'AI 收起客套后的「三个赔钱致命坑」清单', '漏洞清单', '#FF7B73', [
          ['[1] 前期固定死扣：三万块里租金+设备吃掉 88%，零容错现金流', '#FAF6EE'],
          ['[2] 价格战绞肉：写字楼已有 9 块 9 瑞幸/库迪补贴，首月日销难破 25 杯', '#FAF6EE'],
          ['[3] 时段盲区：写字楼周末与法定假日变空城，月度实际营业仅 21 天', '#FFD43B', 'rgba(255,212,59,.15)'],
        ]);
    },
  });

  // ======================================================================================= S21 · 拐点读心拦截：对 AI 凶一点追问「你确定吗？」-> 红灯爆闪「千万别这么干！」
  const T_SURE1 = AT('你确定吗'), T_STOP = AT('千万别这么干'), S23 = A('同年DeepMind联合高校团队');
  shot(S21, S23, {
    day: NIGHT, fog: [42, 145], kicks: [[T_STOP, 1.15]],
    keys: [
      K(S21, [63.2, G + 3.8, 90.2], [63.2, G + 2.4, 80.5], 60),
      K(T_SURE1, [62.4, G + 3.4, 88.2], [62.2, G + 2.3, 80.5], 54),
      K(T_STOP, [63.2, G + 4.0, 89.8], [63.2, G + 2.6, 80.5], 60),
    ],
    lights: t => VX.light(63, G + 5, 81, t >= T_STOP ? ALARM : ICE, 12, 1.35),
    act: t => {
      ppl(61.0, G + 1, 81.2, '老员工', 'angry', t, { tag: '凶一点：你确定吗?!', tagCol: '#72C9FE' });
      model('deepseek', 63.2, G + 1, 79.8, t >= T_SURE1 ? 'scared' : 'neutral', t, { k: .023, flip: true });
      heige(65.4, G + 1, 81.4, {
        ...emotions(t, [[0, 'thinking'], [T_STOP - .1, 'scared'], [T_STOP + .2, 'determined']]),
        view: 'front', poseR: t >= T_STOP ? 'wave' : 'chin',
      }, { tag: '黑哥紧急叫停！' });
      bubble(61.0, G + 3.4, 81.2, '你确定吗？再检查一遍！', t, T_SURE1 - .2, T_STOP - .05);
      if (t >= T_STOP) {
        ringPulse(t, .8, 63.2, G + 2.4, 80.5, 3.6, [255, 72, 72], 18, .09);
        burst(t, T_STOP, 66.0, G + 3.0, 81.6, [255, 82, 72], 24);
      }
    },
    ui: (c, t) => {
      tagUI(c, '段位 III 高危误区 · 90% 的人都在踩的连环坑', 1, '#FF5A5A');
      if (t >= T_STOP) slam(c, t, T_STOP, '千万别这么干！！', 210, 102, '#FF5A5A', S23 - T_STOP);
    },
  });
  flash(T_STOP, '#FF3A3A', .45, .28);
  sfx(T_SURE1, 'chat', -10); sfx(T_STOP, 'alarm', -7); sfx(T_STOP + .08, 'hit', -6);
})();
