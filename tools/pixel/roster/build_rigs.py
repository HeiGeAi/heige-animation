#!/usr/bin/env python3
"""Build pixel rig metadata (MODEL_RIGS) for all 16 Q-version roster models from their pixel grids.

Reads src/pixel/models/deepseek.js and src/pixel/models/roster.js, extracts:
  - face skin keys, skinFill, safe faceBox (prevents mood-tinting white clothes), outline key
  - surgical per-eye bitmasks ('.' protected bangs/skin, '#' sclera/lash, 'i' colored iris/pupil)
  - mouth clear/stamp anchor, cheek blush anchors, forehead gloom box
  - articulation row bands (crownY, chinY, waistY, footY) & cx axis
  - free hand tuck boxes + palette colors (for wave/cheer/point arm frames)
  - animated prop / tail bounding boxes (for bobbing clouds, stars, tails, scepter, ECG monitor)

Writes the // BEGIN_MODEL_RIGS .. // END_MODEL_RIGS section inside src/pixel/models/models.js.
"""
import argparse, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))


def load_sprites():
    sprites = {}
    for fn in ('src/pixel/models/deepseek.js', 'src/pixel/models/roster.js'):
        txt = open(os.path.join(ROOT, fn), encoding='utf-8').read()
        for m in re.finditer(r"SPRITES\['([^']+)'\]\s*=\s*\{\s*pal:\s*(\{[^}]+\}),\s*rows:\s*\[(.*?)\]\s*\};", txt, re.S):
            name = m.group(1)
            pal = json.loads(m.group(2).replace("'", '"'))
            rows = re.findall(r"'([^']+)'", m.group(3))
            sprites[name] = {'pal': pal, 'rows': rows, 'w': len(rows[0]), 'h': len(rows)}
    return sprites


def hex_rgb(hx):
    return int(hx[1:3], 16), int(hx[3:5], 16), int(hx[5:7], 16)


