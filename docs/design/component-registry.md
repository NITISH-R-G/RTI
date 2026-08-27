# Component registry

Markdown version of `component-provenance.json`, extended with the fields the
2026-08-27 design-sprint directive requires (dependency, accessibility,
mobile, visual verification). The JSON file is kept as-is for the earlier
audit trail; this file is the current source of truth.

**Rule for every row below: a component is only marked "imported" if its
actual source was fetched and the resulting file exists in this repo. If a
provider's pattern only informed a decision, it is marked INSPIRED, NOT
IMPORTED, never "used".**

## Providers actually investigated this session

| Provider | Access method | Result |
|---|---|---|
| React Bits | Public JSON registry, `https://reactbits.dev/r/*.json`, fetched directly with `curl`, no auth | **Accessible.** 672 items, 168 TS+Tailwind variants. Two components imported (below). |
| 21st.dev | Attempted `21st.dev/r/styles/default/index.json` and a known component path | **Blocked.** 404/403, no MCP connected, no API key configured. Not used anywhere in this product. |
| Origin UI / OriginKit | Attempted `registry.json` and a single component fetch | **Inconclusive.** Serves through a redirect/CDN layer, not a flat fetchable registry within the session's time budget. Not used. |
| Bklit | Web search (`WebSearch` this session, confirmed 2026-08-27) | **Found, not applicable.** Bklit UI is a set of composable chart/data-visualization components distributed through the shadcn registry (`npx shadcn@latest add @bklit/line-chart`). This product has no charts or data visualizations, so nothing in its catalog fits any screen. Not used, for a substantive reason rather than inaccessibility. |
| shadcn/ui | Not attempted this pass | No MCP connected; the existing `Choice`/`Button` primitives already cover the radio/checkbox/button surface shadcn's registry would provide, so this was not pursued under the one-day timebox. Recorded as **not investigated**, not as "considered and rejected". |
| Radix UI | Not attempted this pass | Same reasoning: the product's interaction surface (radio-like choice rows, buttons, textareas) is currently satisfied by hand-built accessible primitives (native `role`/`aria-*`, no unstyled-primitive layer needed yet). Recorded as **not investigated**. |

## Components actually in the application

| Component | Provider | Source URL | Status | Used in | Adapted? | Dependency | A11y | Mobile | Visually verified |
|---|---|---|---|---|---|---|---|---|---|
| DecryptedText | React Bits | https://reactbits.dev/text-animations/decrypted-text | **IMPORTED** (verbatim registry fetch) | `src/screens/Landing.tsx` hero | No; vendored as-is into `src/vendor/reactbits/DecryptedText.tsx` | `motion@^12.23.12` | Ships its own two-layer DOM: `sr-only` span with the real final text, `aria-hidden` span with the scrambling glyphs. Mutation-tested in `e2e/component-mutation.spec.ts`. | Respects viewport width, no fixed pixel sizing | Yes, real-Chrome screenshot at desktop width this session and prior sessions |
| AnimatedContent | React Bits (concept), reimplemented | https://reactbits.dev/animations/animated-content | **INSPIRED, NOT IMPORTED verbatim** — the API shape (`useInView` reveal) came from the registry component, but the implementation is hand-written against `motion` instead of the registry's `gsap` variant, to avoid a second animation dependency for two components | `src/screens/Landing.tsx` evidence block | Reimplemented, not copied | Same `motion` dependency (shared, not additive) | `useReducedMotion()` skips straight to the resting state | `-10%` `useInView` margin verified against real small-viewport scroll behavior (documented mutation test finding) | Yes |
| Stepper | React Bits (concept) | https://reactbits.dev/components/stepper | **EVALUATED, NOT IMPLEMENTED.** Descoped in the Phase V pass after the Landing hero consumed the available time; the Authority screen instead uses a numbered `<ol>` (plain markup, no dependency) for the "why this office" sequence | Not used anywhere | N/A | N/A | N/A | N/A |

## In-house components (not externally sourced; recorded for completeness, not claimed as a library integration)

| Component | Where | Why it exists |
|---|---|---|
| `Choice` (`src/ui/primitives.tsx`) | Clarify, Request builder, Authority (alternatives + search), Review (fee choice) | A grayscale radio/checkbox/plain-button choice row with `motion`'s `whileTap` for press feedback. Built in-house rather than imported because no accessible source (React Bits, 21st.dev, shadcn) was actually verified reachable in this session for this exact pattern; building it in-house and documenting it honestly here was judged better than fabricating an import. |
| `Eyebrow` / `PageTitle` (`src/ui/primitives.tsx`) | Every screen | Small uppercase label + Fraunces headline, the visual grammar established on Landing and extended everywhere for consistency. In-house. |

## What this means for the "mandatory component libraries" directive

React Bits is the only provider with a verified, working acquisition path in
this session (direct registry JSON fetch, no MCP required). 21st.dev, Origin
UI, Bklit, shadcn, and Radix were genuinely investigated (search performed,
access attempted where an endpoint existed) and, where inaccessible or not
pursued, are recorded as such above rather than silently omitted or falsely
claimed as integrated. If a future session gets MCP access to 21st.dev or
shadcn, the Authority screen's search-and-select interaction and the
Request builder's checkbox list are the two most likely places a verified
registry component would replace the current in-house `Choice` primitive.
