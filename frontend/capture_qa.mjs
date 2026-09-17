import { chromium, devices } from '@playwright/test';
import fs from 'fs';

const BASE_URL = 'http://localhost:3001';

const routes = [
  { path: '/', name: 'home' },
  { path: '/setup-profile', name: 'setup-profile' },
  { path: '/pets/new', name: 'new-pet' },
  { path: '/dashboard', name: 'dashboard' },
  { path: '/community', name: 'community' },
  { path: '/scan', name: 'scan' }
];

async function run() {
  if (!fs.existsSync('./screenshots')) {
    fs.mkdirSync('./screenshots');
  }

  const browser = await chromium.launch();
  
  // Desktop
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const desktopPage = await desktopContext.newPage();

  // Mobile
  const mobileContext = await browser.newContext({
    ...devices['iPhone 12']
  });
  const mobilePage = await mobileContext.newPage();

  for (const route of routes) {
    console.log(`Taking screenshots for ${route.path}...`);
    
    // Desktop
    await desktopPage.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
    await desktopPage.screenshot({ path: `./screenshots/${route.name}-desktop.png`, fullPage: false });

    // Mobile
    await mobilePage.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
    await mobilePage.screenshot({ path: `./screenshots/${route.name}-mobile.png`, fullPage: false });
  }

  await browser.close();
  console.log('Screenshots captured successfully.');
}

run().catch(console.error);
