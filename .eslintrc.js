module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['babel', 'import'],
  globals: {
    global: true
  },
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
    'no-restricted-properties': [
      2,
      {
        object: 'Object',
        property: 'assign',
        message: 'Please use the spread operator instead.'
      }
    ],
    // Require that imports occur at the top of the file
    'import/first': 'error',

    // Require imports to be grouped and ordered consistently
    'import/order': [
      'error',
      {
        'newlines-between': 'always'
      }
    ],

    // Enable class properties
    'babel/semi': 1
  },
  overrides: [
    // test files
    {
      files: ['tests/**/*.js', '**/*/tests/**/*.js'],
      env: {
        mocha: true
      },
      globals: {
        chai: true,
        expect: true
      }
    },
    {
      files: ['**/*/tests/node/**/*.js'],
      env: {
        browser: false
      }
    },
    {
      files: ['**/*/tests/jest/**/*.js'],
      env: {
        jest: true,
        mocha: false
      }
    }
  ]
};
