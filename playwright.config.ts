import { defineConfig, devices } from "@playwright/test";

// baseURL is the only knob the provided suite needs (tests/gala.spec.ts sets
// its own 390x844 touch viewport via test.use).
const PORT = Number(process.env.PORT || 3000);
const BASE_URL = process.env.PW_BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // The suite measures boundingBox immediately after scrollIntoView;
        // animated scrolls would race it. Instant scrolling in the harness
        // matches the environment the 19-point QA was authored in.
        launchOptions: { args: ["--disable-smooth-scrolling"] },
      },
    },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: `${BASE_URL}/galas`,
    reuseExistingServer: true,
    timeout: 180_000,
    env: {
      // Form tests point the API at the in-spec mock webhook.
      HOLD_WEBHOOK_URL:
        process.env.HOLD_WEBHOOK_URL || "http://127.0.0.1:9911/hook",
    },
  },
});
