"""V058 让 AI 说人话（Blake 录音 2026-10-26）：整段录音的 whisper 逐词时间 + 逐字稿，生成两份时间轴，像素片和嵌入层共用。
  1. 工程/src/timeline.json：Remotion 用，{total, lines:[{scene, text, start, end, words:[{w,t,e}]}]}，一句一行
  2. heige-animation/src/pixel/scenes/shuohua_data.js：像素场景用，SHUOHUA_DATA = {cues, keys, len, lines:[{s,e,w,t}]}
字幕照稿子原文出（去标点），脏话只在字幕里和谐，人声不动。
用法：python3 build_v13.py <逐字稿.txt> <whisper.json> <音频总时长秒> <timeline.json> <shuohua_data.js>
"""
import json, re, sys, difflib

src, wj, total, out_tl, out_js = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4], sys.argv[5]
PUNCT = set("，。！？、：；「」“”‘’,.!?;:（）() …—-\n\t")
SOFT = [("傻逼", "傻X"), ("牛逼", "牛X"), ("白嫖", "白P"), ("放个屁", "放个P")]
KEYS = ["GitHub", "GPT", "Claude Code", "Claude", "API", "Token", "Star", "Commit", "Python", "RAG", "Bug", "我是中国人", "余生只维护你一个项目"]

# 句子：段落里按 。！？ 切，问号叹号留在句尾
paras = [p.strip() for p in open(src).read().split("\n\n") if p.strip()]
lines = []
for pi, p in enumerate(paras):
    for m in re.finditer(r"[^。！？]+[。！？]?", p):
        s = m.group().strip()
        if [ch for ch in s if ch not in PUNCT and not ch.isspace()]: lines.append({"scene": f"p{pi:02d}", "text": s})

# whisper 字和时间（一个词的时长均分给它的字）
wchars = []
last = -1.0
for seg in json.load(open(wj))["segments"]:
    if len(set(seg["text"])) < len(seg["text"]) * .25: continue
    for w in seg.get("words", []):
        if w["start"] < last - .05: continue
        last = w["end"]
        cs = [c for c in w["word"] if c not in PUNCT and not c.isspace()]
        if not cs: continue
        d = (w["end"] - w["start"]) / len(cs)
        for k, c in enumerate(cs): wchars.append((c.lower(), w["start"] + d * k, w["start"] + d * (k + 1)))

schars = [(li, c) for li, l in enumerate(lines) for c in l["text"] if c not in PUNCT and not c.isspace()]
A = [c.lower() for _, c in schars]; B = [c for c, _, _ in wchars]
times = [None] * len(A)
for blk in difflib.SequenceMatcher(None, A, B, autojunk=False).get_matching_blocks():
    for k in range(blk.size): times[blk.a + k] = (wchars[blk.b + k][1], wchars[blk.b + k][2])
matched = sum(1 for x in times if x)
idx = [i for i, x in enumerate(times) if x]
for i in range(len(times)):
    if times[i]: continue
    prev = max([j for j in idx if j < i], default=None); nxt = min([j for j in idx if j > i], default=None)
    if prev is None: t0, t1, a, b = 0.0, times[nxt][0], -1, nxt
    elif nxt is None: t0, t1, a, b = times[prev][1], total, prev, len(times)
    else: t0, t1, a, b = times[prev][1], times[nxt][0], prev, nxt
    span = (t1 - t0) / (b - a); st = t0 + span * (i - a - 1); times[i] = (st, st + span)
# 时间不倒流
for i in range(1, len(times)):
    if times[i][0] < times[i - 1][0]: times[i] = (times[i - 1][0], max(times[i - 1][0], times[i][1]))

for li, l in enumerate(lines):
    ws = [{"w": c, "t": round(times[k][0], 3), "e": round(times[k][1], 3)} for k, (L, c) in enumerate(schars) if L == li]
    l["words"] = ws; l["start"] = ws[0]["t"]; l["end"] = ws[-1]["e"]

