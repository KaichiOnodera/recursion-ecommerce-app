module.exports = {
  extends: ['react-app', 'react-app/jest'],
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    File: 'readonly',
    FileReader: 'readonly',
    FormData: 'readonly',
    HTMLDivElement: 'readonly',
    HTMLImageElement: 'readonly',
  },
};

