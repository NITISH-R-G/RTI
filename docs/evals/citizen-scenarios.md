# Citizen evaluation scenarios

**Status:** Phase 2, frozen with `mvp-spec.md` v1.0 · 2026-08-26
These scenarios are the **basis for implementation tests**, not a wish list. Each becomes a deterministic fixture. Results are logged in `docs/agent-memory/11-evaluation-log.md` with date, version, input, expected, actual, pass/fail, fix and re-test.

**Grading rule.** "The answer looked good" is not a result. Every scenario has explicit failure conditions, and a scenario fails if **any** of them occurs.

**Universal failure conditions — these fail every scenario:**
- A dead end (a refusal with no onward route). This is the observed portal behaviour we exist to eliminate `[O]`.
- An authority name rendered that is not present verbatim in `public-authorities.json`.
- A fee, deadline or section number stated anywhere other than by the rules module.
- Any implication that a language model is reasoning (R-13).
- A confidence percentage shown to the citizen.
- Any network request during classification, drafting or validation.
- Loss of the citizen's typed text at any point.

---

## S1 — Pension not paid *(the founding case — permanent regression test)*

**Input:** `my pension has not been paid`
*(the exact string that produced `No such Public Authority available in this portal !` on the real portal `[O]`)*

- **Expected system behaviour:** classified to the **pension** domain. Asks at most 3 clarifying questions — likely: central-government pensioner vs EPS/private; how long since the last payment; whether they have a PPO number.
- **Expected authority result:** `Department of Pensions & Pensioners Welfare` for a central government pensioner; `Employees Provident Fund Organisation` for an EPS pension. Both verbatim from the dataset. At least two alternatives offered.
- **Expected clarification:** each question stated in plain language with a reason for asking; "I'm not sure" available on every one.
- **Expected RTI suitability:** `suitable` — the citizen is asking for records (status, processing history, reason recorded on file), not for the pension itself to be paid.
- **Failure conditions:** any dead end · asking for an institutional name · a recommendation with no reasoning · more than 3 questions · needing the phrase "Department of Pensions" to be typed.

---

## S2 — Provident fund *(the control case)*

**Input:** `my PF withdrawal has been stuck since March and nobody replies`

- **Expected behaviour:** classified to **provident fund**. Note this is the domain where the *real portal's search already works* — so the value we add here is ordering and guidance, not search quality.
- **Expected authority:** `Employees Provident Fund Organisation`.
- **Expected suitability:** `suitable` — but the drafted request must ask for **records** (claim status, processing dates, reasons recorded), never "please release my money", which is a grievance.
- **Failure conditions:** a draft that requests action rather than records · misclassification to pension.

---

## S3 — Passport *(the precision case)*

**Input:** `applied for passport renewal two months ago, still showing under review`

- **Expected behaviour:** classified to **passport**.
- **Expected authority:** `MEA - Consular, Passport & Visa Division (CPV)`.
- **Expected result quality:** the recommendation must be relevant — contrast with the real portal, where `passport` also returned `Pasteur Institute of India`, `Punjab & Sind Bank` and `UPASI Tea Research Foundation` `[O]`.
- **Failure conditions:** any of those three irrelevant bodies appearing in our top results · a generic MEA suggestion with no reasoning.

---

## S4 — Railways *(the cascade case)*

**Input:** `train was cancelled and my refund never came`

- **Expected behaviour:** classified to **railways**; clarification narrows toward the relevant railway body.
- **Expected authority:** a Railways authority verbatim from the dataset, with reasoning. Alternatives offered, because the real cascade has **183** options and honest narrowing may not reach one answer.
- **Expected suitability:** `suitable` for refund *records*; the draft must not demand the refund.
- **Failure conditions:** presenting the 183-item list raw · claiming certainty about a specific division without a basis · a dead end when narrowing is impossible.

---

## S5 — Non-RTI complaint

**Input:** `the officer in my area is rude and takes bribes`

- **Expected behaviour:** verdict `not-rti` → `/not-rti`.
- **Expected authority result:** **none proposed.**
- **Expected clarification:** an explanation that RTI obtains *records*, not action or investigation, and a pointer to the appropriate grievance route.
- **Failure conditions:** proposing any authority · drafting a request · a bare refusal with no onward route · moralising at the citizen.

---

## S6 — Insufficient information

**Input:** `I need information`

- **Expected behaviour:** asks for more detail without blocking; if still unresolvable after clarification, verdict `out-of-coverage`.
- **Expected authority result:** none proposed; the citizen reaches `/authority` with full search and an explanation of what makes a good RTI request.
- **Failure conditions:** guessing a domain · proposing an authority on no evidence · a hard block that prevents progress.

