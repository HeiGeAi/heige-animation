"""Build 黑哥's pixel rig: the parts the JS rig (src/pixel/heige.js) stacks every frame, one set per view.

  face + cap   the approved chibi's head (build_chibi.build(features=False): no brows, eyes or mouth; those are stamped
               per emotion), split so the cap can pop up on a take, with hair drawn under it
  neck         a column of skin behind the collar, so a bobbing head never shows a gap
  torso        the turnaround concept's body (art/heige/turnaround, from pixelize.py), re-proportioned to the chibi's rows
               (torso +2, legs -3), arms cut away
  legs         the same body below the hem, extended up behind the torso; walk and crouch frames derived from it
  arms         the hanging arm from the concept; every other pose drawn here from three joints (shoulder, elbow,
               wrist), following the generated pose sheets (concept art, kept out of the repo)

Sprite space: the front chibi's 51 × 87 grid, feet on row 86, mirror axis x = 25.5 (axis2 = 51).
usage: python3 build_heige_rig.py      writes src/pixel/heige_parts.js and out/art/heige_*.png (previews)
"""
import json
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_chibi as bc  # noqa: E402
from pxgrid import Grid, fill, s_capsule, s_ell, s_poly, s_rect, sheet  # noqa: E402
import heige_heads as HH  # noqa: E402
import heige_turn as HT  # noqa: E402

REPO = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
PREVIEW = os.path.join(REPO, 'out', 'art')
OUT_JS = os.path.join(REPO, 'src', 'pixel', 'heige_parts.js')
P = dict(bc.P)
AXIS2 = 51
CLOTH = 'kcmhr'
SKIN = 'sSdl'


def mirror(g): return g.mirrored(AXIS2)


# ---------- head: face, cap, hair under the cap, neck ----------
def head_parts():
    full = Grid.from_rows([''.join(r) for r in bc.build(features=False)])
    face_set = s_ell(25.5, 33.6, 15.6, 12.6, 2.45)
    head = full.where(lambda x, y, c: y <= 41 or (y <= 45 and (x, y) in face_set))
    # the cap: crown and brim (and the bunny), everything above the brim's lower edge that isn't skin, hair or ear
    def y_bot(x): return 21.2 + ((x - 25.5) / 19.5) ** 2 * 3.6 if abs(x - 25.5) <= 20 else 99
    def in_cap(x, y, c):
        if y <= 13: return True
        if c in SKIN or c in 'bB': return False
        if 4 <= x <= 47 and y <= min(round(y_bot(x)) + 1, 25): return True
        return False
    cap = head.where(in_cap)
    face = head.where(lambda x, y, c: (x, y) not in cap)
    # hair under the cap: a dome of hair behind the face, seen only when the cap lifts
    dome = {(x, y) for (x, y) in s_ell(25.5, 26.5, 18.2, 13.5, 2.3) if 12 <= y <= 27}
    under = Grid()
    fill(under, dome, 'b', 'O')
    for (x, y) in list(under):
        if under[(x, y)] == 'b' and (x + y) % 5 == 0 and y < 20: under[(x, y)] = 'B'
    hair = Grid({p: c for p, c in under.items() if p not in face})
    neck = Grid()
    fill(neck, s_rect(22, 44, 8, 9), 's')
    for x in range(22, 30): neck[(x, 44)] = 'S'; neck[(x, 45)] = 'S'
    return face, cap, hair, neck


# ---------- body: the turnaround's front, re-proportioned ----------
def front_body():
    return HT.view('front').where(lambda x, y, c: y >= 46)


def torso_bounds(y):
    """Left and right edge columns of the torso (arm cut lines), symmetric about 25.5."""
    if y <= 50: return 12, 39
    if y <= 55: return 14, 37
    if y <= 61: return 15, 36
    return 14, 37


def split_front(body):
    torso, legs, armL, armR = Grid(), Grid(), Grid(), Grid()
    for (x, y), c in body.items():
        if y <= 70:
            L, R = torso_bounds(y)
            (torso if L <= x <= R else armL if x < L else armR)[(x, y)] = c
        elif y <= 75 and not (15 <= x <= 36):
            (armL if x < 25 else armR)[(x, y)] = c
        else:
            legs[(x, y)] = c
    for y in range(51, 71):                                    # close the torso's cut edges with outline
        L, R = torso_bounds(y)
        for x in (L, R):
            if (x, y) in torso: torso[(x, y)] = 'O'
    # the drawstrings: cyan, as in the approved chibi
    for (x, y), c in list(torso.items()):
        if c in 'rhy' and 51 <= y <= 63 and 20 <= x <= 32 and x not in (24, 25, 26, 27): torso[(x, y)] = 'y'
    for x in (22, 29):
        if (x, 51) in torso: torso[(x, 51)] = 'Y'
    # the legs reach up behind the torso, so a bounce never opens a gap at the waist
    for y in range(66, 71):
        for x in range(15, 37): legs.setdefault((x, y), 'k' if x in (15, 36) else 'c')
    return torso, legs, armL, armR


