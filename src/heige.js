// heige.js: 黑哥 (HeiGe), the host of 问问黑哥, painted in watercolour and ink on Clawd's rig.
//
// heige(x, y, u, o) takes the same options as clawd(), so feel(), emotions(), move(), turn(), jump(), take(), stroll()
// and spring() drive him unchanged:
//   heige(960, 900, 20, { ...emotions(t, [[0, 'neutral'], [1.2, 'surprised']]), ...turn(t, 2, 2.2, 0, .25) })
//
// The design is 黑哥's own avatar (ref/heige-avatar.jpg), measured and redrawn in paint: a black baseball cap worn
// straight, short dark hair showing only at the temples, thick confident brows, rounded square glasses over small oval
// eyes, a short nose stroke, a one-sided smirk, big round ears, a broad round jaw, and an open black jacket with notched
// lapels over a black hoodie. Proportions come from the avatar with F = half the face width = 2.6u.
//
// Body-local coordinates in the front view (u units, y negative upward, (0, 0) = the ground point between the feet):
//   cap top -13.3u, brim's lower edge -10.35u (centre) to -9.6u (sides), brows -9.3u to -9.65u, eyes (±1.17u, -8.3u),
//   lens centres (±1.33u, -8.12u), nose -7.94u to -7.36u, mouth -6.6u, chin -5.3u, ears (±3.35u, -7.94u),
//   shoulders (±2.2u, -4.6u), jacket hem -1.7u, feet on y 0. About 7.5u wide and 13.3u tall, so u 16-20 is a medium
//   shot and 40+ a close-up. o.draw(u, sw) paints in this space on top of everything; o.armL / o.armR are called at
//   the hands, in hand space.
//
// Options on top of clawd()'s:
//   bendL / bendR: elbow bend in radians (+ folds the forearm in toward the body); reachL / reachR: forearm length scale
//   frontArm: 'L' | 'R' draws that arm over the face (a hand on the chin)
//   capPop 0..1: the cap jumps off his head (furious sets it through lid); noCap, noGlasses
//   bunny: true puts the 问问黑哥 white bunny on the cap; noPose: keep the scene's arms in emotions that pose them
//   rawArms: aL / aR are his own shoulder angles instead of clawd()'s arm parameter

const HG = {
  skin: '#F8C29E', skinDk: '#E5895B', skinLt: '#FCD9C0', nose: '#DE7E55',
  hair: '#3A2B27', hairLt: '#5E4A43',
  cap: '#2C2931', capDk: '#211F26', capLt: '#625C6D',
  jacket: '#302D36', jacketDk: '#24222A', jacketLt: '#6F6982',
  hood: '#3C3843', hoodDk: '#2A2730', hoodLt: '#7A7390', cord: '#8F889D',
  pants: '#46424E', pantsDk: '#36333D',
  shoe: '#F4EEE4', sole: '#CEC4B6',
  blush: '#F0958C', bunny: '#FFF9F0',
};
// No green in 黑哥's world: disgust turns his face a sickly lavender instead.
const HG_TINT = { ...TINT, green: '#B6A8CC' };

// clawd()'s arm parameter (0 = straight out, + up, - down) → 黑哥's shoulder angle. Clawd's arms are stubby nubs that
// rest slightly raised; a person's arms rest hanging down, so the bottom of the range is squeezed and the top stretched.
const hgArm = a => a <= .2 ? -1.14 + (a - .2) * .3 : -1.14 + (a - .2) * 1.95;

// Poses an emotion needs that Clawd's nubs can't do: a hand on the chin, hands on the hips. They replace the emotion's
// own arm values; pass noPose: true to keep the scene's arms instead.
const HG_EMO_POSE = {
  thinking: { frontArm: 'R', aR: .05, bendR: 2.6, reachR: 1.75 },
  proud:    { aL: .55, aR: .55, bendL: 2.3, bendR: 2.3, reachL: .75, reachR: .75 },
  shy:      { aL: -.2, aR: -.2, bendL: 1.25, bendR: 1.25 },
  bored:    { bendL: .35, bendR: .35 },
};

// Face colour for the mood. emotions() cross-fades tints through o.tintFade; feel() sets tint directly.
function hgSkin(o) {
  const one = (tn, tk) => {
    const tc = tn && (HG_TINT[tn] || tn), k = clamp(tk ?? 1);
    return !tc || k <= 0 ? [HG.skin, HG.skinDk] : [mixCol(HG.skin, tc, .4 * k), mixCol(HG.skinDk, mixCol(tc, PAL.ink, .25), .36 * k)];
  };
  if (o.tintFade) { const f = o.tintFade, A = one(f.a, f.ak), B = one(f.b, f.bk); return [mixCol(A[0], B[0], f.k), mixCol(A[1], B[1], f.k)]; }
  return one(o.tint, o.tintK);
}

