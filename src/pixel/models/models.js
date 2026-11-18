// pixel/models/models.js: 问问黑哥's 17-model Q-version locked roster + 武馆 cast on 黑哥's pixel rig.
// modelPx() accepts the exact same option bag as heigePx() and clawdPx() (from feel(), emotions(), move(), turn(),
// jump(), take(), stroll()), and drives full pixel-rig acting: HG_U=4 bounce/hops, gapless crouch & stretch, smooth
// pixel-row lean (rot) & cheer sway, 8-phase walk cycle, secondary crown/hair lag, live prop glints & ECG monitor,
// mood skin tinting, blinking, iris gaze tracking (lookX/lookY), blush, gloom, tears, shades, and all 31 expressions.
//   modelPx('deepseek', x, groundY, { ...feel('happy', t), poseR: 'wave', emote: '!', emoteK: 1 })
const MODEL_CAST = {
  heige_q: 'heigeQ', heige_bunny: 'heigeQ', heigeq: 'heigeQ',
  deepseek: 'dsChibi',
  gpt: 'rsGpt', chatgpt: 'rsGpt',
  gemini: 'rsGemini',
  grok: 'rsGrok',
  llama: 'rsLlama',
  mistral: 'rsMistral',
  newbing: 'rsNewbing', bing: 'rsNewbing',
  updream: 'rsUpdream',
  qianwen: 'rsQianwen', qwen: 'rsQianwen',
  doubao: 'rsDoubao', seed: 'rsDoubao',
  kimi: 'rsKimi',
  hunyuan: 'rsHunyuan',
  zhipu: 'rsZhipu', glm: 'rsZhipu',
  minimax: 'rsMinimax',
  mimo: 'rsMimo',
  wenxin: 'rsWenxin', ernie: 'rsWenxin',
  // 「黑哥武馆」 V066 (models/wuxia.js)
  xiaoheizi: 'wxXiaoheizi', heige_guanzhu: 'wxHeigeGuanzhu', dario: 'wxDario', ds_menren: 'wxDsMenren', dafeiyu: 'wxDsMenren', liangsheng: 'wxLiangsheng',
  laohuang: 'wxLaohuang', sam: 'wxSam', tudi: 'wxTudi', laoma: 'wxLaoma',
};

// BEGIN_MODEL_RIGS
const MODEL_RIGS = {"dsChibi":{"w":69,"h":92,"cx":34,"outline":"a","skinKeys":["x","y"],"skinFill":"x","faceBox":[20,31,48,48],"eyeL":{"box":[22,37,29,43],"mask":["###..#..","##iiiii.","##iiiii#","##iiiii#",".#iiiii#","#.#iiii#","#i..iii."]},"eyeR":{"box":[38,37,45,43],"mask":[".#.#..##",".iiiiii#",".iiiiii#",".iiiiii#",".iiiiii#","..iiiii.","..iiii.."]},"mouth":[34,45],"cheeks":[[23,44],[45,44]],"forehead":[25,31,43,35],"bands":{"crownY":14,"chinY":48,"waistY":63,"footY":79},"arms":{"L":{"box":[15,61,21,66],"pivot":[17,60],"pal":{"out":"a","slv":"f","cuff":"q","hand":"x"}},"R":{"box":[48,61,53,66],"pivot":[51,60],"pal":{"out":"a","slv":"f","cuff":"q","hand":"x"}}},"tail":[52,64,68,84]},"rsGpt":{"w":76,"h":101,"cx":38,"outline":"a","skinKeys":["t","r"],"skinFill":"t","faceBox":[22,33,52,51],"eyeL":{"box":[27,40,33,46],"mask":["##.####","#i##ii.","#iiiii#","#iiiii#","#iiiii#","#iiiii.","#iiii.."]},"eyeR":{"box":[42,40,48,46],"mask":["#######","#ii#ii#","#iiiii#","#iiiii#","#iiiii#",".iiiii#","..iiii."]},"mouth":[38,48],"cheeks":[[27,46],[49,46]],"forehead":[28,34,47,38],"bands":{"crownY":20,"chinY":51,"waistY":67,"footY":87},"arms":{"L":{"box":[18,65,24,71],"pivot":[21,64],"pal":{"out":"a","slv":"j","cuff":"e","hand":"t"}}},"prop":{"kind":"float","box":[54,46,68,57]},"tail":[48,68,69,88]},"rsGemini":{"w":76,"h":101,"cx":38,"outline":"a","skinKeys":["o","j"],"skinFill":"o","faceBox":[22,35,52,51],"eyeL":{"box":[26,40,33,47],"mask":["#######.","#iiiiii#","#iii#ii#","#iiiiii#","#iiiiii#","#iiiiii#","#ii...i.","#.ii..i."]},"eyeR":{"box":[42,40,49,47],"mask":["#.######","#iiiiii#","#ii##ii#",".iiiiii#",".iiiiii#",".iiiiii#",".ii..ii.","..i..i.."]},"mouth":[38,48],"cheeks":[[26,46],[49,46]],"forehead":[28,35,47,38],"bands":{"crownY":21,"chinY":51,"waistY":67,"footY":85},"arms":{"L":{"box":[19,65,25,71],"pivot":[22,65],"pal":{"out":"a","slv":"c","cuff":"k","hand":"o"}},"R":{"box":[51,65,57,71],"pivot":[54,65],"pal":{"out":"a","slv":"c","cuff":"k","hand":"o"}}},"prop":{"kind":"stars","boxes":[[11,35,19,44],[58,36,66,45]]},"tail":[48,72,66,86]},"rsGrok":{"w":81,"h":101,"cx":39,"outline":"b","skinKeys":["u","v","s"],"skinFill":"u","faceBox":[24,34,54,54],"eyeL":{"box":[29,41,35,47],"mask":[".####.#","#iiiii#","#iii#i#","#iiiii#","##iiii#","##iiii#",".#iiii#"]},"eyeR":{"box":[43,41,49,47],"mask":[".#.####",".iiiii#",".iii.i#","#iiiii#","#.iiii#",".#iiii#","..iiii#"]},"mouth":[39,50],"cheeks":[[29,48],[49,48]],"forehead":[30,36,48,40],"bands":{"crownY":19,"chinY":54,"waistY":67,"footY":84},"arms":{"L":{"box":[19,66,25,72],"pivot":[22,65],"pal":{"out":"b","slv":"a","cuff":"r","hand":"u"}}},"prop":{"kind":"lift","box":[54,42,78,86]}},"rsLlama":{"w":68,"h":102,"cx":34,"outline":"a","skinKeys":["e","k","t"],"skinFill":"e","faceBox":[22,36,46,50],"eyeL":null,"eyeR":{"box":[38,40,44,46],"mask":["#######","#iii.i#",".iiiii#",".iiiii#",".iiiii#","...iii#","......#"]},"mouth":[34,47],"cheeks":[[25,45],[44,45]],"forehead":[26,36,44,39],"bands":{"crownY":21,"chinY":50,"waistY":68,"footY":87},"arms":{"R":{"box":[41,63,47,68],"pivot":[44,62],"pal":{"out":"a","slv":"g","cuff":"n","hand":"e"}}},"prop":{"kind":"rub","box":[16,39,27,50]}},"rsMistral":{"w":67,"h":87,"cx":33,"outline":"a","skinKeys":["n","h"],"skinFill":"n","faceBox":[21,32,45,47],"eyeL":{"box":[23,36,29,43],"mask":["#######","#iiiii#","#.iiii#","##iiii#",".#iiii#","#.iiii#","#i.iii.","#......"]},"eyeR":{"box":[37,36,43,43],"mask":[".######",".ii#ii#",".iiiii#",".iiiii#",".iiiii#",".iiiii.","..iii.#","......#"]},"mouth":[33,44],"cheeks":[[23,43],[43,43]],"forehead":[25,32,41,35],"bands":{"crownY":21,"chinY":47,"waistY":58,"footY":76},"prop":{"kind":"lift","box":[44,33,61,67]},"tail":[6,58,22,74]},"rsNewbing":{"w":73,"h":87,"cx":36,"outline":"w","skinKeys":["t","s"],"skinFill":"t","faceBox":[22,28,50,43],"eyeL":{"box":[25,31,31,37],"mask":["#######","#iiiii#","#iiiii#","#iiiii#","#iiiii#","#iiiii.","..iii.."]},"eyeR":{"box":[40,31,46,37],"mask":[".######","#iiiii#","#iiiii#",".iiiii#",".iiiii#","..iiii#","...iii."]},"mouth":[36,39],"cheeks":[[25,38],[46,38]],"forehead":[27,27,45,30],"bands":{"crownY":14,"chinY":43,"waistY":59,"footY":74},"arms":{"L":{"box":[17,57,24,63],"pivot":[21,56],"pal":{"out":"b","slv":"y","cuff":"v","hand":"x"}},"R":{"box":[48,57,55,63],"pivot":[51,56],"pal":{"out":"b","slv":"y","cuff":"v","hand":"x"}}}},"rsUpdream":{"w":71,"h":97,"cx":35,"outline":"a","skinKeys":["p"],"skinFill":"p","faceBox":[23,30,47,48],"eyeL":{"box":[26,37,31,43],"mask":["######","#iiii#","#iiii#","#iiii#","#iiii#","#iiii.","......"]},"eyeR":{"box":[39,37,44,43],"mask":["######","#iiii#","#iiii#","#iiii#","#iiii#",".iiii#","......"]},"mouth":[35,45],"cheeks":[[26,44],[44,44]],"forehead":[26,31,44,36],"bands":{"crownY":18,"chinY":48,"waistY":64,"footY":81},"arms":{"L":{"box":[17,60,23,65],"pivot":[20,59],"pal":{"out":"a","slv":"l","cuff":"v","hand":"p"}},"R":{"box":[48,60,54,65],"pivot":[51,59],"pal":{"out":"a","slv":"l","cuff":"v","hand":"p"}}},"tail":[46,70,61,88]},"rsQianwen":{"w":67,"h":87,"cx":34,"outline":"a","skinKeys":["x","j"],"skinFill":"x","faceBox":[20,29,47,44],"eyeL":{"box":[24,34,30,40],"mask":["###.#..","#iiii..","#iiii..","#iiii..",".iiii..",".......","......."]},"eyeR":{"box":[38,34,43,40],"mask":[".#####",".iiii.","#iiii#","#iii#.","#iii..","......","......"]},"mouth":[34,41],"cheeks":[[24,40],[43,40]],"forehead":[25,29,43,33],"bands":{"crownY":19,"chinY":44,"waistY":58,"footY":75},"prop":{"kind":"lift","box":[9,46,28,60]}},"rsDoubao":{"w":66,"h":89,"cx":31,"outline":"a","skinKeys":["p","q"],"skinFill":"p","faceBox":[19,27,45,43],"eyeL":{"box":[22,32,28,38],"mask":[".####.#",".iiii..","#iiii..","#iiii..","#iiii..","#iii...",".ii...."]},"eyeR":{"box":[34,32,40,38],"mask":[".####.#",".iiiii.",".iiiii#",".iiiii#",".iiiii#","..iiii.","...ii.."]},"mouth":[31,40],"cheeks":[[21,39],[41,39]],"forehead":[23,27,40,31],"bands":{"crownY":17,"chinY":43,"waistY":59,"footY":75},"prop":{"kind":"stars","boxes":[[40,42,52,54]]}},"rsKimi":{"w":68,"h":91,"cx":34,"outline":"a","skinKeys":["v","u"],"skinFill":"v","faceBox":[20,29,45,45],"eyeL":{"box":[24,34,30,40],"mask":["#######","#i#iii.","#iiii.#","#iiii..","#iiii..","#iiii..","#i#ii.."]},"eyeR":{"box":[38,34,44,40],"mask":["#######","#i#iii#","#iiiii#","#iiiii#","#iiiii#","#iiiii#","#i#ii.."]},"mouth":[34,42],"cheeks":[[24,41],[44,41]],"forehead":[25,29,43,33],"bands":{"crownY":18,"chinY":45,"waistY":61,"footY":78},"arms":{"R":{"box":[44,62,50,67],"pivot":[47,61],"pal":{"out":"a","slv":"d","cuff":"e","hand":"v"}}},"prop":{"kind":"lift","box":[19,41,27,52]}},"rsHunyuan":{"w":65,"h":85,"cx":32,"outline":"a","skinKeys":["t","q"],"skinFill":"t","faceBox":[18,25,44,37],"eyeL":{"box":[22,27,28,33],"mask":["######.","#iiiii.","#iiiii.","#iiiii.","#iiiii.","..iii..","#......"]},"eyeR":{"box":[37,27,43,33],"mask":["#####.#","#iiiii#","#iiiii#","#iiii##","#iiii..",".iii..#",".....i#"]},"mouth":[32,34],"cheeks":[[23,33],[42,33]],"forehead":[23,25,41,27],"bands":{"crownY":13,"chinY":37,"waistY":57,"footY":73},"arms":{"L":{"box":[14,54,20,59],"pivot":[17,53],"pal":{"out":"a","slv":"e","cuff":"m","hand":"t"}},"R":{"box":[45,54,50,59],"pivot":[47,53],"pal":{"out":"a","slv":"e","cuff":"m","hand":"t"}}}},"rsZhipu":{"w":67,"h":87,"cx":33,"outline":"a","skinKeys":["q"],"skinFill":"q","faceBox":[21,31,44,47],"eyeL":{"box":[24,37,29,43],"mask":["######","##iii#","#iiii.","#iiii.","#iiii.","#iii..",".ii..."]},"eyeR":{"box":[37,37,42,43],"mask":["######","#i#ii#","#iiii#","#iiii#","#iiii#",".iiii.","..ii.#"]},"mouth":[33,45],"cheeks":[[23,44],[43,44]],"forehead":[24,31,42,36],"bands":{"crownY":21,"chinY":47,"waistY":61,"footY":75},"prop":{"kind":"lift","box":[26,50,40,63]},"tail":[43,66,61,82]},"rsMinimax":{"w":64,"h":91,"cx":32,"outline":"s","skinKeys":["g","f","n"],"skinFill":"g","faceBox":[19,30,45,47],"eyeL":{"box":[22,35,28,41],"mask":[".#####.","#iiiii#","#ii#ii.","#iiiii#","#iiiii#","#iiiii#","#i...i."]},"eyeR":{"box":[35,35,41,41],"mask":["...####",".iiiii#","#..ii##","..iiii#","..iiii#","..iiii#","...i..#"]},"mouth":[32,43],"cheeks":[[21,42],[42,42]],"forehead":[24,31,40,35],"bands":{"crownY":19,"chinY":47,"waistY":61,"footY":77},"prop":{"kind":"lift","box":[40,44,53,57]}},"rsMimo":{"w":79,"h":85,"cx":38,"outline":"q","skinKeys":["h","x"],"skinFill":"h","faceBox":[26,31,51,45],"eyeL":{"box":[29,34,35,41],"mask":["#######","#iiiii#","#ii#ii#","#iiiii#","#iiiii#","#iiiii#","#iiiii.",".iiii.."]},"eyeR":{"box":[42,34,48,41],"mask":[".#.####","#iiiii#",".iii..#",".iiiii#","#iiiii#",".iiiii#","..iiii#","...iii#"]},"mouth":[38,42],"cheeks":[[28,41],[48,41]],"forehead":[30,31,46,34],"bands":{"crownY":18,"chinY":45,"waistY":60,"footY":74},"prop":{"kind":"float","box":[31,45,45,63]}},"rsWenxin":{"w":66,"h":81,"cx":32,"outline":"b","skinKeys":["w"],"skinFill":"w","faceBox":[20,27,42,42],"eyeL":{"box":[23,30,29,35],"mask":["#####.#","#i#iii.","#iiii.#","#iiii..","#iiii..",".iiii.."]},"eyeR":{"box":[35,30,41,35],"mask":["#######","#i#iii#","#iiiii#","#iiiii#","#iiiii.",".iiii.#"]},"mouth":null,"cheeks":[[22,36],[41,36]],"forehead":[24,27,40,30],"bands":{"crownY":14,"chinY":42,"waistY":54,"footY":70},"prop":{"kind":"ecg","screen":[54,32,62,38],"drip":[51,21,52,25]},"wheel":true}};
// END_MODEL_RIGS

const MODEL_U = 4;
const Q_STAMP_PAL = {
  '!@': '#12142B', '!#': '#1E1A2E', '!W': '#FFFFFF', '!M': '#5A2430', '!T': '#E8607E', '!t': '#FFF4EC',
  '!P': '#F58E8E', '!%': '#E86F78', '!y': '#22A7D6', '!Y': '#8EDCF4', '!R': '#F0384E', '!$': '#A61F35',
  '!A': '#F6B13E', '!a': '#FFE7A6', '!~': '#3A3166', '!K': '#1E1B2E', '!&': '#3B3758',
};

// Anime 6-7px eye stamps (built cleanly inside each character's eye mask) and compact chibi mouths.
const Q_MOUTHS = {
  smile:  { rows: ['#.#', '.#.'] },
  flat:   { rows: ['###'] },
  frown:  { rows: ['.#.', '#.#'] },
  o:      { rows: ['##', '##'] },
  O:      { rows: ['.#.', '#M#', '.#.'], dy: -1 },
  grin:   { rows: ['####', '#tt#', '.##.'], dy: -1 },
  laugh:  { rows: ['#####', '#ttt#', '#MMM#', '.###.'], dy: -1 },
  open:   { rows: ['.###.', '#MMM#', '.###.'], dy: -1 },
  wobble: { rows: ['#.#.#', '.#.#.'] },
  cat:    { rows: ['#.#.#', '.#.#.'] },
  smirk:  { rows: ['..#', '##.'] },
  wail:   { rows: ['.####.', '#MMMM#', '#MTTM#', '.####.'], rows2: ['..##..', '.#MM#.', '#MTTM#', '.####.'], dy: -1 },
  teeth:  { rows: ['#####', '#t#t#', '#####'], dy: -1 },
  tongue: { rows: ['#.#', '.#.', '.T.'] },
  pout:   { rows: ['.#.', '#T#', '.#.'], dy: -1 },
  yawn:   { rows: ['.#.', '#M#', '#T#', '.#.'], dy: -1 },
};

