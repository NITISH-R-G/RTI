# 19: Codex Contribution Log

**Purpose:** evidence for competition rule R1: *"the prototype must be built with Codex or powered by an OpenAI model."* This project satisfies the **first** branch: meaningful Codex-assisted development. This file is the evidence.

## Rules for this log

1. **Only real Codex work is recorded here.** Never write an entry for work Codex did not do. A fabricated entry is worse than an empty log: it converts an honest submission into a false claim, and Honesty is a judging dimension.
2. Every entry names what Codex actually produced or changed, and links to the commit.
3. Commits authored in a Codex session should say so in the commit message (`Co-authored-by:` or a `codex:` note), so the log can be checked against `git log`.
4. Agents that are **not** Codex (Claude, Cursor, Gemini, a human) do not add entries here. They record their work in `12-change-log.md` as normal.

## Suggested entry format

```
### YYYY-MM-DD: <what was built>
Commit(s): <sha>
Codex did: <specific work: files, logic, tests>
Human/other-agent did: <what was directed, reviewed, or corrected>
Why it mattered: <the contribution, not the transcript>
```

## Entries

*(none yet: Session 1 was a research session run by Claude Code, and is recorded in `12-change-log.md`. The first Codex-authored work goes here.)*

## Where the evidence will point at submission time

- This log, checkable against `git log`.
- Commit history showing Codex-authored changes.
- `docs/adr/` for decisions taken during Codex sessions.
- The `.agents/skills/*/agents/openai.yaml` agent definitions already in the repository, which are Codex-targeted skill configurations.
