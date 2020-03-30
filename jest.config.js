module.exports = {
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*test.ts",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    "!src/**/*.data.ts",
    "!src/**/metadata.ts",
    "!src/**/settings.ts",
    "!src/**/created.ts",
    "!src/**/started.ts",
    "!src/**/stopped.ts",
    "!src/**/*.js",
    "!src/commands-usages/*"
  ],
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.js"]
};
