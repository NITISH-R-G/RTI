# 00: Project State

**Last updated:** 2026-08-26 (Session 1)
**Phase:** Research frozen. Specification frozen. Reasoning validated. **PHASE 3 COMPLETE: the full citizen journey is built, tested and verified.** Next: Phase 4 integration and competition evaluation.

## Where the project stands

| Area | State |
|---|---|
| Repository | Initialised, remote `https://github.com/NITISH-R-G/RTI` (was empty before this session) |
| RTI Online audit | **Done**: `03-rti-site-inventory.md` |
| Problem selection | **SETTLED**: PD-010; re-argued against authenticated evidence |
| Authenticated audit | **Done and FROZEN**: `docs/research/rti-online/` |
| MVP definition + acceptance criteria | **FROZEN**: `docs/design/mvp-spec.md` v1.0 |
| Evidence chains | **Done**: `docs/design/evidence-to-design.md`, 14 chains |
| IA, user flow, scenarios, demo | **Done**: `docs/design/`, `docs/evals/citizen-scenarios.md` |
| Compliance route (R1) | **Decided**: built with Codex, no runtime LLM (PD-009). Evidence file `19-codex-contribution-log.md` exists but is **empty** |
| Technical stack | **Proposed, not decided**: `07-technical-architecture.md`, `docs/adr/0002-...` is still a draft, and PD-009 changed its premises |
| Application code | **None** |
| Tests | **None** |
| Public URL | **None** |

## DEMO START

Not available yet. There is nothing to run. This section becomes real the moment the first route ships; the next agent must fill it in rather than leaving this note.

Planned entry point once built: the deployed public URL, landing on `/` with an empty description box.

## DEMO FLOW (frozen: `docs/design/demo-journey.md`)

**Minute 1: the problem.** On the real portal, type `my pension has not been paid` into Search Public Authority. It answers **"No such Public Authority available in this portal !"**: while `Department of Pensions & Pensioners Welfare` sits in the ministry dropdown on the same screen. `[O]`

**Minute 2: our journey**, with the same sentence:

1. `/`: "What happened?"
2. `/clarify`: at most 3 questions, each one chosen because it changes the outcome
3. `/request`: what you're asking for + the full editable draft, validated live
4. `/authority`: one recommendation + reasoning + alternatives + search + state/UT no-refund warning
5. `/review`: the text, the office, the ₹10 fee, and **the date** you may appeal
6. `/filed/[ref]`: a visibly fake reference, a plain-language timeline, and the exact text to file for real

She never typed an institution's name.

## EXPECTED FINAL STATE

A completed mock application with a tracking reference, a plain-language explanation of what happens next, and the exact text the citizen could paste into the real portal.

## MOCKED

Identity, submission, payment, OTP, registration numbers, case status and timeline. Nothing is sent to any government system. See `08-data-model.md`.

## REAL

The public-authority list (2,904 real institutional names captured from the portal's own public listing), the fee and time-limit rules, the character-set and length constraints, and the app's own reasoning: which is deterministic and runs entirely in the browser (PD-009).

## KNOWN LIMITATIONS

Tracked in `14-known-issues.md`. The headline one: this is an independent prototype and cannot file a real RTI.

## Next agent: start at `13-agent-handoff.md`.
