# ADR-0002 — Application stack

**Date:** 2026-08-26 · **Status: ACCEPTED (amended)** — ratified at the start of Phase 3.

## Amendment on acceptance

Phases 2 and 2.5 changed the premises this ADR was drafted under, so it is accepted **with one substantive change**:

**Next.js is replaced by Vite + React + TypeScript, building to a static bundle.**

*Why the change.* The original proposal chose Next.js so that server routes could keep an OpenAI key off the client. PD-009 removed the runtime LLM, ED-014 removed identity collection, and Phase 2 confirmed no server-side persistence is needed. **There is no server-side work left to do.** A framework whose main justification was its server is the wrong tool once the server is gone — it would add build weight and deploy complexity for nothing, against master instruction §32 (fast perceived performance on slow connections).

*What is unchanged:* TypeScript, Tailwind with a token layer, Vitest, Playwright + axe, a public URL with no auth wall, and every boundary listed below.

## Accepted stack

| Layer | Choice |
|---|---|
| Build | Vite, static output |
| UI | React + TypeScript |
| Routing | React Router (client-side; the journey has no server routes) |
| Styling | Tailwind + a small design-token layer |
| Reasoning | `src/reasoning/` — already built, dependency-free ESM, ported unchanged |
| State | React state + `localStorage`, try/catch wrapped |
| Unit / component tests | Vitest + Testing Library |
| E2E + accessibility | Playwright + axe-core |
| Hosting | Any static host, public, no auth wall |

`npm test` and `npm run eval` must keep working for the reasoning suite, which uses Node's built-in runner and needs no dependencies.

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
