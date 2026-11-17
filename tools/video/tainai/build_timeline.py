#!/usr/bin/env python3
"""
Build out/video/tainai/timeline.json and src/pixel/scenes/tainai_data.js
from out/video/tainai/voice.json (Whisper word timestamps) and out/video/tainai/script.txt.
"""
import difflib
import json
import os
import re
import subprocess

try:
    import jieba
    HAS_JIEBA = True
except Exception:
    HAS_JIEBA = False

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
VOICE_MP3 = os.path.join(ROOT, "out/video/tainai/voice.mp3")
VOICE_JSON = os.path.join(ROOT, "out/video/tainai/voice.json")
SCRIPT_TXT = os.path.join(ROOT, "out/video/tainai/script.txt")
OUT_JSON = os.path.join(ROOT, "out/video/tainai/timeline.json")
OUT_JS = os.path.join(ROOT, "src/pixel/scenes/tainai_data.js")

SOFTEN = [("他妈", "他喵")]

# Whisper phonetic confusions normalized solely for alignment (display text stays verbatim)
WHISPER_FIX = [
    ("释出来", "试出来"),
    ("挨了讯", "挨了训"),
    ("暗号", "案号"),
    ("停时", "平时"),
    ("退废", "退费"),
    ("把我把", "帮我把"),
    ("给自己原话", "给自己圆话"),
    ("红老人", "哄老人"),
    ("爆出", "报出"),
    ("讲话位", "讲话味"),
    ("Anthoropic", "Anthropic"),
    ("anthropic", "Anthropic"),
    ("deep seek", "DeepSeek"),
    ("deepseek", "DeepSeek"),
    ("Deepseek", "DeepSeek"),
    ("kimi", "Kimi"),
    ("KIMI", "Kimi"),
    ("讲得明明白白", "讲得明明白白"),
    ("讲的明明白白", "讲得明明白白"),
    ("特客气的", "特客气地"),
    ("改的自然", "改得自然"),
    ("坑得最狠", "坑得最狠"),
    ("坑的最狠", "坑得最狠"),
    ("篡改", "篡改"),
    ("窜改", "篡改"),
    ("训戒", "训诫"),
    ("训界", "训诫"),
    ("西林区", "西陵区"),
    ("验师法", "验尸法"),
    ("验施法", "验尸法"),
    ("彩虹P", "彩虹屁"),
    ("老太乃", "老太奶"),
    ("12345", "一二三四五"),
    ("三万块", "三万块"),
    ("3万块", "三万块"),
    ("五款", "5款"),
    ("五篇", "5篇"),
    ("四篇", "4篇"),
    ("一篇标题", "1篇标题"),
    ("五句", "5句"),
    ("八十岁", "80岁"),
]

KEYS = [
    "80 岁", "老太奶", "科学网", "量子纠缠", "分隔两地", "左右手套",
    "豆包", "DeepSeek", "Kimi", "正确的废话", "5 句提示词", "当场在法庭上挨了训",
    "客客气气", "拿不准尺度", "哄老人的耐心", "结合上述情况", "活人气",
    "吹彩虹屁", "三万块钱", "Anthropic", "5 款主流 AI 助手", "讨好人",
    "哈佛商业评论", "事前验尸法", "30%", "三个大坑",
    "你确定吗", "DeepMind", "当场改口", "实测过", "大学生短视频成瘾",
    "4 篇根本查不到", "配错了作者和年份", "另开新窗口", "不用给自己圆话",
    "写初稿和挑毛病", "湖北宜昌西陵区法院", "没有全面核实的案例", "当庭就被训诫",
    "假法条", "严禁编造任何法条和案号", "那确实累", "少走一半弯路",
    "被 AI 坑得最狠", "大家都爱这么玩", "问问黑哥", "不吹AI也不恐惧AI", "只说真话",
]

CN_DIGITS = {"0": "零", "1": "一", "2": "二", "3": "三", "4": "四", "5": "五", "6": "六", "7": "七", "8": "八", "9": "九"}


def get_duration():
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", VOICE_MP3],
        text=True,
    ).strip()
    return round(float(out), 3)


def soften(text):
    for a, b in SOFTEN:
        text = text.replace(a, b)
    return text


