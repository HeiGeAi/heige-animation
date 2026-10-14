// Mix a pixel video's sound: the voice exactly as it is (no gain, no processing), plus each sound effect the
// direction asks for, at the moment its phrase is said, and optionally a song looped underneath; then mux onto the
// rendered picture. The voice is padded with silence to the picture's length, so the ending isn't cut.
//   node tools/video/mix.mjs <data.js> <dir.js> <voice> <sfx dir> <picture.mp4> <out.mp4> [--bgm=song.mp3]
//     [--bgm-below=14.16]  the song sits this many dB (integrated loudness) under the voice
//     [--fade=2]           and fades out over the last seconds
// The data file is align.py's output; the direction is an array of [cue, { sfx: [name, dB] }] (any var names).
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import vm from 'node:vm';
const pos = process.argv.slice(2).filter(a => !a.startsWith('--'));
const opt = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const [dataJs, dirJs, voice, sfxDir, picture, out] = pos;
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(readFileSync(dataJs, 'utf8') + '\n' + readFileSync(dirJs, 'utf8'), ctx);
const D = Object.values(ctx.window).find(v => v && v.marks), DIR = Object.values(ctx.window).find(Array.isArray);
// a cue is a phrase ('phrase#2' = its second time), a phrase with an offset in seconds ('phrase+0.3', 'phrase-0.4'),
// or a plain time ('@12.5')
const at = cue => {
  if (cue.startsWith('@')) return +cue.slice(1);
  const [, ph, off] = cue.match(/^(.*?)([+-]\d*\.?\d+)?$/), t = D.marks[ph] ?? D.marks[ph + '#1'];
  return t == null ? null : t + (+off || 0);
};
const all = DIR.filter(([, o]) => o.sfx).map(([ph, o]) => ({ ph, t: at(ph), name: o.sfx[0], db: o.sfx[1] ?? -8 }));
const lost = all.filter(e => e.t == null || !existsSync(`${sfxDir}/${e.name}.wav`));
if (lost.length) console.warn('skipped (no such phrase in the data, or no such sound):', lost.map(e => `${e.ph} ${e.name}`).join(' | '));
const ev = all.filter(e => !lost.includes(e));
const args = ['-y', '-i', picture, '-i', voice];
ev.forEach(e => args.push('-i', `${sfxDir}/${e.name}.wav`));
const parts = ev.map((e, i) => `[${i + 2}:a]aresample=48000,adelay=${Math.max(0, Math.round((e.t - .04) * 1000))}:all=1,volume=${e.db}dB[s${i}]`);
const ins = ev.map((_, i) => `[s${i}]`);
if (opt.bgm) {
  const lufs = f => +spawnSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'ebur128', '-f', 'null', '-']).stderr.toString().match(/I:\s+(-?[\d.]+) LUFS/g).pop().match(/-?[\d.]+/)[0];
  const len = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', picture]).toString();
  const gain = lufs(voice) - +(opt['bgm-below'] ?? 14.16) - lufs(opt.bgm), fade = +(opt.fade ?? 2);
  args.push('-stream_loop', '-1', '-i', opt.bgm);
  parts.push(`[${ev.length + 2}:a]aresample=48000,volume=${gain.toFixed(2)}dB,afade=t=out:st=${(len - fade).toFixed(2)}:d=${fade}[bg]`);
  ins.push('[bg]');
  console.log(`music ${opt.bgm} at ${gain.toFixed(2)} dB (${opt['bgm-below'] ?? 14.16} dB under the voice), fading out over ${fade} s`);
}
const mix = `[1:a]aresample=48000,apad[v];[v]${ins.join('')}amix=inputs=${ins.length + 1}:normalize=0:duration=first[a]`;
args.push('-filter_complex', [...parts, mix].join(';'), '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', out);
execFileSync('ffmpeg', args, { stdio: ['ignore', 'ignore', 'inherit'] });
console.log(`mixed ${ev.length} sound effects -> ${out}`);
