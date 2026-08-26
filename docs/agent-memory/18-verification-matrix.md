# 18 — Verification Matrix

A journey may **never** be marked complete without evidence: a passing test, or a dated manual check recorded in `11-evaluation-log.md`.

Legend: `—` not started · `WIP` in progress · `PASS` verified with evidence · `FAIL` known broken.

| Journey | UI | Logic | Unit tests | E2E | Manual | Mobile 360 | A11y (axe) | Status |
|---|---|---|---|---|---|---|---|---|
| J1 — Describe a problem in plain language | — | — | — | — | — | — | — | Not started |
| J2 — Get an honest RTI-suitability verdict (including "this is not an RTI matter") | — | — | — | — | — | — | — | Not started |
| J3 — Get a drafted request, understand it, edit it | — | — | — | — | — | — | — | Not started |
| J4 — Get the right public authority, with reasoning and alternatives | — | — | — | — | — | — | — | Not started |
| J5 — Review: what will be filed, the fee, the appeal date | — | — | — | — | — | — | — | Not started |
| J6 — File (simulated) and understand what happens next | — | — | — | — | — | — | — | Not started |
| J7 — Complete the whole journey on input the domain taxonomy does not cover | — | — | — | — | — | — | — | Not started |
| J8 — Understand what is real and what is simulated | — | — | — | — | — | — | — | Not started |

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
