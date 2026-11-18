#!/usr/bin/env python3
"""Build 兔标版 Q 版黑哥 (Bunny-Logo Q-Version 黑哥) from Perler-bead extracted views
using the Starbound modular sprite-sheet workflow:
  1. Reads aligned Perler-bead views from design/heige_q/{front_locked,side_out,walk_out,back_out}.png
  2. Normalizes onto unified 58x94 space (ox=29, ground=93) with shared zero-green palette
  3. Splits into Starbound modular parts & animation frames:
       - head:     front, side, back (+ neck collar plug so hops never leave a gap)
       - body:     front.{idle,walk.1..4}, side.{idle,walk.1..4}, back.{idle,walk.1..4}
       - frontarm: down, out, waveA, waveB, point, cheer, chin, walkFwd, walkBack (front/side/back)
       - backarm:  down, out, waveA, waveB, point, cheer, walkFwd, walkBack (front/side/back)
  4. Writes real Starbound sprite sheets (.png + .frames JSON) to docs/heige_q/
  5. Writes JS sprite part table to src/pixel/models/heige_q_parts.js
"""
import json
import os
import sys
import numpy as np
from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pxgrid import Grid, s_capsule  # noqa: E402

W, H = 58, 94
OX, GROUND = 29, 93

# Unified 20-color zero-green palette harmonized across front/side/walk/back & DeepSeek family
PAL = {
    "O": "#12142B",  # deep navy outline
    "K": "#080A18",  # deepest ink / glasses rim / pupil black
    "k": "#1D1E26",  # dark hoodie shadow / cargo shade
    "h": "#2B2C36",  # black hoodie / cap midtone
    "H": "#3E404C",  # cap / hoodie highlight / trim
    "d": "#3A2C2A",  # dark brown hair shadow
    "b": "#5A4D46",  # brown hair midtone
    "B": "#7B685E",  # brown hair highlight
    "s": "#FCDAC4",  # warm chibi skin
    "S": "#E9B393",  # skin shadow / neck shade
    "D": "#C98566",  # deep skin blush/crease
    "e": "#875E3C",  # iris light amber-brown
    "E": "#683322",  # iris dark warm brown
    "W": "#FEFEFE",  # bunny emblem / eye glint / white shoe trim
    "g": "#C8C9D2",  # silver buckle / light sneaker grey
    "G": "#828492",  # sneaker mid grey
    "m": "#565868",  # bag zip / cargo pocket seam
    "M": "#242038",  # cool indigo cloth accent
}


def hex_rgb(hx):
    return tuple(int(hx[i:i + 2], 16) for i in (1, 3, 5))


PAL_RGB = {k: np.array(hex_rgb(v), np.float32) for k, v in PAL.items()}


