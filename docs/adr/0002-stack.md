# ADR-0002 — Application stack

**Date:** 2026-08-26 · **Status: PROPOSED — not yet accepted**

The next agent must accept, amend, or replace this **before** writing application code, and update the status line either way.

## Context

We need one citizen-facing journey, reachable at a public URL, powered by an OpenAI model, with the API key kept off the client, plus unit, end-to-end and accessibility testing. No database is required by the journey. Time is short and the judging rewards a working build, not infrastructure.

## Proposed decision

Next.js (App Router) with TypeScript; Tailwind with a small design-token layer; the OpenAI API called only from server routes with structured outputs validated by Zod; client-side state with `localStorage` for the in-progress draft and no server-side persistence; Vitest for unit and component tests; Playwright with axe for end-to-end and accessibility; deployed on Vercel.

## Alternatives considered

- **Vite + React SPA with a small server for the AI call.** Lighter, but adds a second deploy target for the one thing that must stay server-side.
- **Server-rendered app with no client framework.** Best for accessibility and performance, worst for the editable, stateful draft flow that is the core of the product.
- **Adding a database.** Nothing in the journey needs state to outlive a browser session, and storing citizens' problem descriptions creates a privacy surface for no scored benefit.

## Consequences if accepted

- The OpenAI key exists only as a server environment variable; no `NEXT_PUBLIC_` AI key, ever.
- The deterministic rules layer must be importable and testable without the AI, so the fallback journey is real rather than aspirational.
- The product makes no runtime request to any `*.gov.in` host; reference data is baked in at build time.
- Model id must be pinned and recorded in `docs/agent-memory/02-competition-rules.md` as the R1 evidence.
