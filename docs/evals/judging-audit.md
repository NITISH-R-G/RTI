# Judging audit

**Date:** 2026-08-27 · Phase 4. Each criterion is audited against what a judge can actually see, not against what the repository knows.

---

## 1. PROBLEM

**Current evidence.** A reproducible failure captured on the live portal after a human completed its own email and OTP checks: typing `my pension has not been paid` into `Search Public Authority` returns **`No such Public Authority available in this portal !`**, while `Department of Pensions & Pensioners Welfare` sits in a dropdown on the same screen. Supporting: `passport` returns 3 irrelevant results of 4; the authority step sits above any question about what the citizen wants; a state application is **returned without refund of the fee**.

**Strength.** This is not "government websites are complicated". It is a specific, quotable, reproducible refusal of a valid request, with the counter-evidence in the same screenshot.

**Weakness.** It rests on one authenticated session by one person. We have no data on how often citizens phrase searches this way.

**Likely judge question.** *"Is this a real problem or one you found once?"*
**Current answer.** The refusal is reproducible by anyone; the structural cause — authority selection before intent — is visible on the form regardless of phrasing. We do not claim frequency data, because we do not have it.

**Risk.** Low. **Action:** none; do not inflate it into a frequency claim.

---

## 2. WORKING BUILD

**Current evidence.** 104 Playwright tests across desktop and 360 px, including a fresh-session demo path, all five domains, deep-link guards, refresh at every step, and browser back/forward. 78 reasoning + 79 unit/component tests.

**Strength.** The journey completes from a cleared browser with no setup, no key, no account, no network.

**Weakness.** **Not yet deployed to a public URL** — a competition requirement (R7).

**Likely judge question.** *"Can I try it right now?"*
**Current answer.** Locally yes; publicly not yet.

**Risk. HIGH — this is the single largest outstanding competition risk.** **Action:** deploy before submission. It is a static bundle, so any static host works.

---

## 3. USABILITY

**Current evidence, measured against the observed baseline.**

| | RTI Online (observed) | This prototype (verified) |
|---|---|---|
| Fields presented | 40 on one screen | ≤7 across the journey |
| Inputs with a programmatic label | 0 of 40 | 100% |
| Content width needed at 360 px | 985 px (625 px overflow) | 360 px (0 overflow) |
| Controls under 44 px | 30 | 0 |
| Validation | after a server round trip | before any network call |
| Demographic fields | 3 (+4 conditional) | 0 |
| Identity fields | 8 | 0 |
| Screens before you state your problem | 4 | 0 |

**Strength.** Every number is measured, and the baseline column is sourced to the audit rather than asserted.

**Weakness.** No real user testing. All usability evidence is structural.

**Likely judge question.** *"Did you test this with actual citizens?"*
**Current answer.** No — and we say so rather than implying otherwise.

**Risk.** Medium. **Action:** accept and state plainly. Do not manufacture a user-testing claim.

---

## 4. PRODUCT THINKING

**Current evidence and, more importantly, whether a judge can SEE it:**

| Decision | Visible to a judge? |
|---|---|
| Authority comes after the request | **Yes** — screen order, plus the lede "Worked out from what you told us and what you are asking for" |
| Ambiguity asks instead of guessing | **Yes** — "Which of these is your situation about?" with "None of these" |
| Citizens can override | **Yes** — alternatives and full search on the authority screen |
| Social pension routed away from the central portal | **Yes** — and it carries the money consequence |
| Manual search honestly scoped | **Yes** — "Describing your problem here will not work" |
| Unsupported cases not forced into RTI | **Yes** — the not-RTI screen |
| No runtime LLM, by choice | **Yes, since Phase 4** — stated on the authority screen and `/about` |

**Strength.** After the Phase 4 fixes, every one of these is visible in the product, not only in the repository.

**Weakness.** Before Phase 4, four of the seven were invisible on the main path. The fresh-reviewer audit caught that.

**Risk.** Low, now. **Action:** done.

---

## 5. END-TO-END THINKING

**Current evidence.** The journey demonstrates authority routing, request composition, the fee and who is exempt, the consequence of a wrong route, the 30-day clock as a date, mock filing, mock tracking, the state/central boundary, and the privacy boundary — all inside the flow, not in a footnote.

**Strength.** The state-versus-central branch is genuine end-to-end thinking: it recognises when the product should route the citizen **away** from the thing it is built to do.

**Weakness.** Only five subjects. Appeals are out of scope entirely.

**Likely judge question.** *"What happens after they file?"*
**Current answer.** The confirmation shows the 30-day clock and when a free review becomes possible; we do not simulate the appeal itself.

**Risk.** Low. **Action:** none.

---

## 6. HONESTY

**Audited claims across UI, `/about`, README and docs:**

| Claim to check | Status |
|---|---|
| No government affiliation implied | Persistent banner + footer + `/about`. No emblem, no government mark | **Clean** |
| No fake real filing | "Demo confirmation", "has not submitted anything", reference shown beside the real format | **Clean** |
| No fake payment | No payment screen; review states no payment is taken | **Clean** |
| No fabricated authority data | Names selected from the captured list; asserted in tests | **Clean** |
| No fabricated descriptions | Search says "We do not hold a description of what this office covers" where we have none | **Clean** |
| No AI / runtime-model claim | `/about` states there is none; an e2e test asserts the words never appear | **Clean** |
| No fake evaluation claim | Blind corpus committed before running; original 93.6% preserved | **Clean** |
| No screen-reader claim | KI-015 records that none happened; nothing in the product claims one | **Clean** |
| No independent-testing claim | The fresh-reviewer audit opens by stating I built the product and cannot be a fresh reviewer | **Clean** |

**Risk.** Low — this is the project's strongest dimension. **Action:** keep the claim inventory current if any submission copy is written later.

---

## Ranked risks

| # | Risk | Severity | Action |
|---|---|---|---|
| 1 | **Not deployed to a public URL** | **High** | Deploy before submission |
| 2 | `19-codex-contribution-log.md` is empty — it is the R1 compliance evidence | **High** | Must be filled by real Codex work |
| 3 | No real user testing | Medium | Accept, state plainly |
| 4 | No real screen-reader test | Medium | Attempt if feasible; never claim otherwise |
| 5 | Five domains only | Medium | By design; the honest-failure path covers the rest |
| 6 | Judge may not open `/about` | Low, now | Fixed — the evidence is on the landing page |
