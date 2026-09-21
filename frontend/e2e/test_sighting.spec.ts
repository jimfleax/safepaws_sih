import { test, expect } from '@playwright/test';
test('Public Sighting Route', async ({ page }) => {
  await page.goto('/sightings/new');
  await page.waitForTimeout(1000);
  const text = await page.locator('body').innerText();
  console.log('INNER:', text);
});
