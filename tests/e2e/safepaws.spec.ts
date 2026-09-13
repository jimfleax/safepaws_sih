import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Helper: dismiss the splash screen if visible
async function dismissSplash(page: Page) {
  try {
    // Wait for splash screen text and click it
    await page.click('text="Press here to enter"', { timeout: 5000 });
    // Wait for splash to exit
    await page.waitForTimeout(1000);
  } catch (e) {
    // Splash already dismissed or not shown
  }
}

test.describe.serial('SafePaws Core Flows', () => {
  let validImage: string;
  let noDogImage: string;
  let lowQualityImage: string;

  test.beforeAll(() => {
    const tempDir = os.tmpdir();
    validImage = path.join(process.cwd(), 'valid_dog.jpg');
    noDogImage = path.join(tempDir, 'nodog.jpg');
    lowQualityImage = path.join(tempDir, 'lowquality.jpg');

    // These special byte sequences trigger deterministic mock ML behavior
    fs.writeFileSync(noDogImage, Buffer.from('mock_no_dog'));
    fs.writeFileSync(lowQualityImage, Buffer.from('mock_low_quality'));
  });

  test('Registration Flow', async ({ page }) => {
    // Increase timeout for this test since it involves API calls
    test.setTimeout(60000);

    await page.goto('http://127.0.0.1:3000');
    await dismissSplash(page);

    // Open profile/registration modal via "Join the community" CTA
    await page.click('button:has-text("Join the community")');

    // The modal opens directly in creation mode when there are no pets
    // Verify the modal header shows registration form
    await expect(page.locator('h2:has-text("Register New Companion")')).toBeVisible({ timeout: 10000 });

    // Set file directly on the hidden file input in the form
    // (The UI's file input is directly in the form, not behind a file chooser dialog)
    await page.setInputFiles('input[type="file"]', validImage);

    // Fill required fields
    await page.fill('input[placeholder="e.g. Olive, Bailey, Cooper"]', 'Test Doggo');
    await page.fill('input[placeholder="e.g. Golden Retriever, Tabby Cat"]', 'Pug');
    // Phone is optional but fill it
    await page.fill('input[placeholder="e.g. +1 (555) 234-5678"]', '+15555555555');

    // Submit the form
    await page.click('button:has-text("Complete Profile")');

    // After successful registration + enrollment, the modal switches to pet profile view
    // The pet name appears as a tab button in the selector
    await expect(page.locator('button:has-text("Test Doggo")')).toBeVisible({ timeout: 30000 });
  });

  test('Identify - No Dog', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000');
    await dismissSplash(page);

    // Open identify modal via the header "Identify" nav button
    await page.click('button:has-text("Identify")');
    await expect(page.locator('h2:has-text("Identify Pet")')).toBeVisible({ timeout: 10000 });

    // Upload no-dog image directly to hidden file input
    await page.setInputFiles('input[type="file"]', noDogImage);

    // Scan button should now be enabled
    await page.click('button:has-text("Identify")');

    // Expect error message containing backend error text
    await expect(
      page.locator('text=/Identification failed.*No dog detected/')
    ).toBeVisible({ timeout: 15000 });
  });

  test('Identify - Low Quality', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000');
    await dismissSplash(page);

    await page.click('button:has-text("Identify")');
    await expect(page.locator('h2:has-text("Identify Pet")')).toBeVisible({ timeout: 10000 });

    await page.setInputFiles('input[type="file"]', lowQualityImage);
    await page.click('button:has-text("Identify")');

    // Backend returns LOW_QUALITY_IMAGE → error message contains quality language
    await expect(
      page.locator('text=/Identification failed/')
    ).toBeVisible({ timeout: 15000 });
  });

  test('Identify - Success Match', async ({ page }) => {
    test.setTimeout(60000);

    await page.goto('http://127.0.0.1:3000');
    await dismissSplash(page);

    await page.click('button:has-text("Identify")');
    await expect(page.locator('h2:has-text("Identify Pet")')).toBeVisible({ timeout: 10000 });

    // Upload valid dog image — matches the registered pet's FAISS vector
    await page.setInputFiles('input[type="file"]', validImage);
    await page.click('button:has-text("Identify")');

    // DEMONSTRATOR mode returns MATCH with high confidence
    await expect(page.locator('text=Match found')).toBeVisible({ timeout: 30000 });
    // Prototype Mode disclaimer must be visible
    await expect(page.locator('text=Prototype Mode')).toBeVisible({ timeout: 5000 });
  });

});
