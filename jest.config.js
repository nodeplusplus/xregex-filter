module.exports = {
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/**/index.ts"],
  reporters: ["default", "jest-junit"],
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.js"],
};
