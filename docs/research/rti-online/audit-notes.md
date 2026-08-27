# RTI Online: raw audit notes (2026-08-26)

Working notes behind `docs/agent-memory/03-rti-site-inventory.md`. Kept so a later agent can check our reasoning without re-running the audit.

## Method

- In-app Chromium, read-only. DOM and accessibility-tree inspection, plus scripted measurements run in the page.
- Screenshots were **unavailable** this session (the browser pane could not composite frames), so all findings are structural/textual. No pixel or contrast measurements exist.
- The portal's own *Citizen Module* user manual (29 pp.) was fetched and text-extracted.
- FAQ answers are hidden in an accordion; they were read from the DOM (26 questions, all answers present in the markup).

## Verbatim measurements

Home page (`/index.php`):

```
lang: null            viewportMeta: null      skipLink: false
h1: 1  h2: 0  h3: 0   landmarks: {main:0, nav:0, header:0, footer:0}
marquee: 1            images: 4  (all with alt)
```

Mobile emulation, 375x812 device:

```
window.innerWidth: 980     document.scrollWidth: 980     overflow: 0
```

`innerWidth` of 980 on a 375 px device is the signature of a missing viewport meta tag: the page is laid out at desktop width and scaled down. Horizontal overflow reads as 0 precisely *because* the whole page has been zoomed out.

RTI Request form, step 1 (`/request/request.php`):

```
tables: 1    labels: 0    unlabeled inputs: 6
inputs: [ {lan, select-one}, {Email, text}, {cell, password, placeholder:"Enter Mobile Number"},
          {6_letters_code, text}, {Submit, submit}, {reset} ]
```

`cell`: the mobile number: is `type="password"`. The citizen cannot see the number they typed.

Validation behaviour: submitting the form empty POSTs to `/request/request_email_check.php`, and the page re-renders with the loose strings *"Please enter a valid Email ID"* and *"Please Enter Correct Captcha Code."*. There are no `required` attributes and no client-side blocking; the CAPTCHA regenerates on every failure.

Public authority list (`/request/allpa.php`): one `<table>`, 3,114 rows, 2,904 unique names, no grouping, no filter, no search.

## Quotations worth keeping (from the portal's own FAQ)

- On filing for a state authority: *"RTI applications filed through this portal for the state public authorities, including NCT of Delhi, would be returned, without any refund of fee"*.
- On how to write an application, the complete substantive guidance is the character limit and the note that longer text may be attached as a PDF.
- On certificate errors, the portal advises users to *"ignore the certificate error and proceed forward"*, with per-browser instructions.
- On why View Status needs an OTP: to stop anyone holding a registration number and email from reading an applicant's personal information.

## Registration number format (user manual, p.29)

`AAAAA/B/C/DD/EEEEE`: public authority code / `R`equest or `A`ppeal / receipt type (`E` online, `P` physical, `T` transferred, `X` part transfer, `L` legacy) / two-digit year / five-digit serial.

Our mock references must be visibly distinguishable from this.

## Third-party context (NOT verified against primary sources)

Press and civil-society summaries of CIC annual reports report on the order of 13.7 lakh RTI applications a year to Union government bodies, tens of thousands of rejections annually, and rising first-appeal volumes. Useful as background for the problem's scale; **do not quote these figures as fact in the product** without checking the CIC annual report itself.

Sources consulted: reporting by The Wire, Business Standard, The Week, and the Commonwealth Human Rights Initiative on CIC annual reports.
