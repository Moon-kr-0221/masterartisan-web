const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  try {
    await page.goto('http://localhost:3033/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // 전체 페이지 높이 확인
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log('Page height:', bodyHeight);
    
    // 스크롤해서 IntroSection 찾기
    await page.evaluate(() => window.scrollBy(0, 1500));
    await page.waitForTimeout(800);
    
    await page.screenshot({ path: '/tmp/intro-section.png', fullPage: false });
    console.log('✓ IntroSection screenshot');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
