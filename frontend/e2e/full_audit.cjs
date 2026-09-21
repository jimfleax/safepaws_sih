const { chromium } = require('playwright');

async function runAudit() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    permissions: ['geolocation']
  });
  
  const errors = [];
  context.on('weberror', (webError) => {
    errors.push('[WebError] ' + webError.error());
  });

  const page = await context.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('[Console Error] ' + msg.text());
  });
  page.on('requestfailed', request => {
    errors.push('[Network Error] ' + request.url() + ' - ' + request.failure().errorText);
  });

  const log = (msg) => { console.log(msg); };

  try {
    log('=== PHASE 1: AUTHENTICATION ===');
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(3000);
    
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('button:has-text("Sign In")').click()
    ]);
    await popup.waitForLoadState('domcontentloaded');
    const popupUrl = popup.url();
    if (popupUrl.includes('accounts.google.com/o/oauth2')) {
      log('PASS: Google OAuth popup opened with valid URL.');
    } else {
      log('FAIL: Popup URL not Google OAuth: ' + popupUrl);
    }
    await popup.close();

    log('=== PHASE 2: LANDING PAGE ===');
    const heroTitle = page.locator('h1', { hasText: 'A community safety net' });
    const isVisible = await heroTitle.isVisible();
    if (isVisible) log('PASS: Hero text is visible.');
    else log('FAIL: Hero text is NOT visible.');

    const featureCard = page.locator('#feature-card-biometric');
    await featureCard.scrollIntoViewIfNeeded();
    const textContent = await featureCard.textContent();
    if (textContent.includes('Live identity verification enabled')) {
      log('PASS: Biometric copy is correct.');
    } else {
      log('FAIL: Biometric copy is stale: ' + textContent);
    }
    
    log('\n[Injecting Auth for remaining phases...]');
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLTEiLCJ0b2tlblZlcnNpb24iOjB9.51IRk5cmUQIbJz4j0pYB8_m11FeI5XOexFPQkJFsuxs';
    await context.addCookies([
      { name: 'jwt', value: token, domain: 'localhost', path: '/', httpOnly: true, sameSite: 'Lax' }
    ]);

    log('=== PHASE 3: AUTHENTICATED DASHBOARD ===');
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForSelector('text="Your Pets"');
    log('PASS: Dashboard loaded.');
    
    await page.locator('text="Add Pet"').first().click();
    await page.waitForSelector('text="Pet Name"');
    log('PASS: Add pet form opened.');
    
    log('=== PHASE 5: LOST & SIGHTINGS ===');
    await page.goto('http://localhost:3000/lost');
    await page.waitForSelector('text="Lost & Found"');
    log('PASS: Lost & Found loaded.');

    log('=== PHASE 6: COMMUNITY ===');
    await page.goto('http://localhost:3000/community');
    await page.waitForSelector('text="Community"');
    log('PASS: Community loaded.');

  } catch (err) {
    log('FATAL SCRIPT ERROR: ' + err.message);
  } finally {
    await browser.close();
    console.log('\n--- ERRORS COLLECTED ---');
    errors.forEach(e => console.log(e));
    if (errors.length === 0) console.log('None.');
  }
}
runAudit();
