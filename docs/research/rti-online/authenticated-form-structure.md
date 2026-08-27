# Authenticated RTI Request Form: complete observed structure

**Route:** `https://rtionline.gov.in/request/request.php?emailchk=…&cellchk=…&urletoken=…&time=1`
**Page title:** `RTI Online :: Submit Request Form`
**Audit date:** 2026-08-26 · **Authenticated:** Yes: the project owner completed email + mobile + CAPTCHA + OTP manually. No credential was entered by the agent.
**Evidence level:** `[O]` throughout unless stated.
**Synthetic data:** the form arrived pre-filled with the owner's real email and mobile from the OTP step. Both were **replaced with synthetic values in the DOM** (`demo.citizen@example.com`, `9000000000`, `Demo Citizen`, `1 Example Road`, `110001`) before any capture or further interaction, so no personal data entered this record.
**Boundary:** nothing was submitted. No payment was initiated. A `submit` guard (`preventDefault` + `stopImmediatePropagation`, capture phase) was installed before any validation test so a submission was impossible even if validation had passed.

---

## 1. Field inventory (40 visible inputs, DOM order)

`max` = HTML `maxlength`. No field carries the HTML `required` attribute; the `*` marker is presentational only. **Zero `<label>` elements exist on this page**: the "label" column below is the adjacent table cell text, which is what a sighted user sees and what a screen-reader user does not get.

| # | Name | Type | Visible label (table cell) | max | Notes |
|---|---|---|---|---|---|
| 1 | `lan` | select (2) | - | - | English / Hindi. Unlabelled |
| 2 | `SerchMinistry` (id `inputString`) | text | "Search Public Authority" | - | placeholder `Type name or part of name of public authority`. Positioned top-right, visually detached from the two dropdowns it feeds |
| 3 | `MinistryId` | select (**96**) | `* Select Ministry/Department/Apex body` | - | 94 real entries + `--Select--` + `All Ministries` |
| 4 | `DepartmentId` | select (1 initially) | `* Select Public Authority` / `(Your Request will be filed with this selected Public Authority)` | - | Populated by cascade from `MinistryId` |
| 5 | `Email` | text | `* Email-ID` | 70 | Pre-filled from the OTP step |
| 6 | `MobileStdCode` | text | `Mobile Number(For receiving SMS alerts)` | 5 | Shows `+91` |
| 7 | `cell` | text | (same row) | 19 | Pre-filled from the OTP step. **Note:** on the *pre-auth* page this field was `type="password"`; here it is plain `text` |
| 8 | `ConfirmEmail` | text | `* Confirm Email-ID` | 70 | Re-type; no paste-blocking observed |
| 9 | `Name` | text | `*Name` | 50 | |
| 10–12 | `gender` | radio ×3 | `*Gender` | - | `M` **checked by default** / `F` / `T` → Male / Female / Third Gender |
| 13 | `address1` | text | `* Address` | 50 | |
| 14 | `address2` | text | *(empty cell)* | 50 | No label at all |
| 15 | `address3` | text | *(empty cell)* | 50 | No label at all |
| 16 | `pincode` | text | `Pin code` | 6 | |
| 17–18 | `chkCountry` | radio ×2 | `Country` | - | `001` India (**checked**) / `999` Other |
| 19 | `stateId` | select (36) | `State` | - | 35 entries incl. `No State` and `Union Territory` |
| 20 | `txtCountry` | text | (same `State` row) | 30 | Free-text country, shown alongside the State select |
| 21–22 | `status` | radio ×2 | `Status` | - | `R` Rural / `U` Urban. Neither checked |
| 23–24 | `educational_Status` | radio ×2 | `Educational Status` | - | `L` Literate / `I` Illiterate |
| 25–28 | `graduate_degree` | radio ×4 | `Below 12th Standard`, `12th Standard Pass`, `Graduate`, `Above Graduate` | - | **Conditional**: row is `display:none` until `Literate` is chosen |
| 29 | `PhoneStdCode` | text | `Phone Number` | 5 | |
| 30 | `phone` | text | (same row) | 18 | |
| 31 | `Citizenship` | select (2) | `Citizenship` / `(Only Indian citizens can file RTI Request application)` | - | Indian / Other |
| 32 | `BPL` | select (3) | `* Is the Applicant Below Poverty Line ?` | - | `''` / `Y` Yes / `N` No |
| 33 | `bplCardNo` | text | `BPL Card No.(Proof of BPL may be provided as an attachment)` | 50 | **Always visible and enabled**, including when BPL = No |
| 34 | `YearOfUssue` | text | `Year of Issue` | 4 | Always visible (field name misspelled in the markup) |
| 35 | `IssuAuthority` | text | `Issuing Authority` | 50 | Always visible |
| 36 | `Description` | textarea | `* Text for RTI Request application` | **3000** | `rows=6 cols=40`. No `oninput`/`onkeyup`/`onkeypress`/`onchange`/`onblur` handlers |
| 37 | `DocumentFile` | file | `Supporting document (only pdf upto 1 MB)` | - | |
| 38 | `6_letters_code` | text | `* Enter security code` | 6 | **A second CAPTCHA**, after the OTP already passed |
| 39 | `requestSubmit` | submit | - | - | Label is `Submit` or `Make Payment`: see §4 |
| 40 | *(unnamed)* | reset | - | - | Destructive "Reset" adjacent to the primary action |

