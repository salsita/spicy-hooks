module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/packages/[^/]*/internal/.*'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/packages/[^/]*/internal/.*'
  ],
  globals: {
    tsconfig: './tsconfig.json'
  }
}
