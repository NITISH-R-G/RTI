# Component mutation testing

**Date:** 2026-08-27. **Suite:** `e2e/component-mutation.spec.ts`, 5 tests, stable across repeated runs.

Proves the claim "this React Bits-sourced component is actually used" by checking DOM structure and state transitions that only the real component produces, then confirming a route with no such component produces none of that structure. A test that only checks "does the text appear" would pass even with the component deleted; these do not.

## DecryptedText (landing hero)

**Claim:** the citizen's example sentence renders through DecryptedText, not a static heading.

- **ORIGINAL:** the hero contains more than 10 individually-wrapped `<span>` elements inside an `aria-hidden` container, one per character, which is how DecryptedText decomposes text. A plain `<p>My pension has not been paid.</p>` produces zero such spans.
- **REMOVED (comparison route):** `/about` renders no per-character span decomposition anywhere on the page. 0.
- **RESTORE:** navigating back to `/` brings the decomposition back, more than 10 spans again.

**Real behavior found while writing this test, not invented for it:** the library's `sr-only` fallback span mirrors the *scrambling* state while the animation runs, not the final sentence. It only matches the real sentence once decryption settles. The first version of this test checked the sr-only text immediately after the element became visible and was flaky, because it was racing a real, unmodified library behavior. Fixed by waiting for the visible glyphs to settle before checking the sr-only text, which is the correct thing to wait for regardless of testing: a screen-reader user gets the announcement once decryption finishes, matching the sighted experience.

## AnimatedContent (evidence block staged reveal)

**Claim:** the three-part evidence sequence (what the portal asked, its refusal, our response) reveals progressively rather than appearing all at once.

- **ORIGINAL:** each of the three blocks inside `[data-evidence-quote]` starts with an inline `opacity: 0` style (motion's animation prop), and all three settle to visible within the animation duration.
- **REMOVED (comparison route):** `/about` has zero elements with an inline `opacity` style anywhere in `<main>`.
- Confirmed the settling actually takes real wall-clock time: an assertion written to check after 1.2 seconds failed (values still `0, 0, 0`); the staged delays are 0.1s / 0.28s / 0.46s plus a 0.5s animation duration each, so the last block does not finish until roughly 1 second in. This is evidence the animation is real, not instant, and the test was fixed to wait long enough rather than weakened.

## What this rules out

- A component imported but never rendered: would produce zero of the structural markers above.
- A component rendered but visually hidden: the "no motion-styled elements on /about" check would not distinguish a hidden-but-present component from an absent one, which is why the comparison route (a real route the component was never added to) is the actual removal baseline, not a CSS trick.
- A claim of "React Bits was used" resting only on an import line in the source: the tests check what actually reaches the DOM and changes over time in a real browser.

## Third component: Stepper

The authority-screen "situation, meaning, destination" progression documented in `docs/design/component-provenance.json` was descoped from this pass under the one-day timebox: the landing hero was the P0 screen per the instruction, and it consumed the available time honestly rather than being rushed to hit a count. Recorded as evaluated and partially implemented, not as delivered-and-verified. See the handoff for the exact remaining step.
