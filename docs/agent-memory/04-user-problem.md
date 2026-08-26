# 04 — The User Problem

**Status:** RECOMMENDED, 2026-08-26. **Re-ranked 2026-08-26 after the authenticated audit; C1 strengthened.** Not yet formally ratified by the project owner.
**Evidence base:** `03-rti-site-inventory.md`, `docs/research/rti-online/authenticated-friction-map.md`, `authenticated-form-structure.md`, `authenticated-flow-map.md`.

> ## Re-ranking after the authenticated audit (2026-08-26)
>
> Session 1 ranked these candidates on **inferred** friction. The authenticated audit replaced inference with direct observation, and it changed two scores.
>
> **The decisive new evidence** `[O]`, route `request/request.php`, authenticated, synthetic input:
>
> | Input typed into `Search Public Authority` | Observed result |
> |---|---|
> | `my pension has not been paid` | **`No such Public Authority available in this portal !`** |
>
> `Department of Pensions & Pensioners Welfare` exists in the ministry cascade **on the same screen**. The portal refuses a citizen with a valid, answerable request because they described their *problem* instead of naming an *institution*.
>
> This is no longer an assumption about citizen confusion. It is an observed, reproducible dead end.
>
> **Score changes:**
>
> | Candidate | Was | Now | Why |
> |---|---|---|---|
> | **C1** — problem-language to correctly aimed, correctly worded RTI | 27 | **29** | User pain 5→5 (held); AI/logic usefulness 5→5 (held); **demo clarity 5→5 (held, now with a verbatim failure to show)**; build cost 3→**4** — the two-level cascade and the real ministry list make authority mapping *more* tractable than a flat 2,900 lookup would have been |
> | C2 — wrong-authority routing alone | 22 | **24** | The observed search failure is real, but routing alone still leaves wording unsolved |
> | C4 — accessible mobile re-skin | 18 | **17** | The authenticated form *does* carry `lang` and a viewport meta, so the "portal is not responsive" case is weaker than Session 1 claimed |
> | C3, C5, C6 | 19 / 13 / 19 | unchanged | No new evidence bearing on them |
>
> **Conclusion: C1 holds and is stronger.** The problem statement is refined below — it is not merely that choosing an authority is hard, it is that **the portal requires the citizen to translate their problem into institutional vocabulary before it will help them at all, and refuses them outright when they cannot.**

## Candidate problems considered

Each was drawn from an observed friction point (F-codes refer to `03-rti-site-inventory.md` §5).

| # | Candidate problem | Friction | User pain | Build cost | AI usefulness | Demo clarity | A11y upside | Mocking needed | Score /30 |
|---|---|---|---|---|---|---|---|---|---|
| C1 | **Citizens cannot turn a real-life problem into a valid RTI aimed at the right office** | F1, F2, F3, F11 | 5 | 3 | 5 | 5 | 4 | Low | **27** |
| C2 | Wrong-authority routing alone | F1 | 4 | 4 | 4 | 4 | 2 | Low | 22 |
| C3 | "Where is my RTI, and when can I appeal?" tracking + appeal-clock | F4, F9, F10 | 4 | 3 | 2 | 4 | 3 | High (needs fake case history) | 19 |
| C4 | Mobile-first accessible re-skin of the whole portal | F6, A1–A12 | 4 | 2 | 1 | 3 | 5 | High | 18 |
| C5 | Payment-failure / reconciliation anxiety | F7 | 3 | 3 | 1 | 2 | 1 | High (fake payment states) | 13 |
| C6 | First-appeal drafting assistant | F9, F10 | 3 | 4 | 4 | 3 | 2 | Medium | 19 |

*Scoring: 1–5 per column, where build cost 5 = cheapest. Judgement calls, made against the evidence in `03`; revisit only with new evidence.*

## Recommended problem: C1

