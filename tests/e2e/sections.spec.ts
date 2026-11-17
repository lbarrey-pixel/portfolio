import { expect, test } from '@playwright/test';
import { SITE } from '../../src/config';
import { getContent } from '../../src/content';
import type { Locale } from '../../src/i18n/locales';
import { whatsappUrl } from '../../src/lib/contact';

const LOCALES: Locale[] = ['en', 'pt-br'];

for (const locale of LOCALES) {
  const c = getContent(locale);

  test.describe(`sections (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/`);
    });

    test('shows the 6 pains, each with its problem and answer', async ({ page }) => {
      const cards = page.locator('#pains [data-pain]');
      await expect(cards).toHaveCount(6);
      for (let i = 0; i < c.pains.items.length; i++) {
        const pain = c.pains.items[i];
        await expect(cards.nth(i)).toContainText(pain.title);
        await expect(cards.nth(i)).toContainText(pain.problem);
        await expect(cards.nth(i)).toContainText(pain.answer);
      }
    });

    test('exactly 4 pains link to the demo that solves them', async ({ page }) => {
      const links = page.locator('#pains [data-pain] a[href^="#demo-"]');
      await expect(links).toHaveCount(4);
      const hrefs = await links.evaluateAll((els) => els.map((el) => el.getAttribute('href')));
      expect(hrefs).toEqual(['#demo-bakery', '#demo-quoting', '#demo-crm', '#demo-warehouse']);
    });

    test('method shows the 5 steps and the 5-line scenario', async ({ page }) => {
      const steps = page.locator('#method [data-method-step]');
      await expect(steps).toHaveCount(5);
      for (let i = 0; i < c.method.steps.length; i++) {
        await expect(steps.nth(i)).toContainText(c.method.steps[i].title);
      }
      const lines = page.locator('#method [data-scenario-line]');
      await expect(lines).toHaveCount(5);
      for (let i = 0; i < c.method.scenario.length; i++) {
        await expect(lines.nth(i)).toContainText(c.method.scenario[i].kw);
        await expect(lines.nth(i)).toContainText(c.method.scenario[i].text);
      }
    });

    test('about shows the photo with its alt text', async ({ page }) => {
      const photo = page.locator('#about img');
      await expect(photo).toHaveCount(1);
      await expect(photo).toHaveAttribute('alt', c.about.photoAlt);
      await expect(page.locator('#about')).toContainText(c.about.text);
    });

    test('contact has the WhatsApp button with the localized message', async ({ page }) => {
      await expect(page.locator('#contact a[data-cta="whatsapp"]')).toHaveAttribute(
        'href',
        whatsappUrl(SITE.phoneE164, c.contact.whatsappMessage),
      );
      await expect(page.locator('#contact')).toContainText(c.contact.marquee[0]);
    });

    test('no mailto link exists while the email is not set', async ({ page }) => {
      expect(SITE.email).toBeNull();
      await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
    });

    test('footer shows name, city and the fictitious-data note', async ({ page }) => {
      const footer = page.locator('body > footer');
      await expect(footer).toContainText(SITE.name);
      await expect(footer).toContainText(SITE.city);
      await expect(footer).toContainText(c.footer.note);
    });
  });
}
