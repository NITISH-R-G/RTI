# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Existing codebase: Vite + React 19 + TypeScript + Tailwind CSS v4, React Router (client-side, static site, no backend). Not asked fresh this session; inferred from `package.json` and confirmed correct by extensive prior work in this repository.

## Users

A citizen with a real grievance against a central government body, most commonly around a pension, provident fund, passport, railway matter, or income tax refund, who does not know which office holds the records they need. Confirmed via interview (2026-08-27).

## Product Purpose

Turns a citizen's own description of what happened into a correctly-addressed Right to Information (RTI) request, and tells them which public authority to send it to. Success means the citizen leaves with a request addressed to a real office that actually holds the relevant records, something the live RTI portal (rtionline.gov.in) frequently fails to do.

## Positioning

Problem-first, not office-first: a deterministic rules engine derives the authority from the citizen's own words. The real RTI portal requires naming the office before it will accept a query, and returns "No such Public Authority available in this portal!" for a plain-language problem description even when the correct office is listed elsewhere on the same screen. This product reverses that order. Confirmed via interview (2026-08-27).

## Operating Context

A single continuous journey: describe what happened, answer at most a few clarifying questions, choose what information to request, receive an explained authority recommendation (with an easy override/search), review everything before "filing," and see a mock filed/tracking state. No login, no server, no persisted account; state lives in the browser only.

## Capabilities and Constraints

- Covers five domains in depth (central pensions, EPFO provident fund, passports, railways, income tax refunds); anything else gets an honest "this may not be RTI" answer, not a guess.
- **No runtime AI/LLM.** The reasoning engine (`src/reasoning/`) is deterministic, hand-written rules and a hand-built vocabulary, not a language model call. This is a competition compliance requirement (rule R1, satisfied via "built with Codex" rather than a runtime API) and a product honesty commitment; it must not be silently violated by future work. Established via repository evidence (`docs/agent-memory/`), not re-asked this session per the interview's "It's a prototype, not a real filer" answer plus prior extensively documented decision PD-009.
- **It is a prototype, not a real filer.** Confirmed via interview (2026-08-27): nothing is ever submitted to a real government system; the "filed" state is an explicit mock, always labeled as such.
- Grayscale-core visual direction (black/white/grayscale, colour reserved for the fee/wrong-office warning) is a standing decision from `docs/design/visual-direction-v2.md`, established via repository evidence, not re-interviewed this session.

## Brand Commitments

Name: "RTI Sarathi." No em dashes anywhere in UI copy, source comments, tests, documentation, or commit messages, an absolute project-wide rule established earlier this session and enforced by `scripts/check-em-dash.js` in `npm test`.

## Evidence on Hand

The founding evidence is real: a human-completed, authenticated session on the actual RTI portal (26 August 2026) where typing "my pension has not been paid" into the portal's authority search returned "No such Public Authority available in this portal !" while the correct department existed in a dropdown on the same screen. Documented in `docs/agent-memory/` and shown on the Landing screen itself (`data-evidence-quote`). No fabricated testimonials, customer logos, or press exist anywhere in the product; the About screen states this explicitly.

## Product Principles

- Never a dead end: an unsupported or ambiguous problem gets a genuine next step, never a bare refusal.
- Never imply certainty the reasoning engine does not have; show confidence bands and easy overrides.
- The reasoning is inspectable rules, not a black box, and this is said in the product itself, not just in documentation.
- Colour is spent on exactly one thing: the moment a wrong office or an unrefunded fee is at stake.
- The citizen remains in control at every step; nothing is auto-submitted, nothing is hidden from them before it happens.

## Accessibility & Inclusion

WCAG AA contrast and 44px minimum touch targets are enforced by an automated test suite (`e2e/a11y.spec.ts`, `e2e/contrast.spec.ts`, `e2e/journey.spec.ts`), not a one-time manual check. Multilingual readiness (Devanagari-compatible typography) is a standing architectural requirement even though full translation is not yet implemented; established via repository evidence (`docs/design/ux-research.md`), not re-interviewed this session.
