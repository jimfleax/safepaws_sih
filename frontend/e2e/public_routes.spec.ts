import { test, expect } from '@playwright/test';

test.describe('Public Tool & Profile Routes', () => {
  test('Scan page loads with HUD telemetry and accessible controls', async ({ page }) => {
    await page.goto('/scan');
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.getByText(/SAFEPAWS \/\/ BIOMETRIC HUD/i)).toBeVisible();
    await expect(page.locator('button[aria-label="Close scan"]')).toBeVisible();
  });

  test('Public Profile loads semantic companion landmark and status container', async ({ page }) => {
    await page.goto('/p/123');
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.getByText(/COMPANION IDENTITY|Tag Not Found|Looking up pet|Failed to fetch pet|Not Found/i).first()).toBeVisible();
  });
});
