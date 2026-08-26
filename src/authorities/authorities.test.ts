import { describe, it, expect } from 'vitest';
import { search, contextFor, isRealAuthority, ALL_AUTHORITIES, looksStateOrUt } from './index';
import { run } from '../reasoning/pipeline';
import { refine } from '../reasoning/refine';

describe('dataset', () => {
  it('carries the real captured list', () => {
    expect(ALL_AUTHORITIES.length).toBeGreaterThan(2800);
    expect(isRealAuthority('Department of Pensions & Pensioners Welfare')).toBe(true);
    expect(isRealAuthority('Ministry of Made Up Things')).toBe(false);
  });
});

describe('search', () => {
  it('finds an authority by a word in its name', () => {
    const hits = search('provident fund');
    expect(hits[0].name).toBe('Employees Provident Fund Organisation');
  });

  it('is order-independent', () => {
    expect(search('fund provident')[0].name).toBe('Employees Provident Fund Organisation');
  });

  it('matches acronyms', () => {
    expect(search('CPV').some((h) => h.name.includes('Consular, Passport & Visa'))).toBe(true);
  });

  it('returns every hit with context, never a bare name', () => {
    for (const h of search('pension')) {
      expect(h.context.length).toBeGreaterThan(20);
      expect(isRealAuthority(h.name)).toBe(true);
    }
  });

  it('does not dump the whole list', () => {
    expect(search('a', 12).length).toBeLessThanOrEqual(12);
  });

  it('returns nothing for an empty query rather than everything', () => {
    expect(search('')).toEqual([]);
    expect(search('   ')).toEqual([]);
  });

  it('ranks an authority we know something real about above one we do not', () => {
    const hits = search('pension');
    const authoredIndex = hits.findIndex((h) => h.authored);
    const plainIndex = hits.findIndex((h) => !h.authored);
    if (authoredIndex >= 0 && plainIndex >= 0) expect(authoredIndex).toBeLessThan(plainIndex);
  });
});

describe('context honesty', () => {
  it('uses an authored reason where we have one', () => {
    const c = contextFor('Employees Provident Fund Organisation');
    expect(c.authored).toBe(true);
    expect(c.text).toMatch(/claim and settlement records/i);
  });

  it('admits when we do not know what an office does, instead of inventing it', () => {
    const unknown = ALL_AUTHORITIES.find((n) => n.includes('Zoological Survey'))!;
    const c = contextFor(unknown);
    expect(c.authored).toBe(false);
    expect(c.text).toMatch(/do not hold a description/i);
  });

  it('flags Union Territory bodies', () => {
    const ut = ALL_AUTHORITIES.find((n) => n.startsWith('UT '))!;
    expect(looksStateOrUt(ut)).toBe(true);
    expect(contextFor(ut).text).toMatch(/Union Territory/i);
  });
});

/**
 * The regression suite required before WU5 can be called complete.
 * Every returned authority is asserted against the captured dataset.
 */
describe('domain routing regressions', () => {
  const cases: [string, Record<string, string>, string | null][] = [
    ['my pension has not been paid', { pension_type: 'central' }, 'Department of Pensions & Pensioners Welfare'],
    ['my pension has not been paid', { pension_type: 'eps' }, 'Employees Provident Fund Organisation'],
    ['my PF withdrawal has been stuck since March', {}, 'Employees Provident Fund Organisation'],
    ['passport still not received', {}, 'MEA - Consular, Passport & Visa Division (CPV)'],
    ['train refund not received', {}, 'Ministry of Railways'],
    ['income tax refund not credited', {}, 'Central Board of Direct Taxes'],
  ];

  for (const [input, answers, expected] of cases) {
    it(`${input} -> ${expected}`, () => {
      const r = refine(run(input), answers);
      expect(r.candidate_authorities[0]?.name).toBe(expected);
      for (const a of r.candidate_authorities) expect(isRealAuthority(a.name)).toBe(true);
    });
  }

  it('old-age/social pension proposes NO central authority and warns about the fee', () => {
    const r = refine(run('my pension has not been paid'), { pension_type: 'social' });
    expect(r.candidate_authorities).toEqual([]);
    expect(r.warnings.join(' ')).toMatch(/not refunded/i);
    expect(r.reasoning.length).toBeGreaterThan(0);
  });

  it('ambiguous input offers clarification rather than false certainty', () => {
    const r = run('where is my refund');
    expect(r.classification).toBe('ambiguous');
    expect(r.required_questions.length).toBeGreaterThan(0);
    expect(r.candidate_authorities).toEqual([]);
  });

  it('no route can ever return a name outside the captured dataset', () => {
    const inputs = [
      'my pension has not been paid', 'pf money is stuck', 'passport still not received',
      'train refund not received', 'income tax refund not credited', 'where is my refund',
      'the road outside my house has not been repaired', 'asdkjhaskjdh',
    ];
    for (const i of inputs) {
      const answerSets: Record<string, string>[] = [{}, { pension_type: 'central' }, { which_domain: 'railways' }];
      for (const ans of answerSets) {
        for (const a of refine(run(i), ans).candidate_authorities) {
          expect(isRealAuthority(a.name), `${i} -> ${a.name}`).toBe(true);
        }
      }
    }
  });
});
