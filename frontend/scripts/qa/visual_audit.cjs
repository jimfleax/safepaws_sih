const { chromium } = require('playwright');
const fs = require('fs');

const URLS = {
  public: [
    '/',
    '/scan',
    '/community',
    '/sightings/new'
  ],
  protected: [
    '/dashboard',
    '/setup-profile',
    '/pets/new',
    '/lost'
  ]
};

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 }
];

(async () => {
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  const browser = await chromium.launch({ headless: true });
  
  for (const viewport of VIEWPORTS) {
    console.log(`\n--- Capturing ${viewport.name} (${viewport.width}x${viewport.height}) ---`);
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height }
    });
    const page = await context.newPage();

    // 1. Capture Public Routes
    for (const route of URLS.public) {
      const name = route === '/' ? 'home' : route.replace(/\//g, '_');
      console.log(`Visiting public ${route}...`);
      await page.goto(`http://localhost:3000${route}`);
      await page.waitForLoadState('networkidle');
      // Hide any potential infinite animations for screenshot

      await page.waitForTimeout(1500);
      await page.screenshot({ path: `screenshots/${viewport.name}${name}.png`, fullPage: true });
    }

    // 2. Perform Dev Login
    console.log(`Performing dev login for protected routes...`);
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    const loginBtn = page.locator('button', { hasText: 'Development Sign In' }).first();
    if (await loginBtn.isVisible()) {
      await loginBtn.click();
      await page.waitForTimeout(2000); // Wait for auth hydration
      await page.waitForLoadState('networkidle');
    } else {
      console.log("Could not find dev sign in button!");
    }

    // 3. Capture Protected Routes
    for (const route of URLS.protected) {
      const name = route.replace(/\//g, '_');
      console.log(`Visiting protected ${route}...`);
      await page.goto(`http://localhost:3000${route}`);
      await page.waitForLoadState('networkidle');

      await page.waitForTimeout(1500); 
      await page.screenshot({ path: `screenshots/${viewport.name}${name}.png`, fullPage: true });
    }

    await context.close();
  }

  await browser.close();
  console.log("Done taking screenshots.");
})();
