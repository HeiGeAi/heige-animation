// render.mjs: renders studio.html in headless Chrome. Length and fps come from the page (PROJECT in src/config.js).
//
//   Look at it (open the images with your image viewer / Read tool):
//     node render.mjs --sheet=0.5,1,1.5,2 [--cols=4] [--w=480] --out=out/check/a.jpg        contact sheet of chosen times
//     node render.mjs --strip=2.0:2.5 [--cols=6] [--w=320] --out=out/check/strip.jpg        EVERY frame in a stretch (motion)
//     node render.mjs --sheet=2.1,2.2 --crop=760,300,400,400 --w=600 --out=out/check/face.jpg full-res crops (details)
//     node render.mjs --strip=2.0:2.5 --crop-at=960,780,500,400 --out=out/check/feet.jpg       crops that follow a WORLD point
//         (x,y in world px, may be page expressions like PLK.MX(1.38); w,h in screen px) through each frame's camera
//     node render.mjs --stills=1.2,3.4 --out=out/stills                                     full-res PNGs
//   Make the video:
//     node render.mjs --clip [--range=0:4] --out=out/video.mp4                               straight to MP4 (one worker)
//     node render.mjs --frames [--range=0:8] --workers=4                                     JPEG frames → out/frames (parallel, resumable)
//     node render.mjs --encode --out=out/video.mp4                                           out/frames → MP4
//   Standalone loops (LOOPS in the page): add --loop=<name> to any of the above (times are then loop times), or
//     node render.mjs --loop=emotions --png --out=out/loop_emotions                          one cycle as PNGs (for GIFs)
//   Music: --audio=assets/song.mp3 (or PROJECT.audio) is muxed into --clip and --encode. Other flags: --fps=24,
//   --chrome=<path to Chrome/Chromium>.
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync, renameSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { homedir } from 'node:os';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const CHROMES = [args.chrome, process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ...playwrightChromes()];
// Chromium builds Playwright downloaded (~/.cache/ms-playwright/chromium-NNNN), newest first
function playwrightChromes() {
  const dir = `${homedir()}/.cache/ms-playwright`;
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter(n => /^chromium-\d+$/.test(n)).sort((a, b) => b.split('-')[1] - a.split('-')[1])
    .map(n => `${dir}/${n}/chrome-linux64/chrome`);
}
const CHROME = CHROMES.find(p => p && existsSync(p));
if (!args.encode && !CHROME) { console.error('Chrome not found: pass --chrome=<path> or set CHROME_PATH'); process.exit(1); }
const fps = Number(args.fps ?? 24);
if (!Number.isFinite(fps) || fps <= 0) throw new Error('--fps must be a positive number');
const FRAMES_DIR = 'out/frames';
const FRAME_JOB = join(FRAMES_DIR, 'latest.json');
const run = (cmd, a) => new Promise((resolve, reject) => {
  const child = spawn(cmd, a, { stdio: 'inherit' });
  child.once('error', reject);
  child.once('close', code => code === 0 ? resolve() : reject(new Error(cmd + ' exited ' + code)));
});
const times = s => String(s).split(',').map(Number);
const span = s => String(s).split(':').map(Number);
// comma-separated fields, keeping commas inside parentheses ('PLK.MX(1.38),PLK.WL,500,300'); numbers stay numbers
const fields = s => { const out = []; let d = 0, cur = ''; for (const ch of String(s)) { if (ch === ',' && !d) { out.push(cur); cur = ''; continue; } d += ch === '(' ? 1 : ch === ')' ? -1 : 0; cur += ch; } out.push(cur); return out.map(v => isNaN(+v) ? v : +v); };

function framePath(dir, index) {
  return join(dir, 'f' + String(index).padStart(5, '0') + '.jpg');
}

function atomicWrite(path, data) {
  const temporary = path + '.' + randomUUID() + '.tmp';
  writeFileSync(temporary, data);
  renameSync(temporary, path);
}

