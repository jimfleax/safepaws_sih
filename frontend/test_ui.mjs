import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({
    args: [
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream'
    ]
  });
  
  // Mobile
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
    permissions: ['camera']
  });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/scan');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'mobile_camera.png' });
  
  // Desktop
  const contextDesktop = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    permissions: ['camera']
  });
  const pageDesktop = await contextDesktop.newPage();
  await pageDesktop.goto('http://localhost:3000/scan');
  await pageDesktop.waitForTimeout(2000);
  await pageDesktop.screenshot({ path: 'desktop_camera.png' });
  
  // Test Processing
  await page.evaluate(() => {
    // hack state to processing
    // Not super easy from outside, let's just click the capture button to trigger
  });
  await page.click('button[aria-label="Capture photo"]');
  await page.waitForTimeout(500); // wait for state to change to ANALYZING
  await page.screenshot({ path: 'mobile_processing.png' });

  await browser.close();
  console.log('Screenshots saved!');
})();
