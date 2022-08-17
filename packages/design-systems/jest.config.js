module.exports = {
  preset: "ts-jest",
  verbose: true,
  clearMocks: true,
  testMatch: ["<rootDir>/src/**/*.test.(ts|tsx)"],
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
