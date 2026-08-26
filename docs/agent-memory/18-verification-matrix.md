# 18 — Verification Matrix

A journey may **never** be marked complete without evidence: a passing test, or a dated manual check recorded in `11-evaluation-log.md`.

Legend: `—` not started · `WIP` in progress · `PASS` verified with evidence · `FAIL` known broken.

| Journey | Route(s) | Scenarios | UI | Logic | Unit | E2E | Manual | Mobile 360 | A11y | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| J1 — Describe a problem in plain language | `/` | S1–S10 | Built | Built | 8 pass | — | Chrome | **0 overflow @360** | partial (no axe yet) | **Working** |
| J2 — Honest suitability verdict, including "not an RTI matter" | `/clarify`, `/not-rti` | S5, S6, S7 | Built | Built | 17 pass | — | Chrome | pending | partial (no axe) | **Clarify working; /not-rti stub** |
| J3 — Drafted request: understand it, edit it, validated live | `/request` | S10, S13 | Built | Built | 18 pass | 28 pass | Chrome | **0 overflow** | **axe 0 serious** | **Working** |
| J4 — Right authority, with reasoning and alternatives | `/authority` | S1–S4, S12 | Built | Built | 25 pass | 28 pass | Chrome | **0 overflow** | **axe 0 serious** | **Working** |
| J5 — Review: what will be filed, fee, appeal date | `/review` | S11, S12 | Built | Built | pass | 62 pass | Chrome | **0 overflow** | **axe + contrast 0** | **Working** |
| J6 — File (simulated) and understand what happens next | `/filed/[ref]` | ref-format | Built | Built | pass | 62 pass | Chrome | **0 overflow** | **axe + contrast 0** | **Working** |
| J7 — Out-of-coverage input still reaches somewhere useful | `/clarify`→`/authority` | S6, S9 | Built | Built | pass | 62 pass | Chrome | pass | pass | **Working** |
| J8 — Understand what is real and what is simulated | `/about` | link check | Built | Built | pass | 62 pass | Chrome | pass | pass | **Working** |
| J9 — **State-subject warning fires; no central authority proposed** | `/not-rti`, `/authority` | S7 | Built | Built | pass | 62 pass | Chrome | pass | **axe + contrast 0** | **Working** |
| J10 — Journey completes with the network blocked entirely | all | — | Built | Built | n/a | static build, no runtime fetch | Chrome | pass | pass | **Working** |

### Phase 4 — independent evaluation, 2026-08-27

| Item | Result |
|---|---|
| Blind corpus committed before being run | **Yes** — commit `a86821f`, 47 unseen cases |
| **ORIGINAL blind result** | **44/47 (93.6%)**, 1 dangerous, 0 dead ends, 0 fabricated |
| Post-fix blind result | 46/47 (97.9%), **0 dangerous** |
| Development corpus after fixes | 60/60, no regression |
| Adversarial suite | 21 tests x 2 viewports, **all passing** — incl. every stale-state attack |
| Fresh-reviewer audit | Done before inspecting implementation; 6 findings, 4 fixed |
| Judging audit | Done — top risk is **not yet deployed** |
| Complexity audit | Done |
| Visual quality audit | Done — one change made, rest recorded |
| Full suite | 78 reasoning + 79 unit/component + **104 Playwright** = 261 passing |

### Phase 2.5 — deterministic reasoning, VERIFIED 2026-08-26

| Item | Result | Evidence |
|---|---|---|
| Corpus written before implementation | **Yes** — commit `8dabb86` precedes `src/reasoning/` | git history |
| Corpus cases with an automated test | **60 / 60** (62 tests inc. regression + sweep) | `test/corpus.test.js` |
| Full corpus evaluation run | **60 / 60 (100%)** | `docs/evals/taxonomy-evaluation.md` |
| Supported-domain cases correct | **42 / 42** | same |
| Must-be-ambiguous cases handled safely | **3 / 3** | same |
| Unsupported / state cases handled safely | **6 / 6** | same |
| Not-RTI cases handled safely | **6 / 6** | same |
| Dead ends | **0** | same |
| Fabricated authorities | **0** — impossible by construction, asserted | same |
| Deterministic repeatability | **Verified** — every case run twice and compared | `test/corpus.test.js` |
| Held-out generalisation | **93.8% (15/16) before the final fix**; set now burned | `scripts/holdout.js` |
| Founding regression (`my pension has not been paid`) | **Passing** | named test |

