# 00 — Project State

**Last updated:** 2026-08-26 (Session 1)
**Phase:** Research complete. Problem recommended. **No application code exists yet.**

## Where the project stands

| Area | State |
|---|---|
| Repository | Initialised, remote `https://github.com/NITISH-R-G/RTI` (was empty before this session) |
| RTI Online audit | **Done** — `03-rti-site-inventory.md` |
| Problem selection | **Recommended (C1)**, awaiting owner ratification — `04-user-problem.md` |
| MVP definition + acceptance criteria | **Done** — `docs/design/mvp-spec.md` |
| Compliance route (R1) | **Decided** — built with Codex, no runtime LLM (PD-009). Evidence file `19-codex-contribution-log.md` exists but is **empty** |
| Technical stack | **Proposed, not decided** — `07-technical-architecture.md`, `docs/adr/0002-...` is still a draft, and PD-009 changed its premises |
| Application code | **None** |
| Tests | **None** |
| Public URL | **None** |

## DEMO START

Not available yet. There is nothing to run. This section becomes real the moment the first route ships; the next agent must fill it in rather than leaving this note.

Planned entry point once built: the deployed public URL, landing on `/` with an empty description box.

## DEMO FLOW (planned — see `docs/design/mvp-spec.md`)

1. Citizen types their problem in plain language ("My EPF withdrawal has been stuck since March and nobody replies").
2. The app tells them whether RTI is the right tool, in plain language, and says so honestly when it is not.
3. The app drafts a specific, answerable request and explains why each part is there. The citizen edits it.
4. The app proposes the public authority to send it to, with its reasoning and ranked alternatives.
5. The app shows a review screen: exactly what will be filed, the fee, and the date the citizen becomes free to appeal.
6. The citizen "files" it (simulated) and gets a tracking view plus a downloadable/copyable request they could file for real.

## EXPECTED FINAL STATE

A completed mock application with a tracking reference, a plain-language explanation of what happens next, and the exact text the citizen could paste into the real portal.

## MOCKED

Identity, submission, payment, OTP, registration numbers, case status and timeline. Nothing is sent to any government system. See `08-data-model.md`.

## REAL

The public-authority list (2,904 real institutional names captured from the portal's own public listing), the fee and time-limit rules, the character-set and length constraints, and the app's own reasoning — which is deterministic and runs entirely in the browser (PD-009).

## KNOWN LIMITATIONS

Tracked in `14-known-issues.md`. The headline one: this is an independent prototype and cannot file a real RTI.

## Next agent: start at `13-agent-handoff.md`.
