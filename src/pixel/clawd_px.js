// pixel/clawd_px.js: pixel Clawd on the same acting options as clawd() and heigePx(). The block body, four legs, two
// arm nubs and the tall eyes are built from rectangles each frame (Clawd is simple enough not to need drawn parts);
// moods swap the eyes and mouth from small stamp sets, and whole-pixel offsets do the bouncing, crouching and lifting.
//   clawdPx(170, 107, { ...feel('happy', onTwos(t)), flip: true });
// (x, y) = the ground point between his feet. Views: front, q (eyes toward the heading), side (facing right), back;
// flip mirrors, as for clawd().

const CPX = {
  pal: { O: '#3A1C17', B: '#D97757', S: '#B85C3F', D: '#9A4A33', L: '#EB9273', H: '#F7BEA0', E: '#24161A', G: '#FFF1E2', M: '#5A2430' },
  axis2: -1, ground: 0, outline: 'O', rimFrom: null, skinKeys: ['B', 'S', 'D', 'L', 'H'], tintK: .5,
};
const CPX_U = 5;
// eyes: 4 wide, centred on each eye's column; drawn for the left eye, mirrored for the right
const CPX_EYES = {
  normal: ['GGEE', 'GGEE', 'EEEE', 'EEEE', 'EEEE', 'EEEE', 'EEEE', 'EEEE', 'EEEE', 'EEEE'],
  wide:   ['GGEEE', 'GGEEE', 'EEEEE', 'EEEEE', 'EEEEE', 'EEEEE', 'EEEEE', 'EEEEE', 'EEEEE', 'EEEEE', 'EEEEE'],
  happy:  ['......', '......', '..EE..', '.EEEE.', 'EE..EE', 'E....E'],
  closed: ['......', '......', '......', '......', 'E....E', 'EE..EE', '.EEEE.'],
  blink:  ['....', '....', '....', '....', '....', '....', '....', 'EEEE', 'EEEE'],
  sleepy: ['....', '....', '....', '....', 'EEEE', 'EEEE', 'EEEE', 'EEEE', 'EEEE', 'EEEE'],
  narrow: ['....', '....', '....', '....', 'EEEE', 'EEEE', 'EEEE', 'EEEE'],
  squeeze:['......', '......', 'EE....', '.EEE..', '...EEE', '.EEE..', 'EE....'],
  x:      ['......', '......', 'E....E', '.E..E.', '..EE..', '..EE..', '.E..E.', 'E....E'],
  heart:  ['.......', '.RR.RR.', 'RWRRRRR', 'RRRRRR$', '.RRRR$.', '..RR$..', '...$...'],
  spark:  ['...A...', '...A...', '..AaA..', 'AAAaAAA', '..AaA..', '...A...', '...A...'],
  dot:    ['....', '....', '....', '.EE.', '.EE.'],
  scared: ['.EEEE.', 'EGGGGE', 'EGGGGE', 'EGEEGE', 'EGEEGE', 'EGGGGE', '.EEEE.'],
  sad:    ['..EE', '.EEE', 'GEEE', 'EEEE', 'EEEE', 'EEEE', 'EEEE', 'EEEE'],
  angry:  ['EE..', 'EEE.', 'GEEE', 'EEEE', 'EEEE', 'EEEE', 'EEEE', 'EEEE'],
};
CPX_EYES.look = CPX_EYES.normal; CPX_EYES.shine = CPX_EYES.wide; CPX_EYES.teary = CPX_EYES.sad; CPX_EYES.cry = CPX_EYES.squeeze;
CPX_EYES.determined = CPX_EYES.angry; CPX_EYES.blank = CPX_EYES.scared; CPX_EYES.red = CPX_EYES.angry; CPX_EYES.swirl = CPX_EYES.x;

