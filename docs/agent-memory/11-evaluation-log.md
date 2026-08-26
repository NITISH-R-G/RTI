# 11 — Evaluation Log

Every entry: date · version · scenario · input · expected · actual · pass/fail · failure reason · fix · re-test result.
"It looked good" is not an evaluation. Product evaluations (steps, confusion, clarity) belong here alongside AI evaluations.

---

## 2026-08-26 — Session 1 — Baseline measurement of the existing portal

Not an evaluation of our product (none exists). This is the **benchmark** every later claim of improvement is measured against. Method and evidence: `03-rti-site-inventory.md`.

| Metric | RTI Online (measured / documented) | Evidence |
|---|---|---|
| Steps from home to first typing your actual question | 4 (home, guidelines wall, email+mobile+CAPTCHA, OTP) | [O] |
| Unaided decisions before submitting | Authority (1 of ~2,900), RTI applicability, wording, BPL, payment mode | [O]/[D] |
| Public authorities in one flat list | 2,904 unique (3,114 rows) | [O] |
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

## Pending evaluations (to run once the product exists)

- The AI evaluation case set in `09-ai-behavior.md`.
- Task completion and step count for the primary journey, against the baseline above.
- Mobile usability at 360 px.
- Recovery from a wrong AI interpretation.
- The AI-unavailable fallback journey.
