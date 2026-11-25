import { defineConfig, devices } from "@playwright/test";

const externalBaseURL = process.env.TEST_BASE_URL;
const localBaseURL = "http://127.0.0.1:3100";

export default defineConfig({
  testDir: "./tests",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: externalBaseURL || localBaseURL,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile-chromium",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: externalBaseURL
    ? undefined
    : {
        command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
        url: localBaseURL,
        reuseExistingServer: false,
        timeout: 120_000,
        env: { NEXT_DIST_DIR: ".next-test" },
      },
});
