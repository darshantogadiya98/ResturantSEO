module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js'
  ],

  // Coverage configuration
  collectCoverage: false, // Disabled for initial implementation
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'scripts/docs-sync/**/*.js',
    '!scripts/docs-sync/**/*.test.js',
    '!scripts/docs-sync/**/*.spec.js',
    '!**/node_modules/**',
    '!**/coverage/**'
  ],

  // Coverage thresholds (disabled for initial implementation)
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: 80
  //   }
  // },

  // Setup files (commented out until setup.js is created)
  // setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Module mapping for AWS SDK mocking
  moduleNameMapper: {
    '^aws-sdk$': '<rootDir>/tests/__mocks__/aws-sdk.js'
  },

  // Transform configuration
  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  // Test timeout
  testTimeout: 30000,

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true
};