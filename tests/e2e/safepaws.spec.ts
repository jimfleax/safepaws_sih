import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

test.describe('SafePaws Core Flows', () => {
  let validImage: string;
  let noDogImage: string;
  let lowQualityImage: string;

  test.beforeAll(() => {
    // Create dummy image files in temp directory
    const tempDir = os.tmpdir();
    validImage = path.join(tempDir, 'valid.jpg');
    noDogImage = path.join(tempDir, 'nodog.jpg');
    lowQualityImage = path.join(tempDir, 'lowquality.jpg');

    // Create 1x1 jpeg files with payload text for mocks
    fs.writeFileSync(validImage, Buffer.from('mock_valid_dog'));
    fs.writeFileSync(noDogImage, Buffer.from('mock_no_dog'));
    fs.writeFileSync(lowQualityImage, Buffer.from('mock_low_quality'));
  });

  test('Identify - No Dog', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Open identify modal
    await page.click('button:has-text("Identify Pet")');
    await expect(page.locator('h2', { hasText: 'Identify Pet' })).toBeVisible();

    // Upload nodog image
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('text=Upload Pet Photo');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(noDogImage);

    // Click Identify
    await page.click('button:has-text("Identify")');

    // Wait for error
    await expect(page.locator('text=Identification failed: No dog detected')).toBeVisible();
  });

  test('Identify - Low Quality', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    await page.click('button:has-text("Identify Pet")');
    await expect(page.locator('h2', { hasText: 'Identify Pet' })).toBeVisible();

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('text=Upload Pet Photo');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(lowQualityImage);

    await page.click('button:has-text("Identify")');

    await expect(page.locator('text=Identification failed: Image quality too low')).toBeVisible();
  });

  test('Identify - Success Match', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    await page.click('button:has-text("Identify Pet")');
    await expect(page.locator('h2', { hasText: 'Identify Pet' })).toBeVisible();

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('text=Upload Pet Photo');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(validImage);

    await page.click('button:has-text("Identify")');

    // M0 Mock backend returns MATCH for mock-pet-id-123
    await expect(page.locator('text=Match found')).toBeVisible();
  });

  test('Registration Flow', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Open Join/Profile modal
    await page.click('text=Join the Neighborhood');
    
    // Switch to Create New Pet tab if not already on it
    await page.click('button:has-text("Add Pet")');

    await page.fill('input[placeholder="e.g. Olive, Bailey, Cooper"]', 'Test Doggo');
    await page.fill('input[placeholder="e.g. Golden Retriever, Tabby Cat"]', 'Pug');
    await page.fill('input[placeholder="e.g. +1 (555) 234-5678"]', '+15555555555');

    const fileChooserPromise = page.waitForEvent('filechooser');
    // We can just set file input directly
    await page.setInputFiles('input[type="file"]', validImage);

    await page.click('button:has-text("Complete Profile")');

    // Wait for modal to switch to the registered pet view (which shows the name 'Test Doggo')
    await expect(page.locator('h3', { hasText: 'Test Doggo' })).toBeVisible();
  });
});
