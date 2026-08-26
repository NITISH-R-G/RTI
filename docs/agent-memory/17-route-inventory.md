# 17 — Route Inventory (our application)

**Status: no routes exist.** The table below is the **frozen** set from `docs/design/mvp-spec.md` v1.0 and `docs/design/information-architecture.md`. As each route is built, the agent building it fills in its real row and **may not mark it complete without evidence**.

Adding a route that is not in this table requires an evidence chain in `docs/design/evidence-to-design.md` first.

| Path | Purpose | Entry | Citizen's goal | Data | Mock/Live | A11y | Tests | Status |
|---|---|---|---|---|---|---|---|---|
| `/` | **What happened?** — the problem in the citizen's own words | Public URL | "Say what I want to know" | none | Deterministic, no network | — | S1–S10 | **Not built** |
| `/clarify` | ≤3 clarifying questions, then the suitability verdict | from `/` | "Answer a couple of things so you can help" | taxonomy | Deterministic, no network | — | S1–S9, S11 | **Not built** |
| `/not-rti` | Honest verdict + where to actually go | from `/clarify` | "Don't waste my ₹10 and 30 days" | suitability rules | Deterministic | — | S5, S7 | **Not built** |
| `/request` | Information types + editable draft + live validation | from `/clarify` | "Ask it properly" | templates + character rules | Deterministic, no network | — | S10, S13 | **Not built** |
| `/authority` | Recommendation + reasoning + alternatives + search + state warning | from `/request` | "Send it to the right place" | 2,904-name dataset | **Real names**, deterministic ranking | — | S1–S4, S7, S12 | **Not built** |
| `/review` | What will be filed · fee · appeal date | from `/authority` | "Check before I commit" | rules module | Real rules | — | S11, S12 | **Not built** |
| `/filed/[ref]` | Simulated reference + timeline + the exact text to file for real | from `/review` | "What happens now?" | mock application | **Simulated — labelled** | — | ref-format, timeline | **Not built** |
| `/about` | What is real, what is simulated, not a government service | every screen | "Can I trust this?" | none | — | — | link check | **Not built** |

Six routes in the happy path; eight in total.

Every route must satisfy the non-negotiable accessibility criteria in `06-ux-system.md` and the global rules in `information-architecture.md` before its status may read anything other than "Not built" or "In progress".
