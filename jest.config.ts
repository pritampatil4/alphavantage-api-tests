import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ["<rootDir>/tests/**/*.test.ts"],
    setupFiles: ["dotenv/config"],
    verbose: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["json"],
    reporters: [
        "default",       
        ["jest-html-reporter", 
          {
            outputPath: "./reports/test-report.html", 
            pageTitle: "Alpha Vantage API Tests Report", 
            includeAll: true,
            includeFailureMsg: true, 
            includeConsoleLog: true,
          },
        ],
      ],   
};
export default config;
