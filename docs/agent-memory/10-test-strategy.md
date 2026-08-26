# 10 — Test Strategy

**Status:** Strategy defined. **No test infrastructure exists yet.** The first code commit must bring the runner with it.

## Layers

| Layer | Tool (proposed) | Covers |
|---|---|---|
| Unit | Vitest | Deterministic rules: fee, 30-day appeal date, 3,000-character limit, allowed character set, authority search/matching, AI-output schema validation and clamping |
| Component | Vitest + Testing Library | Labels, error association, keyboard behaviour, empty and error states |
| End-to-end | Playwright | The full citizen journey, with the AI stubbed; plus the AI-unavailable fallback journey |
| Accessibility | axe via Playwright, per route | The criteria in `06-ux-system.md`; zero serious/critical violations is the gate |
| Responsive | Playwright viewport matrix | 360, 390, 430, 768, 1024, 1440 — no horizontal overflow, no clipped control |
| AI evaluation | Deterministic eval cases in `docs/evals/` | The case list in `09-ai-behavior.md`; results logged in `11-evaluation-log.md` |

## Rules

1. **Red, green, refactor.** Write the failing test or, for UI, the explicit acceptance criterion first.
2. A feature is not complete because it worked once by hand.
3. **Never mark a journey complete in `18-verification-matrix.md` without evidence** — a passing test, or a dated manual check recorded in `11-evaluation-log.md`.
4. The AI-off path is tested every time the AI-on path is.
5. Every bug fixed gets a regression test.

## Commands

To be filled in by the agent that creates the project. Placeholder contract — keep these names so future agents and `13-agent-handoff.md` stay valid:

```
npm run dev          # local
npm run build        # production build must pass
npm run typecheck    # zero errors
npm run lint         # zero errors
npm test             # unit + component
npm run test:e2e     # Playwright journey + axe
npm run eval         # AI evaluation cases
```

## Definition of done for any feature

Unit tests pass · component tests pass · e2e passes where applicable · build passes · typecheck passes · lint passes · the journey checked by hand · mobile checked at 360 px · axe clean · error and empty states checked · memory files and `18-verification-matrix.md` updated · committed and pushed.
