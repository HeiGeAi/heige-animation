// pixel/rig.js: the pixel rig. A character is a stack of drawn parts (legs, torso, neck, head, cap, arms; one set per
// view), moved by whole pixels and swapped by frame, with a face stamped on from a library of pixel eyes, brows and
// mouths. It reads the same option bag as clawd(): spread feel() / emotions() / move() / turn() into it, and the rig
// turns those numbers into pixel decisions: dy into whole-pixel hops, sq into a crouch, aL / aR into arm frames,
// eyes / mouth into stamps, tint into a skin palette, emote into a pixel mark by the head. Nothing is ever scaled or
// rotated: every pixel stays the same size, which is what makes it read as pixel art.
//
// The pieces, all plain data:
//   parts   { name: { x, y, rows } }: rows of palette keys ('.' = empty), top-left at (x, y) in sprite space
//   pal     { key: '#rrggbb' }: the character's palette; FACE_PAL and EMOTE_PAL add the stamp colours
//   PX_EYES / PX_MOUTHS / PX_BROWS: stamp libraries; a character says where its eyes, brows and mouth sit (its `face`)
// Sprite space has y growing down and the feet on row `ground - 1`; the sprite mirrors about x = axis2 / 2.

// ---------- a stack of keyed pixels ----------
class PxStack {
  constructor() { this.m = new Map(); }
  static k(x, y) { return (x + 2048) * 4096 + (y + 2048); }
  set(x, y, c) { if (c && c !== '.') this.m.set(PxStack.k(x, y), c); }
  get(x, y) { return this.m.get(PxStack.k(x, y)); }
  has(x, y) { return this.m.has(PxStack.k(x, y)); }
  del(x, y) { this.m.delete(PxStack.k(x, y)); }
  // paste rows with their top-left at (x0, y0); `mirror` reverses each row (the stamp for the other side of a face)
  rows(rows, x0, y0, mirror = false, only = null) {
    for (let j = 0; j < rows.length; j++) {
      const r = rows[j], n = r.length;
      for (let i = 0; i < n; i++) {
        const c = r[mirror ? n - 1 - i : i];
        if (c !== '.' && (!only || only(x0 + i, y0 + j))) this.m.set(PxStack.k(x0 + i, y0 + j), c);
      }
    }
  }
  part(p, dx = 0, dy = 0, only = null) { if (p) this.rows(p.rows, p.x + dx, p.y + dy, false, only); }
  *each() { for (const [k, c] of this.m) yield [Math.floor(k / 4096) - 2048, (k % 4096) - 2048, c]; }
}

// ---------- stamp colours shared by every character ----------
// Stamp keys are kept apart from every character palette ('@' '#' W M T t P % R $ A a ~ K &; y Y match the tears).
const FACE_PAL = {
  '@': '#160F24',            // pupils, closed-eye lines, brows (the darkest ink)
  '#': '#1F1A2E',            // mouth line
  W: '#FFFFFF', w: '#FEFEFE',// glints and eye whites
  M: '#5A2430', T: '#E8607E',// mouth inside, tongue
  t: '#FFF4EC',              // teeth
  P: '#F58E8E', '%': '#E86F78',// blush, blush hatching
  y: '#22A7D6', Y: '#8EDCF4',// tears (黑哥青 and its light)
  R: '#F0384E', '$': '#A61F35',// hearts and red eyes
  A: '#F6B13E', a: '#FFE7A6',// stars and sparks (amber, cream)
  '~': '#3A3166',            // gloom
  K: '#1E1B2E', '&': '#3B3758' // shades lenses
};
const EMOTE_PAL = {
  O: '#141026', A: '#F6B13E', a: '#FFE7A6', C: '#22A7D6', c: '#9BE3F7', W: '#FFFFFF', R: '#F0384E', r: '#FF8C9A',
  B: '#8EC3E6', b: '#D5ECFA', V: '#8F6CC8', v: '#C9B3F0', S: '#F4F0FF', s: '#C9C3DE', g: '#8C88A6', Y: '#FFE27A', y: '#FFF6C8'
};

