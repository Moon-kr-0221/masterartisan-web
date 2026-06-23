const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Admin 페이지 접속
    await page.goto('http://localhost:3033/admin/history', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // 페이지 캡처
    await page.screenshot({ path: '/tmp/admin-history.png', fullPage: true });
    console.log('✓ Admin page screenshot saved');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
