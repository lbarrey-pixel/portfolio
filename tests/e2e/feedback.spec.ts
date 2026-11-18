// Leonardo's review of the live preview (2026-11-18): one test per point that can be checked in a browser.
import { expect, test, type Page } from '@playwright/test';
import { getContent } from '../../src/content';
import { strings as quoting } from '../../src/demos/quoting/strings';

const PHONE = { viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true } as const;
const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

test.describe('phone', () => {
  test.use(PHONE);

  test('quoting: every column of the proposal is readable without sideways scroll', async ({ page }) => {
    await page.goto('/pt-br/');
    await page.locator('#try [data-demo-tab="quoting"]').click();
    await page.locator('#demo-quoting [data-qt="process"]').click();
    const rows = page.locator('#demo-quoting [data-qt="row"]');
    await expect(rows.nth(4)).toContainText('Rack de parede 12U 570 mm');

    const wrap = page.locator('#demo-quoting .qt-tablewrap');
    expect(await wrap.evaluate((el) => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
    // supplier, quantity, cost and price are on screen inside the first card
    const first = rows.first();
    await first.scrollIntoViewIfNeeded();
    // each value carries its column name (drawn by CSS from data-label), and every cell is on screen
    const cells = await first.locator('td').evaluateAll((tds) =>
      tds.map((td) => {
        const r = td.getBoundingClientRect();
        return { label: getComputedStyle(td, '::before').content.replace(/"/g, ''), left: r.left, right: r.right, width: r.width };
      }),
    );
    const cols = quoting['pt-br'].columns;
    expect(cells.map((c) => c.label)).toEqual([cols.asked, cols.found, cols.confidence, cols.supplier, cols.qty, cols.cost, cols.price]);
    for (const c of cells) {
      expect(c.width, c.label).toBeGreaterThan(40);
      expect(c.left, c.label).toBeGreaterThanOrEqual(0);
      expect(c.right, c.label).toBeLessThanOrEqual(360);
    }
    const price = (await first.locator('[data-qt="price"]').boundingBox())!;
    expect(price.x).toBeGreaterThanOrEqual(0);
    expect(price.x + price.width).toBeLessThanOrEqual(360);
    expect(await overflow(page)).toBeLessThanOrEqual(0);
  });

  test('tabs: all four fit on screen in Work and in Try it', async ({ page }) => {
    for (const locale of ['en', 'pt-br']) {
      await page.goto(`/${locale}/`);
      for (const selector of ['#work [data-project-tab]', '#try [data-demo-tab]']) {
        const tabs = page.locator(selector);
        await tabs.first().scrollIntoViewIfNeeded();
        const boxes = await tabs.evaluateAll((els) => els.map((el) => el.getBoundingClientRect()).map((r) => [r.left, r.right]));
        expect(boxes).toHaveLength(4);
        for (const [left, right] of boxes) {
          expect(left, `${locale} ${selector}`).toBeGreaterThanOrEqual(0);
          expect(right, `${locale} ${selector}`).toBeLessThanOrEqual(360);
        }
      }
    }
  });

  test('small labels are at least 12px', async ({ page }) => {
    await page.goto('/pt-br/');
    await page.locator('#try [data-demo-tab="quoting"]').click();
    const sizes = await page.evaluate(() => {
      const out: Record<string, number> = {};
      for (const sel of ['.flow__code', '.flow__tech', '.map__code', '.map__tech', '.qt-step', '.pain__stack li', '.demo__hints li']) {
        const el = document.querySelector(sel);
        if (el) out[sel] = parseFloat(getComputedStyle(el, sel === '.demo__hints li' ? '::before' : null).fontSize);
      }
      return out;
    });
    expect(Object.keys(sizes)).toHaveLength(7);
    for (const [sel, px] of Object.entries(sizes)) expect(px, sel).toBeGreaterThanOrEqual(12);
  });

  test('hero: the headline has landed one second after the page loads', async ({ page }) => {
    await page.goto('/pt-br/');
    await page.waitForTimeout(1000);
    const state = await page.evaluate(() => {
      const hero = document.querySelector('#hero')!;
      // the entrance animations (not the map's own loop, which runs for as long as it is on screen)
      const running = hero
        .getAnimations({ subtree: true })
        .filter((a) => ['rise', 'fade'].includes((a as CSSAnimation).animationName) && a.playState !== 'finished').length;
      const h1 = hero.querySelector('h1')!.getBoundingClientRect();
      const line = hero.querySelector('.hero__line > span')!.getBoundingClientRect();
      const lead = getComputedStyle(hero.querySelector('.hero__lead')!).opacity;
      return { running, lineInPlace: Math.abs(line.top - h1.top) < 12, lead };
    });
    expect(state).toEqual({ running: 0, lineInPlace: true, lead: '1' });
  });

  test('about: the section is shorter than one screen', async ({ page }) => {
    await page.goto('/pt-br/');
    const box = (await page.locator('#about').boundingBox())!;
    expect(box.height).toBeLessThan(600);
  });
});

test.describe('desktop', () => {
  test('no sideways scroll anywhere in Work, on any project, at common widths', async ({ page }) => {
    for (const width of [1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      for (const locale of ['en', 'pt-br']) {
        await page.goto(`/${locale}/`);
        for (const id of ['quoting', 'bakery', 'crm', 'warehouse']) {
          await page.evaluate(() => {
            const s = document.querySelector('[data-flow-scroller]')!;
            window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY + 300, behavior: 'instant' });
          });
          await page.locator(`#work [data-project-tab="${id}"]`).click();
          await page.waitForTimeout(120);
          expect(await overflow(page), `${width}px ${locale} ${id}`).toBe(0);
        }
      }
    }
  });

  test('about: text is body-sized and the section is compact', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/en/');
    const about = page.locator('#about');
    expect((await about.boundingBox())!.height).toBeLessThan(450);
    const size = await about.locator('.about__text').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(size).toBeLessThanOrEqual(24);
  });

  test('screenshots in Work show an enlarged part of the screen, sharp enough to read', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/en/');
    await page.locator('#work [data-project-tab="bakery"]').click();
    const img = page.locator('#work [data-gallery="bakery"] img').first();
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    const m = await img.evaluate((el: HTMLImageElement) => {
      const frame = el.closest('.shot__crop')!.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return { zoom: r.width / frame.width, sharp: el.naturalWidth / r.width };
    });
    expect(m.zoom, 'the picture is larger than its frame (a crop, not a miniature)').toBeGreaterThanOrEqual(1.5);
    expect(m.sharp, 'at least one image pixel per screen pixel').toBeGreaterThanOrEqual(1);
  });
});

test('reveals start before a section enters the screen and finish quickly', async ({ page }) => {
  await page.goto('/en/');
  // Jump straight to the end, as a fast scroll does: nothing may stay hidden behind us.
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await page.waitForTimeout(900);
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-lines] .word > span')]
      .filter((el) => el.getClientRects().length > 0)
      .filter((el) => {
        const s = getComputedStyle(el);
        return parseFloat(s.opacity) < 0.99 || (s.translate !== 'none' && s.translate !== '0px');
      })
      .map((el) => `${el.tagName.toLowerCase()}.${el.className}`),
  );
  expect(hidden).toEqual([]);
});

for (const locale of ['en', 'pt-br'] as const) {
  test(`contact marquee uses only the page's language (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    const other = getContent(locale === 'en' ? 'pt-br' : 'en').contact.marquee;
    const contact = page.locator('#contact');
    for (const line of getContent(locale).contact.marquee) await expect(contact).toContainText(line);
    for (const line of other) await expect(contact).not.toContainText(line);
  });

  test(`quoting calls the percentage a markup, not a margin (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    await page.locator('#try [data-demo-tab="quoting"]').click();
    await expect(page.locator('#demo-quoting')).not.toContainText(/margin|margem/i);
    await page.locator('#demo-quoting [data-qt="process"]').click();
    await expect(page.locator('#demo-quoting [data-qt="row"]')).toHaveCount(5);
    await expect(page.locator('#demo-quoting .qt-tot label')).toContainText('Markup');
    await expect(page.locator('#demo-quoting')).not.toContainText(/margin|margem/i);
  });
}
