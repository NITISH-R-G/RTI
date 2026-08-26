import { test, expect, type Page } from '@playwright/test';

/**
 * THE DEMO-CRITICAL PATH.
 *
 * This is the first minute of the submission video. If it breaks, the pitch
 * breaks. It runs at desktop AND at 360px, from a fresh browser session.
 */

/**
 * Our product must never itself produce the portal's refusal as an OUTCOME.
 * The landing page deliberately quotes that refusal as evidence, inside a block
 * marked data-evidence-quote, so the check excludes that block rather than being
 * weakened or deleted.
 */
async function bodyTextExcludingEvidence(page: Page) {
  return page.evaluate(() => {
    const clone = document.body.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('[data-evidence-quote]').forEach((n) => n.remove());
    return clone.textContent ?? '';
  });
}

const PROBLEM = 'my pension has not been paid';

async function walk(page: Page) {
  await page.goto('/');
  await page.getByLabel(/tell us about your problem/i).fill(PROBLEM);
  await page.getByRole('button', { name: /^continue$/i }).click();

  await expect(page.getByRole('radiogroup')).toBeVisible();
  await page.getByRole('radio', { name: /central government service pension/i }).click();

  await expect(page.getByRole('heading', { name: /build your request/i })).toBeVisible();
  await page.getByRole('button', { name: /find where to send it/i }).click();

  await expect(page.getByText(/based on what you told us/i)).toBeVisible();
}

test('demo path: problem to authority, no dead end', async ({ page }) => {
  await walk(page);
  await expect(
    page.getByRole('heading', { name: 'Department of Pensions & Pensioners Welfare' }),
  ).toBeVisible();
  await expect(page.getByText(/why this may be the right place/i)).toBeVisible();

  // The failure we exist to eliminate must never appear.
  expect(await bodyTextExcludingEvidence(page)).not.toContain('No such Public Authority');
});

test('the product never claims to be AI', async ({ page }) => {
  await walk(page);
  const body = await bodyTextExcludingEvidence(page);
  expect(body).not.toMatch(/\bAI\b/);
  expect(body).not.toMatch(/artificial intelligence/i);
  expect(body).not.toMatch(/\d+%\s*confiden/i);
});

test('no horizontal overflow on any screen of the demo path', async ({ page }) => {
  const check = async (label: string) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, `${label} overflows by ${overflow}px`).toBeLessThanOrEqual(0);
  };

  await page.goto('/');
  await check('landing');
  await page.getByLabel(/tell us about your problem/i).fill(PROBLEM);
  await page.getByRole('button', { name: /^continue$/i }).click();
  await check('clarify');
  await page.getByRole('radio', { name: /central government service pension/i }).click();
  await check('draft');
  await page.getByRole('button', { name: /find where to send it/i }).click();
  await check('authority');
});

test('every interactive control meets the 44px target, except inline text links', async ({ page }) => {
  await walk(page);
  const small = await page.evaluate(() => {
    const out: string[] = [];
    for (const el of document.querySelectorAll('button, [role="radio"], input, textarea, a[href]')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      // Inline links inside a paragraph are exempt under WCAG 2.5.8.
      const inline = el.tagName === 'A' && el.closest('p') !== null;
      if (inline) continue;
      // Visually-hidden controls (the skip link) have no target until focused;
      // their focused size is asserted separately below.
      if (r.height <= 2 || r.width <= 2) continue;
      if (r.height < 44) out.push(`${el.tagName}:${(el.textContent || '').trim().slice(0, 24)}:${Math.round(r.height)}`);
    }
    return out;
  });
  expect(small).toEqual([]);
});

test('the skip link meets the target size once focused', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const box = await page.evaluate(() => {
    const r = document.activeElement!.getBoundingClientRect();
    return { h: r.height, w: r.width, text: document.activeElement!.textContent };
  });
  expect(box.text).toMatch(/skip to main content/i);
  expect(box.h).toBeGreaterThanOrEqual(44);
});

test('keyboard alone completes the demo path', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab'); // skip link
  const skip = await page.evaluate(() => document.activeElement?.textContent?.trim());
  expect(skip).toMatch(/skip to main content/i);

  await page.getByLabel(/tell us about your problem/i).focus();
  await page.keyboard.type(PROBLEM);
  await page.getByRole('button', { name: /^continue$/i }).press('Enter');

  await expect(page.getByRole('radiogroup')).toBeVisible();
  await page.getByRole('radio', { name: /central government service pension/i }).press('Enter');

  await expect(page.getByRole('heading', { name: /build your request/i })).toBeVisible();
  await page.getByRole('button', { name: /find where to send it/i }).press('Enter');
  await expect(page.getByText(/based on what you told us/i)).toBeVisible();
});

test('back navigation preserves work instead of destroying it', async ({ page }) => {
  await walk(page);
  await page.goBack();
  await expect(page.getByRole('heading', { name: /build your request/i })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('radiogroup')).toBeVisible();
  await page.goBack();
  await expect(page.getByLabel(/tell us about your problem/i)).toHaveValue(PROBLEM);
});

test('a reload mid-journey does not lose the citizen work', async ({ page }) => {
  await walk(page);
  await page.reload();
  await expect(page.getByText(/based on what you told us/i)).toBeVisible();
});

test('social pension is routed away from the central portal', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel(/tell us about your problem/i).fill(PROBLEM);
  await page.getByRole('button', { name: /^continue$/i }).click();
  await page.getByRole('radio', { name: /old-age or social welfare/i }).click();
  await expect(page).toHaveURL(/not-rti/);
});
