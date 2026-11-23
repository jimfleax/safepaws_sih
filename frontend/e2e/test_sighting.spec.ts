import { test, expect } from '@playwright/test';

test.describe('Public Sighting Journey', () => {
  test('renders sighting form with correct landmark and required input controls', async ({ page }) => {
    await page.goto('/sightings/new');
    
    // Assert semantic primary main landmark is rendered
    const mainLandmark = page.locator('main#main-content');
    await expect(mainLandmark).toBeVisible();

    // Assert crisis header presence
    const headerTitle = page.locator('h1');
    await expect(headerTitle).toHaveText(/Report a Sighting/i);

    // Assert key interaction controls
    const nameInput = page.locator('#reporterName');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveAttribute('required', '');

    // Assert submit button is rendered with proper text
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toHaveText(/Submit Emergency Sighting|Submit Sighting/i);

    // Assert user input interaction
    await nameInput.fill('Verified Good Samaritan');
    await expect(nameInput).toHaveValue('Verified Good Samaritan');
  });
});
