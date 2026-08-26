# 13 — Agent Handoff

**Last updated:** 2026-08-27 — **PHASE 4 COMPLETE.** Independently evaluated, adversarially tested, audited against the judging criteria. Next: deploy, then submission materials.

| | |
|---|---|
| **Current phase** | Phase 4 complete |
| **Current commit** | see `git log --oneline -1` |
| **Product state** | Feature-complete, 8 routes, verified desktop + 360 px |
| **Test counts** | 78 reasoning + 79 unit/component + 104 Playwright = **261 passing** |
| **Blind evaluation** | **ORIGINAL 44/47 (93.6%)**, post-fix 46/47. Corpus committed before running (`a86821f`) |
| **Top risk** | **Not deployed to a public URL** — competition requirement R7 |
| **Second risk** | `19-codex-contribution-log.md` is empty — it is the R1 evidence |
| **Next action** | Deploy the static build, fill the Codex log, then submission materials |

## Context Recovery Snapshot

**Assume the previous agent's context is gone. This is the recovery point.**

### What exists now

A working prototype. `npm run dev`, open `http://localhost:5173`, type *my pension has not been paid*, and the complete journey runs: clarification, information selection, editable draft, explained authority recommendation, review, mock filing, mock tracking.

### The one thing to understand first

RTI Online asks **which office?** before **what do you want?** We reversed it. Reversing that back means abandoning the product. Evidence: typing `my pension has not been paid` into the real portal's authority search returns **"No such Public Authority available in this portal !"** while the correct department sits in a dropdown on the same screen.

### Where the code is

| Path | What |
|---|---|
| `src/reasoning/pipeline.js` | **FROZEN** Phase 2.5 engine. Changing it requires the process in `docs/evals/taxonomy-evaluation.md` |
| `src/reasoning/taxonomy.js` | The five domains as data |
| `src/reasoning/refine.js` | Answer refinement, deliberately separate from the frozen pipeline |
| `src/rules/` | Fee, appeal date, character rules — pure, sourced, unit-tested |
| `src/draft/compose.ts` | Information options and request composition |
| `src/authorities/` | The 2,904 captured names, search, honest context, reasoning bullets |
| `src/screens/` | Eight routes |
| `test/`, `src/**/*.test.*`, `e2e/` | 213 automated tests |

### Commands

```
npm run dev          # local
npm run build        # static bundle
npm run typecheck
npm test             # reasoning + unit/component
npm run test:e2e     # Playwright: journey, a11y, contrast
npm run eval         # corpus evaluation, prints real numbers
npm run eval:holdout # generalisation check (set is burned, see KI-013)
```

### Current numbers, all verified

| | |
|---|---|
| Reasoning tests | 72 passing |
| Corpus | 60/60, 0 dead ends, 0 fabricated authorities |
| Unit + component | 79 passing |
| Playwright, desktop + 360 px | 62 passing |
| axe serious/critical | **0** |
| Colour contrast violations | **0** (harness self-checked) |
| Bundle | 123 kB gzipped |

### What is blocked

Nothing.

### What is pending

**Deployment**, then submission materials. Phase 4 is done. Previous text follows for context.

**~~Phase 4: integration and competition evaluation~~ — DONE.** — test the product as a fresh reviewer, deliberately try to break it, run every citizen scenario, build a **fresh blind reasoning set** (the current held-out set is burned), audit against the judging criteria, fix the highest-impact weaknesses. Then submission materials. **Do not start the video before Phase 4.**

### Important decisions that must not be casually reversed

- **PD-009** no runtime LLM; R1 satisfied by Codex-assisted development.
- **PD-010** the product thesis; authority derived from the request, not before it.
- **ED-014** no identity collection — nothing the citizen types leaves the browser.
- **ADR-0002 (amended)** Vite + React static; Next.js was dropped because no server-side work remains.
- The reasoning engine is frozen. Changes need a failing scenario, a test, a full suite run, and a recorded failure category.

### Known gaps, stated plainly

1. **No real screen-reader test.** axe, semantics, keyboard, focus order and accessible naming are covered; assistive technology is not. Do not claim otherwise.
2. **The held-out reasoning set is burned** (KI-013). A fresh blind set is a Phase 4 requirement.
3. **Five domains only.** Everything else takes the honest-failure path by design.
4. **English-centric** (KI-014). Devanagari input lands on "no signal".
5. **`19-codex-contribution-log.md` is still empty** — it is the R1 evidence. Only real Codex work may be logged there.

### Git state

Working tree clean. All Phase 3 work committed and pushed to `origin/main` at `https://github.com/NITISH-R-G/RTI`. Run `git log --oneline -8`.

### Files to read first

1. `docs/design/mvp-spec.md` — the frozen scope
2. `docs/design/evidence-to-design.md` — why every feature exists
3. `docs/research/rti-online/authenticated-friction-map.md` — the observed failures
4. `docs/evals/taxonomy-evaluation.md` — how the engine was validated
5. `docs/agent-memory/11-evaluation-log.md` — every verification run, with real numbers

---

## What is currently working

**The complete citizen journey.** Eight routes, 213 automated tests, verified in a real browser at desktop and 360 px.

## What is currently broken

Nothing known.

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
