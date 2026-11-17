import { expect, test } from '@playwright/test';

test('GET /en/ returns 200', async ({ request }) => {
  const res = await request.get('/en/');
  expect(res.status()).toBe(200);
});
