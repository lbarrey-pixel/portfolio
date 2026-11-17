import { expect, test, type Page } from '@playwright/test';
import { getContent } from '../../src/content';
import type { Locale } from '../../src/i18n/locales';

const LOCALES: Locale[] = ['en', 'pt-br'];
const CATALOG = { en: '4,680', 'pt-br': '4.680' } as const;

const panel = (page: Page, id: string) => page.locator(`#work [data-project-panel="${id}"]`);

/** Scroll so the whole flow section has passed (instantly, whatever the page's scroll-behavior). */
async function scrollThroughFlow(page: Page) {
  await page.evaluate(() => {
    const s = document.querySelector('[data-flow-scroller]')!;
    const top = s.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
    window.scrollTo({ top, behavior: 'instant' });
  });
}

for (const locale of LOCALES) {
  const c = getContent(locale);
  const [quoting, bakery] = c.work.projects;

  test.describe(`work (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/`);
    });

    test('opens on the quoting project with its 5 steps and metrics', async ({ page }) => {
      await expect(page.locator('#work [data-project-tab="quoting"]')).toHaveAttribute('aria-selected', 'true');
      const p = panel(page, 'quoting');
      await expect(p).toBeVisible();
      const nodes = p.locator('[data-flow-node]');
      await expect(nodes).toHaveCount(5);
      for (let i = 0; i < 5; i++) {
        await expect(nodes.nth(i)).toContainText(quoting.steps[i].title);
        await expect(nodes.nth(i)).toContainText(quoting.steps[i].tech);
      }
      const metrics = p.locator('[data-metric]');
      await expect(metrics).toHaveCount(3);
      await expect(metrics.nth(0)).toContainText('224');
      await expect(metrics.nth(1)).toContainText('65%');
      await expect(metrics.nth(2)).toContainText(CATALOG[locale]);
      await expect(p).toContainText(quoting.status);
    });

    test('each tab swaps the steps and the summary', async ({ page }) => {
      for (const project of [...c.work.projects].reverse()) {
        await page.locator(`#work [data-project-tab="${project.id}"]`).click();
        const p = panel(page, project.id);
        await expect(p).toBeVisible();
        await expect(p).toContainText(project.summary);
        await expect(p.locator('[data-flow-node]').first()).toContainText(project.steps[0].title);
        for (const other of c.work.projects.filter((o) => o.id !== project.id)) {
          await expect(panel(page, other.id)).toBeHidden();
        }
        await expect(page.locator(`#work [data-project-detail="${project.id}"]`)).toBeVisible();
      }
    });

    test('scrolling through the section lights all 5 steps', async ({ page }) => {
      const on = panel(page, 'quoting').locator('[data-flow-node].is-on');
      await expect(on).toHaveCount(1);
      await scrollThroughFlow(page);
      await expect(on).toHaveCount(5);
      await expect(panel(page, 'quoting').locator('[data-flow-node].is-current')).toHaveCount(1);
    });

    test('a screenshot opens in the lightbox; arrows move, Escape closes and returns focus', async ({ page }) => {
      await page.locator('#work [data-project-tab="bakery"]').click();
      const shots = page.locator('#work [data-gallery="bakery"]');
      await expect(shots).toHaveCount(4);
      await shots.first().click();

      const box = page.locator('[data-lightbox]');
      await expect(box).toBeVisible();
      await expect(box.locator('[data-lightbox-caption]')).toHaveText(bakery.images[0].caption);
      await expect(box.locator('[data-lightbox-count]')).toHaveText('1 / 4');
      await expect(box.locator('img')).toHaveAttribute('alt', bakery.images[0].alt);

      await page.keyboard.press('ArrowRight');
      await expect(box.locator('[data-lightbox-count]')).toHaveText('2 / 4');
      await expect(box.locator('[data-lightbox-caption]')).toHaveText(bakery.images[1].caption);

      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowLeft');
      await expect(box.locator('[data-lightbox-count]')).toHaveText('4 / 4');

      await page.keyboard.press('Escape');
      await expect(box).toBeHidden();
      await expect(shots.first()).toBeFocused();
    });
  });
}