const Q_EYES_STAMP = {
  happy:   { rows: ['.@@@.', '@...@'] },
  squeeze: { l: ['@...', '.@@.', '..@@', '.@@.', '@...'], r: ['...@', '.@@.', '@@..', '.@@.', '...@'] },
  closed:  { rows: ['@...@', '.@@@.'] },
  heart:   { rows: ['.RR.RR.', 'RWRRRR$', '.RRRR$.', '..RR$..', '...$...'] },
  spark:   { rows: ['..A..', '.AaA.', 'AAWAA', '.AaA.', '..A..'], rows2: ['..a..', '.aAa.', 'aAWWa', '.aAa.', '..a..'] },
  swirl:   { rows: ['.@@@.', '@...@', '@.@.@', '@..@@', '.@...'], rows2: ['.@@@.', '@...@', '@.@.@', '@@..@', '...@.'] },
  x:       { rows: ['@...@', '.@.@.', '..@..', '.@.@.', '@...@'] },
  blank:   { solid: 'W' },
};

function _qWalkTiming(o) {
  let step = null, bob = 0;
  if (o.walk != null) {
    step = ((Math.floor(o.walk * 8) % 8) + 8) % 8;
    bob = step % 4 === 1 || step % 4 === 2 ? -1 : 0;
  }
  const sq = (o.sq || 0) + (o.take || 0);
  const crouch = sq >= .16 ? 2 : sq >= .07 ? 1 : sq <= -.13 ? -2 : sq <= -.05 ? -1 : 0;
  const cheerSway = (o.poseR === 'wave' || o.poseL === 'wave' || (o.aR || 0) >= 1.1 || (o.aL || 0) >= 1.1)
    ? Math.round(Math.sin(onTwos(T) * 10 + (o.seed || 0))) : 0;
  const tremor = (o.emo === 'scared' || o.emo === 'furious' || o.emo === 'cry') && (Math.floor(onTwos(T) * 12) % 2) ? 1 : 0;
  const lean = clamp(Math.round((o.rot || 0) * 18) + cheerSway, -3, 3);
  const bx = Math.round((o.dx || 0) * MODEL_U) + tremor;
  const by = Math.round((o.dy || 0) * MODEL_U) + bob;
  const crownLag = clamp(Math.round((o.dy || 0) * -0.4 + (crouch >= 2 ? 1 : crouch <= -2 ? -1 : 0)), -1, 1);
  const swayX = step == null ? cheerSway : [0, 1, 1, 0, 0, -1, -1, 0][step];
  return { bx, by, sq, crouch, lean, step, crownLag, swayX };
}

function _qTintPalette(R, S, o) {
  if (!o.tint && !o.tintFade) return null;
  const C = { pal: S.pal, skinKeys: R.skinKeys, tintK: .24 };
  return pxSkin(C, o);
}

function _qBoxHas(box, x, y) {
  return box && x >= box[0] && x <= box[2] && y >= box[1] && y <= box[3];
}

function _qApplyFace(grid, R, S, o) {
  const tt = onTwos(T), sk = R.skinFill;
  const skSet = new Set(R.skinKeys);
  const [fx0, fy0, fx1, fy1] = R.faceBox;
  const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['happy', 'normal'] : [o.eyes || 'normal', o.eyes || 'normal'];
  const blinking = ((tt * .9 + (o.seed || 0) * 1.7) % 3.3) < .11;
  const sq = o.squint || 0;
  const lx = Math.round(clamp(o.lookX || 0, -1, 1));
  const ly = Math.round(clamp(o.lookY || 0, -1, 1));
  const h = R.h, w = R.w;

  const paintCell = (x, y, val, onlySkinOrMask = null) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    if (onlySkinOrMask && !onlySkinOrMask(x, y, grid[y][x])) return;
    grid[y][x] = val;
  };
  const S_KEY = ch => (ch.length === 1 && Q_STAMP_PAL['!' + ch] ? '!' + ch : ch);

  const renderEye = (eyeCfg, kind, isRight) => {
    if (!eyeCfg) return;
    const [x0, y0, x1, y1] = eyeCfg.box;
    const mask = eyeCfg.mask, bw = x1 - x0 + 1, bh = y1 - y0 + 1;
    let ix0 = bw, iy0 = bh, ix1 = -1, iy1 = -1;
    for (let j = 0; j < bh; j++) for (let i = 0; i < bw; i++) {
      if (mask[j][i] === 'i') { if (i < ix0) ix0 = i; if (i > ix1) ix1 = i; if (j < iy0) iy0 = j; if (j > iy1) iy1 = j; }
    }
    if (ix1 < ix0) { ix0 = 0; ix1 = bw - 1; iy0 = 0; iy1 = bh - 1; }
    const inMask = (x, y) => {
      const mx = x - x0, my = y - y0;
      return mx >= 0 && my >= 0 && mx < bw && my < bh && mask[my][mx] !== '.';
    };
    const isSafe = (x, y, cur) => skSet.has(cur) || inMask(x, y);
    const clearEye = () => {
      for (let j = 0; j < bh; j++) for (let i = 0; i < bw; i++) {
        if (mask[j][i] === 'i' || (mask[j][i] !== '.' && j <= iy1 && i >= ix0 - 1 && i <= ix1 + 1)) grid[y0 + j][x0 + i] = sk;
      }
    };

    if (sq > .7 || (['normal', 'look', 'wide', 'shine'].includes(kind) && blinking)) kind = 'blink';
    else if (sq > .35 && ['normal', 'look', 'wide', 'shine'].includes(kind)) kind = 'narrow';

    if (kind === 'shades') {
      for (let j = 1; j < bh; j++) for (let i = 0; i < bw; i++) {
        paintCell(x0 + i, y0 + j, j === 1 ? '!K' : ((i + j) % 2 && j > 2 ? '!&' : '!K'));
      }
      if (bh >= 4 && bw >= 4) {
        paintCell(x0 + 1, y0 + 2, '!W'); paintCell(x0 + 2, y0 + 2, '!W'); paintCell(x0 + 1, y0 + 3, '!W');
      }
      return;
    }

    if (kind === 'blink') {
      clearEye();
      const lashY = Math.min(iy1, Math.round((iy0 + iy1) / 2) + 1);
      for (let i = ix0; i <= ix1; i++) paintCell(x0 + i, y0 + lashY, '!@');
      return;
    }

    if (kind === 'normal' || kind === 'look' || kind === 'wide' || kind === 'shine' || kind === 'red') {
      if (lx || ly) {
        const orig = [];
        for (let j = 0; j < bh; j++) orig.push(grid[y0 + j].slice(x0, x1 + 1));
        for (let j = 0; j < bh; j++) for (let i = 0; i < bw; i++) {
          if (mask[j][i] === 'i') {
            const si = i - lx, sj = j - ly;
            if (si >= 0 && sj >= 0 && si < bw && sj < bh && mask[sj][si] === 'i') grid[y0 + j][x0 + i] = orig[sj][si];
            else grid[y0 + j][x0 + i] = '!W';
          }
        }
      }
      if (kind === 'wide' || kind === 'shine') {
        paintCell(x0 + Math.max(ix0, 1), y0 + Math.max(iy0, 1), '!W', inMask);
        if (kind === 'shine') paintCell(x0 + Math.max(ix0, ix1 - 1), y0 + Math.max(iy0, iy1 - 1), '!W', inMask);
      }
      if (kind === 'red') {
        for (let j = 0; j < bh; j++) for (let i = 0; i < bw; i++) {
          if (mask[j][i] === 'i') grid[y0 + j][x0 + i] = (j <= 2 && i === 2) ? '!W' : (j >= iy1 - 1 ? '!$' : '!R');
        }
      }
      return;
    }

    if (kind === 'sleepy' || kind === 'narrow') {
      const cut = kind === 'sleepy' ? Math.min(3, iy1 - 1) : Math.min(2, iy1 - 1);
      for (let j = 0; j <= cut; j++) for (let i = 0; i < bw; i++) {
        if (mask[j][i] !== '.' && i >= ix0 - 1 && i <= ix1 + 1) grid[y0 + j][x0 + i] = j === cut ? '!@' : sk;
      }
      return;
    }

    if (kind === 'angry' || kind === 'determined') {
      const drop = kind === 'angry' ? 2 : 1;
      for (let j = 0; j < iy1; j++) for (let i = 0; i < bw; i++) {
        const t = isRight ? (bw - 1 - i) / Math.max(1, bw - 1) : i / Math.max(1, bw - 1);
        const brow = Math.round(t * drop) + 1;
        if (mask[j][i] !== '.' && i >= ix0 - 1 && i <= ix1 + 1) {
          if (j < brow) grid[y0 + j][x0 + i] = sk;
          else if (j === brow) grid[y0 + j][x0 + i] = '!@';
        }
      }
      if (kind === 'determined') paintCell(x0 + Math.max(ix0, 1), y0 + Math.min(iy1 - 1, 3), '!W', inMask);
      return;
    }

    if (kind === 'sad' || kind === 'teary') {
      for (let j = 0; j < iy1; j++) for (let i = 0; i < bw; i++) {
        const t = isRight ? i / Math.max(1, bw - 1) : (bw - 1 - i) / Math.max(1, bw - 1);
        const brow = Math.round(t * 2) + 1;
        if (mask[j][i] !== '.' && i >= ix0 - 1 && i <= ix1 + 1) {
          if (j < brow) grid[y0 + j][x0 + i] = sk;
          else if (j === brow) grid[y0 + j][x0 + i] = '!@';
        }
      }
      if (kind === 'teary') {
        const tw = Math.floor(tt * 4) % 2;
        for (let i = ix0; i <= ix1; i++) paintCell(x0 + i, y0 + iy1, (i + tw) % 3 === 0 ? '!W' : '!Y', isSafe);
        paintCell(x0 + Math.floor((ix0 + ix1) / 2), y0 + iy1 + 1, '!y', (x, y, cur) => skSet.has(cur));
      }
      return;
    }

    if (kind === 'scared') {
      clearEye();
      const iw = ix1 - ix0 + 1, ih = iy1 - iy0 + 1;
      for (let j = iy0; j <= iy1; j++) for (let i = ix0; i <= ix1; i++) {
        grid[y0 + j][x0 + i] = (j === iy0 || j === iy1 || i === ix0 || i === ix1) ? '!@' : '!W';
      }
      const jig = Math.floor(tt * 12) % 2 ? 1 : 0;
      const px = x0 + ix0 + Math.floor(iw / 2) + clamp(lx + jig, -1, 0), py = y0 + iy0 + Math.floor(ih / 2) + ly;
      paintCell(px, py, '!@', inMask); paintCell(px + 1, py, '!@', inMask);
      return;
    }

    clearEye();
    if (kind === 'blank') {
      for (let j = iy0 + 1; j <= iy1; j++) for (let i = ix0; i <= ix1; i++) paintCell(x0 + i, y0 + j, '!W', inMask);
      return;
    }
    const useKind = kind === 'cry' ? 'squeeze' : kind;
    const S_E = Q_EYES_STAMP[useKind] || Q_EYES_STAMP.happy;
    const rows = S_E.l ? (isRight ? S_E.r : S_E.l) : (S_E.rows2 && Math.floor(tt * 4) % 2 ? S_E.rows2 : S_E.rows);
    if (rows) {
      const sw = rows[0].length, sh = rows.length;
      const cx = x0 + Math.floor((ix0 + ix1 + 1 - sw) / 2), cy = y0 + Math.max(iy0, iy1 - sh + (sh <= 2 ? 0 : 1));
      for (let sj = 0; sj < sh; sj++) for (let si = 0; si < sw; si++) {
        if (rows[sj][si] !== '.') paintCell(cx + si, cy + sj, S_KEY(rows[sj][si]), isSafe);
      }
    }
    if (kind === 'cry') {
      const len = 5, ph = Math.floor(tt * 10) % len;
      const tx = x0 + Math.floor((ix0 + ix1) / 2);
      for (let k = 0; k < len; k++) {
        paintCell(tx, y0 + iy1 + k, k === ph ? '!W' : '!Y', (x, y, cur) => skSet.has(cur) || inMask(x, y));
        paintCell(tx + (isRight ? -1 : 1), y0 + iy1 + k, '!y', (x, y, cur) => skSet.has(cur) || inMask(x, y));
      }
    }
  };

  renderEye(R.eyeL, kinds[0], false);
  renderEye(R.eyeR, kinds[Math.min(1, kinds.length - 1)], true);

  if (kinds[0] === 'shades' && R.eyeL && R.eyeR) {
    const by = R.eyeL.box[1] + 2;
    for (let bx = R.eyeL.box[2]; bx <= R.eyeR.box[0]; bx++) paintCell(bx, by, '!K');
  }

  if (R.mouth && o.mouth !== undefined && o.mouth !== null) {
    const [mx, my] = R.mouth;
    let mName = o.mouth;
    if ((o.lid || 0) > .1) mName = 'wail';
    const M = Q_MOUTHS[mName];
    if (M) {
      for (let yy = my - 1; yy <= my + 2; yy++) for (let xx = mx - 2; xx <= mx + 2; xx++) {
        if (xx >= fx0 && xx <= fx1 && yy >= fy0 && yy <= fy1 && grid[yy]?.[xx] && grid[yy][xx] !== R.outline) {
          const c = grid[yy][xx];
          if (!skSet.has(c) && (yy === my || yy === my + 1)) grid[yy][xx] = sk;
        }
      }
      const rows = M.rows2 && Math.floor(tt * 6) % 2 ? M.rows2 : M.rows;
      const mw = rows[0].length, x0 = mx - Math.floor(mw / 2), y0 = my + (M.dy || 0);
      for (let j = 0; j < rows.length; j++) for (let i = 0; i < mw; i++) {
        if (rows[j][i] !== '.') paintCell(x0 + i, y0 + j, S_KEY(rows[j][i]), (x, y, cur) => cur !== R.outline);
      }
    }
  }

  const b = o.blush === true ? 1 : (o.blush || 0);
  if (b > .15 && R.cheeks) {
    const patch = b > .6 ? ['.P%P.', 'PPPPP'] : b > .35 ? ['.PP.', 'PPPP'] : ['PPP'];
    const pw = patch[0].length;
    for (const [cx, cy] of R.cheeks) {
      for (let j = 0; j < patch.length; j++) for (let i = 0; i < pw; i++) {
        if (patch[j][i] !== '.') paintCell(cx - Math.floor(pw / 2) + i, cy + j, S_KEY(patch[j][i]), (x, y, cur) => skSet.has(cur));
      }
    }
  }

  if ((o.gloom || 0) > .1 && R.forehead) {
    const [gx0, gy0, gx1, gy1] = R.forehead, g = o.gloom;
    for (let y = gy0; y <= gy1; y++) for (let x = gx0; x <= gx1; x++) {
      if (!skSet.has(grid[y]?.[x])) continue;
      if (((x - gx0) % 2 === 0 && y - gy0 <= Math.round((gy1 - gy0) * (.5 + g))) || y - gy0 < 2 * g) grid[y][x] = '!~';
    }
  }
}

function _qAnimateProps(grid, R, S, o, tt) {
  if (!R.prop) return;
  if (R.prop.kind === 'ecg') {
    const [sx0, sy0, sx1, sy1] = R.prop.screen;
    const pulseX = sx0 + 1 + (Math.floor(tt * 8) % Math.max(1, sx1 - sx0 - 1));
    for (let yy = sy0 + 1; yy <= sy1 - 1; yy++) for (let xx = sx0 + 1; xx <= sx1 - 1; xx++) {
      if (xx === pulseX) grid[yy][xx] = yy === Math.floor((sy0 + sy1) / 2) - 1 ? '!W' : '!Y';
      else if (yy === Math.floor((sy0 + sy1) / 2) && xx > sx0 && xx < sx1) grid[yy][xx] = '!y';
    }
    const [dx0, dy0, , dy1] = R.prop.drip;
    const dropY = dy0 + (Math.floor(tt * 4) % Math.max(1, dy1 - dy0 + 1));
    if (grid[dropY]?.[dx0]) grid[dropY][dx0] = '!Y';
    return;
  }
  if (R.prop.kind === 'stars') {
    const boxes = R.prop.boxes || (R.prop.box ? [R.prop.box] : []);
    for (let bi = 0; bi < boxes.length; bi++) {
      const [bx0, by0, bx1, by1] = boxes[bi];
      const on = Math.floor(tt * 5 + bi) % 2 === 1;
      for (let yy = by0; yy <= by1; yy++) for (let xx = bx0; xx <= bx1; xx++) {
        const k = grid[yy]?.[xx], hx = S.pal[k]?.toUpperCase();
        if (on && (hx === '#FFFFFF' || hx === '#FCFCFC' || hx === '#FDF9F9' || hx === '#D8ECFF')) grid[yy][xx] = '!A';
      }
    }
  }
}