// ---------- eyes ----------
// Drawn for the LEFT eye (screen left in the front view); the right eye is the mirror image. `at: 'eye'` places the
// top-left at the eye box's top-left plus (dx, dy); `at: 'lens'` centres the stamp in the lens. look: the pupils follow
// lookX / lookY. blink: it blinks. Two-frame stamps (rows2) alternate on a beat-free clock (swirl spins, heart beats).
const PX_EYES = {
  normal:     { at: 'eye', look: true, blink: true, rows: ['.@@.', '@W@@', '@@@@', '@@@@', '.@@.'] },
  wide:       { at: 'eye', dx: -1, dy: -1, look: true, blink: true, rows: ['.@@@.', '@WW@@', '@W@@@', '@@@@@', '@@@@@', '.@@@.'] },
  shine:      { at: 'eye', dx: -1, dy: -1, look: true, blink: true, rows: ['.@@@.', '@WW@@', '@WW@@', '@@@@@', '@@@W@', '.@@@.'] },
  happy:      { at: 'eye', dy: 1, rows: ['.@@.', '@@@@', '@..@'] },
  closed:     { at: 'eye', dy: 2, rows: ['@..@', '.@@.'] },
  blink:      { at: 'eye', dy: 3, rows: ['@@@@'] },
  sleepy:     { at: 'eye', dx: -1, dy: 1, rows: ['@@@@@', '.@@@.', '..@..'] },
  narrow:     { at: 'eye', dy: 2, look: true, rows: ['@@@@', '.@@.'] },
  angry:      { at: 'eye', look: true, rows: ['@@..', '@@@.', '@W@@', '@@@@', '.@@.'] },
  determined: { at: 'eye', look: true, rows: ['@@@.', '@W@@', '@@@@', '@@@@', '.@@.'] },
  sad:        { at: 'eye', look: true, rows: ['..@@', '.@@@', '@W@@', '@@@@', '.@@.'] },
  teary:      { at: 'eye', look: true, rows: ['..@@', '.@@@', '@W@@', '@@@@', 'YYYY'], rows2: ['..@@', '.@@@', '@W@@', '@@@@', 'YWYY'] },
  cry:        { at: 'eye', dy: 1, rows: ['@@..', '..@@', '....'] },
  squeeze:    { at: 'eye', dy: 1, rows: ['@@..', '..@@', '@@..'] },
  scared:     { at: 'lens', look: true, rows: ['.@@@.', '@WWW@', '@W@W@', '@WWW@', '.@@@.'] },
  blank:      { at: 'lens', rows: ['.@@@.', '@WWW@', '@WWW@', '@WWW@', '.@@@.'] },
  dot:        { at: 'eye', dx: 1, dy: 1, look: true, rows: ['@@', '@@'] },
  x:          { at: 'lens', rows: ['@...@', '.@.@.', '..@..', '.@.@.', '@...@'] },
  heart:      { at: 'lens', rows: ['.RR.RR.', 'RWRRRRR', 'RRRRRR$', '.RRRR$.', '..RR$..', '...$...'],
                rows2: ['.......', '.RR.RR.', 'RWRRRR$', '.RRRR$.', '..RR$..', '...$...'] },
  spark:      { at: 'lens', rows: ['...A...', '...A...', '..AaA..', 'AAAaAAA', '..AaA..', '...A...', '...A...'],
                rows2: ['.......', '...A...', '..AaA..', '.AAaAA.', '..AaA..', '...A...', '.......'] },
  swirl:      { at: 'lens', rows: ['.@@@@.', '@....@', '@.@@.@', '@.@..@', '@..@@.', '.@....'],
                rows2: ['.@@@@.', '@....@', '@.@@.@', '@..@.@', '.@@..@', '....@.'] },
  red:        { at: 'eye', look: true, rows: ['.RR.', 'RWRR', 'RRRR', 'RRRR', '.RR.'] },
  shades:     { at: 'lens', shades: true, rows: [] },
};

