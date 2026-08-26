# Agent instructions — RTI project

This repository is built by a sequence of autonomous coding agents. **The repository is the source of truth, not any agent's context window.**

## Start here, every session

1. `git status` and recent `git log`.
2. `README.md`.
3. **Everything in `docs/agent-memory/`** — start with `13-agent-handoff.md`, then `00-project-state.md`.
4. Relevant ADRs in `docs/adr/`.
5. Run the test suite and build/type/lint checks (once they exist).
6. Then choose **one** high-value task.

## Before ending a session

Update `00-project-state.md`, `11-evaluation-log.md`, `12-change-log.md`, `13-agent-handoff.md`, `14-known-issues.md` and `18-verification-matrix.md`. Commit and push. `git status` should be clean.

## Hard constraints

- Competition rules are non-negotiable: `docs/agent-memory/02-competition-rules.md`. In particular, the runtime AI **must be an OpenAI model**, nothing is ever sent to a real government system, and the product must never present itself as official.
- Never mark a journey complete in `18-verification-matrix.md` without evidence.
- Never claim to have observed something you inferred. Use the [O]/[D]/[I]/[U] labels.
- Never reverse a decision in `05-product-decisions.md` silently — supersede it, with evidence.
- Never commit secrets.

## Inherited scaffolding

`.agents/skills/` and `docs/agents/*.md` came from an unrelated project and are not used by this one (see KI-007). Ignore or remove them; nothing here depends on them.
