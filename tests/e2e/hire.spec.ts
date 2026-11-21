import { expect, test, type Page } from '@playwright/test';
import hire from '../../src/content/hire';

const ALLOWED = (href: string) =>
  href.startsWith('#') ||
  href.startsWith('https://github.com/lbarrey-pixel') ||
  href === 'https://www.linkedin.com/in/leonardobarrey' ||
  href === 'mailto:leonardobarrey@gmail.com' ||
  href === '/Leonardo_Barrey_CV.pdf';

async function hrefs(page: Page) {
  return page.locator('a[href]').evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));
}

test('the hire page renders for a recruiter and stays on this page', async ({ page }) => {
  const res = await page.goto('/hire/');
  expect(res?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle(hire.meta.title);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', hire.meta.description);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/hire\/$/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', hire.meta.title);
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', hire.meta.description);
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', /\/hire\/$/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\.png$/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await expect(page.locator('link[rel="alternate"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:locale:alternate"]')).toHaveCount(0);

  await expect(page.locator('#hero h1')).toContainText('Leonardo Barrey');
  await expect(page.locator('#hero h1')).toContainText('AI-Native Full-Stack Engineer');
  await expect(page.locator('#hero')).toContainText('Florianópolis, Brazil');
  await expect(page.locator('#hero')).toContainText('UTC−3');

  // No site menu, language switch, or way back to the sales pages.
  await expect(page.locator('[data-nav], [data-lang-switch]')).toHaveCount(0);
  await expect(page.locator('a[href="/"], a[href="/en/"], a[href="/pt-br/"], a[href*="wa.me"]')).toHaveCount(0);

  const links = await hrefs(page);
  expect(links.filter((href) => !ALLOWED(href))).toEqual([]);
  expect(links).toEqual(
    expect.arrayContaining([
      'https://github.com/lbarrey-pixel',
      'https://github.com/lbarrey-pixel/cotador',
      'https://github.com/lbarrey-pixel/doce-pedidos',
      'https://github.com/lbarrey-pixel/prospect-flow',
      'https://github.com/lbarrey-pixel/cross-dock',
      'https://github.com/lbarrey-pixel/painel-mei',
      'https://www.linkedin.com/in/leonardobarrey',
      'mailto:leonardobarrey@gmail.com',
      '/Leonardo_Barrey_CV.pdf',
    ]),
  );
  await expect(page.locator('a[href="/Leonardo_Barrey_CV.pdf"]')).toHaveCount(2);
  await expect(page.locator('#hero')).toContainText('15+ years in IT');
  await expect(page.locator('#experience')).toContainText('AT&IT');
  await expect(page.locator('#traits')).not.toContainText('Steady');

  await expect(page.locator('#work [data-flow-node]')).toHaveCount(20);
  await expect(page.locator('#method h2')).toHaveText('How I build');
  await expect(page.locator('#method [data-method-step]')).toHaveCount(4);
  await expect(page.locator('#method .scenario')).toHaveCount(0);
  await expect(page.locator('a[href="#method"]')).toHaveCount(0);
  await expect(page.locator('#traits')).toContainText('What it is like to work with me');
  await expect(page.locator('#traits')).toContainText('not involved in day-to-day operations');
  await expect(page.locator('#hire, main')).not.toContainText('does not need me');
  const disclaimer = ((await page.locator('body').innerText()).match(/fictitious|fictional/gi) ?? []);
  expect(disclaimer).toHaveLength(2);
  await expect(page.locator('#traits')).not.toContainText(/ADS|college|Systems Analysis/i);
  await expect(page.locator('#experience')).toContainText('Kist Soluções');
  await expect(page.locator('#experience')).toContainText('2013');
  await expect(page.locator('#contact')).toContainText('leonardobarrey@gmail.com');
});

test('the hire demos run', async ({ page }) => {
  await page.goto('/hire/');

  await page.locator('#try [data-demo-tab="quoting"]').click();
  await expect(page.locator('#demo-quoting')).toBeVisible();
  await page.locator('#demo-quoting [data-qt="process"]').click();
  await expect(page.locator('#demo-quoting [data-qt="row"]')).toHaveCount(5);
  await expect(page.locator('#demo-quoting [data-qt="searching"]')).toHaveCount(0, { timeout: 3000 });
  await expect(page.locator('#demo-quoting [data-qt="export"]')).toBeEnabled();

  await page.locator('#try [data-demo-tab="bakery"]').click();
  await expect(page.locator('#demo-bakery [data-add]').first()).toBeVisible();

  await page.locator('#try [data-demo-tab="crm"]').click();
  await expect(page.locator('#demo-crm [data-cr="next"]')).toBeVisible();

  await page.locator('#try [data-demo-tab="warehouse"]').click();
  await expect(page.locator('#demo-warehouse [data-wh="read-danfe"]')).toBeVisible();
});

test('the case-study link opens its demo', async ({ page }) => {
  await page.goto('/hire/');
  await page.locator('#work [data-project-tab="crm"]').click();
  await page.locator('#work a[href="#demo-crm"]').click();
  await expect(page.locator('#demo-crm')).toBeVisible();
  await expect(page.locator('#demo-crm [data-cr="card"]').first()).toBeVisible();
});

test('the sales pages do not link to /hire/', async ({ page }) => {
  for (const path of ['/en/', '/pt-br/']) {
    await page.goto(path);
    await expect(page.locator('a[href*="/hire"]')).toHaveCount(0);
    await expect(page.locator('#hero h1')).toBeVisible();
  }
});
