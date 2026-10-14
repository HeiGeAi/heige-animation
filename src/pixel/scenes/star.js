// pixel/scenes/star.js: 《抢星星》 a music film with no words: 黑哥 and Clawd race for a fallen star (a GitHub
// star, for the open-source kit they come from). Locked to 「千年之后」 (112.86 BPM, first downbeat 0.044 s): every time
// here is b(beat) or B(bar). Every shot moves: the camera follows, pans or rises, the background scrolls in layers,
// and the whole picture kicks on every beat (harder on each bar's downbeat).
//   node render.mjs --page=pixel.html --loop=pxStar --clip --fps=24 --out=out/video/star/picture.mp4
(() => {
  const BPM_S = 112.86, OFF_S = .044, BT = 60 / BPM_S;
  const b = n => OFF_S + n * BT, B = k => b((k - 1) * 4);             // beat n (from 0), bar k (from 1)
  const LEN = B(29) + 1.0;
  const R = prect;
  const vgrad = (x0, x1, y0, y1, stops) => { for (let y = Math.max(0, y0); y < Math.min(PH, y1); y++) for (let x = x0; x < x1; x++) pset(x, y, bandAt(x, y, y - y0, stops, 3)); };
  const beatK = t => { const f = (t - OFF_S) / BT; return f - Math.floor(f); };                  // 0 on each beat
  const onBeat = (t, w = .12) => beatK(t) * BT < w;
  const downbeat = t => Math.floor((t - OFF_S) / BT + 1e-6) % 4 === 0;
  // the beat kick: the frame jumps up a pixel on every beat, two on a downbeat
  const groove = t => { if (onBeat(t, .09)) pxShift(0, downbeat(t) ? -2 : -1); };
  // ---------- the world, in layers ----------
  // the night: sky by world height (so the camera can look up), stars, moon, far and near ridges, the ground at y 150
  const night = (t, cx = 0, cy = 0, o = {}) => {
    for (let y = 0; y < PH; y++) { const wy = y + cy; const c = wy < -120 ? '#0B0A20' : bandAt(0, y, wy + 140, [[0, '#0B0A20'], [60, '#141530'], [120, '#1C1D43'], [200, '#36306B'], [260, '#4A3B7A']], 4); for (let x = 0; x < PW; x++) pset(x, y, wy > -140 ? bandAt(x, y, wy + 140, [[0, '#0B0A20'], [60, '#141530'], [120, '#1C1D43'], [200, '#36306B'], [260, '#4A3B7A']], 4) : c); }
    const tw = onBeat(t, .15);
    for (let i = 0; i < 140; i++) { const wx = hash(i) * 900, wy = -320 + hash(i + 50) * 420; const sx = Math.round(((wx - cx * .1) % 900 + 900) % 900) - 290, sy = Math.round(wy - cy * .4); if (sx < 0 || sx >= PW || sy < 0 || sy >= PH) continue; const big = hash(i + 9) > .88; pset(sx, sy, tw && big ? '#FFFFFF' : hash(i + 3) > .5 ? '#FFF6DA' : '#8F88C8'); if (big && tw) { pset(sx - 1, sy, '#8F88C8'); pset(sx + 1, sy, '#8F88C8'); pset(sx, sy - 1, '#8F88C8'); pset(sx, sy + 1, '#8F88C8'); } }
    if (!o.noMoon) { const mx = 60 - Math.round(cx * .05), my = Math.round(30 - cy * .3); pellipse(mx, my, 10, 10, '#F8E9C6'); pellipse(mx - 3, my - 2, 2, 2, '#DFC58F'); pellipse(mx + 3, my + 3, 2, 2, '#DFC58F'); }
    const ridge = (k, base, a1, f1, col, top) => { for (let x = 0; x < PW; x++) { const wx = x + cx * k, y = Math.round(base + a1 * Math.sin(wx * f1 + 1.3) + a1 * .4 * Math.sin(wx * f1 * 2.7) - cy * k); for (let yy = Math.max(0, y); yy < PH; yy++) pset(x, yy, yy === y ? top : col); } };
    ridge(.25, 118, 8, .021, '#2B2659', '#3A3270');
    ridge(.55, 132, 7, .034, '#2E386B', '#3B4A86');
    const gy = 150 - cy;
    for (let y = Math.max(0, gy); y < PH; y++) for (let x = 0; x < PW; x++) pset(x, y, bandAt(x, y, y - gy, [[0, '#3F7590'], [2, '#2E5A70'], [10, '#284D61'], [24, '#213F50']], 3));
    if (gy < PH) for (let x = 0; x < PW; x++) { const wx = x + cx; if (hash(Math.floor(wx / 3)) < .4 || Math.floor(wx) % 3) continue; const h = 1 + Math.floor(hash(Math.floor(wx)) * 3), lean = Math.floor(t * 4 + wx) % 2; for (let j = 1; j <= h; j++) pset(x + (j === h ? lean : 0), gy - j, j === h ? '#5FA2BC' : '#4A8AA4'); }
  };
  // a glowing star prop: a dithered halo that swells on the beat
  const starAt = (x, y, t, s = 1) => {
    const r = (9 + (onBeat(t, .18) ? 3 : 0)) * s;
    for (let yy = -r; yy <= r; yy++) for (let xx = -r; xx <= r; xx++) { const d = Math.hypot(xx, yy); if (d > r || d < 5 * s) continue; const px = Math.round(x + xx), py = Math.round(y + yy); if ((px + py) % 2 === 0 && d < r * .8) pset(px, py, '#F6B13E'); else if ((px * 3 + py) % 5 === 0) pset(px, py, '#A86E3C'); }
    pxIcon('star', Math.round(x - 6.5 * s), Math.round(y - 6.5 * s), s);
  };
  const burst = (x, y, age, n = 18, cols = ['#FFE7A6', '#F6B13E', '#9BE3F7', '#FF8C9A']) => {
    if (age < 0 || age > 1.2) return;
    for (let i = 0; i < n; i++) { const a = i / n * TAU + hash(i) * .3, r = age * (40 + hash(i + 2) * 30), fall = age * age * 20; pset(Math.round(x + Math.cos(a) * r), Math.round(y + Math.sin(a) * r + fall), age < .8 ? cols[i % cols.length] : '#5A4485'); }
  };
  const speedLines = (t, dir = -1, col = '#4A4570', n = 16) => { for (let i = 0; i < n; i++) { const y = Math.floor(hash(i * 3.7) * PH), L = 20 + Math.floor(hash(i + 5) * 40), p = ((t * 900 + hash(i) * 700) % (PW + L)); const x = dir < 0 ? PW - p : p - L; R(Math.round(x), y, L, 1, col); } };
  const radial = (t, cx, cy, col = '#4A4570') => { for (let i = 0; i < 40; i++) { const a = hash(i) * TAU, p = (t * 1.6 + hash(i + 3)) % 1, r0 = 10 + p * 200, r1 = r0 + 10 + p * 30; pline(Math.round(cx + Math.cos(a) * r0), Math.round(cy + Math.sin(a) * r0), Math.round(cx + Math.cos(a) * r1), Math.round(cy + Math.sin(a) * r1), col); } };
  const flash = (k, col = '#FFF6DA') => { if (k <= 0) return; for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) if (BAYER[y & 3][x & 3] / 16 < k) pset(x, y, col); };
  const closeBg = (t, a, c) => { vgrad(0, PW, 0, PH, [[0, a], [90, c]]); for (let i = 0; i < 20; i++) { const ang = i / 20 * TAU + t * .6; for (let r = 14; r < 110; r += 3) if (i % 2) pset(Math.round(PW / 2 + Math.cos(ang) * r), Math.round(PH / 2 + Math.sin(ang) * r), c); } };
  const HG = (x, y, o) => heigePx(Math.round(x), Math.round(y), o);
  const CL = (x, y, o) => clawdPx(Math.round(x), Math.round(y), o);
  const F = (name, t, over = {}) => ({ ...feel(name, onTwos(t)), ...over });

  // ---------- the shots ----------
  const shots = [];
  const add = (t0, t1, draw, o = {}) => shots.push({ t0, t1, draw: (lt, t) => { draw(lt, t); groove(t); }, res: o.res || [320, 180], in: o.in || { type: 'cut' } });

  // 1. looking up at the stars, the camera tilts down; a shooting star falls onto the hill on bar 4's downbeat
  const IMPACT = B(4) + BT * 2, STAR_X = 196, STAR_Y = 138;
  add(0, B(5), (lt, t) => {
    const cy = Math.round(lerp(-150, 0, ease(clamp((t - b(1)) / (IMPACT - b(1) - .3)))));
    const cx = Math.round(Math.sin(t * .4) * 6);
    night(t, cx, cy);
    // an aurora waving across the sky (violet and cyan, dithered), and small shooting stars on the beat
    for (let x = 0; x < PW; x++) for (const [base, amp, col, ph] of [[-70, 10, '#8F6CC8', 0], [-40, 8, '#22A7D6', 2]]) { const y0 = Math.round(base + amp * Math.sin((x + cx) * .03 + t * 1.2 + ph) - cy); for (let j = 0; j < 14; j++) { const y = y0 + j; if (y < 0 || y >= PH) continue; if (BAYER[y & 3][x & 3] / 16 < (1 - j / 14) * .45) pset(x, y, col); } }
    for (const n of [2, 5, 7, 9]) { const k2 = (t - b(n)) / .45; if (k2 < 0 || k2 > 1) continue; const x0 = 40 + n * 23, y0 = 10 + (n % 3) * 12; for (let i = 0; i < 12; i++) { const kk = k2 - i * .02; if (kk < 0) break; pset(Math.round(x0 + kk * 70), Math.round(y0 + kk * 26), i < 4 ? '#FFFFFF' : '#8F88C8'); } }
    if (t < IMPACT) { const k = clamp((t - B(3)) / (IMPACT - B(3))); const path = kk => [lerp(312, STAR_X - cx, kk), lerp(-6, STAR_Y - cy, kk * kk)]; if (k > 0) { for (let i = 1; i < 40; i++) { const tk = k - i * .006; if (tk < 0) break; const [tx, ty] = path(tk); pset(Math.round(tx), Math.round(ty), i < 10 ? '#FFE7A6' : i < 24 ? '#F6B13E' : '#A86E3C'); if (i < 14) pset(Math.round(tx), Math.round(ty) + 1, '#F6B13E'); } const [sx, sy] = path(k); starAt(sx, sy, t, 1); } }
    else { const a = t - IMPACT; starAt(STAR_X - cx, STAR_Y - cy, t, 1); burst(STAR_X - cx, STAR_Y - cy, a, 24); for (let i = 0; i < 10; i++) { const d = a * 30 * (1 + hash(i)); pset(Math.round(STAR_X - cx + (hash(i) - .5) * 2 * d), Math.round(150 - cy - 2 - Math.abs(Math.sin(a * 6 + i)) * 6 * Math.max(0, 1 - a)), '#4A8AA4'); } flash(Math.max(0, .5 - a * 7)); if (a < .4) pxShift(Math.round((hash(Math.floor(t * 24)) - .5) * 6), Math.round((hash(Math.floor(t * 24) + 3) - .5) * 4)); }
  });
  // 2. 黑哥 walks in on the beat, sees it (a take: his cap jumps), then a whip pan: Clawd pops up over the crest
  const WALK0 = B(5), SEE = B(6), POP = B(6) + BT * 2, WHIP = B(6) + BT * 3;
  add(B(5), B(7), (lt, t) => {
    const hx = Math.min(110, lerp(-30, 110, (t - WALK0) / (SEE - WALK0)));
    const whip = ease(clamp((t - WHIP) / .3)), cx = Math.round(lerp(Math.max(0, hx - 100), 120, whip));
    night(t, cx, 0);
    starAt(STAR_X - cx, STAR_Y, t, 1);
    if (whip > .05 && whip < .95) speedLines(t, 1, '#5A5F7E', 24);
    const seen = t >= SEE;
    HG(hx - cx, 150, seen ? { ...emotions(onTwos(t), [[SEE - .1, 'neutral'], [SEE, 'surprised'], [POP + .3, 'determined']], { take: 1.3 }), view: t < SEE + .4 ? 'side' : 'q', walk: null } : { ...F('neutral', t), view: 'side', walk: (t - WALK0) / (BT * 2) });
    // Clawd: up from behind the crest, lands, looks
    if (t >= POP) { const j = clamp((t - POP) / .45); const cy2 = 150 - Math.sin(j * Math.PI) * 34 + (1 - Math.min(1, j * 3)) * 40; CL(276 - cx, cy2, { ...emotions(onTwos(t), [[POP, 'excited'], [POP + .6, 'determined']]), flip: true, view: 'q', sq: j >= 1 ? 0 : -.1 }); }
  });
  // 3. the stare-down: a close-up on every beat, 黑哥 / Clawd / 黑哥 / Clawd, faster and redder
  for (let i = 0; i < 7; i++) {
    const t0 = B(7) + i * BT, me = i % 2 === 0;
    add(t0, t0 + BT, (lt, t) => {
      closeBg(t, me ? '#14183A' : '#3A1420', me ? '#22A7D6' : '#F0384E');
      if (me) HG(80 + Math.round(Math.sin(t * 40) * (i / 3)), 104, { ...F('determined', t), lookX: .9, poseR: i > 3 ? 'fistUp' : null });
      else CL(80 + Math.round(Math.sin(t * 40) * (i / 3)), 80, { ...F('angry', t), eyes: 'angry', flip: true, view: 'q', aL: i > 3 ? 1.2 : .2 });
      // a lightning bolt from the side they're looking at
      for (let k = 0; k < 5; k++) { const yy = 20 + k * 12 + Math.round((hash(i * 9 + k) - .5) * 8); pline(me ? 150 : 10, yy, me ? 130 + k * 2 : 30 - k * 2, yy + 6, '#FFE27A'); }
    }, { res: [160, 90], in: { type: 'cut' } });
  }
  // 4. both crouch, ready: one beat, the star between them
  add(B(7) + 7 * BT, B(9), (lt, t) => {
    night(t, 120, 0);
    starAt(STAR_X - 120, STAR_Y, t, 1);
    HG(60, 150, { ...F('determined', t), view: 'side', sq: .2 });
    CL(156, 150, { ...F('determined', t), view: 'side', flip: true, sq: .2 });
    if (onBeat(t, .2)) speedLines(t, 1, '#F6B13E', 10);
  });
  // 5. the drop: Clawd grabs the star and runs; the chase, side-scrolling, rocks to hop, a Bug to stomp
  const C0 = B(9), C1 = B(15), V = 74;                                         // chase speed, px a second
  const hgX = t => 60 + (t - C0) * V - (t < C0 + .5 ? (C0 + .5 - t) * 30 : 0);
  const clX = t => t < C0 + BT ? lerp(156, STAR_X + 120 - 120 + 196 - 196 + 196, clamp((t - C0) / BT)) : 196 + (t - C0 - BT) * (V + 4);
  const hgJumps = [B(10), B(10) + 2 * BT, B(11) + BT, B(12), B(12) + 2 * BT, B(13), B(13) + 3 * BT, B(14) + BT];
  const rocks = hgJumps.map(tj => hgX(tj + .22));                              // a rock where 黑哥's hop peaks
  const BUG_T = B(12) + 2 * BT, BUG_X = hgX(BUG_T + .45);
  const jumpsFor = (xf, tf) => rocks.map(rx => tf.find(tt => tt > C0 && xf(tt) >= rx - 16) ?? null);
  const chase = (t, cx, close) => {
    night(t, cx, 0);
    speedLines(t, -1, '#3B4A86', 18);
    rocks.forEach((rx, i) => { const sx = rx - cx; if (sx < -20 || sx > PW + 20) return; pellipse(sx, 148, 7, 5, '#141026'); pellipse(sx, 147, 6, 4, '#5A5F7E'); pset(sx - 2, 145, '#8C88A6'); });
    // the bug: up until he lands on it, then squashed into stars
    if (BUG_X - cx > -30 && BUG_X - cx < PW + 30) { if (t < BUG_T + .45) pxIcon('bug', Math.round(BUG_X - cx - 12), 126 + Math.round(Math.sin(t * 20)), 2); else burst(BUG_X - cx, 140, t - BUG_T - .45, 12); }
    let jy = 0, jsq = 0; for (const tj of hgJumps) { const J = jump(onTwos(t), tj, tj + .45, 4); jy += J.dy; jsq += J.sq; }
    let cy = 0, csq = 0; for (const tj of hgJumps) { const J = jump(onTwos(t), tj - .55, tj - .15, 4); cy += J.dy; csq += J.sq; }
    const look = t > B(13) + 2 * BT && t < B(14);
    CL(clX(t) - cx, 150, { ...F(look ? 'playful' : 'excited', t), view: look ? 'q' : 'side', flip: look, walk: t > C0 + BT ? (t - C0) * 2.4 : null, dy: cy, sq: csq, aL: t > C0 + BT ? 1.3 : .2 });
    if (t > C0 + BT * .6) starAt(clX(t) - cx, 150 - 52 + cy * 5 + Math.round(Math.sin(t * 12)), t, 1);
    HG(hgX(t) - cx, 150, { ...F('determined', t), view: 'side', walk: (t - C0) * 2.6, dy: jy, sq: jsq, rot: .08 });
  };
  add(B(9), B(11), (lt, t) => { const cx = Math.round(hgX(t) - 90); chase(t, cx); flash(Math.max(0, .7 - lt * 5), '#FFE7A6'); });
  // a tracking close-up on Clawd with the star, one bar
  add(B(11), B(12), (lt, t) => {
    const cx = Math.round(t * 140);
    closeBg(t, '#1C1D43', '#36306B'); speedLines(t, -1, '#5A5F7E', 20);
    const J = jump(onTwos(t), B(11) + BT, B(11) + BT + .4, 3);
    CL(70, 84, { ...F('playful', t), view: 'side', walk: t * 2.6, aL: 1.3, dy: J.dy, sq: J.sq });
    starAt(70, 84 - 52 + J.dy * 5, t, 1);
  }, { res: [160, 90], in: { type: 'wipe', dur: .2 } });
  add(B(12), B(15), (lt, t) => { const cx = Math.round((hgX(t) + clX(t)) / 2 - 150); chase(t, cx); }, { in: { type: 'wipe', dur: .2 } });
  // 6. up the floating blocks: one hop a beat each, the camera rises with them
  const P0 = B(15), P1 = B(17);
  const steps = 8, blocks = Array.from({ length: steps + 1 }, (_, i) => [100 + (i % 2) * 110 + (hash(i) - .5) * 20, 150 - i * 34]);
  const deco = Array.from({ length: 14 }, (_, i) => [hash(i + 40) * 300 + 10, 150 - hash(i + 60) * 300]);
  add(P0, P1, (lt, t) => {
    const n = clamp((t - P0) / BT, 0, steps);
    const cy = Math.round(lerp(0, -steps * 34 + 40, ease(clamp((t - P0) / (P1 - P0)))));
    night(t, 0, cy, { noMoon: false });
    deco.forEach(([dx2, dy2]) => { const sy = Math.round(dy2 - cy); if (sy > -10 && sy < PH) { R(Math.round(dx2) - 10, sy, 20, 5, '#141026'); R(Math.round(dx2) - 9, sy + 1, 18, 3, '#2B2558'); } });
    blocks.forEach(([bx, by], i) => { if (i === 0) return; const sy = by - cy; if (sy < -10 || sy > PH + 10) return; R(bx - 28, sy, 56, 9, '#141026'); R(bx - 27, sy + 1, 54, 7, '#4A68B0'); R(bx - 27, sy + 1, 54, 2, '#9BE3F7'); for (let k = -24; k < 26; k += 8) R(bx + k, sy + 5, 4, 2, '#2B2558'); });
    // each beat both hop up one block: Clawd one ahead
    const pos = (who, lag) => { const k = clamp(n - lag, 0, steps), i0 = Math.floor(k), f = k - i0; const a = blocks[Math.min(steps, i0)], c = blocks[Math.min(steps, i0 + 1)]; const fx = f < 1 && i0 < steps ? lerp(a[0], c[0], ease(f)) : a[0], fy = f < 1 && i0 < steps ? lerp(a[1], c[1], f) - Math.sin(f * Math.PI) * 26 : a[1]; return [fx, fy, f]; };
    const [hx, hy, hf] = pos('hg', .5), [kx, ky, kf] = pos('cl', -.5);
    CL(kx, ky - cy, { ...F('excited', t), view: 'side', flip: kx > hx, aL: 1.3, sq: kf < .1 ? .12 : -.08 });
    starAt(kx, ky - cy - 52, t, 1);
    HG(hx, hy - cy, { ...F('determined', t), view: 'side', flip: hx > kx, poseL: 'up', poseR: 'up', sq: hf < .1 ? .12 : -.08 });
  }, { in: { type: 'iris', dur: .35, x: 960, y: 900 } });
  // 7. tug-of-war on the top block: both hold the star, jerking on each beat, faster and faster
  const TUG0 = B(17), POPT = B(18) + 2 * BT;
  add(TUG0, B(19), (lt, t) => {
    const cy = -steps * 34 + 40;
    night(t, 0, cy - 20);
    R(70, 128, 180, 10, '#141026'); R(71, 129, 178, 8, '#4A68B0'); R(71, 129, 178, 2, '#9BE3F7');
    if (t < POPT) {
      const k = (t - TUG0) / (POPT - TUG0), jerk = Math.round(Math.sin((t - TUG0) / BT * Math.PI) * (2 + k * 6)), sh = Math.round((hash(Math.floor(t * 24)) - .5) * k * 4);
      HG(122 + jerk + sh, 128, { ...F('angry', t), view: 'side', poseL: 'out', emote: 'sweat', emoteK: 1, sq: .08 });
      CL(204 + jerk + sh, 128, { ...F('furious', t), view: 'side', flip: true, aL: .6, sq: .08 });
      starAt(163 + jerk + sh, 100, t, 1);
      if (k > .5) for (let i = 0; i < 6; i++) pset(163 + jerk + Math.round((hash(i + Math.floor(t * 12)) - .5) * 40), 100 + Math.round((hash(i * 3 + Math.floor(t * 12)) - .5) * 30), '#FFE27A');
    } else {
      // pop! both thrown up and out, the star shoots up
      const a = t - POPT;
      flash(Math.max(0, .55 - a * 5)); burst(163, 100, a, 30);
      HG(122 - a * 60, 128 - a * 120, { ...F('dizzy', t), view: 'front', dy: 0 });
      CL(204 + a * 60, 128 - a * 140, { ...F('dizzy', t), flip: true });
      starAt(163, 100 - a * 200, t, 1);
    }
  });
  // 8. through the star tunnel, spinning: rings and streaks rush out from the middle
  add(B(19), B(21), (lt, t) => {
    vgrad(0, PW, 0, PH, [[0, '#0B0A20'], [90, '#1E1650'], [180, '#0B0A20']]);
    for (let r = 0; r < 6; r++) { const rr = ((t * 70 + r * 40) % 240); for (let a = 0; a < 64; a++) { const ang = a / 64 * TAU; if (a % 2) pset(Math.round(160 + Math.cos(ang) * rr), Math.round(90 + Math.sin(ang) * rr * .6), rr > 140 ? '#5A4485' : '#8F6CC8'); } }
    radial(t, 160, 90, '#9BE3F7');
    const spin = spinView(Math.floor((t - B(19)) / (BT / 2)) / 8);
    HG(120 + Math.sin(t * 3) * 20, 120 + Math.cos(t * 2.4) * 10, { ...F('excited', t), ...spin, poseL: 'cheer', poseR: 'cheer' });
    CL(214 + Math.cos(t * 3) * 18, 100 + Math.sin(t * 2.2) * 10, { ...F('excited', t), view: spin.view === 'q' ? 'q' : spin.view === 'side' ? 'side' : spin.view === 'back' ? 'back' : 'front', flip: spin.flip, aL: 1.3, aR: 1.3 });
    starAt(160, 34 + Math.sin(t * 5) * 4, t, 2);
  }, { in: { type: 'glitch', dur: .3 } });
  // 9. the stage: they land, and dance it out. Spotlights, a floor that flashes on the beat, the star as a disco ball
  const stage = (t, cx = 0) => {
    vgrad(0, PW, 0, 150, [[0, '#120E24'], [150, '#2A1A44']]);
    const beatN2 = Math.floor((t - OFF_S) / BT), cols = ['#F6B13E', '#22A7D6', '#FF8C9A', '#8F6CC8'];
    for (let s = 0; s < 3; s++) { const sx = 60 + s * 100 + Math.round(Math.sin(t * 1.5 + s * 2) * 30) - cx, col = cols[(beatN2 + s) % 4]; for (let y = 0; y < 150; y++) { const w = 6 + y * .35; for (let x = Math.round(sx - w); x <= sx + w; x++) if ((x + y) % 3 === 0 && x >= 0 && x < PW) pset(x, y, col); } }
    for (let y = 150; y < PH; y++) for (let x = 0; x < PW; x++) { const tx = Math.floor((x + cx) / 20), ty = Math.floor((y - 150) / 8); const lit = (tx + ty + beatN2) % 4 === 0; pset(x, y, lit ? cols[(tx + beatN2) % 4] : (tx + ty) % 2 ? '#2B2558' : '#221C4A'); }
    const bx = 160 - cx, by = 26; starAt(bx, by, t, 2); for (let i = 0; i < 8; i++) { const a = t * 2 + i * TAU / 8; pset(Math.round(bx + Math.cos(a) * 26), Math.round(by + Math.sin(a) * 10 + 4), '#FFE7A6'); }
  };
  const DANCE = [[B(21), B(22), 'hg'], [B(22), B(23), 'cl'], [B(23), B(24), 'both'], [B(24), B(25), 'cuH'], [B(25), B(26), 'both2'], [B(26), B(27), 'cuC']];
  DANCE.forEach(([t0, t1, who], i) => {
    if (who === 'cuH') add(t0, t1, (lt, t) => { closeBg(t, '#2A1A44', '#F6B13E'); HG(80, 104, { ...F('laugh', t), ...move('roof', t) }); }, { res: [160, 90], in: { type: 'cut' } });
    else if (who === 'cuC') add(t0, t1, (lt, t) => { closeBg(t, '#2A1A44', '#22A7D6'); CL(80, 80, { ...F('excited', t), ...move('shimmy', t) }); }, { res: [160, 90], in: { type: 'cut' } });
    else add(t0, t1, (lt, t) => {
      const cx = Math.round(Math.sin(t * .9) * 14); stage(t, cx);
      const land = i === 0 ? jump(onTwos(t), B(21) - .4, B(21) + .1, 6) : { dy: 0, sq: 0 };
      const hgM = who === 'hg' ? move(lt < BT * 2 ? 'bounce' : 'roof', t) : who === 'cl' ? move('idle', t) : move(who === 'both2' ? 'spin' : 'mix', t, 1);
      const clM = who === 'cl' ? move(lt < BT * 2 ? 'hop' : 'shimmy', t) : who === 'hg' ? move('idle', t) : move(who === 'both2' ? 'spin' : 'mix', t, 2);
      HG(110 - cx, 150, { ...F(who === 'cl' ? 'happy' : 'excited', t), ...hgM, dy: (hgM.dy || 0) + land.dy, sq: (hgM.sq || 0) + land.sq });
      CL(220 - cx, 150, { ...F(who === 'hg' ? 'happy' : 'excited', t), ...clM, dy: (clM.dy || 0) + land.dy, view: clM.view === 'q' || clM.view === 'side' || clM.view === 'back' ? clM.view : 'front' });
    }, { in: i === 0 ? { type: 'iris', dur: .3, x: 960, y: 156 } : { type: 'cut' } });
  });
  // 10. the finale: the star splits in two, a jumping high five, fireworks, and they wave goodbye
  const SPLIT = B(27), HI5 = B(27) + 2 * BT, END = B(29);
  add(B(27), LEN, (lt, t) => {
    stage(t, 0);
    const a = t - SPLIT;
    const jH = jump(onTwos(t), HI5 - .35, HI5 + .2, 5), meet = clamp((t - (HI5 - .35)) / .35);
    const hx = t < HI5 ? lerp(110, 146, ease(meet)) : 146 - Math.min(30, (t - HI5) * 40), kx = t < HI5 ? lerp(220, 174, ease(meet)) : 174 + Math.min(30, (t - HI5) * 40);
    HG(hx, 150, { ...F(t > HI5 ? 'happy' : 'excited', t), view: 'front', poseR: t > HI5 + .5 ? 'wave' : 'cheer', poseL: 'cheer', dy: jH.dy, sq: jH.sq });
    CL(kx, 150, { ...F(t > HI5 ? 'happy' : 'excited', t), aL: 1.4, aR: 1.4, dy: jH.dy, sq: jH.sq });
    if (a < 0.6) { starAt(160, 26 + a * 60, t, 2); flash(Math.max(0, .35 - a * 3)); }
    else { starAt(hx, 150 - 100 + jH.dy * 4, t, 1); starAt(kx, 150 - 56 + jH.dy * 4, t, 1); }
    if (t > HI5) { flash(Math.max(0, .3 - (t - HI5) * 8), '#FFF6DA'); burst(160, 60, t - HI5, 26); }
    for (let i = 0; i < 6; i++) { const ft = HI5 + .4 + i * BT; burst(40 + i * 48, 30 + (i % 2) * 20, t - ft, 22); }
    const fin = t - END; if (fin > -.2) { const r = Math.max(0, 1 - (fin + .2) / 1) * 220; for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) if ((x - 160) ** 2 + (y - 100) ** 2 > r * r) pset(x, y, '#0B0A20'); }
  }, { in: { type: 'cut' } });

  LOOPS.pxStar = () => {};
  Object.assign(LOOPS.pxStar, { len: LEN, tempo: [BPM_S, OFF_S], film: { shots: shots.sort((p, q) => p.t0 - q.t0) } });
  window.STAR_LEN = LEN;
})();
