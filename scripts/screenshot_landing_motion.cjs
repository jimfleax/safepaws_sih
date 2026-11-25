const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    colorScheme: 'light',
    reducedMotion: 'reduce' // This will trigger the prefers-reduced-motion media query
  });
  const page = await context.newPage();
  
  await page.goto('http://127.0.0.1:3000');
  await page.waitForTimeout(4000); 
  
  // Large Desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: 'landing_1440_no_motion.png', fullPage: true });
  console.log('Saved landing_1440_no_motion.png');

  await browser.close();
})();
