import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { run } from '../src/reasoning/pipeline.js';

const corpus = JSON.parse(readFileSync(new URL('../docs/evals/corpus.json', import.meta.url), 'utf8'));
const authorities = new Set(
  JSON.parse(readFileSync(new URL('../docs/research/rti-online/public-authorities.json', import.meta.url), 'utf8')).authorities
);

const VALID_CLASS = ['supported', 'ambiguous', 'unsupported', 'not_rti'];
const VALID_ACTION = ['continue', 'clarify', 'explain_limit'];

// ---- universal failure conditions, applied to every case ----
function assertContract(r, id) {
  assert.ok(VALID_CLASS.includes(r.classification), `${id}: bad classification ${r.classification}`);
  assert.ok(VALID_ACTION.includes(r.next_action), `${id}: bad next_action ${r.next_action}`);
  assert.ok(typeof r.reasoning === 'string' && r.reasoning.length > 0, `${id}: DEAD END - empty reasoning`);
  assert.ok(r.confidence >= 0 && r.confidence <= 1, `${id}: confidence out of range`);
  assert.equal(
    r.confidence_band,
    r.confidence >= 0.7 ? 'high' : r.confidence >= 0.4 ? 'medium' : 'low',
    `${id}: band inconsistent with confidence`
  );
  for (const a of r.candidate_authorities) {
    assert.ok(authorities.has(a.name), `${id}: FABRICATED AUTHORITY "${a.name}"`);
  }
  if (r.classification === 'supported') {
    assert.ok(
      r.candidate_authorities.length > 0 || r.required_questions.length > 0,
      `${id}: supported case with no authorities and no questions - this is the baseline failure`
    );
  }
}

for (const cse of corpus.cases) {
  test(`${cse.id} :: ${cse.input.slice(0, 60) || '(empty)'}`, () => {
    const r = run(cse.input);
    assertContract(r, cse.id);

    // determinism
    assert.deepEqual(JSON.parse(JSON.stringify(run(cse.input))), JSON.parse(JSON.stringify(r)), `${cse.id}: non-deterministic`);

    assert.ok(
      cse.expect_classification.includes(r.classification),
      `${cse.id}: classification ${r.classification}, expected one of ${cse.expect_classification.join('|')}`
    );
    assert.ok(
      cse.expect_domain.includes(r.domain),
      `${cse.id}: domain ${r.domain}, expected one of ${cse.expect_domain.join('|')}`
    );
    assert.ok(
      cse.expect_next_action.includes(r.next_action),
      `${cse.id}: next_action ${r.next_action}, expected one of ${cse.expect_next_action.join('|')}`
    );
  });
}

// ---- the founding regression test ----
test('REGRESSION: the observed baseline failure must never recur', () => {
  const r = run('my pension has not been paid');
  assert.equal(r.classification, 'supported');
  assert.equal(r.domain, 'pension');
  assert.ok(r.candidate_authorities.some((a) => a.name === 'Department of Pensions & Pensioners Welfare'));
  assert.ok(!/no such public authority/i.test(r.reasoning));
});

test('no supported-domain input is ever a dead end', () => {
  for (const cse of corpus.cases.filter((c) => ['pension', 'pf', 'passport', 'railways', 'tax'].includes(c.group))) {
    const r = run(cse.input);
    assert.ok(
      r.candidate_authorities.length > 0 || r.required_questions.length > 0,
      `${cse.id}: dead end on a supported-domain input`
    );
  }
});
