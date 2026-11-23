import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { id: 'VP-01', width: 320, height: 568, name: 'iPhone SE 1st Gen (Ultra-compact mobile)' },
  { id: 'VP-02', width: 360, height: 640, name: 'Galaxy S8 (Standard compact Android)' },
  { id: 'VP-03', width: 375, height: 667, name: 'iPhone SE 2nd/3rd Gen' },
  { id: 'VP-04', width: 390, height: 844, name: 'iPhone 12/13/14/15 Standard' },
  { id: 'VP-05', width: 430, height: 932, name: 'iPhone 14/15 Pro Max' },
  { id: 'VP-06', width: 768, height: 1024, name: 'iPad Mini (Portrait Tablet)' },
  { id: 'VP-07', width: 1024, height: 768, name: 'iPad / Small Laptop (Landscape)' },
  { id: 'VP-08', width: 1280, height: 800, name: 'MacBook Air / Desktop' },
  { id: 'VP-09', width: 1440, height: 900, name: 'Widescreen Desktop' },
  { id: 'VP-10', width: 1920, height: 1080, name: 'FHD Ultra-wide Workstation' },
];

test.describe('SafePaws Multi-Viewport Matrix (320px to 1920px) & WCAG 2.2 AA Audit', () => {
  for (const vp of VIEWPORTS) {
    test(`Landing Page (/) conforms at ${vp.id}: ${vp.width}x${vp.height} (${vp.name})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // Bypass enter screen
      await page.evaluate(() => sessionStorage.setItem('hasEntered', 'true'));
      await page.goto('/');

      // Invariant 1: Semantic primary <main id="main-content"> landmark
      const main = page.locator('main#main-content');
      await expect(main).toBeVisible();

      // Invariant 2: Zero horizontal overflow
      const hasHorizontalScrollbar = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScrollbar).toBe(false);

      // Invariant 3: Skip to content target exists
      const skipLink = page.locator('a[href="#main-content"]');
      await expect(skipLink).toBeAttached();

      // Invariant 4: Primary action buttons exist and maintain touch bounding box >= 44x44px
      const primaryBtn = page.getByRole('button', { name: /SCAN A (FOUND )?DOG|SCAN A FOUND COMPANION/i }).first();
      await expect(primaryBtn).toBeVisible();
      const box = await primaryBtn.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
      }
    });

    test(`Recovery Board (/lost) conforms at ${vp.id}: ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/lost');

      const main = page.locator('main#main-content');
      await expect(main).toBeVisible();

      // Zero horizontal overflow
      const hasHorizontalScrollbar = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScrollbar).toBe(false);

      // Filter pills touch targets >= 44px
      const allFilter = page.getByRole('button', { name: /All Alerts/i }).first();
      if (await allFilter.isVisible()) {
        const box = await allFilter.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    });
  }
});
