import { chromium } from 'playwright';

async function verifyFullStack() {
  console.log('Starting Real Full-Stack Verification...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ permissions: ['geolocation'] });
  const page = await context.newPage();
  
  const networkRequests = [];
  const errors = [];
  
  page.on('request', request => {
    if (request.url().includes('/api/v1/')) {
      networkRequests.push(`${request.method()} ${request.url()}`);
    }
  });
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(`Console: ${msg.text()}`);
  });

  try {
    console.log('1. Home (Logged Out)');
    await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
    
    console.log('2. Trigger Register / Google Login Trigger');
    await page.click('button:has-text("REGISTER YOUR PET")');
    await page.waitForTimeout(1000);
    
    // Simulate successful Google Login by injecting auth state
    const authState = JSON.stringify({
      state: { user: { id: "test-user-id", email: "test@example.com", name: "Playwright User", profileCompleted: true }, isAuthenticated: true },
      version: 0
    });
    await page.evaluate((state) => window.localStorage.setItem('safepaws-auth', state), authState);
    await page.goto('http://localhost:3001/setup-profile', { waitUntil: 'networkidle' });
    
    console.log('3. Registering Pet (Stage A + B)');
    await page.goto('http://localhost:3001/pets/new', { waitUntil: 'networkidle' });
    await page.fill('input[placeholder="e.g. Olive"]', 'QA Dog');
    await page.fill('input[placeholder="e.g. Golden Retriever"]', 'Test Breed');
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);
    await page.setInputFiles('input[type="file"]', '../real_dog.jpg');
    await page.waitForTimeout(1000); // wait for objectURL
    await page.click('button:has-text("Enroll Biometric Record")');
    await page.waitForTimeout(5000); // wait for upload to finish
    await page.click('button:has-text("Confirm")');
    await page.waitForTimeout(1000); 
    await page.click('button:has-text("View Pet Profile")');
    
    // Wait for Pet Profile redirection and network to settle
    await page.waitForURL('**/pets/*', { timeout: 10000 });
    console.log('   -> Successfully reached Pet Profile (Pet Created)');
    await page.waitForTimeout(1000);

    console.log('4. Checking Community Portal');
    await page.goto('http://localhost:3001/community', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    console.log('5. Create Lost Alert');
    await page.goto('http://localhost:3001/lost/new', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    // Find the pet selection button (if QA Dog is in the list)
    await page.selectOption('select#pet-select', { label: 'QA Dog (Test Breed)' }).catch(() => console.log('Could not find QA Dog option'));
    // Fill form
    await page.fill('input[placeholder*="Central Park"]', 'Test Location');
    await page.fill('textarea[placeholder*="red collar"]', 'Test Details');
    await page.click('button:has-text("Trigger Alert Now")');
    await page.waitForTimeout(2000);

    console.log('6. Report Sighting');
    await page.goto('http://localhost:3001/sightings/new', { waitUntil: 'networkidle' });
    await page.fill('input[placeholder*="Where did you see"]', 'Found here');
    await page.fill('textarea[placeholder*="Describe what you saw"]', 'Looked like QA Dog');
    await page.click('button:has-text("Submit Sighting")');
    await page.waitForTimeout(2000);

    console.log('7. Verify Community Portal stats again');
    await page.goto('http://localhost:3000/community', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    console.log('\n--- NETWORK TRACE ---');
    console.log(networkRequests.join('\n'));

    console.log('\n--- ERRORS ---');
    if (errors.length > 0) {
      console.log(errors.join('\n'));
    } else {
      console.log('No Errors! :)');
    }
  } catch (err) {
    console.error('QA Script Error:', err);
    console.log('\n--- NETWORK TRACE (ON ERROR) ---');
    console.log(networkRequests.join('\n'));
    console.log('\n--- ERRORS (ON ERROR) ---');
    console.log(errors.join('\n'));
  } finally {
    await browser.close();
  }
}

verifyFullStack();