function hasFrame(dir, index) {
  const info = statSync(framePath(dir, index), { throwIfNoEntry: false });
  return info?.isFile() && info.size > 0;
}

function latestFrameJob() {
  if (!existsSync(FRAME_JOB)) {
    // Older releases kept unlabelled frames directly under out/frames.
    if (!existsSync(FRAMES_DIR)) throw new Error('No frame sequence found. Run --frames first.');
    const indices = readdirSync(FRAMES_DIR)
      .filter(name => /^f\d{5,}\.jpg$/.test(name))
      .map(name => Number(name.slice(1, -4)))
      .sort((a, b) => a - b);
    if (!indices.length) throw new Error('No frame sequence found. Run --frames first.');
    return { dir: FRAMES_DIR, first: indices[0], last: indices.at(-1), fps, audio: '' };
  }
  const job = JSON.parse(readFileSync(FRAME_JOB, 'utf8'));
  if (!/^[a-f0-9]{64}$/.test(job.id) || !Number.isSafeInteger(job.first)
    || !Number.isSafeInteger(job.last) || job.first < 0 || job.last < job.first
    || !Number.isFinite(job.fps) || job.fps <= 0 || typeof job.audio !== 'string') {
    throw new Error('Invalid frame metadata. Run --frames again.');
  }
  return { ...job, dir: join(FRAMES_DIR, job.id) };
}

if (args.encode) {
  const job = latestFrameJob();
  for (let i = job.first; i <= job.last; i++) {
    if (!hasFrame(job.dir, i)) throw new Error('Missing frame ' + i + '. Finish --frames before encoding.');
  }
  const rate = args.fps === undefined ? job.fps : fps;
  const out = args.out || 'out/video.mp4';
  const count = job.last - job.first + 1;
  const audio = args.audio ?? job.audio;
  mkdirSync(dirname(out), { recursive: true });
  console.log('encoding ' + count + ' frames → ' + out + (audio ? ' with ' + audio : ''));
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-stats', '-framerate', String(rate),
    '-start_number', String(job.first), '-i', join(job.dir, 'f%05d.jpg'),
    ...(audio ? ['-ss', String(job.first / job.fps), '-t', String(count / rate), '-i', audio,
      '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-af', 'apad', '-shortest'] : []),
    '-frames:v', String(count), '-c:v', 'libx264', '-preset', 'slow', '-crf', '17',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
  console.log('wrote ' + out);
  process.exit(0);
}

// --soft-gl: no GPU on this machine; render WebGL in software (SwiftShader), which Chrome only allows when asked.
// --gpu-angle=vulkan|gl-egl: headless Linux on an NVIDIA GPU (e.g. a cloud or cluster node); plain --use-gl=angle gets
// no WebGL context there. Check which GPU Chrome actually lands on with gpu_probe.mjs.
const ANGLE = { vulkan: ['--use-angle=vulkan', '--enable-features=Vulkan'], 'gl-egl': ['--use-angle=gl-egl'] };
if (args['gpu-angle'] && !ANGLE[args['gpu-angle']]) { console.error(`--gpu-angle must be one of ${Object.keys(ANGLE)}`); process.exit(1); }
const gpu = args['soft-gl'] ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  : args['gpu-angle'] ? ANGLE[args['gpu-angle']]
  : process.platform === 'win32' ? ['--use-angle=d3d11'] : process.platform === 'darwin' ? ['--use-angle=metal'] : ['--use-gl=angle'];
