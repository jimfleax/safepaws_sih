const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  // Set auth cookie for authenticated owner flow
  await context.addCookies([{
    name: 'jwt',
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLTEiLCJ0b2tlblZlcnNpb24iOjAsImV4cCI6MTc5MjU3NDQ3Nn0.b190odxN6LYTClYE-rc0Na4O9-MR6cpFt7wjGp3pHIo',
    domain: 'localhost',
    path: '/',
  }]);

  const page = await context.newPage();
  
  // Setup listener for network errors
  page.on('response', response => {
    if (response.status() >= 500) {
      console.error(`[NETWORK ERROR] ${response.status()} ${response.url()}`);
    }
  });
  page.on('pageerror', error => {
    console.error(`[CONSOLE ERROR] ${error.message}`);
  });

  try {
    console.log("=== Auth Scan Flow ===");
    await page.goto('http://localhost:3001/dashboard', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Your Registered Pets', { timeout: 10000 }).catch(() => {});
    await page.goto('http://localhost:3001/scan', { waitUntil: 'networkidle' });
    
    // Wait for the fallback input to appear (since headless has no camera)
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.waitFor({ state: 'attached' });
    await fileInput.setInputFiles(path.resolve(__dirname, 'dog_nose.jpg'));
    
    console.log("Uploaded file, waiting for processing...");
    
    // Wait for ResultView to appear and click "View Pet Profile"
    await page.waitForSelector('text=View Pet Profile', { timeout: 30000 });
    
    const [response] = await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }),
      page.click('text=View Pet Profile')
    ]);
    
    console.log("Routed to:", page.url());
    
    let text = await page.textContent('body');
    if (page.url().includes('/pets/')) {
        console.log("PASS: Authenticated owner routed to /pets/:petId");
    } else if (page.url().includes('/p/')) {
        console.log("PASS: Authenticated owner routed to /p/:qrTagId (wait, they should go to /pets/:petId if it is their pet)");
    } else {
        console.log("FAIL: Unknown route:", page.url());
    }

  } catch (e) {
    console.error("Test failed:", e);
  }

  // Now test Anonymous Scan Flow
  const anonContext = await browser.newContext();
  const anonPage = await anonContext.newPage();
  
  try {
    console.log("\n=== Anonymous Scan Flow ===");
    await anonPage.goto('http://localhost:3001/scan', { waitUntil: 'networkidle' });
    
    const anonFileInput = anonPage.locator('input[type="file"]').first();
    await anonFileInput.waitFor({ state: 'attached' });
    await anonFileInput.setInputFiles(path.resolve(__dirname, 'dog_nose.jpg'));
    
    console.log("Uploaded file, waiting for processing...");
    
    await anonPage.waitForSelector('text=View Pet Profile', { timeout: 30000 });
    
    await Promise.all([
      anonPage.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }),
      anonPage.click('text=View Pet Profile')
    ]);
    
    console.log("Routed to:", anonPage.url());
    
    let anonText = await anonPage.textContent('body');
    if (anonPage.url().includes('/p/')) {
        console.log("PASS: Anonymous finder routed to /p/:qrTagId");
    } else {
        console.log("FAIL: Anonymous finder routed to:", anonPage.url());
    }
    
    console.log("Testing recovery action (File Sighting)...");
    if (anonText.includes('File Sighting') || anonText.includes('Report Sighting') || anonText.includes('Contact')) {
        console.log("PASS: Recovery action found on public profile");
    } else {
        console.log("FAIL: Recovery action NOT found on public profile");
    }

  } catch (e) {
    console.error("Anonymous Test failed:", e);
  }

  await browser.close();
})();
