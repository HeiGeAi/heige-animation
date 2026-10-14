// pixel/sprites.js: Clawd and 黑哥 as pixel sprites, built part by part on the pixel grid.
// Every part is a pixel set filled with a flat colour and ringed with a 1px outline, painted back to front, so a front
// part's ring cuts cleanly across whatever is behind it. Origin = the ground point between the feet; y is negative up.

// ---------- pixel sets ----------
const K = (x, y) => (Math.round(x) + 512) * 1024 + (Math.round(y) + 512);
const KX = k => Math.floor(k / 1024) - 512, KY = k => (k % 1024) - 512;
function setEll(cx, cy, rx, ry, n = 2, s = new Set()) {
  for (let y = Math.ceil(cy - ry); y <= Math.floor(cy + ry); y++) {
    const dy = Math.abs((y - cy) / ry), dx = rx * Math.pow(Math.max(0, 1 - Math.pow(dy, n)), 1 / n);
    for (let x = Math.ceil(cx - dx - .01); x <= Math.floor(cx + dx + .01); x++) s.add(K(x, y));
  }
  return s;
}
function setRect(x, y, w, h, s = new Set()) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) s.add(K(x + i, y + j)); return s; }
function setPoly(pts, s = new Set()) {
  const ys = pts.map(p => p[1]), y0 = Math.ceil(Math.min(...ys)), y1 = Math.floor(Math.max(...ys));
  for (let y = y0; y <= y1; y++) {
    const xs = [];
    for (let i = 0; i < pts.length; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length];
      if ((ay <= y && by > y) || (by <= y && ay > y)) xs.push(ax + (y - ay) / (by - ay) * (bx - ax));
    }
    xs.sort((a, b) => a - b);
    for (let i = 0; i + 1 < xs.length; i += 2) for (let x = Math.round(xs[i]); x <= Math.round(xs[i + 1]); x++) s.add(K(x, y));
  }
  return s;
}
// a thick stroke: a w × w stamp walked along the line
function setStroke(pts, w, s = new Set()) {
  for (let i = 0; i + 1 < pts.length; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2));
    for (let j = 0; j <= n; j++) { const x = lerp(x0, x1, j / n), y = lerp(y0, y1, j / n); setRect(Math.round(x - w / 2), Math.round(y - w / 2), w, w, s); }
  }
  return s;
}
const setMinus = (a, b) => { const s = new Set(a); for (const k of b) s.delete(k); return s; };

// Fill a set into a sprite, with an optional 1px inner ring (the part's own outline).
Spr.prototype.fill = function (s, c, ring = null) {
  for (const k of s) {
    const x = KX(k), y = KY(k);
    const edge = ring && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !s.has(K(x + dx, y + dy)));
    this.m.set(k, edge ? ring : c);
  }
  return this;
};
// Recolour the pixels of `s` that currently hold one of `from` (or any colour).
Spr.prototype.tint = function (s, c, from = null) { for (const k of s) { const cur = this.m.get(k); if (cur && (!from || from.includes(cur))) this.m.set(k, c); } return this; };

// Rim light from the moon (top left): every pixel of a listed colour that sits just inside the outer outline on the lit
// side gets the rim colour, so dark clothes still read against a night sky.
Spr.prototype.rim = function (from, c, outline) {
  const hits = [];
  for (const [k, cur] of this.m) {
    if (!from.includes(cur)) continue;
    const x = KX(k), y = KY(k);
    for (const [dx, dy] of [[-1, 0], [0, -1]]) if (this.m.get(K(x + dx, y + dy)) === outline && !this.m.has(K(x + 2 * dx, y + 2 * dy))) { hits.push(k); break; }
  }
  for (const k of hits) this.m.set(k, c);
  return this;
};