// ---------- styles ----------
// The same 黑哥 in different hands. ink / line / brush: the outline's colour, weight and brush. paint: add a watercolour
// layer over the flat colours (storybook texture). flat: drop the watercolour shading for a clean sticker look.
// headK / bodyK / bodyW: head size, body height and body width (head-to-body ratio). eyeK / eyeHi: eye size and shine.
const HG_STYLES = {
  avatar:    { ink: PAL.ink, line: 1.15, brush: 'ink', headK: 1, bodyK: 1, bodyW: 1, eyeK: 1, eyeHi: 0 },
  storybook: { ink: '#45302C', line: .72, brush: 'inkfine', paint: true, headK: 1, bodyK: 1, bodyW: 1, eyeK: 1, eyeHi: 0 },
  youth:     { ink: PAL.ink, line: 1.0, brush: 'ink', headK: .8, bodyK: 1.5, bodyW: .94, eyeK: 1, eyeHi: 0 },
  sticker:   { ink: PAL.ink, line: 1.6, brush: 'ink', flat: true, headK: 1.16, bodyK: .7, bodyW: 1.14, eyeK: 1.3, eyeHi: 1 },
};
let HGS = HG_STYLES.avatar;
// paint() and inkLine() through the current style.
function hp(pts, o = {}) {
  const q = { ...o };
  if (HGS.flat && q.fill) { if (!q.wash) return; delete q.fill; }
  if (HGS.paint && q.wash && (q.washOp ?? 255) >= 255 && !q.fill && hgLum(q.wash) > 70) { q.fill = mixCol(q.wash, PAL.ink, .2); q.fillOp = 50; q.bleed = .22; q.tex = .9; q.border = .6; }
  if (q.ink !== null) { q.ink = !q.ink || q.ink === PAL.ink ? HGS.ink : q.ink; q.sw = (q.sw ?? 1) * HGS.line; if (!q.br) q.br = HGS.brush; }
  paint(pts, q);
}
const hgLum = c => { const n = parseInt(c.slice(1), 16); return .299 * (n >> 16) + .587 * ((n >> 8) & 255) + .114 * (n & 255); };
function hl(pts, sw = 1, col = PAL.ink, br = 'ink', curv = .5) {
  inkLine(pts, sw * (col === PAL.ink ? HGS.line : 1), col === PAL.ink ? HGS.ink : col, br === 'ink' ? HGS.brush : br, curv);
}

// ---------- views ----------
// face: where the features go (centre x and horizontal squeeze; sides = which eyes show). ears: x of each ear.
// bw: body width. arms: [pivotX, dir, which, layer] (layer 1 = in front of the body, 2 = behind it and in shadow).
// legs: [x, far]. back: no face. Every view faces screen-right; flip: true mirrors it.
const HVIEWS = {
  front: { face: { cx: 0, fw: 1, sides: [-1, 1] }, ears: [-3.28, 3.28], bw: 1,
           arms: [[-2.05, -1, 'L', 1], [2.05, 1, 'R', 1]], legs: [[-.72, 0], [.72, 0]] },
  q:     { face: { cx: .75, fw: .82, sides: [-1, 1] }, ears: [-3.0], bw: .93,
           arms: [[1.85, 1, 'R', 2], [-1.95, -1, 'L', 1]], legs: [[-.55, 0], [.85, 1]] },
  side:  { face: { cx: 1.75, fw: .5, sides: [1] }, ears: [-.35], bw: .74,
           arms: [[-.15, 0, 'L', 1]], legs: [[-.3, 1], [.3, 0]] },
  qback: { face: null, ears: [3.0], bw: .93, back: true,
           arms: [[-1.85, -1, 'R', 2], [1.95, 1, 'L', 1]], legs: [[.55, 0], [-.85, 1]] },
  back:  { face: null, ears: [-3.3, 3.3], bw: 1, back: true,
           arms: [[-2.05, -1, 'R', 1], [2.05, 1, 'L', 1]], legs: [[-.72, 0], [.72, 0]] },
};

// ---------- 黑哥 ----------
function heige(x, y, u, o = {}) {
  if (o.emo && HG_EMO_POSE[o.emo] && !o.noPose) o = { ...o, ...HG_EMO_POSE[o.emo] };
  HGS = HG_STYLES[o.style] || HG_STYLES.avatar;
  const hk = HGS.headK, bk = HGS.bodyK, bwk = HGS.bodyW, NECK = -5.3;
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
    paint(ellPts(x, y + u * .12, u * 3.5 * f * bwk * (vname === 'side' ? .8 : 1), u * .7 * f, 22), { fill: PAL.ink, fillOp: 90, bleed: .25, tex: .3, border: .1, ink: null });
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
    const col = shade ? mixCol(HG.jacket, HG.jacketDk, .75) : HG.jacket, hand = shade ? mixCol(skin, PAL.ink, .22) : skin;
    push(); translate(px * u, -4.45 * u);
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

  // far arms, legs, body, near arms, neck and head, an arm over the face, then hooks
  push(); scale(bwk, bk);
  V.arms.filter(a => a[3] === 2).forEach(arm);
  if (!o.noLegs) hgLegs(u, sw, V, vname, o, rs);
  rs('body'); hgBody(u, sw, V, vname, skin, skinDk);
  V.arms.filter(a => a[3] === 1 && a[2] !== o.frontArm).forEach(arm);
  pop();
  // the head sits on the (possibly stretched) neck, at its own scale
  push(); translate(0, NECK * u * bk); scale(hk); translate(0, -NECK * u);
  rs('head'); hgHead(u, sw, V, vname, o, skin, skinDk, capPop, rs);
  pop();
  push(); scale(bwk, bk); V.arms.filter(a => a[3] !== 2 && a[2] === o.frontArm).forEach(arm); pop();
  rs('draw'); if (o.draw) o.draw(u, sw);
  pop();

  rs('emote');
  if (o.emote) {
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1;
    const ex = top ? x + dir * .2 * u : x + dir * 4.0 * u * hk, ey = y + dy + (NECK * bk + ((top ? -14.4 : -11.9) - NECK) * hk) * u * (1 - sq);
    emote(o.emote, ex, ey, u * .9, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('after');
}

// A jacket sleeve from the shoulder (0, 0) out along +x, bending at the elbow (+bend folds the forearm toward +y, which is
// in toward the body for both arms), then a cuff and a round hand. The root has no outline, so the sleeve grows out of
// the jacket instead of looking glued on.
function hgSleeve(u, sw, col, skin, bend, reach, hook) {
  const A = 1.2 * u, B = 1.1 * u * reach, c = Math.cos(bend), s = Math.sin(bend);
  const E = [A, .03 * u], Hd = [E[0] + c * B, E[1] + s * B];
  const path = [[-.3 * u, 0], [A * .55, .05 * u], E, [E[0] + c * B * .55, E[1] + s * B * .55], Hd];
  const rib = ribbon(path, 1.0 * u, .72 * u), n = rib.length / 2;
  hp(rib, { wash: col, washOp: 255, fill: HG.jacketLt, fillOp: 28, tex: .5, ink: null });
  hl(rib.slice(2, n), sw * .85, PAL.ink, 'ink', .4);
  hl(rib.slice(n, rib.length - 2), sw * .85, PAL.ink, 'ink', .4);
  push(); translate(Hd[0], Hd[1]); rotate(bend);
  hp(rrPts(-.1 * u, -.36 * u, .28 * u, .72 * u, .1 * u), { wash: HG.hoodDk, washOp: 255, ink: PAL.ink, sw: sw * .55 });   // the hoodie cuff
  hp(ellPts(.5 * u, 0, .4 * u, .37 * u, 14), { wash: skin, washOp: 255, ink: PAL.ink, sw: sw * .7 });
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
      else { const ph = Math.sin((o.walk + i * .5) * TAU); if (ph > 0) lift = ph * .5; }
    }
    const x0 = lx + sx, top = -2.0, bot = -.5 - lift;
    const pc = far ? HG.pantsDk : HG.pants;
    hp(P([[x0 - .5, top], [x0 + .5, top], [x0 + .45, bot], [x0 - .45, bot]]), { wash: pc, washOp: 255, ink: PAL.ink, sw: sw * .75 });
    const toe = vname === 'side' ? .55 : vname === 'q' ? .25 : vname === 'qback' ? -.25 : 0;
    const shoeW = vname === 'side' ? 1.5 : 1.22, cx = x0 + toe * .5, cy = bot - .02;
    hp(rrPts((cx - shoeW / 2) * u, (cy - .02) * u, shoeW * u, .58 * u, .28 * u), { wash: far ? mixCol(HG.shoe, HG.sole, .6) : HG.shoe, washOp: 255, ink: PAL.ink, sw: sw * .7 });
    hl(P([[cx - shoeW / 2 + .12, cy + .38], [cx + shoeW / 2 - .12, cy + .38]]), sw * .4, HG.sole, 'inkfine', 0);
  });
}

