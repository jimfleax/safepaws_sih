import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testMatch: ['audit.spec.ts', 'e2e/public_routes.spec.ts', 'e2e/test_sighting.spec.ts', 'e2e/multi_viewport_a11y.spec.ts', 'e2e/capture_visual_evidence.spec.ts', 'e2e/capture_ux_06_3_evidence.spec.ts', 'e2e/ux_06_3_responsive_assertions.spec.ts', 'e2e/ux_06_4_scanner_evidence.spec.ts', 'e2e/ux_06_5_touch_targets.spec.ts', 'e2e/ux_06_5_phase_2a_community.spec.ts', 'e2e/ux_06_5_phase_2b_lost.spec.ts', 'e2e/ux_06_5_phase_2c_sightings_and_resolution.spec.ts', 'e2e/ux_06_6_e2e_lifecycle.spec.ts', 'e2e/creative_showcase_evidence.spec.ts'],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },
  webServer: [
    {
      command: 'USE_SQLITE_DEV=True .venv/bin/uvicorn app.main:app --port 8000',
      cwd: '../backend',
      port: 8000,
      reuseExistingServer: true,
      timeout: 15000,
    },
    {
      command: 'npx vite preview --port 3002',
      port: 3002,
      reuseExistingServer: true,
      timeout: 15000,
    }
  ],
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        launchOptions: {
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
        },
      },
    }
  ],
});
