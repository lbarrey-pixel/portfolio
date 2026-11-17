import { expect, test } from '@playwright/test';
import { getContent } from '../../src/content';
import type { Locale } from '../../src/i18n/locales';

const LOCALES: Locale[] = ['en', 'pt-br'];

for (const locale of LOCALES) {
  const c = getContent(locale);

  test(`metadata (${locale})`, async ({ page, request }) => {
    await page.goto(`/${locale}/`);
    const attr = (selector: string, name: string) => page.locator(`head ${selector}`).getAttribute(name);

    await expect(page).toHaveTitle(c.meta.title);
    expect(await attr('meta[name="description"]', 'content')).toBe(c.meta.description);
    expect(await attr('meta[property="og:title"]', 'content')).toBe(c.meta.title);
    expect(await attr('meta[property="og:description"]', 'content')).toBe(c.meta.description);
    expect(await attr('meta[property="og:type"]', 'content')).toBe('website');
    expect(await attr('meta[property="og:locale"]', 'content')).toBe(locale === 'en' ? 'en_US' : 'pt_BR');
    expect(await attr('meta[name="twitter:card"]', 'content')).toBe('summary_large_image');

    // one canonical, pointing at this page
    await expect(page.locator('head link[rel="canonical"]')).toHaveCount(1);
    expect(new URL((await attr('link[rel="canonical"]', 'href'))!, page.url()).pathname).toBe(`/${locale}/`);

    // the three language alternates
    const alternates = await page
      .locator('head link[rel="alternate"][hreflang]')
      .evaluateAll((els) => els.map((el) => [el.getAttribute('hreflang'), new URL((el as HTMLLinkElement).href).pathname]));
    expect(alternates).toEqual([
      ['en', '/en/'],
      ['pt-BR', '/pt-br/'],
      ['x-default', '/'],
    ]);

    // the social image exists and is a 1200×630 PNG
    const og = await attr('meta[property="og:image"]', 'content');
    expect(new URL(og!, page.url()).pathname).toBe('/og.png');
    expect(await attr('meta[property="og:image:width"]', 'content')).toBe('1200');
    expect(await attr('meta[property="og:image:height"]', 'content')).toBe('630');
    const image = await request.get(new URL(og!, page.url()).pathname);
    expect(image.status()).toBe(200);
    expect(image.headers()['content-type']).toContain('image/png');
    const bytes = await image.body();
    expect(bytes.readUInt32BE(16)).toBe(1200);
    expect(bytes.readUInt32BE(20)).toBe(630);
  });
}

test('the two languages have different titles and descriptions', () => {
  const en = getContent('en').meta;
  const pt = getContent('pt-br').meta;
  expect(en.title).not.toBe(pt.title);
  expect(en.description).not.toBe(pt.description);
});

test('robots.txt allows crawling', async ({ request }) => {
  const res = await request.get('/robots.txt');
  expect(res.status()).toBe(200);
  expect(await res.text()).toMatch(/User-agent: \*\s+Allow: \//);
});

test('the 404 page speaks both languages and links home in each', async ({ page }) => {
  const res = await page.goto('/404.html');
  expect(res?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('main [lang="en"]').first()).toBeVisible();
  await expect(page.locator('main [lang="pt-BR"]').first()).toBeVisible();
  await expect(page.locator('main a[href="/en/"]')).toBeVisible();
  await expect(page.locator('main a[href="/pt-br/"]')).toBeVisible();
  await page.locator('main a[href="/pt-br/"]').click();
  await expect(page).toHaveURL(/\/pt-br\/$/);
});

test('an unknown address gets the 404 page', async ({ page }) => {
  const res = await page.goto('/en/nothing-here');
  expect(res?.status()).toBe(404);
  await expect(page.locator('main a[href="/en/"]')).toBeVisible();
});