// The open jacket over the hoodie: the hood bunched round the neck, the hoodie showing down the middle with its two
// drawstrings, and the jacket's two front panels with notched lapels. Back views show the hood hanging down the back.
function hgBody(u, sw, V, vname, skin, skinDk) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]), w = V.bw, J = u * .04;
  const front = vname === 'front' || vname === 'q', c = vname === 'q' ? .45 : 0, k = vname === 'q' ? .86 : 1;
  const X = a => c + a * k;   // front-view x → this view
  // the jacket's silhouette
  let jacket;
  if (vname === 'side') jacket = P([[-1.55, -4.85], [-1.9, -4.2], [-2.05, -3.0], [-1.95, -1.75], [1.95, -1.75], [2.1, -2.7], [2.0, -3.9], [1.55, -4.75], [.3, -5.05]]);
  else {
    const L = vname === 'q' ? .93 : vname === 'qback' ? 1.04 : 1, R = vname === 'q' ? 1.04 : vname === 'qback' ? .93 : 1;
    jacket = P([[-1.6 * w * L, -4.98], [-2.15 * w * L, -4.72], [-2.5 * w * L, -4.25], [-2.65 * w * L, -3.4], [-2.62 * w * L, -2.25], [-2.5 * w * L, -1.72],
                [2.5 * w * R, -1.72], [2.62 * w * R, -2.25], [2.65 * w * R, -3.4], [2.5 * w * R, -4.25], [2.15 * w * R, -4.72], [1.6 * w * R, -4.98], [.8 * w, -5.12], [-.8 * w, -5.12]]);
  }
  hp(jacket, { wash: HG.jacket, washOp: 255, ink: null, curv: .45 });
  hp(ellPts((vname === 'side' ? .1 : vname === 'q' ? .4 : -.6) * u, -3.9 * u, 1.6 * u * w, .9 * u, 18, J * 2, -.1), { fill: HG.jacketLt, fillOp: 90, bleed: .22, tex: .8, border: .7, ink: null });

  if (front) {
    // the hoodie down the middle
    const hz = P([[X(-.82), -5.0], [X(.82), -5.0], [X(.88), -1.74], [X(-.88), -1.74]]);
    hp(hz, { wash: HG.hood, washOp: 255, ink: null });
    hp(P([[X(-.85), -2.25], [X(.85), -2.25], [X(.85), -1.76], [X(-.85), -1.76]]), { fill: HG.hoodDk, fillOp: 120, bleed: .03, tex: .5, ink: null });
    // the jacket's front panels and lapels
    for (const s of [-1, 1]) {
      const panel = P([[X(s * .82), -4.95], [X(s * 2.15), -4.72], [X(s * 2.55), -4.2], [X(s * 2.6), -3.1], [X(s * 2.5), -1.72], [X(s * .88), -1.72], [X(s * .9), -3.05]]);
      hp(panel, { wash: HG.jacket, washOp: 255, ink: null, curv: .2 });
      const lapel = P([[X(s * .84), -4.98], [X(s * 1.6), -4.8], [X(s * 1.42), -4.45], [X(s * 1.78), -4.3], [X(s * .92), -3.1]]);
      hp(lapel, { wash: mixCol(HG.jacket, HG.jacketLt, .12), washOp: 255, ink: PAL.ink, sw: sw * .7 });
      hl(P([[X(s * .9), -3.08], [X(s * .9), -1.75]]), sw * .7, PAL.ink, 'ink', 0);   // the opening's edge below the lapel
    }
  } else if (vname === 'side') {
    hl(P([[1.55, -4.7], [1.75, -3.9], [1.95, -3.05]]), sw * .6, PAL.ink, 'ink', .3);   // the lapel's edge
  }
  hp(jacket, { ink: PAL.ink, sw, curv: .45 });
  if (vname === 'back' || vname === 'qback') {   // the hood hanging down the back, and the back seam
    const hk = P([[-1.75, -5.05], [1.75, -5.05], [1.45, -3.95], [0, -3.4], [-1.45, -3.95]]);
    hp(hk, { wash: HG.hood, washOp: 255, ink: PAL.ink, sw: sw * .7, curv: .4 });
    hl(P([[-1.0, -4.85], [0, -4.05], [1.0, -4.85]]), sw * .45, HG.hoodDk, 'inkfine', .4);
    hl(P([[0, -3.35], [0, -1.8]]), sw * .45, mixCol(HG.jacket, PAL.ink, .5), 'inkfine', 0);
  }
  // the hood bunched round the neck, then the neck
  if (vname !== 'back' && vname !== 'qback') {
    const hx = vname === 'side' ? -.9 : c;
    hp(P([[hx - 2.3 * w, -4.45], [hx - 2.25 * w, -5.0], [hx - 1.85 * w, -5.5], [hx - 1.3 * w, -5.8], [hx - .6 * w, -5.88], [hx + .6 * w, -5.88], [hx + 1.3 * w, -5.8], [hx + 1.85 * w, -5.5], [hx + 2.25 * w, -5.0], [hx + 2.3 * w, -4.45],
             [hx + 1.6 * w, -4.38], [hx + 1.0 * w, -4.75], [hx, -4.2], [hx - 1.0 * w, -4.75], [hx - 1.6 * w, -4.38]]),
      { wash: HG.hood, washOp: 255, fill: HG.hoodLt, fillOp: 40, tex: .5, ink: PAL.ink, sw: sw * .8, curv: .4 });
    if (vname !== 'side') for (const s of [-1, 1]) hl(P([[hx + s * 1.05 * w, -5.5], [hx + s * 1.45 * w, -5.05], [hx + s * 1.7 * w, -4.6]]), sw * .5, HG.hoodDk, 'ink', .4);   // the hood's inner fold
  }
  hgNeck(u, sw, vname, skin, skinDk, c);
  if (front) {   // the hood's crossover V and the drawstrings
    hl(P([[X(-.95), -4.95], [X(0), -4.15], [X(.95), -4.95]]), sw * .6, PAL.ink, 'ink', .2);
    for (const s of [-1, 1]) {
      hl(P([[X(s * .42), -4.6], [X(s * .44), -4.0], [X(s * .46), -3.55]]), sw * .55, HG.cord, 'inkfine', .3);
      hp(ellPts(X(s * .46) * u, -3.48 * u, .07 * u, .1 * u, 8), { wash: HG.cord, ink: null });
    }
  }
}

