# Taxonomy test corpus

**Created:** 2026-08-26, **before any classifier implementation existed.** Git history is the proof: this file and `corpus.json` are committed in advance of `src/reasoning/`.
**Machine-readable fixture:** `docs/evals/corpus.json` — that file is the source of truth for automated tests; this document explains it.

## Why corpus-first

The failure mode this guards against is writing a classifier and then writing tests that describe whatever it happens to do. Expected behaviour here is derived from the citizen's situation and from the frozen audit, not from any implementation.

## Size and shape

**60 cases.**

| Group | Cases | What it proves |
|---|---|---|
| pension | 10 | The founding domain, including the exact observed failure string |
| provident fund | 8 | The control domain (the real portal's search already works here) |
| passport | 8 | The noisy-search domain |
| railways | 8 | The 183-authority cascade domain |
| income tax | 8 | Breadth beyond edge cases; includes the deliberately ambiguous word "refund" |
| not-RTI | 6 | Grievances, opinions, third-party personal data |
| state subject | 5 | Must warn about the no-refund consequence, never route centrally |
| out of scope | 1 | Central, but outside our five domains |
| edge | 6 | Empty, gibberish, no-signal, multi-domain, 5,000 characters, look-alike |

Every supported domain includes **natural variation** — not just the canonical phrasing. Pension alone spans "has not been paid", "hasn't come", "did not receive", "why is it delayed", "pending for three months", "when will it be credited", "stopped suddenly", plus a typo-heavy variant and an old-age-pension case that is deliberately a state matter.

## The result contract

Every input must produce:

```
classification      supported | ambiguous | unsupported | not_rti
domain              a known domain id, or null
confidence          number 0..1, plus a band: high | medium | low
next_action         continue | clarify | explain_limit
candidate_authorities  0 or more { name, reason }
reasoning           short, user-facing, plain language
required_questions  0 or more { id, text, options }
```

**Low confidence must never be silently converted into certainty.** A `high` band requires both a strong score and a clear margin over the runner-up.

## Universal failure conditions

These fail a case regardless of what else is right:

1. A dead end — a result with no `next_action`, or with no `reasoning`.
2. Any `candidate_authorities` name not present **verbatim** in `docs/research/rti-online/public-authorities.json`.
3. A supported-domain input returning **zero** candidate authorities **and** zero required questions.
4. Non-deterministic output across repeated runs.
5. A confidence value outside 0..1, or a band inconsistent with the value.

Condition 3 is the direct guard against reproducing the observed baseline failure:

> input `my pension has not been paid` → **`No such Public Authority available in this portal !`**

## Grading rule for borderline cases

Some inputs are genuinely ambiguous to a human. Forcing a single expected answer would be dishonest, so those cases accept **a set** of classifications, and the reason is recorded in the case's `note`. Examples:

- **P06** `old age pension money hasn't arrived` — social pensions are usually delivered by state governments. Accepts `ambiguous` or `unsupported`; **rejects** a confident central routing.
- **F08** `eps pension` — EPS is a pension scheme run by EPFO. Accepts `ambiguous` or `supported` in either domain.
- **I07** `where is my refund` — spans tax, railways and provident fund. Accepts **only** `ambiguous`: guessing here is a failure even if the guess happens to be popular.
- **E04** `my pension and passport are both delayed` — accepts **only** `ambiguous`.
- **E06** `pensioner association meeting minutes` — looks like pension, is not. Must not route confidently.

## Adversarial cases and what each attacks

| ID | Input | Attack |
|---|---|---|
| P01 | `my pension has not been paid` | The exact observed baseline failure |
| P02 | `pension hasn't come` | Contraction, no keyword like "delayed" or "pending" |
| P10 | `pention has nt been paid sinc marchh` | Typos in the domain keyword itself |
| P06 | `old age pension money hasn't arrived` | Looks central, is usually state |
| F01 | `pf money is stuck` | Two-letter abbreviation carrying the whole signal |
| T06 / R07 | `tatkal passport delay` / `tatkal ticket refund` | A shared keyword that must resolve to different domains |
| T07 | `passport` | Single word |
| I07 / I08 | `where is my refund` / `refund` | A word spanning three supported domains — must ask |
| N04 | `please release my pension immediately` | Supported domain, but asks for action not records |
| N06 | `give me my neighbour's pension details` | Supported domain, but third-party personal data |
| U01–U05 | road, ration card, electricity, FIR, school | State subjects — the expensive mistake |
| U06 | `ISRO satellite launches` | Central but out of scope — must fail helpfully |
| E01 / E02 | empty / gibberish | No signal |
| E04 | pension **and** passport | Two supported domains at once |
| E05 | 5,000 characters | Length |
| E06 | `pensioner association meeting minutes` | Look-alike that is not our domain |

**The objective is not to force every input into one of the five domains.** Correctly saying *"I need a little more information"* or *"this prototype does not cover this"* counts as success. Confidently routing someone wrong counts as failure.
