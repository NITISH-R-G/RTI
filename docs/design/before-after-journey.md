# Before vs After — the citizen journey

**Status:** Phase 2 specification, 2026-08-26.
**Source of truth for the "current" column:** the frozen authenticated audit — `docs/research/rti-online/authenticated-flow-map.md`, `authenticated-form-structure.md`, `authenticated-friction-map.md`. Every current-state claim below carries an evidence tag and a pointer. Nothing here is written from memory or assumption.

**Rule observed throughout:** no unmeasurable claims. There is no "10x easier" or "dramatically simpler" in this document. Every comparison is a count, a boolean, or a pixel measurement, and every one is testable.

---

## 1. Side-by-side, measured

| # | Dimension | RTI Online (observed) | Our prototype (specified) | Evidence for "current" |
|---|---|---|---|---|
| 1 | **Entry point** | Home page → *Submit Request* → guidelines wall → email/CAPTCHA → OTP, before any question about what you want | Public URL → one question: **"What happened?"** | flow-map STEP 1–4 `[O]` |
| 2 | **Screens before you can describe your problem** | **4** | **0** — it is the first screen | flow-map, screen count `[O]` |
| 3 | **Major steps to a filed request** | **5** to the payment boundary | **6** screens, but the first is the problem itself | flow-map `[O]` |
| 4 | **Total form fields presented** | **40** visible inputs on one screen | **≤ 7** across the whole journey | form-structure §1 `[O]` |
| 5 | **Explicit unaided user decisions** | **5** — ministry, public authority, demographics, BPL, wording | **≤ 4**, none unaided; every one is proposed with reasoning and is editable | flow-map, USER DECISION 4a–4e `[O]` |
| 6 | **Points requiring prior institutional knowledge** | **2 mandatory** — you must name a ministry (96 options) and a public authority (183 for Railways alone) before proceeding | **0 required** — institutional names are proposed, never demanded | form-structure §3 `[O]` |
| 7 | **Government terminology the citizen must already understand** | Public Authority, Ministry/Department/Apex body, CPIO, Nodal Officer, BPL, First Appellate Authority, s.6(3) | **0 assumed.** Every term appears with a plain-language gloss at the point of use | inventory §6, form-structure §2 `[O]`/`[D]` |
| 8 | **When validation happens** | **After a network round trip.** No HTML `required` attributes and no client-side field validation exist; the only two dialogs are a citizenship guard and an authority notice | **Before any network call** — all validation is deterministic and local | form-structure §7a, friction F-A11 `[O]` |
| 9 | **Restricted-character feedback** | At submit, after composing up to 3,000 characters. The textarea has no `oninput`/`onkeyup`/`onkeypress`/`onchange`/`onblur` handler | **As you type**, naming the offending characters, with a one-tap fix | form-structure §5, friction F-A3 `[O]` |
| 10 | **Remaining-character feedback** | **None.** `maxlength=3000` truncates silently | Live remaining count | form-structure §5, friction F-A4 `[O]` |
| 11 | **Authority selection method** | Two cascading dropdowns (96 → 183) plus a search that matches institutional names, not needs | Derived from the problem; presented as one recommendation + reasoning + ranked alternatives + full search as a floor | form-structure §3, friction F-A1 `[O]` |
| 12 | **Problem-language input to the authority search** | `my pension has not been paid` → **"No such Public Authority available in this portal !"** while the relevant department exists in the same screen's cascade | The same sentence is the **expected** input and reaches a recommendation | friction F-A1 `[O]` |
| 13 | **Authority confirmation** | An `alert()` reading "Your request will be filed with …". No Cancel; consequence of a wrong choice never stated | A reversible screen stating the consequence: transfer under s.6(3), or **return without refund** for a state body | form-structure §7a `[O]`, `[D]` for consequence |
| 14 | **Error recovery** | Server round trip re-renders the page with loose text and **regenerates the CAPTCHA** — a typo costs a new CAPTCHA | Errors are inline, tied to their field, and never discard work | inventory §3 `[O]` |
| 15 | **Back-navigation behaviour** | Going back to the OTP screen produces a **browser error page**; the token is single-use and the journey cannot be resumed | Every step reversible; state preserved; back never destroys work | flow-map STEP 3 `[O]` |
| 16 | **Draft / save** | None. No progress indicator, no save, in a 40-field form | Work persists locally across steps and reloads within the session | form-structure §1 `[O]` (absence) |
| 17 | **Authentication challenges** | **3** — CAPTCHA, OTP, then a second CAPTCHA on the form itself | **0** — but see the honesty note below | form-structure §1 (#38), flow-map `[O]` |
| 18 | **Minimum usable viewport** | Constrained to 360 px the form needs **985 px** — 625 px of horizontal overflow, 32 controls past the right edge. Has a viewport meta but does not reflow | **360 px with 0 horizontal overflow**, verified at 360/390/430/768/1024/1440 | form-structure §7b, friction F-A12 `[O]` |
| 19 | **Touch-target compliance** | **30** controls under 44 px (mostly 24–28 px) | **0** under 44 px | form-structure §7b `[O]` |
| 20 | **Programmatic labels** | **0 `<label>` elements for 40 inputs**; 0 `aria-required`; 0 `aria-describedby`; 6 layout tables; 0 landmarks | 100% of inputs labelled; errors via `aria-describedby`; landmarks present; axe clean | form-structure §6 `[O]` |
| 21 | **Fee disclosure** | Only after answering "Is the Applicant Below Poverty Line?" — then red text and the button relabels to *Make Payment* | Stated up front, before any effort is invested, with the exemption explained | form-structure §4 `[O]` |
| 22 | **When you learn you may appeal** | Nowhere in this journey | On the review screen, as a **date** | flow-map `[O]` (absence), `[D]` for the 30-day rule |
| 23 | **Demographic disclosure** | Gender (defaulting to Male), Rural/Urban, Literate/Illiterate → four further education radios | **Not asked.** None of it changes the request, the authority or the fee | form-structure §4, friction F-A5 `[O]` |
| 24 | **Inapplicable fields shown** | BPL card number, year of issue and issuing authority stay visible and enabled even when BPL = No; `Country = Other` shows the India State dropdown alongside a free-text country box | Only the branch that applies is shown | friction F-A6, F-A13 `[O]` |
| 25 | **Final review before commitment** | None. The form submits straight to payment | A dedicated review screen showing exactly what will be filed, the fee, and the appeal date | flow-map `[O]` |

### Honesty note on rows 17 and 3

Our journey has zero CAPTCHAs and zero OTPs **because it does not file anything with the government**. That is not a fair like-for-like win and this document will not present it as one. The defensible claim is narrower: *the work of understanding and composing a request should not sit behind three authentication challenges*, and in our journey it does not. Filing for real would still require the portal's own controls. Recorded also as friction F-A8's caveat.

---

## 2. The current journey, as observed

Condensed from `authenticated-flow-map.md`. `[O]` unless marked.

```
Home
 └─> Submit Request
      └─> Guidelines wall — 22 bullets, mandatory checkbox
           (navigating directly to the form URL bypassed this gate entirely)
           └─> Email + Mobile + CAPTCHA  ──> OTP dispatched
                └─> OTP screen           ← going BACK here later = browser error page
                     └─> THE FORM: 40 inputs, one screen, no progress, no save
                          ├─ decide: which of 96 ministries?
                          ├─ decide: which of N public authorities? (183 for Railways)
                          ├─ or: search — but only institutional names work
                          ├─ disclose: gender / rural-urban / literacy / education
                          ├─ decide: BPL? → reveals the ₹10 fee, relabels the button
                          ├─ compose: ≤3000 chars, no counter, restricted charset
                          │           enforced only at submit
                          └─ solve: a SECOND CAPTCHA
                               └─> alert("Your request will be filed with …")  [OK only]
                                    └─> ═══ Make Payment ═══  NOT OBSERVED — we stopped
```

**Where a citizen can fail, and what it costs:**

| Failure | Cost |
|---|---|
| Describes the problem in the search box | Told no authority exists; likely abandons `[O]` |
| Picks the wrong central authority | Transferred under s.6(3); new registration number; delay `[D]` |
| Picks a state authority | **Application returned, fee not refunded** `[D]` |
| Uses an apostrophe or writes in Hindi | Rejected at submit after composing everything `[O]` |
| Leaves a mandatory field blank | Server round trip; CAPTCHA regenerates `[O]` |
| Presses Back | Journey destroyed; needs a fresh OTP `[O]` |
| Opens it on a phone | Horizontal scrolling across every row of 40 fields `[O]` |

---

## 3. The proposed journey

Designed from the failures above, not from a blank page. Full detail in `information-architecture.md` and `user-flow.md`.

```
/            "What happened?"           ← the citizen's own words, one box
 └─> /clarify   ≤3 questions, each one chosen because it changes the outcome
      ├─> /not-rti   honest verdict + where to actually go   (dead end avoided)
      └─> /request   what you're asking for + the drafted text, editable,
      │              validated live against the real 3000-char and charset rules
      └─> /authority  ONE recommendation + why + ranked alternatives + full search
      │              + state/UT warning: "returned without refund"
      └─> /review     exactly what will be filed · fee · the date you may appeal
           └─> /filed/[ref]  simulated reference + tracking + the exact text
                             to file for real on the actual portal
```

### The inversion that matters

RTI Online asks **"which office?"** *before* it asks **"what do you want?"**. That ordering is what produces the observed dead end — the citizen must name an institution before the system will engage with their problem.

We reverse it. The problem comes first; the institution is *derived* from it and shown with reasoning. This is the single most important structural difference, and it is recorded as decision **ED-001** in `evidence-to-design.md`.

---

## 4. What we are deliberately NOT claiming

- **Not** that we are faster to a *filed* RTI. We do not file. We produce a ready-to-file request.
- **Not** that we removed authentication. We removed it from a journey that does not need it.
- **Not** that our authority recommendation is more accurate than a well-informed citizen's own choice. It is a *best match* over a curated taxonomy, always shown with reasoning, always editable, and always backed by full search.
- **Not** that we cover every RTI subject. The supported domains are enumerated in `mvp-spec.md`; everything else must fail helpfully and say so.

---

## 5. How each number above will be verified

| Claim | Verification |
|---|---|
| Screens, steps, fields, decisions | Counted against the built routes in `docs/agent-memory/17-route-inventory.md`; asserted in an end-to-end test |
| 0 points requiring institutional knowledge | Scenario evaluations in `docs/evals/citizen-scenarios.md` — a participant reaches a recommendation without typing any authority's formal name |
| Validation before any network call | Unit tests on the pure rules module; e2e test asserting no network request on validation failure |
| 360 px, 0 horizontal overflow | Playwright viewport matrix at 360/390/430/768/1024/1440 |
| 0 touch targets under 44 px | Automated measurement in the e2e suite |
| 100% labelled inputs, axe clean | axe-core per route, zero serious/critical as the gate |
| Appeal date shown as a date | Unit test on `appealAvailableFrom`, plus an e2e assertion on the review screen |

Results are recorded in `docs/agent-memory/11-evaluation-log.md` against the baseline row already captured there. **No row in §1 may be presented as achieved until its verification has run.**
