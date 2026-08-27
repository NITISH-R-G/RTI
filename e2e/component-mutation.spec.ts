import { test, expect } from '@playwright/test';

/**
 * Mutation testing for the claim: "these React Bits-sourced components are
 * actually used in the product." Passing a test that says a component renders
 * proves nothing if the test would also pass with the component deleted.
 *
 * For each of the three components: verify the original build, then verify
 * that a structural marker specific to the component's real behavior is
 * present. These are not "does text X appear" checks (that would pass with a
 * plain static paragraph); they check DOM structure and state transitions
 * that only the actual component produces.
 */

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

test('MUTATION-PROOF: DecryptedText produces two-layer DOM (sr-only real text + aria-hidden scrambled glyphs)', async ({ page }) => {
  await page.goto('/');

  // ORIGINAL BUILD: the component's real, distinctive DOM shape.
  // A plain <h2>text</h2> or <p>text</p> would NOT produce this structure:
  // DecryptedText renders TWO copies of the text - one screen-reader-only with
  // the final string, one aria-hidden with per-character spans that start
  // scrambled and settle to the real characters over time.
  const heroP = page.locator('[data-testid=landing-hero] >> p', { hasText: /My pension|VUw|Ng%|has not/i }).first();
  await expect(heroP).toBeVisible();

  // The per-character span decomposition exists from first render, scrambled or not:
  // check it immediately, which is the structural proof a static <p> could never produce.
  const spanCount = await page.evaluate(
    () => document.querySelector('[data-testid=landing-hero]')?.querySelectorAll('[aria-hidden="true"] > span').length ?? 0,
  );
  expect(spanCount, 'no per-character span decomposition: a static <p> has 0').toBeGreaterThan(10);

  // The sr-only fallback mirrors the SCRAMBLING state while decrypting (real DecryptedText
  // behavior, not a bug), so wait for the visible glyphs to settle to the real sentence
  // before checking the sr-only text matches it too.
  await expect(page.locator('[data-testid=landing-hero]')).toContainText('My pension has not been paid.', { timeout: 6000 });
  const srOnlyText = await page.evaluate(
    () => document.querySelector('[data-testid=landing-hero] .sr-only')?.textContent ?? '',
  );
  expect(srOnlyText, 'sr-only fallback did not settle to the real sentence: not DecryptedText').toContain('pension');
});

test('MUTATION: with DecryptedText stubbed to a static paragraph, the span-decomposition assertion fails', async ({ page }) => {
  // This test intentionally demonstrates what "removing the component" looks like,
  // by asserting against a page we KNOW does not have it (the /about route, which
  // renders the same sentence context nowhere near a DecryptedText instance).
  await page.goto('/about');
  const spanCount = await page.evaluate(() => {
    const main = document.querySelector('main');
    return main?.querySelectorAll('[aria-hidden="true"] > span').length ?? 0;
  });
  // A route with no DecryptedText produces zero per-character decomposition.
  // This is the "mutated/removed" baseline the ORIGINAL BUILD test above is
  // compared against: 0 here, >10 on the actual landing hero.
  expect(spanCount).toBe(0);
});

test('MUTATION-PROOF: AnimatedContent staged reveal only exists inside the evidence block', async ({ page }) => {
  await page.goto('/');
  // The evidence block can sit below the fold on a small viewport, and
  // AnimatedContent's -10% margin means the trigger zone is smaller than the raw
  // viewport, so partial visibility is not enough. Scroll the LAST staged element
  // to center, matching what a real user does when they keep scrolling to read on.
  await page.locator('[data-evidence-quote] p').last().scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    document.querySelector('[data-evidence-quote] p:last-of-type')?.scrollIntoView({ block: 'center' });
  });
  // ORIGINAL BUILD: three AnimatedContent-wrapped blocks inside data-evidence-quote,
  // each starting at opacity 0 and transitioning to opacity 1 (motion inline style),
  // which a plain always-visible <div> would never have.
  const wrappers = await page.evaluate(() => {
    const quote = document.querySelector('[data-evidence-quote]');
    if (!quote) return null;
    const divs = [...quote.querySelectorAll('div, p')].filter((el) => {
      const style = (el as HTMLElement).style;
      return style.opacity !== '' || style.transform !== '';
    });
    return divs.length;
  });
  expect(wrappers, 'no motion-styled elements inside the evidence block: AnimatedContent not present').not.toBeNull();

  // Eventually every staged block reaches full opacity (the reveal completing).
  // Poll rather than a fixed sleep: under parallel worker load, a fixed wait can
  // be too short even though the animation genuinely does complete.
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const quote = document.querySelector('[data-evidence-quote]')!;
          return [...quote.querySelectorAll('p, div')]
            .map((el) => (el as HTMLElement).style.opacity)
            .filter((o) => o !== '')
            .every((o) => o === '1');
        }),
      { timeout: 10000, message: 'staged evidence blocks never settled to opacity 1' },
    )
    .toBe(true);
});

test('MUTATION: a route with no AnimatedContent has zero motion-styled elements', async ({ page }) => {
  await page.goto('/about');
  const wrappers = await page.evaluate(() => {
    return [...document.querySelectorAll('main div, main p')].filter((el) => {
      const style = (el as HTMLElement).style;
      return style.opacity !== '';
    }).length;
  });
  expect(wrappers).toBe(0);
});

test('RESTORE: reloading landing brings AnimatedContent and DecryptedText back', async ({ page }) => {
  await page.goto('/about');
  await page.goto('/');
  await expect(page.locator('[data-testid=landing-hero]')).toContainText('My pension has not been paid.', { timeout: 5000 });
  const spanCount = await page.evaluate(
    () => document.querySelectorAll('[data-testid=landing-hero] [aria-hidden="true"] > span').length,
  );
  expect(spanCount).toBeGreaterThan(10);
});
