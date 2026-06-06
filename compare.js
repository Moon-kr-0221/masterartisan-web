// compare.js

const fs = require('fs');
const PNG = require('pngjs').PNG;
let pixelmatch = require('pixelmatch');

// 최신 모듈 버전 호환성을 위한 처리
if (typeof pixelmatch !== 'function') {
  pixelmatch = pixelmatch.default;
}

try {
  // 1. 두 이미지 불러오기
  const img1 = PNG.sync.read(fs.readFileSync('before.png'));
  const img2 = PNG.sync.read(fs.readFileSync('after.png'));

  // 2. 크기 맞추기 (기준 이미지 기준)
  const { width, height } = img1;
  const diff = new PNG({ width, height });

  // 3. 픽셀 비교 실행 (threshold: 민감도, 0에 가까울수록 엄격함)
  const numDiffPixels = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  );

  // 4. 차이점을 빨간색으로 표시한 diff.png 생성
  fs.writeFileSync('diff.png', PNG.sync.write(diff));

  console.log(`검수 완료: 총 ${numDiffPixels}개의 픽셀 차이가 발견되었습니다.`);
  
  if (numDiffPixels > 0) {
    console.log('결과: 변경 사항이 있습니다. diff.png 파일을 열어 빨간색으로 표시된 부분을 확인하세요.');
  } else {
    console.log('결과: 두 이미지가 완전히 동일합니다.');
  }

} catch (error) {
  console.error('에러 발생:', error.message);
}