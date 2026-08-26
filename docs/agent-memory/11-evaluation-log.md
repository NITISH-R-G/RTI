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

## Pending evaluations (to run once the product exists)

- The assistant evaluation case set in `09-ai-behavior.md`, plus the taxonomy-coverage figure.
- Task completion and step count for the primary journey, against the baseline above.
- Mobile usability at 360 px.
- Recovery from a wrong interpretation by the app.
- The out-of-coverage journey: does the product decline honestly and still get the citizen somewhere useful?
