// Blind corpus evaluation. Reports the real first-pass numbers.
// Usage: node scripts/blind.js [--verbose]
import { readFileSync } from 'node:fs';
import { run } from '../src/reasoning/pipeline.js';

const verbose = process.argv.includes('--verbose');
const corpus = JSON.parse(readFileSync(new URL('../docs/evals/blind-corpus.json', import.meta.url), 'utf8'));
const authorities = new Set(
  JSON.parse(readFileSync(new URL('../docs/research/rti-online/public-authorities.json', import.meta.url), 'utf8')).authorities,
);

const rows = corpus.cases.map((c) => {
  const r = run(c.input);
  const problems = [];
  const dangers = [];

  if (!c.acceptable_classification.includes(r.classification)) {
    problems.push(`classification=${r.classification} not in ${c.acceptable_classification.join('|')}`);
  }
  if (!c.acceptable_domain.includes(r.domain)) {
    problems.push(`domain=${r.domain} not in ${c.acceptable_domain.map(String).join('|')}`);
  }
  if ((c.dangerous_if ?? []).includes(r.classification)) {
    dangers.push(`DANGEROUS: classified ${r.classification} when that outcome could harm the citizen`);
  }
  if (!r.reasoning) problems.push('DEAD END: no reasoning');
  if (!['continue', 'clarify', 'explain_limit'].includes(r.next_action)) problems.push('bad next_action');
  for (const a of r.candidate_authorities) {
    if (!authorities.has(a.name)) dangers.push(`FABRICATED AUTHORITY: ${a.name}`);
  }

  return { c, r, problems, dangers, ok: problems.length === 0 && dangers.length === 0 };
});

const total = rows.length;
const pass = rows.filter((x) => x.ok).length;
const dangerous = rows.filter((x) => x.dangers.length);
const deadEnds = rows.filter((x) => !x.r.reasoning);

const group = (pred) => {
  const g = rows.filter(pred);
  return `${g.filter((x) => x.ok).length} / ${g.length}`;
};

console.log('='.repeat(66));
console.log('BLIND CORPUS EVALUATION  (docs/evals/blind-corpus.json)');
console.log('='.repeat(66));
console.log(`Cases                       ${total}`);
console.log(`Acceptable behaviour        ${pass} / ${total}  (${((pass / total) * 100).toFixed(1)}%)`);
console.log('');
console.log(`DANGEROUS outcomes          ${dangerous.length}`);
console.log(`Dead ends                   ${deadEnds.length}`);
console.log(`Fabricated authorities      ${rows.filter((x) => x.dangers.some((d) => d.startsWith('FABRICATED'))).length}`);
console.log('');
console.log(`Supported-domain intent     ${group((x) => x.c.id <= 'B26')}`);
console.log(`Ambiguous                   ${group((x) => x.c.id >= 'B27' && x.c.id <= 'B31')}`);
console.log(`Unsupported                 ${group((x) => x.c.id >= 'B32' && x.c.id <= 'B36')}`);
console.log(`Not-RTI                     ${group((x) => x.c.id >= 'B37' && x.c.id <= 'B41')}`);
console.log(`Adversarial / colloquial    ${group((x) => x.c.id >= 'B42')}`);

const fails = rows.filter((x) => !x.ok);
if (fails.length) {
  console.log('');
  console.log('-'.repeat(66));
  console.log(`NOT-ACCEPTABLE (${fails.length})`);
  console.log('-'.repeat(66));
  for (const f of fails) {
    console.log(`${f.c.id}  "${f.c.input.slice(0, 56)}"`);
    for (const p of [...f.dangers, ...f.problems]) console.log(`     ${p}`);
    if (verbose) console.log(`     stages=${JSON.stringify(f.r.trace.stages)}`);
    if (f.c.note) console.log(`     note: ${f.c.note}`);
  }
}
console.log('');
