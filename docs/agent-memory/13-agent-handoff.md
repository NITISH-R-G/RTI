# 13 — Agent Handoff

**Last updated:** 2026-08-26, Session 2 (Claude Opus 5, Claude Code) — **audit FROZEN · Phase 2 spec FROZEN · PHASE 2.5 (deterministic reasoning) VALIDATED. Awaiting owner review before Phase 3 UI work.**

> **Read two things first:** PD-009 (no runtime LLM; competition rule R1 is satisfied through Codex-assisted development) and the **Context Recovery Snapshot** immediately below.

## Context Recovery Snapshot

**Assume the previous agent's context is gone. This section is the recovery point.**

### Phase 2.5 outcome — the brain works

The core product risk was whether a deterministic taxonomy can bridge citizen problem-language to institutions without reproducing the observed portal failure. **It was tested before any UI was built.**

| | |
|---|---|
| Corpus | 60 cases, **committed before the classifier existed** (commit `8dabb86`) |
| Corpus result | **60 / 60 (100%)** — 0 dead ends, 0 fabricated authorities |
| Held-out generalisation | **93.8% (15/16) before the final fix.** That set is now burned — see KI-013 |
| Unit tests | 62 passing |
| Code | `src/reasoning/` — pure functions, no network, no LLM, no UI imports |
| Run it | `node scripts/evaluate.js` · `node scripts/holdout.js` · `node --test test/corpus.test.js` |

**The founding regression test passes:** `my pension has not been paid` → supported / pension / Department of Pensions & Pensioners Welfare, where RTI Online returns *"No such Public Authority available in this portal !"*.

Full tuning history — six fixes, one failure category at a time, full corpus re-run after each — is in `docs/evals/taxonomy-evaluation.md`. Architecture and **seven documented known weaknesses** are in `docs/design/deterministic-reasoning.md`.

**Do not treat 100% as proof.** The corpus was written by the same agent that built the classifier. Corpus-first ordering and the held-out set mitigate that; they do not eliminate it.

### Phase 2 outcome (read this before anything else)

The frozen research baseline was converted into an **implementation-ready specification**. Seven design documents now exist and are frozen. **Do not start application code until the owner has reviewed them.**

| Document | What it settles |
|---|---|
| `docs/design/mvp-spec.md` **v1.0 FROZEN** | Scope, the five domains, unsupported-case handling, 6 screens, 12 frozen metrics |
| `docs/design/evidence-to-design.md` | 14 chains: observed problem → evidence → impact → design → measurable improvement → test. **A feature without a chain does not ship** |
| `docs/design/before-after-journey.md` | 25 measured dimensions vs the observed baseline |
| `docs/design/information-architecture.md` | Per screen: purpose, actions, what is deliberately hidden, validation, errors, mobile, a11y, tests |
| `docs/design/user-flow.md` | 9 transitions + state diagram + a control inventory proving no dead buttons |
| `docs/evals/citizen-scenarios.md` | 15 scenarios with explicit failure conditions; S1 is a permanent regression test |
| `docs/design/demo-journey.md` | The two-minute demo, with integrity rules forbidding exaggeration of the portal |

**PD-010** ratifies the thesis, re-argued against the authenticated evidence rather than inherited from the Session 1 ranking.

**The founding inversion:** RTI Online asks *"which office?"* before *"what do you want?"*. We reverse it. Reversing that back means abandoning the product.

**The five frozen domains:** pension (the observed dead-end case), provident fund (the control case — their search already works here), passport (the noisy-search case), railways (the 183-authority cascade case), income tax refund. Everything else fails helpfully; state subjects get the no-refund warning.

### What was being done
An **authenticated audit** of `rtionline.gov.in`. Session 1 could only reach an OTP wall. In Session 2 the project owner manually completed email + mobile + CAPTCHA + OTP in their own Chrome, and the agent then audited the real **Online RTI Request Form**. The agent entered no credentials at any point.

### What was discovered
All of it is written down — see "Files to read first". The single most important finding:

> Typing `my pension has not been paid` into the form's `Search Public Authority` box returns **`No such Public Authority available in this portal !`**, while `Department of Pensions & Pensioners Welfare` exists in the ministry cascade on the same screen. `[O]`

Three findings closed the audit after the checkpoint:
- **No client-side field validation exists at all.** The entire form has exactly two dialogs — `Only Indian citizens can file RTI Request application.` and `Your request will be filed with <authority>` (with two literal newlines before the name). The latter is an `alert()`, not a `confirm()`: the citizen acknowledges the authority choice, they cannot cancel it. Every mandatory-field check is server-side. (F-A11)
- **The form does not reflow.** Constrained to 360 px, minimum content width is **985 px** — 625 px of overflow, 32 controls past the right edge, 30 controls under the 44 px touch target. It has a viewport meta but a ~888 px fixed table layout. (F-A12, Critical)
- **`Country = Other` produces no branching** — the India State dropdown and the free-text country field stay visible together. (F-A13)

