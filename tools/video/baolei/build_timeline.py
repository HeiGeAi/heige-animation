#!/usr/bin/env python3
"""
Build out/video/baolei/timeline.json and src/pixel/scenes/baolei_data.js
from out/video/baolei/voice.json (Whisper word timestamps) and out/video/baolei/script.txt.
"""
import difflib
import json
import os
import re
import subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
VOICE_MP3 = os.path.join(ROOT, "out/video/baolei/voice.mp3")
VOICE_JSON = os.path.join(ROOT, "out/video/baolei/voice.json")
SCRIPT_TXT = os.path.join(ROOT, "out/video/baolei/script.txt")
OUT_JSON = os.path.join(ROOT, "out/video/baolei/timeline.json")
OUT_JS = os.path.join(ROOT, "src/pixel/scenes/baolei_data.js")

SOFTEN = [("他妈", "他喵")]

# Whisper phonetic confusions normalized solely for alignment (display text stays verbatim)
WHISPER_FIX = [
    ("老马能", "老码农"),
    ("老码龙", "老码农"),
    ("刷了", "刷到"),
    ("爆雷", "暴雷"),
    ("漏成这样", "漏成这样"),
    ("露成这样", "漏成这样"),
    ("做了一屋子", "坐了一屋子"),
    ("early", "TM"),
    ("一只基建", "一支基建"),
    ("围建围楼", "违建危楼"),
    ("围建", "违建"),
    ("文莫", "文末"),
    ("全站", "全栈"),
    ("壶水泥", "糊水泥"),
    ("提交钱", "提交前"),
    ("绝技", "绝迹"),
    ("SONAR", "Sonar"),
    ("Cloud", "Claude"),
    ("6一条", "6亿条"),
    ("直写不读", "只写不读"),
    ("爆错", "报错"),
    ("八竿子打不找", "八竿子打不着"),
    ("扒杆子", "八竿子"),
    ("案管", "暗管"),
    ("叫真意行行", "较真一行行"),
    ("狂胡", "狂糊"),
    ("违剑微楼", "违建危楼"),
    ("20分钟里明白", "二十分钟理明白"),
    ("彻底格死", "彻底隔死"),
    ("手工工事", "手工公式"),
    ("观众老爷们", "观众姥爷们"),
    ("弃墙", "砌墙"),
    ("他楼", "塌楼"),
    ("真正在", "真正该"),
]