// ---------- brows ----------
// For the left brow, top-left at the brow anchor; the right brow is the mirror image. 8 wide, up to 4 rows.
const PX_BROWS = {
  normal:  ['.@@@@@@.', '@@@@@@@@', '@.......'],
  up:      ['@@@@@@@@', '@......@'],
  angry:   ['@@@.....', '.@@@@@..', '...@@@@@', '......@@'],
  sad:     ['.....@@@', '..@@@@@.', '@@@@@...', '@@......'],
  flat:    ['........', '@@@@@@@@', '@@@@@@@@'],
  soft:    ['........', '.@@@@@@.', '@@....@@'],
};
// the brow each emotion uses (eyes decide when there's no entry)
const PX_BROW_OF = {
  happy: 'soft', excited: 'up', laugh: 'soft', love: 'soft', shy: 'sad', proud: 'soft', smug: 'flat', relieved: 'soft',
  sad: 'sad', cry: 'sad', angry: 'angry', furious: 'angry', scared: 'sad', surprised: 'up', confused: ['up', 'flat'],
  thinking: ['flat', 'up'], idea: 'up', determined: 'angry', sleepy: 'flat', bored: 'flat', nervous: 'sad', suspicious: ['flat', 'angry'],
  disgusted: 'angry', dizzy: 'sad', cool: 'flat', starstruck: 'up', ko: 'sad', playful: 'soft', mischief: 'angry', hopeful: 'up',
};

// ---------- mouths ----------
// Centred on the face's middle (even widths centre exactly), top row at the mouth anchor plus dy. '#' = the line.
const PX_MOUTHS = {
  smile:  { rows: ['#....#', '.####.'] },
  flat:   { rows: ['.####.'], dy: 1 },
  frown:  { rows: ['.####.', '#....#'] },
  o:      { rows: ['##', '##'] },
  O:      { rows: ['.##.', '#MM#', '#MM#', '.##.'], dy: -1 },
  grin:   { rows: ['######', '#tttt#', '#MMMM#', '.####.'], dy: -1 },
  laugh:  { rows: ['########', '#tttttt#', '#MMMMMM#', '.#MTTM#.', '..####..'], dy: -1 },
  open:   { rows: ['.####.', '#MMMM#', '#MTTM#', '.####.'], dy: -1 },
  wobble: { rows: ['.#..#.', '#.##.#'] },
  cat:    { rows: ['#..#..#', '.##.##.'] },
  smirk:  { rows: ['.....#', '#####.'] },
  wail:   { rows: ['.######.', '#MMMMMM#', '#MMMMMM#', '#MTTTTM#', '.######.'], rows2: ['..####..', '.#MMMM#.', '#MMMMMM#', '#MTTTTM#', '.######.'], dy: -1 },
  teeth:  { rows: ['########', '#tt#tt##', '#tt#tt##', '########'], dy: -1 },
  tongue: { rows: ['#....#', '.####.', '...TT.', '...##.'] },
  pout:   { rows: ['.##.', '#TT#', '.##.'], dy: -1 },
  yawn:   { rows: ['.##.', '#MM#', '#MM#', '#MT#', '.##.'], dy: -2 },
};

