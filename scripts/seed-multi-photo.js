const { chromium } = require('playwright');

const IMG1 = '/tmp/work_img1.jpg';
const IMG2 = '/tmp/work_img2.jpg';
const IMG3 = '/tmp/work_img3.jpg';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 1. 로그인
  await page.goto('http://localhost:3000/admin/login');
  await page.waitForSelector('input[type="email"]', { timeout: 20000 });
  await page.fill('input[type="email"]', 'rayarchit@naver.com');
  await page.fill('input[type="password"]', 'Ganghwa778!');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin**', { timeout: 15000 });
  console.log('✓ 로그인 완료');

  // 2. 작업 사례 페이지
  await page.goto('http://localhost:3000/admin/works');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // 입력 가능한 요소 확인
  const inputs = await page.locator('input[type="text"]').all();
  console.log(`텍스트 input 수: ${inputs.length}`);
  for (const inp of inputs) {
    const ph = await inp.getAttribute('placeholder');
    const nm = await inp.getAttribute('name');
    console.log(`  name=${nm} placeholder=${ph}`);
  }

  // 3. 제목 (placeholder로 찾기)
  const titleInput = page.locator('input[placeholder*="수원 사찰"]');
  await titleInput.waitFor({ timeout: 10000 });
  await titleInput.fill('수원화성 동북각루 보수공사');

  // 분류 select
  const catSelect = page.locator('select[name="category"]').first();
  await catSelect.selectOption('maintenance');

  // 연도
  const yearInput = page.locator('input[placeholder="2024"]').first();
  await yearInput.fill('2024');

  // 설명 textarea
  const descArea = page.locator('textarea[name="description"]').first();
  await descArea.fill('수원화성 동북각루의 전통 목구조 부재 교체 및 단청 보수 작업입니다. 기존 훼손된 서까래와 도리를 소나무 원목으로 교체하고, 전통 방식의 단청을 새로 입혔습니다. 공사 기간 3개월, 문화재청 허가 하에 진행된 정식 문화재 보수 사업입니다.');

  // 대표 이미지 업로드
  const addForm = page.locator('form:has(input[placeholder*="수원 사찰"])');
  const imgInput = addForm.locator('input[type="file"][name="image"]');
  await imgInput.setInputFiles(IMG1);
  await page.waitForTimeout(500);

  // 추가 버튼
  const addBtn = addForm.locator('button[type="submit"]');
  await addBtn.click();
  await page.waitForTimeout(5000);
  console.log('✓ 작업 추가 완료');

  // 4. 페이지 새로고침 후 카드 찾기
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  const card = page.locator('[id*="work-card"]').filter({ hasText: '수원화성 동북각루 보수공사' }).first();
  const cardCount = await card.count();
  console.log(`카드 찾기: ${cardCount}개`);
  if (!cardCount) { await browser.close(); return; }

  // 5. 추가 이미지 2 업로드
  const extraInput1 = card.locator('input[type="file"][accept="image/*"]');
  await extraInput1.setInputFiles(IMG2);
  await page.waitForTimeout(4000);
  console.log('✓ 추가 사진 2 업로드');

  // 6. 새로고침 후 추가 이미지 3 업로드
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  const card2 = page.locator('[id*="work-card"]').filter({ hasText: '수원화성 동북각루 보수공사' }).first();
  const extraInput2 = card2.locator('input[type="file"][accept="image/*"]');
  await extraInput2.setInputFiles(IMG3);
  await page.waitForTimeout(4000);
  console.log('✓ 추가 사진 3 업로드');

  console.log('\n🎉 완료! http://localhost:3000/works 에서 확인하세요.');
  await browser.close();
})();
