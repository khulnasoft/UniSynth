module.exports = {
  env: {
    browser: true,
  },
  plugins: ["unisynth"],
  parser: "@typescript-eslint/parser",
  extends: [],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "@khulnasoft.com/unisynth/no-conditional-render": "warn",
  },
};
