module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier', 'simple-import-sort', 'import'],
  env: {
    browser: false,
    es6: true,
    node: true,
  },
  globals: {
    ethers: 'readonly',
    integrations: 'readonly',
    database: 'readonly',
    blockchain: 'readonly',
    BigNumber: 'readonly',
    axios: 'readonly',
    cache: 'readonly',
    graph: 'readonly',
  },
  rules: {
    'prettier/prettier': 'error',
    'simple-import-sort/imports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
};