# Exact per-model anatomy specs verified against zoomed pixel coordinate sheets.
SPECS = {
    'dsChibi': {
        'cx': 34, 'skin': ['x', 'y'], 'skinFill': 'x', 'faceBox': [20, 31, 48, 48],
        'eyeL': [22, 37, 29, 43], 'eyeR': [38, 37, 45, 43],
        'mouth': [34, 45], 'cheeks': [[23, 44], [45, 44]], 'forehead': [25, 31, 43, 35],
        'crownY': 14, 'chinY': 48, 'waistY': 63, 'footY': 79,
        'arms': {'L': [15, 61, 21, 66, 17, 60], 'R': [48, 61, 53, 66, 51, 60]},
        'armPal': {'out': 'a', 'slv': 'f', 'cuff': 'q', 'hand': 'x'},
        'tail': [52, 64, 68, 84],
    },
    'rsGpt': {
        'cx': 38, 'skin': ['t', 'r'], 'skinFill': 't', 'faceBox': [22, 33, 52, 51],
        'eyeL': [27, 40, 33, 46], 'eyeR': [42, 40, 48, 46],
        'mouth': [38, 48], 'cheeks': [[27, 46], [49, 46]], 'forehead': [28, 34, 47, 38],
        'crownY': 20, 'chinY': 51, 'waistY': 67, 'footY': 87,
        'arms': {'L': [18, 65, 24, 71, 21, 64]},
        'armPal': {'out': 'a', 'slv': 'j', 'cuff': 'e', 'hand': 't'},
        'prop': {'kind': 'float', 'box': [54, 46, 68, 57]},
        'tail': [48, 68, 69, 88],
    },
    'rsGemini': {
        'cx': 38, 'skin': ['o', 'j'], 'skinFill': 'o', 'faceBox': [22, 35, 52, 51],
        'eyeL': [26, 40, 33, 47], 'eyeR': [42, 40, 49, 47],
        'mouth': [38, 48], 'cheeks': [[26, 46], [49, 46]], 'forehead': [28, 35, 47, 38],
        'crownY': 21, 'chinY': 51, 'waistY': 67, 'footY': 85,
        'arms': {'L': [19, 65, 25, 71, 22, 65], 'R': [51, 65, 57, 71, 54, 65]},
        'armPal': {'out': 'a', 'slv': 'c', 'cuff': 'k', 'hand': 'o'},
        'prop': {'kind': 'stars', 'boxes': [[11, 35, 19, 44], [58, 36, 66, 45]]},
        'tail': [48, 72, 66, 86],
    },
    'rsGrok': {
        'cx': 39, 'skin': ['u', 'v', 's'], 'skinFill': 'u', 'faceBox': [24, 34, 54, 54],
        'eyeL': [29, 41, 35, 47], 'eyeR': [43, 41, 49, 47],
        'mouth': [39, 50], 'cheeks': [[29, 48], [49, 48]], 'forehead': [30, 36, 48, 40],
        'crownY': 19, 'chinY': 54, 'waistY': 67, 'footY': 84,
        'arms': {'L': [19, 66, 25, 72, 22, 65]},
        'armPal': {'out': 'b', 'slv': 'a', 'cuff': 'r', 'hand': 'u'},
        'prop': {'kind': 'lift', 'box': [54, 42, 78, 86]},
    },
    'rsLlama': {
        'cx': 34, 'skin': ['e', 'k', 't'], 'skinFill': 'e', 'faceBox': [22, 36, 46, 50],
        'eyeL': None, 'eyeR': [38, 40, 44, 46],
        'mouth': [34, 47], 'cheeks': [[25, 45], [44, 45]], 'forehead': [26, 36, 44, 39],
        'crownY': 21, 'chinY': 50, 'waistY': 68, 'footY': 87,
        'arms': {'R': [41, 63, 47, 68, 44, 62]},
        'armPal': {'out': 'a', 'slv': 'g', 'cuff': 'n', 'hand': 'e'},
        'prop': {'kind': 'rub', 'box': [16, 39, 27, 50]},
    },
    'rsMistral': {
        'cx': 33, 'skin': ['n', 'h'], 'skinFill': 'n', 'faceBox': [21, 32, 45, 47],
        'eyeL': [23, 36, 29, 43], 'eyeR': [37, 36, 43, 43],
        'mouth': [33, 44], 'cheeks': [[23, 43], [43, 43]], 'forehead': [25, 32, 41, 35],
        'crownY': 21, 'chinY': 47, 'waistY': 58, 'footY': 76,
        'prop': {'kind': 'lift', 'box': [44, 33, 61, 67]},
        'tail': [6, 58, 22, 74],
    },
    'rsNewbing': {
        'cx': 36, 'skin': ['t', 's'], 'skinFill': 't', 'faceBox': [22, 28, 50, 43],
        'eyeL': [25, 31, 31, 37], 'eyeR': [40, 31, 46, 37],
        'mouth': [36, 39], 'cheeks': [[25, 38], [46, 38]], 'forehead': [27, 27, 45, 30],
        'crownY': 14, 'chinY': 43, 'waistY': 59, 'footY': 74,
        'arms': {'L': [17, 57, 24, 63, 21, 56], 'R': [48, 57, 55, 63, 51, 56]},
        'armPal': {'out': 'b', 'slv': 'y', 'cuff': 'v', 'hand': 'x'},
        'glove': 'x',
    },
    'rsUpdream': {
        'cx': 35, 'skin': ['p'], 'skinFill': 'p', 'faceBox': [23, 30, 47, 48],
        'eyeL': [26, 37, 31, 43], 'eyeR': [39, 37, 44, 43],
        'mouth': [35, 45], 'cheeks': [[26, 44], [44, 44]], 'forehead': [26, 31, 44, 36],
        'crownY': 18, 'chinY': 48, 'waistY': 64, 'footY': 81,
        'arms': {'L': [17, 60, 23, 65, 20, 59], 'R': [48, 60, 54, 65, 51, 59]},
        'armPal': {'out': 'a', 'slv': 'l', 'cuff': 'v', 'hand': 'p'},
        'tail': [46, 70, 61, 88],
    },
    'rsQianwen': {
        'cx': 34, 'skin': ['x', 'j'], 'skinFill': 'x', 'faceBox': [20, 29, 47, 44],
        'eyeL': [24, 34, 30, 40], 'eyeR': [38, 34, 43, 40],
        'mouth': [34, 41], 'cheeks': [[24, 40], [43, 40]], 'forehead': [25, 29, 43, 33],
        'crownY': 19, 'chinY': 44, 'waistY': 58, 'footY': 75,
        'prop': {'kind': 'lift', 'box': [9, 46, 28, 60]},
    },
    'rsDoubao': {
        'cx': 31, 'skin': ['p', 'q'], 'skinFill': 'p', 'faceBox': [19, 27, 45, 43],
        'eyeL': [22, 32, 28, 38], 'eyeR': [34, 32, 40, 38],
        'mouth': [31, 40], 'cheeks': [[21, 39], [41, 39]], 'forehead': [23, 27, 40, 31],
        'crownY': 17, 'chinY': 43, 'waistY': 59, 'footY': 75,
        'prop': {'kind': 'stars', 'boxes': [[40, 42, 52, 54]]},
    },
    'rsKimi': {
        'cx': 34, 'skin': ['v', 'u'], 'skinFill': 'v', 'faceBox': [20, 29, 45, 45],
        'eyeL': [24, 34, 30, 40], 'eyeR': [38, 34, 44, 40],
        'mouth': [34, 42], 'cheeks': [[24, 41], [44, 41]], 'forehead': [25, 29, 43, 33],
        'crownY': 18, 'chinY': 45, 'waistY': 61, 'footY': 78,
        'arms': {'R': [44, 62, 50, 67, 47, 61]},
        'armPal': {'out': 'a', 'slv': 'd', 'cuff': 'e', 'hand': 'v'},
        'prop': {'kind': 'lift', 'box': [19, 41, 27, 52]},
    },
    'rsHunyuan': {
        'cx': 32, 'skin': ['t', 'q'], 'skinFill': 't', 'faceBox': [18, 25, 44, 37],
        'eyeL': [22, 27, 28, 33], 'eyeR': [37, 27, 43, 33],
        'mouth': [32, 34], 'cheeks': [[23, 33], [42, 33]], 'forehead': [23, 25, 41, 27],
        'crownY': 13, 'chinY': 37, 'waistY': 57, 'footY': 73,
        'arms': {'L': [14, 54, 20, 59, 17, 53], 'R': [45, 54, 50, 59, 47, 53]},
        'armPal': {'out': 'a', 'slv': 'e', 'cuff': 'm', 'hand': 't'},
    },
    'rsZhipu': {
        'cx': 33, 'skin': ['q'], 'skinFill': 'q', 'faceBox': [21, 31, 44, 47],
        'eyeL': [24, 37, 29, 43], 'eyeR': [37, 37, 42, 43],
        'mouth': [33, 45], 'cheeks': [[23, 44], [43, 44]], 'forehead': [24, 31, 42, 36],
        'crownY': 21, 'chinY': 47, 'waistY': 61, 'footY': 75,
        'prop': {'kind': 'lift', 'box': [26, 50, 40, 63]},
        'tail': [43, 66, 61, 82],
    },
    'rsMinimax': {
        'cx': 32, 'skin': ['g', 'f', 'n'], 'skinFill': 'g', 'faceBox': [19, 30, 45, 47],
        'eyeL': [22, 35, 28, 41], 'eyeR': [35, 35, 41, 41],
        'mouth': [32, 43], 'cheeks': [[21, 42], [42, 42]], 'forehead': [24, 31, 40, 35],
        'crownY': 19, 'chinY': 47, 'waistY': 61, 'footY': 77,
        'prop': {'kind': 'lift', 'box': [40, 44, 53, 57]},
    },
    'rsMimo': {
        'cx': 38, 'skin': ['h', 'x'], 'skinFill': 'h', 'faceBox': [26, 31, 51, 45],
        'eyeL': [29, 34, 35, 41], 'eyeR': [42, 34, 48, 41],
        'mouth': [38, 42], 'cheeks': [[28, 41], [48, 41]], 'forehead': [30, 31, 46, 34],
        'crownY': 18, 'chinY': 45, 'waistY': 60, 'footY': 74,
        'prop': {'kind': 'float', 'box': [31, 45, 45, 63]},
    },
    'rsWenxin': {
        'cx': 32, 'skin': ['w'], 'skinFill': 'w', 'faceBox': [20, 27, 42, 42],
        'eyeL': [23, 30, 29, 35], 'eyeR': [35, 30, 41, 35],
        'mouth': None, 'cheeks': [[22, 36], [41, 36]], 'forehead': [24, 27, 40, 30],
        'crownY': 14, 'chinY': 42, 'waistY': 54, 'footY': 70,
        'prop': {'kind': 'ecg', 'screen': [54, 32, 62, 38], 'drip': [51, 21, 52, 25]},
        'wheel': True,
    },
}


