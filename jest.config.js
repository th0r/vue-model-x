module.exports = {
  collectCoverage: true,
  coverageDirectory: '<rootDir>/test/coverage',
  collectCoverageFrom: [
    'src/**/*.js'
  ],
  coverageReporters: ['lcov', 'text', 'text-summary']
};