KEYS = [
    "暴雷", "降本增效", "线上事故", "资损", "复盘会", "背锅", "屎山代码",
    "基建狂魔", "违建危楼", "保命铁律", "全栈", "前端部门", "高压喷枪", "糊水泥",
    "承重墙", "Sonar", "GitClear", "只写不读", "Claude", "DeepSeek", "豆包",
    "42%", "96%", "48%", "99%", "50%", "6 亿", "70%", "81%", "47%",
    "三个扎心的", "脱稿讲清楚", "物理隔开", "测试库", "生产库", "问问黑哥",
    "不吹AI也不恐惧AI", "只说真话",
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


def is_cjk(ch):
    return "\u4e00" <= ch <= "\u9fff"


def extract_whisper_chars(voice):
    """Expand whisper word timestamps to ordered (char, s, e) tuples."""
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
            raw = re.sub(r"[，。！？、,.!?;:“”\"'「」\s]+", "", raw)
            if not raw:
                continue
            # Normalize whisper quirks (case-insensitive Cloud->Claude, TM->他妈, etc.) per word
            raw_norm = re.sub(r"(?i)\bTM\b", "他妈", raw)
            raw_norm = re.sub(r"(?i)cloud", "Claude", raw_norm)
            ws, we = float(w["start"]), float(w["end"])
            dt = max(0.01, we - ws) / max(1, len(raw_norm))
            for idx, ch in enumerate(raw_norm):
                chars.append((ch, ws + idx * dt, ws + (idx + 1) * dt))
    # Apply multi-char whisper fixes (works for equal or near-equal length via string splice with inherited bounds)
    arr = list(chars)
    for bad, good in WHISPER_FIX:
        s_joined = "".join(c for c, _, _ in arr)
        start = 0
        while True:
            idx = s_joined.find(bad, start)
            if idx < 0:
                break
            b_s = arr[idx][1]
            b_e = arr[idx + len(bad) - 1][2]
            step = max(0.005, b_e - b_s) / max(1, len(good))
            rep = [(ch, b_s + k * step, b_s + (k + 1) * step) for k, ch in enumerate(good)]
            arr = arr[:idx] + rep + arr[idx + len(bad):]
            s_joined = "".join(c for c, _, _ in arr)
            start = idx + len(good)
    return arr


def norm_char(ch):
    ch = ch.lower()
    return CN_DIGITS.get(ch, ch)


def parse_script(raw_lines):
    """Return script lines with display cues (punctuation split) and clean character sequences."""
    lines_out = []
    for raw in raw_lines:
        raw = raw.strip()
        if not raw:
            continue
        disp = soften(raw)
        # Split long sentences into clean subtitle cues at punctuation
        parts = [p.strip() for p in re.split(r"[，。！？；：、]+", disp) if p.strip()]
        # Strip outer quotes in display subtitles
        clean_parts = []
        for p in parts:
            p = re.sub(r"[「」“”‘’\"']", "", p).strip()
            if not p:
                continue
            # Further split overly long clauses (>20 chars) cleanly near middle space or jieba boundary if needed
            while len(p) > 21:
                cut = p.rfind(" ", 10, 20)
                if cut <= 0:
                    cut = 18
                clean_parts.append(p[:cut].strip())
                p = p[cut:].strip()
            if p:
                clean_parts.append(p)
        # Clean line string without spaces/punct (must match t array 1:1)
        w_clean = re.sub(r"[「」“”‘’\"'，。！？；：、\s%％]+", lambda m: "%" if "%" in m.group(0) or "％" in m.group(0) else "", disp)
        w_for_align = re.sub(r"[「」“”‘’\"'，。！？；：、\s]+", "", raw)
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

    # Concatenate all script characters for global SequenceMatcher alignment
    s_chars = []
    line_spans = []
    for li, ln in enumerate(slines):
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

    # Anchor boundaries and linearly interpolate unmatched spans cleanly
    n = len(s_chars)
    # Find anchors
    anchors = [(i, matched_t[i], matched_end[i]) for i in range(n) if matched_t[i] is not None]
    if not anchors:
        raise RuntimeError("Alignment found 0 matching characters!")

    times = [0.0] * n
    ends = [0.0] * n
    # Before first anchor
    first_i, first_s, first_e = anchors[0]
    for i in range(first_i + 1):
        times[i] = round(first_s * (i / max(1, first_i)), 3) if first_i > 0 else round(first_s, 3)
        ends[i] = round(first_e, 3)
    # Between anchors
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
    # Last anchor & trailing
    li, lts, lte = anchors[-1]
    times[li] = round(lts, 3)
    ends[li] = round(lte, 3)
    if li < n - 1:
        rem = max(0.05, dur - lte)
        gap = n - 1 - li
        for k in range(1, gap + 1):
            times[li + k] = round(lte + rem * (k - 1) / gap, 3)
            ends[li + k] = round(lte + rem * k / gap, 3)

    # Monotonicity guard
    for i in range(1, n):
        if times[i] < times[i - 1]:
            times[i] = times[i - 1]
        if ends[i] < times[i]:
            ends[i] = round(times[i] + 0.05, 3)

    # Build lines[] and cues[]
    out_lines = []
    out_cues = []
    for idx, ln in enumerate(slines):
        i0, i1 = line_spans[idx]
        ts = times[i0:i1]
        s_t = round(ts[0], 3)
        e_t = round(max(ends[i1 - 1], ts[-1] + 0.08), 3)
        out_lines.append({"s": s_t, "e": e_t, "w": ln["w"], "t": ts})

        # Map each split part of this line to character indices in ln["w"]
        cursor = i0
        for part in ln["parts"]:
            clean_part = re.sub(r"\s+", "", part)
            if not clean_part:
                continue
            pos = cursor
            # Locate first char of clean_part starting at cursor
            end_pos = min(i1, pos + len(clean_part))
            cs = round(times[pos], 3)
            ce = round(ends[end_pos - 1] if end_pos > pos else cs + 0.3, 3)
            out_cues.append([cs, ce, part])
            cursor = end_pos

    # Ensure cues are non-overlapping, gap-free within continuous speech, and cover ending smoothly
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
        f.write("// generated by tools/video/baolei/build_timeline.py from script.txt and voice.mp3\n")
        f.write("var BAOLEI_DATA = window.BAOLEI_DATA = ")
        json.dump(data, f, ensure_ascii=False)
        f.write(";\n")

    ratio = matched_count / max(1, n) * 100
    print(f"Duration: {dur}s | Script chars: {n} | Whisper chars: {len(wchars)} | Exact match: {matched_count}/{n} ({ratio:.1f}%)")
    print(f"Lines: {len(out_lines)} | Cues: {len(out_cues)}")
    # Report any line with low match ratio for inspection
    for idx, ln in enumerate(slines):
        i0, i1 = line_spans[idx]
        m = sum(1 for k in range(i0, i1) if matched_t[k] is not None)
        tot = i1 - i0
        if m / max(1, tot) < 0.7:
            print(f"  [LOW MATCH {m}/{tot}] @ {out_lines[idx]['s']:.2f}s: {ln['w']}")


if __name__ == "__main__":
    main()