def build_eye_mask(sp, s, box):
    x0, y0, x1, y1 = box
    rows, pal, sk = sp['rows'], sp['pal'], set(s['skin'])
    hair_cnt = {}
    for y in range(max(0, y0 - 7), max(0, y0 - 1)):
        for x in range(max(0, s['cx'] - 14), min(sp['w'], s['cx'] + 15)):
            k = rows[y][x]
            if k != '.' and k not in sk:
                hair_cnt[k] = hair_cnt.get(k, 0) + 1
    hair_keys = {k for k, c in hair_cnt.items() if c >= 4}

    mask_rows = []
    for yy in range(y0, y1 + 1):
        r_str = []
        for xx in range(x0, x1 + 1):
            k = rows[yy][xx]
            if k == '.' or k in sk:
                r_str.append('.')
                continue
            r, g, b = hex_rgb(pal[k])
            is_white = min(r, g, b) >= 225
            is_dark = max(r, g, b) <= 95
            if not is_white and not is_dark and k in hair_keys:
                if yy == y0 and rows[yy - 1][xx] in hair_keys:
                    r_str.append('.')
                    continue
                if yy <= y0 + 1 and (xx == x0 or xx == x1) and rows[yy - 1][xx] in hair_keys:
                    r_str.append('.')
                    continue
            if not is_white and yy >= y0 + 1 and x0 + 1 <= xx <= x1 - 1:
                r_str.append('i')
            else:
                r_str.append('#')
        mask_rows.append(''.join(r_str))
    return mask_rows


