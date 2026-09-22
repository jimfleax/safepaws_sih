const { chromium } = require('playwright');
const fs = require('fs');

async function run() {
  const browser = await chromium.launch({ headless: true });
  
  // 1. OWNER FLOW
  console.log("=== OWNER FLOW ===");
  const ownerContext = await browser.newContext();
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLWpvdXJuZXkiLCJ0b2tlblZlcnNpb24iOjAsImV4cCI6MTc5MjYxNzM2MX0.BACU_glLhf8yPQhVs4TMVyiQaVkrBi4s-sacg6hXqTk';
  
  await ownerContext.addCookies([{
    name: 'jwt',
    value: token,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
    sameSite: 'Lax'
  }]);

  const ownerPage = await ownerContext.newPage();
  
  await ownerPage.goto('http://localhost:3000/dashboard', { waitUntil: 'domcontentloaded' });
  await ownerPage.waitForTimeout(2000);
  await ownerPage.screenshot({ path: '1_dashboard.png' });
  console.log("Dashboard loaded");

  await ownerPage.goto('http://localhost:3000/lost/new', { waitUntil: 'domcontentloaded' });
  await ownerPage.waitForTimeout(2000);
  await ownerPage.screenshot({ path: '2_report_missing_form.png' });
  
  try {
    await ownerPage.fill('textarea', 'Lost near the park');
    await ownerPage.fill('input[name="lastSeenAddress"], input[type="text"]', 'Downtown Park'); 
  } catch (e) { 
    console.log("Failed to fill missing form:", e);
  }

  await ownerPage.click('button[type="submit"], button:has-text("Submit"), button:has-text("Report")');
  await ownerPage.waitForTimeout(3000); 
  await ownerPage.screenshot({ path: '3_alert_detail.png' });
  console.log("Reported missing, alert created");

  // 2. FINDER FLOW
  console.log("=== FINDER FLOW ===");
  const finderContext = await browser.newContext({
    geolocation: { latitude: 40.7128, longitude: -74.0060 },
    permissions: ['geolocation']
  });
  const finderPage = await finderContext.newPage();

  await finderPage.goto('http://localhost:3000/p/QR-JOURNEY-123', { waitUntil: 'domcontentloaded' });
  await finderPage.waitForTimeout(2000);
  await finderPage.screenshot({ path: '4_public_profile.png' });
  console.log("Finder loaded public profile");

  try {
    await finderPage.click('text="Send Location Ping"');
    await finderPage.waitForSelector('text=Location successfully', { timeout: 5000 });
    console.log("Location sent");
  } catch (e) {
    console.log("Failed to click Send Location: ", e.message);
  }

  try {
    await finderPage.goto('http://localhost:3000/p/QR-JOURNEY-123', { waitUntil: 'domcontentloaded' });
    await finderPage.waitForTimeout(2000);
    try {
      await finderPage.click('text="File Detailed Sighting"', { timeout: 2000 });
    } catch(e) {
      await finderPage.goto('http://localhost:3000/sightings/new?tag=QR-JOURNEY-123', { waitUntil: 'domcontentloaded' });
    }
    
    await finderPage.waitForTimeout(2000);
    await finderPage.screenshot({ path: '6_sighting_form.png' });
    
    await finderPage.fill('textarea', 'Saw the dog running!');
    await finderPage.click('button[type="submit"], button:has-text("Submit")');
    await finderPage.waitForTimeout(3000);
    await finderPage.screenshot({ path: '7_sighting_submitted.png' });
    console.log("Sighting submitted");
  } catch (e) {
    console.log("Failed sighting", e);
  }

  // 3. OWNER VERIFICATION
  console.log("=== OWNER VERIFICATION ===");
  await ownerPage.goto('http://localhost:3000/dashboard', { waitUntil: 'domcontentloaded' });
  await ownerPage.waitForTimeout(2000);
  await ownerPage.screenshot({ path: '8_owner_refresh.png' });
  console.log("Owner refreshed dashboard");
  
  // Manage Alert -> Resolve
  try {
    await ownerPage.goto('http://localhost:3000/dashboard', { waitUntil: 'domcontentloaded' });
    await ownerPage.waitForTimeout(2000);
    await ownerPage.click('text="Manage Alert"', { timeout: 2000 });
    await ownerPage.waitForTimeout(2000);
    await ownerPage.click('text="Mark as Found"', { timeout: 2000 });
    await ownerPage.waitForTimeout(2000);
    await ownerPage.screenshot({ path: '9_alert_resolved.png' });
    console.log("Alert resolved");
  } catch(e) {
    console.log("Failed to resolve", e);
  }

  await browser.close();
  console.log("Done");
}

run().catch(console.error);
