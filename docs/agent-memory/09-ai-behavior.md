# 09: AI Behaviour

**Status: IMPLEMENTED AND VALIDATED (Phase 2.5, 2026-08-26).** The reasoning pipeline exists as pure functions in `src/reasoning/`, is validated against a 60-case corpus written before it, and scores 60/60 with 0 dead ends and 0 fabricated authorities. Architecture: `docs/design/deterministic-reasoning.md`. Results and full tuning history: `docs/evals/taxonomy-evaluation.md`. **Held-out generalisation measured 93.8% before the final fix; that set is now burned and a future session needs fresh inputs.**

## The governing decision (PD-009, 2026-08-26)

**The deployed prototype does not call any LLM at runtime.** Competition rule R1 is satisfied through the *"built with Codex"* branch of the requirement: meaningful Codex-assisted development, evidenced in `19-codex-contribution-log.md`: not through a paid runtime API.

Consequences, and they are binding:

1. **The complete citizen journey must work with no API key, no network call, and no model.** Not a fallback path: the *only* path, until and unless someone decides otherwise.
2. Every behaviour below is delivered by deterministic code running locally.
3. All of it sits **behind one clean interface** so a model can be dropped in later without touching the UI.
4. **Nothing in the product may imply a language model is reasoning when none is.** No fake "thinking" states, no "AI is analysing…", no confidence theatre. The product explains its actual method when asked.

## The interface: as built

`src/reasoning/pipeline.js` exports a single synchronous entry point:

```
run(rawInput) -> {
  classification, domain, confidence, confidence_band, next_action,
  candidate_authorities, reasoning, required_questions,
  information_types, warnings, trace
}
```

Synchronous and pure: no Promise, because there is nothing to await. A future `ModelAssistant` would wrap this shape behind an async facade; the UI must not be able to tell which is in use.

Domains are **data** (`src/reasoning/taxonomy.js`); the pipeline is generic. Adding a domain means adding a record, not editing control flow.

## What the rule-based assistant must actually do

This is the hard engineering of the product. It is not a keyword lookup with a nice skin.

| Job | Deterministic approach | Honest limits |
|---|---|---|
| Understand the problem | A short structured interview: the citizen's free text is used to pre-select a **domain** from the curated taxonomy: **frozen at five: pension, provident fund, passport, railways, income tax refund** (`docs/design/mvp-spec.md`); anything ambiguous is *asked*, not guessed | Cannot parse arbitrary prose. Compensates by asking rather than inventing |
| Judge RTI suitability | Rules over the structured answers: is the citizen asking for **records that exist** (suitable), for **action or redress** (a grievance, route to CPGRAMS), for an **opinion or a reason** (not answerable under RTI), or for **someone else's personal information** (exempt) | Rules are explicit and testable, and the reasoning is shown, which the portal never does |
| Draft the request | Template composition: a domain template plus the citizen's own specifics (period, subject, reference), producing a records-based question that names a period and a subject and asks for no opinions | Templates must be authored per domain; coverage is finite and the product says so |
| Suggest the authority | Ranked search over the real 2,904-name dataset, driven by the domain taxonomy plus token/acronym matching, with the reasoning surfaced and a full search always available | Ranking is heuristic; the citizen always sees alternatives and can override |
| Explain a term | Static glossary from `03-rti-site-inventory.md` §6, shown at the point of use | Exact and reviewable: an advantage over generated text |

**Deliberate trade:** the interview asks two or three more questions than a model would. It buys correctness, testability, zero cost, zero latency, and zero hallucination risk. That is a defensible product position, and `11-evaluation-log.md` must measure whether it holds up against real inputs.

## Non-negotiable behaviours (unchanged by PD-009)

1. **Every generated output is a proposal**: shown in full, editable, never final without the citizen seeing it (PD-004).
2. **Authority names come only from the real dataset.** A name not in `public-authorities.json` cannot be rendered.
3. **Uncertainty is stated in words**, at the point of the claim, never as a percentage.
4. **Fees, deadlines, section numbers and limits come from the rules module**, with citations, never from a template's prose.
5. **Citizen input is untrusted data.** It is never interpreted as instructions, is length-clamped, and is character-set-filtered before it reaches the request text.
6. **Sensitive input is caught, not stored.** An Aadhaar- or PAN-shaped number triggers a warning and an offer to remove it.
7. **Nothing the citizen types leaves their browser** while there is no runtime model. This is now a genuine privacy property and the product may say so.

## If a model is added later

It may only be added behind `ModelAssistant`, server-side, with the key never reaching the client; its output must be schema-validated, clamped, and constrained to the real authority list; the rule-based path must remain the working fallback; and `02-competition-rules.md` must be updated with the pinned model id. Adding it must not become the reason the journey stops working without it.

## The frozen taxonomy

The domain set, the reasoning for each domain, the unsupported-case handling (state-subject detector, not-RTI detector, out-of-coverage) and the taxonomy record shape are **frozen in `docs/design/mvp-spec.md` v1.0**. Do not re-derive them here; this file governs *behaviour*, that file governs *scope*.

## Evaluation set (build before the feature: see `docs/evals/`)

The cases are unchanged by PD-009: a rule-based assistant must survive them just as a model would, and several are *easier* to pass honestly:

**Superseded by `docs/evals/citizen-scenarios.md`**, which specifies 15 scenarios (S1–S15) with explicit failure conditions and seven universal failure conditions. That file is the eval suite; this list is retained only as the rationale for its shape.

Expected behaviour for out-of-coverage input is **"I don't have a template for this: here is the search, and here is what a good request looks like"**, never a confident wrong answer. Results logged in `11-evaluation-log.md`.