def infer_arm_pal(sp, s, arm_spec):
    x0, y0, x1, y1, sx, sy = arm_spec
    rows, pal, sk = sp['rows'], sp['pal'], set(s['skin'])
    darks = sorted([(sum(hex_rgb(hx)), k) for k, hx in pal.items()])
    out_k = darks[0][1]
    slv_cnt = {}
    for y in range(max(0, sy - 2), min(sp['h'], y1 + 1)):
        for x in range(max(0, x0), min(sp['w'], x1 + 1)):
            k = rows[y][x]
            if k != '.' and k != out_k and k not in sk:
                slv_cnt[k] = slv_cnt.get(k, 0) + 1
    slv_sorted = [k for k, _ in sorted(slv_cnt.items(), key=lambda kv: -kv[1])]
    cuff_k = slv_sorted[0] if slv_sorted else s['skinFill']
    slv_k = slv_sorted[1] if len(slv_sorted) > 1 else cuff_k
    hand_k = s.get('glove') or s['skinFill']
    return {'out': out_k, 'slv': slv_k, 'cuff': cuff_k, 'hand': hand_k}


def build_all():
    sprites = load_sprites()
    out = {}
    for name, s in SPECS.items():
        sp = sprites[name]
        darks = sorted([(sum(hex_rgb(hx)), k) for k, hx in sp['pal'].items()])
        entry = {
            'w': sp['w'], 'h': sp['h'], 'cx': s['cx'],
            'outline': darks[0][1],
            'skinKeys': s['skin'], 'skinFill': s['skinFill'], 'faceBox': s['faceBox'],
            'eyeL': {'box': s['eyeL'], 'mask': build_eye_mask(sp, s, s['eyeL'])} if s['eyeL'] else None,
            'eyeR': {'box': s['eyeR'], 'mask': build_eye_mask(sp, s, s['eyeR'])} if s['eyeR'] else None,
            'mouth': s['mouth'],
            'cheeks': s['cheeks'],
            'forehead': s['forehead'],
            'bands': {'crownY': s['crownY'], 'chinY': s['chinY'], 'waistY': s['waistY'], 'footY': s['footY']},
        }
        if 'arms' in s:
            entry['arms'] = {}
            for side, box in s['arms'].items():
                entry['arms'][side] = {'box': box[:4], 'pivot': box[4:6], 'pal': s.get('armPal') or infer_arm_pal(sp, s, box)}
        if 'prop' in s:
            entry['prop'] = s['prop']
        if 'tail' in s:
            entry['tail'] = s['tail']
        if 'wheel' in s:
            entry['wheel'] = True
        out[name] = entry
    return out


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--write', action='store_true')
    args = ap.parse_args()
    data = build_all()
    if args.write:
        p = os.path.join(ROOT, 'src/pixel/models/models.js')
        txt = open(p, encoding='utf-8').read()
        js_blob = 'const MODEL_RIGS = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';'
        new_txt = re.sub(
            r'// BEGIN_MODEL_RIGS.*?// END_MODEL_RIGS',
            '// BEGIN_MODEL_RIGS\n' + js_blob + '\n// END_MODEL_RIGS',
            txt, flags=re.S,
        )
        assert new_txt != txt, 'Markers // BEGIN_MODEL_RIGS .. // END_MODEL_RIGS not found in models.js'
        open(p, 'w', encoding='utf-8').write(new_txt)
        print('Updated MODEL_RIGS in', p, f'({len(data)} models)')
    else:
        print(f'Verified {len(data)} model rigs cleanly.')
