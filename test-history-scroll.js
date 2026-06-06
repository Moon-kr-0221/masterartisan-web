const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3033/history', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // 여러 번 스크롤해서 사진 영역 찾기
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(500);
    }
    
    await page.screenshot({ path: '/tmp/history-photos.png' });
    console.log('✓ Photo section screenshot saved');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
