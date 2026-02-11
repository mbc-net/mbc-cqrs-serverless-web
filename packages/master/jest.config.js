/** @type {import('jest').Config} */
module.exports = {
  displayName: 'master',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
}
