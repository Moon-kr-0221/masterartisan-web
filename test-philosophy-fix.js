const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  try {
    await page.goto('http://localhost:3033/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(4000); // PageIntro가 끝날 때까지 대기
    
    // "BRAND PHILOSOPHY" 섹션 찾기
    await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('p'));
      const target = elements.find(el => el.textContent.includes('나무의 결을'));
      if (target) {
        target.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    });
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/tmp/philosophy-fixed.png' });
    console.log('✓ Fixed version screenshot');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
