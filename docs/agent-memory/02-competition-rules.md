# 02 — Competition Rules (HARD CONSTRAINTS)

> Source: "Build What Moves India" hackathon brief, as relayed in the project master instructions.
> These are non-negotiable. If an implementation conflicts with a rule here, the implementation is wrong.

## Build constraints

| # | Rule | How this project complies | Status |
|---|------|---------------------------|--------|
| R1 | Prototype must be built with Codex **or** powered by an OpenAI model | Satisfied via the **"built with Codex"** branch: meaningful Codex-assisted development, evidenced in `19-codex-contribution-log.md`. The deployed prototype calls **no LLM at runtime**. Owner decision, 2026-08-26 (PD-009). | DECIDED |
| R2 | Codex/OpenAI must be a *meaningful* part of the build | Codex authors substantive parts of the product — logic, tests, UI — recorded per-commit in `19-codex-contribution-log.md`. Meaningfulness is demonstrated by what it built, not by a runtime API call. | IN PROGRESS |
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

1. **Do not** make the citizen journey depend on any LLM at runtime (PD-009). If a model is ever added, it goes behind the `ModelAssistant` interface in `09-ai-behavior.md` and the product must still work fully without it. If it is an LLM, it must be an OpenAI one — a non-OpenAI runtime model would break R1.
2. **Do not** write an entry in `19-codex-contribution-log.md` for work Codex did not actually do. That log is the R1 evidence; fabricating it makes the submission dishonest.
3. **Do not** add real payment, real OTP, or any outbound call to a `*.gov.in` host from the running product.
4. **Do not** copy the national emblem, DoPT branding, or the RTI Online visual identity into the UI.
5. **Do not** widen scope into an admin/CPIO console. R6.
