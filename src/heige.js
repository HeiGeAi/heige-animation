// heige.js: 黑哥 (HeiGe), the host of 问问黑哥, painted in watercolour and ink on Clawd's rig.
//
// heige(x, y, u, o) takes the same options as clawd(), so feel(), emotions(), move(), turn(), jump(), take(), stroll()
// and spring() drive him unchanged:
//   heige(960, 900, 24, { ...emotions(t, [[0, 'neutral'], [1.2, 'surprised']]), ...turn(t, 2, 2.2, 0, .25) })
//
// The design is the 日系 Q版 comic 黑哥 (IP/模型角色/黑哥漫画形象), cut down to a few painted shapes: a black baseball cap
// worn with the brim off to one side and a white bunny on the front, messy black hair, thick black square glasses over
// big eyes, a soft round face, an oversized hoodie with a white bunny on the chest, a blue lanyard and work badge,
// charcoal cargo trousers and pale trainers.
//
// Body-local coordinates in the front view (u units, y negative upward, (0, 0) = the ground point between the feet):
//   cap top -12.1u, cap band -10u, face centre (0, -7.95u) and ±3u wide, lens centres (±1.35u, -8.05u), brows -9.2u,
//   mouth (0, -6.45u), chin -5.25u, shoulders (±2.15u, -5.05u), hoodie hem -1.95u, feet on y 0. About 7u wide and 12u
//   tall, so u 18-24 is a medium shot and 40+ a close-up.
//   o.draw(u, sw) paints in this space on top of everything; o.armL / o.armR are called at the hands, in hand space.
//
// Options on top of clawd()'s:
//   bendL / bendR: elbow bend in radians (+ folds the forearm in toward the body); reachL / reachR: forearm length scale
//   frontArm: 'L' | 'R' draws that arm over the face (a hand on the chin, pushing the glasses up)
//   capPop 0..1: the cap jumps off his head (furious sets it through lid); noBadge, noCap, noGlasses
//   rawArms: aL / aR are his own shoulder angles instead of clawd()'s arm parameter

const HG = {
  skin: '#F7DCC4', skinDk: '#E5B193', skinLt: '#FFF3E6',
  hair: '#29242F', hairLt: '#565061',
  cap: '#2E2A34', capDk: '#211E26', capLt: '#6A6478',
  hood: '#403C49', hoodDk: '#2D2A33', hoodLt: '#8C85A6',
  pants: '#4D4955', pantsDk: '#3B3842',
  shoe: '#F6F0E6', sole: '#CFC6B9',
  lanyard: '#3D63C9', badge: '#FBF7EF',
  bunny: '#FFF9F0', blush: '#F2939A',
};
// No green in 黑哥's world: disgust turns his face a sickly lavender instead.
const HG_TINT = { ...TINT, green: '#B6A8CC' };

// clawd()'s arm parameter (0 = straight out, + up, - down) → 黑哥's shoulder angle. Clawd's arms are stubby nubs that
// rest slightly raised; a person's arms rest hanging down, so the bottom of the range is squeezed and the top stretched.
const hgArm = a => a <= .2 ? -1.14 + (a - .2) * .3 : -1.14 + (a - .2) * 1.95;

// Poses an emotion needs that Clawd's nubs can't do: a hand on the chin, hands on the hips. They replace the emotion's
// own arm values; pass noPose: true to keep the scene's arms instead.
const HG_EMO_POSE = {
  thinking: { frontArm: 'R', aR: .05, bendR: 2.6, reachR: 1.6 },
  proud:    { aL: .55, aR: .55, bendL: 2.3, bendR: 2.3, reachL: .75, reachR: .75 },
  shy:      { aL: -.2, aR: -.2, bendL: 1.25, bendR: 1.25 },
  bored:    { bendL: .35, bendR: .35 },
};

// Face colour for the mood. emotions() cross-fades tints through o.tintFade; feel() sets tint directly.
function hgSkin(o) {
  const one = (tn, tk) => {
    const tc = tn && (HG_TINT[tn] || tn), k = clamp(tk ?? 1);
    return !tc || k <= 0 ? [HG.skin, HG.skinDk] : [mixCol(HG.skin, tc, .42 * k), mixCol(HG.skinDk, mixCol(tc, PAL.ink, .25), .38 * k)];
  };
  if (o.tintFade) { const f = o.tintFade, A = one(f.a, f.ak), B = one(f.b, f.bk); return [mixCol(A[0], B[0], f.k), mixCol(A[1], B[1], f.k)]; }
  return one(o.tint, o.tintK);
}

// ---------- views ----------
// face: where the features go (centre x and horizontal squeeze; sides = which lenses show). ears: x of each ear.
// bw: hoodie width. logo: [x, squeeze] of the chest bunny. arms: [pivotX, dir, which, layer] (layer 1 = in front of the
// body, 2 = behind it and in shadow). legs: [x, far]. back: no face. Every view faces screen-right; flip: true mirrors it.
const HVIEWS = {
  front: { face: { cx: 0, fw: 1, sides: [-1, 1] }, ears: [-2.95, 2.95], bw: 1, logo: [1.05, 1],
           arms: [[-1.85, -1, 'L', 1], [1.85, 1, 'R', 1]], legs: [[-.72, 0], [.72, 0]] },
  q:     { face: { cx: .8, fw: .8, sides: [-1, 1] }, ears: [-2.7], bw: .93, logo: [1.55, .75],
           arms: [[1.7, 1, 'R', 2], [-1.75, -1, 'L', 1]], legs: [[-.55, 0], [.85, 1]] },
  side:  { face: { cx: 1.7, fw: .52, sides: [1] }, ears: [-.05], bw: .74, logo: null,
           arms: [[-.15, 0, 'L', 1]], legs: [[-.3, 1], [.3, 0]] },
  qback: { face: null, ears: [2.7], bw: .93, logo: null, back: true,
           arms: [[-1.7, -1, 'R', 2], [1.75, 1, 'L', 1]], legs: [[.55, 0], [-.85, 1]] },
  back:  { face: null, ears: [-2.95, 2.95], bw: 1, logo: null, back: true,
           arms: [[-1.85, -1, 'R', 1], [1.85, 1, 'L', 1]], legs: [[-.72, 0], [.72, 0]] },
};

