import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const results = [];
  try {
    // 1. NEW USER
    await page.goto('http://localhost:3000/');
    results.push('1. Home Loaded');
    await page.waitForTimeout(500);
    
    // Check navigation
    await page.goto('http://localhost:3000/setup-profile');
    results.push('1. Setup Profile Loaded');
    
    // 2. PET REGISTRATION
    await page.goto('http://localhost:3000/pets/new');
    results.push('2. Pet Registration Loaded');
    
    // 3. PET PROFILE
    await page.goto('http://localhost:3000/pets/test-pet');
    results.push('3. Pet Profile Loaded');
    
    // 4. PUBLIC PROFILE
    await page.goto('http://localhost:3000/p/test-tag');
    results.push('4. Public Profile Loaded');
    
    // 5. DASHBOARD
    await page.goto('http://localhost:3000/dashboard');
    results.push('5. Dashboard Loaded');
    
    // 6. SCAN
    await page.goto('http://localhost:3000/scan');
    results.push('6. Scan Loaded');
    
    // 8. LOST FLOW
    await page.goto('http://localhost:3000/lost');
    results.push('8. Lost Dashboard Loaded');
    
    await page.goto('http://localhost:3000/lost/new');
    results.push('8. Report Lost Loaded');
    
    await page.goto('http://localhost:3000/alerts/test-alert');
    results.push('8. Alert Detail Loaded');
    
    // 9. SIGHTING FLOW
    await page.goto('http://localhost:3000/sightings/new');
    results.push('9. Report Sighting Loaded');
    
    // 11. NAVIGATION AUDIT
    await page.goto('http://localhost:3000/community');
    results.push('11. Community Loaded');
    
    await page.goto('http://localhost:3000/invalid-route');
    const content = await page.content();
    const is404 = content.includes('Page Not Found') || content.includes('404');
    results.push(`11. 404 Route Works: ${is404}`);

    console.log("SMOKE TEST RESULTS:");
    console.log(results.join('\n'));
    
  } catch (err) {
    console.error('Error during smoke test:', err);
  } finally {
    await browser.close();
  }
})();
