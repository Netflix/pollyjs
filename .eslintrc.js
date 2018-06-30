module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'prettier'],
  env: {
    browser: true,
    es6: true
  },
  rules: {
    'no-console': 'off',
    'prefer-const': 'error',
    'padding-line-between-statements': [
      'error',
      // require blank lines before all return statements,
      { blankLine: 'always', prev: '*', next: 'return' },

      // Require blank lines after every sequence of variable declarations
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var']
      }
    ],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true
      }
    ],
    'no-restricted-properties': [
      2,
      {
        object: 'Object',
        property: 'assign',
        message: 'Please use the spread operator instead.'
      }
    ]
  },
  overrides: [
    // test files
    {
      files: ['**/*/tests/**/*-test.js'],
      env: {
        mocha: true
      },
      globals: {
        chai: true,
        expect: true
      }
    }
  ]
};
