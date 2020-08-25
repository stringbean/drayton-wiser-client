module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  coverageDirectory: 'coverage',
  setupFiles: ['./tests/jestSetup.ts'],
  testEnvironment: 'node',
};
