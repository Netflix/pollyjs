module.exports = {
  parserOptions: {
    sourceType: 'script',
    ecmaVersion: 2020
  },
  env: {
    browser: false,
    node: true
  },
  plugins: ['node'],
  extends: ['plugin:node/recommended']
};
