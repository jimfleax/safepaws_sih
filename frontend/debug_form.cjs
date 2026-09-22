const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLWpvdXJuZXkiLCJ0b2tlblZlcnNpb24iOjAsImV4cCI6MTc5MjYxNzM2MX0.BACU_glLhf8yPQhVs4TMVyiQaVkrBi4s-sacg6hXqTk';
  await context.addCookies([{
    name: 'jwt',
    value: token,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
    sameSite: 'Lax'
  }]);

  const page = await context.newPage();
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  
  await page.goto('http://localhost:3000/lost/new');
  await page.waitForTimeout(1000);
  
  await page.fill('textarea', 'Lost near the park');
  await page.fill('input[name="lastSeenAddress"], input[type="text"]', 'Downtown Park'); 
  
  console.log("Filled form, taking screenshot before click");
  await page.screenshot({ path: 'before_click.png' });
  
  await page.click('button[type="submit"]');
  console.log("Clicked submit, taking screenshot after click");
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'after_click.png' });
  
  await browser.close();
})();
