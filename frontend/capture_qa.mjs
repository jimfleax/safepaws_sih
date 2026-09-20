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
  const browser = await chromium.launch();
  
  const authState = JSON.stringify({
    state: {
      user: {
        id: "test",
        email: "test@example.com",
        name: "Test",
        picture: "",
        profileCompleted: true
      },
      isAuthenticated: true
    },
    version: 0
  });

  // Desktop
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  
  // Inject auth
  await desktopContext.addInitScript(state => {
    window.localStorage.setItem('safepaws-auth', state);
  }, authState);
  
  const desktopPage = await desktopContext.newPage();

  // Mobile
  const mobileContext = await browser.newContext({
    ...devices['iPhone 12']
  });
  
  await mobileContext.addInitScript(state => {
    window.localStorage.setItem('safepaws-auth', state);
  }, authState);
  
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
