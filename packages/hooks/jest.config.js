module.exports = {
  verbose: true,
  clearMocks: true,
  collectCoverageFrom: ["src/**/{!(*.d.ts),}.{ts,js,tsx,jsx}"],
  coveragePathIgnorePatterns: ["/node_modules/", "package.json", "dist/", "@types/"],
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
