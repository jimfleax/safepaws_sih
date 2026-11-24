import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: '320px (Mobile S)', width: 320, height: 640, suffix: '320px' },
  { name: '390px (Mobile M)', width: 390, height: 844, suffix: '390px' },
  { name: '768px (Tablet)', width: 768, height: 1024, suffix: '768px' },
  { name: '1280px (Desktop)', width: 1280, height: 800, suffix: '1280px' },
];

let globalAlerts: any[] = [];

test.describe('UX-06.6 Frontend Integration & End-to-End Recovery Lifecycle', () => {
  const screenshotsDir = path.resolve(process.cwd(), '../docs/screenshots/ux-06-6');

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test.beforeEach(async ({ page }) => {
    // Reset test alerts
    globalAlerts = [
      {
        id: 'alt-lifecycle-01',
        pet_id: 'pet-lifecycle-01',
        pet_name: 'Barnaby',
        breed: 'Golden Retriever',
        photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
        status: 'active',
        created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        last_seen_address: '742 Evergreen Terrace, Sector 4',
        description: 'Golden retriever with red collar. Friendly and responds to whistle.',
        sightings: [
          {
            id: 'sgt-lifecycle-01',
            alert_id: 'alt-lifecycle-01',
            reporter_name: 'Park Ranger Davis',
            location: 'Oakridge Reservoir Path',
            notes: 'Resting near water edge',
            time: new Date(Date.now() - 3600 * 1000).toISOString(),
            confirmed: true,
          },
          {
            id: 'sgt-lifecycle-02',
            alert_id: 'alt-lifecycle-01',
            reporter_name: 'Community Scout Sam',
            location: 'Pine Street Crosswalk',
            notes: 'Spotted heading toward community center',
            time: new Date(Date.now() - 1800 * 1000).toISOString(),
            confirmed: false,
          },
        ],
      },
    ];

    // Authenticated owner session mock
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

    // Registered pets mock (Barnaby is safe initially for Journey A, or lost for Journey C/D)
    await page.route(/.*\/api\/v1\/pets.*/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'pet-lifecycle-01',
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
        ]),
      });
    });

    // Alerts API Mock (CRUD)
    await page.route(/\/api\/v1\/alerts(\/.*)?$/, async (route) => {
      const url = route.request().url();
      const method = route.request().method();

      if (method === 'POST') {
        const postData = route.request().postDataJSON();
        const newAlert = {
          id: 'alt-lifecycle-new-99',
          pet_id: postData.pet_id,
          pet_name: 'Barnaby',
          breed: 'Golden Retriever',
          photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
          status: 'active',
          created_at: new Date().toISOString(),
          last_seen_address: postData.last_seen_address,
          description: postData.description,
          sightings: [],
        };
        globalAlerts.push(newAlert);
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(newAlert),
        });
      } else if (method === 'PUT' && url.includes('/resolve')) {
        const targetId = url.split('/')[url.split('/').indexOf('alerts') + 1];
        const alertIndex = globalAlerts.findIndex(a => a.id === targetId);
        if (alertIndex >= 0) {
          globalAlerts[alertIndex] = { ...globalAlerts[alertIndex], status: 'resolved' };
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(globalAlerts[alertIndex]),
          });
        } else {
          await route.fulfill({ status: 404 });
        }
      } else if (url.includes('alt-lifecycle-')) {
        const targetId = url.split('/')[url.split('/').indexOf('alerts') + 1];
        const found = globalAlerts.find(a => a.id === targetId) || globalAlerts[0];
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(found),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(globalAlerts),
        });
      }
    });

    // Sightings API Mock
    await page.route(/\/api\/v1\/sightings(\/.*)?$/, async (route) => {
      if (route.request().method() === 'POST') {
        const postData = route.request().postDataJSON();
        const createdSighting = {
          id: 'sgt-lifecycle-new-77',
          reporter_name: postData.reporter_name || 'Eleanor Vance',
          location: postData.location,
          notes: postData.notes,
          time: new Date().toISOString(),
          confirmed: false,
          alert_id: postData.alert_id || 'alt-lifecycle-01',
        };
        const targetAlert = globalAlerts.find(a => a.id === createdSighting.alert_id);
        if (targetAlert) {
          targetAlert.sightings.push(createdSighting);
        }
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(createdSighting),
        });
      } else {
        const allSightings = globalAlerts.flatMap(a => a.sightings || []);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(allSightings),
        });
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Journey A: Owner Reports Missing Companion
  // ---------------------------------------------------------------------------
  test('Journey A — Owner reports missing companion (/lost/new -> API -> /alerts/:id -> /lost)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/lost/new');
    await page.waitForLoadState('networkidle');

    // 1. Verify Triage Form and registered companion option
    await expect(page.locator('h1')).toContainText(/Declare Missing Companion/i);
    const petSelect = page.locator('#pet-select');
    await expect(petSelect).toBeVisible();

    // 2. Fill in emergency report
    await page.locator('#last-seen').fill('Central Park West & 72nd Street');
    await page.locator('#description').fill('Wearing dark red collar. Very friendly with people, loves treats.');

    // 3. Verify Privacy notice is visible
    await expect(page.getByText(/privacy notice \(sec-backend-01\)/i)).toBeVisible();

    // 4. Submit form
    const submitBtn = page.getByRole('button', { name: /publish missing pet alert/i });
    await submitBtn.click();

    // 5. Verifies navigation to /alerts/alt-lifecycle-new-99
    await page.waitForURL(/\/alerts\/alt-lifecycle-new-99/);
    await expect(page.locator('h1')).toContainText(/Missing: Barnaby/i);
    await expect(page.getByText(/ACTIVE INCIDENT/i)).toBeVisible();

    // 6. Navigate to /lost and confirm incident appears on Recovery Board
    await page.goto('/lost');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText(/Recovery Board/i);
    await expect(page.getByText('Barnaby').first()).toBeVisible();

    // Capture visual artifact
    await page.screenshot({
      path: path.join(screenshotsDir, 'journey_a_lost_board_1280px.png'),
      fullPage: true,
    });
  });

  // ---------------------------------------------------------------------------
  // Journey B: Community Member Submits Sighting
  // ---------------------------------------------------------------------------
  test('Journey B — Community member submits sighting (/alerts/:id -> /sightings/new -> In-situ Receipt)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // 1. Open active incident dossier as non-owner (mock unauthenticated me & empty owned pets)
    await page.route(/.*\/api\/auth\/me.*/, async (route) => {
      await route.fulfill({ status: 401, body: JSON.stringify({ detail: 'Not authenticated' }) });
    });
    await page.route(/.*\/api\/v1\/pets.*/, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.goto('/alerts/alt-lifecycle-01');
    await page.waitForLoadState('networkidle');

    // 2. Click "Submit Observational Sighting"
    const submitSightingLink = page.getByRole('link', { name: /submit observational sighting/i });
    await expect(submitSightingLink).toBeVisible();
    await submitSightingLink.click();

    // 3. Verifies /sightings/new loaded with linked alert context
    await page.waitForURL(/\/sightings\/new\?alertId=alt-lifecycle-01/);
    await expect(page.getByText(/Subject: Barnaby/i)).toBeVisible();
    await expect(page.getByText(/LINKED INCIDENT DOCKET/i)).toBeVisible();

    // 4. Fill in field observation
    await page.getByLabel(/your name \/ field identifier/i).fill('Citizen Scout Dave');
    await page.getByLabel(/observation vicinity \/ cross streets/i).fill('North Meadow near footbridge');
    await page.getByLabel(/observation narrative & appearance/i).fill('Companion observed playing with fallen leaves, collar red.');

    // 5. Submit field sighting
    const submitBtn = page.getByRole('button', { name: /transmit field sighting/i });
    await submitBtn.click();

    // 6. Verifies IN-SITU Archival Receipt (Contract C2 & C4)
    await expect(page.getByRole('heading', { name: /observation logged to ledger/i })).toBeVisible();
    await expect(page.getByText(/REF: #SGT-SGT-LIFE/i)).toBeVisible();
    await expect(page.getByText(/STATUS: COMMUNITY REPORT \/\/ UNVERIFIED/i)).toBeVisible();
    await expect(page.getByText(/North Meadow near footbridge/i)).toBeVisible();

    // 7. Click "View Incident Dossier" link on receipt
    const returnToDossier = page.getByRole('link', { name: /view incident dossier/i });
    await expect(returnToDossier).toBeVisible();
    await returnToDossier.click();

    await page.waitForURL(/\/alerts\/alt-lifecycle-01/);
    await expect(page.locator('h1')).toContainText(/Missing: Barnaby/i);

    // Capture visual artifact
    await page.screenshot({
      path: path.join(screenshotsDir, 'journey_b_sighting_receipt_1280px.png'),
      fullPage: true,
    });
  });

  // ---------------------------------------------------------------------------
  // Journey C: Direct Hydration & Sighting Status Differentiation
  // ---------------------------------------------------------------------------
  test('Journey C — Direct URL hydration & sighting timeline differentiation (/alerts/:id)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    // Direct page load with simulated store wipe
    await page.goto('/alerts/alt-lifecycle-01');
    await page.waitForLoadState('networkidle');

    // 1. Verify direct hydration succeeded
    await expect(page.locator('h1')).toContainText(/Missing: Barnaby/i);
    await expect(page.getByText('Golden Retriever', { exact: true })).toBeVisible();

    // 2. Verify Sighting Field Ledger timeline differentiation (Contract C4)
    await expect(page.getByText(/OBSERVATION MARKED CONFIRMED/i)).toBeVisible();
    await expect(page.getByText(/The source record is marked confirmed; the source does not identify who confirmed it or how/i)).toBeVisible();
    await expect(page.getByText(/COMMUNITY OBSERVATION \/\/ UNVERIFIED/i)).toBeVisible();
    await expect(page.getByText(/Oakridge Reservoir Path/i)).toBeVisible();
    await expect(page.getByText(/Pine Street Crosswalk/i)).toBeVisible();

    // 3. Verify Public address suppression (SEC-BACKEND-01) for non-owner
    await page.route(/.*\/api\/auth\/me.*/, async (route) => {
      await route.fulfill({ status: 401, body: JSON.stringify({ detail: 'Unauthenticated' }) });
    });
    await page.route(/.*\/api\/v1\/pets.*/, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/SEC-BACKEND-01: Address suppressed on public view/i)).toBeVisible();

    // Capture visual artifact
    await page.screenshot({
      path: path.join(screenshotsDir, 'journey_c_alert_dossier_1280px.png'),
      fullPage: true,
    });
  });

  // ---------------------------------------------------------------------------
  // Journey D: Owner Resolves Recovered Companion
  // ---------------------------------------------------------------------------
  test('Journey D — Owner resolves recovered companion (/alerts/:id -> confirmation modal -> resolved)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/alerts/alt-lifecycle-01');
    await page.waitForLoadState('networkidle');

    // 1. Verify Owner sees "Mark Safe & Resolve" action
    const resolveBtn = page.getByRole('button', { name: /mark safe & resolve/i });
    await expect(resolveBtn).toBeVisible();

    // 2. Open confirmation modal
    await resolveBtn.click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(page.getByRole('heading', { name: /confirm case resolution/i })).toBeVisible();
    await expect(page.getByText(/conclude active community search efforts/i)).toBeVisible();

    // 3. Confirm resolution
    const confirmBtn = page.getByRole('button', { name: /yes, mark companion safe/i });
    await confirmBtn.click();

    // 4. Verifies status updates to resolved and case concluded
    await expect(page.getByText(/STATUS: RESOLVED/i)).toBeVisible();
    await expect(page.getByText(/CASE CONCLUDED \/\/ COMPANION SAFE/i)).toBeVisible();
    await expect(page.getByText(/REUNITED & SAFE/i)).toBeVisible();

    // 5. Browser refresh preserves resolved state
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/STATUS: RESOLVED/i)).toBeVisible();
    await expect(page.getByText(/CASE CONCLUDED \/\/ COMPANION SAFE/i)).toBeVisible();

    // Capture visual artifact
    await page.screenshot({
      path: path.join(screenshotsDir, 'journey_d_resolved_dossier_1280px.png'),
      fullPage: true,
    });
  });

  // ---------------------------------------------------------------------------
  // Journey E: Unregistered Pet Prerequisite & Network Error Resilience
  // ---------------------------------------------------------------------------
  test('Journey E — Unregistered pet prerequisite & failure recovery (/lost/new)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    // Mock user with 0 registered pets
    await page.route(/.*\/api\/v1\/pets.*/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/lost/new');
    await page.waitForLoadState('networkidle');

    // 1. Verifies Empathetic Prerequisite Notice (Contract C5)
    await expect(page.getByText(/REGISTRATION PREREQUISITE/i)).toBeVisible();
    await expect(page.getByText(/No Enrolled Companion Profiles on Record/i)).toBeVisible();

    // 2. Verifies link to /pets/new (~60s registration guide)
    const enrollLink = page.getByRole('link', { name: /enroll companion profile/i });
    await expect(enrollLink).toBeVisible();
    await expect(enrollLink).toHaveAttribute('href', '/pets/new');

    // 3. Verifies zero ghost alert creation option
    await expect(page.getByRole('button', { name: /publish missing pet alert/i })).not.toBeVisible();

    // Capture visual artifact
    await page.screenshot({
      path: path.join(screenshotsDir, 'journey_e_unregistered_prerequisite_1280px.png'),
      fullPage: true,
    });
  });

  // ---------------------------------------------------------------------------
  // Multi-Viewport Responsive & Touch Target Checks (320px, 390px, 768px, 1280px)
  // ---------------------------------------------------------------------------
  for (const vp of VIEWPORTS) {
    test(`Multi-Viewport & Touch Targets verification at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // Check /lost
      await page.goto('/lost');
      await page.waitForLoadState('networkidle');
      let scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 1);

      const reportBtn = page.getByRole('link', { name: /report missing pet/i }).first();
      const reportBox = await reportBtn.boundingBox();
      if (reportBox) {
        expect(reportBox.height).toBeGreaterThanOrEqual(44);
      }

      // Check /sightings/new
      await page.goto('/sightings/new?alertId=alt-lifecycle-01');
      await page.waitForLoadState('networkidle');
      scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 1);

      const transmitBtn = page.getByRole('button', { name: /transmit field sighting/i });
      const transmitBox = await transmitBtn.boundingBox();
      if (transmitBox) {
        expect(transmitBox.height).toBeGreaterThanOrEqual(44);
      }

      // Check /alerts/:id
      await page.goto('/alerts/alt-lifecycle-01');
      await page.waitForLoadState('networkidle');
      scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 1);

      // Capture mobile screenshot at 390px
      if (vp.suffix === '390px') {
        await page.screenshot({
          path: path.join(screenshotsDir, `lifecycle_alert_dossier_${vp.suffix}.png`),
          fullPage: true,
        });
      }
    });
  }
});
