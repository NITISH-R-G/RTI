# 05 — Product Decisions

Append-only. Do not silently reverse an entry: add a new one that supersedes it, with evidence, per master instruction §34.

---

### PD-001 — Do not clone the RTI Online portal
**Date:** 2026-08-26 · **Status:** Active
Rebuilding the portal would spend the whole budget on surface area the judges do not score. We build one journey the existing portal does not serve at all.
**Evidence:** `03-rti-site-inventory.md`; master instruction §2, §50.
**Do not revisit without:** a change in the competition brief.

### PD-002 — One problem: turning a real-life problem into a correctly aimed, correctly worded RTI
**Date:** 2026-08-26 · **Status:** Recommended, awaiting owner ratification
Chosen over five alternatives on user pain, AI usefulness, demo clarity and mocking cost.
**Evidence:** `04-user-problem.md` ranking table.
**Do not revisit without:** evidence that a different friction point costs citizens more.

### PD-003 — No real filing, payment, OTP, or login
**Date:** 2026-08-26 · **Status:** Active
The product produces a *ready-to-file* request and simulates everything downstream of it. This is a competition requirement (R5, R8) and also the honest design: we cannot promise delivery we do not control.
**Evidence:** `02-competition-rules.md`.
**Do not revisit.** Hard constraint.

### PD-004 — The citizen always sees, and can always edit, what the AI produced
**Date:** 2026-08-26 · **Status:** Active
No AI output is ever filed, or treated as final, without being shown in full and made editable. Applies to the drafted request text and the authority recommendation alike.
**Rationale:** the model can be wrong about a government fact, and the citizen bears the cost. Also the honest position for judging dimension "Honesty".
**Do not revisit.** Hard constraint.

### PD-005 — AI does language and judgement; ordinary code does rules
**Date:** 2026-08-26 · **Status:** Active
Fees, time limits, character limits, the allowed character set, validation, routing and state transitions are deterministic code. The model is used for intent understanding, RTI-suitability judgement, request drafting and authority *suggestion* only.
**Evidence:** master instruction §27; `09-ai-behavior.md`.

### PD-006 — The product states what is real and what is simulated, in the product
**Date:** 2026-08-26 · **Status:** Active
A persistent, non-dismissible disclosure, plus a dedicated page. Not buried in a README.
**Evidence:** R13, R15.

### PD-007 — Plain language is the default; legal wording appears only where it must, always glossed
**Date:** 2026-08-26 · **Status:** Active
Where the RTI Act's own phrasing carries legal meaning, we keep it in the generated request text but never make the citizen read it to make a decision.
**Evidence:** master instruction §45, §46; terminology map in `03-rti-site-inventory.md` §6.

### PD-008 — Mobile-first, accessibility as an acceptance criterion, not a review step
**Date:** 2026-08-26 · **Status:** Active
Every route must pass its accessibility criteria before it is marked complete in `18-verification-matrix.md`. The baseline portal fails WCAG on labels, viewport, landmarks and moving content; matching it is not the bar.
**Evidence:** `03-rti-site-inventory.md` §7.
