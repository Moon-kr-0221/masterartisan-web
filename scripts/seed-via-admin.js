const { chromium } = require('playwright');

const IMAGES = [
  'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&w=1600&q=80',
];

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // 1. 로그인
  await page.goto('http://localhost:3000/admin/login');
  await page.fill('input[name="email"]', 'rayarchit@naver.com');
  await page.fill('input[name="password"]', 'Ganghwa778!');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin**', { timeout: 8000 });
  console.log('로그인 완료');

  // 2. 작업 사례 페이지로 이동
  await page.goto('http://localhost:3000/admin/works');
  await page.waitForLoadState('networkidle');

  // 3. 제목 입력
  await page.fill('input[name="title"][placeholder="수원 사찰 대웅전 보수"]', '수원화성 동북각루 보수공사');

  // 4. 연도
  await page.fill('input[name="year"][placeholder="2024"]', '2024');

  // 5. 설명
  await page.fill('textarea[name="description"]', '수원화성 동북각루의 전통 목구조 부재 교체 및 단청 보수 작업입니다. 기존 훼손된 서까래와 도리를 소나무 원목으로 교체하고, 전통 방식의 단청을 새로 입혔습니다.');

  // 6. 추가 버튼 클릭
  await page.click('button:has-text("추가"):not(:has-text("사진"))');
  await page.waitForTimeout(3000);
  console.log('작업 추가 완료');

  await browser.close();
  console.log('완료');
})();
