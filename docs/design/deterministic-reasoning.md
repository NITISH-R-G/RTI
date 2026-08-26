# Deterministic reasoning — architecture

**Status:** Phase 2.5, validated 2026-08-26 · **Code:** `src/reasoning/` · **Tests:** `test/corpus.test.js` · **Harnesses:** `scripts/evaluate.js`, `scripts/holdout.js`

No network. No LLM. No API key. No global mutable state. No UI imports. Same input → same output, always.

---

## The pipeline

```
raw citizen input
  │
  ├─ 1  normalise      lowercase · strip punctuation · expand contractions (hasn't → has not)
  │                    · expand abbreviations (pf → provident fund, itr → income tax return)
  │
  ├─ 2  score domains  strong +5 · weak +2 · fuzzy +3 · negative −4
  │                    cross-domain-only claims capped at 2
  │
  ├─ 3  not-RTI gates  opinion · third-party data · grievance · action-seeking
  │
  ├─ 4  state gate     state signals → never route centrally; warn about the fee
  │
  ├─ 5  confidence     0.35 × strength + 0.65 × margin   → band high/medium/low
  │
  └─ 6  decide         contested or low confidence or no problem described → ASK
                       otherwise → supported, with authorities + reasoning
```

Every run returns a `trace` naming the stage that decided and the score for each domain. **There is no step whose behaviour cannot be inspected.**

## The result contract

```
classification         supported | ambiguous | unsupported | not_rti
domain                 domain id | null
confidence             0..1
confidence_band        high (≥0.7) | medium (≥0.4) | low
next_action            continue | clarify | explain_limit
candidate_authorities  [{ name, reason }]   — names VERBATIM from the captured dataset
reasoning              plain-language, user-facing
required_questions     [{ id, text, options }]
information_types      [string]
warnings               [string]             — e.g. the state no-refund warning
trace                  { normalised, stages[], scores[] }
```

Confidence is never silently promoted: the band is derived from the number, and a test asserts they agree.

## Why scoring, not `if (input.includes(...))`

Domains are **data** (`src/reasoning/taxonomy.js`); the pipeline is **generic**. Adding a sixth domain means adding a record, not editing control flow. The scoring layer is deliberately small — four weights and one cap — because the corpus, not cleverness, is what tells us whether it works.

## Domain boundaries

| Domain | Anchors (strong) | Pulled away by (negative) |
|---|---|---|
| pension | pension, pensioner, ppo, superannuation, gratuity, commutation | provident, epf, passport, train, railway, tax |
| provident_fund | provident fund, epf, epfo, pf, uan, eps | passport, train, railway, income tax |
| passport | passport, psprt, visa, psk, passport seva | pension, provident, train, railway, income tax |
| railways | train, railway, rail, irctc, pnr, ticket | pension, passport, income tax, provident |
| income_tax | income tax, itr, tds, assessment year, tax refund | pension, passport, train, railway, provident |

**Cross-domain words** — `refund`, `status`, `delayed`, `pending`, `money`, `claim`, `not received` — may support a domain but can never establish one. A domain claimed *only* by these is capped at 2 points and marked non-distinctive.

## Supported language patterns

- Plain problem statements: *"my pension has not been paid"*, *"train refund not received"*.
- Contractions: *"pension hasn't come"* → normalised to *"has not"*.
- Abbreviations: `pf`, `epf`, `epfo`, `eps`, `itr`, `tds`, `irctc`, `psprt`.
- Typos, via bounded Levenshtein at token level (≤1 edit for short keywords, ≤2 for ≥8 characters): *"pention has nt been paid sinc marchh"* → pension.
- Single words: *"passport"* → accepted, clarification carries the load.
- Very long input: clipped at 5,000 characters for processing; the citizen's text is never silently truncated in the UI.

## Ambiguity behaviour

The system asks rather than guesses when **any** of these hold:

1. **Contested** — two or more domains score within 2 points of each other with distinctive evidence. Both are named; the leading candidate is still reported so the citizen sees what we suspect.
2. **Low confidence** — below 0.4.
3. **No distinctive evidence** — only cross-domain words matched.
4. **Topic without a problem** — a domain keyword appears but nothing describes an issue (*"pensioner association meeting minutes"*). We know the subject, not the need.
5. **State signal alongside a domain** — *"old age pension"* could be central or state. Downgraded to clarification **with the fee warning**, never routed confidently.

## Unsupported behaviour

Never a flat refusal. Three distinct honest outcomes:

- **State subject** → no central authority proposed, plus the warning that the central portal returns these and **the fee is not refunded**.
- **Out of scope but central** (e.g. ISRO) → says so, offers the full 2,904-name search and an explanation of what a good request looks like.
- **No signal at all** → asks for more, naming the five domains covered in depth.

## Fabrication is impossible by construction

Authority names live only in the taxonomy, are copied verbatim from `docs/research/rti-online/public-authorities.json`, and a test asserts every returned name is a member of that set. There is no code path that can synthesise a name.

## Known weaknesses — recorded, not hidden

1. **Coverage is five domains.** Anything else reaches the honest-failure path. This is by design, but it means most real RTI subjects are not classified.
2. **Keyword and edit-distance matching has no semantics.** *"my retirement money never came"* leans on `retirement`; a phrasing that avoids every anchor word will fall to clarification. Safe, but blunt.
3. **English-centric.** Devanagari input normalises to nothing and lands on "no signal". Hinglish works only where Latin-script keywords survive. Hindi is FUTURE, not MVP.
4. **State detection is keyword-based** and will miss state subjects phrased without a listed word.
5. **`old age` is treated as a state signal**, which will misfire on a central pensioner who happens to write "old age". It asks rather than misroutes, so the failure is safe.
6. **The corpus was written by the same agent that built the classifier.** Corpus-first ordering and a held-out set mitigate this, but not completely. A future session should add inputs from a source outside this project.
7. **Confidence is a heuristic**, not a probability. It is shown to the citizen only as words, never as a number.

## Extending it

Add a domain: append a record to `DOMAINS` with strong/weak/fuzzy/negative vocabulary, authorities (verbatim from the dataset), information types and clarifying questions. Add corpus cases **first**. Re-run `node scripts/evaluate.js`. Do not touch the pipeline.
