# 18 — Verification Matrix

A journey may **never** be marked complete without evidence: a passing test, or a dated manual check recorded in `11-evaluation-log.md`.

Legend: `—` not started · `WIP` in progress · `PASS` verified with evidence · `FAIL` known broken.

| Journey | Route(s) | Scenarios | UI | Logic | Unit | E2E | Manual | Mobile 360 | A11y | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| J1 — Describe a problem in plain language | `/` | S1–S10 | — | — | — | — | — | — | — | Not started |
| J2 — Honest suitability verdict, including "not an RTI matter" | `/clarify`, `/not-rti` | S5, S6, S7 | — | — | — | — | — | — | — | Not started |
| J3 — Drafted request: understand it, edit it, validated live | `/request` | S10, S13 | — | — | — | — | — | — | — | Not started |
| J4 — Right authority, with reasoning and alternatives | `/authority` | S1–S4, S12 | — | — | — | — | — | — | — | Not started |
| J5 — Review: what will be filed, fee, appeal date | `/review` | S11, S12 | — | — | — | — | — | — | — | Not started |
| J6 — File (simulated) and understand what happens next | `/filed/[ref]` | ref-format | — | — | — | — | — | — | — | Not started |
| J7 — Out-of-coverage input still reaches somewhere useful | `/clarify`→`/authority` | S6, S9 | — | — | — | — | — | — | — | Not started |
| J8 — Understand what is real and what is simulated | `/about` | link check | — | — | — | — | — | — | — | Not started |
| J9 — **State-subject warning fires; no central authority proposed** | `/not-rti`, `/authority` | S7 | — | — | — | — | — | — | — | Not started |
| J10 — Journey completes with the network blocked entirely | all | — | — | — | — | — | — | — | — | Not started |

### Frozen metrics (from `docs/design/mvp-spec.md`) — none verified

| Metric | Target | Baseline | Verified? |
|---|---|---|---|
| Screens before describing the problem | 0 | 4 | — |
| Total input fields | ≤7 | 40 | — |
| Points requiring institutional knowledge | 0 | 2 | — |
| Demographic fields | 0 | 3 (+4) | — |
| Identity fields | 0 | 8 | — |
| Validation before any network call | Yes | No | — |
| Horizontal overflow at 360 px | 0 px | 625 px | — |
| Touch targets under 44 px | 0 | 30 | — |
| Inputs with a programmatic label | 100% | 0 of 40 | — |
| axe serious/critical | 0 | n/a | — |
| Dead ends | 0 | 1 | — |
| Completes with no network | Yes | n/a | — |

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
