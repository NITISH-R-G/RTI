# 14 — Known Issues

---

## Open

### KI-009 — Authenticated audit is incomplete (3 items outstanding)
Paused mid-audit at the mandatory persistence checkpoint. Outstanding, all `[U]`:
1. **Exact client-side validation dialog text** on `request/request.php`. A native `alert()` fired on submit-with-missing-fields; native dialogs sit outside the page, so browser automation can neither read nor dismiss it. Requested from the project owner; **not yet supplied**. A submit guard (`preventDefault` + `stopImmediatePropagation`, capture phase) was installed first, so no submission was possible.
2. **360 px mobile audit** of the authenticated form — not run.
3. **`Country = Other`** conditional branch — not re-tested with a real click.

Re-running items 1–3 requires a human to complete email + mobile + CAPTCHA + OTP again; the OTP token is single-use and the session does not survive back-navigation.

### KI-010 — Screenshots cannot be persisted in this environment
The browser tooling captured screenshots into the agent's analysis context, but `save_to_disk` wrote no file and none was found in Downloads or the session temp directories. **No image evidence exists in the repository.** Visual findings are preserved as verbatim on-screen text, measured DOM structure and reproduction steps. See `docs/research/rti-online/screenshots/README.md`.

### KI-001 — No application exists
**Severity:** Expected at this stage. The project is at the end of its research phase.
**Next:** `13-agent-handoff.md`.

### KI-002 — The stack is proposed, not decided
`07-technical-architecture.md` and `docs/adr/0002-stack.md` are marked *proposed*. Ratify or replace before writing application code (master instruction §34).

### KI-008 — The domain taxonomy does not exist
PD-009 makes the rule-based assistant the product, not a fallback. It needs a curated domain taxonomy (provident fund, passport, pension, scholarship, railways, banking, municipal…), one request template per domain, and a mapping from domain to likely authorities. This is now the single largest piece of design work in the project and nothing about the journey's quality can be judged until it exists. See `09-ai-behavior.md`.

### KI-003 — The public-authority dataset is raw, and now has a better-shaped sibling
2,904 names in `public-authorities.json`, unenriched: no category, no plain-language description, no keywords, no central-vs-state flag. 175 are prefixed "UT ", a starting signal but not a complete classification.

**Updated by the authenticated audit:** the real form uses a **two-level cascade**, and the 96-entry ministry list is now captured in `docs/research/rti-online/ministries.json`. That list is a far better spine for our taxonomy than the flat 2,904 — enrich *it* first (what each ministry covers, in citizen words), then map ministries to authorities.

### KI-011 — The dead-end case must be reproducible in our evaluation set
The observed failure (`my pension has not been paid` → `No such Public Authority available in this portal !`) is the project's central piece of evidence. It must exist as a named case in `docs/evals/` so our own product is measured against it, not merely inspired by it.

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
