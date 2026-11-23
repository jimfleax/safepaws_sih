import { test, expect } from '@playwright/test';

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
  email: 'marcus@safepaws.app',
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
  photo_url: '',
  status: 'safe',
  qr_tag_id: 'TAG-BARNABY-01',
  distinctive_features: ['White chest blaze', 'Floppy ears'],
  medical_notes: 'Sensitive stomach, grain-free diet only',
  share_medical_notes: true,
  owner_name: 'Elena Rostova',
  neighborhood: 'Oakridge Park',
};

const VIEWPORTS = [
  { name: '320px (Ultra-compact mobile)', width: 320, height: 568 },
  { name: '390px (Modern mobile)', width: 390, height: 844 },
  { name: '768px (Tablet portrait)', width: 768, height: 1024 },
  { name: '1024px (Small desktop/tablet landscape)', width: 1024, height: 768 },
  { name: '1440px (Standard desktop)', width: 1440, height: 900 },
  { name: '1920px (Ultra-wide desktop)', width: 1920, height: 1080 },
];

test.describe('UX-06.3 Five-Surface Responsive Assertions Suite', () => {
  for (const vp of VIEWPORTS) {
    test.describe(`Viewport: ${vp.name}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });

        // Default mock APIs
        await page.route('**/api/auth/me', async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ user: mockUserAuthenticated }),
          });
        });

        await page.route('**/api/v1/pets**', async (route) => {
          if (route.request().url().includes('/api/v1/pets/pet-001')) {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify(mockPet),
            });
          } else if (route.request().url().includes('/api/v1/pets/tag/TAG-BARNABY-01')) {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify(mockPet),
            });
          } else {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify([mockPet]),
            });
          }
        });

        await page.route('**/api/v1/alerts**', async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
          });
        });

        await page.route('**/api/v1/sightings**', async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
          });
        });
      });

      // Surface 1: /setup-profile
      test(`Surface 1: /setup-profile conforms at ${vp.width}px`, async ({ page }) => {
        await page.route('**/api/auth/me', async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ user: mockUserUncompleted }),
          });
        });

        await page.goto('/setup-profile');
        const main = page.locator('main#main-content');
        await expect(main).toBeVisible();

        const h1 = page.locator('h1');
        await expect(h1).toHaveText(/Operational Zone/i);

        const detectBtn = page.getByRole('button', { name: /Detect Approximate Zone/i });
        await expect(detectBtn).toBeVisible();

        const manualBtn = page.getByRole('button', { name: /Enter Neighborhood Manually/i });
        await expect(manualBtn).toBeVisible();

        // Step transition test
        await manualBtn.click();
        await expect(page.locator('h1')).toHaveText(/Emergency Contact/i);
        await expect(page.locator('#setup-phone')).toBeVisible();
        await expect(page.locator('#setup-neighborhood')).toBeVisible();
      });

      // Surface 2: /dashboard
      test(`Surface 2: /dashboard conforms at ${vp.width}px`, async ({ page }) => {
        await page.goto('/dashboard');
        const main = page.locator('main#main-content');
        await expect(main).toBeVisible();

        await expect(page.locator('h1')).toHaveText(/Console/i);
        await expect(page.getByRole('heading', { name: 'Barnaby' })).toBeVisible();
        await expect(page.getByText('TAG-BARNABY-01')).toBeVisible();
        await expect(page.getByText(/Golden Retriever/i)).toBeVisible();

        // Header add pet CTA must be accessible
        const addBtn = page.getByRole('link', { name: /Add Pet/i });
        await expect(addBtn).toBeVisible();
      });

      // Surface 3: /pets/new
      test(`Surface 3: /pets/new conforms at ${vp.width}px`, async ({ page }) => {
        await page.goto('/pets/new');
        const main = page.locator('main#main-content');
        await expect(main).toBeVisible();

        await expect(page.locator('h1')).toHaveText(/Companion Enrollment/i);
        await expect(page.locator('#pet-name')).toBeVisible();
        await expect(page.locator('#pet-breed')).toBeVisible();

        const backLink = page.getByRole('link', { name: /Back to Console/i });
        await expect(backLink).toBeVisible();
      });

      // Surface 4: /pets/:petId
      test(`Surface 4: /pets/:petId conforms at ${vp.width}px`, async ({ page }) => {
        await page.goto('/pets/pet-001');
        const main = page.locator('main#main-content');
        await expect(main).toBeVisible();

        await expect(page.locator('h1')).toHaveText('Barnaby');
        await expect(page.getByText(/Biometric Signature Indexed/i)).toBeVisible();
        await expect(page.getByRole('heading', { name: /Record Details/i })).toBeVisible();

        const qrBtn = page.getByRole('button', { name: /View Smart Collar QR Tag/i });
        await expect(qrBtn).toBeVisible();
      });

      // Surface 5: /p/:tagId
      test(`Surface 5: /p/:tagId conforms at ${vp.width}px`, async ({ page }) => {
        await page.goto('/p/TAG-BARNABY-01');
        const main = page.locator('main#main-content');
        await expect(main).toBeVisible();

        await expect(page.locator('h1')).toHaveText(/I am Barnaby/i);
        await expect(page.getByText(/Guardian Contact Protected/i)).toBeVisible();
        await expect(page.getByRole('button', { name: /Send Location Ping/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /File Sighting Report/i })).toBeVisible();
      });
    });
  }
});
