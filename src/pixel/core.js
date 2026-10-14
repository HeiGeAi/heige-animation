// pixel/core.js: the pixel-art back end of the animation base.
//
// The world is drawn into a small buffer, PW × PH logical pixels, and blown up with hard edges to 1920×1080 (8× here).
// No p5 and no brushes: plain typed arrays and a 2D canvas, so even a full-frame sky of dithered pixels stays cheap.
// As in the painted kit, every frame is a pure function of t, and the page exposes renderAt / renderSheet / LOOPS, so
// render.mjs drives it unchanged:  node render.mjs --page=pixel.html --loop=<name> --stills=1 --out=out/x
const W = 1920, H = 1080, PW = 240, PH = 135, PS = W / PW;
const TAU = Math.PI * 2, DUR = PROJECT.duration, BEAT = 60 / PROJECT.bpm, OFF = PROJECT.offset || 0;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, x) => a + (b - a) * x;
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const seg = (t, a, b) => clamp((t - a) / (b - a));
const frac = x => x - Math.floor(x);
const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const bpOf = t => (t - OFF) / BEAT;
let T = 0;
const LOOPS = {};

// ---------- the buffer ----------
const BUF = new Uint8ClampedArray(PW * PH * 4);
const RGB = {};
const rgb = c => RGB[c] || (RGB[c] = [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]);
function pset(x, y, c) {
  x = Math.round(x); y = Math.round(y);
  if (x < 0 || y < 0 || x >= PW || y >= PH) return;
  const i = (y * PW + x) * 4, [r, g, b] = rgb(c);
  BUF[i] = r; BUF[i + 1] = g; BUF[i + 2] = b; BUF[i + 3] = 255;
}
function prect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) pset(x + i, y + j, c); }
function phline(x0, x1, y, c) { for (let x = Math.round(Math.min(x0, x1)); x <= Math.round(Math.max(x0, x1)); x++) pset(x, y, c); }
// Filled ellipse by rows, centred on a pixel or between pixels (cx, cy may be .5).
function pellipse(cx, cy, rx, ry, c) {
  for (let y = Math.ceil(cy - ry); y <= Math.floor(cy + ry); y++) {
    const dy = (y - cy) / ry, dx = rx * Math.sqrt(Math.max(0, 1 - dy * dy));
    phline(Math.ceil(cx - dx - .01), Math.floor(cx + dx + .01), y, c);
  }
}
// Bresenham line.
function pline(x0, y0, x1, y1, c) {
  x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let e = dx + dy;
  for (;;) { pset(x0, y0, c); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } }
}
// Ordered dithering between two colours: k = 0 is all a, 1 is all b. The 4×4 Bayer matrix keeps it crisp and stable.
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
const ditherPick = (x, y, a, b, k) => (BAYER[y & 3][x & 3] + .5) / 16 < k ? b : a;
// Banded colour by depth d through stops [[d0, c0], [d1, c1], ...]: solid bands, dithered only in the `tw` pixels
// before each next stop. This is how pixel artists shade: flat ramps with short dithered seams, not noise everywhere.
function bandAt(x, y, d, stops, tw = 3) {
  let i = 0; while (i + 1 < stops.length && d >= stops[i + 1][0]) i++;
  if (i + 1 < stops.length) { const next = stops[i + 1][0]; if (d > next - tw) return ditherPick(x, y, stops[i][1], stops[i + 1][1], (d - (next - tw)) / tw); }
  return stops[i][1];
}
// A vertical gradient through colour stops [[y, colour], ...], dithered between neighbouring stops.
function pvgrad(x0, x1, stops) {
  for (let s = 0; s < stops.length - 1; s++) {
    const [ya, ca] = stops[s], [yb, cb] = stops[s + 1];
    for (let y = ya; y < yb; y++) { const k = (y - ya) / (yb - ya); for (let x = x0; x <= x1; x++) pset(x, y, ditherPick(x, y, ca, cb, k)); }
  }
}

