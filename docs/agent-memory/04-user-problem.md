# 04 — The User Problem

**Status:** RECOMMENDED, 2026-08-26. Not yet ratified by the project owner.
**Evidence base:** `03-rti-site-inventory.md`, `docs/research/rti-online/`.

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

> **A citizen knows what they want to know. They do not know that it is called RTI, which of ~2,900 offices holds the answer, how to word the request so it is legally answerable, or whether RTI is even the right instrument. The existing portal helps with none of this — and getting it wrong costs 30–60 days and, for a state authority, the fee with no refund.**

### Why this problem and not the others

1. **It is where the failure actually originates.** Tracking (C3) and appeals (C6) are downstream repairs for a request that was mis-aimed or mis-worded at the start. Fix the start and the downstream pain shrinks.
2. **It is provably unserved.** The portal's own FAQ asks "How do I write my application for seeking the information as per RTI Act 2005?" and answers it with nothing but a character limit. That is the whole of the official guidance on the hardest step. [O]
3. **The penalty for getting it wrong is documented by the government itself**, not inferred by us: transfer under s.6(3) with a new registration number, or return **without refund** for a state authority. [D]
4. **AI earns its place.** Mapping "my EPF withdrawal has been stuck since March" onto (a) is-this-RTI-or-a-grievance, (b) the right public authority, and (c) a specific, records-based, answerable question is genuine language and reasoning work. Everything else in the journey — fee rules, character limits, the 30-day clock — is deterministic and belongs in ordinary code.
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
3. Is an OpenAI API key available for the deployed build? R1/R2 in `02-competition-rules.md` depend on it, and the deterministic fallback (`09-ai-behavior.md`) only covers outages, not a missing key for the whole demo.
