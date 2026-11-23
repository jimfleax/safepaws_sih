import { test, expect } from '@playwright/test';

const mockAlerts = [
  {
    id: 'alert-touch-01',
    pet_id: 'pet-touch-01',
    status: 'active',
    last_seen_address: '742 Evergreen Terrace — PRIVATE ADDRESS',
    description: 'Energetic companion wandering near park entrance.',
    created_at: new Date().toISOString(),
    pet_name: 'Barnaby',
    breed: 'Catahoula Leopard Dog',
    photo_url: '',
    species: 'dog',
    sightings: [
      {
        id: 'sighting-touch-01',
        alert_id: 'alert-touch-01',
        reporter_name: 'Elena Rostova',
        location: '5th Avenue & Pine',
        notes: 'Seen drinking from fountain',
        time: new Date().toISOString(),
        confirmed: true,
      },
    ],
  },
];

const mockCommunityPost = {
  id: 'post-touch-01',
  title: 'Community Safety Advisory: Daylight Reunifications',
  content: 'Please remember to meet in public daylight areas and never wire advance deposits.',
  channel: 'general',
  author_name: 'Elena Rostova',
  created_at: new Date().toISOString(),
  author: {
    id: 'user-001',
    full_name: 'Elena Rostova',
  },
};

const VIEWPORTS = [
  { name: '320px (Ultra-compact mobile)', width: 320, height: 568 },
  { name: '390px (Standard mobile)', width: 390, height: 844 },
  { name: '1280px (Desktop)', width: 1280, height: 800 },
];

test.describe('UX-06.5 Phase 1 Browser Touch Target & Contract Verification (C1, C4, C6)', () => {
  for (const vp of VIEWPORTS) {
    test.describe(`Viewport: ${vp.name}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });

        // Mock backend endpoints
        await page.route('**/api/v1/alerts/', async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockAlerts),
          });
        });

        await page.route('**/api/v1/alerts/alert-touch-01', async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockAlerts[0]),
          });
        });

        await page.route('**/api/v1/pets/', async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
          });
        });

        await page.route('**/api/v1/sightings/', async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockAlerts[0].sightings),
          });
        });

        await page.route('**/api/v1/community/posts/post-touch-01', async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockCommunityPost),
          });
        });

        await page.route('**/api/v1/community/posts/post-touch-01/replies', async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
          });
        });
      });

      test('IncidentCard Quick Share trigger renders with actual bounding box >= 44x44 CSS px', async ({ page }) => {
        await page.goto('/lost');
        await page.waitForLoadState('networkidle');

        // Locate Quick Share button
        const shareButton = page.locator('button[aria-label="Share alert for Barnaby"]');
        await expect(shareButton).toBeVisible();

        const box = await shareButton.boundingBox();
        expect(box).not.toBeNull();
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }

        // Verify focus-visible styling works
        await shareButton.focus();
        await expect(shareButton).toBeFocused();

        // Verify no horizontal overflow/clipping of document
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // allowing minor subpixel rounding
      });

      test('CommunityPostDetail Report Post button renders with actual bounding box >= 44x44 CSS px', async ({ page }) => {
        await page.goto('/community/post/post-touch-01');
        await page.waitForLoadState('networkidle');

        const reportButton = page.locator('button[aria-label="Report post"]');
        await expect(reportButton).toBeVisible();

        const box = await reportButton.boundingBox();
        expect(box).not.toBeNull();
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }

        // Verify focus-visible styling works
        await reportButton.focus();
        await expect(reportButton).toBeFocused();
      });

      test('AlertDetail direct URL navigation hydrates correctly and suppresses raw residential address', async ({ page }) => {
        await page.goto('/alerts/alert-touch-01');
        await page.waitForLoadState('networkidle');

        // Heading and pet details
        await expect(page.locator('h1')).toContainText('Missing: Barnaby');
        await expect(page.getByText('Catahoula Leopard Dog')).toBeVisible();

        // Location privacy: raw street address must NOT be in DOM
        const bodyText = await page.innerText('body');
        expect(bodyText).not.toContain('742 Evergreen Terrace');
        await expect(page.getByText('Vicinity details restricted for privacy')).toBeVisible();

        // Sighting ledger rendering
        await expect(page.getByText('Elena Rostova')).toBeVisible();
        await expect(page.getByText('5th Avenue & Pine')).toBeVisible();
      });
    });
  }
});
