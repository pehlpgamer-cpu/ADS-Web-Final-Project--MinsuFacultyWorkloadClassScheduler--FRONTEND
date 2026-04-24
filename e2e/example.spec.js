// @ts-check
import { test, expect } from '@playwright/test';

test('admin dashboard', async ({ page }) => {
  await page.goto('http://localhost:5173/src/pages/program_chair/dashboard.html');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Admin dashboards/);
});

