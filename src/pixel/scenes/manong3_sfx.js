// pixel/scenes/manong3_sfx.js: the sound effects of the third cut of 「码农这行纯粹是邪门」 (manong3.js), for
// tools/video/mix.mjs. A cue is a phrase, a phrase with an offset ('phrase+0.3') or a time ('@0.15'); the voice is
// never touched, and there is no music: only these, under it.
//   node tools/video/mix.mjs src/pixel/scenes/manong_data.js src/pixel/scenes/manong3_sfx.js out/video/manong/voice.mp3 out/video/manong/sfx out/video/manong/picture3.mp4 <out.mp4>
var MANONG_DIR = window.MANONG_DIR = [
  // transitions (dissolves stay silent)
  ...['干了整整十年', '前几天他跟我说', '有人问哪里', '三个维度', '但这帮码农', '先说第一个', '哥们儿我干了十年码农', '多出来的五年', '别人下班', '你永远不知道', '再说第二个', '按理说', '这就形成了一种死局', '大家仔细想想', '你都还没搞懂', '更恐怖的还有跳槽', '有人还喜欢装', '当你算法', '最后一个', '这要搁别的行业', '结果在码农行业', '程序员的职业生涯', '所以他常说', '但话是这么说'].map(p => [p + '-0.15', { sfx: ['whoosh', -13] }]),
  ...['精神状态', '放屁', '这个最他妈邪门', '一根刺'].map(p => [p + '-0.15', { sfx: ['glitch', -12] }]),
  // the opening: curtain, the host's tag, the friend's card
  ['@0.12', { sfx: ['whoosh', -11] }], ['@0.62', { sfx: ['pop', -12] }],
  ['干了整整十年+0.45', { sfx: ['pop', -12] }], ['干了整整十年+0.63', { sfx: ['pop', -12] }], ['干了整整十年+0.81', { sfx: ['pop', -12] }],
  ['顿悟', { sfx: ['ding', -9] }], ['这个行业哪是', { sfx: ['pop', -11] }], ['邪门#1', { sfx: ['boom', -6] }],
  ['我给你们盘盘', { sfx: ['coin', -10] }],
  // the three dimensions and the impossible triangle
  ['工作强度#1', { sfx: ['pop', -10] }], ['持续学习#1', { sfx: ['pop', -10] }], ['稳定程度#1', { sfx: ['pop', -10] }], ['能占两样', { sfx: ['ding', -11] }],
  ['不可能三角', { sfx: ['thud', -9] }], ['不可能三角+0.12', { sfx: ['thud', -11] }], ['不可能三角+0.24', { sfx: ['thud', -11] }],
  ['工作强度极大', { sfx: ['zap', -9] }], ['天天拼命学', { sfx: ['thud', -9] }], ['极其不稳定', { sfx: ['glitch', -11] }],
  ['既要', { sfx: ['thud', -6] }], ['又要', { sfx: ['thud', -6] }], ['还要', { sfx: ['thud', -5] }],
  // work intensity
  ['先说第一个+0.3', { sfx: ['thud', -9] }],
  ['很多人可能根本无法想象+0.2', { sfx: ['type', -15] }], ['有多变态', { sfx: ['boom', -8] }],
  ['十五年', { sfx: ['boom', -6] }],
  ['多出来的五年+0.3', { sfx: ['tick', -9] }], ['多出来的五年+0.8', { sfx: ['tick', -9] }], ['多出来的五年+1.3', { sfx: ['tick', -9] }], ['全他妈是加班', { sfx: ['boom', -5] }],
  ['码农下班', { sfx: ['whoosh', -14] }],
  ['魂还挂在', { sfx: ['whoosh', -11] }],
  ['诡异的-0.4', { sfx: ['alarm', -13] }], ['诡异的', { sfx: ['thud', -9] }], ['惊喜', { sfx: ['boom', -8] }],
  ['精神状态+0.4', { sfx: ['boom', -9] }],
  // learning
  ['再说第二个+0.3', { sfx: ['thud', -9] }],
  ['终身学习', { sfx: ['ding', -12] }], ['但别人学门手艺', { sfx: ['pop', -12] }], ['码农学门手艺', { sfx: ['pop', -12] }],
  ['叫续命', { sfx: ['powerup', -6] }],
  ['而计算机技术呢', { sfx: ['pop', -12] }], ['过时淘汰了', { sfx: ['glitch', -11] }],
  ['死局', { sfx: ['thud', -10] }],
  ['爆发式狂补', { sfx: ['boom', -8] }],
  ['呼啸而来', { sfx: ['whoosh', -6] }], ['只用了一夜', { sfx: ['ding', -10] }],
  ['被迫全栈', { sfx: ['thud', -10] }], ['被迫全栈+0.2', { sfx: ['thud', -10] }], ['被迫全栈+0.4', { sfx: ['thud', -10] }], ['被迫全栈+0.6', { sfx: ['thud', -9] }],
  ['扔进垃圾桶+0.7', { sfx: ['thud', -8] }], ['新兵蛋子', { sfx: ['ding', -12] }],
  ['叫积累', { sfx: ['coin', -10] }], ['缓存', { sfx: ['pop', -11] }], ['一键释放+0.2', { sfx: ['boom', -6] }],
  ['高考', { sfx: ['boom', -8] }], ['算法#1', { sfx: ['pop', -12] }], ['网络协议', { sfx: ['pop', -12] }], ['操作系统', { sfx: ['pop', -12] }], ['数据库', { sfx: ['pop', -12] }], ['八股文', { sfx: ['pop', -12] }],
  ['学习真的太累了', { sfx: ['sad', -12] }],
  ['有人还喜欢装+0.8', { sfx: ['pop', -12] }], ['放屁', { sfx: ['boom', -4] }], ['学会了才快乐', { sfx: ['coin', -10] }],
  ['跳什么槽啊', { sfx: ['thud', -10] }],
  // stability
  ['最后一个+0.3', { sfx: ['thud', -9] }],
  ['这个最他妈邪门+0.2', { sfx: ['boom', -5] }],
  ['当祖宗供起来', { sfx: ['powerup', -8] }], ['被嫌弃的老油条', { sfx: ['sad', -8] }],
  ['历史包袱', { sfx: ['thud', -12] }], ['优化掉+0.2', { sfx: ['boom', -5] }],
  ['竟然是他妈我+0.6', { sfx: ['thud', -8] }], ['年纪轻轻的', { sfx: ['sad', -10] }],
  // the end
  ['一根刺+0.3', { sfx: ['zap', -10] }], ['能赚点快钱', { sfx: ['coin', -10] }], ['极其残酷', { sfx: ['glitch', -12] }],
  ['最残忍的地方', { sfx: ['sad', -10] }],
  ['做码农挺好', { sfx: ['ding', -6] }], ['做码农挺好+0.05', { sfx: ['pop', -9] }],
  ['@285.0', { sfx: ['whoosh', -11] }],
];
