import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Helper: dismiss the splash screen if visible
async function dismissSplash(page: Page) {
  try {
    // The EnterScreen takes 2300ms to show the button, then 2800ms to exit after click.
    // Wait up to 5s for "Press here to enter" to appear, then click it.
    await page.click('text="Press here to enter"', { timeout: 6000 });
    // Wait for the full 2800ms exit animation to complete before interacting with the main app.
    await page.waitForTimeout(3200);
  } catch (e) {
    // Splash already dismissed or not shown — wait a bit for any in-progress animation
    await page.waitForTimeout(500);
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
    test.setTimeout(90000);

    await page.goto('http://127.0.0.1:3000');
    await dismissSplash(page);

    // Open profile/registration modal via "Join the community" CTA
    page.on('pageerror', (err) => console.log('PAGE ERROR: ' + err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') console.log('CONSOLE ERROR: ' + msg.text());
    });

    await page.click('button:has-text("Join the community")');


    // The modal opens directly in creation mode when there are no pets
    // Verify the modal header shows registration form
    await expect(page.locator('h2:has-text("Register New Companion")')).toBeVisible({ timeout: 10000 });

    // Fill required fields first (file input is at top but we fill text first)
    await page.fill('input[placeholder="e.g. Olive, Bailey, Cooper"]', 'Test Doggo');
    await page.fill('input[placeholder="e.g. Golden Retriever, Tabby Cat"]', 'Pug');
    await page.fill('input[placeholder="e.g. +1 (555) 234-5678"]', '+15555555555');

    // Set file on the file input in the form
    await page.setInputFiles('input[type="file"]', validImage);

    // Submit the form — button text is "Complete Profile & Generate Tag"
    await page.click('button[type="submit"]');

    // Wait 3 seconds
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/screenshot.png', fullPage: true });

    // After successful API calls, the modal transitions to profile view.
    // The pet name appears as a button tab in the selector.
    await expect(page.locator('text=Test Doggo').first()).toBeVisible({ timeout: 10000 });
  });


  test('Identify - No Dog', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000');
    await dismissSplash(page);

    // Open identify modal via the header "Identify" nav button
    await page.click('button:has-text("Identify")');
    await expect(page.locator('h2:has-text("Identify Pet")')).toBeVisible({ timeout: 10000 });

    // Upload no-dog image directly to hidden file input
    await page.setInputFiles('input[type="file"]', noDogImage);
    await page.locator('.fixed button:has-text("Identify")').click();

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
    await page.locator('.fixed button:has-text("Identify")').click();

    // Backend returns LOW_QUALITY_IMAGE — error message contains quality language
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
    await page.locator('.fixed button:has-text("Identify")').click();

    // DEMONSTRATOR mode returns MATCH with high confidence
    await expect(page.locator('text=Match found')).toBeVisible({ timeout: 30000 });
    // Prototype Mode disclaimer must be visible
    await expect(page.locator('text=Prototype Mode').first()).toBeVisible({ timeout: 5000 });
  });

});
