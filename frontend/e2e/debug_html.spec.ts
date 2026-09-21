import { test, expect } from '@playwright/test';

test('debug html', async ({ page, context }) => {
  await context.addCookies([{
    name: 'jwt',
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LW93bmVyLTEiLCJ0b2tlblZlcnNpb24iOjAsImV4cCI6MTc5MjU3NDQ3Nn0.b190odxN6LYTClYE-rc0Na4O9-MR6cpFt7wjGp3pHIo',
    domain: 'localhost',
    path: '/',
    httpOnly: true,
    sameSite: 'Lax'
  }]);

  await page.goto('/');
  await page.evaluate(() => sessionStorage.setItem('hasEntered', 'true'));
  await page.goto('/dashboard');
  await page.waitForURL('**/setup-profile');
  const html = await page.content();
  console.log(html);
});
