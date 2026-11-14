// scenes/baolei.js: V074 「AI 代码暴雷」（2026-11-14）— 我的世界体素风 3D 方块世界
// 共用世界地图、人物精灵、方块道具、镜头样条、SFX 钩子与黑哥黄 / 无绿配色 UI。
// 分段镜头放在 baolei_a.js .. baolei_e.js，由 pixel.html 顺序挂载到 LOOPS.pxBaolei。
(() => {
  const { B } = VX;
  const G = 12;
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const sm = v => { v = clamp01(v); return v * v * (3 - 2 * v); };
  const seg01 = (t, a, b) => clamp01((t - a) / Math.max(1e-4, b - a));
  const lerp = (a, b, k) => a + (b - a) * k;
  const hh = (a, b = 0) => { const v = Math.sin(a * 91.3 + b * 47.7 + 13.1) * 43758.5453; return v - Math.floor(v); };

  const D = window.BAOLEI_DATA || { cues: [], keys: [], marks: {}, len: 448, lines: [] };
  const SFX = window.BAOLEI_SFX = [];
  const sfx = (t, name, db = -12) => SFX.push([+t.toFixed(3), name, db]);
  // 使用引擎内置低频柔化方块，严格无绿、无莫尔纹，杜绝异常红染
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
  let BUILT = false;

  // ======================================================================================= 调色与时间查找
  const AMBER = [1, .70, .38], WARM = [1, .76, .52], ALARM = [1, .28, .28], ICE = [.46, .74, 1];
  const DUSK = .32, NIGHT = .15, DAY = .56;
  const FONT = '"PingFang SC","Microsoft YaHei",system-ui,sans-serif';

  // 从 aligned BAOLEI_DATA.lines 中按短语精确查找首字 / 尾字时间
  const MISS = window.BAOLEI_MISS = [];
  function findAt(phrase, end = false) {
    const clean = phrase.replace(/[，。！？、：“”「」\s]/g, '').replace(/他妈/g, '他喵');
    for (const L of (D.lines || [])) {
      const idx = L.w.indexOf(clean);
      if (idx >= 0) {
        if (!end) return L.t[Math.min(idx, L.t.length - 1)] ?? L.s;
        const ei = idx + clean.length;
        return L.t[Math.min(ei, L.t.length - 1)] ?? L.e;
      }
    }
    MISS.push(phrase);
    return 0;
  }
  const P = (phrase, off = 0) => Math.max(0, findAt(phrase, false) + off);
  const A = (phrase, off = -.12) => Math.max(0, findAt(phrase, false) + off);
  const AT = (phrase, off = 0) => Math.max(0, findAt(phrase, false) + off);
  const PE = (phrase, off = 0) => Math.max(0, findAt(phrase, true) + off);
  const LS = i => (D.lines[i] ? D.lines[i].s : 0);
  const LE = i => (D.lines[i] ? D.lines[i].e : 0);

  // ======================================================================================= 六大园区坐标
  const PLAZA = { x0: 54, x1: 158, z0: 28, z1: 112 };
  const HOST = { x: 104, z: 90, scrZ: 82 };     // 区1：黑哥主讲台 + 老码农吐槽巨幕
  const WAR = { x: 74, z: 54 };                 // 区2：深夜复盘会议室 + 资损报警屏
  const SITE = { x: 108, z: 44, feX: 95 };      // 区3：被砍的前端部 + 流沙三高楼工地 + 测试修复台
  const DATA = { x: 138, z: 62, twinZ: 44 };    // 区4：50%承重墙 vs 99%危楼对比 + Sonar/GitClear 柱阵
  const RELAY = { x: 74, z: 84, twZ: 74 };      // 区5：AI 传话套娃流水线 + 门朝天迷之高楼
  const OFFICE = { x: 136, z: 88 };             // 区5b：运营/财务/策划工位 + 豆包/DeepSeek
  const IRON = { x: 104, z: 66 };               // 区6：三条保命铁律车间（承重墙/关AI台/物理隔离墙）

  const LAMPS = [];
  function putLamp(x, y, z, col = AMBER, rad = 7, inten = 1.05) {
    VX.set(x, y - 1, z, B.log);
    VX.set(x, y, z, B.lamp);
    LAMPS.push([x, y, z, col, rad, inten]);
  }

  function buildWorld() {
    VX.reset();
    VX.setMip(1.5);
    LAMPS.length = 0;

    // 1. 地形基底：中心平坦园区广场，外围柔和阶梯山丘（低频 soft 方块，零莫尔纹）
    const rectD = (x, z) => Math.hypot(Math.max(PLAZA.x0 - x, 0, x - PLAZA.x1), Math.max(PLAZA.z0 - z, 0, z - PLAZA.z1));
    for (let x = 0; x < VX.SX; x++) for (let z = 0; z < VX.SZ; z++) {
      const far = clamp01((rectD(x, z) - 2) / 28);
      const n = 2.8 * Math.sin(x * .055 + .5) + 2.4 * Math.cos(z * .05 + 1.0) + 3.2 * Math.max(0, Math.sin(x * .04 - z * .03));
      const h = Math.min(28, G + Math.round(Math.max(0, n + 2) * far * 1.5));
      for (let y = 0; y <= h; y++) {
        VX.set(x, y, z, y === 0 ? B.bedrock : y > G && y === h ? B.stoneSoft : y < G ? B.deep : (far > 0 ? B.stoneSoft : B.floorSoft));
      }
    }

    // 园区十字道路与地台（清晰区域分隔）
    VX.fill(60, G, 66, 152, G, 69, B.plankSoft);
    VX.fill(102, G, 34, 106, G, 104, B.plankSoft);
    VX.fill(96, G, 86, 112, G, 96, B.bannerBlue);
    VX.fill(98, G, 87, 110, G, 95, B.plankSoft);

    // 2. 区1 HOST：巨型户外屏幕 + 黑哥播报台
    VX.fill(HOST.x - 6, G + 1, HOST.scrZ, HOST.x + 6, G + 8, HOST.scrZ, B.obsidian);
    VX.fill(HOST.x - 5, G + 2, HOST.scrZ, HOST.x + 5, G + 7, HOST.scrZ, B.bannerBlue);
    VX.fill(HOST.x - 6, G + 9, HOST.scrZ, HOST.x + 6, G + 9, HOST.scrZ, B.goldblk);
    VX.fill(HOST.x - 2, G + 1, HOST.scrZ + 4, HOST.x + 2, G + 1, HOST.scrZ + 5, B.plankSoft);
    putLamp(HOST.x - 7, G + 2, HOST.scrZ + 3, WARM, 8, 1.15);
    putLamp(HOST.x + 7, G + 2, HOST.scrZ + 3, WARM, 8, 1.15);
    putLamp(HOST.x - 7, G + 2, HOST.scrZ + 11, AMBER, 7, 1.0);
    putLamp(HOST.x + 7, G + 2, HOST.scrZ + 11, AMBER, 7, 1.0);

    // 3. 区2 WAR：深夜复盘会议室（低矮半切墙方便南向透视，会议桌、巨屏、机柜）
    VX.fill(62, G, 42, 86, G, 64, B.bannerBlue);
    VX.fill(64, G, 44, 84, G, 62, B.stoneSoft);
    for (let x = 62; x <= 86; x++) {
      VX.fill(x, G + 1, 42, x, G + 7, 42, B.deep);
      if (Math.abs(x - 74) > 3) VX.fill(x, G + 1, 64, x, G + 2, 64, B.stoneSoft);
    }
    for (let z = 42; z <= 64; z++) {
      VX.fill(62, G + 1, z, 62, G + 5, z, B.stoneSoft);
      VX.fill(86, G + 1, z, 86, G + 5, z, B.stoneSoft);
    }
    // 复盘大屏（z=43）+ 顶红警灯
    VX.fill(69, G + 2, 43, 79, G + 6, 43, B.obsidian);
    VX.fill(70, G + 3, 43, 78, G + 5, 43, B.bannerBlue);
    VX.set(69, G + 7, 43, B.redlamp); VX.set(79, G + 7, 43, B.redlamp);
    // 长会议桌与机柜（桌高一格，不挡后排和前排人物视线）
    VX.fill(68, G + 1, 52, 80, G + 1, 53, B.plankSoft);
    VX.fill(83, G + 1, 45, 85, G + 4, 49, B.iron);
    VX.set(83, G + 3, 46, B.monitor); VX.set(83, G + 3, 48, B.redlamp);
    putLamp(65, G + 3, 46, AMBER, 8, 1.1);
    putLamp(83, G + 3, 59, AMBER, 8, 1.1);
    putLamp(65, G + 3, 59, AMBER, 8, 1.1);

    // 4. 区3 SITE：前端部门底座（可被 VX.edit 炸毁）+ 流沙三栋危楼工地 + 测试台
    VX.fill(90, G, 36, 122, G, 54, B.stoneSoft);
    VX.fill(101, G, 39, 119, G, 48, B.sand); // 流沙坑
    // 初始前端部（玻璃开放前墙，看得见里面的人）
    VX.fill(92, G + 1, 40, 98, G + 1, 46, B.floorSoft);
    VX.fill(92, G + 2, 40, 92, G + 4, 46, B.bannerOrange);
    VX.fill(98, G + 2, 40, 98, G + 4, 46, B.bannerOrange);
    VX.fill(92, G + 2, 40, 98, G + 5, 40, B.paperSoft);
    VX.fill(92, G + 5, 40, 98, G + 5, 46, B.plankSoft);
    // 三个工地基座 (x = 104, 110, 116)
    for (const tx of [104, 110, 116]) {
      VX.fill(tx - 1, G + 1, 42, tx + 1, G + 1, 45, B.sand);
      VX.fill(tx - 1, G + 2, 42, tx + 1, G + 2, 45, B.stoneSoft);
    }
    // 测试台与东墙西墙演示墙 (x = 114..124, z = 54)
    VX.fill(113, G + 1, 52, 113, G + 4, 56, B.brickSoft); // 西墙
    VX.fill(123, G + 1, 52, 123, G + 4, 56, B.brickSoft); // 东墙
    VX.fill(117, G + 1, 53, 119, G + 1, 53, B.plankSoft);
    VX.set(118, G + 2, 53, B.monitor);
    putLamp(94, G + 2, 50, AMBER, 7, 1.0);
    putLamp(118, G + 2, 48, AMBER, 8, 1.0);

    // 5. 区4 DATA：双楼对照台（2025 50% 承重墙 vs 2026 99% 危楼）+ Sonar/GitClear 柱阵底座
    VX.fill(124, G, 38, 154, G, 76, B.bannerBlue);
    VX.fill(126, G, 40, 152, G, 74, B.stoneSoft);
    // 左楼 2025 承重墙核（开放采光窗 + 四角粗壮金柱极稳）
    VX.fill(128, G + 1, 41, 132, G + 1, 45, B.iron);
    for (const cx of [128, 132]) for (const cz of [41, 45]) VX.fill(cx, G + 2, cz, cx, G + 7, cz, B.goldblk);
    VX.fill(129, G + 2, 42, 131, G + 6, 44, B.paperSoft);
    VX.fill(128, G + 8, 41, 132, G + 8, 45, B.obsidian);
    // 右楼 2026 99% 空心危楼（缺口镂空看得见内部空心 + TNT）
    VX.fill(137, G + 1, 41, 141, G + 1, 45, B.sand);
    VX.fill(137, G + 2, 41, 141, G + 7, 45, B.worange);
    VX.fill(138, G + 2, 41, 140, G + 6, 45, 0); // 前后透空露出空心壳
    VX.set(139, G + 2, 43, B.tnt); VX.set(137, G + 5, 41, B.wred); VX.set(141, G + 6, 41, B.tnt);
    VX.fill(137, G + 7, 41, 141, G + 7, 45, B.wred);
    // 数据柱阵底座 (x = 139, 143, 147, z = 61..63 -> 留在画面右半边，不挡左侧大卡片)
    for (const px of [139, 143, 147]) VX.fill(px - 1, G + 1, 61, px + 1, G + 1, 63, B.iron);
    putLamp(127, G + 2, 54, WARM, 8, 1.05);
    putLamp(149, G + 2, 54, WARM, 8, 1.05);
    putLamp(142, G + 2, 71, AMBER, 8, 1.15);

    // 6. 区5 RELAY & OFFICE：AI 接力套娃车间 + 运营财务策划办公排
    VX.fill(62, G, 70, 88, G, 94, B.stoneSoft);
    // AI 传送带与两座工作台
    for (let x = 67; x <= 81; x++) VX.set(x, G + 1, 82, B.rail);
    VX.fill(66, G + 1, 80, 68, G + 1, 84, B.iron);
    VX.fill(80, G + 1, 80, 82, G + 1, 84, B.iron);
    // 门朝天歪斜高楼底座 (74, 74)
    VX.fill(72, G + 1, 72, 76, G + 1, 76, B.sand);
    putLamp(64, G + 2, 88, AMBER, 8, 1.05);
    putLamp(85, G + 2, 88, AMBER, 8, 1.05);

    // 办公排 OFFICE (x=125..147, z=84..92)
    VX.fill(123, G, 79, 149, G, 96, B.stoneSoft);
    for (const dx of [127, 135, 143]) {
      VX.fill(dx - 2, G + 1, 86, dx + 2, G + 1, 86, B.plankSoft);
      VX.set(dx, G + 2, 86, B.monitor);
    }
    // 金库保险箱（公司账本）
    VX.fill(143, G + 1, 79, 146, G + 4, 82, B.iron);
    VX.fill(144, G + 2, 79, 145, G + 3, 79, B.goldblk);
    putLamp(124, G + 2, 91, WARM, 7, 1.0);
    putLamp(147, G + 2, 91, WARM, 7, 1.0);

    // 7. 区6 IRON：三条铁律车间（承重墙框 + 关AI台 + 物理隔离双机房）
    VX.fill(92, G, 60, 118, G, 76, B.bannerBlue);
    VX.fill(94, G, 62, 116, G, 74, B.stoneSoft);
    // 铁律1：承重框架 (x=96..98, z=66..68)
    VX.fill(96, G + 1, 66, 98, G + 1, 68, B.goldblk);
    // 铁律2：黑屏断网演讲台 (x=104, z=67)
    VX.fill(103, G + 1, 66, 105, G + 1, 67, B.plankSoft);
    VX.set(104, G + 2, 66, B.offlamp);
    // 铁律3：测试库 vs 生产库 + 中间黑曜石防火墙 (x=112)
    VX.fill(109, G + 1, 65, 110, G + 3, 67, B.wred);      // 测试库
    VX.fill(112, G + 1, 64, 112, G + 5, 69, B.obsidian);  // 物理隔离墙
    VX.fill(112, G + 5, 64, 112, G + 5, 69, B.goldblk);
    VX.fill(114, G + 1, 65, 115, G + 3, 67, B.goldblk);   // 生产库
    putLamp(92, G + 2, 74, WARM, 7, 1.1);
    putLamp(117, G + 2, 74, WARM, 7, 1.1);

    for (const [t, x, y, z, nm] of VXE) VX.edit(t, x, y, z, resolveBlk(nm));
    BUILT = true;
  }

  // ======================================================================================= 人物与道具精灵
  const TAGS = [], BUBS = [], LBLS = [];
  const bubble = (x, y, z, txt, t, t0, t1) => { if (t >= t0 && t < t1) BUBS.push([x, y, z, txt, t - t0, t1 - t]); };
  const label = (x, y, z, txt, size, col, t, t0, t1 = 1e9) => { if (t >= t0 && t < t1) LBLS.push([x, y, z, txt, size, col, t - t0, t1 - t]); };

  const hgImg = o => VX.capture((x, y) => heigePx(x, y, { ...o, noShadow: true }));
  function heige(x, y, z, o = {}, ex = {}) {
    VX.sprite(hgImg(o), x, y, z, { k: ex.k, flip: !!o.flip });
    if (!ex.noShadow) VX.shadow(x, y, z, .42);
    if (ex.tag) TAGS.push([x, y + 2.05, z, ex.tag, ex.tagCol]);
  }
  const clImg = o => VX.capture((x, y) => clawdPx(x, y, { ...o, noShadow: true }));
  function clawd(x, y, z, o = {}, ex = {}) {
    VX.sprite(clImg(o), x, y, z, { k: ex.k ?? .017 });
    if (!ex.noShadow) VX.shadow(x, y, z, .36);
    if (ex.tag !== false) TAGS.push([x, y + 1.55, z, ex.tag || 'Claude', ex.tagCol || '#FFA882']);
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
    const ph = Math.floor(t * 4) % 4;
    VX.sprite(modelImg(name, emo, ph), x, y + (ex.dy || 0), z, { k: ex.k ?? .022 });
    if (!ex.noShadow) VX.shadow(x, y, z, .46);
    if (ex.tag !== false) {
      const defNm = name === 'deepseek' ? 'DeepSeek' : name === 'doubao' ? '豆包' : name.toUpperCase();
      TAGS.push([x, y + 2.15, z, ex.tag || defNm, ex.tagCol || (name === 'deepseek' ? '#9DB4FF' : '#72C9FE')]);
    }
  }

  // 程序员/老板/测试/运营/财务/策划/老码农方块小人
  const PC = {
    老码农: { c1: '#525C70', c2: '#3D4556', hair: '#C8C8D4', glasses: true, beard: true },
    老板:   { c1: '#262138', c2: '#181424', hair: '#2A2230', tie: '#E83A44' },
    背锅侠: { c1: '#3E6A9A', c2: '#2C4E74', hair: '#1E1A26', glasses: true },
    开发:   { c1: '#4C5B7A', c2: '#394560', hair: '#2A2230' },
    测试:   { c1: '#B87A44', c2: '#945E30', hair: '#2A2230', cap: '#FFD43B' },
    运营:   { c1: '#C8647A', c2: '#9E485C', hair: '#2A1E24' },
    财务:   { c1: '#6E668A', c2: '#524B6B', hair: '#262030', glasses: true },
    策划:   { c1: '#D89242', c2: '#AE722C', hair: '#2A2230' },
  };
  const pplCache = new Map();
  function pplImg(role, mood = 'neutral', ph = 0, blind = false) {
    const key = [role, mood, ph, blind ? 1 : 0].join('|');
    if (pplCache.has(key)) return pplCache.get(key);
    const R = PC[role] || PC.开发, s = new Spr(), H = -92, SK = mood === 'panic' ? '#E8B8A2' : '#E2B694', SKD = '#C69672', D = '#261816';
    // 腿脚
    const step = ph % 2 && mood === 'walk' ? 2 : 0;
    s.rect(-10, -14 + step, 8, 14 - step, '#221E2E').rect(2, -14 - step, 8, 14 + step, '#181422');
    // 身体与衣领
    s.rect(-14, -56, 28, 42, R.c1).rect(6, -56, 8, 42, R.c2).rect(-16, -50, 32, 8, R.c2).rect(-6, -56, 12, 8, SK);
    if (R.tie) s.rect(-2, -52, 4, 24, R.tie);
    // 手臂（举手投降/甩手/拿喷枪/指责）
    if (mood === 'point') s.rect(-22, -52, 8, 10, R.c1).rect(14, -54, 14, 7, R.c1);
    else if (mood === 'panic' || mood === 'handsup') s.rect(-20, -68, 7, 22, R.c1).rect(13, -68, 7, 22, R.c2);
    else s.rect(-19, -50, 5, 22, R.c1).rect(14, -50, 5, 22, R.c2);
    // 头与发型
    s.rect(-12, H, 24, 36, SK).rect(6, H, 6, 36, SKD).rect(-12, H, 24, 8, R.hair);
    if (R.cap) s.rect(-13, H - 3, 26, 8, R.cap).rect(-13, H + 3, 28, 3, '#E8A93A');
    // 五官
    const ey = H + 15;
    if (blind) {
      s.rect(-13, ey - 2, 26, 8, '#1A1428').rect(-10, ey + 1, 20, 2, '#E83A44');
    } else if (mood === 'dizzy') {
      for (const ex of [-9, 3]) { s.line(ex, ey, ex + 4, ey + 4, D); s.line(ex, ey + 4, ex + 4, ey, D); }
    } else if (mood === 'closed' || mood === 'shrug') {
      s.rect(-9, ey + 2, 5, 2, D).rect(4, ey + 2, 5, 2, D);
    } else if (mood === 'shock' || mood === 'panic') {
      s.rect(-10, ey - 1, 6, 6, '#FFFFFF').rect(4, ey - 1, 6, 6, '#FFFFFF').rect(-8, ey + 1, 2, 2, D).rect(6, ey + 1, 2, 2, D);
    } else {
      s.rect(-9, ey, 5, 4, '#FFFFFF').rect(4, ey, 5, 4, '#FFFFFF').rect(-6, ey + 1, 2, 3, '#263858').rect(5, ey + 1, 2, 3, '#263858');
    }
    if (R.glasses && !blind) s.rect(-11, ey - 1, 9, 6, 'rgba(0,0,0,0)').rect(-11, ey - 2, 9, 1, '#1A1428').rect(2, ey - 2, 9, 1, '#1A1428').rect(-2, ey, 4, 1, '#1A1428');
    if (mood === 'angry' || mood === 'point') s.line(-10, ey - 5, -3, ey - 2, D).line(10, ey - 5, 3, ey - 2, D);
    else s.rect(-10, ey - 4, 20, 2, D);
    if (R.beard) s.rect(-8, H + 30, 16, 6, '#B8BAC8');
    const my = H + 31;
    if (mood === 'happy') s.rect(-5, my, 10, 2, '#6A3024');
    else if (mood === 'angry' || mood === 'panic' || mood === 'shock' || (mood === 'talk' && ph % 2)) s.rect(-4, my - 2, 8, 4, '#6A3024');
    else s.rect(-4, my, 8, 1, '#6A3024');
    if (mood === 'sweat' || mood === 'panic') s.rect(9, H + 8, 3, 6, '#72C9FE').rect(10, H + 12, 2, 3, '#FFFFFF');
    s.outline('#181014');
    const img = VX.capture((x, y) => s.draw(x, y), 80, 128, 40, 118);
    pplCache.set(key, img);
    return img;
  }
  function ppl(x, y, z, role, mood = 'neutral', t = 0, ex = {}) {
    const walkBob = ex.walk ? -Math.abs(Math.sin(t * 7)) * .07 : 0;
    const sh = ex.shake ? Math.sin(t * 28) * .04 : 0;
    VX.sprite(pplImg(role, mood, Math.floor(t * 6) % 2, !!ex.blind), x + sh, y + walkBob + (ex.dy || 0), z, { k: ex.k, flip: !!ex.flip });
    if (!ex.noShadow) VX.shadow(x, y, z, .42);
    if (ex.tag !== false) TAGS.push([x, y + 2.05, z, ex.tag || role, ex.tagCol]);
  }

  // 自定义像素道具（铁锅、大饼、AI喷枪、金币、文件、炸弹、咖啡杯）
  const PROPS = {};
  const mkProp = (fn, w = 48, h = 48, ox = 24, oy = 42) => VX.capture((X, Y) => { const s = new Spr(); fn(s); s.outline('#140A10'); s.draw(X, Y); }, w, h, ox, oy);
  PROPS.pot = mkProp(s => { s.rect(-14, -14, 28, 12, '#343A4A').rect(-16, -16, 32, 4, '#566078').rect(14, -13, 8, 3, '#222634').rect(-6, -10, 12, 3, '#E83A44'); }, 52, 28, 26, 20);
  PROPS.pie = mkProp(s => { s.ell(0, -14, 15, 14, '#E8A93A').ell(0, -14, 11, 10, '#FFD43B').ell(-4, -17, 3, 2, '#FFF2C0'); }, 44, 34, 22, 30);
  PROPS.gun = mkProp(s => { s.rect(-14, -12, 22, 9, '#3A3550').rect(8, -10, 10, 5, '#72C9FE').rect(-8, -3, 6, 8, '#1A1428').rect(-12, -16, 12, 4, '#FFD43B'); }, 54, 32, 26, 26);
  PROPS.coin = mkProp(s => { s.ell(0, -10, 8, 8, '#E8A93A').ell(0, -10, 5, 5, '#FFD43B').rect(-1, -13, 2, 6, '#B8781A'); }, 24, 24, 12, 20);
  PROPS.doc = mkProp(s => { s.rect(-8, -22, 16, 22, '#F2E6C8').rect(-5, -18, 10, 2, '#3A3550').rect(-5, -13, 10, 2, '#7A748A').rect(-5, -8, 7, 2, '#E83A44'); }, 26, 28, 13, 25);
  PROPS.bomb = mkProp(s => { s.ell(0, -10, 10, 10, '#221E2C').rect(-3, -22, 6, 4, '#5A5468').rect(1, -26, 3, 4, '#E8A93A').rect(3, -28, 4, 4, '#FF6A5A'); }, 32, 34, 16, 30);
  PROPS.shades = mkProp(s => { s.rect(-12, -6, 10, 6, '#140A10').rect(2, -6, 10, 6, '#140A10').rect(-2, -5, 4, 2, '#140A10').rect(-10, -4, 3, 1, '#FFFFFF'); }, 32, 16, 16, 12);
  const prop = (x, y, z, name, ex = {}) => { if (PROPS[name]) VX.sprite(PROPS[name], x, y, z, { k: ex.k ?? .022 }); };

  function burst(t, t0, x, y, z, col = [255, 212, 59], n = 16) {
    const dt = t - t0; if (dt < 0 || dt > 1.0) return;
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 + hh(i, 3) * .5, spd = 1.8 + hh(i, 5) * 2.8;
      VX.pt(x + Math.cos(a) * spd * dt, y + (1.2 + hh(i, 9) * 1.5) * dt - 3.6 * dt * dt, z + Math.sin(a) * spd * dt, .11 * (1 - dt), col, true);
    }
  }
  function sweat(t, x, y, z) {
    for (let i = 0; i < 3; i++) {
      const a = (t * 1.8 + i / 3) % 1;
      VX.pt(x + (i - 1) * .35, y - a * .85, z + .2, .07 * (1 - a * .4), [118, 206, 255], true);
    }
  }
  function sprayStream(t, x0, y0, z0, x1, y1, z1, col = [214, 198, 168]) {
    for (let i = 0; i < 9; i++) {
      const a = (t * 3.5 + i / 9) % 1;
      VX.pt(lerp(x0, x1, a) + Math.sin(t * 15 + i) * .18, lerp(y0, y1, a) + Math.sin(a * Math.PI) * .9, lerp(z0, z1, a), .12, col, i % 3 === 0);
    }
  }
  function rainCloud(t, x, y, z, k = 1) {
    if (k <= 0) return;
    for (let i = 0; i < 7; i++) VX.pt(x - .42 + i * .14, y + .05 * Math.sin(t * 2 + i), z, .16 * k, [88, 92, 114]);
    for (let i = 0; i < 5; i++) { const a = (t * 1.6 + i / 5) % 1; VX.pt(x - .3 + i * .15, y - .12 - a * .8, z, .04 * k, [172, 188, 224], true); }
  }

  // ======================================================================================= 镜头样条与调度
  const cr = (p0, p1, p2, p3, u) => { const u2 = u * u, u3 = u2 * u; return .5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3); };
  function along(keys, t) {
    if (keys.length === 1) return { p: [...keys[0][1]], q: [...keys[0][2]], fov: keys[0][3] };
    let i = 0; while (i < keys.length - 2 && t >= keys[i + 1][0]) i++;
    let k1 = keys[i], k2 = keys[i + 1], k0 = keys[Math.max(0, i - 1)], k3 = keys[Math.min(keys.length - 1, i + 2)];
    if (k2[0] - k1[0] < .12) return { p: [...k1[1]], q: [...k1[2]], fov: k1[3] };
    if (k1[0] - k0[0] < .12) k0 = k1;
    if (k3[0] - k2[0] < .12) k3 = k2;
    const u = sm(seg01(t, k1[0], k2[0])) * .4 + seg01(t, k1[0], k2[0]) * .6;
    const v = (a, b) => cr(k0[a][b], k1[a][b], k2[a][b], k3[a][b], u);
    return { p: [v(1, 0), v(1, 1), v(1, 2)], q: [v(2, 0), v(2, 1), v(2, 2)], fov: k1[3] + (k2[3] - k1[3]) * sm(u) };
  }
  const look = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2]; return { yaw: Math.atan2(dx, -dz), pitch: Math.atan2(dy, Math.hypot(dx, dz)) }; };
  const K = (t, p, q, f = 60) => [t, p, q, f];
  const SHOTS = window.BAOLEI_SHOTS = [];
  const FLS = [];
  const flash = (t, col = '#FFFFFF', a = .5, d = .25) => FLS.push([t, col, a, d]);
  const shot = (t0, t1, opt) => {
    if (t1 <= t0) return;
    SHOTS.push({ t0, t1, ...opt });
  };
  const pickShot = t => SHOTS.find(s => t >= s.t0 && t < s.t1) || SHOTS[SHOTS.length - 1];

  // ======================================================================================= Canvas 2D UI 动效组件（零绿、高对比、黑哥黄）
  const fadeIO = (t, a, b, fi = .16, fo = .16) => Math.min(clamp01((t - a) / fi), clamp01((b - t) / fo));
  function outlined(c, txt, x, y, size, col = '#FFFFFF', o = {}) {
    c.save(); c.font = `${o.w || 800} ${size}px ${FONT}`; c.textAlign = o.align || 'center'; c.textBaseline = 'middle';
    if (o.shadow !== false) { c.shadowColor = 'rgba(0,0,0,.62)'; c.shadowBlur = 6; c.shadowOffsetY = 3; }
    c.lineJoin = 'round'; c.strokeStyle = o.stroke || '#140A10'; c.lineWidth = o.lw ?? Math.max(5, Math.round(size * .18));
    c.strokeText(txt, x, y); c.shadowColor = 'transparent'; c.fillStyle = col; c.fillText(txt, x, y); c.restore();
  }
  function panel(c, x, y, w, h, border = '#3A3550') {
    c.save(); c.fillStyle = 'rgba(18,14,30,.90)'; c.beginPath(); c.roundRect(x, y, w, h, 14); c.fill();
    c.strokeStyle = border; c.lineWidth = 4; c.stroke(); c.restore();
  }
  function tagUI(c, txt, a = 1, col = '#FFD34E') {
    if (a <= 0) return;
    c.save(); c.globalAlpha = a; c.font = `800 36px ${FONT}`; const w = c.measureText(txt).width + 52;
    panel(c, 48, 44, w, 64, col); outlined(c, txt, 48 + w / 2, 76, 36, col, { lw: 0, shadow: false }); c.restore();
  }
  function slam(c, t, t0, txt, y = 260, size = 104, col = '#FFD34E', hold = 1.6, rot = -.04) {
    const dt = t - t0; if (dt < 0 || dt > hold) return;
    const s = 1 + .45 * Math.exp(-dt * 12), a = fadeIO(t, t0, t0 + hold, .08, .22);
    c.save(); c.globalAlpha = a; c.translate(960, y); c.rotate(rot); c.scale(s, s);
    outlined(c, txt, 0, 0, size, col, { lw: Math.round(size * .19) }); c.restore();
  }
  function toast(c, t, t0, txt, y = 220, col = '#FFD34E', hold = 1.8) {
    const dt = t - t0; if (dt < 0 || dt > hold) return;
    const a = fadeIO(t, t0, t0 + hold, .12, .22);
    c.save(); c.globalAlpha = a; c.font = `800 44px ${FONT}`; const w = c.measureText(txt).width + 72;
    panel(c, 960 - w / 2, y - 42, w, 84, col); outlined(c, txt, 960, y, 44, col, { lw: 0, shadow: false }); c.restore();
  }
  function stamp(c, t, t0, txt, x = 1480, y = 320, col = '#FF5A5A', hold = 2.5) {
    const dt = t - t0; if (dt < 0 || dt > hold) return;
    const s = 1 + .85 * Math.exp(-dt * 14), a = fadeIO(t, t0, t0 + hold, .06, .22);
    c.save(); c.globalAlpha = a; c.translate(x, y); c.rotate(-.16); c.scale(s, s);
    c.strokeStyle = col; c.lineWidth = 8; c.fillStyle = 'rgba(20,10,16,.84)';
    c.fillRect(-165, -48, 330, 96); c.strokeRect(-165, -48, 330, 96);
    outlined(c, txt, 0, 2, 48, col, { lw: 6, shadow: false }); c.restore();
  }
  // 资损报警栏
  function lossUI(c, t, t0, t1, target = 500000) {
    const a = fadeIO(t, t0, t1); if (a <= 0) return;
    const k = sm(seg01(t, t0, t0 + 1.4)), val = Math.round(target * k);
    const pulse = Math.floor(t * 8) % 2 === 0;
    c.save(); c.globalAlpha = a; panel(c, 1310, 48, 560, 150, pulse ? '#FF5A5A' : '#8A222E');
    outlined(c, '[!] 线上资损事故', 1590, 92, 34, '#FF8E84', { lw: 0, shadow: false });
    outlined(c, '- ¥ ' + val.toLocaleString('en-US'), 1590, 152, 58, '#FFD34E', { lw: 6, shadow: false }); c.restore();
  }
  // 百分比对比条（50% / 99%，Sonar，GitClear）
  function ratioBar(c, t, t0, t1, title, leftPct, leftTxt, rightTxt, x = 80, y = 140) {
    const a = fadeIO(t, t0, t1); if (a <= 0) return;
    const w = 680, p = sm(seg01(t, t0 + .15, t0 + .75)) * leftPct;
    c.save(); c.globalAlpha = a; panel(c, x, y, w, 170, '#FFD43B');
    outlined(c, title, x + w / 2, y + 40, 34, '#F2E6C8', { lw: 0, shadow: false });
    c.fillStyle = '#181426'; c.fillRect(x + 30, y + 72, w - 60, 42);
    c.fillStyle = '#FFD43B'; c.fillRect(x + 34, y + 76, (w - 68) * p, 34);
    c.fillStyle = '#E83A44'; c.fillRect(x + 34 + (w - 68) * p, y + 76, (w - 68) * (1 - p), 34);
    outlined(c, leftTxt, x + 36, y + 142, 28, '#FFD34E', { align: 'left', lw: 0, shadow: false });
    outlined(c, rightTxt, x + w - 36, y + 142, 28, '#FF7B73', { align: 'right', lw: 0, shadow: false });
    c.restore();
  }
  // 行业报告大指标卡（Sonar / GitClear）
  function metricCard(c, t, t0, t1, badge, items, x = 64, y = 130, w = 640) {
    const a = fadeIO(t, t0, t1); if (a <= 0) return;
    const h = 95 + items.length * 102;
    c.save(); c.globalAlpha = a; panel(c, x, y, w, h, '#FFD43B');
    outlined(c, badge, x + w / 2, y + 48, 36, '#FFD34E', { lw: 0, shadow: false });
    items.forEach(([at, num, desc, col], i) => {
      const k = sm(seg01(t, at, at + .25)); if (k <= 0) return;
      const ry = y + 96 + i * 100;
      c.save(); c.globalAlpha = a * k; c.fillStyle = '#241E38'; c.fillRect(x + 24, ry, w - 48, 84);
      outlined(c, num, x + 46, ry + 42, 46, col || '#FFD34E', { align: 'left', lw: 0, shadow: false });
      outlined(c, desc, x + w - 44, ry + 42, 29, '#F2E6C8', { align: 'right', lw: 0, shadow: false }); c.restore();
    });
    c.restore();
  }
  // 瀑布代码墙（动辄上千行）
  function codeWall(c, t, t0, t1, x = 1140, y = 90) {
    const a = fadeIO(t, t0, t1); if (a <= 0) return;
    c.save(); c.globalAlpha = a; panel(c, x, y, 700, 620, '#E83A44');
    outlined(c, 'AI 生成改动 · +1,482 行', x + 350, y + 40, 34, '#FF7B73', { lw: 0, shadow: false });
    c.beginPath(); c.rect(x + 24, y + 76, 652, 520); c.clip();
    const off = ((t - t0) * 180) % 520;
    for (let i = 0; i < 28; i++) {
      const yy = y + 90 + ((i * 26 - off + 728) % 728) - 40;
      c.fillStyle = i % 5 === 0 ? '#FF6A5A' : i % 3 === 0 ? '#FFD43B' : '#7A86A8';
      c.fillRect(x + 42 + (i % 4) * 28, yy, 160 + (i * 73) % 320, 12);
    }
    c.restore();
  }
  // 三条保命铁律卡片
  function ruleCard(c, t, t0, t1, num, title, bullets, x = 1100, y = 120, w = 740) {
    const a = fadeIO(t, t0, t1); if (a <= 0) return;
    c.save(); c.globalAlpha = a; panel(c, x, y, w, 132 + bullets.length * 74, '#FFD43B');
    outlined(c, `铁律 ${num} · ${title}`, x + 32, y + 50, 38, '#FFD34E', { align: 'left', lw: 0, shadow: false });
    bullets.forEach(([at, txt], i) => {
      const k = sm(seg01(t, at, at + .22)); if (k <= 0) return;
      const by = y + 106 + i * 74;
      c.save(); c.globalAlpha = a * k; c.fillStyle = '#262138'; c.fillRect(x + 28, by, w - 56, 60);
      outlined(c, txt, x + 48, by + 30, 30, '#F2E6C8', { align: 'left', lw: 0, shadow: false }); c.restore();
    });
    c.restore();
  }
  // 3D 世界头顶标牌 / 气泡（在 overlay 里贴住人物上方）
  function drawWorldHUD(c, t) {
    for (const [x, y, z, txt, col] of TAGS) {
      const p = VX.project(x, y, z); if (!p) continue;
      c.save(); c.font = `800 28px ${FONT}`; const w = c.measureText(txt).width + 28;
      c.fillStyle = 'rgba(18,14,28,.82)'; c.beginPath(); c.roundRect(p[0] - w / 2, p[1] - 20, w, 38, 8); c.fill();
      c.strokeStyle = col || '#FFD34E'; c.lineWidth = 2.5; c.stroke();
      outlined(c, txt, p[0], p[1], 24, col || '#FFD34E', { lw: 0, shadow: false }); c.restore();
    }
    for (const [x, y, z, txt, age, rem] of BUBS) {
      const p = VX.project(x, y, z); if (!p) continue;
      const a = Math.min(clamp01(age / .16), clamp01(rem / .18));
      c.save(); c.globalAlpha = a; c.font = `800 32px ${FONT}`; const w = c.measureText(txt).width + 44;
      c.fillStyle = '#FFFFFF'; c.strokeStyle = '#140A10'; c.lineWidth = 4;
      c.beginPath(); c.roundRect(p[0] - w / 2, p[1] - 62, w, 58, 12); c.fill(); c.stroke();
      outlined(c, txt, p[0], p[1] - 33, 30, '#1A1428', { lw: 0, shadow: false }); c.restore();
    }
    for (const [x, y, z, txt, size, col, age, rem] of LBLS) {
      const p = VX.project(x, y, z); if (!p) continue;
      const a = Math.min(clamp01(age / .18), clamp01(rem / .2));
      c.save(); c.globalAlpha = a; outlined(c, txt, p[0], p[1], size || 38, col || '#FFD34E', { lw: 8 }); c.restore();
    }
  }

  // 结尾提问卡 + 个人签名锁定
  function questionCard(c, t, t0, t1) {
    const a = fadeIO(t, t0, t1); if (a <= 0) return;
    c.save(); c.globalAlpha = a; panel(c, 360, 120, 1200, 230, '#FFD43B');
    outlined(c, '你们公司现在推 AI，是哪一种？', 960, 184, 44, '#FFD34E', { lw: 0, shadow: false });
    outlined(c, '真省力气  vs  1 人扛 3 人活', 960, 272, 46, '#F2E6C8', { lw: 0, shadow: false });
    c.restore();
  }
  function signOff(c, t, t0, t1) {
    const a = fadeIO(t, t0, t1); if (a <= 0) return;
    c.save(); c.globalAlpha = a; panel(c, 260, 150, 1400, 240, '#FFD43B');
    outlined(c, '关注 问问黑哥 · 点个赞', 960, 222, 48, '#FFD34E', { lw: 0, shadow: false });
    outlined(c, '我是黑哥，不吹AI也不恐惧AI，只说真话。', 960, 314, 42, '#FFFFFF', { lw: 0, shadow: false });
    c.restore();
  }

  // 字幕渲染（严格保持原文字与关键词高亮 #FFD34E）
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
    let x = 960 - total * sc / 2; const y = 982;
    for (let i = 0; i < txt.length; i++) {
      const ch = txt[i], w = widths[i] * sc;
      if (sc < 1) { c.save(); c.translate(x, y); c.scale(sc, sc); c.lineJoin = 'round'; c.strokeStyle = '#140A10'; c.lineWidth = 10; c.strokeText(ch, 0, 0); c.fillStyle = marks[i] ? '#FFD34E' : '#FFFFFF'; c.fillText(ch, 0, 0); c.restore(); }
      else { c.lineJoin = 'round'; c.strokeStyle = '#140A10'; c.lineWidth = 10; c.strokeText(ch, x, y); c.fillStyle = marks[i] ? '#FFD34E' : '#FFFFFF'; c.fillText(ch, x, y); }
      x += w;
    }
    c.restore();
  }

  // 轻微暖光辉与渐晕（不引入任何绿调）
  let BR = null;
  function post(c, t) {
    if (!BR && typeof BUF !== 'undefined') { BR = document.createElement('canvas'); BR.width = PW; BR.height = PH; }
    if (BR && typeof BUF !== 'undefined') {
      const bx = BR.getContext('2d'), id = bx.createImageData(PW, PH);
      for (let i = 0, n = PW * PH * 4; i < n; i += 4) {
        const l = BUF[i] * .3 + BUF[i + 1] * .55 + BUF[i + 2] * .15, k = clamp01((l - 155) / 90);
        id.data[i] = BUF[i] * k; id.data[i + 1] = BUF[i + 1] * k; id.data[i + 2] = BUF[i + 2] * k; id.data[i + 3] = 255;
      }
      bx.putImageData(id, 0, 0);
      c.save(); c.globalCompositeOperation = 'lighter'; c.imageSmoothingEnabled = true;
      c.filter = 'blur(20px)'; c.globalAlpha = .45; c.drawImage(BR, 0, 0, 1920, 1080);
      c.filter = 'blur(5px)'; c.globalAlpha = .20; c.drawImage(BR, 0, 0, 1920, 1080); c.restore();
    }
    const g = c.createRadialGradient(960, 540, 440, 960, 540, 1180);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(10,6,14,.46)');
    c.fillStyle = g; c.fillRect(0, 0, 1920, 1080);
  }

  function dust(t, cam) {
    for (let i = 0; i < 55; i++) {
      const x = cam.x - 8 + ((hh(i, 1) * 16 + t * .25) % 16 + 16) % 16;
      const z = cam.z - 8 + ((hh(i, 2) * 16 + .3 * Math.sin(t * .4 + i)) % 16 + 16) % 16;
      const y = cam.y - 3 + ((hh(i, 3) * 6 + .2 * Math.sin(t + i)) % 6 + 6) % 6;
      if (VX.at(Math.floor(x), Math.floor(y), Math.floor(z))) continue;
      VX.pt(x, y, z, .04, [255, 214, 160], true);
    }
  }

  // 绝不允许任何绿色像素或接近 60° 极易在 H.264 4:2:0 下采样偏绿的高亮柠檬黄进入最终画面
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
          d[i + 1] = Math.round(y * .96);
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

  // ======================================================================================= 注册 LOOPS.pxBaolei
  function LOOP(t) {
    if (!BUILT) buildWorld();
    VX.setMip(1.5);
    VX.setMoonDir([-.7, .35, .55]);
    TAGS.length = 0; BUBS.length = 0; LBLS.length = 0;

    const S = pickShot(t);
    const cam = S ? (S.keys ? along(S.keys, t) : S.cam(t)) : { p: [HOST.x, G + 4, HOST.z + 8], q: [HOST.x, G + 2, HOST.z], fov: 60 };
    let shakeX = 0, shakeY = 0;
    if (S && S.kicks) for (const [kt, mag] of S.kicks) {
      const dt = t - kt; if (dt >= 0 && dt < .45) { const amp = mag * .08 * Math.exp(-dt * 8); shakeX += Math.sin(dt * 90) * amp; shakeY += Math.cos(dt * 110) * amp * .6; }
    }
    const ang = look(cam.p, cam.q);
    const camPose = {
      x: cam.p[0] + shakeX + .02 * Math.sin(t * 1.2),
      y: cam.p[1] + shakeY + .015 * Math.sin(t * 1.6),
      z: cam.p[2],
      yaw: ang.yaw + .003 * Math.sin(t * .9),
      pitch: ang.pitch,
      fov: cam.fov || 60,
      roll: .004 * Math.sin(t * .7),
    };

    VX.setDay(S && S.day !== undefined ? (typeof S.day === 'function' ? S.day(t) : S.day) : DUSK);
    VX.setAlert(S && S.alert !== undefined ? (typeof S.alert === 'function' ? S.alert(t) : S.alert) : false);
    const f = S && S.fog ? (typeof S.fog === 'function' ? S.fog(t) : S.fog) : [55, 165];
    VX.setFog(f[0], f[1]);

    VX.frame(t, camPose);
    for (const l of LAMPS) {
      if (Math.abs(l[0] - camPose.x) + Math.abs(l[1] - camPose.y) + Math.abs(l[2] - camPose.z) > 48) continue;
      VX.light(l[0] + .5, l[1] + .5, l[2] + .5, l[3], l[4], l[5]);
    }
    if (S && S.lights) S.lights(t);
    if (S && S.act) S.act(t);
    dust(t, camPose);
    VX.draw();
  }
  LOOP.res = [320, 180];
  LOOP.px = 6;
  LOOP.len = D.len || 448;
  LOOP.overlay = (c, t) => {
    post(c, t);
    const S = pickShot(t);
    drawWorldHUD(c, t);
    if (S && S.ui) S.ui(c, t);
    for (const [ft, col, a, d] of FLS) {
      const dt = t - ft; if (dt >= 0 && dt < d) { c.save(); c.globalAlpha = a * (1 - dt / d); c.fillStyle = col; c.fillRect(0, 0, 1920, 1080); c.restore(); }
    }
    drawSubtitle(c, t);
    greenGuard(c);
  };
  LOOPS.pxBaolei = LOOP;

  window.BAOLEI = {
    B, G, VX, D, K, shot, P, A, AT, PE, LS, LE, sfx, edit, fillEdit, flash,
    heige, clawd, model, ppl, prop, bubble, label, burst, sweat, sprayStream, rainCloud,
    seg01, sm, lerp, hh, clamp01, fadeIO, outlined, panel, tagUI, slam, toast, stamp,
    lossUI, ratioBar, metricCard, codeWall, ruleCard, questionCard, signOff,
    HOST, WAR, SITE, DATA, RELAY, OFFICE, IRON,
    AMBER, WARM, ALARM, ICE, DUSK, NIGHT, DAY, FONT,
  };
})();
