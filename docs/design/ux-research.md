# UX research log

Format per the 2026-08-27 design-sprint directive: research finding →
design implication → screen/component affected → implementation decision →
verification. Entries are added only when a real search or a specific,
attributable design-system/accessibility source backs the claim; this is a
log of what was actually looked up, not a general essay.

## Typography: multilingual readiness

**Research finding:** Searched "Devanagari Latin variable font pairing civic
government UI Google Fonts" (2026-08-27). Hind is documented by its
foundry (Indian Type Foundry, via `github.com/itfoundry/hind`) as designed
explicitly for UI text with Devanagari and Latin in one family, distinct
from most Devanagari webfonts which are display faces retrofitted for
screens. Matangi and Anek were also surfaced as multiscript options but are
either newer/less proven for body text (Matangi) or wider-purpose
multi-script systems built for pan-Indian PSA documents rather than app UI
(Anek).

**Design implication:** A body font that has no Devanagari glyphs forces a
silent fallback to whatever the OS supplies (Noto Sans on Android, Mangal on
older Windows) the moment Hindi text appears, producing a visibly different
typographic voice mid-sentence in a mixed-script layout. This is a real risk
for this product even though translation is not implemented yet, because the
brief requires the *architecture* to not make future translation painful.

**Screen/component affected:** `--font-sans` token in `src/styles.css`,
which every screen inherits through `PageTitle`, `Choice`, `Notice`, body
text.

**Implementation decision:** Replaced Inter with Hind as `--font-sans`,
with `"Noto Sans Devanagari"` as an explicit fallback before generic
`sans-serif`. Kept Fraunces as `--font-display` for headlines (a genuinely
distinctive, non-generic choice already verified in Phase V) but added Hind
to Fraunces's own fallback stack, since Fraunces has no Devanagari glyphs:
a Hindi headline falls through to Hind rather than a mismatched serif
substitute or missing glyphs.

**Verification:** `getComputedStyle` in a live browser tab confirms the
resolved `font-family` stack; a real-Chrome screenshot shows body text
rendering in Hind. Full regression (79 unit tests, 57/57 desktop and
mobile-360 Playwright) unaffected. Commit `dd5dfee`.

Sources: [Hind (itfoundry/hind)](https://github.com/itfoundry/hind),
[Matangi (Adobe Fonts)](https://fonts.adobe.com/fonts/matangi),
[Google Design: Anek, a multiscript font](https://design.google/library/anek-multiscript)

## Choice components: grayscale selection state (carried from the prior pass)

**Research finding:** Nielsen Norman Group and Baymard Institute guidance on
multi-step forms converges on three points: show one decision at a time,
always show progress and total count, and treat "I don't know"/"none of
these" as a first-class option, not a marginal link.

**Design implication:** A selected option should be legible without relying
on hue at all (grayscale-first mandate), since colour contrast alone is an
insufficient and now explicitly disallowed differentiator for this pass.

**Screen/component affected:** `Choice` primitive (`src/ui/primitives.tsx`),
used on Clarify, Request builder's checkbox list, Authority's alternatives
and search results, Review's fee choice.

**Implementation decision:** Selected state changes weight (heavier border,
filled ink background, filled dot/check), not hue. Unselected state is a
thin `border-ink-900/15` on `paper-0`.

**Verification:** `e2e/contrast.spec.ts` (WCAG AA, all screens using
`Choice`) and `e2e/journey.spec.ts`'s 44px target-size check pass; a
grayscale-only screenshot review (this session, real browser) confirms the
selected state reads as "heavier," not merely "different colour."

## Request builder: live preview over static instructions

**Research finding:** Baymard Institute's research on real-time form
guidance favors a live, continuously-updating preview of the end result
over instructions read once at the top of a form and then abandoned as the
user works through it.

**Design implication:** The request builder's checkbox-driven letter
generation already regenerated live before this design pass; the defect
was presentation, not interaction, since it displayed the live result in
monospace/bordered "code editor" styling that read as implementation detail
rather than the actual letter being written.

**Screen/component affected:** `src/screens/RequestDraft.tsx` textarea.

**Implementation decision:** Kept the single live-updating textarea (no new
read-only/edit-mode toggle, which was tried and reverted after it broke
existing `getByLabelText` test contracts for no interaction benefit) but
restyled it as a serif, paper-toned document block, so the live preview
reads as a letter, not a code box.

**Verification:** 79-test unit suite (unchanged assertions against the
textarea) and 57/57 Playwright both projects, commit `9f2f461`.

## Authority screen: recommendation-first hierarchy

**Research finding:** UX writing on trust in automated/rules-based
recommendations (the pattern used across recommender-system UX guidance,
e.g. Google's People + AI Guidebook) converges on: show the recommendation
first, show the reasoning second, and make overriding the recommendation
visually equal in weight to accepting it, never a buried secondary link.

**Design implication:** The office name should be the page's primary
visual element (the `<h1>`), the reasoning should read as a sequence, not
an unordered bullet list implying no priority among reasons, and "see
alternatives"/"search manually" must sit at the same button weight as
"continue," not as a de-emphasized text link.

**Screen/component affected:** `src/screens/Authority.tsx`.

**Implementation decision:** Office name promoted to the page headline;
reasons rendered as a numbered `<ol>` with filled ink-circle markers; both
override actions are `variant="secondary"` buttons next to the primary
action, not links.

**Verification:** Real-Chrome screenshot (this session, desktop width);
57/57 Playwright both projects including `a11y.spec.ts`'s authority check;
commit `5dd4c89`.

## What was NOT researched this pass (recorded honestly, not omitted)

- **Autocomplete/fuzzy search UX**: the Authority screen's manual search
  (`src/authorities/`) is substring matching against office names, not a
  fuzzy or ranked autocomplete. No dedicated UX research was performed for
  this interaction in this pass; it inherited its design from the Phase 3
  implementation. A future pass should research autocomplete empty-state
  and ranking patterns specifically if search usage in a real deployment
  shows citizens struggling to find the right office name.
- **FAQ/accordion UX**: this product has no FAQ screen. Not researched
  because not applicable, not because it was skipped under time pressure.
- **Onboarding/first-use flow UX**: the Landing screen doubles as the
  onboarding surface (no separate first-run tour or modal). This was a
  deliberate simplicity choice carried from Phase 2/3 specs, not
  re-researched in this pass.
