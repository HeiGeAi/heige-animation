// pixel/fx2.js: the cinematic layer over a pixel film, drawn at full resolution (1920 × 1080) on top of the blown-up
// pixels: kinetic type that slams in, particle bursts (sparks, embers, coins, confetti, shards, hearts, drops), light
// rays, speed lines, bokeh in front of the lens, and a post pass over the whole frame (bloom, a chromatic split on
// every hit, a colour grade per shot, film grain, letterbox bars, white flashes). Opt in per film: K.film({ ..., post: true }).
// A shot's draw() queues things with the fx2* calls below (screen coordinates); film.js flushes them inside the shot's
// own transition clip, then runs fx2Post() once per frame before the subtitles. No green anywhere: every colour here is
// gold, red, cream, sky, pink or violet, and the bloom keeps cyan off amber.
const FX2 = { q: [], frame: { hit: 0, flash: 0, bars: 0, grade: null, bloom: .5, roll: 0 } };
const fx2Canvas = (() => { const C = {}; return (name, w, h) => { if (!C[name]) { const c = document.createElement('canvas'); c.width = w; c.height = h; C[name] = c; } return C[name]; }; })();
const fx2h = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const fx2ease = k => 1 - (1 - Math.min(1, Math.max(0, k))) ** 3;
const fx2back = k => { k = Math.min(1, Math.max(0, k)); const c = 1.9; return 1 + (c + 1) * (k - 1) ** 3 + c * (k - 1) ** 2; };
const FX2_PAL = {
  gold: ['#FFF4C2', '#FFD34E', '#E8A93A', '#8A4A12'], red: ['#FFE2DA', '#FF6A5A', '#D8243A', '#5A0A16'],
  cream: ['#FFFFFF', '#FFF1C9', '#E8D2A8', '#5A3A2C'], sky: ['#FFFFFF', '#CFF3FF', '#7FC8F0', '#1A3A6A'],
  pink: ['#FFF0F4', '#FFB0C0', '#FF6A8A', '#5A1430'], violet: ['#F4E8FF', '#D0B0FF', '#9A6AE8', '#2A1450'],
};
// per-frame knobs a shot can raise (the strongest wins when two shots overlap in a transition)
function fx2Hit(h) { FX2.frame.hit = Math.max(FX2.frame.hit, h); }
function fx2Flash(a) { FX2.frame.flash = Math.max(FX2.frame.flash, a); }
function fx2Bars(k) { FX2.frame.bars = Math.max(FX2.frame.bars, k); }
function fx2Grade(g) { FX2.frame.grade = g; }
function fx2Roll(r) { FX2.frame.roll = r; }
const fx2push = (z, draw) => FX2.q.push({ z, draw });
// a logical point of the shot being drawn -> screen pixels, through its camera (valid inside a queued draw)
function fx2S(x, y) {
  const cam = (typeof PX_CAM !== 'undefined' && PX_CAM) || { x: PW / 2, y: PH / 2, z: 1 }, z = Math.max(1, cam.z), vw = PW / z, vh = PH / z;
  const sx = Math.min(Math.max(cam.x - vw / 2, 0), PW - vw), sy = Math.min(Math.max(cam.y - vh / 2, 0), PH - vh);
  return [(x - sx) * 1920 / vw, (y - sy) * 1080 / vh];
}
const fx2P = (o, dx = 960, dy = 540) => o.at ? fx2S(o.at[0], o.at[1]) : [o.x ?? dx, o.y ?? dy];

