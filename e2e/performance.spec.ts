import { test, expect } from '@playwright/test';

test.describe('Performance metrics', () => {
  test('login page loads within budget', async ({ page }) => {
    const start = Date.now();
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(5000);
  });

  test('page has reasonable DOM size', async ({ page }) => {
    await page.goto('/auth/login');
    const domNodes = await page.evaluate(() => document.querySelectorAll('*').length);
    expect(domNodes).toBeLessThan(500);
  });

  test('no console errors during navigation', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/auth/login');
    await page.goto('/auth/register');
    await page.goto('/auth/forgot-password');
    expect(errors.filter((e) => !e.includes('favicon'))).toHaveLength(0);
  });
});