// Ubuntu 23.10+ blocks Chrome's user-namespace sandbox; headless rendering of local files doesn't need it.
const sandbox = process.platform === 'linux' ? ['--no-sandbox'] : [];
const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true, protocolTimeout: 0,
  args: [...sandbox, '--allow-file-access-from-files', '--ignore-gpu-blocklist', ...gpu, '--enable-gpu-rasterization', '--window-size=1920,1080', '--disable-renderer-backgrounding', '--disable-background-timer-throttling']
});
const pageFile = resolve(args.page || 'studio.html');
async function openPage(tag = '', files) {
  const page = await browser.newPage();
  page.on('console', m => { if (['error', 'warn'].includes(m.type())) console.log(`[page${tag}]`, m.text()); });
  page.on('pageerror', e => console.log(`[page error${tag}]`, e.message));
  if (files) page.on('response', (response) => {
    if (response.ok() && response.url().startsWith('file:')) files.add(fileURLToPath(response.url()));
  });
  await page.goto(pathToFileURL(pageFile).href + '?render', { waitUntil: 'networkidle0' });   // --page=pixel.html for the pixel back end
  await page.waitForFunction('window.ready === true', { timeout: 60000 });
  if (args.loop) {
    const ok = await page.evaluate(name => { if (!LOOPS[name]) return false; window.LOOP = LOOPS[name]; return true; }, args.loop);
    if (!ok) { console.error(`no loop named "${args.loop}"`); process.exit(1); }
  }
  if (args.mip) {   // --mip=1: voxel anti-moiré mip sampling, for before/after checks on scenes that don't turn it on themselves
    await page.evaluate(k => { if (typeof VX !== 'undefined') VX.setMip(k); }, +args.mip);
  }
  if (args.soft) {   // --soft: swap the dense blocks for the anti-moiré soft set every frame (before/after checks only)
    await page.evaluate(() => { const f = VX.frame, B = VX.B; VX.frame = (t, c) => { f(t, c); for (const [a, b] of [['code', 'codeSoft'], ['brick', 'brickSoft'], ['cobble', 'floorSoft'], ['stone', 'stoneSoft'], ['plank', 'plankSoft']]) if (B[a] && B[b]) VX.remap(B[a], B[b]); }; });
  }
  return page;
}
const frameOf = async (page, t, type, q) => {
  const url = await page.evaluate((t, type, q) => window.renderAt(t, type, q), t, type, q);
  return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
};
// the length of whatever is being rendered: a loop's .len, or the video's duration
const lengthOf = page => page.evaluate(() => window.LOOP ? window.LOOP.len : DUR);

