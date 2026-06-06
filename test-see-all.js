const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  
  try {
    await page.goto('http://localhost:3000/history', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // 2011-2020 섹션으로 이동
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('2011'));
      if (button) button.click();
    });
    
    await page.waitForTimeout(800);
    
    // 스크린샷
    await page.screenshot({ path: '/tmp/history-see-all.png' });
    console.log('✓ Full view screenshot');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
