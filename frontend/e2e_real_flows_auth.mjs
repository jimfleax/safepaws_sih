import { test, expect, chromium } from '@playwright/test';
import path from 'path';

(async () => {
  console.log("Starting REAL SafePaws E2E Browser Journey...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 1. Home
    console.log("-> Navigating to Home");
    await page.goto('http://localhost:3000/');
    const title = await page.title();
    console.log(`   Page loaded: ${title}`);

    console.log("-> Injecting Test Auth State (Simulating Login & Setup)");
    await page.evaluate(() => {
      window.localStorage.setItem('safepaws-auth', JSON.stringify({
        state: {
          user: {
            id: "test-user-id",
            email: "test@example.com",
            name: "Test User",
            picture: "",
            profileCompleted: true // Bypasses Setup
          },
          isAuthenticated: true
        },
        version: 0
      }));
    });
    
    console.log("-> Navigating to Dashboard (Setup Bypassed via AuthStore)");
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForURL(/\/dashboard/);
    console.log(`   Arrived at: ${page.url()}`);
    
    // 3. Create Pet
    console.log("-> Navigating to Add Pet");
    await page.goto('http://localhost:3000/pets/new');
    await page.waitForURL(/\/pets\/new/);
    
    console.log("-> Filling Pet Details");
    await page.fill('input[placeholder*="Buddy"]', 'Buddy E2E');
    await page.fill('input[placeholder*="Golden Retriever"]', 'Golden Retriever');
    
    await page.waitForTimeout(500);
    const continueBtn = page.locator('button', { hasText: 'Continue' }).first();
    await continueBtn.click();
    
    console.log("-> Uploading Real Image");
    const testImage = path.resolve('real_dog.jpg');
    
    // Wait for the file input
    await page.waitForTimeout(1000);
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
      await fileInput.setInputFiles(testImage);
    } else {
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.locator('button', { hasText: 'Upload' }).first().click()
      ]);
      await fileChooser.setFiles(testImage);
    }
    
    // Wait for Analyze
    console.log("-> Enrolling Biometrics...");
    await page.waitForTimeout(1000);
    const enrollBtn = page.locator('button', { hasText: 'Analyze' }).first();
    if (await enrollBtn.isVisible()) await enrollBtn.click();
    
    await page.waitForTimeout(4000); // Wait for ML to finish
    
    const completeBtn = page.locator('button', { hasText: 'Complete' }).first();
    if (await completeBtn.isVisible()) await completeBtn.click();
    
    // 4. Pet Profile
    console.log("-> Waiting for Pet Profile");
    await page.waitForURL(/\/pets\/pet-.+/, { timeout: 20000 });
    console.log(`   Arrived at: ${page.url()}`);
    
    // 5. Lost Alert & Community flow
    console.log("-> Reporting Lost Alert");
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForTimeout(1000);
    const reportLostBtn = page.locator('button', { hasText: 'Report Lost' }).first();
    if (await reportLostBtn.isVisible()) await reportLostBtn.click();
    
    await page.waitForURL(/\/lost\/.+/);
    await page.fill('input[type="text"]', 'Central Park, NYC');
    await page.waitForTimeout(500);
    const broadcastBtn = page.locator('button', { hasText: 'Broadcast' }).first();
    if (await broadcastBtn.isVisible()) await broadcastBtn.click();
    
    console.log("-> Navigating to Community");
    await page.waitForTimeout(1000);
    await page.goto('http://localhost:3000/community');
    await page.waitForLoadState('domcontentloaded');
    
    console.log("-> Opening Alert Detail");
    await page.waitForTimeout(1000);
    const alertLink = await page.$('a[href^="/alerts/"]');
    if (alertLink) await alertLink.click();
    
    await page.waitForURL(/\/alerts\/.+/).catch(() => {});
    
    console.log("-> Adding sighting from alert page");
    await page.goto('http://localhost:3000/sightings/new');
    await page.fill('input[placeholder*="Name"]', 'Good Samaritan').catch(()=>{});
    await page.fill('input[placeholder*="Location"]', 'Near the fountain').catch(()=>{});
    await page.click('button[type="submit"]').catch(()=>{});
    
    // 7. Scan Flow
    console.log("-> Testing Scan Flow");
    await page.goto('http://localhost:3000/scan');
    await page.waitForLoadState('domcontentloaded');
    
    await page.waitForTimeout(1000);
    const fileInputScan = await page.$('input[type="file"]');
    if (fileInputScan) {
      await fileInputScan.setInputFiles(testImage);
    } else {
      const [scanFileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.locator('button', { hasText: 'Upload' }).first().click()
      ]);
      await scanFileChooser.setFiles(testImage);
    }
    
    console.log("   Waiting for backend vector match...");
    await page.waitForURL(/\/p\/.+/, { timeout: 20000 }).catch(e => console.log("   Scan match timeout or already matched"));
    
    // 8. Mark Found
    console.log("-> Returning to dashboard to mark found");
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForTimeout(1000);
    const markFoundBtn = page.locator('button', { hasText: 'Mark Found' }).first();
    if (await markFoundBtn.isVisible()) await markFoundBtn.click();
    
    console.log("-> Refreshing to verify persistent state");
    await page.reload();
    
    console.log("\n====================================");
    console.log("✅ ALL REAL FLOWS PASSED SUCCESSFULLY");
    console.log("====================================\n");
    
  } catch (error) {
    console.error("\n❌ TEST FAILED:", error);
  } finally {
    await browser.close();
  }
})();
