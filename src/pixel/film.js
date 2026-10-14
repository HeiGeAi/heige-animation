// pixel/film.js: a pixel film is a list of shots, each drawn on its own logical canvas (320 × 180 wide shots,
// 160 × 90 close-ups: both blow up by a whole number to 1920 × 1080), joined by transitions done at full size:
//   cut, dissolve (a blocky Bayer dissolve), iris (a circle opening on the new shot), wipe, slide, glitch.
// A loop with loop.film = { shots, subtitle } is drawn by pxFilmFrame() instead of the usual single pass.
//   shot: { t0, t1, res: [w, h], draw(lt, t), in: { type, dur, x, y } }   (lt = time since t0; draw may call pxCam)
let FILM_TMP = null, FILM_TMPX = null, FILM_UP = null, FILM_UPX = null;
// A camera: a shot calls pxCam(x, y, z) while drawing to look at logical point (x, y) zoomed in z >= 1 times. The
// pixels are first blown up by the whole number, then that picture is scaled the last little bit smoothly, so the
// blocks stay square and even while the camera drifts (no shimmer from uneven nearest-neighbour columns).
let PX_CAM = null;
function pxCam(x, y, z = 1) { PX_CAM = { x, y, z }; }
function pxFilmShot(sh, t, ctx, clip) {
  const [pw, ph] = sh.res || [320, 180], px = Math.round(1920 / pw);
  setRes(pw, ph, px);
  BUF.fill(0); PX_TEXTS = []; PX_FX = []; PX_CAM = null;
  sh.draw(t - sh.t0, t);
  SMALLID.data.set(BUF); SMALLX.putImageData(SMALLID, 0, 0);
  if (!FILM_TMP) { FILM_TMP = document.createElement('canvas'); FILM_TMP.width = 1920; FILM_TMP.height = 1080; FILM_TMPX = FILM_TMP.getContext('2d'); }
  const c = clip ? FILM_TMPX : ctx;
  let sx = 0, sy = 0, s = px;
  if (PX_CAM && PX_CAM.z > 1.001) {
    if (!FILM_UP) { FILM_UP = document.createElement('canvas'); FILM_UP.width = 1920; FILM_UP.height = 1080; FILM_UPX = FILM_UP.getContext('2d'); }
    FILM_UPX.imageSmoothingEnabled = false; FILM_UPX.drawImage(SMALL, 0, 0, 1920, 1080);
    const vw = pw / PX_CAM.z, vh = ph / PX_CAM.z;
    sx = clamp(PX_CAM.x - vw / 2, 0, pw - vw); sy = clamp(PX_CAM.y - vh / 2, 0, ph - vh); s = 1920 / vw;
    c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
    c.drawImage(FILM_UP, sx * px, sy * px, vw * px, vh * px, 0, 0, 1920, 1080);
  } else { c.imageSmoothingEnabled = false; c.drawImage(SMALL, 0, 0, 1920, 1080); }
  pxFxFlush(c, s, sx, sy);
  pxTextFlush(c, s, sx, sy);
  if (clip) { ctx.save(); clip(ctx); ctx.drawImage(FILM_TMP, 0, 0); ctx.restore(); }
}
const BAYER8 = (() => { const m = [[0, 2], [3, 1]]; let b = m; for (let n = 2; n < 8; n *= 2) { const nb = []; for (let y = 0; y < n * 2; y++) { nb.push([]); for (let x = 0; x < n * 2; x++) nb[y].push(4 * b[y % n][x % n] + m[Math.floor(y / n)][Math.floor(x / n)]); } b = nb; } return b; })();
function pxFilmFrame(L, t) {
  const F = L.film, ctx = OUTX;
  let i = F.shots.findIndex(s => t >= s.t0 && t < s.t1); if (i < 0) i = t < F.shots[0].t0 ? 0 : F.shots.length - 1;
  const sh = F.shots[i], tr = sh.in || { type: 'cut' }, k = tr.dur ? clamp((t - sh.t0) / tr.dur) : 1;
  if (i > 0 && k < 1 && tr.type !== 'cut') {
    const prev = F.shots[i - 1], e = ease(k);
    pxFilmShot(prev, t, ctx, null);
    const clip = {
      dissolve: c => { const B = 60; c.beginPath(); for (let y = 0; y < 1080; y += B) for (let x = 0; x < 1920; x += B) if (BAYER8[(y / B) % 8][(x / B) % 8] < k * 64) c.rect(x, y, B, B); c.clip(); },
      iris: c => { c.beginPath(); c.arc(tr.x ?? 960, tr.y ?? 540, e * 1150, 0, TAU); c.clip(); },
      wipe: c => { c.beginPath(); const X = e * 2040 - 60; for (let y = 0; y < 1080; y += 60) c.rect(0, y, X - ((y / 60) % 2) * 30, 60); c.clip(); },
      glitch: c => { c.beginPath(); for (let y = 0; y < 1080; y += 36) if (hash(Math.floor(y / 36) * 7.3 + Math.floor(t * 30)) < k * 1.15) c.rect(0, y, 1920, 36); c.clip(); },
      slide: c => { c.translate(Math.round((1 - e) * 1920), 0); c.beginPath(); c.rect(0, 0, 1920, 1080); c.clip(); },
    }[tr.type] || null;
    pxFilmShot(sh, t, ctx, clip || (c => { c.beginPath(); c.rect(0, 0, 1920, 1080); c.clip(); }));
  } else pxFilmShot(sh, t, ctx, null);
  if (F.subtitle) F.subtitle(ctx, t);
}
