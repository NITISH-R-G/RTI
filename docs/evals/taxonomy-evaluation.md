# Taxonomy evaluation: results

**Run date:** 2026-08-26 · **Corpus:** `corpus.json` v1, 60 cases · **Command:** `node scripts/evaluate.js`
**Corpus was committed before the classifier existed** (commit `8dabb86`, preceding `src/reasoning/`).

---

## Final results

```
Corpus size                 60
Fully correct               60 / 60  (100.0%)

Supported-domain cases      42 / 42
Must-be-ambiguous cases      3 / 3
Unsupported / state cases    6 / 6
Not-RTI cases                6 / 6

DEAD ENDS                    0
FABRICATED AUTHORITIES       0
```

By group: pension 10/10 · provident fund 8/8 · passport 8/8 · railways 8/8 · income tax 8/8 · not-RTI 6/6 · state 5/5 · out-of-scope 1/1 · edge 6/6.

Unit tests: **62 passing, 0 failing** (`node --test test/corpus.test.js`): one per corpus case plus the founding regression test and a no-dead-ends sweep.

## Read this before trusting the 100%

**A perfect score on a corpus written by the same agent that wrote the classifier is weak evidence.** Three things were done to make it less weak, and one weakness remains:

1. **Corpus-first ordering, provable in git.** The corpus commit precedes the implementation commit.
2. **Accepted-sets for borderline cases**, so genuinely ambiguous inputs were not forced to one answer to make the score look better.
3. **A held-out set** (`scripts/holdout.js`) of 16 inputs written *after* tuning and never in the corpus: see below.
4. **Remaining weakness:** all inputs, corpus and held-out, were authored inside this project. A future session should add phrasings from an outside source.

## Held-out generalisation check

16 inputs never present in the corpus, written after the classifier was tuned.

| Measurement | Result |
|---|---|
| **First run, before any fix** | **15 / 16 (93.8%)** |
| After Fix F | 16 / 16 (100.0%) |

The single miss: `tell me who decided this and punish them` classified `unsupported` when it should be `not_rti`. Note this was a **safe** failure: it routed no one anywhere: but it was imprecise.

**The held-out set is now burned.** Fix F was made in response to it, so it is no longer an independent measurement. The honest number to quote for generalisation is **93.8%, measured before the fix**. A future session needs fresh held-out inputs.

## Tuning history: every change, in order

Rule followed: change **one failure category**, re-run the **full** corpus, record the result. No tuning against individual examples.

| # | Category | Failure it explained | Change | Corpus after |
|---|---|---|---|---|
| - | *(baseline)* | - | first implementation | **53/60 (88.3%)** |
| A | **Implementation bug** | `my pension and passport are both delayed` scored pension 4 vs passport 1 and routed confidently | Fuzzy matching double-counted morphological variants: token `pension` fuzzy-matched keyword `pensioner` on a domain that had *already* matched exactly. Fuzzy now applies only when a domain has **no** strong hit: it exists to rescue typos, not to boost winners | 54/60 (90.0%) |
| B | **Incorrect domain boundary** | `refund`, `where is my refund`, `rail refund nt recvd` | `refund` was in `income_tax.fuzzy`, letting a cross-domain word act as a distinctive anchor. Removed | 57/60 (95.0%) |
| C | **Clarification failure** | `my pension and passport are both delayed` returned `domain: null` | When contested, still report the leading candidate while asking: a blank tells the citizen nothing | 58/60 (96.7%) |
| D | **Taxonomy gap** | `old age pension money hasn't arrived` routed confidently to the central department | Added social/old-age pension terms to `STATE_SIGNALS`, and added a rule: a state signal co-occurring **with** a supported domain downgrades to clarification **with the fee warning**, rather than routing centrally | 59/60 (98.3%) |
| E | **Clarification failure** | `pensioner association meeting minutes` → `continue` | A domain keyword with no problem described means we know the topic but not the need. Added `PROBLEM_SIGNALS`; without one, `next_action` is `clarify` | **60/60 (100%)** |
| F | **Domain-boundary gap** *(found by held-out, not corpus)* | `tell me who decided this and punish them` → `unsupported` | Action-seeking language with **no** detectable domain fell through to `unsupported`. It is still not an RTI matter: now classified `not_rti`. Corpus re-run confirmed no regression | 60/60 (100%) |

Every step re-ran the full 60-case corpus. No change was accepted that regressed another case.

## What the numbers do and do not mean

**They do mean:** the pipeline handles the five frozen domains across natural phrasings, contractions, abbreviations and typos; it asks instead of guessing on genuinely ambiguous input; it never returns an authority outside the captured dataset; it never dead-ends a supported-domain input; and it is deterministic.

**They do not mean:** the taxonomy generalises to RTI subjects outside the five domains: it does not, by design; or that real citizens phrase things the way we imagined: unverified until someone outside this project tests it.

## The founding regression test

```
input:  "my pension has not been paid"
RTI Online (observed):  "No such Public Authority available in this portal !"
Ours:  classification=supported · domain=pension
       authority=Department of Pensions & Pensioners Welfare
       + reasoning, information types, and a clarifying question
```

Asserted in `test/corpus.test.js` as a named regression test. If this ever breaks, the product thesis has broken.
