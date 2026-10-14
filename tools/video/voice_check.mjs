// Proof that a mix left the voice alone: in stretches with no sound effect, the finished audio must be the voice
// itself (gain 0 dB, correlation 1; only the AAC encoding differs). Also checks the lengths.
//   node tools/video/voice_check.mjs <voice> <final.mp4> <data.js> <sfx.js> [picture.mp4]
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
const [voice, final, dataJs, sfxJs, picture] = process.argv.slice(2);
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(readFileSync(dataJs, 'utf8') + '\n' + readFileSync(sfxJs, 'utf8'), ctx);
const D = Object.values(ctx.window).find(v => v && v.marks), DIR = Object.values(ctx.window).find(Array.isArray);
const at = cue => { if (cue.startsWith('@')) return +cue.slice(1); const [, ph, off] = cue.match(/^(.*?)([+-]\d*\.?\d+)?$/), t = D.marks[ph] ?? D.marks[ph + '#1']; return t == null ? null : t + (+off || 0); };
const pcm = f => { const b = execFileSync('ffmpeg', ['-v', 'error', '-i', f, '-vn', '-ac', '1', '-ar', '48000', '-f', 'f32le', '-'], { maxBuffer: 1 << 30 }); return new Float32Array(b.buffer, b.byteOffset, b.length / 4); };
const dur = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString();
const v = pcm(voice), m = pcm(final), SR = 48000;
const ts = DIR.filter(([, o]) => o.sfx).map(([c]) => at(c)).filter(x => x != null).sort((a, b) => a - b);
const gaps = []; for (let i = 1; i < ts.length; i++) { const a = ts[i - 1] + .8, b = ts[i] - .1; if (b - a > 2) gaps.push([a, b]); }
if (!ts.length) gaps.push([1, Math.min(D.len, 9)]);
let ok = true;
for (const [a, b] of gaps.filter((_, i, g) => i % Math.max(1, Math.floor(g.length / 6)) === 0).slice(0, 6)) {
  const i = Math.floor(a * SR), j = Math.floor(b * SR), pad = 2400;
  let best = 0, bv = -Infinity;
  for (let L = -pad; L <= pad; L += 8) { let s = 0; for (let k = i + pad; k < j - pad; k += 4) s += v[k] * (m[k + L] || 0); if (s > bv) { bv = s; best = L; } }
  let xy = 0, xx = 0, yy = 0; for (let k = i; k < j; k++) { const x = v[k], y = m[k + best] || 0; xy += x * y; xx += x * x; yy += y * y; }
  const gain = 20 * Math.log10(xy / xx), corr = xy / Math.sqrt(xx * yy);
  if (Math.abs(gain) > .1 || corr < .999) ok = false;
  console.log(`${a.toFixed(2)}-${b.toFixed(2)} s  lag ${(best / 48).toFixed(1)} ms  gain ${gain >= 0 ? '+' : ''}${gain.toFixed(2)} dB  corr ${corr.toFixed(4)}`);
}
const lens = { voice: dur(voice), final: dur(final), ...(picture ? { picture: dur(picture) } : {}) };
console.log('lengths', JSON.stringify(lens));
if (picture && Math.abs(lens.final - lens.picture) > .1) { console.log('the mix is shorter or longer than the picture'); ok = false; }
console.log(ok ? 'voice untouched' : 'VOICE CHANGED OR LENGTHS OFF'); process.exit(ok ? 0 : 1);
