import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: '320px (Mobile S)', width: 320, height: 640, suffix: '320px' },
  { name: '390px (Mobile M)', width: 390, height: 844, suffix: '390px' },
  { name: '768px (Tablet)', width: 768, height: 1024, suffix: '768px' },
  { name: '1280px (Desktop)', width: 1280, height: 800, suffix: '1280px' },
];

const mockAlerts = [
  {
    id: 'alt-p2b-01',
    pet_id: 'pet-p2b-01',
    pet_name: 'Barnaby',
    breed: 'Golden Retriever',
    photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    status: 'active',
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    last_seen_address: '742 Evergreen Terrace, Sector 4',
    description: 'Friendly golden retriever with red collar. Responds to whistling and peanut butter treats.',
    sightings: [],
    species: 'dog',
  },
  {
    id: 'alt-p2b-02',
    pet_id: 'pet-p2b-02',
    pet_name: 'Cleo',
    breed: 'Siamese',
    photo_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    status: 'active',
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    last_seen_address: 'Oakridge Park near playground',
    description: 'Very skittish cat with seal point markings. Please approach calmly.',
    sightings: [],
    species: 'cat',
  },
];

const mockPets = [
  {
    id: 'pet-p2b-01',
    name: 'Barnaby',
    species: 'dog',
    breed: 'Golden Retriever',
    color: 'Honey Gold',
    age: '3 years',
    weight: '65 lbs',
    owner_name: 'Eleanor Vance',
    owner_phone: '+1 555-0192',
    neighborhood: 'Sector 4',
    medical_notes: '',
    share_medical_notes: false,
    photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    status: 'safe',
    qr_tag_id: 'SP-BARN-01',
    distinctive_features: ['White chest spot'],
  },
  {
    id: 'pet-p2b-03',
    name: 'Atlas',
    species: 'dog',
    breed: 'Husky',
    color: 'Silver and White',
    age: '2 years',
    weight: '55 lbs',
    owner_name: 'Eleanor Vance',
    owner_phone: '+1 555-0192',
    neighborhood: 'Sector 4',
    medical_notes: '',
    share_medical_notes: false,
    photo_url: '',
    status: 'safe',
    qr_tag_id: 'SP-ATL-03',
    distinctive_features: ['Heterochromia eyes'],
  },
];

test.describe('UX-06.5 Phase 2B: Lost & Found Recovery Experience & Direction 1 Verification', () => {
  const screenshotsDir = path.resolve(process.cwd(), '../docs/screenshots/ux-06-5-phase-2b');

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test.beforeEach(async ({ page }) => {
    // Authenticated session mock for DashboardRoute protected routes
    await page.route(/.*\/api\/auth\/me.*/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'usr-p2b-01',
          name: 'Eleanor Vance',
          email: 'eleanor@example.com',
          picture: '',
          profileCompleted: true,
          phone: '+1 555-0192',
          neighborhood: 'Sector 4',
        }),
      });
    });

    // Deterministic API routes matching alerts, pets, sightings regex
    await page.route(/.*\/api\/v1\/alerts.*/, async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'alt-p2b-new-99',
            pet_id: 'pet-p2b-01',
            pet_name: 'Barnaby',
            status: 'active',
            created_at: new Date().toISOString(),
            last_seen_address: 'Central Park West',
            description: 'Testing alert',
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockAlerts),
        });
      }
    });

    await page.route(/.*\/api\/v1\/pets.*/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPets),
      });
    });

    await page.route(/.*\/api\/v1\/sightings.*/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });
  });

  for (const vp of VIEWPORTS) {
    test(`Verify /lost Recovery Board at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/lost');
      await page.waitForLoadState('networkidle');

      // Verify Direction 1 Heading and Operational Beacon
      const heading = page.locator('h1');
      await expect(heading).toContainText(/Recovery Board/i);

      const networkBadge = page.getByText(/ACTIVE RECOVERY NETWORK/i);
      await expect(networkBadge).toBeVisible();

      // Wait for incident cards to render after hydration
      const incidentCards = page.locator('article[aria-label*="Incident alert"]');
      await expect(incidentCards.first()).toBeVisible({ timeout: 10000 });
      const count = await incidentCards.count();
      expect(count).toBe(2);

      // Verify Telemetry Counter Strip shows active count
      await expect(page.getByText(/2 Active Incidents/i)).toBeVisible();

      // Verify Emergency Action Button: Report Missing Pet -> /lost/new
      const reportBtn = page.getByRole('link', { name: /report missing pet/i }).first();
      await expect(reportBtn).toBeVisible();
      await expect(reportBtn).toHaveAttribute('href', '/lost/new');

      // Verify Search input
      const searchInput = page.getByPlaceholder(/search by name, breed, or location/i);
      await expect(searchInput).toBeVisible();

      // Verify Species Filter tabs
      const allTab = page.getByRole('tab', { name: /all alerts/i });
      await expect(allTab).toBeVisible();

      const caninesTab = page.getByRole('tab', { name: /canines/i });
      await expect(caninesTab).toBeVisible();

      // Verify no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 1);

      // Verify touch target size on emergency button: >= 44x44px (>= 48px mobile)
      const reportBox = await reportBtn.boundingBox();
      expect(reportBox).not.toBeNull();
      if (reportBox) {
        expect(reportBox.height).toBeGreaterThanOrEqual(44);
      }

      // Capture visual screenshots for 1280px and 390px
      if (vp.suffix === '1280px' || vp.suffix === '390px') {
        await page.screenshot({
          path: path.join(screenshotsDir, `lost_board_${vp.suffix}.png`),
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

      // Verify Crisis Triage Heading
      const heading = page.locator('h1');
      await expect(heading).toContainText(/Declare Missing Companion/i);

      // Verify Form Controls exist
      const petSelect = page.locator('#pet-select');
      await expect(petSelect).toBeVisible();
      await expect(page.locator('#last-seen')).toBeVisible();
      await expect(page.locator('#description')).toBeVisible();

      // Verify Privacy disclosure banner (SEC-BACKEND-01)
      await expect(page.getByText(/privacy notice \(sec-backend-01\)/i)).toBeVisible();

      // Verify Submit Button and touch targets
      const submitBtn = page.getByRole('button', { name: /publish missing pet alert/i });
      await expect(submitBtn).toBeVisible();
      const submitBox = await submitBtn.boundingBox();
      if (submitBox) {
        expect(submitBox.height).toBeGreaterThanOrEqual(44);
      }

      // Verify Activation Sequence Protocol Sidebar
      await expect(page.getByRole('heading', { name: 'Activation Sequence' })).toBeVisible();
      await expect(page.getByText(/Public QR Tag Shift/i)).toBeVisible();

      // Verify no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 1);

      // Capture visual screenshots for 1280px and 390px
      if (vp.suffix === '1280px' || vp.suffix === '390px') {
        await page.screenshot({
          path: path.join(screenshotsDir, `report_lost_${vp.suffix}.png`),
          fullPage: true,
        });
      }
    });
  }
});
