# 03 — RTI Online Site Inventory (rtionline.gov.in)

**Audit date:** 2026-08-26 (unauthenticated pass), **updated 2026-08-26 after an authenticated pass**
**Method:** Read-only browser observation (in-app Chromium), DOM/accessibility-tree inspection, plus the portal's own published *Citizen Module* user manual PDF (`viewPDF.php?file=um_citizen.pdf`, 29 pages) and the portal FAQ (answers extracted from the collapsed accordion DOM).
**Safety:** No RTI request, appeal, payment, login, or OTP was submitted. One empty-form POST to `request/request_email_check.php` was made solely to observe validation rendering; it creates no application and no government record. No personal data was entered anywhere.

> ## UPDATE — authenticated audit, 2026-08-26
>
> The project owner manually completed email + mobile + CAPTCHA + OTP in a real browser, and the agent then audited the authenticated **Online RTI Request Form** directly. Nothing was submitted and no payment was initiated.
>
> **Primary sources now:** `docs/research/rti-online/authenticated-form-structure.md`, `authenticated-flow-map.md`, `authenticated-friction-map.md`, `ministries.json`.
>
> **Two Session 1 claims in this file were wrong and are corrected below — see §4 and §7.** The original wording is preserved as superseded rather than deleted.

## Evidence legend

- **[O] OBSERVED** — directly seen in the live site this session.
- **[D] OFFICIAL DOCS** — stated in the portal's own citizen user manual or FAQ (authoritative, but not seen live this session).
- **[I] INFERRED** — reasonable deduction from [O]/[D]; not verified.
- **[U] UNKNOWN** — could not be verified safely.

---

## 1. Routes / pages

| Route | Purpose | Entry point | Key actions | Evidence |
|---|---|---|---|---|
| `/index.php` | Home | Direct / nav | Read notices, enter Submit Request | [O] |
| `/guidelines.php?request` | Mandatory guidelines gate before the request form | "Submit Request" | Tick "I have read and understood the above guidelines", Submit | [O] |
| `/request/request.php` (Online RTI Request Form — step 1) | Email + mobile + CAPTCHA, sends OTP | After guidelines gate | Enter email, mobile, CAPTCHA, Submit | [O] |
| `request/Request_Check_Otp.php` | OTP entry | After request step 1 | Enter OTP | [O] route. **Back-navigating here later yields a browser error page — the token is single-use** [O] |
| `request/request.php?emailchk=…` (**Online RTI Request Form**) | The actual application: authority cascade, applicant details, demographics, BPL, request text | After OTP verification | Fill, then Make Payment (non-BPL) / Submit (BPL) | **[O] — observed directly after legitimate manual authentication, 2026-08-26.** Previously "[D] OTP-gated, not observable read-only". Full structure: `docs/research/rti-online/authenticated-form-structure.md` |
| `/guidelines.php?appeal` | Same guidelines gate before first appeal | "Submit First Appeal" | Tick + Submit | [O] |
| *First Appeal form (step 1)* | Request Registration No. + Email Id + security code | After guidelines gate | Submit | [D] |
| *First Appeal form (step 2)* | Ground For Appeal dropdown + appeal text + supporting document | After step 1 | Submit (no fee) | [D] |
| `/request/status.php` | View Status | Nav | Registration No. + Email + CAPTCHA, then **OTP**, then status | [O] (form), [D] (post-OTP screens) |
| `/request/status_history.php` | View History | Nav | Email + Mobile + CAPTCHA, then **OTP**, then counts of Registered / Disposed / Pending requests and appeals | [O] (form), [D] (post-OTP screens) |
| `/login.php` | Optional citizen account login | Nav | Username + Password + CAPTCHA | [O] |
| `/viewPDF.php?file=um_citizen.pdf` | Citizen user manual (29 pp., screenshot-based) | Nav | Read | [O] |
| `/Contactus.php` | Contact | Nav | Read helpdesk phone/email + one Under Secretary address | [O] |
| `/faq.php` | 26-question FAQ accordion | Nav | Expand answers | [O] |
| `/request/status_pendingPayment.php` | "Payment Reconciliation" — check a payment whose registration number never arrived | Nav (flagged "new") | Look up stuck payment | [O] (link only) |
| `/request/allpa.php` | Full list of public authorities available on the portal | Header link | Read a single flat table | [O] |
| `/Policies.php` | Site policies | Footer | Read | [O] (link only) |
| External: `dsscic.nic.in/online-appeal-application/` | Second appeal / complaint to CIC — **a different portal** | Footer | — | [O] |

