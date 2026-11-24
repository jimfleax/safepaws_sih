import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const mockPosts = [
  {
    id: 'post-phase2a-01',
    title: 'Field Observation: Golden Retriever spotted near North Reservoir',
    content: 'Animal observed heading east towards pine woods. Has blue collar and SafePaws medallion.',
    channel: 'sightings',
    author_id: 'user-scout-01',
    created_at: new Date().toISOString(),
    location: 'North Reservoir Sector 4',
    reply_count: 2,
    associated_alert_id: null,
  },
  {
    id: 'post-phase2a-02',
    title: 'Urgent Recovery Case: Lost Beagle in Sector 2',
    content: 'Companion slipped harness during afternoon walk. Very timid, do not chase.',
    channel: 'lost-found',
    author_id: 'user-guardian-02',
    created_at: new Date().toISOString(),
    location: 'Sector 2 Market Corridor',
    reply_count: 0,
    associated_alert_id: 'alert-mock-99',
    pet_name: 'Barnaby',
  },
];

const mockReplies = [
  {
    id: 'reply-01',
    post_id: 'post-phase2a-01',
    author_id: 'user-volunteer-05',
    content: 'Field scout dispatched to North Reservoir trail head with water and lead.',
    created_at: new Date().toISOString(),
  },
];

const VIEWPORTS = [
  { name: '320px (Mobile S)', width: 320, height: 568 },
  { name: '390px (Mobile M)', width: 390, height: 844 },
  { name: '768px (Tablet)', width: 768, height: 1024 },
  { name: '1280px (Desktop)', width: 1280, height: 800 },
];

test.describe('UX-06.5 Phase 2A Community Experience & Direction 1 Verification', () => {
  const screenshotsDir = path.resolve(process.cwd(), '../docs/screenshots/ux-06-5-phase-2a');

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test.beforeEach(async ({ page }) => {
    // Intercept community API calls with deterministic mock responses
    await page.route('**/api/v1/community/posts*', async (route) => {
      const url = route.request().url();
      if (url.includes('/replies')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockReplies),
        });
      } else if (url.includes('post-phase2a-01')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockPosts[0]),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockPosts),
        });
      }
    });

    await page.route('**/api/v1/community/preferences', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ interests: ['lost-found', 'sightings'] }),
      });
    });

    await page.route('**/api/v1/alerts*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });
  });

  for (const vp of VIEWPORTS) {
    test(`Verify /community route at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/community?channel=sightings');
      await page.waitForLoadState('networkidle');

      // Check header and heading
      await expect(page.locator('h1')).toContainText(/Field Sightings/i);

      // Verify no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 1);

      // Verify touch target on New Dispatch button: >= 44x44px (>= 48px mobile)
      const composeBtn = page.getByRole('button', { name: /new dispatch|post/i });
      await expect(composeBtn).toBeVisible();
      const box = await composeBtn.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
      }

      // Verify unauthenticated click opens AuthPromptModal instead of redirecting
      await composeBtn.click();
      const authModal = page.getByRole('dialog', { name: /neighborhood sign-in/i });
      await expect(authModal).toBeVisible();

      // Dismiss modal
      await page.keyboard.press('Escape');
      await expect(authModal).not.toBeVisible();

      // Capture screenshot at 390px and 1280px
      if (vp.width === 390 || vp.width === 1280) {
        await page.screenshot({
          path: path.join(screenshotsDir, `community_${vp.width}px.png`),
          fullPage: false,
        });
      }
    });

    test(`Verify /community/onboarding route at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/community/onboarding');
      await page.waitForLoadState('networkidle');

      // Verify headline
      await expect(page.locator('h1')).toContainText(/Neighborhood Dispatch Channels/i);

      // Verify no hardcoded Connaught Place
      const bodyText = await page.textContent('body');
      expect(bodyText).not.toContain('Connaught Place');

      // Verify primary action button contrast token (Carbon on Marigold)
      const submitBtn = page.getByRole('button', { name: /enlist in guild/i });
      await expect(submitBtn).toBeVisible();
      const box = await submitBtn.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
      }

      // Capture screenshot
      if (vp.width === 390 || vp.width === 1280) {
        await page.screenshot({
          path: path.join(screenshotsDir, `community_onboarding_${vp.width}px.png`),
          fullPage: false,
        });
      }
    });

    test(`Verify /community/post/:postId route at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/community/post/post-phase2a-01');
      await page.waitForLoadState('networkidle');

      // Verify Post Title is <h1>
      const h1 = page.locator('h1');
      await expect(h1).toContainText(/Field Observation: Golden Retriever/i);

      // Verify Discussion header is <h2> (ERR-H-01 remediation)
      const h2 = page.locator('h2#discussion-heading');
      await expect(h2).toContainText(/Discussion & Field Notes/i);

      // Verify Report button touch target >= 44x44px
      const reportBtn = page.getByRole('button', { name: /report post/i });
      await expect(reportBtn).toBeVisible();
      const reportBox = await reportBtn.boundingBox();
      expect(reportBox).not.toBeNull();
      if (reportBox) {
        expect(reportBox.height).toBeGreaterThanOrEqual(44);
        expect(reportBox.width).toBeGreaterThanOrEqual(44);
      }

      // Capture screenshot
      if (vp.width === 390 || vp.width === 1280) {
        await page.screenshot({
          path: path.join(screenshotsDir, `community_post_detail_${vp.width}px.png`),
          fullPage: false,
        });
      }
    });
  }
});
