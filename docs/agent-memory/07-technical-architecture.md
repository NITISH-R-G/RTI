# 07 — Technical Architecture

**Status: PROPOSED, NOT DECIDED** — but now constrained by the frozen MVP (`docs/design/mvp-spec.md` v1.0). Ratify or replace before writing application code.

## What Phase 2 settled

The MVP needs **no server at runtime**: no LLM (PD-009), no identity collection (ED-014), no persistence beyond `localStorage`, and reference data bundled at build time. That makes a **fully static build viable**, and static is the fastest thing to load on a slow connection (master instruction §32). The remaining question for ADR-0002 is only which tool produces that static build.

Required modules, regardless of framework:

| Module | Contents | Purity |
|---|---|---|
| `rules/` | fee, appeal date, 3,000-char limit, allowed character set, sanitisation | Pure, unit-tested, no imports from UI |
| `taxonomy/` | the 5 domains, keywords/synonyms/misspellings, clarifying questions, info types, authority mappings, templates | Data + pure selectors |
| `authorities/` | the bundled 2,904-name dataset + ranked local search | Pure |
| `assistant/` | the `Assistant` interface with `RuleAssistant` shipping | Pure; `ModelAssistant` is FUTURE only |
| `state/` | journey state + `localStorage`, try/catch wrapped | Side-effecting, isolated |
| `ui/` | the 8 routes in `information-architecture.md` | No business logic |

**Non-negotiable:** an authority name may only be rendered if it exists verbatim in the bundled dataset. Enforced in `authorities/`, not by convention.

**Original proposal follows.**

 No code exists. The next agent should either ratify this as `docs/adr/0002-stack.md` or replace it with a better-argued alternative — but must do so *before* writing application code, not after.

## Proposal

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | One deploy artefact, good defaults for a public URL. **Re-examine under PD-009** — see Open decisions |
| Styling | Tailwind CSS with a small token layer | Fast, and keeps the design system in one place rather than scattered |
| Assistant | **No runtime LLM** (PD-009). Deterministic rule-based implementation behind an `Assistant` interface; runs entirely client-side | R1 satisfied via Codex-assisted development. No key, no latency, no network |
| State | Client-side session state + `localStorage` for the in-progress draft | No database needed; nothing personal leaves the browser |
| Persistence | None server-side | Avoids storing citizen text; also `25`/`26` — simplest thing that works |
| Tests | Vitest (unit/logic), Playwright (end-to-end + accessibility via axe) | Covers logic, journey and a11y, which are the three things we claim |
| Hosting | Vercel (or any static/edge host), public, no auth wall | R7. With no runtime LLM, a fully static export is now viable and should be considered |

## Why no database

Nothing in the demo journey requires state to survive a browser. Adding one would add deploy complexity, a privacy surface (citizen problem descriptions are sensitive), and nothing the judges score. Revisit only if the tracking view genuinely cannot work without it.

## Boundaries that must hold

1. **The journey depends on no model, no API key and no network call** (PD-009). This is the shipping path, not a fallback.
2. **All assistant behaviour sits behind one `Assistant` interface** (`09-ai-behavior.md`) so a model implementation can be added later without touching the UI. The UI must never know which implementation is in use.
3. **The deterministic rule layer is pure and unit-tested.** Fees, deadlines, character limits, the allowed character set and authority search are pure functions.
4. **The product makes no network request to any `*.gov.in` host at runtime.** (R8.) Reference data is baked in at build time from `docs/research/`.
5. **Nothing the citizen types leaves their browser.** With no runtime model this is a real privacy property, and the product may state it — so nothing may quietly break it later.
6. If a model is ever added, it goes in a **server route only**; no `NEXT_PUBLIC_` AI key, ever; and its output is schema-validated and constrained before rendering.

## Environment

No environment variables are required to run the product. An `.env.example` should still exist, documenting the optional future model configuration:

```
# Optional. Unset by default — the product runs fully without these (PD-009).
OPENAI_API_KEY=      # server-only, never committed
OPENAI_MODEL=        # pinned model id, if a ModelAssistant is ever enabled
```

## Open decisions

- Whether Next.js is warranted at all now that no server route is required. A static export or a Vite SPA may be the simpler, faster-loading answer — decide this when ratifying ADR-0002, and prefer whichever loads fastest on a slow connection (master instruction §32).
- Hindi/Hinglish input handling without a model — likely a bilingual interview UI plus script-tolerant matching. See `09-ai-behavior.md`.
- Whether the tracking view needs any persistence beyond `localStorage`.