def map_view_to_grid(path: str, dx: int, dy: int, clean_outline: bool = True) -> Grid:
    arr = np.array(Image.open(os.path.join(REPO, path)).convert("RGBA"))
    keys = list(PAL.keys())
    mat = np.array([PAL_RGB[k] for k in keys])
    g = Grid()
    ah, aw, _ = arr.shape
    for sy in range(ah):
        for sx in range(aw):
            if arr[sy, sx, 3] == 0:
                continue
            tx, ty = sx + dx, sy + dy
            if not (0 <= tx < W and 0 <= ty < H):
                continue
            c = arr[sy, sx, :3].astype(np.float32)
            # Bias near-black hoodie shades properly so skin never absorbs into dark hoodie
            d2 = ((mat - c) ** 2).sum(axis=1)
            k = keys[int(d2.argmin())]
            g[(tx, ty)] = k
    if clean_outline:
        for p in list(g):
            if any((p[0] + ox, p[1] + oy) not in g for ox, oy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                g[p] = "O"
    return g


def stamp_bunny(g: Grid, x0: int, y0: int, rows, on_key="W", off_key=None):
    for j, r in enumerate(rows):
        for i, ch in enumerate(r):
            if ch != ".":
                g[(x0 + i, y0 + j)] = on_key if ch == "W" else ch
            elif off_key is not None:
                g[(x0 + i, y0 + j)] = off_key


def normalize_views():
    # Aligned shift offsets placing all 4 views at head_cx ~ 29.5, ground = 92 (bottom edge 92, outline at 92 -> ground=93)
    front = map_view_to_grid("design/heige_q/front_locked.png", dx=6, dy=2)
    side = map_view_to_grid("design/heige_q/side_out.png", dx=-1, dy=-3)
    walk = map_view_to_grid("design/heige_q/walk_out.png", dx=-1, dy=-3)
    back = map_view_to_grid("design/heige_q/back_out.png", dx=-1, dy=-3)

    # Polish crisp white cap & bag bunnies on side/walk cleanly (wipe full upper crown + cap temple highlight!)
    for sp in (side, walk):
        for y in range(4, 20):
            for x in range(24, 52):
                if (x, y) in sp and sp[(x, y)] in ("W", "g", "G", "B", "h", "H"):
                    sp[(x, y)] = "k"
        for y in range(19, 25):
            for x in range(36, 46):
                if (x, y) in sp and sp[(x, y)] in ("g", "G", "W"):
                    sp[(x, y)] = "d"
        stamp_bunny(sp, 33, 10, [".W.W", ".W.W", "WWWW", "WKWK", ".WWW"])
    # Ensure side pouch has crisp white mini-bunny (x=15..17, y=62..64) matching walk
    for y in range(60, 67):
        for x in range(13, 21):
            if (x, y) in side and side[(x, y)] in ("W", "g", "G"):
                side[(x, y)] = "k"
    stamp_bunny(side, 15, 62, ["W.W", "WWW", "WWW"], off_key="k")
    return front, side, walk, back


def split_front(front: Grid):
    # Front head: y <= 40 + face oval bottom; neck plug behind collar (y=39..46)
    head = front.where(lambda x, y, c: y <= 40 or (y == 41 and 20 <= x <= 38))
    neck = Grid()
    for y in range(39, 46):
        for x in range(26, 33):
            neck[(x, y)] = "S" if y <= 41 else "s"
    # Torso + pants + shoes with hanging left/right outer arms cleanly detached
    # Left arm (screen left) covers x <= 16 for y=47..70; Right arm (screen right) covers x >= 42 for y=47..70
    body = front.where(lambda x, y, c: y >= 41 and not (47 <= y <= 70 and (x <= 15 or x >= 42)))
    # Restore clean dark outline on exposed torso sides (x=16, 41 for y=47..69)
    for y in range(47, 68):
        if (17, y) in body and (16, y) not in body:
            body[(16, y)] = "O"
        if (16, y) in body and (15, y) not in body:
            body[(16, y)] = "O"
        if (40, y) in body and (41, y) not in body:
            body[(41, y)] = "O"
        if (41, y) in body and (42, y) not in body:
            body[(41, y)] = "O"
    # Front hanging arms carved directly from locked sprite (zero visual change in down pose!)
    arm_down_l = front.where(lambda x, y, c: 45 <= y <= 70 and x <= 16)
    arm_down_r = front.where(lambda x, y, c: 45 <= y <= 70 and x >= 41)

    # Clear front hair flecks inside eye boxes on head (preserve glasses rim & iris)
    # Build 4 front walk leg variants: idle, walk.1 (L lift), walk.2 (pass), walk.3 (R lift), walk.4 (pass)
    upper = body.where(lambda x, y, c: y <= 78)
    legs_idle = body.where(lambda x, y, c: y >= 79)

    def shift_feet(dl, dr):
        w_body = upper.copy()
        for (x, y), c in legs_idle.items():
            dy = dl if x < 29 else dr
            ny = y + dy
            if ny <= GROUND - 1:
                w_body[(x, ny)] = c
        return w_body

    return {
        "head": head,
        "neck": neck,
        "body": {
            "idle": body,
            "walk.1": shift_feet(-2, 0),
            "walk.2": shift_feet(-1, 0),
            "walk.3": shift_feet(0, -2),
            "walk.4": shift_feet(0, -1),
        },
        "armL_down": arm_down_l,
        "armR_down": arm_down_r,
    }


def make_front_arm_pose(pose: str, right_side: bool = True) -> Grid:
    """Articulated Starbound front arm for front/back views around shoulder pivot (40, 47) or mirrored."""
    g = Grid()
    if pose == "out":
        arm_pts = s_capsule((39, 48), (48, 49), 2.5)
        hand_pts = s_capsule((49, 49), (52, 49), 2.1)
    elif pose == "waveA":
        arm_pts = s_capsule((39, 48), (48, 42), 2.5)
        hand_pts = s_capsule((49, 40), (50, 38), 2.2)
    elif pose == "waveB":
        arm_pts = s_capsule((39, 48), (47, 39), 2.5)
        hand_pts = s_capsule((48, 37), (48, 35), 2.2)
    elif pose == "point":
        arm_pts = s_capsule((39, 48), (47, 40), 2.4)
        hand_pts = s_capsule((48, 38), (48, 33), 1.6) | s_capsule((47, 38), (49, 38), 1.9)
    elif pose == "cheer":
        arm_pts = s_capsule((39, 47), (46, 37), 2.5)
        hand_pts = s_capsule((47, 35), (47, 33), 2.2)
    elif pose == "chin":
        arm_pts = s_capsule((39, 48), (44, 52), 2.4) | s_capsule((44, 52), (34, 41), 2.1)
        hand_pts = s_capsule((33, 40), (32, 39), 1.8)
    else:
        arm_pts, hand_pts = set(), set()

    for p in arm_pts:
        g[p] = "k" if p[1] >= 49 else "h"
    for p in hand_pts:
        if 0 <= p[0] < W and 0 <= p[1] < H:
            g[p] = "s"
    cuff = {p for p in arm_pts if any((p[0] + dx, p[1] + dy) in hand_pts for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))}
    for p in cuff:
        g[p] = "H"
    g.outline("O")
    if not right_side:
        g = g.mirrored(57)
    return g


