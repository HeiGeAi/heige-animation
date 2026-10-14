"""The turnaround concept's views (art/heige/turnaround/v0..v3: palette grids from pixelize.py), re-proportioned to the
approved chibi's rows: brim +2, cheeks +1, torso +2, legs -3. One mapping per view (which rows to repeat), then a
horizontal shift so each view stands on the chibi's ground point (x = 25.5)."""
import os

from pxgrid import Grid

ART = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'art', 'heige', 'turnaround')


def rowmap(brim_rows=(17, 18), cheek_row=37):
    """AI row -> list of chibi rows."""
    m = {}
    b0, b1 = brim_rows
    for r in range(0, 85):
        out = []
        if r <= b1: out.append(r)
        elif r <= cheek_row: out.append(r + 2)
        elif r <= 61: out.append(r + 3)
        elif r <= 71: out.append(r + 5)
        elif r <= 74: pass
        else: out.append(r + 2)
        if r in (b0, b1): out.append(r + 2)                  # the brim's two repeated rows
        if r == cheek_row: out.append(r + 3)                 # the repeated cheek row
        if r == 61: out += [65, 66]                          # the torso's two repeated rows
        m[r] = out
    return m


VIEWS = {   # name: (file, rows repeated in the brim, cheek row, x shift)
    'front': ('v0', (17, 18), 37, 2),
    'q':     ('v1', (11, 12), 37, 1),      # rows added up in the crown: repeating brim rows drew a double edge
    'side':  ('v2', (11, 12), 37, 4),
    'back':  ('v3', (15, 16), 33, 3),
}


def view(name):
    f, brim, cheek, dx = VIEWS[name]
    ai = Grid.from_rows(open(os.path.join(ART, f + '.txt')).read().split('\n'))
    m = rowmap(brim, cheek); g = Grid()
    for (x, y), c in ai.items():
        for ny in m.get(y, []): g[(x + dx, ny)] = c
    return g
