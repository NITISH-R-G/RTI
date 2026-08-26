# 12 — Change Log

Newest first. One entry per meaningful change, with what was tested.

---

## 2026-08-26 — Session 2 — Authenticated audit of RTI Online

**Agent:** Claude (Opus 5), Claude Code, driving the owner's real Chrome. **Authentication performed manually by the project owner** (email + mobile + CAPTCHA + OTP); the agent entered no credentials.

**Discovered and persisted:**
- The authenticated **Online RTI Request Form** (`request/request.php`) in full — 40 visible inputs with names, types, maxlengths, conditionals and verbatim instructional text. New file `docs/research/rti-online/authenticated-form-structure.md`.
- The journey end-to-end up to the irreversible boundary. New file `authenticated-flow-map.md`. **Submission and payment were never crossed and are marked as deliberately not observed.**
- Ten reproducible friction points with citizen impact and severity. New file `authenticated-friction-map.md`.
- The 96-entry ministry list, 35 states, the Railways cascade sample and three search-behaviour experiments. New file `ministries.json`.
- Screenshot inventory plus an honest record that image files **cannot be persisted** in this environment. New file `screenshots/README.md`.

**Headline finding** `[O]`: typing `my pension has not been paid` into `Search Public Authority` returns **`No such Public Authority available in this portal !`**, while `Department of Pensions & Pensioners Welfare` sits in the ministry cascade on the same screen. The portal requires citizens to translate a problem into institutional vocabulary before it will help, and refuses them when they cannot.

**Corrections to Session 1 — kept visible, not deleted:**
1. The authority picker is **not** a flat 2,900-item dropdown. It is a searchable two-level cascade (96 ministries → cascaded authorities). The 2,904 figure describes the separate `allpa.php` catalogue page.
2. Accessibility findings A1 (no viewport meta) and A2 (no `lang`) are **page-scoped, not portal-wide** — `/index.php` lacks both; the authenticated form has both.
3. An intermediate hypothesis during this session that the form never discloses the fee was **wrong**: `BPL = No` reveals "You are required to pay the RTI fee of ₹ 10" and relabels the button to "Make Payment".

**Re-ranked** the candidate problems in `04-user-problem.md` against the new evidence: C1 rises 27 → 29 and its problem statement is sharpened; C4 falls 18 → 17.

**Privacy:** the authenticated form arrived pre-filled with the owner's real email and mobile. Both were replaced with synthetic values in the DOM before any capture or further interaction. No personal data entered the repository.

**Tested:** no application code exists, so no test suite was run. All findings carry evidence tags and reproduction steps.

**Not done / outstanding:** exact validation dialog text, the 360 px mobile audit, and the `Country = Other` branch (KI-009).

**Process correction:** the owner identified that findings were being reported in chat before being written to the repository. This session's checkpoint persisted everything discovered before the audit resumed. The rule now stands: discover → write → verify → continue.

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
