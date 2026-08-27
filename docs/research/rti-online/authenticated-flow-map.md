# Authenticated flow map: RTI Online request journey

**Audit date:** 2026-08-26 · **Authenticated:** Yes (owner completed email + mobile + CAPTCHA + OTP manually)
**Evidence:** `[O]` observed directly in a real browser this session, unless tagged otherwise.
**Boundary:** the journey below stops at `Make Payment` / `Submit`. **Submission behaviour was NOT observed: we deliberately stopped before the irreversible action.** Anything about what happens after that point is `[D]` from the official manual, never `[O]`.

---

```
ENTRY  https://rtionline.gov.in/            [O]
  |
  v
STEP 1  "Submit Request"  ->  guidelines.php?request                       [O]
  |     22 bullets of procedural/legal text
  |     USER DECISION: none (informational)
  |     VALIDATION: checkbox "I have read and understood the above guidelines."
  |     NOTE: navigating directly to the request URL reached the form anyway  [O]
  |           -> the gate is a front-end formality, not an enforced step
  v
STEP 2  request/request_email_check.php                                     [O]
  |     FIELDS: Email Id* , Mobile Number (type=password) , CAPTCHA*
  |     USER DECISION: which email/mobile will receive the OTP
  |     VALIDATION: full server round-trip; inline plain-text errors
  |                 "Please enter a valid Email ID"
  |                 "Please Enter Correct Captcha Code."
  |                 CAPTCHA regenerates on every failure
  v
STEP 3  request/Request_Check_Otp.php                       [O] route only
  |     FIELD: OTP
  |     *** HUMAN AUTHENTICATION BOUNDARY: completed manually by the owner ***
  |     BACK BEHAVIOUR: navigating back to this route afterwards produces a
  |     browser error page. The token is single-use; the journey cannot be
  |     resumed backwards.                                                   [O]
  v
STEP 4  request/request.php?emailchk=..&cellchk=..&urletoken=..             [O]
  |     THE APPLICATION FORM: 40 visible inputs, one screen, no steps,
  |     no progress indicator, no save/draft.
  |     Full structure: authenticated-form-structure.md
  |
  |  +-- USER DECISION 4a: WHICH MINISTRY?  (96 options)
  |  |     No description of what any ministry covers.
  |  |     "All Ministries" is selectable but yields ZERO public authorities. [O]
  |  |
  |  +-- USER DECISION 4b: WHICH PUBLIC AUTHORITY?  (cascaded; 183 for Railways)
  |  |     Names are institutional and often acronymic.
  |  |     Red text: "(Your Request will be filed with this selected Public Authority)"
  |  |     -> the consequence of choosing wrongly is never stated here.
  |  |
  |  +-- ALTERNATIVE PATH: "Search Public Authority" type-ahead
  |  |     Matches NAMES, not NEEDS. See friction map F-A1.
  |  |     "my pension has not been paid"
  |  |        -> "No such Public Authority available in this portal !"        [O]
  |  |
  |  +-- USER DECISION 4c: personal + demographic disclosure
  |  |     Gender (defaults to Male), Rural/Urban, Literate/Illiterate
  |  |     -> Literate reveals 4 further education-level radios              [O]
  |  |
  |  +-- USER DECISION 4d: BPL Yes/No
  |  |     Yes -> button reads "Submit"      (no fee)
  |  |     No  -> button reads "Make Payment" + red "You are required to pay
  |  |            the RTI fee of Rs 10"                                       [O]
  |  |     The fee is invisible until this question is answered.
  |  |
  |  +-- USER DECISION 4e: HOW TO WORD THE REQUEST
  |  |     Free textarea, maxlength 3000, silent truncation, NO counter.
  |  |     Restricted character set enforced only at submit.                  [O]
  |  |     No guidance anywhere on what makes a request answerable.
  |  |
  |  +-- SECOND CAPTCHA  (after the OTP already passed)                       [O]
  v
VALIDATION  onsubmit handler -> native alert() dialog                        [O]
  |     Exact dialog text: PENDING  [U]  (native dialog, unreadable by CDP;
  |     requested from the project owner)
  v
=========================  IRREVERSIBLE BOUNDARY  =========================
STEP 5  "Make Payment" (non-BPL) or "Submit" (BPL)
        *** NOT CROSSED. NOT OBSERVED. ***
        A submit guard (preventDefault + stopImmediatePropagation, capture
        phase) was installed before any validation test so that submission
        was impossible even if validation had passed.
==========================================================================

BEYOND THIS POINT: [D] official citizen user manual only, never observed:
  payment mode selection (Net banking / Card / UPI) -> external gateway
  -> return to portal -> registration number issued, or delayed 24-48
  working hours pending reconciliation -> application reaches the Nodal
  Officer -> forwarded to the CPIO.
```

## Screen count for the current journey

| | Count |
|---|---|
| Screens before the citizen can type their actual question | **4** (home, guidelines, email/CAPTCHA, OTP) |
| Screens in total up to the irreversible boundary | **5** |
| Distinct decisions the citizen must make unaided on the form screen | **5** (ministry, public authority, demographics, BPL, wording) |
| Authentication challenges | **3** (CAPTCHA, OTP, second CAPTCHA) |
| Points where the journey cannot be resumed backwards | **1** (single-use OTP token) |
| Places the fee is disclosed | **1**, and only after answering the BPL question |
| Places the consequence of choosing the wrong authority is disclosed | **0** on the form |