// ---------- 黑哥 ----------
function heige(x, y, u, o = {}) {
  if (o.emo && HG_EMO_POSE[o.emo] && !o.noPose) o = { ...o, ...HG_EMO_POSE[o.emo] };   // noPose: keep the scene's own arms
  const id = o.boilKey ?? ++CLAWD_N, rs = part => boilSeed(`heige ${id} ${part}`);
  x += (o.dx || 0) * u;
  const vname = HVIEWS[o.view] ? o.view : 'front', V = HVIEWS[vname];
  const dy = (o.dy || 0) * u, sq = (o.sq || 0) + (o.take || 0), sm = clamp(o.smear || 0);
  const sw = clamp(u / 15, .45, 2.4) * (o.swMul || 1);
  const [skin, skinDk] = hgSkin(o);
  const capPop = clamp(o.capPop ?? (o.lid ? o.lid * 2.6 : 0));

  rs('shadow');
  if (!o.noShadow) {
    const f = 1 - Math.min(.5, Math.abs(o.dy || 0) * .06);
    paint(ellPts(x, y + u * .12, u * 3.6 * f * (vname === 'side' ? .8 : 1), u * .72 * f, 22), { fill: PAL.ink, fillOp: 90, bleed: .25, tex: .3, border: .1, ink: null });
  }
  if (sm > .05) hgSmear(x, y + dy, u, sm, o.smearDir ?? (o.flip ? -1 : 1));

  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (o.sx ?? 1) * (1 + sq * .6) * (1 + sm * .3), (o.sy ?? 1) * (1 - sq));

  const arm = ([px, dir, which, layer]) => {
    rs('arm' + which);
    const raw = which === 'L' ? (o.aL ?? .2) : (o.aR ?? .2), hook = which === 'L' ? o.armL : o.armR;
    const a = o.rawArms ? raw : hgArm(raw), shade = layer === 2;
    const bend = (which === 'L' ? o.bendL : o.bendR) ?? .25, reach = (which === 'L' ? o.reachL : o.reachR) ?? 1;
    const col = shade ? mixCol(HG.hood, HG.hoodDk, .75) : HG.hood, hand = shade ? mixCol(skin, PAL.ink, .22) : skin;
    push(); translate(px * u, -4.95 * u);
    if (dir === 0) {   // side view: the near arm swings forward and back; a > rest lifts it forward
      rotate(Math.PI / 2 - (a + 1.14) * .95);
      hgSleeve(u, sw, col, hand, -bend, reach, hook);
    } else {
      rotate(dir < 0 ? a : -a);
      if (dir < 0) scale(-1, 1);
      hgSleeve(u, sw, col, hand, bend, reach, hook);
    }
    pop();
  };

  // far arms, legs, body, lanyard, near arms, head, an arm over the face, then hooks
  V.arms.filter(a => a[3] === 2).forEach(arm);
  if (!o.noLegs) hgLegs(u, sw, V, vname, o, rs);
  rs('body'); hgBody(u, sw, V, vname);
  if (!o.noBadge && !V.back && vname !== 'side') { rs('badge'); hgBadge(u, sw, vname); }
  V.arms.filter(a => a[3] === 1 && a[2] !== o.frontArm).forEach(arm);
  rs('head'); hgHead(u, sw, V, vname, o, skin, skinDk, capPop, rs);
  V.arms.filter(a => a[3] !== 2 && a[2] === o.frontArm).forEach(arm);
  rs('draw'); if (o.draw) o.draw(u, sw);
  pop();

  rs('emote');
  if (o.emote) {
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1;
    const ex = top ? x + dir * .3 * u : x + dir * 3.9 * u, ey = y + dy + (top ? -13.2 : -10.9) * u * (1 - sq);
    emote(o.emote, ex, ey, u * .9, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// A sleeve from the shoulder (0, 0) out along +x, bending at the elbow (+bend folds the forearm toward +y, which is in
// toward the body for both arms), then a ribbed cuff and a round hand. The root has no outline, so the sleeve grows out
// of the hoodie instead of looking glued on.
function hgSleeve(u, sw, col, skin, bend, reach, hook) {
  const A = 1.2 * u, B = 1.1 * u * reach, c = Math.cos(bend), s = Math.sin(bend);
  const E = [A, .03 * u], Hd = [E[0] + c * B, E[1] + s * B];
  const path = [[-.3 * u, 0], [A * .55, .05 * u], E, [E[0] + c * B * .55, E[1] + s * B * .55], Hd];
  const rib = ribbon(path, .98 * u, .7 * u), n = rib.length / 2;
  paint(rib, { wash: col, washOp: 255, fill: HG.hoodLt, fillOp: 28, tex: .5, ink: null });
  inkLine(rib.slice(2, n), sw * .85, PAL.ink, 'ink', .4);
  inkLine(rib.slice(n, rib.length - 2), sw * .85, PAL.ink, 'ink', .4);
  push(); translate(Hd[0], Hd[1]); rotate(bend);
  paint(rrPts(-.12 * u, -.37 * u, .32 * u, .74 * u, .11 * u), { wash: mixCol(col, HG.hoodDk, .5), washOp: 255, ink: PAL.ink, sw: sw * .6 });
  paint(ellPts(.5 * u, 0, .39 * u, .36 * u, 14), { wash: skin, washOp: 255, ink: PAL.ink, sw: sw * .7 });
  if (hook) { push(); translate(.5 * u, 0); hook(u, sw); pop(); }
  pop();
}

function hgLegs(u, sw, V, vname, o, rs) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]);
  V.legs.forEach(([lx, far], i) => {
    rs('leg' + i);
    let lift = 0, sx = 0;
    if (o.walk != null) {
      if (vname === 'side') { const ph = (o.walk + i * .5) * TAU; sx = Math.sin(ph) * .75; lift = Math.max(0, Math.cos(ph)) * .45; }
      else { const ph = Math.sin((o.walk + i * .5) * TAU); if (ph > 0) lift = ph * .55; }
    }
    const x0 = lx + sx, top = -2.2, bot = -.55 - lift;
    const pc = far ? HG.pantsDk : HG.pants;
    paint(P([[x0 - .5, top], [x0 + .5, top], [x0 + .45, bot], [x0 - .45, bot]]), { wash: pc, washOp: 255, ink: PAL.ink, sw: sw * .75 });
    if (!far && vname !== 'back' && vname !== 'qback') {   // cargo pocket flap on the outside of the thigh
      const sd = vname === 'side' ? 1 : Math.sign(lx) || 1, px = x0 + sd * .16;
      paint(P([[px - .26, -1.8], [px + .26, -1.8], [px + .26, -1.32], [px - .26, -1.32]]), { wash: mixCol(pc, HG.pantsDk, .6), washOp: 255, ink: PAL.ink, sw: sw * .4 });
    }
    // trainer: pointing at the camera in front views and forward in the side view
    const toe = vname === 'side' ? .55 : vname === 'q' ? .25 : vname === 'qback' ? -.25 : 0;
    const shoeW = vname === 'side' ? 1.55 : 1.25, cx = x0 + toe * .5, cy = bot - .02;
    paint(rrPts((cx - shoeW / 2) * u, (cy - .02) * u, shoeW * u, .6 * u, .3 * u), { wash: far ? mixCol(HG.shoe, HG.sole, .6) : HG.shoe, washOp: 255, ink: PAL.ink, sw: sw * .7 });
    inkLine(P([[cx - shoeW / 2 + .12, cy + .4], [cx + shoeW / 2 - .12, cy + .4]]), sw * .4, HG.sole, 'inkfine', 0);
  });
}

