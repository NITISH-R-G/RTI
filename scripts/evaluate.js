// Corpus evaluation. Reports real numbers and categorises every failure.
// Usage: node scripts/evaluate.js [--verbose]
import { readFileSync } from 'node:fs';
import { run } from '../src/reasoning/pipeline.js';

const verbose = process.argv.includes('--verbose');
const corpus = JSON.parse(readFileSync(new URL('../docs/evals/corpus.json', import.meta.url), 'utf8'));
const authorities = new Set(
  JSON.parse(readFileSync(new URL('../docs/research/rti-online/public-authorities.json', import.meta.url), 'utf8')).authorities
);

const SUPPORTED_GROUPS = ['pension', 'pf', 'passport', 'railways', 'tax'];
const rows = [];

for (const c of corpus.cases) {
  const r = run(c.input);
  const problems = [];

  if (!c.expect_classification.includes(r.classification)) {
    problems.push(`classification=${r.classification} want ${c.expect_classification.join('|')}`);
  }
  if (!c.expect_domain.includes(r.domain)) {
    problems.push(`domain=${r.domain} want ${c.expect_domain.map(String).join('|')}`);
  }
  if (!c.expect_next_action.includes(r.next_action)) {
    problems.push(`next_action=${r.next_action} want ${c.expect_next_action.join('|')}`);
  }
  if (!r.reasoning) problems.push('DEAD END: no reasoning');
  for (const a of r.candidate_authorities) {
    if (!authorities.has(a.name)) problems.push(`FABRICATED: ${a.name}`);
  }
  if (SUPPORTED_GROUPS.includes(c.group) && r.candidate_authorities.length === 0 && r.required_questions.length === 0) {
    problems.push('DEAD END: supported-domain input with no authorities and no questions');
  }
  const again = run(c.input);
  if (JSON.stringify(again) !== JSON.stringify(r)) problems.push('NON-DETERMINISTIC');

  rows.push({ c, r, problems, ok: problems.length === 0 });
}

const total = rows.length;
const pass = rows.filter((x) => x.ok).length;
const byGroup = {};
for (const x of rows) {
  byGroup[x.c.group] ??= { n: 0, ok: 0 };
  byGroup[x.c.group].n++;
  if (x.ok) byGroup[x.c.group].ok++;
}

const supported = rows.filter((x) => SUPPORTED_GROUPS.includes(x.c.group));
const ambiguousExpected = rows.filter((x) => x.c.expect_classification.includes('ambiguous') && x.c.expect_classification.length === 1);
const unsupportedExpected = rows.filter((x) => ['state', 'out_of_scope'].includes(x.c.group));
const notRtiExpected = rows.filter((x) => x.c.group === 'not_rti');
const deadEnds = rows.filter((x) => x.problems.some((p) => p.startsWith('DEAD END')));
const fabricated = rows.filter((x) => x.problems.some((p) => p.startsWith('FABRICATED')));

console.log('='.repeat(64));
console.log('TAXONOMY CORPUS EVALUATION');
console.log('='.repeat(64));
console.log(`Corpus size                 ${total}`);
console.log(`Fully correct               ${pass} / ${total}  (${(pass / total * 100).toFixed(1)}%)`);
console.log('');
console.log(`Supported-domain cases      ${supported.filter((x) => x.ok).length} / ${supported.length}`);
console.log(`Must-be-ambiguous cases     ${ambiguousExpected.filter((x) => x.ok).length} / ${ambiguousExpected.length}`);
console.log(`Unsupported / state cases   ${unsupportedExpected.filter((x) => x.ok).length} / ${unsupportedExpected.length}`);
console.log(`Not-RTI cases               ${notRtiExpected.filter((x) => x.ok).length} / ${notRtiExpected.length}`);
console.log('');
console.log(`DEAD ENDS                   ${deadEnds.length}`);
console.log(`FABRICATED AUTHORITIES      ${fabricated.length}`);
console.log('');
console.log('By group:');
for (const [g, v] of Object.entries(byGroup)) {
  console.log(`  ${g.padEnd(14)} ${v.ok}/${v.n}`);
}

const failures = rows.filter((x) => !x.ok);
if (failures.length) {
  console.log('');
  console.log('-'.repeat(64));
  console.log(`FAILURES (${failures.length})`);
  console.log('-'.repeat(64));
  for (const f of failures) {
    console.log(`${f.c.id}  "${f.c.input.slice(0, 58)}"`);
    for (const p of f.problems) console.log(`     ${p}`);
    if (verbose) console.log(`     trace: ${JSON.stringify(f.r.trace.stages)} scores=${JSON.stringify(f.r.trace.scores)}`);
    if (f.c.note) console.log(`     note: ${f.c.note}`);
  }
}
console.log('');
process.exit(failures.length ? 1 : 0);