# ---------- arms ----------
SHOULDER_L = (14.5, 53.5)


# Hands for the LEFT arm, drawn pixel by pixel (the right arm mirrors them, which also puts each thumb on the inside).
HANDS = {
    'fist':  ['.OOOOO.', 'OsOsOsO', 'OssssSO', 'OssssSO', 'OddsSSO', '.OSSSO.', '..OOO..'],
    'palm':  ['.O.O.O..', 'OsOsOsO.', 'OsOsOsO.', 'OsssssOO', 'OsssssdO', 'OSssssO.', '.OSsSO..', '..OOO...'],
    'palmT': ['O.O.O...', 'sOsOsO..', 'sOsOsOO.', 'OsssssOO', '.OsssssO', '.OSssSO.', '..OSSO..', '...OO...'],
    'point': ['..OO....', '.OsSO...', '.OsSO...', '.OsSO...', '.OsSOO..', 'OOsSssO.', 'OsOsOsO.', 'OssssSO.', 'OddsSSO.', '.OSSSO..', '..OOO...'],
}


def hand_mitten(cx, cy, kind):
    """A hand pattern centred on (cx, cy)."""
    rows = HANDS[kind]; w, h = len(rows[0]), len(rows)
    return Grid.from_rows(rows).shifted(round(cx - w / 2), round(cy - h / 2))


def arm_from_joints(S, E, W, hand, hand_at=None, r=3.6):
    """A hoodie sleeve along shoulder S -> elbow E -> wrist W (radius r), a cuff at the wrist, and a hand."""
    g = Grid()
    sleeve = s_capsule(S, E, r) | s_capsule(E, W, r)
    fill(g, sleeve, 'c', 'O')
    # shade: the half of the sleeve away from the light (down and to the right of each segment)
    for (a, b) in ((S, E), (E, W)):
        vx, vy = b[0] - a[0], b[1] - a[1]; L = math.hypot(vx, vy) or 1
        nx, ny = -vy / L, vx / L
        if nx + ny < 0: nx, ny = -nx, -ny                       # normal pointing down-right
        for (x, y) in s_capsule(a, b, r - 1.2):
            px, py = x + .5 - a[0], y + .5 - a[1]
            if g.get((x, y)) == 'c' and px * nx + py * ny > r * .35: g[(x, y)] = 'k'
    # the cuff: a dark band across the forearm, two pixels back from the wrist
    vx, vy = W[0] - E[0], W[1] - E[1]; L = math.hypot(vx, vy) or 1; ux, uy = vx / L, vy / L
    cuff = s_capsule((W[0] - ux * 2.2, W[1] - uy * 2.2), (W[0] - ux * 1.2, W[1] - uy * 1.2), r - .9)
    for p in cuff:
        if g.get(p) in ('c', 'k'): g[p] = 'k'
    # the hand, past the wrist
    hx, hy = hand_at or (W[0] + ux * 3.2, W[1] + uy * 3.2)
    g.paste(hand_mitten(hx, hy, hand))
    return g


ARM_POSES = {
    #          shoulder elbow         wrist          hand     hand centre (None = past the wrist)
    'low':     (None, (11.5, 59.5), (7.5, 64.5), 'fist', (5.5, 68.0)),
    'out':     (None, (8.5, 56.5), (2.5, 57.5), 'fist', (-1.5, 57.5)),
    'up':      (None, (8.5, 48.5), (2.5, 43.5), 'fist', (-1.0, 40.5)),
    'cheer':   (None, (7.5, 46.5), (0.5, 39.5), 'fist', (-2.0, 35.5)),
    'point':   (None, (6.5, 47.5), (2.5, 37.5), 'point', (1.5, 31.5)),
    'waveA':   (None, (8.5, 59.5), (6.5, 49.5), 'palm', (5.5, 44.5)),
    'waveB':   (None, (8.5, 59.5), (4.5, 50.5), 'palmT', (3.0, 45.5)),
    'fistUp':  (None, (8.5, 59.5), (7.5, 49.5), 'fist', (7.0, 45.5)),
    'hip':     (None, (5.5, 60.5), (11.5, 66.5), 'fist', (13.5, 67.5)),
    'chin':    (None, (13.5, 63.5), (19.5, 53.5), 'fist', (21.0, 49.5)),
    'belly':   (None, (14.5, 64.5), (23.5, 64.5), 'fist', (26.5, 63.5)),
    'cover':   (None, (9.5, 58.5), (12.5, 42.5), 'fist', (15.0, 36.5)),
    'scratch': (None, (6.5, 46.5), (4.5, 36.5), 'palm', (5.5, 31.5)),
    'clasp':   (None, (12.5, 62.5), (19.5, 59.5), 'fist', (23.0, 58.5)),
}


