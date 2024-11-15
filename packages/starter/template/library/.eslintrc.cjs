module.exports = {
  env: {
    browser: true,
  },
  plugins: ['@khulnasoft.com/unisynth'],
  extends: [
    // Use this approach for our recommended rules configuration
    'plugin:@khulnasoft.com/unisynth/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
};
