// scenes/baolei_d.js: Act III & IV — 新项目AI传话套娃两个月失控(门朝天) -> 三个扎心的谁 -> 运营/财务/策划同样跑不掉
(() => {
  const N = window.BAOLEI;
  const { B, G, VX, K, shot, P, A, AT, sfx, edit, fillEdit, flash,
    heige, clawd, model, ppl, prop, bubble, label, burst, sweat, sprayStream,
    seg01, sm, lerp, hh, clamp01, fadeIO, outlined, panel, tagUI, slam, toast, stamp, ratioBar,
    RELAY, OFFICE, WAR, IRON, AMBER, WARM, ALARM, ICE, DUSK, NIGHT, DAY } = N;

  const bob = (t, f = 8, h = .07) => -Math.abs(Math.sin(t * f)) * h;

  // ======================================================================================= D1 · AI 接力套娃：点子/图纸/水泥/验收全 AI，两个月后大门朝哪开都没人知道
  const T_IDEA = AT('直接丢给AI'), T_GRP = AT('往群里一拍'), T_DEV = AT('底下开发拿到任务单'),
    T_BOSS = AT('领导拿到手'), T_ALLAI = AT('点子是AI拆的'), T_MON2 = AT('跑了整整两个月'), D2 = A('老哥在视频最后');

  // 歪斜迷之塔（没有门、顶歪一截）逐步长出来 (x=72..76, z=72..76)
  for (let i = 0; i < 8; i++) {
    const tt = lerp(T_DEV, T_MON2, i / 8);
    const dx = i >= 5 ? 2 : i >= 3 ? -1 : 0;
    const by = G + 2 + i;
    fillEdit(tt, 73 + dx, by, 73, 75 + dx, by, 75, i % 3 === 0 ? 'crimsonSoft' : i % 2 ? 'worange' : 'wpurple');
    if (i === 7) edit(tt, 74 + dx, by + 1, 73, 'goldblk'); // 朝天的门牌
  }
  const drawD1Act = (t, m2) => {
    ppl(65.6, G + 1, 82, '老板', m2 ? 'shock' : 'happy', t, { tag: '领导 (只丢点子)', tagCol: '#FFD34E' });
    clawd(68.2, G + 2, 82, { ...feel('happy', t) }, { k: .015 });
    model('deepseek', 68.2, G + 2, 80.2, 'happy', t, { k: .017 });
    ppl(82.0, G + 1, 82, '开发', m2 ? 'dizzy' : 'closed', t, { flip: true, tag: '开发 (原封转发)', tagCol: '#72C9FE' });
    model('doubao', 79.4, G + 2, 82, 'happy', t, { k: .018 });
    const ph = ((t * 1.4) % 2);
    const bx = ph < 1 ? lerp(69.2, 78.4, ph) : lerp(78.4, 69.2, ph - 1);
    prop(bx, G + 2.5 + Math.sin(t * 8) * .15, 82, 'doc', { k: .028 });
    if (t >= T_ALLAI && !m2) sprayStream(t, 74, G + 2.5, 81.5, 74, G + 6.5, 74.5, [118, 198, 255]);
    if (m2) {
      label(74, G + 11.4, 74, '[!] 大门朝哪儿开?!', 38, '#FF5A5A', t, T_MON2, D2);
      prop(74, G + 9.4, 73.2, 'bomb', { k: .052 });
    }
  };
  const d1Lights = t => {
    VX.light(67, G + 4, 82, AMBER, 8, 1.15);
    VX.light(81, G + 4, 82, ICE, 8, 1.15);
    VX.light(74, G + 7, 74, t >= T_MON2 ? ALARM : WARM, 10, 1.25);
  };
  shot(A('你以为这就够魔幻了'), T_BOSS, {
    day: DUSK, fog: [55, 165],
    keys: [
      K(A('你以为这就够魔幻了'), [71, G + 4.6, 95], [73, G + 2.6, 82], 64),
      K(T_GRP, [74, G + 4.8, 95], [74, G + 2.8, 82], 64),
      K(T_BOSS, [77, G + 4.6, 95], [75, G + 2.6, 82], 64),
    ],
    lights: d1Lights,
    act: t => drawD1Act(t, false),
    ui: (c, t) => {
      tagUI(c, '新项目 · AI 传话套娃', 1, '#FFD34E');
      if (t >= T_GRP) toast(c, t, T_GRP, '群聊拍单：按排期抓紧上线！', 180, '#FFD34E', T_BOSS - T_GRP);
    },
  });
  shot(T_BOSS, D2, {
    day: DUSK, fog: [55, 165], kicks: [[T_MON2, .65]],
    keys: [
      K(T_BOSS, [74, G + 6.0, 91], [74, G + 4.2, 77], 58),
      K(T_ALLAI, [74, G + 7.8, 92], [74, G + 5.6, 75], 60),
      K(T_MON2, [77, G + 7.6, 88], [74, G + 6.0, 75], 56),
    ],
    lights: d1Lights,
    act: t => drawD1Act(t, t >= T_MON2),
    ui: (c, t) => {
      tagUI(c, '新项目 · 失控迷之高楼', 1, '#FF7B73');
      if (t >= T_ALLAI && t < T_MON2) slam(c, t, T_ALLAI, 'AI → AI → AI 闭环空转！', 210, 76, '#72C9FE', 2.4);
      if (t >= T_MON2) stamp(c, t, T_MON2, '两个月 · 彻底失控', 1480, 290, '#FF5A5A', D2 - T_MON2);
    },
  });
  sfx(T_GRP, 'toast', -9); sfx(T_DEV, 'pop', -10); sfx(T_BOSS, 'type_burst', -10);
  sfx(T_ALLAI, 'glitch', -8); sfx(T_MON2, 'alarm', -7);

  // ======================================================================================= D2 · 未来出事只是时间问题 -> 剥开乱麻：三个扎心的“谁”
  const WHO_SPLIT = AT('把这团乱麻剥开'), D3 = A('第一谁把看图纸');
  shot(D2, D3, {
    day: NIGHT, fog: [45, 130], kicks: [[WHO_SPLIT, .75]],
    keys: [
      K(D2, [75, G + 8.6, 86], [74, G + 7.8, 74], 54),
      K(WHO_SPLIT - .3, [76, G + 8.8, 84], [74, G + 8.2, 74], 52),
      K(WHO_SPLIT, [104, G + 7.5, 80], [104, G + 2.8, 67], 60),
      K(D3, [98, G + 6.0, 76], [97, G + 2.6, 66], 54),
    ],
    lights: t => {
      VX.light(74, G + 9.5, 74, ALARM, 9, 1.35);
      VX.light(104, G + 4.5, 70, WARM, 10, 1.2);
    },
    act: t => {
      if (t < WHO_SPLIT) {
        prop(74, G + 9.5, 73.2, 'bomb', { k: .062 });
        label(74, G + 11.4, 73.2, '出事只是时间问题…', 36, '#FF5A5A', t, D2, WHO_SPLIT);
      } else {
        heige(104, G + 1, 70, { ...feel('determined', onTwos(t)), view: 'front' }, { tag: '黑哥拆解' });
        label(99, G + 3.8, 67, '1 · 谁砍时间?', 34, '#FFD34E', t, WHO_SPLIT, D3);
        label(104, G + 4.6, 67, '2 · 谁逼违建?', 34, '#FF7B73', t, WHO_SPLIT + .2, D3);
        label(109, G + 3.8, 67, '3 · 谁签字背锅?', 34, '#72C9FE', t, WHO_SPLIT + .4, D3);
      }
    },
    ui: (c, t) => {
      if (t >= WHO_SPLIT) slam(c, t, WHO_SPLIT, '三个扎心的「谁」', 210, 96, '#FFD34E', 2.4);
    },
  });
  flash(WHO_SPLIT, '#FFD43B', .4, .28);
  sfx(D2 + .2, 'tick', -9); sfx(WHO_SPLIT, 'hit', -6);

  // ======================================================================================= D3 · 第一：谁把看图纸的时间砍没了？
  const CUT_TIME = AT('把活人站在旁边'), D4 = A('第二谁在逼着全员');
  shot(D3, D4, {
    day: DUSK, fog: [50, 150], kicks: [[CUT_TIME, .65]],
    keys: [
      K(D3, [96, G + 5.5, 76], [98, G + 2.4, 67], 56),
      K(CUT_TIME, [100, G + 4.8, 74], [98, G + 2.4, 67], 50),
    ],
    act: t => {
      ppl(96, G + 1, 67, '老板', 'point', t, { tag: '减员增效', tagCol: '#FF6A5A' });
      ppl(100, G + 1, 67, '开发', 'panic', t, { flip: true, shake: true, tag: '1 人扛 3 人活', tagCol: '#FFD34E' });
      prop(100, G + 3.0, 67, 'doc'); prop(99.2, G + 3.4, 67, 'doc'); prop(100.8, G + 3.4, 67, 'doc');
    },
    ui: (c, t) => {
      tagUI(c, '第一问 · 谁砍没了时间', 1, '#FFD34E');
      const k = t >= CUT_TIME ? 0 : 1 - sm(seg01(t, D3, CUT_TIME));
      ratioBar(c, t, D3, D4, '排查隐患 · 站在旁边看图纸的时间', Math.max(.02, k),
        t >= CUT_TIME ? '0 分钟 (已砍光!)' : '安全排查时间', '上线硬指标', 80, 125);
    },
  });
  sfx(CUT_TIME, 'break_wood', -7);

  // ======================================================================================= D4 · 第二：谁在逼着全员狂盖违建？(考核死循环)
  const LOOP_T = AT('你越较真一行行核对'), D5 = A('第三真塌楼赔钱那天');
  shot(D4, D5, {
    day: DUSK, fog: [50, 150], kicks: [[LOOP_T, .5]],
    keys: [
      K(D4, [104, G + 5.5, 77], [104, G + 2.5, 67], 58),
      K(LOOP_T, [105, G + 4.8, 74], [104, G + 2.5, 67], 52),
    ],
    act: t => {
      // 左开发较真核对 -> 老板给差评 [×]；右开发蒙眼狂喷 -> 老板给赞
      ppl(99.5, G + 1, 67, '开发', 'sweat', t, { tag: '较真核对代码', tagCol: '#72C9FE' });
      ppl(108.5, G + 1, 67, '开发', 'happy', t, { blind: true, tag: '闭眼狂糊上线', tagCol: '#FFD34E', dy: bob(t, 12, .08) });
      ppl(104, G + 1, 65.5, '老板', 'happy', t, { tag: 'KPI 考核', tagCol: '#FF6A5A' });
      if (t >= LOOP_T) {
        label(99.5, G + 3.6, 67, '[×] 太慢 扣绩效!', 32, '#FF5A5A', t, LOOP_T, D5);
        label(108.5, G + 3.6, 67, '[赞] 战斗力强!', 34, '#FFD34E', t, LOOP_T + .4, D5);
      }
    },
    ui: (c, t) => {
      tagUI(c, '第二问 · 谁在逼盖违建', 1, '#FF7B73');
      toast(c, t, D4 + .2, '考核只看：上线快不快 · 接单多不多', 155, '#FFD34E', D5 - D4);
    },
  });
  sfx(LOOP_T, 'slap', -9); sfx(LOOP_T + .5, 'coin', -9);

  // ======================================================================================= D5 · 第三：真塌楼赔钱，谁去会议室签字背锅？(Claude/DeepSeek都不认)
  const LOSS_SIGN = AT('可真出了资损'), AI_DENY = AT('这段代码是Claude还是DeepSeek写的'), D6 = A('别觉得你不写代码');
  shot(D5, D6, {
    day: NIGHT, fog: [50, 145], kicks: [[LOSS_SIGN, .7], [AI_DENY, .5]],
    keys: [
      K(D5, [144, G + 5.6, 86], [144, G + 2.8, 80], 56),
      K(LOSS_SIGN, [75, G + 5.0, 64], [75, G + 2.4, 53], 54),
      K(AI_DENY, [75, G + 4.4, 62.5], [75.5, G + 2.4, 53], 50),
    ],
    lights: t => {
      if (t < LOSS_SIGN) {
        VX.light(142, G + 4, 83, WARM, 9, 1.2);
      } else {
        VX.light(72, G + 4.5, 57, WARM, 10, 1.25);
        VX.light(78, G + 4.5, 56, ICE, 9, 1.15);
      }
    },
    act: t => {
      if (t < LOSS_SIGN) {
        // 省下的人头费飞进公司金库
        for (let i = 0; i < 6; i++) prop(141 + ((t * 2 + i * .4) % 3), G + 2.2 + Math.sin(t * 5 + i) * .3, 79, 'coin');
        ppl(142, G + 1, 82, '老板', 'happy', t, { tag: '漂亮战报 +账本', tagCol: '#FFD34E' });
      } else {
        ppl(74, G + 1, 50.2, '老板', 'angry', t, { tag: '老板：只看提交记录', tagCol: '#FF5A5A' });
        ppl(71, G + 1, 56, '背锅侠', 'panic', t, { flip: true, shake: true, tag: '签字背锅', tagCol: '#72C9FE' });
        prop(71, G + 3.0, 56, 'pot', { k: .028 });
        if (t >= AI_DENY) {
          clawd(76.2, G + 2, 53.0, { ...feel('confused', t) }, { k: .016, noShadow: true, tag: 'Claude (不认)' });
          model('deepseek', 79.0, G + 2, 53.0, 'confused', t, { k: .020, noShadow: true, tag: 'DeepSeek (不认)' });
          label(77.6, G + 4.4, 53.0, '[×] 老板根本不认!', 36, '#FF5A5A', t, AI_DENY, D6);
        }
      }
    },
    ui: (c, t) => {
      tagUI(c, '第三问 · 谁去会议室签字', 1, '#72C9FE');
      if (t >= LOSS_SIGN) stamp(c, t, LOSS_SIGN, '按提交人追责！', 1420, 290, '#FF5A5A', D6 - LOSS_SIGN);
    },
  });
  sfx(D5 + .2, 'coin', -9); sfx(LOSS_SIGN, 'anvil', -6); sfx(AI_DENY, 'hit', -8);

  // ======================================================================================= D6 · 运营 / 财务 / 策划也跑不掉（豆包 + DeepSeek 出表直发客户群 -> 赔钱签字）
  const MISS_PAGE = AT('哪天漏算一页成本赔了钱'), E1 = A('先别把AI一棍子打死');
  shot(D6, E1, {
    day: t => t >= MISS_PAGE ? NIGHT : DAY, fog: [52, 160], kicks: [[MISS_PAGE, .85]],
    keys: [
      K(D6, [128, G + 5.0, 94], [134, G + 2.4, 86.5], 54),
      K(AT('丢给豆包或者DeepSeek'), [135, G + 4.6, 93], [136, G + 2.4, 86.5], 52),
      K(MISS_PAGE, [141, G + 4.6, 92], [138, G + 2.4, 86.5], 50),
    ],
    act: t => {
      const boom = t >= MISS_PAGE;
      ppl(127, G + 1, 88.2, '运营', boom ? 'shock' : 'happy', t, { tag: '做运营', tagCol: '#E890A8' });
      ppl(135, G + 1, 88.2, '财务', boom ? 'panic' : 'neutral', t, { shake: boom, tag: '做财务', tagCol: '#9DB4FF' });
      ppl(143, G + 1, 88.2, '策划', boom ? 'shock' : 'happy', t, { tag: '做策划', tagCol: '#FFD34E' });
      model('doubao', 131, G + 1, 87.2, 'happy', t, { k: .020, tag: '豆包' });
      model('deepseek', 139, G + 1, 87.2, 'happy', t, { k: .020, tag: 'DeepSeek' });
      // 报价单直接飞出
      prop(135, G + 2.6 + Math.sin(t * 6) * .2, 86.2, 'doc', { k: .03 });
      if (boom) {
        burst(t, MISS_PAGE, 135, G + 3.0, 86.5, [255, 86, 72], 22);
        sweat(t, 135, G + 2.9, 88.2);
        prop(135, G + 2.9, 88.2, 'pot', { k: .028 });
      }
    },
    ui: (c, t) => {
      tagUI(c, '全行业通用 · 谁经手谁担责', 1, '#FFD34E');
      if (t < MISS_PAGE) toast(c, t, D6 + .6, '报价单 / 核算表 → 扫都没扫直接发客户群！', 165, '#FFD34E', MISS_PAGE - D6);
      if (t >= MISS_PAGE) slam(c, t, MISS_PAGE, '漏算一页 · 擦汗签字的还是你！', 220, 74, '#FF5A5A', 2.4);
    },
  });
  flash(MISS_PAGE, '#FF3A3A', .42, .28);
  sfx(D6 + .6, 'pop', -9); sfx(MISS_PAGE, 'hit', -6); sfx(MISS_PAGE + .15, 'crack', -8);
})();