def split_side_and_walk(side: Grid, walk: Grid):
    # Side head (y <= 41), walk head drops 1px nicely or stays y<=41
    head_side = side.where(lambda x, y, c: y <= 41)
    # Trim front arm from side standing view: arm drops at x=25..34, y=46..70 (hand y=64..70)
    arm_side_down = side.where(lambda x, y, c: 46 <= y <= 71 and 24 <= x <= 34)
    # Build clean sleeveless side torso (NO transparent hole! Paint over hanging arm seam cleanly)
    body_side = side.where(lambda x, y, c: y >= 41)
    # Clean stray front white dot at x=21 on hip while preserving rear hip bunny at x=15..17
    for y in range(62, 68):
        if body_side.get((21, y)) == "W":
            body_side[(21, y)] = "k"
    # Paint solid hoodie + hem crease + upper pant over hanging arm area (x=23..35, y=47..70)
    for y in range(47, 71):
        for x in range(23, 36):
            if (x, y) not in body_side:
                continue
            if y <= 65:
                body_side[(x, y)] = "k"
            elif y in (66, 67):
                body_side[(x, y)] = "K"
            else:
                body_side[(x, y)] = "k"

    # Extract true stride legs + torso from walk (y >= 42); split forward/backward arms!
    walk_body = walk.where(lambda x, y, c: y >= 42)
    # Front arm swings forward-right in walk_out (x >= 35, y=49..64)
    walk_arm_fwd = walk.where(lambda x, y, c: 48 <= y <= 66 and x >= 35)
    # Back arm swings back-left in walk_out (x <= 19, y=50..69)
    walk_arm_back = walk.where(lambda x, y, c: 49 <= y <= 70 and x <= 19)
    # Keep stride legs + torso (carve away protruding forward hand & backward hand so arms articulate cleanly!)
    walk_legs_body = walk_body.where(lambda x, y, c: not (48 <= y <= 67 and (x >= 37 or x <= 17)))
    for (x, y), c in list(walk_legs_body.items()):
        if y >= 78 and c in ("b", "B", "d", "s", "S", "e", "E"):
            walk_legs_body[(x, y)] = "g" if c == "B" else "H" if c == "d" else "G"
        elif 49 <= y <= 65 and c in ("b", "d"):
            walk_legs_body[(x, y)] = "G" if c == "b" else "H"
    for y in range(49, 66):
        if (36, y) in walk_legs_body and (37, y) not in walk_legs_body:
            walk_legs_body[(36, y)] = "O"
        if (18, y) in walk_legs_body and (17, y) not in walk_legs_body:
            walk_legs_body[(18, y)] = "O"

    # Side 4-frame walk:
    # walk.1 = full stride (right/front foot forward, left/back foot back)
    # walk.2 = passing (standing body shifted 1px up + front shoe tucked 1px)
    # walk.3 = opposite full stride (swapped leg shading so rear/front stride alternates cleanly!)
    # walk.4 = passing
    walk_opp = walk_legs_body.copy()
    for (x, y), c in walk_legs_body.items():
        if y >= 78 and c in ("W", "g", "G"):
            # Subtle luminance swap on opposite stride step so leg alternation reads clearly
            walk_opp[(x, y)] = "G" if c == "g" else "g" if c == "G" else c

    pass_body = Grid()
    for (x, y), c in body_side.items():
        ny = max(40, y - (1 if y <= 84 else 2))
        if (x, ny) not in pass_body or y >= 85:
            pass_body[(x, ny)] = c

    # Articulated Starbound front arm poses facing right around shoulder pivot (29, 47)
    def side_pose(p):
        g = Grid()
        if p == "out":
            ap, hp = s_capsule((28, 48), (40, 49), 2.5), s_capsule((41, 49), (43, 49), 2.1)
        elif p == "waveA":
            ap, hp = s_capsule((28, 48), (38, 42), 2.5), s_capsule((39, 40), (40, 38), 2.2)
        elif p == "waveB":
            ap, hp = s_capsule((28, 48), (37, 39), 2.5), s_capsule((38, 37), (38, 35), 2.2)
        elif p == "point":
            ap, hp = s_capsule((28, 48), (41, 44), 2.4), s_capsule((42, 44), (47, 44), 1.6) | s_capsule((41, 44), (43, 44), 1.9)
        elif p == "cheer":
            ap, hp = s_capsule((28, 47), (35, 36), 2.5), s_capsule((36, 34), (36, 32), 2.2)
        elif p == "chin":
            ap, hp = s_capsule((28, 48), (35, 48), 2.4) | s_capsule((35, 48), (38, 40), 2.1), s_capsule((38, 39), (39, 38), 1.8)
        else:
            return arm_side_down
        for pt in ap:
            g[pt] = "k" if pt[1] >= 49 else "h"
        for pt in hp:
            if 0 <= pt[0] < W and 0 <= pt[1] < H:
                g[pt] = "s"
        cuff = {pt for pt in ap if any((pt[0] + dx, pt[1] + dy) in hp for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))}
        for pt in cuff:
            g[pt] = "H"
        g.outline("O")
        return g

    return {
        "head": head_side,
        "body": {
            "idle": body_side,
            "walk.1": walk_legs_body,
            "walk.2": pass_body,
            "walk.3": walk_opp,
            "walk.4": pass_body,
        },
        "frontarm": {
            "down": arm_side_down,
            "walkFwd": walk_arm_fwd,
            "walkBack": walk_arm_back,
            "out": side_pose("out"),
            "waveA": side_pose("waveA"),
            "waveB": side_pose("waveB"),
            "point": side_pose("point"),
            "cheer": side_pose("cheer"),
            "chin": side_pose("chin"),
        },
        "backarm": {
            "down": Grid(),
            "walkFwd": walk_arm_fwd.shifted(-2, 0),
            "walkBack": walk_arm_back,
        },
    }