function hgBody(u, sw, V, vname) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]), w = V.bw, J = u * .04;
  if (vname !== 'back' && vname !== 'qback') {   // the hood, bunched behind the neck
    const hx = vname === 'side' ? -1.15 : vname === 'q' ? -.45 : 0;
    paint(ellPts(hx * u, -5.55 * u, 1.9 * u * w, .7 * u, 20, J), { wash: HG.hoodDk, washOp: 255, ink: PAL.ink, sw: sw * .7 });
  }
  let body;
  if (vname === 'side') body = P([[-1.7, -5.45], [-1.95, -4.4], [-2.1, -3.1], [-2.05, -2.15], [-1.9, -1.95], [1.9, -1.95], [2.15, -2.3], [2.25, -3.1], [2.0, -4.3], [1.45, -5.4], [.2, -5.75]]);
  else {
    const L = vname === 'q' ? .93 : vname === 'qback' ? 1.04 : 1, R = vname === 'q' ? 1.04 : vname === 'qback' ? .93 : 1;
    body = P([[-1.75 * w * L, -5.48], [-2.15 * w * L, -5.0], [-2.42 * w * L, -4.1], [-2.58 * w * L, -3.1], [-2.55 * w * L, -2.25], [-2.4 * w * L, -1.95],
              [2.4 * w * R, -1.95], [2.55 * w * R, -2.25], [2.58 * w * R, -3.1], [2.42 * w * R, -4.1], [2.15 * w * R, -5.0], [1.75 * w * R, -5.48], [.85 * w, -5.82], [-.85 * w, -5.82]]);
  }
  paint(body, { wash: HG.hood, washOp: 255, ink: null, curv: .5 });
  // soft light across the chest and a darker hem band, in watercolour
  const lx = vname === 'side' ? .3 : vname === 'q' ? .45 : vname === 'qback' ? -.45 : -.5;
  paint(ellPts(lx * u, -4.55 * u, 1.65 * u * w, .85 * u, 18, J * 2, -.1), { fill: HG.hoodLt, fillOp: 100, bleed: .22, tex: .8, border: .7, ink: null });
  const hl = vname === 'side' ? -2.0 : -2.48 * w, hr = vname === 'side' ? 2.15 : 2.48 * w;
  paint(P([[hl, -2.0], [hr, -2.0], [hr * .98, -2.42], [hl * .98, -2.42]]), { fill: HG.hoodDk, fillOp: 140, bleed: .03, tex: .6, border: .5, ink: null });
  paint(body, { ink: PAL.ink, sw, curv: .5 });
  inkLine(P([[hl + .15, -2.42], [(hl + hr) / 2, -2.45], [hr - .15, -2.42]]), sw * .45, mixCol(HG.hood, PAL.ink, .5), 'inkfine', .3);

  if (vname === 'front' || vname === 'q') {   // kangaroo pocket and the bunny on the chest
    const c = vname === 'q' ? .5 : 0, k = vname === 'q' ? .85 : 1;
    const pk = P([[c - 1.45 * k, -2.48], [c - 1.12 * k, -3.35], [c + 1.12 * k, -3.35], [c + 1.45 * k, -2.48]]);
    paint(pk, { fill: HG.hoodDk, fillOp: 80, bleed: .02, tex: .5, ink: null });
    inkLine([pk[0], pk[1]], sw * .55, PAL.ink, 'inkfine', 0); inkLine([pk[1], pk[2]], sw * .5, PAL.ink, 'inkfine', 0); inkLine([pk[2], pk[3]], sw * .55, PAL.ink, 'inkfine', 0);
    if (V.logo) bunnyMark(V.logo[0] * u, -4.35 * u, .56 * u, V.logo[1], HG.bunny);
  } else if (vname === 'side') {   // the pocket's edge on the belly
    inkLine(P([[1.3, -2.5], [1.6, -3.1], [1.85, -3.45]]), sw * .5, PAL.ink, 'inkfine', .3);
  } else {   // the hood hanging down the back
    const hk = P([[-1.7, -5.55], [1.7, -5.55], [1.4, -4.35], [0, -3.8], [-1.4, -4.35]]);
    paint(hk, { wash: mixCol(HG.hood, HG.hoodLt, .18), washOp: 255, ink: PAL.ink, sw: sw * .7, curv: .4 });
    inkLine(P([[-1.0, -5.35], [0, -4.45], [1.0, -5.35]]), sw * .45, HG.hoodDk, 'inkfine', .4);
  }
}

