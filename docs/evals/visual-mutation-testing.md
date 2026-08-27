# Visual/UX mutation testing

Per the 2026-08-27 design-sprint directive: for important claims, deliberately
break the implementation, verify a test catches it, then revert. All three
mutations below were performed live in this session on 2026-08-27,
verified, and reverted; `git diff --stat` confirms a clean working tree
after each. This is not a hypothetical table.

| # | Claim under test | Mutation | Expected detection | Actual result | Reverted |
|---|---|---|---|---|---|
| 1 | The `Choice` primitive's tap target meets the 44px minimum (WCAG 2.5.8) on every screen that uses it | Changed `Choice`'s className from `tap ... px-4 py-3.5` to `px-1 py-0.5` (no `tap` class, minimal padding) in `src/ui/primitives.tsx` | `e2e/journey.spec.ts`'s "every interactive control meets the 44px target" test should fail | **Did not fail.** A standalone measurement script confirmed the mutated Clarify radio row rendered at 33px tall (real regression), but the existing test still passed, because `walk()` navigates all the way to the Authority screen before the height check runs; Clarify's DOM is gone by then. **This is a genuine test-coverage gap**, not a false claim: the 44px test only ever checks whatever screen `walk()` ends on, never the intermediate screens it passes through. Left unfixed under this pass's time budget; recorded here rather than silently left as an assumed-covered gap. See "Known gap" below. | Yes, `git diff --stat` clean afterward |
| 2 | The warning `Notice` (fee/wrong-office warning, the one place colour carries meaning per visual-direction-v2) meets WCAG AA contrast everywhere it appears | Changed `--color-warn-700` from `#8a4b09` to `#d9a15c` in `src/styles.css` | `e2e/contrast.spec.ts` should fail on every screen with a warning notice | **Caught.** 4 of the contrast suite's tests failed (clarify, draft, not-RTI, about), reporting the mutated colour's actual contrast ratio of 2.03 against a required 4.5 | Yes |
| 3 | The Authority screen's manual search input has a real accessible label, not just visible text near it | Removed `htmlFor={searchId}` from the `<label>` in `src/screens/Authority.tsx`, breaking the label-to-input association | `e2e/a11y.spec.ts`'s authority test, which locates the input via `getByLabel`, should fail | **Caught**, though not in the way anticipated: rather than an axe violation, the test timed out after 30s because `page.getByLabel(/search all public authorities/i)` could no longer find the now-unlabelled input at all. Still a correct failure for the right underlying reason (the input became genuinely unreachable by its accessible name), just a timeout rather than an axe assertion failure. | Yes |

## Known gap identified by mutation 1 (not fixed this pass)

The 44px target-size regression test in `e2e/journey.spec.ts` asserts against
whatever screen state exists when it runs, which is always the last screen
`walk()` navigates to (currently Authority). A regression introduced on an
earlier screen in the flow (Clarify, Request builder) is invisible to this
test unless it happens to also break the final screen. Two ways to close
this, neither attempted in this pass given the time budget: (a) call the
height-check helper after each `walk()` step instead of once at the end, or
(b) run it once per screen the way `e2e/contrast.spec.ts` already does
(one test per route). Recorded here as a known, real gap rather than
silently left for a future session to rediscover the hard way.

## Why only three mutations

The directive lists ten example mutation categories. Given the one-day
budget and the instruction to not "spend hours" on process over product,
three were chosen to cover three different guarantee types (interaction
sizing, colour contrast, accessible naming) rather than mechanically
working through all ten with shallow coverage. The three chosen also each
touch a different part of the codebase (`primitives.tsx`, `styles.css`,
a screen file), which is a more useful signal about whether the test suite
protects the product broadly than ten mutations clustered in one file would
be.
