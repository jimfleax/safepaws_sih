const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  if (!fs.existsSync('test-results')) {
    fs.mkdirSync('test-results');
  }

  const errors = [];
  const networkFailures = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push(err.message);
  });

  page.on('response', response => {
    if (response.status() >= 400 && response.url().includes('api')) {
      networkFailures.push(response.status() + ' ' + response.url());
    }
  });

  async function checkBlankScreen(stepName) {
    const isBlank = await page.evaluate(() => {
      return document.body.innerText.trim() === '' || document.querySelector('#root').innerHTML.trim() === '';
    });
    if (isBlank) {
      console.error('BLANK SCREEN DETECTED AT:', stepName);
      await page.screenshot({ path: 'test-results/blank_' + stepName.replace(/\//g, '_') + '.png' });
      return true;
    }
    return false;
  }

  try {
    console.log('Testing /');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'test-results/home.png' });
    if (await checkBlankScreen('/')) return;

    console.log('Testing /community');
    await page.goto('http://localhost:3000/community', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'test-results/community.png' });
    if (await checkBlankScreen('/community')) return;

    let postLink = await page.$('a[href^="/community/post/"]');
    if (postLink) {
      let href = await postLink.getAttribute('href');
      console.log('Testing ' + href);
      await page.goto('http://localhost:3000' + href, { waitUntil: 'networkidle' });
      await page.screenshot({ path: 'test-results/community_post.png' });
      if (await checkBlankScreen(href)) return;
    } else {
      console.log('No community posts found.');
    }

    console.log('Testing /scan');
    await page.goto('http://localhost:3000/scan', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'test-results/scan.png' });
    if (await checkBlankScreen('/scan')) return;

    console.log('Testing /p/qr-pet-5d19879e');
    await page.goto('http://localhost:3000/p/qr-pet-5d19879e', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'test-results/public_profile.png' });
    if (await checkBlankScreen('/p/qr-pet-5d19879e')) return;

    console.log('--- Step 8: IMPORTANT BLANK SCREEN TEST ---');
    // Navigate manually: Home -> Community -> Scan -> Back -> Home -> Identify -> Back
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    console.log('Navigated to Home');
    
    // -> Community
    await page.evaluate(() => window.history.pushState(null, '', '/community'));
    await page.evaluate(() => window.dispatchEvent(new Event('popstate')));
    await page.waitForTimeout(500);
    console.log('Navigated to Community');
    if (await checkBlankScreen('nav_community')) return;

    // -> Scan
    await page.evaluate(() => window.history.pushState(null, '', '/scan'));
    await page.evaluate(() => window.dispatchEvent(new Event('popstate')));
    await page.waitForTimeout(500);
    console.log('Navigated to Scan');
    if (await checkBlankScreen('nav_scan')) return;

    // -> Back
    await page.evaluate(() => window.history.back());
    await page.waitForTimeout(500);
    console.log('Navigated Back (to Community)');
    if (await checkBlankScreen('nav_back_community')) return;

    // -> Home
    await page.evaluate(() => window.history.pushState(null, '', '/'));
    await page.evaluate(() => window.dispatchEvent(new Event('popstate')));
    await page.waitForTimeout(500);
    console.log('Navigated to Home');
    if (await checkBlankScreen('nav_home_2')) return;

    // -> Identify (Scan)
    await page.evaluate(() => window.history.pushState(null, '', '/scan'));
    await page.evaluate(() => window.dispatchEvent(new Event('popstate')));
    await page.waitForTimeout(500);
    console.log('Navigated to Identify');
    if (await checkBlankScreen('nav_identify')) return;

    // -> Back
    await page.evaluate(() => window.history.back());
    await page.waitForTimeout(500);
    console.log('Navigated Back (to Home)');
    if (await checkBlankScreen('nav_back_home')) return;

  } catch(e) {
    console.error('Test script exception:', e);
  } finally {
    console.log('Errors:', errors);
    console.log('Network Failures:', networkFailures);
    await browser.close();
  }
})();