tl = {"total": round(total, 3), "lines": [{**l, "text": l["text"]} for l in lines]}
json.dump(tl, open(out_tl, "w"), ensure_ascii=False, indent=1)

# 字幕：每句按逗号切块，块太短往后并，块太长对半切；时间取块首字，到下一块开始
def wid(s):   # 字幕宽度：汉字算 1，英文字母和数字算 0.55
    return sum(1 if "\u4e00" <= ch <= "\u9fff" else .55 for ch in s if not ch.isspace())
def soft(s):
    for a, b in SOFT: s = s.replace(a, b)
    return re.sub(r"[「」“”‘’]", "", s).strip()   # subtitles carry no punctuation, quotes included
cues = []
for li, l in enumerate(lines):
    chunks = [c.strip() for c in re.split(r"[，、：；。！？]", l["text"]) if c.strip()]
    merged = []
    for c in chunks:
        if merged and len(re.sub(r"\s", "", merged[-1])) + len(re.sub(r"\s", "", c)) <= 14: merged[-1] += " " + c
        else: merged.append(c)
    final = []
    for c in merged:
        if wid(c) <= 18: final.append(c); continue
        # 没逗号的长句：用 jieba 分词找词边界，在离中间近、又不把词组劈开的地方断
        # 加分：下一词是 是/就/让/把/给/去… 或上一词是 因为/所以/其实…；减分：上一词是「的」，或下一词是 的/了/着/过
        import jieba
        toks, pos = [], 0
        for w in jieba.lcut(c): pos += len(w); toks.append((w, pos))
        START = {"是", "就", "都", "也", "还", "让", "把", "给", "去", "在", "跟", "直接", "然后", "但是", "所以", "因为", "如果", "就是", "才", "又", "再", "先"}
        AFTER = {"因为", "所以", "其实", "然后", "但是", "如果", "就是", "比如", "结果"}
        k = len(c) // 2; best, cut = 1e9, k
        for j in range(len(toks) - 1):
            w, e = toks[j]; nxt = toks[j + 1][0].strip() or (toks[j + 2][0] if j + 2 < len(toks) else "")
            L, R = wid(c[:e]), wid(c[e:])
            if L < 4 or R < 4 or L > 18 or R > 18: continue
            sc = abs(e - k) - (6 if nxt in START else 0) - (6 if w in AFTER else 0) + (8 if w == "的" else 0) + (10 if nxt in {"的", "了", "着", "过", "地", "得"} else 0)
            if sc < best: best, cut = sc, e
        final += [c[:cut].strip(), c[cut:].strip()]
    pos = 0
    for c in final:
        n = len([ch for ch in c if ch not in PUNCT and not ch.isspace()])
        t0 = l["words"][min(pos, len(l["words"]) - 1)]["t"]; pos += n
        cues.append([round(t0, 2), None, soft(c)])
for i, c in enumerate(cues): c[1] = cues[i + 1][0] if i + 1 < len(cues) else round(total, 2)
data = {"cues": cues, "keys": KEYS, "marks": {}, "len": round(total, 3),
        "lines": [{"s": l["start"], "e": l["end"], "w": "".join(w["w"] for w in l["words"]), "t": [w["t"] for w in l["words"]]} for l in lines]}
open(out_js, "w").write("// generated by tools/video/nvyou/build_timeline.py from the script and Blake's voice: subtitles and per-line character times for scenes/nvyou.js\n"
                        f"var NVYOU_DATA = window.NVYOU_DATA = {json.dumps(data, ensure_ascii=False)};\n")
print(f"chars {len(A)} matched {matched} ({matched / len(A):.1%}); lines {len(lines)}; cues {len(cues)}; total {total}")
for i, l in enumerate(lines): print(f"{i:3d} {l['start']:7.2f} {l['end']:7.2f} {l['text'][:30]}")