Supporting findings: a two-level ministry-to-authority cascade (96 options, then 184 for Railways); a search that matches institutional names rather than needs (`passport` returns 3 irrelevant results of 4); 40 visible inputs with **zero** `<label>` elements; the fee disclosed only after answering BPL; the submit button relabelling to `Make Payment`; the restricted character set enforced only at submit with no live counter; a second CAPTCHA after the OTP; and back-navigation breaking the single-use OTP token.

### What was changed
Created `docs/research/rti-online/authenticated-form-structure.md`, `authenticated-flow-map.md`, `authenticated-friction-map.md`, `ministries.json`, `screenshots/README.md`. Updated memory files `03`, `04`, `12`, `14`, `15`, `18` and this file. **Three Session 1 claims were corrected, with the superseded wording kept visible.**

### What was tested
No application code exists, so no test suite ran. Audit findings were verified in the live DOM or read from official material, and every one carries an evidence tag.

### Browser state
The owner's Chrome, tab `1398493818`, is on the authenticated request form and responsive. The page reloaded at some point, which cleared the earlier blocking dialog; the owner's real email and mobile were re-prefilled by that reload and were **re-replaced with synthetic values**. The form holds synthetic data only and was never submitted. The browser window was resized to 390x844 during testing and **was not restored** — reset it if you reuse that window.

### What is blocked
**Nothing.** The three items previously blocked on a human were resolved without further authentication — see "What was discovered".

### What is pending
**Owner review of Phase 2.5.** After that, Phase 3 UI work. The reasoning layer is done and validated; the remaining code is the rules module (fee, dates, character rules), the request templates per domain (KI-008b), and the eight routes.

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
1. `docs/research/rti-online/authenticated-friction-map.md` — the **thirteen** reproducible failures, with severity
2. `docs/research/rti-online/authenticated-form-structure.md` — the complete form
3. `docs/research/rti-online/authenticated-flow-map.md` — the journey and where we stopped
4. `docs/agent-memory/04-user-problem.md` — the re-ranked problem
5. `docs/agent-memory/02-competition-rules.md` — the constraints that can disqualify

---

## What is currently working

Nothing runs. There is no application. What exists is an evidence-labelled research foundation, now including a direct authenticated audit.

## What is currently broken

Nothing. The modal dialog that blocked the earlier session is gone and every previously blocked item is resolved.

## What failed / could not be done

- **Screenshots cannot be persisted** in this environment — no image files exist in the repository (KI-010). Visual findings survive as verbatim text, DOM measurements and reproduction steps.
- **Device emulation was unavailable** for the authenticated tab (`resize_window` left `innerWidth` at 1536). Reflow was measured directly instead; **no real phone or emulated viewport was used**, and the write-up says so.
- **Colour contrast was never measured**, and no real screen reader was used. Both remain `[U]`.

## What the next agent should do first

**In this order. The owner has explicitly asked that implementation NOT start until steps 1-3 are done and reviewed.**

1. ~~Finish the authenticated audit~~ — **DONE.** Baseline frozen (KI-012).
2. ~~Before/after journey, evidence chains, frozen MVP, IA, user flow, scenarios, demo~~ — **DONE.** See the Phase 2 table above.
3. **Wait for owner review of Phase 2.** Implementation is gated on it.

**After review, in this order:**
1. **Ratify or replace `docs/adr/0002-stack.md`** and flip its status. The MVP needs **no server at runtime**, so a fully static build is viable — re-examine whether Next.js is warranted (`07-technical-architecture.md`, Open decisions). Note `src/reasoning/` is dependency-free ESM and will port to any stack unchanged.
2. **Scaffold with the test runner in the same commit.** `package.json` already runs `npm test` and `npm run eval` with **zero dependencies** (Node's built-in test runner) — keep those command names working.
3. **Build `rules/` test-first**: fee, appeal date, 3,000-char limit, allowed character set, sanitisation. Pure, no UI imports.
4. **Write the request templates per domain** (KI-008b) — the taxonomy is built; the drafting templates are not.
5. **Then the eight routes**, thinnest end-to-end first, keeping a working demo path at every commit.

**If you are Codex:** log what you build in `19-codex-contribution-log.md` — it is the R1 evidence and it is still empty. Non-Codex agents log to `12-change-log.md`.

## Working protocol (owner instruction, 2026-08-26 — binding)

**The repository is the memory, not the context window.** The loop is **discover, write to the repository, verify by reading back, continue**. Do not accumulate discoveries and document them later; do not report a finding in chat that is not already in a file, unless persistence is technically impossible and you say so explicitly. If something cannot be persisted, stop exploring until it is resolved.

## Decisions that must NOT be revisited without evidence

`05-product-decisions.md` in full. Especially PD-001 (do not clone the portal), PD-003 (no real filing/payment/OTP/login), PD-004 (every generated output shown and editable), **PD-009 (no runtime LLM)**.

## Known risks

`15-risk-register.md`. Most consequential now: **R-01** (the Codex log is empty, so the R1 claim is unevidenced), **R-02/R-17** (the rule-based assistant may dead-end citizens the same way the portal does), **R-16** (overstating our improvement), **R-15** (leaking the owner's real contact details from a pre-filled form into the repository).