// ---------- the same, in profile ----------
// For a face seen side on, facing right: eyes fit a 3-pixel lens (top-left at the eye anchor), mouths are the front
// half (their right edge at the face's front), brows are one short stroke. Same names as the front sets.
const PX_EYES_SIDE = {
  normal:     { look: true, blink: true, rows: ['@@', 'W@', '@@', '@@', '@@'] },
  wide:       { dy: -1, look: true, blink: true, rows: ['@@', 'W@', 'W@', '@@', '@@', '@@'] },
  shine:      { dy: -1, look: true, blink: true, rows: ['@@', 'W@', 'W@', '@@', '@W', '@@'] },
  happy:      { dy: 1, rows: ['.@.', '@.@'] },
  closed:     { dy: 2, rows: ['@.@', '.@.'] },
  blink:      { dy: 3, rows: ['@@@'] },
  sleepy:     { dy: 1, rows: ['@@@', '.@@', '.@@'] },
  narrow:     { dy: 2, look: true, rows: ['@@', '@@'] },
  angry:      { dy: 1, look: true, rows: ['@.', '@@', 'W@', '@@'] },
  determined: { dy: 1, look: true, rows: ['@@', 'W@', '@@', '@@'] },
  sad:        { dy: 1, look: true, rows: ['.@', '@@', 'W@', '@@'] },
  teary:      { dy: 1, look: true, rows: ['.@', '@@', 'W@', '@@', 'YY'], rows2: ['.@', '@@', 'W@', '@@', 'WY'] },
  cry:        { dy: 1, rows: ['@..', '.@@', '@..'] },
  squeeze:    { dy: 1, rows: ['@..', '.@@', '@..'] },
  scared:     { rows: ['@@@', '@WW', '@W@', '@WW', '@@@'] },
  blank:      { rows: ['@@@', '@WW', '@WW', '@WW', '@@@'] },
  dot:        { dy: 2, look: true, rows: ['@@', '@@'] },
  x:          { dy: 1, rows: ['@.@', '.@.', '@.@'] },
  heart:      { dy: 1, rows: ['R.R', 'RRR', '.$.'], rows2: ['...', 'R.R', '.$.'] },
  spark:      { dy: 1, rows: ['.A.', 'AaA', '.A.'], rows2: ['...', '.a.', '...'] },
  swirl:      { dy: 1, rows: ['@@@', '..@', '@@@'], rows2: ['@@@', '@..', '@@@'] },
  red:        { look: true, rows: ['RR', 'WR', 'RR', 'RR', 'RR'] },
  shades:     { shades: true, rows: [] },
};
PX_EYES_SIDE.look = PX_EYES_SIDE.normal;
const PX_MOUTHS_SIDE = {
  smile:  { rows: ['#..', '.##'] },
  flat:   { rows: ['###'], dy: 1 },
  frown:  { rows: ['.##', '#..'] },
  o:      { rows: ['##', '##'] },
  O:      { rows: ['.##', '#MM', '#MM', '.##'], dy: -1 },
  grin:   { rows: ['###', '#tt', '#MM', '.##'], dy: -1 },
  laugh:  { rows: ['####', '#ttt', '#MMM', '#MTT', '.###'], dy: -1 },
  open:   { rows: ['.##', '#MM', '#MT', '.##'], dy: -1 },
  wobble: { rows: ['.#.', '#.#'] },
  cat:    { rows: ['#.#', '.#.'] },
  smirk:  { rows: ['..#', '##.'] },
  wail:   { rows: ['.###', '#MMM', '#MMM', '#MTT', '.###'], rows2: ['..##', '.#MM', '#MMM', '#MTT', '.###'], dy: -1 },
  teeth:  { rows: ['####', '#tt#', '####'], dy: -1 },
  tongue: { rows: ['#...', '.##.', '..TT'] },
  pout:   { rows: ['.#', '#T', '.#'], dy: -1 },
  yawn:   { rows: ['.##', '#MM', '#MM', '#MT', '.##'], dy: -2 },
};
const PX_BROWS_SIDE = {
  normal: ['.@@@@', '@@@@.'], up: ['@@@@.', '....@'], angry: ['@@...', '.@@@@'], sad: ['...@@', '@@@@.'],
  flat: ['.....', '@@@@@'], soft: ['.@@@.', '@...@'],
};

