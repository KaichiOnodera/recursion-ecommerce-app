const js = require('@eslint/js');
const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  js.configs.recommended,
  {
    ignores: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}']
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        sourceType: 'module',
        ecmaVersion: 'latest'
      },
      globals: {
        browser: true,
        es2021: true,
        node: true,
        fetch: 'readonly',
        console: 'readonly',
        document: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        window: 'readonly',
        alert: 'readonly',
        URLSearchParams: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescript,
      'react': react,
      'react-hooks': reactHooks,
      prettier: prettierPlugin,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-var': 'error',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prettier/prettier': 'error',
      ...prettierConfig.rules,
    },
    settings: {
      react: {
        version: '19.2.0'
      }
    }
  }
];
