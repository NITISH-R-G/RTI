// CI check: fails if the em dash character (—) appears in user-facing source or
// project documentation. Standing project preference, enforced rather than hoped for.
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const EM_DASH = '—';

// Tracked files only (respects .gitignore), excluding vendored third-party source
// (verbatim upstream code we do not rewrite, including installed agent skill
// packages under .claude/skills and .agents/skills) and package-lock.
const files = execSync('git ls-files', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)
  .filter((f) => /\.(tsx?|jsx?|md|mdx|css|html)$/.test(f))
  .filter((f) => !f.startsWith('src/vendor/'))
  .filter((f) => !f.startsWith('.claude/skills/'))
  .filter((f) => !f.startsWith('.agents/skills/'))
  .filter((f) => !f.includes('package-lock.json'))
  .filter((f) => f !== 'scripts/check-em-dash.js');

let violations = 0;
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    if (line.includes(EM_DASH)) {
      violations++;
      console.log(`${file}:${i + 1}: ${line.trim().slice(0, 100)}`);
    }
  });
}

if (violations > 0) {
  console.log(`\n${violations} em dash occurrence(s) found. Replace with a comma, colon, period, or semicolon.`);
  process.exit(1);
}
console.log('No em dashes found.');
