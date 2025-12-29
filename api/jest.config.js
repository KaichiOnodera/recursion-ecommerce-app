const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  rootDir: __dirname,
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
    "^.+\\.mjs$": ["ts-jest", { useESM: false }],
    "^.+\\.js$": ["ts-jest", { useESM: false }],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jose)/)",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testTimeout: 30000,
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  moduleNameMapper: {
    "^@shared/(.*)$": "<rootDir>/../shared/$1",
  },
};