module.exports = {
    testEnvironment: 'node',
    verbose: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.js', '!src/server.js', '!src/config/**'],
    testMatch: ['**/tests/**/*.test.js'],
    setupFilesAfterEnv: ['./tests/setup.js'],
    testTimeout: 30000,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
};
