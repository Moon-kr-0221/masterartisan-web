const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  
  try {
    await page.goto('http://localhost:3033/history', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    
    // 모바일 시계 섹션까지 스크롤
    await page.evaluate(() => {
      const element = document.querySelector('.mdi-time-cont');
      if (element) element.scrollIntoView({ behavior: 'auto', block: 'center' });
    });
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/tmp/mobile-history-dial.png' });
    console.log('✓ Mobile history dial screenshot saved');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
