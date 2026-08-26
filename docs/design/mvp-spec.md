# MVP Specification — FROZEN

**Version:** 1.0 · **Date:** 2026-08-26 · **Status: FROZEN for implementation.**
**Thesis:** PD-010 · **Evidence:** `evidence-to-design.md` · **Baseline:** the frozen audit in `docs/research/rti-online/`
**Supersedes** MVP spec v0.2, which was written before the authenticated audit and assumed a flat 2,900-authority dropdown.

Changing anything in this document requires a new entry in `docs/agent-memory/05-product-decisions.md` explaining why, with evidence.

---

## The MVP in one sentence

A citizen describes what happened in their own words and leaves with a correctly worded RTI request, aimed at a real public authority, with the reasoning shown, the fee and appeal date stated — on a phone, with no account, no LLM and nothing transmitted anywhere.

---

## Scope

### IN SCOPE

| # | Capability | Chain |
|---|---|---|
| 1 | Free-text problem entry in the citizen's own words | ED-001 |
| 2 | Up to 3 clarifying questions, each of which changes the outcome | ED-001, ED-013 |
| 3 | RTI-suitability verdict, including an honest "this is not an RTI matter" with an onward route | ED-013 |
| 4 | Selection of what information is being sought, from domain-specific options | ED-001 |
| 5 | An editable, explained RTI request draft, validated live | ED-004, ED-005 |
| 6 | One authority recommendation + reasoning + ranked alternatives + full search over the real list | ED-001, ED-002, ED-012 |
| 7 | State/UT warning: the central portal returns these **without refund** | ED-012 |
| 8 | Review screen: what will be filed, the fee, the date you may appeal | ED-009 |
| 9 | Simulated filing → a visibly fake reference + the exact text to file for real | PD-003 |
| 10 | Honesty page: what is real, what is simulated, that this is not a government service | R13, R15 |
| 11 | Full keyboard + screen-reader operation, 360 px up, 44 px targets | ED-006, ED-007 |
| 12 | Every step reversible; state preserved | ED-008 |

### OUT OF SCOPE — do not build

Real filing · real payment · real OTP · accounts or login · identity collection (ED-014) · first appeals · second appeals to the CIC · state RTI portals · CPIO or admin views · file attachments · multi-language UI (input tolerance only) · a general-purpose RTI chatbot · full coverage of all RTI subjects · PDF export · email delivery.

*File attachments and PDF export are excluded deliberately: the real portal's 1 MB PDF rule matters only at actual filing time, and neither is scored by the judging criteria.*

### MOCKED `[M]` — and labelled as such in the product

Filing · the reference number (visibly fake, never the real `AAAAA/B/C/DD/EEEEE` format) · payment state · case status and timeline dates · any "what happens next" progression.

### REAL

The 96-entry ministry list and the 2,904-name authority list, captured from the portal itself · the ₹10 fee and BPL exemption · the 30-day appeal rule · the 3,000-character limit · the exact allowed character set · the taxonomy and reasoning we author.

### DETERMINISTIC — no LLM anywhere (PD-009)

Domain classification · clarifying-question selection · suitability rules · template composition · authority ranking · fee and date arithmetic · every validation. All pure functions, unit-tested, running in the browser.

### FUTURE — explicitly not now

A `ModelAssistant` implementation behind the existing interface · more domains · Hindi UI · appeal drafting · real-portal deep-linking with prefilled fields.

---

## The domain taxonomy

Designing a "general intelligence" over 2,904 authorities is not possible deterministically, and pretending otherwise would be dishonest. Instead: a **curated taxonomy over a deliberately chosen set of domains**, with everything outside it failing helpfully (ED-013).

### Supported domains, and why each exists

| Domain | Why it is in the set | Primary authority | Evidence |
|---|---|---|---|
| **Pension** | The observed dead-end case. `my pension has not been paid` → *"No such Public Authority available in this portal !"*. This domain **is** the demo. | Department of Pensions & Pensioners Welfare | `[O]` F-A1 |
| **Provident fund (EPF)** | The control case: the portal's search *works* here (`provident fund` → 2 clean results), so it proves our value is not merely "their search is broken" — it is the ordering and the guidance. | Employees Provident Fund Organisation | `[O]` F-A1 |
| **Passport** | The noisy-search case: `passport` returns 3 irrelevant results of 4. Demonstrates precision. | MEA – Consular, Passport & Visa Division (CPV) | `[O]` F-A1 |
| **Railways** | The cascade case: one ministry, **183** public authorities. Shows that even a correct ministry leaves an impossible choice. | Ministry of Railways → division-level bodies | `[O]` form-structure §3 |
| **Income tax refund** | A high-frequency citizen problem with a clean central owner; broadens the demo beyond three edge cases. | Department of Revenue | `[I]` — mapping authored by us, not observed |

