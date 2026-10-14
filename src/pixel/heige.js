// pixel/heige.js: 黑哥 (HeiGe) on the pixel rig. heigePx(x, y, o) takes the same options as clawd(): spread feel(),
// emotions(), move(), turn(), stroll(), jump() or take() into it, add pose options after, and he acts them out in
// whole pixels and drawn frames. (x, y) is the ground point between his feet, in buffer pixels.
//
//   heigePx(120, 101, feel('happy', onTwos(t)));
//   heigePx(x, 101, { ...emotions(onTwos(t), [[0, 'neutral'], [1, 'surprised'], [1.6, 'idea']]), ...turn(t, 2, 2.2, .25, 0) });
//
// Views: front, q (three-quarters), side, qback (drawn as back), back; every view faces screen right, flip: true
// mirrors it, the way clawd() does. Pixel-only options on top of clawd()'s:
//   poseL / poseR  an arm frame by name (front view: see HG_EMO_ARMS / the arm sheet), instead of the one aL / aR
//                  picks; 'wave' alternates waveA and waveB
//   capPop         0..1 lifts the cap off his head (big takes do it on their own)
//   brows          a brow stamp (or a pair), instead of the one his emotion picks
// The parts are generated (heige_parts.js, from tools/pixel/build_heige_rig.py); this file decides which ones show.

const HG_U = 4;                       // pixels per Clawd unit: a happy bounce (dy -1.2) lifts him about 5 px
const HGC = {
  pal: HG_PARTS.pal, axis2: 51, ground: 87, outline: 'O', rim: '#4A68B0', rimFrom: ['k', 'c', 'm'],
  skinKeys: ['s', 'S', 'd', 'l'], tintK: .42,
};
const HG_P = HG_PARTS.parts;
const hgSkin = c => c === 's' || c === 'S' || c === 'd' || c === 'l';
// Where the face goes in each view (sprite space). See pxFace() in rig.js for the fields.
const HG_FACE = {
  front: {
    eyes: [[16, 31], [32, 31]], lenses: [[11, 29, 21, 37], [30, 29, 40, 37]], mirror: [false, true],
    brows: [[14, 24], [37, 24]], mouth: [51, 41], cheeks: [[14, 39], [37, 39]], forehead: [13, 23, 38, 27],
    tears: [[14, 39], [36, 39]], skinAt: hgSkin,
  },
  q: {
    eyes: [[21, 31], [32, 31]], lenses: [[16, 29, 26, 37], [32, 29, 39, 37]], mirror: [false, true],
    brows: [[19, 24], [39, 24]], mouth: [58, 41], cheeks: [[19, 39], [37, 39]], forehead: [16, 22, 40, 27],
    tears: [[20, 39], [34, 39]], skinAt: hgSkin,
  },
  side: {   // profile: its own stamp sets (rig.js PX_EYES_SIDE ...), the eye in the 3-pixel lens, the mouth at the front
    eyes: [[35, 31]], lenses: [[35, 29, 37, 37]], mirror: [false], clip: true, eyeSet: PX_EYES_SIDE,
    brows: [[33, 26]], browSet: PX_BROWS_SIDE, browClip: [30, 26, 39, 27],
    mouth: [77, 40], mouthRight: 39, mouthSet: PX_MOUTHS_SIDE, cheeks: [[33, 39]],
    forehead: [27, 26, 39, 27], tears: [[35, 39]], skinAt: hgSkin,
  },
  back: null,
};
// Each view's stack, back to front. FACE = the stamped features; armN / armF = near and far arm (q and side, facing
// right: near = aL, on the screen's left in q); armL / armR = screen left and right arms (front and back).
const HG_VIEWS = {
  front: ['legs', 'hair', 'neck', 'torso', 'face', 'FACE', 'cap', 'armL', 'armR'],
  q:     ['armF', 'legs', 'neck', 'torso', 'face', 'FACE', 'cap', 'armFfront', 'armN'],
  side:  ['legs', 'neck', 'torso', 'face', 'FACE', 'cap', 'armN'],
  back:  ['legs', 'neck', 'face', 'cap', 'torso', 'armL', 'armR'],
};
// Arm frames, by the angle clawd() would raise the arm to (aL / aR: 0 = out, + = up, - = down).
const HG_ARM_BINS = [[.3, 'down'], [.7, 'low'], [.98, 'out'], [1.3, 'up'], [Infinity, 'cheer']];
const hgArmByAngle = a => { for (const [lim, n] of HG_ARM_BINS) if (a < lim) return n; return 'down'; };
// Emotions that read better with a drawn gesture than with an arm angle (front view: screen-left arm, screen-right arm).
const HG_EMO_ARMS = {
  proud: ['hip', 'hip'], cry: ['cover', 'cover'], shy: ['clasp', 'clasp'], hopeful: ['clasp', 'clasp'], love: ['clasp', 'clasp'],
  mischief: ['clasp', 'clasp'], thinking: ['belly', 'chin'], confused: [null, 'scratch'], idea: [null, 'point'], smug: [null, 'hip'],
  cool: ['hip', null], suspicious: [null, 'chin'],
};

