const config = {
  verbose: true,
  transform: {
    '^.+\\.[t|j]s?$': 'babel-jest'
  },
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
}

module.exports = config
