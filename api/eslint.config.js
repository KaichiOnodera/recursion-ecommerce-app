const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

const nodeGlobals = {
  console: 'readonly',
  process: 'readonly',
  Buffer: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
  global: 'readonly',
  module: 'readonly',
  require: 'readonly',
  exports: 'readonly',
};

const commonRules = {
  'no-console': 'warn',
  'no-debugger': 'error',
  'no-var': 'error',
};

module.exports = [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: nodeGlobals,
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier: prettierPlugin,
    },
    rules: {
      ...commonRules,
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-redeclare': 'off',
      'no-dupe-class-members': 'off',
      'no-array-constructor': 'off',
      'no-empty-function': 'off',
      'no-extra-semi': 'off',
      'no-implied-eval': 'off',
      'no-loss-of-precision': 'off',
      'no-magic-numbers': 'off',
      'no-unnecessary-type-assertion': 'off',
      'no-unused-expressions': 'off',
      'prefer-const': 'off',
      'prefer-namespace-keyword': 'off',
      'require-await': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      'prefer-const': 'error',
      'prettier/prettier': 'error',
      ...prettierConfig.rules,
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: nodeGlobals,
    },
    rules: {
      ...commonRules,
      'prefer-const': 'error',
    },
  },
];
