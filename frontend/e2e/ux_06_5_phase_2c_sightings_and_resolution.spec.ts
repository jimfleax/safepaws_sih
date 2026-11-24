import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: '320px (Mobile S)', width: 320, height: 640, suffix: '320px' },
  { name: '390px (Mobile M)', width: 390, height: 844, suffix: '390px' },
  { name: '768px (Tablet)', width: 768, height: 1024, suffix: '768px' },
  { name: '1280px (Desktop)', width: 1280, height: 800, suffix: '1280px' },
];

const mockAlert = {
  id: 'alt-p2c-01',
  pet_id: 'pet-p2c-01',
  pet_name: 'Barnaby',
  breed: 'Golden Retriever',
  photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
  status: 'active',
  created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  last_seen_address: '742 Evergreen Terrace, Sector 4',
  description: 'Golden retriever with red collar. Very friendly.',
  sightings: [
    {
      id: 'sgt-p2c-01',
      alert_id: 'alt-p2c-01',
      reporter_name: 'Officer Higgins',
      location: 'Oakridge Park Fountain',
      notes: 'Observed near duck pond resting in shade.',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      confirmed: true,
    },
    {
      id: 'sgt-p2c-02',
      alert_id: 'alt-p2c-01',
      reporter_name: 'Jane Scout',
      location: 'Elm & 4th Street Crosswalk',
      notes: 'Seen heading east towards community market.',
      time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      confirmed: false,
    },
  ],
};

const mockPets = [
  {
    id: 'pet-p2c-01',
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
    status: 'lost',
    qr_tag_id: 'SP-BARN-01',
    distinctive_features: ['White chest spot'],
  },
];

