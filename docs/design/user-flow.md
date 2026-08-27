# User Flow: every transition

**Status:** Phase 2, frozen with `mvp-spec.md` v1.0 · 2026-08-26

**Three rules this document exists to enforce:**
1. **No dead buttons.** Every control below has a defined system response.
2. **No undefined transitions.** Every state has a defined next state, failure path and recovery path.
3. **No "and then it figures it out" placeholders.** Every decision point names the deterministic mechanism that resolves it.

---

## T-01: Landing → Clarification

| | |
|---|---|
| **Current state** | `/`, empty or example-filled textarea |
| **User action** | Types a problem, presses **Continue** |
| **System response** | `classify(problem)` runs locally: normalise → tokenise → match against domain keywords, synonyms and known misspellings → score → select domain, or `state-subject`, or `not-rti`, or `out-of-coverage`. Selects up to 3 clarifying questions whose answers would change the outcome |
| **Validation** | Non-empty after trim; ≥15 characters advisory (soft); very long → offer a trim, never silent truncation |
| **Failure path** | Empty → inline error on the textarea, focus retained, nothing lost. Too short → advisory message, **Continue still works** |
| **Recovery** | Text is never cleared. The citizen edits in place |
| **Next state** | `/clarify` |

---

## T-02: Clarification → verdict

| | |
|---|---|
| **Current state** | `/clarify`, question *n* of ≤3 |
| **User action** | Chooses an option, or **"I'm not sure"**, or **Back** |
| **System response** | Records the answer, re-scores, and either asks the next question or resolves the verdict. "I'm not sure" is a first-class answer: it widens the candidate set rather than blocking |
| **Validation** | None can fail: every question has an escape answer |
| **Failure path** | If answers leave the domain ambiguous after 3 questions, the verdict is `out-of-coverage`. **The system does not ask a fourth question and does not guess** |
| **Recovery** | Back re-opens the previous question with the earlier answer selected |
| **Next state** | `suitable`/`needs-reframing` → `/request` · `not-rti`/`state-subject` → `/not-rti` · `out-of-coverage` → `/request` un-assisted |

**Deterministic mechanism:** a scored match over the curated taxonomy. No model, no probability shown to the citizen.

---

## T-03: Not-RTI → onward

| | |
|---|---|
| **Current state** | `/not-rti` |
| **User action** | **Go to the suggested route**, or **Continue anyway**, or **Back** |
| **System response** | Suggested route → an external link, opened deliberately with its destination named. Continue anyway → proceeds to `/request` with the verdict retained and shown |
| **Validation** | n/a |
| **Failure path** | None. Both paths lead somewhere |
| **Recovery** | Back returns to `/clarify` with all answers intact |
| **Next state** | External, or `/request` |

**The citizen may always override.** The system states its reasoning and the consequence, then defers.

---

## T-04: Compose the request

| | |
|---|---|
| **Current state** | `/request`, draft composed from template + specifics, or the citizen's own words if out-of-coverage |
| **User action** | Toggles information types, edits the draft, presses **Continue** |
| **System response** | Toggling recomposes the draft **only if the citizen has not manually edited it**; once edited, toggles append a suggested clause and say so rather than overwriting. Every keystroke re-runs local validation |
| **Validation** | `length ≤ 3000` with live remaining count; allowed-character check naming offending characters with a one-tap fix; non-empty |
| **Failure path** | Over-length → count turns to a warning, Continue disabled, **nothing truncated**. Disallowed characters → named inline with a fix offered; Continue disabled until resolved or fixed |
| **Recovery** | "Reset to suggested draft" restores the generated version; the citizen's own original problem text is always still available |
| **Next state** | `/authority` |

**No network call occurs on this screen** (ED-003): asserted by an e2e test.

---

## T-05: Choose the destination

| | |
|---|---|
| **Current state** | `/authority`, one recommendation + ≥2 alternatives + search |
| **User action** | **Use this office**, or selects an alternative, or searches and selects, or **Back** |
| **System response** | Records the chosen authority (verbatim from `public-authorities.json`) and its reasoning. Search runs locally over the bundled dataset: case-insensitive, acronym-tolerant, token-based |
| **Validation** | An authority must be selected. Membership in the real dataset is guaranteed by construction |
| **Failure path** | Search returns nothing → "No match for that. Here's how to describe it differently," plus domain suggestions and the option to go back and re-clarify. **Never a flat refusal** (ED-013) |
| **Recovery** | Back to `/request` preserves the draft exactly, including manual edits |
| **Next state** | `/review` |

**State/UT branch:** if classification indicates a state subject, this screen shows the no-refund warning and the state route **instead of** a central recommendation. "Continue anyway" remains available with the consequence restated.

---

## T-06: Review

