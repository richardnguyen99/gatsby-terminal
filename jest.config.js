process.env.TZ = 'GMT'

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [`**/*.{ts|tsx}`, `!**/node_modules/**`, `!**/coverage/**`, `!**/*.js`],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  snapshotSerializers: [
    "enzyme-to-json/serializer"
  ],
  transform: {
    "^.+\\.[jt]sx?$": "<rootDir>/jest-preprocess.js",
  },
  moduleNameMapper: {
    '^@/(.*)$': `<rootDir>/src/$1`,
    '^@components/(.*)$': `<rootDir>/src/components/$1`,
    '^@styles/(.*)$': `<rootDir>/src/styles/$1`,
    '^@pages/(.*)$': `<rootDir>/src/pages/$1`,
    '^@context/(.*)$': `<rootDir>/src/context/$1`,
    '^@hooks/(.*)$': `<rootDir>/src/hooks/$1`,
    '^@hooks(.*)$': `<rootDir>/src/hooks/$1`,
    '.+\\.(css|styl|less|sass|scss)$': `identity-obj-proxy`,
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/__mocks__/file-mock.js`,
  },
  testPathIgnorePatterns: [`node_modules`, `\\.cache`, `<rootDir>.*/public`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
  globals: {
    __PATH_PREFIX__: ``,
  },
  testURL: `http://localhost`,
  setupFiles: [`<rootDir>/loadershim.js`],
  setupFilesAfterEnv: [`<rootDir>src/setupTests.js`, `<rootDir>node_modules/jest-enzyme/lib/index.js`],
}