## 2. Verbatim on-screen instructional text

- `Note:Fields marked with * are Mandatory.`
- `(Your Request will be filed with this selected Public Authority)`
- `(Only Indian citizens can file RTI Request application)`
- `(Enter Text for RTI Request application upto 3000 characters)`
- `Note:- Only alphabets A-Z a-z number 0-9 and special characters , . - _ ( ) / @ : & ? \ % are allowed in Text for RTI Request application.`
- `Note: Do not upload Aadhar Card or PAN Card or any other personal Identification (Except BPL Card).`
- `PDF file name should be less than 12 alpha-numeric characters only and shouldn't contain any blank spaces.`
- `(All Characters are Case insensitive)`
- **Conditional, appears only when `BPL = No`:** `You are required to pay the RTI fee of ₹ 10`

## 3. The public-authority cascade `[O]`

Two levels, not one flat list.

- `MinistryId`: **96 options**. Full verbatim list captured to `ministries.json` in this directory.
- Selecting `Ministry of Railways` (value `81`) populated `DepartmentId` with **184 options** (183 authorities + `---Select---`), e.g. `Ajmer Division- NWR`, `Ajmer Work shop- NWR`, `Bharat Wagon Engineer Company Ltd`, `CENTRAL RAILWAY`, `Centre for Railway Information System (CRIS)`, `Central Oraganization Railway Electrification (CORE),Allahabad`.
- Selecting `All Ministries` (value `0`) reset `DepartmentId` to **1 option** (`--Select--`): i.e. choosing "All Ministries" yields **no selectable public authority at all**. Dead option in this context. `[O]`

### Correction to Session 1

Session 1 claimed the citizen must pick from *"one flat, ungrouped dropdown of ~2,900 public authorities"*. **That was wrong.** The 2,904 figure came from the separate public catalogue page `request/allpa.php`, not from this form. The form uses a searchable two-level cascade. The corrected claim is recorded in `docs/agent-memory/03-rti-site-inventory.md` §4 and the original wording is preserved there as a superseded statement.

## 4. Conditional behaviour `[O]`

| Trigger | Observed effect |
|---|---|
| `BPL` = `Yes` | Submit button reads **`Submit`**. No fee text shown. |
| `BPL` = `No` | Submit button relabels to **`Make Payment`**, and red text appears: `You are required to pay the RTI fee of ₹ 10` |
| `BPL` = `''` (default) | Button reads `Submit`; no fee disclosed. The fee is therefore **not visible until the BPL question is answered** |
| `Educational Status` = `Literate` | Reveals four previously `display:none` radios: Below 12th Standard / 12th Standard Pass / Graduate / Above Graduate |
| `Educational Status` = `Illiterate` | Those four remain hidden |
| `bplCardNo`, `YearOfUssue`, `IssuAuthority` | **Never hidden or disabled** in any BPL state: always visible, always enabled |
| `Country` = `Other` | **No conditional behaviour whatsoever** `[O]`. Verified with a real click: `chkCountry` becomes `999`, and both the India `State` dropdown **and** the free-text `txtCountry` box remain visible and enabled side by side. Nothing is hidden, disabled or explained: a citizen abroad sees an Indian-state selector and a country text box at once, with no guidance on which to use |

## 5. Request-text handling `[O]`

- `maxlength="3000"` is enforced by the browser: typing past 3,000 characters is **silently truncated**.
- **No character counter** of any kind: the citizen cannot see how much room remains.
- **No input-time filtering**: the textarea has no `oninput`, `onkeyup`, `onkeypress`, `onchange` or `onblur` handler. The restricted character set is therefore enforced only at submit time, after the citizen has composed the entire request.
- The restriction excludes the apostrophe, `#`, `;`, `+`, `=`, `"`, the rupee sign and all Devanagari: so ordinary English punctuation and any Hindi text fail.

## 6. Accessibility, scoped to this page `[O]`

Measured on `request/request.php` only. **Do not generalise to other pages**: see §7.

| Measure | Value |
|---|---|
| `<label>` elements | **0** |
| Visible inputs | **40** |
| Inputs with no programmatic name (no label / `aria-label` / `aria-labelledby` / wrapping label) | **40** |
| `aria-required` | 0 |
| `aria-describedby` | 0 |
| `fieldset` / `legend` | 1 / 1 (the Gender group only) |
| Layout `<table>` elements | 6 |
| Landmarks (`main`/`nav`/`header`/`footer`) | 0 |
| Headings | 1 × `h1`, 0 × `h2`, 0 × `h3` |
| `<html lang>` | `en`: **present** |
| `meta[name=viewport]` | `width=device-width, initial-scale=1.0`: **present** |
| Form `action` | empty string; validation runs via an `onsubmit` handler |

