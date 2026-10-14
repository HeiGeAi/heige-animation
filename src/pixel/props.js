// pixel/props.js: explainer props for pixel videos: icons drawn as pixel grids, a panel that pops open, and a text
// layer drawn at full resolution over the pixels (subtitles, keywords, titles). Scenes push text with pxText() while
// drawing; the loop's overlay calls pxTextFlush(). Palette keys below; no green anywhere.
const PROP_PAL = {
  O: '#141026', A: '#F6B13E', a: '#FFE7A6', C: '#22A7D6', c: '#9BE3F7', R: '#F0384E', r: '#FF8C9A', W: '#FFFFFF',
  S: '#F4F0FF', s: '#C9C3DE', g: '#8C88A6', V: '#8F6CC8', v: '#C9B3F0', B: '#4A68B0', b: '#8EC3E6', Y: '#FFE27A',
  K: '#2C2B3D', k: '#1B1A2B', N: '#8A5A3C', n: '#C08A5C', P: '#5A4485',
};
const PX_ICONS = {
  bolt:   ['......OOOO..', '.....OAAAO..', '....OAAAO...', '...OAAAO....', '..OAAAAOOOO.', '.OAAAAAAAAO.', '.OOOOAAAAO..',
           '....OAAAO...', '...OAAAO....', '..OAAAO.....', '..OAAO......', '..OOO.......'],
  book:   ['.OOOOOOOOOO.', 'OVVVVVVVVvO.', 'OVvvvvvvVvO.', 'OVVVVVVVVvO.', 'OVvvvvvvVvO.', 'OVVVVVVVVvO.', 'OVVVVVVVVvO.',
           'OVVVVVVVVvO.', 'OVVVVVVVVvO.', 'OSSSSSSSSSO.', 'OsssssssssO.', '.OOOOOOOOOO.'],
  shield: ['.OOOOOOOOOO.', 'OCCCCCcCCCCO', 'OCCCCcWcCCCO', 'OCCCCcWcCCCO', 'OCCcccWcccCO', 'OCCWWWWWWCCO', 'OCCcccWcccCO',
           '.OCCCcWcCCO.', '.OCCCcWcCCO.', '..OCCCCCCO..', '...OCCCCO...', '....OOOO....'],
  clock:  ['...OOOOOO...', '..OSSSSSSO..', '.OSSSOSSSSO.', 'OSSSSOSSSSSO', 'OSSSSOSSSSSO', 'OSSSSOOOOSRO', 'OSSSSSSSSSSO',
           'OSSSSSSSSSSO', '.OSSSSSSSSO.', '..OSSSSSSO..', '...OOOOOO...', '............'],
  bug:    ['..O......O..', '...O....O...', '....OOOO....', '.O.ORRRRO.O.', '..ORrRRrRO..', 'OOORRRRRROOO', '..ORRORRRO..',
           'OOORRORRROOO', '..ORRORRRO..', '.O.ORRRRO.O.', '....OOOO....', '............'],
  server: ['OOOOOOOOOOOO', 'OKKKKKKKKKKO', 'OKCKAKKkkkKO', 'OKKKKKKKKKKO', 'OOOOOOOOOOOO', 'OKKKKKKKKKKO', 'OKAKCKKkkkKO',
           'OKKKKKKKKKKO', 'OOOOOOOOOOOO', 'OKKKKKKKKKKO', 'OKCKCKKkkkKO', 'OOOOOOOOOOOO'],
  ghost:  ['...OOOOOO...', '..OSSSSSSO..', '.OSSSSSSSSO.', '.OSOOSSOOSO.', '.OSOOSSOOSO.', '.OSSSSSSSSO.', '.OSSSOOSSSO.',
           '.OSSSSSSSSO.', '.OSSSSSSSSO.', '.OSOSSOSSOO.', '.OO.OO.OO...', '............'],
  heart:  ['............', '.OOO...OOO..', 'ORRRO.ORRRO.', 'ORrRROORRRRO', 'ORRRRRRRRRRO', 'ORRRRRRRRRRO', '.ORRRRRRRRO.',
           '..ORRRRRRO..', '...ORRRRO...', '....ORRO....', '.....OO.....', '............'],
  trash:  ['....OOOO....', '.OOOOOOOOOO.', 'OssssssssssO', '.OOOOOOOOOO.', '.OgsgsgsgsO.', '.OgsgsgsgsO.', '.OgsgsgsgsO.',
           '.OgsgsgsgsO.', '.OgsgsgsgsO.', '.OgsgsgsgsO.', '..OOOOOOOO..', '............'],
  moon:   ['....OOOO....', '..OOaaaaO...', '.OaaaOOOO...', '.OaaO.......', 'OaaO........', 'OaaO........', 'OaaO........',
           'OaaaO.......', '.OaaaOOOO.O.', '.OOaaaaaaOO.', '...OOOOOO...', '............'],
  sun:    ['.....A......', '.A...A...A..', '..A.OOO.A...', '...OYYYO....', 'AAOYYYYYOAA.', '..OYYYYYO...', '...OYYYO....',
           '..A.OOO.A...', '.A...A...A..', '.....A......', '............', '............'],
  box:    ['.OOOOOOOOOO.', 'OBBBBBBBBBBO', 'ObbbbbbbbbbO', 'OBBBBBBBBBBO', 'OOOOOOOOOOOO', 'OBBBBOOBBBBO', 'OBBBBOOBBBBO',
           'OBBBBBBBBBBO', 'OBBBBBBBBBBO', 'OBBBBBBBBBBO', 'OOOOOOOOOOOO', '............'],
  paper:  ['OOOOOOOOO...', 'OSSSSSSSOO..', 'OSOOOOSSSOO.', 'OSSSSSSSSSO.', 'OSOOOOOOSSO.', 'OSSSSSSSSSO.', 'OSOOOOOSSSO.',
           'OSSSSSSSRSO.', 'OSOOOOSSRRO.', 'OSSSSSSRRSO.', 'OOOOOOOOOOO.', '............'],
  bag:    ['....OOOO....', '...ONnnNO...', '..OOOOOOOO..', '.ONNNNNNNNO.', 'ONNNNNNNNNNO', 'ONnNNNNNNnNO', 'OOOOOAAOOOOO',
           'ONNNNNNNNNNO', 'ONNNNNNNNNNO', 'ONNNNNNNNNNO', '.OOOOOOOOOO.', '............'],
  crown:  ['............', 'O....O....O.', 'OO..OAO..OO.', 'OAO.OAO.OAO.', 'OAAOAAAOAAO.', 'OAAAAAAAAAO.', 'OAaAAaAAaAO.',
           'OAAAAAAAAAO.', 'OOOOOOOOOOO.', '............', '............', '............'],
  thorn:  ['..........OO', '.........ORO', '........ORO.', '.......ORO..', '......ORO...', '.....ORO....', '....ORO.....',
           '...ORO......', '..ORO.......', '.ORO........', 'ORO.........', 'OO..........'],
  chip:   ['..O.O..O.O..', '.OOOOOOOOOO.', 'OOKKKKKKKKOO', '.OKCCCCCCKO.', 'OOKCOOOOCKOO', '.OKCOAAOCKO.', 'OOKCOAAOCKOO',
           '.OKCOOOOCKO.', 'OOKCCCCCCKOO', '.OKKKKKKKKO.', '.OOOOOOOOOO.', '..O.O..O.O..'],
  star:   ['......O......', '.....OAO.....', '.....OAO.....', '....OAaAO....', 'OOOOOAaAOOOOO', 'OAAAAaaaAAAAO', '.OAAaaWaaAAO.',
           '..OAAaaaAAO..', '...OAAAAAO...', '..OAAAOAAAO..', '..OAAO.OAAO..', '.OAAO...OAAO.', '.OOO.....OOO.'],
  check:  ['............', '..........OO', '.........OCO', '........OCO.', '.......OCO..', 'OO....OCO...', 'OCO..OCO....',
           '.OCOOCO.....', '..OCCO......', '...OO.......', '............', '............'],
  cross:  ['............', '.OO......OO.', 'ORRO....ORRO', '.ORRO..ORRO.', '..ORROORRO..', '...ORRRRO...', '...ORRRRO...',
           '..ORROORRO..', '.ORRO..ORRO.', 'ORRO....ORRO', '.OO......OO.', '............'],
};

