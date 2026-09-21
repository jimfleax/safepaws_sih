const { chromium } = require('playwright');
const fs = require('fs');

async function runAudit() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = {};

  const logs = [];
  const networkErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') logs.push(msg.text());
  });
  page.on('response', response => {
    if (!response.ok() && response.request().resourceType() === 'fetch') {
      networkErrors.push(response.status() + ' ' + response.url());
    }
  });

  async function testRoute(name, url) {
    console.log('Testing', url);
    logs.length = 0;
    networkErrors.length = 0;
    const response = await page.goto('http://localhost:3000' + url, { waitUntil: 'load' });
    // wait a tiny bit for react
    await page.waitForTimeout(500);
    const title = await page.title();
    const heading = await page.locator('h1').first().textContent().catch(() => null);
    const finalUrl = page.url();
    results[name] = {
      status: response ? response.status() : null,
      finalUrl,
      heading: heading ? heading.trim() : null,
      logs: [...logs],
      networkErrors: [...networkErrors],
      redirected: finalUrl !== ('http://localhost:3000' + url)
    };
  }

  await testRoute('landing', '/');
  await testRoute('setup_profile', '/setup-profile');
  await testRoute('dashboard', '/dashboard');
  await testRoute('scan', '/scan');
  await testRoute('public_profile', '/p/tag123');
  await testRoute('lost', '/lost');
  await testRoute('community', '/community');
  
  await page.evaluate(() => {
    localStorage.setItem('auth-storage', JSON.stringify({
      state: {
        isAuthenticated: true,
        user: {
          id: 'test-user',
          name: 'Test',
          email: 'test@example.com',
          profileCompleted: true
        }
      }
    }));
  });

  await testRoute('dashboard_auth', '/dashboard');
  await testRoute('community_auth', '/community');
  
  fs.writeFileSync('audit_results.json', JSON.stringify(results, null, 2));
  await browser.close();
}

runAudit().catch(console.error);