// Pose decisions shared by every view: whole-pixel offsets from the option bag.
function hgPose(o) {
  const sq = (o.sq || 0) + (o.take || 0);
  const crouch = sq >= .16 ? 2 : sq >= .07 ? 1 : sq <= -.13 ? -2 : sq <= -.05 ? -1 : 0;
  const lean = clamp(Math.round((o.rot || 0) * 16), -2, 2);
  let step = null, bob = 0;
  if (o.walk != null) {                                   // eight drawings a stride cycle (one cycle = two steps)
    step = ((Math.floor(o.walk * 8) % 8) + 8) % 8;
    bob = step % 4 === 2 || (o.view !== 'side' && step % 4 === 1) ? -1 : 0;           // up a pixel as a leg passes
  }
  return {
    bx: Math.round((o.dx || 0) * HG_U), by: Math.round((o.dy || 0) * HG_U) + bob, step,
    ty: crouch, tx: Math.round(lean / 2),                                      // the torso sinks into a crouch
    hy: crouch + (crouch >= 2 ? 1 : crouch <= -2 ? -1 : 0), hx: lean,          // and the head a little more
    cap: -Math.round(clamp(o.capPop ?? (sq <= -.13 ? .7 : 0)) * 3),            // a big stretch lifts the cap
  };
}

function hgFrontArm(o, side) {
  const own = side === 'L' ? o.poseL : o.poseR;
  if (!own && o.walk != null) return 'down';              // walking toward us, the arms just hang
  let name = own || (o.emo && !o.noPose && HG_EMO_ARMS[o.emo] && HG_EMO_ARMS[o.emo][side === 'L' ? 0 : 1]);
  if (!name) name = hgArmByAngle(side === 'L' ? (o.aL ?? .15) : (o.aR ?? .15));
  if (name === 'wave') name = Math.floor(onTwos(T) * 4) % 2 ? 'waveB' : 'waveA';
  return HG_P['front.arm.' + name] ? name : 'down';
}

// The side view's stride: how far the near leg leans (px at the sole) in each of the eight drawings.
const HG_STRIDE = [6, 3, 0, -3, -6, -3, 0, 3];
const HG_LIFT = ['L1', 'L2', 'L1', '', 'R1', 'R2', 'R1', ''];

// Gestures made in front of the body: a far arm making one crosses in front of the torso instead of hiding behind it.
const HG_FRONT_GESTURES = ['chin', 'cover', 'clasp', 'belly'];
// q / side / back arms. Which of the option bag's arms drives a part: in q and side, armA is the near arm (aL, the way
// clawd() has it facing right) and armB the far one; from the back, armA is on the screen's left: his left arm (aR).
// Walking swings them against the legs; otherwise the same choice as the front: a pose by name, the emotion's
// gesture, or a frame by angle. Frames a view doesn't draw (gestures in front of the body, seen from behind) hang.
function hgViewArmName(view, part, o, q) {
  const useL = view === 'back' ? part === 'armB' : part === 'armA';
  const own = useL ? o.poseL : o.poseR;
  if (!own && q.step != null) {
    if (view === 'back') return 'down';
    const k = view === 'side' ? HG_STRIDE[q.step] : [2, 4, 2, 0, -2, -4, -2, 0][q.step];
    return Math.abs(k) < 2 ? 'down' : (k > 0) === (part === 'armA') ? 'back' : 'fwd';
  }
  const g = o.emo && !o.noPose && HG_EMO_ARMS[o.emo];
  // in profile only the near arm shows, so it makes the emotion's gesture if its own is missing or hidden (belly)
  const gest = !g ? null : view === 'side' ? (g[0] && g[0] !== 'belly' ? g[0] : g[1] || g[0]) : g[useL ? 0 : 1];
  let f = own || gest || hgArmByAngle(useL ? (o.aL ?? .15) : (o.aR ?? .15));
  if (f === 'wave') f = Math.floor(onTwos(T) * 4) % 2 ? 'waveB' : 'waveA';
  return HG_P[`${view}.${part}.${f}`] ? f : 'down';
}

