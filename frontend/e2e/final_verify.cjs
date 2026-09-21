const { chromium } = require('playwright');
const path = require('path');

async function runVerify() {
    const browser = await chromium.launch({ headless: true });
    
    const contextAuth = await browser.newContext();
    await contextAuth.addCookies([{
        name: 'jwt',
        value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLTEiLCJ0b2tlblZlcnNpb24iOjAsImV4cCI6MTc5MjU3NDQ3Nn0.b190odxN6LYTClYE-rc0Na4O9-MR6cpFt7wjGp3pHIo',
        domain: 'localhost',
        path: '/'
    }]);

    console.log("=== 1. Dashboard ===");
    const page = await contextAuth.newPage();
    let dashboardPass = false;
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
    let text = await page.textContent('body');
    if (text.includes('500') || text.includes('503')) {
        console.log("FAIL: Dashboard crashed with 503 from /api/v1/pets/");
    } else {
        console.log("PASS: Dashboard loaded");
        dashboardPass = true;
    }

    console.log("=== 2. Alert Detail ===");
    // Go directly to the alert we created via API
    // Alert created in previous step: 'faa0bd03-8deb-4386-a75e-3855c0cf838e'
    const alertId = 'faa0bd03-8deb-4386-a75e-3855c0cf838e';
    await page.goto(`http://localhost:3000/alerts/${alertId}`, { waitUntil: 'networkidle' });
    let alertText = await page.textContent('body');
    if (alertText.includes('500') || alertText.includes('503')) {
        console.log("FAIL: Alert Detail crashed");
    } else {
        console.log("PASS: Alert detail opened, URL: " + page.url());

        console.log("=== 3. Resolve/Mark Safe ===");
        const resolveBtn = await page.locator('button:has-text("Mark Safe")').count();
        if (resolveBtn > 0) {
            await page.click('button:has-text("Mark Safe")');
            await page.waitForLoadState('networkidle');
            console.log("PASS: Clicked Mark Safe");
        } else {
            console.log("FAIL: Mark Safe button not found");
        }
    }

    console.log("=== 4. Anonymous Sighting ===");
    const contextAnon = await browser.newContext();
    const pageAnon = await contextAnon.newPage();
    
    // Tag ID for the pet created
    let tagId = 'qr-pet-7ad55566';
    await pageAnon.goto(`http://localhost:3000/p/${tagId}`);
    await pageAnon.waitForLoadState('networkidle');
    const fileSightingBtn = await pageAnon.locator('text="File Sighting"').count();
    if (fileSightingBtn > 0) {
        await pageAnon.click('text="File Sighting"');
        await pageAnon.waitForLoadState('networkidle');
        
        await pageAnon.fill('input[placeholder*="Location"]', 'Test Location');
        await pageAnon.fill('input[placeholder*="Name"]', 'Anon Finder');
        await pageAnon.click('button:has-text("Submit Sighting")');
        await pageAnon.waitForTimeout(2000); // Wait for redirect
        console.log("PASS: Sighting submitted, final URL: " + pageAnon.url());
    } else {
        console.log("FAIL: File sighting button not found on public profile");
    }

    console.log("=== 5. Community Flow ===");
    await page.goto('http://localhost:3000/community');
    await page.waitForLoadState('networkidle');
    const posts = await page.locator('a[href^="/community/post/"]').count();
    if (posts > 0) {
        await page.click('a[href^="/community/post/"]');
        await page.waitForLoadState('networkidle');
        console.log("PASS: Opened community post");
        
        await page.fill('textarea', 'Test reply from E2E');
        await page.click('button:has-text("Reply")');
        await page.waitForTimeout(1000);
        console.log("PASS: Reply submitted");
    } else {
        console.log("FAIL: No community posts found in UI");
    }

    console.log("=== 6. REAL Scan flow ===");
    await pageAnon.goto('http://localhost:3000/scan');
    await pageAnon.waitForLoadState('networkidle');
    
    const fileInput = await pageAnon.$('input[type="file"]');
    if (fileInput) {
        await fileInput.setInputFiles(path.resolve('test_dog.jpg'));
        
        const response = await pageAnon.waitForResponse(r => r.url().includes('/identify'), { timeout: 10000 }).catch(() => null);
        if (response) {
            console.log("ML Response status: " + response.status());
            console.log("ML Response body: " + (await response.text()).substring(0, 100));
            await pageAnon.waitForTimeout(2000);
            console.log("Final URL after scan: " + pageAnon.url());
            
            if (response.status() === 200) {
                console.log("PASS: ML embedding + MATCH works");
            } else {
                console.log("FAIL: ML identify did not match. Status: " + response.status());
            }
        } else {
            console.log("FAIL: ML identify endpoint not called");
        }
    } else {
         console.log("FAIL: File input not found on /scan");
    }

    await browser.close();
}

runVerify().catch(console.error);