function _modelDrawRigged(R, S, x, y, o) {
  const st = new PxStack();
  const q = _qWalkTiming(o);
  const skinTint = _qTintPalette(R, S, o);
  const tt = onTwos(T);
  const grid = S.rows.map(r => r.split(''));

  // 1) Expressive face updates + live in-grid prop animation (zero torn rectangles!)
  _qApplyFace(grid, R, S, o);
  _qAnimateProps(grid, R, S, o, tt);

  const drawPal = { ...S.pal, ...Q_STAMP_PAL };
  const tintMap = {};
  if (skinTint) {
    let si = 0;
    for (const [k, hx] of Object.entries(skinTint)) { const tk = '!S' + (si++); tintMap[k] = tk; drawPal[tk] = hx; }
  }

  // 2) Wheel spoke ticks for Wenxin wheelchair when moving
  const wheelTick = R.wheel && o.walk != null && (Math.floor(o.walk * 6) % 2 === 1);

  const ox = Math.floor(R.w / 2), oy = R.h;
  const B = R.bands;

  // Gapless monotonic row-shift table across body bands + secondary crown inertia
  const rowShearX = py => Math.round(q.lean * Math.pow(clamp((B.footY - py) / Math.max(1, B.footY)), 1.15)) + (py <= B.waistY ? q.swayX : 0);
  const sy = new Int16Array(R.h);
  for (let py = 0; py < R.h; py++) {
    if (py >= B.footY) sy[py] = q.by <= -6 ? -1 : 0;
    else if (py > B.waistY) sy[py] = Math.round(q.crouch * .5);
    else if (py <= B.crownY) sy[py] = q.crouch + q.crownLag;
    else sy[py] = q.crouch;
  }

  // Pass A: Grounded feet / wheels first (so ankles tuck smoothly beneath skirt edge)
  for (let py = B.footY; py < R.h; py++) {
    const row = grid[py];
    const footLiftL = q.step == null ? 0 : (q.step === 1 || q.step === 2 ? -2 : q.step === 0 || q.step === 3 ? -1 : 0);
    const footLiftR = q.step == null ? 0 : (q.step === 5 || q.step === 6 ? -2 : q.step === 4 || q.step === 7 ? -1 : 0);
    for (let px = 0; px < R.w; px++) {
      let k = row[px];
      if (k === '.') continue;
      let dy = sy[py];
      if (!R.wheel) dy += px < R.cx ? footLiftL : footLiftR;
      else if (wheelTick && py >= B.footY + 2 && (px < 18 || px > R.w - 18) && (px + py) % 2 === 0 && k !== R.outline) k = '!Y';
      const colVal = (tintMap[k] && _qBoxHas(R.faceBox, px, py)) ? tintMap[k] : k;
      st.set(px - ox, py - oy + dy, colVal);
    }
  }

  // Pass B: Body/hair/skirt drawn gaplessly (stretch gaps filled automatically; landing widens outer edges only)
  for (let py = B.footY - 1; py >= 0; py--) {
    const row = grid[py];
    const syBase = sy[py], sxBase = rowShearX(py);
    const nextSy = py + 1 < R.h ? sy[py + 1] : syBase;
    const gap = Math.max(0, nextSy - syBase);
    let minPx = R.w, maxPx = -1, minCol = null, maxCol = null;
    for (let px = 0; px < R.w; px++) {
      const k = row[px];
      if (k === '.') continue;
      const colVal = (tintMap[k] && _qBoxHas(R.faceBox, px, py)) ? tintMap[k] : k;
      if (px < minPx) { minPx = px; minCol = colVal; }
      if (px > maxPx) { maxPx = px; maxCol = colVal; }
      for (let g = 0; g <= gap; g++) st.set(px - ox + sxBase, py - oy + syBase + g, colVal);
    }
    if (q.crouch >= 2 && py > B.waistY && py < B.footY && minCol && maxCol) {
      st.set(minPx - 1 - ox + sxBase, py - oy + syBase, minCol);
      st.set(maxPx + 1 - ox + sxBase, py - oy + syBase, maxCol);
    }
  }

  const flip = !!o.flip, wx = x + q.bx, wy = y + q.by;
  if (!o.noShadow) hgShadow(wx, y, o.dy || 0, Math.max(14, Math.round(R.w * .24)));
  const drawCfg = { pal: drawPal, axis2: 0, ground: 0, outline: R.outline, rimFrom: null, skinKeys: [] };
  pxDrawStack(st, wx, wy, drawCfg, flip, null, false);
  if (o.emote) {
    const E = PX_EMOTES[o.emote] || {}, dir = flip ? -1 : 1;
    const ex = E.top ? wx : wx + dir * Math.round(R.w * .28) - (flip ? 6 : 0);
    const ey = wy - R.h + q.crouch + (E.top ? -2 : 12);
    pxEmote(o.emote, ex, ey, o.emoteK ?? 1, o.emoteAge ?? T, dir);
  }
}

function _modelDrawGeneric(S, x, y, o) {
  const h = S.rows.length, w = S.rows[0].length, ox = Math.floor(w / 2), oy = h;
  const q = _qWalkTiming(o);
  const footY = Math.round(h * .8), waistY = Math.round(h * .6);
  const st = new PxStack();
  for (let py = 0; py < h; py++) {
    const row = S.rows[py];
    const footLiftL = py >= footY && q.step != null && (q.step === 1 || q.step === 2) ? -2 : 0;
    const footLiftR = py >= footY && q.step != null && (q.step === 5 || q.step === 6) ? -2 : 0;
    const sy = py >= footY ? (q.by <= -8 ? -1 : 0) : py > waistY ? Math.round(q.crouch * .5) : q.crouch;
    const sx = Math.round(q.lean * Math.pow(clamp((footY - py) / Math.max(1, footY)), 1.15)) + (py <= waistY ? q.swayX : 0);
    for (let px = 0; px < w; px++) {
      const k = row[px];
      if (k !== '.') st.set(px - ox + sx, py - oy + sy + (px < ox ? footLiftL : footLiftR), k);
    }
  }
  const flip = !!o.flip, wx = x + q.bx, wy = y + q.by;
  if (!o.noShadow) hgShadow(wx, y, o.dy || 0, Math.max(13, Math.round(w * .24)));
  pxDrawStack(st, wx, wy, { pal: S.pal, axis2: 0, ground: 0, rimFrom: null, skinKeys: [] }, flip, null, false);
  if (o.emote) {
    const E = PX_EMOTES[o.emote] || {}, dir = flip ? -1 : 1;
    pxEmote(o.emote, E.top ? wx : wx + dir * 16 - (flip ? 6 : 0), wy - h + q.crouch + (E.top ? -2 : 10), o.emoteK ?? 1, o.emoteAge ?? T, dir);
  }
}

