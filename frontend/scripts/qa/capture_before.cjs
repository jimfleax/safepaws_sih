const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLWpvdXJuZXkiLCJ0b2tlblZlcnNpb24iOjAsImV4cCI6MTc5MjgyNDA2Nn0._1Ymlt5JsszbemRunHnWAUMwSg5cjRn61bUb_AA7fAQ';
    await context.addCookies([
        {
            name: 'jwt',
            value: token,
            url: 'http://localhost:3000',
            httpOnly: true,
            secure: false,
            sameSite: 'Lax'
        }
    ]);

    const page = await context.newPage();
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

    // 1. Dashboard Desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'dashboard_before_desktop.png' });
    
    // 2. Dashboard Mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'dashboard_before_mobile.png' });

    // 3. Pet Detail Desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/pets/test-pet-journey', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'pet_detail_before_desktop.png' });
    
    // 4. Report Lost Desktop
    await page.goto('http://localhost:3000/lost/new', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'report_lost_before_desktop.png' });

    await browser.close();
    console.log('Screenshots captured with networkidle.');
})();
