// pixel/sprites.js: pixel sets and the still Clawd sprite (the comparison stills), built part by part on the grid.
// The acting characters are heigePx() (heige.js) and clawdPx() (clawd_px.js), on the rig in rig.js.
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

// ---------- sprites from a text grid ----------
// rows: strings, one character per pixel ('.' = transparent); pal: { char: '#rrggbb' }. The origin is the ground
// point between the feet: by default the bottom row's centre, so `draw(x, groundY)` stands the sprite on the ground.
function gridSprite(rows, pal, ox = null, oy = null) {
  const sp = new Spr(), h = rows.length, w = Math.max(...rows.map(r => r.length));
  ox = ox ?? Math.floor(w / 2); oy = oy ?? h;
  rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const c = pal[r[x]]; if (c) sp.set(x - ox, y - oy, c); } });
  return sp;
}
