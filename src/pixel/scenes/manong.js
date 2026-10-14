// pixel/scenes/manong.js: 「码农这行，纯粹是邪门」, a 16:9 explainer: 黑哥 tells it on the night hill, a panel on
// the right shows what he's talking about, subtitles run along the bottom. The timing comes from the voice
// (manong_data.js, by tools/video/align.py); the acting and props from manong_dir.js.
//   node render.mjs --page=pixel.html --loop=pxManong --clip --fps=24 --out=out/video/manong/picture.mp4
(() => {
  if (!window.MANONG || !window.MANONG_DIR) return;
  const N = window.pxNight, D = MANONG, M = D.marks;
  const HX = 84, PX0 = 166, PY0 = 26, PW0 = 144, PH0 = 100, PCX = PX0 + PW0 / 2, PCY = PY0 + PH0 / 2;
  const at = ph => M[ph] ?? (M[ph + '#1']);
  // the direction, resolved to times
  const cues = MANONG_DIR.map(([ph, o]) => ({ t: at(ph), ...o })).filter(c => c.t != null).sort((a, b) => a.t - b.t);
  const keys = [[0, 'neutral']];
  for (const c of cues) if (c.emo) keys.push([c.t - .05, c.emo, c.over]);
  const props = cues.filter(c => c.prop).map(c => ({ t: c.t - .1, name: c.prop, args: c.args || {} }));
  const shakes = cues.filter(c => c.shake).map(c => [c.t, c.shake]);
  const T0 = (D.sents[0] || [0])[0];
  const WALK = [0, Math.max(1.6, T0 + 2.2)], TURN = [WALK[1], WALK[1] + .28];

  // ---------- props ----------
  const pops = (t, k) => k < 1 ? 0 : 1;
  const iconC = (name, cx, cy, s = 2, tint) => pxIcon(name, Math.round(cx - 6 * s), Math.round(cy - 6 * s), s, tint);
  const bob = (lt, f = 2, a = 1) => Math.round(Math.sin(lt * TAU * f / 2) * a);
  const P = {
    none() {},
    friend(lt) {
      iconC('server', PCX - 22, PCY - 8, 3);
      pxText('码农朋友', PCX + 26, PCY - 18, { size: 13 });
      pxText('入行 10 年', PCX + 26, PCY + 2, { size: 10, color: '#9BE3F7' });
    },
    word(lt, a) {
      const sh = a.shake ? Math.round(Math.sin(lt * 60) * 1) : 0;
      pxText(a.text, PCX + sh, PCY, { size: a.size || 24, color: a.color });
    },
    dims(lt, a, t) {
      const xs = [PX0 + 26, PCX, PX0 + PW0 - 26], y = PCY - 6;
      const names = ['bolt', 'book', 'shield'], labels = ['工作强度', '持续学习', '稳定程度'];
      const shown = [at('工作强度#1'), at('持续学习#1'), at('稳定程度#1')].map(m => t >= m - .05);
      const tri = t >= at('不可能三角') - .05, two = t >= at('能占两样') - .05 && !tri;
      const red = [at('工作强度极大'), at('天天拼命学'), at('极其不稳定')].map(m => t >= m - .05);
      if (tri) {                                       // the impossible triangle joins them
        const k = clamp((t - at('不可能三角')) / .5), pts = [[xs[0], y + 10], [xs[1], y - 22], [xs[2], y + 10]];
        for (let i = 0; i < 3; i++) { const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % 3]; pline(ax, ay, lerp(ax, bx, k), lerp(ay, by, k), '#F6B13E'); }
        pxText('不可能三角', PCX, PY0 + PH0 - 10, { size: 10, color: '#F6B13E' });
      }
      names.forEach((n, i) => {
        if (!shown[i]) return;
        const yy = tri && i === 1 ? y - 22 : y;
        iconC(n, xs[i], yy, 2, red[i] ? '#F0384E' : null);
        if (two && i < 2) iconC('check', xs[i] + 10, yy + 9, 1);
        if (two && i === 2) iconC('cross', xs[i] + 10, yy + 9, 1);
        pxText(labels[i], xs[i], yy + 19, { size: 7, color: red[i] ? '#FF8C9A' : '#F4F0FF' });
      });
    },
    tags(lt, a, t) {
      const ms = [at('既要'), at('又要'), at('还要')], txt = ['既要', '又要', '还要'], cols = ['#F6B13E', '#9BE3F7', '#FF8C9A'];
      ms.forEach((m, i) => { if (t >= m - .05) { const y = PY0 + 22 + i * 28; pxPanel(PCX - 30, y - 10, 60, 20, clamp((t - m) / .12), '#2B2558', cols[i]); pxText(txt[i], PCX, y, { size: 12, color: cols[i] }); } });
    },
    title(lt, a) {
      iconC(a.icon, PCX, PCY - 16, 3);
      pxText(`第${'一二三'[+a.n - 1]}个`, PCX, PCY + 16, { size: 9, color: '#9BE3F7' });
      pxText(a.text, PCX, PCY + 32, { size: 15 });
    },
    resume(lt, a, t) {
      pxPanel(PCX - 46, PY0 + 12, 92, 76, 1, '#F4F0FF', '#8C88A6');
      for (let i = 0; i < 4; i++) prect(PCX - 36, PY0 + 24 + i * 7, 40 + (i % 2) * 20, 2, '#C9C3DE');
      const flip = t >= at('十五年') - .05;
      pxText('简历', PCX - 26, PY0 + 18, { size: 6, color: '#2C2B3D', stroke: false });
      pxText('工作经验', PCX, PY0 + 60, { size: 8, color: '#2C2B3D', stroke: false });
      pxText(flip ? '15 年' : '10 年', PCX, PY0 + 76, { size: flip ? 16 : 13, color: flip ? '#F0384E' : '#2C2B3D', stroke: false });
    },
    clock(lt) {
      const cx = PCX - 26, cy = PCY - 4;
      pellipse(cx, cy, 20, 20, '#141026'); pellipse(cx, cy, 18, 18, '#F4F0FF');
      const a1 = lt * 7, a2 = lt * .6;                // the hands race round: time spent at work
      pline(cx, cy, cx + Math.sin(a1) * 15, cy - Math.cos(a1) * 15, '#141026');
      pline(cx, cy, cx + Math.sin(a2) * 9, cy - Math.cos(a2) * 9, '#F0384E');
      pxText('加班', PCX + 30, PCY - 10, { size: 16, color: '#F6B13E' });
      pxText('硬熬', PCX + 30, PCY + 12, { size: 12, color: '#FF8C9A' });
    },
    offwork(lt) {
      pxText('别人下班 = 结束', PCX, PCY - 14, { size: 9, color: '#C9C3DE' });
      pxText('码农下班 = 开始', PCX, PCY + 10, { size: 11, color: '#F6B13E' });
    },
    two(lt, a, t) {
      pxText(a.a, PCX, PCY - 14, { size: 9, color: '#C9C3DE' });
      if (t >= at(a.m) - .05) pxText(a.b, PCX, PCY + 10, { size: 10, color: '#F6B13E' });
    },
    soul(lt) {
      iconC('server', PCX + 34, PCY + 4, 3);
      const k = clamp(lt / 1.6), gx = lerp(PCX - 50, PCX + 6, ease(k)), gy = PCY - 6 + bob(lt, 2, 2);
      iconC('ghost', gx, gy, 2);
      pxText('魂还挂在服务器上', PCX, PY0 + PH0 - 10, { size: 8, color: '#9BE3F7' });
    },
    bug(lt, a, t) {
      iconC('server', PCX - 30, PCY, 3);
      if (t >= at('诡异的') - .2) {
        const bx = PCX + 40 - ((lt * 18) % 30), blink = Math.floor(lt * 6) % 2;
        iconC('bug', bx, PCY + 8 + bob(lt, 6, 1), 2);
        if (blink) pxText('Bug', PCX + 34, PCY - 22, { size: 12, color: '#F0384E' });
      }
    },
    hp(lt, a, t) {
      iconC('heart', PX0 + 30, PCY, 2);
      const full = t >= at('叫续命') - .05, k = full ? clamp((t - at('叫续命')) / .8) : .15 + .05 * Math.sin(lt * 6);
      const bx = PX0 + 50, by = PCY - 5, bw = 80;
      prect(bx - 1, by - 1, bw + 2, 12, '#141026'); prect(bx, by, bw, 10, '#2B2558');
      prect(bx, by, Math.round(bw * k), 10, k < .3 ? '#F0384E' : '#F6B13E'); prect(bx, by, Math.round(bw * k), 2, '#FFE7A6');
      pxText(full ? '续命' : '提升', bx + bw / 2, by + 26, { size: 13, color: full ? '#F0384E' : '#9BE3F7' });
    },
    doctor(lt) {
      iconC('book', PCX - 28, PCY, 3);
      pxText('学会了', PCX + 30, PCY - 10, { size: 10 });
      pxText('吃一辈子', PCX + 30, PCY + 8, { size: 11, color: '#9BE3F7' });
    },
    obsolete(lt, a, t) {
      const gone = t >= at('过时淘汰了') - .05;
      iconC('trash', PCX + 30, PCY + 8, 3);
      const k = gone ? clamp((t - at('过时淘汰了')) / .5) : 0;
      if (k < 1) iconC('book', lerp(PCX - 30, PCX + 30, ease(k)), lerp(PCY - 6, PCY + 4, k) - Math.sin(k * Math.PI) * 18, 2, gone ? '#8C88A6' : null);
      pxText(gone ? '过时淘汰' : '今天不学', PCX - 26, PY0 + PH0 - 12, { size: 10, color: gone ? '#F0384E' : '#F4F0FF' });
    },
    deadlock(lt) {
      pxText('不学 焦虑死', PCX, PCY - 14, { size: 13, color: '#9BE3F7' });
      pxText('硬学 累死', PCX, PCY + 12, { size: 13, color: '#FF8C9A' });
    },
    books(lt) {
      for (let i = 0; i < 5; i++) {                   // books flying in from all sides, on twos
        const ph = (lt * .9 + i * .2) % 1, x = PX0 + 20 + i * 26, y = PY0 + 70 - Math.round(Math.sin(ph * Math.PI) * 40);
        iconC('book', x, y, 1 + (i % 2));
      }
      pxText('爆发式狂补', PCX, PY0 + 14, { size: 13, color: '#F6B13E' });
    },
    agent(lt) {
      iconC('chip', PCX, PCY - 6, 3);
      if (Math.floor(lt * 4) % 2) for (let i = 0; i < 8; i++) pset(PCX - 20 + i * 6, PCY - 30, '#9BE3F7');
      pxText('Agent 工程师', PCX, PY0 + PH0 - 12, { size: 10, color: '#9BE3F7' });
    },
    overnight(lt, a, t) {
      const fast = t >= at('只用了一夜') - .05, k = fast ? clamp((t - at('只用了一夜')) / .9) : 0;
      const ang = Math.PI * (1 - k), cx = PCX + Math.cos(ang) * 46, cy = PCY + 16 - Math.sin(ang) * 30;
      iconC(k < .5 ? 'moon' : 'sun', cx, cy, 2);
      prect(PX0 + 6, PCY + 30, PW0 - 12, 1, '#4A68B0');
      pxText(fast ? '一夜' : '一个月', PCX, PY0 + 14, { size: 13, color: fast ? '#F6B13E' : '#C9C3DE' });
    },
    trash(lt) {
      iconC('trash', PCX, PCY + 2, 3);
      pxText('过去的经验', PCX, PY0 + 12, { size: 10, color: '#C9C3DE' });
    },
    cache(lt, a, t) {
      const freed = t >= at('一键释放') - .05, k = freed ? clamp((t - at('一键释放')) / .4) : 0;
      if (!freed || Math.floor(lt * 12) % 2) iconC('box', PCX - 28, PCY, 3, freed ? '#8C88A6' : null);
      pxText(freed ? '一键释放' : '缓存', PCX + 30, PCY, { size: freed ? 12 : 15, color: freed ? '#F0384E' : '#9BE3F7' });
      if (freed && k < 1) for (let i = 0; i < 10; i++) pset(PCX - 28 + Math.round((hash(i) - .5) * 60 * k), PCY + Math.round((hash(i + 9) - .5) * 50 * k), '#9BE3F7');
    },
    exam(lt, a, t) {
      iconC('paper', PX0 + 30, PCY, 3);
      const items = [['算法#1', '算法'], ['网络协议', '网络协议'], ['操作系统', '操作系统'], ['数据库', '数据库'], ['八股文', '八股文原理']];
      pxText('重新高考', PCX + 26, PY0 + 12, { size: 11, color: '#F6B13E' });
      items.forEach(([m, txt], i) => { if (t >= at(m) - .05) pxText(txt, PCX + 26, PY0 + 30 + i * 13, { size: 8 }); });
    },
    tangle(lt) {
      for (let i = 0; i < 40; i++) {                    // a scribbled knot: nothing makes sense
        const a = i * .9 + lt * 2, r = 10 + 22 * hash(i);
        pset(PCX + Math.round(Math.cos(a) * r * 1.4), PCY + Math.round(Math.sin(a * 1.3) * r * .8), i % 3 ? '#C9C3DE' : '#F0384E');
      }
      pxText('搞不懂', PCX, PY0 + PH0 - 10, { size: 9, color: '#FF8C9A' });
    },
    crown(lt) {
      iconC('crown', PCX, PCY - 6 + bob(lt, 2, 1), 3);
      pxText('核心骨干', PCX, PY0 + PH0 - 12, { size: 10, color: '#F6B13E' });
    },
    bag(lt, a, t) {
      const cut = t >= at('优化掉') - .05;
      iconC('bag', PX0 + 30, PCY, 3, cut ? '#8C88A6' : null);
      const k = cut ? 1 : clamp(lt / 6), bx = PX0 + 54, by = PCY - 5, bw = 76;
      prect(bx - 1, by - 1, bw + 2, 12, '#141026'); prect(bx, by, bw, 10, '#2B2558'); prect(bx, by, Math.round(bw * k), 10, '#C08A5C');
      pxText('历史包袱', bx + bw / 2, by + 26, { size: 11, color: '#C08A5C' });
      if (cut) { iconC('cross', PX0 + 30, PCY, 3); pxText('优化', bx + bw / 2, by - 14, { size: 12, color: '#F0384E' }); }
    },
    compat(lt, a, t) {
      const me = t >= at('竟然是他妈我') - .05;
      pxText('系统兼容性', PCX, PCY - 18, { size: 11, color: '#9BE3F7' });
      pxText('不兼容', PCX, PCY + 2, { size: 12, color: '#C9C3DE' });
      if (me) { pxText('我', PCX, PCY + 24, { size: 18, color: '#F0384E' }); iconC('cross', PCX + 18, PCY + 24, 1); }
    },
    thorn(lt) {
      iconC('thorn', PCX - 30, PCY, 3);
      pxText('心里', PCX + 26, PCY - 10, { size: 10, color: '#C9C3DE' });
      pxText('有根刺', PCX + 26, PCY + 8, { size: 13, color: '#F0384E' });
    },
    future(lt, a, t) {
      const past = t >= at('最残忍的地方') - .05;
      iconC(past ? 'moon' : 'sun', PCX - 30, PCY, 3);
      pxText(past ? '埋在过去' : '创造未来', PCX + 26, PCY, { size: 13, color: past ? '#8C88A6' : '#F6B13E' });
    },
  };

  // ---------- the frame ----------
  LOOPS.pxManong = t => {
    const tt = onTwos(t);
    N.sky(tt); N.hills(tt); N.fireflies(tt);
    // the panel: opens on each new prop (a quick unroll), closes for 'none'
    let cur = null; for (const p of props) if (tt >= p.t) cur = p;
    if (cur && cur.name !== 'none') {
      const lt = tt - cur.t, prev = props[props.indexOf(cur) - 1];
      const k = prev && prev.name !== 'none' ? 1 : clamp(lt / .2);
      pxPanel(PX0, PY0, PW0, PH0, k);
      if (k >= 1 && P[cur.name]) P[cur.name](lt, cur.args, tt);
    }
    // 黑哥: walks in side on, turns to us, then acts every line
    const p = seg(tt, ...WALK), x = Math.round(lerp(-34, HX, 1 - (1 - p) ** 2));
    const o = { ...emotions(tt, keys, { take: .8 }), seed: 2 };
    if (tt < WALK[1]) Object.assign(o, { view: 'side', walk: (x + 34) / 28, aL: .15, aR: .15, dy: 0, sq: 0, emote: null });
    else if (tt < TURN[1] + .05) Object.assign(o, turn(tt, ...TURN, .25, 0));
    heigePx(x, N.hillTop(x), o);
    // screen shake on the big words
    let sh = 0; for (const [s0, a] of shakes) { const d = tt - s0; if (d >= 0 && d < .35) sh = Math.max(sh, a * (1 - d / .35)); }
    if (sh > .5) pxShift(Math.round((hash(Math.floor(tt * 24)) - .5) * 2 * sh), Math.round((hash(Math.floor(tt * 24) + 7) - .5) * 2 * sh));
    // subtitles
    for (const [a, b, txt] of D.cues) if (t >= a && t < b) { pxText(txt, PW / 2, PH - 12, { size: 11.5 }); break; }
  };
  Object.assign(LOOPS.pxManong, { len: D.len, res: [320, 180], px: 6, overlay: (c, t, s) => pxTextFlush(c, s) });
})();