function hgNeck(u, sw, vname, skin, skinDk, c) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]);
  const nx = vname === 'side' ? .25 : vname === 'q' ? c + .15 : 0, nw = vname === 'side' ? .8 : .95;
  if (vname === 'back' || vname === 'qback') {
    hp(P([[nx - nw, -5.75], [nx + nw, -5.75], [nx + nw, -5.0], [nx - nw, -5.0]]), { wash: mixCol(skin, skinDk, .25), washOp: 255, ink: PAL.ink, sw: sw * .6 });
    return;
  }
  const neck = P([[nx - nw, -5.6], [nx + nw, -5.6], [nx + nw, -4.75], [nx, -4.45], [nx - nw, -4.75]]);
  hp(neck, { wash: skin, washOp: 255, ink: null });
  hp(P([[nx - nw, -5.6], [nx + nw, -5.6], [nx + nw, -5.12], [nx - nw, -4.86]]), { wash: mixCol(skin, skinDk, .6), washOp: 255, ink: null });   // the jaw's shadow on the neck
  hl(P([[nx - nw, -5.55], [nx - nw, -4.78]]), sw * .7, PAL.ink, 'ink', 0);
  hl(P([[nx + nw, -5.55], [nx + nw, -4.78]]), sw * .7, PAL.ink, 'ink', 0);
}

