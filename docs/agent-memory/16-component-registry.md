# 16: Component Registry

Every third-party or adapted component used in the product is recorded here: component, source, URL, why it was chosen, where it is used, modifications, licence/usage notes, accessibility considerations.

**Status: 2 components adopted from React Bits.** Full acquisition and verification detail: `docs/design/component-provenance.json` and `docs/evals/component-mutation-testing.md`.

## Rules before adopting anything

1. Does it improve the actual citizen experience? If it is only decorative, do not adopt it.
2. Check licence/usage terms and record them here.
3. Prefer source-code components that live in this repository over runtime dependencies.
4. Accessibility must survive adoption: labels, focus, keyboard, `aria`. If a component breaks any criterion in `06-ux-system.md`, fix it or drop it.
5. Adapt styling to our design system. Third-party components do not get to dictate the product's look.
6. Avoid dependency bloat.

Approved sources to search first: https://reactbits.dev/ , https://21st.dev/ .

**21st.dev status:** evaluated (2026-08-27). No MCP for 21st is connected in this session and its unauthenticated registry endpoints return 403/404. Not used. Do not claim a 21st.dev component exists in this product unless it has been fetched and verified the same way React Bits components below were.

## Registry

| Component | Source | URL | Why | Used in | Modifications | Licence | A11y notes |
|---|---|---|---|---|---|---|---|
| DecryptedText | React Bits | https://reactbits.dev/text-animations/decrypted-text | The citizen's example sentence resolves from scrambled characters into readable text, dramatizing the product's actual claim (unstructured problem to structured request) rather than decorating the hero | `src/screens/Landing.tsx` (hero) | None; vendored verbatim from the registry fetch into `src/vendor/reactbits/DecryptedText.tsx` | React Bits components are free to use (MIT-style, per the site's own terms) | Ships its own `sr-only` fallback with the final text, kept intact; mutation-tested in `e2e/component-mutation.spec.ts` |
| AnimatedContent | React Bits (concept; reimplemented) | https://reactbits.dev/animations/animated-content | Stages the portal-refusal-vs-our-response evidence as a real reveal instead of a static paragraph dump | `src/screens/Landing.tsx` (evidence block) | Reimplemented against `motion` instead of the registry's `gsap` variant, so the product depends on one animation library, not two, for two components | Same as above | Respects `prefers-reduced-motion` via `useReducedMotion` (skips straight to the resting state); mutation-tested |
| Stepper | React Bits (concept) | https://reactbits.dev/components/stepper | Would visualize "your situation to what that means to where it belongs" on the Authority screen | Not yet wired into any screen | N/A: not implemented | N/A | **Evaluated, not implemented.** Descoped under a one-day timebox after the Landing hero (P0) took the available time. Next step recorded in `13-agent-handoff.md` |

## Dependencies added

`motion@^12.23.12`, shared by all three components above (only two are wired in). Bundle impact: +43 kB gzipped (123 kB to 166 kB). Recorded honestly in `docs/evals/component-mutation-testing.md` rather than omitted.
