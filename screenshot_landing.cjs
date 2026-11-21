const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://127.0.0.1:3000');
  await page.waitForTimeout(4000); // wait for entrance animation (EnterScreen takes ~3s)
  
  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'landing_390.png', fullPage: true });
  console.log('Saved landing_390.png');
  
  // Tablet
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.screenshot({ path: 'landing_768.png', fullPage: true });
  console.log('Saved landing_768.png');
  
  // Small Desktop
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.screenshot({ path: 'landing_1024.png', fullPage: true });
  console.log('Saved landing_1024.png');
  
  // Large Desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: 'landing_1440.png', fullPage: true });
  console.log('Saved landing_1440.png');

  await browser.close();
})();