// ---------- head ----------
function hgHead(u, sw, V, vname, o, skin, skinDk, capPop, rs) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]), F = V.face, J = u * .035;
  const sidev = vname === 'side';
  const ears = () => {
    rs('ears');
    for (const ex of V.ears) {
      const e = Math.sign(ex) || 1, toward = sidev ? 1 : -e;
      hp(ellPts(ex * u, -7.94 * u, .68 * u, .78 * u, 16, J * .4), { wash: skin, washOp: 255, ink: PAL.ink, sw: sw * .8 });
      hp(ribbon(P([[ex - toward * .05, -8.12], [ex + toward * .2, -7.92], [ex + toward * .4, -7.72]]), .14 * u, .1 * u), { wash: skinDk, washOp: 255, ink: null });
    }
  };
  if (V.back) {   // the back of the head: short dark hair under the cap, the ears, then the nape
    ears();
    rs('hairback'); hgHairBack(u, sw, vname, J);
  } else {
    rs('temples');
    if (!sidev) for (const s of (vname === 'q' ? [-1] : [-1, 1])) hp(ellPts((F.cx * .3 + s * 2.72) * u, -9.3 * u, .28 * u, .46 * u, 14, J * .5), { wash: HG.hair, washOp: 255, ink: PAL.ink, sw: sw * .45 });
    else { rs('hairside'); hgHairSide(u, sw, J); }
    if (!sidev) ears();
    rs('face');
    const face = sidev ? hgProfile(u) : hgFaceShape(u, vname === 'q' ? .3 : 0);
    hp(face, { wash: skin, washOp: 255, ink: null });
    hp(P([[F.cx - 2.75 * F.fw, -9.5], [F.cx - 1.5 * F.fw, -10.15], [F.cx, -10.45], [F.cx + 1.5 * F.fw, -10.15], [F.cx + 2.75 * F.fw, -9.5], [F.cx + 2.6 * F.fw, -9.22], [F.cx + 1.5 * F.fw, -9.78], [F.cx, -10.02], [F.cx - 1.5 * F.fw, -9.78], [F.cx - 2.6 * F.fw, -9.22]]), { wash: mixCol(skin, skinDk, .5), washOp: 255, ink: null, curv: .4 });   // the brim's shadow on the forehead
    hp(ellPts(F.cx * u, -6.95 * u, 1.7 * u * F.fw, .75 * u, 16, J), { fill: HG.skinLt, fillOp: 70, bleed: .2, tex: .6, border: .6, ink: null });
    hp(face, { ink: PAL.ink, sw });
    if (sidev) ears();
  }

  if (F) {
    push(); translate(F.cx * u, 0); scale(F.fw, 1);
    const b = o.blush === true ? 1 : o.blush || 0;
    if (b > .02) for (const s of F.sides) {   // cheeks, only when the mood calls for them
      const bx = s * 1.95 * u;
      hp(ellPts(bx, -6.95 * u, .5 * u, .24 * u, 14), { fill: HG.blush, fillOp: 170 * clamp(b), bleed: .2, ink: null });
      if (b > .6) for (let q = 0; q < 3; q++) hl([[bx - .3 * u + q * .25 * u, -6.8 * u], [bx - .16 * u + q * .25 * u, -7.1 * u]], sw * .35, mixCol(PAL.rose, PAL.ink, .3), 'inkfine', 0);
    }
    if (o.gloom > .02) {
      hp(rectPts(-2.3 * u, -10.2 * u, 4.6 * u, 1.05 * u, u * .04), { fill: PAL.indigo, fillOp: 150 * o.gloom, bleed: .08, tex: .5, border: .6, ink: null });
      for (let i = 0; i < 6; i++) { const gx = lerp(-1.9 * u, 1.9 * u, i / 5); hl([[gx, -10.1 * u], [gx + jit(u * .04), (-10.1 + 1.1 * o.gloom * (.7 + .3 * hash(i))) * u]], sw * .45, PAL.ink, 'inkfine', 0); }
    }
    rs('eyes'); hgEyes(u, o, sw, F.sides, skin);
    rs('nose');
    if (!sidev) hp(ribbon(P([[-.07, -7.94], [-.06, -7.65], [-.05, -7.36]]), .17 * u, .15 * u), { wash: HG.nose, washOp: 255, ink: null });
    rs('mouth'); hgMouth(u, o, sw, sidev);
    pop();
  }
  if (F && !o.noGlasses) { rs('glasses'); hgGlasses(u, o, sw, F); }

  // the cap: on his head, or jumping off it in a fury (showing the short hair under it)
  if (!o.noCap && (!o.hat || o.hat === 'cap')) {
    if (capPop > .02) { rs('hairtop'); hgHairTop(u, sw, J); }
    rs('cap');
    push();
    if (capPop > 0) { translate(-.4 * capPop * u, -2.3 * capPop * u); rotate(-.35 * capPop); }
    hgCap(u, sw, vname, J, o.bunny);
    pop();
  } else if (o.hat && o.hat !== 'none') {
    rs('hat'); hgHairTop(u, sw, J);
    const k = .66; push(); translate(0, (-11.0 + 8 * k) * u); scale(k); hat(u, o.hat, sw / k); pop();
  } else { rs('hairtop'); hgHairTop(u, sw, J); }
  // brows go on last, so a raised brow can ride up over the brim, the cartoon way
  if (F) { push(); translate(F.cx * u, 0); scale(F.fw, 1); rs('brows'); hgBrows(u, o, sw, F.sides); pop(); }
}

// The face from the front: a broad, round jaw, straight sides under the ears, the top hidden under the brim.
// shift moves the chin toward the heading in the 3/4 view.
function hgFaceShape(u, shift = 0) {
  const R = [[0, -10.6], [1.6, -10.35], [2.55, -9.4], [2.62, -8.3], [2.6, -7.52], [2.52, -6.87], [2.36, -6.45], [2.08, -6.08], [1.78, -5.82], [1.38, -5.58], [.78, -5.36], [0, -5.26]];
  const pts = [...R, ...R.slice(1, -1).reverse().map(([a, b]) => [-a, b])];
  return through(pts.map(([a, b]) => [(a + shift * clamp((b + 8.3) / 3, 0, 1)) * u, b * u]), 3);
}

// The face in profile, facing right: forehead under the brim, a small nose, lips and a round chin.
function hgProfile(u) {
  const pts = [];
  for (let i = 0; i <= 14; i++) { const a = Math.PI * .5 + i / 14 * Math.PI * .95; pts.push([Math.cos(a) * 2.6 * u, -7.9 * u + Math.sin(a) * 2.6 * u]); }
  pts.push(...[[.4, -10.55], [1.6, -10.3], [2.35, -9.55], [2.55, -8.6], [2.62, -8.0], [2.95, -7.62], [2.6, -7.4], [2.62, -6.95], [2.5, -6.55], [2.35, -6.05], [1.85, -5.55], [1.0, -5.3], [.1, -5.35]].map(([a, b]) => [a * u, b * u]));
  return pts;
}

// In profile the back of the head is short dark hair, from under the cap down to the nape, with a sideburn by the ear.
function hgHairSide(u, sw, J) {
  const P = pts => pts.map(([a, b]) => [a * u + jit(J), b * u + jit(J)]);
  hp(P([[-2.75, -10.0], [-2.9, -9.0], [-2.75, -8.0], [-2.45, -7.0], [-2.05, -6.3], [-1.55, -6.0], [-1.2, -6.5], [-.9, -7.1], [-.55, -7.5], [.15, -7.6], [.35, -8.5], [.6, -9.2], [.9, -10.05]]), { wash: HG.hair, washOp: 255, fill: HG.hairLt, fillOp: 30, tex: .6, ink: PAL.ink, sw: sw * .8, curv: .3 });
}
// From behind (and 3/4 behind): short dark hair under the cap, ending at the nape above the hood.
function hgHairBack(u, sw, vname, J) {
  const P = pts => pts.map(([a, b]) => [a * u + jit(J), b * u + jit(J)]);
  const off = vname === 'qback' ? -.2 : 0;
  const pts = [[-2.85, -10.0], [-2.95, -8.9], [-2.8, -7.6], [-2.4, -6.6], [-1.6, -5.95], [-.8, -5.75], [0, -5.7], [.8, -5.75], [1.6, -5.95], [2.4, -6.6], [2.8, -7.6], [2.95, -8.9], [2.85, -10.0]].map(([a, b]) => [a + off, b]);
  hp(P(pts), { wash: HG.hair, washOp: 255, fill: HG.hairLt, fillOp: 35, tex: .6, ink: PAL.ink, sw: sw * .8, curv: .4 });
  for (let i = 0; i < 4; i++) hl([[(off - 1.5 + i * 1.0) * u, -9.6 * u], [(off - 1.4 + i * 1.0 + .2 * hash(i)) * u, -7.0 * u]], sw * .35, HG.hairLt, 'inkfine', .3);
}
// Without the cap: short dark hair, a soft dome.
function hgHairTop(u, sw, J) {
  const pts = [];
  for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI, r = 1 + (i % 2 ? .04 : -.01); pts.push([Math.cos(a) * 2.95 * r * u, -9.6 * u + Math.sin(a) * 1.75 * r * u]); }
  hp(pts.map(([a, b]) => [a + jit(J), b + jit(J)]), { wash: HG.hair, washOp: 255, ink: PAL.ink, sw: sw * .8 });
}

