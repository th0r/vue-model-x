module.exports = {
  snapshotSerializers: [
    '<rootDir>/node_modules/jest-serializer-vue'
  ],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/test/coverage',
  collectCoverageFrom: [
    'src/**/*.js'
  ],
  coverageReporters: ['lcov', 'text', 'text-summary']
};
