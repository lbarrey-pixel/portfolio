import { expect, test } from '@playwright/test';
import { SITE } from '../../src/config';
import { getContent } from '../../src/content';
import type { Locale } from '../../src/i18n/locales';
import { whatsappUrl } from '../../src/lib/contact';

const LOCALES: Locale[] = ['en', 'pt-br'];

for (const locale of LOCALES) {
  const c = getContent(locale);

  test.describe(`hero (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/`);
    });

    test('shows the headline', async ({ page }) => {
      const h1 = page.locator('#hero h1');
      await expect(h1).toBeVisible();
      for (const line of [...c.hero.headline, c.hero.accent]) {
        await expect(h1).toContainText(line);
      }
    });

    test('the map shows the 5 quoting steps with their tech labels', async ({ page }) => {
      const steps = page.locator('[data-hero-map] [data-step]');
      await expect(steps).toHaveCount(5);
      const expected = c.work.projects[0].steps;
      for (let i = 0; i < expected.length; i++) {
        await expect(steps.nth(i)).toContainText(expected[i].title);
        await expect(steps.nth(i).locator('[data-tech]')).toHaveText(expected[i].tech);
      }
    });

    test('nav links to the sections', async ({ page }) => {
      const nav = page.locator('header nav');
      for (const id of ['#pains', '#work', '#try', '#method', '#contact']) {
        await expect(nav.locator(`a[href="${id}"]`)).toHaveCount(1);
      }
    });

    test('the WhatsApp CTA opens a chat with the localized message', async ({ page }) => {
      await expect(page.locator('#hero a[data-cta="whatsapp"]')).toHaveAttribute(
        'href',
        whatsappUrl(SITE.phoneE164, c.contact.whatsappMessage),
      );
    });

    test('the map runs: a step lights up and the log shows a line', async ({ page }) => {
      await page.waitForTimeout(3000);
      await expect(page.locator('[data-hero-map] [data-step].is-on').first()).toBeVisible();
      const log = (await page.locator('[data-hero-map] [data-log]').textContent())?.trim();
      expect(c.hero.mapLog).toContain(log);
    });
  });
}
