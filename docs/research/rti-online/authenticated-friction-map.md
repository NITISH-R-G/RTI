# Authenticated friction map — RTI Online

**Audit date:** 2026-08-26 · **Authenticated:** Yes · **Route unless stated:** `request/request.php`
**Synthetic data:** all values typed by the agent were synthetic. The owner's real email/mobile, pre-filled by the OTP step, were replaced with synthetic values in the DOM before any capture.
Every entry carries reproduction steps and an evidence tag. "The search was bad" is not a finding; the entries below are reproducible.

---

## F-A1 — The public-authority search matches names, not needs `[O]` — **SEVERITY: CRITICAL**

**Route:** `request/request.php` · **Authenticated:** Yes · **Control:** `Search Public Authority` (`input#inputString`, placeholder `Type name or part of name of public authority`)

**Reproduction:** click the search box, type the input, wait ~2s for the suggestion panel.

| Input typed | Observed result |
|---|---|
| `provident fund` | `Employees Provident Fund Organisation`, `Seamen Provident Fund Organisation, Mumbai` — both relevant |
| `passport` | `MEA - Consular, Passport & Visa Division (CPV)` (relevant), plus `Pasteur Institute of India`, `Punjab & Sind Bank`, `UPASI Tea Research Foundation` — **3 of 4 results irrelevant** |
| `my pension has not been paid` | **`No such Public Authority available in this portal !`** |

**Counter-evidence:** `Department of Pensions & Pensioners Welfare` **exists** in the `MinistryId` cascade on the very same screen. The portal told the citizen no authority exists while the correct one sat in the dropdown below.

**What the citizen sees:** a flat refusal, with no suggestion, no "did you mean", no route onward.

**What the citizen is expected to understand:** that the search indexes *institutional names*, that they must already know the formal name of a body they have never heard of, and that describing their problem is the wrong way to use the box — none of which is stated anywhere.

**Why this is difficult:** it inverts the citizen's knowledge. They know their problem; they do not know the institution. The one control that looks like it accepts a problem description rejects it.

**Citizen impact:** a person with a valid, answerable pension RTI is told the system cannot help them, and reasonably concludes RTI is not available for their issue. This is a silent abandonment point — no error is logged, no official ever learns the request existed.

**Can our prototype reduce it:** **Yes — this is the core of the product.** Accept problem-language; bridge to institutional categories via a curated taxonomy and a guided interview; never dead-end. See `docs/design/before-after-journey.md`.

---

## F-A2 — The citizen must model government structure before they can ask a question `[O]` — **SEVERITY: HIGH**

**Reproduction:** load the form. Two required dropdowns appear before any question about what the citizen wants.

- `* Select Ministry/Department/Apex body` — **96 options**, no description of what any covers.
- `* Select Public Authority` — cascaded; `Ministry of Railways` alone produces **183** options such as `Ajmer Work shop- NWR`, `CENTRAL RAILWAY`, `Centre for Railway Information System (CRIS)`.
- Selecting `All Ministries` produces **zero** selectable public authorities — a visible option that leads nowhere. `[O]`

**Expected prior knowledge:** which ministry owns a subject; the difference between a ministry, a department, an apex body and a public authority; which of 183 railway bodies holds a particular record.

**Citizen impact:** a guess. The form states `(Your Request will be filed with this selected Public Authority)` but never says what happens if the guess is wrong — that it is transferred under s.6(3) with a new registration number, or, for a state body, **returned without refund of the fee** `[D]`.

**Can our prototype reduce it:** Yes — the citizen never selects a ministry. The system proposes an authority with reasoning and ranked alternatives, and warns about state/UT bodies.

---

## F-A3 — Restricted characters are enforced only at submit `[O]` — **SEVERITY: HIGH**

**Reproduction:** inspect `textarea[name=Description]`. Attributes are `name,id,maxlength,class,rows,cols` — there is **no** `oninput`, `onkeyup`, `onkeypress`, `onchange` or `onblur` handler.

**On-screen rule:** `Note:- Only alphabets A-Z a-z number 0-9 and special characters , . - _ ( ) / @ : & ? \ % are allowed in Text for RTI Request application.`

**What this excludes:** the apostrophe, `#`, `;`, `+`, `=`, `"`, the rupee sign, and **all Devanagari** — so ordinary English punctuation ("don't", "father's pension") and any Hindi text fail.

**Citizen impact:** the rule is discovered after composing up to 3,000 characters, not while typing. A citizen writing in Hindi is rejected wholesale at the end.

**Can our prototype reduce it:** Yes — validate as they type, name the offending characters, offer a one-tap fix. Deterministic, unit-tested.

---

## F-A4 — No remaining-character feedback `[O]` — **SEVERITY: MEDIUM**

**Reproduction:** `textarea[name=Description]` has `maxlength="3000"`; the page says `(Enter Text for RTI Request application upto 3000 characters)`. There is no counter anywhere on the page.

