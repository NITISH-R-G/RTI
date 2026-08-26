# Visual quality audit

**Date:** 2026-08-27 · Phase 4, run last on purpose. Verified in a real browser at desktop and 360 px.

## Does it look assembled from components?

**No — and that is a deliberate outcome.** No component library was imported. Every element comes from a small shared set (`Button`, `ButtonLink`, `Card`, `Notice`, `PageTitle`) built on one token layer, which is why the screens read as one product rather than a showcase.

React Bits and 21st.dev were considered and **not used**. Nothing in this journey needed a component those libraries provide that a plain labelled control does not, and each import would have been a dependency plus an accessibility surface to re-verify. `16-component-registry.md` stays empty, honestly.

## The three-second test, per screen

| Screen | Where am I? | What is wanted? | What happens next? |
|---|---|---|---|
| Landing | Yes — "What happened?" | Yes — one box | Yes — one button |
| Clarify | Yes | Yes — one question | Yes — options are the action |
| Draft | Yes | Yes — three labelled sections in order | Yes |
| Authority | Yes | Yes — one name, one primary action | Yes |
| Review | Yes | Yes — sections with edit links | Yes |
| Filed | Yes | Yes — copy the text | Yes |
| Not-RTI | Yes | Yes | Yes |

## What works

- **Restraint.** Warm off-white ground, deep-teal primary, one accent for warnings. No gradients, no glass, no decorative motion.
- **Hierarchy.** One `h1`, a lede, then cards. Reading order matches visual order matches DOM order.
- **The warning colour is reserved.** Amber appears only where money or an irreversible-looking boundary is at stake, so it still means something.
- **System font stack.** Nothing to download — a real performance choice on a slow connection, not an aesthetic one.
- **Focus states.** 3 px solid ring, always visible, verified by test.
- **Mobile.** Zero overflow at 360 px on every screen, verified; single column throughout.

## What is weaker, stated plainly

1. **No motion at all.** Screen changes are instant with no transition. Calm and fast, but it can read as flat. If anything is added later it should be a short crossfade honouring `prefers-reduced-motion` — nothing that delays a citizen.
2. **The authority screen is dense.** The most loaded screen in the product. Justified, but it is where a designer would start.
3. **The draft textarea is monospaced.** Correct — it signals "this is the exact text you will paste" — but it is the least warm element in the product.
4. **No illustration or identity beyond the wordmark.** The product looks trustworthy and slightly plain. For a public-service tool that is arguably right; a judge scanning quickly may read it as unfinished.
5. **Empty and error states are functional, not designed.** They are correct, labelled and announced, but they get no visual attention.

## Changes made in this audit

**One.** The evidence block on the landing page (fresh-reviewer FR-1) — an input/output pair in monospace with the portal's actual response in the warning colour. It is the only place the warning colour appears on the landing page, which is what makes it read as evidence rather than decoration.

**No other visual change was made.** Everything else on this list is recorded rather than acted on, because none of it improves understanding, confidence, correctness or safety — and Phase 4 is not the place to add decoration.
