import { expect, test, type Page } from '@playwright/test';
import { strings } from '../../src/demos/quoting/strings';
import type { Locale } from '../../src/i18n/locales';

const LOCALES: Locale[] = ['en', 'pt-br'];
const EXPECT = {
  en: { cost: 'R$8,633.30', total30: 'R$11,223.29', profit30: 'R$2,589.99', zero: 'R$0.00', total200: 'R$25,899.90' },
  'pt-br': {
    cost: 'R$ 8.633,30',
    total30: 'R$ 11.223,29',
    profit30: 'R$ 2.589,99',
    zero: 'R$ 0,00',
    total200: 'R$ 25.899,90',
  },
} as const;

const part = (page: Page, name: string) => page.locator(`#demo-quoting [data-qt="${name}"]`);
const text = async (page: Page, name: string) => ((await part(page, name).textContent()) ?? '').replace(/ /g, ' ');

async function expectNoNaN(page: Page) {
  expect(await page.locator('#demo-quoting').innerText()).not.toContain('NaN');
}

async function setMargin(page: Page, value: string) {
  await part(page, 'margin').fill(value);
  await part(page, 'margin').blur();
}

for (const locale of LOCALES) {
  const t = strings[locale];
  const x = EXPECT[locale];

  test.describe(`quoting demo (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/`);
      await page.locator('#try [data-demo-tab="quoting"]').click();
      await expect(page.locator('#demo-quoting')).toBeVisible();
    });

    test('process the email, let the agent price the rack, and export to the ERP', async ({ page }) => {
      // step 1: the example email is waiting
      await expect(part(page, 'email')).toHaveValue(/10 câmeras IP bullet 2MP PoE/);
      await part(page, 'process').click();

      // step 2: five rows; the rack is still being researched and export is blocked
      await expect(part(page, 'row')).toHaveCount(5);
      await expect(part(page, 'searching')).toBeVisible();
      await expect(part(page, 'export')).toBeDisabled();
      await expectNoNaN(page);

      // within 3 s the agent fills it in
      await expect(part(page, 'searching')).toHaveCount(0, { timeout: 3000 });
      await expect(part(page, 'row').nth(4)).toContainText('Rack de parede 12U 570 mm');
      await expect(part(page, 'export')).toBeEnabled();
      expect(await text(page, 'cost')).toBe(x.cost);
      expect(await text(page, 'total')).toBe(x.total30);
      expect(await text(page, 'profit')).toBe(x.profit30);

      // step 3: export shows the confirmation and the file
      await part(page, 'export').click();
      await expect(part(page, 'toast')).toHaveText(t.toast);
      await expect(part(page, 'csv')).toContainText('numero_proposta;codigo;descricao;qtd;valor_unit');
      await expect(part(page, 'csv')).toContainText('R-2041;CAM-2MP-B28;Câmera IP Bullet 2MP PoE 2,8 mm;10;405.60');

      // back to the email: everything starts over
      await part(page, 'back').click();
      await expect(part(page, 'process')).toBeVisible();
      await expect(part(page, 'row')).toHaveCount(0);
    });

    test('a bad margin never breaks the totals', async ({ page }) => {
      await part(page, 'process').click();
      await expect(part(page, 'row')).toHaveCount(5);
      await expect(part(page, 'row').nth(4)).toContainText('Rack de parede 12U 570 mm');

      await setMargin(page, '');
      await expect(part(page, 'margin')).toHaveValue('0');
      expect(await text(page, 'total')).toBe(x.cost);
      expect(await text(page, 'profit')).toBe(x.zero);
      await expectNoNaN(page);

      await setMargin(page, '-5');
      await expect(part(page, 'margin')).toHaveValue('0');
      expect(await text(page, 'profit')).toBe(x.zero);
      await expectNoNaN(page);

      await setMargin(page, '999');
      await expect(part(page, 'margin')).toHaveValue('200');
      expect(await text(page, 'total')).toBe(x.total200);
      await expectNoNaN(page);

      await setMargin(page, '30');
      expect(await text(page, 'total')).toBe(x.total30);
    });

    test('the reset button goes back to the email', async ({ page }) => {
      await part(page, 'process').click();
      await expect(part(page, 'row')).toHaveCount(5);
      await page.locator('[data-demo-reset="quoting"]').click();
      await expect(part(page, 'process')).toBeVisible();
      // the agent's late answer from before the reset must not bring the table back
      await page.waitForTimeout(2000);
      await expect(part(page, 'row')).toHaveCount(0);
    });
  });

  test(`a link to #demo-quoting opens that panel (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/#demo-quoting`);
    await expect(page.locator('#demo-quoting')).toBeVisible();
    await expect(page.locator('#demo-quoting')).toContainText(t.title);
  });
}