test.describe('UX-06.5 Phase 2C: Sighting Submission, Timeline & Case Resolution Verification', () => {
  const screenshotsDir = path.resolve(process.cwd(), '../docs/screenshots/ux-06-5-phase-2c');

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test.beforeEach(async ({ page }) => {
    // Authenticated session mock (owner of pet-p2c-01)
    await page.route(/.*\/api\/auth\/me.*/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'usr-guardian-01',
          name: 'Eleanor Vance',
          email: 'eleanor@example.com',
          picture: '',
          profileCompleted: true,
          phone: '+1 555-0192',
          neighborhood: 'Sector 4',
        }),
      });
    });

    // Alert API Mock (GET single alert & list)
    await page.route(/\/api\/v1\/alerts(\/.*)?$/, async (route) => {
      const url = route.request().url();
      if (route.request().method() === 'PUT' && url.includes('/resolve')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ...mockAlert,
            status: 'resolved',
          }),
        });
      } else if (url.includes('alt-p2c-01')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockAlert),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([mockAlert]),
        });
      }
    });

    // Pets API Mock
    await page.route(/.*\/api\/v1\/pets.*/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPets),
      });
    });

    // Sightings API Mock
    await page.route(/\/api\/v1\/sightings(\/.*)?$/, async (route) => {
      if (route.request().method() === 'POST') {
        const postData = route.request().postDataJSON();
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'sgt-p2c-created-99',
            reporter_name: postData.reporter_name || 'Eleanor Vance',
            location: postData.location,
            notes: postData.notes,
            time: new Date().toISOString(),
            confirmed: false,
            alert_id: postData.alert_id || 'alt-p2c-01',
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockAlert.sightings),
        });
      }
    });
  });

  for (const vp of VIEWPORTS) {
    test(`Verify /sightings/new Citizen Sighting Intake & In-Situ Receipt at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/sightings/new?alertId=alt-p2c-01');
      await page.waitForLoadState('networkidle');

      // 1. Verify Operational Header & Subject Context Banner
      const heading = page.locator('h1');
      await expect(heading).toContainText(/Log a Field Observation/i);

      await expect(page.getByText(/Subject: Barnaby/i)).toBeVisible();
      await expect(page.getByText(/LINKED INCIDENT DOCKET/i)).toBeVisible();

      // 2. Verify form inputs exist
      const reporterInput = page.getByLabel(/your name \/ field identifier/i);
      await expect(reporterInput).toBeVisible();

      const locationInput = page.getByLabel(/observation vicinity \/ cross streets/i);
      await expect(locationInput).toBeVisible();

      const notesInput = page.getByLabel(/observation narrative & appearance/i);
      await expect(notesInput).toBeVisible();

      // 3. Fill in observation details
      await locationInput.fill('Corner of 5th Ave and Pine St, near park bench');
      await notesInput.fill('Companion was seen drinking from park fountain. Wearing red collar, appears calm.');

      // 4. Verify submit button touch target
      const submitBtn = page.getByRole('button', { name: /transmit field sighting/i });
      await expect(submitBtn).toBeVisible();
      const submitBox = await submitBtn.boundingBox();
      if (submitBox) {
        expect(submitBox.height).toBeGreaterThanOrEqual(44);
      }

      // 5. Submit the form
      await submitBtn.click();

      // 6. Verify IN-SITU Archival Sighting Receipt Card appears (Contract C2 & C4)
      await expect(page.getByRole('heading', { name: /observation logged to ledger/i })).toBeVisible();
      await expect(page.getByText(/REF: #SGT-SGT-P2C-/i)).toBeVisible();
      await expect(page.getByText(/STATUS: COMMUNITY REPORT \/\/ UNVERIFIED/i)).toBeVisible();
      await expect(page.getByText(/Corner of 5th Ave and Pine St/i)).toBeVisible();

      // 7. Verify navigation action to view incident dossier
      const dossierLink = page.getByRole('link', { name: /view incident dossier/i });
      await expect(dossierLink).toBeVisible();
      await expect(dossierLink).toHaveAttribute('href', '/alerts/alt-p2c-01');

      // 8. Verify no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 1);

      // Capture visual screenshots for 1280px and 390px
      if (vp.suffix === '1280px' || vp.suffix === '390px') {
        await page.screenshot({
          path: path.join(screenshotsDir, `sighting_receipt_${vp.suffix}.png`),
          fullPage: true,
        });
      }
    });

    test(`Verify /alerts/:id Dossier, Sighting Timeline & Owner Resolution at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/alerts/alt-p2c-01');
      await page.waitForLoadState('networkidle');

      // 1. Verify Incident Header
      const heading = page.locator('h1');
      await expect(heading).toContainText(/Missing: Barnaby/i);

      // 2. Verify Status Stamp
      await expect(page.getByText(/ACTIVE INCIDENT/i)).toBeVisible();

      // 3. Verify Sighting Field Ledger with both Unverified and Confirmed badges (Contract C4)
      await expect(page.getByRole('heading', { name: /sighting field ledger/i })).toBeVisible();
      await expect(page.getByText(/VERIFIED OBSERVATION \/\/ CONFIRMED/i)).toBeVisible();
      await expect(page.getByText(/COMMUNITY OBSERVATION \/\/ UNVERIFIED/i)).toBeVisible();

      // 4. Verify Owner Resolution Protocol (Contract C6)
      const resolveBtn = page.getByRole('button', { name: /mark safe & resolve/i });
      await expect(resolveBtn).toBeVisible();

      // Verify touch target
      const resolveBox = await resolveBtn.boundingBox();
      if (resolveBox) {
        expect(resolveBox.height).toBeGreaterThanOrEqual(44);
      }

      // Open confirmation modal
      await resolveBtn.click();
      const modalHeading = page.getByRole('heading', { name: /confirm case resolution/i });
      await expect(modalHeading).toBeVisible();
      await expect(page.getByText(/conclude active community search efforts/i)).toBeVisible();

      // Confirm resolution
      const confirmBtn = page.getByRole('button', { name: /yes, mark companion safe/i });
      await expect(confirmBtn).toBeVisible();
      await confirmBtn.click();

      // Verify post-resolution status (Contract C6)
      await expect(page.getByText(/STATUS: RESOLVED/i)).toBeVisible();
      await expect(page.getByText(/CASE CONCLUDED \/\/ COMPANION SAFE/i)).toBeVisible();
      await expect(page.getByText(/REUNITED & SAFE/i)).toBeVisible();

      // 5. Verify no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 1);

      // Capture visual screenshots for 1280px and 390px
      if (vp.suffix === '1280px' || vp.suffix === '390px') {
        await page.screenshot({
          path: path.join(screenshotsDir, `alert_dossier_${vp.suffix}.png`),
          fullPage: true,
        });
      }
    });
  }
});
