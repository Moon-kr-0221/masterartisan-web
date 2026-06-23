const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  try {
    await page.goto('http://localhost:3033/history', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // PageIntro 끝난 후 hero까지 스크롤
    for (let i = 0; i < 8; i++) {
      await page.evaluate(() => window.scrollBy(0, 400));
      await page.waitForTimeout(200);
    }
    
    await page.screenshot({ path: '/tmp/history-with-images.png' });
    console.log('✓ History with images screenshot');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
