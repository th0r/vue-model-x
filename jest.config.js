module.exports = {
  snapshotSerializers: [
    '<rootDir>/node_modules/jest-serializer-vue'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js'
  ],
  coverageReporters: ['text-summary']
};
