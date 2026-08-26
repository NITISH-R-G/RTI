# 08 — Data Model

**Status:** Shape proposed, nothing implemented.

## Rule: one mock data layer

All synthetic data lives under a single module (proposed `src/data/`). No fake government record is written inline in a component. Every mock entity carries a marker so the UI can label it as simulated at the point of use (PD-006).

## Real reference data (not mocked)

| Dataset | Source | File | Notes |
|---|---|---|---|
| Public authorities on the RTI Online portal | `rtionline.gov.in/request/allpa.php`, captured read-only 2026-08-26 | `docs/research/rti-online/public-authorities.json` | 3,114 rows, 2,904 unique names. Public **institutional** names only — no personal data (R11). Needs enriching before use: category, plain-language description, keywords, whether central or state/UT. |
| Fee and time-limit rules | RTI Act 2005 / RTI Rules 2012, as stated by the portal's own guidelines and FAQ | to be written as code constants with citations | Rs 10 application fee; no fee for BPL with certificate; no fee for a first appeal; 30 days before a first appeal is possible |
| Request text constraints | Portal guidelines + citizen user manual | code constants | 3,000 characters; allowed set `A-Z a-z 0-9 , . - _ ( ) / @ : & ? \ %`; supporting document PDF, 1 MB |

## Synthetic entities (all clearly fake)

| Entity | Fields | Marking |
|---|---|---|
| `MockCitizen` | display name, email, mobile — all obviously fictitious | Never real. No Aadhaar, no PAN, no address (R12) |
| `MockApplication` | id, problem text, drafted request, chosen authority, fee state, created date, status | `isSimulated: true` |
| `MockRegistrationNumber` | follows the documented format `AAAAA/B/C/DD/EEEEE` | Prefixed or otherwise visibly fake so it can never be mistaken for a real reference |
| `MockStatusTimeline` | filed, forwarded to CPIO, reply due, replied | Dates derived from the deterministic 30-day rule, not invented per-render |
| `MockPaymentResult` | success / failure / pending-reconciliation | Mirrors the real failure modes documented in `03` §5 F7 |

## Hard rules

1. No real Aadhaar, PAN, password, OTP, card, health or identity data anywhere in the repo, tests, fixtures or seed files (R12).
2. **Nothing the citizen types leaves their browser.** There is no runtime model and no server-side persistence (PD-009). This is a real privacy property of the product and must not be quietly broken.
3. Mock registration numbers must be visually distinguishable from real ones, so a screenshot of the prototype can never be mistaken for a real filing receipt (R13).
4. The public-authority dataset may be enriched with descriptions we write, but the **names must not be edited** — they are the citizen's link back to the real portal's dropdown.
