// Read a scene's generated tables out of pixel.html (sound effects, inlay slots) and write them as a .js data file.
//   node tools/video/dump_globals.mjs --chrome=<shell> DUMB_SFX:src/pixel/scenes/dumb_sfx.js DUMB_SLOTS:out/video/dumb/slots.json
import puppeteer from 'puppeteer-core';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const args = process.argv.slice(2), chrome = (args.find(a => a.startsWith('--chrome=')) || '').slice(9);
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.goto(pathToFileURL(resolve('pixel.html')).href + '?render', { waitUntil: 'networkidle0' });
for (const spec of args.filter(a => !a.startsWith('--'))) {
  const [name, file] = spec.split(':'), v = await page.evaluate(n => window[n], name);
  if (file.endsWith('.json')) writeFileSync(file, JSON.stringify(v));
  else { const dir = v.map(([t, s, db]) => [`@${t.toFixed(3)}`, { sfx: [s, db] }]);
    writeFileSync(file, `// generated from window.${name}: sound effects for tools/video/mix.mjs\nvar ${name}_DIR = window.${name}_DIR = ${JSON.stringify(dir)};\n`); }
  console.log(name, Array.isArray(v) ? v.length : typeof v, '->', file);
}
await browser.close();
