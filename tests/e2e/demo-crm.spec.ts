import { expect, test, type Page } from '@playwright/test';
import { strings } from '../../src/demos/crm/strings';
import type { Locale } from '../../src/i18n/locales';

const LOCALES: Locale[] = ['en', 'pt-br'];
const part = (page: Page, name: string) => page.locator(`#demo-crm [data-cr="${name}"]`);
const card = (page: Page, domain: string) => page.locator(`#demo-crm [data-cr="card"][data-domain="${domain}"]`);

for (const locale of LOCALES) {
  const t = strings[locale];

  test.describe(`crm demo (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/`);
      await page.locator('#try [data-demo-tab="crm"]').click();
      await expect(page.locator('#demo-crm')).toBeVisible();
    });

    test('the board has 4 columns holding the 7 leads', async ({ page }) => {
      const cols = part(page, 'col');
      await expect(cols).toHaveCount(4);
      for (let i = 0; i < 4; i++) await expect(cols.nth(i)).toContainText(t.columns[i]);
      const counts = await part(page, 'col-count').allTextContents();
      expect(counts.map(Number)).toEqual([3, 2, 1, 1]);
      await expect(part(page, 'card')).toHaveCount(7);
      await expect(part(page, 'kpi-emails')).toHaveText('614');
      await expect(part(page, 'kpi-replies')).toHaveText('59');
    });

    test('clicking a lead shows what the agent did with it', async ({ page }) => {
      await card(page, 'portoagro.com.br').click();
      await expect(card(page, 'portoagro.com.br')).toHaveAttribute('aria-pressed', 'true');
      await expect(part(page, 'detail')).toContainText('portoagro.com.br');
      const events = part(page, 'event');
      await expect(events).toHaveCount(4);
      await expect(events.nth(0)).toContainText(t.steps[0].event);
      await expect(events.nth(3)).toContainText(t.steps[3].event);
    });

    test("the agent's next step sends an email, then a reply moves the lead to the next column", async ({ page }) => {
      await card(page, 'alfaindustria.com.br').click();
      await expect(part(page, 'event')).toHaveCount(1);

      // step 1: a follow-up email. The lead stays cold, the email counter goes up.
      await part(page, 'next').click();
      await expect(part(page, 'event')).toHaveCount(2);
      await expect(part(page, 'kpi-emails')).toHaveText('615');
      await expect(part(page, 'kpi-replies')).toHaveText('59');
      await expect(part(page, 'col').nth(0).locator('[data-domain="alfaindustria.com.br"]')).toHaveCount(1);

      // step 2: the reply arrives. The lead moves to the second column.
      await part(page, 'next').click();
      await expect(part(page, 'event')).toHaveCount(3);
      await expect(part(page, 'kpi-replies')).toHaveText('60');
      await expect(part(page, 'kpi-emails')).toHaveText('615');
      await expect(part(page, 'col').nth(1).locator('[data-domain="alfaindustria.com.br"]')).toHaveCount(1);
      const counts = await part(page, 'col-count').allTextContents();
      expect(counts.map(Number)).toEqual([2, 3, 1, 1]);
    });

    test('a lead at the end of the funnel cannot go further', async ({ page }) => {
      await card(page, 'novafarma.com.br').click();
      await expect(part(page, 'next')).toBeDisabled();
      await expect(part(page, 'next')).toHaveText(t.end);
    });

    test('the reset button restores the board', async ({ page }) => {
      await card(page, 'alfaindustria.com.br').click();
      await part(page, 'next').click();
      await expect(part(page, 'kpi-emails')).toHaveText('615');
      await page.locator('[data-demo-reset="crm"]').click();
      await expect(part(page, 'kpi-emails')).toHaveText('614');
      await expect(part(page, 'event')).toHaveCount(1);
    });
  });

  test(`a link to #demo-crm opens that panel (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/#demo-crm`);
    await expect(page.locator('#demo-crm')).toBeVisible();
    await expect(page.locator('#demo-crm [data-cr="card"]')).toHaveCount(7);
  });
}
