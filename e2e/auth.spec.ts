import { test, expect } from '@playwright/test';

test.describe('Authentication flows', () => {
  test('shows login page', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible();
  });

  test('shows register page', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page.getByRole('heading', { name: /Create account/i })).toBeVisible();
  });

  test('shows forgot password page', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await expect(page.getByRole('heading', { name: /Reset password/i })).toBeVisible();
  });

  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL(/\/auth\/login/);
  });

  test('validates login form', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/enter a valid email/i)).toBeVisible();
  });
});