if (args.sheet || args.strip) {
  const page = await openPage(), out = args.out || 'out/sheet.jpg'; mkdirSync(dirname(out), { recursive: true });
  let ts;
  if (args.strip) { const [a, b] = span(args.strip); ts = []; for (let i = Math.round(a * fps); i <= Math.round(b * fps); i++) ts.push(i / fps); }
  else ts = times(args.sheet);
  const crop = args.crop ? times(args.crop) : null, at = args['crop-at'] ? fields(args['crop-at']) : null;
  const { url, ms } = await page.evaluate((ts, c, w, crop, at) => window.renderSheet(ts, c, w, crop, at), ts, +(args.cols || (args.strip ? 6 : 3)), +(args.w || (args.strip ? 320 : 640)), crop, at);
  writeFileSync(out, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));
  console.log(`${out}  (${ts.length} frames)  ms/frame: ${ms.join(' ')}`);
} else if (args.stills) {
  const page = await openPage(), out = args.out || 'out/stills'; mkdirSync(out, { recursive: true });
  console.log('GPU:', await page.evaluate(() => window.gpuInfo()));
  for (const s of times(args.stills)) {
    const t0 = Date.now(), buf = await frameOf(page, s, 'image/png');
    const f = `${out}/t${s.toFixed(2).replace('.', '_')}.png`; writeFileSync(f, buf);
    console.log(`${f}  ${Date.now() - t0} ms`);
  }
} else if (args.png) {
  // PNG sequence (for GIFs): a loop's full cycle (frame n equals frame 0, so it isn't rendered), or --range=a:b.
  const probe = await openPage(), len = await lengthOf(probe); await probe.close();
  const [a, b] = args.range ? span(args.range) : [0, len], n = Math.round((b - a) * fps);
  const out = args.out || `out/${args.loop ? 'loop_' + args.loop : 'png'}`, workers = +(args.workers || 3); mkdirSync(out, { recursive: true });
  let next = 0; const start = Date.now();
  await Promise.all(Array.from({ length: workers }, async (_, w) => {
    const page = await openPage('#' + w);
    while (next < n) { const i = next++; writeFileSync(`${out}/f${String(i).padStart(4, '0')}.png`, await frameOf(page, a + i / fps, 'image/png')); }
  }));
  console.log(`${n} frames → ${out}  (${((Date.now() - start) / n).toFixed(0)} ms/frame)`);
} else if (args.frames) {
  try {
    // Reuse a frame only when the inputs to the renderer are unchanged.
    const files = new Set([pageFile, fileURLToPath(import.meta.url)]);
    const probe = await openPage('', files);
    const len = await lengthOf(probe);
    const projectAudio = await probe.evaluate(() => typeof PROJECT === 'undefined' ? '' : PROJECT.audio || '');
    await probe.close();
    const [a, b] = args.range ? span(args.range) : [0, len];
    const workers = Number(args.workers ?? 4);
    const first = Math.round(a * fps), last = Math.min(Math.ceil(len * fps) - 1, Math.round(b * fps) - 1);
    if (!Number.isSafeInteger(first) || !Number.isSafeInteger(last) || first < 0 || last < first
      || !Number.isSafeInteger(workers) || workers < 1) {
      throw new Error('Expected a non-empty frame range and a positive worker count.');
    }

    const hash = createHash('sha256').update(JSON.stringify({
      first, last, fps, loop: args.loop || null, mip: args.mip || null, soft: Boolean(args.soft),
      chrome: await browser.version(), gpu,
    }));
    for (const file of [...files].sort()) {
      hash.update(JSON.stringify([file, createHash('sha256').update(readFileSync(file)).digest('hex')]));
    }
    const id = hash.digest('hex');
    const dir = join(FRAMES_DIR, id);
    const audio = args.audio ?? projectAudio;
    mkdirSync(dir, { recursive: true });
    atomicWrite(FRAME_JOB, JSON.stringify({ id, first, last, fps, audio: audio ? resolve(audio) : '' }));

    const todo = [];
    for (let i = first; i <= last; i++) if (!hasFrame(dir, i)) todo.push(i);
    console.log(todo.length + ' frames to render (' + (last - first + 1 - todo.length) + ' already done), ' + workers + ' workers');
    let next = 0, done = 0;
    const start = Date.now();
    await Promise.all(Array.from({ length: Math.min(workers, todo.length) }, async (_, w) => {
      const page = await openPage('#' + w);
      while (next < todo.length) {
        const i = todo[next++];
        atomicWrite(framePath(dir, i), await frameOf(page, i / fps, 'image/jpeg', .94));
        if (++done % 24 === 0 || done === todo.length) {
          const el = (Date.now() - start) / 1000;
          console.log('frame ' + done + '/' + todo.length + '  ' + (el / done * 1000).toFixed(0)
            + ' ms/frame effective  eta ' + ((todo.length - done) * el / done / 60).toFixed(1) + ' min');
        }
      }
    }));
  } catch (error) {
    await browser.close();
    throw error;
  }
} else if (args.clip) {
  const page = await openPage(), len = await lengthOf(page);
  const [a, b] = args.range ? span(args.range) : typeof args.clip === 'string' ? span(args.clip) : [0, len];
  const audio = args.audio || await page.evaluate(() => PROJECT.audio || '');
  const out = args.out || 'out/clip.mp4'; mkdirSync(dirname(out), { recursive: true });
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    ...(audio ? ['-ss', String(a), '-t', String(b - a), '-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-af', 'apad', '-shortest'] : []),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round((b - a) * fps), start = Date.now();
  for (let i = 0; i < n; i++) {
    const buf = await frameOf(page, a + i / fps, 'image/jpeg', .93);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 24 === 0 || i === n - 1) console.log(`frame ${i + 1}/${n}  ${((Date.now() - start) / (i + 1)).toFixed(0)} ms/frame`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  console.log(`wrote ${out}`);
} else {
  console.log('nothing to do: see the usage notes at the top of render.mjs');
}
await browser.close();
