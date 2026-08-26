# Demo Journey — under two minutes

**Status:** Phase 2, frozen with `mvp-spec.md` v1.0 · 2026-08-26
**Constraint:** a judge must understand the problem, see it solved, and trust the claims — in under two minutes.

**Governing rule: do not exaggerate the old system.** Every "before" moment uses the exact observed behaviour, reproducible on the live portal by anyone watching. Overstating it would be both dishonest and unnecessary — the real behaviour is strong enough.

---

## Minute 1 — the problem, through one citizen

### 0:00–0:15 · The citizen

> A retired government employee has not received her pension for three months. She wants to know why. She has a legal right to ask — the RTI Act guarantees it. She has never heard the phrase "public authority".

One sentence, one person, no product yet.

### 0:15–0:45 · The current experience *(live, or a recorded capture of the real portal)*

Show the real `rtionline.gov.in` request form — the one behind the OTP wall — and type into its **Search Public Authority** box exactly what she would say:

```
my pension has not been paid
```

The portal answers:

```
No such Public Authority available in this portal !
```

Then scroll to the ministry dropdown on the same screen and show:

```
Department of Pensions & Pensioners Welfare
```

**Say plainly:** the system contains the office she needs. It refused her because she described her problem instead of naming an institution.

*Evidence: `[O]`, authenticated audit 2026-08-26, `docs/research/rti-online/authenticated-friction-map.md` F-A1. Reproducible.*

Optional 5-second reinforcement if time allows — one line, no dwelling: this form has **40 inputs**, **0 `<label>` elements**, and needs **985 px** of width on a 360 px phone.

### 0:45–1:00 · The reframing

> Citizens describe **problems**. Government is organised by **institutions**. Nothing bridges the two — so the citizen is asked to do the translation, before they can get help.

That sentence is the product thesis (PD-010).

---

## Minute 2 — our experience, then the substance

### 1:00–1:35 · The same problem, our journey

Same sentence. Nothing rehearsed, nothing special-cased.

| Step | On screen |
|---|---|
| **What happened?** | She types `my pension has not been paid` |
| **A few questions** | At most three, in plain language, each with a reason for asking. Every one has "I'm not sure" |
| **What you're asking for** | Records-based options — current status, reason for the delay, processing and approval history, expected payment date. The full drafted request, visible and editable, with a live character count and live character-set checking |
| **Where this should go** | **Department of Pensions & Pensioners Welfare**, with the reason shown, two ranked alternatives, and full search underneath. "Based on what you described, this may be the right office" |
| **Review** | The exact text · the office · **₹10** (₹0 if BPL) · **the date** she may appeal |
| **Done** | A clearly-marked simulated reference, a plain-language timeline, and the exact text to file for real on the actual portal |

**The line to land it:** she never typed an institution's name, and never had to know one existed.

### 1:35–2:00 · Why it holds up

Six claims, fast, each defensible:

1. **Why this problem.** Not chosen from a brainstorm — chosen from a reproducible failure we observed on the live portal, after authenticating legitimately and stopping short of submission.
2. **How it works.** No language model at runtime. A curated domain taxonomy, a structured interview, authored templates, and ranked search over the **real 2,904-name authority list captured from the portal itself**. Authority names are *selected from* that dataset, so recommending an office that does not exist is impossible by construction.
3. **Honest failure.** Out-of-coverage input never dead-ends. A state-subject problem gets a warning that the central portal returns those **without refunding the fee** — the most expensive documented mistake a citizen can make.
4. **What is mocked.** Filing, the reference number, payment, status. Stated in the product, not just the README. Nothing is ever sent to a government system.
5. **Codex.** The build is Codex-assisted, logged per commit in `docs/agent-memory/19-codex-contribution-log.md` and checkable against `git log`.
6. **Accessibility and mobile.** 360 px with zero horizontal overflow, 44 px targets, every input labelled, axe clean — against a baseline of 985 px, 30 sub-44 px targets and zero labels.

---

## Demo integrity rules

- **Use the real observed strings.** `my pension has not been paid` → `No such Public Authority available in this portal !`. Do not paraphrase either.
- **Do not stage a worse version of the portal** than the one that exists. No invented error messages, no exaggerated step counts.
- **Do not claim we file RTIs.** We produce a ready-to-file request.
- **Do not imply AI reasoning.** If asked how it works, the answer is a taxonomy and rules, and that is a strength: zero hallucination, zero latency, zero cost, and nothing the citizen types leaves their browser.
- **Show a failure case if there is time.** A product that admits what it does not cover is more credible than one that appears to know everything.

## If the live portal is unavailable during the demo

Fall back to the captured evidence in `docs/research/rti-online/authenticated-friction-map.md` (F-A1), reading the observed input and result verbatim and saying they were captured on 2026-08-26. **Do not re-enact the failure from memory or approximate the wording.**

## Pre-demo checklist

- [ ] Public URL opens with no access request, on a fresh session
- [ ] The pension journey completes end to end
- [ ] Runs from a clean state twice in a row without manual repair
- [ ] Works at 360 px
- [ ] No console errors
- [ ] The simulated reference is visibly not a real registration number
- [ ] `/about` is reachable and current
- [ ] The state-subject warning fires for the road-repair input
- [ ] Everything committed and pushed
