import { describe, it, expect } from 'vitest';
import { compose, optionsFor, defaultSelection } from './compose';
import { validateRequestText, MAX_REQUEST_CHARS, ALLOWED_PATTERN } from '../rules';

const DOMAINS = ['pension', 'provident_fund', 'passport', 'railways', 'income_tax'];

describe('information options', () => {
  it('puts domain-specific options first for every frozen domain', () => {
    for (const d of DOMAINS) {
      const opts = optionsFor(d);
      expect(opts.length).toBeGreaterThan(6);
      expect(opts[0].id).not.toBe('status'); // a domain option leads
    }
  });

  it('still offers useful options when the domain is unknown', () => {
    expect(optionsFor(null).length).toBeGreaterThanOrEqual(6);
  });

  it('defaults to a small selection, not everything', () => {
    for (const d of DOMAINS) {
      expect(defaultSelection(d).length).toBeLessThanOrEqual(3);
    }
  });
});

describe('compose', () => {
  const problem = 'my pension has not been paid for three months';

  it('produces a draft that passes the real portal rules', () => {
    for (const d of DOMAINS) {
      const text = compose({ domain: d, selected: defaultSelection(d), problem });
      const v = validateRequestText(text);
      expect(v.valid, `${d}: ${v.disallowed.join(',')}`).toBe(true);
      expect(ALLOWED_PATTERN.test(text)).toBe(true);
    }
  });

  it('never approaches the 3000 character limit with a normal selection', () => {
    const text = compose({ domain: 'pension', selected: defaultSelection('pension'), problem });
    expect(text.length).toBeLessThan(MAX_REQUEST_CHARS / 2);
  });

  it('stays valid even when every option is selected', () => {
    const all = optionsFor('pension').map((o) => o.id);
    const text = compose({ domain: 'pension', selected: all, problem });
    expect(validateRequestText(text).valid).toBe(true);
    expect(text.length).toBeLessThanOrEqual(MAX_REQUEST_CHARS);
  });

  it('sanitises a problem containing characters the portal rejects', () => {
    const nasty = 'my father’s pension #urgent ₹5000 काम';
    const text = compose({ domain: 'pension', selected: ['status'], problem: nasty });
    expect(validateRequestText(text).valid).toBe(true);
  });

  it('includes the citizen own words as background', () => {
    const text = compose({ domain: 'pension', selected: ['status'], problem });
    expect(text).toContain('pension has not been paid for three months');
  });

  it('asks for records and explicitly disclaims opinions', () => {
    const text = compose({ domain: 'pension', selected: ['status'], problem });
    expect(text).toMatch(/not seeking opinions/i);
    expect(text).toMatch(/Right to Information Act, 2005/);
  });

  it('includes the section 6(3) transfer request, which protects the citizen', () => {
    const text = compose({ domain: 'pension', selected: ['status'], problem });
    expect(text).toMatch(/section 6\(3\)/);
  });

  it('numbers the selected items in order', () => {
    const text = compose({ domain: 'pension', selected: ['status', 'reason'], problem });
    expect(text).toMatch(/1\. The current status/);
    expect(text).toMatch(/2\. The reason for the delay/);
  });

  it('clips an extremely long problem without producing an invalid draft', () => {
    const text = compose({ domain: 'pension', selected: ['status'], problem: 'pension '.repeat(2000) });
    expect(validateRequestText(text).valid).toBe(true);
    expect(text.length).toBeLessThan(MAX_REQUEST_CHARS);
  });
});
