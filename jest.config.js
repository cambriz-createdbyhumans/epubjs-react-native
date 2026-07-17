// Self-contained jest config for the internal fork. The original jest.config.ts
// depended on ts-jest + the RN testing-library preset, which are not installed
// here. babel-jest (hoisted to the repo root) with babel-preset-expo transforms
// TS; `configFile: false` keeps it from loading the production babel.config.js.
module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/*.test.ts?(x)'],
  modulePathIgnorePatterns: ['<rootDir>/example/node_modules', '<rootDir>/lib/'],
  transform: {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      { configFile: false, presets: ['babel-preset-expo'] },
    ],
  },
};
