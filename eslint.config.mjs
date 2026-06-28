import next from 'eslint-config-next';

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'scripts/**', 'screenshot.js', 'compare.js', 'proxy.ts'],
  },
  ...next,
];

export default eslintConfig;