// ---------- sprites ----------
// A sprite is a sparse grid of colours around an origin (usually the ground point between the feet; y is negative up).
// Build it from flat shapes, add a selective outline around the silhouette, then blit it into the buffer.
class Spr {
  constructor() { this.m = new Map(); }
  key(x, y) { return (x + 512) * 1024 + (y + 512); }
  set(x, y, c) { if (c) this.m.set(this.key(Math.round(x), Math.round(y)), c); return this; }
  get(x, y) { return this.m.get(this.key(Math.round(x), Math.round(y))); }
  del(x, y) { this.m.delete(this.key(Math.round(x), Math.round(y))); return this; }
  rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c); return this; }
  hl(x0, x1, y, c) { for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) this.set(x, y, c); return this; }
  vl(x, y0, y1, c) { for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) this.set(x, y, c); return this; }
  line(x0, y0, x1, y1, c) {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let e = dx + dy;
    for (;;) { this.set(x0, y0, c); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } }
    return this;
  }
  // filled ellipse (rows), optional superellipse exponent n for squarer shapes
  ell(cx, cy, rx, ry, c, n = 2, rows = null) {
    for (let y = Math.ceil(cy - ry); y <= Math.floor(cy + ry); y++) {
      if (rows && (y < rows[0] || y > rows[1])) continue;
      const dy = Math.abs((y - cy) / ry), dx = rx * Math.pow(Math.max(0, 1 - Math.pow(dy, n)), 1 / n);
      this.hl(Math.ceil(cx - dx - .01), Math.floor(cx + dx + .01), y, c);
    }
    return this;
  }
  // a polygon, filled by scanlines
  poly(pts, c) {
    const ys = pts.map(p => p[1]), y0 = Math.ceil(Math.min(...ys)), y1 = Math.floor(Math.max(...ys));
    for (let y = y0; y <= y1; y++) {
      const xs = [];
      for (let i = 0; i < pts.length; i++) {
        const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length];
        if ((ay <= y + .5 && by > y + .5) || (by <= y + .5 && ay > y + .5)) xs.push(ax + (y + .5 - ay) / (by - ay) * (bx - ax));
      }
      xs.sort((a, b) => a - b);
      for (let i = 0; i + 1 < xs.length; i += 2) this.hl(Math.round(xs[i]), Math.round(xs[i + 1]) - 1, y, c);
    }
    return this;
  }
  // recolour every pixel matching `from` inside a test (x, y) => bool
  shade(test, from, to) { for (const [k, c] of this.m) { const x = Math.floor(k / 1024) - 512, y = (k % 1024) - 512; if ((!from || from.includes(c)) && test(x, y)) this.m.set(k, to); } return this; }
  // a 1px outline around the whole silhouette (4-neighbour), in `c`
  outline(c) {
    const add = [];
    for (const k of this.m.keys()) {
      const x = Math.floor(k / 1024) - 512, y = (k % 1024) - 512;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!this.m.has(this.key(x + dx, y + dy))) add.push([x + dx, y + dy]);
    }
    for (const [x, y] of add) this.set(x, y, c);
    return this;
  }
  draw(ox, oy, flip = false) {
    for (const [k, c] of this.m) { const x = Math.floor(k / 1024) - 512, y = (k % 1024) - 512; pset(ox + (flip ? -x : x), oy + y, c); }
  }
}

// ---------- frames ----------
let OUT = null, OUTX = null, SMALL = null, SMALLX = null, SMALLID = null;
function frameAt(t) {
  T = t;
  BUF.fill(0);
  if (window.LOOP) window.LOOP(t); else if (LOOPS.default) LOOPS.default(t);
  SMALLID.data.set(BUF); SMALLX.putImageData(SMALLID, 0, 0);
  OUTX.imageSmoothingEnabled = false;
  OUTX.drawImage(SMALL, 0, 0, W, H);
}
window.renderAt = async (t, type = 'image/png', q = .92) => { frameAt(t); return OUT.toDataURL(type, q); };
window.renderSheet = async (times, cols = 3, w = 640, crop = null) => {
  const [, , cw, ch] = crop || [0, 0, W, H], h = Math.round(w * ch / cw), rows = Math.ceil(times.length / cols), sc = document.createElement('canvas');
  sc.width = cols * w; sc.height = rows * h; const c = sc.getContext('2d'), ms = [];
  c.imageSmoothingEnabled = false;
  for (let i = 0; i < times.length; i++) {
    const t0 = performance.now(); frameAt(times[i]); ms.push(Math.round(performance.now() - t0));
    const x = (i % cols) * w, y = Math.floor(i / cols) * h, [cx, cy] = crop || [0, 0];
    c.drawImage(OUT, cx, cy, cw, ch, x, y, w, h);
    c.fillStyle = 'rgba(0,0,0,.65)'; c.fillRect(x, y, 84, 24); c.fillStyle = '#fff'; c.font = '15px sans-serif'; c.fillText(times[i].toFixed(2) + 's', x + 6, y + 17);
  }
  return { url: sc.toDataURL('image/jpeg', .92), ms };
};
window.gpuInfo = () => 'pixel back end (2D canvas)';
window.addEventListener('load', () => {
  OUT = document.getElementById('out'); OUTX = OUT.getContext('2d');
  SMALL = document.createElement('canvas'); SMALL.width = PW; SMALL.height = PH; SMALLX = SMALL.getContext('2d'); SMALLID = SMALLX.createImageData(PW, PH);
  const q = new URLSearchParams(location.search).get('loop'); if (q && LOOPS[q]) window.LOOP = LOOPS[q];
  window.ready = true;
  if (!location.search.includes('render')) frameAt(+(new URLSearchParams(location.search).get('t') || 0));
});
