"""黑哥's head in the three-quarter, side and back views, from the turnaround concept (re-proportioned by heige_turn.py).

The concept's silhouettes, caps, hair and ears are good and its faces are noisy, so each view keeps the concept's head,
cleans only the face (its eyes, brows, mouth and glasses become skin), and redraws the glasses to the front's
construction. The face features are left out; the JS rig stamps them per emotion.
"""
from build_chibi import LOGO
from pxgrid import Grid

N4 = ((1, 0), (-1, 0), (0, 1), (0, -1))
N8 = N4 + ((1, 1), (1, -1), (-1, 1), (-1, -1))


def despeckle(g, keys=None):
    """A pixel unlike all four neighbours, where five or more of its eight neighbours agree, takes their colour."""
    out = Grid(g)
    for (x, y), c in g.items():
        if keys and c not in keys: continue
        n4 = [g.get((x + dx, y + dy)) for dx, dy in N4]
        if c in n4: continue
        votes = {}
        for dx, dy in N8:
            n = g.get((x + dx, y + dy))
            if n: votes[n] = votes.get(n, 0) + 1
        best = max(votes, key=votes.get) if votes else None
        if best and votes[best] >= 5: out[(x, y)] = best
    return out


def clean_face(g, box, keep=lambda x, y: False):
    """Inside box, every pixel that isn't on the head's silhouette becomes skin (the concept's eyes, brows, mouth and
    glasses go), with the front's shading: warm 'S' along the right and bottom edges."""
    x0, y0, x1, y1 = box
    for (x, y), c in list(g.items()):
        if not (x0 <= x <= x1 and y0 <= y <= y1) or keep(x, y): continue
        edge = any((x + dx, y + dy) not in g for dx, dy in N4)
        if not edge: g[(x, y)] = 's'
    for (x, y), c in list(g.items()):
        if not (x0 <= x <= x1 and y0 <= y <= y1) or c != 's': continue
        if g.get((x + 1, y)) == 'O' or g.get((x, y + 1)) == 'O' or (x + 1, y) not in g: g[(x, y)] = 'S'
    return g


def lens(g, x0, x1, y0=28, y1=38, glint=True):
    """A rounded glasses frame like the front's: x0..x1 × y0..y1, skin inside, a glint top-left."""
    for x in range(x0 + 2, x1 - 1): g[(x, y0)] = 'O'; g[(x, y1)] = 'O'
    for y in range(y0 + 2, y1 - 1): g[(x0, y)] = 'O'; g[(x1, y)] = 'O'
    for (x, y) in ((x0 + 1, y0 + 1), (x1 - 1, y0 + 1), (x0 + 1, y1 - 1), (x1 - 1, y1 - 1)): g[(x, y)] = 'O'
    for x in range(x0 + 1, x1):
        for y in range(y0 + 1, y1):
            if g.get((x, y)) in ('S', 'd', 'O') and not ((x in (x0 + 1, x1 - 1)) and (y in (y0 + 1, y1 - 1))): g[(x, y)] = 's'
    if glint: g[(x0 + 2, y0 + 2)] = 'l'; g[(x0 + 3, y0 + 2)] = 'l'; g[(x0 + 2, y0 + 3)] = 'l'


def split_cap(g, cap_bottom):
    """cap = cap-coloured pixels and their outline above cap_bottom(x); the rest is face."""
    cap = Grid()
    for (x, y), c in g.items():
        if y <= cap_bottom(x) and (c in 'kcmhrgGw' or (c == 'O' and y <= cap_bottom(x) - 0)): cap[(x, y)] = c
    face = Grid({p: c for p, c in g.items() if p not in cap})
    return face, cap


