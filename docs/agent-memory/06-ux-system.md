# 06 — UX System

**Status:** Principles and flow agreed (Session 1). Visual system not yet built — no tokens, no components, no code.

## The flow

```
Citizen describes the problem in their own words
        |
        v
Is this an RTI matter?  --- no ---> Tell them plainly, and where to go instead
        |  yes
        v
Draft the request  (shown in full, editable, each part explained)
        |
        v
Which office?  (one recommendation + reasoning + ranked alternatives)
        |
        v
Review  (exactly what will be filed, the fee, the date you may appeal)
        |
        v
File (simulated)  ->  Tracking + the exact text to file for real
```

Every transition must answer: *what does the citizen need to know to move forward?* If a screen cannot answer that in one sentence, it is the wrong screen.

## Principles

1. **One decision per screen.** The baseline portal asks a first-time user to choose among 2,900 authorities, judge RTI applicability, and compose legal prose on a single page. We never do that.
2. **Nothing is asked that can be inferred, and nothing inferred is hidden.** Every AI inference is displayed with its reasoning and is editable (PD-004).
3. **Plain language first, legal wording glossed.** Never "Enter particulars of information sought"; always "What do you want to know?" — with the formal phrasing visible in the generated request, explained.
4. **Progress is always visible, and going back never destroys work.**
5. **Errors say what to do next**, are tied to their field programmatically, and never require restarting.
6. **Motion communicates state or does not exist.** No decorative animation. Respect `prefers-reduced-motion`.
7. **Credible, calm, public-service.** Not a SaaS dashboard, not a landing page. Serious typography, high contrast, generous spacing, minimal ornament.

## Non-negotiable accessibility criteria (per route, checked in `18-verification-matrix.md`)

- Every input has a programmatically associated `<label>`; errors use `aria-describedby` and are announced.
- Landmarks (`header`/`nav`/`main`/`footer`) present; a working skip link; one `h1` and a correct heading order.
- `lang` set on `<html>` and switched with the language toggle.
- Contrast at least 4.5:1 for body text and 3:1 for UI boundaries.
- Focus visible on every interactive element; full keyboard operation; no keyboard traps.
- Touch targets at least 44x44 px.
- No horizontal overflow at 360, 390, 430, 768, 1024, 1440 px.
- Usable at 200% text zoom.
- Respects `prefers-reduced-motion`.

## Content rules

- Sentences short. Second person. Active voice.
- Any government term appears with its gloss the first time on the screen (source of glosses: `03-rti-site-inventory.md` §6).
- Never state a government fact the app cannot support. Where the model is uncertain, the UI says so in words, not in a percentage.
- Every mocked action is labelled as simulated at the point of action, not only in a footer.

## Visual system

**Not yet decided.** The next agent building UI must record tokens (colour, type scale, spacing, radii, focus ring) here before building components, and register any third-party component in `16-component-registry.md`.

Constraints already fixed: mobile-first; system font stack or one well-loaded webfont with a real fallback; a restrained palette in which the primary colour is not saturated blue-on-white government default; no gradients-as-decoration; no glassmorphism; no emblem or government mark of any kind (R14).