// Draw an icon with its top-left at (x, y); `scale` repeats pixels into square blocks (props can be chunkier than the
// character: a 2× block is still a square pixel, just a bigger one). tint swaps every colour for one.
function pxIcon(name, x, y, scale = 1, tint = null) {
  const rows = PX_ICONS[name]; if (!rows) return;
  for (let j = 0; j < rows.length; j++) for (let i = 0; i < rows[j].length; i++) {
    const c = rows[j][i]; if (c === '.') continue;
    const col = tint && c !== 'O' ? tint : PROP_PAL[c];
    for (let v = 0; v < scale; v++) for (let u = 0; u < scale; u++) pset(x + i * scale + u, y + j * scale + v, col);
  }
}

// A panel: dark fill, cyan rim, cut corners. k = 0..1 opening: it unrolls from its middle row in whole pixels.
function pxPanel(x, y, w, h, k = 1, fill = '#1C1B3A', rim = '#22A7D6') {
  if (k <= 0) return;
  const hh = Math.max(2, Math.round(h * Math.min(1, k))), y0 = y + Math.round((h - hh) / 2);
  for (let j = 0; j < hh; j++) for (let i = 0; i < w; i++) {
    const edge = i === 0 || j === 0 || i === w - 1 || j === hh - 1, corner = (i === 0 || i === w - 1) && (j === 0 || j === hh - 1);
    if (corner) continue;
    pset(x + i, y0 + j, edge ? rim : (j === 1 || i === 1) ? '#2B2A55' : fill);
  }
}

