import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
    permissions: ['camera']
  });
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000/scan');
  
  // Wait for the camera view to render
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'mobile_camera.png' });
  
  // Try desktop too
  const contextDesktop = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const pageDesktop = await contextDesktop.newPage();
  await pageDesktop.goto('http://localhost:3000/scan');
  await pageDesktop.waitForTimeout(2000);
  await pageDesktop.screenshot({ path: 'desktop_camera.png' });

  await browser.close();
  console.log('Screenshots saved!');
})();
