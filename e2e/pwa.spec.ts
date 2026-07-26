import { test, expect } from '@playwright/test';

test.describe('PWA features', () => {
  test('manifest is served', async ({ page }) => {
    const response = await page.goto('/manifest.webmanifest');
    expect(response?.status()).toBe(200);
    const json = await response?.json();
    expect(json.name).toBe('Hêz');
    expect(json.display).toBe('standalone');
  });

  test('service worker is registered', async ({ page }) => {
    await page.goto('/');
    const swUrl = await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      return reg?.active?.scriptURL || null;
    });
    expect(swUrl).toContain('sw.js');
  });

  test('icons are cached with immutable policy', async ({ page }) => {
    const response = await page.goto('/icons/icon-192x192.png');
    const cacheControl = response?.headers()['cache-control'];
    expect(cacheControl).toContain('immutable');
    expect(cacheControl).toContain('max-age=31536000');
  });
});
