import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

test.describe('Creative Showcase — Increment 1 Visual & Interaction Verification', () => {
  const screenshotsDir = path.resolve(__dirname, '../../docs/screenshots/creative-charter');
  const brainScreenshotsDir = path.resolve(
    '/home/samudra/.gemini/antigravity-cli/brain/64840b91-20dd-480a-bae0-115056cbb502/screenshots/creative-charter'
  );

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    if (!fs.existsSync(brainScreenshotsDir)) {
      fs.mkdirSync(brainScreenshotsDir, { recursive: true });
    }
  });

  test('Desktop Viewport (1280px) — Renders and interacts with all Increment 1 primitives', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/showcase');
    await page.waitForLoadState('networkidle');

    // 1. Verify Variable Typography
    const heading = page.getByRole('heading', { name: /The Field Dispatch & Recovery Ledger/i });
    await expect(heading).toBeVisible();

    // 2. Verify Field Buttons & metadata tags
    const primaryButton = page.getByRole('button', { name: /Initiate Grid Search/i });
    await expect(primaryButton).toBeVisible();
    await expect(page.getByText('TACTICAL ACTION')).toBeVisible();

    // 3. Verify Ledger Cards
    await expect(page.getByText('Barnaby — Golden Retriever')).toBeVisible();
    await expect(page.getByText('REF: #ALERT-8941')).toBeVisible();

    // 4. Capture Desktop Full Page Screenshot
    const desktopPath = path.join(screenshotsDir, 'showcase_desktop_1280px.png');
    const brainDesktopPath = path.join(brainScreenshotsDir, 'showcase_desktop_1280px.png');
    await page.screenshot({ path: desktopPath, fullPage: true });
    fs.copyFileSync(desktopPath, brainDesktopPath);

    // 5. Test Physical Interactive Sticker Peeling
    const goldSeal = page.getByRole('button', { name: /VERIFIED IDENTITY seal/i });
    await expect(goldSeal).toBeVisible();
    await expect(goldSeal).toHaveAttribute('aria-expanded', 'false');

    // Click to peel
    await goldSeal.click();
    await expect(goldSeal).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByText('RECORD #894-2026').first()).toBeVisible();

    // Capture Peeled Sticker Detail Screenshot
    const peeledPath = path.join(screenshotsDir, 'sticker_peeled_detail.png');
    const brainPeeledPath = path.join(brainScreenshotsDir, 'sticker_peeled_detail.png');
    await goldSeal.screenshot({ path: peeledPath });
    fs.copyFileSync(peeledPath, brainPeeledPath);

    // Click to reseal
    await goldSeal.click();
    await expect(goldSeal).toHaveAttribute('aria-expanded', 'false');
  });

  test('Mobile Viewport (390px) — Verified responsive layout and touch targets', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/showcase');
    await page.waitForLoadState('networkidle');

    // Verify zero horizontal scroll overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(390);

    // Verify touch target dimensions on primary button
    const buttonBox = await page.getByRole('button', { name: /Initiate Grid Search/i }).boundingBox();
    expect(buttonBox).not.toBeNull();
    if (buttonBox) {
      expect(buttonBox.height).toBeGreaterThanOrEqual(44.0);
    }

    // Capture Mobile Full Page Screenshot
    const mobilePath = path.join(screenshotsDir, 'showcase_mobile_390px.png');
    const brainMobilePath = path.join(brainScreenshotsDir, 'showcase_mobile_390px.png');
    await page.screenshot({ path: mobilePath, fullPage: true });
    fs.copyFileSync(mobilePath, brainMobilePath);
  });
});
