import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { run } from '../src/reasoning/pipeline.js';
import { refine, pendingQuestions } from '../src/reasoning/refine.js';

const pension = run('my pension has not been paid');

test('central pension keeps the pension department', () => {
  const r = refine(pension, { pension_type: 'central' });
  assert.equal(r.classification, 'supported');
  assert.equal(r.domain, 'pension');
  assert.ok(r.candidate_authorities.some((a) => a.name === 'Department of Pensions & Pensioners Welfare'));
});

test('EPS pension moves to EPFO, because that is who holds it', () => {
  const r = refine(pension, { pension_type: 'eps' });
  assert.equal(r.domain, 'provident_fund');
  assert.equal(r.candidate_authorities[0].name, 'Employees Provident Fund Organisation');
});

test('social pension warns about the unrefunded fee and proposes no central office', () => {
  const r = refine(pension, { pension_type: 'social' });
  assert.equal(r.classification, 'unsupported');
  assert.deepEqual(r.candidate_authorities, []);
  assert.match(r.warnings.join(' '), /not refunded/i);
  assert.ok(r.reasoning.length > 0, 'must not be a dead end');
});

test('"I am not sure" lowers confidence instead of inventing certainty', () => {
  const r = refine(pension, { pension_type: 'unknown' });
  assert.equal(r.confidence_band, 'medium');
  assert.match(r.reasoning, /best guess/i);
  assert.ok(r.candidate_authorities.length > 0, 'still offers somewhere to go');
});

test('choosing a domain resolves a contested classification', () => {
  const both = run('my pension and passport are both delayed');
  assert.equal(both.classification, 'ambiguous');
  const r = refine(both, { which_domain: 'passport' });
  assert.equal(r.classification, 'supported');
  assert.equal(r.domain, 'passport');
});

test('"none of these" fails helpfully rather than forcing a domain', () => {
  const r = refine(run('where is my refund'), { which_domain: 'none' });
  assert.equal(r.classification, 'unsupported');
  assert.deepEqual(r.candidate_authorities, []);
  assert.match(r.reasoning, /search every public authority/i);
});

test('pendingQuestions never returns more than three and drops answered ones', () => {
  assert.ok(pendingQuestions(pension, {}).length <= 3);
  const q = pension.required_questions[0];
  assert.equal(pendingQuestions(pension, { [q.id]: 'central' }).some((x) => x.id === q.id), false);
});

test('refine never fabricates an authority', () => {
  const names = new Set(
    JSON.parse(
      readFileSync(new URL('../docs/research/rti-online/public-authorities.json', import.meta.url), 'utf8'),
    ).authorities,
  );
  for (const ans of [{ pension_type: 'central' }, { pension_type: 'eps' }, { which_domain: 'railways' }]) {
    for (const a of refine(pension, ans).candidate_authorities) {
      assert.ok(names.has(a.name), `fabricated: ${a.name}`);
    }
  }
});
