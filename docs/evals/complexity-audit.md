# Complexity audit

**Date:** 2026-08-27 · Phase 4 · Goal: **lower cognitive load**, not fewer routes.

## Decisions the citizen must actually make

| Journey | Decisions demanded |
|---|---|
| **RTI Online (observed)** | 5 unaided: which of 96 ministries · which of up to 183 authorities · gender / rural-urban / literacy / education level · BPL · how to word 3,000 characters |
| **This prototype** | 4, **none unaided**: answer ≤3 clarifying questions (each with "I am not sure") · tick which information you want (pre-selected) · accept or change the proposed office · state whether you would pay the fee |

The count barely moves. **What changes is that every decision arrives with a proposal, a reason, and an escape.** That is the honest claim: not "fewer decisions".

## Screens

Six versus five. **We have one more screen than the baseline and that is fine.** The baseline crams 40 inputs onto one page; we spread ~7 across six. Fewer routes would be a worse product.

## Things examined for removal

| Element | Kept or cut | Reason |
|---|---|---|
| Clarify questions | **Kept, capped at 3** | Each one changes the verdict, draft or authority. A question that changed nothing would be cut |
| Information-type checkboxes | **Kept, pre-selected** | Removing them means an unexplained wall of text; the defaults mean a citizen can ignore them entirely |
| Full draft textarea | **Kept** | Hiding it would make the product a black box, which is the thing we criticise |
| BPL question on review | **Kept** | It is the only way to show the correct fee, and the real portal hides the fee behind exactly this question |
| "What the real portal will also ask you for" | **Kept** | Prepares the citizen without collecting anything |
| Demographic fields | **Cut entirely** | Change nothing about the request, the office or the fee |
| Identity fields | **Cut entirely** | We do not file, so we do not need them |
| A separate suitability screen | **Cut in Phase 2** | Its only content was a verdict the citizen never asked for |
| A separate "choose information type" screen | **Cut in Phase 2** | Choosing and seeing the result are one act |
| Payment step | **Cut** | Nothing is paid |

## Reading load on the first viewport

The landing page carries: heading, one-sentence lede, labelled input, primary button, three examples, the evidence block, the fee notice. The evidence block was **added** in Phase 4, which increases reading load: accepted deliberately, because without it a judge cannot tell why the product exists (fresh-reviewer FR-1). It sits **below** the input and the primary action, so it never delays a citizen who just wants to start.

## Where complexity remains, honestly

1. **Six steps reads as long** before you start. The progress bar mitigates it once moving; measured against a form that needs 985 px of horizontal scrolling, this is the better trade.
2. **The draft is long prose.** Structured further, it would stop being the thing the citizen can paste into the real portal. Kept as-is deliberately.
3. **The authority screen carries a lot**: recommendation, three reasons, provenance, uncertainty note, three actions. It is the most loaded screen in the product. Justified because it is the decision that costs money to get wrong, but it is the first place to look if load needs reducing.