**Citizen impact:** the browser silently stops accepting input at 3,000. Someone pasting a longer request loses the tail without being told.

**Can our prototype reduce it:** Yes — live count with a remaining figure.

---

## F-A5 — Demographic disclosure required to exercise a right `[O]` — **SEVERITY: MEDIUM**

**Reproduction:** the form requires/collects `*Gender` (Male / Female / Third Gender, **defaulting to Male**), `Status` (Rural / Urban), `Educational Status` (Literate / Illiterate). Clicking `Literate` reveals four further radios — Below 12th Standard, 12th Standard Pass, Graduate, Above Graduate — on rows that were `display:none`.

**Citizen impact:** the form grows as you answer it; the citizen must declare gender, rural/urban status and education level to ask a question. The Male default silently records an answer nobody gave.

**Can our prototype reduce it:** Yes — do not ask. None of it changes the request, the authority or the fee. If a field must exist for parity with the real form, it is optional, unprefilled and explained.

---

## F-A6 — BPL fields are always visible, even when inapplicable `[O]` — **SEVERITY: LOW-MEDIUM**

**Reproduction:** set `BPL` to `Yes`, `No`, and unset; inspect `bplCardNo`, `YearOfUssue`, `IssuAuthority`. In every state: `display: inline-block`, enabled, editable.

**Citizen impact:** three irrelevant fields (BPL card number, year of issue, issuing authority) sit in the form for the ~majority of applicants who are not BPL, adding length and doubt about whether they are required.

**Can our prototype reduce it:** Yes — show them only on the branch that needs them.

---

## F-A7 — The fee is invisible until the BPL question is answered `[O]` — **SEVERITY: MEDIUM**

**Reproduction:** on load, no fee is shown and the button reads `Submit`. Set `BPL = No` → red text appears: `You are required to pay the RTI fee of ₹ 10`, and the button **relabels to `Make Payment`**. Set `BPL = Yes` → button returns to `Submit`, no fee text.

**Note — corrects an earlier assumption:** the fee *is* disclosed on the form, contrary to an intermediate hypothesis during this audit. It is conditional, not absent.

**Citizen impact:** the button changing label is the only structural signal that money is about to be involved. A citizen who never answers BPL never learns there is a fee.

**Can our prototype reduce it:** Yes — state the fee and who is exempt up front, before any effort is invested.

---

## F-A8 — Three authentication challenges in one journey `[O]` — **SEVERITY: MEDIUM**

**Reproduction:** CAPTCHA on `request_email_check.php` → OTP on `Request_Check_Otp.php` → **a second CAPTCHA** (`6_letters_code`, max 6) on the application form itself.

**Citizen impact:** having proved control of an email and phone via OTP, the citizen solves another image CAPTCHA before filing. Compounds with the accessibility problem — image CAPTCHAs gate every action, with only a bare speaker icon as an alternative.

**Can our prototype reduce it:** Partly — our prototype has no login, no OTP and no CAPTCHA, but it also cannot file for real. The honest claim is about *our* journey, not about removing a control the real portal needs. Must not be overstated.

---

## F-A9 — Back navigation destroys the journey `[O]` — **SEVERITY: HIGH**

**Reproduction:** from the authenticated form, navigate back to `request/Request_Check_Otp.php`. Result: **a browser error page**. The OTP token is single-use and the flow cannot be resumed backwards.

**Citizen impact:** the ordinary browser Back button — the most-used control on the web — breaks the session. Anyone who goes back to check something they entered must restart, including a fresh OTP. On a phone, the hardware/gesture back is even easier to hit by accident. There is no draft, no save and no progress indicator, so work in the 40-field form is at risk throughout.

**Can our prototype reduce it:** Yes — every step is reversible, work is preserved, and going back never destroys anything.

---

## F-A10 — Accessibility failures on the authenticated form `[O]` — **SEVERITY: CRITICAL**

**Reproduction:** measured in-page on `request/request.php`.

| Measure | Value | WCAG 2.2 |
|---|---|---|
| `<label>` elements | **0** for **40** visible inputs | 1.3.1, 3.3.2, 4.1.2 |
| Inputs with any programmatic name | **0 of 40** | 4.1.2 |
| `aria-required` / `aria-describedby` | 0 / 0 | 3.3.2 |
| Layout `<table>` elements | 6 | 1.3.1 |
| Landmarks | 0 | 1.3.1, 2.4.1 |
| Headings | 1 × h1, 0 × h2, 0 × h3 | 2.4.6 |
| Validation feedback | native `alert()` dialog | 3.3.1 |

**Correcting Session 1:** `lang="en"` and `meta[name=viewport]` **are present on this page**, though absent on `/index.php`. The portal is inconsistent between pages; A1 and A2 must be scoped per page, not asserted portal-wide.

**Citizen impact:** a screen-reader user is read 40 unlabelled controls in a table layout. Validation arrives as a modal dialog with no field association.

**Can our prototype reduce it:** Yes, and it is an acceptance criterion per route, not a review step (PD-008).