Global nav is a flat 10-item bar: Home, Submit Request, Submit First Appeal, View Status, View History, Login, User Manual, Contact Us, FAQ, Payment Reconciliation. [O]

## 2. The citizen journey as the portal actually implements it

**Filing a request** — [O] for steps 1–5 (5 now observed authenticated), [D] for 6–8

1. Home, then *Submit Request*
2. Guidelines gate — **22 dense bullets** of procedure/legal text, mandatory checkbox
3. Email + Mobile + CAPTCHA, which sends an **OTP** to email/mobile
4. Enter OTP
5. RTI Request Form — **40 visible inputs on one screen** [O]: a two-level authority cascade (`Select Ministry/Department/Apex body`, 96 options → `Select Public Authority`, cascaded), a `Search Public Authority` type-ahead, personal details, demographics (gender, rural/urban, education), BPL yes/no, the request text (3,000 characters), an optional PDF, and **a second CAPTCHA**
6. Non-BPL: *Make Payment*, choose payment mode (Net banking / Card / UPI), external payment gateway, return
7. Registration number issued — **or not** (see F7; reconciliation can take 24–48 working hours)
8. Application reaches the **Nodal Officer** of the chosen ministry, who forwards it to the concerned **CPIO**

**Checking status** — [O] for the form, [D] for results: View Status, then Registration No. + Email + CAPTCHA, then **an OTP every single time**, then the status screen.

**First appeal** — [D]: only after 30 days with no reply; needs the original registration number and email; choose a *Ground For Appeal*; 3,000 characters or fewer; no fee. Only possible if the original RTI was filed **online**; if the application was physically transferred to a non-aligned authority, the appeal must be filed on paper.

## 3. Forms

| Form | Fields | Mandatory | Validation observed | Notes |
|---|---|---|---|---|
| Guidelines gate | 1 checkbox | checkbox | Submit button titled "Please select the undertaking statement then submit" | [O] Pure friction: no information is collected. |
| Request step 1 | Email Id, Mobile Number, Security code (CAPTCHA) | Email, CAPTCHA (`*` marked; **no HTML `required`**) | Full server round-trip; the page re-renders with plain-text messages "Please enter a valid Email ID" and "Please Enter Correct Captcha Code."; the CAPTCHA regenerates | [O] Mobile Number is `type="password"` — masked, so a citizen cannot see or verify the number they typed. |
| Request step 2 (application) | **40 visible inputs** — see `authenticated-form-structure.md` §1 for the complete list with names, types and maxlengths | `*` markers are presentational; **no field carries the HTML `required` attribute** [O] | Client-side `onsubmit` handler raising a native `alert()` dialog [O]; exact dialog text still [U] | **[O]** Character set restricted to `A-Z a-z 0-9 , . - _ ( ) / @ : & ? \ %` — a request containing `#`, an apostrophe, `;`, `+`, `=`, the rupee sign, or Devanagari text is rejected. |
| First appeal step 1 | Request Registration No., Email Id, security code | all | [U] | [D] |
| First appeal step 2 | "Ground For Appeal" (dropdown), "Text for RTI first appeal application" (3,000 chars max), Supporting document | [U] | [U] | [D] |
| View Status | Registration Number, Email Id, CAPTCHA, then OTP | all | [U] | [O] form |
| View History | Email Id, Mobile Number, CAPTCHA, then OTP | Email, CAPTCHA | [U] | [O] form |
| Login | Username, Password, CAPTCHA | all | [U] | [O] |

## 4. The public-authority problem (quantified)

- `request/allpa.php` lists **3,114 rows / 2,904 unique public authority names** in one flat, ungrouped table. [O] Captured to `docs/research/rti-online/public-authorities.json`.
- **1,099** of those names (38%) contain a bare acronym (e.g. "DG/PD INTERNATIONAL CENTRE FOR INFORMATION SYSTEMS & AU.", "MSTC Limited", "NISST"). [O]
- **175** are prefixed "UT …" (Union Territory bodies). [O]
### CORRECTION (authenticated audit, 2026-08-26)

**Superseded Session 1 claim:** *"The citizen must pick from one flat, ungrouped dropdown of ~2,900 public authorities, with no search assistance."* **This was wrong.** The 2,904 figure describes the separate public catalogue page `allpa.php`, not the form.

**What the form actually does** [O]:

- `Select Ministry/Department/Apex body` — **96 options** (94 real bodies + `--Select--` + `All Ministries`). Full list: `docs/research/rti-online/ministries.json`.
- `Select Public Authority` — **cascaded** from the ministry. `Ministry of Railways` yields **184 options**.
- `All Ministries` is selectable but populates **zero** public authorities — a dead option. [O]
- A **`Search Public Authority` type-ahead exists**, with placeholder `Type name or part of name of public authority`.

**The real problem is sharper than the one we described.** The search matches *institutional names*, not citizen needs:

| Input | Result |
|---|---|
| `provident fund` | 2 relevant results |
| `passport` | 1 relevant, **3 irrelevant** (Pasteur Institute of India, Punjab & Sind Bank, UPASI Tea Research Foundation) |
| `my pension has not been paid` | **`No such Public Authority available in this portal !`** |

The last case is a dead end handed to a citizen with a valid request, while `Department of Pensions & Pensioners Welfare` sits in the ministry cascade on the same screen. Detail and reproduction steps: `docs/research/rti-online/authenticated-friction-map.md` F-A1.
- Consequence of getting it wrong, per the portal's own FAQ [D]:
  - Wrong *central* authority: the Nodal Officer transfers it under **s.6(3)**; a **new registration number** is generated and the citizen must track the new one.
  - **State** authority (including NCT of Delhi): the application is **returned without any refund of fee**.
  - Information spanning several CPIOs: the application is **split into multiple registration numbers** (`.../07619`, `.../07619/1`, `.../07619/2`), each replying separately, and any appeal must be filed against the *specific* sub-number, not the original.

## 5. Friction points (ranked by citizen cost)

| # | Friction | Evidence | Cost to citizen |
|---|---|---|---|
| F1 | Must choose 1 of ~2,900 public authorities with no guidance | [O] | Wrong pick means a 30+ day delay, or the fee is lost with no refund |
| F2 | Zero help writing the request. The FAQ question "How do I write my application for seeking the information as per RTI Act 2005?" is answered **only** with the 3,000-character limit | [O] | Vague or opinion-seeking requests get rejected and the citizen has no idea why |
| F3 | Nothing checks whether RTI is even the right instrument (versus a grievance to CPGRAMS) | [O] absence | 30 days and a fee wasted on a request that can never be answered |
| F4 | An OTP is required to read your own status, every time | [O] | Repeated dependence on email/SMS delivery just to check progress |
| F5 | 22-bullet legal guidelines wall before the form | [O] | Drop-off; nobody reads it; the checkbox is a formality |
| F6 | **No `<meta name="viewport">`** — the site falls back to a 980 px desktop viewport on a 375 px phone | [O] | Pinch-and-zoom on every field, on a mobile-first population |
| F7 | Payment can succeed while the registration number does not arrive; official advice is to wait **24–48 working hours** and not retry | [D] | Citizen cannot tell success from failure; an entire "Payment Reconciliation" page exists to paper over this |
| F8 | Restricted character set in the request text | [D] | Silent rejection of ordinary punctuation and of Hindi text |
| F9 | Split applications create multiple registration numbers; appeals must target the right sub-number | [D] | Appeals filed against the wrong number fail |
| F10 | An appeal is only possible after 30 days, and only for online-filed RTIs — surfaced nowhere before you try | [D] | Confused, premature appeals |
| F11 | Terminology is entirely internal-government (CPIO, Nodal Officer, First Appellate Authority, s.6(3), BPL) with no plain-language gloss | [O] | First-time users cannot form a mental model |

## 6. Terminology map (existing to plain language)

| Existing term | What the citizen actually needs to hear |
|---|---|
| Public Authority | "The government office that holds this information" |
| CPIO | "The officer whose job is to answer your question" |
| Nodal Officer | "The person who passes your question to the right officer" |
| First Appellate Authority | "The senior officer who reviews it if you get no answer or a bad one" |
| First Appeal | "Asking for a review — free, after 30 days" |
| Second Appeal / Complaint to CIC | "Escalating to the national watchdog (a different website)" |
| s.6(3) transfer | "Your request was sent to a different office" |
| BPL | "Below Poverty Line — no fee if you have the certificate" |
| Text for RTI Request application | "What information do you want?" |
| Ground For Appeal | "Why are you unhappy with what happened?" |
| Registration Number | "Your tracking number" |

## 7. Accessibility findings

Measured on `/index.php` and the RTI Request step-1 form. [O]

