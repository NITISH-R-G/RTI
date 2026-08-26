# 03 — RTI Online Site Inventory (rtionline.gov.in)

**Audit date:** 2026-08-26
**Method:** Read-only browser observation (in-app Chromium), DOM/accessibility-tree inspection, plus the portal's own published *Citizen Module* user manual PDF (`viewPDF.php?file=um_citizen.pdf`, 29 pages) and the portal FAQ (answers extracted from the collapsed accordion DOM).
**Safety:** No RTI request, appeal, payment, login, or OTP was submitted. One empty-form POST to `request/request_email_check.php` was made solely to observe validation rendering; it creates no application and no government record. No personal data was entered anywhere.

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
| *RTI application form (step 2)* | The actual application: ministry, applicant details, request text | After OTP verification | Fill, then Make Payment / Submit (BPL) | [D] — **OTP-gated, not observable read-only** |
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

**Filing a request** — [O] for steps 1–3, [D] for 4–8

1. Home, then *Submit Request*
2. Guidelines gate — **22 dense bullets** of procedure/legal text, mandatory checkbox
3. Email + Mobile + CAPTCHA, which sends an **OTP** to email/mobile
4. Enter OTP
5. RTI Request Form — select Ministry/Department/Apex body from a dropdown covering **~2,900 public authorities**; declare BPL yes/no; write the request in 3,000 characters or fewer; optionally attach one PDF of 1 MB or less
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
| Request step 2 (application) | "Select Ministry/Department/Apex body", "Is the Applicant Below Poverty Line?", applicant details, "Text for RTI Request application" (3,000 chars max), "Supporting document" (PDF, 1 MB max) | `*`-marked subset | [U] | [D] Character set restricted to `A-Z a-z 0-9 , . - _ ( ) / @ : & ? \ %` — a request containing `#`, an apostrophe, `;`, `+`, `=`, the rupee sign, or Devanagari text is rejected. |
| First appeal step 1 | Request Registration No., Email Id, security code | all | [U] | [D] |
| First appeal step 2 | "Ground For Appeal" (dropdown), "Text for RTI first appeal application" (3,000 chars max), Supporting document | [U] | [U] | [D] |
| View Status | Registration Number, Email Id, CAPTCHA, then OTP | all | [U] | [O] form |
| View History | Email Id, Mobile Number, CAPTCHA, then OTP | Email, CAPTCHA | [U] | [O] form |
| Login | Username, Password, CAPTCHA | all | [U] | [O] |

## 4. The public-authority problem (quantified)

- `request/allpa.php` lists **3,114 rows / 2,904 unique public authority names** in one flat, ungrouped table. [O] Captured to `docs/research/rti-online/public-authorities.json`.
- **1,099** of those names (38%) contain a bare acronym (e.g. "DG/PD INTERNATIONAL CENTRE FOR INFORMATION SYSTEMS & AU.", "MSTC Limited", "NISST"). [O]
- **175** are prefixed "UT …" (Union Territory bodies). [O]
- The citizen must map their real-life problem ("my passport is stuck", "the road outside my house was never repaired") onto one of these names, with no search assistance described in the manual and no explanation of what any authority does. [O]/[D]
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
| A1 | No `<meta name="viewport">`; layout locks to 980 px on mobile | `viewportMeta: null`; `innerWidth` reported 980 inside a 375x812 device emulation | Critical | 1.4.10 Reflow |
| A2 | No `lang` attribute on `<html>`, despite an English/Hindi switcher | `document.documentElement.lang` is null | High | 3.1.1 Language of Page |
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

## 8. What we could NOT verify (do not fabricate these)

- [U] The live RTI application form itself (field order, exact labels, the ministry dropdown's UI, whether it has type-ahead search) — it sits behind an OTP wall. Everything we state about it comes from the official manual and is marked [D].
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
