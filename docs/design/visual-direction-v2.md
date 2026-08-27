# Visual direction v2: black, white, editorial

**Date:** 2026-08-27. Supersedes the teal/amber palette for the four P0/P1 screens (Clarify, Draft, Authority, Review). Landing keeps its dark hero (already distinctive, already verified) but adopts the same type and grayscale discipline where it touches shared components.

## The thesis in one line

Grayscale is the base. Colour is spent on exactly one thing: the moment money or a wrong office is at stake. Everywhere else, hierarchy comes from type, weight, and space, not colour.

## Palette

- `ink` scale stays (near-black to mid-gray on warm paper). This IS the product now, not a placeholder.
- `brand` teal is retired as a UI colour. It survives only as the focus ring (a functional signal, not decoration) and the tiny progress bar fill.
- `warn` amber is kept, but reserved *exclusively* for the one thing that costs a citizen money: the state/UT no-refund warning and the fee notice. Nowhere else.
- Selected/active states (radio choice, checkbox choice) use **ink on paper with a heavier border and a filled dot/check**, not a colour wash. A selected option looks selected because it is *heavier*, not because it turned green.

## Typography

Unchanged from Phase V: Fraunces (display) + Inter (body). Already distinctive, already verified, keep it. What changes is *how much of the page it governs*: every screen's primary decision point becomes a headline-weight statement, not a form label.

## Component philosophy: research-driven, not decorative

- **Clarification (one-question-at-a-time research):** Nielsen Norman and Baymard research on multi-step forms is consistent on three points relevant here: (1) show exactly one decision at a time to avoid decision fatigue, (2) always show progress and total count, (3) make "I don't know" a first-class, equally-sized option, not an afterthought link. The current screen already does all three structurally; the fix is making the choice itself feel like a decision, not a checkbox list, using large single-column tap targets with a visible selected state.
- **Form/request builder (progressive disclosure + live preview):** the established pattern for "help someone write structured text" is show the pieces, then show the assembled result, updating live, not a blank textarea with instructions above it. Baymard's research on real-time form guidance backs live preview over instructions read once, then abandoned.
- **Search/recommendation (authority):** research on "confidence in an automated recommendation" (used in recommender-system UX writing, e.g. Google's People + AI Guidebook) converges on: show the recommendation first, show *why* second, make override effortless and visually equal in weight to acceptance, never bury the escape hatch.
- **Review/confirmation screens:** the standard pattern is group by the citizen's mental model (what happened, what I'm asking, where it goes) not by database shape, and make every group's edit action reachable without scrolling past it.

None of this requires a new dependency. `motion` is already installed from Phase V; it is reused, not duplicated.

## Anti-patterns removed in this pass

- Colour-only selected states (teal background on every choice) become border-weight + fill states.
- The 3000-character raw textarea moves below a compact live preview, so the first thing the citizen sees is the readable, assembled sentence, not a code-editor-styled box.
- Bullet-list "why this office" becomes a numbered, weighted sequence (what you said leads to what it means leads to where it goes), matching the brief's explicit request.

## What is NOT changing

- The reasoning engine, the routes, the tests, the accessibility semantics. This is a visual pass on top of a verified functional layer.
- Landing's dark hero and DecryptedText/AnimatedContent treatment: it works, it is verified, it stays.
