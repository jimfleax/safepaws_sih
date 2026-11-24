import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: '320px (Mobile S)', width: 320, height: 640, suffix: '320px' },
  { name: '390px (Mobile M)', width: 390, height: 844, suffix: '390px' },
  { name: '768px (Tablet)', width: 768, height: 1024, suffix: '768px' },
  { name: '1280px (Desktop)', width: 1280, height: 800, suffix: '1280px' },
];

const SCREENSHOT_DIR = path.resolve(__dirname, '../../docs/screenshots/ux-06-5-phase-2b');

test.beforeAll(() => {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
});

test.describe('UX-06.5 Phase 2B: Lost & Found Recovery Experience & Direction 1 Verification', () => {

  for (const vp of VIEWPORTS) {
    test(`Verify /lost Recovery Board at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/lost');
      await page.waitForLoadState('networkidle');

      // Verify Page Title and Direction 1 Heading
      const heading = page.locator('h1');
      await expect(heading).toContainText(/Recovery Board/i);

      // Verify Recovery Network Badge
      const networkBadge = page.getByText(/ACTIVE RECOVERY NETWORK/i);
      await expect(networkBadge).toBeVisible();

      // Verify CTAs exist and are actionable
      const reportBtn = page.getByRole('link', { name: /report missing pet/i }).first();
      await expect(reportBtn).toBeVisible();
      await expect(reportBtn).toHaveAttribute('href', '/lost/new');

      // Verify Search input
      const searchInput = page.getByPlaceholder(/search by name, breed, or location/i);
      await expect(searchInput).toBeVisible();

      // Verify Species Filter tabs
      const allTab = page.getByRole('tab', { name: /all alerts/i });
      await expect(allTab).toBeVisible();

      // Verify at least one IncidentCard exists
      const incidentCards = page.locator('article[aria-label*="Incident alert"]');
      const count = await incidentCards.count();
      expect(count).toBeGreaterThan(0);

      // Verify touch target size on primary CTA
      const reportBox = await reportBtn.boundingBox();
      expect(reportBox).not.toBeNull();
      if (reportBox) {
        expect(reportBox.height).toBeGreaterThanOrEqual(44);
      }

      // Capture screenshot for key viewports (1280px and 390px)
      if (vp.suffix === '1280px' || vp.suffix === '390px') {
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `lost_board_${vp.suffix}.png`),
          fullPage: true,
        });
      }
    });

    test(`Verify /lost/new Emergency Missing Declaration Dossier at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/lost/new');
      await page.waitForLoadState('networkidle');

      // Verify Breadcrumb Navigation
      const backLink = page.getByRole('link', { name: /back to recovery board/i });
      await expect(backLink).toBeVisible();
      await expect(backLink).toHaveAttribute('href', '/lost');

      // Verify Emergency Heading
      const heading = page.locator('h1');
      await expect(heading).toContainText(/Declare Missing Companion/i);

      // Check whether user has eligible pets or if unregistered pet guidance renders
      const hasForm = await page.locator('form').isVisible();
      if (hasForm) {
        // Form controls exist
        await expect(page.locator('#pet-select')).toBeVisible();
        await expect(page.locator('#last-seen')).toBeVisible();
        await expect(page.locator('#description')).toBeVisible();

        // Privacy notice is present
        await expect(page.getByText(/privacy notice \(sec-backend-01\)/i)).toBeVisible();

        // Submit button
        const submitBtn = page.getByRole('button', { name: /publish missing pet alert/i });
        await expect(submitBtn).toBeVisible();
        const submitBox = await submitBtn.boundingBox();
        if (submitBox) {
          expect(submitBox.height).toBeGreaterThanOrEqual(44);
        }
      } else {
        // Empathetic unregistered pet state
        const enrollLink = page.getByRole('link', { name: /enroll companion profile/i });
        await expect(enrollLink).toBeVisible();
        await expect(enrollLink).toHaveAttribute('href', '/pets/new');
      }

      // Capture screenshot for key viewports
      if (vp.suffix === '1280px' || vp.suffix === '390px') {
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `report_lost_${vp.suffix}.png`),
          fullPage: true,
        });
      }
    });
  }

});
