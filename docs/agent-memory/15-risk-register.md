# 15 — Risk Register

| ID | Risk | Likelihood | Impact | Mitigation | Owner/Status |
|---|---|---|---|---|---|
| R-01 | The runtime AI is not an OpenAI model, breaking competition rule R1 | Low | **Fatal** — disqualification | Written as a standing prohibition in `02-competition-rules.md`; the model id must be pinned and recorded as evidence | Open |
| R-02 | No OpenAI key available at deploy time, so the demo runs only on the fallback path | Medium | High | Deterministic fallback is a definition-of-done item, but it is not a substitute for R2 "meaningful AI". Escalated to the owner (`04` open question 3) | Open |
| R-03 | The model recommends a public authority that does not exist, or the wrong one, and the citizen trusts it | Medium | High | Constrain selection to the captured real list; reject anything outside it; always show reasoning and alternatives; always editable (PD-004) | Open |
| R-04 | The model states a fee, deadline or section number that is wrong | Medium | High | Those facts come only from the deterministic layer; generated text is stripped of them (`09-ai-behavior.md` rule 4) | Open |
| R-05 | The prototype is mistaken for an official government service | Low | **High** — rule R13 | Distinct name, no emblem or government mark, permanent disclosure in-product, visibly fake registration numbers | Open |
| R-06 | An API key or secret is committed | Low | High | `.gitignore` covers `.env*`; secret scan required before each milestone (master instruction §33) | Mitigated, needs the scan step automated |
| R-07 | Scope creep into a portal clone or an admin console | Medium | High | PD-001, R6, and the out-of-scope list in `04-user-problem.md` | Open |
| R-08 | Time runs out with a half-built journey | Medium | **High** — "Working build" is a judging dimension | Build the journey end-to-end thin first, then deepen. Keep a working demo path at every commit | Open |
| R-09 | Prompt injection through the citizen's own description | Medium | Medium | Treat the description as data; injection cases are in the eval set (`09-ai-behavior.md`) | Open |
| R-10 | A citizen pastes real personal data (Aadhaar/PAN) into the prototype | Medium | Medium | Detect and warn before it leaves the browser; never persist server-side | Open |
| R-11 | Accessibility claims are asserted but not measured | Medium | Medium | axe gate per route in CI; `18-verification-matrix.md` may not be marked complete without evidence | Open |
| R-12 | The captured public-authority list drifts from the live portal | Low | Low | Dated and sourced in the JSON; it is a research snapshot, not a live feed, and the product must never call `*.gov.in` at runtime (R8) | Accepted |
