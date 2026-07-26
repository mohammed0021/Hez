import { test, expect } from '@playwright/test';

test.describe('PWA offline support', () => {
  test('serves offline fallback page', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await context.setOffline(true);
    await page.reload();

    await expect(page).toHaveURL(/\/offline/);
    await context.setOffline(false);
  });

  test('service worker is registered', async ({ page }) => {
    await page.goto('/');
    const hasSw = await page.evaluate(async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();
      return registrations.length > 0;
    });
    expect(hasSw).toBe(true);
  });
});
