const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://127.0.0.1:3000');
  
  await page.evaluate(async () => {
    return await fetch('/api/auth/dev-login', { method: 'POST' }).then(r => r.json());
  });
  
  await page.goto('http://127.0.0.1:3000/dashboard');
  await page.waitForTimeout(3000); 
  
  await page.screenshot({ path: 'dashboard_after_desktop.png', fullPage: true });
  console.log('Saved dashboard_after_desktop.png');
  
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: 'dashboard_after_mobile.png', fullPage: true });
  console.log('Saved dashboard_after_mobile.png');

  await browser.close();
})();
