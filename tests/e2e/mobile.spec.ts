import { expect, test, type Page } from '@playwright/test';
import type { Locale } from '../../src/i18n/locales';

const LOCALES: Locale[] = ['en', 'pt-br'];
const DEMOS = ['quoting', 'bakery', 'crm', 'warehouse'] as const;
// The first thing a visitor presses in each demo.
const PRIMARY: Record<(typeof DEMOS)[number], string> = {
  quoting: '[data-qt="process"]',
  bakery: '[data-add="ch"]',
  crm: '[data-cr="next"]',
  warehouse: '[data-wh="read-danfe"]',
};

test.use({ viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true });

/** How many pixels the page is wider than the screen (0 = no sideways scroll). */
const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

const scrollTo = (page: Page, selector: string, edge: 'top' | 'bottom' = 'top') =>
  page.evaluate(
    ([sel, e]) => {
      const r = document.querySelector(sel)!.getBoundingClientRect();
      const top = e === 'top' ? r.top + window.scrollY - 80 : r.bottom + window.scrollY - window.innerHeight;
      window.scrollTo({ top, behavior: 'instant' });
    },
    [selector, edge] as const,
  );

for (const locale of LOCALES) {
  test.describe(`phone, 360px (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/`);
    });

    test('no horizontal overflow at 360px', async ({ page }) => {
      expect(await overflow(page), 'at the top').toBeLessThanOrEqual(0);

      // through the Work section, on every project
      for (const id of DEMOS) {
        await scrollTo(page, '#work [role="tablist"]');
        await page.locator(`#work [data-project-tab="${id}"]`).click();
        await scrollTo(page, '[data-flow-scroller]', 'bottom');
        await page.waitForTimeout(250);
        expect(await overflow(page), `work: ${id}`).toBeLessThanOrEqual(0);
      }

      // with each demo open
      for (const id of DEMOS) {
        await scrollTo(page, '#try [role="tablist"]');
        await page.locator(`#try [data-demo-tab="${id}"]`).click();
        await expect(page.locator(`#demo-${id}`)).toBeVisible();
        await page.waitForTimeout(150);
        expect(await overflow(page), `demo: ${id}`).toBeLessThanOrEqual(0);
      }

      // and at the very bottom
      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
      await page.waitForTimeout(250);
      expect(await overflow(page), 'at the bottom').toBeLessThanOrEqual(0);
    });

    test('the flow steps do not overlap', async ({ page }) => {
      for (const id of DEMOS) {
        await scrollTo(page, '#work [role="tablist"]');
        await page.locator(`#work [data-project-tab="${id}"]`).click();
        const boxes = await page
          .locator(`#work [data-project-panel="${id}"] [data-flow-node]`)
          .evaluateAll((els) => els.map((el) => el.getBoundingClientRect()).map((r) => ({ top: r.top, bottom: r.bottom, left: r.left, right: r.right })));
        expect(boxes).toHaveLength(5);
        for (let i = 1; i < boxes.length; i++) {
          expect(boxes[i].top, `${id}: step ${i + 1} starts below step ${i}`).toBeGreaterThanOrEqual(boxes[i - 1].bottom - 0.5);
        }
        for (const b of boxes) {
          expect(b.left).toBeGreaterThanOrEqual(0);
          expect(b.right).toBeLessThanOrEqual(360);
        }
      }
    });

    test('the language switch is reachable and big enough to tap', async ({ page }) => {
      const link = page.locator('header [data-lang-switch]');
      await expect(link).toBeVisible();
      const box = (await link.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(24);
      expect(box.height).toBeGreaterThanOrEqual(24);
      await link.tap();
      await expect(page).toHaveURL(locale === 'en' ? /\/pt-br\/$/ : /\/en\/$/);
    });

    test('the menu opens and takes you to a section', async ({ page }) => {
      await page.locator('[data-nav-toggle]').tap();
      const link = page.locator('header nav a[href="#method"]');
      await expect(link).toBeVisible();
      await link.tap();
      await expect(page.locator('#method')).toBeInViewport();
    });

    for (const id of DEMOS) {
      test(`the ${id} demo can be used`, async ({ page }) => {
        await scrollTo(page, '#try [role="tablist"]');
        await page.locator(`#try [data-demo-tab="${id}"]`).tap();
        const button = page.locator(`#demo-${id} ${PRIMARY[id]}`);
        await button.scrollIntoViewIfNeeded();
        await expect(button).toBeVisible();
        const box = (await button.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(360);
        await button.tap();
        await expect(page.locator(`[data-demo-reset="${id}"]`)).toBeVisible();
      });
    }

    test('the WhatsApp button in Contact fits the screen', async ({ page }) => {
      const wa = page.locator('#contact a[data-cta="whatsapp"]');
      await wa.scrollIntoViewIfNeeded();
      const box = (await wa.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(360);
      expect(box.height).toBeGreaterThanOrEqual(44);
    });
  });
}
