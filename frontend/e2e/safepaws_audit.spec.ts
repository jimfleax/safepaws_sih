import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('SafePaws Complete Audit', () => {
  let petId: string;
  let tagId: string;
  let alertId: string;

  test('1. Landing Page Navigation & Animation', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));
    
    const failedRequests: string[] = [];
    page.on('requestfailed', request => failedRequests.push(request.url()));

    await page.goto('/');

    // Check if EnterScreen aura/noseprint/wordmark appear
    // It's interruptible, so let's wait a moment and then interact
    await page.waitForTimeout(1000);
    await page.keyboard.press('Escape'); // interrupt
    
    // Check main navigation links
    await expect(page.getByText('REGISTER YOUR PET').first()).toBeVisible();
    await expect(page.getByText('SCAN A DOG').first()).toBeVisible();
    
    // Check 'How it Works' scroll
    await page.getByRole('button', { name: 'Features' }).first().click();
    await expect(page.locator('#how-it-works')).toBeInViewport();
    
    // Check 'Community' scroll
    await page.getByRole('button', { name: 'Community' }).first().click();
    await expect(page.locator('#community-section')).toBeInViewport();
    
    expect(errors).toHaveLength(0);
    expect(failedRequests).toHaveLength(0);
  });

  test('2. Registration & Setup Profile & New Pet', async ({ page }) => {
    await page.goto('/');
    
    // Click register
    await page.getByText('REGISTER YOUR PET').first().click();
    
    // Setup Profile (Assuming /setup-profile)
    await page.waitForURL('**/setup-profile');
    await page.fill('input[placeholder*="name"]', 'Test Owner');
    await page.fill('input[placeholder*="phone"]', '+1234567890');
    // If there's an email field, fill it
    const emailField = page.locator('input[type="email"]');
    if (await emailField.count() > 0) {
        await emailField.fill('test@example.com');
    }
    await page.getByRole('button', { name: /save/i }).click();

    // Now adding a new pet
    await page.waitForURL('**/pets/new');
    
    // Stage A: Fill fields
    await page.fill('input[name="name"]', 'Test Doggo');
    await page.fill('input[name="breed"]', 'Golden Retriever');
    await page.fill('input[name="color"]', 'Golden');
    await page.getByRole('button', { name: /next/i }).click();

    // Stage B: Real File Upload
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: /upload/i }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, '../test_dog.jpg'));

    // Wait for upload/enrollment success
    await page.getByRole('button', { name: /finish|save|complete/i }).click();

    // Stage C: Confirmation & Pet Profile
    await page.waitForURL('**/pets/*');
    
    const url = page.url();
    petId = url.split('/').pop()!;
    expect(petId).toBeTruthy();

    await expect(page.getByText('Test Doggo')).toBeVisible();

    // Refresh and check it loads from backend
    await page.reload();
    await expect(page.getByText('Test Doggo')).toBeVisible();
    await expect(page.getByText('Golden Retriever')).toBeVisible();
  });

  test('3. Pet Profile Actions', async ({ page }) => {
    // Requires previous test to have created a pet. We rely on localstorage state keeping us logged in 
    // for this session if we reuse the context, but Playwright tests use separate contexts by default.
    // Let's combine them into one file and use serial execution.
  });
});
