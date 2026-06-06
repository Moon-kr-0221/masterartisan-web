const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  try {
    await page.goto('http://localhost:3033/history', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // 좌측 콘텐츠 영역까지 스크롤
    await page.evaluate(() => {
      const leftSection = document.querySelector('[style*="58%"]');
      if (leftSection) leftSection.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
    
    // 아래로 스크롤해서 사진들 확인
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(300);
    }
    
    await page.screenshot({ path: '/tmp/history-images.png' });
    console.log('✓ History images screenshot');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
