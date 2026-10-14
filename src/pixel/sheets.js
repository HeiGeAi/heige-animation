// pixel/sheets.js: model sheets for the pixel characters, as standalone loops (reference, so labels are fine here).
//   node render.mjs --page=pixel.html --loop=pxHeigeEmotions --stills=1 --out=out/pixel/sheets
// Sheets draw on a bigger logical canvas (loop.res) at a smaller scale (loop.px); the pixel stays square and uniform.
(() => {
  const ZH = {
    neutral: '平静', happy: '开心', excited: '兴奋', laugh: '大笑', love: '喜欢', shy: '害羞', proud: '得意', smug: '臭屁',
    relieved: '松口气', sad: '难过', cry: '大哭', angry: '生气', furious: '暴怒', scared: '害怕', surprised: '惊讶',
    confused: '困惑', thinking: '思考', idea: '灵光一闪', determined: '下定决心', sleepy: '犯困', bored: '无聊', nervous: '紧张',
    suspicious: '怀疑', disgusted: '嫌弃', dizzy: '晕乎乎', cool: '耍酷', starstruck: '星星眼', ko: '被击倒', playful: '调皮',
    mischief: '使坏', hopeful: '期待',
  };
  const BG = '#2B2A55', FLOOR = '#3A3870', FLOOR2 = '#232248';
  const labels = (cells, scale) => (c, t, s) => {
    c.textAlign = 'center'; c.textBaseline = 'top';
    for (const [txt, x, y, sub] of cells) {
      c.font = `600 ${Math.round(s * 4.6)}px "PingFang SC", "HarmonyOS Sans SC", sans-serif`; c.fillStyle = '#F4F0FF'; c.fillText(txt, x * s, y * s);
      if (sub) { c.font = `${Math.round(s * 3.4)}px "SF Mono", Menlo, monospace`; c.fillStyle = '#A9A3D6'; c.fillText(sub, x * s, (y + 5.4) * s); }
    }
  };

  // All 31 emotions, alive (each with its own blink seed). Order follows EMO. One sheet per view:
  // pxHeigeEmotions (front), pxHeigeEmotionsQ (three-quarters), pxHeigeEmotionsSide (profile), pxHeigeEmotionsBack.
  for (const [loop, view] of [['pxHeigeEmotions', 'front'], ['pxHeigeEmotionsQ', 'q'], ['pxHeigeEmotionsSide', 'side'], ['pxHeigeEmotionsBack', 'back']]) {
    const names = Object.keys(EMO), cols = 8, cw = 64, ch = 120, gy = 104, cells = [];
    names.forEach((n, i) => cells.push([ZH[n] || n, cw * (i % cols) + cw / 2, ch * Math.floor(i / cols) + gy + 3, n]));
    LOOPS[loop] = t => {
      prect(0, 0, PW, PH, BG);
      for (let r = 0; r < 4; r++) { prect(0, ch * r + gy, PW, 1, FLOOR); prect(0, ch * r + gy + 1, PW, 1, FLOOR2); }
      names.forEach((n, i) => heigePx(cw * (i % cols) + cw / 2, ch * Math.floor(i / cols) + gy, { ...feel(n, onTwos(t), { seed: i }), view }));
    };
    Object.assign(LOOPS[loop], { len: 4, res: [cols * cw, 4 * ch], px: 4, overlay: labels(cells) });
  }

  // Every arm frame, for checking the drawings.
  {
    const names = Object.keys(HG_PARTS.parts).filter(k => k.startsWith('front.arm.')).map(k => k.slice(10)), cols = 8, cw = 60, ch = 106, cells = [];
    names.forEach((n, i) => cells.push([n, cw * (i % cols) + cw / 2, ch * Math.floor(i / cols) + 94]));
    LOOPS.pxHeigeArms = t => {
      prect(0, 0, PW, PH, BG);
      names.forEach((n, i) => heigePx(cw * (i % cols) + cw / 2, ch * Math.floor(i / cols) + 90, { ...feel('happy', 0), poseL: n, poseR: n === 'clasp' || n === 'cover' ? n : 'down', dy: 0, sq: 0 }));
    };
    Object.assign(LOOPS.pxHeigeArms, { len: 1, res: [cols * cw, Math.ceil(names.length / cols) * ch], px: 4, overlay: labels(cells) });
  }

  // Views and motion: the key views (flip any of them to face left), then walks, a drawn turn, a hop, a take, a wave.
  {
    const cw = 80, ch = 120, gy = 104, cells = [];
    const views = [['front', '正面'], ['q', '3/4'], ['side', '侧面'], ['back', '背面'], ['side', '侧面朝左', true], ['q', '3/4 朝左', true]];
    const row2 = [
      ['走路 正面', t => ({ ...move('walk', t), view: 'front' })],
      ['走路 3/4', t => ({ ...move('walk', t), view: 'q' })],
      ['走路 侧面', t => ({ ...move('walk', t), view: 'side' })],
      ['转身', t => ({ ...feel('happy', t), ...spinView(Math.floor(t * 4) / 8) })],
      ['跳', t => ({ ...feel('excited', t), ...jump(t % 1.5, .35, .95, 3) })],
      ['挥手', t => ({ ...feel('happy', t), poseR: 'wave' })],
    ];
    views.forEach(([v, zh], i) => cells.push([zh, cw * i + cw / 2, gy + 3, v + (views[i][2] ? ' flip' : '')]));
    row2.forEach(([zh], i) => cells.push([zh, cw * i + cw / 2, ch + gy + 3]));
    LOOPS.pxHeigeViews = t => {
      prect(0, 0, PW, PH, BG);
      for (let r = 0; r < 2; r++) { prect(0, ch * r + gy, PW, 1, FLOOR); prect(0, ch * r + gy + 1, PW, 1, FLOOR2); }
      const tt = onTwos(t);
      views.forEach(([v, , flip], i) => heigePx(cw * i + cw / 2, gy, { ...feel('neutral', tt, { seed: i }), view: v, flip: !!flip }));
      row2.forEach(([, f], i) => heigePx(cw * i + cw / 2, ch + gy, { seed: i, ...f(tt) }));
    };
    Object.assign(LOOPS.pxHeigeViews, { len: 4, res: [6 * cw, 2 * ch], px: 4, overlay: labels(cells) });
  }
})();
