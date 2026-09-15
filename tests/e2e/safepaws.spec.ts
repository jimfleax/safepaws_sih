import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

async function dismissSplash(page: Page) {
  try {
    await page.getByText('Press here to enter').click({ timeout: 6000 });
    await page.waitForTimeout(3200);
  } catch (e) {
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

    const validBytes = fs.readFileSync(validImage);

    fs.writeFileSync(noDogImage, Buffer.concat([validBytes, Buffer.from('mock_no_dog')]));
    fs.writeFileSync(lowQualityImage, Buffer.concat([validBytes, Buffer.from('mock_low_confidence')]));
  });

  test('Happy Path: Register -> Enroll -> Identify -> Sighting', async ({ page }) => {
    test.setTimeout(120000);

    await page.goto('http://127.0.0.1:3000');
    await dismissSplash(page);

    page.on('pageerror', (err) => console.log('PAGE ERROR: ' + err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') console.log('CONSOLE ERROR: ' + msg.text());
    });

    await page.getByRole('button', { name: 'Join the community' }).click();
    await expect(page.getByRole('heading', { name: 'Register New Companion' })).toBeVisible({ timeout: 10000 });

    await page.getByPlaceholder('e.g. Olive, Bailey, Cooper').fill('E2E Fixture Dog');
    await page.getByPlaceholder('e.g. Golden Retriever, Tabby Cat').fill('Test Breed');
    await page.getByPlaceholder('e.g. +1 (555) 234-5678').fill('+15555555555');

    await page.locator('input[type="file"]').setInputFiles(validImage);
    
    await page.getByRole('button', { name: /Complete Profile/i }).click();

    await expect(page.getByText('E2E Fixture Dog').first()).toBeVisible({ timeout: 15000 });

    await page.locator('#close-profile-modal-btn').click();
    await expect(page.getByRole('heading', { name: 'Trusted Pet Profile' })).not.toBeVisible();

    await page.locator('#nav-identify-btn').click();
    await expect(page.getByRole('heading', { name: 'Identify Pet' })).toBeVisible({ timeout: 10000 });

    await page.locator('input[type="file"]').setInputFiles(validImage);
    await page.locator('.fixed button', { hasText: /^Identify$/ }).click();

    await expect(page.getByText('Match found')).toBeVisible({ timeout: 30000 });
    
    await expect(page.getByText('Prototype Mode').first()).toBeVisible({ timeout: 5000 });

    await expect(page.getByRole('heading', { name: 'Trusted Pet Profile' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('E2E Fixture Dog').first()).toBeVisible({ timeout: 5000 });

    await page.locator('#close-profile-modal-btn').click();
    await expect(page.getByRole('heading', { name: 'Trusted Pet Profile' })).not.toBeVisible();

    await page.locator('#hero-badge-lost-pet-alert').click();
    await expect(page.getByText('Live Sighting Reports')).toBeVisible({ timeout: 5000 });

    await page.getByPlaceholder('Your Name (or Neighbor on 4th)').fill('Test E2E Reporter');
    await page.getByPlaceholder('Exact Location (e.g. Near park bench)').fill('Test E2E Location');
    await page.getByPlaceholder('Details (e.g. Walking calmly toward garden, seems okay)').fill('Test E2E Note');
    await page.locator('#submit-sighting-btn').click();

    await expect(page.getByText('Test E2E Location')).toBeVisible({ timeout: 5000 });
  });

  test('Negative: Identify - No Dog', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000');
    await dismissSplash(page);

    await page.locator('#nav-identify-btn').click();
    await expect(page.getByRole('heading', { name: 'Identify Pet' })).toBeVisible({ timeout: 10000 });

    await page.locator('input[type="file"]').setInputFiles(noDogImage);
    await page.locator('.fixed button', { hasText: /^Identify$/ }).click();

    await expect(
      page.locator('text=/Identification failed.*No dog detected/')
    ).toBeVisible({ timeout: 15000 });
  });

  test('Negative: Identify - Low Quality', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000');
    await dismissSplash(page);

    await page.locator('#nav-identify-btn').click();
    await expect(page.getByRole('heading', { name: 'Identify Pet' })).toBeVisible({ timeout: 10000 });

    await page.locator('input[type="file"]').setInputFiles(lowQualityImage);
    await page.locator('.fixed button', { hasText: /^Identify$/ }).click();

    await expect(
      page.locator('text=/Identification failed/')
    ).toBeVisible({ timeout: 15000 });
  });
});