// The white bunny badge: a round head and two long ears. sx squeezes it for turned views.
function bunnyMark(cx, cy, s, sx, col, ink = mixCol(col, PAL.ink, .55)) {
  push(); translate(cx, cy); scale(sx, 1);
  for (const e of [-1, 1]) paint(ellPts(e * .2 * s, -.62 * s, .13 * s, .36 * s, 10, 0, e * .18), { wash: col, washOp: 255, ink: null });
  paint(ellPts(0, -.05 * s, .38 * s, .32 * s, 14), { wash: col, washOp: 255, ink: null });
  if (s > 6) for (const e of [-1, 1]) paint(ellPts(e * .13 * s, -.08 * s, .035 * s, .045 * s, 6), { wash: ink, ink: null });
  pop();
}

function hgBadge(u, sw, vname) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]), c = vname === 'q' ? .7 : 0, k = vname === 'q' ? .82 : 1;
  for (const s of [-1, 1]) paint(ribbon(P([[c + s * .9 * k, -5.55], [c + s * .52 * k, -4.8], [c + s * .1, -4.05]]), .19 * u, .15 * u), { wash: HG.lanyard, washOp: 255, ink: PAL.ink, sw: sw * .35 });
  paint(rrPts((c - .12) * u, -4.12 * u, .24 * u, .26 * u, .05 * u), { wash: '#B9B4C2', washOp: 255, ink: PAL.ink, sw: sw * .35 });
  const bx = c - .44 * k, bw = .88 * k;
  paint(rrPts(bx * u, -3.92 * u, bw * u, 1.12 * u, .12 * u), { wash: HG.badge, washOp: 255, ink: PAL.ink, sw: sw * .5 });
  if (u > 9) {
    bunnyMark(c * u, -3.32 * u, .4 * u, k, HG.lanyard, HG.badge);
    inkLine(P([[c - .26 * k, -3.04], [c + .26 * k, -3.04]]), sw * .35, HG.lanyard, 'inkfine', 0);
  }
}

// ---------- head ----------
function hgHead(u, sw, V, vname, o, skin, skinDk, capPop, rs) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]), F = V.face, J = u * .04;
  const sidev = vname === 'side';
  const ears = () => {
    rs('ears');
    for (const ex of V.ears) {
      const e = Math.sign(ex) || 1;
      paint(ellPts(ex * u, -7.8 * u, .55 * u, .8 * u, 14, J * .5), { wash: skin, washOp: 255, ink: PAL.ink, sw: sw * .75 });
      inkLine(P([[ex - e * .08, -8.15], [ex + e * .14, -7.85], [ex - e * .02, -7.45]]), sw * .4, skinDk, 'inkfine', .5);
    }
  };
  rs('hairback'); hgHairBack(u, sw, vname, J);
  if (!V.back && !sidev) ears();
  rs('face');
  const face = sidev ? hgProfile(u) : ellPts(0, -7.95 * u, 3.0 * u, 2.72 * u, 30, J * .6);
  paint(face, { wash: skin, washOp: 255, ink: null });
  if (!V.back) {
    paint(ellPts((F.cx - .9) * u, -8.6 * u, 1.6 * u * F.fw, .9 * u, 16, J), { fill: HG.skinLt, fillOp: 110, bleed: .2, tex: .7, border: .7, ink: null });
    paint(ellPts(F.cx * u, -5.75 * u, 2.2 * u * (sidev ? .6 : 1), .55 * u, 16, J), { fill: skinDk, fillOp: 70, bleed: .15, tex: .6, border: .5, ink: null });
    paint(ellPts(F.cx * u, -9.55 * u, 2.4 * u * F.fw, .32 * u, 16, J), { fill: skinDk, fillOp: 60, bleed: .12, tex: .5, border: .5, ink: null });   // shade under the fringe
  } else paint(ellPts(0, -5.7 * u, 1.6 * u, .5 * u, 14, J), { fill: skinDk, fillOp: 80, bleed: .12, tex: .5, ink: null });
  paint(face, { ink: PAL.ink, sw });
  if (V.back) { rs('hairnape'); hgHairNape(u, sw, J); ears(); }
  if (sidev) { rs('hairside'); hgHairSide(u, sw, J); ears(); }

  if (F) {
    push(); translate(F.cx * u, 0); scale(F.fw, 1);
    const b = Math.max(.3, o.blush === true ? 1 : o.blush || 0);
    for (const s of F.sides) {   // cheeks
      const bx = s * 2.1 * u;
      paint(ellPts(bx, -6.9 * u, .62 * u, .3 * u, 14), { fill: HG.blush, fillOp: 160 * clamp(b), bleed: .2, ink: null });
      if (b > .6) for (let k = 0; k < 3; k++) inkLine([[bx - .4 * u + k * .32 * u, -6.72 * u], [bx - .22 * u + k * .32 * u, -7.08 * u]], sw * .35, mixCol(PAL.rose, PAL.ink, .3), 'inkfine', 0);
    }
    if (o.gloom > .02) {
      paint(rectPts(-2.7 * u, -10 * u, 5.4 * u, 1.35 * u, u * .04), { fill: PAL.indigo, fillOp: 150 * o.gloom, bleed: .08, tex: .5, border: .6, ink: null });
      for (let i = 0; i < 6; i++) { const gx = lerp(-2.2 * u, 2.2 * u, i / 5); inkLine([[gx, -9.95 * u], [gx + jit(u * .04), (-9.95 + 1.4 * o.gloom * (.7 + .3 * hash(i))) * u]], sw * .45, PAL.ink, 'inkfine', 0); }
    }
    rs('eyes'); hgEyes(u, o, sw, F.sides, skin);
    rs('mouth');
    const m = o.mouth || (o.lid > .05 ? 'teeth' : 'hgRest'), k = .62;
    push(); translate((sidev ? .35 : 0) * u, -6.45 * u + 4.3 * k * u);
    if (m === 'hgRest') inkLine([[-.3 * u, -4.3 * k * u - .06 * u], [0, -4.3 * k * u + .07 * u], [.3 * u, -4.3 * k * u - .06 * u]], sw * .75, PAL.ink, 'ink', .6);
    else mouth(u * k, m, sw * .9);
    pop();
    pop();
  }
  rs('bangs'); hgBangs(u, sw, vname, J);
  if (F) { push(); translate(F.cx * u, 0); scale(F.fw, 1); rs('brows'); hgBrows(u, o, sw, F.sides); pop(); }
  if (F && !o.noGlasses) { rs('glasses'); hgGlasses(u, o, sw, F); }

  // the cap: on his head, or jumping off it in a fury
  if (!o.noCap && (!o.hat || o.hat === 'cap')) {
    rs('cap');
    push();
    if (capPop > 0) { translate(-.4 * capPop * u, -2.2 * capPop * u); rotate(-.35 * capPop); }
    hgCap(u, sw, vname, J);
    pop();
  } else if (o.hat && o.hat !== 'none') {
    rs('hat'); hgHairTop(u, sw, J);
    const k = .64; push(); translate(0, (-10.85 + 8 * k) * u); scale(k); hat(u, o.hat, sw / k); pop();
  } else { rs('hairtop'); hgHairTop(u, sw, J); }
}

