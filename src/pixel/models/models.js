// pixel/models/models.js: the model characters from 问问黑哥's locked roster (问问黑哥/IP/模型角色), as pixel sprites
// on 黑哥's grid. modelPx() takes the same options as heigePx() and clawdPx() (from feel() / emotions()), so a scene can
// cast one the same way; until a model gets a rig of its own it uses the body moves (dy jumps and bobs, sq squashes,
// flip) and the emote over its head, and ignores the face and arm options.
//   modelPx('dsChibi', x, groundY, { ...feel('happy', t), emote: '!', emoteK: 1 })
const MODEL_CAST = {                                                  // name -> sprite in SPRITES
  deepseek: 'dsChibi',
  // the rest of the locked roster (models/roster.js)
  gpt: 'rsGpt', gemini: 'rsGemini', grok: 'rsGrok', muse: 'rsMuse', doubao: 'rsDoubao', qianwen: 'rsQianwen',
  yuanbao: 'rsYuanbao', kimi: 'rsKimi', zhipu: 'rsZhipu', mimo: 'rsMimo', minimax: 'rsMinimax', wenxin: 'rsWenxin',
  // 「黑哥武馆」 V066 (models/wuxia.js)
  xiaoheizi: 'wxXiaoheizi', heige_guanzhu: 'wxHeigeGuanzhu', dario: 'wxDario', ds_menren: 'wxDsMenren', dafeiyu: 'wxDsMenren', liangsheng: 'wxLiangsheng',
  laohuang: 'wxLaohuang', sam: 'wxSam', tudi: 'wxTudi', laoma: 'wxLaoma',
};
const MODEL_SPR = {};
function modelPx(key, x, y, o = {}) {
  key = MODEL_CAST[key] || key; const S = window.SPRITES && SPRITES[key]; if (!S) return;
  const sp = MODEL_SPR[key] || (MODEL_SPR[key] = gridSprite(S.rows, S.pal)), h = S.rows.length;
  const dy = Math.round(o.dy || 0), sq = o.sq || 0;
  if (!o.noShadow && dy < 0) pellipse(x, y, 16, 2, '#00000033'.slice(0, 7));
  if (Math.abs(sq) > .04) {                                           // a squash: drop rows from the middle (or double them)
    const keep = Math.round(h * (1 - sq * .5)), rows = [];
    for (let j = 0; j < keep; j++) rows.push(S.rows[Math.min(h - 1, Math.floor(j * h / keep))]);
    gridSprite(rows, S.pal).draw(x, y + dy, !!o.flip);
  } else sp.draw(x, y + dy, !!o.flip);
  if (o.emote) pxEmote(o.emote, x + (o.flip ? -14 : 14), y + dy - h - 2, o.emoteK ?? 1, o.emoteAge ?? 0, o.flip ? -1 : 1);
}
