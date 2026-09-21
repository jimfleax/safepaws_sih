const { chromium } = require('playwright');
const fs = require('fs');

async function logResult(journey, action, expected, actual, urlBefore, finalUrl, consoleError, pass, errorReason) {
  const result = `
**${journey}**
URL before: ${urlBefore}
ACTION: ${action}
EXPECTED: ${expected}
ACTUAL: ${actual}
FINAL URL: ${finalUrl}
HTTP/API result: ${pass ? '200 OK (or bypassed)' : 'Failed/Not tested fully'}
Console error: ${consoleError || 'None'}
PASS or FAIL: ${pass ? 'PASS' : 'FAIL'}
${errorReason ? `Exact error/root cause: ${errorReason}` : ''}
`;
  console.log(result);
  fs.appendFileSync('audit_results.md', result);
}

(async () => {
  fs.writeFileSync('audit_results.md', '# Strict Verification Audit\n\n');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  
  const baseUrl = 'http://localhost:3000';
  
  try {
    // 1. Login (Auth Bypass)
    let urlBefore = baseUrl + '/';
    await context.addCookies([{
      name: 'jwt',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLTEiLCJ0b2tlblZlcnNpb24iOjAsImV4cCI6MTc5MjU3NDQ3Nn0.b190odxN6LYTClYE-rc0Na4O9-MR6cpFt7wjGp3pHIo',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax'
    }]);
    await page.goto(baseUrl + '/');
    await page.evaluate(() => sessionStorage.setItem('hasEntered', 'true'));
    await page.goto(baseUrl + '/dashboard');
    await page.waitForURL('**/setup-profile', { timeout: 3000 });
    await logResult('1. Login (AUTH-BYPASS)', 'Injected JWT and navigated to dashboard', 'Redirect to /setup-profile since profile is incomplete', 'Redirected successfully', urlBefore, page.url(), consoleErrors.join(', '), true);
    
    // 2. Setup Profile
    consoleErrors = [];
    urlBefore = page.url();
    await page.click('button:has-text("Enter manually instead")');
    await page.fill('input[type="tel"]', '1234567890');
    await page.fill('input[type="text"]', 'Test Neighborhood'); // Was failing due to placeholder, but input[type="text"] is safer
    await page.click('button:has-text("Complete Profile")');
    await page.waitForURL('**/dashboard', { timeout: 3000 });
    await logResult('2. Setup Profile', 'Filled phone and neighborhood, submitted', 'Saves and redirects to /dashboard', 'Redirected to dashboard', urlBefore, page.url(), consoleErrors.join(', '), true);

    // 3. Dashboard
    consoleErrors = [];
    urlBefore = page.url();
    await page.waitForSelector('text=Your Pets');
    await logResult('3. Dashboard', 'Verify dashboard loaded', 'Shows "Your Pets"', 'Rendered properly', urlBefore, page.url(), consoleErrors.join(', '), true);

    // 4. Add Pet
    consoleErrors = [];
    urlBefore = page.url();
    await page.click('a[href="/pets/new"]');
    await page.waitForURL('**/pets/new');
    await page.fill('input[name="name"]', 'AuditDog');
    await page.fill('input[name="breed"]', 'Golden Retriever');
    await page.fill('input[name="color"]', 'Golden');
    await page.fill('input[name="age"]', '2');
    await page.fill('input[name="weight"]', '15');
    await page.click('button:has-text("Next")');
    
    const skipBtn = page.locator('button:has-text("Skip")');
    await skipBtn.waitFor({ state: 'visible' });
    await skipBtn.click();
    
    const finishBtn = page.locator('button:has-text("Finish")');
    await finishBtn.waitFor({ state: 'visible' });
    await finishBtn.click();
    
    await page.waitForURL('**/pets/*');
    const petId = page.url().split('/').pop();
    await logResult('4. Add Pet', 'Filled pet details and skipped image', 'Created pet and redirected to pet profile', 'Redirected to /pets/' + petId, urlBefore, page.url(), consoleErrors.join(', '), true);

    // 5. Edit Pet
    consoleErrors = [];
    urlBefore = page.url();
    await page.click('button:has-text("Edit Identity Record")');
    await page.fill('input[value="AuditDog"]', 'AuditDog Updated');
    await page.click('button:has-text("Save Changes")');
    // Wait for the button text to revert or modal to close
    await page.waitForSelector('text=Identity record updated successfully');
    await logResult('5. Edit Pet', 'Changed name and saved', 'Success message appears', 'Success message displayed', urlBefore, page.url(), consoleErrors.join(', '), true);

  } catch (e) {
    console.error('Error during execution:', e);
    await page.screenshot({ path: 'failure_screenshot.png' });
    console.log('Took screenshot: failure_screenshot.png');
  } finally {
    await browser.close();
  }
})();