// The cap: a tall crown with a centre seam, two side seams and a button, and a curved brim. From the front the brim is
// an arched band across the forehead; turned, it becomes a bill pointing the way he faces.
function hgCap(u, sw, vname, J, bunny) {
  const P = pts => pts.map(([a, b]) => [a * u, b * u]);
  const off = vname === 'side' ? -.25 : vname === 'q' ? -.2 : vname === 'qback' ? .15 : 0;
  const crownR = [[0, -13.14], [1.35, -12.95], [2.45, -12.35], [3.0, -11.5], [3.2, -10.6], [3.15, -9.95]];
  const crown = through([...crownR.slice().reverse().map(([a, b]) => [-a, b]), ...crownR.slice(1)].map(([a, b]) => [(a + off) * u, b * u]), 4);
  crown.push([(off + 2.6) * u, -9.75 * u], [(off - 2.6) * u, -9.75 * u]);
  const brims = {
    front: [[-2.95, -9.75], [-2.6, -10.3], [-1.5, -10.9], [0, -11.1], [1.5, -10.9], [2.6, -10.3], [2.95, -9.75], [2.7, -9.55], [2.24, -9.6], [1.88, -9.83], [1.6, -10.09], [0, -10.48], [-1.6, -10.09], [-1.88, -9.83], [-2.24, -9.6], [-2.7, -9.55]],
    q:     [[-2.65, -9.75], [-2.4, -10.15], [-.6, -10.95], [1.4, -11.15], [3.2, -10.85], [4.35, -10.3], [4.2, -10.05], [3.1, -10.2], [1.4, -10.4], [-.4, -10.3], [-2.2, -9.65]],
    side:  [[.9, -10.3], [2.6, -10.62], [4.3, -10.5], [5.25, -10.18], [5.05, -9.96], [3.6, -10.06], [1.8, -10.0], [.8, -9.95]],
    qback: [[2.35, -10.05], [3.5, -10.25], [4.2, -10.1], [3.85, -9.88], [2.75, -9.9]],
  };
  const brim = brims[vname];
  const drawBrim = () => {
    const B = P(brim), n = brim.length, half = vname === 'front' ? 7 : Math.ceil(n / 2);
    hp(B, { wash: HG.capDk, washOp: 255, ink: null, curv: .4 });
    // the brim's top surface: a lighter band along its upper edge, wider toward the ends where the bill curves away
    const topEdge = B.slice(0, half), inner = topEdge.map(([a, b], i) => [a, b + u * (.18 + .1 * Math.abs(i - (half - 1) / 2) / ((half - 1) / 2))]).reverse();
    hp(topEdge.concat(inner), { wash: mixCol(HG.cap, HG.capLt, .45), washOp: 255, ink: null, curv: .4 });
    hl(inner.slice().reverse(), sw * .5, PAL.ink, 'ink', .5);
    hp(B, { ink: PAL.ink, sw: sw * .9, curv: .4 });
  };
  if (brim && vname === 'qback') drawBrim();
  hp(crown, { wash: HG.cap, washOp: 255, ink: null });
  hp(ellPts((off - 1.1) * u, -12.1 * u, 1.3 * u, .6 * u, 16, J, -.3), { fill: HG.capLt, fillOp: 110, bleed: .2, tex: .8, border: .7, ink: null });
  hp(crown, { ink: PAL.ink, sw });
  const seam = mixCol(HG.cap, PAL.ink, .55);
  if (vname !== 'back' && vname !== 'qback') {
    hl(P([[off, -12.95], [off + .02, -12.3], [off + .02, -11.6]]), sw * .6, seam, 'ink', .3);
    for (const s of [-1, 1]) hl(P([[off + s * 1.85, -12.75], [off + s * 2.55, -11.8], [off + s * 2.75, -10.55]]), sw * .5, seam, 'ink', .6);
  } else {   // the strap opening at the back, showing hair, and the strap across it
    const bx = vname === 'qback' ? off - .35 : 0;
    hp(P([[bx - .8, -9.85], [bx - .65, -10.5], [bx, -10.75], [bx + .65, -10.5], [bx + .8, -9.85]]), { wash: HG.hair, washOp: 255, ink: PAL.ink, sw: sw * .55, curv: .4 });
    hp(P([[bx - .95, -10.05], [bx + .95, -10.05], [bx + .95, -9.82], [bx - .95, -9.82]]), { wash: HG.capDk, washOp: 255, ink: PAL.ink, sw: sw * .5 });
    for (const s of [-1, 1]) hl(P([[bx + s * 1.3, -13.0], [bx + s * 2.2, -11.9], [bx + s * 2.5, -10.1]]), sw * .5, seam, 'ink', .6);
  }
  hp(ellPts(off * u, -13.2 * u, .36 * u, .14 * u, 10), { wash: HG.capDk, washOp: 255, ink: PAL.ink, sw: sw * .6 });
  if (bunny && (vname === 'front' || vname === 'q')) bunnyMark((off + (vname === 'q' ? .7 : 0)) * u, -12.0 * u, .7 * u, vname === 'q' ? .85 : 1, HG.bunny);
  if (brim && vname !== 'qback') drawBrim();
}

