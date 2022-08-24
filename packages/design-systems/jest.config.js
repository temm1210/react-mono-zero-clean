module.exports = {
  preset: "ts-jest",
  verbose: true,
  clearMocks: true,
  testMatch: ["<rootDir>/src/tests/*.test.(ts|tsx)"],
  moduleNameMapper: {
    "\\.(css|scss)$": "<rootDir>/src/tests/__mocks__/styleMock.js",
  },
  // collectCoverageFrom: ["src/**/{!(*.d.ts),}.{ts,js,tsx,jsx}"],
  coveragePathIgnorePatterns: ["/node_modules/", "package.json", "dist/", "@types/"],
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
};
