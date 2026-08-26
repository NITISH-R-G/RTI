# Fresh-reviewer audit

**Date:** 2026-08-27 · **Method:** the running application only, from a cleared browser state, without re-reading source during the pass.

## Honesty about this audit's limits — read first

**I built this product, so I cannot be a genuinely fresh reviewer.** No amount of procedure fixes that. What this pass *can* do is approach the running application as an artefact, from the first viewport, and record what is and is not visible on screen without appealing to what I know is in the code or the docs. Where I caught myself supplying missing context from memory, I have marked it.

**A real outside reviewer is still needed and has not happened.** Do not present this document as independent user testing.

Findings below are recorded as written during the pass. They are **not** edited after the fact.

---

## The ten questions

### 1. What problem appears to be solved?

From the first viewport alone: *"a form that helps you write an RTI request"*. The lede says you do not need to know which office is responsible — which is the thesis — but it is one clause inside a paragraph, competing with a heading, a progress bar and a disclosure banner.

**What is NOT visible on screen one:** that the existing portal *refuses* people who describe their problem. The entire evidential basis of the project — the observed `No such Public Authority available in this portal !` — appears only on `/about`, which a judge may never open.

**Verdict: the problem is stated, the problem is not demonstrated.**

### 2. Who appears to have the problem?

Not stated anywhere on screen one. The examples (pension, PF, passport) imply an ordinary citizen dealing with a stuck government process, which is right — but it is inferred from three example buttons below the fold, not asserted.

### 3. Can the first screen be understood quickly?

Yes. "What happened?" plus one labelled box is unambiguous. Under three seconds to know what to do.

### 4. Is it obvious what the user should do next?

Yes. Single primary button, single input.

### 5. Does the flow ever feel confusing?

No point felt confusing. The step counter jumping 1 → 3 (because clarification resolves in one question) is momentarily odd but harmless.

### 6. Does the user understand why questions are being asked?

Yes, and this is a strength. The clarify screen states *"this decides which office holds your records"* and carries a notice explaining that a state office returns the application and the fee is not refunded. That is a better justification than most consumer products give.

### 7. Does the authority recommendation feel trustworthy?

Mostly yes — "Based on what you told us", the named office, three reasons, and three clearly-ranked actions. Two problems:

- **Copy defect (observed):** the third reason reads *"You are asking for when was my pension last paid, what is the current status, why has it been delayed — records of that kind are held by the office that processes the case."* Splicing question-form labels into a sentence is grammatically broken. It reads as machine-generated, which undercuts exactly the trust this screen is trying to build.
- The reasoning is good but the *provenance* is not visible here. Nothing on this screen says the office name came from the portal's own published list. That fact is a credibility asset and it is spent only on `/about`.

### 8. Does the user understand what is mocked?

Yes, strongly. The persistent banner, the review warning block, and the "Demo confirmation" on the filed screen are all unambiguous. This is the best-executed dimension of the product.

### 9. Does the experience feel complete?

Yes. Nothing is a stub, every button does something, the journey ends somewhere useful with the text to actually file.

### 10. Where would a judge lose confidence?

Ranked:

1. **They never learn what makes this different.** If a judge does not open `/about`, they see a well-made form. The comparison that justifies the whole project is one click off the main path.
2. **The awkward reasoning sentence** on the most important screen.
3. **"RTI Sarathi"** — a judge who does not know the word *sarathi* gets no signal from the name. Not fatal, but the name does no work.
4. **Six steps** reads as long at a glance, even though the real path is short.

---

## Fresh perception vs intended thesis

| Intended | What the running product actually communicates | Gap |
|---|---|---|
| The portal refuses problem-language; we accept it | "We work out the office for you" | **The refusal is never shown.** The claim is asserted, never evidenced, inside the journey |
| Authority is derived *after* the request | Visible in the step order, but never *named* as a deliberate inversion | Judge must infer it |
| Names come from the portal's own real list | Stated on `/about` only | Credibility asset unspent where it matters |
| We ask rather than guess | Well communicated on clarify | **No gap** |
| Everything is mocked and we say so | Communicated everywhere | **No gap** |
| No AI, deterministic by choice | Stated on `/about` only | Judge may assume there *is* an LLM, which is a competition-relevant misread |

---

## Findings to act on

| ID | Finding | Severity | Action |
|---|---|---|---|
| FR-1 | The differentiator is invisible on the main path; the observed failure lives only on `/about` | **Critical for judging** | Surface the before/after contrast in the journey itself, without turning the landing page into a pitch deck |
| FR-2 | Ungrammatical reasoning sentence on the authority screen | High | Rewrite the sentence construction |
| FR-3 | Provenance of authority names not visible where the recommendation is made | Medium | State it on the authority screen |
| FR-4 | Deterministic-by-design not visible in the journey | Medium | Fold into the same surfacing as FR-1/FR-3, not as a separate boast |
| FR-5 | Product name carries no meaning for an unfamiliar judge | Low | Accept, or pair with a descriptive line |
| FR-6 | "Step 1 of 6" reads long | Low | Accept — accurate, and the progress bar is reassuring once moving |

**FR-1 is the single highest-value change available in Phase 4.** Everything else in this document is secondary.
