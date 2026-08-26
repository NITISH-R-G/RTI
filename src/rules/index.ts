/**
 * Deterministic rules. Pure functions, no UI imports, no network.
 *
 * Every value here is a real rule of the RTI system, with its source recorded.
 * Nothing in this file may ever be produced by a template or a model — the
 * observed portal states these facts, and so must we, from one place (ED-009).
 */

/** Application fee in rupees. Source: RTI Rules 2012; stated on the portal's own form as "You are required to pay the RTI fee of ₹ 10". */
export const RTI_FEE_RUPEES = 10;

/** No fee for a Below Poverty Line applicant with a certificate. Source: RTI Rules 2012, restated in the portal guidelines. */
export const BPL_FEE_RUPEES = 0;

/** Days before a first appeal becomes possible. Source: RTI Act 2005; portal FAQ: "you may file first appeal only after completion of stipulated time period of 30 days". */
export const APPEAL_AFTER_DAYS = 30;

/** Maximum characters in the request text. Source: observed `maxlength="3000"` on the live form. */
export const MAX_REQUEST_CHARS = 3000;

/**
 * The exact character set the real portal accepts in the request text.
 * Source: verbatim on-screen note — "Only alphabets A-Z a-z number 0-9 and
 * special characters , . - _ ( ) / @ : & ? \ % are allowed".
 * Note what this EXCLUDES: apostrophe, #, ;, +, =, ", the rupee sign, and all Devanagari.
 */
export const ALLOWED_PATTERN = /^[A-Za-z0-9 \n\r,.\-_()/@:&?\\%]*$/;
const ALLOWED_CHAR = /[A-Za-z0-9 \n\r,.\-_()/@:&?\\%]/;

export function feeFor(opts: { bpl: boolean }): number {
  return opts.bpl ? BPL_FEE_RUPEES : RTI_FEE_RUPEES;
}

/** The date a first appeal becomes possible. Returned as a date, never as "30 days" (ED-009). */
export function appealAvailableFrom(filedOn: Date): Date {
  const d = new Date(filedOn.getTime());
  d.setDate(d.getDate() + APPEAL_AFTER_DAYS);
  return d;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export interface TextValidation {
  length: number;
  remaining: number;
  overLimit: boolean;
  disallowed: string[];
  valid: boolean;
}

/** Validates against the real limits. Runs on every keystroke — no network (ED-003, ED-004). */
export function validateRequestText(text: string): TextValidation {
  const disallowed = [...new Set([...text].filter((ch) => !ALLOWED_CHAR.test(ch)))];
  return {
    length: text.length,
    remaining: MAX_REQUEST_CHARS - text.length,
    overLimit: text.length > MAX_REQUEST_CHARS,
    disallowed,
    valid: text.trim().length > 0 && text.length <= MAX_REQUEST_CHARS && disallowed.length === 0,
  };
}

/** Maps common offenders to allowed equivalents. Must never introduce a disallowed character. */
const REPLACEMENTS: Record<string, string> = {
  '‘': "", '’': "", "'": '',        // curly and straight apostrophes
  '“': '', '”': '', '"': '',        // quotes
  '–': '-', '—': '-',               // en/em dash
  '₹': 'Rs.', '#': 'No.', ';': ',', '+': 'and', '=': 'is', '*': '', '!': '.',
  '…': '...', '\t': ' ',
};

export function sanitiseRequestText(text: string): string {
  let out = '';
  for (const ch of text) {
    if (ALLOWED_CHAR.test(ch)) { out += ch; continue; }
    const rep = REPLACEMENTS[ch];
    out += rep !== undefined ? rep : ' ';
  }
  return out.replace(/[ \t]{2,}/g, ' ');
}

/** A reference that can never be mistaken for a real registration number (PD-003, R13). */
export function mockReference(seed: number): string {
  const n = String(seed % 100000).padStart(5, '0');
  return `DEMO-NOT-REAL/${n}`;
}
