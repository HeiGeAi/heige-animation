// scenes/nvyou.js: V071「遇到懂 AI 的女生，赶紧和她谈恋爱吧」（Blake 本人录音 1.2 倍速 2026-11-10）, a block-world film
// (voxel.js) after V058. A small town at dusk: their house (bedroom, living room with the PC, study), the mall (lipstick
// counter, bag shop), the 网红店 queue, the cinema, the café, the compute room, the registry (民政局), the kindergarten.
// 黑哥 plays 「你」, the new girl (scenes/nvyou_cast.js, six poses) plays 「她」, blocky villagers play the other couples,
// Clawd plays Claude in the Claude Code window. This file is the base (world, cast, overlay kit, frame); the shots live in
// nvyou_a.js … nvyou_d.js, which read everything from window.NV and push into NV.S.
// Anti-moiré (V053 fan feedback): VX.setMip, soft blocks only, no bright tiled walls, emissive blocks as accents.
//   node render.mjs --page=pixel.html --loop=pxNvyou --stills=3,9.2 --out=out/x
(() => {
  const { B } = VX;
  const G = 12;
  const clamp01 = v => Math.max(0, Math.min(1, v)), sm = v => { v = clamp01(v); return v * v * (3 - 2 * v); };
  const seg01 = (t, a, b) => clamp01((t - a) / (b - a)), lerp = (a, b, k) => a + (b - a) * k;
  const hh = (a, b = 0) => { const v = Math.sin(a * 91.3 + b * 47.7 + 13.1) * 43758.5453; return v - Math.floor(v); };
  const DD = window.NVYOU_DATA;
  const SFX = window.NVYOU_SFX = [];       // [t, sound, dB] for the mixer (sounds: tools/video/sfx_mc.py, synthesized)
  const sfx = (t, name, db = -12) => SFX.push([+t.toFixed(3), name, db]);
  const VXE = [];                          // block edits the shots ask for: [t, x, y, z, block name or 0 for air]
  const edit = (t, x, y, z, nm) => VXE.push([t, x, y, z, nm]);
  let BUILT = false;

  // ======================================================================================= the scene's own soft blocks
  const h3 = (x, y, s) => { const v = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return v - Math.floor(v); };
  const pick = (r, cs) => cs[Math.min(cs.length - 1, Math.floor(r * cs.length))];
  const wool = (cs, s) => (u, v) => pick(h3(u >> 2, v >> 2, s), cs);             // 4×4 flecks, low contrast: no fine noise
  VX.defBlock('woolYellow', { side: wool(['#F2C63A', '#EEC036', '#F5CA42'], 61) });
  VX.defBlock('woolPink', { side: wool(['#E890A8', '#E48AA2', '#EC96AE'], 62) });
  VX.defBlock('woolRose', { side: wool(['#B8505A', '#B44C56', '#BC545E'], 63) });
  VX.defBlock('woolRed', { side: wool(['#C8323C', '#C42E38', '#CC3640'], 64) });
  VX.defBlock('woolWhite', { side: wool(['#ECE6DA', '#E8E2D6', '#F0EADE'], 65) });
  VX.defBlock('woolCream', { side: wool(['#D8C8A8', '#D4C4A4', '#DCCCAC'], 66) });
  VX.defBlock('woolGrey', { side: wool(['#4A4858', '#464454', '#4E4C5C'], 67) });
  VX.defBlock('woolBlue', { side: wool(['#4A62A8', '#4660A4', '#4E66AC'], 68) });
  VX.defBlock('screenGlow', { side: wool(['#F2E8D0', '#EEE4CC', '#F4ECD6'], 69), emit: .9 });
  VX.defBlock('pinkLamp', { side: (u, v) => u === 0 || v === 0 || u === 15 || v === 15 ? '#8A3A5A' : pick(h3(u >> 2, v >> 2, 70), ['#FFB8D0', '#FFC4D8', '#FFAAC8']), emit: 1.05 });
  VX.defBlock('tomb', { side: (u, v) => (v === 0 || u === 0 || u === 15) ? '#5A5A68' : pick(h3(u >> 2, v >> 2, 71), ['#8A8A98', '#86869A', '#8E8E9C']) });

  // ======================================================================================= the town (front faces look +z)
  const HOME = { x0: 70, x1: 97, z0: 54, z1: 66 };            // cutaway house: back wall z=54, open to the south
  const BEDR = { x: 74, z: 57 }, BED = { x0: 72, x1: 73, z0: 55, z1: 58 }; // bedroom (west); the bed, pillow at z0
  const LIV = { x: 83.5, z: 60 }, PC = { x: 83, z: 55 }, SOFA = { x0: 81, x1: 86, z: 61 };   // living room: PC desk on the back wall, sofa facing the camera
  const STUDY = { x: 92.5, z: 57 }, DESK2 = { x0: 90, x1: 95, z: 55 };                      // study: two desks side by side, screens at x 91 and 94
  const LIP = { x: 101.5, z: 44 }, BAG = { x: 110.5, z: 44 };                               // the mall (north): lipstick counter, bag shop
  const NET = { x: 121, z: 43 }, QUEUE = { x0: 111, x1: 125, z: 47.5 };                     // 网红店 and its queue
  const CIN = { x: 136, z: 46 };                                                            // the cinema (roofed, screen at z=41)
  const CAFE = { x: 134, z: 62 };                                                           // the café (east)
  const SRV = { x: 104, z: 88 };                                                            // the compute room (south)
  const REG = { x: 128, z: 88 };                                                            // 民政局 (south-east), door at z=86
  const KIN = { x: 82, z: 89 };                                                             // the kindergarten (south-west)
  const PLAZA = { x0: 62, x1: 150, z0: 34, z1: 104 };
  const RACKS = [100, 103, 106, 109];                                                      // compute racks (x), z 86..88, 3 high
  const LAMPS = [];
  const AMBER = [1, .72, .42], CYAN = [.35, .75, 1], PINK = [1, .55, .7], WARM = [1, .85, .6];
  function lampPost(x, z) { VX.set(x, G + 1, z, B.log); VX.set(x, G + 2, z, B.log); VX.set(x, G + 3, z, B.lamp); }
  function tree(x, z) { for (let y = 1; y <= 3; y++) VX.set(x, G + y, z, B.log); for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) for (let y = 3; y <= 4; y++) if (Math.abs(dx) + Math.abs(dz) + (y - 3) < 3) VX.set(x + dx, G + y + 1, z + dz, B.leaves); }
  function buildWorld() {
    VX.reset();
    VX.setMip(1.5);
    const rectD = (x, z) => Math.hypot(Math.max(PLAZA.x0 - x, 0, x - PLAZA.x1), Math.max(PLAZA.z0 - z, 0, z - PLAZA.z1));
    for (let x = 0; x < VX.SX; x++) for (let z = 0; z < VX.SZ; z++) {
      const far = clamp01((rectD(x, z) - 2) / 26);
      const n = 3 * Math.sin(x * .06 + .4) + 2.6 * Math.cos(z * .05 + 1.1) + 4 * Math.max(0, Math.sin(x * .045 + z * .03));
      const h = Math.min(30, G + Math.round(Math.max(0, n + 2) * far * 1.6));
      for (let y = 0; y <= h; y++) VX.set(x, y, z, y === 0 ? B.bedrock : y === h && y > G ? B.terra : y < G ? B.stoneSoft : (far > 0 ? B.stoneSoft : B.floorSoft));
    }
    // ---- the house: plank floor, brick back wall, low side walls, partitions half deep
    VX.fill(HOME.x0, G, HOME.z0, HOME.x1, G, HOME.z1, B.plankSoft);
    VX.fill(HOME.x0, G + 1, HOME.z0, HOME.x1, G + 4, HOME.z0, B.brickSoft);
    for (const x of [HOME.x0, HOME.x1]) VX.fill(x, G + 1, HOME.z0, x, G + 2, HOME.z1 - 3, B.brickSoft);
    for (const x of [79, 88]) VX.fill(x, G + 1, HOME.z0 + 1, x, G + 3, HOME.z0 + 5, B.plankSoft);
    VX.fill(HOME.x0, G + 5, HOME.z0, HOME.x1, G + 5, HOME.z0 + 1, B.woolRose);                // a little roof lip on the back wall
    // bedroom: bed (white pillow, yellow blanket), a night lamp, a rug
    VX.fill(BED.x0, G + 1, BED.z0, BED.x1, G + 1, BED.z0, B.woolWhite); VX.fill(BED.x0, G + 1, BED.z0 + 1, BED.x1, G + 1, BED.z1, B.woolYellow);
    VX.set(76, G + 1, 55, B.plankSoft); VX.set(76, G + 2, 55, B.offlamp);
    VX.fill(73, G, 60, 77, G, 63, B.woolPink);
    // living room: PC desk + screen on the back wall, sofa (seat z=61, back z=60), rug, a floor lamp
    VX.fill(PC.x - 1, G + 1, PC.z, PC.x + 1, G + 1, PC.z, B.plankSoft); VX.set(PC.x, G + 2, PC.z, B.monitor);
    VX.fill(SOFA.x0, G + 1, SOFA.z, SOFA.x1, G + 1, SOFA.z, B.woolRose); VX.fill(SOFA.x0, G + 2, SOFA.z - 1, SOFA.x1, G + 2, SOFA.z - 1, B.woolRose); VX.fill(SOFA.x0, G + 1, SOFA.z - 1, SOFA.x1, G + 1, SOFA.z - 1, B.woolRose);
    VX.fill(81, G, 63, 86, G, 65, B.woolCream);
    VX.set(87, G + 1, 58, B.log); VX.set(87, G + 2, 58, B.lamp);
    // study: two desks side by side, two screens, a bookshelf
    VX.fill(DESK2.x0, G + 1, DESK2.z, DESK2.x1, G + 1, DESK2.z, B.plankSoft); VX.set(91, G + 2, DESK2.z, B.monitor); VX.set(94, G + 2, DESK2.z, B.monitor);
    VX.fill(96, G + 1, 56, 96, G + 3, 57, B.books);
    lampPost(68, 68); lampPost(99, 68);
    // ---- the mall (north row): back walls, the lipstick counter, the bag shop's plinths, signs
    VX.fill(98, G + 1, 41, 105, G + 3, 41, B.stoneSoft); VX.fill(100, G + 1, 44, 103, G + 1, 44, B.woolWhite); VX.fill(99, G + 4, 41, 104, G + 4, 41, B.woolRose);
    VX.fill(107, G + 1, 41, 114, G + 3, 41, B.stoneSoft); VX.set(109, G + 1, 43, B.box); VX.set(112, G + 1, 43, B.box); VX.fill(108, G + 4, 41, 113, G + 4, 41, B.woolPink);
    lampPost(97, 45); lampPost(106, 46); lampPost(115, 46);
    // 网红店: a brick front with a door gap, a pink lamp sign
    VX.fill(117, G + 1, 40, 125, G + 4, 41, B.brickSoft); VX.fill(NET.x, G + 1, 41, NET.x, G + 2, 41, 0); VX.fill(118, G + 5, 41, 124, G + 5, 41, B.woolYellow); VX.set(119, G + 5, 42, B.pinkLamp); VX.set(123, G + 5, 42, B.pinkLamp);
    // the cinema: dark box hall with a roof, a glowing screen, two seat rows, the door at the south
    VX.fill(130, G + 1, 40, 142, G + 6, 40, B.box); for (const x of [130, 142]) VX.fill(x, G + 1, 40, x, G + 6, 52, B.box);
    VX.fill(130, G + 7, 40, 142, G + 7, 52, B.box); VX.fill(131, G + 1, 52, 141, G + 6, 52, B.box); VX.fill(135, G + 1, 52, 137, G + 3, 52, 0);
    VX.fill(132, G + 2, 41, 140, G + 5, 41, B.screenGlow);
    VX.fill(132, G + 1, 46, 140, G + 1, 46, B.woolRose); VX.fill(132, G + 1, 49, 140, G + 1, 49, B.woolRose);
    // the café: plank floor, back wall, awning, three tables, the machine
    VX.fill(128, G, 56, 140, G, 68, B.plankSoft); VX.fill(128, G + 1, 56, 140, G + 3, 56, B.plankSoft); VX.fill(128, G + 4, 56, 140, G + 4, 58, B.woolPink);
    for (const [x, z] of [[131, 61], [136, 61], [131, 65]]) VX.set(x, G + 1, z, B.plankSoft);
    VX.set(139, G + 1, 57, B.box); VX.set(139, G + 2, 57, B.offlamp); lampPost(126, 60); lampPost(142, 66);
    // the compute room: back wall, dark racks with one dim light each (the shots light them), a desk
    VX.fill(98, G + 1, 84, 110, G + 4, 84, B.stoneSoft);
    for (const x of RACKS) { VX.fill(x, G + 1, 86, x, G + 3, 88, B.box); VX.set(x, G + 2, 89, B.offlamp); }
    VX.set(104, G + 1, 92, B.plankSoft); VX.set(104, G + 2, 92, B.monitor); lampPost(96, 90); lampPost(112, 90);
    // 民政局: a brick front (z=85) with a door gap at x 127..129, a red banner, steps
    VX.fill(122, G + 1, 84, 134, G + 6, 85, B.brickSoft); VX.fill(127, G + 1, 85, 129, G + 3, 85, 0); VX.fill(127, G + 1, 84, 129, G + 3, 84, B.woolCream);
    VX.fill(124, G + 6, 86, 132, G + 7, 86, B.woolRed); VX.fill(125, G + 1, 86, 131, G + 1, 86, B.stoneSoft);
    lampPost(120, 89); lampPost(136, 89);
    // the kindergarten: a log fence (gate at x 82, z 95), a yellow slide, little tables, a bookshelf, the knowledge block
    for (let x = 74; x <= 90; x++) for (const z of [84, 95]) if (!(z === 95 && Math.abs(x - 82) <= 1)) VX.set(x, G + 1, z, B.log);
    for (let z = 84; z <= 95; z++) { VX.set(74, G + 1, z, B.log); VX.set(90, G + 1, z, B.log); }
    VX.set(76, G + 1, 87, B.woolYellow); VX.set(76, G + 2, 86, B.woolYellow); VX.set(76, G + 3, 85, B.woolYellow); VX.set(76, G + 1, 88, B.woolYellow);
    VX.set(83, G + 1, 89, B.plankSoft); VX.set(86, G + 1, 89, B.plankSoft); VX.fill(80, G + 1, 85, 81, G + 2, 85, B.books); VX.set(88, G + 1, 86, B.obsidian);
    lampPost(72, 92);
    // trees around the plaza edge
    for (const [x, z] of [[66, 50], [64, 76], [100, 74], [118, 74], [146, 50], [146, 80], [114, 100], [92, 100], [60, 92]]) tree(x, z);
    // ------------------------------------------------ what changes over time (filled by the shots)
    for (let x = 0; x < VX.SX; x++) for (let y = 1; y < VX.SY; y++) for (let z = 0; z < VX.SZ; z++) { const id = VX.get(x, y, z); if (id === B.lamp) LAMPS.push([x, y, z, AMBER, 7, 1.1]); if (id === B.pinkLamp) LAMPS.push([x, y, z, PINK, 5, .9]); }
    for (const [t, x, y, z, nm] of VXE) VX.edit(t, x, y, z, nm ? B[nm] : 0);
    BUILT = true;
  }

  // ======================================================================================= the cast
  const TAGS = [], BUBS = [], LBLS = [];
  const tag = (x, y, z, txt, col) => TAGS.push([x, y, z, txt, col]);
  // 黑哥 (「你」): heigePx options (feel / emotions, view: front q side back, flip, walk: t, poseR / poseL)
  const hgImg = o => VX.capture((x, y) => heigePx(x, y, { ...o, noShadow: true }));
  function heige(x, y, z, o = {}, ex = {}) { VX.sprite(hgImg(o), x, y + (ex.dy || 0), z, ex.k ? { k: ex.k } : undefined); if (!ex.noShadow) VX.shadow(x, y, z, .42); if (ex.tag) tag(x, y + 2.05, z, ex.tag, ex.tagCol); }
  // 她: six poses (idle 抱电脑, angry 抱臂冷脸, cheer 双手举高, shy 捧脸害羞, sleep 抱枕闭眼, point 伸指叉腰坏笑), 1.62 blocks tall.
  // o: dy (sprite px, negative = up), hop (0..1 jump), sq (squash), flip, emote ('heart' '!' '?' 'anger' 'sweat' 'spark' 'music'), emoteAge
  const GF_H = 1.62, gfSpr = {};
  function gfImg(pose = 'idle', o = {}) {
    const key = 'nvGf_' + pose, S = window.SPRITES && SPRITES[key]; if (!S) return null;
    const sp = gfSpr[key] || (gfSpr[key] = gridSprite(S.rows, S.pal)), h = S.rows.length, sq = o.sq || 0, dy = Math.round(o.dy || 0);
    return VX.capture((x, y) => {
      if (Math.abs(sq) > .04) { const keep = Math.round(h * (1 - sq * .5)), rows = []; for (let j = 0; j < keep; j++) rows.push(S.rows[Math.min(h - 1, Math.floor(j * h / keep))]); gridSprite(rows, S.pal).draw(x, y + dy, !!o.flip); }
      else sp.draw(x, y + dy, !!o.flip);
      if (o.emote) pxEmote(o.emote, x + (o.flip ? -26 : 26), y + dy - h + 6, o.emoteK ?? 1, Math.max(0, o.emoteAge || 0), o.flip ? -1 : 1);   // a negative age would index a frame that isn't there
    }, 180, 170, 90, 160);
  }
  function gf(x, y, z, pose = 'idle', o = {}, ex = {}) {
    const S = window.SPRITES && SPRITES['nvGf_' + pose]; if (!S) return;
    const hop = o.hop ? -Math.sin(clamp01(o.hop) * Math.PI) * .6 : 0;
    VX.sprite(gfImg(pose, o), x, y + hop + (ex.dy || 0), z, { k: GF_H / S.rows.length * (ex.scale || 1) });
    if (!ex.noShadow) VX.shadow(x, y, z, .4);
    if (ex.tag) tag(x, y + GF_H + .3, z, ex.tag, ex.tagCol || '#FFD43B');
  }
  // villagers (the other couples, the shop girl, the teacher): one blocky body with a role's colours
  const PC_ = {
    男生: { c1: '#4A62A8', c2: '#3A4E88', hair: '#2A1E18' }, 女生: { c1: '#E890A8', c2: '#C8708A', hair: '#3A2418', long: true, skirt: '#B8505A' },
    男生2: { c1: '#7A5A3A', c2: '#5E4428', hair: '#1A1420' }, 女生2: { c1: '#9A7AC8', c2: '#7A5AA8', hair: '#2A1E18', long: true, skirt: '#5E4488' },
    店员: { c1: '#EDE6DA', c2: '#C8C0B0', hair: '#2A1E18', apron: '#B8505A' }, 老师: { c1: '#D88A6A', c2: '#B86E52', hair: '#2A1E18', long: true, glasses: true },
    路人: { c1: '#6E7A8A', c2: '#566270', hair: '#2A1E18' },
  };
  const pplCache = new Map();
  function pplImg(role, mood = 'neutral', ph = 0) {
    const key = [role, mood, ph].join('|'); if (pplCache.has(key)) return pplCache.get(key);
    const P = PC_[role] || PC_.路人, s = new Spr(), H = -92, SK = '#E0A882', SKD = '#C88E6A', D = '#3A2418';
    if (P.long) s.rect(-14, H + 6, 28, 46, P.hair);                                            // long hair behind the shoulders
    s.rect(-14, -54, 28, 54, P.c1).rect(6, -54, 8, 54, P.c2).rect(-14, -6, 28, 6, P.c2).rect(-16, -44, 32, 10, P.c2).rect(-6, -43, 12, 8, SK);
    if (P.skirt) s.rect(-15, -24, 30, 10, P.skirt);
    if (P.apron) s.rect(-9, -44, 18, 38, P.apron);
    s.rect(-12, H, 24, 36, SK).rect(6, H, 6, 36, SKD).rect(-12, H, 24, 7, P.hair);
    if (P.long) s.rect(-14, H - 2, 28, 9, P.hair).rect(-14, H, 4, 22, P.hair).rect(10, H, 4, 22, P.hair);
    const ey = H + 15;
    if (mood === 'sleep') s.rect(-9, ey + 2, 5, 1, D).rect(3, ey + 2, 5, 1, D);
    else if (mood === 'shock') s.rect(-10, ey - 1, 6, 6, '#FFFFFF').rect(3, ey - 1, 6, 6, '#FFFFFF').rect(-8, ey + 1, 2, 2, D).rect(5, ey + 1, 2, 2, D);
    else s.rect(-9, ey, 5, 4, '#FFFFFF').rect(3, ey, 5, 4, '#FFFFFF').rect(-6, ey, 2, 4, '#3A2418').rect(3, ey, 2, 4, '#3A2418');
    if (P.glasses) s.rect(-11, ey - 1, 9, 1, '#1A1420').rect(1, ey - 1, 9, 1, '#1A1420');
    if (mood === 'angry' || mood === 'shout') s.line(-10, ey - 4, -3, ey - 1, D).line(9, ey - 4, 2, ey - 1, D);
    else if (mood === 'sad' || mood === 'worry') s.line(-10, ey - 1, -3, ey - 4, D).line(9, ey - 1, 2, ey - 4, D);
    else s.rect(-10, ey - 3, 7, 2, D).rect(3, ey - 3, 7, 2, D);
    if (P.long || mood === 'blush') s.rect(-11, ey + 6, 4, 2, '#F29A9A').rect(7, ey + 6, 4, 2, '#F29A9A');
    const my = H + 29;
    if (mood === 'happy' || mood === 'blush') s.rect(-5, my, 11, 1, '#5A2E20').set(-6, my - 1, '#5A2E20').set(6, my - 1, '#5A2E20');
    else if (mood === 'shout' || mood === 'shock' || (mood === 'talk' && ph % 2)) s.rect(-4, my - 2, 9, 4, '#5A2E20');
    else if (mood === 'sad' || mood === 'angry' || mood === 'worry') s.rect(-4, my + 1, 9, 1, '#5A2E20').set(-5, my + 2, '#5A2E20').set(5, my + 2, '#5A2E20');
    else s.rect(-4, my, 9, 1, '#5A2E20');
    s.outline('#24140E');
    const img = VX.capture((x, y) => s.draw(x, y), 70, 124, 35, 116); pplCache.set(key, img); return img;
  }
  // ppl(x, y, z, role, mood, t, { walk, dy, flip, tag, k }): mood neutral happy talk shout angry sad worry shock sleep blush
  function ppl(x, y, z, role, mood = 'neutral', t = 0, ex = {}) {
    const bob = ex.walk ? -Math.abs(Math.sin(t * 7)) * .06 : 0;
    VX.sprite(pplImg(role, mood, Math.floor(t * 5) % 2), x, y + bob + (ex.dy || 0), z, ex.k ? { k: ex.k } : undefined); VX.shadow(x, y, z, .4);
    if (ex.tag) tag(x, y + 2.05, z, ex.tag, ex.tagCol);
  }
  // their kid (5 years old): 黑哥's black cap, her yellow hoodie, a little backpack; 1.0 block tall. mood neutral happy talk proud
  const kidCache = new Map();
  function kidImg(mood = 'neutral', ph = 0) {
    const key = mood + ph; if (kidCache.has(key)) return kidCache.get(key);
    const s = new Spr(), SK = '#F8D5C0', D = '#3A2418';
    s.rect(-9, -8, 7, 8, '#26262C').rect(2, -8, 7, 8, '#26262C').rect(-10, -2, 8, 2, '#F4F0E6').rect(2, -2, 8, 2, '#F4F0E6');
    s.rect(-13, -30, 26, 22, '#F2C63A').rect(6, -30, 7, 22, '#E0A91E').rect(-3, -30, 2, 8, '#1A1A1D');
    s.rect(11, -30, 6, 18, '#B8505A').rect(11, -30, 6, 3, '#8A3A44');                          // backpack strap and bag
    s.rect(-13, -56, 26, 26, SK).rect(7, -56, 6, 26, '#E8A98C');
    s.rect(-15, -60, 30, 8, '#1A1A1D').rect(4, -54, 14, 3, '#1A1A1D');                         // the cap with its brim
    const ey = -45;
    if (mood === 'happy' || mood === 'proud') s.rect(-9, ey + 1, 5, 2, D).rect(4, ey + 1, 5, 2, D); else s.rect(-8, ey, 4, 5, D).rect(4, ey, 4, 5, D).set(-7, ey, '#FFFFFF').set(5, ey, '#FFFFFF');
    s.rect(-11, ey + 6, 3, 2, '#F29A9A').rect(8, ey + 6, 3, 2, '#F29A9A');
    if (mood === 'talk' && ph % 2) s.rect(-2, ey + 9, 5, 3, '#5A2E20'); else s.rect(-3, ey + 9, 7, 1, '#5A2E20').set(-4, ey + 8, '#5A2E20').set(4, ey + 8, '#5A2E20');
    s.outline('#24140E');
    const img = VX.capture((x, y) => s.draw(x, y), 50, 70, 25, 66); kidCache.set(key, img); return img;
  }
  function kid(x, y, z, mood, t, ex = {}) { VX.sprite(kidImg(mood, Math.floor(t * 5) % 2), x, y + (ex.dy || 0), z, { k: 1.0 / 62 }); VX.shadow(x, y, z, .28); if (ex.tag) tag(x, y + 1.25, z, ex.tag, ex.tagCol || '#FFD43B'); }
  // Clawd (Claude): clawdPx options
  const clImg = o => VX.capture((x, y) => clawdPx(x, y, { ...o, noShadow: true }), 160, 160, 80, 150);
  function clawd(x, y, z, o = {}, ex = {}) { VX.sprite(clImg(o), x, y + (ex.dy || 0), z, ex.k ? { k: ex.k } : undefined); VX.shadow(x, y, z, .5); if (ex.tag) tag(x, y + 1.3, z, ex.tag, '#F2A27A'); }

  // ======================================================================================= props (small billboards)
  // prop(x, y, z, name, { k: block size of 1 px (default 1/40), ph: animation phase, a: alpha }); names below
  const PROP = {
    laptop: s => s.rect(-14, -2, 28, 2, '#6A6A78').rect(-12, -20, 24, 18, '#3A3A44').rect(-10, -18, 20, 14, '#1B2440').rect(-7, -15, 9, 1, '#F2C63A').rect(-7, -12, 13, 1, '#C8CCD8').rect(-7, -9, 6, 1, '#C8CCD8'),
    phone: s => s.rect(-6, -22, 12, 22, '#1A1622').rect(-5, -20, 10, 17, '#2E3A5A').rect(-3, -16, 6, 1, '#E8E6F8').rect(-3, -13, 4, 1, '#E8E6F8'),
    giftbag: s => s.rect(-11, -20, 22, 20, '#E890A8').rect(-11, -20, 22, 3, '#F4B4C8').rect(6, -20, 5, 20, '#C8708A').line(-5, -20, -3, -27, '#5A2E20').line(5, -20, 3, -27, '#5A2E20').line(-3, -27, 3, -27, '#5A2E20').rect(-3, -13, 6, 6, '#FFD43B'),
    handbag: s => s.rect(-12, -16, 24, 16, '#B8505A').rect(-12, -16, 24, 3, '#D8707A').rect(-2, -10, 4, 3, '#FFD43B').line(-7, -16, -5, -24, '#5A2E20').line(7, -16, 5, -24, '#5A2E20').line(-5, -24, 5, -24, '#5A2E20'),
    lipstick: s => s.rect(-3, -10, 6, 10, '#2A2A36').rect(-3, -12, 6, 2, '#FFD43B').rect(-2, -18, 4, 6, '#C8323C').set(-2, -19, '#C8323C').set(-1, -19, '#C8323C'),
    cola: s => s.rect(-5, -16, 10, 16, '#C8323C').rect(-5, -16, 10, 2, '#D8D8E0').rect(-5, -2, 10, 2, '#D8D8E0').rect(-3, -11, 6, 4, '#F4F0E6').set(3, -14, '#FFE8E8'),
    cup: s => s.rect(-6, -12, 12, 12, '#F4F0E6').rect(-6, -12, 12, 2, '#D8D0C0').rect(6, -9, 3, 5, '#F4F0E6').line(-2, -15, -1, -19, '#C8CCD8').line(2, -15, 3, -19, '#C8CCD8'),
    rose: s => s.ell(0, -18, 5, 4, '#C8323C').ell(-1, -19, 2, 2, '#E85A64').line(0, -14, 0, 0, '#7A5A3A').rect(1, -9, 3, 2, '#7A5A3A'),
    candle: s => s.rect(-3, -12, 6, 12, '#F4F0E6').line(0, -12, 0, -14, '#3A2418').ell(0, -17, 2, 3, '#FFD43B').set(0, -18, '#FFF6D0'),
    coin: s => s.ell(0, -8, 7, 7, '#E8A93A').ell(0, -8, 5, 5, '#FFD43B').rect(-1, -11, 2, 6, '#E8A93A'),
    star: s => s.poly([[0, -18], [4, -11], [11, -10], [6, -5], [7, 2], [0, -2], [-7, 2], [-6, -5], [-11, -10], [-4, -11]], '#FFD43B'),
    heart: s => s.rect(-8, -14, 6, 4, '#E83A54').rect(2, -14, 6, 4, '#E83A54').rect(-9, -12, 18, 5, '#E83A54').rect(-7, -7, 14, 3, '#E83A54').rect(-5, -4, 10, 2, '#E83A54').rect(-2, -2, 4, 2, '#E83A54').set(-6, -13, '#FF9AAA'),
    ring: s => s.rect(-8, -8, 16, 8, '#B8505A').rect(-8, -14, 16, 6, '#8A3A44').ell(0, -13, 4, 4, '#FFD43B').ell(0, -13, 2, 2, '#8A3A44').set(0, -18, '#FFFFFF'),
    book: s => s.rect(-10, -14, 20, 14, '#E8A93A').rect(-10, -14, 20, 2, '#FFD43B').rect(-1, -14, 2, 14, '#B8862E').rect(-7, -9, 5, 1, '#5A3E10').rect(3, -9, 5, 1, '#5A3E10'),
    card: s => s.rect(-12, -16, 24, 16, '#ECE6DA').rect(-12, -16, 24, 4, '#C8323C').rect(-8, -9, 16, 1, '#7A6A58').rect(-8, -6, 10, 1, '#7A6A58'),
    chip: s => s.rect(-12, -12, 24, 12, '#2A2A36').rect(-12, -12, 24, 2, '#4A4858').rect(-9, -9, 18, 6, '#E8A93A').rect(-7, -8, 4, 4, '#FFD43B').rect(3, -8, 4, 4, '#FFD43B'),
    tear: s => s.ell(0, -3, 2, 3, '#9DC8F0').set(0, -7, '#9DC8F0'),
    zzz: s => s.rect(-6, -18, 6, 1, '#E8E6F8').line(0, -18, -6, -13, '#E8E6F8').rect(-6, -13, 6, 1, '#E8E6F8').rect(2, -10, 4, 1, '#E8E6F8').line(6, -10, 2, -7, '#E8E6F8').rect(2, -7, 4, 1, '#E8E6F8'),
  };
  const propCache = new Map();
  function propImg(name) {
    if (propCache.has(name)) return propCache.get(name);
    const s = new Spr(); (PROP[name] || PROP.card)(s); s.outline('#140A10');
    const img = VX.capture((x, y) => s.draw(x, y), 40, 40, 20, 34); propCache.set(name, img); return img;
  }
  function prop(x, y, z, name, o = {}) { VX.sprite(propImg(name), x, y, z, { k: o.k ?? 1 / 40, a: o.a ?? 1, lit: o.lit ?? 1 }); }
  // world particles: a burst, hearts floating up, gold coins, a firework
  function burst(t, t0, x, y, z, col, n = 18) { const a = t - t0; if (a < 0 || a > .9) return; for (let i = 0; i < n; i++) {
    const vx = (hh(i, t0) - .5) * 4, vz = (hh(i, t0 + 1) - .5) * 4, vy = 2 + hh(i, t0 + 2) * 3;
    VX.pt(x + vx * a, y + vy * a - 9 * a * a, z + vz * a, .09 + .05 * hh(i), col.map(c => c * (.75 + .3 * hh(i, 9)))); } }
  function heartsUp(t, t0, t1, x, y, z, n = 5) { if (t < t0 || t > t1 + 1.5) return; for (let i = 0; i < n; i++) { const b = t0 + i * (t1 - t0) / n, a = t - b; if (a < 0 || a > 1.5) continue;
    prop(x + Math.sin(i * 2.1 + a * 3) * .4, y + a * 1.1, z, 'heart', { k: 1 / 56, a: 1 - a / 1.5 }); } }
  function coinsUp(t, t0, x, y, z, n = 10) { const a = t - t0; if (a < 0 || a > 1.4) return; for (let i = 0; i < n; i++) { const vx = (hh(i, t0) - .5) * 2.4, vy = 2.2 + hh(i, t0 + 3) * 1.6;
    prop(x + vx * a, y + vy * a - 4 * a * a, z + (hh(i, 5) - .5) * .6, 'coin', { k: 1 / 60 }); } }
  function firework(x, y, z, a) { for (const [k, off] of [[0, 0], [1, .35]]) { const b = a - off; if (b < 0 || b > 1.2) continue; for (let i = 0; i < 26; i++) { const th = i / 26 * Math.PI * 2, ph = hh(i, k) * 2 - 1, r = b * 2.2; VX.pt(x + Math.cos(th) * r * .8, y + 1 + ph * r * .7 - b * b, z + Math.sin(th) * r * .5, .07, [[255, 210, 90], [255, 120, 160], [180, 140, 255]][(i + k) % 3], true); } } }

  // ======================================================================================= camera and shots
  const cr = (p0, p1, p2, p3, u) => { const u2 = u * u, u3 = u2 * u; return .5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3); };
  function along(keys, t) {
    if (keys.length === 1) return { p: [...keys[0][1]], q: [...keys[0][2]], fov: keys[0][3] };
    let i = 0; while (i < keys.length - 2 && t >= keys[i + 1][0]) i++;
    let k1 = keys[i], k2 = keys[i + 1], k0 = keys[Math.max(0, i - 1)], k3 = keys[Math.min(keys.length - 1, i + 2)];
    if (k2[0] - k1[0] < .15) return { p: [...k1[1]], q: [...k1[2]], fov: k1[3] };           // keys a hair apart are a cut
    if (k1[0] - k0[0] < .15) k0 = k1; if (k3[0] - k2[0] < .15) k3 = k2;
    const u = sm(seg01(t, k1[0], k2[0])) * .35 + seg01(t, k1[0], k2[0]) * .65;
    const v = (a, b) => cr(k0[a][b], k1[a][b], k2[a][b], k3[a][b], u);
    return { p: [v(1, 0), v(1, 1), v(1, 2)], q: [v(2, 0), v(2, 1), v(2, 2)], fov: k1[3] + (k2[3] - k1[3]) * sm(u) };
  }
  const look = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2]; return { yaw: Math.atan2(dx, -dz), pitch: Math.atan2(dy, Math.hypot(dx, dz)) }; };
  const K = (t, p, q, f = 62) => [t, p, q, f];
  const bubble = (x, y, z, txt, t, t0, t1) => { if (t >= t0 && t < t1) BUBS.push([x, y, z, txt, t - t0, t1 - t]); };
  const label = (x, y, z, txt, size, col, t, t0, t1 = 1e9) => { if (t >= t0 && t < t1) LBLS.push([x, y, z, txt, size, col, t - t0, t1 - t]); };
  // shot(t0, t1, { keys: [K(...)], act(t), ui(c, t), day, fog: [near, far], kicks: [[t, amount]], lights(t, cam), noWhoosh })
  const S = window.NVYOU_SHOTS = [];
  const shot = (t0, t1, o) => { S.push({ t0, t1, ...o }); if (t0 > .1 && !o.noWhoosh) sfx(t0 - .12, 'whoosh', -15); };
  const FLASH = [];                                        // [t0, 'r,g,b', alpha]: a full-screen flash that decays fast
  const flash = (t0, col = '255,255,255', a = .25) => FLASH.push([t0, col, a]);

  // ======================================================================================= phrases → times
  // F(phrase, nth): which line says it and when. P = when the phrase starts; LS / LE = that line's start / end;
  // A = a shot boundary a hair before a line starts; AT = a boundary a hair before a phrase inside a line.
  // Phrases are the script's own words with no punctuation and no spaces (英文照写: GitHub, Claude, H100).
  const ALLW = DD.lines.map(l => l.w);
  function F(sub, nth = 0) { let n = 0; for (let i = 0; i < ALLW.length; i++) { let from = 0, k; while ((k = ALLW[i].indexOf(sub, from)) >= 0) { if (n === nth) return { i, t: DD.lines[i].t[[...ALLW[i].slice(0, k)].length] }; n++; from = k + 1; } } console.warn('F miss', sub, nth); return { i: 0, t: 0 }; }
  const P = (s, n) => F(s, n).t, LS = (s, n) => DD.lines[F(s, n).i].s, LE = (s, n) => DD.lines[F(s, n).i].e;
  const A = (s, n) => LS(s, n) - .3, AT = (s, n) => P(s, n) - .2;
  const DUSK = .32, NIGHT = .15;

  // ======================================================================================= the overlay kit (from kanbing.js)
  function guiWin(c, t, t0, t1, title) {
    const a = sm(seg01(t, t0, t0 + .22)) * (1 - sm(seg01(t, t1 - .22, t1)));
    if (a <= 0) return;
    const { x, y, w, h } = GUI, k = .92 + .08 * a;
    c.save(); c.fillStyle = `rgba(6,4,12,${.55 * a})`; c.fillRect(0, 0, 1920, 1080);
    c.globalAlpha = a; c.translate(960, 540); c.scale(k, k); c.translate(-960, -540);
    panel(c, x - 26, y - 86, w + 52, h + 112, true);
    outlined(c, title, x + 4, y - 44, 38, '#3A3A3A', { lw: 0, shadow: false, align: 'left' });
    c.fillStyle = '#0B0F16'; c.fillRect(x, y, w, h);
    c.fillStyle = '#373737'; c.fillRect(x - 4, y - 4, w + 8, 4); c.fillRect(x - 4, y - 4, 4, h + 8);
    c.restore();
  }

  const FONT = '"PingFang SC", "HarmonyOS Sans SC", sans-serif';
  function outlined(c, txt, x, y, size, fill, o = {}) {
    c.font = `${o.w || 900} ${size}px ${FONT}`; c.textAlign = o.align || 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
    if (o.shadow !== false) { c.fillStyle = 'rgba(8,4,12,.55)'; c.fillText(txt, x + size * .07, y + size * .07); }
    if ((o.lw ?? 1) > 0) { c.lineWidth = o.lw ?? Math.max(6, size * .16); c.strokeStyle = o.stroke || '#140A10'; c.strokeText(txt, x, y); }
    c.fillStyle = fill; c.fillText(txt, x, y);
  }
  const fadeIO = (t, t0, t1, d = .25) => sm(seg01(t, t0, t0 + d)) * (1 - sm(seg01(t, t1 - d, t1)));
  const D = window.NVYOU_DATA || { cues: [], keys: [] };
  function subtitle(c, t) {
    for (const [a, b, txt] of D.cues) if (t >= a && t < b) {
      c.font = `900 64px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.lineJoin = 'round';
      const parts = []; let i = 0;
      while (i < txt.length) { const k = D.keys.find(w => txt.startsWith(w, i)); if (k) { parts.push([k, true]); i += k.length; } else { if (parts.length && !parts[parts.length - 1][1]) parts[parts.length - 1][0] += txt[i]; else parts.push([txt[i], false]); i++; } }
      let x = 960 - parts.reduce((s, [p]) => s + c.measureText(p).width, 0) / 2;
      for (const [p, key] of parts) { c.lineWidth = 14; c.strokeStyle = '#140A10'; c.strokeText(p, x, 1006); c.fillStyle = key ? '#FFD34E' : '#FFFFFF'; c.fillText(p, x, 1006); x += c.measureText(p).width; }
      break;
    }
  }
  function slam(c, t, t0, t1, txt, fill, size, y = 470) {
    if (t < t0 || t > t1) return;
    const a = t - t0, k = (1 + .9 * Math.exp(-a * 16) * Math.cos(a * 30)) * (1 - sm(seg01(t, t1 - .16, t1))), f = Math.floor(t * 24);
    if (k <= .02) return;
    c.save(); c.translate(960 + (hh(f) - .5) * 14 * Math.exp(-a * 5), y + (hh(f, 2) - .5) * 14 * Math.exp(-a * 5)); c.rotate(-.04); c.scale(k, k);
    outlined(c, txt, 0, 0, size, fill, { lw: size * .14 }); c.restore();
  }
  const pow = (c, t, t0, txt, x, y) => { const a = t - t0; if (a < 0 || a > .5) return; c.save(); c.globalAlpha = 1 - a * 2; c.translate(x, y - a * 80); const k = 1 + .6 * Math.exp(-a * 12); c.scale(k, k); outlined(c, txt, 0, 0, 110, '#FFFFFF', { stroke: '#C8323C', lw: 16 }); c.restore(); };
  const floatTxt = (c, t, t0, txt, x, y) => { const a = t - t0; if (a < 0 || a > .8) return; c.save(); c.globalAlpha = 1 - a / .8; outlined(c, txt, x, y - a * 120, 48, '#F2D29A', { lw: 8 }); c.restore(); };
  const label2 = (c, t, t0, txt, x, y, t1 = 1e9) => { if (t < t0 || t > t1) return; const a = t - t0; c.save(); c.globalAlpha = Math.min(1, a * 4); const k = 1 + .3 * Math.exp(-a * 10); c.translate(x, y); c.scale(k, k); outlined(c, txt, 0, 0, 96, '#FFD34E', { lw: 14 }); c.restore(); };
  function panel(c, x, y, w, h, light = false) {
    if (light) { c.fillStyle = '#C6C6C6'; c.fillRect(x, y, w, h); c.fillStyle = '#FFFFFF'; c.fillRect(x, y, w, 6); c.fillRect(x, y, 6, h); c.fillStyle = '#555555'; c.fillRect(x, y + h - 6, w, 6); c.fillRect(x + w - 6, y, 6, h); c.strokeStyle = '#000'; c.lineWidth = 4; c.strokeRect(x - 2, y - 2, w + 4, h + 4); }
    else { c.fillStyle = 'rgba(16,10,28,.88)'; c.fillRect(x, y, w, h); c.fillStyle = '#3A1E6A'; c.fillRect(x, y, w, 5); c.fillRect(x, y + h - 5, w, 5); c.fillRect(x, y, 5, h); c.fillRect(x + w - 5, y, 5, h); }
  }
  const ICON = {
    briefcase: ['..aaaa..', '..a..a..', 'bbbbbbbb', 'bbbbbbbb', 'ccccdccc', 'bbbbbbbb', 'bbbbbbbb'], book: ['aaaaaaa.', 'abbbbbba', 'abccccba', 'abbbbbba', 'abccccba', 'abbbbbba', 'aaaaaaa.'],
    heart: ['.aa..aa.', 'abbaabba', 'abbbbbba', 'abbbbbba', '.abbbba.', '..abba..', '...aa...'], clock: ['..aaaa..', '.abbbba.', 'abbcbbba', 'abbcccba', 'abbbbbba', '.abbbba.', '..aaaa..'],
    star: ['...a....', '..aba...', 'aabbbaa.', '.abbba..', '.ab.ba..', 'a.....a.'], axe: ['.aaa....', 'abbba...', 'abbbad..', '.aa.d...', '...d....', '..d.....'],
    bolt: ['....aa..', '...ab...', '..abb...', '.abbbba.', '...bba..', '...ba...', '..a.....'], moon: ['..aaa...', '.abba...', 'abb.....', 'abb.....', 'abba....', '.abbaaa.', '..aaa...'],
    lead: ['aa......', 'abaa....', '.abba...', '..abba..', '...abba.', '....abba', '.....aa.'],
  };
  const ICOL = { briefcase: ['#5E3E28', '#B07B45', '#F2C14E', '#6B4428'], book: ['#4A2E1C', '#B23A3A', '#F2E6C8'], heart: ['#5A1418', '#E83A54'], clock: ['#5A3E10', '#F2C14E', '#3A2A20'], star: ['#5A3E10', '#FFD34E'], axe: ['#5E6172', '#C8CCD8', '#6B4428', '#6B4428'], bolt: ['#5A3E10', '#FFE070'], moon: ['#2A3060', '#E8E6F8'], lead: ['#3A2414', '#B07B45'] };
  function icon(c, name, x, y, s) { const rows = ICON[name] || ICON.book, cols = ICOL[name] || ICOL.book; rows.forEach((r, j) => [...r].forEach((ch, i) => { const k = 'abcd'.indexOf(ch); if (k < 0) return; c.fillStyle = cols[Math.min(k, cols.length - 1)]; c.fillRect(x + i * s, y + j * s, s, s); })); }
  function toast(c, t, t0, t1, title, text, ic = 'briefcase', rim = '#E8A93A') {
    if (t < t0 || t > t1) return;
    const slide = 1 - sm(seg01(t, t0, t0 + .22)) + sm(seg01(t, t1 - .25, t1)), x = 1340 + slide * 620, y = 70;
    c.fillStyle = '#1E1B30'; c.fillRect(x, y, 520, 124); c.fillStyle = rim; c.fillRect(x, y, 520, 6); c.fillRect(x, y + 118, 520, 6); c.fillRect(x, y, 6, 124); c.fillRect(x + 514, y, 6, 124);
    icon(c, ic, x + 26, y + 30, 9);
    outlined(c, title, x + 124, y + 42, 32, '#FFD34E', { align: 'left', lw: 6, shadow: false }); outlined(c, text, x + 124, y + 86, 38, '#FFFFFF', { align: 'left', lw: 6, shadow: false });
  }
  function titleCard(c, t, t0, t1, big, small) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .3);
    c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(6,4,12,.35)'; c.fillRect(0, 300, 1920, 360);
    outlined(c, big, 960, 430, 120, '#FFFFFF', { lw: 18 }); outlined(c, small, 960, 560, 64, '#FFD34E', { lw: 11 }); c.restore();
  }
  const questionCard = (c, t, t0, t1, n, q) => { if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .3); c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(6,4,12,.4)'; c.fillRect(0, 160, 1920, 300); outlined(c, n, 960, 240, 92, '#FFD34E', { lw: 14 }); outlined(c, q, 960, 370, 70, '#FFFFFF', { lw: 12 }); c.restore(); };
  const hhmm = h => { const H = Math.floor(h) % 24, M = Math.floor((h % 1) * 60); return `${String(H).padStart(2, '0')}:${String(M).padStart(2, '0')}`; };
  function clockUI(c, txt, a) { c.save(); c.globalAlpha = a; panel(c, 40, 40, 300, 100); icon(c, 'clock', 62, 58, 9); outlined(c, txt, 230, 92, 54, '#FFFFFF', { lw: 8, shadow: false }); c.restore(); }
  const tagUI = (c, txt, a) => { if (a <= 0) return; c.save(); c.globalAlpha = a; c.font = `800 40px ${FONT}`; const w = c.measureText(txt).width; panel(c, 40, 40, w + 60, 80); outlined(c, txt, 70 + w / 2, 82, 40, '#F2E6C8', { lw: 6, shadow: false }); c.restore(); };
  const dayCounter = (c, txt, a) => { if (a <= 0) return; c.save(); c.globalAlpha = a; outlined(c, txt, 960, 120, 58, '#F2E6C8', { lw: 9 }); c.restore(); };
  function dream(c, t, t0, t1) { const a = fadeIO(t, t0, t1, .3); const g = c.createRadialGradient(960, 540, 300, 960, 540, 1100); g.addColorStop(0, 'rgba(255,190,230,0)'); g.addColorStop(1, `rgba(200,120,220,${.55 * a})`); c.fillStyle = g; c.fillRect(0, 0, 1920, 1080); tagUI(c, '脑补中', a); }
  function bossBar(c, t, name, k) {
    const w = 900, x = 510, y = 80, low = k < .15 && Math.floor(t * 8) % 2;
    outlined(c, name, 960, 50, 44, '#FFFFFF', { lw: 8 }); c.fillStyle = '#1A0E1A'; c.fillRect(x - 6, y - 6, w + 12, 36);
    c.fillStyle = low ? '#FF3A3A' : '#E85AA8'; c.fillRect(x, y, w * k, 24); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(x, y, w * k, 6);
  }
  const levelUI = (c, t, txt, k) => { const bx = 560, by = 930, bw = 800; c.fillStyle = 'rgba(12,8,16,.75)'; c.fillRect(bx - 4, by - 4, bw + 8, 26); c.fillStyle = '#E8A93A'; c.fillRect(bx, by, bw * k, 18); outlined(c, txt, 960, by - 34, 50, '#FFD34E', { lw: 8 }); };
  function timerUI(c, t, t0) { if (t < t0) return; const s = Math.max(0, 3600 - Math.floor((t - t0) * 60)), txt = `${Math.floor(s / 3600)}:${String(Math.floor(s % 3600 / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; c.save(); c.globalAlpha = Math.min(1, (t - t0) * 4); panel(c, 40, 40, 380, 100); icon(c, 'clock', 62, 58, 9); outlined(c, txt, 260, 92, 54, '#FFD34E', { lw: 8, shadow: false }); c.restore(); }
  function cold(c, t, t0) { if (t < t0) return; c.fillStyle = `rgba(70,46,130,${.2 * Math.min(1, (t - t0) * 2)})`; c.fillRect(0, 0, 1920, 1080); }
  function lossUI(c, t, t0) { if (t < t0) return; const n = Math.floor((t - t0) * 1.2e5 + 12000); c.save(); c.globalAlpha = Math.min(1, (t - t0) * 4); panel(c, 1300, 60, 580, 150); outlined(c, '每分钟损失', 1590, 104, 40, '#C8C0E0', { lw: 6, shadow: false }); outlined(c, '¥ ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '), 1590, 166, 56, '#FFD34E', { lw: 8, shadow: false }); c.restore(); }
  function crossOut(c, t, t0, txt) { if (t < t0 - .5) return; const a = Math.min(1, (t - t0 + .5) * 4); c.save(); c.globalAlpha = a; panel(c, 760, 200, 400, 150); outlined(c, txt, 960, 275, 80, '#FFD34E', { lw: 10, shadow: false });
    if (t > t0) { const k = Math.min(1, (t - t0) * 6); c.strokeStyle = '#E83A44'; c.lineWidth = 16; c.beginPath(); c.moveTo(780, 220); c.lineTo(780 + 360 * k, 220 + 110 * k); c.stroke(); if (k >= 1) { c.beginPath(); c.moveTo(1140, 220); c.lineTo(780, 330); c.stroke(); } } c.restore(); }
  function stamp(c, t, t0, txt) { if (t < t0) return; const a = t - t0, k = 1 + 1.2 * Math.exp(-a * 14); c.save(); c.translate(960, 380); c.rotate(-.12); c.scale(k, k); c.globalAlpha = Math.min(1, a * 8);
    c.strokeStyle = '#E83A44'; c.lineWidth = 14; c.strokeRect(-330, -90, 660, 180); outlined(c, txt, 0, 0, 96, '#E83A44', { stroke: '#FFF0E8', lw: 8, shadow: false }); c.restore(); }
  function iconPop(c, t, t0, ic, txt, x, y) { if (t < t0) return; const a = t - t0, k = (1 + .5 * Math.exp(-a * 10)) * 1; if (k <= 0) return; c.save(); c.translate(x, y); c.scale(k, k); icon(c, ic, -72, -100, 18); outlined(c, txt, 0, 110, 64, '#FFFFFF', { lw: 10 }); c.restore(); }
  // world-anchored text: name tags, speech bubbles, labels
  function worldText(c) {
    for (const [x, y, z, txt, col] of TAGS) { const p = VX.project(x, y, z, 6); if (!p.vis || p.cz > 22) continue; const s = Math.max(22, Math.min(44, p.k * 6 * .2));
      c.font = `800 ${s}px ${FONT}`; const w = c.measureText(txt).width; c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(p.x - w / 2 - 10, p.y - s * .75, w + 20, s * 1.4); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = col || '#FFFFFF'; c.fillText(txt, p.x, p.y - s * .05); }
    for (const [x, y, z, txt, size, col, age, left] of LBLS) { const p = VX.project(x, y, z, 6); if (p.cz < .3 || p.cz > 70) continue; const s = Math.max(26, Math.min(220, p.k * 6 * size)) * (1 + .4 * Math.exp(-age * 8));
      c.save(); c.globalAlpha = Math.min(1, age * 5) * Math.min(1, left * 4); outlined(c, txt, p.x, p.y, s, col, { lw: s * .14, stroke: col === '#3A1E10' ? '#F2D29A' : '#140A10' }); c.restore(); }
    // speech bubbles: '\n' breaks lines; the bubble stays inside the frame and above the subtitle band
    for (const [x, y, z, txt, age, left] of BUBS) { const p = VX.project(x, y, z, 6); if (p.cz < .3) continue; const k = Math.min(1, age * 6) * Math.min(1, left * 5), s = 50, ls = txt.split('\n');
      c.save(); c.globalAlpha = k; c.font = `900 ${s}px ${FONT}`; const w = Math.max(...ls.map(l => c.measureText(l).width)) + 60, h = 40 + ls.length * 60;
      const bx = Math.max(20, Math.min(1900 - w, p.x - w / 2)), by = Math.max(20, Math.min(900 - h, p.y - 54 - h)), tx = Math.max(bx + 30, Math.min(bx + w - 30, p.x));
      c.fillStyle = '#FFFFFF'; c.strokeStyle = '#140A10'; c.lineWidth = 6; c.beginPath(); c.roundRect(bx, by, w, h, 18); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(tx - 18, by + h - 2); c.lineTo(tx, by + h + 34); c.lineTo(tx + 18, by + h - 2); c.fill(); c.stroke(); c.fillStyle = '#FFFFFF'; c.fillRect(tx - 15, by + h - 8, 30, 8);
      c.fillStyle = '#140A10'; c.textAlign = 'center'; c.textBaseline = 'middle'; ls.forEach((l, i) => c.fillText(l, bx + w / 2, by + 50 + i * 60)); c.restore(); }
  }

  // ======================================================================================= V071 overlay pieces (shared by the chunks)
  // a phone chat (generic app, no brand): msgs = [[t, 'me' | 'her', text, kind]], kind 'img' draws a card with the text as its caption
  function phoneChat(c, t, t0, t1, title, msgs, o = {}) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .22), x = o.x ?? 1240, y = 90, w = 560, h = 800, sl = (1 - sm(seg01(t, t0, t0 + .3))) * 200;
    c.save(); c.globalAlpha = a; c.translate(0, sl); c.fillStyle = '#1A1622'; c.beginPath(); c.roundRect(x - 18, y - 18, w + 36, h + 36, 40); c.fill();
    c.fillStyle = '#EDEBF2'; c.fillRect(x, y, w, h); c.fillStyle = '#2A2638'; c.fillRect(x, y, w, 90); outlined(c, title, x + w / 2, y + 48, 38, '#FFFFFF', { lw: 0, shadow: false });
    let yy = y + 120;
    for (const [tm, who, txt, kind] of msgs) { if (t < tm) break; const k = sm(seg01(t, tm, tm + .2)), me = who === 'me';
      c.globalAlpha = a * k; c.font = `800 34px ${FONT}`; const lines = txt.split('\n'), tw = kind === 'img' ? 300 : Math.max(...lines.map(l => c.measureText(l).width)) + 40, bh = kind === 'img' ? 220 : 24 + lines.length * 46;
      const bx = me ? x + w - 30 - tw : x + 90; c.fillStyle = me ? '#FFD43B' : '#FFFFFF'; c.beginPath(); c.roundRect(bx, yy, tw, bh, 14); c.fill();
      c.fillStyle = me ? '#3A3550' : '#F29AB0'; c.fillRect(me ? x + w - 24 + 30 - 30 : x + 24, yy, 50, 50);
      if (kind === 'img') { c.fillStyle = '#C8323C'; c.fillRect(bx + 16, yy + 16, tw - 32, 50); outlined(c, '预约成功', bx + tw / 2, yy + 42, 30, '#FFFFFF', { lw: 0, shadow: false });
        c.fillStyle = '#ECE6DA'; c.fillRect(bx + 16, yy + 72, tw - 32, 132); c.font = `800 28px ${FONT}`; c.fillStyle = '#3A2414'; c.textAlign = 'center'; lines.forEach((l, i) => c.fillText(l, bx + tw / 2, yy + 112 + i * 40)); }
      else { c.fillStyle = '#1A1622'; c.textAlign = 'left'; c.textBaseline = 'middle'; lines.forEach((l, i) => c.fillText(l, bx + 20, yy + 35 + i * 46)); }
      yy += bh + 26; }
    c.restore();
  }
  // a terminal window: lines = [[t, text, colour, cps]]; cps > 0 types the text out at that many characters per second
  function termWin(c, t, t0, t1, title, lines, o = {}) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .2), x = o.x ?? 300, y = o.y ?? 140, w = o.w ?? 1320, h = o.h ?? 680, fs = o.fs ?? 48;
    c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(6,4,12,.45)'; c.fillRect(0, 0, 1920, 1080);
    c.fillStyle = '#2A2638'; c.fillRect(x, y, w, 64); c.fillStyle = '#0E0C16'; c.fillRect(x, y + 64, w, h - 64);
    for (const [i, col] of ['#E8604C', '#E8A93A', '#8A86A0'].entries()) { c.fillStyle = col; c.beginPath(); c.arc(x + 36 + i * 40, y + 32, 12, 0, 7); c.fill(); }
    outlined(c, title, x + w / 2, y + 33, 30, '#C8C0E0', { lw: 0, shadow: false });
    let yy = y + 64 + 40 + fs * .6, last = null;
    for (const [tm, txt, col, cps] of lines) { if (t < tm) break; const n = cps ? Math.min([...txt].length, Math.floor((t - tm) * cps)) : [...txt].length, s = [...txt].slice(0, n).join('');
      c.font = `800 ${fs}px "SF Mono", Menlo, ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = col || '#E8E6F8'; c.fillText(s, x + 40, yy); last = [x + 40 + c.measureText(s).width, yy]; yy += fs * 1.5; }
    if (last && Math.floor(t * 2.5) % 2) { c.fillStyle = '#E8E6F8'; c.fillRect(last[0] + 6, last[1] - fs * .45, fs * .5, fs * .9); }
    c.restore();
  }
  // a villager trade (Minecraft-like): give ×n → get ×m; crossAt strikes the trade out in red
  function tradeWin(c, t, t0, t1, give, gn, get, gm, crossAt = 1e9) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .22);
    c.save(); c.globalAlpha = a; panel(c, 460, 170, 1000, 400, true); outlined(c, '交易', 960, 225, 46, '#3A3A3A', { lw: 0, shadow: false });
    c.fillStyle = '#8B8B8B'; c.fillRect(520, 290, 330, 220); c.fillRect(1070, 290, 330, 220);
    outlined(c, give, 685, 370, 60, '#FFFFFF', { lw: 8, shadow: false }); outlined(c, gn, 685, 450, 44, '#FFD43B', { lw: 7, shadow: false });
    outlined(c, '→', 960, 400, 90, '#FFD43B', { lw: 10, shadow: false });
    if (t > t0 + .45) { const k = 1 + .4 * Math.exp(-(t - t0 - .45) * 10); c.save(); c.translate(1235, 400); c.scale(k, k); outlined(c, get, 0, -30, 60, '#FFFFFF', { lw: 8, shadow: false }); outlined(c, gm, 0, 50, 44, '#FFD43B', { lw: 7, shadow: false }); c.restore(); }
    if (t > crossAt) { const k = seg01(t, crossAt, crossAt + .2); c.strokeStyle = '#E83A44'; c.lineWidth = 16; c.beginPath(); c.moveTo(500, 280); c.lineTo(500 + 920 * k, 280 + 250 * k); c.stroke(); }
    c.restore();
  }
  // the ban screen: 连接已断开 / 你已被此服务器封禁 and a list of what went with it
  function banScreen(c, t, t0, t1, rows) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .15);
    c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(30,18,22,.93)'; c.fillRect(0, 0, 1920, 1080);
    outlined(c, '连接已断开', 960, 230, 76, '#FFFFFF', { lw: 10 }); outlined(c, '你已被此服务器封禁', 960, 330, 56, '#FF6A5A', { lw: 9 });
    rows.forEach(([name, at], i) => { if (t < at) return; const y = 450 + i * 96; c.globalAlpha = a * seg01(t, at, at + .15); c.fillStyle = '#2A2238'; c.fillRect(600, y - 36, 720, 76);
      outlined(c, name, 640, y + 2, 38, '#C8C0E0', { align: 'left', lw: 6, shadow: false });
      c.save(); c.translate(1220, y); c.rotate(-.12); const sc = 1 + .5 * Math.exp(-(t - at) * 12); c.scale(sc, sc); c.strokeStyle = '#E83A44'; c.lineWidth = 6; c.strokeRect(-70, -28, 140, 56); outlined(c, '已封禁', 0, 2, 34, '#FF6A5A', { lw: 6, shadow: false }); c.restore(); });
    c.restore();
  }
  // pixel hearts rising over the frame (a kiss, a proposal): n hearts from t0, spread across x0..x1
  function heartsUI(c, t, t0, t1, n = 12, x0 = 560, x1 = 1360) {
    if (t < t0 || t > t1 + 1.2) return;
    for (let i = 0; i < n; i++) { const b = t0 + (t1 - t0) * i / n, a = t - b; if (a < 0 || a > 1.2) continue; const x = lerp(x0, x1, hh(i, 4)) + Math.sin(a * 5 + i) * 20, y = 760 - a * 420, k = .7 + .5 * hh(i, 6);
      c.save(); c.globalAlpha = 1 - a / 1.2; c.translate(x, y); c.scale(k, k); icon(c, 'heart', -48, -42, 12); c.restore(); }
  }
  // a big number counting up (Token, stars, love letters)
  function counterUI(c, t, t0, t1, from, to, dur, title, unit = '', o = {}) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .2), k = sm(seg01(t, t0, t0 + dur)), n = Math.round(lerp(from, to, k)), x = o.x ?? 960, y = o.y ?? 300;
    c.save(); c.globalAlpha = a; panel(c, x - 380, y - 120, 760, 230); outlined(c, title, x, y - 60, 40, '#F2E6C8', { lw: 6, shadow: false });
    outlined(c, n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + unit, x, y + 30, 92, '#FFD43B', { lw: 12, shadow: false }); c.restore();
  }
  // a commit grid (the GitHub-style heatmap, in 黑哥黄: never green): days × hours, with an empty band from hour h0 to h1
  function commitGrid(c, t, t0, t1, h0, h1, emptyAt) {
    if (t < t0 || t > t1) return; const a = fadeIO(t, t0, t1, .22), x = 380, y = 170, cw = 46, ch = 46;
    c.save(); c.globalAlpha = a; panel(c, x - 40, y - 90, 1240, 640); outlined(c, '提交记录 · 昨天', x + 580, y - 40, 42, '#FFD43B', { lw: 6, shadow: false });
    for (let hr = 0; hr < 24; hr++) for (let d = 0; d < 7; d++) { const empty = d === 6 && hr >= h0 && hr < h1, v = empty ? 0 : hh(hr, d) < .25 ? 0 : 1 + Math.floor(hh(hr, d + 9) * 3);
      c.fillStyle = v === 0 ? '#2A2638' : ['#2A2638', '#7A5E1E', '#C8962A', '#FFD43B'][v]; c.fillRect(x + hr * cw, y + d * ch * 1.1, cw - 8, ch - 8); }
    for (const hr of [0, 6, 12, 18, 23]) outlined(c, `${hr}点`, x + hr * cw + 19, y + 7 * ch * 1.1 + 24, 26, '#C8C0E0', { lw: 0, shadow: false });
    if (t > emptyAt) { const k = seg01(t, emptyAt, emptyAt + .25), bx = x + h0 * cw - 6, by = y + 6 * ch * 1.1 - 6; c.strokeStyle = '#E83A44'; c.lineWidth = 8; c.globalAlpha = a * k; c.strokeRect(bx, by, (h1 - h0) * cw + 4, ch + 4);
      outlined(c, '0 次提交', bx + (h1 - h0) * cw / 2, by + ch + 70, 52, '#FF6A5A', { lw: 8 }); }
    c.restore();
  }

  // ======================================================================================= lights, the frame
  function lights(t, cam) {
    for (const L of LAMPS) { if (Math.abs(L[0] - cam.x) + Math.abs(L[1] - cam.y) + Math.abs(L[2] - cam.z) > 44) continue; VX.light(L[0] + .5, L[1] + .5, L[2] + .5, L[3], L[4], L[5]); }
    VX.light(PC.x + .5, G + 2.5, PC.z + 1.4, CYAN, 3.5, .8); VX.light(91.5, G + 2.5, DESK2.z + 1.4, CYAN, 3, .6); VX.light(94.5, G + 2.5, DESK2.z + 1.4, CYAN, 3, .6);
    VX.light(CIN.x, G + 3.5, 43, [1, .95, .85], 8, .8); VX.light(LIP.x, G + 3, LIP.z + 1.5, WARM, 4.5, .8); VX.light(BAG.x, G + 3, BAG.z + 1.5, WARM, 4.5, .8);
    VX.light(CAFE.x, G + 3.6, CAFE.z, WARM, 7, .8); VX.light(REG.x, G + 4, 87.5, WARM, 6, .7); VX.light(HOME.x0 + 13, G + 4, 60, WARM, 10, .45);
  }
  function dust(t, cam) { for (let i = 0; i < 70; i++) {   // a few warm motes near the camera (sparse: no fine noise)
    const x = cam.x - 8 + ((hh(i, 1) * 16 + t * .25) % 16 + 16) % 16, z = cam.z - 8 + ((hh(i, 2) * 16 + .3 * Math.sin(t * .4 + i)) % 16 + 16) % 16, y = cam.y - 3 + ((hh(i, 3) * 6 + .2 * Math.sin(t + i)) % 6 + 6) % 6;
    if (VX.at(Math.floor(x), Math.floor(y), Math.floor(z))) continue; VX.pt(x, y, z, .04, [255, 214, 160], true); } }
  const EMPTY = { t0: 0, t1: 1e9, keys: [K(0, [104, G + 8, 82], [104, G + 2, 60], 62)] };
  const shotAt = t => S.find(s => t >= s.t0 && t < s.t1) || S[S.length - 1] || EMPTY;
  const val = (v, t) => typeof v === 'function' ? v(t) : v;
  function camera(t) {
    const s = shotAt(t), c = along(s.keys, t), kicks = s.kicks || [];
    const hit = kicks.reduce((m, [t0, a]) => Math.max(m, t >= t0 ? a * Math.exp(-(t - t0) * 7) : 0), 0);
    const f = Math.floor(t * 24), sh = hit * .06;
    c.p[0] += .03 * Math.sin(t * 1.3) + (hh(f) - .5) * sh; c.p[1] += .02 * Math.sin(t * 1.7 + 1) + (hh(f, 3) - .5) * sh;
    const L = look(c.p, c.q);
    return { x: c.p[0], y: c.p[1], z: c.p[2], yaw: L.yaw + .004 * Math.sin(t * .9), pitch: L.pitch, fov: c.fov - hit * 3, roll: .006 * Math.sin(t * .7) };
  }
  let BR = null;
  function post(c, t) {
    if (!BR) { BR = document.createElement('canvas'); BR.width = PW; BR.height = PH; }
    const bx = BR.getContext('2d'), id = bx.createImageData(PW, PH);
    for (let i = 0; i < PW * PH * 4; i += 4) { const l = BUF[i] * .3 + BUF[i + 1] * .55 + BUF[i + 2] * .15, k = clamp01((l - 150) / 90); id.data[i] = BUF[i] * k; id.data[i + 1] = BUF[i + 1] * k; id.data[i + 2] = BUF[i + 2] * k; id.data[i + 3] = 255; }
    bx.putImageData(id, 0, 0);
    c.save(); c.globalCompositeOperation = 'lighter'; c.imageSmoothingEnabled = true; c.filter = 'blur(22px)'; c.globalAlpha = .55; c.drawImage(BR, 0, 0, 1920, 1080); c.filter = 'blur(6px)'; c.globalAlpha = .25; c.drawImage(BR, 0, 0, 1920, 1080); c.restore();
    const g = c.createRadialGradient(960, 540, 420, 960, 540, 1150); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(10,6,14,.5)'); c.fillStyle = g; c.fillRect(0, 0, 1920, 1080);
    for (const [t0, col, a] of FLASH) { const k = t >= t0 ? Math.exp(-(t - t0) * 9) * a : 0; if (k > .01) { c.fillStyle = `rgba(${col},${k})`; c.fillRect(0, 0, 1920, 1080); } }
  }
  function greenGuard(c) {
    const im = c.getImageData(0, 0, 1920, 1080), d = im.data; let n = 0;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b), dd = mx - mn;
      if (g !== mx || dd < 30 || mx < 45) continue;
      const h = 60 * ((b - r) / dd + 2); if (h < 80 || h > 160) continue;
      const y = r * .3 + g * .55 + b * .15; d[i] = d[i + 1] = d[i + 2] = y; n++;
    }
    if (n) c.putImageData(im, 0, 0);
  }

  const LOOP = t => {
    if (!BUILT) buildWorld();
    VX.setMip(1.5);
    TAGS.length = 0; BUBS.length = 0; LBLS.length = 0;
    const cam = camera(t), s = shotAt(t);
    VX.setDay(val(s.day ?? DUSK, t));
    VX.setMoonDir([-.7, .35, .55]);
    VX.frame(t, cam);
    if (s.pre) s.pre(t);
    lights(t, cam);
    if (s.lights) s.lights(t, cam);
    s.act && s.act(t);
    dust(t, cam);
    const f = val(s.fog, t) || [30, 90]; VX.setFog(f[0], f[1]);
    VX.draw();
  };
  LOOP.res = [320, 180]; LOOP.px = 6; LOOP.len = DD.len;
  LOOP.overlay = (c, t) => {
    post(c, t);
    worldText(c);
    const s = shotAt(t); s.ui && s.ui(c, t);
    subtitle(c, t);
    greenGuard(c);
  };
  LOOPS.pxNvyou = LOOP;

  // ======================================================================================= everything the chunk files use
  window.NV = {
    B, G, VX, clamp01, sm, seg01, lerp, hh, DD, sfx, edit, flash,
    HOME, BEDR, BED, LIV, PC, SOFA, STUDY, DESK2, LIP, BAG, NET, QUEUE, CIN, CAFE, SRV, REG, KIN, RACKS, AMBER, CYAN, PINK, WARM, DUSK, NIGHT,
    tag, heige, gf, ppl, kid, clawd, prop, propImg, burst, heartsUp, coinsUp, firework,
    K, shot, S, bubble, label, F, P, LS, LE, A, AT,
    FONT, guiWin, outlined, fadeIO, slam, pow, floatTxt, label2, panel, icon, toast, titleCard, questionCard, hhmm, clockUI, tagUI, dayCounter, dream,
    bossBar, levelUI, timerUI, cold, crossOut, stamp, iconPop, phoneChat, termWin, tradeWin, banScreen, heartsUI, counterUI, commitGrid,
  };
})();
