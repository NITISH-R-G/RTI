# 13 — Agent Handoff

**Last updated:** 2026-08-26, Session 2 (Claude Opus 5, Claude Code) — mid-audit persistence checkpoint.

> **Read two things first:** PD-009 (no runtime LLM; competition rule R1 is satisfied through Codex-assisted development) and the **Context Recovery Snapshot** immediately below.

## Context Recovery Snapshot

**Assume the previous agent's context is gone. This section is the recovery point.**

### What was being done
An **authenticated audit** of `rtionline.gov.in`. Session 1 could only reach an OTP wall. In Session 2 the project owner manually completed email + mobile + CAPTCHA + OTP in their own Chrome, and the agent then audited the real **Online RTI Request Form**. The agent entered no credentials at any point.

### What was discovered
All of it is written down — see "Files to read first". The single most important finding:

> Typing `my pension has not been paid` into the form's `Search Public Authority` box returns **`No such Public Authority available in this portal !`**, while `Department of Pensions & Pensioners Welfare` exists in the ministry cascade on the same screen. `[O]`

Supporting findings: a two-level ministry-to-authority cascade (96 options, then 184 for Railways); a search that matches institutional names rather than needs (`passport` returns 3 irrelevant results of 4); 40 visible inputs with **zero** `<label>` elements; the fee disclosed only after answering BPL; the submit button relabelling to `Make Payment`; the restricted character set enforced only at submit with no live counter; a second CAPTCHA after the OTP; and back-navigation breaking the single-use OTP token.

### What was changed
Created `docs/research/rti-online/authenticated-form-structure.md`, `authenticated-flow-map.md`, `authenticated-friction-map.md`, `ministries.json`, `screenshots/README.md`. Updated memory files `03`, `04`, `12`, `14`, `15`, `18` and this file. **Three Session 1 claims were corrected, with the superseded wording kept visible.**

### What was tested
No application code exists, so no test suite ran. Audit findings were verified in the live DOM or read from official material, and every one carries an evidence tag.

### Browser state
The owner's Chrome, tab `1398493818`, on `https://rtionline.gov.in/request/request.php?emailchk=...&cellchk=...&urletoken=...`. **A native `alert()` dialog is open on that tab** and browser automation cannot read or dismiss it — the page will not respond to script injection until a human clicks OK. The form on that tab holds only synthetic values. A submit guard (`preventDefault` plus `stopImmediatePropagation`, capture phase) was installed, so the form cannot submit.

### What is blocked
1. The **exact validation dialog text** — needs a human to read it out (KI-009).
2. Any further authenticated interaction — needs that dialog dismissed, and if the session has since expired, a fresh human OTP.

### What is pending
The 360 px mobile audit of the authenticated form; the `Country = Other` branch; and the owner-requested deliverables under "What the next agent should do first".

### Important assumptions
- The observed form is representative of what all citizens see. Only one session, one browser and one authenticated identity were observed. `[I]`
- The taxonomy approach (PD-009) can bridge problem-language to institutions well enough to beat the observed baseline. **Untested — the project's biggest open assumption** (R-02, R-17).

### Important corrections — do not reintroduce the old claims
1. The authority picker is **not** a flat 2,900-item dropdown; it is a searchable two-level cascade. The 2,904 figure describes the separate `allpa.php` catalogue page.
2. Accessibility findings A1/A2 are **page-scoped**: `/index.php` lacks `lang` and a viewport meta; the authenticated form has both.
3. The form **does** disclose the ₹10 fee — conditionally, once `BPL = No` is chosen.

### Important URLs / routes
`rtionline.gov.in/` then `guidelines.php?request` then `request/request_email_check.php` then `request/Request_Check_Otp.php` then `request/request.php?emailchk=...` then **`Make Payment` — never crossed**.

### Commands to run
None — no application exists. The contract for when one does is in `10-test-strategy.md`.

### Git state
Working tree clean as of this commit; all Session 2 findings committed and pushed to `origin/main` at `https://github.com/NITISH-R-G/RTI`. Run `git log --oneline -3` for the latest.

### Files to read first
1. `docs/research/rti-online/authenticated-friction-map.md` — the ten reproducible failures, with severity
2. `docs/research/rti-online/authenticated-form-structure.md` — the complete form
3. `docs/research/rti-online/authenticated-flow-map.md` — the journey and where we stopped
4. `docs/agent-memory/04-user-problem.md` — the re-ranked problem
5. `docs/agent-memory/02-competition-rules.md` — the constraints that can disqualify

---

## What is currently working

Nothing runs. There is no application. What exists is an evidence-labelled research foundation, now including a direct authenticated audit.

## What is currently broken

Nothing in the project. One external blocker: the modal dialog on the browser tab described above.

## What failed / could not be done

- **Exact validation dialog text** — native `alert()`, outside the page, unreadable by browser automation. `[U]`
- **Screenshots cannot be persisted** in this environment — no image files exist in the repository (KI-010). Visual findings survive as verbatim text, DOM measurements and reproduction steps.
- **360 px mobile audit** and the **`Country = Other`** branch — not run before the persistence checkpoint.

## What the next agent should do first

**In this order. The owner has explicitly asked that implementation NOT start until steps 1-3 are done and reviewed.**

1. **Finish the authenticated audit** (KI-009) — needs a human at the browser: read out the dialog text, dismiss it, then run the 360 px mobile audit and the `Country = Other` branch. Persist each group of findings *as it is discovered*, not at the end.
2. **Write `docs/design/before-after-journey.md`** — the observed current journey versus our proposed one, with counts for screens, decisions, jargon-heavy steps, recoverable errors, and points requiring prior institutional knowledge. Source the "current" column from `authenticated-flow-map.md`, not from memory.
3. **Write the evidence chains** — for each observed failure: observed problem, citizen impact, our design change, measurable expected improvement, and how it will be tested. **No unmeasurable claims**; "10x easier" is banned unless a measurement backs it.
4. **Then stop for owner review.** Do not scaffold the application before that review.

After review: ratify or replace ADR-0002, scaffold with the test runner in the same commit, build the deterministic rules module test-first, then design the domain taxonomy (KI-008).

**If you are Codex:** log what you build in `19-codex-contribution-log.md` — it is the R1 evidence and it is still empty. Non-Codex agents log to `12-change-log.md`.

## Working protocol (owner instruction, 2026-08-26 — binding)

**The repository is the memory, not the context window.** The loop is **discover, write to the repository, verify by reading back, continue**. Do not accumulate discoveries and document them later; do not report a finding in chat that is not already in a file, unless persistence is technically impossible and you say so explicitly. If something cannot be persisted, stop exploring until it is resolved.

## Decisions that must NOT be revisited without evidence

`05-product-decisions.md` in full. Especially PD-001 (do not clone the portal), PD-003 (no real filing/payment/OTP/login), PD-004 (every generated output shown and editable), **PD-009 (no runtime LLM)**.

## Known risks

`15-risk-register.md`. Most consequential now: **R-01** (the Codex log is empty, so the R1 claim is unevidenced), **R-02/R-17** (the rule-based assistant may dead-end citizens the same way the portal does), **R-16** (overstating our improvement), **R-15** (leaking the owner's real contact details from a pre-filled form into the repository).
