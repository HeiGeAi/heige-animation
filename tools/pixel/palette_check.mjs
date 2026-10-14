// The brand rule, at the source: no colour in the pixel code is green (hue 90-150 with real saturation and
// brightness, the same test as green_scan.py). Green in an encoded video then can only come from compression.
//   node tools/pixel/palette_check.mjs [dir=src/pixel]
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith('.js') ? [p] : []; });
const files = walk(process.argv[2] || 'src/pixel'), bad = []; let n = 0;
for (const f of files) for (const c of new Set(readFileSync(f, 'utf8').match(/#[0-9A-Fa-f]{6}\b/g) || [])) {
  n++; const [r, g, b] = [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16) / 255), mx = Math.max(r, g, b), d = mx - Math.min(r, g, b);
  let h = 0; if (d) h = 60 * (mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4);
  if (h >= 90 && h <= 150 && d / mx > .25 && mx > .2) bad.push(`${f} ${c}`);
}
console.log(`${n} colours in ${files.length} files, green: ${bad.length ? bad.join(', ') : 'none'}`); process.exit(bad.length ? 1 : 0);