def front_arms(armL_down):
    arms = {'down': armL_down}
    for name, (S, E, W, hand, hat) in ARM_POSES.items():
        arms[name] = arm_from_joints(S or SHOULDER_L, E, W, hand, hat)
    return arms


# ---------- the other views: q (three-quarters), side, back; all facing right, from the turnaround ----------
VIEW_SPLIT = {   # per view: the torso's column range by row (arms are cut off outside it), and the hands' rows
    'q':    lambda y: (0, 60) if y <= 49 else (16, 34) if y <= 57 else (17, 35),
    'back': lambda y: (0, 60) if y <= 51 else (15, 36) if y <= 61 else (14, 37),
}


def legs_up(legs, x0, x1):
    """Fill the pants up behind the torso (rows 66-70), so a bounce never shows a gap at the waist."""
    for y in range(66, 71):
        for x in range(x0, x1 + 1): legs.setdefault((x, y), 'k' if x in (x0, x1) else 'c')
    return legs


def split_view(view, body):
    torso, legs, armA, armB = Grid(), Grid(), Grid(), Grid()     # armA: screen-left arm, armB: screen-right
    if view == 'side':
        # the near arm hangs in front of the torso: cut it out, and fill the torso in behind it
        for (x, y), c in body.items():
            if 50 <= y <= 74 and 16 <= x <= 26 and not (y >= 71 and x > 26): armA[(x, y)] = c
            if y <= 70: torso[(x, y)] = c
            elif not (16 <= x <= 26 and y <= 74): legs[(x, y)] = c
        for y in range(51, 70):
            for x in range(17, 26): torso[(x, y)] = 'k' if x <= 18 else 'c'
        for x in range(17, 26): torso[(x, 70)] = 'k'
        legs_up(legs, 17, 30)
        return torso, legs, armA, armB
    bounds = VIEW_SPLIT[view]
    for (x, y), c in body.items():
        if y <= 70:
            L, R = bounds(y)
            (torso if L <= x <= R else armA if x < L else armB)[(x, y)] = c
        elif y <= 74 and (x < 15 or x > 35):
            (armA if x < 25 else armB)[(x, y)] = c
        else:
            legs[(x, y)] = c
    for y in range(50, 71):
        L, R = bounds(y)
        if L > 0:
            for x in (L, R):
                if (x, y) in torso: torso[(x, y)] = 'O'
    legs_up(legs, 15, 36)
    return torso, legs, armA, armB


def view_parts(view):
    ai = HT.view(view)
    face, cap = {'q': HH.q_head, 'side': HH.side_head, 'back': HH.back_head}[view](ai)
    body = HH.fill_holes(ai.where(lambda x, y, c: y >= 46 or (y >= 43 and c in 'kcmhr' and not (12 <= x <= 40 and y <= 45))))
    body = Grid({p: c for p, c in body.items() if p[1] >= 43 and p not in face and p not in cap})
    torso, legs, armA, armB = split_view(view, body)
    # the drawstrings: cyan, as in the front
    for (x, y), c in list(torso.items()):
        if c == 'r' and 50 <= y <= 60 and view != 'back' and torso.get((x, y - 1)) in ('r', 'y', 'O', 'k', 'c'): torso[(x, y)] = 'y'
    neck = Grid(); fill(neck, s_rect(21 if view != 'side' else 23, 43, 8, 10), 'S' if view == 'back' else 's')
    return {'face': face, 'cap': cap, 'neck': neck, 'torso': torso, 'legs': legs, 'armA': armA, 'armB': armB}


