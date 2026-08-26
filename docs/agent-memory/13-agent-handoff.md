# 13 — Agent Handoff

**Last updated:** 2026-08-26, end of Session 1 (Claude Opus 5, Claude Code).

## What is currently working

Nothing runs. There is no application. What exists is a complete, evidence-labelled research foundation and a specified MVP.

## What is currently broken

Nothing is broken. Nothing is built.

## What changed most recently

Session 1 initialised the repository, audited `rtionline.gov.in` read-only, captured the real public-authority list, created the `docs/agent-memory/` system (00–18), recommended the problem to solve, and wrote the MVP spec with acceptance criteria and a first test plan. Full detail: `12-change-log.md`.

## What was tested

Nothing — no code. The audit's factual claims were each verified in the live DOM or read from the portal's own published documents, and are labelled [O]/[D]/[I]/[U] in `03-rti-site-inventory.md`.

## What failed

Two things could not be done and are **not** to be papered over:
- The live RTI application form and the post-OTP status screens are behind an OTP wall. They were not observed. Everything stated about them comes from the official user manual, labelled [D].
- Screenshots were unavailable (the browser pane could not composite frames), so there are no colour-contrast measurements of the baseline portal. (KI-006.)

## What remains unfinished

Everything after research: stack ratification, the application, tests, evaluation runs, deployment.

## What the next agent should do first

**In this order.**

1. **Get PD-002 ratified** — confirm with the project owner that the problem in `04-user-problem.md` is the one to build, and settle the two other open questions there (product name; OpenAI API key availability). Everything downstream assumes the answer.
2. **Ratify or replace `docs/adr/0002-stack.md`** and flip its status line. Do not write application code before this.
3. **Scaffold the project with its test runner in the same commit** — the command contract in `10-test-strategy.md` (`dev`, `build`, `typecheck`, `lint`, `test`, `test:e2e`, `eval`) must work from day one, plus `.env.example`.
4. **Build the deterministic rules module first, test-first**: fee, appeal date, 3,000-character limit, allowed character set, sanitisation, authority search. This is the layer the whole product leans on and it needs no AI, so it can be finished and proven before any model is wired up. Test cases 1–7 in `docs/design/mvp-spec.md`.
5. **Enrich the public-authority dataset** (KI-003) — at minimum a central-vs-state/UT flag, which is what powers the "returned without refund" warning in F4.
6. Then the journey, thinnest end-to-end version first (`/` through `/filed/[id]`), keeping a working demo path at every commit.

## Assumptions currently being made

- The competition brief is as relayed in the master instructions; no primary copy of it is in this repository.
- The problem C1 is the right one. It is a *recommendation*, ranked against five alternatives, not yet ratified.
- The stack in ADR-0002 is a proposal, not a decision.
- The public-authority list captured on 2026-08-26 is representative. It is a snapshot; the product must never call the live portal at runtime.

## Decisions that must NOT be revisited without evidence

`05-product-decisions.md` in full. Especially: PD-001 (do not clone the portal), PD-003 (no real filing/payment/OTP/login), PD-004 (every AI output shown and editable), PD-005 (AI does language, code does rules).

## Most important files

`docs/agent-memory/03-rti-site-inventory.md` (the evidence) · `04-user-problem.md` (the why) · `docs/design/mvp-spec.md` (the contract) · `docs/research/rti-online/public-authorities.json` (the real data) · `02-competition-rules.md` (the constraints that can disqualify).

## Commands to run

None yet — no application exists. The contract they must satisfy when created is in `10-test-strategy.md`.

## Current demo path

None. `00-project-state.md` carries the planned flow; fill in the real one as soon as the first route ships.

## Known risks

`15-risk-register.md`. The three that would hurt most: R-01 (a non-OpenAI runtime model is a disqualification), R-02 (no API key at deploy time), R-08 (time runs out with a half-built journey — which is why step 6 above says thin end-to-end first).
