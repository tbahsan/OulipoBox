import { test, expect } from '@playwright/test';

test.describe('OulipoBox E2E Tests', () => {
  test('loads home page and shows compliant default state', async ({ page }) => {
    await page.goto('/');

    // Check title and logo
    await expect(page).toHaveTitle(/OulipoBox/);
    await expect(page.locator('h1')).toContainText('OulipoBox');

    // Default preset is E-less Lipogram
    await expect(page.locator('#active-constraint-name')).toContainText('E-less Lipogram');
    await expect(page.locator('#status-banner')).toHaveClass(/valid/);
    await expect(page.locator('#status-badge')).toContainText('Compliant');
  });

  test('flags forbidden letter in real-time when typed', async ({ page }) => {
    await page.goto('/');

    const textarea = page.locator('#editor-input');
    await textarea.fill('Hello world!');

    // 'Hello' has 'e', so it must be invalid
    await expect(page.locator('#status-banner')).toHaveClass(/invalid/);
    await expect(page.locator('#status-badge')).toContainText('Issues');
    await expect(page.locator('#violation-count-badge')).toHaveText('1');

    // Highlights should contain mark tag
    const highlights = page.locator('#editor-highlights');
    await expect(highlights.locator('mark.violation-mark')).toBeVisible();
    await expect(highlights.locator('mark.violation-mark')).toHaveText('e');

    // Now clear the 'e' by typing 'A stout dog runs'
    await textarea.fill('A stout dog runs.');
    await expect(page.locator('#status-banner')).toHaveClass(/valid/);
    await expect(page.locator('#status-badge')).toContainText('Compliant');
    await expect(page.locator('#violation-count-badge')).toHaveText('0');
  });

  test('switches presets seamlessly without crashing', async ({ page }) => {
    await page.goto('/');

    // Click Univocalic on E pill
    const univocalicPill = page.locator('.preset-pill:has-text("Univocalic on E")');
    await univocalicPill.click();

    await expect(page.locator('#active-constraint-name')).toContainText('Univocalic on E');
    await expect(page.locator('#status-banner')).toHaveClass(/valid/);

    // Click Acrostic: AUTUMN pill
    const acrosticPill = page.locator('.preset-pill:has-text("Acrostic: AUTUMN")');
    await acrosticPill.click();

    await expect(page.locator('#active-constraint-name')).toContainText('Acrostic: AUTUMN');
    await expect(page.locator('#ctrl-target-word')).toHaveValue('AUTUMN');
  });

  test('copy button provides visual feedback', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');

    const copyBtn = page.locator('#copy-btn');
    await copyBtn.click();
    await expect(copyBtn).toContainText('Copied');
  });

  test('toggles dark and light mode', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.locator('#theme-toggle');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});