# ---------- walking legs ----------
def leg_frames(view, legs):
    """stand, plus walking drawings. Front, back and three-quarter views lift one foot at a time, by one pixel then
    two (stepL1, stepL2, stepR1, stepR2); the side view strides, both legs drawn from the standing pair (near leg in
    front, far leg darker behind), leaned from the hip and lifted as each swings through (side.legs.w0 .. w7)."""
    frames = {'stand': legs}
    if view in ('front', 'back', 'q'):
        mid = 25
        for side, tag in ((-1, 'L'), (1, 'R')):
            for lift in (1, 2):
                g = Grid()
                for (x, y), c in legs.items():
                    lifted = (x <= mid) if side < 0 else (x > mid)
                    if lifted and y >= 71: g[(x, y - lift)] = c
                for (x, y), c in legs.items():                   # the standing leg is drawn over the lifted one
                    if not ((x <= mid) if side < 0 else (x > mid)) or y < 71: g[(x, y)] = c
                frames[f'step{tag}{lift}'] = g
    else:
        far = Grid({p: {'c': 'k', 'k': 'O', 'w': 'g', 'g': 'G', 'm': 'k', 'h': 'm', 'G': 'k'}.get(c, c) for p, c in legs.items()})
        def leg(g, k, lift):                                     # lean from the hip (row 71) by k px at the sole, lift
            return Grid({(x + round(max(0, y - 71) / 15 * k), y - (lift if y >= 71 else 0)): c for (x, y), c in g.items()})
        # eight drawings: the near leg plants in front and pushes back (stance), then swings through lifted
        K = [6, 3, 0, -3, -6, -3, 0, 3]; LIFT_N = [0, 0, 0, 0, 0, 1, 2, 1]; LIFT_F = [0, 1, 2, 1, 0, 0, 0, 0]
        for i in range(8):
            g = Grid(); g.paste(leg(far, -K[i], LIFT_F[i]).shifted(-1, 0)); g.paste(leg(legs, K[i], LIFT_N[i]))
            frames[f'w{i}'] = g
    return frames


# ---------- write ----------
def part(g):
    x0, y0, x1, y1 = g.bbox()
    return {'x': x0, 'y': y0, 'rows': g.rows(x0, y0, x1, y1)}


def main():
    face, cap, hair, neck = head_parts()
    torso, legs, armL_down, armR_down = split_front(front_body())
    arms = front_arms(armL_down)
    parts = {'front.face': face, 'front.cap': cap, 'front.hair': hair, 'front.neck': neck, 'front.torso': torso}
    for name, g in leg_frames('front', legs).items(): parts[f'front.legs.{name}'] = g
    for name, g in arms.items(): parts[f'front.arm.{name}'] = g
    for view in ('q', 'side', 'back'):
        V = view_parts(view)
        for k in ('face', 'cap', 'neck', 'torso'): parts[f'{view}.{k}'] = V[k]
        for name, g in leg_frames(view, V['legs']).items(): parts[f'{view}.legs.{name}'] = g
        for side in ('armA', 'armB'):
            if not V[side]: continue
            parts[f'{view}.{side}.down'] = V[side]
            if view in ('q', 'side'):                          # walking swings: the arm leans from the shoulder
                for name, k in (('fwd', 3), ('back', -3)):
                    parts[f'{view}.{side}.{name}'] = Grid({(x + round(max(0, y - 52) / 22 * k), y): c for (x, y), c in V[side].items()})
    pal = dict(P)
    js = ['// heige_parts.js: generated by tools/pixel/build_heige_rig.py; edit that (or the art it reads), not this.',
          'var HG_PARTS = window.HG_PARTS = ' + json.dumps({'pal': pal, 'parts': {k: part(g) for k, g in parts.items()}}, ensure_ascii=False, separators=(',', ':')) + ';', '']
    open(OUT_JS, 'w').write('\n'.join(js))
    # previews
    os.makedirs(PREVIEW, exist_ok=True)
    rest = Grid(); [rest.paste(g) for g in (legs, hair, neck, torso, face, cap, arms['down'], mirror(arms['down']))]
    views = [rest]
    for view in ('q', 'side', 'back'):
        g = Grid()
        order = ('legs.stand', 'neck', 'torso', 'face', 'cap', 'armA.down', 'armB.down') if view != 'back' else ('legs.stand', 'neck', 'face', 'cap', 'torso', 'armA.down', 'armB.down')
        for k in order:
            if f'{view}.{k}' in parts: g.paste(parts[f'{view}.{k}'])
        views.append(g)
    sheet([(v, (-2, 0, 56, 86)) for v in views], P, scale=6).save(os.path.join(PREVIEW, 'heige_views.png'))
    sheet([(rest, (-4, 0, 54, 86))] + [(Grid().paste(torso).paste(face).paste(cap).paste(g).paste(mirror(arms['down'])), (-8, 20, 50, 80)) for n, g in arms.items() if n != 'down'],
          P, scale=5).save(os.path.join(PREVIEW, 'heige_front_arms.png'))
    print(f'{len(parts)} parts -> {OUT_JS}')


if __name__ == '__main__':
    main()
