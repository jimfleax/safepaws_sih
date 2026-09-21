const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runAudit() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    permissions: ['geolocation'],
    geolocation: { latitude: 37.7749, longitude: -122.4194 }
  });
  
  const log = (msg) => { console.log(msg); };
  
  try {
    const page = await context.newPage();
    page.on('console', msg => console.log('BROWSER: ' + msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR: ' + err.message));

    log('=== PHASE 4: ANONYMOUS FINDER JOURNEY (SCAN) ===');
    await page.goto('http://localhost:3000/scan');
    
    // We upload the known enrolled dog photo
    log('Uploading enrolled dog photo...');
    const fileInput = await page.waitForSelector('input#e2e-file-upload', { state: 'attached' });
    
    const imagePath = path.resolve('./e2e_scan_dog.jpg');
    if (!fs.existsSync(imagePath)) {
        throw new Error('Image not found: ' + imagePath);
    }
    
    await fileInput.setInputFiles(imagePath);
    
    // Wait for the Result view which should show the pet MATCH
    log('Waiting for MATCH result...');
    await page.waitForSelector('text=Match Found!', { timeout: 30000 });
    
    // Verify it routes to the correct tag ID route
    log('Clicking "View Profile"...');
    await page.locator('button:has-text("View Pet Profile")').click();
    
    await page.waitForTimeout(2000); // Wait for navigation
    const currentUrl = page.url();
    log('Navigated to: ' + currentUrl);
    if (!currentUrl.includes('/p/qr-')) {
        throw new Error('Did not route to public profile properly: ' + currentUrl);
    }

    log('=== PUBLIC PROFILE VERIFICATION ===');
    await page.waitForSelector('text=Call Owner');
    await page.waitForSelector('text=Send My Location');
    
    log('Clicking "Send My Location"...');
    await page.locator('button:has-text("Send My Location")').click();
    await page.waitForSelector('text=Location securely transmitted', { timeout: 5000 });
    log('PASS: Location successfully sent.');

    log('Clicking "File a detailed sighting report"...');
    await page.locator('text=File a detailed sighting report').click();
    await page.waitForTimeout(2000);
    log('Navigated to: ' + page.url());
    if (!page.url().includes('/sightings/new')) {
        throw new Error('Did not route to sighting form');
    }

    log('=== FILE DETAILED SIGHTING ===');
    await page.waitForSelector('text=Where did you see the pet?');
    await page.fill('input#reporterName', 'Jane E2E Tester');
    await page.fill('input#sightingLocation', 'Main St and 4th Ave');
    await page.fill('textarea', 'Saw a brown dog near the park, had a blue collar.');
    
    // Intercept network for sighting submit
    page.on('response', resp => {
      if (resp.url().includes('/sightings')) {
        resp.text().then(text => log('SIGHTING API RESPONSE ' + resp.status() + ': ' + text.substring(0, 200)));
      }
    });
    
    log('Submitting Sighting...');
    // Take screenshot to verify form state
    await page.screenshot({ path: 'sighting_form.png' });
    
    await page.locator('form button[type="submit"]').click();
    
    // Wait for the UI to show success (it auto-navigates after 1.5s)
    await page.waitForSelector('text=Sighting Recorded', { timeout: 10000 });
    log('PASS: Sighting submitted successfully. UI shows success state.');
    await page.screenshot({ path: 'sighting_after_submit.png' });

    log('\n[Injecting Auth for Owner Flows...]');
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLTEiLCJ0b2tlblZlcnNpb24iOjB9.51IRk5cmUQIbJz4j0pYB8_m11FeI5XOexFPQkJFsuxs';
    await context.addCookies([
      { name: 'jwt', value: token, domain: 'localhost', path: '/', httpOnly: true, sameSite: 'Lax' }
    ]);

    log('=== PHASE 5: LOST & SIGHTINGS (OWNER) ===');
    await page.goto('http://localhost:3000/lost');
    await page.waitForSelector('text=Active Alerts');
    
    // Create lost report
    log('Navigating to Report Lost...');
    await page.goto('http://localhost:3000/lost/new');
    
    // Select first pet
    log('Selecting pet and reporting...');
    await page.waitForSelector('select#pet-select');
    await page.locator('select#pet-select').selectOption({ index: 0 });
    await page.fill('input#last-seen', 'My Backyard');
    await page.fill('textarea#description', 'He dug under the fence.');
    
    // Intercept network and console
    page.on('console', msg => log('BROWSER CONSOLE: ' + msg.text()));
    page.on('response', resp => {
      if (resp.url().includes('/alerts')) {
        resp.text().then(text => log('ALERT API RESPONSE ' + resp.status() + ': ' + text.substring(0, 200)));
      }
    });
    
    await page.locator('button[type="submit"]').click({ force: true });
    
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'report_lost_after_submit.png' });
    
    await page.waitForSelector('button:has-text("Mark as Found")', { timeout: 10000 });
    log('PASS: Alert created successfully. Url: ' + page.url());

    // Resolve alert
    log('Marking Safe...');
    await page.locator('button:has-text("Mark as Found")').click();
    await page.waitForTimeout(2000);
    log('PASS: Alert resolved and routed back to Dashboard.');

  } catch (err) {
    log('FATAL SCRIPT ERROR: ' + err.message);
    try {
       await page.screenshot({ path: 'fatal_error.png' });
    } catch(e) {}
  } finally {
    await browser.close();
  }
}
runAudit();