// ---------- emotes ----------
// Pixel reaction marks (still no lettering). `top` ones sit over the head; the rest by its top corner. Each is one
// or more frames picked by age, so the looping ones (zzz, hearts, stars, dots, steam, cloud) move on their own clock.
const PX_EMOTES = {
  '!': { f: [['.OOO.', 'OAAAO', 'OAaAO', 'OAAAO', 'OAAAO', '.OAO.', '.OAO.', '..O..', '.OOO.', 'OAAAO', '.OOO.']] },
  '?': { f: [['.OOOO.', 'OCcCCO', 'OCOOCCO'.slice(0, 6), '.O.OCO', '..OCCO', '..OCO.', '..OCO.', '...O..', '..OOO.', '..OCO.', '..OOO.']] },
  sweat: { f: [['..O..', '.OcO.', 'OcBBO', 'OBBBO', 'OBBBO', '.OOO.']] },
  spark: { f: [['...O...', '..OaO..', '.OaAaO.', 'OaAWAaO', '.OaAaO.', '..OaO..', '...O...'], ['.......', '...O...', '..OaO..', '.OaWaO.', '..OaO..', '...O...', '.......']], fps: 4 },
  heart: { f: [['.OO.OO.', 'ORrOrRO', 'ORRRRRO', '.ORRRO.', '..ORO..', '...O...'], ['.......', '.OO.OO.', 'ORrRRRO', '.ORRRO.', '..ORO..', '...O...']], fps: 3 },
  anger: { f: [['.OO.OO.', 'OROOORO', 'OR...RO', '.......', 'OR...RO', 'OROOORO', '.OO.OO.'], ['.......', '.OO.OO.', '.ROOOR.', '.R...R.', '.ROOOR.', '.OO.OO.', '.......']], fps: 6 },
  music: { f: [['....OOO', '...OVVO', '...OVO.', '...OVO.', '.OOOVO.', 'OVVVVO.', '.OOOO..'], ['.......', '....OOO', '...OVVO', '...OVO.', '.OOOVO.', 'OVVVVO.', '.OOOO..']], fps: 3 },
  bulb: { top: true, f: [['...OOO...', '..OyyyO..', '.OyYYYyO.', '.OYYYYYO.', '.OYYWYYO.', '..OYYYO..', '..OsssO..', '..OgggO..', '...OOO...'],
                         ['.A.OOO.A.', '..OyyyO..', 'AOyYYYyOA', '.OYYYYYO.', '.OYYWYYO.', '..OYYYO..', '..OsssO..', '..OgggO..', '...OOO...']], fps: 5 },
  zzz: { loop: 'zzz' }, hearts: { loop: 'hearts' }, stars: { top: true, loop: 'stars' }, dots: { loop: 'dots' },
  steam: { top: true, loop: 'steam' }, cloud: { top: true, loop: 'cloud' }, swirl: { loop: 'swirl' }, scribble: { top: true, loop: 'scribble' },
  '!!': { pair: ['!', '!'] }, '!?': { pair: ['!', '?'] },
};
PX_EMOTES['?'].f[0][2] = 'OCOOCO';
const PX_Z = ['OOOO', '..O.', '.O..', 'OOOO'];
const PX_STAR = ['.A.', 'AaA', '.A.'];
const PX_HEART_S = ['R.R', 'RRR', '.R.'];

