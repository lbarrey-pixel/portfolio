// Cases found by the final review: each one failed before its fix.
import { expect, test } from '@playwright/test';

test.describe('lightbox on a desktop screen', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('the picture fits the screen and the Next button can be clicked', async ({ page }) => {
    await page.goto('/en/');
    await page.locator('#work [data-project-tab="bakery"]').click();
    await page.locator('#work [data-gallery="bakery"]').first().click();
    const box = page.locator('[data-lightbox]');
    await expect(box).toBeVisible();
    const img = box.locator('img');
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);

    const pic = (await img.boundingBox())!;
    const next = (await box.locator('[data-lightbox-next]').boundingBox())!;
    expect(pic.y).toBeGreaterThanOrEqual(0);
    expect(pic.y + pic.height).toBeLessThanOrEqual(800);
    expect(pic.x + pic.width).toBeLessThanOrEqual(1280);
    expect(pic.y + pic.height, 'picture ends above the Previous/Next row').toBeLessThanOrEqual(next.y);

    await box.locator('[data-lightbox-next]').click();
    await expect(box.locator('[data-lightbox-count]')).toHaveText('2 / 4');
    await box.locator('[data-lightbox-prev]').click();
    await expect(box.locator('[data-lightbox-count]')).toHaveText('1 / 4');
    await box.locator('[data-lightbox-close]').click();
    await expect(box).toBeHidden();
  });
});

test.describe('quoting margin', () => {
  const part = (page: import('@playwright/test').Page, name: string) => page.locator(`#demo-quoting [data-qt="${name}"]`);

  test.beforeEach(async ({ page }) => {
    await page.goto('/en/');
    await page.locator('#try [data-demo-tab="quoting"]').click();
    await part(page, 'process').click();
    await expect(part(page, 'row').nth(4)).toContainText('Rack de parede 12U 570 mm');
  });

  test('typing a margin updates the totals at once, and Export works on the first click', async ({ page }) => {
    await part(page, 'margin').click();
    await part(page, 'margin').press('Control+a');
    await page.keyboard.type('40');
    await expect(part(page, 'total')).toHaveText('R$12,086.62');
    await expect(part(page, 'margin')).toBeFocused();
    await expect(part(page, 'price').first()).toHaveText('R$436.80');

    await part(page, 'export').click(); // straight from the field, no blur first
    await expect(part(page, 'toast')).toBeVisible();
    await expect(part(page, 'csv')).toContainText('R-2041;CAM-2MP-B28;Câmera IP Bullet 2MP PoE 2,8 mm;10;436.80');
  });

  test('the field keeps the keyboard focus while stepping the margin', async ({ page }) => {
    await part(page, 'margin').focus();
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    await expect(part(page, 'margin')).toBeFocused();
    await expect(part(page, 'margin')).toHaveValue('32');
    await expect(part(page, 'total')).toHaveText('R$11,395.96');
  });

  test('changing the margin after exporting updates the file too', async ({ page }) => {
    await part(page, 'export').click();
    await expect(part(page, 'csv')).toContainText(';10;405.60');
    await part(page, 'margin').fill('0');
    await expect(part(page, 'csv')).toContainText(';10;312.00');
  });
});

test.describe('a margin typed while the agent is still pricing', () => {
  test('is kept when the agent answers', async ({ page }) => {
    await page.goto('/en/');
    await page.locator('#try [data-demo-tab="quoting"]').click();
    const part = (name: string) => page.locator(`#demo-quoting [data-qt="${name}"]`);
    await part('process').click();
    await expect(part('searching')).toBeVisible();
    await part('margin').fill('7');
    await expect(part('row').nth(4)).toContainText('Rack de parede 12U 570 mm');
    await expect(part('margin')).toHaveValue('7');
  });
});

// A 1366×768 laptop leaves about 640px of page once the browser's own bars are counted.
for (const locale of ['en', 'pt-br'] as const) {
  test.describe(`work flow on a short laptop screen (${locale})`, () => {
    test.use({ viewport: { width: 1366, height: 640 } });

    test('the stage pins and the horizontal flow fits inside it', async ({ page }) => {
      await page.goto(`/${locale}/`);
      const stage = page.locator('[data-flow-stage]');
      expect(await stage.evaluate((el) => getComputedStyle(el).position)).toBe('sticky');

      for (const id of ['quoting', 'bakery', 'crm', 'warehouse']) {
        await page.evaluate(() => {
          const s = document.querySelector('[data-flow-scroller]')!;
          window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY + 200, behavior: 'instant' });
        });
        await page.locator(`#work [data-project-tab="${id}"]`).click();
        await page.waitForTimeout(800);
        const result = await page.evaluate((pid) => {
          const stageRect = document.querySelector('[data-flow-stage]')!.getBoundingClientRect();
          const panel = document.querySelector(`[data-project-panel="${pid}"]`)!;
          const rects = (sel: string) => [...panel.querySelectorAll(sel)].map((el) => el.getBoundingClientRect());
          const labels = rects('.flow__label');
          const blocks = [...rects('.project__intro'), ...rects('.project__metrics')];
          const hit = (a: DOMRect, b: DOMRect) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
          let overlaps = 0;
          for (let i = 0; i < labels.length; i++) {
            for (let j = i + 1; j < labels.length; j++) if (hit(labels[i], labels[j])) overlaps++;
            for (const b of blocks) if (hit(labels[i], b)) overlaps++;
          }
          return {
            overlaps,
            inside: [...labels, ...blocks].every(
              (r) => r.top >= stageRect.top - 1 && r.bottom <= stageRect.bottom + 1 && r.left >= 0 && r.right <= window.innerWidth,
            ),
          };
        }, id);
        expect(result, id).toEqual({ overlaps: 0, inside: true });
      }
    });
  });
}
