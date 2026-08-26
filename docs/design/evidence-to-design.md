# Evidence → Design

Every major product decision traces to an observed finding. **A feature with no chain here does not belong in the build.**

Evidence tags: `[O]` observed directly · `[D]` official documentation · `[I]` inferred · `[U]` unknown · `[M]` mocked in our prototype.
Source of all `[O]` claims: the frozen audit in `docs/research/rti-online/`.

---

## ED-001 — Institutional vocabulary mismatch *(the founding decision)*

**Observed problem.** The citizen must name an institution before the system will engage with their problem.

**Evidence** `[O]` — route `request/request.php`, authenticated, synthetic input, control `Search Public Authority`:

| Input | Observed result |
|---|---|
| `my pension has not been paid` | **`No such Public Authority available in this portal !`** |
| `passport` | 1 relevant result + `Pasteur Institute of India`, `Punjab & Sind Bank`, `UPASI Tea Research Foundation` |
| `provident fund` | 2 relevant results |

**Counter-evidence** `[O]`: `Department of Pensions & Pensioners Welfare` exists in the `MinistryId` cascade **on the same screen**. The system contained the answer and refused the citizen anyway.

**Citizen impact.** A person with a valid, answerable request is told the system cannot help them. There is no error state on the government's side — the request simply never exists. The search works only for those who already know the formal name, which is precisely the knowledge the citizen lacks.

**Design response.** Invert the order. The journey opens with *"What happened?"* in the citizen's own words. The institution is **derived** from the problem via a curated taxonomy, then shown with reasoning and ranked alternatives. Problem-language is the *expected* input, not a failure mode.

**Expected measurable improvement.** In scenario evaluation, a participant reaches a relevant authority recommendation **without typing any authority's formal institutional name**. Target: all supported-domain scenarios in `citizen-scenarios.md` (S1–S4).

**Test.** `docs/evals/citizen-scenarios.md` S1 (pension), S2 (provident fund), S3 (passport), S4 (railways), plus S8 (typos) and S10 (long input). The literal string `my pension has not been paid` is a permanent regression case.

---

## ED-002 — Authority selection precedes intent

**Observed problem.** Two required dropdowns (`Select Ministry/Department/Apex body`, `Select Public Authority`) sit at the **top** of the form, above any question about what the citizen wants `[O]`.

**Evidence** `[O]`: form-structure §1 — fields 3 and 4 of 40, before the request text at field 36. Ministry select has **96** options with no description of what any covers; `Ministry of Railways` cascades to **184**. `All Ministries` is selectable and yields **zero** authorities.

**Citizen impact.** The citizen must model government structure before articulating a need. A wrong guess costs a s.6(3) transfer and a new registration number, or — for a state body — the application returned **without refund** `[D]`. The form never states either consequence.

**Design response.** Authority selection moves **after** the request is drafted, and is computed from the problem domain. The screen states the consequence of a wrong choice in plain language, and warns explicitly when the likely destination is a state/UT body.

**Expected measurable improvement.** Points in the journey requiring prior institutional knowledge: **2 mandatory → 0 required**.

**Test.** Route-order assertion in the e2e suite; S12 (user chooses a different authority); S7 (state-subject problem must produce the no-refund warning, not a central authority).

---

## ED-003 — Validation arrives after a network round trip

**Observed problem.** No client-side field validation exists at all.

**Evidence** `[O]`: no field carries an HTML `required` attribute (form-structure §1). Enumerating every page function containing `alert(` yields exactly two messages — `Only Indian citizens can file RTI Request application.` and `Your request will be filed with \n\n<authority>` (form-structure §7a). On the pre-auth page, errors returned as loose text after a full reload **with the CAPTCHA regenerated** (inventory §3).

**Citizen impact.** A blank mandatory field costs a page load; on the earlier screen it also costs solving a fresh CAPTCHA to fix a typo. On a slow connection this is the difference between filing and abandoning.

**Design response.** All validation is deterministic, pure and local. No network call is required to learn that something is wrong. Errors are tied to their field with `aria-describedby` and never discard work.

**Expected measurable improvement.** Validation before any network call: **No → Yes**. Work lost on a validation failure: **all fields re-rendered + new CAPTCHA → nothing**.

**Test.** Unit tests on the rules module; an e2e test asserting **zero network requests** occur when validation fails.

---

## ED-004 — Restricted characters are enforced only at submit

**Observed problem.** The rule `Only alphabets A-Z a-z number 0-9 and special characters , . - _ ( ) / @ : & ? \ %` is printed on screen, but the textarea has **no** `oninput`, `onkeyup`, `onkeypress`, `onchange` or `onblur` handler `[O]` (form-structure §5).

**Citizen impact.** The set excludes the apostrophe, `#`, `;`, `+`, `=`, `"`, the rupee sign and **all Devanagari**. So "my father's pension" fails, and a request written in Hindi fails wholesale — discovered after composing up to 3,000 characters.

