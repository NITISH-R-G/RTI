# 13: Agent Handoff

**Last updated:** 2026-08-27: **PHASE V (visual rebuild) IN PROGRESS, landing screen (P0) complete and verified. Authority and Clarify screens (P0) not yet visually rebuilt.** Next: continue the screen-by-screen visual rebuild in priority order, starting with Authority.

| | |
|---|---|
| **Current phase** | Phase V, one screen down of three P0 screens |
| **Current commit** | see `git log --oneline -1` |
| **Product state** | Feature-complete, 8 routes, functionally verified. Landing visually rebuilt; Clarify, Authority, Draft, Review, Filed, NotRti, About still on the original Phase 3 visual design (functional, tested, but not yet visually distinctive) |
| **Test counts** | 78 reasoning + 79 unit/component + 114 Playwright = **271 passing** |
| **Component provenance** | `docs/design/component-provenance.json`; mutation tests in `e2e/component-mutation.spec.ts`, 5 tests stable across repeats |
| **Bundle** | 123 kB to 166 kB gzipped (+43 kB for `motion`) |
| **Em dash check** | `scripts/check-em-dash.js`, wired into `npm test`, 0 occurrences repo-wide (this was also retroactively fixed across all pre-existing docs and comments in this session) |
| **Top risk** | **Not deployed to a public URL**: competition requirement R7 |
| **Second risk** | `19-codex-contribution-log.md` is empty: it is the R1 evidence |
| **Third risk** | Only 1 of 3 P0 screens (Landing, Clarify, Authority) has had its visual rebuild; a judge reaching Clarify or Authority sees the older, more generic design |
| **Next action** | Rebuild Authority screen visually (the "proof" screen per the brief), then Clarify, then stop and re-review before touching P1/P2 screens |

## VISUAL REBUILD STATUS (Phase V)

### What was actually done, and how it was verified

**React Bits was genuinely evaluated and used**, not just mentioned. Verification chain for each component, in full, is in `docs/design/component-provenance.json` and `docs/evals/component-mutation-testing.md`:

1. Fetched the real registry (`https://reactbits.dev/r/registry.json`), 672 items, 168 TypeScript+Tailwind variants, browsed by category (backgrounds, text animations, wrappers, components).
2. Checked dependencies before selecting anything (rejected WebGL-heavy backgrounds like Dither/Beams/Aurora as disproportionate for a low-bandwidth civic tool).
3. Fetched two components real source directly (`DecryptedText`, verbatim; `AnimatedContent`, reimplemented against `motion` instead of `gsap` to avoid a second animation dependency).
4. Wired both into `src/screens/Landing.tsx`.
5. Wrote mutation tests that check DOM structure and state transitions only the real component produces (not "does text X appear"), and verified them against a comparison route (`/about`) that has neither component, proving the removed-component baseline is genuinely different from the present-component baseline.
6. All 5 mutation tests pass, stable across 3 repeats on both viewport projects.

**21st.dev was evaluated and genuinely could not be used.** No MCP for 21st is connected in this session. Its unauthenticated registry endpoints return 403/404. This is recorded honestly in `component-provenance.json` rather than glossed over or fabricated.

**Origin UI was evaluated and not pursued.** It serves through a redirect/CDN layer, not a flat fetchable JSON registry like React Bits, and confirming a working acquisition path within the time budget was not achieved. Recorded as inconclusive, not claimed as used.

### CURRENT DESIGN DIRECTION

- **Typography:** Fraunces (serif, Google Fonts) for all headings, Inter for body. This alone is the single biggest de-genericizer: a system-sans-only page is instantly recognizable as a template; a serif display face signals deliberate design.
- **Colour:** unchanged from Phase 3, deep teal (`--color-brand-*`) and warm amber (`--color-warn-*`), which was already NOT the generic AI green/orange despite the initial concern. Verified by reading `src/styles.css` before assuming otherwise.
- **Landing hero:** full-bleed dark section (`bg-ink-900`), citizen's example sentence resolves via `DecryptedText`, staged three-part evidence reveal via `AnimatedContent` showing the real portal refusal beside our response.
- **Motion philosophy:** every animation ties to a specific narrative beat (decrypt equals uncertainty becoming clarity; staged reveal equals the actual before/after). Nothing decorative. `useReducedMotion` respected in `AnimatedContent`.

