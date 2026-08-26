# 13 — Agent Handoff

**Last updated:** 2026-08-26, end of Session 1 (Claude Opus 5, Claude Code).

> **Read PD-009 first.** Mid-session the project owner decided the prototype will use **no LLM at runtime**; competition rule R1 is satisfied through Codex-assisted development instead. `02`, `04`, `07`, `09`, `15`, `17`, `18` and the MVP spec were all rewritten to match. Anything you remember or read elsewhere about a runtime OpenAI dependency is superseded.

## What is currently working

Nothing runs. There is no application. What exists is a complete, evidence-labelled research foundation and a specified MVP.

## What is currently broken

Nothing is broken. Nothing is built.

## What changed most recently

Session 1 initialised the repository, audited `rtionline.gov.in` read-only, captured the real public-authority list, created the `docs/agent-memory/` system (00–19), recommended the problem to solve, and wrote the MVP spec with acceptance criteria and a first test plan. Full detail: `12-change-log.md`.

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

1. **Get PD-002 ratified** — the project owner is reading `04-user-problem.md` and has not yet confirmed the problem. Everything downstream assumes it. The product name (open question 2) is still open too, and is cheap to settle.
2. **Ratify or replace `docs/adr/0002-stack.md`** and flip its status line. Do not write application code before this. Note that PD-009 removed the need for any server route, so re-examine whether Next.js is still the right answer versus a static export or a Vite SPA (`07-technical-architecture.md`, Open decisions).
3. **Scaffold the project with its test runner in the same commit** — the command contract in `10-test-strategy.md` (`dev`, `build`, `typecheck`, `lint`, `test`, `test:e2e`, `eval`) must work from day one.
4. **Build the deterministic rules module first, test-first**: fee, appeal date, 3,000-character limit, allowed character set, sanitisation, authority search. Pure functions, no dependencies. Test cases 1–7 in `docs/design/mvp-spec.md`.
5. **Design the domain taxonomy (KI-008).** This is the largest remaining design task and, since PD-009, the thing the product's quality actually rests on: domains, the interview questions that resolve them, one request template each, and domain-to-authority mappings. Do not skip to UI before this has a shape.
6. **Enrich the public-authority dataset** (KI-003) — at minimum a central-vs-state/UT flag, which is what powers the "returned without refund" warning in F4.
7. Then the journey, thinnest end-to-end version first (`/` through `/filed/[id]`), keeping a working demo path at every commit.

**If you are Codex:** record what you built in `19-codex-contribution-log.md` as you go. That log is this submission's evidence for competition rule R1 and it is currently empty. If you are not Codex, log to `12-change-log.md` instead and leave 19 alone.

## Assumptions currently being made

- The competition brief is as relayed in the master instructions; no primary copy of it is in this repository.
- The problem C1 is the right one. It is a *recommendation*, ranked against five alternatives, not yet ratified.
- The stack in ADR-0002 is a proposal, not a decision, and PD-009 changed its premises.
- A rule-based assistant can carry this journey convincingly. This is the biggest untested product assumption in the project; the eval set exists precisely to find out (R-02).
- The public-authority list captured on 2026-08-26 is representative. It is a snapshot; the product must never call the live portal at runtime.

## Decisions that must NOT be revisited without evidence

`05-product-decisions.md` in full. Especially: PD-001 (do not clone the portal), PD-003 (no real filing/payment/OTP/login), PD-004 (every generated output shown and editable), and **PD-009 (no runtime LLM; R1 satisfied via Codex-assisted development)** — an owner decision, not an agent's.

## Most important files

`docs/agent-memory/03-rti-site-inventory.md` (the evidence) · `04-user-problem.md` (the why) · `docs/design/mvp-spec.md` (the contract) · `docs/research/rti-online/public-authorities.json` (the real data) · `02-competition-rules.md` (the constraints that can disqualify).

## Commands to run

None yet — no application exists. The contract they must satisfy when created is in `10-test-strategy.md`.

## Current demo path

None. `00-project-state.md` carries the planned flow; fill in the real one as soon as the first route ships.

## Known risks

`15-risk-register.md`. The four that would hurt most: **R-01** (`19-codex-contribution-log.md` stays empty, so the R1 claim cannot be evidenced), **R-02** (the rule-based assistant feels rigid on real free text), **R-08** (time runs out with a half-built journey — which is why step 7 says thin end-to-end first), and **R-13** (the product implying a model is reasoning when none is).