// The face in profile, facing right: forehead, a small nose, cheek and chin.
function hgProfile(u) {
  const pts = [];
  for (let i = 0; i <= 18; i++) { const a = Math.PI * .5 + i / 18 * Math.PI; pts.push([Math.cos(a) * 2.75 * u, -7.95 * u + Math.sin(a) * 2.72 * u]); }
  pts.push(...[[1.2, -10.4], [2.35, -9.75], [2.75, -8.75], [2.82, -8.05], [3.05, -7.72], [2.78, -7.48], [2.72, -6.8], [2.3, -5.85], [1.3, -5.3]].map(([a, b]) => [a * u, b * u]));
  return pts;
}

// Hair behind the face: messy tufts that puff out under the cap at the sides.
function hgHairBack(u, sw, vname, J) {
  const P = pts => pts.map(([a, b]) => [a * u + jit(J), b * u + jit(J)]);
  let pts;
  if (vname === 'side') pts = [[-3.0, -10.1], [-3.55, -9.5], [-3.2, -9.3], [-3.75, -8.6], [-3.15, -8.5], [-3.45, -7.7], [-2.8, -7.85], [-2.9, -6.9], [-2.2, -7.4], [-1.2, -7.9], [.6, -9.6], [1.4, -10.1]];
  else if (vname === 'q') pts = [[-3.25, -10.1], [-3.8, -9.55], [-3.45, -9.35], [-4.0, -8.7], [-3.4, -8.55], [-3.7, -7.85], [-3.0, -7.95], [-3.05, -7.1], [-2.3, -7.6], [0, -8.6], [2.8, -8.3], [3.25, -8.85], [3.0, -9.4], [3.2, -10.1]];
  else if (vname === 'front') pts = [[-3.2, -10.05], [-3.8, -9.6], [-3.45, -9.4], [-4.0, -8.85], [-3.4, -8.7], [-3.6, -8.2], [-2.9, -8.3], [0, -8.6], [2.9, -8.3], [3.6, -8.2], [3.4, -8.7], [4.0, -8.85], [3.45, -9.4], [3.8, -9.6], [3.2, -10.05]];
  else return;
  paint(P(pts), { wash: HG.hair, washOp: 255, ink: PAL.ink, sw: sw * .8 });
}
// Seen from behind, the hair covers the back of the head down to a spiky nape.
function hgHairNape(u, sw, J) {
  const P = pts => pts.map(([a, b]) => [a * u + jit(J), b * u + jit(J)]);
  const pts = [[-3.25, -10.05], [-3.55, -9.2], [-3.2, -9.0], [-3.4, -8.1], [-2.95, -8.0], [-2.95, -7.2], [-2.3, -7.35], [-1.95, -6.55], [-1.2, -6.95], [-.65, -6.25], [0, -6.85], [.65, -6.3], [1.2, -6.95], [1.95, -6.55], [2.3, -7.35], [2.95, -7.2], [2.95, -8.0], [3.4, -8.1], [3.2, -9.0], [3.55, -9.2], [3.25, -10.05]];
  paint(P(pts), { wash: HG.hair, washOp: 255, fill: HG.hairLt, fillOp: 40, tex: .6, ink: PAL.ink, sw: sw * .8 });
  for (let i = 0; i < 4; i++) inkLine([[(-1.8 + i * 1.2) * u, -9.6 * u], [(-1.6 + i * 1.2 + .3 * hash(i)) * u, -7.9 * u]], sw * .4, HG.hairLt, 'inkfine', .3);
}
// In profile the back half of the head is hair, from the cap band down to a spiky nape, with a sideburn by the ear.
function hgHairSide(u, sw, J) {
  const P = pts => pts.map(([a, b]) => [a * u + jit(J), b * u + jit(J)]);
  const pts = [[-2.95, -10.05], [-3.25, -9.3], [-2.95, -9.15], [-3.15, -8.3], [-2.75, -8.25], [-2.85, -7.4], [-2.35, -7.5], [-2.3, -6.6], [-1.75, -6.95], [-1.3, -6.3], [-.95, -7.0], [-.5, -7.35], [.15, -7.2], [.3, -8.3], [.85, -8.9], [.95, -10.05]];
  paint(P(pts), { wash: HG.hair, washOp: 255, fill: HG.hairLt, fillOp: 35, tex: .6, ink: PAL.ink, sw: sw * .8 });
  for (let i = 0; i < 3; i++) inkLine([[(-2.3 + i * .9) * u, -9.7 * u], [(-2.1 + i * .9) * u, -8.0 * u]], sw * .4, HG.hairLt, 'inkfine', .3);
}
// The fringe under the cap: a few spikes, short enough to leave the brows on skin.
function hgBangs(u, sw, vname, J) {
  if (vname === 'back' || vname === 'qback') return;
  const P = pts => pts.map(([a, b]) => [a * u + jit(J * .5), b * u + jit(J * .5)]);
  let pts;
  if (vname === 'side') pts = [[.4, -10.1], [1.15, -9.35], [1.35, -9.8], [1.95, -9.15], [2.15, -9.7], [2.55, -9.25], [2.6, -10.1]];
  else {
    const c = vname === 'q' ? .7 : 0, k = vname === 'q' ? .85 : 1;
    pts = [[-2.95, -10.1], [-2.9, -9.1], [-2.4, -9.62], [-1.85, -9.4], [-1.35, -9.74], [-.75, -9.48], [-.25, -9.8], [.3, -9.5], [.85, -9.78], [1.4, -9.42], [1.9, -9.72], [2.45, -9.32], [2.95, -9.15], [2.95, -10.1]].map(([a, b]) => [c + a * k, b]);
  }
  paint(P(pts), { wash: HG.hair, washOp: 255, ink: PAL.ink, sw: sw * .7 });
  if (u > 14 && vname !== 'side') for (const [x0, x1] of [[-1.9, -1.7], [-.5, -.35], [1.2, 1.45]]) inkLine([[x0 * u, -9.95 * u], [x1 * u, -9.6 * u]], sw * .35, HG.hairLt, 'inkfine', 0);
}
// Without the cap: a messy dome of hair.
function hgHairTop(u, sw, J) {
  const pts = [];
  for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI, r = 1 + (i % 2 ? .07 : -.02); pts.push([Math.cos(a) * 3.25 * r * u, -9.6 * u + Math.sin(a) * 1.9 * r * u]); }
  paint(pts.map(([a, b]) => [a + jit(J), b + jit(J)]), { wash: HG.hair, washOp: 255, ink: PAL.ink, sw: sw * .8 });
}