| | |
|---|---|
| **Current state** | `/review` |
| **User action** | Sets **BPL yes/no**, uses an **Edit** link, or presses **File this (simulated)** |
| **System response** | BPL recomputes the fee (₹10 / ₹0) from the rules module. Edit links navigate to the owning screen with all other state preserved. File → generates a visibly fake reference, computes the timeline from the 30-day rule |
| **Validation** | BPL must be answered before filing: the fee cannot be left undefined (this is the one place the real portal's conditional disclosure is turned into an explicit question, ED-009) |
| **Failure path** | Unanswered BPL → inline prompt, focus moved to it |
| **Recovery** | Every Edit link is a round trip that loses nothing |
| **Next state** | `/filed/[ref]` |

---

## T-07: Confirmation

| | |
|---|---|
| **Current state** | `/filed/[ref]` |
| **User action** | **Copy the request text**, open the real portal, or **Start another request** |
| **System response** | Copy → clipboard API, visible confirmation, announced. Real portal → external link to `rtionline.gov.in`, destination named, opened deliberately. Start another → explicit confirm, then clears stored state |
| **Validation** | n/a |
| **Failure path** | Clipboard denied → the text is shown pre-selected with manual-copy instructions. **The copy button is never inert** |
| **Recovery** | Reload preserves the result within the session |
| **Next state** | Terminal, or `/` |

---

## T-08: Back navigation, from anywhere

| | |
|---|---|
| **User action** | Browser back, back gesture, or an in-app Back control |
| **System response** | Returns to the previous step with **all state intact** |
| **Failure path** | **None by design.** This is the direct answer to the observed single-use-token error page (ED-008) |
| **Recovery** | n/a: nothing to recover from |

Explicitly tested: complete to `/review`, go back to `/`, forward again, assert every field intact.

---

## T-09: Storage unavailable

| | |
|---|---|
| **Trigger** | `localStorage` throws or returns empty (private window, cleared data, blocked site data) |
| **System response** | The app runs normally for the current page session, in memory. No error is shown unless the citizen actually loses something |
| **Failure path** | On reload, state is gone → the citizen lands on `/` with an explanation, not a broken screen |
| **Recovery** | Restart the journey; nothing was ever sent anywhere, so nothing is inconsistent |

---

## Complete state diagram

```
                    ┌─────────────────────────┐
                    │  /  What happened?      │◄──── start another
                    └───────────┬─────────────┘
                       T-01     │ (local classification)
                    ┌───────────▼─────────────┐
              ┌────►│  /clarify   ≤3 questions│
              │     └───────────┬─────────────┘
              │        T-02     │
              │   ┌─────────────┼──────────────┬────────────────┐
              │   │ suitable    │ not-rti      │ state-subject  │ out-of-coverage
              │   │ needs-refr. │              │                │
              │   │       ┌─────▼──────────────▼─────┐          │
              │   │       │  /not-rti                │          │
              │   │       │  honest verdict + route  │          │
              │   │       └─────┬──────────────┬─────┘          │
              │   │       T-03  │ continue     │ external       │
              │   │             │ anyway       ▼                │
              │   ▼             ▼           (leaves)            │
              │  ┌──────────────────────────────────────────────▼─┐
              │  │  /request   info types + editable draft         │
              │  │             live validation, no network         │
              │  └───────────────────────┬────────────────────────┘
              │              T-04        │
              │  ┌───────────────────────▼────────────────────────┐
              │  │  /authority  recommendation + why + alts        │
              │  │              + search + state warning           │
              │  └───────────────────────┬────────────────────────┘
              │              T-05        │
              │  ┌───────────────────────▼────────────────────────┐
              │  │  /review    text · authority · fee · appeal date│
              │  └───────────────────────┬────────────────────────┘
              │              T-06        │ File this (SIMULATED)
              │  ┌───────────────────────▼────────────────────────┐
              └──┤  /filed/[ref]  fake ref · timeline · copy text  │
        T-08     └─────────────────────────────────────────────────┘
      (back from any state returns with all data intact)

   /about reachable from every screen
```

---

## Control inventory: proof of no dead buttons

| Screen | Control | Response |
|---|---|---|
| `/` | Continue | T-01 |
| `/` | Example ×3 | Fills the textarea, moves focus to the end |
| `/` | About | `/about` |
| `/clarify` | Option | Records, advances |
| `/clarify` | I'm not sure | Records as unknown, widens candidates, advances |
| `/clarify` | Back | Previous question, or `/` |
| `/not-rti` | Suggested route | External, destination named |
| `/not-rti` | Continue anyway | `/request`, verdict retained |
| `/not-rti` | Back | `/clarify` |
| `/request` | Info-type checkbox | Recomposes, or appends if manually edited |
| `/request` | Fix characters | Replaces offenders with allowed equivalents |
| `/request` | Reset draft | Restores the generated version |
| `/request` | Continue | T-04 |
| `/request` | Back | `/clarify` |
| `/authority` | Use this office | T-05 |
| `/authority` | Alternative | Selects it, keeps reasoning visible |
| `/authority` | Search | Local filtered results |
| `/authority` | Back | `/request` |
| `/review` | BPL yes/no | Recomputes the fee |
| `/review` | Edit ×3 | Owning screen, state preserved |
| `/review` | File this (simulated) | T-06 |
| `/filed` | Copy | Clipboard + confirmation, with a manual fallback |
| `/filed` | Open the real portal | External, destination named |
| `/filed` | Start another | Confirms, clears state, `/` |
| every | Skip link | Jumps to `main` |
| every | About | `/about` |

**Zero controls are undefined. Zero transitions are unspecified. Zero decisions are deferred to "AI".**
