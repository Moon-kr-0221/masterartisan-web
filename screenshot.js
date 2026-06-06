// screenshot.js

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 1. 페이지 접속 (네트워크 연결이 안정될 때까지 대기)
  await page.goto('http://localhost:3000', {
    waitUntil: 'networkidle'
  });

  // 2. 사람이 스크롤하는 것처럼 천천히 페이지 맨 아래까지 이동
  await page.evaluate(async () => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    for (let i = 0; i < document.body.scrollHeight; i += 100) {
      window.scrollTo(0, i);
      await delay(20); // 스크롤을 내리며 애니메이션이 뜰 시간을 줌
    }
  });

  // 3. 스크롤 완료 후 혹시 모를 로딩을 위해 3초 대기
  await page.waitForTimeout(3000);

  // 4. 다시 맨 위로 복귀 (레이아웃 안정을 위해)
  await page.evaluate(() => window.scrollTo(0, 0));

  // 5. 스크린샷 캡처 (before.png로 저장)
  await page.screenshot({
    // 수정 전: path: 'before.png',
    path: 'after.png',
    fullPage: true
  });

  await browser.close();
})();