import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testMatch: ['audit.spec.ts', 'e2e/public_routes.spec.ts', 'e2e/test_sighting.spec.ts'],
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