---

## S7 — Unsupported domain / state subject *(highest-value failure case)*

**Input:** `the road outside my house has not been repaired for two years`

- **Expected behaviour:** detected as a **state subject**. **No central authority proposed.**
- **Expected result:** a prominent warning, built from `[D]` evidence, that the central portal **returns applications for state public authorities without refunding the fee**, plus a pointer to the citizen's state RTI route.
- **Expected suitability:** may be a valid RTI — but not through the central portal.
- **Failure conditions:** proposing any central authority · omitting the no-refund warning · treating it as simply unsupported without explaining the money at stake.

*This scenario protects the citizen from the single most expensive documented mistake on the real portal.*

---

## S8 — Typo-heavy input

**Input:** `my pention has nt been paid sinc marchh`

- **Expected behaviour:** classified to **pension** despite the misspellings (the taxonomy carries common misspellings and synonyms).
- **Expected authority:** as S1.
- **Failure conditions:** falling through to `out-of-coverage` on spelling alone · correcting the citizen's spelling in a way that changes their meaning.

---

## S9 — Very short input

**Input:** `passport`

- **Expected behaviour:** accepted; advisory prompt for more detail but **Continue still works**; clarification carries the load.
- **Expected authority:** the passport authority, once clarification establishes what records are wanted.
- **Failure conditions:** a hard block on length · proceeding to a draft with no idea what the citizen wants.

---

## S10 — Very long input

**Input:** ~5,000 characters of narrative pension history.

- **Expected behaviour:** accepted without crashing; the citizen is told it is long and offered a trim; **nothing silently truncated**. The generated draft respects the 3,000-character limit with a live remaining count.
- **Failure conditions:** silent truncation (the observed portal behaviour, `[O]`) · a crash · a draft exceeding 3,000 characters.

---

## S11 — The citizen changes their mind

**Steps:** complete to `/review`, go back to `/`, change the problem text, move forward again.

- **Expected behaviour:** every step reversible; earlier answers preserved and re-shown; changing the problem re-runs classification and says clearly that the draft and authority were updated.
- **Failure conditions:** any loss of typed text · a browser error page (the observed single-use-token failure, `[O]`) · stale draft silently retained after the problem changed.

---

## S12 — The citizen picks a different authority

**Steps:** at `/authority`, reject the recommendation, search, and select a different real authority.

- **Expected behaviour:** the override is accepted without argument; the choice carries through to `/review` and `/filed`; the draft is untouched.
- **Failure conditions:** the system overriding the citizen · losing the draft · the search failing to find a name known to be in the dataset.

---

## S13 — Restricted characters

**Input:** a draft containing `don't`, `#`, `₹500`, `"quoted"`, and a Devanagari phrase.

- **Expected behaviour:** each offending character **named** inline as the citizen types, with a one-tap fix mapping common offenders to allowed equivalents. Continue disabled until resolved.
- **Expected result:** the citizen learns at keystroke time, not after composing 3,000 characters `[O]`.
- **Failure conditions:** discovering the problem only at the end · a fix that introduces another disallowed character · silently deleting the citizen's characters.

---

## S14 — Mobile viewport

**Steps:** run the entire journey at 360, 390 and 430 px.

- **Expected behaviour:** zero horizontal overflow; all touch targets ≥44 px; no clipped controls; labels visible with their fields.
- **Baseline for contrast:** the real form needs **985 px** at a 360 px constraint — 625 px of overflow, 32 controls off-screen, 30 targets under 44 px `[O]`.
- **Failure conditions:** any horizontal overflow · any target under 44 px · any control unreachable.

---

## S15 — Keyboard-only navigation

**Steps:** complete the entire journey using only the keyboard, with a screen reader active.

- **Expected behaviour:** skip link works; focus order matches reading order; focus always visible; every input has an associated label; errors announced and tied to their field; no keyboard traps; the character counter announced politely rather than on every keystroke.
- **Baseline for contrast:** the real form has **0 `<label>` elements for 40 inputs**, no landmarks, and delivers validation as a modal dialog `[O]`.
- **Failure conditions:** any unlabelled input · any keyboard trap · focus lost after an edit · axe reporting a serious or critical violation.

---

## Coverage reporting

After each evaluation run, record in `11-evaluation-log.md`:

- Scenarios passed / total.
- **Taxonomy coverage:** the proportion of scenario inputs the domain taxonomy actually classified, versus those that reached `out-of-coverage`. This number is **reported, not hidden** — a low figure is a finding about the approach (R-02), not something to bury.
- Every failure with its cause and fix, and the re-test result.
