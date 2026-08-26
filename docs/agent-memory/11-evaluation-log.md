# 11 — Evaluation Log

Every entry: date · version · scenario · input · expected · actual · pass/fail · failure reason · fix · re-test result.
"It looked good" is not an evaluation. Product evaluations (steps, confusion, clarity) belong here alongside assistant evaluations.

---

## 2026-08-26 — Session 1 — Baseline measurement of the existing portal

Not an evaluation of our product (none exists). This is the **benchmark** every later claim of improvement is measured against. Method and evidence: `03-rti-site-inventory.md`.

| Metric | RTI Online (measured / documented) | Evidence |
|---|---|---|
| Steps from home to first typing your actual question | 4 (home, guidelines wall, email+mobile+CAPTCHA, OTP) | [O] |
| Unaided decisions before submitting | Authority (1 of ~2,900), RTI applicability, wording, BPL, payment mode | [O]/[D] |
| Public authorities listed on the **catalogue page** `allpa.php` (NOT the form — see the Session 2 baseline below) | 2,904 unique (3,114 rows) | [O] |
| Official guidance on how to word a request | None beyond a 3,000-character limit | [O] FAQ |
| Form inputs with a programmatic label (request step 1) | 0 of 6 | [O] |
| `<meta name="viewport">` present | No — 980 px lock on a 375 px device | [O] |
| Landmarks / skip link | None / none | [O] |
| Moving content with no pause control | 1 `<marquee>` on the home page | [O] |
| OTP required to read your own status | Every time | [O] |
| Cost of choosing a state authority by mistake | Application returned, **no refund of fee** | [D] FAQ + manual p.22 |

**Pass/fail:** n/a (baseline).
**Next:** re-measure the same rows against our build and record the delta here, per `01-product-context.md`.

---

## 2026-08-26 — Session 2 — Baseline re-measured against the authenticated form

Supersedes the Session 1 baseline row where they differ. Method: `docs/research/rti-online/`.

| Metric | RTI Online (observed, authenticated) | Evidence |
|---|---|---|
| Input fields on the application form | **40** visible | form-structure §1 |
| Inputs with a programmatic label | **0 of 40** | form-structure §6 |
| `aria-required` / `aria-describedby` | 0 / 0 | form-structure §6 |
| Mandatory points requiring institutional knowledge | **2** (ministry, public authority) | form-structure §3 |
| Ministry options / cascaded authorities | 96 / 184 for Railways | form-structure §3 |
| Client-side field validation | **None exists** | form-structure §7a |
| Dialogs in the entire form | **2** (citizenship guard; authority notice, `alert` not `confirm`) | form-structure §7a |
| Content width at a 360 px constraint | **985 px** (625 px overflow, 32 controls off-screen) | form-structure §7b |
| Touch targets under 44 px | **30** | form-structure §7b |
| Demographic fields | 3 (+4 conditional) | form-structure §4 |
| Personal identity fields | 8 | form-structure §1 |
| Authentication challenges in the journey | 3 | flow-map |
| Problem-language search (`my pension has not been paid`) | **"No such Public Authority available in this portal !"** while the relevant department exists in the same screen | friction F-A1 |

**Pass/fail:** n/a (baseline). **Next:** re-measure each row against our build and record the delta. No row in `docs/design/before-after-journey.md` §1 may be reported as achieved before its verification has run.

## 2026-08-26 — Phase 3 Work Unit 1 — Application shell, design system, routing

**Verified in a real browser** (Chrome, `http://localhost:5173`), not by inspection alone.

| Check | Expected | Actual | Pass |
|---|---|---|---|
| Build | passes | `vite build` OK — 235 kB JS / 75 kB gzip, 16.6 kB CSS / 4.3 kB gzip | Pass |
| Typecheck | 0 errors | 0 | Pass |
| Reasoning regression suite | 62 passing | 62 passing | Pass |
| `<html lang>` | present | `en` | Pass |
| Landmarks | header/nav/main/footer | all present | Pass |
| Skip link | first tab stop, usable | first Tab focuses it; 51 px tall when focused; 3 px solid focus ring | Pass |
| Horizontal overflow @ 375 px | 0 | 0 | Pass |
| **Horizontal overflow @ 360 px** | 0 | **0** (scrollWidth 360 = innerWidth 360) | Pass |
| Elements past the right edge @ 360 px | 0 | 0 | Pass |
| Persistent prototype disclosure | visible on every screen | visible, non-dismissible, links to /about | Pass |
| Touch targets under 44 px | 0, excluding inline text links | 2 — the skip link before focus (51 px when focused, so compliant in use) and the inline disclosure link inside a sentence (39 px, WCAG 2.5.8 inline exception) | Pass, with the exception noted |

**Baseline for contrast:** the real RTI form needs 985 px at a 360 px constraint, with 32 controls off-screen and 30 under 44 px.

**Fixed during verification:** the progress label rendered as "Step 1 of 6 What happened" with no visual separator — a screen-reader-only colon is invisible to sighted users. Added a visual `·` plus an `aria-hidden`/`sr-only` pair so both audiences get a separator.

**Not yet verified:** axe-core (Playwright not installed yet), screen-reader behaviour, colour contrast measurement.

## 2026-08-27 — Phase 3 Work Unit 2 — Landing screen

**Automated:** 24 unit/component tests passing (16 rules + 8 Landing), plus the 62 reasoning tests. Build and typecheck clean.

**Citizen scenarios exercised at this screen:**

| Scenario | Expected | Actual | Pass |
|---|---|---|---|
| S1 pension (founding case) | routes onward, no dead end | `my pension has not been paid` → `/clarify` | Pass |
| S5 grievance | routes to the not-RTI path | `I want to complain about my neighbour` → `/not-rti` | Pass |
| S9 very short input | advisory, not a hard block | `pension` → advice shown; pressing Continue again proceeds | Pass |
| S10 very long input | told it is long, nothing silently deleted | warning shown above 5,000 chars, text retained | Pass |
| Empty input | error tied to the field | `aria-invalid="true"`, error joined into `aria-describedby` | Pass |
| Example buttons | fill the field, do not submit | fills and moves focus to end of text | Pass |
| Fee disclosed before effort | ₹10 + BPL exemption visible on screen 1 | both present | Pass |
| Return to screen | work restored | text restored from journey state | Pass |

**Browser verification (real Chrome + 360 px viewport):**

| Check | Result |
|---|---|
| Horizontal overflow @ 360 px | **0** (scrollWidth 360 = innerWidth 360) |
| Controls past the right edge | **0 of 9** |
| Controls under 44 px | 2 — skip link before focus (51 px focused) and the inline disclosure link in a sentence (38 px, WCAG 2.5.8 inline exception) |
| Visual check, desktop + mobile | Calm, single-column, one primary action; examples read as options rather than decoration |

**Still not verified:** axe-core (Playwright not yet installed), screen reader, colour contrast.

## Pending evaluations (to run once the product exists)

- The assistant evaluation case set in `09-ai-behavior.md`, plus the taxonomy-coverage figure.
- Task completion and step count for the primary journey, against the baseline above.
- Mobile usability at 360 px.
- Recovery from a wrong interpretation by the app.
- The out-of-coverage journey: does the product decline honestly and still get the citizen somewhere useful?