## 7. Correction to Session 1 accessibility findings

Session 1 recorded A1 (no viewport meta) and A2 (no `lang`) as portal-wide. **They are page-scoped.** The home page `/index.php` genuinely lacks both; this authenticated form page has both. The portal is **inconsistent between pages**, which is a finding in its own right. A3 (no labels), A4 (layout tables), A7 (no landmarks) and A8 (no heading structure) are confirmed on this page too.

## 7a. Client-side validation: complete inventory `[O]`

**Method:** rather than triggering native dialogs (which browser automation cannot read or dismiss), the page's own validation functions were enumerated and their dialog string literals extracted via `Function.prototype.toString`. This is exhaustive for client-side dialogs, and it required no submission.

`form[name=frmRequest]` has `onsubmit="return chkFrmCitizenship();"`.

Every global function on the page containing an `alert(` call: **all of them**:

| Function | Dialog | Exact text |
|---|---|---|
| `chkFrmCitizenship` | `alert` | `Only Indian citizens can file RTI Request application.` |
| `chkCitizenship` | `alert` | `Only Indian citizens can file RTI Request application.` |
| `chkPAname` | `alert` | `Your request will be filed with 

` + the selected public authority name |
| `confirmPAname` | `alert` | `Your request will be filed with 

` + the selected public authority name |

Other page functions (`getDepartmentList`, `preset`) contain no dialogs. **No `confirm()` or `prompt()` is used anywhere.**

### What this means: three findings

1. **There is no client-side validation of required fields at all.** `[O]` No dialog, and no inline message, exists for a missing name, address, public authority, request text or CAPTCHA. Combined with the absence of any HTML `required` attribute (§1), **every mandatory-field check must be server-side**: i.e. the citizen submits, waits for a round trip, and the page re-renders. This matches the behaviour observed on the pre-auth page, where errors returned as loose text after a full reload.
2. **The public-authority confirmation is an `alert()`, not a `confirm()`.** `[O]` The citizen is *told* "Your request will be filed with …" and can only acknowledge it. There is no Cancel, no chance to change their mind at the dialog, and no statement of what happens if the choice is wrong.
3. **The only true client-side gate is citizenship.** `[O]` Everything else that could be caught in the browser is not.

### Which dialog blocked the audit

The modal that halted automation during the validation test was `Your request will be filed with 

…` from the public-authority confirmation path: not a field-validation message. Resolved by source inspection; **no dialog text remains unknown.**

## 7b. Mobile / reflow behaviour `[O]`

**Limitation first:** true device emulation was **not available** for the authenticated tab in this environment: `resize_window` did not change the viewport (`innerWidth` stayed 1536). So reflow was measured directly instead, by constraining `body` to 360 px and reading the resulting minimum content width. That is a legitimate reflow measurement, not a simulation of a phone, and it is reported as such.

| Measure | Value |
|---|---|
| `meta[name=viewport]` | **present** (`width=device-width, initial-scale=1.0`) |
| Body constrained to | 360 px |
| Resulting `body.scrollWidth` | **985 px** |
| Horizontal overflow at 360 px | **625 px**: content is ~2.7× the screen width |
| Widest single layout `<table>` | 888 px |
| Form controls extending past the right edge at 360 px | **32** |
| Form controls shorter than the 44 px minimum touch target | **30** (most are 24–28 px tall) |

**Interpretation.** The viewport meta means a phone will *not* zoom the page out the way `/index.php` does: but the 6 nested layout tables have a minimum width near 900 px and **do not reflow**. The citizen therefore gets a page they must scroll horizontally across every row of a 40-field form, with touch targets around 26 px. This is a **WCAG 2.2 1.4.10 Reflow failure** and a 2.5.8 Target Size (Minimum) failure.

This nuances: and partly reverses the comfort of: the Session 1 correction: having the viewport meta is not the same as being usable on a phone. On this page it may be worse than the home page's zoom-out, because horizontal scrolling is per-row rather than a single pinch.

## 8. Not verified / pending

| Item | Status |
|---|---|
| `Country = Other` branch | `[U]`: not re-tested with a real click |
| Behaviour past `Make Payment` | **Intentionally not observed.** We stopped at the irreversible boundary |
| Server-side validation rules | `[U]` |
| Colour contrast ratios | `[U]`: not measured |
| Screen-reader behaviour | `[U]`: structural proxies only |

## 9. Reproduction steps

1. Open `https://rtionline.gov.in/` in a browser.
2. Go to **Submit Request**. (Observed: navigating directly to `guidelines.php?request` landed straight on `request_email_check.php`: the guidelines checkbox gate did not block the destination page. `[O]`)
3. On `request/request_email_check.php`, enter an email, optionally a mobile, and the CAPTCHA. **A human must do this**: it dispatches a real OTP.
4. Enter the OTP on `request/Request_Check_Otp.php`.
5. The form at `request/request.php?emailchk=…&cellchk=…&urletoken=…` is then reachable for the length of that session.
