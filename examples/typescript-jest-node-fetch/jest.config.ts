import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  rootDir: ".",
  preset: "ts-jest",
  testEnvironment: "setup-polly-jest/jest-environment-jsdom",
  verbose: true,
  testPathIgnorePatterns: ["node_modules", "dist"],
  resetModules: true,
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  transform: { },
};

export default config;
