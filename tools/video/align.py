"""Align a script to a voice: the script's own characters (the subtitles must say exactly what was written) get
times from whisper's word timestamps, matched character by character. Writes a JS data file for a pixel scene:
  sents: [[t0, t1, text]]   every sentence of the script
  cues:  [[t0, t1, text]]   subtitle lines: no punctuation, at most ~16 characters, swear words softened
  marks: {phrase: t}        when chosen phrases are said ('phrase#2' = its second time), for timing the acting
usage: python3 align.py script.txt whisper.json out.js NAME phrase1 phrase2 ... (or @phrases.txt, one per line)
"""
import difflib
import json
import re
import sys

PUNCT = '，。！？：；、“”‘’…—()（）「」《》,.!?:;"\''
SOFTEN = [('他妈', '他喵'), ('放屁', '放P'), ('卧槽', '我去'), ('牛逼', '牛X'), ('装逼', '装X'), ('白嫖', '白P'), ('高潮', '高涨'), ('拉皮条', '拉皮X'), ('孙子', '孙Z')]           # subtitles only: the voice keeps every word


def main():
    script_path, whisper_path, out, name = sys.argv[1:5]
    phrases = [l for a in sys.argv[5:] for l in (open(a[1:]).read().split('\n') if a.startswith('@') else [a]) if l.strip()]
    script = open(script_path).read()
    W = json.load(open(whisper_path))
    # whisper characters with times (each word's span shared out over its characters)
    wchars, wtimes = [], []
    last = -1.0
    for seg in W['segments']:
        if len(set(seg['text'])) < len(seg['text']) * .25: continue      # a hallucinated loop (one character repeated)
        for w in seg.get('words', []):
            if w['start'] < last - .05: continue                          # time never runs backwards
            last = w['end']
            txt = re.sub(r'\s+', '', w['word'])
            n = len(txt)
            for i, ch in enumerate(txt):
                if ch in PUNCT: continue
                wchars.append(ch); wtimes.append(w['start'] + (w['end'] - w['start']) * (i + .5) / max(1, n))
    # the script's characters (no punctuation or spaces) and where each sits in the script
    schars, spos = [], []
    for i, ch in enumerate(script):
        if ch in PUNCT or ch.isspace(): continue
        schars.append(ch); spos.append(i)
    sm = difflib.SequenceMatcher(None, ''.join(schars), ''.join(wchars), autojunk=False)
    stime = [None] * len(schars)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n): stime[a + k] = wtimes[b + k]
    known = [i for i, t in enumerate(stime) if t is not None]
    print(f'matched {len(known)}/{len(schars)} characters')
    for i in range(len(stime)):                       # fill gaps by interpolating between matched neighbours
        if stime[i] is not None: continue
        lo = max([k for k in known if k < i], default=None); hi = min([k for k in known if k > i], default=None)
        if lo is None: stime[i] = stime[hi]
        elif hi is None: stime[i] = stime[lo]
        else: stime[i] = stime[lo] + (stime[hi] - stime[lo]) * (i - lo) / (hi - lo)
    time_at = {p: stime[k] for k, p in enumerate(spos)}
    def t_of(i0, i1):                                  # first and last timed character in script[i0:i1]
        ks = [k for k, p in enumerate(spos) if i0 <= p < i1]
        return (stime[ks[0]] - .08, stime[ks[-1]] + .25) if ks else None
    # sentences
    sents = []
    for m in re.finditer(r'[^。！？\n]+[。！？”…]*', script):
        txt = m.group().strip()
        if not re.sub(f'[{re.escape(PUNCT)}\\s]', '', txt): continue
        tt = t_of(m.start(), m.end())
        if tt: sents.append([round(tt[0], 3), round(tt[1], 3), txt])
    # subtitle lines: split on punctuation, merge short bits, split long ones
    def clean(s):
        for a, b in SOFTEN: s = s.replace(a, b)
        s = re.sub(f'[{re.escape(PUNCT)}]', ' ', s)
        s = re.sub(r'(?<=[一-鿿])\s+(?=[一-鿿])', '', s)
        return re.sub(r'\s+', ' ', s).strip()
    pieces = [(m.start(), m.end()) for m in re.finditer(r'[^，。！？：；、\n…]+', script) if clean(script[m.start():m.end()])]
    merged = []
    for a, b in pieces:
        if merged and len(clean(script[merged[-1][0]:b])) <= 14 and len(clean(script[a:b])) <= 6 and script[merged[-1][1]:a].strip() in ('，', '、', ''):
            merged[-1] = (merged[-1][0], b)
        else:
            merged.append((a, b))
    cues = []
    def width(txt):                                     # on-screen width in CJK-character units (Latin letters are narrower)
        return sum(1 if ord(ch) > 0x2E80 else .58 if ch != ' ' else .3 for ch in txt)
    def word_bounds(a, b):                              # script positions where a word starts (jieba), or None without it
        try:
            import jieba, logging; jieba.setLogLevel(logging.ERROR)
            for w in [a for a, _ in SOFTEN] + ['他妈的', '屎山代码', '屎山']: jieba.add_word(w, 10 ** 6)
        except ImportError:
            return None
        out, i = set(), a
        for w in jieba.cut(script[a:b]): out.add(i); i += len(w)
        return out
    def split(a, b):
        """Split script[a:b] into subtitle lines no wider than ~17 characters. Cuts only fall between words: never
        inside a run of Latin letters or digits (Engineer stays whole), preferring a space or punctuation near the middle."""
        txt = clean(script[a:b])
        if width(txt) <= 17: return [(a, b)]
        raw = [i for i in range(a, b) if not (script[i] in PUNCT or script[i].isspace())]
        bounds = word_bounds(a, b)
        best = None
        for k in range(2, len(raw) - 1):                # a cut between raw[k-1] and raw[k]
            p, q = raw[k - 1], raw[k]
            if q == p + 1 and script[p].isascii() and script[p].isalnum() and script[q].isascii() and script[q].isalnum(): continue
            if bounds is not None and q not in bounds: continue          # never inside a Chinese word either
            if script[q] in '的了着地得们吗呢啊吧': continue                # nor in front of a particle
            left, right = width(clean(script[a:q])), width(clean(script[q:b]))
            if min(left, right) < 3: continue
            gap = script[p + 1:q]
            score = abs(left - right) - (3 if gap.strip(' ') else 1.5 if gap else 0)   # punctuation, then a space, are the best places
            if best is None or score < best[0]: best = (score, q)
        if best is None: return [(a, b)]
        return split(a, best[1]) + split(best[1], b)
    for a, b in merged:
        for p0, p1 in split(a, b):
            tt = t_of(p0, p1)
            if tt and clean(script[p0:p1]): cues.append([round(tt[0], 3), round(tt[1], 3), clean(script[p0:p1])])
    for i in range(len(cues) - 1):                      # no overlaps, and no flicker in short gaps
        if cues[i + 1][0] - cues[i][1] < .35: cues[i][1] = cues[i + 1][0]
        cues[i][1] = min(cues[i][1], cues[i + 1][0])
    # marks
    marks = {}
    for ph in phrases:
        base, _, nth = ph.partition('#'); nth = int(nth or 1)
        idx = -1
        for _ in range(nth): idx = script.find(base, idx + 1)
        if idx < 0: print('missing phrase', ph); continue
        marks[ph] = round(time_at.get(idx, None) or t_of(idx, idx + len(base))[0], 3)
    data = {'sents': sents, 'cues': cues, 'marks': marks, 'len': round(W['segments'][-1]['end'] + 1.5, 2)}
    open(out, 'w').write(f'// generated by tools/video/align.py\nvar {name} = window.{name} = ' + json.dumps(data, ensure_ascii=False, indent=0) + ';\n')
    print(f'{len(sents)} sentences, {len(cues)} cues, {len(marks)} marks -> {out}')


if __name__ == '__main__':
    main()