---

## F-A11 — No client-side validation; the only "confirmation" cannot be cancelled `[O]` — **SEVERITY: HIGH**

**Route:** `request/request.php` · **Authenticated:** Yes
**Reproduction:** enumerate every global function containing `alert(` and extract its dialog literals via `Function.prototype.toString` (no submission needed). Complete results in `authenticated-form-structure.md` §7a.

**Observed:** exactly two dialog messages exist in the entire page:
- `Only Indian citizens can file RTI Request application.`
- `Your request will be filed with 

` + the selected public authority

**What this means:**
- **No field-level client-side validation exists.** No HTML `required` attributes either (§1). A citizen who leaves a mandatory field blank learns about it only after a server round trip.
- The public-authority step uses **`alert()`, not `confirm()`** — the citizen acknowledges, they do not confirm. There is no Cancel and no statement of consequence.

**Citizen impact:** on a slow connection, discovering a missed field costs a full page load — and the observed portal pattern is to re-render with loose error text and a regenerated CAPTCHA, so the citizen re-solves the CAPTCHA to fix a typo. Meanwhile the one moment the portal *could* warn about a wrong authority — the "will be filed with" dialog — is a dead acknowledgement.

**Can our prototype reduce it:** Yes. Validate inline as the citizen types, tie every error to its field programmatically, and make the authority step a genuine, reversible decision that states the consequence (transfer under s.6(3), or return without refund for a state body) rather than an unskippable notice.

---

## F-A12 — The authenticated form does not reflow; it is ~2.7x too wide for a phone `[O]` — **SEVERITY: CRITICAL**

**Route:** `request/request.php` · **Authenticated:** Yes
**Method + limitation:** device emulation was unavailable for the authenticated tab (`resize_window` left `innerWidth` at 1536). Reflow was measured directly: `body` was constrained to 360 px and the resulting minimum content width read back. A real phone was not used.

**Observed at a 360 px constraint:** `body.scrollWidth` = **985 px** (overflow **625 px**); widest layout table **888 px**; **32** form controls extend past the right edge; **30** controls are under the 44 px touch-target minimum (mostly 24-28 px).

**Citizen impact:** India files RTIs on phones. The form has a viewport meta, so it will not zoom out — instead the citizen scrolls horizontally on every one of ~40 rows, with ~26 px tap targets. Labels sit in a left table cell and inputs in a right one, so at 360 px the label and its field can be off-screen from each other.

**Can our prototype reduce it:** Yes, and it is an acceptance criterion (PD-008): no horizontal overflow at 360/390/430/768/1024/1440, all targets at least 44 px.

---

## F-A13 — `Country = Other` produces no branching `[O]` — **SEVERITY: LOW**

**Reproduction:** click the `Other` radio for `Country` (`chkCountry` value `999`).
**Observed:** `chkCountry` becomes `999`, and the India `State` dropdown and the free-text `txtCountry` box **both stay visible and enabled**. Nothing is hidden, disabled, relabelled or explained.
**Citizen impact:** a non-resident sees an Indian-state selector and a country text box simultaneously with no guidance. Minor, but it is the same pattern as the BPL fields (F-A6): the form shows every branch at once rather than the one that applies.
**Can our prototype reduce it:** Yes — show only the branch that applies.

---

## Severity summary

| ID | Friction | Severity | Prototype can reduce |
|---|---|---|---|
| F-A1 | Search matches names, not needs; dead-ends valid requests | **Critical** | Yes — core of the product |
| F-A10 | 40 unlabelled inputs, no landmarks, alert()-based errors | **Critical** | Yes |
| F-A2 | Citizen must model ministry/department structure | High | Yes |
| F-A3 | Character restriction enforced only at submit | High | Yes |
| F-A9 | Back navigation destroys the journey | High | Yes |
| F-A4 | No remaining-character feedback | Medium | Yes |
| F-A5 | Demographic disclosure to exercise a right | Medium | Yes |
| F-A7 | Fee hidden until BPL answered | Medium | Yes |
| F-A8 | Three authentication challenges | Medium | Partly — must not overstate |
| F-A12 | Form does not reflow — ~2.7x too wide at 360 px; 30 sub-44 px targets | **Critical** | Yes |
| F-A11 | No client-side validation; "confirmation" cannot be cancelled | High | Yes |
| F-A6 | BPL fields always visible | Low-Medium | Yes |
| F-A13 | `Country = Other` produces no branching | Low | Yes |

## Pending / unverified

- ~~Exact client-side validation dialog text~~ — **RESOLVED** by source inspection, see F-A11. No dialog text remains unknown.
- ~~`Country = Other` branch~~ — **RESOLVED**, see F-A13.
- ~~360 px mobile behaviour~~ — **RESOLVED by direct reflow measurement**, see F-A12. Note the limitation: no real device or emulated viewport was used.
- Colour contrast — still `[U]`, never measured.
- Everything past `Make Payment` — intentionally not observed.
