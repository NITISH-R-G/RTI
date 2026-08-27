import { describe, it, expect } from 'vitest';
import {
  feeFor, appealAvailableFrom, validateRequestText, sanitiseRequestText,
  mockReference, MAX_REQUEST_CHARS, ALLOWED_PATTERN,
} from './index';

describe('fee', () => {
  it('is Rs 10 normally and Rs 0 for BPL, never anything else', () => {
    expect(feeFor({ bpl: false })).toBe(10);
    expect(feeFor({ bpl: true })).toBe(0);
  });
});

describe('appealAvailableFrom', () => {
  it('adds 30 days', () => {
    expect(appealAvailableFrom(new Date('2026-03-01')).toISOString().slice(0, 10)).toBe('2026-03-31');
  });
  it('crosses a month boundary', () => {
    expect(appealAvailableFrom(new Date('2026-01-20')).toISOString().slice(0, 10)).toBe('2026-02-19');
  });
  it('crosses a year boundary', () => {
    expect(appealAvailableFrom(new Date('2026-12-20')).toISOString().slice(0, 10)).toBe('2027-01-19');
  });
  it('handles a leap year', () => {
    expect(appealAvailableFrom(new Date('2028-02-10')).toISOString().slice(0, 10)).toBe('2028-03-11');
  });
  it('does not mutate its argument', () => {
    const d = new Date('2026-05-05');
    appealAvailableFrom(d);
    expect(d.toISOString().slice(0, 10)).toBe('2026-05-05');
  });
});

describe('validateRequestText', () => {
  it('accepts plain allowed text', () => {
    const v = validateRequestText('Please provide the current status of my pension.');
    expect(v.valid).toBe(true);
    expect(v.disallowed).toEqual([]);
  });

  it('names every disallowed character rather than just failing', () => {
    const v = validateRequestText("my father's pension #urgent");
    expect(v.valid).toBe(false);
    expect(v.disallowed).toContain("'");
    expect(v.disallowed).toContain('#');
    expect(v.disallowed).toHaveLength(2);
  });

  it('flags Devanagari, which the real portal rejects', () => {
    const v = validateRequestText('मेरी पेंशन नहीं आई');
    expect(v.valid).toBe(false);
    expect(v.disallowed.length).toBeGreaterThan(0);
  });

  it('rejects text over the 3000 character limit', () => {
    const v = validateRequestText('a'.repeat(MAX_REQUEST_CHARS + 1));
    expect(v.overLimit).toBe(true);
    expect(v.valid).toBe(false);
    expect(v.remaining).toBe(-1);
  });

  it('accepts exactly 3000 characters', () => {
    const v = validateRequestText('a'.repeat(MAX_REQUEST_CHARS));
    expect(v.overLimit).toBe(false);
    expect(v.remaining).toBe(0);
    expect(v.valid).toBe(true);
  });

  it('rejects empty and whitespace-only text', () => {
    expect(validateRequestText('').valid).toBe(false);
    expect(validateRequestText('   \n ').valid).toBe(false);
  });
});

describe('sanitiseRequestText', () => {
  it('never leaves a disallowed character behind', () => {
    const nasty = `don't pay ₹500 #urgent "quoted" a–b; c+d=e … काम`;
    const out = sanitiseRequestText(nasty);
    expect(ALLOWED_PATTERN.test(out)).toBe(true);
  });

  it('maps common offenders to sensible equivalents', () => {
    expect(sanitiseRequestText('₹500')).toBe('Rs.500');
    expect(sanitiseRequestText('a–b')).toBe('a-b');
    expect(sanitiseRequestText("don't")).toBe('dont');
  });

  it('is idempotent', () => {
    const once = sanitiseRequestText('₹500 don’t #x');
    expect(sanitiseRequestText(once)).toBe(once);
  });
});

describe('mockReference', () => {
  it('is visibly not a real registration number', () => {
    const ref = mockReference(12345);
    expect(ref).toContain('DEMO-NOT-REAL');
    // The real format is AAAAA/B/C/DD/EEEEE: ours must not match its shape.
    expect(/^[A-Z]{5}\/[RA]\/[EPTXL]\/\d{2}\/\d{5}$/.test(ref)).toBe(false);
  });
});
