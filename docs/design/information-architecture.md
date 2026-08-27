# Information Architecture

**Status:** Phase 2, frozen with `mvp-spec.md` v1.0 · 2026-08-26
Designed from task completion, not aesthetics. Every screen answers one question: *what does the citizen need in order to move forward?*

**Global rules for every screen**

- One primary action. At most one secondary. Nothing else competes.
- Mobile-first single column. No layout tables (ED-006). Minimum 44 px targets. No horizontal overflow at 360 px.
- Landmarks (`header`/`nav`/`main`/`footer`), a skip link, one `h1`, correct heading order (ED-007).
- Every input has an associated `<label>`; every error is tied to its field with `aria-describedby` and announced.
- A persistent, non-dismissible line: **independent prototype, not a government service** (R13).
- Back always works and never destroys work (ED-008).
- No spinner theatre. Everything is local and instant; if something needs a moment, say what it is doing in words.
- No fabricated certainty. Uncertainty is words, never percentages (ED-013).

---

## `/`: What happened?

| | |
|---|---|
| **Purpose** | Accept the citizen's problem in their own words |
| **User goal** | "Say what I want to know, without knowing any of your vocabulary" |
| **Primary action** | Continue |
| **Secondary** | Three one-tap example problems |
| **Shown** | One question; one large textarea; examples; the fee and exemption stated up front (ED-009); the prototype disclosure |
| **Deliberately hidden** | Everything institutional. No ministry, no authority, no RTI jargon, no account, no CAPTCHA |
| **Validation** | Empty/whitespace → "Tell us what happened, in your own words." Under ~15 chars → ask for a little more, do not block hard. Very long → say it is long, offer a trim, never silently truncate (ED-005) |
| **Error states** | Inline, tied to the textarea |
| **Loading** | None: classification is local |
| **Mobile** | Textarea is the first focusable element after the skip link; at least 120 px tall; examples wrap, never scroll sideways |
| **A11y** | Labelled textarea; examples are real `<button>`s, not divs; the disclosure is in a landmark, not a floating overlay |
| **Tests** | S1–S10; empty; 14 chars; 5,000 chars; Devanagari; emoji-only |

**Copy intent:** the first screen must make the citizen think *"I don't need to know how the government is organised: I can just explain what happened."*

---

## `/clarify`: A few questions

| | |
|---|---|
| **Purpose** | Resolve the domain, the information type and the RTI-suitability verdict |
| **User goal** | "Answer a couple of things so you can actually help" |
| **Primary action** | Continue |
| **Secondary** | Back; "I'm not sure" on every question |
| **Shown** | **At most 3** questions, one at a time, each with a short reason for asking |
| **Deliberately hidden** | The taxonomy, scores, matched keywords, any internal reasoning artefact |
| **Validation** | Every question is answerable with "I'm not sure": never a hard block |
| **Error states** | None possible by construction |
| **Loading** | None |
| **Mobile** | Options are full-width tap targets, not a native `<select>` |
| **A11y** | Each question is a labelled `radiogroup` with a `legend`; progress announced ("Question 2 of 3") |
| **Tests** | S1–S9, S11 |

**The rule that governs this screen:** a question may only be asked if its answer changes the outcome: the verdict, the draft, or the authority. If it changes none of them, it is not asked. This is the direct inverse of the observed form, which collects gender, rural/urban status and education level, none of which change anything (ED-010).

**Outcome branches:** `suitable` → `/request` · `needs-reframing` → `/request` with the reframing shown · `not-rti` → `/not-rti` · `out-of-coverage` → `/request` un-assisted, honestly labelled.

---

## `/not-rti`: This may not be an RTI matter

| | |
|---|---|
| **Purpose** | Tell the citizen honestly and send them somewhere useful |
| **User goal** | "Don't waste my ₹10 and 30 days" |
| **Primary action** | The better route (e.g. a public grievance, the state RTI route) |
| **Secondary** | "Continue anyway": with the consequence stated |
| **Shown** | The verdict in one sentence; why; the better route; what RTI *is* for |
| **Deliberately hidden** | Nothing. This screen exists to be transparent |
| **Validation** | n/a |
| **Mobile / A11y** | Standard; the verdict is the `h1` |
| **Tests** | S5 (grievance), S7 (state subject) |

Never a dead end. This screen is the direct answer to the observed *"No such Public Authority available in this portal !"* (ED-013). The citizen may always override and continue: the system does not know better than they do.

---

## `/request`: What you're asking for

| | |
|---|---|
| **Purpose** | Turn the problem into a records-based request the citizen can read, understand and edit |
| **User goal** | "Ask it properly, in words that will actually be answered" |
| **Primary action** | Continue |
| **Secondary** | Back; reset the draft to the generated version |
| **Shown** | Information-type checkboxes for the domain; the **full** draft, never truncated or hidden behind a preview; a plain-language note on why each part is there; live remaining-character count; live restricted-character check |
| **Deliberately hidden** | Templates, domain ids, any internal machinery |
| **Validation** | Live: 3,000-character limit with remaining count (ED-005); the exact allowed set `A-Z a-z 0-9 , . - _ ( ) / @ : & ? \ %` with offending characters **named** and a one-tap fix (ED-004). Empty draft blocks Continue. All local: no network (ED-003) |
| **Error states** | Inline, `aria-describedby`, never destructive |
| **Loading** | None |
| **Mobile** | Draft textarea at least 200 px; the character counter is visible without scrolling past the field |
| **A11y** | Counter announced politely at thresholds (not every keystroke); checkboxes in a `fieldset`/`legend`; edits never move focus |
| **Tests** | S10, S13; 2,900 / 3,000 / 3,100 chars; apostrophe; rupee sign; Devanagari |

