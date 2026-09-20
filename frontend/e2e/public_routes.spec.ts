import { test, expect } from '@playwright/test';
import * as path from 'path';

test('Scan page loads and scan works', async ({ page }) => {
  await page.goto('/scan');
  await expect(page.getByText('Scan a Dog')).toBeVisible();
});

test('Public Profile loads', async ({ page }) => {
  await page.goto('/p/123');
  await expect(page.locator('body')).toBeVisible();
});