### REJECTED AESTHETICS

Generic green/orange "AI safety" palette (never actually present, checked and confirmed); glassmorphism; gradient blobs; particle backgrounds (WebGL cost); rounded card everywhere (kept `Card` but it is not the only visual language now); infinite decorative animation.

### SELECTED COMPONENT SOURCES

React Bits only, for the reasons above. See `16-component-registry.md` for the full registry table.

### MCP STATUS

No MCP for React Bits, 21st.dev, or shadcn is connected in this session. All React Bits acquisition happened via direct `curl` against the public registry JSON, which is the same data an MCP would surface. If a future session has 21st.dev MCP access, revisit that provider specifically for the Authority screen's search and selection interaction, which was the brief's suggested use case for it.

### CURRENT SCREEN (where the rebuild stopped)

Landing (`src/screens/Landing.tsx`) is done and verified: typecheck clean, 8 component tests pass, mutation tests pass, 271 total tests pass, 0 em dashes, 0 axe violations, 0 contrast violations, 0 horizontal overflow at 360px, real browser screenshot inspected at both desktop and 360px.

**Not yet started:** Clarify, Authority (both P0 per the brief), Draft, Review, Filed, NotRti, About (P1/P2). These are functionally complete and fully tested from Phase 3/4 but visually still use the plain `Card`/`Notice`/`Button` primitives with no React Bits treatment. They are NOT broken. They are the correct next targets, in this order: Authority first (the brief calls it the moment the product proves why it exists), then Clarify.

### VISUAL DECISIONS MADE

1. Kept the existing colour tokens rather than inventing a new palette: they were already deliberate (teal and amber), not the generic default the brief worried about.
2. Added exactly one font pairing (Fraunces plus Inter) rather than a larger type system, given the time budget.
3. Chose to spend the available time on ONE screen done properly (with real components, mutation tested) over five screens with shallow, unverified changes.
4. Kept `data-evidence-quote` and `data-testid="landing-hero"` as stable test hooks; any future screen rebuild should follow this pattern of adding a testid rather than relying on utility classes for test selectors (a real bug was found and fixed this session because `.bg-ink-900` matched two elements).

### UNRESOLVED VISUAL RISKS

