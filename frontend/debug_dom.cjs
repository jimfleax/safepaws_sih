const { chromium } = require('playwright');
async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.addCookies([{ name: 'jwt', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLWpvdXJuZXkiLCJ0b2tlblZlcnNpb24iOjAsImV4cCI6MTc5MjYxNzE5MX0._K1A4NaGYyzXRg4VCKJ8XyoI2VfUV5-2FkEZHrbZG4w', domain: 'localhost', path: '/', httpOnly: true, sameSite: 'Lax' }]);
  const page = await context.newPage();
  await page.goto('http://localhost:3000/lost/new', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const html = await page.content();
  console.log(html);
  await browser.close();
}
run().catch(console.error);