function clawdPx(x, y, o = {}) {
  const st = new PxStack(), sq = (o.sq || 0) + (o.take || 0);
  const crouch = sq >= .16 ? 3 : sq >= .07 ? 1 : sq <= -.13 ? -2 : sq <= -.05 ? -1 : 0;
  const dy = Math.round((o.dy || 0) * CPX_U), dx = Math.round((o.dx || 0) * CPX_U);
  let step = null; if (o.walk != null) step = ((Math.floor(o.walk * 4) % 4) + 4) % 4;
  const by = crouch;                                     // the body sinks into a crouch (legs hide under it)
  const R = (x0, y0, w, h, c, ring = 'O') => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) st.set(x0 + i, y0 + j, (i === 0 || j === 0 || i === w - 1 || j === h - 1) && ring ? ring : c); };
  const view = o.view === 'qback' ? 'back' : o.view || 'front';
  if (view === 'side') {                                 // profile, facing right: a narrower block, one eye, one arm
    const sw = step == null ? 0 : step === 0 ? 3 : step === 2 ? -3 : 0;
    [[-9, sw, 'far'], [7, -sw, 'far'], [-11, -sw, 'near'], [5, sw, 'near']].forEach(([lx, k, which]) => {
      const lift = k > 0 ? 2 : 0;
      R(lx + k, -14 - lift, 5, 14, which === 'far' ? 'S' : 'D');
    });
    R(-15, -41 + by, 30, 31, 'B');
    for (let i = -14; i < 14; i++) { st.set(i, -40 + by, 'L'); st.set(i, -39 + by, 'L'); st.set(i, -14 + by, 'S'); st.set(i, -13 + by, 'S'); st.set(i, -12 + by, 'D'); }
    for (let j = -38; j < -14; j++) { st.set(-14, j + by, 'S'); st.set(-13, j + by, 'S'); }
    for (let i = -9; i < -3; i++) st.set(i, -39 + by, 'H');
    const a = o.aL ?? .15, nub = (x0, y0, w, h) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) st.set(x0 + i, y0 + j + by, i === 0 || j === 0 || i === w - 1 || j === h - 1 ? 'O' : 'B'); };
    if (a > 1.05) { nub(8, -45, 6, 6); nub(7, -40, 6, 7); } else if (a > .35) nub(13, -31, 8, 6); else nub(-3, -26, 6, 7);
    const k = Array.isArray(o.eyes) ? o.eyes[1] : o.eyes === 'wink' ? 'normal' : o.eyes || 'normal';
    const blinkS = ((onTwos(T) * .9 + (o.seed || 0) * 1.7) % 3.3) < .1;
    if (k === 'shades') { for (let i = 2; i < 15; i++) for (let j = -35; j < -29; j++) st.set(i, j + by, j === -35 ? 'O' : 'K'); }
    else st.rows(CPX_EYES[(o.squint || 0) > .7 || (blinkS && ['normal', 'look', 'wide', 'shine'].includes(k)) ? 'blink' : k] || CPX_EYES.normal, 5, -35 + by);
    const ms = PX_MOUTHS_SIDE[o.mouth]; if (ms) st.rows(ms.rows, 13 - ms.rows[0].length + 1, -22 + by + (ms.dy || 0));
    const flipS = !!o.flip, wxs = x + dx, wys = y + dy;
    if (!o.noShadow) hgShadow(x + dx, y, o.dy || 0, 18);
    pxDrawStack(st, wxs, wys, CPX, flipS, pxSkin(CPX, o), false);
    if (o.emote) { const E = PX_EMOTES[o.emote] || {}, dir = flipS ? -1 : 1; pxEmote(o.emote, E.top ? wxs : wxs + dir * 18 - (flipS ? 6 : 0), wys - 42 + (E.top ? -2 : 0) + by, o.emoteK ?? 1, o.emoteAge ?? T, dir); }
    return;
  }
  // legs: a walk lifts the diagonal pairs in turn
  [-21, -10, 5, 16].forEach((lx, i) => {
    const lift = step == null ? 0 : (step === 0 && i % 2 === 0) || (step === 2 && i % 2 === 1) ? 2 : 0;
    R(lx, -14 - lift, 5, 14, 'D'); for (let j = -10 - lift; j < -2 - lift; j++) st.set(lx + 1, j, 'S');   // tall enough to hide under a stretch
  });
  // the body, lit from the top left
  R(-25, -41 + by, 50, 31, 'B');
  for (let i = -24; i < 24; i++) { st.set(i, -40 + by, 'L'); st.set(i, -39 + by, 'L'); st.set(i, -15 + by, 'S'); st.set(i, -14 + by, 'S'); st.set(i, -13 + by, 'S'); st.set(i, -12 + by, 'D'); }
  for (let j = -38; j < -15; j++) { st.set(-24, j + by, 'L'); st.set(-23, j + by, 'L'); st.set(21, j + by, 'S'); st.set(22, j + by, 'S'); st.set(23, j + by, 'S'); }
  for (let i = -22; i < -16; i++) st.set(i, -39 + by, 'H');
  for (let j = -37; j < -33; j++) st.set(-23, j + by, 'H');
  // arms: three drawn frames each, picked by angle (Clawd's arms are nubs: down, out, up)
  const arm = (a, s) => {
    const f = a > 1.05 ? 'up' : a > .35 ? 'out' : 'down', X = v => s < 0 ? v : -1 - v - 0;   // mirror for the right arm
    const box = (x0, y0, w, h) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const xx = X(x0 + i); st.set(xx, y0 + j + by, i === 0 || j === 0 || i === w - 1 || j === h - 1 ? 'O' : j === h - 2 ? 'S' : 'B'); } };
    if (f === 'up') { box(-31, -41, 6, 6); box(-30, -36, 6, 7); }
    else if (f === 'out') box(-32, -31, 8, 6);
    else box(-30, -26, 6, 7);
  };
  arm(o.aL ?? .15, -1); arm(o.aR ?? .15, 1);
  if (view === 'q') for (let j = -38; j < -15; j++) for (let i = -24; i < -18; i++) st.set(i, j + by, 'S');
  // eyes and mouth (none from behind)
  if (view === 'back') o = { ...o, eyes: 'none', mouth: null, blush: 0 };
  const qs = view === 'q' ? 4 : 0;
  const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['happy', 'normal'] : [o.eyes || 'normal', o.eyes || 'normal'];
  const blink = ((onTwos(T) * .9 + (o.seed || 0) * 1.7) % 3.3) < .1;
  const lx = Math.round(clamp(o.lookX || 0, -1, 1) * 2), ly = Math.round(clamp(o.lookY || 0, -1, 1) * 2);
  if (kinds[0] === 'shades') {
    for (let i = -18; i < 18; i++) for (let j = -35; j < -28; j++) st.set(i, j + by, j === -35 ? 'O' : 'K');
    st.set(-15, -33 + by, 'W'); st.set(-14, -34 + by, 'W'); st.set(9, -33 + by, 'W'); st.set(10, -34 + by, 'W');
  } else if (kinds[0] !== 'none') [[-14 + qs, false], [10 + qs, true]].forEach(([ex, mir], i) => {
    let k = kinds[Math.min(i, kinds.length - 1)];
    if ((o.squint || 0) > .7 || (blink && ['normal', 'look', 'wide', 'shine'].includes(k))) k = 'blink';
    const rows = CPX_EYES[k] || CPX_EYES.normal, w = rows[0].length;
    const look = ['normal', 'look', 'wide', 'shine', 'sad', 'angry', 'narrow', 'dot'].includes(k);
    const x0 = (mir ? ex + 4 - w : ex) + (w > 4 && !mir ? -(w - 4) / 2 | 0 : 0) + (look ? lx : 0);
    st.rows(rows, x0, -35 + by + (look ? ly : 0), mir);
  });
  const m = PX_MOUTHS[o.mouth];
  if (m) { const rows = m.rows, w = rows[0].length; st.rows(rows, Math.floor((-1 - w + 1) / 2) + qs, -22 + by + (m.dy || 0)); }
  if ((o.blush || 0) > .2) for (const cx of [-19, 18]) st.rows(['PPPP'], cx - 2, -24 + by);
  // to the buffer, with a shadow and the mood's tint on the body
  const flip = !!o.flip, wx = x + dx, wy = y + dy;
  if (!o.noShadow) hgShadow(x + dx, y, o.dy || 0, 26);
  pxDrawStack(st, wx, wy, CPX, flip, pxSkin(CPX, o), false);
  if (o.emote) {
    const E = PX_EMOTES[o.emote] || {}, dir = flip ? -1 : 1;
    pxEmote(o.emote, E.top ? wx : wx + dir * 24 - (flip ? 6 : 0), wy - 42 + (E.top ? -2 : 0) + by, o.emoteK ?? 1, o.emoteAge ?? T, dir);
  }
}
