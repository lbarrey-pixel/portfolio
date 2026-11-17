import { expect, test, type Page } from '@playwright/test';
import { getContent } from '../../src/content';
import { strings } from '../../src/demos/bakery/strings';
import type { Locale } from '../../src/i18n/locales';

const LOCALES: Locale[] = ['en', 'pt-br'];
const EXPECT = {
  en: { km: '4.2 km', fee: 'R$14.00', subtotal: 'R$39.80', total: 'R$53.80' },
  'pt-br': { km: '4,2 km', fee: 'R$ 14,00', subtotal: 'R$ 39,80', total: 'R$ 53,80' },
} as const;

const nbsp = (s: string | null) => (s ?? '').replace(/ /g, ' ');
const part = (page: Page, name: string) => page.locator(`#demo-bakery [data-bk="${name}"]`);

async function expectNoNaN(page: Page) {
  expect(await page.locator('#demo-bakery').innerText()).not.toContain('NaN');
}

for (const locale of LOCALES) {
  const c = getContent(locale);
  const t = strings[locale];
  const x = EXPECT[locale];

  test.describe(`bakery demo (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/`);
      await page.locator('#try [data-demo-tab="bakery"]').click();
      await expect(page.locator('#demo-bakery')).toBeVisible();
    });

    test('the panel explains itself: hints, fictitious-data note, reset', async ({ page }) => {
      const panel = page.locator('#demo-bakery');
      for (const hint of c.tryIt.hints.bakery) await expect(panel).toContainText(hint);
      await expect(panel).toContainText(c.tryIt.fakeNote.bakery);
      await expect(page.locator('[data-demo-reset="bakery"]')).toHaveText(c.tryIt.reset);
      await expect(panel).toContainText(t.shop);
    });

    test('order two flans, pay by Pix, and see the order on the owner panel', async ({ page }) => {
      // menu → cart
      await expect(part(page, 'go')).toBeDisabled();
      await page.locator('#demo-bakery [data-add="ch"]').click();
      await page.locator('#demo-bakery [data-add="ch"]').click();
      await expect(part(page, 'go')).toContainText('(2 ');
      expect(nbsp(await part(page, 'go').textContent())).toContain(x.subtotal);
      await part(page, 'go').click();

      // a partial CEP: a helper message, no address, cannot pay
      await part(page, 'cep').fill('8801');
      await part(page, 'cep').blur();
      await expect(part(page, 'msg')).toHaveText(t.cepMessage);
      await expect(part(page, 'address')).toHaveCount(0);
      await expect(part(page, 'pay')).toBeDisabled();
      await expectNoNaN(page);

      // the example CEP: address at 4.2 km, then the fee
      await part(page, 'example').click();
      await expect(part(page, 'cep')).toHaveValue('88010-000');
      await expect(part(page, 'address')).toContainText(x.km);
      await expect(part(page, 'pay')).toBeDisabled();
      await part(page, 'calc').click();
      expect(nbsp(await part(page, 'fee').textContent())).toBe(x.fee);
      expect(nbsp(await part(page, 'total').textContent())).toBe(x.total);
      await expectNoNaN(page);

      // pay
      await part(page, 'pay').click();
      await expect(part(page, 'qr')).toBeVisible();
      await part(page, 'simulate').click();
      await expect(part(page, 'confirmed')).toContainText(t.paidTitle);
      const order = part(page, 'owner-order');
      await expect(order).toContainText(`2× ${t.menu[0].name}`);
      expect(nbsp(await order.textContent())).toContain(x.total);
      await expectNoNaN(page);

      // a new order starts from the menu, empty
      await part(page, 'new').click();
      await expect(part(page, 'go')).toBeDisabled();
      await expect(part(page, 'go')).toContainText('(0 ');
    });

    test('typing a full CEP finds the address without the example button', async ({ page }) => {
      await page.locator('#demo-bakery [data-add="fa"]').click();
      await part(page, 'go').click();
      await part(page, 'cep').pressSequentially('88010000');
      await expect(part(page, 'address')).toContainText(x.km);
    });

    test('the reset button puts the demo back on the menu', async ({ page }) => {
      await page.locator('#demo-bakery [data-add="dl"]').click();
      await part(page, 'go').click();
      await expect(part(page, 'cep')).toBeVisible();
      await page.locator('[data-demo-reset="bakery"]').click();
      await expect(part(page, 'go')).toBeDisabled();
      await expect(part(page, 'cep')).toHaveCount(0);
    });
  });

  test(`loading the page does not jump down to the demos (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    await expect(page.locator('#demo-bakery [data-bk="go"]')).toBeVisible();
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test(`a link to #demo-bakery opens that panel (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/#demo-bakery`);
    await expect(page.locator('#demo-bakery')).toBeVisible();
    await expect(page.locator('#try [data-demo-tab="bakery"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#demo-bakery')).toBeInViewport();
  });
}