// BEGIN_HGQ_PARTS
const HGQ_PARTS = {"w":58,"h":94,"ox":29,"ground":93,"pal":{"O":"#12142B","K":"#080A18","k":"#1D1E26","h":"#2B2C36","H":"#3E404C","d":"#3A2C2A","b":"#5A4D46","B":"#7B685E","s":"#FCDAC4","S":"#E9B393","D":"#C98566","e":"#875E3C","E":"#683322","W":"#FEFEFE","g":"#C8C9D2","G":"#828492","m":"#565868","M":"#242038"},"parts":{"front.neck":{"x":26,"y":39,"rows":["SSSSSSS","SSSSSSS","SSSSSSS","sssssss","sssssss","sssssss","sssssss"]},"front.head":{"x":6,"y":2,"rows":[".......................OOOOOOO.................","....................OOOOOOOOOOOO...............","..................OOOOOkkkkOkkOOOOOOO..........","................OOOOkkkkkkOkkkkkOOkkkO.........","...............OOOkkkkkkkOkkkkkkkkOOkO.........","..............OOkkkkkkkkOkkkkkkkkkkkOO.........",".............OOkkkkkkkkOkkkkkkkkkkkkkOO........","............OOkkkkkkkkkOkkkkkkkkkkkkkkOO.......",".........OOOOkkkkkkkkkOkkkkkkkkkkWkkWkOOO......",".......OOOOOOOOOOOOOOOOkkkkkkkkkkWkkWkOkOO.....","......OOOKKKKKKKOOkkkkOOOOkkkkkkkWWWWkkOkOO....",".....OOKKKKKKKKOOOOOkkkkkkOOkkkkWOWWOWkOkkOO...","....OOKKKKKKKOOdddddOOkkkkkkOkkkWWWWWWkOkkOO...","...OOKKKKKKOOdddddddddOkkkkkkOOkkWWWWkkOkkkOO..","..OOKKKKKKOddddddddddddOkkkkkkkOkkkkkkOkkkkOO..","..OOKKKKKdddbdbbbdddddddOOkkkkkkOkkkkkOkkkkKOO.","..OOKKKKOdbBdbbbdbdbdbddddOkkkkkkOkkkkOkkkkKOO.","...OOOKOdBBdBBbdbbdbdbbddddOkkkkkkOkkOkkkkkKOO.",".OOOOOdbbbbdbBdbBddBdBbbddddOOkkkkkOkOkkkkkKOO.","OOOOObbddddbbbdbdbdBdBBBdbbddOOOOOOOOKkkkkKKOO.",".OOdbbdbdBbdbbdbdsdbBdBbddbdddddddddddOkkkKKOO.","..OOOkbdBbddbdbddddbbbdbdbbddbbdbdbbbddOKKKKOO.",".OOObbdbbddbHdbdssdbdbbddbbbbdbdbBdbBdbddOKOO..","OOdbbddddbdbdsdsssbbdbdbdbddddbbdBdBBBdbbdOOO..",".OOOObbdbbdKKKKKKKsddbbbdbdssdbdbdbHdbbdbbdOO..","..OOObdbbKKdbdkkkkKdsdbdsdssssddbdbbbddddbbbOO.","..OOOOdbdbKgkEgdWdeKssdgKKKKKKKdGdbbbbdbbbdbbOO","..OOOObdsbKsdWBEkEgKKKdKsEkkkkdKKddbdbbddbbOOO.","...OOOdssdKsEWgedegKsgKKsEdWdBEdKKdbbdddddbbOO.",".....OdsggKgssWegesKssgKsBEkEBWEKKKdbddddddbbOO",".....OdssggKssssssKssssKsBeeegWEKgdbddddddOOOO.","......OdgsEsKKKKKKsWsssKsWBgBssgKbbdBgdddOdOO..",".......OdsEsssssssssssssKssssssKsddsssgddOOOO..","........OOOgssssssgGssGsskkkkkkssHGegssddOOO...","..........OEssssssssEEssssssssssssEgsssdOOO....","...........OOBGssssssssssssssssGBsggssBOOO.....","............OOdBGGsssssssssssGGEdGGGGGO........","............OOOkKkbbeeeebebbbkkOdOOOOO.........","...........OOkOkOKKKeeeekkkOOkkOOOO............","..............kKkkKeggggOOkkkOOkk.............."]},"side.head":{"x":6,"y":0,"rows":[".................OOOO...............................","...............OOOOOOOOOOOOOOOOO....................",".............OOOOKKKKOOOOOOOOOOOOO..................","............OOOKKkkkKKkkkkkkkkkKOOO.................","..........OOOKKkkkkkkkKKkkkkkkkkkKOO................",".........OOkkKkkkkkkkkkkKkkkkkkkkkkOO...............","........OOkkKkkkkkkkkkkkKKkkkkkkkkkOOO..............",".......OOkkKKkkkkkkkkkkkkKkkkkkkkkkkkOO.............","......OOkkkKKkkkkkkkkkkkkkKkkkkkkkkkkkO.............",".....OOkkkkKkkkkkkkkkkkkkkKkkkkkkkkkkkkO............",".....OKkkkkKkkkkkkkkkkkkkkKkWkWkkkdkkkkO............","....OOKkkkKkkkkkkkkkkkkkkkkKWkWkkkdkkkkOO...........","....OKkkkkKkkkkkkkkkkkkkkkkWWWWkkkkkkkkkO...........","....OKkkkkKkkkkkkkkkkkkkkkkWKWKkkkkkkkkKOOOOOOOOOOOO","...OKkkkkkKkkkkkkkkkkkkkkkkkWWWkkkkkkkKKKKKKKKKKKKKO","...OKkkkkkKkkkkkkkkkkkkkkkkkKkkkkkKKKKkkkkkkkkkkkkkO","...OKkkkkkKkkkkkkkkkkkkkkkkkkKkkKKKkkkkkkkkkkkkKKKKO","..OKKkkkkkKkkkkkkkkkkkkkkkkkkKKKkkkkkkkkkkkkKKKKKKOO","..OKKkkkkkkKkkkkkkkkkkkkkkkKKkkkkkkkkkkkKKKKKKKKKOO.",".OKddKkkkkkKkkkkkkkkkkkkKKKKKKKKKKKKKKKKKdKKKKKOO...","OKddbbKkkkkKkkkkkkkkKKKKKdddddddddddddddbdKOOOO.....",".OKHdbbKkkkkKkkkKKKKKddbbbddbbdBddddHHdbdbHKO.......",".OKKdbbKkkkkKKKKKdddbbbdbbdBBdBBdddbdBdbBdHbKO......","..OKkKKKkkKKKKddbbdbbbbdbdHBbdBddbHdHHddHdKKKKO.....","..OKKkkkKKKdbddbbdbbdbdbbdHHdbddssssdHddbbKOOO......","...OKKKKkddbdbdbbdbbdbdbbdbdsdSKKKKKKHdddbKO........","...OKKdbdHdddddbeeeddbbbdddsSsKKdddddKkdKbKO........","...OKbbHHbbdbddEssseKKKKKKKKKKKdgdgdGKkOOOKO........","..OObbbdbbbdddessesseKKKKKKKKKKggddEGKKOOOOO........",".OObbbdHHbdbddesSSessdbbdSsssKKWWeEEGKOO..O.........","OOKKKkbHHHddddesSSSesdbddSssssKsWeSEGkOOO...........",".OOOOKKbbbddddesSSSessddsEssssKksseEGdskO...........",".....OKbHbddddEssSeSssgdsgssssgKsssSGbsbO...........",".....OKbdddddddBssSssssGsssssssBbbHHBssbO...........",".....OKKkddddddEGsSsSsssssssssssHHHHGssbO...........",".....OKOOKHdddddESSSSsssssssssssssssssSdO...........",".....OOOOOHddddddEEESssssssssssssssesskO............","......O..OOddddddddddSssssssssssssssEEdO............","...........OdKdddddddSSsssssssssssssSBO.............","...........OOKKddKddSSSSSssssssssssseO..............","...........OOKKKKKKKSSSSSSSSsssssSBOO...............","..........OKKKkkkkkKKKKSSSSSdOOOOOOO................"]},"back.head":{"x":7,"y":0,"rows":[".....................OOOO.....................",".................OOOOKKKKOOOO.................",".............OOOOKKKKKkkKKKKKOOOO.............","...........OOKKKKhhKKKKKKKKkkKKKKOO...........","..........OKKKhhhKKhhhhKkkkKKkkkKOOO..........",".........OOKkhhhKhhhhhhKhhhhkKkkkkKKO.........","........OKkhhhhKhhhhhhhKhhhhhkKkkkkkKO........",".......OKkhhhhKhhhhhhhhKhhhhhhkKkkkkkKO.......","......OKkkhhhKhhhhhhhhhKhhhhhhhkKkkkkkKO......",".....OKKkkhhKhhhhhhhhhhKhhhhhhhhkKkkkkKOO.....",".....OOkkkhhKhhhhhhhhhhKhhhhhhhhhKkkkkkKO.....","....OKKkkkkKhhhhhhhhhhhKhhhhhhhhhkKkkkkKKO....","....OKkkkkkKkkhhhhhhhhhKhhhhhhhkkkKkkkkkKO....","....OOkkkkKkkkhhhhhhhhhKhhhhhhkkkkkKkkkkKO....","...OKKkkkkKkkkkkkhhhhhhKhhhkkkkkkkkKkkkkkKO...","...OKkkkkkKkkkkkkkhhhhhKkkkkkkkkkkkKkkkkkKO...","...OKkkkkkKkkkkkkkkkkkkKkkkkkkkkkkkKkkkkkKO...","...OKkkkkKkkkkkkkkkkKKKKKKkkkkkkkkkkKkkkkKO...","...OKkkkkKkkkkkkkkkKKdddddKkkkkkkkkkKkkkkKO...","...OKkkkkKkkkkkkkkKdddbbdbdKkkkkkkkkKkkkkKO...","...OKkkkkKkkkkkkkKddbdbdbbddKkkkkkkkKkkkKOO...","...OKKkkkKkkkkkkkKdbdbbbdbKKKkkkkkkkKkkKKdO...","..OdkHKKKKkkkkkkkKKKKKKKKKKkKkkkkkkkKKKKbdkO..",".OkkbbdddKKKkkkkkKkkkkkkkkkkKkkkkkKKKdddbbddO.","OdbbbdbbbbddKKKKkKkkkkkkkkKKKKKKKKdbbddbddbddO",".OkkdbbbdbbbbdddKKKKKKKKKKKKbbbbbbdbbbdbbdkOO.","..OkbbddbbbdbdbbbbbbbbbbbbbbbbbbbbddbdddbbkO..",".OkbbdddbbdddbbdbbbbbbbbbdbbdbddbbddbddddbkO..",".OdbddDddbdbdbbdbbbbbbbbbdbbddbdbdbdbdSDddbdO.","OddddDssdbdbddbbdbdbbbbbddbddbbddbbdddssDddO..",".OOddDssddbddddbbdddbbbddbdddbbdddddddssDOO...","...OdDssSddbbdbbbbddbbbbdddddbdddddddsssDO....","....OdDsSdddbddbbbbddbbdddddbdddddddSssDdO....",".....OdSSDddddddbbbdddddddddddddddbdSSDdO.....","......OddddbddddddbdddddddddddddddbddddO......",".......OOOddbddddddddddddddbdddddbdOOOO.......","..........OdkbddKKKKKKKKKKKKKKdbddO...........","...........OdKKKkkkkkkkkkkkkkkKKOOO...........","...........OKkkkkkkkkkkkkkkkkkkkkKKO..........","..........OOkkkkkkkkkkkkkkkkkkkkkkkKO.........",".........OKkkkkkkkkkkkkkkkkkkkkkkkkkKO........"]},"front.body.idle":{"x":11,"y":41,"rows":[".....OOOkkKkkKeggggOOkkkOOkkOOO...",".....OOkkkkOkkdsgHOkkOOOkkkkkOO...","....OOKKOOOkOkkOOkkOOkkkOOOKkOO...",".....OKkKkkOOOOkkOOOOOKKkkkKKkOO..","....OOOkkkkkKKkOOOKkKkkkkkkkKkOO..","...OOOkkkOkkkkkkkkkkKWKWKkkkkOOO..",".....OkkkkkkkOkkkkkkKWKWKkkkkkO...",".....OkkKkOkkdBkkkkkWWWWWkkkkkO...",".....OOkkkkKdkkbkkkkWKWKWkkOkkO...",".....OkOkkkKHkgkkkkkKWWWKkkkkkO...",".....OkKkkkkKgkgOkkkkkkkkkkkKkO...",".....OKOkkkkKKgkkOkkkkkkkkkkKkO...",".....OKOkkkkkkKkkkOkkkkkkKKKOkO...",".....OOkkkkkkkKKkkkOkkkkkkOKKKO...",".....OkkkkkkkkkKOkOkOKGkGGGGHOO...",".....OkkkOOkkkkkKOkOkGHkOkkkkkO...",".....OkkOOkkkkkkkKOOBOHOkkkkkOO...",".....OkkOOkkkkkkkKBOBOHOOkkkkkO...",".....OkOOkkkkkkkkkKKGkHOKOkkkkO...",".....OOkkkkkkkkkkkKKgKHOOKKKKKO...",".....OOOkkkkkkkkkkkKgKHOOKKWKWO...",".....OkOOkkkkkkkkkkKOkOOOKKWWWO...",".....OOOOOKKKKKKKKkKOkOOOKKWWWO...",".....OkkkkkkkkkkkKKKOkOOOKKKKKO...",".....OkkkkkkkkkkkkkKKKKKOkkkkOO...",".....OKKOOOOOOOOOOOOKOOOOOOOObO...",".....OkkkOkKKKKKKOKKKKKKKKKKKbO...",".....OOkkOkkkkkKKKkkkkKKkkkOOOO...",".....kkOkOkkkKKKKkKkkkOkkOkkkkO...",".....kOOkOkkKkkKKkkKKkOkkOkkkkO...","..OOOOKOkOkkkkkKKKkkkkkOkOKkkKOO..","..OKOkOOkOkkkkKKKKkkkkkOkOkkOkOO..","..OOkkKOkOkkkkKKOKKkkkkOkOKkkOOO..","..OOkkKOkOkkkKKKOKKKkOkkkkKkkOOO..","..OKkkKOkOkkkKKKOOKKKkkOkkKkkOOO..","..OOKkKkkOkkkKKKOOKKkkkOkkKOkKOO..","...OKKKkkOkkkkKKOOKOkkkOkkkKKKOO..","..OOKkkkkKKkkkkOOOOkkkkKKkkkOKOO..","..OKkkkKKKKKKkkkOOkkkKKKKKKkkkOOO.",".OKkkkkkOkkkkkkkKOKkkkkOOkkkkkkKO.","..OKKOOOOOOkkKKKKOKKKOkkOOOOOKKKO.","..OOKOkkkkkOOOkKKOOKkkOOkkkkkOKOO.","...OkkHWggHOkKKKOOKKKOkOOgggbKKO..","...OOGbbggWGdOKKOOOKKOdGWggBBGKO..","...OgWWWBWGBBHHKO.OOOHBBGWbWWWkO..","..OBggggWGBGGgHkO..OHgGBBGWGggGOO.",".OGGGGgGbbHGBBHOO.OGbBBGHGGGGGGGdO","..OOOOGGGbbBWgggbOOgggWbbGGGGWWWGO",".OkkkOOOggWgggggOOOgggggWggWWkkkO.","OOkOOddOWWWgOOOOO..OOOOWWWWWddkkkO",".OOOOOOOOOOOOOO.....OOOOOOKOOOOOO.","...OOOOOOOOO...........OOOOOOOO..."]},"front.body.walk.1":{"x":11,"y":41,"rows":[".....OOOkkKkkKeggggOOkkkOOkkOOO...",".....OOkkkkOkkdsgHOkkOOOkkkkkOO...","....OOKKOOOkOkkOOkkOOkkkOOOKkOO...",".....OKkKkkOOOOkkOOOOOKKkkkKKkOO..","....OOOkkkkkKKkOOOKkKkkkkkkkKkOO..","...OOOkkkOkkkkkkkkkkKWKWKkkkkOOO..",".....OkkkkkkkOkkkkkkKWKWKkkkkkO...",".....OkkKkOkkdBkkkkkWWWWWkkkkkO...",".....OOkkkkKdkkbkkkkWKWKWkkOkkO...",".....OkOkkkKHkgkkkkkKWWWKkkkkkO...",".....OkKkkkkKgkgOkkkkkkkkkkkKkO...",".....OKOkkkkKKgkkOkkkkkkkkkkKkO...",".....OKOkkkkkkKkkkOkkkkkkKKKOkO...",".....OOkkkkkkkKKkkkOkkkkkkOKKKO...",".....OkkkkkkkkkKOkOkOKGkGGGGHOO...",".....OkkkOOkkkkkKOkOkGHkOkkkkkO...",".....OkkOOkkkkkkkKOOBOHOkkkkkOO...",".....OkkOOkkkkkkkKBOBOHOOkkkkkO...",".....OkOOkkkkkkkkkKKGkHOKOkkkkO...",".....OOkkkkkkkkkkkKKgKHOOKKKKKO...",".....OOOkkkkkkkkkkkKgKHOOKKWKWO...",".....OkOOkkkkkkkkkkKOkOOOKKWWWO...",".....OOOOOKKKKKKKKkKOkOOOKKWWWO...",".....OkkkkkkkkkkkKKKOkOOOKKKKKO...",".....OkkkkkkkkkkkkkKKKKKOkkkkOO...",".....OKKOOOOOOOOOOOOKOOOOOOOObO...",".....OkkkOkKKKKKKOKKKKKKKKKKKbO...",".....OOkkOkkkkkKKKkkkkKKkkkOOOO...",".....kkOkOkkkKKKKkKkkkOkkOkkkkO...",".....kOOkOkkKkkKKkkKKkOkkOkkkkO...","..OOOOKOkOkkkkkKKKkkkkkOkOKkkKOO..","..OKOkOOkOkkkkKKKKkkkkkOkOkkOkOO..","..OOkkKOkOkkkkKKOKKkkkkOkOKkkOOO..","..OOkkKOkOkkkKKKOKKKkOkkkkKkkOOO..","..OKkkKOkOkkkKKKOOKKKkkOkkKkkOOO..","..OOKkKkkOkkkKKKOOKKkkkOkkKOkKOO..","..OKkkkKKKKKKkkkOOKOkkkOkkkKKKOO..",".OKkkkkkOkkkkkkkKOOkkkkKKkkkOKOO..","..OKKOOOOOOkkKKKKOkkkKKKKKKkkkOOO.","..OOKOkkkkkOOOkKKOKkkkkOOkkkkkkKO.","...OkkHWggHOkKKKOOKKKOkkOOOOOKKKO.","...OOGbbggWGdOKKOOOKkkOOkkkkkOKOO.","...OgWWWBWGBBHHKO.KKKOkOOgggbKKO..","..OBggggWGBGGgHkO.OKKOdGWggBBGKO..",".OGGGGgGbbHGBBHOO.OOOHBBGWbWWWkO..","..OOOOGGGbbBWgggbO.OHgGBBGWGggGOO.",".OkkkOOOggWgggggOOOGbBBGHGGGGGGGdO","OOkOOddOWWWgOOOOO.OgggWbbGGGGWWWGO",".OOOOOOOOOOOOOO...OgggggWggWWkkkO.","...OOOOOOOOO.......OOOOWWWWWddkkkO","....................OOOOOOKOOOOOO.",".......................OOOOOOOO..."]},"front.body.walk.2":{"x":11,"y":41,"rows":[".....OOOkkKkkKeggggOOkkkOOkkOOO...",".....OOkkkkOkkdsgHOkkOOOkkkkkOO...","....OOKKOOOkOkkOOkkOOkkkOOOKkOO...",".....OKkKkkOOOOkkOOOOOKKkkkKKkOO..","....OOOkkkkkKKkOOOKkKkkkkkkkKkOO..","...OOOkkkOkkkkkkkkkkKWKWKkkkkOOO..",".....OkkkkkkkOkkkkkkKWKWKkkkkkO...",".....OkkKkOkkdBkkkkkWWWWWkkkkkO...",".....OOkkkkKdkkbkkkkWKWKWkkOkkO...",".....OkOkkkKHkgkkkkkKWWWKkkkkkO...",".....OkKkkkkKgkgOkkkkkkkkkkkKkO...",".....OKOkkkkKKgkkOkkkkkkkkkkKkO...",".....OKOkkkkkkKkkkOkkkkkkKKKOkO...",".....OOkkkkkkkKKkkkOkkkkkkOKKKO...",".....OkkkkkkkkkKOkOkOKGkGGGGHOO...",".....OkkkOOkkkkkKOkOkGHkOkkkkkO...",".....OkkOOkkkkkkkKOOBOHOkkkkkOO...",".....OkkOOkkkkkkkKBOBOHOOkkkkkO...",".....OkOOkkkkkkkkkKKGkHOKOkkkkO...",".....OOkkkkkkkkkkkKKgKHOOKKKKKO...",".....OOOkkkkkkkkkkkKgKHOOKKWKWO...",".....OkOOkkkkkkkkkkKOkOOOKKWWWO...",".....OOOOOKKKKKKKKkKOkOOOKKWWWO...",".....OkkkkkkkkkkkKKKOkOOOKKKKKO...",".....OkkkkkkkkkkkkkKKKKKOkkkkOO...",".....OKKOOOOOOOOOOOOKOOOOOOOObO...",".....OkkkOkKKKKKKOKKKKKKKKKKKbO...",".....OOkkOkkkkkKKKkkkkKKkkkOOOO...",".....kkOkOkkkKKKKkKkkkOkkOkkkkO...",".....kOOkOkkKkkKKkkKKkOkkOkkkkO...","..OOOOKOkOkkkkkKKKkkkkkOkOKkkKOO..","..OKOkOOkOkkkkKKKKkkkkkOkOkkOkOO..","..OOkkKOkOkkkkKKOKKkkkkOkOKkkOOO..","..OOkkKOkOkkkKKKOKKKkOkkkkKkkOOO..","..OKkkKOkOkkkKKKOOKKKkkOkkKkkOOO..","..OOKkKkkOkkkKKKOOKKkkkOkkKOkKOO..","...OKKKkkOkkkkKKOOKOkkkOkkkKKKOO..","..OKkkkKKKKKKkkkOOOkkkkKKkkkOKOO..",".OKkkkkkOkkkkkkkKOkkkKKKKKKkkkOOO.","..OKKOOOOOOkkKKKKOKkkkkOOkkkkkkKO.","..OOKOkkkkkOOOkKKOKKKOkkOOOOOKKKO.","...OkkHWggHOkKKKOOOKkkOOkkkkkOKOO.","...OOGbbggWGdOKKOOKKKOkOOgggbKKO..","...OgWWWBWGBBHHKO.OKKOdGWggBBGKO..","..OBggggWGBGGgHkO.OOOHBBGWbWWWkO..",".OGGGGgGbbHGBBHOO..OHgGBBGWGggGOO.","..OOOOGGGbbBWgggbOOGbBBGHGGGGGGGdO",".OkkkOOOggWgggggOOOgggWbbGGGGWWWGO","OOkOOddOWWWgOOOOO.OgggggWggWWkkkO.",".OOOOOOOOOOOOOO....OOOOWWWWWddkkkO","...OOOOOOOOO........OOOOOOKOOOOOO.",".......................OOOOOOOO..."]},"front.body.walk.3":{"x":11,"y":41,"rows":[".....OOOkkKkkKeggggOOkkkOOkkOOO...",".....OOkkkkOkkdsgHOkkOOOkkkkkOO...","....OOKKOOOkOkkOOkkOOkkkOOOKkOO...",".....OKkKkkOOOOkkOOOOOKKkkkKKkOO..","....OOOkkkkkKKkOOOKkKkkkkkkkKkOO..","...OOOkkkOkkkkkkkkkkKWKWKkkkkOOO..",".....OkkkkkkkOkkkkkkKWKWKkkkkkO...",".....OkkKkOkkdBkkkkkWWWWWkkkkkO...",".....OOkkkkKdkkbkkkkWKWKWkkOkkO...",".....OkOkkkKHkgkkkkkKWWWKkkkkkO...",".....OkKkkkkKgkgOkkkkkkkkkkkKkO...",".....OKOkkkkKKgkkOkkkkkkkkkkKkO...",".....OKOkkkkkkKkkkOkkkkkkKKKOkO...",".....OOkkkkkkkKKkkkOkkkkkkOKKKO...",".....OkkkkkkkkkKOkOkOKGkGGGGHOO...",".....OkkkOOkkkkkKOkOkGHkOkkkkkO...",".....OkkOOkkkkkkkKOOBOHOkkkkkOO...",".....OkkOOkkkkkkkKBOBOHOOkkkkkO...",".....OkOOkkkkkkkkkKKGkHOKOkkkkO...",".....OOkkkkkkkkkkkKKgKHOOKKKKKO...",".....OOOkkkkkkkkkkkKgKHOOKKWKWO...",".....OkOOkkkkkkkkkkKOkOOOKKWWWO...",".....OOOOOKKKKKKKKkKOkOOOKKWWWO...",".....OkkkkkkkkkkkKKKOkOOOKKKKKO...",".....OkkkkkkkkkkkkkKKKKKOkkkkOO...",".....OKKOOOOOOOOOOOOKOOOOOOOObO...",".....OkkkOkKKKKKKOKKKKKKKKKKKbO...",".....OOkkOkkkkkKKKkkkkKKkkkOOOO...",".....kkOkOkkkKKKKkKkkkOkkOkkkkO...",".....kOOkOkkKkkKKkkKKkOkkOkkkkO...","..OOOOKOkOkkkkkKKKkkkkkOkOKkkKOO..","..OKOkOOkOkkkkKKKKkkkkkOkOkkOkOO..","..OOkkKOkOkkkkKKOKKkkkkOkOKkkOOO..","..OOkkKOkOkkkKKKOKKKkOkkkkKkkOOO..","..OKkkKOkOkkkKKKOOKKKkkOkkKkkOOO..","..OOKkKkkOkkkKKKOOKKkkkOkkKOkKOO..","...OKKKkkOkkkkKKOOkkkKKKKKKkkkOOO.","..OOKkkkkKKkkkkOOOKkkkkOOkkkkkkKO.","..OKkkkKKKKKKkkkOOKKKOkkOOOOOKKKO.",".OKkkkkkOkkkkkkkKOOKkkOOkkkkkOKOO.","..OKKOOOOOOkkKKKKOKKKOkOOgggbKKO..","..OOKOkkkkkOOOkKKOOKKOdGWggBBGKO..","...OkkHWggHOkKKKOOOOOHBBGWbWWWkO..","...OOGbbggWGdOKKOO.OHgGBBGWGggGOO.","...OgWWWBWGBBHHKO.OGbBBGHGGGGGGGdO","..OBggggWGBGGgHkO.OgggWbbGGGGWWWGO",".OGGGGgGbbHGBBHOO.OgggggWggWWkkkO.","..OOOOGGGbbBWgggbO.OOOOWWWWWddkkkO",".OkkkOOOggWgggggOO..OOOOOOKOOOOOO.","OOkOOddOWWWgOOOOO......OOOOOOOO...",".OOOOOOOOOOOOOO...................","...OOOOOOOOO......................"]},"front.body.walk.4":{"x":11,"y":41,"rows":[".....OOOkkKkkKeggggOOkkkOOkkOOO...",".....OOkkkkOkkdsgHOkkOOOkkkkkOO...","....OOKKOOOkOkkOOkkOOkkkOOOKkOO...",".....OKkKkkOOOOkkOOOOOKKkkkKKkOO..","....OOOkkkkkKKkOOOKkKkkkkkkkKkOO..","...OOOkkkOkkkkkkkkkkKWKWKkkkkOOO..",".....OkkkkkkkOkkkkkkKWKWKkkkkkO...",".....OkkKkOkkdBkkkkkWWWWWkkkkkO...",".....OOkkkkKdkkbkkkkWKWKWkkOkkO...",".....OkOkkkKHkgkkkkkKWWWKkkkkkO...",".....OkKkkkkKgkgOkkkkkkkkkkkKkO...",".....OKOkkkkKKgkkOkkkkkkkkkkKkO...",".....OKOkkkkkkKkkkOkkkkkkKKKOkO...",".....OOkkkkkkkKKkkkOkkkkkkOKKKO...",".....OkkkkkkkkkKOkOkOKGkGGGGHOO...",".....OkkkOOkkkkkKOkOkGHkOkkkkkO...",".....OkkOOkkkkkkkKOOBOHOkkkkkOO...",".....OkkOOkkkkkkkKBOBOHOOkkkkkO...",".....OkOOkkkkkkkkkKKGkHOKOkkkkO...",".....OOkkkkkkkkkkkKKgKHOOKKKKKO...",".....OOOkkkkkkkkkkkKgKHOOKKWKWO...",".....OkOOkkkkkkkkkkKOkOOOKKWWWO...",".....OOOOOKKKKKKKKkKOkOOOKKWWWO...",".....OkkkkkkkkkkkKKKOkOOOKKKKKO...",".....OkkkkkkkkkkkkkKKKKKOkkkkOO...",".....OKKOOOOOOOOOOOOKOOOOOOOObO...",".....OkkkOkKKKKKKOKKKKKKKKKKKbO...",".....OOkkOkkkkkKKKkkkkKKkkkOOOO...",".....kkOkOkkkKKKKkKkkkOkkOkkkkO...",".....kOOkOkkKkkKKkkKKkOkkOkkkkO...","..OOOOKOkOkkkkkKKKkkkkkOkOKkkKOO..","..OKOkOOkOkkkkKKKKkkkkkOkOkkOkOO..","..OOkkKOkOkkkkKKOKKkkkkOkOKkkOOO..","..OOkkKOkOkkkKKKOKKKkOkkkkKkkOOO..","..OKkkKOkOkkkKKKOOKKKkkOkkKkkOOO..","..OOKkKkkOkkkKKKOOKKkkkOkkKOkKOO..","...OKKKkkOkkkkKKOOKOkkkOkkkKKKOO..","..OOKkkkkKKkkkkOOOkkkKKKKKKkkkOOO.","..OKkkkKKKKKKkkkOOKkkkkOOkkkkkkKO.",".OKkkkkkOkkkkkkkKOKKKOkkOOOOOKKKO.","..OKKOOOOOOkkKKKKOOKkkOOkkkkkOKOO.","..OOKOkkkkkOOOkKKOKKKOkOOgggbKKO..","...OkkHWggHOkKKKOOOKKOdGWggBBGKO..","...OOGbbggWGdOKKOOOOOHBBGWbWWWkO..","...OgWWWBWGBBHHKO..OHgGBBGWGggGOO.","..OBggggWGBGGgHkO.OGbBBGHGGGGGGGdO",".OGGGGgGbbHGBBHOO.OgggWbbGGGGWWWGO","..OOOOGGGbbBWgggbOOgggggWggWWkkkO.",".OkkkOOOggWgggggOO.OOOOWWWWWddkkkO","OOkOOddOWWWgOOOOO...OOOOOOKOOOOOO.",".OOOOOOOOOOOOOO........OOOOOOOO...","...OOOOOOOOO......................"]},"side.body.idle":{"x":14,"y":41,"rows":["..OKKKkkkkkKKKKSSSSSdOOOOOOO",".OKkkkkkkkkkkkKKKSSeOOOOOOO.","OKkkkkkkkkkkkkkkkKKKKOO.....","OKkkkkkkKKKKkkkkkkkkKKOO....","OKkkkkkKkkKKKKKKKkkkkkKOO...",".OkkkKKkkKkKKKKKKKKkkkkOO...",".OKkKkkkKkkkkkkkkkkkkkkOO...",".OKkkkkKkkkkkkkkkkkkkkKOO...",".OkkkkkKkkkkkkkkkkkkkkkOO...",".OkkkkKKkkkkkkkkkkkkkkKOO...",".OOkkkKkKkkkkkkkkkkkkkKbOO..","..OOKKKkKkkkkkkkkkkkkkGbOO..","...OOKkkKkkkkkkkkkkkkkGgOO..","...OkKkkKkkkkkkkkkkkkkHKkO..","..OOKKkKkkkkkkkkkkkkkkKKkOO.","..OkKKkKkkkkkkkkkkkkkkKKKOO.","..OKKKKKkkkkkkkkkkkkkkKkKOO.",".OOKKKKKkkkkkkkkkkkkkkkkkOO.","OOKHHHHKkkkkkkkkkkkkkkkkkOO.","OKkKKKKKkkkkkkkkkkkkkkkkkOO.","OKKkkkkKkkkkkkkkkkkkkkkkkkOO","OWkWkkkkKkkkkkkkkkkkkkkkkkOO","OWWWKKKKKkkkkkkkkkkkkkkkkkOO","OWWWKkKkKkkkkkkkkkkkkkkkkkOO","OkkKKkkkKkkkkkkkkkkkkkkkkkOO","OKKKKkkkKKKKKKKKKKKKKKkkkOO.","OKkKKKKKKKKKKKKKKKKKKKKKKOO.",".OKkkkkkkkkkkkkkkkkkkkkkOO..","..OKKKKKKkkkkkkkkkkkkkkkOO..","...OOOOOOkkkkkkkkkkkkkkkOO..",".......OOKkkHHHHHHkkkkkOO...",".......OOKkHkkkkkkHkkkkOO...",".......OOKkHkkkkkkHkkkkOO...",".......OOKkHHHHHHHHkkkkOO...",".......OOKkHkkkkkkHkkkkOO...",".......OOKkHkkkkkkHkkkKO....",".......OOKkHkkkkkkHkkkOO....",".......OOKkHkkkkkkHkkkOO....",".......OKKKkHHHHHHkkkkOO....","......OOKkkkkkkkkkkkkKOO....","......OOKkkkkkkkkkKKKKO.....","......OOKkkkkkkkkkkHHKO.....","......OOkkkkkkkkkkGggOO.....","......OOKkkkkkKKKGWgGGOOO...",".......OOKKKKKGGgGGGWWGKOO..",".......OOHHHGGGGGGGWGGWWGOO.",".......OOWWHHHGGGGGGGGGGGHOO",".......OOggWWHHHGGGGGGGHHHOO",".......OOgggggggggWWWWHHHHOO",".......OOgggggKGggggggHHHHOO","........OOKKKKOOKOOKOOKKKOO.",".........OOOOO.OOOOOOOOOOO.."]},"side.body.walk.1":{"x":7,"y":42,"rows":["......OKkkkkKKKKKKKKKkkkkKKGKKKO................","......OKkkkKKKkkkkKkkKKkkkKKkKKO................","......OOKkKKKkkkkkkKkkkKKkkKKKKO................",".......OKKKkkkkkkkkkkkkkKKKkkKKO................",".......OKKkkkkkkkkkKkkkkkKkkkKKO................","......OOKkkkkkkkkkkKkkkkkkkkkKKKO...............","...........kkkkkkkKkkkkkkkkkkK..................","...........OkkkkkkKkkkkkkkkkKO..................","...........OkkkkkKkkkkkkkkkkKO..................","...........OkkkkKkkkkkkkkkkKGO..................","...........OkkkKKkkkkkkkkkkKGO..................","...........OkkKKkkkkkkkkkkKGHO..................","...........OkkKkkkkkkkkkkKGGKO..................","...........OkKkkkkkkkkkkkKGGKO..................","...........OkKKkkkkkkkkkKGGKkO..................","...........OKGKkkkkkkkkKHGKkkO..................","...........OKGKKKKKKKKKHGGKkkO..................","...........OKKHGGGGGGGGKHKkkkO..................","...........OKKkkkkkkkkkHKkkkkO..................","...........OKKKkkkkkkkKGKkkkkO..................","...........OKKkKKKKKKKkHKkkkkO..................","...........OOKkkkWKWkkkHKkkkkO..................","............OKkkkWWWkkkHKKKKKO..................","............OKkkkWWWkkkHKKKKKO..................","............OKkkkkkkkkkKkkkkkk..................","...........OOkKKKKKKKKKkkkkkkk..................","...........OKkkkkKKkkkkkkkkkKKKkkkKO............","..........OOKkkkkkKKkkkkkkKKkkkKkkKKO...........","..........OOkkkkkkkKKkkkkKkkkkkKKkkKO...........",".........OOkkkkkkkkkKKkkkKkkkkKKKkkKKO..........","........OKKkkkkkkkkkkKKkkKkkKKKkkKkkKO..........","......OOOKkkkkkkkkkkkkKKkkKKKKkkkKkkKKO.........",".....OKKKkkkkkkkkkkkkKOOKkKKkkkkkkKkkKO.........","....OKKkkkkkkkkkkkkkKO.OOKkkKkkkkKkkkkKO........","....OKkkkkkkkkkkkkkkKO..OOKkKkkKKkkkkkKO........","...OKkkkkkkkkkkkkkkOO....OKkkKKKkkkkkkKKO.......","...OKKkkkkkkkkkkkkKO.....OOKkkkkkkkkkkkKO.......","..OKGKkkkkkkkkkkkKO.......OKkkkkkkkkkkkKKO......",".OKGGKKkkkkkkkkkkKO.......OOKkkkkkkkkkkKKOOOOO..","OKWGGGKkkkkkkkkkKO.........OKkkkkkkkkkKGGKKKKKO.","OKWGGGGKKkkkkkkKO..........OOKkkkkkkkKGGGWGGWgKO","OKWGGGGGGKkkkKKO............OKkkkkkkKGGGWgGWgGKO","OOKWGGGGGGKKOOO.............OKkkkkkKgGGGggGgGWKO",".OOWGGGGGGKOOO..............OOKkkKKGGGGGgggWWGOO","..OKWGGGWWKO.................OOKKKgGGGGGgGWWKOO.","..OKWGGGGGGKO.................OKKgGGGGGGWWWKOO..","..OOKWGGGGGGKO.................OOGGGGGGWWKOOO...","...OOWGGGGGGKO..................OKGGWWWKKOO.....","....OOWWWWWWKO..................OOWWGKOOOO......",".....OOOOOOOO....................OOOOOOO........","......OOOOOO......................OOOO.........."]},"side.body.walk.2":{"x":14,"y":40,"rows":["..OKKKkkkkkKKKKSSSSSdOOOOOOO",".OKkkkkkkkkkkkKKKSSeOOOOOOO.","OKkkkkkkkkkkkkkkkKKKKOO.....","OKkkkkkkKKKKkkkkkkkkKKOO....","OKkkkkkKkkKKKKKKKkkkkkKOO...",".OkkkKKkkKkKKKKKKKKkkkkOO...",".OKkKkkkKkkkkkkkkkkkkkkOO...",".OKkkkkKkkkkkkkkkkkkkkKOO...",".OkkkkkKkkkkkkkkkkkkkkkOO...",".OkkkkKKkkkkkkkkkkkkkkKOO...",".OOkkkKkKkkkkkkkkkkkkkKbOO..","..OOKKKkKkkkkkkkkkkkkkGbOO..","...OOKkkKkkkkkkkkkkkkkGgOO..","...OkKkkKkkkkkkkkkkkkkHKkO..","..OOKKkKkkkkkkkkkkkkkkKKkOO.","..OkKKkKkkkkkkkkkkkkkkKKKOO.","..OKKKKKkkkkkkkkkkkkkkKkKOO.",".OOKKKKKkkkkkkkkkkkkkkkkkOO.","OOKHHHHKkkkkkkkkkkkkkkkkkOO.","OKkKKKKKkkkkkkkkkkkkkkkkkOO.","OKKkkkkKkkkkkkkkkkkkkkkkkkOO","OWkWkkkkKkkkkkkkkkkkkkkkkkOO","OWWWKKKKKkkkkkkkkkkkkkkkkkOO","OWWWKkKkKkkkkkkkkkkkkkkkkkOO","OkkKKkkkKkkkkkkkkkkkkkkkkkOO","OKKKKkkkKKKKKKKKKKKKKKkkkOO.","OKkKKKKKKKKKKKKKKKKKKKKKKOO.",".OKkkkkkkkkkkkkkkkkkkkkkOO..","..OKKKKKKkkkkkkkkkkkkkkkOO..","...OOOOOOkkkkkkkkkkkkkkkOO..",".......OOKkkHHHHHHkkkkkOO...",".......OOKkHkkkkkkHkkkkOO...",".......OOKkHkkkkkkHkkkkOO...",".......OOKkHHHHHHHHkkkkOO...",".......OOKkHkkkkkkHkkkkOO...",".......OOKkHkkkkkkHkkkKO....",".......OOKkHkkkkkkHkkkOO....",".......OOKkHkkkkkkHkkkOO....",".......OKKKkHHHHHHkkkkOO....","......OOKkkkkkkkkkkkkKOO....","......OOKkkkkkkkkkKKKKO.....","......OOKkkkkkkkkkkHHKO.....","......OOkkkkkkkkkkGggOO.....","......OOOKKKKKGGgGGGWWGKOO..",".......OOHHHGGGGGGGWGGWWGOO.",".......OOWWHHHGGGGGGGGGGGHOO",".......OOggWWHHHGGGGGGGHHHOO",".......OOgggggggggWWWWHHHHOO",".......OOgggggKGggggggHHHHOO","........OOKKKKOOKOOKOOKKKOO.",".........OOOOO.OOOOOOOOOOO.."]},"side.body.walk.3":{"x":7,"y":42,"rows":["......OKkkkkKKKKKKKKKkkkkKKGKKKO................","......OKkkkKKKkkkkKkkKKkkkKKkKKO................","......OOKkKKKkkkkkkKkkkKKkkKKKKO................",".......OKKKkkkkkkkkkkkkkKKKkkKKO................",".......OKKkkkkkkkkkKkkkkkKkkkKKO................","......OOKkkkkkkkkkkKkkkkkkkkkKKKO...............","...........kkkkkkkKkkkkkkkkkkK..................","...........OkkkkkkKkkkkkkkkkKO..................","...........OkkkkkKkkkkkkkkkkKO..................","...........OkkkkKkkkkkkkkkkKGO..................","...........OkkkKKkkkkkkkkkkKGO..................","...........OkkKKkkkkkkkkkkKGHO..................","...........OkkKkkkkkkkkkkKGGKO..................","...........OkKkkkkkkkkkkkKGGKO..................","...........OkKKkkkkkkkkkKGGKkO..................","...........OKGKkkkkkkkkKHGKkkO..................","...........OKGKKKKKKKKKHGGKkkO..................","...........OKKHGGGGGGGGKHKkkkO..................","...........OKKkkkkkkkkkHKkkkkO..................","...........OKKKkkkkkkkKGKkkkkO..................","...........OKKkKKKKKKKkHKkkkkO..................","...........OOKkkkWKWkkkHKkkkkO..................","............OKkkkWWWkkkHKKKKKO..................","............OKkkkWWWkkkHKKKKKO..................","............OKkkkkkkkkkKkkkkkk..................","...........OOkKKKKKKKKKkkkkkkk..................","...........OKkkkkKKkkkkkkkkkKKKkkkKO............","..........OOKkkkkkKKkkkkkkKKkkkKkkKKO...........","..........OOkkkkkkkKKkkkkKkkkkkKKkkKO...........",".........OOkkkkkkkkkKKkkkKkkkkKKKkkKKO..........","........OKKkkkkkkkkkkKKkkKkkKKKkkKkkKO..........","......OOOKkkkkkkkkkkkkKKkkKKKKkkkKkkKKO.........",".....OKKKkkkkkkkkkkkkKOOKkKKkkkkkkKkkKO.........","....OKKkkkkkkkkkkkkkKO.OOKkkKkkkkKkkkkKO........","....OKkkkkkkkkkkkkkkKO..OOKkKkkKKkkkkkKO........","...OKkkkkkkkkkkkkkkOO....OKkkKKKkkkkkkKKO.......","...OKKkkkkkkkkkkkkKO.....OOKkkkkkkkkkkkKO.......","..OKgKkkkkkkkkkkkKO.......OKkkkkkkkkkkkKKO......",".OKggKKkkkkkkkkkkKO.......OOKkkkkkkkkkkKKOOOOO..","OKWgggKkkkkkkkkkKO.........OKkkkkkkkkkKggKKKKKO.","OKWggggKKkkkkkkKO..........OOKkkkkkkkKgggWggWGKO","OKWggggggKkkkKKO............OKkkkkkkKgggWGgWGgKO","OOKWggggggKKOOO.............OKkkkkkKGgggGGgGgWKO",".OOWggggggKOOO..............OOKkkKKgggggGGGWWgOO","..OKWgggWWKO.................OOKKKGgggggGgWWKOO.","..OKWggggggKO.................OKKGggggggWWWKOO..","..OOKWggggggKO.................OOggggggWWKOOO...","...OOWggggggKO..................OKggWWWKKOO.....","....OOWWWWWWKO..................OOWWgKOOOO......",".....OOOOOOOO....................OOOOOOO........","......OOOOOO......................OOOO.........."]},"side.body.walk.4":{"x":14,"y":40,"rows":["..OKKKkkkkkKKKKSSSSSdOOOOOOO",".OKkkkkkkkkkkkKKKSSeOOOOOOO.","OKkkkkkkkkkkkkkkkKKKKOO.....","OKkkkkkkKKKKkkkkkkkkKKOO....","OKkkkkkKkkKKKKKKKkkkkkKOO...",".OkkkKKkkKkKKKKKKKKkkkkOO...",".OKkKkkkKkkkkkkkkkkkkkkOO...",".OKkkkkKkkkkkkkkkkkkkkKOO...",".OkkkkkKkkkkkkkkkkkkkkkOO...",".OkkkkKKkkkkkkkkkkkkkkKOO...",".OOkkkKkKkkkkkkkkkkkkkKbOO..","..OOKKKkKkkkkkkkkkkkkkGbOO..","...OOKkkKkkkkkkkkkkkkkGgOO..","...OkKkkKkkkkkkkkkkkkkHKkO..","..OOKKkKkkkkkkkkkkkkkkKKkOO.","..OkKKkKkkkkkkkkkkkkkkKKKOO.","..OKKKKKkkkkkkkkkkkkkkKkKOO.",".OOKKKKKkkkkkkkkkkkkkkkkkOO.","OOKHHHHKkkkkkkkkkkkkkkkkkOO.","OKkKKKKKkkkkkkkkkkkkkkkkkOO.","OKKkkkkKkkkkkkkkkkkkkkkkkkOO","OWkWkkkkKkkkkkkkkkkkkkkkkkOO","OWWWKKKKKkkkkkkkkkkkkkkkkkOO","OWWWKkKkKkkkkkkkkkkkkkkkkkOO","OkkKKkkkKkkkkkkkkkkkkkkkkkOO","OKKKKkkkKKKKKKKKKKKKKKkkkOO.","OKkKKKKKKKKKKKKKKKKKKKKKKOO.",".OKkkkkkkkkkkkkkkkkkkkkkOO..","..OKKKKKKkkkkkkkkkkkkkkkOO..","...OOOOOOkkkkkkkkkkkkkkkOO..",".......OOKkkHHHHHHkkkkkOO...",".......OOKkHkkkkkkHkkkkOO...",".......OOKkHkkkkkkHkkkkOO...",".......OOKkHHHHHHHHkkkkOO...",".......OOKkHkkkkkkHkkkkOO...",".......OOKkHkkkkkkHkkkKO....",".......OOKkHkkkkkkHkkkOO....",".......OOKkHkkkkkkHkkkOO....",".......OKKKkHHHHHHkkkkOO....","......OOKkkkkkkkkkkkkKOO....","......OOKkkkkkkkkkKKKKO.....","......OOKkkkkkkkkkkHHKO.....","......OOkkkkkkkkkkGggOO.....","......OOOKKKKKGGgGGGWWGKOO..",".......OOHHHGGGGGGGWGGWWGOO.",".......OOWWHHHGGGGGGGGGGGHOO",".......OOggWWHHHGGGGGGGHHHOO",".......OOgggggggggWWWWHHHHOO",".......OOgggggKGggggggHHHHOO","........OOKKKKOOKOOKOOKKKOO.",".........OOOOO.OOOOOOOOOOO.."]},"back.body.idle":{"x":14,"y":40,"rows":["..OKkkkkkkkkkkkkkkkkkkkkkkkkkKO...","..OKkkkkkkkkkkkkkkkkkkkkkkkkkKO...","..OKKKkkkkkkkkkkkkkkkkkkkkkKKKO...",".OOKKKKKkkkkkkkkkkkkkkkkKKKkkkKO..",".OKkkKKKKKkkkkkkkkkkkkKKKKkkkkKKO.","OKkkkkKkkKKKKkkkkkkkKKKKKkkkkkkKO.","OKkkkkkKhkKKKKKKKKKKKKKKkkkkkkkkOO","..kkkkkkKkkKKKKKKKKKKkkkkkkk......","..kkkKkkkKkhKkkkkkkkkkkkkkkk......","..kkkKkkkkKhhKkkkkkkkkkkkkkk......","..kkkKkkkkkKhhKkkkkkkkkkkkkk......","..kkKkkkkkkkKhhKkkkkkkkkkkkk......","..kkKkkkkkkkkKhhKkkkkkkkkkkk......","..kkKkkkkkkkkkKhhKkkkkkkkkkk......","..kkKkkkkkkkkkkKhhKKkkkkkkkk......","..kkKkkkkkkkkkkkKkkkKkkkkkkk......","..kKkkkkkkkkkkkkkKKhhKKKKKKK......","..kKkkkkkkkkkkkkkkkKhdKKhhhh......","..kKkkkkkkkkkkkkkkkkKKKKkhhh......","..kKkkkkkkkkkkkkkkkkkkKhKhhh......","..KKkkkkkkkkkkkkkkkkkkKhKKhh......","..kKkkkkkkkkkkkkkkkkkkKhKKKK......","..KOKKKkkkkkkkkkkkkkkkKhKhhh......","..DKKKKKKKKKKKKKKKKKKKKhKhhh......","..DKKkkKKKKKKKKKKKKKKKKKKhhh......","..DKKkkKkkkkKkkkKkkkKkkKKKKK......","..DKkkkKkkkkKkkkKkkkKkkkkkKk......","..DKkkkKkkkkKkkkKkkkKkkkkkKk......","..KKkkkkKkkKKkkkKkkkKKkkkKkk......","..KKKKkkkKKKkkkkKkkkkkKKKkkK......","..KkkKkkkkkkkkKKKKKkkkkkkkkK......",".OOkkKkkkkkkKKKKKKKKkkkkkkkKkkKO..",".OOKKKkkkKKKKKKKKKKKKKKKkkkKKKKO..",".OOkkKkkkkkkkKKKOOKKkkkkkkkKkkKO..",".OKkkKkkkkkkKKKOOKKKkkkkkkkKkkKO..",".OKkkKkkkKKKKkKOOOKKkkkkkkkKkkKO..",".OOkKkkkkkkkkkKKOOKKkkkkkkkkKkKO..",".OOKKkkkkkkkkkKOOOKKkkkkkkkkkKOO..","OKKkkkkkkkkkkKKOOOKKKkkkkkkkkkKO..","OKKKkkkkkkkkKKKOOKKkkKKKKKkkkkKOO.","OOkKKkkkkkkkkKKOOOKKkkkkkkkkkKKOO.","OOkkKKKKkkkkkKKKOOKKKkkkkkkkKkKOO.",".OKkkkkkkkkKKKKOOOKKKKkkkkKKKkKO..","..OKkkkKKKKKKKKOOOKKKKKKKKkkkKOO..","..OKKKKKGGGGHKKO.OKKHGGGGKKKKKO...","..OKHbbGGGGGGmKO.OOmGGGGGGHHbKO...",".OObHHGGGGGGGmKO.OKmGGGGGGGbHHKO..","OObbbGGGHHHbHGOO.OKGHHHHGGGGHHbOO.","OKgHbGGbHHHHHbOO.OOHHHbbbGGGbbgKO.","OKgggggWWWWWWgKO.OOgWWWWWggggggOO.",".OOOOggWWWWWWgOO.OOgWWWWWWggKKOO..","..OOOKKOOOOKKOO...OKOOOOKKOOOOO...","....OOOOOOOOOO.....OOOOOOOOOO....."]},"back.body.walk.1":{"x":14,"y":40,"rows":["..OKkkkkkkkkkkkkkkkkkkkkkkkkkKO...","..OKkkkkkkkkkkkkkkkkkkkkkkkkkKO...","..OKKKkkkkkkkkkkkkkkkkkkkkkKKKO...",".OOKKKKKkkkkkkkkkkkkkkkkKKKkkkKO..",".OKkkKKKKKkkkkkkkkkkkkKKKKkkkkKKO.","OKkkkkKkkKKKKkkkkkkkKKKKKkkkkkkKO.","OKkkkkkKhkKKKKKKKKKKKKKKkkkkkkkkOO","..kkkkkkKkkKKKKKKKKKKkkkkkkk......","..kkkKkkkKkhKkkkkkkkkkkkkkkk......","..kkkKkkkkKhhKkkkkkkkkkkkkkk......","..kkkKkkkkkKhhKkkkkkkkkkkkkk......","..kkKkkkkkkkKhhKkkkkkkkkkkkk......","..kkKkkkkkkkkKhhKkkkkkkkkkkk......","..kkKkkkkkkkkkKhhKkkkkkkkkkk......","..kkKkkkkkkkkkkKhhKKkkkkkkkk......","..kkKkkkkkkkkkkkKkkkKkkkkkkk......","..kKkkkkkkkkkkkkkKKhhKKKKKKK......","..kKkkkkkkkkkkkkkkkKhdKKhhhh......","..kKkkkkkkkkkkkkkkkkKKKKkhhh......","..kKkkkkkkkkkkkkkkkkkkKhKhhh......","..KKkkkkkkkkkkkkkkkkkkKhKKhh......","..kKkkkkkkkkkkkkkkkkkkKhKKKK......","..KOKKKkkkkkkkkkkkkkkkKhKhhh......","..DKKKKKKKKKKKKKKKKKKKKhKhhh......","..DKKkkKKKKKKKKKKKKKKKKKKhhh......","..DKKkkKkkkkKkkkKkkkKkkKKKKK......","..DKkkkKkkkkKkkkKkkkKkkkkkKk......","..DKkkkKkkkkKkkkKkkkKkkkkkKk......","..KKkkkkKkkKKkkkKkkkKKkkkKkk......","..KKKKkkkKKKkkkkKkkkkkKKKkkK......","..KkkKkkkkkkkkKKKKKkkkkkkkkK......",".OOkkKkkkkkkKKKKKKKKkkkkkkkKkkKO..",".OOKKKkkkKKKKKKKKKKKKKKKkkkKKKKO..",".OOkkKkkkkkkkKKKOOKKkkkkkkkKkkKO..",".OKkkKkkkkkkKKKOOKKKkkkkkkkKkkKO..",".OKkkKkkkKKKKkKOOOKKkkkkkkkKkkKO..",".OOkKkkkkkkkkkKKOOKKkkkkkkkkKkKO..","OKKKkkkkkkkkKKKOOOKKkkkkkkkkkKOO..","OOkKKkkkkkkkkKKOOOKKKkkkkkkkkkKO..","OOkkKKKKkkkkkKKOOKKkkKKKKKkkkkKOO.",".OKkkkkkkkkKKKKOOOKKkkkkkkkkkKKOO.","..OKkkkKKKKKKKKKOOKKKkkkkkkkKkKOO.","..OKKKKKGGGGHKKOOOKKKKkkkkKKKkKO..","..OKHbbGGGGGGmKOOOKKKKKKKKkkkKOO..",".OObHHGGGGGGGmKO.OKKHGGGGKKKKKO...","OObbbGGGHHHbHGOO.OOmGGGGGGHHbKO...","OKgHbGGbHHHHHbOO.OKmGGGGGGGbHHKO..","OKgggggWWWWWWgKO.OKGHHHHGGGGHHbOO.",".OOOOggWWWWWWgOO.OOHHHbbbGGGbbgKO.","..OOOKKOOOOKKOOO.OOgWWWWWggggggOO.","....OOOOOOOOOO.O.OOgWWWWWWggKKOO..","..................OKOOOOKKOOOOO...","...................OOOOOOOOOO....."]},"back.body.walk.2":{"x":14,"y":40,"rows":["..OKkkkkkkkkkkkkkkkkkkkkkkkkkKO...","..OKkkkkkkkkkkkkkkkkkkkkkkkkkKO...","..OKKKkkkkkkkkkkkkkkkkkkkkkKKKO...",".OOKKKKKkkkkkkkkkkkkkkkkKKKkkkKO..",".OKkkKKKKKkkkkkkkkkkkkKKKKkkkkKKO.","OKkkkkKkkKKKKkkkkkkkKKKKKkkkkkkKO.","OKkkkkkKhkKKKKKKKKKKKKKKkkkkkkkkOO","..kkkkkkKkkKKKKKKKKKKkkkkkkk......","..kkkKkkkKkhKkkkkkkkkkkkkkkk......","..kkkKkkkkKhhKkkkkkkkkkkkkkk......","..kkkKkkkkkKhhKkkkkkkkkkkkkk......","..kkKkkkkkkkKhhKkkkkkkkkkkkk......","..kkKkkkkkkkkKhhKkkkkkkkkkkk......","..kkKkkkkkkkkkKhhKkkkkkkkkkk......","..kkKkkkkkkkkkkKhhKKkkkkkkkk......","..kkKkkkkkkkkkkkKkkkKkkkkkkk......","..kKkkkkkkkkkkkkkKKhhKKKKKKK......","..kKkkkkkkkkkkkkkkkKhdKKhhhh......","..kKkkkkkkkkkkkkkkkkKKKKkhhh......","..kKkkkkkkkkkkkkkkkkkkKhKhhh......","..KKkkkkkkkkkkkkkkkkkkKhKKhh......","..kKkkkkkkkkkkkkkkkkkkKhKKKK......","..KOKKKkkkkkkkkkkkkkkkKhKhhh......","..DKKKKKKKKKKKKKKKKKKKKhKhhh......","..DKKkkKKKKKKKKKKKKKKKKKKhhh......","..DKKkkKkkkkKkkkKkkkKkkKKKKK......","..DKkkkKkkkkKkkkKkkkKkkkkkKk......","..DKkkkKkkkkKkkkKkkkKkkkkkKk......","..KKkkkkKkkKKkkkKkkkKKkkkKkk......","..KKKKkkkKKKkkkkKkkkkkKKKkkK......","..KkkKkkkkkkkkKKKKKkkkkkkkkK......",".OOkkKkkkkkkKKKKKKKKkkkkkkkKkkKO..",".OOKKKkkkKKKKKKKKKKKKKKKkkkKKKKO..",".OOkkKkkkkkkkKKKOOKKkkkkkkkKkkKO..",".OKkkKkkkkkkKKKOOKKKkkkkkkkKkkKO..",".OKkkKkkkKKKKkKOOOKKkkkkkkkKkkKO..",".OOkKkkkkkkkkkKKOOKKkkkkkkkkKkKO..",".OOKKkkkkkkkkkKOOOKKkkkkkkkkkKOO..","OKKKkkkkkkkkKKKOOOKKKkkkkkkkkkKO..","OOkKKkkkkkkkkKKOOKKkkKKKKKkkkkKOO.","OOkkKKKKkkkkkKKOOOKKkkkkkkkkkKKOO.",".OKkkkkkkkkKKKKKOOKKKkkkkkkkKkKOO.","..OKkkkKKKKKKKKOOOKKKKkkkkKKKkKO..","..OKKKKKGGGGHKKOOOKKKKKKKKkkkKOO..","..OKHbbGGGGGGmKO.OKKHGGGGKKKKKO...",".OObHHGGGGGGGmKO.OOmGGGGGGHHbKO...","OObbbGGGHHHbHGOO.OKmGGGGGGGbHHKO..","OKgHbGGbHHHHHbOO.OKGHHHHGGGGHHbOO.","OKgggggWWWWWWgKO.OOHHHbbbGGGbbgKO.",".OOOOggWWWWWWgOO.OOgWWWWWggggggOO.","..OOOKKOOOOKKOOO.OOgWWWWWWggKKOO..","....OOOOOOOOOO....OKOOOOKKOOOOO...","...................OOOOOOOOOO....."]},"back.body.walk.3":{"x":14,"y":40,"rows":["..OKkkkkkkkkkkkkkkkkkkkkkkkkkKO...","..OKkkkkkkkkkkkkkkkkkkkkkkkkkKO...","..OKKKkkkkkkkkkkkkkkkkkkkkkKKKO...",".OOKKKKKkkkkkkkkkkkkkkkkKKKkkkKO..",".OKkkKKKKKkkkkkkkkkkkkKKKKkkkkKKO.","OKkkkkKkkKKKKkkkkkkkKKKKKkkkkkkKO.","OKkkkkkKhkKKKKKKKKKKKKKKkkkkkkkkOO","..kkkkkkKkkKKKKKKKKKKkkkkkkk......","..kkkKkkkKkhKkkkkkkkkkkkkkkk......","..kkkKkkkkKhhKkkkkkkkkkkkkkk......","..kkkKkkkkkKhhKkkkkkkkkkkkkk......","..kkKkkkkkkkKhhKkkkkkkkkkkkk......","..kkKkkkkkkkkKhhKkkkkkkkkkkk......","..kkKkkkkkkkkkKhhKkkkkkkkkkk......","..kkKkkkkkkkkkkKhhKKkkkkkkkk......","..kkKkkkkkkkkkkkKkkkKkkkkkkk......","..kKkkkkkkkkkkkkkKKhhKKKKKKK......","..kKkkkkkkkkkkkkkkkKhdKKhhhh......","..kKkkkkkkkkkkkkkkkkKKKKkhhh......","..kKkkkkkkkkkkkkkkkkkkKhKhhh......","..KKkkkkkkkkkkkkkkkkkkKhKKhh......","..kKkkkkkkkkkkkkkkkkkkKhKKKK......","..KOKKKkkkkkkkkkkkkkkkKhKhhh......","..DKKKKKKKKKKKKKKKKKKKKhKhhh......","..DKKkkKKKKKKKKKKKKKKKKKKhhh......","..DKKkkKkkkkKkkkKkkkKkkKKKKK......","..DKkkkKkkkkKkkkKkkkKkkkkkKk......","..DKkkkKkkkkKkkkKkkkKkkkkkKk......","..KKkkkkKkkKKkkkKkkkKKkkkKkk......","..KKKKkkkKKKkkkkKkkkkkKKKkkK......","..KkkKkkkkkkkkKKKKKkkkkkkkkK......",".OOkkKkkkkkkKKKKKKKKkkkkkkkKkkKO..",".OOKKKkkkKKKKKKKKKKKKKKKkkkKKKKO..",".OOkkKkkkkkkkKKKOOKKkkkkkkkKkkKO..",".OKkkKkkkkkkKKKOOKKKkkkkkkkKkkKO..",".OKkkKkkkKKKKkKOOOKKkkkkkkkKkkKO..",".OOkKkkkkkkkkkKKOOKKkkkkkkkkKkKO..",".OOKKkkkkkkkkkKOOKKkkKKKKKkkkkKOO.","OKKkkkkkkkkkkKKOOOKKkkkkkkkkkKKOO.","OKKKkkkkkkkkKKKKOOKKKkkkkkkkKkKOO.","OOkKKkkkkkkkkKKOOOKKKKkkkkKKKkKO..","OOkkKKKKkkkkkKKOOOKKKKKKKKkkkKOO..",".OKkkkkkkkkKKKKO.OKKHGGGGKKKKKO...","..OKkkkKKKKKKKKO.OOmGGGGGGHHbKO...","..OKKKKKGGGGHKKO.OKmGGGGGGGbHHKO..","..OKHbbGGGGGGmKO.OKGHHHHGGGGHHbOO.",".OObHHGGGGGGGmKO.OOHHHbbbGGGbbgKO.","OObbbGGGHHHbHGOO.OOgWWWWWggggggOO.","OKgHbGGbHHHHHbOO.OOgWWWWWWggKKOO..","OKgggggWWWWWWgK...OKOOOOKKOOOOO...",".OOOOggWWWWWWgO....OOOOOOOOOO.....","..OOOKKOOOOKKOO...................","....OOOOOOOOOO...................."]},"back.body.walk.4":{"x":14,"y":40,"rows":["..OKkkkkkkkkkkkkkkkkkkkkkkkkkKO...","..OKkkkkkkkkkkkkkkkkkkkkkkkkkKO...","..OKKKkkkkkkkkkkkkkkkkkkkkkKKKO...",".OOKKKKKkkkkkkkkkkkkkkkkKKKkkkKO..",".OKkkKKKKKkkkkkkkkkkkkKKKKkkkkKKO.","OKkkkkKkkKKKKkkkkkkkKKKKKkkkkkkKO.","OKkkkkkKhkKKKKKKKKKKKKKKkkkkkkkkOO","..kkkkkkKkkKKKKKKKKKKkkkkkkk......","..kkkKkkkKkhKkkkkkkkkkkkkkkk......","..kkkKkkkkKhhKkkkkkkkkkkkkkk......","..kkkKkkkkkKhhKkkkkkkkkkkkkk......","..kkKkkkkkkkKhhKkkkkkkkkkkkk......","..kkKkkkkkkkkKhhKkkkkkkkkkkk......","..kkKkkkkkkkkkKhhKkkkkkkkkkk......","..kkKkkkkkkkkkkKhhKKkkkkkkkk......","..kkKkkkkkkkkkkkKkkkKkkkkkkk......","..kKkkkkkkkkkkkkkKKhhKKKKKKK......","..kKkkkkkkkkkkkkkkkKhdKKhhhh......","..kKkkkkkkkkkkkkkkkkKKKKkhhh......","..kKkkkkkkkkkkkkkkkkkkKhKhhh......","..KKkkkkkkkkkkkkkkkkkkKhKKhh......","..kKkkkkkkkkkkkkkkkkkkKhKKKK......","..KOKKKkkkkkkkkkkkkkkkKhKhhh......","..DKKKKKKKKKKKKKKKKKKKKhKhhh......","..DKKkkKKKKKKKKKKKKKKKKKKhhh......","..DKKkkKkkkkKkkkKkkkKkkKKKKK......","..DKkkkKkkkkKkkkKkkkKkkkkkKk......","..DKkkkKkkkkKkkkKkkkKkkkkkKk......","..KKkkkkKkkKKkkkKkkkKKkkkKkk......","..KKKKkkkKKKkkkkKkkkkkKKKkkK......","..KkkKkkkkkkkkKKKKKkkkkkkkkK......",".OOkkKkkkkkkKKKKKKKKkkkkkkkKkkKO..",".OOKKKkkkKKKKKKKKKKKKKKKkkkKKKKO..",".OOkkKkkkkkkkKKKOOKKkkkkkkkKkkKO..",".OKkkKkkkkkkKKKOOKKKkkkkkkkKkkKO..",".OKkkKkkkKKKKkKOOOKKkkkkkkkKkkKO..",".OOkKkkkkkkkkkKKOOKKkkkkkkkkKkKO..",".OOKKkkkkkkkkkKOOOKKkkkkkkkkkKOO..","OKKkkkkkkkkkkKKOOKKkkKKKKKkkkkKOO.","OKKKkkkkkkkkKKKOOOKKkkkkkkkkkKKOO.","OOkKKkkkkkkkkKKKOOKKKkkkkkkkKkKOO.","OOkkKKKKkkkkkKKOOOKKKKkkkkKKKkKO..",".OKkkkkkkkkKKKKOOOKKKKKKKKkkkKOO..","..OKkkkKKKKKKKKO.OKKHGGGGKKKKKO...","..OKKKKKGGGGHKKO.OOmGGGGGGHHbKO...","..OKHbbGGGGGGmKO.OKmGGGGGGGbHHKO..",".OObHHGGGGGGGmKO.OKGHHHHGGGGHHbOO.","OObbbGGGHHHbHGOO.OOHHHbbbGGGbbgKO.","OKgHbGGbHHHHHbOO.OOgWWWWWggggggOO.","OKgggggWWWWWWgKO.OOgWWWWWWggKKOO..",".OOOOggWWWWWWgO...OKOOOOKKOOOOO...","..OOOKKOOOOKKOO....OOOOOOOOOO.....","....OOOOOOOOOO...................."]},"front.armR.down":{"x":41,"y":45,"rows":["OO......","OO......","OO......","kOO.....","kkOO....","kkOO....","kkkOO...","kkkOO...","KkkOO...","kkkkOO..","kkkkkOO.","kkKkkkOO","KKKKkkOO","kKkkkOOO","kOkkKOO.","KOkkkkOO","KKKKkkOO","KKkkkOO.","KKkkkOO.","KKKOKOO.","essssO..","OsgssO..","OsssHO..","OesOO...","OOOO....","OO......"]},"front.armR.out":{"x":36,"y":45,"rows":[".OOOOOOOOOOO.......","OhhhhhhhhhhhOOOOO..","OhhhhhhhhhhHHHsssO.","OhhhhhhhhhHHHHssssO","OkkkkkkkkkHHHHssssO",".OOkkkkkkkkHHHsssO.","...OOOOOOOOOOOOOO.."]},"front.armR.waveA":{"x":36,"y":35,"rows":["............OOOO.","...........OssssO","...........OssssO","..........OsssssO","..........OsssssO","........OOHHHHsO.",".......OhhHHHHsO.",".....OOhhhhHHHO..","....OhhhhhhhhhO..","..OOhhhhhhhhhO...",".OhhhhhhhhhOO....","OhhhhhhhhhO......","OhhhhhhhOO.......","OhhhhhhO.........","OkkkkOO..........",".OOOO............"]},"front.armR.waveB":{"x":36,"y":32,"rows":["..........OOOO.",".........OssssO",".........OssssO",".........OssssO",".........OssssO","........OHHHHsO",".......OhHHHHsO","......OhhhHHHO.",".....OhhhhhhhO.","....OhhhhhhhO..","....OhhhhhhO...","...OhhhhhhO....","..OhhhhhhO.....",".OhhhhhhhO.....","OhhhhhhhO......","OhhhhhhO.......","OhhhhhO........","OkkkkO.........",".OOOO.........."]},"front.armR.point":{"x":36,"y":30,"rows":["...........OO...","..........OssO..",".........OssssO.",".........OssssO.",".........OssssO.",".........OssssO.",".........OssssO.","........OssssssO","........OHHHHssO",".......OhHHHHsO.","......OhhhHHHO..",".....OhhhhhhhO..","....OhhhhhhhO...","...OhhhhhhhO....","..OhhhhhhhO.....",".OhhhhhhhO......","OhhhhhhhO.......","OhhhhhhO........","OhhhhhO.........","OkkkkO..........",".OOOO..........."]},"front.armR.cheer":{"x":36,"y":30,"rows":[".........OOOO.","........OssssO","........OssssO","........OssssO","........OssssO",".......OHHHHsO","......OhHHHHsO","......OhhHHHO.",".....OhhhhhhO.","....OhhhhhhO..","...OhhhhhhhO..","...OhhhhhhO...","..OhhhhhhO....",".OhhhhhhhO....",".OhhhhhhO.....","OhhhhhhO......","OhhhhhO.......","OhhhhhO.......","OhhhhO........",".OOOO........."]},"front.armR.chin":{"x":29,"y":36,"rows":["..OO..............",".OssO.............","OssssO............","OsssHHO...........",".OsHHHHO..........","..OHHHhhO.........","...OHhhhhO........","...OhhhhhhO.......","....OhhhhhhO......",".....OhhhhhhO.....","......OhhhhhhO....",".......OhhhhhhO...",".......OhhhhhhhO..",".......OkkkkkkkkO.","........OkkkkkkkkO",".........OOkkkkkkO","...........OkkkkkO","............OkkkkO",".............OOOO."]},"front.armL.down":{"x":7,"y":45,"rows":["........OO",".......OOO","......OOkO",".....OOkkk",".....OOkkk","....OOkkkk","....OOkkKk","....OOkkKk","...OOkkkOK","..OOkkkkkK",".OOkkkkkkO","OOkkkKKKKO","OOkkkkkKKk",".OOkkkkkOk",".OOkkkkOkk","OOkKKKKKkk",".OOOkkOOKk",".OOkkkkKKK",".OOOOOkKKK","..OgsssgKk","..OsssssKk","..OssSssdK","..OdsssSOK","...OOOOOOO",".....OOOkk","......OOkk"]},"front.armL.out":{"x":3,"y":45,"rows":[".......OOOOOOOOOOO.","..OOOOOhhhhhhhhhhhO",".OsssHHHhhhhhhhhhhO","OssssHHHHhhhhhhhhhO","OssssHHHHkkkkkkkkkO",".OsssHHHkkkkkkkkOO.","..OOOOOOOOOOOOOO..."]},"front.armL.waveA":{"x":5,"y":35,"rows":[".OOOO............","OssssO...........","OssssO...........","OsssssO..........","OsssssO..........",".OsHHHHOO........",".OsHHHHhhO.......","..OHHHhhhhOO.....","..OhhhhhhhhhO....","...OhhhhhhhhhOO..","....OOhhhhhhhhhO.","......OhhhhhhhhhO",".......OOhhhhhhhO",".........OhhhhhhO","..........OOkkkkO","............OOOO."]},"front.armL.waveB":{"x":7,"y":32,"rows":[".OOOO..........","OssssO.........","OssssO.........","OssssO.........","OssssO.........","OsHHHHO........","OsHHHHhO.......",".OHHHhhhO......",".OhhhhhhhO.....","..OhhhhhhhO....","...OhhhhhhO....","....OhhhhhhO...",".....OhhhhhhO..",".....OhhhhhhhO.","......OhhhhhhhO",".......OhhhhhhO","........OhhhhhO",".........OkkkkO","..........OOOO."]},"front.armL.point":{"x":6,"y":30,"rows":["...OO...........","..OssO..........",".OssssO.........",".OssssO.........",".OssssO.........",".OssssO.........",".OssssO.........","OssssssO........","OssHHHHO........",".OsHHHHhO.......","..OHHHhhhO......","..OhhhhhhhO.....","...OhhhhhhhO....","....OhhhhhhhO...",".....OhhhhhhhO..","......OhhhhhhhO.",".......OhhhhhhhO","........OhhhhhhO",".........OhhhhhO","..........OkkkkO","...........OOOO."]},"front.armL.cheer":{"x":8,"y":30,"rows":[".OOOO.........","OssssO........","OssssO........","OssssO........","OssssO........","OsHHHHO.......","OsHHHHhO......",".OHHHhhO......",".OhhhhhhO.....","..OhhhhhhO....","..OhhhhhhhO...","...OhhhhhhO...","....OhhhhhhO..","....OhhhhhhhO.",".....OhhhhhhO.","......OhhhhhhO",".......OhhhhhO",".......OhhhhhO","........OhhhhO",".........OOOO."]},"front.armL.chin":{"x":11,"y":36,"rows":["..............OO..",".............OssO.","............OssssO","...........OHHsssO","..........OHHHHsO.",".........OhhHHHO..","........OhhhhHO...",".......OhhhhhhO...","......OhhhhhhO....",".....OhhhhhhO.....","....OhhhhhhO......","...OhhhhhhO.......","..OhhhhhhhO.......",".OkkkkkkkkO.......","OkkkkkkkkO........","OkkkkkkOO.........","OkkkkkO...........","OkkkkO............",".OOOO............."]},"side.frontarm.down":{"x":24,"y":46,"rows":["kKKKKKKKKkk","KkkkkKKkkKK","kkkkkkKKkkK","kkkkkkkKKkk","kkkkkkkKKKk","kkkkkkkKkKK","kkkkkkkKkkK","kkkkkkkKKkk","kkkkkkkkKkK","kkkkkkkkKKd","kkkkkkkkKKb","kkkkkkkkKkH","kkkkkkkkKdk","kkkkkkkkkKK","kkkkkkkkkKK","kkkkkkkkkKk","kKKKKKKkkKk","KkkkkkkKKkk","kkKKKKKkKkk","KKsssssEkkk","EsssssssEkk","EsssssesEKK","EsssssesEkk","kEsssssEkkk","kkeeeeekkkk","kkHHHHHHkkk"]},"side.frontarm.walkFwd":{"x":35,"y":48,"rows":["kKKKOO...........","KbKKKO...........","KbKKkKOO.........","bdKKkkKKOOO......","bKkKkkkkKKKOOO...","dKkKkkkkkkKKKOO..","KkkKkkkkkKSSSBKO.","KkkkKkkkKBSSeSBOO","kkkkKkkkKSSSeSSKO","kkkkkKkkKSSeSBSKO","kkkkkKkkKSSeSSSKO","kkkkkKkKKBSSeSBOO","kkkkkKKKKKBSSeKO.","kkkkkKOOOOOOOOO..","kkkkKKO...OOOO...","kkkkKOO..........","KKKkKO...........","KKKKKO...........","kkkkkKO.........."]},"side.frontarm.walkBack":{"x":7,"y":49,"rows":["....OKKkkkkkk","....OKkkkkkkk","...OKKkkkkkkk","..OKkkkkkkkkk","..OKkkkkkkkkk",".OKkkkkkkkkkk",".OKkkkkkkkkkk",".OKKkkkkkkkkk","..OKKKkkkkkkK","..OKkkKKkkkKK",".OKKkkkkKKkKK",".OKSKKkkkKKKK","OOSSSSSKKKOOK","OKSSSSSSSKOOK","OOSSSSSSSKOOO","OOBSSSSeSOO.O",".OKSSSSKKO..O","..OKOKOOO...O","...OOOO....OO","...........OK","..........OOK","..........OOk"]},"side.frontarm.out":{"x":25,"y":45,"rows":[".OOOOOOOOOOOOOO......","OhhhhhhhhhhhhhhOOOO..","OhhhhhhhhhhhhhHHHssO.","OhhhhhhhhhhhhHHHHsssO","OkkkkkkkkkkkkHHHHsssO",".OOkkkkkkkkkkkHHHssO.","...OOOOOOOOOOOOOOOO.."]},"side.frontarm.waveA":{"x":25,"y":35,"rows":[".............OOOO.","............OssssO","............OssssO","...........OsssssO","...........OsssssO",".........OOHHHHsO.",".......OOhhHHHHsO.","......OhhhhhHHHO..","....OOhhhhhhhhhO..","..OOhhhhhhhhhhO...",".OhhhhhhhhhhOO....","OhhhhhhhhhOO......","OhhhhhhhhO........","OhhhhhhOO.........","OkkkkOO...........",".OOOO............."]},"side.frontarm.waveB":{"x":25,"y":32,"rows":["...........OOOO.","..........OssssO","..........OssssO","..........OssssO","..........OssssO",".........OHHHHsO","........OhHHHHsO",".......OhhhHHHO.","......OhhhhhhhO.",".....OhhhhhhhO..","....OhhhhhhhO...","...OhhhhhhhO....","..OhhhhhhhO.....",".OhhhhhhhO......","OhhhhhhhO.......","OhhhhhhO........","OhhhhhO.........","OkkkkO..........",".OOOO..........."]},"side.frontarm.point":{"x":25,"y":41,"rows":[".............OOOOOOOOOO..",".........OOOOhHHHHsssssO.","......OOOhhhhHHHHHssssssO","...OOOhhhhhhhHHHHHssssssO",".OOhhhhhhhhhhhHHHHsssssO.","OhhhhhhhhhhhhhhHOOOOOOO..","OhhhhhhhhhhhhOOO.........","OhhhhhhhhhOOO............","OkkkkkOOOO...............",".OOOOO..................."]},"side.frontarm.cheer":{"x":25,"y":29,"rows":[".........OOOO.","........OssssO","........OssssO","........OssssO","........OssssO",".......OHHHHsO","......OhHHHHsO","......OhhHHHO.",".....OhhhhhhO.","....OhhhhhhO..","....OhhhhhhO..","...OhhhhhhO...","...OhhhhhO....","..OhhhhhhO....",".OhhhhhhO.....",".OhhhhhhO.....","OhhhhhhO......","OhhhhhO.......","OhhhhhO.......","OhhhhO........",".OOOO........."]},"side.frontarm.chin":{"x":25,"y":35,"rows":[".............OO..","............OssO.","...........OssssO","..........OsHHssO","..........OHHHHO.","..........OHHHHO.",".........OhhHHhO.",".........OhhhhO..","........OhhhhhO..","........OhhhhhO..",".OOOOOOOOhhhhO...","OhhhhhhhhhhhhO...","OhhhhhhhhhhhO....","OhhhhhhhhhhhO....","OkkkkkkkkkkkO....",".OOOOOOOOOOO....."]},"side.backarm.down":{"x":0,"y":0,"rows":["."]},"side.backarm.walkFwd":{"x":33,"y":48,"rows":["kKKKOO...........","KbKKKO...........","KbKKkKOO.........","bdKKkkKKOOO......","bKkKkkkkKKKOOO...","dKkKkkkkkkKKKOO..","KkkKkkkkkKSSSBKO.","KkkkKkkkKBSSeSBOO","kkkkKkkkKSSSeSSKO","kkkkkKkkKSSeSBSKO","kkkkkKkkKSSeSSSKO","kkkkkKkKKBSSeSBOO","kkkkkKKKKKBSSeKO.","kkkkkKOOOOOOOOO..","kkkkKKO...OOOO...","kkkkKOO..........","KKKkKO...........","KKKKKO...........","kkkkkKO.........."]},"side.backarm.walkBack":{"x":7,"y":49,"rows":["....OKKkkkkkk","....OKkkkkkkk","...OKKkkkkkkk","..OKkkkkkkkkk","..OKkkkkkkkkk",".OKkkkkkkkkkk",".OKkkkkkkkkkk",".OKKkkkkkkkkk","..OKKKkkkkkkK","..OKkkKKkkkKK",".OKKkkkkKKkKK",".OKSKKkkkKKKK","OOSSSSSKKKOOK","OKSSSSSSSKOOK","OOSSSSSSSKOOO","OOBSSSSeSOO.O",".OKSSSSKKO..O","..OKOKOOO...O","...OOOO....OO","...........OK","..........OOK","..........OOk"]},"back.armR.down":{"x":41,"y":45,"rows":["kkkkKO......","kkkkkOO.....","kkkkkKO.....","kkkkkkOO....","kkkkkkOO....","kKkkkkkKO...","kKkkkkkKO...","kKkkkkkkKO..","kKKkkkkkKOO.","kkKkkkkkkKO.","kkKkkkkkkkKO","KKKKkkkkkkKO","hhhKkkkkkkKO","hhhhKkkkkkKO","hhhKKkkkkKOO","hhKKKKKKkKO.","KKKhKkkkkKO.","hhhhKKKKKO..","hhhhKSssKO..","hhhKDSssKO..","KKKSsDssKO..","kkKSDssDOO..","kkkKSsSKO...","kkkKKOOO....","KKKKOOO.....","KkkKO......."]},"back.armR.out":{"x":36,"y":45,"rows":[".OOOOOOOOOOO.......","OhhhhhhhhhhhOOOOO..","OhhhhhhhhhhHHHsssO.","OhhhhhhhhhHHHHssssO","OkkkkkkkkkHHHHssssO",".OOkkkkkkkkHHHsssO.","...OOOOOOOOOOOOOO.."]},"back.armR.waveA":{"x":36,"y":35,"rows":["............OOOO.","...........OssssO","...........OssssO","..........OsssssO","..........OsssssO","........OOHHHHsO.",".......OhhHHHHsO.",".....OOhhhhHHHO..","....OhhhhhhhhhO..","..OOhhhhhhhhhO...",".OhhhhhhhhhOO....","OhhhhhhhhhO......","OhhhhhhhOO.......","OhhhhhhO.........","OkkkkOO..........",".OOOO............"]},"back.armR.waveB":{"x":36,"y":32,"rows":["..........OOOO.",".........OssssO",".........OssssO",".........OssssO",".........OssssO","........OHHHHsO",".......OhHHHHsO","......OhhhHHHO.",".....OhhhhhhhO.","....OhhhhhhhO..","....OhhhhhhO...","...OhhhhhhO....","..OhhhhhhO.....",".OhhhhhhhO.....","OhhhhhhhO......","OhhhhhhO.......","OhhhhhO........","OkkkkO.........",".OOOO.........."]},"back.armR.point":{"x":36,"y":30,"rows":["...........OO...","..........OssO..",".........OssssO.",".........OssssO.",".........OssssO.",".........OssssO.",".........OssssO.","........OssssssO","........OHHHHssO",".......OhHHHHsO.","......OhhhHHHO..",".....OhhhhhhhO..","....OhhhhhhhO...","...OhhhhhhhO....","..OhhhhhhhO.....",".OhhhhhhhO......","OhhhhhhhO.......","OhhhhhhO........","OhhhhhO.........","OkkkkO..........",".OOOO..........."]},"back.armR.cheer":{"x":36,"y":30,"rows":[".........OOOO.","........OssssO","........OssssO","........OssssO","........OssssO",".......OHHHHsO","......OhHHHHsO","......OhhHHHO.",".....OhhhhhhO.","....OhhhhhhO..","...OhhhhhhhO..","...OhhhhhhO...","..OhhhhhhO....",".OhhhhhhhO....",".OhhhhhhO.....","OhhhhhhO......","OhhhhhO.......","OhhhhhO.......","OhhhhO........",".OOOO........."]},"back.armL.down":{"x":9,"y":45,"rows":[".....OKk",".....OKk","....OOkk","....OKkk","...OKkkk","...OKkkk","..OKkkkk","..OKkkkk",".OKkkkkk",".OOkkkkk","OKkkkkkk","OKkkkkkk","OKkkkkkk","OOkkkkkk","OKKkkkkk",".OKkKKKK",".OOkkkkk","..OOKKKK","..OKssDD","..OKssDD","..OOsDDD","..OODssD","...OKSsD","....OOOK",".....OOK","......OK"]},"back.armL.out":{"x":3,"y":45,"rows":[".......OOOOOOOOOOO.","..OOOOOhhhhhhhhhhhO",".OsssHHHhhhhhhhhhhO","OssssHHHHhhhhhhhhhO","OssssHHHHkkkkkkkkkO",".OsssHHHkkkkkkkkOO.","..OOOOOOOOOOOOOO..."]},"back.armL.waveA":{"x":5,"y":35,"rows":[".OOOO............","OssssO...........","OssssO...........","OsssssO..........","OsssssO..........",".OsHHHHOO........",".OsHHHHhhO.......","..OHHHhhhhOO.....","..OhhhhhhhhhO....","...OhhhhhhhhhOO..","....OOhhhhhhhhhO.","......OhhhhhhhhhO",".......OOhhhhhhhO",".........OhhhhhhO","..........OOkkkkO","............OOOO."]},"back.armL.waveB":{"x":7,"y":32,"rows":[".OOOO..........","OssssO.........","OssssO.........","OssssO.........","OssssO.........","OsHHHHO........","OsHHHHhO.......",".OHHHhhhO......",".OhhhhhhhO.....","..OhhhhhhhO....","...OhhhhhhO....","....OhhhhhhO...",".....OhhhhhhO..",".....OhhhhhhhO.","......OhhhhhhhO",".......OhhhhhhO","........OhhhhhO",".........OkkkkO","..........OOOO."]},"back.armL.point":{"x":6,"y":30,"rows":["...OO...........","..OssO..........",".OssssO.........",".OssssO.........",".OssssO.........",".OssssO.........",".OssssO.........","OssssssO........","OssHHHHO........",".OsHHHHhO.......","..OHHHhhhO......","..OhhhhhhhO.....","...OhhhhhhhO....","....OhhhhhhhO...",".....OhhhhhhhO..","......OhhhhhhhO.",".......OhhhhhhhO","........OhhhhhhO",".........OhhhhhO","..........OkkkkO","...........OOOO."]},"back.armL.cheer":{"x":8,"y":30,"rows":[".OOOO.........","OssssO........","OssssO........","OssssO........","OssssO........","OsHHHHO.......","OsHHHHhO......",".OHHHhhO......",".OhhhhhhO.....","..OhhhhhhO....","..OhhhhhhhO...","...OhhhhhhO...","....OhhhhhhO..","....OhhhhhhhO.",".....OhhhhhhO.","......OhhhhhhO",".......OhhhhhO",".......OhhhhhO","........OhhhhO",".........OOOO."]}}};
// END_HGQ_PARTS

