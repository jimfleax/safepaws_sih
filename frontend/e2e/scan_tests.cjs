const { chromium } = require('playwright');
const fs = require('fs');

async function runFlow() {
  console.log('Launching browser for SCAN testing...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 400, height: 800 },
    permissions: [] // Deny camera by default!
  });
  const page = await context.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE: ' + msg.text()));

  try {
    console.log('Navigating to /scan as an anonymous user (no login)...');
    await page.goto('http://localhost:3000/scan');
    
    // Wait for the 'Use a photo instead' button (since camera is denied)
    console.log("Waiting for 'Use a photo instead' button...");
    const fileInput = page.locator("input[type='file']");
    
    // TEST 1: Invalid Image
    console.log("TEST 1: Uploading invalid image...");
    await fileInput.setInputFiles('dummy.jpg');
    console.log("Waiting for error state...");
    await page.waitForSelector("text=Scan Unclear", { timeout: 10000 }).catch(() => console.log("Did not see 'Scan Unclear'"));
    await page.screenshot({ path: 'scan_invalid.png' });
    console.log("Current URL:", page.url());
    
    // Reset scan
    console.log("Clicking 'Scan Again'...");
    const scanAgain = page.locator("button:has-text('Scan Again')");
    if (await scanAgain.isVisible()) {
      await scanAgain.click();
    }
    
    // TEST 2: Real Dog Image
    console.log("TEST 2: Uploading real dog image...");
    await fileInput.setInputFiles('test_dog.jpg');
    console.log("Waiting for Processing to finish...");
    await page.waitForSelector("text=Match Found!", { timeout: 15000 });
    await page.screenshot({ path: 'scan_match.png' });
    
    console.log("Clicking 'View Pet Profile'...");
    await page.click("button:has-text('View Pet Profile')");
    
    console.log('Waiting for navigation...');
    await page.waitForURL('**/p/**', { timeout: 10000 });
    console.log('Current URL (should be /p/:tagId):', page.url());
    await page.screenshot({ path: 'scan_public_profile.png' });

    console.log('ALL TESTS PASSED.');
  } catch (err) {
    console.error('TEST FAILED:', err);
  } finally {
    await browser.close();
  }
}

runFlow();
