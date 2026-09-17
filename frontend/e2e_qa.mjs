import { chromium } from '@playwright/test';

async function runQA() {
  console.log('Starting Complete Journey QA...');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  
  const errors = [];
  page.on('pageerror', error => {
    console.error(`Page Error: ${error.message}`);
    errors.push(error.message);
  });

  // Inject Auth State
  const authState = JSON.stringify({
    state: { 
      user: { id: "test", email: "test@example.com", name: "Test User", profileCompleted: true }, 
      isAuthenticated: true 
    },
    version: 0
  });
  await context.addInitScript(state => window.localStorage.setItem('safepaws-auth', state), authState);

  const journey = [
    { name: 'Home', path: '/' },
    { name: 'Setup Profile', path: '/setup-profile' },
    { name: 'New Pet', path: '/pets/new' },
    { name: 'Scan', path: '/scan' },
    { name: 'Community', path: '/community' },
    { name: 'Report Sighting', path: '/sightings/new' },
    { name: 'Lost Alert', path: '/lost' },
    { name: 'Report Lost', path: '/lost/new' },
    { name: 'Public Profile', path: '/p/test-tag' }
  ];

  try {
    for (const step of journey) {
      console.log(`Navigating to ${step.name} (${step.path})...`);
      const response = await page.goto(`http://localhost:3001${step.path}`, { waitUntil: 'networkidle' });
      
      if (!response || !response.ok()) {
         console.log(`  [FAIL] ${step.name} returned status ${response?.status()}`);
         errors.push(`${step.name} failed to load`);
         continue;
      }

      await page.waitForTimeout(1000); // Allow react rendering

      // Check for generic error boundaries or crash text
      const crashText = await page.evaluate(() => document.body.innerText.includes('Application Error') || document.body.innerText.includes('Unhandled Rejection'));
      if (crashText) {
         console.log(`  [FAIL] ${step.name} crashed during render.`);
         errors.push(`${step.name} crashed`);
      } else {
         console.log(`  [PASS] ${step.name} rendered cleanly.`);
      }
    }

    console.log('\n--- QA SUMMARY ---');
    console.log(`Total JS Errors caught: ${errors.length}`);
    if (errors.length > 0) console.log(errors);

  } catch (err) {
    console.error('QA Failed critically:', err);
  } finally {
    await browser.close();
  }
}

runQA();
