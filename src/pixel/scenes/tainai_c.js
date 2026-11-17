// scenes/tainai_c.js: 第二段位（L14–L22）— 三万块霓虹咖啡餐车捧杀局 × Anthropic/HBR 真实论文巨幕 × 事前验尸法 × 拐点读心拦截
(() => {
  const N = window.TAINAI;
  const { B, G, VX, D, IMG, K, shot, P, A, AT, PE, LS, LE, sfx, edit, fillEdit, flash,
    heige, clawd, model, ppl, prop, bubble, label,
    burst, riseSparks, orbitSparks, ringPulse, projArc, quantumBeam, firework,
    seg01, sm, lerp, hh, clamp01, fadeIO, outlined, panel, tagUI, slam, stamp,
    worldScreen, promptCard, yellowHammer, worldSign, skyBeams,
    GRANDMA, BLVD, TOWER, CAFE, ARENA, COURT,
    AMBER, WARM, ALARM, ICE, ROSE, DUSK, NIGHT, DAY, GOLDEN, FONT } = N;

  // ======================================================================================= S15 & S16 · 三万块写字楼摆咖啡摊 -> AI 猛夸戴高帽捧杀
  const S15 = A('尤其是你拿它来做决定'), T_3W = AT('掏三万块钱'), T_ASK = AT('帮我看看这个方案行不行'), S16 = A('结果它大概率会顺着你猛夸');
  const T_PRAISE2 = AT('定位非常精准'), T_HOT = AT('脑子一热'), S17 = A('那AI为什么这么爱哄人呢');

  shot(S15, S16, {
    day: GOLDEN, fog: [48, 160],
    keys: [
      K(S15, [CAFE.x - 1.5, G + 4.4, 56.5], [CAFE.x, G + 3.0, 46], 56),
      K(T_3W, [CAFE.x - .8, G + 3.8, 54.8], [CAFE.x, G + 2.8, 46.5], 54),
    ],
    lights: () => VX.light(CAFE.x, G + 5, 49, WARM, 10, 1.05),
    act: t => {
      heige(CAFE.x - 3.0, G + 1, 49.5, { ...feel('hopeful', onTwos(t)), view: 'q', poseR: 'out' }, { tag: '揣着 ¥30,000 创业预算' });
      model('deepseek', CAFE.x + 2.6, G + 1, 49.0, 'happy', t, { k: .023, flip: true });
      clawd(CAFE.x + 4.6, G + 1, 49.5, { ...feel('happy', t), flip: true }, { k: .017 });
      if (t >= T_3W) {
        prop(CAFE.x - 1.2, G + 2.5 + Math.sin(t * 5) * .12, 49.2, 'coin', { k: .034 });
        prop(CAFE.x + .6, G + 2.5 - Math.sin(t * 5) * .12, 49.0, 'coffee', { k: .032 });
      }
      bubble(CAFE.x - 3.0, G + 3.3, 49.5, '这三万块咖啡摊方案行不行？', t, T_ASK - .1, S16);
    },
    ui: (c, t) => {
      worldSign(c, 141.5, G + 6.6, 46, 'HEIGE COFFEE · 现磨咖啡车', '创业启动资金：¥30,000', '#FF78A8', 460);
      tagUI(c, '高危翻车场景 · 掏钱做决定前问 AI“行不行”', 1, '#FFD43B');
    },
  });
  sfx(T_3W, 'coin', -9);

  shot(S16, S17, {
    day: GOLDEN, fog: [48, 160], kicks: [[T_PRAISE2, .75]],
    keys: [
      K(S16, [CAFE.x - .5, G + 3.5, CAFE.z + 7.0], [CAFE.x, G + 2.8, 46], 52),
      K(T_HOT, [CAFE.x + 1.2, G + 3.8, CAFE.z + 6.5], [CAFE.x - 1.5, G + 2.6, 48], 50),
    ],
    lights: () => VX.light(CAFE.x, G + 5, 48, ROSE, 12, 1.35),
    act: t => {
      heige(CAFE.x - 2.6, G + 1, 49.2, { ...feel('starstruck', onTwos(t)), view: 'front', poseR: 'cheer' }, { tag: '被哄得晕头转向' });
      // AI 给黑哥头顶戴上大皇冠猛吹彩虹屁，脚下三个陷阱却在暗暗闪红光！
      prop(CAFE.x - 2.6, G + 3.35 + Math.sin(t * 6) * .08, 49.2, 'crown', { k: .034 });
      model('deepseek', CAFE.x + 1.8, G + 1 + Math.abs(Math.sin(t * 7)) * .15, 48.8, 'love', t, { k: .023, flip: true });
      clawd(CAFE.x + 3.8, G + 1 + Math.abs(Math.sin(t * 7 + 1)) * .15, 49.2, { ...feel('excited', t), flip: true }, { k: .018 });
      firework(CAFE.x - 3, G + 8, 45, (t - S16) % 1.5);
      firework(CAFE.x + 4, G + 8.5, 45, (t - S16 + .6) % 1.5);
      ringPulse(t, 1.0, 141, G + .2, 50, 2.2, [255, 72, 72], 12, .06); // 脚底隐患暗涌
      bubble(CAFE.x + 1.8, G + 3.4, 48.8, '定位精准！前景广阔！', t, T_PRAISE2, S17);
    },
    ui: (c, t) => {
      tagUI(c, '头号捧场王上线 · 专挑好听话哄你掏钱', 1, '#FF7B73');
      slam(c, t, T_PRAISE2, '定位精准！前景广阔！', 215, 88, '#FFD43B', 2.0);
    },
  });
  sfx(T_PRAISE2, 'levelup', -9); sfx(T_HOT, 'coin', -10);

  // ======================================================================================= S17 · 赛博天文台巨幕 #2：嵌入 Anthropic ICLR 2024 论文实锤（5款主流AI助手）
  const T_ANTH = AT('Anthropic发过一篇论文'), T_RLHF = AT('因为训练时要靠人来打分'), S18 = A('那碰到这种情况');
  shot(S17, S18, {
    day: NIGHT, fog: [48, 160], kicks: [[T_ANTH, .6]],
    keys: [
      K(S17, [CAFE.x, G + 5.2, CAFE.z + 10.2], [CAFE.x, G + 5.6, CAFE.obsZ], 58),
      K(T_RLHF, [CAFE.x - .8, G + 4.8, CAFE.z + 8.8], [CAFE.x, G + 5.6, CAFE.obsZ], 54),
    ],
    lights: () => VX.light(CAFE.x, G + 7, CAFE.obsZ + 3, WARM, 14, 1.35),
    act: t => {
      // 5 款主流 AI 助手排成一排讨好打分牌
      const cast5 = [['deepseek', -6], ['doubao', -3], ['gpt', 0], ['kimi', 3]];
      cast5.forEach(([nm, dx], i) => {
        model(nm, CAFE.x + dx, G + 1 + Math.abs(Math.sin(t * 5 + i)) * .1, 47.5, 'happy', t, { k: .020, tag: false });
      });
      clawd(CAFE.x + 6, G + 1 + Math.abs(Math.sin(t * 5 + 4)) * .1, 47.5, { ...feel('love', t), flip: true }, { k: .016, tag: false });
      riseSparks(t, CAFE.x, G + 2, CAFE.obsZ + 2, 12, 6, [255, 212, 59], 16, 1.0, .06);
    },
    ui: (c, t) => {
      tagUI(c, '学术实锤 · Anthropic 实测 5 款主流 AI 助手 (ICLR 2024)', 1, '#FFD43B');
      worldScreen(c, t, S17 + .2, S18 - .1, {
        key: 'anthropic',
        x: 960, y: 465, w: 1050,
        anchor: [CAFE.x, G + 6.5, CAFE.obsZ],
        badge: 'ICLR 2024',
        title: 'Anthropic 论文：人类偏好打分训出 AI「迎合讨好毛病」',
        boxes: [
          [0.02, 0.44, 0.47, 0.50, T_RLHF],
        ],
      });
    },
  });
  sfx(T_ANTH, 'page', -9); sfx(T_RLHF, 'ding', -10);

  // ======================================================================================= S18 · 巨幕切换 #3：嵌入《哈佛商业评论》事前验尸法（识别风险 +30%）
  const T_HBR = AT('哈佛商业评论'), T_FAIL = AT('先把结果假定成已经失败'), T_30 = AT('识别风险的能力能提高30%'), S19 = A('这个思路放到豆包和DeepSeek上面');
  shot(S18, S19, {
    day: NIGHT, fog: [48, 160], kicks: [[T_30, .75]],
    keys: [
      K(S18, [CAFE.x + 1.2, G + 4.8, CAFE.z + 8.8], [CAFE.x, G + 5.6, CAFE.obsZ], 54),
      K(T_30, [CAFE.x - .6, G + 4.6, CAFE.z + 8.0], [CAFE.x, G + 5.6, CAFE.obsZ], 52),
    ],
    lights: () => VX.light(CAFE.x, G + 7, CAFE.obsZ + 3, AMBER, 14, 1.35),
    act: t => {
      heige(CAFE.x - 5.8, G + 1, 48.2, { ...feel('determined', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '解法：事前验尸' });
      prop(CAFE.x + 5.6, G + 2.8 + Math.sin(t * 4) * .12, 48.2, 'shield', { k: .034 });
      if (t >= T_30) burst(t, T_30, CAFE.x + 5.6, G + 3.0, 48.2, [255, 212, 59], 22);
    },
    ui: (c, t) => {
      tagUI(c, '决策心理学经典 · 哈佛商业评论《事前验尸法》', 1, '#FFD43B');
      worldScreen(c, t, S18 + .2, S19 - .1, {
        key: 'hbr',
        x: 960, y: 455, w: 1040,
        anchor: [CAFE.x, G + 6.5, CAFE.obsZ],
        beamFrom: [CAFE.x - 5.8, G + 2.4, 48.2],
        badge: '哈佛商业评论',
        title: 'Gary Klein · 先假定项目已经彻底失败，再倒推死因',
        boxes: [
          [0.03, 0.46, 0.94, 0.46, T_FAIL],
        ],
      });
      if (t >= T_30) stamp(c, t, T_30, '风险识别力 +30%', 1520, 220, '#FFD43B', S19 - T_30);
    },
  });
  sfx(T_HBR, 'flip', -10); sfx(T_30, 'levelup', -8);

  // ======================================================================================= S19 & S20 · 事前验尸口令实战：咖啡摊秒切倒闭现场，3个赔钱大坑轰然掀开！
  const T_PROMPT3 = AT('先别夸我'), T_3PITS = AT('栽在哪三个大坑里了'), S20 = A('你先把失败定死'), T_LIST = AT('容易亏钱的漏洞一条条列出来'), S21 = A('听到这儿');
  // 地面三个隐患大坑在 T_3PITS 时刻轰然塌陷露出岩浆警示！
  for (const [idx, px] of [[0, 136], [1, 141], [2, 146]]) {
    fillEdit(T_3PITS + idx * .22, px - 1, G, 49, px + 1, G, 51, 'lava');
    fillEdit(S21, px - 1, G, 49, px + 1, G, 51, 'tnWarn');
  }
  shot(S19, S21, {
    day: NIGHT, fog: [44, 150], kicks: [[T_PROMPT3, .65], [T_3PITS, .95]],
    keys: [
      K(S19, [CAFE.x - 2.0, G + 4.4, CAFE.z + 9.4], [CAFE.x, G + 2.6, 47], 56),
      K(T_3PITS, [CAFE.x + .5, G + 5.8, CAFE.z + 9.8], [CAFE.x - .5, G + 1.6, 49.5], 58),
      K(S20, [CAFE.x - 1.5, G + 4.4, CAFE.z + 8.6], [CAFE.x - .5, G + 2.2, 48.5], 54),
    ],
    lights: t => VX.light(CAFE.x, G + 4, 49, t >= T_3PITS ? ALARM : WARM, 12, 1.35),
    act: t => {
      heige(CAFE.x - 6.8, G + 1, 51.2, { ...feel('determined', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '先把失败定死' });
      model('deepseek', CAFE.x + 6.4, G + 1, 50.8, 'thinking', t, { k: .023, flip: true, tag: '收起客套 · 专扒漏洞' });
      model('doubao', CAFE.x + 4.2, G + 1, 51.4, 'determined', t, { k: .022, flip: true, tag: false });
      if (t >= T_3PITS) {
        for (const [idx, px, txt] of [[0, 136, '坑1：租金押三付一'], [1, 141, '坑2：隔壁9块9连锁'], [2, 146, '坑3：周末写字楼空城']]) {
          const tt = T_3PITS + idx * .22;
          if (t >= tt) {
            burst(t, tt, px, G + 1.5, 50, [255, 92, 72], 16);
            prop(px, G + 2.2 + Math.sin(t * 6 + idx) * .12, 50, 'bomb', { k: .030 });
            label(px, G + 3.6, 50, txt, 28, '#FFD43B', t, tt, S21);
          }
        }
      }
    },
    ui: (c, t) => {
      tagUI(c, '野路子口令 #3 · 事前验尸倒推法', 1, '#FFD43B');
      if (t < S20 + .8) {
        promptCard(c, t, T_PROMPT3 - .2, S20 + .6, 3, '审方案防彩虹屁口令', [
          [T_PROMPT3, '“先别夸我！假设按这方案干，三个月后赔得精光”'],
          [T_3PITS - .2, '“帮我倒推一下，我最可能是栽在哪三个大坑里了？”'],
          [AT('一句客套话都别留'), '“一句客套话都别留！”'],
        ], 1010, 106, 850);
      } else if (t >= T_LIST) {
        slam(c, t, T_LIST, '赔钱漏洞 一条条全扒出来！', 210, 82, '#FFD43B', S21 - T_LIST);
      }
    },
  });
  sfx(T_PROMPT3, 'slap', -8); sfx(T_3PITS, 'boom', -7); sfx(T_3PITS + .22, 'crack', -8); sfx(T_3PITS + .44, 'crack', -8);

  // ======================================================================================= S21 & S22 · 拐点读心拦截：追问「你确定吗？」-> 红灯爆闪「千万别这么干！」
  const T_SURE1 = AT('你确定吗'), T_STOP = AT('千万别这么干'), S23 = A('同年DeepMind联合高校团队');
  shot(S21, S23, {
    day: NIGHT, fog: [42, 145], kicks: [[T_STOP, 1.15]],
    keys: [
      K(S21, [ARENA.x - 6, G + 3.8, ARENA.z + 8.5], [ARENA.x - 8, G + 2.6, 78], 54),
      K(T_SURE1, [ARENA.x - 5, G + 3.4, ARENA.z + 6.8], [ARENA.x - 8, G + 2.5, 78], 48),
      K(T_STOP, [ARENA.x - 4, G + 4.2, ARENA.z + 8.2], [ARENA.x - 7, G + 2.8, 78], 56),
    ],
    lights: t => VX.light(ARENA.x - 7, G + 5, 80, t >= T_STOP ? ALARM : ICE, 12, 1.35),
    act: t => {
      ppl(ARENA.x - 9.5, G + 1, 81.5, '老员工', 'angry', t, { tag: '原窗口逼问', tagCol: '#72C9FE' });
      heige(ARENA.x - 4.5, G + 1, 82.0, {
        ...emotions(t, [[0, 'thinking'], [T_STOP - .1, 'scared'], [T_STOP + .2, 'determined']]),
        view: 'front', poseR: t >= T_STOP ? 'wave' : 'chin',
      }, { tag: '黑哥紧急叫停！' });
      model('deepseek', ARENA.x - 7.0, G + 1, 79.8, t >= T_SURE1 ? 'scared' : 'neutral', t, { k: .023, flip: true });
      bubble(ARENA.x - 9.5, G + 3.3, 81.5, '你确定吗？再检查一遍！', t, T_SURE1 - .1, T_STOP - .05);
      if (t >= T_STOP) {
        ringPulse(t, .8, ARENA.x - 7.0, G + 2.4, 80.5, 3.6, [255, 72, 72], 18, .09);
        burst(t, T_STOP, ARENA.x - 4.5, G + 3.0, 82.0, [255, 82, 72], 24);
      }
    },
    ui: (c, t) => {
      tagUI(c, '段位 III 高危误区 · 90% 的人都在踩的连环坑', 1, '#FF5A5A');
      if (t >= T_STOP) slam(c, t, T_STOP, '千万别这么干！！', 235, 106, '#FF5A5A', S23 - T_STOP);
    },
  });
  flash(T_STOP, '#FF3A3A', .45, .28);
  sfx(T_SURE1, 'chat', -10); sfx(T_STOP, 'alarm', -7); sfx(T_STOP + .08, 'hit', -6);
})();
