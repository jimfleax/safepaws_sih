import { test, expect } from '@playwright/test';

test.describe.serial('SafePaws Complete Audit', () => {
  let petId = '';
  
  test.beforeEach(async ({ context }) => {
    await context.addCookies([{
      name: 'jwt',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLTEiLCJ0b2tlblZlcnNpb24iOjAsImV4cCI6MTc5MjU3NDQ3Nn0.b190odxN6LYTClYE-rc0Na4O9-MR6cpFt7wjGp3pHIo',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax'
    }]);
  });

  test('J1: Home / J2: Sign in / J3: Setup Profile / J4: Dashboard', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => sessionStorage.setItem('hasEntered', 'true'));
    await page.goto('/dashboard');
    await page.waitForURL('**/setup-profile');
    
    await page.click('button:has-text("Enter manually instead")');
    await page.fill('input[type="tel"]', '1234567890');
    await page.fill('input[placeholder*="Downtown"]', 'Test Neighborhood');
    await page.click('button:has-text("Complete Profile")');
    
    await page.waitForURL('**/dashboard');
    await expect(page.locator('text=Your Pets')).toBeVisible();
  });

  test('J5: Add/Register Pet / J6: Pet Profile', async ({ page }) => {
    await page.goto('/pets/new');
    
    await page.fill('input[name="name"]', 'AuditDog');
    await page.fill('input[name="breed"]', 'Golden Retriever');
    await page.fill('input[name="color"]', 'Golden');
    await page.fill('input[name="age"]', '2');
    await page.fill('input[name="weight"]', '15');
    await page.click('button:has-text("Next")');
    
    const skipBtn = page.locator('button:has-text("Skip")');
    await skipBtn.waitFor({ state: 'visible' });
    await skipBtn.click();
    
    const finishBtn = page.locator('button:has-text("Finish")');
    await finishBtn.waitFor({ state: 'visible' });
    await finishBtn.click();
    
    await page.waitForURL('**/pets/*');
    petId = page.url().split('/').pop() || '';
    expect(petId).toBeTruthy();
  });
});
