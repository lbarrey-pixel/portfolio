import { expect, test } from '@playwright/test';

test('/en/ is English with the en headline', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#hero h1')).toContainText('Fewer spreadsheets.');
  await expect(page.locator('#hero h1')).toContainText('More sales.');
});

test('/pt-br/ is Portuguese', async ({ page }) => {
  await page.goto('/pt-br/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.locator('#hero h1')).toContainText('mais venda.');
});

test.describe('root with a pt-BR browser', () => {
  test.use({ locale: 'pt-BR' });
  test('redirects to /pt-br/', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/pt-br\/$/);
  });
});

test.describe('root with an en-US browser', () => {
  test.use({ locale: 'en-US' });

  test('redirects to /en/', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en\/$/);
  });

  test('the switch is remembered on the next visit to /', async ({ page }) => {
    await page.goto('/en/');
    await page.locator('a[data-lang-switch]').click();
    await expect(page).toHaveURL(/\/pt-br\/$/);
    await page.goto('/');
    await expect(page).toHaveURL(/\/pt-br\/$/);
  });
});

test('switch keeps hash', async ({ page }) => {
  await page.goto('/en/#demo-crm');
  await page.locator('a[data-lang-switch]').click();
  await expect(page).toHaveURL(/\/pt-br\/#demo-crm$/);
});