// ---------- Clawd ----------
// The Claude Code mascot: a terracotta block, two tall eyes, two arm nubs, four legs. Lit from the top left.
const CP = { O: '#3A1C17', B: '#D97757', S: '#B85C3F', D: '#9A4A33', L: '#EB9273', H: '#F7BEA0', E: '#24161A', G: '#FFF1E2', M: '#5A2430' };
function clawdSprite(o = {}) {
  const sp = new Spr(), bob = o.bob || 0, wave = o.wave ?? 0;
  // legs (behind the body)
  for (const lx of [-21, -10, 5, 16]) {
    const leg = setRect(lx, -11, 5, 11);
    sp.fill(leg, CP.D, CP.O);
    sp.tint(setRect(lx + 1, -10, 1, 9), CP.S, [CP.D]);
  }
  // the body
  const body = setRect(-25, -41 + bob, 50, 31);
  sp.fill(body, CP.B, CP.O);
  sp.tint(setRect(-24, -40 + bob, 48, 2), CP.L, [CP.B]);                 // light along the top
  sp.tint(setRect(-24, -38 + bob, 2, 23), CP.L, [CP.B]);                 // and down the left side
  sp.tint(setRect(-22, -39 + bob, 6, 1), CP.H, [CP.L]);                  // a highlight in the corner
  sp.tint(setRect(-23, -37 + bob, 1, 4), CP.H, [CP.L]);
  sp.tint(setRect(21, -38 + bob, 3, 26), CP.S, [CP.B]);                  // shade down the right side
  sp.tint(setRect(-24, -15 + bob, 48, 4), CP.S, [CP.B, CP.L]);           // and along the bottom
  sp.tint(setRect(-24, -12 + bob, 48, 1), CP.D, [CP.S]);
  // arms in front of the body's edges: the left nub hangs a little, the right one is out or raised in a wave
  const armL = setRect(-31, -29 + bob, 7, 6);
  sp.fill(armL, CP.B, CP.O); sp.tint(setRect(-30, -25 + bob, 5, 1), CP.S, [CP.B]);
  // right arm: out to the side (wave < .5) or up (wave >= .5): two drawn frames, the pixel way
  const armR = wave >= .5 ? new Set([...setRect(25, -41 + bob, 6, 6), ...setRect(24, -36 + bob, 6, 7)]) : setRect(24, -31 + bob, 8, 6);
  sp.fill(armR, CP.B, CP.O);
  sp.tint(new Set([...armR].filter(k => KX(k) === (wave >= .5 ? 26 : 25))), CP.L, [CP.B]);
  // eyes: tall, dark, a glint each
  for (const ex of [-14, 10]) {
    if (o.blink) sp.fill(setRect(ex, -29 + bob, 4, 2), CP.E);
    else { sp.fill(setRect(ex, -35 + bob, 4, 10), CP.E); sp.fill(setRect(ex, -35 + bob, 2, 2), CP.G); }
  }
  if (o.smile) for (const [x, y] of [[-3, -22], [-2, -21], [-1, -21], [0, -21], [1, -21], [2, -22]]) sp.set(x, y + bob, CP.M);
  return sp;
}

