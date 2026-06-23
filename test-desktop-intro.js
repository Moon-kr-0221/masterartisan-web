const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  try {
    await page.goto('http://localhost:3033/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // IntroSection까지 스크롤
    await page.evaluate(() => {
      const elements = document.querySelectorAll('section');
      if (elements.length > 1) elements[1].scrollIntoView({ behavior: 'auto', block: 'start' });
    });
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/tmp/desktop-intro.png' });
    console.log('✓ Desktop intro screenshot');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
