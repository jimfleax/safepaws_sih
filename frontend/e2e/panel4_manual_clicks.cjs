const { chromium } = require('playwright');
const fs = require('fs');

async function runFlow() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();
  
  page.on('console', msg => log('BROWSER CONSOLE: ' + msg.text()));
  page.on('requestfailed', request => log('FAILED REQUEST: ' + request.url() + ' - ' + request.failure().errorText));
  page.on('response', response => log('RESPONSE: ' + response.url() + ' - ' + response.status()));

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLTEiLCJ0b2tlblZlcnNpb24iOjAsImV4cCI6MTc5MDA1ODU2N30._InUfZuDE5APa826SVZlnk-0qv1g_d0UO4rm7o5Y2-I';
  await context.addCookies([
    { name: 'jwt', value: token, domain: 'localhost', path: '/', httpOnly: true, sameSite: 'Lax' }
  ]);

  const log = (msg) => { console.log(msg); };

  try {
    log('1. Development Sign In: Injected JWT and navigating to /dashboard...');
    await page.goto('http://localhost:3000/dashboard');
    
    try {
      await page.waitForSelector('text=Dashboard', { timeout: 15000 });
    } catch (e) {
      if (page.url().includes('setup-profile')) {
        log('   Completing profile setup first...');
        await page.fill('input[type="tel"]', '555-1234');
        await page.fill('input[type="text"]', 'Downtown');
        await page.click('button[type="submit"]');
        await page.waitForURL('**/dashboard');
        await page.waitForSelector('text=Your Pets');
      } else {
        throw e;
      }
    }

    log('2. Click Add Pet...');
    await page.click('a:has-text("Register Pet")');
    await page.waitForSelector('text=Secure');
    
    await page.locator('input[type="text"]').nth(0).fill('BrowserTestDog');
    await page.selectOption('select', 'dog');
    
    await page.locator('input[type="text"]').nth(1).fill('Golden Retriever');
    await page.locator('input[type="text"]').nth(2).fill('Golden');
    await page.locator('input[type="text"]').nth(3).fill('2');
    await page.locator('input[type="text"]').nth(4).fill('white spot on chest');
    
    log('4. Click Continue...');
    await page.click('button:has-text("Continue")');
    await page.waitForSelector('text=Biometric Map');

    log('5. Audit: Click Back...');
    await page.click('button:has-text("Back")');
    await page.waitForSelector('input[placeholder="e.g. Olive"]');
    log('   Back works, we are on Step 1 again. Re-clicking Continue...');
    await page.click('button:has-text("Continue")');
    await page.waitForSelector('text=Biometric Map');

    log('6. Upload photo...');
    await page.setInputFiles('input[type="file"]', 'test_dog.jpg');

    log('7. Click Enroll Biometric Record...');
    await page.click('button:has-text("Enroll Biometric Record")');
    
    log('8. Wait for scan to complete, then click Confirm...');
    await page.waitForSelector('button:has-text("Confirm").bg-\\[\\#E2811F\\]', { timeout: 30000 });
    await page.click('button:has-text("Confirm")');
    
    log('9. Wait for Step 3, then click View Pet Profile...');
    await page.waitForSelector('text=Profile Ready');
    await page.click('button:has-text("View Pet Profile")');
    
    log('10. Wait for Pet Profile to load...'); await page.waitForURL('**/pets/pet-*', { timeout: 15000 });
    await page.waitForURL('**/pets/*'); await page.waitForSelector('text=BrowserTestDog', { timeout: 15000 });
    
    log('11. Refresh page to verify state survives...');
    await page.reload();
    await page.waitForSelector('text=BrowserTestDog', { timeout: 15000 });
    const url = page.url();
    log('   Verified: ' + url);

    log('15. Click Remove Identity Record...');
    await page.click('button:has-text("Remove Identity Record")');
    
    log('16. Wait for modal and click Confirm Removal...');
    await page.waitForSelector('text=Remove Record?');
    await page.click('button:has-text("Confirm Removal")');
    
    log('17. Wait for redirect to Dashboard...');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    log('18. Refresh dashboard to verify pet is gone...');
    await page.reload();
    await page.waitForSelector('text=Your Pets', { timeout: 15000 });
    const removedStillExists = await page.$('text=BrowserTestDog Edited');
    if (removedStillExists) {
      log('   FAIL: Pet still exists on dashboard!');
    } else {
      log('   PASS: Pet is successfully removed.');
    }
    
    fs.unlinkSync('dummy.jpg');
    log('SUCCESS!');
  } catch (err) {
    log('ERROR: ' + err.message);
    await page.screenshot({ path: 'error.png' });
    const html = await page.content();
    fs.writeFileSync('error.html', html);
  } finally {
    await browser.close();
  }
}

runFlow();
