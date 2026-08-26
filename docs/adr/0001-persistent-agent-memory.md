# ADR-0001 — Persistent agent memory lives in the repository

**Date:** 2026-08-26 · **Status:** Accepted

## Context

This project is built by a sequence of autonomous coding agents, possibly of different models and vendors, with no shared context between sessions. A context window can vanish mid-task; the local workspace can be deleted. Anything known only to the agent currently working is lost knowledge.

## Decision

All durable project knowledge lives in Markdown in the repository, under `docs/agent-memory/` (numbered 00–18), with supporting material in `docs/research/`, `docs/design/`, `docs/evals/`, `docs/testing/` and `docs/adr/`. The GitHub repository is the canonical recovery point: a fresh `git clone` must be sufficient to continue.

Every agent reads `docs/agent-memory/` at session start and updates it, plus the change log, known issues, verification matrix and handoff file, before ending. Work is committed and pushed in small increments rather than accumulated.

## Consequences

- Documentation is a deliverable and consumes real time in every session. Accepted.
- Memory files must never be deleted to tidy the repository.
- Claims in memory files carry evidence labels ([O] observed / [D] official docs / [I] inferred / [U] unknown) so a later agent can tell verified fact from assumption.
- Decisions are append-only: superseded entries stay, with the reason for the change.
