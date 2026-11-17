import { expect, test, type Page } from '@playwright/test';

/** Every [data-reveal] element that is rendered (not inside a hidden tab panel), with its resting state. */
function revealStates(page: Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-lines]')]
      .filter((el) => el.getClientRects().length > 0)
      .map((el) => {
        const s = getComputedStyle(el);
        return {
          el: `${el.tagName.toLowerCase()}.${el.className}`,
          opacity: s.opacity,
          transform: s.transform,
          translate: s.translate,
          isIn: el.classList.contains('is-in'),
        };
      }),
  );
}

async function scrollToBottomInSteps(page: Page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 200));
  });
}

test.describe('motion', () => {
  test('the page marks itself as scripted and has things to reveal', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('html')).toHaveClass(/\bjs\b/);
    expect((await revealStates(page)).length).toBeGreaterThan(12);
  });

  test.describe('reduced motion', () => {
    test.use({ reducedMotion: 'reduce' });

    test('reduced motion shows all content', async ({ page }) => {
      await page.goto('/en/');
      await page.waitForTimeout(300);
      const states = await revealStates(page);
      expect(states.length).toBeGreaterThan(12);
      for (const s of states) {
        expect(s, s.el).toMatchObject({ opacity: '1', transform: 'none', translate: 'none' });
      }
      // Count-up numbers already show their final value, and stay there.
      const metrics = page.locator('[data-project-panel="quoting"] [data-count]');
      await expect(metrics).toHaveText(['224', '65%', '4,680']);
      await page.locator('[data-project-panel="quoting"]').scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await expect(metrics).toHaveText(['224', '65%', '4,680']);
      // Headlines are not split into animated words.
      await expect(page.locator('[data-reveal-lines] span')).toHaveCount(0);
    });
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('reveal elements are visible', async ({ page }) => {
      await page.goto('/en/');
      const states = await revealStates(page);
      expect(states.length).toBeGreaterThan(12);
      for (const s of states) {
        expect(s, s.el).toMatchObject({ opacity: '1', transform: 'none', translate: 'none' });
      }
    });
  });

  test('scrolling to the bottom reveals everything', async ({ page }) => {
    await page.goto('/pt-br/');
    const before = await revealStates(page);
    expect(before.some((s) => !s.isIn && s.opacity === '0')).toBe(true);
    await scrollToBottomInSteps(page);
    const after = await revealStates(page);
    for (const s of after) expect(s.isIn, s.el).toBe(true);
    await page.waitForTimeout(1600);
    for (const s of await revealStates(page)) expect(s.opacity, s.el).toBe('1');
  });

  test('metrics count up to their final value', async ({ page }) => {
    await page.goto('/pt-br/');
    await page.locator('[data-project-panel="quoting"]').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-project-panel="quoting"] [data-count]')).toHaveText(['224', '65%', '4.680']);
  });

  test('a card leans toward the pointer and settles when it leaves', async ({ page }) => {
    await page.goto('/en/');
    const card = page.locator('#pains [data-tilt]').first();
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    const box = (await card.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.3);
    await expect.poll(() => card.evaluate((el) => el.style.getPropertyValue('--gx'))).not.toBe('');
    await expect.poll(() => card.evaluate((el) => el.style.transform)).toContain('rotate');
    await page.mouse.move(2, 2);
    await expect.poll(() => card.evaluate((el) => el.style.transform)).toBe('');
  });
});