// Draw an emote with its anchor at world (x, y): the bottom-left of the mark for side emotes, bottom-centre for top
// ones. k = 0..1 pop (from emotions()); age = seconds since it appeared.
function pxEmote(kind, x, y, k = 1, age = 0, dir = 1) {
  const E = PX_EMOTES[kind]; if (!E || k < .2) return;
  const P = EMOTE_PAL, pop = k < .55 ? -1 : 0;                       // pops in a pixel high, then settles
  const blit = (rows, x0, y0, pal = P) => { for (let j = 0; j < rows.length; j++) for (let i = 0; i < rows[j].length; i++) { const c = rows[j][i]; if (c !== '.') pset(x0 + i, y0 + j, pal[c] || FACE_PAL[c] || c); } };
  if (E.pair) { pxEmote(E.pair[0], x - 3, y, k, age); pxEmote(E.pair[1], x + 4, y, k, age); return; }
  if (E.f) {
    const fr = E.f[Math.floor(age * (E.fps || 1)) % E.f.length], w = fr[0].length, h = fr.length;
    blit(fr, E.top ? x - Math.floor(w / 2) : x, y - h + pop);
    return;
  }
  const ON = (rows, x0, y0, col) => { for (let j = 0; j < rows.length; j++) for (let i = 0; i < rows[j].length; i++) if (rows[j][i] !== '.') pset(x0 + i, y0 + j, col); };
  switch (E.loop) {
    case 'zzz': for (let i = 0; i < 3; i++) {                        // Zs drifting up and away, on twos
      const ph = frac(onTwos(age) * .45 + i / 3); if (ph > .85) continue;
      const zx = x + Math.round(ph * 9 * dir), zy = y - Math.round(ph * 14);
      const z = ph < .3 ? ['OO', '.O', 'OO'] : PX_Z;
      for (let j = 0; j < z.length; j++) for (let ii = 0; ii < z[j].length; ii++) if (z[j][ii] !== '.') { pset(zx + ii, zy + j, P.S); pset(zx + ii + 1, zy + j + 1, P.g); }
    } break;
    case 'hearts': for (let i = 0; i < 3; i++) {
      const ph = frac(onTwos(age) * .5 + i / 3); if (ph > .9) continue;
      const hx = x + Math.round(Math.sin(ph * 6 + i * 2) * 2 + i * 4 - 2), hy = y - Math.round(ph * 12);
      ON(PX_HEART_S, hx, hy, ph < .6 ? P.R : P.r);
    } break;
    case 'stars': for (let i = 0; i < 3; i++) {                      // three little stars circling the cap
      const a = onTwos(age) * 4 + i * TAU / 3, sx = x + Math.round(Math.cos(a) * 16) - 1, sy = y + Math.round(Math.sin(a) * 3) - 1;
      blit(PX_STAR, sx, sy);
    } break;
    case 'dots': for (let i = 0; i < 3; i++) {
      const ph = frac(onTwos(age) / 1.6); if (ph < i * .2 + .1) continue;
      const dy2 = y - 2 - (ph < i * .2 + .18 ? 1 : 0);                 // light dots with a dark rim: they read on a night sky
      ON(['.OO.', 'O..O', 'O..O', '.OO.'], x + i * 4 - 1, dy2 - 1, P.O); ON(['OO', 'OO'], x + i * 4, dy2, P.S);
    } break;
    case 'steam': for (const s of [-1, 1]) for (let j = 0; j < 2; j++) {
      const ph = frac(onTwos(age) / .7 + j * .5 + (s > 0 ? .25 : 0)), r = ph < .4 ? 1 : 2;
      const cx = x + s * Math.round(14 + ph * 8), cy = y + 4 - Math.round(ph * 10);
      for (let yy = -r; yy <= r; yy++) for (let xx = -r - 1; xx <= r + 1; xx++) if (xx * xx * .7 + yy * yy <= r * r + .5) pset(cx + xx, cy + yy, ph > .7 ? P.s : P.S);
    } break;
    case 'cloud': {                                                   // a little rain cloud of its own
      const bob = Math.floor(onTwos(age) * 2) % 2;
      const cl = ['....OOO.....', '..OOsSSOOO..', '.OsSSSSSSSO.', 'OsSSSSSSSSsO', 'OssssssssssO', '.OOOOOOOOOO.'];
      blit(cl, x - 6, y - 6 + bob);
      for (let i = 0; i < 5; i++) { const ph = frac(onTwos(age) * 2.2 + hash(i)), rx = x - 4 + i * 2, ry = y + 1 + Math.round(ph * 6); pset(rx, ry, P.B); pset(rx, ry + 1, P.b); }
    } break;
    case 'swirl': {
      const fr = Math.floor(onTwos(age) * 8) % 4, sp = [['.VVV.', 'V...V', 'V.V.V', 'V.VV.', '.V...'], ['.VVV.', 'V...V', 'V.V.V', '.VV.V', '...V.'], ['...V.', '.VV.V', 'V.V.V', 'V...V', '.VVV.'], ['.V...', 'V.VV.', 'V.V.V', 'V...V', '.VVV.']][fr];
      blit(sp, x, y - 5);
    } break;
    case 'scribble': {
      const fr = Math.floor(onTwos(age) * 6) % 2;
      blit(fr ? ['.OOO.OO..', 'O..OO..O.', '.OO..OOO.', 'O..OO...O', '.OO..OOO.'] : ['..OO.OOO.', '.O..OO..O', 'O.OO..OO.', '.O..OO..O', '..OO..OO.'], x - 4, y - 5);
    } break;
  }
}

// ---------- drawing a character ----------
// The composed stack goes to the buffer through the palette, mirrored about the sprite's axis when flipped, with a rim
// of light on the silhouette's right edge (so a dark hoodie still reads against a night sky; it stays on the screen's
// right when he turns, like a light in the scene). Skin keys go through `skin` (the tinted skin colours).
function pxDrawStack(st, x, y, C, flip, skin, rimOn = true) {
  const pal = C.pal, axis2 = C.axis2, ground = C.ground;
  const world = [];
  for (const [sx, sy, c] of st.each()) world.push([flip ? axis2 - sx : sx, sy, c]);
  // rim light: a cloth pixel whose right-hand neighbour is the outline, with nothing beyond that
  const at = new Map(world.map(([wx, wy, c]) => [PxStack.k(wx, wy), c]));
  const rim = new Set();
  if (rimOn && C.rimFrom) for (const [wx, wy, c] of world) {
    if (!C.rimFrom.includes(c)) continue;
    if (at.get(PxStack.k(wx + 1, wy)) === C.outline && !at.has(PxStack.k(wx + 2, wy))) rim.add(PxStack.k(wx, wy));
  }
  const ox = x - Math.floor(axis2 / 2), oy = y - ground;
  for (const [wx, wy, c] of world) {
    let col = rim.has(PxStack.k(wx, wy)) ? C.rim : (skin && skin[c]) || pal[c] || FACE_PAL[c];
    if (col) pset(ox + wx, oy + wy, col);
  }
}