**Design response.** Validate as the citizen types. Name the specific offending characters. Offer a one-tap fix that maps common offenders (curly quotes, en dashes, the rupee sign) to allowed equivalents. This is pure, unit-tested code — never model behaviour.

**Expected measurable improvement.** Characters typed before the citizen learns of a violation: **up to 3,000 → 0**.

**Test.** Unit tests on `validateRequestText` and `sanitiseRequestText`; scenario S13 (restricted characters).

---

## ED-005 — No remaining-character feedback

**Observed problem.** `maxlength="3000"` truncates silently; no counter exists anywhere `[O]` (form-structure §5).

**Citizen impact.** Someone pasting a longer request loses the tail without being told.

**Design response.** Live remaining-character count adjacent to the field, announced politely to assistive technology at thresholds rather than on every keystroke.

**Expected measurable improvement.** Silent truncation events: **possible → impossible**.

**Test.** Component test at 2,900 / 3,000 / 3,100 characters; S10 (long input).

---

## ED-006 — The form does not reflow

**Observed problem.** Constrained to 360 px the form requires **985 px** — 625 px of horizontal overflow, 32 controls past the right edge, and **30** controls under the 44 px touch target `[O]` (form-structure §7b).

*Method limitation, stated plainly:* device emulation was unavailable for the authenticated tab, so reflow was measured directly rather than on a phone. No real device was used.

**Citizen impact.** The page has a viewport meta, so it does not zoom out — instead the citizen scrolls sideways on every row of a 40-field form with ~26 px targets, and a label can be off-screen from its own field. India files RTIs on phones.

**Design response.** Mobile-first, single-column, no layout tables. Minimum 44 px targets. Acceptance criterion per route (PD-008), not a review step.

**Expected measurable improvement.** Horizontal overflow at 360 px: **625 px → 0**. Controls under 44 px: **30 → 0**.

**Test.** Playwright viewport matrix at 360/390/430/768/1024/1440; automated target-size measurement; S14 (mobile viewport).

---

## ED-007 — Nothing is programmatically labelled

**Observed problem.** **0 `<label>` elements for 40 visible inputs**; 0 `aria-required`; 0 `aria-describedby`; 6 layout tables; 0 landmarks; 1 `h1` and no `h2`/`h3` `[O]` (form-structure §6).

**Citizen impact.** A screen-reader user is read forty unnamed controls inside a table layout, and validation arrives as a modal dialog with no field association.

**Design response.** Every input has an associated `<label>`. Errors use `aria-describedby`. Landmarks and a skip link present. Correct heading order. Contrast at least 4.5:1. Full keyboard operation.

**Expected measurable improvement.** Inputs with a programmatic name: **0 of 40 → 100%**. axe serious/critical violations: **→ 0**.

**Test.** axe-core per route as a CI gate; S15 (keyboard-only navigation).

---

## ED-008 — Back navigation destroys the journey

**Observed problem.** Navigating back to the OTP screen produces a **browser error page**; the token is single-use `[O]` (flow-map STEP 3). The form has no draft, no save and no progress indicator.

**Citizen impact.** The most-used control on the web breaks the session. On a phone, a back gesture is easy to trigger by accident. Recovery means a fresh OTP and re-entering a 40-field form.

**Design response.** Every step is reversible. State persists locally across steps and reloads within the session. Going back never destroys work; returning to a later step preserves everything already entered.

**Expected measurable improvement.** Recoverable errors: **journey destroyed → all steps recoverable**.

**Test.** E2E: complete to `/review`, navigate back to `/`, forward again, assert all state intact. S11 (user changes their mind).

---

## ED-009 — The fee is hidden until a specific question is answered

**Observed problem.** No fee is shown on load. Choosing `BPL = No` reveals `You are required to pay the RTI fee of ₹ 10` and relabels the button to **Make Payment** `[O]` (form-structure §4).

**Citizen impact.** The button changing label is the only structural signal that money is involved. A citizen who never answers the BPL question never learns there is a fee.

**Design response.** State the fee and the BPL exemption **before** effort is invested, in plain language, sourced from the deterministic rules module with its citation — never from generated prose.

**Expected measurable improvement.** Effort invested before the fee is disclosed: **entire form → none**.

**Test.** Unit test on `feeFor({bpl})`; e2e assertion that the fee appears before the request-composition step.

---

## ED-010 — Demographic disclosure to exercise a right

**Observed problem.** The form collects Gender (**defaulting to Male**), Rural/Urban, and Literate/Illiterate — the last revealing four further education-level radios `[O]` (form-structure §4, friction F-A5).

**Citizen impact.** The citizen declares gender, rural/urban status and education level in order to ask a question. A silent default records an answer nobody gave.

