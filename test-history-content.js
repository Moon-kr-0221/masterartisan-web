const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  try {
    await page.goto('http://localhost:3033/history', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // 연혁 콘텐츠 영역까지 스크롤
    await page.evaluate(() => {
      const elements = document.querySelectorAll('img');
      for (let el of elements) {
        if (el.src && el.src.includes('unsplash')) {
          el.scrollIntoView({ behavior: 'auto', block: 'center' });
          break;
        }
      }
    });
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/tmp/history-content.png' });
    console.log('✓ History content screenshot');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
