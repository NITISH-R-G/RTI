import dataset from '../../docs/research/rti-online/public-authorities.json';
import { DOMAINS } from '../reasoning/taxonomy.js';
import type { ReasoningResult } from '../reasoning/pipeline';

/**
 * The real public-authority list, captured read-only from the portal's own
 * catalogue page on 2026-08-26. Names are used verbatim.
 *
 * Fabrication is impossible by construction: every name the product can render
 * comes from this array. There is no code path that synthesises one.
 */
export const ALL_AUTHORITIES: string[] = (dataset as { authorities: string[] }).authorities;
const AUTHORITY_SET = new Set(ALL_AUTHORITIES);
export const CAPTURED_ON = (dataset as { captured: string }).captured;

export function isRealAuthority(name: string): boolean {
  return AUTHORITY_SET.has(name);
}

/** Authored context from our taxonomy, keyed by authority name. */
const AUTHORED: Record<string, string> = {};
for (const d of DOMAINS as { authorities: { name: string; reason: string }[] }[]) {
  for (const a of d.authorities) AUTHORED[a.name] = a.reason;
}

/**
 * Honest context for a search result.
 *
 * Where we have authored a reason, we show it. Where we have not, we say what we
 * actually know — that it is on the portal's list — rather than inventing a
 * description of what the body does. The original portal shows nothing at all;
 * a fabricated description would be worse than that.
 */
export function contextFor(name: string): { text: string; authored: boolean } {
  const authored = AUTHORED[name];
  if (authored) return { text: authored, authored: true };
  if (name.startsWith('UT ')) {
    return {
      text: `Union Territory body listed on the RTI Online portal (list captured ${CAPTURED_ON}).`,
      authored: false,
    };
  }
  return {
    text: `Listed on the RTI Online portal's public authority list (captured ${CAPTURED_ON}). We do not hold a description of what this office covers.`,
    authored: false,
  };
}

function tokens(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((t) => t.length > 1);
}

export interface SearchHit {
  name: string;
  context: string;
  authored: boolean;
  score: number;
}

/**
 * Search that reports what it matched.
 *
 * The observed portal search matches institutional names only, and answers
 * problem-language with "No such Public Authority available in this portal !".
 * Ours is still a name search — we do not pretend otherwise — but it is
 * token-based, order-independent and acronym-tolerant, and the UI states plainly
 * that it searches names so the citizen knows what to type.
 */
export function search(query: string, limit = 12): SearchHit[] {
  const q = tokens(query);
  if (!q.length) return [];

  const hits: SearchHit[] = [];
  for (const name of ALL_AUTHORITIES) {
    const lower = name.toLowerCase();
    let score = 0;
    for (const t of q) {
      if (lower.includes(t)) score += t.length >= 4 ? 3 : 1;
      // Acronym match: "CPV", "EPFO", "NISST" appear inside parentheses or as bare caps.
      if (t.length >= 2 && new RegExp(`\\b${t}\\b`, 'i').test(name)) score += 2;
    }
    if (score === 0) continue;
    if (lower.startsWith(q[0])) score += 2;
    if (AUTHORED[name]) score += 4; // we know something real about it
    const c = contextFor(name);
    hits.push({ name, context: c.text, authored: c.authored, score });
  }

  return hits.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).slice(0, limit);
}

/** Union Territory / state-run bodies — filing these centrally costs the fee. */
export function looksStateOrUt(name: string): boolean {
  return name.startsWith('UT ');
}

/**
 * The "why this may be the right place" bullets.
 * Each one is tied to something the citizen actually did — their answers or the
 * information they asked for — not to a score.
 */
export function reasonsFor(opts: {
  result: ReasoningResult;
  answers: Record<string, string>;
  /** Noun phrases, not question labels — see InfoOption.noun (FR-2). */
  infoTypeLabels: string[];
  authorityReason: string;
}): string[] {
  const out: string[] = [opts.authorityReason];

  const pension = opts.answers.pension_type;
  if (pension === 'central') out.push('You told us this is a central government service pension, which this office administers.');
  if (pension === 'eps') out.push('You told us this is an EPS pension, which is administered by the provident fund organisation rather than a ministry.');
  if (pension === 'unknown') out.push('You were not sure which kind of pension this is, so treat this as a starting point and check the alternatives.');
  if (opts.answers.which_domain) out.push('You chose this subject when we asked which one your situation was about.');

  if (opts.infoTypeLabels.length) {
    const list = opts.infoTypeLabels.slice(0, 3);
    const joined =
      list.length === 1 ? list[0] : `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`;
    out.push(`You asked for ${joined}. Records of that kind sit with the office that processes the case.`);
  }

  if (opts.result.confidence_band !== 'high') {
    out.push('This is our best match rather than a certainty. If you know the office that handles your case, choose it instead.');
  }

  return out;
}
