const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const os = require('os');

(async () => {
  const tempDir = os.tmpdir();
  const noDogImage = path.join(tempDir, 'nodog.jpg');
  fs.writeFileSync(noDogImage, Buffer.from('mock_no_dog'));

  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000');
  
  console.log('Clicking Identify Pet...');
  await page.click('button:has-text("Identify")');
  
  console.log('Waiting for modal...');
  await page.waitForSelector('h2:has-text("Identify Pet")');
  
  console.log('Setting file...');
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.click('text=Upload Pet Photo')
  ]);
  await fileChooser.setFiles(noDogImage);
  
  console.log('Clicking Identify button inside modal...');
  await page.click('button:has-text("Identify")');
  
  console.log('Waiting for error message...');
  const errorMsg = await page.waitForSelector('.bg-red-50', { timeout: 10000 });
  console.log('Error Message Displayed:', await errorMsg.textContent());

  await browser.close();
})().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