function hgCap(u, sw, vname, J) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]);
  const off = vname === 'side' ? -.1 : vname === 'q' ? .25 : vname === 'qback' ? -.25 : 0;
  const dome = [];
  for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; dome.push([(off + Math.cos(a) * 3.22) * u, (-10.0 + Math.sin(a) * 2.1) * u]); }
  dome.push([(off + 1.6) * u, -9.92 * u], [(off - 1.6) * u, -9.92 * u]);
  // the brim: a curved bill, thick at the tip. [top edge (attached to the band), then the near edge back]
  const brims = {
    front: [[-.9, -10.02], [1.0, -10.14], [2.8, -10.16], [4.2, -10.0], [5.15, -9.68], [4.85, -9.4], [3.4, -9.4], [1.8, -9.56], [.3, -9.78], [-.7, -9.9]],
    q:     [[-.3, -10.02], [1.6, -10.16], [3.4, -10.12], [4.8, -9.9], [5.6, -9.55], [5.25, -9.3], [3.8, -9.36], [2.2, -9.56], [.6, -9.8]],
    side:  [[1.1, -10.0], [3.0, -10.1], [4.7, -9.92], [5.7, -9.6], [5.45, -9.38], [3.9, -9.52], [2.0, -9.74]],
    qback: [[2.3, -10.0], [3.6, -9.98], [4.35, -9.78], [3.95, -9.6], [2.85, -9.74]],
  };
  const brim = brims[vname];
  const drawBrim = () => {
    const B = P(brim), half = Math.ceil(brim.length / 2);
    paint(B, { wash: HG.cap, washOp: 255, ink: null, curv: .45 });
    paint(B.slice(half - 1).concat([B[0]]), { fill: HG.capDk, fillOp: 170, bleed: .03, tex: .5, border: .4, ink: null, curv: .4 });
    paint(B, { ink: PAL.ink, sw: sw * .85, curv: .45 });
    const top = B.slice(1, half - 1); if (top.length > 1) inkLine(top.map(([a, b]) => [a, b + u * .12]), sw * .4, HG.capLt, 'inkfine', .5);
  };
  if (brim && vname === 'qback') drawBrim();
  paint(dome, { wash: HG.cap, washOp: 255, ink: null });
  paint(ellPts((off - 1.0) * u, -11.15 * u, 1.35 * u, .55 * u, 16, J, -.25), { fill: HG.capLt, fillOp: 110, bleed: .2, tex: .8, border: .7, ink: null });
  paint(dome, { ink: PAL.ink, sw });
  inkLine(P([[off - 2.75, -10.6], [off - 2.2, -11.45], [off - 1.2, -11.95]]), sw * .45, HG.capLt, 'inkfine', .6);   // rim light
  const seam = mixCol(HG.cap, PAL.ink, .6);
  if (vname !== 'back') {
    inkLine(P([[off, -12.05], [off + .08, -11.0], [off + .05, -10.0]]), sw * .4, seam, 'inkfine', .5);
    for (const s of [-1, 1]) inkLine(P([[off + s * .15, -12.0], [off + s * 1.45, -11.2], [off + s * 2.15, -10.02]]), sw * .4, seam, 'inkfine', .6);
  } else {   // the strap gap at the back
    paint(P([[-.65, -10.0], [-.5, -10.55], [0, -10.72], [.5, -10.55], [.65, -10.0]]), { wash: HG.hair, washOp: 255, ink: PAL.ink, sw: sw * .5, curv: .4 });
    paint(P([[-.75, -10.18], [.75, -10.18], [.75, -9.98], [-.75, -9.98]]), { wash: HG.capDk, washOp: 255, ink: PAL.ink, sw: sw * .45 });
  }
  paint(ellPts(off * u, -12.12 * u, .36 * u, .18 * u, 10), { wash: HG.capDk, washOp: 255, ink: PAL.ink, sw: sw * .5 });
  if (vname === 'front' || vname === 'q') bunnyMark((off - (vname === 'q' ? .2 : 1.05)) * u, -10.75 * u, .62 * u, vname === 'q' ? .85 : 1, HG.bunny);
  if (brim && vname !== 'qback') drawBrim();
}

