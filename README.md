# RTI Sarathi *(working name)*

An independent prototype that turns a citizen's plain-language problem into a correctly worded RTI request, aimed at the right public authority — built for the **Build What Moves India** hackathon.

> **This is not a government service.** It is an independent prototype. It is not affiliated with, endorsed by, or connected to the Government of India, the Department of Personnel & Training, or `rtionline.gov.in`. **It cannot file a real RTI application.** Filing, payment, OTP and status are simulated.

---

## Current state — research phase complete, no application code yet

| | |
|---|---|
| RTI Online audit | Done — [`docs/agent-memory/03-rti-site-inventory.md`](docs/agent-memory/03-rti-site-inventory.md) |
| Problem chosen | Recommended, awaiting ratification — [`docs/agent-memory/04-user-problem.md`](docs/agent-memory/04-user-problem.md) |
| MVP spec + acceptance criteria | Done — [`docs/design/mvp-spec.md`](docs/design/mvp-spec.md) |
| Application | **Not started** |
| Public URL | **Not deployed** |

**If you are an agent picking this up: read [`docs/agent-memory/13-agent-handoff.md`](docs/agent-memory/13-agent-handoff.md) first.**

## The problem

The Right to Information Act gives every Indian citizen the right to ask the government for records. `rtionline.gov.in` makes that right available but not usable. Before you can ask your question you must already know:

1. that what you want is called an RTI at all,
2. which of **~2,900 public authorities** in one flat dropdown holds the answer, and
3. how to word the request so it is legally answerable.

The portal helps with none of the three. Its own FAQ asks *"How do I write my application for seeking the information as per RTI Act 2005?"* and answers with nothing but a 3,000-character limit. And it documents the price of getting it wrong: a wrong central office means a transfer under s.6(3) and a new registration number; a **state** office means the application is returned **without refund of the fee**.

The gap is not information. It is translation. That is what this prototype does.

## What it will do

```
Describe your problem in your own words
  -> Is this an RTI matter?  (honest answer, including "no, go here instead")
  -> A drafted request, shown in full, explained, editable
  -> The right office, with the reasoning and ranked alternatives
  -> Review: what will be filed, the fee, the date you may appeal
  -> File (simulated) + the exact text to file for real
```

Built mobile-first, WCAG 2.2 AA as an acceptance criterion rather than a review step, and honest about every simulated part.

## What is real and what is simulated

**Real:** the 2,904 public authority names (captured read-only from the portal's own public listing on 2026-08-26), the fee and 30-day appeal rules, and the 3,000-character and allowed-character-set constraints. The guidance is produced by deterministic logic running in your browser — there is no language model at runtime, and nothing you type is sent anywhere.

**Simulated:** identity, filing, payment, OTP, registration numbers, and case status. Nothing is ever sent to any government system.

## Repository map

```
docs/agent-memory/   persistent project memory, 00-19 — read this first
docs/research/       the RTI Online audit and captured reference data
docs/design/         specifications and acceptance criteria
docs/adr/            architecture decision records
docs/evals/          assistant evaluation cases
docs/testing/        test plans and results
```

## Development

The stack is proposed but not yet ratified — see [`docs/adr/0002-stack.md`](docs/adr/0002-stack.md). Once the application exists, these commands are the agreed contract (`docs/agent-memory/10-test-strategy.md`):

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run eval
```

No API key or environment variable is required to run the product. Competition rule R1 is satisfied through Codex-assisted development, evidenced in [`docs/agent-memory/19-codex-contribution-log.md`](docs/agent-memory/19-codex-contribution-log.md); see ADR/PD-009 in [`docs/agent-memory/05-product-decisions.md`](docs/agent-memory/05-product-decisions.md).

## Research ethics

The audit of `rtionline.gov.in` was read-only. No RTI application, appeal, payment, login or OTP was ever submitted, no private or undocumented API was used, and no personal or restricted information was collected — only public institutional names. Details and the evidence labelling scheme are in [`docs/agent-memory/03-rti-site-inventory.md`](docs/agent-memory/03-rti-site-inventory.md).
