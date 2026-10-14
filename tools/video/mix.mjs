// Mix a pixel video's sound: the voice exactly as it is (no gain, no processing), plus each sound effect the
// direction asks for, at the moment its phrase is said; then mux onto the rendered picture.
//   node tools/video/mix.mjs <data.js> <dir.js> <voice> <sfx dir> <picture.mp4> <out.mp4>
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
const [dataJs, dirJs, voice, sfxDir, picture, out] = process.argv.slice(2);
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(readFileSync(dataJs, 'utf8') + '\n' + readFileSync(dirJs, 'utf8'), ctx);
const D = ctx.window.MANONG || ctx.MANONG, DIR = ctx.window.MANONG_DIR || ctx.MANONG_DIR;
// a cue is a phrase ('phrase#2' = its second time), a phrase with an offset in seconds ('phrase+0.3', 'phrase-0.4'),
// or a plain time ('@12.5')
const at = cue => {
  if (cue.startsWith('@')) return +cue.slice(1);
  const [, ph, off] = cue.match(/^(.*?)([+-]\d*\.?\d+)?$/), t = D.marks[ph] ?? D.marks[ph + '#1'];
  return t == null ? null : t + (+off || 0);
};
const ev = DIR.filter(([, o]) => o.sfx).map(([ph, o]) => ({ t: at(ph), name: o.sfx[0], db: o.sfx[1] ?? -8 })).filter(e => e.t != null && existsSync(`${sfxDir}/${e.name}.wav`));
const args = ['-y', '-i', picture, '-i', voice];
ev.forEach(e => args.push('-i', `${sfxDir}/${e.name}.wav`));
const parts = ev.map((e, i) => `[${i + 2}:a]aresample=48000,adelay=${Math.max(0, Math.round((e.t - .04) * 1000))}:all=1,volume=${e.db}dB[s${i}]`);
const mix = `[1:a]aresample=48000,apad[v];[v]${ev.map((_, i) => `[s${i}]`).join('')}amix=inputs=${ev.length + 1}:normalize=0:duration=first[a]`;
args.push('-filter_complex', [...parts, mix].join(';'), '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', out);
execFileSync('ffmpeg', args, { stdio: ['ignore', 'ignore', 'inherit'] });
console.log(`mixed ${ev.length} sound effects -> ${out}`);