### Frozen metrics (from `docs/design/mvp-spec.md`) — none verified

| Metric | Target | Baseline | Verified? |
|---|---|---|---|
| Screens before describing the problem | 0 | 4 | — |
| Total input fields | ≤7 | 40 | — |
| Points requiring institutional knowledge | 0 | 2 | — |
| Demographic fields | 0 | 3 (+4) | — |
| Identity fields | 0 | 8 | — |
| Validation before any network call | Yes | No | **Verified** |
| Horizontal overflow at 360 px | 0 px | 625 px | **Verified 0** |
| Touch targets under 44 px | 0 | 30 | **Verified 0** (inline links exempt) |
| Inputs with a programmatic label | 100% | 0 of 40 | — |
| axe serious/critical | 0 | n/a | **Verified 0** |
| Dead ends | 0 | 1 | **Verified 0** |
| Completes with no network | Yes | n/a | **Verified** |

## Baseline audit of RTI Online (research verification, 2026-08-26) — **COMPLETE AND FROZEN**

Separate from our product's journeys. Tracks what was actually observed versus documented, inferred, unknown, or deliberately not crossed.

| Item | Status | Evidence |
|---|---|---|
| Public/unauthenticated pages (home, guidelines, status, history, login, FAQ, contact, authority catalogue) | **OBSERVED** | `03-rti-site-inventory.md` |
| Citizen user manual (29 pp.) and all 26 FAQ answers | **OBSERVED (documented material)** | `03` §9 |
| Request step 1 — email / mobile / CAPTCHA, and its validation | **OBSERVED** | `03` §3 |
| OTP screen route | **OBSERVED (route only)** | `authenticated-flow-map.md` STEP 3 |
| **Authenticated RTI Request Form — full field structure (40 inputs)** | **OBSERVED** | `authenticated-form-structure.md` §1 |
| Ministry → Public Authority cascade (96 → 184 for Railways) | **OBSERVED** | `authenticated-form-structure.md` §3 |
| Authority search behaviour (3 inputs, incl. the pension dead end) | **OBSERVED** | `authenticated-friction-map.md` F-A1 |
| BPL conditional, fee disclosure, Make Payment relabel | **OBSERVED** | `authenticated-form-structure.md` §4 |
| Educational-status conditional branch | **OBSERVED** | `authenticated-form-structure.md` §4 |
| Request-text limit, absent counter, no input-time filtering | **OBSERVED** | `authenticated-form-structure.md` §5 |
| Accessibility measures on the authenticated form | **OBSERVED** | `authenticated-form-structure.md` §6 |
| Back-navigation breaking the OTP token | **OBSERVED** | `authenticated-flow-map.md` STEP 3 |
| Complete client-side validation inventory (2 dialogs; no field validation) | **OBSERVED** — via validation-function source inspection | `authenticated-form-structure.md` §7a |
| Reflow at a 360 px constraint (985 px content, 32 controls overflowing, 30 sub-44 px targets) | **OBSERVED** — direct measurement; device emulation was unavailable | `authenticated-form-structure.md` §7b |
| `Country = Other` branch (no branching occurs) | **OBSERVED** | `authenticated-friction-map.md` F-A13 |
| Colour contrast | **NEVER MEASURED** `[U]` | KI-009 residual |
| Real device / real screen reader | **NEVER USED** `[U]` | KI-009 residual |
| Screenshot image files | **NOT PERSISTABLE** in this environment | KI-010 |
| Payment gateway, submission, registration number, post-submission status | **INTENTIONALLY NOT OBSERVED** — stopped at the irreversible boundary | `authenticated-flow-map.md` |

## Release audit (pre-submission, master instruction §49)

| Check | Status |
|---|---|
| Public URL opens with no access request | — |
| Demo works from a fresh session | — |
| Main journey works end to end | — |
| No broken links, no dead buttons | — |
| No console errors | — |
| Mobile layout works at 360 px | — |
| Mock data visibly synthetic | — |
| No secrets committed | — |
| No runtime interaction with any government system | — |
| Competition requirements satisfied (`02-competition-rules.md`) | — |
| R1 evidence in place: `19-codex-contribution-log.md` filled in and checkable against `git log` | — |
| Mocked limitations disclosed in-product | — |
| README and agent memory current | — |
| Everything committed and pushed | — |