| # | Issue | Evidence | Severity | WCAG 2.2 reference |
|---|---|---|---|---|
| A1 | No `<meta name="viewport">`; layout locks to 980 px on mobile — **`/index.php` only** | `viewportMeta: null`; `innerWidth` reported 980 inside a 375x812 device emulation | Critical | 1.4.10 Reflow |
| A2 | No `lang` attribute on `<html>`, despite an English/Hindi switcher — **`/index.php` only** | `document.documentElement.lang` is null | High | 3.1.1 Language of Page |
| A3 | **Zero `<label>` elements** on the RTI request form; all 6 inputs unlabelled and unassociated | `labels: 0`, `unlabeled: 6` | Critical | 1.3.1, 3.3.2, 4.1.2 |
| A4 | Form laid out with a `<table>` used for presentation | `tables: 1` wrapping all fields | Medium | 1.3.1 |
| A5 | Errors render as loose text after a full page reload, not programmatically tied to their field | Observed re-render of "Please enter a valid Email ID" | High | 3.3.1 Error Identification |
| A6 | Mobile Number field is `type="password"` (masked) | `{n:"cell", t:"password"}` | High | 3.3.2; also blocks autofill and self-review |
| A7 | No landmarks (`main`/`nav`/`header`/`footer` all absent) and no skip link | `landmarks: {main:0,nav:0,header:0,footer:0}`, `skipLink: false` | High | 1.3.1, 2.4.1 |
| A8 | No heading structure below `h1` (1 h1, 0 h2, 0 h3) | heading counts | Medium | 2.4.6 |
| A9 | `<marquee>` on the home page — moving text with no pause control | `marquee: 1` | High | 2.2.2 Pause, Stop, Hide |
| A10 | An image CAPTCHA gates every citizen action; the audio alternative is a bare speaker icon linking to `audiofile1.php` | [O] | High | 1.1.1 (partial mitigation present) |
| A11 | Text sizing offered as custom `A+ / A / A-` links rather than working with native browser zoom | [O] | Low | — |
| A12 | The portal's own FAQ tells users to **ignore browser certificate errors** ("Proceed Anyway") | FAQ answer [O] | High (security guidance) | — |
| A13 | **40 visible inputs, 0 `<label>` elements, 0 with any programmatic name** on the authenticated request form | measured in-page on `request/request.php` [O] | Critical | 1.3.1, 3.3.2, 4.1.2 |
| A14 | Validation delivered as a native `alert()` dialog, not tied to any field | [O] on submit with missing fields | High | 3.3.1 |
| A15 | Back navigation to the OTP screen produces a browser error page (single-use token) | [O] | High | 3.2.x / recoverability |

### CORRECTION (authenticated audit, 2026-08-26)

**Superseded Session 1 claim:** A1 and A2 were written as portal-wide. **They are page-scoped.** `/index.php` lacks both `lang` and a viewport meta; the authenticated `request/request.php` **has both** (`lang="en"`, `width=device-width, initial-scale=1.0`). The portal is inconsistent between pages — itself a finding. A3, A4, A7 and A8 are confirmed on the authenticated form as well.

## 8. What we could NOT verify (do not fabricate these)

- ~~[U] The live RTI application form itself~~ — **RESOLVED 2026-08-26.** Observed directly after legitimate manual authentication by the project owner. It **does** have a type-ahead search. Full structure: `docs/research/rti-online/authenticated-form-structure.md`.
- [U] The exact text of the request form's client-side validation dialog — a native `alert()`, which browser automation can neither read nor dismiss. Requested from the project owner; still pending.
- [U] The `Country = Other` conditional branch — not re-tested with a real click.
- [U] 360 px mobile behaviour of the authenticated request form — not yet run.
- **NOT OBSERVED BY CHOICE:** everything past `Make Payment` / `Submit`. We stopped at the irreversible boundary. Do not upgrade any post-submission claim to [O].
- [U] Post-OTP View Status / View History screens.
- [U] The payment gateway screens.
- [U] Server-side validation rules beyond email + CAPTCHA.
- [U] Colour-contrast ratios — screenshots were unavailable in this session (the browser pane could not composite frames).
- [U] Real screen-reader behaviour (only structural proxies were measured).
- [U] Hindi translation coverage and quality.

## 9. Sources

- https://rtionline.gov.in/ — home, guidelines, request step 1, status, history, login, FAQ, contact, public authority list (read-only, 2026-08-26)
- https://rtionline.gov.in/viewPDF.php?file=um_citizen.pdf — *User Manual, Right To Information (RTI), Citizen Module*, DoPT / NIC, 29 pp.
- Portal FAQ, 26 questions, answers extracted from the DOM