// The white bunny badge of 问问黑哥 (optional on the cap): a round head and two long ears. sx squeezes it for turns.
function bunnyMark(cx, cy, s, sx, col, ink = mixCol(col, PAL.ink, .55)) {
  push(); translate(cx, cy); scale(sx, 1);
  for (const e of [-1, 1]) hp(ellPts(e * .2 * s, -.62 * s, .13 * s, .36 * s, 10, 0, e * .18), { wash: col, washOp: 255, ink: null });
  hp(ellPts(0, -.05 * s, .38 * s, .32 * s, 14), { wash: col, washOp: 255, ink: null });
  if (s > 6) for (const e of [-1, 1]) hp(ellPts(e * .13 * s, -.08 * s, .035 * s, .045 * s, 6), { wash: ink, ink: null });
  pop();
}

// ---------- face parts ----------
// Rounded square lenses at (±1.33u, -8.12u), 2.2u wide and 1.7u tall, joined by an arched bridge at the top, with the
// temples running back to the ears. The frame weight scales with u, so they stay glasses at every size.
function hgGlasses(u, o, sw, F) {
  push(); translate(F.cx * u, 0); scale(F.fw, 1);
  const shades = (Array.isArray(o.eyes) ? o.eyes[0] : o.eyes) === 'shades', fsw = clamp(u * .034, .45, 2.2) / Math.sqrt(HGS.line);
  for (const s of F.sides) {
    const lens = rrPts((s * 1.33 - 1.1) * u, -8.97 * u, 2.2 * u, 1.7 * u, .74 * u);
    if (shades) hp(lens, { wash: '#2A2740', washOp: 255, ink: null });
    hp(lens, { ink: PAL.ink, sw: fsw, curv: .5 });
    if (shades) hl([[(s * 1.33 - .65) * u, -8.35 * u], [(s * 1.33 - .25) * u, -8.72 * u]], sw * .5, PAL.cream, 'inkfine', 0);
  }
  if (F.sides.length > 1) {
    hl([[-.24 * u, -8.68 * u], [0, -8.8 * u], [.24 * u, -8.68 * u]], fsw * .9, PAL.ink, 'ink', .5);
    for (const s of [-1, 1]) hl([[s * 2.42 * u, -8.65 * u], [s * 2.85 * u, -8.6 * u]], fsw * .8, PAL.ink, 'ink', 0);
  } else hl([[(1.33 - 1.1) * u, -8.7 * u], [-4.0 * u, -8.55 * u]], fsw * .8, PAL.ink, 'ink', 0);   // profile: the arm runs back to the ear (scaled by fw)
  pop();
}

// Thick brows: the avatar's confident arch at rest, and the main way his face acts.
function hgBrows(u, o, sw, sides) {
  const kinds = Array.isArray(o.eyes) ? o.eyes : [o.eyes || 'normal', o.eyes || 'normal'];
  const drop = (o.squint || 0) * .15;
  for (const s of sides) {
    const e = kinds[s < 0 ? 0 : 1];
    let pts;   // [outer, peak, inner] in front-view |x|; s mirrors them
    if (['angry', 'determined', 'red'].includes(e)) pts = e === 'determined' ? [[2.05, -9.6], [1.4, -9.55], [.57, -9.18]] : [[2.05, -9.75], [1.38, -9.5], [.6, -8.98]];
    else if (['sad', 'teary', 'cry', 'scared'].includes(e)) pts = [[2.05, -9.1], [1.35, -9.4], [.6, -9.75]];
    else if (['wide', 'blank', 'shine', 'spark', 'heart', 'swirl'].includes(e)) pts = [[2.05, -9.62], [1.43, -10.0], [.57, -9.66]];
    else if (['happy', 'closed', 'squeeze', 'x'].includes(e)) pts = [[2.05, -9.42], [1.43, -9.75], [.57, -9.45]];
    else if (e === 'narrow') pts = [[2.05, -9.22], [1.43, -9.36], [.57, -9.22]];
    else pts = [[2.05, -9.33], [1.33, -9.66], [.57, -9.4]];
    const path = pts.map(([a, b]) => [s * a * u, (b + drop) * u]);
    hp(ribbon(path, .27 * u, .33 * u), { wash: PAL.ink, washOp: 255, ink: null });   // a little thinner at the outer end
  }
}

// The mouth. At rest it's his smirk: a short line that flicks up at the right end.
function hgMouth(u, o, sw, sidev) {
  const m = o.mouth || (o.lid > .05 ? 'teeth' : 'smirk'), k = .6;
  push(); translate((sidev ? .55 : 0) * u, 0);
  if (m === 'smirk') hl([[-.46 * u, -6.56 * u], [0, -6.58 * u], [.42 * u, -6.63 * u], [.6 * u, -6.75 * u]], sw * .72 / Math.sqrt(HGS.line), PAL.ink, 'ink', .45);
  else if (m === 'teeth') {   // gritted teeth: a rounded slot with one line, cleaner than a grid at this size
    hp(rrPts(-.48 * u, -6.78 * u, .96 * u, .36 * u, .12 * u), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: sw * .6 });
    hl([[-.42 * u, -6.6 * u], [.42 * u, -6.6 * u]], sw * .4, PAL.ink, 'inkfine', 0);
  } else { translate(.05 * u, -6.66 * u + 4.3 * k * u); mouth(u * k, m, sw * .9); }
  pop();
}

