# 07 — Technical Architecture

**Status: PROPOSED, NOT DECIDED.** No code exists. The next agent should either ratify this as `docs/adr/0002-stack.md` or replace it with a better-argued alternative — but must do so *before* writing application code, not after.

## Proposal

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | Server routes keep the OpenAI key server-side; one deploy artefact; good defaults for a public URL |
| Styling | Tailwind CSS with a small token layer | Fast, and keeps the design system in one place rather than scattered |
| AI | OpenAI API, **server-side only**, structured outputs validated with Zod | R1/R2. Key must never reach the browser |
| State | Client-side session state + `localStorage` for the in-progress draft | No database needed; nothing personal leaves the browser |
| Persistence | None server-side | Avoids storing citizen text; also `25`/`26` — simplest thing that works |
| Tests | Vitest (unit/logic), Playwright (end-to-end + accessibility via axe) | Covers logic, journey and a11y, which are the three things we claim |
| Hosting | Vercel, public, no auth wall | R7 |

## Why no database

Nothing in the demo journey requires state to survive a browser. Adding one would add deploy complexity, a privacy surface (citizen problem descriptions are sensitive), and nothing the judges score. Revisit only if the tracking view genuinely cannot work without it.

## Boundaries that must hold

1. **The OpenAI key lives only in a server route.** No `NEXT_PUBLIC_` AI key, ever.
2. **AI output never sets application state directly.** It is parsed, schema-validated, clamped, and only then rendered as a *proposal* (PD-004, `09-ai-behavior.md`).
3. **The deterministic rule layer is importable and testable without the AI.** Fees, deadlines, character limits and the allowed character set are pure functions with unit tests.
4. **The product makes no network request to any `*.gov.in` host at runtime.** (R8.) Reference data is baked in at build time from `docs/research/`.
5. **The journey must complete with the AI switched off.** A deterministic fallback path is part of the definition of done, not a stretch goal.

## Environment

```
OPENAI_API_KEY=      # server-only, never committed (see .gitignore, and 15-risk-register.md)
OPENAI_MODEL=        # pinned model id, recorded here once chosen
```

An `.env.example` must exist with these keys and no values.

## Open decisions

- Exact OpenAI model id (needs pinning, then recording in `02-competition-rules.md` as the R1 evidence).
- Hindi/Hinglish input handling: model-side or a translation step. See `09-ai-behavior.md`.
- Whether the tracking view needs any server persistence at all.
