const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  try {
    await page.goto('http://localhost:3033/history', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // 강릉연곡 구월사 대웅전 찾기
    await page.evaluate(() => {
      const texts = Array.from(document.querySelectorAll('span'));
      const target = texts.find(el => el.textContent.includes('강릉연곡 구월사 대웅전'));
      if (target) {
        target.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    });
    
    await page.waitForTimeout(800);
    await page.screenshot({ path: '/tmp/history-items.png' });
    console.log('✓ History items screenshot');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