def split_back(back: Grid):
    head_back = back.where(lambda x, y, c: y <= 40)
    body_back = back.where(lambda x, y, c: y >= 40 and not (47 <= y <= 70 and (x <= 15 or x >= 42)))
    for y in range(47, 68):
        if (17, y) in body_back and (16, y) not in body_back:
            body_back[(16, y)] = "O"
        if (40, y) in body_back and (41, y) not in body_back:
            body_back[(41, y)] = "O"
    arm_l = back.where(lambda x, y, c: 45 <= y <= 70 and x <= 16)
    arm_r = back.where(lambda x, y, c: 45 <= y <= 70 and x >= 41)
    upper = body_back.where(lambda x, y, c: y <= 78)
    legs = body_back.where(lambda x, y, c: y >= 79)

    def shift_feet(dl, dr):
        w_body = upper.copy()
        for (x, y), c in legs.items():
            ny = y + (dl if x < 29 else dr)
            if ny <= GROUND - 1:
                w_body[(x, ny)] = c
        return w_body

    return {
        "head": head_back,
        "body": {
            "idle": body_back,
            "walk.1": shift_feet(-2, 0),
            "walk.2": shift_feet(-1, 0),
            "walk.3": shift_feet(0, -2),
            "walk.4": shift_feet(0, -1),
        },
        "armL_down": arm_l,
        "armR_down": arm_r,
    }


