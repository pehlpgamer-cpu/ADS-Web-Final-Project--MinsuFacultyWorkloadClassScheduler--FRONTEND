// @ts-check
import { test, expect } from '@playwright/test';

test('admin dashboard', async ({ page }) => {
  await page.goto('http://localhost:5173/src/pages/program_chair/dashboard.html');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Admin dashboards/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