// Text over the pixels, positioned in logical pixels; drawn by pxTextFlush() in the loop's overlay at full resolution.
// (ox, oy) is the logical pixel at the screen's top left, when a film camera has moved in.
let PX_TEXTS = [];
function pxText(txt, x, y, o = {}) { PX_TEXTS.push({ txt, x, y, ...o }); }
function pxTextFlush(c, s, ox = 0, oy = 0) {
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const T of PX_TEXTS) {
    const size = Math.round((T.size || 8) * s);
    c.font = `${T.weight || 900} ${size}px "PingFang SC", "HarmonyOS Sans SC", sans-serif`;
    if (T.align) c.textAlign = T.align;
    const x = (T.x - ox) * s, y = (T.y - oy) * s;
    if (T.stroke !== false) { c.lineWidth = Math.max(4, size * .18); c.strokeStyle = T.strokeColor || '#0E0B1E'; c.strokeText(T.txt, x, y); }
    c.fillStyle = T.color || '#FFFFFF'; c.fillText(T.txt, x, y);
    c.textAlign = 'center';
  }
  PX_TEXTS = [];
}

// Light over the pixels, drawn at full resolution like the text (the pixels stay hard, the light is soft):
//   spot   { x, y0, y1, w0, w1, a, col }  a stage light's cone from y0 down to a pool on the floor at y1
//   glow   { x, y, r, a, col }            a soft halo behind something precious
//   vig    { k }                          darkened corners
//   tint   { col, a }                     the whole frame washed with a colour (a hit of red, a cold blue)
// Scenes push with pxFx() while drawing; film.js flushes after the pixels and before the text.
let PX_FX = [];
function pxFx(o) { PX_FX.push(o); }
const fxRGBA = (hex, a) => { const [r, g, b] = rgb(hex); return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`; };
function pxFxFlush(c, s, ox = 0, oy = 0) {
  const X = x => (x - ox) * s, Y = y => (y - oy) * s;
  for (const F of PX_FX) {
    c.save();
    if (F.type === 'spot') {
      const col = F.col || '#FFE9B8', a = F.a ?? .32, x = X(F.x), y0 = Y(F.y0 ?? -10), y1 = Y(F.y1), w0 = (F.w0 ?? 14) * s / 2, w1 = (F.w1 ?? 70) * s / 2;
      c.globalCompositeOperation = 'screen'; c.filter = `blur(${Math.round(s * 2.2)}px)`;
      const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, fxRGBA(col, a)); g.addColorStop(1, fxRGBA(col, a * .45));
      c.fillStyle = g; c.beginPath(); c.moveTo(x - w0, y0); c.lineTo(x + w0, y0); c.lineTo(x + w1, y1); c.lineTo(x - w1, y1); c.closePath(); c.fill();
      const p = c.createRadialGradient(x, y1, 0, x, y1, w1 * 1.1); p.addColorStop(0, fxRGBA(col, a * 1.1)); p.addColorStop(1, fxRGBA(col, 0));
      c.fillStyle = p; c.setTransform(1, 0, 0, .22, 0, y1 * .78); c.beginPath(); c.arc(x, y1, w1 * 1.1, 0, Math.PI * 2); c.fill();
    } else if (F.type === 'glow') {
      c.globalCompositeOperation = 'screen';
      const x = X(F.x), y = Y(F.y), r = F.r * s, g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, fxRGBA(F.col || '#FFD86A', F.a ?? .5)); g.addColorStop(1, fxRGBA(F.col || '#FFD86A', 0));
      c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
    } else if (F.type === 'vig') {
      const W = c.canvas.width, H = c.canvas.height, g = c.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * 1.05);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(6,2,6,${F.k ?? .6})`);
      c.fillStyle = g; c.fillRect(0, 0, W, H);
    } else if (F.type === 'tint') {
      c.globalAlpha = F.a ?? .2; c.fillStyle = F.col; c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    }
    c.restore();
  }
  PX_FX = [];
}