// Small oval eyes in the inner top of each lens, like the avatar. The rest borrow Clawd's eye() at a smaller size.
function hgEyes(u, o, sw, sides, skin) {
  const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['happy', 'normal'] : [o.eyes || 'normal', o.eyes || 'normal'];
  if (kinds[0] === 'shades') return;
  const sqz = clamp(o.squint || 0);
  if (sqz > .8 || (o.smear || 0) > .5) { for (const s of sides) hl([[s * 1.17 * u - .32 * u, -8.25 * u], [s * 1.17 * u, -8.2 * u], [s * 1.17 * u + .32 * u, -8.25 * u]], sw * 1.1, PAL.ink, 'ink', .5); return; }
  for (const s of sides) {
    push(); translate(s * 1.17 * u, -8.3 * u);
    if (sqz > 0) scale(1 + sqz * .12, 1 - sqz);
    hgEye(kinds[s < 0 ? 0 : 1], s, u, o, sw, skin);
    pop();
  }
}
function hgEye(e, s, u, o, sw, skin = HG.skin) {
  const lx = (o.lookX || 0) * u * .2, ly = (o.lookY || 0) * u * .15, ek = HGS.eyeK;
  const oval = (rx, ry, hi = 0) => {
    rx *= ek; ry *= ek; hi = Math.max(hi, HGS.eyeHi);
    hp(ellPts(lx, ly, rx * u, ry * u, 14), { wash: HGS.ink, washOp: 255, ink: null });
    if (hi && u > 7) {
      hp(ellPts(lx - rx * .3 * u, ly - ry * .38 * u, rx * .34 * u * hi, rx * .34 * u * hi, 10), { wash: PAL.cream, washOp: 240, ink: null });
      hp(ellPts(lx + rx * .28 * u, ly + ry * .35 * u, rx * .15 * u * hi, rx * .15 * u * hi, 8), { wash: PAL.cream, washOp: 220, ink: null });
    }
  };
  const line = (pts, w = 1.1, c = .5) => hl(pts.map(([a, b]) => [a * u, b * u]), sw * w, PAL.ink, 'ink', c);
  const blink = ['normal', 'look', 'wide', 'shine'].includes(e) && ((T * .9 + (o.seed || 0) * 1.7) % 3.3) < .12;
  if (blink) { line([[-.3, .05], [0, .12], [.3, .05]]); return; }
  switch (e) {
    case 'normal': case 'look': oval(.23, .37); break;
    case 'wide': oval(.27, .43, 1); break;
    case 'shine': oval(.3, .44, 1.4); hp(starPts(lx + .17 * u, ly - .3 * u, .13 * u, .35, 4), { wash: PAL.cream, ink: null }); break;
    case 'dot': hp(ellPts(lx * .5, ly * .5, .13 * u, .15 * u, 10), { wash: PAL.ink, ink: null }); break;
    case 'happy': line([[-.34, .14], [0, -.18], [.34, .14]], 1.2); break;
    case 'closed': line([[-.34, -.04], [0, .16], [.34, -.04]], 1.1); break;
    case 'sleepy':
      oval(.22, .35);
      hp(rectPts(-.4 * u, -.5 * u, .8 * u, .5 * u), { wash: skin, washOp: 255, ink: null });
      line([[-.32, 0], [0, -.03], [.32, .01]], 1.1, .3); break;
    case 'narrow': hp(ellPts(lx, ly + .04 * u, .26 * u, .12 * u, 12), { wash: PAL.ink, ink: null }); line([[-.34, -.1], [.34, -.12]], 1, 0); break;
    case 'angry': case 'determined': {   // a skin-coloured lid cuts the top of the eye, lower on the nose side
      oval(.24, .36);
      const cut = e === 'angry' ? .3 : .18, inX = -s * .45, outX = s * .45, yIn = -.28 + cut, yOut = -.28;
      hp([[inX * u, -.6 * u], [outX * u, -.6 * u], [outX * u, yOut * u], [inX * u, yIn * u]], { wash: skin, washOp: 255, ink: null });
      break;
    }
    case 'sad': case 'teary': {   // the lid rises toward the nose: worried
      oval(.22, .34);
      const inX = -s * .45, outX = s * .45;
      hp([[inX * u, -.6 * u], [outX * u, -.6 * u], [outX * u, -.06 * u], [inX * u, -.36 * u]], { wash: skin, washOp: 255, ink: null });
      if (e === 'teary') {
        const w = Math.sin(T * 9 + s) * .03 * u;
        hp(ellPts(0, .32 * u + w, .36 * u, .15 * u, 14), { wash: PAL.sky, washOp: 210, fill: '#FFFFFF', fillOp: 60, ink: PAL.ink, sw: sw * .35 });
      }
      break;
    }
    case 'squeeze': line([[-.3 * -s, -.28], [.26 * -s, 0], [-.3 * -s, .28]], 1.2, 0); break;   // > <
    case 'scared':
      hp(ellPts(0, 0, .36 * u, .45 * u, 16), { wash: PAL.cream, ink: PAL.ink, sw: sw * .6 });
      hp(ellPts((o.lookX || 0) * u * .1 + Math.sin(T * 40) * .025 * u, .04 * u, .11 * u, .14 * u, 10), { wash: PAL.ink, ink: null });
      break;
    case 'blank': hp(ellPts(0, 0, .33 * u, .42 * u, 14), { wash: PAL.cream, ink: PAL.ink, sw: sw * .6 }); break;
    default: eye(e, s, u * .42, o, sw);   // cry, spark, red, heart, x, swirl
  }
}
// A smear drawing: dry-brush streaks and speed lines trailing a fast move.
function hgSmear(x, y, u, k, dir) {
  const sides = dir === 0 ? [-1, 1] : [-dir];
  for (const s of sides) for (let i = 0; i < 5; i++) {
    const yy = y - (11.5 - i * 2.2) * u, x0 = x + s * 2.6 * u, len = (2.5 + 2.5 * hash(i + 7 * s)) * u * k;
    hl([[x0, yy], [x0 + s * len * .5, yy + jit(u * .1)], [x0 + s * len, yy]], 2.2 * k, i < 2 ? HG.cap : HG.jacket, 'dry', .3);
    if (i % 2) hl([[x0 + s * len * .3, yy + .5 * u], [x0 + s * len * 1.1, yy + .5 * u]], .6, PAL.ink, 'inkfine', 0);
  }
}
