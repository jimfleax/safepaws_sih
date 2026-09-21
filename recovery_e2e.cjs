const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const qrTagId = fs.readFileSync('last_qr_tag.txt', 'utf8').trim();
  if (!qrTagId) {
    console.error("No qrTagId found.");
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: { latitude: 37.7749, longitude: -122.4194 }
  });
  const page = await context.newPage();

  // Route interception to verify network payload
  let reportSightingPayload = null;
  await page.route('**/api/v1/sightings/', route => {
    const req = route.request();
    if (req.method() === 'POST') {
      reportSightingPayload = JSON.parse(req.postData());
    }
    route.continue();
  });

  try {
    console.log(`\n=== 1. Public Recovery Route ===`);
    await page.goto(`http://localhost:3000/p/${qrTagId}`, { waitUntil: 'networkidle' });
    console.log("Navigated to:", page.url());

    // Click "File a detailed sighting report"
    console.log(`\n=== 2. File Sighting Flow ===`);
    await page.click('text=File a detailed sighting report');
    await page.waitForSelector('#notes', { timeout: 10000 });
    console.log("Navigated to:", page.url());
    if (page.url().includes('/sightings/new')) {
      console.log("PASS: URL is /sightings/new");
    } else {
      console.log("FAIL: URL is", page.url());
    }

    // Check context
    const value = await page.$eval('#notes', el => el !== null);
    if (value) {
      console.log("PASS: Sighting form rendered");
    }

    // Navigate back to public profile
    await page.goto(`http://localhost:3000/p/${qrTagId}`, { waitUntil: 'networkidle' });

    console.log(`\n=== 3. Send Location Flow ===`);
    // Listen for the specific alert or ui state changes if any. The component calls ApiClient.reportSighting directly.
    await page.click('text=Send my location');
    
    // Wait a brief moment for the network request to fire
    await page.waitForTimeout(2000);
    
    if (reportSightingPayload) {
      console.log("PASS: Send my location triggered POST /api/v1/sightings/");
      console.log("Payload:", JSON.stringify(reportSightingPayload));
      if (reportSightingPayload.location.includes("37.7749")) {
        console.log("PASS: Payload includes geolocation");
      }
    } else {
      console.log("FAIL: Network request for /api/v1/sightings/ not detected.");
    }
    
  } catch (e) {
    console.error("Test failed:", e);
  } finally {
    await browser.close();
  }
})();