- Bundle grew by 43 kB gzipped for `motion`. Acceptable for now; if more screens adopt heavier React Bits components, code splitting (vite's `build.rolldownOptions` or manual `import()`) should be revisited.
- The Stepper concept for Authority was evaluated but not built. The brief explicitly calls Authority the most important screen to fix visually; this is the highest priority remaining gap.
- Two mutation tests initially failed for reasons worth knowing before writing more: (a) `useInView`'s -10% margin means partial viewport visibility is not enough to trigger a reveal, so tests scrolling elements into view must center them, not just call `scrollIntoViewIfNeeded()`; (b) the library's own `sr-only` fallback mirrors the animating state, not a static final string, so assertions must wait for settlement before checking accessible text.

### NEXT EXACT STEP

Rebuild `src/screens/Authority.tsx` visually. Apply the same discipline: read the current file first, decide what genuinely needs a component versus what is already fine, prefer reusing `motion` (already a dependency) over adding a new one, add a `data-testid` before writing any new test, run the full suite (typecheck, unit, build, e2e) before considering it done, then stop and visually review in a real browser before moving to Clarify.

---

## Context Recovery Snapshot

**Assume the previous agent's context is gone. This is the recovery point.**

### What exists now

A working prototype. `npm run dev`, open `http://localhost:5173`, type "my pension has not been paid", and the complete journey runs: clarification, information selection, editable draft, explained authority recommendation, review, mock filing, mock tracking. The landing screen has a genuinely distinctive visual treatment (dark hero, serif display type, decrypt animation, staged evidence reveal); every other screen is functionally complete but visually plain.

### The one thing to understand first

RTI Online asks which office before what do you want. We reversed it. Reversing that back means abandoning the product. Evidence: typing "my pension has not been paid" into the real portal's authority search returns "No such Public Authority available in this portal !" while the correct department sits in a dropdown on the same screen. This is now shown, not just asserted, on the landing page itself.

### Where the code is

| Path | What |
|---|---|
| `src/reasoning/pipeline.js` | **FROZEN** Phase 2.5 engine. Changing it requires the process in `docs/evals/taxonomy-evaluation.md` |
| `src/reasoning/taxonomy.js` | The five domains as data |
| `src/reasoning/refine.js` | Answer refinement, deliberately separate from the frozen pipeline |
| `src/rules/` | Fee, appeal date, character rules: pure, sourced, unit tested |
| `src/draft/compose.ts` | Information options and request composition |
| `src/authorities/` | The 2,904 captured names, search, honest context, reasoning bullets |
| `src/vendor/reactbits/` | Real React Bits component source (`DecryptedText`) and a `motion` based reimplementation (`AnimatedContent`) |
| `src/screens/` | Eight routes; Landing visually rebuilt, the rest on the Phase 3 design |
| `docs/design/component-provenance.json` | Full acquisition and verification chain for every external component claim |
| `test/`, `src/**/*.test.*`, `e2e/` | 271 automated tests, including `e2e/component-mutation.spec.ts` |

### Commands

npm run dev, npm run build, npm run typecheck, npm test (em-dash check plus reasoning plus unit/component), npm run test:e2e (Playwright), npm run check:em-dash, npm run eval, npm run eval:holdout.

### Current numbers, all verified

| | |
|---|---|
| Reasoning tests | 78 passing |
| Corpus | 60/60, 0 dead ends, 0 fabricated authorities |
| Unit plus component | 79 passing |
| Playwright, desktop plus 360px | 114 passing (was 104; plus 10 for component mutation tests) |
| Component mutation tests | 5 passing, stable across repeats |
| axe serious/critical | **0** |
| Colour contrast violations | **0** (harness self-checked) |
| Em dash occurrences | **0** repo-wide (docs plus source), enforced in `npm test` |
| Bundle | 166 kB gzipped (was 123 kB before `motion`) |

### What is blocked

Nothing.

### What is pending

Visual rebuild of Authority, then Clarify (both P0), then Draft, Review, Filed, NotRti, About (P1/P2) if time allows, per the exact next step above. After that: deployment, then submission materials.

### Important decisions that must not be casually reversed

- **PD-009** no runtime LLM; R1 satisfied by Codex-assisted development.
- **PD-010** the product thesis; authority derived from the request, not before it.
- **ED-014** no identity collection: nothing the citizen types leaves the browser.
- **ADR-0002 (amended)** Vite plus React static; Next.js was dropped because no server-side work remains.
- The reasoning engine is frozen. Changes need a failing scenario, a test, a full suite run, and a recorded failure category.
- New this session: the em-dash check is a standing CI gate. Do not disable it or bypass it.
- New this session: any claim that a specific external UI library or component is used requires the same verification chain as `component-provenance.json`: fetch or access proof, real import, real render, and ideally a mutation test. Do not write "React Bits used" or "21st.dev used" in any doc without that chain existing first.

### Known gaps, stated plainly

1. No real screen-reader test. axe, semantics, keyboard, focus order and accessible naming are covered; assistive technology is not. Do not claim otherwise.
2. The held-out reasoning set is burned (KI-013). A fresh blind set is a Phase 4 requirement, already done once (`docs/evals/blind-reasoning-results.md`); a second fresh set would need writing again if reused.
3. Five domains only. Everything else takes the honest-failure path by design.
4. English-centric (KI-014). Devanagari input lands on no signal.
5. `19-codex-contribution-log.md` is still empty: it is the R1 evidence. Only real Codex work may be logged there.
6. Six of eight screens are visually unrebuilt. Functionally correct, fully tested, but not yet given the same design attention as Landing.
7. Stepper (React Bits) was evaluated but not implemented. Recorded honestly as descoped, not silently dropped.

### Git state

Working tree: check `git status --short` before assuming clean; this session's changes may not yet be committed depending on when this file is read. Check `git log --oneline -8` for the latest history.

### Files to read first

1. `docs/design/component-provenance.json`: what was actually verified to be used, and how
2. `docs/evals/component-mutation-testing.md`: the mutation test story, including two real bugs found and fixed
3. `src/screens/Landing.tsx`: the reference implementation for how a screen rebuild should look
4. `docs/design/mvp-spec.md`: the frozen scope
5. `docs/research/rti-online/authenticated-friction-map.md`: the observed failures