def q_head(ai):
    """Three-quarters, facing right: the concept's cap, hair and ears, the face cleaned and re-drawn to the front's
    construction (13-wide near lens, 10-wide far lens, the nose under the bridge)."""
    g = fill_holes(ai.where(lambda x, y, c: y <= 45 and not (y >= 44 and c in 'kcmh' and x < 18)))
    bunny(g, 28, 5, stamp=LOGO)
    g = despeckle(g, keys='kcmhrgG')
    # the brim's lower outline, column by column (read off the concept): the face is everything under it
    def ob(x): return 25 if x <= 19 else 23 if x <= 22 else 22 if x <= 24 else 21
    clean_face(g, (12, 22, 42, 45), keep=lambda x, y: x >= 41 or y <= ob(x))
    for x in range(13, 41):
        for y in range(ob(x) + 1, 27):
            if g.get((x, y)) in ('c', 'k', 'm', 'h', 'O', 'b', 'B') and y > ob(x) and 14 <= x <= 39: g[(x, y)] = 's'
    # the far ear, peeking past the cheek: skin, not hair
    for x in range(41, 47):
        for y in range(29, 41):
            c = g.get((x, y))
            if c in ('b', 'B', 'g', 'G', 'p'): g[(x, y)] = 'S'
            elif c == 'k': g[(x, y)] = 'd'
    for x in range(14, 41):                                              # the brim's shadow on the forehead
        for d, key in ((1, 'd'), (2, 'S')):
            if g.get((x, ob(x) + d)) == 's': g[(x, ob(x) + d)] = key
    lens(g, 15, 27); lens(g, 31, 40)
    for x in range(28, 31): g[(x, 29)] = 'O'
    for x in range(28, 31): g[(x, 30)] = 'O'
    g[(14, 31)] = 'O'; g[(13, 31)] = 'O'                                 # the near temple, back to the ear
    g[(30, 36)] = 'S'; g[(31, 36)] = 'S'; g[(31, 37)] = 'd'               # nose
    for (x, y) in ((16, 39), (16, 40), (17, 41)): g[(x, y)] = 'l'          # a light on the near cheek
    return split_cap(g, lambda x: ob(x) if x <= 40 else 23)


def side_head(ai):
    """Profile, facing right: the concept's cap, visor, hair and ear; the face cleaned; the glasses drawn side on."""
    g = despeckle(fill_holes(ai.where(lambda x, y, c: y <= 45 and not (y >= 43 and c in 'kcmh' and x < 30))), keys='kcmhrgGbBp')
    clean_face(g, (24, 26, 40, 45))
    for y in range(26, 29):
        for x in range(26, 40):
            if g.get((x, y)) == 's' and g.get((x, y - 1)) in ('O', 'k', 'm', 'c'): g[(x, y)] = 'd'
    # the lens, seen side on: a narrow frame at the front of the eye; the arm runs back to the ear
    for y in range(29, 38): g[(34, y)] = 'O'; g[(38, y)] = 'O'
    for x in range(35, 38): g[(x, 28)] = 'O'; g[(x, 38)] = 'O'
    for x in range(35, 38):
        for y in range(29, 38): g[(x, y)] = 's'
    g[(35, 30)] = 'l'; g[(35, 31)] = 'l'
    for x in range(25, 34): g[(x, 31)] = 'O'
    return split_cap(g, lambda x: 25 if x < 30 else 26)


def back_head(ai):
    """From behind: the concept's head as it is (no face to clean), despeckled."""
    g = despeckle(fill_holes(ai.where(lambda x, y, c: y <= 45 and not (y >= 44 and c in 'kcmh'))), keys='kcmhrgGbBp')
    return split_cap(g, lambda x: 26)


def fill_holes(g):
    """Empty pixels the outside can't reach (holes pixelize.py punched where the concept was light) take their
    neighbours' commonest colour."""
    x0, y0, x1, y1 = g.bbox(); seen = set(); stack = [(x0 - 1, y0 - 1)]
    while stack:
        p = stack.pop()
        if p in seen or p in g or not (x0 - 1 <= p[0] <= x1 + 1 and y0 - 1 <= p[1] <= y1 + 1): continue
        seen.add(p); stack += [(p[0] + dx, p[1] + dy) for dx, dy in N4]
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if (x, y) in g or (x, y) in seen: continue
            votes = {}
            for dx, dy in N8:
                n = g.get((x + dx, y + dy))
                if n and n != 'O': votes[n] = votes.get(n, 0) + 1
            g[(x, y)] = max(votes, key=votes.get) if votes else 'O'
    return g


BUNNY = ['.w.w.', '.w.w.', '.www.', 'wwwww', 'wOwOw', 'wwwww', '.www.']


def bunny(g, x0, y0, stamp=True):
    """Clear the concept's logo (its whites, greys and the dark eye) to plain cap, then stamp the bunny if asked."""
    for y in range(y0 - 1, y0 + 8):
        for x in range(x0 - 1, x0 + 6):
            if g.get((x, y)) in ('w', 'g', 'G', 'l') or (g.get((x, y)) in ('k', 'O') and y0 <= y <= y0 + 6 and x0 <= x <= x0 + 4): g[(x, y)] = 'c'
    for j, row in enumerate(BUNNY if stamp else ()):
        for i, ch in enumerate(row):
            if ch != '.': g[(x0 + i, y0 + j)] = ch
