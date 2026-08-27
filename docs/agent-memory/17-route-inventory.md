# 17: Route Inventory (our application)

**Status: Phase 3 in progress: `/` is built and verified; the rest are stubs.** The table below is the **frozen** set from `docs/design/mvp-spec.md` v1.0 and `docs/design/information-architecture.md`. As each route is built, the agent building it fills in its real row and **may not mark it complete without evidence**.

Adding a route that is not in this table requires an evidence chain in `docs/design/evidence-to-design.md` first.

| Path | Purpose | Entry | Citizen's goal | Data | Mock/Live | A11y | Tests | Status |
|---|---|---|---|---|---|---|---|---|
| `/` | **What happened?**: the problem in the citizen's own words | Public URL | "Say what I want to know" | reasoning engine | Deterministic, no network | Labelled textarea, error via `aria-describedby`, `aria-invalid`, live region, 0 overflow @360px | 8 component tests | **Built + verified** |
| `/clarify` | ≤3 clarifying questions, then the suitability verdict | from `/` | "Answer a couple of things so you can help" | taxonomy + refine | Deterministic, no network | `fieldset`/`legend`, labelled radiogroup, progress announced, escape answer on every question | 9 component + 8 refine tests | **Built + verified** |
| `/not-rti` | Honest verdict + where to actually go | from `/clarify` | "Don't waste my ₹10 and 30 days" | suitability rules | Deterministic | headings, no dead end, override available, axe + contrast clean | 2 e2e | **Built + verified** |
| `/request` | Information types + editable draft + live validation | from `/clarify` | "Ask it properly" | templates + character rules | Deterministic, no network | labelled textarea, live count, named bad characters, `aria-invalid`, axe clean | 12 compose + 6 journey | **Built + verified** |
| `/authority` | Recommendation + reasoning + alternatives + search + state warning | from `/request` | "Send it to the right place" | 2,904-name dataset | **Real names**, deterministic ranking | labelled search, `aria-expanded`, `aria-pressed`, live region, axe clean | 20 authority + 5 journey | **Built + verified** |
| `/review` | What will be filed · fee · appeal date | from `/authority` | "Check before I commit" | rules module | Real rules + labelled mock boundary | sectioned, edit affordances, `aria-live` fee, axe + contrast clean | e2e full path | **Built + verified** |
| `/filed/[ref]` | Simulated reference + timeline + the exact text to file for real | from `/review` | "What happens now?" | mock application | **Simulated: labelled throughout** | ordered list timeline, copy fallback, axe + contrast clean | e2e full path | **Built + verified** |
| `/about` | What is real, what is simulated, not a government service | every screen | "Can I trust this?" | authority dataset count | - | headings, definition lists, axe + contrast clean | 1 e2e | **Built + verified** |

Six routes in the happy path; eight in total.

Every route must satisfy the non-negotiable accessibility criteria in `06-ux-system.md` and the global rules in `information-architecture.md` before its status may read anything other than "Not built" or "In progress".
