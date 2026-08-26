# 02 — Competition Rules (HARD CONSTRAINTS)

> Source: "Build What Moves India" hackathon brief, as relayed in the project master instructions.
> These are non-negotiable. If an implementation conflicts with a rule here, the implementation is wrong.

## Build constraints

| # | Rule | How this project complies | Status |
|---|------|---------------------------|--------|
| R1 | Prototype must be built with Codex or powered by an OpenAI model | Runtime AI calls go to an **OpenAI model** (server-side). No Anthropic/Gemini model may be used in the shipped product's runtime path. | PLANNED |
| R2 | Codex/OpenAI must be a *meaningful* part of the build | AI performs intent understanding, RTI-suitability judgement, request drafting and authority routing — not decoration. See `09-ai-behavior.md`. | PLANNED |
| R3 | Must solve ONE clearly defined real user problem | See `04-user-problem.md`. | DECIDED |
| R4 | Main citizen journey must work start to finish | See `00-project-state.md` DEMO FLOW. | NOT BUILT |
| R5 | Mock/synthetic data where real PII, payments, OTPs, or government systems would be involved | Central mock data layer; no real submission, no real payment, no real OTP. | PLANNED |
| R6 | Reviewers test the **citizen** experience, not an admin panel | No admin dashboard in scope. | DECIDED |
| R7 | Must be reachable at a public browser URL | Planned deploy target: Vercel (public, no auth wall). | NOT DONE |
| R8 | Must not interfere with or test live government systems | Audit was **read-only**. No RTI application, appeal, payment, login, or OTP was ever submitted. | HELD |
| R9 | No reverse-engineering of private systems | Only public pages + the officially published citizen user manual were used. | HELD |
| R10 | No undocumented private APIs | None used. | HELD |
| R11 | No scraping of personal or restricted information | Only public *institutional* names (list of public authorities) were captured. Zero personal data. | HELD |
| R12 | Never use real Aadhaar, PAN, passwords, OTPs, payment details, health data | Mock identities only, clearly fake. | PLANNED |
| R13 | Must not present itself as an official government product | Persistent, visible "independent prototype — not affiliated with the Government of India" disclosure. Distinct product name. No Ashoka emblem / no Government of India logo. | PLANNED |
| R14 | Government logos must not imply endorsement | No national emblem, no DoPT/NIC marks anywhere in the UI. | PLANNED |
| R15 | Mocked functionality and limitations must be clearly disclosed | In-product "What's real / what's simulated" disclosure + README. | PLANNED |

## Judging dimensions to optimise against (see `11-evaluation-log.md`)

Problem · Working build · Usability · Product thinking · End-to-end thinking · Honesty.

## Standing prohibitions for every future agent

1. **Do not** swap the runtime model to a non-OpenAI provider. R1 is a disqualification risk.
2. **Do not** add real payment, real OTP, or any outbound call to a `*.gov.in` host from the running product.
3. **Do not** copy the national emblem, DoPT branding, or the RTI Online visual identity into the UI.
4. **Do not** widen scope into an admin/CPIO console. R6.
