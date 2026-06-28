import next from 'eslint-config-next';

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'scripts/**', 'screenshot.js', 'compare.js', 'proxy.ts'],
  },
  ...next,
  {
    // 관리자 페이지의 이미지는 업로드 미리보기(URL.createObjectURL blob)와 내부 전용 썸네일이라
    // next/Image 최적화 대상이 아니고 blob URL은 next/Image가 처리하지 못한다. 의도적으로 img 허용.
    files: ['app/admin/**/*.{ts,tsx}', 'components/admin/**/*.{ts,tsx}'],
    rules: { '@next/next/no-img-element': 'off' },
  },
];

export default eslintConfig;