// ---------- face parts ----------
// Lenses sit at (±1.35u, -8.05u): 2.35u wide and 1.75u tall. The frames are thick, but scale with u (not with sw, which
// stops growing at close-up sizes), so they stay frames at every size.
function hgGlasses(u, o, sw, F) {
  push(); translate(F.cx * u, 0); scale(F.fw, 1);
  const shades = (Array.isArray(o.eyes) ? o.eyes[0] : o.eyes) === 'shades', fsw = clamp(u * .036, .45, 2.2);
  for (const s of F.sides) {
    const lens = rrPts((s * 1.35 - 1.175) * u, -8.92 * u, 2.35 * u, 1.75 * u, .45 * u);
    if (shades) paint(lens, { wash: '#2A2740', washOp: 255, ink: null });
    paint(lens, { ink: PAL.ink, sw: fsw, curv: .2 });
    const g = shades ? PAL.cream : mixCol(PAL.cream, '#FFFFFF', .5);
    if (shades || u > 12) inkLine([[(s * 1.35 - .78) * u, -8.25 * u], [(s * 1.35 - .4) * u, -8.62 * u]], sw * (shades ? .5 : .35), g, 'inkfine', 0);
  }
  if (F.sides.length > 1) {
    inkLine([[-.18 * u, -8.3 * u], [0, -8.4 * u], [.18 * u, -8.3 * u]], fsw * .95, PAL.ink, 'ink', .5);
    for (const s of [-1, 1]) inkLine([[s * 2.5 * u, -8.45 * u], [s * 2.98 * u, -8.35 * u]], fsw * .75, PAL.ink, 'ink', 0);
  } else inkLine([[(1.35 - 1.175) * u, -8.45 * u], [-2.4 * u, -8.3 * u]], fsw * .75, PAL.ink, 'ink', 0);   // profile: the arm runs back to the ear (scaled by fw)
  pop();
}

// Eyebrows above the frames: they carry most of the acting, so they follow the eyes' shape.
function hgBrows(u, o, sw, sides) {
  const kinds = Array.isArray(o.eyes) ? o.eyes : [o.eyes || 'normal', o.eyes || 'normal'];
  const lift = (o.squint || 0) * .12, bw = clamp(u * .05, .5, 2.6);
  for (const s of sides) {
    const e = kinds[s < 0 ? 0 : 1];
    let pts;   // [outer, middle, inner] for the right-hand brow (s = 1), mirrored for the left
    if (['angry', 'determined', 'red'].includes(e)) pts = [[2.1, -9.5], [1.4, -9.32], [.65, -9.02]];
    else if (['sad', 'teary', 'cry', 'scared'].includes(e)) pts = [[2.1, -9.08], [1.4, -9.25], [.7, -9.5]];
    else if (['wide', 'blank', 'shine', 'spark', 'heart', 'swirl'].includes(e)) pts = [[2.05, -9.38], [1.4, -9.62], [.75, -9.45]];
    else if (['happy', 'closed', 'squeeze', 'x'].includes(e)) pts = [[2.05, -9.25], [1.4, -9.42], [.75, -9.28]];
    else if (e === 'narrow') pts = [[2.05, -9.18], [1.4, -9.2], [.75, -9.12]];
    else pts = [[2.05, -9.22], [1.4, -9.36], [.75, -9.24]];
    inkLine(pts.map(([a, b]) => [s * a * u, (b + lift) * u]), bw, PAL.ink, 'ink', .5);
  }
}

