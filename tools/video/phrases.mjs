// The phrases a scene hangs its beats on, for align.py: every at('…'), after(t, '…'), since(t, '…') and shot('…')
// in the scene files (and cue names in sound-effect sheets, without their +offsets), checked against the script.
//   node tools/video/phrases.mjs <out.txt> <script.txt> <scene.js> [more scene or sfx files...]
import { readFileSync, writeFileSync } from 'node:fs';
const [out, scriptPath, ...files] = process.argv.slice(2);
const strip = s => s.replace(/[，。！？：；、“”‘’…—()（）「」《》,.!?:;"'\s]/g, '');
const script = strip(readFileSync(scriptPath, 'utf8'));
const found = new Set();
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/(?:\bat|\bafter|\bsince|\bshot)\(\s*(?:t\s*,\s*)?'([^']+)'/g)) found.add(m[1]);
  for (const m of src.matchAll(/\b(?:slam|burst|roll)\([^;]*?\bt\s*,\s*'([^']+)'/g)) found.add(m[1]);   // the fx2 wrappers in a scene
  for (const m of src.matchAll(/\['([^'@][^']*?)(?:[+-]\d*\.?\d+)?',\s*\{\s*sfx/g)) found.add(m[1]);
  for (const m of src.matchAll(/'([^'@][^']*?)'\s*\+\s*'[+-]\d/g)) found.add(m[1]);
}
const missing = [...found].filter(p => !script.includes(strip(p.split('#')[0])));
if (missing.length) { console.error('not in the script (fix the spelling to match it word for word):', missing); process.exit(1); }
writeFileSync(out, [...found].join('\n') + '\n');
console.log(`${found.size} phrases -> ${out}`);
