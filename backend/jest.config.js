/**
 * Jest configuration for the Nexus 26 backend test suite.
 *
 * - Uses ts-jest to compile TypeScript on-the-fly during test execution.
 * - Collects coverage from all source files, excluding entry points.
 * - Enforces minimum coverage thresholds to prevent regression.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],

  // ── Coverage collection ─────────────────────────────────────────────────────
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/tests/**',
    '!src/index.ts', // Entry point — starts the server; tested via integration
    '!src/app.ts',   // App factory — wiring only; tested via supertest
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],

  // ── Coverage thresholds ─────────────────────────────────────────────────────
  // Gemini live-API path is excluded from reachable coverage (requires API key).
  // Per-file overrides are used to reflect this accurately.
  coverageThreshold: {
    global: {
      branches:   95,
      functions:  100,
      lines:      100,
      statements: 100,
    },
    './src/utils/validation.ts': {
      branches:   90,
      functions:  100,
      lines:      100,
      statements: 100,
    },
    './src/utils/logger.ts': {
      branches:   100,
      functions:  100,
      lines:      100,
      statements: 100,
    },
    './src/controllers/chatController.ts': {
      branches:   100,
      functions:  100,
      lines:      100,
      statements: 100,
    },
  },

  verbose: true,
};
