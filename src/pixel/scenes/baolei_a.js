// scenes/baolei_a.js: 开场刷到老码农吐槽 -> 年初吹牛 vs 线上资损事故 -> 深夜复盘背锅 -> 一屋老开发冷汗 -> 流沙违建危楼 -> 文末三条铁律预告
(() => {
  const N = window.BAOLEI;
  const { B, G, VX, D, K, shot, P, A, AT, PE, sfx, edit, fillEdit, flash,
    heige, clawd, model, ppl, prop, bubble, label, burst, orbitSparks, riseSparks, ringPulse, projArc, sweat, sprayStream, rainCloud,
    seg01, sm, lerp, hh, clamp01, outlined, panel, tagUI, slam, toast, stamp, lossUI, ruleCard,
    HOST, WAR, SITE, AMBER, WARM, ALARM, ICE, DUSK, NIGHT, DAY } = N;

  const em = (t, keys) => emotions(t, keys);
  const bob = (t, f = 8, h = .07) => -Math.abs(Math.sin(t * f)) * h;

  // ======================================================================================= S1 · 刷到老码农视频，暴雷放话
  const S1 = 0, S2 = A('他为什么敢这么说'), BOOM1 = AT('未来很多互联网公司都会暴雷');
  // 大屏亮起警戒红灯框
  for (let x = HOST.x - 5; x <= HOST.x + 5; x++) {
    edit(BOOM1, x, G + 8, HOST.scrZ, 'redlamp');
    edit(S2, x, G + 8, HOST.scrZ, 'obsidian');
  }
  shot(S1, S2, {
    day: DUSK, fog: [55, 165], kicks: [[BOOM1, .75]],
    keys: [
      K(S1, [HOST.x - 3.5, G + 3.4, HOST.z + 9.2], [HOST.x, G + 2.8, HOST.scrZ + 3], 56),
      K(BOOM1 - .2, [HOST.x - 1.5, G + 3.4, HOST.z + 8.0], [HOST.x, G + 2.9, HOST.scrZ + 3], 55),
      K(S2, [HOST.x + 1.2, G + 3.6, HOST.z + 7.2], [HOST.x, G + 3.0, HOST.scrZ + 3], 54),
    ],
    lights: t => {
      VX.light(HOST.x, G + 5, HOST.scrZ + 3, t >= BOOM1 ? ALARM : WARM, 10, 1.2 + .18 * Math.sin(t * 7));
    },
    act: t => {
      const boomed = t >= BOOM1;
      heige(HOST.x - 2.4, G + 1, HOST.z - .8, {
        ...em(t, [[0, 'thinking'], [BOOM1 - .1, 'surprised'], [BOOM1 + .8, 'nervous']]),
        view: 'q', poseR: boomed ? 'point' : 'chin',
      }, { tag: '黑哥', dy: bob(t, 4, .03) });
      // 屏幕中央前方站着放话的老码农 (HOST.scrZ=82 占 [82,83]，故站 z=83.5 不嵌进屏幕)
      ppl(HOST.x + .8, G + 2.1, HOST.scrZ + 1.5, '老码农', boomed ? 'angry' : 'talk', t, {
        k: .032, flip: true, tag: '老码农视频', tagCol: '#FF6A5A', dy: bob(t, boomed ? 12 : 6, boomed ? .06 : .03),
      });
      // 巨幕光粒子与声浪律动
      riseSparks(t, HOST.x, G + 2.2, HOST.scrZ + 1.6, 7.5, 5.2, boomed ? [255, 108, 92] : [114, 201, 254], 12, 1.0, .06);
      ringPulse(t, boomed ? .9 : 1.8, HOST.x + .8, G + 4.0, HOST.scrZ + 1.6, boomed ? 3.2 : 2.1, boomed ? [255, 92, 82] : [255, 212, 59], 14, .06);
      if (boomed) {
        burst(t, BOOM1, HOST.x, G + 6, HOST.scrZ + 1.6, [255, 92, 82], 24);
        orbitSparks(t, HOST.x + .8, G + 5.6, HOST.scrZ + 1.6, 1.1, [255, 92, 82], 5, 3.6, .08);
        bubble(HOST.x + .8, G + 5.2, HOST.scrZ + 1.5, '未来很多公司都会暴雷！', t, BOOM1, S2 - .2);
      }
    },
    ui: (c, t) => {
      tagUI(c, '刷到老码农吐槽', 1, '#FFD34E');
      slam(c, t, BOOM1, '[!] 暴雷预警！', 165, 90, '#FF5A5A', 2.0);
    },
  });
  sfx(0.15, 'pop', -10); sfx(BOOM1, 'hit', -6); sfx(BOOM1 + .12, 'alarm', -11);

  // ======================================================================================= S2 · 年初吹AI降本增效 vs 这周直接出资损事故
  const CRASH2 = AT('结果这周他们线上'), S3 = A('当天连夜开了复盘会');
  edit(CRASH2, 83, G + 3, 47, 'redlamp'); edit(CRASH2, 84, G + 3, 47, 'lava');
  edit(S3, 83, G + 3, 47, 'monitor'); edit(S3, 84, G + 3, 47, 'steelSoft');
  shot(S2, S3, {
    day: t => t < CRASH2 ? DAY : NIGHT, fog: [45, 130], kicks: [[CRASH2, .9]],
    keys: [
      K(S2, [WAR.x, G + 4.4, WAR.z + 10.5], [WAR.x, G + 2.6, 46], 62),
      K(CRASH2 - .1, [WAR.x + 1.5, G + 4.2, WAR.z + 8.0], [WAR.x + 1, G + 2.8, 45], 56),
      K(S3, [WAR.x + 5.5, G + 4.8, WAR.z + 7.0], [WAR.x + 6, G + 2.5, 47], 52),
    ],
    lights: t => {
      VX.light(WAR.x, G + 5, 46, t < CRASH2 ? WARM : ALARM, 11, t < CRASH2 ? 1.25 : 1.1 + .35 * Math.sin(t * 14));
    },
    act: t => {
      const crash = t >= CRASH2;
      ppl(WAR.x, G + 1, 49, '老板', crash ? 'shock' : 'happy', t, { tag: '老板', tagCol: crash ? '#FF6A5A' : '#FFD34E', dy: bob(t, crash ? 10 : 9, crash ? .04 : .08) });
      const sw = crash ? Math.sin(t * 5.2) * .7 : 0;
      ppl(WAR.x - 4 + sw, G + 1, 51, '开发', crash ? 'panic' : 'type', t, { walk: crash, shake: crash, flip: crash && Math.cos(t * 5.2) < 0, tag: false });
      ppl(WAR.x + 4 - sw, G + 1, 51, '开发', crash ? 'panic' : 'type', t, { walk: crash, shake: crash, flip: !crash || Math.cos(t * 5.2) > 0, tag: false });
      prop(WAR.x - 1.5, G + 2, 52.3, 'coffee', { k: .018 });
      if (!crash) {
        for (let i = 0; i < 6; i++) prop(WAR.x - 4 + i * 1.6, G + 4.2 - ((t * 1.6 + i * .3) % 2.2), 48, 'coin');
        riseSparks(t, WAR.x, G + 2, 48, 8, 3.2, [255, 212, 59], 10, 1.0, .06);
        label(WAR.x, G + 5.4, 43.2, 'AI 降本增效 +50%', 44, '#FFD34E', t, S2, CRASH2);
      } else {
        burst(t, CRASH2, 83, G + 3.8, 47, [255, 86, 70], 26);
        riseSparks(t, 83.2, G + 3.4, 47, 1.8, 4.2, [255, 96, 70], 14, 1.5, .09);
        ringPulse(t, 1.1, 83.2, G + 3.6, 47, 3.6, [255, 72, 64], 16, .08);
        sweat(t, WAR.x - 4 + sw, G + 2.8, 51); sweat(t + .3, WAR.x + 4 - sw, G + 2.8, 51);
        prop(83, G + 4.5 + Math.sin(t * 9) * .12, 47, 'bomb', { k: .028 });
        label(WAR.x, G + 5.4, 43.2, '[×] 线上严重资损！', 46, '#FF5A5A', t, CRASH2, S3);
      }
    },
    ui: (c, t) => {
      if (t < CRASH2) toast(c, t, S2 + .2, '年初大会：全面降本增效', 180, '#FFD34E', CRASH2 - S2);
      else lossUI(c, t, CRASH2, S3, 500000);
    },
  });
  flash(CRASH2, '#FF3A3A', .45, .3);
  sfx(S2 + .2, 'coin', -10); sfx(CRASH2, 'boom', -5); sfx(CRASH2 + .18, 'sizzle', -9);

  // ======================================================================================= S3 · 连夜复盘会：拍桌子追问 vs 汗如雨下支支吾吾
  const SLAM_T = AT('拍着桌子追问'), SWEAT_T = AT('坐在椅子上汗如雨下'), S4 = A('最后这口锅');
  shot(S3, S4, {
    day: NIGHT, fog: [40, 125], kicks: [[SLAM_T, .7]],
    keys: [
      K(S3, [WAR.x + 4, G + 4.6, WAR.z + 9], [WAR.x - 1, G + 2.2, 52], 58),
      K(SLAM_T, [WAR.x + 1, G + 4.0, WAR.z + 7.5], [WAR.x, G + 2.5, 50], 54),
      K(SWEAT_T, [WAR.x - 1.5, G + 3.6, WAR.z + 8.5], [WAR.x - 5.5, G + 2.3, 55.5], 50),
      K(S4, [WAR.x - 2.5, G + 3.4, WAR.z + 8.0], [WAR.x - 5.5, G + 2.3, 55.5], 48),
    ],
    lights: t => {
      VX.light(WAR.x, G + 5, 50, ALARM, 9, 1.15 + .22 * Math.sin(t * 10));
      VX.light(WAR.x - 6, G + 4, 55, ICE, 6, .95);
    },
    act: t => {
      const slamCycle = ((t - SLAM_T) % 2.1);
      const slapY = t >= SLAM_T && slamCycle < .38 ? Math.abs(Math.sin(slamCycle * 16)) * .22 : 0;
      ppl(WAR.x, G + 1 + slapY, 50.2, '老板', t >= SLAM_T ? 'point' : 'angry', t, { tag: '领导', tagCol: '#FF6A5A' });
      const devMood = t >= SWEAT_T ? 'panic' : 'shock';
      ppl(WAR.x - 6, G + 1, 56, '背锅侠', devMood, t, { flip: true, shake: t >= SWEAT_T, tag: '写代码的哥们', tagCol: '#72C9FE' });
      prop(WAR.x - 2.5, G + 2.0, 52.3, 'coffee', { k: .020 });
      if (t >= SLAM_T) ringPulse(t, 1.4, WAR.x, G + 2.2, 52.2, 2.8, [255, 92, 82], 14, .07);
      if (t >= SWEAT_T) {
        sweat(t, WAR.x - 6, G + 2.9, 56);
        orbitSparks(t, WAR.x - 6, G + 3.25, 56, .58, [114, 201, 254], 4, 4.0, .06);
      }
      bubble(WAR.x, G + 3.2, 50.2, '这逻辑怎么漏成这样?!', t, SLAM_T, SWEAT_T + .6);
      bubble(WAR.x - 6, G + 3.2, 56, '呃…那…当初怎么写的…', t, SWEAT_T + .4, S4);
    },
    ui: (c, t) => {
      tagUI(c, '凌晨 02:30 · 复盘会', 1, '#FF7B73');
      if (t >= SLAM_T) slam(c, t, SLAM_T, '怎么能漏成这样？', 210, 82, '#FF5A5A', 1.7);
    },
  });
  sfx(SLAM_T, 'slap', -6); sfx(SWEAT_T + .2, 'sad', -11);

  // ======================================================================================= S4 · 黑锅结实扣头上，年底绩效没戏
  const POT_AT = AT('结结实实扣在他头上'), S5 = A('可最让人后背发凉的');
  shot(S4, S5, {
    day: NIGHT, fog: [36, 115], kicks: [[POT_AT, .8]],
    keys: [
      K(S4, [WAR.x - 2.0, G + 3.9, WAR.z + 9.4], [WAR.x - 4.8, G + 2.5, 55.5], 50),
      K(POT_AT, [WAR.x - 3.0, G + 3.6, WAR.z + 8.5], [WAR.x - 5.2, G + 2.5, 55.5], 49),
      K(S5, [WAR.x - 4.2, G + 3.5, WAR.z + 7.8], [WAR.x - 5.6, G + 2.4, 55.8], 48),
    ],
    act: t => {
      const k = sm(seg01(t, POT_AT - .2, POT_AT + .08));
      const potY = lerp(G + 5.2, G + 2.85, k);
      const squ = t >= POT_AT && t < POT_AT + .25 ? -.18 * Math.exp(-(t - POT_AT) * 14) : 0;
      ppl(WAR.x - 6, G + 1 + squ, 56, '背锅侠', t >= POT_AT ? 'dizzy' : 'panic', t, { flip: true, shake: t >= POT_AT, tag: false });
      prop(WAR.x - 6, potY, 56, 'pot', { k: .032 });
      if (t >= POT_AT) {
        burst(t, POT_AT, WAR.x - 6, G + 2.9, 56, [255, 212, 59], 16);
        orbitSparks(t, WAR.x - 6, G + 3.45, 56, .66, [255, 212, 59], 5, 4.4, .07);
        rainCloud(t, WAR.x - 6, G + 4.1, 56, 1.15);
      }
    },
    ui: (c, t) => {
      stamp(c, t, POT_AT, '绩效：D  待定', 1420, 300, '#FF5A5A', S5 - POT_AT);
    },
  });
  flash(POT_AT, '#FFD34E', .35, .25);
  sfx(POT_AT, 'anvil', -6); sfx(POT_AT + .25, 'thud', -8);

  // ======================================================================================= S5 · 后背发凉：一屋子老开发僵住，全用 AI 堆出来的
  const AI_REVEAL = AT('早他妈全是用AI堆出来的'), S6 = A('好多老板以为上了AI');
  shot(S5, S6, {
    day: NIGHT, fog: [40, 120],
    keys: [
      K(S5, [WAR.x - 2, G + 3.6, WAR.z + 9.2], [WAR.x - 1, G + 2.0, 56], 54),
      K(AI_REVEAL, [WAR.x + 2, G + 4.2, WAR.z + 10.5], [WAR.x, G + 2.2, 55.5], 58),
      K(S6, [WAR.x + 5, G + 4.4, WAR.z + 9.5], [WAR.x + 2, G + 2.2, 55], 56),
    ],
    lights: t => {
      VX.light(WAR.x, G + 4, 56, ICE, 11, 1.15 + .15 * Math.sin(t * 5));
    },
    act: t => {
      const xs = [68, 71, 74, 77, 80];
      const tags = ['Claude', 'DeepSeek', 'AI 生成', 'Claude', 'AI 堆砌'];
      riseSparks(t, WAR.x, G + 1.4, 56, 14, 3.8, [130, 195, 255], 16, .85, .06);
      xs.forEach((dx, i) => {
        const isFirst = i === 0;
        const shiv = Math.sin(t * 9 + i * 1.4) * .04;
        ppl(dx, G + 1, 56, isFirst ? '背锅侠' : '开发', 'sweat', t, {
          flip: i < 2, shake: t >= AI_REVEAL, dy: shiv,
          tag: t >= AI_REVEAL ? tags[i] : false,
          tagCol: i % 2 ? '#9DB4FF' : '#FFA882',
        });
        sweat(t + i * .23, dx, G + 2.8, 56);
      });
      if (t >= AI_REVEAL) {
        const hover = Math.sin(t * 4.2) * .16;
        clawd(71, G + 2.2 + hover, 55.2, { ...feel('happy', t), flip: true }, { k: .012, noShadow: true, tag: false });
        model('deepseek', 77, G + 2.2 - hover, 55.2, 'happy', t, { k: .015, noShadow: true, tag: false });
        const ph = (t * 1.2) % 1;
        projArc(ph, 0, 1, 71, G + 2.6, 55.2, 68 + ((Math.floor(t * 1.2) % 3) * 3), G + 2.2, 56, .7, [255, 168, 130], .08);
        projArc(ph, 0, 1, 77, G + 2.6, 55.2, 74 + ((Math.floor(t * 1.2) % 2) * 6), G + 2.2, 56, .7, [157, 180, 255], .08);
      }
    },
    ui: (c, t) => {
      // 寒意冷色渐变（无绿色，纯粹深蓝紫夜色）
      const k = sm(seg01(t, S5, AI_REVEAL));
      c.save(); c.fillStyle = `rgba(38,48,96,${.18 * k})`; c.fillRect(0, 0, 1920, 1080); c.restore();
      if (t >= AI_REVEAL) slam(c, t, AI_REVEAL, '全员 AI 堆代码！', 220, 90, '#FFD34E', 2.2);
    },
  });
  sfx(S5 + .2, 'chime', -12); sfx(AI_REVEAL, 'zap', -7);

  // ======================================================================================= S6 · 老板以为基建狂魔 -> 转场工地：流沙上蒙眼盖违建危楼！
  const TURN6 = AT('其实呢'), SHAKE6 = AT('狂盖违建危楼'), S7 = A('文末送你三条');
  // 危楼方块在工地上胡乱叠起
  for (let i = 0; i < 6; i++) {
    const tt = lerp(TURN6 + .1, S7 - .6, i / 6);
    const tx = [104, 110, 116][i % 3], by = G + 3 + Math.floor(i / 2);
    fillEdit(tt, tx - 1, by, 42, tx + 1, by, 45, i % 2 ? 'worange' : 'crimsonSoft');
    edit(tt, tx + (i % 2 ? 1 : -1), by, 42, 'tnt');
  }
  shot(S6, S7, {
    day: t => t < TURN6 ? DAY : DUSK, fog: [55, 160], kicks: [[TURN6, .5], [SHAKE6, .7]],
    keys: [
      K(S6, [WAR.x + 2, G + 4.0, WAR.z + 6.0], [WAR.x + 3, G + 2.4, 51], 54),
      K(TURN6, [102, G + 7.5, 62], [110, G + 4.5, 44], 60),
      K(SHAKE6, [112, G + 8.5, 58], [110, G + 5.0, 44], 56),
      K(S7, [115, G + 7.0, 56], [110, G + 4.5, 44], 54),
    ],
    act: t => {
      if (t < TURN6 + .3) {
        ppl(WAR.x + 3, G + 1, 51, '老板', 'happy', t, { tag: '老板幻想：基建狂魔', tagCol: '#FFD34E', dy: bob(t, 8, .06) });
        prop(WAR.x + 3, G + 2.9 + Math.sin(t * 7) * .12, 51, 'pie', { k: .028 });
        riseSparks(t, WAR.x + 3, G + 1.5, 51, 2.4, 2.6, [255, 212, 59], 8, 1.0, .06);
      }
      // 蒙眼盲人走动砌危楼 + 流沙飞尘
      riseSparks(t, 110, G + 1.2, 44, 14, 3.2, [226, 192, 138], 14, .9, .07);
      prop(116 + Math.sin(t * 2.4) * .35, G + 6.7, 41.2, 'doc', { k: .024 });
      for (let i = 0; i < 3; i++) {
        const bx = [104, 110, 116][i], sway = Math.sin(t * 3.4 + i * 2) * .65;
        ppl(bx + sway, G + 1, 47.5, '开发', 'panic', t, { walk: true, blind: true, flip: Math.cos(t * 3.4 + i * 2) < 0, tag: i === 1 ? '蒙眼盖危楼' : false, tagCol: '#FF6A5A' });
        if (t >= TURN6) {
          sprayStream(t + i * .3, bx + sway, G + 2.0, 47.5, bx, G + 5.5, 44, [224, 192, 138]);
          projArc((t * 1.4 + i * .33) % 1, 0, 1, bx + sway, G + 2.2, 47.5, bx, G + 6.0, 44, 1.2, [255, 160, 96], .08);
        }
      }
    },
    ui: (c, t) => {
      if (t < TURN6) toast(c, t, S6 + .1, '老板以为：AI 基建狂魔', 180, '#FFD34E', TURN6 - S6);
      else slam(c, t, TURN6 + .25, '流沙上蒙眼盖危楼！', 220, 88, '#FF5A5A', 2.4);
    },
  });
  sfx(TURN6, 'whoosh', -8); sfx(SHAKE6, 'crack', -7);

  // ======================================================================================= S7 · 文末送你三条用 AI 交活的保命铁律
  const S8 = A('看看他们公司');
  shot(S7, S8, {
    day: DUSK, fog: [50, 150],
    keys: [
      K(S7, [HOST.x + 1.0, G + 2.8, HOST.z + 7.4], [HOST.x + 1.4, G + 2.1, HOST.z - .5], 56),
      K(S8, [HOST.x + 2.4, G + 3.1, HOST.z + 6.5], [HOST.x + 1.6, G + 2.1, HOST.z - .5], 54),
    ],
    lights: () => VX.light(HOST.x, G + 4, HOST.z + 2, WARM, 8, 1.15),
    act: t => {
      heige(HOST.x - 1.2, G + 1, HOST.z - .5, { ...feel('proud', onTwos(t)), view: 'q', poseR: 'point' }, { tag: '黑哥' });
      clawd(HOST.x + .8, G + 1, HOST.z - .2, { ...feel('happy', t), flip: true }, { dy: Math.abs(Math.sin(t * 4.5)) * .16 });
      prop(HOST.x - .2, G + 2.6 + Math.sin(t * 4) * .12, HOST.z - .3, 'shield', { k: .024 });
      riseSparks(t, HOST.x - .2, G + 1.5, HOST.z - .2, 3.6, 3.2, [255, 212, 59], 12, 1.0, .06);
      orbitSparks(t, HOST.x - .2, G + 2.7, HOST.z - .3, .9, [255, 212, 59], 4, 2.8, .06);
    },
    ui: (c, t) => {
      ruleCard(c, t, S7, S8, '先看', '文末三条保命铁律', [
        [S7 + .1, '1 · 亲手定死承重墙'],
        [S7 + .45, '2 · 关掉 AI 脱稿讲清楚'],
        [S7 + .8, '3 · 独立死规矩物理隔离'],
      ], 1100, 120, 760);
    },
  });
  sfx(S7 + .1, 'powerup', -10);
})();
