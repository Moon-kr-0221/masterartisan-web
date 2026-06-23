// screenshot.js
// 목적:
// AI가 수정한 화면(before / after)을 동일한 조건으로 캡처하여
// Playwright 시각 비교(diff) 검수에 사용한다.

const { chromium } = require('playwright');

// 실행 예시:
// node screenshot.js before.png
// node screenshot.js after.png
//
// 파일명을 전달하지 않으면 capture.png로 저장
const OUTPUT_FILE = process.argv[2] || 'capture.png';

(async () => {
  let browser;

  try {
    console.log('브라우저 실행 중...');

    browser = await chromium.launch({
      headless: true
    });

    // 비교 정확도를 위해 항상 동일한 해상도 사용
    const page = await browser.newPage({
      viewport: {
        width: 1440,
        height: 900
      }
    });

    console.log('페이지 접속 중...');

    // 개발 서버 접속
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    // 폰트/이미지/JS 렌더링 안정화 대기
    await page.waitForTimeout(3000);

    console.log('페이지 전체 스크롤 중...');

    // 페이지 끝까지 스크롤
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 200;

        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;

          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    // Lazy Loading 완료 대기
    await page.waitForTimeout(3000);

    console.log('맨 위로 복귀 중...');

    // 캡처 전 항상 맨 위로 이동
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });

    await page.waitForTimeout(1000);

    console.log('스크린샷 저장 중...');

    // 전체 페이지 캡처
    await page.screenshot({
      path: OUTPUT_FILE,
      fullPage: true
    });

    console.log(`캡처 완료: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('에러 발생:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();