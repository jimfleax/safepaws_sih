const { chromium } = require('playwright');
const fs = require('fs');

async function run() {
  const browser = await chromium.launch({ headless: true });
  
  // 1. OWNER FLOW
  console.log("=== OWNER FLOW ===");
  const ownerContext = await browser.newContext();
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLWpvdXJuZXkiLCJ0b2tlblZlcnNpb24iOjAsImV4cCI6MTc5MjYxNjY4Nn0.1GWekTiGTutHwPcuNNhP0rGn3Bd3_VsMrm1ecO8CqvY';
  
  await ownerContext.addCookies([{
    name: 'jwt',
    value: token,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
    sameSite: 'Lax'
  }]);

  const ownerPage = await ownerContext.newPage();
  
  ownerPage.on('response', res => {
    if (res.url().includes('/api/v1/')) {
       console.log('[OWNER API]', res.status(), res.url());
    }
  });

  await ownerPage.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await ownerPage.screenshot({ path: '1_dashboard.png' });
  console.log("Dashboard loaded");

  // Let's navigate to Report Missing directly for the pet. 
  // Wait, I should try clicking the pet first. 
  // For safety, I'll navigate to /pets/test-pet-journey
  await ownerPage.goto('http://localhost:3000/pets/test-pet-journey', { waitUntil: 'networkidle' });
  await ownerPage.screenshot({ path: '2_pet_detail.png' });
  
  // Click "Report Missing" button. It should be a link or button containing "Report" or "Missing"
  // If it's a link to /lost/new, let's just goto it if click fails.
  try {
    await ownerPage.click('text="Report Missing"', { timeout: 2000 });
  } catch (e) {
    console.log("Could not find 'Report Missing' button, navigating directly");
    await ownerPage.goto('http://localhost:3000/lost/new?petId=test-pet-journey', { waitUntil: 'networkidle' });
  }
  
  await ownerPage.waitForLoadState('networkidle');
  await ownerPage.screenshot({ path: '3_report_missing_form.png' });
  
  // Fill the report missing form
  // Address, Description, etc.
  try {
    await ownerPage.fill('textarea', 'Lost near the park');
    await ownerPage.fill('input[type="text"]', 'Downtown Park'); // address or something
  } catch (e) { }

  // Submit
  await ownerPage.click('button[type="submit"], button:has-text("Submit"), button:has-text("Report")');
  await ownerPage.waitForTimeout(2000); // wait for api
  await ownerPage.waitForLoadState('networkidle');
  await ownerPage.screenshot({ path: '4_alert_detail.png' });
  console.log("Reported missing, alert created");

  // 2. FINDER FLOW
  console.log("=== FINDER FLOW ===");
  const finderContext = await browser.newContext({
    geolocation: { latitude: 40.7128, longitude: -74.0060 },
    permissions: ['geolocation']
  });
  const finderPage = await finderContext.newPage();
  
  finderPage.on('response', res => {
    if (res.url().includes('/api/v1/')) {
       console.log('[FINDER API]', res.status(), res.url());
    }
  });

  await finderPage.goto('http://localhost:3000/p/QR-JOURNEY-123', { waitUntil: 'networkidle' });
  await finderPage.screenshot({ path: '5_public_profile.png' });
  console.log("Finder loaded public profile");

  // Send Location
  try {
    await finderPage.click('text="Send My Location"');
    await finderPage.waitForTimeout(2000);
    await finderPage.screenshot({ path: '6_location_sent.png' });
    console.log("Location sent");
  } catch (e) {
    console.log("Failed to click Send Location:", e);
  }

  // File Detailed Sighting
  try {
    // wait, if "Send My Location" shows a success modal, we might need to close it or navigate again
    await finderPage.goto('http://localhost:3000/p/QR-JOURNEY-123', { waitUntil: 'networkidle' });
    
    // There should be a link to /sightings/new
    try {
      await finderPage.click('text="File Detailed Sighting"', { timeout: 2000 });
    } catch(e) {
      await finderPage.goto('http://localhost:3000/sightings/new?tag=QR-JOURNEY-123', { waitUntil: 'networkidle' });
    }
    
    await finderPage.waitForLoadState('networkidle');
    await finderPage.screenshot({ path: '7_sighting_form.png' });
    
    await finderPage.fill('textarea', 'Saw the dog running!');
    await finderPage.fill('input[type="text"]', 'Central Park');
    await finderPage.click('button[type="submit"], button:has-text("Submit")');
    await finderPage.waitForTimeout(2000);
    await finderPage.screenshot({ path: '8_sighting_submitted.png' });
    console.log("Sighting submitted");
  } catch (e) {
    console.log("Failed sighting:", e);
  }

  // 3. OWNER VERIFICATION
  console.log("=== OWNER VERIFICATION ===");
  await ownerPage.reload({ waitUntil: 'networkidle' });
  await ownerPage.waitForTimeout(2000);
  await ownerPage.screenshot({ path: '9_owner_refresh.png' });
  console.log("Owner refreshed alert detail");

  await browser.close();
  console.log("Done");
}

run().catch(console.error);
