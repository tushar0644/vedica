import { defineConfig, devices } from "@playwright/test";
import path from "path";

// Redirect all playwright run outputs to system temp directory to keep the workspace folder clean
const TEMP_OUTPUT_DIR = "C:/Users/Tushar/AppData/Local/Temp/playwright-results";
const TEMP_REPORT_DIR = "C:/Users/Tushar/AppData/Local/Temp/playwright-report";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { outputFolder: TEMP_REPORT_DIR }]
  ],
  outputDir: TEMP_OUTPUT_DIR,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    stdout: "ignore",
    stderr: "pipe",
    timeout: 120 * 1000,
  },
});