> **RTI Online requires citizens to translate a real-world problem into institutional language before the system will help them.** A citizen knows what they want to know. They do not know which ministry owns it, what the office is formally called, how to word the request so it is legally answerable, or whether RTI is even the right instrument. When they describe the problem in their own words, the portal answers *"No such Public Authority available in this portal !"* — even when the correct department exists in its own dropdown `[O]`. Getting it wrong costs 30–60 days and, for a state authority, the fee with no refund `[D]`.

### Why this problem and not the others

1. **It is where the failure actually originates.** Tracking (C3) and appeals (C6) are downstream repairs for a request that was mis-aimed or mis-worded at the start. Fix the start and the downstream pain shrinks.
2. **It is provably unserved, and now provably *refused*.** The portal's own FAQ answers "How do I write my application…?" with nothing but a character limit `[O]`. And the one control that looks like it accepts a problem description — the authority search — rejects problem language outright `[O]`. See `authenticated-friction-map.md` F-A1.
3. **The penalty for getting it wrong is documented by the government itself**, not inferred by us: transfer under s.6(3) with a new registration number, or return **without refund** for a state authority. [D]
4. **The reasoning work is real and can be built deterministically.** Mapping "my EPF withdrawal has been stuck since March" onto (a) is-this-RTI-or-a-grievance, (b) the right public authority, and (c) a specific, records-based, answerable question is the hard part. Under PD-009 it is delivered by a structured interview, a domain taxonomy, authored templates and ranked search over the real authority list — not by a runtime model. See `09-ai-behavior.md`.
5. **It demos in 90 seconds** and the before/after is self-evident to a judge who has never filed an RTI.
6. **It needs almost no mocking.** The public-authority list is real public institutional data. Only identity, payment, OTP and submission are simulated.

### Who it is for

The first-time filer on a phone: has a specific grievance, has never heard the words "CPIO" or "public authority", is more comfortable in Hindi or Hinglish than in legal English, and has one shot at ten rupees and thirty days.

### What "solved" looks like

The citizen describes their situation in their own words and leaves with: a plain-language verdict on whether RTI is the right tool, a correctly worded request they can read and edit, the right office to send it to with the reasoning shown, and a clear picture of what happens next and when.

## Complexity reduction target

Measured against the observed portal (`03` §2). To be re-measured and evidenced in `11-evaluation-log.md` once built.

| | RTI Online (observed/documented) | Target for this prototype |
|---|---|---|
| Steps before you can start writing | 4 (home, guidelines wall, email/mobile/CAPTCHA, OTP) | 1 (describe your problem) |
| Decisions the citizen must make unaided | Which of ~2,900 authorities; whether RTI applies; how to word it; BPL; fee mode | 0 unaided — every one is proposed with reasoning and is editable |
| Guidance on wording the request | None (character limit only) | Drafted, explained, editable, with the reason each sentence is there |
| Terminology assumed known | CPIO, Nodal Officer, Public Authority, First Appellate Authority, s.6(3), BPL | 0 assumed — every term glossed at the point of use |
| Usable on a 360 px phone | No (`viewport` meta absent; 980 px lock) | Yes, mobile-first |
| Form fields with programmatic labels | 0 of 6 | 100% |
| Knowing when you may appeal | Discovered by failing to file one | Shown as a date, up front |

## Explicitly out of scope

Real submission to any government system · real payment · real OTP · login/accounts · CPIO or admin views · second appeals to the CIC · state RTI portals · a general-purpose RTI chatbot.

## Open questions for the project owner

1. Ratify C1? (Everything downstream assumes it.)
2. Product name — a working name is needed that cannot be mistaken for an official government service. Placeholder in use: **"RTI Sarathi"** (`sarathi` = guide/charioteer). Change freely; it is referenced only in `01-product-context.md`.
3. ~~Is an OpenAI API key available for the deployed build?~~ **Resolved 2026-08-26:** no runtime LLM. R1 is satisfied through Codex-assisted development. See PD-009 and `19-codex-contribution-log.md`.
