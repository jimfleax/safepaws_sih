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
    await expect(page.getByText(/REGISTER YOUR PET/i).first()).toBeVisible();
    await expect(page.getByText(/SCAN A (FOUND )?DOG/i).first()).toBeVisible();
    
    // Check 'Features' scroll
    await page.getByRole('button', { name: 'Features' }).first().click();
    await expect(page.locator('#features')).toBeInViewport();
    
    // Check 'Community' navigation
    await page.getByRole('button', { name: 'Community' }).first().click();
    await page.waitForURL('**/community');
    await expect(page.locator('text=Community').first()).toBeVisible();
    
    expect(errors).toHaveLength(0);
    expect(failedRequests).toHaveLength(0);
  });

  test('2. Registration & Setup Profile & New Pet', async ({ page, context }) => {
    await context.addCookies([{
      name: 'jwt',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLTEiLCJ0b2tlblZlcnNpb24iOjAsImV4cCI6MTc5MjU3NDQ3Nn0.b190odxN6LYTClYE-rc0Na4O9-MR6cpFt7wjGp3pHIo',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax'
    }]);

    await page.goto('/setup-profile');
    
    // Setup Profile
    const manualBtn = page.locator('button:has-text("Enter manually instead")');
    if (await manualBtn.count() > 0) await manualBtn.click();

    const phoneField = page.locator('input[type="tel"]');
    if (await phoneField.count() > 0) {
      await phoneField.fill('1234567890');
      const neighborhoodField = page.locator('input[placeholder*="Oakridge"], input[placeholder*="Downtown"]');
      if (await neighborhoodField.count() > 0) await neighborhoodField.fill('Test Neighborhood');
      const completeBtn = page.locator('button:has-text("Complete Profile")');
      if (await completeBtn.count() > 0) await completeBtn.click();
    }

    // Now adding a new pet
    await page.goto('/pets/new');
    
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

  test('3. Lost Pet Alerts Directory Navigation', async ({ page }) => {
    await page.goto('/lost');
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.getByText(/ACTIVE MISSING PET ALERTS|Lost Dogs/i).first()).toBeVisible();
  });
});
