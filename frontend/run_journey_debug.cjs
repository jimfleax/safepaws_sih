const { chromium } = require('playwright');
async function run() {
  const browser = await chromium.launch({ headless: true });
  const ownerContext = await browser.newContext();
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLWpvdXJuZXkiLCJ0b2tlblZlcnNpb24iOjAsImV4cCI6MTc5MjYxNzM2MX0.BACU_glLhf8yPQhVs4TMVyiQaVkrBi4s-sacg6hXqTk';
  
  await ownerContext.addCookies([{ name: 'jwt', value: token, domain: 'localhost', path: '/', httpOnly: true, sameSite: 'Lax' }]);
  const ownerPage = await ownerContext.newPage();
  ownerPage.on('request', req => {
    if (req.method() === 'POST') console.log('POST REQUEST:', req.url());
  });
  
  await ownerPage.goto('http://localhost:3000/lost/new', { waitUntil: 'domcontentloaded' });
  await ownerPage.waitForTimeout(2000);
  
  await ownerPage.fill('textarea', 'Lost near the park');
  await ownerPage.fill('#last-seen', 'Downtown Park'); 

  await ownerPage.click('button[type="submit"]');
  await ownerPage.waitForTimeout(2000); 
  await browser.close(); console.log('Done');
}
run().catch(console.error);
