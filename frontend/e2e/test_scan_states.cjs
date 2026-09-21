const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Testing AMBIGUOUS state...');
  await page.route('**/api/v1/pets/identify', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        matches: [
          { pet_id: 'pet-123', qr_tag_id: 'qr-123', confidence: 0.70 },
          { pet_id: 'pet-456', qr_tag_id: 'qr-456', confidence: 0.65 }
        ]
      })
    });
  });

  await page.goto('http://localhost:3000/scan');
  await page.setInputFiles('input#e2e-file-upload', 'e2e_scan_dog.jpg');
  
  try {
      await page.waitForSelector('text=Multiple Similar Profiles', { timeout: 5000 });
      console.log('PASS: AMBIGUOUS screen rendered.');
  } catch (e) {
      console.log('FAILED to show AMBIGUOUS');
  }
  
  console.log('Testing UNKNOWN state...');
  await page.route('**/api/v1/pets/identify', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ matches: [] })
    });
  });
  
  await page.goto('http://localhost:3000/scan');
  await page.setInputFiles('input#e2e-file-upload', 'e2e_scan_dog.jpg');
  try {
      await page.waitForSelector('text=No Match Found', { timeout: 5000 });
      console.log('PASS: UNKNOWN screen rendered.');
  } catch (e) {
      console.log('FAILED to show UNKNOWN');
  }

  console.log('Testing QUALITY_FAILURE state...');
  await page.route('**/api/v1/pets/identify', async route => {
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ detail: 'Image quality too poor (blur detected).' })
    });
  });

  await page.goto('http://localhost:3000/scan');
  await page.setInputFiles('input#e2e-file-upload', 'e2e_scan_dog.jpg');
  try {
      await page.waitForSelector('text=Scan Unclear', { timeout: 5000 });
      console.log('PASS: QUALITY_FAILURE screen rendered.');
  } catch (e) {
      console.log('FAILED to show QUALITY_FAILURE');
  }

  await browser.close();
}

run().catch(console.error);
