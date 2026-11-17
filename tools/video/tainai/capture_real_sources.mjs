/**
 * Capture genuine desktop/focused real-world web screenshots for V075 (`pxTainai`).
 * No synthetic HTML cards, no URLs in visible crop, no anti-bot circumvention.
 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../..');
const OUT_DIR = path.join(ROOT, 'out/video/tainai/raw_shots');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

fs.mkdirSync(OUT_DIR, { recursive: true });

const ONLY = new Set(
  process.argv.slice(2).flatMap(a => (a.startsWith('--only=') ? a.slice(7).split(',') : [a])).filter(Boolean)
);
const want = name => ONLY.size === 0 || ONLY.has(name);

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--lang=zh-CN'],
  });

  const openPage = async (width, height) => {
    const p = await browser.newPage();
    await p.setViewport({ width, height, deviceScaleFactor: 2 });
    await p.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    );
    return p;
  };

  try {
    // 1. 科学网报道（2026-04-28）：https://news.sciencenet.cn/htmlnews/2026/4/563878.shtm
    if (want('sciencenet')) {
      const p = await openPage(1060, 1100);
      await p.goto('https://news.sciencenet.cn/htmlnews/2026/4/563878.shtm', {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });
      await new Promise(r => setTimeout(r, 1500));
      await p.screenshot({ path: path.join(OUT_DIR, 'sciencenet_raw.png') });
      await p.close();
      console.log('captured sciencenet_raw.png');
    }

    // 2. 上观新闻 · 湖北日报（宜昌西陵法院 AI 假案例当庭训诫）：响应式 980px 宽度
    if (want('court')) {
      const p = await openPage(960, 1080);
      await p.goto('https://www.shobserver.com/staticsg/res/html/web/newsDetail.html?id=1150827&sid=11', {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });
      await new Promise(r => setTimeout(r, 2000));
      await p.screenshot({ path: path.join(OUT_DIR, 'court_shobs_960.png') });
      await p.close();
      console.log('captured court_shobs_960.png');
    }

    // 3. Anthropic Sycophancy 论文 (arXiv:2310.13548) @ 760px 响应式单栏，字大清晰且顶栏完整无裁切
    if (want('anthropic')) {
      const p = await openPage(760, 1000);
      await p.goto('https://arxiv.org/abs/2310.13548', {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });
      await new Promise(r => setTimeout(r, 1200));
      await p.screenshot({ path: path.join(OUT_DIR, 'anthropic_raw.png') });
      await p.close();
      console.log('captured anthropic_raw.png');
    }

    // 4. DeepMind Self-Correction 论文 (arXiv:2310.01798) @ 760px 响应式单栏
    if (want('deepmind')) {
      const p = await openPage(760, 1000);
      await p.goto('https://arxiv.org/abs/2310.01798', {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });
      await new Promise(r => setTimeout(r, 1200));
      await p.screenshot({ path: path.join(OUT_DIR, 'deepmind_raw.png') });
      await p.close();
      console.log('captured deepmind_raw.png');
    }

    // 5. HBR 哈佛商业评论《Performing a Project Premortem》(Gary Klein, Sept 2007)
    if (want('hbr')) {
      const p = await openPage(1100, 1200);
      await p.goto('https://hbr.org/2007/09/performing-a-project-premortem', {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
      // Wait for headline + more button to mount cleanly (avoid waiting long enough for late interstitial overlays, and close if shown)
      await p.waitForSelector('h1', { timeout: 15000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 1600));
      await p.keyboard.press('Escape').catch(() => {});
      await p.evaluate(() => {
        for (const el of document.querySelectorAll('a, button, span')) {
          if (el.textContent.trim().toLowerCase() === 'more') {
            el.click();
            break;
          }
        }
        // Close any rendered modal close button if present
        for (const el of document.querySelectorAll('button, a, [role="button"], [aria-label*="close" i]')) {
          const lb = (el.getAttribute('aria-label') || el.title || '').trim().toLowerCase();
          if (lb.includes('close')) {
            const r = el.getBoundingClientRect();
            if (r.width > 8 && r.height > 8 && r.top > 150 && r.top < 650) el.click();
          }
        }
      });
      await new Promise(r => setTimeout(r, 700));
      const clipBounds = await p.evaluate(() => {
        const hdr = document.querySelector('header');
        const main = document.querySelector('h1');
        const abs = document.querySelector('.article-summary, [class*="summary"], [class*="abstract"]');
        return {
          hdrTop: hdr ? Math.round(hdr.getBoundingClientRect().top) : 0,
          hdrBottom: hdr ? Math.round(hdr.getBoundingClientRect().bottom) : 0,
          h1Top: main ? Math.round(main.getBoundingClientRect().top) : 0,
          absBottom: abs ? Math.round(abs.getBoundingClientRect().bottom) : 0,
        };
      });
      console.log('hbr metrics:', clipBounds);
      await p.screenshot({ path: path.join(OUT_DIR, 'hbr_raw.png') });
      await p.close();
      console.log('captured hbr_raw.png');
    }
  } finally {
    await browser.close();
  }
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
