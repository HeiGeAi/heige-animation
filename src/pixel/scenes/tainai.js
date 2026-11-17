// scenes/tainai.js: V075「骗AI说我是80岁太奶，它居然不打官腔了！」（2026-11-17）
// 专属于黑哥的「我的世界大电影」宏大混合宇宙（7 大跨次元电影片场 + 3D 锚定巨幕嵌真实来源截图 + 480×270 抗莫尔纹精细体素）
// 分段镜头位于 tainai_a.js .. tainai_e.js，由 pixel.html 顺序挂载至 LOOPS.pxTainai。
(() => {
  const { B } = VX;
  const G = 12;
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const sm = v => { v = clamp01(v); return v * v * (3 - 2 * v); };
  const seg01 = (t, a, b) => clamp01((t - a) / Math.max(1e-4, b - a));
  const lerp = (a, b, k) => a + (b - a) * k;
  const hh = (a, b = 0) => { const v = Math.sin(a * 91.3 + b * 47.7 + 13.1) * 43758.5453; return v - Math.floor(v); };

  const D = window.TAINAI_DATA || { cues: [], keys: [], marks: {}, len: 408.32, lines: [] };
  const SFX = window.TAINAI_SFX = [];
  const sfx = (t, name, db = -12) => SFX.push([+Math.max(0, t).toFixed(3), name, db]);

  // 加载真实世界证据图片（已脱敏裁边、0 绿像素内联 Data URI）
  const IMG = {};
  for (const [k, src] of Object.entries(window.TAINAI_IMG || {})) {
    const im = document.createElement('img');
    im.src = src;
    im.style.display = 'none';
    document.body.appendChild(im);
    IMG[k] = im;
  }

  // ======================================================================================= 调色与精确词级时间查找
  const AMBER = [1, .72, .40], WARM = [1, .80, .54], ALARM = [1, .28, .28], ICE = [.46, .74, 1], ROSE = [1, .52, .72];
  const DUSK = .34, NIGHT = .15, DAY = .58, GOLDEN = .44;
  const FONT = '"HarmonyOS Sans SC","PingFang SC","Microsoft YaHei",system-ui,sans-serif';

  const MISS = window.TAINAI_MISS = [];
  function findAt(phrase, end = false, nth = 0) {
    const clean = phrase.replace(/[，。！？、：“”「」《》\s]/g, '').replace(/他妈/g, '他喵');
    let seen = 0;
    for (const L of (D.lines || [])) {
      let from = 0, idx;
      while ((idx = L.w.indexOf(clean, from)) >= 0) {
        if (seen === nth) {
          if (!end) return L.t[Math.min(idx, L.t.length - 1)] ?? L.s;
          const ei = idx + clean.length - 1;
          return (L.t[Math.min(ei, L.t.length - 1)] ?? L.e) + .08;
        }
        seen++;
        from = idx + 1;
      }
    }
    MISS.push(phrase);
    return 0;
  }
  const P = (phrase, off = 0, nth = 0) => Math.max(0, findAt(phrase, false, nth) + off);
  const A = (phrase, off = -.12, nth = 0) => Math.max(0, findAt(phrase, false, nth) + off);
  const AT = (phrase, off = 0, nth = 0) => Math.max(0, findAt(phrase, false, nth) + off);
  const PE = (phrase, off = 0, nth = 0) => Math.max(0, findAt(phrase, true, nth) + off);
  const LS = i => (D.lines[i] ? D.lines[i].s : 0);
  const LE = i => (D.lines[i] ? D.lines[i].e : 0);

  // ======================================================================================= 七大跨次元电影片场坐标
  const PLAZA   = { x0: 46, x1: 164, z0: 26, z1: 114 };
  const GRANDMA = { x: 66, z: 46, scrZ: 36 };    // 片场1：太奶暖炕小院 × 京沪双塔量子星门 × 露天巨幕
  const BLVD    = { x: 104, z: 92, archZ: 82 };  // 片场2：黑哥大电影主城星光大道（HEIGE 金门巨塔 + 四段位星门）
  const TOWER   = { x: 104, z: 46, elevX: 110 }; // 片场3：摩天公文牢笼 × 16层现代玻璃观光电梯井
  const CAFE    = { x: 142, z: 48, obsZ: 37 };   // 片场4：霓虹街头三万块咖啡餐车 × 赛博验尸天文台
  const ARENA   = { x: 70, z: 82, wallX: 70 };   // 片场5：原窗回音室 × 跨窗口双子塔包公审判台
  const COURT   = { x: 140, z: 84, benchZ: 75 }; // 片场6：关门健身房街角 × 威严最高审判大厅

  // ======================================================================================= 14 款定制低频零绿抗莫尔纹电影方块
  const blkH = (u, v, s = 0) => { const n = Math.sin(u * 127.1 + v * 311.7 + s * 74.7) * 43758.5453; return n - Math.floor(n); };
  VX.defBlock('tnPlaza', {
    side: (u, v) => (u === 0 || v === 0) ? '#46445A' : (u === 1 || v === 1) ? '#686680' : ((u >> 3) ^ (v >> 3)) & 1 ? '#5A5870' : '#535168',
  });
  VX.defBlock('tnRoad', {
    top: (u, v) => (u === 0 || u === 15) ? '#5A5872' : (u === 1 || u === 14) ? '#242236' : (u >= 7 && u <= 8 && v >= 2 && v <= 10) ? '#E2B24A' : blkH(u, v, 3) < .14 ? '#3A384E' : '#323044',
    side: (u, v) => v < 3 ? '#5A5872' : '#2A283C',
  });
  VX.defBlock('tnCable', {
    top: (u, v) => (v >= 6 && v <= 9) ? ((u % 4 < 2) ? '#72C9FE' : '#4A8ED4') : (u === 0 || v === 0) ? '#222438' : '#32364E',
    side: () => '#2A2C40',
    emit: .46,
  });
  VX.defBlock('tnKang', {
    side: (u, v) => (v % 4 === 0 || ((u + (v >> 2) * 4) % 8 === 0)) ? '#6E2E22' : blkH(u >> 1, v >> 1, 5) < .4 ? '#B8523A' : '#A44630',
    top: (u, v) => (u === 0 || v === 0 || u === 15 || v === 15) ? '#7A3426' : '#D88A52',
  });
  VX.defBlock('tnMarble', {
    side: (u, v) => (u === 0 || u === 15) ? '#C8B89E' : (v <= 1 || v >= 14) ? '#F4ECE0' : (u % 4 === 0 ? '#D6C8B0' : '#EAE0CC'),
    top: () => '#F4ECE0',
    emit: .10,
  });
  VX.defBlock('tnGoldTrim', {
    side: (u, v) => (u === 0 || v === 0) ? '#FFF2B8' : (u === 15 || v === 15) ? '#B87A1E' : ((u + v) % 6 === 0 ? '#FFE27A' : '#F2C14E'),
    emit: .62,
  });
  VX.defBlock('tnGlassElev', {
    side: (u, v) => (u === 0 || v === 0 || u === 15 || v === 15) ? '#1E263C' : ((u + v) % 7 === 0 ? '#9AD0FF' : '#3E6CB0'),
    emit: .30,
  });
  VX.defBlock('tnNeonPink', {
    side: (u, v) => (u === 0 || v === 0 || u === 15 || v === 15) ? '#6A1E3E' : '#FF78A8',
    emit: .85,
  });
  VX.defBlock('tnSkyWarm', {
    side: (u, v) => {
      if (u % 5 === 0 || v % 5 === 0) return '#161428';
      const r = blkH(Math.floor(u / 5), Math.floor(v / 5), 11);
      return r < .34 ? '#EAA84C' : r < .50 ? '#FFD478' : '#24223C';
    },
    top: () => '#1C1A30',
    emit: .40,
  });
  VX.defBlock('tnSkyBlue', {
    side: (u, v) => {
      if (u % 5 === 0 || v % 5 === 0) return '#14182C';
      const r = blkH(Math.floor(u / 5), Math.floor(v / 5), 23);
      return r < .36 ? '#548CD0' : r < .50 ? '#78B6F2' : '#20263E';
    },
    top: () => '#1C2036',
    emit: .36,
  });
  VX.defBlock('tnRoof', {
    side: (u, v) => v % 4 === 0 ? '#181428' : '#2C2448',
    top: (u, v) => (u % 4 === 0 || v % 4 === 0) ? '#201A34' : '#322A50',
  });
  VX.defBlock('tnLeafGold', {
    side: (u, v) => { const r = blkH(u >> 1, v >> 1, 19); return r < .3 ? '#9E541E' : r < .7 ? '#C8782C' : '#EAA248'; },
  });
  VX.defBlock('tnLeafRose', {
    side: (u, v) => { const r = blkH(u >> 1, v >> 1, 29); return r < .3 ? '#8E3856' : r < .7 ? '#C4587A' : '#EA82A2'; },
  });
  VX.defBlock('tnWarn', {
    side: (u, v) => ((u + v) >> 2) % 2 ? '#E29E36' : '#201C2E',
  });

  const BLK = {
    goldSoft: B.goldblk,
    crimsonSoft: B.wred,
    indigoWall: B.deep,
    steelSoft: B.iron,
    sandSoft: B.sand,
    darkDesk: B.log,
  };
  const resolveBlk = nm => (nm ? (B[nm] ?? BLK[nm] ?? 0) : 0);
  const VXE = [];
  const edit = (t, x, y, z, name = 0) => VXE.push([t, x, y, z, name]);
  const fillEdit = (t, x0, y0, z0, x1, y1, z1, name = 0) => {
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) edit(t, x, y, z, name);
  };

  const LAMPS = [];
  function putLamp(x, y, z, col = AMBER, rad = 8, inten = 1.1) {
    const baseY = Math.max(G + 1, y - 2);
    VX.set(x, baseY, z, B.iron);
    for (let yy = baseY + 1; yy < y; yy++) VX.set(x, yy, z, B.log);
    VX.set(x, y, z, B.lamp);
    VX.set(x, y + 1, z, B.obsidian);
    LAMPS.push([x, y, z, col, rad, inten]);
  }
  function putTree(x, z, rose = false) {
    const lf = rose ? B.tnLeafRose : B.tnLeafGold;
    VX.fill(x, G + 1, z, x, G + 3, z, B.log);
    VX.fill(x - 2, G + 4, z - 2, x + 2, G + 4, z + 2, lf);
    VX.fill(x - 1, G + 5, z - 1, x + 1, G + 6, z + 1, lf);
    VX.set(x - 2, G + 4, z - 2, 0); VX.set(x + 2, G + 4, z - 2, 0);
    VX.set(x - 2, G + 4, z + 2, 0); VX.set(x + 2, G + 4, z + 2, 0);
  }
  function putTower(x, z, w, d, h, kind = 'warm') {
    const win = kind === 'blue' ? B.tnSkyBlue : B.tnSkyWarm;
    const topY = Math.min(VX.SY - 3, G + h);
    VX.fill(x, G + 1, z, x + w - 1, G + 3, z + d - 1, B.obsidian);
    VX.fill(x, G + 4, z, x + w - 1, topY - 2, z + d - 1, win);
    VX.fill(x + 1, topY - 1, z + 1, x + w - 2, topY, z + d - 2, B.tnRoof);
    VX.set(x + Math.floor(w / 2), topY + 1, z + Math.floor(d / 2), kind === 'blue' ? B.lamp : B.redlamp);
  }

  let BUILT = false;
  function buildWorld() {
    VX.reset();
    VX.setMip(1.25);
    LAMPS.length = 0;

    // 1. 宏大电影地形基底 + 远景大都会摩天群山天际线
    const rectD = (x, z) => Math.hypot(Math.max(PLAZA.x0 - x, 0, x - PLAZA.x1), Math.max(PLAZA.z0 - z, 0, z - PLAZA.z1));
    for (let x = 0; x < VX.SX; x++) for (let z = 0; z < VX.SZ; z++) {
      const far = clamp01((rectD(x, z) - 2) / 28);
      const n = 3.0 * Math.sin(x * .05 + .4) + 2.6 * Math.cos(z * .05 + 1.1) + 3.6 * Math.max(0, Math.sin(x * .04 - z * .03));
      const h = Math.min(30, G + Math.round(Math.max(0, n + 2) * far * 1.6));
      for (let y = 0; y <= h; y++) {
        VX.set(x, y, z, y === 0 ? B.bedrock : y > G && y === h ? B.terra2 : y < G ? B.deep : (far > 0 ? B.stoneSoft : B.tnPlaza));
      }
    }

    // 环绕黑哥大电影世界的宏伟天际线巨塔
    [
      [14, 6, 9, 8, 22, 'warm'], [28, 5, 10, 8, 26, 'blue'], [44, 7, 8, 7, 19, 'warm'],
      [60, 6, 9, 7, 23, 'blue'], [78, 5, 10, 8, 25, 'warm'], [98, 4, 12, 8, 27, 'blue'],
      [118, 6, 9, 8, 24, 'warm'], [136, 5, 10, 8, 22, 'blue'], [154, 6, 9, 7, 25, 'warm'],
      [172, 8, 9, 8, 21, 'blue'], [188, 10, 8, 8, 18, 'warm'],
      [12, 32, 8, 8, 20, 'blue'], [14, 56, 8, 8, 18, 'warm'], [12, 82, 9, 8, 22, 'blue'],
      [182, 34, 9, 8, 21, 'warm'], [184, 60, 8, 8, 24, 'blue'], [182, 86, 9, 8, 19, 'warm'],
      [24, 120, 9, 7, 16, 'warm'], [168, 120, 9, 7, 17, 'blue'],
    ].forEach(t => putTower(...t));

    // 电影星光主干道与发光光纤网
    VX.fill(50, G, 64, 160, G, 68, B.tnRoad);
    VX.fill(101, G, 30, 107, G, 110, B.tnRoad);
    for (let x = 56; x <= 156; x++) VX.set(x, G, 63, B.tnCable);
    for (let z = 34; z <= 104; z++) VX.set(100, G, z, B.tnCable);

    // 金秋与樱粉景观树阵（严格零绿）
    [
      [51, 34, false], [51, 58, true], [51, 74, false], [51, 102, true],
      [88, 60, true], [120, 60, false], [88, 98, false], [120, 98, true],
      [160, 34, true], [160, 60, false], [160, 98, true],
    ].forEach(t => putTree(...t));

    // ========================================================================= 片场1 GRANDMA：太奶暖炕小院 × 京沪双塔 × 露天电影巨幕 × 官话出口拱门
    VX.fill(56, G, 34, 78, G, 54, B.plankSoft);
    // 后方露天 IMAX 巨幕金框 (x=60..74, y=G+2..G+10, z=36)
    VX.fill(60, G + 1, 36, 74, G + 11, 36, B.obsidian);
    VX.fill(61, G + 2, 36, 73, G + 10, 36, B.tnGoldTrim);
    VX.fill(62, G + 3, 36, 72, G + 9, 36, B.box);
    // 后置太奶红砖暖炕（高度1格且后置在 z=41..43，绝不遮挡前方 z=45..47 演员全身）
    VX.fill(57, G + 1, 41, 61, G + 1, 43, B.tnKang);
    VX.fill(57, G + 1, 40, 61, G + 5, 40, B.plankSoft);
    VX.fill(56, G + 6, 39, 62, G + 6, 42, B.tnRoof);
    // 雄伟高耸北京红金钟楼双层塔 (x=60..63, z=39..41, 顶高 G+9 + 金顶G+10)
    VX.fill(60, G + 1, 39, 63, G + 5, 41, B.wred);
    VX.fill(59, G + 6, 38, 64, G + 6, 42, B.tnGoldTrim);
    VX.fill(61, G + 7, 39, 62, G + 8, 41, B.wred);
    VX.fill(61, G + 9, 40, 62, G + 9, 40, B.tnGoldTrim);
    VX.set(61, G + 10, 40, B.lamp);
    // 雄伟高耸上海冰蓝东方明珠晶塔 (x=71..74, z=39..41, 顶高 G+10 + 紫晶G+11)
    VX.fill(71, G + 1, 39, 74, G + 6, 41, B.tnGlassElev);
    VX.fill(71, G + 7, 39, 74, G + 8, 41, B.wblue);
    VX.fill(72, G + 9, 40, 73, G + 10, 40, B.amethyst);
    VX.set(72, G + 11, 40, B.lamp);
    // 左侧「官话套话出口」拱门 (x=57..59, z=44)：S09 时黄金砖轰然封死！
    VX.fill(56, G + 1, 44, 56, G + 5, 44, B.obsidian);
    VX.fill(60, G + 1, 44, 60, G + 5, 44, B.obsidian);
    VX.fill(56, G + 5, 44, 60, G + 5, 44, B.redlamp);
    putLamp(56, G + 4, 49, WARM, 9, 1.2);
    putLamp(76, G + 4, 49, AMBER, 9, 1.15);

    // ========================================================================= 片场2 BLVD：黑哥大电影主城金门巨殿 (HEIGE STUDIO ARCH，丝绒暗底防噪声)
    VX.fill(92, G, 80, 116, G, 102, B.tnPlaza);
    VX.fill(94, G, 82, 114, G, 100, B.wred); // 星光红毯大道
    VX.fill(94, G + 1, 82, 97, G + 13, 84, B.obsidian);
    VX.fill(111, G + 1, 82, 114, G + 13, 84, B.obsidian);
    VX.fill(95, G + 2, 82, 96, G + 12, 84, B.tnGoldTrim);
    VX.fill(112, G + 2, 82, 113, G + 12, 84, B.tnGoldTrim);
    VX.fill(94, G + 12, 82, 114, G + 14, 84, B.obsidian);
    VX.fill(96, G + 13, 82, 112, G + 13, 82, B.tnGoldTrim);
    VX.fill(98, G + 3, 83, 110, G + 11, 83, B.deep); // 冷静深靛电影巨幕墙（不晃眼无摩尔纹）
    VX.fill(99, G + 10, 83, 109, G + 11, 83, B.tnSkyWarm);
    for (const [i, tx] of [[0, 96], [1, 101], [2, 107], [3, 112]]) {
      VX.fill(tx - 1, G + 1, 86, tx + 1, G + 1, 87, i === 3 ? B.wred : B.tnGoldTrim);
    }
    putLamp(92, G + 4, 94, WARM, 10, 1.25);
    putLamp(116, G + 4, 94, WARM, 10, 1.25);

    // ========================================================================= 片场3 TOWER：摩天写字楼公文区 × 16层现代全景剖面观光电梯井
    VX.fill(92, G, 36, 119, G, 56, B.tnPlaza);
    VX.fill(94, G + 1, 39, 104, G + 9, 39, B.deep);
    VX.fill(95, G + 2, 39, 103, G + 7, 39, B.tnGlassElev);
    VX.fill(96, G + 1, 42, 101, G + 1, 42, B.plankSoft);
    VX.set(98, G + 2, 42, B.monitor);
    // 右：16层现代全景剖面电梯井（深色 obsidian + 金边导轨，绝不使用铁栏杆！）
    VX.fill(108, G + 1, 40, 113, G + 17, 40, B.obsidian);
    VX.fill(109, G + 2, 41, 112, G + 16, 41, B.tnGlassElev);
    for (const ex of [108, 113]) VX.fill(ex, G + 1, 40, ex, G + 17, 43, B.obsidian);
    for (let yy = G + 2; yy <= G + 16; yy += 2) { VX.set(108, yy, 43, B.tnGoldTrim); VX.set(113, yy, 43, B.tnGoldTrim); }
    VX.fill(108, G + 17, 40, 113, G + 18, 43, B.tnGoldTrim);
    // 隔壁豆包蓝光传送门舱 (x=115..117, z=42)
    VX.fill(115, G + 1, 41, 117, G + 6, 42, B.wblue);
    VX.fill(116, G + 2, 42, 116, G + 4, 42, B.portal);
    putLamp(94, G + 4, 51, ICE, 8, 1.05);
    putLamp(115, G + 4, 51, WARM, 9, 1.15);

    // ========================================================================= 片场4 CAFE：写字楼商圈摩天楼下的三万块咖啡餐车 × 赛博天文台
    VX.fill(128, G, 34, 158, G, 58, B.plankSoft);
    putTower(128, 34, 6, 6, 20, 'warm'); // 写字楼左塔
    putTower(151, 34, 6, 6, 22, 'blue'); // 写字楼右塔
    VX.fill(135, G + 1, 36, 149, G + 10, 36, B.obsidian);
    VX.fill(136, G + 2, 36, 148, G + 9, 36, B.bannerBlue);
    VX.fill(135, G + 10, 36, 149, G + 10, 36, B.tnGoldTrim);
    // 现代街头霓虹咖啡餐车（深色黑板菜单吧台防过曝 + 霓虹粉车顶 + 黄金咖啡杯雕塑）
    VX.set(138, G + 1, 46, B.obsidian); VX.set(145, G + 1, 46, B.obsidian);
    VX.fill(137, G + 2, 43, 146, G + 5, 46, B.terra);
    VX.fill(139, G + 3, 46, 144, G + 4, 46, B.obsidian);
    VX.set(140, G + 3, 46, B.lamp); VX.set(143, G + 3, 46, B.monitor);
    VX.fill(137, G + 6, 43, 146, G + 6, 47, B.tnNeonPink);
    VX.fill(140, G + 7, 44, 143, G + 8, 45, B.tnGoldTrim);
    for (const px of [138, 141, 144]) VX.fill(px - 1, G, 48, px + 1, G, 50, B.tnWarn);
    putLamp(131, G + 4, 53, ROSE, 9, 1.05);
    putLamp(153, G + 4, 53, WARM, 9, 1.05);

    // ========================================================================= 片场5 ARENA：原窗回音室 × 跨窗口双子塔审判竞技场
    VX.fill(54, G, 70, 88, G, 96, B.tnPlaza);
    VX.fill(58, G + 1, 74, 65, G + 8, 78, B.deep);
    VX.fill(59, G + 2, 78, 64, G + 6, 78, B.codeSoft);
    VX.fill(58, G + 9, 74, 65, G + 9, 78, B.wblue);
    VX.fill(66, G + 4, 76, 74, G + 4, 77, B.tnCable);
    VX.fill(70, G + 1, 73, 70, G + 2, 85, B.tnWarn);
    VX.fill(75, G + 1, 74, 83, G + 9, 78, B.obsidian);
    VX.fill(76, G + 2, 78, 82, G + 7, 78, B.tnGoldTrim);
    VX.set(79, G + 10, 76, B.lamp);
    putLamp(56, G + 4, 88, ICE, 9, 1.1);
    putLamp(85, G + 4, 88, AMBER, 9, 1.2);

    // ========================================================================= 片场6 COURT：跑路健身房街角（无铁栏杆）× 威严最高审判大厅
    VX.fill(122, G + 1, 83, 129, G + 6, 86, B.brickSoft);
    VX.fill(124, G + 1, 86, 127, G + 4, 86, B.obsidian); // 深色卷帘门
    VX.set(125, G + 2, 86, B.tnWarn); VX.set(126, G + 2, 86, B.tnWarn); // 封条 X
    VX.fill(123, G + 5, 86, 128, G + 5, 86, B.tnWarn);
    VX.fill(132, G, 72, 154, G, 94, B.wred);
    VX.fill(132, G + 1, 72, 154, G + 12, 73, B.tnMarble);
    for (const cx of [133, 137, 149, 153]) VX.fill(cx, G + 1, 74, cx, G + 11, 74, B.tnMarble);
    VX.fill(132, G + 12, 72, 154, G + 13, 76, B.tnRoof);
    VX.fill(135, G + 11, 74, 151, G + 11, 74, B.tnGoldTrim);
    VX.fill(139, G + 1, 75, 147, G + 2, 77, B.plankSoft);
    VX.fill(141, G + 2, 77, 145, G + 2, 77, B.tnGoldTrim);
    VX.set(143, G + 9, 73, B.tnGoldTrim);
    VX.fill(135, G + 1, 84, 137, G + 1, 86, B.plankSoft);
    VX.fill(149, G + 1, 84, 151, G + 1, 86, B.plankSoft);
    putLamp(134, G + 4, 89, WARM, 10, 1.15);
    putLamp(152, G + 4, 89, WARM, 10, 1.15);

    for (const [t, x, y, z, nm] of VXE) VX.edit(t, x, y, z, resolveBlk(nm));
    BUILT = true;
  }

  // ======================================================================================= 电影级角色阵容与道具系统
  const TAGS = [], BUBS = [], LBLS = [];
  const bubble = (x, y, z, txt, t, t0, t1) => { if (t >= t0 && t < t1) BUBS.push([x, y, z, txt, t - t0, t1 - t]); };
  const label = (x, y, z, txt, size, col, t, t0, t1 = 1e9) => { if (t >= t0 && t < t1) LBLS.push([x, y, z, txt, size, col, t - t0, t1 - t]); };

  const hgImg = o => VX.capture((x, y) => heigePx(x, y, { ...o, noShadow: true }));
  function heige(x, y, z, o = {}, ex = {}) {
    const sc = ex.k ?? (1.75 / 87);
    VX.sprite(hgImg(o), x, y + (ex.dy || 0), z, { k: ex.k, flip: !!o.flip });
    if (!ex.noShadow) VX.shadow(x, y, z, .44);
    if (ex.tag) TAGS.push([x, y + 108 * sc, z, ex.tag, ex.tagCol || '#FFD43B']);
  }
  const clImg = o => VX.capture((x, y) => clawdPx(x, y, { ...o, noShadow: true }));
  function clawd(x, y, z, o = {}, ex = {}) {
    const sc = ex.k ?? .017;
    VX.sprite(clImg(o), x, y + (ex.dy || 0), z, { k: sc });
    if (!ex.noShadow) VX.shadow(x, y, z, .36);
    if (ex.tag !== false) TAGS.push([x, y + 96 * sc, z, ex.tag || 'Claude', ex.tagCol || '#FFA882']);
  }
  const modCache = new Map();
  function modelImg(name, emo = 'happy', ph = 0) {
    const key = [name, emo, ph].join('|');
    if (modCache.has(key)) return modCache.get(key);
    const o = { ...feel(emo, ph * .18), noShadow: true };
    const img = VX.capture((x, y) => modelPx(name, x, y, o), 170, 170, 85, 160);
    modCache.set(key, img);
    return img;
  }
  function model(name, x, y, z, emo = 'happy', t = 0, ex = {}) {
    const ph = Math.floor(t * 4) % 4, sc = ex.k ?? .022;
    VX.sprite(modelImg(name, emo, ph), x, y + (ex.dy || 0), z, { k: sc, flip: !!ex.flip });
    if (!ex.noShadow) VX.shadow(x, y, z, .46);
    if (ex.tag !== false) {
      const nmMap = { deepseek: 'DeepSeek', doubao: '豆包', kimi: 'Kimi', gpt: 'ChatGPT', qianwen: '千问', gemini: 'Gemini' };
      const defNm = nmMap[name] || name.toUpperCase();
      TAGS.push([x, y + 108 * sc, z, ex.tag || defNm, ex.tagCol || (name === 'deepseek' ? '#9DB4FF' : name === 'kimi' ? '#E4B8FF' : '#72C9FE')]);
    }
  }

  // 定制电影配角：80岁老太奶、法官、代理律师、助理、老板、打工人
  const PC = {
    太奶: { c1: '#B8423A', c2: '#8E2E28', hair: '#E6E4EC', glasses: true, bun: true, shawl: '#E2A84C' },
    法官: { c1: '#1E1A2C', c2: '#141020', hair: '#383446', tie: '#E83A44', robe: true },
    律师: { c1: '#385284', c2: '#283C64', hair: '#221C2A', tie: '#D8A84E', glasses: true },
    助理: { c1: '#5C647C', c2: '#444C60', hair: '#262030' },
    老板: { c1: '#262038', c2: '#181426', hair: '#241E2C', tie: '#E83A44' },
    老员工: { c1: '#4A628A', c2: '#364A6A', hair: '#282230', tie: '#72C9FE' },
    好学生: { c1: '#EDE4D2', c2: '#CFC4B0', hair: '#26202C', glasses: true },
  };
  const pplCache = new Map();
  function pplImg(role, mood = 'neutral', ph = 0) {
    const key = [role, mood, ph].join('|');
    if (pplCache.has(key)) return pplCache.get(key);
    const R = PC[role] || PC.老员工, s = new Spr(), H = -90, SK = '#E8BE9E', SKD = '#CA9E7C', D = '#241616';
    const step = (mood === 'walk' && ph % 2) ? 3 : 0;
    s.rect(-10, -16 + step, 8, 12, '#221E2E').rect(2, -16 - step, 8, 12, '#181422');
    s.rect(-11, -5 + step, 9, 5, '#12101A').rect(2, -5 - step, 9, 5, '#12101A');
    s.rect(-14, -56, 28, 40, R.c1).rect(6, -56, 8, 40, R.c2).rect(-16, -50, 32, 8, R.shawl || R.c2).rect(-6, -56, 12, 8, SK);
    if (R.robe) s.rect(-15, -56, 30, 46, '#1A1628').rect(-3, -54, 6, 18, '#E83A44').rect(-6, -56, 12, 4, '#F4ECE0');
    else s.rect(-4, -54, 8, 13, '#F4EFE6');
    if (R.tie) s.rect(-2, -51, 4, 20, R.tie);
    if (R.shawl) s.rect(-15, -54, 30, 10, R.shawl).rect(-5, -44, 10, 8, R.shawl);
    if (mood === 'point') s.rect(-20, -50, 6, 18, R.c1).rect(14, -54, 15, 7, R.c1).rect(27, -54, 4, 6, SK);
    else if (mood === 'panic' || mood === 'cheer') s.rect(-20, -68, 6, 20, R.c1).rect(14, -68, 6, 20, R.c2).rect(-20, -72, 6, 4, SK).rect(14, -72, 6, 4, SKD);
    else { const sw = mood === 'walk' ? (ph % 2 ? 4 : -4) : 0; s.rect(-19, -50 + sw, 5, 20, R.c1).rect(14, -50 - sw, 5, 20, R.c2); }
    s.rect(-12, H, 24, 34, SK).rect(6, H, 6, 34, SKD).rect(-12, H, 24, 8, R.hair).rect(-13, H + 2, 2, 12, R.hair).rect(11, H + 2, 2, 12, R.hair);
    if (R.bun) s.ell(0, H - 5, 8, 6, '#E6E4EC').rect(-6, H - 4, 12, 2, '#D89C2A'); // 太奶银发发髻与金簪
    const ey = H + 15;
    if (mood === 'panic' || mood === 'shock') s.rect(-10, ey - 1, 6, 6, '#FFFFFF').rect(4, ey - 1, 6, 6, '#FFFFFF').rect(-8, ey + 1, 2, 2, D).rect(6, ey + 1, 2, 2, D);
    else if (mood === 'happy' || mood === 'cheer') s.rect(-9, ey + 1, 5, 2, D).rect(4, ey + 1, 5, 2, D);
    else s.rect(-9, ey, 5, 4, '#FFFFFF').rect(4, ey, 5, 4, '#FFFFFF').rect(-6, ey + 1, 2, 3, D).rect(5, ey + 1, 2, 3, D);
    if (R.glasses) s.rect(-11, ey - 2, 9, 1, '#D89C2A').rect(2, ey - 2, 9, 1, '#D89C2A').rect(-11, ey + 4, 9, 1, '#D89C2A').rect(2, ey + 4, 9, 1, '#D89C2A').rect(-2, ey, 4, 1, '#D89C2A');
    const my = H + 28;
    if (mood === 'happy' || mood === 'cheer') s.rect(-5, my, 10, 2, '#7A3028');
    else if (mood === 'angry' || mood === 'panic' || (mood === 'talk' && ph % 2)) s.rect(-4, my - 1, 8, 4, '#7A3028');
    else s.rect(-4, my, 8, 1, '#7A3028');
    s.outline('#160E14');
    const img = VX.capture((x, y) => s.draw(x, y), 80, 128, 40, 118);
    pplCache.set(key, img);
    return img;
  }
  function ppl(x, y, z, role, mood = 'neutral', t = 0, ex = {}) {
    const walkBob = ex.walk ? -Math.abs(Math.sin(t * 7)) * .07 : 0;
    const sh = ex.shake ? Math.sin(t * 28) * .04 : 0;
    const sc = ex.k ?? (1.75 / 87);
    VX.sprite(pplImg(role, mood, Math.floor(t * 6) % 2), x + sh, y + walkBob + (ex.dy || 0), z, { k: ex.k, flip: !!ex.flip });
    if (!ex.noShadow) VX.shadow(x, y, z, .42);
    if (ex.tag !== false) TAGS.push([x, y + 114 * sc, z, ex.tag || role, ex.tagCol || '#F2E6C8']);
  }

  // 跨次元电影道具库（左右手套、暖棉袄、天书论文、圣旨金卡、皇冠、咖啡杯、断网插头、法槌、金色天平、证据盾牌、炸弹）
  const PROPS = {};
  const mkProp = (fn, w = 52, h = 52, ox = 26, oy = 44) => VX.capture((X, Y) => { const s = new Spr(); fn(s); s.outline('#140A10'); s.draw(X, Y); }, w, h, ox, oy);
  PROPS.gloveL = mkProp(s => { s.rect(-9, -22, 16, 16, '#E84A4A').rect(-9, -8, 16, 5, '#FAF0E4').rect(7, -17, 6, 8, '#E84A4A').rect(-6, -20, 4, 8, '#FF8A8A'); }, 44, 38, 22, 32);
  PROPS.gloveR = mkProp(s => { s.rect(-7, -22, 16, 16, '#4A82E8').rect(-7, -8, 16, 5, '#FAF0E4').rect(-13, -17, 6, 8, '#4A82E8').rect(2, -20, 4, 8, '#92C2FF'); }, 44, 38, 22, 32);
  PROPS.coat   = mkProp(s => { s.rect(-14, -24, 28, 20, '#D85A44').rect(-20, -22, 6, 14, '#B84230').rect(14, -22, 6, 14, '#B84230').rect(-8, -26, 16, 4, '#FAF0E4').rect(-2, -22, 4, 18, '#FFD43B'); }, 52, 38, 26, 32);
  PROPS.tome   = mkProp(s => { s.rect(-11, -24, 22, 20, '#3A2864').rect(-9, -22, 18, 16, '#583E94').rect(-6, -18, 12, 3, '#FFD43B').rect(-6, -12, 9, 2, '#72C9FE'); }, 40, 36, 20, 30);
  PROPS.card5  = mkProp(s => { s.rect(-12, -20, 24, 16, '#D89824').rect(-10, -18, 20, 12, '#FFD43B').rect(-7, -14, 14, 2, '#1A1428').rect(-7, -10, 10, 2, '#1A1428'); }, 40, 32, 20, 26);
  PROPS.crown  = mkProp(s => { s.rect(-12, -12, 24, 8, '#E8A228').rect(-12, -18, 5, 6, '#FFD43B').rect(-3, -20, 6, 8, '#FFD43B').rect(7, -18, 5, 6, '#FFD43B').rect(-1, -15, 3, 3, '#E83A44'); }, 40, 32, 20, 26);
  PROPS.coffee = mkProp(s => { s.rect(-7, -18, 14, 15, '#FAF0E4').rect(-8, -20, 16, 3, '#4A2C1A').rect(-7, -12, 14, 5, '#D8783A').rect(7, -15, 4, 8, '#D8CAB0'); }, 36, 34, 18, 28);
  PROPS.coin   = mkProp(s => { s.ell(0, -11, 10, 10, '#C88424').ell(0, -11, 8, 8, '#FFD43B').rect(-2, -15, 3, 8, '#FFF4C2'); }, 30, 30, 15, 24);
  PROPS.doc    = mkProp(s => { s.rect(-9, -23, 18, 21, '#FAF2E2').rect(-6, -19, 12, 2, '#282238').rect(-6, -14, 12, 2, '#6E6882').rect(-6, -9, 8, 2, '#E83A44'); }, 34, 34, 17, 28);
  PROPS.fakeDoc = mkProp(s => { s.rect(-9, -23, 18, 21, '#FBE4E2').line(-6, -19, 6, -7, '#E83A44').line(6, -19, -6, -7, '#E83A44'); }, 34, 34, 17, 28);
  PROPS.unplug = mkProp(s => { s.rect(-14, -15, 12, 10, '#2A283C').rect(-2, -13, 5, 2, '#D8A84E').rect(-2, -9, 5, 2, '#D8A84E').rect(6, -14, 8, 8, '#E83A44'); }, 44, 30, 22, 24);
  PROPS.gavel  = mkProp(s => { s.rect(-12, -22, 18, 10, '#6E3A20').rect(-13, -22, 3, 10, '#FFD43B').rect(4, -22, 3, 10, '#FFD43B').line(-2, -12, 10, -2, '#8C5230'); }, 44, 36, 22, 30);
  PROPS.scales = mkProp(s => { s.rect(-2, -28, 4, 24, '#FFD43B').rect(-14, -25, 28, 3, '#FFD43B').ell(-12, -14, 6, 4, '#E8A838').ell(12, -14, 6, 4, '#E8A838').rect(-8, -4, 16, 3, '#B87A1E'); }, 48, 40, 24, 34);
  PROPS.shield = mkProp(s => { s.rect(-10, -22, 20, 15, '#2A2840').rect(-8, -20, 16, 12, '#FFD43B').rect(-6, -7, 12, 5, '#E8A228'); }, 36, 36, 18, 30);
  PROPS.bomb   = mkProp(s => { s.ell(0, -11, 10, 10, '#221E2E').rect(-2, -24, 4, 5, '#D89C2A').rect(1, -28, 4, 4, '#FF5A5A'); }, 34, 36, 17, 31);
  PROPS.dumbbell = mkProp(s => { s.rect(-14, -18, 7, 14, '#2A283C').rect(7, -18, 7, 14, '#2A283C').rect(-7, -13, 14, 4, '#D8A84E').rect(-12, -16, 3, 10, '#6E728E').rect(9, -16, 3, 10, '#6E728E'); }, 36, 30, 18, 24);
  PROPS.thumbUp  = mkProp(s => { s.rect(-9, -16, 18, 13, '#FFD43B').rect(-5, -24, 6, 8, '#FFD43B').rect(-15, -16, 6, 13, '#4A82E8'); }, 40, 34, 20, 28);
  PROPS.thumbDn  = mkProp(s => { s.rect(-9, -20, 18, 13, '#FF5A5A').rect(-1, -7, 6, 8, '#FF5A5A').rect(-15, -20, 6, 13, '#3A3250'); }, 40, 34, 20, 28);
  PROPS.mask     = mkProp(s => { s.ell(0, -14, 11, 11, '#FAF0E4').rect(-7, -18, 4, 3, '#1E182A').rect(3, -18, 4, 3, '#1E182A').rect(-4, -10, 8, 2, '#D84A44'); }, 36, 36, 18, 30);
  PROPS.magnify  = mkProp(s => { s.ell(-2, -18, 10, 10, '#D89C2A').ell(-2, -18, 7, 7, '#72C9FE').line(5, -11, 14, -2, '#6E3A20'); }, 40, 36, 20, 30);
  const prop = (x, y, z, name, ex = {}) => { if (PROPS[name]) VX.sprite(PROPS[name], x, y, z, { k: ex.k ?? .025, flip: !!ex.flip }); };

  // ======================================================================================= 3D 粒子与能量场特效
  function burst(t, t0, x, y, z, col = [255, 212, 59], n = 18) {
    const dt = t - t0; if (dt < 0 || dt > 1.0) return;
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 + hh(i, 3) * .5, spd = 2.0 + hh(i, 5) * 3.0;
      VX.pt(x + Math.cos(a) * spd * dt, y + (1.4 + hh(i, 9) * 1.6) * dt - 3.8 * dt * dt, z + Math.sin(a) * spd * dt, .11 * (1 - dt), col, true);
    }
  }
  function riseSparks(t, x, y, z, w = 1.6, h = 3.0, col = [255, 212, 59], n = 12, spd = 1.1, sz = .07) {
    for (let i = 0; i < n; i++) {
      const p = (t * spd + hh(i, 11)) % 1;
      VX.pt(x + (hh(i, 3) - .5) * w + Math.sin(t * 2 + i) * .15, y + p * h, z + (hh(i, 7) - .5) * w, sz * (1 - .4 * p), col, true);
    }
  }
  function orbitSparks(t, x, y, z, r = .8, col = [255, 212, 59], n = 5, spd = 3.2, sz = .07) {
    for (let i = 0; i < n; i++) {
      const a = t * spd + i * Math.PI * 2 / n;
      VX.pt(x + Math.cos(a) * r, y + Math.sin(a * 2 + i) * .14, z + Math.sin(a) * r, sz, col, true);
    }
  }
  function ringPulse(t, period, x, y, z, maxR = 3.0, col = [255, 212, 59], n = 16, sz = .08) {
    const p = (t % period) / period, r = .3 + p * maxR;
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 + t * .4;
      VX.pt(x + Math.cos(a) * r, y + .15 * (1 - p), z + Math.sin(a) * r, sz * (1 - p * .65), col, true);
    }
  }
  function projArc(t, t0, t1, x0, y0, z0, x1, y1, z1, arcH = 1.4, col = [255, 212, 59], sz = .10) {
    if (t < t0 || t > t1) return;
    const p = clamp01((t - t0) / Math.max(1e-4, t1 - t0));
    VX.pt(lerp(x0, x1, p), lerp(y0, y1, p) + Math.sin(p * Math.PI) * arcH, lerp(z0, z1, p), sz, col, true);
    if (p > .07) VX.pt(lerp(x0, x1, p - .06), lerp(y0, y1, p - .06) + Math.sin((p - .06) * Math.PI) * arcH, lerp(z0, z1, p - .06), sz * .65, col, true);
  }
  function quantumBeam(t, x0, y0, z0, x1, y1, z1) {
    for (let i = 0; i <= 22; i++) {
      const u = i / 22;
      const wave = Math.sin(u * Math.PI * 4 - t * 9) * .28;
      const col = i % 2 === 0 ? [255, 212, 59] : [146, 194, 255];
      VX.pt(lerp(x0, x1, u), lerp(y0, y1, u) + Math.sin(u * Math.PI) * 1.4 + wave, lerp(z0, z1, u), .08, col, true);
    }
  }
  function firework(x, y, z, age) {
    for (const [k, off] of [[0, 0], [1, .38]]) {
      const b = age - off; if (b < 0 || b > 1.25) continue;
      for (let i = 0; i < 24; i++) {
        const th = i / 24 * Math.PI * 2, ph = hh(i, k) * 2 - 1, r = b * 2.6;
        const pal = [[255, 212, 59], [255, 118, 156], [140, 190, 255]][(i + k) % 3];
        VX.pt(x + Math.cos(th) * r, y + 1 + ph * r * .7 - b * b, z + Math.sin(th) * r * .6, .08, pal, true);
      }
    }
  }

  // ======================================================================================= 电影级镜头样条与调度
  const cr = (p0, p1, p2, p3, u) => { const u2 = u * u, u3 = u2 * u; return .5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3); };
  function along(keys, t) {
    if (keys.length === 1) return { p: [...keys[0][1]], q: [...keys[0][2]], fov: keys[0][3] };
    let i = 0; while (i < keys.length - 2 && t >= keys[i + 1][0]) i++;
    let k1 = keys[i], k2 = keys[i + 1], k0 = keys[Math.max(0, i - 1)], k3 = keys[Math.min(keys.length - 1, i + 2)];
    if (k2[0] - k1[0] < .12) return { p: [...k1[1]], q: [...k1[2]], fov: k1[3] };
    if (k1[0] - k0[0] < .12) k0 = k1;
    if (k3[0] - k2[0] < .12) k3 = k2;
    const u = sm(seg01(t, k1[0], k2[0])) * .42 + seg01(t, k1[0], k2[0]) * .58;
    const v = (a, b) => cr(k0[a][b], k1[a][b], k2[a][b], k3[a][b], u);
    return { p: [v(1, 0), v(1, 1), v(1, 2)], q: [v(2, 0), v(2, 1), v(2, 2)], fov: k1[3] + (k2[3] - k1[3]) * sm(u) };
  }
  const look = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2]; return { yaw: Math.atan2(dx, -dz), pitch: Math.atan2(dy, Math.hypot(dx, dz)) }; };
  const K = (t, p, q, f = 56) => [t, p, q, f];
  const SHOTS = window.TAINAI_SHOTS = [];
  const FLS = [];
  const flash = (t, col = '#FFFFFF', a = .45, d = .25) => FLS.push([t, col, a, d]);
  const shot = (t0, t1, opt) => { if (t1 > t0) SHOTS.push({ t0, t1, ...opt }); };
  const pickShot = t => SHOTS.find(s => t >= s.t0 && t < s.t1) || SHOTS[SHOTS.length - 1];

  // ======================================================================================= 混合大电影视觉层（超越方块世界的电影级 UI 与真实证据巨幕）
  const fadeIO = (t, a, b, fi = .18, fo = .18) => Math.min(clamp01((t - a) / fi), clamp01((b - t) / fo));
  function outlined(c, txt, x, y, size, col = '#FFFFFF', o = {}) {
    c.save(); c.font = `${o.w || 800} ${size}px ${FONT}`; c.textAlign = o.align || 'center'; c.textBaseline = 'middle';
    if (o.shadow !== false) { c.shadowColor = 'rgba(0,0,0,.65)'; c.shadowBlur = 7; c.shadowOffsetY = 3; }
    c.lineJoin = 'round'; c.strokeStyle = o.stroke || '#140A10'; c.lineWidth = o.lw ?? Math.max(5, Math.round(size * .18));
    if (c.lineWidth > 0) c.strokeText(txt, x, y);
    c.shadowColor = 'transparent'; c.fillStyle = col; c.fillText(txt, x, y); c.restore();
  }
  function panel(c, x, y, w, h, border = '#FFD43B', bg = 'rgba(18,14,30,.92)') {
    c.save(); c.fillStyle = bg; c.beginPath(); c.roundRect(x, y, w, h, 16); c.fill();
    c.strokeStyle = border; c.lineWidth = 4; c.stroke(); c.restore();
  }
  function tagUI(c, txt, a = 1, col = '#FFD43B') {
    if (a <= 0) return;
    c.save(); c.globalAlpha = a; c.font = `800 34px ${FONT}`; const w = c.measureText(txt).width + 54;
    panel(c, 44, 38, w, 62, col); outlined(c, txt, 44 + w / 2, 69, 34, col, { lw: 0, shadow: false }); c.restore();
  }
  function slam(c, t, t0, txt, y = 240, size = 96, col = '#FFD43B', hold = 1.8, rot = -.03) {
    const dt = t - t0; if (dt < 0 || dt > hold) return;
    const s = 1 + .48 * Math.exp(-dt * 13), a = fadeIO(t, t0, t0 + hold, .08, .22);
    c.save(); c.globalAlpha = a; c.translate(960, y); c.rotate(rot); c.scale(s, s);
    outlined(c, txt, 0, 0, size, col, { lw: Math.round(size * .19) }); c.restore();
  }
  function stamp(c, t, t0, txt, x = 1480, y = 290, col = '#FF5A5A', hold = 2.4) {
    const dt = t - t0; if (dt < 0 || dt > hold) return;
    const s = 1 + .85 * Math.exp(-dt * 14), a = fadeIO(t, t0, t0 + hold, .06, .22);
    c.save(); c.globalAlpha = a; c.translate(x, y); c.rotate(-.14); c.scale(s, s);
    c.font = `900 46px ${FONT}`; const hw = Math.max(165, c.measureText(txt).width / 2 + 34);
    c.strokeStyle = col; c.lineWidth = 8; c.fillStyle = 'rgba(20,10,16,.88)';
    c.fillRect(-hw, -48, hw * 2, 96); c.strokeRect(-hw, -48, hw * 2, 96);
    outlined(c, txt, 0, 2, 46, col, { lw: 5, shadow: false }); c.restore();
  }

  // 3D 世界锚定真实证据巨幕（带立体体积投影光束 + IMAX 电影金框 + 动态高亮扫描框）
  function worldScreen(c, t, t0, t1, o) {
    const a = fadeIO(t, t0, t1, .22, .22);
    const im = IMG[o.key];
    if (a <= 0 || !im || !im.naturalWidth) return;
    const w = o.w || 980;
    const sc = (w - 32) / im.naturalWidth;
    const ih = im.naturalHeight * sc;
    const h = ih + 82;
    let cx = o.x ?? 960, cy = o.y ?? 440;
    if (o.anchor) {
      const pr = VX.project(o.anchor[0], o.anchor[1], o.anchor[2], 4);
      if (pr && pr.cz > 1) {
        cx = lerp(cx, Math.max(w / 2 + 48, Math.min(1920 - w / 2 - 48, pr.x)), .45);
        cy = lerp(cy, Math.max(h / 2 + 42, Math.min(890 - h / 2, pr.y)), .35);
      }
    }
    const popK = .92 + .08 * sm(seg01(t, t0, t0 + .28));
    c.save();
    // 若给出了 3D 放映源坐标，画出跨次元电影放映机光束！
    if (o.beamFrom) {
      const bp = VX.project(o.beamFrom[0], o.beamFrom[1], o.beamFrom[2], 4);
      if (bp && bp.cz > .5) {
        const grad = c.createLinearGradient(bp.x, bp.y, cx, cy);
        grad.addColorStop(0, `rgba(255,212,59,${.34 * a})`);
        grad.addColorStop(1, `rgba(255,212,59,${.04 * a})`);
        c.fillStyle = grad;
        c.beginPath();
        c.moveTo(bp.x, bp.y);
        c.lineTo(cx - w * popK / 2, cy - h * popK / 2);
        c.lineTo(cx + w * popK / 2, cy + h * popK / 2);
        c.closePath();
        c.fill();
      }
    }
    c.globalAlpha = a;
    c.translate(cx, cy); c.scale(popK, popK); c.translate(-cx, -cy);
    const x0 = cx - w / 2, y0 = cy - h / 2;
    panel(c, x0, y0, w, h, o.border || '#FFD43B', 'rgba(14,11,24,.95)');
    // 顶部电影取证铭牌栏（徽章自适应宽度 + 标题限宽防溢出）
    const badge = o.badge || '真实来源';
    c.font = `900 21px ${FONT}`;
    const bw = Math.max(124, Math.ceil(c.measureText(badge).width + 26));
    c.fillStyle = o.border || '#FFD43B';
    c.beginPath(); c.roundRect(x0 + 16, y0 + 14, bw, 38, 8); c.fill();
    outlined(c, badge, x0 + 16 + bw / 2, y0 + 33, 21, '#140A10', { lw: 0, shadow: false, w: 900 });
    const titleX = x0 + 16 + bw + 14, maxTW = Math.max(160, w - (bw + 46));
    c.font = `800 24px ${FONT}`;
    const tW = c.measureText(o.title || '').width;
    const tSz = tW > maxTW ? Math.max(18, Math.floor(24 * maxTW / tW)) : 24;
    outlined(c, o.title || '', titleX, y0 + 33, tSz, '#FAF6EE', { align: 'left', lw: 0, shadow: false });
    // 真实截图/文献画面
    c.drawImage(im, x0 + 16, y0 + 64, w - 32, ih);
    c.strokeStyle = '#2E2844'; c.lineWidth = 2; c.strokeRect(x0 + 16, y0 + 64, w - 32, ih);
    // 动态重点扫描框 [rx(0..1), ry(0..1), rw(0..1), rh(0..1), startAt]
    for (const [rx, ry, rw, rh, atT] of (o.boxes || [])) {
      const q = sm(seg01(t, atT, atT + .28));
      if (q <= 0) continue;
      const bx = x0 + 16 + (w - 32) * rx, by = y0 + 64 + ih * ry;
      const bw = (w - 32) * rw * q, bh = ih * rh;
      c.fillStyle = 'rgba(255,212,59,.18)';
      c.fillRect(bx, by, bw, bh);
      c.strokeStyle = '#FF5A5A'; c.lineWidth = 5;
      c.strokeRect(bx, by, bw, bh);
    }
    c.restore();
  }

  // 口令金卡（5 句即抄即用提示词上屏大卡）
  function promptCard(c, t, t0, t1, num, title, lines, x = 1040, y = 120, w = 810) {
    const a = fadeIO(t, t0, t1, .2, .2); if (a <= 0) return;
    const h = 104 + lines.length * 60;
    c.save(); c.globalAlpha = a;
    panel(c, x, y, w, h, '#FFD43B', 'rgba(18,14,32,.94)');
    c.fillStyle = '#FFD43B'; c.beginPath(); c.roundRect(x + 22, y + 18, 178, 44, 8); c.fill();
    outlined(c, `口令 #${num}`, x + 111, y + 40, 26, '#140A10', { lw: 0, shadow: false, w: 900 });
    outlined(c, title, x + 218, y + 40, 32, '#FFD43B', { align: 'left', lw: 0, shadow: false });
    lines.forEach(([atT, txt], idx) => {
      const k = sm(seg01(t, atT, atT + .22)); if (k <= 0) return;
      const ly = y + 84 + idx * 58;
      c.save(); c.globalAlpha = a * k;
      c.fillStyle = '#26203C'; c.beginPath(); c.roundRect(x + 22, ly, w - 44, 48, 8); c.fill();
      outlined(c, txt, x + 40, ly + 24, 27, '#FAF6EE', { align: 'left', lw: 0, shadow: false });
      c.restore();
    });
    c.restore();
  }

  // 黑哥黄满屏结论重锤（全片仅用于 2 处最硬保命铁律！底部留深黑字幕衬带确保字幕 100% 锐利可读）
  function yellowHammer(c, t, t0, t1, topTag, line1, line2) {
    const a = fadeIO(t, t0, t1, .10, .16); if (a <= 0) return;
    const s = 1 + .18 * Math.exp(-Math.max(0, t - t0) * 14);
    c.save(); c.globalAlpha = a;
    c.fillStyle = '#FFD43B'; c.fillRect(0, 0, 1920, 916);
    c.fillStyle = '#140A10'; c.fillRect(0, 916, 1920, 164);
    c.strokeStyle = '#1A1424'; c.lineWidth = 14; c.strokeRect(32, 32, 1856, 856);
    c.lineWidth = 4; c.strokeRect(52, 52, 1816, 816);
    c.fillStyle = '#1A1424'; c.beginPath(); c.roundRect(710, 128, 500, 74, 12); c.fill();
    outlined(c, topTag, 960, 165, 38, '#FFD43B', { lw: 0, shadow: false, w: 900 });
    c.translate(960, 455); c.scale(s, s);
    outlined(c, line1, 0, -64, 90, '#1A1424', { lw: 0, shadow: false, w: 900 });
    outlined(c, line2, 0, 72, 94, '#C82832', { lw: 0, shadow: false, w: 900 });
    c.restore();
  }

  // 3D 锚定跨次元电影招牌（如 HEIGE STUDIOS 金色霓虹巨匾、街头咖啡车霓虹灯牌、观光电梯透明玻璃舱框）
  function worldSign(c, x, y, z, title, sub, border = '#FFD43B', w = 440) {
    const p = VX.project(x, y, z, 4);
    if (!p || p.cz < 1 || p.cz > 38) return;
    const sc = clamp01(14 / p.cz) * .65 + .35;
    c.save(); c.translate(p.x, p.y); c.scale(sc, sc);
    panel(c, -w / 2, -48, w, sub ? 94 : 68, border, 'rgba(16,12,28,.90)');
    outlined(c, title, 0, sub ? -14 : -14, 30, border, { lw: 0, shadow: false, w: 900 });
    if (sub) outlined(c, sub, 0, 22, 21, '#FAF6EE', { lw: 0, shadow: false });
    c.restore();
  }

  // 影院探照灯光束（星光大道宏大电影感）
  function skyBeams(c, t, a = .22) {
    c.save();
    for (const [bx, ph, spd] of [[320, 0, .7], [960, 1.8, .55], [1600, 3.4, .65]]) {
      const ang = Math.sin(t * spd + ph) * .32;
      c.save(); c.translate(bx, 1080); c.rotate(ang);
      const g = c.createLinearGradient(0, 0, 0, -1100);
      g.addColorStop(0, `rgba(255,212,59,${a})`);
      g.addColorStop(1, 'rgba(255,212,59,0)');
      c.fillStyle = g;
      c.beginPath(); c.moveTo(-28, 0); c.lineTo(-170, -1100); c.lineTo(170, -1100); c.lineTo(28, 0); c.closePath(); c.fill();
      c.restore();
    }
    c.restore();
  }

  // 3D 世界头顶标牌与对话气泡
  function drawWorldHUD(c) {
    for (const [x, y, z, txt, col] of TAGS) {
      const p = VX.project(x, y, z, 4); if (!p || !p.vis || p.cz > 34) continue;
      c.save(); c.font = `800 26px ${FONT}`; const w = c.measureText(txt).width + 28;
      c.fillStyle = 'rgba(16,12,26,.84)'; c.beginPath(); c.roundRect(p.x - w / 2, p.y - 19, w, 36, 8); c.fill();
      c.strokeStyle = col || '#FFD43B'; c.lineWidth = 2.5; c.stroke();
      outlined(c, txt, p.x, p.y - 1, 23, col || '#FFD43B', { lw: 0, shadow: false }); c.restore();
    }
    for (const [x, y, z, txt, age, rem] of BUBS) {
      const p = VX.project(x, y, z, 4); if (!p || p.cz < .4 || p.cz > 38) continue;
      const a = Math.min(clamp01(age / .15), clamp01(rem / .18));
      c.save(); c.globalAlpha = a; c.font = `800 30px ${FONT}`; const w = c.measureText(txt).width + 42;
      const bx = Math.max(w / 2 + 24, Math.min(1920 - w / 2 - 24, p.x));
      const by = Math.max(100, Math.min(880, p.y));
      c.fillStyle = '#FAF6EE'; c.strokeStyle = '#140A10'; c.lineWidth = 4;
      c.beginPath(); c.roundRect(bx - w / 2, by - 82, w, 54, 12); c.fill(); c.stroke();
      outlined(c, txt, bx, by - 55, 28, '#1A1428', { lw: 0, shadow: false }); c.restore();
    }
    for (const [x, y, z, txt, size, col, age, rem] of LBLS) {
      const p = VX.project(x, y, z, 4); if (!p || p.cz < .4 || p.cz > 46) continue;
      const a = Math.min(clamp01(age / .16), clamp01(rem / .18));
      c.save(); c.globalAlpha = a; outlined(c, txt, p.x, p.y, size || 38, col || '#FFD43B', { lw: 8 }); c.restore();
    }
  }

  // 字幕渲染（逐字时间对齐 + #FFD43B 关键词高亮）
  const KEYS = (D.keys || []).slice().sort((a, b) => b.length - a.length);
  function drawSubtitle(c, t) {
    const cue = (D.cues || []).find(([s, e]) => t >= s && t < e);
    if (!cue) return;
    const txt = cue[2], marks = new Array(txt.length).fill(false);
    for (const kw of KEYS) {
      let idx = 0;
      while ((idx = txt.indexOf(kw, idx)) >= 0) {
        for (let k = idx; k < idx + kw.length; k++) marks[k] = true;
        idx += kw.length;
      }
    }
    c.save(); c.font = `800 54px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle';
    const widths = [...txt].map(ch => c.measureText(ch).width);
    const total = widths.reduce((a, b) => a + b, 0);
    const sc = total > 1720 ? 1720 / total : 1;
    let x = 960 - total * sc / 2; const y = 984;
    c.fillStyle = 'rgba(12,9,22,.74)';
    c.beginPath(); c.roundRect(x - 28, y - 38, total * sc + 56, 76, 16); c.fill();
    for (let i = 0; i < txt.length; i++) {
      const ch = txt[i], w = widths[i] * sc;
      c.save(); c.translate(x, y); if (sc < 1) c.scale(sc, sc);
      c.lineJoin = 'round'; c.strokeStyle = '#140A10'; c.lineWidth = 10; c.strokeText(ch, 0, 0);
      c.fillStyle = marks[i] ? '#FFD43B' : '#FFFFFF'; c.fillText(ch, 0, 0);
      c.restore();
      x += w;
    }
    c.restore();
  }

  // 3D 锚定跨次元全息剧情看板（密密麻麻合同条款、周报《结合上述情况》、对错答案翻牌、事前验尸倒推图、退费时间线对照）
  function holoBoard(c, x, y, w, h, title, badge, border = '#FFD43B', rows = []) {
    c.save();
    panel(c, x - w / 2, y - h / 2, w, h, border, 'rgba(14,11,26,.94)');
    c.fillStyle = border; c.beginPath(); c.roundRect(x - w / 2 + 18, y - h / 2 + 14, 152, 36, 8); c.fill();
    outlined(c, badge, x - w / 2 + 94, y - h / 2 + 32, 22, '#140A10', { lw: 0, shadow: false, w: 900 });
    outlined(c, title, x - w / 2 + 186, y - h / 2 + 32, 26, border, { align: 'left', lw: 0, shadow: false, w: 900 });
    rows.forEach(([txt, col, bg], i) => {
      const ry = y - h / 2 + 72 + i * 54;
      if (bg) { c.fillStyle = bg; c.beginPath(); c.roundRect(x - w / 2 + 20, ry - 20, w - 40, 44, 8); c.fill(); }
      outlined(c, txt, x - w / 2 + 34, ry + 2, 25, col || '#FAF6EE', { align: 'left', lw: 0, shadow: false });
    });
    c.restore();
  }

  // 电影感暖辉光与暗角
  let BR = null;
  function post(c) {
    if (!BR && typeof BUF !== 'undefined') { BR = document.createElement('canvas'); BR.width = PW; BR.height = PH; }
    if (BR && typeof BUF !== 'undefined') {
      const bx = BR.getContext('2d'), id = bx.createImageData(PW, PH);
      for (let i = 0, n = PW * PH * 4; i < n; i += 4) {
        const l = BUF[i] * .3 + BUF[i + 1] * .55 + BUF[i + 2] * .15, k = clamp01((l - 155) / 90);
        id.data[i] = BUF[i] * k; id.data[i + 1] = BUF[i + 1] * k; id.data[i + 2] = BUF[i + 2] * k; id.data[i + 3] = 255;
      }
      bx.putImageData(id, 0, 0);
      c.save(); c.globalCompositeOperation = 'lighter'; c.imageSmoothingEnabled = true;
      c.filter = 'blur(20px)'; c.globalAlpha = .44; c.drawImage(BR, 0, 0, 1920, 1080);
      c.filter = 'blur(5px)'; c.globalAlpha = .18; c.drawImage(BR, 0, 0, 1920, 1080); c.restore();
    }
    const g = c.createRadialGradient(960, 540, 440, 960, 540, 1180);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(10,6,14,.44)');
    c.fillStyle = g; c.fillRect(0, 0, 1920, 1080);
  }

  function dust(t, cam) {
    for (let i = 0; i < 50; i++) {
      const x = cam.x - 8 + ((hh(i, 1) * 16 + t * .24) % 16 + 16) % 16;
      const z = cam.z - 8 + ((hh(i, 2) * 16 + .3 * Math.sin(t * .4 + i)) % 16 + 16) % 16;
      const y = cam.y - 3 + ((hh(i, 3) * 6 + .2 * Math.sin(t + i)) % 6 + 6) % 6;
      if (VX.at(Math.floor(x), Math.floor(y), Math.floor(z))) continue;
      VX.pt(x, y, z, .04, [255, 214, 160], true);
    }
  }

  // 终极零绿像素守卫（确保截图与 H.264 4:2:0 色度下采样绝不溢绿）
  function greenGuard(c) {
    const id = c.getImageData(0, 0, 1920, 1080), d = id.data;
    let dirty = false;
    for (let i = 0, n = d.length; i < n; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b), dd = mx - mn;
      if (mx < 32 || dd < 14) continue;
      if (g === mx) {
        const h = 60 * ((b - r) / dd + 2);
        if (h >= 62 && h <= 172) {
          const y = r * .3 + g * .55 + b * .15;
          d[i] = Math.min(255, Math.round(y * 1.02));
          d[i + 1] = Math.round(y * .95);
          d[i + 2] = Math.round(y);
          dirty = true;
          continue;
        }
      }
      if (r >= g && g > r - 18 && r - b >= 22) {
        d[i + 1] = Math.max(b, r - 18);
        dirty = true;
      }
    }
    if (dirty) c.putImageData(id, 0, 0);
  }

  function LOOP(t) {
    if (!BUILT) buildWorld();
    VX.setMip(1.25);
    VX.setMoonDir([-.7, .36, .54]);
    TAGS.length = 0; BUBS.length = 0; LBLS.length = 0;

    const S = pickShot(t);
    const cam = S ? (S.keys ? along(S.keys, t) : S.cam(t)) : { p: [BLVD.x, G + 4, BLVD.z + 8], q: [BLVD.x, G + 3, BLVD.archZ], fov: 56 };
    let shakeX = 0, shakeY = 0;
    if (S && S.kicks) for (const [kt, mag] of S.kicks) {
      const dt = t - kt; if (dt >= 0 && dt < .45) { const amp = mag * .08 * Math.exp(-dt * 8); shakeX += Math.sin(dt * 90) * amp; shakeY += Math.cos(dt * 110) * amp * .6; }
    }
    const ang = look(cam.p, cam.q);
    const camPose = {
      x: cam.p[0] + shakeX + .032 * Math.sin(t * 1.15),
      y: cam.p[1] + shakeY + .020 * Math.sin(t * 1.55),
      z: cam.p[2],
      yaw: ang.yaw + .004 * Math.sin(t * .85),
      pitch: ang.pitch + .002 * Math.cos(t * 1.1),
      fov: cam.fov || 56,
      roll: .004 * Math.sin(t * .7),
    };

    VX.setDay(S && S.day !== undefined ? (typeof S.day === 'function' ? S.day(t) : S.day) : DUSK);
    VX.setAlert(S && S.alert !== undefined ? (typeof S.alert === 'function' ? S.alert(t) : S.alert) : false);
    const f = S && S.fog ? (typeof S.fog === 'function' ? S.fog(t) : S.fog) : [52, 165];
    VX.setFog(f[0], f[1]);

    VX.frame(t, camPose);
    for (const l of LAMPS) {
      if (Math.abs(l[0] - camPose.x) + Math.abs(l[1] - camPose.y) + Math.abs(l[2] - camPose.z) > 50) continue;
      VX.light(l[0] + .5, l[1] + .5, l[2] + .5, l[3], l[4], l[5]);
    }
    if (S && S.lights) S.lights(t);
    if (S && S.act) S.act(t);
    dust(t, camPose);
    VX.draw();
  }
  LOOP.res = [480, 270];
  LOOP.px = 4;
  LOOP.len = D.len || 408.32;
  LOOP.overlay = (c, t) => {
    post(c);
    const S = pickShot(t);
    drawWorldHUD(c);
    if (S && S.ui) S.ui(c, t);
    for (const [ft, col, a, d] of FLS) {
      const dt = t - ft; if (dt >= 0 && dt < d) { c.save(); c.globalAlpha = a * (1 - dt / d); c.fillStyle = col; c.fillRect(0, 0, 1920, 1080); c.restore(); }
    }
    drawSubtitle(c, t);
    greenGuard(c);
  };
  LOOPS.pxTainai = LOOP;

  window.TAINAI = {
    B, G, VX, D, IMG, K, shot, P, A, AT, PE, LS, LE, sfx, edit, fillEdit, flash,
    heige, clawd, model, ppl, prop, bubble, label,
    burst, riseSparks, orbitSparks, ringPulse, projArc, quantumBeam, firework,
    seg01, sm, lerp, hh, clamp01, fadeIO, outlined, panel, tagUI, slam, stamp,
    worldScreen, promptCard, yellowHammer, worldSign, skyBeams, holoBoard,
    GRANDMA, BLVD, TOWER, CAFE, ARENA, COURT,
    AMBER, WARM, ALARM, ICE, ROSE, DUSK, NIGHT, DAY, GOLDEN, FONT,
  };
})();