def grid_to_rgba(g: Grid, w: int = W, h: int = H) -> Image.Image:
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    px = im.load()
    for (x, y), k in g.items():
        if 0 <= x < w and 0 <= y < h:
            px[x, y] = hex_rgb(PAL[k]) + (255,)
    return im


def write_sheet_and_frames(out_dir: str, name: str, ordered_frames: list):
    """ordered_frames: list of (frame_name, Grid) -> writes <name>.png + <name>.frames"""
    os.makedirs(out_dir, exist_ok=True)
    cols = len(ordered_frames)
    sheet = Image.new("RGBA", (cols * W, H), (0, 0, 0, 0))
    names = []
    for i, (fn, g) in enumerate(ordered_frames):
        sheet.paste(grid_to_rgba(g), (i * W, 0))
        names.append(fn)
    png_path = os.path.join(out_dir, f"{name}.png")
    sheet.save(png_path)
    frames_json = {
        "frameGrid": {
            "size": [W, H],
            "dimensions": [cols, 1],
            "names": [names],
        }
    }
    frames_path = os.path.join(out_dir, f"{name}.frames")
    open(frames_path, "w", encoding="utf-8").write(json.dumps(frames_json, indent=2) + "\n")
    return sheet, frames_json


def grid_to_tight_part(g: Grid):
    if not g:
        return {"x": 0, "y": 0, "rows": ["."]}
    x0, y0, x1, y1 = g.bbox()
    return {"x": x0, "y": y0, "rows": g.rows(x0, y0, x1, y1)}