// Big eyes inside the lenses. The everyday shapes are drawn here; the rest borrow Clawd's eye() at a smaller size.
function hgEyes(u, o, sw, sides, skin) {
  const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['happy', 'normal'] : [o.eyes || 'normal', o.eyes || 'normal'];
  if (kinds[0] === 'shades') return;
  const sqz = clamp(o.squint || 0);
  if (sqz > .8 || (o.smear || 0) > .5) { for (const s of sides) inkLine([[s * 1.35 * u - .45 * u, -8.0 * u], [s * 1.35 * u, -7.92 * u], [s * 1.35 * u + .45 * u, -8.0 * u]], sw * 1.1, PAL.ink, 'ink', .5); return; }
  for (const s of sides) {
    push(); translate(s * 1.35 * u, -8.02 * u);
    if (sqz > 0) scale(1 + sqz * .12, 1 - sqz);
    hgEye(kinds[s < 0 ? 0 : 1], s, u, o, sw, skin);
    pop();
  }
}
function hgEye(e, s, u, o, sw, skin = HG.skin) {
  const lx = (o.lookX || 0) * u * .32, ly = (o.lookY || 0) * u * .2;
  const pupil = (rx, ry, hi = 1) => {
    paint(ellPts(lx, ly, rx * u, ry * u, 16), { wash: PAL.ink, washOp: 255, ink: null });
    if (u > 7) {
      paint(ellPts(lx - rx * .35 * u, ly - ry * .4 * u, rx * .38 * hi * u, rx * .38 * hi * u, 10), { wash: PAL.cream, washOp: 245, ink: null });
      paint(ellPts(lx + rx * .3 * u, ly + ry * .38 * u, rx * .16 * hi * u, rx * .16 * hi * u, 8), { wash: PAL.cream, washOp: 230, ink: null });
    }
  };
  const line = (pts, w = 1.1, c = .5) => inkLine(pts.map(([a, b]) => [a * u, b * u]), sw * w, PAL.ink, 'ink', c);
  const blink = ['normal', 'look', 'wide', 'shine'].includes(e) && ((T * .9 + (o.seed || 0) * 1.7) % 3.3) < .12;
  if (blink) { line([[-.42, .05], [0, .14], [.42, .05]]); return; }
  switch (e) {
    case 'normal': case 'look': pupil(.38, .5); break;
    case 'wide': pupil(.46, .6, 1.15); break;
    case 'shine': pupil(.44, .56, 1.5); paint(starPts(lx + .2 * u, ly - .3 * u, .14 * u, .35, 4), { wash: PAL.cream, ink: null }); break;
    case 'dot': paint(ellPts(lx * .5, ly * .5, .2 * u, .24 * u, 10), { wash: PAL.ink, ink: null }); break;
    case 'happy': line([[-.48, .2], [0, -.22], [.48, .2]], 1.2); break;
    case 'closed': line([[-.48, -.05], [0, .2], [.48, -.05]], 1.1); break;
    case 'sleepy':
      paint(ellPts(lx, .15 * u, .36 * u, .28 * u, 12, 0), { wash: PAL.ink, ink: null });
      paint(rectPts(-.55 * u, -.62 * u, 1.1 * u, .66 * u), { wash: skin, washOp: 255, ink: null });
      line([[-.48, .05], [0, -.02], [.48, .06]], 1.1); break;
    case 'narrow': paint(ellPts(lx, ly + .05 * u, .38 * u, .2 * u, 12), { wash: PAL.ink, ink: null }); line([[-.5, -.1], [.5, -.12]], 1, 0); break;
    case 'angry': case 'determined': {   // a skin-coloured lid cuts the top of the eye, lower on the nose side
      pupil(.38, .48);
      const cut = e === 'angry' ? .4 : .26, inX = -s * .62, outX = s * .62, yIn = -.42 + cut, yOut = -.42;
      paint([[inX * u, -.8 * u], [outX * u, -.8 * u], [outX * u, yOut * u], [inX * u, yIn * u]], { wash: skin, washOp: 255, ink: null });
      line([[outX * .9, yOut], [inX * .9, yIn]], 1.1, 0);
      break;
    }
    case 'sad': case 'teary': {   // the lid rises toward the nose: worried
      pupil(.36, .46);
      const inX = -s * .62, outX = s * .62, yIn = -.5, yOut = -.12;
      paint([[inX * u, -.8 * u], [outX * u, -.8 * u], [outX * u, yOut * u], [inX * u, yIn * u]], { wash: skin, washOp: 255, ink: null });
      line([[outX * .9, yOut], [inX * .9, yIn]], 1, 0);
      if (e === 'teary') {
        const w = Math.sin(T * 9 + s) * .04 * u;
        paint(ellPts(0, .42 * u + w, .5 * u, .2 * u, 14), { wash: PAL.sky, washOp: 210, fill: '#FFFFFF', fillOp: 60, ink: PAL.ink, sw: sw * .35 });
      }
      break;
    }
    case 'squeeze': line([[-.4 * -s, -.35], [.35 * -s, 0], [-.4 * -s, .35]], 1.2, 0); break;   // > <
    case 'scared':
      paint(ellPts(0, 0, .5 * u, .58 * u, 16), { wash: PAL.cream, ink: PAL.ink, sw: sw * .6 });
      paint(ellPts((o.lookX || 0) * u * .15 + Math.sin(T * 40) * .03 * u, .05 * u, .14 * u, .18 * u, 10), { wash: PAL.ink, ink: null });
      break;
    case 'blank': paint(ellPts(0, 0, .45 * u, .55 * u, 14), { wash: PAL.cream, ink: PAL.ink, sw: sw * .6 }); break;
    default: eye(e, s, u * .52, o, sw);   // cry, spark, red, heart, x, swirl
  }
}
// A smear drawing: dry-brush streaks and speed lines trailing a fast move.
function hgSmear(x, y, u, k, dir) {
  const sides = dir === 0 ? [-1, 1] : [-dir];
  for (const s of sides) for (let i = 0; i < 5; i++) {
    const yy = y - (10.5 - i * 2) * u, x0 = x + s * 2.6 * u, len = (2.5 + 2.5 * hash(i + 7 * s)) * u * k;
    inkLine([[x0, yy], [x0 + s * len * .5, yy + jit(u * .1)], [x0 + s * len, yy]], 2.2 * k, i < 2 ? HG.cap : HG.hood, 'dry', .3);
    if (i % 2) inkLine([[x0 + s * len * .3, yy + .5 * u], [x0 + s * len * 1.1, yy + .5 * u]], .6, PAL.ink, 'inkfine', 0);
  }
}
