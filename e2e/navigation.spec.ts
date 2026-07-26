import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('landing page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Hêz/);
  });

  test('all auth pages are accessible', async ({ page }) => {
    const authPages = ['/auth/login', '/auth/register', '/auth/forgot-password'];
    for (const path of authPages) {
      await page.goto(path);
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('offline page loads', async ({ page }) => {
    await page.goto('/offline');
    await expect(page.locator('body')).toBeVisible();
  });

  test('404 page shows for unknown routes', async ({ page }) => {
    const response = await page.goto('/this-path-does-not-exist');
    expect(response?.status()).toBe(404);
  });
});
