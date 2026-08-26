import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Automated accessibility evidence.
 *
 * This prototype specifically claims to improve on an observed baseline of
 * 40 unlabelled inputs, no landmarks, no heading structure and validation
 * delivered as a modal alert. That claim needs evidence, not assertion.
 */

async function walkToDraft(page: Page) {
  await page.goto('/');
  await page.getByLabel(/tell us about your problem/i).fill('my pension has not been paid');
  await page.getByRole('button', { name: /^continue$/i }).click();
  await page.getByRole('radio', { name: /central government service pension/i }).click();
  await expect(page.getByRole('heading', { name: /build your request/i })).toBeVisible();
}

async function scan(page: Page) {
  return new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
}

function serious(results: Awaited<ReturnType<typeof scan>>) {
  return results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
}

test('landing has no serious or critical violations', async ({ page }) => {
  await page.goto('/');
  const r = await scan(page);
  expect(serious(r).map((v) => `${v.id}: ${v.help}`)).toEqual([]);
});

test('clarify has no serious or critical violations', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel(/tell us about your problem/i).fill('my pension has not been paid');
  await page.getByRole('button', { name: /^continue$/i }).click();
  await expect(page.getByRole('radiogroup')).toBeVisible();
  const r = await scan(page);
  expect(serious(r).map((v) => `${v.id}: ${v.help}`)).toEqual([]);
});

test('draft has no serious or critical violations', async ({ page }) => {
  await walkToDraft(page);
  const r = await scan(page);
  expect(serious(r).map((v) => `${v.id}: ${v.help}`)).toEqual([]);
});

test('draft error state has no serious or critical violations', async ({ page }) => {
  await walkToDraft(page);
  const draft = page.getByLabel(/^your request$/i);
  await draft.fill("bad ' text #");
  await page.getByRole('button', { name: /find where to send it/i }).click();
  await expect(page.getByText(/some characters are not accepted/i)).toBeVisible();
  const r = await scan(page);
  expect(serious(r).map((v) => `${v.id}: ${v.help}`)).toEqual([]);
});

test('authority has no serious or critical violations, including search', async ({ page }) => {
  await walkToDraft(page);
  await page.getByRole('button', { name: /find where to send it/i }).click();
  await expect(page.getByText(/based on what you told us/i)).toBeVisible();

  await page.getByRole('button', { name: /search manually/i }).click();
  await page.getByLabel(/search all public authorities/i).fill('provident');
  await expect(page.getByRole('button', { name: /Employees Provident Fund Organisation/i })).toBeVisible();

  const r = await scan(page);
  expect(serious(r).map((v) => `${v.id}: ${v.help}`)).toEqual([]);
});
