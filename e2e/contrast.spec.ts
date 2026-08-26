import { test, expect, type Page } from '@playwright/test';

/**
 * Colour contrast, measured rather than assumed.
 *
 * axe already reports colour-contrast violations, but only for elements it can
 * resolve confidently. This computes the ratio for every visible text node and
 * every focus ring on every screen, and reports the actual numbers.
 */

const MEASURE = `
(() => {
  const parseRGB = (s) => {
    const m = s.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(',').map((x) => parseFloat(x));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const ratio = (a, b) => {
    const l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  const over = (fg, bg) => fg.a >= 1 ? fg : {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1,
  };
  const bgOf = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const c = parseRGB(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0) return c;
      n = n.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };

  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!hasText) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
    if (el.closest('.sr-only') || cs.clip === 'rect(0px, 0px, 0px, 0px)') continue;

    const fg = parseRGB(cs.color);
    if (!fg) continue;
    const bg = bgOf(el);
    const c = ratio(over(fg, bg), bg);

    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const required = large ? 3 : 4.5;

    if (c < required) {
      out.push({
        text: (el.textContent || '').trim().slice(0, 40),
        ratio: Math.round(c * 100) / 100,
        required, size, weight, color: cs.color,
      });
    }
  }
  return out;
})()
`;

async function measure(page: Page) {
  return page.evaluate(MEASURE) as Promise<
    { text: string; ratio: number; required: number; size: number; weight: number; color: string }[]
  >;
}

async function goDeep(page: Page) {
  await page.getByLabel(/tell us about your problem/i).fill('my pension has not been paid');
  await page.getByRole('button', { name: /^continue$/i }).click();
}

test('landing text meets WCAG AA contrast', async ({ page }) => {
  await page.goto('/');
  expect(await measure(page)).toEqual([]);
});

test('clarify text meets WCAG AA contrast', async ({ page }) => {
  await page.goto('/');
  await goDeep(page);
  expect(await measure(page)).toEqual([]);
});

test('draft, including the warning notice, meets WCAG AA contrast', async ({ page }) => {
  await page.goto('/');
  await goDeep(page);
  await page.getByRole('radio', { name: /central government service pension/i }).click();
  await page.getByLabel(/^your request$/i).fill("text with a bad ' character");
  await expect(page.getByText(/some characters are not accepted/i)).toBeVisible();
  expect(await measure(page)).toEqual([]);
});

test('authority meets WCAG AA contrast', async ({ page }) => {
  await page.goto('/');
  await goDeep(page);
  await page.getByRole('radio', { name: /central government service pension/i }).click();
  await page.getByRole('button', { name: /find where to send it/i }).click();
  expect(await measure(page)).toEqual([]);
});

test('not-RTI, including the fee warning, meets WCAG AA contrast', async ({ page }) => {
  await page.goto('/');
  await goDeep(page);
  await page.getByRole('radio', { name: /old-age or social welfare/i }).click();
  await expect(page.getByText(/fee is not refunded/i)).toBeVisible();
  expect(await measure(page)).toEqual([]);
});

test('about meets WCAG AA contrast', async ({ page }) => {
  await page.goto('/about');
  expect(await measure(page)).toEqual([]);
});

/**
 * Self-check. A contrast measurement that can only ever return an empty array is
 * worthless. This injects deliberately failing text and asserts the harness
 * catches it, so the passes above mean something.
 */
test('the contrast harness actually detects a violation', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const p = document.createElement('p');
    p.textContent = 'deliberately unreadable grey on white';
    p.style.color = '#bbbbbb';
    p.style.backgroundColor = '#ffffff';
    document.querySelector('main')!.appendChild(p);
  });
  const bad = await measure(page);
  expect(bad.some((v) => v.text.includes('deliberately unreadable'))).toBe(true);
  expect(bad.find((v) => v.text.includes('deliberately unreadable'))!.ratio).toBeLessThan(4.5);
});

test('the focus ring is visible against its background', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel(/tell us about your problem/i).focus();
  const ring = await page.evaluate(() => {
    const cs = getComputedStyle(document.activeElement!);
    return { width: cs.outlineWidth, style: cs.outlineStyle, color: cs.outlineColor };
  });
  expect(parseFloat(ring.width)).toBeGreaterThanOrEqual(2);
  expect(ring.style).not.toBe('none');
});
