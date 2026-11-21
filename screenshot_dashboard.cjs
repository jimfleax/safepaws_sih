const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://127.0.0.1:3000');
  
  const response = await page.evaluate(async () => {
    return await fetch('/api/auth/dev-login', { method: 'POST' }).then(r => r.json());
  });
  
  console.log('Dev login response:', response);
  
  await page.goto('http://127.0.0.1:3000/dashboard');
  await page.waitForTimeout(3000); 
  
  await page.screenshot({ path: 'dashboard_before_desktop.png', fullPage: true });
  console.log('Saved dashboard_before_desktop.png');
  
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: 'dashboard_before_mobile.png', fullPage: true });
  console.log('Saved dashboard_before_mobile.png');

  await browser.close();
})();
