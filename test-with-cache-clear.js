const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  
  try {
    await page.goto('http://localhost:3000/history', { waitUntil: 'networkidle' });
    await page.waitForTimeout(4000);
    
    // 2011-2020 탭 클릭
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.trim() === '2011~2020');
      if (btn) btn.click();
    });
    
    await page.waitForTimeout(1500);
    
    // 스크린샷
    await page.screenshot({ path: '/tmp/with-cache-clear.png' });
    console.log('✓ Screenshot with cache cleared');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