// Skin colours for a mood: the tint name (or hex) mixed into each skin key; emotions() cross-fades through tintFade.
const PX_TINT = { pale: '#F4EEF0', flush: '#E8434A', blue: '#7F95D6', rosy: '#F28CB0', green: '#B9A6DE', gold: '#F6C64E' };   // no green: disgust is lilac
function pxSkin(C, o) {
  const one = (tn, tk) => {
    const tc = tn && (PX_TINT[tn] || tn), k = clamp(tk ?? 1), out = {};
    for (const key of C.skinKeys) out[key] = !tc || k <= 0 ? C.pal[key] : mixCol(C.pal[key], tc, (C.tintK || .38) * k);
    return out;
  };
  if (o.tintFade) {
    const f = o.tintFade, A = one(f.a, f.ak), B = one(f.b, f.bk), out = {}, k = Math.round(f.k * 3) / 3;   // in three steps
    for (const key of C.skinKeys) out[key] = mixCol(A[key], B[key], k);
    return out;
  }
  return one(o.tint, o.tintK);
}

// ---------- the face ----------
// Stamp eyes, brows, mouth, blush, gloom and tears into the stack for one view. F = the view's face config:
//   eyes: [[x, y], ...] top-left of each 4×5 eye box (left eye first); lenses: [[x0, y0, x1, y1], ...] lens interiors;
//   brows: [[x, y], ...] top-left of each 8-wide brow; mouth: [cx2, y] (cx2 = 2 × the centre); cheeks: [[x, y], ...]
//   mirror: [false, true] which stamps are mirrored; forehead: [x0, y0, x1, y1] for gloom.
function pxFace(st, F, o, dx = 0, dy = 0) {
  if (!F) return;
  const tt = onTwos(T);
  const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['happy', 'normal'] : [o.eyes || 'normal', o.eyes || 'normal'];
  const lx = Math.round(clamp(o.lookX || 0, -1, 1) * 1.6), ly = Math.round(clamp(o.lookY || 0, -1, 1) * 1.3);
  const blinking = ((tt * .9 + (o.seed || 0) * 1.7) % 3.3) < .1;
  const sq = o.squint || 0;
  const n = F.eyes.length, EYES = F.eyeSet || PX_EYES, BROWS = F.browSet || PX_BROWS, MOUTHS = F.mouthSet || PX_MOUTHS;
  for (let i = 0; i < n; i++) {
    let kind = kinds[Math.min(i, kinds.length - 1)] || 'normal', E = EYES[kind] || EYES.normal;
    if (sq > .7 || (E.blink && blinking)) E = EYES.blink;
    else if (sq > .35 && E.look) E = EYES.narrow;
    const mir = F.mirror[i], [ex, ey] = F.eyes[i], [lx0, ly0, lx1, ly1] = F.lenses[i];
    if (E.shades) {                                                  // the lenses go dark, with a glint
      for (let y = ly0; y <= ly1; y++) for (let x = lx0; x <= lx1; x++) if (st.has(x + dx, y + dy)) st.set(x + dx, y + dy, (x + y) % 2 && y > ly0 + 3 ? '&' : 'K');
      const gx = mir ? lx1 - 2 : lx0 + 1;
      st.set(gx + dx, ly0 + 1 + dy, 'W'); st.set(gx + (mir ? -1 : 1) + dx, ly0 + 1 + dy, 'W'); st.set(gx + dx, ly0 + 2 + dy, 'W');
      continue;
    }
    const rows = (E.rows2 && Math.floor(tt * 3) % 2) ? E.rows2 : E.rows;
    if (!rows.length) continue;
    const w = rows[0].length, h = rows.length;
    let x0, y0;
    if (E.at === 'lens') { const cx = Math.floor((lx0 + lx1) / 2), cy = Math.floor((ly0 + ly1) / 2); x0 = mir ? cx - (w - 1 - Math.floor(w / 2)) : cx - Math.floor(w / 2); y0 = cy - Math.floor(h / 2); }
    else { x0 = mir ? ex + 4 - (E.dx || 0) - w : ex + (E.dx || 0); y0 = ey + (E.dy || 0); }
    if (E.look) { x0 += lx; y0 += ly; }
    if (!F.clip) { x0 = clamp(x0, lx0, lx1 - w + 1); y0 = clamp(y0, ly0, ly1 - h + 1); }
    const clip = F.clip ? (x, y) => x - dx >= lx0 && x - dx <= lx1 && y - dy >= ly0 && y - dy <= ly1 : null;
    st.rows(rows, x0 + dx, y0 + dy, mir, clip);
    if (kind === 'scared' && EYES === PX_EYES && Math.floor(tt * 12) % 2) {   // the pupil trembles
      const px = mir ? x0 + 1 : x0 + 3; st.set(x0 + 2 + dx, y0 + 2 + dy, 'W'); st.set(px + dx, y0 + 2 + dy, '@');
    }
  }
  // brows
  if (F.brows) {
    const bn = o.brows || PX_BROW_OF[o.emo] || (kinds[0] === 'angry' || kinds[0] === 'determined' ? 'angry' : kinds[0] === 'sad' || kinds[0] === 'teary' ? 'sad' : 'normal');
    const pair = Array.isArray(bn) ? bn : [bn, bn];
    const bc = F.browClip ? (x, y) => x - dx >= F.browClip[0] && x - dx <= F.browClip[2] && y - dy >= F.browClip[1] && y - dy <= F.browClip[3] : null;
    F.brows.forEach(([bx, by], i) => { const B = BROWS[pair[Math.min(i, 1)]] || BROWS.normal; st.rows(B, (F.mirror[i] ? bx - B[0].length + 1 : bx) + dx, by + dy, F.mirror[i], bc); });
  }
  // mouth
  if (F.mouth && o.mouth !== null) {
    let m = o.mouth || (o.lid > .1 ? 'wail' : F.rest || 'smile');
    if (o.lid > .1) m = 'wail';
    const M = MOUTHS[m];
    if (M) {
      const rows = (M.rows2 && Math.floor(tt * 6) % 2) ? M.rows2 : M.rows, w = rows[0].length;
      const x0 = F.mouthRight != null ? F.mouthRight - w + 1 : Math.floor((F.mouth[0] - w + 1) / 2), y0 = F.mouth[1] + (M.dy || 0);
      const mc = F.mouthClip ? (x, y) => x - dx >= F.mouthClip[0] && x - dx <= F.mouthClip[1] : null;
      st.rows(rows, x0 + dx, y0 + dy, false, mc);
    }
  }
  // blush: two soft patches, hatched when strong
  const b = o.blush === true ? 1 : (o.blush || 0);
  if (b > .15 && F.cheeks) for (const [cx, cy] of F.cheeks) {
    const patch = b > .6 ? ['.P%P%P.', 'PPPPPPP'] : b > .35 ? ['.PPPP.', 'PPPPPP'] : ['PPPP'];
    const w = patch[0].length;
    st.rows(patch, cx - Math.floor(w / 2) + dx, cy + dy, false, (x, y) => F.skinAt(st.get(x, y)));
  }
  // gloom: a dark band under the brim with hanging lines
  if ((o.gloom || 0) > .1 && F.forehead) {
    const [x0, y0, x1, y1] = F.forehead, g = o.gloom;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      if (!F.skinAt(st.get(x + dx, y + dy))) continue;
      const line = (x - x0) % 3 === 1 && y - y0 <= Math.round((y1 - y0) * (.5 + g));
      if (line || y - y0 < 2 * g + .5) st.set(x + dx, y + dy, '~');
    }
  }
  // tears: streams under the lenses for 'cry', with a drop that runs down on twos
  if (kinds.includes('cry') && F.tears) for (const [tx, ty] of F.tears) {
    const len = 6, ph = Math.floor(tt * 12) % len;
    for (let j = 0; j < len; j++) { st.set(tx + dx, ty + j + dy, j === ph ? 'W' : 'Y'); st.set(tx + 1 + dx, ty + j + dy, 'y'); }
    st.set(tx + dx, ty + len + dy, 'y');
  }
}