function hgLegs(view, q) {
  if (q.step == null) return HG_P[view + '.legs.stand'];
  const name = view === 'side' ? 'w' + q.step : HG_LIFT[q.step] ? 'step' + HG_LIFT[q.step] : 'stand';
  return HG_P[`${view}.legs.${name}`] || HG_P[view + '.legs.stand'];
}

function heigePx(x, y, o = {}) {
  const view = o.view === 'qback' ? 'back' : HG_VIEWS[o.view] ? o.view : 'front';
  const st = new PxStack(), q = hgPose(o), F = HG_FACE[view];
  for (const layer of HG_VIEWS[view]) {
    switch (layer) {
      case 'legs': st.part(hgLegs(view, q)); break;
      case 'hair': st.part(HG_P[view + '.hair'], q.hx, q.hy + q.cap); break;
      case 'neck': st.part(HG_P[view + '.neck'], q.tx, q.ty); break;
      case 'torso': st.part(HG_P[view + '.torso'], q.tx, q.ty); break;
      case 'face': st.part(HG_P[view + '.face'], q.hx, q.hy); break;
      case 'FACE': pxFace(st, F, o, q.hx, q.hy); break;
      case 'cap': st.part(HG_P[view + '.cap'], q.hx, q.hy + q.cap); break;
      case 'armN': st.part(HG_P[`${view}.armA.${hgViewArmName(view, 'armA', o, q)}`], q.tx, q.ty); break;
      case 'armF': case 'armFfront': {
        const f = hgViewArmName(view, 'armB', o, q), inFront = HG_FRONT_GESTURES.includes(f);
        if (inFront === (layer === 'armFfront')) st.part(HG_P[`${view}.armB.${f}`], q.tx, q.ty);
        break;
      }
      case 'armL': case 'armR': {
        if (view === 'front') {
          const p = HG_P['front.arm.' + hgFrontArm(o, layer === 'armL' ? 'L' : 'R')];
          if (layer === 'armL') st.part(p, q.tx, q.ty);
          else { const m = new PxStack(); m.part(p); for (const [sx, sy, c] of m.each()) st.set(HGC.axis2 - sx + q.tx, sy + q.ty, c); }
        } else { const part = layer === 'armL' ? 'armA' : 'armB'; st.part(HG_P[`${view}.${part}.${hgViewArmName(view, part, o, q)}`], q.tx, q.ty); }
        break;
      }
    }
  }
  // to the buffer (flipped if asked), with the skin tinted for the mood
  const flip = !!o.flip, wx = x + q.bx, wy = y + q.by;
  if (!o.noShadow) hgShadow(x + q.bx, y, (o.dy || 0));
  pxDrawStack(st, wx, wy, HGC, flip, pxSkin(HGC, o));
  // the emote, by the top corner of his head (or over it)
  if (o.emote) {
    const E = PX_EMOTES[o.emote] || {}, dir = flip ? -1 : 1, side = view === 'side' ? 24 : 21;
    const ex = E.top ? wx + q.hx * dir : wx + dir * side - (flip ? 6 : 0), ey = wy - HGC.ground + (E.top ? -2 : 14) + q.hy + q.cap;
    pxEmote(o.emote, ex, ey, o.emoteK ?? 1, o.emoteAge ?? T, dir);
  }
}

// A soft pixel shadow on the ground, shrinking as he leaves it.
function hgShadow(x, y, dy, w0 = 15) {
  const w = Math.max(6, w0 - Math.round(Math.abs(dy) * 1.5));
  for (let i = -w; i <= w; i++) for (let j = -1; j <= 1; j++) {
    if (Math.abs(i) > w - Math.abs(j) * 3) continue;
    const px = x + i, py = y + j; if (px < 0 || py < 0 || px >= PW || py >= PH) continue;
    const k = (py * PW + px) * 4;
    BUF[k] = Math.round(BUF[k] * .62); BUF[k + 1] = Math.round(BUF[k + 1] * .6); BUF[k + 2] = Math.round(BUF[k + 2] * .7); BUF[k + 3] = 255;
  }
}
