import { test, expect, chromium } from '@playwright/test';
import path from 'path';

(async () => {
  console.log("Starting REAL SafePaws E2E Browser Journey...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 1. Home
    console.log("-> Navigating to Home");
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    const title = await page.title();
    console.log(`   Page loaded: ${title}`);
    
    // 2. Setup Profile (we skip directly to register if that's the flow, let's see how the UI goes)
    console.log("-> Clicking 'Register Pet' / 'Get Started'");
    const getStartedBtn = page.getByText(/Get Started/i).first();
    await getStartedBtn.click();
    await page.waitForLoadState('networkidle');
    
    // Wait for the path to be either /setup-profile or /pets/new
    const currentPath = new URL(page.url()).pathname;
    console.log(`   Current path: ${currentPath}`);
    
    if (currentPath === '/setup-profile') {
      console.log("-> In Setup Profile");
      await page.fill('input[placeholder="Your Full Name"]', 'John Doe');
      await page.fill('input[placeholder="Phone Number"]', '555-1234');
      await page.click('button:has-text("Continue")');
      await page.waitForLoadState('networkidle');
    }
    
    // 3. Create Pet
    console.log("-> Creating Pet Profile");
    await page.fill('input[name="name"]', 'Buddy E2E');
    await page.fill('input[name="breed"]', 'Golden Retriever');
    await page.click('button:has-text("Continue to Photos")');
    
    // Wait for file upload area
    console.log("-> Uploading Real Image");
    const testImage = path.resolve('real_dog.jpg');
    // Ensure we have a file chooser
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.click('.border-dashed') // Click upload zone
    ]);
    await fileChooser.setFiles(testImage);
    
    // Wait for upload and analysis
    console.log("-> Enrolling Biometrics...");
    // Button might say "Analyze & Enroll" or "Create Profile"
    const enrollBtn = page.getByRole('button', { name: /Complete Profile|Enroll/i });
    await enrollBtn.waitFor({ state: 'visible', timeout: 5000 });
    await enrollBtn.click();
    
    // 4. Pet Profile
    console.log("-> Waiting for redirection to Pet Profile");
    await page.waitForURL(/\/pets\/pet-.+/, { timeout: 15000 });
    console.log(`   Arrived at: ${page.url()}`);
    
    // Extract petId
    const petUrl = new URL(page.url());
    const petId = petUrl.pathname.split('/').pop();
    console.log(`   Pet ID extracted: ${petId}`);
    
    // Validate text on page
    await expect(page.getByText('Buddy E2E')).toBeVisible();
    
    // 5. Lost Alert & Community flow
    // First, let's mark it as LOST
    console.log("-> Reporting Lost Alert");
    await page.click('button:has-text("Report Lost")');
    await page.waitForURL(/\/lost\/.+/);
    await page.fill('input[placeholder="Where were they last seen?"]', 'Central Park, NYC');
    await page.click('button:has-text("Broadcast Alert")');
    await page.waitForLoadState('networkidle');
    
    console.log("-> Navigating to Community");
    await page.goto('http://localhost:3000/community');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Buddy E2E')).toBeVisible();
    
    // 6. Report Sighting on that alert
    console.log("-> Opening Alert Detail & Adding Sighting");
    // Find the alert card and click it
    await page.click('text=Buddy E2E'); // Assuming the card is clickable
    await page.waitForLoadState('networkidle');
    // Might need to navigate specifically if click isn't perfectly mapped
    if (!page.url().includes('/alerts/')) {
       console.log("   Click didn't navigate, looking for View Details button...");
       await page.click('button:has-text("View")');
       await page.waitForLoadState('networkidle');
    }
    
    console.log("-> Adding sighting from alert page");
    await page.fill('input[name="reporterName"]', 'Good Samaritan');
    await page.fill('input[name="location"]', 'Near the fountain');
    await page.click('button:has-text("Submit Sighting")');
    await page.waitForLoadState('networkidle');
    
    // 7. Scan Flow
    console.log("-> Testing Scan Flow");
    await page.goto('http://localhost:3000/scan');
    await page.waitForLoadState('networkidle');
    
    const [scanFileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.click('button:has-text("Upload Photo")')
    ]);
    await scanFileChooser.setFiles(testImage);
    
    // Wait for the scan to hit the real backend and return a match
    console.log("   Waiting for backend vector match...");
    await page.waitForURL(/\/p\/.+/, { timeout: 20000 });
    console.log(`   Scan identified tag and redirected: ${page.url()}`);
    
    // Validate we matched Buddy E2E
    await expect(page.getByText('Buddy E2E')).toBeVisible();
    
    // 8. Mark Found
    console.log("-> Returning to dashboard to mark found");
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("Mark Found")');
    await page.waitForLoadState('networkidle');
    
    // Refresh to confirm server state persisted
    console.log("-> Refreshing to verify persistent state");
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.getByText('Mark Found')).toBeHidden(); // Should not have a lost button state anymore
    
    console.log("\n====================================");
    console.log("✅ ALL REAL FLOWS PASSED SUCCESSFULLY");
    console.log("====================================\n");
    
  } catch (error) {
    console.error("\n❌ TEST FAILED:", error.message);
  } finally {
    await browser.close();
  }
})();
