import { chromium } from 'playwright';

(async () => {
  console.log("Starting browser tests...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Test 1: Community Navigation
    console.log("Test 1: Community Navigation");
    await page.goto('http://127.0.0.1:3001');
    await page.click('text=Community');
    await page.waitForURL('**/community');
    console.log("URL is:", page.url());
    console.log("Community header visible:", await page.locator('h1', { hasText: 'Community' }).isVisible());

    // Test 2: Report Sighting (Unauthenticated)
    console.log("Test 2: Report Sighting");
    await page.goto('http://127.0.0.1:3001/sightings/new');
    await page.waitForLoadState('networkidle');
    console.log("URL is:", page.url());
    console.log("Form visible:", await page.locator('form').isVisible());

    // Test 3: Lost Board
    console.log("Test 3: Lost Board");
    await page.goto('http://127.0.0.1:3001/lost');
    await page.waitForLoadState('networkidle');
    console.log("URL is:", page.url());

    // Test 4: Public Profile
    console.log("Test 4: Public Profile");
    await page.goto('http://127.0.0.1:3001/p/test-tag');
    await page.waitForLoadState('networkidle');
    console.log("URL is:", page.url());
    console.log("Call Owner renders:", await page.locator('text=Call Owner').isVisible());
    
    // Test 5: Scan
    console.log("Test 5: Scan");
    await page.goto('http://127.0.0.1:3001/scan');
    await page.waitForLoadState('networkidle');
    console.log("URL is:", page.url());
    
  } catch(e) {
    console.error(e);
  } finally {
    await browser.close();
    console.log("Done");
  }
})();
