// Times to look at: the middle and the last moment of every shot of a film scene, for contact sheets
//   node render.mjs --page=pixel.html --loop=<loop> --sheet=$(node tools/video/times.mjs <data.js> <scene.js> mid) ...
// (mid | late | starts). Shot times follow the scene's shot('phrase') calls, each starting `lead` (.15 s) early.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const [dataJs, sceneJs, which = 'mid', lead = '.15'] = process.argv.slice(2);
const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(readFileSync(dataJs, 'utf8'), ctx);
const D = Object.values(ctx.window).find(v => v && v.marks);
const at = ph => D.marks[ph] ?? D.marks[ph + '#1'];
const phs = [...readFileSync(sceneJs, 'utf8').matchAll(/\bshot\(\s*(null|'([^']+)')/g)].map(m => m[2] ?? null);
const t0 = phs.filter(p => p == null || at(p) != null).map(p => p == null ? 0 : Math.max(0, at(p) - +lead)).sort((a, b) => a - b);   // time order, like the film
const t1 = t0.map((_, i) => i + 1 < t0.length ? t0[i + 1] : D.len);
const pick = { mid: i => (t0[i] + t1[i]) / 2, late: i => t1[i] - .3, starts: i => t0[i] + .5 }[which];
console.log(t0.map((_, i) => pick(i).toFixed(2)).join(','));