The draft asks for **records**, names a period and a subject, and asks for no opinions, reasons or justifications: the three things a CPIO may lawfully refuse. Marked as generated by the app, and editable in place (PD-004).

---

## `/authority`: Where this should go

| | |
|---|---|
| **Purpose** | Propose the destination, show the reasoning, keep the citizen in control |
| **User goal** | "Send it to the right place: and tell me why you think so" |
| **Primary action** | Use this office |
| **Secondary** | Choose an alternative; search all authorities |
| **Shown** | **One** recommendation; one line of reasoning ("this office holds central government pension records"); **at least two** ranked alternatives each with a reason; a search box over all 2,904 real names; the consequence of a wrong choice in plain language |
| **Conditional** | If the likely destination is a **state/UT** body: a prominent warning that the central portal returns these **without refunding the fee** `[D]`, plus the state route. No central authority is proposed in this case |
| **Deliberately hidden** | Ranking scores, keyword matches, the raw 2,904-item list (search only, never dumped) |
| **Validation** | An authority must be chosen to continue. The chosen name must exist verbatim in `public-authorities.json`: impossible to violate, since selection is *from* that file |
| **Error states** | Search with no results → "No match for that. Here's how to describe it differently," plus the domain suggestions. **Never** a flat refusal (ED-013) |
| **Loading** | None: the dataset is bundled |
| **Mobile** | Search results are chunked and keyboard-navigable; the recommendation card is fully readable without horizontal scroll |
| **A11y** | Search is a labelled combobox with correct `aria` semantics and managed focus; alternatives are radio options, not links |
| **Tests** | S1–S4, S7, S12 |

Uncertainty is stated in words at the point of the claim: *"Based on what you described, this may be the right office"*: and when confidence is low the screen leads with alternatives and search rather than a single false answer.

---

## `/review`: Check before you commit

| | |
|---|---|
| **Purpose** | One screen showing exactly what would be filed |
| **User goal** | "Check everything before I commit ₹10 and 30 days" |
| **Primary action** | File this (simulated) |
| **Secondary** | Edit any section: links back to the screen that owns it |
| **Shown** | The final request text; the chosen authority; the fee (₹10, or ₹0 with a BPL certificate) from the rules module **with its citation**; **the date** the citizen becomes free to file a first appeal (filed + 30 days, as a date, not "30 days"); a checklist of what the real portal will additionally ask for: name, address, gender, BPL, a CAPTCHA (ED-014) |
| **Deliberately hidden** | Nothing |
| **Validation** | BPL yes/no is the only input; it changes the fee only |
| **Error states** | n/a |
| **Mobile** | Sections collapse in reading order; the primary action is reachable without hunting |
| **A11y** | Each section is a labelled region; edit links state what they edit ("Edit the request text") |
| **Tests** | S11, S12; fee unit tests; appeal-date unit tests across month/year boundaries |

Adjacent to the primary action, plainly: **filing here is simulated.**

---

## `/filed/[ref]`: Done

| | |
|---|---|
| **Purpose** | Confirm, explain what happens next, hand over the real text |
| **User goal** | "What now?" |
| **Primary action** | Copy the request text |
| **Secondary** | Open the real RTI portal; start another request |
| **Shown** | A **visibly fake** reference (never the real `AAAAA/B/C/DD/EEEEE` format); a plain-language timeline: filed, sent to the officer, reply due by *date*, appeal possible from *date*; the exact request text to file for real |
| **Deliberately hidden** | Nothing |
| **Validation** | n/a |
| **Mobile** | Copy works via the clipboard API with a visible confirmation and a manual-select fallback |
| **A11y** | Timeline is an ordered list, not a decorative graphic; copy confirmation is announced |
| **Tests** | Reference-format assertion; timeline date arithmetic; reload preserves the result within the session |

The simulated nature is stated **on this screen**, next to the reference: not only in a footer.

---

## `/about`: What's real and what's not

Reachable from every screen. Lists what is real (the authority and ministry lists with their capture date, the fee/deadline/character rules and their source), what is simulated (filing, reference, payment, status), and how the guidance is actually produced: deterministic logic in the browser, no language model, nothing transmitted. States that this is an independent prototype, not affiliated with or endorsed by the Government of India, and that it cannot file an RTI.

**Never** implies a model is reasoning when none is (R-13).

---

## Cross-screen state

| Key | Set at | Used by | Survives |
|---|---|---|---|
| `problem` | `/` | all | back/forward, reload within session |
| `answers[]` | `/clarify` | `/request`, `/authority` | same |
| `verdict` | `/clarify` | `/request`, `/not-rti` | same |
| `infoTypes[]` | `/request` | draft composition | same |
| `draft` | `/request` | `/review`, `/filed` | same, including manual edits |
| `authority` | `/authority` | `/review`, `/filed` | same |
| `bpl` | `/review` | fee | same |

Persisted in `localStorage`, wrapped in try/catch, and the app renders correctly when it comes back empty. Nothing leaves the browser (ED-014, PD-009). An explicit "start again" clears it.
