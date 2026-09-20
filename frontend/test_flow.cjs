const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  console.log('Navigating to landing page...');
  await page.goto('http://localhost:3002');
  
  console.log('Waiting for EnterScreen to finish (simulating escape)...');
  await page.waitForTimeout(500);
  await page.keyboard.press('Escape');
  
  // Inject auth state to simulate successful Google Login
  console.log('Injecting auth state to bypass Google Login popup...');
  await page.evaluate(() => {
    localStorage.setItem('safepaws-auth', JSON.stringify({
      state: {
        isAuthenticated: true,
        user: {
          id: 'test-id',
          name: 'Test User',
          email: 'test@example.com',
          picture: 'https://via.placeholder.com/40',
          profileCompleted: false
        }
      }
    }));
  });
  
  console.log('Navigating to /setup-profile...');
  await page.goto('http://localhost:3002/setup-profile');
  await page.waitForTimeout(1000);

  if (page.url().includes('setup-profile')) {
    console.log('Filling setup profile...');
    await page.fill('input[type="tel"]', '1234567890');
    await page.fill('input[placeholder="e.g. Oakridge Park"]', 'Test Neighborhood');
    await page.click('button:has-text("Complete Profile")');
    await page.waitForTimeout(2000);
    console.log('Current URL after setup-profile:', page.url());
  }

  // Dashboard / empty state
  if (page.url().includes('dashboard') || page.url() === 'http://localhost:3002/') {
    // Note: since profileCompleted is now true, navigating to / redirects to /dashboard
    if (page.url() === 'http://localhost:3002/') {
        await page.goto('http://localhost:3002/dashboard');
        await page.waitForTimeout(1000);
    }
    console.log('Dashboard empty state... Clicking Register your first pet');
    await page.click('text=Register your first pet');
    await page.waitForTimeout(1000);
    console.log('Current URL after dashboard CTA:', page.url());
  }

  if (page.url().includes('pets/new')) {
    console.log('Filling new pet form (Step 1)...');
    await page.fill('input[placeholder="e.g. Olive"]', 'TestDog');
    await page.fill('input[placeholder="e.g. Golden Retriever"]', 'Labrador');
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(1000);

    console.log('Step 2: Uploading image...');
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('text=Upload Pet Photo');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, 'test_dog.jpg'));

    console.log('Enrolling biometric record...');
    await page.click('text=Enroll Biometric Record');
    await page.waitForTimeout(4000);

    console.log('Confirming...');
    await page.click('text=Confirm');
    await page.waitForTimeout(1000);
    
    console.log('Finalizing...');
    await page.click('text=View Pet Profile');
    await page.waitForTimeout(2000);
    console.log('Current URL after creation:', page.url());
  }

  await browser.close();
})();