**Design response.** **Do not ask.** None of it changes the request, the authority or the fee. The review screen instead lists what the real portal will ask for, so the citizen is forewarned without us collecting it.

**Expected measurable improvement.** Demographic fields required: **3 (+4 conditional) → 0**.

**Test.** Field-count assertion in the e2e suite.

---

## ED-011 — Inapplicable branches are always visible

**Observed problem.** `bplCardNo`, `YearOfUssue` and `IssuAuthority` remain visible and enabled in **every** BPL state `[O]` (F-A6). `Country = Other` leaves the India State dropdown and a free-text country box enabled side by side `[O]` (F-A13).

**Citizen impact.** Irrelevant fields add length and doubt about what is required.

**Design response.** Show only the branch that applies. Progressive disclosure is a rule, not a preference.

**Expected measurable improvement.** Inapplicable fields shown on the default path: **3 → 0**.

**Test.** Component tests on each branch; field-count assertion.

---

## ED-012 — The authority "confirmation" cannot be declined

**Observed problem.** The public-authority step fires `alert("Your request will be filed with \n\n" + name)` — an `alert()`, not a `confirm()`. There is no Cancel `[O]` (form-structure §7a).

**Citizen impact.** The one moment the portal could warn about a wrong destination is a dead acknowledgement. The consequence — s.6(3) transfer, or return without refund for a state body `[D]` — is never stated.

**Design response.** The authority step is a genuine, reversible decision on its own screen: recommendation, reasoning, ranked alternatives, full search, and an explicit statement of consequence including the state/UT no-refund warning.

**Expected measurable improvement.** Consequence of a wrong authority disclosed: **never → on the screen where the choice is made**.

**Test.** S7 (state-subject problem) must surface the no-refund warning; S12 (override the recommendation) must succeed without losing work.

---

## ED-013 — Honest failure instead of a confident wrong answer

**Observed problem.** The portal's failure mode for unrecognised input is a flat refusal — *"No such Public Authority available in this portal !"* — with no suggestion and no route onward `[O]` (F-A1).

**Risk this creates for us** (R-17): a taxonomy-driven product can fail the same way, or worse, by silently mapping an unsupported problem to an arbitrary authority.

**Design response.** Out-of-coverage input produces: an explicit statement that we have no template for this, an explanation of what makes a good RTI request, the full authority search, and the option to proceed with the citizen's own wording. **Never a flat refusal, never a fabricated match.** Uncertainty is expressed in words at the point of the claim — *"Based on what you described, this may be the right office"* — never as a percentage.

**Expected measurable improvement.** Dead ends: **1 observed → 0**. Taxonomy coverage across the evaluation set is measured and **reported**, not hidden.

**Test.** S5 (non-RTI complaint), S6 (insufficient information), S7 (unsupported/state domain), S9 (very short input). Each must reach a useful onward route. Coverage percentage recorded in `docs/agent-memory/11-evaluation-log.md`.

---

## ED-014 — Do not collect identity

**Observed problem.** The real form collects name, address (3 lines), pincode, phone, email and confirm-email `[O]` (form-structure §1).

**Reasoning.** We do not file anything, so we do not need identity. Collecting it would create a privacy surface for zero product benefit and would conflict with PD-009's genuine property that nothing the citizen types leaves their browser.

**Design response.** Collect **no** personal identity. The review screen lists what the real portal will ask for, as a preparation checklist.

**Expected measurable improvement.** Personal data fields collected: **8 → 0**. Personal data transmitted: **→ none, by construction**.

**Test.** Assertion that no identity field exists in any route; a repository-wide check that no real personal data appears in fixtures.

---

## Traceability

| Chain | Friction source | Screen(s) affected | Scenario tests |
|---|---|---|---|
| ED-001 | F-A1 | `/`, `/clarify`, `/authority` | S1–S4, S8, S10 |
| ED-002 | F-A2 | `/authority` (ordering) | S7, S12 |
| ED-003 | F-A11 | all form screens | unit + e2e |
| ED-004 | F-A3 | `/request` | S13 |
| ED-005 | F-A4 | `/request` | S10 |
| ED-006 | F-A12 | all | S14 |
| ED-007 | F-A10 | all | S15 |
| ED-008 | F-A9 | all | S11 |
| ED-009 | F-A7 | `/review`, early disclosure | unit + e2e |
| ED-010 | F-A5 | (removal) | field count |
| ED-011 | F-A6, F-A13 | `/review` | component |
| ED-012 | F-A11 | `/authority` | S7, S12 |
| ED-013 | F-A1 + R-17 | `/clarify`, `/authority`, `/not-rti` | S5, S6, S7, S9 |
| ED-014 | — (privacy, PD-009) | `/review` | assertion |

**Unchained features are forbidden.** If a later agent wants to add something, it needs a chain here first, or it does not ship.
