# 13: Agent Handoff

**Last updated:** 2026-08-27 (final design sprint, second pass): **All three P1 screens (Clarify, Request builder, Authority) redesigned under visual-direction-v2 (grayscale-core palette) and pushed.** Next: P2 screens (Review, Mock filing, Tracking, Not-RTI), then P3 (About).

The user issued a final, comprehensive design-sprint directive superseding the Phase V teal/amber decision below: core palette is now black/white/grayscale, colour spent only where meaning would otherwise be lost (the fee/wrong-office warning). See `docs/design/visual-direction-v2.md` for the full rationale. The "VISUAL REBUILD STATUS (Phase V)" section further down is now **superseded** by this directive; kept for its component-provenance history, not its colour/next-step conclusions.

| | |
|---|---|
| **Current phase** | Final design sprint, P1 screens done (Clarify, Request builder, Authority), P2 next |
| **Current commit** | see `git log --oneline -1` (`5dd4c89` at last handoff write) |
| **Product state** | Feature-complete, 8 routes, functionally verified. Landing (dark hero, Phase V), Clarify, Request builder, Authority visually rebuilt under visual-direction-v2. Review, Filed, NotRti, About still on the Phase 3 `Card`/`Notice` visual design |
| **Test counts** | 78 reasoning + 79 unit/component + 114 Playwright = **271 passing**, re-verified after each of the three P1 redesigns (desktop 57/57, mobile-360 57/57) |
| **Component provenance** | `docs/design/component-provenance.json` (Phase V) plus the new `Choice` primitive in `src/ui/primitives.tsx` (in-house, not externally sourced, so no provenance/mutation-test entry needed) |
| **Bundle** | 123 kB to 166 kB gzipped (+43 kB for `motion`) |
| **Em dash check** | `scripts/check-em-dash.js`, wired into `npm test`. Fixed a self-referential bug where the checker flagged its own `EM_DASH` literal (excluded itself from the scanned file list) |
| **Top risk** | **Not deployed to a public URL**: competition requirement R7 |
| **Second risk** | `19-codex-contribution-log.md` is empty: it is the R1 evidence |
| **Third risk** | P2/P3 screens (Review, Filed, Tracking, NotRti, About) still read as the older, more generic `Card`-boxed design next to the now-editorial P1 screens |
| **Next action** | Redesign Review (P2, "calm checkpoint grouped by mental model"), then Mock filing, Tracking, Not-RTI, then About (P3). Reuse `Choice`/`Eyebrow`/`PageTitle` from `src/ui/primitives.tsx`, drop the teal `Card` fills, keep amber `Notice` for warnings only |

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

### NEXT EXACT STEP (superseded, see top of file)

~~Rebuild `src/screens/Authority.tsx` visually.~~ Done, along with Clarify and Request builder, under `visual-direction-v2.md` (grayscale core palette, not the teal/amber described above). Next exact step is now the P2 screens; see the status table at the top of this file.

### WHAT visual-direction-v2 ACTUALLY CHANGED (2026-08-27, second pass)

- Added `Eyebrow` and `Choice` (radio/checkbox/button-role variants) to `src/ui/primitives.tsx`. `Choice` gives grayscale ink-on-paper selected states (heavier border, filled dot/check) instead of the teal-wash `bg-brand-50 ring-brand-700` pattern, with `motion`'s `whileTap` for press feedback.
- `Button`/`Card` primitives restyled: primary button is now `bg-ink-900`, not `bg-brand-700`; secondary is a bare ink ring, not a paper-boxed ring.
- `src/screens/Clarify.tsx`: removed the `Card` wrapper, question renders as a Fraunces headline with an eyebrow step count (matching Landing's grammar), options are full-width `Choice` rows.
- `src/screens/RequestDraft.tsx`: removed `Card` wrappers, checkbox list uses `Choice as="checkbox"`, the request textarea is restyled from monospace/bordered code-box to `font-serif text-lg` on a `bg-paper-100` paper block (still the same single editable textarea, since it already regenerates live from the checkboxes and so already functions as Baymard's "live preview" without needing a separate read-only step).
- `src/screens/Authority.tsx`: removed `Card` wrappers, office name is now the page `<h1>` (recommendation first), reasons are a numbered `<ol>` with filled ink circles instead of teal bullet dots, alternative-office and search-hit rows use `Choice as="button"` (added a third `Choice` mode because these are pick-one-from-a-list actions, not real form controls in a fieldset, so `role="radio"` without a `radiogroup` wrapper would have been an a11y regression: `getByRole('button', ...)` tests confirmed this was previously a plain `<button>`).
- Fixed `scripts/check-em-dash.js` flagging its own `EM_DASH` literal (pre-existing bug, unrelated to this pass, was blocking `npm test` for everyone).
- Verification per screen: `npx tsc --noEmit` clean, full `npm test` (79 unit + 78 reasoning), Playwright `desktop` and `mobile-360` projects (57/57 each including `a11y.spec.ts` and `contrast.spec.ts`), real-Chrome screenshot via `mcp__claude-in-chrome__*` at desktop width (1536px window; the tool's `resize_window` does not reliably control the real Chrome window's viewport, so true 360/390px screenshots were not captured this pass — noted honestly rather than claimed).
- Each screen committed and pushed separately: `9ca1d70` (Clarify), `9f2f461` (Request builder), `5dd4c89` (Authority).

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
