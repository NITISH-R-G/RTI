# 14 — Known Issues

---

## Open

### KI-009 — ~~Authenticated audit incomplete~~ **CLOSED 2026-08-26**
All three outstanding items were resolved without further human authentication:
1. **Validation dialog text** — resolved by enumerating the page's own validation functions and extracting their dialog literals (`Function.prototype.toString`), rather than triggering native dialogs. Result: only two dialogs exist on the whole form, and **there is no client-side field validation at all**. See `authenticated-friction-map.md` F-A11.
2. **`Country = Other`** — resolved with a real click. No branching occurs. F-A13.
3. **360 px mobile** — resolved by direct reflow measurement (device emulation was unavailable). The form does not reflow: 985 px minimum content width at a 360 px constraint. F-A12.

**Residual `[U]`:** colour contrast was never measured, and no real device or screen reader was used.

### KI-010 — Screenshots cannot be persisted in this environment
The browser tooling captured screenshots into the agent's analysis context, but `save_to_disk` wrote no file and none was found in Downloads or the session temp directories. **No image evidence exists in the repository.** Visual findings are preserved as verbatim on-screen text, measured DOM structure and reproduction steps. See `docs/research/rti-online/screenshots/README.md`.

### KI-001 — No application exists
**Severity:** Expected at this stage. The project is at the end of its research phase.
**Next:** `13-agent-handoff.md`.

### KI-002 — The stack is proposed, not decided
`07-technical-architecture.md` and `docs/adr/0002-stack.md` are marked *proposed*. Ratify or replace before writing application code (master instruction §34).

### KI-013 — The held-out generalisation set is burned
`scripts/holdout.js` was used to find Fix F, so its 16 inputs are no longer an independent measurement. The honest generalisation figure is **93.8%, measured before that fix**. A future session must write fresh held-out inputs — ideally sourced from outside this project, since every input so far was authored by the same agent that built the classifier.

### KI-014 — The reasoning pipeline is English-centric
Devanagari input normalises to nothing and lands on "no signal". Hinglish works only where Latin-script keywords survive. Documented in `docs/design/deterministic-reasoning.md` as known weakness 3; Hindi is FUTURE, not MVP.

### KI-008 — ~~The domain taxonomy is designed but not built~~ **CLOSED 2026-08-26**
Built and validated in Phase 2.5: `src/reasoning/taxonomy.js` carries all five domains with keywords, synonyms, misspellings, negative signals, clarifying questions, information types, authority mappings and reasoning strings. 60/60 on the corpus. What remains for Phase 3 is the **request templates** per domain, which the drafting screen needs.

### KI-008b — Request templates are not written
**Updated 2026-08-26 (Phase 2).** The taxonomy is no longer undefined: `docs/design/mvp-spec.md` v1.0 freezes **five domains** — pension, provident fund, passport, railways, income tax refund — each with a documented reason, plus explicit unsupported-case handling and a record shape. What remains is **authoring the content**: keywords, synonyms and common misspellings; the clarifying questions (each of which must change the outcome); information-type options; authority mappings taken verbatim from `public-authorities.json`; reasoning strings; and one request template per domain.

This is still the largest remaining piece of work, and the journey's quality cannot be judged until it exists.

### KI-003 — The public-authority dataset is raw, and now has a better-shaped sibling
2,904 names in `public-authorities.json`, unenriched: no category, no plain-language description, no keywords, no central-vs-state flag. 175 are prefixed "UT ", a starting signal but not a complete classification.

**Updated by the authenticated audit:** the real form uses a **two-level cascade**, and the 96-entry ministry list is now captured in `docs/research/rti-online/ministries.json`. That list is a far better spine for our taxonomy than the flat 2,904 — enrich *it* first (what each ministry covers, in citizen words), then map ministries to authorities.

### KI-012 — The RTI research baseline is now FROZEN
The authenticated audit is complete. **Do not explore new parts of the production portal** unless a specific, named unknown blocks a decision — and if you must, record why first. The persisted evidence in `docs/research/rti-online/` is the baseline the product is designed against and measured against.

### KI-011 — ~~The dead-end case must be reproducible in our evaluation set~~ **CLOSED 2026-08-26**
Now **S1** in `docs/evals/citizen-scenarios.md`, using the exact observed string, designated a permanent regression test.

### KI-004 — R1 evidence does not exist yet
**Resolved into a different issue.** PD-009 settled the compliance route: no runtime LLM; rule R1 is satisfied through Codex-assisted development. The live issue is now that `19-codex-contribution-log.md` is **empty**. It is the submission's R1 evidence, so it must be filled in by real Codex sessions as they happen — not reconstructed at the end, and never fabricated. See R-01/R-01b in `15-risk-register.md`.

### KI-005 — Parts of the baseline could not be verified
The live RTI application form, post-OTP status screens, and payment screens sit behind an OTP wall and were **not** observed. Statements about them come from the portal's official manual and are marked [D] in `03-rti-site-inventory.md` §8. Do not upgrade them to "observed" without observing them.

### KI-006 — No colour-contrast measurements of the baseline
The browser pane could not composite frames this session, so no screenshots or pixel measurements were taken. Contrast claims about the existing portal are therefore absent, not assumed. If a later session needs them, take screenshots.

### KI-007 — Inherited scaffold is unreviewed
`.agents/skills/` and `docs/agents/*.md` arrived from an unrelated "SIH" project. They are harmless and were kept, but nothing in this project depends on them. Remove them if they cause confusion.

---

## Resolved

*(none yet)*
