# Adversarial testing

**Date:** 2026-08-27 · **Suite:** `e2e/adversarial.spec.ts`, 21 tests × 2 viewports · **Result: all passing**

The bar was not "does it crash". It was: **can stale or inconsistent state quietly produce a misleading citizen outcome** — a request about one thing addressed to the office for another.

## Inputs

13 hostile inputs, each asserted to reach a screen with a heading and a way forward, and never to render `undefined`, `NaN`, or the portal's refusal string.

whitespace only · one character · punctuation only · emoji only · repeated word · mixed case · multiple problems at once · supported + unsupported combined · vague · action-seeking · domain keyword with no problem · 9,000 characters · injection-shaped.

**All handled.** Whitespace-only is rejected in place with the error tied to the field; everything else moves forward to something useful.

## Navigation

| Attack | Result |
|---|---|
| Deep-link into `/clarify`, `/request`, `/authority`, `/review`, `/not-rti`, `/filed/whatever` without state | Redirects to the start. No broken screen, no crash |
| Refresh at each of the four main steps | Stays put with work intact |
| Browser back then forward | Journey intact, draft preserved |
| Abandon and start again | Confirms, then clears |

## Stale state — the part that actually matters

| Attack | Result |
|---|---|
| Change the problem after a draft exists | Draft is rebuilt; **no trace of the old subject** |
| Change the problem after an authority was chosen | Old authority is gone; the new domain's authority is proposed |
| Reach `/filed/...` without completing the journey | Redirected to the start |
| Toggle information selection | Draft updates |

The strongest of these: starting a pension journey, reaching *Department of Pensions & Pensioners Welfare*, then going back and changing the problem to an income-tax one. The body is asserted to contain **no** reference to the pension department afterwards. A request addressed to the wrong office because of stale state is the worst thing this product could do, and it is now a standing test.

## A test that had to be sharpened rather than weakened

Adding the evidence block to the landing page broke the assertion *"the body must never contain `No such Public Authority`"* — because the landing page now deliberately quotes that refusal as evidence.

The wrong fix would have been to delete or loosen the assertion. Instead the evidence block is marked `data-evidence-quote`, and the check now excludes that block. The assertion still catches exactly what it was written to catch: **our product producing that refusal as an outcome**, as opposed to quoting it as evidence.

## Not covered

- Concurrent tabs sharing `localStorage`.
- Storage quota exhaustion (the read/write path is try/caught, but the failure is not simulated).
- Network conditions — there are no runtime network calls to degrade.