// ---------- kinetic type ----------
// slam(text, lt, o): a word smashed onto the screen at lt = 0: scaled in from big with a little overshoot, extruded
// gold (or red, cream, sky, pink, violet) with a thick ink rim, a burst of rays behind, a shake on landing, then it
// breathes until o.out seconds and drops away. Each character lands a beat after the last when o.stagger is set.
function fx2Slam(txt, lt, o = {}) {
  if (lt < 0 || lt > (o.out ?? 99) + .35) return;
  fx2push(o.z ?? 5, c => {
    const pal = FX2_PAL[o.pal || 'gold'], size = o.size || 150, [x, y] = fx2P(o, 960, 470), inD = o.in ?? .22, st = o.stagger ?? 0;
    const gone = lt > (o.out ?? 99) ? fx2ease((lt - (o.out ?? 99)) / .3) : 0;
    c.save(); c.font = `900 ${size}px "PingFang SC", "Helvetica Neue", sans-serif`; c.textBaseline = 'middle'; c.lineJoin = 'round';
    const chars = txt.match(/[A-Za-z0-9.%]+|\s+|./gu) || [], ws = chars.map(ch => c.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0);   // a Latin word lands as one piece
    const shake = lt < inD + .25 ? (1 - (lt - inD) / .25) * size * .04 : 0, f = Math.floor(lt * 30);
    const sx = lt > inD ? (fx2h(f) - .5) * shake * 2 : 0, sy = lt > inD ? (fx2h(f + 3) - .5) * shake * 2 : 0;
    c.translate(x + sx, y + sy + gone * 120); c.rotate((o.rot ?? -.05) * (1 - gone)); c.globalAlpha = 1 - gone;
    if (o.burst !== false && lt < 1.6) {                                       // rays behind the word, fading out
      const k = Math.min(1, lt / .25), a = Math.max(0, 1 - Math.max(0, lt - .3) / 1.1) * .32;
      c.save(); c.globalCompositeOperation = 'screen'; c.filter = 'blur(6px)'; c.rotate(lt * .4);
      for (let i = 0; i < 16; i++) { const an = i / 16 * Math.PI * 2, w = .025 + .02 * fx2h(i), r = (total * .55 + 220) * k, g = c.createRadialGradient(0, 0, size * .3, 0, 0, r); g.addColorStop(0, `rgba(255,${210 + (i % 3) * 14},140,${a * (.5 + .5 * fx2h(i))})`); g.addColorStop(1, 'rgba(255,220,150,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(an - w) * r, Math.sin(an - w) * r); c.lineTo(Math.cos(an + w) * r, Math.sin(an + w) * r); c.fill(); }
      const gl = c.createRadialGradient(0, 0, 0, 0, 0, total * .6 + 120); gl.addColorStop(0, `rgba(255,230,170,${a * .9})`); gl.addColorStop(1, 'rgba(255,230,170,0)'); c.fillStyle = gl; c.fillRect(-total - 200, -total - 200, total * 2 + 400, total * 2 + 400);
      c.restore();
    }
    let cx = -total / 2;
    chars.forEach((ch, i) => {
      const l = lt - i * st, k = l / inD; if (l < 0) { cx += ws[i]; return; }
      const s = l < inD ? 2.6 - 1.6 * fx2back(k) : 1 + Math.sin(lt * 3 + i) * .012, cw = ws[i];
      c.save(); c.translate(cx + cw / 2, 0); c.scale(s, s); c.globalAlpha = (1 - gone) * Math.min(1, k * 1.6);
      const d = Math.round(size * .07);
      for (let j = d; j > 0; j--) { c.fillStyle = pal[3]; c.fillText(ch, -cw / 2 + j * .7, j); }            // extrusion
      c.lineWidth = size * .2; c.strokeStyle = '#140A10'; c.strokeText(ch, -cw / 2, 0);
      const g = c.createLinearGradient(0, -size * .45, 0, size * .45); g.addColorStop(0, pal[0]); g.addColorStop(.45, pal[1]); g.addColorStop(1, pal[2]);
      c.fillStyle = g; c.fillText(ch, -cw / 2, 0);
      c.globalCompositeOperation = 'screen'; c.globalAlpha *= .5 * Math.max(0, 1 - l / .5); c.fillStyle = '#FFFFFF'; c.fillText(ch, -cw / 2, 0);   // the landing flash
      c.restore(); cx += cw;
    });
    if (o.sub) { c.font = `800 ${Math.round(size * .32)}px "PingFang SC", sans-serif`; c.textAlign = 'center'; const a = Math.min(1, Math.max(0, (lt - inD - .1) / .2)); c.globalAlpha = a * (1 - gone); c.lineWidth = 10; c.strokeStyle = '#140A10'; c.strokeText(o.sub, 0, size * .78); c.fillStyle = FX2_PAL[o.subPal || 'cream'][1]; c.fillText(o.sub, 0, size * .78); }
    c.restore();
  });
  if (lt < inDur(o) + .12 && lt > inDur(o) - .02) { fx2Hit(o.hit ?? .8); if (o.flash) fx2Flash(o.flash); }
}
const inDur = o => o.in ?? .22;

// ---------- particles ----------
// burst(kind, lt, o): n particles thrown from (x, y) at lt = 0 (screen pixels), deterministic from o.seed.
// kinds: spark (streaks with a glow), ember (rising, flickering), coin, confetti, shard, heart, drop, dust, star
function fx2Burst(kind, lt, o = {}) {
  const life = o.life ?? 1.6; if (lt < 0 || lt > life + (o.spread ?? 0)) return;
  fx2push(o.z ?? 4, c => {
    const n = o.n ?? 40, [x0, y0] = fx2P(o), sp = o.speed ?? 900, g = o.gravity ?? (kind === 'ember' ? -120 : kind === 'dust' ? 40 : 1400), seed = o.seed ?? 1;
    c.save();
    for (let i = 0; i < n; i++) {
      const h = fx2h(i + seed * 37), h2 = fx2h(i * 3 + seed), h3 = fx2h(i * 7 + seed * 5);
      const l = lt - h3 * (o.spread ?? 0); if (l < 0 || l > life) continue;
      const an = (o.dir ?? -Math.PI / 2) + (h - .5) * (o.arc ?? Math.PI * 2), v = sp * (.35 + .65 * h2), drag = Math.exp(-l * (o.drag ?? 1.6));
      const dist = v * (1 - drag) / (o.drag ?? 1.6), x = x0 + Math.cos(an) * dist + (o.w ?? 0) * (h3 - .5), y = y0 + Math.sin(an) * dist + .5 * g * l * l + (o.h ?? 0) * (h2 - .5);
      const fade = 1 - l / life;
      if (kind === 'spark') { const vx = Math.cos(an) * v * drag, vy = Math.sin(an) * v * drag + g * l; c.globalCompositeOperation = 'lighter'; c.strokeStyle = `rgba(255,${190 + h * 60},${90 + h2 * 80},${fade})`; c.lineWidth = 3 + h * 3; c.beginPath(); c.moveTo(x, y); c.lineTo(x - vx * .035, y - vy * .035); c.stroke(); c.fillStyle = `rgba(255,230,160,${fade * .25})`; c.beginPath(); c.arc(x, y, 10, 0, 7); c.fill(); }
      else if (kind === 'ember') { const fl = .5 + .5 * Math.sin(lt * 20 + i); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,${120 + 80 * fl},60,${fade * (.5 + .5 * fl)})`; const r = 3 + h * 5; c.fillRect(Math.round(x + Math.sin(l * 3 + i) * 20), Math.round(y), r, r); }
      else if (kind === 'coin') { const sq = Math.abs(Math.cos(l * 9 + i)); c.globalAlpha = Math.min(1, fade * 2); c.fillStyle = '#8A4A12'; c.fillRect(x - 15 * sq - 3, y - 15, 30 * sq + 6, 30); c.fillStyle = '#E8A93A'; c.fillRect(x - 15 * sq, y - 15, 30 * sq, 30); c.fillStyle = '#FFE27A'; c.fillRect(x - 15 * sq + 4, y - 11, 6 * sq, 18); }
      else if (kind === 'confetti') { const cols = o.cols || ['#FFD34E', '#FF6A5A', '#FFF1C9', '#9BE3F7', '#FF8CB0', '#C0A0FF']; c.save(); c.translate(x, y); c.rotate(l * 8 * (h - .5) + i); c.scale(1, Math.cos(l * 10 + i)); c.globalAlpha = Math.min(1, fade * 2); c.fillStyle = cols[i % cols.length]; c.fillRect(-10, -5, 20, 10); c.restore(); }
      else if (kind === 'shard') { c.save(); c.translate(x, y); c.rotate(l * 6 * (h - .5)); c.globalAlpha = fade; c.fillStyle = o.col || '#FFF1C9'; c.beginPath(); c.moveTo(0, -18 * h2 - 6); c.lineTo(12 * h, 8); c.lineTo(-10, 6); c.fill(); c.restore(); }
      else if (kind === 'heart') { c.globalAlpha = Math.min(1, fade * 2); c.fillStyle = '#FF5A7A'; const s = 6 + h * 6; c.beginPath(); c.arc(x - s / 2, y, s / 1.6, Math.PI, 0); c.arc(x + s / 2, y, s / 1.6, Math.PI, 0); c.lineTo(x, y + s * 1.4); c.fill(); }
      else if (kind === 'drop') { c.globalAlpha = fade; c.fillStyle = o.col || '#BEEBFF'; c.beginPath(); c.ellipse(x, y, 5, 9, 0, 0, 7); c.fill(); }
      else if (kind === 'dust') { c.globalAlpha = fade * .6; c.fillStyle = o.col || '#E8D2A8'; c.beginPath(); c.arc(x, y, 14 + 40 * (1 - drag) * h, 0, 7); c.fill(); }
      else if (kind === 'star') { c.globalCompositeOperation = 'lighter'; c.globalAlpha = fade; c.fillStyle = '#FFE9A0'; const s = 6 + 10 * h; c.beginPath(); for (let k = 0; k < 8; k++) { const r = k % 2 ? s * .35 : s, a = k * Math.PI / 4 + l * 3; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.fill(); }
    }
    c.restore();
  });
}
// a steady stream: embers off a fire, rain, falling coins, snow of confetti; drawn every frame, looping
function fx2Stream(kind, t, o = {}) {
  fx2push(o.z ?? 3, c => {
    const n = o.n ?? 40, W = 1920, H = 1080, sp = o.speed ?? 1;
    if (o.at) [o.x, o.y] = fx2S(o.at[0], o.at[1]);
    c.save();
    for (let i = 0; i < n; i++) {
      const h = fx2h(i + 7), h2 = fx2h(i * 5 + 3), ph = (t * sp * (.5 + h2) + h) % 1;
      if (kind === 'rain') { const x = (h * W * 1.2 + ph * 240) % (W + 200) - 100, y = ph * (H + 200) - 100; c.strokeStyle = `rgba(190,215,255,${.25 + .35 * h2})`; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 18, y - 60); c.stroke(); }
      else if (kind === 'ember') { const x = (o.x ?? 960) + (h - .5) * (o.w ?? 1400) + Math.sin(t * 2 + i) * 30, y = (o.y ?? 1000) - ph * (o.h ?? 900), fl = .5 + .5 * Math.sin(t * 17 + i * 3); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,${110 + 90 * fl},50,${(1 - ph) * (.4 + .6 * fl)})`; const r = 3 + h2 * 6; c.fillRect(Math.round(x), Math.round(y), r, r); }
      else if (kind === 'coin') { const x = h * W, y = ph * (H + 100) - 60, sq = Math.abs(Math.cos(t * 6 + i)); c.fillStyle = '#8A4A12'; c.fillRect(x - 13 * sq - 3, y - 13, 26 * sq + 6, 26); c.fillStyle = '#E8A93A'; c.fillRect(x - 13 * sq, y - 13, 26 * sq, 26); c.fillStyle = '#FFE27A'; c.fillRect(x - 13 * sq + 3, y - 9, 5 * sq, 15); }
      else if (kind === 'confetti') { const cols = ['#FFD34E', '#FF6A5A', '#FFF1C9', '#9BE3F7', '#FF8CB0', '#C0A0FF'], x = h * W + Math.sin(t * 2 + i) * 40, y = ph * (H + 100) - 60; c.save(); c.translate(x, y); c.rotate(t * 3 * (h - .5) + i); c.scale(1, Math.cos(t * 7 + i)); c.fillStyle = cols[i % 6]; c.fillRect(-9, -4, 18, 8); c.restore(); }
      else if (kind === 'heart') { const x = (o.x ?? 960) + (h - .5) * (o.w ?? 900), y = (o.y ?? 900) - ph * (o.h ?? 700), s = 8 + h2 * 10; c.globalAlpha = 1 - ph; c.fillStyle = '#FF5A7A'; c.beginPath(); c.arc(x - s / 2, y, s / 1.6, Math.PI, 0); c.arc(x + s / 2, y, s / 1.6, Math.PI, 0); c.lineTo(x, y + s * 1.4); c.fill(); c.globalAlpha = 1; }
      else if (kind === 'spark') { const x = (o.x ?? 960) + (h - .5) * (o.w ?? 200), y = (o.y ?? 540) - ph * (o.h ?? 300), fl = Math.sin(t * 30 + i) > 0; if (fl) { c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,236,170,${1 - ph})`; c.fillRect(x, y, 4, 4); } }
    }
    c.restore();
  });
}

// ---------- light and motion ----------
// god rays from (x, y), turning slowly; col a cream, gold, pink or violet; a = strength
function fx2Rays(x, y, t, o = {}) {
  fx2push(o.z ?? 1, c => {
    if (Array.isArray(x)) [x, y] = fx2S(x[0], x[1]);
    c.save(); c.globalCompositeOperation = 'screen'; c.filter = 'blur(10px)'; c.translate(x, y); c.rotate(t * (o.spin ?? .08));
    const n = o.n ?? 14, r = o.r ?? 1600, col = o.col || [255, 220, 150], a = o.a ?? .22;
    for (let i = 0; i < n; i++) { const an = i / n * Math.PI * 2 + fx2h(i) * .3, w = .05 + fx2h(i + 9) * .07, g = c.createRadialGradient(0, 0, 0, 0, 0, r); g.addColorStop(0, `rgba(${col},${a * (.5 + .5 * Math.sin(t * 1.3 + i))})`); g.addColorStop(1, `rgba(${col},0)`); c.fillStyle = g; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(an - w) * r, Math.sin(an - w) * r); c.lineTo(Math.cos(an + w) * r, Math.sin(an + w) * r); c.fill(); }
    c.restore();
  });
}
// manga speed lines rushing into (x, y): k = strength 0..1
function fx2Speed(x, y, t, k = 1, o = {}) {
  if (k <= 0) return;
  fx2push(o.z ?? 6, c => {
    if (Array.isArray(x)) [x, y] = fx2S(x[0], x[1]);
    c.save(); const n = o.n ?? 36, f = Math.floor(t * 12);
    for (let i = 0; i < n; i++) { const an = fx2h(i + f * 13) * Math.PI * 2, r0 = 620 + fx2h(i * 3 + f) * 260, r1 = r0 + 260 + fx2h(i + 5 + f) * 700; c.strokeStyle = o.col || `rgba(255,248,230,${.32 * k})`; c.lineWidth = 2 + fx2h(i + f * 2) * 4; c.beginPath(); c.moveTo(x + Math.cos(an) * r0, y + Math.sin(an) * r0 * .7); c.lineTo(x + Math.cos(an) * r1, y + Math.sin(an) * r1 * .7); c.stroke(); }
    c.restore();
  });
}
// horizontal motion streaks (a whoosh, wind, a fast run): dir 1 to the right
function fx2Streaks(t, k = 1, o = {}) {
  if (k <= 0) return;
  fx2push(o.z ?? 6, c => { c.save(); const n = o.n ?? 30; for (let i = 0; i < n; i++) { const y = fx2h(i) * 1080, len = 200 + fx2h(i + 1) * 600, x = ((fx2h(i + 2) * 3000 + t * (o.speed ?? 2600) * (o.dir ?? -1)) % 3000 + 3000) % 3000 - 500; c.fillStyle = o.col || `rgba(255,245,220,${.18 * k + .2 * k * fx2h(i + 3)})`; c.fillRect(x, y, len, 2 + fx2h(i + 4) * 4); } c.restore(); });
}
// bokeh: soft discs of light drifting in front of the lens, moving against the camera for depth
function fx2Bokeh(t, o = {}) {
  fx2push(o.z ?? 7, c => {
    const n = o.n ?? 14, cam = (typeof PX_CAM !== 'undefined' && PX_CAM) ? PX_CAM : { x: 160, y: 90, z: 1 }, cols = o.cols || ['255,214,140', '255,170,140', '255,240,210'];
    c.save(); c.globalCompositeOperation = 'screen';
    for (let i = 0; i < n; i++) { const h = fx2h(i + 21), d = .6 + fx2h(i + 3) * 1.4, x = ((h * 2400 - cam.x * 6 * d * (o.par ?? 1) + t * 22 * d) % 2400 + 2400) % 2400 - 240, y = fx2h(i + 8) * 1080 + Math.sin(t * .6 + i) * 30 - cam.y * 2 * d * (o.par ?? 1), r = 30 + 70 * d * fx2h(i + 1), g = c.createRadialGradient(x, y, r * .55, x, y, r); g.addColorStop(0, `rgba(${cols[i % cols.length]},${(o.a ?? .16) * (.6 + .4 * Math.sin(t + i))})`); g.addColorStop(1, `rgba(${cols[i % cols.length]},0)`); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); }
    c.restore();
  });
}
// a light sweep across a band (a shine passing over gold): x0..x1 in screen pixels, k = 0..1 position
function fx2Shine(x0, y0, x1, y1, k, o = {}) {
  if (k <= 0 || k >= 1) return;
  fx2push(o.z ?? 5, c => { c.save(); c.beginPath(); c.rect(x0, y0, x1 - x0, y1 - y0); c.clip(); c.globalCompositeOperation = 'screen'; const x = x0 + (x1 - x0 + 400) * k - 200, g = c.createLinearGradient(x - 120, 0, x + 120, 0); g.addColorStop(0, 'rgba(255,250,230,0)'); g.addColorStop(.5, `rgba(255,250,230,${o.a ?? .7})`); g.addColorStop(1, 'rgba(255,250,230,0)'); c.fillStyle = g; c.setTransform(1, 0, -.4, 1, (y0 + y1) / 2 * .4, 0); c.fillRect(x - 200, y0, 400, y1 - y0); c.restore(); });
}
// a ring shockwave expanding from (x, y)
function fx2Ring(x, y, lt, o = {}) {
  if (lt < 0 || lt > (o.life ?? .6)) return;
  fx2push(o.z ?? 5, c => { if (Array.isArray(x)) [x, y] = fx2S(x[0], x[1]); const k = lt / (o.life ?? .6), r = (o.r ?? 600) * fx2ease(k); c.save(); c.globalCompositeOperation = 'screen'; c.strokeStyle = `rgba(${o.col || '255,236,190'},${(1 - k) * .8})`; c.lineWidth = 30 * (1 - k) + 4; c.beginPath(); c.ellipse(x, y, r, r * (o.flat ?? 1), 0, 0, 7); c.stroke(); c.restore(); });
}

// ---------- flush and post ----------
function fx2Flush(c) { FX2.q.sort((a, b) => a.z - b.z); for (const it of FX2.q) { c.save(); it.draw(c); c.restore(); } FX2.q = []; }
const FX2_GRADES = {
  warm: [[255, 170, 90, .16], [70, 20, 50, .22]], fire: [[255, 110, 50, .24], [60, 8, 12, .3]], night: [[90, 80, 200, .2], [10, 6, 30, .3]],
  cold: [[150, 170, 230, .2], [20, 20, 50, .3]], dream: [[255, 140, 200, .2], [60, 20, 90, .22]], gold: [[255, 210, 110, .2], [70, 30, 10, .2]],
  noir: [[200, 190, 200, .1], [0, 0, 0, .35]], neon: [[200, 90, 255, .18], [20, 0, 40, .3]],
};
let FX2_GRAIN = null;
function fx2Post(ctx, t) {
  const F = FX2.frame, W = 1920, H = 1080, cv = ctx.canvas;
  if (F.grade && FX2_GRADES[F.grade]) {                                     // a two-tone grade: tint the lights, deepen the darks
    const [hi, lo] = FX2_GRADES[F.grade]; ctx.save();
    ctx.globalCompositeOperation = 'soft-light'; const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, `rgba(${hi[0]},${hi[1]},${hi[2]},${hi[3] * 1.5})`); g.addColorStop(1, `rgba(${lo[0]},${lo[1]},${lo[2]},${lo[3] * 1.5})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = `rgba(${lo[0] + 120},${lo[1] + 110},${lo[2] + 120},${lo[3] * .6})`; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
  if (F.bloom > 0) {                                                        // bloom: the brights, blurred, screened back on
    const b = fx2Canvas('bloom', 480, 270), bx = b.getContext('2d');
    bx.clearRect(0, 0, 480, 270); bx.filter = 'brightness(.62) contrast(3.4) saturate(1.25) blur(7px)'; bx.drawImage(cv, 0, 0, 480, 270); bx.filter = 'none';
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = F.bloom; ctx.imageSmoothingEnabled = true; ctx.drawImage(b, 0, 0, W, H); ctx.restore();
  }
  if (F.hit > .03) {                                                        // an impact ghost: the frame punched outward once, warm-tinted
    const tmp = fx2Canvas('ca', W, H), tx = tmp.getContext('2d'); tx.globalCompositeOperation = 'copy'; tx.drawImage(cv, 0, 0);
    tx.globalCompositeOperation = 'multiply'; tx.fillStyle = '#FF7A6A'; tx.fillRect(0, 0, W, H);
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = Math.min(.25, F.hit * .3); const m = 1 + F.hit * .045;
    ctx.translate(960, 540); ctx.scale(m, m); ctx.translate(-960, -540); ctx.drawImage(tmp, 0, 0); ctx.restore();
  }
  if (!FX2_GRAIN) { FX2_GRAIN = [0, 1, 2, 3].map(s => { const g = document.createElement('canvas'); g.width = 480; g.height = 270; const gx = g.getContext('2d'), id = gx.createImageData(480, 270); for (let i = 0; i < id.data.length; i += 4) { const v = 128 + (fx2h(i * .37 + s * 999) - .5) * 120; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; } gx.putImageData(id, 0, 0); return g; }); }
  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = .07; ctx.imageSmoothingEnabled = false; ctx.drawImage(FX2_GRAIN[Math.floor(t * 24) % 4], 0, 0, W, H); ctx.restore();
  if (F.bars > 0) { const h = Math.round(F.bars * 120); ctx.fillStyle = '#05030A'; ctx.fillRect(0, 0, W, h); ctx.fillRect(0, H - h, W, h); }
  if (F.flash > 0) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = `rgba(255,248,235,${Math.min(1, F.flash)})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  FX2.frame = { hit: 0, flash: 0, bars: 0, grade: null, bloom: .4, roll: 0 };
}
