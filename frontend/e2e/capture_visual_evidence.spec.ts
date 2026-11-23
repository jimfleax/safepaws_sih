import { test } from '@playwright/test';

test.describe('Capture Visual Evidence for UX-06.2 Audit', () => {
  test('Capture Desktop Screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Landing Page Desktop
    await page.goto('/');
    await page.evaluate(() => sessionStorage.setItem('hasEntered', 'true'));
    await page.goto('/');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '../docs/screenshots/landing_desktop.png', fullPage: false });
    await page.screenshot({ path: '../docs/screenshots/landing_desktop_full.png', fullPage: true });

    // 2. Recovery Board Desktop
    await page.goto('/lost');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '../docs/screenshots/lost_desktop.png', fullPage: false });
    await page.screenshot({ path: '../docs/screenshots/lost_desktop_full.png', fullPage: true });
  });

  test('Capture Mobile Screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    // 3. Landing Page Mobile
    await page.goto('/');
    await page.evaluate(() => sessionStorage.setItem('hasEntered', 'true'));
    await page.goto('/');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '../docs/screenshots/landing_mobile.png', fullPage: false });
    await page.screenshot({ path: '../docs/screenshots/landing_mobile_full.png', fullPage: true });

    // 4. Recovery Board Mobile
    await page.goto('/lost');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '../docs/screenshots/lost_mobile.png', fullPage: false });
    await page.screenshot({ path: '../docs/screenshots/lost_mobile_full.png', fullPage: true });
  });
});
