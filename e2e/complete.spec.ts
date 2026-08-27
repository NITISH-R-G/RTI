import { test, expect, type Page } from '@playwright/test';

/**
 * The complete journey, from a genuinely fresh application state.
 * Every test here clears storage first: no test may depend on another.
 */

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
  await page.goto('/');
});

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

async function toAuthority(page: Page, problem: string, answer?: RegExp) {
  await page.getByLabel(/tell us about your problem/i).fill(problem);
  await page.getByRole('button', { name: /^continue$/i }).click();

  if (answer) {
    await page.getByRole('radio', { name: answer }).click();
  } else {
    // Answer whatever is asked with the escape option, which also exercises
    // the "I am not sure" path. Some domains ask nothing at all.
    const notSure = page.getByRole('radio', { name: /not sure/i });
    if (await notSure.count()) await notSure.first().click();
    else {
      const cont = page.getByRole('button', { name: /^continue$/i });
      if (await cont.count()) await cont.first().click();
    }
  }
  await expect(page.getByRole('heading', { name: /build your request/i })).toBeVisible();
  await page.getByRole('button', { name: /find where to send it/i }).click();
  await expect(page.getByText(/based on what you told us/i)).toBeVisible();
}

test('FULL DEMO PATH: pension, fresh session, through to mock tracking', async ({ page }) => {
  await toAuthority(page, 'my pension has not been paid', /central government service pension/i);

  await expect(
    page.getByRole('heading', { name: 'Department of Pensions & Pensioners Welfare' }),
  ).toBeVisible();
  await page.getByRole('button', { name: /continue with this office/i }).click();

  // Review
  await expect(page.getByRole('heading', { name: /check before you finish/i })).toBeVisible();
  await expect(page.getByText('my pension has not been paid', { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/why this office was suggested/i)).toBeVisible();
  await expect(page.getByText(/nothing here is sent to the government/i)).toBeVisible();

  // Fee is only shown once answered: mirroring, then fixing, the observed portal
  await page.getByRole('radio', { name: /i would pay the fee/i }).click();
  await expect(page.getByText('₹10', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: /finish and get my request/i }).click();

  // Confirmation + mock tracking
  await expect(page).toHaveURL(/\/filed\//);
  await expect(page.getByRole('heading', { name: /your request is ready/i })).toBeVisible();
  await expect(page.getByText(/demo confirmation/i)).toBeVisible();
  await expect(page.getByText(/has not.*submitted anything/i)).toBeVisible();

  const ref = await page.getByText(/DEMO-NOT-REAL/).first().textContent();
  expect(ref).toContain('DEMO-NOT-REAL');
  expect(ref).not.toMatch(/^[A-Z]{5}\/[RA]\/[EPTXL]\/\d{2}\/\d{5}$/);

  await expect(page.getByText(/request prepared/i)).toBeVisible();
  await expect(page.getByText(/reply due/i)).toBeVisible();
  await expect(page.getByText(/do not represent actual government processing/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /copy the request/i })).toBeVisible();
});

test('the review screen cannot be reached without an authority', async ({ page }) => {
  await page.goto('/review');
  await expect(page.getByRole('heading', { name: /what happened/i })).toBeVisible();
});

test('the filed screen cannot be reached directly', async ({ page }) => {
  await page.goto('/filed/DEMO-NOT-REAL%2F00001');
  await expect(page.getByRole('heading', { name: /what happened/i })).toBeVisible();
});

test('SOCIAL PENSION: no central authority, fee warning, useful onward route', async ({ page }) => {
  await page.getByLabel(/tell us about your problem/i).fill('my pension has not been paid');
  await page.getByRole('button', { name: /^continue$/i }).click();
  await page.getByRole('radio', { name: /old-age or social welfare/i }).click();

  await expect(page).toHaveURL(/not-rti/);
  await expect(page.getByRole('heading', { name: /point you somewhere better/i })).toBeVisible();
  await expect(page.getByText(/what we understood/i)).toBeVisible();
  await expect(page.getByText(/fee is not refunded/i)).toBeVisible();
  await expect(page.getByText(/what you may need instead/i)).toBeVisible();
  await expect(page.getByText(/state.*rti route/i).first()).toBeVisible();

  // Never a dead end: the citizen may overrule us.
  await expect(page.getByRole('button', { name: /continue anyway/i })).toBeVisible();
  await expect(page.locator('body')).not.toContainText('Department of Pensions');
});

test('NOT-RTI: a grievance gets a useful outcome, not a rejection', async ({ page }) => {
  await page.getByLabel(/tell us about your problem/i).fill('the officer in my area is rude and takes bribes');
  await page.getByRole('button', { name: /^continue$/i }).click();

  await expect(page).toHaveURL(/not-rti/);
  await expect(page.getByText(/a public grievance, if you want action/i)).toBeVisible();
  await expect(page.getByText(/what this prototype can and cannot help with/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /continue anyway/i })).toBeVisible();
  // We do not invent a service link we have not verified.
  await expect(page.getByText(/we are not linking you to a specific service/i)).toBeVisible();
});

test('every supported domain reaches a real authority', async ({ page }) => {
  const cases: [string, RegExp | undefined, string][] = [
    ['my PF withdrawal has been stuck since March', undefined, 'Employees Provident Fund Organisation'],
    ['passport still not received', undefined, 'MEA - Consular, Passport & Visa Division (CPV)'],
    ['train refund not received', undefined, 'Ministry of Railways'],
    ['income tax refund not credited', undefined, 'Central Board of Direct Taxes'],
  ];

  for (const [problem, answer, expected] of cases) {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.goto('/');
    await toAuthority(page, problem, answer);
    await expect(page.getByRole('heading', { name: expected })).toBeVisible();
  }
});

test('AMBIGUOUS input asks instead of guessing', async ({ page }) => {
  await page.getByLabel(/tell us about your problem/i).fill('where is my refund');
  await page.getByRole('button', { name: /^continue$/i }).click();

  await expect(page.getByRole('radiogroup')).toBeVisible();
  await expect(page.getByRole('radiogroup')).toHaveAccessibleName(/which of these/i);
  await expect(page.getByRole('radio', { name: /none of these/i })).toBeVisible();
});

test('UNSUPPORTED input fails helpfully with search available', async ({ page }) => {
  await page.getByLabel(/tell us about your problem/i).fill('I want information about ISRO satellite launches');
  await page.getByRole('button', { name: /^continue$/i }).click();
  expect(await bodyTextExcludingEvidence(page)).not.toContain('No such Public Authority');
  // Either an honest not-rti screen or a clarify path: both must offer a way onward.
  const onward = page.getByRole('button', { name: /continue anyway|^continue$|search authorities/i });
  await expect(onward.first()).toBeVisible();
});

test('about page explains the architecture and the honesty boundaries', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByText(/no artificial intelligence running here/i)).toBeVisible();
  await expect(page.getByText(/No such Public Authority available in this portal/)).toBeVisible();
  await expect(page.getByText(/nothing you type leaves your browser/i)).toBeVisible();
  await expect(page.getByText(/not affiliated with/i).first()).toBeVisible();
  await expect(page.getByText(/cannot file a real RTI/i).first()).toBeVisible();
});