def split_long_clause(p, max_len=21):
    """Split long clauses cleanly at word boundaries without breaking English tokens or particles."""
    if len(p) <= max_len:
        return [p]
    tokens = []
    if HAS_JIEBA:
        # Preserve ASCII words/numbers intact
        for m in re.finditer(r"[A-Za-z0-9.%]+|[^A-Za-z0-9.%]+", p):
            seg = m.group(0)
            if re.match(r"^[A-Za-z0-9.%]+$", seg):
                tokens.append(seg)
            else:
                tokens.extend(jieba.lcut(seg))
    else:
        tokens = re.findall(r"[A-Za-z0-9.%]+|\s+|.", p)

    # Merge leading particles onto previous token so we never start a line with 的/了/吗/呢/啊/吧
    merged = []
    for tk in tokens:
        if merged and tk.strip() in ("的", "了", "着", "地", "得", "们", "吗", "呢", "啊", "吧", "呀"):
            merged[-1] += tk
        else:
            merged.append(tk)

    out = []
    cur = ""
    target = max(12, min(17, len(p) // 2 + 2))
    for tk in merged:
        if len(cur) >= target and len(cur + tk) > max_len:
            out.append(cur.strip())
            cur = tk.lstrip()
        else:
            cur += tk
    if cur.strip():
        out.append(cur.strip())
    return out


def extract_whisper_chars(voice):
    chars = []
    for seg in voice.get("segments", []):
        words = seg.get("words") or []
        if not words:
            txt = re.sub(r"[，。！？、,.!?;:\s]+", "", seg.get("text", ""))
            if not txt:
                continue
            s0, e0 = float(seg["start"]), float(seg["end"])
            dt = max(0.02, e0 - s0) / len(txt)
            for idx, ch in enumerate(txt):
                chars.append((ch, s0 + idx * dt, s0 + (idx + 1) * dt))
            continue
        for w in words:
            raw = w.get("word", "").strip()
            raw = re.sub(r"[，。！？、,.!?;:“”\"'「」《》\s]+", "", raw)
            if not raw:
                continue
            ws, we = float(w["start"]), float(w["end"])
            dt = max(0.01, we - ws) / max(1, len(raw))
            for idx, ch in enumerate(raw):
                chars.append((ch, ws + idx * dt, ws + (idx + 1) * dt))

    arr = list(chars)
    for bad, good in WHISPER_FIX:
        bad_clean = bad.replace(" ", "")
        good_clean = good.replace(" ", "")
        s_joined = "".join(c for c, _, _ in arr)
        start = 0
        while True:
            idx = s_joined.find(bad_clean, start)
            if idx < 0:
                break
            b_s = arr[idx][1]
            b_e = arr[idx + len(bad_clean) - 1][2]
            step = max(0.005, b_e - b_s) / max(1, len(good_clean))
            rep = [(ch, b_s + k * step, b_s + (k + 1) * step) for k, ch in enumerate(good_clean)]
            arr = arr[:idx] + rep + arr[idx + len(bad_clean):]
            s_joined = "".join(c for c, _, _ in arr)
            start = idx + len(good_clean)
    return arr


def norm_char(ch):
    ch = ch.lower()
    return CN_DIGITS.get(ch, ch)


def parse_script(raw_lines):
    lines_out = []
    for raw in raw_lines:
        raw = raw.strip()
        if not raw:
            continue
        disp = soften(raw)
        parts = [p.strip() for p in re.split(r"[，。！？；：、]+", disp) if p.strip()]
        clean_parts = []
        for p in parts:
            p = re.sub(r"[「」“”‘’\"'《》]", "", p).strip()
            if not p:
                continue
            for sp in split_long_clause(p, 21):
                if sp:
                    clean_parts.append(sp)
        w_for_align = re.sub(r"[「」“”‘’\"'《》，。！？；：、\s]+", "", raw)
        w_for_disp = soften(w_for_align)
        if w_for_disp:
            lines_out.append({
                "raw": raw,
                "w_align": w_for_align,
                "w": w_for_disp,
                "parts": clean_parts,
            })
    return lines_out


def main():
    dur = get_duration()
    with open(VOICE_JSON, "r", encoding="utf-8") as f:
        voice = json.load(f)
    with open(SCRIPT_TXT, "r", encoding="utf-8") as f:
        raw_lines = f.read().splitlines()

    wchars = extract_whisper_chars(voice)
    slines = parse_script(raw_lines)

    s_chars = []
    line_spans = []
    for ln in slines:
        i0 = len(s_chars)
        for ch in ln["w_align"]:
            s_chars.append(ch)
        line_spans.append((i0, len(s_chars)))

    a_norm = [norm_char(c) for c in s_chars]
    b_norm = [norm_char(c) for c, _, _ in wchars]

    sm = difflib.SequenceMatcher(None, a_norm, b_norm, autojunk=False)
    matched_t = [None] * len(s_chars)
    matched_end = [None] * len(s_chars)
    matched_count = 0
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            for k in range(i2 - i1):
                matched_t[i1 + k] = wchars[j1 + k][1]
                matched_end[i1 + k] = wchars[j1 + k][2]
                matched_count += 1

    n = len(s_chars)
    anchors = [(i, matched_t[i], matched_end[i]) for i in range(n) if matched_t[i] is not None]
    if not anchors:
        raise RuntimeError("Alignment found 0 matching characters!")

    times = [0.0] * n
    ends = [0.0] * n
    first_i, first_s, first_e = anchors[0]
    for i in range(first_i + 1):
        times[i] = round(first_s * (i / max(1, first_i)), 3) if first_i > 0 else round(first_s, 3)
        ends[i] = round(first_e, 3)
    for idx in range(len(anchors) - 1):
        i1, t1s, t1e = anchors[idx]
        i2, t2s, _ = anchors[idx + 1]
        times[i1] = round(t1s, 3)
        ends[i1] = round(t1e, 3)
        gap = i2 - i1
        if gap > 1:
            span = max(0.01, t2s - t1e)
            for k in range(1, gap):
                times[i1 + k] = round(t1e + span * (k - 0.5) / gap, 3)
                ends[i1 + k] = round(t1e + span * k / gap, 3)
    li, lts, lte = anchors[-1]
    times[li] = round(lts, 3)
    ends[li] = round(lte, 3)
    if li < n - 1:
        rem = max(0.05, dur - lte)
        gap = n - 1 - li
        for k in range(1, gap + 1):
            times[li + k] = round(lte + rem * (k - 1) / gap, 3)
            ends[li + k] = round(lte + rem * k / gap, 3)

    for i in range(1, n):
        if times[i] < times[i - 1]:
            times[i] = times[i - 1]
        if ends[i] < times[i]:
            ends[i] = round(times[i] + 0.05, 3)

    out_lines = []
    out_cues = []
    for idx, ln in enumerate(slines):
        i0, i1 = line_spans[idx]
        ts = times[i0:i1]
        s_t = round(ts[0], 3)
        e_t = round(max(ends[i1 - 1], ts[-1] + 0.08), 3)
        out_lines.append({"s": s_t, "e": e_t, "w": ln["w"], "t": ts})

        cursor = i0
        for part in ln["parts"]:
            clean_part = re.sub(r"\s+", "", part)
            if not clean_part:
                continue
            pos = cursor
            end_pos = min(i1, pos + len(clean_part))
            cs = round(times[pos], 3)
            ce = round(ends[end_pos - 1] if end_pos > pos else cs + 0.3, 3)
            out_cues.append([cs, ce, part])
            cursor = end_pos

    for i in range(len(out_cues) - 1):
        if out_cues[i + 1][0] - out_cues[i][1] < 0.35:
            out_cues[i][1] = out_cues[i + 1][0]
        if out_cues[i][1] > out_cues[i + 1][0]:
            out_cues[i][1] = out_cues[i + 1][0]
    if out_cues:
        out_cues[-1][1] = min(dur, round(max(out_cues[-1][1], dur - 0.5), 3))

    data = {
        "cues": out_cues,
        "keys": KEYS,
        "marks": {},
        "len": dur,
        "lines": out_lines,
    }
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    with open(OUT_JS, "w", encoding="utf-8") as f:
        f.write("// generated by tools/video/tainai/build_timeline.py from script.txt and voice.mp3\n")
        f.write("var TAINAI_DATA = window.TAINAI_DATA = ")
        json.dump(data, f, ensure_ascii=False)
        f.write(";\n")

    ratio = matched_count / max(1, n) * 100
    print(f"Duration: {dur}s | Script chars: {n} | Whisper chars: {len(wchars)} | Exact match: {matched_count}/{n} ({ratio:.1f}%)")
    print(f"Lines: {len(out_lines)} | Cues: {len(out_cues)}")
    for idx, ln in enumerate(slines):
        i0, i1 = line_spans[idx]
        m = sum(1 for k in range(i0, i1) if matched_t[k] is not None)
        tot = i1 - i0
        if m / max(1, tot) < 0.7:
            print(f"  [LOW MATCH {m}/{tot}] @ {out_lines[idx]['s']:.2f}s: {ln['w']}")


if __name__ == "__main__":
    main()
