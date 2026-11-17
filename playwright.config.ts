import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  webServer: {
    command: 'npm run build && npm run preview -- --port 4321',
    port: 4321,
    reuseExistingServer: false,
    // Windows: a lowercase drive letter in the cwd ("c:\...") makes Astro drop the page
    // stylesheet links from the build. Normalise it so the tested build is the real one.
    cwd: process.cwd().replace(/^[a-z]:/, (d) => d.toUpperCase()),
  },
  use: { baseURL: 'http://localhost:4321' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
