module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  ignorePatterns: [
    '.eslintrc.cjs',
    'jest.config.js',
    'babel.config.js',
    'build.js',
    'dist/',
    '*.test.js',
  ],
  root: true,
  env: {
    browser: true,
  },
};
