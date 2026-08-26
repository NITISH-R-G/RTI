# 14 — Known Issues

---

## Open

### KI-001 — No application exists
**Severity:** Expected at this stage. The project is at the end of its research phase.
**Next:** `13-agent-handoff.md`.

### KI-002 — The stack is proposed, not decided
`07-technical-architecture.md` and `docs/adr/0002-stack.md` are marked *proposed*. Ratify or replace before writing application code (master instruction §34).

### KI-003 — The public-authority dataset is raw
2,904 names, unenriched. No category, no plain-language description, no keywords, no central-vs-state flag. Authority recommendation cannot be built well until this is enriched — and the state/UT flag is what powers the "this would be returned without refund" warning.
**Note:** 175 names are prefixed "UT ", which is a starting signal but not a complete central/state classification.

### KI-004 — No OpenAI API key confirmed
R1/R2 depend on an OpenAI model being in the runtime path. The key's availability for the deployed build is an open question with the project owner (`04-user-problem.md`, open question 3).

### KI-005 — Parts of the baseline could not be verified
The live RTI application form, post-OTP status screens, and payment screens sit behind an OTP wall and were **not** observed. Statements about them come from the portal's official manual and are marked [D] in `03-rti-site-inventory.md` §8. Do not upgrade them to "observed" without observing them.

### KI-006 — No colour-contrast measurements of the baseline
The browser pane could not composite frames this session, so no screenshots or pixel measurements were taken. Contrast claims about the existing portal are therefore absent, not assumed. If a later session needs them, take screenshots.

### KI-007 — Inherited scaffold is unreviewed
`.agents/skills/` and `docs/agents/*.md` arrived from an unrelated "SIH" project. They are harmless and were kept, but nothing in this project depends on them. Remove them if they cause confusion.

---

## Resolved

*(none yet)*