// ---------- 黑哥 ----------
// From his avatar (ref/heige-avatar.jpg): a straight black cap with a crescent brim, short dark hair at the temples,
// thick brows, rounded square glasses over small oval eyes, an orange nose stroke, a smirk, big round ears, a broad
// round jaw, an open black jacket with notched lapels over a hoodie, drawstrings, charcoal trousers, pale trainers.
const HP = {
  O: '#1A1620',
  C: '#2B2831', C2: '#403C4A', C3: '#56505F', CD: '#211E27', CS: '#17141B',
  R: '#3C2C27',
  K: '#F8C29E', K2: '#ECA982', K3: '#DD8B5F', K4: '#FFDCC4', N: '#D8744B',
  J: '#26232C', J2: '#363340', J3: '#423E4C', JS: '#312E39', RIM: '#5C5672',
  Hd: '#3F3B47', Hd2: '#2C2933', HdL: '#58525F', Cd: '#A69FB5',
  P: '#3C3943', P2: '#2E2C35', Sh: '#EEE8DE', Sh2: '#C3B9AB',
};
function heigeSprite(o = {}) {
  const sp = new Spr(), wave = o.wave ?? 0;
  // ---- legs and trainers ----
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? -6 : 2;
    sp.fill(setRect(x0, -9, 5, 7), HP.P, HP.O);
    sp.tint(setRect(s < 0 ? x0 + 3 : x0 + 1, -8, 1, 5), HP.P2, [HP.P]);
    const shoe = setRect(s < 0 ? -7 : 1, -3, 7, 3);
    sp.fill(shoe, HP.Sh, HP.O);
    sp.tint(setRect(s < 0 ? -6 : 2, -2, 5, 1), HP.Sh2, [HP.Sh]);
  }
  // ---- the jacket ----
  const jacket = setPoly([[-10, -24], [-12.5, -21], [-13, -16], [-12.5, -9], [-11, -7.5], [11, -7.5], [12.5, -9], [13, -16], [12.5, -21], [10, -24]]);
  sp.fill(jacket, HP.J, HP.O);
  sp.tint(setRect(-11, -21, 4, 7), HP.J2, [HP.J]);   // light on the left shoulder
  // hoodie down the middle, with its hem
  sp.fill(setRect(-3, -22, 7, 14), HP.Hd);
  sp.tint(setRect(-3, -10, 7, 2), HP.Hd2, [HP.Hd]);
  // lapels, each with a notch, ringed
  for (const s of [-1, 1]) {
    const lap = setPoly([[s * 3.5, -23], [s * 8, -22], [s * 7, -20], [s * 9, -19], [s * 3.5, -13]]);
    sp.fill(lap, HP.J3, HP.O);
    sp.fill(setRect(s < 0 ? -4 : 4, -13, 1, 5), HP.O);   // the opening's edge below the lapel
  }
  // drawstrings
  for (const x of [-1, 2]) { sp.fill(setRect(x, -21, 1, 5), HP.Cd); sp.set(x, -16, HP.HdL); }
  // ---- the hanging left arm, in front of the jacket's side ----
  const sleeveL = setStroke([[-11, -21], [-13, -16], [-13.5, -13]], 5);
  sp.fill(sleeveL, HP.JS, HP.O);
  sp.fill(setRect(-16, -13, 5, 2), HP.Hd2, HP.O);   // hoodie cuff
  sp.fill(setEll(-13.5, -9.5, 2.2, 2.2), HP.K, HP.O);
  // ---- the hood bunched round the neck ----
  const hood = setEll(0, -24.5, 10.5, 4.2);
  sp.fill(hood, HP.Hd, HP.O);
  sp.tint(setRect(-9, -27, 19, 1), HP.HdL, [HP.Hd]);
  // ---- the neck, and the hoodie's V under it ----
  sp.fill(setRect(-3, -28, 7, 4), HP.K);
  sp.fill(setRect(-2, -24, 5, 1), HP.K); sp.fill(setRect(-1, -23, 3, 1), HP.K);
  sp.fill(setRect(-3, -28, 7, 2), HP.K3); sp.set(-3, -26, HP.K3); sp.set(-2, -26, HP.K3);   // the jaw's shadow on the neck
  for (const [x, y] of [[-4, -25], [-3, -24], [-2, -23], [-1, -22], [0, -22], [1, -22], [2, -23], [3, -24], [4, -25]]) sp.set(x, y, HP.O);
  // ---- the waving right arm, in front ----
  const elbow = [17, -19], hand = [lerp(18, 23, wave), lerp(-23, -29, wave)];
  const sleeveR = setStroke([[11, -21], elbow, hand], 5);
  sp.fill(sleeveR, HP.JS, HP.O);
  sp.fill(setEll(hand[0], hand[1] - 1.5, 2.6, 1.3), HP.Hd2, HP.O);   // cuff
  sp.fill(setEll(hand[0], hand[1] - 4, 2.6, 2.6), HP.K, HP.O);
  // ---- head: temple hair, ears, face ----
  for (const s of [-1, 1]) sp.fill(setRect(s < 0 ? -15 : 12, -51, 4, 6), HP.R, HP.O);
  for (const s of [-1, 1]) {
    const ear = setEll(s * 16, -39.5, 3.6, 4.6);
    sp.fill(ear, HP.K, HP.O);
    sp.tint(setRect(s < 0 ? -17 : 16, -36, 2, 2), HP.K2, [HP.K]);
    sp.set(s * 16, -41, HP.K3); sp.set(s * 16.8, -40, HP.K3); sp.set(s * 16.8, -39, HP.K3);
  }
  const face = setEll(0, -40.5, 13.5, 13.5, 2.35);
  sp.fill(face, HP.K, HP.O);
  sp.tint(new Set([...face].filter(k => KX(k) >= 11 && KY(k) > -46)), HP.K2, [HP.K]);    // shade on the right cheek
  sp.tint(new Set([...face].filter(k => KY(k) >= -30 && Math.abs(KX(k)) >= 4)), HP.K2, [HP.K]);   // and under the jaw
  sp.tint(setRect(-11, -36, 3, 2), HP.K4, [HP.K]);                                       // a highlight on the left cheek
  // ---- brows, glasses, eyes, nose, mouth ----
  for (const s of [-1, 1]) {
    const brow = [[s * 5, -48], [s * 6, -48], [s * 7, -48], [s * 8, -48], [s * 9, -48],
                  [s * 3, -47], [s * 4, -47], [s * 5, -47], [s * 6, -47], [s * 7, -47], [s * 8, -47], [s * 9, -47], [s * 10, -47], [s * 11, -47],
                  [s * 3, -46], [s * 11, -46]];
    for (const [x, y] of brow) sp.set(x, y, HP.O);
    // rounded square lens: 11 × 9 with 1px frame and trimmed corners
    const lx0 = s < 0 ? -12 : 2, lens = setRect(lx0, -45, 11, 9);
    for (const k of lens) {
      const x = KX(k) - lx0, y = KY(k) + 45, edge = x === 0 || x === 10 || y === 0 || y === 8;
      const corner = (x === 0 || x === 10) && (y === 0 || y === 8);
      if (corner) continue;
      if (edge) sp.m.set(k, HP.O);
    }
    for (const [x, y] of [[1, 1], [9, 1], [1, 7], [9, 7]]) sp.set(lx0 + x, -45 + y, HP.O);   // round the corners inward
    sp.set(s * 13, -43, HP.O); sp.set(s * 14, -43, HP.O);                                   // temples
    // eyes: 2 × 4, toward the nose and up a little
    const ex = s < 0 ? -7 : 6;
    if (o.blink) sp.fill(setRect(ex, -41, 2, 1), HP.O); else sp.fill(setRect(ex, -43, 2, 4), HP.O);
  }
  for (const x of [-1, 0, 1]) sp.set(x, -44, HP.O);   // bridge
  sp.fill(setRect(0, -38, 1, 3), HP.N);              // nose
  for (const [x, y] of [[-3, -33], [-2, -33], [-1, -33], [0, -33], [1, -33], [2, -33], [3, -34]]) sp.set(x, y, HP.O);   // the smirk
  // ---- the cap ----
  const crown = setEll(0, -50.5, 16.5, 16, 2.15);
  const yTop = x => -57.5 + 6.3 * (x / 15.8) ** 2, yBot = x => -52.5 + 5.4 * (x / 14) ** 2;
  for (const k of crown) if (KY(k) > yTop(KX(k)) - .5) crown.delete(k);                  // the crown stops where the brim starts
  sp.fill(crown, HP.C, HP.O);
  sp.tint(setEll(-6, -60, 6, 3.2), HP.C2, [HP.C]);                                        // light on the crown
  sp.fill(setRect(0, -64, 1, 6), HP.CS); for (const s of [-1, 1]) sp.fill(setStroke([[s * 9, -64], [s * 12.5, -60], [s * 13.5, -56]], 1), HP.CS);
  sp.fill(setRect(-2, -68, 5, 2), HP.C, HP.O);                                           // the button
  const brim = new Set();
  for (let x = -16; x <= 16; x++) for (let y = Math.round(yTop(x)); y <= Math.round(Math.max(yTop(x) + 1, Math.abs(x) <= 14 ? yBot(x) : yTop(x) + 2)); y++) brim.add(K(x, y));
  sp.fill(brim, HP.CD, HP.O);
  for (let x = -14; x <= 14; x++) sp.set(x, Math.round(yTop(x)) + 1, HP.C3);             // the brim's top surface catching light
  for (let x = -11; x <= 11; x++) sp.set(x, Math.round(yTop(x)) + 2, HP.C2);
  // shadow of the brim on the forehead
  for (let x = -12; x <= 12; x++) for (const d of [1, 2]) { const y = Math.round(yBot(x)) + d; if (d === 2 && Math.abs(x) > 8) continue; if (sp.get(x, y) === HP.K || sp.get(x, y) === HP.K2) sp.set(x, y, HP.K3); }
  if (o.rim !== false) sp.rim([HP.J, HP.J2, HP.JS, HP.C, HP.C2, HP.CD, HP.Hd, HP.P], HP.RIM, HP.O);
  return sp;
}

// ---------- sprites from a text grid ----------
// rows: strings, one character per pixel ('.' = transparent); pal: { char: '#rrggbb' }. The origin is the ground
// point between the feet: by default the bottom row's centre, so `draw(x, groundY)` stands the sprite on the ground.
function gridSprite(rows, pal, ox = null, oy = null) {
  const sp = new Spr(), h = rows.length, w = Math.max(...rows.map(r => r.length));
  ox = ox ?? Math.floor(w / 2); oy = oy ?? h;
  rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const c = pal[r[x]]; if (c) sp.set(x - ox, y - oy, c); } });
  return sp;
}
