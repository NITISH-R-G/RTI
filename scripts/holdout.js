// Held-out generalisation check. These inputs are NOT in corpus.json and were written
// after the classifier was tuned. Purpose: detect overfitting to the corpus.
// A high corpus score with a poor holdout score means the taxonomy was tuned, not built.
import { run } from '../src/reasoning/pipeline.js';

const HOLDOUT = [
  // supported, phrasings absent from the corpus
  ['pension amount is less than what was sanctioned', ['supported', 'ambiguous'], 'pension'],
  ['I retired in 2019 but my gratuity was never settled', ['supported', 'ambiguous'], 'pension'],
  ['uan is not linked and my employer has not deposited anything', ['supported', 'ambiguous'], 'provident_fund'],
  ['my epfo claim shows settled but no money came', ['supported', 'ambiguous'], 'provident_fund'],
  ['passport seva appointment keeps getting rejected', ['supported', 'ambiguous'], 'passport'],
  ['my visa application file is not moving', ['supported', 'ambiguous'], 'passport'],
  ['pnr shows confirmed but coach was never attached', ['supported', 'ambiguous'], 'railways'],
  ['rrb exam answer key not published', ['supported', 'ambiguous'], 'railways'],
  ['assessment year 2023 return still not processed', ['supported', 'ambiguous'], 'income_tax'],
  ['tds deducted by employer but not reflecting', ['supported', 'ambiguous'], 'income_tax'],

  // must NOT be routed confidently
  ['my water connection was cut without notice', ['unsupported'], null],
  ['the sarpanch is not sharing village accounts', ['unsupported', 'ambiguous', 'not_rti'], null],
  ['I want my money back right now', ['not_rti', 'unsupported', 'ambiguous'], null],
  ['tell me who decided this and punish them', ['not_rti'], null],
  ['status', ['ambiguous', 'unsupported'], null],
  ['aadhaar card update not done', ['unsupported', 'ambiguous'], null],
];

let pass = 0;
const fails = [];
for (const [input, okClass, okDomain] of HOLDOUT) {
  const r = run(input);
  const classOk = okClass.includes(r.classification);
  const domainOk = okDomain === null ? true : r.domain === okDomain || r.classification === 'ambiguous';
  const noDeadEnd = r.reasoning.length > 0 && (r.candidate_authorities.length > 0 || r.required_questions.length > 0 || r.classification === 'unsupported' || r.classification === 'not_rti');
  if (classOk && domainOk && noDeadEnd) pass++;
  else fails.push({ input, got: `${r.classification}/${r.domain}`, want: `${okClass.join('|')}/${okDomain}`, classOk, domainOk, noDeadEnd });
}

console.log('='.repeat(64));
console.log('HELD-OUT GENERALISATION CHECK (inputs NOT in the corpus)');
console.log('='.repeat(64));
console.log(`Passed  ${pass} / ${HOLDOUT.length}  (${(pass / HOLDOUT.length * 100).toFixed(1)}%)`);
if (fails.length) {
  console.log('');
  for (const f of fails) console.log(`  "${f.input}"\n     got ${f.got}  want ${f.want}`);
}
console.log('');
