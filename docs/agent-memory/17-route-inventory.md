# 17 — Route Inventory (our application)

**Status: no routes exist.** The table below is the *planned* set from `docs/design/mvp-spec.md`. As each route is built, the agent building it must fill in its real row — data dependencies, mock/live status, tests, accessibility notes, status — and must not mark it complete without evidence.

| Path | Purpose | Entry point | Citizen's goal | Data | Mock/Live | A11y | Tests | Status |
|---|---|---|---|---|---|---|---|---|
| `/` | Describe your problem in your own words | Direct link, the public URL | "Say what I want to know" | none | — | — | — | **Not built** |
| `/check` | Is this an RTI matter? Verdict + reasoning, or an honest "no, go here instead" | from `/` | "Am I in the right place?" | AI classification | AI + deterministic fallback | — | — | **Not built** |
| `/draft` | The drafted request: shown in full, explained, editable | from `/check` | "Ask it properly" | AI draft + character rules | AI + fallback to the citizen's own words | — | — | **Not built** |
| `/authority` | Which office — one recommendation, reasoning, ranked alternatives, search | from `/draft` | "Send it to the right place" | public-authority dataset | Real names, AI suggestion, deterministic search fallback | — | — | **Not built** |
| `/review` | Exactly what will be filed, the fee, the date you may appeal | from `/authority` | "Check before I commit" | deterministic rules | Real rules | — | — | **Not built** |
| `/filed/[id]` | Simulated filing result: tracking view + the exact text to file for real | from `/review` | "What happens now?" | mock application + timeline | **Simulated** — labelled | — | — | **Not built** |
| `/about` | What is real, what is simulated, and that this is not a government service | footer, persistent banner | "Can I trust this?" | none | — | — | — | **Not built** |

Every route must satisfy the non-negotiable accessibility criteria in `06-ux-system.md` before its status may read anything other than "Not built" or "In progress".