Five domains. Not more: each needs authored clarifying questions, templates and authority mappings, and thin coverage across many domains is worse than solid coverage across few (R-02).

### Deliberately unsupported, and handled explicitly

**State-subject detector.** Police, land records, municipal services, ration cards, school admissions, electricity, water, state transport, local roads. These are **not** mapped to any central authority. They produce a warning built from `[D]` evidence — *the central portal returns applications for state public authorities without refunding the fee* — plus a pointer to the citizen's own state RTI route. This is the highest-value unsupported case, because getting it wrong on the real portal costs money.

**Not-RTI detector.** Requests for action or redress (a grievance → CPGRAMS), for opinions or reasons rather than records, for another identifiable person's personal information, or for matters before a court.

**Everything else.** Out-of-coverage input reaches `/authority` with the full 2,904-name search, an explanation of what makes a good RTI request, and the citizen's own wording carried forward — clearly labelled as un-assisted. **Never a flat refusal. Never a fabricated match.**

### Taxonomy record shape

```
domain
  subdomain
  keywords + synonyms + common misspellings
  clarifying questions      (each must change the outcome)
  information-type options  (what records could be asked for)
  candidate authorities     (verbatim names from public-authorities.json)
  reasoning string          (why this office holds this)
  request template
```

Authority names are **selected from** `docs/research/rti-online/public-authorities.json`. A name absent from that file cannot be rendered — hallucination is impossible by construction, not by discipline.

---

## The journey — 6 screens

The 14-step sequence proposed in the Phase 2 brief was refined down. Three changes, each with a reason:

1. **Suitability is not its own screen.** It is the *outcome* of clarification. A separate screen would add a step whose only content is a verdict the citizen never asked for. Unsuitable cases branch to `/not-rti`.
2. **"Identify the type of information sought" merges into `/request`.** Choosing what you want and seeing it drafted are one act; splitting them makes the citizen approve an abstraction before seeing the concrete text.
3. **Authority comes after the draft, not before.** This is ED-002 and the founding inversion.

```
/                → What happened?
/clarify         → ≤3 questions, then the suitability verdict
   ├─ /not-rti   → honest verdict + where to actually go
/request         → what you're asking for + editable draft + live validation
/authority       → recommendation + why + alternatives + search + state warning
/review          → what will be filed · fee · appeal date
/filed/[ref]     → simulated reference + tracking + text to file for real
/about           → what is real, what is simulated
```

Full detail: `information-architecture.md`. Every transition: `user-flow.md`.

---

## Frozen metrics — the build must hit these

| Metric | Target | Baseline (observed) |
|---|---|---|
| Screens before describing the problem | **0** | 4 |
| Total input fields across the journey | **≤ 7** | 40 |
| Points requiring institutional knowledge | **0 required** | 2 mandatory |
| Demographic fields | **0** | 3 (+4 conditional) |
| Personal identity fields | **0** | 8 |
| Validation before any network call | **Yes** | No |
| Horizontal overflow at 360 px | **0 px** | 625 px |
| Touch targets under 44 px | **0** | 30 |
| Inputs with a programmatic label | **100%** | 0 of 40 |
| axe serious/critical violations | **0** | not measured; 0 labels present |
| Dead ends | **0** | 1 reproducible |
| Journey completes with no network | **Yes** | n/a |

None of these may be reported as achieved until its verification in `before-after-journey.md` §5 has actually run.

---

## Definition of done for the MVP

All twelve IN SCOPE capabilities built · all fifteen scenarios in `docs/evals/citizen-scenarios.md` passing · every frozen metric verified · `build`, `typecheck`, `lint`, `test`, `test:e2e`, `eval` all green · deployed at a public URL with no auth wall · `19-codex-contribution-log.md` populated with real Codex work · memory files current · pushed.
