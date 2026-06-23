const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  try {
    await page.goto('http://localhost:3033/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // "나무의 결을 읽고" 텍스트 찾기
    const element = await page.$(':text("나무의 결을 읽고")');
    if (element) {
      await element.scrollIntoView();
      await page.waitForTimeout(500);
    }
    
    await page.screenshot({ path: '/tmp/intro-quote.png' });
    console.log('✓ Quote screenshot');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
