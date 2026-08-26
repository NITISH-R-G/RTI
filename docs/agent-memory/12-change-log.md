# 12 — Change Log

Newest first. One entry per meaningful change, with what was tested.

---

## 2026-08-26 — Session 1 — Research and memory foundation

**Agent:** Claude (Opus 5), Claude Code.

**Starting state:** working directory contained only an agent-skills scaffold (`.agents/`, `AGENTS.md` from an unrelated "SIH" project) and three `docs/agents/*.md` files. Not a git repository. The GitHub repo `NITISH-R-G/RTI` existed but was empty.

**Changed:**
- Initialised the git repository on `main` and added the `NITISH-R-G/RTI` remote.
- Audited `rtionline.gov.in` read-only: routes, the request and appeal flows, forms, validation behaviour, terminology, accessibility, mobile behaviour, and the public-authority list. Cross-read the portal's own 29-page citizen user manual and all 26 FAQ answers.
- Captured 2,904 unique public authority names to `docs/research/rti-online/public-authorities.json` (public institutional names only, no personal data).
- Created the persistent memory system under `docs/agent-memory/` (files 00–19) and the `docs/research/`, `docs/design/`, `docs/evals/`, `docs/testing/`, `docs/adr/` trees.
- Recommended the single problem to solve, with a ranked comparison against five alternatives (`04-user-problem.md`).
- Wrote the MVP specification with acceptance criteria and the first test plan (`docs/design/mvp-spec.md`).
- Recorded ADR-0001 (persistent memory system) and ADR-0002 (proposed stack, status *proposed*).
- Replaced the inherited `AGENTS.md` and wrote the project `README.md`.

**Tested:** nothing to test — no application code was written. The audit findings were each verified directly in the live DOM or read from the portal's own published documents, and are labelled [O]/[D]/[I]/[U] accordingly in `03-rti-site-inventory.md`.

**Then, on the project owner's decision (PD-009):** reworked the compliance and architecture story. Rule R1 is now satisfied through the brief's *"built with Codex"* branch rather than a runtime OpenAI API. The deployed prototype will call no LLM; the complete citizen journey runs on deterministic local logic behind an `Assistant` interface that a model could later implement. Rewrote `02`, `07`, `09`, `15`, `17`, `18`, `docs/design/mvp-spec.md` and the README accordingly, added `19-codex-contribution-log.md` as the R1 evidence file, and replaced KI-004 (no API key) with the real remaining issue: that log is empty. Added KI-008 — the domain taxonomy the rule-based assistant needs does not exist yet, and is now the largest design task in the project.

**Not done:** no application, no test infrastructure, no deployment, no stack ratification. The problem in `04-user-problem.md` is still awaiting owner ratification.

**Safety:** no RTI application, appeal, payment, login, or OTP was submitted. One empty-form POST was made to observe validation rendering; it creates no government record.