def build_all():
    front, side, walk, back = normalize_views()
    pf = split_front(front)
    ps = split_side_and_walk(side, walk)
    pb = split_back(back)

    # Front/back articulated arms (front foreground layer + mirrored left)
    front_arms_r = {"down": pf["armR_down"]}
    front_arms_l = {"down": pf["armL_down"]}
    for pose in ("out", "waveA", "waveB", "point", "cheer", "chin"):
        front_arms_r[pose] = make_front_arm_pose(pose, right_side=True)
        front_arms_l[pose] = make_front_arm_pose(pose, right_side=False)

    back_arms_r = {"down": pb["armR_down"]}
    back_arms_l = {"down": pb["armL_down"]}
    for pose in ("out", "waveA", "waveB", "point", "cheer"):
        back_arms_r[pose] = make_front_arm_pose(pose, right_side=True)
        back_arms_l[pose] = make_front_arm_pose(pose, right_side=False)

    # 1) Write real Starbound PNG + .frames modular sheets into docs/heige_q/
    sb_dir = os.path.join(REPO, "docs", "heige_q")
    s_head, _ = write_sheet_and_frames(sb_dir, "head", [("front", pf["head"]), ("side", ps["head"]), ("back", pb["head"])])
    body_frames = (
        [(f"front.{k}", g) for k, g in pf["body"].items()]
        + [(f"side.{k}", g) for k, g in ps["body"].items()]
        + [(f"back.{k}", g) for k, g in pb["body"].items()]
    )
    s_body, _ = write_sheet_and_frames(sb_dir, "body", body_frames)
    fa_frames = [(f"front.{k}", g) for k, g in front_arms_r.items()] + [(f"side.{k}", g) for k, g in ps["frontarm"].items()]
    s_fa, _ = write_sheet_and_frames(sb_dir, "frontarm", fa_frames)
    ba_frames = [(f"front.{k}", g) for k, g in front_arms_l.items()] + [(f"side.{k}", g) for k, g in ps["backarm"].items()]
    s_ba, _ = write_sheet_and_frames(sb_dir, "backarm", ba_frames)

    # 2) Build visual verification sheet in docs/heige_q/starbound-breakdown.png
    pad = 16
    scale = 3
    sheets = [("head.png (3 views)", s_head), ("body.png (idle + 4-frame walks)", s_body), ("frontarm.png (articulated foreground)", s_fa), ("backarm.png (articulated rear)", s_ba)]
    max_w = max(s.width * scale for _, s in sheets) + pad * 2
    tot_h = sum(s.height * scale + 34 for _, s in sheets) + pad
    card = Image.new("RGB", (max_w, tot_h), (24, 22, 46))
    dr = ImageDraw.Draw(card)
    cy = pad
    for title, s in sheets:
        dr.text((pad, cy), title, fill=(255, 212, 59))
        cy += 18
        up = s.resize((s.width * scale, s.height * scale), Image.NEAREST)
        card.paste(up, (pad, cy), up)
        cy += up.height + 16
    card.save(os.path.join(sb_dir, "starbound-breakdown.png"))

    # 3) Write JS part dictionary src/pixel/models/heige_q_parts.js
    parts = {
        "front.neck": grid_to_tight_part(pf["neck"]),
        "front.head": grid_to_tight_part(pf["head"]),
        "side.head": grid_to_tight_part(ps["head"]),
        "back.head": grid_to_tight_part(pb["head"]),
    }
    for vname, d in (("front", pf["body"]), ("side", ps["body"]), ("back", pb["body"])):
        for k, g in d.items():
            parts[f"{vname}.body.{k}"] = grid_to_tight_part(g)
    for k, g in front_arms_r.items():
        parts[f"front.armR.{k}"] = grid_to_tight_part(g)
    for k, g in front_arms_l.items():
        parts[f"front.armL.{k}"] = grid_to_tight_part(g)
    for k, g in ps["frontarm"].items():
        parts[f"side.frontarm.{k}"] = grid_to_tight_part(g)
    for k, g in ps["backarm"].items():
        parts[f"side.backarm.{k}"] = grid_to_tight_part(g)
    for k, g in back_arms_r.items():
        parts[f"back.armR.{k}"] = grid_to_tight_part(g)
    for k, g in back_arms_l.items():
        parts[f"back.armL.{k}"] = grid_to_tight_part(g)

    data = {"w": W, "h": H, "ox": OX, "ground": GROUND, "pal": PAL, "parts": parts}
    models_path = os.path.join(REPO, "src", "pixel", "models", "models.js")
    txt = open(models_path, encoding="utf-8").read()
    blob = "const HGQ_PARTS = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";"
    import re
    new_txt = re.sub(
        r"// BEGIN_HGQ_PARTS.*?// END_HGQ_PARTS",
        "// BEGIN_HGQ_PARTS\n" + blob + "\n// END_HGQ_PARTS",
        txt, flags=re.S,
    )
    assert new_txt != txt, "Markers // BEGIN_HGQ_PARTS .. // END_HGQ_PARTS not found in models.js"
    open(models_path, "w", encoding="utf-8").write(new_txt)
    print(f"Wrote {len(parts)} Starbound modular parts into {models_path} + sheets in {sb_dir}")


if __name__ == "__main__":
    build_all()
