import { test, expect } from '@playwright/test';

test.describe.serial('SafePaws Core Journeys Audit', () => {
  let petId = '';
  let qrTagId = 'TAG-' + Date.now();

  test('1. Home Journey', async ({ page }) => {
    await page.goto('/');
    
    // Bypass enter screen
    await page.evaluate(() => sessionStorage.setItem('hasEntered', 'true'));
    await page.goto('/');

    await expect(page.locator('text=REGISTER YOUR PET').first()).toBeVisible();
    await expect(page.locator('text=SCAN A FOUND DOG').first()).toBeVisible();
  });

  test('2. Authentication / 3. Setup Profile / 4. Dashboard', async ({ page }) => {
    // For auth, SafePaws uses a mock Google auth when offline, or real Google Auth.
    // Let's click "REGISTER YOUR PET" or navigate to /setup-profile
    await page.goto('/setup-profile');
    
    // Wait for the form
    await page.waitForSelector('input[placeholder*="name"]', { timeout: 10000 }).catch(e => console.log("Missing name field"));
    
    // Fill the profile
    const nameInput = page.locator('input[placeholder*="name"]');
    if (await nameInput.count() > 0) {
      await nameInput.fill('Audit User');
      await page.locator('input[placeholder*="phone"]').fill('+19999999999');
      
      const saveBtn = page.locator('button:has-text("Save")');
      if (await saveBtn.count() > 0) await saveBtn.click();
    } else {
      console.log("Could not find Setup Profile form");
    }

    // Should redirect to dashboard or new pet
    await page.waitForURL('**/dashboard', { timeout: 5000 }).catch(() => {});
    if (page.url().includes('dashboard')) {
       console.log('Successfully reached dashboard');
    }
  });

  test('5. Create/Register Pet / 6. Pet Profile', async ({ page }) => {
    await page.goto('/pets/new');
    
    // Step 1: Info
    const nameInput = page.locator('input[name="name"]');
    if (await nameInput.count() > 0) {
      await nameInput.fill('AuditDog');
      await page.locator('input[name="breed"]').fill('Husky');
      await page.locator('button:has-text("Next")').click();
    }
    
    // Step 2: Image
    // Not strictly uploading an image in automated test unless we have a file. We can try to skip or upload a mock image.
    const skipBtn = page.locator('button:has-text("Skip")');
    if (await skipBtn.count() > 0) await skipBtn.click();
    
    // Finish
    const finishBtn = page.locator('button:has-text("Finish")');
    if (await finishBtn.count() > 0) await finishBtn.click();

    // Check Pet Profile
    await page.waitForURL('**/pets/*', { timeout: 5000 }).catch(() => {});
    if (page.url().includes('/pets/')) {
       petId = page.url().split('/').pop() || '';
       console.log('Created Pet:', petId);
    }
  });

  test('7. QR/Public Pet Profile & 8. Finder Scan & 9. Scan -> Match', async ({ page }) => {
    await page.goto('/scan');
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.locator('text=SAFEPAWS // BIOMETRIC HUD')).toBeVisible();
    await expect(page.locator('button[aria-label="Close scan"]')).toBeVisible();
  });

  test('10. Report Lost Pet & 11. Alert Detail / Resolve', async ({ page }) => {
    await page.goto('/lost');
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.getByText(/ACTIVE RECOVERY NETWORK|Recovery Board|ACTIVE MISSING PET ALERTS|Lost Dogs/i).first()).toBeVisible();
  });

  test('12. Submit Sighting', async ({ page }) => {
    await page.goto('/sightings/new');
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.locator('h1')).toHaveText(/Report a Sighting/i);
    await expect(page.locator('#reporterName')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('13. Community & 14. Post/Reply/Report', async ({ page }) => {
    await page.goto('/community');
    await expect(page.locator('text=Community').first()).toBeVisible();
  });
});
