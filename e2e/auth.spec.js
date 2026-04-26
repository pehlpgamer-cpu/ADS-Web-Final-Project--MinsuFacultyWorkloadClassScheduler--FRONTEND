// @ts-check
import { routes } from '../src/js/routes.js'
import { test, expect } from '@playwright/test';

test('Register a new account', async ({ page }) => {
  await page.goto(routes.public.register);

  
});

test('Login existing account', async ({ page }) => {
  await page.goto(routes.public.login);

  
});