// Starbound-layered Bunny-Logo Q-Version 黑哥 (head / body+walks / frontarm / backarm + 31 EMO glass-lens face rig)
function heigeQ(x, y, o = {}) {
  const P = HGQ_PARTS;
  if (!P || !P.parts) return;
  const parts = P.parts, pal = { ...P.pal, ...Q_STAMP_PAL };
  const tt = onTwos(T);
  const view = o.view === 'side' ? 'side' : o.view === 'back' ? 'back' : 'front';
  const flip = !!o.flip;
  const sq = (o.sq || 0) + (o.take || 0);
  const crouch = sq >= .16 ? 2 : sq >= .07 ? 1 : sq <= -.13 ? -2 : sq <= -.05 ? -1 : 0;
  const cheerSway = (o.poseR === 'wave' || o.poseL === 'wave' || (o.aR || 0) >= 1.1 || (o.aL || 0) >= 1.1)
    ? Math.round(Math.sin(tt * 10 + (o.seed || 0))) : 0;
  const tremor = (o.emo === 'scared' || o.emo === 'furious' || o.emo === 'cry') && (Math.floor(tt * 12) % 2) ? 1 : 0;
  const lean = clamp(Math.round((o.rot || 0) * 18) + cheerSway, -3, 3);
  const bx = Math.round((o.dx || 0) * MODEL_U) + tremor;
  const by = Math.round((o.dy || 0) * MODEL_U);

  let step = null, walkBob = 0;
  if (o.walk != null) {
    step = ((Math.floor(o.walk * 8) % 8) + 8) % 8;
    walkBob = step % 4 === 1 || step % 4 === 2 ? -1 : 0;
  }
  const walkIdx = step == null ? 0 : Math.floor(step / 2) + 1;
  const crownLag = clamp(Math.round((o.dy || 0) * -0.4 + (crouch >= 2 ? 1 : crouch <= -2 ? -1 : 0)), -1, 1);

  const armPose = side => {
    const own = side === 'L' ? o.poseL : o.poseR;
    let p = own;
    if (!p && step != null && view === 'side') {
      p = (step < 4) === (side === 'R') ? 'walkFwd' : 'walkBack';
    }
    if (!p && !o.noPose) {
      const a = side === 'L' ? (o.aL ?? .15) : (o.aR ?? .15);
      if (o.emo === 'proud') p = 'down';
      else if (a >= 1.15) p = 'cheer';
      else if (a >= .72) p = 'wave';
      else p = 'down';
    }
    p = p || 'down';
    if (p === 'wave') p = Math.floor(tt * 4) % 2 ? 'waveB' : 'waveA';
    return p;
  };

  const pL = armPose('L'), pR = armPose('R');
  const st = new PxStack();

  // Shear helper for torso & limbs around torso waist/chin pivot
  const putPart = (part, dx = 0, dy = 0, shearTop = false) => {
    if (!part) return;
    for (let j = 0; j < part.rows.length; j++) {
      const py = part.y + j, row = part.rows[j];
      const sh = shearTop ? Math.round(lean * Math.pow(clamp((92 - py) / 92), 1.15)) : 0;
      for (let i = 0; i < row.length; i++) {
        const ch = row[i];
        if (ch !== '.') st.set(part.x + i + dx + sh, py + dy, ch);
      }
    }
  };

  // Skin mood tint inside face only
  const skinTint = (o.tint || o.tintFade) ? pxSkin({ pal: P.pal, skinKeys: ['s', 'S', 'D'], tintK: .24 }, o) : null;
  const torsoDy = walkBob + (crouch >= 2 ? 1 : 0);
  const headDy = walkBob + crouch + crownLag;

  // Starbound Layer 0: rear arm + neck plug
  if (view === 'side') {
    const ba = parts[`side.backarm.${pL === 'walkFwd' || pL === 'walkBack' ? pL : 'down'}`];
    putPart(ba, 0, torsoDy, true);
  } else {
    putPart(parts[`${view}.armL.${pL}`] || parts[`${view}.armL.down`], 0, torsoDy, true);
  }
  putPart(parts['front.neck'], 0, torsoDy, true);

  // Starbound Layer 1: modular torso + 4-frame legs
  const bodyKey = walkIdx ? `${view}.body.walk.${walkIdx}` : `${view}.body.idle`;
  putPart(parts[bodyKey] || parts[`${view}.body.idle`], 0, crouch >= 2 ? 1 : 0, true);
  // Gapless squash fill at waist/collar when stretching upward (crouch < 0)
  if (crouch < 0) putPart(parts['front.neck'], 0, crouch, true);

  // Starbound Layer 2: head + glass-protected 31-expression facial rig
  const headPart = parts[`${view}.head`];
  const headSh = Math.round(lean * .7);
  if (headPart) {
    // Build head onto a local 58x94 grid first so face eyes/mouth stay cleanly clipped inside glasses
    const hGrid = Array.from({ length: P.h }, () => Array(P.w).fill('.'));
    for (let j = 0; j < headPart.rows.length; j++) {
      const py = headPart.y + j, row = headPart.rows[j];
      for (let i = 0; i < row.length; i++) if (row[i] !== '.') hGrid[py][headPart.x + i] = row[i];
    }
    const blinking = ((tt * .9 + (o.seed || 0) * 1.7) % 3.3) < .11;
    const sqv = o.squint || 0;
    const lx = Math.round(clamp(o.lookX || 0, -1, 1)), ly = Math.round(clamp(o.lookY || 0, -1, 1));
    const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['happy', 'normal'] : [o.eyes || 'normal', o.eyes || 'normal'];
    const skSet = new Set(['s', 'S', 'D']);
    const S_KEY = ch => (ch.length === 1 && Q_STAMP_PAL['!' + ch] ? '!' + ch : ch);

    if (view === 'front') {
      const lenses = [
        { box: [18, 28, 23, 32], r: false },
        { box: [31, 30, 36, 34], r: true },
      ];
      lenses.forEach((L, idx) => {
        const [x0, y0, x1, y1] = L.box, bw = x1 - x0 + 1, bh = y1 - y0 + 1;
        let kind = kinds[idx];
        if (sqv > .7 || (['normal', 'look', 'wide', 'shine'].includes(kind) && blinking)) kind = 'blink';
        else if (sqv > .35 && ['normal', 'look', 'wide', 'shine'].includes(kind)) kind = 'narrow';
        const setSafe = (xx, yy, v) => { if (hGrid[yy]?.[xx] && hGrid[yy][xx] !== 'K' && hGrid[yy][xx] !== 'O') hGrid[yy][xx] = v; };
        const clearLens = () => { for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) setSafe(xx, yy, 's'); };

        if (kind === 'shades') {
          for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) hGrid[yy][xx] = (xx + yy) % 2 && yy > y0 + 1 ? '!&' : '!K';
          hGrid[y0 + 1][x0 + 1] = '!W'; hGrid[y0 + 1][x0 + 2] = '!W'; hGrid[y0 + 2][x0 + 1] = '!W';
          return;
        }
        if (kind === 'blink') {
          clearLens();
          for (let xx = x0; xx <= x1; xx++) setSafe(xx, y0 + 2, '!@');
          return;
        }
        if (kind === 'normal' || kind === 'look' || kind === 'wide' || kind === 'shine' || kind === 'red') {
          if (lx || ly) {
            const orig = [];
            for (let j = 0; j < bh; j++) orig.push(hGrid[y0 + j].slice(x0, x1 + 1));
            for (let j = 0; j < bh; j++) for (let i = 0; i < bw; i++) {
              if (hGrid[y0 + j][x0 + i] === 'K') continue;
              const si = i - lx, sj = j - ly;
              hGrid[y0 + j][x0 + i] = (si >= 0 && sj >= 0 && si < bw && sj < bh && orig[sj][si] !== 'K') ? orig[sj][si] : 's';
            }
          }
          if (kind === 'wide' || kind === 'shine') setSafe(x0 + 1, y0 + 1, '!W');
          if (kind === 'shine') setSafe(x1 - 1, y1 - 1, '!W');
          if (kind === 'red') {
            for (let j = 0; j < bh; j++) for (let i = 0; i < bw; i++) if (['e', 'E', 'd', 'b'].includes(hGrid[y0 + j][x0 + i])) hGrid[y0 + j][x0 + i] = j === 1 && i === 2 ? '!W' : '!R';
          }
          return;
        }
        if (kind === 'sleepy' || kind === 'narrow') {
          const cut = kind === 'sleepy' ? 2 : 1;
          for (let j = 0; j <= cut; j++) for (let xx = x0; xx <= x1; xx++) setSafe(xx, y0 + j, j === cut ? '!@' : 's');
          return;
        }
        if (kind === 'angry' || kind === 'determined') {
          const drop = kind === 'angry' ? 2 : 1;
          for (let j = 0; j < 3; j++) for (let i = 0; i < bw; i++) {
            const t = L.r ? (bw - 1 - i) / (bw - 1) : i / (bw - 1);
            const brow = Math.round(t * drop);
            if (j < brow) setSafe(x0 + i, y0 + j, 's');
            else if (j === brow) setSafe(x0 + i, y0 + j, '!@');
          }
          return;
        }
        if (kind === 'sad' || kind === 'teary') {
          for (let j = 0; j < 3; j++) for (let i = 0; i < bw; i++) {
            const t = L.r ? i / (bw - 1) : (bw - 1 - i) / (bw - 1);
            const brow = Math.round(t * 2);
            if (j < brow) setSafe(x0 + i, y0 + j, 's');
            else if (j === brow) setSafe(x0 + i, y0 + j, '!@');
          }
          if (kind === 'teary') {
            const tw = Math.floor(tt * 4) % 2;
            for (let i = 1; i < bw - 1; i++) setSafe(x0 + i, y1, (i + tw) % 2 ? '!W' : '!Y');
            hGrid[y1 + 2][x0 + 3] = '!y';
          }
          return;
        }
        if (kind === 'scared') {
          clearLens();
          for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) setSafe(xx, yy, (yy === y0 || yy === y1 || xx === x0 || xx === x1) ? '!@' : '!W');
          const jig = Math.floor(tt * 12) % 2 ? 1 : 0;
          setSafe(x0 + 2 + clamp(lx + jig, -1, 1), y0 + 2 + ly, '!@');
          setSafe(x0 + 3 + clamp(lx + jig, -1, 1), y0 + 2 + ly, '!@');
          return;
        }
        clearLens();
        if (kind === 'blank') {
          for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) setSafe(xx, yy, '!W');
          return;
        }
        const useK = kind === 'cry' ? 'squeeze' : kind;
        const S_E = Q_EYES_STAMP[useK] || Q_EYES_STAMP.happy;
        const sRows = S_E.l ? (L.r ? S_E.r : S_E.l) : (S_E.rows2 && Math.floor(tt * 4) % 2 ? S_E.rows2 : S_E.rows);
        if (sRows) {
          const sw = sRows[0].length, sh = sRows.length;
          const ox0 = x0 + Math.floor((bw - sw) / 2), oy0 = y0 + Math.max(0, Math.floor((bh - sh) / 2));
          for (let sj = 0; sj < sh; sj++) for (let si = 0; si < sw; si++) if (sRows[sj][si] !== '.') setSafe(ox0 + si, oy0 + sj, S_KEY(sRows[sj][si]));
        }
        if (kind === 'cry') {
          const ph = Math.floor(tt * 10) % 5, tx = x0 + 2;
          for (let k = 0; k < 5; k++) {
            hGrid[y1 + 1 + k][tx] = k === ph ? '!W' : '!Y';
            hGrid[y1 + 1 + k][tx + (L.r ? -1 : 1)] = '!y';
          }
        }
      });

      // Mouth at [27, 36]
      if (o.mouth !== undefined && o.mouth !== null) {
        const mName = (o.lid || 0) > .1 ? 'wail' : o.mouth;
        const M = Q_MOUTHS[mName];
        if (M) {
          for (let xx = 25; xx <= 28; xx++) for (let yy = 35; yy <= 37; yy++) if (['e', 'E'].includes(hGrid[yy]?.[xx])) hGrid[yy][xx] = 's';
          const mRows = M.rows2 && Math.floor(tt * 6) % 2 ? M.rows2 : M.rows, mw = mRows[0].length;
          const mx0 = 27 - Math.floor(mw / 2), my0 = 36 + (M.dy || 0);
          for (let j = 0; j < mRows.length; j++) for (let i = 0; i < mw; i++) {
            if (mRows[j][i] !== '.' && my0 + j <= 38) {
              const cur = hGrid[my0 + j]?.[mx0 + i];
              if (cur && cur !== 'O' && cur !== 'K') hGrid[my0 + j][mx0 + i] = S_KEY(mRows[j][i]);
            }
          }
        }
      }
      // Blush & gloom
      const bl = o.blush === true ? 1 : (o.blush || 0);
      if (bl > .15) {
        const patch = bl > .6 ? ['.P%P.', 'PPPPP'] : bl > .35 ? ['PPPP', 'PPPP'] : ['PPP'];
        for (const [cx, cy] of [[19, 34], [35, 35]]) for (let j = 0; j < patch.length; j++) for (let i = 0; i < patch[0].length; i++) {
          const xx = cx - Math.floor(patch[0].length / 2) + i, yy = cy + j;
          if (patch[j][i] !== '.' && skSet.has(hGrid[yy]?.[xx])) hGrid[yy][xx] = S_KEY(patch[j][i]);
        }
      }
      if ((o.gloom || 0) > .1) {
        for (let yy = 24; yy <= 28; yy++) for (let xx = 19; xx <= 35; xx++) {
          if (skSet.has(hGrid[yy]?.[xx]) && ((xx - 19) % 2 === 0 || yy < 26)) hGrid[yy][xx] = '!~';
        }
      }
    } else if (view === 'side') {
      if (kinds[0] === 'shades') {
        for (let yy = 29; yy <= 32; yy++) for (let xx = 37; xx <= 41; xx++) hGrid[yy][xx] = '!K';
        hGrid[29][38] = '!W'; hGrid[29][39] = '!W';
      } else if (blinking || sqv > .7 || ['happy', 'closed', 'sleepy', 'cry', 'squeeze'].includes(kinds[0])) {
        for (let yy = 29; yy <= 32; yy++) for (let xx = 37; xx <= 41; xx++) if (hGrid[yy][xx] !== 'K') hGrid[yy][xx] = 's';
        for (let xx = 37; xx <= 41; xx++) hGrid[31][xx] = '!@';
      }
    }

    for (let py = 0; py < P.h; py++) for (let px = 0; px < P.w; px++) {
      let c = hGrid[py][px];
      if (c === '.') continue;
      if (skinTint && skinTint[c]) { pal['!T' + c] = skinTint[c]; c = '!T' + c; }
      st.set(px + headSh, py + headDy, c);
    }
  }

  // Starbound Layer 3: articulated foreground arm drawn OVER hoodie & crossbody bag!
  if (view === 'side') {
    const fa = parts[`side.frontarm.${pR}`] || parts['side.frontarm.down'];
    putPart(fa, 0, torsoDy, true);
  } else {
    putPart(parts[`${view}.armR.${pR}`] || parts[`${view}.armR.down`], 0, torsoDy, true);
  }

  const wx = x + bx, wy = y + by;
  if (!o.noShadow) hgShadow(wx, y, o.dy || 0, 15);
  pxDrawStack(st, wx, wy, { pal, axis2: 57, ground: 93, outline: 'O', rimFrom: null, skinKeys: [] }, flip, null, false);
  if (o.emote) {
    const E = PX_EMOTES[o.emote] || {}, dir = flip ? -1 : 1;
    pxEmote(o.emote, E.top ? wx : wx + dir * 18 - (flip ? 6 : 0), wy - 92 + crouch + (E.top ? -2 : 12), o.emoteK ?? 1, o.emoteAge ?? T, dir);
  }
}

function modelPx(key, x, y, o = {}) {
  key = MODEL_CAST[key] || key;
  if (key === 'heigeQ') { heigeQ(x, y, o); return; }
  const S = window.SPRITES && SPRITES[key];
  if (!S) return;
  const R = MODEL_RIGS[key];
  if (R) _modelDrawRigged(R, S, x, y, o);
  else _modelDrawGeneric(S, x, y, o);
}
