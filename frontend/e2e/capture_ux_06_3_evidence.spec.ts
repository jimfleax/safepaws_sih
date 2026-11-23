import { test } from '@playwright/test';

const mockUserAuthenticated = {
  id: 'user-001',
  email: 'elena@safepaws.app',
  name: 'Elena Rostova',
  picture: '',
  profileCompleted: true,
  phone: '+1 (555) 234-5678',
  neighborhood: 'Oakridge Park',
};

const mockUserUncompleted = {
  id: 'user-002',
  email: 'newguardian@safepaws.app',
  name: 'Marcus Vance',
  picture: '',
  profileCompleted: false,
};

const mockPet = {
  id: 'pet-001',
  name: 'Barnaby',
  species: 'dog',
  breed: 'Golden Retriever',
  color: 'Honey Gold',
  age: '4',
  weight: '32',
  photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
  status: 'safe',
  qr_tag_id: 'TAG-BARNABY-01',
  distinctive_features: ['White chest blaze', 'Floppy ears'],
  medical_notes: 'Sensitive stomach, grain-free diet only',
  share_medical_notes: true,
  owner_name: 'Elena Rostova',
  neighborhood: 'Oakridge Park',
};

test.describe('Capture Visual Evidence for UX-06.3 Owner & Pet Transformation', () => {
  test('Capture Desktop (1440x900) Across 5 Surfaces', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // Surface 1: Setup Profile (Uncompleted profile user)
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: mockUserUncompleted }),
      });
    });
    await page.goto('/setup-profile');
    await page.waitForTimeout(600);
    await page.screenshot({ path: '../docs/screenshots/ux-06-3/setup_profile_desktop.png', fullPage: false });

    // Setup routes for Authenticated Guardians
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: mockUserAuthenticated }),
      });
    });

    await page.route('**/api/v1/pets', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([mockPet]),
      });
    });

    await page.route('**/api/v1/alerts', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route('**/api/v1/sightings', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route('**/api/v1/pets/pet-001', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPet),
      });
    });

    await page.route('**/api/v1/pets/tag/TAG-BARNABY-01', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPet),
      });
    });

    // Surface 2: Dashboard
    await page.goto('/dashboard');
    await page.waitForTimeout(600);
    await page.screenshot({ path: '../docs/screenshots/ux-06-3/dashboard_desktop.png', fullPage: false });

    // Surface 3: New Pet Registration
    await page.goto('/pets/new');
    await page.waitForTimeout(600);
    await page.screenshot({ path: '../docs/screenshots/ux-06-3/new_pet_desktop.png', fullPage: false });

    // Surface 4: Pet Detail Dossier
    await page.goto('/pets/pet-001');
    await page.waitForTimeout(600);
    await page.screenshot({ path: '../docs/screenshots/ux-06-3/pet_detail_desktop.png', fullPage: false });

    // Surface 5: Public Collar Tag Profile
    await page.goto('/p/TAG-BARNABY-01');
    await page.waitForTimeout(600);
    await page.screenshot({ path: '../docs/screenshots/ux-06-3/public_tag_desktop.png', fullPage: false });
  });

  test('Capture Mobile (390x844) Across 5 Surfaces', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    // Surface 1: Setup Profile (Uncompleted profile user)
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: mockUserUncompleted }),
      });
    });
    await page.goto('/setup-profile');
    await page.waitForTimeout(600);
    await page.screenshot({ path: '../docs/screenshots/ux-06-3/setup_profile_mobile.png', fullPage: false });

    // Setup routes for Authenticated Guardians
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: mockUserAuthenticated }),
      });
    });

    await page.route('**/api/v1/pets', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([mockPet]),
      });
    });

    await page.route('**/api/v1/alerts', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route('**/api/v1/sightings', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route('**/api/v1/pets/pet-001', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPet),
      });
    });

    await page.route('**/api/v1/pets/tag/TAG-BARNABY-01', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPet),
      });
    });

    // Surface 2: Dashboard
    await page.goto('/dashboard');
    await page.waitForTimeout(600);
    await page.screenshot({ path: '../docs/screenshots/ux-06-3/dashboard_mobile.png', fullPage: false });

    // Surface 3: New Pet Registration
    await page.goto('/pets/new');
    await page.waitForTimeout(600);
    await page.screenshot({ path: '../docs/screenshots/ux-06-3/new_pet_mobile.png', fullPage: false });

    // Surface 4: Pet Detail Dossier
    await page.goto('/pets/pet-001');
    await page.waitForTimeout(600);
    await page.screenshot({ path: '../docs/screenshots/ux-06-3/pet_detail_mobile.png', fullPage: false });

    // Surface 5: Public Collar Tag Profile
    await page.goto('/p/TAG-BARNABY-01');
    await page.waitForTimeout(600);
    await page.screenshot({ path: '../docs/screenshots/ux-06-3/public_tag_mobile.png', fullPage: false });
  });
});
