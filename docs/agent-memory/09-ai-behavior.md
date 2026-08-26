# 09 — AI Behaviour

**Status:** Contract defined. Not implemented.
**Provider: OpenAI, server-side only.** This is a competition requirement (R1/R2 in `02-competition-rules.md`), not a preference. Do not substitute another provider.

## Where AI is used (and only here)

| Job | Why AI | Failure cost |
|---|---|---|
| Understand the citizen's problem from free text (English / Hindi / Hinglish) | Genuine language work; no rule set can do it | Medium — recoverable by editing |
| Judge whether RTI is the right instrument, or whether this is a grievance, a court matter, or a request for an opinion | Requires reading intent, not keywords | **High** — a wrong "yes" costs the citizen 30 days and the fee |
| Draft a specific, records-based, answerable request | The single hardest step, and the one the portal helps with least | High — but visible and editable |
| Suggest the public authority, with reasoning and ranked alternatives | Mapping life-problems onto institutional names | **High** — a wrong office means transfer or a lost fee |
| Explain a government term in context | Small, useful, low risk | Low |

## Where AI is NOT used

Fee calculation · deadline arithmetic · character-limit and character-set validation · form validation · routing and state transitions · anything with a correct answer that code can compute. (PD-005.)

## Non-negotiable behaviours

1. **Every output is a proposal.** It is rendered in full, marked as generated, and is editable before it can be used (PD-004).
2. **The authority suggestion is constrained to the real list.** The model must select from the captured public-authority dataset; a name that is not in the list is a validation failure, not a result. This is the primary hallucination guard.
3. **Uncertainty is stated in words**, at the point of the claim — "I am not sure this office holds this; here are two others to consider" — never as a false-precision percentage.
4. **The model never asserts a fee, a deadline, a section number or a procedure.** Those come from the deterministic layer. If a draft contains one, it is stripped or replaced by the code path that owns it.
5. **Model output is untrusted input.** Structured output, schema-validated, length-clamped, character-set-filtered before it can reach the RTI request text.
6. **Prompt injection from user text is expected.** The citizen's description is data. Instructions inside it are ignored and, where relevant, surfaced to the citizen.
7. **Sensitive input is handled, not stored.** If the citizen pastes an Aadhaar or PAN number, the app warns and offers to remove it before it goes anywhere (the real portal explicitly forbids attaching these).

## Fallback (definition of done, not a stretch goal)

If the OpenAI call fails, times out, returns invalid structure, or no key is configured, the journey must still complete:

- The citizen keeps their own words as the request text.
- Authority selection falls back to deterministic keyword search over the real authority list, presented as a search box, clearly labelled as search rather than a recommendation.
- The app says plainly that the assistant is unavailable, and does not pretend otherwise.

`10-test-strategy.md` requires this path to be tested, not just implemented.

## Evaluation set (build before the feature — see `docs/evals/`)

Deterministic cases, each with an expected classification and expected refusal/uncertainty behaviour:

normal request · ambiguous request · one-word input · 5,000-character input · misspelled input · Hindi input · Hinglish input · a grievance that is not an RTI matter · a request for an opinion rather than records · a request for another person's personal information · a request missing the essential detail · input containing an Aadhaar-shaped number · direct prompt injection ("ignore previous instructions") · a hallucination trap naming a public authority that does not exist · a request aimed at a state authority (must warn: the central portal returns these **without refund**).

Results are logged in `11-evaluation-log.md` with date, version, input, expected, actual, pass/fail, fix, re-test. "The answer looked good" is not an evaluation.
