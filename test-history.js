const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3033/history', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollBy(0, 3000));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/tmp/history-page.png' });
    console.log('✓ Screenshot saved');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
