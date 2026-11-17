import { expect, test, type Page } from '@playwright/test';
import { strings } from '../../src/demos/warehouse/strings';
import type { Locale } from '../../src/i18n/locales';

const LOCALES: Locale[] = ['en', 'pt-br'];
const EXPECT = {
  en: { zero: '0.000', cubage: '0.030', freight: 'R$187.42' },
  'pt-br': { zero: '0,000', cubage: '0,030', freight: 'R$ 187,42' },
} as const;

const part = (page: Page, name: string) => page.locator(`#demo-warehouse [data-wh="${name}"]`);

async function expectNoNaN(page: Page) {
  expect(await page.locator('#demo-warehouse').innerText()).not.toContain('NaN');
}

for (const locale of LOCALES) {
  const t = strings[locale];
  const x = EXPECT[locale];

  test.describe(`warehouse demo (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/`);
      await page.locator('#try [data-demo-tab="warehouse"]').click();
      await expect(page.locator('#demo-warehouse')).toBeVisible();
    });

    test('receive, match, pick and ship order #1871 while the manager panel follows', async ({ page }) => {
      // nothing has happened yet
      await expect(part(page, 'stage')).toHaveCount(6);
      await expect(page.locator('#demo-warehouse [data-wh="stage"].done')).toHaveCount(0);
      await expect(part(page, 'kpi-cubage')).toHaveText('–');

      // receiving: read the DANFE, check the 3 items
      await part(page, 'read-danfe').click();
      await expect(part(page, 'check')).toHaveCount(3);
      await expect(part(page, 'receive-done')).toBeDisabled();
      await part(page, 'check').nth(0).click();
      await part(page, 'check').nth(1).click();
      await expect(part(page, 'receive-done')).toBeDisabled();
      await part(page, 'check').nth(2).click();
      await part(page, 'receive-done').click();
      await expect(page.locator('#demo-warehouse [data-wh="stage"].done')).toHaveCount(1);

      // the AI's suggested match, confirmed by the operator
      await part(page, 'ai-validate').click();

      // picking: all 3 items, then the package measures
      await expect(part(page, 'pick')).toHaveCount(3);
      await expect(part(page, 'pick-done')).toBeDisabled();
      for (let i = 0; i < 3; i++) await part(page, 'pick').nth(i).click();
      await expect(part(page, 'pick-done')).toBeEnabled();

      // a measure that is not a number: the manager sees 0, never NaN
      await part(page, 'vol-c').fill('abc');
      await expect(part(page, 'kpi-cubage')).toHaveText(x.zero);
      await expectNoNaN(page);
      await part(page, 'vol-c').fill('-40');
      await expect(part(page, 'kpi-cubage')).toHaveText(x.zero);
      await part(page, 'vol-c').fill('');
      await expect(part(page, 'kpi-cubage')).toHaveText(x.zero);
      await expectNoNaN(page);

      // back to 40 × 30 × 25 cm
      await part(page, 'vol-c').fill('40');
      await part(page, 'vol-l').fill('30');
      await part(page, 'vol-a').fill('25');
      await expect(part(page, 'kpi-cubage')).toHaveText(x.cubage);

      await part(page, 'pick-done').click();
      expect(((await part(page, 'kpi-freight').textContent()) ?? '').replace(/ /g, ' ')).toBe(x.freight);
      await expect(page.locator('#demo-warehouse [data-wh="stage"].done')).toHaveCount(4);

      // shipping: read the DACTE
      await part(page, 'read-dacte').click();
      await expect(part(page, 'done')).toContainText(t.doneTitle);
      await expect(page.locator('#demo-warehouse [data-wh="stage"].done')).toHaveCount(5);
      await expect(part(page, 'log')).toContainText(t.logShipped);
      await expect(part(page, 'kpi-cubage')).toHaveText(x.cubage);
      await expectNoNaN(page);

      // start over from the phone
      await part(page, 'again').click();
      await expect(part(page, 'read-danfe')).toBeVisible();
      await expect(page.locator('#demo-warehouse [data-wh="stage"].done')).toHaveCount(0);
    });

    test('a bad weight never reaches the log as NaN', async ({ page }) => {
      await part(page, 'read-danfe').click();
      for (let i = 0; i < 3; i++) await part(page, 'check').nth(i).click();
      await part(page, 'receive-done').click();
      await part(page, 'ai-validate').click();
      for (let i = 0; i < 3; i++) await part(page, 'pick').nth(i).click();
      await part(page, 'vol-p').fill('heavy');
      await part(page, 'vol-a').fill('1e999');
      await part(page, 'pick-done').click();
      await expect(part(page, 'kpi-cubage')).toHaveText(x.zero);
      const log = await part(page, 'log').innerText();
      expect(log).not.toContain('NaN');
      expect(log).not.toContain('Infinity');
      expect(log).not.toContain('heavy');
    });

    test('the reset button starts the order over', async ({ page }) => {
      await part(page, 'read-danfe').click();
      await expect(part(page, 'check')).toHaveCount(3);
      await page.locator('[data-demo-reset="warehouse"]').click();
      await expect(part(page, 'read-danfe')).toBeVisible();
      await expect(part(page, 'check')).toHaveCount(0);
    });
  });

  test(`a link to #demo-warehouse opens that panel (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/#demo-warehouse`);
    await expect(page.locator('#demo-warehouse')).toBeVisible();
    await expect(page.locator('#demo-warehouse [data-wh="read-danfe"]')).toBeVisible();
  });
}
