# 05: Product Decisions

Append-only. Do not silently reverse an entry: add a new one that supersedes it, with evidence, per master instruction §34.

---

### PD-001: Do not clone the RTI Online portal
**Date:** 2026-08-26 · **Status:** Active
Rebuilding the portal would spend the whole budget on surface area the judges do not score. We build one journey the existing portal does not serve at all.
**Evidence:** `03-rti-site-inventory.md`; master instruction §2, §50.
**Do not revisit without:** a change in the competition brief.

### PD-002: One problem: turning a real-life problem into a correctly aimed, correctly worded RTI
**Date:** 2026-08-26 · **Status:** Recommended, awaiting owner ratification
Chosen over five alternatives on user pain, AI usefulness, demo clarity and mocking cost.
**Evidence:** `04-user-problem.md` ranking table.
**Do not revisit without:** evidence that a different friction point costs citizens more.

### PD-003: No real filing, payment, OTP, or login
**Date:** 2026-08-26 · **Status:** Active
The product produces a *ready-to-file* request and simulates everything downstream of it. This is a competition requirement (R5, R8) and also the honest design: we cannot promise delivery we do not control.
**Evidence:** `02-competition-rules.md`.
**Do not revisit.** Hard constraint.

### PD-004: The citizen always sees, and can always edit, what the AI produced
**Date:** 2026-08-26 · **Status:** Active
No AI output is ever filed, or treated as final, without being shown in full and made editable. Applies to the drafted request text and the authority recommendation alike.
**Rationale:** the model can be wrong about a government fact, and the citizen bears the cost. Also the honest position for judging dimension "Honesty".
**Do not revisit.** Hard constraint.

### PD-005: AI does language and judgement; ordinary code does rules
**Date:** 2026-08-26 · **Status:** Active
Fees, time limits, character limits, the allowed character set, validation, routing and state transitions are deterministic code. The model is used for intent understanding, RTI-suitability judgement, request drafting and authority *suggestion* only.
**Evidence:** master instruction §27; `09-ai-behavior.md`.

### PD-006: The product states what is real and what is simulated, in the product
**Date:** 2026-08-26 · **Status:** Active
A persistent, non-dismissible disclosure, plus a dedicated page. Not buried in a README.
**Evidence:** R13, R15.

### PD-007: Plain language is the default; legal wording appears only where it must, always glossed
**Date:** 2026-08-26 · **Status:** Active
Where the RTI Act's own phrasing carries legal meaning, we keep it in the generated request text but never make the citizen read it to make a decision.
**Evidence:** master instruction §45, §46; terminology map in `03-rti-site-inventory.md` §6.

### PD-008: Mobile-first, accessibility as an acceptance criterion, not a review step
**Date:** 2026-08-26 · **Status:** Active
Every route must pass its accessibility criteria before it is marked complete in `18-verification-matrix.md`. The baseline portal fails WCAG on labels, viewport, landmarks and moving content; matching it is not the bar.
**Evidence:** `03-rti-site-inventory.md` §7.

### PD-009: No LLM at runtime; competition rule R1 satisfied via Codex-assisted development
**Date:** 2026-08-26 · **Status:** Active · **Decided by:** project owner
The brief allows either "built with Codex" **or** "powered by an OpenAI model". We take the first branch. The deployed prototype makes no LLM call; the complete citizen journey runs on deterministic local logic. Codex's contribution is evidenced per-commit in `19-codex-contribution-log.md`.
**Supersedes:** the runtime-OpenAI assumption written into `02`, `07` and `09` earlier the same day.
**Rationale:** no paid API dependency in the demo; no key to leak; no latency; no hallucination risk; nothing the citizen types leaves their browser. The cost is that intent understanding must be earned with a structured interview and authored templates rather than borrowed from a model.
**Consequences:** the assistant sits behind one interface (`09-ai-behavior.md`) with a rule-based implementation shipping and a model implementation possible later; the product must never imply a model is reasoning when none is; `19-codex-contribution-log.md` must stay truthful, because it is the R1 evidence.
**Do not revisit without:** the project owner's decision.

### PD-010: Final product thesis: bridge problem-language to institutional language
**Date:** 2026-08-26 · **Status:** Active · **Supersedes:** PD-002 (which was a pre-authentication recommendation)

**Problem.** RTI Online requires citizens to translate a real-world problem into institutional terminology before the system will help them: and refuses them outright when they cannot.

**Evidence** `[O]`, authenticated, route `request/request.php`: typing `my pension has not been paid` into `Search Public Authority` returns **"No such Public Authority available in this portal !"**, while `Department of Pensions & Pensioners Welfare` exists in the ministry cascade on the same screen. Supporting: the two required authority dropdowns (96 → 184) sit above any question about what the citizen wants; `passport` returns 3 irrelevant results of 4. Full chains in `docs/design/evidence-to-design.md`.

**Alternatives reconsidered against the authenticated evidence** (not merely inherited from the Session 1 ranking):
- *C2, routing only.* Rose 22 → 24 on the new evidence, but still leaves the citizen to word a request the portal gives no help with. Rejected as a strict subset of C1.
- *C3, tracking and the appeal clock.* Unchanged at 19. It repairs downstream what C1 prevents upstream, and needs heavy fake case data.
- *C4, accessible mobile re-skin.* Fell 18 → 17 when the authenticated form turned out to carry `lang` and a viewport meta: then partly recovered when it proved not to reflow (985 px at a 360 px constraint). Still rejected as a standalone product: it fixes presentation, not the dead end. Its substance is absorbed into C1 as acceptance criteria (ED-006, ED-007).
- *C5 payment anxiety, C6 appeal drafting.* Unchanged; no new evidence.

**Why C1 wins, restated on observed grounds.** It is the only candidate whose central failure we watched happen, reproducibly, with a verbatim government error message, on a request the system was capable of answering. Every other candidate is a repair downstream of it.

**Explicitly not being solved.** Real filing · payment · OTP · accounts · first and second appeals · state RTI portals · CPIO/admin views · identity collection · general-purpose RTI question answering · full coverage of all RTI subjects.

**Success criteria.**
1. A participant reaches a relevant authority recommendation **without typing any institutional name** (S1–S4).
2. Zero dead ends: every out-of-coverage input still reaches a useful onward route (S5–S7, S9).
3. Zero horizontal overflow at 360 px; zero touch targets under 44 px; zero axe serious/critical violations.
4. All validation completes with no network call.
5. The complete journey runs with no LLM, no API key and no network (PD-009).
6. Taxonomy coverage across the evaluation set is measured and reported, not hidden.

**Risks.** R-02 (the rule-based assistant feels rigid on real free text) · R-17 (we dead-end citizens the same way) · R-16 (overstating the improvement) · R-08 (time runs out with a half-built journey).

**Reversibility.** High for the taxonomy (add or remove domains without touching the journey). Medium for the screen order. **Low for the founding inversion**: problem before institution *is* the product; reversing it means abandoning the thesis.
